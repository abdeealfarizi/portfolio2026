import type { Accent } from "@/lib/types";
import { accentBg, accentText } from "@/lib/theme";

type Props = {
  color?: Accent | "ink" | "paper";
  tilt?: number;
  className?: string;
  children: React.ReactNode;
};

/** Small tilted label, e.g. category badges and skill chips. */
export function Sticker({ color = "yellow", tilt = 0, className = "", children }: Props) {
  const colors = color === "ink" ? "bg-ink text-paper" : color === "paper" ? "bg-paper text-ink" : `${accentBg[color]} ${accentText[color]}`;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-ink px-3 py-1 text-sm font-bold leading-none shadow-brutal-sm ${colors} ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
