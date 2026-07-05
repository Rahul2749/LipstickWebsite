'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import MagneticButton from '../ui/MagneticButton';
import styles from './HeroContent.module.css';

/**
 * Hero content — appears during scroll stage (~70%).
 * No content on initial page load. Only the cinematic frame sequence.
 * Content fades in subtly with luxury motion when triggered.
 */
export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      delay: 0.1,
    });

    // Badge appears first
    tl.fromTo(
      badgeRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 }
    )
      // Headline line-by-line reveal
      .fromTo(
        line1Ref.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4 },
        '-=0.8'
      )
      .fromTo(
        line2Ref.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4 },
        '-=1.0'
      )
      // Subtext fade in
      .fromTo(
        subtextRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        '-=0.7'
      )
      // CTA buttons appear
      .fromTo(
        ctaRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.content}>
      {/* Brand badge */}
      <div ref={badgeRef} className={styles.badge}>
        <span className={styles.badgeLine} />
        <span className={styles.badgeText}>The New Collection</span>
      </div>

      {/* Headline */}
      <h1 className={styles.headline}>
        <span className={styles.lineWrapper}>
          <span ref={line1Ref} className={styles.line}>
            Luxury Beyond
          </span>
        </span>
        <span className={styles.lineWrapper}>
          <span ref={line2Ref} className={styles.line}>
            Color
          </span>
        </span>
      </h1>

      {/* Supporting text */}
      <p ref={subtextRef} className={styles.subtext}>
        A velvet matte experience crafted for modern beauty.
      </p>

      {/* CTAs */}
      <div ref={ctaRef} className={styles.cta}>
        <MagneticButton variant="primary">
          Discover Collection
        </MagneticButton>
        <MagneticButton variant="secondary">
          Watch Story
        </MagneticButton>
      </div>
    </div>
  );
}
