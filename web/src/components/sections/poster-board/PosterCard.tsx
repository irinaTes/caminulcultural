import Image from "next/image";
import Link from "next/link";
import { VenueLinks } from "@/components/sessions/VenueLinks";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { bookingHref } from "@/config/site";
import type { Poster } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { SessionPicker } from "./SessionPicker";

type PosterCardProps = {
  locale: Locale;
  poster: Poster;
  index: number;
  t: Dictionary["posterBoard"];
};

/**
 * Square photo. On a phone it spans the card's width above the text. From md
 * up it's an 18rem square on the left; the card is at least that tall, so the
 * photo reaches the bottom. A taller text stretches it rather than leave a gap.
 */
const photoBox =
  "aspect-square md:aspect-auto md:min-h-72 md:w-72 md:flex-none md:self-stretch";

/** Striped placeholder tints for workshops without a photo yet. */
const photoTints = [
  ["#E7D3A8", "#DFC793"],
  ["#D9C1C5", "#CEB1B7"],
  ["#C9CBE0", "#BCBFD7"],
];

export function PosterCard({ locale, poster, index, t }: PosterCardProps) {
  const titleId = `poster-${poster.id}-title`;
  const [tintA, tintB] = photoTints[index % photoTints.length];

  return (
    // `data-poster` lets BoardStage find the card that received focus.
    <div
      data-poster
      className="h-full origin-top animate-sway"
      style={{
        animationDuration: `${4.8 + (index % 3) * 0.9}s`,
        animationDelay: `${-index * 0.8}s`,
      }}
    >
      <article
        aria-labelledby={titleId}
        style={{ rotate: `${poster.rotation}deg` }}
        className="relative flex h-full flex-col gap-4.5 bg-cream p-4 text-navy shadow-[0_16px_30px_rgba(0,0,0,0.35)] transition-[translate,scale,filter] duration-350 hover:-translate-y-2.5 hover:scale-[1.035] hover:drop-shadow-[0_18px_18px_rgba(0,0,0,0.35)] md:flex-row"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-1.5 left-1/2 z-2 -ml-2.25 size-4.5 rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.45)]",
            poster.pinColor === "cherry" ? "bg-cherry" : "bg-glow",
          )}
        />

        {poster.photo ? (
          <div className={cn("relative", photoBox)}>
            <Image
              src={poster.photo.src}
              alt={poster.photo.alt}
              fill
              sizes="(min-width: 768px) 22rem, 100vw"
              placeholder={poster.photo.lqip ? "blur" : "empty"}
              blurDataURL={poster.photo.lqip ?? undefined}
              className="object-cover"
            />
          </div>
        ) : (
          <div
            role="img"
            aria-label={fill(t.photoAlt, { name: poster.name.toLowerCase() })}
            className={cn("relative", photoBox)}
            style={{
              background: `repeating-linear-gradient(135deg, ${tintA} 0 16px, ${tintB} 16px 32px)`,
            }}
          >
            {/* Out of flow, like the real photo, so the label can't set the box's width. */}
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <Eyebrow
                inline
                size="xs"
                className="bg-cream px-2.5 py-1.75 text-navy"
              >
                {fill(t.photoPlaceholder, { name: poster.name })}
              </Eyebrow>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2.5 px-1 pt-1 pb-0.5 md:flex-1">
          <Eyebrow size="sm">
            {fill(t.kicker, { name: poster.name, hours: poster.durationHours })}
          </Eyebrow>
          <h3
            id={titleId}
            className="font-display text-[2rem] leading-[1.02] font-semibold text-cherry"
          >
            <Link
              href={bookingHref(locale, poster.slug)}
              className="underline-offset-4 hover:underline"
            >
              {poster.verb}
            </Link>
          </h3>
          <p className="text-lg leading-[1.45]">{poster.shortLine}</p>
          {poster.venues.length > 0 && (
            <p className="flex flex-wrap items-baseline gap-x-2 text-[1.0625rem]">
              <Eyebrow inline size="xs">
                {t.where}
              </Eyebrow>
              <span>
                <VenueLinks venues={poster.venues} />
              </span>
            </p>
          )}

          {/* Only the strings the picker needs cross into the client bundle. */}
          <SessionPicker
            locale={locale}
            slug={poster.slug}
            days={poster.days}
            sessions={poster.sessions}
            price={fill(t.price, { price: poster.priceLei ?? "[PREȚ]" })}
            t={{
              when: t.when,
              full: t.full,
              pickPrompt: t.pickPrompt,
              book: t.book,
            }}
          />
        </div>
      </article>
    </div>
  );
}
