import "server-only";
import { siteTimeZone } from "@/config/site";
import { intlLocales } from "@/i18n/config";
import { getDictionaryFor } from "@/i18n/dictionaries";
import { fill, plural } from "@/i18n/format";
import { longDateTime } from "@/lib/dates";
import type { BookingInput } from "./schema";
import type { BookableSession } from "./session";

export type Email = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

type Row = [label: string, value: string];

/** The confirmation the customer gets, in the language they booked in. */
export async function customerEmail(
  input: BookingInput,
  session: BookableSession,
): Promise<Email> {
  const dict = await getDictionaryFor(input.lang);
  const t = dict.bookingEmail;
  const intl = intlLocales[input.lang];
  const when = longDateTime(session.startsAt, intl, siteTimeZone);

  const rows: Row[] = [
    [t.workshop, session.workshop],
    [t.when, when],
    [t.people, plural(dict.workshop.peopleCount, input.people, intl)],
    [t.total, total(input.people, session.priceLei, dict.workshop.totalValue)],
  ];
  if (input.note) rows.push([t.note, input.note]);

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
        ["ID sesiune", session.id],
      ],
      closing: [
        "Locurile nu scad singure: după ce confirmi, actualizează „Locuri rămase” la sesiune în Studio.",
      ],
    }),
    replyTo: input.email,
  };
}

function total(people: number, priceLei: number | null, template: string) {
  if (priceLei == null) return "[PREȚ]";
  return fill(template, { people, price: priceLei, total: people * priceLei });
}

/** Plain text plus a simple HTML version in the site's colours. */
function render({
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
<p style="margin:22px 0 8px;font-family:monospace;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6E1F2F">${escapeHtml(heading)}</p>
<table role="presentation" style="border-collapse:collapse;width:100%;margin-bottom:22px">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 16px 6px 0;vertical-align:top;white-space:nowrap;color:#6E1F2F">${escapeHtml(label)}</td><td style="padding:6px 0;white-space:pre-line">${escapeHtml(value)}</td></tr>`,
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
