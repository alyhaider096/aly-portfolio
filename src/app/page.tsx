"use client";

import { useState } from "react";
import CinematicLoader from "./components/CinematicLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroCard from "./components/HeroCard";
import AboutSection from "./components/AboutSection";
import ScrollTextReveal from "./components/ScrollTextReveal";
import WorkSection from "./components/work/WorkSection";
import ExpertiseSection from "./components/ExpertiseSection";
import ConnectSection from "./components/Connect";

export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {/* Loader — slides up via clip-path on exit, revealing hero beneath */}
      {!ready && <CinematicLoader onComplete={() => setReady(true)} />}

      {/* Main Content */}
      <main>
        {/* Navbar */}
        <Navbar />

        {/* Hero + About share the same stacking context */}
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Hero Section (background, orb, overlays) */}
          <Hero ready={ready} />

          {/* About Section — id for navbar scroll target */}
          <div id="about">
            <AboutSection />
          </div>
        </div>

        {/* ScrollTrigger Horizontal Text Reveal */}
        <ScrollTextReveal />

        {/* Work / Projects Section — id for navbar scroll target */}
        <div id="work">
          <WorkSection />
        </div>

        {/* Cinematic Expertise Section */}
        <ExpertiseSection />

        {/* CARD WRAPPER — Page-level fixed overlay, ABOVE everything */}
        <div
          id="hero-card-wrapper"
          className="pointer-events-none fixed inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1200px",
            zIndex: 40,
          }}
        >
          <HeroCard ready={ready} />
        </div>

        {/* Connect Section */}
        <ConnectSection />
      </main>
    </>
  );
}
