import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  layoutFetchCacheKey,
  loadUserUiLayoutOnce,
  parseBackendLayout,
  resetUserUiLayoutInflightForTests,
} from "./uiLayoutActivity.ts";

describe("parseBackendLayout", () => {
  it("accepts a compact panel blob", () => {
    const parsed = parseBackendLayout(
      '{"chat-panel":{"x":12,"y":40,"folded":true}}',
    );
    assert.deepEqual(parsed, {
      "chat-panel": { x: 12, y: 40, folded: true },
    });
  });

  it("returns null for empty or invalid blobs", () => {
    assert.equal(parseBackendLayout(""), null);
    assert.equal(parseBackendLayout("[]"), null);
    assert.equal(parseBackendLayout("{"), null);
    assert.equal(parseBackendLayout('{"stats":{"x":1}}'), null);
  });
});

describe("loadUserUiLayoutOnce", () => {
  it("maps an empty user id onto the guest cache key", () => {
    assert.equal(layoutFetchCacheKey(""), "guest");
    assert.equal(layoutFetchCacheKey("alice"), "alice");
  });

  it("shares one getUserUiLayout across concurrent callers for the same user", async () => {
    resetUserUiLayoutInflightForTests();
    let calls = 0;
    let release: ((blob: string) => void) | undefined;
    const actor = {
      getUserUiLayout: () => {
        calls += 1;
        return new Promise<string>((resolve) => {
          release = resolve;
        });
      },
    };

    const first = loadUserUiLayoutOnce(actor, "player-1");
    const second = loadUserUiLayoutOnce(actor, "player-1");
    assert.equal(calls, 1);
    assert.ok(release);

    release(
      JSON.stringify({
        "chat-panel": { x: 8, y: 16, folded: false },
        "battle-ui-panel": { x: 20, y: 80, folded: true },
      }),
    );
    const [a, b] = await Promise.all([first, second]);
    assert.equal(a, b);
    assert.equal(a?.["chat-panel"]?.x, 8);
    assert.equal(a?.["battle-ui-panel"]?.folded, true);
  });

  it("does not share in-flight fetches across different user ids", async () => {
    resetUserUiLayoutInflightForTests();
    let calls = 0;
    const actor = {
      getUserUiLayout: async () => {
        calls += 1;
        return '{"stats":{"x":1,"y":2,"folded":false}}';
      },
    };
    await Promise.all([
      loadUserUiLayoutOnce(actor, "a"),
      loadUserUiLayoutOnce(actor, "b"),
    ]);
    assert.equal(calls, 2);
  });

  it("fetches again after the in-flight promise settles", async () => {
    resetUserUiLayoutInflightForTests();
    let calls = 0;
    const actor = {
      getUserUiLayout: async () => {
        calls += 1;
        return '{"stats":{"x":1,"y":2,"folded":false}}';
      },
    };
    await loadUserUiLayoutOnce(actor, "player-1");
    await loadUserUiLayoutOnce(actor, "player-1");
    assert.equal(calls, 2);
  });

  it("returns null when the actor rejects, without throwing", async () => {
    resetUserUiLayoutInflightForTests();
    const actor = {
      getUserUiLayout: async () => {
        throw new Error("canister down");
      },
    };
    const parsed = await loadUserUiLayoutOnce(actor, "player-1");
    assert.equal(parsed, null);
  });
});
