import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SiteChrome } from "./components/site-chrome";

const inter = Inter({ subsets: ["latin"] });

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
      className={`${inter.className} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <link id="hljs-theme" rel="stylesheet" href="/hljs-github-dark.css" />
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
            } catch {}
          })();
        `}</Script>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
