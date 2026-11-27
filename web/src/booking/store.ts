import "server-only";
import { randomUUID } from "node:crypto";
import { BOOKING_ID_PREFIX, privateClient } from "@/sanity/privateClient";
import type { BookingInput } from "./schema";

/**
 * Saves the request as a "De confirmat" booking in the Studio. Its seats are
 * held from now on, until the booking is declined or cancelled. Returns the
 * booking's id, or null when it couldn't be saved.
 */
export async function saveBooking(input: BookingInput): Promise<string | null> {
  if (!privateClient) {
    console.error("Booking not saved: SANITY_BOOKINGS_TOKEN is not set.");
    return null;
  }
  try {
    const { _id } = await privateClient.create({
      _id: `${BOOKING_ID_PREFIX}${randomUUID()}`,
      _type: "booking",
      status: "pending",
      source: "site",
      session: { _type: "reference", _ref: input.session },
      people: input.people,
      name: input.name,
      email: input.email,
      phone: input.phone,
      ...(input.note && { note: input.note }),
      lang: input.lang,
      receivedAt: new Date().toISOString(),
    });
    return _id;
  } catch (error) {
    console.error("Booking not saved:", error);
    return null;
  }
}
