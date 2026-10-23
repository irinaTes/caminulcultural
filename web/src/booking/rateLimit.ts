import "server-only";

/**
 * A simple per-visitor limit: at most LIMIT requests in WINDOW_MS.
 *
 * It lives in the server's memory, so on serverless hosting each instance
 * counts on its own and a cold start forgets. That's enough to stop someone
 * hammering the form; a shared store (e.g. Upstash Redis) would make it exact.
 */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const hits = new Map<string, number[]>();

/** Records a request from `key` and says whether it's within the limit. */
export function allowRequest(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);

  // Forget idle visitors now and then, so the map doesn't grow forever.
  if (hits.size > 1000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}
