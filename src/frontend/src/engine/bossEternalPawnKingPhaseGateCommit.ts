/**
 * Eternal Pawn King advertised Phase 2 never arms at 50% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.5, phase2.statMultiplier
 * 1.3 + AP_DRAIN + ADVANCE_PER_TURN; Boss Guide "Phase 2 — HP ≤ 50%";
 * Boss Rush room 6):
 *   checkPhaseTransition should arm currentPhase 2 at 225/450.
 *   WorldExploration then commits hpAfterBossPhase2(225, 450, 1.3, false)
 *   → 293/585 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * King `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.5. At 225/450 (0.5) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 225/450.
 * `decideEternalPawnKingAction` never sees currentPhase 2 from HP, so
 * AP_DRAIN is unreachable while alive.
 *
 * Unique leftover of **#1347/#1349** (Starborn Queen ×1.5 at 50% of
 * **380** → 285/570; those sidecars return null for
 * eternal_pawn_king), **#1345** (Midnight Bishop ×2.0 at 25% of 360 →
 * 180/720), **#1343** (Weeping ×2.0 at 30% of 500 with WX
 * `fullHeal: true` → 1000/1000), **#1342** (Static ×1.5 at 40% of 340
 * → 204/510), **#1337/#1338** (Cavalier ×1.6 at 50% of **320** →
 * 256/512; same advertised 50%, different HP and SPIKE), **#1336**
 * (Grandmaster ×1.3 at 60% of **300** → 234/390; same advertised ×1.3,
 * different HP and 60%), **#1333** (Broodmother ×1.4 at 50% of 480 →
 * 336/672), **#1332** (Archbishop ×1.4 at 50% of 350 → 245/490),
 * **#1329** (Countess ×1.5 at 40% of 400 → 240/600), and **#1325**
 * (Fetid Split twins; Fetid `phase2.statMultiplier` is 1.0 so that
 * sidecar has no HP fire). Unique vs **#1204** kit-first Slow vs AP
 * Drain (tests assume phase 2 already armed — decide leftover, not
 * restored here). Unique vs **#1212** kit-first Slow vs Advance.
 * Unique vs **#732** Eternal Pawn portal far crumbs. Alabaster
 * Fortress BOARD_SHRINK / Chessboard Lich MAP_ROTATE / Mirror
 * Sovereign SPELL_MIRROR / Pale Archivist PAGES_OF_DOOM are sibling
 * leftovers — this resolver returns null for those ids. Do not add
 * `atk` / `ap` / `res` / `chc` / `drain` / `advance` / `slow` /
 * `iron` / `wound` / `courage` / `void` / `lines` / `blast` / `frost`
 * / `chain` / `shock` / `spike` / `jump` / `illusion` / `copies` /
 * `swap` / `teleport` / `split` / `twins` / `lava` / `inferno` /
 * `reflect` / `spawn` / `minion` / `larvae` / `ghost` / `roll` /
 * `promote` / `merge` / `heal` / `shrink` / `rotate` / `mirror`.
 *
 * Export names stay unique vs `#1347/#1349` (`resolveStarbornQueenPhaseGate`,
 * `executeQueenPhaseGateHp` / `executeStarbornQueenPhaseGateHp`,
 * `QUEEN_PHASE_GATE_*` / `STARBORN_QUEEN_PHASE_GATE_*`), `#1345`
 * (`resolveMidnightBishopPhaseGate`, `executeBishopPhaseGateHp`),
 * `#1343` (`resolveWeepingPawnPhaseGate`, `executeWeepingPawnPhaseGateHp`),
 * `#1342` (`resolveLordOfStaticPhaseGate`, `executeStaticPhaseGateHp`),
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
 * castHelpers / bossStarbornQueenPhaseGateCommit /
 * bossMidnightBishopPhaseGateCommit / bossWeepingPawnPhaseGateCommit /
 * bossStaticPhaseGateCommit / bossCavalierPhaseGateCommit /
 * bossGrandmasterPhaseGateCommit / bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit. Restack `checkPhaseTransition` onto
 * `resolveEternalPawnKingPhaseGate` after those PRs land. Do not undo
 * Queen ×1.5 (#1347/#1349), Bishop ×2.0 (#1345), Weeping ×2.0 fullHeal
 * (#1343), Static ×1.5 (#1342), Cavalier ×1.6 (#1337/#1338),
 * Grandmaster ×1.3 (#1336), Broodmother ×1.4 (#1333), Archbishop ×1.4
 * (#1332), Countess ×1.5 (#1329), Fetid Split (#1325), kit-first Slow
 * vs AP Drain (#1204), or Eternal portal crumbs (#732).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const ETERNAL_PAWN_KING_PHASE_GATE_BOSS_ID = "eternal_pawn_king";

export const ETERNAL_PAWN_KING_PHASE_GATE_ABILITY = "AP_DRAIN";

/** Adjacent leftover — advance already lives on phase 1. */
export const ETERNAL_PAWN_KING_PHASE_GATE_ADVANCE_LEFTOVER = "ADVANCE_PER_TURN";

