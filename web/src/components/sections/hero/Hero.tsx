import { CatEyes, HangingLamp } from "@/components/cats";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { anchor, sectionIds } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { HeroLightSwitch } from "./HeroLightSwitch";
import { HeroStage } from "./HeroStage";
import { Stamp } from "./Stamp";

// State-driven styles, read from HeroStage's data attributes:
// - lit: the light is on (or untouched with reduced motion, after hydration);
// - auto: untouched with reduced motion, before hydration.
const lit = {
  curtainLeft:
    "group-data-[lit=true]:-translate-x-[93%] motion-reduce:group-data-[light=auto]:-translate-x-[93%]",
  curtainRight:
    "group-data-[lit=true]:translate-x-[93%] motion-reduce:group-data-[light=auto]:translate-x-[93%]",
  show: "group-data-[lit=true]:opacity-100 motion-reduce:group-data-[light=auto]:opacity-100",
  hide: "group-data-[lit=true]:opacity-0 motion-reduce:group-data-[light=auto]:opacity-0",
  remove:
    "group-data-[lit=true]:hidden motion-reduce:group-data-[light=auto]:hidden",
};

const curtain =
  "absolute inset-y-0 z-2 w-[50.5%] transition-transform duration-[1.8s] ease-[cubic-bezier(.6,.05,.25,1)]";

export async function Hero() {
  const { hero: t } = await getDictionary();

  return (
    <HeroStage
      id={sectionIds.home}
      className="group relative flex min-h-[calc(100svh-5.75rem)] flex-col justify-center overflow-hidden bg-bordeaux px-gutter pt-30 pb-27.5 text-cream"
    >
      {/* Velvet curtain */}
      <div
        aria-hidden="true"
        className={cn(
          curtain,
          "left-0 shadow-[10px_0_26px_rgba(0,0,0,0.45)] bg-velvet-left",
          lit.curtainLeft,
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          curtain,
          "right-0 shadow-[-10px_0_26px_rgba(0,0,0,0.45)] bg-velvet-right",
          lit.curtainRight,
        )}
      />

      {/* Warm glow from the lamp */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute -top-50 left-1/2 z-2 -ml-[28.125rem] h-175 w-225 rounded-[50%] bg-[radial-gradient(closest-side,rgba(233,180,76,0.38),rgba(233,180,76,0))] opacity-15 transition-opacity duration-[1.1s]",
          lit.show,
        )}
      />

      <HangingLamp className="absolute top-0 left-1/2 z-2 -ml-25 w-50 origin-top animate-lamp" />

      <div className="relative mx-auto flex w-full max-w-320 flex-wrap items-center gap-18">
        <div className="relative flex min-w-0 flex-[999_1_32.5rem] flex-col gap-6.5">
          <Stamp
            ring={t.stampRing}
            className="absolute -top-19.5 right-0 size-37.5 max-md:hidden"
          />

          <Eyebrow className="text-glow">{t.kicker}</Eyebrow>

          <div className="flex flex-col">
            <h1 className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.02em] group-data-[light=on]:animate-flicker">
              {t.title}
              <br />
              <em className="animate-buzz font-light neon-text">
                {t.titleAccent}
              </em>
            </h1>
            <svg
              viewBox="0 0 360 26"
              aria-hidden="true"
              className="mt-1 w-90 max-w-[80%] animate-buzz overflow-visible"
            >
              <path
                pathLength={1}
                d="M4 15 Q40 3 80 13 T160 13 T240 13 T354 10"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                className="neon-stroke draw-off group-data-[lit=true]:draw-on motion-reduce:group-data-[light=auto]:[stroke-dashoffset:0]"
              />
            </svg>
          </div>

          <p className="max-w-150 text-[1.375rem] leading-[1.55]">{t.lead}</p>

          <div className="flex flex-wrap gap-3.5">
            <ButtonLink
              href={anchor(sectionIds.poster)}
              variant="cream"
              size="lg"
            >
              {t.ctaPoster}
            </ButtonLink>
            <ButtonLink
              href={anchor(sectionIds.rent)}
              variant="outline"
              size="lg"
            >
              {t.ctaRent}
            </ButtonLink>
          </div>
        </div>

        {/* Above the dark overlay: the eyes and the switch glow in the dark. */}
        <div className="relative z-4 flex flex-[1_1_16.25rem] flex-col items-center gap-7.5">
          <CatEyes />
          <HeroLightSwitch labels={{ on: t.lightOn, off: t.lightOff }} />
        </div>
      </div>

      {/* Darkness with a lamp-sized hole at the pointer */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-3 bg-[radial-gradient(circle_15rem_at_calc(var(--mx)*100%)_calc(var(--my)*100%),rgba(12,11,30,0)_0%,rgba(12,11,30,0.55)_55%,rgba(8,8,22,0.97)_100%)] transition-opacity duration-[1.1s] ease-[ease]",
          lit.hide,
        )}
      />

      <Eyebrow
        className={cn(
          "absolute inset-x-0 bottom-10 z-5 px-gutter text-center text-glow",
          lit.remove,
        )}
      >
        {t.darkHint}
      </Eyebrow>
    </HeroStage>
  );
}
