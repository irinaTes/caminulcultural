import type { Metadata } from "next";
import { Suspense } from "react";
import { SleepingCat } from "@/components/cats";
import { ReviewForm } from "@/components/sections/review/ReviewForm";
import { ReviewFormFromUrl } from "@/components/sections/review/ReviewFormFromUrl";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { reviewPath, sectionHref, sectionIds } from "@/config/site";
import { getWorkshopNames } from "@/data/workshops";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.reviewForm;
  return {
    title: t.metaTitle,
    // Reached from the QR code on the tables, not from search.
    robots: { index: false, follow: true },
    ...pageMetadata({
      locale,
      path: reviewPath,
      title: `${t.metaTitle} · ${dict.meta.title}`,
      description: t.metaDescription,
      siteName: dict.meta.title,
    }),
  };
}

/** The guest book form, opened from the QR code on the tables. */
export default async function ReviewPage() {
  const locale = await getLocale();
  const [{ reviewForm: t }, workshops] = await Promise.all([
    getDictionary(),
    getWorkshopNames(locale),
  ]);

  const formProps = {
    workshops,
    locale,
    registerHref: sectionHref(locale, sectionIds.register),
    t: {
      firstName: t.firstName,
      workshop: t.workshop,
      workshopNone: t.workshopNone,
      text: t.text,
      textHint: t.textHint,
      submit: t.submit,
      sending: t.sending,
      errorName: t.errorName,
      errorText: t.errorText,
      errorRate: t.errorRate,
      errorSend: t.errorSend,
      sentTitle: t.sentTitle,
      sentText: t.sentText,
      seeRegister: t.seeRegister,
    },
  };

  return (
    <>
      <Header path={reviewPath} />
      <main
        id={sectionIds.content}
        className="flex-1 bg-cream px-gutter pt-16 pb-24 text-navy md:pt-24"
      >
        <div className="mx-auto flex max-w-150 flex-col gap-8">
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-3.5">
              <Eyebrow className="text-bordeaux">{t.label}</Eyebrow>
              <h1 className="font-display text-[clamp(2.5rem,9vw,4rem)] leading-none font-semibold tracking-[-0.02em]">
                {t.title}
              </h1>
            </div>
            <SleepingCat aria-hidden="true" className="w-28 shrink-0 sm:w-36" />
          </div>
          <p className="text-xl leading-[1.55]">{t.intro}</p>

          <div className="-rotate-[0.4deg] border-2 border-navy bg-paper p-6 shadow-[8px_8px_0_var(--color-navy)] sm:p-9">
            <Suspense fallback={<ReviewForm {...formProps} />}>
              <ReviewFormFromUrl {...formProps} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
