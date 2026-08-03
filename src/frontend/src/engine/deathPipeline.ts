/**
 * Death pipeline — idempotent combatant death processing.
 *
 * Idempotency contract:
 *   `processCombatantDeath(id, ctx)` is safe to call any number of times for the
 *   same combatant id. The first invocation performs the full death sequence
 *   and returns `true`. Every subsequent invocation for an already-removed
 *   combatant is a no-op and returns `false`, regardless of which caller
 *   triggers it (turn-end sweep, damage handler, leader-death cascade, etc.).
 *
 * Ordering contract:
 *   The death sequence runs in a fixed, deliberate order so downstream
 *   callbacks can rely on prior state changes:
 *     1. Idempotency guard — bail if already removed.
 *     2. Snapshot name + position BEFORE removal (positions/names may become
 *        unavailable once the combatant is detached from the roster).
 *     3. Detach from the combatant roster.
 *     4. Detach from the turn queue.
 *     5. Detach from the initiative strip UI.
 *     6. Trigger the shatter VFX at the death position.
 *     7. Log the defeat message.
 *     8. Apply leader-death boost (if the dead combatant was a leader).
 *     9. Recheck victory/defeat conditions.
 *    10. Attribute the kill reward.
 *
 * This module is intentionally React- and actor-free. It depends only on the
 * `DeathPipelineCtx` interface, which the caller implements against whatever
 * runtime (React state, Motoko actor, etc.) owns the combatant state.
 */

import { logDebugInfo } from "../utils/debugLogger";

/**
 * Callback bundle supplied by the caller. Each callback mutates or queries the
 * caller's own combatant state; this module never touches that state directly.
 */
export interface DeathPipelineCtx {
  /** Detach the combatant from the active roster. */
  removeCombatant(id: string): void;
  /** Remove the combatant from the pending turn queue. */
  removeFromTurnQueue(id: string): void;
  /** Remove the combatant from the initiative strip UI. */
  removeFromInitiativeStrip(id: string): void;
  /** Fire the shatter visual effect at the given board position. */
  triggerShatter(id: string, x: number, y: number): void;
  /** Append a "defeated" entry to the combat log. */
  logDefeated(name: string): void;
  /** Apply a leader-death boost triggered by this combatant's death.
   *
   * `side` and `isSummon` are the dead combatant's values snapshotted BEFORE
   * removal (step 2 below), so the boost can guard against summons and
   * player-side deaths even though the dead entity is no longer in the live
   * roster by the time this runs (step 8). The boost + leader-death
   * animation must fire ONLY for a real enemy-side non-summon leader. */
  applyLeaderDeathBoost(
    deadId: string,
    side: "player" | "enemy",
    isSummon: boolean,
  ): void;
  /** Re-evaluate victory/defeat conditions after a death. */
  recheckVictory(): void;
  /** Attribute the kill reward for the dead combatant. */
  attributeKillReward(deadId: string): void;
  /** Whether the combatant has already been removed from the roster. */
  isCombatantRemoved(id: string): boolean;
  /** Display name of the combatant (must be valid before removal). */
  getCombatantName(id: string): string;
  /** Board position of the combatant (must be valid before removal). */
  getCombatantPos(id: string): { x: number; y: number };
  /** Side of the combatant (must be valid before removal). Absent side
   * defaults to "enemy" for legacy non-summon combatants. */
  getCombatantSide(id: string): "player" | "enemy";
  /** Whether the combatant is a summon (must be valid before removal). */
  getCombatantIsSummon(id: string): boolean;
  /**
   * Optional post-death reconcile hook. When supplied, invoked at the TAIL
   * of {@link processCombatantDeath} (after step 10 — kill reward
   * attribution) so the caller can heal any ghost ids that leaked into the
   * turn queue and evaluate victory exactly once. Optional so callers that
   * do not need the reconcile (e.g. unit tests) can omit it.
   */
  reconcileBattleState?: () => void;
}

/**
 * Provenance of a death event. Tagged at every kill path so the [DEATH] log
 * entry can distinguish player-cast kills from summon-cast, DoT, reflect,
 * melee, enemy-melee, hazard, and boss-phase transitions.
 */
export type DeathSource =
  | "player-cast"
  | "summon-cast"
  | "dot"
  | "reflect"
  | "melee"
  | "enemy-melee"
  | "hazard"
  | "boss-phase";

/**
 * Process a combatant's death exactly once.
 *
 * @param id     - The combatant id that just died.
 * @param ctx    - Caller-supplied callback bundle (see {@link DeathPipelineCtx}).
 * @param source - Provenance of the death event (defaults to "player-cast").
 * @returns `true` if the death sequence ran this call, `false` if the combatant
 *          was already removed (idempotent no-op).
 */
