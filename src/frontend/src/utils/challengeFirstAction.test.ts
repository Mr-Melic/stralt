import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldMarkFirstActionForAttackNearest } from "./challengeFirstAction.ts";

describe("shouldMarkFirstActionForAttackNearest", () => {
  it("does not dismiss an unaccepted offer on cooldown or no-target", () => {
    let firstActionTaken = false;
    let challenge: string | null = "untouchable";
    const markFirstAction = () => {
      firstActionTaken = true;
      challenge = null;
    };

    const attackNearestPrep = (spentAp: boolean) => {
      if (shouldMarkFirstActionForAttackNearest({ spentAp })) {
        markFirstAction();
      }
    };

    attackNearestPrep(false);
    assert.equal(
      firstActionTaken,
      false,
      "unpatched: markFirstAction ran before the cooldown / no-target gate",
    );
    assert.equal(
      challenge,
      "untouchable",
      "unaccepted offer must survive a no-op Attack Nearest / S",
    );
  });

  it("marks first action once a real AP spend lands", () => {
    let firstActionTaken = false;
    const markFirstAction = () => {
      firstActionTaken = true;
    };
    assert.equal(
      shouldMarkFirstActionForAttackNearest({ spentAp: true }),
      true,
    );
    if (shouldMarkFirstActionForAttackNearest({ spentAp: true })) {
      markFirstAction();
    }
    assert.equal(firstActionTaken, true);
  });
});
