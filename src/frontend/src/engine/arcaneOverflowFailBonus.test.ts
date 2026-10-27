/**
 * Combat action parity: Arcane Overflow advertised +10 FAIL-roll fizzle
 * on non-physical player casts. Live WX never adds FAIL_BONUS.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  MAP_MODIFIER_ARCANE_OVERFLOW_AP_DISCOUNT,
  MAP_MODIFIER_ARCANE_OVERFLOW_FAIL_BONUS,
} from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import { DEFAULT_LEVELUP_CONFIG } from "../types/gameTypes.ts";
import {
  ARCANE_OVERFLOW_FAIL_MODIFIER_ID,
  advertisedSpellFailChance,
  arcaneOverflowHighlightedFailIsExecutable,
  canExecuteArcaneOverflowFailBonus,
  executeArcaneOverflowFailBonus,
  isArcaneOverflowFailModifier,
  liveWxSpellFailChanceIncludesOverflowBonus,
  shouldDecideArcaneOverflowFailBonus,
  wxChainLightningUsesEffectApplicationFizzle,
  wxPhysicalStrikeFailRolls,
  wxPlayerFailRollUsesOverflowBonus,
} from "./arcaneOverflowFailBonus.ts";
import { MAP_MODIFIERS, mapModifierRegistry } from "./mapModifiers.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function spellEngineSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "./spellEngine.ts"),
    "utf8",
  );
}

function wxSpellFailChanceBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const spellFailChance = Math.max(");
  assert.ok(start >= 0, "live spellFailChance formula is present");
  const end = wx.indexOf("const getEffectiveSpellRange = useCallback(", start);
  assert.ok(end > start, "range helper still follows spellFailChance");
  return wx.slice(start, end);
}

function resolvePlayerCastFailBlock(): string {
  const src = spellEngineSource();
  const start = src.indexOf("export function resolvePlayerCast(");
  assert.ok(start >= 0, "live resolvePlayerCast is present");
  const end = src.indexOf("// ── Heal spell targets player tile", start);
  assert.ok(end > start, "heal arm still follows the FAIL roll");
  return src.slice(start, end);
}

const chainLightning = starterSpells.find((s) => s.id === "starter-blast");
const strike = starterSpells.find((s) => s.id === "physical_attack");

describe("Arcane Overflow advertised +10 FAIL vs live level formula", () => {
  it("catalog FAIL_BONUS is +10 and the registry AP discount is a different hook", () => {
    assert.equal(MAP_MODIFIER_ARCANE_OVERFLOW_FAIL_BONUS, 10);
    assert.equal(MAP_MODIFIER_ARCANE_OVERFLOW_AP_DISCOUNT, 1);
    assert.equal(
      isArcaneOverflowFailModifier(ARCANE_OVERFLOW_FAIL_MODIFIER_ID),
      true,
    );
    assert.equal(isArcaneOverflowFailModifier("arcane_surge"), false);
    assert.equal(isArcaneOverflowFailModifier("null_field"), false);
    const def = MAP_MODIFIERS.find(
      (m) => m.id === ARCANE_OVERFLOW_FAIL_MODIFIER_ID,
    );
    assert.ok(def);
    assert.equal(
      def?.announceText,
      "Arcane Overflow: AP cheaper, but spells fizzle 10% more.",
    );
    const ctx = { log: () => {}, rng: () => 0 };
    assert.equal(
      mapModifierRegistry.applyApCost(
        4,
        new Set([ARCANE_OVERFLOW_FAIL_MODIFIER_ID]),
        ctx,
      ),
      3,
      "AP cheaper already works — do not restack it onto this FAIL execute",
    );
    assert.equal(
      mapModifierRegistry.applyEffectApplication(
        "damage",
        new Set([ARCANE_OVERFLOW_FAIL_MODIFIER_ID]),
        { log: () => {}, rng: () => 0.05 },
      ),
      false,
      "registry 10% is an effect-application veto, not FAIL_BONUS on the roll",
    );
    assert.equal(advertisedSpellFailChance(20, false), 20);
    assert.equal(advertisedSpellFailChance(20, true), 30);
    assert.equal(advertisedSpellFailChance(-4, true), 0);
    assert.equal(advertisedSpellFailChance(Number.NaN, true), 0);
  });

  it("live FAIL roll uses the level formula only; WX never mentions overflow", () => {
    assert.equal(liveWxSpellFailChanceIncludesOverflowBonus(), false);
    assert.equal(wxPlayerFailRollUsesOverflowBonus(), false);
    assert.equal(wxChainLightningUsesEffectApplicationFizzle(), false);
    assert.equal(wxPhysicalStrikeFailRolls(), false);

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const _isArcaneSurge = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isArcaneOverflow"),
      false,
      "WX still has no isArcaneOverflow flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("arcane_overflow"),
      false,
      "WX still never mentions arcane_overflow",
    );
    assert.equal(wx.includes("ARCANE_OVERFLOW_FAIL_BONUS"), false);
    assert.equal(wx.includes("executeArcaneOverflowFailBonus"), false);

    const failChance = wxSpellFailChanceBlock();
    assert.ok(failChance.includes("levelUpConfig.spellFailBaseChance"));
    assert.ok(failChance.includes("spellFailReductionPerLevel"));
    assert.equal(failChance.includes("FAIL_BONUS"), false);
    assert.equal(failChance.includes("arcane_overflow"), false);
    assert.equal(failChance.includes("applyEffectApplication"), false);

    const playerFail = resolvePlayerCastFailBlock();
    assert.ok(playerFail.includes("if (!isPhysical)"));
    assert.ok(playerFail.includes("failRoll < ctx.spellFailChance"));
    assert.equal(playerFail.includes("FAIL_BONUS"), false);
    assert.equal(playerFail.includes("arcane_overflow"), false);
    assert.equal(playerFail.includes("applyEffectApplication"), false);
  });

  it("executes Chain Lightning FAIL roll 25 as fizzle at 30, not live cast at 20", () => {
    assert.ok(chainLightning);
    assert.equal(chainLightning?.id, "starter-blast");
    assert.equal(chainLightning?.name, "Chain Lightning");
    assert.equal(chainLightning?.isPhysical, undefined);
    assert.equal(DEFAULT_LEVELUP_CONFIG.spellFailBaseChance, 20);

    const decided = shouldDecideArcaneOverflowFailBonus({
      modifierActive: true,
      isPhysical: false,
      baseFailChance: 20,
    });
    const executable = canExecuteArcaneOverflowFailBonus({
      modifierActive: true,
      isPhysical: false,
      baseFailChance: 20,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      arcaneOverflowHighlightedFailIsExecutable({ decided, executable }),
      true,
    );

    const liveFizzled = 25 < 20;
    assert.equal(
      liveFizzled,
      false,
      "live level-1 FAIL 20 lets roll 25 cast (20 damage lands)",
    );
    assert.deepEqual(
      executeArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
        failRoll: 25,
      }),
      { failChance: 30, fizzled: true },
      "advertised 20+10 must fizzle roll 25 so Chain Lightning does not land",
    );
    assert.deepEqual(
      executeArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
        failRoll: 35,
      }),
      { failChance: 30, fizzled: false },
      "roll 35 is above advertised 30 and must still cast",
    );
    assert.deepEqual(
      executeArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
        failRoll: 10,
      }),
      { failChance: 30, fizzled: true },
      "roll 10 already fizzles on live 20; bonus must not mint a second fizzle flag",
    );
  });

  it("cannot execute Strike, Arcane Surge AP, Iron Curse heal, or a missing modifier as this FAIL", () => {
    assert.ok(strike);
    assert.equal(strike?.isPhysical, true);
    assert.equal(
      canExecuteArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: true,
        baseFailChance: 20,
      }),
      false,
      "physical Strike skips the FAIL roll",
    );
    assert.equal(
      executeArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: true,
        baseFailChance: 20,
        failRoll: 25,
      }),
      null,
    );
    assert.equal(
      canExecuteArcaneOverflowFailBonus({
        modifierActive: false,
        isPhysical: false,
        baseFailChance: 20,
      }),
      false,
    );
    assert.equal(
      executeArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
        failRoll: Number.NaN,
      }),
      null,
    );
    const crit = executeArcaneOverflowFailBonus({
      modifierActive: true,
      isPhysical: false,
      baseFailChance: 20,
      failRoll: 25,
    });
    assert.ok(crit);
    assert.equal(
      crit.failChance,
      30,
      "this execute's unique payload is +10 FAIL",
    );
    assert.equal(crit.fizzled, true);
    assert.equal("apCost" in crit, false, "AP cheaper is already applyApCost");
    assert.equal("heal" in crit, false, "#1155 owns Iron Curse heal ×0.5");
    assert.equal("roll" in crit, false, "#1208 owns Titan 1–5× damage rolls");
    assert.equal(
      "remaining" in crit,
      false,
      "#1206 owns summon-control Inferno remaining",
    );
    assert.equal(
      arcaneOverflowHighlightedFailIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isArcaneOverflowFailModifier("Arcane Overflow"), false);
    assert.equal(isArcaneOverflowFailModifier("arcane_surge"), false);
    assert.equal(
      shouldDecideArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
      }),
      canExecuteArcaneOverflowFailBonus({
        modifierActive: true,
        isPhysical: false,
        baseFailChance: 20,
      }),
    );
  });
});
