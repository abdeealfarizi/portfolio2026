import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, DownloadSimple, EnvelopeSimple } from "@phosphor-icons/react/ssr";
import { getProfile } from "@/lib/content";
import type { Accent } from "@/lib/types";
import { cvFile, fmt, languageNames, locales } from "@/i18n/config";
import { alternatesFor } from "@/i18n/seo";
import { getI18n } from "@/i18n/server";
import { Sticker } from "@/components/ui/Sticker";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { socialIcons, socialNames } from "@/components/ui/socialIcons";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.aboutTitle, alternates: alternatesFor(lang, "/about") };
}

const chipColors: Accent[] = ["pink", "yellow", "lime", "orange", "purple"];

export default async function AboutPage() {
  const { lang, t } = await getI18n();
  const profile = await getProfile(lang);
  const otherLang = locales.find((l) => l !== lang) ?? lang;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:py-16">
      <section className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-col gap-5">
          <Sticker color="lime" tilt={-3} className="w-fit">
            {t.about.greeting}
          </Sticker>
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] text-balance sm:text-6xl">
            {fmt(t.about.intro, { name: profile.name })} <span className="bg-pink px-2">{profile.role}</span>
          </h1>
          {profile.bio && <p className="max-w-2xl text-lg text-pretty">{profile.bio}</p>}
        </div>
        {profile.avatar && (
          <div className="brutal relative mx-auto aspect-square w-56 rotate-3 overflow-hidden bg-yellow shadow-brutal-lg sm:w-72">
            <Image src={profile.avatar} alt={fmt(t.home.profilePhoto, { name: profile.name })} fill sizes="288px" className="object-cover" />
          </div>
        )}
      </section>

      <section aria-labelledby="focus-title" className="flex flex-col gap-5">
        <h2 id="focus-title" className="font-display text-2xl font-black uppercase sm:text-3xl">
          {t.about.focusTitle}
        </h2>
        <div className="grid gap-5 md:grid-cols-[3fr_2fr]">
          <article className="brutal flex flex-col gap-3 bg-orange p-6 sm:p-8">
            <Sticker color="paper" tilt={-3} className="w-fit">
              {t.about.mainFocus}
            </Sticker>
            <h3 className="font-display text-xl font-black uppercase sm:text-2xl">{t.about.designTitle}</h3>
            <p className="text-lg text-pretty">{t.about.designText}</p>
          </article>
          <article className="brutal flex flex-col gap-3 bg-paper p-6 sm:p-8">
            <Sticker color="lime" tilt={2} className="w-fit">
              {t.about.partTime}
            </Sticker>
            <h3 className="font-display text-xl font-black uppercase sm:text-2xl">{t.about.coderTitle}</h3>
            <p className="text-lg text-pretty">{t.about.coderText}</p>
          </article>
        </div>
      </section>

      {profile.skills.length > 0 && (
        <section aria-labelledby="skills-title" className="flex flex-col gap-5">
          <h2 id="skills-title" className="font-display text-2xl font-black uppercase sm:text-3xl">
            {t.about.skillsTitle}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {profile.skills.map((skill, i) => (
              <li key={skill}>
                <Sticker color={chipColors[i % chipColors.length]} tilt={i % 2 ? 2 : -2} className="px-4 py-2 text-base">
                  {skill}
                </Sticker>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="contact-title" className="brutal flex flex-col gap-6 bg-blue p-6 text-white sm:p-10">
        <h2 id="contact-title" className="font-display text-2xl font-black uppercase sm:text-4xl">
          {t.about.contactTitle}
        </h2>
        <p className="max-w-xl text-lg">{t.about.contactText}</p>
        <div className="flex flex-wrap gap-3">
          {profile.email && (
            <BrutalButton href={`mailto:${profile.email}`} color="yellow" size="lg" className="max-w-full text-sm sm:text-lg">
              <EnvelopeSimple weight="bold" className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{profile.email}</span>
            </BrutalButton>
          )}
          <BrutalButton href={cvFile[lang]} download color="lime" size="lg">
            <DownloadSimple weight="bold" className="size-5" aria-hidden />
            {t.cv.download}
          </BrutalButton>
          {profile.socials.map((s) => {
            const IconCmp = socialIcons[s.platform] ?? ArrowUpRight;
            return (
              <BrutalButton key={s.url} href={s.url} external color="paper" size="lg">
                <IconCmp weight="bold" className="size-6" aria-hidden />
                {socialNames[s.platform] ?? s.platform}
              </BrutalButton>
            );
          })}
        </div>
        {/* The CV also exists in the other language, for visitors who need it. */}
        <a href={cvFile[otherLang]} download className="w-fit font-bold underline decoration-2 underline-offset-4">
          {fmt(t.cv.alsoIn, { language: languageNames[otherLang] })}
        </a>
      </section>
    </div>
  );
}
