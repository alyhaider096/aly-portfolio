"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import usePrefersReducedMotion from "../utils/usePrefersReducedMotion";

// Main Glass Orb
function GlassOrb({ ready }: { ready: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.getElapsedTime();

    // Gentle float
    mesh.current.position.y = Math.sin(t * 0.6) * 0.1;

    // Rotate based on mouse
    const targetX = state.pointer.x * 0.5;
    const targetY = state.pointer.y * 0.3;

    mesh.current.rotation.y += (targetX - mesh.current.rotation.y) * 0.05;
    mesh.current.rotation.x += (-targetY - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.z = Math.sin(t * 0.4) * 0.08;
  });

  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.scale.setScalar(ready ? 1 : 0.9);
  }, [ready]);

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <MeshTransmissionMaterial
        thickness={0.65}
        transmission={1}
        roughness={0.04}
        ior={1.3}
        chromaticAberration={0.1}
        anisotropy={0.15}
        distortion={0.2}
        distortionScale={0.4}
        temporalDistortion={0.15}
        attenuationColor="#7dd3fc"
        attenuationDistance={0.8}
      />
    </mesh>
  );
}

// Main Scene Component
export default function HeroScene({ ready }: { ready: boolean }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-radial from-blue-950/20 to-transparent" />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 4], fov: 45 }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 3]} intensity={1.5} color="#7dd3fc" />
        <directionalLight position={[-5, -3, -3]} intensity={0.8} color="#60a5fa" />

        <GlassOrb ready={ready} />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}