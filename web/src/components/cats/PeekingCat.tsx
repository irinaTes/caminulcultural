import type { SVGProps } from "react";

/** Cat peeking over the bottom edge of the poster board (wrap it in a labelled button). */
export function PeekingCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 56 48" aria-hidden="true" {...props}>
      <path
        d="M6 46 L6 10 L17 20 Q28 16 39 20 L50 10 L50 46 Z"
        fill="#14154A"
      />
      <ellipse cx="20" cy="31" rx="4" ry="3" fill="#E9B44C" />
      <ellipse cx="36" cy="31" rx="4" ry="3" fill="#E9B44C" />
      <rect x="19" y="28.5" width="2" height="5" rx="1" fill="#14154A" />
      <rect x="35" y="28.5" width="2" height="5" rx="1" fill="#14154A" />
    </svg>
  );
}
