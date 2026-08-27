import assert from "node:assert/strict";
import { normalizeCallerDokaBalance } from "./dokaBalanceQuery.ts";

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

console.log("dokaBalanceQuery.test: ok");
