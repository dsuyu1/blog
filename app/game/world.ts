/**
 * World data for the pixel-town portfolio: sprite atlas, map builders, and
 * all dialogue content. Sprite rects were measured off the TinyRPG sheets
 * (Legacy Collection, anokolisa) — see public/game/.
 *
 * Two maps: `room` (the studio you spawn in) and `town` (the overworld).
 * Categories are signalled three ways at once: building choice, signposts,
 * and floating colored markers (heart = most cherished), plus the HUD legend.
 */

export const TILE = 16;

export type SheetKey =
  | "ow" // overworld tileset (grass/dirt/buildings)
  | "tw" // top-down town tileset (big house, trees, ground)
  | "dg" // dungeon tileset (interior walls/floor)
  | "ob" // dungeon objects (furniture/props)
  | "gen"; // runtime-generated pixel art (signposts)

export const SHEET_SRC: Record<Exclude<SheetKey, "gen">, string> = {
  ow: "/game/overworld.png",
  tw: "/game/town.png",
  dg: "/game/dungeon.png",
  ob: "/game/objects.png",
};

export type CategoryKey =
  | "architecture"
  | "security"
  | "ai"
  | "product"
  | "cherished"
  | "guide";

export const CATEGORIES: Record<CategoryKey, { label: string; color: string }> = {
  cherished: { label: "Most cherished", color: "#f472b6" },
  product: { label: "Product", color: "#fbbf24" },
  security: { label: "Security", color: "#f87171" },
  ai: { label: "AI / Research", color: "#c084fc" },
  architecture: { label: "Architecture", color: "#67e8f9" },
  guide: { label: "Info & links", color: "#a3e635" },
};

/* ── sprite atlas ─────────────────────────────────────────── */

export interface SpriteDef {
  sheet: SheetKey;
  x: number;
  y: number;
  w: number;
  h: number;
  scale?: number; // draw scale (overworld buildings are map-icons, drawn 2x)
  foot?: [w: number, h: number]; // solid footprint in tiles (bottom rows)
}

export const SPRITES = {
  // overworld buildings (2x)
  fortress: { sheet: "ow", x: 34, y: 228, w: 28, h: 25, scale: 2, foot: [4, 2] },
  tower: { sheet: "ow", x: 138, y: 241, w: 22, h: 47, scale: 2, foot: [3, 2] },
  hall: { sheet: "ow", x: 65, y: 226, w: 27, h: 29, scale: 2, foot: [4, 2] },
  castle: { sheet: "ow", x: 45, y: 291, w: 33, h: 26, scale: 2, foot: [5, 2] },
  dome: { sheet: "ow", x: 4, y: 260, w: 23, h: 27, scale: 2, foot: [3, 2] },
  temple: { sheet: "ow", x: 37, y: 259, w: 21, h: 27, scale: 2, foot: [3, 2] },
  arena: { sheet: "ow", x: 0, y: 226, w: 32, h: 29, scale: 2, foot: [4, 2] },
  church: { sheet: "ow", x: 97, y: 293, w: 26, h: 39, scale: 2, foot: [4, 2] },
  well: { sheet: "ow", x: 101, y: 230, w: 22, h: 23, scale: 2, foot: [3, 2] },
  house_a: { sheet: "ow", x: 0, y: 285, w: 16, h: 18, scale: 2, foot: [2, 1] },
  house_b: { sheet: "ow", x: 16, y: 285, w: 17, h: 19, scale: 2, foot: [2, 1] },
  // town-scale props (1x)
  bighouse: { sheet: "tw", x: 192, y: 25, w: 80, h: 125, scale: 1, foot: [5, 3] },
  tree: { sheet: "tw", x: 118, y: 16, w: 54, h: 63, scale: 1, foot: [2, 1] },
  smalltree: { sheet: "tw", x: 33, y: 96, w: 15, h: 31, scale: 1, foot: [1, 1] },
  stump: { sheet: "tw", x: 64, y: 99, w: 32, h: 29, scale: 1, foot: [2, 1] },
  bush1: { sheet: "tw", x: 113, y: 96, w: 14, h: 16, scale: 1, foot: [1, 1] },
  bush2: { sheet: "tw", x: 145, y: 96, w: 14, h: 16, scale: 1, foot: [1, 1] },
  rock_s: { sheet: "tw", x: 33, y: 148, w: 14, h: 8, scale: 1, foot: [1, 1] },
  rock_b: { sheet: "tw", x: 37, y: 156, w: 19, h: 36, scale: 1, foot: [1, 1] },
  // interior props
  desk: { sheet: "ob", x: 64, y: 115, w: 50, h: 13, scale: 1, foot: [4, 1] },
  chest: { sheet: "ob", x: 161, y: 19, w: 15, h: 13, scale: 1, foot: [1, 1] },
  cabinet: { sheet: "ob", x: 176, y: 80, w: 16, h: 16, scale: 1, foot: [1, 1] },
  vase: { sheet: "ob", x: 113, y: 82, w: 14, h: 13, scale: 1, foot: [1, 1] },
  plant: { sheet: "ob", x: 209, y: 81, w: 14, h: 14, scale: 1, foot: [1, 1] },
  banner: { sheet: "ob", x: 80, y: 80, w: 16, h: 16, scale: 1 },
  coins: { sheet: "ob", x: 113, y: 112, w: 14, h: 16, scale: 1, foot: [1, 1] },
  heart: { sheet: "ob", x: 241, y: 50, w: 15, h: 15, scale: 1 },
  sign: { sheet: "gen", x: 0, y: 0, w: 16, h: 16, scale: 1, foot: [1, 1] },
} satisfies Record<string, SpriteDef>;

