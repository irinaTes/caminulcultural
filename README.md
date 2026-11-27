# Căminul Cultural 31

The website of Căminul Cultural 31: naive-art workshops in Bucharest, in the evening, by lamplight. Bilingual: Romanian (default, `/`) and English (`/en`).

The repo holds two apps that share the same Sanity data (project `r3j22rbn`, dataset `production`):

| Folder    | What it is                             | Local                 | Production             |
| --------- | -------------------------------------- | --------------------- | ---------------------- |
| `web/`    | The site: Next.js 16, Tailwind v4      | http://localhost:3000 | Vercel                 |
| `studio/` | Sanity Studio, where content is edited | http://localhost:3333 | `<name>.sanity.studio` |

## Requirements

- Node.js 24 (pinned in `package.json` and `.nvmrc`; Vercel uses it too) and npm.
- Access to the Sanity project (an invite from [sanity.io/manage](https://www.sanity.io/manage)).
- For booking emails: a [Resend](https://resend.com) account with a verified domain. Optional locally.

## Running locally

From the repo root, after the one-time setup below (`.env.local`, `npx sanity login`):

```bash
npm install   # also installs web/ and studio/
npm run dev   # site on :3000 and Studio on :3333, in one terminal
```

`npm run dev:web` or `npm run dev:studio` starts just one of them. To work inside a single folder instead:

### The site

```bash
cd web
cp .env.example .env.local   # then fill in the values, see below
npm install
npm run dev
```

Open http://localhost:3000 (Romanian) or http://localhost:3000/en (English).

### The Studio

```bash
cd studio
npm install
npx sanity login   # first time only
npm run dev
```

Open http://localhost:3333. Whatever you publish there shows up on the local site within a few seconds, without a reload.

## Environment variables (`web/.env.local`)

| Variable                        | Required              | What it does                                                                                                                                                                                                                  |
| ------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | once there's a domain | The public address, e.g. `https://caminulcultural31.ro`, used for canonical links, the sitemap and share previews. Read at build time. Until it's set, Vercel's production URL is used.                                       |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes                   | `r3j22rbn`                                                                                                                                                                                                                    |
| `NEXT_PUBLIC_SANITY_DATASET`    | yes                   | `production`                                                                                                                                                                                                                  |
| `RESEND_API_KEY`                | in production         | Resend key for the booking emails. Without it, `npm run dev` prints the emails in the terminal instead of sending them, and production refuses bookings.                                                                      |
| `BOOKING_FROM_EMAIL`            | in production         | The sender, on a domain verified in Resend, e.g. `Căminul Cultural 31 <rezervari@your-domain.ro>`.                                                                                                                            |
| `BOOKING_TO_EMAIL`              | no                    | Where booking requests go. If empty, the email from "Setări site" (Site settings) in the Studio is used.                                                                                                                      |
| `SANITY_BOOKINGS_TOKEN`         | yes                   | Reads and writes bookings. A project token with the **Editor** role (sanity.io/manage → the project → API → Tokens). Never prefix it with `NEXT_PUBLIC_`. Without it, the site counts no seats as taken and refuses bookings. |
| `SANITY_REVALIDATE_SECRET`      | in production         | Shared secret of the Sanity webhook below. Any long random string, e.g. from `openssl rand -hex 32`.                                                                                                                          |

`.env.local` is never committed; the template is `web/.env.example`.

## Content (in the Studio)

The Studio is in Romanian; the names in quotes below are what you'll see there.

- **Workshops ("Ateliere"):** title, verb, description, photo (with alt text), price, duration, capacity. Drag and drop to change their order on the poster board. "Ascuns" (hidden) takes a workshop off the site.
- **Gallery ("Galeria", inside each workshop):** the photo wall on the workshop page, each photo with alt text. Drag to reorder; the site picks each frame's size from the photo's shape. Until it has photos, the page shows striped `[FOTO n]` placeholders.
- **Sessions ("Sesiuni"):** the workshop, date and time (Romanian time), status (open / full / cancelled) and, only if it differs from the workshop's, the session's own number of seats. Seats left are worked out from the bookings. The site only shows sessions that haven't started yet.
- **Bookings ("Rezervări"):** every request from the site, plus the ones you add by hand (phone, WhatsApp) with "Rezervare nouă". See [Bookings](#bookings).
- **Reviews ("Recenzii"):** appear in the register ("Condica") only when "Apare pe site" (shown on site) is on. Visitors write them through the guest book form (see [Guest book form and QR code](#guest-book-form-and-qr-code)); new ones wait under Recenzii → De aprobat.
- **Site settings ("Setări site"):** address, metro station, email, WhatsApp, Instagram, company details, the hidden cat's promo code, and the team ("Echipa": name, role, a few lines and a square portrait for each person on the honour board in the About section). The manifesto itself is site copy, in the dictionaries.

Every text has a Romanian and an English field. If the English is missing, `/en` shows the Romanian text.

Empty fields show on the site as visible placeholders (`[ADRESA]`, `[PREȚ]`, `[CUI]`, `[email]` etc.), so it's clear what still needs filling in. Prices, addresses and reviews are never made up.

## Bookings

On each workshop's page (`/atelier/<slug>`), the visitor picks a session and how many people, then sends a **request**:

1. The server validates the form and re-reads the session from Sanity: it must be open, not started yet, and have enough seats once the other bookings are counted.
2. The request is saved in the Studio under **Rezervări → De confirmat** (status "De confirmat"). From that moment it holds its seats on the site.
3. Two emails go out: one to you (Reply-To = the customer, with a link to the booking in the Studio) and a confirmation to the customer, in their language ("we'll confirm within 24 hours"). If an email fails, the booking is still saved.
4. Set the booking's status to **Confirmată**, **Refuzată** or **Anulată** and press Publish: the customer gets an email about it at the address from the form, in their language (a confirmation also says where to come). Each status is emailed once; the booking shows which one went out ("Clientul a primit mailul pentru"). Refuzată and Anulată free the seats. A booking added by hand gets the emails too if you fill in its email; leave the email empty if you'd rather tell them yourself.

**Seats left** = the session's seats (or, if empty, the workshop's "capacity") minus the people in bookings that are "De confirmat" or "Confirmată". At 0 the time shows as full. Without any capacity, the site shows no seat count and takes up to 10 people per booking. Two requests sent in the same second can both get through for the last seats; you'll see that when confirming.

**Bookings are private.** The Sanity dataset is public (the site reads it without a login), but documents whose id has a path, like `booking.…`, are only readable with a token. That's why bookings can only be created from the Studio's "Rezervare nouă" button or by the site, and "Duplicate" is turned off for them: anything else would give them a public id, and the Studio refuses to publish a booking without the private id. The site reads and writes them with `SANITY_BOOKINGS_TOKEN` (server-only).

Anti-spam: a hidden honeypot field, and at most 5 requests per 10 minutes from the same connection (counted per server instance, so it only slows a bot down). The customer's confirmation never repeats free text: the note only goes to you, and names with links or addresses are refused, so the form can't be used to mail someone else's message from your domain.

The code lives in `web/src/booking/`. Online payment (Stripe, stage 2) will replace only the email step.

## Guest book form and QR code

`/condica` (and `/en/condica`) is the form for writing in the guest book: first name, which workshop (optional) and a few lines, no links. It's linked from the register on the home page, but mostly reached from a QR code on the tables:

- **`/condica/afis`** is an A5 sheet to print, with the QR code. Pick a workshop at the top of the page to make one for it (`/condica/afis?atelier=mozaic`): its QR code opens the form with that workshop already chosen. The sheet itself isn't linked from the site and stays out of search.
- **Print it only once the site has its final domain** (`NEXT_PUBLIC_SITE_URL`): the QR code holds the full address, and a printed code can't follow a move.

Each line is saved as a review with "Apare pe site" off, under a private id (`review.…`), so nobody can read it through the API before you approve it, and you get an email about it (to the same address as bookings). The register reads approved reviews with `SANITY_BOOKINGS_TOKEN`; an approved one shows on the site through the publish webhook, or within a minute. Same anti-spam as the booking form: a honeypot field and at most 5 lines per 10 minutes from one connection.

## When you change the schema or queries

The TypeScript types for Sanity data are generated from the schema and the queries:

```bash
cd studio
npm run typegen   # writes web/src/sanity/sanity.types.ts
```

Run it after any change in `studio/schemaTypes/` or `web/src/sanity/queries.ts`.

## Security headers and images

`web/next.config.ts` sets a Content-Security-Policy and the usual security headers on every page. The CSP only lets the browser load from the site itself, Sanity's image CDN and the project's Sanity API. **If you add anything from another domain** (an embedded map, a font, a script), add that domain to the policy there, or the browser will block it.

Images don't go through Next's image optimizer: `web/src/sanity/imageLoader.ts` asks Sanity's CDN for each size directly (WebP/AVIF, cached by Sanity). This also keeps the site under Vercel's image quota.

## Checks

In `web/`:

```bash
npm run lint
npx tsc --noEmit
npm run format:check   # npm run format fixes formatting
npm run build
```

GitHub runs the same checks on every push to `main` and on pull requests (`.github/workflows/ci.yml`).

## Deploying

The site and the Studio are deployed separately. Content needs no redeploy: it updates live after Publish in the Studio.

### The site on Vercel

1. vercel.com → Add New → Project → the `caminulcultural` repo.
2. **Root Directory: `web`.** The framework (Next.js) is detected automatically.
3. Environment Variables: the ones in the table above.
4. Settings → Domains: your domain.

Every push to `main` deploys automatically; every branch gets a preview link.

### The Studio on sanity.studio

```bash
cd studio
npm run deploy
```

The first time, it asks for a name, e.g. `caminulcultural31` → `https://caminulcultural31.sanity.studio`. Redeploy only when the schema changes. The Sanity version updates itself (auto-updates).

Invite new editors from sanity.io/manage → the project → Members (the Editor role is enough).

### Webhook in Sanity (refreshes the site on publish)

Live updates only reach visitors who have the site open. So that edits made while nobody is on the site still show up, Sanity calls the site on every change:

sanity.io/manage → the project → API → Webhooks → Create webhook:

- **URL:** `https://<your-domain>/api/revalidate`
- **Dataset:** `production`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type in ["workshop", "session", "booking", "review", "siteSettings"]`
- **HTTP method:** POST, with drafts and versions off
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET` on Vercel

The route rejects calls without a valid signature. After a publish, the next visit renders fresh content.

### Webhook in Sanity (emails the customer when a booking's status changes)

A second webhook, same place (sanity.io/manage → API → Webhooks → Create webhook):

- **Name:** e.g. `Rezervări: anunță clientul`
- **URL:** `https://<your-domain>/api/booking-status`
- **Dataset:** `production`
- **Trigger on:** Create, Update
- **Filter:** `_type == "booking" && status in ["confirmed", "declined", "cancelled"] && (delta::operation() == "create" || delta::changedAny(status))`
- **Projection:** `{_id}` (only the id: the site re-reads the booking itself, so no names or emails end up in Sanity's webhook logs)
- **HTTP method:** POST, with drafts and versions off (the email goes out on Publish)
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET`

If an email fails, the route answers with an error and Sanity retries later. The webhook's attempt log in sanity.io/manage shows what happened (`"sent": true`, or why it was skipped).

### Analytics

Vercel → the project → Analytics → Enable. The site already includes the script; it's cookie-free, so no cookie banner is needed. Page views show up in the same tab.

### CORS in Sanity

In sanity.io/manage → API → CORS origins, add the site's domain (and the Vercel one, if you like), **without** "Allow credentials". Without it, live updates in the browser are blocked. Sanity adds the Studio's domain on its own.

### When the schema changes

Deploy the Studio first (`npm run deploy`), then push the site if the queries changed too.

## Code layout (`web/src/`)

- `app/[lang]/`: the pages: home, `atelier/[slug]`, the legal pages (`termeni`, `confidentialitate`, `anulare`, stubs for now), the share image.
- `app/api/revalidate/`: the Sanity webhook. `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`: SEO and icons.
- `components/sections/`: one folder per section (hero, poster board, rent, gift ticket, register, about, directions, workshop).
- `components/ui/`, `components/site/`, `components/cats/`: reusable pieces, header/footer, the cat SVGs.
- `data/`: loading data from Sanity (cached) and the UI types.
- `booking/`: bookings (Server Action, validation, emails).
- `i18n/dictionaries/{ro,en}.ts`: all the text on the site.
- `sanity/`: the client, the queries and the generated types.
- `lib/seo.ts`, `lib/structuredData.ts`: canonical/hreflang/Open Graph tags and JSON-LD (`LocalBusiness`, one `Event` per session).

Brand, colour, tone and copy rules are in `.claude/skills/cc31-brand/SKILL.md`.
