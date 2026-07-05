'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  progress: number; // 0 to 100
  onComplete: () => void;
}

/**
 * Premium luxury loading screen — shown while frames preload.
 * Soft ivory aesthetic, thin progress bar, percentage counter.
 */
export default function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const rafRef = useRef<number>(0);

  // Smooth progress counter animation
  useEffect(() => {
    const animate = () => {
      setDisplayProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.08;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [progress]);

  // Trigger exit animation when loading complete
  useEffect(() => {
    if (progress >= 100 && !isExiting) {
      // Small delay before exit for polish
      const timer = setTimeout(() => {
        setIsExiting(true);
        // Wait for exit animation to complete
        const exitTimer = setTimeout(onComplete, 1200);
        return () => clearTimeout(exitTimer);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, isExiting, onComplete]);

  return (
    <div
      className={`${styles.loader} ${isExiting ? styles.exiting : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background */}
      <div className={styles.background} />

      {/* Content */}
      <div className={styles.content}>
        {/* Brand logo */}
        <div className={styles.brand}>
          <span className={styles.brandAccent} />
          <h1 className={styles.brandName}>LUXE</h1>
          <span className={styles.brandAccent} />
        </div>

        <p className={styles.brandTagline}>BEAUTY</p>

        {/* Loading bar */}
        <div className={styles.barContainer}>
          <div
            className={styles.barFill}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        {/* Percentage */}
        <span className={styles.percentage}>
          {Math.round(displayProgress)}%
        </span>
      </div>
    </div>
  );
}
