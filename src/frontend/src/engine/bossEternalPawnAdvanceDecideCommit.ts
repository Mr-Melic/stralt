/**
 * Eternal Pawn King advertises ADVANCE_PER_TURN (`bossDefaults` phase-1
 * specialAbilities, useBossAI "always advance toward the player", Boss
 * Guide "Boss advances toward the player every turn. Kite and use
 * ranged attacks; do not let it close the gap.").
 *
 * Live leftover — decide. `decideEternalPawnKingAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-1 pool id
 * (`spell-slow`) is decided every turn. ADVANCE_PER_TURN sits *after*
 * that return (and after the phase-2 AP_DRAIN branch).
 * `applyAdvancePerTurn` writes `newBossPosition` as one orthogonal
 * step toward the player (horizontal then vertical). Live WX already
 * commits `res?.newBossPosition` onto the boss tile, so a decided
 * advance would actually walk. Kit-first Slow never decides it, so a
 * pawn four tiles west stays put (Manhattan 4) instead of stepping to
 * Manhattan 3. Slow is 0-damage / `debuffStat: "mp"` (−2 MP for 2
 * turns) so it cannot substitute for the advertised close.
 *
 * Unique leftover of **#1204** `bossEternalPawnApDrainDecideCommit`
 * (Eternal Pawn phase-2 AP_DRAIN, kit first-id Slow, HUD AP 10→9 /
 * five Strikes→four). Unique vs:
 * - **#732** `occupancyAdvanceUnseal` — portal / far-crumb snap once
 *   ADVANCE is already decided. This sidecar does not snap.
 * - **#872** `bossMoveTargetCommit` — `type:"move"` `targetX/Y` when
 *   `abilityResult` has no `newBossPosition`. ADVANCE always writes
 *   `newBossPosition`, so that sidecar would not change this dest.
 * - **#763** `bossAbilityLandingHazard` — lava/spikes tax after a
 *   committed ADVANCE dest. Landing leftover, not decide.
 * - **#1164** Enthroned Void AP_DRAIN_PASSIVE (kit first-id Swap).
 * - Phase-2 AP_DRAIN (kit Slow still shadows drain until #1204
 *   restacks) — AP leftover, not restored here.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, occupancyAdvanceUnseal, bossMoveTargetCommit,
 * bossAbilityLandingHazard, statusEffects, spellEngine,
 * challengeCompletion, or bossEternalPawnApDrainDecideCommit.
 * Restack `decideEternalPawnKingAction` onto
 * `resolveEternalPawnPhase1Decide` after older combat PRs land.
 */

export const ETERNAL_PAWN_ID = "eternal_pawn_king";

export const ADVANCE_PER_TURN_ABILITY = "ADVANCE_PER_TURN";

export const AP_DRAIN_ABILITY = "AP_DRAIN";

export const AP_DRAIN_PASSIVE_ABILITY = "AP_DRAIN_PASSIVE";

export const BOARD_CLAIM_ABILITY = "BOARD_CLAIM";

export const SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

/** Phase-1 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const ETERNAL_PAWN_PHASE1_KIT_FIRST_ID = "spell-slow";

/** Phase-2 first kit id — AP_DRAIN leftover of #1204, not this sidecar. */
export const ETERNAL_PAWN_PHASE2_KIT_FIRST_ID = "spell-slow";

/** Enthroned Void phase-2 first-id — AP_DRAIN_PASSIVE leftover of #1164. */
export const ENTHRONED_VOID_PHASE2_KIT_FIRST_ID = "spell-swap";

/** Production `applyAdvancePerTurn` board. */
export const ETERNAL_PAWN_ADVANCE_BOARD = 16;

/** Production Eternal Pawn `atk` — contact leftover, not this walk. */
export const ETERNAL_PAWN_ATK = 30;

export const ADVANCE_LOG_NEEDLE = "advances relentlessly!";

export const ADVANCE_GUIDE_NEEDLE =
  "Boss advances toward the player every turn";

export type EternalPawnPhase = 1 | 2;

export type EternalPawnCell = { x: number; y: number };

