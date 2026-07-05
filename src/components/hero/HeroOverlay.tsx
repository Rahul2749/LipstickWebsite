'use client';

import { useRef, useEffect, useCallback } from 'react';
import styles from './HeroOverlay.module.css';

interface HeroOverlayProps {
  particleOpacity?: number;
}

/**
 * Premium overlay with gradient + vignette + shimmer particles.
 * Particles are canvas-based for lightweight GPU rendering.
 */
export default function HeroOverlay({ particleOpacity = 0.3 }: HeroOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      flickerSpeed: number;
      flickerOffset: number;
    }>
  >([]);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(60, Math.floor((width * height) / 25000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.1 - Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.5,
      flickerSpeed: 0.5 + Math.random() * 2,
      flickerOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;

        // Shimmer/flicker effect
        const flicker =
          0.5 + 0.5 * Math.sin(time * p.flickerSpeed + p.flickerOffset);
        const alpha = p.opacity * flicker * particleOpacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles, particleOpacity]);

  return (
    <div className={styles.overlay}>
      <div className={styles.gradient} />
      <div className={styles.vignette} />
      <canvas
        ref={canvasRef}
        className={styles.particles}
        aria-hidden="true"
      />
    </div>
  );
}
