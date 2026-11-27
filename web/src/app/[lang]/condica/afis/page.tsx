import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/brand/Logo";
import { PawPrint } from "@/components/cats";
import { PrintButton } from "@/components/sections/review/PrintButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { QrCode } from "@/components/ui/QrCode";
import {
  reviewHref,
  reviewParams,
  reviewPosterPath,
  sectionIds,
} from "@/config/site";
import { absoluteUrl } from "@/config/siteUrl";
import { getWorkshopNames } from "@/data/workshops";
import { localizedPath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

export async function generateMetadata(): Promise<Metadata> {
  const { reviewForm } = await getDictionary();
  return {
    title: reviewForm.poster.metaTitle,
    robots: { index: false, follow: false },
  };
}

type Props = PageProps<"/[lang]/condica/afis">;

/**
 * An A5 sheet for the tables: "sign the guest book" and a QR code to the
 * form. "?atelier=mozaic" makes one for a workshop, with it preselected.
 */
export default function PosterPage({ searchParams }: Props) {
  return (
    <main
      id={sectionIds.content}
      className="flex-1 bg-cream text-navy print:bg-white"
    >
      <Suspense>
        <Poster searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Poster({ searchParams }: Pick<Props, "searchParams">) {
  const locale = await getLocale();
  const [{ reviewForm: t }, workshops, params] = await Promise.all([
    getDictionary(),
    getWorkshopNames(locale),
    searchParams,
  ]);
  const asked = params[reviewParams.workshop];
  const workshop = workshops.find(
    (w) => w.slug && w.slug === (Array.isArray(asked) ? asked[0] : asked),
  );
  const url = absoluteUrl(reviewHref(locale, workshop?.slug));
  const posterHref = (slug?: string | null) =>
    `${localizedPath(locale, reviewPosterPath)}${
      slug ? `?${new URLSearchParams({ [reviewParams.workshop]: slug })}` : ""
    }`;
  const p = t.poster;

  return (
    <>
      <style>{"@page { size: A5; margin: 0; }"}</style>

      {/* On screen only: which poster, and the print button. */}
      <div className="mx-auto flex max-w-150 flex-col gap-4 px-gutter pt-10 pb-8 print:hidden">
        <p className="text-lg leading-snug">{p.printHint}</p>
        <nav
          aria-label={p.pickWorkshop}
          className="flex flex-wrap gap-x-4 gap-y-2"
        >
          {[{ id: "", slug: null, name: p.anyWorkshop }, ...workshops].map(
            (w) => (
              <Link
                key={w.id}
                href={posterHref(w.slug)}
                aria-current={
                  w.slug === (workshop?.slug ?? null) ? "page" : undefined
                }
                className="text-lg underline-offset-4 hover:text-cherry aria-[current=page]:font-normal aria-[current=page]:text-cherry aria-[current=page]:underline"
              >
                {w.name}
              </Link>
            ),
          )}
        </nav>
        <div>
          <PrintButton label={p.print} />
        </div>
      </div>

      {/* The sheet: A5 on paper, a card on screen. */}
      <article className="mx-auto mb-16 flex aspect-[148/210] w-full max-w-[148mm] flex-col items-center justify-between border-2 border-navy bg-paper px-[10mm] py-[12mm] text-center shadow-[8px_8px_0_var(--color-navy)] print:m-0 print:h-[210mm] print:w-[148mm] print:max-w-none print:border-0 print:shadow-none">
        <Logo title="Căminul Cultural 31" className="h-[28mm] w-auto" />
        <div className="flex flex-col items-center gap-[3mm]">
          <Eyebrow className="text-bordeaux">{t.label}</Eyebrow>
          <h1 className="font-display text-[clamp(2.25rem,8vw,3.25rem)] leading-none font-semibold tracking-[-0.02em]">
            {p.title}
          </h1>
          {workshop && (
            <p className="font-display text-[1.375rem] italic">
              {fill(p.forWorkshop, { name: workshop.name })}
            </p>
          )}
        </div>
        <QrCode
          value={url}
          label={fill(p.qrLabel, { url })}
          className="w-[62mm] max-w-[70%] text-navy"
        />
        <div className="flex flex-col items-center gap-[2mm]">
          <p className="text-xl leading-snug">{p.text}</p>
          <p className="font-label text-[0.75rem] tracking-[0.08em] break-all text-navy/80">
            {url.replace(/^https?:\/\//, "")}
          </p>
          <PawPrint aria-hidden="true" className="mt-[2mm] size-8 -rotate-12" />
        </div>
      </article>
    </>
  );
}
