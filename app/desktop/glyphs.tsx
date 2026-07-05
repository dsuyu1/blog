/* SF-Symbols-flavored glyphs for the desktop, hand-rolled so we don't ship
   Apple's licensed assets. Stroke style matches the site's existing icons. */

type GlyphProps = { className?: string };

function Stroke({ className, children }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function PersonGlyph({ className }: GlyphProps) {
  return (
    <Stroke className={className}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.4 4.2-5 7.5-5s6.1 1.6 7.5 5" />
    </Stroke>
  );
}

export function SparkleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.5c.3 4.9 1.9 8.6 9.5 9.5-7.6.9-9.2 4.6-9.5 9.5-.3-4.9-1.9-8.6-9.5-9.5 7.6-.9 9.2-4.6 9.5-9.5z" />
    </svg>
  );
}

export function GraphGlyph({ className }: GlyphProps) {
  return (
    <Stroke className={className}>
      <circle cx="5.5" cy="18.5" r="2.2" />
      <circle cx="12" cy="7" r="2.2" />
      <circle cx="18.5" cy="15" r="2.2" />
      <path d="M7 16.7 10.6 9M13.8 8.5l3.4 4.8" />
    </Stroke>
  );
}

export function ShieldGlyph({ className }: GlyphProps) {
  return (
    <Stroke className={className}>
      <path d="M12 21s7-3.4 7-8.8V6l-7-2.6L5 6v6.2C5 17.6 12 21 12 21z" />
    </Stroke>
  );
}

export function DocGlyph({ className }: GlyphProps) {
  return (
    <Stroke className={className}>
      <path d="M6 3.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1-1.4z" />
      <path d="M14 3.5V8h4.5M8.5 12.5h7M8.5 16h7" />
    </Stroke>
  );
}

export function GithubGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function LinkedinGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* macOS-style blue folder, filled (used on the desktop and in the dock). */
export function FolderIcon({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 52" aria-hidden="true" className={className}>
      <path
        d="M4 8a5 5 0 0 1 5-5h14.5a5 5 0 0 1 3.8 1.76L30.6 9H55a5 5 0 0 1 5 5v2H4V8z"
        fill="#3f83d6"
      />
      <rect x="4" y="12" width="56" height="36" rx="5" fill="#5ea3ef" />
      <rect x="4" y="12" width="56" height="7" rx="3.5" fill="#6fb0f5" opacity="0.7" />
    </svg>
  );
}

/* Generic document/file icon for Finder windows. */
export function FileIcon({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 44 56" aria-hidden="true" className={className}>
      <path
        d="M4 6a4 4 0 0 1 4-4h20l12 12v36a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6z"
        fill="#f4f4f5"
      />
      <path d="M28 2l12 12H31a3 3 0 0 1-3-3V2z" fill="#d4d4d8" />
      <g stroke="#a1a1aa" strokeWidth="2.4" strokeLinecap="round">
        <path d="M11 24h22M11 31h22M11 38h15" />
      </g>
    </svg>
  );
}
