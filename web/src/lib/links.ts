/** Outbound links built from the contact details in Sanity. */

/** "mailto:" with the subject and body filled in. */
export function mailtoHref(email: string, subject: string, body: string) {
  // encodeURIComponent, not URLSearchParams: mail apps show "+" literally.
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** "+40 712 345 678" → "https://wa.me/40712345678" */
export const whatsappHref = (phone: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}`;

export const instagramHref = (account: string) =>
  `https://www.instagram.com/${account}/`;

/** A Google Maps search for the address; opens the app on phones. */
export const mapsHref = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
