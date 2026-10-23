import { Suspense } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { WorkshopDetail } from "@/data/types";
import { intlLocales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { BookingForm, type BookingFormText } from "./BookingForm";
import { BookingFormFromUrl } from "./BookingFormFromUrl";

type BookingSectionProps = { workshop: WorkshopDetail };

const titleId = "booking-title";

export async function BookingSection({ workshop }: BookingSectionProps) {
  const [locale, { workshop: t }] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  // Only the strings the form needs cross into the client bundle.
  const text: BookingFormText = {
    day: t.day,
    time: t.time,
    full: t.full,
    seatsLeft: t.seatsLeft,
    pickPrompt: t.pickPrompt,
    people: t.people,
    fewerPeople: t.fewerPeople,
    morePeople: t.morePeople,
    peopleCount: t.peopleCount,
    maxPeople: t.maxPeople,
    contactLegend: t.contactLegend,
    name: t.name,
    email: t.email,
    phone: t.phone,
    note: t.note,
    total: t.total,
    totalValue: t.totalValue,
    submit: t.submit,
    sending: t.sending,
    errorName: t.errorName,
    errorEmail: t.errorEmail,
    errorPhone: t.errorPhone,
    errorNote: t.errorNote,
    errorPeople: t.errorPeople,
    errorSession: t.errorSession,
    errorSeats: t.errorSeats,
    errorRate: t.errorRate,
    errorSend: t.errorSend,
    sentTitle: t.sentTitle,
    sentText: t.sentText,
    sentSummary: t.sentSummary,
    bookAnother: t.bookAnother,
  };
  const formProps = {
    days: workshop.days,
    sessions: workshop.sessions,
    priceLei: workshop.priceLei,
    capacity: workshop.capacity,
    locale,
    intlLocale: intlLocales[locale],
    t: text,
  };

  return (
    <section
      aria-labelledby={titleId}
      className="bg-navy pt-20 pb-24 text-cream"
    >
      <SectionHeader
        titleId={titleId}
        label={t.bookingLabel}
        title={t.bookingTitle}
        intro={t.bookingIntro}
        tone="dark"
        className="mb-12"
      />
      <div className="mx-auto max-w-content px-gutter">
        <div className="max-w-200 bg-cream p-6 text-navy shadow-[0_16px_30px_rgba(0,0,0,0.35)] sm:p-10">
          {workshop.sessions.length > 0 ? (
            <Suspense fallback={<BookingForm {...formProps} />}>
              <BookingFormFromUrl {...formProps} />
            </Suspense>
          ) : (
            <p className="text-xl leading-[1.55]">{t.noSessions}</p>
          )}
        </div>
      </div>
    </section>
  );
}
