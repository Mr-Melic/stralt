import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dotTickLog } from "./dotTickCopy.ts";

const worldSource = readFileSync(
  fileURLToPath(new URL("../components/WorldExploration.tsx", import.meta.url)),
  "utf8",
);

describe("dotTickCopy", () => {
  it("names you / the unit and the effect, not key=value", () => {
    assert.equal(
      dotTickLog({
        targetId: "player",
        effectName: "Poison",
        damage: 4,
        stacksLeft: 2,
      }),
      "You take 4 from Poison (2 stacks left).",
    );
    assert.equal(
      dotTickLog({
        targetId: "e-3",
        targetName: "Wraith Bishop",
        effectName: "Burning",
        damage: 3,
        stacksLeft: 1,
      }),
      "Wraith Bishop takes 3 from Burning (1 stack left).",
    );
    assert.equal(
      /\[DOT\]/.test(
        dotTickLog({
          targetId: "player",
          effectName: "Poison",
          damage: 1,
          stacksLeft: 1,
        }),
      ),
      false,
    );
    assert.equal(
      /resReduc=/.test(
        dotTickLog({
          targetId: "player",
          effectName: "Poison",
          damage: 1,
          stacksLeft: 1,
        }),
      ),
      false,
    );
  });

  it("is not wired — WorldExploration still dumps [DOT] key=value", () => {
    assert.match(worldSource, /\[DOT\] target=\$\{targetName\}/);
    assert.equal(worldSource.includes("dotTickCopy"), false);
  });
});
