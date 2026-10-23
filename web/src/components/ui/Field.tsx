import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-none border-0 border-b-2 bg-transparent px-0 py-2 text-lg text-navy placeholder:text-navy/50 hover:border-navy focus:border-navy";

type FieldProps = {
  label: string;
  /** Shown under the field and linked to it; also marks it invalid. */
  error?: string;
  className?: string;
} & (
  | ({ multiline?: false } & ComponentProps<"input">)
  | ({ multiline: true } & ComponentProps<"textarea">)
);

/** A labelled text input (or textarea) with the underline style of a paper form. */
export function Field({
  label,
  error,
  className,
  multiline,
  ...props
}: FieldProps) {
  const id = useId();
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
  const style = cn(control, error ? "border-cherry" : "border-navy/50");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-[1.0625rem]">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          {...(props as ComponentProps<"textarea">)}
          {...a11y}
          className={cn(style, "resize-y")}
        />
      ) : (
        <input
          {...(props as ComponentProps<"input">)}
          {...a11y}
          className={style}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-base text-bordeaux">
          {error}
        </p>
      )}
    </div>
  );
}
