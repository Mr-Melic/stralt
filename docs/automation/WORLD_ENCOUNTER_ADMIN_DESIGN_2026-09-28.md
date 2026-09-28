# World, Dungeon & Encounter Admin Designer — 2026-09-28

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-9f35a03a-242d-4ac0-a057-727a07650163`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-27 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy, dual depth-5 freeze (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](https://github.com/Mr-Melic/stralt/pull/394) — wave-4 mix, family HP wipe, EED day-4 + FSN drop-4 ingest, `copyLastCast`, Rush Table C, lab 100k, elite second-roll (`WDEAD-2026-09-22-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/451) — wave-5 mix, `bindWhileAlive`, EED day-5 + FSN drop-5, Rush Table D, elite wave 5 + `wRare`, portal-ring last-resort, Crush vs 999 pack (`WDEAD-2026-09-23-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-24.md`](https://github.com/Mr-Melic/stralt/pull/534) — waves 6–7, `hushOnKill` / `stealAndDisarm`, FSN drop 6, Rush Tables E–F vs `roomIndex > 9`, elite wave 6, preferred-room snap + leftover portal floor, relative encounter objectives (`WDEAD-2026-09-24-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-25.md`](https://github.com/Mr-Melic/stralt/pull/593) — `whiteSanctuary`, relative summon offset, EED Ley/Gale/Face + FSN 7–8, Rush Table G + jackpot `complete(9)`, elite 7–8 second roll, white-split occupancy, small-side size, wave 8 + `vowSilence` (`WDEAD-2026-09-25-001` … `008`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/615) — destack/wander dump compose, Death Realm pending persist quarantine, modifier id/type VALIDATE, lab wander epoch (`WDEAD-2026-09-26-001` … `004`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/684) — wave 9 mix + `glyphPickup`, EED Hug/Boot/Write/Dull + Purse/Hinge/Gait and FSN drops 9–10, elite wave 9 second roll, Rush H0–I3 vs `roomIndex > 9`, dump-floor-2 / choke / joint-cut compose, seeded pool VALIDATE, lab keep-then-additive spy (`WDEAD-2026-09-27-001` … `007`). **Queued, not on `main`.** Explicitly deferred WDD wave 10 until the overlay ids were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-28.md`](./ACTION_IDS_WDEAD_2026-09-28.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and occupancy/admin rails after #684** (WDD waves 10–11, elite wave 10, knockback/swap/ignore-walls/ghost-raster unseals, last-live `adminSetMapModifierChance`, death-cut remount skip, live vs empty-hook modifier honesty) would be forked if the owner pack were implemented from 09-27 alone.

Do **not** invent WDD wave 12, FSN drop 11, elite wave 11, or Rush Table J. No same-day FSN / EED / Rush-bible sibling exists after #669 / #672 / #663. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / **#719** land. **#680** / **#719** restack `worldFeatures.ts` (`mergeable_state: unstable`) — consume the **readable wave-10 / wave-11 ids**, do not overlay from Admin, do not restack that file in this program. Same-day **#716** corrects empty-registry vs live WX flags for Blood Moon / Mirror Field.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 483–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, or replay death-cut `saveBattleStats` after a later confirmed credit.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / **#684** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / **#719** WDD | Waves 4–**11** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). #680 types `1…10`; #719 types `1…11` / `LATEST_CATALOG_WAVE = 11` and **conflicts** on `worldFeatures.ts` — ids below are from those PRs’ unique deltas, not a restack. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 FSN | Drops 4–**10**. Do not invent drop 11. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 EED | Tide…Gait `ENC-*` rooms. No 09-28 encounter catalog. |
| #349 / #405 / #452 / #535 / #558 / #625 / **#686** elite | Waves 4–**10** family sheets. Second roll. Never concatenate `FAMILY_TYPES`. Skip `quad_prelate` while `ENEMY_SUMMON_CAP` is 2. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 boss bible | Tables C–**I**. Jackpot `complete(9)` stays mandatory (`#536`). Do not invent Table J. |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split / portal-seeded destack / generate-time occupied-alcove dump. **09-25-006 already owns these.** |
| #589 / #600 / #603 destack dump | Battle-start destack sits hostiles on generate-time dump cells. **09-26-001 already owns these.** |
| #591 / #608 wander dump | Free dump punch when wander occupies dump cells. **09-26-001 / 09-26-004 already own these.** |
| #628 / #648 / #651 / #656 | Wander/destack dump floor 2, choke-pocket snap, joint 2+2 unseal. **09-27-005 already owns these.** |
| **#688** knockback unseal | Dual-path 1+1 knockback landings reserved-slide misses (`occupancyKnockbackUnseal.ts`). Not wired from WX. |
| **#697** swap unseal | Player↔enemy `swapPositions` that seal the last exit (`occupancySwapUnseal.ts`). Wave 10 **Far Swap** is this class. |
| **#704** ignore-walls unseal | Chessboard Lich rotate/mirror and knight-leap wall landings (`occupancyIgnoreWallsUnseal.ts`). Rush room 6. |
| **#711** ghost/minion raster | Snap ghost/scroll/phantom / `TELEPORT_ADJACENT` onto the fight graph (`occupancyBossSpawnUnseal.ts`). Not wired. |
| #576 / #595 / #602 / #604 Death Realm pending | Skip heal / Items / rename / `upgradeSpell` / feat / GameKey while the timer is pending. **09-26-002 already owns eligibility.** |
| #605 / #626 / #650 modifier pool | Identity + seeded hard-delete + last-row retire. **09-26-003 / 09-27-006 already own these.** |
| **#703** last-live chance | `adminSetMapModifierChance(id, 0)` empties the last seeded live row. Full-row guard (#650) does not cover this endpoint. |
| **#674** / **#716** registry docs | Empty `mapModifierRegistry` hooks for `blood_moon` / `mirror_field` are **not** the live rules — WX flags still apply ×1.25 / 20% reflect. `gravity_well` / `fog_of_war` really are unused. |
| **#698 / #705 / #710** death-cut persist | Skip `saveBattleStats` wipe after death-cut then confirmed credit / remount replay. Lab spy. |
| #657 persist | Keep-then-additive feat/GameKey. **09-27-007 already owns the spy.** |
| #564 admin UX | SpellSummonFields absolute level. Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 AFDA | Honesty copy. Not owner knobs. |
| #670 / #637 LHIPS | Do not promote to Admin Simulation. |
| #689 AEE | Relative peer sophistication. Spawn AI knob stays 08-31-011 / computeAITier 08-31-001. |
| #707 CRC | Unpublished `WF-*` / `FSN-*` stay design-only. Soft-retire live catalogs. Not a delete license. |
| #683 ground Doka extract | Lab must not import the extracted spawner to mint. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 09-27 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). Region match is still a closed interval (`WorldExploration.tsx` 3702). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44; `EXISTING_MAP_MODIFIER_IDS` 1890–1913 includes announce-only ids). Registry is a documented three-roll (`mapModifiers.ts` 646–694). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1768–1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject. `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start (`WX` 11970–11974 `calcEnemyMaxHp(e.level)`). Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute (`under_15_turns`, `under_50_damage`, `under_8_ap_per_turn` — `challengeCompletion.ts` 44–109). Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. `enabledWaves` still cannot name 8, 9, **or 10** on `main`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Destack/wander **free** dump compose, Death Realm pending quarantine, modifier id/type identity, lab wander epoch. Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Wave 9 mix, FSN 9–10 / EED ingest, elite 9 second roll, Rush H/I, dump-floor-2 / choke / joint, seeded pool, keep-then-additive spy. Do not re-issue. Wave 10 / knockback-swap-Lich-ghost / chance-0 endpoint / announce-only honesty / death-cut remount spy are **this** run. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5743; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES`. Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`.

---

## 2. Wave 10 exists now — owner `enabledWaves` must name it

`WDEAD-2026-09-27-001` named wave 9 (`#613`) and **refused to invent wave 10** because #680 conflicted on `worldFeatures.ts` and the ids were not yet treated as readable. Queued **#680** (`WDD-2026-09-27-001`) now adds 16 overlay ids and types `CatalogWave = 1 … 10` / `LATEST_CATALOG_WAVE = 10` on the **same** `WORLD_FEATURES` array. On `main` the type is still `1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). `pickWeightedFeatures` still does not take a wave (`worldFeatures.ts` 1853–1869). `MAX_ROLLED_FEATURES = 3` (32). WX still does not import the catalog.

Wave 10 ids (one per requested category; unique delta of #680, not a restack of #613):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-RETRACE_DUST` | Retrace Dust | First visit this turn free; same-cell retrace taxes |
| `WF-HAZ-CINDER_PLUMB` | Plumb Ember | 4-tile vertical fall + wrap |
| `WF-TRP-KIN_PLATE` | Kin Plate | First step taxes unless an allied summon is orthogonally adjacent |
| `WF-TER-RAISE_SLAB` | Raise Slab | 1 AP pries floor → wall; `blocksWalk` / `requiresBypass` |
| `WF-OBS-SPELL_SILL` | Spell Sill | Wall until a `SpellConfig` cast this map; Attack Nearest does not unlatch |
| `WF-ZON-COOL_STONE` | Cool Stone | First end-turn banks one cooldown-skip; not a persist write |
| `WF-TEL-FAR_SWAP` | Far Swap | 1 MP swaps with the farthest living unit — compose with **#697** swap unseal |
| `WF-PRT-CLEAN_GATE` | Clean Gate | **Exploration-only.** Extra portal + hard `applyRewards` if **0** challenge HP this map. Inverse of Hearth / Wane / Wager |
| `WF-INV-RETREAT_COLUMN` | Retreat Column | Three marchers. Dungeon / Rush: all three count for map-clear (`extraEnemyCount` 3). Exploration may depart |
| `WF-ELT-SPELL_PICKET` | Spell Picket | Exploration: elite appears only after a spell cast. Dungeon / Rush: stands from map start (required hostiles) |
| `WF-TRS-FULL_CACHE` | Full Cache | 1 AP opens only at ≥90% HP; medium `applyRewards` |
| `WF-SPL-LIVE_TUTOR` | Live Tutor | While they live, player may cast their extra `usableByEnemy` spell **once per round**; kill ends the loan |
| `WF-RSK-MELEE_OATH` | Melee Oath | Next `applyRewards` uses hard multiplier if no `maxRange > 1` spell since the flag |
| `WF-MOD-SLOW_HAND` | Slow Hand | `cooldown === 0` spells cost +1 AP; Attack Nearest unchanged |
| `WF-EVT-CLEAN_HANDS` | Clean Hands | Next `applyRewards` uses hard multiplier if no challenge HP this map |
| `WF-ENV-FILE_WIND` | File Wind | End-of-turn 3% max HP if another living unit shares row or column |

`grantClass` after wave 10 is `none | mapAttune | oneCast | loanOneCast | copyLastCast | bindWhileAlive | hushOnKill | stealAndDisarm | vowSilence | glyphPickup | repeatLoanWhileAlive | markLoanOneCast | observe`. `repeatLoanWhileAlive` is in-memory, this map only, once per round **while the tutor lives** — it must not call `upgradeSpell` or write spell-level arrays. Kill ends the loan and may pay the kill purse through `applyRewards`. Distinct from Loaner Mage (`loanOneCast`), Oath Cantor (`bindWhileAlive`), Grimoire Stalker (`oneCast` on death), Grave Scribe (`glyphPickup`), and Mark Tutor (`markLoanOneCast`, wave 11). Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Death Realm default catalog stays []. Dual-roll of the 22 live modifiers plus overlay remains a VALIDATE fail (`WDEAD-2026-09-01-003`).

Until VALIDATE, do not overlay wave 10 from Admin “to try #680.” Wave 11 is `WDEAD-2026-09-28-007`. Do not restack `worldFeatures.ts` onto #613 / #680 from this program.

---

## 2b. Wave 11 exists now — owner `enabledWaves` must name it

Same-day **#719** (`WDD-2026-09-28-001`) opened while this cron was writing. Ids are readable; do not defer. It types `CatalogWave = 1 … 11` / `LATEST_CATALOG_WAVE = 11` and **conflicts** on `worldFeatures.ts` (same class as #680 vs #613). Consume ids. Do not restack.

Wave 11 ids (one per requested category):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-LATE_SEAM` | Late Seam | Hazard tile |
| `WF-HAZ-RIM_CINDER` | Rim Cinder | Moving hazard |
| `WF-TRP-DASH_PLATE` | Dash Plate | Trap |
| `WF-TER-LOOSE_KEYSTONE` | Loose Keystone | Destructible terrain |
| `WF-OBS-STRIDE_SILL` | Stride Sill | Wall until the player spends MP this map; Attack Nearest does not unlatch |
| `WF-ZON-QUICK_HAND` | Quick Hand | Inverse of Slow Hand: first end-turn banks −1 AP on next `cooldown === 0` spell |
| `WF-TEL-INIT_SWAP` | Init Swap | 1 MP swaps with lowest HP% living unit — compose with **#697** swap unseal |
| `WF-PRT-STILL_GATE` | Still Gate | **Exploration-only.** Extra portal + hard `applyRewards` if `inBattleRef` never set. Inverse of Ash Gate. Distinct from Clean Gate (0 challenge HP) |
| `WF-INV-WOUNDED_FILE` | Wounded File | Two extras on a file (closer bleeds, farther heals). Dungeon / Rush: both count for map-clear (`extraEnemyCount` 2) |
| `WF-ELT-LOW_PICKET` | Low Picket | Exploration: elite present only while current HP < 70%. Dungeon / Rush: stands from map start |
| `WF-TRS-LATE_CACHE` | Late Cache | 1 AP opens only on round 3+ (wander ticks proxy out of battle) |
| `WF-SPL-MARK_TUTOR` | Mark Tutor | Adjacent 1 AP marks; one extra `usableByEnemy` cast while LoS holds; kill does not add a second copy |
| `WF-RSK-SPARE_OATH` | Spare Oath | Next `applyRewards` uses hard multiplier if last player turn left ≥1 AP |
| `WF-MOD-COLD_OPEN` | Cold Open | Inverse of Short Fuse: `cooldown === 0` spells locked round 1 |
| `WF-EVT-VACANT_HOUR` | Vacant Hour | World event |
| `WF-ENV-CORNER_DRAFT` | Corner Draft | Environmental combat |

`grantClass` adds `markLoanOneCast` (in-memory, this map, one total cast after a 1 AP mark **while LoS holds** — never `upgradeSpell`). Distinct from Live Tutor (`repeatLoanWhileAlive`, once per round, no mark). Dual-roll still fails. Death Realm default []. Until VALIDATE, do not overlay wave 11 from Admin. Do not invent wave 12.

---

## 3. Elite wave 10 is ingest, not concatenate — Quad Span stays illegal at cap 2

Queued **#686** (Wave 10 enemy/elite evolution) proposes 32 world-pack families: `shove_mender`, `cadence_stretcher`, `quad_prelate`, `gait_wicker`, `dry_stinger`, `home_stepper`, `must_spanner`, `far_hooder`, `boot_lender`, `quiet_siller`, `exit_stinger`, `purse_keeper`, `tick_plater`, `last_muter`, `pair_slider`, `odd_warder`, `hold_caster`, `unit_oather`, `rebate_warder`, `foe_reeler`, `echo_wiper`, `field_biter`, `wound_marker`, `split_plater`, `first_verser`, `pit_skipper`, `empty_plater`, `kennel_siller`, `chase_mender`, `cadence_staller`, `crown_cutter`, `full_barer`. Extra doors (`shove_cantor`, `stretch_precentor`, `span_quad`, `keep_bursar`, `odd_gallery`, `rebate_nave`, `wipe_gallery`, `mark_court`, `stall_nave`, `about_hinge_regent`, `court_stretch_regent`, `leader_slayer`, `spell_master`) stay elite extras, not `FAMILY_TYPES`. Court Stretch / Pack Tithe / About Hinge stay boss/closed/`ENEMY_ONLY`.

Live elite presentation is still “family variant” at 30% equal weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, `FAMILY_VARIANT_CHANCE = 0.3`). There is no `isElite` flag. Family HP is still discarded at battle start (`WDEAD-2026-09-22-002` — do not re-issue). `ENEMY_SUMMON_CAP` is still **2** (`gameConstants.ts` 300). **Quad Span (`quad_prelate`) counts as 4** — skip until remaining cap ≥ 4 (same class as Triple Plug while cap is 2).

No same-day FSN drop 11 packs these families. Owner Encounter / Dungeon tabs ingest #686 by **id union** when a later FSN drop exists; until then the sheets are elite second-roll data. Duplicate `export function` copies of the same helper fail Caffeine `vite build`. Do not concatenate the 32 ids onto `FAMILY_TYPES`.

---

## 4. New occupancy epochs after dump-floor-2 / choke / joint-cut

`WDEAD-2026-09-27-005` named wander/destack dump floor 2, choke-pocket snap, and joint 2+2 unseal. After #684, map integrity opened four more epochs that formations (Face Court / Span Gate / drop-10 COURT / `WF-INV-RETREAT_COLUMN` / `WF-TEL-FAR_SWAP` / Rush Chessboard Lich / ghost minions) must compose with:

1. **#688** — after reserved unique-bridge slide, unseal dual-path 1+1 knockback / attract landings (`occupancyKnockbackUnseal.ts`). Unique-bridge set is empty on dual-path cuts, so destack/dump/choke/joint no-op.
2. **#697** — after `swapPositions` (including wave 10 Far Swap), unseal the last player→exit route (`occupancySwapUnseal.ts`). Destack/wander/knockback are not a two-body swap.
3. **#704** — snap Chessboard Lich `MAP_ROTATE` / `MIRROR_INVERT` / `ignoreWalls` knight-leap landings onto the **pre-transform** fight graph (`occupancyIgnoreWallsUnseal.ts`). Unique-bridge slide never runs; even/even chess walls trap.
4. **#711** — snap ghost/scroll/phantom raster and `TELEPORT_ADJACENT` onto the fight graph with portals as walls (`occupancyBossSpawnUnseal.ts`). Overworld flood treats portal tiles as floor, so a (0,0) scan parks a required minion on a far-side crumb.

VALIDATE epochs are now: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal → **knockback unseal → swap unseal → ignore-walls unseal → boss-spawn raster snap**. Drop a slot that cannot destack. Do not punch walls; do not hop a portal cut; do not disable those PRs to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program. None of #688 / #697 / #704 / #711 are wired from WorldExploration (destack/wander hunks 3-way on those files).

---

## 5. One world-event catalog must keep a live hooked pool — chance-0 and announce-only

`WDEAD-2026-09-27-006` named emptying / hard-delete of seeded `slime_flood` / `paper_windstorm` via full-row `adminSetMapModifier` (`#626` / `#650`). That rail does **not** cover `adminSetMapModifierChance`.

Queued **#703** (`mapModifierLastLiveChanceRejected`) `#err`s `adminSetMapModifierChance(id, 0)` when that row is the last live seeded modifier. Custom / `gravity_well` chance-0 remains allowed. One seeded row may still go to weight 0 while the other stays live. Owner VALIDATE must refuse the same last-live chance-0 on the pack, not only the Motoko convenience endpoint.

Queued **#674** recorded empty registry hooks for `blood_moon`, `mirror_field`, `gravity_well`, and `fog_of_war` (`mapModifiers.ts` 260–296). Same-day **#716** corrects that empty hooks are **not** the live rules for Blood Moon / Mirror Field: `spellEngine.ts` still applies Blood Moon ×1.25 on non-heals and Mirror Field 20% reflect via WorldExploration flags. **Do not delete those flags** to match the placeholders, and **do not add a second multiplier** on `onDamageDealt`. `gravity_well` / `fog_of_war` really are unused chrome. `rollActiveModifiers` still keeps `active && MODIFIER_BY_ID.has(id)` (`mapModifiers.ts` 667), so unused ids can still occupy roll slots. CatalogNote must distinguish `hookStatus: liveWxFlag | liveRegistry | announceOnly | unused`. Dual-roll still fails (`WDEAD-2026-09-01-003`). Identity mismatch still fails (`WDEAD-2026-09-26-003`). Seeded-pool empty still fails (`WDEAD-2026-09-27-006`).

CRC #707: unpublished `WF-*` / `FSN-*` stay design-only. VALIDATE must not hard-delete the seven live `FAMILY_TYPES`, the 22-id modifier set, or Rush rooms 0–9 in order to “make room” for wave 10.

Until ACTIVATE, do not overlay wave 10 or merge catalogs from Admin “to try #703.”

---

## 6. Simulation Laboratory — still missing; death-cut remount spy and new columns

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #560 / #637 / **#670**). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wander epoch stays a React-free replay (`WDEAD-2026-09-26-004`). Keep-then-additive spy stays `WDEAD-2026-09-27-007`.

New report columns (in addition to 09-27): **`knockbackUnseal`**, **`swapUnseal`**, **`ignoreWallsUnseal`**, **`bossSpawnRasterSnap`**, **`lastLiveModifierChanceZero`**, **`announceOnlyRolled`**, **`deathCutConfirmedCreditReplaySkipped`**, **`catalogWave10Mix`**.

New spy (in addition to 09-21-005 / 09-26-004 / 09-27-007): queued **#698 / #705 / #710** skip `saveBattleStats` after a death-cut catch-commit once a later confirmed credit (ground/shrine/dungeon-complete settle, victory/Rush `newDoka`, feat/GameKey `#ok`, portal +10 XP, `upgradeSpell`/rename spend) moved the lock — including **remount replay** that fetches a stale replica (`deathCutConfirmedCreditReplayWriteSkip.ts`). The lab must not call those writers “to preview unpaid death.” Do not import `#683` ground Doka spawn.

Hypothetical 100_000 remains a preset, not a career cap.

---

## 7. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
                 VALIDATE epochs: generate · destack · destack-dump · destack-occupied-floor-2
                 · choke-pocket · wander-dump · wander-floor-2 · joint-cut
                 · knockback · swap · ignore-walls · boss-spawn-raster
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3 / G0–G3 / H0–H3 / I0–I3)
                 jackpot complete(9) is mandatory before extra tables
                 Chessboard Lich (room 6) compose with ignore-walls unseal
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants (incl. repeatLoanWhileAlive / markLoanOneCast)
                 · hooks (liveWxFlag | liveRegistry | announceOnly | unused)
                 · catalogWave 1–11 · modifier id === type · seeded pool non-empty
                 · last-live chance > 0
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
                 (sophistication stays relative peer — never if (level >= X))
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF) · keep-then-additive spy
                 · death-cut remount spy
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

