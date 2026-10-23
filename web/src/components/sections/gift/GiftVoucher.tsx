"use client";

import { useId, useState, type ReactNode } from "react";
import { ApprovedStamp } from "@/components/cats";
import { MessageActions } from "@/components/contact/MessageActions";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { WorkshopName } from "@/data/types";
import { fill } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";

type GiftText = Omit<Dictionary["gift"], "label" | "title" | "intro">;
type GiftType = "workshop" | "amount";

type GiftVoucherProps = {
  /** The section heading and intro, rendered on the server. */
  heading: ReactNode;
  workshops: WorkshopName[];
  email: string | null;
  intlLocale: string;
  t: GiftText;
  contact: Dictionary["contact"];
};

/** The voucher form and a live preview of the ticket it makes. */
export function GiftVoucher({
  heading,
  workshops,
  email,
  intlLocale,
  t,
  contact,
}: GiftVoucherProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<GiftType>("workshop");
  const [workshopId, setWorkshopId] = useState(workshops[0]?.id);
  const id = useId();

  const recipient = name.trim();
  const workshop = workshops.find((w) => w.id === workshopId);
  const workshopPhrase = workshop
    ? fill(contact.workshopPhrase, {
        name: workshop.name.toLocaleLowerCase(intlLocale),
      })
    : contact.anyWorkshop;
  const values = { name: recipient || t.someone, workshop: workshopPhrase };
  const message = fill(
    type === "workshop" ? t.messageWorkshop : t.messageAmount,
    values,
  );
  const types: [GiftType, string][] = [
    ["workshop", t.typeWorkshop],
    ["amount", t.typeAmount],
  ];

  return (
    <div className="mx-auto flex max-w-350 flex-col gap-12">
      <div className="flex flex-wrap items-center gap-22 max-md:gap-14">
        <div className="flex min-w-0 flex-[1_1_22.5rem] flex-col gap-5.5">
          {heading}

          <div className="flex max-w-105 flex-col gap-2">
            <Eyebrow inline tracking="normal">
              <label htmlFor={`${id}-name`}>{t.nameLabel}</label>
            </Eyebrow>
            <input
              id={`${id}-name`}
              type="text"
              maxLength={28}
              autoComplete="off"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border-2 border-cream bg-black/15 px-4 py-3.5 text-xl text-cream placeholder:text-cream/70"
            />
          </div>

          <fieldset>
            <legend className="sr-only">{t.typeLegend}</legend>
            <div className="flex flex-wrap gap-2.5">
              {types.map(([key, label]) => (
                <Chip
                  key={key}
                  tone="dark"
                  pressed={key === type}
                  onClick={() => setType(key)}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>

          {type === "workshop" && workshops.length > 0 && (
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-3">
                <Eyebrow inline tracking="normal">
                  {t.workshopLegend}
                </Eyebrow>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {workshops.map((w) => (
                  <Chip
                    key={w.id}
                    tone="dark"
                    pressed={w.id === workshopId}
                    onClick={() => setWorkshopId(w.id)}
                  >
                    {w.name}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <div className="flex min-w-0 flex-[1_1_32.5rem] justify-center">
          <Ticket
            t={t}
            name={recipient}
            line={
              type === "workshop" ? fill(t.lineWorkshop, values) : t.lineAmount
            }
          />
        </div>
      </div>

      <MessageActions
        key={message}
        email={email}
        subject={fill(t.subject, values)}
        message={message}
        sendLabel={t.send}
        variant="cream"
        t={contact}
      />
    </div>
  );
}

/** Cream ticket body with a perforated gold stub, slightly tilted. */
function Ticket({
  t,
  name,
  line,
}: {
  t: GiftText;
  name: string;
  line: string;
}) {
  return (
    <figure
      aria-label={t.ticketLabel}
      className="flex w-full max-w-150 rotate-2 flex-wrap drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
    >
      <div className="relative flex min-w-0 flex-[1_1_17rem] flex-col gap-4 rounded-l-md bg-cream px-8 py-8.5 text-navy max-sm:rounded-t-md max-sm:rounded-bl-none max-sm:px-5.5">
        <div className="flex justify-between gap-3">
          <Eyebrow inline size="sm" tracking="normal">
            {t.ticketHouse}
          </Eyebrow>
          <Eyebrow inline size="sm" tracking="normal">
            {t.ticketNumber}
          </Eyebrow>
        </div>
        <p className="font-display text-[1.375rem] text-bordeaux italic">
          {t.ticketTitle}
        </p>
        <div className="flex flex-col gap-1 border-b border-navy pb-2.5">
          <Eyebrow inline size="xs">
            {t.ticketFor}
          </Eyebrow>
          <span className="font-display text-[2.375rem] leading-[1.05] font-semibold wrap-break-word">
            {name || t.ticketNamePlaceholder}
          </span>
        </div>
        <p className="text-[1.0625rem] leading-normal">{line}</p>
        <Eyebrow size="sm" tracking="tight">
          {t.admits}
        </Eyebrow>
        <ApprovedStamp
          label={t.stamp}
          className="pointer-events-none absolute top-14.5 right-4.5 size-23 -rotate-14 opacity-85 max-sm:top-12 max-sm:right-3 max-sm:size-18"
        />
      </div>
      <div
        aria-hidden="true"
        className="flex flex-[0_0_8.25rem] items-center justify-center rounded-r-md border-l-3 border-dashed border-bordeaux bg-glow px-2.5 py-6 text-navy max-sm:flex-[1_1_100%] max-sm:rounded-tr-none max-sm:rounded-b-md max-sm:border-t-3 max-sm:border-l-0 max-sm:py-3"
      >
        <span className="font-display text-[2.125rem] font-semibold whitespace-nowrap italic sm:-rotate-90">
          CC31
        </span>
      </div>
    </figure>
  );
}
