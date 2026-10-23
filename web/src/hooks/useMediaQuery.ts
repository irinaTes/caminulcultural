"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a media query matches. Renders `serverValue` on the server and
 * during hydration, then follows the browser.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}
