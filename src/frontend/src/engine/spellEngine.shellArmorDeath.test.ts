import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PlayerSpellContext } from "./spellEngine.ts";
import { resolvePlayerCast } from "./spellEngine.ts";

/**
 * Pre-fix: resolvePlayerCast recomputed death as `hitTarget.hp - finalDmg`
 * after applyDamageToEnemy already applied Shell Armor (half damage). A
 * Broodmother Rook at 50 HP hit for 60 would survive at 20 inside
 * applyDamageToEnemy, then be falsely processCombatantDeath'd by the loop.
 */
describe("resolvePlayerCast Shell Armor death tracking", () => {
  it("does not call processCombatantDeath when applyDamageToEnemy reports survived", () => {
    let deathCalls = 0;
    let applyCalls = 0;
    const boss = {
      id: "brood",
      x: 5,
      y: 5,
      hp: 50,
      maxHp: 80,
      level: 8,
      pieceType: "rook",
      res: 0,
      sp: 0,
      chc: 0,
      side: "enemy" as const,
    };

    const ctx = {
      rng: () => 0.99,
      spellFailChance: 0,
      chc: 0,
      isBloodMoon: false,
      isFuryActive: false,
      isMirrorField: false,
      isPaperWindstorm: false,
      playerPosition: { x: 3, y: 5 },
      enemies: [boss],
      characterName: "Hero",
      characterStats: {
        level: 5,
        hp: 100,
        maxHp: 100,
        res: 0,
        sp: 0,
        chc: 0,
        ap: 6,
        mp: 6,
      },
      spellLevels: {},
      getEffectiveStat: () => 1,
      dealDamage: () => 0,
      heal: () => {},
      applyEffect: () => {},
      placeBarrier: () => {},
      spawnUnit: () => {},
      log: () => {},
      isCellFree: () => true,
      getCombatantAt: () => null,
      onHit: () => {},
      onCritHit: () => {},
      triggerVfx: () => {},
      playSound: () => {},
      consumeTimestep: () => false,
      restoreApMp: () => {},
      loseSelfHp: () => 0,
      swapPositions: () => {},
      placeMark: () => {},
      getAoETargets: () => [boss],
      calculatePlayerDamage: () => ({
        finalDamage: 60,
        breakdown: "60",
      }),
      applyDamageToEnemy: () => {
        applyCalls += 1;
        // Shell Armor left 20 HP — helper returns false.
        return false;
      },
      applyDamageToPlayer: () => {},
      mirrorRedirect: () => false,
      mirrorFieldReflect: () => false,
      paperWindstormMiss: () => false,
      activateMirror: () => {},
      placeBarrierTile: () => {},
      spawnPlayerSummon: () => {},
      getEffectiveSpellRange: (r: number) => r,
      recordSpellType: () => {},
      processCombatantDeath: () => {
        deathCalls += 1;
        return true;
      },
    } as unknown as PlayerSpellContext;

    const result = resolvePlayerCast(
      {
        id: "bolt",
        name: "Bolt",
        effectType: "damage",
        isPhysical: true,
        baseDamage: 60,
        range: 3,
      },
      { x: 5, y: 5 },
      ctx,
    );

    assert.equal(result, "cast");
    assert.equal(applyCalls, 1);
    assert.equal(
      deathCalls,
      0,
      "pre-armor lethal math must not processCombatantDeath after Shell Armor save",
    );
  });
});
