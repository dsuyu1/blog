"use client";

/**
 * Pixel-town portfolio engine: a small hand-rolled canvas engine (no game
 * framework) with Pokémon-style grid movement, two maps, y-sorted sprites,
 * NPCs, warps, and DOM dialogue/HUD overlays.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Press_Start_2P } from "next/font/google";
import {
  TILE, SHEET_SRC, SPRITES, GRASS, DIRT, INTERIOR, CATEGORIES, DIALOGS,
  MAPS, START, type SpriteDef, type MapDef, type Facing, type Dialog,
  type NpcDef, type Warp, type SheetKey,
} from "./world";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const SCALE = 3; // world px → css px
const STEP_MS = 150; // per-tile walk duration
const FRAME_MS = 125; // walk animation frame duration

/* ── helpers ──────────────────────────────────────────────── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface WorldObject {
  def: SpriteDef;
  px: number; // world px, left edge of drawn sprite
  py: number; // world px, baseline (bottom of sprite)
  dw: number;
  dh: number;
  dialog?: string;
  label?: string;
  marker?: { color: string; heart: boolean };
}

interface BuiltMap {
  def: MapDef;
  ground: HTMLCanvasElement;
  solid: Uint8Array;
  objects: WorldObject[];
  interact: Map<string, string>; // "x,y" -> dialog id
}

interface Npc {
  def: NpcDef;
  x: number; y: number;
  fromX: number; fromY: number;
  facing: Facing;
  moveT: number; // 0..1 progress, 1 = idle
  nextThink: number;
}

interface Player {
  map: "town" | "room";
  x: number; y: number;
  fromX: number; fromY: number;
  facing: Facing;
  moveT: number;
}

// Row 1 is the side-profile walk cycle; the source sprite faces RIGHT, so
// `right` draws it as-is and `left` mirrors it.
const FACING_ROW: Record<Facing, { row: number; flip: boolean }> = {
  down: { row: 0, flip: false },
  left: { row: 1, flip: true },
  right: { row: 1, flip: false },
  up: { row: 2, flip: false },
};

const DIRS: Record<Facing, [number, number]> = {
  up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0],
};

/** Runtime-drawn wooden signpost (16x16). */
function makeSignSheet(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 16; c.height = 16;
  const g = c.getContext("2d")!;
  g.fillStyle = "#5c3a21"; g.fillRect(7, 8, 2, 7); // post
  g.fillStyle = "#8a5a32"; g.fillRect(1, 2, 14, 7); // board
  g.fillStyle = "#a97c50"; g.fillRect(2, 3, 12, 5); // board face
  g.fillStyle = "#6b4526"; // etched lines
  g.fillRect(4, 4, 8, 1); g.fillRect(4, 6, 6, 1);
  g.fillStyle = "#3e2715"; g.fillRect(7, 15, 2, 1);
  return c;
}

