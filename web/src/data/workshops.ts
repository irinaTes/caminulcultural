import "server-only";
import { cacheLife } from "next/cache";
import { siteTimeZone } from "@/config/site";
import { intlLocales, type Locale } from "@/i18n/config";
import { shortDayLabel, zonedDateTime } from "@/lib/dates";
import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import { localized, localizedBlocks } from "@/sanity/localized";
import {
  POSTER_BOARD_QUERY,
  WORKSHOP_NAMES_QUERY,
  WORKSHOP_PAGE_QUERY,
  WORKSHOP_SLUGS_QUERY,
} from "@/sanity/queries";
import type {
  POSTER_BOARD_QUERY_RESULT,
  WORKSHOP_PAGE_QUERY_RESULT,
} from "@/sanity/sanity.types";
import type {
  GalleryPhoto,
  Poster,
  SessionDay,
  SessionSlot,
  WorkshopDetail,
  WorkshopName,
  WorkshopSummary,
} from "./types";

// Content changes reach the pages through <SanityLive />, which revalidates
// these entries by their Sanity tags. Time passing changes no content, so the
// session lists are also refreshed every minute: a session leaves the site
// about a minute after it starts, and earlier days never show.

/** How many days fit on one poster. The workshop page shows them all. */
const DAYS_PER_POSTER = 3;

/** Poster tilts in degrees, repeated along the board. */
const TILTS = [-2.5, 1.8, -1, 2.6, -2, 1.2];

/** Visible workshops with upcoming sessions, in the editor's order. */
export async function getPosterBoard(locale: Locale): Promise<Poster[]> {
  "use cache";
  cacheLife("minutes");

  const { data } = await sanityFetch({
    query: POSTER_BOARD_QUERY,
    params: { now: new Date().toISOString() },
    perspective: "published",
    stega: false,
  });

  return data.map((workshop, index) => {
    const summary = toSummary(workshop, locale, { width: 800, height: 800 });
    const dates = summary.days.slice(0, DAYS_PER_POSTER).map((d) => d.date);
    return {
      ...summary,
      days: summary.days.slice(0, DAYS_PER_POSTER),
      sessions: summary.sessions.filter((s) => dates.includes(s.date)),
      pinColor: workshop.pinColor,
      rotation: TILTS[index % TILTS.length],
    };
  });
}

/** Every visible workshop's name, in the editor's order, sessions or not. */
export async function getWorkshopNames(
  locale: Locale,
): Promise<WorkshopName[]> {
  "use cache";

  const { data } = await sanityFetch({
    query: WORKSHOP_NAMES_QUERY,
    perspective: "published",
    stega: false,
  });

  return data.map((workshop) => ({
    id: workshop._id,
    name: localized(workshop.title, locale),
  }));
}

/** One visible workshop with all its upcoming sessions, or null. */
export async function getWorkshop(
  slug: string,
  locale: Locale,
): Promise<WorkshopDetail | null> {
  "use cache";
  cacheLife("minutes");

  const { data } = await sanityFetch({
    query: WORKSHOP_PAGE_QUERY,
    params: { slug, now: new Date().toISOString() },
    perspective: "published",
    stega: false,
  });
  if (!data) return null;

  return {
    ...toSummary(data, locale, { width: 1200, height: 900 }),
    capacity: data.capacity,
    description: localizedBlocks(data.description, locale),
    gallery: (data.gallery ?? []).map((photo) => toGalleryPhoto(photo, locale)),
  };
}

/** The longest side the viewer asks for; Next.js scales down from it. */
const GALLERY_MAX_SIZE = 2400;

type GalleryResult = NonNullable<
  NonNullable<WORKSHOP_PAGE_QUERY_RESULT>["gallery"]
>[number];

function toGalleryPhoto(photo: GalleryResult, locale: Locale): GalleryPhoto {
  // The editor's crop changes the shape, so size the photo after it.
  const crop = photo.crop;
  const original = photo.dimensions ?? { width: 4, height: 3 };
  const width =
    (original.width ?? 4) * (1 - (crop?.left ?? 0) - (crop?.right ?? 0));
  const height =
    (original.height ?? 3) * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0));
  const scale = Math.min(1, GALLERY_MAX_SIZE / Math.max(width, height));
  // The hotspot is measured on the original photo; move it into the crop.
  const left = crop?.left ?? 0;
  const top = crop?.top ?? 0;
  const keptX = 1 - left - (crop?.right ?? 0);
  const keptY = 1 - top - (crop?.bottom ?? 0);
  const percent = (value: number) =>
    `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`;
  const focusX = ((photo.hotspot?.x ?? 0.5) - left) / keptX;
  const focusY = ((photo.hotspot?.y ?? 0.5) - top) / keptY;

  return {
    id: photo._key,
    src: urlFor(photo)
      .width(Math.round(width * scale))
      .fit("max")
      .url(),
    alt: localized(photo.alt, locale),
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    lqip: photo.lqip,
    focus: `${percent(focusX)} ${percent(focusY)}`,
  };
}

/** Slugs of the visible workshops, for prerendering their pages. */
export async function getWorkshopSlugs(): Promise<string[]> {
  "use cache";

  const { data } = await sanityFetch({
    query: WORKSHOP_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  return data;
}

type WorkshopResult =
  POSTER_BOARD_QUERY_RESULT[number] | NonNullable<WORKSHOP_PAGE_QUERY_RESULT>;

function toSummary(
  workshop: WorkshopResult,
  locale: Locale,
  photoSize: { width: number; height: number },
): WorkshopSummary {
  const sessions: SessionSlot[] = workshop.sessions.map((session) => ({
    id: session._id,
    startsAt: session.startsAt,
    ...zonedDateTime(session.startsAt, siteTimeZone),
    seatsLeft: session.seatsLeft,
    full: session.status === "full" || session.seatsLeft === 0,
  }));

  const days: SessionDay[] = [...new Set(sessions.map((s) => s.date))].map(
    (date) => ({
      date,
      label: shortDayLabel(date, intlLocales[locale]),
      full: sessions.every((s) => s.date !== date || s.full),
    }),
  );

  const { photo } = workshop;

  return {
    id: workshop._id,
    slug: workshop.slug,
    name: localized(workshop.title, locale),
    verb: localized(workshop.verb, locale),
    shortLine: localized(workshop.shortLine, locale),
    priceLei: workshop.price,
    durationHours: workshop.durationHours,
    photo: photo?.asset
      ? {
          src: urlFor(photo)
            .width(photoSize.width)
            .height(photoSize.height)
            .fit("crop")
            .url(),
          alt: localized(photo.alt, locale),
          lqip: photo.lqip,
        }
      : null,
    days,
    sessions,
  };
}
