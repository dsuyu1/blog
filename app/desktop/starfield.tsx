"use client";

import { useEffect, useRef } from "react";

/*
   Big Sur wallpaper, recreated by hand as layered SVG waves from the
   exported Figma frames (D:\projects\ui ux design inspo). Light mode is the
   iconic daytime palette; dark mode dims/deepens it via CSS filters, like
   macOS's dark wallpaper variant.

   On top sits the "liquid" layer from the previous pass: a transparent
   canvas where a soft glow lags behind the pointer and movement sheds
   expanding ripples. The rAF loop self-stops when everything settles, so an
   idle desktop costs nothing (and screenshots don't hang).
*/

type Ripple = { x: number; y: number; r: number; max: number; a: number };

const SCALE = 5;

function LiquidLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let running = false;

    const resize = () => {
      canvas.width = Math.ceil(window.innerWidth / SCALE);
      canvas.height = Math.ceil(window.innerHeight / SCALE);
    };
    resize();
    window.addEventListener("resize", resize);

    const target = { x: -1000, y: -1000 };
    const pos = { x: -1000, y: -1000 };
    let lastRipple = { x: -1000, y: -1000 };
    const ripples: Ripple[] = [];
    let t0 = performance.now();

    const settled = () =>
      ripples.length === 0 &&
      Math.abs(target.x - pos.x) < 0.5 &&
      Math.abs(target.y - pos.y) < 0.5;

    const draw = (now: number) => {
      const dt = Math.min(48, now - t0) || 16.7;
      t0 = now;
      const k = dt / 16.7;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (target.x > -500) {
        pos.x += (target.x - pos.x) * Math.min(1, 0.07 * k);
        pos.y += (target.y - pos.y) * Math.min(1, 0.07 * k);
        const glowR = Math.max(w, h) * 0.13;
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.34)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.max * 0.016 * k;
        rp.a *= Math.pow(0.97, k);
        if (rp.a < 0.015 || rp.r >= rp.max) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.a})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      if (settled()) {
        running = false;
        ctx.clearRect(0, 0, w, h);
        return;
      }
      animId = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (running) return;
      running = true;
      t0 = performance.now();
      animId = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / SCALE;
      target.y = e.clientY / SCALE;
      if (pos.x < -500) {
        pos.x = target.x;
        pos.y = target.y;
      }
      const dx = target.x - lastRipple.x;
      const dy = target.y - lastRipple.y;
      if (dx * dx + dy * dy > (90 / SCALE) ** 2) {
        lastRipple = { x: target.x, y: target.y };
        ripples.push({
          x: target.x,
          y: target.y,
          r: 2,
          max: Math.max(canvas.width, canvas.height) * 0.22,
          a: 0.5,
        });
        if (ripples.length > 22) ripples.shift();
      }
      wake();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-soft-light"
      style={{ filter: "blur(60px)", transform: "scale(1.15)", opacity: 0.9 }}
    />
  );
}

export function BigSurWaves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full transition-[filter] duration-500 dark:brightness-[0.55] dark:saturate-[0.9]"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bs-sky" x1="0.7" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#3AA6DD" />
          <stop offset="1" stopColor="#0E639F" />
        </linearGradient>
        <linearGradient id="bs-white" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#F6FAFC" />
          <stop offset="1" stopColor="#C9DFEC" />
        </linearGradient>
        <linearGradient id="bs-red" x1="0.1" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0" stopColor="#F0334B" />
          <stop offset="0.55" stopColor="#F4503F" />
          <stop offset="1" stopColor="#FF7A4C" />
        </linearGradient>
        <linearGradient id="bs-orange" x1="0.2" y1="0" x2="0.9" y2="0.9">
          <stop offset="0" stopColor="#FBB040" />
          <stop offset="1" stopColor="#F58223" />
        </linearGradient>
        <linearGradient id="bs-pink" x1="0.2" y1="0.2" x2="0.9" y2="1">
          <stop offset="0" stopColor="#EF2F74" />
          <stop offset="1" stopColor="#C4207F" />
        </linearGradient>
        <linearGradient id="bs-purple" x1="0" y1="0.3" x2="0.8" y2="1">
          <stop offset="0" stopColor="#8A2FA5" />
          <stop offset="1" stopColor="#471B7C" />
        </linearGradient>
      </defs>

      {/* sky, visible only in the top-right triangle */}
      <rect width="1440" height="900" fill="url(#bs-sky)" />

      {/* pale wave hugging the sky's lower edge */}
      <path
        d="M0,300 C280,190 560,300 880,225 C1100,175 1290,255 1440,215 L1440,900 L0,900 Z"
        fill="url(#bs-white)"
      />

      {/* main red body: owns the top-left, sweeps diagonally to mid-right */}
      <path
        d="M0,-60 C300,10 480,215 760,300 C1000,370 1260,335 1440,430 L1440,900 L0,900 Z"
        fill="url(#bs-red)"
      />

      {/* magenta flow across the lower-left half */}
      <path
        d="M0,545 C260,462 480,552 700,615 C950,684 1150,700 1310,780 C1385,818 1425,865 1440,905 L1440,900 L0,900 Z"
        fill="url(#bs-pink)"
      />

      {/* orange ridge rising on the right */}
      <path
        d="M600,900 C690,690 900,598 1150,568 C1260,554 1370,558 1440,563 L1440,900 Z"
        fill="url(#bs-orange)"
      />

      {/* pink returning in the bottom-right corner */}
      <path
        d="M980,900 C1110,812 1300,792 1440,822 L1440,900 Z"
        fill="url(#bs-pink)"
      />

      {/* purple bottom-left corner */}
      <path
        d="M0,680 C140,638 280,678 400,758 C480,812 540,858 570,900 L0,900 Z"
        fill="url(#bs-purple)"
      />
    </svg>
  );
}

export function Wallpaper() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0E639F] z-0">
      <BigSurWaves />
      <LiquidLayer />
    </div>
  );
}
