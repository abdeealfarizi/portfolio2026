import Image from "next/image";
import { DownloadSimple, MapPin, PaperPlaneTilt, Play, TiktokLogo } from "@phosphor-icons/react/ssr";
import type { Post, Profile } from "@/lib/types";
import { accentBg, categories, categoryMeta } from "@/lib/theme";
import { cvFile, fmt, formatViews, localeHref } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { RotatingBadge } from "@/components/ui/RotatingBadge";
import { Sticker } from "@/components/ui/Sticker";

export async function ProfileHeader({ profile, posts }: { profile: Profile; posts: Post[] }) {
  const { lang, t } = await getI18n();

  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const stats = [
    { label: t.home.statPosts, value: String(posts.length), bg: "bg-paper" },
    ...categories
      .map((c) => ({ label: t.categories[c], count: posts.filter((p) => p.category === c).length, bg: accentBg[categoryMeta[c].accent] }))
      .filter((s) => s.count > 0)
      .map((s) => ({ label: s.label, value: String(s.count), bg: s.bg })),
    ...(totalViews > 0 ? [{ label: t.home.statViews, value: formatViews(lang, totalViews), bg: "bg-lime" }] : []),
  ];
  // Show the TikTok handle from the socials list, e.g. https://tiktok.com/@kreativa.dev → @kreativa.dev
  const tiktok = profile.socials.find((s) => s.platform === "tiktok")?.url.match(/@[^/?#]+/)?.[0];

  return (
    <section className="relative overflow-hidden">
      <RotatingBadge text={t.home.badge} className="absolute right-8 top-10 hidden rotate-12 lg:block" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
        <div className="relative mx-auto w-fit md:mx-0">
          <div className="relative size-40 overflow-hidden rounded-full border-[3px] border-ink bg-lime shadow-brutal-lg sm:size-52">
            {profile.avatar && (
              <Image
                src={profile.avatar}
                alt={fmt(t.home.profilePhoto, { name: profile.name })}
                fill
                sizes="208px"
                className="object-cover"
                loading="eager"
              />
            )}
          </div>
          {profile.available && (
            <Sticker color="lime" tilt={-8} className="absolute -bottom-2 -left-4 text-base">
              <span className="size-2.5 animate-pulse rounded-full bg-ink" aria-hidden />
              {t.home.openForWork}
            </Sticker>
          )}
          {tiktok && (
            <Sticker color="pink" tilt={10} className="absolute -right-6 top-2">
              <TiktokLogo weight="bold" className="size-4" aria-hidden />
              {tiktok}
            </Sticker>
          )}
        </div>

        <div className="flex flex-col gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <p className="font-bold uppercase tracking-widest text-balance">{profile.role}</p>
            <h1 className="font-display text-[clamp(2rem,9vw,5.5rem)] font-black uppercase leading-[0.95] [overflow-wrap:anywhere] [text-shadow:0.045em_0.045em_0_var(--color-pink)]">
              {profile.name}
              <span className="text-pink [-webkit-text-stroke:2px_var(--color-ink)] [text-shadow:none]">.</span>
            </h1>
            {profile.bio && <p className="mx-auto max-w-xl text-lg text-pretty md:mx-0">{profile.bio}</p>}
            {profile.location && (
              <p className="flex items-center justify-center gap-1.5 font-bold md:justify-start">
                <MapPin weight="fill" className="size-5 text-pink" aria-hidden />
                {profile.location}
              </p>
            )}
          </div>

          <dl className="flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start [&>div]:min-w-20 [&>div]:flex-1 md:[&>div]:flex-none">
            {stats.map((s) => (
              <div key={s.label} className={`flex flex-col-reverse items-center rounded-xl border-[2.5px] border-ink px-3 py-2 shadow-brutal-sm ${s.bg}`}>
                <dt className="text-xs font-bold uppercase sm:text-sm">{s.label}</dt>
                <dd className="font-display text-2xl font-black sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <BrutalButton href={localeHref(lang, "/feed")} color="pink" size="lg">
              <Play weight="fill" className="size-5" aria-hidden />
              {t.home.scrollFeed}
            </BrutalButton>
            {/* The CV matches the page language, so a visitor reading English gets the English CV. */}
            <BrutalButton href={cvFile[lang]} download color="yellow" size="lg">
              <DownloadSimple weight="bold" className="size-5" aria-hidden />
              {t.home.downloadCv}
            </BrutalButton>
            <BrutalButton href={localeHref(lang, "/about")} color="paper" size="lg">
              <PaperPlaneTilt weight="bold" className="size-5" aria-hidden />
              {t.home.contact}
            </BrutalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
