import { DM_Mono, Fraunces, Spectral } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

// Body text is all 300 (the brief); bold in rich text is synthesized.
export const spectral = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const dmMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
  // Small labels only: not worth delaying the first paint for. The size-
  // adjusted fallback keeps the swap from shifting the layout.
  preload: false,
});

/** The three `--font-*` variables, for the `<html>` element. */
export const fontVariables = [fraunces, spectral, dmMono]
  .map((font) => font.variable)
  .join(" ");
