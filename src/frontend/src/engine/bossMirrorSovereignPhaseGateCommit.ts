/**
 * Mirror Sovereign advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.5 + COMBO_REPLAY + SPELL_MIRROR; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 4 `boss2Id: "mirror_sovereign"`):
 *   checkPhaseTransition should arm currentPhase 2 at 125/250.
 *   WorldExploration then commits hpAfterBossPhase2(125, 250, 1.5, false)
 *   → 188/375 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Sovereign `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 125/250 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 125/250.
 * `decideMirrorSovereignAction` never sees currentPhase 2 from HP, so
 * COMBO_REPLAY is unreachable while alive.
 *
 * Unique leftover of **#1353** (Chessboard Lich ×1.3 at 50% of 200 →
 * 130/260; that sidecar returns null for mirror_sovereign), **#1352**
 * (Alabaster Fortress ×1.2 at 30% of 400 → 144/480), **#1349** (Eternal
 * Pawn King ×1.3 at 50% of 450 → 293/585), **#1347** (Starborn Queen
 * ×1.5 at 50% of **380** → 285/570; same advertised 50%/×1.5, different
 * HP and VOID), **#1345** (Midnight Bishop ×2.0 at 25% of 360 →
 * 180/720), **#1343** (Weeping ×2.0 at 30% of 500 with WX
 * `fullHeal: true` → 1000/1000), **#1342** (Static ×1.5 at 40% of **340**
 * → 204/510; same advertised ×1.5, different HP and CHAIN), **#1337/#1338**
 * (Cavalier ×1.6 at 50% of 320 → 256/512), **#1336** (Grandmaster ×1.3
 * at 60% of 300 → 234/390), **#1333** (Broodmother ×1.4 at 50% of 480 →
 * 336/672), **#1332** (Archbishop ×1.4 at 50% of 350 → 245/490),
 * **#1329** (Countess ×1.5 at 40% of **400** → 240/600; same advertised
 * ×1.5, different HP and LAVA), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire). Unique
 * vs kit-first `starter-blast` (first in the phase-1 pool under empty
 * Map; Queen #1347 is the same first-id on 380 HP). SPELL_MIRROR already
 * lives on phase 1. Pale Archivist PAGES_OF_DOOM (40% ×1.2 of 350 →
 * 168/420) / Twin Monarchs MONARCH_ABSORB / Enthroned Void AP_DRAIN_PASSIVE
 * are sibling leftovers — this resolver returns null for those ids. Do
 * not add `atk` / `ap` / `res` / `chc` / `combo` / `replay` / `mirror` /
 * `blast` / `mark` / `veil` / `swap` / `void` / `lines` / `frost` /
 * `chain` / `shock` / `spike` / `jump` / `illusion` / `copies` /
 * `teleport` / `split` / `twins` / `lava` / `inferno` / `reflect` /
 * `spawn` / `minion` / `larvae` / `ghost` / `roll` / `promote` /
 * `merge` / `drain` / `advance` / `slow` / `iron` / `heal` / `shrink` /
 * `board` / `rotate` / `invert` / `claim` / `pages` / `rally`.
 *
 * Export names stay unique vs `#1353` (`resolveChessboardLichPhaseGate`,
 * `executeChessboardLichPhaseGateHp` / `executeLichPhaseGateHp`), `#1352`
 * (`resolveAlabasterFortressPhaseGate`, `executeAlabasterFortressPhaseGateHp`
 * / `executeFortressPhaseGateHp`), `#1349` (`resolveEternalPawnKingPhaseGate`,
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
 * castHelpers / bossChessboardLichPhaseGateCommit /
 * bossAlabasterFortressPhaseGateCommit / bossEternalPawnKingPhaseGateCommit /
 * bossStarbornQueenPhaseGateCommit / bossMidnightBishopPhaseGateCommit /
 * bossWeepingPawnPhaseGateCommit / bossStaticPhaseGateCommit /
 * bossCavalierPhaseGateCommit / bossGrandmasterPhaseGateCommit /
 * bossBroodmotherPhaseGateCommit / bossArchbishopPhaseGateCommit /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveMirrorSovereignPhaseGate`
 * after those PRs land. Do not undo Lich ×1.3 of 200 (#1353), Fortress
 * ×1.2 (#1352), King ×1.3 of 450 (#1349), Queen ×1.5 of 380 (#1347),
 * Bishop ×2.0 (#1345), Weeping ×2.0 fullHeal (#1343), Static ×1.5 of 340
 * (#1342), Cavalier ×1.6 (#1337/#1338), Grandmaster ×1.3 of 300 (#1336),
 * Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332), Countess ×1.5 of
 * 400 (#1329), or Fetid Split (#1325).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const MIRROR_SOVEREIGN_PHASE_GATE_BOSS_ID = "mirror_sovereign";

export const MIRROR_SOVEREIGN_PHASE_GATE_ABILITY = "COMBO_REPLAY";

/** Adjacent leftover — SPELL_MIRROR already lives on phase 1. */
export const MIRROR_SOVEREIGN_PHASE_GATE_MIRROR_LEFTOVER = "SPELL_MIRROR";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const MIRROR_SOVEREIGN_PHASE_GATE_KIT_FIRST = "starter-blast";

