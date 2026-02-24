"use client";

import { useEffect } from "react";
import styles from "./page.module.css";

export default function JoinPage() {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://link.msgsndr.com/js/form_embed.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <main className={styles.joinPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Join the Free Community</h1>
        <p className={styles.subtitle}>
          Get access to free tools and resources to grow your real estate photography business.
        </p>
        <div className={styles.formWrapper}>
          <iframe
            src="https://api.leadconnectorhq.com/widget/survey/kc5vZKuyPa4RW2tuxQxm"
            style={{ border: "none", width: "100%" }}
            scrolling="no"
            id="kc5vZKuyPa4RW2tuxQxm"
            title="survey"
          />
        </div>
      </div>
    </main>
  );
}

