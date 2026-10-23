"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function snapshot() {
  const rootSize = getComputedStyle(document.documentElement).fontSize;
  return `${window.innerWidth}px · html ${rootSize}`;
}

export function ScaleReadout() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "…");
  return <output className="font-label text-lg">{value}</output>;
}
