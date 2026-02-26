"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the form embed script
    const script = document.createElement("script");
    script.src = "https://api.leadconnectorhq.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://api.leadconnectorhq.com/js/form_embed.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <main className={styles.onboardingPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Book Your 15-Min Onboarding Call</h1>
        <p className={styles.subtitle}>
          Welcome to the community! Schedule a quick call to get you started on the right track.
        </p>
        <div className={styles.formWrapper}>
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading calendar...</p>
            </div>
          )}
          <iframe
            src="https://api.leadconnectorhq.com/widget/booking/8TmD0bV1bdmXDVbDRWqB"
            style={{ width: "100%", border: "none", overflow: "hidden", display: isLoading ? "none" : "block" }}
            scrolling="no"
            id="8TmD0bV1bdmXDVbDRWqB_1772073221881"
            title="15-min Onboarding Booking"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </main>
  );
}

