import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import PixelTag from "@/app/components/PixelTag";
import { MOCK_PROJECTS } from "@/data/projects";
import { supabase } from "@/lib/supabase";
import type { NoteSection } from "@/data/projects";

// ── Pixel scanline decoration ─────────────────────────────────────────────────
function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 4px)",
      }}
    />
  );
}

// ── Section type config ───────────────────────────────────────────────────────
const SECTION_CONFIG = {
  text: {
    icon: "▶",
    label: "NOTE",
    headerBg: "#4a7a9b",
    headerBorder: "#2a5a7b",
    bodyBg: "#eef4fa",
    bodyBorder: "#4a7a9b",
    shadow: "#2a5a7b",
    textColor: "#1e3a52",
  },
  code: {
    icon: "//",
    label: "CODE",
    headerBg: "#2a3a2a",
    headerBorder: "#1a2a1a",
    bodyBg: "#1e2e1e",
    bodyBorder: "#3a5a3a",
    shadow: "#0e1a0e",
    textColor: "#7adf7a",
  },
  tip: {
    icon: "★",
    label: "TIP",
    headerBg: "#8a7020",
    headerBorder: "#6a5010",
    bodyBg: "#fdf8e8",
    bodyBorder: "#c0a030",
    shadow: "#8a7020",
    textColor: "#3a2800",
  },
  highlight: {
    icon: "◆",
    label: "MEMO",
    headerBg: "#7a3a6a",
    headerBorder: "#5a1a4a",
    bodyBg: "#faeef8",
    bodyBorder: "#b06090",
    shadow: "#7a3a6a",
    textColor: "#3a1030",
  },
};

