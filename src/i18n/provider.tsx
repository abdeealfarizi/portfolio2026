"use client";

import { createContext, useContext, useMemo } from "react";
import { fmt, formatDate, formatViews, localeHref, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/id";

type I18n = {
  lang: Locale;
  t: Dictionary;
  /** Prefixes a path with the current language: href("/about") → "/en/about" */
  href: (path?: string) => string;
  fmt: typeof fmt;
  views: (n: number) => string;
  date: (iso: string) => string;
};

const I18nContext = createContext<I18n | null>(null);

export function LocaleProvider({ lang, dict, children }: { lang: Locale; dict: Dictionary; children: React.ReactNode }) {
  const value = useMemo<I18n>(
    () => ({
      lang,
      t: dict,
      href: (path = "/") => localeHref(lang, path),
      fmt,
      views: (n) => formatViews(lang, n),
      date: (iso) => formatDate(lang, iso),
    }),
    [lang, dict],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <LocaleProvider>");
  return value;
}
