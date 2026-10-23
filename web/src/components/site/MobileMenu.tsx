"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type NavLink = { href: string; label: string };

type MobileMenuProps = {
  links: NavLink[];
  contact: NavLink;
  labels: { nav: string; open: string; close: string };
  /** Extra items under the links, e.g. the language switch. */
  children?: ReactNode;
};

export function MobileMenu({
  links,
  contact,
  labels,
  children,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // The panel fills the screen from the header's bottom edge down; the
    // page behind it doesn't scroll while it's open.
    const measure = () => {
      const header = buttonRef.current?.closest("header");
      setTop(Math.max(0, header?.getBoundingClientRect().bottom ?? 0));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const root = document.documentElement;
    const overflow = root.style.overflow;
    measure();
    root.style.overflow = "hidden";
    window.addEventListener("resize", measure);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("resize", measure);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-7 bg-cream transition-transform",
            open && "translate-y-2 rotate-45",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-7 bg-cream transition-opacity",
            open && "opacity-0",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            "h-0.5 w-7 bg-cream transition-transform",
            open && "-translate-y-2 -rotate-45",
          )}
        />
      </button>

      <nav
        id={panelId}
        aria-label={labels.nav}
        hidden={!open}
        style={{ top }}
        className="fixed inset-x-0 bottom-0 z-30 overflow-y-auto overscroll-contain bg-drape px-gutter pt-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] shadow-[inset_0_-3px_0_rgba(233,180,76,0.75)]"
      >
        <ul className="flex flex-col text-xl">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-cream"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <ButtonLink
            href={contact.href}
            variant="glow"
            onClick={() => setOpen(false)}
          >
            {contact.label}
          </ButtonLink>
          {children}
        </div>
      </nav>
    </div>
  );
}
