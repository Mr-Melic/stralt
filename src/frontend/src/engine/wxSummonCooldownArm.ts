/**
 * Summon `applyCast` never arms cooldown vs advertised Inferno CD 3.
 *
 * Catalog Inferno is the only summon-kit row with `cooldown: 3`. Pack
 * WX writes `enemyCooldownsRef` after a legal enemy cast (nested under
 * `damage > 0` for the damage arm — `#972`). Summon turns go through
 * `executeSummonAction` → private `applyCast`, which never writes
 * cooldown, and `SummonExecutorResult` has no CD field, so WX after
 * execute only copies position / AP / MP / HP. Remaining stays 0 even
 * after a legal Inferno dest, so a second turn recasts immediately.
 * Distinct from pack Inferno CD nested under `damage > 0` (`#972`),
 * available-list filter (`#1158`), and assigned-fallback lookup
 * (`#1150`).
 *
 * Cluster radius / self-detonate stay `#799`. Inferno ticks stay
 * `#856` / `#947`. Pack Inferno+heal decide/CD stay `#967` / `#972`.
 * Summon kit AP+range stays `#762`. Do not write `areaRadius: 2`
 * onto Inferno (would rebalance). Catalog bomber `summonUnitDef.ap`
 * is 1, which cannot pay Inferno 5 — unique fire needs
 * `currentAp >= 5`; do not rebalance bomber AP or Inferno cost. Do
 * not drop Rallying Cry via `usableByEnemy` (player-side wisp kit;
 * pack-only).
 *
 * Unique vs `#762` / `#799` / `#856` / `#878` / `#947` / `#967` /
 * `#972` / `#978` / `#1054` / `#1081` / `#1087` / `#1090` / `#1091` /
 * `#1095` / `#1096` / `#1098` / `#1123` / `#1150` / `#1158`.
 * WorldExploration / enemyAI / summonExecutor / targeting /
 * spellEngine / statusEffects left untouched so older open PRs stay
 * merge-clean. Restack applyCast + WX after executeSummonAction onto
 * `armWxSummonCooldown` after those PRs land.
 */

import {
  AI_KAMIKAZE_BLAST_RADIUS,
  AI_KAMIKAZE_LOW_HP_PCT,
  AI_KAMIKAZE_MIN_TARGETS,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  canAffordCastAp,
  chebyshevOnBoard,
  enemyCastRangeOk,
  enemySpellRange,
  resolveCastApCost,
} from "./targeting.ts";

export type WxSummonCooldownArmSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "apCost"
      | "spellType"
      | "damage"
      | "targetType"
      | "healAmount"
      | "buffStat"
      | "buffModifier"
      | "buffDuration"
      | "debuffStat"
      | "debuffDuration"
      | "dotDamage"
      | "dotDamagePerTurn"
      | "dotDuration"
      | "effectType"
      | "isDotSpell"
      | "areaRadius"
      | "hitsMultiple"
      | "aoe"
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
      | "cooldown"
      | "usableByEnemy"
    >
  | {
      id?: string;
      range?: unknown;
      apCost?: unknown;
      spellType?: string | null;
      damage?: unknown;
      targetType?: string | null;
      healAmount?: unknown;
      buffStat?: string | null;
      buffModifier?: unknown;
      buffDuration?: unknown;
      debuffStat?: string | null;
      debuffDuration?: unknown;
      dotDamage?: unknown;
      dotDamagePerTurn?: unknown;
      dotDuration?: unknown;
      effectType?: string | null;
      isDotSpell?: boolean | null;
      areaRadius?: unknown;
      hitsMultiple?: boolean | null;
      aoe?: boolean | null;
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
      cooldown?: unknown;
      usableByEnemy?: boolean | null;
    };

export type WxSummonCooldownArmTile = CasterPosition;

export type WxSummonCooldownArmOccupant = WxSummonCooldownArmTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
  summonAI?: string;
  pieceType?: string;
  name?: string;
};

export type WxSummonCooldownArmRemaining = ReadonlyMap<string, number>;

export type WxSummonCooldownArmEntry = {
  spellId: string;
  turns: number;
};

const EMPTY_REMAINING: WxSummonCooldownArmRemaining = new Map();

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxSummonCooldownArmHealKitSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonCooldownArmKitIsHealer(
  spells: readonly WxSummonCooldownArmSpell[],
): boolean {
  return spells.some((s) => isWxSummonCooldownArmHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonCooldownArmBlockedFrostSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

function isZeroDamageDot(spell: WxSummonCooldownArmSpell): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/**
 * Poison leftover identity (`#1095` / `#1096`): 0-damage DoT whose
 * Chebyshev range is strictly greater than Inferno (3) / Venom (2).
 */
export function isWxSummonCooldownArmBlockedPoisonSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) > 3;
}

