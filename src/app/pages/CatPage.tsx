import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PixelTag from "@/app/components/PixelTag";
import PhotoModal from "@/app/components/PhotoModal";
import PixelLoading from "@/app/components/PixelLoading";
import catIcon from "@/imports/image-8.png";
import { supabase } from "@/lib/supabase";

interface AnimalEntry {
  id: number;
  name: string;
  description: string;
  image_url: string;
  location: string;
  created_at: string;
}

const MOCK: AnimalEntry[] = [
  { id: 1, name: "橘猫「胖橘」", location: "宿舍楼道", created_at: "2024-03-15",
    description: "宿舍楼道里的常驻居民，很粘人。每次路过它都要凑上来蹭一蹭，毛超级软。",
    image_url: "https://picsum.photos/seed/cat1/500/400" },
  { id: 2, name: "流浪小黑猫", location: "学校南门附近", created_at: "2024-02-28",
    description: "一个雨天在路边遇到的，眼睛亮亮的，有点怕人。我蹲下来等了很久，它终于走近闻了闻我的手。",
    image_url: "https://picsum.photos/seed/cat2/500/400" },
  { id: 3, name: "图书馆的鸽子", location: "图书馆前", created_at: "2024-01-20",
    description: "图书馆台阶上每天都有一群鸽子，不怕人，踩着方步走来走去。",
    image_url: "https://picsum.photos/seed/pigeon1/500/400" },
];

export default function CatPage() {
  const [entries, setEntries] = useState<AnimalEntry[]>([]);
  const [modal, setModal] = useState<AnimalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("animal_entries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setEntries(data); setLoading(false); });
  }, []);

  return (
    <PageShell title="小动物们" icon={catIcon} bg="#d0dcc8">
      {loading ? <PixelLoading /> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {entries.map((animal) => (
          <div key={animal.id} style={{
            background: "#f4f8f0",
            border: "3px solid #6a8a6a",
            boxShadow: "5px 5px 0 #4a6a4a",
          }}>
            {/* Image */}
            {animal.image_url && (
              <div className="overflow-hidden cursor-pointer relative group"
                style={{ borderBottom: "3px solid #6a8a6a", background: "#1a2a1a", height: "180px" }}
                onClick={() => setModal(animal)}>
                <img src={animal.image_url} alt={animal.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#fff", letterSpacing: "0.04em" }}>
                    ZOOM ▸
                  </span>
                </div>
              </div>
            )}
            {/* Content */}
            <div className="px-4 py-2" style={{ background: "#5a8a5a", borderBottom: "3px solid #6a8a6a" }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#f4f8f0", letterSpacing: "0.04em" }}>
                ♥ {animal.name}
              </span>
            </div>
            <div className="p-4">
              <p style={{ fontFamily: "Noto Sans SC, sans-serif", fontSize: "13px", color: "#3a5a3a", lineHeight: 1.8, marginBottom: "10px" }}>
                {animal.description}
              </p>
              <div className="flex items-center gap-3">
                {animal.location && <PixelTag label={animal.location} variant="outline" color="green" />}
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#8aaa8a" }}>
                  {animal.created_at?.slice(0, 10).replace(/-/g, ".")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>}
      {modal && <PhotoModal src={modal.image_url} caption={modal.name} onClose={() => setModal(null)} />}
    </PageShell>
  );
}
