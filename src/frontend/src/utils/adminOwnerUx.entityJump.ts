/**
 * Owner quick-entity search / command-palette index.
 *
 * Per-list search exists; there is no ⌘K across the 15 live tabs.
 * Index only tabs that exist today — never Challenges / AI / Formations /
 * Dungeons / Telemetry. Not wired (stack; HUMAN_APPROVAL_REQUIRED).
 */

export type OwnerJumpTab =
  | "enemies"
  | "regions"
  | "sprites"
  | "spells"
  | "modifiers"
  | "tiers"
  | "visuals"
  | "settings"
  | "purchases"
  | "achievements"
  | "names"
  | "bosses"
  | "ads"
  | "shop"
  | "bossRush";

export type OwnerJumpHit = {
  tab: OwnerJumpTab;
  id: string;
  name: string;
  kind: "tab" | "entity";
};

const LIVE_TAB_LABELS: ReadonlyArray<{ tab: OwnerJumpTab; name: string }> = [
  { tab: "enemies", name: "Enemies" },
  { tab: "regions", name: "Regions" },
  { tab: "sprites", name: "Player Sprites" },
  { tab: "spells", name: "Spells" },
  { tab: "modifiers", name: "Map Modifiers" },
  { tab: "tiers", name: "Enemy Tiers" },
  { tab: "visuals", name: "Visuals" },
  { tab: "settings", name: "Settings" },
  { tab: "purchases", name: "Purchases" },
  { tab: "achievements", name: "Achievements" },
  { tab: "names", name: "Enemy Names" },
  { tab: "bosses", name: "Bosses" },
  { tab: "ads", name: "Ad Boxes" },
  { tab: "shop", name: "Shop" },
  { tab: "bossRush", name: "Boss Rush" },
];

const FORBIDDEN_TABS = [
  "challenges",
  "ai",
  "formations",
  "dungeons",
  "telemetry",
  "overview",
  "health",
] as const;

export type OwnerJumpCatalogs = {
  enemies?: ReadonlyArray<{ id: string; name?: string }>;
  regions?: ReadonlyArray<{ id: string; name?: string }>;
  sprites?: ReadonlyArray<{ id: string; name?: string }>;
  spells?: ReadonlyArray<{ id: string; name?: string }>;
  modifiers?: ReadonlyArray<{ id: string; name?: string }>;
  achievements?: ReadonlyArray<{ id: string; name?: string }>;
  names?: readonly string[];
  bosses?: ReadonlyArray<{ id: string; name?: string }>;
};

function entityHits(
  tab: OwnerJumpTab,
  rows: ReadonlyArray<{ id: string; name?: string }> | undefined,
): OwnerJumpHit[] {
  if (!rows) return [];
  return rows
    .filter((row) => (row.id ?? "").trim().length > 0)
    .map((row) => ({
      tab,
      id: row.id,
      name: (row.name ?? "").trim() || row.id,
      kind: "entity" as const,
    }));
}

export function buildOwnerJumpIndex(
  catalogs: OwnerJumpCatalogs = {},
): OwnerJumpHit[] {
  const tabs: OwnerJumpHit[] = LIVE_TAB_LABELS.map((t) => ({
    tab: t.tab,
    id: t.tab,
    name: t.name,
    kind: "tab",
  }));
  const entities: OwnerJumpHit[] = [
    ...entityHits("enemies", catalogs.enemies),
    ...entityHits("regions", catalogs.regions),
    ...entityHits("sprites", catalogs.sprites),
    ...entityHits("spells", catalogs.spells),
    ...entityHits("modifiers", catalogs.modifiers),
    ...entityHits("achievements", catalogs.achievements),
    ...entityHits("bosses", catalogs.bosses),
    ...(catalogs.names ?? [])
      .filter((n) => n.trim().length > 0)
      .map((n) => ({
        tab: "names" as const,
        id: n,
        name: n,
        kind: "entity" as const,
      })),
  ];
  return [...tabs, ...entities];
}

export function queryOwnerJumpIndex(
  hits: readonly OwnerJumpHit[],
  query: string,
): OwnerJumpHit[] {
  const n = query.trim().toLowerCase();
  if (!n) return [...hits];
  return hits.filter(
    (hit) =>
      hit.id.toLowerCase().includes(n) ||
      hit.name.toLowerCase().includes(n) ||
      hit.tab.toLowerCase().includes(n),
  );
}

export function ownerJumpHasForbiddenTabs(
  hits: readonly OwnerJumpHit[],
): boolean {
  return hits.some((hit) =>
    (FORBIDDEN_TABS as readonly string[]).includes(hit.tab),
  );
}
