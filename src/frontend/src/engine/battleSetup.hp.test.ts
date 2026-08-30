import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hpAfterIncomingDamage } from "./battleSetup.ts";

describe("hpAfterIncomingDamage live HP", () => {
  it("subtracts a DoT tick from live HP instead of a mount-time snapshot", () => {
    // processActiveEffects used to close over mount HP (100). After a hit
    // to 10, a 5-dmg tick must land at 5, not restore the player to 95.
    assert.deepEqual(hpAfterIncomingDamage(10, 5), {
      newHp: 5,
      lethal: false,
    });
    assert.notEqual(hpAfterIncomingDamage(10, 5).newHp, 95);
  });

  it("marks a DoT tick lethal from live HP even when a stale snapshot would survive", () => {
    assert.deepEqual(hpAfterIncomingDamage(4, 5), {
      newHp: 0,
      lethal: true,
    });
    assert.equal(hpAfterIncomingDamage(100, 5).lethal, false);
  });
});
