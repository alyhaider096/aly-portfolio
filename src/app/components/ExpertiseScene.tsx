"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "../utils/gsap";

/* ─── DATA ─────────────────────────────────────────────── */
const SKILLS: Record<string, { domain: string; lines: string; color: string; rgb: string }> = {
    mobile: {
        domain: "// Mobile Development",
        lines: "Flutter & Dart is my jam. Built 3 production apps — Zozet virtual closet, Animal Welfare rescue platform, plus e-commerce MVPs. Firebase, Supabase, clean architecture, Riverpod state management. App Store to Play Store.",
        color: "#c4a46b", rgb: "196,164,107"
    },
    automation: {
        domain: "// AI Automation",
        lines: "n8n, Make, Lindy AI, GoHighLevel — I've automated everything from lead pipelines to finance reports. Built Telegram AI voice bots, GPT-4 transcription flows, scheduled email systems. If a human does it twice, I automate it.",
        color: "#c4a46b", rgb: "196,164,107"
    },
    frontend: {
        domain: "// Web Development",
        lines: "Next.js, React, GSAP, Three.js, ScrollTrigger — this portfolio is proof. Cinematic scroll animations, WebGL shaders, 3D scenes, HTML canvas. HTML, CSS, JavaScript at the core. If it moves on screen, I made it do that.",
        color: "#c4a46b", rgb: "196,164,107"
    },
    ml: {
        domain: "// ML & Data Science",
        lines: "Python, Pandas, NumPy, Scikit-Learn, Matplotlib. Model training, fine-tuning, data visualization. Built classification pipelines, recommendation engines, and data dashboards. From raw CSV to production ML models.",
        color: "#c4a46b", rgb: "196,164,107"
    },
};

const ORBIT_CONF = [
    { key: "mobile",     label: "Mobile Dev"    },
    { key: "automation", label: "AI Automation" },
    { key: "frontend",   label: "Web Dev"       },
    { key: "ml",         label: "ML / Data"     },
];

const CYL_RX    = 165;
const CYL_RY    = 42;
const CYL_H     = 80;
const ROT_SPEED = 0.0022;

interface DustMote {
    angle: number; radius: number; y: number;
    speed: number; ySpeed: number; size: number;
    opacity: number; phase: number;
    r: number; g: number; b: number;
}

function createDustMotes(count: number): DustMote[] {
    // FIX 4+5: unified brown colors + neutral warm whites, radius 30–520 for full viewport
    const PAL = [
        [196, 164, 107],
        [220, 210, 200],
        [210, 200, 190],
        [200, 190, 180],
    ];
    return Array.from({ length: count }, () => {
        const col = PAL[Math.floor(Math.random() * PAL.length)];
        return {
            angle:   Math.random() * Math.PI * 2,
            radius:  30 + Math.random() * 490,
            y:       (Math.random() - 0.5) * 400,
            speed:   (Math.random() - 0.5) * 0.0025,
            ySpeed:  (Math.random() - 0.5) * 0.12,
            size:    Math.random() * 2 + 0.3,
            opacity: Math.random() * 0.32 + 0.04,
            phase:   Math.random() * Math.PI * 2,
            r: col[0], g: col[1], b: col[2],
        };
    });
}

