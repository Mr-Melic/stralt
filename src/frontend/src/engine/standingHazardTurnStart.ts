/**
 * In-battle lava / spikes advertised standing tax never commits at
 * turn start.
 *
 * Advertised:
 *   BossGuide LAVA_TRAIL — "Avoid standing on or moving through its path."
 *   EnemyRegister Countess — "Avoid standing on tiles it walked across."
 *   BossGuide SPIKE_ON_LAND — "Stay mobile and avoid end-of-turn
 *     positioning on adjacent tiles."
 *   Walk packet (player leftover-walk rAF ~11428 / enemy apply ~16877):
 *     lava `8 + floor(random * 8)` → 8–15; spikes `5 + floor(random * 6)`
 *     → 5–10.
 *
 * Live:
 *   Player turn start (~14266) runs `applyTurnStart` (void/plague/mist/
 *   winds only) then plague / Void Rift store ticks. It never reads
 *   `hazardTiles` at the player cell.
 *   Enemy / summon-AI turn start (~14635 / ~14536) is the same modifier
 *   pair. Enemy landing (~16874) requires `newX !== originX || newY !==
 *   originY`, so skip-in-place / melee-at-origin pays 0.
 *   Controlled-summon walk landing is #1136 (same-tile click must not
 *   re-tax). Auto-summon MOVE is #758. Player leftover-walk soak is
 *   #1100. Thorn/rift walk is #1097.
 *
 * Sequence: player walks onto lava (packet 12, Burning 3×3). After
 * three turn-start Burning ticks the DoT expires (100−12−9 = 79).
 * End Turn without moving. Next player turn start.
 *
 * | | Expected (lava 12) | Actual (live turn-start 0) |
 * |---|---|---|
 * | packet | 12 | 0 |
 * | HP 79 after Burning | 67 | 79 |
 *
 * Two End Turns on lava 12: advertised 100−12−12 = 76; live 100.
 * 8 HP player on min lava 8: advertised lethal; live survives.
 * Enemy skip-in-place on stamp-20 HP lava 15: advertised 5; live 20.
 *
 * Unique leftover of **#1100** (walk rAF soak, dest change), **#1136**
 * (control-walk landing; same-tile click stays 0 by design), **#758**
 * (AI MOVE landing), **#1097** (thorn/rift walk), **#1142** (plague
 * turn-start), **#1182** (Void Rift turn-start). Ice Frozen re-apply is
 * a sibling leftover — not restored here.
 *
 * Export names stay unique vs `#1100` (`planLavaSpikeWalkHit`,
 * `LAVA_WALK_DAMAGE_MIN`), `#1136` (`planControlledSummonLanding`,
 * `shouldApplyControlledSummonLandingHazard`), `#758`
 * (`planAutoSummonLanding`).
 *
 * Do not restack WorldExploration / mapModifiers / battleSetup /
 * occupancy / enemyAI. Restack player / enemy / summon-control
 * turn-start onto `executeStandingHazardTurnStart` after those PRs
 * land. Do not undo leftover-walk tax, enemy landing
 * `newX !== origin`, same-tile control-walk skip, plague soak, or
 * Void Rift store HP.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const STANDING_HAZARD_TURN_START_LAVA_MIN = 8;
export const STANDING_HAZARD_TURN_START_LAVA_SPAN = 8;
export const STANDING_HAZARD_TURN_START_LAVA_MAX =
  STANDING_HAZARD_TURN_START_LAVA_MIN +
  STANDING_HAZARD_TURN_START_LAVA_SPAN -
  1;

export const STANDING_HAZARD_TURN_START_SPIKE_MIN = 5;
export const STANDING_HAZARD_TURN_START_SPIKE_SPAN = 6;
export const STANDING_HAZARD_TURN_START_SPIKE_MAX =
  STANDING_HAZARD_TURN_START_SPIKE_MIN +
  STANDING_HAZARD_TURN_START_SPIKE_SPAN -
  1;

/** Walk-applied Burning duration — expires before this leftover fires. */
export const STANDING_HAZARD_TURN_START_BURNING_TURNS = 3;

