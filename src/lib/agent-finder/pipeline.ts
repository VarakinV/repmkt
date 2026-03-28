import { JobStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { scrapeRecentListings, buildApifyInput } from "@/lib/agent-finder/apify";
import type { ListingProviderValue } from "@/lib/agent-finder/contracts";
import { runDeterministicLookup } from "@/lib/agent-finder/deterministic";
import { findEmailWithPerplexity } from "@/lib/agent-finder/perplexity";
import { findEmailWithUproc, verifyEmailWithUproc } from "@/lib/agent-finder/uproc";
import { domainFromUrl, collectScalarEntries, isLikelyProviderListingUrl, normalizeText, pickByPath, pickUrlByPath } from "@/lib/agent-finder/utils";

type WorkingLead = {
  providerListingId: string | null;
  listingUrl: string | null;
  listingAddress: string | null;
  listingPrice: string | null;
  rawListing: unknown;
  agentName: string;
  firstName: string | null;
  lastName: string | null;
  normalizedAgentName: string;
  brokerageName: string | null;
  normalizedBrokerageName: string;
  phone: string | null;
  phoneSource: string | null;
  agentWebsite: string | null;
  brokerageWebsite: string | null;
  mlsNumber: string | null;
  listed: string | null;
  email: string | null;
  emailSource: string | null;
  emailVerified: boolean;
  emailVerificationStatus: "UNKNOWN" | "VERIFIED" | "RISKY" | "INVALID";
  confidenceScore: number;
  rank: number | null;
  sourceSummary: string[];
  enrichmentLog: string[];
};

type LeadSeed = {
  providerListingId: string | null;
  listingUrl: string | null;
  listingAddress: string | null;
  listingPrice: string | null;
  agentName: string;
  firstName: string | null;
  lastName: string | null;
  brokerageName: string | null;
  phone: string | null;
  agentWebsite: string | null;
  brokerageWebsite: string | null;
  mlsNumber: string | null;
  listed: string | null;
  email: string | null;
};

const PROVIDER_BASE_URLS: Record<ListingProviderValue, string> = {
  REALTOR_CA: "https://www.realtor.ca",
  REALTOR_COM: "https://www.realtor.com",
  ZILLOW: "https://www.zillow.com",
};

const VERIFICATION_STATUS_PRIORITY = {
  UNKNOWN: 0,
  RISKY: 1,
  INVALID: 2,
  VERIFIED: 3,
} as const;

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function splitPersonName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : null,
  };
}

function buildProviderUrl(provider: ListingProviderValue, value: string | null) {
  if (!value) {
    return null;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith("/")) {
    return `${PROVIDER_BASE_URLS[provider]}${value}`;
  }
  return value;
}

function cleanAddress(value: string | null) {
  return value?.split("|")[0]?.trim() ?? null;
}

function mergeVerificationStatus(
  left: WorkingLead["emailVerificationStatus"],
  right: WorkingLead["emailVerificationStatus"],
) {
  return VERIFICATION_STATUS_PRIORITY[right] > VERIFICATION_STATUS_PRIORITY[left] ? right : left;
}

function formatPhoneNumber(areaCode: string | null, phoneNumber: string | null) {
  if (areaCode && phoneNumber) {
    return `${areaCode}-${phoneNumber}`;
  }
  return areaCode || phoneNumber;
}

function pickPrimaryPhone(phones: unknown) {
  const candidates = asArray(phones)
    .map((phone) => asRecord(phone))
    .filter((phone): phone is Record<string, unknown> => phone !== null);
  const preferred = candidates.find((phone) => readString(phone.PhoneType)?.toLowerCase() === "telephone") ?? candidates[0];

  if (!preferred) {
    return null;
  }

  return formatPhoneNumber(readString(preferred.AreaCode), readString(preferred.PhoneNumber));
}

function pickPrimaryWebsite(websites: unknown) {
  const candidates = asArray(websites)
    .map((website) => asRecord(website))
    .filter((website): website is Record<string, unknown> => website !== null);

  return readString(candidates[0]?.Website);
}

