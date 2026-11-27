import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { contentCacheTag, sanityFetch } from "@/sanity/live";
import { privateClient } from "@/sanity/privateClient";
import { REVIEWS_QUERY } from "@/sanity/queries";
import type { Review } from "./types";

/**
 * Approved reviews for the register, newest first.
 *
 * The ones sent from the site have a private id ("review.…"), so they're
 * read with the private client. SanityLive can't see those: approving one
 * shows through the publish webhook, or within the minute.
 */
export async function getReviews(): Promise<Review[]> {
  "use cache";

  let data;
  if (privateClient) {
    cacheTag(contentCacheTag);
    cacheLife("minutes");
    data = await privateClient.fetch(REVIEWS_QUERY);
  } else {
    // A fresh checkout without the token: the public ones only.
    ({ data } = await sanityFetch({
      query: REVIEWS_QUERY,
      perspective: "published",
      stega: false,
    }));
  }

  return data.map((review) => ({
    id: review._id,
    firstName: review.firstName,
    text: review.text,
    language: review.language,
    date: review.date,
  }));
}
