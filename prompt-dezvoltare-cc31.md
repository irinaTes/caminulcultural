# Prompt: dezvoltarea website-ului Căminul Cultural 31

> Atașează împreună cu acest prompt: `cc31-mockup.html` (mockup-ul homepage-ului) și `logo-cc31.svg` (logo-ul original).

---

Salut! Vreau să construim împreună website-ul pentru **Căminul Cultural 31** (pe scurt CC31), un spațiu de ateliere creative din București. Sunt frontend developer cu experiență în React și Next.js, deci poți vorbi tehnic cu mine. Lucrăm pas cu pas: după fiecare etapă din planul de mai jos te oprești, îmi spui ce ai făcut și cum verific, și aștepți confirmarea mea înainte să treci mai departe.

## 1. Conceptul

Căminul cultural de la sat, mutat în oraș, „după ore”. Seara, la lumină de lampă, cu un pahar de vin în mână, oamenii (mai ales femei, 10–15 pe atelier) fac lucruri cu mâinile lor: mozaic, pictură naivă, kinusaiga, cocktailuri, lămpi, seri de relaxare. Atelierele durează 3 ore, cu materiale și vin incluse. Spațiul se poate închiria și pentru evenimente private (burlăcițe, zile de naștere). Se vând și bilete de favoare (vouchere cadou nominale, valabile 3 luni).

**Tonul:** cald, puțin obraznic, autoironic, niciodată corporate. Ca referință de atitudine (nu de design): kvartira-67.ru.

**Atmosfera vizuală:** lumină caldă de lampă, cortină de velur bordo, puțin Twin Peaks, artă naivă. Mascota e pisica din logo, cu ochi ovali crem și pupilă verticală în formă de migdală.

Tot textul de pe site e în **română**, cu diacritice corecte (ș, ț cu virgulă, nu cu sedilă).

## 2. Stack-ul

- **Next.js** (ultima versiune stabilă, App Router) + **TypeScript** strict
- Stilizare: **CSS Modules** sau **Tailwind**; propune-mi tu varianta care ține design tokens-urile cel mai curat, apoi întreabă-mă
- **GSAP + ScrollTrigger** pentru afișierul cu scroll orizontal (pin + scrub)
- **Motion** (fostul Framer Motion) pentru animațiile de UI (cortina, pâlpâirea titlului, hover-uri)
- **next/font/google** pentru fonturi, cu subsetul `latin-ext`
- **Sanity** ca CMS (ateliere, sesiuni, poze), cu Studio-ul inclus în proiect la `/studio`
- **Resend** pentru emailurile de rezervare (etapa 1)
- Găzduire pe **Vercel**, domeniul `caminulcultural31.ro`
- Etapa 2 (NU acum, doar pregătește structura): **Stripe Checkout** + **Supabase** pentru plăți și locuri numărate automat
- ESLint + Prettier, `pnpm`

## 3. Design tokens

**Culori**

| Nume | Hex | Folosire |
|---|---|---|
| Midnight Navy | `#1F206A` | text principal, secțiuni închise |
| Cherry Red | `#DF111F` | accente rare (verbele de pe afișe, CTA rezervare) |
| Paper Cream | `#F4ECDD` | fundal deschis, text pe închis |
| Velvet Bordeaux | `#6E1F2F` | hero, bilet de favoare |
| Lamp Glow | `#E9B44C` | lumină, butoane principale pe închis |
| Bordeaux închis (draperie) | `#43101B` → `#6A1E2E` | header-ul (gradient) |
| Plută | `#B7834F` + rama `#5E3D22` / `#3E2714` | panoul afișierului |

**Fonturi**

- **Fraunces** (400, 600, plus italic): titluri. `h1` hero: 600, `clamp(56px, 9vw, 120px)`, line-height 0.95, letter-spacing -0.02em; a doua linie italic 400 în Lamp Glow.
- **Spectral Light** (300, plus italic 300; 400 opțional): tot textul de corp, butoane, meniu. Font lat și subțire: NU-l înlocui cu ceva condensed sau bold.
- **DM Mono** (400, 500): etichete mici, uppercase, letter-spacing 0.14–0.16em (ex. „01 · AFIȘIERUL”).

**Limbaj grafic:** elemente ușor strâmbe („the lean”, rotații de 1–3°), ramă dublă, pioneze, hârtie, plută, lumină de lampă. Fără gradienturi decorative generice și fără emoji.

