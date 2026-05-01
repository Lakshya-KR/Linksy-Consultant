"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, Suspense, useMemo } from "react";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* Bright, drifting starfield ----------------------------------------- */
function StarField({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.04) * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Glowing wireframe sphere — large & central ------------------------- */
function GlowingCore() {
  const ref = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || !inner.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.15;
    inner.current.rotation.y = -t * 0.12;
  });

  return (
    <group ref={ref}>
      {/* Inner solid dark sphere */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.2}
          metalness={0.95}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Outer wireframe shell */}
      <mesh scale={2.1}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Larger faint shell */}
      <mesh scale={3.4}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}

/* Twin orbiting rings ------------------------------------------------ */
function OrbitRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (r1.current) {
      r1.current.rotation.x = t * 0.18;
      r1.current.rotation.z = t * 0.1;
    }
    if (r2.current) {
      r2.current.rotation.x = -t * 0.13;
      r2.current.rotation.y = t * 0.16;
    }
  });
  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[3.4, 0.012, 16, 220]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[4.6, 0.008, 16, 220]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </>
  );
}

/* Camera drift on mouse --------------------------------------------- */
function CameraDrift() {
  const { camera, mouse } = useThree();
  useFrame((_, delta) => {
    const targetX = mouse.x * 0.6;
    const targetY = mouse.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * Math.min(delta, 1);
    camera.position.y += (targetY - camera.position.y) * Math.min(delta, 1);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function BackgroundScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#030305"]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      <pointLight position={[-6, -4, -4]} intensity={0.9} color="#ffffff" />
      <pointLight position={[6, 4, 4]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <GlowingCore />
        </Float>
        <OrbitRings />
        <StarField />
        <Environment preset="city" />
      </Suspense>

      <CameraDrift />
      <fog attach="fog" args={["#030305", 9, 22]} />
    </Canvas>
  );
}
