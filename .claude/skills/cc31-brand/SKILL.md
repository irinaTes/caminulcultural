---
name: cc31-brand
description: Brand, design-token, copy and workflow rules for the Căminul Cultural 31 (CC31) website. Load before writing or reviewing any CC31 UI, copy (RO or EN), illustration, animation or Sanity content model, and before finishing a step of the build plan.
---

# CC31 brand and working rules

Sources of truth, in this order:
1. The user's decisions (memory `cc31-project-decisions`)
2. `prompt-dezvoltare-cc31.md` (the brief)
3. `cc31-mockup.html` (a design and behaviour reference, never code to port)

## Project decisions that override the brief

- The Studio is **standalone** in `studio/`, not embedded at `/studio`.
- Package manager: **npm**. Styling: **Tailwind v4**, tokens in `web/src/app/globals.css` under `@theme`.
- **Bilingual RO + EN.** RO is the default, with no prefix (`/`). EN is under `/en`. Every user-facing string lives in `web/src/i18n/dictionaries/{ro,en}.ts`, and EN must match the RO shape (enforced by the `Dictionary` type). Do not hardcode copy in components.
- Poster board on mobile: a **vertical stack** (no pin, no carousel).

## Code structure (`web/src/`)

- `app/`: routes only. `[lang]/` holds every page; `global-not-found.tsx` and `global-error.tsx` are bilingual because they render outside `[lang]`.
- `components/ui/`: reusable primitives with no CC31 content: `Button`/`ButtonLink`/`buttonClasses`, `Chip` (`tone="dark"` for word chips on navy/bordeaux), `StepButton` (−/+), `Eyebrow`, `SectionHeading` (label + h2, for two-column sections) and `SectionHeader` (full-width opening with intro). `Field` (labelled input/textarea) and `RichText` (Portable Text) too. Reuse these before writing new pill buttons, chips, labels, form fields or section headings.
- `components/site/`: site chrome (`Header`, `MobileMenu`, `LanguageSwitch`, `StatusMessage`).
- `components/sections/<section>/`: one folder per home-page section. The section is an async Server Component that reads its own copy with `getDictionary()`; only the interactive part is a `"use client"` file, and it gets only the strings it needs.
- `components/sessions/`: day/time selection shared by the poster and the booking form (`useSessionChoice`, `DayTimeChips`).
- `components/contact/MessageActions`: "send by email" (prefilled `mailto:` to siteSettings.email, disabled with `[email]` while it's empty) plus "copy the message". The Rent configurator and the gift ticket both use it; pass `key={message}`.
- `components/brand/`, `components/cats/`: logo and illustrations.
- `hooks/`: client hooks (`useMediaQuery`, `useReducedMotion`, `usePointerVars`).
- `lib/`: pure helpers (`cn`, `dates`, `links` for mailto/WhatsApp/Instagram/Google Maps URLs). `cn` doesn't merge conflicting Tailwind classes, so give components props (like `Eyebrow`'s `size`/`tracking`) rather than overriding a utility through `className`.
- `config/site.ts`: section anchors (`anchor()` within the home page, `sectionHref()` from any page), workshop URLs (`workshopPath()`, `bookingHref()` with `?zi=…&ora=…`) and the site time zone. Never hardcode `#afisier` or `/atelier/…`.
- `booking/`: booking requests. `actions.ts` is the Server Action (Zod `schema.ts`, honeypot, in-memory `rateLimit.ts`, `session.ts` re-reads the session from Sanity without cache, `emails.ts` + `send.ts` via Resend). `state.ts` is the client-safe result type; the form turns its codes into dictionary text. Without `RESEND_API_KEY`, dev prints emails to the terminal. Stage 2 (Stripe) replaces only the email step.
- SEO: every page's `generateMetadata` uses `pageMetadata()` from `lib/seo.ts` (canonical, hreflang, Open Graph with an explicit image). Structured data goes through `components/seo/JsonLd` + `lib/structuredData.ts`, and only with real values (no placeholders in JSON-LD). Absolute URLs come from `config/siteUrl.ts`.
- Cache: `sanityFetch` (in `sanity/live.ts`) tags every entry with `contentCacheTag`; the Sanity webhook at `app/api/revalidate` expires it on publish. Always fetch through it inside `"use cache"`.
- `data/`: `server-only` loaders (`getPosterBoard`, `getSiteSettings`). Each is a `"use cache"` function that calls `sanityFetch` (so `<SanityLive />` can revalidate it) and maps the query result to the UI types in `data/types.ts`. Components never see raw Sanity shapes.
- `i18n/`: locales, dictionaries, `fill()`. Server code gets the locale from `getLocale()` (`next/root-params`), not from props.
- `sanity/`: env, client, live, image URL builder, GROQ queries (`queries.ts`, `defineQuery`, unique `*_QUERY` names), `localized()` and the generated `sanity.types.ts` (never edit it; run `npm run typegen` in `studio/` after changing the schema or a query).

