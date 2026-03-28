import { env } from "@/lib/env";
import { extractEmailsFromText } from "@/lib/agent-finder/utils";

type PerplexityInput = {
  firstName: string | null;
  lastName: string | null;
  agentName: string;
  brokerageName: string | null;
  phone: string | null;
  city: string;
  regionCode: string;
  countryCode: string;
  agentWebsite: string | null;
  brokerageWebsite: string | null;
};

function formatCountryName(countryCode: string) {
  switch (countryCode.toUpperCase()) {
    case "CA":
      return "Canada";
    case "US":
      return "United States";
    default:
      return countryCode;
  }
}

export async function findEmailWithPerplexity(input: PerplexityInput) {
  if (!env.perplexityApiKey) {
    return { email: null, log: ["Skipped Perplexity: missing API key"] };
  }

  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ") || input.agentName;
  const prompt = [
    "Your task is to find a single real business email address for a realtor or agent.",
    "Only return an email if it clearly belongs to the specific agent or their brokerage and is suitable for human contact.",
    "Never return image filenames, asset names, CDN addresses, telemetry or ingest addresses, monitoring addresses, no-reply mailboxes, or any technical/system email.",
    "If you are not confident the email is a real contact email for this agent, return an empty string.",
    "Here is the realtor's information:",
    `- First Name: ${input.firstName ?? ""}`,
    `- Last Name: ${input.lastName ?? ""}`,
    `- Full Name: ${fullName}`,
    `- Brokerage Name they work for: ${input.brokerageName ?? ""}`,
    `- Realtor's Phone Number: ${input.phone ?? ""}`,
    `- City: ${input.city}`,
    `- State / Province: ${input.regionCode}`,
    `- Country: ${formatCountryName(input.countryCode)}`,
    input.agentWebsite ? `- Agent website: ${input.agentWebsite}` : null,
    input.brokerageWebsite ? `- Brokerage website: ${input.brokerageWebsite}` : null,
    "IMPORTANT: If you cannot find the email, return an empty string.",
    "IMPORTANT: If the email is masked, obfuscated, personal-only, technical, or contains asterisks, return an empty string.",
    "IMPORTANT: Return only a single plain email address or an empty string. Do not include explanations, citations, or any extra text.",
  ]
    .filter(Boolean)
    .join(" ");

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.perplexityApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.perplexityModel,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { email: null, log: [`Perplexity failed: ${response.status} ${body.slice(0, 200)}`] };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  const emails = extractEmailsFromText(content);
  return {
    email: emails[0] ?? null,
    log: ["Checked Perplexity"],
  };
}