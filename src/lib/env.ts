function readEnv(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export const env = {
  apifyToken: readEnv("APIFY_API_TOKEN"),
  apifyActorIds: {
    REALTOR_CA: readEnv("APIFY_REALTOR_CA_ACTOR_ID"),
    REALTOR_COM: readEnv("APIFY_REALTOR_COM_ACTOR_ID"),
    ZILLOW: readEnv("APIFY_ZILLOW_ACTOR_ID"),
  },
  perplexityApiKey: readEnv("PERPLEXITY_API_KEY"),
  perplexityModel: readEnv("PERPLEXITY_MODEL", "sonar"),
  uprocEmail: readEnv("UPROC_EMAIL"),
  uprocApiKey: readEnv("UPROC_API_KEY"),
  uprocBaseUrl: readEnv("UPROC_BASE_URL", "https://api.uproc.io/api/v2/process"),
  uprocEmailEnrichmentProcessor: readEnv("UPROC_EMAIL_ENRICHMENT_PROCESSOR"),
  uprocEmailVerificationProcessor: readEnv("UPROC_EMAIL_VERIFICATION_PROCESSOR"),
  // Go High Level
  ghlApiKey: readEnv("GHL_API_KEY"),
  ghlApiBase: readEnv("GHL_API_BASE", "https://services.leadconnectorhq.com"),
  ghlApiVersion: readEnv("GHL_API_VERSION", "2021-07-28"),
  ghlLocationId: readEnv("GHL_LOCATION_ID"),
  // Cloudflare R2
  r2AccountId: readEnv("R2_ACCOUNT_ID"),
  r2AccessKeyId: readEnv("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: readEnv("R2_SECRET_ACCESS_KEY"),
  r2BucketName: readEnv("R2_BUCKET_NAME"),
  r2PublicUrl: readEnv("R2_PUBLIC_URL"),
  r2S3Endpoint: readEnv("R2_S3_ENDPOINT"),
  // Google reCAPTCHA v3
  recaptchaSiteKey: readEnv("RECAPTCHA_SITE_KEY"),
  recaptchaSecretKey: readEnv("RECAPTCHA_SECRET_KEY"),
};

export function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}