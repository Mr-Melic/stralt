/**
 * Boss kit damage/drain casts skip advertised Paper Windstorm miss.
 *
 * Advertised (Motoko `defaultMapModifiers` / `admin.mo` types):
 *   "Ranged spells further than 1 tile away have a 50% chance to miss."
 * Pack CAST (~16491) and pack Fire Bolt fallback (~16729) already gate
 * `isPaperWindstorm && spellRange > 1` then `Math.random() < 0.5`.
 *
 * Live WorldExploration kit apply (~15859–15867):
 *   bRawDmg = Number(bossSpell.damage)
 *   playerTakesDamage(bRawDmg)  // RES only; never reads isPaperWindstorm
 *   Cursed Wound 22 always lands. Pack CAST of the same spell can miss.
 *
 * `pickBossKitSpell` always receives `new Map()`, so Pale Archbishop /
 * Midnight Bishop / Chessboard Lich / Pale Archivist phase 1 first-id
 * `spell-cursed-wound` (Cursed Wound 22, range 3) is decided every turn.
 * Kit apply skips the pack miss gate. Player 30% Strike miss is **#1042**.
 *
 * Sequence: Paper Windstorm map, Pale Archbishop kit Cursed Wound raw 22
 * vs player RES 0 / HP 100 at Chebyshev 2, roll 0.0 (guaranteed miss).
 *
 * | | Expected | Actual (live) |
 * |---|---|---|
 * | miss | pack 50% / Motoko 50% | never rolled |
 * | player HP | 100 | RES-only hit → 78 |
 *
 * Unique vs **#1042** (player Strike 30% without a range gate; enemy pack
 * apply already had this 50% band), **#888** (kit range skip — Chebyshev
 * vs catalog range, not a miss roll), **#1266** (kit Mirror reflect),
 * **#1262** (kit SR soak once the hit lands), **#868** (hitsMultiple
 * bounce), **#1104** (kit CHC / kit SP). Do not add `chc` / `sr` /
 * `heal` / `roll` / `glass` / `bounces` / `mirrorConsumed`.
 *
 * Do not restack WorldExploration / spellEngine / useBossAI / enemyAI /
 * paperWindstormRangeMiss. Restack the kit damage arm onto
 * `executeBossKitPaperWindstormMiss` after those PRs land (skip
 * `playerTakesDamage` when this returns `missed: true`). Do not undo
 * pack CAST miss, player 30%, kit Mirror, or kit SR soak.
 */

export const PAPER_WINDSTORM_MODIFIER_ID = "paper_windstorm";

/** Catalog Cursed Wound — Pale Archbishop / Midnight Bishop / Lich / Archivist first-id. */
export const BOSS_KIT_PAPER_WINDSTORM_FIRE_SPELL_ID = "spell-cursed-wound";

export const BOSS_KIT_PAPER_WINDSTORM_FIRE_DAMAGE = 22;

export const BOSS_KIT_PAPER_WINDSTORM_FIRE_RANGE = 3;

/** Motoko / pack CAST miss rate. Player damage-loop stays 30% (**#1042**). */
export const BOSS_KIT_PAPER_WINDSTORM_MISS_CHANCE = 0.5;

export type BossKitPaperWindstormMissExecute = {
  missed: true;
  playerHpAfter: number;
  playerDied: boolean;
};

export type BossKitPaperWindstormMissArgs = {
  /** `activeMapModifierTypes.has("paper_windstorm")`. */
  modifierActive: boolean;
  /** Catalog `damage` before soak (`bRawDmg`). */
  rawDamage: number;
  playerHp: number;
  /**
   * Physical / melee soak is RES-only and is not advertised as a "spell".
   * Kit `physical_attack` first-ids — leave (range 1 also fails the miss band).
   */
  isSpell: boolean;
  /** Chebyshev from boss to the aimed player tile. */
  chebyshev: number;
  /** Catalog `range`. Kit apply skips `inRange`; this sidecar uses it as the execute gate only. */
  range: number;
  /**
   * `[0, 1)` from `Math.random`. Pack CAST misses when `< 0.5`.
   * This leftover only fires on an advertised miss.
   */
  roll01: number;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function finitePct(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Catalog `spell.range` as a tile count. BigInt bindgen values and missing
 * range fail closed (melee / no miss) — same band as pack CAST `> 1`.
 */
export function bossKitPaperWindstormSpellRange(range: unknown): number {
  if (typeof range === "bigint") {
    const n = Number(range);
    return Number.isFinite(n) ? Math.floor(n) : 0;
  }
  const n = Number(range);
  if (!Number.isFinite(n)) return 0;
  return Math.floor(n);
}

/** True when Motoko / pack CAST allow the 50% miss roll (`spellRange > 1`). */
export function bossKitPaperWindstormSpellRangeCanMiss(
  range: unknown,
): boolean {
  return bossKitPaperWindstormSpellRange(range) > 1;
}

export function isPaperWindstormModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === PAPER_WINDSTORM_MODIFIER_ID;
}

/**
 * Live WX kit damage arm: `playerTakesDamage(raw)` applies player RES only
 * and never rolls Paper Windstorm. Proven by the source scan in the test file.
 */
export function liveWxBossKitPaperWindstormHit(
  rawDamage: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function liveWxBossKitSpellRollsPaperWindstormMiss(): boolean {
  return false;
}

export function canExecuteBossKitPaperWindstormMiss(
  args: BossKitPaperWindstormMissArgs,
): boolean {
  if (args.modifierActive !== true) return false;
  if (args.isSpell !== true) return false;
  if (!bossKitPaperWindstormSpellRangeCanMiss(args.range)) return false;
  if (finiteNonNeg(args.chebyshev) > finiteNonNeg(args.range)) return false;
  if (finiteNonNeg(args.rawDamage) <= 0) return false;
  if (!Number.isFinite(args.roll01)) return false;
  if (args.roll01 < 0 || args.roll01 >= 1) return false;
  return args.roll01 < BOSS_KIT_PAPER_WINDSTORM_MISS_CHANCE;
}

/** Alias so decide and the cast restack cannot fork. */
export function shouldDecideBossKitPaperWindstormMiss(
  args: BossKitPaperWindstormMissArgs,
): boolean {
  return canExecuteBossKitPaperWindstormMiss(args);
}

export function bossKitPaperWindstormHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

export function executeBossKitPaperWindstormMiss(
  args: BossKitPaperWindstormMissArgs,
): BossKitPaperWindstormMissExecute | null {
  if (!canExecuteBossKitPaperWindstormMiss(args)) return null;
  const playerHp = finiteNonNeg(args.playerHp);
  return {
    missed: true,
    playerHpAfter: playerHp,
    playerDied: false,
  };
}
