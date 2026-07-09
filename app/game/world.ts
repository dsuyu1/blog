/**
 * World data for the pixel-town portfolio: sprite atlas, map builders, and
 * all dialogue content. Sprite rects were measured off the source sheets —
 * see public/game/ (TinyRPG "Legacy Collection" by anokolisa, Pixel Crawler
 * free pack, ansimuz cyberpunk-street, Tiny RPG Soldier&Orc).
 *
 * Three explorable worlds, chosen from the home screen:
 *   village  — Pixel Village (product · talks · blog · about), spawns in the
 *              studio `room` which warps out to `town`.
 *   medieval — Midnight Keep (architecture & system design), a night map.
 *   cyber    — Neon City (hacking · AI · security ops), a side-view street
 *              scene you walk along.
 *
 * Categories are signalled three ways at once: building choice, floating
 * labels, and colored diamond markers (heart = most cherished), plus the
 * HUD legend.
 */

export const TILE = 16;

export type MapId = "room" | "town" | "medieval" | "cyber";
export type WorldId = "village" | "medieval" | "cyber";

export type SheetKey =
  | "ow" // overworld tileset (grass/dirt/buildings)
  | "tw" // top-down town tileset (big house, trees, ground)
  | "dg" // dungeon tileset (interior walls/floor)
  | "ob" // dungeon objects (furniture/props)
  | "pcTrees" // Pixel Crawler pines
  | "pcAnvil" // Pixel Crawler smithy stations
  | "pcProps" // Pixel Crawler dungeon props (torches, banners, graves)
  | "pcRocks" // Pixel Crawler boulders
  | "pcFloors" // Pixel Crawler floor tiles (dark grass, brick road)
  | "pcWalls" // Pixel Crawler building wall strips
  | "pcRoofs" // Pixel Crawler roof assemblies
  | "pcBProps" // Pixel Crawler building props (doors, windows, benches)
  | "pcDungeon" // Pixel Crawler castle/dungeon pieces (keep gatehouse)
  | "bonfire" // Pixel Crawler animated bonfire (4 frames of 32x32)
  | "cyberBg" // ansimuz cyberpunk street scene (608x192)
  | "gen" // runtime-generated pixel art (signpost, desk, bed, computer…)
  | "medgen"; // runtime-composed medieval buildings (see makeMedSheet)

