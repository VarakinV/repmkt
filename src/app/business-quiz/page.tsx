import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Business Quiz | RE Photography Growth Lab",
  description: "Take a 60-second quiz to discover what is limiting your real estate photography business.",
};

export default function BusinessQuizPage() {
  return (
    <>
      <LogoHeader />
      <main className={styles.page}>
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.contentCard}>
              <h1>What&apos;s Holding Back Your Real Estate Photography Business?</h1>
              <p className={styles.description}>
                Take this 60-second quiz to discover what&apos;s limiting your real estate photography business — and get a clear roadmap to fix it.
              </p>
              <a href="https://wwd.formaloo.me/izxp7w" className="btn btn-primary">
                Start Quiz
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}