## Sanity (`studio/`)

- Translations are field-level: `localeString`, `localeText`, `localeBlockContent` objects with `ro`/`en` side by side. Use `requireLocales(rule)` for required text (RO is an error, EN a warning; the site falls back to RO). Queries fetch both languages; pick one with `localized(value, locale)`.
- Field titles, descriptions and validation messages are in Romanian, written for a non-technical editor. The Studio UI uses `@sanity/locale-ro-ro`.
- Workshop order is drag and drop (`@sanity/orderable-document-list`, `orderRank`). `siteSettings` is a singleton with the fixed id `siteSettings`.
- Session times use `displayTimeZone: Europe/Bucharest`; the site converts with `zonedDateTime()`.

## Design tokens (use the Tailwind names, never raw hex)

| Token | Hex | Use |
|---|---|---|
| `navy` | `#1F206A` | main text, dark sections |
| `navy-deep` | `#14154A` | silhouettes on dark (lamp, hidden cat) |
| `cherry` | `#DF111F` | rare accents: poster verbs, the booking CTA |
| `cream` | `#F4ECDD` | light background, text on dark |
| `bordeaux` | `#6E1F2F` | hero, gift voucher |
| `glow` | `#E9B44C` | light, primary buttons on dark, focus ring |
| `drape-dark` → `drape` | `#43101B` → `#6A1E2E` | header gradient |
| `cork`, `cork-frame`, `cork-frame-dark` | `#B7834F`, `#5E3D22`, `#3E2714` | poster board |
| `paper` | `#FBF6EC` | the register's page |
| `neon` | `#FFE08A` | core of the neon text/line in the hero (`neon-text`, `neon-stroke`) |

Fonts (`font-display`, `font-body`, `font-label`):
- **Fraunces** for headings. Hero h1: 600, `clamp(56px,9vw,120px)`, leading 0.95, tracking -0.02em. The second line is italic, weight 300–400, in `glow`.
- **Spectral 300** for all body text, buttons and the menu. Never swap it for a condensed or bold face.
- **DM Mono 400/500** for small uppercase labels, tracking 0.14–0.16em (e.g. "01 · AFIȘIERUL").

Large-screen scaling is done by the `html` font-size breakpoints in `globals.css`. Size everything in `rem` (Tailwind's default) so it scales; don't add `zoom`.

## Visual language

- Things lean slightly (rotations of 1–3°): double frames, pushpins, paper, cork, lamplight.
- No generic decorative gradients and no emoji.
- The mascot is the cat from the logo: cream oval eyes with a vertical almond pupil. The cat SVGs live in `web/src/components/cats/`. Their paths are final; don't redraw them.
- Animations (sway, tails, flicker, spin, lamp, draw) are Tailwind utilities in `globals.css`. Every one of them must stop under `prefers-reduced-motion`.

## Copy

- **Tone:** warm, a little cheeky, self-deprecating, never corporate. EN keeps the same attitude; it is not a literal translation.
- **Romanian diacritics:** use ș/ț with a comma below (U+0219, U+021B), never a cedilla (ş/ţ, U+015F, U+0163). Use ă, â, î correctly.
- **Placeholders stay visibly marked and are never invented:** `[PREȚ]`, `[ADRESA]`, `[Stația de metrou]`, `[@cont]`, `[număr WhatsApp]`, `[CUI]`, `[SUMA]`, workshop photos, reviews.

## Accessibility baseline

Semantic HTML, real `<button>`s, a visible gold focus ring (global), `aria-label` on icon-only buttons, `aria-hidden` on decorative SVGs, AA contrast. Interactive easter eggs (the light switch, the hidden cat) must work from the keyboard.

## Working agreement (end of each step)

The brief requires stopping after every step of §10. Before reporting a step as done:
1. Run `npm run lint`, `npx tsc --noEmit` and `npm run build` in `web/`. Report any failures as they are.
2. Check the step at 360px and at desktop width, plus reduced motion where it matters, in both `/` (RO) and `/en`.
3. Tell the user what was built, the exact URL(s) and what to look at, and anything left as a placeholder or deferred.
4. Wait for their confirmation before starting the next step.
