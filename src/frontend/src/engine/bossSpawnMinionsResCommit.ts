/**
 * Pale Archbishop SPAWN_MINIONS advertised RES 2 never commits.
 *
 * Advertised (`makeMinionSpawn`, useBossSystem ~131–151):
 *   pieceType pawn, hp 20, ap 3, atk 8, res 2, init 5
 *   id `minion_${parentBossId}_${Date.now()}_${index}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   hp/maxHp formula then enemyHpMap stamp 20  // advertised 20 matches
 *   atk: 0, ap: 0                             // leftover of #1278
 *   res: 0, sr: 5                             // advertised 2 discarded
 *
 * Live player Life Drain / Frost Bolt / sprite / keyboard / hover all
 * reach `computeDamage` (~3347) which soaks `targetEnemy.res` and
 * `targetEnemy.sr` for non-physical spells:
 *   round(preSoak * (1 - sr/100) * (1 - res/100)), min 1.
 * Physical Strike / Attack Nearest soaks RES only; advertised res 2
 * still rounds Strike 10 to 10 — leftover of #1316's Strike-only
 * non-proof, not restored there.
 *
 * Sequence: Pale Archbishop skeleton pawn already spawned (kit-first
 * Cursed Wound still shadows decide — leftover of #1102). Champion
 * SP 8, non-fizzle / non-crit Life Drain (`starter-drain` 10) vs the
 * live stamp-20 HP map, live sr 5, 0 extra RES mods.
 *
 * | | Expected (res 2) | Actual (live WX res 0) |
 * |---|---|---|
 * | packet | 9 | 10 |
 * | skeleton HP | 11 | 10 |
 *
 * Two Life Drains: advertised 20−9−9 = 2 (still occupies); live
 * 20−10−10 = 0 (two hits kill). 10 HP skeleton: advertised leaves 1;
 * live Life Drain 10 kills.
 *
 * Unique leftover of **#1278** (outgoing atk 8 vs Crush 14) and
 * **#1316** (Fetid split-rook incoming Strike RES 18; that sidecar
 * refuses `isPhysical: false` and returns null for `minion_` ids).
 * Unique vs **#1200** (Iron Curse player RES ×1.3), **#1257** /
 * **#1262** (player SR soak on incoming pack / kit casts). Ghost /
 * scroll / phantom advertise res 0, matching the stamp. Do not add
 * `hp` / `atk` / `ap` / `chc` / `heal` / `roll` / `glass` / `glyph` /
 * `venom` / `decide` / `sr`.
 *
 * Export names stay unique vs `#1278` (`SPAWN_MINIONS_ATK`,
 * `resolveSpawnMinionsCommittedAtk`, `isSpawnMinionsAtkMinionId`,
 * `liveWxSpawnMinionsMappedAtk`), `#1316` (`SPLIT_ROOK_RES`,
 * `resolveSplitRookCommittedRes`, `isSplitRookResMinionId`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI /
 * castHelpers / spellEngine. Restack spawn mapping onto
 * `resolveSpawnMinionsCommittedRes` and the Life Drain HP write onto
 * `executeSpawnMinionsResSoak` after those PRs land. Do not undo
 * ADD-vs-REPLACE (`#433`), the skeleton-20 stamp, kit-first Cursed
 * Wound (`#1102`), advertised atk 8 (`#1278`), or split-rook RES 18
 * (`#1316`).
 */

export const SPAWN_MINIONS_RES_PACKET = 2;

export const SPAWN_MINIONS_RES_ID_PREFIX = "minion_";

export const SPAWN_MINIONS_RES_PIECE = "pawn";

export const SPAWN_MINIONS_RES_BOSS_ID = "pale_archbishop";

/** Catalog Life Drain (`starter-drain`) damage. */
export const SPAWN_MINIONS_RES_DRAIN_ID = "starter-drain";

export const SPAWN_MINIONS_RES_DRAIN_DAMAGE = 10;

/** Catalog Strike (`physical_attack`) — still rounds to 10 at res 2. */
export const SPAWN_MINIONS_RES_STRIKE_DAMAGE = 10;

/** Live `enemyHpMap` stamp — advertised HP 20 matches, not restored here. */
export const SPAWN_MINIONS_RES_WX_HP_STAMP = 20;

/** Live WX spawn `sr: 5` — not advertised on SpawnData; not restored here. */
export const SPAWN_MINIONS_RES_WX_SR = 5;

/** Starting champion SP — floor(10 × 1.08) stays 10. */
export const SPAWN_MINIONS_RES_CHAMPION_SP = 8;