function normalizeRealtorCaListing(raw: unknown): LeadSeed[] {
  const listing = asRecord(raw);
  if (!listing) {
    return [];
  }

  const property = asRecord(listing.Property);
  const propertyAddress = asRecord(property?.Address);
  const directAddress = asRecord(listing.Address);
  const listingAddress = cleanAddress(readString(propertyAddress?.AddressText) ?? readString(directAddress?.AddressText));
  const listingUrl = buildProviderUrl("REALTOR_CA", readString(listing.RelativeDetailsURL) ?? readString(listing.RelativeURLEn));
  const listingPrice = readString(property?.Price) ?? readString(listing.Price);
  const mlsNumber = readString(listing.MlsNumber);
  const listed = readString(listing.TimeOnRealtor);
  const individuals = asArray(listing.Individual);

  const seeds: LeadSeed[] = [];
  for (const item of individuals) {
    const individual = asRecord(item);
    if (!individual) continue;

    const organization = asRecord(individual.Organization);
    const name =
      readString(individual.Name) ||
      [readString(individual.FirstName), readString(individual.LastName)].filter(Boolean).join(" ") ||
      "Unknown agent";
    const splitName = splitPersonName(name);

    seeds.push({
      providerListingId: mlsNumber,
      listingUrl,
      listingAddress,
      listingPrice,
      agentName: name,
      firstName: readString(individual.FirstName) ?? splitName.firstName,
      lastName: readString(individual.LastName) ?? splitName.lastName,
      brokerageName: readString(organization?.Name),
      phone: pickPrimaryPhone(individual.Phones) ?? pickPrimaryPhone(organization?.Phones),
      agentWebsite: buildProviderUrl("REALTOR_CA", pickPrimaryWebsite(individual.Websites) ?? readString(individual.RelativeDetailsURL)),
      brokerageWebsite: buildProviderUrl("REALTOR_CA", pickPrimaryWebsite(organization?.Websites) ?? readString(organization?.RelativeDetailsURL)),
      mlsNumber,
      listed,
      email: null,
    });
  }
  return seeds;
}

function guessGenericListingValue(raw: unknown, provider: ListingProviderValue): LeadSeed | null {
  const entries = collectScalarEntries(raw);
  const listingUrl =
    buildProviderUrl(provider, pickUrlByPath(entries, [/listing.*url/i, /detail.*url/i, /permalink/i]) || pickByPath(entries, [/relative.*details.*url/i, /relativeurl/i])) ||
    entries.flatMap((entry) => entry.value.split(/\s+/)).find((value) => isLikelyProviderListingUrl(value)) ||
    null;

  const agentWebsite = buildProviderUrl(provider, pickUrlByPath(entries, [/agent.*website/i, /agent.*url/i, /agent.*site/i]) || pickByPath(entries, [/agent.*relative.*details.*url/i]));
  const brokerageWebsite = buildProviderUrl(provider, pickUrlByPath(entries, [/broker/i, /office/i, /company/i, /agency/i]) || pickByPath(entries, [/organization.*relative.*details.*url/i, /broker.*relative.*details.*url/i, /office.*relative.*details.*url/i]));
  const providerListingId = pickByPath(entries, [/listing.*id/i, /property.*id/i, /id$/i]);
  const listingAddress = cleanAddress(pickByPath(entries, [/address/i, /unparsed/i, /street/i, /formatted/i]));
  const listingPrice = pickByPath(entries, [/price/i, /listprice/i]);
  const agentName =
    pickByPath(entries, [/agent.*name/i, /listing.*agent/i, /realtor.*name/i], [/broker/i, /office/i, /company/i]) ||
    "Unknown agent";
  const brokerageName = pickByPath(entries, [/broker/i, /office/i, /company/i, /agency/i], [/website/i, /url/i]);
  const phone = pickByPath(entries, [/phone/i, /mobile/i, /cell/i, /officephone/i]);
  const splitName = splitPersonName(agentName);

  return {
    providerListingId,
    listingUrl,
    listingAddress,
    listingPrice,
    agentName,
    firstName: splitName.firstName,
    lastName: splitName.lastName,
    brokerageName,
    phone,
    agentWebsite,
    brokerageWebsite,
    mlsNumber: pickByPath(entries, [/mls/i, /mlsnumber/i]),
    listed: pickByPath(entries, [/timeonrealtor/i, /listed/i, /time.*ago/i]),
    email: null,
  };
}

