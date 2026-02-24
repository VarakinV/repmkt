"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import styles from "./page.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();
  const fname = searchParams.get("fname") || "";

  useEffect(() => {
    // Fire confetti on page load
    const duration = 3000;
    const end = Date.now() + duration;

    const fireConfetti = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#2962FF", "#00C853", "#F64740"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#2962FF", "#00C853", "#F64740"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(fireConfetti);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2962FF", "#00C853", "#F64740"],
    });

    // Continuous side confetti
    fireConfetti();
  }, []);

  return (
    <main className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>🎉 You&apos;re Almost In! 🎉</h1>

          <p className={styles.subtitle}>
            {fname ? `${fname}, thank` : "Thank"} you for requesting access to the RE Photography Growth Lab.
          </p>

          <p className={styles.text}>
            We&apos;ve received your application and our team will review it within 24 hours.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>What&apos;s next?</h2>
            <p className={styles.text}>
              You&apos;ll get an email once your application is approved.
            </p>
          </div>

          <div className={styles.important}>
            <h3 className={styles.importantTitle}>
              <i className="fas fa-exclamation-circle"></i> Important:
            </h3>
            <p className={styles.importantText}>
              Please add <strong>hello@repmkt.com</strong> to your contacts to avoid spam filters,
              and check your spam folder if you don&apos;t see our email.
            </p>
          </div>

          <p className={styles.closing}>See you inside soon!</p>

          <Link href="/" className="btn btn-primary">
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className={styles.successPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>🎉 You&apos;re Almost In! 🎉</h1>
            <p className={styles.subtitle}>Loading...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
