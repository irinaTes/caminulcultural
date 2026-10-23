"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/**
 * Writes the pointer position over `ref` (0–1 on each axis) into two CSS
 * custom properties, at most once per frame and without React re-renders.
 */
export function usePointerVars<T extends HTMLElement>(
  ref: RefObject<T | null>,
  xVar: string,
  yVar: string,
) {
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el || frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty(
          xVar,
          ((clientX - rect.left) / rect.width).toFixed(3),
        );
        el.style.setProperty(
          yVar,
          ((clientY - rect.top) / rect.height).toFixed(3),
        );
      });
    },
    [ref, xVar, yVar],
  );
}
