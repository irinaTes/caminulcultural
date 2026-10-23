"use server";

import { headers } from "next/headers";
import { siteTimeZone } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { intlLocales } from "@/i18n/config";
import { longDateTime } from "@/lib/dates";
import { customerEmail, staffEmail } from "./emails";
import { allowRequest } from "./rateLimit";
import { parseBooking } from "./schema";
import { sendEmail } from "./send";
import { checkSession } from "./session";
import { HONEYPOT_FIELD, type BookingState } from "./state";

/**
 * Stage 1 booking: a request, confirmed by hand. Validates the form, checks
 * the session is still bookable, emails us and the customer. Seats are
 * updated by hand in the Studio.
 *
 * Stage 2 swaps the "email us" step for a Stripe Checkout session and a
 * redirect; validation and the session check stay as they are.
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

  const requestHeaders = await headers();
  const visitor =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (!allowRequest(visitor)) return { status: "error", reason: "rate" };

  const check = await checkSession(input.session, input.people, input.lang);
  if (!check.ok) {
    return check.reason === "seats"
      ? { status: "error", reason: "seats", seatsLeft: check.seatsLeft }
      : { status: "error", reason: "session" };
  }
  const { session } = check;

  // Where requests go: BOOKING_TO_EMAIL if set, otherwise the contact email
  // from Site settings.
  const { email: contactEmail } = await getSiteSettings();
  const to = process.env.BOOKING_TO_EMAIL || contactEmail;
  if (!to && process.env.NODE_ENV === "production") {
    console.error(
      "Booking not sent: no BOOKING_TO_EMAIL and no email in Site settings.",
    );
    return { status: "error", reason: "send" };
  }

  const delivered = await sendEmail(
    to ?? "[email din Setări site]",
    await staffEmail(input, session),
  );
  if (!delivered) return { status: "error", reason: "send" };

  // We have the request; a failed confirmation is logged, not shown.
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
