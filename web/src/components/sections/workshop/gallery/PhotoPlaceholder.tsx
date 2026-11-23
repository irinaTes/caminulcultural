import type { CSSProperties } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

/** The same striped tints as the poster board's missing photos. */
const tints = [
  ["#E7D3A8", "#DFC793"],
  ["#D9C1C5", "#CEB1B7"],
  ["#C9CBE0", "#BCBFD7"],
];

type PhotoPlaceholderProps = {
  /** Picks the tint, so neighbouring frames differ. */
  index: number;
  /** "[FOTO 3]" */
  label: string;
  className?: string;
  style?: CSSProperties;
};

/** Striped stand-in for a gallery photo that hasn't been added yet. */
export function PhotoPlaceholder({
  index,
  label,
  className,
  style,
}: PhotoPlaceholderProps) {
  const [a, b] = tints[index % tints.length];
  return (
    <span
      aria-hidden="true"
      className={cn("flex items-center justify-center p-2", className)}
      style={{
        background: `repeating-linear-gradient(135deg, ${a} 0 16px, ${b} 16px 32px)`,
        ...style,
      }}
    >
      <Eyebrow inline size="xs" className="bg-cream px-2.5 py-1.75 text-navy">
        {label}
      </Eyebrow>
    </span>
  );
}
