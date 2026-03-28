import { env } from "@/lib/env";
import { collectScalarEntries, extractEmailsFromText } from "@/lib/agent-finder/utils";

type UprocLookupInput = {
  agentName: string;
  brokerageName: string | null;
  city: string;
  regionCode: string;
  companyDomain: string | null;
};

type EmailVerificationStatus = "UNKNOWN" | "VERIFIED" | "RISKY" | "INVALID";

type ScalarParams = Record<string, string | null | undefined>;

function buildMissingConfigLog(action: string, processor: string) {
  const missing = [
    !env.uprocEmail ? "UPROC_EMAIL" : null,
    !env.uprocApiKey ? "UPROC_API_KEY" : null,
    !env.uprocBaseUrl ? "UPROC_BASE_URL" : null,
    !processor ? `${action} processor` : null,
  ].filter(Boolean);

  return [`Skipped uProc ${action}: missing ${missing.join(", ")}`];
}

function buildHeaders() {
  const auth = Buffer.from(`${env.uprocEmail}:${env.uprocApiKey}`).toString("base64");

  return {
    "content-type": "application/json",
    authorization: `Basic ${auth}`,
  };
}

function compactParams(params: ScalarParams) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
      .map(([key, value]) => [key, value!.trim()]),
  );
}

function splitPersonName(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  return {
    firstname: parts[0],
    lastname: parts.at(-1)!,
  };
}

function deriveCompanyName(input: UprocLookupInput) {
  if (input.brokerageName?.trim()) {
    return input.brokerageName.trim();
  }

  if (!input.companyDomain?.trim()) {
    return null;
  }

  const normalized = input.companyDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  const primarySegment = normalized.split(".")[0]?.replace(/[-_]+/g, " ").trim();
  return primarySegment || null;
}

async function callUproc(processor: string, params: ScalarParams) {
  if (!env.uprocEmail || !env.uprocApiKey || !env.uprocBaseUrl || !processor) {
    return {
      data: null,
      error: buildMissingConfigLog("request", processor)[0],
    };
  }

  try {
    const response = await fetch(env.uprocBaseUrl, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        processor,
        params: compactParams(params),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        data: null,
        error: `${response.status} ${body.slice(0, 200)}`,
      };
    }

    return {
      data: await response.json(),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown uProc error",
    };
  }
}

function parseVerificationStatus(data: unknown): EmailVerificationStatus {
  const entries = collectScalarEntries(data);
  const statusValues = entries
    .filter((entry) => /(status|result|verification|quality|state|deliver|exists|verdict)/i.test(entry.path))
    .map((entry) => entry.value.toLowerCase());
  const verifiedFlag = entries.some(
    (entry) => /(verified|valid|exists|deliverable)/i.test(entry.path) && entry.value.toLowerCase() === "true",
  );
  const rejectedFlag = entries.some(
    (entry) => /(verified|valid|exists|deliverable)/i.test(entry.path) && entry.value.toLowerCase() === "false",
  );

  if (statusValues.some((value) => /(undeliverable|invalid|hard[\s_-]?bounce|bounce|rejected|does not exist|not exist)/i.test(value))) {
    return "INVALID";
  }

  if (statusValues.some((value) => /(spam[\s_-]?trap|soft[\s_-]?bounce|catch[\s_-]?all|accept[\s_-]?all|risky)/i.test(value))) {
    return "RISKY";
  }

  if (verifiedFlag || statusValues.some((value) => /(deliverable|valid|verified|recipient exists|exists)/i.test(value))) {
    return "VERIFIED";
  }

  if (rejectedFlag) {
    return "INVALID";
  }

  return "UNKNOWN";
}

export async function findEmailWithUproc(input: UprocLookupInput) {
  const processor = env.uprocEmailEnrichmentProcessor;
  if (!env.uprocEmail || !env.uprocApiKey || !env.uprocBaseUrl || !processor) {
    return { email: null, log: buildMissingConfigLog("enrichment", processor) };
  }

  const personName = splitPersonName(input.agentName);
  const company = deriveCompanyName(input);

  if (!personName || !company) {
    return {
      email: null,
      log: ["Skipped uProc enrichment: missing company name or full agent name"],
    };
  }

  const { data, error } = await callUproc(processor, {
    company,
    firstname: personName.firstname,
    lastname: personName.lastname,
    mode: "verify",
  });

  if (error) {
    return { email: null, log: [`uProc enrichment failed: ${error}`] };
  }

  const email = collectScalarEntries(data)
    .flatMap((entry) => extractEmailsFromText(entry.value))[0] ?? null;

  return { email, log: ["Checked uProc enrichment"] };
}

export async function verifyEmailWithUproc(email: string): Promise<{
  emailVerified: boolean;
  emailVerificationStatus: EmailVerificationStatus;
  log: string[];
}> {
  const processor = env.uprocEmailVerificationProcessor;
  if (!env.uprocEmail || !env.uprocApiKey || !env.uprocBaseUrl || !processor) {
    return {
      emailVerified: false,
      emailVerificationStatus: "UNKNOWN",
      log: buildMissingConfigLog("verification", processor),
    };
  }

  const { data, error } = await callUproc(processor, { email });

  if (error) {
    return {
      emailVerified: false,
      emailVerificationStatus: "UNKNOWN",
      log: [`uProc verification failed: ${error}`],
    };
  }

  const emailVerificationStatus = parseVerificationStatus(data);
  const emailVerified = emailVerificationStatus === "VERIFIED";

  return {
    emailVerified,
    emailVerificationStatus,
    log: [`Verified email with uProc (${emailVerificationStatus.toLowerCase()})`],
  };
}