/**
 * Crimson Countess advertised Phase 2 never arms at 40% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.4, phase2.statMultiplier
 * 1.5 + LAVA_TRAIL; Boss Guide "Phase 2 — HP ≤ 40%"; Boss Rush room 1):
 *   checkPhaseTransition should arm currentPhase 2 at 160/400.
 *   WorldExploration then commits hpAfterBossPhase2(160, 400, 1.5, false)
 *   → 240/600 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Countess `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.4. At 160/400 (0.4) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 160/400.
 * `decideCrimsonCountessAction` never sees currentPhase 2 from HP.
 *
 * Unique leftover of **#1325** (Fetid Rook Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire). Unique
 * vs **#1323** kit Inferno CD 3 (phase-2 first-id still Inferno under
 * empty Map — LAVA_TRAIL occupancy is that leftover, not restored here),
 * **#1261** Fetid Venom vs Split, **#1231** / **#1271** / **#1316** Fetid
 * twin stamps, **#1247** Final Pawn HP≤10% GHOST. Pale Archbishop
 * REFLECT+SPAWN / Void Grandmaster ILLUSION_SPLIT / Broodmother 0.0 are
 * sibling leftovers — this resolver returns null for those ids. Do not
 * add `atk` / `ap` / `res` / `chc` / `lava` / `inferno` / `trail` /
 * `split` / `twins` / `venom` / `ghost` / `roll`.
 *
 * Export names stay unique vs `#1325` (`resolveFetidRookPhaseGate`,
 * `executeFetidRookPhaseGateSplit`, `FETID_ROOK_PHASE_GATE_*`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * bossSplitRooksPhaseGateCommit. Restack `checkPhaseTransition` onto
 * `resolveCrimsonCountessPhaseGate` after those PRs land. Do not undo
 * kit-first Inferno (#1323) or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const CRIMSON_COUNTESS_PHASE_GATE_BOSS_ID = "crimson_countess";

export const COUNTESS_PHASE_GATE_ABILITY = "LAVA_TRAIL";

/** Kit-first leftover — phase-1 and phase-2 first-id, not restored here (#1323). */
export const COUNTESS_PHASE_GATE_KIT_FIRST = "spell-inferno";

export const COUNTESS_PHASE_GATE_HP = 400;

/** Catalog / guide `phase1.hpThreshold`. */
export const COUNTESS_PHASE_GATE_ADVERTISED_THRESHOLD = 0.4;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const COUNTESS_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Fetid's is 1.0 — unique vs #1325. */
export const COUNTESS_PHASE_GATE_STAT_MULT = 1.5;

/** 400 * 0.4 — first HP that advertised phase 2 must arm. */
export const COUNTESS_PHASE_GATE_HP_AT_GUIDE = 160;

/** hpAfterBossPhase2(160, 400, 1.5, false). */
export const COUNTESS_PHASE_GATE_HP_AFTER = 240;

export const COUNTESS_PHASE_GATE_MAX_HP_AFTER = 600;

export const COUNTESS_PHASE_GATE_GUIDE_NEEDLE =
  "Boss leaves damaging lava tiles behind";

export const COUNTESS_PHASE_GATE_LORE_NEEDLE =
  "leaving rivers of lava wherever she travels";

export type CountessPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type CountessPhaseGateArgs = {
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

export function isCrimsonCountessPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === CRIMSON_COUNTESS_PHASE_GATE_BOSS_ID;
}

export function countessHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Countess). */
export function liveWxCountessPhaseThreshold(): number {
  return COUNTESS_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.4). */
export function advertisedCountessPhaseThreshold(): number {
  return COUNTESS_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxCountessPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    countessHpFraction(opts.hp, opts.maxHp) <= liveWxCountessPhaseThreshold()
  );
}

export function advertisedCountessPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    countessHpFraction(opts.hp, opts.maxHp) <=
    advertisedCountessPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Countess phase 2 at the advertised 40% card.
 * Other bosses return null (Fetid Split #1325, Archbishop REFLECT leftover,
 * Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveCrimsonCountessPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isCrimsonCountessPhaseGateBoss(args.bossId)) return null;
  if (!advertisedCountessPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteCountessPhaseGateHp(
  args: CountessPhaseGateArgs,
): boolean {
  if (!isCrimsonCountessPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedCountessPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitCountessPhaseGateHp(
  args: CountessPhaseGateArgs,
): boolean {
  return canExecuteCountessPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 40% ×1.5. Live 0.0 gate never
 * calls this (`liveWxCountessPhaseTransitioned` stays false at 160/400).
 * Does not stamp lava tiles — kit-first Inferno still shadows LAVA_TRAIL
 * (#1323 leftover).
 */
export function executeCountessPhaseGateHp(
  args: CountessPhaseGateArgs,
): CountessPhaseGateExecute | null {
  if (!canExecuteCountessPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    COUNTESS_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxCountessReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesCountessPhaseHpOnceTransitioned(): boolean {
  return true;
}
