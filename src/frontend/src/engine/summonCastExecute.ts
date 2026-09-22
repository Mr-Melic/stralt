/**
 * Summon AI execute gates shared with decide (`enemyCastRangeOk` /
 * adjacent melee) and player AoE liveness (`isAliveCombatant`).
 *
 * `executeSummonAction` used to debit AP and apply effects after decide
 * without re-checking range, and splash lists could include corpses.
 * Decide vs execute then drifted: an in-range decided target must still
 * execute, and an out-of-range or dead occupant must not. Do not switch
 * AI range to `spellRangeBase` — that would rebalance bishop frost.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  chebyshevOnBoard,
  enemyCastRangeOk,
} from "./targeting.ts";

export type SummonExecuteCell = { x: number; y: number };

export type SummonExecuteTargetLookup = {
  x: number;
  y: number;
  hp?: number;
  side?: string;
  isSummon?: boolean;
};

/**
 * `getEnemyById` only searches the enemy roster. Decide uses id `"player"`
 * for the human combatant. Optional `playerTarget` is that cell.
 */
export function resolveSummonExecuteTarget(args: {
  targetId: string;
  found?: SummonExecuteTargetLookup | null;
  playerTarget?: SummonExecuteCell | null;
  getTargetPos?: (id: string) => SummonExecuteCell | undefined;
}): SummonExecuteCell | null {
  if (args.found) {
    return { x: args.found.x, y: args.found.y };
  }
  const fromLookup = args.getTargetPos?.(args.targetId);
  if (fromLookup) {
    return { x: fromLookup.x, y: fromLookup.y };
  }
  if (
    (args.targetId === "player" || args.targetId === "__player__") &&
    args.playerTarget
  ) {
    return { x: args.playerTarget.x, y: args.playerTarget.y };
  }
  return null;
}

/** Same range half as `aiCanCast` / WorldExploration enemy execute. */
export function summonExecuteCastAllowed(
  origin: CasterPosition,
  target: SummonExecuteCell,
  spell: Pick<SpellConfig, "range"> | { range?: unknown },
): boolean {
  return enemyCastRangeOk(origin, target, spell as Pick<SpellConfig, "range">);
}

/** Decide melee is adjacent (Chebyshev ≤ 1). Execute must match. */
export function summonExecuteMeleeAllowed(
  origin: CasterPosition,
  target: SummonExecuteCell,
): boolean {
  return chebyshevOnBoard(origin, target) <= 1;
}

/**
 * When the cell is known, execute only if decide would. When it is not
 * (player id and no `playerTarget` wired), keep the historic apply path
 * so DoT/heal on `"player"` does not regress.
 */
export function summonExecuteCastProceeds(args: {
  origin: CasterPosition;
  target: SummonExecuteCell | null;
  spell: Pick<SpellConfig, "range"> | { range?: unknown };
}): boolean {
  if (!args.target) return true;
  return summonExecuteCastAllowed(args.origin, args.target, args.spell);
}

export function summonExecuteMeleeProceeds(args: {
  origin: CasterPosition;
  target: SummonExecuteCell | null;
}): boolean {
  if (!args.target) return true;
  return summonExecuteMeleeAllowed(args.origin, args.target);
}

/**
 * Splash may hit the opposite living side (including player-side summons).
 * Corpses (`hp <= 0`) must not take a second hit after kill detection.
 */
export function summonAoEVictimAllowed(
  victim: {
    hp?: number;
    side?: string;
    id?: string;
  },
  casterSide: "player" | "enemy",
  primaryId: string,
): boolean {
  if (victim.id === primaryId) return false;
  if (!isAliveCombatant({ hp: victim.hp ?? 0 })) return false;
  const side = victim.side === "player" ? "player" : "enemy";
  return side !== casterSide;
}
