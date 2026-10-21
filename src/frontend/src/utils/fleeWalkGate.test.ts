import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeDeathPenalty, respawnHpAfterDeath } from "./deathPenalty.ts";
import {
  type FleeWalkSnapshot,
  applyFleeAfterWalkGate,
  applyLeftoverWalkAfterFlee,
  hpAfterLeftoverWalkLava,
  leftoverWalkContinuesAfterFlee,
  shouldAllowFleeDuringBattleWalk,
  wxFleeDuringBattleWalk,
} from "./fleeWalkGate.ts";

function snap(overrides: Partial<FleeWalkSnapshot> = {}): FleeWalkSnapshot {
  return {
    hp: 10,
    xp: 100,
    doka: 200,
    level: 4,
    deathTriggered: false,
    deathPenaltyApplied: false,
    inBattle: true,
    isMoving: true,
    groundDokaClaimed: 0,
    hostilesRemaining: 1,
    ...overrides,
  };
}

describe("shouldAllowFleeDuringBattleWalk", () => {
  it("allows Flee when leftover walk is idle on a live player turn", () => {
    assert.equal(
      shouldAllowFleeDuringBattleWalk({ inBattle: true, isMoving: false }),
      true,
    );
  });

  it("blocks Flee while leftover rAF owns the path", () => {
    assert.equal(
      shouldAllowFleeDuringBattleWalk({ inBattle: true, isMoving: true }),
      false,
    );
  });

  it("does not treat overworld walks as leftover battle Flee", () => {
    assert.equal(
      shouldAllowFleeDuringBattleWalk({ inBattle: false, isMoving: true }),
      true,
    );
  });
});

describe("leftover Flee during leftover walk", () => {
  it("cuts 20% XP / 40% Doka and restores Death Realm HP while isMoving", () => {
    // Chronology:
    // 1. Live player turn. HP 10, XP 100, Doka 200. One hostile still
    //    alive (#629 last-hostile Flee does not fire).
    // 2. Click a 3-tile walk over lava / ground Doka (isMoving true).
    // 3. BattleUIPanel Flee confirm → onEndBattle → _handlePlayerDeath.
    //    No isMoving read. persistDeathPenalty restores HP immediately.
    const leftover = wxFleeDuringBattleWalk(snap());
    const expected = computeDeathPenalty(100, 200);
    assert.equal(leftover.deathTriggered, true);
    assert.equal(leftover.deathPenaltyApplied, true);
    assert.equal(leftover.inBattle, false);
    assert.equal(leftover.isMoving, true, "leftover rAF is not aborted");
    assert.equal(leftover.xp, expected.newXp);
    assert.equal(leftover.xp, 80);
    assert.equal(leftover.doka, expected.newDoka);
    assert.equal(leftover.doka, 120);
    assert.equal(leftover.hp, respawnHpAfterDeath(4));
    assert.equal(leftover.hp, 57);
    assert.notEqual(leftover.hp, 10, "Flee must not leave the 10 HP walker");
  });

  it("keeps a 10 HP walker alive through leftover lava 12 after HP restore", () => {
    const leftover = wxFleeDuringBattleWalk(snap({ hp: 10 }));
    assert.equal(leftoverWalkContinuesAfterFlee({}), true);
    const afterLava = applyLeftoverWalkAfterFlee({
      snap: leftover,
      lavaDmg: 12,
    });
    const tax = hpAfterLeftoverWalkLava(leftover.hp, 12);
    assert.equal(afterLava.hp, 45, "57 restored − leftover lava 12");
    assert.equal(tax.lethal, false);
    assert.equal(afterLava.deathTriggered, true);
  });

  it("claims leftover ground Doka after the 40% cut", () => {
    const leftover = wxFleeDuringBattleWalk(snap({ doka: 200 }));
    const afterLoot = applyLeftoverWalkAfterFlee({
      snap: leftover,
      groundDoka: 50,
    });
    assert.equal(afterLoot.doka, 170, "120 after death + leftover 50");
    assert.equal(afterLoot.groundDokaClaimed, 50);
  });

  it("still fires with a living hostile (unique vs #629 last-hostile Flee)", () => {
    const leftover = wxFleeDuringBattleWalk(snap({ hostilesRemaining: 1 }));
    assert.equal(leftover.deathTriggered, true);
    assert.equal(leftover.xp, 80);
  });
});

describe("gated Flee after leftover-walk refuse", () => {
  it("does not persist 20/40 or restore HP while isMoving", () => {
    const before = snap({ hp: 10, xp: 100, doka: 200 });
    const gated = applyFleeAfterWalkGate({
      inBattle: true,
      isMoving: true,
      snap: before,
    });
    assert.equal(gated.deathTriggered, false);
    assert.equal(gated.deathPenaltyApplied, false);
    assert.equal(gated.inBattle, true);
    assert.equal(gated.xp, 100);
    assert.equal(gated.doka, 200);
    assert.equal(gated.hp, 10);
  });

  it("leaves 10 HP so leftover lava 12 is lethal", () => {
    const gated = applyFleeAfterWalkGate({
      inBattle: true,
      isMoving: true,
      snap: snap({ hp: 10 }),
    });
    const afterLava = applyLeftoverWalkAfterFlee({
      snap: { ...gated, isMoving: true },
      lavaDmg: 12,
    });
    const tax = hpAfterLeftoverWalkLava(gated.hp, 12);
    assert.equal(afterLava.hp, 0);
    assert.equal(tax.lethal, true);
    assert.equal(gated.deathTriggered, false, "lava death is a later path");
  });

  it("does not claim leftover ground Doka onto a death-cut wallet", () => {
    const gated = applyFleeAfterWalkGate({
      inBattle: true,
      isMoving: true,
      snap: snap({ doka: 200 }),
    });
    const afterLoot = applyLeftoverWalkAfterFlee({
      snap: { ...gated, isMoving: true },
      groundDoka: 50,
    });
    assert.equal(afterLoot.doka, 250, "loot lands on the live 200 wallet");
    assert.notEqual(afterLoot.doka, 170, "must not be death-cut 120 + 50");
  });

  it("still applies standing-still Flee on a live player turn", () => {
    const standing = applyFleeAfterWalkGate({
      inBattle: true,
      isMoving: false,
      snap: snap({ isMoving: false, hp: 40 }),
    });
    assert.equal(standing.deathTriggered, true);
    assert.equal(standing.xp, 80);
    assert.equal(standing.doka, 120);
    assert.equal(standing.hp, 57);
    const afterIdle = applyLeftoverWalkAfterFlee({
      snap: standing,
      lavaDmg: 12,
      groundDoka: 50,
    });
    assert.equal(afterIdle.hp, 57, "idle Flee does not leftover-step");
    assert.equal(afterIdle.doka, 120);
  });

  it("does not apply overworld Flee through the battle walk gate", () => {
    const overworld = applyFleeAfterWalkGate({
      inBattle: false,
      isMoving: true,
      snap: snap({ inBattle: false, isMoving: true }),
    });
    assert.equal(overworld.deathTriggered, false);
    assert.equal(overworld.xp, 100);
  });
});
