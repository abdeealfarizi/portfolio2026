import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/** First supported language in the browser's Accept-Language list (highest q first). */
function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = Number(params.find((p) => p.trim().startsWith("q="))?.trim().slice(2) ?? 1);
      return { code: tag.trim().toLowerCase().split("-")[0], q: Number.isNaN(q) ? 0 : q };
    })
    .filter((l) => l.code && l.code !== "*" && l.q > 0)
    .sort((a, b) => b.q - a.q);

  if (ranked.length === 0) return undefined;
  for (const { code } of ranked) {
    if (code === "id" || code === "in") return "id"; // "in" is the legacy code for Indonesian
    if (code === "en") return "en";
  }
  // The browser asked only for other languages (de, ja, ...): English is the safer common ground.
  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (hasLocale(pathname.split("/")[1])) return NextResponse.next();

  // 1) a language the visitor chose with the toggle, 2) the browser's language, 3) the default.
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(saved) ? saved : (fromAcceptLanguage(request.headers.get("accept-language")) ?? defaultLocale);

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  // The target depends on the visitor, so no shared cache may reuse this redirect.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  // Skip the API, the admin, Next internals and anything with a file extension (icons, images, PDFs).
  matcher: ["/((?!api|keystatic|_next|_vercel|.*\\..*).*)"],
};
