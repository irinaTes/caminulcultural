import type { SVGProps } from "react";

/** Bordeaux "APROBAT" stamp with the cat's head, for the gift voucher. */
export function ApprovedStamp({
  label,
  ...props
}: SVGProps<SVGSVGElement> & { label: string }) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" {...props}>
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke="#6E1F2F"
        strokeWidth="3"
      />
      <circle
        cx="48"
        cy="48"
        r="36"
        fill="none"
        stroke="#6E1F2F"
        strokeWidth="1.5"
      />
      <g transform="translate(28 22) scale(0.6)">
        <path
          d="M3 42 L0 0 L21 18 Q33 14 45 18 L66 0 L63 42 Q63 68 33 68 Q3 68 3 42 Z"
          fill="#6E1F2F"
        />
        <ellipse cx="19" cy="40" rx="8" ry="6" fill="#F4ECDD" />
        <ellipse cx="47" cy="40" rx="8" ry="6" fill="#F4ECDD" />
        <path d="M19 35 Q22 40 19 45 Q16 40 19 35 Z" fill="#6E1F2F" />
        <path d="M47 35 Q50 40 47 45 Q44 40 47 35 Z" fill="#6E1F2F" />
      </g>
      <text
        x="48"
        y="80"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-label)" }}
        fontSize="9"
        // Same width in every language, inside the inner ring.
        textLength="44"
        lengthAdjust="spacingAndGlyphs"
        fill="#6E1F2F"
      >
        {label}
      </text>
    </svg>
  );
}
