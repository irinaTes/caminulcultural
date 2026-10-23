import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RichText } from "@/components/ui/RichText";
import { sectionHref, sectionIds } from "@/config/site";
import type { WorkshopDetail } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

type WorkshopIntroProps = { workshop: WorkshopDetail };

/** Photo, title, description and the practical facts of one workshop. */
export async function WorkshopIntro({ workshop }: WorkshopIntroProps) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.workshop;

  const facts = [
    {
      label: t.duration,
      value: fill(t.durationValue, { hours: workshop.durationHours }),
    },
    {
      label: t.price,
      value: fill(t.priceValue, { price: workshop.priceLei ?? "[PREȚ]" }),
    },
    ...(workshop.capacity
      ? [
          {
            label: t.capacity,
            value: fill(t.capacityValue, { n: workshop.capacity }),
          },
        ]
      : []),
  ];

  return (
    <section
      aria-labelledby="workshop-title"
      className="bg-cream px-gutter pt-14 pb-20 text-navy md:pt-20"
    >
      <div className="mx-auto flex max-w-content flex-col gap-10">
        <Link
          href={sectionHref(locale, sectionIds.poster)}
          className="self-start font-label text-xs tracking-label uppercase underline-offset-4 hover:underline"
        >
          <span aria-hidden="true">← </span>
          {t.back}
        </Link>

        <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
          <div className="w-full max-w-140 flex-[1_1_22rem] rotate-[-1.5deg] bg-cream p-4 shadow-[0_16px_30px_rgba(0,0,0,0.25)]">
            {workshop.photo ? (
              <Image
                src={workshop.photo.src}
                alt={workshop.photo.alt}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 35rem, 100vw"
                placeholder={workshop.photo.lqip ? "blur" : "empty"}
                blurDataURL={workshop.photo.lqip ?? undefined}
                preload
                className="h-auto w-full"
              />
            ) : (
              <div
                role="img"
                aria-label={fill(dict.posterBoard.photoAlt, {
                  name: workshop.name.toLowerCase(),
                })}
                className="flex aspect-4/3 items-center justify-center bg-[repeating-linear-gradient(135deg,#E7D3A8_0_16px,#DFC793_16px_32px)]"
              >
                <Eyebrow
                  inline
                  size="xs"
                  className="bg-cream px-2.5 py-1.75 text-navy"
                >
                  {fill(dict.posterBoard.photoPlaceholder, {
                    name: workshop.name,
                  })}
                </Eyebrow>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-[1.2_1_26rem] flex-col gap-5">
            <Eyebrow className="text-bordeaux">
              {fill(dict.posterBoard.kicker, {
                name: workshop.name,
                hours: workshop.durationHours,
              })}
            </Eyebrow>
            <h1
              id="workshop-title"
              className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.02em] text-cherry"
            >
              {workshop.verb}
            </h1>
            <p className="max-w-150 text-[1.375rem] leading-[1.5]">
              {workshop.shortLine}
            </p>
            {workshop.description.length > 0 && (
              <RichText value={workshop.description} className="max-w-150" />
            )}

            <dl className="mt-3 grid max-w-150 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-x-8 gap-y-5 border-t border-dashed border-navy pt-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <Eyebrow as="dt" size="xs">
                    {fact.label}
                  </Eyebrow>
                  <dd className="text-lg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
