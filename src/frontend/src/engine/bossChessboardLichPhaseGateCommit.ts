/**
 * Chessboard Lich advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.3 + MIRROR_INVERT + BOARD_CLAIM; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 5 `boss1Id: "chessboard_lich"`):
 *   checkPhaseTransition should arm currentPhase 2 at 100/200.
 *   WorldExploration then commits hpAfterBossPhase2(100, 200, 1.3, false)
 *   → 130/260 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Lich `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 100/200 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 100/200.
 * `decideChessboardLichAction` never sees currentPhase 2 from HP, so
 * MIRROR_INVERT / BOARD_CLAIM are unreachable while alive.
 *
 * Unique leftover of **#1352** (Alabaster Fortress ×1.2 at 30% of 400 →
 * 144/480; that sidecar returns null for chessboard_lich), **#1349**
 * (Eternal Pawn King ×1.3 at 50% of **450** → 293/585; same advertised
 * 50%/×1.3, different HP and AP_DRAIN; PR title still says Queen, files
 * switched), **#1347** (Starborn Queen ×1.5 at 50% of 380 → 285/570),
 * **#1345** (Midnight Bishop ×2.0 at 25% of 360 → 180/720), **#1343**
 * (Weeping ×2.0 at 30% of 500 with WX `fullHeal: true` → 1000/1000),
 * **#1342** (Static ×1.5 at 40% of 340 → 204/510), **#1337/#1338**
 * (Cavalier ×1.6 at 50% of 320 → 256/512), **#1336** (Grandmaster ×1.3
 * at 60% of **300** → 234/390; same advertised ×1.3, different HP and
 * 60%), **#1333** (Broodmother ×1.4 at 50% of 480 → 336/672), **#1332**
 * (Archbishop ×1.4 at 50% of 350 → 245/490), **#1329** (Countess ×1.5
 * at 40% of 400 → 240/600), and **#1325** (Fetid Split twins; Fetid
 * `phase2.statMultiplier` is 1.0 so that sidecar has no HP fire). Unique
 * vs kit-first `spell-cursed-wound` (first in both Lich pools under
 * empty Map). Unique vs **#1161** MAP_ROTATE/MIRROR_INVERT crumbs
 * (assumes the invert already ran). MAP_ROTATE already lives on phase 1.
 * Mirror Sovereign SPELL_MIRROR / Pale Archivist PAGES_OF_DOOM are
 * sibling leftovers — this resolver returns null for those ids. Do not
 * add `atk` / `ap` / `res` / `chc` / `invert` / `claim` / `rotate` /
 * `swap` / `mark` / `veil` / `wound` / `wisp` / `drain` / `advance` /
 * `slow` / `iron` / `void` / `lines` / `blast` / `frost` / `chain` /
 * `shock` / `spike` / `jump` / `illusion` / `copies` / `teleport` /
 * `split` / `twins` / `lava` / `inferno` / `reflect` / `spawn` /
 * `minion` / `larvae` / `ghost` / `roll` / `promote` / `merge` /
 * `heal` / `shrink` / `board` / `pages` / `mirror` / `rally`.
 *
 * Export names stay unique vs `#1352` (`resolveAlabasterFortressPhaseGate`,
 * `executeAlabasterFortressPhaseGateHp` / `executeFortressPhaseGateHp`),
 * `#1349` (`resolveEternalPawnKingPhaseGate`,
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
 * castHelpers / bossAlabasterFortressPhaseGateCommit /
 * bossEternalPawnKingPhaseGateCommit / bossStarbornQueenPhaseGateCommit /
 * bossMidnightBishopPhaseGateCommit / bossWeepingPawnPhaseGateCommit /
 * bossStaticPhaseGateCommit / bossCavalierPhaseGateCommit /
 * bossGrandmasterPhaseGateCommit / bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit. Restack `checkPhaseTransition` onto
 * `resolveChessboardLichPhaseGate` after those PRs land. Do not undo
 * Fortress ×1.2 (#1352), King ×1.3 of 450 (#1349), Queen ×1.5 (#1347),
 * Bishop ×2.0 (#1345), Weeping ×2.0 fullHeal (#1343), Static ×1.5
 * (#1342), Cavalier ×1.6 (#1337/#1338), Grandmaster ×1.3 of 300
 * (#1336), Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332), Countess
 * ×1.5 (#1329), Fetid Split (#1325), or MAP_ROTATE crumbs (#1161).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const CHESSBOARD_LICH_PHASE_GATE_BOSS_ID = "chessboard_lich";

export const CHESSBOARD_LICH_PHASE_GATE_ABILITY = "MIRROR_INVERT";

/** Adjacent leftover — rotate already lives on phase 1. */
export const CHESSBOARD_LICH_PHASE_GATE_ROTATE_LEFTOVER = "MAP_ROTATE";

