import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  facetOwnerListRows,
  matchesOwnerQuery,
  sortOwnerListRows,
} from "./adminOwnerUx.listQuery.ts";

const rows = [
  { id: "shadow", name: "Shadow Knight", levelMin: 8, active: true },
  { id: "wisp", name: "Wisp", levelMin: 1, active: false },
  { id: "arch", name: "Archbishop", levelMin: 12, active: true },
];

describe("matchesOwnerQuery", () => {
  it("empty query keeps every row", () => {
    assert.equal(matchesOwnerQuery("", "Shadow Knight", "shadow"), true);
  });

  it("matches any provided field", () => {
    assert.equal(matchesOwnerQuery("wisp", "Shadow", "wisp"), true);
    assert.equal(matchesOwnerQuery("rook", "Shadow", "wisp"), false);
  });
});

describe("sortOwnerListRows", () => {
  it("sorts by name without dropping rows", () => {
    const sorted = sortOwnerListRows(rows, { key: "name", dir: "asc" });
    assert.deepEqual(
      sorted.map((r) => r.id),
      ["arch", "shadow", "wisp"],
    );
  });

  it("sorts by levelMin descending", () => {
    const sorted = sortOwnerListRows(rows, { key: "levelMin", dir: "desc" });
    assert.deepEqual(
      sorted.map((r) => r.id),
      ["arch", "shadow", "wisp"],
    );
  });
});

describe("facetOwnerListRows", () => {
  it("filters Active without treating Inactive as an error", () => {
    const active = facetOwnerListRows(rows, {
      facet: "active",
      isActive: (r) => r.active,
    });
    const inactive = facetOwnerListRows(rows, {
      facet: "inactive",
      isActive: (r) => r.active,
    });
    assert.equal(active.length, 2);
    assert.equal(inactive.length, 1);
    assert.equal(inactive[0]?.id, "wisp");
  });

  it("all facet is a no-op copy", () => {
    const all = facetOwnerListRows(rows, {
      facet: "all",
      isActive: (r) => r.active,
    });
    assert.equal(all.length, 3);
    assert.notEqual(all, rows);
  });
});
