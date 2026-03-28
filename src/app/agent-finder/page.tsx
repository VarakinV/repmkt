import type { Metadata } from "next";
import AgentFinder from "./AgentFinder";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Agent Finder Tool | RE Photography Growth Lab",
  description: "Find recently active real estate agents in your market and enrich their contact data.",
};

export default function AgentFinderPage() {
  return <AgentFinder recaptchaSiteKey={env.recaptchaSiteKey} />;
}