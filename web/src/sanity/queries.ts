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
  ] | order(startsAt asc) { _id, startsAt, seatsLeft, status }
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
    ${UPCOMING_SESSIONS}
  }
`);

export const WORKSHOP_SLUGS_QUERY = defineQuery(`
  *[_type == "workshop" && hidden != true && defined(slug.current)].slug.current
`);

/** Names of the visible workshops, for the rent and gift pickers. */
export const WORKSHOP_NAMES_QUERY = defineQuery(`
  *[_type == "workshop" && hidden != true] | order(orderRank) { _id, title }
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

/** One session and its workshop, re-read when someone books it. */
export const BOOKING_SESSION_QUERY = defineQuery(`
  *[_type == "session" && _id == $id][0] {
    _id,
    startsAt,
    seatsLeft,
    status,
    "workshop": workshop-> { _id, title, price, capacity, hidden }
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
