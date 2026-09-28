import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  BUFF_SHOP_OVERWORLD_HINT,
  buffShopUseTitle,
} from "./buffShopUseCopy.ts";

const shopSource = readFileSync(
  fileURLToPath(new URL("../components/BuffShop.tsx", import.meta.url)),
  "utf8",
);

describe("buffShopUseCopy", () => {
  it("points overworld Use at the HUD Doka heal", () => {
    assert.match(BUFF_SHOP_OVERWORLD_HINT, /battle turn/);
    assert.match(BUFF_SHOP_OVERWORLD_HINT, /Doka button on the HUD/);
    assert.match(
      buffShopUseTitle({ inBattle: false, isPlayerTurn: false }),
      /HUD/,
    );
    assert.equal(
      buffShopUseTitle({ inBattle: true, isPlayerTurn: false }),
      "Wait for your turn",
    );
    assert.equal(
      buffShopUseTitle({ inBattle: true, isPlayerTurn: true }),
      "Use item",
    );
  });

  it("BuffShop on main still omits the HUD heal next-step", () => {
    assert.match(shopSource, /Only usable in battle/);
    assert.match(shopSource, /Items can only be used during your battle turn/);
    assert.equal(/Doka button on the HUD/.test(shopSource), false);
  });
});
