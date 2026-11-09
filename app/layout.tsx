import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Arimo, Instrument_Sans } from "next/font/google";
import { profile } from "@/content";
import { siteUrl } from "@/lib/site";
import { VIEW_BOOT_SCRIPT } from "@/lib/view";
import "./globals.css";

// Only the body font is preloaded (it carries the LCP text); the pixel and name fonts load on demand
// with size-matched fallbacks, so they don't compete with first paint.
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start", display: "swap", preload: false });
const arimo = Arimo({ weight: "700", style: "italic", subsets: ["latin"], variable: "--font-name", display: "swap", preload: false });
const instrument = Instrument_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });

const title = `${profile.name} | ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: profile.oneLiner,
  applicationName: `${profile.name} portfolio`,
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description: profile.oneLiner,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.oneLiner,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1c21",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below sets data-view on <html> before React loads.
    <html lang="en" className={`${pressStart.variable} ${arimo.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
