import assert from "node:assert/strict";
import { persistSpellUpgrade, readUpgradeSpellOk } from "./spellUpgrade.ts";

assert.equal(readUpgradeSpellOk({ ok: 2n }), 2);
assert.equal(readUpgradeSpellOk({ _ok: 3 }), 3);
assert.equal(readUpgradeSpellOk({ __kind__: "ok", ok: 1n }), 1);

let threw = false;
try {
  readUpgradeSpellOk({ __kind__: "err", err: "Not enough Doka" });
} catch (e) {
  threw = String((e as Error).message).includes("Not enough Doka");
}
assert.equal(threw, true);

threw = false;
try {
  readUpgradeSpellOk({ err: "Spell not found: fireball" });
} catch (e) {
  threw = String((e as Error).message).includes("Spell not found");
}
assert.equal(threw, true);

const calls: Array<{ slot: bigint; spellId: string }> = [];
const actor = {
  upgradeSpell: async (slot: bigint, spellId: string) => {
    calls.push({ slot, spellId });
    return { ok: 2n };
  },
  getCallerDokaBalance: async () => 40n,
};

const ok = await persistSpellUpgrade(actor, 1, "fireball");
assert.equal(ok.newLevel, 2);
assert.equal(ok.newDoka, 40);
assert.equal(calls.length, 1);
assert.equal(calls[0].slot, 1n);
assert.equal(calls[0].spellId, "fireball");

let persistThrew = false;
try {
  await persistSpellUpgrade(
    {
      upgradeSpell: async () => ({ err: "Account banned" }),
    },
    1,
    "fireball",
  );
} catch (e) {
  persistThrew = String((e as Error).message).includes("Account banned");
}
assert.equal(persistThrew, true);

const noBalance = await persistSpellUpgrade(
  {
    upgradeSpell: async () => ({ ok: 3n }),
    getCallerDokaBalance: async () => null,
  },
  1,
  "ice_lance",
);
assert.equal(noBalance.newLevel, 3);
assert.equal(noBalance.newDoka, undefined);

let invalidLevel = false;
try {
  readUpgradeSpellOk({ ok: 0 });
} catch (e) {
  invalidLevel = String((e as Error).message).includes("invalid level");
}
assert.equal(invalidLevel, true);

console.log("spellUpgrade.test: ok");
