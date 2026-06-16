import { useNavigate } from "react-router";

export default function ReturnButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/room")}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 cursor-pointer active:translate-y-px transition-transform duration-75"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "9px",
        color: "#f4efe6",
        background: "#4a7a9b",
        border: "3px solid #2a5a7b",
        boxShadow: "4px 4px 0 #2a5a7b",
        letterSpacing: "0.02em",
        lineHeight: 1.6,
      }}
    >
      <span style={{ fontSize: "14px", lineHeight: 1 }}>⌂</span>
      <span>RETURN</span>
    </button>
  );
}
