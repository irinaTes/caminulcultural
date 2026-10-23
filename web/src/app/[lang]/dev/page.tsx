import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import {
  ApprovedStamp,
  CatEyes,
  FrameCat,
  HangingLamp,
  MapPinCat,
  PartyCat,
  PawPrint,
  PeekingCat,
  SexyCat,
  SleepingCat,
} from "@/components/cats";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { ScaleReadout } from "./ScaleReadout";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const palette = [
  {
    name: "Midnight Navy",
    token: "navy",
    hex: "#1F206A",
    className: "bg-navy text-cream",
  },
  {
    name: "Navy deep",
    token: "navy-deep",
    hex: "#14154A",
    className: "bg-navy-deep text-cream",
  },
  {
    name: "Cherry Red",
    token: "cherry",
    hex: "#DF111F",
    className: "bg-cherry text-cream",
  },
  {
    name: "Paper Cream",
    token: "cream",
    hex: "#F4ECDD",
    className: "bg-cream text-navy",
  },
  {
    name: "Velvet Bordeaux",
    token: "bordeaux",
    hex: "#6E1F2F",
    className: "bg-bordeaux text-cream",
  },
  {
    name: "Lamp Glow",
    token: "glow",
    hex: "#E9B44C",
    className: "bg-glow text-navy",
  },
  {
    name: "Draperie",
    token: "drape-dark → drape",
    hex: "#43101B → #6A1E2E",
    className: "bg-linear-to-b from-drape-dark to-drape text-cream",
  },
  {
    name: "Plută",
    token: "cork",
    hex: "#B7834F",
    className: "bg-cork text-navy",
  },
  {
    name: "Ramă",
    token: "cork-frame / -dark",
    hex: "#5E3D22 / #3E2714",
    className:
      "bg-cork-frame text-cream ring-8 ring-cork-frame-dark ring-inset",
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-8 border-t border-navy/20 py-16">
      <h2 className="font-label text-sm tracking-label-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Specimen({
  label,
  dark,
  children,
}: {
  label: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <figure
      className={`flex flex-col items-center justify-end gap-4 rounded-sm p-6 ${dark ? "bg-navy text-cream" : "bg-white/50"}`}
    >
      <div className="flex min-h-44 items-end justify-center">{children}</div>
      <figcaption className="font-label text-xs tracking-label uppercase">
        {label}
      </figcaption>
    </figure>
  );
}

