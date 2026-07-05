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
  },
  {
    name: 'Nude Cashmere',
    desc: 'A soft, everyday nude that perfectly complements any skin tone.',
    image: '/images/products/nude-cashmere.png',
  },
  {
    name: 'Rose Gold',
    desc: 'Shimmering soft pink with real gold pearlescent pigments.',
    image: '/images/products/rose-gold.png',
  },
  {
    name: 'Midnight Plum',
    desc: 'A dramatic, deep purple for the ultimate evening statement.',
    image: '/images/products/midnight-plum.png',
  }
];

export default function ColorCollection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered vertical fade-in reveal for each shade row
      rowsRef.current.forEach((row, i) => {
        if (!row) return;

        const leftCol = row.querySelector(`.${styles.leftCol}`);
        const rightCol = row.querySelector(`.${styles.rightCol}`);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });

        tl.fromTo(leftCol, 
          { x: i % 2 === 0 ? -40 : 40, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }
        )
        .fromTo(rightCol, 
          { x: i % 2 === 0 ? 40 : -40, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
          '-=1.0'
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>The Palette</span>
          <h2 className={styles.title}>The Color Collection</h2>
        </div>

        <div className={styles.rows}>
          {shades.map((shade, i) => (
            <div 
              key={shade.name} 
              className={`${styles.row} ${i % 2 === 1 ? styles.rowReverse : ''}`}
              ref={el => { rowsRef.current[i] = el; }}
            >
              {/* Left Column: Typography */}
              <div className={styles.leftCol}>
                <span className={styles.number}>0{i + 1}</span>
                <h3 className={styles.shadeName}>{shade.name}</h3>
                <p className={styles.desc}>{shade.desc}</p>
                <button className={styles.exploreBtn}>Explore Shade</button>
              </div>

              {/* Right Column: Image Frame */}
              <div className={styles.rightCol}>
                <div className={styles.imageFrame}>
                  <img 
                    src={shade.image}
                    alt={shade.name}
                    className={styles.image}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
