/**
 * Invariant 11: spell behaviour uses explicit metadata, never name heuristics.
 * Invariant 12: decided legal kit casts and executable casts must agree.
 *
 * `pickBossKitSpell` always receives `new Map()`, so the first phase-pool id
 * is decided every turn. Live WorldExploration boss-kit apply (~15813) then
 * skips the regular-enemy `inRange` gate (~16451) and applies
 * `playerTakesDamage` / DoT / debuff from any Chebyshev distance.
 *
 * First-ids this leftover actually fires:
 * - Bone Cavalier / Weeping Pawn / Final Pawn / Alabaster Fortress:
 *   `physical_attack` (Strike, range 1)
 * - Crimson Countess: `spell-inferno` (range 3)
 * - Pale Archbishop / Midnight Bishop / Chessboard Lich / Pale Archivist:
 *   `spell-cursed-wound` (range 3)
 * - Fetid Rook: `spell-venom-strike` (range 2)
 * - Eternal Pawn King: `spell-slow` (range 3)
 * - Starved Vampire Pawn: `starter-drain` (range 2)
 *
 * A decided Strike at Chebyshev 2 therefore damages the player (map-wide)
 * and Bone Cavalier never reaches KNIGHT_JUMP. Unique vs:
 * - #868 Chain Lightning bounce (range is only that sidecar's bounce gate)
 * - #417 regular-enemy `Number(range)` (WX ~16451)
 * - #498 kit aim dest (position commit after the hit)
 * - #843 buffStat / #850 Swap / #851 Mark / #852 Mirror / #857 heal+buff
 * - #856 summon DoT / #865 summon kit buffStat
 *
 * Sidecar only. Do not restack WX / useBossAI / targeting / spellEngine.
 * Restack WX kit apply onto `canExecuteBossKitRangedPrimary` after those
 * PRs land. Chebyshev vs `Number(spell.range)` — same as WX enemy
 * `inRange`, no LoS. Do not switch to `spellRangeBase` (would rebalance).
 */

export type BossKitRangedPrimarySpell = {
  id?: string;
  damage?: unknown;
  range?: unknown;
  spellType?: string | null;
  targetType?: string | null;
  hitsMultiple?: boolean;
  bounces?: unknown;
  debuffStat?: string | null;
  debuffDuration?: unknown;
  dotDamage?: unknown;
  dotDamagePerTurn?: unknown;
  buffStat?: string | null;
  isSummon?: boolean;
  isSwap?: boolean;
  isMark?: boolean;
  isMirror?: boolean;
  isBarrier?: boolean;
  isTimestep?: boolean;
  isSacrifice?: boolean;
};

export type BossKitRangedPrimaryCell = {
  x: number;
  y: number;
};

function toNat(n: unknown, fallback = 0): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

/** Same Chebyshev the regular-enemy `inRange` gate uses (WX ~16451). */
export function bossKitRangedPrimaryChebyshev(
  from: BossKitRangedPrimaryCell,
  to: BossKitRangedPrimaryCell,
): number {
  return Math.max(Math.abs(from.x - to.x), Math.abs(from.y - to.y));
}

function isOwnedKitSpecial(spell: BossKitRangedPrimarySpell): boolean {
  if (spell.isSummon === true) return true;
  if (spell.isSwap === true) return true;
  if (spell.isMark === true) return true;
  if (spell.isMirror === true) return true;
  if (spell.isBarrier === true) return true;
  if (spell.isTimestep === true) return true;
  if (spell.isSacrifice === true) return true;
  // #868 owns hitsMultiple + bounces. Frost Nova / Lifesteal Nova are
  // hitsMultiple without being first-id — do not steal their AoE either.
  if (spell.hitsMultiple === true) return true;
  return false;
}

/**
 * Catalog first-id damage / DoT / debuff / drain aimed at an enemy.
 * `spellType === "damage"` is the live Inferno / Slow / Strike shape —
 * do not require `spellType === "debuff"`. Do not key off display names.
 */
export function isBossKitRangedPrimarySpell(
  spell: BossKitRangedPrimarySpell | null | undefined,
): boolean {
  if (!spell) return false;
  if (isOwnedKitSpecial(spell)) return false;
  const spellType = spell.spellType ?? "damage";
  if (spellType === "heal" || spellType === "summon") return false;
  const targetType = spell.targetType ?? "enemy";
  if (
    targetType === "self" ||
    targetType === "ally" ||
    targetType === "ground"
  ) {
    return false;
  }
  const hasDamage = toNat(spell.damage) > 0;
  const hasDot =
    toNat(spell.dotDamage) > 0 || toNat(spell.dotDamagePerTurn) > 0;
  const hasDebuff =
    Boolean(spell.debuffStat) && toNat(spell.debuffDuration) > 0;
  const isDrain = spellType === "drain";
  if (!hasDamage && !hasDot && !hasDebuff && !isDrain) return false;
  return true;
}

export function bossKitRangedPrimaryInRange(args: {
  spell: BossKitRangedPrimarySpell | null | undefined;
  from: BossKitRangedPrimaryCell;
  to: BossKitRangedPrimaryCell;
}): boolean {
  if (!isBossKitRangedPrimarySpell(args.spell)) return false;
  const range = toNat(args.spell?.range);
  return bossKitRangedPrimaryChebyshev(args.from, args.to) <= range;
}

export function canExecuteBossKitRangedPrimary(args: {
  spell: BossKitRangedPrimarySpell | null | undefined;
  from: BossKitRangedPrimaryCell;
  to: BossKitRangedPrimaryCell;
}): boolean {
  return bossKitRangedPrimaryInRange(args);
}

/** Alias so decide and the WX kit apply cannot fork. */
export function shouldDecideBossKitRangedPrimary(
  args: Parameters<typeof canExecuteBossKitRangedPrimary>[0],
): boolean {
  return canExecuteBossKitRangedPrimary(args);
}

export function bossKitRangedPrimaryHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Live WX kit apply (~15860): no `inRange` check. Any decided first-id
 * damage/DoT/debuff/drain lands even when Chebyshev > `range`.
 */
export function liveBossKitRangedPrimaryApplies(
  spell: BossKitRangedPrimarySpell | null | undefined,
): boolean {
  return isBossKitRangedPrimarySpell(spell);
}
