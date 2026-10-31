import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { titanVigorLog } from "./titanVigorCopy.ts";

const modifiersSource = readFileSync(
  fileURLToPath(new URL("../engine/mapModifiers.ts", import.meta.url)),
  "utf8",
);

describe("titanVigorCopy", () => {
  it("names the surge in words, never rolls xN", () => {
    assert.equal(titanVigorLog(1), "Titan's Vigor leaves the blow unchanged.");
    assert.equal(titanVigorLog(2), "Titan's Vigor doubles the blow.");
    assert.equal(titanVigorLog(3), "Titan's Vigor triples the blow.");
    assert.equal(
      titanVigorLog(4),
      "Titan's Vigor makes this blow four times as strong.",
    );
    assert.equal(
      titanVigorLog(5),
      "Titan's Vigor makes this blow five times as strong.",
    );
    assert.equal(/rolls x/i.test(titanVigorLog(3)), false);
    assert.equal(/x3/.test(titanVigorLog(3)), false);
  });

  it("is not wired — mapModifiers still logs rolls xN", () => {
    assert.match(modifiersSource, /Titan's Vigor rolls x\$\{roll\} damage\./);
    assert.equal(modifiersSource.includes("titanVigorCopy"), false);
  });
});
