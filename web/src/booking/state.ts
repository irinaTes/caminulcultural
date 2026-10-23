/**
 * What the booking action returns to the form. Client-safe: no server code,
 * and no copy (the form turns these codes into dictionary text).
 */

export type BookingField =
  "session" | "people" | "name" | "email" | "phone" | "note";

export type BookingState =
  | { status: "idle" }
  /** Server-side validation failed for these fields. */
  | { status: "invalid"; fields: BookingField[] }
  | {
      status: "error";
      /**
       * - session: gone, cancelled, full or already started
       * - seats: fewer seats left than people asked for (`seatsLeft`)
       * - rate: too many requests from this visitor
       * - send: the email to us didn't go out
       */
      reason: "session" | "seats" | "rate" | "send";
      seatsLeft?: number;
    }
  | {
      status: "sent";
      workshop: string;
      /** "sâmbătă, 24 octombrie la 19:30" */
      when: string;
      people: number;
    };

export const initialBookingState: BookingState = { status: "idle" };

/** Name of the hidden anti-spam field. People never see it; bots fill it in. */
export const HONEYPOT_FIELD = "website";
