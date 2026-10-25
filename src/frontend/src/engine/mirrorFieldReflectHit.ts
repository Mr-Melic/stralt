/**
 * Mirror Field player-reflect soak.
 *
 * `resolvePlayerCast` rolls a 20% single-target reflect and then the WX
 * callback used to subtract `preCritDmgBM` from HP and record that same
 * packet on `challengeTotalDamageRef`. Enemy kit spells and DoT ticks go
 * through `playerTakesDamage` (RES, then Shield Charm, then HP actually
 * lost). A Shield Charm + Untouchable fight therefore failed the 500 Doka /
 * 1000 XP objective on a reflect that the shield would have soaked, and a
 * lethal packet skipped RES.
 *
 * Distinct from Void Mirror / Reflect Shield (#973, `applyDamageToEnemy`)
 * and from Plague Zone ticks (#891). This helper is the RES-then-shield
 * packet `playerTakesDamage` applies; WX must write HP / shield / challenge
 * from it. 0-damage utility (Mark) must not pick up the live
 * `Math.max(1, …)` floor.
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

/** Live `resolvePlayerCast` Mirror Field roll (`Math.random() * 100 < 20`). */
export const MIRROR_FIELD_REFLECT_CHANCE = 20;

export function shouldMirrorFieldReflect(roll100: number): boolean {
  const n = Number(roll100);
  if (!Number.isFinite(n)) return false;
  return n < MIRROR_FIELD_REFLECT_CHANCE;
}

export interface MirrorFieldReflectHitInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface MirrorFieldReflectHit {
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

/**
 * RES-then-shield packet for a positive Mirror Field reflect.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 * Incoming ≤ 0 is a no-op so Mark / 0-damage damage-loop spells cannot
 * mint a 1 HP hit from that floor.
 */
export function planMirrorFieldReflectedHit(
  args: MirrorFieldReflectHitInput,
): MirrorFieldReflectHit {
  const hp = toNat(args.hp);
  const shieldHp = toNat(args.shieldHp);
  const incoming = Number(args.incoming);
  if (!Number.isFinite(incoming) || incoming <= 0) {
    return {
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
    Math.round(incoming * Math.max(0, 1 - effRes / 100)),
  );
  const shieldAbsorb = Math.min(shieldHp, damageAfterRes);
  const hpLost = Math.max(0, damageAfterRes - shieldAbsorb);
  const remainingShield = Math.max(0, shieldHp - shieldAbsorb);
  const { newHp, lethal } = hpAfterIncomingDamage(hp, hpLost);
  return {
    damageAfterRes,
    shieldAbsorb,
    remainingShield,
    hpLost,
    newHp,
    lethal,
    challengeDamage: hpLost,
  };
}

/**
 * Live WX used to write `max(0, hp - incoming)` and record `incoming` even
 * when Shield Charm still had stack. Keep this as the divergence proof —
 * do not call it from production.
 */
export function liveWxRawMirrorFieldHit(
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
