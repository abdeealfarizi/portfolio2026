import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/ssr";
import type { Social } from "@/lib/types";
import { cvFile } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { BrutalButton } from "./BrutalButton";
import { socialIcons, socialNames } from "./socialIcons";

export async function SiteFooter({ name, email, socials }: { name: string; email: string; socials: Social[] }) {
  const { lang, t } = await getI18n();

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:py-20">
        <p className="font-display text-3xl font-black uppercase leading-tight text-balance sm:text-5xl">
          {t.footer.ctaLead} <span className="text-lime">{t.footer.ctaAccent}</span>
          {t.footer.ctaTail}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {email && (
            <BrutalButton
              href={`mailto:${email}`}
              color="lime"
              size="lg"
              className="max-w-full text-sm shadow-[6px_6px_0_0_var(--color-pink)] sm:text-lg"
            >
              <span className="truncate">{email}</span>
              <ArrowUpRight weight="bold" className="size-5 shrink-0" aria-hidden />
            </BrutalButton>
          )}
          <BrutalButton href={cvFile[lang]} download color="paper" size="lg" className="shadow-[6px_6px_0_0_var(--color-pink)]">
            <DownloadSimple weight="bold" className="size-5" aria-hidden />
            {t.cv.download}
          </BrutalButton>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-paper/70">© {name}</p>
          {socials.length > 0 && (
            <ul className="flex gap-3" aria-label={t.footer.social}>
              {socials.map((s) => {
                const IconCmp = socialIcons[s.platform] ?? ArrowUpRight;
                const label = socialNames[s.platform] ?? s.platform;
                return (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="brutal-press grid size-12 place-items-center rounded-full border-[2.5px] border-paper bg-paper text-ink shadow-[3px_3px_0_0_var(--color-pink)]"
                    >
                      <IconCmp weight="bold" className="size-6" aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
