"use client";

import { useId, useState } from "react";
import { MessageActions } from "@/components/contact/MessageActions";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StepButton } from "@/components/ui/StepButton";
import type { WorkshopName } from "@/data/types";
import { fill } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";

/** Private events take 5 to 15 people (the brief). */
const MIN_GUESTS = 5;
const MAX_GUESTS = 15;

type RentText = Dictionary["rent"];
type Occasion = keyof RentText["occasions"];

type RentConfiguratorProps = {
  workshops: WorkshopName[];
  email: string | null;
  intlLocale: string;
  t: Omit<RentText, "label" | "title" | "titleAccent" | "intro" | "hint">;
  contact: Dictionary["contact"];
};

/** Occasion, workshop and group size, turned into a ready-to-send message. */
export function RentConfigurator({
  workshops,
  email,
  intlLocale,
  t,
  contact,
}: RentConfiguratorProps) {
  const [occasion, setOccasion] = useState<Occasion>("bachelorette");
  const [workshopId, setWorkshopId] = useState(workshops[0]?.id);
  const [guests, setGuests] = useState(10);
  const id = useId();

  const occasions = Object.entries(t.occasions) as [
    Occasion,
    RentText["occasions"][Occasion],
  ][];
  const workshop = workshops.find((w) => w.id === workshopId);
  const message = fill(t.message, {
    occasion: t.occasions[occasion].phrase,
    workshop: workshop
      ? fill(contact.workshopPhrase, {
          name: workshop.name.toLocaleLowerCase(intlLocale),
        })
      : contact.anyWorkshop,
    n: guests,
  });

  return (
    <div className="flex min-w-0 flex-[1_1_30rem] flex-col gap-7 rounded-[10px] bg-navy-deep px-8 py-9 max-sm:px-5 max-sm:py-7">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3">
          <Eyebrow inline tracking="normal">
            {t.occasionLegend}
          </Eyebrow>
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {occasions.map(([key, option]) => (
            <Chip
              key={key}
              tone="dark"
              pressed={key === occasion}
              onClick={() => setOccasion(key)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      {workshops.length > 0 && (
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

      <div
        role="group"
        aria-labelledby={`${id}-guests`}
        aria-describedby={`${id}-range`}
        className="flex flex-wrap items-center gap-4.5"
      >
        <Eyebrow inline tracking="normal" id={`${id}-guests`}>
          {t.guests}
        </Eyebrow>
        <div className="flex items-center gap-1.5">
          <StepButton
            tone="dark"
            label={t.fewerGuests}
            disabled={guests <= MIN_GUESTS}
            onClick={() => setGuests(guests - 1)}
          >
            −
          </StepButton>
          <output
            aria-live="polite"
            className="min-w-16 text-center font-display text-[2.125rem] font-semibold"
          >
            {guests}
          </output>
          <StepButton
            tone="dark"
            label={t.moreGuests}
            disabled={guests >= MAX_GUESTS}
            onClick={() => setGuests(guests + 1)}
          >
            +
          </StepButton>
        </div>
        <span id={`${id}-range`} className="sr-only">
          {fill(t.guestsRange, { min: MIN_GUESTS, max: MAX_GUESTS })}
        </span>
      </div>

      <div className="flex -rotate-1 flex-col gap-2.5 rounded-sm bg-cream p-5.5 text-navy">
        <Eyebrow inline size="sm">
          {t.messageLabel}
        </Eyebrow>
        <p className="text-lg leading-[1.55]">{message}</p>
      </div>

      <MessageActions
        key={message}
        email={email}
        subject={t.subject}
        message={message}
        sendLabel={t.send}
        variant="glow"
        t={contact}
      />
    </div>
  );
}
