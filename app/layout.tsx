import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SiteChrome } from "./components/site-chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://damianvillarreal.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Damian Villarreal",
    template: "%s | Damian Villarreal",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <link id="hljs-theme" rel="stylesheet" href="/hljs-github-dark.css" />
        {/* Liquid-glass blur, declared raw: the Tailwind v4 pipeline
            (Lightning CSS) collapses paired backdrop-filter declarations to
            one unpredictable vendor form and ignores browserslist, so these
            live outside the pipeline. Values come from :root vars in globals. */}
        <style id="glass-material">{`
          .glass-card { -webkit-backdrop-filter: var(--glass-material); backdrop-filter: var(--glass-material); }
          .apple-gloss-btn-secondary { -webkit-backdrop-filter: var(--glass-material-thin); backdrop-filter: var(--glass-material-thin); }
          .apple-gloss-badge { -webkit-backdrop-filter: var(--glass-material-badge); backdrop-filter: var(--glass-material-badge); }
          .dark pre { -webkit-backdrop-filter: var(--glass-material-thin); backdrop-filter: var(--glass-material-thin); }
        `}</style>
      </head>
      <body className="min-h-screen antialiased tracking-tight bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-200">
        <Script id="theme-init" strategy="beforeInteractive">{`
          (() => {
            try {
              const key = "theme";
              const stored = localStorage.getItem(key);
              const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
              const theme = stored === "light" || stored === "dark" ? stored : (systemDark ? "dark" : "light");
              document.documentElement.classList.toggle("dark", theme === "dark");
              document.documentElement.style.colorScheme = theme;
              const hljs = document.getElementById("hljs-theme");
              if (hljs && hljs.tagName === "LINK") {
                hljs.setAttribute("href", theme === "dark" ? "/hljs-github-dark.css" : "/hljs-github.css");
              }
              // Pages rendered inside a desktop window (iframe) drop the site nav.
              if (window.self !== window.top) {
                document.documentElement.classList.add("embedded");
              }
            } catch {}
          })();
        `}</Script>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
