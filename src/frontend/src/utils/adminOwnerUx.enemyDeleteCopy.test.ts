import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerEnemyDeleteConfirmBody,
  ownerEnemyDeleteConfirmLooksLiveOnMain,
} from "./adminOwnerUx.enemyDeleteCopy.ts";

const MAIN_BODY =
  "This removes the live enemy template immediately. Players can encounter it until you recreate it. This cannot be undone.";

describe("ownerEnemyDeleteConfirmBody", () => {
  it("does not claim deleting a catalog row stops overworld encounters", () => {
    const body = ownerEnemyDeleteConfirmBody();
    assert.match(body, /catalog/i);
    assert.match(body, /getEnemyConfigs/);
    assert.equal(
      /Players can encounter it until you recreate/i.test(body),
      false,
    );
    assert.equal(/live enemy template immediately/i.test(body), false);
    assert.notEqual(body, MAIN_BODY);
  });

  it("keeps empty sprite URL as a valid default, never an error", () => {
    const body = ownerEnemyDeleteConfirmBody();
    assert.match(body, /Default Pixel Visual/i);
    assert.equal(/is an error/i.test(body), false);
    assert.equal(ownerEnemyDeleteConfirmLooksLiveOnMain(), true);
  });
});
