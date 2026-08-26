import { describe, expect, it, vi } from "vitest";
import { WORLD_GRID_SIZE } from "../../data/gameConstants";
import type { OccupancyContext } from "../occupancy";
import type { SpellContext } from "../spellEngine";
import { type SummonAIKind, type SummonUnit, runSummonAI } from "../summonAI";

interface BoardUnit {
  id: string;
  side: "player" | "enemy";
  x: number;
  y: number;
}

function walkableGrid(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function makeOccupancy(
  occupied: Array<{ x: number; y: number }>,
  barriers: Array<{ x: number; y: number }> = [],
): OccupancyContext {
  return {
    tiles: walkableGrid(),
    barriers: new Set(barriers.map((c) => `${c.x},${c.y}`)),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (cell) =>
      occupied.some((c) => c.x === cell.x && c.y === cell.y),
  };
}

function makeSummon(overrides: Partial<SummonUnit> = {}): SummonUnit {
  return {
    id: "summon-1",
    name: "Wolf",
    x: 4,
    y: 4,
    hp: 20,
    maxHp: 20,
    side: "player",
    isSummon: true,
    summonAI: "hunter",
    ownerId: "player",
    turnsRemaining: 4,
    initiative: 10,
    pieceType: "pawn",
    level: 2,
    stats: { sp: 0, sr: 0, res: 0, chc: 0, init: 0 },
    ...overrides,
  };
}

function makeCtx(
  units: BoardUnit[],
  rng: () => number = () => 0.99,
): {
  ctx: SpellContext;
  dealDamage: ReturnType<typeof vi.fn>;
  heal: ReturnType<typeof vi.fn>;
  applyEffect: ReturnType<typeof vi.fn>;
  log: ReturnType<typeof vi.fn>;
} {
  const dealDamage = vi.fn(() => 0);
  const heal = vi.fn();
  const applyEffect = vi.fn();
  const log = vi.fn();
  const ctx: SpellContext = {
    rng,
    getEffectiveStat: () => 1,
    dealDamage,
    heal,
    applyEffect,
    placeBarrier: vi.fn(),
    spawnUnit: vi.fn(),
    log,
    isCellFree: (cell) => !units.some((u) => u.x === cell.x && u.y === cell.y),
    getCombatantAt: (cell) => {
      const hit = units.find((u) => u.x === cell.x && u.y === cell.y);
      return hit ? { id: hit.id, side: hit.side } : null;
    },
  };
  return { ctx, dealDamage, heal, applyEffect, log };
}

const kitFailRng = (): number => {
  throw new Error("force instinct fallback");
};

describe("runSummonAI kit path", () => {
  it("lets an adjacent hunter resolve Strike onto the enemy", () => {
    const summon = makeSummon();
    const { ctx, dealDamage } = makeCtx([
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "mob", side: "enemy", x: 5, y: 4 },
    ]);
    runSummonAI(summon, ctx);
    expect(dealDamage).toHaveBeenCalledWith("mob", expect.any(Number), {
      isPhysical: true,
    });
    expect(summon.x).toBe(4);
  });

  it("lets an in-range archer apply Poison Arrow and stay put", () => {
    const summon = makeSummon({ summonAI: "archer", name: "Hawk" });
    const { ctx, applyEffect, dealDamage } = makeCtx([
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "mob", side: "enemy", x: 7, y: 4 },
    ]);
    runSummonAI(summon, ctx);
    expect(applyEffect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "dot",
        targetId: "mob",
        effectName: "Poison Arrow",
      }),
    );
    expect(dealDamage).not.toHaveBeenCalled();
    expect(summon.x).toBe(4);
  });

  it("applies Inferno to the bomber itself when no target is passed", () => {
    const summon = makeSummon({ summonAI: "bomber", name: "Bomb" });
    const { ctx, applyEffect } = makeCtx([
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "mob", side: "enemy", x: 6, y: 4 },
    ]);
    runSummonAI(summon, ctx);
    expect(applyEffect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "dot",
        targetId: summon.id,
        effectName: "Inferno",
      }),
    );
    expect(summon.hp).toBe(20);
  });

  it("lets a healer kit-cast Blood Mend as a self buff, not an ally heal", () => {
    const summon = makeSummon({ summonAI: "healer", name: "Wisp" });
    const { ctx, applyEffect, heal } = makeCtx([
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "player", side: "player", x: 4, y: 3 },
    ]);
    runSummonAI(summon, ctx);
    expect(applyEffect).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "buff",
        targetId: summon.id,
        stat: "chc",
      }),
    );
    expect(heal).not.toHaveBeenCalled();
  });
});

