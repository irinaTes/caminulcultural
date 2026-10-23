"use client";

import { useId } from "react";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SessionDay } from "@/data/types";
import type { TimeOption } from "./useSessionChoice";

type DayTimeChipsProps = {
  days: SessionDay[];
  times: TimeOption[];
  day: string | null;
  time: string | null;
  onDay: (date: string) => void;
  onTime: (time: string) => void;
  t: { day: string; time: string; full: string };
  /** Adds "· 4 locuri" to open times when seats are known. */
  seatsLabel?: (seats: number) => string;
};

/** The "Ziua" and "Ora" chip rows. Renders siblings, so the parent sets the spacing. */
export function DayTimeChips({
  days,
  times,
  day,
  time,
  onDay,
  onTime,
  t,
  seatsLabel,
}: DayTimeChipsProps) {
  const id = useId();

  return (
    <>
      <Eyebrow inline size="xs" id={`${id}-day`}>
        {t.day}
      </Eyebrow>
      <div
        role="group"
        aria-labelledby={`${id}-day`}
        className="flex flex-wrap gap-1.5"
      >
        {days.map((d) => (
          <Chip
            key={d.date}
            pressed={day === d.date}
            disabled={d.full}
            onClick={() => onDay(d.date)}
          >
            <SlotLabel label={d.label} full={d.full} fullLabel={t.full} />
          </Chip>
        ))}
      </div>

      <Eyebrow inline size="xs" id={`${id}-time`}>
        {t.time}
      </Eyebrow>
      <div
        role="group"
        aria-labelledby={`${id}-time`}
        className="flex flex-wrap gap-1.5"
      >
        {times.map((option) => (
          <Chip
            key={option.time}
            pressed={time === option.time}
            disabled={option.full}
            onClick={() => onTime(option.time)}
          >
            <SlotLabel
              label={option.time}
              full={option.full}
              fullLabel={t.full}
            />
            {!option.full &&
              seatsLabel &&
              option.seatsLeft != null &&
              ` · ${seatsLabel(option.seatsLeft)}`}
          </Chip>
        ))}
      </div>
    </>
  );
}

function SlotLabel({
  label,
  full,
  fullLabel,
}: {
  label: string;
  full: boolean;
  fullLabel: string;
}) {
  if (!full) return label;
  return (
    <>
      <s>{label}</s> · {fullLabel}
    </>
  );
}
