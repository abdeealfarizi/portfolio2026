// Pure helpers shared by the proxy, server components and client components. No server-only imports here.

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

/** Set when the visitor picks a language by hand; it beats the browser's language on later visits. */
export const LOCALE_COOKIE = "locale";

export function hasLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Each language is named in itself, the usual convention for language switchers. */
export const languageNames: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English" };
export const intlLocale: Record<Locale, string> = { id: "id-ID", en: "en-GB" };
export const ogLocale: Record<Locale, string> = { id: "id_ID", en: "en_US" };

/** One CV per language; the matching one is offered on each language's pages. */
export const cvFile: Record<Locale, string> = {
  id: "/cv/Abdee_Raja_Alfarizi_CV_Graphic_Designer_ID.pdf",
  en: "/cv/Abdee_Raja_Alfarizi_CV_Graphic_Designer_EN.pdf",
};

export function localeHref(lang: Locale, path = "/") {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Fills {name}-style placeholders. Dictionary entries are plain strings so they can cross to client components. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

/** 1234567 → "1,2 jt" (id) / "1.2M" (en) */
export function formatViews(lang: Locale, n: number) {
  return new Intl.NumberFormat(intlLocale[lang], { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatDate(lang: Locale, date: string) {
  return new Intl.DateTimeFormat(intlLocale[lang], { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
