/**
 * Pale Archbishop SPAWN_MINIONS advertised atk 8 never commits.
 *
 * Advertised (`makeMinionSpawn`, useBossSystem ~131–151):
 *   pieceType pawn, hp 20, ap 3, atk 8, res 2, init 5
 *   id `minion_${parentBossId}_${Date.now()}_${index}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   level = max(1, boss.init - 2)           // Pale Archbishop init 8 → 6
 *   hp/maxHp formula then enemyHpMap stamp 20  // advertised 20 matches stamp
 *   damage = max(1, round((init-2)*2+3))    // 15 — unused by melee
 *   atk: 0, ap: 0                           // advertised 8 / 3 discarded
 *
 * Live pack fallback melee (~16704) never reads enemy.atk / enemy.damage.
 * Adjacent minion Crush (`e-crush` 12) * max(1, level/5) = 14
 * (Fire Bolt 8 * same scale = 10). Skeletons spawn on adjacent free tiles
 * then act; occupancy blocks Chebyshev 0, so the hit is adjacent melee
 * (or Fire Bolt from the same pool). Pawn kit Strike is never assigned
 * (`family: ""`, no ENEMY_KITS write on res.spawns).
 *
 * Sequence: Pale Archbishop skeleton pawn adjacent, Crush vs player
 * 100 HP / 0 RES.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | packet | 8 | Crush 14 (unused damage field 15) |
 * | player HP | 92 | 86 |
 *
 * 14 HP player: advertised 8 leaves 6; live Crush 14 kills.
 *
 * Unique vs **#1273** (Pale Archivist scroll bishop atk 8; Crush 19 from
 * init 10), **#1264** (Final Pawn ghost king atk 5; Crush 12 from init 4),
 * **#1259** (Enthroned Void phantom pawn contact atk 5; Crush 38 from
 * init 18), **#1271** (Fetid split-rook atk 25), **#1113** (scroll HP 30),
 * **#1231** (split-rook half-HP), **#1252** (Glass Realm pack melee ×2),
 * **#1107** (Crush CHC). Do not add `hp` / `ap` / `chc` / `heal` /
 * `roll` / `glass` / `glyph` / `venom` / `decide`. Kit-first Cursed Wound
 * still shadows SPAWN_MINIONS (sibling of **#1102**).
 *
 * Export names stay unique vs `#1273` (`SCROLL_SUMMON_ATK`,
 * `resolveScrollSummonCommittedAtk`, `isScrollSummonAtkMinionId`),
 * `#1264` (`GHOST_SUMMON_ATK`, `resolveGhostSummonCommittedAtk`),
 * `#1259` (`PHANTOM_CONTACT_ATK`, `resolvePhantomContactCommittedAtk`),
 * `#1271` (`SPLIT_ROOK_ATK`, `resolveSplitRookCommittedAtk`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI.
 * Restack spawn mapping onto `resolveSpawnMinionsCommittedAtk` and the
 * player-target melee HP write onto `executeSpawnMinionsAtk` after those
 * PRs land. Do not undo ADD-vs-REPLACE (`#433`), the skeleton-20 stamp,
 * kit-first Cursed Wound (`#1102`), or the scroll HP stamp (`#1113`).
 */

export const SPAWN_MINIONS_ATK_PACKET = 8;

export const SPAWN_MINIONS_ATK_ID_PREFIX = "minion_";

export const SPAWN_MINIONS_ATK_PIECE = "pawn";

export const SPAWN_MINIONS_ATK_BOSS_ID = "pale_archbishop";

/** Catalog Pale Archbishop `baseStats.init`. */
export const SPAWN_MINIONS_ATK_BOSS_INIT = 8;

/** Advertised AP — leftover, not restored here. */
export const SPAWN_MINIONS_ATK_AP_LEFTOVER = 3;

export const SPAWN_MINIONS_ATK_CRUSH_ID = "e-crush";

export const SPAWN_MINIONS_ATK_CRUSH_DAMAGE = 12;

export const SPAWN_MINIONS_ATK_FIRE_BOLT_DAMAGE = 8;

/** Kit-first leftover — phase-2 first-id, not restored here (#1102 class). */
export const SPAWN_MINIONS_ATK_KIT_FIRST_SPELL = "spell-cursed-wound";

export type SpawnMinionsAtkExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type SpawnMinionsAtkArgs = {
  minionId: string;
  advertisedAtk: number;
  currentHp: number;
  playerRes: number;
  /** Summon-target melee already routes through `enemyTakesDamage`. */
  targetIsPlayer: boolean;
  /** Occupancy blocks Chebyshev 0; the hit is adjacent melee. */
  adjacent: boolean;
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

export function isSpawnMinionsAtkMinionId(minionId: string): boolean {
  return minionId.startsWith(SPAWN_MINIONS_ATK_ID_PREFIX);
}

/** Live WX spawn `level = max(1, boss.init - 2)`. */
export function liveWxSpawnMinionsMappedLevel(bossInit: number): number {
  return Math.max(1, finiteNonNeg(bossInit) - 2);
}

/**
 * Live WX spawn `damage` field. Unused by pack fallback melee; proven
 * leftover of the formula that also writes `atk: 0`.
 */
export function liveWxSpawnMinionsMappedDamage(bossInit: number): number {
  const level = liveWxSpawnMinionsMappedLevel(bossInit);
  return Math.max(1, Math.round(level * 2 + 3));
}

export function liveWxSpawnMinionsMappedAtk(): number {
  return 0;
}

/** Live pack fallback melee: Crush 12 / Fire Bolt 8 × max(1, level/5). */
export function liveWxSpawnMinionsMeleeFallback(
  catalogDamage: number,
  level: number,
  enrageMultiplier = 1,
): number {
  const raw = finiteNonNeg(catalogDamage);
  if (raw <= 0) return 0;
  return Math.max(
    1,
    Math.round(
      raw *
        Math.max(1, finiteNonNeg(level) / 5) *
        finiteNonNeg(enrageMultiplier),
    ),
  );
}

/** Advertised physical soak: RES only (skeleton atk is not a spell). */
export function spawnMinionsAdvertisedAtkSoak(
  advertisedAtk: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(advertisedAtk);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecuteSpawnMinionsAtk(args: SpawnMinionsAtkArgs): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.adjacent !== true) return false;
  if (!isSpawnMinionsAtkMinionId(args.minionId)) return false;
  return spawnMinionsAdvertisedAtkSoak(args.advertisedAtk, args.playerRes) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecideSpawnMinionsAtk(
  args: SpawnMinionsAtkArgs,
): boolean {
  return canExecuteSpawnMinionsAtk(args);
}

export function spawnMinionsAtkHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised atk 8 on `minion_` pawn rows.
 * Ghost / phantom / scroll / split-rook rows return null (siblings).
 */
export function resolveSpawnMinionsCommittedAtk(args: {
  minionId: string;
  advertisedAtk: number;
}): number | null {
  if (!isSpawnMinionsAtkMinionId(args.minionId)) return null;
  const atk = finiteNonNeg(args.advertisedAtk);
  if (atk <= 0) return null;
  return atk;
}

export function executeSpawnMinionsAtk(
  args: SpawnMinionsAtkArgs,
): SpawnMinionsAtkExecute | null {
  if (!canExecuteSpawnMinionsAtk(args)) return null;
  const damage = spawnMinionsAdvertisedAtkSoak(
    args.advertisedAtk,
    args.playerRes,
  );
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    playerDied: hpAfter <= 0,
  };
}
