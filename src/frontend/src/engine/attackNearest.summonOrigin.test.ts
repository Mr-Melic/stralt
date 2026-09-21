import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  planPlayerCastResources,
  shouldRejectCastForMissingAp,
} from "./playerCastPlan.ts";
import {
  attackNearestLiveCasterPos,
  canAttackNearestAgainstLive,
  pickNearestAttackableHostile,
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
  extra: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    ...extra,
  } as Enemy;
}

function selfOrAlly(
  id: string,
  targetType: "self" | "ally",
  effectType: SpellConfig["effectType"],
  apCost: bigint,
): SpellConfig {
  return {
    id,
    name: id,
    description: "",
    iconEmoji: "",
    apCost,
    mpCost: 0n,
    damage: 0n,
    range: 0n,
    effectType,
    targetType,
    maxRange: 0,
    minRange: 0,
  } as SpellConfig;
}

describe("Attack Nearest while a summon is selected", () => {
  const player = { x: 2, y: 2 };
  const summon = { x: 8, y: 7 };
  const ratBesideSummon = unit("rat-summon-adj", 8, 8, { side: "enemy" });

  it("button and execute share the player tile for Shield and Blood Mend", () => {
    // #326: Attack Nearest execute special-cased self+heal. Ally Shield
    // painted the player tile but searched hostiles; leftover summon
    // control then picked the wolf or a rat only the wolf could reach.
    // Production button+execute share attackNearestLiveCasterPos +
    // pickNearestAttackableHostile / canAttackNearestAgainstLive.
    const caster = attackNearestLiveCasterPos(player, summon);
    assert.deepEqual(caster, player);
    const tiles = floorGrid(16);
    const live = [ratBesideSummon];

    for (const spell of [
      selfOrAlly("starter-shield", "ally", "buff", 3n),
      selfOrAlly("starter-heal", "self", "heal", 3n),
    ]) {
      const picked = pickNearestAttackableHostile(
        spell,
        caster,
        live,
        tiles,
        0,
      );
      assert.deepEqual(
        picked,
        player,
        `${spell.id} must land on the player, not the summon or the rat`,
      );
      assert.equal(
        canAttackNearestAgainstLive(spell, caster, live, tiles, 0),
        true,
      );
      assert.notDeepEqual(picked, summon);
      assert.notDeepEqual(picked, { x: 8, y: 8 });
    }
  });

  it("lets 0-AP Timestep execute on the player tile when the wallet is empty", () => {
    // Tile/touch used to abort at AP===0 before reading cost. Timestep is
    // 0 AP. Combined with leftover summon control, Attack Nearest must
    // still light and land on the player — not search from the wolf.
    const timestep = selfOrAlly("spell-timestep", "self", "buff", 0n);
    assert.equal(
      shouldRejectCastForMissingAp({ currentAp: 0, baseApCost: 0 }),
      false,
    );
    const resources = planPlayerCastResources({
      currentAp: 0,
      baseApCost: 0,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(resources.ok, true);
    if (resources.ok) assert.equal(resources.apCost, 0);

    const caster = attackNearestLiveCasterPos(player, summon);
    const tiles = floorGrid(16);
    const live = [ratBesideSummon];
    const picked = pickNearestAttackableHostile(
      timestep,
      caster,
      live,
      tiles,
      0,
    );
    assert.deepEqual(picked, player);
    assert.equal(
      canAttackNearestAgainstLive(timestep, caster, live, tiles, 0),
      true,
    );
  });
});
