/**
 * Eternal Pawn King advertises AP_DRAIN (`bossDefaults` phase-2
 * specialAbilities, useBossAI "drain AP every turn", Boss Guide
 * "Boss drains Action Points. Bring AP-restoring buffs or plan
 * shorter action chains.").
 *
 * Live leftover — decide. `decideEternalPawnKingAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-2 pool id
 * (`spell-slow`) is decided every turn. AP_DRAIN sits *after* that
 * return. `applyApDrain` writes `playerApModifier: -1` with no
 * last-turn damage AP threshold. Live WX already applies
 * `playerApModifier` onto `currentBattleAp`, so a decided drain
 * would actually cut the HUD. Kit-first Slow never decides it, so a
 * 10 AP starter keeps 10 and can still Strike five times
 * (`physical_attack` costs 2) — advertised drain of 1 leaves 9 and
 * only four Strikes. Slow is 0-damage / `debuffStat: "mp"` (−2 MP
 * for 2 turns) so it cannot substitute for the advertised AP cut.
 *
 * Unique leftover of **#1164** `bossApDrainPassiveDecideCommit`
 * (Enthroned Void phase-2 AP_DRAIN_PASSIVE, kit first-id Swap,
 * last-turn damage AP ≥ 3 → −1 / ≥ 5 → −2). Unique vs:
 * - **#1159** `bossPhantomSpawnDecideCommit` — even PHANTOM_SPAWN.
 * - **#1094** odd-turn ANCHOR_TILES + unread DAMAGE_IMMUNE.
 * - Chessboard Lich BOARD_CLAIM −2 inside the 2×2, Twin Monarchs
 *   Dawn `playerApModifier` +2 / +1.
 * - **#922** player Drain Courage execute AP — a player spell, and
 *   kit `spell-drain-courage` is Eternal Pawn's *second* pool id so
 *   empty-Map kit-first never picks it either. This sidecar does
 *   **not** promote Drain Courage over Slow.
 * - Phase-1 ADVANCE_PER_TURN (kit Slow still shadows the walk) —
 *   movement leftover, not restored here.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion,
 * bossApDrainPassiveDecideCommit, or bossPhantomSpawnDecideCommit.
 * Restack `decideEternalPawnKingAction` onto
 * `resolveEternalPawnPhase2Decide` after older combat PRs land.
 */

export const ETERNAL_PAWN_ID = "eternal_pawn_king";

export const AP_DRAIN_ABILITY = "AP_DRAIN";

export const AP_DRAIN_PASSIVE_ABILITY = "AP_DRAIN_PASSIVE";

export const ADVANCE_PER_TURN_ABILITY = "ADVANCE_PER_TURN";

export const BOARD_CLAIM_ABILITY = "BOARD_CLAIM";

export const DAWN_BUFF_ABILITY = "DAWN_BUFF";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const ETERNAL_PAWN_PHASE2_KIT_FIRST_ID = "spell-slow";

/** Phase-1 first kit id — ADVANCE leftover, not this sidecar. */
export const ETERNAL_PAWN_PHASE1_KIT_FIRST_ID = "spell-slow";

/** Enthroned Void phase-2 first-id — AP_DRAIN_PASSIVE leftover of #1164. */
export const ENTHRONED_VOID_PHASE2_KIT_FIRST_ID = "spell-swap";

/** Kit second-id — Drain Courage AP leftover of #922, not this. */
export const ETERNAL_PAWN_PHASE2_KIT_SECOND_ID = "spell-drain-courage";

/** Production `applyApDrain` — always −1, no last-turn threshold. */
export const ETERNAL_PAWN_AP_DRAIN_AMOUNT = 1;

/** Production Enthroned Void `applyApDrainPassive` ≥5 spend — not this. */
export const AP_DRAIN_PASSIVE_TIER2_AMOUNT = 2;

/** Production BOARD_CLAIM in-zone tax — not this. */
export const BOARD_CLAIM_IN_ZONE_DRAIN = 2;

/** Production Dawn AP bless — not this. */
export const DAWN_BUFF_AP_BLESS = 2;

export const AP_DRAIN_LOG_NEEDLE = "drains 1 AP from you!";

export const AP_DRAIN_GUIDE_NEEDLE = "Boss drains Action Points";

