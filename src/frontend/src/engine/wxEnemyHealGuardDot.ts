/**
 * Pack-enemy `decideHealer` backline-guard vs in-range Inferno.
 *
 * Queen `buildEnemyKit` z≥2 is `[spell-inferno, starter-heal]`.
 * `inferArchetype` marks any heal kit as healer (`assignedSpells`,
 * including king Rallying Cry even when `usableByEnemy: false` drops
 * it from WX `availableSpells`). After the wounded-ally branch,
 * `decideHealer` interposes via `backlineGuardCell` whenever
 * `AI_BACKLINE_PROTECT_ENABLED` and a distinct ally + opponent exist.
 * That move returns before `decideCaster` → `pickBestDamageSpell`, so
 * advertised Inferno never fires on a healthy pack. Live
 * `pickBestDamageSpell` also skips `damage: 0`, so even a wired #967
 * DoT decide cannot run until the guard branch is skipped.
 *
 * #1033 is wounded-ally *approach* vs Inferno (Blood Mend range 0
 * cannot reach a distinct ally). #1026 is the same approach vs Frost.
 * #1034 is healthy-pack *guard* vs Frost (`damage > 0` + MP). #985 is
 * wounded-*caster* self-heal when no wounded ally exists. #967 is
 * decideCaster DoT picker once the guard branch is skipped (already
 * standing on the guard tile, no allies). This sidecar is the remaining
 * *guard* leftover: live would walk to the ward/threat line, Inferno is
 * in Chebyshev range of a living hostile, decide Inferno instead of
 * backline-guard.
 *
 * Do not steal queen z=1 Frost (#1034 guard / #1026 approach), rook
 * Iron Skin (#978), Strike / Drain (#762 / #921), Slow, or pack Inferno
 * cooldown (#972). Chebyshev vs `Number(spell.range)` — do not switch
 * to `spellRangeBase` (would rebalance). No LoS (healer skips LoS; WX
 * pack execute does too). No AP (WX does not debit enemy AP). Inferno
 * splash stays catalog `areaRadius` 0 — bomber kamikaze is #799.
 *
 * Unique vs #762 / #799 / #856 / #921 / #947 / #967 / #972 / #978 /
 * #985 / #989 / #1026 / #1033 / #1034. WorldExploration / enemyAI /
 * summonExecutor / targeting / spellEngine / statusEffects left
 * untouched so older open PRs stay merge-clean. Restack the
 * `decideHealer` backline-guard branch onto
 * `pickWxEnemyHealGuardDotSpell` after those PRs land.
 */

import {
  AI_BACKLINE_GUARD_DISTANCE,
  AI_BACKLINE_PROTECT_ENABLED,
  ENEMY_HEAL_ALLY_THRESHOLD_PCT,
} from "../data/gameConstants.ts";
import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyHealGuardDotSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
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
    >
  | {
      id?: string;
      range?: unknown;
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
    };

export type WxEnemyHealGuardDotTile = CasterPosition;

export type WxEnemyHealGuardDotOccupant = WxEnemyHealGuardDotTile & {
  id: string;
  hp?: number;
  maxHp?: number;
  side?: string;
  isSummon?: boolean;
};

/**
 * Range-0 self/ally heal that `decideHealer` uses as `healSpell`
 * (Blood Mend). Drain `healAmount` stays on #921. Do not require
 * `buffStat` — that identity is #989 / #924 / #985. Catalog Blood
 * Mend advertises `buffStat: "chc"`.
 */
export function isWxEnemyHealGuardDotTriggerSpell(
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (Number(spell.healAmount ?? 0) <= 0) return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (spell.debuffStat && spell.debuffDuration) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** Catalog Blood Mend / Rallying Cry never reach a distinct ally. */
export function wxEnemyHealGuardDotTriggerRequiresZeroRange(
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  return enemySpellRange(spell as Pick<SpellConfig, "range">) === 0;
}

/**
 * Inferno leftover identity: `damage === 0` + advertised DoT ticks.
 * Strike has `damage > 0`. Slow is 0-damage without ticks. Frost is
 * `damage > 0` + MP (#1034). Iron Skin stays on #978.
 */
export function isWxEnemyHealGuardDotSpell(
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) > 0) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (spell.debuffStat) return false;
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  const dpt = Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
  const duration = Number(spell.dotDuration ?? 0);
  if (dpt <= 0 || duration <= 0) return false;
  return spell.isDotSpell === true || spell.effectType === "dot";
}

