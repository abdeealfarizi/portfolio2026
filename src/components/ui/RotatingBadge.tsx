import { StarFour } from "@phosphor-icons/react/ssr";

/**
 * Round sticker with text running around it. Decorative; the spin is a CSS transform, so it costs almost nothing.
 * `className` positions the wrapper (e.g. "absolute right-8 top-10"), so the badge itself stays position-agnostic.
 */
export function RotatingBadge({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="relative size-32">
        <div className="absolute inset-0 animate-spin-slow rounded-full border-[3px] border-ink bg-lime shadow-brutal">
          <svg viewBox="0 0 120 120" className="size-full">
            <defs>
              <path id="badge-ring" d="M60,60 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
            </defs>
            <text fontSize="8.5" fontWeight="900" fill="#0a0a0a" fontFamily="var(--font-lexend-mega), sans-serif">
              {/* textLength stretches the text to run exactly once around the ring (circumference ≈ 257.6) */}
              <textPath href="#badge-ring" textLength="254" lengthAdjust="spacing">
                {text}
              </textPath>
            </text>
          </svg>
        </div>
        <div className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-pink">
          <StarFour weight="fill" className="size-6" />
        </div>
      </div>
    </div>
  );
}