/** Kit-first leftover — live phase-1 and phase-2 first-id, not restored here. */
export const ETERNAL_PAWN_KING_PHASE_GATE_KIT_FIRST = "spell-slow";

/** Phase-2 kit extra leftover — still kit-latent under empty Map. */
export const ETERNAL_PAWN_KING_PHASE_GATE_KIT_PHASE2 = "spell-iron-skin";

export const ETERNAL_PAWN_KING_PHASE_GATE_HP = 450;

/** Catalog / guide `phase1.hpThreshold`. Cavalier/Queen/Archbishop/Broodmother are also 0.5. */
export const ETERNAL_PAWN_KING_PHASE_GATE_ADVERTISED_THRESHOLD = 0.5;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const ETERNAL_PAWN_KING_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Grandmaster is also 1.3 of 300 at 60%. */
export const ETERNAL_PAWN_KING_PHASE_GATE_STAT_MULT = 1.3;

/** 450 * 0.5 — first HP that advertised phase 2 must arm. */
export const ETERNAL_PAWN_KING_PHASE_GATE_HP_AT_GUIDE = 225;

/** hpAfterBossPhase2(225, 450, 1.3, false). */
export const ETERNAL_PAWN_KING_PHASE_GATE_HP_AFTER = 293;

export const ETERNAL_PAWN_KING_PHASE_GATE_MAX_HP_AFTER = 585;

export const ETERNAL_PAWN_KING_PHASE_GATE_GUIDE_NEEDLE =
  "Boss drains Action Points. Bring AP-restoring buffs or plan shorter action chains.";

export const ETERNAL_PAWN_KING_PHASE_GATE_LORE_NEEDLE =
  "A pawn that has advanced for centuries — now both pawn and king, draining AP as it advances.";

export type EternalPawnKingPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type EternalPawnKingPhaseGateArgs = {
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

export function isEternalPawnKingPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === ETERNAL_PAWN_KING_PHASE_GATE_BOSS_ID;
}

export function eternalPawnKingHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Eternal Pawn King). */
export function liveWxEternalPawnKingPhaseThreshold(): number {
  return ETERNAL_PAWN_KING_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.5). */
export function advertisedEternalPawnKingPhaseThreshold(): number {
  return ETERNAL_PAWN_KING_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxEternalPawnKingPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    eternalPawnKingHpFraction(opts.hp, opts.maxHp) <=
    liveWxEternalPawnKingPhaseThreshold()
  );
}

export function advertisedEternalPawnKingPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    eternalPawnKingHpFraction(opts.hp, opts.maxHp) <=
    advertisedEternalPawnKingPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Eternal Pawn King phase 2 at the advertised
 * 50% card. Other bosses return null (Queen ×1.5 of 380 #1347/#1349,
 * Bishop ×2.0 #1345, Weeping fullHeal ×2.0 #1343, Static ×1.5 of 340
 * #1342, Cavalier ×1.6 of 320 #1337/#1338, Grandmaster ×1.3 of 300
 * #1336, Broodmother ×1.4 of 480 #1333, Archbishop ×1.4 of 350 #1332,
 * Countess ×1.5 of 400 #1329, Fetid Split #1325, Final Pawn HP≤10%
 * GHOST leftover of #1247).
 */
export function resolveEternalPawnKingPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isEternalPawnKingPhaseGateBoss(args.bossId)) return null;
  if (!advertisedEternalPawnKingPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteEternalPawnKingPhaseGateHp(
  args: EternalPawnKingPhaseGateArgs,
): boolean {
  if (!isEternalPawnKingPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedEternalPawnKingPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitEternalPawnKingPhaseGateHp(
  args: EternalPawnKingPhaseGateArgs,
): boolean {
  return canExecuteEternalPawnKingPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 50% ×1.3. Live 0.0 gate never
 * calls this (`liveWxEternalPawnKingPhaseTransitioned` stays false at
 * 225/450). Does not stamp AP drain / advance — kit-first spell-slow
 * still shadows AP_DRAIN (#1204 leftover), and ADVANCE already lives
 * on phase 1.
 */
export function executeEternalPawnKingPhaseGateHp(
  args: EternalPawnKingPhaseGateArgs,
): EternalPawnKingPhaseGateExecute | null {
  if (!canExecuteEternalPawnKingPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    ETERNAL_PAWN_KING_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxEternalPawnKingReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesEternalPawnKingPhaseHpOnceTransitioned(): boolean {
  return true;
}
