import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PixelLoading from "@/app/components/PixelLoading";
import bookshelfIcon from "@/imports/image-6.png";
import { supabase } from "@/lib/supabase";
import { MOCK_COURSES } from "@/data/courses";
import type { Course } from "@/data/courses";

function PixelProgressBar({ value }: { value: number }) {
  const cells = 20;
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
          marginLeft: "6px",
        }}
      >
        {value}%
      </span>
    </div>
  );
}

export default function BookshelfPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("全部");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setCourses(data);
        setLoading(false);
      });
  }, []);

  const categories = ["全部", ...Array.from(new Set(courses.map((c) => c.category)))];
  const filtered = filter === "全部" ? courses : courses.filter((c) => c.category === filter);

  return (
    <PageShell title="我的书架" icon={bookshelfIcon} bg="#d4c8b4">
      {loading ? <PixelLoading /> : <>
      {/* Filter row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-3 py-1 cursor-pointer active:translate-y-px transition-transform"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "7px",
              letterSpacing: "0.04em",
              background: filter === cat ? "#7a6050" : "#e8ddd0",
              color: filter === cat ? "#fff" : "#6a5040",
              border: `2px solid ${filter === cat ? "#5a4030" : "#b0a090"}`,
              boxShadow: filter === cat ? "3px 3px 0 #3a2010" : "3px 3px 0 #b0a090",
              lineHeight: 2,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((course) => {
          const isHovered = hoveredId === course.id;
          const hasSections = course.sections && course.sections.length > 0;
          return (
            <button
              key={course.id}
              onClick={() => navigate(`/bookshelf/${course.id}`)}
              onMouseEnter={() => setHoveredId(course.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="block w-full text-left outline-none bg-transparent p-0 border-none cursor-pointer"
              style={{
                transition: "transform 0.12s ease",
                transform: isHovered ? "translate(-2px, -2px)" : "translate(0,0)",
              }}
            >
              <div
                style={{
                  background: "#faf6ee",
                  border: `3px solid ${isHovered ? "#5a4030" : "#a09080"}`,
                  boxShadow: isHovered ? "7px 7px 0 #4a3020" : "5px 5px 0 #7a6a5a",
                  transition: "box-shadow 0.12s ease, border-color 0.12s ease",
                }}
              >
                {/* Header */}
                <div
                  className="px-4 py-2 flex items-center justify-between flex-wrap gap-2"
                  style={{
                    background: isHovered ? "#7a6050" : "#c8b898",
                    borderBottom: "3px solid #a09080",
                    transition: "background 0.12s ease",
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: "8px",
                        color: isHovered ? "#faf6ee" : "#3a2a1a",
                        letterSpacing: "0.04em",
                        lineHeight: 1.8,
                        transition: "color 0.12s ease",
                      }}
                    >
                      {course.name}
                    </span>
                    {course.progress === 100 && (
                      <span
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
                  <div className="flex gap-2">
                    {course.platform && (
                      <PixelTag label={course.platform} variant="outline" color="teal" />
                    )}
                    {course.category && (
                      <PixelTag
                        label={course.category}
                        color={(course.category_color || "blue") as any}
                      />
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="mb-3">
                    <PixelProgressBar value={course.progress} />
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    {course.notes && (
                      <p
                        style={{
                          fontFamily: "Noto Sans SC, sans-serif",
                          fontSize: "13px",
                          color: "#6a5a4a",
                          lineHeight: 1.8,
                          flex: 1,
                        }}
                      >
                        ▸ {course.notes}
                      </p>
                    )}
                    {hasSections && (
                      <span
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "6px",
                          color: isHovered ? "#7a6050" : "#a09080",
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {course.sections!.length} PAGES ▶
                      </span>
                    )}
                  </div>

                  {isHovered && (
                    <div
                      className="mt-3 flex items-center gap-2"
                      style={{ borderTop: "2px dashed #a09080", paddingTop: "10px" }}
                    >
                      <span
                        style={{
                          fontFamily: "'Press Start 2P', monospace",
                          fontSize: "7px",
                          color: "#7a6050",
                          letterSpacing: "0.06em",
                        }}
                      >
                        ▶ OPEN COURSE
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
