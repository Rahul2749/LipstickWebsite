'use client';

import { useEffect, useRef, useCallback } from 'react';
import styles from './FrameCanvas.module.css';

interface FrameCanvasProps {
  frames: Array<ImageBitmap | undefined>;
  currentFrame: number;
  opacity?: number;
}

/**
 * High-performance full-screen canvas for scroll-driven frame sequence.
 * 
 * - Renders directly to canvas (no DOM image swapping)
 * - Uses requestAnimationFrame for smooth rendering
 * - GPU-accelerated via will-change and translateZ(0)
 * - Only redraws when frame actually changes
 * - Handles resize with DPR awareness
 */
export default function FrameCanvas({ frames, currentFrame, opacity = 1 }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastFrameRef = useRef<number>(-1);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const getDrawableFrameIndex = useCallback((frameIndex: number) => {
    if (frames[frameIndex]) return frameIndex;

    for (let i = frameIndex - 1; i >= 0; i--) {
      if (frames[i]) return i;
    }

    for (let i = frameIndex + 1; i < frames.length; i++) {
      if (frames[i]) return i;
    }

    return -1;
  }, [frames]);

  // Setup canvas and context
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true, // Reduce latency
    });

    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctxRef.current = ctx;
    }

    sizeRef.current = { w, h, dpr };

    // Force redraw after resize
    lastFrameRef.current = -1;
  }, []);

  // Draw a single frame to canvas — cover-fit (like object-fit: cover)
  const drawFrame = useCallback((frameIndex: number) => {
    const ctx = ctxRef.current;
    const drawableIndex = getDrawableFrameIndex(frameIndex);
    if (!ctx || drawableIndex === -1) return;

    const img = frames[drawableIndex];
    if (!img) return;
    const { w, h, dpr } = sizeRef.current;

    const canvasW = w * dpr;
    const canvasH = h * dpr;

    // Calculate cover-fit dimensions
    const imgAspect = img.width / img.height;
    const canvasAspect = canvasW / canvasH;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      // Image wider — fit height, crop sides
      drawH = canvasH;
      drawW = canvasH * imgAspect;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    } else {
      // Image taller — fit width, crop top/bottom
      drawW = canvasW;
      drawH = canvasW / imgAspect;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [frames, getDrawableFrameIndex]);

  // Render loop — only redraws when frame changes
  useEffect(() => {
    const render = () => {
      const frameIdx = Math.max(0, Math.min(currentFrame, frames.length - 1));
      const drawableFrameIdx = getDrawableFrameIndex(frameIdx);

      if (drawableFrameIdx !== -1 && drawableFrameIdx !== lastFrameRef.current) {
        drawFrame(drawableFrameIdx);
        lastFrameRef.current = drawableFrameIdx;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentFrame, frames, drawFrame, getDrawableFrameIndex]);

  // Setup + resize handling
  useEffect(() => {
    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  // Draw first frame immediately when frames arrive
  useEffect(() => {
    if (frames.length > 0 && ctxRef.current) {
      lastFrameRef.current = -1; // Force redraw
    }
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
