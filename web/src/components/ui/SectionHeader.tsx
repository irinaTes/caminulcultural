import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SectionHeading } from "./SectionHeading";

type SectionHeaderProps = {
  /** Id for the `<h2>`, so the section can use `aria-labelledby`. */
  titleId: string;
  label: string;
  title: string;
  intro?: string;
  /** Shown on the right on wide screens (e.g. a scroll hint). */
  aside?: ReactNode;
  /** `dark` for sections on navy or bordeaux. */
  tone?: "light" | "dark";
  className?: string;
};

/** Full-width section opening: the heading, an intro line and an optional aside. */
export function SectionHeader({
  titleId,
  label,
  title,
  intro,
  aside,
  tone = "light",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-350 flex-wrap items-end justify-between gap-x-10 gap-y-6 px-gutter",
        className,
      )}
    >
      <div className="flex max-w-160 flex-col gap-3.5">
        <SectionHeading
          titleId={titleId}
          label={label}
          title={title}
          tone={tone}
        />
        {intro && <p className="max-w-115 text-xl leading-[1.55]">{intro}</p>}
      </div>
      {aside}
    </div>
  );
}
