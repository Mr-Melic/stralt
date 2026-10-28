/**
 * Fetid Rook advertises SPLIT_ROOKS in phase 2 (`bossDefaults` phase-2
 * specialAbilities, useBossAI "Phase 2 trigger: split into two rooks",
 * lore "splitting into twins at half HP", Boss Guide "Boss splits into
 * two independent rooks").
 *
 * Live leftover — decide. `decideFetidRookAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first phase-2 pool id
 * (`spell-venom-strike`) is decided every turn. The
 * `currentPhase === 2 && !splitRooksSpawned` SPLIT_ROOKS branch sits
 * *after* that return. `applySplitRooks` writes two `pieceType: "rook"`
 * minions at advertised `ceil(hp/2)`. Live WX already commits
 * `res?.spawns` onto the combat map (HP stamp leftover of **#1231**),
 * so a decided split would occupy the fight graph. Kit-first Venom
 * never decides it, so after the 420 HP rook dies `shouldAwardVictory`
 * fires immediately — advertised twins still occupy (Strike 10 vs stamp
 * 20 leftover of #1231 leaves 10; advertised 210 leftover of #1231
 * leaves 200). Venom is 0-damage / `isDotSpell` (4 HP/turn for 3 turns)
 * so it cannot substitute for two leftover bodies.
 *
 * Unique leftover of **#1231** `bossSplitRooksHpCommit` (rook advertised
 * 210 vs WX stamp 20, once spawn is already decided). Unique vs:
 * - **#1247** Final Pawn kit-first Strike vs HP≤10% GHOST_SUMMON (king,
 *   Strike, invincible gauntlet — not Venom / rook twins).
 * - **#1159** Enthroned Void kit-first Swap vs even-turn PHANTOM_SPAWN
 *   (pawn, Swap, even turn).
 * - **#1212** Eternal Pawn kit-first Slow vs ADVANCE_PER_TURN (walk).
 * - **#1204** Eternal Pawn kit-first Slow vs AP_DRAIN (AP leftover).
 * - **#1231** HP stamp once a spawn already decided. This sidecar does
 *   not keep advertised 210 against stamp 20.
 * - Advertised atk `floor(32 * 0.8) = 25` / ap 5 vs WX `damage` 13 /
 *   `atk: 0` / `ap: 0` — contact leftover, not this decide.
 * - `checkPhaseTransition` reads `phase2.hpThreshold` 0.0 while the
 *   guide shows `phase1.hpThreshold` 0.4. That phase-gate leftover is
 *   not restored here — tests pass `currentPhase: 2`.
 * - Adjacent COMPOUNDING_ROT after Split. Not this decide.
 * - Log "one revives the other" has no revive writer. Not this decide.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion, or
 * bossSplitRooksHpCommit. Restack `decideFetidRookAction` onto
 * `resolveFetidRookSplitDecide` after older combat PRs land.
 */

export const FETID_ROOK_SPLIT_DECIDE_ID = "fetid_rook";

export const SPLIT_ROOKS_DECIDE_ABILITY = "SPLIT_ROOKS";

export const COMPOUNDING_ROT_ABILITY = "COMPOUNDING_ROT";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const ADVANCE_PER_TURN_ABILITY = "ADVANCE_PER_TURN";

export const AP_DRAIN_ABILITY = "AP_DRAIN";

/** Phase-1 and phase-2 first kit id (`bossKits` `phase2SpellIds[0]`). */
export const FETID_ROOK_PHASE2_KIT_FIRST_ID = "spell-venom-strike";

/** Final Pawn first-id — GHOST_SUMMON leftover of #1247. */
export const FINAL_PAWN_KIT_FIRST_ID = "physical_attack";

/** Enthroned Void phase-1 first-id — PHANTOM leftover of #1159. */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Eternal Pawn phase-1 first-id — ADVANCE leftover of #1212. */
export const ETERNAL_PAWN_PHASE1_KIT_FIRST_ID = "spell-slow";

export const FETID_ROOK_HP = 420;

