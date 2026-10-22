/**
 * Combat action parity: player Expose highlight matches advertised RES+SP.
 * A highlighted living hostile is executable with advertised res_sp 0.8 / 2;
 * an illegal target cannot execute; live damage-return arms write no shred.
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
  canAffordPlayerExposeCast,
  canExecutePlayerExposeCast,
  executePlayerExposeCast,
  isPlayerExposeCastSpell,
  isPlayerExposeHostileOccupant,
  playerExposeAdvertisedKinds,
  playerExposeCastApCost,
  playerExposeCastRange,
  playerExposeEffectFields,
  playerExposeHighlightedTargetIsExecutable,
  playerExposeLiveResolveKinds,
  playerExposeWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerExposeCast,
} from "./playerExposeCast.ts";
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

describe("player Expose advertised res_sp vs damage-return execute", () => {
  const expose = mustSpell("spell-expose");
  const veil = mustSpell("spell-shadow-veil");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerExposeCastRange(expose);

  it("treats catalog Expose as a single-target damage+RES/SP execute spell", () => {
    assert.equal(expose.spellType, "damage");
    assert.equal(Number(expose.damage), 15);
    assert.equal(Number(expose.healAmount ?? 0), 0);
    assert.equal(expose.debuffStat, "res_sp");
    assert.equal(Number(expose.debuffModifier), 0.8);
    assert.equal(Number(expose.debuffDuration), 2);
    assert.equal(Number(expose.range), 3);
    assert.equal(Number(expose.apCost), 3);
    assert.equal(expose.targetType, "enemy");
    assert.equal(expose.hitsMultiple ?? false, false);
    assert.equal(isPlayerExposeCastSpell(expose), true);
    assert.equal(playerExposeCastRange(expose), spellRangeBase(expose));
    assert.equal(playerSpellRequiresLos(expose), false);
  });

  it("treats Shadow Veil as the same res_sp damage+debuff shape", () => {
    assert.equal(veil.debuffStat, "res_sp");
    assert.equal(Number(veil.damage), 18);
    assert.equal(Number(veil.debuffModifier), 0.85);
    assert.equal(Number(veil.debuffDuration), 2);
    assert.equal(isPlayerExposeCastSpell(veil), true);
  });

  it("bishop kit first id is Frost Bolt, not Expose; summons cannot afford AP 3", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(bishopKitIds(src), ["starter-frost"]);
    assert.equal(canAffordPlayerExposeCast(SUMMON_AP.archer, expose), false);
    assert.equal(canAffordPlayerExposeCast(3, expose), true);
  });

  it("does not steal Strike, Frost, Slow, Weaken, Drain, Nova, Poison, Shield, Wound, or Inferno", () => {
    assert.equal(isPlayerExposeCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("starter-frost")),
      false,
      "#905 owns Frost Bolt MP",
    );
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(isPlayerExposeCastSpell(mustSpell("spell-weaken")), false);
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("starter-drain")),
      false,
      "Life Drain keeps the drain arm",
    );
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("spell-frost-nova")),
      false,
      "Frost Nova is hitsMultiple / targetType area",
    );
    assert.equal(
      isPlayerExposeCastSpell(mustSpell("spell-cursed-wound")),
      false,
      "Cursed Wound keeps healRecv",
    );
    assert.equal(isPlayerExposeCastSpell(mustSpell("starter-poison")), false);
    assert.equal(isPlayerExposeCastSpell(mustSpell("starter-shield")), false);
    assert.equal(isPlayerExposeCastSpell(mustSpell("starter-heal")), false);
    assert.equal(isPlayerExposeCastSpell(mustSpell("spell-inferno")), false);
    assert.equal(isPlayerExposeCastSpell(mustSpell("spell-swap")), false);
  });

  it("live resolve/applyCast kinds damage Expose but miss advertised res_sp", () => {
    assert.deepEqual(playerExposeLiveResolveKinds(expose), ["damage"]);
    assert.deepEqual(playerExposeAdvertisedKinds(expose), ["damage", "debuff"]);
    assert.equal(playerExposeWxEnemyAppliesNestedDebuff(), true);
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
      "live resolvePlayerCast never copies advertised res_sp",
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

  it("executes Expose advertised res_sp on a highlighted living hostile", () => {
    const dest = { x: 6, y: 5 };
    const occupant = unit("rat-1", 6, 5);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(expose, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("6,5"), true, "Chebyshev 2 <= Expose range 3");
    assert.deepEqual(
      collectHighlightLiveMismatches(expose, origin, {
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
      spell: expose,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerExposeCast(args);
    const executable = canExecutePlayerExposeCast(args);
    assert.equal(playerExposeCastApCost(expose), 3);
    assert.equal(canAffordPlayerExposeCast(3, expose), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerExposeHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerExposeCast(args), {
      tile: { x: 6, y: 5 },
      targetId: "rat-1",
      debuff: { stat: "res_sp", modifier: 0.8, duration: 2 },
    });
    assert.deepEqual(playerExposeEffectFields(expose), {
      stat: "res_sp",
      modifier: 0.8,
      duration: 2,
    });
  });

  it("applies advertised res_sp through getStatModifier; live damage-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerExposeCast({
      currentAp: 3,
      spell: expose,
      origin,
      target: { x: 5, y: 4 },
      occupant,
      liveCombatants: [occupant],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("rat-1", "res_sp", [
        {
          targetId: "rat-1",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      0.8,
    );
    assert.equal(
      getStatModifier("rat-1", "res", [
        {
          targetId: "rat-1",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      1,
      "#658 owns mapping res_sp onto res/sp queries; this sidecar only writes",
    );
    assert.equal(
      getStatModifier("rat-1", "res_sp", [
        {
          targetId: "rat-1",
          type: "debuff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      1,
      "damage-return applyEffect without debuffStat is a no-op shred",
    );
  });

  it("cannot execute Expose out of range, on cooldown, or at 2 AP", () => {
    const beyond = unit("rat-far", 8, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(
          expose,
          origin,
          { x: 8, y: 4 },
          [beyond],
          tiles,
          range,
        ),
      ),
      false,
      "Chebyshev 4 > Expose range 3",
    );
    assert.equal(
      canExecutePlayerExposeCast({
        currentAp: 3,
        spell: expose,
        origin,
        target: { x: 8, y: 4 },
        occupant: beyond,
        liveCombatants: [beyond],
        mapTiles: tiles,
        effectiveRange: range,
      }),
      false,
    );
    assert.equal(
      canExecutePlayerExposeCast({
        currentAp: 2,
        spell: expose,
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
      executePlayerExposeCast({
        currentAp: 3,
        cooldownTurnsRemaining: 2,
        spell: expose,
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

  it("cannot execute Expose on a corpse, ally, or empty tile", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 3,
      spell: expose,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(expose, origin, dest, [corpse], tiles, range),
      ),
      true,
      "empty-ring live gate still paints corpses like Strike",
    );
    assert.equal(isPlayerExposeHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerExposeCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerExposeCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerExposeCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(expose, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "Strike-like empty ring stays painted; advertised res_sp cannot land",
    );
  });

  it("still executes a wall-blocked in-range Expose (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][6] = "wall";
    const dest = { x: 7, y: 4 };
    const occupant = unit("rat-1", 7, 4);
    assert.equal(
      canExecutePlayerExposeCast({
        currentAp: 3,
        spell: expose,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Expose has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...expose, lineOfSight: true };
    assert.equal(
      canExecutePlayerExposeCast({
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

  it("Attack Nearest picks the highlighted hostile; Strike cannot execute as Expose", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 6, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(expose, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerExposeCast({
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
      executePlayerExposeCast({
        currentAp: 6,
        spell: mustSpell("starter-frost"),
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: combatants,
        mapTiles: tiles,
        effectiveRange: 4,
      }),
      null,
    );
    assert.equal(
      playerExposeHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
