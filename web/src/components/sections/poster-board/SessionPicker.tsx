"use client";

import Link from "next/link";
import { SessionChips } from "@/components/sessions/SessionChips";
import { useSessionChoice } from "@/components/sessions/useSessionChoice";
import { buttonClasses } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { bookingHref } from "@/config/site";
import type { SessionDay, SessionSlot } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

type SessionPickerProps = {
  locale: Locale;
  slug: string;
  days: SessionDay[];
  sessions: SessionSlot[];
  /** Already formatted: "120 lei · vin inclus". */
  price: string;
  t: Pick<Dictionary["posterBoard"], "when" | "full" | "pickPrompt" | "book">;
};

/**
 * One chip per session on a poster. Once one is picked, the CTA opens the
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
  const { session, select } = useSessionChoice(sessions);
  const bookLabel = (s: SessionSlot) =>
    fill(t.book, {
      day: days.find((d) => d.date === s.date)?.label ?? "",
      time: s.time,
    });
  // The widest CTA this poster can show. It sits invisibly in the CTA slot so
  // the footer is already its final size before anything is picked.
  const widestLabel = sessions
    .filter((s) => !s.full)
    .map(bookLabel)
    .reduce<string | null>(
      (widest, label) =>
        !widest || label.length > widest.length ? label : widest,
      null,
    );

  return (
    <>
      <SessionChips
        days={days}
        sessions={sessions}
        selectedId={session?.id ?? null}
        onSelect={select}
        t={t}
      />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 border-t border-dashed border-navy pt-3">
        <span className="text-[1.0625rem]">{price}</span>
        {/* One grid cell, stacked layers: the invisible sizer fixes the size,
            the prompt or the CTA shows on top of it. */}
        <div className="grid items-center justify-items-end">
          {widestLabel && (
            <span
              aria-hidden="true"
              className={cn(
                buttonClasses({ variant: "cherry", size: "sm" }),
                "invisible col-start-1 row-start-1",
              )}
            >
              {widestLabel}
            </span>
          )}
          {session ? (
            <Link
              href={bookingHref(locale, slug, session)}
              className={cn(
                buttonClasses({ variant: "cherry", size: "sm" }),
                "col-start-1 row-start-1",
              )}
            >
              {bookLabel(session)}
            </Link>
          ) : (
            <Eyebrow
              inline
              size="xs"
              tracking="tight"
              className="col-start-1 row-start-1 text-[#4B4B78]"
            >
              {t.pickPrompt}
            </Eyebrow>
          )}
        </div>
      </div>
    </>
  );
}
