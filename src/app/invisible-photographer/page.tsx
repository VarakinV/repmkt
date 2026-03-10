import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";
import styles from "./page.module.css";

const roadmap = [
  {
    title: "Identify active listing agents",
    text: "Your best clients are agents listing homes every week. Find them, and you find your ideal prospects.",
  },
  {
    title: "Reach out and introduce",
    text: "Most photographers never do this. A simple introduction can start a relationship that turns into years of bookings.",
  },
  {
    title: "Follow up consistently",
    text: "No response is normal. Stay on their radar, and when they need photos, they remember you.",
  },
  {
    title: "Turn first shoots into repeat clients",
    text: "One booking leads to repeat listings, referrals, and the stable monthly income every photographer wants.",
  },
];

const learningItems = [
  {
    icon: "fas fa-users",
    text: "Find agents listing homes automatically",
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
    icon: "fas fa-chart-line",
    text: "Grow your photography business",
  },
];

export const metadata: Metadata = {
  title: "The Invisible Photographer | RE Photography Growth Lab",
  description: "Quiz result page for photographers who need more visibility and more agent discovery.",
};

export default function InvisiblePhotographerPage() {
  return (
    <main className={styles.page}>
      <section className={styles.heroBand}>
        <HeroParticles />
        <div className="container">
          <div className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.kicker}>Quiz Result</span>
              <h1>Your Result: The Invisible Photographer</h1>
              <p className={styles.lead}>
                You have the skills to shoot great real estate photos… but agents don&apos;t know you exist yet.
              </p>
              <p className={styles.heroText}>
                Most photographers at this stage aren&apos;t struggling with quality. They&apos;re struggling with visibility.
              </p>
            </div>
            <div className={styles.heroImageWrap}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/Invisible-photographer-2.webp"
                alt="Invisible photographer result"
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
              <span>Your Business Visibility Score</span>
            </div>
            <div className={styles.scoreVisual}>
              <div className={styles.scoreCircles} aria-hidden="true">
                <span className={styles.scoreCircleFilled}>●</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
                <span className={styles.scoreCircleEmpty}>○</span>
              </div>
              <span className={styles.scoreNumber}>20/100</span>
            </div>
            <p className={styles.scoreNote}>
              <i className={`fas fa-chart-line ${styles.iconGreen}`} aria-hidden="true"></i>
              <span>
                This means your photography business has huge growth potential once agents start discovering you.
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
                <span>You likely take solid photos</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Have a portfolio or Instagram</span>
              </li>
              <li>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                <span>Get occasional inquiries</span>
              </li>
              <li>
                <i className={`fas fa-exclamation-triangle ${styles.iconWarning}`} aria-hidden="true"></i>
                <span>But consistent agent clients are missing.</span>
              </li>
            </ul>
            <p className={styles.relianceNote}>
              That usually happens when photographers rely on: referrals, random inquiries, or hoping agents find them online.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.lightBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            The problem isn&apos;t your photography <span className={styles.highlight}>— it&apos;s visibility</span>
          </h2>
          <p className={styles.sectionSub}>
            Every week in your city, hundreds of homes get listed, dozens of agents need photography, and the same agents list repeatedly. But most photographers are invisible to those agents. Not because their photos aren&apos;t good — because no one introduced them yet.
          </p>

          <div className={styles.problemCard}>
            <i className={`fas fa-home ${styles.problemIcon}`} aria-hidden="true"></i>
            <div>
              <h3>Relationship business</h3>
              <p>
                Agents hire photographers they know, trust, and remember. Right now they simply haven&apos;t discovered you yet. And that&apos;s fixable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Your growth roadmap</h2>
          <p className={styles.sectionSub}>The exact progression from invisible → consistently booked.</p>

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
            <p className={styles.insightEyebrow}>⚠️ What most photographers get wrong</p>
            <p className={styles.insightText}>
              They try to grow through Instagram posts, random Facebook ads, or hoping agents search Google.
              <br />
              <br />
              But the fastest way is directly connecting with agents listing homes. Once you have a list of agents and a simple outreach system, your business becomes predictable.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaPrimaryCard}>
            <h2>Want to fix this fast?</h2>
            <p>
              I built a free community for real estate photographers where I share the exact systems used to grow photography businesses.
            </p>

            <div className={styles.ctaFeatureGrid}>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Find agents listing weekly
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Outreach scripts that work
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Automation &amp; follow-ups
              </span>
              <span className={styles.ctaFeature}>
                <i className={`fas fa-check-circle ${styles.iconGreen}`} aria-hidden="true"></i>
                Local SEO &amp; marketing systems
              </span>
            </div>

            <Link href="/join" className="btn btn-cta-primary">
              Join the Real Estate Photographer Community
            </Link>

            <p className={styles.smallPrint}>Free to join • Step-by-step training • Photographer community</p>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <div className={styles.ctaSecondaryCard}>
            <h2>Want the full system?</h2>
            <p>
              Inside the community you&apos;ll see how photographers build systems that bring consistent bookings — instead of relying on random referrals, slow seasons, or hoping agents find you.
            </p>
            <Link href="/join" className="btn btn-outline">
              Join the Free Community
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
                I&apos;m a real estate photographer and marketing automation specialist helping photographers build systems that consistently attract agent clients. Inside the community I share marketing systems, automation tools, outreach strategies, and SEO — all focused on one thing: <span className={styles.highlight}>getting more real estate photography bookings.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.whiteBand} ${styles.sectionBand}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What photographers are learning inside</h2>

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
            <span>Join photographers already building predictable pipelines</span>
            <Link href="/join" className={styles.inlineLink}>
              → join free
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

