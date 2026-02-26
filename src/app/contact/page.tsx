"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(true);

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

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <main className={styles.contactPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you as soon as possible.
        </p>
        <div className={styles.formWrapper}>
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading form...</p>
            </div>
          )}
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/JTO09jhCgl8ymr9KTLm8"
            style={{ width: "100%", height: "100%", border: "none", borderRadius: "3px", display: isLoading ? "none" : "block" }}
            id="inline-JTO09jhCgl8ymr9KTLm8"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="General Contact Form"
            data-height="868"
            data-layout-iframe-id="inline-JTO09jhCgl8ymr9KTLm8"
            data-form-id="JTO09jhCgl8ymr9KTLm8"
            title="General Contact Form"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </main>
  );
}

