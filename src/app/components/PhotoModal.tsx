import { useEffect } from "react";

interface PhotoModalProps {
  src: string;
  caption?: string;
  onClose: () => void;
}

export default function PhotoModal({ src, caption, onClose }: PhotoModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8"
      style={{ background: "rgba(10,20,35,0.88)" }}
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pixel frame */}
        <div style={{ border: "4px solid #6a9ab5", boxShadow: "6px 6px 0 #2a5a7b", position: "relative" }}>
          {/* Corner decorations */}
          {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-3 h-3`} style={{ background: "#4a7a9b", zIndex: 1 }} />
          ))}
          <img
            src={src}
            alt={caption ?? ""}
            className="block max-h-[70vh] w-full object-contain"
          />
        </div>

        {caption && (
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "#b8d4e8",
            letterSpacing: "0.04em",
            lineHeight: 2,
            textAlign: "center",
          }}>
            {caption}
          </p>
        )}

        <button
          onClick={onClose}
          className="px-6 py-2 cursor-pointer active:translate-y-px"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "#f4efe6",
            background: "#4a7a9b",
            border: "3px solid #2a5a7b",
            boxShadow: "4px 4px 0 #2a5a7b",
            letterSpacing: "0.04em",
          }}
        >
          [ CLOSE ]
        </button>
      </div>
    </div>
  );
}
