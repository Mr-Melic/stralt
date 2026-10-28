import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  HEAD_CHALLENGE_LAYOUT_PREFIX,
  HEAD_CHAT_CHANNELS_KEY,
  HEAD_CHAT_WIDTH_KEY,
  HEAD_SOUND_MUTE_KEY,
  HEAD_SOUND_VOLUME_KEY,
  HEAD_UI_LAYOUT_PREFIX,
  UI_LAYOUT_SCHEMA_VERSION,
  emptyLocalLayoutWouldClobberBackendBlob,
  headVersionGateDropsUiLayoutCache,
  mergeUiLayoutForBackendSave,
  parseUiLayoutBlob,
  serializeUiLayoutBlob,
  shouldPreserveUiLayoutVersionGateKey,
  shouldSaveLocalUiLayoutToBackend,
} from "./uiLayoutVersionWipe.ts";
import { shouldPreserveVersionGateKey } from "./versionGate.ts";

describe("uiLayoutVersionWipe", () => {
  it("HEAD version-gate drops HUD, sound, and chat keys", () => {
    const hudKey = `${HEAD_UI_LAYOUT_PREFIX}alice`;
    const challengeKey = `${HEAD_CHALLENGE_LAYOUT_PREFIX}alice`;
    assert.equal(shouldPreserveVersionGateKey(hudKey), false);
    assert.equal(shouldPreserveVersionGateKey(challengeKey), false);
    assert.equal(shouldPreserveVersionGateKey(HEAD_SOUND_VOLUME_KEY), false);
    assert.equal(shouldPreserveVersionGateKey(HEAD_SOUND_MUTE_KEY), false);
    assert.equal(shouldPreserveVersionGateKey(HEAD_CHAT_WIDTH_KEY), false);
    assert.equal(shouldPreserveVersionGateKey(HEAD_CHAT_CHANNELS_KEY), false);
    assert.equal(headVersionGateDropsUiLayoutCache(hudKey), true);
    assert.equal(shouldPreserveUiLayoutVersionGateKey(hudKey), true);
    assert.equal(shouldPreserveUiLayoutVersionGateKey(challengeKey), true);
    assert.equal(
      shouldPreserveUiLayoutVersionGateKey(HEAD_SOUND_MUTE_KEY),
      true,
    );
    assert.equal(shouldPreserveVersionGateKey("aaaaa-aa_inventory"), true);
  });

  it("does not saveUserUiLayout a post-wipe empty or unhydrated cache over a live blob", () => {
    assert.equal(emptyLocalLayoutWouldClobberBackendBlob(), true);
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        localPanelCount: 0,
        backendBlobPresent: true,
        hydratedFromBackend: false,
      }),
      false,
    );
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        localPanelCount: 1,
        backendBlobPresent: true,
        hydratedFromBackend: false,
      }),
      false,
    );
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        localPanelCount: 3,
        backendBlobPresent: true,
        hydratedFromBackend: true,
      }),
      true,
    );
  });

  it("merges a one-panel fold onto the last backend map instead of replacing it", () => {
    const backend = {
      stats: { x: 100, y: 50, folded: false },
      spellbook: { x: 10, y: 60, folded: true },
    };
    const localAfterWipeFold = {
      stats: { x: 700, y: 80, folded: true },
    };
    const merged = mergeUiLayoutForBackendSave(localAfterWipeFold, backend);
    assert.deepEqual(merged.stats, { x: 700, y: 80, folded: true });
    assert.deepEqual(merged.spellbook, { x: 10, y: 60, folded: true });
  });

  it("round-trips HEAD compact JSON and a versioned blob; missing folded drops only that panel", () => {
    assert.equal(UI_LAYOUT_SCHEMA_VERSION, 1);
    const headCompact = JSON.stringify({
      stats: { x: 1, y: 2, folded: false },
      broken: { x: 3, y: 4 },
    });
    assert.deepEqual(parseUiLayoutBlob(headCompact), {
      stats: { x: 1, y: 2, folded: false },
    });
    const versioned = serializeUiLayoutBlob({
      stats: { x: 8, y: 9, folded: true },
    });
    assert.equal(JSON.parse(versioned).schemaVersion, 1);
    assert.deepEqual(parseUiLayoutBlob(versioned), {
      stats: { x: 8, y: 9, folded: true },
    });
    assert.equal(parseUiLayoutBlob(""), null);
    assert.equal(parseUiLayoutBlob("{"), null);
  });
});
