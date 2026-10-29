# World, Dungeon & Encounter Admin Designer — 2026-10-29

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-3720a0fe-805e-4a75-8618-aa9c78041f87`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-28 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) … [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-27.md`](https://github.com/Mr-Melic/stralt/pull/1183) — queued, not on `main`.
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-28.md`](https://github.com/Mr-Melic/stralt/pull/1236) — WDD wave 19 / FSN drop 19 / elite 19 / Table R / Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab compose; leftover spell-level keep remount `upgradeSpell` skip (`WDEAD-2026-10-28-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 20, FSN drop 20, elite wave 20, and Rush Table S because those same-calendar-day siblings were unread at that freeze.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-29.md`](./ACTION_IDS_WDEAD_2026-10-29.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDEAD-2026-10-24-*`, `WDEAD-2026-10-25-*`, `WDEAD-2026-10-26-*`, `WDEAD-2026-10-27-*`, `WDEAD-2026-10-28-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **readable wave-20 / drop-20 / elite-20 / Table S siblings opened after #1236 froze**, plus occupancy unseals and remount rails that did not exist when that freeze listed occupancy through #1213 and remount spies through #1215.

Do **not** invent WDD wave 21, FSN drop 21, elite wave 21, or Rush Table T. Same-calendar-day #1218 (EBA re-audit) and later 10-28 docs siblings stay consume-only. Do not restack `worldFeatures.ts`. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / #1114 / #1172 / **#1235** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** / **#1064** / **#1114** / **#1172** / **#1235** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-20 ids**, do not overlay from Admin, do not restack that file in this program.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 482–498; `TABS` 5610–5626). Save is still live.

Required owner surfaces (still missing; contract lives in the 08-31 brief):

| Surface | Owner must manage | Live today |
| :--- | :--- | :--- |
| Encounters | enemy pools, formations, relative difficulty, rarity, objectives, rewards, hazards, rules | Scatter 1..8 + depth extras; no formation / rarity / rule / encounter-bound objective |
| Dungeons | room pools, sequencing, special rooms, rest rooms, branching, bosses, modifiers, rewards | Depth extras freeze at 5; rest is a world portal, not a room |
| Boss Rush | boss pools, relative scaling, progression, reward multipliers, room sequencing | 10 hardcoded pairs; `_rewardMultiplier` unused; canister `roomIndex > 9` rejects |
| World events | eligibility, rarity, hazards, elites, rare spell-bearing enemies, rewards, modifiers | Dual-roll 22 modifiers; `worldFeatures` not imported by WX |
| Spawn | relative enemy-level distribution, equal/above/elite/variant probabilities, encounter size, family weighting, advanced-spell / AI sophistication probability | Four unlabeled tier buckets; 30% equal-weight seven families; no `isElite` |
| Simulation Lab | hypothetical player level, many generated encounters, relative-level / family / variant / elite / AI / rare-spell / formation / difficulty report; never writes player / reward / progression / economy | No tab. Do not promote `longHorizonSim` or `mapGen.simulate` |

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, a GameKey Doka keep, a Boss Rush Doka keep, or a spend keep, add feat / GameKey onto Play-entry Doka after those keeps, write Play-entry leftover XP after a leftover-XP / portal-XP / victory-XP-throw keep then feat / GameKey / rename, write Play-entry leftover XP after a one-shot Doka settle following a leftover / portal-throw / victory-throw keep, write Play-entry Doka after a portal persist following a victory / one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keep, retry `upgradeSpell` after a leftover spell-level keep whose replica already advanced, retry `upgradeSpell` after a leftover spell-level **map** keep whose replica already advanced a prior spell, overwrite the spell bar from stale Play-entry after a leftover bar keep, or wipe inventory after a shop `saveBattleStats` throw-after-accept that already paid Doka.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / #932 / #1015 / #1050 / #1128 / #1183 / **#1236** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / #1114 / #1172 / **#1235** WDD | Waves 4–**20** `WF-*`. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 21. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / #956 / #1005 / #1075 / #1134 / #1176 / **#1237** FSN | Drops 4–**20**. Do not invent drop 21. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / #957 / #1006 / #1056 / #1121 / #1195 / **#1249** EED | Tide…Stave/Ring/Rime/Match. ENC-RUSH-75…78 teach Table R, not Table S. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / #941 / #997 / #1073 / #1138 / #1189 / **#1248** elite | Waves 4–**20**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 21. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / #951 / #1004 / #1080 / #1139 / #1170 / **#1244** boss bible | Tables C–**S**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table T. |
| #846 … #1213 occupancy | Spike through Shift Slab. **10-22-005 … 10-28-005 already own those epochs.** |
| **#1229** Raise Slab / **#1258** Ratchet Cog / **#1265** Turnstile Ember / **#1275** Twin Sparks | **New occupancy epoch after Shift Slab.** Unique-corridor Raise Slab plants snap **off**. Unique-corridor Ratchet Cog / Turnstile Ember / Twin Sparks dests **stay**. |
| #847 … #1215 remount | **10-22-006 … 10-28-006 already own those spies.** |
| **#1239** leftover spell-level keep **map** / **#1268** leftover spell-bar keep / **#1276** inventory keep after shop throw | **New remount spies after #1215.** Distinct stamp keys. |
| #1250 LHIPS | Do **not** promote to Admin Simulation. |
| #1218 / later EBA, #1240 AEE, #1230 AFDA, #1221 Expansion, #1251 SPELL_PROPOSALS, #1255 SDE | Consume. Do not duplicate. AFDA still labels Tiers leftover and unused Rush multiplier — honesty only. Do not re-issue `WDEAD-2026-09-02-002`. |

---

## 1. Re-audit: still true on `0f5363f`

| Contract | Still true? | Live evidence |
| :--- | :--- | :--- |
| No owner pack / lifecycle | Yes | 15 tabs (`AdminDashboard.tsx` 5610–5626). No Encounters / Dungeons / World Events / Spawn / Simulation / Drafts. |
| Closed 9999 eligibility | Yes | `DEFAULT_ELIGIBILITY_LEVEL_MAX = BigInt(9999)` (`AdminDashboard.tsx` 138). Region match `level <= Number(r.levelMax)` (WX 3702). `WDEAD-2026-09-02-001` stays. |
| Relative spawn knobs missing | Yes | Tiers four buckets. Preview `SAMPLE_LEVELS = [1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `pickEnemyLevelFromTiers` `maxTier = Math.floor(999 / ts)` (`combatMath.ts` 58). `FAMILY_VARIANT_CHANCE = 0.3`, seven `FAMILY_TYPES` (`spawnPolicy.ts` 35, 49–57). Depth extras freeze at 5 (`DUNGEON_SPAWN_DEPTH_CAP`, `spawnPolicy.ts` 26–29). |
| Simulation Lab missing | Yes | No tab. `mapGen.simulate.ts` is solvability. `longHorizonSim.ts` is LHIPS (`#1250`) — not the lab. |
| Boss Rush 10 rooms + unused multiplier | Yes | `BOSS_RUSH_ROOMS` 10 pairs (`useBossRush.ts` 24–135). `_rewardMultiplier` unread (209–243). `completeBossRushRoom` `roomIndex > 9` (`main.mo` 3317). |
| Dual-roll 22 modifiers | Yes | WX does not import `worldFeatures`. `LATEST_CATALOG_WAVE = 3` on `main` (`worldFeatures.ts` 115). |
| `WDEAD-2026-08-31-013` dungeon Doka | PARTIAL | `dungeonDokaMultiplierFor` unified; freeze at depth 5 remains. Do not re-issue 013. |

Do not re-issue 10-28-001 if `enabledWaves` still cannot name 19. Do not re-issue 10-28-002 if FSN drop 19 / ENC-TEACH-19 / ENC-SCORE-01 / ENC-RUSH-71…74 still uningested. Do not re-issue 10-28-003 if `FAMILY_TYPES` is still seven / trideca still illegal at cap 2. Do not re-issue 10-28-004 if R still cannot exist without `roomIndex > 9`. Do not re-issue 10-28-005 if Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab compose is still missing. Do not re-issue 10-28-006 if leftover spell-level keep remount `upgradeSpell` skip is still unspied.

---

## 2. WDD wave 20 — owner `enabledWaves` still cannot name 20

Queued **#1235** (`WDD-2026-10-28-001`) unions waves 4–19 and adds wave 20. Sixteen ids, remaining-MP-equals-max-MP axis (not remaining-AP-equals-max-AP / remaining-MP-0 / remaining-AP-equals-remaining-MP):

| Id | Name | Distinct axis |
| :--- | :--- | :--- |
| `WF-HAZ-POISE_SEAM` | Poise Seam | step tax only while remaining MP equals max MP |
| `WF-HAZ-POISE_CINDER` | Poise Cinder | hunts a currently full-stock MP unit |
| `WF-TRP-POISE_PLATE` | Poise Plate | first full-stock enter taxes |
| `WF-TER-POISE_PANE` | Poise Pane | walkable LoS pane, 1 AP smash only while remaining MP equals max MP |
| `WF-OBS-POISE_SILL` | Poise Sill | end-turn unlatch while remaining MP equals max MP |
| `WF-ZON-POISE_FONT` | Poise Font | poised heal at remaining MP equals max MP |
| `WF-TEL-POISE_STEP` | Poise Step | poised pads while remaining MP equals max MP before the 1 MP |
| `WF-PRT-POISE_GATE` | Poise Gate | skip-MP extra portal; **exploration-only** |
| `WF-INV-POISE_FILE` | Poise File | two elites; first AP-locked until the second dies **or** you end with remaining MP equal to max MP; counts as hostiles |
| `WF-ELT-POISE_PICKET` | Poise Picket | elite stands while remaining MP equals max MP; **stands from map start in dungeon / boss rush** |
| `WF-TRS-POISE_CACHE` | Poise Cache | chest opens only while remaining MP equals max MP |
| `WF-SPL-POISE_TUTOR` | Poise Tutor | poise live teach at remaining MP equals max MP any distance |
| `WF-RSK-POISE_OATH` | Poise Oath | voluntary cash-out-poise wager at credit |
| `WF-MOD-POISE_CAST` | Poise Cast | SpellConfig legal only while remaining MP equals max MP before the spend |
| `WF-EVT-POISE_HOUR` | Poise Hour | end-poised-at-least-once event |
| `WF-ENV-POISE_DRAFT` | Poise Draft | poised end-turn tax unless any MP was spent |

Owner `enabledWaves` still cannot name 10–19 on `main`; that stays `WDEAD-2026-10-24-001` / `WDEAD-2026-10-26-001` / `WDEAD-2026-10-27-001` / `WDEAD-2026-10-28-001` (and the earlier 10/11/12/13/14 IDs). This run only adds **20**. Until VALIDATE, wave 20 stays data. Death Realm stays quiet. Poise Gate stays exploration-only with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow / Stride / Near / Ready / Match.

---

## 3. FSN drop 20 + EED Stave/Ring/Rime/Match

Queued **#1237** packs Wave **19** families as drop-20 combination sheets (`docs/design/ENEMY_FORMATIONS_2026-10-28.md`). Sixteen proposed ids: `FSN-SESTET-STEP`, `FSN-SESTET-SIP`, `FSN-TERN-OCTA`, `FSN-MIRE-DIAG`, `FSN-SESTET-GATE`, `FSN-SPAWN-PRIME`, `FSN-SLIDE-CAP`, `FSN-WATCH-THIN`, `FSN-SESTET-CHOIR`, `FSN-GAIT-TERN`, `FSN-SESTET-QUIET`, `FSN-PSALM-SESTET`, `FSN-TIERCE-VERSE`, `FSN-ODD-BRICK`, `FSN-PURSE-SESTET`, `FSN-SESTET-HOLD`. Skip Trideca Plug until remaining cap ≥ 13; live cap is 2 (`FSN-SESTET-HOLD/TRIDECA`). Dual Keep **cannot** open Sestet (leftover-sum 6 **and** unequal — 2/2 is Poise, 3/3 is Poise, 3/2 is Stave). Never PAIR `sestet_holder` + `must_sesteter`. Never PAIR Cadence Tern + Cadence Tierce. Wave 20 families stay deferred.

Queued **#1249** (`EED-2026-10-28-001`) is the 20th-day encounter catalog. It spends leftover **drop-19** packs + Wave 19 world features + Rush Table **R** rooms R0–R3. Pacing: `ENC-TEACH-20` + `ENC-SPELL-39` → `ENC-WAVE-21` → `ENC-STAVE-01` / `ENC-FIVE-01` / `ENC-RING-01` → `ENC-BRANCH-20` → `ENC-BOSS-20` → `ENC-RUSH-75`…`78`. `ENC-RUSH-75`…`78` teach Table **R**, not Table S. Does **not** consume same-day Wave 20 families / FSN drop 20 / WDD wave 20. `WF-PRT-MATCH_GATE` rest/overworld only. Hold `FSN-STAVE-HOLD/DODECA` while cap is 2. Honesty rerolls to day-19 rooms.

Owner ingest unions those catalogs. Do not concatenate FSN / ENC files. Do not overlay until VALIDATE.

---

## 4. Elite wave 20 — still seven live `FAMILY_TYPES`; Tetradeca illegal at cap 2

Queued **#1248** proposes 32 world-pack families (`septet_mender` … `idle_plater`, including `tetradeca_prelate`). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20; `spawnPolicy.test.ts` 276–287). Tetradeca Span counts as **14** — skip `tetradeca_prelate` until remaining cap ≥ 14. Septet Post (`septet_prelate`, `summonAI: "septetpost"`) counts as **1** and is legal at remaining ≥ 1. Dual Keep cannot fake leftover-sum 7; odd sum never ties. Extra doors stay `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `court_quarte_regent` / `hook_precentor` / `hook_fold_regent` (not family ids). Never concatenate `FAMILY_TYPES`. `shove_gifter` fail-closed stays Wave 16. Same-day SPELL_PROPOSALS Wave 20 (#1251) and SDE Wave 19 (#1255 / #1198 camel leftover) stay **Wave 21** family CORE. Do not mint colliding `wave20:` ids as a second `FAMILY_TYPES` array.

Trideca / Sestet skip at cap 2 stays `WDEAD-2026-10-28-003`. This run only adds Tetradeca / Septet Post.

---

## 5. Rush Table S — still cannot exist without `roomIndex > 9`

Queued **#1244** adds Wave 21 boss sheets and Rush Table S (additive after Table R). Four proposed pairs:

| Room | Pair |
| :--- | :--- |
| S0 | `sip_visitor` + `gaze_beadle` |
| S1 | `halve_registrar` + `veil_verger` |
| S2 | `odd_penitentiary` + `cinder_lance` |
| S3 | `sill_suffragan` + `goad_pretender` |

Live canister still `if (roomIndex > 9) { return #err("roomIndex must be 0-9") }` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not restack Bone on S3. Do not invent Table T. Extra Rush tables N–R without `roomIndex > 9` stay `WDEAD-2026-10-24-004` / `WDEAD-2026-10-26-004` / `WDEAD-2026-10-27-004` / `WDEAD-2026-10-28-004`. This run only adds **S**. ENC-RUSH-75…78 (#1249) teach Table R, not these pairs. Do not remap `halve_precentor` to `halve_registrar`. Crosier never occupies the Lavabo; Cowl never occupies the Diurnal; lance glow never occupies the Amice; Crown never occupies the Jamb.

---

## 6. New occupancy epoch after Shift Slab — Raise Slab / Ratchet Cog / Turnstile Ember / Twin Sparks

`WDEAD-2026-10-28-005` named Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab and froze occupancy at #1213. After #1236:

- Queued **#1229** snaps Raise Slab (`WF-TER-RAISE_SLAB`; `occupancyRaiseSlabUnseal.ts`). One 1 AP adjacent floor→wall pry (cannot lower). Unique-corridor dests snap **off** at plant (evaluate solvability as if already a wall). Occupied / destacked-player dests on a dual path **stay** (walkable until raised). Raise onto a unique corridor / portal / void / leftover crumb / occupied body stays painted as floor (drop the pry). Unique vs `#1013` walk-blockers (immediate wall), `#1127` Spent Bridge (three leaves), `#1154` Cinder Barrel (1 AP roll of an existing wall), `#1209` Hourglass Arch (three round-starts), `#1213` Shift Slab (two-cell oscillating wall pair).
- Queued **#1258** snaps Ratchet Cog (`WF-HAZ-RATCHET_COG`; `occupancyRatchetCogUnseal.ts`). One walkable HP-tax cog on two adjacent painted floor cells; swaps every round start. Unique-corridor / destacked-player / occupied dests **stay**. Drop leftover-island pairs. Swap onto portal / void / leftover crumb stays (drop the swap). Occupied rest **swaps** (landing tax). Unique vs `#1071` Orbiting Cinder (4-cycle square), `#1086` Gutter Steam (two vents), `#1201` Pendulum Censer (5-tile reverse), `#1213` Shift Slab (wall pair).
- Queued **#1265** snaps Turnstile Ember (`WF-HAZ-TURNSTILE_EMBER`; `occupancyTurnstileEmberUnseal.ts`). One walkable HP-tax ember on a 4-arm plus; rotates 90° clockwise each round start. Unique-corridor dests **stay** when all four arms are fight-graph floor. Drop leftover-island pluses. Rotate onto portal / void / leftover crumb stays. Unique vs `#1071` filled 2×2 (Manhattan-1 hops) and `#1258` 2-cell adjacent swap. Hollow is not painted and is not a cut.
- Queued **#1275** snaps Twin Sparks (`WF-HAZ-TWIN_SPARK`; `occupancyTwinSparksUnseal.ts`). Two walkable HP-tax orbs on opposite cells of a 4-tile orthogonal line; swap onto the other opposite pair each round start (0+2 ↔ 1+3). Unique-corridor dests **stay** when all four cells are fight-graph floor. Drop leftover-island lines. Opposite orbs are Manhattan 2. Unique vs `#1086` even/odd vents in place, `#1258` one cog Manhattan 1, `#1265` one ember plus Manhattan 2.

None of these helpers is wired from WorldExploration / `worldFeatures.ts` / `useBossSystem` / `simulate.ts`. Live `generateEnemies` still scatters.

VALIDATE epoch after 10-28-005 shift-slab: **raise-slab unseal → ratchet-cog unseal → turnstile-ember unseal → twin-sparks unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #1229 / #1258 / #1265 / #1275 to keep keep-clear art.

---

## 7. New remount spies — leftover spell-level keep map, leftover spell-bar keep, inventory keep after shop throw

`WDEAD-2026-10-28-006` named leftover spell-level keep remount `upgradeSpell` skip (#1215 single stamp). It did **not** name:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#1239** | `spellLevelKeepMapRemountWriteSkip.ts` | `pbv_spell_level_keep_map_remount_slotN` | `{ levels: { [spellId]: preLevel } }` so a later upgrade of a **different** spell cannot clobber the first keep. Remount skips `upgradeSpell` per stamped id when replica > Play-entry. Distinct from #1215 last-stamp-wins. |
| **#1268** | `spellBarKeepRemountWriteSkip.ts` | `pbv_spell_bar_keep_remount_slotN` | `{ order: string[] }` at the optimistic / debounce-schedule tick. Remount hydrate honours the stamp over stale Play-entry / `getCharacter`. Not a wallet writer. Distinct from #1215 / #1239 levels. |
| **#1276** | `inventoryKeepRemountWriteSkip.ts` | `pbv_inventory_keep_remount_slotN` | After a shop `saveBattleStats` throw-after-accept, stamp paid items so remount does not leave inventory 0 after Doka already left the replica. Heal (no itemId) must not stamp. Explicit `#err` must not stamp. Distinct from #964 Doka-throw keep and #860 HP-throw. |

Lab occupancy replay stays generate → destack → … → shift-slab (10-28-005) then **raise-slab → ratchet-cog → turnstile-ember → twin-sparks**, all React-free. Reports add `raiseSlabUnseal` / `ratchetCogUnseal` / `turnstileEmberUnseal` / `twinSparksUnseal` / `spellLevelKeepMapRemount` / `spellBarKeepRemount` / `inventoryKeepRemount`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-28-006 **plus** #1239 / #1268 / #1276), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, a leftover remount `upgradeSpell` retry after replica level already advanced **any** stamped spell, a leftover remount spell-bar overwrite from stale Play-entry, and a leftover remount inventory wipe after a paid shop throw.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` (#1250) or `mapGen.simulate` as the lab.

---

## 8. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–20 / drops 10–20 / elite 10–20 / Tables J–S / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 21 / FSN drop 21 / elite 21 / Table T.

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-29-001 | Owner `enabledWaves` must name 20 (union ingest of WDD wave 20) | P1 |
| WDEAD-2026-10-29-002 | Ingest FSN drop 20 and EED Stave/Ring/Rime/Match; ENC-RUSH-75…78 teach Table R, not Table S | P1 |
| WDEAD-2026-10-29-003 | `FAMILY_TYPES` stays seven; skip `tetradeca_prelate` while remaining cap &lt; 14; Septet Post legal at remaining ≥ 1 | P1 |
| WDEAD-2026-10-29-004 | Rush Table S must exist without `roomIndex > 9` | P1 |
| WDEAD-2026-10-29-005 | Encounter formations must compose with Raise Slab / Ratchet Cog / Turnstile Ember / Twin Sparks unseals after the Shift Slab epoch | P1 |
| WDEAD-2026-10-29-006 | Simulation Laboratory spies leftover spell-level keep map, leftover spell-bar keep, and inventory keep after shop throw, and reports raise-slab / ratchet-cog / turnstile-ember / twin-sparks columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-29.md`](./ACTION_IDS_WDEAD_2026-10-29.md).