**Scalare pe ecrane mari:** sub 1600px designul e la mărimea de bază. Peste, totul crește proporțional (aprox. ×1.1 la 1600, ×1.22 la 1800, ×1.35 la 2000, ×1.55 la 2300, ×1.8 la 2700, ×2.1 la 3200+). În mockup am folosit `zoom`; în implementare fă-o curat, de exemplu cu `font-size` pe `html` scalat pe breakpoint-uri și totul în `rem`.

## 4. Mockup-ul atașat

`cc31-mockup.html` e **referința de design și comportament**, nu cod de copiat. Se deschide direct în browser (are nevoie de internet doar pentru fonturi), deci îl poți rula ca să vezi exact cum trebuie să arate și să se miște totul. Intern e un mockup: un `<template id="cc-tpl">` cu marcaj în format propriu (`{{hole}}`, `<sc-for>`, `<sc-if>`), randat de un mic runtime peste React UMD, plus logica în `class Component extends DCLogic`. Nu-l porta mecanic. Citește-l ca să extragi:

- structura secțiunilor, textele, culorile, dimensiunile, spațierile;
- logica interacțiunilor din `renderVals()` și `componentDidMount()`;
- **ilustrațiile SVG ale pisicilor** (copiază path-urile în componente React, ele sunt finale).

`logo-cc31.svg` e logo-ul original (ramă strâmbă, monogramă, pisică, pahar de martini). Fă din el o componentă `<Logo color=… />`.

## 5. Homepage: secțiuni și comportament

Pagina e fluidă (nu lățime fixă), conținut până la ~1400px, margini laterale `clamp(16px, 5vw, 72px)`, secțiuni aerisite (~150–170px padding vertical pe desktop).

### Header = draperia cortinei
- Fundal gradient bordeaux `#43101B` → `#6A1E2E`, fir auriu la bază.
- Sub el, volane rotunjite (semicercuri de ~40px, repetate) care cad peste hero, cu umbră și un șir de mărgele aurii.
- Logo-ul crem + textul „CĂMINUL / CULTURAL 31” în DM Mono, apoi meniul: **Afișierul, Închiriază Căminul, Bilet de favoare, Condica, Cum ajungi** (ancore), și butonul auriu „Scrie-i administratoarei”.
- Pe mobil: meniu hamburger.

### Hero „Cultură, după ore.”
- Umple exact ecranul la intrare (`100svh` minus header), conținut centrat vertical.
- **Starea inițială e pe întuneric:** cortina de velur bordo (două jumătăți cu falduri) e trasă, iar un overlay aproape negru acoperă totul. Cursorul (și degetul pe mobil) e o lampă: un cerc de lumină radial care dezvăluie ce e dedesubt.
- **Ochii pisicii** (doi ovali crem, mai lați decât înalți, ~128×100px, cu pupila migdală navy) stau peste întuneric și urmăresc cursorul.
- **Întrerupătorul vechi:** placă pătrată din plastic îngălbenit, cu pete de vechime, rozetă rotundă cu două șuruburi și clapetă albă care basculează. Click → „APRINDE LUMINA” / „STINGE LUMINA”, cu `aria-pressed`.
- **La aprindere:** overlay-ul dispare (~1.1s), cortina se trage lateral (~1.8s, easing moale), titlul se aprinde pâlpâind ca un bec vechi, iar sub „după ore.” se desenează o linie ondulată aurie, ca de mână (stroke-dashoffset).
- Lampa cu abajur atârnă de sub draperie și se leagănă ușor. Pe abajur doarme o pisică navy, cu coada atârnând și legănându-se.
- O ștampilă rotundă cu „31” în mijloc și textul circular „ATELIERE · VIN · LUMINĂ DE LAMPĂ · BUCUREȘTI ·” se rotește lent (ascunsă pe mobil).
- Textul: kicker „ATELIERE DE ARTĂ NAIVĂ · BUCUREȘTI”, paragraf „Căminul de la sat, mutat în oraș. Venim seara, la lumină de lampă, cu un pahar de vin în mână, și facem lucruri cu mâinile noastre. Nu-i școală, nu-i critică. E seara ta.”, butoane „Vezi afișierul” și „Închiriază Căminul”.

