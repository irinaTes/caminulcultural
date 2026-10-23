import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSection } from "@/components/sections/workshop/BookingSection";
import { WorkshopIntro } from "@/components/sections/workshop/WorkshopIntro";
import { JsonLd } from "@/components/seo/JsonLd";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { sectionIds, workshopPath } from "@/config/site";
import { absoluteUrl } from "@/config/siteUrl";
import { getSiteSettings } from "@/data/siteSettings";
import { getWorkshop, getWorkshopSlugs } from "@/data/workshops";
import { localizedPath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { pageMetadata } from "@/lib/seo";
import { workshopEvents } from "@/lib/structuredData";

type Props = PageProps<"/[lang]/atelier/[slug]">;

export async function generateStaticParams() {
  const slugs = await getWorkshopSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const workshop = await getWorkshop(slug, locale);
  if (!workshop) return {};

  const title = fill(dict.workshop.metaTitle, {
    name: workshop.name,
    verb: workshop.verb,
  });
  return {
    title,
    description: workshop.shortLine,
    ...pageMetadata({
      locale,
      path: workshopPath(slug),
      title: `${title} · ${dict.meta.title}`,
      description: workshop.shortLine,
      siteName: dict.meta.title,
      image: workshop.photo
        ? {
            url: workshop.photo.src,
            width: 1200,
            height: 900,
            alt: workshop.photo.alt,
          }
        : undefined,
    }),
  };
}

// `params` is read inside the boundary, so workshops added after the build
// still get an instant shell and are cached on their first visit.
export default function WorkshopPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-cream" />}>
      <Workshop params={params} />
    </Suspense>
  );
}

async function Workshop({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const locale = await getLocale();
  const [workshop, settings, { meta }] = await Promise.all([
    getWorkshop(slug, locale),
    getSiteSettings(),
    getDictionary(),
  ]);
  if (!workshop) notFound();

  return (
    <>
      <Header path={workshopPath(slug)} />
      <main id={sectionIds.content}>
        <WorkshopIntro workshop={workshop} />
        <BookingSection workshop={workshop} />
      </main>
      <Footer />
      {workshop.sessions.length > 0 && (
        <JsonLd
          data={workshopEvents({
            workshop,
            url: absoluteUrl(localizedPath(locale, workshopPath(slug))),
            businessName: meta.title,
            settings,
          })}
        />
      )}
    </>
  );
}
