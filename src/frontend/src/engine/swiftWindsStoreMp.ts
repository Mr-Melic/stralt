/**
 * Swift Winds vs advertised +2 MP on enemy / summon turns.
 *
 * Registry (`mapModifiers.ts` `swift_winds`) announces
 *   "Swift Winds: +2 MP each turn."
 * `MAP_MODIFIER_SWIFT_WINDS_MP_BONUS` is 2. `onTurnStart` does
 * `combatant.mp = (combatant.mp ?? 0) + 2`.
 *
 * Live `advanceTurn` does call `applyTurnStart` on enemy, enemy-summon,
 * and player-controlled summon branches. That mutates the turn-order
 * copy only (`CombatantEntry` has no `mp` / `currentMp`). Store walk
 * budget is `currentMp` (`summonExecutor` / control-mode
 * `summonTurnBudget`). After the hook, control mode still assigns
 * `currentMp = maxMp` and `handleSummonTurn` still resets
 * `currentMp = maxMp`. A 3-MP Wolf stays at 3 walk tiles; advertised
 * +2 would leave 5.
 *
 * Sequence: Swift Winds map → End Turn / 30s timer on a 3-max-MP
 * summon → expected store currentMp 5, actual 3.
 *
 * Unique vs **#443** (`resolvePlayerTurnStartModifierVitals` — player
 * lives outside `combatantsRef`; this path *does* call `applyTurnStart`
 * and still misses store `currentMp`), **#1199** (Mending Mist store
 * HP on the same three arms; HP, not MP), **#1182** (player Void Rift
 * −3), **#596** (Haste spell buff on the player pool). Player-turn
 * Swift Winds stays on **#443**. Do not add `hp` / `healUsed`.
 *
 * Do not restack WorldExploration / mapModifiers / combatantStore /
 * summonControlCast. Restack the three `applyTurnStart` arms onto
 * `executeSwiftWindsStoreMp` after older combat PRs land, then
 * `updateCombatant(id, { currentMp: mpAfter })` **after** the per-turn
 * restore (`summonTurnBudget` / `currentMp = maxMp`).
 */

import { MAP_MODIFIER_SWIFT_WINDS_MP_BONUS } from "../data/gameConstants.ts";

export const SWIFT_WINDS_MODIFIER_ID = "swift_winds";

export type SwiftWindsStoreMp = {
  bonus: number;
  mpAfter: number;
};

export function isSwiftWindsModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === SWIFT_WINDS_MODIFIER_ID;
}

/** Advertised +2. Non-finite bonus cannot mint MP. */
export function swiftWindsMpBonus(): number {
  const bonus = Number(MAP_MODIFIER_SWIFT_WINDS_MP_BONUS);
  if (!Number.isFinite(bonus) || bonus <= 0) return 0;
  return bonus;
}

/** Live enemy-ai turn start never `updateCombatant`s Swift Winds MP. */
export function wxEnemyTurnStartCommitsSwiftWindsStoreMp(): boolean {
  return false;
}

/** Live enemy-summon turn start never `updateCombatant`s Swift Winds MP. */
export function wxEnemySummonTurnStartCommitsSwiftWindsStoreMp(): boolean {
  return false;
}

/**
 * Live player-controlled summon turn start restores `currentMp` from
 * `maxMp` after `applyTurnStart` and never adds the advertised +2.
 */
export function wxPlayerSummonTurnStartCommitsSwiftWindsStoreMp(): boolean {
  return false;
}

/** Live WX never writes advertised +2 onto store currentMp. */
export function liveWxSwiftWindsAddsStoreMp(): boolean {
  return false;
}

export function canExecuteSwiftWindsStoreMp(args: {
  modifierActive: boolean;
  restoredMp: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  if (swiftWindsMpBonus() <= 0) return false;
  const restored = Number(args.restoredMp);
  return Number.isFinite(restored) && restored >= 0;
}

/** Alias so decide and the three turn-start restacks cannot fork. */
export function shouldDecideSwiftWindsStoreMp(
  args: Parameters<typeof canExecuteSwiftWindsStoreMp>[0],
): boolean {
  return canExecuteSwiftWindsStoreMp(args);
}

export function swiftWindsHighlightedBonusIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised +2 MP onto the restored per-turn pool. Bonus sits
 * on top of restore (maxMp for summons), matching #443's player
 * formula-restore-then-+2. Inactive / non-finite restore is a no-op so
 * a missing tick cannot mint MP. Haste / Mist HP / player healUsed are
 * not in this payload.
 */
export function executeSwiftWindsStoreMp(args: {
  modifierActive: boolean;
  restoredMp: number;
}): SwiftWindsStoreMp | null {
  if (!canExecuteSwiftWindsStoreMp(args)) return null;
  const restored = Math.max(0, Math.floor(Number(args.restoredMp)));
  const bonus = swiftWindsMpBonus();
  return {
    bonus,
    mpAfter: restored + bonus,
  };
}
