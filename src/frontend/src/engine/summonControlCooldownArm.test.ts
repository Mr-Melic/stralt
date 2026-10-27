/**
 * Combat action parity: player-controlled summon kit execute must arm
 * advertised Inferno remaining after a legal dest. Live
 * `castControlledSummonSpell` never writes `spellCooldownsRef`.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { isSpellOnCooldown } from "../utils/challengeCompletion.ts";
import {
  planSummonControlCast,
  summonTurnBudget,
} from "../utils/summonControlCast.ts";
import {
  armSummonControlCooldownAfterLegalDest,
  canArmSummonControlCooldown,
  canRecastSummonControlInfernoAfterArm,
  isSummonControlCooldownArmSpell,
  liveWxArmsSummonControlCooldownAfterLegalDest,
  remainingAfterLiveWxSummonControlExecute,
  shouldDecideSummonControlCooldownArm,
  summonControlCooldownArmHighlightedTargetIsExecutable,
  summonControlCooldownArmIsReady,
  summonControlCooldownArmRemaining,
  summonControlCooldownArmTurns,
} from "./summonControlCooldownArm.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

function wxCastControlledSummonSpellBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const castControlledSummonSpell = useCallback(");
  assert.ok(start >= 0, "live castControlledSummonSpell is present");
  const end = wx.indexOf("const applyBattleWalkHazards = useCallback(", start);
  assert.ok(
    end > start,
    "applyBattleWalkHazards still follows the kit execute",
  );
  return wx.slice(start, end);
}

function wxExecuteCastAttemptBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const executeCastAttempt");
  assert.ok(start >= 0, "live executeCastAttempt is present");
  const end = wx.indexOf("const attackNearestEnemy = useCallback(", start);
  assert.ok(end > start, "attackNearestEnemy still follows executeCastAttempt");
  return wx.slice(start, end);
}

describe("player-controlled summon kit execute vs advertised Inferno CD arm", () => {
  const inferno = mustSpell("spell-inferno");
  const poison = mustSpell("starter-poison");
  const venom = mustSpell("spell-venom-strike");
  const frost = mustSpell("starter-frost");
  const slow = mustSpell("spell-slow");
  const mend = mustSpell("starter-heal");
  const iron = mustSpell("spell-iron-skin");
  const drain = mustSpell("starter-drain");
  const bomberSpell = mustSpell("summon-bomber");

  const legalArm = {
    controllingSummon: true,
    remainingBefore: 0,
    executedLegalDest: true,
    spell: inferno,
  };

  it("treats catalog Inferno as the control-path CD-arm leftover", () => {
    assert.equal(inferno.spellType, "damage");
    assert.equal(Number(inferno.damage), 0);
    assert.equal(inferno.isDotSpell, true);
    assert.equal(inferno.effectType, "dot");
    assert.equal(Number(inferno.dotDamagePerTurn), 8);
    assert.equal(Number(inferno.dotDuration), 3);
    assert.equal(Number(inferno.range), 3);
    assert.equal(Number(inferno.apCost), 5);
    assert.equal(Number(inferno.cooldown), 3);
    assert.equal(isSummonControlCooldownArmSpell(inferno), true);
    assert.equal(summonControlCooldownArmTurns(inferno), 3);
    assert.equal(summonControlCooldownArmIsReady(0), true);
    assert.equal(summonControlCooldownArmIsReady(3), false);
    assert.equal(isSpellOnCooldown(3), true);
  });

  it("keys off Inferno metadata, not the display name", () => {
    assert.equal(
      isSummonControlCooldownArmSpell({
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
      isSummonControlCooldownArmSpell({
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
      isSummonControlCooldownArmSpell({
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
    assert.equal(isSummonControlCooldownArmSpell(physicalAttackSpell), false);
    assert.equal(isSummonControlCooldownArmSpell(poison), false);
    assert.equal(isSummonControlCooldownArmSpell(venom), false);
    assert.equal(isSummonControlCooldownArmSpell(frost), false);
    assert.equal(isSummonControlCooldownArmSpell(slow), false);
    assert.equal(isSummonControlCooldownArmSpell(mend), false);
    assert.equal(isSummonControlCooldownArmSpell(iron), false);
    assert.equal(isSummonControlCooldownArmSpell(drain), false);
    assert.equal(
      isSummonControlCooldownArmSpell({}),
      false,
      "empty metadata is not Inferno — do not key off the display name",
    );
  });

  it("Summon Bomber kit is Inferno-only; catalog ap 1 cannot pay Inferno 5", () => {
    assert.deepEqual(bomberSpell.summonUnitDef?.summonKit, ["spell-inferno"]);
    assert.equal(bomberSpell.summonAI, "bomber");
    assert.equal(bomberSpell.summonUnitDef?.ap, 1);
    assert.equal(
      canRecastSummonControlInfernoAfterArm({
        remaining: 0,
        currentAp: 1,
        spell: inferno,
      }),
      false,
      "catalog bomber ap 1 cannot pay Inferno 5 — #762; do not rebalance",
    );
    const wolf = mustSpell("summon-dire-wolf");
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    const archerSpell = mustSpell("summon-archer");
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
  });

  it("live kit execute, plan, and panel never write remaining", () => {
    const kitExecute = wxCastControlledSummonSpellBlock();
    assert.ok(kitExecute.includes("planSummonControlCast("));
    assert.ok(kitExecute.includes("resolveSpellCast("));
    assert.equal(
      kitExecute.includes("spellCooldownsRef"),
      false,
      "control execute still never writes the cooldown map",
    );
    assert.equal(kitExecute.includes("nextSpellCooldownTurns"), false);
    assert.equal(kitExecute.includes("castResultAppliesCooldown"), false);
    assert.equal(
      kitExecute.includes("armSummonControlCooldownAfterLegalDest"),
      false,
    );

    const planSrc = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../utils/summonControlCast.ts",
      ),
      "utf8",
    );
    const planAt = planSrc.indexOf("export function planSummonControlCast");
    assert.ok(planAt >= 0, "live planSummonControlCast is present");
    const nextExport = planSrc.indexOf("\nexport function ", planAt + 1);
    const planBody = planSrc.slice(
      planAt,
      nextExport > planAt ? nextExport : planAt + 4000,
    );
    assert.equal(planBody.includes("cooldown"), false);
    assert.equal(planBody.includes("isSpellOnCooldown"), false);
    assert.equal(planBody.includes("remainingTurns"), false);

    const panel = readFileSync(
      join(
        dirname(fileURLToPath(import.meta.url)),
        "../components/SummonControlPanel.tsx",
      ),
      "utf8",
    );
    assert.equal(panel.includes("cooldown"), false);

    const player = wxExecuteCastAttemptBlock();
    assert.ok(
      player.includes("spellCooldownsRef.current.set"),
      "player executeCastAttempt must keep writing remaining — #708",
    );
    assert.ok(player.includes("nextSpellCooldownTurns"));
    assert.ok(player.includes("castResultAppliesCooldown"));

    assert.equal(liveWxArmsSummonControlCooldownAfterLegalDest(), false);
  });

  it("executes remaining 0 / legal dest as advertised remaining 3", () => {
    const decided = shouldDecideSummonControlCooldownArm(legalArm);
    const executable = canArmSummonControlCooldown(legalArm);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonControlCooldownArmHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(armSummonControlCooldownAfterLegalDest(legalArm), 3);
    assert.equal(remainingAfterLiveWxSummonControlExecute(0), 0);
    assert.equal(
      canRecastSummonControlInfernoAfterArm({
        remaining: armSummonControlCooldownAfterLegalDest(legalArm),
        currentAp: 5,
        spell: inferno,
      }),
      false,
      "advertised remaining 3 must refuse the next Inferno",
    );
    assert.equal(
      canRecastSummonControlInfernoAfterArm({
        remaining: remainingAfterLiveWxSummonControlExecute(0),
        currentAp: 5,
        spell: inferno,
      }),
      true,
      "live remaining 0 still recasts once AP is restored",
    );
  });

  it("next bomber turn restores AP while live remaining stays 0", () => {
    const afterCastAp = 0;
    assert.equal(Number(inferno.apCost), 5);
    const nextTurn = summonTurnBudget({ maxAp: 5, maxMp: 4 });
    assert.equal(nextTurn.currentAp, 5);
    assert.notEqual(nextTurn.currentAp, afterCastAp);
    const liveRemaining = remainingAfterLiveWxSummonControlExecute(0);
    const armedRemaining = armSummonControlCooldownAfterLegalDest(legalArm);
    assert.equal(liveRemaining, 0);
    assert.equal(armedRemaining, 3);
    assert.equal(
      canRecastSummonControlInfernoAfterArm({
        remaining: liveRemaining,
        currentAp: nextTurn.currentAp,
        spell: inferno,
      }),
      true,
    );
    assert.equal(
      canRecastSummonControlInfernoAfterArm({
        remaining: armedRemaining,
        currentAp: nextTurn.currentAp,
        spell: inferno,
      }),
      false,
    );
    const livePlan = planSummonControlCast({
      pieceType: "bomber",
      spellId: "spell-inferno",
      catalog: starterSpells,
      currentAp: nextTurn.currentAp,
      caster: { x: 4, y: 4 },
      target: { x: 7, y: 4 },
    });
    assert.equal(
      livePlan.ok,
      true,
      "live plan still ignores remaining after arm",
    );
  });

  it("cannot arm remaining-already-3, auto-AI, skipped dest, or a missing modifier", () => {
    assert.equal(
      canArmSummonControlCooldown({
        ...legalArm,
        remainingBefore: 3,
      }),
      false,
      "#1205 owns remaining-already-3 highlight vs execute",
    );
    assert.equal(
      armSummonControlCooldownAfterLegalDest({
        ...legalArm,
        remainingBefore: 3,
      }),
      3,
      "already-armed remaining must stay 3, not re-arm",
    );
    assert.equal(
      canArmSummonControlCooldown({
        ...legalArm,
        controllingSummon: false,
      }),
      false,
      "auto-AI applyCast never writing CD is #1166",
    );
    assert.equal(
      armSummonControlCooldownAfterLegalDest({
        ...legalArm,
        controllingSummon: false,
      }),
      0,
    );
    assert.equal(
      canArmSummonControlCooldown({
        ...legalArm,
        executedLegalDest: false,
      }),
      false,
    );
    assert.equal(
      canArmSummonControlCooldown({
        ...legalArm,
        spell: poison,
      }),
      false,
    );
    assert.equal(
      summonControlCooldownArmHighlightedTargetIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
    assert.equal(summonControlCooldownArmRemaining(Number.NaN), 0);
  });

  it("cannot arm Strike, Poison, Frost, Slow, Venom, Drain, or heal as this leftover", () => {
    for (const spell of [
      physicalAttackSpell,
      poison,
      frost,
      slow,
      venom,
      drain,
      mend,
      iron,
    ]) {
      assert.equal(
        canArmSummonControlCooldown({
          ...legalArm,
          spell,
        }),
        false,
        spell.id,
      );
    }
  });
});
