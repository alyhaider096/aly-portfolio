"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../utils/gsap";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const dotEl = dot.current!;
    const ringEl = ring.current!;

    // ── Single persistent updaters — zero tween stacking on mousemove
    const xDot  = gsap.quickTo(dotEl,  "x", { duration: 0.1,  ease: "power3.out" });
    const yDot  = gsap.quickTo(dotEl,  "y", { duration: 0.1,  ease: "power3.out" });
    const xRing = gsap.quickTo(ringEl, "x", { duration: 0.35, ease: "expo.out" });
    const yRing = gsap.quickTo(ringEl, "y", { duration: 0.35, ease: "expo.out" });

    // Hover tracked via plain object — avoids listener teardown on every hover change
    const hover = { active: false };

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      // Magnetic pull merged inline — single mousemove listener
      const mag = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-magnetic="true"]');
      if (mag) {
        const r  = mag.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width  / 2)) / r.width;
        const my = (e.clientY - (r.top  + r.height / 2)) / r.height;
        gsap.to(mag, { x: mx * 10, y: my * 10, duration: 0.25, ease: "power3.out", overwrite: "auto" });
      }
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const hit = !!(
        t.closest('[data-cursor="link"]') ||
        t.closest("a") ||
        t.closest("button") ||
        t.closest('[role="button"]')
      );
      if (hit !== hover.active) {
        hover.active = hit;
        gsap.to(ringEl, { scale: hit ? 1.6 : 1, duration: 0.3, ease: "expo.out", overwrite: "auto" });
      }
    };

    const resetMagnetic = (e: Event) => {
      const mag = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-magnetic="true"]');
      if (!mag) return;
      gsap.to(mag, { x: 0, y: 0, duration: 0.35, ease: "expo.out", overwrite: "auto" });
    };

    window.addEventListener("mousemove", onMove,        { passive: true });
    window.addEventListener("mouseover", onOver,        { passive: true });
    window.addEventListener("mouseleave", resetMagnetic, { passive: true });

    gsap.set([dotEl, ringEl], { opacity: 0 });
    gsap.to([dotEl, ringEl],  { opacity: 1, duration: 0.4 });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseleave", resetMagnetic);
    };
  }, [isMobile]); // ← `hover` removed from deps; listeners are never re-added on hover change

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
