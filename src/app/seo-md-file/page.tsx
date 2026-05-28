import type { Metadata } from "next";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import { env } from "@/lib/env";
import SeoMdFileForm from "./SeoMdFileForm";
import styles from "./page.module.css";

const includedItems = [
  "SEO page structure guidelines",
  "AI search optimization principles",
  "Metadata and heading structure rules",
  "Internal linking recommendations",
  "Local SEO suggestions",
  "FAQ and schema recommendations",
  "Content organization strategies",
  "AI-agent-friendly instructions for building pages",
];

const audienceItems = [
  "Real estate photographers",
  "Creators building websites with AI",
  "Business owners using coding agents",
  "People rebuilding websites for SEO",
  "Developers working with AI-generated code",
];

const communityItems = [
  {
    icon: "fas fa-bullhorn",
    text: "Marketing strategies that actually work",
  },
  {
    icon: "fas fa-user-plus",
    text: "Lead generation ideas for photographers",
  },
  {
    icon: "fas fa-screwdriver-wrench",
    text: "New business tools before public release",
  },
  {
    icon: "fas fa-users",
    text: "Discussions with other photographers growing their businesses",
  },
];

export const metadata: Metadata = {
  title: "Free AI SEO Instruction File | RE Photography Growth Lab",
  description:
    "Download a practical AI SEO instruction file for building websites that follow modern SEO, GEO, and AI search optimization best practices.",
};

export default function SeoMdFilePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroParticles />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Free AI SEO Resource</span>
            <h1>Give Your AI Coding Agent Better SEO Instructions</h1>
            <p className={styles.subheadline}>
              A practical instruction file designed to help AI coding tools build websites that follow modern SEO, GEO, and AI search optimization best practices.
            </p>
            <a href="#download-form" className="btn btn-primary">
              Download the Free File
            </a>
          </div>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div className="container">
          <div className={styles.detailsGrid}>
            <article className={styles.detailCard}>
              <span className={styles.sectionEyebrow}>What&apos;s Inside</span>
              <h2>What&apos;s Included</h2>
              <ul className={styles.checkList}>
                {includedItems.map((item) => (
                  <li key={item}>
                    <i className="fas fa-check"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.detailCard}>
              <span className={styles.sectionEyebrow}>Who This Is For</span>
              <h2>This File Is Perfect For:</h2>
              <ul className={styles.checkList}>
                {audienceItems.map((item) => (
                  <li key={item}>
                    <i className="fas fa-check"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="download-form" className={styles.formSection}>
        <div className="container">
          <div className={styles.formLayout}>
            <div className={styles.formCopy}>
              <span className={styles.sectionEyebrow}>Free Download</span>
              <h2>Send the SEO instruction file to your inbox</h2>
              <p>
                Use this file as a starting point when prompting AI coding agents to build pages with cleaner structure, stronger metadata, better internal linking, and search-friendly content blocks.
              </p>
            </div>

            <SeoMdFileForm recaptchaSiteKey={env.recaptchaSiteKey} />
          </div>
        </div>
      </section>

      <section className={styles.communitySection}>
        <div className="container">
          <div className={styles.communityContent}>
            <h2>Join the Free Community</h2>
            <p className={styles.communityIntro}>
              If you want to grow your real estate photography business faster, join our free community where photographers share strategies, tools, and marketing ideas.
            </p>

            <p className={styles.listIntro}>Inside the community you&apos;ll find:</p>
            <ul className={styles.featureList}>
              {communityItems.map((item) => (
                <li key={item.text} className={styles.featureItem}>
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Link href="/join" className="btn btn-cta-primary">
              Join the Free Community
            </Link>

            <p className={styles.smallPrint}>Free to join • Built for real estate photographers</p>
          </div>
        </div>
      </section>
    </main>
  );
}