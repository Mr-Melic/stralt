import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyUnpaidDeathPenaltiesToWrite,
  flushPendingDeathPenalty,
  listPendingDeathPenalties,
  readPendingDeathPenalty,
  resolvePendingDeathReplay,
  resolvePendingDeathReplayAcrossSlots,
  stampForeignPendingDeathDokaAbsorbed,
  unpaidDeathPersistUsesRespawnHp,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";

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

const SLOT1 = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

describe("unpaid death Doka is principal-wide", () => {
  it("Play on slot 2 still cuts Doka and leaves slot 2 leftover XP", () => {
    assert.equal(unpaidDeathPersistUsesRespawnHp(2, [SLOT1]), false);
    assert.equal(unpaidDeathPersistUsesRespawnHp(1, [SLOT1]), true);
    assert.deepEqual(applyUnpaidDeathPenaltiesToWrite(2, [SLOT1], 5000, 200), {
      xp: 5000,
      doka: 120,
    });
    assert.deepEqual(applyUnpaidDeathPenaltiesToWrite(1, [SLOT1], 100, 200), {
      xp: 80,
      doka: 120,
    });
    assert.deepEqual(applyUnpaidDeathPenaltiesToWrite(2, [SLOT1], 5000, 190), {
      xp: 5000,
      doka: 110,
    });
    assert.deepEqual(
      resolvePendingDeathReplayAcrossSlots(2, 5000, 200, [SLOT1]),
      { action: "write", newXp: 5000, newDoka: 120 },
    );
    assert.deepEqual(
      resolvePendingDeathReplay(5000, 200, SLOT1),
      { action: "write", newXp: 4980, newDoka: 120 },
      "same-slot helper would tax slot 2 leftover XP",
    );
  });

  it("stamps foreign Doka absorbed so a later earn is not recut", () => {
    const mem = memStorage();
    writePendingDeathPenalty(mem, SLOT1);
    assert.equal(listPendingDeathPenalties(mem).length, 1);
    stampForeignPendingDeathDokaAbsorbed(mem, 2, [SLOT1], 120);
    const stamped = readPendingDeathPenalty(mem, 1);
    assert.equal(stamped?.afterXp, 80);
    assert.equal(stamped?.preDoka, 120);
    assert.equal(stamped?.afterDoka, 120);
    assert.deepEqual(
      applyUnpaidDeathPenaltiesToWrite(1, [stamped!], 100, 170),
      {
        xp: 80,
        doka: 170,
      },
    );
  });

  it("flush on slot 2 writes Doka cut and keeps slot 1 XP debt", async () => {
    const mem = memStorage();
    writePendingDeathPenalty(mem, SLOT1);
    const lock = createProgressPersist({ doka: 200, xp: 5000, level: 8 });
    let backendXp = 5000;
    let backendDoka = 200;
    const flushed = await flushPendingDeathPenalty({
      storage: mem,
      slot: 2,
      persist: lock,
      fetchSnapshot: async () => ({ xp: backendXp, doka: backendDoka }),
      writePenalty: async (newXp, newDoka) => {
        backendXp = newXp;
        backendDoka = newDoka;
      },
    });
    assert.equal(flushed, true);
    assert.equal(backendXp, 5000);
    assert.equal(backendDoka, 120);
    assert.equal(lock.snapshot().doka, 120);
    const leftover = readPendingDeathPenalty(mem, 1);
    assert.equal(leftover?.afterXp, 80);
    assert.equal(leftover?.preDoka, 120);
    assert.equal(leftover?.afterDoka, 120);
    assert.equal(readPendingDeathPenalty(mem, 2), null);
  });
});
