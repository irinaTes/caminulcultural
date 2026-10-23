import "server-only";
import { cacheTag } from "next/cache";
import { defineLive } from "next-sanity/live";
import { client } from "./client";

/** On every cache entry that holds Sanity content; the publish webhook revalidates it. */
export const contentCacheTag = "sanity-content";

const live = defineLive({
  client,
  strict: true,
  // Published content only for now; drafts preview would need viewer tokens.
  serverToken: false,
  browserToken: false,
});

export const { SanityLive } = live;

/**
 * Call inside a "use cache" function. The entry is refreshed two ways:
 * <SanityLive /> revalidates its Sanity tags while someone has the site open,
 * and the publish webhook (app/api/revalidate) revalidates `contentCacheTag`
 * for edits made while nobody's around.
 */
export const sanityFetch: typeof live.sanityFetch = (options) => {
  cacheTag(contentCacheTag);
  return live.sanityFetch(options);
};
