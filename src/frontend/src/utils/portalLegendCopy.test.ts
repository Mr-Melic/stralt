import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { nearbyPortalLabel } from "./portalLegendCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("portalLegendCopy", () => {
  it("keeps short carved labels per portal kind", () => {
    assert.equal(nearbyPortalLabel("dungeon"), "Enter Dungeon Chain");
    assert.equal(
      nearbyPortalLabel("dungeon_continue", { depth: 2, max: 5 }),
      "Continue Chain (2/5)",
    );
    assert.equal(nearbyPortalLabel("rest"), "Rest");
    assert.equal(nearbyPortalLabel("boss"), "Boss");
    assert.equal(nearbyPortalLabel("explore"), "Explore");
    assert.equal(nearbyPortalLabel("sanctuary"), "Sanctuary");
    assert.equal(nearbyPortalLabel("death_realm_exit"), "Death Realm exit");
  });

  it("WorldExploration still labels only dungeon / active chain nearby", () => {
    assert.match(
      worldSource,
      /p\.color === "dungeon" \|\| dungeonChainActiveRef\.current/,
    );
    assert.match(worldSource, /Enter Dungeon Chain/);
    assert.match(worldSource, /Continue Chain/);
  });
});
