import { localeHref } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-pink [-webkit-text-stroke:3px_var(--color-ink)]">404</p>
      <h1 className="font-display text-2xl font-black uppercase">{t.notFound.title}</h1>
      <BrutalButton href={localeHref(lang, "/")} color="lime">
        {t.notFound.back}
      </BrutalButton>
    </div>
  );
}
