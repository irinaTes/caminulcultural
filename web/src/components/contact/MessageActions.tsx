"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/types";
import { mailtoHref } from "@/lib/links";

type MessageActionsProps = {
  /** null until the editor fills it in Sanity: the send button is then disabled. */
  email: string | null;
  subject: string;
  message: string;
  sendLabel: string;
  variant: "glow" | "cream";
  t: Pick<Dictionary["contact"], "noEmail" | "copy" | "copied" | "copyFailed">;
};

/**
 * Opens the visitor's mail app with the generated message, or copies it for
 * anyone without one. Give it `key={message}` so a stale "copied" note clears
 * when the message changes.
 */
export function MessageActions({
  email,
  subject,
  message,
  sendLabel,
  variant,
  t,
}: MessageActionsProps) {
  const [status, setStatus] = useState<string | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setStatus(t.copied);
    } catch {
      setStatus(t.copyFailed);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {email ? (
          <ButtonLink
            href={mailtoHref(email, subject, message)}
            variant={variant}
            size="lg"
          >
            {sendLabel}
          </ButtonLink>
        ) : (
          <>
            <Button variant={variant} size="lg" disabled>
              {sendLabel}
            </Button>
            <span>{t.noEmail}</span>
          </>
        )}
        <button
          type="button"
          onClick={copy}
          className="min-h-11 cursor-pointer text-[1.0625rem] underline underline-offset-6 hover:text-glow"
        >
          {t.copy}
        </button>
      </div>
      <p role="status" className="text-[1.0625rem] empty:hidden">
        {status}
      </p>
    </div>
  );
}
