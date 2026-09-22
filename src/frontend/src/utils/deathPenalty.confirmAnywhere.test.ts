import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type DeathPenaltyStorage,
  clearPendingDeathPenalty,
  confirmAndClearPendingDeathPenaltyAnywhere,
  confirmPendingDeathPenalty,
  readPendingDeathPenalty,
  readPendingDeathPenaltyAnywhere,
  resolvePendingDeathReplay,
  writePendingDeathPenalty,
} from "./deathPenalty.ts";

function memStorage(): DeathPenaltyStorage {
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

const pending = {
  slot: 1,
  preXp: 100,
  preDoka: 200,
  afterXp: 80,
  afterDoka: 120,
};

describe("confirmAndClearPendingDeathPenaltyAnywhere", () => {
  it("clears both local and session markers after a successful death persist", () => {
    // persistDeathPenalty confirms then clears. Clearing only the primary
    // (localStorage) left the legacy sessionStorage unpaid marker. Reload
    // then readPendingDeathPenaltyAnywhere replayed 20/40 onto an already
    // cut canister wallet.
    const local = memStorage();
    const session = memStorage();
    writePendingDeathPenalty(local, pending);
    writePendingDeathPenalty(session, pending);

    confirmAndClearPendingDeathPenaltyAnywhere(1, pending, local, session);

    assert.equal(readPendingDeathPenalty(local, 1), null);
    assert.equal(readPendingDeathPenalty(session, 1), null);
    assert.equal(readPendingDeathPenaltyAnywhere(1, local, session), null);
  });

  it("does not leave a session unpaid marker that would recut a later wallet", () => {
    const local = memStorage();
    const session = memStorage();
    writePendingDeathPenalty(local, pending);
    writePendingDeathPenalty(session, pending);

    // Old success path: confirm + clear primary only.
    confirmPendingDeathPenalty(local, pending);
    clearPendingDeathPenalty(local, 1);
    assert.equal(readPendingDeathPenalty(local, 1), null);
    const leftover = readPendingDeathPenaltyAnywhere(1, local, session);
    assert.deepEqual(
      leftover,
      pending,
      "session leftover is the unpaid marker the Anywhere helper must drop",
    );
    assert.deepEqual(
      resolvePendingDeathReplay(90, 120, leftover!),
      { action: "write", newXp: 70, newDoka: 120 },
      "portal +10 after a leftover unpaid marker taxes the earn (90→70 XP)",
    );

    writePendingDeathPenalty(local, pending);
    confirmAndClearPendingDeathPenaltyAnywhere(1, pending, local, session);
    assert.equal(readPendingDeathPenaltyAnywhere(1, local, session), null);
  });
});
