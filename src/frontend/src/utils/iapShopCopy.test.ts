import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DOKA_PER_EURO,
  GAME_KEY_ALPHABET,
  GAME_KEY_LENGTH,
  euroTextToCents,
  playerGameKeyStatusCopy,
  suggestedDokaFromEuroCents,
  suggestedDokaFromEuros,
  validateGameKeyConsent,
  validateGameKeyEmail,
  validateGameKeyFormat,
} from "./dokaGameKey.ts";
import {
  IAP_SHOP_CLOSE_LABEL,
  IAP_SHOP_CONSENT_LABEL,
  IAP_SHOP_KYC_PREAMBLE,
  IAP_SHOP_PACKAGES_DETAIL,
  IAP_SHOP_PACKAGES_LEAD,
  IAP_SHOP_TITLE,
} from "./iapShopCopy.ts";

describe("iapShopCopy", () => {
  it("titles the IAP modal Buy Doka, not Doka Shop", () => {
    assert.equal(IAP_SHOP_TITLE, "Buy Doka");
    assert.equal(IAP_SHOP_TITLE.includes("Doka Shop"), false);
    assert.equal(IAP_SHOP_CLOSE_LABEL.includes("Buy Doka"), true);
  });

  it("says the shop is real-money credit, not Items", () => {
    assert.match(IAP_SHOP_PACKAGES_LEAD, /real-money/i);
    assert.match(IAP_SHOP_PACKAGES_LEAD, /EUR/i);
    assert.match(IAP_SHOP_PACKAGES_LEAD, /Items/i);
    assert.match(IAP_SHOP_PACKAGES_DETAIL, /GameKey/i);
    assert.match(IAP_SHOP_PACKAGES_DETAIL, /1000 Doka = 10/);
  });

  it("asks for email consent, not proof of address", () => {
    assert.match(IAP_SHOP_KYC_PREAMBLE, /email/i);
    assert.match(IAP_SHOP_KYC_PREAMBLE, /consent/i);
    assert.match(IAP_SHOP_KYC_PREAMBLE, /no proof of address/i);
    assert.equal(/proof-of-address/i.test(IAP_SHOP_KYC_PREAMBLE), false);
    assert.match(IAP_SHOP_CONSENT_LABEL, /email/i);
  });
});

describe("dokaGameKey", () => {
  it("suggests 100 Doka per euro (1000 Doka / 10€)", () => {
    assert.equal(DOKA_PER_EURO, 100);
    assert.equal(suggestedDokaFromEuros(10), 1000);
    assert.equal(suggestedDokaFromEuroCents(1000), 1000);
    assert.equal(suggestedDokaFromEuroCents(100), 100);
    assert.equal(suggestedDokaFromEuroCents(0), 0);
    assert.deepEqual(euroTextToCents("10"), { ok: 1000 });
    assert.deepEqual(euroTextToCents("10.50"), { ok: 1050 });
    assert.deepEqual(euroTextToCents(""), { ok: 0 });
    assert.equal("err" in euroTextToCents("ten"), true);
  });

  it("requires a 120-char alphabet of letters, numbers, and symbols", () => {
    assert.equal(GAME_KEY_LENGTH, 120);
    assert.equal(/[A-Za-z]/.test(GAME_KEY_ALPHABET), true);
    assert.equal(/[0-9]/.test(GAME_KEY_ALPHABET), true);
    assert.equal(/[!@#$%^&*_\+\-=]/.test(GAME_KEY_ALPHABET), true);
    const valid = GAME_KEY_ALPHABET[0].repeat(GAME_KEY_LENGTH);
    assert.equal(validateGameKeyFormat(valid), null);
    assert.equal(validateGameKeyFormat("short"), "GameKey is too short");
    assert.equal(validateGameKeyFormat(`${valid}x`), "GameKey is too long");
    assert.equal(
      validateGameKeyFormat(`${"A".repeat(119)} `),
      "GameKey contains invalid characters",
    );
  });

  it("validates email and consent", () => {
    assert.equal(validateGameKeyEmail("ada@example.com"), null);
    assert.equal(validateGameKeyEmail("nope") != null, true);
    assert.equal(validateGameKeyConsent(true), null);
    assert.match(validateGameKeyConsent(false) ?? "", /consent/i);
  });

  it("maps player-facing request status copy", () => {
    assert.equal(playerGameKeyStatusCopy("pending"), "Waiting for approval");
    assert.match(playerGameKeyStatusCopy("approved"), /check email/i);
    assert.equal(playerGameKeyStatusCopy("redeemed"), "Redeemed");
    assert.match(playerGameKeyStatusCopy("rejected"), /cancelled/i);
  });
});
