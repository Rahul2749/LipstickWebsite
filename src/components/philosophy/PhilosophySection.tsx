'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PhilosophySection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const pointsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Pinning the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      });

      // Animate headline and points
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: '+=80%',
          scrub: 1,
        },
      });

      tl.fromTo(headlineRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
      )
      .fromTo(pointsRef.current?.children || [], 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Left column: Typography and values */}
        <div className={styles.content}>
          <h2 ref={headlineRef} className={styles.headline}>
            Beauty, Crafted<br />to Perfection.
          </h2>
          <ul ref={pointsRef} className={styles.points}>
            <li>
              <span className={styles.line}></span>
              Velvet Matte Finish
            </li>
            <li>
              <span className={styles.line}></span>
              12-Hour Wear
            </li>
            <li>
              <span className={styles.line}></span>
              Skin-Loving Formula
            </li>
            <li>
              <span className={styles.line}></span>
              Cruelty Free
            </li>
          </ul>
        </div>

        {/* Right column: Premium editorial product visual */}
        <div className={styles.visualCol}>
          <div className={styles.imageFrame}>
            <img 
              src="/images/products/philosophy-campaign.png" 
              alt="Luxe Lipstick Campaign" 
              className={styles.campaignImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
