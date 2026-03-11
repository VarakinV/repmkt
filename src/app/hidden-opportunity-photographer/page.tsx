import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "../invisible-photographer/page.module.css";

const roadmap = [
  {
    title: "Start tracking new real estate listings",
    text: "Every new listing is a potential photography opportunity and a signal showing which agents are actively selling homes in your market.",
  },
  {
    title: "Identify agents who list frequently",
    text: "High-producing agents often need reliable photographers again and again, making them some of the most valuable clients you can pursue.",
  },
  {
    title: "Reach out and introduce your services",
    text: "A simple introduction message can start relationships with agents who need photography regularly and may not know you yet.",
  },
  {
    title: "Stay visible so agents remember you",
    text: "Consistent follow-up and visibility make it more likely that your name comes to mind when an agent needs photos for the next listing.",
  },
];

const actionPlan = [
  {
    title: "Understand how much opportunity exists in your market",
    text: "Every week, hundreds of homes are listed in most cities, and every one of those listings requires professional photos. The opportunity for photographers is enormous once you begin tracking who is listing those homes.",
  },
  {
    title: "Identify the agents who list homes frequently",
    text: "Not every agent lists properties regularly, but some agents list multiple homes every month. These are the agents who become the core clients of most successful real estate photographers.",
  },
  {
    title: "Build a simple system for staying visible",
    text: "Once agents know your name and see your work, you dramatically increase the chances they will contact you when they need photos. A simple outreach and follow-up system keeps you visible to agents who are actively listing homes.",
  },
];

const learningItems = [
  {
    icon: "fas fa-house",
    text: "Find agents listing homes in their market",
  },
  {
    icon: "fas fa-list-check",
    text: "Build outreach lists in minutes",
  },
  {
    icon: "fas fa-clock",
    text: "Automate follow-ups with agents",
  },
  {
    icon: "fas fa-chart-line",
    text: "Create marketing systems that bring consistent bookings",
  },
];

export const metadata: Metadata = {
  title: "The Hidden Opportunity Photographer | RE Photography Growth Lab",
  description: "Quiz result page for photographers who have opportunity in their market but need better systems to connect with agent clients consistently.",
};

export default function HiddenOpportunityPhotographerPage() {
  return (
    <main className={styles.page}>
      <section className={styles.heroBand}>
        <HeroParticles />
        <div className="container">
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Quiz Result</span>
              <h1>Your Result: The Hidden Opportunity Photographer</h1>
              <p className={styles.lead}>
                Your answers suggest that you may be leaving a lot of opportunity on the table. Many real estate photographers focus mainly on improving their photography skills.
              </p>
              <p className={styles.heroText}>
                But the biggest difference between photographers earning a little extra income and those building a full-time business usually isn&apos;t photography — it&apos;s marketing systems.
              </p>
            </div>
            <div className={styles.heroImageWrap}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/hidden-opportunity-photographer.webp"
                alt="Hidden opportunity photographer result"
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
              <span>Your Opportunity Score</span>
            </div>
            <div className={styles.scoreVisual}>
              <div className={styles.scoreCircles} aria-hidden="true">
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleEmpty}>○</span>
              </div>
              <span className={styles.scoreNumber}>80/100</span>
            </div>
            <p className={styles.scoreNote}>
              <i className={`fas fa-chart-line ${styles.iconGreen}`} aria-hidden="true"></i>
              <span>
                This means your photography business may not yet be tapping into the full potential of your market. The good news? That opportunity already exists around you.
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
                <span>You have the ability to shoot real estate photos</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>May have already done some shoots</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Want to grow your photography business</span>
              </li>
              <li>
                <i className={`fas fa-exclamation-triangle ${styles.iconWarning}`} aria-hidden="true"></i>
                <span>But may not yet have a system for connecting with agents consistently.</span>
              </li>
            </ul>
            <p className={styles.relianceNote}>
              Many photographers at this stage rely on occasional referrals, word of mouth, or hoping agents discover them. The problem usually isn&apos;t demand — it&apos;s access to the right agents.
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
              Based on your quiz answers, the fastest way to grow your real estate photography business is to focus on these three priorities:
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
          <h2 className={styles.sectionTitle}>The real estate photography market is huge</h2>
          <p className={styles.sectionSub}>
            In most markets, dozens or hundreds of homes are listed every week, each listing needs professional photos, and the same agents list properties repeatedly. The opportunity already exists — the key is connecting with the right agents consistently.
          </p>

          <div className={styles.problemCard}>
            <i className={`fas fa-building ${styles.problemIcon}`} aria-hidden="true"></i>
            <div>
              <h3>A small group of agents drives a large share of listings</h3>
              <p>
                Photographers who identify those active agents and build relationships with them often create steady streams of work instead of waiting for random inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Your growth roadmap</h2>
          <p className={styles.sectionSub}>Here&apos;s the simplest path to turning hidden opportunity into real photography bookings.</p>

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
            <p className={styles.insightEyebrow}>⚠️ The biggest misconception in real estate photography</p>
            <p className={styles.insightText}>
              Many photographers believe success comes only from taking better photos.
              <br />
              <br />
              Great photos matter, but the photographers building full-time businesses focus just as much on marketing systems, agent relationships, and consistent visibility. Once you build a system that connects you with agents regularly, the opportunity in your market becomes much easier to capture.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaPrimaryCard}>
            <h2>Want to turn this opportunity into real clients?</h2>
            <p>
              Inside my free community for real estate photographers, I show photographers how to build simple systems that connect them with agents listing homes in their market.
            </p>

            <div className={styles.ctaFeatureGrid}>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                How to find agents listing homes every week
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Outreach scripts that get responses
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Automation systems for follow-ups
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Local marketing strategies for photographers
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Systems for building a predictable client pipeline
              </span>
            </div>

            <Link href="/join" className="btn btn-cta-primary">
              Join the Community
            </Link>

            <p className={styles.smallPrint}>Free to join • Marketing systems • Photographer community</p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaSecondaryCard}>
            <h2>Stop missing opportunities</h2>
            <p>
              There are already hundreds of listings happening every week in most markets, and every one of those listings needs photography. The difference between photographers who struggle and those who grow is often having a simple system for connecting with the agents behind those homes.
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
                I&apos;m a real estate photographer and marketing automation specialist helping photographers build systems that attract agent clients and create consistent bookings. Inside the community I share marketing systems for photographers, outreach strategies, automation tools, and lead generation systems — all focused on helping photographers build predictable real estate photography businesses.
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
            <span>These systems help photographers move from missed opportunities to predictable growth.</span>
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