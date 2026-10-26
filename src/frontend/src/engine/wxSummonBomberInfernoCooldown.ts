/**
 * Summon-bomber `decideSummonBomber` Inferno cooldown vs `findKitSpell`
 * assigned fallback.
 *
 * `SUMMON_KIT.bomber` is `["spell-inferno"]`. Live looks up kit[0]
 * Inferno with `findKitSpell`: available first, then assigned. The
 * JSDoc says that prefers available "so cooldowns are respected" and
 * returns null when the kit spell is not ready. The body still returns
 * `fromAssigned` when the CD-filtered available list misses, so a spent
 * Inferno still detonates. Bomber has no second kit spell to fall
 * through to (unlike hunter melee / archer Slow / guardian Iron Skin).
 *
 * Pack WX filters `availableSpells` by `enemyCooldownsRef` (#972 arms
 * CD 3 after a damage>0 write that Inferno never reaches). WX summon
 * ctx still passes `summonEnemy.spells` for *both* lists, so live
 * available never misses unless a caller actually CD-filters. This
 * sidecar is the available-only lookup that `findKitSpell` documents.
 *
 * Cluster radius / self-detonate stay `#799`. Inferno ticks stay
 * `#856` / `#947`. Pack `pickBestDamageSpell` 0-damage skip stays
 * `#967`. Pack CD arm nested under `damage > 0` stays `#972`. Summon
 * kit AP+range stays `#762`. Do not write `areaRadius: 2` onto Inferno
 * (would rebalance). Catalog bomber `summonUnitDef.ap` is 1, which
 * cannot pay Inferno 5 — unique fire needs `currentAp >= 5`; do not
 * rebalance bomber AP or Inferno cost.
 *
 * Unique vs `#762` / `#799` / `#856` / `#878` / `#947` / `#967` /
 * `#972` / `#978` / `#1054` / `#1081` / `#1087` / `#1090` / `#1091` /
 * `#1095` / `#1096` / `#1098` / `#1123`. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack
 * `findKitSpell` onto `wxSummonBomberInfernoCooldownReadySpell` after
 * those PRs land.
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

export type WxSummonBomberInfernoCooldownSpell =
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
    };

export type WxSummonBomberInfernoCooldownTile = CasterPosition;

export type WxSummonBomberInfernoCooldownOccupant =
  WxSummonBomberInfernoCooldownTile & {
    id: string;
    hp?: number;
    maxHp?: number;
    side?: string;
    isSummon?: boolean;
    summonAI?: string;
    pieceType?: string;
    name?: string;
  };

/**
 * Live `inferArchetype` healer test: `spellType === "heal"` or
 * `healAmount > 0` on assignedSpells (king Rallying Cry still infers
 * healer when `usableByEnemy: false` drops it from availableSpells).
 */
export function isWxSummonBomberInfernoCooldownHealKitSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  return (
    (spell.spellType ?? "damage") === "heal" ||
    Number(spell.healAmount ?? 0) > 0
  );
}

export function wxSummonBomberInfernoCooldownKitIsHealer(
  spells: readonly WxSummonBomberInfernoCooldownSpell[],
): boolean {
  return spells.some((s) => isWxSummonBomberInfernoCooldownHealKitSpell(s));
}

/**
 * Frost leftover identity (`#1081` / `#1090` / `#1054`): `damage > 0` +
 * advertised MP debuff. Pack bishop Poison+Frost still picks Frost.
 */
export function isWxSummonBomberInfernoCooldownBlockedFrostSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  return Boolean(spell.debuffDuration);
}

function isZeroDamageDot(spell: WxSummonBomberInfernoCooldownSpell): boolean {
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
export function isWxSummonBomberInfernoCooldownBlockedPoisonSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) > 3;
}

/**
 * Venom leftover identity (`#856` / `#1123`): 0-damage DoT at Chebyshev 2.
 */
export function isWxSummonBomberInfernoCooldownBlockedVenomSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  if (!isZeroDamageDot(spell)) return false;
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 2;
}

/**
 * Slow leftover identity (`#1098`): 0-upfront-damage MP debuff, no DoT.
 */
