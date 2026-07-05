'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ExplodedLipstick from './ExplodedLipstick';
import styles from './PackagingSection.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function PackagingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <span className={styles.badge}>Craftsmanship</span>
          <h2 className={styles.title}>Signature Packaging</h2>
          <p className={styles.desc}>
            An engineering marvel. Anodized aluminum cap, gold-plated structural ring, and precision-engineered twist mechanism designed to last a lifetime.
          </p>
          <div className={styles.helperText}>
            Drag to orbit & inspect construction
          </div>
        </div>

        <div className={styles.canvasContainer}>
          <Canvas 
            gl={{ localClippingEnabled: true, antialias: true }} 
            camera={{ position: [0, 0, 4.5], fov: 45 }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.5} />
            <pointLight position={[-5, -5, -5]} intensity={0.2} />
            
            <ExplodedLipstick progress={scrollProgress} />
            
            <Environment preset="studio" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
