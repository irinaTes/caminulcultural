type StampProps = {
  ring: string;
  className?: string;
};

/** The rotating gold "31" stamp, with text running around the ring. */
export function Stamp({ ring, className }: StampProps) {
  return (
    <div aria-hidden="true" className={className}>
      <svg viewBox="0 0 150 150" className="block animate-spin-slow">
        <defs>
          <path
            id="hero-stamp-ring"
            d="M75 75 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0"
          />
        </defs>
        <circle
          cx="75"
          cy="75"
          r="72"
          fill="none"
          stroke="var(--color-glow)"
          strokeWidth="1.5"
        />
        <circle
          cx="75"
          cy="75"
          r="44"
          fill="none"
          stroke="var(--color-glow)"
          strokeWidth="1"
        />
        <text
          fontSize="10.5"
          letterSpacing="1.4"
          fill="var(--color-glow)"
          style={{ fontFamily: "var(--font-label)" }}
        >
          <textPath
            href="#hero-stamp-ring"
            textLength="364"
            lengthAdjust="spacing"
          >
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[2.875rem] font-semibold text-cream italic">
        31
      </span>
    </div>
  );
}
