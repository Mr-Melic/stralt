/**
 * Final Pawn advertises GHOST_SUMMON at ≤10% HP (`bossDefaults` phase-2
 * specialAbilities, useBossAI "become invincible and summon all ghost
 * bosses", lore "becomes invincible at 1 HP, summoning all 11 ghost
 * bosses at once", Boss Guide "Boss summons ghost versions of previous
 * bosses").
 *
 * Live leftover — decide. `decideFinalPawnAction` calls
 * `pickBossKitSpell` with `new Map()`, so the first pool id
 * (`physical_attack`) is decided every turn. The HP≤10% GHOST_SUMMON +
 * INVINCIBLE_PHASE branch sits *after* that return.
 * `applyGhostSummon` writes eleven `pieceType: "king"` minions at
 * advertised 1 HP. Live WX already commits `res?.spawns` onto the
 * combat map (HP stamp leftover of **#1220**), so a decided spawn
 * would actually occupy the fight graph. Kit-first Strike never
 * decides it, so a pawn at 60/600 stays damageable with zero ghosts
 * instead of five-turn invincibility plus eleven leftover kings.
 * Strike is 10-damage / `isPhysical` so it cannot substitute for the
 * advertised gauntlet.
 *
 * Unique leftover of **#1220** `bossGhostSummonHpCommit` (king
 * advertised 1 vs WX stamp 20, once spawn is already decided). Unique
 * vs:
 * - **#1159** Enthroned Void kit-first Swap vs even-turn PHANTOM_SPAWN
 *   (pawn, Swap, even turn — not Strike / HP≤10%).
 * - **#1212** Eternal Pawn kit-first Slow vs ADVANCE_PER_TURN (walk,
 *   not spawn).
 * - **#1204** Eternal Pawn kit-first Slow vs AP_DRAIN (AP leftover).
 * - **#1231** Fetid Rook SPLIT_ROOKS half-HP stamp (rook, not decide).
 * - **#1220** HP stamp once a spawn already decided. This sidecar does
 *   not keep advertised 1 against stamp 20.
 *
 * Does not restack WorldExploration, useBossAI, useBossSystem,
 * occupancy, statusEffects, spellEngine, challengeCompletion, or
 * bossGhostSummonHpCommit. Restack `decideFinalPawnAction` onto
 * `resolveFinalPawnGhostDecide` after older combat PRs land.
 */

export const FINAL_PAWN_ID = "final_pawn";

export const GHOST_SUMMON_ABILITY = "GHOST_SUMMON";

export const INVINCIBLE_PHASE_ABILITY = "INVINCIBLE_PHASE";

export const PHANTOM_SPAWN_ABILITY = "PHANTOM_SPAWN";

export const ADVANCE_PER_TURN_ABILITY = "ADVANCE_PER_TURN";

export const SPLIT_ROOKS_ABILITY = "SPLIT_ROOKS";

export const AP_DRAIN_ABILITY = "AP_DRAIN";

/** Phase-1 and phase-2 first kit id (`bossKits` `phase1SpellIds[0]`). */
export const FINAL_PAWN_KIT_FIRST_ID = "physical_attack";

/** Enthroned Void phase-1 first-id — PHANTOM_SPAWN leftover of #1159. */
export const ENTHRONED_VOID_PHASE1_KIT_FIRST_ID = "spell-swap";

/** Eternal Pawn phase-1 first-id — ADVANCE leftover of #1212. */
export const ETERNAL_PAWN_PHASE1_KIT_FIRST_ID = "spell-slow";

export const FINAL_PAWN_HP = 600;

/** Production `boss.hp / boss.maxHp <= 0.1` trigger. */
export const GHOST_SUMMON_HP_RATIO = 0.1;

export const GHOST_SUMMON_TRIGGER_HP = 60;

/** Production `final_pawn` phase-2 `summonCount` / lore "all 11". */
export const GHOST_SUMMON_COUNT = 11;

/** Production `applyInvinciblePhase` countdown. */
export const INVINCIBLE_PHASE_TURNS = 5;

/** Production `applyGhostSummon` HP — stamp leftover of #1220, not this. */
export const GHOST_SUMMON_HP = 1;

export const GHOST_SUMMON_LOG_NEEDLE =
  "ghost bosses! Defeat them all in 5 turns!";

export const GHOST_SUMMON_GUIDE_NEEDLE =
  "Boss summons ghost versions of previous bosses";

export const INVINCIBLE_LOG_NEEDLE =
  "The Final Pawn becomes INVINCIBLE for 5 turns";

export type FinalPawnPhase = 1 | 2;

export type FinalPawnDecideAction = {
  type: "spell" | "ability" | "summon" | "attack" | "move" | "skip";
  spellId?: string;
  ability?: string;
};

