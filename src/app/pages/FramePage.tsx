import { useState, useEffect } from "react";
import PageShell from "@/app/components/PageShell";
import PhotoModal from "@/app/components/PhotoModal";
import PixelLoading from "@/app/components/PixelLoading";
import frameIcon from "@/imports/image-2.png";
import { supabase } from "@/lib/supabase";

interface Photo {
  id: number;
  image_url: string;
  caption: string;
  taken_at: string;
  created_at: string;
}

const MOCK: Photo[] = [
  { id: 1, image_url: "https://picsum.photos/seed/room1/600/400", caption: "傍晚的窗边，光线刚刚好", taken_at: "2024.03", created_at: "2024-03-01" },
  { id: 2, image_url: "https://picsum.photos/seed/room2/400/600", caption: "第一次拍到满意的夜景", taken_at: "2024.02", created_at: "2024-02-01" },
  { id: 3, image_url: "https://picsum.photos/seed/room3/600/500", caption: "春天的校园樱花", taken_at: "2024.03", created_at: "2024-03-10" },
  { id: 4, image_url: "https://picsum.photos/seed/room4/500/400", caption: "朋友送的小多肉，养了三个月还活着", taken_at: "2024.01", created_at: "2024-01-01" },
  { id: 5, image_url: "https://picsum.photos/seed/room5/600/450", caption: "图书馆的下午", taken_at: "2023.12", created_at: "2023-12-01" },
  { id: 6, image_url: "https://picsum.photos/seed/room6/450/600", caption: "喜欢这个角度的天空", taken_at: "2023.11", created_at: "2023-11-01" },
];

export default function FramePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [modal, setModal] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("photos").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data && data.length > 0) setPhotos(data); setLoading(false); });
  }, []);

  return (
    <PageShell title="我的相框" icon={frameIcon} bg="#d4c8b8">
      {loading ? <PixelLoading /> : <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-5 cursor-pointer group"
            onClick={() => setModal(photo)}
            style={{ border: "3px solid #8a7a6a", boxShadow: "5px 5px 0 #6a5a4a" }}
          >
            {/* Pixel frame top bar */}
            <div style={{ background: "#8a7a6a", borderBottom: "3px solid #6a5a4a", padding: "4px 8px", display: "flex", gap: "6px", alignItems: "center" }}>
              <div className="w-2.5 h-2.5" style={{ background: "#f4efe6", border: "1.5px solid #6a5a4a" }} />
              <div className="w-2.5 h-2.5" style={{ background: "#f4efe6", border: "1.5px solid #6a5a4a" }} />
              <div className="w-2.5 h-2.5" style={{ background: "#f4efe6", border: "1.5px solid #6a5a4a" }} />
            </div>
            {/* Photo */}
            <div className="overflow-hidden" style={{ background: "#2a1a0a" }}>
              <img
                src={photo.image_url}
                alt={photo.caption}
                className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Caption */}
            <div style={{ background: "#f4efe6", borderTop: "3px solid #8a7a6a", padding: "10px 12px" }}>
              <p style={{ fontFamily: "Noto Sans SC, sans-serif", fontSize: "12px", color: "#5a4a3a", lineHeight: 1.7 }}>
                {photo.caption}
              </p>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#a09080", display: "block", marginTop: "4px" }}>
                {photo.taken_at}
              </span>
            </div>
          </div>
        ))}
      </div>}
      {modal && <PhotoModal src={modal.image_url} caption={modal.caption} onClose={() => setModal(null)} />}
    </PageShell>
  );
}
