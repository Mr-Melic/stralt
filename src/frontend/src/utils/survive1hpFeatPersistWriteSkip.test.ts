import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  SURVIVE_1HP_FEAT_CONDITION,
  SURVIVE_1HP_FEAT_DOKA_REWARD,
  SURVIVE_1HP_THRESHOLD,
  leftoverSurvive1hpFeatUnlocksAfterHeal,
  liveWxUnlocksSurvive1hpFromRenderSnapshot,
  persistVictoryThroughSurvive1hpFeatGate,
  readLiveHp,
  shouldUnlockSurvive1hpFeatFromLiveHp,
  shouldUnlockSurvive1hpFeatFromRenderSnapshot,
  shouldUnlockSurvive1hpFeatOnBossRushSnap,
  shouldUnlockSurvive1hpFeatOnVictorySnap,
} from "./survive1hpFeatPersistWriteSkip.ts";
import { clientTrustedVictoryAchievementConditions } from "./victoryAchievements.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

const cleanSnap = {
  hp: 80,
  mapsVisited: 3,
  groundDokaPickups: 0,
  spellBarCount: 4,
  hasSpellAtLeast5: false,
  critHits: 0,
  pacifist: false,
  betrayal: false,
  doubleBetrayal: false,
  leaderSlain: false,
  bossId: null as string | null,
};

describe("shouldUnlockSurvive1hpFeatFromLiveHp", () => {
  it("unlocks only when live HP is exactly 1", () => {
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(1), true);
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(1.9), true);
  });

  it("does not unlock full / healed / dead HP", () => {
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(51), false);
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(80), false);
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(0), false);
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(-1), false);
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(Number.NaN), false);
  });

  it("does not unlock on the render snapshot / victory snap helpers", () => {
    assert.equal(shouldUnlockSurvive1hpFeatFromRenderSnapshot(), false);
    assert.equal(shouldUnlockSurvive1hpFeatOnVictorySnap(), false);
    assert.equal(shouldUnlockSurvive1hpFeatOnBossRushSnap(), false);
  });

  it("records that live WX unlocks from the render snapshot", () => {
    assert.equal(liveWxUnlocksSurvive1hpFromRenderSnapshot(), true);
  });
});

describe("readLiveHp", () => {
  it("floors finite HP and treats junk as 0", () => {
    assert.equal(readLiveHp(51.7), 51);
    assert.equal(readLiveHp("1"), 1);
    assert.equal(readLiveHp(null), 0);
    assert.equal(readLiveHp(undefined), 0);
  });
});

describe("ungated render snapshot then same-tick heal", () => {
  it("leftover is a 100 Doka Survivor claim from live HP 51", () => {
    const renderHp = 1;
    const liveHp = 51;
    assert.equal(renderHp, SURVIVE_1HP_THRESHOLD);
    assert.equal(liveHp > SURVIVE_1HP_THRESHOLD, true);

    const ungated = liveWxUnlocksSurvive1hpFromRenderSnapshot();
    assert.equal(ungated, true, "live WX already unlocked");
    assert.equal(shouldUnlockSurvive1hpFeatFromRenderSnapshot(), false);

    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp,
        liveHp,
        ungatedUnlockFromRender: ungated,
      }),
      true,
    );
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(liveHp), false);
    assert.equal(SURVIVE_1HP_FEAT_CONDITION, "survive_1hp");
    assert.equal(SURVIVE_1HP_FEAT_DOKA_REWARD, 100);
  });

  it("gated path does not unlock when live HP is already healed", () => {
    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp: 1,
        liveHp: 51,
        ungatedUnlockFromRender: shouldUnlockSurvive1hpFeatFromRenderSnapshot(),
      }),
      false,
    );
  });

  it("does not leftover-unlock when live HP is still 1", () => {
    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp: 1,
        liveHp: 1,
        ungatedUnlockFromRender: true,
      }),
      false,
      "they did survive at 1 HP — feat is earned, not this leftover",
    );
    assert.equal(shouldUnlockSurvive1hpFeatFromLiveHp(1), true);
  });

  it("does not leftover-unlock a healthy render snapshot", () => {
    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp: 80,
        liveHp: 80,
        ungatedUnlockFromRender: true,
      }),
      false,
    );
  });

  it("victory snap of stale 1 is the same leftover while live is 51", () => {
    assert.equal(shouldUnlockSurvive1hpFeatOnVictorySnap(), false);
    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp: 1,
        liveHp: 51,
        ungatedUnlockFromRender: true,
      }),
      true,
    );
  });

  it("Boss Rush room-clear snap is the same leftover", () => {
    assert.equal(shouldUnlockSurvive1hpFeatOnBossRushSnap(), false);
    assert.equal(
      leftoverSurvive1hpFeatUnlocksAfterHeal({
        renderHp: 1,
        liveHp: 71,
        ungatedUnlockFromRender: true,
      }),
      true,
    );
  });
});

