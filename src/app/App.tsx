import { BrowserRouter, Routes, Route, useNavigate } from "react-router";
import { useState } from "react";

// Asset imports
import roomBg from "@/imports/image.png";
import foodImg from "@/imports/image-1.png";
import frameImg from "@/imports/image-2.png";
import computerImg from "@/imports/image-3.png";
import cloudsImg from "@/imports/image-4.png";
import diaryImg from "@/imports/image-5.png";
import bookshelfImg from "@/imports/image-6.png";
import moonImg from "@/imports/image-7.png";
import catImg from "@/imports/image-8.png";
import roomCircle from "@/imports/Desktop1/ab50fdb583d0845080b81e307a52183c374e90f9.png";

// Page imports
import DiaryPage from "@/app/pages/DiaryPage";
import ComputerPage from "@/app/pages/ComputerPage";
import CloudsPage from "@/app/pages/CloudsPage";
import FramePage from "@/app/pages/FramePage";
import FoodPage from "@/app/pages/FoodPage";
import CatPage from "@/app/pages/CatPage";
import BookshelfPage from "@/app/pages/BookshelfPage";
import MoonPage from "@/app/pages/MoonPage";
import ProjectDetailPage from "@/app/pages/ProjectDetailPage";
import CourseDetailPage from "@/app/pages/CourseDetailPage";

const CANVAS_W = 1280;
const CANVAS_H = 880;

interface HotspotDef {
  id: string;
  label: string;
  en: string;
  src: string;
  tip?: { h: "left" | "center" | "right"; v: "top" | "bottom" };
  x: number;
  y: number;
  w: number;
  h: number;
  route: string;
}

const hotspots: HotspotDef[] = [
  { id: "moon",      label: "月亮",   en: "MOON",      src: moonImg,      route: "/moon",   tip: { h: "left", v: "bottom" },
    x: 1034,                     y: -173,                                             w: 386, h: 384 },
  { id: "clouds",    label: "云朵",   en: "CLOUDS",    src: cloudsImg,    route: "/clouds",
    x: 911,                      y: 156,                                              w: 310, h: 144 },
  { id: "bookshelf", label: "书架",   en: "BOOKSHELF", src: bookshelfImg, route: "/bookshelf", tip: { h: "right", v: "bottom" },
    x: -70  - 192 * (1 / 5) + 2 + 25, y: 274 + 134 * (1 / 10),                     w: 192, h: 134 },
  { id: "computer",  label: "电脑",   en: "COMPUTER",  src: computerImg,  route: "/computer",
    x: 206,                      y: 412 + 10,                                         w: 277, h: 290 },
  { id: "food",      label: "食物",   en: "FOOD",      src: foodImg,      route: "/food",
    x: 665  + 174 * (1 / 8),    y: 518 + 125 * (1 / 4),                             w: 174, h: 125 },
  { id: "frame",     label: "相框",   en: "GALLERY",   src: frameImg,     route: "/frame",
    x: 981  + 105 * (1 / 10) + 3, y: 623 + 115 * (1 / 2) - 115 * (1 / 7),         w: 105, h: 115 },
  { id: "cat",       label: "小猫",   en: "CAT",       src: catImg,       route: "/cat",
    x: 1066 + 181 * (1 / 5) - 13, y: 700 + 130 * (3 / 5) - 130 * (4 / 5) + 55,    w: 181, h: 130 },
  { id: "diary",     label: "日记本", en: "DIARY",     src: diaryImg,     route: "/diary",
    x: 135  - 174 * (1 / 5) + 5 + 20, y: 681 + 149 * (1 / 5) + 149 * (1 / 8),     w: 174, h: 149 },
];

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white select-none">
      <button
        onClick={() => navigate("/room")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative outline-none border-none bg-transparent p-0 cursor-pointer"
        aria-label="进入房间"
      >
        <div
          className="rounded-full overflow-hidden transition-transform duration-500 ease-out"
          style={{
            width: "min(62vw, 600px)",
            height: "min(62vw, 600px)",
            background: "#b8c9e0",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            boxShadow: hovered
              ? "0 20px 60px rgba(111,152,192,0.35)"
              : "0 8px 30px rgba(111,152,192,0.18)",
          }}
        >
          <img src={roomCircle} alt="像素小房间" className="w-full h-full object-cover" />
        </div>
        <p
          className="text-center mt-6 transition-opacity duration-300"
          style={{
            fontFamily: "Pacifico, cursive",
            fontSize: "clamp(28px, 4vw, 56px)",
            color: "#6f98c0",
            opacity: hovered ? 1 : 0.62,
          }}
        >
          click to entr
        </p>
      </button>
    </div>
  );
}

