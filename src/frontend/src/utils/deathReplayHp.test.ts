import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { respawnHpAfterDeath } from "./deathPenalty.ts";
import {
  absoluteWriteHpAfterDeathReplay,
  hpForUnpaidDeathPersist,
  liveStatsAfterDeathReplay,
} from "./deathReplayHp.ts";
import { applyHealHpToLiveStats, resolveAbsoluteWriteHp } from "./itemShop.ts";

describe("deathReplayHp", () => {
  it("unpaid death persist HP is respawn, not Play-entry", () => {
    assert.equal(hpForUnpaidDeathPersist(1), respawnHpAfterDeath(1));
    assert.equal(hpForUnpaidDeathPersist(1), 50);
    assert.equal(hpForUnpaidDeathPersist(10), 72);
    assert.notEqual(hpForUnpaidDeathPersist(1), 80);
  });

  it("replays live HP/XP onto the persisted respawn snapshot", () => {
    const prev = { hp: 80, exp: 100, ap: 4 };
    const next = liveStatsAfterDeathReplay(prev, { xp: 80, hp: 50 });
    assert.equal(next.hp, 50);
    assert.equal(next.exp, 80);
    assert.equal(next.ap, 4);
    assert.equal(prev.hp, 80, "must not mutate the Play-entry snapshot");
  });

  it("shop/heal after remount replay must not persist Play-entry HP", () => {
    // Chronology:
    // 1. Lava death. saveBattleStats rejects. Marker 20/40. Optimistic HP 50.
    // 2. Reload. Play-entry getCharacter still has HP 80 / XP 100 / Doka 200.
    // 3. Replay writes respawn 50 + XP 80 + Doka 120.
    // 4. Leftover: UI stayed at 80. Shop saveBattleStats(80) wiped respawn.
    const playEntryHp = 80;
    const respawnHp = hpForUnpaidDeathPersist(1);
    assert.equal(respawnHp, 50);

    const leftoverWrite = resolveAbsoluteWriteHp(playEntryHp, playEntryHp);
    assert.equal(
      leftoverWrite,
      80,
      "unsynced live === click Play-entry HP resurrects pre-death HP",
    );

    const live = { current: { hp: playEntryHp, exp: 100 } };
    applyHealHpToLiveStats(live, respawnHp);
    const synced = liveStatsAfterDeathReplay(live.current, {
      xp: 80,
      hp: respawnHp,
    });
    live.current = synced;
    assert.equal(live.current.hp, 50);
    assert.equal(live.current.exp, 80);

    assert.equal(
      absoluteWriteHpAfterDeathReplay(live.current.hp, playEntryHp),
      50,
      "click-time Play-entry HP must lose to the synced respawn live ref",
    );
  });
});
