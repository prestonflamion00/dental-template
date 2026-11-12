import { ImageResponse } from "next/og";
import office from "@/config/office";
import { resolveTheme } from "@/config/themes";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// /favicon.png in the office's brand colour, generated at build time.
// (A plain route rather than app/icon.tsx so the link respects a deploy sub-folder.)
export const dynamic = "force-static";
const size = { width: 64, height: 64 };

export function GET() {
  const t = resolveTheme(office.theme.preset, office.theme.accent);
  const { logo } = office.practice;
  // Their own mark (from the logo), on white, when the config has one.
  if (logo.icon) {
    const svg = readFileSync(join(process.cwd(), "public", logo.icon)).toString("base64");
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${svg}`} width={54} height={54} alt="" />
        </div>
      ),
      size,
    );
  }
  // No mark: a tooth for dental offices, else the business's first letter.
  if (office.terms && office.terms.icon !== "tooth") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: t.accent, borderRadius: 16, color: "#fff", fontSize: 40, fontWeight: 700 }}>
          {office.practice.name.charAt(0)}
        </div>
      ),
      size,
    );
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.accent,
          borderRadius: 16,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round">
          <path d="M7.2 3C4.8 3 3 4.9 3 7.4c0 2.3.9 3.7 1.6 5.2.6 1.4.8 3 1 4.6.3 2 .8 3.8 2 3.8 1.6 0 1.7-3.2 2.4-5 .4-.9 1.2-1.4 2-1.4s1.6.5 2 1.4c.7 1.8.8 5 2.4 5 1.2 0 1.7-1.8 2-3.8.2-1.6.4-3.2 1-4.6.7-1.5 1.6-2.9 1.6-5.2C21 4.9 19.2 3 16.8 3c-1.9 0-2.9 1-4.8 1S9.1 3 7.2 3Z" />
        </svg>
      </div>
    ),
    size,
  );
}
