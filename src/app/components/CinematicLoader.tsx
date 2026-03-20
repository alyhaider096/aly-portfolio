"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { gsap } from "../utils/gsap";

/* ═══════════════════════════════════════════
   CHARACTER ASSEMBLY LOADER v1
   Parts float in and stick together
   ═══════════════════════════════════════════ */

export default function CinematicLoader({ onComplete }: { onComplete: () => void }) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!mountRef.current) return;

        // ─── THREE SCENE SETUP ───
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xc8932a, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // ─── CHARACTER PARTS ───
        const group = new THREE.Group();
        scene.add(group);

        const skinMat = new THREE.MeshStandardMaterial({ color: "#d5cbb2", roughness: 0.3 });
        const torsoMat = new THREE.MeshStandardMaterial({ color: "#0a0a09" });
        const glowMat = new THREE.MeshStandardMaterial({ color: "#c8932a", emissive: "#c8932a", emissiveIntensity: 2 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), skinMat);
        head.position.set(-5, 5, -5); // Start off-screen
        group.add(head);

        // Torso
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1.2, 4, 16), torsoMat);
        torso.position.set(5, -5, -5); // Start off-screen
        group.add(torso);

        // Limbs (Arms/Legs)
        const limbs: THREE.Mesh[] = [];
        for (let i = 0; i < 4; i++) {
            const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.8, 4, 8), torsoMat);
            limb.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, -10);
            group.add(limb);
            limbs.push(limb);
        }

        // ─── BACKGROUND PARTICLES ───
        const partCount = 300;
        const posArr = new Float32Array(partCount * 3);
        for (let i = 0; i < partCount * 3; i++) posArr[i] = (Math.random() - 0.5) * 20;
        const partGeo = new THREE.BufferGeometry();
        partGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
        const partMat = new THREE.PointsMaterial({ color: "#c8932a", size: 0.02, transparent: true, opacity: 0.5 });
        const particles = new THREE.Points(partGeo, partMat);
        scene.add(particles);

        // ─── ANIMATION TIMELINE ───
        const tl = gsap.timeline({
            onUpdate: () => setProgress(Math.floor(tl.progress() * 100)),
            onComplete: () => {
                onComplete();
            }
        });

        // 1. Assembly
        tl.to(torso.position, { x: 0, y: -0.5, z: 0, duration: 1.5, ease: "back.out(1)" }, 0.5);
        tl.to(head.position, { x: 0, y: 0.8, z: 0, duration: 1.2, ease: "back.out(1)" }, 1.0);

        limbs.forEach((limb, i) => {
            const tx = i < 2 ? -0.6 : 0.6;
            const ty = i % 2 === 0 ? 0 : -1.2;
            tl.to(limb.position, { x: tx, y: ty, z: 0, duration: 1, ease: "power2.out" }, 1.2 + i * 0.2);
        });

        // 2. Pulse / Stick Effect
        tl.to(group.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.inOut" }, 2.5);

        // 3. Reveal Name
        tl.fromTo(".loader-name", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 1.5);

        // 4. Exit Transition
        tl.to(group.position, { z: 10, opacity: 0, duration: 1.2, ease: "power4.in" }, 4);
        tl.to(mountRef.current, { opacity: 0, duration: 0.8 }, 4.5);

        // Render Loop
        const animate = () => {
            requestAnimationFrame(animate);
            particles.rotation.y += 0.001;
            group.rotation.y += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div ref={mountRef} className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center">
            <style jsx>{`
                .loader-name {
                    font-family: var(--font-display);
                    font-size: 5rem;
                    font-weight: 300;
                    letter-spacing: 0.5em;
                    color: var(--fg);
                    text-transform: uppercase;
                    pointer-events: none;
                }
                .loader-progress {
                    position: absolute;
                    bottom: 10%;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    color: var(--accent);
                    letter-spacing: 0.2em;
                }
            `}</style>

            <div className="loader-name absolute">ALYHA</div>
            <div className="loader-progress uppercase">Assembling System_{progress}%</div>
        </div>
    );
}
