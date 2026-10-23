import "server-only";
import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/ro";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ro: () => import("./dictionaries/ro").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary() {
  return dictionaries[await getLocale()]();
}

/** For code outside a page render, e.g. an email in the visitor's language. */
export function getDictionaryFor(locale: Locale) {
  return dictionaries[locale]();
}