/** Frost leftover identity (#1034 guard / #1026 approach). */
export function isWxEnemyHealGuardDotBlockedFrostSpell(
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "damage") return false;
  if (Number(spell.damage ?? 0) <= 0) return false;
  if (spell.debuffStat !== "mp") return false;
  if (!spell.debuffDuration) return false;
  if (Number(spell.healAmount ?? 0) > 0) return false;
  if (spell.buffStat) return false;
  if (
    Number(spell.dotDamage ?? 0) > 0 ||
    Number(spell.dotDamagePerTurn ?? 0) > 0
  ) {
    return false;
  }
  if (spell.hitsMultiple || spell.aoe) return false;
  if (Math.max(0, Math.floor(Number(spell.areaRadius ?? 0))) > 0) {
    return false;
  }
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
  return true;
}

/** 0-damage buff leftover identity (#978). */
export function isWxEnemyHealGuardDotBlockedBuffSpell(
  spell: WxEnemyHealGuardDotSpell,
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

export function wxEnemyHealGuardDotRange(
  spell: WxEnemyHealGuardDotSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

export function wxEnemyHealGuardDotDpt(
  spell: WxEnemyHealGuardDotSpell,
): number {
  return Number(spell.dotDamagePerTurn ?? spell.dotDamage ?? 0);
}

/** Live picker / WX range half: Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyHealGuardDotInRange(
  origin: WxEnemyHealGuardDotTile,
  targetCell: WxEnemyHealGuardDotTile,
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/** Same `Number(s.damage) > 0` filter live `pickBestDamageSpell` uses. */
export function wxEnemyHealGuardDotLivePickBestDamageSpellSelects(
  spell: WxEnemyHealGuardDotSpell,
): boolean {
  const spellType = spell.spellType ?? "damage";
  const effectType = spell.effectType ?? "damage";
  return (
    Number(spell.damage ?? 0) > 0 &&
    (spellType === "damage" ||
      effectType === "damage" ||
      effectType === "drain")
  );
}

export function wxEnemyHealGuardDotLivePickBestDamageSpell<
  T extends WxEnemyHealGuardDotSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardDotTile;
  targetCell: WxEnemyHealGuardDotTile;
}): T | null {
  const inRange = args.availableSpells.filter(
    (s) =>
      wxEnemyHealGuardDotLivePickBestDamageSpellSelects(s) &&
      wxEnemyHealGuardDotInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    Number(s.damage ?? 0) > Number(best.damage ?? 0) ? s : best,
  );
}

/** Byte-for-byte live `hpFrac`: `hp / max(1, maxHp)` clamped to [0, 1]. */
export function wxEnemyHealGuardDotHpFrac(unit: {
  hp?: number;
  maxHp?: number;
}): number {
  const hp = Number(unit.hp ?? 0);
  const max = Math.max(1, Number(unit.maxHp ?? hp));
  const frac = hp / max;
  if (!Number.isFinite(frac)) return 0;
  return Math.max(0, Math.min(1, frac));
}

