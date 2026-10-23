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
import { requestBooking } from "@/booking/actions";
import {
  HONEYPOT_FIELD,
  initialBookingState,
  type BookingField,
  type BookingState,
} from "@/booking/state";
import { DayTimeChips } from "@/components/sessions/DayTimeChips";
import { useSessionChoice } from "@/components/sessions/useSessionChoice";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Field } from "@/components/ui/Field";
import { StepButton } from "@/components/ui/StepButton";
import type { SessionDay, SessionSlot } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { fill, plural } from "@/i18n/format";
import type { Dictionary } from "@/i18n/types";

/** Upper limit for one booking when the editor tracks neither seats nor capacity. */
const MAX_GROUP = 10;

export type BookingFormText = Pick<
  Dictionary["workshop"],
  | "day"
  | "time"
  | "full"
  | "seatsLeft"
  | "pickPrompt"
  | "people"
  | "fewerPeople"
  | "morePeople"
  | "peopleCount"
  | "maxPeople"
  | "contactLegend"
  | "name"
  | "email"
  | "phone"
  | "note"
  | "total"
  | "totalValue"
  | "submit"
  | "sending"
  | "errorName"
  | "errorEmail"
  | "errorPhone"
  | "errorNote"
  | "errorPeople"
  | "errorSession"
  | "errorSeats"
  | "errorRate"
  | "errorSend"
  | "sentTitle"
  | "sentText"
  | "sentSummary"
  | "bookAnother"
>;

export type BookingFormProps = {
  days: SessionDay[];
  sessions: SessionSlot[];
  priceLei: number | null;
  capacity: number | null;
  locale: Locale;
  intlLocale: string;
  t: BookingFormText;
  /** Session to preselect, e.g. the one picked on the poster. */
  initial?: { date: string; time: string } | null;
};

/** Session, group size and contact details, sent as a booking request. */
export function BookingForm(props: BookingFormProps) {
  // "Make another booking" starts over with a fresh form and action state.
  const [round, setRound] = useState(0);
  return (
    <BookingRequest
      key={round}
      {...props}
      onAgain={() => setRound((n) => n + 1)}
    />
  );
}