74. Owner `enabledWaves` can name 10. Clean Gate stays exploration-only. Live Tutor is `grantClass: repeatLoanWhileAlive`. Retreat Column / Spell Picket count as hostiles in dungeon / Rush. Far Swap reports `swapUnseal`. Dual-roll still fails. Do not overlay from Admin. Do not restack `worldFeatures.ts`. Wave 11 is gate 80.
75. Elite wave 10 is a second roll. Extra doors are not family ids. Skip `quad_prelate` while remaining summon cap < 4. Do not concatenate `FAMILY_TYPES`. Do not invent FSN drop 11.
76. Formations compose with knockback unseal, swap unseal, ignore-walls Lich, and ghost/minion raster snap. Sim reports those columns. Floor-2 / choke / joint stay 09-27-005. Far Swap **and Init Swap** call swap unseal. No `mapGen.ts` / RAF hunk.
77. Last-live seeded modifier cannot go to `triggerChance = 0` via the convenience endpoint or the pack. Blood Moon / Mirror Field stay `liveWxFlag` (do not delete WX flags; do not add a second registry multiplier). `gravity_well` / `fog_of_war` stay `announceOnly` / unused. Identity / dual-roll / seeded-pool-empty stay prior IDs.
78. Lab spy includes #698 / #705 / #710 death-cut remount skip. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, `mapGen.simulate.ts`, or `#683` ground Doka spawn.
79. Unpublished wave-10 / wave-11 / elite-10 / FSN / EED catalogs stay data until ACTIVATE. VALIDATE refuses deleting live families, the 22-id modifier set, or Rush rooms 0–9 to “make room.”
80. Owner `enabledWaves` can name 11. Still Gate stays exploration-only. Mark Tutor is `grantClass: markLoanOneCast`. Wounded File / Low Picket count as hostiles in dungeon / Rush. Init Swap reports `swapUnseal`. Do not overlay from Admin. Do not invent wave 12.

