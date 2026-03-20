"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#connect" },
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        delay: 0.4,
      }
    );
  }, []);

  return (
    <>
      <div
        ref={navRef}
        className="pointer-events-none fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        {/* Desktop Nav */}
        <nav
          className="
            pointer-events-auto
            hidden md:flex
            items-center gap-6 lg:gap-10
            rounded-full
            px-6 lg:px-10 py-4
            backdrop-blur-xl
            shadow-[0_0_40px_rgba(0,0,0,0.6)]
          "
          style={{ background: 'rgba(9,8,5,0.6)', border: '1px solid rgba(196,164,107,0.1)' }}
        >
          {/* Logo */}
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }} className="text-sm font-semibold tracking-widest">
            ALY.
          </span>

          {/* Divider */}
          <span className="h-4 w-px" style={{ background: 'rgba(196,164,107,0.2)' }} />

          {/* Links */}
          <ul className="flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <li key={item.label} className="group relative">
                <span className="absolute inset-0 -z-10 rounded-md bg-white/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
                <button
                  onClick={() => {
                    const target = document.querySelector(item.href);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="text-sm transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(226,213,190,0.5)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(226,213,190,0.5)')}
                >
                  {item.label}
                </button>

                {/* Underline animation */}
                <span
                  className="
                    absolute -bottom-1 left-0 h-[1px] w-full
                    scale-x-0 bg-[#c4a46b]
                    transition-transform duration-300
                    origin-left
                    group-hover:scale-x-100
                  "
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Nav */}
        <nav
          className="
            pointer-events-auto
            flex md:hidden
            items-center justify-between
            w-full max-w-md
            rounded-full
            px-6 py-4
            backdrop-blur-xl
            shadow-[0_0_40px_rgba(0,0,0,0.6)]
          "
          style={{ background: 'rgba(9,8,5,0.6)', border: '1px solid rgba(196,164,107,0.1)' }}
        >
          {/* Logo */}
          <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }} className="text-sm font-semibold tracking-widest">
            ALY.
          </span>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(9,8,5,0.85)' }} />
          <div className="absolute top-24 left-4 right-4">
            <div className="backdrop-blur-xl rounded-3xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]" style={{ background: 'rgba(9,8,5,0.95)', border: '1px solid rgba(196,164,107,0.15)' }}>
              <ul className="space-y-4">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        block px-6 py-3
                        text-lg
                        transition-all duration-300
                        rounded-xl
                      "
                      style={{ fontFamily: 'var(--font-mono)', color: 'rgba(226,213,190,0.6)' }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}