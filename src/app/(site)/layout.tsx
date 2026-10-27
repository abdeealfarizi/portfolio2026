import { SiteHeader } from "@/components/ui/SiteHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { getProfile } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const profile = await getProfile();
  const brand = (profile.handle || profile.name.split(" ")[0]).toUpperCase();
  return (
    <>
      <SiteHeader brand={brand} />
      <main id="main">{children}</main>
      <SiteFooter name={profile.name} email={profile.email} />
    </>
  );
}
