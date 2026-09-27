/**
 * Player-controlled kit buffs run through `resolveSpellCast`, which always
 * wrote `targetId: caster.id`. Sentinel Shield (`targetType: "ally"`, range 3)
 * is selectable on another living player-side summon (`pickSummonControlClickTarget`
 * + live `ally_summon` gate), but the +30% RES landed on the golem. Incoming
 * `enemyTakesDamage` reads `getStatModifier(victimId, "res")`, so the clicked
 * ally stayed unprotected and AP was still spent.
 *
 * Unique vs #550 (Wisp Blood Mend HP after the buffStat early return), #700
 * (auto-summon executor metadata; that path is type/side-dead for player
 * summons), #699 (Enrage outgoing casterId). Player-bar ally buffs already
 * use the clicked tile via `resolvePlayerCast`.
 *
 * Do not change buff percentages, durations, or damage math.
 */

export type KitBuffTargetType = string | undefined;

export function kitBuffEffectTargetId(args: {
  targetType: KitBuffTargetType;
  casterId: string;
  clickedTargetId: string;
}): string {
  const t = args.targetType ?? "";
  if (t === "ally" || t === "self") {
    return args.clickedTargetId;
  }
  return args.casterId;
}

/** True when Shield/Iron Skin/Enrage spent AP on the caster instead of the click. */
export function kitAllyBuffLandedOnCaster(args: {
  writtenTargetId: string;
  casterId: string;
  clickedAllyId: string;
}): boolean {
  return (
    args.clickedAllyId !== args.casterId &&
    args.writtenTargetId === args.casterId
  );
}

export type KitBuffSpellFields = {
  name?: string;
  targetType?: string;
  buffStat?: string;
  buffModifier?: number;
  buffDuration?: number;
  iconEmoji?: string;
};

/**
 * Status row `resolveSpellCast` must apply for a buffStat kit/player-AI cast.
 * Ally/self use the clicked combatant; other targetTypes keep the historic
 * caster id so unlabeled self-buffs do not retarget.
 */
export function kitBuffStatusRow(
  spell: KitBuffSpellFields,
  casterId: string,
  clickedTargetId: string,
): {
  effectName: string;
  type: "buff";
  targetId: string;
  stat: string | undefined;
  modifier: number | undefined;
  duration: number;
  iconEmoji: string;
  description: string;
} {
  const targetId = kitBuffEffectTargetId({
    targetType: spell.targetType,
    casterId,
    clickedTargetId,
  });
  return {
    effectName: String(spell.name ?? "buff"),
    type: "buff",
    targetId,
    stat: spell.buffStat,
    modifier: spell.buffModifier,
    duration: spell.buffDuration ?? 3,
    iconEmoji: spell.iconEmoji || "✨",
    description: `${String(spell.name ?? "buff")} buff`,
  };
}