/** Advertised AP — leftover, not restored here (#1278). */
export const SPAWN_MINIONS_RES_AP_LEFTOVER = 3;

/** Advertised atk — leftover of #1278, not restored here. */
export const SPAWN_MINIONS_RES_ATK_LEFTOVER = 8;

/** Kit-first leftover — phase-2 first-id, not restored here (#1102). */
export const SPAWN_MINIONS_RES_KIT_FIRST_SPELL = "spell-cursed-wound";

export type SpawnMinionsResExecute = {
  damage: number;
  hpAfter: number;
  skeletonDied: boolean;
};

export type SpawnMinionsResArgs = {
  minionId: string;
  advertisedRes: number;
  drainDamage: number;
  currentHp: number;
  /** Strike / Attack Nearest is #1316's physical leftover; this path is SR×RES. */
  isPhysical: boolean;
  /** Player-side Life Drain / sprite dest vs the skeleton. */
  targetIsSkeleton: boolean;
  /** Live WX spawn `sr: 5`. */
  sr: number;
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

export function isSpawnMinionsResMinionId(minionId: string): boolean {
  return minionId.startsWith(SPAWN_MINIONS_RES_ID_PREFIX);
}

/** Live WX spawn `res: 0`. */
export function liveWxSpawnMinionsMappedRes(): number {
  return 0;
}

/** Production `makeMinionSpawn` `res: 2`. */
export function advertisedSpawnMinionsRes(spawnRes: number): number {
  return finitePct(spawnRes);
}

/**
 * Champion SP floor applied before SR×RES. Starter SP 8 leaves Life
 * Drain 10 unchanged: floor(10 × 1.08) = 10.
 */
export function spawnMinionsResPreSoakAfterSp(
  baseDamage: number,
  championSp: number,
): number {
  const raw = finiteNonNeg(baseDamage);
  if (raw <= 0) return 0;
  const sp = finitePct(championSp);
  if (sp <= 0) return raw;
  return Math.floor(raw * (1 + sp / 100));
}

/**
 * Live WX `computeDamage` physical soak: `round(dmg * (1 - res/100))`,
 * min 1 when the pre-soak packet is positive. Advertised res 2 still
 * rounds Strike 10 to 10.
 */
export function spawnMinionsStrikeResSoak(
  strikeDamage: number,
  advertisedRes: number,
): number {
  const raw = finiteNonNeg(strikeDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(advertisedRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

/**
 * Live WX `computeDamage` spell soak:
 * `round(dmg * (1 - sr/100) * (1 - res/100))`, min 1.
 */
export function spawnMinionsAdvertisedResSoak(
  drainDamage: number,
  advertisedRes: number,
  sr: number,
): number {
  const raw = finiteNonNeg(drainDamage);
  if (raw <= 0) return 0;
  const srFactor = Math.max(0, 1 - finitePct(sr) / 100);
  const resFactor = Math.max(0, 1 - finitePct(advertisedRes) / 100);
  return Math.max(1, Math.round(raw * srFactor * resFactor));
}

export function canExecuteSpawnMinionsResSoak(
  args: SpawnMinionsResArgs,
): boolean {
  if (args.targetIsSkeleton !== true) return false;
  if (args.isPhysical !== false) return false;
  if (!isSpawnMinionsResMinionId(args.minionId)) return false;
  return (
    spawnMinionsAdvertisedResSoak(
      args.drainDamage,
      args.advertisedRes,
      args.sr,
    ) > 0
  );
}

/** Alias so decide and the Life Drain restack cannot fork. */
export function shouldDecideSpawnMinionsResSoak(
  args: SpawnMinionsResArgs,
): boolean {
  return canExecuteSpawnMinionsResSoak(args);
}

export function spawnMinionsResHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised res 2 on `minion_` pawn rows.
 * Ghost / phantom / scroll / split-rook rows return null (siblings).
 */
export function resolveSpawnMinionsCommittedRes(args: {
  minionId: string;
  advertisedRes: number;
}): number | null {
  if (!isSpawnMinionsResMinionId(args.minionId)) return null;
  const res = finitePct(args.advertisedRes);
  if (res <= 0) return null;
  return res;
}

export function executeSpawnMinionsResSoak(
  args: SpawnMinionsResArgs,
): SpawnMinionsResExecute | null {
  if (!canExecuteSpawnMinionsResSoak(args)) return null;
  const damage = spawnMinionsAdvertisedResSoak(
    args.drainDamage,
    args.advertisedRes,
    args.sr,
  );
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    skeletonDied: hpAfter <= 0,
  };
}
