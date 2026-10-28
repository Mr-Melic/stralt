# World, Dungeon & Encounter Admin Designer — 2026-10-28

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-95058d68-9960-460a-b755-d54ac52f10db`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-27 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) … [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-26.md`](https://github.com/Mr-Melic/stralt/pull/1128) — queued, not on `main`.
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-27.md`](https://github.com/Mr-Melic/stralt/pull/1183) — WDD wave 18 / FSN drop 18 / elite 18 / Table Q / Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE compose; leftover-Doka honour before portal persist (`WDEAD-2026-10-27-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 19, FSN drop 19, elite wave 19, and Rush Table R because same-calendar-day siblings were unread at that freeze.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-28.md`](./ACTION_IDS_WDEAD_2026-10-28.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDEAD-2026-10-24-*`, `WDEAD-2026-10-25-*`, `WDEAD-2026-10-26-*`, `WDEAD-2026-10-27-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **readable wave-19 / drop-19 / elite-19 / Table R siblings opened after #1183 froze**, plus occupancy unseals and a leftover spell-level remount rail that did not exist when that freeze listed occupancy through #1161 and remount spies through #1157.

Do **not** invent WDD wave 20, FSN drop 20, elite wave 20, or Rush Table S. Same-calendar-day #1218 (EBA re-audit) is consume-only. No wave-20 world catalog, drop-20 FSN sheet, elite-20 family list, or Table S bible was readable at this freeze. Do not restack `worldFeatures.ts`. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / #1114 / **#1172** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** / **#1064** / **#1114** / **#1172** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-19 ids**, do not overlay from Admin, do not restack that file in this program.

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

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, a GameKey Doka keep, a Boss Rush Doka keep, or a spend keep, add feat / GameKey onto Play-entry Doka after those keeps, write Play-entry leftover XP after a leftover-XP / portal-XP / victory-XP-throw keep then feat / GameKey / rename, write Play-entry leftover XP after a one-shot Doka settle following a leftover / portal-throw / victory-throw keep, write Play-entry Doka after a portal persist following a victory / one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keep, or retry `upgradeSpell` after a leftover spell-level keep whose replica already advanced.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / #932 / #1015 / #1050 / #1128 / **#1183** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / #1114 / **#1172** WDD | Waves 4–**19** `WF-*`. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 20. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / #956 / #1005 / #1075 / #1134 / **#1176** FSN | Drops 4–**19**. Do not invent drop 20. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / #957 / #1006 / #1056 / #1121 / **#1195** EED | Tide…Score/File/Lava/Ready. ENC-RUSH-71…74 teach Table Q, not Table R. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / #941 / #997 / #1073 / #1138 / **#1189** elite | Waves 4–**19**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 20. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / #951 / #1004 / #1080 / #1139 / **#1170** boss bible | Tables C–**R**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table S. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| #914 / #920 / #925 occupancy | ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. **10-23-001 already owns these.** |
| #933 / #965 / #970 / #976 occupancy | Adjacent minion / BOARD_CLAIM / Void Rift / generate-time eligibleHazard. **10-24-005 already owns these.** |
| #1013 / #1023 / #1030 / #1038 occupancy | Walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern. **10-25-001 already owns these.** |
| #1071 / #1086 / #1093 / #1103 occupancy | Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads. **10-26-005 already owns these.** |
| #1127 / #1146 / #1154 / #1161 occupancy | Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE. **10-27-005 already owns these.** |
| **#1174** Latch Gate / **#1201** Pendulum Censer / **#1209** Hourglass Arch / **#1213** Shift Slab | **New occupancy epoch after MAP_ROTATE.** Unique-corridor Latch Gate / Hourglass Arch / Shift Slab plants snap **off**. Unique-corridor Pendulum Censer dests **stay**. Unarmed Latch Gate is not an exit. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | **10-22-006 already owns the spy.** |
| #909 / #912 / #918 / #919 remount death-cut after feat / portal-XP / victory-XP / leftover-XP keep | **10-23-002 already owns the spy.** |
| #926 spend keep (shop honour) / #927 parsed-success Doka-heal | **10-23-002 already owns the spy.** |
| #938 / #964 / #969 / #971 / #977 / #979 / #986 / #992 / #1002 | Spend-keep death-cut, shop/heal throw Doka + death-cut, throw heal double-charge, rename after throw / victory / one-shot / feat / spend keep. **10-24-006 already owns the spy.** #987 is a duplicate of #986 — consume, do not fork. |
| #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043 | GameKey / Rush remount rename, feat/GameKey additive after keeps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe. **10-25-002 already owns the spy.** |
| #1045 / #1070 / #1088 / #1092 / #1099 | Portal/victory throw leftover rename + one-shot leftover honour. **10-26-006 already owns the spy.** #1046 is a duplicate of #1045 — consume, do not fork. |
| #1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157 | Leftover-Doka honour onto the remount lock **before portal persist** after victory / one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keeps. **10-27-006 already owns the spy.** |
| **#1215** leftover spell-level keep remount `upgradeSpell` skip | **New lab spy.** Distinct from #926 spend-keep Doka and #1002 rename/upgrade Doka debit. |
| #334 / #415 / #585 / #741 / #934 / #996 / #1055 / #1130 / **#1193** AFDA | Honesty copy. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 / #960 / #1016 / #1077 / #1141 / **#1197** LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 / #929 / #980 / #1049 / #1111 / #1163 / **#1218** EBA | Consume, do not duplicate `EBA-*`. |
| #999 / #1072 / **#1135** AEE | Consume, do not duplicate `AEE-*`. |
| #991 / #1052 / #1112 / **#1188** Expansion Director | Consume. Not a WDEAD overlay. |
| #1044 / #1111 / #1163 enemy/boss admin | Sibling designer. Consume. |
| #1063 / #1132 / **#1177** SPELL_PROPOSALS / #1082 / #1143 SDE | Consume. Wave 20 family CORE, not this pack. |
| #1076 hazard overlay extract / #1109 portal cube extract / #1196 battle floor highlight extract | Engine paint split. Consume. Not occupancy compose. |
| #1097 / #1100 / #1142 Thorned Ground / Void Rift / leftover-walk lava-spike / Plague Zone soak | Combat honesty. Consume. Not occupancy. |
| #1083 / #1126 player data-evolution / #1101 content retirement | Consume. |
| #1156 shrine room open until altar Doka settle | Persist honesty. Consume. Not the lab. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-27 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras still `DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 29). `dungeonDokaMultiplierFor` still `Math.min(safeDepth, 5)` (`portalRules.ts` 161). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). Rest is not an enum value. `enabledWaves` has **zero** matches under `src/frontend/src`. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7143). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` through `WDEAD-2026-10-25-001`…`002` | Yes (queued) | Do not re-issue. |
| `WDEAD-2026-10-26-001`…`006` | Yes (queued #1128) | Wave 17 / drop 17 / elite 17 / Table P / Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads / portal-victory throw leftover rename + one-shot leftover honour stay those IDs. |
| `WDEAD-2026-10-27-001`…`006` | Yes (queued #1183) | Wave 18 / drop 18 / elite 18 / Table Q / Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE / leftover-Doka honour before portal persist stay those IDs. Do not re-issue 10-27-001 if `enabledWaves` still cannot name 18. Do not re-issue 10-27-002 if FSN drop 18 / ENC-TEACH-18 / ENC-TALLY-01 / ENC-RUSH-67…70 still uningested. Do not re-issue 10-27-003 if `FAMILY_TYPES` is still seven / dodeca still illegal at cap 2. Do not re-issue 10-27-004 if Q still cannot exist without `roomIndex > 9`. Do not re-issue 10-27-005 if Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE compose is still missing. Do not re-issue 10-27-006 if leftover-Doka honour before portal persist after keep stamps is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4. Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 35, 49–57; `spawnPolicy.test.ts` 276–287). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20).

---

## 2. New catalog wave 19 — owner `enabledWaves` must name 19

`WDEAD-2026-10-27` deferred wave 19 because same-calendar-day #1172 was unread at that freeze. Queued **#1172** (`WDD-2026-10-27-001`) is now readable and restacks `worldFeatures.ts` onto #1114. This program **consumes the ids**, does not overlay, does not restack that file.

Wave 19 ids (one per requested category; rarity weights and relative difficulty versus same-tier content — no level cutoffs). Axis: remaining AP **equals** remaining MP.

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-MATCH_SEAM` | Match Seam | pair-step tax when leftover AP equals leftover MP |
| `WF-HAZ-MATCH_CINDER` | Match Cinder | orb hunts while leftovers match |
| `WF-TRP-MATCH_PLATE` | Match Plate | first forced landing taxes once while leftovers match |
| `WF-TER-MATCH_PANE` | Match Pane | walk+LoS pane while leftovers match |
| `WF-OBS-MATCH_SILL` | Match Sill | opens after leftover AP equals leftover MP |
| `WF-ZON-MATCH_FONT` | Match Font | heal when leftover AP equals leftover MP |
| `WF-TEL-MATCH_STEP` | Match Step | 1 MP pads while leftovers match |
| `WF-PRT-MATCH_GATE` | Match Gate | **exploration-only** with Flicker / Echo / Gambit / Pilgrim / Latch / Wager / Pact / Twilight / Ash / Hearth / Wane / Clean / Still / Tally / Mercy / Mark / Incant / Vow / Stride / Near / Ready |
| `WF-INV-MATCH_FILE` | Match File | two elites; first AP-locked until the second dies or leftovers match. Counts as hostiles for run map-clear |
| `WF-ELT-MATCH_PICKET` | Match Picket | stands while leftover AP equals leftover MP. Counts as hostiles. **Stands from map start in dungeon / boss rush** |
| `WF-TRS-MATCH_CACHE` | Match Cache | 1 AP adjacent open at leftover AP equals leftover MP |
| `WF-SPL-MATCH_TUTOR` | Match Tutor | planted live teach at leftover AP equals leftover MP |
| `WF-RSK-MATCH_OATH` | Match Oath | voluntary cash-out wager when leftovers match at credit |
| `WF-MOD-MATCH_CAST` | Match Cast | after first SpellConfig spend while leftovers match, further SpellConfig spends illegal this turn |
| `WF-EVT-MATCH_HOUR` | Match Hour | end-with-matching-leftovers-at-least-once event |
| `WF-ENV-MATCH_DRAFT` | Match Draft | leftover-AP end-turn tax unless leftover AP equals leftover MP |