export const SHEET_SRC: Record<Exclude<SheetKey, "gen" | "medgen">, string> = {
  ow: "/game/overworld.png",
  tw: "/game/town.png",
  dg: "/game/dungeon.png",
  ob: "/game/objects.png",
  pcTrees: "/game/pc-trees.png",
  pcAnvil: "/game/pc-anvil.png",
  pcProps: "/game/pc-props.png",
  pcRocks: "/game/pc-rocks.png",
  pcFloors: "/game/pc-floors.png",
  pcWalls: "/game/pc-walls.png",
  pcRoofs: "/game/pc-roofs.png",
  pcBProps: "/game/pc-bprops.png",
  pcDungeon: "/game/pc-dungeon.png",
  bonfire: "/game/bonfire.png",
  cyberBg: "/game/cyber-street.png",
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
  anim?: { frames: number; ms: number }; // horizontal strip animation
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
  // Pixel Crawler night-world props (1x)
  pine1: { sheet: "pcTrees", x: 4, y: 9, w: 54, h: 103, scale: 1, foot: [2, 1] },
  pine2: { sheet: "pcTrees", x: 68, y: 9, w: 54, h: 103, scale: 1, foot: [2, 1] },
  pine_dead: { sheet: "pcTrees", x: 141, y: 17, w: 43, h: 95, scale: 1, foot: [2, 1] },
  smithy: { sheet: "pcAnvil", x: 80, y: 36, w: 79, h: 56, scale: 1, foot: [5, 2] },
  torch: { sheet: "pcProps", x: 67, y: 40, w: 10, h: 15, scale: 1, foot: [1, 1] },
  grave: { sheet: "pcProps", x: 97, y: 4, w: 17, h: 18, scale: 1, foot: [1, 1] },
  boulder: { sheet: "pcRocks", x: 2, y: 19, w: 28, h: 43, scale: 1, foot: [2, 1] },
  boulder2: { sheet: "pcRocks", x: 98, y: 19, w: 28, h: 43, scale: 1, foot: [2, 1] },
  bonfire: { sheet: "bonfire", x: 0, y: 0, w: 32, h: 32, scale: 1, foot: [2, 1], anim: { frames: 4, ms: 140 } },
  bench: { sheet: "pcBProps", x: 84, y: 160, w: 52, h: 24, scale: 1, foot: [3, 1] },
  planter: { sheet: "pcBProps", x: 18, y: 157, w: 34, h: 14, scale: 1, foot: [2, 1] },
  // runtime-composed medieval buildings (walls + roofs + doors + windows;
  // rects match makeMedSheet in game.tsx)
  guildhouse: { sheet: "medgen", x: 0, y: 0, w: 128, h: 127, scale: 1, foot: [8, 2] },
  archhouse: { sheet: "medgen", x: 144, y: 0, w: 128, h: 127, scale: 1, foot: [8, 2] },
  keep: { sheet: "medgen", x: 280, y: 0, w: 144, h: 96, scale: 1, foot: [9, 2] },
  // interior props
  chest: { sheet: "ob", x: 161, y: 19, w: 15, h: 13, scale: 1, foot: [1, 1] },
  cabinet: { sheet: "ob", x: 176, y: 80, w: 16, h: 16, scale: 1, foot: [1, 1] },
  vase: { sheet: "ob", x: 113, y: 82, w: 14, h: 13, scale: 1, foot: [1, 1] },
  plant: { sheet: "ob", x: 209, y: 81, w: 14, h: 14, scale: 1, foot: [1, 1] },
  banner: { sheet: "ob", x: 80, y: 80, w: 16, h: 16, scale: 1 },
  coins: { sheet: "ob", x: 113, y: 112, w: 14, h: 16, scale: 1, foot: [1, 1] },
  heart: { sheet: "ob", x: 241, y: 50, w: 15, h: 15, scale: 1 },
  // hand-drawn props (see makeGenSheet in game.tsx)
  sign: { sheet: "gen", x: 0, y: 0, w: 16, h: 16, scale: 1, foot: [1, 1] },
  computer: { sheet: "gen", x: 16, y: 0, w: 16, h: 16, scale: 1, foot: [1, 1] },
  window: { sheet: "gen", x: 32, y: 0, w: 16, h: 16, scale: 1 },
  desk: { sheet: "gen", x: 0, y: 16, w: 32, h: 16, scale: 1, foot: [2, 1] },
  bed: { sheet: "gen", x: 0, y: 32, w: 32, h: 32, scale: 1, foot: [2, 2] },
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

// Pixel Crawler night-world ground (pcFloors sheet): solid dark-grass fills
// picked from the blob arms, and brick tiles from the road patch
// (verified 100%-opaque cells — the first blob row has scalloped edges and
// the brick patch is not 16-aligned at its top-left corner)
export const PC_GRASS = [
  { x: 16, y: 160 }, { x: 32, y: 160 }, { x: 16, y: 176 }, { x: 48, y: 160 },
];
export const PC_BRICK = [
  { x: 256, y: 16 }, { x: 272, y: 16 }, { x: 272, y: 32 }, { x: 288, y: 48 },
];

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
    links: [{ label: "Visit ThreatScaper", href: "https://security.damianvillarreal.com" }],
  },
  zerotrust: {
    title: "The Keep",
    category: "security",
    body: [
      "A keep trusts nobody who walks up to the gate. Neither does this framework — its walls are the architecture itself.",
      "Zero-Trust IoT Security Framework: blockchain-backed architecture with post-quantum crypto and ML anomaly detection, sustaining ~397 TPS.",
    ],
    tags: ["Blockchain", "PQ Crypto", "ML", "IoT", "2025"],
    links: [{ label: "Source on GitHub", href: `${GH}/seniorproject2025` }],
  },
  aws: {
    title: "Watchpoint",
    category: "security",
    body: [
      "Every skyline needs a watcher. This one watches the cloud.",
      "AWS Cloud Security Monitoring: Terraform-provisioned Wazuh agents on EC2, with Tailscale for secure home-manager connectivity.",
    ],
    tags: ["AWS", "Terraform", "Wazuh", "Tailscale", "2025"],
    links: [{ label: "Source on GitHub", href: `${GH}/wazuh-tf` }],
  },
  soar: {
    title: "SOC Bar",
    category: "security",
    body: [
      "The regulars here are machines, and they never stop triaging.",
      "SOAR-EDR pipeline built on Tines + LimaCharlie for LLM-augmented, machine-speed triage and enrichment across the detection lifecycle.",
    ],
    tags: ["Tines", "LimaCharlie", "SOAR", "LLM", "2025"],
    links: [{ label: "Source on GitHub", href: `${GH}/SOAR-EDR-Project` }],
  },
  chipnemo: {
    title: "AI Lab",
    category: "ai",
    body: [
      "Behind the neon: GPUs, tokenizers, and a lot of curated data.",
      "ChipNeMo DAPT Pipeline: reproduced NVIDIA's domain-adaptive pre-training pipeline for Llama 2 7B — data curation, custom tokenization, DAPT, and SFT with NeMo.",
    ],
    tags: ["NeMo", "Llama 2", "DAPT", "Python", "2026"],
    links: [{ label: "Read the write-up", href: "/n/4" }],
  },
  c2club: {
    title: "C2 Club",
    category: "security",
    body: [
      "Members only. The bouncer asks for your beacon, not your ID.",
      "Empire C2 — a red-team talk I gave at the 6th Annual BSides RGV (May 2025) on command-and-control infrastructure.",
    ],
    tags: ["Red Team", "C2", "BSides RGV", "2025"],
    links: [{ label: "All talks & details", href: "/portfolio#talks" }],
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
      { label: "GitHub", href: GH },
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
    title: "The Wooden Desk",
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
  computer: {
    title: "The Workstation",
    category: "product",
    body: [
      "Where the sketches turn into software.",
      "This is the machine — ThreatScaper, security tooling, and training pipelines all get built here. Terminal-heavy, coffee-fueled, usually running well past midnight.",
    ],
    links: [
      { label: "ThreatScaper", href: "https://security.damianvillarreal.com" },
      { label: "GitHub", href: GH },
    ],
  },
  bed: {
    title: "The Bed",
    body: [
      "Even architects have to sleep sometime.",
      "…though this one mostly lies awake designing zero-trust boundaries in his head.",
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
      { label: "ThreatScaper", href: "https://security.damianvillarreal.com" },
      { label: "Zero-Trust IoT Framework", href: `${GH}/seniorproject2025` },
    ],
  },
  // medieval night world
  guild: {
    title: "Drafting Guild",
    category: "architecture",
    body: [
      "The guild hall where systems are designed by candlelight.",
      "Security architectures, cloud topologies, AI pipelines — the craft here is deciding how the pieces fit together before a single stone is laid.",
    ],
    links: [
      { label: "Full portfolio", href: "/portfolio" },
      { label: "Learning roadmap", href: "/learning" },
    ],
  },
  forge: {
    title: "The Forge",
    category: "architecture",
    body: [
      "Blueprints go in, systems come out.",
      "Terraform plans, NeMo training runs, SOAR pipelines — every design from the guild gets hammered into something real on this anvil.",
    ],
    links: [{ label: "See what's been forged", href: "/portfolio#projects" }],
  },
  archives: {
    title: "The Archives",
    category: "architecture",
    body: [
      "Scrolls of tokenization pipelines, memory maps, and process trees — the diagram collection of a systems architect, preserved in write-ups.",
    ],
    links: [{ label: "Browse the write-ups", href: "/n" }],
  },
  bonfire: {
    title: "Bonfire",
    category: "guide",
    body: [
      "The fire crackles. Travelers swap war stories here — federated learning at the edge, C2 infrastructure, zero-trust at midnight.",
    ],
    links: [{ label: "Hear the talks", href: "/portfolio#talks" }],
  },
  npc_soldier: {
    title: "Keep Guard",
    category: "guide",
    body: [
      "Halt! The Keep runs zero-trust — nobody gets in on reputation alone. Not even me, and I've stood this post for years.",
      "Every request is verified, every device attested. The architect designed it that way on purpose.",
    ],
    links: [{ label: "The Keep's blueprints", href: `${GH}/seniorproject2025` }],
  },
  npc_orc: {
    title: "Orc by the Fire",
    category: "guide",
    body: [
      "Orc used to smash castle walls. Then orc read about post-quantum crypto. Walls got harder.",
      "Orc reviews pull requests now. Orc rejects force-push to main.",
    ],
    links: [{ label: "Orc's favorite repos", href: GH }],
  },
  sign_welcome: {
    title: "Town Notice Board",
    category: "guide",
    body: [
      "Welcome to Damian's world — a walkable portfolio.",
      "Anything with a floating gem holds a project; the gem's color is its category (see the legend). Pink hearts mark the work I cherish most. Walk up and press E.",
      "Other worlds await — press the WORLDS button to travel.",
    ],
  },
  sign_home: {
    title: "Signpost",
    category: "guide",
    body: ["« Damian's Studio — the architect lives (and drafts) here. »"],
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
      "The colored gems floating over buildings tell you what's inside — gold is the product castle, green means info. And there are other worlds! A dark keep, a neon city… press WORLDS to travel.",
    ],
  },
  npc_pirate: {
    title: "Pirate Girl",
    category: "guide",
    body: [
      "Looking for the architect himself? He ships everything to the open seas of GitHub. Or send a raven — er, an email.",
    ],
    links: [
      { label: "GitHub", href: GH },
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
  label?: string; // small floating label
  deco?: boolean; // no collision (wall decorations)
  light?: number; // night-world light halo radius in world px
}

export interface Warp {
  map: MapId;
  x: number;
  y: number;
  facing: Facing;
}

export interface NpcDef {
  id: string;
  // walker: 4-frame x 3-row 32px sheet; strip: single idle animation strip
  kind: "walker" | "strip";
  sheet: string; // char sheet key (kid, pirate, soldier, orc)
  x: number;
  y: number;
  dialog: string;
  wander: number; // radius in tiles, 0 = stationary (strips never wander)
  strip?: { frames: number; fw: number; fh: number; footY: number; flip?: boolean };
}

/** Door-zone on a scene map: interactable strip with a floating marker. */
export interface Zone {
  tx: number; // leftmost tile of the zone
  w: number; // width in tiles
  dialog: string;
  label: string;
  markerY: number; // world-px y for the marker/label (above the door)
}

export interface MapDef {
  id: MapId;
  w: number;
  h: number;
  theme: "interior" | "village" | "night" | "scene";
  // ground art for village/night themes: village grass+dirt (default) or
  // Pixel Crawler dark grass + brick roads
  ground?: "crawler";
  music: "cliffs" | "cyber";
  // walkable bounds (everything outside is solid)
  bounds: { x0: number; y0: number; x1: number; y1: number };
  dirt: [x: number, y: number, w: number, h: number][];
  objects: ObjPlace[];
  zones?: Zone[];
  warps: Record<string, Warp>; // "x,y" — triggered by stepping on or bumping into
  npcs: NpcDef[];
}

export const TOWN: MapDef = {
  id: "town",
  w: 42,
  h: 36,
  theme: "village",
  music: "cliffs",
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
    // flagship castle (south street)
    { sprite: "castle", tx: 14, ty: 24, dialog: "threatscaper" },
    // east side
    { sprite: "arena", tx: 28, ty: 24, dialog: "learning" },
    { sprite: "church", tx: 33, ty: 24, dialog: "talks" },
    { sprite: "temple", tx: 33, ty: 14, dialog: "about" },
    // plaza
    { sprite: "well", tx: 18, ty: 20, dialog: "blog" },
    // signposts
    { sprite: "sign", tx: 24, ty: 14, dialog: "sign_welcome", label: "WELCOME" },
    { sprite: "sign", tx: 17, ty: 14, dialog: "sign_home", label: "STUDIO" },
    { sprite: "sign", tx: 12, ty: 22, dialog: "sign_flagship", label: "FLAGSHIP" },
    // neighbor cottages
    { sprite: "house_a", tx: 25, ty: 14, dialog: "neighbor" },
    { sprite: "house_b", tx: 11, ty: 24, dialog: "neighbor" },
    { sprite: "house_a", tx: 7, ty: 14, dialog: "neighbor" },
    { sprite: "house_b", tx: 28, ty: 14, dialog: "neighbor" },
    // greenery — west side (where the old security quarter stood)
    { sprite: "tree", tx: 6, ty: 21 }, { sprite: "tree", tx: 11, ty: 13 },
    { sprite: "stump", tx: 7, ty: 27 }, { sprite: "bush1", tx: 10, ty: 19 },
    // greenery — north park
    { sprite: "tree", tx: 5, ty: 9 }, { sprite: "tree", tx: 15, ty: 8 },
    { sprite: "tree", tx: 36, ty: 9 }, { sprite: "bush1", tx: 11, ty: 9 },
    { sprite: "bush2", tx: 24, ty: 10 }, { sprite: "rock_b", tx: 32, ty: 8 },
    { sprite: "stump", tx: 17, ty: 9 },
    // mid-town greenery
    { sprite: "bush1", tx: 5, ty: 20 }, { sprite: "smalltree", tx: 37, ty: 21 },
    { sprite: "bush2", tx: 5, ty: 21 }, { sprite: "rock_s", tx: 37, ty: 19 },
    { sprite: "bush2", tx: 26, ty: 21 }, { sprite: "smalltree", tx: 30, ty: 17 },
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
    { id: "kid", kind: "walker", sheet: "kid", x: 24, y: 20, dialog: "npc_kid", wander: 2 },
    { id: "pirate", kind: "walker", sheet: "pirate", x: 31, y: 27, dialog: "npc_pirate", wander: 2 },
  ],
};

