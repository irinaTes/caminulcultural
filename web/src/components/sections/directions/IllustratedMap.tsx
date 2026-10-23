import { MapPinCat } from "@/components/cats";

/**
 * A hand-drawn-looking city corner around the pin. It isn't the real street
 * plan (that's what the Google Maps link is for), so it's decorative.
 */
export function IllustratedMap({ pinLabel }: { pinLabel: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 size-full"
    >
      <rect width="480" height="360" fill="#1F206A" />

      {/* The river */}
      <path
        d="M-10 214 C80 186 140 246 240 220 S400 192 490 230"
        fill="none"
        stroke="#F4ECDD"
        strokeOpacity="0.12"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* Streets, with a dashed centre line on the busy ones */}
      <g fill="none" stroke="#14154A" strokeWidth="12" strokeLinecap="round">
        <path d="M-10 72 L490 58" />
        <path d="M-10 150 L490 164" />
        <path d="M-10 262 L490 248" />
        <path d="M-10 324 L490 334" />
        <path d="M68 -10 L86 370" />
        <path d="M170 -10 L158 370" />
        <path d="M302 -10 L316 370" />
        <path d="M414 -10 L398 370" />
        <path d="M-10 368 L490 18" strokeWidth="16" />
      </g>
      <g
        fill="none"
        stroke="#F4ECDD"
        strokeOpacity="0.25"
        strokeWidth="1.2"
        strokeDasharray="6 7"
      >
        <path d="M-10 150 L490 164" />
        <path d="M-10 368 L490 18" />
      </g>

      {/* A small park */}
      <ellipse
        cx="372"
        cy="104"
        rx="30"
        ry="22"
        fill="#F4ECDD"
        fillOpacity="0.07"
      />

      {/* From the metro to the door */}
      <path
        d="M118 270 L162 258 L166 202 L246 194"
        fill="none"
        stroke="#E9B44C"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 9"
      />
      <circle cx="118" cy="270" r="14" fill="#F4ECDD" />
      <text
        x="118"
        y="275.5"
        textAnchor="middle"
        fontSize="15"
        fontWeight="500"
        fill="#1F206A"
        style={{ fontFamily: "var(--font-label)" }}
      >
        M
      </text>

      {/* The cat and the pin; the pin's tip lands at about (246, 194). */}
      <MapPinCat x="186" y="56" width="120" height="148" />

      <g transform="rotate(-4 344 70)">
        <rect x="292" y="52" width="104" height="34" rx="3" fill="#F4ECDD" />
        <text
          x="344"
          y="75"
          textAnchor="middle"
          fontSize="18"
          fontStyle="italic"
          fontWeight="600"
          fill="#6E1F2F"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pinLabel}
        </text>
      </g>
    </svg>
  );
}
