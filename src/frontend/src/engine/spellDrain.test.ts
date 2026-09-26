import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { spellIsDrain } from "./spellDrain.ts";

describe("spellIsDrain", () => {
  it("treats the seeded Vampire Bite catalog row as a drain", () => {
    // src/backend/lib/admin.mo defaultSpells vampire_bite:
    // spellType = "drain", effectType = "heal", healAmount = 20, damage = 20.
    assert.equal(
      spellIsDrain({ spellType: "drain", effectType: "heal" }),
      true,
    );
  });

  it("treats starter Life Drain (both fields drain) as a drain", () => {
    assert.equal(
      spellIsDrain({ spellType: "drain", effectType: "drain" }),
      true,
    );
  });

  it("does not treat Frost Bolt damage as a drain", () => {
    assert.equal(
      spellIsDrain({ spellType: "damage", effectType: "damage" }),
      false,
    );
  });

  it("treats effectType substrings the enemy resolver already accepted", () => {
    assert.equal(
      spellIsDrain({ spellType: "damage", effectType: "lifesteal-drain" }),
      true,
    );
  });

  it("is false for missing spells", () => {
    assert.equal(spellIsDrain(null), false);
    assert.equal(spellIsDrain(undefined), false);
    assert.equal(spellIsDrain({}), false);
  });
});
