/**
 * Boss-kit execute vs advertised caster occupancy after a kit spell.
 *
 * Occupancy (`occupancy.ts`) is the single source of truth for position
 * changes: one combatant per tile. Player Swap (`spellEngine` `isSwap`)
 * exchanges caster and target cells. Attraction stops one tile short so
 * two combatants never stack.
 *
 * Live leftover — execute. `pickBossKitSpell` always receives
 * `new Map()`, so Enthroned Void phase-1 first-id Swap (`spell-swap`)
 * and Twin Monarchs first-id Rallying Cry (`spell-rallying-cry`) are
 * decided every turn with `targetX/Y = player`. WorldExploration kit
 * apply (~16005) then `updateCombatant(enemyId, { x: bossSpellDest.x,
 * y: bossSpellDest.y })` for every non-summon kit spell. Dest is the
 * player cell. The player never moves. Units stack.
 *
 * Swap advertised: exchange cells (`isSwap` / "Teleport caster and
 * target to each other's cells"). Rallying Cry / Cursed Wound advertised:
 * apply the effect and keep the caster put. Live: caster relocates onto
 * the dest whether or not `isSwap` is set. Summon short-circuit returns
 * before this dest write (#910 owns spawn-at-dest, not caster relocate).
 *
 * Sequence: Enthroned Void kit Swap (or Twin Monarchs Rallying Cry) →
 * advertised separate cells, live both on the player tile.
 *
 * Unique leftover of **#1159** (kit-first Swap shadows PHANTOM_SPAWN)
 * and **#1164** (kit-first Swap shadows AP_DRAIN_PASSIVE) — those lock
 * decide, not the dest write. Unique vs:
 * - **#1159** Phantom spawn decide
 * - **#1164** AP drain decide
 * - **#910** kit summon range 2 / spawn dest (summon short-circuit)
 * - **#1269** Broodmother Archer cap / cooldown
 * - occupancy leftover-crumb unseals (#1265 Turnstile, #1275 Twin Sparks)
 *
 * Do not restack WorldExploration / useBossAI / spellEngine / occupancy.
 * Restack the kit apply tail onto `executeBossKitCasterOccupancyAfterCast`
 * after older combat PRs land. Do not change Swap range/cost (balance).
 */

export const ENTHRONED_VOID_ID = "enthroned_void";

/** Phase-1 and phase-2 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const ENTHRONED_VOID_KIT_FIRST_ID = "spell-swap";

export const TWIN_MONARCHS_ID = "twin_monarchs";

/** Phase-1 and phase-2 first kit id. */
export const TWIN_MONARCHS_KIT_FIRST_ID = "spell-rallying-cry";

export const PALE_ARCHBISHOP_ID = "pale_archbishop";

export const PALE_ARCHBISHOP_KIT_FIRST_ID = "spell-cursed-wound";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const AP_DRAIN_PASSIVE_ABILITY = "AP_DRAIN_PASSIVE";

/** #910 leftover — spawn dest, not this caster dest write. */
export const BOSS_KIT_SUMMON_DEST_LEFTOVER_ID = "summon-archer";

export type OccupancyCell = {
  x: number;
  y: number;
};

export type BossKitCasterOccupancyArgs = {
  caster: OccupancyCell;
  /** Kit dest — live decide always stamps the player cell. */
  dest: OccupancyCell;
  isSwap: boolean;
};

export type BossKitCasterOccupancyAfterCast = {
  caster: OccupancyCell;
  target: OccupancyCell;
  stacked: boolean;
};

export function occupancyCellKey(cell: OccupancyCell): string {
  return `${cell.x},${cell.y}`;
}

export function occupancyCellsEqual(
  a: OccupancyCell,
  b: OccupancyCell,
): boolean {
  return a.x === b.x && a.y === b.y;
}

export function combatantsShareCell(
  a: OccupancyCell,
  b: OccupancyCell,
): boolean {
  return occupancyCellsEqual(a, b);
}

function cloneCell(cell: OccupancyCell): OccupancyCell {
  return { x: cell.x, y: cell.y };
}

function occupancyAfter(
  caster: OccupancyCell,
  target: OccupancyCell,
): BossKitCasterOccupancyAfterCast {
  return {
    caster: cloneCell(caster),
    target: cloneCell(target),
    stacked: combatantsShareCell(caster, target),
  };
}

/**
 * Live WX kit apply (~16005): write caster x/y to `bossSpellDest`
 * (the player cell) and leave the player put.
 */
export function liveWxBossKitCasterOccupancyAfterCast(
  args: BossKitCasterOccupancyArgs,
): BossKitCasterOccupancyAfterCast {
  return occupancyAfter(args.dest, args.dest);
}

/**
 * Advertised occupancy. Swap exchanges cells. Every other kit spell
 * keeps the caster and the dest occupant where they started.
 */
export function executeBossKitCasterOccupancyAfterCast(
  args: BossKitCasterOccupancyArgs,
): BossKitCasterOccupancyAfterCast {
  if (args.isSwap === true) {
    return occupancyAfter(args.dest, args.caster);
  }
  return occupancyAfter(args.caster, args.dest);
}

/** Alias so decide-vs-apply cannot fork the advertised occupancy. */
export function advertisedBossKitCasterOccupancyAfterCast(
  args: BossKitCasterOccupancyArgs,
): BossKitCasterOccupancyAfterCast {
  return executeBossKitCasterOccupancyAfterCast(args);
}

/** Live leftover: non-summon kit apply always relocates the caster to dest. */
export function wxBossKitSpellRelocatesCasterToDest(): boolean {
  return true;
}

/**
 * Summon short-circuit returns before the dest write. Spawn-at-dest is
 * #910; this leftover is caster relocate on Swap / Rallying Cry / Wound.
 */
export function liveWxBossKitSummonShortCircuitRelocatesCaster(): boolean {
  return false;
}

export function liveWxBossKitSwapExchangesCells(): boolean {
  return false;
}

export function playerSwapExchangesCells(): boolean {
  return true;
}

export function occupancyEngineForbidsCombatantStack(): boolean {
  return true;
}
