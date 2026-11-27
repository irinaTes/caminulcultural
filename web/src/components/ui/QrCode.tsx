import { encode } from "uqr";
import { cn } from "@/lib/cn";

type QrCodeProps = {
  value: string;
  /** Accessible name, e.g. where the code leads. */
  label: string;
  className?: string;
};

/** Modules of quiet zone around the code, as scanners expect. */
const QUIET = 4;

/**
 * A QR code as one SVG path, drawn on the server in the current text colour
 * (keep it dark on a light background, or phones won't read it).
 */
export function QrCode({ value, label, className }: QrCodeProps) {
  const { data, size } = encode(value, { ecc: "M", border: 0 });
  const total = size + QUIET * 2;
  let d = "";
  data.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
    }),
  );

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className={cn("block", className)}
    >
      <rect width={total} height={total} fill="#FFFFFF" />
      <path d={d} fill="currentColor" />
    </svg>
  );
}
