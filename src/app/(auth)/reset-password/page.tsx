"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import styles from "../login/page.module.css";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Invalid Link</h1>
            <p className={styles.subtitle}>
              This password reset link is invalid or has expired.
            </p>
            <div className={styles.footerLink}>
              <a href="/forgot-password">Request a new reset link</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    const result = await resetPassword(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Password Reset</h1>
            <p className={styles.subtitle}>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <div className={styles.footerLink}>
              <a href="/login">Go to Sign In</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Set New Password</h1>
          <p className={styles.subtitle}>Enter your new password below.</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.label}>New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className={styles.input}
                placeholder="At least 8 characters"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className={styles.input}
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>

          <div className={styles.footerLink}>
            <a href="/login">Back to Sign In</a>
          </div>
        </div>
      </div>
    </main>
  );
}

