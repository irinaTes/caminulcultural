import type { GalleryPhoto } from "@/data/types";

/** Where a photo sits on the wall, in grid cells (0-based). */
export type Placement = {
  col: number;
  row: number;
  colSpan: 1 | 2;
  rowSpan: number;
};

type Shape = "big" | "wide" | "tall" | "small";

/** Every seventh photo (the first included) asks for the big frame. */
const BIG_EVERY = 7;
/** At the bottom edge a frame may grow to this many rows to even the wall out. */
const MAX_ROW_SPAN = 3;

/** The size a photo asks for, from its place and shape. */
function preferredShape(photo: GalleryPhoto, index: number): Shape {
  if (index % BIG_EVERY === 0) return "big";
  const ratio = photo.width / photo.height;
  if (ratio >= 1.3) return "wide";
  if (ratio <= 0.8) return "tall";
  return "small";
}

/**
 * Packs the photos into `columns` columns with no holes inside the wall:
 * each photo goes to the shortest column, and only spans two columns when
 * the one beside it is level. A big photo that can't spread out stands tall
 * instead; a wide one becomes small. At the bottom, frames grow where they
 * can so the wall ends as evenly as possible.
 */
export function layoutWall(
  photos: GalleryPhoto[],
  columns: number,
): Placement[] {
  const heights = Array<number>(columns).fill(0);
  const placements: Placement[] = [];

  photos.forEach((photo, index) => {
    const shape = preferredShape(photo, index);
    const row = Math.min(...heights);
    const col = heights.indexOf(row);
    const canSpread = col + 1 < columns && heights[col + 1] === row;
    const colSpan = (shape === "big" || shape === "wide") && canSpread ? 2 : 1;
    const rowSpan = shape === "big" || shape === "tall" ? 2 : 1;

    placements.push({ col, row, colSpan, rowSpan });
    for (let c = col; c < col + colSpan; c++) heights[c] = row + rowSpan;
  });

  // Even out the bottom edge: grow each column's last frame towards the
  // tallest column, if that frame is the last one in every column it spans.
  const target = Math.max(...heights);
  for (let c = 0; c < columns; c++) {
    if (heights[c] === target) continue;
    const last = placements.findLast(
      (p) =>
        c >= p.col && c < p.col + p.colSpan && p.row + p.rowSpan === heights[c],
    );
    if (!last) continue;
    const bottom = last.row + last.rowSpan;
    const spanned = heights.slice(last.col, last.col + last.colSpan);
    const grown = Math.min(target - last.row, MAX_ROW_SPAN);
    if (spanned.every((h) => h === bottom) && grown > last.rowSpan) {
      last.rowSpan = grown;
      for (let s = last.col; s < last.col + last.colSpan; s++) {
        heights[s] = last.row + grown;
      }
    }
  }

  return placements;
}
