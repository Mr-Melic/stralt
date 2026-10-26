/**
 * Enthroned Void PHANTOM_SPAWN advertised 1 HP vs live WX spawn
 * commit (`WorldExploration` ~16104).
 *
 * `applyPhantomSpawn` writes `hp: 1` / `maxHp: 1` / `atk: 5` / `ap: 2`
 * on `pieceType: "pawn"` minions ("1-HP phantom entities that deal 5
 * damage on contact"). Live WorldExploration then:
 *   `hp = round(max(1, boss.init - 2) * 8 + 20)`  → Enthroned Void init
 *     18 is 148
 *   `setEnemyHpMap` stamps `n[m.id] = 20` for every `res.spawns` row
 * Combat / HUD read `enemyHpMap[id] ?? e.hp`, so the advertised 1 never
 * reaches the player — Strike 10 leaves 10 HP (two hits kill) instead of
 * 0 (one hit kills). After the 280 HP Void dies, that leftover 10 still
 * blocks `shouldAwardVictory`.
 *
 * Unique leftover of **#1113** `bossScrollSummonHpCommit` (bishop
 * advertised 30 only). This sidecar does **not** restore scroll 30.
 * Unique vs:
 * - **#409** player/enemy summon spawn kit AP/MP vs the enemy-level
 *   formula. This file is boss-minion `res.spawns` HP, not kit AP/MP.
 * - **#433** bomber kamikaze despawn occupancy and spawn ADD vs REPLACE.
 *   This file does **not** change ADD vs REPLACE.
 * - **#933** occupancyAdjacentSpawnUnseal — portal-crumb snap of planted
 *   dests. This sidecar does **not** relocate dests.
 * - **#1094** DAMAGE_IMMUNE + ANCHOR_TILES. Immunity / anchors stay there.
 * - **#1102 / #1105 / #1113** Pale Archivist kit-first / scroll HP. This
 *   is Enthroned Void pawn hp 1, not bishop hp 30.
 * - SPAWN_MINIONS advertised 20 (stamp is a no-op) / GHOST_SUMMON
 *   advertised 1 on `pieceType: "king"` / SPLIT_ROOKS half-HP (Fetid
 *   Rook 420 → 210 then stamp 20 shreds). Those rows still take the
 *   stamp so those leftovers stay unrestored.
 * - Advertised atk 5 / ap 2 vs WX `damage` 35 / `atk: 0` / `ap: 0` —
 *   contact damage and AP leftovers, not this HP stamp.
 * - Kit-first `pickBossKitSpell` with an empty Map still returns
 *   phase-1 first-id `spell-swap` every turn, so even-turn PHANTOM_SPAWN
 *   never decides. That decide leftover is not restored here.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion, or
 * bossScrollSummonHpCommit. Restack the WX spawn HP stamp onto
 * `resolvePhantomSpawnCommittedHp` after older combat PRs land.
 */

import { hpAfterIncomingDamage, shouldAwardVictory } from "./battleSetup.ts";

export const ENTHRONED_VOID_ID = "enthroned_void";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

/** Production `applyPhantomSpawn` `pieceType`. */
export const PHANTOM_SPAWN_PIECE = "pawn";

/** Production `applyPhantomSpawn` phantom HP. */
export const PHANTOM_SPAWN_HP = 1;

/** Production `applyPhantomSpawn` contact atk — damage leftover, not this. */
export const PHANTOM_SPAWN_ATK = 5;

/** Production `applyPhantomSpawn` AP — AP leftover, not this. */
export const PHANTOM_SPAWN_AP = 2;

/** Production `enthroned_void` `baseStats.init`. */
export const ENTHRONED_VOID_INIT = 18;

/** Production WX `currentBossConfig.baseStats.init - 2`. */
export const WX_MINION_INIT_OFFSET = 2;

/** Production WX `* 8 + 20` HP formula multiplier. */
export const WX_MINION_HP_MULT = 8;

