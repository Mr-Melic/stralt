# ACTION_IDs — 2026-09-27 Mechanic Interaction Matrix Auditor

Durable ledger for the Report Action Orchestrator.  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
HEAD inspected: `0f5363f` (`Merge pull request #332`)  
Gameplay code: not modified.

Do not re-file still-OPEN prior items (`MIMA-2026-08-31-001/002/005/008`, `MIMA-2026-09-01-002/006`, `MIMA-2026-09-02-002/003/004/005/006`, `MIMA-2026-09-21-001/002/003/004`, `MIMA-2026-09-22-001/002/003/004`, `MIMA-2026-09-23-001/002/003/004`, `MIMA-2026-09-24-001/002/003/004`, `MIMA-2026-09-25-001/002/003/004`, `MIMA-2026-09-26-001/002/003/004`). Frozen AI / execute, Wisp / Drain `healUsed`, Challenge HUD, Boss Rush feats, and Attack Nearest **origin** stay closed. Do not clone **#327** / **#331** / **#336** / **#370** / **#376** / **#379** / **#380** / **#382** / **#386** / **#389** / **#391** / **#410** / **#443** / **#467** / **#476** / **#487** / **#489** / **#491** / **#495** / **#496** / **#498** / **#508** / **#524** / **#541** / **#543** / **#546** / **#547** / **#550** / **#551** / **#553** / **#554** / **#555** / **#566** / **#596** / **#597** / **#598** / **#599** / **#601** / **#602** / **#604** / **#606** / **#607** / **#608** / **#617**.

HEAD is unchanged since the 09-21…09-26 matrices. These IDs are consume joins that were never filed: summon **spawn** (not walk) × tile hazards, Shield Charm absorb vs environmental / Mirror Field HP, Death Realm 1.5s × world rewards after recap dismiss, and `loot_10_doka` vs pickup persist.

---

