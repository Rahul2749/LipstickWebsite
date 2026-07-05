'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ColorCollection.module.css';

gsap.registerPlugin(ScrollTrigger);

const shades = [
  {
    name: 'Velvet Crimson',
    desc: 'Our signature deep velvet red. Bold, classic, unforgettable.',
    image: '/images/products/velvet-crimson.png',
    bg: '#fdf6f7'
  },
  {
    name: 'Nude Cashmere',
    desc: 'A soft, everyday nude that perfectly complements any skin tone.',
    image: '/images/products/nude-cashmere.png',
    bg: '#faf2ee'
  },
  {
    name: 'Rose Gold',
    desc: 'Shimmering soft pink with real gold pearlescent pigments.',
    image: '/images/products/rose-gold.png',
    bg: '#faf0f2'
  },
  {
    name: 'Midnight Plum',
    desc: 'A dramatic, deep purple for the ultimate evening statement.',
    image: '/images/products/midnight-plum.png',
    bg: '#f5effa'
  }
];

export default function ColorCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    // Calculate how far to scroll horizontally
    // 4 cards * 100vw = 400vw total width. We need to move left by 300vw.
    const scrollWidth = scrollContainerRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(scrollContainerRef.current, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          anticipatePin: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {shades.map((shade, i) => (
          <div 
            key={shade.name} 
            className={styles.panel}
            style={{ backgroundColor: shade.bg }}
          >
            <div className={styles.content}>
              <div className={styles.textWrap}>
                <span className={styles.number}>0{i + 1}</span>
                <h2>{shade.name}</h2>
                <p>{shade.desc}</p>
                <button className={styles.exploreBtn}>Explore Shade</button>
              </div>
              <div className={styles.imageWrap}>
                <img 
                  src={shade.image}
                  alt={shade.name}
                  className={styles.image}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
