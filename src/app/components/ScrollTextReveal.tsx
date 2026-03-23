"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./scrollTextReveal.css";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   SCROLL TEXT REVEAL v2
   Horizontal scroll driven by vertical scroll.
   Words emerge from below with blur-dissolve — not a
   mechanical x-slide. Premium curtain reveal feel.
   ══════════════════════════════════════════════════════ */

const WORDS = [
  { text: "Engineering", size: "xl" },
  { text: "AI",          size: "xl",  accent: true },
  { text: "Systems",     size: "lg",  italic: true },
  { text: "Apps",        size: "xl" },
  { text: "&",           size: "sm",  accent: true },
  { text: "Automation",  size: "xl" },
  { text: "That",        size: "md",  dim: true },
  { text: "Turn",        size: "xl",  italic: true },
  { text: "Ideas",       size: "xl",  accent: true },
  { text: "Into",        size: "md",  dim: true },
  { text: "Living",      size: "xl",  italic: true },
  { text: "Products",    size: "xl" },
];

export default function ScrollTextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const outersRef  = useRef<(HTMLDivElement | null)[]>([]);
  const innersRef  = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const track  = trackRef.current;
    const outers = outersRef.current.filter(Boolean) as HTMLDivElement[];
    const inners = innersRef.current.filter(Boolean) as HTMLSpanElement[];

    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 100;

    // ── Horizontal scroll timeline ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:             sectionRef.current,
        start:               "top top",
        end:                 () => `+=${getScrollAmount()}`,
        pin:                 true,
        scrub:               0.9,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, { x: () => -getScrollAmount(), ease: "none", duration: 1 });

    // ── Per-word reveal: blur-dissolve rising from below ──
    inners.forEach((inner, i) => {
      const outer = outers[i];
      if (!outer || !inner) return;

      // Start state: invisible, shifted down, blurred
      gsap.set(inner, { opacity: 0, y: 48, filter: "blur(14px)" });

      ScrollTrigger.create({
        trigger:            outer,
        containerAnimation: tl,
        start:              "left 88%",
        end:                "left 20%",
        scrub:              false,
        onEnter: () => {
          gsap.to(inner, {
            opacity: 1,
            y:       0,
            filter:  "blur(0px)",
            duration: 0.85,
            ease:    "expo.out",
            overwrite: "auto",
          });
        },
        onLeaveBack: () => {
          gsap.to(inner, {
            opacity: 0,
            y:       48,
            filter:  "blur(14px)",
            duration: 0.45,
            ease:    "power2.in",
            overwrite: "auto",
          });
        },
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.containerAnimation === tl) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="str-section">
      <div className="str-vig" />

      <div className="str-stage">
        <div ref={trackRef} className="str-track">
          {WORDS.map((w, i) => (
            /* Outer: trigger element, participates in layout */
            <div
              key={i}
              ref={(el) => { outersRef.current[i] = el; }}
              className={`str-word-outer ${w.size}`}
            >
              {/* Inner: animated element */}
              <span
                ref={(el) => { innersRef.current[i] = el; }}
                className={`str-word ${w.size}${w.accent ? " amber" : ""}${w.italic ? " italic" : ""}${w.dim ? " dim" : ""}`}
              >
                {w.text}
              </span>
            </div>
          ))}
          <span className="str-spacer" />
        </div>
      </div>
    </section>
  );
}
