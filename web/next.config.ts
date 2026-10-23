import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
