"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

function Nav() {
  return (
    <nav className="flex items-center gap-6">
      <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        blog
      </a>
      <a href="/portfolio" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        portfolio
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
  const bare = pathname === "/portfolio" || pathname?.startsWith("/portfolio/");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-[90ch] mx-auto px-8 py-4">
          <Nav />
        </div>
      </nav>
      <div className="min-h-screen flex flex-col pt-8 p-8">
        <div className="max-w-[90ch] mx-auto w-full">
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </>
  );
}
