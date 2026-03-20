"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollIndicator.css";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScrollIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!indicatorRef.current) return;

    const indicator = indicatorRef.current;

    // Entrance animation
    gsap.fromTo(
      indicator,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 2.5,
        ease: "power3.out",
      }
    );

    // Continuous bounce
    gsap.to(indicator, {
      y: 12,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3.5,
    });

    // Fade out on scroll
    gsap.to(indicator, {
      opacity: 0,
      scrollTrigger: {
        trigger: document.body,
        start: "100px top",
        end: "200px top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={indicatorRef} className="hero-scroll-indicator">
      <div className="hero-scroll-text">Scroll to explore</div>
      <div className="hero-scroll-arrow">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19M12 19L5 12M12 19L19 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}