import assert from "node:assert/strict";
import {
  buildInitiatePurchaseArgs,
  readCallerDokaBalance,
  readInitiatePurchaseResult,
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

console.log("shopPurchase.test: ok");
