"use client";

import { useEffect, useState } from "react";
import { FaceId } from "./face-id";

/* Big Sur menu bar: slim translucent strip, bold app name beside the logo
   slot (the Face ID glyph lives there), plain menu items, and status glyphs
   + clock on the right. Light and dark follow the site theme; the sun/moon
   glyph toggles it, mirroring the ThemeToggle used on the content pages. */

function Clock() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const wd = d.toLocaleDateString("en-US", { weekday: "short" });
      const mo = d.toLocaleDateString("en-US", { month: "short" });
      const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      setNow(`${wd} ${mo} ${d.getDate()}  ${time}`);
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums whitespace-pre">{now}</span>;
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" className="w-[15px] h-[15px]" aria-hidden="true">
      <path d="M2.5 9.5C8 4.5 16 4.5 21.5 9.5M5.5 13c4-3.5 9-3.5 13 0M8.6 16.4c2-1.7 4.8-1.7 6.8 0" />
      <circle cx="12" cy="19.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" className="w-[14px] h-[14px]" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15.2 15.2 4.8 4.8" />
    </svg>
  );
}

function ControlCenterGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-[14px] h-[14px]" aria-hidden="true">
      <rect x="2.5" y="4" width="19" height="7" rx="3.5" />
      <circle cx="6.5" cy="7.5" r="2" fill="currentColor" stroke="none" />
      <rect x="2.5" y="13" width="19" height="7" rx="3.5" />
      <circle cx="17.5" cy="16.5" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SunMoonGlyph({ dark }: { dark: boolean }) {
  return dark ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-[14px] h-[14px]" aria-hidden="true">
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" className="w-[14px] h-[14px]" aria-hidden="true">
      <path d="M21 14.1A8.2 8.2 0 0 1 9.9 3a6.8 6.8 0 1 0 11.1 11.1Z" />
    </svg>
  );
}

function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    root.style.colorScheme = next ? "dark" : "light";
    try {
      window.localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  return { dark, toggle };
}

export function MenuBar({ onOpen }: { onOpen: (app: string) => void }) {
  const { dark, toggle } = useTheme();

  const items: { label: string; app: string }[] = [
    { label: "Blog", app: "blog" },
    { label: "About", app: "about" },
    { label: "Portfolio", app: "portfolio" },
    { label: "Learning", app: "learning" },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-[9000] h-[26px] flex items-center gap-4 px-3.5 text-[13px] bg-white/50 dark:bg-black/35 backdrop-blur-2xl text-black/85 dark:text-white/85 shadow-[0_0.5px_0_rgba(0,0,0,0.12)] dark:shadow-[0_0.5px_0_rgba(255,255,255,0.08)]">
      <span title="Hi — I see you">
        <FaceId size={16} />
      </span>
      <span className="font-bold tracking-tight">Damian Villarreal</span>
      <div className="hidden sm:flex items-center gap-4">
        {items.map((it) => (
          <button
            key={it.app}
            onClick={() => onOpen(it.app)}
            className="text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
          >
            {it.label}
          </button>
        ))}
        <a
          href="https://vaqueroisi.org/"
          target="_blank"
          rel="noreferrer"
          className="text-black/75 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
        >
          VISI
        </a>
      </div>
      <div className="ml-auto flex items-center gap-3.5 text-black/75 dark:text-white/75">
        <button onClick={toggle} aria-label="Toggle appearance" className="hover:text-black dark:hover:text-white transition-colors">
          <SunMoonGlyph dark={dark} />
        </button>
        <span title="Wi-Fi"><WifiGlyph /></span>
        <span title="Spotlight"><SearchGlyph /></span>
        <span title="Control Center"><ControlCenterGlyph /></span>
        <span className="text-[12.5px] font-medium">
          <Clock />
        </span>
      </div>
    </div>
  );
}
