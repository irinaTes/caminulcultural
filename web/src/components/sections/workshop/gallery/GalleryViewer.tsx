"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { GalleryPhoto } from "@/data/types";
import { fill } from "@/i18n/format";
import { PhotoPlaceholder } from "./PhotoPlaceholder";

export type GalleryViewerText = {
  dialog: string;
  previous: string;
  next: string;
  close: string;
  /** "{n} din {total}" */
  counter: string;
  /** "[FOTO {n}]", on frames without a photo yet. */
  placeholder: string;
};

type GalleryViewerProps = {
  photos: GalleryPhoto[];
  /** The photo on show, or null while the viewer is closed. */
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
  t: GalleryViewerText;
};

/** A horizontal swipe longer than this (px) changes the photo. */
const SWIPE = 50;

const roundButton =
  "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-cream/70 bg-navy-deep/60 text-cream transition-colors hover:border-glow hover:text-glow";

/**
 * Full-screen viewer over a modal `<dialog>`: it traps focus, closes on
 * Escape and gives focus back to the frame that opened it. Arrow keys and
 * swipes go through the photos, and both ends wrap around.
 */
export function GalleryViewer({
  photos,
  index,
  onIndex,
  onClose,
  t,
}: GalleryViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const isOpen = index !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    dialog.showModal();
    // A modal dialog doesn't stop the page behind it from scrolling.
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const count = photos.length;
  const go = (step: number) => {
    if (index === null) return;
    onIndex((index + step + count) % count);
  };

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") go(-1);
    else if (event.key === "ArrowRight") go(1);
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType !== "mouse") swipeStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (start === null) return;
    const distance = event.clientX - start;
    if (Math.abs(distance) > SWIPE) go(distance < 0 ? 1 : -1);
  }

  const photo = index === null ? null : photos[index];
  // The neighbours load in the background, so next/previous show at once.
  const neighbours =
    index === null || count < 2
      ? []
      : [...new Set([(index + 1) % count, (index - 1 + count) % count])]
          .map((i) => photos[i])
          .filter((n): n is GalleryPhoto & { src: string } => n.src !== null);

  return (
    <dialog
      ref={dialogRef}
      aria-label={t.dialog}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="m-0 h-svh max-h-none w-screen max-w-none flex-col bg-navy-deep p-0 text-cream backdrop:bg-transparent open:flex"
    >
      {photo && index !== null && (
        <>
          <div className="flex items-center justify-between gap-4 px-gutter pt-4 pb-3">
            <Eyebrow inline size="xs" className="text-cream/80">
              {fill(t.counter, { n: index + 1, total: count })}
            </Eyebrow>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className={roundButton}
            >
              <CloseIcon />
            </button>
          </div>

          <figure className="flex min-h-0 flex-1 flex-col gap-4 px-gutter pb-6">
            <div
              className="[container-type:size] relative flex min-h-0 flex-1 touch-pan-y items-center justify-center"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (swipeStart.current = null)}
            >
              {photo.src ? (
                <Image
                  key={photo.id}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              ) : (
                // As large as fits, in the frame's shape (container units).
                <PhotoPlaceholder
                  index={index}
                  label={fill(t.placeholder, { n: index + 1 })}
                  style={{
                    aspectRatio: `${photo.width} / ${photo.height}`,
                    width: `min(100cqw, 100cqh * ${photo.width / photo.height})`,
                  }}
                />
              )}

              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={t.previous}
                    className={`${roundButton} absolute top-1/2 left-0 -translate-y-1/2 max-sm:hidden`}
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={t.next}
                    className={`${roundButton} absolute top-1/2 right-0 -translate-y-1/2 max-sm:hidden`}
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t.previous}
                  className={`${roundButton} sm:hidden`}
                >
                  <ArrowIcon direction="left" />
                </button>
              )}
              <figcaption
                aria-live="polite"
                className="mx-auto max-w-160 text-center text-lg leading-snug text-cream/90"
              >
                {photo.alt}
              </figcaption>
              {count > 1 && (
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t.next}
                  className={`${roundButton} sm:hidden`}
                >
                  <ArrowIcon direction="right" />
                </button>
              )}
            </div>
          </figure>

          <div aria-hidden="true" className="hidden">
            {neighbours.map((n) => (
              <Image
                key={n.id}
                src={n.src}
                alt=""
                width={n.width}
                height={n.height}
                sizes="100vw"
                loading="eager"
              />
            ))}
          </div>
        </>
      )}
    </dialog>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 5l-7 7 7 7" />
      ) : (
        <path d="M9 5l7 7-7 7" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
