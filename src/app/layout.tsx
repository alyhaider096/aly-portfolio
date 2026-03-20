import type { Metadata } from "next";
import "./globals.css";

import CustomCursor from "./components/CustomCursor";

export const metadata: Metadata = {
  title: "ALY. — Creative Developer",
  description:
    "I build interactive products for web, automation, and data-driven systems.",
  themeColor: "#090805",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        {/* Global custom cursor */}
        <CustomCursor />

        {/* App */}
        {children}
      </body>
    </html>
  );
}
