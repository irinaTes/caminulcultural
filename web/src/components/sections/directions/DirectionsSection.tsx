import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds, siteCity } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { getDictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";
import { cn } from "@/lib/cn";
import { instagramHref, mapsHref, whatsappHref } from "@/lib/links";
import { IllustratedMap } from "./IllustratedMap";

const titleId = `${sectionIds.directions}-title`;

type Contact = {
  key: string;
  label: string;
  /** null until the editor fills the detail in Sanity. */
  href: string | null;
  variant: "glow" | "outline";
  external?: boolean;
};

export async function DirectionsSection() {
  const [{ directions: t }, settings] = await Promise.all([
    getDictionary(),
    getSiteSettings(),
  ]);
  const { address, metroStation, instagram, whatsapp, email } = settings;

  const contacts: Contact[] = [
    {
      key: "instagram",
      label: `${t.instagram} ${instagram ? `@${instagram}` : t.instagramPlaceholder}`,
      href: instagram && instagramHref(instagram),
      variant: "glow",
      external: true,
    },
    {
      key: "whatsapp",
      label: `${t.whatsapp} ${whatsapp ?? t.whatsappPlaceholder}`,
      href: whatsapp && whatsappHref(whatsapp),
      variant: "outline",
      external: true,
    },
    {
      key: "email",
      label: email ?? `${t.email} ${t.emailPlaceholder}`,
      href: email && `mailto:${email}`,
      variant: "outline",
    },
  ];

  return (
    <section
      id={sectionIds.directions}
      aria-labelledby={titleId}
      className="bg-navy px-gutter py-42.5 text-cream max-md:py-30"
    >
      <div className="mx-auto flex max-w-350 flex-wrap gap-18 max-md:gap-12">
        <div className="flex min-w-0 flex-[1_1_23.75rem] flex-col gap-5.5">
          <SectionHeading
            titleId={titleId}
            tone="dark"
            label={t.label}
            title={t.title}
          />

          <address className="flex flex-col gap-2.5 text-xl leading-normal not-italic">
            <span>
              {address ?? t.addressPlaceholder}, {siteCity}
            </span>
            <span>
              {metroStation
                ? fill(t.metro, { station: metroStation })
                : t.metroPlaceholder}
            </span>
          </address>

          <ul aria-label={t.contactLabel} className="flex flex-wrap gap-3">
            {contacts.map((contact) => (
              <li key={contact.key}>
                {contact.href ? (
                  <ButtonLink
                    href={contact.href}
                    variant={contact.variant}
                    {...(contact.external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                  >
                    {contact.label}
                  </ButtonLink>
                ) : (
                  // A placeholder looks like the button it will become.
                  <span
                    className={cn(
                      buttonClasses({ variant: contact.variant }),
                      "pointer-events-none",
                    )}
                  >
                    {contact.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <figure className="flex min-h-85 min-w-0 flex-[1_1_27.5rem] flex-col overflow-hidden rounded-[10px] border-2 border-glow/60">
          <div className="relative min-h-65 flex-1">
            <IllustratedMap pinLabel={t.mapPin} />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 bg-navy-deep px-5 py-4">
            <span className="text-base text-cream/85">{t.mapNote}</span>
            {address ? (
              <ButtonLink
                href={mapsHref(`${address}, ${siteCity}`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="glow"
                size="sm"
              >
                {t.openMap}
              </ButtonLink>
            ) : (
              <span className="font-label text-[0.8125rem] tracking-label text-glow">
                {t.addressPlaceholder}
              </span>
            )}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
