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
  frames: ImageBitmap[];
  progress: number;
  isLoaded: boolean;
  totalFrames: number;
}

/**
 * Preloads ALL frames as ImageBitmap for maximum rendering performance.
 * 
 * - Loads in batches to avoid overwhelming the browser
 * - Uses createImageBitmap() for GPU-ready textures
 * - Reports progress for loading screen
 * - Frames stored as ImageBitmap[] for direct canvas drawing
 */
export function useFramePreloader(manifestUrl: string = '/frames/frames.json'): UseFramePreloaderReturn {
  const [frames, setFrames] = useState<ImageBitmap[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalFrames, setTotalFrames] = useState(0);
  const loadingRef = useRef(false);

  const loadFrames = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      // Step 1: Fetch manifest
      const manifestRes = await fetch(manifestUrl);
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

      // Step 3: Load in batches of 10 for optimal throughput
      const BATCH_SIZE = 10;
      const loadedFrames: ImageBitmap[] = new Array(count);
      let loadedCount = 0;

      for (let batchStart = 0; batchStart < count; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, count);
        const batchPromises: Promise<void>[] = [];

        for (let i = batchStart; i < batchEnd; i++) {
          batchPromises.push(
            (async () => {
              try {
                const response = await fetch(frameUrls[i]);
                if (!response.ok) throw new Error(`Frame ${i} failed`);
                const blob = await response.blob();
                
                // createImageBitmap decodes to GPU-ready format
                const bitmap = await createImageBitmap(blob, {
                  premultiplyAlpha: 'premultiply',
                  colorSpaceConversion: 'default',
                });
                
                loadedFrames[i] = bitmap;
                loadedCount++;
                setProgress((loadedCount / count) * 100);
              } catch (err) {
                console.warn(`Failed to load frame ${i}:`, err);
                loadedCount++;
                setProgress((loadedCount / count) * 100);
              }
            })()
          );
        }

        await Promise.all(batchPromises);
      }

      // Step 4: Set frames and mark complete
      setFrames(loadedFrames.filter(Boolean));
      setIsLoaded(true);
      setProgress(100);

    } catch (err) {
      console.error('Frame preloader failed:', err);
    }
  }, [manifestUrl]);

  useEffect(() => {
    loadFrames();
  }, [loadFrames]);

  return { frames, progress, isLoaded, totalFrames };
}
