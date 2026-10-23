"use client";

import Link from "next/link";
import { DayTimeChips } from "@/components/sessions/DayTimeChips";
import { useSessionChoice } from "@/components/sessions/useSessionChoice";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { bookingHref } from "@/config/site";
import type { SessionDay, SessionSlot } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";

type SessionPickerProps = {
  locale: Locale;
  slug: string;
  days: SessionDay[];
  sessions: SessionSlot[];
  /** Already formatted: "120 lei · vin inclus". */
  price: string;
  t: Pick<
    Dictionary["posterBoard"],
    "day" | "time" | "full" | "pickPrompt" | "book"
  >;
};

/**
 * Day and time chips on a poster. Once both are picked, the CTA opens the
 * workshop page with that session preselected.
 */
export function SessionPicker({
  locale,
  slug,
  days,
  sessions,
  price,
  t,
}: SessionPickerProps) {
  const { day, time, setDay, setTime, times, session } =
    useSessionChoice(sessions);
  const dayLabel = days.find((d) => d.date === day)?.label;

  return (
    <>
      <DayTimeChips
        days={days}
        times={times}
        day={day}
        time={time}
        onDay={setDay}
        onTime={setTime}
        t={t}
      />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 border-t border-dashed border-navy pt-3">
        <span className="text-[1.0625rem]">{price}</span>
        {session && dayLabel ? (
          <Link
            href={bookingHref(locale, slug, session)}
            className={buttonClasses({ variant: "cherry", size: "sm" })}
          >
            {fill(t.book, { day: dayLabel, time: session.time })}
          </Link>
        ) : (
          <Eyebrow inline size="xs" tracking="tight" className="text-[#4B4B78]">
            {t.pickPrompt}
          </Eyebrow>
        )}
      </div>
    </>
  );
}
