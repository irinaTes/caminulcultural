/**
 * What the review action returns to the form. Client-safe: no server code,
 * and no copy (the form turns these codes into dictionary text).
 */

export type ReviewField = "firstName" | "text" | "workshop";

export type ReviewState =
  | { status: "idle" }
  | { status: "invalid"; fields: ReviewField[] }
  /** rate: too many from this visitor; save: couldn't be stored. */
  | { status: "error"; reason: "rate" | "save" }
  | { status: "sent" };

export const initialReviewState: ReviewState = { status: "idle" };

/** At most this many characters, as in the Studio. */
export const REVIEW_MAX_LENGTH = 600;
