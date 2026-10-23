import type { SVGProps } from "react";

/**
 * The hero lamp: cord, navy shade, gold bulb and a sleeping cat on the shade
 * with its tail hanging. Add `animate-lamp origin-top` to make it swing.
 */
export function HangingLamp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 190" aria-hidden="true" {...props}>
      <line
        x1="100"
        y1="0"
        x2="100"
        y2="100"
        stroke="#14154A"
        strokeWidth="2"
      />
      <path d="M56 150 Q100 80 144 150 Z" fill="#14154A" />
      <ellipse cx="100" cy="152" rx="18" ry="7" fill="#E9B44C" />
      <path
        className="origin-tail-hang animate-tail-hang"
        d="M72 110 Q60 128 64 148 Q66 160 59 170"
        fill="none"
        stroke="#14154A"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g transform="translate(64 78) scale(0.46)">
        <path
          d="M16 80 Q12 44 62 40 L110 40 Q118 40 120 50 L120 80 Z"
          fill="#14154A"
        />
        <path
          d="M102 60 L99 22 L117 36 Q127 33 137 36 L155 22 L152 60 Q152 82 127 82 Q102 82 102 60 Z"
          fill="#14154A"
        />
        <path
          d="M111 58 Q117 64 123 58"
          fill="none"
          stroke="#E9B44C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M131 58 Q137 64 143 58"
          fill="none"
          stroke="#E9B44C"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
