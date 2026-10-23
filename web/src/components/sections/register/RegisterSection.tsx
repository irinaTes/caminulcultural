import { PawPrint, SleepingCat } from "@/components/cats";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sectionIds } from "@/config/site";
import { getReviews } from "@/data/reviews";
import { intlLocales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { numericDate } from "@/lib/dates";
import { cn } from "@/lib/cn";

const titleId = `${sectionIds.register}-title`;

/** Paw signatures lean a little differently on every line. */
const PAW_TILTS = [-18, 9, -6, 14];

type Row = {
  key: string;
  date: string;
  name: string;
  text: string;
  /** Set when the review isn't in the page's language. */
  lang?: string;
  placeholder: boolean;
};

export async function RegisterSection() {
  const locale = await getLocale();
  const [{ register: t }, reviews] = await Promise.all([
    getDictionary(),
    getReviews(),
  ]);

  // No invented reviews: until the first real ones, the lines stay marked.
  const rows: Row[] =
    reviews.length > 0
      ? reviews.map((review) => ({
          key: review.id,
          date: numericDate(review.date, intlLocales[locale]),
          name: review.firstName,
          text: review.text,
          lang: review.language === locale ? undefined : review.language,
          placeholder: false,
        }))
      : [t.placeholderFirst, t.placeholder, t.placeholder].map((text, i) => ({
          key: `placeholder-${i}`,
          date: t.placeholderDate,
          name: t.placeholderName,
          text,
          placeholder: true,
        }));

  const paw = (index: number) => (
    <>
      <PawPrint
        className="size-7.5 opacity-80"
        style={{ rotate: `${PAW_TILTS[index % PAW_TILTS.length]}deg` }}
      />
      <span className="sr-only">{t.signed}</span>
    </>
  );

  return (
    <section
      id={sectionIds.register}
      aria-labelledby={titleId}
      className="bg-cream px-gutter py-42.5 max-md:py-30"
    >
      <div className="mx-auto flex max-w-300 flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-160 flex-col gap-3.5">
            <SectionHeading titleId={titleId} label={t.label} title={t.title} />
            <p className="text-xl leading-[1.6]">
              {reviews.length > 0 ? t.intro : t.introEmpty}
            </p>
          </div>
          <div
            aria-hidden="true"
            className="relative z-1 mr-6 -mb-11.5 max-sm:hidden"
          >
            <span className="absolute -top-2.5 right-1.5 font-label text-lg tracking-[0.2em] text-bordeaux">
              z z z
            </span>
            <SleepingCat className="w-52.5" />
          </div>
        </div>

        <div className="-rotate-[0.6deg] border-2 border-navy bg-paper shadow-[8px_8px_0_var(--color-navy)]">
          {/* Wide screens: the ledger itself. */}
          <table className="w-full border-collapse text-[1.0625rem] max-sm:hidden">
            <thead>
              <tr className="text-left font-label text-xs tracking-label uppercase">
                <th
                  scope="col"
                  className="w-36 border-r border-b-2 border-navy px-4.5 py-4"
                >
                  {t.date}
                </th>
                <th
                  scope="col"
                  className="w-40 border-r border-b-2 border-navy px-4.5 py-4"
                >
                  {t.name}
                </th>
                <th
                  scope="col"
                  className="border-r border-b-2 border-navy px-4.5 py-4"
                >
                  {t.text}
                </th>
                <th
                  scope="col"
                  className="w-32.5 border-b-2 border-navy px-4.5 py-4"
                >
                  {t.signature}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.key}
                  className={cn(
                    "border-b border-navy/20 last:border-b-0",
                    row.placeholder && "text-navy/75 italic",
                  )}
                >
                  <td className="border-r border-navy px-4.5 py-5.5 align-top whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="border-r border-navy px-4.5 py-5.5 align-top">
                    {row.name}
                  </td>
                  <td
                    lang={row.lang}
                    className="border-r border-navy px-4.5 py-5.5 align-top leading-normal"
                  >
                    {row.text}
                  </td>
                  <td className="px-4.5 py-3.5 align-middle">{paw(index)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phones: one entry per line, same order. */}
          <ol className="sm:hidden">
            {rows.map((row, index) => (
              <li
                key={row.key}
                className={cn(
                  "flex flex-col gap-2 border-b border-navy/20 px-4.5 py-5 last:border-b-0",
                  row.placeholder && "text-navy/75 italic",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow inline size="sm" tracking="normal">
                    {row.date} · {row.name}
                  </Eyebrow>
                  {paw(index)}
                </div>
                <p lang={row.lang} className="text-[1.0625rem] leading-normal">
                  {row.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
