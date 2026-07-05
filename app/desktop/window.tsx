"use client";

import { useRef, useState } from "react";

export type Win = {
  id: string;
  app: string;
  title: string;
  kind: "iframe" | "node";
  url?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

const MENU_BAR_H = 26;
const MIN_W = 320;
const MIN_H = 220;

type ResizeDir = { n?: boolean; s?: boolean; e?: boolean; w?: boolean };

/* Invisible resize strips along edges and corners (macOS-style). */
const RESIZE_HANDLES: { dir: ResizeDir; cls: string }[] = [
  { dir: { n: true }, cls: "top-0 left-3 right-3 h-1.5 cursor-n-resize" },
  { dir: { s: true }, cls: "bottom-0 left-3 right-3 h-1.5 cursor-s-resize" },
  { dir: { e: true }, cls: "right-0 top-3 bottom-3 w-1.5 cursor-e-resize" },
  { dir: { w: true }, cls: "left-0 top-3 bottom-3 w-1.5 cursor-w-resize" },
  { dir: { n: true, w: true }, cls: "top-0 left-0 w-3 h-3 cursor-nw-resize" },
  { dir: { n: true, e: true }, cls: "top-0 right-0 w-3 h-3 cursor-ne-resize" },
  { dir: { s: true, w: true }, cls: "bottom-0 left-0 w-3 h-3 cursor-sw-resize" },
  { dir: { s: true, e: true }, cls: "bottom-0 right-0 w-4 h-4 cursor-se-resize" },
];

type WindowProps = {
  win: Win;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMax: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, x: number, y: number, w: number, h: number) => void;
  children?: React.ReactNode;
};

export function Window({
  win,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onMove,
  onResize,
  children,
}: WindowProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{
    dir: ResizeDir;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);
  // While a drag or resize is live, an overlay keeps pointer events out of the iframe.
  const [gesturing, setGesturing] = useState(false);

  /* ── move (title bar) ── */

  const onTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.maximized) return;
    // Ignore drags that start on the traffic lights.
    if ((e.target as HTMLElement).closest("button")) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y };
    setGesturing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const el = elRef.current;
    if (!d || !el) return;
    const nx = clamp(d.origX + (e.clientX - d.startX), -win.w + 90, window.innerWidth - 90);
    const ny = clamp(d.origY + (e.clientY - d.startY), MENU_BAR_H + 2, window.innerHeight - 40);
    el.style.left = `${nx}px`;
    el.style.top = `${ny}px`;
  };

  const onTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const el = elRef.current;
    dragRef.current = null;
    setGesturing(false);
    if (!d || !el) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    onMove(win.id, parseFloat(el.style.left) || win.x, parseFloat(el.style.top) || win.y);
  };

  /* ── resize (edges + corners) ── */

  const onResizeDown = (dir: ResizeDir) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.maximized) return;
    onFocus(win.id);
    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.w,
      origH: win.h,
    };
    setGesturing(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const onResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = resizeRef.current;
    const el = elRef.current;
    if (!r || !el) return;
    const dx = e.clientX - r.startX;
    const dy = e.clientY - r.startY;

    let x = r.origX;
    let y = r.origY;
    let w = r.origW;
    let h = r.origH;

    if (r.dir.e) w = r.origW + dx;
    if (r.dir.s) h = r.origH + dy;
    if (r.dir.w) w = r.origW - dx;
    if (r.dir.n) h = r.origH - dy;

    w = clamp(w, MIN_W, window.innerWidth - 16);
    h = clamp(h, MIN_H, window.innerHeight - MENU_BAR_H - 12);

    // West/north edges move the origin so the opposite edge stays pinned.
    if (r.dir.w) x = r.origX + (r.origW - w);
    if (r.dir.n) {
      y = r.origY + (r.origH - h);
      if (y < MENU_BAR_H + 2) {
        h -= MENU_BAR_H + 2 - y;
        y = MENU_BAR_H + 2;
      }
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
  };

  const onResizeUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = resizeRef.current;
    const el = elRef.current;
    resizeRef.current = null;
    setGesturing(false);
    if (!r || !el) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    onResize(
      win.id,
      parseFloat(el.style.left) || win.x,
      parseFloat(el.style.top) || win.y,
      parseFloat(el.style.width) || win.w,
      parseFloat(el.style.height) || win.h,
    );
  };

  if (win.minimized) return null;

  const frame = win.maximized
    ? { left: 8, top: MENU_BAR_H + 6, width: "calc(100vw - 16px)", height: "calc(100dvh - 118px)" }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div
      ref={elRef}
      className="absolute flex flex-col rounded-[10px] overflow-hidden border border-black/[0.14] dark:border-white/[0.14] shadow-[0_22px_60px_rgba(0,0,0,0.35)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl bg-[#f6f6f8]/85 dark:bg-[#1c1c22]/75 window-pop"
      style={{ ...frame, zIndex: win.z }}
      onPointerDown={() => onFocus(win.id)}
    >
      {/* title bar */}
      <div
        className="relative h-9 shrink-0 flex items-center border-b border-black/[0.08] dark:border-white/[0.07] bg-white/50 dark:bg-white/[0.045] touch-none select-none"
        style={{ cursor: win.maximized ? "default" : undefined }}
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        onDoubleClick={() => onToggleMax(win.id)}
      >
        <div className="flex items-center gap-2 pl-3.5 group">
          <button
            aria-label="Close"
            onClick={() => onClose(win.id)}
            className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/20 flex items-center justify-center text-[8px] text-black/0 group-hover:text-black/60 transition-colors"
          >
            ×
          </button>
          <button
            aria-label="Minimize"
            onClick={() => onMinimize(win.id)}
            className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/20 flex items-center justify-center text-[8px] text-black/0 group-hover:text-black/60 transition-colors"
          >
            –
          </button>
          <button
            aria-label="Zoom"
            onClick={() => onToggleMax(win.id)}
            className="w-3 h-3 rounded-full bg-[#28c840] border border-black/20 flex items-center justify-center text-[8px] text-black/0 group-hover:text-black/60 transition-colors"
          >
            +
          </button>
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-black/65 dark:text-white/65 pointer-events-none max-w-[55%] truncate">
          {win.title}
        </span>
      </div>

      {/* content */}
      <div className="relative flex-1 min-h-0">
        {win.kind === "iframe" && win.url ? (
          <iframe
            src={win.url}
            title={win.title}
            className="w-full h-full border-0 bg-transparent"
          />
        ) : (
          children
        )}
        {/* while dragging/resizing, keep pointer events from falling into the iframe */}
        {gesturing && <div className="absolute inset-0" />}
      </div>

      {/* resize handles */}
      {!win.maximized &&
        RESIZE_HANDLES.map((h, i) => (
          <div
            key={i}
            className={`absolute z-20 touch-none ${h.cls}`}
            onPointerDown={onResizeDown(h.dir)}
            onPointerMove={onResizeMove}
            onPointerUp={onResizeUp}
          />
        ))}
    </div>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
