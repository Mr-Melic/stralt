/**
 * Pale Archivist SCROLL_SUMMON advertised guardian HP vs live WX spawn
 * commit (`WorldExploration` ~16104).
 *
 * `applyScrollSummon` writes `hp: 30` / `maxHp: 30` / `atk: 8` / `ap: 3`
 * on `pieceType: "bishop"` minions. Live WorldExploration then:
 *   `hp = round(max(1, boss.init - 2) * 8 + 20)`  → Pale Archivist init 10
 *     is 84
 *   `setEnemyHpMap` stamps `n[m.id] = 20` for every `res.spawns` row
 * Combat / HUD read `enemyHpMap[id] ?? e.hp`, so the advertised 30 never
 * reaches the player — Strike 10 leaves 10 HP (two hits kill) instead of
 * 20 HP (three hits kill).
 *
 * Unique leftover of **#1102** `bossScrollSummonDecideCommit` (kit-first
 * Mark / Cursed Wound still shadows the odd-turn decide, so scrolls
 * never spawn). This sidecar does **not** restore decide. Unique vs:
 * - **#409** player/enemy summon spawn kit AP/MP vs the enemy-level
 *   formula. This file is boss-minion `res.spawns` HP, not kit AP/MP.
 * - **#433** bomber kamikaze despawn occupancy and spawn ADD vs REPLACE.
 *   This file does **not** change ADD vs REPLACE.
 * - **#933** occupancyAdjacentSpawnUnseal — portal-crumb snap of planted
 *   dests. This sidecar does **not** relocate dests.
 * - **#1105** even phase-1 INK_VEIL decide. Glyph-trap 15 stays there.
 * - SPAWN_MINIONS advertised 20 / GHOST_SUMMON and PHANTOM_SPAWN
 *   advertised 1 / SPLIT_ROOKS half-HP — the stamp hits those rows too;
 *   this sidecar does **not** restore them (phantom 1→20 is a buff,
 *   split-rook shred is a later leftover).
 * - Advertised atk 8 / ap 3 vs WX `damage` 19 / `atk: 0` / `ap: 0` —
 *   damage and AP leftovers, not this HP stamp.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion, or
 * bossScrollSummonDecideCommit. Restack the WX spawn HP stamp onto
 * `resolveScrollSummonCommittedHp` after older combat PRs land.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const PALE_ARCHIVIST_ID = "pale_archivist";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

/** Production `applyScrollSummon` `pieceType`. */
export const SCROLL_SUMMON_PIECE = "bishop";

/** Production `applyScrollSummon` guardian HP. */
export const SCROLL_SUMMON_HP = 30;

/** Production `applyScrollSummon` guardian atk — damage leftover, not this. */
export const SCROLL_SUMMON_ATK = 8;

/** Production `applyScrollSummon` guardian AP — AP leftover, not this. */
export const SCROLL_SUMMON_AP = 3;

/** Production `pale_archivist` `baseStats.init`. */
export const PALE_ARCHIVIST_INIT = 10;

/** Production WX `currentBossConfig.baseStats.init - 2`. */
export const WX_MINION_INIT_OFFSET = 2;

/** Production WX `* 8 + 20` HP formula multiplier. */
export const WX_MINION_HP_MULT = 8;

/** Production WX `* 8 + 20` HP formula addend. */
export const WX_MINION_HP_ADD = 20;

/**
 * Production `setEnemyHpMap` stamp (`n[m.id] = 20`) applied to every
 * boss-ability spawn, including advertised-30 scrolls.
 */
export const WX_MINION_HP_STAMP = 20;

export const PAGES_OF_DOOM_ABILITY = "PAGES_OF_DOOM";

export const INK_VEIL_ABILITY = "INK_VEIL";

export const GLYPH_TRAP_ABILITY = "GLYPH_TRAP";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const SCROLL_SUMMON_LOG_NEEDLE = "The Pale Archivist summons";

export type ScrollSummonSpawnLike = {
  id?: string;
  pieceType?: string | null;
  hp?: number | null;
  maxHp?: number | null;
  atk?: number | null;
  ap?: number | null;
  isBossMinion?: boolean | null;
  isSummon?: boolean | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Production `applyScrollSummon` row: bishop minion with advertised HP 30.
 * Kit `summon-archer` is a kit fourth-id (#910), not this spawn.
 */
export function isScrollSummonSpawn(spawn: ScrollSummonSpawnLike): boolean {
  if (spawn.isBossMinion !== true) return false;
  if (spawn.pieceType !== SCROLL_SUMMON_PIECE) return false;
  return finiteNumber(spawn.hp) === SCROLL_SUMMON_HP;
}

/**
 * Live WX store HP before the `enemyHpMap` stamp:
 * `max(1, round(max(1, init - 2) * 8 + 20))`.
 * Pale Archivist init 10 → 84. Combat never reads this for minions
 * because the stamp overwrites the map.
 */
export function wxBossMinionFormulaHp(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return WX_MINION_HP_STAMP;
  const inner = Math.max(1, init - WX_MINION_INIT_OFFSET);
  return Math.max(1, Math.round(inner * WX_MINION_HP_MULT + WX_MINION_HP_ADD));
}

/**
 * Live WX `damage` field on the same spawn map — advertised atk leftover,
 * not restored here.
 */
export function wxBossMinionFormulaDamage(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return 0;
  const inner = Math.max(1, init - WX_MINION_INIT_OFFSET);
  return Math.max(1, Math.round(inner * 2 + 3));
}

/**
 * Live combat / HUD HP: `enemyHpMap[id] ?? e.hp` after the stamp.
 * Every `res.spawns` row becomes 20, including advertised-30 scrolls.
 */
export function wxScrollSummonLiveCommittedHp(
  _spawn: ScrollSummonSpawnLike,
): number {
  return WX_MINION_HP_STAMP;
}

/**
 * Keep advertised SCROLL_SUMMON HP 30 on the combat map. Skeleton 20 /
 * phantom 1 / ghost 1 / split-rook half-HP still take the stamp so those
 * leftovers stay unrestored.
 */
export function resolveScrollSummonCommittedHp(
  spawn: ScrollSummonSpawnLike,
): number {
  if (!isScrollSummonSpawn(spawn)) {
    return WX_MINION_HP_STAMP;
  }
  const hp = finiteNumber(spawn.hp);
  if (hp == null || hp <= 0) return WX_MINION_HP_STAMP;
  return hp;
}

/** True when live stamp 20 replaces advertised 30 on a scroll spawn. */
export function wxScrollSummonHpOverwritesAdvertised(
  spawn: ScrollSummonSpawnLike,
): boolean {
  if (!isScrollSummonSpawn(spawn)) return false;
  const live = wxScrollSummonLiveCommittedHp(spawn);
  const next = resolveScrollSummonCommittedHp(spawn);
  return live !== next;
}

/** Advertised Strike vs committed scroll HP. */
export function scrollHpAfterStrike(opts: {
  scrollHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.scrollHp, opts.strikeDamage).newHp;
}

export function paleArchivistHostilesRemaining(opts: {
  bossHp: number;
  scrollHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const scroll = finiteNumber(opts.scrollHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (scroll > 0 ? 1 : 0);
}

export function leftoverScrollBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  scrollHp: number;
}): boolean {
  const hostilesRemaining = paleArchivistHostilesRemaining({
    bossHp: opts.bossHp,
    scrollHp: opts.scrollHp,
  });
  return (
    opts.scrollHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
