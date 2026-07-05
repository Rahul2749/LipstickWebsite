'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/useMediaQuery';
import styles from './IngredientsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const ingredients = [
  {
    name: 'Rose Extract',
    desc: 'Hand-harvested damask rose for unparalleled hydration and softness.',
    color: 'linear-gradient(135deg, #c4566a 0%, #4a1018 100%)'
  },
  {
    name: 'Vitamin E',
    desc: 'Antioxidant-rich protection against environmental stressors.',
    color: 'linear-gradient(135deg, #c9a96e 0%, #8a7043 100%)'
  },
  {
    name: 'Natural Oils',
    desc: 'A proprietary blend of jojoba and argan oils for a seamless glide.',
    color: 'linear-gradient(135deg, #dfc291 0%, #a68b5e 100%)'
  }
];

export default function IngredientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current || isMobile) return;

    const ctx = gsap.context(() => {
      // Parallax float effect for cards
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        
        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 50%',
              scrub: 1
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>The Alchemy of Beauty</h2>
          <p className={styles.subtitle}>Formulated with the world's most precious ingredients.</p>
        </div>
        
        <div className={styles.grid}>
          {ingredients.map((ing, i) => (
            <div 
              key={ing.name} 
              className={styles.card}
              ref={el => { cardsRef.current[i] = el; }}
            >
              <div 
                className={styles.sphere} 
                style={{ background: ing.color }}
              ></div>
              <div className={styles.cardContent}>
                <h3>{ing.name}</h3>
                <p>{ing.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
