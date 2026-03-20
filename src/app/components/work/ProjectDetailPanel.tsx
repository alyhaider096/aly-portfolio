"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsap";
import { type Project } from "../../data/projects";
import { CardVisual } from "./CardVisuals";

/* Projects that have real hero images in /assets/hero/projects/ */
const PROJECTS_WITH_IMAGES = ["dinelyx-ai", "animal-welfare", "zozet-app"];

interface Props {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectDetailPanel({ project, isOpen, onClose }: Props) {
    const panelRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!panelRef.current || !backdropRef.current) return;

        if (isOpen && project) {
            gsap.to(backdropRef.current, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
            });
            gsap.to(panelRef.current, {
                x: 0,
                duration: 0.6,
                ease: "power3.out",
            });

            if (contentRef.current) {
                const children = contentRef.current.children;
                gsap.fromTo(
                    children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        stagger: 0.08,
                        duration: 0.6,
                        ease: "power2.out",
                        delay: 0.3,
                    }
                );
            }
        } else {
            gsap.to(panelRef.current, {
                x: "100%",
                duration: 0.5,
                ease: "power3.in",
            });
            gsap.to(backdropRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
            });
        }
    }, [isOpen, project]);

    const hasRealImage = project && PROJECTS_WITH_IMAGES.includes(project.id);

    return (
        <div className={`detail-overlay ${isOpen ? "is-open" : ""}`}>
            <div
                ref={backdropRef}
                className="detail-backdrop"
                onClick={onClose}
            />

            <div ref={panelRef} className="detail-panel">
                <button className="detail-close" onClick={onClose}>
                    ✕
                </button>

                {project && (
                    <div ref={contentRef} className="detail-content-inner">
                        <div className="detail-hero-img">
                            {hasRealImage ? (
                                /* Use real project screenshot */
                                <img
                                    src={project.heroImage}
                                    alt={project.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                /* Fallback to CSS card visual */
                                <div className="detail-cv-wrap">
                                    <CardVisual id={project.id} />
                                    <div className="detail-vignette" />
                                </div>
                            )}
                        </div>

                        <div className="detail-content">
                            <h2 className="detail-title">{project.title}</h2>

                            <div className="detail-tags">
                                {project.categories.map((cat) => (
                                    <span key={cat} className="detail-tag">
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <p className="detail-year">{project.year}</p>

                            <div className="detail-divider" />

                            {project.tags && project.tags.length > 0 && (
                                <div className="detail-tech-wrap">
                                    <p className="detail-tech-label">// TECH STACK</p>
                                    <div className="detail-tech-tags">
                                        {project.tags.map((tag) => (
                                            <span key={tag} className="detail-tech-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="detail-divider" />

                            <p className="detail-description">{project.description}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
