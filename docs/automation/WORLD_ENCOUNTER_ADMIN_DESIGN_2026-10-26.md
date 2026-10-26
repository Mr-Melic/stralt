# World, Dungeon & Encounter Admin Designer — 2026-10-26

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-fefb4ff0-1e86-404e-8cd3-b774c4545ca4`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-25 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) … [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-24.md`](https://github.com/Mr-Melic/stralt/pull/1015) — queued, not on `main`.
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-25.md`](https://github.com/Mr-Melic/stralt/pull/1050) — walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern compose; GameKey / Rush remount rename, feat/GameKey additive after keep stamps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe spy (`WDEAD-2026-10-25-001` … `002`). **Queued, not on `main`.** Explicitly deferred WDD wave 17, FSN drop 17, elite wave 17, and Rush Table P because no readable sibling existed at that freeze.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-26.md`](./ACTION_IDS_WDEAD_2026-10-26.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDEAD-2026-10-24-*`, `WDEAD-2026-10-25-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **readable wave-17 / drop-17 / elite-17 / Table P siblings opened after #1050 froze**, plus occupancy unseals and remount leftover-XP rails that did not exist when that freeze listed occupancy through Hunting Lantern and remount spies through #1043.

Do **not** invent WDD wave 18, FSN drop 18, elite wave 18, or Rush Table Q. Same-calendar-day #1114 (`WDD-2026-10-26-001`) and #1121 (Tally/Rank/Spike/Odd EED) opened after this freeze listed occupancy through #1107; next cron ingests them if still unread here. Do not restack `worldFeatures.ts`. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / **#1064** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** / **#1064** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-17 ids**, do not overlay from Admin, do not restack that file in this program.

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

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, a GameKey Doka keep, a Boss Rush Doka keep, or a spend keep, add feat / GameKey onto Play-entry Doka after those keeps, write Play-entry leftover XP after a leftover-XP / portal-XP / victory-XP-throw keep then feat / GameKey / rename, or write Play-entry leftover XP after a one-shot Doka settle following a leftover / portal-throw / victory-throw keep.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / #932 / #1015 / **#1050** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / **#1064** WDD | Waves 4–**17** `WF-*`. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 18. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / #956 / #1005 / **#1075** FSN | Drops 4–**17**. Do not invent drop 18. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / #957 / #1006 / **#1056** EED | Tide…Poise/Knight/Pit/Spent. ENC-RUSH-63…66 teach Table O, not Table P. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / #941 / #997 / **#1073** elite | Waves 4–**17**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 18. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / #951 / #1004 / **#1080** boss bible | Tables C–**P**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table Q. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| #914 / #920 / #925 occupancy | ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. **10-23-001 already owns these.** |
| #933 / #965 / #970 / #976 occupancy | Adjacent minion / BOARD_CLAIM / Void Rift / generate-time eligibleHazard. **10-24-005 already owns these.** |
| #1013 / #1023 / #1030 / #1038 occupancy | Walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern. **10-25-001 already owns these.** |
| **#1071** Orbiting Cinder / **#1086** Gutter Steam / **#1093** Frost Pane / **#1103** Triune Pads | **New occupancy epoch after hunting-lantern.** Unique-corridor / destacked-player / occupied fight-graph dests stay (walkable tax / walkable LoS / walkable pads). Incomplete Triune trio drops **all** pads. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | **10-22-006 already owns the spy.** |
| #909 / #912 / #918 / #919 remount death-cut after feat / portal-XP / victory-XP / leftover-XP keep | **10-23-002 already owns the spy.** |
| #926 spend keep (shop honour) / #927 parsed-success Doka-heal | **10-23-002 already owns the spy.** |
| #938 / #964 / #969 / #971 / #977 / #979 / #986 / #992 / #1002 | Spend-keep death-cut, shop/heal throw Doka + death-cut, throw heal double-charge, rename after throw / victory / one-shot / feat / spend keep. **10-24-006 already owns the spy.** #987 is a duplicate of #986 — consume, do not fork. |
| #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043 | GameKey / Rush remount rename, feat/GameKey additive after keeps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe. **10-25-002 already owns the spy.** |
| **#1045** portal-XP throw leftover rename / **#1070** victory-XP throw leftover rename / **#1088** / **#1092** / **#1099** one-shot leftover honour after victory-throw / portal-throw / leftover keep | Reads `#767` / `#807` / `#813`. Distinct from those stamps’ heal/shop, death, feat/GameKey, and (for #1045/#1070) from #1041 leftover-credit rename. **#1046 is a duplicate of #1045** — consume, do not fork. **New lab spy.** |
| #334 / #415 / #585 / #741 / #934 / #996 / **#1055** AFDA | Honesty copy. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 / #960 / #1016 / **#1077** LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 / #929 / #980 / **#1049** EBA | Consume, do not duplicate `EBA-*`. |
| #999 / **#1072** AEE | Consume, do not duplicate `AEE-*`. |
| #991 / **#1052** Expansion Director | Consume. Not a WDEAD overlay. |
| #1044 enemy/boss admin | Sibling designer. Consume. |
| #1063 SPELL_PROPOSALS / #1082 SDE | Consume. Wave 18 family CORE, not this pack. |
| #1076 hazard overlay extract | Engine paint split. Consume. Not occupancy compose. |
| #1097 / #1100 Thorned Ground / Void Rift / leftover-walk lava-spike soak | Combat honesty. Consume. Not occupancy. |
| #1083 player data-evolution / #1101 content retirement | Consume. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-25 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras still `DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 29). `dungeonDokaMultiplierFor` still `Math.min(safeDepth, 5)` (`portalRules.ts` 161). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7143). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` through `WDEAD-2026-10-23-001`…`002` | Yes (queued) | Do not re-issue. |
| `WDEAD-2026-10-24-001`…`006` | Yes (queued #1015) | Waves 15–16 / drops 15–16 / elite 15–16 / Table N–O / adjacent-minion / BOARD_CLAIM / Void Rift / eligible-hazard / spend-keep death-cut + throw Doka + throw heal + rename after throw / victory / one-shot / feat / spend keep stay those IDs. Do not re-issue 10-24-001 if `enabledWaves` still cannot name 15 or 16. |
| `WDEAD-2026-10-25-001`…`002` | Yes (queued #1050) | Walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern compose stay 10-25-001. GameKey / Rush remount rename, feat/GameKey additive, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe stay 10-25-002. Do not re-issue 10-25-001 if walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern compose is still missing. Do not re-issue 10-25-002 if GameKey/Rush rename / feat-GameKey additive / leftover-XP feat / portal-XP leftover wipe / leftover-XP rename / victory-XP-throw leftover wipe is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4. Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 35, 49–57; `spawnPolicy.test.ts` 276–287). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20).

---

## 2. New catalog wave 17 — owner `enabledWaves` must name 17

`WDEAD-2026-10-25` deferred wave 17 because GitHub search at that freeze returned no readable WDD sibling. Queued **#1064** (`WDD-2026-10-25-001`) is now readable and restacks `worldFeatures.ts` onto #993. This program **consumes the ids**, does not overlay, does not restack that file.

Wave 17 ids (one per requested category; rarity weights and relative difficulty versus same-tier content — no level cutoffs):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-HALE_SEAM` | Hale Seam | hale-step tax when current HP ≥ 50% |
| `WF-HAZ-CAST_CINDER` | Cast Cinder | orb hunts last `SpellConfig` spender |
| `WF-TRP-HEFT_PLATE` | Heft Plate | first forced landing taxes once |
| `WF-TER-SLIT_WALL` | Slit Wall | walk+LoS wall; 1 AP rotates / 2 AP smashes |
| `WF-OBS-HALE_SILL` | Hale Sill | opens after a ≥80% HP end-turn |
| `WF-ZON-PLANT_FONT` | Plant Font | heal at remaining MP = 0 |
| `WF-TEL-FILE_STEP` | File Step | 1 MP pads while sharing a hostile’s rank or file |
| `WF-PRT-NEAR_GATE` | Near Gate | **exploration-only** with Flicker / Echo / Gambit / Pilgrim / Latch / Wager / Pact / Twilight / Ash / Hearth / Wane / Clean / Still / Tally / Mercy / Mark / Incant / Vow / Stride |
| `WF-INV-MUTE_FILE` | Mute File | two elites; first SpellConfig-locked until the second dies or the player ends adjacent. Counts as hostiles for run map-clear |
| `WF-ELT-PLANT_PICKET` | Plant Picket | stands while remaining MP is 0. Counts as hostiles. **Stands from map start in dungeon / boss rush** |
| `WF-TRS-PLANT_CACHE` | Plant Cache | 1 AP adjacent open at remaining MP = 0 |
| `WF-SPL-PLANT_TUTOR` | Plant Tutor | planted live teach at remaining MP = 0 |
| `WF-RSK-HALE_OATH` | Hale Oath | voluntary cash-out-hale wager ≥80% HP at credit |
| `WF-MOD-WALK_LOCK` | Walk Lock | after occupancy-walk, further SpellConfig spends illegal this turn |
| `WF-EVT-FILE_HOUR` | File Hour | end-on-axis-at-least-once event |
| `WF-ENV-STRIDE_DRAFT` | Stride Draft | leftover-MP end-turn tax unless remaining MP is 0 |

Owner `enabledWaves` still cannot name 10–16 on `main`; that stays `WDEAD-2026-10-24-001` (and the earlier 10/11/12/13/14 IDs). This run only adds **17**. Until VALIDATE, wave 17 stays data.

---

## 3. FSN drop 17 + EED Poise/Knight/Pit/Spent

Queued **#1075** packs Wave 16 families as drop-17 combination sheets (`docs/design/ENEMY_FORMATIONS_2026-10-25.md`). Sixteen proposed ids: `FSN-TALLY-STEP`, `FSN-TALLY-SIP`, `FSN-RANK-PENTA`, `FSN-SPIKE-SCREEN`, `FSN-TALLY-GATE`, `FSN-ODD-COURT`, `FSN-MIRE-FILE`, `FSN-WATCH-BANK`, `FSN-TALLY-CHOIR`, `FSN-EQUAL-SHOVE`, `FSN-TALLY-QUIET`, `FSN-PURSE-TALLY`, `FSN-TIED-PORTAL`, `FSN-PRIME-TAX`, `FSN-SWAP-BRICK`, `FSN-TALLY-HOLD`. Skip `FSN-TALLY-HOLD/DEC` (Dec Plug) until remaining cap ≥ 10; live cap is 2. Never PAIR `tally_holder` + `must_tallier`. Dual Keep leftover enables Tally on leftover-sum 3, Poise on 2/2 or 1/1, Score on sum 4 **and** unequal, and blocks Gaunt / Hollow Gift. `0 = 0` and `2 = 2` do not fire Tally.

Queued **#1056** (`EED-2026-10-25-001`) is the 17th-day encounter catalog. It spends leftover **drop-16** packs + Wave 16 world features + Rush Table **O** rooms O0–O3. Pacing: `ENC-TEACH-17` + `ENC-SPELL-33` → `ENC-WAVE-18` → `ENC-POISE-01` / `ENC-TIED-01` / `ENC-KNIGHT-01` → `ENC-BRANCH-17` → `ENC-BOSS-17` → `ENC-RUSH-63`…`66`. `ENC-RUSH-63`…`66` teach Table **O**, not Table P. Does **not** consume same-day Wave 17 families / FSN drop 17 / WDD wave 17. `ENEMY_SUMMON_CAP=2` holds Nine Plug. Honesty rerolls to day-16 rooms.

Owner ingest unions those catalogs. Do not concatenate FSN / ENC files. Do not overlay until VALIDATE.

---

## 4. Elite wave 17 — still seven live `FAMILY_TYPES`; Hendeca illegal at cap 2

Queued **#1073** proposes 32 world-pack families (`score_mender` … `hendeca_prelate`). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20; `spawnPolicy.test.ts` 276–287). Hendeca Span counts as **11** — skip `hendeca_prelate` until remaining cap ≥ 11. Score Post counts as **1** (`summonAI: "scorepost"`) and is legal at remaining ≥ 1. Extra doors stay `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` / `file_gallery` / `hexa_nave` / `lava_aisle` / `strike_pulpit` / `shock_nave` (not family ids). Never concatenate `FAMILY_TYPES`. `shove_gifter` fail-closed stays Wave 16. Do not mint `cadence_floorer` / colliding `wave17:` ids.

Nine / Dec skip at cap 2 stays `WDEAD-2026-10-24-003`. This run only adds Hendeca / Score Post.

---

## 5. Rush Table P — still cannot exist without `roomIndex > 9`

Queued **#1080** adds Wave 18 boss sheets and Rush Table P (additive after Table O). Four proposed pairs:

| Room | Pair |
| :--- | :--- |
| P0 | `slide_porter` + `peel_friar` |
| P1 | `both_capitular` + `lord_of_static` |
| P2 | `heave_kitchener` + `mill_seneschal` |
| P3 | `parched_preacher` + `dry_nuncio` |

Live canister still `if (roomIndex > 9) { return #err("roomIndex must be 0-9") }` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not restack Bone on P3. Do not invent Table Q. Extra Rush tables N–O without `roomIndex > 9` stay `WDEAD-2026-10-24-004`. This run only adds **P**.

---

## 6. New occupancy epoch after hunting-lantern — Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads

`WDEAD-2026-10-25-001` named walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern and froze occupancy at #1038. After #1050:

- Queued **#1071** snaps Orbiting Cinder (`WF-HAZ-ORBIT_CINDER`, `worldFeatures.ts` 1251, wave 3; `occupancyOrbitingCinderUnseal.ts`). One walkable HP-tax orb on a painted **4-tile clockwise 2×2**, then one cell clockwise at round start. Snap the whole 2×2 onto the battle island; drop leftover crumbs rather than punch. Drop a clockwise step that would hop a portal, void, spawn±3, or far crumb. Unique-corridor / destacked-player / occupied dests **stay**. Unique vs `#1038` chasing orb, `#1030` independent static dests, `#1023` 3-tile painted lane, `#965` static 2×2 AP tax.
- Queued **#1086** snaps Gutter Steam (`WF-ENV-GUTTER_STEAM`, `worldFeatures.ts` 1189, wave 2; `occupancyGutterSteamUnseal.ts`). **Two** independent walkable vents. Even-round end-of-turn −4% max-HP tax; odd rounds inert floor. Unique-corridor / destacked-player / occupied dests stay. Unique vs `#1071` 4-cycle 2×2, `#1023` contiguous lane, `#1030` 3–6 always-on dests.
- Queued **#1093** snaps Frost Pane (`WF-TER-FROST_PANE`, `worldFeatures.ts` 1313, wave 3; `occupancyFrostPaneUnseal.ts`). **One** walkable LoS-block sheet (floor for occupancy, wall for Bresenham). Unique-corridor panes **stay** (walk occupancy is floor; smash is optional 1 AP). `#1013` walk-blockers snap *off* unique corridors; Frost Pane stays. Unique vs `#1086` two even/odd vents and `#1013` impassable.
- Queued **#1103** snaps Triune Pads (`WF-TEL-TRIUNE_PADS`, `worldFeatures.ts` 1400, wave 3; `occupancyTriunePadsUnseal.ts`). **Three** walkable pads painted 1→2→3→1. Entering a fight-graph pad for 1 MP exits at the next clockwise pad; occupied dest **swaps**. An incomplete trio (fewer than three distinct fight-graph pads) drops **all** pads — unlike Gutter Steam keeping 1 of 2 vents. Unique-corridor pads stay. Unique vs `#1093` one LoS wall and `#1086` independent vents.

None of these helpers is wired from WorldExploration / `worldFeatures.ts` / `useBossSystem` / `simulate.ts`. Live `generateEnemies` still scatters. Gutter Steam already exists on `main` wave 2; Orbiting Cinder / Frost Pane / Triune Pads already exist on `main` wave 3. VALIDATE of currently-live catalog ids already needs this epoch.

VALIDATE epoch after 10-25-001 hunting-lantern: **orbiting-cinder unseal → gutter-steam unseal → frost-pane unseal → triune-pads unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #1071 / #1086 / #1093 / #1103 to keep keep-clear art.

---

## 7. New remount spies — portal/victory throw leftover rename + one-shot leftover honour

`WDEAD-2026-10-25-002` named GameKey / Boss Rush remount rename, feat/GameKey additive after keep stamps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, and victory-XP-throw leftover wipe. It did **not** name portal-XP throw leftover **rename**, victory-XP throw leftover **rename**, or one-shot Doka settle leftover honour after those XP stamps:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#1045** | `portalXpKeepRemountRenameSpendWriteSkip.ts` | reads `#767` `pbv_portal_xp_keep_remount_slotN` | Rename/upgrade honour replica leftover XP (110) before Doka debit. Distinct from `#767` heal/shop, `#912` death, `#1037` feat/GameKey of this stamp, `#1041` leftover-credit rename of `#813`. **#1046 is a duplicate queue-break.** |
| **#1070** | `victoryXpKeepRemountRenameSpendWriteSkip.ts` | reads `#807` `pbv_victory_xp_keep_remount_slotN` | Rename/upgrade honour replica leftover XP (180) before Doka debit. Distinct from `#807` heal/shop, `#918` death, `#1043` feat/GameKey, `#1045` portal-throw rename. |
| **#1088** | `victoryXpKeepRemountOneShotCreditWriteSkip.ts` | reads `#807` | One-shot settle honour replica leftover XP before `{ doka: newDoka }` so leftover shop cannot write Play-entry 100 over canister 180. Distinct from `#1043` feat/GameKey and `#1070` rename of the same stamp. |
| **#1092** | `portalXpKeepRemountOneShotCreditWriteSkip.ts` | reads `#767` | One-shot settle honour replica leftover XP (110) before Doka commit. Distinct from `#1045` rename and `#1088` victory throw. |
| **#1099** | `xpCreditKeepRemountOneShotCreditWriteSkip.ts` | reads `#813` `pbv_xp_credit_keep_remount_slotN` | One-shot settle honour replica leftover XP after a **parsed** leftover commit. Distinct from `#1036` feat/GameKey, `#1041` rename, `#1088` victory throw, `#1092` portal throw. |

Lab occupancy replay stays generate → destack → … → hunting-lantern (10-25-001) then **orbiting-cinder → gutter-steam → frost-pane → triune-pads**, all React-free. Reports add `orbitingCinderUnseal` / `gutterSteamUnseal` / `frostPaneUnseal` / `triunePadsUnseal` / `portalXpKeepRenameSpend` / `victoryXpKeepRenameSpend` / `victoryXpKeepOneShot` / `portalXpKeepOneShot` / `xpCreditKeepOneShot`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-25-002 **plus** #1045 / #1070 / #1088 / #1092 / #1099), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, Play-entry leftover XP after portal-throw / victory-throw / leftover keep then rename or one-shot settle.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` (#1077) or `mapGen.simulate` as the lab.

---

## 8. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–17 / drops 10–17 / elite 10–17 / Tables J–P / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 18 / FSN drop 18 / elite 18 / Table Q.

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-26-001 | Owner `enabledWaves` must name 17 (union ingest of WDD wave 17) | P1 |
| WDEAD-2026-10-26-002 | Ingest FSN drop 17 and EED Poise/Knight/Pit/Spent; ENC-RUSH-63…66 teach Table O, not Table P | P1 |
| WDEAD-2026-10-26-003 | `FAMILY_TYPES` stays seven; skip `hendeca_prelate` while remaining cap &lt; 11; Score Post legal at remaining ≥ 1 | P1 |
| WDEAD-2026-10-26-004 | Rush Table P must exist without `roomIndex > 9` | P1 |
| WDEAD-2026-10-26-005 | Encounter formations must compose with Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads unseals after the hunting-lantern epoch | P1 |
| WDEAD-2026-10-26-006 | Simulation Laboratory spies portal/victory throw leftover rename and one-shot leftover honour, and reports orbiting-cinder / gutter-steam / frost-pane / triune-pads columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-26.md`](./ACTION_IDS_WDEAD_2026-10-26.md).
