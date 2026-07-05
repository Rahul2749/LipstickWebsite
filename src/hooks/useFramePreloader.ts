'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FrameManifest {
  count: number;
  fps: number;
  duration: number;
  format: string;
  pattern: string;
  basePath: string;
}

interface UseFramePreloaderReturn {
  frames: Array<ImageBitmap | undefined>;
  progress: number;
  isLoaded: boolean;
  totalFrames: number;
}

/**
 * Progressively preloads the hero sequence.
 * 
 * - Loads a small critical set first so the hero can render quickly
 * - Continues loading the rest in the background
 * - Uses createImageBitmap() for GPU-ready textures
 * - Keeps frame indices stable while the array fills in
 */
export function useFramePreloader(manifestUrl: string = '/frames/frames.json'): UseFramePreloaderReturn {
  const [frames, setFrames] = useState<Array<ImageBitmap | undefined>>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadFrames = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const abortController = new AbortController();
    abortRef.current = abortController;

    const waitForIdle = () =>
      new Promise<void>((resolve) => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => resolve(), { timeout: 1200 });
          return;
        }

        globalThis.setTimeout(resolve, 250);
      });

    try {
      // Step 1: Fetch manifest
      const manifestRes = await fetch(manifestUrl, { signal: abortController.signal });
      if (!manifestRes.ok) throw new Error(`Manifest fetch failed: ${manifestRes.status}`);
      const manifest: FrameManifest = await manifestRes.json();

      const { count, basePath, format } = manifest;
      setTotalFrames(count);

      // Step 2: Create frame URL list
      const ext = format || 'jpg';
      const frameUrls: string[] = [];
      for (let i = 1; i <= count; i++) {
        const num = String(i).padStart(4, '0');
        frameUrls.push(`${basePath}frame_${num}.${ext}`);
      }

      const loadedFrames: Array<ImageBitmap | undefined> = new Array(count);

      const loadFrame = async (index: number) => {
        if (loadedFrames[index]) return;

        const response = await fetch(frameUrls[index], { signal: abortController.signal });
        if (!response.ok) throw new Error(`Frame ${index} failed`);
        const blob = await response.blob();

        loadedFrames[index] = await createImageBitmap(blob, {
          premultiplyAlpha: 'premultiply',
          colorSpaceConversion: 'default',
        });
      };

      // Step 3: Load the first few frames before showing the page.
      const CRITICAL_FRAME_COUNT = Math.min(12, count);
      let criticalLoaded = 0;

      await Promise.all(
        Array.from({ length: CRITICAL_FRAME_COUNT }, async (_, index) => {
          try {
            await loadFrame(index);
          } catch (err) {
            console.warn(`Failed to load critical frame ${index}:`, err);
          } finally {
            criticalLoaded++;
            setProgress((criticalLoaded / CRITICAL_FRAME_COUNT) * 100);
          }
        })
      );

      if (abortController.signal.aborted) return;

      setFrames([...loadedFrames]);
      setIsLoaded(true);
      setProgress(100);

      // Step 4: Fill the rest once the browser has had a chance to paint.
      await waitForIdle();

      const BATCH_SIZE = 6;
      let loadedCount = 0;

      for (let batchStart = CRITICAL_FRAME_COUNT; batchStart < count; batchStart += BATCH_SIZE) {
        if (abortController.signal.aborted) return;

        const batchEnd = Math.min(batchStart + BATCH_SIZE, count);
        const batchPromises: Promise<void>[] = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batchPromises.push(
            (async () => {
              try {
                await loadFrame(i);
              } catch (err) {
                console.warn(`Failed to load frame ${i}:`, err);
              } finally {
                loadedCount++;
              }
            })()
          );
        }

        await Promise.all(batchPromises);
        setFrames([...loadedFrames]);
      }

    } catch (err) {
      if (!abortController.signal.aborted) {
        console.error('Frame preloader failed:', err);
      }
    }
  }, [manifestUrl]);

  useEffect(() => {
    loadFrames();
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [loadFrames]);

  return { frames, progress, isLoaded, totalFrames };
}
