import type { NextConfig } from "next";

// `npm run export` sets STATIC_EXPORT=1 to produce a fully static site in /out
// (any static host: Netlify, S3, GitHub Pages). On Vercel, plain `next build` is used.
const isStaticExport = process.env.STATIC_EXPORT === "1";
// Sub-folder the site is served from, e.g. "/dental-template" on GitHub Pages. Empty on Vercel.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  basePath,
  images: {
    // Static export has no image optimizer; Vercel optimizes automatically.
    unoptimized: isStaticExport,
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