ACTION_ID: MIMA-2026-09-27-001  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Player and hostile summon spawn treat lava/spikes/ice as free floor — no landing, no avoid  
CATEGORY: summons + hazards + statuses + targeting + occupancy  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Ground targeting only rejects range / barrier / occupancy / optional LoS (`targeting.ts` `isTileCastableLive` 551–573). Lava is a walkable `hazardTiles` overlay, so Summon Dire Wolf / Archer / Bomber / Wisp can legally click a lava cell. `spawnSummonUnit` (`summonSpawn.ts` 110–136) relocates only when `!isCellFree` or a reserved/portal unseal — `isCellFree` (`occupancy.ts` 84–97) is bounds + walkable + barrier + portal + void + occupied, **no** `hazardTiles`. `findNearestFreeCell` already takes `accept?: (cell) => boolean` (`occupancy.ts` 111–121) but spawn never passes a lava/spike/ice reject. WX `spawnPlayerSummon` (`WorldExploration.tsx` 9582–9635) then `addCombatant` at that cell with full HP. Hostile `spawnEnemySummonUnit` (`summonSpawn.ts` 254–284) is the same helper. Enemy walk landing still pays 8–15 lava + Burning (`WorldExploration.tsx` 16872–16948). Distinct from MIMA-2026-09-02-002 (battle-start destack / unseal **slide**). Distinct from 08-31-002 / 09-01-006 (**walk** landing after the unit already exists). No summon-spawn fixture seeds lava.  
EXPECTED_INTERACTION: Occupancy spawn prefers a non-hazard free cell in range; if it must land on lava/spikes/ice, the same landing helper as enemy walk runs (Burning / Frozen / spike HP). Preview and execute stay legal only for cells the landing rule accepts.  
ACTUAL_INTERACTION: A wolf can be summoned onto lava for 0 HP and no Burning while an enemy stepping there takes 8–15. Hostile minions can hatch on the same tiles.  
SYSTEMS_AFFECTED: summons (player + enemy spawn), hazards (lava/spikes/ice), statuses (Burning / Frozen), occupancy, targeting  
RECOMMENDED_ACTION: Pass `accept` into `findNearestFreeCell` / the requested-cell check that skips live lava/spikes/ice (and live rift if product wants). After a forced land, call the shared `applyHazardLanding` from 08-31-001. Do not change summon lifespan, AP, or kit range. Tests: requested cell lava ⇒ nearest non-hazard floor; if every neighbour is lava, landing commits store HP + Burning. Do not fold destack (09-02-002) or walk landing (09-01-006) into this PR unless extracting one helper.  
AUTONOMY: IMPLEMENT_HELPER_THEN_SPAWN_ACCEPT  
DEPENDENCIES: MIMA-2026-08-31-001 if landing is extracted once. Distinct from 09-02-002 destack. Do not grow a third lava block in WX.  
REGRESSION_RISK: MEDIUM — over-avoiding can fail cramped maps; fallback must still place a unique floor. Do not reject the cast when the only free cell is lava without applying landing.  
VALIDATION_REQUIRED: `spawnSummonUnit` fixture with lava at the click; playtest Wolf onto a lava pool.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-27-002  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Shield Charm absorbs spell/DoT/melee HP but lava, spikes, Thorned, Void Rift walk, and Mirror Field reflect write HP raw  
CATEGORY: healing + hazards + statuses + damage + challenges + player feedback  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: BuffShop copy is “Absorbs next 20 damage” (`WorldExploration.tsx` 3583–3585, `shieldHpRef`). Absorb runs in `playerTakesDamage` (3424–3438: spells, DoT ticks via `processActiveEffects` 1957–1960) and is duplicated on boss `damageToPlayer` (16027–16028) and enemy melee fallback (16750–16760). Lava 8–15 (`11428–11432`), spikes 5–10 (`11470–11472`), Thorned / Void Rift walk (`applyBattleWalkHazards` 9906–9933), and Mirror Field 20% reflect (`9538–9548`) all `setCharacterStats` HP directly — no `shieldHpRef`, no RES. Challenge HP still records the raw lava (`recordInBattleChallengeDamage`) / walk (`recordChallengeWalkHazardDamage`) / reflect (`recordChallengeDamageTaken`). Untouchable / under-N-damage therefore fail from a tile the charm’s copy says it would soak, while a Poison Arrow tick is absorbed. Distinct from MIMA-2026-08-31-001 (Swap landing — no shield). Distinct from 09-25-003 (Thorned **enemy** skip). Distinct from 09-21-001 (player turn-start modifier HP). Sacrifice self-HP is documented as not using `playerTakesDamage` — do not fold.  
EXPECTED_INTERACTION: Any rule that subtracts player HP as “damage” (combat, DoT, hazard step, Mirror Field reflect) spends `shieldHpRef` first, then residual HP, and challenge totals use the residual. Copy that says “next spell hit” is also acceptable if lava/reflect stay raw.  
ACTUAL_INTERACTION: Spell/DoT/melee honour the charm. Environmental walk HP and Mirror Field reflect ignore it.  
SYSTEMS_AFFECTED: Shield Charm, hazards (lava/spikes/thorned/rift), Mirror Field, challenges (Untouchable / under-50), player feedback  
RECOMMENDED_ACTION: Route lava/spike stepper, `applyBattleWalkHazards`, and Mirror Field reflect through `playerTakesDamage` (or extract `absorbShieldThenHp` used by all four). Keep Sacrifice on `loseSelfHp`. Do not change 8–15 / 5-per-extra-tile numbers. Tests: shield 20 + lava 10 ⇒ HP 0 change, shield 10; shield 20 + Thorned path 4 (15) ⇒ HP 0, shield 5; Mirror Field reflect 12 with shield 20 ⇒ HP 0, shield 8; DoT still absorbs (regression).  
AUTONOMY: IMPLEMENT_HELPER_THEN_HAZARD_AND_REFLECT_SITES  
DEPENDENCIES: None. Do not fold Swap landing (08-31-001) or Thorned enemy (09-25-003). Distinct from **#440** Life Drain HP.  
REGRESSION_RISK: MEDIUM — challenge totals must not double-count if `playerTakesDamage` already records; lava death during charm soak must still go through `hpAfterIncomingDamage`.  
VALIDATION_REQUIRED: Helper tests per source; playtest Shield Charm then walk lava / get Mirror Field reflect.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-27-003  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: Dismissing the defeat recap during the Death Realm 1.5s wait unblocks shrine, ground Doka, and lava walks while deathTriggered blocks a second death  
CATEGORY: death + rewards + hazards + portals + dungeons + persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `persistDeathPenalty` restores HP on the death tick (`deathGuards.ts` 32–34). Portals (`WorldExploration.tsx` 5979–5987 `shouldBlockPortalDuringPendingDeathRealm`) and new encounters (`11791–11802` `deathRealmPending`) stay blocked while `deathRealmTimerRef` is set. Canvas click/touch only ignore death when `inBattleRef && (deathTriggered || hp<=0)` (`10021–10027`, `10722–10727`). After `cleanupBattle` / exploration HP-watch, `inBattle` is false, so the death clause is a no-op. Recap overlay blocks while `battleSummary != null` (`App.tsx` 507, 527–530 `onClose` nulls it immediately). `shouldIgnoreWorldInputDuringRecap` then sees `(false, victoryPersistPending)` — defeat is not a victory persist, so Continue re-opens world walks. WX already comments that a dismissed recap must not queue leftover RAF onto an enemy (`13360–13362`) and only clears the in-flight path + encounter gate. Shrine (`11303–11320`) and ground Doka (`11366–11398`) still enqueue `persistDokaCreditResult`; lava (`11428–11432`) still subtracts HP. `deathTriggeredRef` stays true until the timer arms `armDeathGuards` (`13378–13381`), so a second lava drop to 0 does not re-enter the death handler (`13387`). Distinct from closed victory persist-pending (`victoryPersistPendingRef`). Distinct from 09-26-002 (unpaid 20/40 **honour** on those credits). Distinct from **#604** (Death Realm **pending gate** on claim/GameKey — different predicate).  
EXPECTED_INTERACTION: While the Death Realm timer is pending, world clicks must not walk hazards, claim shrine/ground Doka, or start another death. Portals/encounters already follow that rule. HUD heal/shop may stay live.  
ACTUAL_INTERACTION: Overlay click-through is closed; Continue re-opens loot and lava under a death that cannot fire again.  
SYSTEMS_AFFECTED: Death Realm timer, recap dismiss, shrine altar, ground Doka, lava/spikes, death guards, persist lock  
RECOMMENDED_ACTION: Pass `isDeathRealmTransitionPending(deathTriggered, timer!==null)` into both canvas gates (same pattern as `shouldIgnoreWorldInputDuringRecap`’s second arg) and into shrine/ground claim. Do not change `persistDeathPenalty` math or the 1.5s delay. Tests: pending timer + `battleRecapOpen=false` ⇒ walk/shrine/loot no-ops; after `armDeathGuards` walks work. Do not clone **#604**.  
AUTONOMY: IMPLEMENT_ONE_GATE_AT_CLICK_AND_CLAIM  
DEPENDENCIES: None. Distinct from 09-26-002 honour. Do not fold victory persist-pending.  
REGRESSION_RISK: LOW — post-realm walks must still work after `armDeathGuards`; recap Continue after the map swap must not stay blocked.  
VALIDATION_REQUIRED: Helper test for death-realm-pending world input; playtest dismiss-defeat-recap-then-lava before the realm loads.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-09-27-004  
SOURCE_AUTOMATION: Mechanic Interaction Matrix Auditor  
TITLE: loot_10_doka ticks on unsynced pickup claims and the world check only runs when mapsVisited changes  
CATEGORY: achievements + rewards + persistence + dungeons  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Ground pickup claims the id then enqueues persist (`WorldExploration.tsx` 11366–11395). On `settle.kind === "release"` the id is returned for retry — but `groundDokaPickupCountRef` already incremented and wrote localStorage (`11396–11407`) before the await. A later retry increments again for the same coin. The out-of-battle achievement effect (`2260–2283`) only inspects `groundDokaPickupCountRef >= 10` **inside** `if (mapsVisited !== prev.mapsVisited)` — a tenth pickup with no map change never calls `checkAndFireAchievement("loot_10_doka")`. Victory does include it (`victoryAchievements.ts` 33; WX 12486). Distinct from `doka_1000` / `doka_10000` defer-until-credit (AGENTS.md / 09-25-004 unpaid honour). Distinct from 09-26-002 (wallet honour, not feat counter). No test asserts pickup 10 without a map visit, or release-then-retry count.  
EXPECTED_INTERACTION: `loot_10_doka` counts **committed** ground pickups and can unlock on the 10th commit without waiting for a portal. A failed persist must not increment. Victory still awards if the count is already 10.  
ACTUAL_INTERACTION: Failed credits inflate the counter; world unlock waits on an unrelated `mapsVisited` identity change.  
SYSTEMS_AFFECTED: ground Doka, achievements (`loot_10_doka`), persistence (one-shot settle), recap victory feats  
RECOMMENDED_ACTION: Increment the counter only on `settle.kind === "commit"` (same block as `creditLiveDoka`). Fire `loot_10_doka` when the counter crosses 10 (pickup effect), not only when `mapsVisited` changes. Do not change `applyRewards` or `doka_1000` deferral. Tests: 9 committed + 1 release ⇒ count 9; 10th commit ⇒ unlock without mapsVisited bump; victory path still lists the condition at 10.  
AUTONOMY: IMPLEMENT_COUNTER_ON_COMMIT_THEN_CHECK  
DEPENDENCIES: None. Do not fold unpaid-death honour (09-26-002 / 09-25-004). Distinct from shrine `shrineAchievementRef` (no live condition on this HEAD).  
REGRESSION_RISK: LOW — victory listing must not double-toast (`achievementsShownRef`).  
VALIDATION_REQUIRED: Counter unit around settle kinds; playtest 10 pickups on one map.  
STATUS: NEW  

