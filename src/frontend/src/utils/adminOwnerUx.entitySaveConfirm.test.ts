import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ownerLiveCatalogSaveConfirmBody,
  ownerLiveCatalogSaveConfirmTitle,
  shouldPublishLiveCatalog,
} from "./adminOwnerUx.entitySaveConfirm.ts";

describe("owner live catalog save confirm", () => {
  it("names the live entity and never says draft", () => {
    const title = ownerLiveCatalogSaveConfirmTitle("enemy", "Shadow Knight");
    assert.equal(title, 'Publish live enemy spawn template "Shadow Knight"?');
    assert.equal(/draft/i.test(title), false);
  });

  it("keeps empty name valid and still live", () => {
    const title = ownerLiveCatalogSaveConfirmTitle("spell", "  ");
    assert.equal(title, "Publish live spell?");
  });

  it("says Cancel does not write and is not a draft", () => {
    for (const kind of [
      "enemy",
      "spell",
      "region",
      "modifier",
      "achievement",
      "sprite",
    ] as const) {
      const body = ownerLiveCatalogSaveConfirmBody(kind);
      assert.match(body, /Cancel does not write/);
      assert.equal(/draft/i.test(body), false);
      assert.match(body, /immediately/);
    }
  });

  it("does not publish when the operator cancels", () => {
    assert.equal(shouldPublishLiveCatalog({ confirmed: false }), false);
    assert.equal(shouldPublishLiveCatalog({ confirmed: true }), true);
  });
});