### 01 · Afișierul (piesa centrală)
- Titlu „Ce facem săptămâna asta”, subtitlu, indicație „SCROLLEAZĂ ÎN JOS ↓ AFIȘELE VIN SPRE TINE”.
- **Panoul de plută ocupă tot viewport-ul** și se fixează (pin). La scroll vertical, afișele alunecă pe orizontală (GSAP ScrollTrigger, `scrub`). După ultimul afiș pagina continuă normal.
- Textura de plută (pori mici, pete), rama groasă de lemn închis, umbră interioară. Un cerc de lumină caldă urmărește cursorul pe panou.
- Afișele sunt pe **2 rânduri**, restul continuă pe orizontală. Pe ecrane scunde, track-ul se scalează ca să încapă cele 2 rânduri.
- **Fiecare afiș** (card lat, ~640px, culcat): pioneză roșie sau aurie, rotație ușoară, umbră. În stânga o **fotografie** (din CMS, deocamdată placeholder), în dreapta:
  - kicker „MOZAIC · 3 ORE”, verbul în Fraunces roșu („Spargem oglinzi!”), o propoziție descriptivă;
  - **ZIUA:** chip-uri cu următoarele sesiuni (ex. „joi 23 oct”), **ORA:** chip-uri cu orele disponibile;
  - jos: „[PREȚ] lei · vin inclus” și, doar după ce ai ales ziua și ora, butonul roșu „Rezervă · joi 23 oct, 19:30”. Până atunci: „ALEGE ZIUA ȘI ORA”.
  - Afișele NU se întorc.
- **Animații:** fiecare afiș se leagănă ușor din pioneză, ca în bătaia vântului (rotație ±1.1°, durate și decalaje diferite, `transform-origin` sus), și se ridică puțin la hover.
- La capăt, un card punctat „Aici vine afișul următor.” cu link „Propune un atelier”.
- **Pisicile de pe panou:** una navy stă pe ramă (cu coada mișcându-se). Una ascunsă se uită de după rama de jos (buton cu `aria-label`). Click pe ea → bulină „MIAU! COD: NUPLECAÎNCĂ · 10% LA PRIMA VIZITĂ”.
- Atelierele actuale (verb, nume, descriere scurtă):
  - Spargem oglinzi! · Mozaic · Spargem, lipim și plecăm acasă cu o oglindă pe care n-o mai are nimeni.
  - Pictăm naiv! · Pictură · Fără talent obligatoriu și fără critici. Doar pensule, culori și un pahar de roșu.
  - Croim fără ac! · Kinusaiga · Tehnica japoneză în care materialul intră în lemn, nu sub ac.
  - Mișcăm shakerul! · Cocktailuri · Trei cocktailuri: le faci, le guști și uiți rețeta pe drum spre casă.
  - Ne facem lumină! · Lămpi · Pleci cu lampa ta. Și cu o poveste despre cum ai făcut-o.
  - Ne descărcăm! · Energie feminină · Respirăm, ne relaxăm, ne ascultăm. Telefoanele dorm.

### 02 · Închiriază Căminul (fundal navy)
- Titlu „Tot căminul, doar pentru voi.” și textul despre evenimente private.
- **Configurator:** ocazia (Burlăciță, Zi de naștere, Despărțiță, Seară cu echipa, Altceva), atelierul, numărul de oameni (stepper 5–15).
- Un bilețel crem, ușor rotit, generează live mesajul: „Bună! Vrem să închiriem Căminul pentru o burlăciță, cu atelierul de mozaic, pentru 10 oameni. Când aveți liber?”
- Buton „Trimite mesajul pe Instagram” (deep link sau copiere în clipboard + deschidere DM; propune-mi soluția).
- Pisică crem cu pălărie de petrecere și martini.

### 03 · Bilet de favoare (fundal bordeaux)
- Input „Pentru cine e?” și alegerea „Un atelier anume” / „O sumă, alege ea”.
- Previzualizare live a unui bilet vintage (corp crem + cotor auriu perforat, „NR. 031”, „ADMITE 1 PERSOANĂ · VALABIL 3 LUNI”), cu ștampila bordo „APROBAT” cu capul pisicii.

### 04 · Condica
- Tabel stilizat ca registru de prezență (DATA, NUMELE, CE A RĂMAS CU EA, SEMNĂTURA), ușor rotit, cu umbră navy plină. Semnăturile sunt urme de lăbuță.
- Recenziile vin din CMS. Fără recenzii inventate: până la primele reale, placeholdere clare.
- Pisică navy care doarme pe registru („z z z”).

### 05 · Cum ajungi la Cămin (fundal navy)
- „București e mare. Nu te baza pe intuiție.”, adresa, metroul, butoane Instagram și WhatsApp.
- Hartă (embed sau imagine statică cu link spre Google Maps; propune varianta fără cookies de tracking).
- Pisică crem lângă un pin roșu.

