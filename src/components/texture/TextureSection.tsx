'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TextureSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function TextureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax scroll on the texture image
      gsap.fromTo(imageRef.current,
        { scale: 1.1, yPercent: -10 },
        {
          scale: 1,
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // Staggered reveal for text content
      gsap.fromTo(textRef.current?.children || [],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Left Side: Elegant Framed Texture Close-up */}
        <div className={styles.imageCol}>
          <div className={styles.frame}>
            <img 
              ref={imageRef}
              src="/images/campaign/texture-macro.png" 
              alt="Lipstick Smear Texture Close-up" 
              className={styles.smearImage} 
            />
          </div>
        </div>

        {/* Right Side: Editorial Text */}
        <div ref={textRef} className={styles.textCol}>
          <span className={styles.badge}>Sensory Detail</span>
          <h2 className={styles.title}>The Creamy Glide</h2>
          <p className={styles.description}>
            A rich, decadent formula that melts on touch. Micro-milled pigments suspended in natural plant oils offer a seamless application with a zero-weight matte finish.
          </p>
          <div className={styles.meta}>
            <span className={styles.metaLabel}>Texture:</span> Matte Cream-to-Powder
          </div>
        </div>
      </div>
    </section>
  );
}
