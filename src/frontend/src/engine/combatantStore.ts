/**
 * combatantStore.ts — Atomic combatant-state store helpers.
 *
 * Centralizes the multi-array bookkeeping that WorldExploration.tsx (WX)
 * previously scattered across `setEnemies` / `setBattleEnemies` /
 * `setTurnOrder` plus their parallel mirror refs (`enemiesRef`,
 * `battleEnemiesRef`, `turnOrderRef`). Every mutation that touches the
 * combatant set MUST route through this module so the four arrays
 * (combatants, enemies mirror, battleEnemies mirror, turnOrder) and the
 * `battleStartIds` set stay in sync atomically.
 *
 * Design rules (verbatim from the migration spec):
 *   - The caller (WX) owns the refs and setters; this module is pure with
 *     respect to external state — it only mutates the refs / calls the
 *     setters handed to it via the ctx.
 *   - `battleEnemies` remains a DERIVED view (never deleted) so the reads
 *     at WX 10611 (defeatedList) and WX 12121 (boss-AI battleEnemiesRef
 *     lookup) keep working. `deriveBattleEnemies(ctx)` reproduces it.
 *   - `enemiesRef` / `battleEnemiesRef` / `turnOrderRef` are kept as
 *     mirrors the store helpers sync (NOT removed) to avoid a large
 *     read-site refactor.
 *   - Every helper is atomic: compute all next-arrays first, then assign
 *     refs, then call setters. No half-applied state is ever observable.
 *
 * React-free / DOM-free at runtime. Imports only the `Combatant` and
 * `CombatantEntry` TYPES (erased at compile time) plus the pure
 * `removeCombatantFromTurnQueue` and `activeHostilesRemaining` engine
 * helpers — matching the engine's React-free runtime convention.
 */

import type { MutableRefObject } from "react";
import type { CombatantEntry } from "../components/InitiativeStrip";
import type { Combatant } from "./battleSetup";
import { activeHostilesRemaining } from "./battleSetup";
import { removeCombatantFromTurnQueue } from "./turnQueue";
import type {
  CurrentTurnIndexRef,
  SetTurnOrder,
  TurnOrderRef,
} from "./turnQueue";

/**
 * Minimal combatant shape with the `id` field the store needs. WX's real
 * `Enemy` type carries `id` (plus many richer fields used to build
 * `CombatantEntry`); the structural `Combatant` interface in
 * battleSetup.ts intentionally omits `id` to avoid a hard WX import. We
 * restore it here as a local structural extension so the store can read
 * `.id` without `any` and without widening the public `Combatant` type.
 */
type CombatantWithId = Combatant & { id: string };

/** React state setter for an array of combatants. */
type SetCombatants = (updater: (prev: Combatant[]) => Combatant[]) => void;

/** Options for {@link addCombatant}. */
export interface AddCombatantOpts {
  /** When true, the added combatant participates in the current battle
   *  (its id is added to `battleStartIds` and mirrored into
   *  `battleEnemiesRef`). Defaults to `false` (world-level spawn). */
  battleParticipant?: boolean;
}

/** Options for {@link syncCombatants}. */
export interface SyncCombatantsOpts {
  /** When true, rebuild `battleStartIds` from `next` (every id becomes a
   *  battle participant). Used for battle-start teleport. Defaults to
   *  `false` (world init / exploration movement bulk maps preserve the
   *  existing battle roster). */
  resetBattle?: boolean;
}

/**
 * The combatant-store context. Assembled by the caller (WX) from its
 * existing refs and setters and handed to every store helper. The
 * `initCombatantStore` factory wires the common pieces; the caller only
 * needs to supply the refs + setters it already owns.
 */
export interface CombatantStoreCtx {
  /** Primary combatant array (source of truth). */
  combatantsRef: MutableRefObject<Combatant[]>;
  /** Ids of combatants that were present at battle start — defines the
   *  derived `battleEnemies` view. */
  battleStartIds: Set<string>;
  /** Mirror of `combatantsRef` kept for synchronous reads. */
  enemiesRef: MutableRefObject<Combatant[]>;
  /** Mirror of the derived battle-enemies view. */
  battleEnemiesRef: MutableRefObject<Combatant[]>;
  /** Mirror of the turn-order array. */
  turnOrderRef: TurnOrderRef;
  /** Active-turn index ref (consumed by `removeCombatantFromTurnQueue`). */
  currentTurnIndexRef: CurrentTurnIndexRef;
  /** React state setter for the enemies array. */
  setEnemies: SetCombatants;
  /** React state setter for the battle-enemies array. */
  setBattleEnemies: SetCombatants;
  /** React state setter for the turn-order array. */
  setTurnOrder: SetTurnOrder;
}

