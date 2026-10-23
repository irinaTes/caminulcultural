import type { Metadata } from "next";
import { sectionIds } from "@/config/site";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { SanityLive } from "@/sanity/live";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return { title: meta.title, description: meta.description };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-svh flex-col">
        <a
          href={`#${sectionIds.content}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-glow focus:px-4 focus:py-2 focus:text-navy"
        >
          {dict.common.skipToContent}
        </a>
        {children}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
