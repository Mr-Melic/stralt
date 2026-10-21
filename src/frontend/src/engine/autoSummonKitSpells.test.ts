import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  catalogSummonKitIds,
  resolveAutoSummonAvailableSpells,
  resolveCatalogSummonKitSpells,
  shouldPreferCatalogSummonKit,
} from "./autoSummonKitSpells.ts";
import { type DecideEnemyContext, decideSummonAction } from "./enemyAI.ts";

function inferno(): SpellConfig {
  return {
    id: "spell-inferno",
    name: "Inferno",
    description: "",
    iconEmoji: "",
    apCost: 5n,
    mpCost: 0n,
    damage: 0n,
    range: 3n,
    effectType: "dot",
    spellType: "damage",
    isDotSpell: true,
    dotType: "burn",
    dotDamage: 8,
    dotDamagePerTurn: 8,
    dotDuration: 3,
    targetType: "enemy",
    areaRadius: 0,
  };
}

function bloodMend(): SpellConfig {
  return {
    id: "starter-heal",
    name: "Blood Mend",
    description: "",
    iconEmoji: "",
    apCost: 3n,
    mpCost: 0n,
    damage: 0n,
    range: 0n,
    effectType: "heal",
    spellType: "heal",
    healAmount: 12,
    buffStat: "chc",
    buffModifier: 0.15,
    buffDuration: 2,
    targetType: "self",
  };
}

function rallyingCry(): SpellConfig {
  return {
    id: "spell-rallying-cry",
    name: "Rallying Cry",
    description: "",
    iconEmoji: "",
    apCost: 4n,
    mpCost: 0n,
    damage: 0n,
    range: 0n,
    effectType: "heal",
    spellType: "heal",
    healAmount: 20,
    buffStat: "chc",
    targetType: "self",
  };
}

function shield(): SpellConfig {
  return {
    id: "starter-shield",
    name: "Shield",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 0n,
    range: 3n,
    effectType: "buff",
    spellType: "damage",
    buffStat: "res",
    buffModifier: 1.3,
    buffDuration: 3,
    targetType: "ally",
  };
}

function ironSkin(): SpellConfig {
  return {
    id: "spell-iron-skin",
    name: "Iron Skin",
    description: "",
    iconEmoji: "",
    apCost: 3n,
    mpCost: 0n,
    damage: 0n,
    range: 3n,
    effectType: "buff",
    spellType: "damage",
    buffStat: "res",
    targetType: "ally",
  };
}

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
    dotDamagePerTurn: 4,
    dotDuration: 3,
    targetType: "enemy",
  };
}

type CatalogRow = SpellConfig & {
  summonUnitDef?: { pieceType?: string; summonKit?: string[] };
};

function catalog(): CatalogRow[] {
  return [
    {
      ...inferno(),
      summonUnitDef: undefined,
    },
    bloodMend(),
    rallyingCry(),
    shield(),
    ironSkin(),
    venom(),
    {
      id: "summon-bomber",
      name: "Summon Bomber",
      description: "",
      iconEmoji: "",
      apCost: 2n,
      mpCost: 0n,
      damage: 0n,
      range: 2n,
      effectType: "summon",
      spellType: "summon",
      isSummon: true,
      summonUnitDef: {
        pieceType: "bomber",
        summonKit: ["spell-inferno"],
      },
    },
    {
      id: "summon-wisp",
      name: "Summon Wisp",
      description: "",
      iconEmoji: "",
      apCost: 2n,
      mpCost: 0n,
      damage: 0n,
      range: 2n,
      effectType: "summon",
      spellType: "summon",
      isSummon: true,
      summonUnitDef: {
        pieceType: "wisp",
        summonKit: ["starter-heal", "spell-rallying-cry"],
      },
    },
    {
      id: "summon-sentinel",
      name: "Summon Sentinel",
      description: "",
      iconEmoji: "",
      apCost: 3n,
      mpCost: 0n,
      damage: 0n,
      range: 2n,
      effectType: "summon",
      spellType: "summon",
      isSummon: true,
      summonUnitDef: {
        pieceType: "golem",
        summonKit: ["starter-shield", "spell-iron-skin"],
      },
    },
  ];
}

function summon(
  pieceType: string,
  summonAI: string,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id: `${pieceType}-1`,
    x: 2,
    y: 2,
    level: 2,
    hp: 20,
    maxHp: 20,
    res: 0,
    sp: 0,
    chc: 0,
    init: 6,
    pieceType: pieceType as Enemy["pieceType"],
    currentView: "front",
    isMoving: false,
    movementPath: [],
    scaleX: 1,
    scaleY: 1,
    nextMoveTime: 0,
    family: "plague_rat",
    side: "player",
    isSummon: true,
    summonAI,
    spells: [],
    ...extras,
  };
}

function openGrid(): boolean[][] {
  return Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => true));
}