export function isWxSummonBomberInfernoCooldownBlockedSlowSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
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
export function isWxSummonBomberInfernoCooldownBlockedBuffSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
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
export function wxSummonBomberInfernoCooldownIsBomberUnit(unit: {
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
export function isWxSummonBomberInfernoCooldownSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
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
  if (wxSummonBomberInfernoCooldownAdvertisedTurns(spell) <= 0) {
    return false;
  }
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 3;
}

/** 0-damage DoT leftover identity (Poison `#1095`/`#1096`, Venom `#856`). */
export function isWxSummonBomberInfernoCooldownBlockedDotSpell(
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  return isZeroDamageDot(spell);
}

/**
 * Live bomber kit for this leftover: assigned Inferno-only (catalog).
 * Queen/king Inferno+heal is `#967` / `#972`. Archer is Poison+Slow.
 * Hunter is Strike+Venom.
 */
export function wxSummonBomberInfernoCooldownKitIsBomber(
  spells: readonly WxSummonBomberInfernoCooldownSpell[],
): boolean {
  if (wxSummonBomberInfernoCooldownKitIsHealer(spells)) return false;
  if (spells.some((s) => isWxSummonBomberInfernoCooldownBlockedFrostSpell(s))) {
    return false;
  }
  if (
    spells.some((s) => isWxSummonBomberInfernoCooldownBlockedPoisonSpell(s))
  ) {
    return false;
  }
  if (spells.some((s) => isWxSummonBomberInfernoCooldownBlockedVenomSpell(s))) {
    return false;
  }
  if (spells.some((s) => isWxSummonBomberInfernoCooldownBlockedSlowSpell(s))) {
    return false;
  }
  return spells.some((s) => isWxSummonBomberInfernoCooldownSpell(s));
}

export function wxSummonBomberInfernoCooldownRange(
  spell: WxSummonBomberInfernoCooldownSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live bomber / execute range half: Chebyshev vs `Number(spell.range)`. */
export function wxSummonBomberInfernoCooldownInRange(
  origin: WxSummonBomberInfernoCooldownTile,
  targetCell: WxSummonBomberInfernoCooldownTile,
  spell: WxSummonBomberInfernoCooldownSpell,
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
export function wxSummonBomberInfernoCooldownAdvertisedTurns(
  spell: WxSummonBomberInfernoCooldownSpell,
): number {
  const turns = Math.floor(Number(spell.cooldown ?? 0));
  return turns > 0 ? turns : 0;
}

/** Same debit `applyCast` uses after `#379` / `#762`. */
export function wxSummonBomberInfernoCooldownApCost(
  spell: WxSummonBomberInfernoCooldownSpell,
): number {
  return resolveCastApCost(Number(spell.apCost ?? 0));
}

export function canAffordWxSummonBomberInfernoCooldownCast(
  currentAp: number,
  spell: WxSummonBomberInfernoCooldownSpell,
): boolean {
  return canAffordCastAp(currentAp, Number(spell.apCost ?? 0));
}

/** Same HP fraction `decideSummonBomber` uses for the low-HP detonate arm. */
export function wxSummonBomberInfernoCooldownHpFrac(unit: {
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
export function wxSummonBomberInfernoCooldownClusterCount(
  center: WxSummonBomberInfernoCooldownTile,
  opponents: readonly WxSummonBomberInfernoCooldownTile[],
): number {
  let count = 0;
  for (const opponent of opponents) {
    if (chebyshevOnBoard(center, opponent) <= AI_KAMIKAZE_BLAST_RADIUS) {
      count += 1;
    }
  }
  return count;
}

export function wxSummonBomberInfernoCooldownDetonateEligible(args: {
  clusterCount: number;
  hpFrac: number;
}): boolean {
  return (
    args.clusterCount >= AI_KAMIKAZE_MIN_TARGETS ||
    args.hpFrac < AI_KAMIKAZE_LOW_HP_PCT
  );
}

/**
 * Live `findKitSpell(kit[0])`: available first, then assigned. Catalog
 * bomber AP 1 cannot pay; callers that omit `currentAp` keep that miss.
 * Spent Inferno (available miss) still returns assigned — the leftover.
 */
export function wxSummonBomberInfernoCooldownLiveFindKitSpell<
  T extends WxSummonBomberInfernoCooldownSpell,
>(
  availableSpells: readonly T[],
  assignedSpells: readonly T[] = availableSpells,
): T | null {
  const fromAvailable = availableSpells.find((s) =>
    isWxSummonBomberInfernoCooldownSpell(s),
  );
  if (fromAvailable) return fromAvailable;
  return (
    assignedSpells.find((s) => isWxSummonBomberInfernoCooldownSpell(s)) ?? null
  );
}

/**
 * Documented `findKitSpell` contract: available only, so CD-filtered
 * misses return null. Centralizes the duplicated "is Inferno ready?"
 * check without changing live `enemyAI.ts` semantics.
 */
export function wxSummonBomberInfernoCooldownReadySpell<
  T extends WxSummonBomberInfernoCooldownSpell,
>(availableSpells: readonly T[]): T | null {
  return (
    availableSpells.find((s) => isWxSummonBomberInfernoCooldownSpell(s)) ?? null
  );
}

/**
 * Live assigned-fallback hole: Inferno is missing from available
 * (CD-filtered) but still present on assigned, so `findKitSpell` still
 * hands `decideSummonBomber` a spent Inferno.
 */
export function wxSummonBomberLiveWouldDetonateAssignedFallback(args: {
  assignedSpells?: readonly WxSummonBomberInfernoCooldownSpell[];
  availableSpells: readonly WxSummonBomberInfernoCooldownSpell[];
}): boolean {
  const kit = args.assignedSpells ?? args.availableSpells;
  const ready = wxSummonBomberInfernoCooldownReadySpell(args.availableSpells);
  if (ready) return false;
  const live = wxSummonBomberInfernoCooldownLiveFindKitSpell(
    args.availableSpells,
    kit,
  );
  return live != null && isWxSummonBomberInfernoCooldownSpell(live);
}

/**
 * Live `decideSummonBomber` detonate arm, minus the assigned fallback:
 * unit infers bomber, kit is Inferno-only, Inferno is in Chebyshev 3 of
 * a living hostile cluster (or low-HP), AP can pay `applyCast`, and the
 * spell is actually in available (CD-ready). Assigned-only spent Inferno
 * returns null so highlight/preview (available) matches execute.
 */
export function pickWxSummonBomberInfernoCooldownSpell<
  T extends WxSummonBomberInfernoCooldownSpell,
>(args: {
  assignedSpells?: readonly T[];
  availableSpells: readonly T[];
  origin: WxSummonBomberInfernoCooldownTile;
  targetCell: WxSummonBomberInfernoCooldownTile;
  opponents: readonly WxSummonBomberInfernoCooldownOccupant[];
  bomber: WxSummonBomberInfernoCooldownOccupant;
  currentAp?: number;
}): T | null {
  if (!wxSummonBomberInfernoCooldownIsBomberUnit(args.bomber)) return null;
  const kit = args.assignedSpells ?? args.availableSpells;
  if (!wxSummonBomberInfernoCooldownKitIsBomber(kit)) return null;
  if (args.opponents.length === 0) return null;
  if (!isAliveCombatant({ hp: args.bomber.hp ?? 0 })) return null;
  if (wxSummonBomberLiveWouldDetonateAssignedFallback(args)) {
    return null;
  }
  const ready = wxSummonBomberInfernoCooldownReadySpell(args.availableSpells);
  if (!ready || !isWxSummonBomberInfernoCooldownSpell(ready)) return null;
  if (!canAffordWxSummonBomberInfernoCooldownCast(args.currentAp ?? 1, ready)) {
    return null;
  }
  if (
    !wxSummonBomberInfernoCooldownInRange(args.origin, args.targetCell, ready)
  ) {
    return null;
  }
  const clusterCount = wxSummonBomberInfernoCooldownClusterCount(
    args.targetCell,
    args.opponents,
  );
  const hpFrac = wxSummonBomberInfernoCooldownHpFrac(args.bomber);
  if (
    !wxSummonBomberInfernoCooldownDetonateEligible({ clusterCount, hpFrac })
  ) {
    return null;
  }
  return ready;
}

export function isWxSummonBomberInfernoCooldownHostile(args: {
  occupant: WxSummonBomberInfernoCooldownOccupant;
  bomberSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.bomberSide;
}

export function canExecuteWxSummonBomberInfernoCooldownCast(args: {
  spell: WxSummonBomberInfernoCooldownSpell;
  assignedSpells?: readonly WxSummonBomberInfernoCooldownSpell[];
  availableSpells?: readonly WxSummonBomberInfernoCooldownSpell[];
  origin: WxSummonBomberInfernoCooldownTile;
  targetCell: WxSummonBomberInfernoCooldownTile;
  occupant: WxSummonBomberInfernoCooldownOccupant | null;
  opponents: readonly WxSummonBomberInfernoCooldownOccupant[];
  bomber: WxSummonBomberInfernoCooldownOccupant;
  bomberSide: "player" | "enemy";
  currentAp?: number;
}): boolean {
  if (!isWxSummonBomberInfernoCooldownSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxSummonBomberInfernoCooldownSpell({
      assignedSpells: args.assignedSpells,
      availableSpells: available,
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
    !wxSummonBomberInfernoCooldownInRange(
      args.origin,
      args.targetCell,
      args.spell,
    )
  ) {
    return false;
  }
  if (
    !canAffordWxSummonBomberInfernoCooldownCast(args.currentAp ?? 1, args.spell)
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
  return isWxSummonBomberInfernoCooldownHostile({
    occupant: args.occupant,
    bomberSide: args.bomberSide,
  });
}

/** Alias so decide and the summon execute branch cannot fork. */
export function shouldDecideWxSummonBomberInfernoCooldownCast(
  args: Parameters<typeof canExecuteWxSummonBomberInfernoCooldownCast>[0],
): boolean {
  return canExecuteWxSummonBomberInfernoCooldownCast(args);
}

export function wxSummonBomberInfernoCooldownHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
