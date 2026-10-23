import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Size = "xs" | "sm" | "md";
type Tracking = "tight" | "normal" | "wide";

const sizes: Record<Size, string> = {
  xs: "text-[0.6875rem]",
  sm: "text-xs",
  md: "text-[0.8125rem]",
};

const trackings: Record<Tracking, string> = {
  tight: "tracking-[0.1em]",
  normal: "tracking-label",
  wide: "tracking-label-wide",
};

type EyebrowProps = ComponentProps<"p"> & {
  size?: Size;
  /** Defaults to wide for `md`, normal otherwise. */
  tracking?: Tracking;
  /** Render as a `<span>`, e.g. for a label inside a group or a button. */
  inline?: boolean;
  /** Another element where the markup needs one, e.g. `dt` in a list of facts. */
  as?: "dt";
};

/**
 * Small DM Mono uppercase label: "01 · AFIȘIERUL", "ZIUA", hints.
 * Font size and tracking are props rather than `className` overrides, since
 * two conflicting utilities in one class list don't reliably override.
 */
export function Eyebrow({
  size = "md",
  tracking = size === "md" ? "wide" : "normal",
  inline,
  as,
  className,
  ...props
}: EyebrowProps) {
  const Tag = as ?? (inline ? "span" : "p");
  return (
    <Tag
      className={cn(
        "font-label uppercase",
        sizes[size],
        trackings[tracking],
        className,
      )}
      {...props}
    />
  );
}
