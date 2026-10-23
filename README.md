# Căminul Cultural 31

The website of Căminul Cultural 31: naive-art workshops in Bucharest, in the evening, by lamplight. Bilingual: Romanian (default, `/`) and English (`/en`).

The repo holds two apps that share the same Sanity data (project `r3j22rbn`, dataset `production`):

| Folder | What it is | Local | Production |
|---|---|---|---|
| `web/` | The site: Next.js 16, Tailwind v4 | http://localhost:3000 | Vercel |
| `studio/` | Sanity Studio, where content is edited | http://localhost:3333 | `<name>.sanity.studio` |

## Requirements

- Node.js 24 (pinned in `package.json` and `.nvmrc`; Vercel uses it too) and npm.
- Access to the Sanity project (an invite from [sanity.io/manage](https://www.sanity.io/manage)).
- For booking emails: a [Resend](https://resend.com) account with a verified domain. Optional locally.

## Running locally

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

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | once there's a domain | The public address, e.g. `https://caminulcultural31.ro`, used for canonical links, the sitemap and share previews. Read at build time. Until it's set, Vercel's production URL is used. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | `r3j22rbn` |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | `production` |
| `RESEND_API_KEY` | in production | Resend key for the booking emails. Without it, `npm run dev` prints the emails in the terminal instead of sending them, and production refuses bookings. |
| `BOOKING_FROM_EMAIL` | in production | The sender, on a domain verified in Resend, e.g. `Căminul Cultural 31 <rezervari@your-domain.ro>`. |
| `BOOKING_TO_EMAIL` | no | Where booking requests go. If empty, the email from "Setări site" (Site settings) in the Studio is used. |
| `SANITY_REVALIDATE_SECRET` | in production | Shared secret of the Sanity webhook below. Any long random string, e.g. from `openssl rand -hex 32`. |

`.env.local` is never committed; the template is `web/.env.example`.

## Content (in the Studio)

The Studio is in Romanian; the names in quotes below are what you'll see there.

- **Workshops ("Ateliere"):** title, verb, description, photo (with alt text), price, duration, capacity. Drag and drop to change their order on the poster board. "Ascuns" (hidden) takes a workshop off the site.
- **Sessions ("Sesiuni"):** the workshop, date and time (Romanian time), seats left, status (open / full / cancelled). The site only shows sessions that haven't started yet.
- **Reviews ("Recenzii"):** appear in the register ("Condica") only when "Apare pe site" (shown on site) is on.
- **Site settings ("Setări site"):** address, metro station, email, WhatsApp, Instagram, company details, the hidden cat's promo code.

Every text has a Romanian and an English field. If the English is missing, `/en` shows the Romanian text.

Empty fields show on the site as visible placeholders (`[ADRESA]`, `[PREȚ]`, `[CUI]`, `[email]` etc.), so it's clear what still needs filling in. Prices, addresses and reviews are never made up.

## Bookings

On each workshop's page (`/atelier/<slug>`), the visitor picks a day, a time and how many people, then sends a **request**:

1. The server validates the form and re-reads the session from Sanity: it must be open, not started yet, and have enough seats.
2. Two emails go out: one to you (Reply-To = the customer) and a confirmation to the customer, in their language ("we'll confirm within 24 hours").
3. **Seats don't go down automatically.** After you confirm a booking, update "Locuri rămase" (seats left) on the session in the Studio.

Anti-spam: a hidden honeypot field, and at most 5 requests per 10 minutes from the same connection.

The code lives in `web/src/booking/`. Online payment (Stripe, stage 2) will replace only the email step.

## When you change the schema or queries

The TypeScript types for Sanity data are generated from the schema and the queries:

```bash
cd studio
npm run typegen   # writes web/src/sanity/sanity.types.ts
```

Run it after any change in `studio/schemaTypes/` or `web/src/sanity/queries.ts`.

## Checks

In `web/`:

```bash
npm run lint
npx tsc --noEmit
npm run format:check   # npm run format fixes formatting
npm run build
```

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
- **Filter:** `_type in ["workshop", "session", "review", "siteSettings"]`
- **HTTP method:** POST, with drafts and versions off
- **Secret:** the same value as `SANITY_REVALIDATE_SECRET` on Vercel

The route rejects calls without a valid signature. After a publish, the next visit renders fresh content.

### Analytics

Vercel → the project → Analytics → Enable. The site already includes the script; it's cookie-free, so no cookie banner is needed. Page views show up in the same tab.

### CORS in Sanity

In sanity.io/manage → API → CORS origins, add the site's domain (and the Vercel one, if you like), **without** "Allow credentials". Without it, live updates in the browser are blocked. Sanity adds the Studio's domain on its own.

### When the schema changes

Deploy the Studio first (`npm run deploy`), then push the site if the queries changed too.

## Code layout (`web/src/`)

- `app/[lang]/`: the pages: home, `atelier/[slug]`, the legal pages (`termeni`, `confidentialitate`, `anulare`, stubs for now), the share image.
- `app/api/revalidate/`: the Sanity webhook. `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`: SEO and icons.
- `components/sections/`: one folder per section (hero, poster board, rent, gift ticket, register, directions, workshop).
- `components/ui/`, `components/site/`, `components/cats/`: reusable pieces, header/footer, the cat SVGs.
- `data/`: loading data from Sanity (cached) and the UI types.
- `booking/`: bookings (Server Action, validation, emails).
- `i18n/dictionaries/{ro,en}.ts`: all the text on the site.
- `sanity/`: the client, the queries and the generated types.
- `lib/seo.ts`, `lib/structuredData.ts`: canonical/hreflang/Open Graph tags and JSON-LD (`LocalBusiness`, one `Event` per session).

Brand, colour, tone and copy rules are in `.claude/skills/cc31-brand/SKILL.md`.
