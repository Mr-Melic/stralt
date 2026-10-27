/**
 * Enthroned Void advertises AP_DRAIN_PASSIVE (`bossDefaults` phase-2
 * specialAbilities, useBossAI "become vulnerable, drain AP passively",
 * Boss Guide "Passive AP drain every turn. Plan actions with lower AP
 * costs.").
 *
 * Live leftover — decide. `decideEnthronedVoidAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-2 pool id
 * (`spell-swap`) is decided every turn. AP_DRAIN_PASSIVE sits *after*
 * that return. `applyApDrainPassive` writes `playerApModifier: -1`
 * when last-turn damage AP ≥ 3 and `-2` when ≥ 5. Live WX already
 * applies `playerApModifier` onto `currentBattleAp`, so a decided
 * drain would actually cut the HUD. Kit-first Swap never decides it,
 * so a 10 AP starter keeps 10 and can still Strike five times
 * (`physical_attack` costs 2) — advertised drain of 2 leaves 8 and
 * only four Strikes.
 *
 * Unique leftover of **#1159** `bossPhantomSpawnDecideCommit`
 * (phase-1 even PHANTOM_SPAWN). Unique vs:
 * - **#1094** `enthronedVoidDamageImmuneCommit` — odd-turn
 *   ANCHOR_TILES + unread DAMAGE_IMMUNE. This sidecar does **not**
 *   steal odd-turn anchors, immunity, or the 20 step tax.
 * - Eternal Pawn **AP_DRAIN** (always `-1`, no last-turn damage
 *   threshold). That kit first-id is `spell-slow`, not Swap.
 * - Chessboard Lich BOARD_CLAIM `-2` inside the 2×2, Twin Monarchs
 *   Dawn `playerApModifier` +2 / +1.
 * - **#922** player Drain Courage execute AP — a player spell, not
 *   this boss ability.
 * - **#1089** even Pages / **#1102** odd Scroll / **#1105** even Ink
 *   stay on Pale Archivist.
 *
 * `apDrainLastTurn` is never written (default 0) — tracking leftover,
 * not restored here. When last-turn damage AP is 0, production apply
 * returns no modifier, so this sidecar still lets kit win.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion,
 * bossPhantomSpawnDecideCommit, or enthronedVoidDamageImmuneCommit.
 * Restack `decideEnthronedVoidAction` onto
 * `resolveEnthronedVoidPhase2Decide` after older combat PRs land.
 */

export const ENTHRONED_VOID_ID = "enthroned_void";

export const AP_DRAIN_PASSIVE_ABILITY = "AP_DRAIN_PASSIVE";

export const AP_DRAIN_ABILITY = "AP_DRAIN";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const ANCHOR_TILES_ABILITY = "ANCHOR_TILES";

export const DAMAGE_IMMUNE_ABILITY = "DAMAGE_IMMUNE";

export const BOARD_CLAIM_ABILITY = "BOARD_CLAIM";

export const DAWN_BUFF_ABILITY = "DAWN_BUFF";

/** Phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const ENTHRONED_VOID_PHASE2_KIT_FIRST_ID = "spell-swap";

/** Phase-1 first kit id — PHANTOM leftover of #1159, not this sidecar. */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Eternal Pawn phase-2 first-id — AP_DRAIN leftover, not this sidecar. */
export const ETERNAL_PAWN_PHASE2_KIT_FIRST_ID = "spell-slow";

/** Production `applyApDrainPassive` last-turn damage AP for drain 1. */
export const AP_DRAIN_PASSIVE_TIER1_SPEND = 3;

/** Production `applyApDrainPassive` last-turn damage AP for drain 2. */
export const AP_DRAIN_PASSIVE_TIER2_SPEND = 5;

export const AP_DRAIN_PASSIVE_TIER1_AMOUNT = 1;

export const AP_DRAIN_PASSIVE_TIER2_AMOUNT = 2;

/** Production Eternal Pawn `applyApDrain` — always -1, not this. */
export const ETERNAL_PAWN_AP_DRAIN_AMOUNT = 1;

/** Production BOARD_CLAIM in-zone tax — not this. */
export const BOARD_CLAIM_IN_ZONE_DRAIN = 2;

/** Production Dawn AP bless — not this. */
export const DAWN_BUFF_AP_BLESS = 2;

export const AP_DRAIN_PASSIVE_LOG_NEEDLE =
  "The Enthroned Void saps your arcane reserves";

export const AP_DRAIN_PASSIVE_WATCH_NEEDLE =
  "The Enthroned Void watches — your arcane reserves are untouched.";

export const AP_DRAIN_PASSIVE_GUIDE_NEEDLE = "Passive AP drain every turn";

