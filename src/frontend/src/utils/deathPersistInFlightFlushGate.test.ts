import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { computeDeathPenalty } from "./deathPenalty.ts";
import {
  expectedSinglePostCreditDeathCut,
  leftoverDoubleCutAfterFlushThenCredit,
  liveWxFlushesPendingDeathWhileDeathPersistInFlight,
  shouldFlushPendingDeathBeforeCredit,
  simulateDeathDuringQueuedCredit,
  withDeathPersistInFlight,
} from "./deathPersistInFlightFlushGate.ts";

function wxSource(): string {
  return readFileSync(
    join(
      dirname(fileURLToPath(import.meta.url)),
      "../components/WorldExploration.tsx",
    ),
    "utf8",
  );
}

const PRE_XP = 1000;
const PRE_DOKA = 500;
const CREDIT_XP = 200;
const CREDIT_DOKA = 100;

describe("shouldFlushPendingDeathBeforeCredit", () => {
  it("skips flush while death persist owns the pending marker", () => {
    assert.equal(shouldFlushPendingDeathBeforeCredit(true), false);
  });

  it("flushes after death persist finished (failed write / reload)", () => {
    assert.equal(shouldFlushPendingDeathBeforeCredit(false), true);
  });

  it("records that live WX always flushes during in-flight death", () => {
    assert.equal(liveWxFlushesPendingDeathWhileDeathPersistInFlight(), true);
  });
});

describe("leftover double 20/40 vs gated single post-credit cut", () => {
  it("arithmetics: flush+credit+recut under-cuts vs one post-credit cut", () => {
    const leftover = leftoverDoubleCutAfterFlushThenCredit({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: CREDIT_XP,
      creditDoka: CREDIT_DOKA,
    });
    const expected = expectedSinglePostCreditDeathCut({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: CREDIT_XP,
      creditDoka: CREDIT_DOKA,
    });
    // first cut 1000→800 / 500→300; +200/+100 → 1000/400; second → 800/240
    assert.deepEqual(leftover, { xp: 800, doka: 240 });
    // uncut credit 1200/600 then one 20/40 → 960/360
    assert.deepEqual(expected, { xp: 960, doka: 360 });
    assert.notDeepEqual(leftover, expected);
  });

  it("live flush-while-in-flight reproduces the double cut on the lock", async () => {
    const live = await simulateDeathDuringQueuedCredit({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: CREDIT_XP,
      creditDoka: CREDIT_DOKA,
      flushWhileDeathInFlight: true,
    });
    assert.equal(live.pendingClearedByFlush, true);
    assert.equal(live.cutsApplied, 2);
    assert.deepEqual(
      live.final,
      leftoverDoubleCutAfterFlushThenCredit({
        preXp: PRE_XP,
        preDoka: PRE_DOKA,
        creditXp: CREDIT_XP,
        creditDoka: CREDIT_DOKA,
      }),
    );
  });

  it("gated beforeEach leaves one post-credit cut", async () => {
    const gated = await simulateDeathDuringQueuedCredit({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: CREDIT_XP,
      creditDoka: CREDIT_DOKA,
      flushWhileDeathInFlight: false,
    });
    assert.equal(gated.pendingClearedByFlush, false);
    assert.equal(gated.cutsApplied, 1);
    assert.deepEqual(
      gated.final,
      expectedSinglePostCreditDeathCut({
        preXp: PRE_XP,
        preDoka: PRE_DOKA,
        creditXp: CREDIT_XP,
        creditDoka: CREDIT_DOKA,
      }),
    );
  });

  it("portal +10 during in-flight death is the same class of prior credit", async () => {
    const portalXp = 10;
    const live = await simulateDeathDuringQueuedCredit({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: portalXp,
      creditDoka: 0,
      flushWhileDeathInFlight: true,
    });
    const gated = await simulateDeathDuringQueuedCredit({
      preXp: PRE_XP,
      preDoka: PRE_DOKA,
      creditXp: portalXp,
      creditDoka: 0,
      flushWhileDeathInFlight: false,
    });
    assert.deepEqual(
      live.final,
      leftoverDoubleCutAfterFlushThenCredit({
        preXp: PRE_XP,
        preDoka: PRE_DOKA,
        creditXp: portalXp,
        creditDoka: 0,
      }),
    );
    assert.deepEqual(
      gated.final,
      expectedSinglePostCreditDeathCut({
        preXp: PRE_XP,
        preDoka: PRE_DOKA,
        creditXp: portalXp,
        creditDoka: 0,
      }),
    );
    assert.notDeepEqual(live.final, gated.final);
  });
});

describe("withDeathPersistInFlight", () => {
  it("sets the flag for the death enqueue window and clears after", async () => {
    let flag = false;
    const seen: boolean[] = [];
    await withDeathPersistInFlight({
      setInFlight: (next) => {
        flag = next;
      },
      run: async () => {
        seen.push(flag);
        assert.equal(shouldFlushPendingDeathBeforeCredit(flag), false);
        return 1;
      },
    });
    assert.deepEqual(seen, [true]);
    assert.equal(flag, false);
    assert.equal(shouldFlushPendingDeathBeforeCredit(flag), true);
  });

  it("clears the flag when the death job throws", async () => {
    let flag = true;
    await assert.rejects(
      withDeathPersistInFlight({
        setInFlight: (next) => {
          flag = next;
        },
        run: async () => {
          throw new Error("replica reject");
        },
      }),
    );
    assert.equal(flag, false);
    // Failed death still needs beforeEach flush on the next heal/shop.
    assert.equal(shouldFlushPendingDeathBeforeCredit(false), true);
    const unpaid = computeDeathPenalty(PRE_XP, PRE_DOKA);
    assert.deepEqual(unpaid, {
      xpLost: 200,
      dokaLost: 200,
      newXp: 800,
      newDoka: 300,
    });
  });
});

describe("live WX leftover (unwired sidecar)", () => {
  it("always flushes in beforeEach; death enqueue skips then recomputes", () => {
    const wx = wxSource();
    assert.ok(
      wx.includes("progressPersistRef.current.setBeforeEach"),
      "persist lock still installs a beforeEach flush",
    );
    assert.ok(
      wx.includes("await flushPendingDeathPenalty({"),
      "beforeEach still always flushes unpaid death",
    );
    assert.equal(
      wx.includes("shouldFlushPendingDeathBeforeCredit"),
      false,
      "WX still does not gate flush on deathPersistInFlight",
    );
    assert.equal(wx.includes("withDeathPersistInFlight"), false);
    assert.equal(wx.includes("deathPersistInFlight"), false);

    assert.ok(
      wx.includes("const after = computeDeathPenalty("),
      "death persist still recomputes 20/40 on the committed snapshot",
    );
    assert.ok(
      wx.includes("{ skipBeforeEach: true }"),
      "death persist still skips its own beforeEach",
    );
  });
});
