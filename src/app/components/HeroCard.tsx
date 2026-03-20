"use client";

import { useRef, useState, useMemo } from "react";
import { useHeroCardMotion } from "./useHeroCardMotion";
import HeroLiquidEffect from "./HeroLiquidEffect";
import "./heroCard.css";

export default function HeroCard({ ready }: { ready: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useHeroCardMotion(cardRef, imageRef, ready);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        delay: i * 0.35,
        duration: 10 + (i % 5),
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div
      id="shared-hero-card"
      ref={cardRef}
      className={`hero-card ${hovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="hero-particles">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              "--delay": `${p.delay}s`,
              "--duration": `${p.duration}s`,
              "--size": `${p.size}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="hero-card-badge">
        <span className="badge-dot" />
        <span>1+ YEAR EXPERIENCE</span>
      </div>

      <div className="hero-card-welcome">
        <p className="welcome-eyebrow">Welcome to</p>
        <p className="welcome-title">my creative space</p>
      </div>

      <div ref={imageRef} className="hero-card-image">
        <img
          src="/assets/hero/portrait-cutout.png"
          alt="Ali"
          draggable={false}
        />
      </div>

      <div className="hero-card-text">
        <h1 className="hero-card-name">
          <span>A</span>
          <span>L</span>
          <span>I</span>
        </h1>
        <p className="hero-card-role">AI Automation × Creative Developer</p>
      </div>

      <a href="/assets/ALY-CV.pdf" download className="hero-card-cta">
        Download CV <span>→</span>
      </a>

      <div className="hero-card-accent" />
      <div className="hero-card-border" />
      <div className="hero-card-glow" />

      {hovered && <HeroLiquidEffect />}
    </div>
  );
}
