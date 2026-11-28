import "server-only";
import { siteTimeZone, studioDocumentUrl } from "@/config/site";
import { intlLocales } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/dictionaries";
import { fill, plural } from "@/i18n/format";
import { longDateTime } from "@/lib/dates";
import type { Locale } from "@/i18n/config";
import type { SiteSettings, Venue } from "@/data/types";
import type { BookingInput } from "./schema";
import type { BookableSession } from "./session";

export type Email = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export type Row = [label: string, value: string];

/** The confirmation the customer gets, in the language they booked in. */
export async function customerEmail(
  input: BookingInput,
  session: BookableSession,
): Promise<Email> {
  const dict = await getDictionaryFor(input.lang);
  const t = dict.bookingEmail;
  const intl = intlLocales[input.lang];
  const when = longDateTime(session.startsAt, intl, siteTimeZone);

  // Only details we wrote go in: the address is the visitor's word, so free
  // text (the note) would let anyone mail their own message from our domain.
  const rows: Row[] = [
    [t.workshop, session.workshop],
    [t.when, when],
    ...venueRow(dict.bookingStatusEmail.where, session.venue),
    [t.people, plural(dict.workshop.peopleCount, input.people, intl)],
    [t.total, total(input.people, session.priceLei, dict.workshop.totalValue)],
  ];

  return render({
    subject: fill(t.subject, { workshop: session.workshop, when }),
    paragraphs: [fill(t.greeting, { name: input.name }), t.intro],
    heading: t.details,
    rows,
    closing: [t.outro, t.signature],
  });
}

/** The notification we get. Internal, so always in Romanian. */
export async function staffEmail(
  input: BookingInput,
  session: BookableSession,
  bookingId: string,
): Promise<Email> {
  const dict = await getDictionaryFor("ro");
  const intl = intlLocales.ro;
  const when = longDateTime(session.startsAt, intl, siteTimeZone);
  const people = plural(dict.workshop.peopleCount, input.people, intl);

  return {
    ...render({
      subject: `Rezervare nouă: ${session.workshop}, ${when}, ${people}`,
      paragraphs: [
        "Cerere nouă de pe site. Răspunde la mailul ăsta ca să-i scrii direct clientului.",
      ],
      heading: "Cererea",
      rows: [
        ["Atelierul", session.workshop],
        ["Când", when],
        ...venueRow("Unde", session.venue),
        ["Câți vin", people],
        [
          "Total",
          total(input.people, session.priceLei, dict.workshop.totalValue),
        ],
        ["Nume", input.name],
        ["Email", input.email],
        ["Telefon", input.phone],
        ["Nota", input.note || "–"],
        ["Limba site-ului", input.lang === "ro" ? "română" : "engleză"],
        ["În Studio", studioDocumentUrl(bookingId, "booking")],
      ],
      closing: [
        "Rezervarea e în Studio, la Rezervări → De confirmat, și ține deja locurile. După ce vorbești cu clientul, schimbă-i starea în Confirmată. Dacă o refuzi sau o anulează, locurile se eliberează singure pe site.",
      ],
    }),
    replyTo: input.email,
  };
}

/** Statuses the customer hears about, once each. */
export const NOTIFIED_STATUSES = [
  "confirmed",
  "declined",
  "cancelled",
] as const;
export type NotifiedStatus = (typeof NOTIFIED_STATUSES)[number];

/**
 * Tells the customer we confirmed, declined or cancelled their booking, in
 * the language they booked in. A confirmation also says where to come.
 */
export async function statusEmail(
  booking: {
    status: NotifiedStatus;
    name: string;
    people: number;
    lang: Locale;
    startsAt: string;
    workshop: string;
    priceLei: number | null;
    venue: Venue | null;
  },
  settings: Pick<SiteSettings, "address" | "metroStation">,
): Promise<Email> {
  const dict = await getDictionaryFor(booking.lang);
  const t = dict.bookingStatusEmail;
  const copy = t[booking.status];
  const intl = intlLocales[booking.lang];
  const when = longDateTime(booking.startsAt, intl, siteTimeZone);

  const rows: Row[] = [
    [dict.bookingEmail.workshop, booking.workshop],
    [dict.bookingEmail.when, when],
    ...venueRow(t.where, booking.venue),
    [
      dict.bookingEmail.people,
      plural(dict.workshop.peopleCount, booking.people, intl),
    ],
  ];
  if (booking.status === "confirmed") {
    rows.push([
      dict.bookingEmail.total,
      total(booking.people, booking.priceLei, dict.workshop.totalValue),
    ]);
    // Without a venue, the Cămin's own address. Left out until it's filled
    // in: no placeholders in a customer's inbox.
    if (!booking.venue) {
      if (settings.address) rows.push([t.where, settings.address]);
      if (settings.metroStation) rows.push([t.metro, settings.metroStation]);
    }
  }

  return render({
    subject: fill(copy.subject, { workshop: booking.workshop, when }),
    paragraphs: [
      fill(dict.bookingEmail.greeting, { name: booking.name }),
      copy.intro,
    ],
    heading: t.details,
    rows,
    closing: [copy.outro, dict.bookingEmail.signature],
  });
}

/** "Mélange Café, Strada Oltarului 3", or no row while the session has no venue. */
function venueRow(label: string, venue: Venue | null): Row[] {
  return venue ? [[label, `${venue.name}, ${venue.address}`]] : [];
}

function total(people: number, priceLei: number | null, template: string) {
  if (priceLei == null) return "[PREȚ]";
  return fill(template, { people, price: priceLei, total: people * priceLei });
}

/** Plain text plus a simple HTML version in the site's colours. */
export function render({
  subject,
  paragraphs,
  heading,
  rows,
  closing,
}: {
  subject: string;
  paragraphs: string[];
  heading: string;
  rows: Row[];
  closing: string[];
}): Email {
  const text = [
    ...paragraphs,
    "",
    `${heading}:`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    ...closing,
  ].join("\n");

  const p = (line: string) =>
    `<p style="margin:0 0 14px">${escapeHtml(line)}</p>`;
  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#F4ECDD;color:#1F206A;font-family:Georgia,serif;font-size:17px;line-height:1.5">
<div style="max-width:560px;margin:0 auto">
${paragraphs.map(p).join("\n")}
<p style="margin:22px 0 8px;font-family:monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#7A0F2E">${escapeHtml(heading)}</p>
<table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:22px">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;color:#7A0F2E">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-line">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
</table>
${closing.map(p).join("\n")}
</div>
</body></html>`;

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
