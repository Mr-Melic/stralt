import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import {
  afterDeathReplayPersistSuccess,
  confirmDeathReplayInsidePersistJob,
  leftoverConfirmDeathReplayAfterEnqueue,
  shouldHydrateDeathReplayUi,
} from "./deathReplayJobConfirm.ts";

function memStorage(): import("./deathPenalty.ts").DeathPenaltyStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (k) => storage.get(k) ?? null,
    setItem: (k, v) => {
      storage.set(k, v);
    },
    removeItem: (k) => {
      storage.delete(k);
    },
  };
}

describe("deathReplayJobConfirm", () => {
  it("does not recut portal +10 when confirm runs inside the persist job", () => {
    // Chronology:
    // 1. Death replay saveBattleStats accepts 20/40 (XP 100→80, Doka 200→120).
    // 2. WorldExploration remounts (actor reconnect). The effect sets
    //    cancelled = true before leftover confirmAndClear ran.
    // 3. Portal +10 then flushPendingDeathPenalty recut XP (110 → 90).
    const mem = memStorage();
    const pending = {
      slot: 1,
      preXp: 100,
      preDoka: 200,
      afterXp: 80,
      afterDoka: 120,
    };
    writePendingDeathPenalty(mem, pending);

    const cancelled = true;
    assert.equal(
      leftoverConfirmDeathReplayAfterEnqueue(cancelled),
      false,
      "leftover skipped confirm when the effect unmounted",
    );
    assert.ok(readPendingDeathPenalty(mem, 1));
    assert.deepEqual(
      resolvePendingDeathReplay(110, 200, readPendingDeathPenalty(mem, 1)!),
      { action: "write", newXp: 90, newDoka: 120 },
      "unpaid-looking marker recut the portal +10 leftover",
    );

    writePendingDeathPenalty(mem, pending);
    afterDeathReplayPersistSuccess({
      cancelled,
      confirm: () => confirmDeathReplayInsidePersistJob(1, pending, mem),
      hydrateUi: () => {
        throw new Error("cancelled effect must not hydrate UI");
      },
    });
    assert.equal(shouldHydrateDeathReplayUi(cancelled), false);
    assert.equal(readPendingDeathPenalty(mem, 1), null);
  });
});
