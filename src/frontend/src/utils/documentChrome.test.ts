import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

describe("document chrome", () => {
  it("declares a dark color-scheme and navy theme-color for mobile browser chrome", () => {
    const src = readFileSync(
      fileURLToPath(new URL("../../index.html", import.meta.url)),
      "utf8",
    );
    assert.match(src, /viewport-fit=cover/);
    assert.match(src, /name="color-scheme" content="dark"/);
    assert.match(src, /name="theme-color" content="#0d0f1a"/);
  });
});
