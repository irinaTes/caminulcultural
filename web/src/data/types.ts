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

/** Where a workshop is held. */
export type Venue = {
  name: string;
  /** Street and number, without the city: "Strada Oltarului 3". */
  address: string;
};

export type SessionSlot = {
  id: string;
  /** The exact start, as an ISO instant. */
  startsAt: string;
  date: string;
  /** "19:30", Bucharest time. */
  time: string;
  /** Free seats after bookings; null when neither session nor workshop has a limit. */
  seatsLeft: number | null;
  full: boolean;
  /** The session's venue, else its workshop's; null until the editor sets one. */
  venue: Venue | null;
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
  /** The different venues of these sessions, in date order. */
  venues: Venue[];
};

export type Poster = WorkshopSummary & {
  pinColor: "cherry" | "glow";
  /** Poster tilt in degrees. */
  rotation: number;
};

/** One photo on a workshop's gallery wall. */
export type GalleryPhoto = {
  id: string;
  /** null for a placeholder frame, shown until the editor adds photos. */
  src: string | null;
  alt: string;
  /** The (cropped) photo's size, for its shape on the wall and in the viewer. */
  width: number;
  height: number;
  lqip: string | null;
  /** CSS object-position from the editor's hotspot, e.g. "50% 30%". */
  focus: string;
};

export type WorkshopDetail = WorkshopSummary & {
  capacity: number | null;
  /** Empty when the editor hasn't added photos; the page then has no gallery. */
  gallery: GalleryPhoto[];
  /** Portable Text; empty when the editor hasn't written one. */
  description: NonNullable<LocaleBlockContent["ro"]>;
};

/** A workshop's id and display name, for pickers that don't need the rest. */
export type WorkshopName = { id: string; slug: string | null; name: string };

export type Review = {
  id: string;
  firstName: string;
  text: string;
  /** The language the guest wrote in; reviews are never translated. */
  language: Locale;
  /** "2026-11-05" */
  date: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** `alt` is empty when the editor left it blank; the UI then names the person. */
  photo: WorkshopPhoto | null;
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
