import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import PixelTag from "@/app/components/PixelTag";
import { MOCK_COURSES } from "@/data/courses";
import { supabase } from "@/lib/supabase";
import type { CourseSection } from "@/data/courses";

// ── Progress bar (reused from BookshelfPage) ──────────────────────────────────
function PixelProgressBar({ value }: { value: number }) {
  const cells = 24;
  const filled = Math.round((value / 100) * cells);
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: cells }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "10px",
            height: "12px",
            background: i < filled ? (value === 100 ? "#5a8a6a" : "#7a6050") : "#d8cfc0",
            border: `1.5px solid ${i < filled ? (value === 100 ? "#3a6a4a" : "#5a4030") : "#b0a090"}`,
          }}
        />
      ))}
      <span
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "7px",
          color: "#6a5040",
          marginLeft: "8px",
        }}
      >
        {value}%
      </span>
    </div>
  );
}

// ── Section config ────────────────────────────────────────────────────────────
const SECTION_CFG = {
  plan: {
    icon: "◈",
    label: "PLAN",
    headerBg: "#7a6050",
    headerBorder: "#5a4030",
    bodyBg: "#fdf8f0",
    bodyBorder: "#c0a880",
    shadow: "#7a6050",
    accentColor: "#7a6050",
    textColor: "#3a2810",
  },
  thought: {
    icon: "▸",
    label: "NOTE",
    headerBg: "#4a7a9b",
    headerBorder: "#2a5a7b",
    bodyBg: "#eef4fa",
    bodyBorder: "#4a7a9b",
    shadow: "#2a5a7b",
    accentColor: "#2a5a7b",
    textColor: "#1a3a52",
  },
  exam: {
    icon: "■",
    label: "EXAM",
    headerBg: "#8a3a3a",
    headerBorder: "#6a1a1a",
    bodyBg: "#fdf0f0",
    bodyBorder: "#c07070",
    shadow: "#8a3a3a",
    accentColor: "#8a3a3a",
    textColor: "#3a1010",
  },
  question: {
    icon: "?",
    label: "Q&A",
    headerBg: "#3a7a6a",
    headerBorder: "#1a5a4a",
    bodyBg: "#eef8f4",
    bodyBorder: "#5aaa8a",
    shadow: "#3a7a6a",
    accentColor: "#1a5a4a",
    textColor: "#0a3028",
  },
};

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ section, index }: { section: CourseSection; index: number }) {
  const cfg = SECTION_CFG[section.type];

  return (
    <div
      style={{
        border: `3px solid ${cfg.bodyBorder}`,
        boxShadow: `5px 5px 0 ${cfg.shadow}`,
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ background: cfg.headerBg, borderBottom: `3px solid ${cfg.headerBorder}` }}
      >
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            color: "rgba(255,255,255,0.45)",
            minWidth: "22px",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "8px",
            color: "#fff",
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
              color: "rgba(255,255,255,0.7)",
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
      </div>

      {/* Body */}
      <div style={{ background: cfg.bodyBg, padding: "20px 24px" }}>
        {section.heading && (
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: cfg.accentColor,
              letterSpacing: "0.04em",
              lineHeight: 1.9,
              marginBottom: "14px",
              borderLeft: `4px solid ${cfg.bodyBorder}`,
              paddingLeft: "12px",
            }}
          >
            {section.heading}
          </p>
        )}
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
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .order("id")
      .then(({ data }) => {
        if (data && data.length > 0) setCourse(data[0]);
      });
    supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", id)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) setSections(data as CourseSection[]);
      });
  }, [id]);

  if (!course) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#d4c8b4" }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            color: "#7a6050",
          }}
        >
          COURSE NOT FOUND
        </p>
        <button
          onClick={() => navigate("/bookshelf")}
          className="mt-6 px-4 py-2 cursor-pointer"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "#fff",
            background: "#7a6050",
            border: "3px solid #5a4030",
            boxShadow: "4px 4px 0 #5a4030",
          }}
        >
          ← BACK
        </button>
      </div>
    );
  }


  // Section type counts for mini legend
  const typeCounts = sections.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "#d4c8b4",
        backgroundImage: "radial-gradient(circle, rgba(122,96,80,0.18) 1.5px, transparent 1.5px)",
        backgroundSize: "18px 18px",
      }}
    >
      {/* Back to bookshelf */}
      <button
        onClick={() => navigate("/bookshelf")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 cursor-pointer active:translate-y-px transition-transform duration-75"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "9px",
          color: "#faf6ee",
          background: "#7a6050",
          border: "3px solid #5a4030",
          boxShadow: "4px 4px 0 #5a4030",
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
          color: "#faf6ee",
          background: "#7a6050",
          border: "3px solid #5a4030",
          boxShadow: "4px 4px 0 #5a4030",
          letterSpacing: "0.02em",
          lineHeight: 1.6,
        }}
      >
        <span style={{ fontSize: "14px", lineHeight: 1 }}>⌂</span>
        <span>ROOM</span>
      </button>

      <div className="pt-16 px-4 md:px-8 pb-12 relative z-10 max-w-3xl mx-auto">

        {/* Course info header window */}
        <div
          style={{
            border: "3px solid #a09080",
            boxShadow: "6px 6px 0 #7a6a5a",
            background: "#faf6ee",
            marginBottom: "24px",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2"
            style={{ background: "#c8b898", borderBottom: "3px solid #a09080" }}
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
                color: "rgba(58,42,26,0.55)",
                letterSpacing: "0.06em",
              }}
            >
              BOOKSHELF / COURSE_{String(course.id).padStart(3, "0")}
            </span>
            {course.progress === 100 && (
              <span
                className="ml-auto"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "6px",
                  color: "#3a6a4a",
                  background: "#d0f0d8",
                  border: "2px solid #3a6a4a",
                  padding: "2px 6px",
                }}
              >
                DONE ✓
              </span>
            )}
          </div>

          {/* Course info body */}
          <div className="px-6 py-5">
            <h1
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "13px",
                color: "#3a2a1a",
                letterSpacing: "0.06em",
                lineHeight: 1.8,
                marginBottom: "16px",
              }}
            >
              {course.name}
            </h1>

            {/* Progress bar */}
            <div className="mb-4">
              <PixelProgressBar value={course.progress} />
            </div>

            {/* Tags + current note */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {course.platform && (
                <PixelTag label={course.platform} variant="outline" color="teal" />
              )}
              {course.category && (
                <PixelTag label={course.category} color={(course.category_color || "blue") as any} />
              )}
            </div>

            {course.notes && (
              <p
                style={{
                  fontFamily: "Noto Sans SC, sans-serif",
                  fontSize: "13px",
                  color: "#6a5a4a",
                  lineHeight: 1.9,
                  borderLeft: "4px solid #c8b898",
                  paddingLeft: "12px",
                }}
              >
                {course.notes}
              </p>
            )}

            {/* Mini section legend */}
            {sections.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: "2px dashed #c8b898" }}>
                {Object.entries(typeCounts).map(([type, count]) => {
                  const cfg = SECTION_CFG[type as keyof typeof SECTION_CFG];
                  return (
                    <span
                      key={type}
                      className="flex items-center gap-1.5 px-2 py-1"
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "6px",
                        color: cfg.accentColor,
                        border: `2px solid ${cfg.bodyBorder}`,
                        background: cfg.bodyBg,
                        letterSpacing: "0.04em",
                      }}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label} ×{count}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        {sections.length > 0 && (
          <div className="flex items-center gap-3 mb-5">
            <div style={{ flex: 1, height: "3px", background: "#a09080" }} />
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "9px",
                color: "#7a6050",
                letterSpacing: "0.1em",
              }}
            >
              ▣ CONTENTS
            </span>
            <div style={{ flex: 1, height: "3px", background: "#a09080" }} />
          </div>
        )}

        {/* Sections */}
        {sections.map((section, i) => (
          <SectionCard key={i} section={section} index={i} />
        ))}

        {sections.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16"
            style={{ border: "3px dashed #a09080", background: "rgba(255,255,255,0.35)" }}
          >
            <span style={{ fontSize: "28px", display: "block", marginBottom: "16px" }}>📚</span>
            <p
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "8px",
                color: "#a09080",
                letterSpacing: "0.06em",
                lineHeight: 2,
                textAlign: "center",
              }}
            >
              NO CONTENTS YET<br />COMING SOON...
            </p>
          </div>
        )}

        {/* Footer pixel row */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                background: i % 2 === 0 ? "#7a6050" : "#e8ddd0",
                border: "2px solid #5a4030",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
