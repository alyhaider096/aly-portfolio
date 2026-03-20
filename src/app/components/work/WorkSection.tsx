"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "../../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../../data/projects";
import InfiniteCarousel from "./InfiniteCarousel";
import ProjectList from "./ProjectList";
import ProjectDetailPanel from "./ProjectDetailPanel";
import CSSCylinder from "./CSSCylinder";
import "./work.css";

gsap.registerPlugin(ScrollTrigger);

export default function WorkSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [detailProject, setDetailProject] = useState<string | null>(null);
    const [panelOpen, setPanelOpen] = useState(false);

    // Open detail panel
    const openDetail = (id: string) => {
        setDetailProject(id);
        setPanelOpen(true);
    };

    // Close detail panel
    const closeDetail = () => {
        setPanelOpen(false);
        setTimeout(() => setDetailProject(null), 600);
    };

    // Find the selected project
    const selectedProject = detailProject
        ? projects.find((p) => p.id === detailProject) ?? null
        : null;

    // GSAP scroll entrance animations
    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const section = sectionRef.current!;

            // Carousel entrance
            const carouselEl = section.querySelector(".carousel-wrapper");
            if (carouselEl) {
                gsap.fromTo(
                    carouselEl,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: carouselEl,
                            start: "top 85%",
                            end: "top 55%",
                            scrub: 0.5,
                        },
                    }
                );
            }

            // Gallery area entrance
            const galleryEl = section.querySelector(".gallery-area");
            if (galleryEl) {
                gsap.fromTo(
                    galleryEl,
                    { opacity: 0, y: 80 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: galleryEl,
                            start: "top 85%",
                            end: "top 50%",
                            scrub: 0.5,
                        },
                    }
                );
            }

            // Project list items stagger
            const listItems = section.querySelectorAll(".project-item");
            if (listItems.length) {
                gsap.fromTo(
                    listItems,
                    { opacity: 0, x: -40 },
                    {
                        opacity: 1,
                        x: 0,
                        stagger: 0.08,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: section.querySelector(".project-list"),
                            start: "top 75%",
                            end: "top 40%",
                            scrub: 0.5,
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <section ref={sectionRef} className="work-section" id="work">
                <div className="work-top-fade" />
                <div className="laser-glow" />

                {/* Grain overlay */}
                <div
                    className="grain pointer-events-none absolute inset-0"
                    style={{ zIndex: 3 }}
                />

                {/* Infinite Carousel */}
                <InfiniteCarousel onProjectClick={openDetail} />

                {/* Gallery: List + CSS Cylinder */}
                <div className="gallery-area">
                    <ProjectList
                        activeIndex={activeIndex}
                        onHover={setActiveIndex}
                        onClick={openDetail}
                    />

                    <CSSCylinder
                        activeIndex={activeIndex}
                        onCardClick={openDetail}
                    />
                </div>

                <div className="work-bottom-fade" />
            </section>

            {/* Detail Panel */}
            <ProjectDetailPanel
                project={selectedProject}
                isOpen={panelOpen}
                onClose={closeDetail}
            />
        </>
    );
}