/**
 * Venom leftover identity (`#856` / `#1123`): 0-damage DoT at Chebyshev 2.
 */
export function isWxSummonCooldownArmBlockedVenomSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 2;
}

/**
 * Slow leftover identity (`#1098`): 0-upfront-damage MP debuff, no DoT.
 */
export function isWxSummonCooldownArmBlockedSlowSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat !== "mp") return false;
  if (!spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  return true;
}

/** 0-damage buff leftover identity (`#978`). */
export function isWxSummonCooldownArmBlockedBuffSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if ((spell.spellType ?? "damage") === "heal") return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  return true;
}

/**
 * Live `inferSummonArchetype` bomber arm: `summonAI === "bomber"` or
 * legacy `kamikaze`, then name/pieceType containing "bomber". Hunter /
 * archer / guardian / healer never reach `decideSummonBomber`. Do not
 * use live's unknown-default hunter.
 */
export function wxSummonCooldownArmIsBomberUnit(unit: {
  summonAI?: string;
  pieceType?: string;
  name?: string;
}): boolean {
  const raw = (unit.summonAI ?? "").toLowerCase();
  if (raw === "bomber" || raw === "kamikaze") return true;
  if (
    raw === "hunter" ||
    raw === "kiter" ||
    raw === "archer" ||
    raw === "healer" ||
    raw === "guardian"
  ) {
    return false;
  }
  const pt = (unit.pieceType ?? unit.name ?? "").toLowerCase();
  return pt.includes("bomber");
}

/**
 * Inferno leftover identity: 0-upfront-damage DoT at Chebyshev 3 with
 * advertised cooldown > 0. Poison is range 4. Venom is range 2. Strike
 * has damage 10. Slow is MP debuff with no ticks. Pack Inferno is the
 * same catalog row — kitIsBomber rejects heal kits (`#967` / `#972`).
 */
export function isWxSummonCooldownArmSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  if (wxSummonCooldownArmAdvertisedTurns(spell) <= 0) {
    return false;
  }
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 3;
}

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Venom `#856`). */
export function isWxSummonCooldownArmBlockedDotSpell(
  spell: WxSummonCooldownArmSpell,
): boolean {
  return isZeroDamageDot(spell);
}

/**
 * Live bomber kit for this leftover: assigned Inferno-only (catalog).
 * Queen/king Inferno+heal is `#967` / `#972`. Archer is Poison+Slow.
 * Hunter is Strike+Venom.
 */
export function wxSummonCooldownArmKitIsBomber(
  spells: readonly WxSummonCooldownArmSpell[],
): boolean {
  if (wxSummonCooldownArmKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonCooldownArmBlockedFrostSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonCooldownArmBlockedPoisonSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonCooldownArmBlockedVenomSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonCooldownArmBlockedSlowSpell(s))) {
    return false;
  }
  return spells.some((s) => isWxSummonCooldownArmSpell(s));
}

