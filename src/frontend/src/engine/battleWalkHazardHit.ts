/**
 * Battle-walk Thorned Ground / Void Rift soak.
 *
 * Mouse and touch both call `applyBattleWalkHazards` after
 * `battleWalkHazardDamages`. That callback used to subtract the raw
 * thorn / rift packets from HP and record those same numbers on
 * `challengeTotalDamageRef`. Enemy kit spells and DoT ticks go through
 * `playerTakesDamage` (RES, then Shield Charm, then HP actually lost).
 *
 * Sequence: Shield Charm → Untouchable → 2-extra-tile Thorned walk
 * (or land on the live Void Rift tile). Live WX skipped the soak, so
 * the shield sat unused and the 500 Doka / 1000 XP objective failed.
 * A 2 HP walk onto the rift also skipped the plague-style synchronous
 * `_handlePlayerDeath`, so End Turn could still let the last hostile
 * die to lava / DoT and `shouldAwardVictory` while `deathTriggered`
 * was false.
 *
 * Distinct from Mirror Field (#1079), Void Mirror / Reflect Shield
 * (#1084 / #973), Plague Zone ticks (#891), leftover-walk lava rAF
 * (#546), and liveHp-0 killing-blow victory (#652). Thorn / rift
 * formulas are unchanged; this is the RES-then-shield packet
 * `playerTakesDamage` applies. Incoming ≤ 0 is a no-op (do not mint
 * 1 HP from `Math.max(1, …)`).
 */

import { hpAfterIncomingDamage } from "./battleSetup.ts";

export interface BattleWalkHazardHitInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface BattleWalkHazardHit {
  damageAfterRes: number;
  shieldAbsorb: number;
  remainingShield: number;
  hpLost: number;
  newHp: number;
  lethal: boolean;
  challengeDamage: number;
}

export interface BattleWalkHazardSoakStart {
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface SoakedBattleWalkHazards {
  remainingShield: number;
  newHp: number;
  lethal: boolean;
  challengeDamage: number;
  shieldAbsorb: number;
  thorn: BattleWalkHazardHit;
  rift: BattleWalkHazardHit;
}

function toNat(n: number): number {
  const value = Math.floor(Number(n));
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * RES-then-shield packet for one positive walk-hazard debit.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 * Incoming ≤ 0 is a no-op so a 1-tile Thorned walk cannot mint a
 * 1 HP hit from that floor.
 */
export function planBattleWalkHazardHit(
  args: BattleWalkHazardHitInput,
): BattleWalkHazardHit {
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
 * Live WX used to write `max(0, hp - incoming)` and record `incoming`
 * even when Shield Charm still had stack. Keep this as the divergence
 * proof — do not call it from production.
 */
export function liveWxRawBattleWalkHazardHit(
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

/**
 * Thorn then rift, matching the two live `setCharacterStats` writes.
 * Shield leftover after thorns must still soak the rift packet.
 */
export function applySoakedBattleWalkHazards(
  start: BattleWalkHazardSoakStart,
  damages: { thornDmg: number; riftDmg: number },
): SoakedBattleWalkHazards {
  const thorn = planBattleWalkHazardHit({
    incoming: damages.thornDmg,
    hp: start.hp,
    res: start.res,
    resModifier: start.resModifier,
    shieldHp: start.shieldHp,
  });
  const rift = planBattleWalkHazardHit({
    incoming: damages.riftDmg,
    hp: thorn.newHp,
    res: start.res,
    resModifier: start.resModifier,
    shieldHp: thorn.remainingShield,
  });
  return {
    remainingShield: rift.remainingShield,
    newHp: rift.newHp,
    lethal: thorn.lethal || rift.lethal,
    challengeDamage: thorn.challengeDamage + rift.challengeDamage,
    shieldAbsorb: thorn.shieldAbsorb + rift.shieldAbsorb,
    thorn,
    rift,
  };
}

/**
 * Plague turn-start already calls `_handlePlayerDeath` on the same stack.
 * Walk hazards used to rely on the async HP-watch, so a lethal rift /
 * thorn walk left `deathTriggered` false through End Turn.
 */
export function shouldDispatchDeathAfterBattleWalkHazard(
  lethal: boolean,
): boolean {
  return lethal === true;
}
