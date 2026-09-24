import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastAttempt,
  playerCastAttemptResult,
} from "./playerCastPlan.ts";
import {
  buildPlayerDebuffEffect,
  decidePlayerDebuffOnlyCast,
  playerDebuffOnlyLogLine,
  playerDebuffOnlyResolves,
  playerDebuffResolvesOnHostile,
} from "./playerStatusCast.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  isTileCastableLive,
  pickAttackNearestTile,
  shouldExecuteLiveCast,
} from "./targeting.ts";

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

function byId(id: string): SpellConfig {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("player debuff-only predicates", () => {
  it("accepts Weaken / Slow and refuses damage+debuff / Mark / DoT kits", () => {
    assert.equal(playerDebuffOnlyResolves(byId("spell-weaken")), true);
    assert.equal(playerDebuffOnlyResolves(byId("spell-slow")), true);
    assert.equal(
      playerDebuffOnlyResolves(byId("starter-frost")),
      false,
      "Frost Bolt keeps the damage loop (do not rebalance)",
    );
    assert.equal(playerDebuffOnlyResolves(byId("spell-frost-nova")), false);
    assert.equal(playerDebuffOnlyResolves(byId("spell-mark")), false);
    assert.equal(playerDebuffOnlyResolves(byId("spell-venom-strike")), false);
    assert.equal(playerDebuffOnlyResolves(byId("starter-poison")), false);
    assert.equal(playerDebuffOnlyResolves(byId("physical_attack")), false);
    assert.equal(
      playerDebuffResolvesOnHostile(byId("spell-weaken"), true),
      true,
    );
    assert.equal(
      playerDebuffResolvesOnHostile(byId("spell-weaken"), false),
      false,
    );
  });

  it("builds the same additive MP / percent DMG payloads getStatModifier reads", () => {
    const slow = buildPlayerDebuffEffect(byId("spell-slow"), "rat");
    assert.equal(slow.type, "debuff");
    assert.equal(slow.targetId, "rat");
    assert.equal(slow.stat, "mp");
    assert.equal(slow.modifier, -2);
    assert.equal(slow.duration, 2);
    assert.match(playerDebuffOnlyLogLine(byId("spell-slow")), /-2 MP/);
    const weaken = buildPlayerDebuffEffect(byId("spell-weaken"), "rat");
    assert.equal(weaken.stat, "dmg");
    assert.equal(weaken.modifier, 0.7);
    assert.match(playerDebuffOnlyLogLine(byId("spell-weaken")), /-30% DMG/);
  });
});

describe("Weaken / Slow highlight vs execute", () => {
  const tiles = floorGrid(9);
  const caster = { x: 4, y: 4 };
  const open = unit("open", 4, 5);
  const blocked = unit("blocked", 8, 8);
  const corpse = unit("corpse", 4, 6, { hp: 0 });
  const enemies = [open, blocked, corpse];
  const barriers = new Map<string, number>();

  for (const id of ["spell-weaken", "spell-slow"] as const) {
    it(`${id}: highlighted hostile executes the debuff; illegal tiles cannot`, () => {
      const spell = byId(id);
      const range = Number(spell.range);
      const grid = {
        tiles,
        enemies,
        worldGridSize: 9,
        effectiveRange: range,
        barrierTiles: barriers,
      };
      assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
        highlightOnly: [],
        liveOnly: [],
      });
      const highlighted = computeTargetableTiles(spell, caster, grid);
      assert.equal(highlighted.has("4,5"), true);
      assert.equal(highlighted.has("8,8"), false);

      const legal = planPlayerCastAttempt({
        spell,
        caster,
        tile: { x: 4, y: 5 },
        liveCombatants: enemies,
        mapTiles: tiles,
        effectiveRange: range,
        barrierTiles: barriers,
        currentAp: 6,
        baseApCost: Number(spell.apCost),
        cooldownTurnsRemaining: 0,
      });
      assert.equal(legal.ok, true);
      assert.equal(playerCastAttemptResult(legal), "ok");
      assert.equal(shouldExecuteLiveCast(legal.live), true);

      const applied = decidePlayerDebuffOnlyCast(spell, open);
      assert.equal(applied.action, "apply");
      if (applied.action === "apply") {
        assert.equal(applied.targetId, "open");
        assert.equal(applied.effect.type, "debuff");
        assert.equal(applied.effect.stat, spell.debuffStat);
        assert.equal(applied.effect.modifier, spell.debuffModifier);
      }

      const illegalLive = isTileCastableLive(
        spell,
        caster,
        { x: 8, y: 8 },
        enemies,
        tiles,
        range,
        barriers,
      );
      assert.equal(shouldExecuteLiveCast(illegalLive), false);
      const illegalPlan = planPlayerCastAttempt({
        spell,
        caster,
        tile: { x: 8, y: 8 },
        liveCombatants: enemies,
        mapTiles: tiles,
        effectiveRange: range,
        barrierTiles: barriers,
        currentAp: 6,
        baseApCost: Number(spell.apCost),
        cooldownTurnsRemaining: 0,
      });
      assert.equal(illegalPlan.ok, false);
      assert.equal(playerCastAttemptResult(illegalPlan), "abort");

      assert.deepEqual(decidePlayerDebuffOnlyCast(spell, undefined), {
        action: "abort",
        reason: "no_hostile",
      });
      assert.deepEqual(
        decidePlayerDebuffOnlyCast(spell, null),
        { action: "abort", reason: "no_hostile" },
        "corpse/empty tiles never become targetEnemy (isActiveHostile)",
      );
      assert.equal(playerDebuffResolvesOnHostile(spell, false), false);

      assert.deepEqual(
        pickAttackNearestTile(spell, caster, enemies, tiles, range, barriers),
        { x: 4, y: 5 },
      );
    });
  }

  it("Frost Bolt still skips the debuff-only branch so damage is unchanged", () => {
    const spell = byId("starter-frost");
    assert.equal(playerDebuffOnlyResolves(spell), false);
    assert.deepEqual(decidePlayerDebuffOnlyCast(spell, open), {
      action: "skip",
    });
  });
});
