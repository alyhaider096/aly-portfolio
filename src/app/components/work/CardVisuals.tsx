"use client";

/* ═══════════════════════════════════════════
   SHARED CARD VISUALS — Per-project CSS mini-UI
   Used by: CSSCylinder, InfiniteCarousel, ProjectDetailPanel
   ═══════════════════════════════════════════ */

export function CardVisual({ id }: { id: string }) {
    switch (id) {
        case "dinelyx-ai":
            return (
                <div className="cv cv-dinelyx">
                    <div className="cv-glow" style={{ background: "radial-gradient(circle, rgba(140,80,255,.25) 0%, transparent 70%)", top: "8%", left: "50%", transform: "translateX(-50%)" }} />
                    <div className="cv-grid">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <span key={i} className={[3, 7, 11, 15, 20, 25].includes(i) ? "on" : ""} />
                        ))}
                    </div>
                    <div className="cv-phone">
                        <div className="cv-qr">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className={`cv-qr-cell ${[0, 2, 3, 5, 8, 10, 11, 15].includes(i) ? "f" : ""}`} />
                            ))}
                        </div>
                        <div className="cv-scan" />
                    </div>
                </div>
            );

        case "animal-welfare":
            return (
                <div className="cv cv-animal">
                    <div className="cv-waves">
                        <div className="cv-wave" />
                        <div className="cv-wave" style={{ animationDelay: "1s" }} />
                        <div className="cv-wave" style={{ animationDelay: "2s" }} />
                    </div>
                    <div className="cv-core">🐾</div>
                    <div className="cv-cards-row">
                        <div className="cv-mini-card">
                            <div className="cv-mini-hdr">Report Animal</div>
                            <div className="cv-mini-map">
                                <div className="cv-pin" />
                            </div>
                        </div>
                        <div className="cv-mini-card">
                            <div className="cv-mini-hdr">AI Assistant</div>
                            <div className="cv-mini-msgs">
                                <div className="cv-msg u">Best grooming tips?</div>
                                <div className="cv-msg b">Brush daily, bathe monthly. Check paws for signs of wear.</div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case "zozet-app":
            return (
                <div className="cv cv-zozet">
                    <div className="cv-zz-badge">AI Closet</div>
                    <div className="cv-zz-grid">
                        {["👕", "👖", "🧥", "👟"].map((e, i) => (
                            <div key={i} className="cv-zz-item">
                                <div className="cv-zz-item-img">{e}</div>
                                <div className="cv-zz-item-lbl">{["T-Shirt", "Chinos", "Hoodie", "Sneakers"][i]}</div>
                            </div>
                        ))}
                    </div>
                    <div className="cv-zz-pulse" />
                    <div className="cv-zz-avatars">
                        <div className="cv-zz-av">🧍</div>
                        <div className="cv-zz-av sel">🧍</div>
                        <div className="cv-zz-av">🧍</div>
                    </div>
                </div>
            );

        case "coffeemistry":
            return (
                <div className="cv cv-coffee">
                    <div className="cv-cf-steam">
                        <div className="cv-cf-steam-line" />
                        <div className="cv-cf-steam-line" style={{ animationDelay: "0.5s" }} />
                        <div className="cv-cf-steam-line" style={{ animationDelay: "1s" }} />
                    </div>
                    <div className="cv-cf-cup">☕</div>
                    <div className="cv-cf-lines">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="cv-cf-line" style={{ animationDelay: `${i * 0.3}s` }} />
                        ))}
                    </div>
                    <div className="cv-cf-badge">Scroll Experience</div>
                </div>
            );

        case "workflow-automation":
            return (
                <div className="cv cv-n8n">
                    <div className="cv-n8-flow" style={{ width: '190px', gap: '4px' }}>
                        <div className="cv-n8-node trigger">
                            <span>📱</span>
                            <div className="cv-n8-lbl">Telegram</div>
                        </div>
                        <div className="cv-n8-conn" style={{ width: '8px' }} />
                        <div className="cv-n8-node ai">
                            <span>🧠</span>
                            <div className="cv-n8-lbl">AI Agent</div>
                        </div>
                        <div className="cv-n8-conn" style={{ width: '8px' }} />
                        <div className="cv-n8-node" style={{ borderColor: 'rgba(216, 59, 209, 0.4)', background: 'rgba(216, 59, 209, 0.1)' }}>
                            <span style={{ color: '#d83bd1', fontSize: '18px', lineHeight: 1 }}>❉</span>
                            <div className="cv-n8-lbl" style={{ color: 'rgba(216, 59, 209, 0.7)' }}>Make</div>
                        </div>
                        <div className="cv-n8-conn" style={{ width: '8px' }} />
                        <div className="cv-n8-node output" style={{ borderColor: 'rgba(46, 163, 80, 0.4)', background: 'rgba(46, 163, 80, 0.1)' }}>
                            <span>📊</span>
                            <div className="cv-n8-lbl" style={{ color: 'rgba(46, 163, 80, 0.7)' }}>Sheets</div>
                        </div>
                    </div>
                    <div className="cv-n8-pulse" />
                    <div className="cv-n8-badge">Enterprise</div>
                </div>
            );

        case "rosewood-saas":
            return (
                <div className="cv cv-rose">
                    <div className="cv-rs-sidebar">
                        <div className="cv-rs-logo">RW</div>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={`cv-rs-nav ${i === 0 ? "on" : ""}`} />
                        ))}
                    </div>
                    <div className="cv-rs-main">
                        <div className="cv-rs-hdr">Dashboard</div>
                        {[
                            { label: "Park Monitors", val: "12/12 Active" },
                            { label: "Compliance Score", val: "94% A+" },
                            { label: "Certified Mail", val: "Sent (30s ago)" },
                        ].map((r, i) => (
                            <div key={i} className="cv-rs-row">
                                <span className="cv-rs-label">{r.label}</span>
                                <span className="cv-rs-val">{r.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );

        default:
            return <div className="cv cv-default" />;
    }
}
