import { env, requireEnv } from "@/lib/env";
import type { ListingProviderValue } from "@/lib/agent-finder/contracts";

export function buildApifyInputRealtorCa(startUrl: string, maxListings: number) {
  return {
    "Proxy config": {
      useApifyProxy: true,
      apifyProxyGroups: ["RESIDENTIAL"],
    },
    getDetails: false,
    maxListings,
    simplifyOutput: false,
    startUrls: [{ url: startUrl, method: "GET" }],
  };
}

export function buildApifyInputRealtorCom(startUrl: string, maxListings: number) {
  return {
    additionalStats: false,
    fetchAgentListings: false,
    maxItems: maxListings,
    monitoringMode: false,
    proxy: {
      useApifyProxy: true,
      apifyProxyGroups: ["RESIDENTIAL"],
      apifyProxyCountry: "US",
    },
    startUrls: [{ url: startUrl }],
  };
}

export function buildApifyInput(provider: ListingProviderValue, startUrl: string, maxListings: number) {
  if (provider === "REALTOR_COM") {
    return buildApifyInputRealtorCom(startUrl, maxListings);
  }
  return buildApifyInputRealtorCa(startUrl, maxListings);
}

function getActorId(provider: ListingProviderValue) {
  const actorId = env.apifyActorIds[provider];
  if (!actorId) {
    throw new Error(`Missing Apify actor id for provider ${provider}.`);
  }
  return actorId;
}

export async function scrapeRecentListings(provider: ListingProviderValue, startUrl: string, maxListings: number) {
  const actorId = getActorId(provider);
  const token = requireEnv("APIFY_API_TOKEN");
  const input = buildApifyInput(provider, startUrl, maxListings);

  const response = await fetch(
    `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Apify request failed (${response.status}): ${body.slice(0, 400)}`);
  }

  const items = (await response.json()) as unknown;
  return Array.isArray(items) ? items : [];
}