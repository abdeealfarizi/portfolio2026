import type { Metadata, Viewport } from "next";
import { Lexend_Mega, Space_Grotesk } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { getProfile } from "@/lib/content";
import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${profile.name} — Portfolio`,
      template: `%s · ${profile.name}`,
    },
    description: profile.bio || `Portfolio graphic design ${profile.name}.`,
    openGraph: { type: "website", siteName: profile.name, images: profile.avatar ? [profile.avatar] : undefined },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${lexendMega.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:rounded-lg focus:bg-yellow focus:px-4 focus:py-2 focus:font-bold"
        >
          Lewati ke konten
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
