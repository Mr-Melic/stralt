/**
 * Combat action parity: Iron Curse advertised healing ×0.5 commits.
 * Live WX heal sites write the full packet; the registry heal hook is dead.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER } from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import {
  IRON_CURSE_MODIFIER_ID,
  canExecuteIronCurseHealScale,
  executeIronCurseHealScale,
  ironCurseHealAmount,
  ironCurseHighlightedHealIsExecutable,
  isIronCurseModifier,
  liveWxIronCurseHealHalves,
  shouldDecideIronCurseHealScale,
  wxApplyEffectApplicationSeesHeal,
  wxEnemySelfHealAppliesIronCurse,
  wxHasIronCurseFlag,
  wxPlayerHealAppliesIronCurse,
  wxSummonHealAppliesIronCurse,
} from "./ironCurseHealScale.ts";
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

function gameTypesSource(): string {
  return readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../types/gameTypes.ts"),
    "utf8",
  );
}

function playerHealCallback(): string {
  const wx = wxSource();
  const start = wx.indexOf("heal: (combatantId: string, amount: number) => {");
  assert.ok(start >= 0, "live player ctx.heal is present");
  const end = wx.indexOf("applyEffect: (effect: ActiveEffectLike) => {", start);
  assert.ok(end > start, "applyEffect still follows player ctx.heal");
  return wx.slice(start, end);
}

function summonHealCallback(): string {
  const wx = wxSource();
  const first = wx.indexOf("heal: (combatantId: string, amount: number) => {");
  const start = wx.indexOf(
    "heal: (combatantId: string, amount: number) => {",
    first + 1,
  );
  assert.ok(start > first, "live summon-control heal callback is present");
  const end = wx.indexOf("applyEffect: (effect: ActiveEffectLike) => {", start);
  assert.ok(end > start, "applyEffect still follows summon ctx.heal");
  return wx.slice(start, end);
}

function applyActiveEffectBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const applyActiveEffect = useCallback(");
  assert.ok(start >= 0, "live applyActiveEffect is present");
  const end = wx.indexOf("const processActiveEffects = useCallback(", start);
  assert.ok(
    end > start,
    "processActiveEffects still follows applyActiveEffect",
  );
  return wx.slice(start, end);
}

function enemySelfHealBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    'inRange && spellType === "heal" && spellRange === 0',
  );
  assert.ok(start >= 0, "live enemy range-0 heal branch is present");
  const end = wx.indexOf("heals ${ha} HP", start);
  assert.ok(end > start, "enemy heal log still follows hpAfterHeal");
  return wx.slice(start, end);
}

describe("Iron Curse advertised healing ×0.5 vs WX full heal write", () => {
  it("catalog multiplier is 0.5 and the registry heal hook only logs then permits", () => {
    assert.equal(MAP_MODIFIER_IRON_CURSE_HEALING_MULTIPLIER, 0.5);
    assert.equal(isIronCurseModifier(IRON_CURSE_MODIFIER_ID), true);
    assert.equal(isIronCurseModifier("vampiric_ground"), false);
    assert.equal(isIronCurseModifier("mending_mist"), false);
    const def = MAP_MODIFIERS.find((m) => m.id === IRON_CURSE_MODIFIER_ID);
    assert.ok(def);
    assert.equal(def?.announceText, "Iron Curse: +30% RES, healing halved.");
    const logs: string[] = [];
    assert.equal(
      mapModifierRegistry.applyEffectApplication(
        "heal",
        new Set([IRON_CURSE_MODIFIER_ID]),
        { log: (msg) => logs.push(msg), rng: () => 0 },
      ),
      true,
      "hook claims WX will scale; it must not veto the heal",
    );
    assert.ok(logs.some((line) => line.includes("halves healing")));
    assert.equal(ironCurseHealAmount(12), 6);
    assert.equal(ironCurseHealAmount(20), 10);
    assert.equal(ironCurseHealAmount(5), 2, "floor(5 * 0.5) = 2");
    assert.equal(ironCurseHealAmount(1), 0, "floor(1 * 0.5) = 0");
    assert.equal(ironCurseHealAmount(0), 0);
    assert.equal(ironCurseHealAmount(-8), 0);
    assert.equal(ironCurseHealAmount(Number.NaN), 0);
  });

  it("live WX heal sites write the full packet; applyActiveEffect never sees heal", () => {
    assert.equal(wxPlayerHealAppliesIronCurse(), false);
    assert.equal(wxSummonHealAppliesIronCurse(), false);
    assert.equal(wxEnemySelfHealAppliesIronCurse(), false);
    assert.equal(wxApplyEffectApplicationSeesHeal(), false);
    assert.equal(wxHasIronCurseFlag(), false);
    assert.equal(liveWxIronCurseHealHalves(), false);

    const types = gameTypesSource();
    assert.ok(types.includes('type: "buff" | "debuff" | "dot"'));
    assert.equal(
      types.includes('type: "buff" | "debuff" | "dot" | "heal"'),
      false,
      "ActiveEffect still has no heal variant that could reach the hook",
    );

    const player = playerHealCallback();
    assert.ok(player.includes("hp: Math.min(maxHp, prev.hp + amount)"));
    assert.equal(
      player.includes("iron_curse"),
      false,
      "player ctx.heal still does not read the Iron Curse id",
    );
    assert.equal(
      player.includes("IRON_CURSE"),
      false,
      "player ctx.heal still does not import the 0.5 constant",
    );
    assert.equal(player.includes("0.5"), false);

    const summon = summonHealCallback();
    assert.ok(summon.includes("hp: Math.min(maxHp, prev.hp + amount)"));
    assert.equal(summon.includes("iron_curse"), false);
    assert.equal(summon.includes("0.5"), false);

    const apply = applyActiveEffectBlock();
    assert.ok(apply.includes("mapModifierRegistry.applyEffectApplication("));
    assert.ok(apply.includes("effect.type"));
    assert.equal(
      apply.includes('"heal"'),
      false,
      "applyActiveEffect still never passes effectType heal",
    );

    const enemy = enemySelfHealBlock();
    assert.ok(enemy.includes("hpAfterHeal("));
    assert.equal(enemy.includes("iron_curse"), false);
    assert.equal(enemy.includes("0.5"), false);

    const wx = wxSource();
    assert.ok(wx.includes("const isPlagueZone = activeMapModifierTypes.has"));
    assert.ok(wx.includes("const isVoidRift = activeMapModifierTypes.has"));
    assert.equal(
      wx.includes("isIronCurse"),
      false,
      "WX still has no isIronCurse flag next to the other modifier flags",
    );
    assert.equal(
      wx.includes("iron_curse"),
      false,
      "WX still never mentions iron_curse",
    );
  });

  it("executes Blood Mend 12 at 80/100 as 80→86 and caps at maxHp", () => {
    const bloodMend = starterSpells.find((s) => s.id === "starter-heal");
    assert.ok(bloodMend);
    assert.equal(bloodMend?.healAmount, 12);
    const decided = shouldDecideIronCurseHealScale({
      modifierActive: true,
      healAmount: 12,
    });
    const executable = canExecuteIronCurseHealScale({
      modifierActive: true,
      healAmount: 12,
    });
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      ironCurseHighlightedHealIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeIronCurseHealScale({
        modifierActive: true,
        healAmount: 12,
        currentHp: 80,
        maxHp: 100,
      }),
      { heal: 6, hpAfter: 86 },
    );
    assert.deepEqual(
      executeIronCurseHealScale({
        modifierActive: true,
        healAmount: 20,
        currentHp: 95,
        maxHp: 100,
      }),
      { heal: 10, hpAfter: 100 },
    );
  });

  it("cannot execute Vampiric Ground, drain healAmount, or a missing packet as this scale", () => {
    assert.equal(
      canExecuteIronCurseHealScale({
        modifierActive: false,
        healAmount: 12,
      }),
      false,
    );
    assert.equal(
      executeIronCurseHealScale({
        modifierActive: true,
        healAmount: 1,
        currentHp: 80,
        maxHp: 100,
      }),
      null,
      "floor(1 * 0.5) = 0 must not mint HP",
    );
    assert.equal(
      executeIronCurseHealScale({
        modifierActive: true,
        healAmount: 0,
        currentHp: 80,
        maxHp: 100,
      }),
      null,
    );
    const crit = executeIronCurseHealScale({
      modifierActive: true,
      healAmount: 12,
      currentHp: 80,
      maxHp: 100,
    });
    assert.equal(
      crit != null && "healAmount" in crit,
      false,
      "#644 / #921 own drain healAmount",
    );
    assert.equal(
      crit != null && "healUsed" in crit,
      false,
      "challenge healUsed stays on #380",
    );
    assert.equal(
      crit != null && "res" in crit,
      false,
      "player RES ×1.3 is a sibling of applyBattleStart on combatantsRef",
    );
    assert.equal(
      crit != null && "chc" in crit,
      false,
      "#692 owns Blood Mend CHC",
    );
    assert.equal(
      ironCurseHighlightedHealIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off modifier id metadata, not the announce copy", () => {
    assert.equal(isIronCurseModifier("Iron Curse"), false);
    assert.equal(isIronCurseModifier("vampiric_ground"), false);
    assert.equal(
      shouldDecideIronCurseHealScale({
        modifierActive: true,
        healAmount: 12,
      }),
      canExecuteIronCurseHealScale({
        modifierActive: true,
        healAmount: 12,
      }),
    );
  });
});
