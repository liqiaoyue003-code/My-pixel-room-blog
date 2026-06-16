import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PixelLoading from "@/app/components/PixelLoading";
import diaryIcon from "@/imports/image-5.png";
import { supabase } from "@/lib/supabase";

interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  mood_color: string;
  created_at: string;
}

const MOCK: DiaryEntry[] = [
  { id: 1, created_at: "2024-03-15", title: "春天来了", mood: "开心", mood_color: "green",
    content: "今天天气很好，路边的樱花开了。中午吃了一碗热汤面，暖暖的。下午去图书馆坐了很久，读了半本书，感觉很充实。晚上发现楼道里有只流浪猫，给它喂了点东西，它用头蹭了我一下。" },
  { id: 2, created_at: "2024-03-10", title: "有点累的一天", mood: "平静", mood_color: "blue",
    content: "今天实验报告改了三遍，头有点疼。但是晚饭吃到了喜欢的麻辣香锅，瞬间好了很多。生活就是这样，总有一些小事能把人从低谷里拉出来。" },
  { id: 3, created_at: "2024-03-05", title: "碎碎念", mood: "满足", mood_color: "orange",
    content: "午饭：食堂的番茄炒蛋配米饭，今天的蛋炒得特别嫩。晚饭：自己煮的泡面加了个荷包蛋。其实平淡的日子也挺好的，有饭吃，有书读，有猫撸。" },
  { id: 4, created_at: "2024-02-28", title: "开学第一天", mood: "期待", mood_color: "purple",
    content: "新学期开始了，选了几门感兴趣的课。室友带了一大袋零食回来，我们一起吃了好久。宿舍窗外能看见一棵大树，我很喜欢。" },
];

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, ".");
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("diary_entries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setEntries(data);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell title="我的日记" icon={diaryIcon} bg="#d4c8b8">
      {loading ? <PixelLoading /> : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="cursor-pointer flex flex-col"
            style={{
              background: "#faf6ee",
              border: "3px solid #a09080",
              boxShadow: "5px 5px 0 #7a6a5a",
            }}
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            {/* Notebook top strip */}
            <div className="flex items-center justify-between px-3 py-2"
              style={{ background: "#c8a878", borderBottom: "3px solid #a09080" }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#faf6ee", letterSpacing: "0.06em" }}>
                DIARY
              </span>
              <PixelTag label={entry.mood} color={entry.mood_color as any} />
            </div>

            {/* Ruled lines area */}
            <div className="flex-1 px-4 pt-3 pb-4" style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #e0d8c8 27px, #e0d8c8 28px)",
              backgroundPositionY: "8px",
            }}>
              <div className="flex items-baseline justify-between mb-2">
                <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#5a4030", lineHeight: 1.8, letterSpacing: "0.04em" }}>
                  {entry.title}
                </h3>
              </div>
              <p style={{
                fontFamily: "Noto Sans SC, sans-serif",
                fontSize: "13px",
                color: "#6a5540",
                lineHeight: "28px",
                display: "-webkit-box",
                WebkitLineClamp: expanded === entry.id ? "none" : 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {entry.content}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-2"
              style={{ borderTop: "2px solid #e0d8c8" }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#a09080" }}>
                {formatDate(entry.created_at)}
              </span>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#a09080" }}>
                {expanded === entry.id ? "▲ CLOSE" : "▼ MORE"}
              </span>
            </div>
          </div>
        ))}
      </div>}
    </PageShell>
  );
}
