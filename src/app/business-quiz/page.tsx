import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LogoHeader from "@/components/LogoHeader";
import BusinessQuizEmbed from "./BusinessQuizEmbed";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Business Quiz | RE Photography Growth Lab",
  description: "Take the business quiz for real estate photographers.",
};

export default function BusinessQuizPage() {
  return (
    <>
      <LogoHeader />
      <main className={styles.page}>
        <section className={styles.embedSection}>
          <BusinessQuizEmbed />
        </section>
      </main>
      <Footer />
    </>
  );
}