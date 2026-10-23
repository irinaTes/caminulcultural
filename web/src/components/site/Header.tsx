import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { sectionHref, sectionIds, type SectionId } from "@/config/site";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";

type HeaderProps = {
  /** The current page's path without the locale prefix, for the language switch. */
  path?: string;
};

export async function Header({ path = "/" }: HeaderProps) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.nav;
  // Full hrefs ("/#afisier"), so the links also work from other pages.
  const href = (id: SectionId) => sectionHref(locale, id);
  const links = [
    { href: href(sectionIds.poster), label: t.poster },
    { href: href(sectionIds.rent), label: t.rent },
    { href: href(sectionIds.gift), label: t.gift },
    { href: href(sectionIds.register), label: t.register },
    { href: href(sectionIds.directions), label: t.directions },
  ];
  const contact = { href: href(sectionIds.directions), label: t.contact };
  const languageSwitch = (
    <LanguageSwitch
      locale={locale}
      path={path}
      t={dict.common}
      className="text-cream"
    />
  );

  return (
    <header className="relative z-20 bg-linear-to-b from-drape-dark via-[#5A1726] via-70% to-drape px-gutter pt-5 pb-5.5 text-cream shadow-[inset_0_-3px_0_rgba(233,180,76,0.75)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-5.5 h-5.5 valance"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-6.25 h-1 opacity-80 valance-beads"
      />

      <div className="mx-auto flex max-w-350 items-center justify-between gap-x-8 gap-y-4.5">
        <a
          href={href(sectionIds.home)}
          aria-label={dict.common.homeLabel}
          className="flex items-center gap-3.5 text-cream"
        >
          <Logo className="block w-16 sm:w-21" />
          <span className="font-label text-xs leading-snug tracking-label uppercase">
            {t.brandLine1}
            <br />
            {t.brandLine2}
          </span>
        </a>

        <nav aria-label={t.label} className="hidden lg:block">
          <ul className="flex flex-wrap gap-x-6.5 gap-y-1.5 text-[1.0625rem]">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2.5 text-cream underline-offset-6 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          {languageSwitch}
          <ButtonLink href={contact.href} variant="glow">
            {contact.label}
          </ButtonLink>
        </div>

        <MobileMenu
          links={links}
          contact={contact}
          labels={{ nav: t.label, open: t.openMenu, close: t.closeMenu }}
        >
          {languageSwitch}
        </MobileMenu>
      </div>
    </header>
  );
}
