import assert from "node:assert/strict";
import {
  normalizeCallerDokaBalance,
  noteCallerDokaSessionWrite,
  shouldApplyCallerDokaHydrate,
  shouldMarkCallerDokaWalletReady,
  syncLiveDokaFromProp,
} from "./dokaBalanceQuery.ts";
import { syncLiveDokaFromProp as syncLiveWalletFromProp } from "./itemShop.ts";

assert.equal(normalizeCallerDokaBalance(0), 0);
assert.equal(normalizeCallerDokaBalance(250n), 250);
assert.equal(normalizeCallerDokaBalance("80"), 80);
assert.equal(normalizeCallerDokaBalance(null), 0);
assert.equal(normalizeCallerDokaBalance(undefined), 0);

let threw = false;
try {
  normalizeCallerDokaBalance("not-a-number");
} catch (e) {
  threw = String((e as Error).message).includes("non-numeric");
}
assert.equal(threw, true, "non-numeric payloads must throw, not become 0");

threw = false;
try {
  normalizeCallerDokaBalance(Number.NaN);
} catch {
  threw = true;
}
assert.equal(
  threw,
  true,
  "NaN must throw so a failed refetch cannot wipe Doka",
);

assert.equal(
  shouldApplyCallerDokaHydrate({
    backendDoka: undefined,
    inWorld: false,
    alreadyHydratedInWorld: false,
  }),
  false,
  "a missing query result must not wipe the session wallet",
);
assert.equal(
  shouldApplyCallerDokaHydrate({
    backendDoka: 200,
    inWorld: false,
    alreadyHydratedInWorld: false,
  }),
  true,
  "character select still hydrates so rename spends appear",
);
assert.equal(
  shouldApplyCallerDokaHydrate({
    backendDoka: 250,
    inWorld: true,
    alreadyHydratedInWorld: false,
  }),
  true,
  "the first in-world reading seeds the session cache",
);
assert.equal(
  shouldApplyCallerDokaHydrate({
    backendDoka: 250,
    inWorld: true,
    alreadyHydratedInWorld: true,
  }),
  false,
  "a claim/focus refetch must not replace the live wallet after hydrate",
);

// Claim invalidate returns the post-claim canister (750). UI already
// deducted a recap heal (720). Replacing then hydrating refunds the 30.
const uiAfterHeal = 720;
const claimRefetch = 750;
const wouldReplace = shouldApplyCallerDokaHydrate({
  backendDoka: claimRefetch,
  inWorld: true,
  alreadyHydratedInWorld: true,
});
assert.equal(wouldReplace, false);
assert.equal(uiAfterHeal, 720);

// Query data exists one render before setDokaBalance. Marking ready then
// lets idle hydrate copy the placeholder 0 over a shop-credit seed.
assert.equal(
  shouldMarkCallerDokaWalletReady({
    queryResolved: true,
    sessionCacheApplied: false,
  }),
  false,
);
assert.equal(
  shouldMarkCallerDokaWalletReady({
    queryResolved: true,
    sessionCacheApplied: true,
  }),
  true,
);
assert.equal(
  shouldMarkCallerDokaWalletReady({
    queryResolved: false,
    sessionCacheApplied: false,
  }),
  false,
);

{
  // Chronology: heal debits the live ref, then a child-only setCharacterStats
  // re-render still sees the stale-high prop. Copying the prop every render
  // restored 100 and a later shop spend / idle hydrate refunded the heal.
  const lastSeen = { current: 100 };
  const live = { current: 100 };
  syncLiveDokaFromProp(lastSeen, live, 100);
  assert.equal(live.current, 100);
  live.current = 90;
  syncLiveDokaFromProp(lastSeen, live, 100);
  assert.equal(
    live.current,
    90,
    "unchanged stale-high prop must not overwrite a live debit",
  );
  syncLiveDokaFromProp(lastSeen, live, 90);
  assert.equal(live.current, 90, "GameFlow committing the debit is a no-op");
  syncLiveDokaFromProp(lastSeen, live, 140);
  assert.equal(live.current, 140, "a real parent credit must still land");
}

{
  // Unseeded GameKey / feat `#ok` flushed setDokaBalance(1000) before the
  // in-flight getCallerDokaBalance (200) arrived. First hydrate used to
  // replace the grant; WorldExploration's sync then adopted 200 because
  // live === prev after the credit.
  const afterCredit = noteCallerDokaSessionWrite({ inWorld: true });
  assert.equal(afterCredit.dokaSessionApplied, true);
  assert.equal(afterCredit.alreadyHydratedInWorld, true);
  assert.equal(
    shouldApplyCallerDokaHydrate({
      backendDoka: 200,
      inWorld: true,
      alreadyHydratedInWorld: afterCredit.alreadyHydratedInWorld,
    }),
    false,
    "pre-credit query must not replace a flushed GameKey/feat HUD credit",
  );
  assert.equal(
    shouldApplyCallerDokaHydrate({
      backendDoka: 1200,
      inWorld: true,
      alreadyHydratedInWorld: afterCredit.alreadyHydratedInWorld,
    }),
    false,
    "do not re-open later higher snapshots — that refunds a recap heal",
  );

  let live = 0;
  let prev = 0;
  const credited = syncLiveWalletFromProp({
    propDoka: 1000,
    prevPropDoka: prev,
    liveDoka: 1000,
  });
  live = credited.liveDoka;
  prev = credited.prevPropDoka;
  assert.equal(live, 1000);
  assert.equal(prev, 1000);
  const clobber = syncLiveWalletFromProp({
    propDoka: 200,
    prevPropDoka: prev,
    liveDoka: live,
  });
  assert.equal(
    clobber.liveDoka,
    200,
    "if the first hydrate still landed, the HUD would drop the grant",
  );

  const selectWrite = noteCallerDokaSessionWrite({ inWorld: false });
  assert.equal(selectWrite.alreadyHydratedInWorld, false);
  assert.equal(
    shouldApplyCallerDokaHydrate({
      backendDoka: 200,
      inWorld: true,
      alreadyHydratedInWorld: selectWrite.alreadyHydratedInWorld,
    }),
    true,
    "character-select writes must not skip the first in-world hydrate",
  );
}

console.log("dokaBalanceQuery.test: ok");
