'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Flowing silk ribbons using animated tube geometry.
 * Gentle flowing motion via vertex manipulation.
 */
export default function SilkRibbons() {
  const ribbon1Ref = useRef<THREE.Mesh>(null);
  const ribbon2Ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const createRibbonGeometry = useMemo(() => {
    return (xOff: number, yOff: number, zOff: number, scale: number) => {
      const points: THREE.Vector3[] = [];
      const segments = 50;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = xOff + Math.sin(t * Math.PI * 2) * 1.5 * scale;
        const y = yOff + (t - 0.5) * 4 * scale;
        const z = zOff + Math.cos(t * Math.PI * 1.5) * 0.8 * scale;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, 50, 0.02, 8, false);
    };
  }, []);

  const geometry1 = useMemo(
    () => createRibbonGeometry(-2, 0, -1, 1),
    [createRibbonGeometry]
  );
  const geometry2 = useMemo(
    () => createRibbonGeometry(2.5, 0.5, -1.5, 0.8),
    [createRibbonGeometry]
  );

  useFrame((_, delta) => {
    timeRef.current += delta;

    [ribbon1Ref, ribbon2Ref].forEach((ref, index) => {
      if (!ref.current) return;
      const speed = index === 0 ? 0.3 : 0.25;
      const posArray = ref.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < posArray.length; i += 3) {
        posArray[i] +=
          Math.sin(timeRef.current * speed + i * 0.01) * 0.0004;
        posArray[i + 1] +=
          Math.cos(timeRef.current * speed * 0.7 + i * 0.015) * 0.0003;
      }

      ref.current.geometry.attributes.position.needsUpdate = true;
    });
  });

  const ribbonMaterial = (
    <meshPhysicalMaterial
      color="#8b1a2b"
      metalness={0.3}
      roughness={0.6}
      transparent
      opacity={0.25}
      side={THREE.DoubleSide}
      transmission={0.3}
      thickness={0.1}
    />
  );

  return (
    <group>
      <mesh ref={ribbon1Ref} geometry={geometry1}>
        {ribbonMaterial}
      </mesh>
      <mesh ref={ribbon2Ref} geometry={geometry2}>
        <meshPhysicalMaterial
          color="#c9a96e"
          metalness={0.4}
          roughness={0.5}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          transmission={0.3}
          thickness={0.1}
        />
      </mesh>
    </group>
  );
}
