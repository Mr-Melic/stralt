/**
 * Midnight Bishop advertised Phase 2 never arms at 25% HP.
 *
 * Advertised (`bossDefaults` phase1.hpThreshold 0.25, phase2.statMultiplier
 * 2.0 + MERGE_BISHOPS / MAGIC_REFLECT; Boss Guide "Phase 2 — HP ≤ 25%";
 * Boss Rush room 7):
 *   checkPhaseTransition should arm currentPhase 2 at 90/360.
 *   WorldExploration then commits hpAfterBossPhase2(90, 360, 2.0, false)
 *   → 180/720 in the same flushSync as the PHASE 2 log.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Bishop `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.25. At 90/360 (0.25) live does not
 * transition; only hp 0 (dead) satisfies 0.0. Store HP stays 90/360.
 * `decideMidnightBishopAction` never sees currentPhase 2 from HP, so
 * MERGE_BISHOPS is unreachable while alive.
 *
 * Unique leftover of **#1343** (Weeping ×2.0 at 30% of 500 with WX
 * `fullHeal: true` → 1000/1000; that sidecar returns null for
 * midnight_bishop), **#1342** (Static ×1.5 at 40% of 340 → 204/510),
 * **#1337/#1338** (Cavalier ×1.6 at 50% of 320 → 256/512), **#1336**
 * (Grandmaster ×1.3 at 60% of 300 → 234/390), **#1333** (Broodmother
 * ×1.4 at 50% of 480 → 336/672), **#1332** (Archbishop ×1.4 at 50% of
 * 350 → 245/490), **#1329** (Countess ×1.5 at 40% of 400 → 240/600),
 * and **#1325** (Fetid Split twins; Fetid `phase2.statMultiplier` is
 * 1.0 so that sidecar has no HP fire). Unique vs **#1058** MERGE
 * decide + unread MAGIC_REFLECT (tests pass currentPhase: 2 —
 * kit-first Mirror still shadows MERGE once the gate is armed). This
 * sidecar is 25% of 360 / `fullHeal: false` → 180/720. Starborn Queen
 * VOID is a sibling leftover — this resolver returns null for that id.
 * Do not add `atk` / `ap` / `res` / `chc` / `merge` / `reflect` /
 * `twin` / `wound` / `mirror` / `frost` / `swap` / `veil` / `promote` /
 * `void` / `chain` / `shock` / `spike` / `jump` / `illusion` /
 * `copies` / `split` / `twins` / `lava` / `inferno` / `spawn` /
 * `minion` / `larvae` / `ghost` / `roll` / `drain` / `heal`.
 *
 * Export names stay unique vs `#1058` (`resolveMidnightBishopPhase2Decide`,
 * `resolveBossMagicReflect`, `midnightBishopMagicReflectCommit.ts`),
 * `#1343` (`resolveWeepingPawnPhaseGate`, `executeWeepingPawnPhaseGateHp`),
 * `#1342` (`resolveLordOfStaticPhaseGate`, `executeStaticPhaseGateHp`),
 * `#1337/#1338` (`resolveBoneCavalierPhaseGate`, `executeCavalierPhaseGateHp`),
 * `#1336` (`resolveVoidGrandmasterPhaseGate`, `executeGrandmasterPhaseGateHp`),
 * `#1333` (`resolveBroodmotherRookPhaseGate`, `executeBroodmotherPhaseGateHp`),
 * `#1332` (`resolvePaleArchbishopPhaseGate`, `executeArchbishopPhaseGateHp`),
 * `#1329` (`resolveCrimsonCountessPhaseGate`, `executeCountessPhaseGateHp`),
 * `#1325` (`resolveFetidRookPhaseGate`, `executeFetidRookPhaseGateSplit`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * castHelpers / midnightBishopMagicReflectCommit /
 * bossWeepingPawnPhaseGateCommit / bossStaticPhaseGateCommit /
 * bossCavalierPhaseGateCommit / bossGrandmasterPhaseGateCommit /
 * bossBroodmotherPhaseGateCommit /
 * bossArchbishopPhaseGateCommit / bossCountessPhaseGateCommit /
 * bossSplitRooksPhaseGateCommit.
 * Restack `checkPhaseTransition` onto `resolveMidnightBishopPhaseGate`
 * after those PRs land. Do not undo Weeping ×2.0 fullHeal (#1343),
 * Static ×1.5 (#1342), Cavalier ×1.6 (#1337/#1338), Grandmaster ×1.3
 * (#1336), Broodmother ×1.4 (#1333), Archbishop ×1.4 (#1332),
 * Countess ×1.5 (#1329), Fetid Split (#1325), or MERGE decide +
 * MAGIC_REFLECT (#1058).
 */

import { hpAfterBossPhase2 } from "./battleSetup.ts";

export const MIDNIGHT_BISHOP_PHASE_GATE_BOSS_ID = "midnight_bishop";

export const BISHOP_PHASE_GATE_ABILITY = "MERGE_BISHOPS";

