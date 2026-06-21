/**
 * Pure spell resolution engine — React-free, DOM-free.
 * Designed for use by both player and enemy casters.
 * New spells are data-only: add fields to SpellConfig and the engine reads them.
 *
 * Fields the engine reads from a spell object:
 *   damage, isPhysical, spellType, buffStat, buffModifier, buffDuration,
 *   debuffStat, debuffModifier, debuffDuration, drainPercent,
 *   isBarrier, isTrap, isMark, aoe, hitsMultiple, hitsAllies,
 *   isDotSpell, dotDamage, dotDuration, dotType, dotDamagePerTurn,
 *   name, apCost, mpCost, range, targetType, effectType, effectCategory,
 *   effectParams, isSwap, isMirror, isTimestep, isSacrifice, cooldown,
 *   minLevel, usableByPlayer, usableByEnemy, healAmount, iconEmoji
 */

export type Side = "player" | "enemy";

export interface SummonUnitDef {
  pieceType: string;
  level: number;
  seed: number;
  lifespan: number;
}

export interface ActiveEffectLike {
  id?: string;
  effectName: string;
  type: "buff" | "debuff" | "dot";
  targetId: string;
  stat?: string;
  modifier?: number;
  duration: number;
  iconEmoji: string;
  description: string;
  dotDamagePerTurn?: number;
}

export interface SpellContext {
  rng(): number;
  getEffectiveStat(combatantId: string, stat: string): number;
  dealDamage(
    targetId: string,
    amount: number,
    opts?: { isPhysical?: boolean },
  ): number;
  heal(combatantId: string, amount: number): void;
  applyEffect(effect: ActiveEffectLike): void;
  placeBarrier(cell: { x: number; y: number }, turns: number): void;
  spawnUnit(
    cell: { x: number; y: number },
    unitDef: SummonUnitDef,
    side: Side,
    lifespan: number,
  ): void;
  log(msg: string, color?: string): void;
  isCellFree(cell: { x: number; y: number }): boolean;
  getCombatantAt(cell: { x: number; y: number }): {
    id: string;
    side: Side;
  } | null;
}

export interface CombatantSnapshot {
  id: string;
  side: Side;
  level: number;
  effects: ActiveEffectLike[];
  hp: number;
  maxHp: number;
  stats: {
    res: number;
    sp: number;
    fail?: number;
    [k: string]: number | undefined;
  };
}

export interface TargetSnapshot {
  id: string;
  side: Side;
  cell: { x: number; y: number };
  hp: number;
  maxHp: number;
  level: number;
  effects: ActiveEffectLike[];
  stats: { res: number; sp: number; [k: string]: number | undefined };
}

export function computeDamage(params: {
  baseDamage: number;
  casterLevel: number;
  spellUpgradeLevel?: number;
  isCrit?: boolean;
  hasMark?: boolean;
  dmgBuffModifier?: number;
  targetRes: number;
  targetSp: number;
  targetEffects: ActiveEffectLike[];
  getStatModifier: (
    targetId: string,
    stat: string,
    effects: ActiveEffectLike[],
  ) => number;
  calcScaledDamage: (base: number, level: number, upgrade: number) => number;
}): { finalDamage: number; breakdown: string } {
  const {
    baseDamage,
    casterLevel,
    spellUpgradeLevel = 0,
    isCrit = false,
    hasMark = false,
    dmgBuffModifier = 1.0,
    targetRes,
    targetSp: _targetSp,
    targetEffects,
    getStatModifier,
    calcScaledDamage,
  } = params;

  let dmg = calcScaledDamage(baseDamage, casterLevel, spellUpgradeLevel);
  const steps: string[] = [`base ${baseDamage}`];

  steps.push(`scaled ${Math.round(dmg)}`);

  if (dmgBuffModifier !== 1.0) {
    dmg *= dmgBuffModifier;
    steps.push(`buff ${dmgBuffModifier.toFixed(2)}`);
  }

  if (hasMark) {
    dmg *= 2;
    steps.push("mark 2.0");
  }

  if (isCrit) {
    dmg *= 2;
    steps.push("crit 2.0");
  }

  const effectiveRes = targetRes * getStatModifier("", "res", targetEffects);
  dmg = (dmg * 100) / (100 + effectiveRes);
  steps.push(`res ${Math.round(effectiveRes)}`);

  // SP mitigation for physical attacks
  // (Currently not applying SP here to keep parity with existing computeDamage;
  //  the caller can apply SP separately if needed.)

  const finalDamage = Math.max(1, Math.round(dmg));
  steps.push(`final ${finalDamage}`);

  return { finalDamage, breakdown: steps.join(" → ") };
}

