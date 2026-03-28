type ScalarEntry = { path: string; value: string };

const EMAIL_CANDIDATE_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const EMAIL_FORMAT_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const BLOCKED_EMAIL_TLDS = new Set(["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp", "ico", "avif", "heic"]);
const BLOCKED_EMAIL_DOMAIN_PATTERNS = [
  /(^|\.)o[0-9]+\.ingest\./i,
  /(^|\.)(ingest|telemetry|analytics|tracking|metrics|monitoring?)\./i,
  /(^|\.)sentry\.io$/i,
  /(^|\.)example\.(com|org|net)$/i,
  /(^|\.)localhost$/i,
  /(^|\.)invalid$/i,
];

export function isLikelyContactEmail(value: string | null | undefined) {
  const email = value?.trim().toLowerCase() ?? "";
  if (!email || !EMAIL_FORMAT_REGEX.test(email) || email.includes("*")) {
    return false;
  }

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain || localPart.length > 64 || domain.length > 253) {
    return false;
  }

  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) {
    return false;
  }

  const tld = domain.split(".").at(-1) ?? "";
  if (BLOCKED_EMAIL_TLDS.has(tld)) {
    return false;
  }

  if (BLOCKED_EMAIL_DOMAIN_PATTERNS.some((pattern) => pattern.test(domain))) {
    return false;
  }

  if (/^(no[._-]?reply|do[._-]?not[._-]?reply|mailer-daemon|postmaster|bounce|notifications?)$/i.test(localPart)) {
    return false;
  }

  return true;
}

export function normalizeText(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function extractEmailsFromText(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  const matches = value.match(EMAIL_CANDIDATE_REGEX) ?? [];
  return Array.from(new Set(matches.map((match) => match.toLowerCase()).filter((match) => isLikelyContactEmail(match))));
}

export function extractPhonesFromText(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  const matches = value.match(/\+?[0-9][0-9()\-\s.]{7,}[0-9]/g) ?? [];
  return Array.from(new Set(matches.map((match) => match.trim())));
}

export function extractUrlsFromText(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  const matches = value.match(/https?:\/\/[^\s"'<>]+/gi) ?? [];
  return Array.from(new Set(matches));
}

export function collectScalarEntries(input: unknown, currentPath = "root") {
  const entries: ScalarEntry[] = [];

  if (input === null || input === undefined) {
    return entries;
  }
  if (typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
    entries.push({ path: currentPath, value: String(input) });
    return entries;
  }
  if (Array.isArray(input)) {
    input.forEach((item, index) => {
      entries.push(...collectScalarEntries(item, `${currentPath}[${index}]`));
    });
    return entries;
  }
  if (typeof input === "object") {
    for (const [key, value] of Object.entries(input)) {
      entries.push(...collectScalarEntries(value, `${currentPath}.${key}`));
    }
  }

  return entries;
}

export function pickByPath(entries: ScalarEntry[], patterns: RegExp[], exclusions: RegExp[] = []) {
  const match = entries.find((entry) =>
    patterns.some((pattern) => pattern.test(entry.path)) &&
    exclusions.every((pattern) => !pattern.test(entry.path)) &&
    entry.value.trim(),
  );
  return match?.value?.trim() || null;
}

export function pickUrlByPath(entries: ScalarEntry[], patterns: RegExp[]) {
  const candidates = entries
    .filter((entry) => patterns.some((pattern) => pattern.test(entry.path)))
    .flatMap((entry) => extractUrlsFromText(entry.value));
  return candidates[0] || null;
}

export function domainFromUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function isLikelyProviderListingUrl(url: string | null | undefined) {
  if (!url) {
    return false;
  }
  return /(realtor\.ca|realtor\.com|zillow\.com)/i.test(url);
}