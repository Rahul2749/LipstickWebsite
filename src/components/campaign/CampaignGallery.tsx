'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/useMediaQuery';
import styles from './CampaignGallery.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function CampaignGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!containerRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      // Parallax scroll effects on images
      gsap.to(img1Ref.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to(img2Ref.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to(img3Ref.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });

      // Mask reveal for headers
      gsap.fromTo(`.${styles.title}`, 
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 50 },
        {
          clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)',
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>The Campaign</span>
          <h2 className={styles.title}>Editorial Devotion</h2>
        </div>

        <div className={styles.grid}>
          {/* Main Large Image */}
          <div ref={img1Ref} className={styles.galleryItemLarge}>
            <img 
              src="/images/campaign/editorial-1.png" 
              alt="Editorial model wearing deep red lipstick" 
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
            <div className={styles.itemMeta}>Campaign Editorial I</div>
          </div>

          {/* Medium Texture Detail */}
          <div ref={img2Ref} className={styles.galleryItemMedium}>
            <img 
              src="/images/campaign/texture-macro.png" 
              alt="Lipstick macro texture detail" 
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
            <div className={styles.itemMeta}>Tactile Smear Detail</div>
          </div>

          {/* Tall Lifestyle Image */}
          <div ref={img3Ref} className={styles.galleryItemTall}>
            <img 
              src="/images/campaign/brand-lifestyle.png" 
              alt="Luxury cosmetic setting" 
              loading="lazy"
              decoding="async"
              className={styles.image}
            />
            <div className={styles.itemMeta}>Luxe Vanity Setting</div>
          </div>
        </div>
      </div>
    </section>
  );
}
