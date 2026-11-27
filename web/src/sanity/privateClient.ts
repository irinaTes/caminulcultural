import "server-only";
import { client } from "./client";

/**
 * Reads and writes bookings and the reviews sent from the site. Bookings hold
 * personal details and new reviews haven't been read yet, so both live under
 * a private id ("booking.…", "review.…") that the public API never returns;
 * only a token can see them. Server-only: the token never reaches the browser.
 *
 * SANITY_BOOKINGS_TOKEN is a project token with the Editor role.
 */
const token = process.env.SANITY_BOOKINGS_TOKEN;

export const privateClient = token
  ? client.withConfig({ token, useCdn: false, perspective: "published" })
  : null;

/** Every booking's id starts with this (see studio/schemaTypes/documents/booking.ts). */
export const BOOKING_ID_PREFIX = "booking.";

/** Reviews sent from the site's form start with this, so they stay unreadable until we've read them. */
export const REVIEW_ID_PREFIX = "review.";

/** On cache entries that count booked seats; a new booking expires them. */
export const bookingsCacheTag = "sanity-bookings";