export type FinalPawnGhostDecideInput = {
  bossId?: string;
  currentPhase: FinalPawnPhase;
  kitSpellId: string | null;
  phase2Triggered?: boolean;
  bossHp?: number;
  bossMaxHp?: number;
};

function finiteNumber(n: unknown): number | null {
  const v = Number(n);
  if (!Number.isFinite(v)) return null;
  return v;
}

function isFinalPawnBoss(bossId: string | undefined): boolean {
  return bossId == null || bossId === FINAL_PAWN_ID;
}

function hpRatio(opts: { bossHp?: number; bossMaxHp?: number }): number {
  const hp = finiteNumber(opts.bossHp);
  const maxHp = finiteNumber(opts.bossMaxHp) ?? FINAL_PAWN_HP;
  if (hp == null || maxHp <= 0) return 1;
  return hp / maxHp;
}

/** True when production apply would fire the 10% ghost + invincible branch. */
export function isFinalPawnGhostTurn(opts: {
  bossId?: string;
  phase2Triggered?: boolean;
  bossHp?: number;
  bossMaxHp?: number;
}): boolean {
  if (!isFinalPawnBoss(opts.bossId)) return false;
  if (opts.phase2Triggered === true) return false;
  return hpRatio(opts) <= GHOST_SUMMON_HP_RATIO;
}

/**
 * Production `decideFinalPawnAction` order: kit first-id, then the
 * HP≤10% GHOST_SUMMON + INVINCIBLE_PHASE branch. This leftover only
 * models the kit-vs-ghost fork — HP stamp stays unrestored (#1220).
 */
export function wxFinalPawnGhostDecide(
  opts: FinalPawnGhostDecideInput,
): FinalPawnDecideAction {
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  if (isFinalPawnGhostTurn(opts)) {
    return { type: "summon", ability: GHOST_SUMMON_ABILITY };
  }
  return { type: "skip" };
}

/**
 * Prefer GHOST_SUMMON at Final Pawn ≤10% HP so advertised ghosts and
 * five-turn invincibility can hit the tile. Other bosses still let kit
 * win (Enthroned Void PHANTOM leftover of #1159, Eternal Pawn ADVANCE
 * leftover of #1212). Already-triggered phase 2 does not re-summon.
 */
export function resolveFinalPawnGhostDecide(
  opts: FinalPawnGhostDecideInput,
): FinalPawnDecideAction {
  if (isFinalPawnGhostTurn(opts)) {
    return { type: "summon", ability: GHOST_SUMMON_ABILITY };
  }
  if (opts.kitSpellId) {
    return { type: "spell", spellId: opts.kitSpellId };
  }
  return { type: "skip" };
}

/**
 * True when live decide spends a 10% ghost trigger that would apply on
 * kit first-id.
 */
export function wxFinalPawnKitBlocksGhost(
  opts: FinalPawnGhostDecideInput,
): boolean {
  const live = wxFinalPawnGhostDecide(opts);
  const next = resolveFinalPawnGhostDecide(opts);
  return live.type === "spell" && next.ability === GHOST_SUMMON_ABILITY;
}

/** Live kit-first never decides GHOST_SUMMON, so ghosts never occupy. */
export function liveWxCommitsFinalPawnGhosts(): boolean {
  return false;
}

/**
 * WX already writes `res?.spawns` onto the combat map when the ability
 * is decided. This leftover is decide, not the HP stamp of #1220.
 */
export function wxAppliesFinalPawnGhostSpawns(): boolean {
  return true;
}

export function ghostCountAfterFinalPawnDecide(opts: {
  decidedAbility: string | undefined;
}): number {
  return opts.decidedAbility === GHOST_SUMMON_ABILITY ? GHOST_SUMMON_COUNT : 0;
}

export function invincibleTurnsAfterFinalPawnDecide(opts: {
  decidedAbility: string | undefined;
}): number {
  return opts.decidedAbility === GHOST_SUMMON_ABILITY
    ? INVINCIBLE_PHASE_TURNS
    : 0;
}

/**
 * Kit Strike can still cut the pawn. Advertised invincibility keeps HP.
 * Does not model player-turn damage — this is the boss-turn fork.
 */
export function bossHpAfterFinalPawnDecide(opts: {
  bossHp: number;
  decidedAbility: string | undefined;
  kitStrikeDamage: number;
}): number {
  const hp = finiteNumber(opts.bossHp) ?? 0;
  if (opts.decidedAbility === GHOST_SUMMON_ABILITY) {
    return Math.max(0, hp);
  }
  const dmg = finiteNumber(opts.kitStrikeDamage) ?? 0;
  return Math.max(0, hp - Math.max(0, dmg));
}
