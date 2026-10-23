"use client";

import { useState } from "react";
import { PeekingCat } from "@/components/cats";

type HiddenCatProps = {
  label: string;
  message: string;
};

/** The cat peeking over the bottom of the frame. Finding it reveals a promo code. */
export function HiddenCat({ label, message }: HiddenCatProps) {
  const [found, setFound] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={label}
        aria-expanded={found}
        onClick={() => setFound(true)}
        className="absolute right-16 bottom-2.5 z-3 h-12 w-14 cursor-pointer"
      >
        <PeekingCat className="block h-12 w-14" />
      </button>
      <p
        aria-live="polite"
        className="absolute right-32 bottom-5.5 z-3 max-w-[calc(100%-10rem)] empty:hidden"
      >
        {found && (
          <span className="block rounded-[12px_12px_2px_12px] bg-glow px-3 py-2 font-label text-[0.8125rem] tracking-[0.1em] text-navy uppercase">
            {message}
          </span>
        )}
      </p>
    </>
  );
}
