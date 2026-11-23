"use client";

import { useId } from "react";
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SessionDay, SessionSlot } from "@/data/types";

type SessionChipsProps = {
  days: SessionDay[];
  sessions: SessionSlot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  t: { when: string; full: string };
  /** Adds "· 4 locuri" to open sessions when seats are known. */
  seatsLabel?: (seats: number) => string;
};

/** Every session as one "sâm 28 nov · 19:00" chip. Renders siblings, so the parent sets the spacing. */
export function SessionChips({
  days,
  sessions,
  selectedId,
  onSelect,
  t,
  seatsLabel,
}: SessionChipsProps) {
  const id = useId();
  const dayLabel = (date: string) =>
    days.find((d) => d.date === date)?.label ?? date;

  return (
    <>
      <Eyebrow inline size="xs" id={`${id}-when`}>
        {t.when}
      </Eyebrow>
      <div
        role="group"
        aria-labelledby={`${id}-when`}
        className="flex flex-wrap gap-1.5"
      >
        {sessions.map((s) => {
          const label = `${dayLabel(s.date)} · ${s.time}`;
          return (
            <Chip
              key={s.id}
              pressed={selectedId === s.id}
              disabled={s.full}
              onClick={() => onSelect(s.id)}
            >
              {s.full ? (
                <>
                  <s>{label}</s> · {t.full}
                </>
              ) : (
                label
              )}
              {!s.full &&
                seatsLabel &&
                s.seatsLeft != null &&
                ` · ${seatsLabel(s.seatsLeft)}`}
            </Chip>
          );
        })}
      </div>
    </>
  );
}
