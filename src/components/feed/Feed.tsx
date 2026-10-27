"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { ArrowLeft } from "@phosphor-icons/react";
import type { Post } from "@/lib/types";
import { CategoryTabs, isCategory, type Filter } from "@/components/ui/CategoryTabs";
import { FeedPost } from "./FeedPost";
import { CaptionSheet } from "./CaptionSheet";

const LIKES_KEY = "portfolio:likes";

function readLikes(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function Feed({ posts }: { posts: Post[] }) {
  const container = useRef<HTMLDivElement>(null);
  const pendingSlug = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(0);
  const [likes, setLikes] = useState<Set<string>>(() => new Set());
  const [sheetPost, setSheetPost] = useState<Post | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const visible = useMemo(() => (filter === "all" ? posts : posts.filter((p) => p.category === filter)), [posts, filter]);

  // Deep link: /feed?post=slug&cat=design. Read on the client so the page stays fully static.
  // URL and localStorage only exist after hydration, so syncing them into state here is intended.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (isCategory(cat)) setFilter(cat);
    pendingSlug.current = params.get("post");
    setLikes(readLikes());
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // After the list renders, jump to the requested post (or back to the top on filter change).
  useLayoutEffect(() => {
    const el = container.current;
    if (!el || !ready) return;
    const target = pendingSlug.current ? visible.findIndex((p) => p.slug === pendingSlug.current) : 0;
    pendingSlug.current = null;
    const i = Math.max(0, target);
    setActive(i);

    const jump = () => {
      const article = el.querySelector<HTMLElement>(`article[data-index="${i}"]`);
      el.scrollTo({ top: article?.offsetTop ?? 0, behavior: "instant" });
    };
    // The container can still be 0px tall here (e.g. CSS not applied yet), so wait until it has a size.
    if (el.clientHeight > 0) {
      jump();
      return;
    }
    const ro = new ResizeObserver(() => {
      if (el.clientHeight === 0) return;
      ro.disconnect();
      jump();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible, ready]);

  // Track which post fills the screen.
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("article[data-index]").forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, [visible]);

  // Keep the URL shareable without re-rendering the route.
  useEffect(() => {
    const post = visible[active];
    if (!post || !ready) return;
    const params = new URLSearchParams({ post: post.slug });
    if (filter !== "all") params.set("cat", filter);
    window.history.replaceState(null, "", `/feed?${params}`);
  }, [active, visible, filter, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onLike = useCallback((slug: string, force?: boolean) => {
    setLikes((prev) => {
      const next = new Set(prev);
      if (force || !next.has(slug)) next.add(slug);
      else next.delete(slug);
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const onShare = useCallback(async (post: Post) => {
    const url = `${window.location.origin}/p/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.caption, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast("Link disalin!");
    } catch (err) {
      if ((err as Error).name !== "AbortError") setToast("Gagal membagikan, coba lagi");
    }
  }, []);

  const onInfo = useCallback((post: Post) => setSheetPost(post), []);
  const closeSheet = useCallback(() => setSheetPost(null), []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-3">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center gap-3">
          <Link
            href="/"
            aria-label="Kembali ke beranda"
            className="brutal-press grid size-11 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-paper shadow-brutal-sm"
          >
            <ArrowLeft weight="bold" className="size-5" aria-hidden />
          </Link>
          <CategoryTabs id="feed" posts={posts} value={filter} onChange={setFilter} className="min-w-0 flex-1" />
          <span className="hidden shrink-0 rounded-full border-[2.5px] border-ink bg-paper px-3 py-1.5 font-bold tabular-nums sm:block">
            {visible.length ? active + 1 : 0}/{visible.length}
          </span>
        </div>
      </header>

      <div
        id="main"
        ref={container}
        className="relative h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scrollbar-none"
        aria-label="Feed karya"
      >
        {visible.map((post, i) => (
          <FeedPost
            key={post.slug}
            post={post}
            index={i}
            near={Math.abs(i - active) <= 1}
            liked={likes.has(post.slug)}
            onLike={onLike}
            onShare={onShare}
            onInfo={onInfo}
          />
        ))}
        {visible.length === 0 && (
          <div className="grid h-dvh place-items-center bg-paper px-4 text-center">
            <p className="font-display text-xl font-black uppercase">Belum ada post di kategori ini</p>
          </div>
        )}
      </div>

      <CaptionSheet post={sheetPost} onClose={closeSheet} />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
        <AnimatePresence>
          {toast && (
            <m.p
              key={toast}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0, transition: { duration: 0.15 } }}
              className="brutal bg-lime px-5 py-3 font-bold"
            >
              {toast}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
