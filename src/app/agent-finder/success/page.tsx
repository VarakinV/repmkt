import type { Metadata } from "next";
import HeroParticles from "@/components/HeroParticles";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Export Successful | Agent Finder | RE Photography Growth Lab",
  description: "Your agent leads have been exported successfully.",
};

export default function AgentFinderSuccessPage() {
  return (
    <main className={styles.page}>
      {/* Success Banner */}
      <section className={styles.successBanner}>
        <HeroParticles />
        <div className="container">
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successHeadline}>Your Leads Are On Their Way!</h1>
          <div className={styles.successMessages}>
            <p className={styles.successLine}>📥 Your CSV file has been downloaded to your computer.</p>
            <p className={styles.successLine}>📩 We also sent a copy to your email — please check your inbox.</p>
          </div>
        </div>
      </section>

      {/* Leads To Clients Section */}
      <section className={styles.leadsToClients}>
        <div className={styles.leadsContainer}>
          <div>
            <span className={styles.sectionBadge}>THE NEXT STEP</span>
            <h2 className={styles.leadsHeadline}>You Found the Agents.<br />Now What?</h2>
            <p className={styles.leadsSubheadline}>
              Right now, you&apos;re looking at agents who are actively listing properties in your market.<br />
              These are <strong>real opportunities</strong> — not random leads.
            </p>
          </div>

          <div className={styles.leadsCards}>
            <div className={styles.valueCard}>
              <div className={styles.cardIcon}><i className="fas fa-robot" aria-hidden="true"></i></div>
              <h3>Build the System</h3>
              <p>Reach out to agents automatically — no manual cold calls, no spreadsheets.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.cardIcon}><i className="fas fa-comment-dots" aria-hidden="true"></i></div>
              <h3>Get Real Responses</h3>
              <p>Messages that feel helpful, not spammy. Agents actually reply.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.cardIcon}><i className="fas fa-handshake" aria-hidden="true"></i></div>
              <h3>Turn Leads Into Clients</h3>
              <p>From first booking to repeat work. Build long‑term relationships.</p>
            </div>
          </div>

          <div className={styles.promiseRow}>
            <i className="fas fa-chart-line" aria-hidden="true"></i>
            <span>You already have the leads. Now it&apos;s time to turn them into bookings.</span>
          </div>

          <div className={styles.leadsCta}>
            <p className={styles.ctaPretext}>
              If you want to build a system that consistently brings you new clients (without chasing or guessing),<br />
              that&apos;s exactly what we focus on inside the <strong>free Skool community</strong> for real estate photographers.
            </p>
            <a className="btn btn-primary" href="https://www.skool.com/repmkt/" target="_blank" rel="noreferrer">
              Join Free &amp; Get The Full System →
            </a>
            <p className={styles.ctaFootnote}>
              <i className="fas fa-users" aria-hidden="true"></i> Join photographers already building their client pipeline
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
