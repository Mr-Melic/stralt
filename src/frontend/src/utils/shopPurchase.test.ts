import assert from "node:assert/strict";
import {
  buildInitiatePurchaseArgs,
  creditPendingPurchases,
  creditedDokaDelta,
  readCallerDokaBalance,
  readInitiatePurchaseResult,
  shopCreditUsesBattleTimeoutSet,
} from "./shopPurchase.ts";

const args = buildInitiatePurchaseArgs(
  "pkg_500",
  {
    firstName: "  Ada  ",
    lastName: "Lovelace",
    email: "ada@example.com",
    address: "12 Analytical Engine Rd",
    city: "London",
    country: "UK",
    postalCode: "SW1A 1AA",
  },
  "data:image/png;base64,abc",
);

assert.deepEqual(args, [
  "pkg_500",
  "Ada",
  "Lovelace",
  "ada@example.com",
  "12 Analytical Engine Rd",
  "London",
  "UK",
  "SW1A 1AA",
  "data:image/png;base64,abc",
]);
assert.equal(args.length, 9, "canister expects nine positional Text args");
assert.equal(
  typeof args[1],
  "string",
  "customerName must be a string, not an object",
);

assert.deepEqual(buildInitiatePurchaseArgs("pkg_1", {}, ""), [
  "pkg_1",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
]);

assert.deepEqual(readInitiatePurchaseResult({ __kind__: "ok", ok: "pur_1" }), {
  ok: "pur_1",
});
assert.deepEqual(readInitiatePurchaseResult({ ok: "pur_2" }), { ok: "pur_2" });
assert.deepEqual(
  readInitiatePurchaseResult({ __kind__: "err", err: "Account banned" }),
  { err: "Account banned" },
);
assert.equal(readInitiatePurchaseResult(undefined).err != null, true);
assert.equal(readInitiatePurchaseResult({ __kind__: "ok" }).err != null, true);

assert.equal(readCallerDokaBalance(1500n), 1500);
assert.equal(readCallerDokaBalance(42), 42);
assert.equal(readCallerDokaBalance(undefined), null);
assert.equal(readCallerDokaBalance(Number.NaN), null);

assert.equal(
  shopCreditUsesBattleTimeoutSet(),
  false,
  "cleanupBattle wipes pendingTimeoutsRef; shop credit must not live there",
);
assert.equal(creditedDokaDelta(100, 600), 500);
assert.equal(creditedDokaDelta(600, 600), 0);
assert.equal(creditedDokaDelta(null, 600), 0);

void (async () => {
  let processed = 0;
  const actor = {
    processPendingPurchases: async () => {
      processed += 1;
      return 1n;
    },
    getCallerDokaBalance: async () => (processed === 0 ? 100n : 600n),
  };
  const result = await creditPendingPurchases(actor);
  assert.equal(processed, 1);
  assert.deepEqual(result, { previous: 100, credited: 600 });
  assert.equal(creditedDokaDelta(result.previous, result.credited), 500);

  const emptyActor = {
    processPendingPurchases: async () => 0n,
    getCallerDokaBalance: async () => undefined,
  };
  assert.deepEqual(await creditPendingPurchases(emptyActor), {
    previous: null,
    credited: null,
  });
  assert.deepEqual(await creditPendingPurchases({}), {
    previous: null,
    credited: null,
  });

  console.log("shopPurchase.test: ok");
})();