// ─── Room Page ────────────────────────────────────────────────────────────────

function RoomPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);

  // 容器宽高比锁定为原图 1280:880，自适应撑满视口但不超出
  const aspect = CANVAS_W / CANVAS_H; // ≈ 1.4545

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "#c8d8e8" }}
    >
      <div
        style={{
          position: "relative",
          width: `min(100vw, calc(100vh * ${aspect}))`,
          height: `min(100vh, calc(100vw / ${aspect}))`,
        }}
      >
        <img
          src={roomBg}
          alt="像素小房间"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
          draggable={false}
        />

        {hotspots.map(({ id, label, en, src, x, y, w, route, tip }) => {
          const isActive = activeId === id;
          const tv = tip?.v ?? "top";
          const th = tip?.h ?? "center";

          // 水平定位
          const hStyle: React.CSSProperties =
            th === "center" ? { left: "50%", transform: "translateX(-50%)" } :
            th === "left"   ? { left: 0 } :
                              { right: 0 };

          // 垂直定位（气泡在上或在下）
          const vStyle: React.CSSProperties =
            tv === "top"
              ? { bottom: "100%", marginBottom: 4, flexDirection: "column" }
              : { top: "100%",    marginTop: 4,    flexDirection: "column-reverse" };

          return (
            <button
              key={id}
              onMouseEnter={() => setActiveId(id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => navigate(route)}
              className="absolute outline-none border-none bg-transparent p-0 cursor-pointer"
              style={{
                left: `${(x / CANVAS_W) * 100}%`,
                top: `${(y / CANVAS_H) * 100}%`,
                width: `${(w / CANVAS_W) * 100}%`,
              }}
              aria-label={label}
            >
              {isActive && (
                <span
                  className="absolute pointer-events-none z-20 flex items-center"
                  style={{ ...hStyle, ...vStyle }}
                >
                  {/* 像素对话气泡 */}
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: "7px",
                    letterSpacing: "0.12em",
                    color: "#e8f4ff",
                    background: "#1a2e45",
                    border: "3px solid #4a8abd",
                    boxShadow: "3px 3px 0 #0a1830",
                    padding: "6px 10px",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    display: "block",
                  }}>
                    {en}
                  </span>
                  {/* 像素阶梯箭头 */}
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: 10, height: 3, background: "#4a8abd", display: "block" }} />
                    <span style={{ width: 4,  height: 3, background: "#4a8abd", display: "block" }} />
                  </span>
                </span>
              )}
              <img
                src={src}
                alt={label}
                draggable={false}
                className="w-full h-auto block"
                style={{
                  filter: isActive ? "brightness(1.18) drop-shadow(0 0 12px rgba(140,210,255,0.95))" : "none",
                  transform: isActive ? "scale(1.07)" : "scale(1)",
                  transition: "filter 0.2s ease, transform 0.2s ease",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/computer" element={<ComputerPage />} />
        <Route path="/clouds" element={<CloudsPage />} />
        <Route path="/frame" element={<FramePage />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/cat" element={<CatPage />} />
        <Route path="/bookshelf" element={<BookshelfPage />} />
        <Route path="/moon" element={<MoonPage />} />
        <Route path="/computer/:id" element={<ProjectDetailPage />} />
        <Route path="/bookshelf/:id" element={<CourseDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
