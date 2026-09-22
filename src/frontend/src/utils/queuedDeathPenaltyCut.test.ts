import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyUnpaidDeathPenaltyToWrite,
  computeDeathPenalty,
  confirmAndClearPendingDeathPenalty,
  flushPendingDeathPenalty,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";
import {
  queuedDeathPenaltyCut,
  shouldSkipQueuedDeathPenaltyCut,
} from "./queuedDeathPenaltyCut.ts";

function memStorage(): import("./deathPenalty.ts").DeathPenaltyStorage {
  const store = new Map<string, string>();
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
  };
}

const UNCUT = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

describe("queued death persist vs beforeEach flush", () => {
  it("skips a second 20/40 after heal flush already wrote the cut", async () => {
    // Chronology:
    // 1. Recap heal enqueues saveBattleStats.
    // 2. Lava death writes pending (100/200 → 80/120) and skipBeforeEach.
    // 3. Heal beforeEach flushPendingDeathPenalty writes the cut and clears.
    // 4. Death job used to computeDeathPenalty(80, 120) → 64/72.
    const bug = computeDeathPenalty(80, 120);
    assert.equal(bug.newXp, 64);
    assert.equal(bug.newDoka, 72);

    const mem = memStorage();
    writePendingDeathPenalty(mem, UNCUT);
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    let backendXp = 100;
    let backendDoka = 200;
    const flushed = await flushPendingDeathPenalty({
      storage: mem,
      slot: 1,
      persist: lock,
      fetchSnapshot: async () => ({ xp: backendXp, doka: backendDoka }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(lock.snapshot().xp, 80);
    assert.equal(lock.snapshot().doka, 120);
    assert.equal(
      shouldSkipQueuedDeathPenaltyCut({
        pending: null,
        lockXp: lock.snapshot().xp,
        lockDoka: lock.snapshot().doka,
      }),
      true,
    );
    assert.equal(
      queuedDeathPenaltyCut({
        pending: null,
        lockXp: lock.snapshot().xp,
        lockDoka: lock.snapshot().doka,
      }),
      null,
    );
    assert.equal(backendXp, 80);
    assert.equal(backendDoka, 120);
  });

  it("still cuts when the skipBeforeEach job runs first", () => {
    assert.equal(
      shouldSkipQueuedDeathPenaltyCut({
        pending: UNCUT,
        lockXp: 100,
        lockDoka: 200,
      }),
      false,
    );
    assert.deepEqual(
      queuedDeathPenaltyCut({
        pending: UNCUT,
        lockXp: 100,
        lockDoka: 200,
      }),
      computeDeathPenalty(100, 200),
    );
  });

  it("skips when cutConfirmed is still sitting on the marker", () => {
    const confirmed = { ...UNCUT, cutConfirmed: true as const };
    assert.equal(
      shouldSkipQueuedDeathPenaltyCut({
        pending: confirmed,
        lockXp: 80,
        lockDoka: 120,
      }),
      true,
    );
  });

  it("skips when the lock already absorbed the unpaid loss", () => {
    assert.deepEqual(applyUnpaidDeathPenaltyToWrite(UNCUT, 80, 120), {
      xp: 80,
      doka: 120,
    });
    assert.equal(
      shouldSkipQueuedDeathPenaltyCut({
        pending: UNCUT,
        lockXp: 80,
        lockDoka: 120,
      }),
      true,
      "flush committed, confirmAndClear missed — do not recut",
    );
  });

  it("does not treat an unseeded placeholder 0 as an honoured cut on leftover XP", () => {
    assert.equal(
      shouldSkipQueuedDeathPenaltyCut({
        pending: UNCUT,
        lockXp: 100,
        lockDoka: 0,
      }),
      false,
      "doka 0 with leftover XP still unpaid must not skip the XP cut",
    );
  });

  it("flush then death job helper keeps the single 20/40", async () => {
    const mem = memStorage();
    writePendingDeathPenalty(mem, UNCUT);
    const lock = createProgressPersist({ doka: 200, xp: 100, level: 4 });
    let backendXp = 100;
    let backendDoka = 200;
    await flushPendingDeathPenalty({
      storage: mem,
      slot: 1,
      persist: lock,
      fetchSnapshot: async () => ({ xp: backendXp, doka: backendDoka }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    const queued = queuedDeathPenaltyCut({
      pending: null,
      lockXp: lock.snapshot().xp,
      lockDoka: lock.snapshot().doka,
    });
    if (queued) {
      lock.commit({ xp: queued.newXp, doka: queued.newDoka });
    }
    assert.equal(lock.snapshot().xp, 80);
    assert.equal(lock.snapshot().doka, 120);
    confirmAndClearPendingDeathPenalty(mem, UNCUT);
  });
});
