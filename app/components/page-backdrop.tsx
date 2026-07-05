"use client";

import { BigSurWaves } from "../desktop/starfield";

/* Faint Big Sur wallpaper wash behind page content, so the standalone pages
   feel like they belong to the same OS as the desktop. Hidden when the page
   renders inside a desktop window (the `.embedded` html class) — app content
   shouldn't paint its own wallpaper. */

export function PageBackdrop() {
  return (
    <div
      aria-hidden
      className="page-backdrop fixed inset-0 z-0 pointer-events-none opacity-[0.32] dark:opacity-[0.16] saturate-[0.9]"
    >
      <BigSurWaves />
    </div>
  );
}
