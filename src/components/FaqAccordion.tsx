"use client";

import { useState } from "react";
import styles from "./FaqAccordion.module.css";

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "What exactly do I get in the free community?",
    answer:
      "Instant access to automation blueprints (n8n workflows, Apify scraper configs), weekly live trainings, and community Q&A.",
  },
  {
    question: "Do I need to be technical to use this?",
    answer:
      "If you can follow a YouTube tutorial, you can build this system. Our training is step-by-step with community support. If you want us to do it for you, that's available separately.",
  },
  {
    question: "Does this work outside the US and Canada?",
    answer:
      "Yes. Members in Australia, the UK, and Europe use the system with their local MLS equivalents. The principles are universal.",
  },
  {
    question: "How long until I see my first lead?",
    answer:
      'Most members get their first "YES" reply within 7-14 days of launching. First bookings typically happen in weeks 2-4.',
  },
  {
    question: "Is this really free? What's the catch?",
    answer:
      "No catch. The free community exists to show you what's possible. You can stay free forever and still get massive value. We have paid tiers for deeper training and done-for-you setup.",
  },
  {
    question: "What CRM system do I need?",
    answer: (
      <>
        You can use any CRM you want. We recommend using{" "}
        <a
          href="https://www.gohighlevel.com/?fp_ref=westman-web-design-ltd25"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--electric-blue)", fontWeight: 600 }}
        >
          Go HighLevel
        </a>
        . In our opinion it provides the best ROI for real estate photographers.
      </>
    ),
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqAccordion}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`${styles.faqItem} ${openIndex === index ? styles.open : ""}`}
        >
          <button
            className={styles.faqQuestion}
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span>{faq.question}</span>
            <span className={styles.faqIcon}>
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          <div className={styles.faqAnswer}>
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

