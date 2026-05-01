"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, Suspense, useEffect, useState } from "react";
import * as THREE from "three";

function MouseTracker({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  useFrame((_, delta) => {
    if (!ref.current) return;
    const targetX = (mouse.x * viewport.width) / 12;
    const targetY = (mouse.y * viewport.height) / 12;
    ref.current.rotation.y += (targetX - ref.current.rotation.y) * Math.min(delta * 2, 1);
    ref.current.rotation.x += (-targetY - ref.current.rotation.x) * Math.min(delta * 2, 1);
  });

  return <group ref={ref}>{children}</group>;
}

function CoreObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1.4, 96, 96]}>
        <MeshDistortMaterial
          color="#0a0a0a"
          attach="material"
          distort={0.45}
          speed={1.6}
          roughness={0.1}
          metalness={0.95}
          envMapIntensity={1.2}
        />
      </Sphere>
    </Float>
  );
}

function WireframeShell() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    ref.current.rotation.y = -state.clock.elapsedTime * 0.12;
  });
  return (
    <mesh ref={ref} scale={2.4}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function Particles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#ffffff" />

      <Suspense fallback={null}>
        <MouseTracker>
          <CoreObject />
          <WireframeShell />
        </MouseTracker>
        <Particles />
        <Environment preset="city" />
      </Suspense>

      <fog attach="fog" args={["#050505", 6, 14]} />
    </Canvas>
  );
}
