import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bossKitSpellPositionToCommit } from "./bossKitSpell.ts";

describe("bossKitSpellPositionToCommit", () => {
  it("does not move the boss onto the player tile after a kit cast", () => {
    // Pale Archbishop at (2,3), player at (8,8). pickBossKitSpell returns
    // spell-cursed-wound with targetX/Y = the player. Apply used to write
    // that aim through updateCombatant — same-cell occupancy, guaranteed
    // melee, and a visible teleport on every kit turn.
    const patch = bossKitSpellPositionToCommit({
      origin: { x: 2, y: 3 },
      aim: { x: 8, y: 8 },
    });
    assert.equal(patch, null);
  });

  it("does not treat a missing aim as a walk dest either", () => {
    assert.equal(
      bossKitSpellPositionToCommit({
        origin: { x: 4, y: 4 },
        aim: null,
      }),
      null,
    );
  });
});
