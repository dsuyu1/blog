"use client";

import { useEffect, useRef } from "react";

/* Custom pointer ported from the ThreatScaper app: a ring with a filled dot
   that trails the mouse, grows on press, and recolors with the theme.
   Only active on fine-pointer (mouse) devices; touch keeps native behavior. */

const BASE_SIZE = 20;
const LIGHT_COLOR = "#111827"; // ~zinc-900
const DARK_COLOR = "#ffffff";

export function DotCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef(BASE_SIZE);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    // Skip touch / coarse pointers — a trailing dot only makes sense for a mouse.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    const updateColor = () => {
      cursor.style.color = root.classList.contains("dark") ? DARK_COLOR : LIGHT_COLOR;
    };
    updateColor();

    root.classList.add("dot-cursor-active");
    cursor.style.display = "flex";

    const place = (x: number, y: number) => {
      const s = sizeRef.current;
      cursor.style.top = `${y - s / 2}px`;
      cursor.style.left = `${x - s / 2}px`;
    };

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        cursor.style.opacity = "1";
      }
      cursor.style.transition = "none";
      place(e.clientX, e.clientY);
    };

    const onDown = (e: MouseEvent) => {
      sizeRef.current = BASE_SIZE * 1.3;
      const s = sizeRef.current;
      cursor.style.transition = "all 0.1s ease-in";
      cursor.style.width = `${s}px`;
      cursor.style.height = `${s}px`;
      place(e.clientX, e.clientY);
    };

    const onUp = (e: MouseEvent) => {
      sizeRef.current = BASE_SIZE;
      cursor.style.transition = "all 0.1s ease-in";
      cursor.style.width = `${BASE_SIZE}px`;
      cursor.style.height = `${BASE_SIZE}px`;
      place(e.clientX, e.clientY);
    };

    const onEnter = () => {
      cursor.style.opacity = "1";
    };
    const onLeave = () => {
      cursor.style.opacity = "0";
    };

    const mo = new MutationObserver(updateColor);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      mo.disconnect();
      root.classList.remove("dot-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const dotSize = BASE_SIZE * 0.4;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      style={{
        position: "fixed",
        width: BASE_SIZE,
        height: BASE_SIZE,
        border: "1px solid currentColor",
        borderRadius: "50%",
        display: "none",
        opacity: 0,
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "opacity 0.15s ease",
      }}
    >
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: "currentColor",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