export function processCombatantDeath(
  id: string,
  ctx: DeathPipelineCtx,
  source: DeathSource = "player-cast",
): boolean {
  // 1. Idempotency guard — already dead, no-op.
  if (ctx.isCombatantRemoved(id)) {
    return false;
  }

  // [DEATH] log entry — fires once per real death, after the idempotency guard.
  logDebugInfo("DEATH", "combatant death", { id, source });

  // 2. Snapshot name + position + side/isSummon BEFORE removal. The
  // side/isSummon snapshot lets step 8 (applyLeaderDeathBoost) guard against
  // summons and player-side deaths even though the dead entity is gone from
  // the live roster by then. Absent `side` defaults to "enemy" for legacy
  // non-summon combatants (matching battleSetup.isActiveHostile semantics).
  const name = ctx.getCombatantName(id);
  const pos = ctx.getCombatantPos(id);
  const side: "player" | "enemy" = ctx.getCombatantSide(id);
  const isSummon = ctx.getCombatantIsSummon(id);

  // 3. Detach from roster.
  ctx.removeCombatant(id);
  // 4. Detach from turn queue.
  ctx.removeFromTurnQueue(id);
  // 5. Detach from initiative strip.
  ctx.removeFromInitiativeStrip(id);
  // 6. Shatter VFX at death position.
  ctx.triggerShatter(id, pos.x, pos.y);
  // 7. Log the defeat.
  ctx.logDefeated(name);
  // 8. Leader-death boost — guarded by side/isSummon snapshot.
  ctx.applyLeaderDeathBoost(id, side, isSummon);
  // 9. Recheck victory conditions.
  ctx.recheckVictory();
  // 10. Attribute kill reward.
  ctx.attributeKillReward(id);

  // 11. Reconcile the turn queue against the live combatant set and
  // evaluate victory exactly once. Runs AFTER kill-reward attribution so
  // the defeated roster is fully populated before the victory recap reads
  // it. Optional — no-op when the caller did not wire the hook.
  ctx.reconcileBattleState?.();

  return true;
}

/**
 * Process the PLAYER's death exactly once.
 *
 * Mirrors {@link processCombatantDeath} but SKIPS the enemy-only steps:
 *   - applyLeaderDeathBoost (enemy-leader buff, never applies to the player)
 *   - attributeKillReward (kill reward is for killing enemies, not the player)
 *
 * Runs the same idempotency guard + removal + shatter + logDefeated +
 * recheckVictory + ctx.reconcileBattleState?.() (victory re-evaluation) so the
 * player's death is registered exactly once and the defeat/victory recap is
 * re-evaluated. The caller is still responsible for the player-specific
 * game-over UI (e.g. `_handlePlayerDeath` in WorldExploration.tsx) — this
 * function only handles the shared combatant-roster bookkeeping.
 *
 * @param id     - The player combatant id (typically "__player__").
 * @param ctx    - Caller-supplied callback bundle (see {@link DeathPipelineCtx}).
 * @param source - Provenance of the death event (defaults to "enemy-melee").
 * @returns `true` if the death sequence ran this call, `false` if the player
 *          was already removed (idempotent no-op).
 */
export function processPlayerDeath(
  id: string,
  ctx: DeathPipelineCtx,
  source: DeathSource = "enemy-melee",
): boolean {
  // 1. Idempotency guard — already dead, no-op.
  if (ctx.isCombatantRemoved(id)) {
    return false;
  }

  // [DEATH] log entry — fires once per real death, after the idempotency guard.
  logDebugInfo("DEATH", "player death", { id, source });

  // 2. Snapshot name + position BEFORE removal.
  const name = ctx.getCombatantName(id);
  const pos = ctx.getCombatantPos(id);

  // 3. Detach from roster.
  ctx.removeCombatant(id);
  // 4. Detach from turn queue.
  ctx.removeFromTurnQueue(id);
  // 5. Detach from initiative strip.
  ctx.removeFromInitiativeStrip(id);
  // 6. Shatter VFX at death position.
  ctx.triggerShatter(id, pos.x, pos.y);
  // 7. Log the defeat.
  ctx.logDefeated(name);
  // 8. SKIPPED — applyLeaderDeathBoost is enemy-leader-only.
  // 9. Recheck victory conditions (defeat path).
  ctx.recheckVictory();
  // 10. SKIPPED — attributeKillReward is for killing enemies, not the player.

  // 11. Reconcile the turn queue against the live combatant set and
  // evaluate victory/defeat exactly once. Optional — no-op when the caller
  // did not wire the hook.
  ctx.reconcileBattleState?.();

  return true;
}
