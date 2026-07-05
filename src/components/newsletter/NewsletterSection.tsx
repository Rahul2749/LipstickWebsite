'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './NewsletterSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function NewsletterSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in animations
      gsap.fromTo(`.${styles.title}`,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );

      // Underline animation on input focus
      inputRef.current?.addEventListener('focus', () => {
        gsap.to(underlineRef.current, {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.out'
        });
      });

      inputRef.current?.addEventListener('blur', () => {
        gsap.to(underlineRef.current, {
          scaleX: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      });

      // Magnetic hover on join button
      buttonRef.current?.addEventListener('mousemove', (e) => {
        const rect = buttonRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(buttonRef.current, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      buttonRef.current?.addEventListener('mouseleave', () => {
        gsap.to(buttonRef.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        <span className={styles.badge}>Indulgence</span>
        <h2 className={styles.title}>Join The Society</h2>
        
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.inputWrapper}>
            <input 
              ref={inputRef}
              type="email" 
              placeholder="YOUR EMAIL" 
              className={styles.input} 
              required
            />
            {/* Animated Underline */}
            <div className={styles.baseLine}></div>
            <div ref={underlineRef} className={styles.activeLine}></div>
          </div>
          <button ref={buttonRef} type="submit" className={styles.submitBtn}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
