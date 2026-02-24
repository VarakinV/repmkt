import styles from "./page.module.css";
import Link from "next/link";
import HeroParticles from "@/components/HeroParticles";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <HeroParticles />
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <span className={styles.heroBadge}>⚡ Join 500+ photographers</span>
              <h1>Install Your Realtor Acquisition Engine.</h1>
              <p className={styles.heroSubheadline}>
                Stop chasing realtors.<br />
                Build a predictable system that gets you in front of listings at the right moment — automatically.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/join" className="btn btn-primary">
                  Join the Free Community →
                </Link>
                <Link href="#how-it-works" className="btn btn-outline">
                  See How It Works →
                </Link>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <i className="fas fa-check-circle"></i>
                  <span>No credit card</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.phoneMockup}>
                <div className={styles.smsMessage}>
                  <p>🏠 Congrats on the new listing at 123 Main St! 🎉</p>
                  <p>
                    Want a FREE custom social media reel to help market it?
                    Reply YES
                  </p>
                </div>
                <div className={styles.smsReply}>
                  <p>YES! Send it over 👋</p>
                </div>
                <div className={styles.generatingBox}>
                  <p>⚡ Generating your reel... (85% complete)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className={styles.problem}>
        <div className="container">
          <h2>
            You&apos;re An Amazing Photographer. So Why Is Getting Realtor Clients
            Such A Struggle?
          </h2>
          <div className={styles.problemGrid}>
            <div className={styles.problemItem}>
              <i className="fas fa-times-circle"></i>
              <div>
                <strong>Cold Outreach Feels Spammy</strong>
                <p>
                  You hate bothering people, and realtors hate being bothered.
                  Your messages go unanswered.
                </p>
              </div>
            </div>
            <div className={styles.problemItem}>
              <i className="fas fa-chart-line"></i>
              <div>
                <strong>Inconsistent Income</strong>
                <p>
                  Feast or famine cycles make it impossible to plan or grow your
                  business.
                </p>
              </div>
            </div>
            <div className={styles.problemItem}>
              <i className="fas fa-dollar-sign"></i>
              <div>
                <strong>Wasted Marketing Spend</strong>
                <p>
                  $500 on Facebook ads, $1,000 on mailers... and you get
                  crickets.
                </p>
              </div>
            </div>
            <div className={styles.problemItem}>
              <i className="fas fa-users"></i>
              <div>
                <strong>Realtors Already Have &quot;Their Guy&quot;</strong>
                <p>
                  Breaking through feels impossible. They&apos;ve worked with the
                  same photographer for years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.solution} id="how-it-works">
        <div className="container">
          <h2>Introducing The Realtor Acquisition Engine</h2>
          <p className={styles.solutionSubhead}>
            A fully automated system that delivers value to realtors at the
            exact moment they need it most.
          </p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>🔍</div>
              <h3>Detect</h3>
              <p>
                Our system scrapes new listings hourly, detecting exactly when a
                realtor lists a property.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>🤝</div>
              <h3>Deliver Value</h3>
              <p>
                They receive a text offering a free marketing tool. Most reply
                YES.
              </p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📸</div>
              <h3>Convert</h3>
              <p>
                While the tool generates, they see your branding and a special
                offer. They book their first shoot.
              </p>
            </div>
          </div>

          <div className={styles.testimonialQuote}>
            <i className="fas fa-quote-left"></i>
            <p>
              &quot;I sent this to a realtor I&apos;d been trying to reach for 6 months.
              She ignored every email. The day she listed a new property, she
              got the SMS, used the reel generator, and booked me 2 hours
              later.&quot;
            </p>
            <p className={styles.quoteAuthor}>— Mike R., Growth Lab Member</p>
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section className={styles.freeTools} id="free-tools">
        <div className="container">
          <h2>4 Free Tools That Realtors Actually Use</h2>
          <p className={styles.freeToolsSubhead}>
            Give them instant marketing assets. Get warm leads and booked shoots
            in return.
          </p>

          <div className={styles.toolsGrid}>
            <div className={styles.toolCard}>
              <i className="fas fa-film"></i>
              <h3>Reel Generator</h3>
              <p>Creates 3 vertical reels from property photos in 60 seconds</p>
            </div>
            <div className={styles.toolCard}>
              <i className="fas fa-file-pdf"></i>
              <h3>Flyer Generator</h3>
              <p>Print-ready PDF property flyers with agent info</p>
            </div>
            <div className={styles.toolCard}>
              <i className="fas fa-play-circle"></i>
              <h3>Slideshow Generator</h3>
              <p>Cinematic video slideshows for social media</p>
            </div>
            <div className={styles.toolCard}>
              <i className="fas fa-qrcode"></i>
              <h3>QR Generator</h3>
              <p>4 customizable QR codes for open houses</p>
            </div>
          </div>

          <div className={styles.highlightBox}>
            <i className="fas fa-lightbulb"></i>
            <h3>While the tool generates, they see YOUR branding and a special offer.</h3>
            <p>Conversion rates on this offer: 25-40%</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={styles.community} id="community">
        <div className="container">
          <h2>This Isn&apos;t Just Theory. It&apos;s A Done-For-You System.</h2>
          <p className={styles.communitySubhead}>
            And you can start using it today—for free.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <i className="fas fa-robot"></i>
              <div>
                <h4>Automation Blueprints</h4>
                <p>Complete n8n workflows for scraping Realtor.ca and Zillow</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <i className="fas fa-comment-dots"></i>
              <div>
                <h4>SMS Templates</h4>
                <p>The exact scripts that get &quot;YES&quot; replies from realtors</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <i className="fas fa-tools"></i>
              <div>
                <h4>The 4 Free Tools</h4>
                <p>Access to the same tools that convert realtors</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <i className="fas fa-video"></i>
              <div>
                <h4>DIY Video Training</h4>
                <p>Step-by-step tutorials for every piece of the system</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <i className="fas fa-users"></i>
              <div>
                <h4>Community Q&A</h4>
                <p>Ask questions, get answers, see what&apos;s working</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <i className="fas fa-calendar-alt"></i>
              <div>
                <h4>Weekly Live Trainings</h4>
                <p>New strategies, case studies, and open Q&A</p>
              </div>
            </div>
          </div>

          <div className={styles.fastStart}>
            <h4>🚀 The 14-Day Fast Start</h4>
            <ol>
              <li><strong>Day 1:</strong> Watch the 15-min onboarding video</li>
              <li><strong>Day 3:</strong> Set up your n8n workflows</li>
              <li><strong>Day 5:</strong> Configure your Apify scraper for your city</li>
              <li><strong>Day 7:</strong> First realtor contacts detected</li>
              <li><strong>Day 10:</strong> First SMS goes out</li>
              <li><strong>Day 14:</strong> First &quot;YES&quot; reply and free tool generated</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className="container">
          <h2>From Zero To Fully Booked: Real Photographers, Real Results</h2>

          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                &quot;I was spending $800/month on Facebook ads getting nothing. Your
                system booked me 12 shoots in 30 days. The SMS automation is pure
                genius.&quot;
              </p>
              <div className={styles.testimonialAuthor}>Mike R.</div>
              <div className={styles.testimonialLocation}>Toronto</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                &quot;The free tools alone are worth 10x the membership. My realtors
                LOVE the reel generator—they use it for every listing.&quot;
              </p>
              <div className={styles.testimonialAuthor}>Jessica T.</div>
              <div className={styles.testimonialLocation}>Austin</div>
            </div>
            <div className={styles.testimonialCard}>
              <div className={styles.stars}>★★★★★</div>
              <p>
                &quot;I joined because I was tired of cold calling. Now my system runs
                itself while I shoot. Best decision I&apos;ve made for my business.&quot;
              </p>
              <div className={styles.testimonialAuthor}>David K.</div>
              <div className={styles.testimonialLocation}>Melbourne</div>
            </div>
          </div>

          <div className={styles.statsBar}>
            <div>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Members</div>
            </div>
            <div>
              <div className={styles.statNumber}>12</div>
              <div className={styles.statLabel}>Countries</div>
            </div>
            <div>
              <div className={styles.statNumber}>15K+</div>
              <div className={styles.statLabel}>Realtor Outreach</div>
            </div>
            <div>
              <div className={styles.statNumber}>4.9★</div>
              <div className={styles.statLabel}>Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2>Your First 30 Days In The Growth Lab</h2>
          <p className={styles.howItWorksSubhead}>
            From join to first lead in 14 days. Here&apos;s exactly what happens.
          </p>

          <div className={styles.pathSteps}>
            <div className={styles.pathStep}>
              <div className={styles.pathNumber}>1</div>
              <h4>Join Free</h4>
              <p>Click the button, fill out the form (2 min)</p>
            </div>
            <div className={styles.pathStep}>
              <div className={styles.pathNumber}>2</div>
              <h4>Get Oriented</h4>
              <p>Book your 15-min welcome call or dive into training</p>
            </div>
            <div className={styles.pathStep}>
              <div className={styles.pathNumber}>3</div>
              <h4>Build Your System</h4>
              <p>Follow step-by-step videos to set up your automations</p>
            </div>
            <div className={styles.pathStep}>
              <div className={styles.pathNumber}>4</div>
              <h4>Launch & Learn</h4>
              <p>First SMS goes out. You get replies. You grow.</p>
            </div>
          </div>

          <div className={styles.milestones}>
            <div className={styles.milestoneGrid}>
              <div className={styles.milestone}>
                Week 1 <small>System built</small>
              </div>
              <div className={styles.milestone}>
                Week 2 <small>First outreach</small>
              </div>
              <div className={styles.milestone}>
                Week 3 <small>First &quot;YES&quot;</small>
              </div>
              <div className={styles.milestone}>
                Week 4 <small>First booking</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta} id="cta">
        <div className="container">
          <h2>Join 500+ Photographers Who Never Worry About Realtor Clients</h2>
          <p>
            Start with the free community. No credit card. No commitment. Just a
            proven system and a group of photographers who want to see you win.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="#" className="btn btn-cta-primary">
              Join the Free Community →
            </Link>
            <Link href="#" className="btn btn-cta-secondary">
              See How The System Works →
            </Link>
            <Link href="#" className="btn btn-cta-secondary">
              Explore the Growth Lab →
            </Link>
          </div>

          <p className={styles.guarantee}>
            <i className="fas fa-lock"></i> Takes 2 minutes. No credit card.
            Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq} id="faq">
        <div className="container">
          <h2>Questions? We&apos;ve Got Answers.</h2>

          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                What exactly do I get in the free community?
              </div>
              <div className={styles.faqAnswer}>
                Instant access to automation blueprints (n8n workflows, Apify
                scraper configs), the 4 free tools, SMS/email templates, weekly
                live trainings, and community Q&A.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Do I need to be technical to use this?
              </div>
              <div className={styles.faqAnswer}>
                If you can follow a YouTube tutorial, you can build this system.
                Our training is step-by-step with community support. If you want
                us to do it for you, that&apos;s available separately.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Does this work outside the US and Canada?
              </div>
              <div className={styles.faqAnswer}>
                Yes. Members in Australia, the UK, and Europe use the system
                with their local MLS equivalents. The principles are universal.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                How long until I see my first lead?
              </div>
              <div className={styles.faqAnswer}>
                Most members get their first &quot;YES&quot; reply within 7-14 days of
                launching. First bookings typically happen in weeks 2-4.
              </div>
            </div>
            <div className={styles.faqItem}>
              <div className={styles.faqQuestion}>
                Is this really free? What&apos;s the catch?
              </div>
              <div className={styles.faqAnswer}>
                No catch. The free community exists to show you what&apos;s possible.
                You can stay free forever and still get massive value. We have
                paid tiers for deeper training and done-for-you setup.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
