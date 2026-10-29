/**
 * Pale Archbishop advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.4 + REFLECT_SHIELD + SPAWN_MINIONS; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 0):
 *   checkPhaseTransition should arm currentPhase 2 at 175/350.
 *   WorldExploration then commits hpAfterBossPhase2(175, 350, 1.4, false)
 *   → 245/490 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Archbishop `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 175/350 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 175/350.
 * `decidePaleArchbishopAction` never sees currentPhase 2 from HP.
 *
 * Unique leftover of **#1329** (Countess ×1.5 at 40%; that sidecar
 * returns null for pale_archbishop) and **#1325** (Fetid Split twins;
 * Fetid `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire).
 * Unique vs **#1331** skeleton RES 2 (assumes a minion already spawned),
 * **#1278** skeleton atk 8, **#1102** kit-first Cursed Wound vs
 * SPAWN_MINIONS (tests pass currentPhase: 2 — REFLECT/SPAWN occupancy
 * is that leftover, not restored here). Void Grandmaster ILLUSION_SPLIT
 * / Bone Cavalier SPIKE / Broodmother 0.0 are sibling leftovers — this
 * resolver returns null for those ids. Do not add `atk` / `ap` / `res` /
 * `chc` / `reflect` / `spawn` / `minion` / `lava` / `inferno` / `split` /
 * `twins` / `venom` / `ghost` / `roll`.
 *
 * Export names stay unique vs `#1329` (`resolveCrimsonCountessPhaseGate`,
 * `executeCountessPhaseGateHp`, `COUNTESS_PHASE_GATE_*`), `#1325`
 * (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`),
 * `#1331` (`resolveSpawnMinionsCommittedRes`, `executeSpawnMinionsResSoak`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit /
 * bossSpawnMinionsResCommit. Restack `checkPhaseTransition` onto
 * `resolvePaleArchbishopPhaseGate` after those PRs land. Do not undo
 * kit-first Cursed Wound (#1102), Countess ×1.5 (#1329), Fetid Split
 * (#1325), or skeleton RES (#1331).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const PALE_ARCHBISHOP_PHASE_GATE_BOSS_ID = "pale_archbishop";

export const ARCHBISHOP_PHASE_GATE_ABILITY = "REFLECT_SHIELD";

/** Adjacent leftover — kit-first still shadows spawn (#1102 / #1331). */
export const ARCHBISHOP_PHASE_GATE_SPAWN_LEFTOVER = "SPAWN_MINIONS";

/** Kit-first leftover — phase-1 and phase-2 first-id, not restored here (#1102). */
export const ARCHBISHOP_PHASE_GATE_KIT_FIRST = "spell-cursed-wound";

export const ARCHBISHOP_PHASE_GATE_HP = 350;

/** Catalog / guide `phase1.hpThreshold`. */
export const ARCHBISHOP_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const ARCHBISHOP_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Countess's is 1.5 — unique vs #1329. */
export const ARCHBISHOP_PHASE_GATE_STAT_MULT = 1.4;

/** 350 * 0.5 — first HP that advertised phase 2 must arm. */
export const ARCHBISHOP_PHASE_GATE_HP_AT_GUIDE = 175;

/** hpAfterBossPhase2(175, 350, 1.4, false). */
export const ARCHBISHOP_PHASE_GATE_HP_AFTER = 245;

export const ARCHBISHOP_PHASE_GATE_MAX_HP_AFTER = 490;

export const ARCHBISHOP_PHASE_GATE_GUIDE_NEEDLE =
  "Boss reflects a portion of incoming damage back to the attacker";

export const ARCHBISHOP_PHASE_GATE_LORE_NEEDLE =
  "whose very gaze curses all who oppose him";

export type ArchbishopPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type ArchbishopPhaseGateArgs = {
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

export function isPaleArchbishopPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === PALE_ARCHBISHOP_PHASE_GATE_BOSS_ID;
}

export function archbishopHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Archbishop). */
export function liveWxArchbishopPhaseThreshold(): number {
  return ARCHBISHOP_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedArchbishopPhaseThreshold(): number {
  return ARCHBISHOP_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxArchbishopPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    archbishopHpFraction(opts.hp, opts.maxHp) <=
    liveWxArchbishopPhaseThreshold()
  );
}

export function advertisedArchbishopPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    archbishopHpFraction(opts.hp, opts.maxHp) <=
    advertisedArchbishopPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Archbishop phase 2 at the advertised 50% card.
 * Other bosses return null (Countess ×1.5 #1329, Fetid Split #1325,
 * Grandmaster ILLUSION leftover, Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolvePaleArchbishopPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isPaleArchbishopPhaseGateBoss(args.bossId)) return null;
  if (!advertisedArchbishopPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteArchbishopPhaseGateHp(
  args: ArchbishopPhaseGateArgs,
): boolean {
  if (!isPaleArchbishopPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedArchbishopPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitArchbishopPhaseGateHp(
  args: ArchbishopPhaseGateArgs,
): boolean {
  return canExecuteArchbishopPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.4. Live 0.0 gate never
 * calls this (`liveWxArchbishopPhaseTransitioned` stays false at 175/350).
 * Does not stamp reflect / minions — kit-first Cursed Wound still shadows
 * REFLECT_SHIELD and SPAWN_MINIONS (#1102 leftover).
 */
export function executeArchbishopPhaseGateHp(
  args: ArchbishopPhaseGateArgs,
): ArchbishopPhaseGateExecute | null {
  if (!canExecuteArchbishopPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    ARCHBISHOP_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxArchbishopReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesArchbishopPhaseHpOnceTransitioned(): boolean {
  return true;
}
