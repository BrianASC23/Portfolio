'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fragmentShader } from './shaders/fragment.glsl';
import { vertexShader } from './shaders/vertex.glsl';

interface HeroBlobProps {
  reduced?: boolean;
}

export function HeroBlob({ reduced = false }: HeroBlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: reduced ? 0 : 0.6 },
      uAmplitude: { value: 0.35 },
      uFrequency: { value: 1.1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 1.0 },
      uColorA: { value: new THREE.Color('#0b0a08') },
      uColorB: { value: new THREE.Color('#f59e0b') },
      uColorC: { value: new THREE.Color('#fbbf24') },
    }),
    [reduced],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;
    if (u.uTime) u.uTime.value += delta;

    // Mouse lerp
    const target = new THREE.Vector2(
      (state.pointer.x * viewport.width) / 4,
      (state.pointer.y * viewport.height) / 4,
    );
    mouseRef.current.lerp(target, 0.08);
    if (u.uMouse) u.uMouse.value = mouseRef.current;

    if (meshRef.current && !reduced) {
      meshRef.current.rotation.y += delta * 0.06;
      meshRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.6}>
      <icosahedronGeometry args={[1, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
