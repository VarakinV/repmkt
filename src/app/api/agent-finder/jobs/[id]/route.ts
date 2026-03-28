import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AgentFinderJobView } from "@/lib/agent-finder/contracts";

function splitLeadName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: null, lastName: null };
  }

  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : null,
  };
}

function readRawString(input: unknown, key: string) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const value = (input as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const job = await prisma.agentFinderJob.findUnique({
    where: { id },
    include: {
      leads: {
        orderBy: [{ rank: "asc" }, { confidenceScore: "desc" }],
      },
    },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }

  const payload: AgentFinderJobView = {
    id: job.id,
    status: job.status,
    mode: job.mode,
    provider: job.provider,
    countryCode: job.countryCode,
    regionCode: job.regionCode,
    city: job.city,
    maxListings: job.maxListings,
    errorMessage: job.errorMessage,
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    resultSummary: (job.resultSummary as Record<string, unknown> | null) ?? null,
    leads: job.leads.map((lead) => ({
      ...splitLeadName(lead.agentName),
      id: lead.id,
      rank: lead.rank,
      agentName: lead.agentName,
      brokerageName: lead.brokerageName,
      listingAddress: lead.listingAddress,
      listingUrl: lead.listingUrl,
      listed: readRawString(lead.rawListing, "TimeOnRealtor")
        ?? readRawString(lead.rawListing, "list_date"),
      phone: lead.phone,
      email: lead.email,
      emailVerified: lead.emailVerified,
      emailVerificationStatus: lead.emailVerificationStatus,
      emailSource: lead.emailSource,
      confidenceScore: lead.confidenceScore,
      agentWebsite: lead.agentWebsite,
      brokerageWebsite: lead.brokerageWebsite,
    })),
  };

  return NextResponse.json(payload);
}