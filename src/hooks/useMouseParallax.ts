'use client';

import { useEffect, useCallback, useRef } from 'react';

/**
 * Tracks mouse position normalized to viewport center.
 * Returns x/y offset values clamped to maxMovement (default 15px).
 * Uses RAF for 60fps smoothing with lerp.
 */
export function useMouseParallax(maxMovement: number = 15, smoothing: number = 0.08) {
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 2 * maxMovement;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 2 * maxMovement;
      target.current = { x, y };
    },
    [maxMovement]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * smoothing;
      position.current.y += (target.current.y - position.current.y) * smoothing;
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove, smoothing]);

  return position;
}
