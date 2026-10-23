import { DM_Mono, Fraunces, Spectral } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const spectral = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

/** The three `--font-*` variables, for the `<html>` element. */
export const fontVariables = [fraunces, spectral, dmMono]
  .map((font) => font.variable)
  .join(" ");