/**
 * Build a {@link CombatantEntry} from a combatant. Real combatants (WX's
 * `Enemy` type) carry the rich fields (`name`, `initiative`,
 * `pieceIcon`, `maxHp`, `level`, `pieceType`, `spells`, `isLeader`,
 * `isBoss`, `bossId`, `currentBossPhase`, `side`, `isSummon`,
 * `summonAI`, `ownerId`, `turnsRemaining`, `leaderBoostCount`); we spread
 * them through and fill any missing required entry field with a safe
 * default so the function is total for any `Combatant`-shaped input.
 *
 * The `type` field is derived from `side` (player → player, anything
 * else → enemy) matching the InitiativeStrip convention.
 */
function toCombatantEntry(c: CombatantWithId): CombatantEntry {
  const rich = c as CombatantWithId & Partial<CombatantEntry>;
  const side: "player" | "enemy" = rich.side ?? "enemy";
  return {
    id: c.id,
    type: side === "player" ? "player" : "enemy",
    initiative: rich.initiative ?? 0,
    name: rich.name ?? c.id,
    pieceIcon: rich.pieceIcon ?? "",
    hp: c.hp,
    maxHp: rich.maxHp ?? c.hp,
    level: rich.level ?? 1,
    pieceType: rich.pieceType,
    spells: rich.spells,
    isLeader: rich.isLeader,
    leaderBoostCount: rich.leaderBoostCount,
    isBoss: rich.isBoss,
    bossId: rich.bossId,
    currentBossPhase: rich.currentBossPhase,
    side: rich.side,
    isSummon: rich.isSummon ?? c.isSummon,
    summonAI: rich.summonAI,
    ownerId: rich.ownerId,
    turnsRemaining: rich.turnsRemaining,
  };
}

/** Cast helper — every real combatant carries `id`. */
function withId(c: Combatant): CombatantWithId {
  return c as CombatantWithId;
}

function withIdAll(arr: Combatant[]): CombatantWithId[] {
  return arr as CombatantWithId[];
}

/**
 * Initialize a combatant-store context from the refs + setters the caller
 * already owns. Seeds `combatantsRef.current` with `initial` and
 * `battleStartIds` with the initial ids (every initial combatant is
 * treated as a battle participant — the caller can `syncCombatants` with
 * `resetBattle: false` afterwards if it needs a different roster).
 *
 * Returns the assembled ctx. The caller retains ownership of every ref
 * and setter; this factory only wires them together and seeds the
 * battle-start id set.
 */
export function initCombatantStore(
  combatantsRef: MutableRefObject<Combatant[]>,
  enemiesRef: MutableRefObject<Combatant[]>,
  battleEnemiesRef: MutableRefObject<Combatant[]>,
  turnOrderRef: TurnOrderRef,
  currentTurnIndexRef: CurrentTurnIndexRef,
  setEnemies: SetCombatants,
  setBattleEnemies: SetCombatants,
  setTurnOrder: SetTurnOrder,
  // biome-ignore lint/correctness/noUnusedVariables: retained for backward compatibility with positional call sites
  initial: Combatant[] = [],
): CombatantStoreCtx {
  // SIDE-EFFECT-SAFE INIT: build the ctx around the refs AS THEY ARE.
  // Never wipe live ref contents on (re)render — syncCombatants is the only
  // place that reassigns the arrays / rebuilds battleStartIds.
  if (combatantsRef.current === undefined) {
    combatantsRef.current = [];
  }
  if (enemiesRef.current === undefined) {
    enemiesRef.current = [];
  }
  const battleStartIds = new Set<string>(
    withIdAll(combatantsRef.current).map((c) => c.id),
  );
  const battleEnemies = combatantsRef.current.filter((c) =>
    battleStartIds.has(withId(c).id),
  );
  if (battleEnemiesRef.current === undefined) {
    battleEnemiesRef.current = battleEnemies;
  }
  const ctx: CombatantStoreCtx = {
    combatantsRef,
    battleStartIds,
    enemiesRef,
    battleEnemiesRef,
    turnOrderRef,
    currentTurnIndexRef,
    setEnemies,
    setBattleEnemies,
    setTurnOrder,
  };
  return ctx;
}

/**
 * Append a combatant to the store atomically.
 *
 * - Appends to `combatantsRef.current` and syncs `enemiesRef.current`.
 * - When `opts.battleParticipant` is true, adds the id to
 *   `battleStartIds` and syncs `battleEnemiesRef.current`.
 * - Appends a {@link CombatantEntry} built from the combatant to
 *   `turnOrderRef.current` and syncs `setTurnOrder`.
 * - Calls `setEnemies` and `setBattleEnemies` with the new arrays.
 *
 * Atomic: all next-arrays are computed first, then refs are assigned,
 * then setters are called.
 */
