import Link from "next/link";
import { SexyCat } from "@/components/cats";
import { legalPaths } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { localizedPath } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

/** The company name in the brief, until the editor sets one in Sanity. */
const DEFAULT_COMPANY = "Subcultura SRL";

export async function Footer() {
  const [locale, { footer: t }, { company }] = await Promise.all([
    getLocale(),
    getDictionary(),
    getSiteSettings(),
  ]);
  const links = [
    { href: legalPaths.terms, label: t.terms },
    { href: legalPaths.privacy, label: t.privacy },
    { href: legalPaths.cancellation, label: t.cancellation },
  ];

  return (
    <footer className="bg-cream px-gutter pt-37.5 pb-14 max-md:pt-28">
      <div className="mx-auto flex max-w-350 flex-col gap-22 max-md:gap-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <p className="font-display text-[clamp(3.25rem,10vw,8.75rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-cherry">
            {t.seeYou}
            <br />
            <em className="font-light">{t.seeYouAccent}</em>
          </p>
          <SexyCat className="-mb-11 ml-auto w-53.5 max-sm:w-40" />
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-4 border-t-2 border-navy pt-5.5 text-base">
          <p>
            {fill(t.company, {
              company: company.legalName ?? DEFAULT_COMPANY,
              cui: company.cui ?? t.cuiPlaceholder,
            })}
          </p>
          <nav aria-label={t.legalLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizedPath(locale, link.href)}
                    className="underline underline-offset-4 hover:text-cherry"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
