"use client";

import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import type { GalleryPhoto } from "@/data/types";
import { fill } from "@/i18n/format";
import { layoutWall, type Placement } from "./galleryLayout";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { GalleryViewer, type GalleryViewerText } from "./GalleryViewer";

type GalleryWallProps = {
  photos: GalleryPhoto[];
  t: GalleryViewerText & { open: string };
};

/** Frames lean a little, each its own way. */
const tilts = [-1.5, 1, -0.75, 1.75, -1.25, 0.5, 1.25, -1];

/** `grid-column` / `grid-row` values for one placement. */
const area = (p: Placement) => ({
  col: `${p.col + 1} / span ${p.colSpan}`,
  row: `${p.row + 1} / span ${p.rowSpan}`,
});

/**
 * A wall of framed photos in mixed sizes. Each frame is a button that opens
 * the viewer on that photo.
 */
export function GalleryWall({ photos, t }: GalleryWallProps) {
  const [open, setOpen] = useState<number | null>(null);
  // Two columns on a phone, four from md; each packed without holes.
  const [phone, wide] = useMemo(
    () => [layoutWall(photos, 2), layoutWall(photos, 4)],
    [photos],
  );

  return (
    <>
      <ul className="grid auto-rows-[9.5rem] grid-cols-2 gap-4 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-6 lg:auto-rows-[14rem]">
        {photos.map((photo, index) => {
          const small = area(phone[index]);
          const large = area(wide[index]);
          const sizes = `(min-width: 768px) ${wide[index].colSpan * 25}vw, ${phone[index].colSpan * 50}vw`;
          return (
            <li
              key={photo.id}
              style={
                {
                  "--col": small.col,
                  "--row": small.row,
                  "--md-col": large.col,
                  "--md-row": large.row,
                } as CSSProperties
              }
              className="[grid-column:var(--col)] [grid-row:var(--row)] md:[grid-column:var(--md-col)] md:[grid-row:var(--md-row)]"
            >
              <button
                type="button"
                onClick={() => setOpen(index)}
                aria-label={fill(t.open, { alt: photo.alt })}
                style={
                  {
                    "--tilt": `${tilts[index % tilts.length]}deg`,
                  } as CSSProperties
                }
                className="relative block size-full rotate-(--tilt) cursor-zoom-in bg-paper p-2 shadow-[0_12px_24px_rgba(20,21,74,0.22)] transition-[rotate,translate,box-shadow] duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_18px_30px_rgba(20,21,74,0.28)] focus-visible:rotate-0 sm:p-2.5"
              >
                {photo.src ? (
                  <span className="relative block size-full overflow-hidden">
                    <Image
                      src={photo.src}
                      alt=""
                      fill
                      sizes={sizes}
                      placeholder={photo.lqip ? "blur" : "empty"}
                      blurDataURL={photo.lqip ?? undefined}
                      style={{ objectPosition: photo.focus }}
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <PhotoPlaceholder
                    index={index}
                    label={fill(t.placeholder, { n: index + 1 })}
                    className="size-full"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <GalleryViewer
        photos={photos}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        t={t}
      />
    </>
  );
}
