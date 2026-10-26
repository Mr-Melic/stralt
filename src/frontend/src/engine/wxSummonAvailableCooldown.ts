/**
 * WX summon `availableSpells` unfiltered vs pack CD filter.
 *
 * Pack enemy ctx filters assigned by `enemyCooldownsRef` remaining
 * (`(map.get(id) ?? 0) <= 0`) and `usableByEnemy !== false`. WX summon
 * ctx still passes `summonEnemy.spells` for *both* lists, so Inferno
 * never leaves available even after `findKitSpell` stops falling back
 * to assigned (#1150). Catalog Inferno is the only summon-kit row with
 * `cooldown: 3`. Poison / Venom / Slow / Strike / heal / Iron Skin
 * advertise 0.
 *
 * Cluster radius / self-detonate stay `#799`. Inferno ticks stay
 * `#856` / `#947`. Pack Inferno CD arm nested under `damage > 0`
 * stays `#972`. Assigned-fallback `findKitSpell` stays `#1150`. Summon
 * kit AP+range stays `#762`. Do not write `areaRadius: 2` onto Inferno
 * (would rebalance). Catalog bomber `summonUnitDef.ap` is 1, which
 * cannot pay Inferno 5 — unique fire needs `currentAp >= 5`; do not
 * rebalance bomber AP or Inferno cost. Do not drop Rallying Cry via
 * `usableByEnemy` (player-side wisp kit; pack-only).
 *
 * Unique vs `#762` / `#799` / `#856` / `#878` / `#947` / `#967` /
 * `#972` / `#978` / `#1054` / `#1081` / `#1087` / `#1090` / `#1091` /
 * `#1095` / `#1096` / `#1098` / `#1123` / `#1150`. WorldExploration /
 * enemyAI / summonExecutor / targeting / spellEngine / statusEffects
 * left untouched so older open PRs stay merge-clean. Restack the WX
 * summon ctx onto `wxSummonAvailableSpellsFromAssigned` after those
 * PRs land.
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

export type WxSummonAvailableCooldownSpell =
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

export type WxSummonAvailableCooldownTile = CasterPosition;

export type WxSummonAvailableCooldownOccupant =
  WxSummonAvailableCooldownTile & {
    id: string;
    hp?: number;
    maxHp?: number;
    side?: string;
    isSummon?: boolean;
    summonAI?: string;
    pieceType?: string;
    name?: string;
  };

export type WxSummonAvailableCooldownRemaining = ReadonlyMap<string, number>;

const EMPTY_REMAINING: WxSummonAvailableCooldownRemaining = new Map();

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxSummonAvailableCooldownHealKitSpell(
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonAvailableCooldownKitIsHealer(
  spells: readonly WxSummonAvailableCooldownSpell[],
): boolean {
  return spells.some((s) => isWxSummonAvailableCooldownHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonAvailableCooldownBlockedFrostSpell(
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

function isZeroDamageDot(spell: WxSummonAvailableCooldownSpell): boolean {
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
export function isWxSummonAvailableCooldownBlockedPoisonSpell(
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) > 3;
}

/**
 * Venom leftover identity (`#856` / `#1123`): 0-damage DoT at Chebyshev 2.
 */
export function isWxSummonAvailableCooldownBlockedVenomSpell(
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 2;
}

/**
 * Slow leftover identity (`#1098`): 0-upfront-damage MP debuff, no DoT.
 */
