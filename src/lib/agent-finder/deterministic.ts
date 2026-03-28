import { extractEmailsFromText, extractPhonesFromText } from "@/lib/agent-finder/utils";

type DeterministicLookupInput = {
  listingUrl: string | null;
  brokerageWebsite: string | null;
  agentWebsite: string | null;
  rawText: string;
  phone: string | null;
};

export type DeterministicLookupResult = {
  email: string | null;
  phone: string | null;
  emailSource: string | null;
  phoneSource: string | null;
  log: string[];
};

async function fetchText(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "user-agent": "AgentFinderTool/1.0 (+https://repmkt.local)" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function findEmailAndPhoneOnPage(url: string, sourceLabel: string) {
  try {
    const page = await fetchText(url);
    const email = extractEmailsFromText(page)[0] ?? null;
    const phone = extractPhonesFromText(page)[0] ?? null;
    return { email, phone, log: [`Checked ${sourceLabel}`] };
  } catch (error) {
    return { email: null, phone: null, log: [`Skipped ${sourceLabel}: ${(error as Error).message}`] };
  }
}

export async function runDeterministicLookup(input: DeterministicLookupInput): Promise<DeterministicLookupResult> {
  const log: string[] = [];
  const directEmail = extractEmailsFromText(input.rawText)[0] ?? null;
  if (directEmail) {
    return {
      email: directEmail,
      phone: input.phone,
      emailSource: "listing_payload",
      phoneSource: input.phone ? "listing_payload" : null,
      log: ["Found email in listing payload"],
    };
  }

  const urls = [
    { url: input.listingUrl, source: "listing page" },
    { url: input.brokerageWebsite, source: "brokerage website" },
    { url: input.agentWebsite, source: "agent website" },
  ];

  let phone = input.phone;
  let phoneSource = input.phone ? "listing_payload" : null;

  for (const candidate of urls) {
    if (!candidate.url) {
      continue;
    }

    const result = await findEmailAndPhoneOnPage(candidate.url, candidate.source);
    log.push(...result.log);
    if (result.email) {
      return {
        email: result.email,
        phone: phone ?? result.phone,
        emailSource: candidate.source.replace(/\s+/g, "_"),
        phoneSource: phoneSource ?? (result.phone ? candidate.source.replace(/\s+/g, "_") : null),
        log,
      };
    }
    if (!phone && result.phone) {
      phone = result.phone;
      phoneSource = candidate.source.replace(/\s+/g, "_");
    }
  }

  return {
    email: null,
    phone,
    emailSource: null,
    phoneSource,
    log,
  };
}