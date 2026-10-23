import type { SVGProps } from "react";

/** Navy cat asleep on the register (Condica). */
export function SleepingCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 84" aria-hidden="true" {...props}>
      <path
        className="origin-tail-left animate-tail-left"
        d="M18 78 Q2 70 8 56 Q12 46 24 50"
        fill="none"
        stroke="#1F206A"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M16 82 Q12 44 62 40 L110 40 Q118 40 120 50 L120 82 Z"
        fill="#1F206A"
      />
      <path
        d="M102 60 L99 22 L117 36 Q127 33 137 36 L155 22 L152 60 Q152 82 127 82 Q102 82 102 60 Z"
        fill="#1F206A"
      />
      <path
        d="M111 58 Q117 64 123 58"
        fill="none"
        stroke="#F4ECDD"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M131 58 Q137 64 143 58"
        fill="none"
        stroke="#F4ECDD"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M124 68 L130 68 L127 71 Z" fill="#F4ECDD" />
    </svg>
  );
}
