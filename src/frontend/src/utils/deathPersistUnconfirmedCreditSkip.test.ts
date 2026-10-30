/**
 * Persist action parity: lava death after a one-shot transport-keep writes
 * a pre-credit 20/40 pending marker, then a later beforeEach flush wipes
 * the grant.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { computeDeathPenalty } from "./deathPenalty.ts";
import {
  liveWxLaterCreditJobFlushesPreCreditDeathPending,
  liveWxWritesPendingDeathBeforeUnconfirmedAbsoluteWrite,
  shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite,
  simulateDeathAfterUnconfirmedOneShotCredit,
} from "./deathPersistUnconfirmedCreditSkip.ts";
import {
  ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
  shouldSkipAbsoluteDokaWrite,
} from "./progressPersist.ts";

function here(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function wxSource(): string {
  return readFileSync(
    join(here(), "../components/WorldExploration.tsx"),
    "utf8",
  );
}

function persistDeathPenaltyBlock(): string {
  const wx = wxSource();
  const start = wx.indexOf("const persistDeathPenalty = useCallback(() => {");
  assert.ok(start >= 0, "persistDeathPenalty is present");
  const end = wx.indexOf("const persistAbsoluteProgress = useCallback(", start);
  assert.ok(end > start, "persistAbsoluteProgress still follows death persist");
  return wx.slice(start, end);
}

describe("death persist after unconfirmed one-shot credit", () => {
  it("live death writes pending before the unconfirmed absolute write", () => {
    assert.equal(
      liveWxWritesPendingDeathBeforeUnconfirmedAbsoluteWrite(),
      true,
    );
    assert.equal(liveWxLaterCreditJobFlushesPreCreditDeathPending(), true);

    const block = persistDeathPenaltyBlock();
    const pendingAt = block.indexOf(
      "writePendingDeathPenalty(DEATH_PENALTY_STORAGE",
    );
    const enqueueAt = block.indexOf(
      "void progressPersistRef.current\n        .enqueue(",
    );
    assert.ok(pendingAt >= 0, "death persist still writes the pending marker");
    assert.ok(
      enqueueAt > pendingAt,
      "pending write still precedes the enqueue",
    );
    assert.ok(
      block.includes("resolveCommittedDokaForAbsoluteWrite"),
      "death persist still re-fetches for the absolute write",
    );
    assert.ok(
      block.includes("{ skipBeforeEach: true }"),
      "death persist still skips only its own beforeEach",
    );
    assert.equal(
      block.includes(
        "shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite",
      ),
      false,
    );
    assert.equal(
      wxSource().includes("withDeathPersistUnconfirmedCreditSkip"),
      false,
    );
  });

  it("stale query skips the absolute write; advertised also skips the pending stamp", () => {
    assert.equal(
      shouldSkipAbsoluteDokaWrite({
        unconfirmedWalletCredit: true,
        liveDoka: 1000,
        committedDoka: 1000,
      }),
      true,
    );
    assert.equal(
      shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite({
        unconfirmedWalletCredit: true,
        liveDoka: 1000,
        committedDoka: 1000,
      }),
      false,
      "stale live<=committed must not stamp a pre-credit 20/40 pending",
    );
    assert.equal(
      shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite({
        unconfirmedWalletCredit: true,
        liveDoka: 1100,
        committedDoka: 1000,
      }),
      true,
      "a live read above the lock may persist 20/40 of the grant",
    );
    assert.equal(
      shouldWritePendingDeathPenaltyBeforeUnconfirmedAbsoluteWrite({
        unconfirmedWalletCredit: false,
        liveDoka: 1000,
        committedDoka: 1000,
      }),
      true,
    );
    assert.equal(
      ABSOLUTE_WRITE_UNCONFIRMED_CREDIT,
      "absolute write skipped: unconfirmed credit",
    );
  });

  it("ground Doka keep then lava death: live flush 600 vs advertised 660", () => {
    const seq = simulateDeathAfterUnconfirmedOneShotCredit({
      committedDoka: 1000,
      liveQuery: 1000,
      canisterDoka: 1100,
    });
    assert.equal(seq.pendingAfter, 600);
    assert.equal(seq.flushedAfter, 600);
    assert.equal(seq.advertisedAfter, 660);
    assert.equal(computeDeathPenalty(0, 1000).newDoka, 600);
    assert.equal(computeDeathPenalty(0, 1100).newDoka, 660);
  });

  it("fresh live read above the lock: both paths cut the granted wallet", () => {
    const seq = simulateDeathAfterUnconfirmedOneShotCredit({
      committedDoka: 1000,
      liveQuery: 1100,
      canisterDoka: 1100,
    });
    assert.equal(seq.pendingAfter, 600);
    assert.equal(seq.flushedAfter, 660);
    assert.equal(seq.advertisedAfter, 660);
  });
});