function BookingRequest({
  days,
  sessions,
  priceLei,
  capacity,
  locale,
  intlLocale,
  t,
  initial,
  onAgain,
}: BookingFormProps & { onAgain: () => void }) {
  const { day, time, setDay, setTime, times, session } = useSessionChoice(
    sessions,
    initial,
  );
  const [requested, setRequested] = useState(1);
  const [missingSession, setMissingSession] = useState(false);
  const [state, formAction, pending] = useActionState(
    requestBooking,
    initialBookingState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  const max = Math.max(1, session?.seatsLeft ?? capacity ?? MAX_GROUP);
  const people = Math.min(requested, max);
  const seats = (n: number) => plural(t.seatsLeft, n, intlLocale);
  const invalid = state.status === "invalid" ? state.fields : [];

  // After a failed check, take the visitor to the first field to fix.
  useEffect(() => {
    if (state.status !== "invalid") return;
    const first = state.fields.find((f) => f !== "session" && f !== "people");
    const element = first && formRef.current?.elements.namedItem(first);
    if (element instanceof HTMLElement) element.focus();
  }, [state]);

  if (state.status === "sent") {
    return (
      <Sent state={state} t={t} intlLocale={intlLocale} onAgain={onAgain} />
    );
  }

  // Ask the browser for the form data ourselves: a form `action` would reset
  // the fields, and a failed check should keep what the visitor typed.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setMissingSession(true);
      return;
    }
    setMissingSession(false);
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  const fieldError = (field: BookingField, message: string) =>
    invalid.includes(field) ? message : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      aria-busy={pending}
      className="relative flex flex-col gap-2.5"
    >
      <DayTimeChips
        days={days}
        times={times}
        day={day}
        time={time}
        onDay={setDay}
        onTime={setTime}
        t={t}
        seatsLabel={seats}
      />
      <input type="hidden" name="session" value={session?.id ?? ""} />
      <input type="hidden" name="lang" value={locale} />

      <div className="mt-5 flex flex-col gap-2">
        <Eyebrow inline size="xs" id={`${id}-people`}>
          <label htmlFor={`${id}-people-input`}>{t.people}</label>
        </Eyebrow>
        <div
          role="group"
          aria-labelledby={`${id}-people`}
          className="flex items-center gap-3"
        >
          <StepButton
            label={t.fewerPeople}
            disabled={people <= 1}
            onClick={() => setRequested(people - 1)}
          >
            −
          </StepButton>
          <input
            id={`${id}-people-input`}
            name="people"
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            required
            value={people}
            onChange={(event) =>
              setRequested(Math.max(1, Number(event.target.value) || 1))
            }
            className="w-16 [appearance:textfield] border-b-2 border-navy/50 bg-transparent py-1 text-center font-display text-2xl font-semibold focus:border-navy [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <StepButton
            label={t.morePeople}
            disabled={people >= max}
            onClick={() => setRequested(people + 1)}
          >
            +
          </StepButton>
          <span className="text-[1.0625rem]" aria-live="polite">
            {plural(t.peopleCount, people, intlLocale)}
          </span>
        </div>
        {session?.seatsLeft != null && (
          <p className="text-base text-navy/80">
            {fill(t.maxPeople, { n: session.seatsLeft })}
          </p>
        )}
      </div>

      <fieldset className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <legend className="mb-4">
          <Eyebrow inline size="xs">
            {t.contactLegend}
          </Eyebrow>
        </legend>
        <Field
          label={t.name}
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          error={fieldError("name", t.errorName)}
        />
        <Field
          label={t.email}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
          error={fieldError("email", t.errorEmail)}
        />
        <Field
          label={t.phone}
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={20}
          error={fieldError("phone", t.errorPhone)}
        />
        <Field
          label={t.note}
          name="note"
          multiline
          maxLength={1000}
          className="sm:col-span-2"
          error={fieldError("note", t.errorNote)}
        />
      </fieldset>

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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-navy pt-5">
        <p className="text-lg">
          {t.total}:{" "}
          {priceLei == null
            ? "[PREȚ]"
            : fill(t.totalValue, {
                people,
                price: priceLei,
                total: people * priceLei,
              })}
        </p>
        <Button type="submit" variant="cherry" size="lg" disabled={pending}>
          {pending ? t.sending : t.submit}
        </Button>
      </div>
      <p role="status" className="text-lg text-bordeaux empty:hidden">
        {missingSession ? t.pickPrompt : errorMessage(state, t, seats)}
      </p>
    </form>
  );
}

/** The form-wide message for a failed request, if any. */
function errorMessage(
  state: BookingState,
  t: BookingFormText,
  seats: (n: number) => string,
) {
  if (state.status === "invalid") {
    if (state.fields.includes("session")) return t.errorSession;
    if (state.fields.includes("people")) return t.errorPeople;
    return null;
  }
  if (state.status !== "error") return null;
  switch (state.reason) {
    case "session":
      return t.errorSession;
    case "seats":
      return fill(t.errorSeats, { seats: seats(state.seatsLeft ?? 0) });
    case "rate":
      return t.errorRate;
    case "send":
      return t.errorSend;
  }
}

function Sent({
  state,
  t,
  intlLocale,
  onAgain,
}: {
  state: Extract<BookingState, { status: "sent" }>;
  t: BookingFormText;
  intlLocale: string;
  onAgain: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <div role="status" className="flex flex-col items-start gap-4">
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-[2rem] leading-[1.05] font-semibold text-cherry"
      >
        {t.sentTitle}
      </h3>
      {state.workshop && (
        <p className="font-label text-[0.8125rem] tracking-label uppercase">
          {fill(t.sentSummary, {
            workshop: state.workshop,
            when: state.when,
            people: plural(t.peopleCount, state.people, intlLocale),
          })}
        </p>
      )}
      <p className="max-w-130 text-xl leading-[1.55]">{t.sentText}</p>
      <Button variant="outline-navy" onClick={onAgain}>
        {t.bookAnother}
      </Button>
    </div>
  );
}
