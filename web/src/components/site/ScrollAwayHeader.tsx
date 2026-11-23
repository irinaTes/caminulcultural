"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Near the top of the page the header always shows. */
const ALWAYS_SHOWN_BELOW = 120;
/** Scroll moves smaller than this are ignored, so the header doesn't flicker. */
const MIN_DELTA = 8;

type ScrollAwayHeaderProps = {
  className?: string;
  children: ReactNode;
};

/**
 * A sticky `<header>` that slides away while the page scrolls down and comes
 * back as soon as it scrolls up. It also comes back when keyboard focus
 * lands in it. While hidden it's moved up by its height plus the valance
 * hanging below it (1.75rem).
 *
 * It only moves while hidden: a `translate` on the header would become the
 * containing block of the mobile menu's fixed panel. The menu locks page
 * scroll while it's open, so the header can't hide then.
 */
export function ScrollAwayHeader({
  className,
  children,
}: ScrollAwayHeaderProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = Math.max(0, window.scrollY);
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y < ALWAYS_SHOWN_BELOW) {
        setHidden(false);
        last = y;
        return;
      }
      const delta = y - last;
      if (Math.abs(delta) < MIN_DELTA) return;
      setHidden(delta > 0);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={cn(
        "sticky top-0 z-30 transition-[translate] duration-300 ease-out",
        hidden && "-translate-y-[calc(100%+1.75rem)]",
        className,
      )}
    >
      {children}
    </header>
  );
}
