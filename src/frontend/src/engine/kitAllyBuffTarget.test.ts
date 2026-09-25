import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import { resolveSpellCastBuffTargetId } from "./kitAllyBuffTarget.ts";
import { getStatModifier } from "./statusEffects.ts";

function buffRow(
  targetId: string,
  stat: string,
  modifier: number,
): {
  effectName: string;
  type: "buff";
  targetId: string;
  stat: string;
  modifier: number;
} {
  return {
    effectName: "Shield",
    type: "buff",
    targetId,
    stat,
    modifier,
  };
}

describe("resolveSpellCastBuffTargetId", () => {
  it("routes ally Shield / Iron Skin onto the clicked occupant", () => {
    const shield = starterSpells.find((s) => s.id === "starter-shield");
    const iron = starterSpells.find((s) => s.id === "spell-iron-skin");
    assert.equal(shield?.targetType, "ally");
    assert.equal(iron?.targetType, "ally");
    assert.equal(
      resolveSpellCastBuffTargetId(shield!, "sentinel-1", "wolf-1"),
      "wolf-1",
    );
    assert.equal(
      resolveSpellCastBuffTargetId(iron!, "sentinel-1", "wisp-1"),
      "wisp-1",
    );
  });

  it("keeps self-click ally buffs and self kits on the caster", () => {
    const shield = starterSpells.find((s) => s.id === "starter-shield");
    const mend = starterSpells.find((s) => s.id === "starter-heal");
    assert.equal(
      resolveSpellCastBuffTargetId(shield!, "sentinel-1", "sentinel-1"),
      "sentinel-1",
    );
    assert.equal(mend?.targetType, "self");
    assert.equal(
      resolveSpellCastBuffTargetId(mend!, "wisp-1", "wisp-1"),
      "wisp-1",
    );
  });

  it("makes enemyTakesDamage RES land on the wolf, not the Sentinel", () => {
    const shield = starterSpells.find((s) => s.id === "starter-shield");
    const targetId = resolveSpellCastBuffTargetId(
      shield!,
      "sentinel-1",
      "wolf-1",
    );
    const effects = [buffRow(targetId, "res", 1.3)];
    assert.equal(getStatModifier("wolf-1", "res", effects), 1.3);
    assert.equal(getStatModifier("sentinel-1", "res", effects), 1);
  });
});
