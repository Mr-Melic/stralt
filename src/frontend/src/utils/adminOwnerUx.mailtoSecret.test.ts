import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  OWNER_MAILTO_COPY_INSTRUCTION,
  ownerGameKeyMailtoHref,
  ownerMailtoBodyContainsCode,
  ownerMailtoEmbedsPlaintextKeyOnMain,
  shouldEmbedGameKeyInMailto,
} from "./adminOwnerUx.mailtoSecret.ts";
import { gameKeyMailtoHref } from "./dokaGameKey.ts";

describe("owner GameKey mailto omits the redeemable code", () => {
  it("main mailto embeds the 120-char key; owner helper does not", () => {
    const code = "K".repeat(120);
    const mainHref = gameKeyMailtoHref("ada@example.com", code);
    assert.equal(ownerMailtoBodyContainsCode(mainHref, code), true);
    const ownerHref = ownerGameKeyMailtoHref("ada@example.com");
    assert.equal(ownerMailtoBodyContainsCode(ownerHref, code), false);
    assert.equal(
      decodeURIComponent(ownerHref).includes(OWNER_MAILTO_COPY_INSTRUCTION),
      true,
    );
    assert.equal(shouldEmbedGameKeyInMailto(), false);
    assert.equal(ownerMailtoEmbedsPlaintextKeyOnMain(), true);
  });

  it("rejects an invalid email the same way as the live helper", () => {
    assert.equal(ownerGameKeyMailtoHref("not-an-email"), "#");
    assert.equal(ownerGameKeyMailtoHref(""), "#");
  });
});
