"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

export default function BusinessQuizEmbed() {
  const [isLoading, setIsLoading] = useState(true);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = embedRef.current;

    if (!root) {
      return;
    }

    const markLoaded = () => {
      if (root.childElementCount > 0) {
        setIsLoading(false);
      }
    };

    const observer = new MutationObserver(markLoaded);
    observer.observe(root, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.src = "https://embed.formaloo.me/v1/main.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.setTimeout(markLoaded, 400);
    };

    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      script.remove();
      root.innerHTML = "";
    };
  }, []);

  return (
    <div className={styles.embedShell}>
      {isLoading && (
        <div className={styles.loaderWrapper}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading quiz...</p>
        </div>
      )}

      <div
        ref={embedRef}
        className="formaloo--root-container"
        data-form-slug="5lXLEIMb"
        style={{ width: "100%", height: "750px" }}
      ></div>
    </div>
  );
}