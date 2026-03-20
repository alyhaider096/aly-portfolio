"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./expertiseSection.css";

gsap.registerPlugin(ScrollTrigger);

const ExpertiseScene = dynamic(() => import("./ExpertiseScene"), {
    ssr: false,
    loading: () => null,
});

/* ── Card Data ── */
const CARDS = [
    {
        id: "mobile",
        num: "01",
        icon: "📱",
        title: "MOBILE DEV",
        desc: "Cross-platform mobile apps with Flutter. From concept to Play Store — UI/UX, state management, Firebase integration.",
        tags: ["Flutter", "Dart", "Firebase", "Supabase"],
        color: "#4ecdc4",
    },
    {
        id: "automation",
        num: "02",
        icon: "⚡",
        title: "AI AUTOMATION",
        desc: "Production automation pipelines & AI agents. Workflow orchestration at scale.",
        tags: ["n8n", "Make", "Lindy AI", "GHL"],
        color: "#e88a3a",
    },
    {
        id: "frontend",
        num: "03",
        icon: "⚛",
        title: "WEB DEV",
        desc: "Immersive web experiences with cinematic motion. Scroll-driven animations and 3D interfaces.",
        tags: ["Next.js", "React", "GSAP", "Three.js"],
        color: "#f0a500",
    },
    {
        id: "ml",
        num: "04",
        icon: "🧪",
        title: "ML / DATA",
        desc: "Machine learning pipelines, data visualization & model training. From raw data to production models.",
        tags: ["Python", "Pandas", "Scikit-Learn", "NumPy"],
        color: "#a855f7",
    },
];

/* ── Text Reveal Letters ── */
const REVEAL_WORD = "EXPERTISE";

