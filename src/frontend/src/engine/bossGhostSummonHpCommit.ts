/**
 * Final Pawn GHOST_SUMMON advertised 1 HP vs live WX spawn commit
 * (`WorldExploration` ~16104).
 *
 * `applyGhostSummon` writes `hp: 1` / `maxHp: 1` / `atk: 5` / `ap: 2`
 * on `pieceType: "king"` minions ("ghost bosses"). Live WorldExploration
 * then:
 *   `hp = round(max(1, boss.init - 2) * 8 + 20)`  → Final Pawn init 4
 *     is 36 on the store row
 *   `setEnemyHpMap` stamps `n[m.id] = 20` for every `res.spawns` row
 * Primary Strike / HUD read `enemyHpMap[id] ?? …`, so advertised 1
 * never reaches the player — Strike 10 leaves 10 HP instead of 0.
 * After the 600 HP Pawn dies (or sits invincible), that leftover 10
 * still blocks `shouldAwardVictory`.
 *
 * Unique leftover of **#1152** `bossPhantomSpawnHpCommit` (Enthroned
 * Void pawn advertised 1; that resolve still stamps kings). Unique vs:
 * - **#1113** `bossScrollSummonHpCommit` (bishop advertised 30 only).
 * - SPAWN_MINIONS advertised 20 (stamp is a no-op).
 * - SPLIT_ROOKS half-HP (Fetid Rook 420 → 210 then stamp 20).
 * - Advertised atk 5 / ap 2 vs WX `damage` 7 / `atk: 0` / `ap: 0` —
 *   contact leftover, not this HP stamp.
 * - Kit-first `pickBossKitSpell` shadowing GHOST_SUMMON decide is not
 *   restored here (`useBossAI` still prefers an off-cooldown kit id
 *   before the 10% HP trigger).
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, combatantStore, or the phantom/scroll HP sidecars.
 * Restack the WX spawn HP stamp onto `resolveGhostSummonCommittedHp`
 * after older combat PRs land.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const FINAL_PAWN_ID = "final_pawn";

export const GHOST_SUMMON_ABILITY_ID = "GHOST_SUMMON";

/** Production `applyGhostSummon` `pieceType`. */
export const GHOST_SUMMON_PIECE = "king";

/** Production `applyGhostSummon` ghost HP. */
export const GHOST_SUMMON_ADVERTISED_HP = 1;

/** Production `applyGhostSummon` atk — contact leftover, not this. */
export const GHOST_SUMMON_ATK = 5;

/** Production `applyGhostSummon` AP — AP leftover, not this. */
export const GHOST_SUMMON_AP = 2;

/** Production `final_pawn` `baseStats.init`. */
export const FINAL_PAWN_INIT = 4;

/** Production `final_pawn` `baseStats.hp`. */
export const FINAL_PAWN_HP = 600;

/** Production WX `currentBossConfig.baseStats.init - 2`. */
export const WX_GHOST_MINION_INIT_OFFSET = 2;

/** Production WX `* 8 + 20` HP formula multiplier. */
export const WX_GHOST_MINION_HP_MULT = 8;

/** Production WX `* 8 + 20` HP formula addend. */
export const WX_GHOST_MINION_HP_ADD = 20;

/**
 * Production `setEnemyHpMap` stamp (`n[m.id] = 20`) applied to every
 * boss-ability spawn, including advertised-1 kings.
 */
export const WX_GHOST_SPAWN_HP_STAMP = 20;

export const PHANTOM_SPAWN_ABILITY_ID = "PHANTOM_SPAWN";

export const SCROLL_SUMMON_ABILITY_ID = "SCROLL_SUMMON";

export const SPLIT_ROOKS_ABILITY_ID = "SPLIT_ROOKS";

export const SPAWN_MINIONS_ABILITY_ID = "SPAWN_MINIONS";