export type SpriteKey = keyof typeof SPRITES;

/* ── ground tiles ─────────────────────────────────────────── */

// town grass variants (top-down town sheet)
export const GRASS = [
  { sheet: "tw" as const, x: 288, y: 16 }, // plain
  { sheet: "tw" as const, x: 304, y: 16 }, // tufts
  { sheet: "tw" as const, x: 320, y: 16 }, // tall grass
  { sheet: "tw" as const, x: 336, y: 16 }, // flowers
];

// 3x3 dirt-path autotile blob (overworld sheet)
export const DIRT = {
  TL: { x: 176, y: 48 }, T: { x: 192, y: 48 }, TR: { x: 208, y: 48 },
  L: { x: 176, y: 64 }, C: { x: 192, y: 64 }, R: { x: 208, y: 64 },
  BL: { x: 176, y: 80 }, B: { x: 192, y: 80 }, BR: { x: 208, y: 80 },
};

// interior tiles (dungeon sheet)
export const INTERIOR = {
  floor: { x: 32, y: 96 },
  wallTop: { x: 32, y: 32 }, // top half of the wall panel
  wall: { x: 32, y: 48 }, // bottom half
  wallTorch: { x: 64, y: 48 },
  wallWindow: { x: 96, y: 48 },
};

/* ── dialogue content ─────────────────────────────────────── */

export interface Dialog {
  title: string;
  category?: CategoryKey;
  cherished?: boolean;
  body: string[];
  tags?: string[];
  links?: { label: string; href: string }[];
  talks?: { title: string; event: string; date: string }[];
}

const GH = "https://github.com/dsuyu1";

