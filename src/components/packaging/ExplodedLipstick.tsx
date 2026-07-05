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

  // Exploded Y offsets calculated based on scroll progress
  const capY = progress * 2.5 + 1.2;
  const bulletY = progress * 1.0 + 0.3;
  const ringY = progress * -0.2 - 0.55;
  const baseY = progress * -1.5 - 1.3;

  // Local clipping plane to slice the lipstick bullet at a 45-degree angle
  const clipPlane = useMemo(() => {
    const normal = new THREE.Vector3(0, -1, -0.65).normalize();
    return new THREE.Plane(normal, 0.45);
  }, []);

  return (
    <group ref={groupRef} scale={1.5} position={[0, -0.2, 0]}>
      {/* 1. THE CAP (Luxury Blush Pink) */}
      <mesh position={[0, capY, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 1.8, 64]} />
        <meshStandardMaterial 
          color="#f6d2d2" 
          roughness={0.15} 
          metalness={0.2} 
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 2. THE LIPSTICK BULLET (Premium Crimson with angled slice) */}
      <mesh position={[0, bulletY, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.0, 64]} />
        <meshStandardMaterial 
          color="#9c1c31" 
          roughness={0.6} 
          metalness={0.1}
          clippingPlanes={[clipPlane]}
          clipShadows
        />
      </mesh>

      {/* 3. GOLD INNER SLEEVE / MECHANISM */}
      <mesh position={[0, progress * -0.4, 0]}>
        <cylinderGeometry args={[0.20, 0.20, 1.2, 64]} />
        <meshStandardMaterial 
          color="#c9a96e" 
          roughness={0.1} 
          metalness={0.95} 
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 4. GOLD METALLIC ACCENT RING */}
      <mesh position={[0, ringY, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.15, 64]} />
        <meshStandardMaterial 
          color="#c9a96e" 
          roughness={0.05} 
          metalness={1.0} 
          envMapIntensity={2.0}
        />
      </mesh>

      {/* 5. OUTER BASE BODY (Luxury Blush Pink) */}
      <mesh position={[0, baseY, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 1.6, 64]} />
        <meshStandardMaterial 
          color="#f6d2d2" 
          roughness={0.15} 
          metalness={0.2} 
          envMapIntensity={1.2}
        />
      </mesh>
    </group>
  );
}