Owner `enabledWaves` still cannot name 10–18 on `main`; that stays `WDEAD-2026-10-24-001` / `WDEAD-2026-10-26-001` / `WDEAD-2026-10-27-001` (and the earlier 10/11/12/13/14 IDs). This run only adds **19**. Until VALIDATE, wave 19 stays data.

---

## 3. FSN drop 19 + EED Score/File/Lava/Ready

Queued **#1176** packs Wave 18 families as drop-19 combination sheets (`docs/design/ENEMY_FORMATIONS_2026-10-27.md`). Sixteen proposed ids: `FSN-STAVE-STEP`, `FSN-STAVE-SIP`, `FSN-RING-HEPTA`, `FSN-RIME-RANK`, `FSN-STAVE-GATE`, `FSN-LAST-DUAL`, `FSN-RIFT-FRESH`, `FSN-WATCH-EVEN`, `FSN-STAVE-CHOIR`, `FSN-PRIME-CAP`, `FSN-STAVE-QUIET`, `FSN-HYMN-STAVE`, `FSN-DOCK-VERSE`, `FSN-GAIT-BRICK`, `FSN-PURSE-STAVE`, `FSN-STAVE-HOLD`. Skip Dodeca Plug until remaining cap ≥ 12; live cap is 2. Dual Keep **cannot** open Stave (leftover-sum 5). Never PAIR `stave_holder` + `must_staver`. Wave 19 families stay deferred.

