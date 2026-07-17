/**
 * progression.ts — single source of truth for level-derived stats.
 *
 * Three pure functions compute the base stat budgets for the three combatant
 * classes (player, enemy, summon) from a level/spell-level input. The formulas
 * are moved VERBATIM from their original modules (combatMath.ts, summonSpawn.ts)
 * so the values do not change; the original modules retain their exports and
 * delegate here (wiring is a separate task — this file only defines the
 * canonical computations).
 *
 *   getPlayerBaseStats(level, levelUpConfig?)  → { ap, mp, hp }
 *   getEnemyBaseStats(level, pieceType)        → { sp, sr, init, res, chc }
 *   getSummonBaseStats(spellLevel, unitDef, summonAI)
 *                                              → { maxHp, maxAp, maxMp, turnsRemaining }
 *
 * No call sites are wired in this module — it is the source of truth only.
 */

import {
  PLAYER_BASE_AP,
  PLAYER_BASE_MP,
  SUMMON_AP,
  SUMMON_AP_PER_LEVELS,
  SUMMON_BASE_HP,
  SUMMON_BASE_HP_DEFAULT,
  SUMMON_BASE_LIFESPAN,
  SUMMON_HP_PER_LEVEL_PCT,
  SUMMON_LIFESPAN_PER_HALF_LEVEL,
  SUMMON_MP,
  SUMMON_MP_PER_LEVELS,
} from "../data/gameConstants";
import type { ChessPieceType, LevelUpConfig } from "../types/gameTypes";
import { seededRng } from "./combatMath";
import type { SummonUnitDef } from "./summonSpawn";

// ── Player base stats ─────────────────────────────────────────────────────────

/**
 * Base stat budget for a player character at a given level.
 *
 *   AP starts at PLAYER_BASE_AP (=8) and MP at PLAYER_BASE_MP (=4). These are
 *   floors — the returned values are never below 8 / 4 respectively.
 *
 *   When a LevelUpConfig is provided, its per-level growth knobs ADD to the
 *   base:
 *     - apMpGrowthEveryNLevels (default 25): +1 AP and +1 MP every N levels.
 *     - statGrowthPercent (default 5): HP grows by this percent per level
 *       (compounding on a base of 100). HP has no floor beyond the base.
 *
 *   Absent config (undefined), the base applies with no growth: AP=8, MP=4,
 *   HP=100 at every level.
 *
 * The config ADDS to the base; the base is the floor. This matches the
 * user-instruction "PLAYER_BASE_AP=8, PLAYER_BASE_MP=4 as floors (never
 * below)" and "Formula wins over persisted character values for battle
 * initialization when they diverge".
 */
export function getPlayerBaseStats(
  level: number,
  levelUpConfig?: LevelUpConfig,
): { ap: number; mp: number; hp: number } {
  const lvl = Math.max(1, Math.floor(level));

  // AP / MP — base is the floor; config growth adds on top.
  const apGrowthEvery = levelUpConfig?.apMpGrowthEveryNLevels;
  const apGrowth =
    apGrowthEvery && apGrowthEvery > 0 ? Math.floor(lvl / apGrowthEvery) : 0;
  const mpGrowth = apGrowth; // same cadence — +1 AP and +1 MP every N levels

  const ap = Math.max(PLAYER_BASE_AP, PLAYER_BASE_AP + apGrowth);
  const mp = Math.max(PLAYER_BASE_MP, PLAYER_BASE_MP + mpGrowth);

  // HP — base 100, grows by statGrowthPercent per level (compounding) when
  // a config is provided. Absent config, HP stays at the base 100.
  const growthPct = levelUpConfig?.statGrowthPercent;
  const hp =
    growthPct && growthPct > 0
      ? Math.round(100 * (1 + growthPct / 100) ** (lvl - 1))
      : 100;

  return { ap, mp, hp };
}

// ── Enemy base stats ─────────────────────────────────────────────────────────

/**
 * Per-piece multiplier table for the five derived enemy stats. Moved VERBATIM
 * from computeEnemyStats (combatMath.ts lines 120-172). Same values, same keys.
 */
const ENEMY_PIECE_MULTIPLIERS: Record<
  ChessPieceType,
  { sp: number; sr: number; init: number; res: number; chc: number }
> = {
  pawn: {
    sp: 0.85,
    sr: 0.85,
    init: 0.85,
    res: 0.85,
    chc: 0.85,
  },
  rook: {
    sp: 0.8,
    sr: 1.2,
    init: 1.1,
    res: 1.35,
    chc: 0.7,
  },
  knight: {
    sp: 0.85,
    sr: 1.15,
    init: 1.2,
    res: 1.25,
    chc: 0.8,
  },
  bishop: {
    sp: 1.3,
    sr: 0.85,
    init: 1.0,
    res: 0.7,
    chc: 1.2,
  },
  queen: {
    sp: 1.25,
    sr: 0.9,
    init: 1.1,
    res: 0.75,
    chc: 1.15,
  },
  king: {
    sp: 1.0,
    sr: 1.0,
    init: 1.0,
    res: 1.0,
    chc: 1.0,
  },
};

