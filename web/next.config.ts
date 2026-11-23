import path from "node:path";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const isDev = process.env.NODE_ENV === "development";
const sanityApi = `${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io`;

/**
 * What the pages may load. Without nonces, so pages stay static: Next's own
 * inline scripts need 'unsafe-inline'. Sanity Live listens to the project's
 * API; images come from Sanity's CDN; analytics is served from our origin
 * (its debug script, in development only, from Vercel's).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  `connect-src 'self' https://${sanityApi} wss://${sanityApi}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  // The repo root has its own package-lock.json (it only starts web and studio
  // together), so tell Turbopack the app lives here.
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  cacheComponents: true,
  cacheLife: {
    default: sanity,
  },
  partialPrefetching: true,
  images: {
    // Sanity's CDN does the resizing; see the loader.
    loader: "custom",
    loaderFile: "./src/sanity/imageLoader.ts",
  },
  experimental: {
    // The root layout sits under [lang], so unmatched URLs need a 404 page
    // that doesn't depend on it.
    globalNotFound: true,
    agentUpgrade: "security",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
