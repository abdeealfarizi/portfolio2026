import { StarFour } from "@phosphor-icons/react/ssr";

/** Infinite skill ticker. Pure CSS transform animation, stopped by reduced-motion. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 px-6 font-display text-xl font-black uppercase sm:text-2xl">
          {item}
          <StarFour weight="fill" className="size-6 text-pink" aria-hidden />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-y-[3px] border-ink bg-yellow py-4" role="region" aria-label={label}>
      <div className="flex w-max animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