/** Production WX `* 8 + 20` HP formula addend. */
export const WX_MINION_HP_ADD = 20;

/**
 * Production `setEnemyHpMap` stamp (`n[m.id] = 20`) applied to every
 * boss-ability spawn, including advertised-1 phantoms.
 */
export const WX_MINION_HP_STAMP = 20;

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

export const DAMAGE_IMMUNE_ABILITY = "DAMAGE_IMMUNE";

export const PHANTOM_SPAWN_LOG_NEEDLE =
  "Phantom chess pieces materialize from the void!";

export type PhantomSpawnLike = {
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
 * Production `applyPhantomSpawn` row: pawn minion with advertised HP 1.
 * Skeleton SPAWN_MINIONS is pawn 20. Ghost GHOST_SUMMON is king 1.
 * Kit `summon-dire-wolf` is a kit fifth-id, not this spawn.
 */
export function isPhantomSpawn(spawn: PhantomSpawnLike): boolean {
  if (spawn.isBossMinion !== true) return false;
  if (spawn.pieceType !== PHANTOM_SPAWN_PIECE) return false;
  return finiteNumber(spawn.hp) === PHANTOM_SPAWN_HP;
}

/**
 * Live WX store HP before the `enemyHpMap` stamp:
 * `max(1, round(max(1, init - 2) * 8 + 20))`.
 * Enthroned Void init 18 → 148. Combat never reads this for minions
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
 * Every `res.spawns` row becomes 20, including advertised-1 phantoms.
 */
export function wxPhantomSpawnLiveCommittedHp(
  _spawn: PhantomSpawnLike,
): number {
  return WX_MINION_HP_STAMP;
}

/**
 * Keep advertised PHANTOM_SPAWN HP 1 on the combat map. Skeleton 20 /
 * ghost 1 / split-rook half-HP / scroll 30 still take the stamp so those
 * leftovers stay unrestored.
 */
export function resolvePhantomSpawnCommittedHp(
  spawn: PhantomSpawnLike,
): number {
  if (!isPhantomSpawn(spawn)) {
    return WX_MINION_HP_STAMP;
  }
  const hp = finiteNumber(spawn.hp);
  if (hp == null || hp <= 0) return WX_MINION_HP_STAMP;
  return hp;
}

/** True when live stamp 20 replaces advertised 1 on a phantom spawn. */
export function wxPhantomSpawnHpOverwritesAdvertised(
  spawn: PhantomSpawnLike,
): boolean {
  if (!isPhantomSpawn(spawn)) return false;
  const live = wxPhantomSpawnLiveCommittedHp(spawn);
  const next = resolvePhantomSpawnCommittedHp(spawn);
  return live !== next;
}

/** Advertised Strike vs committed phantom HP. */
export function phantomHpAfterStrike(opts: {
  phantomHp: number;
  strikeDamage: number;
}): number {
  return hpAfterIncomingDamage(opts.phantomHp, opts.strikeDamage).newHp;
}

export function enthronedVoidHostilesRemaining(opts: {
  bossHp: number;
  phantomHp: number;
}): number {
  const boss = finiteNumber(opts.bossHp) ?? 0;
  const phantom = finiteNumber(opts.phantomHp) ?? 0;
  return (boss > 0 ? 1 : 0) + (phantom > 0 ? 1 : 0);
}

export function leftoverPhantomBlocksVictory(opts: {
  inBattle: boolean;
  deathTriggered: boolean;
  battleStartIdsSize: number;
  bossHp: number;
  phantomHp: number;
}): boolean {
  const hostilesRemaining = enthronedVoidHostilesRemaining({
    bossHp: opts.bossHp,
    phantomHp: opts.phantomHp,
  });
  return (
    opts.phantomHp > 0 &&
    opts.bossHp <= 0 &&
    !shouldAwardVictory({
      inBattle: opts.inBattle,
      deathTriggered: opts.deathTriggered,
      battleStartIdsSize: opts.battleStartIdsSize,
      hostilesRemaining,
    })
  );
}
