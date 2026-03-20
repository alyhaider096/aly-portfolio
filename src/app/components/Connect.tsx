"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "../utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./connect.css";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_METHODS = [
    {
        icon: "✉",
        label: "EMAIL",
        value: "aly.haider096@gmail.com",
        action: "Send Message",
        href: "mailto:aly.haider096@gmail.com",
    },
    {
        icon: "in",
        label: "LINKEDIN",
        value: "Ali Haider",
        action: "Connect Profile",
        href: "https://www.linkedin.com/in/ali-haider-300aab245",
    },
    {
        icon: "wa",
        label: "WHATSAPP",
        value: "+92 303 022 2057",
        action: "Chat Direct",
        href: "https://wa.me/923030222057",
    },
];

// Pseudo-random slots to avoid hydration mismatch
const getSlots = (d: number) => {
    const all = ["09:00", "11:30", "14:00", "16:30", "18:00"];
    return all.filter((_, i) => (d + i) % 3 !== 0);
};

export default function ConnectSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "", desc: "" });
    const [weekOffset, setWeekOffset] = useState(0);

    const [calDays, setCalDays] = useState<{ day: string; date: string; available: string[]; isPast: boolean }[]>([]);
    const [monthName, setMonthName] = useState("");

    useEffect(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        const dayOfWeek = startOfWeek.getDay() || 7; // Make Sunday 7 instead of 0
        startOfWeek.setDate(today.getDate() - (dayOfWeek - 1) + (weekOffset * 7));

        const days = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const isPast = date < new Date(today.setHours(0, 0, 0, 0));
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                date: date.getDate().toString(),
                available: isPast ? [] : getSlots(date.getDate()),
                isPast
            };
        });

        setCalDays(days);
        setMonthName(startOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    }, [weekOffset]);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            // Fade in the huge background text
            gsap.fromTo(
                ".connect-bg-text",
                { opacity: 0, scale: 0.9, y: 100 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                }
            );

            // Stagger contact cards
            gsap.fromTo(
                ".c-card",
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 1,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: ".connect-cards",
                        start: "top 80%",
                    },
                }
            );

            // Fade up calendar section
            gsap.fromTo(
                ".calendar-section",
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".calendar-section",
                        start: "top 85%",
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const openSlot = (day: string, time: string) => {
        setSelectedSlot({ day, time });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => setSelectedSlot(null), 400);
    };

    const handleBookEmail = () => {
        const subject = encodeURIComponent(`Project Booking Request: ${selectedSlot?.day} at ${selectedSlot?.time}`);
        const body = encodeURIComponent(`Hi Aly,\n\nI'd like to book a session on ${selectedSlot?.day} at ${selectedSlot?.time}.\n\nName: ${formData.name}\nEmail: ${formData.email}\nDetails: ${formData.desc}`);
        window.location.href = `mailto:hello@aly.dev?subject=${subject}&body=${body}`;
        closeModal();
    };

    const handleBookWhatsApp = () => {
        const text = encodeURIComponent(`Hi, I'd like to book a session on ${selectedSlot?.day} at ${selectedSlot?.time}. My name is ${formData.name}.`);
        window.open(`https://wa.me/923030222057?text=${text}`, "_blank");
        closeModal();
    };

    return (
        <section ref={sectionRef} id="connect" className="connect-section">
            <div className="connect-bg-text">CONNECT</div>

            <div className="connect-header">
                <span className="c-tag">// GET IN TOUCH</span>
                <h2 className="c-title">Let's build something.</h2>
                <p className="c-desc">
                    Ready to turn ideas into high-performance digital reality? Book a slot directly or drop a message.
                </p>
            </div>

            {/* Cards Row */}
            <div className="connect-cards">
                {CONTACT_METHODS.map((method, idx) => (
                    <a key={idx} href={method.href} target="_blank" rel="noopener noreferrer" className="c-card">
                        <div className="cc-icon">{method.icon}</div>
                        <div className="cc-label">{method.label}</div>
                        <div className="cc-value">{method.value}</div>
                        <div className="cc-action">{method.action}</div>
                    </a>
                ))}
            </div>

            {/* Calendar Booking UI */}
            <div className="calendar-section">
                <div className="cal-header">
                    <div className="cal-title">Book a 30-min Discovery Call</div>
                    <div className="cal-controls" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                            className="cal-nav-btn"
                            onClick={() => setWeekOffset(o => Math.max(0, o - 1))}
                            disabled={weekOffset === 0}
                            style={{ opacity: weekOffset === 0 ? 0.3 : 1, cursor: weekOffset === 0 ? 'not-allowed' : 'pointer' }}
                        >◀ Use Previous Week</button>
                        <div className="cal-month">{monthName}</div>
                        <button
                            className="cal-nav-btn"
                            onClick={() => setWeekOffset(o => o + 1)}
                        >Next Week ▶</button>
                    </div>
                </div>

                <div className="cal-grid">
                    {calDays.map((col, idx) => (
                        <div key={idx} className="cal-day-col">
                            <div className={`cal-day-header ${col.isPast ? "is-past" : ""}`}>
                                <div className="cal-day-name">{col.day}</div>
                                <div className="cal-day-date">{col.date}</div>
                            </div>
                            {col.available.map((time) => (
                                <div
                                    key={time}
                                    className="cal-slot"
                                    onClick={() => openSlot(`${col.date} ${monthName}`, time)}
                                >
                                    {time}
                                </div>
                            ))}
                            {col.available.length === 0 && !col.isPast && (
                                <div className="cal-full">FULL</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Checkout Modal */}
            <div className={`modal-overlay ${modalOpen ? "is-open" : ""}`} onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={closeModal}>✕</button>

                    <h3 className="modal-title">Confirm Booking</h3>
                    {selectedSlot && (
                        <div className="modal-slot-info">
                            {selectedSlot.day} — {selectedSlot.time} (GST)
                        </div>
                    )}

                    <input
                        className="modal-input"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        className="modal-input"
                        placeholder="Your Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        className="modal-input"
                        placeholder="Project details or topic..."
                        value={formData.desc}
                        onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    />

                    <button className="modal-btn" onClick={handleBookEmail}>
                        BOOK VIA EMAIL
                    </button>
                    <button className="modal-btn whatsapp" onClick={handleBookWhatsApp}>
                        BOOK VIA WHATSAPP
                    </button>
                </div>
            </div>
        </section>
    );
}