function buildMap(
  def: MapDef,
  sheets: Record<string, CanvasImageSource>,
  rng: () => number,
): BuiltMap {
  const { w, h } = def;
  const ground = document.createElement("canvas");
  ground.width = w * TILE; ground.height = h * TILE;
  const g = ground.getContext("2d")!;
  g.imageSmoothingEnabled = false;

  // dirt mask
  const dirt = new Uint8Array(w * h);
  for (const [dx, dy, dw, dh] of def.dirt)
    for (let y = dy; y < dy + dh; y++)
      for (let x = dx; x < dx + dw; x++) dirt[y * w + x] = 1;

  const isDirt = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && dirt[y * w + x] === 1;

  if (def.id === "room") {
    // interior: dark void border, stone floor, wall along the top
    g.fillStyle = "#120b1d";
    g.fillRect(0, 0, w * TILE, h * TILE);
    for (let y = 2; y <= h - 2; y++)
      for (let x = 1; x <= w - 2; x++)
        g.drawImage(sheets.dg as HTMLImageElement, INTERIOR.floor.x, INTERIOR.floor.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
    for (let x = 1; x <= w - 2; x++) {
      g.drawImage(sheets.dg as HTMLImageElement, INTERIOR.wallTop.x, INTERIOR.wallTop.y, TILE, TILE, x * TILE, 0, TILE, TILE);
      const v = x === 3 || x === 9 ? INTERIOR.wallTorch : x === 6 ? INTERIOR.wallWindow : INTERIOR.wall;
      g.drawImage(sheets.dg as HTMLImageElement, v.x, v.y, TILE, TILE, x * TILE, TILE, TILE, TILE);
    }
    // doormat
    g.fillStyle = "#7a4a96"; g.fillRect(6 * TILE + 2, 10 * TILE + 2, TILE - 4, TILE - 4);
    g.fillStyle = "#9a63bd"; g.fillRect(6 * TILE + 4, 10 * TILE + 4, TILE - 8, TILE - 8);
  } else {
    // grass with seeded variety, then autotiled dirt paths
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const r = rng();
        const t = r < 0.72 ? GRASS[0] : r < 0.86 ? GRASS[1] : r < 0.95 ? GRASS[2] : GRASS[3];
        g.drawImage(sheets.tw as HTMLImageElement, t.x, t.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      }
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        if (!isDirt(x, y)) continue;
        const T = !isDirt(x, y - 1), B = !isDirt(x, y + 1), L = !isDirt(x - 1, y), R = !isDirt(x + 1, y);
        const t =
          T && L ? DIRT.TL : T && R ? DIRT.TR : B && L ? DIRT.BL : B && R ? DIRT.BR :
          T ? DIRT.T : B ? DIRT.B : L ? DIRT.L : R ? DIRT.R : DIRT.C;
        g.drawImage(sheets.ow as HTMLImageElement, t.x, t.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      }
  }

  // objects, collision, interaction map
  const solid = new Uint8Array(w * h);
  const interact = new Map<string, string>();
  const objects: WorldObject[] = [];

  for (const o of def.objects) {
    const s = SPRITES[o.sprite] as SpriteDef;
    const sc = s.scale ?? 1;
    const dw = s.w * sc, dh = s.h * sc;
    const foot = s.foot ?? [Math.max(1, Math.round(dw / TILE)), 1];
    const footPx = foot[0] * TILE;
    const px = o.tx * TILE + (footPx - dw) / 2;
    const py = (o.ty + 1) * TILE;
    let marker: WorldObject["marker"];
    if (o.dialog) {
      const d = DIALOGS[o.dialog];
      if (d?.category) marker = { color: CATEGORIES[d.category].color, heart: !!d.cherished };
    }
    objects.push({ def: s, px, py, dw, dh, dialog: o.dialog, label: o.label, marker });
    if (!o.deco) {
      for (let fy = 0; fy < foot[1]; fy++)
        for (let fx = 0; fx < foot[0]; fx++) {
          const tx = o.tx + fx, ty = o.ty - fy;
          if (tx < 0 || ty < 0 || tx >= w || ty >= h) continue;
          solid[ty * w + tx] = 1;
          if (o.dialog) interact.set(`${tx},${ty}`, o.dialog);
        }
    }
  }

  return { def, ground, solid, objects, interact };
}

/* ── component ────────────────────────────────────────────── */

type Held = Partial<Record<Facing, boolean>>;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [intro, setIntro] = useState(true);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [canInteract, setCanInteract] = useState(false);
  const [muted, setMuted] = useState(true);
  const [legendOpen, setLegendOpen] = useState(true);

  // refs shared with the game loop
  const state = useRef<{
    maps: Record<"town" | "room", BuiltMap> | null;
    sheets: Record<string, CanvasImageSource>;
    player: Player;
    npcs: Npc[];
    held: Held;
    fade: { t: number; dir: 1 | -1 | 0; warp: Warp | null };
    paused: boolean;
    interactTarget: string | null;
  }>({
    maps: null,
    sheets: {},
    player: { map: START.map, x: START.x, y: START.y, fromX: START.x, fromY: START.y, facing: START.facing, moveT: 1 },
    npcs: [],
    held: {},
    fade: { t: 0, dir: 0, warp: null },
    paused: true,
    interactTarget: null,
  });

  const openDialog = useCallback((id: string) => {
    const d = DIALOGS[id];
    if (!d) return;
    state.current.paused = true;
    setDialog(d);
  }, []);

  const closeDialog = useCallback(() => {
    state.current.paused = false;
    setDialog(null);
  }, []);

  const tryInteract = useCallback(() => {
    const s = state.current;
    if (!s.maps || s.paused) return;
    const p = s.player;
    const [dx, dy] = DIRS[p.facing];
    const key = `${p.x + dx},${p.y + dy}`;
    const map = s.maps[p.map];
    // NPCs first
    const npc = s.npcs.find((n) => p.map === "town" && n.x === p.x + dx && n.y === p.y + dy);
    if (npc) {
      npc.facing = p.facing === "up" ? "down" : p.facing === "down" ? "up" : p.facing === "left" ? "right" : "left";
      openDialog(npc.def.dialog);
      return;
    }
    const id = map.interact.get(key);
    if (id) openDialog(id);
  }, [openDialog]);

  /* input */
  useEffect(() => {
    const keyDir: Record<string, Facing> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
      W: "up", S: "down", A: "left", D: "right",
    };
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (intro && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); start(); return; }
      const dir = keyDir[e.key];
      if (dir) { e.preventDefault(); state.current.held[dir] = true; return; }
      if (e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (dialog) closeDialog(); else tryInteract();
      }
      if (e.key === "Escape" && dialog) closeDialog();
      if (e.key === "l" || e.key === "L") setLegendOpen((v) => !v);
    };
    const up = (e: KeyboardEvent) => {
      const dir = keyDir[e.key];
      if (dir) state.current.held[dir] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, intro, tryInteract, closeDialog]);

  /* boot: load sheets, build maps, run the loop */
  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let hiddenTimer = 0;

    const load = (src: string) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = src;
      });

    (async () => {
      const entries = await Promise.all(
        Object.entries(SHEET_SRC).map(async ([k, src]) => [k, await load(src)] as const),
      );
      const chars = await Promise.all([load("/game/player.png"), load("/game/kid.png"), load("/game/pirate.png")]);
      if (cancelled) return;
      const s = state.current;
      s.sheets = Object.fromEntries(entries);
      s.sheets.gen = makeSignSheet();
      s.sheets.player = chars[0];
      s.sheets.kid = chars[1];
      s.sheets.pirate = chars[2];

      const rng = mulberry32(1337);
      s.maps = {
        town: buildMap(MAPS.town, s.sheets, rng),
        room: buildMap(MAPS.room, s.sheets, rng),
      };
      s.npcs = MAPS.town.npcs.map((def) => ({
        def, x: def.x, y: def.y, fromX: def.x, fromY: def.y,
        facing: "down" as Facing, moveT: 1, nextThink: 1000 + Math.random() * 2000,
      }));
      setReady(true);

      /* main loop */
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      let last = performance.now();

      const isSolid = (map: BuiltMap, x: number, y: number) => {
        const b = map.def.bounds;
        if (x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1) return true;
        return map.solid[y * map.def.w + x] === 1;
      };

      const npcAt = (x: number, y: number) =>
        s.player.map === "town" && s.npcs.some((n) => (n.x === x && n.y === y) || (n.moveT < 1 && n.fromX === x && n.fromY === y));

      const startWarp = (warp: Warp) => {
        s.fade = { t: 0, dir: 1, warp };
      };

      const tick = (now: number) => {
        const dt = Math.min(50, now - last);
        last = now;
        if (!s.maps) return;
        const p = s.player;
        const map = s.maps[p.map];

        /* fade transitions */
        if (s.fade.dir !== 0) {
          s.fade.t += (dt / 220) * s.fade.dir;
          if (s.fade.dir === 1 && s.fade.t >= 1) {
            s.fade.t = 1;
            const w = s.fade.warp!;
            p.map = w.map; p.x = w.x; p.y = w.y; p.fromX = w.x; p.fromY = w.y;
            p.facing = w.facing; p.moveT = 1;
            s.fade.dir = -1; s.fade.warp = null;
          } else if (s.fade.dir === -1 && s.fade.t <= 0) {
            s.fade.t = 0; s.fade.dir = 0;
          }
        }

        /* movement */
        if (p.moveT < 1) {
          p.moveT = Math.min(1, p.moveT + dt / STEP_MS);
          if (p.moveT === 1) {
            const wk = map.def.warps[`${p.x},${p.y}`];
            if (wk && s.fade.dir === 0) startWarp(wk);
          }
        } else if (!s.paused && s.fade.dir === 0) {
          const dir = (["up", "down", "left", "right"] as Facing[]).find((d) => s.held[d]);
          if (dir) {
            p.facing = dir;
            const [dx, dy] = DIRS[dir];
            const nx = p.x + dx, ny = p.y + dy;
            const warp = map.def.warps[`${nx},${ny}`];
            if (warp && isSolid(map, nx, ny)) {
              startWarp(warp); // bump-enter doors
            } else if (!isSolid(map, nx, ny) && !npcAt(nx, ny)) {
              p.fromX = p.x; p.fromY = p.y; p.x = nx; p.y = ny; p.moveT = 0;
            }
          }
        }

        /* NPC wandering */
        if (p.map === "town") {
          for (const n of s.npcs) {
            if (n.moveT < 1) { n.moveT = Math.min(1, n.moveT + dt / (STEP_MS * 1.6)); continue; }
            n.nextThink -= dt;
            if (n.nextThink > 0 || s.paused) continue;
            n.nextThink = 1200 + Math.random() * 2600;
            const dirs = ["up", "down", "left", "right"] as Facing[];
            const dir = dirs[(Math.random() * 4) | 0];
            n.facing = dir;
            const [dx, dy] = DIRS[dir];
            const nx = n.x + dx, ny = n.y + dy;
            const home = n.def;
            if (Math.abs(nx - home.x) > home.wander || Math.abs(ny - home.y) > home.wander) continue;
            if (isSolid(s.maps.town, nx, ny)) continue;
            if ((nx === p.x && ny === p.y) || (nx === p.fromX && ny === p.fromY && p.moveT < 1)) continue;
            n.fromX = n.x; n.fromY = n.y; n.x = nx; n.y = ny; n.moveT = 0;
          }
        }

        /* interact hint */
        const [fdx, fdy] = DIRS[p.facing];
        const facingKey = `${p.x + fdx},${p.y + fdy}`;
        const target =
          (p.map === "town" && s.npcs.some((n) => n.x === p.x + fdx && n.y === p.y + fdy) ? "npc" : null) ??
          map.interact.get(facingKey) ?? null;
        if (target !== s.interactTarget) {
          s.interactTarget = target;
          setCanInteract(!!target);
        }

        /* render */
        const dpr = window.devicePixelRatio || 1;
        const cw = canvas.clientWidth, ch = canvas.clientHeight;
        const S = Math.max(2, Math.round(SCALE * dpr)); // device px per world px
        if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
          canvas.width = Math.round(cw * dpr);
          canvas.height = Math.round(ch * dpr);
        }
        const viewW = canvas.width / S, viewH = canvas.height / S;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const ppx = lerp(p.fromX, p.x, p.moveT) * TILE;
        const ppy = lerp(p.fromY, p.y, p.moveT) * TILE;
        const mw = map.def.w * TILE, mh = map.def.h * TILE;
        let camX = ppx + TILE / 2 - viewW / 2;
        let camY = ppy + TILE / 2 - viewH / 2;
        camX = Math.max(0, Math.min(mw - viewW, camX));
        camY = Math.max(0, Math.min(mh - viewH, camY));
        if (mw < viewW) camX = (mw - viewW) / 2;
        if (mh < viewH) camY = (mh - viewH) / 2;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = p.map === "room" ? "#120b1d" : "#1c2b1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(S, 0, 0, S, -Math.round(camX * S), -Math.round(camY * S));
        ctx.drawImage(map.ground, 0, 0);

        /* y-sorted drawables */
        type Drawable = { y: number; draw: () => void };
        const items: Drawable[] = [];

        for (const o of map.objects) {
          items.push({
            y: o.py,
            draw: () => {
              const img = s.sheets[o.def.sheet] as HTMLImageElement;
              ctx.drawImage(img, o.def.x, o.def.y, o.def.w, o.def.h, Math.round(o.px), Math.round(o.py - o.dh), o.dw, o.dh);
            },
          });
        }

        const drawChar = (sheet: CanvasImageSource, x: number, y: number, facing: Facing, moving: boolean) => {
          const { row, flip } = FACING_ROW[facing];
          const frame = moving ? ((now / FRAME_MS) | 0) % 4 : 0;
          const dx = Math.round(x + TILE / 2 - 16);
          const dy = Math.round(y + TILE - 30);
          ctx.save();
          if (flip) {
            ctx.translate(dx + 32, dy);
            ctx.scale(-1, 1);
            ctx.drawImage(sheet, frame * 32, row * 32, 32, 32, 0, 0, 32, 32);
          } else {
            ctx.drawImage(sheet, frame * 32, row * 32, 32, 32, dx, dy, 32, 32);
          }
          ctx.restore();
        };

        if (p.map === "town") {
          for (const n of s.npcs) {
            const nx = lerp(n.fromX, n.x, n.moveT) * TILE;
            const ny = lerp(n.fromY, n.y, n.moveT) * TILE;
            items.push({ y: ny + TILE, draw: () => drawChar(s.sheets[n.def.sheet], nx, ny, n.facing, n.moveT < 1) });
          }
        }
        items.push({ y: ppy + TILE, draw: () => drawChar(s.sheets.player, ppx, ppy, p.facing, p.moveT < 1) });

        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.draw();

        /* markers, labels */
        const bob = Math.sin(now / 280) * 2;
        for (const o of map.objects) {
          if (o.marker) {
            const mx = o.px + o.dw / 2;
            const my = o.py - o.dh - 7 + bob;
            if (o.marker.heart) {
              const hd = SPRITES.heart;
              ctx.drawImage(s.sheets.ob as HTMLImageElement, hd.x, hd.y, hd.w, hd.h, Math.round(mx - 7), Math.round(my - 14), 15, 15);
            } else {
              ctx.fillStyle = o.marker.color;
              ctx.fillRect(Math.round(mx - 1), Math.round(my - 12), 2, 2);
              ctx.fillRect(Math.round(mx - 3), Math.round(my - 10), 6, 2);
              ctx.fillRect(Math.round(mx - 5), Math.round(my - 8), 10, 2);
              ctx.fillRect(Math.round(mx - 3), Math.round(my - 6), 6, 2);
              ctx.fillRect(Math.round(mx - 1), Math.round(my - 4), 2, 2);
            }
          }
          if (o.label) {
            const mx = o.px + o.dw / 2;
            ctx.font = "5px 'Press Start 2P', monospace";
            ctx.textAlign = "center";
            const tw = ctx.measureText(o.label).width;
            ctx.fillStyle = "rgba(10,8,18,0.72)";
            ctx.fillRect(Math.round(mx - tw / 2 - 3), Math.round(o.py - o.dh - 10), Math.round(tw + 6), 9);
            ctx.fillStyle = "#ffe9a8";
            ctx.fillText(o.label, Math.round(mx), Math.round(o.py - o.dh - 3));
          }
        }

        /* interact bubble above the player */
        if (s.interactTarget && !s.paused) {
          const bx = ppx + TILE / 2, by = ppy - 22 + bob;
          ctx.fillStyle = "rgba(255,255,255,0.92)";
          ctx.fillRect(Math.round(bx - 5), Math.round(by - 5), 10, 10);
          ctx.fillStyle = "#1b1b2f";
          ctx.font = "7px 'Press Start 2P', monospace";
          ctx.textAlign = "center";
          ctx.fillText("E", Math.round(bx), Math.round(by + 3));
        }

        /* fade overlay */
        if (s.fade.t > 0) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = `rgba(8,6,14,${s.fade.t})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      };
      const frame = (now: number) => {
        tick(now);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
      // rAF never fires in hidden tabs (including the Claude preview surface);
      // keep the world painting at a low rate so the page is never blank.
      hiddenTimer = window.setInterval(() => {
        if (document.hidden) tick(performance.now());
      }, 250);
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as Record<string, unknown>).__town = { state: s, tick };
      }
    })();

    return () => { cancelled = true; cancelAnimationFrame(raf); clearInterval(hiddenTimer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(() => {
    setIntro(false);
    state.current.paused = false;
    const stored = typeof window !== "undefined" ? localStorage.getItem("town-muted") : "1";
    const wantSound = stored === "0";
    if (wantSound && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => setMuted(false)).catch(() => {});
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) {
      a.volume = 0.3;
      a.play().then(() => { setMuted(false); localStorage.setItem("town-muted", "0"); }).catch(() => {});
    } else {
      a.pause();
      setMuted(true);
      localStorage.setItem("town-muted", "1");
    }
  }, [muted]);

  /* touch d-pad */
  const hold = (dir: Facing, on: boolean) => () => { state.current.held[dir] = on; };
  const padBtn =
    "flex items-center justify-center select-none rounded-md bg-white/10 active:bg-white/25 border border-white/20 text-white/80 w-12 h-12 text-lg";

  const cat = dialog?.category ? CATEGORIES[dialog.category] : null;

  return (
    <div className={`fixed inset-0 bg-[#0b0813] overflow-hidden ${pixelFont.className}`}>
      <canvas ref={canvasRef} className="w-full h-full [image-rendering:pixelated]" />
      <audio ref={audioRef} src="/game/music.ogg" loop preload="none" />

      {/* HUD: legend */}
      {!intro && (
        <div className="absolute top-3 right-3 z-20 text-[8px] leading-relaxed">
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className="mb-1 w-full text-left px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-white/85"
          >
            LEGEND {legendOpen ? "▾" : "▸"} <span className="text-white/35">(L)</span>
          </button>
          {legendOpen && (
            <div className="px-2.5 py-2 rounded bg-black/60 border border-white/15 space-y-1.5">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <div key={k} className="flex items-center gap-2 text-white/80">
                  {k === "cherished" ? (
                    <span className="text-[9px]" style={{ color: c.color }}>♥</span>
                  ) : (
                    <span className="inline-block w-2 h-2 rotate-45" style={{ background: c.color }} />
                  )}
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HUD: bottom-left controls */}
      {!intro && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 text-[8px]">
          <button onClick={toggleMusic} className="px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-white/85">
            {muted ? "♪ OFF" : "♪ ON"}
          </button>
          <a href="/portfolio" className="px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-white/60 hover:text-white/90">
            CLASSIC SITE →
          </a>
          <span className="hidden sm:inline px-2.5 py-1.5 rounded bg-black/60 border border-white/15 text-white/45">
            WASD/←↑↓→ MOVE · E INTERACT
          </span>
          {canInteract && !dialog && (
            <span className="px-2.5 py-1.5 rounded bg-amber-300/90 text-black/90 animate-pulse">PRESS E</span>
          )}
        </div>
      )}

      {/* touch controls */}
      {!intro && (
        <div className="absolute inset-x-0 bottom-16 z-20 hidden [@media(pointer:coarse)]:flex justify-between px-5 pointer-events-none">
          <div className="grid grid-cols-3 gap-1 pointer-events-auto opacity-80">
            <div />
            <button className={padBtn} onPointerDown={hold("up", true)} onPointerUp={hold("up", false)} onPointerLeave={hold("up", false)}>▲</button>
            <div />
            <button className={padBtn} onPointerDown={hold("left", true)} onPointerUp={hold("left", false)} onPointerLeave={hold("left", false)}>◀</button>
            <div />
            <button className={padBtn} onPointerDown={hold("right", true)} onPointerUp={hold("right", false)} onPointerLeave={hold("right", false)}>▶</button>
            <div />
            <button className={padBtn} onPointerDown={hold("down", true)} onPointerUp={hold("down", false)} onPointerLeave={hold("down", false)}>▼</button>
            <div />
          </div>
          <button
            className={`${padBtn} w-16 h-16 rounded-full self-end pointer-events-auto opacity-80`}
            onClick={() => (dialog ? closeDialog() : tryInteract())}
          >
            E
          </button>
        </div>
      )}

      {/* dialogue box */}
      {dialog && (
        <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-5 flex justify-center">
          <div className="w-full max-w-2xl rounded-lg border-4 border-white/85 bg-[#141126]/95 shadow-[0_0_0_4px_rgba(0,0,0,0.6)] p-4 sm:p-5 text-white">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-[11px] sm:text-[13px] text-amber-200">{dialog.title}</h2>
              {cat && (
                <span
                  className="text-[7px] px-2 py-1 rounded border"
                  style={{ color: cat.color, borderColor: cat.color }}
                >
                  {cat.label.toUpperCase()}
                </span>
              )}
              {dialog.cherished && <span className="text-[10px] text-pink-400">♥</span>}
            </div>
            {dialog.body.map((p, i) => (
              <p key={i} className="text-[8px] sm:text-[9px] leading-[1.9] text-white/85 mb-2">{p}</p>
            ))}
            {dialog.talks && (
              <ul className="mb-2 space-y-2">
                {dialog.talks.map((t, i) => (
                  <li key={i} className="text-[8px] leading-[1.8] text-white/80">
                    <span className="text-cyan-200">▸ {t.title}</span>
                    <br />
                    <span className="text-white/45">{t.event} · {t.date}</span>
                  </li>
                ))}
              </ul>
            )}
            {dialog.tags && (
              <p className="text-[7px] text-white/40 mb-2">{dialog.tags.join(" · ")}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {dialog.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-[8px] px-3 py-2 rounded bg-amber-300 text-black/90 hover:bg-amber-200"
                >
                  {l.label}
                </a>
              ))}
              <button onClick={closeDialog} className="text-[8px] px-3 py-2 rounded border border-white/30 text-white/70 hover:text-white ml-auto">
                CLOSE (E)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* intro overlay */}
      {intro && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0b0813]/92 p-6">
          <div className="text-center max-w-xl">
            <p className="text-[9px] text-emerald-300/80 mb-4 tracking-widest">DAMIAN VILLARREAL PRESENTS</p>
            <h1 className="text-xl sm:text-3xl text-amber-200 mb-5 leading-relaxed drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]">
              DAMIAN&apos;S TOWN
            </h1>
            <p className="text-[8px] sm:text-[9px] text-white/70 leading-[2] mb-6">
              A walkable portfolio. You wake up in the architect&apos;s studio —
              step outside and explore a town of security, AI, and systems-design
              projects. Talk to everything.
            </p>
            <p className="text-[8px] text-white/45 leading-[2] mb-7">
              WASD / ARROWS — MOVE&nbsp;&nbsp;·&nbsp;&nbsp;E — INTERACT&nbsp;&nbsp;·&nbsp;&nbsp;L — LEGEND
            </p>
            <button
              onClick={start}
              disabled={!ready}
              className="text-[10px] px-6 py-3 rounded bg-amber-300 text-black/90 hover:bg-amber-200 disabled:opacity-40 animate-pulse"
            >
              {ready ? "▶ PRESS START" : "LOADING…"}
            </button>
            <p className="mt-6 text-[7px] text-white/35">
              <a href="/portfolio" className="underline hover:text-white/70">prefer a classic site? →</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
