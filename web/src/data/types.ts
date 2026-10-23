/** Shapes the UI reads, mapped from the Sanity query results in `data/`. */

import type { Locale } from "@/i18n/config";
import type { LocaleBlockContent } from "@/sanity/sanity.types";

export type SessionDay = {
  /** "2026-11-05" */
  date: string;
  /** "joi 5 nov" */
  label: string;
  /** Every session that day is full. */
  full: boolean;
};

export type SessionSlot = {
  id: string;
  date: string;
  /** "19:30", Bucharest time. */
  time: string;
  /** null when the editor doesn't track seats for it. */
  seatsLeft: number | null;
  full: boolean;
};

export type WorkshopPhoto = {
  src: string;
  alt: string;
  /** Tiny base64 preview shown while the photo loads. */
  lqip: string | null;
};

export type WorkshopSummary = {
  id: string;
  slug: string;
  name: string;
  verb: string;
  shortLine: string;
  /** null until the editor sets a price; shown as [PREȚ]. */
  priceLei: number | null;
  durationHours: number;
  photo: WorkshopPhoto | null;
  days: SessionDay[];
  sessions: SessionSlot[];
};

export type Poster = WorkshopSummary & {
  pinColor: "cherry" | "glow";
  /** Poster tilt in degrees. */
  rotation: number;
};

export type WorkshopDetail = WorkshopSummary & {
  capacity: number | null;
  /** Portable Text; empty when the editor hasn't written one. */
  description: NonNullable<LocaleBlockContent["ro"]>;
};

/** A workshop's id and display name, for pickers that don't need the rest. */
export type WorkshopName = { id: string; name: string };

export type Review = {
  id: string;
  firstName: string;
  text: string;
  /** The language the guest wrote in; reviews are never translated. */
  language: Locale;
  /** "2026-11-05" */
  date: string;
};

/** Contact and company details. Empty fields are null and show as placeholders. */
export type SiteSettings = {
  address: string | null;
  metroStation: string | null;
  email: string | null;
  /** "+40 712 345 678" */
  whatsapp: string | null;
  /** Account name without the @. */
  instagram: string | null;
  company: {
    legalName: string | null;
    cui: string | null;
  };
  promoCode: string | null;
};
