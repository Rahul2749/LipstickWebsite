'use client';

import { useRef, useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameCanvas from './FrameCanvas';
import { useFramePreloader } from '@/hooks/useFramePreloader';
import { useIsMobile } from '@/hooks/useMediaQuery';
import LoadingScreen from '../loading/LoadingScreen';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// Lazy load HeroContent
const HeroContent = lazy(() => import('./HeroContent'));

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const { frames, progress, isLoaded } = useFramePreloader();
  const isMobile = useIsMobile();

  // Frame ref for GSAP (avoids React re-renders during scroll)
  const frameRef = useRef({ value: 0 });
  const hasFinishedRef = useRef(false);
  const indicatorRef = useRef<HTMLButtonElement>(null);

  // Handle loading complete
  const handleLoadComplete = useCallback(() => {
    setIsReady(true);
    if (isMobile) {
      setShowContent(true);
      setContentOpacity(1);
    }
    // Fade in hero
    setTimeout(() => setHeroVisible(true), 100);
  }, [isMobile]);

  // Handle smooth scroll down to next section
  const handleScrollDown = useCallback(() => {
    const target = document.getElementById('philosophy');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Setup GSAP ScrollTrigger after frames loaded
  useEffect(() => {
    if (!isReady || isMobile || !sectionRef.current || !pinRef.current || frames.length === 0) return;

    const totalFrames = frames.length;

    const ctx = gsap.context(() => {
      // Main scroll-driven timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        pin: pinRef.current,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          let p = self.progress;

          // Toggle hidden class instantly as soon as user scrolls past 10% progress
          if (indicatorRef.current) {
            if (p > 0.10) {
              indicatorRef.current.classList.add(styles.hidden);
            } else {
              indicatorRef.current.classList.remove(styles.hidden);
            }
          }

          // Once the animation fully finishes (reaches 98%), lock it.
          // Otherwise, allow normal forward/backward scrubbing.
          if (p >= 0.98) {
            hasFinishedRef.current = true;
          }

          if (hasFinishedRef.current) {
            p = 1.0;
          }

          // === FRAME SEQUENCE ===
          const targetFrame = Math.floor(p * (totalFrames - 1));
          if (targetFrame !== frameRef.current.value) {
            frameRef.current.value = targetFrame;
            setCurrentFrame(targetFrame);
          }

          // === CONTENT REVEAL (~70%) ===
          if (p >= 0.65 && !showContent) {
            setShowContent(true);
          }
          
          if (p >= 0.65 && p <= 0.85) {
            const contentProgress = (p - 0.65) / 0.2;
            setContentOpacity(Math.min(1, contentProgress));
          } else if (p > 0.85) {
            setContentOpacity(1);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, isMobile, frames, showContent]);

  useEffect(() => {
    if (!isReady || !isMobile) return;

    setCurrentFrame(Math.min(10, Math.max(0, frames.length - 1)));
    setShowContent(true);
    setContentOpacity(1);
  }, [frames.length, isMobile, isReady]);

  return (
    <>
      {/* Loading Screen — covers everything until all frames loaded */}
      {!isReady && (
        <LoadingScreen progress={progress} onComplete={handleLoadComplete} />
      )}

      <section
        ref={sectionRef}
        className={`${styles.section} ${isMobile ? styles.mobileSection : ''}`}
        style={{ visibility: heroVisible ? 'visible' : 'hidden' }}
      >
        <div ref={pinRef} className={styles.pin}>
          {/* Frame Sequence Canvas */}
          {frames.length > 0 && (
            <FrameCanvas
              frames={frames}
              currentFrame={currentFrame}
              opacity={1}
            />
          )}

          {/* Scroll Down Indicator (Button) */}
          <button 
            ref={indicatorRef} 
            className={styles.scrollIndicator}
            onClick={handleScrollDown}
            aria-label="Scroll to reveal campaign details"
          >
            {/* Refined downward arrow connected to a vertical line */}
            <div className={styles.indicatorVisual}>
              <svg 
                width="16" 
                height="40" 
                viewBox="0 0 16 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="8" y1="0" x2="8" y2="34" stroke="#857B78" strokeWidth="1" strokeOpacity="0.6" />
                <path d="M4 30L8 34L12 30" stroke="#857B78" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.indicatorText}>Scroll to Reveal</span>
          </button>

          {/* Content — appears at ~70% scroll */}
          {showContent && (
            <div
              ref={contentWrapperRef}
              className={styles.contentWrapper}
              style={{ opacity: contentOpacity }}
            >
              <Suspense fallback={null}>
                <HeroContent />
              </Suspense>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
