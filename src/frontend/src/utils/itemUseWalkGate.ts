/**
 * Leftover-walk BuffShop Use / potion / elixir / boots.
 *
 * #761 gates Swap / Strike / Attack Nearest via
 * `shouldAllowPlayerCastDuringBattleWalk` (casts only). #728 gates End Turn
 * via `shouldAllowEndTurnDuringBattleWalk`. BuffShop `handleUse` still only
 * checks `inBattle && isPlayerTurn`. WorldExploration `handleUseItem` then
 * restores HP, grants +3 AP / +2 MP, or arms Shield / Fury with no
 * `isMoving` read. The leftover rAF still owns `movementPath` and writes
 * position / lava / portal on the isMoving false-transition.
 *
 * Mid-path health potion: consume the stack, restore 30% max HP, set
 * `healUsed` so easy_1 (50 Doka) and hard_1 (200 Doka / 500 XP) fail. A
 * 10 HP walker that drinks before leftover lava 12 survives; the gated
 * refuse leaves 10 so that tax is lethal.
 *
 * Unique extra vs #761 casts, #728 End Turn, #706 leftover-walk Blood Mend
 * tile, #702 Frozen double-walk, #576 / #595 Death Realm shop. Do not
 * restack BuffShop, WorldExploration, playerCastGate, or itemShop.
 */

import { hpAfterHeal, hpAfterIncomingDamage } from "../engine/battleSetup.ts";
import {
  type Challenge,
  type ChallengePanelProgress,
  DEFAULT_CHALLENGES,
  isChallengeCompleted,
  recordChallengeItemHealUsed,
} from "./challengeCompletion.ts";
import {
  addChallengeRewardDeltas,
  liveBattleChallengePersistEntries,
} from "./challengeRewards.ts";
import { isBuffShopHealItem, tryConsumeBuffItem } from "./itemShop.ts";

export type WalkGateBuffItem =
  | "health_potion"
  | "greater_health_potion"
  | "battle_elixir"
  | "swift_boots"
  | "shield_charm"
  | "fury_potion";

export type ItemUseWalkSnapshot = {
  owned: number;
  hp: number;
  maxHp: number;
  battleAp: number;
  battleMp: number;
  shieldHp: number;
  furyTurns: number;
  healUsed: boolean;
};

export type ItemUseWalkResult = ItemUseWalkSnapshot & {
  applied: boolean;
  consumed: boolean;
};

/** Same percents as WorldExploration `handleUseItem`. */
export function buffShopHealAmount(
  itemType: WalkGateBuffItem,
  maxHp: number,
): number {
  const max = Math.max(0, Math.floor(Number(maxHp) || 0));
  if (itemType === "health_potion") return Math.floor(max * 0.3);
  if (itemType === "greater_health_potion") return Math.floor(max * 0.7);
  return 0;
}

/**
 * Unique extra vs #761 / #728: leftover-walk **spend / heal**, not a cast
 * and not End Turn. False while the leftover rAF owns the path.
 */
export function shouldAllowProgressSpendDuringBattleWalk(opts: {
  isMoving: boolean;
}): boolean {
  return opts.isMoving !== true;
}

/**
 * BuffShop `handleUse` leftover is `inBattle && isPlayerTurn`. The walk
 * gate is the missing `isMoving` read.
 */
export function shouldAllowItemUseDuringBattleWalk(opts: {
  inBattle: boolean;
  isPlayerTurn: boolean;
  isMoving: boolean;
}): boolean {
  if (opts.inBattle !== true) return false;
  if (opts.isPlayerTurn !== true) return false;
  return shouldAllowProgressSpendDuringBattleWalk({
    isMoving: opts.isMoving,
  });
}

function emptyResult(snap: ItemUseWalkSnapshot): ItemUseWalkResult {
  return { ...snap, applied: false, consumed: false };
}

