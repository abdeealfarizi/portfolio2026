"use client";

import { memo } from "react";
import type { Post } from "@/lib/types";
import { Play } from "@phosphor-icons/react";
import { accentBg, accentText, ratioParts } from "@/lib/theme";
import { useI18n } from "@/i18n/provider";
import { Sticker } from "@/components/ui/Sticker";
import { SlideCarousel } from "./SlideCarousel";
import { ActionRail } from "./ActionRail";
import { PostDetails } from "./PostDetails";

type Props = {
  post: Post;
  index: number;
  near: boolean;
  liked: boolean;
  onLike: (slug: string, force?: boolean) => void;
  onShare: (post: Post) => void;
  onInfo: (post: Post) => void;
};

export const FeedPost = memo(function FeedPost({ post, index, near, liked, onLike, onShare, onInfo }: Props) {
  const { t, views } = useI18n();
  const [w, h] = ratioParts(post.ratio);

  return (
    <article
      data-index={index}
      aria-label={post.title}
      className={`bg-dots relative flex h-dvh snap-start snap-always items-center justify-center gap-8 px-4 pb-4 pt-20 [--chrome:15rem] [--side:0rem] lg:pt-24 lg:[--chrome:9rem] lg:[--side:29rem] ${accentBg[post.accent]}`}
    >
      <div className="flex w-full flex-col items-center gap-3 lg:w-auto lg:flex-row lg:items-end lg:gap-5">
        <div
          className="brutal relative overflow-hidden bg-paper shadow-brutal-lg"
          // Fit inside both the free width (minus rail + side panel on desktop) and the free height.
          style={{ aspectRatio: `${w} / ${h}`, width: `min(100vw - 2rem - var(--side), (100dvh - var(--chrome)) * ${w / h})` }}
        >
          <SlideCarousel
            slides={post.slides}
            title={post.title}
            near={near}
            eager={index === 0}
            sizes={`(min-width: 1024px) ${Math.round(720 * (w / h))}px, 100vw`}
            onDoubleTap={() => onLike(post.slug, true)}
          />
        </div>

        {/* Desktop: vertical rail beside the frame */}
        <div className="hidden lg:block">
          <ActionRail post={post} liked={liked} onLike={() => onLike(post.slug)} onShare={() => onShare(post)} direction="col" />
        </div>

        {/* Mobile: title + caption preview + actions under the frame */}
        <div className={`flex w-full max-w-lg flex-col gap-2 lg:hidden ${accentText[post.accent]}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <Sticker color="paper" tilt={-2} className="text-xs">
                  {t.categories[post.category]}
                </Sticker>
                {post.views !== null && (
                  <span className="flex items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-paper">
                    <Play weight="fill" className="size-3" aria-hidden />
                    {views(post.views)} {t.common.views}
                  </span>
                )}
              </div>
              <h2 className="truncate font-display text-lg font-black uppercase">{post.title}</h2>
            </div>
          </div>
          {post.caption && (
            <button type="button" onClick={() => onInfo(post)} className="text-left">
              <span className="line-clamp-2">{post.caption}</span>
              <span className="font-bold underline underline-offset-2">{t.feed.readMore}</span>
            </button>
          )}
          <div className="text-ink">
            <ActionRail
              post={post}
              liked={liked}
              onLike={() => onLike(post.slug)}
              onShare={() => onShare(post)}
              onInfo={() => onInfo(post)}
              direction="row"
            />
          </div>
        </div>
      </div>

      {/* Desktop: caption panel */}
      <aside className="brutal hidden max-h-[calc(100dvh-9rem)] w-80 shrink-0 overflow-y-auto bg-paper p-6 lg:block">
        <PostDetails post={post} />
      </aside>
    </article>
  );
});
