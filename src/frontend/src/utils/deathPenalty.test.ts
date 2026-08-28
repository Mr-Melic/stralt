import assert from "node:assert/strict";
import { committedDokaAfterAchievementCredit } from "./achievementReward.ts";
import {
  computeDeathPenalty,
  persistDeathPenalty,
  raiseUiAfterDeathPersist,
  shouldApplyVictoryLiveHydrate,
} from "./deathPenalty.ts";
import { createProgressPersist } from "./progressPersist.ts";

assert.deepEqual(computeDeathPenalty(100, 100), {
  xpLost: 20,
  dokaLost: 40,
  newXp: 80,
  newDoka: 60,
});
assert.deepEqual(computeDeathPenalty(0, 0), {
  xpLost: 0,
  dokaLost: 0,
  newXp: 0,
  newDoka: 0,
});
assert.deepEqual(computeDeathPenalty(1, 1), {
  xpLost: 0,
  dokaLost: 0,
  newXp: 1,
  newDoka: 1,
});
assert.deepEqual(computeDeathPenalty(-10, -50), {
  xpLost: 0,
  dokaLost: 0,
  newXp: 0,
  newDoka: 0,
});
assert.deepEqual(computeDeathPenalty(5, 9), {
  xpLost: 1,
  dokaLost: 3,
  newXp: 4,
  newDoka: 6,
});

let persistArgs: unknown[] | null = null;
await persistDeathPenalty(
  {
    saveBattleStats: async (...args) => {
      persistArgs = args;
      return { __kind__: "ok", ok: null };
    },
  },
  {
    slot: 1,
    level: 4,
    hp: 0,
    maxHp: 100,
    ap: 4,
    maxAp: 4,
    mp: 3,
    maxMp: 3,
    attack: 15,
    defense: 2,
    initiative: 10,
    newXp: 80,
    newDoka: 60,
    spellLevels: { fireball: 2 },
  },
);

assert.ok(persistArgs);
assert.equal(persistArgs[0], 1n);
assert.equal(persistArgs[2], 80n);
assert.equal(persistArgs[9], 15n);
assert.equal(persistArgs[12], 60n);
assert.deepEqual(persistArgs[13], ["fireball"]);
assert.deepEqual(persistArgs[14], [2n]);

let threw = false;
try {
  await persistDeathPenalty(
    {
      saveBattleStats: async () => ({ __kind__: "err", err: "banned" }),
    },
    {
      slot: 1,
      level: 1,
      hp: 0,
      maxHp: 1,
      ap: 1,
      maxAp: 1,
      mp: 1,
      maxMp: 1,
      attack: 0,
      defense: 0,
      initiative: 0,
      newXp: 0,
      newDoka: 0,
      spellLevels: {},
    },
  );
} catch (e) {
  threw = String((e as Error).message).includes("banned");
}
assert.equal(threw, true);

assert.equal(raiseUiAfterDeathPersist(600, 900), 900);
assert.equal(raiseUiAfterDeathPersist(900, 900), 900);
assert.equal(raiseUiAfterDeathPersist(610, 582), 610);
assert.equal(shouldApplyVictoryLiveHydrate(true), false);
assert.equal(shouldApplyVictoryLiveHydrate(false), true);

// Win/claim persist is still on the lock. Recap overlay does not block the
// map, so lava death applies 40% to the pre-credit UI. The queued write
// penalizes the post-credit committed wallet. Raising UI prevents
// hydrateWhenIdle from copying the under-count over committed.
{
  const lock = createProgressPersist({ doka: 1000, xp: 100, level: 4 });
  let uiDoka = 1000;
  let uiXp = 100;

  const credit = lock.enqueue(async () => {
    lock.commit({
      doka: committedDokaAfterAchievementCredit(lock.snapshot().doka, 500),
      xp: lock.snapshot().xp + 80,
    });
  });

  const optimistic = computeDeathPenalty(uiXp, uiDoka);
  uiDoka = optimistic.newDoka;
  uiXp = optimistic.newXp;
  assert.equal(uiDoka, 600);
  assert.equal(uiXp, 80);

  const death = lock.enqueue(async () => {
    const after = computeDeathPenalty(lock.snapshot().xp, lock.snapshot().doka);
    lock.commit({ doka: after.newDoka, xp: after.newXp });
    uiDoka = raiseUiAfterDeathPersist(uiDoka, after.newDoka);
    uiXp = raiseUiAfterDeathPersist(uiXp, after.newXp);
  });

  await Promise.all([credit, death]);
  assert.equal(uiDoka, 900);
  assert.equal(uiXp, 144);
  assert.equal(lock.snapshot().doka, 900);
  assert.equal(lock.snapshot().xp, 144);

  lock.hydrateWhenIdle({ doka: uiDoka, xp: uiXp, level: 4 });
  assert.equal(lock.snapshot().doka, 900);
  assert.equal(lock.snapshot().xp, 144);
}

console.log("deathPenalty.test: ok");
