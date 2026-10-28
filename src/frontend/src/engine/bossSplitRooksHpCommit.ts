/**
 * Fetid Rook SPLIT_ROOKS advertised half-HP twins vs live WX spawn
 * commit (`WorldExploration` ~16104).
 *
 * `applySplitRooks` (`useBossSystem.ts` ~502) writes
 * `hp: Math.ceil(bossEntry.hp / 2)` / `maxHp` same / `atk: floor(atk * 0.8)`
 * / `ap: bossEntry.ap` on `pieceType: "rook"` minions. Lore: "splitting
 * into twins at half HP." Catalog Fetid Rook is 420 HP → 210 per twin.
 * Live WorldExploration then:
 *   `hp = round(max(1, boss.init - 2) * 8 + 20)`  → Fetid Rook init 7
 *     is 60
 *   `setEnemyHpMap` stamps `n[m.id] = 20` for every `res.spawns` row
 * Combat / HUD read `enemyHpMap[id] ?? e.hp`, so the advertised 210 never
 * reaches the player — Strike 10 leaves 10 HP (two hits kill) instead of
 * 200 HP (21 hits kill).
 *
 * Unique leftover of **#1152** `bossPhantomSpawnHpCommit` (Enthroned Void
 * pawn advertised 1) and **#1113** `bossScrollSummonHpCommit` (Pale
 * Archivist bishop advertised 30). This sidecar does **not** restore
 * phantom 1 or scroll 30. Unique vs:
 * - **#409** player/enemy summon spawn kit AP/MP vs the enemy-level
 *   formula. This file is boss-minion `res.spawns` HP, not kit AP/MP.
 * - **#433** bomber kamikaze despawn occupancy and spawn ADD vs REPLACE.
 *   This file does **not** change ADD vs REPLACE.
 * - **#933** occupancyAdjacentSpawnUnseal — portal-crumb snap of planted
 *   dests. This sidecar does **not** relocate dests.
 * - SPAWN_MINIONS advertised 20 (stamp is a no-op) / GHOST_SUMMON
 *   advertised 1 on `pieceType: "king"` / PHANTOM_SPAWN advertised 1 on
 *   pawn. Those rows still take the stamp so those leftovers stay
 *   unrestored.
 * - Advertised atk `floor(32 * 0.8) = 25` / ap 5 vs WX `damage` 13 /
 *   `atk: 0` / `ap: 0` — contact damage and AP leftovers, not this HP
 *   stamp.
 * - Kit-first `pickBossKitSpell` with an empty Map still returns
 *   phase-2 first-id `spell-venom-strike` every turn, so SPLIT_ROOKS
 *   never decides. That decide leftover is not restored here (**#888**
 *   / **#1212** class).
 * - `checkPhaseTransition` reads `phase2.hpThreshold` 0.0 while the
 *   guide shows `phase1.hpThreshold` 0.4. That phase-gate leftover is
 *   not restored here.
 * - Log "one revives the other" has no revive writer. Not this stamp.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion,
 * bossPhantomSpawnHpCommit, or bossScrollSummonHpCommit. Restack the
 * WX spawn HP stamp onto `resolveFetidSplitRookCommittedHp` after older
 * combat PRs land. Do not undo ADD-vs-REPLACE or the skeleton-20 stamp
 * no-op.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const FETID_ROOK_ID = "fetid_rook";

export const FETID_SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

/** Production `applySplitRooks` `pieceType`. */
export const FETID_SPLIT_ROOK_PIECE = "rook";

/** Production `fetid_rook` `baseStats.hp`. */
export const FETID_ROOK_HP = 420;

/** Production `fetid_rook` `baseStats.init`. */
export const FETID_ROOK_INIT = 7;

/** Production `fetid_rook` `baseStats.atk` — damage leftover, not this. */
export const FETID_ROOK_ATK = 32;

/** Production `fetid_rook` `baseStats.ap` — AP leftover, not this. */
export const FETID_ROOK_AP = 5;

/** Production `applySplitRooks` atk scale — damage leftover, not this. */
export const FETID_SPLIT_ROOK_ATK_SCALE = 0.8;

/**
 * Production WX `currentBossConfig.baseStats.init - 2`. Unique name vs
 * `#1113` / `#1152` `WX_MINION_INIT_OFFSET`.
 */
export const FETID_SPLIT_WX_INIT_OFFSET = 2;

/**
 * Production WX `* 8 + 20` HP formula multiplier. Unique name vs
 * `#1113` / `#1152` `WX_MINION_HP_MULT`.
 */
export const FETID_SPLIT_WX_HP_MULT = 8;

/**
 * Production WX `* 8 + 20` HP formula addend. Unique name vs `#1113` /
 * `#1152` `WX_MINION_HP_ADD`.
 */
export const FETID_SPLIT_WX_HP_ADD = 20;

/**
 * Production `setEnemyHpMap` stamp (`n[m.id] = 20`) applied to every
 * boss-ability spawn, including advertised-210 split rooks. Unique name
 * vs `#1113` / `#1152` `WX_MINION_HP_STAMP`.
 */
export const FETID_SPLIT_WX_HP_STAMP = 20;

