"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../../data/projects";
import { CardVisual } from "./CardVisuals";
import RotatingText from "./RotatingText";

interface Props {
    onProjectClick: (id: string) => void;
}

/**
 * macOS-Dock-style infinite carousel
 * Items scale up based on mouse proximity (dock magnification)
 * Continuously auto-slides, pauses near mouse
 * Uses CSS card visuals with project description overlay
 */
export default function InfiniteCarousel({ onProjectClick }: Props) {
    const trackRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState<number | null>(null);
    const animRef = useRef<number>(0);
    const offsetRef = useRef(0);
    const speedRef = useRef(0.5);

    const items = [...projects, ...projects, ...projects];

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
    };

    const handleMouseLeave = () => {
        setMouseX(null);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const animate = () => {
            const targetSpeed = mouseX !== null ? 0.1 : 0.5;
            speedRef.current += (targetSpeed - speedRef.current) * 0.05;
            offsetRef.current -= speedRef.current;

            const itemWidth = 200;
            const resetPoint = -(projects.length * itemWidth);
            if (offsetRef.current <= resetPoint) {
                offsetRef.current += projects.length * itemWidth;
            }

            track.style.transform = `translateX(${offsetRef.current}px)`;
            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [mouseX]);

    const getItemStyle = (index: number): React.CSSProperties => {
        if (mouseX === null || !trackRef.current) {
            return {};
        }
        const itemWidth = 200; // 180 width + 20 gap
        const itemCenter = index * itemWidth + 90 + offsetRef.current;
        const distance = Math.abs(mouseX - itemCenter);
        const maxDistance = 220; // smaller max distance due to smaller cards
        const proximity = Math.max(0, 1 - distance / maxDistance);
        const scale = 1 + proximity * proximity * 0.35;
        const translateY = -proximity * proximity * 16;

        return {
            transform: `scale(${scale}) translateY(${translateY}px)`,
            zIndex: Math.round(proximity * 10),
            transition: "none",
        };
    };

    return (
        <div
            ref={wrapperRef}
            className="carousel-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <p className="carousel-label">
                [ <RotatingText texts={["Selected Works", "Projects", "Case Studies", "Portfolio"]} interval={3000} /> ]
            </p>

            <div ref={trackRef} className="carousel-track-dock">
                {items.map((project, i) => (
                    <div
                        key={`${project.id}-${i}`}
                        className="carousel-item-dock carousel-card-visual"
                        style={getItemStyle(i)}
                        onClick={() => onProjectClick(project.id)}
                    >
                        <div className="carousel-cv-wrap">
                            <CardVisual id={project.id} />
                            <div className="cc-vignette" />
                        </div>
                        {/* Richer card content overlay */}
                        <div className="carousel-card-content">
                            <div className="carousel-card-cat">
                                {project.categories[0]}
                            </div>
                            <div className="carousel-card-title">
                                {project.title}
                            </div>
                            <div className="carousel-card-desc">
                                {project.shortDescription}
                            </div>
                            <div className="carousel-card-tags">
                                {project.tags.slice(0, 2).map((t) => (
                                    <span key={t} className="carousel-card-tag">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
