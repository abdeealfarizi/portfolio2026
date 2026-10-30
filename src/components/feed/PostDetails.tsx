"use client";

import Link from "next/link";
import { ArrowRight, Play } from "@phosphor-icons/react/ssr";
import type { Post } from "@/lib/types";
import { categoryMeta } from "@/lib/theme";
import { useI18n } from "@/i18n/provider";
import { Sticker } from "@/components/ui/Sticker";

/** Caption, tags and tools. Shared by the desktop side panel, the mobile sheet and the post page. */
export function PostDetails({ post, headingId }: { post: Post; headingId?: string }) {
  const { t, href, date, views } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sticker color={categoryMeta[post.category].accent} tilt={-3}>
          {t.categories[post.category]}
        </Sticker>
        <time dateTime={post.date} className="text-sm font-bold opacity-70">
          {date(post.date)}
        </time>
        {post.views !== null && (
          <span className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-sm font-bold text-paper">
            <Play weight="fill" className="size-3.5" aria-hidden />
            {views(post.views)} {t.common.views}
          </span>
        )}
      </div>
      <h2 id={headingId} className="font-display text-2xl font-black uppercase leading-tight">
        {post.title}
      </h2>
      {post.caption && <p className="whitespace-pre-line text-pretty">{post.caption}</p>}
      {post.stack.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">{t.post.tools}</p>
          <ul className="flex flex-wrap gap-2">
            {post.stack.map((s) => (
              <li key={s} className="rounded-md border-2 border-ink bg-ink px-2 py-0.5 text-sm font-bold text-paper">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {post.tags.length > 0 && (
        <ul className="flex flex-wrap gap-x-3 gap-y-1 font-bold text-blue">
          {post.tags.map((tag) => (
            <li key={tag}>#{tag.replace(/\s+/g, "")}</li>
          ))}
        </ul>
      )}
      <Link
        href={href(`/p/${post.slug}`)}
        className="inline-flex w-fit items-center gap-1.5 font-bold underline decoration-[3px] underline-offset-4 hover:decoration-pink"
      >
        {t.post.openPage}
        <ArrowRight weight="bold" className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
