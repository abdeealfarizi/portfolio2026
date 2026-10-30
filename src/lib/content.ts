import "server-only";
import { cacheLife } from "next/cache";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { Locale } from "@/i18n/config";
import type { Post, Profile } from "./types";

const reader = createReader(process.cwd(), keystaticConfig);
// Content only changes with a new deploy (Keystatic commits to the repo), so production caches it for
// the life of the build. In dev, posts saved from /keystatic should show up after a refresh: revalidate
// is short but stale/expire stay long, otherwise Next treats the data as request-time and pages stop being static.
function contentLifetime() {
  if (process.env.NODE_ENV === "development") cacheLife({ stale: 300, revalidate: 1, expire: 31_536_000 });
  else cacheLife("max");
}

/** English text when the visitor reads English and a translation exists; Indonesian otherwise. */
const pick = (lang: Locale, id: string, en: string) => (lang === "en" && en.trim() ? en : id);

// `lang` is an argument, so it is part of the cache key: one cached result per language.
export async function getPosts(lang: Locale): Promise<Post[]> {
  "use cache";
  contentLifetime();
  const entries = await reader.collections.posts.all();
  const posts: Post[] = entries.map(({ slug, entry }) => ({
    slug,
    title: pick(lang, entry.title, entry.titleEn),
    category: entry.category,
    date: entry.date,
    featured: entry.featured,
    views: entry.views,
    source: entry.source,
    accent: entry.accent,
    ratio: entry.ratio,
    cover: entry.cover,
    slides: entry.slides.map((s) => ({ image: s.image, alt: pick(lang, s.alt, s.altEn), caption: s.caption })),
    caption: pick(lang, entry.caption, entry.captionEn),
    tags: [...entry.tags],
    stack: [...entry.stack],
    links: { live: entry.links.live, repo: entry.links.repo },
  }));

  // Pinned first, then top-viewed, then newest.
  return posts.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) || (b.views ?? -1) - (a.views ?? -1) || b.date.localeCompare(a.date),
  );
}

export async function getPost(slug: string, lang: Locale): Promise<Post | undefined> {
  return (await getPosts(lang)).find((p) => p.slug === slug);
}

export async function getProfile(lang: Locale): Promise<Profile> {
  "use cache";
  contentLifetime();
  const p = await reader.singletons.profile.read();
  const skillsEn = p?.skillsEn ?? [];
  return {
    name: p?.name ?? "Portfolio",
    handle: p?.handle ?? "",
    role: p ? pick(lang, p.role, p.roleEn) : "",
    avatar: p?.avatar ?? null,
    bio: p ? pick(lang, p.bio, p.bioEn) : "",
    location: p?.location ?? "",
    email: p?.email ?? "",
    available: p?.available ?? false,
    skills: p ? (lang === "en" && skillsEn.length ? [...skillsEn] : [...p.skills]) : [],
    socials: p ? p.socials.map((s) => ({ platform: s.platform, url: s.url })) : [],
  };
}