export function addCombatant(
  ctx: CombatantStoreCtx,
  combatant: Combatant,
  opts?: AddCombatantOpts,
): void {
  const c = withId(combatant);
  const battleParticipant = opts?.battleParticipant ?? false;

  const nextCombatants = [...ctx.combatantsRef.current, combatant];
  const nextEnemies = nextCombatants;

  let nextBattleEnemies = ctx.battleEnemiesRef.current;
  if (battleParticipant) {
    ctx.battleStartIds.add(c.id);
    nextBattleEnemies = nextCombatants.filter((x) =>
      ctx.battleStartIds.has(withId(x).id),
    );
  }

  const entry = toCombatantEntry(c);
  const nextTurnOrder = [...ctx.turnOrderRef.current, entry];

  // Assign refs first so any synchronous reader sees a fresh value.
  ctx.combatantsRef.current = nextCombatants;
  ctx.enemiesRef.current = nextEnemies;
  ctx.battleEnemiesRef.current = nextBattleEnemies;
  ctx.turnOrderRef.current = nextTurnOrder;

  // Then fire the React state updates.
  ctx.setEnemies(() => nextEnemies);
  ctx.setBattleEnemies(() => nextBattleEnemies);
  ctx.setTurnOrder(() => nextTurnOrder);
}

/**
 * Remove a combatant from the store atomically.
 *
 * - Filters `combatantsRef.current` by id and syncs `enemiesRef.current`.
 * - Removes the id from `battleStartIds` and syncs
 *   `battleEnemiesRef.current`.
 * - Calls `removeCombatantFromTurnQueue` (from `./turnQueue`) on
 *   `turnOrderRef.current`, which also adjusts
 *   `currentTurnIndexRef.current` and calls `setTurnOrder`.
 * - Calls `setEnemies` and `setBattleEnemies` with the new arrays.
 *
 * Atomic: all next-arrays are computed first, then refs are assigned,
 * then setters are called. The turn-queue leg is delegated to
 * `removeCombatantFromTurnQueue`, which itself assigns its ref before
 * its setter — preserving the assign-refs-then-set-setters ordering.
 */
export function removeCombatant(ctx: CombatantStoreCtx, id: string): void {
  const nextCombatants = ctx.combatantsRef.current.filter(
    (c) => withId(c).id !== id,
  );
  const nextEnemies = nextCombatants;

  ctx.battleStartIds.delete(id);
  const nextBattleEnemies = nextCombatants.filter((c) =>
    ctx.battleStartIds.has(withId(c).id),
  );

  // Assign the combatant / enemies / battleEnemies refs first.
  ctx.combatantsRef.current = nextCombatants;
  ctx.enemiesRef.current = nextEnemies;
  ctx.battleEnemiesRef.current = nextBattleEnemies;

  // Turn-queue leg: delegate to the pure helper. It syncs turnOrderRef
  // and currentTurnIndexRef and calls setTurnOrder atomically.
  removeCombatantFromTurnQueue(
    ctx.turnOrderRef.current,
    ctx.turnOrderRef,
    ctx.currentTurnIndexRef,
    id,
    ctx.setTurnOrder,
  );

  // Fire the enemies / battleEnemies state updates.
  ctx.setEnemies(() => nextEnemies);
  ctx.setBattleEnemies(() => nextBattleEnemies);
}

/**
 * Patch a single combatant by id atomically.
 *
 * - Maps `combatantsRef.current` applying `patch` to the matching id.
 * - Syncs `enemiesRef.current` and `battleEnemiesRef.current` (when the
 *   id is in `battleStartIds`).
 * - Patches the matching {@link CombatantEntry} in `turnOrderRef.current`
 *   (spreading `patch` over the entry) and syncs `setTurnOrder`.
 * - Calls `setEnemies` and `setBattleEnemies` with the new arrays.
 *
 * Atomic: all next-arrays are computed first, then refs are assigned,
 * then setters are called.
 */