// ── Note Section Card ─────────────────────────────────────────────────────────
function NoteSectionCard({ section, index }: { section: NoteSection; index: number }) {
  const cfg = SECTION_CONFIG[section.type];
  const isCode = section.type === "code";

  return (
    <div
      style={{
        border: `3px solid ${cfg.bodyBorder}`,
        boxShadow: `5px 5px 0 ${cfg.shadow}`,
        marginBottom: "20px",
      }}
    >
      {/* Section header */}
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ background: cfg.headerBg, borderBottom: `3px solid ${cfg.headerBorder}` }}
      >
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            color: "rgba(255,255,255,0.5)",
            minWidth: "24px",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            color: isCode ? "#5adf5a" : "#fff",
            letterSpacing: "0.1em",
          }}
        >
          [{cfg.icon}] {cfg.label}
        </span>
        {section.heading && (
          <span
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "7px",
              color: "rgba(255,255,255,0.75)",
              marginLeft: "6px",
              letterSpacing: "0.04em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {section.heading}
          </span>
        )}
        {isCode && section.lang && (
          <span
            className="ml-auto"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "6px",
              color: "#3aaf3a",
              letterSpacing: "0.06em",
            }}
          >
            .{section.lang}
          </span>
        )}
      </div>

      {/* Section body */}
      <div
        style={{
          background: cfg.bodyBg,
          padding: isCode ? "0" : "20px 24px",
        }}
      >
        {section.heading && !isCode && (
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "9px",
              color: cfg.headerBg,
              letterSpacing: "0.04em",
              lineHeight: 1.8,
              marginBottom: "14px",
              borderLeft: `4px solid ${cfg.bodyBorder}`,
              paddingLeft: "12px",
            }}
          >
            {section.heading}
          </p>
        )}
        {isCode ? (
          <pre
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: cfg.textColor,
              lineHeight: 2,
              padding: "20px 24px",
              margin: 0,
              overflowX: "auto",
              whiteSpace: "pre",
              background: cfg.bodyBg,
            }}
          >
            <code>{section.content}</code>
          </pre>
        ) : (
          <p
            style={{
              fontFamily: "Noto Sans SC, sans-serif",
              fontSize: "14px",
              color: cfg.textColor,
              lineHeight: 2,
              whiteSpace: "pre-line",
            }}
          >
            {section.content}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [sections, setSections] = useState<NoteSection[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .order("id")
      .then(({ data }) => {
        if (data && data.length > 0) setProject(data[0]);
      });
    supabase
      .from("project_sections")
      .select("*")
      .eq("project_id", id)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSections(data as NoteSection[]);
      });
  }, [id]);

  if (!project) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#c8dce8" }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            color: "#4a7a9b",
          }}
        >
          PROJECT NOT FOUND
        </p>
        <button
          onClick={() => navigate("/computer")}
          className="mt-6 px-4 py-2 cursor-pointer"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "#fff",
            background: "#4a7a9b",
            border: "3px solid #2a5a7b",
            boxShadow: "4px 4px 0 #2a5a7b",
          }}
        >
          ← BACK
        </button>
      </div>
    );
  }

  const sectionCount = sections.length;

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "#c8dce8", backgroundImage: "radial-gradient(circle, rgba(74,122,155,0.2) 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}
    >
      <ScanLines />

      {/* Back button → /computer */}
      <button
        onClick={() => navigate("/computer")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 cursor-pointer active:translate-y-px transition-transform duration-75"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "9px",
          color: "#f4efe6",
          background: "#4a7a9b",
          border: "3px solid #2a5a7b",
          boxShadow: "4px 4px 0 #2a5a7b",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}
      >
        <span style={{ fontSize: "12px", lineHeight: 1 }}>←</span>
        <span>BACK</span>
      </button>

      {/* Return to room */}
      <button
        onClick={() => navigate("/room")}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 cursor-pointer active:translate-y-px transition-transform duration-75"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "9px",
          color: "#f4efe6",
          background: "#4a7a9b",
          border: "3px solid #2a5a7b",
          boxShadow: "4px 4px 0 #2a5a7b",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}
      >
        <span style={{ fontSize: "14px", lineHeight: 1 }}>⌂</span>
        <span>ROOM</span>
      </button>

      <div className="pt-16 px-4 md:px-8 pb-12 relative z-10 max-w-3xl mx-auto">
        {/* Project info header window */}
        <div style={{ border: "3px solid #4a7a9b", boxShadow: "6px 6px 0 #2a5a7b", background: "#f4efe6", marginBottom: "24px" }}>
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2"
            style={{ background: "#4a7a9b", borderBottom: "3px solid #2a5a7b" }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3" style={{ background: "#c05050", border: "2px solid #8a3030" }} />
              <div className="w-3 h-3" style={{ background: "#c0a030", border: "2px solid #8a7010" }} />
              <div className="w-3 h-3" style={{ background: "#5a9a7a", border: "2px solid #3a7a5a" }} />
            </div>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.08em",
              }}
            >
              {project.category === "学习" ? "▶ STUDY" : "★ CONTEST"} / PROJECT_{String(project.id).padStart(3, "0")}
            </span>
            <span
              className="ml-auto"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "7px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {project.date}
            </span>
          </div>

          {/* Project info body */}
          <div className="px-6 py-5">
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "13px",
                color: "#2a5a7b",
                letterSpacing: "0.06em",
                lineHeight: 1.8,
                marginBottom: "14px",
              }}
            >
              {project.title}
            </h1>
            <p
              style={{
                fontFamily: "Noto Sans SC, sans-serif",
                fontSize: "14px",
                color: "#3a5a7a",
                lineHeight: 1.9,
                marginBottom: "16px",
              }}
            >
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {(project.tags ?? []).map((tag) => (
                <PixelTag key={tag.label} label={tag.label} color={tag.color as any} />
              ))}
              {sectionCount > 0 && (
                <span
                  className="ml-auto"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "7px",
                    color: "#6a9ab5",
                    letterSpacing: "0.06em",
                  }}
                >
                  {sectionCount} SECTIONS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notes heading */}
        {sections.length > 0 && (
          <div className="flex items-center gap-3 mb-5">
            <div style={{ flex: 1, height: "3px", background: "#4a7a9b" }} />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                color: "#4a7a9b",
                letterSpacing: "0.1em",
              }}
            >
              ▣ NOTES
            </span>
            <div style={{ flex: 1, height: "3px", background: "#4a7a9b" }} />
          </div>
        )}

        {/* Note sections */}
        {sections.map((section, i) => (
          <NoteSectionCard key={i} section={section} index={i} />
        ))}

        {sections.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{
              border: "3px dashed #4a7a9b",
              background: "rgba(255,255,255,0.4)",
            }}
          >
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "24px", display: "block", marginBottom: "16px" }}>
              📝
            </span>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#6a9ab5", letterSpacing: "0.06em", lineHeight: 2, textAlign: "center" }}>
              NO NOTES YET<br />COMING SOON...
            </p>
          </div>
        )}

        {/* Footer pixel decoration */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                background: i % 2 === 0 ? "#4a7a9b" : "#deeaf6",
                border: "2px solid #2a5a7b",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
