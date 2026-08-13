import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s — ${BRAND.name}`,
  },
  description:
    "Scores tell you what happened. mSport helps you understand why. Drop in a game, player, team, article, transcript or notes and get the context, turning points, questions and angles that actually matter.",
  applicationName: BRAND.name,
  keywords: [
    "sports analysis",
    "sports journalism",
    "AI sports research",
    "interview prep",
    "podcast rundown",
    "story angles",
  ],
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "Sports, understood deeper. Understand more than the score.",
    url: BRAND.url,
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "Sports, understood deeper.",
  },
  other: {
    // Orynth site-ownership verification.
    "ory-verify": "orynth-aeb63c1c82854fefa246b9c632e50dc7",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="app-shell flex min-h-dvh w-full flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
