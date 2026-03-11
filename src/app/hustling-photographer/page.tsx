import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "../invisible-photographer/page.module.css";

const roadmap = [
  {
    title: "Create a system to find active agents",
    text: "Build a repeatable process that identifies agents listing homes every week, so you never run out of potential clients.",
  },
  {
    title: "Build a simple outreach workflow",
    text: "Use a structured intro, portfolio link, and clear value proposition so contacting agents becomes quick and repeatable.",
  },
  {
    title: "Set up automated follow-ups",
    text: "Most agents do not reply the first time. Automation keeps you on their radar until they need photography.",
  },
  {
    title: "Focus on agents who list often",
    text: "High-volume listing agents create the most momentum. A few strong repeat clients can generate consistent weekly shoots.",
  },
];

const actionPlan = [
  {
    title: "Increase your visibility with active real estate agents",
    text: "Right now many agents in your market simply don’t know you exist yet. Your first priority should be identifying agents who are actively listing homes and introducing your services. Even a small list of active agents can quickly turn into consistent photography bookings.",
  },
  {
    title: "Build a simple outreach system",
    text: "Most photographers rely on random referrals or occasional inquiries. Instead, you want a simple system where you regularly connect with agents who are listing properties. This keeps your name in front of agents before they need a photographer.",
  },
  {
    title: "Stay on the radar with follow-ups",
    text: "Agents are busy. They often don’t respond right away — but they will remember the photographers who stay visible. Simple follow-up systems make sure agents remember you when their next listing needs photos.",
  },
];

const learningItems = [
  {
    icon: "fas fa-users",
    text: "Automatically find agents listing homes",
  },
  {
    icon: "fas fa-list-check",
    text: "Build outreach lists in minutes",
  },
  {
    icon: "fas fa-clock",
    text: "Automate follow-ups",
  },
  {
    icon: "fas fa-camera-retro",
    text: "Generate consistent photography bookings",
  },
];

export const metadata: Metadata = {
  title: "The Hustling Photographer | RE Photography Growth Lab",
  description: "Quiz result page for photographers who get some bookings but still rely on manual effort to grow.",
};

