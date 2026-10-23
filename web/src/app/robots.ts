import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/siteUrl";

export default function robots(): MetadataRoute.Robots {
  // Keep previews (Vercel preview deployments) out of search results.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dev", "/en/dev"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
