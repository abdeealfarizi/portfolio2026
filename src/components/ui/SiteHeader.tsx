"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Play, User } from "@phosphor-icons/react";

const links = [
  { href: "/", label: "Work", Icon: House },
  { href: "/feed", label: "Feed", Icon: Play },
  { href: "/about", label: "About", Icon: User },
] as const;

export function SiteHeader({ brand }: { brand: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-ink bg-paper">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4" aria-label="Utama">
        <Link href="/" className="brutal brutal-press shrink-0 bg-pink px-2.5 py-1.5 font-display text-xs font-black sm:px-3 sm:text-base">
          {brand}
          <span className="text-paper [-webkit-text-stroke:1px_var(--color-ink)]">.</span>
        </Link>
        <ul className="flex items-center gap-0.5 sm:gap-2">
          {links.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-1.5 rounded-full border-[2.5px] px-2.5 font-bold transition-colors sm:px-3 ${
                    active ? "border-ink bg-ink text-paper" : "border-transparent hover:border-ink"
                  }`}
                >
                  <Icon weight="bold" className="hidden size-5 sm:block" aria-hidden />
                  <span className="text-sm sm:text-base">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
