import "server-only";
import { sanityFetch } from "@/sanity/live";
import { REVIEWS_QUERY } from "@/sanity/queries";
import type { Review } from "./types";

/** Approved reviews for the register, newest first. */
export async function getReviews(): Promise<Review[]> {
  "use cache";

  const { data } = await sanityFetch({
    query: REVIEWS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data.map((review) => ({
    id: review._id,
    firstName: review.firstName,
    text: review.text,
    language: review.language,
    date: review.date,
  }));
}