export function isWxSummonAvailableCooldownBlockedSlowSpell(
  spell: WxSummonAvailableCooldownSpell,
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
export function isWxSummonAvailableCooldownBlockedBuffSpell(
  spell: WxSummonAvailableCooldownSpell,
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
export function wxSummonAvailableCooldownIsBomberUnit(unit: {
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
export function isWxSummonAvailableCooldownSpell(
  spell: WxSummonAvailableCooldownSpell,
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
  if (wxSummonAvailableCooldownAdvertisedTurns(spell) <= 0) {
    return false;
  }
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 3;
}

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Venom `#856`). */
export function isWxSummonAvailableCooldownBlockedDotSpell(
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  return isZeroDamageDot(spell);
}

/**
 * Live bomber kit for this leftover: assigned Inferno-only (catalog).
 * Queen/king Inferno+heal is `#967` / `#972`. Archer is Poison+Slow.
 * Hunter is Strike+Venom.
 */
export function wxSummonAvailableCooldownKitIsBomber(
  spells: readonly WxSummonAvailableCooldownSpell[],
): boolean {
  if (wxSummonAvailableCooldownKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonAvailableCooldownBlockedFrostSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonAvailableCooldownBlockedPoisonSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonAvailableCooldownBlockedVenomSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonAvailableCooldownBlockedSlowSpell(s))) {
    return false;
  }
  return spells.some((s) => isWxSummonAvailableCooldownSpell(s));
}

export function wxSummonAvailableCooldownRange(
  spell: WxSummonAvailableCooldownSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live bomber / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonAvailableCooldownInRange(
  origin: WxSummonAvailableCooldownTile,
  targetCell: WxSummonAvailableCooldownTile,
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Advertised cooldown turns. Live WX pack writes `chosenSpell.cooldown`
 * when `cooldown && cooldown > 0` — floor of Number, 0 when missing.
 */
export function wxSummonAvailableCooldownAdvertisedTurns(
  spell: WxSummonAvailableCooldownSpell,
): number {
  const turns = Math.floor(Number(spell.cooldown ?? 0));
  return turns > 0 ? turns : 0;
}

/**
 * Pack `enemyCooldownsRef` remaining for one spell id. Missing key and
 * non-positive remaining are ready (`(map.get(id) ?? 0) <= 0`).
 */
export function wxSummonAvailableCooldownRemaining(
  spellId: string | undefined,
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null,
): number {
  if (!spellId) return 0;
  const turns = Math.floor(Number(remainingBySpellId?.get(spellId) ?? 0));
  return turns > 0 ? turns : 0;
}

/**
 * Cooldown half of the pack available filter. Does **not** drop
 * `usableByEnemy === false` (Rallying Cry on a player-side wisp).
 */
export function wxSummonSpellIsCooldownReady(
  spell: WxSummonAvailableCooldownSpell,
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null,
): boolean {
  return wxSummonAvailableCooldownRemaining(spell.id, remainingBySpellId) <= 0;
}

/**
 * Centralized summon available list: assigned minus CD-remaining rows.
 * Same remaining check pack uses; usableByEnemy stays pack-only.
 */
export function wxSummonAvailableSpellsFromAssigned<
  T extends WxSummonAvailableCooldownSpell,
>(
  assigned: readonly T[],
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null,
): T[] {
  return assigned.filter((s) =>
    wxSummonSpellIsCooldownReady(s, remainingBySpellId),
  );
}

/**
 * Live WX summon ctx: `availableSpells: summonEnemy.spells ?? []` —
 * a copy of assigned, no CD map.
 */
export function wxSummonLiveAvailableSpells<
  T extends WxSummonAvailableCooldownSpell,
>(assigned: readonly T[]): T[] {
  return assigned.slice();
}

/**
 * Live hole: Inferno is still in unfiltered available while pack-style
 * remaining > 0. Distinct from `#1150` (available already misses,
 * assigned still has it).
 */
export function wxSummonLiveWouldKeepSpentInAvailable(args: {
  assignedSpells: readonly WxSummonAvailableCooldownSpell[];
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null;
}): boolean {
  const live = wxSummonLiveAvailableSpells(args.assignedSpells);
  const filtered = wxSummonAvailableSpellsFromAssigned(
    args.assignedSpells,
    args.remainingBySpellId,
  );
  return (
    live.some((s) => isWxSummonAvailableCooldownSpell(s)) &&
    !filtered.some((s) => isWxSummonAvailableCooldownSpell(s))
  );
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function wxSummonAvailableCooldownApCost(
  spell: WxSummonAvailableCooldownSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordWxSummonAvailableCooldownCast(
  currentAp: number,
  spell: WxSummonAvailableCooldownSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/** Same HP fraction `decideSummonBomber` uses for the low-HP detonate arm. */
export function wxSummonAvailableCooldownHpFrac(unit: {
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
export function wxSummonAvailableCooldownClusterCount(
  center: WxSummonAvailableCooldownTile,
  opponents: readonly WxSummonAvailableCooldownTile[],
): number {
  let count = 0;
  for (const opponent of opponents) {
    if (chebyshevOnBoard(center, opponent) <= AI_KAMIKAZE_BLAST_RADIUS) {
      count += 1;
    }
  }
  return count;
}

export function wxSummonAvailableCooldownDetonateEligible(args: {
  clusterCount: number;
  hpFrac: number;
}): boolean {
  return (
    args.clusterCount >= AI_KAMIKAZE_MIN_TARGETS ||
    args.hpFrac < AI_KAMIKAZE_LOW_HP_PCT
  );
}

/**
 * Ready Inferno after the pack CD filter. Spent remaining drops the
 * row even when live unfiltered available still has it. Assigned-only
 * miss (`#1150`) is also empty here — do not fall back to assigned.
 */
export function wxSummonAvailableCooldownReadySpell<
  T extends WxSummonAvailableCooldownSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells?: readonly T[];
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null;
}): T | null {
  const assigned = args.assignedSpells ?? args.availableSpells ?? [];
  const filtered = wxSummonAvailableSpellsFromAssigned(
    assigned,
    args.remainingBySpellId ?? EMPTY_REMAINING,
  );
  const ready =
    filtered.find((s) => isWxSummonAvailableCooldownSpell(s)) ?? null;
  if (!ready) return null;
  if (args.availableSpells) {
    const stillListed = args.availableSpells.some(
      (s) => s.id === ready.id && isWxSummonAvailableCooldownSpell(s),
    );
    if (!stillListed) return null;
  }
  return ready;
}

/**
 * Live `decideSummonBomber` detonate arm, minus the unfiltered
 * available hole: unit infers bomber, kit is Inferno-only, Inferno is
 * in Chebyshev 3 of a living hostile cluster (or low-HP), AP can pay
 * `applyCast`, and pack-style remaining is 0. Spent Inferno still in
 * live available returns null so highlight/preview matches execute.
 */
export function pickWxSummonAvailableCooldownSpell<
  T extends WxSummonAvailableCooldownSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells?: readonly T[];
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null;
  origin: WxSummonAvailableCooldownTile;
  targetCell: WxSummonAvailableCooldownTile;
  opponents: readonly WxSummonAvailableCooldownOccupant[];
  bomber: WxSummonAvailableCooldownOccupant;
  currentAp?: number;
}): T | null {
  if (!wxSummonAvailableCooldownIsBomberUnit(args.bomber)) return null;
  const kit = args.assignedSpells ?? args.availableSpells ?? [];
  if (!wxSummonAvailableCooldownKitIsBomber(kit)) return null;
  if (args.opponents.length === 0) return null;
  if (!isAliveCombatant({ hp: args.bomber.hp ?? 0 })) return null;
  if (
    wxSummonLiveWouldKeepSpentInAvailable({
      assignedSpells: kit,
      remainingBySpellId: args.remainingBySpellId,
    })
  ) {
    return null;
  }
  const ready = wxSummonAvailableCooldownReadySpell(args);
  if (!ready || !isWxSummonAvailableCooldownSpell(ready)) return null;
  if (!canAffordWxSummonAvailableCooldownCast(args.currentAp ?? 1, ready)) {
    return null;
  }
  if (!wxSummonAvailableCooldownInRange(args.origin, args.targetCell, ready)) {
    return null;
  }
  const clusterCount = wxSummonAvailableCooldownClusterCount(
    args.targetCell,
    args.opponents,
  );
  const hpFrac = wxSummonAvailableCooldownHpFrac(args.bomber);
  if (!wxSummonAvailableCooldownDetonateEligible({ clusterCount, hpFrac })) {
    return null;
  }
  return ready;
}

export function isWxSummonAvailableCooldownHostile(args: {
  occupant: WxSummonAvailableCooldownOccupant;
  bomberSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.bomberSide;
}

export function canExecuteWxSummonAvailableCooldownCast(args: {
  spell: WxSummonAvailableCooldownSpell;
  assignedSpells?: readonly WxSummonAvailableCooldownSpell[];
  availableSpells?: readonly WxSummonAvailableCooldownSpell[];
  remainingBySpellId?: WxSummonAvailableCooldownRemaining | null;
  origin: WxSummonAvailableCooldownTile;
  targetCell: WxSummonAvailableCooldownTile;
  occupant: WxSummonAvailableCooldownOccupant | null;
  opponents: readonly WxSummonAvailableCooldownOccupant[];
  bomber: WxSummonAvailableCooldownOccupant;
  bomberSide: "player" | "enemy";
  currentAp?: number;
}): boolean {
  if (!isWxSummonAvailableCooldownSpell(args.spell)) return false;
  const kit = args.assignedSpells ?? args.availableSpells ?? [args.spell];
  if (
    pickWxSummonAvailableCooldownSpell({
      assignedSpells: kit,
      availableSpells: args.availableSpells ?? kit,
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
  if (
    !wxSummonAvailableCooldownInRange(args.origin, args.targetCell, args.spell)
  ) {
    return false;
  }
  if (
    !canAffordWxSummonAvailableCooldownCast(args.currentAp ?? 1, args.spell)
  ) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxSummonAvailableCooldownHostile({
    occupant: args.occupant,
    bomberSide: args.bomberSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonAvailableCooldownCast(
  args: Parameters<typeof canExecuteWxSummonAvailableCooldownCast>[0],
): boolean {
  return canExecuteWxSummonAvailableCooldownCast(args);
}

export function wxSummonAvailableCooldownHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
