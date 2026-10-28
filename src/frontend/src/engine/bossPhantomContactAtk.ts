/**
 * Enthroned Void PHANTOM_SPAWN advertised contact atk 5 never commits.
 *
 * Advertised (`applyPhantomSpawn`, useBossSystem ~1409–1455):
 *   pieceType pawn, hp 1, ap 2, atk 5, res 0, init 8
 *   comment: "deal 5 damage on contact"
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   level = max(1, boss.init - 2)           // Enthroned Void init 18 → 16
 *   hp/maxHp formula then enemyHpMap stamp 20  // leftover of #1152
 *   damage = max(1, round((init-2)*2+3))    // 35 — unused by melee
 *   atk: 0, ap: 0                           // advertised 5 / 2 discarded
 *
 * Live pack fallback melee (~16704) never reads enemy.atk / enemy.damage.
 * Adjacent minion Crush (`e-crush` 12) * max(1, level/5) = 38
 * (Fire Bolt 8 * same scale = 26). Occupancy blocks walking onto the
 * pawn, so "contact" is Chebyshev ≤ 1 melee — not a larva-explode walk.
 *
 * Sequence: Enthroned Void phantom adjacent, Crush vs player 100 HP / 0 RES.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | packet | 5 | Crush 38 (unused damage field 35) |
 * | player HP | 95 | 62 |
 *
 * Unique vs **#1152** (phantom HP stamp 20), **#1220** (ghost king HP 1;
 * ghost atk 5 / ap 2 leftover), **#1113** (scroll bishop 30), **#1231**
 * (split-rook half-HP), **#1217** (larva explode venom DoT), **#1252**
 * (Glass Realm pack melee ×2), **#1107** (Crush CHC), **#1159** (kit-first
 * Swap vs PHANTOM_SPAWN decide). Do not add `hp` / `chc` / `heal` / `roll`
 * / `glass` / `apDrainLastTurn` / `venom`.
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI.
 * Restack spawn mapping onto `resolvePhantomContactCommittedAtk` and the
 * player-target melee HP write onto `executePhantomContactAtk` after those
 * PRs land. Do not undo ADD-vs-REPLACE (`#433`) or the skeleton-20 stamp.
 */

export const PHANTOM_CONTACT_ATK = 5;

export const PHANTOM_SPAWN_ID_PREFIX = "void_phantom_";

export const PHANTOM_CONTACT_BOSS_ID = "enthroned_void";

/** Catalog Enthroned Void `baseStats.init`. */
export const PHANTOM_CONTACT_BOSS_INIT = 18;

export const PHANTOM_CONTACT_CRUSH_ID = "e-crush";

export const PHANTOM_CONTACT_CRUSH_DAMAGE = 12;

export const PHANTOM_CONTACT_FIRE_BOLT_DAMAGE = 8;

export type PhantomContactAtkExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type PhantomContactAtkArgs = {
  minionId: string;
  advertisedAtk: number;
  currentHp: number;
  playerRes: number;
  /** Summon-target melee already routes through `enemyTakesDamage`. */
  targetIsPlayer: boolean;
  /** Occupancy blocks Chebyshev 0; contact is adjacent melee. */
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

export function isVoidPhantomMinionId(minionId: string): boolean {
  return minionId.startsWith(PHANTOM_SPAWN_ID_PREFIX);
}

/** Live WX spawn `level = max(1, boss.init - 2)`. */
export function liveWxPhantomSpawnMappedLevel(bossInit: number): number {
  return Math.max(1, finiteNonNeg(bossInit) - 2);
}

/**
 * Live WX spawn `damage` field. Unused by pack fallback melee; proven
 * leftover of the formula that also writes `atk: 0`.
 */
export function liveWxPhantomSpawnMappedDamage(bossInit: number): number {
  const level = liveWxPhantomSpawnMappedLevel(bossInit);
  return Math.max(1, Math.round(level * 2 + 3));
}

export function liveWxPhantomSpawnMappedAtk(): number {
  return 0;
}

/** Live pack fallback melee: Crush 12 / Fire Bolt 8 × max(1, level/5). */
export function liveWxPhantomMeleeFallback(
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

/** Advertised physical soak: RES only (contact atk is not a spell). */
export function phantomContactAdvertisedSoak(
  advertisedAtk: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(advertisedAtk);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecutePhantomContactAtk(
  args: PhantomContactAtkArgs,
): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.adjacent !== true) return false;
  if (!isVoidPhantomMinionId(args.minionId)) return false;
  return phantomContactAdvertisedSoak(args.advertisedAtk, args.playerRes) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecidePhantomContactAtk(
  args: PhantomContactAtkArgs,
): boolean {
  return canExecutePhantomContactAtk(args);
}

export function phantomContactHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised atk 5 on `void_phantom_` rows.
 * Ghost / scroll / split-rook / skeleton rows return null (siblings).
 */
export function resolvePhantomContactCommittedAtk(args: {
  minionId: string;
  advertisedAtk: number;
}): number | null {
  if (!isVoidPhantomMinionId(args.minionId)) return null;
  const atk = finiteNonNeg(args.advertisedAtk);
  if (atk <= 0) return null;
  return atk;
}

export function executePhantomContactAtk(
  args: PhantomContactAtkArgs,
): PhantomContactAtkExecute | null {
  if (!canExecutePhantomContactAtk(args)) return null;
  const damage = phantomContactAdvertisedSoak(
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
