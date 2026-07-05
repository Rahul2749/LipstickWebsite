'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TextureSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function TextureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !maskRef.current) return;

    const ctx = gsap.context(() => {
      // Pin section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
      });

      // Animate clip path expansion (smear spreading effect)
      gsap.fromTo(maskRef.current,
        { clipPath: 'polygon(45% 20%, 55% 20%, 53% 80%, 47% 80%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=120%',
            scrub: 1,
          }
        }
      );

      // Animate minimal text fading in
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top -50%',
            end: 'top -120%',
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background/Before Texture */}
      <div className={styles.bgContainer}>
        <div className={styles.beforeBg} />
      </div>

      {/* Spreading Smear / After Texture */}
      <div ref={maskRef} className={styles.smearContainer}>
        <img 
          src="/images/campaign/texture-macro.png" 
          alt="Lipstick Smear Texture Close-up" 
          className={styles.smearImage} 
        />
      </div>

      <div ref={textRef} className={styles.textContent}>
        <h2 className={styles.title}>The Sensory Touch</h2>
        <p className={styles.description}>
          Experience the weightless glide. A cream-to-powder texture that spreads effortlessly, leaving a flawless velvet matte veil.
        </p>
      </div>
    </section>
  );
}