Queued **#1195** (`EED-2026-10-27-001`) is the 19th-day encounter catalog. It spends leftover **drop-18** packs + Wave 18 world features + Rush Table **Q** rooms Q0–Q3. Pacing: `ENC-TEACH-19` + `ENC-SPELL-37` → `ENC-WAVE-20` → `ENC-SCORE-01` / `ENC-UNEQ-01` / `ENC-FILE-02` → `ENC-BRANCH-19` → `ENC-BOSS-19` → `ENC-RUSH-71`…`74`. `ENC-RUSH-71`…`74` teach Table **Q**, not Table R. Does **not** consume same-day Wave 19 families / FSN drop 19 / WDD wave 19. `WF-PRT-READY_GATE` rest/overworld only. Hold `FSN-SCORE-HOLD/HENDECA` while cap is 2. Honesty rerolls to day-18 rooms.

Owner ingest unions those catalogs. Do not concatenate FSN / ENC files. Do not overlay until VALIDATE.

---

## 4. Elite wave 19 — still seven live `FAMILY_TYPES`; Trideca illegal at cap 2

Queued **#1189** proposes 32 world-pack families (`sestet_mender` … `trideca_prelate`). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20; `spawnPolicy.test.ts` 276–287). Trideca Span counts as **13** — skip `trideca_prelate` until remaining cap ≥ 13. Sestet Post (`sestet_prelate`, `summonAI: "sestetpost"`) counts as **1** and is legal at remaining ≥ 1. Dual Keep cannot fake leftover-sum 6 unequal; (3,3) stays Poise; (3,2) stays Stave. Extra doors stay `sestet_cantor` / `tierce_precentor` / `span_trideca` / `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `court_tierce_regent` / `hoop_precentor` / `lane_fold_regent` (not family ids). Never concatenate `FAMILY_TYPES`. `shove_gifter` fail-closed stays Wave 16. Same-day SPELL_PROPOSALS Wave 19 (#1177: Septet / Quarte / Tetradeca / Feud) and SDE Wave 18 (#1143) stay **Wave 20** family CORE. Do not mint `tetradeca_prelate` / colliding `wave19:` ids.

