"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { PageBackdrop } from "./page-backdrop";

function Nav() {
  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        town
      </a>
      <a href="/portfolio" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        portfolio
      </a>
      <a href="/learning" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        learning
      </a>
      <a href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        about
      </a>
      <a href="https://security.damianvillarreal.com" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        threatscaper
      </a>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </nav>
  );
}

/**
 * Wraps page content in the standard site chrome (sticky nav + centered
 * column). The `/portfolio` landing is a full-bleed experience with its own
 * nav, so it opts out and renders bare.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The home page is the desktop and the portfolio is a full-bleed landing;
  // both render without the standard site chrome.
  const bare =
    pathname === "/" ||
    pathname === "/portfolio" ||
    pathname?.startsWith("/portfolio/");
  // The learning roadmap spreads across the full width; keep the nav but drop
  // the standard reading-column cap.
  const wide = pathname === "/learning" || pathname?.startsWith("/learning/");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <PageBackdrop />
      <nav className="site-nav sticky top-3 z-10 px-4">
        <div className="max-w-[90ch] mx-auto px-6 py-2.5 rounded-full bg-white/60 dark:bg-zinc-900/55 backdrop-blur-2xl border border-black/[0.07] dark:border-white/[0.1] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <Nav />
        </div>
      </nav>
      <div className="relative z-[1] min-h-screen flex flex-col pt-10 p-8">
        <div className={`mx-auto w-full ${wide ? "max-w-none" : "max-w-[90ch]"}`}>
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </>
  );
}
