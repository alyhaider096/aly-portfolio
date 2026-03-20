"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const root = useRef<HTMLDivElement>(null);
  const textContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !textContainer.current) return;

    const ctx = gsap.context(() => {
      // ── TEXT REVEAL ──
      const textLines = textContainer.current!.querySelectorAll(".text-line");

      gsap.fromTo(
        textLines,
        { opacity: 0, y: 50, filter: "blur(16px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "top 32%",
            scrub: 0.5,
          },
        }
      );

      // ── CARD: settle below about text, then fade out ──
      const wrapper = document.getElementById("hero-card-wrapper");
      const card = wrapper?.querySelector(".hero-card") as HTMLElement;
      if (!wrapper || !card) return;

      // Phase 1: Card drifts down and settles as about section scrolls in
      const settleTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 88%",
          end: "top 38%",
          scrub: 0.6,
          onEnter: () => { card.dataset.scrollLock = "1"; gsap.killTweensOf(card); },
          onEnterBack: () => { card.dataset.scrollLock = "1"; gsap.killTweensOf(card); },
          onLeaveBack: () => {
            gsap.to(wrapper, {
              y: 0, x: 0, scale: 1,
              opacity: 1,
              rotateZ: 0, rotateY: 0, rotateX: 0,
              duration: 0.9, ease: "power2.inOut",
              onComplete: () => { card.dataset.scrollLock = "0"; },
            });
          },
        },
      });

      // Card drifts down to sit right below the about text
      settleTl.to(wrapper, { y: "12vh", scale: 0.88, rotateZ: 0.8, duration: 0.35, ease: "sine.inOut" });
      settleTl.to(wrapper, { y: "28vh", x: 0, scale: 0.78, rotateZ: -1.5, duration: 0.65, ease: "power3.out" });

      // Phase 2: Card slides DOWN and fades out smoothly (no shrinking)
      gsap.to(wrapper, {
        opacity: 0,
        y: "60vh",
        ease: "power2.in",
        scrollTrigger: {
          trigger: root.current,
          start: "bottom 65%",
          end: "bottom 10%",
          scrub: 0.5,
          onLeaveBack: () => {
            gsap.to(wrapper, { opacity: 1, scale: 0.78, y: "28vh", duration: 0.5, ease: "power2.out" });
          },
        },
      });

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex items-start justify-center overflow-visible"
      style={{
        zIndex: 10,
        minHeight: "115vh",
        background:
          "linear-gradient(180deg, #000000 0%, #0d0a07 10%, #120e09 25%, #151009 45%, #110d08 65%, #0c0906 85%, #080604 100%)",
      }}
    >
      {/* Atmospheric layers */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 30% at 50% 6%, rgba(180, 140, 80, 0.07), transparent 65%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 45% 45% at 50% 45%, rgba(160, 120, 60, 0.04), transparent 70%)" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.5) 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56" style={{ background: "linear-gradient(to bottom, #000000, transparent)" }} />
      {/* Bottom fade — blends seamlessly into the dark text section below */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(to top, #080604, transparent)" }} />

      {/* Text */}
      <div className="mx-auto max-w-3xl text-center relative z-20 pt-[14vh]" ref={textContainer}>
        <p className="text-line mb-7" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.35em', color: 'rgba(196,164,107,0.45)', textTransform: 'uppercase' }}>[ About ]</p>
        <h2 className="text-line text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] mb-7" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(226,213,190,0.92)' }}>
          I Build Systems{" "}
          <span style={{ background: 'linear-gradient(135deg, #c4a46b, #a08050, #d4b878)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>That Think</span>
        </h2>
        <p className="text-line text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(226,213,190,0.45)' }}>
          Creative developer crafting AI-driven automation, immersive web experiences, and data-powered systems.
        </p>
        <p className="text-line text-base md:text-lg leading-relaxed max-w-xl mx-auto" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(226,213,190,0.25)' }}>
          From cinematic interfaces to intelligent pipelines — every pixel and every algorithm is engineered with intent.
        </p>

        {/* Space for card to sit below text — keep it just enough */}
        <div className="h-[260px] relative mt-8" />
      </div>
    </section>
  );
}