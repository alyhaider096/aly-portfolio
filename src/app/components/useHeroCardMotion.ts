"use client";

import { RefObject, useEffect } from "react";
import gsap from "gsap";

export function useHeroCardMotion(
  cardRef: RefObject<HTMLDivElement | null>,
  imageRef: RefObject<HTMLDivElement | null>,
  ready: boolean
) {
  // ========================================
  // 1) ENTRANCE ANIMATION
  // ========================================
  useEffect(() => {
    if (!cardRef.current || !ready) return;

    const card = cardRef.current;
    const particles = card.querySelectorAll(".particle");
    const badge = card.querySelector(".hero-card-badge");
    const image = card.querySelector(".hero-card-image");
    const name = card.querySelectorAll(".hero-card-name span");
    const role = card.querySelector(".hero-card-role");
    const cta = card.querySelector(".hero-card-cta");

    const tl = gsap.timeline();

    // Dramatic 3D entrance
    tl.fromTo(
      card,
      {
        z: -2000,
        rotateY: 140,
        rotateX: -40,
        scale: 0.3,
        opacity: 0,
      },
      {
        z: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power4.out",
      }
    );

    // Image fade-in
    if (image) {
      tl.fromTo(
        image,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
        "-=1.3"
      );
    }

    // Badge spin-in
    if (badge) {
      tl.fromTo(
        badge,
        { opacity: 0, scale: 0, rotateZ: -180 },
        {
          opacity: 1,
          scale: 1,
          rotateZ: 0,
          duration: 0.8,
          ease: "back.out(2)",
        },
        "-=0.8"
      );
    }

    // Staggered text reveal
    if (name.length) {
      tl.fromTo(
        name,
        { opacity: 0, y: 30, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(2)",
        },
        "-=0.6"
      );
    }

    if (role) {
      tl.fromTo(
        role,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );
    }

    if (cta) {
      tl.fromTo(
        cta,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
        "-=0.3"
      );
    }

    if (particles.length) {
      tl.fromTo(
        particles,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, stagger: 0.02, duration: 0.5 },
        "-=1"
      );
    }
  }, [cardRef, ready]);

  // ========================================
  // 2) IDLE FLOAT - DISABLED DURING SCROLL
  // ========================================
  useEffect(() => {
    if (!cardRef.current || !ready) return;

    const card = cardRef.current;
    let idleTl: gsap.core.Timeline | null = null;
    let rafId: number | null = null;

    const isLocked = () => card.dataset.scrollLock === "1";

    const startIdle = () => {
      if (isLocked() || idleTl) return;

      idleTl = gsap.timeline({ repeat: -1, yoyo: true });

      // 🔥 ONLY animate if NOT locked
      idleTl.to(card, {
        y: -10,
        duration: 4.8,
        ease: "sine.inOut",
      });

      idleTl.to(
        card,
        {
          rotateZ: 1.6,
          scale: 1.005,
          duration: 5.4,
          ease: "sine.inOut",
        },
        0
      );
    };

    const stopIdle = () => {
      if (idleTl) {
        idleTl.kill();
        idleTl = null;
      }
      // 🔥 RESET to neutral when stopped
      gsap.set(card, { 
        clearProps: "y,rotateZ,scale" 
      });
    };

    // Monitor lock state constantly
    const checkLock = () => {
      if (isLocked()) {
        stopIdle();
      } else if (!idleTl) {
        startIdle();
      }
      rafId = requestAnimationFrame(checkLock);
    };

    // Start after entrance
    const startTimer = setTimeout(() => {
      checkLock();
    }, 2200);

    return () => {
      clearTimeout(startTimer);
      if (rafId) cancelAnimationFrame(rafId);
      stopIdle();
    };
  }, [cardRef, ready]);

  // ========================================
  // 3) MOUSE PARALLAX - DISABLED DURING SCROLL
  // ========================================
  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;

    const card = cardRef.current;
    const image = imageRef.current;

    const isLocked = () => card.dataset.scrollLock === "1";

    const onMove = (e: MouseEvent) => {
      // 🔥 CRITICAL: Exit immediately if locked
      if (isLocked()) return;

      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      gsap.to(card, {
        rotateY: mouseX * 15,
        rotateX: -mouseY * 15,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.to(image, {
        x: mouseX * -18,
        y: mouseY * -18,
        duration: 1.1,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMove);
    
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [cardRef, imageRef]);
}