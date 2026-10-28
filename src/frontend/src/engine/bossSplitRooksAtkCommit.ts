/**
 * Fetid Rook SPLIT_ROOKS advertised atk 25 never commits.
 *
 * Advertised (`applySplitRooks`, useBossSystem ~502–549):
 *   pieceType rook, hp ceil(boss.hp/2), ap boss.ap (5), atk floor(atk*0.8)
 *   Fetid Rook atk 32 → 25. id `split_rook_${i}_${Date.now()}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   level = max(1, boss.init - 2)           // Fetid Rook init 7 → 5
 *   hp/maxHp formula then enemyHpMap stamp 20  // leftover of #1231
 *   damage = max(1, round((init-2)*2+3))    // 13 — unused by melee
 *   atk: 0, ap: 0                           // advertised 25 / 5 discarded
 *
 * Live pack fallback melee (~16704) never reads enemy.atk / enemy.damage.
 * Adjacent minion Crush (`e-crush` 12) * max(1, level/5) = 12
 * (Fire Bolt 8 * same scale = 8). Twins spawn on free adjacent tiles then
 * walk; occupancy blocks Chebyshev 0, so the hit is adjacent melee.
 *
 * Sequence: Fetid split rook adjacent, Crush vs player 100 HP / 0 RES.
 *
 * | | Expected | Actual (live WX) |
 * |---|---|---|
 * | packet | 25 | Crush 12 (unused damage field 13) |
 * | player HP | 75 | 88 |
 *
 * 20 HP player: advertised 25 kills; live Crush 12 leaves 8.
 *
 * Unique leftover of **#1231** (rook advertised 210 vs WX stamp 20; this
 * sidecar does not restore HP 210 or ap 5) and **#1261** (kit-first Venom
 * vs SPLIT_ROOKS decide). Unique vs **#1264** (Final Pawn ghost king atk
 * 5; Crush 12 from init 4), **#1259** (Enthroned Void phantom pawn
 * contact atk 5; Crush 38 from init 18), **#1113** (scroll bishop 30),
 * **#1152** (phantom HP 1), **#1252** (Glass Realm pack melee ×2),
 * **#1107** (Crush CHC). Do not add `hp` / `ap` / `chc` / `heal` /
 * `roll` / `glass` / `apDrainLastTurn` / `venom` / `decide`.
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI /
 * bossSplitRooksHpCommit / bossSplitRooksDecideCommit. Restack spawn
 * mapping onto `resolveSplitRookCommittedAtk` and the player-target
 * melee HP write onto `executeSplitRookAtk` after those PRs land. Do not
 * undo ADD-vs-REPLACE (`#433`) or the skeleton-20 stamp. Do not undo
 * kit-first Venom (`#1261`) or the half-HP stamp (`#1231`).
 */

export const SPLIT_ROOK_ATK = 25;

export const SPLIT_ROOK_ATK_ID_PREFIX = "split_rook_";

export const SPLIT_ROOK_ATK_PIECE = "rook";

export const SPLIT_ROOK_ATK_BOSS_ID = "fetid_rook";

/** Catalog Fetid Rook `baseStats.init`. */
export const SPLIT_ROOK_ATK_BOSS_INIT = 7;

/** Catalog Fetid Rook `baseStats.atk`. */
export const SPLIT_ROOK_ATK_BOSS_ATK = 32;

/** Production `applySplitRooks` atk scale. */
export const SPLIT_ROOK_ATK_SCALE = 0.8;

/** Advertised AP — leftover, not restored here. */
export const SPLIT_ROOK_ATK_AP_LEFTOVER = 5;

export const SPLIT_ROOK_ATK_CRUSH_ID = "e-crush";

export const SPLIT_ROOK_ATK_CRUSH_DAMAGE = 12;

export const SPLIT_ROOK_ATK_FIRE_BOLT_DAMAGE = 8;

/** Kit-first leftover — phase-2 first-id, not restored here (#1261). */
export const SPLIT_ROOK_ATK_KIT_FIRST_SPELL = "spell-venom-strike";

export type SplitRookAtkExecute = {
  damage: number;
  hpAfter: number;
  playerDied: boolean;
};

export type SplitRookAtkArgs = {
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

export function isSplitRookAtkMinionId(minionId: string): boolean {
  return minionId.startsWith(SPLIT_ROOK_ATK_ID_PREFIX);
}

/** Live WX spawn `level = max(1, boss.init - 2)`. */
export function liveWxSplitRookMappedLevel(bossInit: number): number {
  return Math.max(1, finiteNonNeg(bossInit) - 2);
}

/**
 * Live WX spawn `damage` field. Unused by pack fallback melee; proven
 * leftover of the formula that also writes `atk: 0`.
 */
export function liveWxSplitRookMappedDamage(bossInit: number): number {
  const level = liveWxSplitRookMappedLevel(bossInit);
  return Math.max(1, Math.round(level * 2 + 3));
}

export function liveWxSplitRookMappedAtk(): number {
  return 0;
}

/** Live pack fallback melee: Crush 12 / Fire Bolt 8 × max(1, level/5). */
export function liveWxSplitRookMeleeFallback(
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

/** Advertised physical soak: RES only (split-rook atk is not a spell). */
export function splitRookAdvertisedAtkSoak(
  advertisedAtk: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(advertisedAtk);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecuteSplitRookAtk(args: SplitRookAtkArgs): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.adjacent !== true) return false;
  if (!isSplitRookAtkMinionId(args.minionId)) return false;
  return splitRookAdvertisedAtkSoak(args.advertisedAtk, args.playerRes) > 0;
}

/** Alias so decide and the melee restack cannot fork. */
export function shouldDecideSplitRookAtk(args: SplitRookAtkArgs): boolean {
  return canExecuteSplitRookAtk(args);
}

export function splitRookAtkHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised atk 25 on `split_rook_` rook
 * rows. Phantom / scroll / ghost / skeleton rows return null (siblings).
 */
export function resolveSplitRookCommittedAtk(args: {
  minionId: string;
  advertisedAtk: number;
}): number | null {
  if (!isSplitRookAtkMinionId(args.minionId)) return null;
  const atk = finiteNonNeg(args.advertisedAtk);
  if (atk <= 0) return null;
  return atk;
}

export function executeSplitRookAtk(
  args: SplitRookAtkArgs,
): SplitRookAtkExecute | null {
  if (!canExecuteSplitRookAtk(args)) return null;
  const damage = splitRookAdvertisedAtkSoak(args.advertisedAtk, args.playerRes);
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    playerDied: hpAfter <= 0,
  };
}
