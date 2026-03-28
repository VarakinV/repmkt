import { task } from "@trigger.dev/sdk/v3";
import { runAgentFinderJob } from "@/lib/agent-finder/pipeline";

export const agentFinderTask = task({
  id: "agent-finder-job",
  // Disable retries — the pipeline already handles errors and marks the job as FAILED.
  // Retrying could cause duplicate API calls (Apify, Perplexity, uProc).
  retry: {
    maxAttempts: 1,
  },
  // Allow up to 10 minutes for the full enrichment pipeline
  maxDuration: 600,
  run: async (payload: { jobId: string }) => {
    await runAgentFinderJob(payload.jobId);
  },
});

