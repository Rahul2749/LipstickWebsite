'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './HeroVideo.module.css';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // Small delay for smoother transition
      setTimeout(() => setIsReady(true), 100);
    };

    video.addEventListener('canplaythrough', handleCanPlay);

    // Also try to detect if already loaded
    if (video.readyState >= 3) {
      setIsReady(true);
    }

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* Poster / fallback background */}
      <div className={styles.poster} />

      <video
        ref={videoRef}
        className={`${styles.video} ${isReady ? styles.videoReady : ''}`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/luxury-lipstick-hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
