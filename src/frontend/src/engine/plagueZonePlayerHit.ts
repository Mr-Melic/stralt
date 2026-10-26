/**
 * Player turn-start Plague Zone soak.
 *
 * `advanceTurn` still used to subtract the raw `PLAGUE_ZONE_TICK` (2)
 * packet from live HP and record that same 2 through
 * `recordChallengeDamageTaken`. Enemy kit spells and DoT ticks go
 * through `playerTakesDamage` (RES, then Shield Charm, then HP actually
 * lost). Pack melee already applies RES then Shield Charm in the
 * fallback branch.
 *
 * Sequence: Shield Charm → Untouchable → Plague Zone map → End Turn
 * (or the 30s timer) so the player turn-start tick fires. Live WX
 * skipped the soak, so the shield sat unused and the 500 Doka / 1000 XP
 * objective failed even though a DoT tick of 2 would have been soaked.
 * A 2 HP player with shield stacked still died: raw `hpAfterIncomingDamage`
 * marked lethal and `_handlePlayerDeath` ran before the player turn,
 * so a last-hostile kill later in the round could not
 * `shouldAwardVictory`.
 *
 * Distinct from Thorned Ground / Void Rift battle-walk soak (#1097,
 * `applyBattleWalkHazards` after `battleWalkHazardDamages`), leftover-walk
 * lava / spikes (#1100 / #546), Void Mirror / Reflect Shield (#1084 /
 * #973), Mirror Field (#1079), and the docs-only plague skip in #891
 * MIMA-003. Tick formula stays 2; this is the RES-then-shield packet
 * `playerTakesDamage` applies. Incoming ≤ 0 is a no-op (do not mint
 * 1 HP from `Math.max(1, …)`). Enemy / summon plague ticks stay on
 * `enemyHpAfterHazardDamage` — this helper is the player branch only.
 *
 * Unique vs #546 / #652 / #891 / #973 / #1079 / #1084 / #1097 / #1100.
 * WorldExploration `advanceTurn` / challengeCompletion / deathPenalty
 * left untouched so older open PRs stay merge-clean. Restack the player
 * plague branch onto `planPlagueZonePlayerHit` after those PRs land.
 */

import { recordChallengeDamageTaken } from "../utils/challengeCompletion.ts";
import { PLAGUE_ZONE_TICK, hpAfterIncomingDamage } from "./battleSetup.ts";

export interface PlagueZonePlayerHitInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface PlagueZonePlayerHit {
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
 * RES-then-shield packet for one positive Plague Zone debit.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 * Incoming ≤ 0 is a no-op so a missing tick cannot mint a 1 HP hit
 * from that floor.
 */
export function planPlagueZonePlayerHit(
  args: PlagueZonePlayerHitInput,
): PlagueZonePlayerHit {
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
 * Live WX used to write `hpAfterIncomingDamage(hp, PLAGUE_ZONE_TICK)` and
 * record the raw tick even when Shield Charm still had stack. Keep this
 * as the divergence proof — do not call it from production.
 */
export function liveWxRawPlagueZoneHit(
  hp: number,
  incoming: number = PLAGUE_ZONE_TICK,
): { newHp: number; lethal: boolean; challengeDamage: number } {
  const cur = toNat(hp);
  const add = Number.isFinite(incoming) ? Math.max(0, incoming) : 0;
  const { newHp, lethal } = hpAfterIncomingDamage(cur, add);
  return {
    newHp,
    lethal,
    challengeDamage: add,
  };
}

/**
 * Challenge counter is HP actually lost after soak, matching
 * `playerTakesDamage` (`if (dmg > 0) recordChallengeDamageTaken`).
 */
export function recordPlagueZoneChallengeDamage(
  current: number,
  hpLost: number,
): number {
  if (hpLost <= 0) return toNat(current);
  return recordChallengeDamageTaken(current, hpLost);
}

/**
 * Live plague already calls `_handlePlayerDeath` on the same stack — but
 * it used the raw packet's `lethal` flag. After soak, dispatch only when
 * HP actually reached 0.
 */
export function shouldDispatchDeathAfterPlagueZone(lethal: boolean): boolean {
  return lethal === true;
}

/** True when WX should run the player plague tick (map modifier active). */
export function shouldApplyPlagueZonePlayerTick(
  plagueZoneActive: boolean,
): boolean {
  return plagueZoneActive === true;
}
