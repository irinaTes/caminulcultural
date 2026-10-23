import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { contentCacheTag } from "@/sanity/live";

/**
 * Sanity webhook, called on every publish, update or delete (see README).
 * Expires all cached content, so the next visit renders fresh data even if
 * nobody had the site open to receive the live update.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json(
      { message: "SANITY_REVALIDATE_SECRET is not set" },
      { status: 500 },
    );
  }

  // Also waits until the change is readable from the API.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret,
    true,
  );
  if (!isValidSignature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(contentCacheTag, { expire: 0 });
  return Response.json({ revalidated: true, type: body?._type ?? null });
}
