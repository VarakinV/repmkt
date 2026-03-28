import { NextResponse } from "next/server";
import { ListingProvider, SearchMode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveMarketById } from "@/lib/agent-finder/markets";
import { LISTING_PROVIDERS, SEARCH_MODES, type CreateAgentFinderJobInput } from "@/lib/agent-finder/contracts";
import { tasks } from "@trigger.dev/sdk/v3";
import type { agentFinderTask } from "@/trigger/agent-finder";
import { verifyRecaptcha } from "@/lib/recaptcha";

function isProvider(value: string | undefined): value is (typeof LISTING_PROVIDERS)[number] {
  return Boolean(value && LISTING_PROVIDERS.includes(value as (typeof LISTING_PROVIDERS)[number]));
}

function isMode(value: string | undefined): value is (typeof SEARCH_MODES)[number] {
  return Boolean(value && SEARCH_MODES.includes(value as (typeof SEARCH_MODES)[number]));
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CreateAgentFinderJobInput> & { recaptchaToken?: string };

  // Verify reCAPTCHA
  if (!body.recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA token is required." }, { status: 400 });
  }
  const captcha = await verifyRecaptcha(body.recaptchaToken);
  if (!captcha.success) {
    return NextResponse.json({ error: captcha.error || "reCAPTCHA verification failed." }, { status: 403 });
  }

  if (!isMode(body.mode)) {
    return NextResponse.json({ error: "Invalid mode." }, { status: 400 });
  }

  const maxListings = Math.min(Math.max(Number(body.maxListings) || 10, 1), 50);
  let marketId: string | null = null;
  let provider: (typeof LISTING_PROVIDERS)[number] | null = null;
  let startUrl: string | null = null;
  let countryCode = (body.countryCode || "").trim();
  let regionCode = (body.regionCode || "").trim();
  let city = (body.city || "").trim();

  if (body.mode === "MARKET") {
    if (!body.marketId) {
      return NextResponse.json({ error: "marketId is required for market mode." }, { status: 400 });
    }
    const market = await resolveMarketById(body.marketId);
    if (!market) {
      return NextResponse.json({ error: "Market not found." }, { status: 404 });
    }
    marketId = market.id;
    provider = market.provider;
    startUrl = market.startUrl;
    countryCode = market.countryCode;
    regionCode = market.regionCode;
    city = market.city;
  } else {
    if (!isProvider(body.provider)) {
      return NextResponse.json({ error: "Invalid provider." }, { status: 400 });
    }
    if (!body.customStartUrl?.trim()) {
      return NextResponse.json({ error: "customStartUrl is required for custom mode." }, { status: 400 });
    }
    if (!countryCode) {
      return NextResponse.json({ error: "Country is required in custom mode." }, { status: 400 });
    }
    provider = body.provider;
    startUrl = body.customStartUrl.trim();
  }

  const job = await prisma.agentFinderJob.create({
    data: {
      mode: body.mode === "MARKET" ? SearchMode.MARKET : SearchMode.CUSTOM_URL,
      provider: ListingProvider[provider],
      marketId,
      countryCode,
      regionCode,
      city,
      customStartUrl: startUrl,
      maxListings,
      resultSummary: { stage: "queued" },
    },
  });

  await tasks.trigger<typeof agentFinderTask>("agent-finder-job", { jobId: job.id });

  return NextResponse.json({ jobId: job.id }, { status: 202 });
}