export type EternalPawnDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type EternalPawnPhase1DecideInput = {
  bossId?: string;
  currentPhase: EternalPawnPhase;
  kitSpellId: string | null;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function isEternalPawnBoss(bossId: string | undefined): boolean {
  return bossId == null || bossId === ETERNAL_PAWN_ID;
}

function cellOrOrigin(
  cell: EternalPawnCell | null,
  origin: EternalPawnCell,
): EternalPawnCell {
  return cell ?? { x: origin.x, y: origin.y };
}

/** True when production apply would return `newBossPosition` for phase 1. */
export function isEternalPawnAdvanceTurn(opts: {
  bossId?: string;
  currentPhase: EternalPawnPhase;
}): boolean {
  return isEternalPawnBoss(opts.bossId) && opts.currentPhase === 1;
}

/**
 * Production `decideEternalPawnKingAction` order: kit first-id, then
 * AP_DRAIN in phase 2, then ADVANCE_PER_TURN in phase 1. This leftover
 * only models the kit-vs-phase-1-advance fork — phase-2 AP_DRAIN stays
 * unrestored (#1204).
 */
export function wxEternalPawnPhase1Decide(
  opts: EternalPawnPhase1DecideInput,
): EternalPawnDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isEternalPawnAdvanceTurn(opts)) {
    return { type: "ability", ability: ADVANCE_PER_TURN_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer ADVANCE_PER_TURN in Eternal Pawn phase 1 so advertised one-step
 * close can hit the tile. Phase 2 still lets kit first-id win (AP_DRAIN
 * leftover of #1204). Other bosses still let kit win (Enthroned Void
 * AP_DRAIN_PASSIVE leftover of #1164).
 */
export function resolveEternalPawnPhase1Decide(
  opts: EternalPawnPhase1DecideInput,
): EternalPawnDecideAction {
  if (isEternalPawnAdvanceTurn(opts)) {
    return { type: "ability", ability: ADVANCE_PER_TURN_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/**
 * True when live decide spends a phase-1 advance that would apply on
 * kit first-id.
 */
export function wxEternalPawnKitBlocksAdvance(
  opts: EternalPawnPhase1DecideInput,
): boolean {
  const live = wxEternalPawnPhase1Decide(opts);
  const next = resolveEternalPawnPhase1Decide(opts);
  return live.type === "spell" && next.type === "ability";
}

/** Live kit-first never decides ADVANCE_PER_TURN, so the pawn never walks. */
export function liveWxCommitsEternalPawnAdvance(): boolean {
  return false;
}

/**
 * WX already writes `res?.newBossPosition` onto the boss tile when the
 * ability is decided. This leftover is decide, not execute.
 */
export function wxAppliesEternalPawnNewBossPosition(): boolean {
  return true;
}

/**
 * Production `applyAdvancePerTurn`: prefer horizontal then vertical,
 * accept any in-bounds `allTiles` cell (portals included). No occupancy
 * check and no fight-graph snap — #732 owns the portal crumb.
 */
export function rawEternalPawnAdvanceDest(
  boss: EternalPawnCell,
  player: EternalPawnCell,
  allTiles: boolean[][],
): EternalPawnCell | null {
  const bx = finiteNumber(boss.x);
  const by = finiteNumber(boss.y);
  const px = finiteNumber(player.x);
  const py = finiteNumber(player.y);
  if (bx == null || by == null || px == null || py == null) return null;
  const h = allTiles.length;
  const w = allTiles[0]?.length ?? 0;
  if (h <= 0 || w <= 0) return null;
  const dx = Math.sign(px - bx);
  const dy = Math.sign(py - by);
  const candidates: EternalPawnCell[] = [];
  if (dx !== 0) candidates.push({ x: bx + dx, y: by });
  if (dy !== 0) candidates.push({ x: bx, y: by + dy });
  const valid = candidates.filter(
    (p) => p.x >= 0 && p.x < w && p.y >= 0 && p.y < h && allTiles[p.y]?.[p.x],
  );
  return valid[0] ?? null;
}

export function manhattanGap(a: EternalPawnCell, b: EternalPawnCell): number {
  const ax = finiteNumber(a.x);
  const ay = finiteNumber(a.y);
  const bx = finiteNumber(b.x);
  const by = finiteNumber(b.y);
  if (ax == null || ay == null || bx == null || by == null) return 0;
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/** Production `isAdjacent` — Manhattan === 1. */
export function isEternalPawnAdjacent(
  a: EternalPawnCell,
  b: EternalPawnCell,
): boolean {
  return manhattanGap(a, b) === 1;
}

/**
 * Tile after advertised advance. Missing dest / non-phase-1 stays origin
 * so Enthroned Void / Fetid Rook / phase-2 drain are not restored.
 */
export function bossPosAfterEternalPawnAdvance(opts: {
  boss: EternalPawnCell;
  player: EternalPawnCell;
  allTiles: boolean[][];
  bossId?: string;
  currentPhase: EternalPawnPhase;
}): EternalPawnCell {
  if (!isEternalPawnAdvanceTurn(opts)) {
    return { x: opts.boss.x, y: opts.boss.y };
  }
  return cellOrOrigin(
    rawEternalPawnAdvanceDest(opts.boss, opts.player, opts.allTiles),
    opts.boss,
  );
}

export function bossPosAfterEternalPawnDecide(opts: {
  boss: EternalPawnCell;
  player: EternalPawnCell;
  allTiles: boolean[][];
  bossId?: string;
  currentPhase: EternalPawnPhase;
  decidedAbility: string | undefined;
}): EternalPawnCell {
  if (opts.decidedAbility !== ADVANCE_PER_TURN_ABILITY) {
    return { x: opts.boss.x, y: opts.boss.y };
  }
  return bossPosAfterEternalPawnAdvance(opts);
}
