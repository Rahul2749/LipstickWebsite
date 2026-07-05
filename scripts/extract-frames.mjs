/**
 * Extract frames from video using ffmpeg-static.
 * Extracts as high-quality JPEG (universally supported), then the app uses them as-is.
 * Generates frames.json manifest.
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const ffmpegPath = require('ffmpeg-static');
const VIDEO_PATH = 'C:\\Users\\rahul\\Downloads\\Luxury_lipstick_commercial_CGI_1080p_202607051231.mp4';
const OUTPUT_DIR = resolve(__dirname, '..', 'public', 'frames');

console.log('🎬 Frame Extraction Script');
console.log(`FFmpeg: ${ffmpegPath}`);
console.log(`Video:  ${VIDEO_PATH}`);
console.log(`Output: ${OUTPUT_DIR}\n`);

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Probe video
let fps = 24;
let duration = 10;
try {
  const probeResult = (() => {
    try {
      return execFileSync(ffmpegPath, ['-i', VIDEO_PATH], {
        encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe']
      });
    } catch (e) { return e.stderr || ''; }
  })();
  
  const fpsMatch = probeResult.match(/(\d+(?:\.\d+)?)\s*fps/);
  if (fpsMatch) fps = Math.round(parseFloat(fpsMatch[1]));
  
  const durationMatch = probeResult.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/);
  if (durationMatch) {
    duration = parseInt(durationMatch[1]) * 3600 +
               parseInt(durationMatch[2]) * 60 +
               parseInt(durationMatch[3]) +
               parseInt(durationMatch[4]) / 100;
  }
  console.log(`FPS: ${fps}, Duration: ${duration}s, Est. frames: ~${Math.ceil(fps * duration)}`);
} catch { console.log('Using defaults'); }

// Extract as high-quality JPEG — most universally supported codec
console.log('\n🖼️  Extracting frames as JPEG (quality 2 = ~95%)...\n');

execFileSync(ffmpegPath, [
  '-i', VIDEO_PATH,
  '-vf', `fps=${fps}`,
  '-q:v', '2',             // JPEG quality (2 = highest, 31 = lowest)
  '-start_number', '1',
  '-y',
  resolve(OUTPUT_DIR, 'frame_%04d.jpg')
], {
  stdio: 'inherit',
  timeout: 600000
});

// Count and generate manifest
const frames = readdirSync(OUTPUT_DIR).filter(f => /^frame_\d{4}\.jpg$/.test(f)).sort();
const count = frames.length;

const manifest = {
  count,
  fps,
  duration: parseFloat((count / fps).toFixed(2)),
  format: 'jpg',
  pattern: 'frame_{n}.jpg',
  basePath: '/frames/'
};

writeFileSync(resolve(OUTPUT_DIR, 'frames.json'), JSON.stringify(manifest, null, 2));
console.log(`\n✅ Extracted ${count} JPEG frames`);
console.log(JSON.stringify(manifest, null, 2));
