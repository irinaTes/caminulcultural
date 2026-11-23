"use client";

import { useState } from "react";
import type { SessionSlot } from "@/data/types";

/**
 * Picks one of a workshop's sessions. `initial` preselects a session (e.g.
 * from the URL); it's ignored if that session isn't on offer or is full.
 */
export function useSessionChoice(
  sessions: SessionSlot[],
  initial?: { date: string; time: string } | null,
) {
  const [selectedId, setSelectedId] = useState(
    () =>
      sessions.find(
        (s) => s.date === initial?.date && s.time === initial?.time && !s.full,
      )?.id ?? null,
  );

  const session = sessions.find((s) => s.id === selectedId && !s.full) ?? null;

  return { session, select: setSelectedId };
}