/**
 * Level-derived enemy stat baselines: { sp, sr, init, res, chc }.
 *
 * This wraps the level-derived portion of computeEnemyStats (combatMath.ts
 * lines 109-185). The roll formulas, piece multipliers, and seeded RNG are
 * moved VERBATIM — no values change. The original computeEnemyStats export
 * keeps its signature so existing callers are unaffected; it should delegate
 * to this function (wiring is a separate task).
 *
 * Returns { sp, sr, init, res, chc } only — NO hp, NO ap, NO mp field, matching
 * the original contract documented in AGENTS.md.
 */
export function getEnemyBaseStats(
  level: number,
  pieceType: ChessPieceType,
  seedKey?: string | number,
): { sp: number; sr: number; init: number; res: number; chc: number } {
  // Seeded RNG — deterministic per (level, pieceType) pair. The original
  // computeEnemyStats took a seedKey; here we derive a stable seed from the
  // (level, pieceType) inputs so the same enemy at the same level always
  // rolls the same stats. When a caller supplies an explicit seedKey (e.g.
  // computeEnemyStats delegates with the original spell.id-based seed), it
  // is used verbatim to preserve the exact RNG sequence of the legacy path
  // — zero behavior change.
  const seed =
    seedKey !== undefined
      ? typeof seedKey === "string"
        ? seedKey.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
        : seedKey
      : level * 31 +
        pieceType.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRng(seed);

  const base = Math.max(1, level);
  const mult =
    ENEMY_PIECE_MULTIPLIERS[pieceType] ?? ENEMY_PIECE_MULTIPLIERS.king;
  const roll = (min: number, max: number, m: number) => {
    const raw = min + rng() * (max - min);
    return Math.max(1, Math.round(raw * m));
  };

  return {
    sp: roll(3, 6 + base * 1.2, mult.sp),
    sr: roll(2, 4 + base * 1.0, mult.sr),
    init: roll(3, 6 + base * 1.2, mult.init),
    res: roll(2, 4 + base * 0.9, mult.res),
    chc: roll(1, 3 + base * 0.7, mult.chc),
  };
}

// ── Summon base stats ────────────────────────────────────────────────────────

/**
 * Level-derived stat budget for a summoned unit.
 *
 * The HP / AP / MP / lifespan formulas are moved VERBATIM from
 * spawnSummonUnit (summonSpawn.ts lines 133-162). The only intentional change
 * is the lifespan base: the inline literal `|| 3` is replaced by the new
 * SUMMON_BASE_LIFESPAN constant (=4), per the task spec. All other values,
 * scaling factors, and fallback chains are identical.
 *
 *   maxHp          = round(baseHp * hpScale * (1 + spellLevel * 10 / 100))
 *                    where baseHp = SUMMON_BASE_HP[summonAI] ?? SUMMON_BASE_HP_DEFAULT
 *   maxAp          = (unitDef.ap ?? SUMMON_AP[summonAI] ?? 2)
 *                    + floor(spellLevel / SUMMON_AP_PER_LEVELS)
 *   maxMp          = (unitDef.mp ?? SUMMON_MP[summonAI] ?? 2)
 *                    + floor(spellLevel / SUMMON_MP_PER_LEVELS)
 *   turnsRemaining = SUMMON_BASE_LIFESPAN
 *                    + floor(spellLevel / SUMMON_LIFESPAN_PER_HALF_LEVEL)
 *
 * Note: the original code used `spell.summonLifespan || 3` — i.e. a per-spell
 * override on the SpellConfig.summonLifespan field, falling back to the
 * inline literal 3. This canonical function uses the constant
 * SUMMON_BASE_LIFESPAN as the base and does NOT read spell.summonLifespan;
 * the per-spell override remains the caller's responsibility (the spawn
 * path can still add spell.summonLifespan on top if needed). This matches
 * the task requirement: "Use SUMMON_BASE_LIFESPAN=4 (the new constant)
 * instead of the inline `|| 3` literal for the lifespan base."
 */
export function getSummonBaseStats(
  spellLevel: number,
  unitDef: SummonUnitDef,
  summonAI: string,
): { maxHp: number; maxAp: number; maxMp: number; turnsRemaining: number } {
  // HP — archetype base, scaled by spell hpScale, then by spell-level bonus.
  const baseHp = SUMMON_BASE_HP[summonAI] ?? SUMMON_BASE_HP_DEFAULT;
  const hpScale = unitDef.hpScale || 1;
  const hpLevelMul = 1 + (spellLevel * SUMMON_HP_PER_LEVEL_PCT) / 100;
  const maxHp = Math.round(baseHp * hpScale * hpLevelMul);

  // AP — per-archetype budget, spell override, then +1 every N levels.
  const maxAp =
    (unitDef.ap ?? SUMMON_AP[summonAI] ?? 2) +
    Math.floor(spellLevel / SUMMON_AP_PER_LEVELS);

  // MP — per-archetype budget, spell override, then +1 every N levels.
  const maxMp =
    (unitDef.mp ?? SUMMON_MP[summonAI] ?? 2) +
    Math.floor(spellLevel / SUMMON_MP_PER_LEVELS);

  // Lifespan — base constant +1 turn every 2 spell levels.
  const turnsRemaining =
    SUMMON_BASE_LIFESPAN +
    Math.floor(spellLevel / SUMMON_LIFESPAN_PER_HALF_LEVEL);

  return { maxHp, maxAp, maxMp, turnsRemaining };
}