export const ROOM: MapDef = {
  id: "room",
  w: 13,
  h: 12,
  theme: "interior",
  music: "cliffs",
  bounds: { x0: 1, y0: 2, x1: 11, y1: 10 },
  dirt: [],
  objects: [
    // windows along the top wall
    { sprite: "window", tx: 4, ty: 1, deco: true },
    { sprite: "window", tx: 6, ty: 1, deco: true },
    { sprite: "window", tx: 8, ty: 1, deco: true },
    // workstation & storage against the top wall
    { sprite: "computer", tx: 2, ty: 3, dialog: "computer" },
    { sprite: "chest", tx: 5, ty: 2, dialog: "chest" },
    { sprite: "cabinet", tx: 9, ty: 2, dialog: "cabinet" },
    // wooden drafting desk (left) and bed (right)
    { sprite: "desk", tx: 2, ty: 6, dialog: "desk" },
    { sprite: "bed", tx: 8, ty: 6, dialog: "bed" },
    // decor
    { sprite: "vase", tx: 11, ty: 5 },
    { sprite: "plant", tx: 1, ty: 9 },
    { sprite: "coins", tx: 4, ty: 9 },
  ],
  warps: {
    // doormat at the bottom — step on it to leave the studio
    "6,11": { map: "town", x: 21, y: 15, facing: "down" },
    "6,10": { map: "town", x: 21, y: 15, facing: "down" },
  },
  npcs: [],
};