describe("persistVictoryThroughSurvive1hpFeatGate", () => {
  it("unlocks live HP 1", () => {
    assert.deepEqual(persistVictoryThroughSurvive1hpFeatGate({ liveHp: 1 }), {
      unlockFeat: true,
    });
  });

  it("does not unlock live HP after a potion", () => {
    assert.deepEqual(persistVictoryThroughSurvive1hpFeatGate({ liveHp: 51 }), {
      unlockFeat: false,
    });
  });

  it("does not unlock live HP 0", () => {
    assert.equal(
      persistVictoryThroughSurvive1hpFeatGate({ liveHp: 0 }).unlockFeat,
      false,
    );
  });
});

describe("clientTrustedVictoryAchievementConditions still keys off snap.hp", () => {
  it("lists survive_1hp when the snap hp is 1", () => {
    const conditions = clientTrustedVictoryAchievementConditions({
      ...cleanSnap,
      hp: 1,
    });
    assert.ok(conditions.includes(SURVIVE_1HP_FEAT_CONDITION));
  });

  it("omits survive_1hp when the snap hp is healed", () => {
    const conditions = clientTrustedVictoryAchievementConditions({
      ...cleanSnap,
      hp: 51,
    });
    assert.equal(conditions.includes(SURVIVE_1HP_FEAT_CONDITION), false);
  });
});

function victoryFeatSnapBlocks(wx: string): string[] {
  const blocks: string[] = [];
  let from = 0;
  while (from < wx.length) {
    const start = wx.indexOf(
      "clientTrustedVictoryAchievementConditions({",
      from,
    );
    if (start < 0) break;
    const end = wx.indexOf("})) {", start);
    assert.ok(end > start, "feat snap block still closes");
    blocks.push(wx.slice(start, end));
    from = end + 1;
  }
  return blocks;
}

describe("live WX leftover (unwired sidecar)", () => {
  it("victory and Boss Rush snaps still pass characterStats.hp, not the ref", () => {
    const wx = wxSource();
    const snaps = victoryFeatSnapBlocks(wx);
    assert.equal(
      snaps.length,
      2,
      "handleBattleEnd and handleBossRushRoomClear",
    );
    for (const snap of snaps) {
      assert.ok(
        snap.includes("hp: characterStats.hp"),
        "live victory / room-clear snap still reads the render snapshot",
      );
      assert.equal(
        snap.includes("characterStatsRef"),
        false,
        "feat snap still does not read the eager live ref",
      );
    }
    assert.equal(wx.includes("shouldUnlockSurvive1hpFeatFromLiveHp"), false);
    assert.equal(wx.includes("persistVictoryThroughSurvive1hpFeatGate"), false);
  });

  it("eager setCharacterStats still writes the ref inside the updater", () => {
    const wx = wxSource();
    assert.ok(
      wx.includes("characterStatsRef.current = next;"),
      "potion / heal still eager-writes the live ref before re-render",
    );
    assert.ok(
      wx.includes('case "health_potion":'),
      "in-battle potion still raises HP via setCharacterStats",
    );
  });
});

describe("distinct from leftover feat gates #1321 / #1317 / #1308", () => {
  it("is survive_1hp 100 Doka, not spell_master / jackpot / loot_10", () => {
    assert.equal(SURVIVE_1HP_FEAT_CONDITION, "survive_1hp");
    assert.equal(SURVIVE_1HP_FEAT_DOKA_REWARD, 100);
    assert.notEqual(SURVIVE_1HP_FEAT_CONDITION, "spell_master_8");
    assert.notEqual(SURVIVE_1HP_FEAT_CONDITION, "jackpot_heal");
    assert.notEqual(SURVIVE_1HP_FEAT_CONDITION, "loot_10_doka");
  });

  it("does not stamp leftover-Doka / inventory / bar keep keys", () => {
    const storage = new Map<string, string>();
    assert.equal(storage.get("pbv_spell_bar_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("pbv_absolute_doka_throw_keep_remount_slot1"),
      undefined,
    );
    assert.equal(storage.get("pbv_inventory_keep_remount_slot1"), undefined);
    assert.equal(
      storage.get("VampireBob_slot1_pbv_ground_doka_pickups"),
      undefined,
    );
    assert.equal(storage.get("pbv_pending_death_penalty_slot1"), undefined);
  });
});