function pickRealtorComPhone(advertisers: unknown): string | null {
  const advArray = asArray(advertisers);
  for (const adv of advArray) {
    const advertiser = asRecord(adv);
    if (!advertiser) continue;
    const phones = asArray(advertiser.phones);
    // Prefer "Mobile" type
    const mobile = phones
      .map((p) => asRecord(p))
      .filter((p): p is Record<string, unknown> => p !== null)
      .find((p) => readString(p.type)?.toLowerCase() === "mobile");
    if (mobile) {
      return readString(mobile.number);
    }
    // Fall back to first phone
    const first = asRecord(phones[0]);
    if (first) {
      return readString(first.number);
    }
  }
  return null;
}

function pickRealtorComOfficeName(advertisers: unknown): string | null {
  const advArray = asArray(advertisers);
  for (const adv of advArray) {
    const advertiser = asRecord(adv);
    if (!advertiser) continue;
    const office = asRecord(advertiser.office);
    if (office) {
      const name = readString(office.name);
      if (name) return name;
    }
  }
  return null;
}

function normalizeRealtorComListing(raw: unknown): LeadSeed[] {
  const listing = asRecord(raw);
  if (!listing) {
    return [];
  }

  const agentName = readString(listing.mls_agent_name);
  if (!agentName) {
    return [];
  }

  const splitName = splitPersonName(agentName);
  const listingUrl = readString(listing.href);
  const listingAddress = readString(listing.address_line);
  const listingPrice = readString(listing.list_price);
  const providerListingId = readString(listing.property_id) ?? readString(listing.listing_id);
  const listed = readString(listing.list_date);
  const email = readString(listing.mls_agent_email);

  // Phone: try primary_agent_phone first, then advertisers
  const phone = readString(listing.primary_agent_phone) ?? pickRealtorComPhone(listing.advertisers);

  // Brokerage: from advertisers[].office.name
  const brokerageName = pickRealtorComOfficeName(listing.advertisers);

  return [{
    providerListingId,
    listingUrl,
    listingAddress,
    listingPrice,
    agentName,
    firstName: splitName.firstName,
    lastName: splitName.lastName,
    brokerageName,
    phone,
    agentWebsite: null,
    brokerageWebsite: null,
    mlsNumber: null,
    listed,
    email,
  }];
}

function normalizeListing(raw: unknown, provider: ListingProviderValue) {
  if (provider === "REALTOR_CA") {
    const realtorCaLeads = normalizeRealtorCaListing(raw);
    if (realtorCaLeads.length > 0) {
      return realtorCaLeads;
    }
  }

  if (provider === "REALTOR_COM") {
    const realtorComLeads = normalizeRealtorComListing(raw);
    if (realtorComLeads.length > 0) {
      return realtorComLeads;
    }
  }

  const guessed = guessGenericListingValue(raw, provider);
  return guessed ? [guessed] : [];
}

