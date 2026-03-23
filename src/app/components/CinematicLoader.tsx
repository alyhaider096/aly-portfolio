"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";

/* ═══════════════════════════════════════════════════════
   CINEMATIC LOADER v2
   Pure GSAP + HTML — no Three.js overhead
   Curtain-reveal name → subtitle → progress bar → wipe up
   ═══════════════════════════════════════════════════════ */

const NAME_CHARS = ["A", "L", "Y", "\u00A0", "H", "A", "I", "D", "E", "R"];

export default function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const charsRef      = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLSpanElement>(null);
  const lineRef       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars    = charsRef.current.filter(Boolean) as HTMLSpanElement[];
    const subtitle = subtitleRef.current;
    const bar      = progressBarRef.current;
    const counter  = counterRef.current;
    const line     = lineRef.current;

    // ── Initial states ──
    gsap.set(chars,    { yPercent: 105, opacity: 0 });
    gsap.set(subtitle, { opacity: 0, y: 14 });
    gsap.set(line,     { scaleX: 0 });
    if (bar) gsap.set(bar, { scaleX: 0 });

    const tl = gsap.timeline({ onComplete });

    // 1. Thin accent line extends from center
    tl.to(line, {
      scaleX: 1,
      duration: 0.55,
      ease: "expo.out",
      transformOrigin: "center",
    }, 0);

    // 2. Name characters curtain-reveal (emerge upward through overflow-hidden slots)
    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.055,
      duration: 0.75,
      ease: "expo.out",
    }, 0.15);

    // 3. Subtitle fades up
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    }, 0.8);

    // 4. Progress bar fills — scrubs independently from 0 → 3.4s
    if (bar) {
      tl.to(bar, {
        scaleX: 1,
        duration: 3.2,
        ease: "power1.inOut",
        transformOrigin: "left center",
      }, 0.2);
    }

    // 5. Counter ticks alongside progress bar
    if (counter) {
      tl.to({}, {
        duration: 3.2,
        onUpdate() {
          counter.textContent = Math.floor(this.progress() * 100).toString().padStart(3, "0");
        },
      }, 0.2);
    }

    // 6. Exit — full-panel clip-path slides UP, revealing hero beneath
    //    Background matches hero (#090805) so transition is invisible on dark areas
    const exitAt = 3.55;
    tl.to(container, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.85,
      ease: "power4.inOut",
    }, exitAt);

    return () => { tl.kill(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        1000,
        background:    "#090805",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        justifyContent:"center",
        clipPath:      "inset(0 0 0% 0)",
        willChange:    "clip-path",
      }}
    >
      {/* Thin accent line above name */}
      <div
        ref={lineRef}
        style={{
          width:           "clamp(3rem, 8vw, 7rem)",
          height:          "1px",
          background:      "var(--accent)",
          marginBottom:    "2rem",
          transformOrigin: "center",
          opacity:         0.7,
        }}
      />

      {/* Name — each character in its own overflow-hidden slot (curtain effect) */}
      <div
        style={{
          display:     "flex",
          alignItems:  "baseline",
          overflow:    "hidden",
          paddingBottom: "0.1em", // prevent descender clip
        }}
      >
        {NAME_CHARS.map((char, i) => (
          <span
            key={i}
            style={{
              display:    "inline-block",
              overflow:   "hidden",
              lineHeight: 1,
            }}
          >
            <span
              ref={(el) => { charsRef.current[i] = el; }}
              style={{
                display:     "inline-block",
                fontFamily:  "var(--font-display)",
                fontSize:    "clamp(3.5rem, 9vw, 10.5rem)",
                fontWeight:  300,
                letterSpacing: char === "\u00A0" ? "0.12em" : "0.06em",
                color:       "var(--fg)",
                lineHeight:  1,
                width:       char === "\u00A0" ? "0.45em" : undefined,
                userSelect:  "none",
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontFamily:    "var(--font-mono)",
          fontSize:      "clamp(0.6rem, 1.1vw, 0.8rem)",
          color:         "var(--accent)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          marginTop:     "1.75rem",
          opacity:       0,
          userSelect:    "none",
        }}
      >
        Creative Developer · AI Automation
      </p>

      {/* Progress track */}
      <div
        style={{
          position:   "absolute",
          bottom:     "10%",
          left:       "8vw",
          right:      "8vw",
          height:     "1px",
          background: "rgba(196,164,107,0.12)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            position:        "absolute",
            inset:           0,
            background:      "linear-gradient(90deg, var(--accent), rgba(196,164,107,0.6))",
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        style={{
          position:      "absolute",
          bottom:        "calc(10% + 0.9rem)",
          right:         "8vw",
          fontFamily:    "var(--font-mono)",
          fontSize:      "0.6rem",
          color:         "rgba(196,164,107,0.45)",
          letterSpacing: "0.18em",
          userSelect:    "none",
        }}
      >
        000
      </span>
    </div>
  );
}
