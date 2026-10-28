import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  summonActorLabel,
  summonCannotMoveLog,
  summonCastLog,
  summonMeleeLog,
  summonMoveLog,
  summonTurnDoneLog,
} from "./summonAiLogCopy.ts";

const executorSource = readFileSync(
  fileURLToPath(new URL("../engine/summonExecutor.ts", import.meta.url)),
  "utf8",
);

describe("summonAiLogCopy", () => {
  it("names the unit and the verb, with no engineer tags or coordinates", () => {
    assert.equal(
      summonActorLabel({ name: "Dire Wolf", assignedName: "wolf" }),
      "Dire Wolf",
    );
    assert.equal(summonMoveLog("Dire Wolf"), "Dire Wolf moves.");
    assert.equal(
      summonCastLog("Dire Wolf", "Poison Arrow"),
      "Dire Wolf casts Poison Arrow.",
    );
    assert.equal(summonMeleeLog("Dire Wolf"), "Dire Wolf strikes.");
    assert.equal(summonTurnDoneLog("Dire Wolf"), "Dire Wolf ends its turn.");
    assert.equal(
      summonCannotMoveLog("Dire Wolf"),
      "Dire Wolf cannot step there.",
    );
    const sample = summonCastLog("Dire Wolf", "Poison Arrow");
    assert.equal(/\[decide\]|\[cast\]|\[move\]|\[melee\]/.test(sample), false);
    assert.equal(/\(\d+,\d+\)/.test(sample), false);
  });

  it("is not wired — summonExecutor still dumps [decide]/[cast] tags", () => {
    assert.match(executorSource, /\[decide\] \$\{summonLabel\}/);
    assert.match(executorSource, /\[cast\] \$\{summonLabel\}/);
    assert.equal(executorSource.includes("summonAiLogCopy"), false);
  });
});
