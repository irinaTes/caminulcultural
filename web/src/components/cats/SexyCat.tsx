import type { SVGProps } from "react";

/** Slender navy footer cat: half-closed eyes, gold choker with a pearl, S-shaped tail. */
export function SexyCat(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 220" aria-hidden="true" {...props}>
      <path
        className="origin-tail animate-tail"
        d="M110 206 C156 200 154 148 130 128 C114 114 122 90 141 86"
        fill="none"
        stroke="#1F206A"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M64 90 C53 118 46 150 50 178 C52 196 60 206 74 208 L120 208 C128 206 130 196 122 186 C113 175 113 160 109 146 C104 126 95 106 88 90 Z"
        fill="#1F206A"
      />
      <path d="M60 146 L57 207 L67 207 L71 150 Z" fill="#1F206A" />
      <path d="M74 148 L75 207 L85 207 L83 148 Z" fill="#1F206A" />
      <path
        d="M54 58 L49 20 L68 39 Q76 37 84 39 L103 20 L98 58 Q98 82 76 89 Q54 82 54 58 Z"
        fill="#1F206A"
      />
      <path d="M58 60 Q66 53.5 74 60 Q66 64.5 58 60 Z" fill="#F4ECDD" />
      <path d="M78 60 Q86 53.5 94 60 Q86 64.5 78 60 Z" fill="#F4ECDD" />
      <path d="M66 56.5 Q67.6 60 66 63.2 Q64.4 60 66 56.5 Z" fill="#1F206A" />
      <path d="M86 56.5 Q87.6 60 86 63.2 Q84.4 60 86 56.5 Z" fill="#1F206A" />
      <path
        d="M56.5 60.2 Q66 51 75.5 60.2 Q66 57.6 56.5 60.2 Z"
        fill="#1F206A"
      />
      <path
        d="M76.5 60.2 Q86 51 95.5 60.2 Q86 57.6 76.5 60.2 Z"
        fill="#1F206A"
      />
      <path
        d="M58 60 L52.5 56.5 M58.2 60.6 L52.5 60"
        stroke="#F4ECDD"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M94 60 L99.5 56.5 M93.8 60.6 L99.5 60"
        stroke="#F4ECDD"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M74 70 L78 70 L76 72.6 Z" fill="#F4ECDD" />
      <path
        d="M72.5 75 Q74.5 77.2 76 74.6 Q77.5 77.2 79.5 75"
        fill="none"
        stroke="#F4ECDD"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M66 73 L50 70 M66 75.5 L51 77 M86 73 L102 70 M86 75.5 L101 77"
        stroke="#F4ECDD"
        strokeWidth="0.9"
        opacity="0.7"
        strokeLinecap="round"
      />
      <path
        d="M60 85 Q76 95 92 85"
        fill="none"
        stroke="#E9B44C"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="76" cy="93.5" r="3.4" fill="#E9B44C" />
    </svg>
  );
}
