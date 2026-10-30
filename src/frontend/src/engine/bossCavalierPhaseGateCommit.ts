/**
 * Bone Cavalier advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.6 + SPIKE_ON_LAND + KNIGHT_JUMP_IGNORE_WALLS; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 2):
 *   checkPhaseTransition should arm currentPhase 2 at 160/320.
 *   WorldExploration then commits hpAfterBossPhase2(160, 320, 1.6, false)
 *   → 256/512 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Cavalier `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 160/320 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 160/320.
 * `decideBoneCavalierAction` never sees currentPhase 2 from HP, so
 * SPIKE_ON_LAND is unreachable while alive.
 *
 * Unique leftover of **#1336** (Grandmaster ×1.3 at 60% of 300 → 234/390;
 * that sidecar returns null for bone_cavalier), **#1333** (Broodmother
 * ×1.4 at 50% of 480 → 336/672), **#1332** (Archbishop ×1.4 at 50% of
 * 350 → 245/490), **#1329** (Countess ×1.5 at 40% of 400 → 240/600),
 * and **#1325** (Fetid Split twins; Fetid `phase2.statMultiplier` is 1.0
 * so that sidecar has no HP fire). Unique vs kit-first Strike
 * (`physical_attack` is first in both Cavalier pools under empty Map).
 * Lord of Static CHAIN / Midnight Bishop MERGE / Weeping Pawn PROMOTE
 * are sibling leftovers — this resolver returns null for those ids. Do
 * not add `atk` / `ap` / `res` / `chc` / `spike` / `jump` / `strike` /
 * `haste` / `enrage` / `expose` / `illusion` / `copies` / `swap` /
 * `teleport` / `blast` / `split` / `twins` / `lava` / `inferno` /
 * `reflect` / `spawn` / `minion` / `larvae` / `ghost` / `roll`.
 *
 * Export names stay unique vs `#1336` (`resolveVoidGrandmasterPhaseGate`,
 * `executeGrandmasterPhaseGateHp`, `GRANDMASTER_PHASE_GATE_*`), `#1333`
 * (`resolveBroodmotherRookPhaseGate`, `executeBroodmotherPhaseGateHp`),
 * `#1332` (`resolvePaleArchbishopPhaseGate`, `executeArchbishopPhaseGateHp`),
 * `#1329` (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / bossGrandmasterPhaseGateCommit /
 * bossBroodmotherPhaseGateCommit / bossArchbishopPhaseGateCommit /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveBoneCavalierPhaseGate`
 * after those PRs land. Do not undo Grandmaster ×1.3 (#1336),
 * Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332), Countess ×1.5
 * (#1329), or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const BONE_CAVALIER_PHASE_GATE_BOSS_ID = "bone_cavalier";

export const CAVALIER_PHASE_GATE_ABILITY = "SPIKE_ON_LAND";

/** Adjacent leftover — jump already runs in phase 1; not restored here. */
export const CAVALIER_PHASE_GATE_JUMP_LEFTOVER = "KNIGHT_JUMP_IGNORE_WALLS";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const CAVALIER_PHASE_GATE_KIT_FIRST = "physical_attack";

/** Phase-2 kit extra leftover — still kit-latent under empty Map. */
export const CAVALIER_PHASE_GATE_KIT_PHASE2 = "spell-enrage";

export const CAVALIER_PHASE_GATE_HP = 320;

/** Catalog / guide `phase1.hpThreshold`. */
export const CAVALIER_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const CAVALIER_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Archbishop/Broodmother are 1.4. */
export const CAVALIER_PHASE_GATE_STAT_MULT = 1.6;

/** 320 * 0.5 — first HP that advertised phase 2 must arm. */
export const CAVALIER_PHASE_GATE_HP_AT_GUIDE = 160;

/** hpAfterBossPhase2(160, 320, 1.6, false). */
export const CAVALIER_PHASE_GATE_HP_AFTER = 256;

export const CAVALIER_PHASE_GATE_MAX_HP_AFTER = 512;

export const CAVALIER_PHASE_GATE_GUIDE_NEEDLE =
  "Landing on tiles near the boss triggers spike damage. Stay mobile and avoid end-of-turn positioning on adjacent tiles.";

export const CAVALIER_PHASE_GATE_LORE_NEEDLE =
  "leaps through walls ignoring all obstacles";

export type CavalierPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type CavalierPhaseGateArgs = {
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

export function isBoneCavalierPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === BONE_CAVALIER_PHASE_GATE_BOSS_ID;
}

export function cavalierHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Cavalier). */
export function liveWxCavalierPhaseThreshold(): number {
  return CAVALIER_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedCavalierPhaseThreshold(): number {
  return CAVALIER_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxCavalierPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    cavalierHpFraction(opts.hp, opts.maxHp) <= liveWxCavalierPhaseThreshold()
  );
}

export function advertisedCavalierPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    cavalierHpFraction(opts.hp, opts.maxHp) <=
    advertisedCavalierPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Cavalier phase 2 at the advertised 50% card.
 * Other bosses return null (Grandmaster ×1.3 #1336, Broodmother ×1.4 #1333,
 * Archbishop ×1.4 #1332, Countess ×1.5 #1329, Fetid Split #1325, Final Pawn
 * HP≤10% GHOST leftover of #1247).
 */
export function resolveBoneCavalierPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isBoneCavalierPhaseGateBoss(args.bossId)) return null;
  if (!advertisedCavalierPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteCavalierPhaseGateHp(
  args: CavalierPhaseGateArgs,
): boolean {
  if (!isBoneCavalierPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedCavalierPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitCavalierPhaseGateHp(
  args: CavalierPhaseGateArgs,
): boolean {
  return canExecuteCavalierPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.6. Live 0.0 gate never
 * calls this (`liveWxCavalierPhaseTransitioned` stays false at 160/320).
 * Does not stamp spikes / jump — kit-first Strike still shadows
 * SPIKE_ON_LAND, and jump already runs in phase 1.
 */
export function executeCavalierPhaseGateHp(
  args: CavalierPhaseGateArgs,
): CavalierPhaseGateExecute | null {
  if (!canExecuteCavalierPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    CAVALIER_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxCavalierReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesCavalierPhaseHpOnceTransitioned(): boolean {
  return true;
}
