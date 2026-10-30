"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { X } from "@phosphor-icons/react";
import type { Post } from "@/lib/types";
import { useI18n } from "@/i18n/provider";
import { PostDetails } from "./PostDetails";

export function CaptionSheet({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const { t } = useI18n();
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!post) return;
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" key="sheet">
          <m.div
            className="absolute inset-0 bg-ink/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            className="relative max-h-[80dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border-[3px] border-b-0 border-ink bg-paper px-5 pb-8 pt-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/30" aria-hidden />
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label={t.a11y.closeDetails}
              className="brutal-press absolute right-4 top-4 grid size-11 place-items-center rounded-full border-[2.5px] border-ink bg-yellow shadow-brutal-sm"
            >
              <X weight="bold" className="size-5" aria-hidden />
            </button>
            <PostDetails post={post} headingId="sheet-title" />
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
