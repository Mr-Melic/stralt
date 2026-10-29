/**
 * Fetid Rook SPLIT_ROOKS advertised at 40% HP never becomes eligible.
 *
 * Advertised (`bossDefaults` lore "splitting into twins at half HP",
 * Boss Guide "Boss splits into two independent rooks",
 * BossGuideModal Phase 2 — HP ≤ phase1.hpThreshold 40%):
 *   checkPhaseTransition should arm currentPhase 2 at 168/420.
 *   decideFetidRookAction then takes SPLIT_ROOKS when
 *   currentPhase === 2 && !splitRooksSpawned.
 *   applySplitRooks writes two `pieceType: "rook"` minions.
 *   Live WX already commits `res?.spawns`, so a decided split occupies.
 *
 * Live leftover — phase gate. `checkPhaseTransition` (~181) compares
 *   hpFraction <= config.phase2.hpThreshold
 * Fetid Rook `phase2.hpThreshold` is 0.0 (no phase 3). Guide / phase-1
 * card use `phase1.hpThreshold` 0.4. At 168/420 (0.4) live does not
 * transition; only hp 0 (dead) satisfies 0.0. `decideFetidRookAction`
 * never sees currentPhase 2 from HP, so twins never occupy. After the
 * 420 HP rook dies `shouldAwardVictory` fires — advertised twins still
 * occupy (Strike 10 vs stamp 20 leftover of #1231 leaves 10).
 *
 * Unique leftover of **#1261** (kit-first Venom vs SPLIT once
 * `currentPhase` is already 2 — those tests pass currentPhase: 2) and
 * **#1231** / **#1271** / **#1316** (HP / atk / RES once spawn is
 * already decided). Unique vs **#1247** Final Pawn HP≤10% GHOST decide,
 * **#1288** Broodmother kit-first vs LARVAE_SPAWN (tests pass
 * currentPhase: 2; Broodmother phase2.hpThreshold 0.0 is a sibling
 * leftover), Eternal Pawn AP_DRAIN / ADVANCE. Do not add `hp` / `atk` /
 * `ap` / `res` / `chc` / `heal` / `roll` / `glass` / `glyph` / `venom` /
 * `decide` / `rot` / `revive`.
 *
 * Export names stay unique vs `#1261` (`resolveFetidRookSplitDecide`,
 * `wxFetidRookSplitDecide`, `isFetidRookSplitTurn`,
 * `fetidRookHostilesAfterDecide`), `#1231`
 * (`resolveFetidSplitRookCommittedHp`), `#1271`
 * (`resolveSplitRookCommittedAtk`), `#1316`
 * (`resolveSplitRookCommittedRes`).
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem /
 * occupancy / statusEffects / spellEngine / challengeCompletion /
 * bossSplitRooksHpCommit / bossSplitRooksAtkCommit /
 * bossSplitRooksResCommit / bossSplitRooksDecideCommit. Restack
 * `checkPhaseTransition` onto `resolveFetidRookPhaseGate` after those
 * PRs land. Do not undo kit-first Venom (#1261), the half-HP stamp
 * (#1231), advertised atk 25 (#1271), or advertised RES 18 (#1316).
 */

export const FETID_ROOK_PHASE_GATE_BOSS_ID = "fetid_rook";

export const SPLIT_ROOKS_PHASE_GATE_ABILITY = "SPLIT_ROOKS";

/** Adjacent leftover — not restored here (#1261). */
export const COMPOUNDING_ROT_PHASE_GATE_LEFTOVER = "COMPOUNDING_ROT";

/** Kit-first leftover — phase-2 first-id, not restored here (#1261). */
export const FETID_ROOK_PHASE_GATE_KIT_FIRST = "spell-venom-strike";

export const FETID_ROOK_PHASE_GATE_HP = 420;

/** Catalog / guide `phase1.hpThreshold`. */
export const FETID_ROOK_PHASE_GATE_ADVERTISED_THRESHOLD = 0.4;

/** Live `checkPhaseTransition` reads `phase2.hpThreshold`. */
export const FETID_ROOK_PHASE_GATE_LIVE_THRESHOLD = 0.0;

/** 420 * 0.4 — first HP that advertised phase 2 must arm. */
export const FETID_ROOK_PHASE_GATE_HP_AT_GUIDE = 168;

/** Production `applySplitRooks` wants two adjacent free tiles. */
export const FETID_ROOK_PHASE_GATE_TWIN_COUNT = 2;

/** Advertised AP — leftover, not restored here (#1271). */
export const FETID_ROOK_PHASE_GATE_AP_LEFTOVER = 5;

export const SPLIT_ROOKS_PHASE_GATE_GUIDE_NEEDLE =
  "Boss splits into two independent rooks";

export const SPLIT_ROOKS_PHASE_GATE_LORE_NEEDLE =
  "splitting into twins at half HP";

