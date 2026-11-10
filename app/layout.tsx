import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Arimo, Instrument_Sans, Syne } from "next/font/google";
import { profile } from "@/content";
import { siteUrl } from "@/lib/site";
import { VIEW_BOOT_SCRIPT } from "@/lib/view";
import "./globals.css";

// The body and pixel fonts are preloaded (Skim's headings, pills and keys are all pixel text, so a late
// swap would shift them); the name font loads on demand with a size-matched fallback.
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start", display: "swap" });
const arimo = Arimo({ weight: "700", style: "italic", subsets: ["latin"], variable: "--font-name", display: "swap", preload: false });
// Skim face headings. Google Fonts has no italic Syne, so the CSS asks for italic and the
// browser slants the 800 weight (same as the reference design).
const syne = Syne({ weight: "800", subsets: ["latin"], variable: "--font-syne", display: "swap", preload: false });
const instrument = Instrument_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-instrument", display: "swap" });

const title = `${profile.name} | ${profile.role}`;

// metadataBase is the origin only: Next already prefixes the image files with the base path,
// so including /Portfolio here as well would double it. The page URL is spelled out in full.
const pageUrl = `${siteUrl}/`;

export const metadata: Metadata = {
  metadataBase: new URL(new URL(siteUrl).origin),
  title,
  description: profile.oneLiner,
  applicationName: `${profile.name} portfolio`,
  authors: [{ name: profile.name, url: profile.github }],
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    url: pageUrl,
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
    <html lang="en" className={`${pressStart.variable} ${arimo.variable} ${syne.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: VIEW_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
