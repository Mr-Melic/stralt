/**
 * Void Mirror / Reflect Shield player-reflect soak.
 *
 * `applyDamageToEnemy` reflects Void Mirror as `floor(preCritDmgBM * 0.25)`
 * and Reflect Shield as `floor(finalDmg * 0.3)`, then subtracts that packet
 * from HP and records it on `onPlayerReflectedDamage`. Enemy kit spells and
 * DoT ticks go through `playerTakesDamage` (RES, then Shield Charm, then HP
 * actually lost). A Shield Charm + Untouchable fight therefore fails the
 * 500 Doka / 1000 XP objective on a family-variant Void Mirror bounce the
 * shield would have soaked, and a lethal packet skips RES.
 *
 * Distinct from Mirror Field (#1079, WX `mirrorFieldReflect` callback) and
 * from Life Drain resurrection after lethal reflect (#973). Ratios stay
 * `0.25` / `0.3`. This helper is the RES-then-shield packet
 * `playerTakesDamage` applies; restack `applyDamageToEnemy` onto it after
 * #973. Incoming ≤ 0 is a no-op so a 0-damage packet cannot mint 1 HP from
 * `Math.max(1, …)`.
 *
 * Void Mirror is LIVE (`spawnPolicy` 30% family variant, last catalog id).
 * Reflect Shield HP write is the same function; ability arm is latent under
 * kit-always-cast (`pickBossKitSpell` empty Map) — same soak, not a second
 * leftover.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export const VOID_MIRROR_REFLECT_RATIO = 0.25;
export const REFLECT_SHIELD_RATIO = 0.3;

export interface SpellReflectSoakInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface SpellReflectSoak {
  packet: number;
  damageAfterRes: number;
  shieldAbsorb: number;
  remainingShield: number;
  hpLost: number;
  newHp: number;
  lethal: boolean;
  challengeDamage: number;
}

function toNat(n: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/** Live `applyDamageToEnemy` Void Mirror packet (`floor(preCritDmgBM * 0.25)`). */
export function voidMirrorReflectPacket(preCritDmgBM: number): number {
  const dmg = Number(preCritDmgBM);
  if (!Number.isFinite(dmg) || dmg <= 0) return 0;
  return Math.floor(dmg * VOID_MIRROR_REFLECT_RATIO);
}

/** Live `applyDamageToEnemy` Reflect Shield packet (`floor(finalDmg * 0.3)`). */
export function reflectShieldReflectPacket(finalDmg: number): number {
  const dmg = Number(finalDmg);
  if (!Number.isFinite(dmg) || dmg <= 0) return 0;
  return Math.floor(dmg * REFLECT_SHIELD_RATIO);
}

/**
 * RES-then-shield packet for a positive reflected hit.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 */
export function planSpellReflectSoak(
  args: SpellReflectSoakInput,
): SpellReflectSoak {
  const hp = toNat(args.hp);
  const shieldHp = toNat(args.shieldHp);
  const packet = toNat(args.incoming);
  if (packet <= 0) {
    return {
      packet: 0,
      damageAfterRes: 0,
      shieldAbsorb: 0,
      remainingShield: shieldHp,
      hpLost: 0,
      newHp: hp,
      lethal: false,
      challengeDamage: 0,
    };
  }
  const res = Number(args.res);
  const resModifier = Number(args.resModifier);
  const effRes =
    (Number.isFinite(res) ? res : 0) *
    (Number.isFinite(resModifier) ? resModifier : 1);
  const damageAfterRes = Math.max(
    1,
    Math.round(packet * Math.max(0, 1 - effRes / 100)),
  );
  const shieldAbsorb = Math.min(shieldHp, damageAfterRes);
  const hpLost = Math.max(0, damageAfterRes - shieldAbsorb);
  const remainingShield = Math.max(0, shieldHp - shieldAbsorb);
  const { newHp, lethal } = hpAfterIncomingDamage(hp, hpLost);
  return {
    packet,
    damageAfterRes,
    shieldAbsorb,
    remainingShield,
    hpLost,
    newHp,
    lethal,
    challengeDamage: hpLost,
  };
}

export function planVoidMirrorReflectedHit(
  args: Omit<SpellReflectSoakInput, "incoming"> & { preCritDmgBM: number },
): SpellReflectSoak {
  return planSpellReflectSoak({
    incoming: voidMirrorReflectPacket(args.preCritDmgBM),
    hp: args.hp,
    res: args.res,
    resModifier: args.resModifier,
    shieldHp: args.shieldHp,
  });
}

export function planReflectShieldReflectedHit(
  args: Omit<SpellReflectSoakInput, "incoming"> & { finalDmg: number },
): SpellReflectSoak {
  return planSpellReflectSoak({
    incoming: reflectShieldReflectPacket(args.finalDmg),
    hp: args.hp,
    res: args.res,
    resModifier: args.resModifier,
    shieldHp: args.shieldHp,
  });
}

/**
 * Live `applyDamageToEnemy` writes `max(0, hp - packet)` and records `packet`
 * even when Shield Charm still had stack. Keep this as the divergence proof —
 * do not call it from production.
 */
export function liveApplyDamageToEnemyRawReflectHit(
  hp: number,
  incoming: number,
): { newHp: number; challengeDamage: number } {
  const cur = toNat(hp);
  const add = Number.isFinite(incoming) ? Math.max(0, incoming) : 0;
  return {
    newHp: Math.max(0, cur - add),
    challengeDamage: add,
  };
}
