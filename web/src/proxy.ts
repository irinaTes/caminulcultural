import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

// Romanian is served without a prefix: `/` is rewritten to `/ro`, and
// `/ro/...` redirects to the unprefixed URL so each page has one address.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (segment === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if ((locales as readonly string[]).includes(segment)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes, generated icons and anything with a
  // file extension (robots.txt, sitemap.xml, icon.svg…).
  matcher: ["/((?!_next|api|apple-icon|.*\\..*).*)"],
};
