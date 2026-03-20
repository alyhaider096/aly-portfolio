"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "../../data/projects";

/* ─────────────────────────────────────────
   Single CURVED face on the cylinder
   Uses CylinderGeometry segment for true
   curved surface like the reference image
   ───────────────────────────────────────── */
function CylinderFace({
    texture,
    index,
    total,
    radius,
    activeIndex,
}: {
    texture: THREE.Texture;
    index: number;
    total: number;
    radius: number;
    activeIndex: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const angle = (index / total) * Math.PI * 2;
    const isActive = index === activeIndex;

    // Smooth pop-out
    const currentY = useRef(0);
    const currentZ = useRef(0);
    const currentScale = useRef(1);
    const currentEmissive = useRef(0.02);
    const currentOpacity = useRef(0.7);

    // Create flat geometry instead of a curved cylinder face to match the image
    // The reference image shows flat rectangular cards radiating around a center axis.
    const geometry = useMemo(() => {
        return new THREE.PlaneGeometry(6.5, 4.4);
    }, []);

    // Map UV to show the texture correctly on the curved surface
    useEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
        }
    }, [texture]);

    useFrame(() => {
        if (!meshRef.current) return;

        const targetY = isActive ? 1.2 : 0;      // Subtle lift up
        const targetZ = isActive ? 1.5 : 0;      // Slight come forward
        const targetScale = isActive ? 1.12 : 1;  // Subtle scale
        const targetEmissive = isActive ? 0.45 : 0.02;
        const targetOpacity = isActive ? 1 : 0.7;

        currentY.current += (targetY - currentY.current) * 0.08;
        currentZ.current += (targetZ - currentZ.current) * 0.08;
        currentScale.current += (targetScale - currentScale.current) * 0.08;
        currentEmissive.current += (targetEmissive - currentEmissive.current) * 0.08;
        currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.08;

        // For the starburst/rolodex style, they radiate OUT from the center.
        // x,z determines where it sits on the circle.
        const x = Math.sin(angle) * (radius * 0.1);
        const z = Math.cos(angle) * (radius * 0.1);

        meshRef.current.position.set(x, currentY.current, z);
        // Radiating angle: the card stands upright, pointing outwards like a ray
        meshRef.current.rotation.set(0, angle + Math.PI / 2, 0);
        meshRef.current.scale.setScalar(currentScale.current);

        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = currentEmissive.current;
        mat.opacity = currentOpacity.current;
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                map={texture}
                emissive={new THREE.Color("#d4c5a9")}
                emissiveIntensity={0.05}
                emissiveMap={texture}
                transparent
                opacity={0.8}
                side={THREE.FrontSide}
                roughness={0.1}
                metalness={0.3}
            />
        </mesh>
    );
}

/* ─────────────────────────────────────────
   Rotating cylinder group — continuous spin
   ───────────────────────────────────────── */
function CylinderGroup({
    activeIndex,
    textures,
}: {
    activeIndex: number;
    textures: THREE.Texture[];
}) {
    const groupRef = useRef<THREE.Group>(null);
    const total = textures.length;
    const radius = 6.5; // Big for maximum drama and visibility

    const baseRotation = useRef(0);
    const isHovering = useRef(false);
    const hoverTarget = useRef(0);

    useEffect(() => {
        isHovering.current = activeIndex >= 0;
        hoverTarget.current = (activeIndex / total) * Math.PI * 2;
    }, [activeIndex, total]);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        if (isHovering.current) {
            const current = groupRef.current.rotation.y;
            let diff = hoverTarget.current - current;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            groupRef.current.rotation.y += diff * 0.06;
            baseRotation.current = groupRef.current.rotation.y;
        } else {
            baseRotation.current += delta * 0.12;
            groupRef.current.rotation.y = baseRotation.current;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.2, 0]}>
            {textures.map((tex, i) => (
                <CylinderFace
                    key={i}
                    texture={tex}
                    index={i}
                    total={total}
                    radius={radius}
                    activeIndex={activeIndex}
                />
            ))}
        </group>
    );
}

/* ─────────────────────────────────────────
   Floating dust particles around cylinder
   ───────────────────────────────────────── */
function DustParticles() {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 200;

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 12;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const t = state.clock.getElapsedTime();
        pointsRef.current.rotation.y = t * 0.02;

        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            posArray[i * 3 + 1] += Math.sin(t + i * 0.5) * 0.001;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#B87333"
                size={0.03}
                transparent
                opacity={0.35}
                sizeAttenuation
            />
        </points>
    );
}

/* ─────────────────────────────────────────
   Inner scene with improved lighting
   ───────────────────────────────────────── */
function InnerScene({ activeIndex }: { activeIndex: number }) {
    const texturePaths = useMemo(
        () => projects.map((p) => p.thumbnail),
        []
    );

    const textures = useLoader(THREE.TextureLoader, texturePaths);

    const { camera } = useThree();
    useEffect(() => {
        camera.position.set(0, 1.5, 13);
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return (
        <>
            {/* Ambient fill */}
            <ambientLight intensity={0.12} />

            {/* Main key light — brighter, warmer */}
            <spotLight
                position={[0, 7, 7]}
                angle={0.45}
                penumbra={0.85}
                intensity={1.5}
                color="#f0e6d4"
                castShadow
            />

            {/* Strong copper rim from left */}
            <pointLight position={[-5, 2, -2]} intensity={0.6} color="#B87333" />

            {/* Cool subtle fill from right */}
            <pointLight position={[5, -1, 3]} intensity={0.2} color="#1a2e2a" />

            {/* Top bronze wash */}
            <pointLight position={[0, 6, 0]} intensity={0.35} color="#8B6914" />

            {/* Front face light for visibility */}
            <pointLight position={[0, 0, 6]} intensity={0.25} color="#d4c5a9" />

            <CylinderGroup
                activeIndex={activeIndex}
                textures={Array.isArray(textures) ? textures : [textures]}
            />

            {/* Atmospheric dust */}
            <DustParticles />

            {/* Dark reflective floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.0, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial
                    color="#050403"
                    roughness={0.9}
                    metalness={0.15}
                />
            </mesh>
        </>
    );
}

/* ─────────────────────────────────────────
   Exported component
   ───────────────────────────────────────── */
interface Props {
    activeIndex: number;
}

export default function CylinderGallery({ activeIndex }: Props) {
    return (
        <div className="cylinder-area">
            <div className="cylinder-glow" />
            <div className="cylinder-canvas-wrap">
                <Canvas
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance",
                    }}
                    dpr={[1, 1.5]}
                    style={{ background: "transparent" }}
                >
                    <InnerScene activeIndex={activeIndex} />
                </Canvas>
            </div>
        </div>
    );
}
