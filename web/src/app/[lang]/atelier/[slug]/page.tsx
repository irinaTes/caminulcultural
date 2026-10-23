import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSection } from "@/components/sections/workshop/BookingSection";
import { WorkshopIntro } from "@/components/sections/workshop/WorkshopIntro";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { sectionIds, workshopPath } from "@/config/site";
import { getWorkshop, getWorkshopSlugs } from "@/data/workshops";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

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

  return {
    title: `${fill(dict.workshop.metaTitle, { name: workshop.name, verb: workshop.verb })} · ${dict.meta.title}`,
    description: workshop.shortLine,
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
  const workshop = await getWorkshop(slug, await getLocale());
  if (!workshop) notFound();

  return (
    <>
      <Header path={workshopPath(slug)} />
      <main id={sectionIds.content}>
        <WorkshopIntro workshop={workshop} />
        <BookingSection workshop={workshop} />
      </main>
      <Footer />
    </>
  );
}