export const DIALOGS: Record<string, Dialog> = {
  threatscaper: {
    title: "ThreatScaper Castle",
    category: "product",
    cherished: true,
    body: [
      "The castle at the heart of town — my flagship product.",
      "ThreatScaper is an AI-powered threat-intelligence enrichment tool for security and business operations: automated IOC enrichment and machine-speed triage.",
    ],
    tags: ["AI", "Threat Intel", "Security Ops", "2026"],
    links: [{ label: "Visit ThreatScaper ↗", href: "https://security.damianvillarreal.com" }],
  },
  zerotrust: {
    title: "Zero-Trust Fortress",
    category: "security",
    body: [
      "A fortress trusts nobody who walks up to the gate. Neither does this framework.",
      "Blockchain-backed IoT security architecture with post-quantum crypto and ML anomaly detection, sustaining ~397 TPS.",
    ],
    tags: ["Blockchain", "PQ Crypto", "ML", "IoT", "2025"],
    links: [{ label: "Source on GitHub ↗", href: `${GH}/seniorproject2025` }],
  },
  aws: {
    title: "The Watchtower",
    category: "security",
    body: [
      "From up here you can see the whole cloud.",
      "AWS Cloud Security Monitoring: Terraform-provisioned Wazuh agents on EC2, with Tailscale for secure home-manager connectivity.",
    ],
    tags: ["AWS", "Terraform", "Wazuh", "Tailscale", "2025"],
    links: [{ label: "Source on GitHub ↗", href: `${GH}/wazuh-tf` }],
  },
  soar: {
    title: "Automation Hall",
    category: "security",
    body: [
      "Inside, the machines triage alerts so humans don't have to.",
      "SOAR-EDR pipeline built on Tines + LimaCharlie for LLM-augmented, machine-speed triage and enrichment across the detection lifecycle.",
    ],
    tags: ["Tines", "LimaCharlie", "SOAR", "LLM", "2025"],
    links: [{ label: "Source on GitHub ↗", href: `${GH}/SOAR-EDR-Project` }],
  },
  chipnemo: {
    title: "The Observatory",
    category: "ai",
    body: [
      "Where the town studies language models.",
      "ChipNeMo DAPT Pipeline: reproduced NVIDIA's domain-adaptive pre-training pipeline for Llama 2 7B — data curation, custom tokenization, DAPT, and SFT with NeMo.",
    ],
    tags: ["NeMo", "Llama 2", "DAPT", "Python", "2026"],
    links: [{ label: "Read the write-up", href: "/n/4" }],
  },
  talks: {
    title: "Speaker's Chapel",
    category: "ai",
    body: ["Talks I've given around the region:"],
    talks: [
      { title: "Smarter SecOps: Leveraging Private, Federated Transfer Learning", event: "BSides RGV", date: "2026" },
      { title: "Federated Domain-Adaptive Pre-Training for Privacy-Preserving Security LMs", event: "UTRGV STEM Conference", date: "April 2026" },
      { title: "Zero-Trust at the Edge: Privacy-First Security for IoT Surveillance", event: "Region One ESC Cybersecurity Summit", date: "Oct 2025" },
      { title: "Empire C2", event: "6th Annual BSides RGV", date: "May 2025" },
    ],
    links: [{ label: "All talks & details", href: "/portfolio#talks" }],
  },
  learning: {
    title: "Training Grounds",
    category: "guide",
    body: [
      "Every architect keeps training. The arena tracks what I'm studying right now — certs, papers, and lab work.",
    ],
    links: [{ label: "See the learning roadmap", href: "/learning" }],
  },
  about: {
    title: "Shrine of the Architect",
    category: "guide",
    body: [
      "Damian Villarreal — security operations, cloud, and AI. Aspiring security architect: I care about how systems fit together, not just how they break.",
    ],
    links: [
      { label: "About me", href: "/about" },
      { label: "GitHub ↗", href: GH },
    ],
  },
  blog: {
    title: "Well of Knowledge",
    category: "guide",
    body: [
      "Drop a bucket in and pull up a write-up. Reverse engineering, LLM training pipelines, security experiments — it all ends up in the well.",
    ],
    links: [{ label: "Read the blog", href: "/n" }],
  },
  desk: {
    title: "The Drafting Desk",
    category: "architecture",
    body: [
      "Where systems get designed before they get built.",
      "Security architectures, cloud infrastructure, AI training pipelines — my favorite work is deciding how the pieces fit together. Everything out in town started as a sketch on this desk.",
    ],
    links: [
      { label: "Full portfolio", href: "/portfolio" },
      { label: "Learning roadmap", href: "/learning" },
    ],
  },
  cabinet: {
    title: "Diagram Cabinet",
    category: "architecture",
    body: [
      "Tokenization pipelines, memory maps, process trees, data-curation flows… I draw a lot of diagrams. Most of them live inside my write-ups.",
    ],
    links: [{ label: "Browse the write-ups", href: "/n" }],
  },
  chest: {
    title: "Treasure Chest",
    category: "cherished",
    cherished: true,
    body: ["The work I'm proudest of. Handle with care."],
    links: [
      { label: "ThreatScaper ↗", href: "https://security.damianvillarreal.com" },
      { label: "Zero-Trust IoT Framework ↗", href: `${GH}/seniorproject2025` },
    ],
  },
  sign_welcome: {
    title: "Town Notice Board",
    category: "guide",
    body: [
      "Welcome to Damian's Town — a walkable portfolio.",
      "Every building with a floating gem holds a project; the gem's color is its category (see the legend). Pink hearts mark the work I cherish most. Walk up and press E to enter.",
    ],
  },
  sign_home: {
    title: "Signpost",
    category: "guide",
    body: ["« Damian's Studio — the architect lives (and drafts) here. »"],
  },
  sign_security: {
    title: "Signpost",
    category: "security",
    body: ["« Security Quarter — fortress, watchtower & automation hall. »"],
  },
  sign_ai: {
    title: "Signpost",
    category: "ai",
    body: ["« Research District — observatory, shrine & chapel. »"],
  },
  sign_flagship: {
    title: "Signpost",
    category: "product",
    body: ["« The Castle — home of ThreatScaper, the town's flagship product. »"],
  },
  neighbor: {
    title: "Neighbor's House",
    body: ["You knock. Nobody answers — they're probably reading the blog."],
  },
  npc_kid: {
    title: "Kid",
    category: "guide",
    body: [
      "Hey, you're new! Move with WASD or the arrow keys, press E to talk to things.",
      "The colored gems floating over buildings tell you what's inside — red is security, purple is AI, gold is the product castle. The heart? That's the stuff Damian loves most.",
    ],
  },
  npc_pirate: {
    title: "Pirate Girl",
    category: "guide",
    body: [
      "Looking for the architect himself? He ships everything to the open seas of GitHub. Or send a raven — er, an email.",
    ],
    links: [
      { label: "GitHub ↗", href: GH },
      { label: "About & contact", href: "/about" },
    ],
  },
};

