import Image from "next/image";
import { Play, PaperPlaneTilt, MapPin, TiktokLogo } from "@phosphor-icons/react/ssr";
import type { Post, Profile } from "@/lib/types";
import { accentBg, categories, categoryMeta, formatViews } from "@/lib/theme";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { Sticker } from "@/components/ui/Sticker";

export function ProfileHeader({ profile, posts }: { profile: Profile; posts: Post[] }) {
  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const stats = [
    { label: "Posts", value: String(posts.length), bg: "bg-paper" },
    ...categories
      .map((c) => ({ label: categoryMeta[c].label, value: posts.filter((p) => p.category === c).length, bg: accentBg[categoryMeta[c].accent] }))
      .filter((s) => s.value > 0)
      .map((s) => ({ ...s, value: String(s.value) })),
    ...(totalViews > 0 ? [{ label: "Views", value: formatViews(totalViews), bg: "bg-lime" }] : []),
  ];
  // Show the TikTok handle from the socials list, e.g. https://tiktok.com/@kreativa.dev → @kreativa.dev
  const tiktok = profile.socials.find((s) => s.platform === "tiktok")?.url.match(/@[^/?#]+/)?.[0];

  return (
    <section className="bg-dots relative overflow-hidden border-b-[3px] border-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
        <div className="relative mx-auto w-fit md:mx-0">
          <div className="relative size-40 overflow-hidden rounded-full border-[3px] border-ink bg-lime shadow-brutal-lg sm:size-52">
            {profile.avatar && (
              <Image src={profile.avatar} alt={`Foto profil ${profile.name}`} fill sizes="208px" className="object-cover" loading="eager" />
            )}
          </div>
          {profile.available && (
            <Sticker color="lime" tilt={-8} className="absolute -bottom-2 -left-4 text-base">
              <span className="size-2.5 animate-pulse rounded-full bg-ink" aria-hidden />
              Open for work
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
            <p className="font-bold uppercase tracking-widest">{profile.role}</p>
            <h1 className="font-display text-[clamp(2rem,9vw,5.5rem)] font-black uppercase leading-[0.95] [overflow-wrap:anywhere]">
              {profile.name}
              <span className="text-pink [-webkit-text-stroke:2px_var(--color-ink)]">.</span>
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
            <BrutalButton href="/feed" color="pink" size="lg">
              <Play weight="fill" className="size-5" aria-hidden />
              Scroll feed
            </BrutalButton>
            <BrutalButton href="/about" color="paper" size="lg">
              <PaperPlaneTilt weight="bold" className="size-5" aria-hidden />
              Kontak
            </BrutalButton>
          </div>
        </div>
      </div>
    </section>
  );
}
