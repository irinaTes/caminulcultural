import type { SVGProps } from "react";

/** Paw-print signature used in the register. */
export function PawPrint(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" {...props}>
      <ellipse cx="15" cy="20" rx="7" ry="6" fill="#1F206A" />
      <circle cx="6" cy="12" r="3" fill="#1F206A" />
      <circle cx="11.5" cy="6.5" r="3" fill="#1F206A" />
      <circle cx="18.5" cy="6.5" r="3" fill="#1F206A" />
      <circle cx="24" cy="12" r="3" fill="#1F206A" />
    </svg>
  );
}
