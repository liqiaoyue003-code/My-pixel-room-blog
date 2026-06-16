interface PixelTagProps {
  label: string;
  variant?: "solid" | "outline";
  color?: string;
}

const PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: "#4a7a9b", text: "#fff",    border: "#2a5a7b" },
  green:  { bg: "#5a9a7a", text: "#fff",    border: "#3a7a5a" },
  pink:   { bg: "#b06080", text: "#fff",    border: "#8a4060" },
  purple: { bg: "#7a5a9a", text: "#fff",    border: "#5a3a7a" },
  orange: { bg: "#b07840", text: "#fff",    border: "#8a5820" },
  teal:   { bg: "#4a8a8a", text: "#fff",    border: "#2a6a6a" },
};

export default function PixelTag({ label, variant = "solid", color = "blue" }: PixelTagProps) {
  const c = PALETTE[color] ?? PALETTE.blue;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5"
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "7px",
        letterSpacing: "0.04em",
        background: variant === "solid" ? c.bg : "transparent",
        color: variant === "solid" ? c.text : c.border,
        border: `2px solid ${c.border}`,
        boxShadow: variant === "solid" ? `2px 2px 0 ${c.border}` : "none",
        lineHeight: 2,
      }}
    >
      {label}
    </span>
  );
}
