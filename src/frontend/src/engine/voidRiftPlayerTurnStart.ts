/**
 * Player turn-start Void Rift tick.
 *
 * Announce text is `Void Rift: 3 damage per turn and displacement.`
 * Registry `onTurnStart` subtracts `VOID_RIFT_TICK` (3) from the combatant.
 * Enemy / enemy-summon / player-summon branches in `advanceTurn` then
 * commit that packet through `enemyHpAfterHazardDamage` + `updateCombatant`.
 *
 * The player is not in `combatantsRef`. `playerTurnStartModifierTarget`
 * therefore returns undefined and `applyTurnStart` is skipped. Unlike
 * Plague Zone, there is no dedicated `setCharacterStats` player branch —
 * the `isVoidRift` player arm only picks a new warped tile
 * (`Void Rift warps tile … Avoid it!`).
 *
 * Sequence: Void Rift map → End Turn / 30s timer (player turn-start).
 * Live WX leaves HP, Shield Charm, and Untouchable untouched, so a 3 HP
 * player can still kill the last hostile and `shouldAwardVictory`.
 * Expected packet matches `playerTakesDamage` (RES, then Shield Charm,
 * then HP actually lost) — the same soak Plague Zone still skips (#1142).
 *
 * Distinct from battle-walk onto the warped tile (#1097,
 * `voidRiftWalkDamage` / `applyBattleWalkHazards`), leftover-walk lava /
 * spikes (#1100), Plague Zone player soak (#1142), Mirror Field (#1079),
 * Void Mirror / Reflect Shield (#1084 / #973). Tick formula stays 3.
 * Incoming ≤ 0 is a no-op (do not mint 1 HP from `Math.max(1, …)`).
 *
 * Unique vs #546 / #652 / #891 / #973 / #1079 / #1084 / #1097 / #1100 /
 * #1142 / #1156. WorldExploration `advanceTurn` left untouched so older
 * open PRs stay merge-clean. Restack the player Void Rift arm onto
 * `planVoidRiftPlayerTurnStart` after those PRs land.
 */

import { recordChallengeDamageTaken } from "../utils/challengeCompletion.ts";
import {
  hpAfterIncomingDamage,
  playerTurnStartModifierTarget,
} from "./battleSetup.ts";

export interface VoidRiftPlayerTurnStartInput {
  incoming: number;
  hp: number;
  res: number;
  resModifier?: number;
  shieldHp: number;
}

export interface VoidRiftPlayerTurnStartHit {
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
 * RES-then-shield packet for one positive Void Rift turn-start debit.
 *
 * Matches `playerTakesDamage`: `effRes = res * resModifier`, then
 * `max(1, round(incoming * (1 - effRes/100)))`, then Shield Charm.
 * Incoming ≤ 0 is a no-op so a missing tick cannot mint a 1 HP hit
 * from that floor.
 */
export function planVoidRiftPlayerTurnStart(
  args: VoidRiftPlayerTurnStartInput,
): VoidRiftPlayerTurnStartHit {
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
 * Live WX player Void Rift arm never writes HP / shield / challenge.
 * Keep this as the divergence proof — do not call it from production.
 */
export function liveWxPlayerVoidRiftTurnStart(
  hp: number,
  shieldHp: number,
): VoidRiftPlayerTurnStartHit {
  const cur = toNat(hp);
  const shield = toNat(shieldHp);
  return {
    damageAfterRes: 0,
    shieldAbsorb: 0,
    remainingShield: shield,
    hpLost: 0,
    newHp: cur,
    lethal: false,
    challengeDamage: 0,
  };
}

/**
 * Challenge counter is HP actually lost after soak, matching
 * `playerTakesDamage` (`if (dmg > 0) recordChallengeDamageTaken`).
 */
export function recordVoidRiftChallengeDamage(
  current: number,
  hpLost: number,
): number {
  if (hpLost <= 0) return toNat(current);
  return recordChallengeDamageTaken(current, hpLost);
}

/**
 * After soak, dispatch `_handlePlayerDeath` only when HP actually
 * reached 0. Live never dispatched because the tick never landed.
 */
export function shouldDispatchDeathAfterVoidRift(lethal: boolean): boolean {
  return lethal === true;
}

/** True when WX should run the player Void Rift turn-start tick. */
export function shouldApplyVoidRiftPlayerTurnStart(
  voidRiftActive: boolean,
): boolean {
  return voidRiftActive === true;
}

/**
 * Player lives outside `combatantsRef`. The live `applyTurnStart` call
 * is gated on this helper, so a typical enemy-only roster never ticks
 * the player.
 */
export function playerRosterMissesVoidRiftTurnStart<T extends { id?: string }>(
  combatants: T[],
): boolean {
  return playerTurnStartModifierTarget(combatants) === undefined;
}
