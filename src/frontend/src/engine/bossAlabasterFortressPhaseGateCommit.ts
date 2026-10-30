/**
 * Alabaster Fortress advertised Phase 2 never arms at 30% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.3, phase2.statMultiplier
 * 1.2 + BOARD_SHRINK + RESONANCE_SHOCKWAVE; Boss Guide "Phase 2 — HP ≤ 30%";
 * Boss Rush room 8 `boss1Id: "alabaster_fortress"`):
 *   checkPhaseTransition should arm currentPhase 2 at 120/400.
 *   WorldExploration then commits hpAfterBossPhase2(120, 400, 1.2, false)
 *   → 144/480 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Fortress `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.3. At 120/400 (0.3) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 120/400.
 * `decideAlabasterFortressAction` never sees currentPhase 2 from HP, so
 * BOARD_SHRINK is unreachable while alive.
 *
 * Unique leftover of **#1349** (Eternal Pawn King ×1.3 at 50% of 450 →
 * 293/585; that sidecar returns null for alabaster_fortress), **#1347**
 * (Starborn Queen ×1.5 at 50% of 380 → 285/570), **#1345** (Midnight
 * Bishop ×2.0 at 25% of 360 → 180/720), **#1343** (Weeping ×2.0 at 30%
 * of **500** with WX `fullHeal: true` → 1000/1000; same advertised 30%,
 * different HP / full-heal / PROMOTE), **#1342** (Static ×1.5 at 40% of
 * 340 → 204/510), **#1337/#1338** (Cavalier ×1.6 at 50% of 320 →
 * 256/512), **#1336** (Grandmaster ×1.3 at 60% of 300 → 234/390),
 * **#1333** (Broodmother ×1.4 at 50% of 480 → 336/672), **#1332**
 * (Archbishop ×1.4 at 50% of 350 → 245/490), **#1329** (Countess ×1.5
 * at 40% of **400** → 240/600; same HP 400, different 40% / ×1.5 /
 * LAVA_TRAIL), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire).
 * Unique vs kit-first `physical_attack` (first in the phase-1 pool
 * under empty Map). Chessboard Lich MAP_ROTATE / Mirror Sovereign
 * SPELL_MIRROR / Pale Archivist PAGES_OF_DOOM (same ×1.2 of **350** at
 * 40% → 140/420) are sibling leftovers — this resolver returns null
 * for those ids. Do not add `atk` / `ap` / `res` / `chc` / `shrink` /
 * `board` / `shockwave` / `resonance` / `barrier` / `frost` / `iron` /
 * `shield` / `strike` / `chain` / `shock` / `blast` / `haste` /
 * `expose` / `spike` / `jump` / `illusion` / `copies` / `swap` /
 * `teleport` / `split` / `twins` / `lava` / `inferno` / `reflect` /
 * `spawn` / `minion` / `larvae` / `ghost` / `roll` / `promote` /
 * `merge` / `void` / `drain` / `lines` / `slow` / `rally` / `rotate` /
 * `mirror` / `pages`.
 *
 * Export names stay unique vs `#1349` (`resolveEternalPawnKingPhaseGate`,
 * `executeEternalPawnKingPhaseGateHp`), `#1347` (`resolveStarbornQueenPhaseGate`,
 * `executeQueenPhaseGateHp` / `executeStarbornQueenPhaseGateHp`), `#1345`
 * (`resolveMidnightBishopPhaseGate`, `executeBishopPhaseGateHp`), `#1343`
 * (`resolveWeepingPawnPhaseGate`, `executeWeepingPawnPhaseGateHp`), `#1342`
 * (`resolveLordOfStaticPhaseGate`, `executeStaticPhaseGateHp`),
 * `#1337/#1338` (`resolveBoneCavalierPhaseGate`,
 * `executeCavalierPhaseGateHp`), `#1336`
 * (`resolveVoidGrandmasterPhaseGate`, `executeGrandmasterPhaseGateHp`),
 * `#1333` (`resolveBroodmotherRookPhaseGate`,
 * `executeBroodmotherPhaseGateHp`), `#1332`
 * (`resolvePaleArchbishopPhaseGate`, `executeArchbishopPhaseGateHp`),
 * `#1329` (`resolveCrimsonCountessPhaseGate`,
 * `executeCountessPhaseGateHp`), `#1325` (`resolveFetidRookPhaseGate`,
 * `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / bossEternalPawnKingPhaseGateCommit /
 * bossStarbornQueenPhaseGateCommit / bossMidnightBishopPhaseGateCommit /
 * bossWeepingPawnPhaseGateCommit / bossStaticPhaseGateCommit /
 * bossCavalierPhaseGateCommit / bossGrandmasterPhaseGateCommit /
 * bossBroodmotherPhaseGateCommit / bossArchbishopPhaseGateCommit /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveAlabasterFortressPhaseGate`
 * after those PRs land. Do not undo King ×1.3 (#1349), Queen ×1.5
 * (#1347), Bishop ×2.0 (#1345), Weeping ×2.0 fullHeal (#1343), Static
 * ×1.5 (#1342), Cavalier ×1.6 (#1337/#1338), Grandmaster ×1.3 (#1336),
 * Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332), Countess ×1.5 of
 * 400 (#1329), or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const ALABASTER_FORTRESS_PHASE_GATE_BOSS_ID = "alabaster_fortress";

export const ALABASTER_FORTRESS_PHASE_GATE_ABILITY = "BOARD_SHRINK";

/** Adjacent leftover — resonance already lives on phase 1. */
export const ALABASTER_FORTRESS_PHASE_GATE_RESONANCE_LEFTOVER =
  "RESONANCE_SHOCKWAVE";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const ALABASTER_FORTRESS_PHASE_GATE_KIT_FIRST = "physical_attack";

