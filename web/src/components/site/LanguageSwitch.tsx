import Link from "next/link";
import { localizedPath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

type LanguageSwitchProps = {
  locale: Locale;
  /** The current page's path without the locale prefix, e.g. "/dev". */
  path: string;
  t: Dictionary["common"];
  className?: string;
};

export function LanguageSwitch({
  locale,
  path,
  t,
  className,
}: LanguageSwitchProps) {
  const other: Locale = locale === "ro" ? "en" : "ro";
  return (
    <Link
      href={localizedPath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={t.switchLanguageLabel}
      className={cn(
        "font-label text-sm tracking-label uppercase underline-offset-4 hover:underline",
        className,
      )}
    >
      {t.switchLanguage}
    </Link>
  );
}
