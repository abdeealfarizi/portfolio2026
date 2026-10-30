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

// Order here is the tab order. Labels live in the i18n dictionaries.
export const categoryMeta: Record<Category, { accent: Accent }> = {
  design: { accent: "orange" },
  fotografi: { accent: "yellow" },
  code: { accent: "lime" },
};

export const categories = Object.keys(categoryMeta) as Category[];

export function ratioParts(ratio: string): [number, number] {
  const [w, h] = ratio.split("/").map(Number);
  return w > 0 && h > 0 ? [w, h] : [4, 5];
}
