/**
 * Combat action parity: boss kit apply must not stamp the caster onto
 * the player dest (Swap exchanges; other kit spells stay put).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { WORLD_GRID_SIZE } from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import {
  AP_DRAIN_PASSIVE_ABILITY,
  BOSS_KIT_SUMMON_DEST_LEFTOVER_ID,
  ENTHRONED_VOID_ID,
  ENTHRONED_VOID_KIT_FIRST_ID,
  PALE_ARCHBISHOP_ID,
  PALE_ARCHBISHOP_KIT_FIRST_ID,
  PHANTOM_SPAWN_ABILITY,
  TWIN_MONARCHS_ID,
  TWIN_MONARCHS_KIT_FIRST_ID,
  advertisedBossKitCasterOccupancyAfterCast,
  combatantsShareCell,
  executeBossKitCasterOccupancyAfterCast,
  liveWxBossKitCasterOccupancyAfterCast,
  liveWxBossKitSummonShortCircuitRelocatesCaster,
  liveWxBossKitSwapExchangesCells,
  occupancyCellKey,
  occupancyCellsEqual,
  occupancyEngineForbidsCombatantStack,
  playerSwapExchangesCells,
  wxBossKitSpellRelocatesCasterToDest,
} from "./bossKitCasterDestOccupancy.ts";
import {
  type OccupancyContext,
  applyAttract,
  isCellFree,
  occKey,
} from "./occupancy.ts";

const swap = starterSpells.find((s) => s.id === "spell-swap");
const rally = starterSpells.find((s) => s.id === "spell-rallying-cry");
const wound = starterSpells.find((s) => s.id === "spell-cursed-wound");
const archer = starterSpells.find((s) => s.id === "summon-archer");
assert.ok(swap, "spell-swap");
assert.ok(rally, "spell-rallying-cry");
assert.ok(wound, "spell-cursed-wound");
assert.ok(archer, "summon-archer");

const BOSS_CELL = { x: 4, y: 8 };
const PLAYER_CELL = { x: 8, y: 8 };

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function bossAiSource(): string {
  return readFileSync(join(here(), "../hooks/useBossAI.ts"), "utf8");
}

function kitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function spellEngineSource(): string {
  return readFileSync(join(here(), "./spellEngine.ts"), "utf8");
}

function occupancySource(): string {
  return readFileSync(join(here(), "./occupancy.ts"), "utf8");
}

function kitBlock(bossKey: string, nextMarker: string): string {
  const src = kitsSource();
  const start = src.indexOf(`${bossKey}: {`);
  assert.ok(start >= 0, `${bossKey} kit is present`);
  const end = src.indexOf(nextMarker, start + bossKey.length);
  assert.ok(end > start, `${nextMarker} still follows ${bossKey}`);
  return src.slice(start, end);
}

function decideBlock(fnName: string, nextMarker: string): string {
  const src = bossAiSource();
  const start = src.indexOf(`export const ${fnName}`);
  assert.ok(start >= 0, `${fnName} is present`);
  const end = src.indexOf(nextMarker, start + fnName.length);
  assert.ok(end > start, `${nextMarker} still follows ${fnName}`);
  return src.slice(start, end);
}

function kitApplyDestWriteBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// End-of-turn flags — mirror the existing abilityResult tail",
  );
  assert.ok(start >= 0, "boss kit apply tail is present");
  const end = wx.indexOf(
    "// Spell lookup failed — fall through to abilityResult handling.",
    start,
  );
  assert.ok(end > start, "spell-lookup fallback still follows kit apply tail");
  return wx.slice(start, end);
}

function kitSummonShortCircuitBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// Summon short-circuit (mirror WX 13465-13479).");
  assert.ok(start >= 0, "boss kit summon short-circuit is present");
  const end = wx.indexOf(
    "// Damage / drain → playerTakesDamage (mirror WX 13520-13646).",
    start,
  );
  assert.ok(end > start, "kit damage arm still follows summon short-circuit");
  return wx.slice(start, end);
}

function pickBossKitSpellBlock(): string {
  const src = bossAiSource();
  const start = src.indexOf("function pickBossKitSpell(");
  assert.ok(start >= 0, "pickBossKitSpell is present");
  const end = src.indexOf("function getWalkableMoves(", start);
  assert.ok(end > start, "walk helpers still follow pickBossKitSpell");
  return src.slice(start, end);
}

function walkableTiles(): boolean[][] {
  return Array.from({ length: WORLD_GRID_SIZE }, () =>
    Array.from({ length: WORLD_GRID_SIZE }, () => true),
  );
}

function occupancyWithPlayer(): OccupancyContext {
  const occupied = new Set([occKey(PLAYER_CELL.x, PLAYER_CELL.y)]);
  return {
    tiles: walkableTiles(),
    barriers: new Set(),
    voidTiles: new Set(),
    portals: new Set(),
    isOccupied: (cell) => occupied.has(occKey(cell.x, cell.y)),
  };
}

function swapArgs() {
  return {
    caster: BOSS_CELL,
    dest: PLAYER_CELL,
    isSwap: true as const,
  };
}

function rallyArgs() {
  return {
    caster: BOSS_CELL,
    dest: PLAYER_CELL,
    isSwap: false as const,
  };
}

describe("wxBossKitSpellRelocatesCasterToDest (live leftover)", () => {
  it("stamps Enthroned Void Swap onto the player cell instead of exchanging", () => {
    assert.equal(swap.isSwap, true);
    assert.equal(Number(swap.damage), 0);
    assert.equal(wxBossKitSpellRelocatesCasterToDest(), true);
    assert.equal(liveWxBossKitSwapExchangesCells(), false);
    assert.equal(playerSwapExchangesCells(), true);

    const live = liveWxBossKitCasterOccupancyAfterCast(swapArgs());
    const advertised = executeBossKitCasterOccupancyAfterCast(swapArgs());

    assert.equal(live.stacked, true);
    assert.equal(combatantsShareCell(live.caster, live.target), true);
    assert.deepEqual(live.caster, PLAYER_CELL);
    assert.deepEqual(live.target, PLAYER_CELL);

    assert.equal(advertised.stacked, false);
    assert.deepEqual(advertised.caster, PLAYER_CELL);
    assert.deepEqual(advertised.target, BOSS_CELL);
    assert.equal(
      occupancyCellsEqual(advertised.caster, advertised.target),
      false,
    );
  });

  it("stamps Twin Monarchs Rallying Cry onto the player after the self-heal", () => {
    assert.equal(rally.isSwap === true, false);
    assert.equal(rally.spellType, "heal");
    assert.equal(rally.healAmount, 20);
    assert.equal(rally.targetType, "self");

    const live = liveWxBossKitCasterOccupancyAfterCast(rallyArgs());
    const advertised = advertisedBossKitCasterOccupancyAfterCast(rallyArgs());

    assert.equal(live.stacked, true);
    assert.deepEqual(live.caster, PLAYER_CELL);
    assert.equal(advertised.stacked, false);
    assert.deepEqual(advertised.caster, BOSS_CELL);
    assert.deepEqual(advertised.target, PLAYER_CELL);
  });

  it("stamps Pale Archbishop Cursed Wound onto the player after the hit", () => {
    assert.equal(wound.isSwap === true, false);
    assert.equal(Number(wound.damage), 22);

    const live = liveWxBossKitCasterOccupancyAfterCast(rallyArgs());
    const advertised = executeBossKitCasterOccupancyAfterCast({
      ...rallyArgs(),
      isSwap: false,
    });
    assert.equal(live.stacked, true);
    assert.equal(advertised.stacked, false);
    assert.deepEqual(advertised.caster, BOSS_CELL);
  });

  it("writes onto a cell occupancy already rejects as occupied", () => {
    assert.equal(occupancyEngineForbidsCombatantStack(), true);
    const occupancy = occupancyWithPlayer();
    assert.equal(isCellFree(PLAYER_CELL, occupancy), false);
    assert.equal(isCellFree(BOSS_CELL, occupancy), true);
    const live = liveWxBossKitCasterOccupancyAfterCast(swapArgs());
    assert.equal(isCellFree(live.caster, occupancy), false);
    assert.deepEqual(applyAttract(BOSS_CELL, PLAYER_CELL, 8, occupancy), {
      x: 7,
      y: 8,
    });
  });
});

describe("executeBossKitCasterOccupancyAfterCast", () => {
  it("exchanges Swap cells and keeps Rallying Cry / Wound put", () => {
    const swapped = executeBossKitCasterOccupancyAfterCast(swapArgs());
    assert.equal(swapped.stacked, false);
    assert.deepEqual(swapped.caster, PLAYER_CELL);
    assert.deepEqual(swapped.target, BOSS_CELL);

    const cried = executeBossKitCasterOccupancyAfterCast(rallyArgs());
    assert.equal(cried.stacked, false);
    assert.deepEqual(cried.caster, BOSS_CELL);
    assert.deepEqual(cried.target, PLAYER_CELL);
  });

  it("is a no-op relocate for kit Strike so this leftover cannot mint a swap", () => {
    const strike = starterSpells.find((s) => s.id === "physical_attack");
    assert.ok(strike);
    assert.equal(strike.isSwap === true, false);
    const after = executeBossKitCasterOccupancyAfterCast({
      caster: BOSS_CELL,
      dest: PLAYER_CELL,
      isSwap: false,
    });
    assert.deepEqual(after.caster, BOSS_CELL);
    assert.equal(after.stacked, false);
  });

  it("does not steal #910 summon dest, #1159 Phantom, or #1164 AP Drain", () => {
    assert.equal(archer.id, BOSS_KIT_SUMMON_DEST_LEFTOVER_ID);
    assert.equal(archer.isSummon, true);
    assert.equal(liveWxBossKitSummonShortCircuitRelocatesCaster(), false);
    assert.notEqual(PHANTOM_SPAWN_ABILITY, AP_DRAIN_PASSIVE_ABILITY);
    assert.notEqual(
      ENTHRONED_VOID_KIT_FIRST_ID,
      BOSS_KIT_SUMMON_DEST_LEFTOVER_ID,
    );
    assert.equal(occupancyCellKey(PLAYER_CELL), "8,8");
  });
});

describe("live WX / decide still write caster to dest", () => {
  it("Enthroned Void phase-1 first-id is Swap", () => {
    const kit = kitBlock("enthroned_void", "// ── Runtime validation");
    const p1 = kit.slice(
      kit.indexOf("phase1SpellIds:"),
      kit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${ENTHRONED_VOID_KIT_FIRST_ID}"`));
    assert.equal(
      p1.indexOf(`"${ENTHRONED_VOID_KIT_FIRST_ID}"`),
      p1.indexOf('"'),
    );
    assert.ok(kit.includes(`bossId: "${ENTHRONED_VOID_ID}"`));
  });

  it("Twin Monarchs phase-1 first-id is Rallying Cry", () => {
    const kit = kitBlock("twin_monarchs", "enthroned_void: {");
    const p1 = kit.slice(
      kit.indexOf("phase1SpellIds:"),
      kit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${TWIN_MONARCHS_KIT_FIRST_ID}"`));
    assert.equal(
      p1.indexOf(`"${TWIN_MONARCHS_KIT_FIRST_ID}"`),
      p1.indexOf('"'),
    );
    assert.ok(kit.includes(`bossId: "${TWIN_MONARCHS_ID}"`));
    assert.ok(kit.includes(`"${PALE_ARCHBISHOP_KIT_FIRST_ID}"`) === false);
  });

  it("Pale Archbishop phase-1 first-id is Cursed Wound", () => {
    const kit = kitBlock("pale_archbishop", "crimson_countess: {");
    const p1 = kit.slice(
      kit.indexOf("phase1SpellIds:"),
      kit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${PALE_ARCHBISHOP_KIT_FIRST_ID}"`));
    assert.equal(
      p1.indexOf(`"${PALE_ARCHBISHOP_KIT_FIRST_ID}"`),
      p1.indexOf('"'),
    );
    assert.ok(kit.includes(`bossId: "${PALE_ARCHBISHOP_ID}"`));
  });

  it("pickBossKitSpell still receives an empty cooldown Map", () => {
    const pick = pickBossKitSpellBlock();
    assert.equal(pick.includes("new Map<string, number>()"), false);
    const voidDecide = decideBlock(
      "decideEnthronedVoidAction",
      "const DECISION_MAP",
    );
    assert.ok(voidDecide.includes("pickBossKitSpell("));
    assert.ok(voidDecide.includes("new Map<string, number>()"));
    assert.ok(voidDecide.includes('type: "spell" as const'));
    assert.ok(voidDecide.includes("targetX: player?.x ?? 0"));
    assert.ok(voidDecide.includes("targetY: player?.y ?? 0"));
    assert.ok(voidDecide.includes(PHANTOM_SPAWN_ABILITY));
    assert.ok(voidDecide.includes(AP_DRAIN_PASSIVE_ABILITY));
    assert.ok(
      voidDecide.indexOf("pickBossKitSpell(") <
        voidDecide.indexOf(PHANTOM_SPAWN_ABILITY),
    );
  });

  it("Twin Monarchs decide still dest-targets the player for Rallying Cry", () => {
    const monarchs = decideBlock(
      "decideTwinMonarchsAction",
      "export const decideEnthronedVoidAction",
    );
    assert.ok(monarchs.includes("pickBossKitSpell("));
    assert.ok(monarchs.includes("new Map<string, number>()"));
    assert.ok(monarchs.includes("targetX: player?.x ?? 0"));
    assert.ok(monarchs.includes("MONARCH_ABSORB"));
    assert.ok(
      monarchs.indexOf("pickBossKitSpell(") <
        monarchs.indexOf("MONARCH_ABSORB"),
    );
  });

  it("kit apply tail writes caster to bossSpellDest without swapping the player", () => {
    const block = kitApplyDestWriteBlock();
    assert.ok(block.includes("x: bossSpellDest.x"));
    assert.ok(block.includes("y: bossSpellDest.y"));
    assert.equal(block.includes("swapPositions"), false);
    assert.equal(block.includes("isSwap"), false);
    assert.equal(block.includes("playerPosition"), false);
  });

  it("kit summon short-circuit still returns before the caster dest write", () => {
    const block = kitSummonShortCircuitBlock();
    assert.ok(block.includes("if (bossSpell.isSummon)"));
    assert.ok(
      block.includes("spawnEnemySummonRef.current?.(bossSpellDest, bossSpell)"),
    );
    assert.ok(block.includes("return;"));
    assert.equal(block.includes("x: bossSpellDest.x"), false);
  });

  it("player Swap still exchanges cells in spellEngine", () => {
    const src = spellEngineSource();
    assert.ok(src.includes("if (isSwapSpell && targetEnemy)"));
    assert.ok(src.includes("ctx.swapPositions(targetEnemy.id)"));
    const occ = occupancySource();
    assert.ok(occ.includes("never stacks two combatants on the same tile"));
  });
});
