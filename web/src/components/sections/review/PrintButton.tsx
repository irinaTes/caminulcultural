"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton({ label }: { label: string }) {
  return (
    <Button variant="cherry" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
