/**
 * Combat action parity: boss kit Swap decide matches execute.
 * A decided legal (in-range) advertised Swap is executable; live WX
 * apply kinds stay empty so the turn cannot no-op.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitHighlightedSwapIsExecutable,
  bossKitSwapInRange,
  bossKitSwapTiles,
  canExecuteBossKitSwapCast,
  executeBossKitSwapCast,
  isBossKitSwapExecuteSpell,
  shouldDecideBossKitSwapCast,
  wxBossKitApplyKinds,
} from "./bossKitSwapExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("boss kit advertised Swap vs WX execute", () => {
  it("treats catalog Swap as a swap execute spell", () => {
    const swap = mustSpell("spell-swap");
    assert.equal(swap.isSwap, true);
    assert.equal(Number(swap.damage), 0);
    assert.equal(swap.spellType, "damage");
    assert.equal(Number(swap.range), 3);
    assert.equal(isBossKitSwapExecuteSpell(swap), true);
  });

  it("does not steal Strike, Slow, Iron Skin, Mark, or Mirror onto Swap", () => {
    assert.equal(isBossKitSwapExecuteSpell(physicalAttackSpell), false);
    assert.equal(isBossKitSwapExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isBossKitSwapExecuteSpell(mustSpell("spell-iron-skin")),
      false,
    );
    assert.equal(isBossKitSwapExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(isBossKitSwapExecuteSpell(mustSpell("spell-mirror")), false);
  });

  it("live WX apply kinds miss Swap (no isSwap arm)", () => {
    const swap = mustSpell("spell-swap");
    assert.deepEqual(wxBossKitApplyKinds(swap), []);
    assert.deepEqual(wxBossKitApplyKinds(mustSpell("spell-mark")), []);
    assert.notDeepEqual(wxBossKitApplyKinds(physicalAttackSpell), []);
    assert.ok(wxBossKitApplyKinds(mustSpell("spell-slow")).includes("debuff"));
  });

  it("executes in-range Swap by exchanging tiles", () => {
    const swap = mustSpell("spell-swap");
    const boss = { x: 4, y: 4 };
    const player = { x: 6, y: 5 };
    const decided = shouldDecideBossKitSwapCast({
      spell: swap,
      origin: boss,
      targetCell: player,
    });
    const executable = canExecuteBossKitSwapCast({
      spell: swap,
      origin: boss,
      targetCell: player,
    });
    assert.equal(bossKitSwapInRange(boss, player, swap), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedSwapIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(executeBossKitSwapCast({ spell: swap, boss, player }), {
      boss: { x: 6, y: 5 },
      player: { x: 4, y: 4 },
    });
    assert.deepEqual(bossKitSwapTiles(boss, player), {
      boss: player,
      player: boss,
    });
  });

  it("cannot execute Swap beyond Chebyshev 3", () => {
    const swap = mustSpell("spell-swap");
    const boss = { x: 2, y: 2 };
    const tooFar = { x: 6, y: 2 };
    assert.equal(bossKitSwapInRange(boss, tooFar, swap), false);
    const decided = shouldDecideBossKitSwapCast({
      spell: swap,
      origin: boss,
      targetCell: tooFar,
    });
    const executable = canExecuteBossKitSwapCast({
      spell: swap,
      origin: boss,
      targetCell: tooFar,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      executeBossKitSwapCast({ spell: swap, boss, player: tooFar }),
      null,
    );
    assert.equal(
      bossKitHighlightedSwapIsExecutable({ decided, executable }),
      false,
    );
  });

  it("still executes a wall-blocked in-range Swap (WX skips LoS)", () => {
    const swap = mustSpell("spell-swap");
    const boss = { x: 2, y: 2 };
    const throughWall = { x: 4, y: 2 };
    assert.equal(
      canExecuteBossKitSwapCast({
        spell: swap,
        origin: boss,
        targetCell: throughWall,
      }),
      true,
      "boss kit inRange is Chebyshev only; do not merge player LoS",
    );
  });

  it("cannot execute Strike or Slow as a kit Swap even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    assert.equal(
      canExecuteBossKitSwapCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitSwapCast({
        spell: mustSpell("spell-slow"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      executeBossKitSwapCast({
        spell: mustSpell("spell-mark"),
        boss: origin,
        player: dest,
      }),
      null,
    );
  });
});
