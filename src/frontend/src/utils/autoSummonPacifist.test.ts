import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { starterSpells } from "../data/spellData.ts";
import type { OccupancyContext } from "../engine/occupancy.ts";
import type { SpellContext } from "../engine/spellEngine.ts";
import { executeSummonAction } from "../engine/summonExecutor.ts";
import {
  autoSummonResolvedActionBreaksPacifist,
  pacifistAfterAutoSummonExecutor,
} from "./autoSummonPacifist.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

const victorySnap = {
  hp: 80,
  mapsVisited: 3,
  groundDokaPickups: 0,
  spellBarCount: 4,
  hasSpellAtLeast5: false,
  critHits: 0,
  betrayal: false,
  doubleBetrayal: false,
  leaderSlain: false,
  bossId: null as string | null,
};

function catalogSpell(id: string) {
  const found = starterSpells.find((spell) => spell.id === id);
  assert.ok(found, `missing catalog spell ${id}`);
  return found;
}

function dummyCtx(): SpellContext {
  return {
    rng: () => 0,
    getEffectiveStat: () => 0,
    dealDamage: () => 0,
    heal: () => {},
    applyEffect: () => {},
    placeBarrier: () => {},
    spawnUnit: () => {},
    log: () => {},
    isCellFree: () => true,
    getCombatantAt: () => null,
  };
}

function openOccupancy(): OccupancyContext {
  const tiles = [
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
  ];
  return {
    tiles,
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: () => false,
  };
}

function archerSummon() {
  return {
    id: "archer-1",
    x: 1,
    y: 1,
    hp: 10,
    maxHp: 10,
    currentAp: 4,
    currentMp: 4,
    maxAp: 4,
    maxMp: 4,
    level: 1,
    pieceType: "archer",
    summonAI: "archer",
    atk: 4,
  };
}

function helpers(occupancyCtx: OccupancyContext) {
  const rat = { id: "rat", x: 2, y: 1, hp: 8, maxHp: 8, level: 1 };
  return {
    calcScaledDamage: (n: number) => n,
    occupancyCtx,
    worldGridSize: 4,
    mpCostPerTile: 1,
    meleeApCost: 1,
    getEnemyById: (id: string) => (id === "rat" ? (rat as any) : undefined),
    getAoEVictims: () => [],
  };
}

describe("autoSummonResolvedActionBreaksPacifist", () => {
  it("fails Pacifist on auto Poison / Inferno even when catalog damage is 0", () => {
    const poison = catalogSpell("starter-poison");
    const inferno = catalogSpell("spell-inferno");
    assert.equal(Number(poison.damage ?? 0), 0);
    assert.equal(Number(inferno.damage ?? 0), 0);
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({
        kind: "cast",
        spell: poison,
      }),
      true,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({
        kind: "cast",
        spell: inferno,
      }),
      true,
    );
  });

  it("fails Pacifist on auto Strike and on melee", () => {
    const strike = catalogSpell("physical_attack");
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({
        kind: "cast",
        spell: strike,
      }),
      true,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "melee", spell: null }),
      true,
    );
  });

  it("keeps Pacifist for Wisp heals, Sentinel shields, Slow, and hold", () => {
    const mend = catalogSpell("starter-heal");
    const rally = catalogSpell("spell-rallying-cry");
    const shield = catalogSpell("starter-shield");
    const slow = catalogSpell("spell-slow");
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "cast", spell: mend }),
      false,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "cast", spell: rally }),
      false,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "cast", spell: shield }),
      false,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "cast", spell: slow }),
      false,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "skip", spell: null }),
      false,
    );
    assert.equal(
      autoSummonResolvedActionBreaksPacifist({ kind: "move", spell: null }),
      false,
    );
  });
});

describe("pacifistAfterAutoSummonExecutor → victory feats", () => {
  it("drops pacifist_run after an auto Poison Arrow that executeSummonAction applies", () => {
    const poison = catalogSpell("starter-poison");
    const decided = {
      archetype: "generic" as const,
      kind: "cast" as const,
      destination: { x: 1, y: 1 },
      spell: poison,
      targetId: "rat",
      intent: "looses Poison Arrow",
      intentColor: "#a78bfa",
      retreating: false,
    };
    const result = executeSummonAction(
      decided,
      archerSummon() as any,
      dummyCtx(),
      helpers(openOccupancy()),
    );
    assert.ok(
      result.logLines.some((line) => line.includes("applied effect")),
      "auto Poison is damage 0 so the executor applyEffect branch must run",
    );
    assert.equal(result.currentAp < 4, true);

    // Production WX never calls recordSpellType here, so the ref stays true.
    const naiveStillPacifist = true;
    assert.equal(naiveStillPacifist, true);
    const after = pacifistAfterAutoSummonExecutor(naiveStillPacifist, decided);
    assert.equal(after, false);
    const conditions = clientTrustedVictoryAchievementConditions({
      ...victorySnap,
      pacifist: after,
    });
    assert.equal(conditions.includes("pacifist_run"), false);
  });

  it("drops pacifist_run when a move follow-up Poison would be missed by kind-only", () => {
    const poison = catalogSpell("starter-poison");
    const move = {
      archetype: "generic" as const,
      kind: "move" as const,
      destination: { x: 2, y: 1 },
      spell: null,
      targetId: null,
      intent: "closes in",
      intentColor: "#a78bfa",
      retreating: false,
    };
    const followUp = {
      kind: "cast" as const,
      spell: poison,
    };
    const result = executeSummonAction(
      move,
      archerSummon() as any,
      dummyCtx(),
      {
        ...helpers(openOccupancy()),
        reevaluate: () => ({
          ...move,
          kind: "cast",
          spell: poison,
          targetId: "rat",
          intent: "looses Poison Arrow",
        }),
      },
    );
    assert.ok(result.logLines.some((line) => line.includes("[cast]")));
    assert.equal(
      autoSummonResolvedActionBreaksPacifist(move),
      false,
      "inspecting only the decided move keeps the feat — the production miss",
    );
    const after = pacifistAfterAutoSummonExecutor(true, move, followUp);
    assert.equal(after, false);
    assert.equal(
      clientTrustedVictoryAchievementConditions({
        ...victorySnap,
        pacifist: after,
      }).includes("pacifist_run"),
      false,
    );
  });

  it("keeps pacifist_run after an auto Wisp Blood Mend", () => {
    const mend = catalogSpell("starter-heal");
    const decided = {
      kind: "cast" as const,
      spell: mend,
    };
    const after = pacifistAfterAutoSummonExecutor(true, decided);
    assert.equal(after, true);
    assert.ok(
      clientTrustedVictoryAchievementConditions({
        ...victorySnap,
        pacifist: after,
      }).includes("pacifist_run"),
    );
  });
});
