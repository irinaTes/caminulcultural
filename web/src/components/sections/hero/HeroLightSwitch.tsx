"use client";

import { useHeroLight } from "./HeroStage";
import { LightSwitch } from "./LightSwitch";

type HeroLightSwitchProps = {
  labels: { on: string; off: string };
};

export function HeroLightSwitch({ labels }: HeroLightSwitchProps) {
  const { lit, toggle } = useHeroLight();
  return (
    <LightSwitch
      on={lit}
      label={lit ? labels.off : labels.on}
      onToggle={toggle}
    />
  );
}
