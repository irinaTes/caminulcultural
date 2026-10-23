import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { StatusMessage } from "@/components/site/StatusMessage";
import { buttonClasses } from "@/components/ui/Button";
import { localizedPath } from "@/i18n/config";
import en from "@/i18n/dictionaries/en";
import ro from "@/i18n/dictionaries/ro";
import { fontVariables } from "./fonts";
import "./globals.css";

// Unmatched URLs have no locale, so this page speaks both languages.
export const metadata: Metadata = {
  title: `404 · ${ro.meta.title}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="ro" className={fontVariables}>
      <body className="flex min-h-svh flex-col">
        <main className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center gap-14 px-gutter py-20">
          <Link
            href="/"
            aria-label={ro.common.homeLabel}
            className="w-20 text-bordeaux"
          >
            <Logo className="block w-full" />
          </Link>
          <div className="flex flex-wrap gap-x-20 gap-y-14">
            <StatusMessage
              code="404"
              title={ro.errors.notFoundTitle}
              text={ro.errors.notFoundText}
              action={
                <Link
                  href={localizedPath("ro")}
                  className={buttonClasses({ variant: "glow" })}
                >
                  {ro.errors.backHome}
                </Link>
              }
            />
            <StatusMessage
              secondary={{ lang: "en" }}
              code="404"
              title={en.errors.notFoundTitle}
              text={en.errors.notFoundText}
              action={
                <Link
                  href={localizedPath("en")}
                  hrefLang="en"
                  className={buttonClasses({ variant: "glow" })}
                >
                  {en.errors.backHome}
                </Link>
              }
            />
          </div>
        </main>
      </body>
    </html>
  );
}
