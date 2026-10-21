import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOwnerJumpIndex,
  ownerJumpHasForbiddenTabs,
  queryOwnerJumpIndex,
} from "./adminOwnerUx.entityJump.ts";

describe("owner entity jump index", () => {
  it("indexes the 15 live tabs and catalog rows without empty domains", () => {
    const hits = buildOwnerJumpIndex({
      enemies: [{ id: "shadow", name: "Shadow Knight" }],
      spells: [{ id: "soul_rend", name: "Soul Rend" }],
      names: ["Ash"],
    });
    const tabs = hits.filter((h) => h.kind === "tab");
    assert.equal(tabs.length, 15);
    assert.equal(ownerJumpHasForbiddenTabs(hits), false);
    assert.equal(
      hits.some((h) => h.id === "shadow" && h.tab === "enemies"),
      true,
    );
  });

  it("empty query keeps every hit; filter jumps to the owning tab", () => {
    const hits = buildOwnerJumpIndex({
      enemies: [{ id: "wisp", name: "Wisp" }],
    });
    assert.equal(queryOwnerJumpIndex(hits, "").length, hits.length);
    const wisp = queryOwnerJumpIndex(hits, "wisp");
    assert.equal(wisp.length, 1);
    assert.equal(wisp[0]?.tab, "enemies");
    assert.equal(wisp[0]?.kind, "entity");
  });
});
