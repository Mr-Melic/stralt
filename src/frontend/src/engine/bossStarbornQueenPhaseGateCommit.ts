/**
 * Starborn Queen advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.5 + ATTACK_ALL_LINES + VOID_TILES; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 3):
 *   checkPhaseTransition should arm currentPhase 2 at 190/380.
 *   WorldExploration then commits hpAfterBossPhase2(190, 380, 1.5, false)
 *   → 285/570 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Queen `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 190/380 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 190/380.
 * `decideStarbornQueenAction` never sees currentPhase 2 from HP, so
 * VOID_TILES is unreachable while alive.
 *
 * Unique leftover of **#1345** (Midnight Bishop ×2.0 at 25% of 360 →
 * 180/720; that sidecar returns null for starborn_queen), **#1343**
 * (Weeping ×2.0 at 30% of 500 with WX `fullHeal: true` → 1000/1000),
 * **#1342** (Static ×1.5 at 40% of **340** → 204/510; same advertised
 * ×1.5, different HP and CHAIN_LIGHTNING), **#1337/#1338** (Cavalier
 * ×1.6 at 50% of **320** → 256/512; same advertised 50%, different
 * HP and SPIKE), **#1336** (Grandmaster ×1.3 at 60% of 300 → 234/390),
 * **#1333** (Broodmother ×1.4 at 50% of **480** → 336/672), **#1332**
 * (Archbishop ×1.4 at 50% of **350** → 245/490), **#1329** (Countess
 * ×1.5 at 40% of **400** → 240/600; same advertised ×1.5, different
 * HP and LAVA_TRAIL), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire).
 * Unique vs **#765** VOID occupancy (tests assume the tiles already
 * fired — portal/crumb snap is that leftover, not restored here).
 * Unique vs **#1022** queen-ray `damageToTargets` (ATTACK_ALL_LINES
 * already lives on phase 1). Unique vs kit-first `starter-blast`
 * (first in both Queen pools under empty Map). Eternal Pawn King
 * AP_DRAIN / Alabaster Fortress BOARD_SHRINK / Chessboard Lich
 * MAP_ROTATE / Mirror Sovereign SPELL_MIRROR / Pale Archivist
 * PAGES_OF_DOOM are sibling leftovers — this resolver returns null
 * for those ids. Do not add `atk` / `ap` / `res` / `chc` / `void` /
 * `lines` / `blast` / `frost` / `mark` / `veil` / `chain` / `shock` /
 * `spike` / `jump` / `strike` / `illusion` / `copies` / `swap` /
 * `teleport` / `split` / `twins` / `lava` / `inferno` / `reflect` /
 * `spawn` / `minion` / `larvae` / `ghost` / `roll` / `promote` /
 * `merge` / `drain` / `heal` / `shrink` / `rotate` / `mirror`.
 *
 * Export names stay unique vs `#1345` (`resolveMidnightBishopPhaseGate`,
 * `executeBishopPhaseGateHp`, `BISHOP_PHASE_GATE_*`), `#1343`
 * (`resolveWeepingPawnPhaseGate`, `executeWeepingPawnPhaseGateHp`,
 * `WEEPING_PAWN_PHASE_GATE_*`), `#1342` (`resolveLordOfStaticPhaseGate`,
 * `executeStaticPhaseGateHp`, `STATIC_PHASE_GATE_*`), `#1337/#1338`
 * (`resolveBoneCavalierPhaseGate`, `executeCavalierPhaseGateHp`,
 * `CAVALIER_PHASE_GATE_*`), `#1336` (`resolveVoidGrandmasterPhaseGate`,
 * `executeGrandmasterPhaseGateHp`), `#1333`
 * (`resolveBroodmotherRookPhaseGate`, `executeBroodmotherPhaseGateHp`),
 * `#1332` (`resolvePaleArchbishopPhaseGate`,
 * `executeArchbishopPhaseGateHp`), `#1329`
 * (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / occupancySpikeUnseal / statusEffects / spellEngine /
 * challengeCompletion / castHelpers / bossMidnightBishopPhaseGateCommit /
 * bossWeepingPawnPhaseGateCommit / bossStaticPhaseGateCommit /
 * bossCavalierPhaseGateCommit / bossGrandmasterPhaseGateCommit /
 * bossBroodmotherPhaseGateCommit / bossArchbishopPhaseGateCommit /
 * bossCountessPhaseGateCommit / bossSplitRooksPhaseGateCommit. Restack
 * `checkPhaseTransition` onto `resolveStarbornQueenPhaseGate` after
 * those PRs land. Do not undo Midnight Bishop ×2.0 (#1345), Weeping
 * ×2.0 fullHeal (#1343), Static ×1.5 (#1342), Cavalier ×1.6
 * (#1337/#1338), Grandmaster ×1.3 (#1336), Broodmother ×1.4 (#1333),
 * Archbishop ×1.4 (#1332), Countess ×1.5 (#1329), Fetid Split (#1325),
 * or VOID occupancy (#765).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const STARBORN_QUEEN_PHASE_GATE_BOSS_ID = "starborn_queen";

export const STARBORN_QUEEN_PHASE_GATE_ABILITY = "VOID_TILES";

/** Adjacent leftover — queen-ray already lives on phase 1. */
export const STARBORN_QUEEN_PHASE_GATE_LINES_LEFTOVER = "ATTACK_ALL_LINES";

