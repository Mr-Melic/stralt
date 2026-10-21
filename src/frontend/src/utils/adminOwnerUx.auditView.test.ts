import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerAuditChangeSummary,
  ownerAuditEmptyCopy,
  readOwnerAuditLog,
  sortOwnerAuditNewestFirst,
} from "./adminOwnerUx.auditView.ts";

describe("readOwnerAuditLog", () => {
  it("treats an empty ok list as a valid default, not an error", () => {
    const parsed = readOwnerAuditLog({ __kind__: "ok", ok: [] });
    assert.equal("ok" in parsed, true);
    assert.deepEqual(parsed.ok, []);
    assert.equal(
      ownerAuditEmptyCopy(parsed.ok?.length ?? 0),
      "No admin writes recorded — valid default.",
    );
  });

  it("maps candid rows and sorts newest first", () => {
    const parsed = readOwnerAuditLog({
      ok: [
        {
          adminPrincipal: "aaaaa-aa",
          timestampNs: 1_000_000_000n,
          action: "adminAddDokaToUser",
          objectId: "bbbbb-bb",
          previousSummary: "0",
          newSummary: "1000",
        },
        {
          adminPrincipal: "aaaaa-aa",
          timestampNs: 3_000_000_000n,
          action: "setAppVersion",
          objectId: "1.2.0",
          previousSummary: "1.1.0",
          newSummary: "1.2.0",
        },
      ],
    });
    assert.equal("ok" in parsed, true);
    const sorted = sortOwnerAuditNewestFirst(parsed.ok ?? []);
    const newest = sorted[0];
    assert.equal(newest?.action, "setAppVersion");
    assert.ok(newest);
    assert.match(
      ownerAuditChangeSummary(newest),
      /setAppVersion 1.2.0: 1.1.0 → 1.2.0/,
    );
    assert.equal(ownerAuditEmptyCopy(sorted.length), "2 recorded admin writes");
  });

  it("does not treat #err as an empty healthy log", () => {
    const parsed = readOwnerAuditLog({ __kind__: "err", err: "Not admin" });
    assert.equal("err" in parsed, true);
    assert.match(parsed.err ?? "", /Not admin/);
  });
});
