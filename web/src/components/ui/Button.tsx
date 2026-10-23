import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "cream" | "glow" | "cherry" | "outline" | "outline-navy";
type Size = "sm" | "md" | "lg";

// Every variant has a 2px border (transparent on the solid ones), so all
// variants of a size are exactly the same size.
const variants: Record<Variant, string> = {
  cream: "border-transparent bg-cream text-navy hover:bg-glow",
  glow: "border-transparent bg-glow text-navy hover:bg-cream",
  cherry: "border-transparent bg-cherry text-cream hover:bg-bordeaux",
  outline: "border-cream text-cream hover:border-glow hover:text-glow",
  // For cream backgrounds.
  "outline-navy": "border-navy text-navy hover:bg-navy hover:text-cream",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2.25 text-base",
  md: "px-4.5 py-2.5 text-[1.0625rem]",
  lg: "px-6 py-3.25 text-[1.0625rem]",
};

type ButtonStyle = { variant?: Variant; size?: Size };

/** Pill button classes, for when the element isn't an `<a>` or `<button>` (e.g. `<Link>`). */
export function buttonClasses({ variant = "cream", size = "md" }: ButtonStyle) {
  return cn(
    "inline-flex items-center justify-center rounded-full border-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-55",
    variants[variant],
    sizes[size],
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"a"> & ButtonStyle) {
  return (
    <a className={cn(buttonClasses({ variant, size }), className)} {...props} />
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyle) {
  return (
    <button
      type={type}
      className={cn(
        buttonClasses({ variant, size }),
        "cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
