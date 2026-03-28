import { prisma } from "@/lib/prisma";
import type { AgentFinderMarketOption } from "@/lib/agent-finder/contracts";

export async function getAvailableMarkets(): Promise<AgentFinderMarketOption[]> {
  const dbMarkets = await prisma.market.findMany({
    where: { isActive: true },
    orderBy: [{ countryCode: "asc" }, { regionCode: "asc" }, { city: "asc" }],
  });

  return dbMarkets.map((market) => ({
    id: market.id,
    label: market.label,
    countryCode: market.countryCode,
    regionCode: market.regionCode,
    city: market.city,
    provider: market.provider,
    startUrl: market.startUrl,
  }));
}

export async function resolveMarketById(marketId: string) {
  const market = await prisma.market.findUnique({ where: { id: marketId } });
  if (!market) {
    return null;
  }

  return {
    id: market.id,
    label: market.label,
    countryCode: market.countryCode,
    regionCode: market.regionCode,
    city: market.city,
    provider: market.provider,
    startUrl: market.startUrl,
  };
}