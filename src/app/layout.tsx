import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Rize.gg",
  description: "Find your team. Compete. Rise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${oxanium.variable} font-[family-name:var(--font-oxanium)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
