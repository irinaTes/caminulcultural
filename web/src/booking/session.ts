import "server-only";
import type { Venue } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { seatsLeft } from "@/lib/seats";
import { localized } from "@/sanity/localized";
import { privateClient } from "@/sanity/privateClient";
import { BOOKING_SESSION_QUERY } from "@/sanity/queries";

/** Upper limit for one booking when neither the session nor the workshop has a limit. */
const MAX_GROUP = 10;

export type BookableSession = {
  id: string;
  startsAt: string;
  workshop: string;
  priceLei: number | null;
  venue: Venue | null;
};

type SessionCheck =
  | { ok: true; session: BookableSession }
  | { ok: false; reason: "session" }
  | { ok: false; reason: "seats"; seatsLeft: number };

/**
 * Re-reads the session straight from Sanity (no CDN, no cache) and checks it
 * can still take `people`: published, open, not started, workshop visible,
 * enough seats once the other bookings are counted. The page may have been
 * open for a while.
 */
export async function checkSession(
  id: string,
  people: number,
  locale: Locale,
): Promise<SessionCheck> {
  if (!privateClient) throw new Error("SANITY_BOOKINGS_TOKEN is not set");
  // (requestBooking checks it first and answers the visitor politely.)
  const data = await privateClient.fetch(
    BOOKING_SESSION_QUERY,
    { id },
    { cache: "no-store" },
  );

  if (
    !data ||
    data.status !== "open" ||
    data.workshop.hidden ||
    new Date(data.startsAt) <= new Date()
  ) {
    return { ok: false, reason: "session" };
  }

  const max =
    seatsLeft(data.capacity, data.workshop.capacity, data.taken ?? 0) ??
    MAX_GROUP;
  if (max <= 0) return { ok: false, reason: "session" };
  if (people > max) return { ok: false, reason: "seats", seatsLeft: max };

  return {
    ok: true,
    session: {
      id: data._id,
      startsAt: data.startsAt,
      workshop: localized(data.workshop.title, locale),
      priceLei: data.workshop.price,
      venue: data.venue,
    },
  };
}
