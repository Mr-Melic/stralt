import { describe, expect, it } from "vitest";
import {
  SUMMON_BASE_HP,
  SUMMON_BASE_LIFESPAN,
  SUMMON_LIFESPAN_PER_HALF_LEVEL,
  WORLD_GRID_SIZE,
} from "../../data/gameConstants";
import type { OccupancyContext } from "../occupancy";
import { applySummonResult, spawnSummonUnit } from "../summonSpawn";
import { makeSpell, makeTurnEntry } from "./fixtures";

function walkableGrid(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function occCtx(overrides: Partial<OccupancyContext> = {}): OccupancyContext {
  return {
    tiles: walkableGrid(),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: () => false,
    ...overrides,
  };
}

function spawn(
  overrides: {
    cell?: { x: number; y: number };
    spell?: Record<string, unknown>;
    spellLevel?: number;
    occupancyCtx?: OccupancyContext;
    side?: "player" | "enemy";
  } = {},
) {
  const spell = makeSpell({
    name: "Summon Wolf",
    summonAI: "hunter",
    summonUnitDef: { pieceType: "pawn", level: 1 },
    ...overrides.spell,
  });
  return spawnSummonUnit(
    overrides.cell ?? { x: 4, y: 4 },
    spell,
    "player",
    1,
    () => undefined,
    () => ({ chc: 0 }),
    overrides.spellLevel ?? 0,
    overrides.occupancyCtx,
    overrides.side ?? "player",
  );
}

describe("spawnSummonUnit", () => {
  it("throws when the spell has no summonUnitDef", () => {
    expect(() =>
      spawnSummonUnit(
        { x: 1, y: 1 },
        makeSpell({ name: "Not A Summon" }),
        "player",
        1,
        () => undefined,
        () => ({}),
      ),
    ).toThrow(/summonUnitDef is required/);
  });

  it("uses canonical lifespan and hunter HP at spell level 0", () => {
    const { summon, turnOrderEntry } = spawn();
    expect(summon.turnsRemaining).toBe(SUMMON_BASE_LIFESPAN);
    expect(summon.hp).toBe(SUMMON_BASE_HP.hunter);
    expect(summon.maxHp).toBe(SUMMON_BASE_HP.hunter);
    expect(summon.isSummon).toBe(true);
    expect(summon.side).toBe("player");
    expect(turnOrderEntry.type).toBe("enemy");
    expect(turnOrderEntry.isSummon).toBe(true);
    expect(turnOrderEntry.side).toBe("player");
    expect(turnOrderEntry.turnsRemaining).toBe(SUMMON_BASE_LIFESPAN);
  });

  it("adds floor(spellLevel / 2) turns to the base lifespan", () => {
    const { summon } = spawn({ spellLevel: 3 });
    expect(summon.turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN + Math.floor(3 / SUMMON_LIFESPAN_PER_HALF_LEVEL),
    );
  });

  it("replaces the base lifespan when the spell sets a truthy summonLifespan", () => {
    const { summon } = spawn({
      spell: { summonLifespan: 8 },
      spellLevel: 3,
    });
    expect(summon.turnsRemaining).toBe(
      8 + Math.floor(3 / SUMMON_LIFESPAN_PER_HALF_LEVEL),
    );
  });

  it("treats a falsy summonLifespan as missing and keeps the canonical base", () => {
    const { summon } = spawn({
      spell: { summonLifespan: 0 },
      spellLevel: 2,
    });
    expect(summon.turnsRemaining).toBe(
      SUMMON_BASE_LIFESPAN + Math.floor(2 / SUMMON_LIFESPAN_PER_HALF_LEVEL),
    );
  });

  it("falls back to the nearest free cell when the requested tile is occupied", () => {
    const requested = { x: 5, y: 5 };
    const { summon } = spawn({
      cell: requested,
      occupancyCtx: occCtx({
        isOccupied: (cell) => cell.x === 5 && cell.y === 5,
      }),
    });
    // Ring scan starts at dx = -r, so the first radius-1 candidate is left.
    expect(summon.x).toBe(4);
    expect(summon.y).toBe(5);
  });

  it("keeps the requested cell when occupancy context is omitted", () => {
    const { summon } = spawn({ cell: { x: 7, y: 2 } });
    expect(summon.x).toBe(7);
    expect(summon.y).toBe(2);
  });

  it("preserves enemy side on both the unit and the turn-order entry", () => {
    const { summon, turnOrderEntry } = spawn({ side: "enemy" });
    expect(summon.side).toBe("enemy");
    expect(turnOrderEntry.side).toBe("enemy");
    expect(turnOrderEntry.type).toBe("enemy");
  });
});

describe("applySummonResult", () => {
  it("appends the summon and inserts it after the summoner", () => {
    const { summon, turnOrderEntry } = spawn();
    const caster = makeTurnEntry({ id: "player", type: "player" });
    const boss = makeTurnEntry({ id: "boss" });
    const result = applySummonResult(
      summon,
      turnOrderEntry,
      "player",
      [],
      [caster, boss],
    );
    expect(result.enemies.map((e) => e.id)).toEqual([summon.id]);
    expect(result.turnOrder.map((e) => e.id)).toEqual([
      "player",
      summon.id,
      "boss",
    ]);
  });

  it("appends at the end when the summoner is not in the queue", () => {
    const { summon, turnOrderEntry } = spawn();
    const result = applySummonResult(
      summon,
      turnOrderEntry,
      "missing",
      [],
      [makeTurnEntry({ id: "boss" })],
    );
    expect(result.turnOrder.map((e) => e.id)).toEqual(["boss", summon.id]);
  });
});