export type FetidRookPhaseGateExecute = {
  phase: 1 | 2;
  twinCount: number;
  hostilesAfterRookDeath: number;
  awardsVictory: boolean;
};

export type FetidRookPhaseGateArgs = {
  bossId?: string;
  hp: number;
  maxHp: number;
  /** True when `bossState.phase2Triggered` / currentPhase is already 2. */
  alreadyPhase2: boolean;
  /** True when `bossState.splitRooksSpawned`. */
  splitRooksSpawned: boolean;
  /**
   * Empty-kit / #1261 restack path. Kit-first Venom still shadows Split
   * even after this gate arms — not restored here.
   */
  kitSpellId: string | null;
};

function finiteNonNeg(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function finiteUnit(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function isFetidRookPhaseGateBoss(bossId: string | undefined): boolean {
  return bossId == null || bossId === FETID_ROOK_PHASE_GATE_BOSS_ID;
}

export function fetidRookHpFraction(hp: number, maxHp: number): number {
  return finiteNonNeg(hp) / Math.max(finiteNonNeg(maxHp), 1);
}

/** Live leftover: `config.phase2.hpThreshold` (0.0 on Fetid Rook). */
export function liveWxFetidRookPhaseThreshold(): number {
  return FETID_ROOK_PHASE_GATE_LIVE_THRESHOLD;
}

/** Advertised / Boss Guide: `config.phase1.hpThreshold` (0.4). */
export function advertisedFetidRookPhaseThreshold(): number {
  return FETID_ROOK_PHASE_GATE_ADVERTISED_THRESHOLD;
}

export function liveWxFetidRookPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    fetidRookHpFraction(opts.hp, opts.maxHp) <= liveWxFetidRookPhaseThreshold()
  );
}

export function advertisedFetidRookPhaseTransitioned(opts: {
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): boolean {
  if (opts.alreadyPhase2 === true) return false;
  return (
    fetidRookHpFraction(opts.hp, opts.maxHp) <=
    advertisedFetidRookPhaseThreshold()
  );
}

/**
 * Phase-gate restack: arm Fetid Rook phase 2 at the advertised 40%
 * card. Other bosses return null (Broodmother 0.0 leftover, Final Pawn
 * HP≤10% GHOST leftover of #1247).
 */
export function resolveFetidRookPhaseGate(args: {
  bossId?: string;
  hp: number;
  maxHp: number;
  alreadyPhase2: boolean;
}): 2 | null {
  if (!isFetidRookPhaseGateBoss(args.bossId)) return null;
  if (!advertisedFetidRookPhaseTransitioned(args)) return null;
  return 2;
}

/**
 * True when advertised 40% would arm phase 2 so empty-kit Split can
 * occupy. Already-phase-2 is leftover of #1261 (tests pass
 * currentPhase: 2). Kit-first Venom still shadows Split — not this.
 */
export function canExecuteFetidRookPhaseGateSplit(
  args: FetidRookPhaseGateArgs,
): boolean {
  if (!isFetidRookPhaseGateBoss(args.bossId)) return false;
  if (args.alreadyPhase2 === true) return false;
  if (args.splitRooksSpawned === true) return false;
  if (args.kitSpellId) return false;
  return advertisedFetidRookPhaseTransitioned({
    hp: args.hp,
    maxHp: args.maxHp,
    alreadyPhase2: false,
  });
}

/** Alias so decide and the phase restack cannot fork. */
export function shouldDecideFetidRookPhaseGateSplit(
  args: FetidRookPhaseGateArgs,
): boolean {
  return canExecuteFetidRookPhaseGateSplit(args);
}

export function fetidRookPhaseGateHighlightedIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Player-visible occupancy after the original rook dies. Advertised
 * 40% gate + empty kit → twins remain. Live 0.0 gate never calls this
 * (`liveWxFetidRookPhaseTransitioned` stays false at 168/420).
 */
export function executeFetidRookPhaseGateSplit(
  args: FetidRookPhaseGateArgs,
): FetidRookPhaseGateExecute | null {
  if (!canExecuteFetidRookPhaseGateSplit(args)) return null;
  const twinCount = FETID_ROOK_PHASE_GATE_TWIN_COUNT;
  return {
    phase: 2,
    twinCount,
    hostilesAfterRookDeath: twinCount,
    awardsVictory: false,
  };
}

/** Live `checkPhaseTransition` still keys off phase2.hpThreshold. */
export function liveWxFetidRookReadsPhase2Threshold(): boolean {
  return true;
}

/**
 * WX already writes `res?.spawns` when Split is decided. This leftover
 * is the HP fraction that never arms phase 2.
 */
export function wxAppliesFetidRookSplitSpawnsOncePhase2(): boolean {
  return true;
}

export function fetidRookPhaseGateHostiles(opts: {
  rookAlive: boolean;
  twinCount: number;
}): number {
  const rook = opts.rookAlive === true ? 1 : 0;
  return rook + finiteUnit(opts.twinCount);
}
