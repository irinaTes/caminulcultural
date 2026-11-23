import type { ImageLoaderProps } from "next/image";

/**
 * Every `next/image` on the site goes through here (`images.loaderFile`):
 * Sanity's CDN resizes the photo and picks WebP/AVIF itself, so the images
 * skip Next's optimizer (and Vercel's image quota) and stay cached on
 * Sanity's CDN. A crop asked for in the URL (w + h) keeps its shape at
 * every width. Anything not on Sanity's CDN is served as it is.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  const w = Number(url.searchParams.get("w"));
  const h = Number(url.searchParams.get("h"));
  if (w && h) url.searchParams.set("h", String(Math.round((h / w) * width)));
  url.searchParams.set("w", String(width));
  if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  url.searchParams.set("q", String(quality ?? 75));
  return url.href;
}