export const GHOST_SUMMON_LOG_NEEDLE =
  "The Final Pawn summons ${spawns.length} ghost bosses! Defeat them all in 5 turns!";

export type GhostSummonSpawnLike = {
  id?: string;
  pieceType?: string | null;
  hp?: number | null;
  maxHp?: number | null;
  atk?: number | null;
  ap?: number | null;
  isBossMinion?: boolean | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Production `applyGhostSummon` row: king minion with advertised HP 1.
 * Enthroned Void PHANTOM_SPAWN is pawn 1. Skeleton SPAWN_MINIONS is
 * pawn 20. Scroll is bishop 30.
 */
export function isGhostSummonSpawn(spawn: GhostSummonSpawnLike): boolean {
  if (spawn.isBossMinion !== true) return false;
  if (spawn.pieceType !== GHOST_SUMMON_PIECE) return false;
  return finiteNumber(spawn.hp) === GHOST_SUMMON_ADVERTISED_HP;
}

/**
 * Live WX store HP before the `enemyHpMap` stamp:
 * `max(1, round(max(1, init - 2) * 8 + 20))`.
 * Final Pawn init 4 → 36. Combat Strike reads the stamp, not this.
 */
export function wxGhostMinionFormulaHp(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return WX_GHOST_SPAWN_HP_STAMP;
  const inner = Math.max(1, init - WX_GHOST_MINION_INIT_OFFSET);
  return Math.max(
    1,
    Math.round(inner * WX_GHOST_MINION_HP_MULT + WX_GHOST_MINION_HP_ADD),
  );
}

/**
 * Live WX `damage` field on the same spawn map — advertised atk leftover,
 * not restored here.
 */
export function wxGhostMinionFormulaDamage(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return 0;
  const inner = Math.max(1, init - WX_GHOST_MINION_INIT_OFFSET);
  return Math.max(1, Math.round(inner * 2 + 3));
}

/**
 * Live combat / HUD HP: `enemyHpMap[id]` after the stamp.
 * Every `res.spawns` row becomes 20, including advertised-1 kings.
 */
export function wxGhostSummonLiveCommittedHp(
  _spawn: GhostSummonSpawnLike,
): number {
  return WX_GHOST_SPAWN_HP_STAMP;
}

/**
 * Keep advertised GHOST_SUMMON HP 1 on the combat map. Phantom pawn 1 /
 * scroll 30 / split-rook half-HP / skeleton 20 still take the stamp so
 * those leftovers stay unrestored.
 */
export function resolveGhostSummonCommittedHp(
  spawn: GhostSummonSpawnLike,
): number {
  if (!isGhostSummonSpawn(spawn)) {
    return WX_GHOST_SPAWN_HP_STAMP;
  }
  const hp = finiteNumber(spawn.hp);
  if (hp == null || hp <= 0) return WX_GHOST_SPAWN_HP_STAMP;
  return hp;
}

/** True when live stamp 20 replaces advertised 1 on a ghost king. */
export function wxGhostSummonHpOverwritesAdvertised(
  spawn: GhostSummonSpawnLike,
): boolean {
  if (!isGhostSummonSpawn(spawn)) return false;
  const live = wxGhostSummonLiveCommittedHp(spawn);
  const next = resolveGhostSummonCommittedHp(spawn);
  return live !== next;
}

/** Advertised Strike vs committed ghost HP. */
export function ghostHpAfterStrike(opts: {
  ghostHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.ghostHp, opts.strikeDamage).newHp;
}

export function finalPawnHostilesRemaining(opts: {
  bossHp: number;
  ghostHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const ghost = finiteNumber(opts.ghostHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (ghost > 0 ? 1 : 0);
}

export function leftoverGhostBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  ghostHp: number;
}): boolean {
  const hostilesRemaining = finalPawnHostilesRemaining({
    bossHp: opts.bossHp,
    ghostHp: opts.ghostHp,
  });
  return (
    opts.ghostHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
