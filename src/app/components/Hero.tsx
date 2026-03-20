"use client";

import { useEffect, useRef } from "react";
import HeroScene from "./HeroScene";
import HeroScrollIndicator from "./HeroScrollIndicator";
import { gsap } from "../utils/gsap";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready || !root.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      className="relative min-h-screen overflow-visible"
      style={{
        perspective: "1400px",
        zIndex: 5,
        background: "var(--bg)",
      }}
    >
      {/* 3D Orb Scene */}
      <HeroScene ready={ready} />


      <HeroScrollIndicator />

      {/* Visual overlays */}
      <div className="grain pointer-events-none absolute inset-0 z-[60]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,black_90%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
    </section>
  );
}

