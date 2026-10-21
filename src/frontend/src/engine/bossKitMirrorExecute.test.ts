/**
 * Combat action parity: boss kit Mirror decide matches execute.
 * A decided legal advertised Mirror is executable; live WX apply
 * kinds stay empty so the turn cannot no-op.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { physicalAttackSpell, starterSpells } from "../data/spellData.ts";
import { PLAYER_MIRROR_KEY } from "../utils/playerMirror.ts";
import {
  activateBossKitMirror,
  bossKitHighlightedMirrorIsExecutable,
  bossKitMirrorApplyCell,
  bossKitMirrorInRange,
  bossKitMirrorTileKey,
  canExecuteBossKitMirrorCast,
  consumeBossKitMirror,
  executeBossKitMirrorCast,
  isBossKitMirrorExecuteSpell,
  shouldDecideBossKitMirrorCast,
  wxBossKitApplyKinds,
} from "./bossKitMirrorExecute.ts";
import { enemyCastRangeOk } from "./targeting.ts";

function mustSpell(id: string) {
  const spell = starterSpells.find((s) => s.id === id);
  assert.ok(spell, id);
  return spell;
}

function firstPhase2Id(src: string, bossId: string): string | undefined {
  const match = src.match(
    new RegExp(`${bossId}:[\\s\\S]*?phase2SpellIds:\\s*\\[\\s*"([^"]+)"`),
  );
  return match?.[1];
}

describe("boss kit advertised Mirror vs WX execute", () => {
  it("treats catalog Mirror as a mirror execute spell", () => {
    const mirror = mustSpell("spell-mirror");
    assert.equal(mirror.isMirror, true);
    assert.equal(Number(mirror.damage), 0);
    assert.equal(mirror.spellType, "damage");
    assert.equal(Number(mirror.range), 0);
    assert.equal(mirror.targetType, "self");
    assert.equal(isBossKitMirrorExecuteSpell(mirror), true);
  });

  it("Mirror Sovereign and Midnight Bishop phase 2 first kit id is Mirror", () => {
    const src = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "../data/bossKits.ts"),
      "utf8",
    );
    assert.equal(firstPhase2Id(src, "mirror_sovereign"), "spell-mirror");
    assert.equal(firstPhase2Id(src, "midnight_bishop"), "spell-mirror");
  });

  it("does not steal Strike, Slow, Iron Skin, Swap, Mark, or Barrier onto Mirror", () => {
    assert.equal(isBossKitMirrorExecuteSpell(physicalAttackSpell), false);
    assert.equal(isBossKitMirrorExecuteSpell(mustSpell("spell-slow")), false);
    assert.equal(
      isBossKitMirrorExecuteSpell(mustSpell("spell-iron-skin")),
      false,
    );
    assert.equal(isBossKitMirrorExecuteSpell(mustSpell("spell-swap")), false);
    assert.equal(isBossKitMirrorExecuteSpell(mustSpell("spell-mark")), false);
    assert.equal(
      isBossKitMirrorExecuteSpell(mustSpell("spell-barrier")),
      false,
    );
  });

  it("live WX apply kinds miss Mirror (no isMirror arm)", () => {
    const mirror = mustSpell("spell-mirror");
    assert.deepEqual(wxBossKitApplyKinds(mirror), []);
    assert.deepEqual(wxBossKitApplyKinds(mustSpell("spell-swap")), []);
    assert.deepEqual(wxBossKitApplyKinds(mustSpell("spell-mark")), []);
    assert.notDeepEqual(wxBossKitApplyKinds(physicalAttackSpell), []);
    assert.ok(wxBossKitApplyKinds(mustSpell("spell-slow")).includes("debuff"));
  });

  it("executes self Mirror on the boss tile even when decide aimed at the player", () => {
    const mirror = mustSpell("spell-mirror");
    const boss = { x: 4, y: 4 };
    const player = { x: 8, y: 8 };
    assert.equal(
      enemyCastRangeOk(boss, player, mirror),
      false,
      "raw player dest vs range 0 must not be the execute gate",
    );
    assert.deepEqual(bossKitMirrorApplyCell(mirror, boss, player), boss);
    const decided = shouldDecideBossKitMirrorCast({
      spell: mirror,
      origin: boss,
      targetCell: player,
    });
    const executable = canExecuteBossKitMirrorCast({
      spell: mirror,
      origin: boss,
      targetCell: player,
    });
    assert.equal(bossKitMirrorInRange(boss, player, mirror), true);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      bossKitHighlightedMirrorIsExecutable({ decided, executable }),
      true,
    );
    assert.deepEqual(
      executeBossKitMirrorCast({
        spell: mirror,
        origin: boss,
        targetCell: player,
      }),
      { tile: { x: 4, y: 4 }, key: "4,4" },
    );
    assert.equal(bossKitMirrorTileKey(boss), "4,4");
  });

  it("player-cast mirrorRedirect consume uses the boss tile, not player Mirror", () => {
    const mirror = mustSpell("spell-mirror");
    const boss = { x: 3, y: 5 };
    const player = { x: 9, y: 1 };
    const executed = executeBossKitMirrorCast({
      spell: mirror,
      origin: boss,
      targetCell: player,
    });
    assert.ok(executed);
    const units = new Set<string>();
    activateBossKitMirror(units, executed.tile);
    assert.equal(units.has(PLAYER_MIRROR_KEY), false);
    assert.equal(units.has("3,5"), true);
    assert.equal(consumeBossKitMirror(units, player), false);
    assert.equal(units.has("3,5"), true);
    assert.equal(consumeBossKitMirror(units, boss), true);
    assert.equal(units.has("3,5"), false);
    assert.equal(consumeBossKitMirror(units, boss), false);
  });

  it("cannot execute Strike or Swap as a kit Mirror even when in range", () => {
    const origin = { x: 4, y: 4 };
    const dest = { x: 4, y: 4 };
    assert.equal(
      canExecuteBossKitMirrorCast({
        spell: physicalAttackSpell,
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      canExecuteBossKitMirrorCast({
        spell: mustSpell("spell-swap"),
        origin,
        targetCell: dest,
      }),
      false,
    );
    assert.equal(
      executeBossKitMirrorCast({
        spell: mustSpell("spell-mark"),
        origin,
        targetCell: dest,
      }),
      null,
    );
  });
});
