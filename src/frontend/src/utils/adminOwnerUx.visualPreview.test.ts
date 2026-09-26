import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { catalogVisualPreviewSrc } from "./adminOwnerUx.visualPreview.ts";
import { unsafeUrl } from "./adminSafety.ts";

describe("catalogVisualPreviewSrc", () => {
  it("treats empty / blank / missing as no preview (valid default)", () => {
    assert.equal(catalogVisualPreviewSrc("", unsafeUrl), null);
    assert.equal(catalogVisualPreviewSrc("   ", unsafeUrl), null);
    assert.equal(catalogVisualPreviewSrc(undefined, unsafeUrl), null);
    assert.equal(catalogVisualPreviewSrc(null, unsafeUrl), null);
  });

  it("does not preview javascript/data/vbscript/file URLs", () => {
    assert.equal(
      catalogVisualPreviewSrc("javascript:alert(1)", unsafeUrl),
      null,
    );
    assert.equal(catalogVisualPreviewSrc("data:text/html,x", unsafeUrl), null);
    assert.equal(catalogVisualPreviewSrc("vbscript:msg", unsafeUrl), null);
    assert.equal(
      catalogVisualPreviewSrc("file:///etc/passwd", unsafeUrl),
      null,
    );
  });

  it("returns a trimmed hosted URL for thumbnail only", () => {
    assert.equal(
      catalogVisualPreviewSrc(" https://cdn.example/e.png ", unsafeUrl),
      "https://cdn.example/e.png",
    );
  });
});
