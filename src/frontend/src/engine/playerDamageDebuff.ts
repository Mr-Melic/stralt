/**
 * Player-bar damage spells that also advertise `debuffStat` (Frost Bolt,
 * Frost Nova, Cursed Wound, Shadow Veil, Expose, Life Drain, Drain Courage).
 *
 * `resolvePlayerCast`'s damage loop never called `applyEffect` for those
 * fields, so AP was spent and damage landed without the catalog control
 * half. 0-damage Weaken / Slow stay on the dedicated debuff-only path
 * (`decidePlayerDebuffOnlyCast` / #528) — this helper requires damage > 0
 * so the two do not double-apply after that PR merges.
 *
 * Enemy / boss / summon-kit `resolveSpellCast` already applies `debuffStat`.
 */

export type PlayerDamageDebuffSpell = {
  id?: string;
  name?: string;
  iconEmoji?: string;
  damage?: unknown;
  debuffStat?: string;
  debuffModifier?: number;
  debuffDuration?: number;
};

export type PlayerHitDebuffEffect = {
  id: string;
  effectName: string;
  type: "debuff";
  targetId: string;
  stat: string;
  modifier: number;
  duration: number;
  iconEmoji: string;
  description: string;
};

function catalogDamage(spell: PlayerDamageDebuffSpell): number {
  const damage = Number(spell.damage ?? 0);
  return Number.isFinite(damage) ? damage : 0;
}

/** Skip the player sentinel — hitsAllies never advertised a self-debuff. */
export function playerDamageHitAppliesDebuff(
  spell: PlayerDamageDebuffSpell,
  targetId: string | undefined,
): boolean {
  if (!targetId || targetId === "__player__" || targetId === "player") {
    return false;
  }
  if (catalogDamage(spell) <= 0) return false;
  return typeof spell.debuffStat === "string" && spell.debuffStat.length > 0;
}

export function playerDamageHitDebuffEffect(
  spell: PlayerDamageDebuffSpell,
  targetId: string,
): PlayerHitDebuffEffect | null {
  if (!playerDamageHitAppliesDebuff(spell, targetId)) return null;
  const stat = spell.debuffStat as string;
  return {
    id: `player-dmg-debuff-${spell.id ?? "spell"}-${targetId}`,
    effectName: spell.name ?? "Debuff",
    type: "debuff",
    targetId,
    stat,
    modifier: spell.debuffModifier ?? 1,
    duration: spell.debuffDuration ?? 3,
    iconEmoji: spell.iconEmoji || "💀",
    description: `${stat} debuffed`,
  };
}

/** Returns true when `applyEffect` ran. */
export function applyPlayerDamageHitDebuff(
  spell: PlayerDamageDebuffSpell,
  targetId: string,
  applyEffect: (effect: PlayerHitDebuffEffect) => void,
): boolean {
  const effect = playerDamageHitDebuffEffect(spell, targetId);
  if (!effect) return false;
  applyEffect(effect);
  return true;
}
