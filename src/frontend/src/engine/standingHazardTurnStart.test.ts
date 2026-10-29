/**
 * Combat action parity: in-battle lava / spikes standing tax never
 * commits at turn start (walk / landing leftovers still require a dest
 * change).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PLAGUE_ZONE_TICK,
  VOID_RIFT_TICK,
  hpAfterIncomingDamage,
} from "./battleSetup.ts";
import {
  STANDING_HAZARD_TURN_START_BURNING_TICK,
  STANDING_HAZARD_TURN_START_BURNING_TURNS,
  STANDING_HAZARD_TURN_START_LAVA_MAX,
  STANDING_HAZARD_TURN_START_LAVA_MIN,
  STANDING_HAZARD_TURN_START_SPIKE_MAX,
  STANDING_HAZARD_TURN_START_SPIKE_MIN,
  type StandingHazardTurnStartArgs,
  advertisedStandingHazardTurnStartDamage,
  canExecuteStandingHazardTurnStart,
  executeStandingHazardTurnStart,
  isStandingHazardTurnStartKind,
  liveWxStandingHazardTurnStartDamage,
  resolveStandingHazardTurnStartPacket,
  rollStandingHazardTurnStartLava,
  rollStandingHazardTurnStartSpike,
  shouldDecideStandingHazardTurnStart,
  standingHazardTurnStartHighlightedIsExecutable,
} from "./standingHazardTurnStart.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function mapModifiersSource(): string {
  return readFileSync(join(here(), "./mapModifiers.ts"), "utf8");
}

function bossGuideSource(): string {
  return readFileSync(join(here(), "../components/BossGuideModal.tsx"), "utf8");
}

function enemyRegisterSource(): string {
  return readFileSync(join(here(), "../components/EnemyRegister.tsx"), "utf8");
}

function wxPlayerTurnStartBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "const playerModTarget = playerTurnStartModifierTarget(",
  );
  assert.ok(start >= 0, "player turn-start modifier target is present");
  const end = wx.indexOf('logBattleEntry("Your turn"', start);
  assert.ok(end > start, "Your turn still follows player turn-start ticks");
  return wx.slice(start, end);
}

function wxEnemyTurnStartBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf('route: "enemy-ai"');
  assert.ok(start >= 0, "enemy-ai dispatch is present");
  const end = wx.indexOf(
    "const afterTicks = getLiveCombatants(combatantStoreCtx).find(",
    start,
  );
  assert.ok(end > start, "afterTicks still follows enemy turn-start ticks");
  return wx.slice(start, end);
}

function wxEnemyLandingBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("// ── Enemy hazard tile landing");
  assert.ok(start >= 0, "enemy landing arm is present");
  const end = wx.indexOf('} else if (enemyHazard === "spikes")', start);
  assert.ok(end > start, "spikes landing still follows lava landing");
  return wx.slice(start, end);
}

function wxControlledSummonTurnStartBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf(
    "// Player-side control mode skipped the #84/#86 turn-start",
  );
  assert.ok(start >= 0, "summon-control turn-start arm is present");
  const end = wx.indexOf("} else {", start);
  assert.ok(end > start, "enemy-summon branch still follows control mode");
  return wx.slice(start, end);
}

function applyTurnStartHooksBlock(): string {
  const src = mapModifiersSource();
  const start = src.indexOf("export const MAP_MODIFIERS");
  assert.ok(start >= 0, "MAP_MODIFIERS is present");
  const end = src.indexOf("listAdminModifierTypeOptions", start);
  assert.ok(end > start, "admin options still follow the registry");
  return src.slice(start, end);
}

function standingReady(
  extra: Partial<StandingHazardTurnStartArgs> = {},
): StandingHazardTurnStartArgs {
  return {
    inBattle: true,
    movedThisTurn: false,
    occupying: "lava",
    currentHp: 100,
    lavaDmg: 12,
    spikeDmg: 7,
    actor: "player",
    ...extra,
  };
}

describe("in-battle lava / spikes standing turn-start", () => {
  it("guide copy advertises standing / end-of-turn tax distinct from walk min", () => {
    const guide = bossGuideSource();
    assert.ok(guide.includes("Avoid standing on or moving through its path."));
    assert.ok(
      guide.includes(
        "Stay mobile and avoid end-of-turn positioning on adjacent tiles.",
      ),
    );
    const register = enemyRegisterSource();
    assert.ok(register.includes("Avoid standing on tiles it walked across."));
    assert.equal(STANDING_HAZARD_TURN_START_LAVA_MIN, 8);
    assert.equal(STANDING_HAZARD_TURN_START_LAVA_MAX, 15);
    assert.equal(STANDING_HAZARD_TURN_START_SPIKE_MIN, 5);
    assert.equal(STANDING_HAZARD_TURN_START_SPIKE_MAX, 10);
    assert.equal(
      rollStandingHazardTurnStartLava(() => 0),
      8,
    );
    assert.equal(
      rollStandingHazardTurnStartLava(() => 0.999),
      15,
    );
    assert.equal(
      rollStandingHazardTurnStartSpike(() => 0),
      5,
    );
    assert.equal(
      rollStandingHazardTurnStartSpike(() => 0.999),
      10,
    );
    assert.notEqual(
      STANDING_HAZARD_TURN_START_LAVA_MIN,
      liveWxStandingHazardTurnStartDamage(),
    );
    assert.notEqual(
      STANDING_HAZARD_TURN_START_SPIKE_MIN,
      liveWxStandingHazardTurnStartDamage(),
    );
  });

  it("live turn-start never reads hazardTiles; landing still requires dest change", () => {
    const player = wxPlayerTurnStartBlock();
    assert.ok(player.includes("mapModifierRegistry.applyTurnStart("));
    assert.ok(player.includes('processActiveEffects("player")'));
    assert.ok(player.includes("isPlagueZone"));
    assert.equal(
      player.includes("hazardTiles"),
      false,
      "player turn-start still never reads hazardTiles",
    );
    assert.equal(player.includes("executeStandingHazardTurnStart"), false);
    assert.equal(player.includes("You stepped on lava"), false);

    const enemyStart = wxEnemyTurnStartBlock();
    assert.ok(enemyStart.includes("mapModifierRegistry.applyTurnStart("));
    assert.ok(enemyStart.includes("isPlagueZone"));
    assert.ok(enemyStart.includes("isVoidRift"));
    assert.equal(
      enemyStart.includes("hazardTiles"),
      false,
      "enemy turn-start still never reads hazardTiles",
    );

    const landing = wxEnemyLandingBlock();
    assert.ok(
      landing.includes("newX !== originX || newY !== originY"),
      "enemy landing still requires a dest change",
    );
    assert.ok(landing.includes("8 + Math.floor(Math.random() * 8)"));

    const control = wxControlledSummonTurnStartBlock();
    assert.ok(control.includes("mapModifierRegistry.applyTurnStart("));
    assert.equal(
      control.includes("hazardTiles"),
      false,
      "summon-control turn-start still never reads hazardTiles",
    );

    const hooks = applyTurnStartHooksBlock();
    assert.ok(hooks.includes('id: "void_rift"'));
    assert.ok(hooks.includes('id: "plague_zone"'));
    assert.ok(hooks.includes('id: "mending_mist"'));
    assert.ok(hooks.includes('id: "swift_winds"'));
    assert.equal(hooks.includes('id: "lava_fields"'), false);
    assert.equal(hooks.includes("spikes"), false);
    assert.equal(
      /onTurnStart:[\s\S]*hazardTiles/.test(hooks),
      false,
      "registry turn-start hooks still ignore hazardTiles",
    );
    assert.equal(wxSource().includes("executeStandingHazardTurnStart"), false);
    assert.equal(
      wxSource().includes("resolveStandingHazardTurnStartPacket"),
      false,
    );
  });

  it("executes End Turn on lava 12 as HP 67 after Burning; live leaves 79", () => {
    const hpAfterWalk = 100 - 12;
    const hpAfterBurning = Math.max(
      0,
      hpAfterWalk -
        STANDING_HAZARD_TURN_START_BURNING_TURNS *
          STANDING_HAZARD_TURN_START_BURNING_TICK,
    );
    assert.equal(hpAfterBurning, 79);

    const ready = standingReady({ currentHp: hpAfterBurning, lavaDmg: 12 });
    const decided = shouldDecideStandingHazardTurnStart(ready);
    const executable = canExecuteStandingHazardTurnStart(ready);
    assert.equal(decided, true);
    assert.equal(executable, true);
    assert.equal(
      standingHazardTurnStartHighlightedIsExecutable({
        decided,
        executable,
      }),
      true,
    );

    const next = executeStandingHazardTurnStart(ready);
    assert.deepEqual(next, { damage: 12, hpAfter: 67, lethal: false });
    assert.equal(resolveStandingHazardTurnStartPacket(ready), 12);
    assert.equal(liveWxStandingHazardTurnStartDamage(), 0);
    assert.notEqual(next?.damage, liveWxStandingHazardTurnStartDamage());
    assert.equal(
      hpAfterIncomingDamage(
        hpAfterBurning,
        liveWxStandingHazardTurnStartDamage(),
      ).newHp,
      79,
    );

    const afterTwo = executeStandingHazardTurnStart({
      ...ready,
      currentHp: 100,
    });
    const second = executeStandingHazardTurnStart({
      ...ready,
      currentHp: afterTwo?.hpAfter ?? 0,
    });
    assert.deepEqual(afterTwo, { damage: 12, hpAfter: 88, lethal: false });
    assert.deepEqual(second, { damage: 12, hpAfter: 76, lethal: false });
    assert.equal(
      100 -
        liveWxStandingHazardTurnStartDamage() -
        liveWxStandingHazardTurnStartDamage(),
      100,
      "live two End Turns on lava leave HP unchanged",
    );

    assert.deepEqual(
      executeStandingHazardTurnStart(
        standingReady({ currentHp: 8, lavaDmg: 8 }),
      ),
      { damage: 8, hpAfter: 0, lethal: true },
      "advertised min lava 8 kills an 8 HP stander; live 0 leaves them up",
    );
    assert.equal(
      hpAfterIncomingDamage(8, liveWxStandingHazardTurnStartDamage()).lethal,
      false,
    );
  });

  it("cannot stamp walk dest-change, ice, plague, Void Rift, or sibling leftover payloads", () => {
    const ready = standingReady();
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        movedThisTurn: true,
      }),
      null,
      "walk / landing dest-change is #1100 / #1136 / #758",
    );
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        occupying: "ice",
      }),
      null,
      "ice Frozen re-apply is a sibling leftover",
    );
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        occupying: "thorned_ground",
      }),
      null,
      "thorn walk is #1097",
    );
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        occupying: "void_rift",
      }),
      null,
      "Void Rift turn-start is #1182",
    );
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        inBattle: false,
      }),
      null,
      "overworld has no turn-start standing tax",
    );
    assert.equal(
      advertisedStandingHazardTurnStartDamage({
        occupying: "lava",
        lavaDmg: 0,
        spikeDmg: 7,
      }),
      0,
    );
    assert.equal(
      executeStandingHazardTurnStart({
        ...ready,
        lavaDmg: 0,
      }),
      null,
    );
    assert.equal(isStandingHazardTurnStartKind("ice"), false);
    assert.equal(isStandingHazardTurnStartKind("lava"), true);
    assert.equal(isStandingHazardTurnStartKind("spikes"), true);

    const spike = executeStandingHazardTurnStart(
      standingReady({ occupying: "spikes", spikeDmg: 7, currentHp: 20 }),
    );
    assert.deepEqual(spike, { damage: 7, hpAfter: 13, lethal: false });
    assert.equal("hp" in (spike ?? {}), false);
    assert.equal("atk" in (spike ?? {}), false);
    assert.equal("ap" in (spike ?? {}), false);
    assert.equal("chc" in (spike ?? {}), false);
    assert.equal("heal" in (spike ?? {}), false);
    assert.equal("roll" in (spike ?? {}), false);
    assert.equal("glass" in (spike ?? {}), false);
    assert.equal("glyph" in (spike ?? {}), false);
    assert.equal("venom" in (spike ?? {}), false);
    assert.equal("sr" in (spike ?? {}), false);
    assert.equal("decide" in (spike ?? {}), false);
    assert.equal("soak" in (spike ?? {}), false);
    assert.equal("shield" in (spike ?? {}), false);
    assert.equal("burning" in (spike ?? {}), false);
    assert.equal("frozen" in (spike ?? {}), false);
    assert.equal("moved" in (spike ?? {}), false);
    assert.notEqual(spike?.damage, PLAGUE_ZONE_TICK);
    assert.notEqual(spike?.damage, VOID_RIFT_TICK);

    const enemySkip = executeStandingHazardTurnStart(
      standingReady({
        actor: "enemy",
        currentHp: 20,
        lavaDmg: 15,
      }),
    );
    assert.deepEqual(enemySkip, { damage: 15, hpAfter: 5, lethal: false });
    assert.equal(
      hpAfterIncomingDamage(20, liveWxStandingHazardTurnStartDamage()).newHp,
      20,
      "enemy skip-in-place landing guard leaves stamp HP",
    );

    const control = executeStandingHazardTurnStart(
      standingReady({ actor: "controlled-summon", lavaDmg: 12, currentHp: 10 }),
    );
    assert.deepEqual(control, { damage: 12, hpAfter: 0, lethal: true });
    assert.equal(
      standingHazardTurnStartHighlightedIsExecutable({
        decided: false,
        executable: false,
      }),
      false,
    );
  });

  it("keys off occupying lava/spikes metadata, not announce copy", () => {
    assert.equal(
      shouldDecideStandingHazardTurnStart(standingReady()),
      canExecuteStandingHazardTurnStart(standingReady()),
    );
    assert.equal(
      resolveStandingHazardTurnStartPacket(
        standingReady({ occupying: "spikes", spikeDmg: 5 }),
      ),
      5,
    );
    const src = readFileSync(join(here(), "../hooks/useBossSystem.ts"), "utf8");
    assert.ok(src.includes("function applySpikeOnLand("));
    assert.ok(src.includes('type: "spikes"'));
    assert.equal(src.includes("executeStandingHazardTurnStart"), false);
    assert.equal(src.includes("resolveStandingHazardTurnStartPacket"), false);
  });
});
