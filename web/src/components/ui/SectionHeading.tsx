import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  /** Id for the `<h2>`, so the section can use `aria-labelledby`. */
  titleId: string;
  label: string;
  /** A string, or a node for a two-line title with an accent. */
  title: ReactNode;
  /** `dark` for sections on navy or bordeaux. */
  tone?: "light" | "dark";
  className?: string;
};

/** Numbered label over a big Fraunces title, as every section opens. */
export function SectionHeading({
  titleId,
  label,
  title,
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <Eyebrow className={tone === "dark" ? "text-glow" : "text-bordeaux"}>
        {label}
      </Eyebrow>
      <h2
        id={titleId}
        className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.02em]"
      >
        {title}
      </h2>
    </div>
  );
}
