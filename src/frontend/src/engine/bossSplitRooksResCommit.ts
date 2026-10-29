/**
 * Fetid Rook SPLIT_ROOKS advertised RES 18 never commits.
 *
 * Advertised (`applySplitRooks`, useBossSystem ~502–549):
 *   pieceType rook, hp ceil(boss.hp/2), ap boss.ap (5),
 *   atk floor(atk*0.8) (32 → 25), res boss.res (Fetid catalog 18),
 *   init boss.init - 1. id `split_rook_${i}_${Date.now()}`
 *
 * Live WorldExploration spawn commit (~16104–16189):
 *   hp/maxHp formula then enemyHpMap stamp 20  // leftover of #1231
 *   atk: 0, ap: 0                             // leftover of #1271
 *   res: 0                                    // advertised 18 discarded
 *
 * Live player Strike / Attack Nearest / sprite / keyboard S all reach
 * `computeDamage` (~3347) which soaks `targetEnemy.res`. Pack fallback
 * melee (~16704) is the outgoing twin hit (#1271) and never reads the
 * twin's RES. `enemyTakesDamage` (~3489) soaks `enemy.res` for DoT /
 * summon-target leftovers — not restored here.
 *
 * Sequence: Fetid split rook already spawned (kit-first Venom still
 * shadows decide — leftover of #1261). Player Strike 10 vs the twin on
 * the live stamp-20 HP map (HP leftover of #1231), 0 extra RES mods.
 *
 * | | Expected (res 18) | Actual (live WX res 0) |
 * |---|---|---|
 * | packet | 8 | 10 |
 * | twin HP | 12 | 10 |
 *
 * Two Strike 10: advertised 20−8−8 = 4 (still occupies); live 20−10−10
 * = 0 (two hits kill). 9 HP twin: advertised leaves 1; live Strike 10
 * kills.
 *
 * Unique leftover of **#1231** (rook advertised 210 vs WX stamp 20;
 * that sidecar subtracted unsoaked Strike 10) and **#1271** (outgoing
 * atk 25 vs Crush 12). Unique vs **#1200** (Iron Curse player RES ×1.3),
 * **#1257** / **#1262** (player SR soak on incoming pack / kit casts),
 * **#1278** (skeleton pawn atk 8; advertised minion res 2 does not
 * change Strike 10 after round). Ghost / scroll / phantom advertise
 * res 0, matching the stamp. Do not add `hp` / `atk` / `ap` / `chc` /
 * `heal` / `roll` / `glass` / `glyph` / `venom` / `decide` / `sr`.
 *
 * Export names stay unique vs `#1271` (`SPLIT_ROOK_ATK`,
 * `resolveSplitRookCommittedAtk`, `isSplitRookAtkMinionId`,
 * `liveWxSplitRookMappedAtk`), `#1231` (`resolveFetidSplitRookCommittedHp`,
 * `wxFetidSplitRookLiveCommittedHp`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / enemyAI /
 * castHelpers / spellEngine. Restack spawn mapping onto
 * `resolveSplitRookCommittedRes` and the Strike HP write onto
 * `executeSplitRookResSoak` after those PRs land. Do not undo
 * ADD-vs-REPLACE (`#433`), the skeleton-20 stamp, kit-first Venom
 * (`#1261`), the half-HP stamp (`#1231`), or advertised atk 25 (`#1271`).
 */

export const SPLIT_ROOK_RES_PACKET = 18;

export const SPLIT_ROOK_RES_ID_PREFIX = "split_rook_";

export const SPLIT_ROOK_RES_PIECE = "rook";

export const SPLIT_ROOK_RES_BOSS_ID = "fetid_rook";

/** Catalog Fetid Rook `baseStats.res`. */
export const SPLIT_ROOK_RES_BOSS_RES = 18;

/** Catalog Strike (`physical_attack`) damage. */
export const SPLIT_ROOK_RES_STRIKE_DAMAGE = 10;

/** Live `enemyHpMap` stamp — HP leftover of #1231, not restored here. */
export const SPLIT_ROOK_RES_WX_HP_STAMP = 20;

/** Advertised AP — leftover, not restored here (#1271). */
export const SPLIT_ROOK_RES_AP_LEFTOVER = 5;

/** Advertised atk — leftover of #1271, not restored here. */
export const SPLIT_ROOK_RES_ATK_LEFTOVER = 25;

/**
 * Pale Archbishop skeleton advertised res 2 — Strike 10 still rounds to
 * 10, so it is not this integer fork.
 */
export const SPLIT_ROOK_RES_SKELETON_LEFTOVER = 2;

/** Kit-first leftover — phase-2 first-id, not restored here (#1261). */
export const SPLIT_ROOK_RES_KIT_FIRST_SPELL = "spell-venom-strike";

export type SplitRookResExecute = {
  damage: number;
  hpAfter: number;
  twinDied: boolean;
};

export type SplitRookResArgs = {
  minionId: string;
  advertisedRes: number;
  strikeDamage: number;
  currentHp: number;
  /** Frost Bolt / SR stacking is a leftover; this sidecar is Strike RES. */
  isPhysical: boolean;
  /** Player-side Strike / Attack Nearest / sprite dest vs the twin. */
  targetIsTwin: boolean;
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

export function isSplitRookResMinionId(minionId: string): boolean {
  return minionId.startsWith(SPLIT_ROOK_RES_ID_PREFIX);
}

/** Live WX spawn `res: 0`. */
export function liveWxSplitRookMappedRes(): number {
  return 0;
}

/** Production `applySplitRooks` `res: params.bossEntry.res`. */
export function advertisedSplitRookRes(bossRes: number): number {
  return finitePct(bossRes);
}

/**
 * Live WX `computeDamage` physical soak: `round(dmg * (1 - res/100))`,
 * min 1 when the pre-soak packet is positive.
 */
export function splitRookAdvertisedResSoak(
  strikeDamage: number,
  advertisedRes: number,
): number {
  const raw = finiteNonNeg(strikeDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(advertisedRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function canExecuteSplitRookResSoak(args: SplitRookResArgs): boolean {
  if (args.targetIsTwin !== true) return false;
  if (args.isPhysical !== true) return false;
  if (!isSplitRookResMinionId(args.minionId)) return false;
  return splitRookAdvertisedResSoak(args.strikeDamage, args.advertisedRes) > 0;
}

/** Alias so decide and the Strike restack cannot fork. */
export function shouldDecideSplitRookResSoak(args: SplitRookResArgs): boolean {
  return canExecuteSplitRookResSoak(args);
}

export function splitRookResHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Spawn-mapping restack: keep advertised res 18 on `split_rook_` rook
 * rows. Ghost / phantom / scroll / skeleton rows return null (siblings).
 */
export function resolveSplitRookCommittedRes(args: {
  minionId: string;
  advertisedRes: number;
}): number | null {
  if (!isSplitRookResMinionId(args.minionId)) return null;
  const res = finitePct(args.advertisedRes);
  if (res <= 0) return null;
  return res;
}

export function executeSplitRookResSoak(
  args: SplitRookResArgs,
): SplitRookResExecute | null {
  if (!canExecuteSplitRookResSoak(args)) return null;
  const damage = splitRookAdvertisedResSoak(
    args.strikeDamage,
    args.advertisedRes,
  );
  const hp = finiteNonNeg(args.currentHp);
  const hpAfter = Math.max(0, hp - damage);
  return {
    damage,
    hpAfter,
    twinDied: hpAfter <= 0,
  };
}
