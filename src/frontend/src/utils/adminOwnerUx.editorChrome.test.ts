import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_LIVE_NAV_GROUPS,
  ownerEditorBreadcrumb,
  ownerLiveTabGroup,
  ownerValidationSummary,
  shouldClearOwnerEditorAfterSave,
} from "./adminOwnerUx.editorChrome.ts";

describe("ownerEditorBreadcrumb", () => {
  it("builds Enemies / name without implying the row is live", () => {
    const crumb = ownerEditorBreadcrumb({
      tabLabel: "Enemies",
      entityName: "Shadow Knight",
    });
    assert.deepEqual(crumb.trail, ["Enemies", "Shadow Knight"]);
    assert.equal(crumb.label, "Enemies / Shadow Knight");
  });

  it("labels a create form as New", () => {
    const crumb = ownerEditorBreadcrumb({
      tabLabel: "Spells",
      entityName: "Fireball",
      isNew: true,
    });
    assert.deepEqual(crumb.trail, ["Spells", "New"]);
  });
});

describe("shouldClearOwnerEditorAfterSave", () => {
  it("keeps the editor open while the mutation is pending or failed", () => {
    assert.equal(shouldClearOwnerEditorAfterSave({ succeeded: false }), false);
    assert.equal(
      shouldClearOwnerEditorAfterSave({ succeeded: true, pending: true }),
      false,
    );
  });

  it("clears only after a successful write", () => {
    assert.equal(
      shouldClearOwnerEditorAfterSave({ succeeded: true, pending: false }),
      true,
    );
  });
});

describe("ownerValidationSummary", () => {
  it("treats an empty error list as ready, not failed", () => {
    const summary = ownerValidationSummary([null, "", "  "]);
    assert.equal(summary.ok, true);
    assert.equal(summary.headline, null);
  });

  it("collects multiple field errors into one headline", () => {
    const summary = ownerValidationSummary([
      "Spell ID and name are required",
      null,
      "range exceeds maxRange",
    ]);
    assert.equal(summary.ok, false);
    assert.equal(summary.messages.length, 2);
    assert.match(summary.headline ?? "", /2 fields/);
  });
});

describe("owner live nav groups", () => {
  it("covers every live tab exactly once and adds no empty domain tabs", () => {
    const tabs = OWNER_LIVE_NAV_GROUPS.flatMap((g) => [...g.tabs]);
    assert.equal(tabs.length, 15);
    assert.equal(new Set(tabs).size, 15);
    assert.equal(
      tabs.some((t) =>
        ["challenges", "ai", "formations", "dungeons", "telemetry"].includes(t),
      ),
      false,
    );
    assert.equal(ownerLiveTabGroup("enemies")?.id, "content");
    assert.equal(ownerLiveTabGroup("purchases")?.id, "economy");
  });
});