export const MEDIEVAL: MapDef = {
  id: "medieval",
  w: 30,
  h: 26,
  theme: "night",
  ground: "crawler",
  music: "cliffs",
  bounds: { x0: 2, y0: 4, x1: 27, y1: 22 },
  dirt: [
    // brick roads (crawler ground renders the mask as brick)
    [4, 13, 22, 2], // main road
    [14, 11, 2, 2], // keep approach
    [6, 11, 2, 2], // guild approach
    [24, 11, 2, 2], // archives approach
    [10, 16, 6, 3], // bonfire clearing
  ],
  objects: [
    // north row: guild hall, keep gatehouse, archives — all composed from
    // the Pixel Crawler walls/roofs/props + castle pieces
    { sprite: "guildhouse", tx: 2, ty: 10, dialog: "guild", label: "DRAFTING GUILD" },
    { sprite: "keep", tx: 11, ty: 10, dialog: "zerotrust", label: "THE KEEP", light: 44 },
    { sprite: "archhouse", tx: 21, ty: 10, dialog: "archives", label: "ARCHIVES" },
    { sprite: "torch", tx: 10, ty: 11, light: 30 },
    { sprite: "torch", tx: 20, ty: 11, light: 30 },
    // the forge (south-east of the road)
    { sprite: "smithy", tx: 17, ty: 17, dialog: "forge", label: "THE FORGE", light: 36 },
    // bonfire clearing (south-center)
    { sprite: "bonfire", tx: 12, ty: 17, dialog: "bonfire", light: 52 },
    // guild frontage
    { sprite: "bench", tx: 3, ty: 12 },
    { sprite: "planter", tx: 8, ty: 12 },
    // graveyard corner (south-east)
    { sprite: "grave", tx: 24, ty: 20 }, { sprite: "grave", tx: 26, ty: 21 },
    { sprite: "grave", tx: 25, ty: 19 }, { sprite: "pine_dead", tx: 26, ty: 18 },
    // boulders
    { sprite: "boulder", tx: 4, ty: 17 }, { sprite: "boulder2", tx: 23, ty: 15 },
    // pine forest border & scatter
    { sprite: "pine1", tx: 2, ty: 4 }, { sprite: "pine2", tx: 5, ty: 5 },
    { sprite: "pine1", tx: 8, ty: 4 }, { sprite: "pine2", tx: 15, ty: 5 },
    { sprite: "pine1", tx: 18, ty: 4 }, { sprite: "pine2", tx: 22, ty: 4 },
    { sprite: "pine1", tx: 25, ty: 5 }, { sprite: "pine2", tx: 2, ty: 16 },
    { sprite: "pine1", tx: 2, ty: 22 }, { sprite: "pine2", tx: 6, ty: 21 },
    { sprite: "pine1", tx: 10, ty: 22 }, { sprite: "pine2", tx: 14, ty: 21 },
    { sprite: "pine1", tx: 18, ty: 22 }, { sprite: "pine2", tx: 27, ty: 13 },
    { sprite: "pine_dead", tx: 27, ty: 9 },
  ],
  warps: {},
  npcs: [
    {
      id: "soldier", kind: "strip", sheet: "soldier", x: 14, y: 12,
      dialog: "npc_soldier", wander: 0,
      strip: { frames: 6, fw: 100, fh: 100, footY: 70 },
    },
    {
      id: "orc", kind: "strip", sheet: "orc", x: 14, y: 18,
      dialog: "npc_orc", wander: 0,
      strip: { frames: 6, fw: 100, fh: 100, footY: 70, flip: true },
    },
  ],
};

