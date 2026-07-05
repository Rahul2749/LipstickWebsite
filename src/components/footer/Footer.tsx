'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Upper Footer Links */}
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <h2 className={styles.logo}>LUXE</h2>
            <p className={styles.tagline}>Luxury Beyond Color.</p>
          </div>
          
          <div className={styles.linkCol}>
            <h3>Collection</h3>
            <ul>
              <li><a href="#collection">Lipsticks</a></li>
              <li><a href="#philosophy">Philosophy</a></li>
              <li><a href="#ingredients">Ingredients</a></li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h3>Brand</h3>
            <ul>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#campaign">Campaign</a></li>
              <li><a href="#testimonials">Devotion</a></li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Lower Footer */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            &copy; {currentYear} Luxe Beauty. All rights reserved.
          </p>
          <div className={styles.credits}>
            Designed for Award-Winning Digital Art direction.
          </div>
        </div>
      </div>
    </footer>
  );
}
