import { defaultLocale, type Locale } from "@/i18n/config";

type LocalizedValue<T> = { [L in Locale]?: T } | null | undefined;

/** The text in `locale`, falling back to Romanian when the translation is missing. */
export function localized(value: LocalizedValue<string>, locale: Locale) {
  return value?.[locale] || value?.[defaultLocale] || "";
}

/** Rich text in `locale`, with the same Romanian fallback. */
export function localizedBlocks<T>(
  value: LocalizedValue<T[]>,
  locale: Locale,
): T[] {
  const own = value?.[locale];
  return own?.length ? own : (value?.[defaultLocale] ?? []);
}
