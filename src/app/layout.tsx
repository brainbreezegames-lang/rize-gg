import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Dungeon Heart — Sort. Restore. Awaken.",
  description:
    "A cozy 3D sorting adventure. Organize relics into ancient shelves and awaken the Dungeon Heart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${oxanium.variable} font-[family-name:var(--font-oxanium)] antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
