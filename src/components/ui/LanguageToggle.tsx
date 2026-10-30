"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { rememberLocale } from "@/i18n/client";
import { languageNames, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

/**
 * ID | EN switch. Wide screens show both; on phones only the other language is shown, to save room.
 * Picking one is remembered in a cookie, so it wins over the browser language on later visits.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const rest = pathname.replace(/^\/(id|en)(?=\/|$)/, ""); // "/about/…" without the language prefix

  function choose(event: React.MouseEvent, next: Locale) {
    event.preventDefault();
    if (next === lang) return;
    rememberLocale(next);
    // Keep ?post=… on the feed and stay at the same scroll position.
    router.push(`/${next}${rest}${window.location.search}${window.location.hash}`, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={t.a11y.language}
      className={`flex shrink-0 rounded-full border-[2.5px] border-ink bg-paper p-0.5 shadow-brutal-sm ${className}`}
    >
      {locales.map((l) => {
        const active = l === lang;
        return (
          <Link
            key={l}
            href={`/${l}${rest}`}
            hrefLang={l}
            lang={l}
            title={languageNames[l]}
            aria-label={languageNames[l]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => choose(event, l)}
            className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-sm font-bold transition-colors ${
              active ? "bg-ink text-paper max-sm:hidden" : "hover:bg-yellow"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
