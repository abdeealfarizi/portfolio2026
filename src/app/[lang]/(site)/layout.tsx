import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { getI18n } from "@/i18n/server";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const { lang } = await getI18n();
  const profile = await getProfile(lang);
  const brand = (profile.handle || profile.name.split(" ")[0]).toUpperCase();
  return (
    <>
      <SiteHeader brand={brand} />
      <main id="main">{children}</main>
      <SiteFooter name={profile.name} email={profile.email} socials={profile.socials} />
    </>
  );
}