/** Adjacent leftover — kit-first Cursed Wound still shadows TWIN_FLANK. */
export const BISHOP_PHASE_GATE_TWIN_LEFTOVER = "TWIN_FLANK";

/** Adjacent leftover — unread MAGIC_REFLECT once MERGE fires (#1058). */
export const BISHOP_PHASE_GATE_REFLECT_LEFTOVER = "MAGIC_REFLECT";

/** Kit-first leftover — live phase-1 first-id, not restored here. */
export const BISHOP_PHASE_GATE_KIT_FIRST = "spell-cursed-wound";

/** Phase-2 kit first-id leftover — still shadows MERGE (#1058). */
export const BISHOP_PHASE_GATE_KIT_PHASE2 = "spell-mirror";

export const BISHOP_PHASE_GATE_HP = 360;

/** Catalog / guide `phase1.hpThreshold`. Unique vs Weeping 0.3. */
export const BISHOP_PHASE_GATE_ADVERTISED_THRESHOLD = 0.25;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const BISHOP_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** Catalog `phase2.statMultiplier`. Weeping #1343 is also 2.0 of 500. */
export const BISHOP_PHASE_GATE_STAT_MULT = 2.0;

/** 360 * 0.25 — first HP that advertised phase 2 must arm. */
export const BISHOP_PHASE_GATE_HP_AT_GUIDE = 90;

/** hpAfterBossPhase2(90, 360, 2.0, false). Weeping #1343 fullHeal is 1000/1000. */
export const BISHOP_PHASE_GATE_HP_AFTER = 180;

export const BISHOP_PHASE_GATE_MAX_HP_AFTER = 720;

export const BISHOP_PHASE_GATE_GUIDE_NEEDLE =
  "Two bishops merge into one powerful form. Burst them before they merge.";

export const BISHOP_PHASE_GATE_LORE_NEEDLE =
  "Twin bishops sharing one HP pool, flanking from both diagonals until they merge into one unstoppable form.";

export type BishopPhaseGateExecute = {
  phase: 1 | 2;
  hp: number;
  maxHp: number;
};

export type BishopPhaseGateArgs = {
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

export function isMidnightBishopPhaseGateBoss(
  bossId: string | undefined,
): boolean {
  return bossId == null || bossId === MIDNIGHT_BISHOP_PHASE_GATE_BOSS_ID;
}

export function bishopHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Midnight Bishop). */
export function liveWxBishopPhaseThreshold(): number {
  return BISHOP_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.25). */
export function advertisedBishopPhaseThreshold(): number {
  return BISHOP_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxBishopPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return bishopHpFraction(opts.hp, opts.maxHp) <= liveWxBishopPhaseThreshold();
}

export function advertisedBishopPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    bishopHpFraction(opts.hp, opts.maxHp) <= advertisedBishopPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Midnight Bishop phase 2 at the advertised 25%
 * card. Other bosses return null (Static ×1.5 #1342, Cavalier ×1.6
 * #1337/#1338, Grandmaster ×1.3 #1336, Broodmother ×1.4 #1333,
 * Archbishop ×1.4 #1332, Countess ×1.5 of 400 #1329, Fetid Split
 * #1325, Weeping fullHeal ×2.0 #1343, Starborn Queen VOID leftover,
 * Final Pawn HP≤10% GHOST leftover of #1247).
 */
export function resolveMidnightBishopPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isMidnightBishopPhaseGateBoss(args.bossId)) return null;
  if (!advertisedBishopPhaseTransitioned(args)) return null;
  return 2;
}

export function canExecuteBishopPhaseGateHp(
  args: BishopPhaseGateArgs,
): boolean {
  if (!isMidnightBishopPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  return advertisedBishopPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so the HP restack and the gate cannot fork. */
export function shouldCommitBishopPhaseGateHp(
  args: BishopPhaseGateArgs,
): boolean {
  return canExecuteBishopPhaseGateHp(args);
}

/**
 * Player-visible store HP after advertised 25% ×2.0. Live 0.0 gate never
 * calls this (`liveWxBishopPhaseTransitioned` stays false at 90/360).
 * Uses `fullHeal: false` — Weeping Pawn #1343 is the WX `true` arm.
 * Does not stamp merge / reflect — kit-first Mirror still shadows
 * MERGE_BISHOPS once phase 2 is armed (#1058 leftover).
 */
export function executeBishopPhaseGateHp(
  args: BishopPhaseGateArgs,
): BishopPhaseGateExecute | null {
  if (!canExecuteBishopPhaseGateHp(args)) return null;
  const next = hpAfterBossPhase2(
    args.hp,
    args.maxHp,
    BISHOP_PHASE_GATE_STAT_MULT,
    false,
  );
  return {
    phase: 2,
    hp: next.hp,
    maxHp: next.maxHp,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxBishopReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes hpAfterBossPhase2 when transitioned is true. This
 * leftover is the HP fraction that never arms phase 2.
 */
export function wxAppliesBishopPhaseHpOnceTransitioned(): boolean {
  return true;
}