Dodeca / Stave skip at cap 2 stays `WDEAD-2026-10-27-003`. This run only adds Trideca / Sestet Post.

---

## 5. Rush Table R — still cannot exist without `roomIndex > 9`

Queued **#1170** adds Wave 20 boss sheets and Rush Table R (additive after Table Q). Four proposed pairs:

| Room | Pair |
| :--- | :--- |
| R0 | `trim_abbot` + `bait_vicar` |
| R1 | `ready_commissary` + `silent_conductor` |
| R2 | `lean_procurator` + `ivory_palisade` |
| R3 | `near_scholastic` + `ram_castellan` |

Live canister still `if (roomIndex > 9) { return #err("roomIndex must be 0-9") }` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not restack Bone on R3. Do not invent Table S. Extra Rush tables N–Q without `roomIndex > 9` stay `WDEAD-2026-10-24-004` / `WDEAD-2026-10-26-004` / `WDEAD-2026-10-27-004`. This run only adds **R**. ENC-RUSH-71…74 (#1195) teach Table Q, not these pairs. Do not remap `trim_precentor` to `trim_abbot`.

---

## 6. New occupancy epoch after MAP_ROTATE — Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab

`WDEAD-2026-10-27-005` named Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE and froze occupancy at #1161. After #1183:

- Queued **#1174** snaps Latch Gate (`WF-PRT-LATCH_GATE`, `worldFeatures.ts` 1429, wave 3, **live on `main`**; `occupancyLatchGateUnseal.ts`). One extra sealed portal. Unarmed it is not an exit. Unique-corridor / player / occupied dests snap **off**. Never plant as the only portal. `latchGateCountsAsExit` stays false until a 1 AP adjacent arm (arm does not relocate units). Unique vs `#1013` walk-blockers (never an exit) and vs Flicker/Echo (count as exits from plant).
- Queued **#1201** snaps Pendulum Censer (`WF-HAZ-PENDULUM_CENSER`, queued WDD restack, not on `main`; `occupancyPendulumCenserUnseal.ts`). One walkable HP-tax orb on a painted 5-tile nave that steps and **reverses at the ends**. Unique-corridor / destacked-player / occupied dests **stay**. Drop reverse-steps onto portal / void / leftover crumb. Require all five painted cells to be fight-graph floor. Unique vs `#1023` Creeping Ash (3-tile one-way), `#1038` Hunting Lantern, `#1071` Orbiting Cinder (4-cycle wrap).
- Queued **#1209** snaps Hourglass Arch (`WF-OBS-HOURGLASS_ARCH`; `occupancyHourglassArchUnseal.ts`). One delayed floor→wall with three sand pips. Collapse after **three round starts** (global clock; nobody needs to leave). Unique-corridor dests snap **off** at plant. Collapse onto unique corridor / leftover crumb / portal / void stays floor. Unique vs `#1127` Spent Bridge (3 **leaves**) and `#1013` immediate walk-blockers.
- Queued **#1213** snaps Shift Slab (`WF-OBS-SHIFT_SLAB`; `occupancyShiftSlabUnseal.ts`). Two adjacent short-path cells; exactly one wall / one floor; they swap at each round start. Unique-corridor dests snap **off** at plant (both orientations must leave a spawn→portal route). Swap onto unique corridor / leftover crumb / portal / void / occupied shut stays in the current orientation. Unique vs `#1209` delayed wall that then stays wall and vs Tide Door (one cell odd/even, #1013).

None of these helpers is wired from WorldExploration / `worldFeatures.ts` / `useBossSystem` / `simulate.ts`. Live `generateEnemies` still scatters. Latch Gate already exists on `main` wave 3, so VALIDATE of currently-live catalog ids already needs this epoch.

VALIDATE epoch after 10-27-005 map-rotate: **latch-gate unseal → pendulum-censer unseal → hourglass-arch unseal → shift-slab unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #1174 / #1201 / #1209 / #1213 to keep keep-clear art.

---

## 7. New remount spy — leftover spell-level keep remount `upgradeSpell` skip

`WDEAD-2026-10-27-006` named leftover-Doka honour before portal persist after keep stamps. It did **not** name leftover **spell-level** remount skip of a second `upgradeSpell`:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#1215** | `spellLevelKeepRemountWriteSkip.ts` | `pbv_spell_level_keep_remount_slotN` | After parsed `#ok` or a throw that is not explicit `upgradeSpell failed`, remount re-fetches `getCharacter` keys; replica level > Play-entry local level skips the canister call so leftover retry cannot double-charge (`2^currentLevel`). Distinct from `#926` spend-keep Doka honour, `#1002` rename/upgrade Doka debit (still invokes `upgradeSpell`), `#938` death, `#1024` feat/GameKey additive, `#1153` spend-keep × portal Doka. |

Lab occupancy replay stays generate → destack → … → map-rotate (10-27-005) then **latch-gate → pendulum-censer → hourglass-arch → shift-slab**, all React-free. Reports add `latchGateUnseal` / `pendulumCenserUnseal` / `hourglassArchUnseal` / `shiftSlabUnseal` / `spellLevelKeepRemount`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-27-006 **plus** #1215), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, a leftover remount `upgradeSpell` retry after replica level already advanced.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` (#1197) or `mapGen.simulate` as the lab.

---

## 8. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–19 / drops 10–19 / elite 10–19 / Tables J–R / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 20 / FSN drop 20 / elite 20 / Table S.

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-28-001 | Owner `enabledWaves` must name 19 (union ingest of WDD wave 19) | P1 |
| WDEAD-2026-10-28-002 | Ingest FSN drop 19 and EED Score/File/Lava/Ready; ENC-RUSH-71…74 teach Table Q, not Table R | P1 |
| WDEAD-2026-10-28-003 | `FAMILY_TYPES` stays seven; skip `trideca_prelate` while remaining cap &lt; 13; Sestet Post legal at remaining ≥ 1 | P1 |
| WDEAD-2026-10-28-004 | Rush Table R must exist without `roomIndex > 9` | P1 |
| WDEAD-2026-10-28-005 | Encounter formations must compose with Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab unseals after the MAP_ROTATE epoch | P1 |
| WDEAD-2026-10-28-006 | Simulation Laboratory spies leftover spell-level keep remount `upgradeSpell` skip, and reports latch-gate / pendulum / hourglass / shift-slab columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-28.md`](./ACTION_IDS_WDEAD_2026-10-28.md).
