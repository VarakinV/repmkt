import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <Link href="/" className={styles.footerLogoLink}>
              <Image
                src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/repmkt-icon-green.png"
                alt="Real Estate Photography Growth Lab"
                width={40}
                height={40}
              />
              <div className={styles.footerLogoText}>
                <span className={styles.footerLogoTitle}>GROWTH LAB</span>
                <span className={styles.footerLogoSubtitle}>REAL ESTATE PHOTOGRAPHY</span>
              </div>
            </Link>
            <p>
              Building predictable, automated client acquisition systems for
              real estate photographers worldwide.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/#community">Free Community</Link>
            <Link href="/#faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="https://www.youtube.com/@repmkt" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://www.instagram.com/photos4re/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/photos4re" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://www.linkedin.com/company/repmkt/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <h4>Legal</h4>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} Real Estate Photography Growth Lab. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}

