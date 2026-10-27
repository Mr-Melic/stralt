/**
 * Titan's Vigor vs advertised damage rolls 1–5× on Strike and incoming hits.
 *
 * Registry (`mapModifiers.ts` `titans_vigor`) announces
 *   "Titan's Vigor: +1000 HP, damage rolls 1-5x."
 * `MAP_MODIFIER_TITANS_VIGOR_MIN_MULTIPLIER` is 1 and
 * `MAP_MODIFIER_TITANS_VIGOR_MAX_MULTIPLIER` is 5. `onDamageDealt` does
 * `Math.floor(ctx.rng() * 5) + 1` then `damage * roll`. The +1000 HP
 * stamp is **#1203** — this sidecar does not add `hp` / `maxHp`.
 *
 * Live WorldExploration never does for the primary packets:
 * - `applyDamageDealt` has one caller: `enemyTakesDamage`. That leftover
 *   already writes `_dmgAfterMods` onto enemy HP (Sacrifice / DoT-on-enemy
 *   / Chain Lightning bounce / kit-vs-summon), so those paths already
 *   roll 1–5×. Do not restack this execute there or the packet rolls twice.
 * - Primary Strike / Shadow Strike / Attack Nearest (mouse and touch)
 *   go through `applyDamageToEnemy` and write `enemyPrevHp - finalDmg`
 *   with no hook. A 10-damage Strike vs 15 HP leaves 5 live; advertised
 *   roll 5 (50) is lethal.
 * - Incoming kit hits go through `playerTakesDamage` (RES, then
 *   `hpAfterIncomingDamage`) with no hook. Enemy melee skips
 *   `playerTakesDamage` entirely (raw `setCharacterStats`) — same skip
 *   class, not this execute.
 *
 * Sequence: Titan's Vigor map → Strike (`physical_attack` 10) vs enemy
 * 15 HP, 0 RES, no crit/mark, rng 0.8 → roll 5 → expected 0 (lethal),
 * actual 5.
 *
 * Unique vs **#1160** (Glass Realm Strike / incoming ×2 — same skip
 * class; that execute returns no `roll` and is a fixed ×2), **#1148**
 * (Vampiric Ground attacker stub on this same hook; that sidecar does
 * not rewrite the damage packet), **#1203** (Titan player +1000 HP
 * `applyBattleStart` skip), **#1104** (boss kit CHC), **#1200** (Iron
 * Curse player RES ×1.3). Do not add `heal` / `res` / `chc` / `hp`
 * stamp / Glass `×2` without a roll.
 *
 * Do not restack WorldExploration / castHelpers / mapModifiers.
 * Restack `applyDamageToEnemy` and `playerTakesDamage` onto
 * `executeTitanVigorDamageRoll` after older combat PRs land, then write
 * the returned `hpAfter`. Leave `enemyTakesDamage`'s `_dmgAfterMods`
 * write alone. Do not undo the leftover `_dmgAfterMods` write — that
 * valid Sacrifice / DoT / bounce path already rolls.
 */

import {
  MAP_MODIFIER_TITANS_VIGOR_MAX_MULTIPLIER,
  MAP_MODIFIER_TITANS_VIGOR_MIN_MULTIPLIER,
} from "../data/gameConstants.ts";

export const TITANS_VIGOR_DAMAGE_MODIFIER_ID = "titans_vigor";

export type TitanVigorDamageRollExecute = {
  damage: number;
  roll: number;
  hpAfter: number;
};

export function isTitansVigorDamageModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === TITANS_VIGOR_DAMAGE_MODIFIER_ID;
}

/**
 * Registry `onDamageDealt`: `Math.floor(rng() * 5) + 1`. Non-finite rng
 * yields the advertised minimum (1).
 */
export function titanVigorDamageRoll(rng: () => number): number {
  const min = MAP_MODIFIER_TITANS_VIGOR_MIN_MULTIPLIER;
  const max = MAP_MODIFIER_TITANS_VIGOR_MAX_MULTIPLIER;
  const span = max - min + 1;
  const u = Number(rng());
  const unit = Number.isFinite(u) ? u : 0;
  return Math.floor(unit * span) + min;
}

/** Advertised `damage * roll`. Missing / non-positive packets yield 0. */
export function titanVigorRolledDamage(
  baseDamage: number,
  rng: () => number,
): { damage: number; roll: number } {
  const packet = Number(baseDamage);
  if (!Number.isFinite(packet) || packet <= 0) {
    return { damage: 0, roll: 0 };
  }
  const roll = titanVigorDamageRoll(rng);
  return { damage: packet * roll, roll };
}

/** Live primary Strike / applyDamageToEnemy never calls applyDamageDealt. */
export function wxPrimaryStrikeAppliesTitanVigorRoll(): boolean {
  return false;
}

/** Live playerTakesDamage never calls applyDamageDealt. */
export function wxIncomingHitAppliesTitanVigorRoll(): boolean {
  return false;
}

/** Live enemy melee writes HP without playerTakesDamage or the hook. */
export function wxEnemyMeleeAppliesTitanVigorRoll(): boolean {
  return false;
}

/**
 * Live enemyTakesDamage already writes `_dmgAfterMods` (Sacrifice / DoT
 * / bounce). Restacking this sidecar there would roll twice.
 */
export function wxEnemyTakesDamageAppliesTitanVigorRoll(): boolean {
  return true;
}

/** Live WX never writes advertised 1–5× onto Strike HP. */
export function liveWxTitansVigorRollsStrike(): boolean {
  return false;
}

/** Live WX never writes advertised 1–5× onto playerTakesDamage HP. */
export function liveWxTitansVigorRollsIncoming(): boolean {
  return false;
}

export function canExecuteTitanVigorDamageRoll(args: {
  modifierActive: boolean;
  damage: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  const packet = Number(args.damage);
  return Number.isFinite(packet) && packet > 0;
}

/** Alias so decide and the Strike / incoming restack cannot fork. */
export function shouldDecideTitanVigorDamageRoll(
  args: Parameters<typeof canExecuteTitanVigorDamageRoll>[0],
): boolean {
  return canExecuteTitanVigorDamageRoll(args);
}

export function titanVigorHighlightedRollIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised damage ×1–5 onto the target HP. Incoming ≤ 0 is a
 * no-op so a missing packet cannot mint 1 HP from Math.max(1, …).
 * Glass ×2 / Vampiric heal / RES / CHC / Titan +1000 HP are not in
 * this payload.
 */
export function executeTitanVigorDamageRoll(args: {
  modifierActive: boolean;
  damage: number;
  currentHp: number;
  rng: () => number;
}): TitanVigorDamageRollExecute | null {
  if (!canExecuteTitanVigorDamageRoll(args)) return null;
  const { damage, roll } = titanVigorRolledDamage(args.damage, args.rng);
  if (damage <= 0) return null;
  const hp = Math.max(0, Number(args.currentHp) || 0);
  return { damage, roll, hpAfter: Math.max(0, hp - damage) };
}
