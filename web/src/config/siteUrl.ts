/**
 * The site's public origin, for absolute URLs (canonical links, sitemap,
 * Open Graph, JSON-LD). Server-only in practice: the non-public variables
 * below don't reach the browser.
 *
 * NEXT_PUBLIC_SITE_URL once the domain is set; until then Vercel's production
 * URL, then localhost.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

/** Absolute URL for a path: "/en/atelier/mozaic" → "https://…/en/atelier/mozaic". */
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();
