'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural luxury lipstick body:
 * Cylinder tube + tapered bullet tip with PBR materials.
 */
export default function LipstickModel() {
  const groupRef = useRef<THREE.Group>(null);

  // Lipstick bullet tip geometry via LatheGeometry
  const bulletGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 32;
    const radius = 0.32;
    const height = 0.7;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Bullet profile: starts at full radius, tapers to a slanted tip
      const y = t * height;
      let r: number;

      if (t < 0.6) {
        r = radius;
      } else {
        // Smooth taper with slight asymmetric slant (classic lipstick shape)
        const taperT = (t - 0.6) / 0.4;
        r = radius * (1 - taperT * taperT * 0.85);
      }

      points.push(new THREE.Vector2(r, y));
    }

    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main tube body */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 1.4, 48]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Gold band / accent ring */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.06, 48]} />
        <meshStandardMaterial
          color="#c9a96e"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Lipstick bullet */}
      <mesh geometry={bulletGeometry} position={[0, 0.1, 0]}>
        <meshPhysicalMaterial
          color="#8b1a2b"
          metalness={0.1}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          sheen={1}
          sheenRoughness={0.3}
          sheenColor="#d4869a"
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Inner tube rim */}
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.04, 48]} />
        <meshStandardMaterial
          color="#2a2a2a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
