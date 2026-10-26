/**
 * Iron Curse vs advertised healing ×0.5.
 *
 * Registry (`mapModifiers.ts` `iron_curse`) announces
 *   "Iron Curse: +30% RES, healing halved."
 * `MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER` is 0.5. The
 * `onEffectApplication` hook logs "Iron Curse halves healing." then
 * returns true, claiming "the WX heal site reads the active-id set to
 * apply the 0.5 multiplier."
 *
 * Live WorldExploration never does. `ActiveEffect.type` is only
 * `"buff" | "debuff" | "dot"`, so `applyActiveEffect` never calls
 * `applyEffectApplication("heal")`. Player Blood Mend /
 * Rallying Cry go through `resolvePlayerCast` → `ctx.heal` →
 * `setCharacterStats(prev.hp + amount)` with the full packet.
 * The summon-control `heal` callback is the same write. Enemy /
 * boss self-heals use `hpAfterHeal(..., ha)` with the catalog
 * `healAmount`. WX has `isPlagueZone` / `isVoidRift` flags and no
 * `isIronCurse`.
 *
 * Sequence: Iron Curse map → Blood Mend (`starter-heal` healAmount 12)
 * at 80/100 HP → expected 86, actual 92.
 *
 * Unique vs **#1148** (Vampiric Ground attacker stub), **#644** /
 * **#921** (drain `healAmount` / Life Drain SP), **#692** (Blood Mend
 * CHC), **#757** (pack-enemy heal HP execute), **#443** (Mending Mist
 * turn-start), **#985** (pack-enemy Blood Mend decide). Player RES
 * ×1.3 is a sibling: `applyBattleStart` only mutates `combatantsRef`
 * (`Enemy[]`; player is not in that list). Do not add `res` /
 * `healUsed` / drain `healAmount` / potion percents.
 *
 * Do not restack WorldExploration / spellEngine / mapModifiers.
 * Restack `ctx.heal` (player + summon) onto
 * `executeIronCurseHealScale` after older combat PRs land, then write
 * the returned `hpAfter` through `setCharacterStats`.
 */

import { MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER } from "../data/gameConstants.ts";

export const IRON_CURSE_MODIFIER_ID = "iron_curse";

export type IronCurseHealScaleExecute = {
  heal: number;
  hpAfter: number;
};

export function isIronCurseModifier(
  modifierId: string | null | undefined,
): boolean {
  return modifierId === IRON_CURSE_MODIFIER_ID;
}

export function ironCurseHealAmount(baseHeal: number): number {
  const packet = Number(baseHeal);
  if (!Number.isFinite(packet) || packet <= 0) return 0;
  return Math.floor(packet * MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER);
}

/** Live player `ctx.heal` writes `prev.hp + amount` with no ×0.5. */
export function wxPlayerHealAppliesIronCurse(): boolean {
  return false;
}

/** Live summon-control `heal` callback is the same unscaled write. */
export function wxSummonHealAppliesIronCurse(): boolean {
  return false;
}

/** Live enemy/boss `hpAfterHeal(..., ha)` never multiplies by 0.5. */
export function wxEnemySelfHealAppliesIronCurse(): boolean {
  return false;
}

/** Live `applyActiveEffect` never passes `effectType === "heal"`. */
export function wxApplyEffectApplicationSeesHeal(): boolean {
  return false;
}

/** Live WX never derives an `isIronCurse` flag from the active-id set. */
export function wxHasIronCurseFlag(): boolean {
  return false;
}

/** Live WX never writes the advertised half-heal onto characterStats. */
export function liveWxIronCurseHealHalves(): boolean {
  return false;
}

export function canExecuteIronCurseHealScale(args: {
  modifierActive: boolean;
  healAmount: number;
}): boolean {
  if (args.modifierActive !== true) return false;
  return ironCurseHealAmount(args.healAmount) > 0;
}

/** Alias so decide and the ctx.heal restack cannot fork. */
export function shouldDecideIronCurseHealScale(
  args: Parameters<typeof canExecuteIronCurseHealScale>[0],
): boolean {
  return canExecuteIronCurseHealScale(args);
}

export function ironCurseHighlightedHealIsExecutable(args: {
  decided: boolean;
  executable: boolean;
}): boolean {
  return args.decided === true && args.executable === true;
}

/**
 * Commit advertised healing ×0.5 onto current HP. Incoming ≤ 0 is a
 * no-op so a missing packet cannot mint 1 HP. Drain healAmount /
 * healUsed / RES are not in this payload (#644 / #380 / RES sibling).
 */
export function executeIronCurseHealScale(args: {
  modifierActive: boolean;
  healAmount: number;
  currentHp: number;
  maxHp: number;
}): IronCurseHealScaleExecute | null {
  if (!canExecuteIronCurseHealScale(args)) return null;
  const heal = ironCurseHealAmount(args.healAmount);
  const hp = Math.max(0, Number(args.currentHp) || 0);
  const cap = Math.max(hp, Number(args.maxHp) || 0);
  return { heal, hpAfter: Math.min(cap, hp + heal) };
}
