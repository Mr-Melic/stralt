import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  type UiLayoutStorage,
  readUiLayoutCache,
  resolveUiLayoutStorageUserId,
  shouldSaveLocalUiLayoutToBackend,
} from "./uiLayoutStorageKey.ts";

function memoryStorage(init: Record<string, string> = {}): UiLayoutStorage & {
  data: Record<string, string>;
} {
  const data = { ...init };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe("uiLayoutStorageKey", () => {
  it("resolves live principal text over display name, including hyphenated names", () => {
    assert.equal(
      resolveUiLayoutStorageUserId({
        principalText: "aaaaa-aa",
        passedUserId: "VampireBob",
      }),
      "aaaaa-aa",
    );
    assert.equal(
      resolveUiLayoutStorageUserId({
        principalText: "cwofb-yqaaa-aaaap-qp45q-cai",
        passedUserId: "dark-lord",
      }),
      "cwofb-yqaaa-aaaap-qp45q-cai",
    );
    assert.equal(
      resolveUiLayoutStorageUserId({
        principalText: null,
        passedUserId: "dark-lord",
      }),
      "dark-lord",
    );
    assert.equal(
      resolveUiLayoutStorageUserId({
        principalText: "  ",
        passedUserId: "VampireBob",
      }),
      "VampireBob",
    );
  });

  it("copy-if-missing migrates legacy name key onto principal", () => {
    const storage = memoryStorage({
      pbv_panel_layout_VampireBob: '{"stats":{"x":1,"y":2,"folded":false}}',
    });
    const raw = readUiLayoutCache({
      storagePrefix: "pbv_panel_layout_",
      storageUserId: "aaaaa-aa",
      legacyUserId: "VampireBob",
      storage,
    });
    assert.equal(raw, '{"stats":{"x":1,"y":2,"folded":false}}');
    assert.equal(
      storage.data["pbv_panel_layout_aaaaa-aa"],
      '{"stats":{"x":1,"y":2,"folded":false}}',
    );
    assert.equal(storage.data.pbv_panel_layout_VampireBob, undefined);
  });

  it("does not overwrite an existing principal cache with legacy", () => {
    const storage = memoryStorage({
      "pbv_panel_layout_aaaaa-aa": '{"stats":{"x":9,"y":9,"folded":true}}',
      pbv_panel_layout_VampireBob: '{"stats":{"x":1,"y":2,"folded":false}}',
    });
    const raw = readUiLayoutCache({
      storagePrefix: "pbv_panel_layout_",
      storageUserId: "aaaaa-aa",
      legacyUserId: "VampireBob",
      storage,
    });
    assert.equal(raw, '{"stats":{"x":9,"y":9,"folded":true}}');
    assert.equal(
      storage.data.pbv_panel_layout_VampireBob,
      '{"stats":{"x":1,"y":2,"folded":false}}',
    );
  });

  it("blocks backend save until identity principal is present and blob reconciled", () => {
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        backendBlobReconciled: false,
        hasIdentityPrincipal: true,
      }),
      false,
    );
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        backendBlobReconciled: true,
        hasIdentityPrincipal: false,
      }),
      false,
    );
    assert.equal(
      shouldSaveLocalUiLayoutToBackend({
        backendBlobReconciled: true,
        hasIdentityPrincipal: true,
      }),
      true,
    );
  });
});
