import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type StatusMessageProps = {
  /** Big number or word above the title, e.g. "404". */
  code: string;
  title: string;
  text: string;
  action: ReactNode;
  /** The second language on a bilingual page gets an `<h2>` and its `lang`. */
  secondary?: { lang: string };
  className?: string;
};

/** The 404 and error page message: code, title, a line of text and one action. */
export function StatusMessage({
  code,
  title,
  text,
  action,
  secondary,
  className,
}: StatusMessageProps) {
  const Heading = secondary ? "h2" : "h1";
  return (
    <section
      lang={secondary?.lang}
      className={cn("flex max-w-120 flex-col items-start gap-4", className)}
    >
      <p
        aria-hidden="true"
        className="font-display text-[clamp(4rem,12vw,7.5rem)] leading-none font-semibold text-cherry"
      >
        {code}
      </p>
      <Heading className="font-display text-[clamp(2rem,5vw,3rem)] leading-none font-semibold">
        {title}
      </Heading>
      <p className="text-xl leading-[1.55]">{text}</p>
      <div className="mt-2">{action}</div>
    </section>
  );
}
