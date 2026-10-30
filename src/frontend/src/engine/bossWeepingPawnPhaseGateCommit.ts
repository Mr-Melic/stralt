/**
 * Weeping Pawn advertised Phase 2 never arms at 30% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.3, phase2.statMultiplier
 * 2.0 + PROMOTE_QUEEN + ATTACK_ALL_LINES; Boss Guide "Phase 2 — HP ≤ 30%";
 * Boss Rush room 0 `boss2Id: "weeping_pawn"`; WX ISSUE 5 full-heal):
 *   checkPhaseTransition should arm currentPhase 2 at 150/500.
 *   WorldExploration then commits hpAfterBossPhase2(150, 500, 2.0, true)
 *   → 1000/1000 in the same flushSync as the PROMOTES log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Weeping `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.3. At 150/500 (0.3) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 150/500.
 * WX never takes the `isWeepingPawn` full-heal arm. Kit-first Strike
 * still shadows `decideWeepingPawnAction`'s own 0.3 PROMOTE branch.
 *
 * Unique leftover of **#1342** (Static ×1.5 at 40% of **340** → 204/510;
 * that sidecar returns null for weeping_pawn), **#1337/#1338** (Cavalier
 * ×1.6 at 50% of 320 → 256/512), **#1336** (Grandmaster ×1.3 at 60% of
 * 300 → 234/390), **#1333** (Broodmother ×1.4 at 50% of 480 → 336/672),
 * **#1332** (Archbishop ×1.4 at 50% of 350 → 245/490), **#1329**
 * (Countess ×1.5 at 40% of 400 → 240/600), and **#1325** (Fetid Split
 * twins; Fetid `phase2.statMultiplier` is 1.0 so that sidecar has no HP
 * fire). Unique vs kit-first `physical_attack` (first in the phase-1
 * pool under empty Map). Midnight Bishop MERGE / Starborn Queen VOID /
 * Eternal Pawn King AP_DRAIN / Alabaster Fortress BOARD_SHRINK are
 * sibling leftovers — this resolver returns null for those ids. Do not
 * add `atk` / `ap` / `res` / `chc` / `chain` / `shock` / `blast` /
 * `haste` / `frost` / `expose` / `spike` / `jump` / `strike` /
 * `illusion` / `copies` / `swap` / `teleport` / `split` / `twins` /
 * `lava` / `inferno` / `reflect` / `spawn` / `minion` / `larvae` /
 * `ghost` / `roll` / `promote` / `merge` / `void` / `drain` / `lines`
 * / `slow` / `iron` / `rally`.
 *
 * Export names stay unique vs `#1342` (`resolveLordOfStaticPhaseGate`,
 * `executeStaticPhaseGateHp`, `STATIC_PHASE_GATE_*`), `#1337/#1338`
 * (`resolveBoneCavalierPhaseGate`, `executeCavalierPhaseGateHp`),
 * `#1336` (`resolveVoidGrandmasterPhaseGate`,
 * `executeGrandmasterPhaseGateHp`), `#1333`
 * (`resolveBroodmotherRookPhaseGate`, `executeBroodmotherPhaseGateHp`),
 * `#1332` (`resolvePaleArchbishopPhaseGate`,
 * `executeArchbishopPhaseGateHp`), `#1329`
 * (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`,
 * `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / bossStaticPhaseGateCommit / bossCavalierPhaseGateCommit /
 * bossGrandmasterPhaseGateCommit / bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveWeepingPawnPhaseGate`
 * after those PRs land. Do not undo Static ×1.5 (#1342), Cavalier ×1.6
 * (#1337/#1338), Grandmaster ×1.3 (#1336), Broodmother ×1.4 (#1333),
 * Archbishop ×1.4 (#1332), Countess ×1.5 (#1329), or Fetid Split
 * (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const WEEPING_PAWN_PHASE_GATE_BOSS_ID = "weeping_pawn";

export const WEEPING_PAWN_PHASE_GATE_ABILITY = "PROMOTE_QUEEN";

/** Adjacent leftover — queen-ray lines never arm while phase 2 is dead. */
export const WEEPING_PAWN_PHASE_GATE_LINES_LEFTOVER = "ATTACK_ALL_LINES";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const WEEPING_PAWN_PHASE_GATE_KIT_FIRST = "physical_attack";

/** Phase-2 kit first-id leftover — still kit-latent under empty Map. */
export const WEEPING_PAWN_PHASE_GATE_KIT_PHASE2 = "spell-slow";

