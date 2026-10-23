import { FrameCat } from "@/components/cats";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sectionIds } from "@/config/site";
import { getPosterBoard } from "@/data/workshops";
import { getSiteSettings } from "@/data/siteSettings";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { BoardStage } from "./BoardStage";
import { HiddenCat } from "./HiddenCat";
import { NextPosterCard } from "./NextPosterCard";
import { PosterCard } from "./PosterCard";

const titleId = `${sectionIds.poster}-title`;

export async function PosterBoard() {
  const locale = await getLocale();
  const [{ posterBoard: t }, posters, { promoCode }] = await Promise.all([
    getDictionary(),
    getPosterBoard(locale),
    getSiteSettings(),
  ]);

  return (
    <section
      id={sectionIds.poster}
      aria-labelledby={titleId}
      className="bg-cream pt-40 pb-30"
    >
      <SectionHeader
        titleId={titleId}
        label={t.label}
        title={t.title}
        intro={t.intro}
        className="mb-14"
        aside={
          <Eyebrow
            aria-hidden="true"
            tracking="normal"
            className="hidden items-center gap-2.5 md:flex motion-reduce:md:hidden"
          >
            {t.scrollHintBefore}
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
            {t.scrollHintAfter}
          </Eyebrow>
        }
      />

      <BoardStage
        label={t.boardLabel}
        decorations={
          <>
            <FrameCat className="absolute bottom-1 left-15 z-3 w-21.5" />
            {promoCode && (
              <HiddenCat
                label={t.hiddenCat}
                message={fill(t.catFound, { code: promoCode })}
              />
            )}
          </>
        }
      >
        {posters.map((poster, index) => (
          <PosterCard
            key={poster.id}
            locale={locale}
            poster={poster}
            index={index}
            t={t}
          />
        ))}
        <NextPosterCard t={t} />
      </BoardStage>
    </section>
  );
}
