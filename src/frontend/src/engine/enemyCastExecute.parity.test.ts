import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  chebyshevOnBoard,
  enemyCastRangeOk,
  enemySpellRange,
} from "./targeting.ts";

/**
 * WorldExploration used to re-derive Chebyshev vs Number(spell.range) after
 * the AI stepped (`distAM <= spellRange`). Decide already uses
 * {@link enemyCastRangeOk}. Execute must call the same helper so a legal
 * decide-range target still resolves after the move, and an out-of-range
 * tile cannot.
 */
function executeInRangeAfterMove(
  from: { x: number; y: number },
  to: { x: number; y: number },
  spell: { range: bigint | number },
): boolean {
  return enemyCastRangeOk(from, to, spell);
}

describe("enemy execute range vs decide (enemyCastRangeOk)", () => {
  const spell = { range: 3n };

  it("executes a highlighted/legal Chebyshev target after the AI steps", () => {
    const stepped = { x: 5, y: 4 };
    const target = { x: 7, y: 5 };
    assert.equal(enemySpellRange(spell), 3);
    assert.equal(executeInRangeAfterMove(stepped, target, spell), true);
    assert.equal(enemyCastRangeOk(stepped, target, spell), true);
    assert.equal(chebyshevOnBoard(stepped, target) <= 3, true);
  });

  it("refuses an illegal target the inline distAM check also used to skip", () => {
    const stepped = { x: 5, y: 4 };
    const far = { x: 9, y: 4 };
    assert.equal(executeInRangeAfterMove(stepped, far, spell), false);
    assert.equal(enemyCastRangeOk(stepped, far, spell), false);
  });

  it("keeps melee adjacency on the same Chebyshev helper as range", () => {
    const stepped = { x: 3, y: 4 };
    const target = { x: 4, y: 4 };
    assert.equal(chebyshevOnBoard(stepped, target) <= 1, true);
    assert.equal(chebyshevOnBoard(stepped, { x: 5, y: 4 }) <= 1, false);
  });
});
