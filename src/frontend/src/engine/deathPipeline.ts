import { type CombatantStoreCtx, removeCombatant } from "./combatantStore";

/**
 * Explicit, React-free context required by processCombatantDeath.
 * All fields are injected by the caller — no hooks, no React imports.
 */
export interface DeathPipelineContext {
  /** The store context — used for the single atomic removeCombatant call. */
  combatantStoreCtx: CombatantStoreCtx;
  /** Ref to the effects manager; triggerDeath drives the death shatter. */
  effectsManagerRef: {
    current: { triggerDeath: (id: string, ...args: unknown[]) => void } | null;
  };
  /** Battle log function. */
  logBattleEntry: (entry: string, color?: string) => void;
  /** Ref holding the leader enemy id, or null when no leader. */
  leaderEnemyIdRef: { current: string | null };
  /** Ref flag set when the leader has died. */
  leaderDiedRef: { current: boolean };
  /** Ref flag set when the battle leader has been slain. */
  battleLeaderSlainRef: { current: boolean };
  /** Current leader boost percent value to add on enemy-side deaths. */
  leaderBoostPercent: number;
  /** Setter for the leader boost multiplier. */
  setLeaderBoostMultiplier: (fn: (prev: number) => number) => void;
  /** Setter for the enemy HP map. */
  setEnemyHpMap: (
    fn: (prev: Record<string, number>) => Record<string, number>,
  ) => void;
  /** Triggers the leader death animation at the given tile. */
  triggerLeaderDeathAnimation: (x: number, y: number) => void;
  /** Plays a sound by name. */
  playSound: (sound: string) => void;
  /** Current enemies array — used for the setEnemies filter and leader lookup. */
  enemies: unknown[];
  /** Setter for the enemies array. */
  setEnemies: (fn: (prev: unknown[]) => unknown[]) => void;
  /** Store-backed lookup helper. */
  getCombatantById: (id: string) => unknown | undefined;
}

/**
 * Single engine-level death pipeline. Performs, in order:
 *  (a) idempotent guard — no-op if the combatant is already gone from the store
 *  (b) capture name/pieceType, x/y, and whether it is the leader
 *  (c) death shatter via effectsManager
 *  (d) "X is defeated" log
 *  (e) ATOMIC removal via removeCombatant (single path — already does
 *      turn-queue removal + victory-gate re-eval; do NOT call
 *      removeCombatantFromTurnQueue separately)
 *  (f) field removal via setEnemies filter
 *  (g) leader death-boost for enemy-side allies of a living leader
 *  (h) leader death check — set flags, animation, sound
 *  (i) return true
 *
 * Returns false only when the combatant was already gone (idempotent guard).
 */
export function processCombatantDeath(
  id: string,
  ctx: DeathPipelineContext,
): boolean {
  // (a) Idempotent guard — combatant already removed from the store.
  const combatant = ctx.getCombatantById(id);
  if (combatant === undefined) {
    return false;
  }

  // (b) Capture metadata for log, animation, and leader check.
  const c = combatant as {
    id: string;
    name?: string;
    pieceType?: string;
    x?: number;
    y?: number;
    side?: string;
  };
  const displayName: string = (c.name ?? c.pieceType ?? "Enemy") as string;
  const x: number = (c.x ?? 0) as number;
  const y: number = (c.y ?? 0) as number;
  const isLeader: boolean = id === ctx.leaderEnemyIdRef.current;

  // (c) Death shatter — guard against a null effects manager ref.
  ctx.effectsManagerRef.current?.triggerDeath(id);

  // (d) Log the defeat.
  ctx.logBattleEntry(`${displayName} is defeated`, "#ef4444");

  // (e) ATOMIC removal — the single removal path. removeCombatant already
  //     performs turn-queue removal and victory-gate re-eval internally.
  //     Do NOT call removeCombatantFromTurnQueue separately (double-remove).
  removeCombatant(ctx.combatantStoreCtx, id);

  // (f) Field removal — drop the combatant from the enemies array.
  ctx.setEnemies((prev) =>
    prev.filter((e) => (e as { id?: string }).id !== id),
  );

  // (g) Leader death-boost (moved from castHelpers.ts:462-492).
  //     Preserve the isEnemySideDeath guard semantics: only boost when the
  //     dead combatant is on the enemy side AND a leader exists AND the
  //     leader is not the one dying.
  const deadSide: string | undefined = c.side;
  const leaderId: string | null = ctx.leaderEnemyIdRef.current;
  const isEnemySideDeath: boolean =
    deadSide === "enemy" && leaderId !== null && leaderId !== id;

  if (isEnemySideDeath) {
    // Confirm the leader is still alive in the store before boosting.
    const leader =
      leaderId !== null ? ctx.getCombatantById(leaderId) : undefined;
    if (leader !== undefined) {
      ctx.setLeaderBoostMultiplier((prev) => prev + ctx.leaderBoostPercent);
      const leaderName =
        (leader as { name?: string; pieceType?: string }).name ??
        (leader as { pieceType?: string }).pieceType ??
        "Leader";
      ctx.logBattleEntry(
        `${leaderName} rallies — boost +${ctx.leaderBoostPercent}%`,
        "#f59e0b",
      );
    }
  }

  // (h) Leader death check — set flags, fire animation + sound.
  if (isLeader) {
    ctx.leaderDiedRef.current = true;
    ctx.battleLeaderSlainRef.current = true;
    ctx.triggerLeaderDeathAnimation(x, y);
    ctx.playSound("enemy_death");
  }

  // (i) Success.
  return true;
}
