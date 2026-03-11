import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "../invisible-photographer/page.module.css";

const roadmap = [
  {
    title: "Strengthen your local SEO presence",
    text: "When agents search online for help quickly, showing up near the top makes you the first photographer they contact.",
  },
  {
    title: "Build a system to connect with new agents",
    text: "A simple outreach system keeps new agents discovering your services instead of growth depending only on your current relationships.",
  },
  {
    title: "Focus on high-producing agents",
    text: "A few strong relationships with agents who list often can create steady monthly bookings and far more predictable revenue.",
  },
  {
    title: "Create repeatable workflows",
    text: "Standardize scheduling, communication, delivery, and follow-ups so the business grows without adding constant stress and manual work.",
  },
];

const actionPlan = [
  {
    title: "Increase your visibility when agents search for photographers",
    text: "Many agents search online when they need photography. If your business appears first in local searches, you become the default option for new clients. Strengthening your local SEO can bring you consistent inbound inquiries.",
  },
  {
    title: "Expand your network of active listing agents",
    text: "Even if you already have agent clients, your growth accelerates when you regularly connect with new agents entering the market. This keeps your pipeline full and protects your business from relying on only a few clients.",
  },
  {
    title: "Build systems that reduce manual work",
    text: "At this stage, your time becomes extremely valuable. Simple systems and workflows can automate lead generation, follow-ups, and client onboarding so you can grow without working longer hours.",
  },
];

const learningItems = [
  {
    icon: "fas fa-magnifying-glass-location",
    text: "Rank higher in local search results",
  },
  {
    icon: "fas fa-list-check",
    text: "Build outreach lists of active agents",
  },
  {
    icon: "fas fa-clock",
    text: "Automate follow-ups and lead generation",
  },
  {
    icon: "fas fa-chart-line",
    text: "Create marketing systems that bring consistent bookings",
  },
];

export const metadata: Metadata = {
  title: "The Growth Photographer | RE Photography Growth Lab",
  description: "Quiz result page for photographers with a solid business who want more predictable, scalable growth.",
};

export default function GrowthPhotographerPage() {
  return (
    <main className={styles.page}>
      <section className={styles.heroBand}>
        <HeroParticles />
        <div className="container">
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Quiz Result</span>
              <h1>Your Result: The Growth Photographer</h1>
              <p className={styles.lead}>
                You&apos;ve already built a solid real estate photography business. You have regular shoots and agent clients… but the next challenge is scaling without burning out.
              </p>
              <p className={styles.heroText}>
                At this stage, growth isn&apos;t about finding any clients anymore. It&apos;s about building predictable systems that support long-term growth.
              </p>
            </div>
            <div className={styles.heroImageWrap}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/growth-photographer.webp"
                alt="Growth photographer result"
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
              <span>Your Business Growth Score</span>
            </div>
            <div className={styles.scoreVisual}>
              <div className={styles.scoreCircles} aria-hidden="true">
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
              </div>
              <span className={styles.scoreNumber}>60/100</span>
            </div>
            <p className={styles.scoreNote}>
              <i className={`fas fa-chart-line ${styles.iconGreen}`} aria-hidden="true"></i>
              <span>
                You&apos;ve already done the hardest part — proving demand for your services. Now the goal is making your business more predictable and scalable.
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
                <span>You have a solid portfolio and reputation</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Work with several real estate agents</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Book shoots on a regular basis</span>
              </li>
              <li>
                <i className={`fas fa-exclamation-triangle ${styles.iconWarning}`} aria-hidden="true"></i>
                <span>But growth still comes with friction and manual work.</span>
              </li>
            </ul>
            <p className={styles.relianceNote}>
              Many photographers at this stage still experience busy weeks followed by slow weeks, heavy reliance on the same few agents, limited marketing systems, and too many manual tasks. The business works… but it isn&apos;t fully optimized yet.
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
              Based on your quiz answers, the fastest way to grow your real estate photography business now is to focus on these three priorities:
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
          <h2 className={styles.sectionTitle}>The next challenge is predictable growth</h2>
          <p className={styles.sectionSub}>
            You no longer need proof that agents want your services. What matters now is reducing the swings, widening your lead flow, and creating systems that support steady growth instead of constant effort.
          </p>

          <div className={styles.problemCard}>
            <i className={`fas fa-layer-group ${styles.problemIcon}`} aria-hidden="true"></i>
            <div>
              <h3>Good business, not yet optimized</h3>
              <p>
                When bookings depend too heavily on a few repeat agents and manual admin, growth can stall. Better positioning, repeatable marketing, and workflow systems are what unlock the next level.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Your growth roadmap</h2>
          <p className={styles.sectionSub}>These are the next steps that turn a good photography business into a scalable one.</p>

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
            <p className={styles.insightEyebrow}>⚠️ The shift that unlocks the next level</p>
            <p className={styles.insightText}>
              Most photographers reach a point where working harder stops producing better results.
              <br />
              <br />
              The next stage of growth comes from stronger positioning, better marketing systems, automation, and focusing on high-value clients. Once those systems are in place, your business becomes far more predictable and scalable.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaPrimaryCard}>
            <h2>Ready to scale your photography business?</h2>
            <p>
              Inside my free community for real estate photographers, I share the exact systems photographers use to grow beyond inconsistent bookings and build sustainable businesses.
            </p>

            <div className={styles.ctaFeatureGrid}>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Local SEO strategies for photographers
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                How to find agents listing homes every week
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Outreach systems that generate new clients
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Automation tools for follow-ups and marketing
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Systems that make your business more predictable
              </span>
            </div>

            <Link href="/join" className="btn btn-cta-primary">
              Join the Photographer Community
            </Link>

            <p className={styles.smallPrint}>Free to join • Marketing systems • Photographer community</p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaSecondaryCard}>
            <h2>Move from growth to stability</h2>
            <p>
              Many photographers stay stuck in the growth stage for years. They have good clients, but their schedule still fluctuates. Once you build the right marketing systems, your business can move from unpredictable bookings, referrals, and inconsistent demand to a steady client pipeline and scalable growth.
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
                I&apos;m a real estate photographer and marketing automation specialist helping photographers build systems that attract agent clients and create predictable bookings. Inside the community I share marketing automation systems, lead generation strategies, SEO strategies for photographers, and tools for scaling a photography business — all focused on helping photographers grow without burning out.
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
            <span>These systems help photographers move from inconsistent growth to scalable businesses.</span>
          </p>

          <div className={styles.socialCta}>
            <Link href="/join" className="btn btn-outline">
              Join the Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}