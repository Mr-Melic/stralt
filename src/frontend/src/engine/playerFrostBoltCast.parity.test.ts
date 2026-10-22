/**
 * Combat action parity: player Frost Bolt highlight matches advertised MP.
 * A highlighted living hostile is executable with advertised −1 MP / 1;
 * an illegal target cannot execute; live damage-return arms write no MP.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SUMMON_AP } from "../data/gameConstants.ts";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  canAffordPlayerFrostBoltCast,
  canExecutePlayerFrostBoltCast,
  executePlayerFrostBoltCast,
  isPlayerFrostBoltCastSpell,
  isPlayerFrostBoltHostileOccupant,
  playerFrostBoltAdvertisedKinds,
  playerFrostBoltCastApCost,
  playerFrostBoltCastRange,
  playerFrostBoltEffectFields,
  playerFrostBoltHighlightedTargetIsExecutable,
  playerFrostBoltLiveResolveKinds,
  playerFrostBoltWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerFrostBoltCast,
} from "./playerFrostBoltCast.ts";
import { getStatModifier } from "./statusEffects.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  isTileCastableLive,
  pickAttackNearestTile,
  playerSpellRequiresLos,
  shouldExecuteLiveCast,
  spellRangeBase,
} from "./targeting.ts";

function mustSpell(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    side: "enemy",
    ...extras,
  } as Enemy;
}

function bishopKitIds(src: string): string[] {
  const match = src.match(
    /bishop:\s*\(z\)\s*=>\s*z\s*>=\s*1\s*\?\s*\[([^\]]+)\]\s*:\s*\[([^\]]+)\]/,
  );
  if (!match) return [];
  const early = [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return early;
}

describe("player Frost Bolt advertised MP vs damage-return execute", () => {
  const frost = mustSpell("starter-frost");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerFrostBoltCastRange(frost);

  it("treats catalog Frost Bolt as a single-target damage+MP execute spell", () => {
    assert.equal(frost.spellType, "damage");
    assert.equal(Number(frost.damage), 20);
    assert.equal(Number(frost.healAmount ?? 0), 0);
    assert.equal(frost.debuffStat, "mp");
    assert.equal(Number(frost.debuffModifier), -1);
    assert.equal(Number(frost.debuffDuration), 1);
    assert.equal(Number(frost.range), 4);
    assert.equal(Number(frost.apCost), 3);
    assert.equal(frost.targetType, "enemy");
    assert.equal(frost.hitsMultiple ?? false, false);
    assert.equal(isPlayerFrostBoltCastSpell(frost), true);
    assert.equal(playerFrostBoltCastRange(frost), spellRangeBase(frost));
    assert.equal(playerSpellRequiresLos(frost), false);
  });

  it("bishop kit first id is Frost Bolt; summon kits cannot afford AP 3", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(bishopKitIds(src), ["starter-frost"]);
    assert.equal(canAffordPlayerFrostBoltCast(SUMMON_AP.archer, frost), false);
    assert.equal(canAffordPlayerFrostBoltCast(3, frost), true);
  });

  it("does not steal Strike, Slow, Weaken, Drain, Nova, Poison, Shield, Blood Mend, or Inferno", () => {
    assert.equal(isPlayerFrostBoltCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(isPlayerFrostBoltCastSpell(mustSpell("spell-weaken")), false);
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("starter-drain")),
      false,
      "Life Drain keeps the drain arm",
    );
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("spell-frost-nova")),
      false,
      "Frost Nova is hitsMultiple / targetType area",
    );
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(isPlayerFrostBoltCastSpell(mustSpell("starter-heal")), false);
    assert.equal(isPlayerFrostBoltCastSpell(mustSpell("spell-inferno")), false);
    assert.equal(isPlayerFrostBoltCastSpell(mustSpell("spell-expose")), false);
    assert.equal(
      isPlayerFrostBoltCastSpell(mustSpell("spell-cursed-wound")),
      false,
    );
    assert.equal(isPlayerFrostBoltCastSpell(mustSpell("spell-swap")), false);
  });

  it("live resolve/applyCast kinds damage Frost Bolt but miss advertised MP", () => {
    assert.deepEqual(playerFrostBoltLiveResolveKinds(frost), ["damage"]);
    assert.deepEqual(playerFrostBoltAdvertisedKinds(frost), [
      "damage",
      "debuff",
    ]);
    assert.equal(playerFrostBoltWxEnemyAppliesNestedDebuff(), true);
    const engine = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./spellEngine.ts"),
      "utf8",
    );
    const playerFn = engine.slice(
      engine.indexOf("export function resolvePlayerCast"),
      engine.indexOf("function calcScaledDamageInline"),
    );
    assert.equal(
      playerFn.includes("debuffStat"),
      false,
      "live resolvePlayerCast never copies advertised MP",
    );
    const damageArm = engine.indexOf("  // Damage\n  if (spell.damage > 0)");
    const debuffArm = engine.indexOf("  // Debuff\n  if (spell.debuffStat)");
    assert.ok(damageArm > 0 && debuffArm > damageArm);
    const afterDamage = engine.slice(damageArm, debuffArm);
    assert.match(afterDamage, /return;/);
    const executor = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./summonExecutor.ts"),
      "utf8",
    );
    const applyCast = executor.slice(
      executor.indexOf("const applyCast"),
      executor.indexOf("const applyMelee"),
    );
    assert.equal(
      applyCast.includes("debuffStat"),
      false,
      "live applyCast omits debuffStat after damage",
    );
  });

  it("executes Frost Bolt advertised MP on a highlighted living hostile", () => {
    const dest = { x: 6, y: 5 };
    const occupant = unit("rat-1", 6, 5);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(frost, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("6,5"), true, "Chebyshev 2 <= Frost range 4");
    assert.deepEqual(
      collectHighlightLiveMismatches(frost, origin, {
        tiles,
        enemies: combatants,
        worldGridSize: 9,
        effectiveRange: range,
        barrierTiles: new Map(),
      }),
      { highlightOnly: [], liveOnly: [] },
    );
    const args = {
      currentAp: 3,
      spell: frost,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerFrostBoltCast(args);
    const executable = canExecutePlayerFrostBoltCast(args);
    assert.equal(playerFrostBoltCastApCost(frost), 3);
    assert.equal(canAffordPlayerFrostBoltCast(3, frost), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerFrostBoltHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerFrostBoltCast(args), {
      tile: { x: 6, y: 5 },
      targetId: "rat-1",
      debuff: { stat: "mp", modifier: -1, duration: 1 },
    });
    assert.deepEqual(playerFrostBoltEffectFields(frost), {
      stat: "mp",
      modifier: -1,
      duration: 1,
    });
  });

  it("applies advertised MP through getStatModifier; live damage-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerFrostBoltCast({
      currentAp: 3,
      spell: frost,
      origin,
      target: { x: 5, y: 4 },
      occupant,
      liveCombatants: [occupant],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("rat-1", "mp", [
        {
          targetId: "rat-1",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      -1,
    );
    assert.equal(
      getStatModifier("rat-1", "mp", [
        {
          targetId: "rat-1",
          type: "debuff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      0,
      "damage-return applyEffect without debuffStat is a no-op MP write",
    );
  });

  it("cannot execute Frost Bolt out of range, on cooldown, or at 2 AP", () => {
    const big = floorGrid(12);
    const beyond = unit("rat-far", 9, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(frost, origin, { x: 9, y: 4 }, [beyond], big, range),
      ),
      false,
      "Chebyshev 5 > Frost range 4",
    );
    assert.equal(
      canExecutePlayerFrostBoltCast({
        currentAp: 3,
        spell: frost,
        origin,
        target: { x: 9, y: 4 },
        occupant: beyond,
        liveCombatants: [beyond],
        mapTiles: big,
        effectiveRange: range,
      }),
      false,
    );
    assert.equal(
      canExecutePlayerFrostBoltCast({
        currentAp: 2,
        spell: frost,
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: [near],
        mapTiles: tiles,
        effectiveRange: range,
      }),
      false,
    );
    assert.equal(
      executePlayerFrostBoltCast({
        currentAp: 3,
        cooldownTurnsRemaining: 2,
        spell: frost,
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: [near],
        mapTiles: tiles,
        effectiveRange: range,
      }),
      null,
    );
  });

  it("cannot execute Frost Bolt on a corpse, ally, or empty tile", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 3,
      spell: frost,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(frost, origin, dest, [corpse], tiles, range),
      ),
      true,
      "empty-ring live gate still paints corpses like Strike",
    );
    assert.equal(isPlayerFrostBoltHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerFrostBoltCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerFrostBoltCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerFrostBoltCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(frost, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "Strike-like empty ring stays painted; advertised MP cannot land",
    );
  });

  it("still executes a wall-blocked in-range Frost Bolt (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][6] = "wall";
    const dest = { x: 8, y: 4 };
    const occupant = unit("rat-1", 8, 4);
    assert.equal(
      canExecutePlayerFrostBoltCast({
        currentAp: 3,
        spell: frost,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Frost Bolt has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...frost, lineOfSight: true };
    assert.equal(
      canExecutePlayerFrostBoltCast({
        currentAp: 3,
        spell: losOn,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      false,
      "player !!lineOfSight would reject the wall; execute must match highlight",
    );
  });

  it("Attack Nearest picks the highlighted hostile; Strike cannot execute as Frost", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 7, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(frost, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerFrostBoltCast({
        currentAp: 6,
        spell: physicalAttackSpell,
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: combatants,
        mapTiles: tiles,
        effectiveRange: 1,
      }),
      false,
    );
    assert.equal(
      executePlayerFrostBoltCast({
        currentAp: 6,
        spell: mustSpell("spell-slow"),
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: combatants,
        mapTiles: tiles,
        effectiveRange: 3,
      }),
      null,
    );
    assert.equal(
      playerFrostBoltHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