export default function ExpertiseSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const titleWrapRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const sceneWrapRef = useRef<HTMLDivElement>(null);
    const textRevealRef = useRef<HTMLDivElement>(null);
    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const [sceneInteractive, setSceneInteractive] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !stageRef.current) return;

        const cards = cardsRef.current.filter((c) => c !== null);
        const titleWrap = titleWrapRef.current;
        const stage = stageRef.current;
        const sceneWrap = sceneWrapRef.current;
        const textReveal = textRevealRef.current;
        const letters = lettersRef.current.filter((l) => l !== null);

        /* ── Initial Setup ── */
        gsap.set(cards, {
            x: 800,
            rotateY: 45,
            opacity: 0,
            transformOrigin: "center center",
        });
        gsap.set(titleWrap, { x: 200, rotateY: -30, opacity: 0 });
        gsap.set(sceneWrap, { opacity: 0 });
        gsap.set(textReveal, { opacity: 0 });
        gsap.set(letters, { x: -120, opacity: 0, rotateY: -45 });

        const isMobile = window.innerWidth < 768;
        const matrixScale = isMobile ? 0.6 : 0.8;
        const matrixSx = isMobile ? 125 : 185;
        const matrixSy = isMobile ? 165 : 240;
        const matrixPos = [
            { x: -matrixSx, y: -matrixSy },
            { x: matrixSx, y: -matrixSy },
            { x: -matrixSx, y: matrixSy },
            { x: matrixSx, y: matrixSy },
        ];

        const splitSx = matrixSx + (isMobile ? 20 : 42);
        const splitSy = matrixSy + (isMobile ? 20 : 42);
        const splitPos = [
            { x: -splitSx, y: -splitSy },
            { x: splitSx, y: -splitSy },
            { x: -splitSx, y: splitSy },
            { x: splitSx, y: splitSy },
        ];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=7500",
                scrub: 1.5,
                pin: true,
                onUpdate: (self) => {
                    if (self.progress > 0.85) {
                        setSceneInteractive(true);
                    } else {
                        setSceneInteractive(false);
                    }
                },
            },
        });

        /* Phase 1: Title + Slide to Center Stack */
        tl.to(titleWrap, { x: 0, rotateY: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, 0);

        cards.forEach((card, i) => {
            tl.to(card, {
                x: 0,
                y: 0,
                rotateY: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                zIndex: i + 1,
            }, 0.8 + i * 0.3);
        });

        // Phase 2: Deep stack offsets
        tl.to(cards[0], { z: -30, y: -10, x: -10, scale: 0.94, duration: 1 }, 3.2);
        tl.to(cards[1], { z: -15, y: -5, x: -5, scale: 0.97, duration: 1 }, 3.2);
        tl.to(cards[2], { z: 0, y: 0, x: 0, scale: 1, duration: 1 }, 3.2);
        tl.to(cards[3], { z: 15, y: 5, x: 5, scale: 1.03, duration: 1 }, 3.2);

        // Phase 3: Straighten and form 2x2 Matrix
        cards.forEach((card, i) => {
            tl.to(card, {
                x: matrixPos[i].x,
                y: matrixPos[i].y,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                scale: matrixScale,
                duration: 1.2,
                ease: "power2.inOut",
            }, 4.5);
        });

        // Phase 4: Gentle breath split outward
        cards.forEach((card, i) => {
            tl.to(card, {
                x: splitPos[i].x,
                y: splitPos[i].y,
                z: 0,
                duration: 2.0,
                ease: "power2.inOut",
            }, 6.0);
        });
        tl.to(titleWrap, { x: -100, opacity: 0, duration: 1 }, 6.0);

        /* Phase 5: Cards zoom-through → blank */
        tl.to(stage, {
            scale: 8,
            opacity: 0,
            duration: 2.5,
            ease: "power3.in",
        }, 8.5);

        /* Phase 3: TEXT REVEAL — letter-by-letter from left */
        tl.to(textReveal, { opacity: 1, duration: 0.5 }, 10);
        letters.forEach((letter, i) => {
            tl.to(letter, {
                x: 0,
                opacity: 1,
                rotateY: 0,
                duration: 0.6,
                ease: "power3.out",
            }, 10.2 + i * 0.12);
        });

        // Hold the text on screen (gap in timeline = pinned pause)
        tl.to({}, { duration: 3 }, 12);

        /* Phase 4: Text fades out, character scene fades in */
        tl.to(textReveal, {
            opacity: 0,
            y: -40,
            scale: 1.05,
            duration: 1.5,
            ease: "power2.in",
        }, 15);

        tl.to(sceneWrap, {
            opacity: 1,
            duration: 2,
            ease: "power2.out",
        }, 15.5);

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section ref={containerRef} id="expertise" className="expertise-section">
            <div className="expertise-sticky">
                <div className="expertise-bg" />

                {/* Section Title (Phase 1) — grid bg removed for seamless feel */}
                <div ref={titleWrapRef} className="exp-title-wrap">
                    <h2 className="exp-title">
                        SKILL<br />
                        <span className="exp-title-accent">MATRIX</span>
                    </h2>
                </div>

                {/* Cards Stage (Phase 1-2) */}
                <div ref={stageRef} id="cards-stage" className="w-[100vw] h-[100vh]">
                    {CARDS.map((card, idx) => (
                        <div
                            key={card.id}
                            ref={(el) => {
                                if (el) cardsRef.current[idx] = el;
                            }}
                            className="exp-card"
                            style={{
                                "--accent": card.color,
                                borderColor: `rgba(${hexToRgb(card.color)}, 0.3)`,
                            } as React.CSSProperties}
                            onMouseEnter={() => setActiveCardId(card.id)}
                            onMouseLeave={() => setActiveCardId(null)}
                        >
                            <div
                                className="exp-card-num"
                                style={{ color: card.color, opacity: 0.6 }}
                            >
                                {card.num} // MODULE
                            </div>
                            <div className="exp-card-icon">{card.icon}</div>
                            <div className="exp-card-title">{card.title}</div>
                            <div className="exp-card-desc">{card.desc}</div>

                            <div className="exp-card-tags">
                                {card.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="exp-card-tag"
                                        style={{
                                            color: card.color,
                                            borderColor: `rgba(${hexToRgb(card.color)}, 0.4)`,
                                            background: `rgba(${hexToRgb(card.color)}, 0.08)`,
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div
                                className="exp-card-bar"
                                style={{
                                    background: `linear-gradient(90deg, ${card.color}, #f0a500)`,
                                    transform: activeCardId === card.id ? "scaleX(1)" : "scaleX(0)",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* TEXT REVEAL (Phase 3) — between cards and character */}
                <div ref={textRevealRef} className="exp-text-reveal">
                    <div className="exp-text-reveal-word">
                        {REVEAL_WORD.split("").map((char, i) => (
                            <span
                                key={i}
                                ref={(el) => {
                                    if (el) lettersRef.current[i] = el;
                                }}
                                className="exp-text-reveal-letter"
                            >
                                {char}
                            </span>
                        ))}
                    </div>
                    <div className="exp-text-reveal-sub">
                        // 05 DOMAINS — SCROLL TO EXPLORE
                    </div>
                </div>

                {/* Character Scene (Phase 4) */}
                <div
                    ref={sceneWrapRef}
                    className="exp-scene-wrap"
                    style={{ pointerEvents: sceneInteractive ? 'auto' : 'none' }}
                >
                    <ExpertiseScene />
                </div>
            </div>
        </section>
    );
}

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "240, 165, 0";
}
