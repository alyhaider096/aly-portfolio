"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Cinematic 3D Preloader — Smooth Version
 * - Morphing icosahedron wireframe on canvas
 * - Fractures into particles
 * - "ALY." text reveals with 3D perspective
 * - SMOOTH crossfade to hero (no lag)
 */
export default function LoaderIntro({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const letters = useRef<HTMLSpanElement[]>([]);
  const done = useRef(false);
  const fractured = useRef(false);

  // ── Canvas morphing wireframe ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let animId: number;
    const startTime = Date.now();

    const PHI = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
      [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
      [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
    ].map(([x, y, z]) => ({ x: x * 80, y: y * 80, z: z * 80 }));

    const edges = [
      [0, 1], [0, 5], [0, 7], [0, 10], [0, 11], [1, 5], [1, 7], [1, 8], [1, 9],
      [2, 3], [2, 4], [2, 6], [2, 10], [2, 11], [3, 4], [3, 6], [3, 8], [3, 9],
      [4, 5], [4, 9], [4, 11], [5, 9], [5, 11], [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10], [8, 9], [10, 11],
    ];

    const particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; size: number }[] = [];
    let fractureTime = 0;
    let isFracturing = false;
    let textRevealed = false;

    const project = (x: number, y: number, z: number, rx: number, ry: number) => {
      let x1 = x * Math.cos(ry) - z * Math.sin(ry);
      let z1 = x * Math.sin(ry) + z * Math.cos(ry);
      let y1 = y * Math.cos(rx) - z1 * Math.sin(rx);
      let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
      const perspective = 600 / (600 + z2);
      return { x: w / 2 + x1 * perspective, y: h / 2 + y1 * perspective, scale: perspective };
    };

    const draw = () => {
      const t = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, w, h);

      if (!isFracturing) {
        const rx = t * 0.3 + Math.sin(t * 0.5) * 0.2;
        const ry = t * 0.5;
        const breathe = 1 + Math.sin(t * 2) * 0.12;
        const distort = Math.sin(t * 3) * 8 * Math.min(t / 1.5, 1);

        ctx.strokeStyle = `rgba(184, 115, 51, ${0.35 + Math.min(t / 2, 0.4)})`;
        ctx.lineWidth = 1;

        for (const [a, b] of edges) {
          const va = baseVertices[a];
          const vb = baseVertices[b];
          const pa = project(va.x * breathe + Math.sin(t + a) * distort, va.y * breathe + Math.cos(t * 1.3 + a) * distort, va.z * breathe, rx, ry);
          const pb = project(vb.x * breathe + Math.sin(t + b) * distort, vb.y * breathe + Math.cos(t * 1.3 + b) * distort, vb.z * breathe, rx, ry);
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }

        for (let i = 0; i < baseVertices.length; i++) {
          const v = baseVertices[i];
          const p = project(v.x * breathe + Math.sin(t + i) * distort, v.y * breathe + Math.cos(t * 1.3 + i) * distort, v.z * breathe, rx, ry);
          ctx.fillStyle = `rgba(184, 115, 51, ${0.6 * p.scale})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ambient orbiting particles
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2 + t * 0.2;
          const radius = 110 + Math.sin(t * 0.8 + i) * 25;
          const px = w / 2 + Math.cos(angle) * radius;
          const py = h / 2 + Math.sin(angle) * radius * 0.6;
          ctx.fillStyle = `rgba(184, 115, 51, ${0.12 + Math.sin(t * 2 + i * 0.5) * 0.08})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Fracture at 1.8s
        if (t >= 1.8 && !isFracturing) {
          isFracturing = true;
          fractured.current = true;
          fractureTime = t;
          for (const v of baseVertices) {
            for (let j = 0; j < 6; j++) {
              particles.push({
                x: v.x, y: v.y, z: v.z,
                vx: (Math.random() - 0.5) * 250,
                vy: (Math.random() - 0.5) * 250,
                vz: (Math.random() - 0.5) * 250,
                life: 1, size: 1 + Math.random() * 1.5,
              });
            }
          }
          for (let j = 0; j < 40; j++) {
            const a = Math.random() * Math.PI * 2;
            const e = (Math.random() - 0.5) * Math.PI;
            const r = 50 + Math.random() * 30;
            particles.push({
              x: Math.cos(a) * Math.cos(e) * r, y: Math.sin(e) * r, z: Math.sin(a) * Math.cos(e) * r,
              vx: Math.cos(a) * 180, vy: Math.sin(e) * 180, vz: Math.sin(a) * 180,
              life: 1, size: 0.5 + Math.random(),
            });
          }

          // Start text reveal immediately
          if (!textRevealed) {
            textRevealed = true;
            revealText();
          }
        }
      } else {
        const dt = 0.016;
        for (const p of particles) {
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          p.vx *= 0.96; p.vy *= 0.96; p.vz *= 0.96;
          p.life -= dt * 0.8;
          if (p.life > 0) {
            const elapsed = (Date.now() - startTime) / 1000 - fractureTime;
            const proj = project(p.x, p.y, p.z, 0.2, elapsed * 0.3);
            ctx.fillStyle = `rgba(184, 115, 51, ${p.life * 0.5})`;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const revealText = () => {
      if (!root.current) return;

      gsap.set(letters.current, {
        opacity: 0, y: 50, rotationX: -45, scale: 0.8,
        transformOrigin: "50% 50%",
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.to(letters.current, {
        opacity: 1, y: 0, rotationX: 0, scale: 1,
        duration: 0.7, stagger: 0.05,
      })
        .to({}, { duration: 0.25 }) // hold
        // Smooth fade-zoom exit (not abrupt)
        .to(canvasRef.current, {
          opacity: 0, duration: 0.5, ease: "power2.inOut",
        }, "exit")
        .to(letters.current, {
          scale: 6, opacity: 0, y: -10,
          duration: 0.7, stagger: 0.02, ease: "power3.in",
        }, "exit")
        .to(root.current, {
          opacity: 0, duration: 0.4, ease: "power2.inOut",
          onComplete: () => {
            if (done.current) return;
            done.current = true;
            onComplete();
          },
        }, "-=0.15");
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [onComplete]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      style={{ perspective: "1200px" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div
        className="relative z-10 flex gap-2 text-[18vw] font-semibold tracking-tight text-white"
        style={{ transformStyle: "preserve-3d" }}
      >
        {["A", "L", "Y", "."].map((c, i) => (
          <span
            key={i}
            ref={(el) => { if (el) letters.current[i] = el; }}
            className="inline-block opacity-0"
            style={{
              transformStyle: "preserve-3d",
              textShadow: "0 0 60px rgba(184,115,51,0.25), 0 0 120px rgba(139,105,20,0.1)",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grain pointer-events-none absolute inset-0 z-20 opacity-20" />
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(184,115,51,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(139,105,20,0.04),transparent_55%)]" />
      </div>
    </div>
  );
}