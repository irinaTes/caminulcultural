import "server-only";
import { defineLive } from "next-sanity/live";
import { client } from "./client";

// Call sanityFetch inside a "use cache" function: it tags the cache entry,
// and <SanityLive /> revalidates those tags when the content changes.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  strict: true,
  // Published content only for now; drafts preview would need viewer tokens.
  serverToken: false,
  browserToken: false,
});
