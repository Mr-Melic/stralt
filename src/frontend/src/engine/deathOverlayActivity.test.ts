import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  isDeathOverlayActive,
  setDeathOverlayActive,
  shouldPauseChatPoll,
  subscribeDeathOverlayActive,
} from "./deathOverlayActivity.ts";

describe("deathOverlayActivity", () => {
  it("notifies subscribers only when the overlay flag actually flips", () => {
    setDeathOverlayActive(false);
    assert.equal(isDeathOverlayActive(), false);

    let flips = 0;
    const unsub = subscribeDeathOverlayActive(() => {
      flips += 1;
    });

    setDeathOverlayActive(true);
    setDeathOverlayActive(true);
    assert.equal(isDeathOverlayActive(), true);
    assert.equal(flips, 1);

    setDeathOverlayActive(false);
    assert.equal(isDeathOverlayActive(), false);
    assert.equal(flips, 2);

    unsub();
    setDeathOverlayActive(true);
    assert.equal(flips, 2);
    setDeathOverlayActive(false);
  });

  it("pauses chat poll for battle, portal transition, and Game Over", () => {
    assert.equal(
      shouldPauseChatPoll({
        inBattle: false,
        transitioning: false,
        deathOverlay: false,
      }),
      false,
    );
    assert.equal(
      shouldPauseChatPoll({
        inBattle: true,
        transitioning: false,
        deathOverlay: false,
      }),
      true,
    );
    assert.equal(
      shouldPauseChatPoll({
        inBattle: false,
        transitioning: true,
        deathOverlay: false,
      }),
      true,
    );
    assert.equal(
      shouldPauseChatPoll({
        inBattle: false,
        transitioning: false,
        deathOverlay: true,
      }),
      true,
    );
  });

  it("wires GameOverModal and GameFlow without touching ChatPanel", () => {
    const modal = readFileSync(
      fileURLToPath(
        new URL("../components/GameOverModal.tsx", import.meta.url),
      ),
      "utf8",
    );
    const flow = readFileSync(
      fileURLToPath(new URL("../components/GameFlow.tsx", import.meta.url)),
      "utf8",
    );
    const chat = readFileSync(
      fileURLToPath(new URL("../components/ChatPanel.tsx", import.meta.url)),
      "utf8",
    );
    assert.match(modal, /useLayoutEffect/);
    assert.match(modal, /setDeathOverlayActive\(isOpen\)/);
    assert.match(flow, /shouldPauseChatPoll/);
    assert.match(flow, /deathOverlay: deathOverlayActive/);
    assert.equal(chat.includes("deathOverlayActivity"), false);
  });
});
