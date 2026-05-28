"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import styles from "./page.module.css";

const videoId = "Jkx4ttjuqhw";
const videoBaseUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

export default function SeoMdFileSuccessPage() {
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  useEffect(() => {
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

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2962FF", "#00C853", "#F64740"],
    });

    fireConfetti();
  }, []);

  return (
    <main className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>🎉 Your SEO File Is On Its Way! 🎉</h1>

          <p className={styles.subtitle}>
            Thank you for requesting the AI SEO instruction file.
          </p>

          <p className={styles.text}>
            Please check your email for the download link. If you do not see it within a few minutes, check your promotions or spam folder.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>How to use the file</h2>
            <p className={styles.text}>
              Watch this quick walkthrough for instructions on how to use the file with your coding agent.
            </p>

            <div className={styles.videoWrapper}>
              <iframe
                src={isVideoStarted ? `${videoBaseUrl}&autoplay=1` : videoBaseUrl}
                title="How to use the SEO instruction file with a coding agent"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {!isVideoStarted && (
                <button
                  type="button"
                  className={styles.videoOverlay}
                  onClick={() => setIsVideoStarted(true)}
                  aria-label="Play video instructions"
                >
                  <span className={styles.playButton}>
                    <i className="fas fa-play"></i>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className={styles.important}>
            <h3 className={styles.importantTitle}>
              <i className="fas fa-envelope-circle-check"></i> Important:
            </h3>
            <p className={styles.importantText}>
              The file will be sent to the email address you submitted. Add <strong>hello@repmkt.com</strong> to your contacts so the email does not get filtered.
            </p>
          </div>

          <p className={styles.closing}>Use it as your SEO brief before your coding agent builds or edits pages.</p>

          <Link href="/join" className="btn btn-primary">
            Join the Free Community
          </Link>
        </div>
      </div>
    </main>
  );
}