function applyBuffShopUse(
  itemType: WalkGateBuffItem,
  snap: ItemUseWalkSnapshot,
): ItemUseWalkSnapshot {
  if (isBuffShopHealItem(itemType)) {
    return {
      ...snap,
      hp: hpAfterHeal(
        snap.hp,
        snap.maxHp,
        buffShopHealAmount(itemType, snap.maxHp),
      ),
      healUsed: recordChallengeItemHealUsed(true, snap.healUsed),
    };
  }
  if (itemType === "battle_elixir") {
    return { ...snap, battleAp: snap.battleAp + 3 };
  }
  if (itemType === "swift_boots") {
    return { ...snap, battleMp: snap.battleMp + 2 };
  }
  if (itemType === "shield_charm") {
    return { ...snap, shieldHp: 20 };
  }
  return { ...snap, furyTurns: 3 };
}

/**
 * Production BuffShop `handleUse` + WX `handleUseItem`: consume then apply
 * when the player turn is live. Ignores leftover walk.
 */
export function wxItemUseDuringBattleWalk(opts: {
  inBattle: boolean;
  isPlayerTurn: boolean;
  itemType: WalkGateBuffItem;
  snap: ItemUseWalkSnapshot;
}): ItemUseWalkResult {
  if (opts.inBattle !== true || opts.isPlayerTurn !== true) {
    return emptyResult(opts.snap);
  }
  const nextOwned = tryConsumeBuffItem(opts.snap.owned);
  if (nextOwned == null) return emptyResult(opts.snap);
  const applied = applyBuffShopUse(opts.itemType, {
    ...opts.snap,
    owned: nextOwned,
  });
  return { ...applied, applied: true, consumed: true };
}

/**
 * Restack after #761 / #728: refuse Use while `isMoving` so the leftover
 * rAF keeps exclusive HP / AP / inventory writes until the walk lands.
 */
export function applyItemUseAfterWalkGate(opts: {
  inBattle: boolean;
  isPlayerTurn: boolean;
  isMoving: boolean;
  itemType: WalkGateBuffItem;
  snap: ItemUseWalkSnapshot;
}): ItemUseWalkResult {
  if (!shouldAllowItemUseDuringBattleWalk(opts)) {
    return emptyResult(opts.snap);
  }
  return wxItemUseDuringBattleWalk(opts);
}

export function challengeById(id: string): Challenge {
  const found = DEFAULT_CHALLENGES.find((c) => c.id === id);
  if (!found) {
    throw new Error(`unknown challenge ${id}`);
  }
  return found;
}

export function noHealProgress(
  healUsed: boolean,
  totalDamage = 0,
): ChallengePanelProgress {
  return {
    turnCount: 1,
    totalDamage,
    healUsed,
    directHit: true,
    maxApUsedInTurn: 4,
    directHitAttempts: 0,
  };
}

/** easy_1 50 Doka + hard_1 200 Doka / 500 XP the panel still advertises. */
export function noHealChallengePayout(healUsed: boolean): {
  easy1Doka: number;
  hard1Doka: number;
  hard1Xp: number;
  easy1Complete: boolean;
  hard1Complete: boolean;
} {
  const easy1 = challengeById("easy_1");
  const hard1 = challengeById("hard_1");
  const progress = noHealProgress(healUsed);
  const easy1Complete = isChallengeCompleted(easy1, progress);
  const hard1Complete = isChallengeCompleted(hard1, progress);
  return {
    easy1Complete,
    hard1Complete,
    easy1Doka: addChallengeRewardDeltas(
      0,
      0,
      liveBattleChallengePersistEntries(true, easy1, easy1Complete),
    ).dokaFromChallenges,
    hard1Doka: addChallengeRewardDeltas(
      0,
      0,
      liveBattleChallengePersistEntries(true, hard1, hard1Complete),
    ).dokaFromChallenges,
    hard1Xp: addChallengeRewardDeltas(
      0,
      0,
      liveBattleChallengePersistEntries(true, hard1, hard1Complete),
    ).xpDelta,
  };
}

/**
 * Leftover player lava roll is 8–15 (WX walk). Used to show a mid-walk
 * potion keeping a 10 HP walker alive through a 12-damage leftover step.
 */
export function hpAfterLeftoverWalkLava(
  hp: number,
  lavaDmg: number,
): { newHp: number; lethal: boolean } {
  return hpAfterIncomingDamage(hp, lavaDmg);
}

export function isHealBuffItem(itemType: WalkGateBuffItem): boolean {
  return isBuffShopHealItem(itemType);
}