export default async function DevPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.dev;

  return (
    <main
      id="continut"
      className="mx-auto w-full max-w-content px-gutter py-16"
    >
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-5xl font-semibold tracking-tight">
            {t.title}
          </h1>
          <p className="max-w-xl text-lg">{t.intro}</p>
        </div>
        <LanguageSwitch locale={locale} path="/dev" t={dict.common} />
      </header>

      <Section title={t.palette}>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
          {palette.map((c) => (
            <li
              key={c.token}
              className={`flex h-36 flex-col justify-end gap-1 rounded-sm p-4 ${c.className}`}
            >
              <span className="font-display text-lg font-semibold">
                {c.name}
              </span>
              <span className="font-label text-xs tracking-label uppercase">
                {c.token}
              </span>
              <span className="font-label text-xs">{c.hex}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.fonts}>
        <div className="flex flex-col gap-2 bg-bordeaux px-6 py-10 text-cream">
          <p className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.02em]">
            {dict.hero.title}
            <br />
            <em className="inline-block animate-flicker font-normal text-glow">
              {dict.hero.titleAccent}
            </em>
          </p>
          <svg
            viewBox="0 0 360 26"
            aria-hidden="true"
            className="mt-1 w-90 max-w-[80%]"
          >
            <path
              pathLength={1}
              d="M4 15 Q40 3 80 13 T160 13 T240 13 T354 10"
              fill="none"
              stroke="var(--color-glow)"
              strokeWidth="5"
              strokeLinecap="round"
              className="draw-on"
            />
          </svg>
        </div>
        <dl className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <dt className="font-label text-xs tracking-label uppercase">
              Fraunces 400 / 600 / italic
            </dt>
            <dd className="font-display text-3xl">{t.pangram}</dd>
            <dd className="font-display text-3xl font-semibold">{t.pangram}</dd>
            <dd className="font-display text-3xl italic">{t.pangram}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="font-label text-xs tracking-label uppercase">
              Spectral 300 / 300 italic
            </dt>
            <dd className="text-xl leading-relaxed">{t.pangram}</dd>
            <dd className="text-xl leading-relaxed italic">{t.pangram}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className="font-label text-xs tracking-label uppercase">
              DM Mono 400 / 500
            </dt>
            <dd className="font-label text-sm tracking-label uppercase">
              {t.palette}
            </dd>
            <dd className="font-label text-sm font-medium tracking-label-wide uppercase">
              {dict.hero.kicker}
            </dd>
            <dd className="font-label text-sm">ăâîșț ĂÂÎȘȚ 0123456789</dd>
          </div>
        </dl>
      </Section>

      <Section title={t.logo}>
        <div className="flex flex-wrap gap-6">
          <div className="bg-cream p-6 ring-1 ring-navy/20">
            <Logo color="var(--color-navy)" className="w-32" />
          </div>
          <div className="bg-navy p-6">
            <Logo color="var(--color-cream)" className="w-32" />
          </div>
          <div className="bg-linear-to-b from-drape-dark to-drape p-6">
            <Logo color="var(--color-cream)" className="w-32" />
          </div>
          <div className="bg-cream p-6 ring-1 ring-navy/20">
            <Logo color="var(--color-bordeaux)" className="w-32" />
          </div>
        </div>
      </Section>

      <Section title={t.cats}>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
          <Specimen label={t.catNames.eyes} dark>
            <div style={{ "--mx": 0.8, "--my": 0.4 } as CSSProperties}>
              <CatEyes className="scale-75" />
            </div>
          </Specimen>
          <Specimen label={t.catNames.lamp}>
            <HangingLamp className="w-48 origin-top animate-lamp" />
          </Specimen>
          <Specimen label={t.catNames.frame}>
            <FrameCat className="w-22" />
          </Specimen>
          <Specimen label={t.catNames.peek}>
            <PeekingCat className="w-14" />
          </Specimen>
          <Specimen label={t.catNames.party} dark>
            <PartyCat className="w-44" />
          </Specimen>
          <Specimen label={t.catNames.sleeping}>
            <div className="relative">
              <span className="absolute -top-2 right-1.5 font-label text-lg tracking-[0.2em] text-bordeaux">
                z z z
              </span>
              <SleepingCat className="w-52" />
            </div>
          </Specimen>
          <Specimen label={t.catNames.map} dark>
            <MapPinCat className="w-30" />
          </Specimen>
          <Specimen label={t.catNames.sexy}>
            <SexyCat className="w-52" />
          </Specimen>
          <Specimen label={t.catNames.stamp}>
            <ApprovedStamp
              label={locale === "ro" ? "APROBAT" : "APPROVED"}
              className="w-24 -rotate-[14deg] opacity-85"
            />
          </Specimen>
          <Specimen label={t.catNames.paw}>
            <div className="flex gap-3">
              <PawPrint className="w-8 -rotate-18 opacity-80" />
              <PawPrint className="w-8 rotate-14 opacity-80" />
            </div>
          </Specimen>
        </div>
      </Section>

      <Section title={t.motion}>
        <p className="max-w-xl text-lg">{t.motionNote}</p>
        <div className="flex flex-wrap items-start gap-10">
          <div className="w-64 origin-top animate-sway bg-white p-5 shadow-lg">
            <span
              className="mx-auto mb-3 block size-4 rounded-full bg-cherry shadow"
              aria-hidden="true"
            />
            <p className="font-display text-2xl text-cherry">
              Spargem oglinzi!
            </p>
          </div>
          <svg
            viewBox="0 0 150 150"
            aria-hidden="true"
            className="w-36 animate-spin-slow"
          >
            <defs>
              <path
                id="dev-ring"
                d="M75 75 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0"
              />
            </defs>
            <circle
              cx="75"
              cy="75"
              r="72"
              fill="none"
              stroke="var(--color-glow)"
              strokeWidth="1.5"
            />
            <circle
              cx="75"
              cy="75"
              r="44"
              fill="none"
              stroke="var(--color-glow)"
              strokeWidth="1"
            />
            <text
              fontSize="10.5"
              letterSpacing="1.4"
              fill="var(--color-bordeaux)"
              style={{ fontFamily: "var(--font-label)" }}
            >
              <textPath href="#dev-ring">
                ATELIERE · VIN · LUMINĂ DE LAMPĂ · BUCUREȘTI ·
              </textPath>
            </text>
          </svg>
        </div>
      </Section>

      <Section title={t.scaling}>
        <p className="text-lg">
          {t.scalingNote} <ScaleReadout />
        </p>
      </Section>
    </main>
  );
}