export const CYBER: MapDef = {
  id: "cyber",
  w: 38, // 608px scene / 16
  h: 12, // 192px
  theme: "scene",
  music: "cyber",
  bounds: { x0: 1, y0: 10, x1: 36, y1: 11 },
  dirt: [],
  objects: [],
  zones: [
    { tx: 1, w: 3, dialog: "soar", label: "SOC BAR", markerY: 118 },
    { tx: 8, w: 3, dialog: "aws", label: "WATCHPOINT", markerY: 108 },
    { tx: 15, w: 3, dialog: "chipnemo", label: "AI LAB", markerY: 112 },
    { tx: 19, w: 2, dialog: "c2club", label: "C2 CLUB", markerY: 118 },
    { tx: 32, w: 3, dialog: "threatscaper", label: "THREATSCAPER", markerY: 112 },
  ],
  warps: {},
  npcs: [],
};

export const MAPS: Record<MapId, MapDef> = {
  town: TOWN,
  room: ROOM,
  medieval: MEDIEVAL,
  cyber: CYBER,
};

/* ── world registry (home-screen picker) ──────────────────── */

export interface World {
  id: WorldId;
  name: string;
  focus: string; // what this world showcases, shown on the picker button
  color: string;
  spawn: { map: MapId; x: number; y: number; facing: Facing };
}

export const WORLDS: World[] = [
  {
    id: "village",
    name: "PIXEL VILLAGE",
    focus: "Product · Talks · Blog · About",
    color: "#a3e635",
    spawn: { map: "room", x: 6, y: 6, facing: "down" },
  },
  {
    id: "medieval",
    name: "MIDNIGHT KEEP",
    focus: "Architecture & System Design",
    color: "#67e8f9",
    spawn: { map: "medieval", x: 14, y: 14, facing: "up" },
  },
  {
    id: "cyber",
    name: "NEON CITY",
    focus: "Hacking · AI · Security Ops",
    color: "#f472b6",
    spawn: { map: "cyber", x: 3, y: 11, facing: "right" },
  },
];

export const MUSIC_SRC: Record<MapDef["music"], string> = {
  cliffs: "/game/music.ogg",
  cyber: "/game/cyber-music.ogg",
};
