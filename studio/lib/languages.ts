/** Content languages, in the order their fields appear. Romanian is the base language. */
export const languages = [
  {id: 'ro', title: 'Română'},
  {id: 'en', title: 'English'},
] as const

export type LanguageId = (typeof languages)[number]['id']

/** The site's time zone. Session times are entered and shown in it. */
export const siteTimeZone = 'Europe/Bucharest'

/** "Pictură în ulei" → "pictura-in-ulei": no diacritics, so slugs stay plain ASCII. */
export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/** "joi, 5 nov. 2026, 19:30" in Bucharest time. */
export function formatSessionTime(iso: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    timeZone: siteTimeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