function dedupeAndRank(leads: WorkingLead[]) {
  const deduped = new Map<string, WorkingLead>();

  for (const lead of leads) {
    const key = lead.email || `${lead.normalizedAgentName}|${lead.normalizedBrokerageName}|${lead.phone}`;
    const existing = deduped.get(key);
    if (!existing) {
      deduped.set(key, lead);
      continue;
    }

    existing.email = existing.email || lead.email;
    existing.emailSource = existing.emailSource || lead.emailSource;
    existing.phone = existing.phone || lead.phone;
    existing.phoneSource = existing.phoneSource || lead.phoneSource;
    existing.agentWebsite = existing.agentWebsite || lead.agentWebsite;
    existing.brokerageWebsite = existing.brokerageWebsite || lead.brokerageWebsite;
    existing.listingUrl = existing.listingUrl || lead.listingUrl;
    existing.listingAddress = existing.listingAddress || lead.listingAddress;
    const mergedVerificationStatus = mergeVerificationStatus(existing.emailVerificationStatus, lead.emailVerificationStatus);
    existing.emailVerificationStatus = mergedVerificationStatus;
    existing.emailVerified = mergedVerificationStatus === "VERIFIED";
    existing.sourceSummary = Array.from(new Set([...existing.sourceSummary, ...lead.sourceSummary]));
    existing.enrichmentLog = Array.from(new Set([...existing.enrichmentLog, ...lead.enrichmentLog]));
  }

  const ranked = Array.from(deduped.values()).map((lead) => {
    let score = 0;
    if (lead.email) score += 40;
    if (lead.emailVerified) score += 25;
    if (lead.phone) score += 15;
    if (lead.agentWebsite) score += 8;
    if (lead.brokerageWebsite) score += 8;
    if (lead.listingUrl) score += 4;
    if (["listing_payload", "listing_page", "brokerage_website", "agent_website"].includes(lead.emailSource ?? "")) score += 10;
    if (lead.emailSource === "perplexity") score += 6;
    if (lead.emailSource === "uproc") score += 4;
    return { ...lead, confidenceScore: score };
  });

  ranked.sort((left, right) => right.confidenceScore - left.confidenceScore || left.agentName.localeCompare(right.agentName));
  ranked.forEach((lead, index) => {
    lead.rank = index + 1;
  });

  return ranked;
}

async function updateStage(jobId: string, stage: string, extra: Record<string, unknown> = {}) {
  const job = await prisma.agentFinderJob.findUnique({ where: { id: jobId }, select: { resultSummary: true } });
  const previous = (job?.resultSummary as Record<string, unknown> | null) ?? {};
  await prisma.agentFinderJob.update({
    where: { id: jobId },
    data: { resultSummary: { ...previous, stage, ...extra } },
  });
}

