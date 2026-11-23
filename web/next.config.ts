import path from "node:path";
import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  // The repo root has its own package-lock.json (it only starts web and studio
  // together), so tell Turbopack the app lives here.
  turbopack: {
    root: path.join(__dirname),
  },
  cacheComponents: true,
  cacheLife: {
    default: sanity,
  },
  partialPrefetching: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // The root layout sits under [lang], so unmatched URLs need a 404 page
    // that doesn't depend on it.
    globalNotFound: true,
    agentUpgrade: "security",
  },
};

export default nextConfig;
