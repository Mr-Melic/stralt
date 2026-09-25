/**
 * resolveSpellCast buff rows used to always stamp caster.id.
 *
 * Player-controlled Sentinel kits (starter-shield / spell-iron-skin) are
 * targetType "ally". The live gate already picked the clicked ally; RES
 * must land on that id so enemyTakesDamage(getStatModifier(allyId, "res"))
 * sees the advertised 1.3×. Self kits (Blood Mend) stay on the caster.
 *
 * Keep the resolveSpellCast buff branch on this helper.
 */
export function resolveSpellCastBuffTargetId(
  spell: { targetType?: unknown },
  casterId: string,
  clickedId: string,
): string {
  return spell.targetType === "ally" ? clickedId : casterId;
}
