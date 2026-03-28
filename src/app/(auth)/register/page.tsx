"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register, checkRegistrationOpen } from "@/lib/actions/auth";
import styles from "../login/page.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState<boolean | null>(null);

  useEffect(() => {
    checkRegistrationOpen().then(setRegistrationOpen);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;
    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Registration successful — redirect to login
    router.push("/login?registered=1");
  }

  if (registrationOpen === null) {
    return (
      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.subtitle}>Loading…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!registrationOpen) {
    return (
      <main className={styles.authPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Registration Closed</h1>
            <p className={styles.subtitle}>
              An admin account already exists. Registration is no longer available.
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
          <h1 className={styles.title}>Create Admin Account</h1>
          <p className={styles.subtitle}>Set up the first admin account</p>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">Name</label>
              <input
                className={styles.input}
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
              <input
                className={styles.input}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat password"
              />
            </div>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

