'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BrandStory.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll on split panels
      gsap.fromTo(leftRef.current,
        { y: 50 },
        {
          y: -50,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      gsap.fromTo(rightRef.current,
        { y: -30 },
        {
          y: 30,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );

      // Color transition of background gradient
      gsap.to(sectionRef.current, {
        background: 'radial-gradient(circle, #faebeb 0%, #ecd0d0 100%)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div ref={leftRef} className={styles.left}>
          <span className={styles.badge}>The Legacy</span>
          <h2 className={styles.title}>Where Art Meets Beauty</h2>
          <p className={styles.paragraph}>
            Luxe Beauty was born out of a desire to create cosmetics that transcend color. Every formula is a symphony of raw, natural ingredients, advanced molecular skin science, and high-fashion aesthetics.
          </p>
          <p className={styles.paragraph}>
            We believe that applying makeup should be a sensory ritual of indulgence. Our gold-accented, heavy-weight lipstick bullet is designed to sit on your vanity as a sculpture, a statement of pure elegance.
          </p>
        </div>

        <div ref={rightRef} className={styles.right}>
          <div className={styles.imageWrapper}>
            <img 
              src="/images/campaign/brand-lifestyle.png" 
              alt="Luxury cosmetic vanity lifestyle" 
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
