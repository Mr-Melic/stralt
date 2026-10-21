/**
 * Boss kit heal+buff decide vs WorldExploration boss apply.
 *
 * `pickBossKitSpell` returns the first off-cooldown kit id. Every
 * `decide*Action` then sends `{ type: "spell", targetX/Y: player }` with
 * an empty cooldown Map, so the first pool id wins every turn.
 *
 * Twin Monarchs phase 1 and phase 2 both start with `spell-rallying-cry`.
 * Catalog Rallying Cry is `spellType: "heal"`, `healAmount: 20`,
 * `buffStat: "chc"`, `buffModifier: 0.15`, `buffDuration: 2`, `range: 0`,
 * `targetType: "self"`. The WX boss apply block then:
 *   1. summon when `isSummon`
 *   2. damage / drain only when `Number(damage) > 0`
 *   3. heal when `spellType === "heal"`
 *   4. `debuffStat` + `debuffDuration`
 *   5. DoT fields
 *   6. else-if spellType is NOT damage|drain|heal AND no debuff/dot
 *      AND targetType self|ally → buff using **debuffStat ?? "atk"**
 * Heal (3) runs. The buff else-if never runs because `spellType` is
 * `"heal"`. A decided kit Rallying Cry therefore ends the boss turn with
 * the advertised 20 HP and no CHC +15%. Player `resolvePlayerCast` already
 * skips the same CHC after self-heal (#692); this module is the boss-kit
 * execute gate.
 *
 * Self range 0 cannot use the decide action's player cell as the
 * Chebyshev dest (that would make every legal Rallying Cry fail). Apply
 * cell is the boss tile. Do not switch to `spellRangeBase` (would
 * rebalance). Do not steal Strike damage, Slow debuff, Iron Skin buff
 * (#843), Inferno DoT, Swap, Mark, Mirror, or Barrier. Do not require
 * `spell.name` (metadata only). WorldExploration / useBossAI / targeting
 * / spellEngine left untouched so older open PRs stay merge-clean
 * (#550 kit heal-after-buff, #692 player CHC, #843 kit buff-only,
 * #850 Swap, #851 Mark, #852 Mirror).
 */

import type { SpellConfig } from "../types/gameTypes.ts";
import { enemyCastRangeOk } from "./targeting.ts";

export type BossKitHealBuffSpell =
  | Pick<
      SpellConfig,
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
      | "isSummon"
      | "isSwap"
      | "isMark"
      | "isMirror"
      | "isBarrier"
    >
  | {
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
      isSummon?: boolean | null;
      isSwap?: boolean | null;
      isMark?: boolean | null;
      isMirror?: boolean | null;
      isBarrier?: boolean | null;
    };

export type BossKitTile = { x: number; y: number };

export type BossKitHealBuffFields = {
  stat: string;
  modifier: number;
  duration: number;
};

export type BossKitHealBuffExecute = {
  tile: BossKitTile;
  heal: number;
  buff: BossKitHealBuffFields;
};

export type WxBossKitApplyKind =
  | "summon"
  | "damage"
  | "heal"
  | "debuff"
  | "dot"
  | "buff";

/**
 * Catalog heal that also advertises a buff. Do not require
 * `effectType === "heal"` (name/category heuristic). Iron Skin / Enrage
 * stay on #843 (`spellType: "damage"`). Heal-only kits are not this gate.
 */
