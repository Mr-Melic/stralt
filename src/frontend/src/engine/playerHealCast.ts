/**
 * Player self-heal advertised buff (Blood Mend / Rallying Cry).
 *
 * Highlight + live gate already agree: `targetType self` paints only the
 * caster tile, and mouse / sprite / touch / Attack Nearest / keyboard S
 * all reach `resolvePlayerCast`. That resolver used to heal and return
 * without applying `buffStat`, so a highlighted legal self tile spent AP
 * and restored HP but never granted the advertised +CHC.
 *
 * Shield / Timestep / Mirror stay on their own branches. This helper is
 * heal-only. Catalog `buffModifier` values in (0, 1) are the same +N%
 * convention as Shield's 1.3 (+30%): 0.15 → 1.15. Do not change damage.
 */

export function playerCastIsSelfHeal(spell: {
  targetType?: string;
  effectType?: string;
}): boolean {
  return spell.targetType === "self" && spell.effectType === "heal";
}

/**
 * Percent-stat buffs on self-heals. Values in (0, 1) are advertised
 * "+N%" (Blood Mend `0.15` → 1.15). Values ≥ 1 already match Shield.
 */
export function normalizeHealBuffModifier(raw: unknown): number | null {
  const n = Number(raw);
  if (!Number.isFinite(n) || n === 0) return null;
  if (n > 0 && n < 1) return 1 + n;
  return n;
}

export interface PlayerHealBuffEffect {
  effectName: string;
  type: "buff";
  targetId: string;
  stat: string;
  modifier: number;
  duration: number;
  iconEmoji: string;
  description: string;
}

export function playerHealAdvertisedBuffEffect(
  spell: {
    name?: string;
    iconEmoji?: string;
    buffStat?: string;
    buffModifier?: number;
    buffDuration?: number;
  },
  targetId: string,
): PlayerHealBuffEffect | null {
  const stat = spell.buffStat;
  if (!stat) return null;
  const modifier = normalizeHealBuffModifier(spell.buffModifier);
  if (modifier == null) return null;
  const duration = Math.max(
    1,
    Math.floor(Number(spell.buffDuration) || 3) || 3,
  );
  const pct = Math.round((modifier - 1) * 100);
  const name = String(spell.name ?? "Heal");
  return {
    effectName: name,
    type: "buff",
    targetId,
    stat,
    modifier,
    duration,
    iconEmoji: spell.iconEmoji || "✨",
    description: `+${pct}% ${stat.toUpperCase()} for ${duration} turns`,
  };
}

export interface PlayerHealBuffApplyCtx {
  applyEffect(effect: PlayerHealBuffEffect & { id?: string }): void;
  log(msg: string, color?: string): void;
}

/**
 * Apply the advertised self-heal buff after HP is restored. No-op when the
 * spell has no `buffStat`. Shield branch is unchanged.
 */
export function applyPlayerHealAdvertisedBuff(
  spell: {
    name?: string;
    iconEmoji?: string;
    buffStat?: string;
    buffModifier?: number;
    buffDuration?: number;
  },
  ctx: PlayerHealBuffApplyCtx,
  targetId: string,
): boolean {
  const effect = playerHealAdvertisedBuffEffect(spell, targetId);
  if (!effect) return false;
  ctx.applyEffect(effect);
  ctx.log(
    `You gain ${effect.description} from ${spell.name ?? "Heal"}!`,
    "#60a5fa",
  );
  return true;
}