/* ── map definitions ──────────────────────────────────────── */

export type Facing = "up" | "down" | "left" | "right";

export interface ObjPlace {
  sprite: SpriteKey;
  tx: number; // tile of the leftmost footprint column
  ty: number; // tile of the bottom footprint row (baseline)
  dialog?: string;
  label?: string; // small floating label (signposts)
  deco?: boolean; // no collision (wall decorations)
}

export interface Warp {
  map: "town" | "room";
  x: number;
  y: number;
  facing: Facing;
}

export interface NpcDef {
  id: string;
  sheet: "kid" | "pirate";
  x: number;
  y: number;
  dialog: string;
  wander: number; // radius in tiles, 0 = stationary
}

export interface MapDef {
  id: "town" | "room";
  w: number;
  h: number;
  // walkable bounds (everything outside is solid)
  bounds: { x0: number; y0: number; x1: number; y1: number };
  dirt: [x: number, y: number, w: number, h: number][];
  objects: ObjPlace[];
  warps: Record<string, Warp>; // "x,y" — triggered by stepping on or bumping into
  npcs: NpcDef[];
}

export const TOWN: MapDef = {
  id: "town",
  w: 42,
  h: 36,
  bounds: { x0: 2, y0: 4, x1: 38, y1: 32 },
  dirt: [
    [5, 15, 33, 2], // north street
    [5, 25, 33, 2], // south street
    [21, 17, 2, 8], // avenue between streets
    [17, 18, 6, 4], // plaza
  ],
  objects: [
    // home (north street, center) — door warps into the room
    { sprite: "bighouse", tx: 19, ty: 14, dialog: "sign_home" },
    // security quarter (west)
    { sprite: "fortress", tx: 6, ty: 14, dialog: "zerotrust" },
    { sprite: "tower", tx: 12, ty: 14, dialog: "aws" },
    { sprite: "hall", tx: 6, ty: 24, dialog: "soar" },
    // flagship castle (south street)
    { sprite: "castle", tx: 14, ty: 24, dialog: "threatscaper" },
    // research district (east)
    { sprite: "dome", tx: 28, ty: 14, dialog: "chipnemo" },
    { sprite: "temple", tx: 33, ty: 14, dialog: "about" },
    { sprite: "arena", tx: 28, ty: 24, dialog: "learning" },
    { sprite: "church", tx: 33, ty: 24, dialog: "talks" },
    // plaza
    { sprite: "well", tx: 18, ty: 20, dialog: "blog" },
    // signposts
    { sprite: "sign", tx: 24, ty: 14, dialog: "sign_welcome", label: "WELCOME" },
    { sprite: "sign", tx: 17, ty: 14, dialog: "sign_home", label: "STUDIO" },
    { sprite: "sign", tx: 10, ty: 18, dialog: "sign_security", label: "SECURITY" },
    { sprite: "sign", tx: 31, ty: 18, dialog: "sign_ai", label: "RESEARCH" },
    { sprite: "sign", tx: 12, ty: 22, dialog: "sign_flagship", label: "FLAGSHIP" },
    // neighbor cottages
    { sprite: "house_a", tx: 25, ty: 14, dialog: "neighbor" },
    { sprite: "house_b", tx: 11, ty: 24, dialog: "neighbor" },
    // greenery — north park
    { sprite: "tree", tx: 5, ty: 9 }, { sprite: "tree", tx: 15, ty: 8 },
    { sprite: "tree", tx: 36, ty: 9 }, { sprite: "bush1", tx: 11, ty: 9 },
    { sprite: "bush2", tx: 24, ty: 10 }, { sprite: "rock_b", tx: 32, ty: 8 },
    { sprite: "stump", tx: 17, ty: 9 },
    // mid-town greenery
    { sprite: "bush1", tx: 5, ty: 20 }, { sprite: "smalltree", tx: 37, ty: 21 },
    { sprite: "bush2", tx: 5, ty: 21 }, { sprite: "rock_s", tx: 37, ty: 19 },
    { sprite: "bush2", tx: 26, ty: 21 },
    // south green
    { sprite: "tree", tx: 5, ty: 31 }, { sprite: "tree", tx: 20, ty: 31 },
    { sprite: "tree", tx: 36, ty: 31 }, { sprite: "stump", tx: 24, ty: 29 },
    { sprite: "rock_b", tx: 12, ty: 30 }, { sprite: "bush1", tx: 17, ty: 29 },
    { sprite: "bush2", tx: 27, ty: 30 },
  ],
  warps: {
    // the studio door (bottom-center of the big house): bump to enter
    "21,14": { map: "room", x: 6, y: 9, facing: "up" },
  },
  npcs: [
    { id: "kid", sheet: "kid", x: 24, y: 20, dialog: "npc_kid", wander: 2 },
    { id: "pirate", sheet: "pirate", x: 31, y: 27, dialog: "npc_pirate", wander: 2 },
  ],
};

export const ROOM: MapDef = {
  id: "room",
  w: 13,
  h: 12,
  bounds: { x0: 1, y0: 2, x1: 11, y1: 10 },
  dirt: [],
  objects: [
    { sprite: "desk", tx: 2, ty: 4, dialog: "desk" },
    { sprite: "chest", tx: 6, ty: 2, dialog: "chest" },
    { sprite: "cabinet", tx: 9, ty: 2, dialog: "cabinet" },
    { sprite: "banner", tx: 4, ty: 1, deco: true },
    { sprite: "banner", tx: 8, ty: 1, deco: true },
    { sprite: "vase", tx: 10, ty: 6 },
    { sprite: "plant", tx: 1, ty: 7 },
    { sprite: "coins", tx: 10, ty: 9 },
  ],
  warps: {
    // doormat at the bottom — step on it to leave the studio
    "6,11": { map: "town", x: 21, y: 15, facing: "down" },
    "6,10": { map: "town", x: 21, y: 15, facing: "down" },
  },
  npcs: [],
};

export const MAPS = { town: TOWN, room: ROOM };

export const START = { map: "room" as const, x: 6, y: 6, facing: "down" as Facing };
