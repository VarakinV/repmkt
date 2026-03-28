import type { Metadata } from "next";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "./page.module.css";

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
  title: "Free Tools for Real Estate Photographers | RE Photography Growth Lab",
  description:
    "Simple tools to help real estate photographers find agents, calculate revenue potential, and grow their business.",
};

export default function FreeToolsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroParticles />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Free Tools</span>
            <h1>Free Tools for Real Estate Photographers</h1>
            <p className={styles.subheadline}>
              Simple tools to help you find agents, calculate revenue potential, and grow your real estate photography business.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.toolsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Free Marketing &amp; Business Tools</h2>

          <div className={styles.toolsGrid}>
            <article className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <i className="fas fa-calculator"></i>
              </div>
              <h3>Real Estate Photography Business Calculator</h3>
              <p>
                Estimate how much you could earn from real estate agents in your market. Simply enter the number of agents you work with, listings per year, and your average shoot price.
              </p>
              <p>
                In seconds you&apos;ll see the real revenue potential of your photography business.
              </p>
              <Link href="/business-calculator" className="btn btn-primary">
                Try the Calculator
              </Link>
            </article>

            <article className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <i className="fas fa-magnifying-glass-location"></i>
              </div>
              <h3>Agent Finder Tool</h3>
              <p>
                Find real estate agents who are actively listing homes in your area.
              </p>
              <p>
                This tool scans recent listings and helps you identify agents who may need a real estate photographer, so you always know who to contact next.
              </p>
              <Link href="/agent-finder" className="btn btn-primary">
                Try the Agent Finder
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.moreSection}>
        <div className="container">
          <div className={styles.moreCard}>
            <h2>More Free Tools Coming Soon</h2>
            <p>
              We&apos;re actively building more tools to help real estate photographers find clients, grow faster, and make more money. Our goal is to build the ultimate toolkit for real estate photographers.
            </p>
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