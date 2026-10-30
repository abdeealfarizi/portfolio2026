"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CaretLeft, CaretRight, Heart } from "@phosphor-icons/react";
import type { Slide } from "@/lib/types";
import { useI18n } from "@/i18n/provider";

type Props = {
  slides: Slide[];
  title: string;
  /** Render real images only when the post is on or next to the screen. */
  near: boolean;
  /** First post on the page: load its first slide eagerly with high priority. */
  eager?: boolean;
  sizes: string;
  onDoubleTap?: () => void;
};

/**
 * Native CSS scroll-snap carousel. The browser handles swipe physics; Motion only
 * animates the progress bar and the double-tap heart.
 */
export function SlideCarousel({ slides, title, near, eager = false, sizes, onDoubleTap }: Props) {
  const { t, fmt } = useI18n();
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  const [burst, setBurst] = useState(0);
  const multi = slides.length > 1;

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = scroller.current;
      if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
    });
  }, []);

  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const handleDoubleClick = () => {
    if (!onDoubleTap) return;
    onDoubleTap();
    setBurst((b) => b + 1);
  };

  return (
    <div className="group/carousel relative h-full w-full" aria-roledescription={t.a11y.carousel} aria-label={title}>
      <div
        ref={scroller}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        onDoubleClick={handleDoubleClick}
        tabIndex={multi ? 0 : -1}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.image + i}
            role="group"
            aria-roledescription={t.a11y.slide}
            aria-label={fmt(t.a11y.slideOf, { n: i + 1, total: slides.length })}
            className="relative h-full w-full shrink-0 snap-center snap-always"
          >
            {near && (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes={sizes}
                quality={85}
                draggable={false}
                className="select-none object-cover"
                loading={eager && i === 0 ? "eager" : "lazy"}
                fetchPriority={eager && i === 0 ? "high" : "auto"}
              />
            )}
            {slide.caption && (
              <p className="absolute inset-x-3 bottom-3 rounded-lg border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold">
                {slide.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {multi && (
        <>
          {/* Story-style progress segments */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1.5" aria-hidden>
            {slides.map((_, i) => (
              <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full border border-ink bg-paper/60">
                {i === index && <m.span layoutId={`seg-${title}`} className="absolute inset-0 bg-ink" />}
                {i < index && <span className="absolute inset-0 bg-ink/70" />}
              </span>
            ))}
          </div>
          <span className="absolute right-3 top-7 rounded-full border-2 border-ink bg-paper px-2 py-0.5 text-xs font-bold tabular-nums" aria-live="polite">
            {index + 1}/{slides.length}
          </span>

          <ArrowButton side="left" label={t.a11y.prevSlide} disabled={index === 0} onClick={() => goTo(index - 1)} />
          <ArrowButton side="right" label={t.a11y.nextSlide} disabled={index === slides.length - 1} onClick={() => goTo(index + 1)} />
        </>
      )}

      <AnimatePresence>
        {burst > 0 && (
          <m.span
            key={burst}
            className="pointer-events-none absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.2, 1, 1.1], rotate: [-12, 6, 0, 0] }}
            transition={{ type: "tween", duration: 0.8, times: [0, 0.25, 0.7, 1] }}
            onAnimationComplete={() => setBurst(0)}
            aria-hidden
          >
            <Heart weight="fill" className="size-28 text-pink drop-shadow-[5px_5px_0_var(--color-ink)]" />
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowButton({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? CaretLeft : CaretRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`brutal-press absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border-[2.5px] border-ink bg-paper shadow-brutal-sm transition-opacity disabled:pointer-events-none disabled:opacity-0 md:grid md:opacity-0 md:group-hover/carousel:opacity-100 md:focus-visible:opacity-100 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      <Icon weight="bold" className="size-5" aria-hidden />
    </button>
  );
}
