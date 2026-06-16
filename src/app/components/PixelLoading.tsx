export default function PixelLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* 像素跳动方块 */}
      <div className="flex items-end gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              background: "#4a7a9b",
              border: "2px solid #2a5a7b",
              animation: `pixelBounce 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "8px",
          color: "#6a9ab5",
          letterSpacing: "0.12em",
          animation: "pixelFade 1.2s ease-in-out infinite alternate",
        }}
      >
        LOADING...
      </span>

      <style>{`
        @keyframes pixelBounce {
          from { transform: translateY(0);   opacity: 0.4; }
          to   { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes pixelFade {
          from { opacity: 0.35; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
