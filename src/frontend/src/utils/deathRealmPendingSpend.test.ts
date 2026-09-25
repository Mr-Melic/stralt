import assert from "node:assert/strict";
import {
  shouldAllowProgressSpendDuringDeathRealm,
  shouldStartRenameDuringDeathRealm,
  shouldStartSpellUpgrade,
} from "./deathRealmPendingSpend.ts";
import { RENAME_DOKA_COST } from "./renameCharacter.ts";

assert.equal(shouldAllowProgressSpendDuringDeathRealm(true), false);
assert.equal(shouldAllowProgressSpendDuringDeathRealm(false), true);
assert.equal(
  shouldAllowProgressSpendDuringDeathRealm(undefined),
  true,
  "omit pending (callers that have not wired the flag) must still spend",
);

assert.equal(
  shouldStartSpellUpgrade({
    inFlight: false,
    liveDoka: 40,
    cost: 10,
    deathRealmPending: true,
  }),
  false,
  "upgradeSpell during Death Realm pending writes a level after the 20/40 snapshot",
);
assert.equal(
  shouldStartSpellUpgrade({
    inFlight: false,
    liveDoka: 40,
    cost: 10,
    deathRealmPending: false,
  }),
  true,
  "Death Realm already loaded must still allow spell upgrades",
);
assert.equal(
  shouldStartSpellUpgrade({
    inFlight: true,
    liveDoka: 40,
    cost: 10,
    deathRealmPending: false,
  }),
  false,
);
assert.equal(
  shouldStartSpellUpgrade({
    inFlight: false,
    liveDoka: 9,
    cost: 10,
    deathRealmPending: false,
  }),
  false,
);

assert.equal(
  shouldStartRenameDuringDeathRealm({
    inFlight: false,
    liveDoka: 200,
    deathRealmPending: true,
  }),
  false,
  "renameCharacter during Death Realm pending writes −100 after the death snapshot",
);
assert.equal(
  shouldStartRenameDuringDeathRealm({
    inFlight: false,
    liveDoka: 200,
    deathRealmPending: false,
  }),
  true,
  "Death Realm already loaded must still allow rename",
);
assert.equal(
  shouldStartRenameDuringDeathRealm({
    inFlight: true,
    liveDoka: 200,
    deathRealmPending: false,
  }),
  false,
);
assert.equal(
  shouldStartRenameDuringDeathRealm({
    inFlight: false,
    liveDoka: RENAME_DOKA_COST - 1,
    deathRealmPending: false,
  }),
  false,
);

{
  // Chronology: overworld lava → persistDeathPenalty restores HP to 50% of
  // max (hp < max, wallet still has Doka) → defeat recap is
  // pointer-events: none → HUD Rename / Spellbook Upgrade used to persist
  // a paid name or spell level before the 1.5s Death Realm timer fired.
  const restoredHp = 50;
  const maxHp = 100;
  const liveDoka = 200;
  assert.equal(restoredHp < maxHp, true);
  assert.equal(liveDoka >= RENAME_DOKA_COST, true);
  assert.equal(
    shouldStartRenameDuringDeathRealm({
      inFlight: false,
      liveDoka,
    }),
    true,
    "post-penalty wallet would otherwise enable Confirm Rename",
  );
  assert.equal(
    shouldStartRenameDuringDeathRealm({
      inFlight: false,
      liveDoka,
      deathRealmPending: true,
    }),
    false,
    "pending Death Realm must not start a 100 Doka rename",
  );
  assert.equal(
    shouldStartSpellUpgrade({
      inFlight: false,
      liveDoka,
      cost: 10,
    }),
    true,
    "post-penalty wallet would otherwise enable Spellbook Upgrade",
  );
  assert.equal(
    shouldStartSpellUpgrade({
      inFlight: false,
      liveDoka,
      cost: 10,
      deathRealmPending: true,
    }),
    false,
    "pending Death Realm must not start an upgradeSpell debit",
  );
  assert.equal(
    shouldStartRenameDuringDeathRealm({
      inFlight: false,
      liveDoka,
      deathRealmPending: false,
    }),
    true,
    "Death Realm already loaded (timer cleared) may rename",
  );
  assert.equal(
    shouldStartSpellUpgrade({
      inFlight: false,
      liveDoka,
      cost: 10,
      deathRealmPending: false,
    }),
    true,
    "Death Realm already loaded (timer cleared) may upgrade",
  );
}

console.log("deathRealmPendingSpend.test: ok");
