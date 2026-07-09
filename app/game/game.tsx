"use client";

/**
 * Pixel-world portfolio engine: a small hand-rolled canvas engine (no game
 * framework) with Pokémon-style grid movement, multiple themed worlds picked
 * from the home screen, y-sorted sprites, NPCs, warps, night lighting, and
 * DOM dialogue/HUD overlays.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Press_Start_2P } from "next/font/google";
import {
  TILE, SHEET_SRC, SPRITES, GRASS, DIRT, PC_GRASS, PC_BRICK, INTERIOR,
  CATEGORIES, DIALOGS, MAPS, WORLDS, MUSIC_SRC, type SpriteDef, type MapDef,
  type MapId, type WorldId, type Facing, type Dialog, type NpcDef, type Warp,
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
  light?: number; // night halo radius in world px
  marker?: { color: string; heart: boolean };
}

interface Npc {
  def: NpcDef;
  x: number; y: number;
  fromX: number; fromY: number;
  facing: Facing;
  moveT: number; // 0..1 progress, 1 = idle
  nextThink: number;
}

interface BuiltMap {
  def: MapDef;
  ground: HTMLCanvasElement;
  solid: Uint8Array;
  objects: WorldObject[];
  interact: Map<string, string>; // "x,y" -> dialog id
  npcs: Npc[];
}

interface Player {
  map: MapId;
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

/**
 * Runtime-drawn pixel props that don't exist in the RPG sheets (a computer
 * has no place in a medieval tileset). One 64x64 atlas; coordinates match the
 * `gen`-sheet SpriteDefs in world.ts:
 *   sign (0,0)  computer (16,0)  window (32,0)  desk (0,16, 32x16)  bed (0,32, 32x32)
 */
