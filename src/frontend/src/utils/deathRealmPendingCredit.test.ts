import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { creditAchievementRewardThroughPersist } from "./achievementReward.ts";
import { computeDeathPenalty } from "./deathPenalty.ts";
import {
  DEATH_REALM_CREDIT_BLOCKED,
  persistClaimThroughDeathRealmGate,
  persistRedeemThroughDeathRealmGate,
  shouldAllowProgressCreditDuringDeathRealm,
  shouldStartAchievementClaimDuringDeathRealm,
  shouldStartGameKeyRedeemDuringDeathRealm,
} from "./deathRealmPendingCredit.ts";
import {
  applySpendToCommitted,
  createProgressPersist,
} from "./progressPersist.ts";
import { redeemGameKeyThroughPersist } from "./shopPurchase.ts";

describe("Death Realm pending feat/GameKey credit vs leftover 20/40 snapshot", () => {
  it("blocks credits only while Death Realm is pending", () => {
    assert.equal(shouldAllowProgressCreditDuringDeathRealm(true), false);
    assert.equal(shouldAllowProgressCreditDuringDeathRealm(false), true);
    assert.equal(
      shouldAllowProgressCreditDuringDeathRealm(undefined),
      true,
      "omit pending (callers that have not wired the flag) must still credit",
    );
  });

  it("does not start a feat claim during the wait (one-shot would be consumed)", () => {
    const ids = new Set<string>();
    assert.equal(
      shouldStartAchievementClaimDuringDeathRealm({
        inFlightIds: ids,
        achievementId: "first_blood",
        deathRealmPending: true,
      }),
      false,
    );
    assert.equal(
      shouldStartAchievementClaimDuringDeathRealm({
        inFlightIds: ids,
        achievementId: "first_blood",
        deathRealmPending: false,
      }),
      true,
      "Death Realm already loaded must still allow Feats Claim",
    );
    ids.add("first_blood");
    assert.equal(
      shouldStartAchievementClaimDuringDeathRealm({
        inFlightIds: ids,
        achievementId: "first_blood",
        deathRealmPending: false,
      }),
      false,
      "in-flight claim still blocks a double-click after the wait",
    );
  });

  it("does not start a GameKey redeem during the wait (code would be consumed)", () => {
    assert.equal(
      shouldStartGameKeyRedeemDuringDeathRealm({
        inFlight: false,
        deathRealmPending: true,
      }),
      false,
    );
    assert.equal(
      shouldStartGameKeyRedeemDuringDeathRealm({
        inFlight: false,
        deathRealmPending: false,
      }),
      true,
      "Death Realm already loaded must still allow GameKey redeem",
    );
    assert.equal(
      shouldStartGameKeyRedeemDuringDeathRealm({
        inFlight: true,
        deathRealmPending: false,
      }),
      false,
    );
  });

  it("leftover feat claim after death persist saveBattleStats-keeps untaxed grant", async () => {
    // Chronology:
    // 1. World hydrated. Lock doka=200 seeded. Canister 200.
    // 2. Overworld lava. persistDeathPenalty restores HP and commits 20/40
    //    (200 → 120). Recap overlay is pointer-events: none.
    // 3. HUD Trophy stays live. Claim #ok(100) enqueues after the death
    //    write. Lock 220. Feat consumed. 20/40 did not tax the grant.
    // 4. Recap heal spends 10. saveBattleStats writes 210. Extra 100
    //    survived Death Realm load.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    const death = computeDeathPenalty(80, 200);
    leftover.commit({ doka: death.newDoka, xp: death.newXp });
    assert.equal(leftover.snapshot().doka, 120);

    const claimed: string[] = [];
    const leftoverClaim = await persistClaimThroughDeathRealmGate(false, () =>
      creditAchievementRewardThroughPersist(
        {
          claimAchievementReward: async (id: string) => {
            claimed.push(id);
            return { __kind__: "ok" as const, ok: 100n };
          },
        },
        leftover,
        "first_blood",
      ),
    );
    assert.deepEqual(leftoverClaim, { ok: 100 });
    assert.deepEqual(claimed, ["first_blood"]);
    assert.equal(leftover.snapshot().doka, 220);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.snapshot().doka, 210, "untaxed feat survived heal");
  });

  it("does not persist a feat grant after the 20/40 snapshot via the gate", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    const death = computeDeathPenalty(80, 200);
    guarded.commit({ doka: death.newDoka, xp: death.newXp });
    const claimed: string[] = [];
    const blocked = await persistClaimThroughDeathRealmGate(true, () =>
      creditAchievementRewardThroughPersist(
        {
          claimAchievementReward: async (id: string) => {
            claimed.push(id);
            return { __kind__: "ok" as const, ok: 100n };
          },
        },
        guarded,
        "first_blood",
      ),
    );
    assert.deepEqual(blocked, { err: DEATH_REALM_CREDIT_BLOCKED });
    assert.deepEqual(claimed, []);
    assert.equal(guarded.snapshot().doka, 120);
    assert.equal(
      shouldStartAchievementClaimDuringDeathRealm({
        inFlightIds: new Set(),
        achievementId: "first_blood",
        deathRealmPending: false,
      }),
      true,
      "feat remains claimable after Death Realm loads",
    );
  });

  it("leftover GameKey redeem after death persist saveBattleStats-keeps paid grant", async () => {
    // Same wait: Buy Doka stays live. redeemGameKey #ok(1000) after 20/40
    // consumes the code. Recap heal writes 1110. Reload keeps the extra
    // 1000 the death snapshot never taxed.
    const leftover = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    leftover.commit({ doka: computeDeathPenalty(80, 200).newDoka });
    const codes: string[] = [];
    const leftoverRedeem = await persistRedeemThroughDeathRealmGate(false, () =>
      redeemGameKeyThroughPersist(
        {
          redeemGameKey: async (code: string) => {
            codes.push(code);
            return { __kind__: "ok" as const, ok: 1000n };
          },
        },
        leftover,
        "gk_paid_after_death_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ),
    );
    assert.equal("result" in leftoverRedeem, true);
    if ("result" in leftoverRedeem) {
      assert.equal("ok" in leftoverRedeem.result, true);
    }
    assert.equal(codes.length, 1);
    assert.equal(leftover.snapshot().doka, 1120);
    leftover.commit({
      doka: applySpendToCommitted(leftover.snapshot().doka, 10),
    });
    assert.equal(leftover.snapshot().doka, 1110, "paid grant survived heal");
  });

  it("does not consume a GameKey after the 20/40 snapshot via the gate", async () => {
    const guarded = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    guarded.commit({ doka: computeDeathPenalty(80, 200).newDoka });
    const codes: string[] = [];
    const blocked = await persistRedeemThroughDeathRealmGate(true, () =>
      redeemGameKeyThroughPersist(
        {
          redeemGameKey: async (code: string) => {
            codes.push(code);
            return { __kind__: "ok" as const, ok: 1000n };
          },
        },
        guarded,
        "gk_paid_after_death_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ),
    );
    assert.deepEqual(blocked, { err: DEATH_REALM_CREDIT_BLOCKED });
    assert.deepEqual(codes, []);
    assert.equal(guarded.snapshot().doka, 120);
  });

  it("clears the gate after Death Realm loads so a later claim can persist", async () => {
    const lock = createProgressPersist({ doka: 200, xp: 80, level: 4 });
    lock.commit({ doka: computeDeathPenalty(80, 200).newDoka });
    const blocked = await persistClaimThroughDeathRealmGate(true, async () => {
      throw new Error("must not enqueue while Death Realm is pending");
    });
    assert.deepEqual(blocked, { err: DEATH_REALM_CREDIT_BLOCKED });
    const claimed = await persistClaimThroughDeathRealmGate(false, () =>
      creditAchievementRewardThroughPersist(
        {
          claimAchievementReward: async () => ({
            __kind__: "ok" as const,
            ok: 100n,
          }),
        },
        lock,
        "first_blood",
      ),
    );
    assert.deepEqual(claimed, { ok: 100 });
    assert.equal(lock.snapshot().doka, 220);
  });
});
