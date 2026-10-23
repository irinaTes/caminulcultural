import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { getWorkshopNames } from "@/data/workshops";
import { intlLocales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { GiftVoucher } from "./GiftVoucher";

const titleId = `${sectionIds.gift}-title`;

export async function GiftSection() {
  const locale = await getLocale();
  const [dict, workshops, { email }] = await Promise.all([
    getDictionary(),
    getWorkshopNames(locale),
    getSiteSettings(),
  ]);
  const { label, title, intro, ...t } = dict.gift;

  return (
    <section
      id={sectionIds.gift}
      aria-labelledby={titleId}
      className="bg-bordeaux px-gutter py-42.5 text-cream max-md:py-30"
    >
      <GiftVoucher
        heading={
          <>
            <SectionHeading
              titleId={titleId}
              tone="dark"
              label={label}
              title={title}
            />
            <p className="max-w-130 text-xl leading-[1.6]">{intro}</p>
          </>
        }
        workshops={workshops}
        email={email}
        intlLocale={intlLocales[locale]}
        t={t}
        contact={dict.contact}
      />
    </section>
  );
}