export function isBossKitHealBuffExecuteSpell(
  spell: BossKitHealBuffSpell,
): boolean {
  if ((spell.spellType ?? "damage") !== "heal") return false;
  if (!spell.healAmount || Number(spell.healAmount) <= 0) return false;
  if (!spell.buffStat || !spell.buffDuration) return false;
  const targetType = spell.targetType ?? "enemy";
  if (targetType !== "self" && targetType !== "ally") return false;
  if (spell.isSummon || spell.isSwap || spell.isMark || spell.isMirror) {
    return false;
  }
  if (spell.isBarrier) return false;
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
 * Self heal+buff shields the caster tile. Decide still aims `targetX/Y`
 * at the player; using that cell vs range 0 would skip every legal cast.
 */
export function bossKitHealBuffApplyCell(
  spell: BossKitHealBuffSpell,
  origin: BossKitTile,
  targetCell: BossKitTile,
): BossKitTile {
  if (isBossKitHealBuffExecuteSpell(spell) || spell.targetType === "self") {
    return { x: origin.x, y: origin.y };
  }
  return { x: targetCell.x, y: targetCell.y };
}

/** Same Chebyshev vs `Number(spell.range)` the WX enemy apply uses. */
export function bossKitHealBuffInRange(
  origin: BossKitTile,
  targetCell: BossKitTile,
  spell: BossKitHealBuffSpell,
): boolean {
  const applyCell = bossKitHealBuffApplyCell(spell, origin, targetCell);
  return enemyCastRangeOk(
    origin,
    applyCell,
    spell as Pick<SpellConfig, "range">,
  );
}

/**
 * Live WX boss kit apply kinds. Rallying Cry yields `["heal"]` — there is
 * no second buff arm after a heal.
 */
export function wxBossKitApplyKinds(
  spell: BossKitHealBuffSpell,
): WxBossKitApplyKind[] {
  if (spell.isSummon) return ["summon"];
  const kinds: WxBossKitApplyKind[] = [];
  const spellType = spell.spellType ?? "damage";
  if (
    (spellType === "damage" || spellType === "drain") &&
    Number(spell.damage) > 0
  ) {
    kinds.push("damage");
  }
  if (spellType === "heal" && spell.healAmount) {
    kinds.push("heal");
  }
  if (spell.debuffStat && spell.debuffDuration) {
    kinds.push("debuff");
  }
  if ((spell.dotDamagePerTurn ?? spell.dotDamage) && spell.dotDuration) {
    kinds.push("dot");
  }
  if (
    spellType !== "damage" &&
    spellType !== "drain" &&
    spellType !== "heal" &&
    !spell.debuffStat &&
    !(spell.dotDamagePerTurn ?? spell.dotDamage) &&
    (spell.targetType === "self" || spell.targetType === "ally")
  ) {
    kinds.push("buff");
  }
  return kinds;
}

/** Advertised heal+buff payload. Heal-only or buff-only returns null. */
export function bossKitHealBuffEffectFields(
  spell: BossKitHealBuffSpell,
): BossKitHealBuffExecute | null {
  if (!isBossKitHealBuffExecuteSpell(spell) || !spell.buffStat) return null;
  return {
    tile: { x: 0, y: 0 },
    heal: Math.max(0, Math.floor(Number(spell.healAmount) || 0)),
    buff: {
      stat: spell.buffStat,
      modifier: Number(spell.buffModifier ?? 1),
      duration: Math.max(1, Math.floor(Number(spell.buffDuration) || 0)),
    },
  };
}

export function canExecuteBossKitHealBuffCast(args: {
  spell: BossKitHealBuffSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): boolean {
  return (
    isBossKitHealBuffExecuteSpell(args.spell) &&
    bossKitHealBuffInRange(args.origin, args.targetCell, args.spell)
  );
}

/** Alias so decide and the WX heal+buff branch cannot fork. */
export function shouldDecideBossKitHealBuffCast(
  args: Parameters<typeof canExecuteBossKitHealBuffCast>[0],
): boolean {
  return canExecuteBossKitHealBuffCast(args);
}

export function bossKitHighlightedHealBuffIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Execute a decided kit heal+buff. Non-heal-buff returns null so restack
 * cannot treat `#498` kit aim as a walk dest. The shield tile is the
 * boss cell, not the decide action's player cell.
 */
export function executeBossKitHealBuffCast(args: {
  spell: BossKitHealBuffSpell;
  origin: BossKitTile;
  targetCell: BossKitTile;
}): BossKitHealBuffExecute | null {
  if (
    !canExecuteBossKitHealBuffCast({
      spell: args.spell,
      origin: args.origin,
      targetCell: args.targetCell,
    })
  ) {
    return null;
  }
  const fields = bossKitHealBuffEffectFields(args.spell);
  if (!fields) return null;
  const tile = bossKitHealBuffApplyCell(
    args.spell,
    args.origin,
    args.targetCell,
  );
  return { tile, heal: fields.heal, buff: fields.buff };
}
