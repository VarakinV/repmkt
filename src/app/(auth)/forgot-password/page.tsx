"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/actions/auth";
import styles from "../login/page.module.css";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await forgotPassword(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Check Your Email</h1>
            <p className={styles.subtitle}>
              If an account exists with that email, we&apos;ve sent a password reset link.
              Check your inbox (and spam folder).
            </p>
            <div className={styles.footerLink}>
              <a href="/login">Back to Sign In</a>
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
          <h1 className={styles.title}>Forgot Password</h1>
          <p className={styles.subtitle}>
            Enter your email and we&apos;ll send you a reset link.
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
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

