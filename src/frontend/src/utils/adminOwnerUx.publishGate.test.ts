import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldAllowOwnerLivePublish } from "./adminOwnerUx.publishGate.ts";

describe("shouldAllowOwnerLivePublish", () => {
  it("blocks live publish until the canister read lands", () => {
    const gate = shouldAllowOwnerLivePublish({ remoteHydrated: false });
    assert.equal(gate.allow, false);
    assert.match(gate.reason ?? "", /Waiting for canister/);
  });

  it("blocks live publish when the canister read failed", () => {
    const gate = shouldAllowOwnerLivePublish({
      remoteHydrated: false,
      hydrateFailed: true,
    });
    assert.equal(gate.allow, false);
    assert.match(gate.reason ?? "", /do not publish the local cache/i);
  });

  it("allows live publish after a successful hydrate", () => {
    const gate = shouldAllowOwnerLivePublish({ remoteHydrated: true });
    assert.equal(gate.allow, true);
    assert.equal(gate.reason, null);
  });

  it("does not block a browser-only draft save", () => {
    const gate = shouldAllowOwnerLivePublish({
      remoteHydrated: false,
      localDraftOnly: true,
    });
    assert.equal(gate.allow, true);
    assert.equal(gate.reason, null);
  });
});