export function resolveSpellCast(
  spell: any,
  caster: CombatantSnapshot,
  target: TargetSnapshot,
  ctx: SpellContext,
  helpers: {
    getStatModifier: (
      targetId: string,
      stat: string,
      effects: ActiveEffectLike[],
    ) => number;
    calcScaledDamage: (base: number, level: number, upgrade: number) => number;
  },
): void {
  // FAIL roll first
  const failChance = (caster.stats.fail ?? 0) / 100;
  if (ctx.rng() < failChance) {
    ctx.log(`${spell.name} fizzled!`, "#ef4444");
    return;
  }

  // Static summon (barrier)
  if (spell.isBarrier) {
    ctx.placeBarrier(target.cell, 2);
    ctx.log(`${spell.name} placed a barrier!`, "#818cf8");
    return;
  }

  // Trap
  if (spell.isTrap) {
    ctx.placeBarrier(target.cell, 3);
    ctx.log(`${spell.name} placed a trap!`, "#f59e0b");
    return;
  }

  // Drain / Lifesteal
  const isDrain =
    spell.spellType === "drain" ||
    (spell.effectType &&
      String(spell.effectType).toLowerCase().includes("drain"));

  if (spell.damage > 0 && isDrain) {
    const { finalDamage } = computeDamage({
      baseDamage: Number(spell.damage),
      casterLevel: caster.level,
      spellUpgradeLevel: spell.upgradeLevel ?? 0,
      isCrit: false,
      hasMark: false,
      dmgBuffModifier: 1.0,
      targetRes: target.stats.res ?? 0,
      targetSp: target.stats.sp ?? 0,
      targetEffects: target.effects,
      getStatModifier: helpers.getStatModifier,
      calcScaledDamage: helpers.calcScaledDamage,
    });
    ctx.dealDamage(target.id, finalDamage, { isPhysical: spell.isPhysical });
    const drainPercent = spell.drainPercent ?? 0.5;
    const healAmount = Math.round(finalDamage * drainPercent);
    const cappedHeal = Math.min(healAmount, caster.maxHp - caster.hp);
    ctx.heal(caster.id, cappedHeal);
    ctx.log(
      `${spell.name} drained ${finalDamage} and healed ${cappedHeal}!`,
      "#10b981",
    );
    return;
  }

  // Damage
  if (spell.damage > 0) {
    const { finalDamage, breakdown } = computeDamage({
      baseDamage: Number(spell.damage),
      casterLevel: caster.level,
      spellUpgradeLevel: spell.upgradeLevel ?? 0,
      isCrit: false,
      hasMark: false,
      dmgBuffModifier: 1.0,
      targetRes: target.stats.res ?? 0,
      targetSp: target.stats.sp ?? 0,
      targetEffects: target.effects,
      getStatModifier: helpers.getStatModifier,
      calcScaledDamage: helpers.calcScaledDamage,
    });
    ctx.dealDamage(target.id, finalDamage, { isPhysical: spell.isPhysical });
    ctx.log(
      `${spell.name} dealt ${finalDamage} damage. ${breakdown}`,
      "#f87171",
    );
    return;
  }

  // Buff (self)
  if (spell.buffStat) {
    const pct = Math.round((spell.buffModifier - 1) * 100);
    const duration = spell.buffDuration ?? 3;
    const effect: ActiveEffectLike = {
      effectName: spell.name,
      type: "buff",
      targetId: caster.id,
      stat: spell.buffStat,
      modifier: spell.buffModifier,
      duration,
      iconEmoji: spell.iconEmoji || "✨",
      description: `${spell.name} buff`,
    };
    ctx.applyEffect(effect);
    ctx.log(
      `${spell.name}: +${pct}% ${spell.buffStat.toUpperCase()} for ${duration} turns!`,
      "#4ade80",
    );
    return;
  }

  // Debuff
  if (spell.debuffStat) {
    const pct = Math.round((1 - spell.debuffModifier) * 100);
    const duration = spell.debuffDuration ?? 3;
    const effect: ActiveEffectLike = {
      effectName: spell.name,
      type: "debuff",
      targetId: target.id,
      stat: spell.debuffStat,
      modifier: spell.debuffModifier,
      duration,
      iconEmoji: spell.iconEmoji || "💀",
      description: `${spell.name} debuff`,
    };
    ctx.applyEffect(effect);
    ctx.log(
      `${spell.name}: -${pct}% ${spell.debuffStat.toUpperCase()} for ${duration} turns!`,
      "#f87171",
    );
    return;
  }

  // Heal
  if (spell.healAmount > 0) {
    ctx.heal(target.id, spell.healAmount);
    ctx.log(`${spell.name} healed ${spell.healAmount} HP!`, "#4ade80");
    return;
  }

  // DoT
  if (spell.isDotSpell || spell.dotDamage > 0) {
    const effect: ActiveEffectLike = {
      effectName: spell.name,
      type: "dot",
      targetId: target.id,
      duration: spell.dotDuration ?? 3,
      iconEmoji: spell.iconEmoji || "🔥",
      description: `${spell.name} DoT`,
      dotDamagePerTurn: spell.dotDamagePerTurn ?? spell.dotDamage ?? 0,
    };
    ctx.applyEffect(effect);
    ctx.log(`${spell.name} applied a damage-over-time effect!`, "#f59e0b");
    return;
  }

  // Fallback
  ctx.log(`${spell.name} cast with no effect.`, "#9ca3af");
}