export function wxSummonCooldownArmRange(
  spell: WxSummonCooldownArmSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live bomber / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonCooldownArmInRange(
  origin: WxSummonCooldownArmTile,
  targetCell: WxSummonCooldownArmTile,
  spell: WxSummonCooldownArmSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Advertised cooldown turns. Live pack WX writes `chosenSpell.cooldown`
 * when `cooldown && cooldown > 0` — floor of Number, 0 when missing.
 * Summon applyCast never reaches that write.
 */
export function wxSummonCooldownArmAdvertisedTurns(
  spell: WxSummonCooldownArmSpell,
): number {
  const turns = Math.floor(Number(spell.cooldown ?? 0));
  return turns > 0 ? turns : 0;
}

/**
 * Remaining after a prior arm. Missing key and non-positive remaining
 * are ready. Distinct from `#1158` (available-list filter of a remaining
 * that was already written): this leftover is that remaining is never
 * written.
 */
export function wxSummonCooldownArmRemaining(
  spellId: string | undefined,
  remainingBySpellId?: WxSummonCooldownArmRemaining | null,
): number {
  if (!spellId) return 0;
  const turns = Math.floor(Number(remainingBySpellId?.get(spellId) ?? 0));
  return turns > 0 ? turns : 0;
}

export function wxSummonCooldownArmIsReady(
  spell: WxSummonCooldownArmSpell,
  remainingBySpellId?: WxSummonCooldownArmRemaining | null,
): boolean {
  return wxSummonCooldownArmRemaining(spell.id, remainingBySpellId) <= 0;
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function wxSummonCooldownArmApCost(
  spell: WxSummonCooldownArmSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordWxSummonCooldownArmCast(
  currentAp: number,
  spell: WxSummonCooldownArmSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/** Same HP fraction `decideSummonBomber` uses for the low-HP detonate arm. */
export function wxSummonCooldownArmHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const max = Math.max(1, Number(unit.maxHp ?? 0) || 1);
  return Math.max(0, Math.min(1, Number(unit.hp ?? 0) / max));
}

/**
 * Same scan as private `countTargetsInBlast` (Chebyshev
 * `AI_KAMIKAZE_BLAST_RADIUS`). Do not read Inferno `areaRadius` (`#799`).
 */
export function wxSummonCooldownArmClusterCount(
  center: WxSummonCooldownArmTile,
  opponents: readonly WxSummonCooldownArmTile[],
): number {
  let count = 0;
  for (const opponent of opponents) {
    if (chebyshevOnBoard(center, opponent) <= AI_KAMIKAZE_BLAST_RADIUS) {
      count += 1;
    }
  }
  return count;
}

export function wxSummonCooldownArmDetonateEligible(args: {
  clusterCount: number;
  hpFrac: number;
}): boolean {
  return (
    args.clusterCount >= AI_KAMIKAZE_MIN_TARGETS ||
    args.hpFrac < AI_KAMIKAZE_LOW_HP_PCT
  );
}

/**
 * Live applyCast / WX-after-execute never writes CD, for any kit.
 * Pack WX still has a nested-under-damage write (`#972`).
 */
export function wxSummonLiveApplyCastWouldArmCooldown(
  _spell: WxSummonCooldownArmSpell,
): boolean {
  return false;
}

export function wxSummonAdvertisedWouldArmCooldown(
  spell: WxSummonCooldownArmSpell,
): boolean {
  return isWxSummonCooldownArmSpell(spell);
}

/**
 * Live payload — Inferno never reaches a `cdm.set` because applyCast
 * has no cooldown write and `SummonExecutorResult` has no CD field.
 */
export function wxSummonLiveApplyCastCooldownEntry(
  spell: WxSummonCooldownArmSpell,
): WxSummonCooldownArmEntry | null {
  if (!spell.id) return null;
  if (!wxSummonLiveApplyCastWouldArmCooldown(spell)) return null;
  return {
    spellId: spell.id,
    turns: wxSummonCooldownArmAdvertisedTurns(spell),
  };
}

/**
 * Ready Inferno whose advertised CD is not already ticking. Spent
 * remaining refuses a second arm (cannot recast). Do not fall back to
 * assigned (`#1150`) and do not rebuild the available list (`#1158`).
 */
export function wxSummonCooldownArmReadySpell<
  T extends WxSummonCooldownArmSpell,
>(args: {
  assignedSpells?: readonly T[];
  remainingBySpellId?: WxSummonCooldownArmRemaining | null;
}): T | null {
  const assigned = args.assignedSpells ?? [];
  const ready = assigned.find((s) => isWxSummonCooldownArmSpell(s)) ?? null;
  if (!ready) return null;
  if (!wxSummonCooldownArmIsReady(ready, args.remainingBySpellId)) {
    return null;
  }
  return ready;
}

/**
 * Live `decideSummonBomber` detonate arm plus advertised CD ready:
 * unit infers bomber, kit is Inferno-only, Inferno is in Chebyshev 3
 * of a living hostile cluster (or low-HP), AP can pay `applyCast`,
 * and remaining is 0. A prior advertised arm (remaining 3) returns
 * null so highlight/preview matches execute.
 */
export function pickWxSummonCooldownArmSpell<
  T extends WxSummonCooldownArmSpell,
>(args: {
  assignedSpells?: readonly T[];
  remainingBySpellId?: WxSummonCooldownArmRemaining | null;
  origin: WxSummonCooldownArmTile;
  targetCell: WxSummonCooldownArmTile;
  opponents: readonly WxSummonCooldownArmOccupant[];
  bomber: WxSummonCooldownArmOccupant;
  currentAp?: number;
}): T | null {
  if (!wxSummonCooldownArmIsBomberUnit(args.bomber)) return null;
  const kit = args.assignedSpells ?? [];
  if (!wxSummonCooldownArmKitIsBomber(kit)) return null;
  if (args.opponents.length === 0) return null;
  if (!isAliveCombatant({ hp: args.bomber.hp ?? 0 })) return null;
  const ready = wxSummonCooldownArmReadySpell({
    assignedSpells: kit,
    remainingBySpellId: args.remainingBySpellId ?? EMPTY_REMAINING,
  });
  if (!ready || !isWxSummonCooldownArmSpell(ready)) return null;
  if (!canAffordWxSummonCooldownArmCast(args.currentAp ?? 1, ready)) {
    return null;
  }
  if (!wxSummonCooldownArmInRange(args.origin, args.targetCell, ready)) {
    return null;
  }
  const clusterCount = wxSummonCooldownArmClusterCount(
    args.targetCell,
    args.opponents,
  );
  const hpFrac = wxSummonCooldownArmHpFrac(args.bomber);
  if (!wxSummonCooldownArmDetonateEligible({ clusterCount, hpFrac })) {
    return null;
  }
  return ready;
}

export function isWxSummonCooldownArmHostile(args: {
  occupant: WxSummonCooldownArmOccupant;
  bomberSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.bomberSide;
}

export function canExecuteWxSummonCooldownArmCast(args: {
  spell: WxSummonCooldownArmSpell;
  assignedSpells?: readonly WxSummonCooldownArmSpell[];
  remainingBySpellId?: WxSummonCooldownArmRemaining | null;
  origin: WxSummonCooldownArmTile;
  targetCell: WxSummonCooldownArmTile;
  occupant: WxSummonCooldownArmOccupant | null;
  opponents: readonly WxSummonCooldownArmOccupant[];
  bomber: WxSummonCooldownArmOccupant;
  bomberSide: "player" | "enemy";
  currentAp?: number;
}): boolean {
  if (!isWxSummonCooldownArmSpell(args.spell)) return false;
  const kit = args.assignedSpells ?? [args.spell];
  if (
    pickWxSummonCooldownArmSpell({
      assignedSpells: kit,
      remainingBySpellId: args.remainingBySpellId,
      origin: args.origin,
      targetCell: args.targetCell,
      opponents: args.opponents,
      bomber: args.bomber,
      currentAp: args.currentAp,
    }) == null
  ) {
    return false;
  }
  if (!wxSummonCooldownArmInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!canAffordWxSummonCooldownArmCast(args.currentAp ?? 1, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxSummonCooldownArmHostile({
    occupant: args.occupant,
    bomberSide: args.bomberSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonCooldownArmCast(
  args: Parameters<typeof canExecuteWxSummonCooldownArmCast>[0],
): boolean {
  return canExecuteWxSummonCooldownArmCast(args);
}

/**
 * Advertised CD entry after a decided legal Inferno dest. Live
 * applyCast returns null even when the dest is legal.
 */
export function armWxSummonCooldown(args: {
  spell: WxSummonCooldownArmSpell;
  assignedSpells?: readonly WxSummonCooldownArmSpell[];
  remainingBySpellId?: WxSummonCooldownArmRemaining | null;
  origin: WxSummonCooldownArmTile;
  targetCell: WxSummonCooldownArmTile;
  occupant: WxSummonCooldownArmOccupant | null;
  opponents: readonly WxSummonCooldownArmOccupant[];
  bomber: WxSummonCooldownArmOccupant;
  bomberSide: "player" | "enemy";
  currentAp?: number;
}): WxSummonCooldownArmEntry | null {
  if (!canExecuteWxSummonCooldownArmCast(args) || !args.spell.id) return null;
  return {
    spellId: args.spell.id,
    turns: wxSummonCooldownArmAdvertisedTurns(args.spell),
  };
}

export function nextWxSummonCooldownMap(
  current: ReadonlyMap<string, number>,
  entry: WxSummonCooldownArmEntry | null,
): Map<string, number> {
  const next = new Map(current);
  if (entry) next.set(entry.spellId, entry.turns);
  return next;
}

/**
 * Live hole: a legal dest that advertised would arm still leaves
 * remaining 0 because applyCast skipped the write, so the next decide
 * recasts. Distinct from `#1158` (remaining already 3, still listed
 * in unfiltered available).
 */
export function wxSummonLiveWouldRecastBecauseApplyCastSkippedArm(args: {
  spell: WxSummonCooldownArmSpell;
  assignedSpells?: readonly WxSummonCooldownArmSpell[];
  origin: WxSummonCooldownArmTile;
  targetCell: WxSummonCooldownArmTile;
  occupant: WxSummonCooldownArmOccupant | null;
  opponents: readonly WxSummonCooldownArmOccupant[];
  bomber: WxSummonCooldownArmOccupant;
  bomberSide: "player" | "enemy";
  currentAp?: number;
}): boolean {
  const advertised = armWxSummonCooldown({
    ...args,
    remainingBySpellId: EMPTY_REMAINING,
  });
  if (!advertised) return false;
  const liveRemaining = nextWxSummonCooldownMap(
    EMPTY_REMAINING,
    wxSummonLiveApplyCastCooldownEntry(args.spell),
  );
  return (
    wxSummonLiveApplyCastWouldArmCooldown(args.spell) === false &&
    canExecuteWxSummonCooldownArmCast({
      ...args,
      remainingBySpellId: liveRemaining,
    })
  );
}

export function wxSummonCooldownArmHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
