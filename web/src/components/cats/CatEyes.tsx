import { cn } from "@/lib/cn";

type CatEyesProps = {
  className?: string;
};

/**
 * Two cream ovals with navy almond pupils. The pupils follow the `--mx` and
 * `--my` custom properties (0–1, pointer position) set on any ancestor:
 * ±18px horizontally and ±5px vertically, as in the mockup.
 */
export function CatEyes({ className }: CatEyesProps) {
  return (
    <div aria-hidden="true" className={cn("flex gap-5.5", className)}>
      {[0, 1].map((eye) => (
        <div
          key={eye}
          className="flex h-25 w-32 items-center justify-center overflow-hidden rounded-[50%] bg-cream shadow-[0_0_44px_rgba(244,236,221,0.4),inset_0_-6px_0_rgba(31,32,106,0.08)]"
        >
          <svg
            viewBox="13 6 14 32"
            preserveAspectRatio="none"
            className="block h-22.5 w-10 translate-x-[calc((var(--mx,0.5)-0.5)*36px)] translate-y-[calc((var(--my,0.5)-0.5)*10px)] transition-transform duration-[120ms] ease-linear"
          >
            <path
              d="M20 6 Q27 22 20 38 Q13 22 20 6Z"
              fill="var(--color-navy)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
