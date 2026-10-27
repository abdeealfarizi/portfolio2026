"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Copy, Play, PushPin } from "@phosphor-icons/react";
import type { Post } from "@/lib/types";
import { accentBg, categoryMeta, formatViews } from "@/lib/theme";
import { CategoryTabs, type Filter } from "@/components/ui/CategoryTabs";
import { Sticker } from "@/components/ui/Sticker";

const tilts = [-1.5, 1, -0.5, 1.5, -1];

export function PostGrid({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="work-title">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="work-title" className="font-display text-3xl font-black uppercase sm:text-5xl">
          Selected <span className="bg-lime px-2">work</span>
        </h2>
        <CategoryTabs id="grid" posts={posts} value={filter} onChange={setFilter} showCounts className="-m-1" />
      </div>

      <m.ul layout className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((post, i) => (
            <m.li
              key={post.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.04 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            >
              <Tile post={post} index={i} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </section>
  );
}

function Tile({ post, index }: { post: Post; index: number }) {
  const cat = categoryMeta[post.category];
  return (
    <Link
      href={`/feed?post=${post.slug}`}
      className="group block"
      aria-label={`${post.title}, ${cat.label}, ${post.slides.length} slide${post.views !== null ? `, ${formatViews(post.views)} views` : ""}`}
    >
      <m.div
        whileHover={{ y: -6, rotate: tilts[index % tilts.length] }}
        whileTap={{ scale: 0.97 }}
        className={`brutal relative aspect-[4/5] overflow-hidden ${accentBg[post.accent]}`}
      >
        <Image
          src={post.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, 50vw"
          className="object-cover"
          loading={index < 4 ? "eager" : "lazy"}
        />
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-2">
          <Sticker color={cat.accent} tilt={-4} className="text-xs sm:text-sm">
            {cat.label}
          </Sticker>
          <span className="flex items-center gap-1">
            {post.featured && (
              <span className="grid size-8 place-items-center rounded-full border-2 border-ink bg-yellow" title="Pinned">
                <PushPin weight="fill" className="size-4" aria-hidden />
              </span>
            )}
            {post.slides.length > 1 && (
              <span className="flex h-8 items-center gap-1 rounded-full border-2 border-ink bg-paper px-2 text-sm font-bold">
                <Copy weight="bold" className="size-4" aria-hidden />
                {post.slides.length}
              </span>
            )}
          </span>
        </div>
        {post.views !== null && (
          <span className="absolute bottom-2 left-2 hidden h-8 items-center gap-1 rounded-full border-2 border-ink bg-ink px-2.5 text-sm font-bold text-paper sm:flex">
            <Play weight="fill" className="size-3.5" aria-hidden />
            {formatViews(post.views)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t-[3px] border-ink bg-paper px-3 py-2 transition-transform duration-200 sm:translate-y-full sm:group-hover:translate-y-0 sm:group-focus-visible:translate-y-0">
          <p className="truncate font-bold">{post.title}</p>
          {post.views !== null && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-bold">
              <Play weight="fill" className="size-3.5" aria-hidden />
              {formatViews(post.views)}
            </span>
          )}
        </div>
      </m.div>
    </Link>
  );
}
