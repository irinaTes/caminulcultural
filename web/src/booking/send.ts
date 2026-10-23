import "server-only";
import { Resend } from "resend";
import type { Email } from "./emails";

const apiKey = process.env.RESEND_API_KEY;
/** "Căminul Cultural 31 <rezervari@your-domain.ro>", on a domain verified in Resend. */
const from = process.env.BOOKING_FROM_EMAIL;

const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Sends one email through Resend. Without RESEND_API_KEY, development prints
 * it to the terminal instead, so the form can be tried before Resend is set up;
 * production treats that as a failure.
 */
export async function sendEmail(to: string, email: Email): Promise<boolean> {
  if (!resend || !from) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "Booking email not sent: RESEND_API_KEY or BOOKING_FROM_EMAIL is missing.",
      );
      return false;
    }
    console.info(
      `\n[booking email, not sent: no Resend setup]\nTo: ${to}\nReply-To: ${email.replyTo ?? "-"}\nSubject: ${email.subject}\n\n${email.text}\n`,
    );
    return true;
  }

  const { error } = await resend.emails.send({
    from,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    replyTo: email.replyTo,
  });
  if (error) {
    console.error("Booking email failed:", error.name, error.message);
    return false;
  }
  return true;
}