/** Kit-first leftover — phase-2 first-id, not restored here. */
export const FETID_SPLIT_KIT_FIRST_SPELL = "spell-venom-strike";

export const FETID_SPLIT_ROOKS_LOG_NEEDLE =
  "splits into two rooks! Defeat both simultaneously or one revives the other!";

export type FetidSplitRookSpawnLike = {
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

/** Production `applySplitRooks` half-HP: `Math.ceil(bossEntry.hp / 2)`. */
export function advertisedFetidSplitRookHp(bossHp: number): number {
  const hp = finiteNumber(bossHp);
  if (hp == null || hp <= 0) return FETID_SPLIT_WX_HP_STAMP;
  return Math.ceil(hp / 2);
}

/** Production `applySplitRooks` atk — damage leftover, not restored. */
export function advertisedFetidSplitRookAtk(bossAtk: number): number {
  const atk = finiteNumber(bossAtk);
  if (atk == null) return 0;
  return Math.floor(atk * FETID_SPLIT_ROOK_ATK_SCALE);
}

/**
 * Production `applySplitRooks` row: rook minion. Skeleton SPAWN_MINIONS
 * is pawn 20. Ghost GHOST_SUMMON is king 1. Phantom PHANTOM_SPAWN is
 * pawn 1. Scroll SCROLL_SUMMON is bishop 30.
 */
export function isFetidSplitRookSpawn(spawn: FetidSplitRookSpawnLike): boolean {
  if (spawn.isBossMinion !== true) return false;
  if (spawn.pieceType !== FETID_SPLIT_ROOK_PIECE) return false;
  const id = spawn.id ?? "";
  if (id.startsWith("split_rook_")) return true;
  const hp = finiteNumber(spawn.hp);
  return hp != null && hp === advertisedFetidSplitRookHp(FETID_ROOK_HP);
}

/**
 * Live WX store HP before the `enemyHpMap` stamp:
 * `max(1, round(max(1, init - 2) * 8 + 20))`.
 * Fetid Rook init 7 → 60. Combat never reads this for minions because
 * the stamp overwrites the map. Unique name vs `#1113` /
 * `#1152` `wxBossMinionFormulaHp`.
 */
export function wxFetidSplitMinionFormulaHp(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return FETID_SPLIT_WX_HP_STAMP;
  const inner = Math.max(1, init - FETID_SPLIT_WX_INIT_OFFSET);
  return Math.max(
    1,
    Math.round(inner * FETID_SPLIT_WX_HP_MULT + FETID_SPLIT_WX_HP_ADD),
  );
}

/**
 * Live WX `damage` field on the same spawn map — advertised atk leftover,
 * not restored here. Unique name vs `#1113` / `#1152`
 * `wxBossMinionFormulaDamage`.
 */
export function wxFetidSplitMinionFormulaDamage(bossInit: number): number {
  const init = finiteNumber(bossInit);
  if (init == null) return 0;
  const inner = Math.max(1, init - FETID_SPLIT_WX_INIT_OFFSET);
  return Math.max(1, Math.round(inner * 2 + 3));
}

/**
 * Live combat / HUD HP: `enemyHpMap[id] ?? e.hp` after the stamp.
 * Every `res.spawns` row becomes 20, including advertised-210 twins.
 */
export function wxFetidSplitRookLiveCommittedHp(
  _spawn: FetidSplitRookSpawnLike,
): number {
  return FETID_SPLIT_WX_HP_STAMP;
}

/**
 * Keep advertised SPLIT_ROOKS half-HP on the combat map. Skeleton 20 /
 * phantom 1 / ghost 1 / scroll 30 still take the stamp so those leftovers
 * stay unrestored.
 */
export function resolveFetidSplitRookCommittedHp(
  spawn: FetidSplitRookSpawnLike,
): number {
  if (!isFetidSplitRookSpawn(spawn)) {
    return FETID_SPLIT_WX_HP_STAMP;
  }
  const hp = finiteNumber(spawn.hp);
  if (hp == null || hp <= 0) return FETID_SPLIT_WX_HP_STAMP;
  return hp;
}

/** True when live stamp 20 replaces advertised half-HP on a split rook. */
export function wxFetidSplitRookHpOverwritesAdvertised(
  spawn: FetidSplitRookSpawnLike,
): boolean {
  if (!isFetidSplitRookSpawn(spawn)) return false;
  const live = wxFetidSplitRookLiveCommittedHp(spawn);
  const next = resolveFetidSplitRookCommittedHp(spawn);
  return live !== next;
}

/** Advertised Strike vs committed split-rook HP. */
export function fetidSplitRookHpAfterStrike(opts: {
  splitRookHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.splitRookHp, opts.strikeDamage).newHp;
}

export function fetidRookHostilesRemaining(opts: {
  bossHp: number;
  splitRookHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const twin = finiteNumber(opts.splitRookHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (twin > 0 ? 1 : 0);
}

export function leftoverFetidSplitRookBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  splitRookHp: number;
}): boolean {
  const hostilesRemaining = fetidRookHostilesRemaining({
    bossHp: opts.bossHp,
    splitRookHp: opts.splitRookHp,
  });
  return (
    opts.splitRookHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
