import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import type { DecideEnemyContext } from "./enemyAI.ts";
import {
  attachEnemySummonKit,
  decideHostileCombatantAction,
  resolveEnemySummonAI,
  resolveSummonKitSpells,
  shouldApplyEnemyCastDotOnly,
  shouldDecideSummonKitAction,
  summonAIFromPieceType,
} from "./enemySummonKit.ts";

function venom(): SpellConfig {
  return {
    id: "spell-venom-strike",
    name: "Venom Strike",
    description: "",
    iconEmoji: "",
    apCost: 3n,
    mpCost: 0n,
    damage: 0n,
    range: 2n,
    effectType: "dot",
    spellType: "damage",
    isDotSpell: true,
    dotType: "venom",
    dotDamage: 4,
    dotDamagePerTurn: 4,
    dotDuration: 3,
    usableByEnemy: true,
    targetType: "enemy",
  };
}

function strike(): SpellConfig {
  return {
    id: "physical_attack",
    name: "Strike",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 10n,
    range: 1n,
    effectType: "damage",
    spellType: "damage",
    targetType: "enemy",
  };
}

function frost(): SpellConfig {
  return {
    id: "starter-frost",
    name: "Frost",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 8n,
    range: 4n,
    effectType: "damage",
    spellType: "damage",
    targetType: "enemy",
  };
}

function wolf(x: number, y: number): Enemy {
  return {
    id: "wolf-1",
    x,
    y,
    level: 2,
    hp: 20,
    maxHp: 20,
    res: 0,
    sp: 0,
    chc: 0,
    init: 6,
    pieceType: "wolf",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    side: "enemy",
    isSummon: true,
    summonAI: "hunter",
  };
}

function packBishop(x: number, y: number): Enemy {
  return {
    id: "bishop",
    x,
    y,
    level: 3,
    hp: 30,
    maxHp: 30,
    res: 0,
    sp: 0,
    chc: 0,
    init: 6,
    pieceType: "bishop",
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    side: "enemy",
  };
}

function openGrid(): boolean[][] {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => true));
}

function ctx(
  enemy: Enemy,
  player: { x: number; y: number },
  spells: SpellConfig[],
): DecideEnemyContext {
  return {
    enemy,
    combatants: [
      {
        id: "player",
        side: "player",
        name: "hero",
        x: player.x,
        y: player.y,
        hp: 40,
        maxHp: 40,
        level: 3,
      },
    ],
    grid: openGrid(),
    occupied: new Set([`${player.x},${player.y}`]),
    barriers: new Set(),
    portals: new Set(),
    voidTiles: new Set(),
    hazardTiles: new Map(),
    availableSpells: spells,
    assignedSpells: spells,
    battleTurn: 1,
    allyCount: 0,
    enemyCount: 1,
    enrageMultiplier: 1,
    isSlimeFlood: false,
    rng: () => 0,
    getEffectiveStat: () => 0,
    calcScaledDamage: (base) => base,
    hasLineOfSight: () => true,
    log: () => {},
    focusTargetId: null,
    setFocusTargetId: () => {},
    focusAlreadySet: false,
    markFocusSet: () => {},
  };
}

describe("shouldDecideSummonKitAction", () => {
  it("routes every summon, including hostile minions", () => {
    assert.equal(shouldDecideSummonKitAction({ isSummon: true }), true);
    assert.equal(shouldDecideSummonKitAction({ isSummon: false }), false);
    assert.equal(shouldDecideSummonKitAction({}), false);
  });
});

describe("resolveEnemySummonAI", () => {
  it("prefers the summon spell's summonAI over pieceType", () => {
    assert.equal(
      resolveEnemySummonAI(
        { id: "summon-dire-wolf", summonAI: "hunter" },
        { pieceType: "pawn" },
        [],
      ),
      "hunter",
    );
  });

  it("reads summonAI from the catalog when the spawn payload is id-only", () => {
    assert.equal(
      resolveEnemySummonAI({ id: "summon-archer" }, { pieceType: "pawn" }, [
        { id: "summon-archer", summonAI: "archer" },
      ]),
      "archer",
    );
  });

  it("maps live wolf / archer piece types when summonAI is missing", () => {
    assert.equal(summonAIFromPieceType("wolf"), "hunter");
    assert.equal(summonAIFromPieceType("archer"), "archer");
    assert.equal(
      resolveEnemySummonAI({ id: "summon-dire-wolf" }, { pieceType: "wolf" }),
      "hunter",
    );
  });
});

describe("resolveSummonKitSpells", () => {
  it("copies catalog rows in kit order and skips unknown ids", () => {
    const kit = resolveSummonKitSpells(
      { summonKit: ["physical_attack", "missing", "spell-venom-strike"] },
      [venom(), strike()],
    );
    assert.deepEqual(
      kit.map((s) => s.id),
      ["physical_attack", "spell-venom-strike"],
    );
  });

  it("attaches the kit onto the spawned summon object", () => {
    const summon: { spells?: SpellConfig[] } = {};
    attachEnemySummonKit(summon, { summonKit: ["spell-venom-strike"] }, [
      venom(),
    ]);
    assert.equal(summon.spells?.[0]?.id, "spell-venom-strike");
  });
});

describe("decideHostileCombatantAction", () => {
  it("lets a hostile wolf cast Venom Strike instead of pack generic melee", () => {
    const enemy = wolf(2, 2);
    const action = decideHostileCombatantAction(
      enemy,
      ctx(enemy, { x: 3, y: 2 }, [strike(), venom()]),
    );
    assert.equal(action.kind, "cast");
    assert.equal(action.spell?.id, "spell-venom-strike");
    assert.equal(action.targetId, "player");
  });

  it("keeps pack enemies on decideEnemyAction", () => {
    const enemy = packBishop(2, 2);
    const action = decideHostileCombatantAction(
      enemy,
      ctx(enemy, { x: 6, y: 2 }, [frost()]),
    );
    assert.notEqual(action.spell?.id, "spell-venom-strike");
    assert.ok(action.kind === "cast" || action.kind === "move");
  });
});

describe("shouldApplyEnemyCastDotOnly", () => {
  it("applies catalog 0-damage DoTs that pack apply used to drop", () => {
    assert.equal(shouldApplyEnemyCastDotOnly(venom()), true);
    assert.equal(
      shouldApplyEnemyCastDotOnly({
        damage: 0,
        dotDamagePerTurn: 4,
        dotDuration: 3,
      }),
      true,
    );
  });

  it("does not steal Strike, Slow, or empty rows into the DoT branch", () => {
    assert.equal(shouldApplyEnemyCastDotOnly(strike()), false);
    assert.equal(
      shouldApplyEnemyCastDotOnly({
        damage: 0,
        debuffStat: "mp",
        debuffDuration: 2,
      }),
      false,
    );
    assert.equal(
      shouldApplyEnemyCastDotOnly({ damage: 8, dotDuration: 3 }),
      false,
    );
  });
});
