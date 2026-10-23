"use client";

import { useSearchParams } from "next/navigation";
import { bookingParams } from "@/config/site";
import { BookingForm, type BookingFormProps } from "./BookingForm";

/**
 * The booking form with the session from "?zi=…&ora=…" preselected. Reading
 * the URL needs a Suspense boundary; its fallback is the same form with
 * nothing selected, so the page stays static.
 */
export function BookingFormFromUrl(props: Omit<BookingFormProps, "initial">) {
  const params = useSearchParams();
  const date = params.get(bookingParams.day);
  const time = params.get(bookingParams.time);
  const initial = date && time ? { date, time } : null;

  // A new key resets the form when another session arrives in the URL.
  return <BookingForm key={`${date}-${time}`} {...props} initial={initial} />;
}
