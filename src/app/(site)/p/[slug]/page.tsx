import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowSquareOut, GithubLogo, Play } from "@phosphor-icons/react/ssr";
import { getPost, getPosts } from "@/lib/content";
import { accentBg, ratioParts } from "@/lib/theme";
import { SlideCarousel } from "@/components/feed/SlideCarousel";
import { PostDetails } from "@/components/feed/PostDetails";
import { BrutalButton } from "@/components/ui/BrutalButton";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.caption.slice(0, 160),
    openGraph: { title: post.title, description: post.caption.slice(0, 160), images: [post.slides[0]?.image ?? post.cover] },
    twitter: { card: "summary_large_image" },
  };
}

export default function PostPage({ params }: PageProps<"/p/[slug]">) {
  // Known slugs are prerendered; the fallback only shows for a slug added after the build.
  return (
    <Suspense fallback={<div className="bg-dots min-h-[80dvh] border-b-[3px] border-ink bg-paper" aria-busy="true" />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: PageProps<"/p/[slug]">["params"] }) {
  const { slug } = await params;
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const prev = posts[index - 1];
  const next = posts[index + 1];
  const [w, h] = ratioParts(post.ratio);

  return (
    <div className={`bg-dots border-b-[3px] border-ink ${accentBg[post.accent]}`}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:py-14">
        <div className="brutal mx-auto w-full overflow-hidden bg-paper shadow-brutal-lg" style={{ aspectRatio: `${w} / ${h}`, maxWidth: `calc(80dvh * ${w / h})` }}>
          <SlideCarousel slides={post.slides} title={post.title} near eager sizes="(min-width: 1024px) 720px, 100vw" />
        </div>

        <div className="flex flex-col gap-5">
          <div className="brutal bg-paper p-6">
            <PostDetails post={post} />
          </div>
          <div className="flex flex-wrap gap-3">
            <BrutalButton href={`/feed?post=${post.slug}`} color="ink">
              <Play weight="fill" className="size-5" aria-hidden />
              Lihat di feed
            </BrutalButton>
            {post.links.live && (
              <BrutalButton href={post.links.live} external color="paper">
                <ArrowSquareOut weight="bold" className="size-5" aria-hidden />
                Live
              </BrutalButton>
            )}
            {post.links.repo && (
              <BrutalButton href={post.links.repo} external color="paper">
                <GithubLogo weight="bold" className="size-5" aria-hidden />
                Repo
              </BrutalButton>
            )}
          </div>
          <nav className="grid grid-cols-2 gap-3" aria-label="Post lain">
            {prev ? (
              <Link href={`/p/${prev.slug}`} className="brutal brutal-press flex flex-col gap-1 bg-paper p-3">
                <span className="flex items-center gap-1 text-xs font-bold uppercase">
                  <ArrowLeft weight="bold" className="size-4" aria-hidden /> Sebelumnya
                </span>
                <span className="truncate font-bold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/p/${next.slug}`} className="brutal brutal-press flex flex-col items-end gap-1 bg-paper p-3 text-right">
                <span className="flex items-center gap-1 text-xs font-bold uppercase">
                  Berikutnya <ArrowRight weight="bold" className="size-4" aria-hidden />
                </span>
                <span className="w-full truncate font-bold">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