/** Kit-first leftover — live phase-1 and phase-2 first-id, not restored here. */
export const STARBORN_QUEEN_PHASE_GATE_KIT_FIRST = "starter-blast";

/** Phase-2 kit extra leftover — still kit-latent under empty Map. */
export const STARBORN_QUEEN_PHASE_GATE_KIT_PHASE2 = "spell-frost-nova";

export const STARBORN_QUEEN_PHASE_GATE_HP = 380;

/** Catalog / guide `phase1.hpThreshold`. Cavalier/Archbishop/Broodmother are also 0.5. */
export const STARBORN_QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const STARBORN_QUEEN_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Static/Countess are also 1.5 of other HP. */
export const STARBORN_QUEEN_PHASE_GATE_STAT_MULT = 1.5;

/** 380 * 0.5 — first HP that advertised phase 2 must arm. */
export const STARBORN_QUEEN_PHASE_GATE_HP_AT_GUIDE = 190;

/** hpAfterBossPhase2(190, 380, 1.5, false). */
export const STARBORN_QUEEN_PHASE_GATE_HP_AFTER = 285;

export const STARBORN_QUEEN_PHASE_GATE_MAX_HP_AFTER = 570;

export const STARBORN_QUEEN_PHASE_GATE_GUIDE_NEEDLE =
  "Boss turns tiles into void/gaps. Avoid standing on void tiles and plan movement carefully.";

export const STARBORN_QUEEN_PHASE_GATE_LORE_NEEDLE =
  "A queen whose body is a swirling galaxy, attacking all lines and filling the field with void.";

export type StarbornQueenPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type StarbornQueenPhaseGateArgs = {
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

export function isStarbornQueenPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === STARBORN_QUEEN_PHASE_GATE_BOSS_ID;
}

export function starbornQueenHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Starborn Queen). */
export function liveWxStarbornQueenPhaseThreshold(): number {
  return STARBORN_QUEEN_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedStarbornQueenPhaseThreshold(): number {
  return STARBORN_QUEEN_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxStarbornQueenPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    starbornQueenHpFraction(opts.hp, opts.maxHp) <=
    liveWxStarbornQueenPhaseThreshold()
  );
}

export function advertisedStarbornQueenPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    starbornQueenHpFraction(opts.hp, opts.maxHp) <=
    advertisedStarbornQueenPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Starborn Queen phase 2 at the advertised 50%
 * card. Other bosses return null (Midnight Bishop ×2.0 #1345, Weeping
 * fullHeal ×2.0 #1343, Static ×1.5 of 340 #1342, Cavalier ×1.6 of 320
 * #1337/#1338, Grandmaster ×1.3 #1336, Broodmother ×1.4 of 480 #1333,
 * Archbishop ×1.4 of 350 #1332, Countess ×1.5 of 400 #1329, Fetid Split
 * #1325, Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveStarbornQueenPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isStarbornQueenPhaseGateBoss(args.bossId)) return null;
  if (!advertisedStarbornQueenPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteStarbornQueenPhaseGateHp(
  args: StarbornQueenPhaseGateArgs,
): boolean {
  if (!isStarbornQueenPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedStarbornQueenPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitStarbornQueenPhaseGateHp(
  args: StarbornQueenPhaseGateArgs,
): boolean {
  return canExecuteStarbornQueenPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.5. Live 0.0 gate never
 * calls this (`liveWxStarbornQueenPhaseTransitioned` stays false at
 * 190/380). Does not stamp void tiles / queen-ray — kit-first
 * starter-blast still shadows VOID_TILES, occupancy snap stays #765,
 * and ATTACK_ALL_LINES already lives on phase 1 (#1022 leftover).
 */
export function executeStarbornQueenPhaseGateHp(
  args: StarbornQueenPhaseGateArgs,
): StarbornQueenPhaseGateExecute | null {
  if (!canExecuteStarbornQueenPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    STARBORN_QUEEN_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxStarbornQueenReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesStarbornQueenPhaseHpOnceTransitioned(): boolean {
  return true;
}
