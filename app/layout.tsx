import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import office from "@/config/office";
import { allThemesCss, resolveTheme, themeToCssVars, THEME_PRESETS } from "@/config/themes";
import { dentistJsonLd } from "@/lib/schema";
import { withBase } from "@/lib/format";
import "./globals.css";

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

const theme = resolveTheme(office.theme.preset, office.theme.accent);

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
 * sales demos preview other presets with ?theme=sage-blue (no rebuild needed).
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=new URLSearchParams(location.search).get('theme');if(t&&${JSON.stringify(
  THEME_PRESETS,
)}.indexOf(t)>-1){d.setAttribute('data-theme',t);d.style.cssText='';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Accent overrides are applied inline so they win over the preset stylesheet.
  const inlineVars = office.theme.accent ? (themeToCssVars(theme) as React.CSSProperties) : undefined;
  return (
    <html
      lang="en"
      data-theme={office.theme.preset}
      style={inlineVars}
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: allThemesCss() }} />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dentistJsonLd(office)).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
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
