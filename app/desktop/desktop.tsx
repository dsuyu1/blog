"use client";

import { useCallback, useRef, useState } from "react";
import type { Post } from "../posts";
import { Wallpaper } from "./starfield";
import { MenuBar } from "./menu-bar";
import { Dock } from "./dock";
import { Window, type Win } from "./window";
import { FolderIcon, FileIcon } from "./glyphs";
import { ClockWidget, TodoWidget, SecurityNewsWidget } from "./widgets";

/* App windows: everything opens as a draggable liquid-glass window. Site
   pages load in iframes (an inline script hides their nav when embedded);
   the Posts folder is a native Finder-style file grid. */

const APP_WINDOWS: Record<
  string,
  { title: string; kind: Win["kind"]; url?: string; w: number; h: number }
> = {
  blog: { title: "Posts", kind: "node", w: 680, h: 440 },
  about: { title: "About Me", kind: "iframe", url: "/about", w: 780, h: 600 },
  portfolio: { title: "Portfolio", kind: "iframe", url: "/portfolio", w: 1000, h: 660 },
  learning: { title: "Learning Map", kind: "iframe", url: "/learning", w: 1040, h: 660 },
};

export default function Desktop({ posts }: { posts: Post[] }) {
  const [wins, setWins] = useState<Win[]>([]);
  const zRef = useRef(100);
  const cascadeRef = useRef(0);

  const focus = useCallback((id: string) => {
    zRef.current += 1;
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: zRef.current } : w)));
  }, []);

  const openWindow = useCallback(
    (spec: { id: string; app: string; title: string; kind: Win["kind"]; url?: string; w: number; h: number }) => {
      zRef.current += 1;
      setWins((ws) => {
        const existing = ws.find((w) => w.id === spec.id);
        if (existing) {
          return ws.map((w) =>
            w.id === spec.id ? { ...w, minimized: false, z: zRef.current } : w,
          );
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const small = vw < 640;
        const w = small ? vw - 12 : Math.min(spec.w, vw - 40);
        const h = small ? vh - 140 : Math.min(spec.h, vh - 120);
        const step = (cascadeRef.current++ % 5) * 28;
        const x = small ? 6 : Math.max(16, (vw - w) / 2 + step - 56);
        const y = small ? 38 : Math.max(44, (vh - h) / 2.4 + step);
        return [
          ...ws,
          {
            id: spec.id,
            app: spec.app,
            title: spec.title,
            kind: spec.kind,
            url: spec.url,
            x,
            y,
            w,
            h,
            z: zRef.current,
            minimized: false,
            maximized: false,
          },
        ];
      });
    },
    [],
  );

  const openApp = useCallback(
    (app: string) => {
      const def = APP_WINDOWS[app];
      if (!def) return;
      openWindow({ id: app, app, ...def });
    },
    [openWindow],
  );

  const openPost = useCallback(
    (post: Post) => {
      openWindow({
        id: `post:${post.href}`,
        app: "blog",
        title: post.title,
        kind: "iframe",
        url: post.href,
        w: 820,
        h: 640,
      });
    },
    [openWindow],
  );

  const close = useCallback((id: string) => {
    setWins((ws) => ws.filter((w) => w.id !== id));
  }, []);

  const minimize = useCallback((id: string) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const toggleMax = useCallback((id: string) => {
    zRef.current += 1;
    setWins((ws) =>
      ws.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false, z: zRef.current } : w,
      ),
    );
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, x: number, y: number, w: number, h: number) => {
    setWins((ws) => ws.map((win) => (win.id === id ? { ...win, x, y, w, h } : win)));
  }, []);

  const openApps = Array.from(new Set(wins.map((w) => w.app)));

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <Wallpaper />

      <MenuBar onOpen={openApp} />

      {/* widgets */}
      <div className="absolute top-12 left-5 z-[5] hidden md:flex flex-col gap-4 w-[264px]">
        <ClockWidget />
        <SecurityNewsWidget />
        <TodoWidget />
      </div>

      {/* desktop icons */}
      <div className="absolute top-12 right-5 z-[10] flex flex-col items-center gap-6">
        <DesktopIcon label="Posts" onOpen={() => openApp("blog")}>
          <FolderIcon className="w-14 h-12 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" />
        </DesktopIcon>
      </div>

      {/* windows */}
      {wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          onFocus={focus}
          onClose={close}
          onMinimize={minimize}
          onToggleMax={toggleMax}
          onMove={move}
          onResize={resize}
        >
          {w.kind === "node" && w.app === "blog" && (
            <FinderPosts posts={posts} onOpen={openPost} />
          )}
        </Window>
      ))}

      <Dock openApps={openApps} onOpen={openApp} />
    </div>
  );
}

function DesktopIcon({
  label,
  onOpen,
  children,
}: {
  label: string;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onDoubleClick={onOpen}
      className="group flex flex-col items-center gap-1 w-20 focus:outline-none"
      title={`Open ${label}`}
    >
      <span className="p-1.5 rounded-lg group-hover:bg-white/[0.08] group-focus:bg-white/[0.12] transition-colors">
        {children}
      </span>
      <span className="text-[12px] text-white/90 px-1.5 py-0.5 rounded-md group-focus:bg-blue-500/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}

function FinderPosts({ posts, onOpen }: { posts: Post[]; onOpen: (p: Post) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      {/* Finder-style toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-black/[0.07] dark:border-white/[0.06]">
        <span className="flex items-center gap-1 text-black/30 dark:text-white/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m14 6-6 6 6 6" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m10 6 6 6-6 6" /></svg>
        </span>
        <span className="text-[13px] font-bold text-black/80 dark:text-white/85">Posts</span>
        <span className="ml-auto text-[11px] text-black/35 dark:text-white/35">
          {posts.length} items · double-click to open
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white/40 dark:bg-transparent">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {posts.map((p) => (
            <button
              key={p.href}
              onClick={() => setSelected(p.href)}
              onDoubleClick={() => onOpen(p)}
              title={p.preview}
              className="flex flex-col items-center gap-1 p-2 text-center focus:outline-none"
            >
              <span className={`p-1 rounded-lg ${selected === p.href ? "bg-black/[0.08] dark:bg-white/[0.14]" : ""}`}>
                <FileIcon className="w-10 h-[52px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
              </span>
              {/* macOS selects the label as a blue pill */}
              <span
                className={`text-[11.5px] leading-snug line-clamp-3 px-1.5 py-px rounded-[5px] ${
                  selected === p.href
                    ? "bg-[#0a63e1] text-white"
                    : "text-black/85 dark:text-white/90"
                }`}
              >
                {p.title}
              </span>
              <span className="text-[10px] text-black/35 dark:text-white/40">{p.date}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
