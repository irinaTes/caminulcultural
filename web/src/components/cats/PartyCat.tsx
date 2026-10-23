import type { SVGProps } from "react";

/** Cream cat with a party hat and a martini (Rent the Cămin). */
export function PartyCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 136 160" aria-hidden="true" {...props}>
      <path
        className="origin-tail-left animate-tail-left"
        d="M42 150 Q8 148 12 116 Q15 96 6 86"
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
      <path d="M48 37 L60 6 L72 37 Z" fill="#E9B44C" />
      <path d="M53 24 L67 24" stroke="#1F206A" strokeWidth="2.5" />
      <circle cx="60" cy="6" r="4.5" fill="#F4ECDD" />
      <ellipse cx="46" cy="60" rx="9" ry="6.5" fill="#E9B44C" />
      <ellipse cx="74" cy="60" rx="9" ry="6.5" fill="#E9B44C" />
      <path d="M46 54 Q49 60 46 66 Q43 60 46 54 Z" fill="#1F206A" />
      <path d="M74 54 Q77 60 74 66 Q71 60 74 54 Z" fill="#1F206A" />
      <path d="M57 72 L63 72 L60 75 Z" fill="#6E1F2F" />
      <path
        d="M100 92 L130 92 L115 110 Z"
        fill="none"
        stroke="#E9B44C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M102 95 L128 95 L115 108 Z" fill="#E9B44C" opacity="0.35" />
      <circle cx="110" cy="98" r="3.5" fill="#E9B44C" />
      <line
        x1="115"
        y1="110"
        x2="115"
        y2="132"
        stroke="#E9B44C"
        strokeWidth="3"
      />
      <line
        x1="105"
        y1="134"
        x2="125"
        y2="134"
        stroke="#E9B44C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="102" cy="122" rx="9" ry="7" fill="#F4ECDD" />
      <path
        d="M84 112 Q94 118 98 122"
        fill="none"
        stroke="#F4ECDD"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}
