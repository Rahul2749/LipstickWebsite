'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PackagingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const components = [
  {
    title: 'Anodized Aluminum Cap',
    desc: 'Crafted from aircraft-grade aluminum, anodized in a soft, premium blush pink to prevent scratching and wear.',
    image: '/images/campaign/packaging-cap.png'
  },
  {
    title: 'Champagne Gold Ring',
    desc: 'A gold-plated structural accent ring debossed with our signature logo, linking the cap and base base.',
    image: '/images/products/philosophy-campaign.png'
  },
  {
    title: 'Precision Twist Mechanism',
    desc: 'Engineered with a heavy-weight structural core and a smooth twist torque that ensures effortless application.',
    image: '/images/campaign/packaging-bullet.png'
  }
];

export default function PackagingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal header on scroll
      gsap.fromTo(`.${styles.textContent}`,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
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
        {/* Left Column: Interactive Tab Info */}
        <div className={styles.textContent}>
          <span className={styles.badge}>Craftsmanship</span>
          <h2 className={styles.title}>Signature Packaging</h2>
          <p className={styles.desc}>
            An engineering marvel. Every detail of our packaging is meticulously engineered to provide an elite sensory ritual from the moment you hold it.
          </p>

          {/* Interactive Feature Accordion */}
          <div className={styles.accordion}>
            {components.map((comp, idx) => (
              <div 
                key={comp.title} 
                className={`${styles.tab} ${activeTab === idx ? styles.activeTab : ''}`}
                onMouseEnter={() => setActiveTab(idx)}
                onClick={() => setActiveTab(idx)}
              >
                <h3 className={styles.tabTitle}>
                  <span className={styles.tabNumber}>0{idx + 1}</span>
                  {comp.title}
                </h3>
                <div className={styles.tabContent}>
                  <p>{comp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Frame */}
        <div className={styles.visualCol}>
          <div className={styles.imageFrame}>
            {components.map((comp, idx) => (
              <img 
                key={comp.title}
                src={comp.image} 
                alt={comp.title} 
                className={`${styles.detailImage} ${activeTab === idx ? styles.visibleImage : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
