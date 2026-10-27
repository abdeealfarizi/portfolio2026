"use client";

import * as m from "motion/react-m";
import { ArrowSquareOut, GithubLogo, Heart, Info, InstagramLogo, ShareFat, TiktokLogo } from "@phosphor-icons/react";
import type { Post } from "@/lib/types";

type Props = {
  post: Post;
  liked: boolean;
  onLike: () => void;
  onShare: () => void;
  onInfo?: () => void;
  direction: "row" | "col";
};

export function ActionRail({ post, liked, onLike, onShare, onInfo, direction }: Props) {
  return (
    <div className={`flex gap-3 ${direction === "col" ? "flex-col" : "flex-row flex-wrap"}`}>
      <RailButton label="Suka" pressed={liked} onClick={onLike} active={liked}>
        <m.span key={String(liked)} initial={liked ? { scale: 0.4 } : false} animate={{ scale: [0.4, 1.35, 1] }}
          transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          className="grid"
        >
          <Heart weight={liked ? "fill" : "bold"} className={`size-6 ${liked ? "text-pink" : ""}`} aria-hidden />
        </m.span>
      </RailButton>
      <RailButton label="Bagikan" onClick={onShare}>
        <ShareFat weight="bold" className="size-6" aria-hidden />
      </RailButton>
      {onInfo && (
        <RailButton label="Detail" onClick={onInfo}>
          <Info weight="bold" className="size-6" aria-hidden />
        </RailButton>
      )}
      {post.source && (
        <RailLink label={sourceLabel(post.source)} href={post.source}>
          {/tiktok\.com/.test(post.source) ? (
            <TiktokLogo weight="bold" className="size-6" aria-hidden />
          ) : /instagram\.com/.test(post.source) ? (
            <InstagramLogo weight="bold" className="size-6" aria-hidden />
          ) : (
            <ArrowSquareOut weight="bold" className="size-6" aria-hidden />
          )}
        </RailLink>
      )}
      {post.links.live && (
        <RailLink label="Live" href={post.links.live}>
          <ArrowSquareOut weight="bold" className="size-6" aria-hidden />
        </RailLink>
      )}
      {post.links.repo && (
        <RailLink label="Repo" href={post.links.repo}>
          <GithubLogo weight="bold" className="size-6" aria-hidden />
        </RailLink>
      )}
    </div>
  );
}

function sourceLabel(url: string) {
  if (/tiktok\.com/.test(url)) return "TikTok";
  if (/instagram\.com/.test(url)) return "Instagram";
  return "Asli";
}

const circle =
  "brutal-press grid size-12 place-items-center rounded-full border-[2.5px] border-ink bg-paper text-ink shadow-brutal-sm";

function RailButton({
  label,
  onClick,
  pressed,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={pressed} className="flex flex-col items-center gap-1">
      <span className={`${circle} ${active ? "bg-yellow" : ""}`}>{children}</span>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function RailLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1">
      <span className={circle}>{children}</span>
      <span className="text-xs font-bold">{label}</span>
    </a>
  );
}
