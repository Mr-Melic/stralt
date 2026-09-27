import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ENRAGE_DMG_MODIFIER,
  scaleSummonOutgoingDamage,
  summonOutgoingCasterId,
} from "./summonOutgoingDmg.ts";

const wolfId = "wolf-1";

const allyEnrage = [
  {
    targetId: wolfId,
    type: "buff" as const,
    stat: "dmg",
    modifier: ENRAGE_DMG_MODIFIER,
  },
];

const playerEnrage = [
  {
    targetId: "player",
    type: "buff" as const,
    stat: "dmg",
    modifier: ENRAGE_DMG_MODIFIER,
  },
];

describe("summonOutgoingCasterId", () => {
  it("is the summon combatant id, not player", () => {
    assert.equal(summonOutgoingCasterId(wolfId), wolfId);
    assert.notEqual(summonOutgoingCasterId(wolfId), "player");
  });
});

describe("scaleSummonOutgoingDamage", () => {
  it("applies ally Enrage only when the caster id is the summon", () => {
    assert.equal(scaleSummonOutgoingDamage(10, "player", allyEnrage), 10);
    assert.equal(
      scaleSummonOutgoingDamage(10, summonOutgoingCasterId(wolfId), allyEnrage),
      14,
    );
  });

  it("does not leak a player self-Enrage onto a summon caster id", () => {
    assert.equal(scaleSummonOutgoingDamage(10, "player", playerEnrage), 14);
    assert.equal(
      scaleSummonOutgoingDamage(
        10,
        summonOutgoingCasterId(wolfId),
        playerEnrage,
      ),
      10,
    );
  });

  it("is identity when no dmg effect matches", () => {
    assert.equal(scaleSummonOutgoingDamage(10, wolfId, []), 10);
  });
});
