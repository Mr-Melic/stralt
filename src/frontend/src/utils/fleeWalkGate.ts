/**
 * Leftover-walk Flee.
 *
 * #761 gates Swap / Strike / Attack Nearest via
 * `shouldAllowPlayerCastDuringBattleWalk` (casts only). #728 gates End Turn
 * via `shouldAllowEndTurnDuringBattleWalk`. #805 gates BuffShop Use /
 * potion via `shouldAllowItemUseDuringBattleWalk`. #629 gates Flee after
 * the last hostile dies (`hostilesRemaining === 0`) so `persistDeathPenalty`
 * cannot beat `applyRewards`.
 *
 * BattleUIPanel Flee still only `window.confirm`s, then WorldExploration
 * `onEndBattle` calls `_handlePlayerDeath` with no `isMoving` read.
 * `persistDeathPenalty` restores HP immediately (`respawnHpAfterDeath`).
 * Leftover rAF still owns `movementPath`: `shouldAbortMovementRaf` only
 * sees recap / victory persist / `movementGen`, not `deathTriggered`.
 *
 * Mid-path Flee therefore:
 * - cuts 20% XP / 40% Doka while the walker is still on lava;
 * - restores HP so leftover lava 8–15 taxes the Death Realm snapshot
 *   instead of the 10 HP walker (a 12-damage step that should kill
 *   leaves the player alive);
 * - claims leftover ground Doka after the 40% cut.
 *
 * Unique extra vs those PRs. Do not restack WorldExploration,
 * BattleUIPanel, playerCastGate, itemUseWalkGate, endTurnWalkGate, or
 * fleeAfterLastHostile.
 */

import { hpAfterIncomingDamage } from "../engine/battleSetup.ts";
import { computeDeathPenalty, respawnHpAfterDeath } from "./deathPenalty.ts";
import { shouldAbortMovementRaf } from "./recapWorldInput.ts";

export type FleeWalkSnapshot = {
  hp: number;
  xp: number;
  doka: number;
  level: number;
  deathTriggered: boolean;
  deathPenaltyApplied: boolean;
  inBattle: boolean;
  isMoving: boolean;
  groundDokaClaimed: number;
  hostilesRemaining: number;
};

/**
 * Unique extra vs #761 / #728 / #805: leftover-walk **Flee / death
 * penalty**, not a cast, End Turn, or potion Use. False while leftover
 * rAF owns the path. Overworld walks are out of scope — Flee is a
 * battle control (`inBattle !== true` stays allowed).
 */
export function shouldAllowFleeDuringBattleWalk(opts: {
  inBattle: boolean;
  isMoving: boolean;
}): boolean {
  if (opts.inBattle !== true) return true;
  return opts.isMoving !== true;
}

/**
 * Production leftover rAF after Flee. Recap / `victoryPersistPending` are
 * still false (`_handlePlayerDeath` opens Game Over, not the victory
 * recap). Same `movementGen` — the loop keeps stepping.
 */
export function leftoverWalkContinuesAfterFlee(opts: {
  recapVisible?: boolean;
  victoryPersistPending?: boolean;
  movementGen?: number;
  loopGen?: number;
}): boolean {
  return !shouldAbortMovementRaf({
    recapVisible: opts.recapVisible === true,
    victoryPersistPending: opts.victoryPersistPending === true,
    movementGen: opts.movementGen ?? 1,
    loopGen: opts.loopGen ?? 1,
  });
}

function emptyResult(snap: FleeWalkSnapshot): FleeWalkSnapshot {
  return { ...snap };
}

/**
 * Production WX `onEndBattle` → `_handlePlayerDeath`: one-shot death
 * guards, 20/40 persist, HP restore. Ignores leftover walk. Hostiles
 * still alive (this is not #629).
 */
export function wxFleeDuringBattleWalk(
  snap: FleeWalkSnapshot,
): FleeWalkSnapshot {
  if (snap.inBattle !== true) return emptyResult(snap);
  if (snap.deathTriggered === true || snap.deathPenaltyApplied === true) {
    return emptyResult(snap);
  }
  const penalty = computeDeathPenalty(snap.xp, snap.doka);
  return {
    ...snap,
    deathTriggered: true,
    deathPenaltyApplied: true,
    inBattle: false,
    xp: penalty.newXp,
    doka: penalty.newDoka,
    hp: respawnHpAfterDeath(snap.level),
    // isMoving stays true — leftover rAF is not aborted.
  };
}

/**
 * Leftover player lava / ground Doka after Flee. Production rAF does not
 * read `deathTriggered`. Used to show restored HP surviving leftover
 * lava 12, and leftover loot landing after the 40% cut.
 */
export function applyLeftoverWalkAfterFlee(opts: {
  snap: FleeWalkSnapshot;
  lavaDmg?: number;
  groundDoka?: number;
}): FleeWalkSnapshot {
  const snap = opts.snap;
  if (snap.isMoving !== true) return emptyResult(snap);
  if (!leftoverWalkContinuesAfterFlee({})) return emptyResult(snap);

  let hp = snap.hp;
  let doka = snap.doka;
  let claimed = snap.groundDokaClaimed;
  const lavaDmg = Math.max(0, Math.floor(Number(opts.lavaDmg) || 0));
  const groundDoka = Math.max(0, Math.floor(Number(opts.groundDoka) || 0));
  if (lavaDmg > 0) {
    hp = hpAfterIncomingDamage(hp, lavaDmg).newHp;
  }
  if (groundDoka > 0) {
    doka += groundDoka;
    claimed += groundDoka;
  }
  return { ...snap, hp, doka, groundDokaClaimed: claimed };
}

/**
 * Restack after #761 / #728 / #805: refuse Flee while `isMoving` so the
 * leftover rAF keeps exclusive HP / wallet writes until the walk lands.
 * Standing-still Flee still applies 20/40.
 */
export function applyFleeAfterWalkGate(opts: {
  inBattle: boolean;
  isMoving: boolean;
  snap: FleeWalkSnapshot;
}): FleeWalkSnapshot {
  if (!shouldAllowFleeDuringBattleWalk(opts)) {
    return emptyResult(opts.snap);
  }
  return wxFleeDuringBattleWalk(opts.snap);
}

export function hpAfterLeftoverWalkLava(
  hp: number,
  lavaDmg: number,
): { newHp: number; lethal: boolean } {
  return hpAfterIncomingDamage(hp, lavaDmg);
}