/** Production `applySplitRooks` wants two adjacent free tiles. */
export const SPLIT_ROOKS_TWIN_COUNT = 2;

/** Production `applySplitRooks` HP — stamp leftover of #1231, not this. */
export const SPLIT_ROOKS_ADVERTISED_HP = 210;

export const SPLIT_ROOKS_LOG_NEEDLE =
  "splits into two rooks! Defeat both simultaneously or one revives the other!";

export const SPLIT_ROOKS_GUIDE_NEEDLE =
  "Boss splits into two independent rooks";

export type FetidRookPhase = 1 | 2;

export type FetidRookDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip" | "split";
  spellId?: string;
  ability?: string;
};

export type FetidRookSplitDecideInput = {
  bossId?: string;
  currentPhase: FetidRookPhase;
  kitSpellId: string | null;
  splitRooksSpawned?: boolean;
};

function isFetidRookBoss(bossId: string | undefined): boolean {
  return bossId == null || bossId === FETID_ROOK_SPLIT_DECIDE_ID;
}

/** True when production apply would fire the phase-2 Split branch. */
export function isFetidRookSplitTurn(opts: {
  bossId?: string;
  currentPhase: FetidRookPhase;
  splitRooksSpawned?: boolean;
}): boolean {
  if (!isFetidRookBoss(opts.bossId)) return false;
  if (opts.currentPhase !== 2) return false;
  if (opts.splitRooksSpawned === true) return false;
  return true;
}

/**
 * Production `decideFetidRookAction` order: kit first-id, then the
 * phase-2 SPLIT_ROOKS branch, then adjacent COMPOUNDING_ROT. This
 * leftover only models the kit-vs-Split fork — HP stamp stays
 * unrestored (#1231), rot / phase-gate / revive stay unrestored.
 */
export function wxFetidRookSplitDecide(
  opts: FetidRookSplitDecideInput,
): FetidRookDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isFetidRookSplitTurn(opts)) {
    return { type: "split", ability: SPLIT_ROOKS_DECIDE_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer SPLIT_ROOKS in Fetid Rook phase 2 so advertised twins can hit
 * the tile. Other bosses still let kit win (Final Pawn GHOST leftover
 * of #1247, Enthroned Void PHANTOM leftover of #1159, Eternal Pawn
 * ADVANCE leftover of #1212). Already-split does not re-split.
 */
export function resolveFetidRookSplitDecide(
  opts: FetidRookSplitDecideInput,
): FetidRookDecideAction {
  if (isFetidRookSplitTurn(opts)) {
    return { type: "split", ability: SPLIT_ROOKS_DECIDE_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/**
 * True when live decide spends a phase-2 Split that would apply on kit
 * first-id.
 */
export function wxFetidRookKitBlocksSplit(
  opts: FetidRookSplitDecideInput,
): boolean {
  const live = wxFetidRookSplitDecide(opts);
  const next = resolveFetidRookSplitDecide(opts);
  return live.type === "spell" && next.ability === SPLIT_ROOKS_DECIDE_ABILITY;
}

/** Live kit-first never decides SPLIT_ROOKS, so twins never occupy. */
export function liveWxCommitsFetidRookSplit(): boolean {
  return false;
}

/**
 * WX already writes `res?.spawns` onto the combat map when the ability
 * is decided. This leftover is decide, not the HP stamp of #1231.
 */
export function wxAppliesFetidRookSplitSpawns(): boolean {
  return true;
}

export function twinCountAfterFetidRookDecide(opts: {
  decidedAbility: string | undefined;
}): number {
  return opts.decidedAbility === SPLIT_ROOKS_DECIDE_ABILITY
    ? SPLIT_ROOKS_TWIN_COUNT
    : 0;
}

export function fetidRookHostilesAfterDecide(opts: {
  bossHp: number;
  decidedAbility: string | undefined;
}): number {
  const twins = twinCountAfterFetidRookDecide({
    decidedAbility: opts.decidedAbility,
  });
  const boss = Number.isFinite(opts.bossHp) && opts.bossHp > 0 ? 1 : 0;
  return boss + twins;
}
