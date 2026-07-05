'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './TestimonialsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "The velvet matte formula is completely weightless. It feels like wearing absolutely nothing, yet the pigment payoff is incredible.",
    author: "Elena Rostova",
    title: "Vogue Contributor",
    image: "/images/avatars/avatar-1.png"
  },
  {
    quote: "I wore it for a full campaign shoot under hot studio lights. Twelve hours later, the hydration was still there, no feathering at all.",
    author: "Sarah Sterling",
    title: "Editorial Makeup Artist",
    image: "/images/avatars/avatar-2.png"
  },
  {
    quote: "A masterpiece of clean luxury. The ingredients list is pure and skin-loving, and the signature packaging is a work of art.",
    author: "Margot de Valois",
    title: "Luxury Consultant",
    image: "/images/avatars/avatar-3.png"
  }
];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        // Floating hover parallax effect
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          gsap.to(card, {
            x: x * 0.1,
            y: y * 0.1,
            rotateX: -y * 0.05,
            rotateY: x * 0.05,
            duration: 0.5,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        });

        // Trigger reveal on scroll
        gsap.fromTo(card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Voices of Luxe</span>
          <h2 className={styles.title}>The Devotion</h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <div 
              key={t.author} 
              className={styles.card}
              ref={el => { cardsRef.current[i] = el; }}
            >
              <div className={styles.avatar}>
                <img src={t.image} alt={t.author} className={styles.avatarImg} />
              </div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.meta}>
                <h4 className={styles.author}>{t.author}</h4>
                <p className={styles.role}>{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
