import Link from "next/link";
import { StatusMessage } from "@/components/site/StatusMessage";
import { buttonClasses } from "@/components/ui/Button";
import { localizedPath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

/** For `notFound()` called by a page; unmatched URLs use global-not-found. */
export default async function NotFound() {
  const [locale, { errors: t }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center px-gutter py-20">
      <StatusMessage
        code="404"
        title={t.notFoundTitle}
        text={t.notFoundText}
        action={
          <Link
            href={localizedPath(locale)}
            className={buttonClasses({ variant: "glow" })}
          >
            {t.backHome}
          </Link>
        }
      />
    </main>
  );
}