function makeGenSheet(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 64; c.height = 64;
  const g = c.getContext("2d")!;
  const px = (color: string, x: number, y: number, w = 1, h = 1) => {
    g.fillStyle = color; g.fillRect(x, y, w, h);
  };

  // ── signpost (0,0) ──
  px("#5c3a21", 7, 8, 2, 7); // post
  px("#8a5a32", 1, 2, 14, 7); // board
  px("#a97c50", 2, 3, 12, 5); // board face
  px("#6b4526", 4, 4, 8, 1); px("#6b4526", 4, 6, 6, 1); // etched lines
  px("#3e2715", 7, 15, 2, 1);

  // ── computer / CRT monitor (16,0), facing the viewer ──
  const cx = 16;
  px("#58616b", cx + 7, 9, 2, 1); // neck
  px("#9aa2ac", cx + 5, 13, 6, 1); // stand base
  px("#6b7480", cx + 3, 1, 10, 8); // monitor body
  px("#98a1ac", cx + 3, 1, 10, 1); // top highlight
  px("#4c545e", cx + 3, 8, 10, 1); // bottom shadow
  px("#10232b", cx + 4, 2, 8, 5); // screen border
  px("#1f7d8a", cx + 5, 3, 6, 3); // screen glow
  px("#8fe6f0", cx + 5, 3, 6, 1); // scanline
  px("#bdf3fa", cx + 5, 5, 2, 1); px("#5fc7d4", cx + 8, 5, 3, 1); // code lines
  px("#9aa2ac", cx + 2, 11, 12, 3); // keyboard
  px("#6b7480", cx + 2, 13, 12, 1); // keyboard front
  px("#c3ccd4", cx + 3, 11, 10, 1); // key highlight

  // ── window (32,0), wall-mounted, sky behind glass ──
  const wx = 32;
  px("#6b4526", wx + 1, 1, 14, 15); // wood frame
  px("#bfe4f5", wx + 2, 2, 5, 5); px("#bfe4f5", wx + 9, 2, 5, 5); // upper panes
  px("#a9d8ee", wx + 2, 9, 5, 5); px("#a9d8ee", wx + 9, 9, 5, 5); // lower panes
  px("#e3f5ff", wx + 2, 2, 5, 2); px("#e3f5ff", wx + 9, 2, 5, 2); // sky highlight
  px("#dff0d8", wx + 3, 6, 2, 1); // hint of hills
  px("#6b4526", wx + 7, 1, 2, 15); px("#6b4526", wx + 1, 7, 14, 2); // mullion cross
  px("#8a5a32", wx + 7, 1, 2, 1); px("#7a4e2c", wx + 1, 15, 14, 1); // sill

  // ── wooden desk (0,16), top-down, 2 tiles wide ──
  const dy = 16;
  px("#3e2715", 1, dy + 13, 2, 2); px("#3e2715", 29, dy + 13, 2, 2); // front legs
  px("#5c3a21", 1, dy + 1, 30, 13); // edge
  px("#8a5a32", 2, dy + 2, 28, 11); // top
  px("#a4703f", 2, dy + 2, 28, 2); // back highlight
  px("#6b4526", 2, dy + 11, 28, 2); // front shadow
  px("#7a4e2c", 4, dy + 5, 22, 1); px("#7a4e2c", 5, dy + 8, 18, 1); // grain
  px("#6b4526", 19, dy + 5, 10, 7); // drawer
  px("#c9a05a", 23, dy + 8, 2, 1); // drawer handle

  // ── bed (0,32), top-down, 2x2 tiles ──
  const by = 32;
  px("#4a2e19", 0, by + 1, 32, 30); // frame
  px("#6b4526", 1, by + 2, 30, 28); // frame inner
  px("#e8e8ef", 2, by + 3, 28, 8); // pillow
  px("#ffffff", 2, by + 3, 28, 3); // pillow highlight
  px("#c9c9d6", 2, by + 10, 28, 1); // pillow shadow
  px("#d0d0dd", 15, by + 4, 1, 6); // pillow crease
  px("#3f7fb0", 2, by + 12, 28, 18); // blanket
  px("#5a9fd0", 2, by + 12, 28, 2); // blanket highlight
  px("#2f6690", 2, by + 20, 28, 1); // fold line
  px("#2f6690", 2, by + 28, 28, 2); // foot shadow

  return c;
}

/**
 * Compose the Midnight Keep buildings from the Pixel Crawler modular kit
 * (wall strips + roof assemblies + door/window props + castle pieces).
 *
 * The "_big" roof assets have an UNEVEN bottom silhouette: their two gable
 * slopes dip to a shallowest point partway down (verified by profiling the
 * source alpha channel: brown_big/teal_big both bottom out at source y=70,
 * i.e. local y=64 after the sheet's own trim offset) rather than forming a
 * flat edge across the building width. A single wall strip butted against
 * the roof's overall bottom therefore leaves gaps under the shallow parts
 * of the eaves, showing bare ground through the "attic". Fix: draw the wall
 * texture doubled (tiled top-to-bottom) starting well above that shallowest
 * point, THEN draw the roof on top. The roof hides the excess wall
 * wherever it has full coverage, and the tiled wall fills in everywhere it
 * doesn't, so no gap is possible regardless of the roof's exact silhouette.
 *
 * Atlas rects consumed by world.ts:
 *   guildhouse (0,0,128,127)  archhouse (144,0,128,127)  keep (280,0,144,96)
 */
