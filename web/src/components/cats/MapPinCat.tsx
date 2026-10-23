import type { SVGProps } from "react";

/** Cream cat next to a red map pin (Getting here). */
export function MapPinCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 130 160" aria-hidden="true" {...props}>
      <path
        className="origin-tail animate-tail"
        d="M88 150 Q122 148 118 116 Q115 96 124 86"
        fill="none"
        stroke="#F4ECDD"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M38 80 Q20 112 26 154 Q60 160 94 154 Q100 112 82 80 Z"
        fill="#F4ECDD"
      />
      <path
        d="M30 62 L27 20 L48 38 Q60 34 72 38 L93 20 L90 62 Q90 88 60 88 Q30 88 30 62 Z"
        fill="#F4ECDD"
      />
      <ellipse cx="46" cy="60" rx="9" ry="6.5" fill="#E9B44C" />
      <ellipse cx="74" cy="60" rx="9" ry="6.5" fill="#E9B44C" />
      <path d="M46 54 Q49 60 46 66 Q43 60 46 54 Z" fill="#1F206A" />
      <path d="M74 54 Q77 60 74 66 Q71 60 74 54 Z" fill="#1F206A" />
      <path d="M57 72 L63 72 L60 75 Z" fill="#6E1F2F" />
      <path
        d="M60 100 C48 100 44 112 60 132 C76 112 72 100 60 100 Z"
        fill="#DF111F"
      />
      <circle cx="60" cy="110" r="4.5" fill="#F4ECDD" />
    </svg>
  );
}
