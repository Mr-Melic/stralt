/**
 * Broodmother Rook advertises LARVAE_SPAWN every other turn
 * (`bossDefaults` phase-1/2 specialAbilities, Enemy Register "spawns
 * larvae every 2 turns", Boss Guide "Boss spawns larvae that explode
 * on contact", lore "shell armor activates while they live").
 *
 * Live leftover — decide. `decideBroodmotherRookAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first pool id
 * (`summon-archer`) is decided every turn. The odd-turn and phase-2
 * even-turn LARVAE_SPAWN branches sit *after* that return.
 * `applyLarvaeSpawn` writes one `hp: 1` `LarvaData` plus
 * `newBossState.larvae`. Live WX already merges `res?.newBossState`,
 * so a decided spawn would put a larva marker in bossState (Shell
 * Armor `castHelpers` reads `larvae.length`; explode leftover of
 * **#1217** needs that tile). Kit-first Archer never decides it, so
 * after the 480 HP rook dies `shouldAwardVictory` can fire with an
 * empty larvae array — advertised 1 HP markers never start Shell
 * Armor (`floor(Strike 10 / 2) = 5`). Archer is 0-damage /
 * `isSummon` (hpScale 0.7, lifespan 4) so it cannot substitute for
 * a 1 HP explode-on-contact larva or the 50% DR while larvae live.
 *
 * Unique leftover of **#1269** `bossKitSummonCap` (kit Archer pack
 * cap / cooldown, once that summon is already decided) and **#1217**
 * `bossLarvaeExplodeWalkExecute` (5×3 contact venom, once a larva
 * marker already exists). Unique vs:
 * - **#1261** Fetid Rook kit-first Venom vs SPLIT_ROOKS (rook twins).
 * - **#1247** Final Pawn kit-first Strike vs HP≤10% GHOST_SUMMON.
 * - **#1159** Enthroned Void kit-first Swap vs even-turn PHANTOM_SPAWN.
 * - **#1102** Pale Archivist kit-first Mark vs odd-turn SCROLL_SUMMON.
 * - **#920** LARVAE_SPAWN portal/crumb snap (placement, not decide).
 * - **#382** Shell Armor spell-kill death tracking (once larvae live).
 * - WX unread `newLarvae` as combatants — occupancy leftover, not this.
 * - First-spawn `shellArmorActive` copies pre-spawn `larvae.length`
 *   (false on the opening spawn). Flag leftover, not this decide.
 * - `checkPhaseTransition` reads `phase2.hpThreshold` 0.0 while the
 *   guide shows `phase1.hpThreshold` 0.5. Tests pass `currentPhase: 2`.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, occupancyLarvaUnseal, statusEffects, spellEngine,
 * challengeCompletion, castHelpers, bossLarvaeExplodeWalkExecute, or
 * bossKitSummonCap. Restack `decideBroodmotherRookAction` onto
 * `resolveBroodmotherLarvaeDecide` after older combat PRs land.
 */

export const BROODMOTHER_LARVAE_DECIDE_ID = "broodmother_rook";

export const LARVAE_SPAWN_DECIDE_ABILITY = "LARVAE_SPAWN";

export const SHELL_ARMOR_DECIDE_ABILITY = "SHELL_ARMOR";

export const LARVAE_EXPLODE_DECIDE_ABILITY = "LARVAE_EXPLODE";

export const SPLIT_ROOKS_DECIDE_ABILITY = "SPLIT_ROOKS";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const SCROLL_SUMMON_ABILITY = "SCROLL_SUMMON";

/** Phase-1 and phase-2 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const BROODMOTHER_KIT_FIRST_ID = "summon-archer";

/** Fetid Rook first-id — SPLIT leftover of #1261. */
export const FETID_ROOK_KIT_FIRST_ID = "spell-venom-strike";

/** Final Pawn first-id — GHOST leftover of #1247. */
export const FINAL_PAWN_KIT_FIRST_ID = "physical_attack";

/** Enthroned Void phase-1 first-id — PHANTOM leftover of #1159. */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Pale Archivist phase-2 first-id — SCROLL leftover of #1102. */
export const PALE_ARCHIVIST_PHASE2_KIT_FIRST_ID = "spell-mark";

export const BROODMOTHER_HP = 480;

/** Production `applyLarvaeSpawn` writes one adjacent 1 HP marker. */
export const LARVAE_SPAWN_ADVERTISED_COUNT = 1;

export const LARVAE_SPAWN_ADVERTISED_HP = 1;

/** Catalog Strike — Shell Armor `Math.max(1, floor(dmg / 2))`. */
export const BROODMOTHER_STRIKE_DAMAGE = 10;

export const BROODMOTHER_STRIKE_SHELL_DAMAGE = 5;

export const LARVAE_SPAWN_LOG_NEEDLE = "spawns a larva at";

