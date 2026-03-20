"use client";

import { useEffect, useRef } from "react";

/**
 * Abstract Geometric Cursor Trail
 * Spawns glowing geometric shapes (diamonds, circles, lines)
 * that fade and drift — not project images, but abstract art.
 */
export default function ImageTrail() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = (canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth);
        let h = (canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight);

        interface TrailParticle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            life: number;
            maxLife: number;
            size: number;
            rotation: number;
            rotSpeed: number;
            shape: "diamond" | "circle" | "ring" | "cross" | "dot";
            color: string;
        }

        const trail: TrailParticle[] = [];
        let mouseX = -999;
        let mouseY = -999;
        let lastX = -999;
        let lastY = -999;
        let animId: number;
        let frameCount = 0;

        const SPAWN_DIST = 30;
        const MAX_PARTICLES = 50;

        const COLORS = [
            "rgba(184, 115, 51,", // copper
            "rgba(139, 105, 20,", // bronze
            "rgba(212, 184, 120,", // gold
            "rgba(232, 224, 212,", // cream
            "rgba(160, 120, 60,",  // warm amber
        ];

        const SHAPES: TrailParticle["shape"][] = ["diamond", "circle", "ring", "cross", "dot"];

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            const dx = mouseX - lastX;
            const dy = mouseY - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > SPAWN_DIST) {
                lastX = mouseX;
                lastY = mouseY;

                // Spawn 2-3 particles per step
                const count = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.3 + Math.random() * 0.8;
                    trail.push({
                        x: mouseX + (Math.random() - 0.5) * 20,
                        y: mouseY + (Math.random() - 0.5) * 20,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 0.3, // slight upward drift
                        life: 1,
                        maxLife: 0.8 + Math.random() * 0.6,
                        size: 4 + Math.random() * 12,
                        rotation: Math.random() * Math.PI,
                        rotSpeed: (Math.random() - 0.5) * 0.05,
                        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    });
                }

                while (trail.length > MAX_PARTICLES) trail.shift();
            }
        };

        const drawShape = (p: TrailParticle, alpha: number) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = alpha;

            const s = p.size * (0.5 + alpha * 0.5);

            switch (p.shape) {
                case "diamond":
                    ctx.fillStyle = `${p.color}${alpha * 0.6})`;
                    ctx.beginPath();
                    ctx.moveTo(0, -s);
                    ctx.lineTo(s * 0.6, 0);
                    ctx.lineTo(0, s);
                    ctx.lineTo(-s * 0.6, 0);
                    ctx.closePath();
                    ctx.fill();
                    break;

                case "circle":
                    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
                    grad.addColorStop(0, `${p.color}${alpha * 0.5})`);
                    grad.addColorStop(1, `${p.color}0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(0, 0, s, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case "ring":
                    ctx.strokeStyle = `${p.color}${alpha * 0.45})`;
                    ctx.lineWidth = 1.2;
                    ctx.beginPath();
                    ctx.arc(0, 0, s * 0.7, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case "cross":
                    ctx.strokeStyle = `${p.color}${alpha * 0.5})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(-s * 0.5, 0);
                    ctx.lineTo(s * 0.5, 0);
                    ctx.moveTo(0, -s * 0.5);
                    ctx.lineTo(0, s * 0.5);
                    ctx.stroke();
                    break;

                case "dot":
                    ctx.fillStyle = `${p.color}${alpha * 0.8})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
                    ctx.fill();
                    // Glow
                    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s);
                    glow.addColorStop(0, `${p.color}${alpha * 0.3})`);
                    glow.addColorStop(1, `${p.color}0)`);
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(0, 0, s, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            ctx.restore();
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            frameCount++;

            for (let i = trail.length - 1; i >= 0; i--) {
                const p = trail[i];
                p.life -= 0.016 / p.maxLife;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotSpeed;
                p.vy -= 0.005; // subtle float up

                if (p.life <= 0) {
                    trail.splice(i, 1);
                    continue;
                }

                const alpha = p.life * p.life; // quadratic fade
                drawShape(p, alpha);
            }

            animId = requestAnimationFrame(draw);
        };

        const parent = canvas.parentElement;
        if (parent) parent.addEventListener("mousemove", onMouseMove);

        const handleResize = () => {
            w = canvas.width = canvas.parentElement?.clientWidth ?? window.innerWidth;
            h = canvas.height = canvas.parentElement?.clientHeight ?? window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        draw();

        return () => {
            cancelAnimationFrame(animId);
            if (parent) parent.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[55]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
