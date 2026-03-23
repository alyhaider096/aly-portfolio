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

    const card      = cardRef.current;
    const particles = card.querySelectorAll(".particle");
    const badge     = card.querySelector(".hero-card-badge");
    const image     = card.querySelector(".hero-card-image");
    const name      = card.querySelectorAll(".hero-card-name span");
    const role      = card.querySelector(".hero-card-role");
    const cta       = card.querySelector(".hero-card-cta");

    const tl = gsap.timeline();

    tl.fromTo(
      card,
      { z: -2000, rotateY: 140, rotateX: -40, scale: 0.3, opacity: 0 },
      { z: 0,     rotateY: 0,   rotateX: 0,   scale: 1,   opacity: 1, duration: 2, ease: "power4.out" }
    );

    if (image) {
      tl.fromTo(image, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "-=1.3");
    }
    if (badge) {
      tl.fromTo(badge, { opacity: 0, scale: 0, rotateZ: -180 }, { opacity: 1, scale: 1, rotateZ: 0, duration: 0.8, ease: "back.out(2)" }, "-=0.8");
    }
    if (name.length) {
      tl.fromTo(name, { opacity: 0, y: 30, rotateX: -90 }, { opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 0.8, ease: "back.out(2)" }, "-=0.6");
    }
    if (role) {
      tl.fromTo(role, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");
    }
    if (cta) {
      tl.fromTo(cta, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.3");
    }
    if (particles.length) {
      tl.fromTo(particles, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.02, duration: 0.5 }, "-=1");
    }
  }, [cardRef, ready]);

  // ========================================
  // 2) IDLE FLOAT — MutationObserver replaces RAF polling
  // ========================================
  useEffect(() => {
    if (!cardRef.current || !ready) return;

    const card = cardRef.current;
    let idleTl: gsap.core.Timeline | null = null;

    const startIdle = () => {
      if (idleTl) return;
      idleTl = gsap.timeline({ repeat: -1, yoyo: true });
      idleTl.to(card, { y: -10, duration: 4.8, ease: "sine.inOut" });
      idleTl.to(card, { rotateZ: 1.6, scale: 1.005, duration: 5.4, ease: "sine.inOut" }, 0);
    };

    const stopIdle = () => {
      if (idleTl) { idleTl.kill(); idleTl = null; }
      gsap.set(card, { clearProps: "y,rotateZ,scale" });
    };

    // MutationObserver — fires only when data-scroll-lock attribute actually changes
    const obs = new MutationObserver(() => {
      if (card.dataset.scrollLock === "1") stopIdle();
      else startIdle();
    });
    obs.observe(card, { attributes: true, attributeFilter: ["data-scroll-lock"] });

    const startTimer = setTimeout(() => {
      if (card.dataset.scrollLock !== "1") startIdle();
    }, 2200);

    return () => {
      clearTimeout(startTimer);
      obs.disconnect();
      stopIdle();
    };
  }, [cardRef, ready]);

  // ========================================
  // 3) MOUSE PARALLAX — quickTo eliminates tween stacking
  // ========================================
  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;

    const card  = cardRef.current;
    const image = imageRef.current;

    // Single persistent updaters — created once, no new tweens on each mousemove
    const rotY = gsap.quickTo(card,  "rotateY", { duration: 0.9, ease: "power3.out" });
    const rotX = gsap.quickTo(card,  "rotateX", { duration: 0.9, ease: "power3.out" });
    const imgX = gsap.quickTo(image, "x",       { duration: 1.1, ease: "power3.out" });
    const imgY = gsap.quickTo(image, "y",       { duration: 1.1, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      if (card.dataset.scrollLock === "1") return;
      const mouseX = e.clientX / window.innerWidth  - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      rotY(mouseX * 15);
      rotX(-mouseY * 15);
      imgX(mouseX * -18);
      imgY(mouseY * -18);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [cardRef, imageRef]);
}