export const LARVAE_SPAWN_GUIDE_NEEDLE =
  "Boss spawns larvae that explode on contact";

export const LARVAE_SPAWN_REGISTER_NEEDLE =
  "Constantly spawns larvae every 2 turns";

export type BroodmotherPhase = 1 | 2;

export type BroodmotherDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type BroodmotherLarvaeDecideInput = {
  bossId?: string;
  currentPhase: BroodmotherPhase;
  /** Production `currentTurn` — odd every-other-turn, phase-2 even extra. */
  currentTurn: number;
  kitSpellId: string | null;
};

function isBroodmotherBoss(bossId: string | undefined): boolean {
  return bossId == null || bossId === BROODMOTHER_LARVAE_DECIDE_ID;
}

/**
 * True when production apply would fire a LARVAE_SPAWN branch:
 * phase-2 even turns, or any-phase odd turns.
 */
export function isBroodmotherLarvaeSpawnTurn(opts: {
  bossId?: string;
  currentPhase: BroodmotherPhase;
  currentTurn: number;
}): boolean {
  if (!isBroodmotherBoss(opts.bossId)) return false;
  if (!Number.isFinite(opts.currentTurn)) return false;
  const turn = Math.trunc(opts.currentTurn);
  if (opts.currentPhase === 2 && turn % 2 === 0) return true;
  return turn % 2 === 1;
}

/**
 * Production `decideBroodmotherRookAction` order: kit first-id, then
 * phase-2 even LARVAE_SPAWN, then odd-turn LARVAE_SPAWN, then adjacent
 * SHELL_ARMOR attack. This leftover only models the kit-vs-spawn fork
 * — explode (#1217), cap (#1269), occupancy (#920), and the first-spawn
 * shell flag stay unrestored.
 */
export function wxBroodmotherLarvaeDecide(
  opts: BroodmotherLarvaeDecideInput,
): BroodmotherDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isBroodmotherLarvaeSpawnTurn(opts)) {
    return { type: "ability", ability: LARVAE_SPAWN_DECIDE_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer LARVAE_SPAWN on Broodmother odd / phase-2 even turns so the
 * advertised 1 HP marker can hit bossState. Other bosses still let kit
 * win (Fetid Split leftover of #1261, Final Pawn GHOST leftover of
 * #1247, Enthroned Void PHANTOM leftover of #1159, Pale Archivist
 * SCROLL leftover of #1102). Phase-1 even still lets kit win.
 */
export function resolveBroodmotherLarvaeDecide(
  opts: BroodmotherLarvaeDecideInput,
): BroodmotherDecideAction {
  if (isBroodmotherLarvaeSpawnTurn(opts)) {
    return { type: "ability", ability: LARVAE_SPAWN_DECIDE_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/**
 * True when live decide spends an odd / phase-2 even spawn that would
 * apply on kit first-id.
 */
export function wxBroodmotherKitBlocksLarvaeSpawn(
  opts: BroodmotherLarvaeDecideInput,
): boolean {
  const live = wxBroodmotherLarvaeDecide(opts);
  const next = resolveBroodmotherLarvaeDecide(opts);
  return live.type === "spell" && next.ability === LARVAE_SPAWN_DECIDE_ABILITY;
}

/** Live kit-first never decides LARVAE_SPAWN, so markers never land. */
export function liveWxCommitsBroodmotherLarvaeSpawn(): boolean {
  return false;
}

/**
 * WX already writes `res?.newBossState` when the ability is decided.
 * This leftover is decide, not the unread `newLarvae` combatant stamp.
 */
export function wxAppliesBroodmotherLarvaeNewBossState(): boolean {
  return true;
}

/** WX never maps `res.newLarvae` onto `addCombatant`. Occupancy leftover. */
export function wxAppliesBroodmotherNewLarvaeAsCombatants(): boolean {
  return false;
}

export function larvaCountAfterBroodmotherDecide(opts: {
  decidedAbility: string | undefined;
}): number {
  return opts.decidedAbility === LARVAE_SPAWN_DECIDE_ABILITY
    ? LARVAE_SPAWN_ADVERTISED_COUNT
    : 0;
}

/**
 * Production `castHelpers` Shell Armor: larvae live AND
 * `shellArmorActive`. First-spawn copies pre-spawn length (flag
 * leftover) — callers that want advertised soak pass both flags.
 */
export function broodmotherAdvertisedShellStrike(opts: {
  strikeDamage: number;
  larvaeCount: number;
  shellArmorActive: boolean;
}): number {
  const raw = Number(opts.strikeDamage);
  const dmg = Number.isFinite(raw) && raw > 0 ? raw : 0;
  if (dmg <= 0) return 0;
  if (opts.shellArmorActive !== true) return dmg;
  if (!(Number(opts.larvaeCount) > 0)) return dmg;
  return Math.max(1, Math.floor(dmg / 2));
}
