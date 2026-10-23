import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Tone = "light" | "dark";

const tones: Record<Tone, { base: string; on: string; off: string }> = {
  // Mono label chips on cream: days, times.
  light: {
    base: "px-3.5 py-2.5 font-label text-[0.8125rem] tracking-[0.04em] disabled:cursor-not-allowed disabled:border-dashed disabled:border-navy/30 disabled:text-navy/60",
    on: "border-navy bg-navy text-cream",
    off: "border-navy/40 text-navy hover:border-navy",
  },
  // Word chips on navy or bordeaux: occasions, workshops, voucher type.
  dark: {
    base: "px-4 py-2.5 text-[1.0625rem]",
    on: "border-glow bg-glow text-navy",
    off: "border-cream/55 text-cream hover:border-cream",
  },
};

type ChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  pressed: boolean;
  tone?: Tone;
};

/** A toggle chip (day, time, option). Group several in a `role="group"`. */
export function Chip({
  pressed,
  tone = "light",
  className,
  ...props
}: ChipProps) {
  const style = tones[tone];
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "min-h-11 cursor-pointer rounded-full border-2 transition-colors",
        style.base,
        pressed ? style.on : style.off,
        className,
      )}
      {...props}
    />
  );
}
