import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DEFAULT_CHALLENGES } from "./challengeCompletion.ts";
import {
  STRIKER_PLAYER_DESCRIPTION,
  challengePlayerDescription,
} from "./challengeOfferCopy.ts";

const catalogSource = readFileSync(
  fileURLToPath(new URL("./challengeCompletion.ts", import.meta.url)),
  "utf8",
);
const panelSource = readFileSync(
  fileURLToPath(new URL("../components/ChallengePanel.tsx", import.meta.url)),
  "utf8",
);

describe("challengeOfferCopy", () => {
  it("names the 2-tile rule without Chebyshev", () => {
    const striker = DEFAULT_CHALLENGES.find(
      (c) => c.condition === "direct_hit",
    );
    assert.ok(striker);
    assert.equal(
      challengePlayerDescription(striker),
      STRIKER_PLAYER_DESCRIPTION,
    );
    assert.match(STRIKER_PLAYER_DESCRIPTION, /2 tiles/);
    assert.match(STRIKER_PLAYER_DESCRIPTION, /diagonal/i);
    assert.equal(/chebyshev/i.test(STRIKER_PLAYER_DESCRIPTION), false);
  });

  it("leaves other offer lines unchanged", () => {
    const untouchable = DEFAULT_CHALLENGES.find(
      (c) => c.condition === "no_damage_taken",
    );
    assert.ok(untouchable);
    assert.equal(
      challengePlayerDescription(untouchable),
      untouchable.description,
    );
  });

  it("is not wired — catalog and panel still print Chebyshev", () => {
    assert.match(catalogSource, /Chebyshev distance/);
    assert.match(panelSource, /currentChallenge\.description/);
    assert.equal(panelSource.includes("challengeOfferCopy"), false);
    assert.equal(catalogSource.includes("challengeOfferCopy"), false);
  });
});
