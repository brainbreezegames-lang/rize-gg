import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Cupboard Tidy Up: The Witch's Feast",
  description:
    "A cozy first-person sorting game. Put every dish back by set and size before the coven feast.",
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
