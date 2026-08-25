import { describe, expect, it } from "vitest";
import { WORLD_GRID_SIZE } from "../../data/gameConstants";
import type { Enemy, SpellConfig } from "../../types/gameTypes";
import {
  type AICombatant,
  type DecideEnemyContext,
  buildEnemyKit,
  decideEnemyAction,
  decideSummonAction,
  decideSummonerAction,
} from "../enemyAI";
import { makeEnemy, makeSpell } from "./fixtures";

function makeOpenGrid(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function toAICombatant(c: Enemy): AICombatant {
  return {
    id: c.id,
    side: c.side === "player" ? "player" : "enemy",
    isSummon: c.isSummon,
    summonAI: c.summonAI,
    name: c.assignedName ?? c.pieceType,
    x: c.x,
    y: c.y,
    hp: c.hp,
    maxHp: c.maxHp,
    level: c.level,
  };
}

function makeDecideCtx(
  actor: Enemy,
  others: Enemy[],
  opts?: {
    availableSpells?: SpellConfig[];
    assignedSpells?: SpellConfig[];
    occupied?: Set<string>;
    barriers?: Set<string>;
    portals?: Set<string>;
    voidTiles?: Set<string>;
    grid?: boolean[][];
    lastSummonTurn?: number | null;
    currentTurn?: number;
    focusAlreadySet?: boolean;
  },
): DecideEnemyContext {
  const combatants = [actor, ...others].map(toAICombatant);
  const occupied =
    opts?.occupied ?? new Set(combatants.map((c) => `${c.x},${c.y}`));
  const assignedSpells = opts?.assignedSpells ?? actor.spells ?? [];
  return {
    enemy: actor,
    combatants,
    grid: opts?.grid ?? makeOpenGrid(),
    occupied,
    barriers: opts?.barriers ?? new Set(),
    portals: opts?.portals ?? new Set(),
    voidTiles: opts?.voidTiles ?? new Set(),
    hazardTiles: new Map(),
    availableSpells: opts?.availableSpells ?? assignedSpells,
    assignedSpells,
    battleTurn: 1,
    allyCount: combatants.filter((c) => c.side === "enemy" && c.id !== actor.id)
      .length,
    enemyCount: combatants.filter((c) => c.side === "enemy").length,
    enrageMultiplier: 1,
    isSlimeFlood: false,
    rng: () => 0.5,
    getEffectiveStat: () => 0,
    calcScaledDamage: (base) => base,
    hasLineOfSight: () => true,
    log: () => undefined,
    focusTargetId: null,
    setFocusTargetId: () => undefined,
    focusAlreadySet: opts?.focusAlreadySet ?? false,
    markFocusSet: () => undefined,
    lastSummonTurn: opts?.lastSummonTurn,
    currentTurn: opts?.currentTurn,
  };
}

const melee = makeSpell({
  id: "physical_attack",
  name: "Strike",
  damage: 12n,
  range: 1n,
  effectType: "damage",
  spellType: "damage",
});

const frost = makeSpell({
  id: "starter-frost",
  name: "Frost",
  damage: 16n,
  range: 4n,
  effectType: "damage",
  spellType: "damage",
  lineOfSight: true,
});

const heal = makeSpell({
  id: "starter-heal",
  name: "Heal",
  damage: 0n,
  range: 3n,
  effectType: "heal",
  spellType: "heal",
  healAmount: 20,
});

const inferno = makeSpell({
  id: "spell-inferno",
  name: "Inferno",
  damage: 20n,
  range: 3n,
  effectType: "damage",
  spellType: "damage",
});

const wolfSummon = makeSpell({
  id: "summon-wolf",
  name: "Summon Wolf",
  damage: 0n,
  range: 3n,
  effectType: "summon",
  spellType: "summon",
  isSummon: true,
  usableByEnemy: true,
});

describe("buildEnemyKit", () => {
  it("unlocks zone-scaled kits and floors a negative zone to 0", () => {
    expect(buildEnemyKit("pawn", 0)).toEqual(["physical_attack"]);
    expect(buildEnemyKit("pawn", 1)).toEqual([
      "physical_attack",
      "spell-venom-strike",
    ]);
    expect(buildEnemyKit("bishop", 0)).toEqual(["starter-frost"]);
    expect(buildEnemyKit("bishop", 1)).toEqual([
      "starter-frost",
      "starter-poison",
    ]);
    expect(buildEnemyKit("queen", 0)).toEqual(["starter-frost"]);
    expect(buildEnemyKit("queen", 2)).toEqual([
      "spell-inferno",
      "starter-heal",
    ]);
    expect(buildEnemyKit("king", 2)).toEqual([
      "spell-inferno",
      "spell-rallying-cry",
    ]);
    expect(buildEnemyKit("pawn", -3)).toEqual(["physical_attack"]);
  });
});

describe("decideSummonerAction", () => {
  const summoner = toAICombatant(
    makeEnemy({ id: "summoner", x: 4, y: 4, side: "enemy", pieceType: "king" }),
  );

  it("skips when no summon spell is assigned", () => {
    const ctx = makeDecideCtx(
      makeEnemy({ id: "summoner", x: 4, y: 4, side: "enemy" }),
      [makeEnemy({ id: "player", x: 10, y: 4, side: "player" })],
      { assignedSpells: [melee] },
    );
    const action = decideSummonerAction(summoner, ctx);
    expect(action.kind).toBe("skip");
    expect(action.intent).toBe("no summon spell");
  });

  it("skips when the enemy-side summon cap is already reached", () => {
    const ctx = makeDecideCtx(
      makeEnemy({ id: "summoner", x: 4, y: 4, side: "enemy" }),
      [
        makeEnemy({ id: "player", x: 10, y: 4, side: "player" }),
        makeEnemy({
          id: "wolf-a",
          x: 5,
          y: 4,
          side: "enemy",
          isSummon: true,
        }),
        makeEnemy({
          id: "wolf-b",
          x: 5,
          y: 5,
          side: "enemy",
          isSummon: true,
        }),
      ],
      { assignedSpells: [wolfSummon] },
    );
    const action = decideSummonerAction(summoner, ctx);
    expect(action.kind).toBe("skip");
    expect(action.intent).toBe("summon cap reached");
  });

  it("skips while the every-other-turn cooldown is still active", () => {
    const ctx = makeDecideCtx(
      makeEnemy({ id: "summoner", x: 4, y: 4, side: "enemy" }),
      [makeEnemy({ id: "player", x: 10, y: 4, side: "player" })],
      {
        assignedSpells: [wolfSummon],
        currentTurn: 5,
        lastSummonTurn: 4,
      },
    );
    const action = decideSummonerAction(summoner, ctx);
    expect(action.kind).toBe("skip");
    expect(action.intent).toBe("summon cooldown");
  });

  it("casts onto the player/ally midpoint once the cooldown has elapsed", () => {
    const ctx = makeDecideCtx(
      makeEnemy({ id: "summoner", x: 4, y: 4, side: "enemy" }),
      [
        makeEnemy({ id: "player", x: 10, y: 4, side: "player" }),
        makeEnemy({ id: "ally", x: 4, y: 8, side: "enemy" }),
      ],
      {
        assignedSpells: [wolfSummon],
        currentTurn: 6,
        lastSummonTurn: 4,
      },
    );
    const action = decideSummonerAction(summoner, ctx);
    expect(action.kind).toBe("cast");
    expect(action.spell?.id).toBe("summon-wolf");
    expect(action.destination).toEqual({ x: 7, y: 6 });
  });
});

describe("decideEnemyAction", () => {
  it("advances a distant charger instead of idling out of reach", () => {
    const charger = makeEnemy({
      id: "charger",
      x: 2,
      y: 8,
      side: "enemy",
      pieceType: "pawn",
      spells: [melee],
    });
    const player = makeEnemy({
      id: "player",
      x: 12,
      y: 8,
      side: "player",
    });
    const action = decideEnemyAction(
      charger,
      makeDecideCtx(charger, [player], { assignedSpells: [melee] }),
    );
    expect(action.archetype).toBe("charger");
    expect(action.kind).toBe("move");
    expect(action.destination).toEqual({ x: 3, y: 8 });
    expect(action.intent).toBe("advance");
  });

  it("melees an adjacent target and prioritizes a player healer summon", () => {
    const charger = makeEnemy({
      id: "charger",
      x: 5,
      y: 5,
      side: "enemy",
      pieceType: "pawn",
      spells: [melee],
    });
    const wisp = makeEnemy({
      id: "wisp",
      x: 6,
      y: 5,
      side: "player",
      isSummon: true,
      summonAI: "healer",
    });
    const player = makeEnemy({
      id: "player",
      x: 5,
      y: 6,
      side: "player",
    });
    const action = decideEnemyAction(
      charger,
      makeDecideCtx(charger, [player, wisp], { assignedSpells: [melee] }),
    );
    expect(action.kind).toBe("cast");
    expect(action.targetId).toBe("wisp");
    expect(action.destination).toEqual({ x: 5, y: 5 });
  });

  it("does not step onto an occupied or barrier tile while approaching", () => {
    const charger = makeEnemy({
      id: "charger",
      x: 2,
      y: 8,
      side: "enemy",
      pieceType: "pawn",
      spells: [melee],
    });
    const player = makeEnemy({
      id: "player",
      x: 12,
      y: 8,
      side: "player",
    });
    const occupied = new Set(["2,8", "12,8", "3,8"]);
    const action = decideEnemyAction(
      charger,
      makeDecideCtx(charger, [player], {
        assignedSpells: [melee],
        occupied,
        barriers: new Set(["2,7"]),
      }),
    );
    const destKey = `${action.destination.x},${action.destination.y}`;
    expect(destKey).not.toBe("3,8");
    expect(destKey).not.toBe("2,7");
    expect(action.destination).not.toEqual({ x: 2, y: 8 });
  });

  it("does not treat a void or portal tile as a legal step", () => {
    const charger = makeEnemy({
      id: "charger",
      x: 4,
      y: 4,
      side: "enemy",
      pieceType: "pawn",
      spells: [melee],
    });
    const player = makeEnemy({
      id: "player",
      x: 12,
      y: 4,
      side: "player",
    });
    const action = decideEnemyAction(
      charger,
      makeDecideCtx(charger, [player], {
        assignedSpells: [melee],
        voidTiles: new Set(["5,4"]),
        portals: new Set(["4,5"]),
      }),
    );
    const destKey = `${action.destination.x},${action.destination.y}`;
    expect(destKey).not.toBe("5,4");
    expect(destKey).not.toBe("4,5");
  });

  it("lets a caster keep a ranged frost cast instead of walking into melee", () => {
    const caster = makeEnemy({
      id: "caster",
      x: 2,
      y: 2,
      side: "enemy",
      pieceType: "bishop",
      spells: [frost],
    });
    const player = makeEnemy({
      id: "player",
      x: 5,
      y: 2,
      side: "player",
    });
    const action = decideEnemyAction(
      caster,
      makeDecideCtx(caster, [player], { assignedSpells: [frost] }),
    );
    expect(action.archetype).toBe("caster");
    expect(action.kind).toBe("cast");
    expect(action.spell?.id).toBe("starter-frost");
    expect(action.targetId).toBe("player");
    expect(action.destination).toEqual({ x: 2, y: 2 });
  });
});

describe("decideSummonAction", () => {
  it("lets a player-side hunter melee an enemy and never target the player", () => {
    const wolf = makeEnemy({
      id: "wolf",
      x: 5,
      y: 5,
      side: "player",
      isSummon: true,
      summonAI: "hunter",
      pieceType: "pawn",
      spells: [melee],
    });
    const foe = makeEnemy({
      id: "goblin",
      x: 6,
      y: 5,
      side: "enemy",
      hp: 8,
    });
    const player = makeEnemy({
      id: "player",
      x: 5,
      y: 6,
      side: "player",
    });
    const action = decideSummonAction(
      wolf,
      makeDecideCtx(wolf, [foe, player], {
        assignedSpells: [melee],
      }),
    );
    expect(action.kind).toBe("melee");
    expect(action.targetId).toBe("goblin");
    expect(action.targetId).not.toBe("player");
  });

  it("heals a same-side ally below the 50% threshold", () => {
    const wisp = makeEnemy({
      id: "wisp",
      x: 4,
      y: 4,
      side: "player",
      isSummon: true,
      summonAI: "healer",
      pieceType: "bishop",
      spells: [heal],
    });
    const player = makeEnemy({
      id: "player",
      x: 5,
      y: 4,
      side: "player",
      hp: 20,
      maxHp: 50,
    });
    const foe = makeEnemy({
      id: "goblin",
      x: 10,
      y: 10,
      side: "enemy",
    });
    const action = decideSummonAction(
      wisp,
      makeDecideCtx(wisp, [player, foe], { assignedSpells: [heal] }),
    );
    expect(action.kind).toBe("cast");
    expect(action.spell?.id).toBe("starter-heal");
    expect(action.targetId).toBe("player");
    expect(action.intent).toBe("heal");
  });

  it("maps legacy kiter/kamikaze aliases onto archer and bomber kits", () => {
    const archer = makeEnemy({
      id: "kiter",
      x: 2,
      y: 2,
      side: "player",
      isSummon: true,
      summonAI: "kiter",
      spells: [
        makeSpell({
          id: "starter-poison",
          name: "Poison Arrow",
          damage: 8n,
          range: 4n,
          effectType: "damage",
          spellType: "damage",
        }),
      ],
    });
    const foe = makeEnemy({ id: "goblin", x: 5, y: 2, side: "enemy" });
    const archerAction = decideSummonAction(
      archer,
      makeDecideCtx(archer, [foe], { assignedSpells: archer.spells }),
    );
    expect(archerAction.kind).toBe("cast");
    expect(archerAction.targetId).toBe("goblin");

    const bomber = makeEnemy({
      id: "bomb",
      x: 4,
      y: 4,
      side: "enemy",
      isSummon: true,
      summonAI: "kamikaze",
      hp: 10,
      maxHp: 50,
      spells: [inferno],
    });
    const a = makeEnemy({ id: "p1", x: 5, y: 4, side: "player" });
    const b = makeEnemy({ id: "p2", x: 5, y: 5, side: "player" });
    const bombAction = decideSummonAction(
      bomber,
      makeDecideCtx(bomber, [a, b], { assignedSpells: [inferno] }),
    );
    expect(bombAction.kind).toBe("cast");
    expect(bombAction.spell?.id).toBe("spell-inferno");
    expect(bombAction.intent).toBe("detonate");
  });
});
