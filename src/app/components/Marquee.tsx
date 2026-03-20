"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";
import { EASE } from "../utils/motion";

export default function Marquee({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const inner = el.querySelector<HTMLDivElement>(".inner");
    if (!inner) return;

    // Create and store timeline
    timelineRef.current = gsap.timeline({ repeat: -1 });
    timelineRef.current.to(inner, {
      xPercent: -50,
      duration: 18,
      ease: EASE.linear,
    });

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden border-y border-white/10 bg-black"
    >
      <div className="inner flex w-[200%] items-center gap-10 py-4 text-sm uppercase tracking-[0.35em] text-white/60">
        <div className="flex w-1/2 items-center justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`marquee-1-${i}`}>{text}</span>
          ))}
        </div>
        <div className="flex w-1/2 items-center justify-around">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={`marquee-2-${i}`}>{text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}