---

## Focus non-findings / CLOSED (this run — do not invent)

- **Shell Armor / Reflect Shield × DoT / summon melee.** Absorb/halve lives only in `applyDamageToEnemy` (`castHelpers.ts` 347–376); `enemyTakesDamage` does not. On this HEAD `pickBossKitSpell(..., new Map())` (09-22-001) never reaches `LARVAE_SPAWN`, so `shellArmorActive` stays false. Downstream of 09-22-001 / 09-22-004 / **#382** — do not file as live.
- **Boss minion `enemyHpMap[id]=20` vs store formula HP** (`WorldExploration.tsx` 16105–16189). Unreachable until 09-22-001 lets `res.spawns` fire. Do not file.
- **Summons × portals — CLOSED** for occupy/path/cleanup (09-26 non-finding). Spawn still slides off portals via `unsealProgressionOccupants`; that is occupancy, not lava.
- **DoT / plague × last-hostile victory — CLOSED.**
- **Death × leftover summons / challenge pay — CLOSED.**
- **Spell discovery / observation × battle failure — no live observe path.**
- **Blood Moon 1.25× / Mirror Field 20%** — wired in `resolvePlayerCast`. Announce is flavour for “all damage.” Mirror Field **bypass of Shield Charm** is 002, not a new Blood Moon skip.
- **Gravity Well / Fog of War** — unused `_is*` placeholders. Do not re-file.
- **Push / pull × hazards** — still unwired (08-31-005 REPORT_ONLY).
- **Paper Windstorm rate vs announce** — PXA-owned.
- **`applyRangeModification` unused** — no live writer. Do not re-file.
- **Time Warp — wired** (15s).
- **Shield Charm × spell / DoT / melee — CLOSED** (those paths already absorb). The hole is environmental + Mirror Field (002).
- **Victory recap persist-pending × lava — CLOSED.** Defeat recap dismiss during Death Realm wait is 003.
