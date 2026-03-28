"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ListingProvider } from "@prisma/client";
import { LISTING_PROVIDERS, type ListingProviderValue } from "@/lib/agent-finder/contracts";

function isValidProvider(value: string): value is ListingProviderValue {
  return LISTING_PROVIDERS.includes(value as ListingProviderValue);
}

export async function getMarkets() {
  return prisma.market.findMany({
    orderBy: [{ countryCode: "asc" }, { regionCode: "asc" }, { city: "asc" }],
  });
}

export async function getMarketById(id: string) {
  return prisma.market.findUnique({ where: { id } });
}

export async function createMarket(formData: FormData) {
  const label = (formData.get("label") as string)?.trim();
  const countryCode = (formData.get("countryCode") as string)?.trim().toUpperCase();
  const regionCode = (formData.get("regionCode") as string)?.trim().toUpperCase();
  const city = (formData.get("city") as string)?.trim();
  const provider = (formData.get("provider") as string)?.trim();
  const startUrl = (formData.get("startUrl") as string)?.trim();

  if (!label || !countryCode || !regionCode || !city || !provider || !startUrl) {
    return { error: "All fields are required." };
  }

  if (!isValidProvider(provider)) {
    return { error: "Invalid listing provider." };
  }

  try {
    new URL(startUrl);
  } catch {
    return { error: "Start URL must be a valid URL." };
  }

  // Check for duplicates
  const existing = await prisma.market.findFirst({
    where: { countryCode, regionCode, city, provider: ListingProvider[provider] },
  });
  if (existing) {
    return { error: "A market with this country, region, city, and provider already exists." };
  }

  const market = await prisma.market.create({
    data: {
      label,
      countryCode,
      regionCode,
      city,
      provider: ListingProvider[provider],
      startUrl,
    },
  });

  revalidatePath("/admin/markets");
  return { success: true, marketId: market.id };
}

export async function updateMarket(id: string, formData: FormData) {
  const label = (formData.get("label") as string)?.trim();
  const countryCode = (formData.get("countryCode") as string)?.trim().toUpperCase();
  const regionCode = (formData.get("regionCode") as string)?.trim().toUpperCase();
  const city = (formData.get("city") as string)?.trim();
  const provider = (formData.get("provider") as string)?.trim();
  const startUrl = (formData.get("startUrl") as string)?.trim();
  const isActive = formData.get("isActive") === "true";

  if (!label || !countryCode || !regionCode || !city || !provider || !startUrl) {
    return { error: "All fields are required." };
  }

  if (!isValidProvider(provider)) {
    return { error: "Invalid listing provider." };
  }

  try {
    new URL(startUrl);
  } catch {
    return { error: "Start URL must be a valid URL." };
  }

  // Check for duplicates (excluding self)
  const existing = await prisma.market.findFirst({
    where: {
      countryCode,
      regionCode,
      city,
      provider: ListingProvider[provider],
      id: { not: id },
    },
  });
  if (existing) {
    return { error: "A market with this country, region, city, and provider already exists." };
  }

  await prisma.market.update({
    where: { id },
    data: {
      label,
      countryCode,
      regionCode,
      city,
      provider: ListingProvider[provider],
      startUrl,
      isActive,
    },
  });

  revalidatePath("/admin/markets");
  return { success: true };
}

export async function toggleMarketActive(id: string) {
  const market = await prisma.market.findUnique({ where: { id } });
  if (!market) {
    return { error: "Market not found." };
  }

  await prisma.market.update({
    where: { id },
    data: { isActive: !market.isActive },
  });

  revalidatePath("/admin/markets");
  return { success: true };
}

