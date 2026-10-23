import { cn } from "@/lib/cn";

type StepButtonProps = {
  /** Spoken name, e.g. "Mai puțini oameni". */
  label: string;
  disabled: boolean;
  onClick: () => void;
  /** "−" or "+", hidden from screen readers. */
  children: string;
  tone?: "light" | "dark";
};

/** Round −/+ button of a number stepper. */
export function StepButton({
  label,
  disabled,
  onClick,
  children,
  tone = "light",
}: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-11 cursor-pointer items-center justify-center rounded-full border-2 text-2xl leading-none transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent",
        tone === "light"
          ? "border-navy hover:bg-navy hover:text-cream disabled:border-navy/30 disabled:text-navy/40"
          : "border-cream text-cream hover:bg-cream hover:text-navy disabled:border-cream/30 disabled:text-cream/40",
      )}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
