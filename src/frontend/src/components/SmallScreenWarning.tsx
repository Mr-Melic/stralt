import type React from "react";
import { useEffect, useState } from "react";

const SmallScreenWarning: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!show) return null;

  return (
    <div
      data-ocid="small_screen.overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.97)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#0d0d1a",
          border: "2px solid #8b1a1a",
          borderRadius: 12,
          padding: "32px 24px",
          maxWidth: 320,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 0 40px rgba(139,26,26,0.45)",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 16 }}>
          \u2654
        </div>

        {/* Title */}
        <h2
          style={{
            color: "#ffffff",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 12,
            fontFamily: "serif",
            letterSpacing: "0.02em",
          }}
        >
          Best on Larger Screens
        </h2>

        {/* Body */}
        <p
          style={{
            color: "#aaaaaa",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          Paper Baby Vampires is designed for desktop and tablet screens. For
          the best experience, play on a device with a wider screen.
        </p>

        {/* Note */}
        <p
          style={{
            color: "rgba(150,80,80,0.75)",
            fontSize: 12,
            lineHeight: 1.5,
            borderTop: "1px solid rgba(139,26,26,0.35)",
            paddingTop: 12,
          }}
        >
          Tablets (768px+) and desktops are fully supported.
        </p>
      </div>
    </div>
  );
};

export default SmallScreenWarning;
