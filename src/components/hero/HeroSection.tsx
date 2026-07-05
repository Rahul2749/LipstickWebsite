'use client';

import { useRef, useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameCanvas from './FrameCanvas';
import { useFramePreloader } from '@/hooks/useFramePreloader';
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

  // Frame ref for GSAP (avoids React re-renders during scroll)
  const frameRef = useRef({ value: 0 });
  const hasFinishedRef = useRef(false);
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Handle loading complete
  const handleLoadComplete = useCallback(() => {
    setIsReady(true);
    // Fade in hero
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  // Setup GSAP ScrollTrigger after frames loaded
  useEffect(() => {
    if (!isReady || !sectionRef.current || !pinRef.current || frames.length === 0) return;

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

          // Toggle hidden class instantly as soon as user starts scrolling
          if (indicatorRef.current) {
            if (p > 0.005) {
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
  }, [isReady, frames, showContent]);

  return (
    <>
      {/* Loading Screen — covers everything until all frames loaded */}
      {!isReady && (
        <LoadingScreen progress={progress} onComplete={handleLoadComplete} />
      )}

      <section
        ref={sectionRef}
        className={styles.section}
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

          {/* Scroll Down Indicator */}
          <div ref={indicatorRef} className={styles.scrollIndicator}>
            <span>Scroll Down</span>
            <div className={styles.indicatorLine}></div>
          </div>

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
