"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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

        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#free-tools">Free Tools</Link>
          <Link href="/#community">Community</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/join" className={`btn btn-outline ${styles.navBtn}`}>
            Join Free →
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        {/* Mobile Navigation Dropdown */}
        <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ""}`}>
          <Link href="/#how-it-works" onClick={closeMenu}>How It Works</Link>
          <Link href="/#free-tools" onClick={closeMenu}>Free Tools</Link>
          <Link href="/#community" onClick={closeMenu}>Community</Link>
          <Link href="/#faq" onClick={closeMenu}>FAQ</Link>
          <Link href="/join" className={`btn btn-outline ${styles.navBtn}`} onClick={closeMenu}>
            Join Free →
          </Link>
        </div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </header>
  );
}

