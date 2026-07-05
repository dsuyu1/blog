"use client";

/* eslint-disable @next/next/no-img-element */

import {
  FolderIcon,
  PersonGlyph,
  SparkleGlyph,
  GraphGlyph,
  ShieldGlyph,
  GithubGlyph,
  LinkedinGlyph,
} from "./glyphs";

/* Big Sur dock: floating translucent shelf, opaque rounded-square (super-
   ellipse) icon tiles with vertical gradients, tooltips, running dots, and
   a separator before the external-link cluster (VISI, GitHub, LinkedIn). */

type DockApp = {
  app: string;
  label: string;
  kind: "app" | "link";
  href?: string;
  tile: React.ReactNode;
};

function Tile({
  from,
  to,
  children,
}: {
  from: string;
  to: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="w-full h-full flex items-center justify-center text-white"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    >
      {children}
    </span>
  );
}

const MAIN_APPS: DockApp[] = [
  {
    app: "blog",
    label: "Posts",
    kind: "app",
    // Folders sit in the macOS dock as bare folder icons, not tiles.
    tile: (
      <span className="w-full h-full flex items-center justify-center">
        <FolderIcon className="w-[86%] h-[80%] drop-shadow-[0_2px_5px_rgba(0,0,0,0.28)]" />
      </span>
    ),
  },
  {
    app: "about",
    label: "About",
    kind: "app",
    tile: (
      <Tile from="#fdfdfd" to="#d9d9e0">
        <span className="text-[#8e8e93]">
          <PersonGlyph className="w-7 h-7" />
        </span>
      </Tile>
    ),
  },
  {
    app: "portfolio",
    label: "Portfolio",
    kind: "app",
    tile: (
      <Tile from="#b18cfe" to="#6a3ff5">
        <SparkleGlyph className="w-[26px] h-[26px]" />
      </Tile>
    ),
  },
  {
    app: "learning",
    label: "Learning",
    kind: "app",
    tile: (
      <Tile from="#5ddb6f" to="#1f9c37">
        <GraphGlyph className="w-[26px] h-[26px]" />
      </Tile>
    ),
  },
];

const LINK_APPS: DockApp[] = [
  {
    app: "threatscaper",
    label: "ThreatScaper",
    kind: "link",
    href: "https://security.damianvillarreal.com",
    tile: (
      <Tile from="#ff6961" to="#d70015">
        <ShieldGlyph className="w-[26px] h-[26px]" />
      </Tile>
    ),
  },
  {
    app: "visi",
    label: "VISI — Vaquero InfoSec Initiative",
    kind: "link",
    href: "https://vaqueroisi.org/",
    // The VISI logo is a circle (vaquero at sunset); give it a subtle base
    // so it reads at dock size on any wallpaper.
    tile: (
      <span className="w-full h-full flex items-center justify-center">
        <img
          src="/visi-logo.png"
          alt=""
          className="w-[94%] h-[94%] rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        />
      </span>
    ),
  },
  {
    app: "github",
    label: "GitHub",
    kind: "link",
    href: "https://github.com/dsuyu1",
    tile: (
      <Tile from="#3a3f46" to="#16191d">
        <GithubGlyph className="w-[27px] h-[27px]" />
      </Tile>
    ),
  },
  {
    app: "linkedin",
    label: "LinkedIn",
    kind: "link",
    href: "https://linkedin.com/in/dsuyu",
    tile: (
      <Tile from="#2e86dc" to="#0a66c2">
        <LinkedinGlyph className="w-[25px] h-[25px]" />
      </Tile>
    ),
  },
];

function DockItem({
  a,
  isOpen,
  onOpen,
}: {
  a: DockApp;
  isOpen: boolean;
  onOpen: (app: string) => void;
}) {
  const tile = (
    <span className="relative block w-[50px] h-[50px] rounded-[12px] overflow-hidden shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-transform duration-200 ease-out group-hover:scale-[1.24] group-hover:-translate-y-2">
      {a.tile}
    </span>
  );
  return (
    <span className="group relative flex flex-col items-center">
      {/* tooltip */}
      <span className="pointer-events-none absolute -top-9 px-2.5 py-1 rounded-md text-[12px] font-medium text-black/80 dark:text-white/90 bg-[#f2f2f4]/95 dark:bg-[#3a3a3e]/95 border border-black/[0.08] dark:border-white/[0.1] shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {a.label}
      </span>
      {a.kind === "link" ? (
        <a href={a.href} target="_blank" rel="noreferrer" aria-label={a.label}>
          {tile}
        </a>
      ) : (
        <button aria-label={a.label} onClick={() => onOpen(a.app)}>
          {tile}
        </button>
      )}
      {/* running indicator */}
      <span
        className={`mt-[3px] w-1 h-1 rounded-full ${
          isOpen ? "bg-black/50 dark:bg-white/75" : "bg-transparent"
        }`}
      />
    </span>
  );
}

export function Dock({
  openApps,
  onOpen,
}: {
  openApps: string[];
  onOpen: (app: string) => void;
}) {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[9000] max-w-[calc(100vw-12px)]">
      <div className="flex items-end gap-[9px] px-2.5 py-[7px] rounded-[22px] bg-white/35 dark:bg-[#1f1f22]/45 backdrop-blur-2xl border border-white/40 dark:border-white/[0.12] shadow-[0_12px_36px_rgba(0,0,0,0.28)] overflow-x-auto">
        {MAIN_APPS.map((a) => (
          <DockItem key={a.app} a={a} isOpen={openApps.includes(a.app)} onOpen={onOpen} />
        ))}
        {/* separator */}
        <span className="self-stretch w-px my-1.5 bg-black/[0.14] dark:bg-white/[0.16]" />
        {LINK_APPS.map((a) => (
          <DockItem key={a.app} a={a} isOpen={false} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
