import { LOCALE_COOKIE, type Locale } from "./config";

/** Remembers a hand-picked language for a year; the proxy reads it before looking at the browser language. */
export function rememberLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // Cookies blocked: the choice simply isn't remembered.
  }
}
