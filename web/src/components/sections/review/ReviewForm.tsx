"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { HONEYPOT_FIELD } from "@/booking/state";
import { PawPrint } from "@/components/cats";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { WorkshopName } from "@/data/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";
import { submitReview } from "@/reviews/actions";
import {
  initialReviewState,
  REVIEW_MAX_LENGTH,
  type ReviewField,
  type ReviewState,
} from "@/reviews/state";

export type ReviewFormText = Pick<
  Dictionary["reviewForm"],
  | "firstName"
  | "workshop"
  | "workshopNone"
  | "text"
  | "textHint"
  | "submit"
  | "sending"
  | "errorName"
  | "errorText"
  | "errorRate"
  | "errorSend"
  | "sentTitle"
  | "sentText"
  | "seeRegister"
>;

export type ReviewFormProps = {
  workshops: WorkshopName[];
  locale: Locale;
  /** Where "see the guest book" goes: the register on the home page. */
  registerHref: string;
  /** The workshop from "?atelier=…", preselected. */
  initialSlug?: string | null;
  t: ReviewFormText;
};

const selectClass =
  "w-full rounded-none border-0 border-b-2 border-navy/50 bg-transparent px-0 py-2 text-lg text-navy hover:border-navy focus:border-navy";

/** The guest book form behind the QR code: first name, workshop, a few lines. */
export function ReviewForm({
  workshops,
  locale,
  registerHref,
  initialSlug,
  t,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialReviewState,
  );
  const [length, setLength] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const selectId = useId();
  const hintId = useId();
  const initialWorkshop =
    workshops.find((w) => w.slug && w.slug === initialSlug)?.id ?? "";

  const invalid = state.status === "invalid" ? state.fields : [];
  useEffect(() => {
    if (state.status !== "invalid") return;
    const element = formRef.current?.elements.namedItem(state.fields[0]);
    if (element instanceof HTMLElement) element.focus();
  }, [state]);

  if (state.status === "sent") {
    return <Sent t={t} registerHref={registerHref} />;
  }

  // As in the booking form: keep what was typed when the server says no.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  const fieldError = (field: ReviewField, message: string) =>
    invalid.includes(field) ? message : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      aria-busy={pending}
      className="relative flex flex-col gap-6"
    >
      <input type="hidden" name="lang" value={locale} />

      <Field
        label={t.firstName}
        name="firstName"
        autoComplete="given-name"
        required
        maxLength={40}
        error={fieldError("firstName", t.errorName)}
      />

      {workshops.length > 0 && (
        <div className="flex flex-col gap-1">
          <label htmlFor={selectId} className="text-[1.0625rem]">
            {t.workshop}
          </label>
          <select
            id={selectId}
            name="workshop"
            defaultValue={initialWorkshop}
            className={selectClass}
          >
            <option value="">{t.workshopNone}</option>
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <Field
          label={t.text}
          name="text"
          multiline
          rows={5}
          required
          minLength={10}
          maxLength={REVIEW_MAX_LENGTH}
          aria-describedby={hintId}
          onChange={(event) => setLength(event.currentTarget.value.length)}
          error={fieldError("text", t.errorText)}
        />
        <p
          id={hintId}
          className="flex justify-between gap-4 text-base text-navy/75"
        >
          <span>{t.textHint}</span>
          <span
            aria-hidden="true"
            className={cn(
              "font-label text-sm tabular-nums",
              length > REVIEW_MAX_LENGTH - 50 && "text-bordeaux",
            )}
          >
            {length}/{REVIEW_MAX_LENGTH}
          </span>
        </p>
      </div>

      {/* Anti-spam: hidden from people and screen readers, irresistible to bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-2500 size-px overflow-hidden"
      >
        <label>
          Website
          <input
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-dashed border-navy pt-5">
        <PawPrint aria-hidden="true" className="size-9 -rotate-12 opacity-80" />
        <Button type="submit" variant="cherry" size="lg" disabled={pending}>
          {pending ? t.sending : t.submit}
        </Button>
      </div>
      <p role="status" className="text-lg text-bordeaux empty:hidden">
        {errorMessage(state, t)}
      </p>
    </form>
  );
}

function errorMessage(state: ReviewState, t: ReviewFormText) {
  if (state.status !== "error") return null;
  return state.reason === "rate" ? t.errorRate : t.errorSend;
}

function Sent({
  t,
  registerHref,
}: {
  t: ReviewFormText;
  registerHref: string;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div role="status" className="flex flex-col items-start gap-4">
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[2.5rem] leading-[1.05] font-semibold text-cherry"
      >
        {t.sentTitle}
      </h2>
      <p className="max-w-130 text-xl leading-[1.55]">{t.sentText}</p>
      <a
        href={registerHref}
        className="text-lg underline underline-offset-4 hover:text-cherry"
      >
        {t.seeRegister}
      </a>
    </div>
  );
}
