import type { Metadata, Viewport } from "next";
import { Lexend_Mega, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { fmt, locales, ogLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/provider";
import { getI18n } from "@/i18n/server";
import { getProfile } from "@/lib/content";
import "../globals.css";

const lexendMega = Lexend_Mega({
  variable: "--font-lexend-mega",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// Used for absolute share-preview URLs. On Vercel the production domain is provided automatically.
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

// One prerendered copy of the whole site per language.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  const profile = await getProfile(lang);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${profile.name} — Portfolio`,
      template: `%s · ${profile.name}`,
    },
    description: profile.bio || fmt(t.meta.description, { name: profile.name }),
    openGraph: {
      type: "website",
      siteName: profile.name,
      locale: ogLocale[lang],
      images: profile.avatar ? [profile.avatar] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { lang, t } = await getI18n();

  return (
    <html lang={lang} className={`${lexendMega.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-lg focus:bg-yellow focus:px-4 focus:py-2 focus:font-bold"
        >
          {t.a11y.skipToContent}
        </a>
        <LocaleProvider lang={lang} dict={t}>
          <MotionProvider>{children}</MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
