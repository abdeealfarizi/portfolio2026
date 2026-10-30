import type { Metadata } from "next";
import { getPosts, getProfile } from "@/lib/content";
import { alternatesFor } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { ProfileHeader } from "@/components/home/ProfileHeader";
import { PostGrid } from "@/components/home/PostGrid";
import { Marquee } from "@/components/ui/Marquee";

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await getI18n();
  return { alternates: alternatesFor(lang, "/") };
}

export default async function HomePage() {
  const { lang, t } = await getI18n();
  const [profile, posts] = await Promise.all([getProfile(lang), getPosts(lang)]);

  return (
    <>
      <ProfileHeader profile={profile} posts={posts} />
      {profile.skills.length > 0 && <Marquee items={profile.skills} label={t.a11y.skills} />}
      <PostGrid posts={posts} />
    </>
  );
}
