import assert from "node:assert/strict";
import {
  JACKPOT_HEAL_DOKA_COST,
  dokaHealAmounts,
  isBuffShopOpen,
  nextDokaAfterJackpotHeal,
  nextDokaAfterShopSpend,
  nextHpAfterDokaHeal,
  shouldAllowShopSpend,
  shouldStartDokaHeal,
} from "./itemShop.ts";

assert.equal(
  isBuffShopOpen(undefined),
  false,
  "omitting isOpen must not mount the shop (WorldExploration used to do this)",
);
assert.equal(isBuffShopOpen(false), false);
assert.equal(isBuffShopOpen(true), true);

assert.equal(nextDokaAfterShopSpend(200, 50), 150);
assert.equal(nextDokaAfterShopSpend(30, 50), 0);
assert.equal(nextDokaAfterShopSpend(0, 50), 0);
// Jackpot heal is a 1-Doka spend off the live ref, not the render snapshot.
assert.equal(nextDokaAfterShopSpend(150, 1), 149);
assert.notEqual(nextDokaAfterShopSpend(150, 1), 199);

// Double-click before re-render must debit the live wallet, not the
// render snapshot (200 → 150 → 100, not 200 → 150 twice).
{
  let live = 200;
  live = nextDokaAfterShopSpend(live, 50);
  live = nextDokaAfterShopSpend(live, 50);
  assert.equal(live, 100);
}

// Jackpot used the render snapshot (200) after a same-tick shop debit
// left the live ref at 150. persist spend was 0; idle hydrate refunded 50.
{
  let live = 200;
  live = nextDokaAfterShopSpend(live, 50);
  live = nextDokaAfterJackpotHeal(live);
  assert.equal(JACKPOT_HEAL_DOKA_COST, 1);
  assert.equal(live, 149);
  assert.equal(nextDokaAfterJackpotHeal(200), 199);
}

// Persist HP from the pre-setState snapshot. After setCharacterStats the
// eager updater already added hpToAdd to the ref; adding it again writes
// 110 for a 30-HP / 10-Doka heal.
assert.equal(nextHpAfterDokaHeal(50, 200, 30), 80);
assert.equal(nextHpAfterDokaHeal(80, 200, 30), 110);
assert.notEqual(nextHpAfterDokaHeal(50, 200, 30), 110);
assert.equal(nextHpAfterDokaHeal(90, 100, 30), 100);

assert.deepEqual(dokaHealAmounts(50, 200, 10), { hpToAdd: 30, dokaCost: 10 });
assert.deepEqual(dokaHealAmounts(50, 80, 100), { hpToAdd: 30, dokaCost: 10 });
assert.deepEqual(dokaHealAmounts(100, 100, 50), { hpToAdd: 0, dokaCost: 0 });

assert.equal(
  shouldStartDokaHeal({ currentHp: 50, maxHp: 200, liveDoka: 10 }),
  true,
);
assert.equal(
  shouldStartDokaHeal({ currentHp: 80, maxHp: 200, liveDoka: 0 }),
  false,
  "second click after the first emptied the wallet must not persist a free heal",
);
assert.equal(
  shouldStartDokaHeal({ currentHp: 100, maxHp: 100, liveDoka: 50 }),
  false,
);

// Heal then buy before re-render: render still shows 55, potion costs 50.
assert.equal(shouldAllowShopSpend(55, 50), true);
assert.equal(shouldAllowShopSpend(45, 50), false);
assert.equal(shouldAllowShopSpend(50, 0), false);

{
  // Chronology: 50/200 HP, 10 Doka. Double-click heal.
  // Click 1 spends the wallet and heals +30. Click 2 must no-op.
  let hp = 50;
  let doka = 10;
  const first = shouldStartDokaHeal({
    currentHp: hp,
    maxHp: 200,
    liveDoka: doka,
  });
  assert.equal(first, true);
  const amounts = dokaHealAmounts(hp, 200, doka);
  const persistHp = nextHpAfterDokaHeal(hp, 200, amounts.hpToAdd);
  hp = persistHp;
  doka = nextDokaAfterShopSpend(doka, amounts.dokaCost);
  assert.equal(hp, 80);
  assert.equal(doka, 0);
  assert.equal(
    shouldStartDokaHeal({ currentHp: hp, maxHp: 200, liveDoka: doka }),
    false,
  );
}

console.log("itemShop.test: ok");
