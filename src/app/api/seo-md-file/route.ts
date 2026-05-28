import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { verifyRecaptcha } from "@/lib/recaptcha";

type LeadRequestBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  businessName?: unknown;
  recaptchaToken?: unknown;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getContactId(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  if (isRecord(payload.contact) && typeof payload.contact.id === "string") {
    return payload.contact.id;
  }

  if (typeof payload.id === "string") {
    return payload.id;
  }

  if (typeof payload.contactId === "string") {
    return payload.contactId;
  }

  return null;
}

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: LeadRequestBody;

  try {
    body = (await request.json()) as LeadRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email).toLowerCase();
  const businessName = clean(body.businessName);
  const recaptchaToken = clean(body.recaptchaToken);

  if (!firstName || !lastName || !email || !businessName) {
    return NextResponse.json({ error: "Please complete all form fields." }, { status: 400 });
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA token is required." }, { status: 400 });
  }

  const captcha = await verifyRecaptcha(recaptchaToken);
  if (!captcha.success) {
    return NextResponse.json({ error: captcha.error || "reCAPTCHA verification failed." }, { status: 403 });
  }

  if (!env.ghlApiKey || !env.ghlApiBase || !env.ghlApiVersion || !env.ghlLocationId) {
    console.error("GHL lead capture configuration is incomplete.");
    return NextResponse.json({ error: "Lead capture is not configured yet." }, { status: 500 });
  }

  const ghlApiBase = env.ghlApiBase.replace(/\/+$/, "");
  const headers = {
    Authorization: `Bearer ${env.ghlApiKey}`,
    Version: env.ghlApiVersion,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const upsertResponse = await fetch(`${ghlApiBase}/contacts/upsert`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      locationId: env.ghlLocationId,
      companyName: businessName,
    }),
  });

  const upsertPayload = await readJson(upsertResponse);

  if (!upsertResponse.ok) {
    console.error("GHL contact upsert failed.", { status: upsertResponse.status });
    return NextResponse.json({ error: "We could not submit your request. Please try again." }, { status: 502 });
  }

  const contactId = getContactId(upsertPayload);
  if (!contactId) {
    console.error("GHL contact upsert response did not include a contact ID.");
    return NextResponse.json({ error: "We could not finish your request. Please try again." }, { status: 502 });
  }

  const tagResponse = await fetch(`${ghlApiBase}/contacts/${encodeURIComponent(contactId)}/tags`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      tags: ["downloaded seo md file"],
    }),
  });

  if (!tagResponse.ok) {
    console.error("GHL contact tagging failed.", { status: tagResponse.status });
    return NextResponse.json({ error: "We could not finish your request. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}