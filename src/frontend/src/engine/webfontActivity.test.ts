import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GOOGLE_FONTS_CSS_ORIGIN,
  GOOGLE_FONTS_FILE_ORIGIN,
  GOOGLE_FONTS_STYLESHEET_HREF,
  googleFontsPreconnectOrigins,
  googleFontsStylesheetIncludesFamily,
  shouldLoadShareTechMono,
} from "./webfontActivity.ts";

describe("webfontActivity", () => {
  it("does not load unused Share Tech Mono", () => {
    assert.equal(shouldLoadShareTechMono(), false);
    assert.equal(
      googleFontsStylesheetIncludesFamily(
        GOOGLE_FONTS_STYLESHEET_HREF,
        "Share+Tech+Mono",
      ),
      false,
    );
  });

  it("keeps the carved-stone display and body families", () => {
    assert.equal(
      googleFontsStylesheetIncludesFamily(
        GOOGLE_FONTS_STYLESHEET_HREF,
        "Baloo+2",
      ),
      true,
    );
    assert.equal(
      googleFontsStylesheetIncludesFamily(
        GOOGLE_FONTS_STYLESHEET_HREF,
        "Saira",
      ),
      true,
    );
    assert.ok(GOOGLE_FONTS_STYLESHEET_HREF.includes("display=swap"));
  });

  it("preconnects the CSS host and the font-file host", () => {
    const origins = googleFontsPreconnectOrigins();
    assert.deepEqual(origins, [
      GOOGLE_FONTS_CSS_ORIGIN,
      GOOGLE_FONTS_FILE_ORIGIN,
    ]);
  });
});
