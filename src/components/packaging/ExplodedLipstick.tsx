'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExplodedLipstickProps {
  progress: number; // 0 to 1 scroll progress
}

export default function ExplodedLipstick({ progress }: ExplodedLipstickProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow idle rotation + combining drag rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  // Exploade distances calculated based on scroll progress
  const capY = progress * 2.5 + 1.2;
  const bulletY = progress * 0.8 + 0.3;
  const ringY = progress * -0.2 - 0.5;
  const baseY = progress * -1.8 - 1.2;

  // Local clipping plane to slice the lipstick bullet at a 45-degree angle
  const clipPlane = useMemo(() => {
    // Slices at an angle
    const normal = new THREE.Vector3(0, -1, -0.6).normalize();
    return new THREE.Plane(normal, 0.45);
  }, []);

  return (
    <group ref={groupRef} scale={1.3} position={[0, -0.3, 0]}>
      {/* 1. THE CAP (Luxury Blush Pink) */}
      <mesh position={[0, capY, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.8, 32]} />
        <meshStandardMaterial 
          color="#f6d2d2" 
          roughness={0.25} 
          metalness={0.1} 
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 2. THE LIPSTICK BULLET (Premium Crimson with angled slice) */}
      <mesh position={[0, bulletY, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.0, 32]} />
        <meshStandardMaterial 
          color="#9c1c31" 
          roughness={0.7} 
          metalness={0.15}
          clippingPlanes={[clipPlane]}
          clipShadows
        />
      </mesh>

      {/* 3. GOLD INNER SLEEVE / MECHANISM */}
      <mesh position={[0, progress * -0.5, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 1.2, 32]} />
        <meshStandardMaterial 
          color="#c9a96e" 
          roughness={0.15} 
          metalness={0.95} 
        />
      </mesh>

      {/* 4. GOLD METALLIC RING */}
      <mesh position={[0, ringY, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.15, 32]} />
        <meshStandardMaterial 
          color="#c9a96e" 
          roughness={0.1} 
          metalness={1.0} 
        />
      </mesh>

      {/* 5. OUTER BASE BODY (Luxury Blush Pink) */}
      <mesh position={[0, baseY, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.6, 32]} />
        <meshStandardMaterial 
          color="#f6d2d2" 
          roughness={0.25} 
          metalness={0.1} 
        />
      </mesh>
    </group>
  );
}
