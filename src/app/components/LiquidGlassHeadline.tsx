"use client";

export default function LiquidGlassHeadline({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-2xl px-4 py-2",
        "glass glass-edge",
        "text-white/95",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}