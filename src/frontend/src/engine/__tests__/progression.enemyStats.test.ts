import { describe, expect, it } from "vitest";
import type { ChessPieceType } from "../../types/gameTypes";
import { computeEnemyStats } from "../combatMath";
import { getEnemyBaseStats } from "../progression";

describe("getEnemyBaseStats", () => {
  it("is deterministic for the same level, piece, and seedKey", () => {
    const a = getEnemyBaseStats(12, "rook", "tile:3,4");
    const b = getEnemyBaseStats(12, "rook", "tile:3,4");
    expect(a).toEqual(b);
    expect(Object.values(a).every((n) => n >= 1)).toBe(true);
  });

  it("applies piece multipliers so a bishop rolls more SP than a pawn", () => {
    const pawn = getEnemyBaseStats(20, "pawn", 100);
    const bishop = getEnemyBaseStats(20, "bishop", 100);
    expect(bishop.sp).toBeGreaterThan(pawn.sp);
    expect(pawn.res).toBeGreaterThan(bishop.res);
  });

  it("falls back to king multipliers for an unknown piece type", () => {
    const unknown = getEnemyBaseStats(8, "not-a-piece" as ChessPieceType, 7);
    const king = getEnemyBaseStats(8, "king", 7);
    expect(unknown).toEqual(king);
  });

  it("keeps computeEnemyStats as a thin delegate of the same rolls", () => {
    expect(computeEnemyStats(15, "knight", "seed-a")).toEqual(
      getEnemyBaseStats(15, "knight", "seed-a"),
    );
  });
});
