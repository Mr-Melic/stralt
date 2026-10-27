/**
 * Combat action parity: player-controlled summon Inferno remaining must
 * tick on the summon's turn the way player-bar CD already ticks on the
 * player's turn. Live control-mode dispatch never decrements remaining.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import {
  canExecuteSummonControlCooldownTick,
  executeSummonControlCooldownTick,
  isSummonControlCooldownTickSpell,
  liveWxPlayerTurnTicksSpellCooldowns,
  liveWxSummonControlTurnTicksCooldown,
  shouldTickSummonControlCooldown,
  summonControlCooldownTickHighlightedIsExecutable,
  summonControlCooldownTickIsReady,
  summonControlCooldownTickTurns,
  tickSummonControlCooldownRemaining,
  wxSummonControlCastWritesRemaining,
} from "./summonControlCooldownTick.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function playerCooldownTickBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("spellCooldownsRef.current.forEach((cd, id) => {");
  assert.ok(start >= 0, "live player-bar CD tick is present");
  return wx.slice(start, start + 220);
}

function summonControlModeBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf('Player-side summons enter "control mode"');
  assert.ok(start >= 0, "live control-mode dispatch is present");
  const end = wx.indexOf("Enemy summons are hostiles", start);
  assert.ok(end > start, "enemy-summon branch still follows control mode");
  return wx.slice(start, end);
}

function controlledSummonCastBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const castControlledSummonSpell = useCallback(");
  assert.ok(start >= 0, "live castControlledSummonSpell is present");
  const end = wx.indexOf("const applyBattleWalkHazards = useCallback(", start);
  assert.ok(end > start, "walk-hazard helper still follows summon cast");
  return wx.slice(start, end);
}

describe("player-controlled summon Inferno remaining vs summon-turn tick", () => {
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const mend = mustSpell("starter-heal");
  const drain = mustSpell("starter-drain");
  const bomberSpell = mustSpell("summon-bomber");
  const wolf = mustSpell("summon-dire-wolf");
  const archerSpell = mustSpell("summon-archer");

  const readyTick = {
    isPlayerSideSummonTurn: true,
    remaining: 3,
    spell: inferno,
  };

  it("treats catalog Inferno as the summon-turn CD tick leftover", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(isSummonControlCooldownTickSpell(inferno), true);
    assert.equal(summonControlCooldownTickTurns(inferno), 3);
    assert.equal(summonControlCooldownTickIsReady(0), true);
    assert.equal(summonControlCooldownTickIsReady(3), false);
    assert.equal(isSpellOnCooldown(3), true);
    assert.deepEqual(
      starterSpells.filter((s) => Number(s.cooldown) > 0).map((s) => s.id),
      ["spell-inferno"],
      "Inferno is the only starter row with advertised CD",
    );
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isSummonControlCooldownTickSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 8,
        dotDuration: 3,
        range: 3,
        apCost: 5,
        cooldown: 3,
      }),
      true,
    );
    assert.equal(
      isSummonControlCooldownTickSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        apCost: 2,
        cooldown: 3,
      }),
      false,
      "Poison-shaped range-4 DoT is #1095/#1096, not this leftover",
    );
    assert.equal(
      isSummonControlCooldownTickSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 2,
        apCost: 3,
        cooldown: 3,
      }),
      false,
      "Venom-shaped range-2 DoT is #856/#1123, not this leftover",
    );
    assert.equal(isSummonControlCooldownTickSpell(physicalAttackSpell), false);
    assert.equal(isSummonControlCooldownTickSpell(poison), false);
    assert.equal(isSummonControlCooldownTickSpell(venom), false);
    assert.equal(isSummonControlCooldownTickSpell(frost), false);
    assert.equal(isSummonControlCooldownTickSpell(slow), false);
    assert.equal(isSummonControlCooldownTickSpell(mend), false);
    assert.equal(isSummonControlCooldownTickSpell(drain), false);
    assert.equal(
      isSummonControlCooldownTickSpell({}),
      false,
      "empty metadata is not Inferno — do not key off the display name",
    );
  });

  it("Summon Bomber kit is Inferno-only; catalog ap 1 cannot pay Inferno 5", () => {
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonAI, "bomber");
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
  });

  it("matches the player-bar clock: 3→2, 1→0 ready, 0 stays ready", () => {
    assert.equal(tickSummonControlCooldownRemaining(3), 2);
    assert.equal(tickSummonControlCooldownRemaining(2), 1);
    assert.equal(tickSummonControlCooldownRemaining(1), 0);
    assert.equal(tickSummonControlCooldownRemaining(0), 0);
    assert.equal(tickSummonControlCooldownRemaining(undefined), 0);
    assert.equal(tickSummonControlCooldownRemaining(Number.NaN), 0);
    assert.equal(tickSummonControlCooldownRemaining(-4), 0);
  });

  it("executes remaining 3 as 2 on a player-side summon turn", () => {
    const decided = shouldTickSummonControlCooldown(readyTick);
    const executable = canExecuteSummonControlCooldownTick(readyTick);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlCooldownTickHighlightedIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.deepEqual(executeSummonControlCooldownTick(readyTick), {
      remaining: 2,
    });
    assert.deepEqual(
      executeSummonControlCooldownTick({
        ...readyTick,
        remaining: 1,
      }),
      { remaining: 0 },
      "remaining 1 must become ready so Inferno is not locked forever after #1206 arms",
    );
  });

  it("live control-mode dispatch never ticks remaining; player-bar tick is a different clock", () => {
    assert.equal(liveWxSummonControlTurnTicksCooldown(), false);
    assert.equal(liveWxPlayerTurnTicksSpellCooldowns(), true);
    assert.equal(wxSummonControlCastWritesRemaining(), false);

    const playerTick = playerCooldownTickBlock();
    assert.ok(playerTick.includes("if (cd > 1)"));
    assert.ok(playerTick.includes("spellCooldownsRef.current.set(id, cd - 1)"));
    assert.ok(playerTick.includes("spellCooldownsRef.current.delete(id)"));

    const control = summonControlModeBlock();
    assert.ok(control.includes("summonTurnBudget"));
    assert.ok(control.includes("processActiveEffects"));
    assert.equal(control.includes("spellCooldownsRef"), false);
    assert.equal(control.includes("cd - 1"), false);
    assert.equal(control.includes("executeSummonControlCooldownTick"), false);
    assert.equal(control.includes("tickSummonControlCooldownRemaining"), false);

    const cast = controlledSummonCastBlock();
    assert.ok(cast.includes("planSummonControlCast"));
    assert.ok(cast.includes("resolveSpellCast"));
    assert.equal(cast.includes("spellCooldownsRef"), false);
    assert.equal(cast.includes("nextSpellCooldownTurns"), false);
    assert.equal(cast.includes("castResultAppliesCooldown"), false);
    assert.equal(cast.includes("cooldownTurns"), false);
  });

  it("cannot execute player-turn, auto-AI, remaining 0, or a missing modifier as this tick", () => {
    assert.equal(
      shouldTickSummonControlCooldown({
        ...readyTick,
        isPlayerSideSummonTurn: false,
      }),
      false,
      "player-turn spellCooldownsRef tick is #708, not this leftover",
    );
    assert.equal(
      executeSummonControlCooldownTick({
        ...readyTick,
        isPlayerSideSummonTurn: false,
      }),
      null,
    );
    assert.equal(
      shouldTickSummonControlCooldown({
        ...readyTick,
        remaining: 0,
      }),
      false,
      "remaining 0 is already ready — tick must not mint a lock",
    );
    assert.equal(
      executeSummonControlCooldownTick({
        ...readyTick,
        remaining: 0,
      }),
      null,
    );
    assert.equal(
      executeSummonControlCooldownTick({
        ...readyTick,
        remaining: Number.NaN,
      }),
      null,
    );
    const crit = executeSummonControlCooldownTick(readyTick);
    assert.ok(crit);
    assert.equal(crit.remaining, 2);
    assert.equal("armed" in crit, false, "#1206 owns arm-after-dest");
    assert.equal("selected" in crit, false, "#1211 owns kit select");
    assert.equal(
      summonControlCooldownTickHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("cannot tick Strike, Poison, Frost, Slow, Venom, Drain, or heal as this leftover", () => {
    for (const spell of [
      physicalAttackSpell,
      poison,
      frost,
      slow,
      venom,
      drain,
      mend,
    ]) {
      assert.equal(
        shouldTickSummonControlCooldown({
          ...readyTick,
          spell,
        }),
        false,
        spell.id,
      );
    }
  });

  it("hunter, archer, and queen kits cannot fire this leftover", () => {
    assert.equal(wolf.summonAI, "hunter");
    assert.equal(archerSpell.summonAI, "archer");
    assert.equal(
      shouldTickSummonControlCooldown({
        ...readyTick,
        spell: venom,
      }),
      false,
      "hunter Venom is #1123",
    );
    assert.equal(
      shouldTickSummonControlCooldown({
        ...readyTick,
        spell: poison,
      }),
      false,
      "archer Poison is #1095/#1096",
    );
    assert.equal(
      shouldTickSummonControlCooldown({
        ...readyTick,
        spell: frost,
      }),
      false,
      "queen Frost is pack leftover, not summon-turn CD tick",
    );
  });
});
