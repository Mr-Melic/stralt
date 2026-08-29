import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import {
  chebyshevDistance,
  planSummonControlCast,
  resolveSummonControlSpell,
  summonControlCastFailMessage,
  summonControlIdAfterAdvance,
  summonControlTurnResources,
} from "./summonControlCast.ts";

describe("resolveSummonControlSpell", () => {
  it("resolves Archer kit spells from starterSpells when summon.spells is empty", () => {
    const poison = resolveSummonControlSpell(
      "archer",
      "starter-poison",
      starterSpells,
      [],
    );
    const slow = resolveSummonControlSpell(
      "archer",
      "spell-slow",
      starterSpells,
      [],
    );
    assert.equal(poison?.id, "starter-poison");
    assert.equal(Number(poison?.range), 4);
    assert.equal(Number(poison?.apCost), 2);
    assert.equal(slow?.id, "spell-slow");
    assert.equal(Number(slow?.range), 3);
  });

  it("does not resolve a kit spell for the wrong pieceType", () => {
    const poison = resolveSummonControlSpell(
      "wolf",
      "starter-poison",
      starterSpells,
      [],
    );
    assert.equal(poison, undefined);
  });

  it("falls back to summon.spells when the kit is absent", () => {
    const fallback = [{ id: "custom-bolt", apCost: 1, range: 2 }];
    const found = resolveSummonControlSpell(
      "unknown-piece",
      "custom-bolt",
      starterSpells,
      fallback,
    );
    assert.equal(found?.id, "custom-bolt");
  });
});

describe("planSummonControlCast", () => {
  it("plans a legal Archer Poison Arrow and flags Striker on range 3+", () => {
    const adjacent = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 2,
      caster: { x: 8, y: 8 },
      target: { x: 10, y: 8 },
    });
    assert.equal(adjacent.ok, true);
    if (adjacent.ok) {
      assert.equal(adjacent.remainingAp, 0);
      assert.equal(adjacent.breaksStriker, false);
    }

    const kite = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 2,
      caster: { x: 8, y: 8 },
      target: { x: 12, y: 8 },
    });
    assert.equal(kite.ok, true);
    if (kite.ok) {
      assert.equal(kite.breaksStriker, true);
      assert.equal(kite.remainingAp, 0);
    }
  });

  it("rejects a kit click when summon.spells is empty and AP is short", () => {
    const noSpell = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: [],
      fallbackSpells: [],
      currentAp: 2,
      caster: { x: 1, y: 1 },
      target: { x: 2, y: 1 },
    });
    assert.deepEqual(noSpell, { ok: false, reason: "no_spell" });

    const noAp = planSummonControlCast({
      pieceType: "archer",
      spellId: "starter-poison",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 1,
      caster: { x: 1, y: 1 },
      target: { x: 2, y: 1 },
    });
    assert.deepEqual(noAp, { ok: false, reason: "no_ap" });
  });

  it("rejects a Bomber Inferno beyond its range-3 so control mode cannot snipe", () => {
    const tooFar = planSummonControlCast({
      pieceType: "bomber",
      spellId: "spell-inferno",
      catalog: starterSpells,
      fallbackSpells: [],
      currentAp: 5,
      caster: { x: 0, y: 0 },
      target: { x: 4, y: 0 },
    });
    assert.deepEqual(tooFar, { ok: false, reason: "out_of_range" });
    assert.equal(chebyshevDistance({ x: 0, y: 0 }, { x: 4, y: 0 }), 4);
  });

  it("maps fail reasons to battle-log copy", () => {
    assert.equal(summonControlCastFailMessage("no_ap"), "Not enough AP");
    assert.equal(summonControlCastFailMessage("out_of_range"), "Out of range");
    assert.equal(summonControlCastFailMessage("no_spell"), "Unknown spell");
  });
});

describe("summonControlIdAfterAdvance", () => {
  it("drops leftover control when the next combatant is the player or an enemy", () => {
    assert.equal(summonControlIdAfterAdvance({ id: "player" }), null);
    assert.equal(
      summonControlIdAfterAdvance({
        id: "goblin-1",
        isSummon: false,
        side: "enemy",
      }),
      null,
    );
    assert.equal(
      summonControlIdAfterAdvance({
        id: "hostile-wolf",
        isSummon: true,
        side: "enemy",
      }),
      null,
    );
  });

  it("rebinds control only when the incoming combatant is a player-side summon", () => {
    assert.equal(
      summonControlIdAfterAdvance({
        id: "summon-archer",
        isSummon: true,
        side: "player",
      }),
      "summon-archer",
    );
    assert.equal(summonControlIdAfterAdvance(null), null);
    assert.equal(summonControlIdAfterAdvance(undefined), null);
  });
});

describe("summonControlTurnResources", () => {
  it("refills leftover 0/0 to the summon max so later control turns can act", () => {
    // Wolf spent 2 AP + 2 MP on turn 1. Without a refill the auto-end
    // effect sees 0/0 and skips every later lifespan turn.
    assert.deepEqual(
      summonControlTurnResources({
        maxAp: 2,
        maxMp: 2,
      }),
      { currentAp: 2, currentMp: 2 },
    );
  });

  it("floors missing or invalid max budgets to 0", () => {
    assert.deepEqual(summonControlTurnResources({}), {
      currentAp: 0,
      currentMp: 0,
    });
    assert.deepEqual(
      summonControlTurnResources({ maxAp: -3, maxMp: Number.NaN }),
      { currentAp: 0, currentMp: 0 },
    );
  });
});
