/**
 * Boss kit damage/drain casts skip advertised player Mirror reflect.
 *
 * Advertised (`spell-mirror` / `playerMirror.ts` / pack CAST ~16497):
 *   single-target non-AoE incoming spell + `consumePlayerMirror("player")`
 *   → damage reflects onto the attacker (boss RES only); player HP unchanged.
 *
 * Live WorldExploration kit apply (~15859–15867):
 *   bRawDmg = Number(bossSpell.damage)
 *   playerTakesDamage(bRawDmg)  // RES only; never reads mirrorUnitsRef
 *   Mirror token stays charged; the next pack CAST may steal it.
 *
 * `pickBossKitSpell` always receives `new Map()`, so Pale Archbishop /
 * Midnight Bishop / Chessboard Lich / Pale Archivist phase 1 first-id
 * `spell-cursed-wound` (Cursed Wound 22, not hitsMultiple) is decided
 * every turn. Kit apply skips the pack Mirror gate (`!hitsMultiple &&
 * !aoe && consumePlayerMirror`). Pack CAST of the same spell reflects.
 *
 * Chain Lightning first-ids are hitsMultiple — pack also skips Mirror;
 * bounce is **#868**. Kit SR soak is **#1262**. Boss self-Mirror token
 * is **#852**. Player Mirror self-tile highlight is **#496**. Kit range
 * skip is **#888**. Kit CHC / kit SP leftover is **#1104**.
 *
 * Sequence: player Mirror armed, Pale Archbishop kit Cursed Wound raw 22
 * vs boss RES 0 / player HP 100 at Chebyshev 2.
 *
 * | | Expected | Actual (live) |
 * |---|---|---|
 * | Mirror | consume + reflect 22 onto the bishop | unused |
 * | player HP | 100 | RES-only hit → 78 |
 *
 * Unique vs **#852** (boss `isMirror` self token), **#496** (player
 * self-tile), **#1262** (kit SR soak once the hit lands), **#868**
 * (hitsMultiple bounce), **#888** (kit range), **#1257** (pack SR),
 * **#1260** / **#1263** (summon-control dest). Do not add `chc` /
 * `sr` / `heal` / `roll` / `glass` / `bounces` / `apDrainLastTurn`.
 *
 * Do not restack WorldExploration / spellEngine / useBossAI / enemyAI /
 * playerMirror. Restack the kit damage arm onto
 * `executeBossKitPlayerMirrorReflect` after those PRs land (consume the
 * token, write `playerHpAfter` / `bossHpAfter`; do not feed the packet
 * back through `playerTakesDamage`). Do not undo pack Mirror, kit SR
 * soak, or kit bounce.
 */

import {
  PLAYER_MIRROR_KEY,
  consumePlayerMirror,
} from "../utils/playerMirror.ts";

export { PLAYER_MIRROR_KEY };

/** Catalog Cursed Wound — Pale Archbishop / Midnight Bishop / Lich / Archivist first-id. */
export const BOSS_KIT_PLAYER_MIRROR_FIRE_SPELL_ID = "spell-cursed-wound";

export const BOSS_KIT_PLAYER_MIRROR_FIRE_DAMAGE = 22;

export const BOSS_KIT_PLAYER_MIRROR_FIRE_RANGE = 3;

export type BossKitPlayerMirrorReflectExecute = {
  reflectedDamage: number;
  playerHpAfter: number;
  bossHpAfter: number;
  playerDied: boolean;
  bossDied: boolean;
  mirrorConsumed: boolean;
};

export type BossKitPlayerMirrorReflectArgs = {
  /** Catalog `damage` before soak (`bRawDmg`). */
  rawDamage: number;
  bossRes: number;
  playerHp: number;
  bossHp: number;
  /** Kit summon short-circuit never reaches this arm. */
  targetIsPlayer: boolean;
  /**
   * Physical / melee soak is RES-only and is not advertised as a "spell".
   * Kit `physical_attack` first-ids — leave.
   */
  isSpell: boolean;
  /** Pack CAST also skips Mirror when `hitsMultiple` (Chain Lightning / #868). */
  hitsMultiple: boolean;
  /** Pack CAST also skips Mirror when `aoe`. */
  aoe: boolean;
  /** Chebyshev from boss to the aimed player tile. */
  chebyshev: number;
  /** Catalog `range`. Kit apply skips `inRange`; this sidecar uses it as the execute gate only. */
  range: number;
  /** Live `mirrorUnitsRef`. Advertised consume uses the `"player"` token. */
  mirrorUnits: Set<string>;
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

/**
 * Advertised pack-CAST reflect packet: attacker RES only, floor 1.
 * Player SR / RES do not soak a reflected spell.
 */
export function bossKitPlayerMirrorAdvertisedReflect(
  rawDamage: number,
  bossRes: number,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(bossRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

/**
 * Live WX kit damage arm: `playerTakesDamage(raw)` applies player RES only
 * and never consumes Mirror. Proven by the source scan in the test file.
 */
export function liveWxBossKitPlayerMirrorHit(
  rawDamage: number,
  playerRes: number,
): number {
  const raw = finiteNonNeg(rawDamage);
  if (raw <= 0) return 0;
  const resFactor = Math.max(0, 1 - finitePct(playerRes) / 100);
  return Math.max(1, Math.round(raw * resFactor));
}

export function liveWxBossKitSpellConsumesPlayerMirror(): boolean {
  return false;
}

export function canExecuteBossKitPlayerMirrorReflect(
  args: BossKitPlayerMirrorReflectArgs,
): boolean {
  if (args.targetIsPlayer !== true) return false;
  if (args.isSpell !== true) return false;
  if (args.hitsMultiple === true) return false;
  if (args.aoe === true) return false;
  if (finiteNonNeg(args.chebyshev) > finiteNonNeg(args.range)) return false;
  if (finiteNonNeg(args.rawDamage) <= 0) return false;
  if (!args.mirrorUnits.has(PLAYER_MIRROR_KEY)) return false;
  return bossKitPlayerMirrorAdvertisedReflect(args.rawDamage, args.bossRes) > 0;
}

/** Alias so decide and the cast restack cannot fork. */
export function shouldDecideBossKitPlayerMirrorReflect(
  args: BossKitPlayerMirrorReflectArgs,
): boolean {
  return canExecuteBossKitPlayerMirrorReflect(args);
}

export function bossKitPlayerMirrorHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

export function executeBossKitPlayerMirrorReflect(
  args: BossKitPlayerMirrorReflectArgs,
): BossKitPlayerMirrorReflectExecute | null {
  if (!canExecuteBossKitPlayerMirrorReflect(args)) return null;
  const consumed = consumePlayerMirror(args.mirrorUnits);
  if (!consumed) return null;
  const reflectedDamage = bossKitPlayerMirrorAdvertisedReflect(
    args.rawDamage,
    args.bossRes,
  );
  const playerHp = finiteNonNeg(args.playerHp);
  const bossHpAfter = Math.max(0, finiteNonNeg(args.bossHp) - reflectedDamage);
  return {
    reflectedDamage,
    playerHpAfter: playerHp,
    bossHpAfter,
    playerDied: false,
    bossDied: bossHpAfter <= 0,
    mirrorConsumed: true,
  };
}
