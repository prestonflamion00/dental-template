import { ImageResponse } from "next/og";
import office from "@/config/office";
import { themes, withAccent } from "@/config/themes";
import { designPalettes } from "@/config/designs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Generated at build time from the office config: no design tool needed per practice.
export const dynamic = "force-static";
export const alt = office.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  // Match the site's design, so the link preview looks like the page it opens.
  const design = office.design ?? "butter";
  const t = withAccent(design === "butter" ? themes[office.theme.preset] : designPalettes[design], office.theme.accent);
  const a = office.contact.address;
  // Their logo artwork, when the config has one (it spells out the name, so it replaces the text).
  const { logo } = office.practice;
  const logoSrc = logo.image
    ? `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public", logo.image)).toString("base64")}`
    : null;
  const logoH = 150;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 64,
          background: `radial-gradient(circle at 85% 10%, ${t.orb1}, transparent 55%), radial-gradient(circle at 10% 95%, ${t.orb2}, transparent 55%), ${t.bg}`,
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: 40,
            padding: 64,
            background: "rgba(255,255,255,0.62)",
            border: "2px solid rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: t.accent, letterSpacing: 4, textTransform: "uppercase" }}>
            {`${a.city}, ${a.region}`}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {logoSrc && logo.image?.endsWith(".svg") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} height={logoH} width={Math.round((logoH * (logo.width ?? 360)) / (logo.height ?? 96))} alt="" />
            ) : (
              <div style={{ fontSize: 76, color: t.ink, lineHeight: 1.05 }}>{office.practice.name}</div>
            )}
            <div style={{ fontSize: 34, color: t.muted, marginTop: 20 }}>{office.practice.tagline}</div>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 28, color: t.ink }}>
            <div style={{ display: "flex", background: t.accent, color: "#fff", padding: "12px 28px", borderRadius: 999 }}>
              {office.terms.requestShort}
            </div>
            <div style={{ display: "flex", padding: "12px 0" }}>{office.rating ? `Rated ${office.rating.value.toFixed(1)} of 5 · ${office.contact.phone}` : office.contact.phone}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
