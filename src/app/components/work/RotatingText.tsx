"use client";

import { useState, useEffect } from "react";
import "./rotatingText.css";

interface Props {
    texts: string[];
    interval?: number;
    className?: string;
}

/**
 * RotatingText — cycles through text labels
 * with a cinematic slide-up/slide-down transition.
 * No external dependencies needed.
 */
export default function RotatingText({
    texts,
    interval = 3000,
    className = "",
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
                setIsAnimating(false);
            }, 400); // half of transition duration
        }, interval);

        return () => clearInterval(timer);
    }, [texts.length, interval]);

    return (
        <span className={`rotating-text-wrapper ${className}`}>
            <span className={`rotating-text-inner ${isAnimating ? "is-exiting" : "is-entering"}`}>
                {texts[currentIndex]}
            </span>
        </span>
    );
}