export type EternalPawnPhase = 1 | 2;

export type EternalPawnDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type EternalPawnPhase2DecideInput = {
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

/**
 * Production `applyApDrain` amount. Always 1 when this is Eternal
 * Pawn phase 2. Other bosses / phases fail closed to 0 so Enthroned
 * Void AP_DRAIN_PASSIVE and BOARD_CLAIM stay unrestored.
 */
export function advertisedEternalPawnApDrainAmount(opts: {
  bossId?: string;
  currentPhase: EternalPawnPhase;
}): number {
  if (!isEternalPawnApDrainTurn(opts)) return 0;
  return ETERNAL_PAWN_AP_DRAIN_AMOUNT;
}

/** True when production apply would return `playerApModifier: -1`. */
export function isEternalPawnApDrainTurn(opts: {
  bossId?: string;
  currentPhase: EternalPawnPhase;
}): boolean {
  return isEternalPawnBoss(opts.bossId) && opts.currentPhase === 2;
}

/**
 * Production `decideEternalPawnKingAction` order: kit first-id, then
 * AP_DRAIN in phase 2, then ADVANCE_PER_TURN in phase 1. This leftover
 * only models the kit-vs-phase-2-drain fork — phase-1 ADVANCE stays
 * unrestored.
 */
export function wxEternalPawnPhase2Decide(
  opts: EternalPawnPhase2DecideInput,
): EternalPawnDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isEternalPawnApDrainTurn(opts)) {
    return { type: "ability", ability: AP_DRAIN_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer AP_DRAIN in Eternal Pawn phase 2 so advertised −1 can hit
 * the HUD. Phase 1 still lets kit first-id win (ADVANCE leftover).
 * Other bosses still let kit win (Enthroned Void AP_DRAIN_PASSIVE
 * leftover of #1164).
 */
export function resolveEternalPawnPhase2Decide(
  opts: EternalPawnPhase2DecideInput,
): EternalPawnDecideAction {
  if (isEternalPawnApDrainTurn(opts)) {
    return { type: "ability", ability: AP_DRAIN_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/**
 * True when live decide spends a phase-2 drain that would apply on
 * kit first-id.
 */
export function wxEternalPawnKitBlocksApDrain(
  opts: EternalPawnPhase2DecideInput,
): boolean {
  const live = wxEternalPawnPhase2Decide(opts);
  const next = resolveEternalPawnPhase2Decide(opts);
  return live.type === "spell" && next.type === "ability";
}

/** Live kit-first never decides AP_DRAIN, so HUD AP never drops. */
export function liveWxCommitsEternalPawnApDrain(): boolean {
  return false;
}

/**
 * WX already writes `playerApModifier` onto `currentBattleAp` when
 * the ability is decided. This leftover is decide, not execute.
 */
export function wxAppliesEternalPawnPlayerApModifier(): boolean {
  return true;
}

/** Floor AP after advertised drain. Missing / non-finite AP stays 0. */
export function playerApAfterEternalPawnDrain(opts: {
  currentAp: number;
  bossId?: string;
  currentPhase: EternalPawnPhase;
}): number {
  const ap = finiteNumber(opts.currentAp);
  if (ap == null) return 0;
  return Math.max(0, ap - advertisedEternalPawnApDrainAmount(opts));
}

export function playerApAfterEternalPawnDecide(opts: {
  currentAp: number;
  bossId?: string;
  currentPhase: EternalPawnPhase;
  decidedAbility: string | undefined;
}): number {
  if (opts.decidedAbility !== AP_DRAIN_ABILITY) {
    const ap = finiteNumber(opts.currentAp);
    return ap == null ? 0 : Math.max(0, ap);
  }
  return playerApAfterEternalPawnDrain({
    currentAp: opts.currentAp,
    bossId: opts.bossId,
    currentPhase: opts.currentPhase,
  });
}

/** How many advertised Strike casts fit in the remaining AP pool. */
export function eternalPawnStrikeCountAffordable(opts: {
  currentAp: number;
  strikeApCost: number;
}): number {
  const ap = finiteNumber(opts.currentAp);
  const cost = finiteNumber(opts.strikeApCost);
  if (ap == null || cost == null || cost <= 0) return 0;
  return Math.floor(Math.max(0, ap) / cost);
}
