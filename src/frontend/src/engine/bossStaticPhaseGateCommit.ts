/**
 * Lord of Static advertised Phase 2 never arms at 40% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.4, phase2.statMultiplier
 * 1.5 + SHOCK_TILES + CHAIN_LIGHTNING; Boss Guide "Phase 2 — HP ≤ 40%";
 * Boss Rush room 2):
 *   checkPhaseTransition should arm currentPhase 2 at 136/340.
 *   WorldExploration then commits hpAfterBossPhase2(136, 340, 1.5, false)
 *   → 204/510 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Static `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.4. At 136/340 (0.4) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 136/340.
 * `decideLordOfStaticAction` never sees currentPhase 2 from HP, so
 * CHAIN_LIGHTNING is unreachable while alive.
 *
 * Unique leftover of **#1337/#1338** (Cavalier ×1.6 at 50% of 320 →
 * 256/512; those sidecars return null for lord_of_static), **#1336**
 * (Grandmaster ×1.3 at 60% of 300 → 234/390), **#1333** (Broodmother
 * ×1.4 at 50% of 480 → 336/672), **#1332** (Archbishop ×1.4 at 50% of
 * 350 → 245/490), **#1329** (Countess ×1.5 at 40% of **400** → 240/600;
 * same advertised 40%/×1.5, different HP and LAVA_TRAIL), and **#1325**
 * (Fetid Split twins; Fetid `phase2.statMultiplier` is 1.0 so that
 * sidecar has no HP fire). Unique vs kit-first starter-blast (first in
 * both Static pools under empty Map). Weeping Pawn PROMOTE / Midnight
 * Bishop MERGE / Starborn Queen VOID are sibling leftovers — this
 * resolver returns null for those ids. Do not add `atk` / `ap` / `res`
 * / `chc` / `chain` / `shock` / `blast` / `haste` / `frost` / `expose`
 * / `spike` / `jump` / `strike` / `illusion` / `copies` / `swap` /
 * `teleport` / `split` / `twins` / `lava` / `inferno` / `reflect` /
 * `spawn` / `minion` / `larvae` / `ghost` / `roll` / `promote` /
 * `merge` / `void` / `drain`.
 *
 * Export names stay unique vs `#1337/#1338` (`resolveBoneCavalierPhaseGate`,
 * `executeCavalierPhaseGateHp`, `CAVALIER_PHASE_GATE_*`), `#1336`
 * (`resolveVoidGrandmasterPhaseGate`, `executeGrandmasterPhaseGateHp`),
 * `#1333` (`resolveBroodmotherRookPhaseGate`, `executeBroodmotherPhaseGateHp`),
 * `#1332` (`resolvePaleArchbishopPhaseGate`, `executeArchbishopPhaseGateHp`),
 * `#1329` (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / bossCavalierPhaseGateCommit /
 * bossGrandmasterPhaseGateCommit / bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveLordOfStaticPhaseGate`
 * after those PRs land. Do not undo Cavalier ×1.6 (#1337/#1338),
 * Grandmaster ×1.3 (#1336), Broodmother ×1.4 (#1333), Archbishop ×1.4
 * (#1332), Countess ×1.5 (#1329), or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const LORD_OF_STATIC_PHASE_GATE_BOSS_ID = "lord_of_static";

export const STATIC_PHASE_GATE_ABILITY = "CHAIN_LIGHTNING";

/** Adjacent leftover — shock tiles already plant in phase 1; not restored. */
export const STATIC_PHASE_GATE_SHOCK_LEFTOVER = "SHOCK_TILES";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const STATIC_PHASE_GATE_KIT_FIRST = "starter-blast";

/** Phase-2 kit extra leftover — still kit-latent under empty Map. */
export const STATIC_PHASE_GATE_KIT_PHASE2 = "spell-frost-nova";

export const STATIC_PHASE_GATE_HP = 340;

/** Catalog / guide `phase1.hpThreshold`. Countess is also 0.4 of 400. */
export const STATIC_PHASE_GATE_ADVERTISED_THRESHOLD = 0.4;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const STATIC_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Countess is also 1.5 of 400 HP. */
export const STATIC_PHASE_GATE_STAT_MULT = 1.5;

/** 340 * 0.4 — first HP that advertised phase 2 must arm. */
export const STATIC_PHASE_GATE_HP_AT_GUIDE = 136;

/** hpAfterBossPhase2(136, 340, 1.5, false). */
export const STATIC_PHASE_GATE_HP_AFTER = 204;

export const STATIC_PHASE_GATE_MAX_HP_AFTER = 510;

export const STATIC_PHASE_GATE_GUIDE_NEEDLE =
  "Electrified tiles chain lightning across the board. Clear shock tiles or stay far from clusters.";

export const STATIC_PHASE_GATE_LORE_NEEDLE =
  "leaving shock tiles on every move that chain into lightning in phase 2";

export type StaticPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type StaticPhaseGateArgs = {
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

export function isLordOfStaticPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === LORD_OF_STATIC_PHASE_GATE_BOSS_ID;
}

export function staticHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Static). */
export function liveWxStaticPhaseThreshold(): number {
  return STATIC_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.4). */
export function advertisedStaticPhaseThreshold(): number {
  return STATIC_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxStaticPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return staticHpFraction(opts.hp, opts.maxHp) <= liveWxStaticPhaseThreshold();
}

export function advertisedStaticPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    staticHpFraction(opts.hp, opts.maxHp) <= advertisedStaticPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Static phase 2 at the advertised 40% card.
 * Other bosses return null (Cavalier ×1.6 #1337/#1338, Grandmaster ×1.3
 * #1336, Broodmother ×1.4 #1333, Archbishop ×1.4 #1332, Countess ×1.5 of
 * 400 #1329, Fetid Split #1325, Final Pawn HP≤10% GHOST leftover of
 * #1247).
 */
export function resolveLordOfStaticPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isLordOfStaticPhaseGateBoss(args.bossId)) return null;
  if (!advertisedStaticPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteStaticPhaseGateHp(
  args: StaticPhaseGateArgs,
): boolean {
  if (!isLordOfStaticPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedStaticPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitStaticPhaseGateHp(
  args: StaticPhaseGateArgs,
): boolean {
  return canExecuteStaticPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 40% ×1.5. Live 0.0 gate never
 * calls this (`liveWxStaticPhaseTransitioned` stays false at 136/340).
 * Does not stamp chain / shock — kit-first starter-blast still shadows
 * CHAIN_LIGHTNING, and shock tiles already plant in phase 1.
 */
export function executeStaticPhaseGateHp(
  args: StaticPhaseGateArgs,
): StaticPhaseGateExecute | null {
  if (!canExecuteStaticPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    STATIC_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxStaticReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesStaticPhaseHpOnceTransitioned(): boolean {
  return true;
}
