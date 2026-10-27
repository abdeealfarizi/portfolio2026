import { getPosts, getProfile } from "@/lib/content";
import { ProfileHeader } from "@/components/home/ProfileHeader";
import { PostGrid } from "@/components/home/PostGrid";
import { Marquee } from "@/components/ui/Marquee";

export default async function HomePage() {
  const [profile, posts] = await Promise.all([getProfile(), getPosts()]);

  return (
    <>
      <ProfileHeader profile={profile} posts={posts} />
      {profile.skills.length > 0 && <Marquee items={profile.skills} />}
      <PostGrid posts={posts} />
    </>
  );
}