/** Phase-2 kit first-id leftover — still kit-latent under empty Map. */
export const MIRROR_SOVEREIGN_PHASE_GATE_KIT_PHASE2 = "spell-mirror";

export const MIRROR_SOVEREIGN_PHASE_GATE_HP = 250;

/** Catalog / guide `phase1.hpThreshold`. Queen/King/Lich/Cavalier are also 0.5. */
export const MIRROR_SOVEREIGN_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const MIRROR_SOVEREIGN_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Queen is also 1.5 of 380; Static 1.5 of 340. */
export const MIRROR_SOVEREIGN_PHASE_GATE_STAT_MULT = 1.5;

/** 250 * 0.5 — first HP that advertised phase 2 must arm. */
export const MIRROR_SOVEREIGN_PHASE_GATE_HP_AT_GUIDE = 125;

/** hpAfterBossPhase2(125, 250, 1.5, false). Queen #1347 is 285/570. */
export const MIRROR_SOVEREIGN_PHASE_GATE_HP_AFTER = 188;

export const MIRROR_SOVEREIGN_PHASE_GATE_MAX_HP_AFTER = 375;

/** Scaled leftovers (#1343 Weeping true) must not share this commit. */
export const MIRROR_SOVEREIGN_PHASE_GATE_FULL_HEAL = false;

export const MIRROR_SOVEREIGN_PHASE_GATE_GUIDE_NEEDLE =
  "Boss replays your last combo against you. Vary your attack pattern to avoid predictable counters.";

export const MIRROR_SOVEREIGN_PHASE_GATE_LORE_NEEDLE =
  "A queen of black mirror glass that reflects a distorted version of you — and turns your own spells against you.";

export type MirrorSovereignPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type MirrorSovereignPhaseGateArgs = {
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

export function isMirrorSovereignPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === MIRROR_SOVEREIGN_PHASE_GATE_BOSS_ID;
}

export function mirrorSovereignHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Mirror Sovereign). */
export function liveWxMirrorSovereignPhaseThreshold(): number {
  return MIRROR_SOVEREIGN_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedMirrorSovereignPhaseThreshold(): number {
  return MIRROR_SOVEREIGN_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxMirrorSovereignPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    mirrorSovereignHpFraction(opts.hp, opts.maxHp) <=
    liveWxMirrorSovereignPhaseThreshold()
  );
}

export function advertisedMirrorSovereignPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    mirrorSovereignHpFraction(opts.hp, opts.maxHp) <=
    advertisedMirrorSovereignPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Mirror Sovereign phase 2 at the advertised 50%
 * card. Other bosses return null (Lich ×1.3 of 200 #1353, Fortress ×1.2
 * of 400 #1352, King ×1.3 of 450 #1349, Queen ×1.5 of 380 #1347, Bishop
 * ×2.0 #1345, Weeping fullHeal ×2.0 of 500 #1343, Static ×1.5 of 340
 * #1342, Cavalier ×1.6 of 320 #1337/#1338, Grandmaster ×1.3 of 300
 * #1336, Broodmother ×1.4 of 480 #1333, Archbishop ×1.4 of 350 #1332,
 * Countess ×1.5 of 400 #1329, Fetid Split #1325, Final Pawn HP≤10%
 * GHOST leftover of #1247).
 */
export function resolveMirrorSovereignPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isMirrorSovereignPhaseGateBoss(args.bossId)) return null;
  if (!advertisedMirrorSovereignPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteMirrorSovereignPhaseGateHp(
  args: MirrorSovereignPhaseGateArgs,
): boolean {
  if (!isMirrorSovereignPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedMirrorSovereignPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitMirrorSovereignPhaseGateHp(
  args: MirrorSovereignPhaseGateArgs,
): boolean {
  return canExecuteMirrorSovereignPhaseGateHp(args);
}

/** Alias kept unique vs `#1347` `executeQueenPhaseGateHp`. */
export function executeSovereignPhaseGateHp(
  args: MirrorSovereignPhaseGateArgs,
): MirrorSovereignPhaseGateExecute | null {
  return executeMirrorSovereignPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.5. Live 0.0 gate never
 * calls this (`liveWxMirrorSovereignPhaseTransitioned` stays false at
 * 125/250). Does not stamp combo / mirror — kit-first starter-blast
 * still shadows the decide currentPhase-2 branch, and SPELL_MIRROR
 * already lives on phase 1.
 */
export function executeMirrorSovereignPhaseGateHp(
  args: MirrorSovereignPhaseGateArgs,
): MirrorSovereignPhaseGateExecute | null {
  if (!canExecuteMirrorSovereignPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    MIRROR_SOVEREIGN_PHASE_GATE_STAT_MULT,
    MIRROR_SOVEREIGN_PHASE_GATE_FULL_HEAL,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxMirrorSovereignReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesMirrorSovereignPhaseHpOnceTransitioned(): boolean {
  return true;
}
