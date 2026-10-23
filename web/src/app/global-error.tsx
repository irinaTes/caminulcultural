"use client"; // Error boundaries must be Client Components

import { StatusMessage } from "@/components/site/StatusMessage";
import { Button } from "@/components/ui/Button";
import en from "@/i18n/dictionaries/en";
import ro from "@/i18n/dictionaries/ro";
import { fontVariables } from "./fonts";
import "./globals.css";

// Replaces the root layout when it fails, so it can't know the locale and
// speaks both languages.
export default function GlobalError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="ro" className={fontVariables}>
      <body className="flex min-h-svh flex-col">
        <title>{ro.errors.errorTitle}</title>
        <main className="mx-auto flex w-full max-w-content flex-1 flex-wrap content-center gap-x-20 gap-y-14 px-gutter py-20">
          <StatusMessage
            code=":("
            title={ro.errors.errorTitle}
            text={ro.errors.errorText}
            action={
              <Button variant="glow" onClick={retry}>
                {ro.errors.retry}
              </Button>
            }
          />
          <StatusMessage
            secondary={{ lang: "en" }}
            code=":("
            title={en.errors.errorTitle}
            text={en.errors.errorText}
            action={
              <Button variant="glow" onClick={retry}>
                {en.errors.retry}
              </Button>
            }
          />
        </main>
      </body>
    </html>
  );
}
