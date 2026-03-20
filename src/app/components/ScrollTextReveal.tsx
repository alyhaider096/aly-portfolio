"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./scrollTextReveal.css";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   SCROLL TEXT REVEAL — Scroll-driven
   Text slides in from left on scroll
   ═══════════════════════════════════════ */

const WORDS = [
    { text: "Engineering", size: "xl" },
    { text: "AI", size: "xl", amber: true },
    { text: "Systems", size: "lg" },
    { text: "Apps", size: "xl" },
    { text: "&", size: "sm", amber: true },
    { text: "Automation", size: "xl" },
    { text: "That", size: "md" },
    { text: "Turn", size: "xl" },
    { text: "Ideas", size: "xl", amber: true },
    { text: "Into", size: "md" },
    { text: "Living", size: "xl" },
    { text: "Products", size: "xl", amber2: true },
];

export default function ScrollTextReveal() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const wordsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current || !trackRef.current) return;

        const track = trackRef.current;
        const words = wordsRef.current.filter(Boolean) as HTMLDivElement[];

        // Calculate how far to scroll horizontally
        const getScrollAmount = () => track.scrollWidth - window.innerWidth + 100;

        // Horizontal scroll driven by vertical scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${getScrollAmount()}`,
                pin: true,
                scrub: 1.2,
                invalidateOnRefresh: true,
            },
        });

        // Move the track left as user scrolls
        tl.to(track, {
            x: () => -getScrollAmount(),
            ease: "none",
            duration: 1,
        });

        // Word reveal: each word starts offscreen left and invisible,
        // slides in as the track moves
        words.forEach((word, i) => {
            gsap.set(word, { opacity: 0, x: -80, scale: 0.92 });

            ScrollTrigger.create({
                trigger: word,
                containerAnimation: tl,
                start: "left 90%",
                end: "left 30%",
                scrub: true,
                onEnter: () => {
                    gsap.to(word, {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        duration: 0.6,
                        ease: "power2.out",
                    });
                },
                onLeaveBack: () => {
                    gsap.to(word, {
                        opacity: 0,
                        x: -80,
                        scale: 0.92,
                        duration: 0.4,
                        ease: "power2.in",
                    });
                },
            });
        });

        return () => {
            ScrollTrigger.getById("str-pin")?.kill();
            tl.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="str-section">
            {/* Subtle vignette only */}
            <div className="str-vig" />

            {/* Horizontal track */}
            <div className="str-stage">
                <div ref={trackRef} className="str-track">
                    {WORDS.map((w, i) => (
                        <div
                            key={i}
                            ref={(el) => { wordsRef.current[i] = el; }}
                            className={`str-word ${w.size}${w.amber ? " amber" : ""}${w.amber2 ? " amber2" : ""}`}
                        >
                            {w.text}
                        </div>
                    ))}
                    <span className="str-spacer" />
                </div>
            </div>
        </section>
    );
}
