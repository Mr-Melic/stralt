/**
 * WorldExploration pack-enemy 0-damage DoT cooldown vs the
 * damage-then-stop apply arm.
 *
 * Inferno (`spell-inferno`) advertises `cooldown: 3` with `damage: 0`.
 * After dest commit, WX only writes `enemyCooldownsRef` inside:
 *   1. inRange && (spellType damage|drain) && Number(damage) > 0
 *      (~16640, nested under the ~16459 `spellDmg > 0` gate)
 *   2. else if inRange && spellType === "heal" && Number(range) === 0
 *   3. else if inRange && debuffStat && debuffDuration
 *
 * There is no fourth DoT arm. Inferno never arms CD even after #947
 * ticks and #967 decide land. Poison Arrow / Venom Strike currently
 * have no catalog cooldown; this helper still arms if they gain one.
 *
 * Unique vs #947 execute ticks / #967 decide picker / #762 damage CD /
 * #757 heal CD. WorldExploration / enemyAI / summonExecutor /
 * targeting / spellEngine / statusEffects left untouched so older
 * open PRs stay merge-clean. Restack the WX apply arm onto
 * `armWxEnemyDotCooldown` after those PRs land. Do not require
 * `spell.name`. Do not steal Strike / Frost / Drain / heal / Slow
 * cooldown writes.
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { isAliveCombatant } from "./battleSetup.ts";
import {
  type CasterPosition,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

export type WxEnemyDotCooldownSpell =
  | Pick<
      SpellConfig,
      | "id"
      | "range"
      | "spellType"
      | "damage"
      | "healAmount"
      | "buffStat"
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
      spellType?: string | null;
      damage?: unknown;
      healAmount?: unknown;
      buffStat?: string | null;
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

export type WxEnemyDotCooldownTile = CasterPosition;

export type WxEnemyDotCooldownOccupant = WxEnemyDotCooldownTile & {
  id: string;
  hp?: number;
  side?: string;
};

export type WxEnemyDotLiveCooldownArm = "damage" | "heal" | "debuff";

export type WxEnemyDotCooldownEntry = {
  spellId: string;
  turns: number;
};

/**
 * Catalog 0-damage DoT kits (Poison Arrow / Venom Strike / pack Inferno).
 * Same identity as #947 execute / #967 decide. Do not require `spell.name`.
 */