---

## 8. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, dump helpers, family HP, or occupancy unseals.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 12, FSN drop 11, elite wave 11, or Rush Table J.
- Do not restack `#680` / `#719` `worldFeatures.ts` onto `#613`.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #560 / #637 / #670 to Admin.
- Do not open a second reward or spell-level writer (including GameKey, feat claim, or death-cut remount `saveBattleStats` from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC / SDE / CRC / AEE IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), 09-25-008 (wave 8), 09-26-001…004, or 09-27-001…007.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump / snap / unseal helpers (`battleStartDump.ts`, `battleStartDumpFloor.ts`, `battleStartFreeDump.ts`, `battleStartOccupiedDumpFloor.ts`, `enemyWanderDump.ts`, `enemyWanderDumpFloor.ts`, `battleStartChokePocket.ts`, `occupancyJointUnseal.ts`, **`occupancyKnockbackUnseal.ts`**, **`occupancySwapUnseal.ts`**, **`occupancyIgnoreWallsUnseal.ts`**, **`occupancyBossSpawnUnseal.ts`**). World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-28-001 | Owner enabledWaves includes WDD wave 10; Clean Gate exploration-only; Live Tutor is grantClass repeatLoanWhileAlive | P0 |
| WDEAD-2026-09-28-002 | Elite wave 10 remains a second roll — skip quad_prelate while summon cap is 2; never concatenate FAMILY_TYPES | P1 |
| WDEAD-2026-09-28-003 | Formations compose with knockback unseal, swap unseal, ignore-walls Lich, and ghost/minion raster snap | P1 |
| WDEAD-2026-09-28-004 | One catalog VALIDATE refuses last-live modifier chance 0 via the convenience endpoint | P1 |
| WDEAD-2026-09-28-005 | Owner World Events distinguish live WX-flag modifiers from empty-hook chrome | P1 |
| WDEAD-2026-09-28-006 | Simulation Laboratory spies death-cut confirmed-credit remount skip and reports the new occupancy / chance / announce columns | P1 |
| WDEAD-2026-09-28-007 | Owner enabledWaves includes WDD wave 11; Still Gate exploration-only; Mark Tutor is grantClass markLoanOneCast | P0 |

Full records: [`ACTION_IDS_WDEAD_2026-09-28.md`](./ACTION_IDS_WDEAD_2026-09-28.md).
