/**
 * Combat action parity: keyboard / shortcut select matches click, then a
 * highlighted legal target is executable and an illegal target cannot
 * execute (tile / sprite / Attack Nearest / S / plan).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Enemy, SpellConfig } from "../types/gameTypes.ts";
import {
  BATTLE_SPELL_SLOT_COUNT,
  canHotkeySelectSpell,
  classifyBattleSpellHotkey,
  decideSpellHotkey,
  hotkeyAttackNearestTile,
  hotkeyHighlightContains,
  hotkeyHighlightedTileIsExecutable,
  hotkeySelectedCastPlan,
  isCancelSpellSelectionHotkey,
  isSpellSlotHotkey,
  spellSlotIndexFromKey,
} from "./battleSpellHotkeys.ts";
import { playerCastAttemptResult } from "./playerCastPlan.ts";
import {
  collectHighlightLiveMismatches,
  computeTargetableTiles,
  decideSpriteCastClick,
  decideTileCastClick,
  probeLiveCast,
  shouldExecuteLiveCast,
} from "./targeting.ts";

function floorGrid(size: number): Array<Array<"floor" | "wall" | "portal">> {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "floor" as const),
  );
}

function unit(
  id: string,
  x: number,
  y: number,
  extras: Partial<Enemy> = {},
): Enemy {
  return {
    id,
    x,
    y,
    hp: 20,
    maxHp: 20,
    name: id,
    pieceType: "pawn",
    ...extras,
  } as Enemy;
}

function strike(overrides: Partial<SpellConfig> = {}): SpellConfig {
  return {
    id: "physical_attack",
    name: "Strike",
    description: "",
    iconEmoji: "",
    apCost: 2n,
    mpCost: 0n,
    damage: 10n,
    range: 1n,
    effectType: "damage",
    targetType: "enemy",
    isPhysical: true,
    maxRange: 1,
    minRange: 1,
    ...overrides,
  } as SpellConfig;
}

function timestep(): SpellConfig {
  return strike({
    id: "spell-timestep",
    name: "Timestep",
    apCost: 0n,
    damage: 0n,
    range: 0n,
    maxRange: 0,
    minRange: 0,
    effectType: "buff",
    targetType: "self",
    isTimestep: true,
    isPhysical: false,
  });
}

function poisonLos(): SpellConfig {
  return strike({
    id: "starter-poison",
    isPhysical: false,
    range: 4n,
    maxRange: 4,
    lineOfSight: true,
  });
}

describe("spell slot key map", () => {
  it("maps Digit / Numpad 1–8 onto the eight painted badges", () => {
    assert.equal(BATTLE_SPELL_SLOT_COUNT, 8);
    assert.equal(spellSlotIndexFromKey({ code: "Digit1" }), 0);
    assert.equal(spellSlotIndexFromKey({ code: "Digit8" }), 7);
    assert.equal(spellSlotIndexFromKey({ code: "Numpad3" }), 2);
    assert.equal(spellSlotIndexFromKey({ key: "5" }), 4);
    assert.equal(spellSlotIndexFromKey({ code: "Digit9", key: "9" }), null);
    assert.equal(isSpellSlotHotkey({ code: "Digit2" }), true);
    assert.equal(isSpellSlotHotkey({ code: "Digit2", ctrlKey: true }), false);
  });

  it("classifies S / Escape / Digit without stealing inspect Escape", () => {
    assert.equal(classifyBattleSpellHotkey({ key: "s" }), "attack_nearest");
    assert.equal(classifyBattleSpellHotkey({ key: "Escape" }), "cancel");
    assert.equal(classifyBattleSpellHotkey({ code: "Digit1" }), "slot");
    assert.equal(classifyBattleSpellHotkey({ key: "x" }), "ignore");
    assert.equal(isCancelSpellSelectionHotkey({ key: "Escape" }), true);
    assert.equal(
      isCancelSpellSelectionHotkey({ key: "Escape", altKey: true }),
      false,
    );
  });
});

describe("hotkey select vs execute resources", () => {
  it("selects a ready Strike and refuses cooldown / missing AP / empty", () => {
    const ready = strike();
    const inferno = strike({ id: "spell-inferno", apCost: 5n, cooldown: 3 });
    assert.equal(
      canHotkeySelectSpell({
        inBattle: true,
        spell: ready,
        cooldownTurnsRemaining: 0,
        currentAp: 4,
      }),
      true,
    );
    assert.equal(
      canHotkeySelectSpell({
        inBattle: true,
        spell: inferno,
        cooldownTurnsRemaining: 2,
        currentAp: 6,
      }),
      false,
    );
    assert.equal(
      canHotkeySelectSpell({
        inBattle: true,
        spell: ready,
        cooldownTurnsRemaining: 0,
        currentAp: 1,
      }),
      false,
    );
    assert.equal(
      canHotkeySelectSpell({
        inBattle: false,
        spell: ready,
        cooldownTurnsRemaining: 0,
        currentAp: 4,
      }),
      false,
    );
    const slots = [ready, null, inferno];
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit1" },
        inBattle: true,
        slots,
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "select", slotIndex: 0 },
    );
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit2" },
        inBattle: true,
        slots,
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "ignore", reason: "empty_slot" },
    );
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit3" },
        inBattle: true,
        slots,
        cooldownTurnsRemaining: (id) => (id === "spell-inferno" ? 2 : 0),
        currentAp: 6,
      }),
      { action: "ignore", reason: "cannot_select" },
    );
  });

  it("lets 0-AP Timestep select when the wallet is empty", () => {
    assert.equal(
      canHotkeySelectSpell({
        inBattle: true,
        spell: timestep(),
        cooldownTurnsRemaining: 0,
        currentAp: 0,
      }),
      true,
    );
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit1" },
        inBattle: true,
        slots: [timestep()],
        cooldownTurnsRemaining: () => 0,
        currentAp: 0,
      }),
      { action: "select", slotIndex: 0 },
    );
  });

  it("cancels like Walk and leaves inspect-open Escape alone", () => {
    assert.deepEqual(
      decideSpellHotkey({
        event: { key: "Escape" },
        inBattle: true,
        slots: [strike()],
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "cancel" },
    );
    assert.deepEqual(
      decideSpellHotkey({
        event: { key: "Escape" },
        inBattle: true,
        inspectOpen: true,
        slots: [strike()],
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "ignore", reason: "inspect_open" },
    );
  });
});

describe("hotkey-selected highlight vs execute", () => {
  it("executes a painted LoS-legal hostile and refuses a wall-blocked one", () => {
    const tiles = floorGrid(11);
    tiles[5][6] = "wall";
    const caster = { x: 5, y: 5 };
    const open = unit("open", 5, 8, { side: "enemy" });
    const blocked = unit("blocked", 8, 5, { side: "enemy" });
    const enemies = [open, blocked];
    const spell = poisonLos();
    const grid = {
      tiles,
      enemies,
      worldGridSize: 11,
      effectiveRange: 4,
      barrierTiles: new Map<string, number>(),
    };
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit1" },
        inBattle: true,
        slots: [spell],
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "select", slotIndex: 0 },
    );
    assert.deepEqual(collectHighlightLiveMismatches(spell, caster, grid), {
      highlightOnly: [],
      liveOnly: [],
    });
    const highlighted = computeTargetableTiles(spell, caster, grid);
    assert.equal(highlighted.has("5,8"), true);
    assert.equal(highlighted.has("8,5"), false);
    assert.equal(
      hotkeyHighlightContains(spell, caster, open, enemies, tiles, 4),
      true,
    );
    assert.equal(
      hotkeyHighlightContains(spell, caster, blocked, enemies, tiles, 4),
      false,
    );

    const legalLive = probeLiveCast(spell, caster, open, enemies, tiles, 4);
    const illegalLive = probeLiveCast(
      spell,
      caster,
      blocked,
      enemies,
      tiles,
      4,
    );
    assert.equal(shouldExecuteLiveCast(legalLive), true);
    assert.equal(shouldExecuteLiveCast(illegalLive), false);

    const legalPlan = hotkeySelectedCastPlan({
      spell,
      caster,
      tile: open,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 4,
      currentAp: 4,
      cooldownTurnsRemaining: 0,
    });
    const illegalPlan = hotkeySelectedCastPlan({
      spell,
      caster,
      tile: blocked,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 4,
      currentAp: 4,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(legalPlan), "ok");
    assert.equal(playerCastAttemptResult(illegalPlan), "abort");
    assert.equal(
      hotkeyHighlightedTileIsExecutable({
        highlighted: highlighted.has("5,8"),
        plan: legalPlan,
      }),
      true,
    );
    assert.equal(
      hotkeyHighlightedTileIsExecutable({
        highlighted: highlighted.has("8,5"),
        plan: illegalPlan,
      }),
      false,
    );

    assert.deepEqual(
      decideTileCastClick({
        live: legalLive,
        tileHighlighted: highlighted.has("5,8"),
        occupantIsLiveHostile: true,
      }),
      { action: "execute", bypassHighlight: true },
    );
    assert.deepEqual(
      decideTileCastClick({
        live: illegalLive,
        tileHighlighted: highlighted.has("8,5"),
        occupantIsLiveHostile: true,
      }),
      { action: "reject", reason: illegalLive.reason },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: true,
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "execute", source: "sprite-enemy" },
    );
    assert.deepEqual(
      decideSpriteCastClick({
        selectedSpellId: spell.id,
        hasSelectedSpell: true,
        hitKind: "enemy",
        playerCastOk: true,
        inBattle: true,
        liveOk: false,
        selfOrAllySpell: false,
        hasBasicAttack: false,
      }),
      { action: "reject_live" },
    );

    const nearest = hotkeyAttackNearestTile({
      spell,
      caster,
      liveCombatants: enemies,
      mapTiles: tiles,
      effectiveRange: 4,
    });
    assert.deepEqual(nearest, { x: 5, y: 8 });
    assert.equal(highlighted.has(`${nearest!.x},${nearest!.y}`), true);
    assert.deepEqual(
      decideSpellHotkey({
        event: { key: "s" },
        inBattle: true,
        slots: [spell],
        cooldownTurnsRemaining: () => 0,
        currentAp: 4,
      }),
      { action: "attack_nearest" },
    );
  });

  it("cannot execute a hotkey-selected Inferno that is still on cooldown", () => {
    const tiles = floorGrid(6);
    const caster = { x: 1, y: 1 };
    const rat = unit("rat", 2, 1, { side: "enemy" });
    const spell = strike({ id: "spell-inferno", cooldown: 3 });
    assert.deepEqual(
      decideSpellHotkey({
        event: { code: "Digit1" },
        inBattle: true,
        slots: [spell],
        cooldownTurnsRemaining: () => 1,
        currentAp: 4,
      }),
      { action: "ignore", reason: "cannot_select" },
    );
    const plan = hotkeySelectedCastPlan({
      spell,
      caster,
      tile: rat,
      liveCombatants: [rat],
      mapTiles: tiles,
      effectiveRange: 1,
      currentAp: 4,
      cooldownTurnsRemaining: 1,
    });
    assert.equal(playerCastAttemptResult(plan), "on_cooldown");
    assert.equal(
      hotkeyHighlightedTileIsExecutable({
        highlighted: computeTargetableTiles(spell, caster, {
          tiles,
          enemies: [rat],
          worldGridSize: 6,
          effectiveRange: 1,
          barrierTiles: new Map(),
        }).has("2,1"),
        plan,
      }),
      false,
    );
  });

  it("executes a hotkey-selected Timestep on the painted self tile at 0 AP", () => {
    const tiles = floorGrid(6);
    const caster = { x: 2, y: 2 };
    const spell = timestep();
    const highlighted = computeTargetableTiles(spell, caster, {
      tiles,
      enemies: [],
      worldGridSize: 6,
      effectiveRange: 0,
      barrierTiles: new Map(),
    });
    assert.equal(highlighted.has("2,2"), true);
    const plan = hotkeySelectedCastPlan({
      spell,
      caster,
      tile: caster,
      liveCombatants: [],
      mapTiles: tiles,
      effectiveRange: 0,
      currentAp: 0,
      cooldownTurnsRemaining: 0,
    });
    assert.equal(playerCastAttemptResult(plan), "ok");
    assert.equal(
      hotkeyHighlightedTileIsExecutable({
        highlighted: highlighted.has("2,2"),
        plan,
      }),
      true,
    );
    const nearest = hotkeyAttackNearestTile({
      spell,
      caster,
      liveCombatants: [],
      mapTiles: tiles,
      effectiveRange: 0,
    });
    assert.deepEqual(nearest, caster);
  });
});
