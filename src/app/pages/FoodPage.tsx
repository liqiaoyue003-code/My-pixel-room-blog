import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PixelLoading from "@/app/components/PixelLoading";
import foodIcon from "@/imports/image-1.png";
import { supabase } from "@/lib/supabase";

interface FoodEntry {
  id: number;
  name: string;
  description: string;
  image_url: string;
  location: string;
  rating: number;
  created_at: string;
}

const MOCK: FoodEntry[] = [
  { id: 1, name: "麻辣香锅", rating: 5, location: "学校附近小店", created_at: "2024-03-10",
    description: "最爱的那家，宽粉和豆腐皮必点，辣度选中辣，汤汁拌饭绝了。",
    image_url: "https://picsum.photos/seed/food1/400/300" },
  { id: 2, name: "荷包蛋泡面", rating: 4, location: "宿舍", created_at: "2024-03-05",
    description: "自己煮的，加了火腿、生菜和一个溏心荷包蛋，凌晨的深夜食堂。",
    image_url: "https://picsum.photos/seed/food2/400/300" },
  { id: 3, name: "番茄炒蛋盖浇饭", rating: 4, location: "第二食堂", created_at: "2024-03-05",
    description: "食堂阿姨今天的番茄炒蛋很入味，鸡蛋炒得嫩，浇在米饭上是最朴素的幸福。",
    image_url: "https://picsum.photos/seed/food3/400/300" },
  { id: 4, name: "热汤面", rating: 5, location: "校门口面馆", created_at: "2024-03-15",
    description: "春寒料峭的中午，一碗牛肉汤面，从嘴暖到胃，汤头很鲜。",
    image_url: "https://picsum.photos/seed/food4/400/300" },
];

function PixelStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((i) => (
        <div key={i} className="w-3 h-3" style={{
          background: i <= rating ? "#c0a030" : "#d4c8b0",
          border: `2px solid ${i <= rating ? "#8a7010" : "#a09080"}`,
        }} />
      ))}
    </div>
  );
}

export default function FoodPage() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("food_entries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setEntries(data); setLoading(false); });
  }, []);

  return (
    <PageShell title="美食日记" icon={foodIcon} bg="#e8d8c4">
      {loading ? <PixelLoading /> : <div className="space-y-5">
        {entries.map((food) => (
          <div key={food.id} style={{
            background: "#faf6ee",
            border: "3px solid #a09080",
            boxShadow: "5px 5px 0 #7a6a5a",
            display: "flex",
          }}>
            {/* Image */}
            {food.image_url && (
              <div className="flex-shrink-0" style={{ width: "140px", minHeight: "120px", borderRight: "3px solid #a09080", overflow: "hidden", background: "#2a1a0a" }}>
                <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" style={{ display: "block" }} />
              </div>
            )}
            {/* Content */}
            <div className="flex-1 flex flex-col">
              {/* Header strip */}
              <div className="px-4 py-2 flex items-center justify-between"
                style={{ background: "#c8a060", borderBottom: "3px solid #a09080" }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "9px", color: "#faf6ee", letterSpacing: "0.04em" }}>
                  {food.name}
                </span>
                <PixelStars rating={food.rating} />
              </div>
              {/* Body */}
              <div className="px-4 py-3 flex-1">
                <p style={{ fontFamily: "Noto Sans SC, sans-serif", fontSize: "13px", color: "#6a5030", lineHeight: 1.8, marginBottom: "10px" }}>
                  {food.description}
                </p>
                <div className="flex items-center gap-3">
                  {food.location && <PixelTag label={food.location} color="orange" />}
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#a09080" }}>
                    {food.created_at?.slice(0, 10).replace(/-/g, ".")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </PageShell>
  );
}