function ctx(enemy: Enemy, spells: SpellConfig[]): DecideEnemyContext {
  return {
    enemy,
    combatants: [
      {
        id: "player",
        side: "player",
        name: "hero",
        x: 2,
        y: 3,
        hp: 10,
        maxHp: 40,
        level: 3,
      },
      {
        id: "rat",
        side: "enemy",
        name: "rat",
        x: 4,
        y: 2,
        hp: 12,
        maxHp: 12,
        level: 2,
      },
      {
        id: "rat-2",
        side: "enemy",
        name: "rat",
        x: 4,
        y: 3,
        hp: 12,
        maxHp: 12,
        level: 2,
      },
    ],
    grid: openGrid(),
    occupied: new Set(["2,3", "4,2", "4,3"]),
    barriers: new Set(),
    portals: new Set(),
    voidTiles: new Set(),
    hazardTiles: new Map(),
    availableSpells: spells,
    assignedSpells: spells,
    battleTurn: 1,
    allyCount: 1,
    enemyCount: 2,
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

describe("shouldPreferCatalogSummonKit", () => {
  it("prefers the catalog when spawn left spells empty or missing", () => {
    assert.equal(shouldPreferCatalogSummonKit([]), true);
    assert.equal(shouldPreferCatalogSummonKit(undefined), true);
    assert.equal(shouldPreferCatalogSummonKit(null), true);
  });

  it("keeps a stored kit so #842 hostile attach is not overwritten", () => {
    assert.equal(shouldPreferCatalogSummonKit([venom()]), false);
  });
});

describe("resolveAutoSummonAvailableSpells", () => {
  it("copies Bomber Inferno from catalog summonKit when spells is empty", () => {
    const kit = resolveAutoSummonAvailableSpells(
      { pieceType: "bomber", spells: [] },
      catalog(),
    );
    assert.deepEqual(
      kit.map((s) => s.id),
      ["spell-inferno"],
    );
    assert.equal(catalogSummonKitIds("bomber", catalog())[0], "spell-inferno");
  });

  it("copies Wisp Blood Mend then Rallying Cry in kit order", () => {
    const kit = resolveCatalogSummonKitSpells("wisp", catalog());
    assert.deepEqual(
      kit.map((s) => s.id),
      ["starter-heal", "spell-rallying-cry"],
    );
  });

  it("copies Sentinel Shield then Iron Skin in kit order", () => {
    const kit = resolveAutoSummonAvailableSpells(
      { pieceType: "golem" },
      catalog(),
    );
    assert.deepEqual(
      kit.map((s) => s.id),
      ["starter-shield", "spell-iron-skin"],
    );
  });

  it("skips unknown kit ids and unknown piece types", () => {
    const rows: CatalogRow[] = [
      {
        id: "summon-odd",
        name: "Odd",
        description: "",
        iconEmoji: "",
        apCost: 1n,
        mpCost: 0n,
        damage: 0n,
        range: 1n,
        effectType: "summon",
        spellType: "summon",
        summonUnitDef: {
          pieceType: "odd",
          summonKit: ["missing", "starter-heal"],
        },
      },
      bloodMend(),
    ];
    assert.deepEqual(
      resolveCatalogSummonKitSpells("odd", rows).map((s) => s.id),
      ["starter-heal"],
    );
    assert.deepEqual(resolveCatalogSummonKitSpells("ghost", rows), []);
  });

  it("does not replace a non-empty stored list", () => {
    const stored = [venom()];
    const kit = resolveAutoSummonAvailableSpells(
      { pieceType: "bomber", spells: stored },
      catalog(),
    );
    assert.equal(kit, stored);
    assert.equal(kit[0]?.id, "spell-venom-strike");
  });
});

describe("decideSummonAction with auto-summon catalog kit", () => {
  it("holds a player Bomber when spawn left spells empty", () => {
    const bomber = summon("bomber", "bomber", { hp: 5, maxHp: 20 });
    const action = decideSummonAction(bomber, ctx(bomber, bomber.spells ?? []));
    assert.equal(action.kind, "skip");
    assert.equal(action.spell, null);
    assert.equal(action.intent, "hold");
  });

  it("lets the same Bomber detonate Inferno once the catalog kit is supplied", () => {
    const bomber = summon("bomber", "bomber", { hp: 5, maxHp: 20 });
    const spells = resolveAutoSummonAvailableSpells(bomber, catalog());
    const action = decideSummonAction(bomber, ctx(bomber, spells));
    assert.equal(action.kind, "cast");
    assert.equal(action.spell?.id, "spell-inferno");
    assert.equal(action.intent, "detonate");
  });

  it("lets an auto Sentinel Shield the wounded player from catalog Shield", () => {
    const golem = summon("golem", "guardian");
    const empty = decideSummonAction(golem, ctx(golem, []));
    assert.notEqual(empty.spell?.id, "starter-shield");
    const spells = resolveAutoSummonAvailableSpells(golem, catalog());
    const action = decideSummonAction(golem, ctx(golem, spells));
    assert.equal(action.kind, "cast");
    assert.equal(action.spell?.id, "starter-shield");
    assert.equal(action.targetId, "player");
  });
});
