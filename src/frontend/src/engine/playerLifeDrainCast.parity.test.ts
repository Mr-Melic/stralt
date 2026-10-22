/**
 * Combat action parity: player Life Drain highlight matches advertised SP.
 * A highlighted living hostile is executable with advertised SP 0.8 / 2;
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
  canAffordPlayerLifeDrainCast,
  canExecutePlayerLifeDrainCast,
  executePlayerLifeDrainCast,
  isPlayerLifeDrainCastSpell,
  isPlayerLifeDrainHostileOccupant,
  playerLifeDrainAdvertisedKinds,
  playerLifeDrainCastApCost,
  playerLifeDrainCastRange,
  playerLifeDrainEffectFields,
  playerLifeDrainHighlightedTargetIsExecutable,
  playerLifeDrainLiveResolveKinds,
  playerLifeDrainWxBossAppliesNestedDebuff,
  playerLifeDrainWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerLifeDrainCast,
} from "./playerLifeDrainCast.ts";
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

describe("player Life Drain advertised SP vs drain-return execute", () => {
  const drain = mustSpell("starter-drain");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerLifeDrainCastRange(drain);

  it("treats catalog Life Drain as a single-target drain+SP execute spell", () => {
    assert.equal(drain.spellType, "drain");
    assert.equal(drain.effectType, "drain");
    assert.equal(Number(drain.damage), 10);
    assert.equal(Number(drain.healAmount ?? 0), 5);
    assert.equal(drain.debuffStat, "sp");
    assert.equal(Number(drain.debuffModifier), 0.8);
    assert.equal(Number(drain.debuffDuration), 2);
    assert.equal(Number(drain.range), 2);
    assert.equal(Number(drain.apCost), 3);
    assert.equal(drain.targetType, "enemy");
    assert.equal(drain.hitsMultiple ?? false, false);
    assert.equal(isPlayerLifeDrainCastSpell(drain), true);
    assert.equal(playerLifeDrainCastRange(drain), spellRangeBase(drain));
    assert.equal(playerSpellRequiresLos(drain), false);
  });

  it("Starved Vampire first-id is Life Drain (boss kit write); bishop pack is Frost Bolt", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(phase1FirstId(kits, "starved_vampire_pawn"), "starter-drain");
    assert.equal(
      phase1FirstId(kits, "crimson_countess"),
      "spell-inferno",
      "Countess first-id Inferno stays on kit DoT, not this drain arm",
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
    assert.equal(canAffordPlayerLifeDrainCast(SUMMON_AP.archer, drain), false);
    assert.equal(canAffordPlayerLifeDrainCast(3, drain), true);
  });

  it("does not steal Strike, Frost, Expose, Wound, Nova, Slow, Weaken, Drain Courage, Lifesteal Nova, Poison, Shield, or Inferno", () => {
    assert.equal(isPlayerLifeDrainCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("starter-frost")),
      false,
      "#905 owns Frost Bolt MP",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-expose")),
      false,
      "#913 owns Expose res_sp",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-shadow-veil")),
      false,
      "#913 owns Shadow Veil res_sp",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-cursed-wound")),
      false,
      "#915 owns Cursed Wound healRecv",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-frost-nova")),
      false,
      "#917 owns Frost Nova AoE MP",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(isPlayerLifeDrainCastSpell(mustSpell("spell-weaken")), false);
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-drain-courage")),
      false,
      "Drain Courage keeps the AP drain arm",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("spell-lifesteal-nova")),
      false,
      "#543 owns Lifesteal Nova empty-anchor drain",
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isPlayerLifeDrainCastSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(isPlayerLifeDrainCastSpell(mustSpell("starter-heal")), false);
    assert.equal(isPlayerLifeDrainCastSpell(mustSpell("spell-inferno")), false);
    assert.equal(isPlayerLifeDrainCastSpell(mustSpell("spell-swap")), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isPlayerLifeDrainCastSpell({
        spellType: "drain",
        effectType: "drain",
        damage: 9,
        healAmount: 4,
        targetType: "enemy",
        debuffStat: "sp",
        debuffModifier: 0.8,
        debuffDuration: 2,
        range: 2,
        apCost: 3,
      }),
      true,
    );
    assert.equal(
      isPlayerLifeDrainCastSpell({
        spellType: "drain",
        effectType: "drain",
        damage: 18,
        healAmount: 9,
        targetType: "enemy",
        debuffStat: "ap",
        debuffModifier: -1,
        debuffDuration: 1,
      }),
      false,
    );
  });

  it("live resolve/applyCast kinds drain Life Drain but miss advertised SP", () => {
    assert.deepEqual(playerLifeDrainLiveResolveKinds(drain), ["drain"]);
    assert.deepEqual(playerLifeDrainAdvertisedKinds(drain), [
      "drain",
      "debuff",
    ]);
    assert.equal(playerLifeDrainWxEnemyAppliesNestedDebuff(), true);
    assert.equal(playerLifeDrainWxBossAppliesNestedDebuff(), true);
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
      "live resolvePlayerCast never copies advertised SP",
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

  it("executes Life Drain advertised SP on a highlighted living hostile", () => {
    const dest = { x: 5, y: 5 };
    const occupant = unit("rat-1", 5, 5);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(drain, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("5,5"), true, "Chebyshev 1 <= Drain range 2");
    assert.deepEqual(
      collectHighlightLiveMismatches(drain, origin, {
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
      spell: drain,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerLifeDrainCast(args);
    const executable = canExecutePlayerLifeDrainCast(args);
    assert.equal(playerLifeDrainCastApCost(drain), 3);
    assert.equal(canAffordPlayerLifeDrainCast(3, drain), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerLifeDrainHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerLifeDrainCast(args), {
      tile: { x: 5, y: 5 },
      targetId: "rat-1",
      debuff: { stat: "sp", modifier: 0.8, duration: 2 },
    });
    assert.deepEqual(playerLifeDrainEffectFields(drain), {
      stat: "sp",
      modifier: 0.8,
      duration: 2,
    });
  });

  it("applies advertised SP through getStatModifier; live drain-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerLifeDrainCast({
      currentAp: 3,
      spell: drain,
      origin,
      target: { x: 5, y: 4 },
      occupant,
      liveCombatants: [occupant],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("rat-1", "sp", [
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
      getStatModifier("player", "sp", [
        {
          targetId: "player",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      0.8,
      "WX enemy Life Drain writes the same key incoming spells already read",
    );
    assert.equal(
      getStatModifier("rat-1", "sp", [
        {
          targetId: "rat-1",
          type: "debuff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      1,
      "drain-return applyEffect without debuffStat is a no-op shred",
    );
  });

  it("cannot execute Life Drain out of range, on cooldown, or at 2 AP", () => {
    const beyond = unit("rat-far", 8, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(
          drain,
          origin,
          { x: 8, y: 4 },
          [beyond],
          tiles,
          range,
        ),
      ),
      false,
      "Chebyshev 4 > Drain range 2",
    );
    assert.equal(
      canExecutePlayerLifeDrainCast({
        currentAp: 3,
        spell: drain,
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
      canExecutePlayerLifeDrainCast({
        currentAp: 2,
        spell: drain,
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
      executePlayerLifeDrainCast({
        currentAp: 3,
        cooldownTurnsRemaining: 2,
        spell: drain,
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

  it("cannot execute Life Drain on a corpse, ally, or empty tile", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 3,
      spell: drain,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(isPlayerLifeDrainHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerLifeDrainCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerLifeDrainCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerLifeDrainCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(drain, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "Strike-like empty ring stays painted; advertised SP cannot land",
    );
  });

  it("still executes a wall-blocked in-range Life Drain (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][5] = "wall";
    const dest = { x: 6, y: 4 };
    const occupant = unit("rat-1", 6, 4);
    assert.equal(
      canExecutePlayerLifeDrainCast({
        currentAp: 3,
        spell: drain,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Drain has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...drain, lineOfSight: true };
    assert.equal(
      canExecutePlayerLifeDrainCast({
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

  it("Attack Nearest picks the highlighted hostile; Strike / Drain Courage cannot execute as Life Drain", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 6, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(drain, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerLifeDrainCast({
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
      executePlayerLifeDrainCast({
        currentAp: 6,
        spell: mustSpell("spell-drain-courage"),
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
      playerLifeDrainHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
