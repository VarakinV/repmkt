import { env } from "@/lib/env";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number; error?: string }> {
  if (!env.recaptchaSecretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification.");
    return { success: true, score: 1.0 };
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.recaptchaSecretKey,
        response: token,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      return { success: false, score: 0, error: "reCAPTCHA verification failed." };
    }

    if (data.score < MIN_SCORE) {
      return { success: false, score: data.score, error: "Request flagged as suspicious." };
    }

    return { success: true, score: data.score };
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return { success: false, score: 0, error: "reCAPTCHA verification error." };
  }
}

