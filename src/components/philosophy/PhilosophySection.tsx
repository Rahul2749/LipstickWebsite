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
      // Smooth, high-performance scroll reveal without pinning or scrubbing
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%', // Trigger when the top of the section hits 75% down the viewport
          toggleActions: 'play none none none'
        },
      });

      tl.fromTo(headlineRef.current, 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(pointsRef.current?.children || [], 
        { x: -30, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(`.${styles.imageFrame}`,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' },
        '-=1.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className={styles.section}>
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
              loading="lazy"
              decoding="async"
              className={styles.campaignImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
