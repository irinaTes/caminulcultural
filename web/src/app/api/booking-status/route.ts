import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import {
  NOTIFIED_STATUSES,
  statusEmail,
  type NotifiedStatus,
} from "@/booking/emails";
import { sendEmail } from "@/booking/send";
import { getSiteSettings } from "@/data/siteSettings";
import { hasLocale } from "@/i18n/config";
import { localized } from "@/sanity/localized";
import { BOOKING_ID_PREFIX, privateClient } from "@/sanity/privateClient";
import { BOOKING_NOTICE_QUERY } from "@/sanity/queries";

/**
 * Sanity webhook, called when a booking's status is published as confirmed,
 * declined or cancelled (see README). Emails the customer, once per status.
 *
 * The webhook only sends the booking's id; the details are re-read here with
 * the private client, so no personal data sits in Sanity's webhook logs. A
 * failed email answers 500, and Sanity tries again later.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || !privateClient) {
    return Response.json(
      {
        message: "SANITY_REVALIDATE_SECRET or SANITY_BOOKINGS_TOKEN is not set",
      },
      { status: 500 },
    );
  }

  // Also waits until the change is readable from the API.
  const { isValidSignature, body } = await parseBody<{ _id?: string }>(
    request,
    secret,
    true,
  );
  if (!isValidSignature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }
  const id = body?._id;
  if (!id?.startsWith(BOOKING_ID_PREFIX)) {
    return Response.json({ message: "Not a booking" }, { status: 400 });
  }

  const booking = await privateClient.fetch(
    BOOKING_NOTICE_QUERY,
    { id },
    { cache: "no-store" },
  );
  const skip = (reason: string) => Response.json({ sent: false, reason });
  if (!booking) return skip("gone");
  const status = booking.status as NotifiedStatus;
  if (!NOTIFIED_STATUSES.includes(status)) return skip("status");
  if (booking.notifiedStatus === status) return skip("already told");
  if (!booking.email) return skip("no email");
  if (!booking.startsAt || !booking.workshop) return skip("no session");

  const lang = booking.lang && hasLocale(booking.lang) ? booking.lang : "ro";
  const settings = await getSiteSettings();
  const to = process.env.BOOKING_TO_EMAIL || settings.email;
  const email = await statusEmail(
    {
      status,
      name: booking.name ?? "",
      people: booking.people ?? 1,
      lang,
      startsAt: booking.startsAt,
      workshop: localized(booking.workshop.title, lang),
      priceLei: booking.workshop.price,
    },
    settings,
  );

  const delivered = await sendEmail(booking.email, {
    ...email,
    replyTo: to ?? undefined,
  });
  if (!delivered) {
    return Response.json({ message: "Email not sent" }, { status: 500 });
  }

  // Shown in the Studio, and stops a retried webhook from emailing twice.
  await privateClient
    .patch(id)
    .set({ notifiedStatus: status, notifiedAt: new Date().toISOString() })
    .commit();
  return Response.json({ sent: true, status });
}
