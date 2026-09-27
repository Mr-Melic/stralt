import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import {
  kitResolvedCastBreaksPacifist,
  pacifistAfterResolvedCast,
  spellEffectBreaksPacifist,
} from "./pacifistRun.ts";
import { resolveSummonControlSpell } from "./summonControlCast.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

const victorySnap = {
  hp: 80,
  mapsVisited: 3,
  groundDokaPickups: 0,
  spellBarCount: 4,
  hasSpellAtLeast5: false,
  critHits: 0,
  betrayal: false,
  doubleBetrayal: false,
  leaderSlain: false,
  bossId: null as string | null,
};

describe("spellEffectBreaksPacifist", () => {
  it("matches recordPlayerSpellType offensive categories", () => {
    assert.equal(spellEffectBreaksPacifist("damage"), true);
    assert.equal(spellEffectBreaksPacifist("DOT"), true);
    assert.equal(spellEffectBreaksPacifist("drain"), true);
    assert.equal(spellEffectBreaksPacifist("teleport"), true);
    assert.equal(spellEffectBreaksPacifist("heal"), false);
    assert.equal(spellEffectBreaksPacifist("buff"), false);
    assert.equal(spellEffectBreaksPacifist("debuff"), false);
    assert.equal(spellEffectBreaksPacifist("summon"), false);
    assert.equal(spellEffectBreaksPacifist(undefined), false);
  });
});

describe("kitResolvedCastBreaksPacifist", () => {
  it("fails Pacifist when a controlled Archer / Wolf / Bomber lands offense", () => {
    const poison = resolveSummonControlSpell(
      "archer",
      "starter-poison",
      starterSpells,
      [],
    );
    const strike = resolveSummonControlSpell(
      "wolf",
      "physical_attack",
      starterSpells,
      [],
    );
    const inferno = resolveSummonControlSpell(
      "bomber",
      "spell-inferno",
      starterSpells,
      [],
    );
    const venom = resolveSummonControlSpell(
      "wolf",
      "spell-venom-strike",
      starterSpells,
      [],
    );
    assert.ok(poison && kitResolvedCastBreaksPacifist(poison));
    assert.ok(strike && kitResolvedCastBreaksPacifist(strike));
    assert.ok(inferno && kitResolvedCastBreaksPacifist(inferno));
    assert.ok(venom && kitResolvedCastBreaksPacifist(venom));
  });

  it("keeps Pacifist for Wisp heals and Sentinel shields", () => {
    const mend = resolveSummonControlSpell(
      "wisp",
      "starter-heal",
      starterSpells,
      [],
    );
    const rally = resolveSummonControlSpell(
      "wisp",
      "spell-rallying-cry",
      starterSpells,
      [],
    );
    const shield = resolveSummonControlSpell(
      "golem",
      "starter-shield",
      starterSpells,
      [],
    );
    const skin = resolveSummonControlSpell(
      "golem",
      "spell-iron-skin",
      starterSpells,
      [],
    );
    assert.ok(mend && !kitResolvedCastBreaksPacifist(mend));
    assert.ok(rally && !kitResolvedCastBreaksPacifist(rally));
    assert.ok(shield && !kitResolvedCastBreaksPacifist(shield));
    assert.ok(skin && !kitResolvedCastBreaksPacifist(skin));
  });

  it("does not flip on Slow (debuff-only), matching the player-bar gate", () => {
    const slow = resolveSummonControlSpell(
      "archer",
      "spell-slow",
      starterSpells,
      [],
    );
    assert.ok(slow && !kitResolvedCastBreaksPacifist(slow));
  });
});

describe("pacifistAfterResolvedCast → victory feats", () => {
  it("drops pacifist_run after kit Poison so the 500 Doka feat cannot unlock", () => {
    const poison = resolveSummonControlSpell(
      "archer",
      "starter-poison",
      starterSpells,
      [],
    );
    assert.ok(poison);
    const afterKit = pacifistAfterResolvedCast(
      true,
      String(poison.effectType ?? "damage"),
    );
    assert.equal(afterKit, false);
    const conditions = clientTrustedVictoryAchievementConditions({
      ...victorySnap,
      pacifist: afterKit,
    });
    assert.equal(conditions.includes("pacifist_run"), false);
  });

  it("keeps pacifist_run after a Wisp Blood Mend", () => {
    const mend = resolveSummonControlSpell(
      "wisp",
      "starter-heal",
      starterSpells,
      [],
    );
    assert.ok(mend);
    const afterHeal = pacifistAfterResolvedCast(
      true,
      String(mend.effectType ?? "damage"),
    );
    assert.equal(afterHeal, true);
    const conditions = clientTrustedVictoryAchievementConditions({
      ...victorySnap,
      pacifist: afterHeal,
    });
    assert.ok(conditions.includes("pacifist_run"));
  });
});
