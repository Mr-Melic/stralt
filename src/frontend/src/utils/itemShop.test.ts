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

console.log("itemShop.test: ok");
