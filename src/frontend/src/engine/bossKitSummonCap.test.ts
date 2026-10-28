/**
 * Combat action parity: Broodmother kit first-id Summon Archer honors
 * the advertised enemy-summon cap / every-other-turn cadence.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ENEMY_SUMMON_CAP,
  ENEMY_SUMMON_COOLDOWN_TURNS,
} from "../data/gameConstants.ts";
import { starterSpells } from "../data/spellData.ts";
import { shouldAwardVictory } from "./battleSetup.ts";
import {
  BOSS_KIT_SUMMON_CAP,
  BOSS_KIT_SUMMON_COOLDOWN_TURNS,
  BOSS_KIT_SUMMON_RANGE_LEFTOVER_ID,
  BROODMOTHER_KIT_FIRST_ID,
  BROODMOTHER_ROOK_ID,
  GHOST_SUMMON_ABILITY,
  LARVAE_SPAWN_ABILITY,
  PHANTOM_SPAWN_ABILITY,
  SPLIT_ROOKS_ABILITY,
  canSpawnBossKitSummonUnderPackGates,
  countLivingEnemySummons,
  executeBossKitSummonPackGates,
  isBossKitSummonCapReached,
  isBossKitSummonOnCooldown,
  isEnemySideSummon,
  liveHostilesAfterBossKitSummon,
  liveWxBossKitSummonHonorsPackGates,
  packSummonerHonorsPackGates,
  shouldSpawnBossKitSummonUnderPackGates,
  wxBossKitSummonSpawnsAtCap,
  wxBossKitSummonSpawnsOnCooldown,
} from "./bossKitSummonCap.ts";

const archer = starterSpells.find((s) => s.id === "summon-archer");
const venom = starterSpells.find((s) => s.id === "spell-venom-strike");
const strike = starterSpells.find((s) => s.id === "physical_attack");
assert.ok(archer, "summon-archer");
assert.ok(venom, "spell-venom-strike");
assert.ok(strike, "physical_attack");

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

function enemyAiSource(): string {
  return readFileSync(join(here(), "./enemyAI.ts"), "utf8");
}

function kitsSource(): string {
  return readFileSync(join(here(), "../data/bossKits.ts"), "utf8");
}

function broodmotherKitBlock(): string {
  const src = kitsSource();
  const start = src.indexOf("broodmother_rook: {");
  assert.ok(start >= 0, "broodmother kit is present");
  const end = src.indexOf("lord_of_static: {", start);
  assert.ok(end > start, "Lord of Static still follows Broodmother");
  return src.slice(start, end);
}

function decideBroodmotherBlock(): string {
  const src = bossAiSource();
  const start = src.indexOf("export const decideBroodmotherRookAction");
  assert.ok(start >= 0, "decideBroodmotherRookAction is present");
  const end = src.indexOf("export const decideLordOfStaticAction", start);
  assert.ok(end > start, "Lord of Static decide still follows Broodmother");
  return src.slice(start, end);
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

function packSummonerCapBlock(): string {
  const src = enemyAiSource();
  const start = src.indexOf("export function decideSummonerAction(");
  assert.ok(start >= 0, "decideSummonerAction is present");
  const end = src.indexOf("existingEnemySummons.length >= ENEMY_SUMMON_CAP");
  assert.ok(end > start, "pack summoner still reads ENEMY_SUMMON_CAP");
  return src.slice(start, end + 80);
}

function twoArchers() {
  return [
    {
      id: "broodmother",
      isSummon: false,
      side: "enemy",
      hp: 400,
    },
    {
      id: "archer-1",
      isSummon: true,
      side: "enemy",
      hp: 42,
    },
    {
      id: "archer-2",
      isSummon: true,
      side: "enemy",
      hp: 42,
    },
    {
      id: "player",
      isSummon: false,
      side: "player",
      hp: 100,
    },
  ];
}

function capArgs(
  overrides: Partial<Parameters<typeof executeBossKitSummonPackGates>[0]> = {},
) {
  return {
    combatants: twoArchers(),
    isSummon: true,
    currentTurn: 4,
    lastSummonTurn: 1,
    ...overrides,
  };
}

describe("wxBossKitSummonSpawnsAtCap (live leftover)", () => {
  it("stamps a third enemy Archer when two kit summons already live", () => {
    const living = countLivingEnemySummons(twoArchers());
    assert.equal(living, 2);
    assert.equal(isBossKitSummonCapReached(living), true);
    assert.equal(BOSS_KIT_SUMMON_CAP, 2);
    assert.equal(BOSS_KIT_SUMMON_CAP, ENEMY_SUMMON_CAP);
    assert.equal(liveWxBossKitSummonHonorsPackGates(), false);
    assert.equal(wxBossKitSummonSpawnsAtCap(), true);
    assert.equal(packSummonerHonorsPackGates(), true);
    assert.equal(canSpawnBossKitSummonUnderPackGates(capArgs()), false);
    const advertised = executeBossKitSummonPackGates(capArgs());
    assert.ok(advertised);
    assert.equal(advertised.spawned, false);
    assert.equal(advertised.capReached, true);
    assert.equal(advertised.livingEnemySummons, 2);
    assert.equal(
      liveHostilesAfterBossKitSummon({
        bossAlive: true,
        livingEnemySummonsBefore: 2,
        spawned: wxBossKitSummonSpawnsAtCap(),
      }),
      4,
    );
    assert.equal(
      liveHostilesAfterBossKitSummon({
        bossAlive: true,
        livingEnemySummonsBefore: 2,
        spawned: advertised.spawned,
      }),
      3,
    );
  });

  it("stamps another Archer on the next boss turn while pack cadence would skip", () => {
    assert.equal(BOSS_KIT_SUMMON_COOLDOWN_TURNS, 2);
    assert.equal(BOSS_KIT_SUMMON_COOLDOWN_TURNS, ENEMY_SUMMON_COOLDOWN_TURNS);
    assert.equal(
      isBossKitSummonOnCooldown({ currentTurn: 5, lastSummonTurn: 4 }),
      true,
    );
    assert.equal(wxBossKitSummonSpawnsOnCooldown(), true);
    const oneArcher = [
      { id: "broodmother", isSummon: false, side: "enemy", hp: 400 },
      { id: "archer-1", isSummon: true, side: "enemy", hp: 42 },
    ];
    const advertised = executeBossKitSummonPackGates({
      combatants: oneArcher,
      isSummon: true,
      currentTurn: 5,
      lastSummonTurn: 4,
    });
    assert.ok(advertised);
    assert.equal(advertised.capReached, false);
    assert.equal(advertised.onCooldown, true);
    assert.equal(advertised.spawned, false);
    assert.equal(
      liveHostilesAfterBossKitSummon({
        bossAlive: true,
        livingEnemySummonsBefore: 1,
        spawned: wxBossKitSummonSpawnsOnCooldown(),
      }),
      3,
    );
  });

  it("does not treat player-side wolves or corpses as cap occupants", () => {
    assert.equal(
      isEnemySideSummon({ isSummon: true, side: "player", hp: 80 }),
      false,
    );
    assert.equal(
      countLivingEnemySummons([
        { id: "wolf", isSummon: true, side: "player", hp: 80 },
        { id: "dead-archer", isSummon: true, side: "enemy", hp: 0 },
        { id: "live-archer", isSummon: true, side: "enemy", hp: 42 },
      ]),
      1,
    );
    const advertised = executeBossKitSummonPackGates({
      combatants: [
        { id: "live-archer", isSummon: true, side: "enemy", hp: 42 },
      ],
      isSummon: true,
      currentTurn: 4,
      lastSummonTurn: 1,
    });
    assert.ok(advertised);
    assert.equal(advertised.spawned, true);
    assert.equal(advertised.capReached, false);
  });
});

describe("executeBossKitSummonPackGates", () => {
  it("lets the first two Broodmother Archers through, then refuses the third", () => {
    const empty = executeBossKitSummonPackGates({
      combatants: [
        { id: "broodmother", isSummon: false, side: "enemy", hp: 400 },
      ],
      isSummon: true,
    });
    assert.ok(empty);
    assert.equal(empty.spawned, true);
    assert.equal(empty.livingEnemySummons, 0);

    const second = executeBossKitSummonPackGates({
      combatants: [{ id: "archer-1", isSummon: true, side: "enemy", hp: 42 }],
      isSummon: true,
    });
    assert.ok(second);
    assert.equal(second.spawned, true);
    assert.equal(second.livingEnemySummons, 1);

    const third = executeBossKitSummonPackGates(capArgs());
    assert.ok(third);
    assert.equal(third.spawned, false);
    assert.equal(third.livingEnemySummons, 2);
    assert.equal(shouldSpawnBossKitSummonUnderPackGates(capArgs()), false);
  });

  it("is a no-op for kit Strike so this leftover cannot mint a spawn", () => {
    assert.equal(strike.isSummon === true, false);
    assert.equal(
      executeBossKitSummonPackGates({
        combatants: twoArchers(),
        isSummon: false,
      }),
      null,
    );
    assert.equal(
      canSpawnBossKitSummonUnderPackGates({
        combatants: twoArchers(),
        isSummon: false,
      }),
      false,
    );
  });

  it("keeps leftover archers blocking victory after the Rook dies", () => {
    const advertisedHostiles = liveHostilesAfterBossKitSummon({
      bossAlive: false,
      livingEnemySummonsBefore: 2,
      spawned: false,
    });
    const liveHostiles = liveHostilesAfterBossKitSummon({
      bossAlive: false,
      livingEnemySummonsBefore: 2,
      spawned: true,
    });
    assert.equal(advertisedHostiles, 2);
    assert.equal(liveHostiles, 3);
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 4,
        hostilesRemaining: liveHostiles,
      }),
      false,
    );
    assert.equal(
      shouldAwardVictory({
        inBattle: true,
        deathTriggered: false,
        battleStartIdsSize: 3,
        hostilesRemaining: 0,
      }),
      true,
    );
  });

  it("does not steal #910 range, #1247 Ghost, #1261 Split, or #1217 larvae", () => {
    assert.equal(BROODMOTHER_KIT_FIRST_ID, BOSS_KIT_SUMMON_RANGE_LEFTOVER_ID);
    assert.equal(archer.id, BROODMOTHER_KIT_FIRST_ID);
    assert.equal(archer.isSummon, true);
    assert.equal(Number(archer.range), 2);
    const next = executeBossKitSummonPackGates(capArgs());
    assert.ok(next);
    assert.equal(next.spawned, false);
    assert.notEqual(LARVAE_SPAWN_ABILITY, GHOST_SUMMON_ABILITY);
    assert.notEqual(LARVAE_SPAWN_ABILITY, SPLIT_ROOKS_ABILITY);
    assert.notEqual(LARVAE_SPAWN_ABILITY, PHANTOM_SPAWN_ABILITY);
    assert.notEqual(venom.id, BROODMOTHER_KIT_FIRST_ID);
  });
});

describe("live WX / decide still skip the pack gates", () => {
  it("Broodmother phase-1 first-id is Summon Archer", () => {
    const kit = broodmotherKitBlock();
    const p1 = kit.slice(
      kit.indexOf("phase1SpellIds:"),
      kit.indexOf("phase2SpellIds:"),
    );
    assert.ok(p1.includes(`"${BROODMOTHER_KIT_FIRST_ID}"`));
    assert.equal(p1.indexOf(`"${BROODMOTHER_KIT_FIRST_ID}"`), p1.indexOf('"'));
    assert.ok(kit.includes(`bossId: "${BROODMOTHER_ROOK_ID}"`));
  });

  it("pickBossKitSpell still receives an empty cooldown Map", () => {
    const pick = pickBossKitSpellBlock();
    assert.ok(pick.includes("new Map<string, number>()") === false);
    const brood = decideBroodmotherBlock();
    assert.ok(brood.includes("pickBossKitSpell("));
    assert.ok(brood.includes("new Map<string, number>()"));
    assert.ok(brood.includes("return {"));
    assert.ok(brood.includes('type: "spell" as const'));
    assert.ok(brood.includes("LARVAE_SPAWN"));
    assert.ok(
      brood.indexOf("pickBossKitSpell(") < brood.indexOf("LARVAE_SPAWN"),
    );
  });

  it("kit summon short-circuit spawns without reading ENEMY_SUMMON_CAP", () => {
    const block = kitSummonShortCircuitBlock();
    assert.ok(block.includes("if (bossSpell.isSummon)"));
    assert.ok(
      block.includes("spawnEnemySummonRef.current?.(bossSpellDest, bossSpell)"),
    );
    assert.equal(block.includes("ENEMY_SUMMON_CAP"), false);
    assert.equal(block.includes("ENEMY_SUMMON_COOLDOWN_TURNS"), false);
    assert.equal(block.includes("existingEnemySummons"), false);
  });

  it("pack summoner still honors the advertised cap", () => {
    const pack = packSummonerCapBlock();
    assert.ok(pack.includes("existingEnemySummons.length >= ENEMY_SUMMON_CAP"));
    assert.equal(packSummonerHonorsPackGates(), true);
  });
});
