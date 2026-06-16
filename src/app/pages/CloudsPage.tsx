import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PixelLoading from "@/app/components/PixelLoading";
import cloudsIcon from "@/imports/image-4.png";
import { supabase } from "@/lib/supabase";

interface Thought {
  id: number;
  content: string;
  category: "工作" | "婚姻" | "人生";
  created_at: string;
}

const MOCK: Thought[] = [
  { id: 1, category: "工作", created_at: "2024-03-01", content: "希望以后能做自己真正喜欢的事。不一定要赚很多钱，但要觉得每天醒来值得。" },
  { id: 2, category: "人生", created_at: "2024-02-01", content: "想在某个安静的小城市住上一段时间，不赶路，不焦虑，只是好好生活。" },
  { id: 3, category: "婚姻", created_at: "2024-01-01", content: "如果有一天遇到那个人，希望我们能一起做饭、一起养猫、一起在周末睡到自然醒。" },
  { id: 4, category: "工作", created_at: "2024-03-15", content: "想学会独立开发一个完整的产品，从想法到上线，全部自己来。这个网站是第一步。" },
  { id: 5, category: "人生", created_at: "2023-12-01", content: "要多出去走走，多见一些不一样的风景，多认识一些有趣的人。不要把自己困在一个地方。" },
  { id: 6, category: "婚姻", created_at: "2023-11-01", content: "不着急，先把自己过好。爱情应该是锦上添花，而不是生活的全部。" },
];

const CAT: Record<string, { border: string; shadow: string; label: string; color: string; emoji: string }> = {
  工作: { border: "#4a7a9b", shadow: "#2a5a7b", label: "blue", color: "#eef4fa", emoji: "💻" },
  婚姻: { border: "#9a5a7a", shadow: "#7a3a5a", label: "pink", color: "#f8eef4", emoji: "🌸" },
  人生: { border: "#5a8a6a", shadow: "#3a6a4a", label: "green", color: "#eef8f0", emoji: "✨" },
};

export default function CloudsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("future_thoughts").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setThoughts(data); setLoading(false); });
  }, []);

  return (
    <PageShell title="云端畅想" icon={cloudsIcon} bg="#c8dce8">
      {loading ? <PixelLoading /> : <div className="space-y-8">
        {(["工作", "婚姻", "人生"] as const).map((cat) => {
          const s = CAT[cat];
          const items = thoughts.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1" style={{
                  background: s.border, border: `2px solid ${s.shadow}`,
                  boxShadow: `3px 3px 0 ${s.shadow}`,
                }}>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#fff", letterSpacing: "0.06em" }}>
                    {s.emoji} {cat}
                  </span>
                </div>
                <div className="flex-1" style={{ height: "3px", background: `repeating-linear-gradient(to right, ${s.border} 0, ${s.border} 8px, transparent 8px, transparent 14px)` }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((t) => (
                  <div key={t.id} style={{
                    background: s.color,
                    border: `3px solid ${s.border}`,
                    boxShadow: `5px 5px 0 ${s.shadow}`,
                    padding: "20px",
                  }}>
                    <p style={{
                      fontFamily: "Noto Sans SC, sans-serif",
                      fontSize: "14px",
                      color: "#2a3a4a",
                      lineHeight: 2,
                      marginBottom: "12px",
                    }}>
                      ❝ {t.content} ❞
                    </p>
                    <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#8aabbb" }}>
                      {t.created_at?.slice(0, 7).replace("-", ".")}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>}
    </PageShell>
  );
}