/** Phase-2 sibling leftover — BOARD_CLAIM also needs currentPhase 2. */
export const CHESSBOARD_LICH_PHASE_GATE_CLAIM_LEFTOVER = "BOARD_CLAIM";

/** Kit-first leftover — live phase-1 and phase-2 first-id, not restored here. */
export const CHESSBOARD_LICH_PHASE_GATE_KIT_FIRST = "spell-cursed-wound";

/** Phase-2 kit extra leftover — still kit-latent under empty Map. */
export const CHESSBOARD_LICH_PHASE_GATE_KIT_PHASE2 = "summon-wisp";

export const CHESSBOARD_LICH_PHASE_GATE_HP = 200;

/** Catalog / guide `phase1.hpThreshold`. King/Queen/Cavalier/Archbishop are also 0.5. */
export const CHESSBOARD_LICH_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const CHESSBOARD_LICH_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. King is also 1.3 of 450; Grandmaster 1.3 of 300. */
export const CHESSBOARD_LICH_PHASE_GATE_STAT_MULT = 1.3;

/** 200 * 0.5 — first HP that advertised phase 2 must arm. */
export const CHESSBOARD_LICH_PHASE_GATE_HP_AT_GUIDE = 100;

/** hpAfterBossPhase2(100, 200, 1.3, false). */
export const CHESSBOARD_LICH_PHASE_GATE_HP_AFTER = 130;

export const CHESSBOARD_LICH_PHASE_GATE_MAX_HP_AFTER = 260;

/** Scaled leftovers (#1343 Weeping true) must not share this commit. */
export const CHESSBOARD_LICH_PHASE_GATE_FULL_HEAL = false;

export const CHESSBOARD_LICH_PHASE_GATE_GUIDE_NEEDLE =
  "Map inversion swaps safe and dangerous zones. Watch for sudden terrain changes.";

export const CHESSBOARD_LICH_PHASE_GATE_LORE_NEEDLE =
  "A translucent skeletal figure on a floating throne whose very presence rearranges the battlefield.";

export type ChessboardLichPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type ChessboardLichPhaseGateArgs = {
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

export function isChessboardLichPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === CHESSBOARD_LICH_PHASE_GATE_BOSS_ID;
}

export function chessboardLichHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Chessboard Lich). */
export function liveWxChessboardLichPhaseThreshold(): number {
  return CHESSBOARD_LICH_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedChessboardLichPhaseThreshold(): number {
  return CHESSBOARD_LICH_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxChessboardLichPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    chessboardLichHpFraction(opts.hp, opts.maxHp) <=
    liveWxChessboardLichPhaseThreshold()
  );
}

export function advertisedChessboardLichPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    chessboardLichHpFraction(opts.hp, opts.maxHp) <=
    advertisedChessboardLichPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Chessboard Lich phase 2 at the advertised 50%
 * card. Other bosses return null (Fortress ×1.2 of 400 #1352, King ×1.3
 * of 450 #1349, Queen ×1.5 of 380 #1347, Bishop ×2.0 #1345, Weeping
 * fullHeal ×2.0 of 500 #1343, Static ×1.5 of 340 #1342, Cavalier ×1.6 of
 * 320 #1337/#1338, Grandmaster ×1.3 of 300 #1336, Broodmother ×1.4 of
 * 480 #1333, Archbishop ×1.4 of 350 #1332, Countess ×1.5 of 400 #1329,
 * Fetid Split #1325, Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveChessboardLichPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isChessboardLichPhaseGateBoss(args.bossId)) return null;
  if (!advertisedChessboardLichPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteChessboardLichPhaseGateHp(
  args: ChessboardLichPhaseGateArgs,
): boolean {
  if (!isChessboardLichPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedChessboardLichPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitChessboardLichPhaseGateHp(
  args: ChessboardLichPhaseGateArgs,
): boolean {
  return canExecuteChessboardLichPhaseGateHp(args);
}

/** Alias kept unique vs `#1345` `executeBishopPhaseGateHp`. */
export function executeLichPhaseGateHp(
  args: ChessboardLichPhaseGateArgs,
): ChessboardLichPhaseGateExecute | null {
  return executeChessboardLichPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.3. Live 0.0 gate never
 * calls this (`liveWxChessboardLichPhaseTransitioned` stays false at
 * 100/200). Does not stamp invert / claim / rotate — kit-first
 * cursed-wound still shadows the decide currentPhase-2 branches, and
 * MAP_ROTATE already lives on phase 1.
 */
export function executeChessboardLichPhaseGateHp(
  args: ChessboardLichPhaseGateArgs,
): ChessboardLichPhaseGateExecute | null {
  if (!canExecuteChessboardLichPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    CHESSBOARD_LICH_PHASE_GATE_STAT_MULT,
    CHESSBOARD_LICH_PHASE_GATE_FULL_HEAL,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxChessboardLichReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesChessboardLichPhaseHpOnceTransitioned(): boolean {
  return true;
}
