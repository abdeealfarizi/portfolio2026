import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/id";

// Only the visitor's language is loaded on the server.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  id: () => import("./dictionaries/id").then((m) => m.id),
  en: () => import("./dictionaries/en").then((m) => m.en),
};

/** The [lang] route segment, validated. Callable from any Server Component. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getI18n() {
  const locale = await getLocale();
  return { lang: locale, t: await dictionaries[locale]() };
}