### Footer (fundal crem)
- „Ne vedem / *la Cămin.*” mare, în Fraunces roșu.
- Pisica „sexy” navy (zveltă, ochi pe jumătate închiși, choker auriu cu perlă, coadă în S care se leagănă). Path-urile sunt în mockup.
- Rândul legal: „Căminul Cultural 31 · Subcultura SRL · CUI [CUI]”, Termeni, Confidențialitate, Politica de anulare, plus pictogramele ANPC (SAL și SOL) pregătite pentru etapa 2.

## 6. Conținut în Sanity

Propune schema și discut-o cu mine înainte de implementare. Punct de plecare:

- **workshop:** `title`, `slug`, `verb`, `shortLine`, `description` (rich text), `photo` (cu `alt` obligatoriu), `price`, `durationHours` (default 3), `capacity`, `pinColor`, `order`
- **session:** referință la `workshop`, `startsAt` (datetime, fus orar Europe/Bucharest), `seatsLeft`, `status` (deschis / plin / anulat)
- **review:** `date`, `firstName`, `text`, `workshop` (opțional), `published`
- **siteSettings:** adresă, metrou, Instagram, WhatsApp, email, date firmă, cod promo pisică

Afișierul arată doar sesiunile viitoare, grupate pe atelier. Editorul din `/studio` trebuie să fie simplu, pentru că îl va folosi și o persoană netehnică.

## 7. Rezervările în etapa 1 (fără plată)

- Butonul „Rezervă” deschide un formular scurt (nume, telefon, email, nr. persoane, observații), cu atelierul, data și ora deja completate.
- Server Action → validare cu **Zod** → email către noi prin Resend + email de confirmare către client („Am primit cererea, îți confirmăm în maxim 24h”).
- Honeypot anti-spam și rate limiting simplu.
- Locurile rămase le actualizăm manual în Sanity.
- Structura de cod să permită ușor înlocuirea cu Stripe Checkout în etapa 2.

## 8. Cerințe transversale

- **Accesibilitate:** HTML semantic, butoane reale, focus vizibil auriu, `aria-label` pe butoanele cu iconițe, SVG-urile decorative cu `aria-hidden`, contrast AA. Întrerupătorul și pisica ascunsă trebuie să meargă și din tastatură.
- **`prefers-reduced-motion`:** fără leagăn, fără pâlpâire, cortina deschisă direct, iar afișierul cu scroll orizontal nativ în loc de pin.
- **Mobil:** totul funcționează la 360px. Lampa din hero urmărește degetul. Afișierul: pe mobil propune-mi fie pin pe un singur rând, fie carusel cu swipe.
- **Performanță:** imagini prin `next/image`, fonturi fără CLS, GSAP încărcat doar unde e nevoie, Lighthouse ≥ 90 pe mobil.
- **SEO:** metadate în română, Open Graph cu logo-ul, `sitemap.xml`, `robots.txt`, JSON-LD `LocalBusiness` + `Event` pentru sesiuni.
- **Analytics:** Vercel Analytics sau Plausible (fără banner de cookies).
- `.env.example` cu toate variabilele (Sanity, Resend etc.) și un `README.md` cu pașii de rulare și deploy.

## 9. Placeholdere de lăsat clar marcate

`[PREȚ]`, `[ADRESA]`, `[Stația de metrou]`, `[@cont]`, `[număr WhatsApp]`, `[CUI]`, `[SUMA]` voucher, fotografiile atelierelor, recenziile. Nu inventa cifre, adrese sau recenzii.

## 10. Planul de lucru (oprește-te după fiecare pas)

1. **Setup:** proiect Next.js + TS, linting, structura de foldere, design tokens, fonturile, scalarea pe ecrane mari, componentele `Logo` și pisicile SVG. Îmi arăți o pagină de test cu paleta, fonturile și pisicile.
2. **Header-draperie + Hero** cu tot comportamentul (lampa, ochii, întrerupătorul, cortina, pâlpâirea, linia desenată, ștampila).
3. **Afișierul** cu GSAP ScrollTrigger, întâi cu date statice dintr-un fișier `data/workshops.ts`.
4. **Închiriază Căminul, Bilet de favoare, Condica, Cum ajungi, Footer.**
5. **Sanity:** schema, Studio la `/studio`, mutarea datelor din fișierul static în CMS.
6. **Rezervările** (formular, Server Action, Resend).
7. **Pagini legale** (stub-uri), SEO, analytics, verificare accesibilitate și reduced-motion, deploy pe Vercel.

Înainte de pasul 1, pune-mi întrebările care te-ar bloca (ex. Tailwind vs CSS Modules, varianta de afișier pe mobil), apoi începe.
