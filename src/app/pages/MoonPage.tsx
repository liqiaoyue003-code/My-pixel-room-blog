import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import moonIcon from "@/imports/image-7.png";
import { supabase } from "@/lib/supabase";
import PixelLoading from "@/app/components/PixelLoading";

interface MoonEntry {
  id: number;
  content: string;
  source?: string;
  type: "诗" | "随笔" | "语录";
  created_at: string;
}

const MOCK: MoonEntry[] = [
  { id: 1, type: "诗", content: "我有一所房子，面朝大海，春暖花开。", source: "海子", created_at: "2024-03-01" },
  { id: 2, type: "随笔", content: "深夜的月亮很圆，我坐在窗边想了很多，最后什么也没想清楚，但心里变得很安静。", created_at: "2024-02-01" },
  { id: 3, type: "语录", content: "人要学会和孤独相处，孤独是一件很正常的事，不必害怕它。", created_at: "2024-01-01" },
  { id: 4, type: "诗", content: "从前慢。\n车、马、邮件都慢，\n一生只够爱一个人。", source: "木心", created_at: "2023-12-01" },
  { id: 5, type: "随笔", content: "有时候觉得文字比说话更诚实。写下来的东西，不会因为对方的表情而改变。", created_at: "2023-11-01" },
  { id: 6, type: "语录", content: "好好吃饭，好好睡觉，好好爱自己。其他的事情，慢慢来。", created_at: "2023-10-01" },
];

const TYPE_COLORS: Record<string, string> = { 诗: "purple", 随笔: "blue", 语录: "teal" };

// Star field decoration
function Stars() {
  const stars = [
    [10,8],[25,20],[40,5],[55,15],[70,8],[85,22],[15,35],[32,28],[60,32],[78,18],
    [90,40],[5,50],[20,45],[45,42],[65,50],[80,38],[12,60],[35,55],[58,62],[75,52],
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${x}%`, top: `${y}%`,
          width: i % 3 === 0 ? "3px" : "2px",
          height: i % 3 === 0 ? "3px" : "2px",
          background: i % 5 === 0 ? "#c8e0ff" : "#e8f0ff",
          opacity: 0.6 + (i % 4) * 0.1,
        }} />
      ))}
    </div>
  );
}

export default function MoonPage() {
  const [entries, setEntries] = useState<MoonEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("moon_entries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setEntries(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen relative" style={{
      background: "#0e1828",
      backgroundImage: "radial-gradient(ellipse at 70% 20%, #1a2a4a 0%, #0e1828 60%)",
    }}>
      <Stars />

      {/* Return button adapted for dark bg */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 cursor-pointer"
          style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: "9px",
            color: "#c8e0ff", background: "#1e3050",
            border: "3px solid #4a7aaa", boxShadow: "4px 4px 0 #0e2040",
            letterSpacing: "0.04em", lineHeight: 1.6,
          }}
        >
          <span style={{ fontSize: "14px", lineHeight: 1 }}>⌂</span>
          <span>RETURN</span>
        </button>
      </div>

      {/* Header */}
      <div className="pt-16 px-6 pb-0 relative z-10">
        <div style={{ border: "3px solid #3a5a8a", boxShadow: "6px 6px 0 #0e2040", background: "#12203a" }}>
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-2"
            style={{ background: "#1e3050", borderBottom: "3px solid #3a5a8a" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3" style={{ background: "#c05050", border: "2px solid #8a3030" }} />
              <div className="w-3 h-3" style={{ background: "#c0a030", border: "2px solid #8a7010" }} />
              <div className="w-3 h-3" style={{ background: "#5a9a7a", border: "2px solid #3a7a5a" }} />
            </div>
            <span style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: "10px",
              color: "#c8e0ff", letterSpacing: "0.08em", flex: 1, textAlign: "center", lineHeight: 1,
            }}>
              月光下
            </span>
            <img src={moonIcon} alt="" className="w-8 h-8 object-contain" style={{ imageRendering: "pixelated" }} />
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {loading ? <PixelLoading /> : entries.map((entry) => (
              <div key={entry.id} style={{
                background: "rgba(30,48,80,0.8)",
                border: "3px solid #3a5a8a",
                boxShadow: "5px 5px 0 #0e2040",
                padding: "20px 24px",
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <PixelTag label={entry.type} color={TYPE_COLORS[entry.type] as any} />
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#8ab8e8" }}>
                    {entry.created_at?.slice(0, 7).replace("-", ".")}
                  </span>
                </div>
                <p style={{
                  fontFamily: "Noto Sans SC, sans-serif",
                  fontSize: "16px",
                  color: "#c8dff8",
                  lineHeight: 2.2,
                  whiteSpace: "pre-line",
                  letterSpacing: "0.06em",
                }}>
                  {entry.content}
                </p>
                {entry.source && (
                  <p style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "7px",
                    color: "#8ab8e8",
                    marginTop: "12px",
                    textAlign: "right",
                    letterSpacing: "0.06em",
                  }}>
                    —— {entry.source}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
}
