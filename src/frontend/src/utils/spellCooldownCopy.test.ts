import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { nextSpellCooldownTurns } from "./challengeCompletion.ts";
import {
  giftedSpellNamesConfiguredCooldown,
  spellCardCooldownClause,
  spellCardDescriptionWithCooldown,
} from "./spellCooldownCopy.ts";

describe("spellCooldownCopy", () => {
  it("names a configured lock and stays quiet at 0", () => {
    assert.equal(spellCardCooldownClause(3), "3-turn cooldown");
    assert.equal(spellCardCooldownClause(0), "");
    assert.equal(spellCardCooldownClause(undefined), "");
    assert.equal(
      spellCardDescriptionWithCooldown("Burns for 3 turns", 3),
      "Burns for 3 turns. 3-turn cooldown.",
    );
    assert.equal(
      spellCardDescriptionWithCooldown("Already has a 3-turn cooldown.", 3),
      "Already has a 3-turn cooldown.",
    );
    assert.equal(spellCardDescriptionWithCooldown("Strike", 0), "Strike");
  });

  it("prints Inferno's 3-turn lock on the gifted card, separate from burn duration", () => {
    const inferno = starterSpells.find((spell) => spell.id === "spell-inferno");
    assert.ok(inferno);
    assert.equal(nextSpellCooldownTurns(inferno.cooldown), 3);
    assert.equal(
      giftedSpellNamesConfiguredCooldown(inferno.description, inferno.cooldown),
      true,
    );
    assert.match(inferno.description, /8 dmg\/turn for 3 turns/i);
    assert.match(inferno.description, /3-turn cooldown/i);
    assert.equal(
      inferno.description,
      spellCardDescriptionWithCooldown(
        "Intense fire blast — burns target for 8 dmg/turn for 3 turns",
        inferno.cooldown,
      ),
    );
  });

  it("does not print CD on zero-cooldown Strike", () => {
    assert.equal(nextSpellCooldownTurns(physicalAttackSpell.cooldown), 0);
    assert.equal(/cooldown/i.test(physicalAttackSpell.description), false);
    assert.equal(
      giftedSpellNamesConfiguredCooldown(
        physicalAttackSpell.description,
        physicalAttackSpell.cooldown,
      ),
      true,
    );
  });

  it("requires every gifted starter with a lock to name that lock", () => {
    const locked = starterSpells.filter(
      (spell) => nextSpellCooldownTurns(spell.cooldown) > 0,
    );
    assert.ok(locked.length >= 1);
    for (const spell of locked) {
      assert.equal(
        giftedSpellNamesConfiguredCooldown(spell.description, spell.cooldown),
        true,
        spell.id,
      );
    }
  });
});
