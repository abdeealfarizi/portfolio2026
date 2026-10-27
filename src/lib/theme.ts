import type { Accent, Category } from "./types";

// Full class names so Tailwind can see them at build time.
export const accentBg: Record<Accent, string> = {
  pink: "bg-pink",
  yellow: "bg-yellow",
  lime: "bg-lime",
  orange: "bg-orange",
  blue: "bg-blue",
  purple: "bg-purple",
};

// Ink fails 4.5:1 on blue, so blue surfaces use white text.
export const accentText: Record<Accent, string> = {
  pink: "text-ink",
  yellow: "text-ink",
  lime: "text-ink",
  orange: "text-ink",
  blue: "text-white",
  purple: "text-ink",
};

// Order here is the tab order.
export const categoryMeta: Record<Category, { label: string; accent: Accent }> = {
  design: { label: "Design", accent: "orange" },
  fotografi: { label: "Fotografi", accent: "yellow" },
  code: { label: "Code", accent: "lime" },
};

export const categories = Object.keys(categoryMeta) as Category[];

/** 1234567 → "1,2 jt", 12300 → "12,3 rb" */
export function formatViews(n: number) {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function ratioParts(ratio: string): [number, number] {
  const [w, h] = ratio.split("/").map(Number);
  return w > 0 && h > 0 ? [w, h] : [4, 5];
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
