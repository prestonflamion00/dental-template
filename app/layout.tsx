import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import office from "@/config/office";
import { allThemesCss, resolveTheme, themeToCssVars, THEME_PRESETS } from "@/config/themes";
import { allDesignsCss, designPalettes, DESIGNS } from "@/config/designs";
import { dentistJsonLd } from "@/lib/schema";
import { withBase } from "@/lib/format";
import "./globals.css";
import "./designs.css";

// Self-hosted variable fonts (no runtime requests to Google).
const body = localFont({
  src: "../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
});
const display = localFont({
  src: "../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
});

// Fonts for the other designs. Browsers only download the ones the active design uses.
const crispSans = localFont({
  src: "../node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
  variable: "--font-crisp",
  weight: "100 900",
  display: "swap",
});
const honeyDisplay = localFont({
  src: "../node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2",
  variable: "--font-honey-display",
  weight: "300 700",
  display: "swap",
});
const honeyBody = localFont({
  src: "../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2",
  variable: "--font-honey-body",
  weight: "200 1000",
  display: "swap",
});
const midnightDisplay = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-normal.woff2", style: "normal" },
    { path: "../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-italic.woff2", style: "italic" },
  ],
  variable: "--font-midnight-display",
  weight: "400 900",
  display: "swap",
});
const fontVars = [body, display, crispSans, honeyDisplay, honeyBody, midnightDisplay].map((f) => f.variable).join(" ");

const design = office.design ?? "butter";
// Butter takes its colours from the theme preset (plus any accent override); the other designs bring their own.
const theme = design === "butter" ? resolveTheme(office.theme.preset, office.theme.accent) : designPalettes[design];

export const metadata: Metadata = {
  metadataBase: new URL(office.seo.siteUrl),
  title: { default: office.seo.title, template: `%s | ${office.practice.name}` },
  description: office.seo.description,
  applicationName: office.practice.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: office.practice.name,
    title: office.seo.title,
    description: office.seo.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: office.seo.title, description: office.seo.description },
  formatDetection: { telephone: true, address: true },
  // Demo builds (scripts/build-all.mjs) are kept out of search engines.
  ...(process.env.NEXT_PUBLIC_NOINDEX === "1" ? { robots: { index: false, follow: false } } : {}),
  icons: { icon: { url: withBase("/favicon.png"), type: "image/png" } },
};

export const viewport: Viewport = {
  themeColor: theme.bg,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Runs before paint: marks JS as available (enables scroll-reveal) and lets
 * sales demos preview other presets with ?theme=sage-blue and other designs with ?design=crisp (no rebuild needed).
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var q=new URLSearchParams(location.search),t=q.get('theme'),g=q.get('design');if(t&&${JSON.stringify(
  THEME_PRESETS,
)}.indexOf(t)>-1){d.setAttribute('data-theme',t);d.style.cssText='';}if(g&&${JSON.stringify(DESIGNS)}.indexOf(g)>-1){d.setAttribute('data-design',g);d.style.cssText='';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Accent overrides are applied inline so they win over the preset stylesheet.
  const inlineVars = design === "butter" && office.theme.accent ? (themeToCssVars(theme) as React.CSSProperties) : undefined;
  return (
    <html
      lang="en"
      data-theme={office.theme.preset}
      data-design={design}
      style={inlineVars}
      className={fontVars}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: `${allThemesCss()}\n${allDesignsCss()}` }} />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd(office)).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        {office.fictional && (
          <p className="demo-banner">
            Demo website: {office.practice.name} is a fictional practice, not a real dental office.
          </p>
        )}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <div className="ambient" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
