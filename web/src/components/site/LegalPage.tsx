import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { legalPaths, sectionIds } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localizedPath } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { Footer } from "./Footer";
import { Header } from "./Header";

export type LegalPageKey = keyof typeof legalPaths;

/** Title and links for a legal page; kept out of search until it has real text. */
export async function legalMetadata(key: LegalPageKey): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const { title } = dict.legal[key];
  return {
    title,
    robots: { index: false, follow: true },
    ...pageMetadata({
      locale,
      path: legalPaths[key],
      title: `${title} · ${dict.meta.title}`,
      description: dict.meta.description,
      siteName: dict.meta.title,
    }),
  };
}

/** A legal page. For now a stub with a clearly marked placeholder. */
export async function LegalPage({ page }: { page: LegalPageKey }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.legal;

  return (
    <>
      <Header path={legalPaths[page]} />
      <main
        id={sectionIds.content}
        className="mx-auto w-full max-w-200 flex-1 px-gutter pt-30 pb-24"
      >
        <Eyebrow className="text-bordeaux">{t.label}</Eyebrow>
        <h1 className="mt-3.5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.02em]">
          {t[page].title}
        </h1>
        <p className="mt-8 text-xl leading-[1.6]">{t.stubNote}</p>
        <p className="mt-6 font-label text-[0.8125rem] tracking-label text-bordeaux">
          {t[page].placeholder}
        </p>
        <Link
          href={localizedPath(locale)}
          className="mt-12 inline-block text-lg underline underline-offset-4 hover:text-cherry"
        >
          {dict.errors.backHome}
        </Link>
      </main>
      <Footer />
    </>
  );
}
