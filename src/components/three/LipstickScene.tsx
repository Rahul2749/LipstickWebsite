'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import SilkRibbons from './SilkRibbons';

interface LipstickSceneProps {
  opacity: number;
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
}

/**
 * Camera rig that responds to mouse parallax for depth effect.
 */
function CameraRig({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Very subtle camera response — depth parallax
    groupRef.current.rotation.y +=
      (mouseX * 0.0003 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x +=
      (mouseY * 0.0002 - groupRef.current.rotation.x) * 0.05;
  });

  return <group ref={groupRef} />;
}

/**
 * Soft volumetric lighting setup.
 */
function SceneLighting() {
  return (
    <>
      {/* Key light — warm, from above-right */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.2}
        color="#faf0e6"
        castShadow={false}
      />

      {/* Fill light — cool, from left */}
      <directionalLight
        position={[-3, 2, 4]}
        intensity={0.4}
        color="#b8c6db"
      />

      {/* Rim light — warm accent from behind */}
      <pointLight
        position={[0, 3, -3]}
        intensity={0.8}
        color="#c9a96e"
        distance={10}
        decay={2}
      />

      {/* Soft ambient */}
      <ambientLight intensity={0.15} color="#faf5ef" />

      {/* Ground reflection bounce */}
      <pointLight
        position={[0, -3, 0]}
        intensity={0.2}
        color="#6b1d2a"
        distance={8}
        decay={2}
      />
    </>
  );
}

export default function LipstickScene({
  opacity,
  mouseX,
  mouseY,
  isMobile,
}: LipstickSceneProps) {
  const particleCount = isMobile ? 80 : 200;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
        zIndex: 15,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 40 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <CameraRig mouseX={mouseX} mouseY={mouseY} />
          <SceneLighting />

          <ParticleField count={particleCount} radius={5} />
          {!isMobile && <SilkRibbons />}

          <Environment preset="studio" environmentIntensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