function makeMedSheet(sheets: Record<string, CanvasImageSource>): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 432; c.height = 128;
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = false;
  const d = (
    img: CanvasImageSource,
    sx: number, sy: number, sw: number, sh: number,
    dx: number, dy: number, sc = 1,
  ) => g.drawImage(img, sx, sy, sw, sh, dx, dy, sw * sc, sh * sc);
  const R = sheets.pcRoofs, W = sheets.pcWalls, P = sheets.pcBProps, D = sheets.pcDungeon;

  // drafting guild: timber-framed wall (tiled tall), big brown gable roof,
  // chimney, banded door, green shuttered windows
  d(W, 288, 189, 96, 49, 16, 29);
  d(W, 288, 189, 96, 49, 16, 78);
  d(R, 0, 6, 128, 86, 0, 0);
  d(P, 4, 73, 24, 53, 86, 14);
  d(P, 134, 27, 20, 37, 54, 90);
  d(P, 128, 64, 38, 32, 19, 92);
  d(P, 128, 64, 38, 32, 75, 92);

  // archives: brick wall (tiled tall, distinct from guild's timber), big
  // teal gable roof, arched door and windows
  d(W, 480, 189, 96, 49, 144 + 8, 29);
  d(W, 480, 189, 96, 49, 144 + 8, 78);
  d(R, 128, 6, 128, 86, 144, 0);
  d(P, 166, 25, 20, 39, 144 + 54, 90);
  d(P, 101, 60, 22, 36, 144 + 24, 91);
  d(P, 101, 60, 22, 36, 144 + 82, 91);

  // the keep: castle curtain wall (crenellations + banner trims) at 2x with
  // the arched wooden gate inlaid at center. Self-contained stone piece,
  // no gable roof involved, so it isn't affected by the roofline issue above
  d(D, 0, 230, 72, 48, 280, 0, 2);
  d(D, 0, 112, 32, 34, 280 + 40, 28, 2);

  return c;
}

