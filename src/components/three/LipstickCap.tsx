'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating metallic lipstick cap with independent rotation
 * and gentle sinusoidal drift.
 */
export default function LipstickCap() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    timeRef.current += delta;

    // Gentle floating motion
    groupRef.current.position.y =
      1.6 + Math.sin(timeRef.current * 0.6) * 0.08;
    groupRef.current.position.x =
      1.0 + Math.sin(timeRef.current * 0.4) * 0.03;
    groupRef.current.position.z =
      0.3 + Math.cos(timeRef.current * 0.5) * 0.02;

    // Independent slow rotation
    groupRef.current.rotation.y += delta * 0.05;
    groupRef.current.rotation.z =
      Math.sin(timeRef.current * 0.3) * 0.08 + 0.15;
  });

  return (
    <group ref={groupRef} position={[1.0, 1.6, 0.3]}>
      {/* Cap outer shell */}
      <mesh>
        <cylinderGeometry args={[0.37, 0.37, 1.1, 48, 1, false]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Cap top */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.37, 48]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gold cap accent */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.05, 48]} />
        <meshStandardMaterial
          color="#c9a96e"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Logo plate (subtle gold rectangle) */}
      <mesh position={[0, 0.1, 0.375]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.3, 0.12]} />
        <meshStandardMaterial
          color="#c9a96e"
          metalness={1}
          roughness={0.3}
          envMapIntensity={1.0}
        />
      </mesh>
    </group>
  );
}
