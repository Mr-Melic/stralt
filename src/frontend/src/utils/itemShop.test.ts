import assert from "node:assert/strict";
import { isBuffShopOpen, nextDokaAfterShopSpend } from "./itemShop.ts";

assert.equal(
  isBuffShopOpen(undefined),
  false,
  "omitting isOpen must not mount the shop (WorldExploration used to do this)",
);
assert.equal(isBuffShopOpen(false), false);
assert.equal(isBuffShopOpen(true), true);

assert.equal(nextDokaAfterShopSpend(200, 50), 150);
assert.equal(nextDokaAfterShopSpend(30, 50), 0);
assert.equal(nextDokaAfterShopSpend(0, 50), 0);
// Jackpot heal is a 1-Doka spend off the live ref, not the render snapshot.
assert.equal(nextDokaAfterShopSpend(150, 1), 149);
assert.notEqual(nextDokaAfterShopSpend(150, 1), 199);

// Double-click before re-render must debit the live wallet, not the
// render snapshot (200 → 150 → 100, not 200 → 150 twice).
{
  let live = 200;
  live = nextDokaAfterShopSpend(live, 50);
  live = nextDokaAfterShopSpend(live, 50);
  assert.equal(live, 100);
}

console.log("itemShop.test: ok");