const THEME_BG: Record<MapDef["theme"], string> = {
  interior: "#120b1d",
  village: "#1c2b1a",
  night: "#07071a",
  scene: "#07070d",
};

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

  if (def.theme === "interior") {
    // interior: dark void border, stone floor, wall along the top
    g.fillStyle = "#120b1d";
    g.fillRect(0, 0, w * TILE, h * TILE);
    for (let y = 2; y <= h - 2; y++)
      for (let x = 1; x <= w - 2; x++)
        g.drawImage(sheets.dg as HTMLImageElement, INTERIOR.floor.x, INTERIOR.floor.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
    for (let x = 1; x <= w - 2; x++) {
      g.drawImage(sheets.dg as HTMLImageElement, INTERIOR.wallTop.x, INTERIOR.wallTop.y, TILE, TILE, x * TILE, 0, TILE, TILE);
      // Windows are hand-drawn deco objects placed on the wall; keep torches
      // clear of them (tx 4/6/8).
      const v = x === 2 || x === 10 ? INTERIOR.wallTorch : INTERIOR.wall;
      g.drawImage(sheets.dg as HTMLImageElement, v.x, v.y, TILE, TILE, x * TILE, TILE, TILE, TILE);
    }
    // doormat
    g.fillStyle = "#7a4a96"; g.fillRect(6 * TILE + 2, 10 * TILE + 2, TILE - 4, TILE - 4);
    g.fillStyle = "#9a63bd"; g.fillRect(6 * TILE + 4, 10 * TILE + 4, TILE - 8, TILE - 8);
  } else if (def.theme === "scene") {
    // full-scene map (cyberpunk street): the artwork IS the ground
    g.fillStyle = THEME_BG.scene;
    g.fillRect(0, 0, w * TILE, h * TILE);
    g.drawImage(sheets.cyberBg as HTMLImageElement, 0, 0);
  } else if (def.ground === "crawler") {
    // night hamlet: Pixel Crawler dark grass, brick roads on the mask
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        if (isDirt(x, y)) {
          const t = PC_BRICK[(rng() * PC_BRICK.length) | 0];
          g.drawImage(sheets.pcFloors as HTMLImageElement, t.x, t.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
        } else {
          const t = PC_GRASS[(rng() * PC_GRASS.length) | 0];
          g.drawImage(sheets.pcFloors as HTMLImageElement, t.x, t.y, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
        }
      }
  } else {
    // village: grass with seeded variety, then autotiled dirt paths
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
    objects.push({ def: s, px, py, dw, dh, dialog: o.dialog, label: o.label, light: o.light, marker });
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

  // scene door-zones: interactable from the walk band below them
  for (const z of def.zones ?? []) {
    for (let t = z.tx; t < z.tx + z.w; t++) {
      interact.set(`${t},${def.bounds.y0 - 1}`, z.dialog);
      interact.set(`${t},${def.bounds.y0}`, z.dialog);
    }
  }

  // NPCs block their tile via a dynamic runtime check, not the solid grid
  const npcs: Npc[] = def.npcs.map((nd) => ({
    def: nd, x: nd.x, y: nd.y, fromX: nd.x, fromY: nd.y,
    facing: "down" as Facing, moveT: 1, nextThink: 1000 + Math.random() * 2000,
  }));

  return { def, ground, solid, objects, interact, npcs };
}

/* ── component ────────────────────────────────────────────── */

type Held = Partial<Record<Facing, boolean>>;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [picker, setPicker] = useState(true); // world-select overlay (home screen)
  const [started, setStarted] = useState(false);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [canInteract, setCanInteract] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.16);
  const volumeRef = useRef(0.16);
  const [legendOpen, setLegendOpen] = useState(true);

  // refs shared with the game loop
  const state = useRef<{
    maps: Record<MapId, BuiltMap> | null;
    sheets: Record<string, CanvasImageSource>;
    player: Player;
    world: WorldId;
    held: Held;
    fade: { t: number; dir: 1 | -1 | 0; warp: Warp | null };
    paused: boolean;
    interactTarget: string | null;
  }>({
    maps: null,
    sheets: {},
    player: {
      map: WORLDS[0].spawn.map, x: WORLDS[0].spawn.x, y: WORLDS[0].spawn.y,
      fromX: WORLDS[0].spawn.x, fromY: WORLDS[0].spawn.y,
      facing: WORLDS[0].spawn.facing, moveT: 1,
    },
    world: "village",
    held: {},
    fade: { t: 0, dir: 0, warp: null },
    paused: true,
    interactTarget: null,
  });

  /* restore saved volume once on mount */
  useEffect(() => {
    const saved = localStorage.getItem("town-volume");
    const v = saved ? parseFloat(saved) : NaN;
    if (!Number.isNaN(v)) { volumeRef.current = v; setVolume(v); }
  }, []);

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
    const npc = map.npcs.find((n) => n.x === p.x + dx && n.y === p.y + dy);
    if (npc) {
      if (npc.def.kind === "walker") {
        npc.facing = p.facing === "up" ? "down" : p.facing === "down" ? "up" : p.facing === "left" ? "right" : "left";
      }
      openDialog(npc.def.dialog);
      return;
    }
    const id = map.interact.get(key);
    if (id) openDialog(id);
  }, [openDialog]);

  /* music */
  const setTrack = useCallback((mapId: MapId, play: boolean) => {
    const a = audioRef.current;
    if (!a) return;
    const src = MUSIC_SRC[MAPS[mapId].music];
    const abs = new URL(src, window.location.href).href;
    if (a.src !== abs) {
      a.src = src;
    }
    a.volume = volumeRef.current;
    if (play) a.play().catch(() => {});
  }, []);

  const changeVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    localStorage.setItem("town-volume", String(v));
  }, []);

  /* enter a world (home-screen picker or WORLDS button) */
  const enterWorld = useCallback((id: WorldId) => {
    const s = state.current;
    const world = WORLDS.find((w) => w.id === id)!;
    s.world = id;
    if (started) {
      s.fade = { t: 0, dir: 1, warp: world.spawn };
    } else {
      const p = s.player;
      p.map = world.spawn.map; p.x = world.spawn.x; p.y = world.spawn.y;
      p.fromX = world.spawn.x; p.fromY = world.spawn.y;
      p.facing = world.spawn.facing; p.moveT = 1;
    }
    setPicker(false);
    setStarted(true);
    s.paused = false;
    const wantSound = localStorage.getItem("town-muted") === "0";
    setTrack(world.spawn.map, wantSound);
    if (wantSound) setMuted(false);
  }, [started, setTrack]);

  const openPicker = useCallback(() => {
    state.current.paused = true;
    setPicker(true);
  }, []);

  const closePicker = useCallback(() => {
    if (!started) return;
    state.current.paused = false;
    setPicker(false);
  }, [started]);

  /* input */
  useEffect(() => {
    const keyDir: Record<string, Facing> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right",
      W: "up", S: "down", A: "left", D: "right",
    };
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (picker) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enterWorld(state.current.world); }
        if (e.key === "Escape") closePicker();
        return;
      }
      const dir = keyDir[e.key];
      if (dir) { e.preventDefault(); state.current.held[dir] = true; return; }
      if (e.key === "e" || e.key === "E" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (dialog) closeDialog(); else tryInteract();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (dialog) closeDialog(); else openPicker(); // leave world → world selector
        return;
      }
      if (e.key === "l" || e.key === "L") setLegendOpen((v) => !v);
    };
    const up = (e: KeyboardEvent) => {
      const dir = keyDir[e.key];
      if (dir) state.current.held[dir] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [dialog, picker, tryInteract, closeDialog, enterWorld, closePicker, openPicker]);

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
      const chars = await Promise.all([
        load("/game/player.png"), load("/game/kid.png"), load("/game/pirate.png"),
        load("/game/soldier.png"), load("/game/orc.png"),
      ]);
      if (cancelled) return;
      const s = state.current;
      s.sheets = Object.fromEntries(entries);
      s.sheets.gen = makeGenSheet();
      s.sheets.medgen = makeMedSheet(s.sheets);
      s.sheets.player = chars[0];
      s.sheets.kid = chars[1];
      s.sheets.pirate = chars[2];
      s.sheets.soldier = chars[3];
      s.sheets.orc = chars[4];

      const rng = mulberry32(1337);
      s.maps = {
        town: buildMap(MAPS.town, s.sheets, rng),
        room: buildMap(MAPS.room, s.sheets, rng),
        medieval: buildMap(MAPS.medieval, s.sheets, rng),
        cyber: buildMap(MAPS.cyber, s.sheets, rng),
      };
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

      const npcAt = (map: BuiltMap, x: number, y: number) =>
        map.npcs.some((n) => (n.x === x && n.y === y) || (n.moveT < 1 && n.fromX === x && n.fromY === y));

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
            } else if (!isSolid(map, nx, ny) && !npcAt(map, nx, ny)) {
              p.fromX = p.x; p.fromY = p.y; p.x = nx; p.y = ny; p.moveT = 0;
            }
          }
        }

        /* NPC wandering (walkers only) */
        for (const n of map.npcs) {
          if (n.def.kind !== "walker") continue;
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
          if (isSolid(map, nx, ny)) continue;
          if ((nx === p.x && ny === p.y) || (nx === p.fromX && ny === p.fromY && p.moveT < 1)) continue;
          n.fromX = n.x; n.fromY = n.y; n.x = nx; n.y = ny; n.moveT = 0;
        }

        /* interact hint */
        const [fdx, fdy] = DIRS[p.facing];
        const facingKey = `${p.x + fdx},${p.y + fdy}`;
        const target =
          (map.npcs.some((n) => n.x === p.x + fdx && n.y === p.y + fdy) ? "npc" : null) ??
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
        ctx.fillStyle = THEME_BG[map.def.theme];
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
              const frame = o.def.anim ? ((now / o.def.anim.ms) | 0) % o.def.anim.frames : 0;
              const sx = o.def.x + frame * o.def.w;
              ctx.drawImage(img, sx, o.def.y, o.def.w, o.def.h, Math.round(o.px), Math.round(o.py - o.dh), o.dw, o.dh);
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

        const drawStrip = (n: Npc, x: number, y: number) => {
          const st = n.def.strip!;
          const sheet = s.sheets[n.def.sheet];
          const frame = ((now / 170) | 0) % st.frames;
          const dx = Math.round(x + TILE / 2 - st.fw / 2);
          const dy = Math.round(y + TILE - st.footY);
          ctx.save();
          if (st.flip) {
            ctx.translate(dx + st.fw, dy);
            ctx.scale(-1, 1);
            ctx.drawImage(sheet, frame * st.fw, 0, st.fw, st.fh, 0, 0, st.fw, st.fh);
          } else {
            ctx.drawImage(sheet, frame * st.fw, 0, st.fw, st.fh, dx, dy, st.fw, st.fh);
          }
          ctx.restore();
        };

        for (const n of map.npcs) {
          const nx = lerp(n.fromX, n.x, n.moveT) * TILE;
          const ny = lerp(n.fromY, n.y, n.moveT) * TILE;
          if (n.def.kind === "strip") {
            items.push({ y: ny + TILE, draw: () => drawStrip(n, nx, ny) });
          } else {
            items.push({ y: ny + TILE, draw: () => drawChar(s.sheets[n.def.sheet], nx, ny, n.facing, n.moveT < 1) });
          }
        }
        items.push({ y: ppy + TILE, draw: () => drawChar(s.sheets.player, ppx, ppy, p.facing, p.moveT < 1) });

        items.sort((a, b) => a.y - b.y);
        for (const it of items) it.draw();

        /* night tint + warm light halos */
        if (map.def.theme === "night") {
          ctx.fillStyle = "rgba(13, 12, 48, 0.46)";
          ctx.fillRect(0, 0, mw, mh);
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          const glow = (cx: number, cy: number, r: number, a: number) => {
            const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
            grad.addColorStop(0, `rgba(255, 176, 84, ${a})`);
            grad.addColorStop(1, "rgba(255, 176, 84, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
          };
          for (const o of map.objects) {
            if (o.light) glow(o.px + o.dw / 2, o.py - o.dh / 2, o.light, 0.34);
          }
          glow(ppx + TILE / 2, ppy + TILE / 2, 30, 0.16); // player lantern
          ctx.restore();
        }

        /* markers, labels */
        const bob = Math.sin(now / 280) * 2;
        const drawMarker = (mx: number, my: number, color: string, heart: boolean) => {
          if (heart) {
            const hd = SPRITES.heart;
            ctx.drawImage(s.sheets.ob as HTMLImageElement, hd.x, hd.y, hd.w, hd.h, Math.round(mx - 7), Math.round(my - 14), 15, 15);
          } else {
            ctx.fillStyle = color;
            ctx.fillRect(Math.round(mx - 1), Math.round(my - 12), 2, 2);
            ctx.fillRect(Math.round(mx - 3), Math.round(my - 10), 6, 2);
            ctx.fillRect(Math.round(mx - 5), Math.round(my - 8), 10, 2);
            ctx.fillRect(Math.round(mx - 3), Math.round(my - 6), 6, 2);
            ctx.fillRect(Math.round(mx - 1), Math.round(my - 4), 2, 2);
          }
        };
        const drawLabel = (mx: number, baseY: number, label: string) => {
          ctx.font = "5px 'Press Start 2P', monospace";
          ctx.textAlign = "center";
          const tw = ctx.measureText(label).width;
          ctx.fillStyle = "rgba(10,8,18,0.72)";
          ctx.fillRect(Math.round(mx - tw / 2 - 3), Math.round(baseY - 7), Math.round(tw + 6), 9);
          ctx.fillStyle = "#ffe9a8";
          ctx.fillText(label, Math.round(mx), Math.round(baseY));
        };
        for (const o of map.objects) {
          if (o.marker) drawMarker(o.px + o.dw / 2, o.py - o.dh - 7 + bob, o.marker.color, o.marker.heart);
          if (o.label) drawLabel(o.px + o.dw / 2, o.py - o.dh - 3, o.label);
        }
        for (const z of map.def.zones ?? []) {
          const zx = (z.tx + z.w / 2) * TILE;
          const d = DIALOGS[z.dialog];
          const color = d?.category ? CATEGORIES[d.category].color : "#ffffff";
          drawMarker(zx, z.markerY - 4 + bob, color, !!d?.cherished);
          drawLabel(zx, z.markerY + 8, z.label);
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

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (muted) {
      setTrack(state.current.player.map, true);
      setMuted(false);
      localStorage.setItem("town-muted", "0");
    } else {
      a.pause();
      setMuted(true);
      localStorage.setItem("town-muted", "1");
    }
  }, [muted, setTrack]);

  /* touch d-pad */
  const hold = (dir: Facing, on: boolean) => () => { state.current.held[dir] = on; };
  const padBtn =
    "flex items-center justify-center select-none rounded-md bg-white/10 active:bg-white/25 border border-white/20 text-white/80 w-12 h-12 text-lg";
  const hudBtn = "px-3 py-2 rounded bg-black/60 border border-white/15 text-white/85";

  const cat = dialog?.category ? CATEGORIES[dialog.category] : null;

  return (
    <div className={`fixed inset-0 bg-[#0b0813] overflow-hidden ${pixelFont.className}`}>
      <canvas ref={canvasRef} className="w-full h-full [image-rendering:pixelated]" />
      <audio ref={audioRef} loop preload="none" />

      {/* HUD: legend */}
      {!picker && (
        <div className="absolute top-3 right-3 z-20 text-[11px] leading-relaxed">
          <button
            onClick={() => setLegendOpen((v) => !v)}
            className="mb-1.5 w-full text-left px-3.5 py-2.5 rounded bg-black/60 border border-white/15 text-white/85"
          >
            LEGEND {legendOpen ? "▾" : "▸"} <span className="text-white/35 text-[9px]">(L)</span>
          </button>
          {legendOpen && (
            <div className="px-3.5 py-3 rounded bg-black/60 border border-white/15 space-y-2.5">
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <div key={k} className="flex items-center gap-3 text-white/85">
                  {k === "cherished" ? (
                    <span className="text-[14px] w-3 text-center" style={{ color: c.color }}>♥</span>
                  ) : (
                    <span className="inline-block w-3 h-3 rotate-45 shrink-0" style={{ background: c.color }} />
                  )}
                  {c.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* HUD: bottom-left controls */}
      {!picker && (
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 text-[10px] max-w-[calc(100vw-1.5rem)]">
          <button onClick={openPicker} className={`${hudBtn} text-amber-200`}>
            ◆ WORLDS <span className="text-amber-200/50">(ESC)</span>
          </button>
          <button onClick={toggleMusic} className={hudBtn}>
            {muted ? "♪ OFF" : "♪ ON"}
          </button>
          <div className={`${hudBtn} flex items-center gap-1.5`}>
            <span className="text-white/50">VOL</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              className="w-16 accent-amber-300 cursor-pointer align-middle"
              aria-label="Music volume"
            />
          </div>
          <a href="/portfolio" className={`${hudBtn} text-white/60 hover:text-white/90`}>
            CLASSIC SITE
          </a>
          <span className="hidden sm:inline px-3 py-2 rounded bg-black/60 border border-white/15 text-white/45">
            WASD/←↑↓→ MOVE · E INTERACT · ESC LEAVE
          </span>
          {canInteract && !dialog && (
            <span className="px-3 py-2 rounded bg-amber-300/90 text-black/90 animate-pulse">PRESS E</span>
          )}
        </div>
      )}

      {/* touch controls */}
      {!picker && (
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
        <div className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-6 flex justify-center">
          <div className="w-full max-w-3xl rounded-lg border-4 border-white/85 bg-[#141126]/95 shadow-[0_0_0_4px_rgba(0,0,0,0.6)] p-5 sm:p-7 text-white">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="text-[15px] sm:text-[17px] text-amber-200">{dialog.title}</h2>
              {cat && (
                <span
                  className="text-[10px] px-2.5 py-1 rounded border"
                  style={{ color: cat.color, borderColor: cat.color }}
                >
                  {cat.label.toUpperCase()}
                </span>
              )}
              {dialog.cherished && <span className="text-[13px] text-pink-400">♥</span>}
            </div>
            {dialog.body.map((p, i) => (
              <p key={i} className="text-[11px] sm:text-[12px] leading-[1.9] text-white/85 mb-2.5">{p}</p>
            ))}
            {dialog.talks && (
              <ul className="mb-2.5 space-y-2.5">
                {dialog.talks.map((t, i) => (
                  <li key={i} className="text-[11px] leading-[1.8] text-white/80">
                    <span className="text-cyan-200">▸ {t.title}</span>
                    <br />
                    <span className="text-white/45">{t.event} · {t.date}</span>
                  </li>
                ))}
              </ul>
            )}
            {dialog.tags && (
              <p className="text-[10px] text-white/40 mb-2.5">{dialog.tags.join(" · ")}</p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              {dialog.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  className="text-[11px] px-4 py-2.5 rounded bg-amber-300 text-black/90 hover:bg-amber-200"
                >
                  {l.label}
                </a>
              ))}
              <button onClick={closeDialog} className="text-[11px] px-4 py-2.5 rounded border border-white/30 text-white/70 hover:text-white ml-auto">
                CLOSE (E)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* home screen: world picker */}
      {picker && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#0b0813]/94 p-6 overflow-y-auto">
          <div className="text-center max-w-3xl w-full">
            <p className="text-[10px] text-emerald-300/80 mb-4 tracking-widest">DAMIAN VILLARREAL PRESENTS</p>
            <h1 className="text-2xl sm:text-4xl text-amber-200 mb-5 leading-relaxed drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)]">
              DAMIAN&apos;S WORLDS
            </h1>
            <p className="text-[11px] sm:text-[12px] text-white/70 leading-[2] mb-7">
              A walkable portfolio in three worlds. Each one is home to a
              different side of my work: pick a world to explore it.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 mb-7">
              {WORLDS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => enterWorld(w.id)}
                  disabled={!ready}
                  className="group px-5 py-6 rounded-lg border-2 bg-black/40 hover:bg-black/20 disabled:opacity-40 transition-colors text-center"
                  style={{ borderColor: w.color }}
                >
                  <span className="block text-[13px] mb-2.5" style={{ color: w.color }}>
                    {w.name}
                  </span>
                  <span className="block text-[10px] text-white/60 leading-[1.8]">
                    {w.focus}
                  </span>
                  <span className="mt-4 inline-block text-[10px] px-3 py-1.5 rounded bg-white/10 text-white/70 group-hover:bg-white/20">
                    {ready ? "ENTER" : "LOADING…"}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[10px] text-white/45 leading-[2] mb-6">
              WASD / ARROWS: MOVE&nbsp;&nbsp;·&nbsp;&nbsp;E: INTERACT&nbsp;&nbsp;·&nbsp;&nbsp;L: LEGEND&nbsp;&nbsp;·&nbsp;&nbsp;ESC: WORLDS
            </p>

            <div className="flex items-center justify-center gap-3">
              {started && (
                <button
                  onClick={closePicker}
                  className="text-[10px] px-5 py-2.5 rounded border border-white/30 text-white/70 hover:text-white"
                >
                  BACK TO GAME <span className="text-white/40">(ESC)</span>
                </button>
              )}
              <a
                href="/portfolio"
                className="text-[10px] px-5 py-2.5 rounded border border-white/30 text-white/70 hover:text-white inline-block"
              >
                CLASSIC SITE
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
