/**
 * Combat action parity: boss kit Mark decide matches execute.
 * A decided legal (in-range) advertised Mark is executable; live WX
 * apply kinds stay empty so the turn cannot no-op.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import {
  bossKitHighlightedMarkIsExecutable,
  bossKitMarkInRange,
  bossKitMarkTileKey,
  canExecuteBossKitMarkCast,
  executeBossKitMarkCast,
  isBossKitMarkExecuteSpell,
  shouldDecideBossKitMarkCast,
  wxBossKitApplyKinds,
} from "./bossKitMarkExecute.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

describe("boss kit advertised Mark vs WX execute", () => {
  it("treats catalog Mark as a mark execute spell", () => {
    const mark = mustSpell("spell-mark");
    assert.equal(mark.isMark, true);
    assert.equal(Number(mark.damage), 0);
    assert.equal(mark.spellType, "damage");
    assert.equal(Number(mark.range), 4);
    assert.equal(isBossKitMarkExecuteSpell(mark), true);
  });

  it("Pale Archivist phase 2 first kit id is Mark (empty cooldown Map)", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    const match = src.match(
      /pale_archivist:[\s\S]*?phase2SpellIds:\s*\[\s*"([^"]+)"/,
    );
    assert.equal(match?.[1], "spell-mark");
  });

  it("does not steal Strike, Slow, Iron Skin, Swap, Mirror, or Barrier onto Mark", () => {
    assert.equal(isBossKitMarkExecuteSpell(physicalAttackSpell), false);
    assert.equal(isBossKitMarkExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isBossKitMarkExecuteSpell(mustSpell("spell-iron-skin")),
      false,
    );
    assert.equal(isBossKitMarkExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isBossKitMarkExecuteSpell(mustSpell("spell-mirror")), false);
    assert.equal(isBossKitMarkExecuteSpell(mustSpell("spell-barrier")), false);
  });

  it("live WX apply kinds miss Mark (no isMark arm)", () => {
    const mark = mustSpell("spell-mark");
    assert.deepEqual(wxBossKitApplyKinds(mark), []);
    assert.deepEqual(wxBossKitApplyKinds(mustSpell("spell-swap")), []);
    assert.notDeepEqual(wxBossKitApplyKinds(physicalAttackSpell), []);
    assert.ok(wxBossKitApplyKinds(mustSpell("spell-slow")).includes("debuff"));
  });

  it("executes in-range Mark by placing the player-path tile key", () => {
    const mark = mustSpell("spell-mark");
    const boss = { x: 4, y: 4 };
    const player = { x: 7, y: 5 };
    const decided = shouldDecideBossKitMarkCast({
      spell: mark,
      origin: boss,
      targetCell: player,
    });
    const executable = canExecuteBossKitMarkCast({
      spell: mark,
      origin: boss,
      targetCell: player,
    });
    assert.equal(bossKitMarkInRange(boss, player, mark), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedMarkIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeBossKitMarkCast({
        spell: mark,
        origin: boss,
        targetCell: player,
      }),
      { tile: { x: 7, y: 5 }, key: "7,5" },
    );
    assert.equal(bossKitMarkTileKey(player), "7,5");
  });

  it("cannot execute Mark beyond Chebyshev 4", () => {
    const mark = mustSpell("spell-mark");
    const boss = { x: 2, y: 2 };
    const tooFar = { x: 7, y: 2 };
    assert.equal(bossKitMarkInRange(boss, tooFar, mark), false);
    const decided = shouldDecideBossKitMarkCast({
      spell: mark,
      origin: boss,
      targetCell: tooFar,
    });
    const executable = canExecuteBossKitMarkCast({
      spell: mark,
      origin: boss,
      targetCell: tooFar,
    });
    assert.equal(decided, false);
    assert.equal(executable, false);
    assert.equal(
      executeBossKitMarkCast({
        spell: mark,
        origin: boss,
        targetCell: tooFar,
      }),
      null,
    );
    assert.equal(
      bossKitHighlightedMarkIsExecutable({ decided, executable }),
      false,
    );
  });

  it("still executes a wall-blocked in-range Mark (WX skips LoS)", () => {
    const mark = mustSpell("spell-mark");
    const boss = { x: 2, y: 2 };
    const throughWall = { x: 6, y: 2 };
    assert.equal(
      canExecuteBossKitMarkCast({
        spell: mark,
        origin: boss,
        targetCell: throughWall,
      }),
      true,
      "boss kit inRange is Chebyshev only; do not merge player LoS",
    );
  });

  it("cannot execute Strike or Swap as a kit Mark even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 5, y: 4 };
    assert.equal(
      canExecuteBossKitMarkCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitMarkCast({
        spell: mustSpell("spell-swap"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      executeBossKitMarkCast({
        spell: mustSpell("spell-mirror"),
        origin,
        targetCell: dest,
      }),
      null,
    );
  });
});
