'use client';

import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { HeroBlob } from './HeroBlob';

export default function Hero3DCanvas() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4], fov: 45 }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fbbf24" />
      <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#ffffff" />
      <HeroBlob reduced={reduced} />
      {!reduced && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
