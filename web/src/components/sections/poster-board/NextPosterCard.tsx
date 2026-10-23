import { Eyebrow } from "@/components/ui/Eyebrow";
import { anchor, sectionIds } from "@/config/site";
import type { Dictionary } from "@/i18n/types";

type NextPosterCardProps = {
  t: Pick<
    Dictionary["posterBoard"],
    "nextLabel" | "nextTitle" | "nextText" | "nextLink"
  >;
};

/** The dashed empty slot at the end of the board: "the next poster goes here". */
export function NextPosterCard({ t }: NextPosterCardProps) {
  return (
    <article className="relative flex rotate-[1.5deg] flex-col items-start justify-center gap-3.5 border-3 border-dashed border-cream/85 bg-navy/55 p-8 text-cream">
      <Eyebrow size="sm">{t.nextLabel}</Eyebrow>
      <h3 className="font-display text-[2.125rem] leading-[1.05] font-semibold">
        {t.nextTitle}
      </h3>
      <p className="text-[1.1875rem] leading-normal">{t.nextText}</p>
      <a
        href={anchor(sectionIds.directions)}
        className="text-lg text-glow underline underline-offset-4 hover:text-cream"
      >
        {t.nextLink}
      </a>
    </article>
  );
}