export function updateCombatant(
  ctx: CombatantStoreCtx,
  id: string,
  patch: Partial<Combatant>,
): void {
  const nextCombatants = ctx.combatantsRef.current.map((c) =>
    withId(c).id === id ? { ...c, ...patch } : c,
  );
  const nextEnemies = nextCombatants;

  const inBattle = ctx.battleStartIds.has(id);
  const nextBattleEnemies = inBattle
    ? nextCombatants.filter((c) => ctx.battleStartIds.has(withId(c).id))
    : ctx.battleEnemiesRef.current;

  const nextTurnOrder = ctx.turnOrderRef.current.map((e) =>
    e.id === id ? { ...e, ...patch } : e,
  );

  ctx.combatantsRef.current = nextCombatants;
  ctx.enemiesRef.current = nextEnemies;
  ctx.battleEnemiesRef.current = nextBattleEnemies;
  ctx.turnOrderRef.current = nextTurnOrder;

  ctx.setEnemies(() => nextEnemies);
  ctx.setBattleEnemies(() => nextBattleEnemies);
  ctx.setTurnOrder(() => nextTurnOrder);
}

/**
 * Bulk-replace the combatant set atomically.
 *
 * - Sets `combatantsRef.current = next`.
 * - When `opts.resetBattle` is true, rebuilds `battleStartIds` from
 *   `next` (every id becomes a battle participant) — used for
 *   battle-start teleport. When false, preserves the existing
 *   `battleStartIds` — used for world init and exploration-movement
 *   bulk maps.
 * - Syncs all mirrors (`enemiesRef`, `battleEnemiesRef`,
 *   `turnOrderRef`) and the three setters.
 *
 * The turn-order mirror is rebuilt from `next` restricted to the
 * (possibly rebuilt) `battleStartIds`, so the queue reflects exactly the
 * combatants that are in the current battle.
 *
 * Atomic: all next-arrays are computed first, then refs are assigned,
 * then setters are called.
 */
export function syncCombatants(
  ctx: CombatantStoreCtx,
  next: Combatant[],
  opts?: SyncCombatantsOpts,
): void {
  const resetBattle = opts?.resetBattle ?? false;

  if (resetBattle) {
    ctx.battleStartIds = new Set(withIdAll(next).map((c) => c.id));
  }

  const nextEnemies = next;
  const nextBattleEnemies = next.filter((c) =>
    ctx.battleStartIds.has(withId(c).id),
  );
  const nextTurnOrder = nextBattleEnemies.map((c) =>
    toCombatantEntry(withId(c)),
  );

  ctx.combatantsRef.current = nextEnemies;
  ctx.enemiesRef.current = nextEnemies;
  ctx.battleEnemiesRef.current = nextBattleEnemies;
  ctx.turnOrderRef.current = nextTurnOrder;

  ctx.setEnemies(() => nextEnemies);
  ctx.setBattleEnemies(() => nextBattleEnemies);
  ctx.setTurnOrder(() => nextTurnOrder);
}

/**
 * Derive the battle-enemies view: the subset of `combatantsRef.current`
 * whose id is in `battleStartIds`. This is the canonical `battleEnemies`
 * value — kept as a derived view (never stored as the source of truth)
 * so the reads at WX 10611 (defeatedList) and WX 12121 (boss-AI
 * battleEnemiesRef lookup) keep working against the mirror that the
 * store helpers maintain.
 */
export function deriveBattleEnemies(ctx: CombatantStoreCtx): Combatant[] {
  return ctx.combatantsRef.current.filter((c) =>
    ctx.battleStartIds.has(withId(c).id),
  );
}

/**
 * Dev-gated synchronous state dump for debugging the store's atomic
 * updates. Prints a `[STATE-SYNC]` block with the lengths and ids of
 * every mirror plus the `activeHostilesRemaining` result. No-op in
 * production builds (`import.meta.env.DEV` is false).
 *
 * Format per line:
 *   [STATE-SYNC] <label> enemies=N ids=[...] battleEnemies=N ids=[...]
 *   turnOrder=N ids=[...] hostiles=K
 */
export function dumpStateSync(label: string, ctx: CombatantStoreCtx): void {
  if (!import.meta.env.DEV) return;

  const ids = (arr: Combatant[]): string[] => withIdAll(arr).map((c) => c.id);
  const turnIds = ctx.turnOrderRef.current.map((e) => e.id);
  const hostiles = activeHostilesRemaining(ctx.combatantsRef.current);

  // eslint-disable-next-line no-console
  console.log(
    `[STATE-SYNC] ${label} ` +
      `enemies=${ctx.enemiesRef.current.length} ids=[${ids(
        ctx.enemiesRef.current,
      ).join(",")}] ` +
      `battleEnemies=${ctx.battleEnemiesRef.current.length} ids=[${ids(
        ctx.battleEnemiesRef.current,
      ).join(",")}] ` +
      `turnOrder=${ctx.turnOrderRef.current.length} ids=[${turnIds.join(
        ",",
      )}] ` +
      `hostiles=${hostiles}`,
  );
}
