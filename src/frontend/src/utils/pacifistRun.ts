/**
 * Pacifist Run (`pacifist_run`, 500 Doka) flips only on a *resolved*
 * offensive cast. Player-bar casts go through `recordPlayerSpellType`.
 * Player-controlled kit casts go through `resolveSpellCast`, which never
 * calls that hook — Poison Arrow / Inferno / Strike used to keep the
 * feat unlocked after a summon-cleared room.
 *
 * Categories match `recordPlayerSpellType` / targeting
 * `OFFENSIVE_SPELL_CATEGORIES`. Heal / buff / debuff-only (Slow) do not
 * flip. Range preview must not call this.
 */

const OFFENSIVE_SPELL_EFFECT_TYPES = [
  "damage",
  "drain",
  "aoe",
  "dot",
  "pushback",
  "attract",
  "cc",
  "teleport",
] as const;

export function spellEffectBreaksPacifist(
  effectType: string | undefined | null,
): boolean {
  const cat = String(effectType ?? "").toLowerCase();
  return (OFFENSIVE_SPELL_EFFECT_TYPES as readonly string[]).includes(cat);
}

/**
 * Default `"damage"` matches `resolvePlayerCast`'s
 * `recordSpellType(spell.effectType ?? "damage")`.
 */
export function kitResolvedCastBreaksPacifist(spell: {
  effectType?: unknown;
}): boolean {
  return spellEffectBreaksPacifist(String(spell.effectType ?? "damage"));
}

export function pacifistAfterResolvedCast(
  currentlyPacifist: boolean,
  effectType: string | undefined | null,
): boolean {
  if (!currentlyPacifist) return false;
  return !spellEffectBreaksPacifist(effectType);
}
