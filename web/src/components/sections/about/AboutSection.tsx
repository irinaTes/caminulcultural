import Image from "next/image";
import { ApprovedStamp } from "@/components/cats";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds, sectionLabel } from "@/config/site";
import { getTeam } from "@/data/team";
import type { TeamMember } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { cn } from "@/lib/cn";

const titleId = `${sectionIds.about}-title`;
const manifestoId = `${sectionIds.about}-manifesto`;
const boardId = `${sectionIds.about}-board`;

/** Portraits hang a little crooked, each its own way. */
const FRAME_TILTS = [-2, 1.5, -1, 2];

type Text = Awaited<ReturnType<typeof getDictionary>>["about"];

export async function AboutSection() {
  const locale = await getLocale();
  const [{ about: t }, team] = await Promise.all([
    getDictionary(),
    getTeam(locale),
  ]);

  // Nobody is made up: until the editor adds the team, two empty frames.
  const portraits: (TeamMember | null)[] =
    team.length > 0 ? team : [null, null];

  return (
    <section
      id={sectionIds.about}
      aria-labelledby={titleId}
      className="bg-bordeaux px-gutter py-42.5 text-cream max-md:py-30"
    >
      <div className="mx-auto flex max-w-350 flex-col gap-20 max-md:gap-14">
        <div className="flex max-w-170 flex-col gap-5.5">
          <SectionHeading
            titleId={titleId}
            tone="dark"
            label={sectionLabel(sectionIds.about, t.label)}
            title={
              <>
                {t.title}
                <br />
                <em className="font-light text-glow">{t.titleAccent}</em>
              </>
            }
          />
          <p className="text-xl leading-[1.6]">{t.intro}</p>
        </div>

        <div className="flex flex-wrap items-start gap-22 max-md:gap-16">
          <Manifesto t={t} />

          <section
            aria-labelledby={boardId}
            className="flex min-w-0 flex-[1_1_22rem] flex-col gap-10"
          >
            <h3
              id={boardId}
              className="font-label text-[0.8125rem] tracking-label-wide text-glow uppercase"
            >
              {t.boardTitle}
            </h3>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-x-10 gap-y-14">
              {portraits.map((member, index) => (
                <Portrait
                  key={member?.id ?? `placeholder-${index}`}
                  member={member}
                  tilt={FRAME_TILTS[index % FRAME_TILTS.length]}
                  t={t}
                />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}

/** The house rules, typed on paper and pinned up with the stamp. */
function Manifesto({ t }: { t: Text }) {
  return (
    <article
      aria-labelledby={manifestoId}
      className="relative min-w-0 flex-[1_1_30rem] -rotate-[0.8deg] border-2 border-navy bg-paper px-10 py-11 text-navy shadow-[8px_8px_0_var(--color-navy)] max-sm:px-5.5 max-sm:py-8"
    >
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 -ml-2.25 size-4.5 rounded-full bg-cherry shadow-[0_3px_5px_rgba(0,0,0,0.45)]"
      />
      <header className="flex flex-col items-center gap-2.5 border-b-2 border-navy pb-6 text-center">
        <Eyebrow size="sm" className="text-bordeaux">
          {t.manifestoLabel}
        </Eyebrow>
        <h3
          id={manifestoId}
          className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-semibold"
        >
          {t.manifestoTitle}
        </h3>
      </header>

      <ol className="flex flex-col divide-y divide-navy/20">
        {t.articles.map((article, index) => (
          <li
            key={article.title}
            className="grid grid-cols-[4.5rem_1fr] gap-x-4 py-5.5 max-sm:grid-cols-1 max-sm:gap-y-1.5"
          >
            <Eyebrow inline size="sm" className="pt-1.5 text-bordeaux">
              {fill(t.article, { n: index + 1 })}
            </Eyebrow>
            <p className="text-[1.0625rem] leading-normal">
              <strong className="font-display text-[1.375rem] leading-snug font-semibold">
                {article.title}
              </strong>{" "}
              {article.text}
            </p>
          </li>
        ))}
      </ol>

      <footer className="relative flex min-h-24 items-end border-t-2 border-navy pt-6">
        <p className="max-w-[60%] font-display text-lg italic">{t.signed}</p>
        <ApprovedStamp
          label={t.stamp}
          className="pointer-events-none absolute right-2 -bottom-4 size-26 -rotate-12 opacity-85 max-sm:size-21"
        />
      </footer>
    </article>
  );
}

/** A framed portrait with a brass name plate, or an empty frame for now. */
function Portrait({
  member,
  tilt,
  t,
}: {
  member: TeamMember | null;
  tilt: number;
  t: Text;
}) {
  const name = member?.name || t.namePlaceholder;

  return (
    <li className="flex flex-col items-center gap-6">
      <div
        style={{ rotate: `${tilt}deg` }}
        className="w-full max-w-72 border-6 border-glow bg-cream p-3.5 shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
      >
        <div className="relative aspect-square overflow-hidden border-2 border-navy bg-navy-deep">
          {member?.photo ? (
            <Image
              src={member.photo.src}
              alt={member.photo.alt || fill(t.portraitAlt, { name })}
              fill
              sizes="18rem"
              placeholder={member.photo.lqip ? "blur" : "empty"}
              blurDataURL={member.photo.lqip ?? undefined}
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Eyebrow inline size="xs" className="text-cream/80">
                {t.photoPlaceholder}
              </Eyebrow>
            </div>
          )}
        </div>
      </div>

      <div className="-mt-1 flex flex-col items-center gap-1 rounded-sm bg-glow px-5 py-2.5 text-center text-navy shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]">
        <h4
          className={cn(
            "font-display text-[1.375rem] leading-tight font-semibold",
            !member && "italic",
          )}
        >
          {name}
        </h4>
        <Eyebrow inline size="xs">
          {member?.role || t.rolePlaceholder}
        </Eyebrow>
      </div>

      <p
        className={cn(
          "max-w-72 text-center text-[1.0625rem] leading-normal",
          !member?.bio && "text-cream/80 italic",
        )}
      >
        {member?.bio || t.bioPlaceholder}
      </p>
    </li>
  );
}
