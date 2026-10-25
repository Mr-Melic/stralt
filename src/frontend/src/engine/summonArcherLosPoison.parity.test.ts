/**
 * Combat action parity: auto-summon `decideSummonArcher` LoS-reposition vs
 * advertised in-range Poison. A decided legal Poison dest (living opposite-
 * side occupant in Chebyshev range, LoS blocked so live would sidestep,
 * 2-AP wallet can pay) is executable; an illegal dest cannot execute;
 * live still repositions.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AI_LOS_REPOSITION_ENABLED } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  canExecuteSummonArcherLosPoisonCast,
  isSummonArcherLosPoisonArchetype,
  isSummonArcherLosPoisonBlockedInfernoSpell,
  isSummonArcherLosPoisonBlockedVenomSpell,
  isSummonArcherLosPoisonSpell,
  pickSummonArcherLosPoisonSpell,
  shouldDecideSummonArcherLosPoisonCast,
  summonArcherLiveWouldRepositionLosForPoison,
  summonArcherLosPoisonApCost,
  summonArcherLosPoisonHighlightedTargetIsExecutable,
  summonArcherLosPoisonInRange,
  summonArcherLosPoisonLivePreferredSpell,
  summonArcherLosPoisonRange,
  summonArcherLosPoisonSpellRequiresLos,
} from "./summonArcherLosPoison.ts";
import {
  canAffordCastAp,
  enemyCastRangeOk,
  enemySpellRange,
  enemySpellRequiresLos,
} from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function opponentAt(id: string, x: number, y: number, hp = 40) {
  return { id, x, y, hp, side: "enemy" as const };
}

function archerAt(
  id: string,
  x: number,
  y: number,
  hp = 60,
  summonAI = "archer",
) {
  return {
    id,
    x,
    y,
    hp,
    maxHp: 60,
    side: "player" as const,
    isSummon: true,
    summonAI,
  };
}

describe("auto-summon decideSummonArcher LoS-reposition vs advertised Poison", () => {
  const poison = mustSpell("starter-poison");
  const slow = mustSpell("spell-slow");
  const venom = mustSpell("spell-venom-strike");
  const inferno = mustSpell("spell-inferno");
  const frost = mustSpell("starter-frost");
  const origin = { x: 4, y: 4 };
  const poisonDest = { x: 8, y: 4 };
  const archer = archerAt("archer-1", 4, 4);
  const opponents = [opponentAt("enemy-1", 8, 4)];
  const occupant = opponents[0];

  it("treats catalog Poison Arrow as the LoS-reposition leftover", () => {
    assert.equal(poison.spellType, "damage");
    assert.equal(Number(poison.damage), 0);
    assert.equal(poison.isDotSpell, true);
    assert.equal(poison.effectType, "dot");
    assert.equal(Number(poison.dotDamagePerTurn), 4);
    assert.equal(Number(poison.dotDuration), 3);
    assert.equal(Number(poison.range), 4);
    assert.equal(Number(poison.apCost), 2);
    assert.equal(poison.lineOfSight, undefined);
    assert.equal(isSummonArcherLosPoisonSpell(poison), true);
    assert.equal(summonArcherLosPoisonRange(poison), enemySpellRange(poison));
    assert.equal(summonArcherLosPoisonSpellRequiresLos(poison), true);
    assert.equal(enemySpellRequiresLos(poison), true);
    assert.equal(summonArcherLosPoisonApCost(poison), 2);
    assert.equal(AI_LOS_REPOSITION_ENABLED, true);
  });

  it("keys off summonAI archer/kiter and Poison metadata, not display names", () => {
    assert.equal(isSummonArcherLosPoisonArchetype("archer"), true);
    assert.equal(isSummonArcherLosPoisonArchetype("kiter"), true);
    assert.equal(isSummonArcherLosPoisonArchetype("hunter"), false);
    assert.equal(isSummonArcherLosPoisonArchetype("bomber"), false);
    assert.equal(isSummonArcherLosPoisonArchetype("healer"), false);
    assert.equal(
      isSummonArcherLosPoisonSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 4,
        apCost: 2,
        targetType: "enemy",
      }),
      true,
    );
    assert.equal(
      isSummonArcherLosPoisonSpell({
        spellType: "damage",
        damage: 0,
        isDotSpell: true,
        effectType: "dot",
        dotDamagePerTurn: 4,
        dotDuration: 3,
        range: 2,
        targetType: "enemy",
      }),
      false,
      "Venom-shaped range 2 is the hunter leftover, not this sidecar",
    );
  });

  it("does not steal Strike, Slow, Venom, Inferno, Frost, Drain, or heal", () => {
    assert.equal(isSummonArcherLosPoisonSpell(physicalAttackSpell), false);
    assert.equal(
      isSummonArcherLosPoisonSpell(slow),
      false,
      "#878 owns summon Slow",
    );
    assert.equal(
      isSummonArcherLosPoisonSpell(venom),
      false,
      "hunter Venom is 3 AP on a 2-AP wolf",
    );
    assert.equal(isSummonArcherLosPoisonBlockedVenomSpell(venom), true);
    assert.equal(
      isSummonArcherLosPoisonSpell(inferno),
      false,
      "#799/#967 own Inferno",
    );
    assert.equal(isSummonArcherLosPoisonBlockedInfernoSpell(inferno), true);
    assert.equal(
      isSummonArcherLosPoisonSpell(frost),
      false,
      "#1081 owns pack caster LoS Frost",
    );
    assert.equal(
      isSummonArcherLosPoisonSpell(mustSpell("starter-heal")),
      false,
    );
    assert.equal(
      isSummonArcherLosPoisonSpell(mustSpell("starter-drain")),
      false,
    );
    assert.equal(
      isSummonArcherLosPoisonSpell(mustSpell("spell-iron-skin")),
      false,
    );
  });

  it("Summon Archer kit is Poison then Slow; wolf/bomber kits are not", () => {
    const archerSpell = mustSpell("summon-archer");
    assert.deepEqual(archerSpell.summonUnitDef?.summonKit, [
      "starter-poison",
      "spell-slow",
    ]);
    assert.equal(archerSpell.summonAI, "archer");
    assert.equal(archerSpell.summonUnitDef?.ap, 2);
    const wolf = mustSpell("summon-dire-wolf");
    assert.deepEqual(wolf.summonUnitDef?.summonKit, [
      "physical_attack",
      "spell-venom-strike",
    ]);
    const bomber = mustSpell("summon-bomber");
    assert.deepEqual(bomber.summonUnitDef?.summonKit, ["spell-inferno"]);
  });

  it("live decideSummonArcher still sidesteps in-range LoS-blocked Poison", () => {
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "enemyAI.ts"),
      "utf8",
    );
    const start = ai.indexOf("function decideSummonArcher");
    assert.ok(start >= 0, "live decideSummonArcher is present");
    const body = ai.slice(start, start + 2800);
    assert.match(body, /const poison = findKitSpell\(kit\[0]/);
    assert.match(body, /const preferred = poison \?\? slow/);
    assert.match(body, /aiCanCast\(origin, targetCell, preferred/);
    assert.match(body, /repositionForLOS/);
    assert.match(body, /intent: "reposition-los"/);
    const exec = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "summonExecutor.ts"),
      "utf8",
    );
    const applyCastAt = exec.indexOf("const applyCast = ");
    assert.ok(applyCastAt >= 0, "live applyCast is present");
    const applyCast = exec.slice(applyCastAt, applyCastAt + 1800);
    assert.equal(applyCast.includes("hasLineOfSight"), false);
    assert.equal(applyCast.includes("enemySpellRequiresLos"), false);
    assert.match(applyCast, /currentAp < apCost/);
  });

  it("live would sidestep wall-blocked in-range Poison on a 2-AP archer", () => {
    assert.equal(
      summonArcherLiveWouldRepositionLosForPoison({
        summonAI: "archer",
        availableSpells: [poison, slow],
        origin,
        targetCell: poisonDest,
        caster: archer,
        opponents,
        currentAp: 2,
        hasLoS: false,
      }),
      true,
    );
    assert.equal(
      summonArcherLosPoisonLivePreferredSpell({
        availableSpells: [poison, slow],
      })?.id,
      "starter-poison",
    );
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "archer",
        availableSpells: [poison, slow],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archer,
        currentAp: 2,
        hasLoS: false,
      })?.id,
      "starter-poison",
    );
  });

  it("kiter alias is the same leftover; hunter/bomber cannot steal it", () => {
    const kiter = archerAt("kiter-1", 4, 4, 60, "kiter");
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "kiter",
        availableSpells: [poison],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: kiter,
        currentAp: 2,
        hasLoS: false,
      })?.id,
      "starter-poison",
    );
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "hunter",
        availableSpells: [poison],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archerAt("wolf-1", 4, 4, 80, "hunter"),
        currentAp: 2,
        hasLoS: false,
      }),
      null,
    );
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "bomber",
        availableSpells: [poison],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archerAt("bomb-1", 4, 4, 50, "bomber"),
        currentAp: 2,
        hasLoS: false,
      }),
      null,
    );
  });

  it("highlighted legal Poison dest executes; decide and execute cannot fork", () => {
    const args = {
      spell: poison,
      summonAI: "archer",
      availableSpells: [poison, slow],
      origin,
      targetCell: poisonDest,
      occupant,
      opponents,
      caster: archer,
      casterSide: "player" as const,
      currentAp: 2,
      hasLoS: false,
    };
    const decided = shouldDecideSummonArcherLosPoisonCast(args);
    const executable = canExecuteSummonArcherLosPoisonCast(args);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      summonArcherLosPoisonHighlightedTargetIsExecutable({
        decided,
        executable,
      }),
      true,
    );
    assert.equal(decided, executable);
    assert.equal(
      summonArcherLosPoisonInRange(origin, poisonDest, poison),
      enemyCastRangeOk(origin, poisonDest, poison),
    );
    assert.equal(canAffordCastAp(2, Number(poison.apCost)), true);
  });

  it("clear LoS is live already-cast, not this leftover", () => {
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "archer",
        availableSpells: [poison],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archer,
        currentAp: 2,
        hasLoS: true,
      }),
      null,
    );
  });

  it("Chebyshev 5 is out of Poison range", () => {
    const far = { x: 9, y: 4 };
    const farOccupant = opponentAt("enemy-far", 9, 4);
    assert.equal(
      shouldDecideSummonArcherLosPoisonCast({
        spell: poison,
        summonAI: "archer",
        availableSpells: [poison],
        origin,
        targetCell: far,
        occupant: farOccupant,
        opponents: [farOccupant],
        caster: archer,
        casterSide: "player",
        currentAp: 2,
        hasLoS: false,
      }),
      false,
    );
  });

  it("corpse, ally, empty, and missing occupant cannot execute", () => {
    const base = {
      spell: poison,
      summonAI: "archer",
      availableSpells: [poison],
      origin,
      targetCell: poisonDest,
      opponents,
      caster: archer,
      casterSide: "player" as const,
      currentAp: 2,
      hasLoS: false,
    };
    assert.equal(
      canExecuteSummonArcherLosPoisonCast({
        ...base,
        occupant: { ...occupant, hp: 0 },
      }),
      false,
    );
    assert.equal(
      canExecuteSummonArcherLosPoisonCast({
        ...base,
        occupant: { ...occupant, side: "player" },
      }),
      false,
    );
    assert.equal(
      canExecuteSummonArcherLosPoisonCast({
        ...base,
        occupant: null,
      }),
      false,
    );
    assert.equal(
      canExecuteSummonArcherLosPoisonCast({
        ...base,
        occupant: { ...occupant, x: 7, y: 4 },
      }),
      false,
    );
  });

  it("1 AP cannot pay applyCast; 2 AP can", () => {
    const args = {
      spell: poison,
      summonAI: "archer",
      availableSpells: [poison],
      origin,
      targetCell: poisonDest,
      occupant,
      opponents,
      caster: archer,
      casterSide: "player" as const,
      hasLoS: false,
    };
    assert.equal(
      shouldDecideSummonArcherLosPoisonCast({ ...args, currentAp: 1 }),
      false,
    );
    assert.equal(
      shouldDecideSummonArcherLosPoisonCast({ ...args, currentAp: 2 }),
      true,
    );
  });

  it("Slow-only kit is not this leftover", () => {
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "archer",
        availableSpells: [slow],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archer,
        currentAp: 2,
        hasLoS: false,
      }),
      null,
    );
  });

  it("Venom-only hunter kit is not this leftover even in Poison range", () => {
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "hunter",
        availableSpells: [venom],
        origin,
        targetCell: { x: 6, y: 4 },
        opponents: [opponentAt("enemy-1", 6, 4)],
        caster: archerAt("wolf-1", 4, 4, 80, "hunter"),
        currentAp: 3,
        hasLoS: false,
      }),
      null,
    );
  });

  it("pack bishop Poison without summonAI archer cannot steal this leftover", () => {
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: undefined,
        availableSpells: [poison],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: {
          id: "bishop-1",
          x: 4,
          y: 4,
          hp: 80,
          maxHp: 100,
          side: "enemy",
        },
        currentAp: 2,
        hasLoS: false,
      }),
      null,
      "#967 owns pack DoT decide",
    );
  });

  it("lineOfSight false is live already-cast through the wall", () => {
    const noLos = { ...poison, lineOfSight: false };
    assert.equal(summonArcherLosPoisonSpellRequiresLos(noLos), false);
    assert.equal(
      pickSummonArcherLosPoisonSpell({
        summonAI: "archer",
        availableSpells: [noLos],
        origin,
        targetCell: poisonDest,
        opponents,
        caster: archer,
        currentAp: 2,
        hasLoS: false,
      }),
      null,
    );
  });
});
