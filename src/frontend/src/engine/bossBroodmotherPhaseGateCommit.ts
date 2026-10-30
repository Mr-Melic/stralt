/**
 * Broodmother Rook advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.4 + LARVAE_SPAWN / SHELL_ARMOR / LARVAE_EXPLODE; Boss Guide
 * "Phase 2 — HP ≤ 50%"; Boss Rush room 8):
 *   checkPhaseTransition should arm currentPhase 2 at 240/480.
 *   WorldExploration then commits hpAfterBossPhase2(240, 480, 1.4, false)
 *   → 336/672 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Broodmother `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 240/480 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 240/480.
 * `decideBroodmotherRookAction` never sees currentPhase 2 from HP, so
 * the extra even-turn LARVAE_SPAWN branch is unreachable while alive.
 *
 * Unique leftover of **#1332** (Archbishop ×1.4 at 50% of 350 → 245/490;
 * that sidecar returns null for broodmother_rook), **#1329** (Countess
 * ×1.5 at 40% of 400 → 240/600), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire). Unique
 * vs **#1288** kit-first Archer vs LARVAE_SPAWN (tests pass currentPhase:
 * 2 — even-turn extra spawn occupancy is that leftover, not restored
 * here). Unique vs **#1217** explode-on-contact venom once a marker
 * exists, **#1269** kit Archer cap, first-spawn `shellArmorActive` flag,
 * unread `newLarvae` combatants, kit Iron Skin RES ×1.3. Lord of Static
 * CHAIN / Midnight Bishop MERGE / Void Grandmaster ILLUSION / Bone
 * Cavalier SPIKE are sibling leftovers — this resolver returns null for
 * those ids. Do not add `atk` / `ap` / `res` / `chc` / `larvae` /
 * `shell` / `explode` / `archer` / `iron` / `venom` / `decide` /
 * `split` / `twins` / `lava` / `inferno` / `reflect` / `spawn` /
 * `minion` / `ghost` / `roll`.
 *
 * Export names stay unique vs `#1332` (`resolvePaleArchbishopPhaseGate`,
 * `executeArchbishopPhaseGateHp`, `ARCHBISHOP_PHASE_GATE_*`), `#1329`
 * (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`),
 * `#1288` (`resolveBroodmotherLarvaeDecide`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / occupancyLarvaUnseal / statusEffects / spellEngine /
 * challengeCompletion / castHelpers / bossArchbishopPhaseGateCommit /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit /
 * bossLarvaeSpawnDecideCommit / bossLarvaeExplodeWalkExecute /
 * bossKitSummonCap / bossLarvaeShellArmorCommit. Restack
 * `checkPhaseTransition` onto `resolveBroodmotherRookPhaseGate` after
 * those PRs land. Do not undo kit-first Archer (#1288), Archbishop ×1.4
 * (#1332), Countess ×1.5 (#1329), or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const BROODMOTHER_ROOK_PHASE_GATE_BOSS_ID = "broodmother_rook";

export const BROODMOTHER_PHASE_GATE_ABILITY = "LARVAE_SPAWN";

/** Adjacent leftover — kit-first still shadows explode (#1217). */
export const BROODMOTHER_PHASE_GATE_EXPLODE_LEFTOVER = "LARVAE_EXPLODE";

/** Kit-first leftover — phase-1 and phase-2 first-id, not restored here (#1288). */
export const BROODMOTHER_PHASE_GATE_KIT_FIRST = "summon-archer";

/** Kit Iron Skin RES ×1.3 leftover — phase-2 extra id, not restored here. */
export const BROODMOTHER_PHASE_GATE_IRON_LEFTOVER = "spell-iron-skin";

export const BROODMOTHER_PHASE_GATE_HP = 480;

/** Catalog / guide `phase1.hpThreshold`. */
export const BROODMOTHER_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const BROODMOTHER_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Archbishop's is also 1.4 of 350. */
export const BROODMOTHER_PHASE_GATE_STAT_MULT = 1.4;

/** 480 * 0.5 — first HP that advertised phase 2 must arm. */
export const BROODMOTHER_PHASE_GATE_HP_AT_GUIDE = 240;

/** hpAfterBossPhase2(240, 480, 1.4, false). */
export const BROODMOTHER_PHASE_GATE_HP_AFTER = 336;

export const BROODMOTHER_PHASE_GATE_MAX_HP_AFTER = 672;

export const BROODMOTHER_PHASE_GATE_GUIDE_NEEDLE =
  "Boss spawns larvae that explode on contact. Kill larvae at range before they reach you.";

export const BROODMOTHER_PHASE_GATE_LORE_NEEDLE =
  "shell armor activates while they live, and they explode on contact";

export type BroodmotherPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type BroodmotherPhaseGateArgs = {
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

export function isBroodmotherRookPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === BROODMOTHER_ROOK_PHASE_GATE_BOSS_ID;
}

export function broodmotherHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Broodmother). */
export function liveWxBroodmotherPhaseThreshold(): number {
  return BROODMOTHER_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedBroodmotherPhaseThreshold(): number {
  return BROODMOTHER_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxBroodmotherPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    broodmotherHpFraction(opts.hp, opts.maxHp) <=
    liveWxBroodmotherPhaseThreshold()
  );
}

export function advertisedBroodmotherPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    broodmotherHpFraction(opts.hp, opts.maxHp) <=
    advertisedBroodmotherPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Broodmother phase 2 at the advertised 50% card.
 * Other bosses return null (Archbishop ×1.4 #1332, Countess ×1.5 #1329,
 * Fetid Split #1325, Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveBroodmotherRookPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isBroodmotherRookPhaseGateBoss(args.bossId)) return null;
  if (!advertisedBroodmotherPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteBroodmotherPhaseGateHp(
  args: BroodmotherPhaseGateArgs,
): boolean {
  if (!isBroodmotherRookPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedBroodmotherPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitBroodmotherPhaseGateHp(
  args: BroodmotherPhaseGateArgs,
): boolean {
  return canExecuteBroodmotherPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.4. Live 0.0 gate never
 * calls this (`liveWxBroodmotherPhaseTransitioned` stays false at 240/480).
 * Does not stamp larvae / shell / explode — kit-first Archer still shadows
 * LARVAE_SPAWN (#1288 leftover).
 */
export function executeBroodmotherPhaseGateHp(
  args: BroodmotherPhaseGateArgs,
): BroodmotherPhaseGateExecute | null {
  if (!canExecuteBroodmotherPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    BROODMOTHER_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxBroodmotherReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesBroodmotherPhaseHpOnceTransitioned(): boolean {
  return true;
}
