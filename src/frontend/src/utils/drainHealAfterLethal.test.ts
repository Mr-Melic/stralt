import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAwardVictory } from "../engine/battleSetup.ts";
import {
  cappedDrainHealAmount,
  drainHealAmount,
  playerHpAfterDrainHeal,
  playerHpAfterIncoming,
  reflectShieldAmount,
  shouldApplyDrainHeal,
  voidMirrorReflectAmount,
} from "./drainHealAfterLethal.ts";

describe("voidMirrorReflectAmount / reflectShieldAmount", () => {
  it("keeps live Void Mirror 25% and Reflect Shield 30% floors", () => {
    assert.equal(voidMirrorReflectAmount(40), 10);
    assert.equal(voidMirrorReflectAmount(20), 5);
    assert.equal(voidMirrorReflectAmount(0), 0);
    assert.equal(reflectShieldAmount(20), 6);
    assert.equal(reflectShieldAmount(21), 6);
    assert.equal(reflectShieldAmount(0), 0);
  });
});

describe("shouldApplyDrainHeal after same-cast lethal reflect", () => {
  it("refuses drain when Void Mirror already reduced the player to 0", () => {
    const snapshotHp = 8;
    const maxHp = 50;
    const preCrit = 40;
    const finalDmg = 40;
    const afterReflect = playerHpAfterIncoming(
      snapshotHp,
      voidMirrorReflectAmount(preCrit),
    );
    assert.equal(afterReflect, 0);
    assert.equal(shouldApplyDrainHeal(afterReflect), false);

    const healAmt = cappedDrainHealAmount(maxHp, snapshotHp, finalDmg);
    assert.equal(healAmt, 20);
    assert.equal(
      playerHpAfterDrainHeal(afterReflect, healAmt, maxHp),
      20,
      "applying drain after lethal reflect resurrects — that is the live bug",
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 1,
        hostilesRemaining: 0,
      }),
      true,
      "HP-watch never sees 0 after resurrection, so the victory-gate still awards",
    );
  });

  it("refuses drain when Reflect Shield already reduced the player to 0", () => {
    const snapshotHp = 5;
    const maxHp = 50;
    const finalDmg = 20;
    const afterReflect = playerHpAfterIncoming(
      snapshotHp,
      reflectShieldAmount(finalDmg),
    );
    assert.equal(afterReflect, 0);
    assert.equal(shouldApplyDrainHeal(afterReflect), false);
    assert.equal(
      playerHpAfterDrainHeal(
        afterReflect,
        cappedDrainHealAmount(maxHp, snapshotHp, finalDmg),
        maxHp,
      ),
      10,
    );
  });

  it("still applies snapshot-capped drain after a non-lethal Void Mirror hit", () => {
    const snapshotHp = 40;
    const maxHp = 50;
    const preCrit = 20;
    const finalDmg = 20;
    const afterReflect = playerHpAfterIncoming(
      snapshotHp,
      voidMirrorReflectAmount(preCrit),
    );
    assert.equal(afterReflect, 35);
    assert.equal(shouldApplyDrainHeal(afterReflect), true);
    const healAmt = cappedDrainHealAmount(maxHp, snapshotHp, finalDmg);
    assert.equal(healAmt, 10);
    assert.equal(playerHpAfterDrainHeal(afterReflect, healAmt, maxHp), 45);
  });

  it("does not heal at full HP even when the player survived the reflect", () => {
    assert.equal(cappedDrainHealAmount(50, 50, 20), 0);
    assert.equal(drainHealAmount(20), 10);
    assert.equal(shouldApplyDrainHeal(50), true);
  });
});
