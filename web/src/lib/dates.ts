/**
 * Date helpers. A calendar day is a "2026-11-05" string, or the UTC-midnight
 * `Date` for it when it needs formatting, so day labels never shift with DST.
 */

/** The calendar date and wall-clock time of `instant` in `timeZone`. */
export function zonedDateTime(instant: string | Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    /** "2026-11-05" */
    date: `${part("year")}-${part("month")}-${part("day")}`,
    /** "19:30" */
    time: `${part("hour")}:${part("minute")}`,
  };
}

/** Short weekday, day and month without dots: "joi 5 nov" / "Thu 5 Nov". */
export function shortDayLabel(date: string, intlLocale: string) {
  const parts = new Intl.DateTimeFormat(intlLocale, {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(new Date(`${date}T00:00:00Z`));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value.replace(".", "") ?? "";
  return `${part("weekday")} ${part("day")} ${part("month")}`;
}

/** Numeric date for the register: "05.11.2026" / "05/11/2026". */
export function numericDate(date: string, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** Full date and time for emails: "sâmbătă, 24 octombrie la 19:30". */
export function longDateTime(
  instant: string,
  intlLocale: string,
  timeZone: string,
) {
  return new Intl.DateTimeFormat(intlLocale, {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(instant));
}
