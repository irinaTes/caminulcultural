import { defineQuery } from "next-sanity";

// Text fields come back as { ro, en } objects; pick a language with
// `localized()` from "@/sanity/localized".

/** A workshop's sessions that haven't started yet ($now), soonest first. */
const UPCOMING_SESSIONS = /* groq */ `
  "sessions": *[
    _type == "session"
    && workshop._ref == ^._id
    && status != "cancelled"
    && dateTime(startsAt) > dateTime($now)
  ] | order(startsAt asc) { _id, startsAt, capacity, status }
`;

const PHOTO = /* groq */ `
  "photo": photo {
    asset,
    hotspot,
    crop,
    alt,
    "lqip": asset->metadata.lqip
  }
`;

/** A workshop's photo wall, with each photo's size for its shape on the wall. */
const GALLERY = /* groq */ `
  "gallery": gallery[defined(asset)] {
    _key,
    asset,
    hotspot,
    crop,
    alt,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions { width, height }
  }
`;

/**
 * Visible workshops in the editor's order, each with its upcoming sessions.
 * Workshops with none are left off the board.
 */
export const POSTER_BOARD_QUERY = defineQuery(`
  *[_type == "workshop" && hidden != true] | order(orderRank) {
    _id,
    "slug": slug.current,
    title,
    verb,
    shortLine,
    price,
    durationHours,
    capacity,
    pinColor,
    ${PHOTO},
    ${UPCOMING_SESSIONS}
  }[count(sessions) > 0]
`);

export const WORKSHOP_PAGE_QUERY = defineQuery(`
  *[_type == "workshop" && slug.current == $slug && hidden != true][0] {
    _id,
    "slug": slug.current,
    title,
    verb,
    shortLine,
    description,
    price,
    durationHours,
    capacity,
    ${PHOTO},
    ${GALLERY},
    ${UPCOMING_SESSIONS}
  }
`);

export const WORKSHOP_SLUGS_QUERY = defineQuery(`
  *[_type == "workshop" && hidden != true && defined(slug.current)].slug.current
`);

/** Names of the visible workshops, for the rent and gift pickers. */
export const WORKSHOP_NAMES_QUERY = defineQuery(`
  *[_type == "workshop" && hidden != true] | order(orderRank) {
    _id,
    "slug": slug.current,
    title
  }
`);

/** Approved reviews for the register, newest first. */
export const REVIEWS_QUERY = defineQuery(`
  *[_type == "review" && published == true] | order(date desc)[0...8] {
    _id,
    firstName,
    text,
    language,
    date
  }
`);

/** Bookings that hold seats: waiting for confirmation or confirmed. */
const HOLDS_SEATS = /* groq */ `status in ["pending", "confirmed"]`;

/**
 * One session and its workshop, re-read when someone books it, with the
 * seats already held. Needs the private client: bookings aren't public.
 */
export const BOOKING_SESSION_QUERY = defineQuery(`
  *[_type == "session" && _id == $id][0] {
    _id,
    startsAt,
    capacity,
    status,
    "taken": math::sum(*[_type == "booking" && session._ref == ^._id && ${HOLDS_SEATS}].people),
    "workshop": workshop-> { _id, title, price, capacity, hidden }
  }
`);

/** Seats held per session, for the given sessions. Private client only. */
export const TAKEN_SEATS_QUERY = defineQuery(`
  *[_type == "booking" && session._ref in $ids && ${HOLDS_SEATS}] {
    "session": session._ref,
    people
  }
`);

/** One booking, re-read when its status changes, to tell the customer. Private client only. */
export const BOOKING_NOTICE_QUERY = defineQuery(`
  *[_type == "booking" && _id == $id][0] {
    _id,
    status,
    notifiedStatus,
    people,
    name,
    email,
    lang,
    "startsAt": session->startsAt,
    "workshop": session->workshop-> { title, price }
  }
`);

/** The people on the honour board, in the editor's order. */
export const TEAM_QUERY = defineQuery(`
  *[_id == "siteSettings"][0].team[] {
    _key,
    name,
    role,
    bio,
    ${PHOTO}
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0] {
    address,
    metroStation,
    email,
    whatsapp,
    instagram,
    company,
    promoCode
  }
`);
