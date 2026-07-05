'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FeaturedCollection.module.css';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    name: 'Velvet Crimson',
    price: '$48.00',
    image: '/images/products/velvet-crimson.png',
  },
  {
    name: 'Nude Cashmere',
    price: '$48.00',
    image: '/images/products/nude-cashmere.png',
  },
  {
    name: 'Rose Gold',
    price: '$52.00',
    image: '/images/products/rose-gold.png',
  }
];

export default function FeaturedCollection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal on scroll
      gsap.fromTo(`.${styles.card}`,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Curated Selection</span>
          <h2 className={styles.title}>The Masterpieces</h2>
        </div>

        <div className={styles.grid}>
          {products.map((p, i) => (
            <div 
              key={p.name} 
              className={styles.card}
              ref={el => { cardsRef.current[i] = el; }}
            >
              {/* Product Card Body */}
              <div className={styles.productVisual}>
                {/* Floating Lipstick Bullet */}
                <div className={styles.productImageWrapper}>
                  <img src={p.image} alt={p.name} className={styles.productImage} />
                </div>
                
                {/* Luxury Floor Shadow */}
                <div className={styles.shadow}></div>
                
                {/* Mirror Reflection */}
                <div className={styles.reflectionWrapper}>
                  <img src={p.image} alt={p.name} className={styles.reflectionImage} />
                </div>
              </div>

              {/* Product Info */}
              <div className={styles.info}>
                <h3 className={styles.name}>{p.name}</h3>
                <span className={styles.price}>{p.price}</span>
                <button className={styles.cartBtn}>Purchase</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
