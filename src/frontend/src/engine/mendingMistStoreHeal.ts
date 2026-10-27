/**
 * Mending Mist vs advertised 5% max-HP regen on enemy / summon turns.
 *
 * Registry (`mapModifiers.ts` `mending_mist`) announces
 *   "Mending Mist: 5% max HP regen each turn."
 * `MAP_MODIFIER_MENDING_MIST_REGEN_PERCENT` is 0.05. `onTurnStart`
 * does `floor(maxHp * 0.05)` then `combatant.hp += regen`.
 *
 * Live `advanceTurn` does call `applyTurnStart` on enemy, enemy-summon,
 * and player-controlled summon branches. That mutates the turn-order
 * copy only. Store HP is authoritative (`hpAfterHeal` / `enemyTakesDamage`).
 * Plague Zone and Void Rift then re-read `getLiveCombatants` and
 * `updateCombatant`. Mending Mist has no such store write, so a wounded
 * pawn stays at the pre-regen snapshot and the next Strike can kill a
 * unit the strip still shows as wounded.
 *
 * Sequence: Mending Mist map → End Turn / 30s timer (enemy turn-start)
 * on a 40 max-HP pawn at 20 HP → expected store 22, actual 20.
 *
 * Unique vs **#443** (`resolvePlayerTurnStartModifierVitals` — player
 * lives outside `combatantsRef`; this path *does* call `applyTurnStart`
 * and still misses the store), **#1182** (player Void Rift −3 with
 * RES/shield; damage, not heal), plague / Void Rift enemy store commits
 * on main (WX `isPlagueZone` / `isVoidRift` + `updateCombatant`; damage
 * ticks), **#1148** (Vampiric Ground attacker lifesteal on
 * `applyDamageDealt`), **#1155** (Iron Curse heal ×0.5 on spell heals).
 * Player-turn Mist / Swift Winds stay on **#443**. Swift Winds +2 MP on
 * this same turn-order copy is a sibling leftover — do not add `mp`.
 * Iron Curse ×0.5 on this regen is a leftover of **#1155** — do not
 * halve here.
 *
 * Do not restack WorldExploration / mapModifiers / battleSetup /
 * combatantStore. Restack the three `applyTurnStart` arms onto
 * `executeMendingMistStoreHeal` after older combat PRs land, then
 * `updateCombatant(id, { hp: hpAfter })`.
 */

import { MAP_MODIFIER_MENDING_MIST_REGEN_PERCENT } from "../data/gameConstants.ts";
import { hpAfterHeal } from "./battleSetup.ts";

export const MENDING_MIST_MODIFIER_ID = "mending_mist";

export type MendingMistStoreHeal = {
  heal: number;
  hpAfter: number;
};

export function isMendingMistModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === MENDING_MIST_MODIFIER_ID;
}

/** Advertised floor(maxHp * 0.05). Non-finite / ≤0 max HP yield 0. */
export function mendingMistRegenAmount(maxHp: number): number {
  const max = Number(maxHp);
  if (!Number.isFinite(max) || max <= 0) return 0;
  return Math.floor(max * MAP_MODIFIER_MENDING_MIST_REGEN_PERCENT);
}

/** Live enemy-ai turn start never `updateCombatant`s Mist regen. */
export function wxEnemyTurnStartCommitsMendingMistStoreHp(): boolean {
  return false;
}

/** Live enemy-summon turn start never `updateCombatant`s Mist regen. */
export function wxEnemySummonTurnStartCommitsMendingMistStoreHp(): boolean {
  return false;
}

/**
 * Live player-controlled summon turn start never `updateCombatant`s
 * Mist regen. Void Rift on this arm already does.
 */
export function wxPlayerSummonTurnStartCommitsMendingMistStoreHp(): boolean {
  return false;
}

/** Live WX never writes advertised regen onto store HP. */
export function liveWxMendingMistHealsStoreHp(): boolean {
  return false;
}

export function canExecuteMendingMistStoreHeal(args: {
  modifierActive: boolean;
  maxHp: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  return mendingMistRegenAmount(args.maxHp) > 0;
}

/** Alias so decide and the three turn-start restacks cannot fork. */
export function shouldDecideMendingMistStoreHeal(
  args: Parameters<typeof canExecuteMendingMistStoreHeal>[0],
): boolean {
  return canExecuteMendingMistStoreHeal(args);
}

export function mendingMistHighlightedHealIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised 5% max-HP regen onto store HP. Caps at maxHp via
 * `hpAfterHeal`. Regen 0 (tiny maxHp / inactive modifier) is a no-op
 * so a missing tick cannot mint HP. Iron Curse ×0.5 / Swift Winds MP /
 * player `healUsed` are not in this payload.
 */
export function executeMendingMistStoreHeal(args: {
  modifierActive: boolean;
  hp: number;
  maxHp: number;
}): MendingMistStoreHeal | null {
  if (!canExecuteMendingMistStoreHeal(args)) return null;
  const heal = mendingMistRegenAmount(args.maxHp);
  return {
    heal,
    hpAfter: hpAfterHeal(args.hp, args.maxHp, heal),
  };
}
