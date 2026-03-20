"use client";

import { projects, type ProjectCategory } from "../../data/projects";

interface Props {
    activeIndex: number;
    onHover: (index: number) => void;
    onClick: (id: string) => void;
}

/* ─── Category icon map ─── */
const CATEGORY_ICONS: Record<ProjectCategory, string> = {
    Product: "◈",
    "3D": "▣",
    Graphics: "✦",
    "UI/UX": "◉",
    AI: "⟡",
    Web: "◎",
    Automation: "⚡",
    Mobile: "📱",
};

export default function ProjectList({ activeIndex, onHover, onClick }: Props) {
    return (
        <div className="project-list">
            <p className="project-list-header">
                Works Index
            </p>

            {projects.map((project, i) => {
                const isActive = i === activeIndex;
                return (
                    <div
                        key={project.id}
                        className={`project-item ${isActive ? "is-active" : ""}`}
                        onMouseEnter={() => onHover(i)}
                        onClick={() => onClick(project.id)}
                        style={{ "--item-color": project.color } as React.CSSProperties}
                    >
                        <span className="project-item-icon" style={{ color: project.color }}>
                            {project.icon || CATEGORY_ICONS[project.categories[0]]}
                        </span>

                        <div className="project-item-info">
                            <p className="project-item-title">{project.title}</p>
                            <p className="project-item-sub">{project.shortDescription}</p>
                        </div>

                        <span className="project-item-year">{project.year}</span>

                        {/* Arrow affordance — visible on hover */}
                        <span className="project-item-arrow">→</span>
                    </div>
                );
            })}
        </div>
    );
}
