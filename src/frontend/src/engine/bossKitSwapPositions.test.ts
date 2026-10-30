/**
 * Combat action parity: boss kit Swap advertised exchange is unused.
 * Live kit apply dest-occupies the player tile; player CAST swaps.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { starterSpells } from "../data/spellData.ts";
import {
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_KIT_FIRST_ID,
  SPELL_SWAP_ID,
  VOID_GRANDMASTER_ID,
  VOID_GRANDMASTER_PHASE2_KIT_FIRST_ID,
  advertisedKitSwapPositions,
  kitSwapExchanged,
  kitSwapSharesPlayerCell,
  liveWxKitApplyMovesCasterOntoDest,
  liveWxKitApplySwapsPositions,
  liveWxKitSwapOccupancy,
  occupancy1280KitSwapRestack,
  simulateEnthronedVoidKitSwapTurns,
} from "./bossKitSwapPositions.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossKitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function wxBossKitApplyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// ── Boss kit spell cast branch ─────────────────────────────────",
  );
  assert.ok(start >= 0, "live boss kit apply arm is present");
  const end = wx.indexOf(
    "// Spell lookup failed — fall through to abilityResult handling.",
    start,
  );
  assert.ok(end > start, "abilityResult fallthrough still follows kit apply");
  return wx.slice(start, end);
}

function phaseFirstIdLine(kits: string, bossId: string, key: string): string {
  const heading = kits.indexOf(`${bossId}: {`);
  assert.ok(heading >= 0, `${bossId} kit is present`);
  const phase = kits.indexOf(`${key}:`, heading);
  assert.ok(phase > heading, `${bossId} has ${key}`);
  return kits.slice(phase, phase + 160);
}

describe("boss kit Swap advertised position exchange", () => {
  it("catalog Swap stays isSwap / 0 dmg; Void p1 and Grandmaster p2 first-id", () => {
    const swap = starterSpells.find((s) => s.id === SPELL_SWAP_ID);
    assert.ok(swap);
    assert.equal(swap?.isSwap, true);
    assert.equal(Number(swap?.damage), 0);
    assert.equal(swap?.spellType, "damage");
    assert.equal(swap?.targetType, "enemy");

    assert.equal(ENTHRONED_VOID_KIT_FIRST_ID, SPELL_SWAP_ID);
    assert.equal(VOID_GRANDMASTER_PHASE2_KIT_FIRST_ID, SPELL_SWAP_ID);

    const kits = bossKitsSource();
    const voidP1 = phaseFirstIdLine(kits, ENTHRONED_VOID_ID, "phase1SpellIds");
    assert.ok(
      voidP1.includes(`"${SPELL_SWAP_ID}"`),
      "enthroned_void phase 1 first-id is Swap",
    );
    const gmP2 = phaseFirstIdLine(kits, VOID_GRANDMASTER_ID, "phase2SpellIds");
    assert.ok(
      gmP2.includes(`"${SPELL_SWAP_ID}"`),
      "void_grandmaster phase 2 first-id is Swap",
    );
  });

  it("live kit apply dest-occupies without isSwap; player CAST still swaps", () => {
    assert.equal(liveWxKitApplySwapsPositions(), false);
    assert.equal(liveWxKitApplyMovesCasterOntoDest(), true);

    const kit = wxBossKitApplyBlock();
    assert.equal(
      kit.includes("isSwap"),
      false,
      "kit apply still has no isSwap branch",
    );
    assert.equal(
      kit.includes("swapPositions"),
      false,
      "kit apply still never calls swapPositions",
    );
    assert.ok(
      kit.includes("updateCombatant(combatantStoreCtx, enemyId, {"),
      "kit apply still writes the caster dest",
    );
    assert.ok(
      kit.includes("x: bossSpellDest.x"),
      "kit apply still dest-occupies bossSpellDest (player tile)",
    );
    assert.equal(kit.includes("advertisedKitSwapPositions"), false);
    assert.equal(wxSource().includes("executeBossKitSwap"), false);

    const wx = wxSource();
    assert.ok(
      wx.includes("swapPositions: (targetEnemyId: string) => {"),
      "player CAST still wires swapPositions",
    );
    const playerSwap = wx.slice(
      wx.indexOf("swapPositions: (targetEnemyId: string) => {"),
      wx.indexOf("swapPositions: (targetEnemyId: string) => {") + 700,
    );
    assert.ok(
      playerSwap.includes("setPlayerPositionSynced"),
      "player Swap still moves the player",
    );
    assert.ok(
      playerSwap.includes("updateCombatant(combatantStoreCtx, targetEnemyId"),
      "player Swap still moves the target onto the vacated player cell",
    );
  });

  it("one Swap: live both on player tile; #1280 stay; advertised exchange", () => {
    const caster = { x: 8, y: 10 };
    const player = { x: 8, y: 8 };

    const live = liveWxKitSwapOccupancy(caster, player);
    assert.deepEqual(live, { caster: player, player });
    assert.equal(kitSwapSharesPlayerCell(live), true);
    assert.equal(kitSwapExchanged(caster, player, live), false);

    const stay = occupancy1280KitSwapRestack(caster, player);
    assert.deepEqual(stay, { caster, player });
    assert.equal(kitSwapSharesPlayerCell(stay), false);
    assert.equal(kitSwapExchanged(caster, player, stay), false);

    const advertised = advertisedKitSwapPositions(caster, player);
    assert.deepEqual(advertised, { caster: player, player: caster });
    assert.equal(kitSwapSharesPlayerCell(advertised), false);
    assert.equal(kitSwapExchanged(caster, player, advertised), true);
  });

  it("two Void turns: advertised ping-pong; live stacked on player tile", () => {
    const caster = { x: 8, y: 10 };
    const player = { x: 8, y: 8 };
    const seq = simulateEnthronedVoidKitSwapTurns(caster, player, 2);

    assert.deepEqual(seq.live, [
      { caster: player, player },
      { caster: player, player },
    ]);
    assert.equal(kitSwapSharesPlayerCell(seq.live[0]!), true);
    assert.equal(kitSwapSharesPlayerCell(seq.live[1]!), true);

    assert.deepEqual(seq.occupancy1280, [
      { caster, player },
      { caster, player },
    ]);

    assert.deepEqual(seq.advertised, [
      { caster: player, player: caster },
      { caster, player },
    ]);
    assert.equal(kitSwapExchanged(caster, player, seq.advertised[0]!), true);
    assert.deepEqual(seq.advertised[1], { caster, player });
  });
});
