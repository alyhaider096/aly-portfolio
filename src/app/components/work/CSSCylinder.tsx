"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { projects } from "../../data/projects";
import { CardVisual } from "./CardVisuals";

/* ═══════════════════════════════════════════
   CSS 3D CYLINDER GALLERY
   Pure CSS transforms — no Three.js needed
   Orbital wobble + drag-to-spin + snap
   ═══════════════════════════════════════════ */

const TOTAL = projects.length;

interface Props {
    activeIndex: number;
    onCardClick?: (id: string) => void;
}

export default function CSSCylinder({ activeIndex, onCardClick }: Props) {
    const stageRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [radius, setRadius] = useState(380);
    const rotRef = useRef(0);
    const autoAngleRef = useRef(0);
    const autoSpinRef = useRef(true);
    const rafRef = useRef<number>(0);
    const dragXRef = useRef<number | null>(null);
    const dragStartRotRef = useRef(0);
    const targetRotRef = useRef(0);
    const lastTsRef = useRef<number | null>(null);

    const [detailIdx, setDetailIdx] = useState<number | null>(null);

    const getVisualRot = useCallback(() => {
        if (!stageRef.current) return 0;
        const m = stageRef.current.style.transform.match(/rotateY\(([^d]+)deg\)/);
        return m ? parseFloat(m[1]) : 0;
    }, []);

    const snapTo = useCallback((i: number) => {
        if (autoSpinRef.current) {
            rotRef.current = getVisualRot();
            autoSpinRef.current = false;
        }
        const step = 360 / TOTAL;
        const raw = -(step * i);
        const cur = rotRef.current % 360;
        let diff = raw - cur;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        targetRotRef.current = rotRef.current + diff;
        setDetailIdx(i);
    }, [getVisualRot]);

    useEffect(() => {
        if (activeIndex >= 0) {
            snapTo(activeIndex);
        } else {
            autoSpinRef.current = true;
            lastTsRef.current = null;
            setDetailIdx(null);
        }
    }, [activeIndex, snapTo]);

    // Responsive radius
    useEffect(() => {
        const handleResize = () => setRadius(window.innerWidth < 768 ? 200 : 380);
        handleResize(); // initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Animation loop — orbital wobble + spin
    useEffect(() => {
        const animate = (ts: number) => {
            if (!stageRef.current) { rafRef.current = requestAnimationFrame(animate); return; }

            if (autoSpinRef.current) {
                if (!lastTsRef.current) lastTsRef.current = ts;
                const dt = ts - lastTsRef.current;
                autoAngleRef.current += dt * 0.008;
                lastTsRef.current = ts;

                // Orbital wobble: gentle X tilt + subtle sway
                const tiltX = Math.sin(ts * 0.0006) * 3;
                const tiltZ = Math.cos(ts * 0.0004) * 1.5;
                stageRef.current.style.transform =
                    `rotateX(${tiltX}deg) rotateY(${autoAngleRef.current}deg) rotateZ(${tiltZ}deg)`;
            } else {
                lastTsRef.current = null;
                rotRef.current += (targetRotRef.current - rotRef.current) * 0.08;
                // Subtle breathing when snapped
                const breathX = Math.sin(ts * 0.001) * 1.5;
                stageRef.current.style.transform =
                    `rotateX(${breathX}deg) rotateY(${rotRef.current}deg)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // Mouse drag
    const handleMouseDown = (e: React.MouseEvent) => {
        if (autoSpinRef.current) { rotRef.current = getVisualRot(); autoSpinRef.current = false; }
        dragXRef.current = e.clientX;
        dragStartRotRef.current = rotRef.current;
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (dragXRef.current === null) return;
            const dx = e.clientX - dragXRef.current;
            targetRotRef.current = dragStartRotRef.current + dx * 0.4;
            rotRef.current = targetRotRef.current;
        };
        const handleUp = () => { dragXRef.current = null; };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, []);

    // Touch drag
    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const handleTouchStart = (e: TouchEvent) => {
            if (autoSpinRef.current) { rotRef.current = getVisualRot(); autoSpinRef.current = false; }
            dragXRef.current = e.touches[0].clientX;
            dragStartRotRef.current = rotRef.current;
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (dragXRef.current === null) return;
            targetRotRef.current = dragStartRotRef.current + (e.touches[0].clientX - dragXRef.current) * 0.4;
            rotRef.current = targetRotRef.current;
        };
        const handleTouchEnd = () => { dragXRef.current = null; };
        panel.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            panel.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [getVisualRot]);

    return (
        <div ref={panelRef} className="cyl-panel" onMouseDown={handleMouseDown}>
            <div className="cyl-ambient" />

            <div className="cyl-scene">
                <div className="cyl-stage" ref={stageRef}>
                    {projects.map((p, i) => {
                        const angle = (360 / TOTAL) * i;
                        return (
                            <div
                                key={p.id}
                                className={`cc ${activeIndex === i ? "is-active" : ""}`}
                                style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                                onClick={() => onCardClick?.(p.id)}
                            >
                                <div className="cc-inner">
                                    <CardVisual id={p.id} />
                                    <div className="cc-vignette" />
                                    <div className="cc-label">
                                        <div className="cc-title">{p.title}</div>
                                        <div className="cc-sub">{p.shortDescription} · {p.year}</div>
                                        <div className="cc-tags">
                                            {p.tags.map((t) => (
                                                <span key={t} className="cc-tag">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="cyl-hint">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Drag to spin
            </div>

            <div className={`cyl-detail ${detailIdx !== null ? "show" : ""}`}>
                {detailIdx !== null && (
                    <>
                        <div className="cd-name">{projects[detailIdx].title}</div>
                        <div className="cd-desc">{projects[detailIdx].shortDescription}</div>
                    </>
                )}
            </div>
        </div>
    );
}
