import "server-only";
import { z } from "zod";
import { locales } from "@/i18n/config";
import { REVIEW_MAX_LENGTH, type ReviewField } from "./state";

/** No links: a review is read by us first, but spam shouldn't get that far. */
const noLinks = (value: string) => !/https?:|www\.|:\/\//i.test(value);

export const reviewSchema = z.object({
  // Just a first name: no links, addresses or markup.
  firstName: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .refine((name) => !/[/@<>:\\]|\.\p{L}{2}/iu.test(name)),
  text: z.string().trim().min(10).max(REVIEW_MAX_LENGTH).refine(noLinks),
  // A workshop id from the list, or nothing.
  workshop: z
    .string()
    .trim()
    .max(100)
    .regex(/^[\w.-]*$/)
    .optional()
    .default(""),
  lang: z.enum(locales),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export function parseReview(formData: FormData) {
  const result = reviewSchema.safeParse({
    firstName: formData.get("firstName"),
    text: formData.get("text"),
    workshop: formData.get("workshop") ?? undefined,
    lang: formData.get("lang"),
  });
  if (result.success) return { data: result.data } as const;

  const fields = [
    ...new Set(result.error.issues.map((issue) => issue.path[0])),
  ].filter((field): field is ReviewField => field !== "lang");
  return { fields } as const;
}
