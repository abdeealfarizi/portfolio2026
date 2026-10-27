import Link from "next/link";
// The /ssr build has no React context, so this component works on both server and client.
import { ArrowRight, Play } from "@phosphor-icons/react/ssr";
import type { Post } from "@/lib/types";
import { categoryMeta, formatDate, formatViews } from "@/lib/theme";
import { Sticker } from "@/components/ui/Sticker";

/** Caption, tags and tools. Shared by the desktop side panel and the mobile sheet. */
export function PostDetails({ post, headingId }: { post: Post; headingId?: string }) {
  const cat = categoryMeta[post.category];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sticker color={cat.accent} tilt={-3}>
          {cat.label}
        </Sticker>
        <time dateTime={post.date} className="text-sm font-bold opacity-70">
          {formatDate(post.date)}
        </time>
        {post.views !== null && (
          <span className="flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-sm font-bold text-paper">
            <Play weight="fill" className="size-3.5" aria-hidden />
            {formatViews(post.views)} views
          </span>
        )}
      </div>
      <h2 id={headingId} className="font-display text-2xl font-black uppercase leading-tight">
        {post.title}
      </h2>
      {post.caption && <p className="whitespace-pre-line text-pretty">{post.caption}</p>}
      {post.stack.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">Tools</p>
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
          {post.tags.map((t) => (
            <li key={t}>#{t.replace(/\s+/g, "")}</li>
          ))}
        </ul>
      )}
      <Link href={`/p/${post.slug}`} className="inline-flex w-fit items-center gap-1.5 font-bold underline decoration-[3px] underline-offset-4 hover:decoration-pink">
        Buka halaman post
        <ArrowRight weight="bold" className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
