import assert from "node:assert/strict";
import {
  armDeathGuards,
  deathGuardsAreArmed,
  isDeathRealmTransitionPending,
  nextMovementGenOnDeathRealmPending,
  shouldBlockPortalDuringPendingDeathRealm,
  shouldIgnoreCanvasWalkDuringDeath,
} from "./deathGuards.ts";

const spent = {
  deathTriggered: { current: true },
  deathPenaltyApplied: { current: true },
};
assert.equal(
  deathGuardsAreArmed(spent),
  false,
  "in-battle death used to leave both guards set",
);

armDeathGuards(spent);
assert.equal(spent.deathTriggered.current, false);
assert.equal(spent.deathPenaltyApplied.current, false);
assert.equal(
  deathGuardsAreArmed(spent),
  true,
  "Death Realm / Respawn must re-arm so the next 0 HP can run",
);

const armed = {
  deathTriggered: { current: false },
  deathPenaltyApplied: { current: false },
};
assert.equal(deathGuardsAreArmed(armed), true);
armDeathGuards(armed);
assert.equal(deathGuardsAreArmed(armed), true);

// persistDeathPenalty restores HP before the player can reach a portal.
// The guard must not depend on hp<=0 — only deathTriggered + pending timer.
assert.equal(
  shouldBlockPortalDuringPendingDeathRealm(true, true),
  true,
  "pending Death Realm + deathTriggered must block portals after HP restore",
);
assert.equal(
  shouldBlockPortalDuringPendingDeathRealm(true, false),
  false,
  "Death Realm already loaded (timer cleared) must allow the exit portal",
);
assert.equal(
  shouldBlockPortalDuringPendingDeathRealm(false, true),
  false,
  "a stray timer without deathTriggered must not lock exploration",
);
assert.equal(shouldBlockPortalDuringPendingDeathRealm(false, false), false);

assert.equal(
  isDeathRealmTransitionPending(true, true),
  true,
  "pending Death Realm must also block world encounters",
);
assert.equal(isDeathRealmTransitionPending(true, false), false);
assert.equal(isDeathRealmTransitionPending(false, true), false);

// Exploration lava → persistDeathPenalty restores HP → recap dismiss.
// Canvas used to require inBattle && (deathTriggered || hp<=0), so a new
// walk could step lava / shrine / ground Doka during the 1.5s wait.
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: false,
    deathTriggered: true,
    hp: 50,
    deathRealmTimerPending: true,
  }),
  true,
  "pending Death Realm must block canvas walk after HP restore and recap dismiss",
);
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: true,
    deathTriggered: true,
    hp: 50,
    deathRealmTimerPending: true,
  }),
  true,
  "in-battle lava death 300ms window after setInBattle is still pending — helper also keeps the in-battle gate",
);
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: true,
    deathTriggered: true,
    hp: 0,
    deathRealmTimerPending: false,
  }),
  true,
  "original in-battle death canvas gate must still fire before the timer is armed",
);
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: false,
    deathTriggered: false,
    hp: 50,
    deathRealmTimerPending: false,
  }),
  false,
  "Death Realm already loaded (guards re-armed) must allow canvas walk",
);
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: false,
    deathTriggered: true,
    hp: 50,
    deathRealmTimerPending: false,
  }),
  false,
  "a stray deathTriggered without a pending timer must not lock Death Realm exploration",
);
assert.equal(
  shouldIgnoreCanvasWalkDuringDeath({
    inBattle: true,
    deathTriggered: false,
    hp: 80,
    deathRealmTimerPending: false,
  }),
  false,
  "live fight must still accept canvas input",
);
assert.equal(nextMovementGenOnDeathRealmPending(4), 5);
assert.equal(nextMovementGenOnDeathRealmPending(0), 1);

console.log("deathGuards.test: ok");
