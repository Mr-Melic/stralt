import assert from "node:assert/strict";
import { createProgressPersist } from "./progressPersist.ts";
import {
  applySpellLevel,
  persistSpellUpgrade,
  readUpgradeSpellOk,
  spellUpgradeUiSpend,
} from "./spellUpgrade.ts";

assert.deepEqual(applySpellLevel({ fireball: 1 }, "fireball", 2), {
  fireball: 2,
});
assert.deepEqual(applySpellLevel({}, "heal", 1), { heal: 1 });

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

// A heal queued during upgradeSpell must persist the new level, not the
// click-time map. React setState for spellLevels runs after enqueue returns.
{
  const lock = createProgressPersist({ doka: 200, xp: 0, level: 1 });
  let levels: Record<string, number> = { fireball: 1 };
  let wroteLevels: Record<string, number> | null = null;
  let releaseUpgrade!: () => void;
  const upgradeGate = new Promise<void>((resolve) => {
    releaseUpgrade = resolve;
  });

  const upgrade = lock.enqueue(async () => {
    await upgradeGate;
    const next = applySpellLevel(levels, "fireball", 2);
    levels = next;
    return next;
  });

  const heal = lock.enqueue(async () => {
    wroteLevels = { ...levels };
  });

  releaseUpgrade();
  await Promise.all([upgrade, heal]);
  assert.deepEqual(wroteLevels, { fireball: 2 });
}

// Summon upgrades advertise 10× but upgradeSpell only deducts base*2^level.
// Debiting the advertised cost leaves the UI short; hydrateWhenIdle then
// copies that under-count over committed and the next heal persists it.
assert.equal(spellUpgradeUiSpend(100, 200, 190), 10);
assert.equal(spellUpgradeUiSpend(100, 200, undefined), 100);
assert.equal(spellUpgradeUiSpend(3200, 4000, 3680), 320);

{
  const lock = createProgressPersist({ doka: 200, xp: 0, level: 1 });
  const advertisedSummonCost = 100;
  const backendAfter = 190;
  const committedBefore = lock.snapshot().doka;
  lock.commit({ doka: backendAfter });
  const spent = spellUpgradeUiSpend(
    advertisedSummonCost,
    committedBefore,
    backendAfter,
  );
  const uiAfter = 200 - spent;
  assert.equal(spent, 10);
  assert.equal(uiAfter, 190);
  lock.hydrateWhenIdle({ doka: uiAfter, xp: 0, level: 1 });
  assert.equal(lock.snapshot().doka, 190);

  const wrongUi = 200 - advertisedSummonCost;
  const wrongLock = createProgressPersist({ doka: 190, xp: 0, level: 1 });
  wrongLock.hydrateWhenIdle({ doka: wrongUi, xp: 0, level: 1 });
  assert.equal(wrongLock.snapshot().doka, 100);
}

console.log("spellUpgrade.test: ok");
