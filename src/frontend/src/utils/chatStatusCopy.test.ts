import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { chatStatusGroupHeading } from "./chatStatusCopy.ts";

const chatSource = readFileSync(
  fileURLToPath(new URL("../components/ChatPanel.tsx", import.meta.url)),
  "utf8",
);

describe("chatStatusCopy", () => {
  it("titles the group with the unit name, not a sliced id", () => {
    assert.equal(chatStatusGroupHeading("Wraith Bishop"), "WRAITH BISHOP");
    assert.equal(chatStatusGroupHeading(), "AN ENEMY");
    assert.equal(chatStatusGroupHeading(""), "AN ENEMY");
    assert.equal(/E-3/.test(chatStatusGroupHeading("Wraith Bishop")), false);
  });

  it("is not wired — ChatPanel still slices enemyId", () => {
    assert.match(chatSource, /ENEMY \{enemyId\.slice\(-4\)\.toUpperCase\(\)\}/);
    assert.equal(chatSource.includes("chatStatusCopy"), false);
  });
});