export function isWxEnemyDotCooldownSpell(
  spell: WxEnemyDotCooldownSpell,
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

/** Same `Number(spell.range)` the WX `inRange` Chebyshev gate uses. */
export function wxEnemyDotCooldownRange(
  spell: WxEnemyDotCooldownSpell,
): number {
  return enemySpellRange(spell as Pick<SpellConfig, "range">);
}

/** Live WX `inRange` is Chebyshev vs `Number(spell.range)`. No LoS. */
export function wxEnemyDotCooldownInRange(
  origin: WxEnemyDotCooldownTile,
  targetCell: WxEnemyDotCooldownTile,
  spell: WxEnemyDotCooldownSpell,
): boolean {
  return enemyCastRangeOk(
    origin,
    targetCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Advertised cooldown turns. Live WX writes `chosenSpell.cooldown`
 * when `cooldown && cooldown > 0` — floor of Number, 0 when missing.
 */
export function wxEnemyDotAdvertisedCooldownTurns(
  spell: WxEnemyDotCooldownSpell,
): number {
  const turns = Math.floor(Number(spell.cooldown ?? 0));
  return turns > 0 ? turns : 0;
}

/** 0-damage DoT that advertises a cooldown (Inferno today). */
export function wxEnemyDotNeedsCooldownArm(
  spell: WxEnemyDotCooldownSpell,
): boolean {
  return (
    isWxEnemyDotCooldownSpell(spell) &&
    wxEnemyDotAdvertisedCooldownTurns(spell) > 0
  );
}

/**
 * Which live WX apply arm would write `enemyCooldownsRef`. Inferno
 * matches none of these, so live never arms CD 3.
 */
export function wxEnemyDotLiveCooldownArm(
  spell: WxEnemyDotCooldownSpell,
): WxEnemyDotLiveCooldownArm | null {
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage ?? 0) > 0
  ) {
    return "damage";
  }
  if (spellType === "heal" && wxEnemyDotCooldownRange(spell) === 0) {
    return "heal";
  }
  if (spell.debuffStat && spell.debuffDuration) {
    return "debuff";
  }
  return null;
}

export function wxEnemyDotLiveWouldArmCooldown(
  spell: WxEnemyDotCooldownSpell,
): boolean {
  return (
    wxEnemyDotAdvertisedCooldownTurns(spell) > 0 &&
    wxEnemyDotLiveCooldownArm(spell) != null
  );
}

export function wxEnemyDotAdvertisedWouldArmCooldown(
  spell: WxEnemyDotCooldownSpell,
): boolean {
  return wxEnemyDotNeedsCooldownArm(spell);
}

export function isWxEnemyDotCooldownHostile(args: {
  occupant: WxEnemyDotCooldownOccupant;
  casterSide: "player" | "enemy";
}): boolean {
  if (!isAliveCombatant({ hp: args.occupant.hp ?? 0 })) return false;
  const side = args.occupant.side === "player" ? "player" : "enemy";
  return side !== args.casterSide;
}

/**
 * Arm only after a decided legal 0-damage DoT (in-range living hostile).
 * No LoS, no AP — WX does not debit enemy AP here.
 */
export function canArmWxEnemyDotCooldown(args: {
  spell: WxEnemyDotCooldownSpell;
  origin: WxEnemyDotCooldownTile;
  targetCell: WxEnemyDotCooldownTile;
  occupant: WxEnemyDotCooldownOccupant | null;
  casterSide: "player" | "enemy";
}): boolean {
  if (!wxEnemyDotNeedsCooldownArm(args.spell)) return false;
  if (!args.spell.id) return false;
  if (!wxEnemyDotCooldownInRange(args.origin, args.targetCell, args.spell)) {
    return false;
  }
  if (!args.occupant) return false;
  if (
    args.occupant.x !== args.targetCell.x ||
    args.occupant.y !== args.targetCell.y
  ) {
    return false;
  }
  return isWxEnemyDotCooldownHostile({
    occupant: args.occupant,
    casterSide: args.casterSide,
  });
}

/** Alias so decide/execute restack cannot fork the CD write. */
export function shouldArmWxEnemyDotCooldown(
  args: Parameters<typeof canArmWxEnemyDotCooldown>[0],
): boolean {
  return canArmWxEnemyDotCooldown(args);
}

/**
 * Advertised CD entry. Live nested-under-damage write returns null for
 * Inferno even when the dest is legal.
 */
export function armWxEnemyDotCooldown(args: {
  spell: WxEnemyDotCooldownSpell;
  origin: WxEnemyDotCooldownTile;
  targetCell: WxEnemyDotCooldownTile;
  occupant: WxEnemyDotCooldownOccupant | null;
  casterSide: "player" | "enemy";
}): WxEnemyDotCooldownEntry | null {
  if (!canArmWxEnemyDotCooldown(args) || !args.spell.id) return null;
  return {
    spellId: args.spell.id,
    turns: wxEnemyDotAdvertisedCooldownTurns(args.spell),
  };
}

/** Live WX payload — Inferno never reaches the nested `cdm.set`. */
export function wxEnemyDotLiveCooldownEntry(
  spell: WxEnemyDotCooldownSpell,
): WxEnemyDotCooldownEntry | null {
  if (!spell.id) return null;
  if (!wxEnemyDotLiveWouldArmCooldown(spell)) return null;
  return {
    spellId: spell.id,
    turns: wxEnemyDotAdvertisedCooldownTurns(spell),
  };
}

export function nextWxEnemyDotCooldownMap(
  current: ReadonlyMap<string, number>,
  entry: WxEnemyDotCooldownEntry | null,
): Map<string, number> {
  const next = new Map(current);
  if (entry) next.set(entry.spellId, entry.turns);
  return next;
}
