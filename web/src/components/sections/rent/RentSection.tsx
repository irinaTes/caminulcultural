import { PartyCat } from "@/components/cats";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/site";
import { getSiteSettings } from "@/data/siteSettings";
import { getWorkshopNames } from "@/data/workshops";
import { intlLocales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { RentConfigurator } from "./RentConfigurator";

const titleId = `${sectionIds.rent}-title`;

export async function RentSection() {
  const locale = await getLocale();
  const [dict, workshops, { email }] = await Promise.all([
    getDictionary(),
    getWorkshopNames(locale),
    getSiteSettings(),
  ]);
  const t = dict.rent;

  return (
    <section
      id={sectionIds.rent}
      aria-labelledby={titleId}
      className="bg-navy px-gutter py-42.5 text-cream max-md:py-30"
    >
      <div className="mx-auto flex max-w-350 flex-wrap gap-22 max-md:gap-14">
        <div className="flex min-w-0 flex-[1_1_23.75rem] flex-col gap-5.5">
          <SectionHeading
            titleId={titleId}
            tone="dark"
            label={t.label}
            title={
              <>
                {t.title}
                <br />
                <em className="font-light text-glow">{t.titleAccent}</em>
              </>
            }
          />
          <p className="max-w-135 text-xl leading-[1.6]">{t.intro}</p>
          <p className="max-w-135 text-xl leading-[1.6]">{t.hint}</p>
          <PartyCat className="mt-3 w-47.5 max-md:hidden" />
        </div>

        {/* Only the strings the configurator needs cross into the client bundle. */}
        <RentConfigurator
          workshops={workshops}
          email={email}
          intlLocale={intlLocales[locale]}
          t={{
            occasionLegend: t.occasionLegend,
            occasions: t.occasions,
            workshopLegend: t.workshopLegend,
            guests: t.guests,
            fewerGuests: t.fewerGuests,
            moreGuests: t.moreGuests,
            guestsRange: t.guestsRange,
            messageLabel: t.messageLabel,
            message: t.message,
            subject: t.subject,
            send: t.send,
          }}
          contact={dict.contact}
        />
      </div>
    </section>
  );
}