export async function runAgentFinderJob(jobId: string) {
  const job = await prisma.agentFinderJob.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new Error("Job not found.");
  }

  const startUrl = job.customStartUrl;
  if (!startUrl) {
    throw new Error("No start URL found for job.");
  }

  await prisma.agentFinderJob.update({
    where: { id: jobId },
    data: { status: JobStatus.RUNNING, startedAt: new Date(), requestPayload: buildApifyInput(job.provider, startUrl, job.maxListings) },
  });

  try {
    await updateStage(jobId, "scraping_listings");
    const rawListings = await scrapeRecentListings(job.provider, startUrl, job.maxListings);

    await updateStage(jobId, "normalizing_listings", { rawListings: rawListings.length });
    const normalized = rawListings.flatMap((raw) =>
      normalizeListing(raw, job.provider).map((guessed): WorkingLead => ({
        providerListingId: guessed.providerListingId,
        listingUrl: guessed.listingUrl,
        listingAddress: guessed.listingAddress,
        listingPrice: guessed.listingPrice,
        rawListing: raw,
        agentName: guessed.agentName,
        firstName: guessed.firstName,
        lastName: guessed.lastName,
        normalizedAgentName: normalizeText(guessed.agentName),
        brokerageName: guessed.brokerageName,
        normalizedBrokerageName: normalizeText(guessed.brokerageName),
        phone: guessed.phone,
        phoneSource: guessed.phone ? "listing_payload" : null,
        agentWebsite: guessed.agentWebsite,
        brokerageWebsite: guessed.brokerageWebsite,
        mlsNumber: guessed.mlsNumber,
        listed: guessed.listed,
        email: guessed.email ?? null,
        emailSource: guessed.email ? "listing_payload" : null,
        emailVerified: false,
        emailVerificationStatus: "UNKNOWN",
        confidenceScore: 0,
        rank: null,
        sourceSummary: ["listing scrape"],
        enrichmentLog: ["Normalized listing payload"],
      })),
    );

    await updateStage(jobId, "deterministic_lookup", { normalized: normalized.length });
    // Skip deterministic lookup for leads that already have an email from the listing payload
    for (const lead of normalized.filter((item) => !item.email)) {
      const rawText = collectScalarEntries(lead.rawListing).map((entry) => entry.value).join("\n");
      const deterministic = await runDeterministicLookup({
        listingUrl: lead.listingUrl,
        brokerageWebsite: lead.brokerageWebsite,
        agentWebsite: lead.agentWebsite,
        rawText,
        phone: lead.phone,
      });

      lead.email = deterministic.email;
      lead.emailSource = deterministic.emailSource;
      lead.phone = deterministic.phone ?? lead.phone;
      lead.phoneSource = deterministic.phoneSource ?? lead.phoneSource;
      lead.enrichmentLog.push(...deterministic.log);
      if (deterministic.emailSource) {
        lead.sourceSummary.push(deterministic.emailSource);
      }
    }

    await updateStage(jobId, "perplexity_enrichment");
    for (const lead of normalized.filter((item) => !item.email)) {
      const perplexity = await findEmailWithPerplexity({
        firstName: lead.firstName,
        lastName: lead.lastName,
        agentName: lead.agentName,
        brokerageName: lead.brokerageName,
        phone: lead.phone,
        city: job.city,
        regionCode: job.regionCode,
        countryCode: job.countryCode,
        agentWebsite: lead.agentWebsite,
        brokerageWebsite: lead.brokerageWebsite,
      });
      lead.enrichmentLog.push(...perplexity.log);
      if (perplexity.email) {
        lead.email = perplexity.email;
        lead.emailSource = "perplexity";
        lead.sourceSummary.push("perplexity");
      }
    }

    await updateStage(jobId, "uproc_enrichment");
    for (const lead of normalized.filter((item) => !item.email)) {
      const uproc = await findEmailWithUproc({
        agentName: lead.agentName,
        brokerageName: lead.brokerageName,
        city: job.city,
        regionCode: job.regionCode,
        companyDomain: domainFromUrl(lead.brokerageWebsite) || domainFromUrl(lead.agentWebsite),
      });
      lead.enrichmentLog.push(...uproc.log);
      if (uproc.email) {
        lead.email = uproc.email;
        lead.emailSource = "uproc";
        lead.sourceSummary.push("uproc");
      }
    }

    await updateStage(jobId, "email_verification");
    for (const lead of normalized.filter((item) => item.email)) {
      const verification = await verifyEmailWithUproc(lead.email!);
      lead.emailVerified = verification.emailVerified;
      lead.emailVerificationStatus = verification.emailVerificationStatus;
      lead.enrichmentLog.push(...verification.log);
    }

    await updateStage(jobId, "dedupe_and_rank");
    const finalLeads = dedupeAndRank(normalized);
    await prisma.agentLead.deleteMany({ where: { jobId } });
    if (finalLeads.length > 0) {
      await prisma.agentLead.createMany({
        data: finalLeads.map((lead) => ({
          jobId,
          provider: job.provider,
          providerListingId: lead.providerListingId,
          listingUrl: lead.listingUrl,
          listingAddress: lead.listingAddress,
          listingPrice: lead.listingPrice,
          rawListing: lead.rawListing as never,
          agentName: lead.agentName,
          normalizedAgentName: lead.normalizedAgentName,
          brokerageName: lead.brokerageName,
          normalizedBrokerageName: lead.normalizedBrokerageName,
          phone: lead.phone,
          phoneSource: lead.phoneSource,
          agentWebsite: lead.agentWebsite,
          brokerageWebsite: lead.brokerageWebsite,
          email: lead.email,
          emailSource: lead.emailSource,
          emailVerified: lead.emailVerified,
          emailVerificationStatus: lead.emailVerificationStatus,
          confidenceScore: lead.confidenceScore,
          rank: lead.rank,
          sourceSummary: lead.sourceSummary as never,
          enrichmentLog: lead.enrichmentLog as never,
        })),
      });
    }

    await prisma.agentFinderJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.COMPLETED,
        completedAt: new Date(),
        resultSummary: {
          stage: "completed",
          rawListings: rawListings.length,
          normalizedLeads: normalized.length,
          finalLeads: finalLeads.length,
          verifiedEmails: finalLeads.filter((lead) => lead.emailVerified).length,
        },
      },
    });
  } catch (error) {
    await prisma.agentFinderJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.FAILED,
        completedAt: new Date(),
        errorMessage: (error as Error).message,
        resultSummary: { stage: "failed" },
      },
    });
    throw error;
  }
}