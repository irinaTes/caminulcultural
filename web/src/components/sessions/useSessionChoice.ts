"use client";

import { useState } from "react";
import type { SessionSlot } from "@/data/types";

export type TimeOption = {
  time: string;
  /** Full on every day still in play. */
  full: boolean;
  /** Seats left, once a day is picked and the editor tracks them. */
  seatsLeft: number | null;
};

/**
 * Day-then-time selection over a workshop's sessions. `initial` preselects a
 * session (e.g. from the URL); it's ignored if that day isn't on offer.
 */
export function useSessionChoice(
  sessions: SessionSlot[],
  initial?: { date: string; time: string } | null,
) {
  const offered = initial && sessions.some((s) => s.date === initial.date);
  const [day, setDay] = useState(offered ? initial.date : null);
  const [time, setTime] = useState(offered ? initial.time : null);

  const inPlay = sessions.filter((s) => !day || s.date === day);
  const times: TimeOption[] = [...new Set(inPlay.map((s) => s.time))].map(
    (value) => {
      const matching = inPlay.filter((s) => s.time === value);
      return {
        time: value,
        full: matching.every((s) => s.full),
        seatsLeft: day ? (matching[0]?.seatsLeft ?? null) : null,
      };
    },
  );
  const session =
    sessions.find((s) => s.date === day && s.time === time && !s.full) ?? null;

  return { day, time, setDay, setTime, times, session };
}
