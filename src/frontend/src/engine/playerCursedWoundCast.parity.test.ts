/**
 * Combat action parity: player Cursed Wound highlight matches advertised
 * healRecv. A highlighted living hostile is executable with advertised
 * healRecv 0.5 / 2; an illegal target cannot execute; live damage-return
 * arms write no shred.
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
  canAffordPlayerCursedWoundCast,
  canExecutePlayerCursedWoundCast,
  executePlayerCursedWoundCast,
  isPlayerCursedWoundCastSpell,
  isPlayerCursedWoundHostileOccupant,
  playerCursedWoundAdvertisedKinds,
  playerCursedWoundCastApCost,
  playerCursedWoundCastRange,
  playerCursedWoundEffectFields,
  playerCursedWoundHighlightedTargetIsExecutable,
  playerCursedWoundLiveResolveKinds,
  playerCursedWoundWxEnemyAppliesNestedDebuff,
  shouldHighlightPlayerCursedWoundCast,
} from "./playerCursedWoundCast.ts";
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

describe("player Cursed Wound advertised healRecv vs damage-return execute", () => {
  const wound = mustSpell("spell-cursed-wound");
  const tiles = floorGrid(9);
  const origin = { x: 4, y: 4 };
  const range = playerCursedWoundCastRange(wound);

  it("treats catalog Cursed Wound as a single-target damage+healRecv execute spell", () => {
    assert.equal(wound.spellType, "damage");
    assert.equal(Number(wound.damage), 22);
    assert.equal(Number(wound.healAmount ?? 0), 0);
    assert.equal(wound.debuffStat, "healRecv");
    assert.equal(Number(wound.debuffModifier), 0.5);
    assert.equal(Number(wound.debuffDuration), 2);
    assert.equal(Number(wound.range), 3);
    assert.equal(Number(wound.apCost), 3);
    assert.equal(wound.targetType, "enemy");
    assert.equal(wound.hitsMultiple ?? false, false);
    assert.equal(isPlayerCursedWoundCastSpell(wound), true);
    assert.equal(playerCursedWoundCastRange(wound), spellRangeBase(wound));
    assert.equal(playerSpellRequiresLos(wound), false);
  });

  it("Pale Archivist first-id is Cursed Wound (boss kit write); bishop pack is Frost Bolt", () => {
    const kits = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(phase1FirstId(kits, "pale_archivist"), "spell-cursed-wound");
    assert.equal(phase1FirstId(kits, "midnight_bishop"), "spell-cursed-wound");
    assert.equal(phase1FirstId(kits, "chessboard_lich"), "spell-cursed-wound");
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
      canAffordPlayerCursedWoundCast(SUMMON_AP.archer, wound),
      false,
    );
    assert.equal(canAffordPlayerCursedWoundCast(3, wound), true);
  });

  it("does not steal Strike, Frost, Expose, Slow, Weaken, Drain, Nova, Poison, Shield, or Inferno", () => {
    assert.equal(isPlayerCursedWoundCastSpell(physicalAttackSpell), false);
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("starter-frost")),
      false,
      "#905 owns Frost Bolt MP",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-expose")),
      false,
      "#913 owns Expose res_sp",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-shadow-veil")),
      false,
      "#913 owns Shadow Veil res_sp",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-slow")),
      false,
      "#528/#878 own 0-damage Slow",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-weaken")),
      false,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("starter-drain")),
      false,
      "Life Drain keeps the drain arm",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-drain-courage")),
      false,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-frost-nova")),
      false,
      "Frost Nova is hitsMultiple / targetType area",
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("starter-poison")),
      false,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("starter-shield")),
      false,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("starter-heal")),
      false,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell(mustSpell("spell-inferno")),
      false,
    );
    assert.equal(isPlayerCursedWoundCastSpell(mustSpell("spell-swap")), false);
  });

  it("keys off metadata, not the display name", () => {
    assert.equal(
      isPlayerCursedWoundCastSpell({
        spellType: "damage",
        damage: 9,
        targetType: "enemy",
        debuffStat: "healRecv",
        debuffModifier: 0.5,
        debuffDuration: 2,
        range: 3,
        apCost: 3,
      }),
      true,
    );
    assert.equal(
      isPlayerCursedWoundCastSpell({
        spellType: "damage",
        damage: 22,
        targetType: "enemy",
        debuffStat: "res_sp",
        debuffModifier: 0.8,
        debuffDuration: 2,
      }),
      false,
    );
  });

  it("live resolve/applyCast kinds damage Cursed Wound but miss advertised healRecv", () => {
    assert.deepEqual(playerCursedWoundLiveResolveKinds(wound), ["damage"]);
    assert.deepEqual(playerCursedWoundAdvertisedKinds(wound), [
      "damage",
      "debuff",
    ]);
    assert.equal(playerCursedWoundWxEnemyAppliesNestedDebuff(), true);
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
      "live resolvePlayerCast never copies advertised healRecv",
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

  it("executes Cursed Wound advertised healRecv on a highlighted living hostile", () => {
    const dest = { x: 6, y: 5 };
    const occupant = unit("rat-1", 6, 5);
    const combatants = [occupant];
    const highlighted = computeTargetableTiles(wound, origin, {
      tiles,
      enemies: combatants,
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("6,5"), true, "Chebyshev 2 <= Wound range 3");
    assert.deepEqual(
      collectHighlightLiveMismatches(wound, origin, {
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
      spell: wound,
      origin,
      target: dest,
      occupant,
      liveCombatants: combatants,
      mapTiles: tiles,
      effectiveRange: range,
    };
    const highlightedGate = shouldHighlightPlayerCursedWoundCast(args);
    const executable = canExecutePlayerCursedWoundCast(args);
    assert.equal(playerCursedWoundCastApCost(wound), 3);
    assert.equal(canAffordPlayerCursedWoundCast(3, wound), true);
    assert.equal(highlightedGate, true);
    assert.equal(executable, true);
    assert.equal(
      playerCursedWoundHighlightedTargetIsExecutable({
        highlighted: highlightedGate,
        executable,
      }),
      true,
    );
    assert.deepEqual(executePlayerCursedWoundCast(args), {
      tile: { x: 6, y: 5 },
      targetId: "rat-1",
      debuff: { stat: "healRecv", modifier: 0.5, duration: 2 },
    });
    assert.deepEqual(playerCursedWoundEffectFields(wound), {
      stat: "healRecv",
      modifier: 0.5,
      duration: 2,
    });
  });

  it("applies advertised healRecv through getStatModifier; live damage-return cannot", () => {
    const occupant = unit("rat-1", 5, 4);
    const advertised = executePlayerCursedWoundCast({
      currentAp: 3,
      spell: wound,
      origin,
      target: { x: 5, y: 4 },
      occupant,
      liveCombatants: [occupant],
      mapTiles: tiles,
      effectiveRange: range,
    });
    assert.ok(advertised);
    assert.equal(
      getStatModifier("rat-1", "healRecv", [
        {
          targetId: "rat-1",
          type: "debuff",
          stat: advertised.debuff.stat,
          modifier: advertised.debuff.modifier,
        },
      ]),
      0.5,
    );
    assert.equal(
      getStatModifier("rat-1", "healRecv", [
        {
          targetId: "rat-1",
          type: "debuff",
        } as Parameters<typeof getStatModifier>[2][number],
      ]),
      1,
      "damage-return applyEffect without debuffStat is a no-op shred",
    );
  });

  it("cannot execute Cursed Wound out of range, on cooldown, or at 2 AP", () => {
    const beyond = unit("rat-far", 8, 4);
    const near = unit("rat-2", 5, 4);
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(
          wound,
          origin,
          { x: 8, y: 4 },
          [beyond],
          tiles,
          range,
        ),
      ),
      false,
      "Chebyshev 4 > Wound range 3",
    );
    assert.equal(
      canExecutePlayerCursedWoundCast({
        currentAp: 3,
        spell: wound,
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
      canExecutePlayerCursedWoundCast({
        currentAp: 2,
        spell: wound,
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
      executePlayerCursedWoundCast({
        currentAp: 3,
        cooldownTurnsRemaining: 2,
        spell: wound,
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

  it("cannot execute Cursed Wound on a corpse, ally, or empty tile", () => {
    const dest = { x: 5, y: 4 };
    const corpse = unit("dead", 5, 4, { hp: 0 });
    const ally = unit("wolf", 5, 4, { side: "player", isSummon: true });
    const base = {
      currentAp: 3,
      spell: wound,
      origin,
      target: dest,
      mapTiles: tiles,
      effectiveRange: range,
    };
    assert.equal(
      shouldExecuteLiveCast(
        isTileCastableLive(wound, origin, dest, [corpse], tiles, range),
      ),
      true,
      "empty-ring live gate still paints corpses like Strike",
    );
    assert.equal(isPlayerCursedWoundHostileOccupant(corpse), false);
    assert.equal(
      canExecutePlayerCursedWoundCast({
        ...base,
        occupant: corpse,
        liveCombatants: [corpse],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerCursedWoundCast({
        ...base,
        occupant: ally,
        liveCombatants: [ally],
      }),
      false,
    );
    assert.equal(
      canExecutePlayerCursedWoundCast({
        ...base,
        occupant: null,
        liveCombatants: [],
      }),
      false,
    );
    const paintedEmpty = computeTargetableTiles(wound, origin, {
      tiles,
      enemies: [],
      worldGridSize: 9,
      effectiveRange: range,
      barrierTiles: new Map(),
    });
    assert.equal(
      paintedEmpty.has("5,4"),
      true,
      "Strike-like empty ring stays painted; advertised healRecv cannot land",
    );
  });

  it("still executes a wall-blocked in-range Cursed Wound (player LoS is off)", () => {
    const walled = floorGrid(9);
    walled[4][6] = "wall";
    const dest = { x: 7, y: 4 };
    const occupant = unit("rat-1", 7, 4);
    assert.equal(
      canExecutePlayerCursedWoundCast({
        currentAp: 3,
        spell: wound,
        origin,
        target: dest,
        occupant,
        liveCombatants: [occupant],
        mapTiles: walled,
        effectiveRange: range,
      }),
      true,
      "catalog Wound has no lineOfSight; do not merge enemy !== false",
    );
    const losOn = { ...wound, lineOfSight: true };
    assert.equal(
      canExecutePlayerCursedWoundCast({
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

  it("Attack Nearest picks the highlighted hostile; Strike / Expose cannot execute as Wound", () => {
    const near = unit("rat-1", 5, 4);
    const far = unit("rat-2", 6, 6);
    const combatants = [near, far];
    assert.deepEqual(
      pickAttackNearestTile(wound, origin, combatants, tiles, range),
      { x: 5, y: 4 },
    );
    assert.equal(
      canExecutePlayerCursedWoundCast({
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
      executePlayerCursedWoundCast({
        currentAp: 6,
        spell: mustSpell("spell-expose"),
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
      playerCursedWoundHighlightedTargetIsExecutable({
        highlighted: false,
        executable: false,
      }),
      false,
    );
  });
});
