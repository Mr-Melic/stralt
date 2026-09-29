import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type ItemUseWalkSnapshot,
  applyItemUseAfterWalkGate,
  buffShopHealAmount,
  hpAfterLeftoverWalkLava,
  isHealBuffItem,
  noHealChallengePayout,
  shouldAllowItemUseDuringBattleWalk,
  shouldAllowProgressSpendDuringBattleWalk,
  wxItemUseDuringBattleWalk,
} from "./itemUseWalkGate.ts";

function snap(
  overrides: Partial<ItemUseWalkSnapshot> = {},
): ItemUseWalkSnapshot {
  return {
    owned: 1,
    hp: 10,
    maxHp: 100,
    battleAp: 4,
    battleMp: 3,
    shieldHp: 0,
    furyTurns: 0,
    healUsed: false,
    ...overrides,
  };
}

const liveTurn = { inBattle: true, isPlayerTurn: true } as const;

describe("shouldAllowProgressSpendDuringBattleWalk", () => {
  it("allows Use / potion when the leftover walk is idle", () => {
    assert.equal(
      shouldAllowProgressSpendDuringBattleWalk({ isMoving: false }),
      true,
    );
  });

  it("blocks Use / potion while leftover rAF owns the path", () => {
    assert.equal(
      shouldAllowProgressSpendDuringBattleWalk({ isMoving: true }),
      false,
    );
  });
});

describe("shouldAllowItemUseDuringBattleWalk", () => {
  it("keeps BuffShop's inBattle + player-turn gate", () => {
    assert.equal(
      shouldAllowItemUseDuringBattleWalk({
        ...liveTurn,
        isMoving: false,
      }),
      true,
    );
    assert.equal(
      shouldAllowItemUseDuringBattleWalk({
        inBattle: false,
        isPlayerTurn: true,
        isMoving: false,
      }),
      false,
    );
    assert.equal(
      shouldAllowItemUseDuringBattleWalk({
        inBattle: true,
        isPlayerTurn: false,
        isMoving: false,
      }),
      false,
    );
  });

  it("adds the missing isMoving read on top of handleUse", () => {
    assert.equal(
      shouldAllowItemUseDuringBattleWalk({
        ...liveTurn,
        isMoving: true,
      }),
      false,
    );
  });
});

describe("leftover BuffShop Use during leftover walk", () => {
  it("consumes a health potion, restores 30% max HP, and fails easy_1 / hard_1", () => {
    assert.equal(buffShopHealAmount("health_potion", 100), 30);
    assert.equal(isHealBuffItem("health_potion"), true);
    const leftover = wxItemUseDuringBattleWalk({
      ...liveTurn,
      itemType: "health_potion",
      snap: snap(),
    });
    assert.equal(leftover.consumed, true);
    assert.equal(leftover.applied, true);
    assert.equal(leftover.owned, 0);
    assert.equal(leftover.hp, 40, "10 + floor(100 * 0.3)");
    assert.equal(leftover.healUsed, true);
    const payout = noHealChallengePayout(leftover.healUsed);
    assert.equal(payout.easy1Complete, false);
    assert.equal(payout.hard1Complete, false);
    assert.equal(payout.easy1Doka, 0, "easy_1 50 Doka must not persist");
    assert.equal(payout.hard1Xp, 0, "hard_1 500 XP must not persist");
  });

  it("keeps a 10 HP walker alive through leftover lava 12", () => {
    const leftover = wxItemUseDuringBattleWalk({
      ...liveTurn,
      itemType: "health_potion",
      snap: snap({ hp: 10 }),
    });
    const afterLava = hpAfterLeftoverWalkLava(leftover.hp, 12);
    assert.equal(afterLava.newHp, 28);
    assert.equal(afterLava.lethal, false);
  });

  it("grants leftover elixir +3 AP and boots +2 MP while isMoving", () => {
    assert.equal(isHealBuffItem("battle_elixir"), false);
    const elixir = wxItemUseDuringBattleWalk({
      ...liveTurn,
      itemType: "battle_elixir",
      snap: snap({ battleAp: 1 }),
    });
    assert.equal(elixir.battleAp, 4);
    assert.equal(elixir.healUsed, false, "AP items must not flip no_healing");
    const boots = wxItemUseDuringBattleWalk({
      ...liveTurn,
      itemType: "swift_boots",
      snap: snap({ battleMp: 0 }),
    });
    assert.equal(boots.battleMp, 2);
  });
});

describe("gated Use after leftover-walk refuse", () => {
  it("does not consume the potion or restore HP while isMoving", () => {
    const before = snap({ hp: 10, owned: 1 });
    const gated = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: true,
      itemType: "health_potion",
      snap: before,
    });
    assert.equal(gated.applied, false);
    assert.equal(gated.consumed, false);
    assert.equal(gated.owned, 1);
    assert.equal(gated.hp, 10);
    assert.equal(gated.healUsed, false);
    const payout = noHealChallengePayout(gated.healUsed);
    assert.equal(payout.easy1Complete, true);
    assert.equal(payout.easy1Doka, 50);
    assert.equal(payout.hard1Complete, true);
    assert.equal(payout.hard1Doka, 200);
    assert.equal(payout.hard1Xp, 500);
  });

  it("leaves 10 HP so leftover lava 12 is lethal", () => {
    const gated = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: true,
      itemType: "health_potion",
      snap: snap({ hp: 10 }),
    });
    const afterLava = hpAfterLeftoverWalkLava(gated.hp, 12);
    assert.equal(afterLava.newHp, 0);
    assert.equal(afterLava.lethal, true);
  });

  it("does not grant elixir AP or boots MP while isMoving", () => {
    const elixir = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: true,
      itemType: "battle_elixir",
      snap: snap({ battleAp: 1, owned: 2 }),
    });
    assert.equal(elixir.battleAp, 1);
    assert.equal(elixir.owned, 2);
    const boots = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: true,
      itemType: "swift_boots",
      snap: snap({ battleMp: 0 }),
    });
    assert.equal(boots.battleMp, 0);
    assert.equal(boots.owned, 1);
  });

  it("still applies a standing-still potion on a live player turn", () => {
    const standing = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: false,
      itemType: "health_potion",
      snap: snap({ hp: 50 }),
    });
    assert.equal(standing.applied, true);
    assert.equal(standing.hp, 80);
    assert.equal(standing.healUsed, true);
    assert.equal(noHealChallengePayout(standing.healUsed).easy1Doka, 0);
  });

  it("still refuses overworld and enemy-turn Use after the walk gate", () => {
    assert.equal(
      applyItemUseAfterWalkGate({
        inBattle: false,
        isPlayerTurn: true,
        isMoving: false,
        itemType: "health_potion",
        snap: snap(),
      }).applied,
      false,
    );
    assert.equal(
      applyItemUseAfterWalkGate({
        inBattle: true,
        isPlayerTurn: false,
        isMoving: false,
        itemType: "health_potion",
        snap: snap(),
      }).consumed,
      false,
    );
  });

  it("does not apply a greater potion from an empty stack", () => {
    assert.equal(buffShopHealAmount("greater_health_potion", 100), 70);
    const empty = applyItemUseAfterWalkGate({
      ...liveTurn,
      isMoving: false,
      itemType: "greater_health_potion",
      snap: snap({ owned: 0, hp: 20 }),
    });
    assert.equal(empty.applied, false);
    assert.equal(empty.hp, 20);
    assert.equal(empty.healUsed, false);
  });
});
