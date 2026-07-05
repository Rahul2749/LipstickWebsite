'use client';

import { useRef, useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameCanvas from './FrameCanvas';
import HeroOverlay from './HeroOverlay';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useFramePreloader } from '@/hooks/useFramePreloader';
import LoadingScreen from '../loading/LoadingScreen';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// Lazy load Three.js scene + HeroContent
const LipstickScene = lazy(() => import('@/components/three/LipstickScene'));
const HeroContent = lazy(() => import('./HeroContent'));

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [threeOpacity, setThreeOpacity] = useState(0);
  const [showThreeScene, setShowThreeScene] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [particleOpacity, setParticleOpacity] = useState(0.2);
  const [isReady, setIsReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const mousePos = useMouseParallax(12, 0.05);
  const isMobile = useIsMobile();
  const { frames, progress, isLoaded } = useFramePreloader();

  // Frame ref for GSAP (avoids React re-renders during scroll)
  const frameRef = useRef({ value: 0 });

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
          const p = self.progress;

          // === FRAME SEQUENCE (0–100%) ===
          const targetFrame = Math.floor(p * (totalFrames - 1));
          if (targetFrame !== frameRef.current.value) {
            frameRef.current.value = targetFrame;
            setCurrentFrame(targetFrame);
          }

          // === PARTICLE OPACITY (0–30%) ===
          if (p < 0.3) {
            setParticleOpacity(0.2 + p * 1.5);
          }

          // === CONTENT REVEAL (~70%) ===
          if (p >= 0.65 && !showContent) {
            setShowContent(true);
          }
          
          if (p >= 0.65 && p <= 0.85) {
            const contentProgress = (p - 0.65) / 0.2;
            setContentOpacity(Math.min(1, contentProgress));
          } else if (p > 0.85 && p <= 0.92) {
            setContentOpacity(1);
          } else if (p > 0.92) {
            const fadeOut = 1 - ((p - 0.92) / 0.08);
            setContentOpacity(Math.max(0, fadeOut));
          }

          // === THREE.JS SCENE TRANSITION (85–100%) ===
          if (p > 0.82 && !showThreeScene) {
            setShowThreeScene(true);
          }

          if (p >= 0.85) {
            const threeProgress = (p - 0.85) / 0.15;
            setThreeOpacity(Math.min(1, threeProgress));
            setCanvasOpacity(1 - threeProgress * 0.8);
          } else {
            setThreeOpacity(0);
            setCanvasOpacity(1);
          }

          // === MOUSE PARALLAX (decreases as we approach 3D scene) ===
          if (overlayRef.current) {
            const parallaxFactor = Math.max(0, 1 - p * 1.2);
            overlayRef.current.style.transform = `translate3d(${
              mousePos.current.x * 0.3 * parallaxFactor
            }px, ${
              mousePos.current.y * 0.2 * parallaxFactor
            }px, 0)`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady, frames, isMobile, mousePos, showContent, showThreeScene]);

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
              opacity={canvasOpacity}
            />
          )}

          {/* Overlay (gradient + particles) */}
          <div ref={overlayRef} className={styles.overlayWrapper}>
            <HeroOverlay particleOpacity={particleOpacity} />
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

          {/* Three.js Scene — appears at ~85% scroll */}
          {showThreeScene && (
            <Suspense fallback={null}>
              <LipstickScene
                opacity={threeOpacity}
                mouseX={mousePos.current.x}
                mouseY={mousePos.current.y}
                isMobile={isMobile}
              />
            </Suspense>
          )}
        </div>
      </section>
    </>
  );
}