export type EnthronedVoidPhase = 1 | 2;

export type EnthronedVoidDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type EnthronedVoidPhase2DecideInput = {
  currentPhase: EnthronedVoidPhase;
  currentTurn: number;
  kitSpellId: string | null;
  lastTurnDmgAP: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

/**
 * Production `applyApDrainPassive` amounts. last-turn damage AP ≥ 5
 * drains 2; ≥ 3 drains 1; otherwise 0 (the "watches" log).
 */
export function advertisedApDrainAmount(lastTurnDmgAP: number): number {
  const spent = finiteNumber(lastTurnDmgAP);
  if (spent == null) return 0;
  if (spent >= AP_DRAIN_PASSIVE_TIER2_SPEND) {
    return AP_DRAIN_PASSIVE_TIER2_AMOUNT;
  }
  if (spent >= AP_DRAIN_PASSIVE_TIER1_SPEND) {
    return AP_DRAIN_PASSIVE_TIER1_AMOUNT;
  }
  return 0;
}

/** True when production apply would return `playerApModifier < 0`. */
export function isEnthronedVoidApDrainTurn(opts: {
  currentPhase: EnthronedVoidPhase;
  lastTurnDmgAP: number;
}): boolean {
  return (
    opts.currentPhase === 2 && advertisedApDrainAmount(opts.lastTurnDmgAP) > 0
  );
}

/**
 * Production `decideEnthronedVoidAction` order: kit first-id, then
 * even-turn PHANTOM_SPAWN / odd-turn ANCHOR_TILES in phase 1, then
 * AP_DRAIN_PASSIVE in phase 2 only when apply wrote a negative
 * modifier. This leftover only models the kit-vs-phase-2-drain fork
 * — even Phantom stays **#1159**, odd anchors stay **#1094**.
 */
export function wxEnthronedVoidPhase2Decide(
  opts: EnthronedVoidPhase2DecideInput,
): EnthronedVoidDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isEnthronedVoidApDrainTurn(opts)) {
    return { type: "ability", ability: AP_DRAIN_PASSIVE_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer AP_DRAIN_PASSIVE in phase 2 when last-turn damage AP would
 * produce a drain so advertised −1 / −2 can hit the HUD. Phase 1
 * still lets kit first-id win (PHANTOM **#1159**, ANCHOR **#1094**).
 * last-turn damage AP 0 still lets kit win (tracking leftover).
 */
export function resolveEnthronedVoidPhase2Decide(
  opts: EnthronedVoidPhase2DecideInput,
): EnthronedVoidDecideAction {
  if (isEnthronedVoidApDrainTurn(opts)) {
    return { type: "ability", ability: AP_DRAIN_PASSIVE_ABILITY };
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
export function wxEnthronedVoidKitBlocksApDrain(
  opts: EnthronedVoidPhase2DecideInput,
): boolean {
  const live = wxEnthronedVoidPhase2Decide(opts);
  const next = resolveEnthronedVoidPhase2Decide(opts);
  return live.type === "spell" && next.type === "ability";
}

/** Live kit-first never decides AP_DRAIN_PASSIVE, so HUD AP never drops. */
export function liveWxCommitsApDrainPassive(): boolean {
  return false;
}

/**
 * WX already writes `playerApModifier` onto `currentBattleAp` when
 * the ability is decided. This leftover is decide, not execute.
 */
export function wxAppliesPlayerApModifier(): boolean {
  return true;
}

/** Floor AP after advertised drain. Missing / non-finite AP stays 0. */
export function playerApAfterDrain(opts: {
  currentAp: number;
  lastTurnDmgAP: number;
}): number {
  const ap = finiteNumber(opts.currentAp);
  if (ap == null) return 0;
  return Math.max(0, ap - advertisedApDrainAmount(opts.lastTurnDmgAP));
}

export function playerApAfterDecide(opts: {
  currentAp: number;
  lastTurnDmgAP: number;
  decidedAbility: string | undefined;
}): number {
  if (opts.decidedAbility !== AP_DRAIN_PASSIVE_ABILITY) {
    const ap = finiteNumber(opts.currentAp);
    return ap == null ? 0 : Math.max(0, ap);
  }
  return playerApAfterDrain({
    currentAp: opts.currentAp,
    lastTurnDmgAP: opts.lastTurnDmgAP,
  });
}

/** How many advertised Strike casts fit in the remaining AP pool. */
export function strikeCountAffordable(opts: {
  currentAp: number;
  strikeApCost: number;
}): number {
  const ap = finiteNumber(opts.currentAp);
  const cost = finiteNumber(opts.strikeApCost);
  if (ap == null || cost == null || cost <= 0) return 0;
  return Math.floor(Math.max(0, ap) / cost);
}
