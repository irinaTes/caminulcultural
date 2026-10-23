import { PortableText } from "next-sanity";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type RichTextValue = ComponentProps<typeof PortableText>["value"];

type RichTextProps = {
  value: RichTextValue;
  className?: string;
};

/** Portable Text from Sanity: paragraphs, bullet lists, bold and italic. */
export function RichText({ value, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 text-lg leading-[1.6] [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
    >
      <PortableText value={value} />
    </div>
  );
}
