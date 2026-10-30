/**
 * Void Grandmaster advertised Phase 2 never arms at 60% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.6, phase2.statMultiplier
 * 1.3 + ILLUSION_SPLIT + TELEPORT_ADJACENT; Boss Guide "Phase 2 — HP ≤ 60%";
 * Boss Rush room 4):
 *   checkPhaseTransition should arm currentPhase 2 at 180/300.
 *   WorldExploration then commits hpAfterBossPhase2(180, 300, 1.3, false)
 *   → 234/390 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Grandmaster `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.6. At 180/300 (0.6) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 180/300.
 * `decideVoidGrandmasterAction` never sees currentPhase 2 from HP, so
 * ILLUSION_SPLIT is unreachable while alive.
 *
 * Unique leftover of **#1333** (Broodmother ×1.4 at 50% of 480 → 336/672;
 * that sidecar returns null for void_grandmaster), **#1332** (Archbishop
 * ×1.4 at 50% of 350 → 245/490), **#1329** (Countess ×1.5 at 40% of 400
 * → 240/600), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire). Unique
 * vs **#914** ILLUSION_SPLIT occupancy (tests assume the ability already
 * fired — portal/crumb snap is that leftover, not restored here). Unique
 * vs **#850** kit Swap execute (phase-2 first-id `spell-swap` is
 * kit-latent under empty Map). Bone Cavalier SPIKE / Lord of Static
 * CHAIN / Midnight Bishop MERGE / Weeping Pawn PROMOTE are sibling
 * leftovers — this resolver returns null for those ids. Do not add `atk`
 * / `ap` / `res` / `chc` / `illusion` / `copies` / `swap` / `teleport`
 * / `blast` / `split` / `twins` / `lava` / `inferno` / `reflect` /
 * `spawn` / `minion` / `larvae` / `ghost` / `roll`.
 *
 * Export names stay unique vs `#1333` (`resolveBroodmotherRookPhaseGate`,
 * `executeBroodmotherPhaseGateHp`, `BROODMOTHER_PHASE_GATE_*`), `#1332`
 * (`resolvePaleArchbishopPhaseGate`, `executeArchbishopPhaseGateHp`),
 * `#1329` (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit. Restack `checkPhaseTransition` onto
 * `resolveVoidGrandmasterPhaseGate` after those PRs land. Do not undo
 * Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332), Countess ×1.5
 * (#1329), Fetid Split (#1325), or ILLUSION occupancy (#914).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const VOID_GRANDMASTER_PHASE_GATE_BOSS_ID = "void_grandmaster";

export const GRANDMASTER_PHASE_GATE_ABILITY = "ILLUSION_SPLIT";

/** Adjacent leftover — kit-first still shadows teleport after phase 2. */
export const GRANDMASTER_PHASE_GATE_TELEPORT_LEFTOVER = "TELEPORT_ADJACENT";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const GRANDMASTER_PHASE_GATE_KIT_FIRST = "starter-blast";

/** Phase-2 kit first-id leftover — never reached because phase never arms (#850). */
export const GRANDMASTER_PHASE_GATE_KIT_PHASE2 = "spell-swap";

export const GRANDMASTER_PHASE_GATE_HP = 300;

/** Catalog / guide `phase1.hpThreshold`. */
export const GRANDMASTER_PHASE_GATE_ADVERTISED_THRESHOLD = 0.6;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const GRANDMASTER_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Archbishop/Broodmother are 1.4. */
export const GRANDMASTER_PHASE_GATE_STAT_MULT = 1.3;

/** 300 * 0.6 — first HP that advertised phase 2 must arm. */
export const GRANDMASTER_PHASE_GATE_HP_AT_GUIDE = 180;

/** hpAfterBossPhase2(180, 300, 1.3, false). */
export const GRANDMASTER_PHASE_GATE_HP_AFTER = 234;

export const GRANDMASTER_PHASE_GATE_MAX_HP_AFTER = 390;

export const GRANDMASTER_PHASE_GATE_GUIDE_NEEDLE =
  "Boss creates illusions that mirror its attacks. Identify and target the real boss.";

export const GRANDMASTER_PHASE_GATE_LORE_NEEDLE =
  "flickers between dimensions, splitting into illusions to confuse attackers";

export type GrandmasterPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type GrandmasterPhaseGateArgs = {
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

export function isVoidGrandmasterPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === VOID_GRANDMASTER_PHASE_GATE_BOSS_ID;
}

export function grandmasterHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Grandmaster). */
export function liveWxGrandmasterPhaseThreshold(): number {
  return GRANDMASTER_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.6). */
export function advertisedGrandmasterPhaseThreshold(): number {
  return GRANDMASTER_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxGrandmasterPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    grandmasterHpFraction(opts.hp, opts.maxHp) <=
    liveWxGrandmasterPhaseThreshold()
  );
}

export function advertisedGrandmasterPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    grandmasterHpFraction(opts.hp, opts.maxHp) <=
    advertisedGrandmasterPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Grandmaster phase 2 at the advertised 60% card.
 * Other bosses return null (Broodmother ×1.4 #1333, Archbishop ×1.4 #1332,
 * Countess ×1.5 #1329, Fetid Split #1325, Final Pawn HP≤10% GHOST leftover
 * of #1247).
 */
export function resolveVoidGrandmasterPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isVoidGrandmasterPhaseGateBoss(args.bossId)) return null;
  if (!advertisedGrandmasterPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteGrandmasterPhaseGateHp(
  args: GrandmasterPhaseGateArgs,
): boolean {
  if (!isVoidGrandmasterPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedGrandmasterPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitGrandmasterPhaseGateHp(
  args: GrandmasterPhaseGateArgs,
): boolean {
  return canExecuteGrandmasterPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 60% ×1.3. Live 0.0 gate never
 * calls this (`liveWxGrandmasterPhaseTransitioned` stays false at 180/300).
 * Does not stamp illusions / swap — kit-first starter-blast still shadows
 * ILLUSION_SPLIT, and phase-2 first-id Swap never arms (#850 leftover).
 */
export function executeGrandmasterPhaseGateHp(
  args: GrandmasterPhaseGateArgs,
): GrandmasterPhaseGateExecute | null {
  if (!canExecuteGrandmasterPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    GRANDMASTER_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxGrandmasterReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesGrandmasterPhaseHpOnceTransitioned(): boolean {
  return true;
}