export default function HustlingPhotographerPage() {
  return (
    <main className={styles.page}>
      <section className={styles.heroBand}>
        <HeroParticles />
        <div className="container">
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Quiz Result</span>
              <h1>Your Result: The Hustling Photographer</h1>
              <p className={styles.lead}>
                You&apos;re already getting some real estate photography bookings… but your business still depends on constant manual effort.
              </p>
              <p className={styles.heroText}>
                You&apos;re not invisible anymore. But growth still feels unpredictable, time-consuming, and too dependent on hustle.
              </p>
            </div>
            <div className={styles.heroImageWrap}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/hustling-photographer.webp"
                alt="Hustling photographer result"
                width={640}
                height={760}
                className={styles.heroImage}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.scoreWrap}>
            <div className={styles.scoreLabel}>
              <i className={`fas fa-bullseye ${styles.iconBlue}`} aria-hidden="true"></i>
              <span>Your Business System Score</span>
            </div>
            <div className={styles.scoreVisual}>
              <div className={styles.scoreCircles} aria-hidden="true">
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
              </div>
              <span className={styles.scoreNumber}>40/100</span>
            </div>
            <p className={styles.scoreNote}>
              <i className={`fas fa-chart-line ${styles.iconGreen}`} aria-hidden="true"></i>
              <span>
                You&apos;re already ahead of many photographers — you&apos;ve proven there is demand for your work. Now the goal is turning hustle into systems.
              </span>
            </p>
          </div>

          <div className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>
              <i className={`fas fa-camera ${styles.iconBlue}`} aria-hidden="true"></i>
              <span>What this means</span>
            </h2>
            <ul className={styles.summaryList}>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>You already have some real estate agent clients</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Get occasional or semi-regular shoots</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Are actively trying to grow your business</span>
              </li>
              <li>
                <i className={`fas fa-exclamation-triangle ${styles.iconWarning}`} aria-hidden="true"></i>
                <span>But most of your bookings still come from manual effort.</span>
              </li>
            </ul>
            <p className={styles.relianceNote}>
              That usually looks like searching listings manually, messaging agents one by one, relying heavily on referrals, and posting on social media hoping agents see it. It works… but it&apos;s exhausting and inconsistent.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.actionPlanBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.actionPlanHeader}>
            <span className={styles.actionPlanEyebrow}>Your next move</span>
            <h2 className={styles.sectionTitle}>Your Personalized Action Plan</h2>
            <p className={styles.sectionSub}>
              Based on your quiz answers, the fastest way for you to grow your real estate photography business is to focus on these three priorities:
            </p>
          </div>

          <div className={styles.actionPlanGrid}>
            {actionPlan.map((item, index) => (
              <div key={item.title} className={styles.actionPlanStep}>
                <div className={styles.actionPlanNumber}>Priority {index + 1}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.actionPlanCta}>
            <h3>Want help implementing this action plan?</h3>
            <p>
              Inside the Real Estate Photographer Community, I break down the exact systems photographers use to find agents listing homes, contact them effectively, automate follow-ups, and turn agents into long-term clients.
            </p>
            <Link href="/join" className="btn btn-outline">
              Join the Free Community
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.lightBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>The problem isn&apos;t getting clients</h2>
          <p className={styles.sectionSub}>
            You&apos;ve already proven that you can get clients. The real challenge now is scaling your efforts. Many photographers at this stage still spend hours every week searching listings, finding agent contact info, sending outreach manually, and following up only when they remember.
          </p>

          <div className={styles.problemCard}>
            <i className={`fas fa-gears ${styles.problemIcon}`} aria-hidden="true"></i>
            <div>
              <h3>The next breakthrough is systems</h3>
              <p>
                Manual hustle can win bookings, but it doesn&apos;t scale. Growth stays limited by how much time you personally spend chasing the next opportunity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Your growth roadmap</h2>
          <p className={styles.sectionSub}>These are the next four moves that turn manual hustle into predictable bookings.</p>

          <div className={styles.roadmapGrid}>
            {roadmap.map((step, index) => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.lightBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.insightBlock}>
            <p className={styles.insightEyebrow}>⚠️ The big shift that changes everything</p>
            <p className={styles.insightText}>
              At this stage, the biggest upgrade isn&apos;t better photos — it&apos;s better systems.
              <br />
              <br />
              When you build simple marketing systems, you find agents faster, outreach becomes repeatable, follow-ups happen without extra effort, and your pipeline stays full.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaPrimaryCard}>
            <h2>Want to turn your hustle into a system?</h2>
            <p>
              Inside my free community for real estate photographers, I show photographers how to build simple systems that consistently bring in new agent clients.
            </p>

            <div className={styles.ctaFeatureGrid}>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                How to find agents listing homes every week
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Outreach scripts that actually get replies
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Automation systems for follow-ups
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Local SEO strategies for photographers
              </span>
            </div>

            <Link href="/join" className="btn btn-cta-primary">
              Join the Real Estate Photographer Community
            </Link>

            <p className={styles.smallPrint}>Free to join • Systems &amp; automation • Photographer community</p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaSecondaryCard}>
            <h2>Stop chasing bookings</h2>
            <p>
              Most photographers stay stuck in the hustle stage for years — manually searching listings, messaging agents individually, and forgetting to follow up. But once you build a few simple systems, you move from random bookings to consistent shoots.
            </p>
            <Link href="/join" className="btn btn-outline">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles.lightBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.authorityFlex}>
            <div className={styles.authorityAvatar}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/vlad-retouched.webp"
                alt="Vlad, creator of the Real Estate Photography Growth Lab"
                width={110}
                height={110}
                className={styles.authorityPhoto}
              />
            </div>
            <div className={styles.authorityCopy}>
              <h2>About the creator</h2>
              <p>
                I&apos;m a real estate photographer and marketing automation specialist helping photographers build systems that attract real estate agent clients. Inside the community I share marketing automation strategies, outreach systems, SEO strategies, and lead generation systems — all focused on helping photographers book more real estate shoots consistently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What photographers are learning inside the community</h2>

          <div className={styles.socialGrid}>
            {learningItems.map((item) => (
              <div key={item.text} className={styles.socialItem}>
                <i className={`${item.icon} ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <p className={styles.socialFooter}>
            <i className={`fas fa-arrow-right ${styles.iconGreen}`} aria-hidden="true"></i>
            <span>Instead of relying on hustle, they&apos;re building systems that scale their photography business.</span>
          </p>

          <div className={styles.socialCta}>
            <Link href="/join" className="btn btn-outline">
              Join Free Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}