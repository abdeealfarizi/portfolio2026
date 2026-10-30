import { defaultLocale, localeHref, locales, type Locale } from "./config";

/** Canonical + hreflang links so search engines know /id/... and /en/... are the same page in two languages. */
export function alternatesFor(lang: Locale, path = "/") {
  return {
    canonical: localeHref(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, localeHref(l, path)])),
      "x-default": localeHref(defaultLocale, path),
    },
  };
}