/** Phase-2 kit first-id leftover — still kit-latent under empty Map. */
export const ALABASTER_FORTRESS_PHASE_GATE_KIT_PHASE2 = "spell-iron-skin";

export const ALABASTER_FORTRESS_PHASE_GATE_HP = 400;

/** Catalog / guide `phase1.hpThreshold`. Weeping Pawn is also 0.3 of 500. */
export const ALABASTER_FORTRESS_PHASE_GATE_ADVERTISED_THRESHOLD = 0.3;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const ALABASTER_FORTRESS_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Pale Archivist is also 1.2 of 350 at 40%. */
export const ALABASTER_FORTRESS_PHASE_GATE_STAT_MULT = 1.2;

/** 400 * 0.3 — first HP that advertised phase 2 must arm. */
export const ALABASTER_FORTRESS_PHASE_GATE_HP_AT_GUIDE = 120;

/** hpAfterBossPhase2(120, 400, 1.2, false). */
export const ALABASTER_FORTRESS_PHASE_GATE_HP_AFTER = 144;

export const ALABASTER_FORTRESS_PHASE_GATE_MAX_HP_AFTER = 480;

/** Scaled leftovers (#1343 Weeping true) must not share this commit. */
export const ALABASTER_FORTRESS_PHASE_GATE_FULL_HEAL = false;

export const ALABASTER_FORTRESS_PHASE_GATE_GUIDE_NEEDLE =
  "The playable area shrinks over time. Stay near the center and plan escape routes.";

export const ALABASTER_FORTRESS_PHASE_GATE_LORE_NEEDLE =
  "A colossal pawn of layered white stone slabs, cracked and bleeding dark red between the seams.";

export type AlabasterFortressPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type AlabasterFortressPhaseGateArgs = {
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

export function isAlabasterFortressPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === ALABASTER_FORTRESS_PHASE_GATE_BOSS_ID;
}

export function alabasterFortressHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Alabaster Fortress). */
export function liveWxAlabasterFortressPhaseThreshold(): number {
  return ALABASTER_FORTRESS_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.3). */
export function advertisedAlabasterFortressPhaseThreshold(): number {
  return ALABASTER_FORTRESS_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxAlabasterFortressPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    alabasterFortressHpFraction(opts.hp, opts.maxHp) <=
    liveWxAlabasterFortressPhaseThreshold()
  );
}

export function advertisedAlabasterFortressPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    alabasterFortressHpFraction(opts.hp, opts.maxHp) <=
    advertisedAlabasterFortressPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Alabaster Fortress phase 2 at the advertised
 * 30% card. Other bosses return null (King ×1.3 of 450 #1349, Queen
 * ×1.5 of 380 #1347, Bishop ×2.0 #1345, Weeping fullHeal ×2.0 of 500
 * #1343, Static ×1.5 of 340 #1342, Cavalier ×1.6 of 320 #1337/#1338,
 * Grandmaster ×1.3 of 300 #1336, Broodmother ×1.4 of 480 #1333,
 * Archbishop ×1.4 of 350 #1332, Countess ×1.5 of 400 #1329, Fetid
 * Split #1325, Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveAlabasterFortressPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isAlabasterFortressPhaseGateBoss(args.bossId)) return null;
  if (!advertisedAlabasterFortressPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteAlabasterFortressPhaseGateHp(
  args: AlabasterFortressPhaseGateArgs,
): boolean {
  if (!isAlabasterFortressPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedAlabasterFortressPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitAlabasterFortressPhaseGateHp(
  args: AlabasterFortressPhaseGateArgs,
): boolean {
  return canExecuteAlabasterFortressPhaseGateHp(args);
}

/** Alias kept unique vs `#1345` `executeBishopPhaseGateHp`. */
export function executeFortressPhaseGateHp(
  args: AlabasterFortressPhaseGateArgs,
): AlabasterFortressPhaseGateExecute | null {
  return executeAlabasterFortressPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 30% ×1.2. Live 0.0 gate never
 * calls this (`liveWxAlabasterFortressPhaseTransitioned` stays false at
 * 120/400). Does not stamp BOARD_SHRINK / resonance — kit-first Strike
 * still shadows the decide currentPhase-2 branch, and resonance already
 * lives on phase 1.
 */
export function executeAlabasterFortressPhaseGateHp(
  args: AlabasterFortressPhaseGateArgs,
): AlabasterFortressPhaseGateExecute | null {
  if (!canExecuteAlabasterFortressPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    ALABASTER_FORTRESS_PHASE_GATE_STAT_MULT,
    ALABASTER_FORTRESS_PHASE_GATE_FULL_HEAL,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxAlabasterFortressReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesAlabasterFortressPhaseHpOnceTransitioned(): boolean {
  return true;
}
