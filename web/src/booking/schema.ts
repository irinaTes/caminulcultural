import "server-only";
import { z } from "zod";
import { locales } from "@/i18n/config";
import type { BookingField } from "./state";

/** Upper bound for one booking, whatever the seats say. */
const MAX_PEOPLE = 15;

/** The booking form's fields, as the server accepts them. */
export const bookingSchema = z.object({
  session: z.string().trim().min(1).max(100),
  people: z.coerce.number().int().min(1).max(MAX_PEOPLE),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(200).pipe(z.email()),
  // Digits with the usual separators: "+40 712 345 678", "0712-345-678".
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ().-]{7,20}$/),
  note: z.string().trim().max(1000).optional().default(""),
  lang: z.enum(locales),
});

export type BookingInput = z.infer<typeof bookingSchema>;

/** Validates the submitted form; on failure, lists the fields to fix. */
export function parseBooking(formData: FormData) {
  const result = bookingSchema.safeParse({
    session: formData.get("session"),
    people: formData.get("people"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    note: formData.get("note") ?? undefined,
    lang: formData.get("lang"),
  });
  if (result.success) return { data: result.data } as const;

  const fields = [
    ...new Set(result.error.issues.map((issue) => issue.path[0])),
  ].filter((field): field is BookingField => field !== "lang");
  return { fields } as const;
}
