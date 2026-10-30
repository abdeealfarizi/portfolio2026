import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowSquareOut, GithubLogo, Play } from "@phosphor-icons/react/ssr";
import { getPost, getPosts } from "@/lib/content";
import { accentBg, ratioParts } from "@/lib/theme";
import { localeHref, ogLocale } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { SlideCarousel } from "@/components/feed/SlideCarousel";
import { PostDetails } from "@/components/feed/PostDetails";
import { BrutalButton } from "@/components/ui/BrutalButton";

// Runs once per language; the post slugs are the same in both.
export async function generateStaticParams() {
  const { lang } = await getI18n();
  const posts = await getPosts(lang);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await getI18n();
  const post = await getPost(slug, lang);
  if (!post) return {};
  const description = post.caption.slice(0, 160);
  return {
    title: post.title,
    description,
    alternates: alternatesFor(lang, `/p/${slug}`),
    openGraph: { title: post.title, description, locale: ogLocale[lang], images: [post.slides[0]?.image ?? post.cover] },
    twitter: { card: "summary_large_image" },
  };
}

// Every real slug is prerendered. `instant = false` lets the page read `params` directly instead of behind
// <Suspense>, and keeps the dev-only instant-navigation warning quiet. An unknown slug renders the 404 page
// (with noindex); the first hit is generated on demand and answers 200, later hits answer 404.
export const instant = false;

export default async function PostPage({ params }: PageProps<"/[lang]/p/[slug]">) {
  const { slug } = await params;
  const { lang, t } = await getI18n();
  const posts = await getPosts(lang);
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
            <BrutalButton href={localeHref(lang, `/feed?post=${post.slug}`)} color="ink">
              <Play weight="fill" className="size-5" aria-hidden />
              {t.post.viewInFeed}
            </BrutalButton>
            {post.links.live && (
              <BrutalButton href={post.links.live} external color="paper">
                <ArrowSquareOut weight="bold" className="size-5" aria-hidden />
                {t.common.live}
              </BrutalButton>
            )}
            {post.links.repo && (
              <BrutalButton href={post.links.repo} external color="paper">
                <GithubLogo weight="bold" className="size-5" aria-hidden />
                {t.common.repo}
              </BrutalButton>
            )}
          </div>
          <nav className="grid grid-cols-2 gap-3" aria-label={t.a11y.otherPosts}>
            {prev ? (
              <Link href={localeHref(lang, `/p/${prev.slug}`)} className="brutal brutal-press flex flex-col gap-1 bg-paper p-3">
                <span className="flex items-center gap-1 text-xs font-bold uppercase">
                  <ArrowLeft weight="bold" className="size-4" aria-hidden /> {t.post.previous}
                </span>
                <span className="truncate font-bold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={localeHref(lang, `/p/${next.slug}`)} className="brutal brutal-press flex flex-col items-end gap-1 bg-paper p-3 text-right">
                <span className="flex items-center gap-1 text-xs font-bold uppercase">
                  {t.post.next} <ArrowRight weight="bold" className="size-4" aria-hidden />
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
