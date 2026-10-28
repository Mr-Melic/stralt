import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { VOID_RIFT_WARP_LOG } from "./voidRiftCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("voidRiftCopy", () => {
  it("warns without printing a tile coordinate", () => {
    assert.equal(
      VOID_RIFT_WARP_LOG,
      "Void Rift shifts — a new tile is unsafe. Stay off the dark square.",
    );
    assert.equal(/\$\{/.test(VOID_RIFT_WARP_LOG), false);
    assert.equal(/\(\d+,\d+\)/.test(VOID_RIFT_WARP_LOG), false);
  });

  it("is not wired — WorldExploration still interpolates pick.x, pick.y", () => {
    assert.match(
      worldSource,
      /Void Rift warps tile \(\$\{pick\.x\},\$\{pick\.y\}\)!/,
    );
    assert.equal(worldSource.includes("voidRiftCopy"), false);
  });
});
