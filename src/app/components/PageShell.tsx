import ReturnButton from "./ReturnButton";

interface PageShellProps {
  title: string;
  titleJP?: string;
  icon: string;
  bg?: string;
  children: React.ReactNode;
}

// Pixel dot background pattern
const DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(74,122,155,0.25) 1.5px, transparent 1.5px)",
  backgroundSize: "18px 18px",
};

export default function PageShell({ title, titleJP, icon, bg = "#c8dce8", children }: PageShellProps) {
  return (
    <div className="min-h-screen" style={{ background: bg, ...DOT_BG }}>
      <ReturnButton />

      {/* Pixel window header */}
      <div className="pt-16 px-6 pb-0">
        <div style={{ border: "3px solid #4a7a9b", boxShadow: "6px 6px 0 #2a5a7b", background: "#f4efe6" }}>
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2"
            style={{ background: "#4a7a9b", borderBottom: "3px solid #2a5a7b" }}
          >
            {/* Window dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3" style={{ background: "#c05050", border: "2px solid #8a3030" }} />
              <div className="w-3 h-3" style={{ background: "#c0a030", border: "2px solid #8a7010" }} />
              <div className="w-3 h-3" style={{ background: "#5a9a7a", border: "2px solid #3a7a5a" }} />
            </div>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "13px",
              color: "#e8f4ff",
              letterSpacing: "0.08em",
              flex: 1,
              textAlign: "center",
              lineHeight: 1,
            }}>
              {title.toUpperCase()}
            </span>
            <img src={icon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: "pixelated" }} />
          </div>

          {/* Content area */}
          <div className="p-6">{children}</div>
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
}
