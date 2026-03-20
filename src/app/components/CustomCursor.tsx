"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../utils/gsap";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const dotEl = dot.current!;
    const ringEl = ring.current!;

    const onMove = (e: MouseEvent) => {
      gsap.to(dotEl, { x: e.clientX, y: e.clientY, duration: 0.15 });
      gsap.to(ringEl, {
        x: e.clientX,
        y: e.clientY,
        scale: hover ? 1.6 : 1,
        duration: 0.35,
        ease: "expo.out",
      });
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const hit =
        t.closest('[data-cursor="link"]') ||
        t.closest("a") ||
        t.closest("button") ||
        t.closest('[role="button"]');
      setHover(!!hit);
    };

    const onMagnetic = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('[data-magnetic="true"]') as HTMLElement | null;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const mx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const my = (e.clientY - (r.top + r.height / 2)) / r.height;

      gsap.to(el, { x: mx * 10, y: my * 10, duration: 0.25, ease: "power3.out" });
    };

    const resetMagnetic = (e: Event) => {
      const el = (e.target as HTMLElement | null)?.closest('[data-magnetic="true"]') as HTMLElement | null;
      if (!el) return;
      gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: "expo.out" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousemove", onMagnetic, { passive: true });
    window.addEventListener("mouseleave", resetMagnetic, { passive: true });

    gsap.set([dotEl, ringEl], { opacity: 0 });
    gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.4 });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousemove", onMagnetic);
      window.removeEventListener("mouseleave", resetMagnetic);
    };
  }, [hover, isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dot}
        style={{ transform: "translate(-50%, -50%)" }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-white/90 mix-blend-difference"
      />
      <div
        ref={ring}
        style={{ transform: "translate(-50%, -50%)" }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-white/50 bg-white/[0.02] backdrop-blur-sm"
      />
    </>
  );
}