export const WEEPING_PAWN_PHASE_GATE_HP = 500;

/** Catalog / guide `phase1.hpThreshold`. No prior sidecar uses 0.3 of 500. */
export const WEEPING_PAWN_PHASE_GATE_ADVERTISED_THRESHOLD = 0.3;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const WEEPING_PAWN_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Midnight Bishop is also 2.0 of 360. */
export const WEEPING_PAWN_PHASE_GATE_STAT_MULT = 2.0;

/** 500 * 0.3 — first HP that advertised phase 2 must arm. */
export const WEEPING_PAWN_PHASE_GATE_HP_AT_GUIDE = 150;

/** hpAfterBossPhase2(150, 500, 2.0, true) — WX ISSUE 5 full heal. */
export const WEEPING_PAWN_PHASE_GATE_HP_AFTER = 1000;

export const WEEPING_PAWN_PHASE_GATE_MAX_HP_AFTER = 1000;

/** WX `hpAfterBossPhase2(..., isWeepingPawn)` — unique vs scaled leftovers. */
export const WEEPING_PAWN_PHASE_GATE_FULL_HEAL = true;

export const WEEPING_PAWN_PHASE_GATE_GUIDE_NEEDLE =
  "At low HP the boss transforms into a queen with vastly increased range and power. Burst it down before the promotion.";

export const WEEPING_PAWN_PHASE_GATE_LORE_NEEDLE =
  "promoting to a deadly queen at low HP";

export type WeepingPawnPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type WeepingPawnPhaseGateArgs = {
  bossId?: string;
  hp: number;
  maxHp: number;
  /** True when `bossState.phase2Triggered` / currentPhase is already 2. */
  alreadyPhase2: boolean;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function isWeepingPawnPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === WEEPING_PAWN_PHASE_GATE_BOSS_ID;
}

export function weepingPawnHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Weeping Pawn). */
export function liveWxWeepingPawnPhaseThreshold(): number {
  return WEEPING_PAWN_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.3). */
export function advertisedWeepingPawnPhaseThreshold(): number {
  return WEEPING_PAWN_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxWeepingPawnPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    weepingPawnHpFraction(opts.hp, opts.maxHp) <=
    liveWxWeepingPawnPhaseThreshold()
  );
}

export function advertisedWeepingPawnPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    weepingPawnHpFraction(opts.hp, opts.maxHp) <=
    advertisedWeepingPawnPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Weeping Pawn phase 2 at the advertised 30% card.
 * Other bosses return null (Static ×1.5 #1342, Cavalier ×1.6 #1337/#1338,
 * Grandmaster ×1.3 #1336, Broodmother ×1.4 #1333, Archbishop ×1.4 #1332,
 * Countess ×1.5 of 400 #1329, Fetid Split #1325, Final Pawn HP≤10% GHOST
 * leftover of #1247).
 */
export function resolveWeepingPawnPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isWeepingPawnPhaseGateBoss(args.bossId)) return null;
  if (!advertisedWeepingPawnPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteWeepingPawnPhaseGateHp(
  args: WeepingPawnPhaseGateArgs,
): boolean {
  if (!isWeepingPawnPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedWeepingPawnPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitWeepingPawnPhaseGateHp(
  args: WeepingPawnPhaseGateArgs,
): boolean {
  return canExecuteWeepingPawnPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 30% ×2.0 full heal. Live 0.0
 * gate never calls this (`liveWxWeepingPawnPhaseTransitioned` stays false
 * at 150/500). Does not stamp PROMOTE / queen-ray — kit-first Strike
 * still shadows the decide 0.3 branch.
 */
export function executeWeepingPawnPhaseGateHp(
  args: WeepingPawnPhaseGateArgs,
): WeepingPawnPhaseGateExecute | null {
  if (!canExecuteWeepingPawnPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    WEEPING_PAWN_PHASE_GATE_STAT_MULT,
    WEEPING_PAWN_PHASE_GATE_FULL_HEAL,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxWeepingPawnReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesWeepingPawnPhaseHpOnceTransitioned(): boolean {
  return true;
}

/**
 * WX ISSUE 5 passes `isWeepingPawn` as the fullHeal flag. Scaled
 * leftovers (#1342 Static false) must not share this commit.
 */
export function wxWeepingPawnPhaseHpFullHealOnceTransitioned(): boolean {
  return true;
}
