"use client";

import { useSearchParams } from "next/navigation";
import { reviewParams } from "@/config/site";
import { ReviewForm, type ReviewFormProps } from "./ReviewForm";

/**
 * The form with the workshop from "?atelier=…" (the QR code on that
 * workshop's tables) preselected. Reading the URL needs a Suspense boundary;
 * its fallback is the same form with no workshop picked.
 */
export function ReviewFormFromUrl(props: Omit<ReviewFormProps, "initialSlug">) {
  const slug = useSearchParams().get(reviewParams.workshop);
  return <ReviewForm key={slug} {...props} initialSlug={slug} />;
}