export default function ExpertiseScene() {
    const containerRef    = useRef<HTMLDivElement>(null);
    const bgCanvasRef     = useRef<HTMLCanvasElement>(null);
    const orbitCanvasRef  = useRef<HTMLCanvasElement>(null);
    const charWrapRef     = useRef<HTMLDivElement>(null);
    const charSvgRef      = useRef<SVGSVGElement>(null);
    const plRef           = useRef<SVGCircleElement>(null);
    const prRef           = useRef<SVGCircleElement>(null);
    const mouthPathRef    = useRef<SVGPathElement>(null);
    const bubbleRef       = useRef<HTMLDivElement>(null);

    const isMobileRef      = useRef(false);
    const activeKeyRef    = useRef<string | null>(null);
    const [activeKey,     setActiveKey]    = useState<string | null>(null);
    const [bubbleText,    setBubbleText]   = useState("");
    const [bubbleDomain,  setBubbleDomain] = useState("");

    const typeTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeRef         = useRef(0);
    const mouseRef        = useRef({ x: 0, y: 0, fx: 0, fy: 0 });

    // FIX 1: freeze orbit while mouse is inside scene
    const mouseInsideRef  = useRef(false);

    // FIX 7: track pending mouth-close tween so it can be cancelled
    const mouthTweenRef   = useRef<gsap.core.Tween | null>(null);

    const nodeAngleOffset = useRef(ORBIT_CONF.map((_, i) => (i / ORBIT_CONF.length) * Math.PI * 2));
    const nodeYPhase      = useRef(ORBIT_CONF.map((_, i) => i * (Math.PI * 2 / ORBIT_CONF.length)));
    const cpxRef          = useRef(0);
    const cpyRef          = useRef(0);
    const dustMotesRef    = useRef<DustMote[]>(createDustMotes(100));
    const nodeRefs        = useRef<(HTMLDivElement | null)[]>([]);

    // FIX 8: per-node previous depth for hysteresis
    const prevDepthRef    = useRef<number[]>(new Array(ORBIT_CONF.length).fill(0));

    useEffect(() => {
        if (!bgCanvasRef.current || !orbitCanvasRef.current || !containerRef.current) return;

        const bgCtx = bgCanvasRef.current.getContext("2d")!;
        const obCtx = orbitCanvasRef.current.getContext("2d")!;
        let animId: number;
        let W = 0, H = 0;

        const resize = () => {
            W = bgCanvasRef.current!.width  = orbitCanvasRef.current!.width  = window.innerWidth;
            H = bgCanvasRef.current!.height = orbitCanvasRef.current!.height = window.innerHeight;
            isMobileRef.current = window.innerWidth < 768;
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMouseMove = (e: MouseEvent) => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            mouseRef.current = {
                x: e.clientX, y: e.clientY,
                fx: (e.clientX - w / 2) / w,
                fy: (e.clientY - h / 2) / h,
            };

            if (charSvgRef.current && plRef.current && prRef.current) {
                const rect = charSvgRef.current.getBoundingClientRect();
                const moveEye = (el: SVGCircleElement, bx: number, by: number) => {
                    const sx = rect.left + (bx / 160) * rect.width;
                    const sy = rect.top  + (by / 240) * rect.height;
                    let dx = e.clientX - sx;
                    let dy = e.clientY - sy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    const lim = 50;
                    if (d > lim) { dx = (dx / d) * lim; dy = (dy / d) * lim; }
                    const fx = Math.max(-3, Math.min(3, (dx / rect.width)  * 160 * 0.35));
                    const fy = Math.max(-2.5, Math.min(2.5, (dy / rect.height) * 240 * 0.35));
                    el.setAttribute("cx", String(bx + fx));
                    el.setAttribute("cy", String(by + fy));
                };
                moveEye(plRef.current, 65, 72);
                moveEye(prRef.current, 95, 72);
            }

            cpxRef.current = (e.clientX - W / 2) / W * -14;
            cpyRef.current = (e.clientY - H / 2) / H * -10;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const getNodePos = (i: number) => {
            const cx    = W / 2 + mouseRef.current.fx * 22;
            const cy    = H / 2 + mouseRef.current.fy * 14;
            const angle = timeRef.current * ROT_SPEED + nodeAngleOffset.current[i];
            const x     = cx + Math.cos(angle) * CYL_RX;
            const y     = cy + Math.sin(angle) * CYL_RY
                        + Math.sin(timeRef.current * ROT_SPEED * 0.7 + nodeYPhase.current[i]) * CYL_H * 0.5;
            const depth = Math.sin(angle);
            return { x, y, depth, cx, cy };
        };

        if (bubbleRef.current) {
            bubbleRef.current.style.left = "calc(100% + 40px)";
            bubbleRef.current.style.top = "-40px";
            bubbleRef.current.style.opacity = "0";
            bubbleRef.current.style.transform = "translateY(12px)";
            bubbleRef.current.style.border = "1.5px solid rgba(196,164,107,0.4)";
            bubbleRef.current.style.boxShadow = "0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(196,164,107,0.15)";
            
            const tail = bubbleRef.current.children[0] as HTMLElement | null;
            if (tail) {
                tail.style.borderRight = "10px solid rgba(196,164,107,0.2)";
                tail.style.left = "-10px";
            }
        }

        const render = () => {
            // FIX 1: only advance time when NO node is active — orbit freezes instantly on hover
            if (!activeKeyRef.current) timeRef.current++;

            /* ── BACKGROUND ── */
            bgCtx.clearRect(0, 0, W, H);
            bgCtx.fillStyle = "#090805";
            bgCtx.fillRect(0, 0, W, H);

            const cg = bgCtx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 320);
            cg.addColorStop(0,   "rgba(180,140,80,0.06)");
            cg.addColorStop(0.5, "rgba(140,100,50,0.025)");
            cg.addColorStop(1,   "rgba(180,140,80,0)");
            bgCtx.fillStyle = cg;
            bgCtx.fillRect(0, 0, W, H);

            const vg = bgCtx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75);
            vg.addColorStop(0, "rgba(9,8,5,0)");
            vg.addColorStop(1, "rgba(9,8,5,0.85)");
            bgCtx.fillStyle = vg;
            bgCtx.fillRect(0, 0, W, H);

            /* ── ORBIT CANVAS ── */
            obCtx.clearRect(0, 0, W, H);
            const cx = W / 2 + mouseRef.current.fx * 22;
            const cy = H / 2 + mouseRef.current.fy * 14;

            /* dust motes — FIX 4+5 already applied in createDustMotes */
            dustMotesRef.current.forEach(m => {
                m.angle += m.speed;
                m.y     += m.ySpeed;
                m.phase += 0.008;
                if (Math.abs(m.y) > 400) m.ySpeed *= -1;
                const mx = cx + Math.cos(m.angle) * m.radius;
                const my = cy + m.y + Math.sin(m.phase) * 8;
                const a  = m.opacity * (0.6 + 0.4 * Math.sin(m.phase));
                obCtx.beginPath();
                obCtx.arc(mx, my, m.size, 0, Math.PI * 2);
                obCtx.fillStyle = `rgba(${m.r},${m.g},${m.b},${a.toFixed(3)})`;
                obCtx.fill();
            });

            /* orbit rings */
            obCtx.save();
            obCtx.beginPath();
            obCtx.setLineDash([1.5, 14]);
            obCtx.ellipse(cx, cy, CYL_RX, CYL_RY, 0, 0, Math.PI * 2);
            obCtx.strokeStyle = "rgba(196,164,107,0.1)";
            obCtx.lineWidth   = 1;
            obCtx.stroke();
            obCtx.setLineDash([]);

            const innerAngle = -timeRef.current * ROT_SPEED * 0.6;
            obCtx.beginPath();
            obCtx.setLineDash([1.5, 14]);
            obCtx.ellipse(cx, cy, CYL_RX * 0.6, CYL_RY * 0.6, innerAngle, 0, Math.PI * 2);
            obCtx.strokeStyle = "rgba(196,164,107,0.06)";
            obCtx.lineWidth   = 0.8;
            obCtx.stroke();
            obCtx.setLineDash([]);

            /* spokes + dot per node */
            const positions = ORBIT_CONF.map((_, i) => ({ ...getNodePos(i), i }));
            positions.sort((a, b) => a.depth - b.depth);

            positions.forEach(pos => {
                const isAct    = activeKeyRef.current === ORBIT_CONF[pos.i].key;
                const fieldRGB = SKILLS[ORBIT_CONF[pos.i].key].rgb;

                obCtx.beginPath();
                obCtx.moveTo(cx, cy);
                obCtx.lineTo(pos.x, pos.y);
                if (isAct) {
                    obCtx.setLineDash([]);
                    obCtx.strokeStyle = `rgba(${fieldRGB},0.35)`;
                } else {
                    obCtx.setLineDash([2, 10]);
                    obCtx.strokeStyle = pos.depth > 0
                        ? `rgba(${fieldRGB},0.18)`
                        : `rgba(${fieldRGB},0.08)`;
                }
                obCtx.lineWidth = 1;
                obCtx.stroke();
                obCtx.setLineDash([]);

                obCtx.beginPath();
                obCtx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
                obCtx.fillStyle = isAct
                    ? `rgba(${fieldRGB},0.7)`
                    : `rgba(${fieldRGB},0.2)`;
                obCtx.fill();
            });
            obCtx.restore();

            /* ── DOM NODE UPDATES (direct style mutations — no React re-render) ── */
            ORBIT_CONF.forEach((conf, i) => {
                const el = nodeRefs.current[i];
                if (!el) return;

                const p         = getNodePos(i);
                const isActive  = activeKeyRef.current === conf.key;
                const depthNorm = (p.depth + 1) / 2;
                const fieldData = SKILLS[conf.key];

                /* position */
                el.style.left = p.x + "px";
                el.style.top  = p.y + "px";

                /* scale + alpha */
                const scale = isActive ? 1.12 : 0.55 + depthNorm * 0.45;
                const alpha = (activeKeyRef.current && !isActive)
                    ? 0.3
                    : 0.22 + depthNorm * 0.78;
                el.style.transform  = `translate(-50%, -50%) scale(${scale})`;
                el.style.opacity    = String(alpha);
                el.style.transition = isActive
                    ? "none"
                    : "opacity 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1)";

                // FIX 8: hysteresis — only flip zIndex when crossing ±0.15 threshold
                const prev = prevDepthRef.current[i];
                if      (p.depth >  0.15 && prev <=  0.15) el.style.zIndex = "16";
                else if (p.depth < -0.15 && prev >= -0.15) el.style.zIndex = "14";
                prevDepthRef.current[i] = p.depth;

                /* outer circle (children[0]) */
                const outerCircle = el.children[0] as HTMLDivElement | null;
                if (outerCircle) {
                    // FIX 2: pulse driven here in RAF, not frozen in JSX
                    const pulse = Math.sin(timeRef.current * 0.025 + i * 1.2) * 0.28 + 0.22;
                    outerCircle.style.border      = `1px solid ${
                        isActive
                            ? `rgba(${fieldData.rgb},0.85)`
                            : `rgba(${fieldData.rgb},${pulse.toFixed(3)})`
                    }`;
                    outerCircle.style.boxShadow   = isActive
                        ? `0 0 28px rgba(${fieldData.rgb},0.22), 0 0 8px rgba(${fieldData.rgb},0.1)`
                        : "none";

                    /* inner dot (children[0] of outerCircle) — FIX 3: field color */
                    const innerDot = outerCircle.children[0] as HTMLDivElement | null;
                    if (innerDot) {
                        innerDot.style.width      = isActive ? "16.8px" : "6px";
                        innerDot.style.height     = isActive ? "16.8px" : "6px";
                        innerDot.style.background = fieldData.color;
                        innerDot.style.boxShadow  = isActive
                            ? `0 0 12px rgba(${fieldData.rgb},0.4)`
                            : "none";
                    }
                }

                /* label (children[1]) — FIX 3: field color */
                const labelBox = el.children[1] as HTMLDivElement | null;
                if (labelBox) {
                    labelBox.style.color       = isActive
                        ? fieldData.color
                        : `rgba(${fieldData.rgb},0.5)`;
                    labelBox.style.borderColor = isActive
                        ? `rgba(${fieldData.rgb},0.6)`
                        : `rgba(${fieldData.rgb},0.15)`;
                    labelBox.style.background  = isActive
                        ? `rgba(${fieldData.rgb},0.1)`
                        : "rgba(12,10,6,0.88)";
                    labelBox.style.boxShadow   = isActive
                        ? "0 4px 12px rgba(0,0,0,0.5)"
                        : "none";
                }
            });

            if (charWrapRef.current) {
                gsap.set(charWrapRef.current, { x: cpxRef.current, y: cpyRef.current });
            }
            animId = requestAnimationFrame(render);
        };
        render();

        /* idle breathing */
        if (charSvgRef.current) {
            gsap.to(charSvgRef.current, {
                scaleY: 1.012, y: -3, duration: 2.8,
                repeat: -1, yoyo: true, ease: "sine.inOut",
                transformOrigin: "center bottom",
            });
        }
        if (charWrapRef.current) {
            gsap.to(charWrapRef.current, {
                y: "+=8", duration: 3.5,
                repeat: -1, yoyo: true, ease: "sine.inOut",
            });
        }

        /* entry animation */
        gsap.set("#es-char-svg",       { autoAlpha: 0, y: 50, scale: 0.9 });
        gsap.set(".es-node",           { autoAlpha: 0, scale: 0.4 });
        gsap.set(".es-cdeco, #es-hint",{ autoAlpha: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to("#es-char-svg", { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: "back.out(1.4)" }, 0.2)
          .to(".es-node",     { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: "back.out(1.8)" }, 0.7)
          .to(".es-cdeco",    { autoAlpha: 1, duration: 0.45, stagger: 0.06 }, 1.1)
          .to("#es-hint",     { autoAlpha: 1, duration: 0.5 }, 1.3);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animId);
            gsap.killTweensOf(charSvgRef.current);
            gsap.killTweensOf(charWrapRef.current);
        };
    }, []);

    /* ── INTERACTION HANDLERS ── */
    const handleNodeEnter = useCallback((key: string) => {
        activeKeyRef.current = key;
        setActiveKey(key);

        if (typeTimerRef.current) clearInterval(typeTimerRef.current);

        // FIX 7: kill any pending mouth-close tween before starting new one
        if (mouthTweenRef.current) {
            mouthTweenRef.current.kill();
            mouthTweenRef.current = null;
        }

        setBubbleText("");
        setBubbleDomain(SKILLS[key]?.domain || "");

        const fieldData = SKILLS[key];

        /* Position bubble: below character on mobile, left/right on desktop */
        if (bubbleRef.current && charWrapRef.current) {
            const wrapRect = charWrapRef.current.getBoundingClientRect();
            const spaceRight = window.innerWidth - wrapRect.right;
            const bubbleW    = 360; // bubble width + gap
            const isMob = isMobileRef.current;

            if (isMob) {
                // On mobile: position below the character
                bubbleRef.current.style.left      = "50%";
                bubbleRef.current.style.right     = "auto";
                bubbleRef.current.style.top       = "calc(100% + 16px)";
                bubbleRef.current.style.transform = "translateX(-50%)";
                bubbleRef.current.style.width     = `${Math.min(320, window.innerWidth - 32)}px`;
                const tail = bubbleRef.current.children[0] as HTMLElement;
                if (tail) { tail.style.display = "none"; }
            } else if (spaceRight < bubbleW) {
                // not enough room right → flip to left
                bubbleRef.current.style.left      = "auto";
                bubbleRef.current.style.right     = "calc(100% + 40px)";
                bubbleRef.current.style.top       = "-40px";
                bubbleRef.current.style.transform = "translateY(0)";
                bubbleRef.current.style.width     = "340px";
                // flip tail to right side
                const tail = bubbleRef.current.children[0] as HTMLElement;
                if (tail) {
                    tail.style.display     = "block";
                    tail.style.left        = "auto";
                    tail.style.right       = "-10px";
                    tail.style.borderRight = "none";
                    tail.style.borderLeft  = `10px solid rgba(${fieldData.rgb},0.25)`;
                }
            } else {
                bubbleRef.current.style.right     = "auto";
                bubbleRef.current.style.left      = "calc(100% + 40px)";
                bubbleRef.current.style.top       = "-40px";
                bubbleRef.current.style.transform = "translateY(0)";
                bubbleRef.current.style.width     = "340px";
                const tail = bubbleRef.current.children[0] as HTMLElement;
                if (tail) {
                    tail.style.display     = "block";
                    tail.style.right       = "auto";
                    tail.style.left        = "-10px";
                    tail.style.borderLeft  = "none";
                    tail.style.borderRight = `10px solid rgba(${fieldData.rgb},0.25)`;
                }
            }

            // update bubble border + shadow to field color
            bubbleRef.current.style.borderColor = `rgba(${fieldData.rgb},0.4)`;
            bubbleRef.current.style.boxShadow   = `0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(${fieldData.rgb},0.15)`;

            // update domain label color (children[1] = domain div)
            const domainEl = bubbleRef.current.children[1] as HTMLElement | null;
            if (domainEl) domainEl.style.color = fieldData.color;

            // update cursor blink color (deepest span inside children[2])
            const bodyEl   = bubbleRef.current.children[2] as HTMLElement | null;
            const cursorEl = bodyEl?.querySelector("span") as HTMLElement | null;
            if (cursorEl) cursorEl.style.background = fieldData.color;
        }

        /* mouth opens */
        if (mouthPathRef.current) {
            mouthTweenRef.current = gsap.to(mouthPathRef.current, {
                attr: { d: "M71 95 Q75 103 80 104 Q85 103 89 95" },
                duration: 0.2,
            });
        }

        /* bubble fade in (CSS) */
        if (bubbleRef.current) {
            bubbleRef.current.style.opacity = "1";
            if (!isMobileRef.current) {
                bubbleRef.current.style.transform = "translateY(0)";
            }
        }

        /* typewriter */
        const fullText = SKILLS[key]?.lines || "";
        let idx = 0;
        typeTimerRef.current = setInterval(() => {
            if (idx < fullText.length) {
                setBubbleText(fullText.slice(0, idx + 1));
                idx++;
            } else {
                if (typeTimerRef.current) clearInterval(typeTimerRef.current);
                // FIX 7: store tween ref so it can be killed if node switches
                if (mouthPathRef.current) {
                    mouthTweenRef.current = gsap.to(mouthPathRef.current, {
                        attr: { d: "M71 97 Q80 101 89 97" },
                        duration: 0.25,
                        delay: 0.3,
                        onComplete: () => { mouthTweenRef.current = null; },
                    });
                }
            }
        }, 18);
    }, []);

    const handleNodeLeave = useCallback(() => {
        activeKeyRef.current = null;
        setActiveKey(null);

        if (typeTimerRef.current) clearInterval(typeTimerRef.current);

        // FIX 7: kill pending delayed mouth-close before issuing reset
        if (mouthTweenRef.current) {
            mouthTweenRef.current.kill();
            mouthTweenRef.current = null;
        }

        if (bubbleRef.current) {
            bubbleRef.current.style.opacity = "0";
            if (!isMobileRef.current) {
                bubbleRef.current.style.transform = "translateY(12px)";
            }
        }
        if (mouthPathRef.current) {
            mouthTweenRef.current = gsap.to(mouthPathRef.current, {
                attr: { d: "M71 97 Q80 101 89 97" },
                duration: 0.25,
                onComplete: () => { mouthTweenRef.current = null; },
            });
        }
    }, []);

    const activeColor = activeKey ? SKILLS[activeKey].color : "#c4a46b";

    return (
        <div
            ref={containerRef}
            className="relative w-screen h-screen flex items-center justify-center overflow-hidden"
            style={{ background: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-heading)" }}
            // Dismiss speech if mouse leaves the whole scene
            onMouseLeave={() => { handleNodeLeave(); }}
        >
            <canvas ref={bgCanvasRef}    className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />
            <canvas ref={orbitCanvasRef} className="absolute inset-0" style={{ zIndex: 4, pointerEvents: 'none' }} />

            {/* Character + Speech Bubble */}
            <div ref={charWrapRef} className="relative z-10 flex items-center justify-center will-change-transform">

                {/* Bubble — initial position left, flipped dynamically in handleNodeEnter (FIX 6) */}
                <div
                    ref={bubbleRef}
                    className="absolute z-[30] pointer-events-none w-[340px] px-[28px] pb-[26px] pt-[24px]"
                    style={{
                        background: "rgba(18,15,12,0.98)",
                        borderRadius: "12px",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        transition: "opacity 0.35s ease-out, transform 0.35s ease-out, border-color 0.3s, box-shadow 0.3s",
                    }}
                >
                    {/* tail — direction flipped dynamically */}
                    <div
                        className="absolute top-[30px] w-0 h-0"
                        style={{
                            borderTop:    "7px solid transparent",
                            borderBottom: "7px solid transparent",
                        }}
                    />
                    {/* domain label — color updated in RAF via handleNodeEnter */}
                    <div style={{
                        fontFamily:    "'Space Mono', monospace",
                        fontSize:      "8px",
                        letterSpacing: "0.22em",
                        color:         "#c4a46b",
                        textTransform: "uppercase",
                        marginBottom:  "14px",
                        opacity:       0.85,
                    }}>
                        {bubbleDomain}
                    </div>
                    {/* body text */}
                    <div style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize:   "11px",
                        lineHeight: "1.8",
                        color:      "#d4c5ae",
                        minHeight:  "90px",
                    }}>
                        {bubbleText}
                        <span
                            className="inline-block w-[1px] h-[12px] ml-[2px] align-middle"
                            style={{
                                background: activeColor,
                                animation:  "es-blink 0.7s steps(1) infinite",
                            }}
                        />
                    </div>
                </div>

                {/* SVG Character */}
                <svg
                    ref={charSvgRef}
                    id="es-char-svg"
                    viewBox="0 0 160 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="overflow-visible"
                    style={{ width: "220px", height: "340px" }}
                >
                    <defs>
                        <radialGradient id="es-hg" cx="50%" cy="45%" r="55%">
                            <stop offset="0%"   stopColor="rgba(196,164,107,0.12)" />
                            <stop offset="100%" stopColor="rgba(196,164,107,0)" />
                        </radialGradient>
                        <filter id="es-glow">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="es-soft"><feGaussianBlur stdDeviation="1.5" /></filter>
                        <style>{`@keyframes es-blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
                    </defs>

                    <ellipse cx="80" cy="56" rx="54" ry="54" fill="url(#es-hg)" />
                    <path d="M37 52 Q32 18 56 8 Q80 0 104 8 Q128 18 123 52 Q118 82 122 96 Q100 88 80 90 Q60 88 38 96 Q42 82 37 52Z" fill="#0c0a06" stroke="rgba(226,213,190,0.45)" strokeWidth="1" />
                    <path d="M38 56 Q30 78 34 100" stroke="rgba(226,213,190,0.2)" strokeWidth="0.8" fill="none" />
                    <path d="M122 56 Q130 78 126 100" stroke="rgba(226,213,190,0.2)" strokeWidth="0.8" fill="none" />
                    <path d="M42 58 Q36 76 40 94" stroke="rgba(226,213,190,0.15)" strokeWidth="0.7" fill="none" />
                    <path d="M118 58 Q124 76 120 94" stroke="rgba(226,213,190,0.15)" strokeWidth="0.7" fill="none" />
                    <path d="M44 58 Q42 82 54 98 Q66 112 80 114 Q94 112 106 98 Q118 82 116 58 Q114 30 80 24 Q46 30 44 58Z" fill="#100d08" stroke="rgba(226,213,190,0.62)" strokeWidth="1.2" />
                    <path d="M46 54 Q48 30 64 24 Q80 18 96 24 Q112 30 114 54" fill="#0c0a06" stroke="rgba(226,213,190,0.42)" strokeWidth="1" />
                    <path d="M54 52 Q56 36 66 28" stroke="rgba(226,213,190,0.2)" strokeWidth="0.7" fill="none" />
                    <path d="M106 52 Q104 36 94 28" stroke="rgba(226,213,190,0.2)" strokeWidth="0.7" fill="none" />
                    <path d="M78 52 Q80 36 82 30" stroke="rgba(226,213,190,0.15)" strokeWidth="0.6" fill="none" />
                    <path d="M56 62 Q64 57 72 60" stroke="rgba(226,213,190,0.72)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                    <path d="M88 60 Q96 57 104 62" stroke="rgba(226,213,190,0.72)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                    <ellipse cx="65" cy="72" rx="9" ry="7.5" fill="#0a0806" stroke="rgba(226,213,190,0.48)" strokeWidth="1" />
                    <ellipse cx="95" cy="72" rx="9" ry="7.5" fill="#0a0806" stroke="rgba(226,213,190,0.48)" strokeWidth="1" />
                    <circle cx="65" cy="72" r="5.2" fill="rgba(38,28,16,0.95)" stroke="rgba(226,213,190,0.25)" strokeWidth="0.5" />
                    <circle cx="95" cy="72" r="5.2" fill="rgba(38,28,16,0.95)" stroke="rgba(226,213,190,0.25)" strokeWidth="0.5" />
                    <circle ref={plRef} cx="65" cy="72" r="3" fill="rgba(226,213,190,0.9)" />
                    <circle ref={prRef} cx="95" cy="72" r="3" fill="rgba(226,213,190,0.9)" />
                    <circle cx="67.5" cy="70" r="1.1" fill="rgba(255,255,255,0.55)" />
                    <circle cx="97.5" cy="70" r="1.1" fill="rgba(255,255,255,0.55)" />
                    <path d="M57 77 Q65 80 73 77" stroke="rgba(226,213,190,0.15)" strokeWidth="0.7" fill="none" />
                    <path d="M87 77 Q95 80 103 77" stroke="rgba(226,213,190,0.15)" strokeWidth="0.7" fill="none" />
                    <path d="M77 82 Q80 87 83 82" stroke="rgba(226,213,190,0.28)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
                    <path ref={mouthPathRef} d="M71 97 Q80 101 89 97" stroke="rgba(226,213,190,0.58)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <rect x="72" y="113" width="16" height="14" fill="#100d08" stroke="rgba(226,213,190,0.3)" strokeWidth="1" />
                    <path d="M50 127 Q64 117 72 121 L80 129 L88 121 Q96 117 110 127 L116 168 L44 168Z" fill="#0d0b07" stroke="rgba(226,213,190,0.38)" strokeWidth="1.1" />
                    <line x1="80" y1="129" x2="80" y2="168" stroke="rgba(226,213,190,0.12)" strokeWidth="0.8" />
                    <path d="M60 150 Q80 153 100 150" stroke="rgba(226,213,190,0.12)" strokeWidth="0.8" fill="none" />
                    <path d="M72 121 L80 131 L88 121" stroke="rgba(226,213,190,0.2)" strokeWidth="0.9" fill="none" />
                    <path d="M50 131 Q38 152 36 176" stroke="rgba(226,213,190,0.38)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <path d="M110 131 Q122 152 124 176" stroke="rgba(226,213,190,0.38)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <ellipse cx="35" cy="180" rx="5.5" ry="6.5" fill="#100d08" stroke="rgba(226,213,190,0.33)" strokeWidth="0.9" />
                    <ellipse cx="125" cy="180" rx="5.5" ry="6.5" fill="#100d08" stroke="rgba(226,213,190,0.33)" strokeWidth="0.9" />
                    <path d="M31 178 L30 185 M34 177 L33 185 M37 177 L36 185 M40 178 L39 185" stroke="rgba(226,213,190,0.2)" strokeWidth="0.6" strokeLinecap="round" />
                    <path d="M121 178 L120 185 M124 177 L123 185 M127 177 L126 185 M130 178 L129 185" stroke="rgba(226,213,190,0.2)" strokeWidth="0.6" strokeLinecap="round" />
                    <path d="M44 168 L48 218 L68 218 L74 186 L86 186 L92 218 L112 218 L116 168Z" fill="#0d0b07" stroke="rgba(226,213,190,0.28)" strokeWidth="1" />
                    <line x1="80" y1="168" x2="80" y2="186" stroke="rgba(226,213,190,0.1)" strokeWidth="0.7" />
                    <path d="M42 218 Q34 218 32 222 Q30 228 44 230 L70 230 L72 218Z" fill="#0a0806" stroke="rgba(226,213,190,0.3)" strokeWidth="0.9" />
                    <path d="M118 218 Q126 218 128 222 Q130 228 116 230 L90 230 L88 218Z" fill="#0a0806" stroke="rgba(226,213,190,0.3)" strokeWidth="0.9" />
                    <circle cx="80" cy="56" r="48" fill="none" stroke="rgba(196,164,107,0.05)" strokeWidth="18" filter="url(#es-soft)" />
                </svg>
            </div>

            {/* Orbit Nodes — minimal JSX, all visual state driven by RAF loop */}
            {ORBIT_CONF.map((node, i) => (
                <div
                    key={node.key}
                    ref={(el) => { nodeRefs.current[i] = el; }}
                    className="es-node absolute flex flex-col items-center gap-[9px] cursor-pointer"
                    onMouseEnter={() => handleNodeEnter(node.key)}
                    onMouseLeave={handleNodeLeave}
                    onTouchStart={(e) => { e.preventDefault(); handleNodeEnter(node.key); }}
                    onTouchEnd={(e) => { e.preventDefault(); }}
                >
                    {/* outer circle — border+shadow updated in RAF (FIX 2+3) */}
                    <div
                        className="w-[46px] h-[46px] rounded-full flex items-center justify-center relative"
                        style={{
                            background:    "rgba(9,8,5,0.7)",
                            backdropFilter: "blur(10px)",
                            border:        "1px solid rgba(196,164,107,0.22)",
                        }}
                    >
                        {/* inner dot — size+color+glow updated in RAF (FIX 3) */}
                        <div
                            className="rounded-full"
                            style={{
                                width:      "6px",
                                height:     "6px",
                                background: SKILLS[node.key].color,
                                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                            }}
                        />
                    </div>
                    {/* label — color+border+bg updated in RAF (FIX 3) */}
                    <div
                        className="whitespace-nowrap rounded-[4px]"
                        style={{
                            fontFamily:    "'Space Mono', monospace",
                            fontSize:      "10px",
                            fontWeight:    "bold",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            padding:       "6px 14px",
                            border:        "1px solid rgba(196,164,107,0.15)",
                            color:         `rgba(${SKILLS[node.key].rgb},0.5)`,
                            background:    "rgba(12,10,6,0.88)",
                            transition:    "all 0.4s",
                        }}
                    >
                        {node.label}
                    </div>
                </div>
            ))}

            {/* Corner decorations */}
            <div className="es-cdeco absolute top-[88px] left-[30px] z-20 pointer-events-none" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(196,164,107,0.12)", letterSpacing: "0.1em", lineHeight: "1.9" }}>
                ALY.DEV<br />v2.0.25
            </div>
            <div className="es-cdeco absolute top-[88px] right-[30px] z-20 pointer-events-none text-right" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(196,164,107,0.12)", letterSpacing: "0.1em", lineHeight: "1.9" }}>
                EXPERTISE<br />04 FIELDS
            </div>
            <div className="es-cdeco absolute bottom-[26px] left-[30px] z-20 pointer-events-none" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(196,164,107,0.12)", letterSpacing: "0.1em", lineHeight: "1.9" }}>
                INTERACTIVE<br />CANVAS
            </div>
            <div className="es-cdeco absolute bottom-[26px] right-[30px] z-20 pointer-events-none text-right" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", color: "rgba(196,164,107,0.12)", letterSpacing: "0.1em", lineHeight: "1.9" }}>
                GSAP + SVG<br />2025
            </div>

            <div id="es-hint" className="absolute bottom-[44px] left-1/2 -translate-x-1/2 z-20 whitespace-nowrap" style={{ fontFamily: "'Space Mono', monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(196,164,107,0.16)", textTransform: "uppercase" }}>
                // hover a field — character speaks
            </div>

            <div
                className="fixed inset-[-50%] w-[200%] h-[200%]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    opacity: 0.028,
                    animation: "es-gs 0.35s steps(1) infinite",
                    zIndex: 50,
                    pointerEvents: 'none',
                }}
            />
            <style>{`@keyframes es-gs{0%{transform:translate(0,0)}25%{transform:translate(-2%,-3%)}50%{transform:translate(3%,1%)}75%{transform:translate(-1%,2%)}}`}</style>
        </div>
    );
}
