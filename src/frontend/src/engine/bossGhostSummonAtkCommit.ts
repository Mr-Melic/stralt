/**
 * Final Pawn GHOST_SUMMON advertised atk 5 never commits.
 *
 * Advertised (`applyGhostSummon`, useBossSystem ~801–848):
 *   pieceType king, hp 1, ap 2, atk 5, res 0, init 10
 *   id `ghost_${bossId}_${Date.now()}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   level = max(1, boss.init - 2)           // Final Pawn init 4 → 2
 *   hp/maxHp formula then enemyHpMap stamp 20  // leftover of #1220
 *   damage = max(1, round((init-2)*2+3))    // 7 — unused by melee
 *   atk: 0, ap: 0                           // advertised 5 / 2 discarded
 *
 * Live pack fallback melee (~16704) never reads enemy.atk / enemy.damage.
 * Adjacent minion Crush (`e-crush` 12) * max(1, level/5) = 12
 * (Fire Bolt 8 * same scale = 8). Ghosts spawn on free tiles then walk;
 * occupancy blocks Chebyshev 0, so the hit is adjacent melee.
 *
 * Sequence: Final Pawn ghost king adjacent, Crush vs player 100 HP / 0 RES.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | packet | 5 | Crush 12 (unused damage field 7) |
 * | player HP | 95 | 88 |
 *
 * Unique vs **#1220** (ghost king HP stamp 20; this sidecar does not
 * restore HP 1 or ap 2), **#1247** (kit-first Strike vs GHOST_SUMMON
 * decide), **#1259** (Enthroned Void phantom pawn contact atk 5; Crush
 * 38 from init 18), **#1113** (scroll bishop 30), **#1231** (split-rook
 * half-HP), **#1152** (phantom HP 1), **#1252** (Glass Realm pack melee
 * ×2), **#1107** (Crush CHC). Do not add `hp` / `ap` / `chc` / `heal` /
 * `roll` / `glass` / `apDrainLastTurn` / `venom` / `decide`.
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI.
 * Restack spawn mapping onto `resolveGhostSummonCommittedAtk` and the
 * player-target melee HP write onto `executeGhostSummonAtk` after those
 * PRs land. Do not undo ADD-vs-REPLACE (`#433`) or the skeleton-20 stamp.
 * Do not undo kit-first Strike (`#1247`) or the ghost HP stamp (`#1220`).
 */

export const GHOST_SUMMON_ATK = 5;

export const GHOST_SUMMON_ATK_ID_PREFIX = "ghost_";

export const GHOST_SUMMON_ATK_PIECE = "king";

export const GHOST_SUMMON_ATK_BOSS_ID = "final_pawn";

/** Catalog Final Pawn `baseStats.init`. */
export const GHOST_SUMMON_ATK_BOSS_INIT = 4;

/** Advertised AP — leftover, not restored here. */
export const GHOST_SUMMON_ATK_AP_LEFTOVER = 2;

export const GHOST_SUMMON_ATK_CRUSH_ID = "e-crush";

export const GHOST_SUMMON_ATK_CRUSH_DAMAGE = 12;

export const GHOST_SUMMON_ATK_FIRE_BOLT_DAMAGE = 8;

export type GhostSummonAtkExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type GhostSummonAtkArgs = {
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

export function isGhostSummonAtkMinionId(minionId: string): boolean {
  return minionId.startsWith(GHOST_SUMMON_ATK_ID_PREFIX);
}

/** Live WX spawn `level = max(1, boss.init - 2)`. */
export function liveWxGhostSummonMappedLevel(bossInit: number): number {
  return Math.max(1, finiteNonNeg(bossInit) - 2);
}

/**
 * Live WX spawn `damage` field. Unused by pack fallback melee; proven
 * leftover of the formula that also writes `atk: 0`.
 */
export function liveWxGhostSummonMappedDamage(bossInit: number): number {
  const level = liveWxGhostSummonMappedLevel(bossInit);
  return Math.max(1, Math.round(level * 2 + 3));
}

export function liveWxGhostSummonMappedAtk(): number {
  return 0;
}

/** Live pack fallback melee: Crush 12 / Fire Bolt 8 × max(1, level/5). */
export function liveWxGhostSummonMeleeFallback(
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

/** Advertised physical soak: RES only (ghost atk is not a spell). */
export function ghostSummonAdvertisedAtkSoak(
  advertisedAtk: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(advertisedAtk);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecuteGhostSummonAtk(args: GhostSummonAtkArgs): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.adjacent !== true) return false;
  if (!isGhostSummonAtkMinionId(args.minionId)) return false;
  return ghostSummonAdvertisedAtkSoak(args.advertisedAtk, args.playerRes) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecideGhostSummonAtk(args: GhostSummonAtkArgs): boolean {
  return canExecuteGhostSummonAtk(args);
}

export function ghostSummonAtkHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised atk 5 on `ghost_` king rows.
 * Phantom / scroll / split-rook / skeleton rows return null (siblings).
 */
export function resolveGhostSummonCommittedAtk(args: {
  minionId: string;
  advertisedAtk: number;
}): number | null {
  if (!isGhostSummonAtkMinionId(args.minionId)) return null;
  const atk = finiteNonNeg(args.advertisedAtk);
  if (atk <= 0) return null;
  return atk;
}

export function executeGhostSummonAtk(
  args: GhostSummonAtkArgs,
): GhostSummonAtkExecute | null {
  if (!canExecuteGhostSummonAtk(args)) return null;
  const damage = ghostSummonAdvertisedAtkSoak(
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
