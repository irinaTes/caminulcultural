import "server-only";
import type { Locale } from "@/i18n/config";
import { client } from "@/sanity/client";
import { localized } from "@/sanity/localized";
import { BOOKING_SESSION_QUERY } from "@/sanity/queries";

/** Upper limit for one booking when the editor tracks neither seats nor capacity. */
const MAX_GROUP = 10;

export type BookableSession = {
  id: string;
  startsAt: string;
  workshop: string;
  priceLei: number | null;
};

type SessionCheck =
  | { ok: true; session: BookableSession }
  | { ok: false; reason: "session" }
  | { ok: false; reason: "seats"; seatsLeft: number };

/**
 * Re-reads the session straight from Sanity (no CDN, no cache) and checks it
 * can still take `people`: published, open, not started, workshop visible,
 * enough seats. The page may have been open for a while.
 */
export async function checkSession(
  id: string,
  people: number,
  locale: Locale,
): Promise<SessionCheck> {
  const data = await client
    .withConfig({ useCdn: false })
    .fetch(BOOKING_SESSION_QUERY, { id }, { cache: "no-store" });

  if (
    !data ||
    data.status !== "open" ||
    data.workshop.hidden ||
    new Date(data.startsAt) <= new Date()
  ) {
    return { ok: false, reason: "session" };
  }

  const max = data.seatsLeft ?? data.workshop.capacity ?? MAX_GROUP;
  if (max <= 0) return { ok: false, reason: "session" };
  if (people > max) return { ok: false, reason: "seats", seatsLeft: max };

  return {
    ok: true,
    session: {
      id: data._id,
      startsAt: data.startsAt,
      workshop: localized(data.workshop.title, locale),
      priceLei: data.workshop.price,
    },
  };
}
