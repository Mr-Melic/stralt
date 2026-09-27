import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import { pickSummonControlClickTarget } from "../utils/summonControlCast.ts";
import {
  kitAllyBuffLandedOnCaster,
  kitBuffEffectTargetId,
  kitBuffStatusRow,
} from "./kitBuffTarget.ts";
import { getStatModifier } from "./statusEffects.ts";

function byId(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("kitBuffEffectTargetId", () => {
  it("writes ally Shield on the clicked summon, not the caster", () => {
    assert.equal(
      kitBuffEffectTargetId({
        targetType: "ally",
        casterId: "golem-1",
        clickedTargetId: "wisp-1",
      }),
      "wisp-1",
    );
    assert.equal(
      kitAllyBuffLandedOnCaster({
        writtenTargetId: "golem-1",
        casterId: "golem-1",
        clickedAllyId: "wisp-1",
      }),
      true,
    );
    assert.equal(
      kitAllyBuffLandedOnCaster({
        writtenTargetId: "wisp-1",
        casterId: "golem-1",
        clickedAllyId: "wisp-1",
      }),
      false,
    );
  });

  it("keeps self-click Shield on the caster", () => {
    assert.equal(
      kitBuffEffectTargetId({
        targetType: "ally",
        casterId: "golem-1",
        clickedTargetId: "golem-1",
      }),
      "golem-1",
    );
  });

  it("does not retarget a missing targetType (legacy self-buff default)", () => {
    assert.equal(
      kitBuffEffectTargetId({
        targetType: undefined,
        casterId: "golem-1",
        clickedTargetId: "wisp-1",
      }),
      "golem-1",
    );
  });
});

describe("kitBuffStatusRow vs live ally click", () => {
  it("applies Sentinel Shield RES to the clicked Wisp", () => {
    const shield = byId("starter-shield");
    const tiles = Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, () => "floor" as const),
    );
    const golem = {
      id: "golem-1",
      x: 1,
      y: 1,
      hp: 30,
      isSummon: true,
      side: "player" as const,
    };
    const wisp = {
      id: "wisp-1",
      x: 3,
      y: 1,
      hp: 8,
      isSummon: true,
      side: "player" as const,
    };
    const clicked = pickSummonControlClickTarget({
      spell: shield,
      caster: golem,
      tile: { x: 3, y: 1 },
      combatants: [golem, wisp],
      tiles,
    });
    assert.ok(clicked);
    assert.equal(clicked.id, "wisp-1");

    const previous = kitBuffStatusRow(
      { ...shield, targetType: undefined },
      golem.id,
      wisp.id,
    );
    assert.equal(
      kitAllyBuffLandedOnCaster({
        writtenTargetId: previous.targetId,
        casterId: golem.id,
        clickedAllyId: wisp.id,
      }),
      true,
    );

    const row = kitBuffStatusRow(shield, golem.id, clicked.id);
    assert.equal(row.targetId, "wisp-1");
    assert.equal(row.stat, "res");
    assert.equal(row.modifier, 1.3);
    assert.equal(row.duration, 3);
    assert.equal(getStatModifier("wisp-1", "res", [row]), 1.3);
    assert.equal(getStatModifier("golem-1", "res", [row]), 1);
  });

  it("still Shields the golem when the player clicks its own tile", () => {
    const shield = byId("starter-shield");
    const row = kitBuffStatusRow(shield, "golem-1", "golem-1");
    assert.equal(row.targetId, "golem-1");
    assert.equal(getStatModifier("golem-1", "res", [row]), 1.3);
  });
});
