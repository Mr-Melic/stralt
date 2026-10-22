/**
 * Combat action parity: player Frost Nova highlight matches advertised MP.
 * A highlighted legal click with a living hostile in the hitsMultiple splash
 * is executable with advertised −1 MP / 1; an illegal target cannot execute;
 * live damage-return arms write no MP.
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
  canAffordPlayerFrostNovaCast,
  canExecutePlayerFrostNovaCast,
  executePlayerFrostNovaCast,
  isPlayerFrostNovaCastSpell,
  isPlayerFrostNovaHostileOccupant,
  playerFrostNovaAdvertisedKinds,
  playerFrostNovaCastApCost,
  playerFrostNovaCastRange,
  playerFrostNovaEffectFields,
  playerFrostNovaHighlightedTargetIsExecutable,
  playerFrostNovaLiveResolveKinds,
  playerFrostNovaPreviewAreaRadius,
  playerFrostNovaSplashVictims,
  playerFrostNovaWxBossAppliesNestedDebuff,
  playerFrostNovaWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerFrostNovaCast,
} from "./playerFrostNovaCast.ts";
import { getStatModifier } from "./statusEffects.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  hitsMultipleIncludesOccupant,
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

describe("player Frost Nova advertised MP vs damage-return execute", () => {
  const nova = mustSpell("spell-frost-nova");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerFrostNovaCastRange(nova);

  it("treats catalog Frost Nova as an area hitsMultiple damage+MP execute spell", () => {
    assert.equal(nova.spellType, "damage");
    assert.equal(Number(nova.damage), 15);
    assert.equal(Number(nova.healAmount ?? 0), 0);
    assert.equal(nova.debuffStat, "mp");
    assert.equal(Number(nova.debuffModifier), -1);
    assert.equal(Number(nova.debuffDuration), 1);
    assert.equal(Number(nova.range), 1);
    assert.equal(Number(nova.apCost), 4);
    assert.equal(nova.targetType, "area");
    assert.equal(nova.hitsMultiple, true);
    assert.equal(Number(nova.areaRadius), 2);
    assert.equal(isPlayerFrostNovaCastSpell(nova), true);
    assert.equal(playerFrostNovaCastRange(nova), spellRangeBase(nova));
    assert.equal(playerFrostNovaCastRange(nova), 1);
    assert.equal(playerFrostNovaPreviewAreaRadius(nova), 2);
    assert.equal(playerSpellRequiresLos(nova), false);
  });

  it("bishop kit first id is Frost Bolt, not Nova; summons cannot afford AP 4", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "./enemyAI.ts"),
      "utf8",
    );
    assert.deepEqual(bishopKitIds(src), ["starter-frost"]);
    assert.equal(canAffordPlayerFrostNovaCast(SUMMON_AP.archer, nova), false);
    assert.equal(canAffordPlayerFrostNovaCast(4, nova), true);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isPlayerFrostNovaCastSpell({
        spellType: "damage",
        damage: 9,
        targetType: "area",
        hitsMultiple: true,
        debuffStat: "mp",
        debuffModifier: -1,
        debuffDuration: 1,
        range: 1,
        apCost: 4,
        areaRadius: 2,
      }),
      true,
    );
    assert.equal(
      isPlayerFrostNovaCastSpell({
        spellType: "damage",
        damage: 15,
        targetType: "enemy",
        hitsMultiple: true,
        debuffStat: "mp",
        debuffModifier: -1,
        debuffDuration: 1,
      }),
      false,
    );
  });

  it("does not steal Strike, Bolt, Expose, Wound, Slow, Weaken, Drain, Lifesteal Nova, Poison, Shield, or Inferno", () => {
    assert.equal(isPlayerFrostNovaCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("starter-frost")),
      false,
      "#905 owns single-target Frost Bolt MP",
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-expose")),
      false,
      "#913 owns Expose res_sp",
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-cursed-wound")),
      false,
      "#915 owns Cursed Wound healRecv",
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-shadow-veil")),
      false,
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(isPlayerFrostNovaCastSpell(mustSpell("spell-weaken")), false);
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("starter-drain")),
      false,
      "Life Drain keeps the drain arm",
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("spell-lifesteal-nova")),
      false,
      "#543 owns Lifesteal Nova empty-anchor drain",
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isPlayerFrostNovaCastSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(isPlayerFrostNovaCastSpell(mustSpell("starter-heal")), false);
    assert.equal(isPlayerFrostNovaCastSpell(mustSpell("spell-inferno")), false);
    assert.equal(isPlayerFrostNovaCastSpell(mustSpell("spell-swap")), false);
  });

  it("live resolve/applyCast kinds damage Frost Nova but miss advertised MP", () => {
    assert.deepEqual(playerFrostNovaLiveResolveKinds(nova), ["damage"]);
    assert.deepEqual(playerFrostNovaAdvertisedKinds(nova), [
      "damage",
      "debuff",
    ]);
    assert.equal(playerFrostNovaWxEnemyAppliesNestedDebuff(), true);
    assert.equal(playerFrostNovaWxBossAppliesNestedDebuff(), true);
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

  it("executes Frost Nova advertised MP on a highlighted living hostile splash", () => {
    const dest = { x: 5, y: 4 };
    const occupant = unit("rat-1", 5, 4);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(nova, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("5,4"), true, "Chebyshev 1 is a Nova anchor");
    assert.deepEqual(
      collectHighlightLiveMismatches(nova, origin, {
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
      spell: nova,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerFrostNovaCast(args);
    const executable = canExecutePlayerFrostNovaCast(args);
    assert.equal(playerFrostNovaCastApCost(nova), 4);
    assert.equal(canAffordPlayerFrostNovaCast(4, nova), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerFrostNovaHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerFrostNovaCast(args), {
      tile: { x: 5, y: 4 },
      victims: ["rat-1"],
      debuff: { stat: "mp", modifier: -1, duration: 1 },
    });
    assert.deepEqual(playerFrostNovaEffectFields(nova), {
      stat: "mp",
      modifier: -1,
      duration: 1,
    });
  });

  it("splashes a neighbor within Chebyshev range of the click, not preview areaRadius", () => {
    const click = { x: 5, y: 4 };
    const near = unit("rat-1", 5, 4);
    const splash = unit("rat-2", 5, 5);
    const farPreview = unit("rat-far", 5, 6);
    const combatants = [near, splash, farPreview];
    assert.equal(hitsMultipleIncludesOccupant(splash, click, range), true);
    assert.equal(
      hitsMultipleIncludesOccupant(farPreview, click, range),
      false,
      "Chebyshev 2 is preview areaRadius, not execute splash",
    );
    const result = executePlayerFrostNovaCast({
      currentAp: 4,
      spell: nova,
      origin,
      target: click,
      occupant: near,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(result);
    assert.deepEqual(result.victims.slice().sort(), ["rat-1", "rat-2"]);
    assert.equal(result.victims.includes("rat-far"), false);
    const emptyClick = executePlayerFrostNovaCast({
      currentAp: 4,
      spell: nova,
      origin,
      target: click,
      occupant: null,
      liveCombatants: [splash],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(emptyClick);
    assert.deepEqual(emptyClick.victims, ["rat-2"]);
  });

  it("applies advertised MP through getStatModifier; live damage-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerFrostNovaCast({
      currentAp: 4,
      spell: nova,
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

  it("cannot execute Frost Nova out of the live area, on cooldown, or at 3 AP", () => {
    const beyond = unit("rat-far", 8, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(
          nova,
          origin,
          { x: 8, y: 4 },
          [beyond],
          tiles,
          range,
        ),
      ),
      false,
      "Chebyshev 4 is outside range 1 + areaRadius 2",
    );
    assert.equal(
      canExecutePlayerFrostNovaCast({
        currentAp: 4,
        spell: nova,
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
      canExecutePlayerFrostNovaCast({
        currentAp: 3,
        spell: nova,
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
      executePlayerFrostNovaCast({
        currentAp: 4,
        cooldownTurnsRemaining: 2,
        spell: nova,
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

  it("cannot execute Frost Nova on a corpse, ally, or empty tile with nobody in splash", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 4,
      spell: nova,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(isPlayerFrostNovaHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerFrostNovaCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerFrostNovaCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerFrostNovaCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(nova, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "area ring stays painted; advertised MP cannot land without a splash victim",
    );
    const expansion = { x: 4, y: 6 };
    assert.equal(
      paintedEmpty.has("4,6"),
      true,
      "areaRadius 2 paints Chebyshev 2; hitsMultiple radius 1 cannot splash from there",
    );
    assert.equal(
      playerFrostNovaSplashVictims({
        spell: nova,
        click: expansion,
        liveCombatants: [unit("rat-1", 5, 4)],
      }).length,
      0,
    );
  });

  it("still executes a wall-blocked in-range Frost Nova (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][6] = "wall";
    const dest = { x: 5, y: 4 };
    const occupant = unit("rat-1", 5, 4);
    assert.equal(
      canExecutePlayerFrostNovaCast({
        currentAp: 4,
        spell: nova,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Frost Nova has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...nova, lineOfSight: true, range: 3n, maxRange: 3 };
    const far = unit("rat-los", 7, 4);
    const losMap = floorGrid(9);
    for (let y = 2; y <= 6; y++) {
      for (let x = 5; x <= 8; x++) {
        if (x === 7 && y === 4) continue;
        losMap[y][x] = "wall";
      }
    }
    assert.equal(
      canExecutePlayerFrostNovaCast({
        currentAp: 4,
        spell: losOn,
        origin,
        target: { x: 7, y: 4 },
        occupant: far,
        liveCombatants: [far],
        mapTiles: losMap,
        effectiveRange: 3,
      }),
      false,
      "player !!lineOfSight plus no remaining area-expansion anchor; execute must match highlight",
    );
  });

  it("Attack Nearest picks the highlighted hostile; Bolt cannot execute as Nova", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 6, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(nova, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerFrostNovaCast({
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
      executePlayerFrostNovaCast({
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
      playerFrostNovaHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
