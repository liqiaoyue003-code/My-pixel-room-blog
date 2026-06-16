import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PixelLoading from "@/app/components/PixelLoading";
import computerIcon from "@/imports/image-3.png";
import { supabase } from "@/lib/supabase";
import { MOCK_PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

export default function ComputerPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"学习" | "竞赛">("学习");
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setProjects(data);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) => p.category === tab);

  return (
    <PageShell title="项目与学习" icon={computerIcon} bg="#c8dce8">
      {loading ? <PixelLoading /> : <>
      {/* Pixel tab bar */}
      <div className="flex gap-0 mb-6" style={{ borderBottom: "3px solid #4a7a9b" }}>
        {(["学习", "竞赛"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 cursor-pointer"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "9px",
              letterSpacing: "0.04em",
              background: tab === t ? "#4a7a9b" : "#deeaf6",
              color: tab === t ? "#fff" : "#4a7a9b",
              border: "3px solid #4a7a9b",
              borderBottom: tab === t ? "3px solid #4a7a9b" : "none",
              marginBottom: tab === t ? "-3px" : "0",
              lineHeight: 2,
            }}
          >
            {t === "学习" ? "▶ STUDY" : "★ CONTEST"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((project) => {
          const isHovered = hoveredId === project.id;
          const hasNotes = project.notes && project.notes.length > 0;
          return (
            <button
              key={project.id}
              onClick={() => navigate(`/computer/${project.id}`)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="text-left outline-none bg-transparent p-0 border-none cursor-pointer block w-full"
              style={{
                transition: "transform 0.12s ease",
                transform: isHovered ? "translate(-2px, -2px)" : "translate(0,0)",
              }}
            >
              <div
                style={{
                  background: "#eef4fa",
                  border: `3px solid ${isHovered ? "#2a5a7b" : "#4a7a9b"}`,
                  boxShadow: isHovered ? "7px 7px 0 #1a4a6b" : "5px 5px 0 #2a5a7b",
                  transition: "box-shadow 0.12s ease, border-color 0.12s ease",
                }}
              >
                {/* Card header */}
                <div
                  className="px-4 py-2 flex items-center justify-between"
                  style={{
                    background: isHovered ? "#2a5a7b" : "#deeaf6",
                    borderBottom: "3px solid #4a7a9b",
                    transition: "background 0.12s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "8px",
                      color: isHovered ? "#e8f4ff" : "#2a5a7b",
                      letterSpacing: "0.04em",
                      lineHeight: 1.8,
                      transition: "color 0.12s ease",
                    }}
                  >
                    {project.title}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "7px",
                      color: isHovered ? "rgba(232,244,255,0.6)" : "#6a9ab5",
                    }}
                  >
                    {project.date}
                  </span>
                </div>

                <div className="p-4">
                  <p
                    style={{
                      fontFamily: "Noto Sans SC, sans-serif",
                      fontSize: "13px",
                      color: "#3a5a7a",
                      lineHeight: 1.8,
                      marginBottom: "12px",
                    }}
                  >
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {(project.tags ?? []).map((tag) => (
                      <PixelTag key={tag.label} label={tag.label} color={tag.color as any} />
                    ))}
                    {hasNotes && (
                      <span
                        className="ml-auto flex items-center gap-1"
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "6px",
                          color: isHovered ? "#4a7a9b" : "#8ab5d5",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {project.notes!.length} NOTES ▶
                      </span>
                    )}
                  </div>

                  {isHovered && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      style={{ borderTop: "2px dashed #4a7a9b", paddingTop: "10px" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "7px",
                          color: "#4a7a9b",
                          letterSpacing: "0.06em",
                        }}
                      >
                        ▶ OPEN NOTES
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      </>}
    </PageShell>
  );
}
