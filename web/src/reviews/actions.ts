"use server";

import { randomUUID } from "node:crypto";
import { render } from "@/booking/emails";
import { allowRequest, visitorId } from "@/booking/rateLimit";
import { sendEmail } from "@/booking/send";
import { HONEYPOT_FIELD } from "@/booking/state";
import { siteTimeZone, studioDocumentUrl } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { zonedDateTime } from "@/lib/dates";
import { privateClient, REVIEW_ID_PREFIX } from "@/sanity/privateClient";
import { parseReview } from "./schema";
import type { ReviewState } from "./state";

/**
 * A line for the guest book, from the form behind the QR code on the tables.
 * Saved as a review that isn't shown yet ("Apare pe site" off), under a
 * private id, so nobody can read it before we do. We get an email about it.
 */
export async function submitReview(
  _previous: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const parsed = parseReview(formData);
  if (!parsed.data) return { status: "invalid", fields: parsed.fields };
  const input = parsed.data;

  // Bots fill every field. Look successful, save nothing.
  if (formData.get(HONEYPOT_FIELD)) return { status: "sent" };
  if (!allowRequest(`review:${await visitorId()}`)) {
    return { status: "error", reason: "rate" };
  }
  if (!privateClient) {
    console.error("Review not saved: SANITY_BOOKINGS_TOKEN is not set.");
    return { status: "error", reason: "save" };
  }

  // Only a workshop that's on the site; anything else is left out.
  const workshop = input.workshop
    ? await privateClient.fetch<{ _id: string; title: string | null } | null>(
        `*[_type == "workshop" && _id == $id && hidden != true][0]{ _id, "title": title.ro }`,
        { id: input.workshop },
      )
    : null;

  let id: string;
  try {
    ({ _id: id } = await privateClient.create({
      _id: `${REVIEW_ID_PREFIX}${randomUUID()}`,
      _type: "review",
      firstName: input.firstName,
      text: input.text,
      language: input.lang,
      date: zonedDateTime(new Date(), siteTimeZone).date,
      ...(workshop && {
        workshop: { _type: "reference", _ref: workshop._id },
      }),
      published: false,
      source: "site",
    }));
  } catch (error) {
    console.error("Review not saved:", error);
    return { status: "error", reason: "save" };
  }

  // Let us know; a failed email is only logged, the review is saved.
  const { email } = await getSiteSettings();
  const to = process.env.BOOKING_TO_EMAIL || email;
  if (to || process.env.NODE_ENV !== "production") {
    await sendEmail(to ?? "[email din Setări site]", {
      ...render({
        subject: `Rând nou în condică: ${input.firstName}`,
        paragraphs: [
          "Cineva a semnat condica de pe site. Nu apare pe site până nu pornești „Apare pe site” în Studio.",
        ],
        heading: "Rândul",
        rows: [
          ["Prenume", input.firstName],
          ["Atelierul", workshop?.title ?? "–"],
          ["Limba site-ului", input.lang === "ro" ? "română" : "engleză"],
          ["Textul", input.text],
          ["În Studio", studioDocumentUrl(id, "review")],
        ],
        closing: ["Recenziile noi sunt la Recenzii → De aprobat."],
      }),
    });
  }

  return { status: "sent" };
}
