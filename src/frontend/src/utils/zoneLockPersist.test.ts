import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldPreserveVersionGateKey } from "./versionGate.ts";
import {
  HEAD_ZONE_LOCK_KEY,
  headZoneLockIsPrincipalScoped,
  readZoneLockEnabled,
  shouldInheritZoneLockOnSlotReuse,
  shouldPreserveZoneLockVersionGateKey,
  zoneLockStorageKey,
} from "./zoneLockPersist.ts";

describe("zoneLockPersist", () => {
  it("HEAD zone lock is a browser-global flag, not principal/slot scoped", () => {
    assert.equal(HEAD_ZONE_LOCK_KEY, "aestralto_zone_locked");
    assert.equal(headZoneLockIsPrincipalScoped(), false);
    assert.equal(shouldInheritZoneLockOnSlotReuse(), false);
    assert.equal(
      zoneLockStorageKey("aaaaa-aa", 2),
      "pbv_zone_lock_aaaaa-aa_slot2",
    );
    assert.equal(zoneLockStorageKey("  ", 0), "pbv_zone_lock_guest_slot1");
  });

  it("APP_VERSION wipe on HEAD drops aestralto_zone_locked", () => {
    assert.equal(shouldPreserveVersionGateKey(HEAD_ZONE_LOCK_KEY), false);
    assert.equal(
      shouldPreserveZoneLockVersionGateKey(HEAD_ZONE_LOCK_KEY),
      true,
    );
    assert.equal(
      shouldPreserveZoneLockVersionGateKey(zoneLockStorageKey("aaaaa-aa", 1)),
      true,
    );
    assert.equal(
      shouldPreserveZoneLockVersionGateKey("pbv_app_version"),
      false,
    );
  });

  it("reads the lock the same way WX hydrates the flag", () => {
    assert.equal(readZoneLockEnabled("true"), true);
    assert.equal(readZoneLockEnabled("false"), false);
    assert.equal(readZoneLockEnabled(null), false);
    assert.equal(readZoneLockEnabled("TRUE"), false);
  });
});
