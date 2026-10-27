import "server-only";
import { cacheLife } from "next/cache";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";
import type { Post, Profile } from "./types";

const reader = createReader(process.cwd(), keystaticConfig);
// Content only changes with a new deploy (Keystatic commits to the repo), so production caches it for
// the life of the build. In dev, posts saved from /keystatic should show up after a refresh: revalidate
// is short but stale/expire stay long, otherwise Next treats the data as request-time and pages stop being static.
function contentLifetime() {
  if (process.env.NODE_ENV === "development") cacheLife({ stale: 300, revalidate: 1, expire: 31_536_000 });
  else cacheLife("max");
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  contentLifetime();
  const entries = await reader.collections.posts.all();
  const posts: Post[] = entries.map(({ slug, entry }) => ({
    slug,
    title: entry.title,
    category: entry.category,
    date: entry.date,
    featured: entry.featured,
    views: entry.views,
    source: entry.source,
    accent: entry.accent,
    ratio: entry.ratio,
    cover: entry.cover,
    slides: entry.slides.map((s) => ({ image: s.image, alt: s.alt, caption: s.caption })),
    caption: entry.caption,
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

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function getProfile(): Promise<Profile> {
  "use cache";
  contentLifetime();
  const p = await reader.singletons.profile.read();
  return {
    name: p?.name ?? "Portfolio",
    handle: p?.handle ?? "",
    role: p?.role ?? "",
    avatar: p?.avatar ?? null,
    bio: p?.bio ?? "",
    location: p?.location ?? "",
    email: p?.email ?? "",
    available: p?.available ?? false,
    skills: p ? [...p.skills] : [],
    socials: p ? p.socials.map((s) => ({ platform: s.platform, url: s.url })) : [],
  };
}
