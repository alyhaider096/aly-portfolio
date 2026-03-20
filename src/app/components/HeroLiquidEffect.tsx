"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroLiquidEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 550;

    let animationId: number;
    let time = 0;

    const drawLiquid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create liquid gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );

      gradient.addColorStop(0, `rgba(100, 200, 255, ${0.15 + Math.sin(time) * 0.05})`);
      gradient.addColorStop(0.5, `rgba(80, 140, 255, ${0.08 + Math.sin(time * 1.2) * 0.03})`);
      gradient.addColorStop(1, "rgba(60, 100, 200, 0)");

      ctx.fillStyle = gradient;

      // Draw liquid waves
      ctx.beginPath();
      for (let i = 0; i < canvas.width; i += 2) {
        const y =
          canvas.height / 2 +
          Math.sin(i * 0.02 + time) * 30 +
          Math.cos(i * 0.03 + time * 0.7) * 20;
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      time += 0.05;
      animationId = requestAnimationFrame(drawLiquid);
    };

    drawLiquid();

    // Fade in animation
    gsap.fromTo(
      canvas,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-liquid-effect"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "screen",
        zIndex: 1,
      }}
    />
  );
}