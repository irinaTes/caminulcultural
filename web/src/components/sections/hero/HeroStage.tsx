"use client";

import {
  createContext,
  use,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePointerVars } from "@/hooks/usePointerVars";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * "auto" is the untouched first state: dark, unless the visitor prefers
 * reduced motion, in which case the curtain is already open (CSS handles this
 * before hydration via `motion-reduce:group-data-[light=auto]:`).
 */
type Light = "auto" | "on" | "off";

const HeroLightContext = createContext<{
  lit: boolean;
  toggle: () => void;
} | null>(null);

export function useHeroLight() {
  const value = use(HeroLightContext);
  if (!value) throw new Error("useHeroLight must be used inside <HeroStage>");
  return value;
}

type HeroStageProps = {
  id: string;
  className: string;
  children: ReactNode;
};

/**
 * The hero's only client state: whether the light is on, and where the
 * pointer is. Both are exposed to the server-rendered children through
 * `data-light`/`data-lit` (for `group-data-*` classes) and the `--mx`/`--my`
 * custom properties, so moving the pointer never re-renders React.
 */
export function HeroStage({ id, className, children }: HeroStageProps) {
  const [light, setLight] = useState<Light>("auto");
  const reducedMotion = useReducedMotion();
  const lit = light === "on" || (light === "auto" && reducedMotion);

  const sectionRef = useRef<HTMLElement>(null);
  const moveLamp = usePointerVars(sectionRef, "--mx", "--my");

  return (
    <HeroLightContext
      value={{ lit, toggle: () => setLight(lit ? "off" : "on") }}
    >
      <section
        id={id}
        ref={sectionRef}
        data-light={light}
        data-lit={lit}
        onPointerMove={(e) => moveLamp(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          if (touch) moveLamp(touch.clientX, touch.clientY);
        }}
        style={{ "--mx": 0.68, "--my": 0.42 } as CSSProperties}
        className={className}
      >
        {children}
      </section>
    </HeroLightContext>
  );
}
