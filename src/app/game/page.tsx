"use client";

import dynamic from "next/dynamic";

const WitchFeastGame = dynamic(() => import("@/game/WitchFeastGame"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0B0A10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#E8D5B0",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      Lighting the hearth…
    </div>
  ),
});

export default function GamePage() {
  return <WitchFeastGame />;
}
