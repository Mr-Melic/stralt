/**
 * Enthroned Void AP_DRAIN_PASSIVE never sees last-turn damage-spell AP.
 *
 * `applyApDrainPassive` (`useBossSystem.ts`) reads `bossState.apDrainLastTurn`
 * and returns `playerApModifier: -1` when that spend is ≥ 3, `-2` when ≥ 5.
 * Live WX already applies `playerApModifier` onto `currentBattleAp`. The
 * field is initialized to 0 in `makeFreshBossState` and never written, so
 * the drain always logs "arcane reserves are untouched".
 *
 * Unique fire: Enthroned Void, player turn ended, stamp the AP spent on
 * metadata damage spells (direct `damage > 0` or DoT ticks) this turn.
 * Live leaves 0. Kit-first Swap still shadows the decide (`#1164`) — this
 * sidecar does not restore that. Eternal Pawn `AP_DRAIN` always `-1`,
 * BOARD_CLAIM zone `-2`, Dawn `playerApModifier` buffs, and Drain Courage
 * (`#922`) are different writers.
 *
 * Do not restack WorldExploration / useBossAI / useBossSystem / spellEngine
 * / challengeCompletion / bossApDrainPassiveDecideCommit. Restack player
 * turn-end onto `executeApDrainLastTurnTrack` after those PRs land.
 */

export type ApDrainLastTurnSpell = {
  id?: string;
  apCost?: unknown;
  spellType?: string | null;
  effectType?: string | null;
  damage?: unknown;
  healAmount?: unknown;
  buffStat?: string | null;
  debuffStat?: string | null;
  dotDamage?: unknown;
  dotDamagePerTurn?: unknown;
  dotDuration?: unknown;
  isDotSpell?: boolean | null;
  isPhysical?: boolean | null;
  isSwap?: boolean | null;
  isSummon?: boolean | null;
  isMark?: boolean | null;
  isMirror?: boolean | null;
  isBarrier?: boolean | null;
};

export type ApDrainLastTurnTrackArgs = {
  bossId: string;
  playerTurnEnded: boolean;
  spellsCastThisTurn: readonly ApDrainLastTurnSpell[];
};

export type ApDrainLastTurnTrackExecute = {
  apDrainLastTurn: number;
  advertisedDrain: number;
};

function finiteNonNegInt(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

function isZeroDamageDot(spell: ApDrainLastTurnSpell): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (finiteNonNegInt(spell.damage) > 0) return false;
  if (finiteNonNegInt(spell.healAmount) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = finiteNonNegInt(spell.dotDamagePerTurn ?? spell.dotDamage);
  const duration = finiteNonNegInt(spell.dotDuration);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * Last-turn spend identity: a non-physical, non-utility spell that deals
 * advertised hit or DoT damage and costs AP. Strike is `isPhysical`.
 * Shield / Slow / Swap / Mend are buff, debuff, teleport, or heal.
 */
export function isApDrainLastTurnDamageSpell(
  spell: ApDrainLastTurnSpell,
): boolean {
  if (spell.isPhysical === true) return false;
  if (spell.isSwap || spell.isSummon || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (finiteNonNegInt(spell.apCost) <= 0) return false;
  if (isZeroDamageDot(spell)) return true;
  if (finiteNonNegInt(spell.damage) <= 0) return false;
  if (spell.spellType === "heal") return false;
  if (spell.effectType === "heal" || spell.effectType === "buff") return false;
  if (spell.effectType === "teleport") return false;
  return (
    spell.spellType === "damage" ||
    spell.spellType === "drain" ||
    spell.effectType === "damage" ||
    spell.effectType === "drain"
  );
}

export function apCostTowardApDrainLastTurn(
  spell: ApDrainLastTurnSpell,
): number {
  if (!isApDrainLastTurnDamageSpell(spell)) return 0;
  return finiteNonNegInt(spell.apCost);
}

export function sumApDrainLastTurnDamageSpellAp(
  spells: readonly ApDrainLastTurnSpell[],
): number {
  let total = 0;
  for (const spell of spells) {
    total += apCostTowardApDrainLastTurn(spell);
  }
  return total;
}

/** Same thresholds as live `applyApDrainPassive`. */
export function advertisedApDrainPassiveFromLastTurn(
  lastTurnDmgAP: unknown,
): number {
  const n = Math.max(0, Math.floor(Number(lastTurnDmgAP) || 0));
  if (!Number.isFinite(n)) return 0;
  if (n >= 5) return 2;
  if (n >= 3) return 1;
  return 0;
}

/**
 * Stamp during the Enthroned Void encounter (any phase). The reader is
 * phase-2 `AP_DRAIN_PASSIVE`; phase-1 spend must still land on the field
 * before the phase swap or the first phase-2 turn always sees 0.
 */
export function shouldStampApDrainLastTurn(args: {
  bossId: string;
}): boolean {
  return args.bossId === "enthroned_void";
}

export function canExecuteApDrainLastTurnTrack(
  args: ApDrainLastTurnTrackArgs,
): boolean {
  if (args.playerTurnEnded !== true) return false;
  return shouldStampApDrainLastTurn(args);
}

/**
 * Live WX never writes `apDrainLastTurn`. Proven by the source scan in
 * the test file.
 */
export function liveWxWritesApDrainLastTurn(): boolean {
  return false;
}

/** Fresh encounter state always starts at 0. */
export function liveFreshBossStateApDrainLastTurn(): number {
  return 0;
}

/**
 * Commit advertised last-turn damage-spell AP. Other bosses, a turn that
 * has not ended, and kit-first decide (`#1164`) return null.
 */
export function executeApDrainLastTurnTrack(
  args: ApDrainLastTurnTrackArgs,
): ApDrainLastTurnTrackExecute | null {
  if (!canExecuteApDrainLastTurnTrack(args)) return null;
  const apDrainLastTurn = sumApDrainLastTurnDamageSpellAp(
    args.spellsCastThisTurn,
  );
  return {
    apDrainLastTurn,
    advertisedDrain: advertisedApDrainPassiveFromLastTurn(apDrainLastTurn),
  };
}
