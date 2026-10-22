/**
 * Invariant 11: spell behaviour uses explicit metadata, never name heuristics.
 * Invariant 12: decided legal kit casts and executable casts must agree.
 *
 * `pickBossKitSpell` always receives `new Map()`, so the first phase-pool id
 * is decided every turn. Broodmother Rook phase 1 first-id is
 * `summon-archer` (`isSummon`, `targetType: "ground"`, `range: 2`).
 * `decideBroodmotherRookAction` then sets `targetX`/`targetY` to the player
 * tile. Live WorldExploration kit apply (~15828) short-circuits summons
 * before regular-enemy `inRange` (~16451) and calls
 * `spawnEnemySummonRef(bossSpellDest, bossSpell)` on that player dest.
 *
 * Occupancy then snaps off the occupied player cell to the nearest free
 * tile around the player (`summonSpawn.ts`), so the larval archer can
 * appear map-wide. Advertised Manhattan ground range 2 from the boss is
 * never consulted. Empty cooldown Map means Venom / Iron Skin / larvae
 * abilities never become first-id.
 *
 * Unique vs:
 * - #888 ranged-primary Chebyshev (`isSummon` excluded)
 * - #868 Chain Lightning bounce
 * - #498 kit aim dest-as-walk (summon short-circuit returns before
 *   `updateCombatant({ x: dest })`)
 * - #417 regular-enemy `Number(range)`
 * - `decideSummonerAction` midpoint dest (regular summoner, cap + cooldown)
 * - #711 / occupancy spawn snap (portal-as-floor; not a range gate)
 * - #861 auto-summon empty `spells`
 *
 * Sidecar only. Do not restack WX / useBossAI / targeting / summonSpawn /
 * spellEngine. Restack WX kit summon apply onto `canExecuteBossKitSummon`
 * after those PRs land. Ground range is Manhattan vs `Number(spell.range)`
 * — same as player `targetType: "ground"` (`groundTileInRange` without
 * `diagonal`). Do not switch to Chebyshev / `spellRangeBase` (would
 * rebalance player summon tiles and #888). No LoS.
 */

export type BossKitSummonSpell = {
  id?: string;
  range?: unknown;
  spellType?: string | null;
  targetType?: string | null;
  diagonal?: boolean;
  isSummon?: boolean;
  summonUnitDef?: unknown;
  hitsMultiple?: boolean;
  bounces?: unknown;
  damage?: unknown;
  debuffStat?: string | null;
  buffStat?: string | null;
  isSwap?: boolean;
  isMark?: boolean;
  isMirror?: boolean;
  isBarrier?: boolean;
  isTimestep?: boolean;
  isSacrifice?: boolean;
};

export type BossKitSummonCell = {
  x: number;
  y: number;
};

function toNat(n: unknown, fallback = 0): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

/** Same Manhattan player ground targeting uses (`groundTileInRange`). */
export function bossKitSummonManhattan(
  from: BossKitSummonCell,
  to: BossKitSummonCell,
): number {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

export function bossKitSummonChebyshev(
  from: BossKitSummonCell,
  to: BossKitSummonCell,
): number {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

function isOwnedNonSummonKitSpecial(spell: BossKitSummonSpell): boolean {
  if (spell.isSwap === true) return true;
  if (spell.isMark === true) return true;
  if (spell.isMirror === true) return true;
  if (spell.isBarrier === true) return true;
  if (spell.isTimestep === true) return true;
  if (spell.isSacrifice === true) return true;
  if (spell.hitsMultiple === true) return true;
  return false;
}

/**
 * Catalog first-id summon. `isSummon` / `spellType === "summon"` is the
 * live Archer / Dire Wolf / Wisp shape — do not require the display name.
 */
export function isBossKitSummonSpell(
  spell: BossKitSummonSpell | null | undefined,
): boolean {
  if (!spell) return false;
  if (isOwnedNonSummonKitSpecial(spell)) return false;
  if (spell.isSummon === true) return true;
  return (spell.spellType ?? "") === "summon";
}

export function isBossKitSummonDestOccupied(
  dest: BossKitSummonCell,
  occupied: ReadonlyArray<BossKitSummonCell>,
): boolean {
  return occupied.some((cell) => cell.x === dest.x && cell.y === dest.y);
}

/**
 * Advertised ground range. Honor `diagonal` the way `groundTileInRange`
 * does; catalog Archer has no diagonal flag (Manhattan).
 */
export function bossKitSummonInRange(args: {
  spell: BossKitSummonSpell | null | undefined;
  from: BossKitSummonCell;
  to: BossKitSummonCell;
}): boolean {
  if (!isBossKitSummonSpell(args.spell)) return false;
  const range = toNat(args.spell?.range);
  if (args.spell?.diagonal === true) {
    return bossKitSummonChebyshev(args.from, args.to) <= range;
  }
  return bossKitSummonManhattan(args.from, args.to) <= range;
}

export function canExecuteBossKitSummon(args: {
  spell: BossKitSummonSpell | null | undefined;
  from: BossKitSummonCell;
  to: BossKitSummonCell;
  occupied?: ReadonlyArray<BossKitSummonCell>;
}): boolean {
  if (!isBossKitSummonSpell(args.spell)) return false;
  const occupied = args.occupied ?? [];
  if (isBossKitSummonDestOccupied(args.to, occupied)) return false;
  return bossKitSummonInRange({
    spell: args.spell,
    from: args.from,
    to: args.to,
  });
}

/** Alias so decide and the WX kit summon apply cannot fork. */
export function shouldDecideBossKitSummon(
  args: Parameters<typeof canExecuteBossKitSummon>[0],
): boolean {
  return canExecuteBossKitSummon(args);
}

export function bossKitSummonHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Live WX kit apply (~15828): summon short-circuit has no range / empty-
 * ground check. First-id Archer dest is the player tile; occupancy snaps
 * near the player even when Manhattan > `range`.
 */
export function liveBossKitSummonApplies(
  spell: BossKitSummonSpell | null | undefined,
): boolean {
  return isBossKitSummonSpell(spell);
}
