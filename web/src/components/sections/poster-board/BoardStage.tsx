"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePointerVars } from "@/hooks/usePointerVars";

type BoardStageProps = {
  label: string;
  /** Posters, rendered into the track. */
  children: ReactNode;
  /** Cats and other things that sit on the frame. */
  decorations: ReactNode;
};

/** Desktop with motion allowed: the board pins and the posters scroll sideways. */
const PIN_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Three layouts, picked by media queries:
 * - mobile: posters stacked vertically, no pin;
 * - desktop with reduced motion: native horizontal scroll;
 * - desktop: full-viewport board pinned by GSAP ScrollTrigger while vertical
 *   scrolling moves the track horizontally. GSAP is imported only here.
 */
export function BoardStage({ label, children, decorations }: BoardStageProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const moveLight = usePointerVars(boardRef, "--bx", "--by");

  useEffect(() => {
    const media = window.matchMedia(PIN_QUERY);
    let revert: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      if (revert || !media.matches) return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || revert) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        const pin = pinRef.current;
        const viewport = viewportRef.current;
        const track = trackRef.current;
        if (!pin || !viewport || !track) return;

        // Scale the two rows to fit short screens (and grow a bit on tall ones).
        const fit = () =>
          Math.min(
            1.3,
            Math.max(0.45, (viewport.clientHeight - 24) / track.offsetHeight),
          );
        const distance = () =>
          Math.max(0, track.scrollWidth * fit() - viewport.clientWidth + 56);

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              gsap.set(track, { scale: fit(), transformOrigin: "0 50%" });
            },
          },
        });

        // Keyboard users: focusing a poster that is off-screen scrolls the page
        // to the point where that poster slides into view.
        const onFocus = (event: FocusEvent) => {
          // The browser scrolls the overflow-hidden viewport to reveal the
          // focused element; undo that, the transform does the revealing.
          const resetNativeScroll = () => viewport.scrollTo(0, 0);
          resetNativeScroll();
          requestAnimationFrame(resetNativeScroll);
          const st = tween.scrollTrigger;
          const card = (event.target as HTMLElement).closest<HTMLElement>(
            "[data-poster]",
          );
          if (!st || !card) return;
          const total = distance();
          if (!total) return;
          const progress = Math.min(
            1,
            Math.max(0, (card.offsetLeft * fit() - 24) / total),
          );
          const target = st.start + progress * (st.end - st.start);
          if (Math.abs(window.scrollY - target) > 4)
            window.scrollTo({ top: target });
        };
        track.addEventListener("focusin", onFocus);

        document.fonts.ready.then(() => ScrollTrigger.refresh());

        return () => {
          track.removeEventListener("focusin", onFocus);
          gsap.set(track, { clearProps: "transform" });
        };
      });
      revert = () => mm.revert();
    };

    start();
    media.addEventListener("change", start);
    return () => {
      cancelled = true;
      media.removeEventListener("change", start);
      revert?.();
    };
  }, []);

  return (
    // Wrapper keeps React's parent stable while ScrollTrigger adds its pin spacer.
    <div>
      <div
        ref={pinRef}
        className="relative md:h-svh md:overflow-hidden md:motion-reduce:h-auto"
      >
        <div
          ref={boardRef}
          onPointerMove={(e) => moveLight(e.clientX, e.clientY)}
          className="relative px-5.5 pt-10 pb-24 bg-cork-board md:absolute md:inset-0 md:p-0 md:motion-reduce:relative md:motion-reduce:py-10"
        >
          {decorations}
          <div
            ref={viewportRef}
            role="region"
            aria-label={label}
            tabIndex={-1}
            className="md:absolute md:inset-5.5 md:flex md:items-center md:overflow-hidden md:pl-14 md:motion-reduce:static md:motion-reduce:overflow-x-auto md:motion-reduce:pb-16"
          >
            <div
              ref={trackRef}
              className="relative flex flex-col gap-12 md:grid md:w-max md:flex-none md:auto-cols-[min(40rem,78vw)] md:grid-flow-col md:grid-rows-[repeat(2,auto)] md:gap-x-12 md:gap-y-14 md:py-5 md:pr-14 md:will-change-transform"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
