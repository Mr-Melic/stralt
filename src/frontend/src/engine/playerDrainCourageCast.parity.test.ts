/**
 * Combat action parity: player Drain Courage highlight matches advertised AP.
 * A highlighted living hostile is executable with advertised AP −1 / 1;
 * an illegal target cannot execute; live drain-return arms write no shred.
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
  canAffordPlayerDrainCourageCast,
  canExecutePlayerDrainCourageCast,
  executePlayerDrainCourageCast,
  isPlayerDrainCourageCastSpell,
  isPlayerDrainCourageHostileOccupant,
  playerDrainCourageAdvertisedKinds,
  playerDrainCourageCastApCost,
  playerDrainCourageCastRange,
  playerDrainCourageEffectFields,
  playerDrainCourageHighlightedTargetIsExecutable,
  playerDrainCourageLiveResolveKinds,
  playerDrainCourageWxBossAppliesNestedDebuff,
  playerDrainCourageWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerDrainCourageCast,
} from "./playerDrainCourageCast.ts";
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

function phase1FirstId(src: string, bossId: string): string | null {
  const block = src.split(`${bossId}:`)[1] ?? "";
  const match = block.match(/phase1SpellIds:\s*\[([^\]]+)\]/);
  if (!match) return null;
  const first = match[1].match(/"([^"]+)"/);
  return first?.[1] ?? null;
}

function bishopKitIds(src: string): string[] {
  const match = src.match(
    /bishop:\s*\(z\)\s*=>\s*z\s*>=\s*1\s*\?\s*\[([^\]]+)\]\s*:\s*\[([^\]]+)\]/,
  );
  if (!match) return [];
  return [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

describe("player Drain Courage advertised AP vs drain-return execute", () => {
  const courage = mustSpell("spell-drain-courage");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerDrainCourageCastRange(courage);

  it("treats catalog Drain Courage as a single-target drain+AP execute spell", () => {
    assert.equal(courage.spellType, "drain");
    assert.equal(courage.effectType, "drain");
    assert.equal(Number(courage.damage), 18);
    assert.equal(Number(courage.healAmount ?? 0), 9);
    assert.equal(courage.debuffStat, "ap");
    assert.equal(Number(courage.debuffModifier), -1);
    assert.equal(Number(courage.debuffDuration), 1);
    assert.equal(Number(courage.range), 2);
    assert.equal(Number(courage.apCost), 4);
    assert.equal(courage.targetType, "enemy");
    assert.equal(courage.hitsMultiple ?? false, false);
    assert.equal(isPlayerDrainCourageCastSpell(courage), true);
    assert.equal(playerDrainCourageCastRange(courage), spellRangeBase(courage));
    assert.equal(playerSpellRequiresLos(courage), false);
  });

  it("Vampire / Eternal Pawn first-id is not Drain Courage; bishop pack is Frost Bolt", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(
      phase1FirstId(kits, "starved_vampire_pawn"),
      "starter-drain",
      "#921 owns Vampire first-id Life Drain SP",
    );
    assert.equal(
      phase1FirstId(kits, "eternal_pawn_king"),
      "spell-slow",
      "#528/#878 own Eternal Pawn first-id Slow",
    );
    assert.equal(
      phase1FirstId(kits, "broodmother_rook"),
      "summon-archer",
      "#910 owns first-id summon range",
    );
    const ai = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(bishopKitIds(ai), ["starter-frost"]);
    assert.equal(
      canAffordPlayerDrainCourageCast(SUMMON_AP.archer, courage),
      false,
    );
    assert.equal(canAffordPlayerDrainCourageCast(4, courage), true);
    assert.equal(canAffordPlayerDrainCourageCast(3, courage), false);
  });

  it("does not steal Strike, Frost, Expose, Wound, Nova, Slow, Weaken, Life Drain, Lifesteal Nova, Poison, Shield, or Inferno", () => {
    assert.equal(isPlayerDrainCourageCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("starter-frost")),
      false,
      "#905 owns Frost Bolt MP",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-expose")),
      false,
      "#913 owns Expose res_sp",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-shadow-veil")),
      false,
      "#913 owns Shadow Veil res_sp",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-cursed-wound")),
      false,
      "#915 owns Cursed Wound healRecv",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns Frost Nova AoE MP",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-weaken")),
      false,
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("starter-drain")),
      false,
      "#921 owns Life Drain SP",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-lifesteal-nova")),
      false,
      "#543 owns Lifesteal Nova empty-anchor drain",
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("starter-heal")),
      false,
    );
    assert.equal(
      isPlayerDrainCourageCastSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(isPlayerDrainCourageCastSpell(mustSpell("spell-swap")), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isPlayerDrainCourageCastSpell({
        spellType: "drain",
        effectType: "drain",
        damage: 18,
        healAmount: 9,
        targetType: "enemy",
        debuffStat: "ap",
        debuffModifier: -1,
        debuffDuration: 1,
        range: 2,
        apCost: 4,
      }),
      true,
    );
    assert.equal(
      isPlayerDrainCourageCastSpell({
        spellType: "drain",
        effectType: "drain",
        damage: 10,
        healAmount: 5,
        targetType: "enemy",
        debuffStat: "sp",
        debuffModifier: 0.8,
        debuffDuration: 2,
      }),
      false,
    );
  });

  it("live resolve/applyCast kinds drain Drain Courage but miss advertised AP", () => {
    assert.deepEqual(playerDrainCourageLiveResolveKinds(courage), ["drain"]);
    assert.deepEqual(playerDrainCourageAdvertisedKinds(courage), [
      "drain",
      "debuff",
    ]);
    assert.equal(playerDrainCourageWxEnemyAppliesNestedDebuff(), true);
    assert.equal(playerDrainCourageWxBossAppliesNestedDebuff(), true);
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
      "live resolvePlayerCast never copies advertised AP",
    );
    const drainArm = engine.indexOf("  // Drain / Lifesteal");
    const damageArm = engine.indexOf("  // Damage\n  if (spell.damage > 0)");
    const debuffArm = engine.indexOf("  // Debuff\n  if (spell.debuffStat)");
    assert.ok(drainArm > 0 && damageArm > drainArm && debuffArm > damageArm);
    const afterDrain = engine.slice(drainArm, damageArm);
    assert.match(afterDrain, /return;/);
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

  it("executes Drain Courage advertised AP on a highlighted living hostile", () => {
    const dest = { x: 5, y: 5 };
    const occupant = unit("rat-1", 5, 5);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(courage, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      highlighted.has("5,5"),
      true,
      "Chebyshev 1 <= Drain Courage range 2",
    );
    assert.deepEqual(
      collectHighlightLiveMismatches(courage, origin, {
        tiles,
        enemies: combatants,
        worldGridSize: 9,
        effectiveRange: range,
        barrierTiles: new Map(),
      }),
      { highlightOnly: [], liveOnly: [] },
    );
    const args = {
      currentAp: 4,
      spell: courage,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerDrainCourageCast(args);
    const executable = canExecutePlayerDrainCourageCast(args);
    assert.equal(playerDrainCourageCastApCost(courage), 4);
    assert.equal(canAffordPlayerDrainCourageCast(4, courage), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerDrainCourageHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerDrainCourageCast(args), {
      tile: { x: 5, y: 5 },
      targetId: "rat-1",
      debuff: { stat: "ap", modifier: -1, duration: 1 },
    });
    assert.deepEqual(playerDrainCourageEffectFields(courage), {
      stat: "ap",
      modifier: -1,
      duration: 1,
    });
  });

  it("applies advertised AP through getStatModifier; live drain-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerDrainCourageCast({
      currentAp: 4,
      spell: courage,
      origin,
      target: { x: 5, y: 4 },
      occupant,
      liveCombatants: [occupant],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("rat-1", "ap", [
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
      getStatModifier("player", "ap", [
        {
          targetId: "player",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      -1,
      "WX enemy Drain Courage writes the same key incoming AP already reads",
    );
    assert.equal(
      getStatModifier("rat-1", "ap", [
        {
          targetId: "rat-1",
          type: "debuff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      0,
      "drain-return applyEffect without debuffStat is a no-op AP shred",
    );
  });

  it("cannot execute Drain Courage out of range, on cooldown, or at 3 AP", () => {
    const beyond = unit("rat-far", 8, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(
          courage,
          origin,
          { x: 8, y: 4 },
          [beyond],
          tiles,
          range,
        ),
      ),
      false,
      "Chebyshev 4 > Drain Courage range 2",
    );
    assert.equal(
      canExecutePlayerDrainCourageCast({
        currentAp: 4,
        spell: courage,
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
      canExecutePlayerDrainCourageCast({
        currentAp: 3,
        spell: courage,
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
      executePlayerDrainCourageCast({
        currentAp: 4,
        cooldownTurnsRemaining: 2,
        spell: courage,
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

  it("cannot execute Drain Courage on a corpse, ally, or empty tile", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 4,
      spell: courage,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(isPlayerDrainCourageHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerDrainCourageCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerDrainCourageCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerDrainCourageCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(courage, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "Strike-like empty ring stays painted; advertised AP cannot land",
    );
  });

  it("still executes a wall-blocked in-range Drain Courage (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][5] = "wall";
    const dest = { x: 6, y: 4 };
    const occupant = unit("rat-1", 6, 4);
    assert.equal(
      canExecutePlayerDrainCourageCast({
        currentAp: 4,
        spell: courage,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Drain Courage has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...courage, lineOfSight: true };
    assert.equal(
      canExecutePlayerDrainCourageCast({
        currentAp: 4,
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

  it("Attack Nearest picks the highlighted hostile; Strike / Life Drain cannot execute as Drain Courage", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 6, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(courage, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerDrainCourageCast({
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
      executePlayerDrainCourageCast({
        currentAp: 6,
        spell: mustSpell("starter-drain"),
        origin,
        target: { x: 5, y: 4 },
        occupant: near,
        liveCombatants: combatants,
        mapTiles: tiles,
        effectiveRange: 2,
      }),
      null,
    );
    assert.equal(
      playerDrainCourageHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