describe("runSummonAI instinct fallback", () => {
  it("advances a distant hunter toward the nearest enemy", () => {
    const summon = makeSummon();
    const { ctx } = makeCtx(
      [
        { id: summon.id, side: "player", x: 4, y: 4 },
        { id: "mob", side: "enemy", x: 8, y: 4 },
      ],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(summon).toMatchObject({ x: 5, y: 4 });
  });

  it("refuses a hunter step onto a barrier when occupancy is supplied", () => {
    const summon = makeSummon();
    const units: BoardUnit[] = [
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "mob", side: "enemy", x: 8, y: 4 },
    ];
    const { ctx, log } = makeCtx(units, kitFailRng);
    runSummonAI(
      summon,
      ctx,
      makeOccupancy(
        units.map((u) => ({ x: u.x, y: u.y })),
        [{ x: 5, y: 4 }],
      ),
    );
    expect(summon).toMatchObject({ x: 4, y: 4 });
    expect(log.mock.calls.some((c) => String(c[0]).includes("blocked"))).toBe(
      true,
    );
  });

  it("melees when an adjacent hunter kit cast fails", () => {
    const summon = makeSummon({ level: 2 });
    const { ctx, dealDamage } = makeCtx(
      [
        { id: summon.id, side: "player", x: 4, y: 4 },
        { id: "mob", side: "enemy", x: 5, y: 4 },
      ],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(dealDamage).toHaveBeenCalledWith("mob", Math.round(2 * 2.5 + 4), {
      isPhysical: true,
    });
  });

  it("makes an adjacent archer retreat instead of standing in melee", () => {
    const summon = makeSummon({ summonAI: "archer", name: "Hawk" });
    const { ctx } = makeCtx(
      [
        { id: summon.id, side: "player", x: 4, y: 4 },
        { id: "mob", side: "enemy", x: 5, y: 4 },
      ],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(summon).toMatchObject({ x: 3, y: 4 });
  });

  it("detonates an adjacent bomber and zeros its HP", () => {
    const summon = makeSummon({
      summonAI: "bomber",
      name: "Bomb",
      level: 2,
    });
    const { ctx, dealDamage } = makeCtx(
      [
        { id: summon.id, side: "player", x: 4, y: 4 },
        { id: "mob", side: "enemy", x: 5, y: 4 },
      ],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(dealDamage).toHaveBeenCalledWith("mob", Math.round(2 * 3 + 6), {
      isPhysical: true,
    });
    expect(summon.hp).toBe(0);
  });

  it("heals the owner and steps closer on the healer instinct path", () => {
    const summon = makeSummon({
      summonAI: "healer",
      name: "Wisp",
      x: 6,
      y: 4,
      level: 2,
    });
    const { ctx, heal } = makeCtx(
      [
        { id: summon.id, side: "player", x: 6, y: 4 },
        { id: "player", side: "player", x: 4, y: 4 },
      ],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(heal).toHaveBeenCalledWith("player", Math.round(2 * 1.5 + 3));
    expect(summon).toMatchObject({ x: 5, y: 4 });
  });

  it("logs and idles when a hunter sees no enemies", () => {
    const summon = makeSummon();
    const { ctx, dealDamage, log } = makeCtx(
      [{ id: summon.id, side: "player", x: 4, y: 4 }],
      kitFailRng,
    );
    runSummonAI(summon, ctx);
    expect(dealDamage).not.toHaveBeenCalled();
    expect(
      log.mock.calls.some((c) => String(c[0]).includes("sees no enemies")),
    ).toBe(true);
  });

  it("logs an unknown AI kind without moving or dealing damage", () => {
    const summon = makeSummon({
      summonAI: "nope" as SummonAIKind,
      name: "Glitch",
    });
    const { ctx, dealDamage, log } = makeCtx([
      { id: summon.id, side: "player", x: 4, y: 4 },
      { id: "mob", side: "enemy", x: 5, y: 4 },
    ]);
    runSummonAI(summon, ctx);
    expect(dealDamage).not.toHaveBeenCalled();
    expect(summon).toMatchObject({ x: 4, y: 4 });
    expect(
      log.mock.calls.some((c) => String(c[0]).includes("unknown AI")),
    ).toBe(true);
  });
});