export const STANDING_HAZARD_TURN_START_BURNING_TICK = 3;

export type StandingHazardTurnStartKind = "lava" | "spikes";

export type StandingHazardTurnStartActor =
  | "player"
  | "enemy"
  | "controlled-summon";

export type StandingHazardTurnStartExecute = {
  damage: number;
  hpAfter: number;
  lethal: boolean;
};

export type StandingHazardTurnStartArgs = {
  inBattle: boolean;
  /** Walk / landing leftovers require a dest change. This path does not. */
  movedThisTurn: boolean;
  occupying: string | null | undefined;
  currentHp: number;
  lavaDmg: number;
  spikeDmg: number;
  actor: StandingHazardTurnStartActor;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function rollInRange(min: number, span: number, rng: () => number): number {
  const unit = Number(rng());
  if (!Number.isFinite(unit)) return min;
  const clamped = Math.max(0, Math.min(0.999999999, unit));
  return min + Math.floor(clamped * span);
}

export function isStandingHazardTurnStartKind(
  occupying: string | null | undefined,
): occupying is StandingHazardTurnStartKind {
  return occupying === "lava" || occupying === "spikes";
}

/** Live player / enemy / summon-control turn start never reads hazardTiles. */
export function liveWxStandingHazardTurnStartDamage(): number {
  return 0;
}

export function rollStandingHazardTurnStartLava(
  rng: () => number = Math.random,
): number {
  return rollInRange(
    STANDING_HAZARD_TURN_START_LAVA_MIN,
    STANDING_HAZARD_TURN_START_LAVA_SPAN,
    rng,
  );
}

export function rollStandingHazardTurnStartSpike(
  rng: () => number = Math.random,
): number {
  return rollInRange(
    STANDING_HAZARD_TURN_START_SPIKE_MIN,
    STANDING_HAZARD_TURN_START_SPIKE_SPAN,
    rng,
  );
}

export function advertisedStandingHazardTurnStartDamage(args: {
  occupying: string | null | undefined;
  lavaDmg: number;
  spikeDmg: number;
}): number {
  if (args.occupying === "lava") return finiteNonNeg(args.lavaDmg);
  if (args.occupying === "spikes") return finiteNonNeg(args.spikeDmg);
  return 0;
}

export function canExecuteStandingHazardTurnStart(
  args: StandingHazardTurnStartArgs,
): boolean {
  if (args.inBattle !== true) return false;
  if (args.movedThisTurn !== false) return false;
  if (
    args.actor !== "player" &&
    args.actor !== "enemy" &&
    args.actor !== "controlled-summon"
  ) {
    return false;
  }
  if (!isStandingHazardTurnStartKind(args.occupying)) return false;
  return advertisedStandingHazardTurnStartDamage(args) > 0;
}

/** Alias so decide and the turn-start restack cannot fork. */
export function shouldDecideStandingHazardTurnStart(
  args: StandingHazardTurnStartArgs,
): boolean {
  return canExecuteStandingHazardTurnStart(args);
}

export function standingHazardTurnStartHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Turn-start restack: tax the occupied lava / spikes cell when the unit
 * did not walk this turn. Walk dest-change, ice Frozen, plague, and
 * Void Rift return null (siblings).
 */
export function resolveStandingHazardTurnStartPacket(
  args: StandingHazardTurnStartArgs,
): number | null {
  if (!canExecuteStandingHazardTurnStart(args)) return null;
  return advertisedStandingHazardTurnStartDamage(args);
}

export function executeStandingHazardTurnStart(
  args: StandingHazardTurnStartArgs,
): StandingHazardTurnStartExecute | null {
  const damage = resolveStandingHazardTurnStartPacket(args);
  if (damage == null) return null;
  const hp = finiteNonNeg(args.currentHp);
  const { newHp, lethal } = hpAfterIncomingDamage(hp, damage);
  return {
    damage,
    hpAfter: newHp,
    lethal,
  };
}
