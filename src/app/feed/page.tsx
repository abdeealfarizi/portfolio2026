import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { Feed } from "@/components/feed/Feed";

export const metadata: Metadata = {
  title: "Feed",
  description: "Scroll karya graphic design, carousel, dan foto seperti feed sosial media.",
};

export default async function FeedPage() {
  const posts = await getPosts();
  return <Feed posts={posts} />;
}
