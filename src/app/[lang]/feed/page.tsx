import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { alternatesFor } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { Feed } from "@/components/feed/Feed";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.feedTitle, description: t.meta.feedDescription, alternates: alternatesFor(lang, "/feed") };
}

export default async function FeedPage() {
  const { lang } = await getI18n();
  const posts = await getPosts(lang);
  return <Feed posts={posts} />;
}
