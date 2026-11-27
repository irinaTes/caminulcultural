"use server";

import { updateTag } from "next/cache";
import { siteTimeZone } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { intlLocales } from "@/i18n/config";
import { longDateTime } from "@/lib/dates";
import { bookingsCacheTag, privateClient } from "@/sanity/privateClient";
import { customerEmail, staffEmail } from "./emails";
import { allowRequest, visitorId } from "./rateLimit";
import { parseBooking } from "./schema";
import { sendEmail } from "./send";
import { checkSession } from "./session";
import { saveBooking } from "./store";
import { HONEYPOT_FIELD, type BookingState } from "./state";

/**
 * Stage 1 booking: a request, confirmed by hand. Validates the form, checks
 * the session still has the seats, saves the request in the Studio (where it
 * holds its seats until it's declined) and emails us and the customer.
 *
 * Stage 2 swaps the emails for a Stripe Checkout session and a redirect;
 * validation, the session check and saving stay as they are.
 */
export async function requestBooking(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const parsed = parseBooking(formData);
  if (!parsed.data) return { status: "invalid", fields: parsed.fields };
  const input = parsed.data;

  const sent: BookingState = {
    status: "sent",
    workshop: "",
    when: "",
    people: input.people,
  };

  // Bots fill every field. Look successful, send nothing.
  if (formData.get(HONEYPOT_FIELD)) return sent;

  if (!allowRequest(`booking:${await visitorId()}`))
    return { status: "error", reason: "rate" };

  // Without the bookings token there's nowhere to keep the request.
  if (!privateClient) {
    console.error("Booking refused: SANITY_BOOKINGS_TOKEN is not set.");
    return { status: "error", reason: "send" };
  }

  const check = await checkSession(input.session, input.people, input.lang);
  if (!check.ok) {
    return check.reason === "seats"
      ? { status: "error", reason: "seats", seatsLeft: check.seatsLeft }
      : { status: "error", reason: "session" };
  }
  const { session } = check;

  // Saved first: from here on the seats are held, and the request is in
  // the Studio even if an email fails.
  const bookingId = await saveBooking(input);
  if (!bookingId) return { status: "error", reason: "send" };
  // The pages show the seats this booking took.
  updateTag(bookingsCacheTag);

  // Where requests go: BOOKING_TO_EMAIL if set, otherwise the contact email
  // from Site settings. A failed email is logged, not shown: we have the
  // booking.
  const { email: contactEmail } = await getSiteSettings();
  const to = process.env.BOOKING_TO_EMAIL || contactEmail;
  if (to || process.env.NODE_ENV !== "production") {
    await sendEmail(
      to ?? "[email din Setări site]",
      await staffEmail(input, session, bookingId),
    );
  } else {
    console.error(
      `Booking ${bookingId} saved, but not emailed: no BOOKING_TO_EMAIL and no email in Site settings.`,
    );
  }
  await sendEmail(input.email, {
    ...(await customerEmail(input, session)),
    replyTo: to ?? undefined,
  });

  return {
    ...sent,
    workshop: session.workshop,
    when: longDateTime(session.startsAt, intlLocales[input.lang], siteTimeZone),
  };
}