export function isWxEnemyHealGuardDotWoundedAlly(args: {
  ally: WxEnemyHealGuardDotOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isAliveCombatant({ hp: args.ally.hp ?? 0 })) return false;
  if (args.casterId && args.ally.id === args.casterId) return false;
  const side = args.ally.side === "player" ? "player" : "enemy";
  if (side !== args.casterSide) return false;
  return wxEnemyHealGuardDotHpFrac(args.ally) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

export function wxEnemyHealGuardDotCasterIsWounded(caster: {
  hp?: number;
  maxHp?: number;
}): boolean {
  if (!isAliveCombatant({ hp: caster.hp ?? 0 })) return false;
  return wxEnemyHealGuardDotHpFrac(caster) < ENEMY_HEAL_ALLY_THRESHOLD_PCT;
}

export function pickWxEnemyHealGuardDotTriggerSpell<
  T extends WxEnemyHealGuardDotSpell,
>(availableSpells: readonly T[]): T | null {
  const found = availableSpells.find(
    (s) =>
      isWxEnemyHealGuardDotTriggerSpell(s) &&
      wxEnemyHealGuardDotTriggerRequiresZeroRange(s),
  );
  return found ?? null;
}

/**
 * Live `decideHealer` first healSpell: `spellType === "heal"` or
 * `healAmount > 0`. Drain can win this race — do not skip it.
 */
export function wxEnemyHealGuardDotLiveHealSpell<
  T extends WxEnemyHealGuardDotSpell,
>(availableSpells: readonly T[]): T | undefined {
  return availableSpells.find(
    (s) => s.spellType === "heal" || Number(s.healAmount ?? 0) > 0,
  );
}

export function wxEnemyHealGuardDotLiveWoundedAlly<
  T extends WxEnemyHealGuardDotOccupant,
>(args: {
  allies: readonly T[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | undefined {
  const wounded = args.allies
    .filter((a) =>
      isWxEnemyHealGuardDotWoundedAlly({
        ally: a,
        casterSide: args.casterSide,
        casterId: args.casterId,
      }),
    )
    .sort(
      (a, b) => wxEnemyHealGuardDotHpFrac(a) - wxEnemyHealGuardDotHpFrac(b),
    );
  return wounded[0];
}

/**
 * Live wounded-ally heal / approach: when `healSpell` exists and a
 * wounded ally is in or out of `Number(range)`. Range-0 Blood Mend
 * always approaches a distinct ally — that hole is #1026 / #1033.
 */
export function wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args: {
  availableSpells: readonly WxEnemyHealGuardDotSpell[];
  origin: WxEnemyHealGuardDotTile;
  allies: readonly WxEnemyHealGuardDotOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  const healSpell = wxEnemyHealGuardDotLiveHealSpell(args.availableSpells);
  const wounded = wxEnemyHealGuardDotLiveWoundedAlly({
    allies: args.allies,
    casterSide: args.casterSide,
    casterId: args.casterId,
  });
  return Boolean(healSpell && wounded);
}

/**
 * Ideal backline-guard cell: ward stepped `AI_BACKLINE_GUARD_DISTANCE`
 * toward the first opponent. Mirrors `backlineGuardCell` direction
 * math; tests use a free reachable tile so live would actually move.
 */
export function wxEnemyHealGuardDotIdealCell(
  ward: WxEnemyHealGuardDotTile,
  threat: WxEnemyHealGuardDotTile,
): WxEnemyHealGuardDotTile {
  const dx = threat.x - ward.x;
  const dy = threat.y - ward.y;
  const sx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const sy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
  return {
    x: ward.x + sx * AI_BACKLINE_GUARD_DISTANCE,
    y: ward.y + sy * AI_BACKLINE_GUARD_DISTANCE,
  };
}

/**
 * Live `decideHealer` backline-guard return: no wounded-ally heal /
 * approach, protect enabled, a ward + threat exist, and the ideal
 * guard cell is not the origin (already standing there falls through
 * to `decideCaster` — #967 / #989).
 */
export function wxEnemyHealLiveWouldBacklineGuardForDot(args: {
  availableSpells: readonly WxEnemyHealGuardDotSpell[];
  origin: WxEnemyHealGuardDotTile;
  allies: readonly WxEnemyHealGuardDotOccupant[];
  opponents: readonly WxEnemyHealGuardDotOccupant[];
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!AI_BACKLINE_PROTECT_ENABLED) return false;
  if (args.opponents.length === 0 || args.allies.length === 0) return false;
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const ward = args.allies.find((a) => a.isSummon !== true) ?? args.allies[0];
  const threat = args.opponents[0];
  if (!ward || !threat) return false;
  const guard = wxEnemyHealGuardDotIdealCell(ward, threat);
  return guard.x !== args.origin.x || guard.y !== args.origin.y;
}

function wxEnemyHealGuardDotBuffLeftoverInRange<
  T extends WxEnemyHealGuardDotSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardDotTile;
  targetCell: WxEnemyHealGuardDotTile;
}): boolean {
  return args.availableSpells.some(
    (s) =>
      isWxEnemyHealGuardDotBlockedBuffSpell(s) &&
      wxEnemyHealGuardDotInRange(args.origin, args.targetCell, s),
  );
}

/**
 * #985 leftover: live ally path did not fire, first healSpell is a
 * range-0 self/ally heal, caster is wounded. Do not replace that
 * self-heal with Inferno.
 */
export function wxEnemyHealGuardDotYieldsToWoundedCasterSelfHeal(args: {
  availableSpells: readonly WxEnemyHealGuardDotSpell[];
  origin: WxEnemyHealGuardDotTile;
  allies: readonly WxEnemyHealGuardDotOccupant[];
  caster: WxEnemyHealGuardDotOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (wxEnemyHealLiveWouldHealOrApproachWoundedAlly(args)) return false;
  const healSpell = wxEnemyHealGuardDotLiveHealSpell(args.availableSpells);
  if (!healSpell || !isWxEnemyHealGuardDotTriggerSpell(healSpell)) {
    return false;
  }
  if (!wxEnemyHealGuardDotTriggerRequiresZeroRange(healSpell)) return false;
  return wxEnemyHealGuardDotCasterIsWounded(args.caster);
}

/**
 * Unique leftover: when live would backline-guard and Inferno is in
 * range of `targetCell`, pick that Inferno. Returns null when live
 * damage>0 Frost-only kits still belong to #1034, when Iron Skin
 * leftovers already own the dest, when a wounded ally still drives
 * approach (#1033), or when #985 owns wounded-caster self-heal.
 * Frost + Inferno together: #1034 already yields to this file, so
 * Inferno wins.
 */
export function pickWxEnemyHealGuardDotSpell<
  T extends WxEnemyHealGuardDotSpell,
>(args: {
  availableSpells: readonly T[];
  origin: WxEnemyHealGuardDotTile;
  targetCell: WxEnemyHealGuardDotTile;
  allies: readonly WxEnemyHealGuardDotOccupant[];
  opponents: readonly WxEnemyHealGuardDotOccupant[];
  caster: WxEnemyHealGuardDotOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): T | null {
  if (
    wxEnemyHealGuardDotYieldsToWoundedCasterSelfHeal({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
      caster: args.caster,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  if (
    !wxEnemyHealLiveWouldBacklineGuardForDot({
      availableSpells: args.availableSpells,
      origin: args.origin,
      allies: args.allies,
      opponents: args.opponents,
      casterSide: args.casterSide,
      casterId: args.casterId,
    })
  ) {
    return null;
  }
  if (wxEnemyHealGuardDotBuffLeftoverInRange(args)) return null;
  const inRange = args.availableSpells.filter(
    (s) =>
      isWxEnemyHealGuardDotSpell(s) &&
      wxEnemyHealGuardDotInRange(args.origin, args.targetCell, s),
  );
  if (inRange.length === 0) return null;
  return inRange.reduce((best, s) =>
    wxEnemyHealGuardDotDpt(s) > wxEnemyHealGuardDotDpt(best) ? s : best,
  );
}

export function isWxEnemyHealGuardDotHostile(args: {
  occupant: WxEnemyHealGuardDotOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

export function canExecuteWxEnemyHealGuardDotCast(args: {
  spell: WxEnemyHealGuardDotSpell;
  availableSpells?: readonly WxEnemyHealGuardDotSpell[];
  origin: WxEnemyHealGuardDotTile;
  targetCell: WxEnemyHealGuardDotTile;
  occupant: WxEnemyHealGuardDotOccupant | null;
  allies: readonly WxEnemyHealGuardDotOccupant[];
  opponents: readonly WxEnemyHealGuardDotOccupant[];
  caster: WxEnemyHealGuardDotOccupant;
  casterSide: "player" | "enemy";
  casterId?: string;
}): boolean {
  if (!isWxEnemyHealGuardDotSpell(args.spell)) return false;
  const available = args.availableSpells ?? [args.spell];
  if (
    pickWxEnemyHealGuardDotSpell({
      availableSpells: available,
      origin: args.origin,
      targetCell: args.targetCell,
      allies: args.allies,
      opponents: args.opponents,
      caster: args.caster,
      casterSide: args.casterSide,
      casterId: args.casterId,
    }) == null
  ) {
    return false;
  }
  if (!wxEnemyHealGuardDotInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyHealGuardDotHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide and the WX damage branch cannot fork. */
export function shouldDecideWxEnemyHealGuardDotCast(
  args: Parameters<typeof canExecuteWxEnemyHealGuardDotCast>[0],
): boolean {
  return canExecuteWxEnemyHealGuardDotCast(args);
}

export function wxEnemyHealGuardDotHighlightedTargetIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}
