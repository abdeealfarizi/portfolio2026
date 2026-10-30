"use client";

import * as m from "motion/react-m";
import type { Category, Post } from "@/lib/types";
import { accentBg, categories, categoryMeta } from "@/lib/theme";
import { useI18n } from "@/i18n/provider";

export type Filter = "all" | Category;

export function isCategory(value: string | null): value is Category {
  return categories.includes(value as Category);
}

type Props = {
  posts: Post[];
  value: Filter;
  onChange: (value: Filter) => void;
  showCounts?: boolean;
  /** Unique per instance so the sliding pill doesn't jump between tab groups. */
  id: string;
  className?: string;
};

/** "All" plus one tab per category that has posts; empty categories stay hidden. */
export function CategoryTabs({ posts, value, onChange, showCounts = false, id, className = "" }: Props) {
  const { t } = useI18n();
  const tabs: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: t.common.all, count: posts.length },
    ...categories
      .map((c) => ({ value: c, label: t.categories[c], count: posts.filter((p) => p.category === c).length }))
      .filter((tab) => tab.count > 0),
  ];

  return (
    <div role="tablist" aria-label={t.a11y.filterCategory} className={`flex gap-2 overflow-x-auto scrollbar-none p-1 ${className}`}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        const pill = tab.value === "all" ? "bg-ink" : accentBg[categoryMeta[tab.value].accent];
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={`relative h-11 shrink-0 cursor-pointer rounded-full border-[2.5px] border-ink bg-paper px-4 font-bold transition-transform active:translate-y-0.5 ${
              active && tab.value === "all" ? "text-paper" : "text-ink"
            }`}
          >
            {active && (
              <m.span layoutId={`tab-pill-${id}`} className={`absolute inset-0 rounded-full ${pill}`} aria-hidden />
            )}
            <span className="relative">
              {tab.label}
              {showCounts && <span className="ml-1.5 opacity-70">{tab.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
