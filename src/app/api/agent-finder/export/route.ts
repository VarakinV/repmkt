import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";
import { verifyRecaptcha } from "@/lib/recaptcha";

const s3 = new S3Client({
  region: "auto",
  endpoint: env.r2S3Endpoint,
  credentials: {
    accessKeyId: env.r2AccessKeyId,
    secretAccessKey: env.r2SecretAccessKey,
  },
});

async function uploadToR2(csv: string, filename: string): Promise<string> {
  const key = `agent-finder/${Date.now()}-${filename}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: env.r2BucketName,
      Key: key,
      Body: csv,
      ContentType: "text/csv; charset=utf-8",
      ContentDisposition: `attachment; filename="${filename}"`,
    })
  );
  return `${env.r2PublicUrl}/${key}`;
}

async function ghlUpsertContact(
  firstName: string,
  email: string,
  csvLink: string
): Promise<string> {
  const res = await fetch(`${env.ghlApiBase}/contacts/upsert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ghlApiKey}`,
      Version: env.ghlApiVersion,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      email,
      locationId: env.ghlLocationId,
      customFields: [
        { key: "agent_finder_csv_link", field_value: csvLink },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL upsert failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.contact?.id ?? "";
}

async function ghlAddTag(contactId: string): Promise<void> {
  const res = await fetch(`${env.ghlApiBase}/contacts/${contactId}/tags`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.ghlApiKey}`,
      Version: env.ghlApiVersion,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags: ["used agent finder tool"] }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`GHL tag failed (${res.status}): ${text}`);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, email, csv, filename, recaptchaToken } = body as {
      firstName: string;
      email: string;
      csv: string;
      filename: string;
      recaptchaToken?: string;
    };

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA token is required." },
        { status: 400 }
      );
    }
    const captcha = await verifyRecaptcha(recaptchaToken);
    if (!captcha.success) {
      return NextResponse.json(
        { error: captcha.error || "reCAPTCHA verification failed." },
        { status: 403 }
      );
    }

    if (!firstName?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!csv || !filename) {
      return NextResponse.json(
        { error: "CSV data is required." },
        { status: 400 }
      );
    }

    // 1. Upload CSV to R2
    const downloadUrl = await uploadToR2(csv, filename);

    // 2. Upsert contact in GHL
    const contactId = await ghlUpsertContact(
      firstName.trim(),
      email.trim(),
      downloadUrl
    );

    // 3. Apply tag in GHL
    if (contactId) {
      await ghlAddTag(contactId);
    }

    return NextResponse.json({ downloadUrl });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json(
      { error: "Export failed. Please try again." },
      { status: 500 }
    );
  }
}

