import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function LogoHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="https://repmkt.s3.ca-central-1.amazonaws.com/repmkt-images/repmkt-icon-green.png"
              alt="Real Estate Photography Growth Lab"
              width={40}
              height={40}
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>GROWTH LAB</span>
              <span className={styles.logoSubtitle}>REAL ESTATE PHOTOGRAPHY</span>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
}