# World, Dungeon & Encounter Admin Designer — 2026-10-27

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-4847afa9-c253-4ddc-b89a-b626ae30dfc8`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-26 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) … [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-25.md`](https://github.com/Mr-Melic/stralt/pull/1050) — queued, not on `main`.
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-26.md`](https://github.com/Mr-Melic/stralt/pull/1128) — WDD wave 17 / FSN drop 17 / elite 17 / Table P / Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads compose; portal/victory throw leftover rename + one-shot leftover honour spy (`WDEAD-2026-10-26-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 18, FSN drop 18, elite wave 18, and Rush Table Q because same-calendar-day siblings were unread at that freeze.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-27.md`](./ACTION_IDS_WDEAD_2026-10-27.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDEAD-2026-10-24-*`, `WDEAD-2026-10-25-*`, `WDEAD-2026-10-26-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **readable wave-18 / drop-18 / elite-18 / Table Q siblings opened after #1128 froze**, plus occupancy unseals and remount leftover-Doka rails that did not exist when that freeze listed occupancy through Triune Pads and remount spies through #1099.

Do **not** invent WDD wave 19, FSN drop 19, elite wave 19, or Rush Table R. Same-calendar-day #1172 (`WDD-2026-10-27-001`), #1170 (Wave 20 / Rush Table R), and #1174 (Latch Gate occupancy) opened after this freeze listed occupancy through #1161; next cron ingests them if still unread here. Do not restack `worldFeatures.ts`. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / **#1114** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** / **#1064** / **#1114** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-18 ids**, do not overlay from Admin, do not restack that file in this program.

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

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, a GameKey Doka keep, a Boss Rush Doka keep, or a spend keep, add feat / GameKey onto Play-entry Doka after those keeps, write Play-entry leftover XP after a leftover-XP / portal-XP / victory-XP-throw keep then feat / GameKey / rename, write Play-entry leftover XP after a one-shot Doka settle following a leftover / portal-throw / victory-throw keep, or write Play-entry Doka after a portal persist following a victory / one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keep.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / #932 / #1015 / #1050 / **#1128** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / **#1114** WDD | Waves 4–**18** `WF-*`. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 19. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / #956 / #1005 / #1075 / **#1134** FSN | Drops 4–**18**. Do not invent drop 19. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / #957 / #1006 / #1056 / **#1121** EED | Tide…Tally/Rank/Spike/Odd. ENC-RUSH-67…70 teach Table P, not Table Q. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / #941 / #997 / #1073 / **#1138** elite | Waves 4–**18**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 19. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / #951 / #1004 / #1080 / **#1139** boss bible | Tables C–**Q**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table R. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| #914 / #920 / #925 occupancy | ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. **10-23-001 already owns these.** |
| #933 / #965 / #970 / #976 occupancy | Adjacent minion / BOARD_CLAIM / Void Rift / generate-time eligibleHazard. **10-24-005 already owns these.** |
| #1013 / #1023 / #1030 / #1038 occupancy | Walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern. **10-25-001 already owns these.** |
| #1071 / #1086 / #1093 / #1103 occupancy | Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads. **10-26-005 already owns these.** |
| **#1127** Spent Bridge / **#1146** Slipstream / **#1154** Cinder Barrel / **#1161** MAP_ROTATE / MIRROR_INVERT | **New occupancy epoch after triune-pads.** Unique-corridor Spent Bridge / Cinder Barrel plants snap **off** (wall / delayed wall). Unique-corridor Slipstream pads and MAP_ROTATE hops **stay**. Incomplete Slipstream pair drops all pads. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | **10-22-006 already owns the spy.** |
| #909 / #912 / #918 / #919 remount death-cut after feat / portal-XP / victory-XP / leftover-XP keep | **10-23-002 already owns the spy.** |
| #926 spend keep (shop honour) / #927 parsed-success Doka-heal | **10-23-002 already owns the spy.** |
| #938 / #964 / #969 / #971 / #977 / #979 / #986 / #992 / #1002 | Spend-keep death-cut, shop/heal throw Doka + death-cut, throw heal double-charge, rename after throw / victory / one-shot / feat / spend keep. **10-24-006 already owns the spy.** #987 is a duplicate of #986 — consume, do not fork. |
| #1019 / #1020 / #1021 / #1024 / #1025 / #1028 / #1029 / #1031 / #1032 / #1036 / #1037 / #1041 / #1043 | GameKey / Rush remount rename, feat/GameKey additive after keeps, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe. **10-25-002 already owns the spy.** |
| #1045 / #1070 / #1088 / #1092 / #1099 | Portal/victory throw leftover rename + one-shot leftover honour. **10-26-006 already owns the spy.** #1046 is a duplicate of #1045 — consume, do not fork. |
| **#1129** / **#1145** / **#1147** / **#1149** / **#1151** / **#1153** / **#1157** | Leftover-Doka honour onto the remount lock **before portal persist** after victory / one-shot / GameKey / feat / Boss Rush / spend / shop-heal-throw keeps. **New lab spy.** |
| #334 / #415 / #585 / #741 / #934 / #996 / #1055 / **#1130** AFDA | Honesty copy. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 / #960 / #1016 / #1077 / **#1141** LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 / #929 / #980 / #1049 / **#1111** EBA | Consume, do not duplicate `EBA-*`. |
| #999 / #1072 / **#1135** AEE | Consume, do not duplicate `AEE-*`. |
| #991 / #1052 / **#1112** Expansion Director | Consume. Not a WDEAD overlay. |
| #1044 / **#1111** enemy/boss admin | Sibling designer. Consume. |
| #1063 / #1132 SPELL_PROPOSALS / #1082 / #1143 SDE | Consume. Wave 19 family CORE, not this pack. |
| #1076 hazard overlay extract / #1109 portal cube extract | Engine paint split. Consume. Not occupancy compose. |
| #1097 / #1100 / #1142 Thorned Ground / Void Rift / leftover-walk lava-spike / Plague Zone soak | Combat honesty. Consume. Not occupancy. |
| #1083 / #1126 player data-evolution / #1101 content retirement | Consume. |
| #1156 shrine room open until altar Doka settle | Persist honesty. Consume. Not the lab. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-26 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras still `DUNGEON_SPAWN_DEPTH_CAP = 5` (`spawnPolicy.ts` 29). `dungeonDokaMultiplierFor` still `Math.min(safeDepth, 5)` (`portalRules.ts` 161). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). Rest is not an enum value. `enabledWaves` has **zero** matches under `src/frontend/src`. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7143). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` through `WDEAD-2026-10-23-001`…`002` | Yes (queued) | Do not re-issue. |
| `WDEAD-2026-10-24-001`…`006` | Yes (queued #1015) | Waves 15–16 / drops 15–16 / elite 15–16 / Table N–O / adjacent-minion / BOARD_CLAIM / Void Rift / eligible-hazard / spend-keep death-cut + throw Doka + throw heal + rename after throw / victory / one-shot / feat / spend keep stay those IDs. Do not re-issue 10-24-001 if `enabledWaves` still cannot name 15 or 16. |
| `WDEAD-2026-10-25-001`…`002` | Yes (queued #1050) | Walk-blocker / Creeping Ash / Ember Vein / Hunting Lantern compose stay 10-25-001. GameKey / Rush remount rename, feat/GameKey additive, leftover-XP feat/GameKey + rename after leftover / portal-XP keep, victory-XP-throw leftover wipe stay 10-25-002. |
| `WDEAD-2026-10-26-001`…`006` | Yes (queued #1128) | Wave 17 / drop 17 / elite 17 / Table P / Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads / portal-victory throw leftover rename + one-shot leftover honour stay those IDs. Do not re-issue 10-26-001 if `enabledWaves` still cannot name 17. Do not re-issue 10-26-002 if FSN drop 17 / ENC-TEACH-17 / ENC-POISE-01 / ENC-RUSH-63…66 still uningested. Do not re-issue 10-26-003 if `FAMILY_TYPES` is still seven / hendeca still illegal at cap 2. Do not re-issue 10-26-004 if P still cannot exist without `roomIndex > 9`. Do not re-issue 10-26-005 if Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads compose is still missing. Do not re-issue 10-26-006 if portal/victory throw leftover rename / one-shot leftover honour is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4. Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.ts` 35, 49–57; `spawnPolicy.test.ts` 276–287). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20).

---

## 2. New catalog wave 18 — owner `enabledWaves` must name 18

`WDEAD-2026-10-26` deferred wave 18 because same-calendar-day #1114 was unread at that freeze. Queued **#1114** (`WDD-2026-10-26-001`) is now readable and restacks `worldFeatures.ts` onto #1064. This program **consumes the ids**, does not overlay, does not restack that file.

Wave 18 ids (one per requested category; rarity weights and relative difficulty versus same-tier content — no level cutoffs):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-PAIR_SEAM` | Pair Seam | pair-step tax when two leftovers match |
| `WF-HAZ-BUSY_CINDER` | Busy Cinder | orb hunts the last AP spender |
| `WF-TRP-SKEW_PLATE` | Skew Plate | first forced landing taxes once |
| `WF-TER-BRACE_COLUMN` | Brace Column | walk+LoS column; 1 AP rotates / 2 AP smashes |
| `WF-OBS-READY_SILL` | Ready Sill | opens after remaining AP === max AP |
| `WF-ZON-PAIR_FONT` | Pair Font | heal when leftover AP equals leftover MP |
| `WF-TEL-SKEW_STEP` | Skew Step | 1 MP pads while occupying a skew file |
| `WF-PRT-READY_GATE` | Ready Gate | **exploration-only** with Flicker / Echo / Gambit / Pilgrim / Latch / Wager / Pact / Twilight / Ash / Hearth / Wane / Clean / Still / Tally / Mercy / Mark / Incant / Vow / Stride / Near |
| `WF-INV-READY_FILE` | Ready File | two elites; first AP-locked until the second dies or the player ends remaining AP === max AP. Counts as hostiles for run map-clear |
| `WF-ELT-READY_PICKET` | Ready Picket | stands while remaining AP equals max AP. Counts as hostiles. **Stands from map start in dungeon / boss rush** |
| `WF-TRS-ROUND_CACHE` | Round Cache | 1 AP adjacent open at remaining AP === max AP |
| `WF-SPL-READY_TUTOR` | Ready Tutor | planted live teach at remaining AP === max AP |
| `WF-RSK-PAIR_OATH` | Pair Oath | voluntary cash-out-pair wager when leftovers match at credit |
| `WF-MOD-ONCE_CAST` | Once Cast | after first SpellConfig spend, further SpellConfig spends illegal this turn |
| `WF-EVT-READY_HOUR` | Ready Hour | end-at-max-remaining-AP-at-least-once event |
| `WF-ENV-PAIR_DRAFT` | Pair Draft | leftover-AP end-turn tax unless leftover AP equals leftover MP |

Owner `enabledWaves` still cannot name 10–17 on `main`; that stays `WDEAD-2026-10-24-001` / `WDEAD-2026-10-26-001` (and the earlier 10/11/12/13/14 IDs). This run only adds **18**. Until VALIDATE, wave 18 stays data.

---

## 3. FSN drop 18 + EED Tally/Rank/Spike/Odd

Queued **#1134** packs Wave 17 families as drop-18 combination sheets (`docs/design/ENEMY_FORMATIONS_2026-10-26.md`). Sixteen proposed ids: `FSN-SCORE-STEP`, `FSN-SCORE-SIP`, `FSN-FILE-HEXA`, `FSN-LAVA-FILE`, `FSN-SCORE-GATE`, `FSN-STRIKE-DRY`, `FSN-SHOCK-EVEN`, `FSN-WATCH-ODD`, `FSN-SCORE-CHOIR`, `FSN-LEAN-RISE`, `FSN-SCORE-QUIET`, `FSN-DUEL-SCORE`, `FSN-SNUFF-VERSE`, `FSN-STILL-BRACE`, `FSN-PURSE-SCORE`, `FSN-SCORE-HOLD`. Skip Hendeca Plug until remaining cap ≥ 11; live cap is 2. Never PAIR `score_holder` + `must_scorer`. Never PAIR `cadence_snuffer` + `cadence_riser`. Dual Keep leftover enables Score on leftover-sum 4 **and** unequal, Tally on leftover-sum 3, Poise on 2/2 or 1/1, and blocks Gaunt / Hollow Gift / Lean Gift (AP bank). `0 = 0` and `2 = 2` do not fire Score.

Queued **#1121** (`EED-2026-10-26-001`) is the 18th-day encounter catalog. It spends leftover **drop-17** packs + Wave 17 world features + Rush Table **P** rooms P0–P3. Pacing: `ENC-TEACH-18` + `ENC-SPELL-35` → `ENC-WAVE-19` → `ENC-TALLY-01` / `ENC-SUM-01` / `ENC-RANK-01` → `ENC-BRANCH-18` → `ENC-BOSS-18` → `ENC-RUSH-67`…`70`. `ENC-RUSH-67`…`70` teach Table **P**, not Table Q. Does **not** consume same-day Wave 18 families / FSN drop 18 / WDD wave 18. Hold `FSN-TALLY-HOLD/DEC` while cap is 2. `WF-PRT-NEAR_GATE` rest/overworld only. Honesty rerolls to day-17 rooms.

Owner ingest unions those catalogs. Do not concatenate FSN / ENC files. Do not overlay until VALIDATE.

---

## 4. Elite wave 18 — still seven live `FAMILY_TYPES`; Dodeca illegal at cap 2

Queued **#1138** proposes 32 world-pack families (`stave_mender` … `dodeca_prelate`). Live `EnemyFamily` union is still the original seven (`gameTypes.ts` 12–20; `spawnPolicy.test.ts` 276–287). Dodeca Span counts as **12** — skip `dodeca_prelate` until remaining cap ≥ 12. Stave Post (`stave_prelate`, `summonAI: "stavepost"`) counts as **1** and is legal at remaining ≥ 1. Extra doors stay `stave_cantor` / `dock_precentor` / `span_dodeca` / `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` (not family ids). Never concatenate `FAMILY_TYPES`. `shove_gifter` fail-closed stays Wave 16. Same-day SPELL_PROPOSALS Wave 18 (#1132: Sestet / Tierce / Trideca / Psalm) and SDE Wave 17 (#1082 / #1143) stay **Wave 19** family CORE. Do not mint `trideca_prelate` / colliding `wave18:` ids.

Hendeca / Score skip at cap 2 stays `WDEAD-2026-10-26-003`. This run only adds Dodeca / Stave Post.

---

## 5. Rush Table Q — still cannot exist without `roomIndex > 9`

Queued **#1139** adds Wave 19 boss sheets and Rush Table Q (additive after Table P). Four proposed pairs:

| Room | Pair |
| :--- | :--- |
| Q0 | `stride_chancellor` + `lock_marshal` |
| Q1 | `dual_treasurer` + `levy_rector` |
| Q2 | `imprint_archdeacon` + `mute_notary` |
| Q3 | `damp_provost` + `hexed_marker` |

Live canister still `if (roomIndex > 9) { return #err("roomIndex must be 0-9") }` (`main.mo` 3317). Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not restack Bone on Q3. Do not invent Table R. Extra Rush tables N–P without `roomIndex > 9` stay `WDEAD-2026-10-24-004` / `WDEAD-2026-10-26-004`. This run only adds **Q**. ENC-RUSH-67…70 (#1121) teach Table P, not these pairs. Do not remap `stride_bursar` / `dual_bursar` / `imprint_precentor` / `keep_bursar`.

---

## 6. New occupancy epoch after triune-pads — Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE

`WDEAD-2026-10-26-005` named Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads and froze occupancy at #1103. After #1128:

- Queued **#1127** snaps Spent Bridge (`WF-OBS-SPENT_BRIDGE`, `worldFeatures.ts` 1367, wave 3; `occupancySpentBridgeUnseal.ts`). One walkable short-path cell with three painted pips. Collapse after three leaves walls the cell. Unique-corridor dests snap **off** at plant (evaluate solvability as if already a wall). Occupied / destacked-player dests on a dual path stay (walkable until leave). Collapse onto a unique corridor / portal / void / leftover crumb stays painted as floor (drop the wall-off). Unique vs `#1103` 3-pad carousel and `#1013` immediate walk-blockers.
- Queued **#1146** snaps Slipstream (`WF-TEL-SLIPSTREAM`, `worldFeatures.ts` 947, wave 2; `occupancySlipstreamUnseal.ts`). One-way A→B pair. Snap both pads onto the fight graph; drop leftover teleports rather than punch. Never send anyone back from B. Unique-corridor / destacked-player / occupied dests **stay**. Incomplete pairs drop **all** pads. Unique vs `#1103` 1→2→3 carousel (B does not return) and `#1127` delayed wall.
- Queued **#1154** snaps Cinder Barrel (`WF-TER-CINDER_BARREL`, `worldFeatures.ts` 859, wave 2; `occupancyCinderBarrelUnseal.ts`). One impassable wall; 1 AP cardinal roll. Unique-corridor / occupied / player plants snap **off**. Drop leftover dests rather than punch. Drop hops that would seal or leave the fight graph. Occupied dests hit (barrel stays). Smash is 2 AP floor and cannot seal a route. Unique vs `#1127` delayed floor→wall and `#1013` immediate walk-blockers.
- Queued **#1161** snaps Chessboard Lich `MAP_ROTATE` / `MIRROR_INVERT` (`occupancyMapRotateUnseal.ts`). Board-wide 90° clockwise or horizontal flip (`N = 16`) plus boss teleport to `(7, 7)`. Snap leftover / portal / wall dests onto the original player battle graph; destack stacked landings; unique-corridor hops **stay**; drop dests that cannot legalize rather than punch. Unique vs `#755` Twin Flank (point-reflect) and `#859` greedy one-step `moveToward`.

None of these helpers is wired from WorldExploration / `worldFeatures.ts` / `useBossSystem` / `simulate.ts`. Live `generateEnemies` still scatters. Spent Bridge already exists on `main` wave 3; Slipstream / Cinder Barrel already exist on `main` wave 2; `MAP_ROTATE` / `MIRROR_INVERT` are live Chessboard Lich kit. VALIDATE of currently-live catalog ids already needs this epoch.

VALIDATE epoch after 10-26-005 triune-pads: **spent-bridge unseal → slipstream unseal → cinder-barrel unseal → map-rotate unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #1127 / #1146 / #1154 / #1161 to keep keep-clear art.

---

## 7. New remount spies — leftover-Doka honour before portal persist after keep stamps

`WDEAD-2026-10-26-006` named portal/victory throw leftover rename and one-shot leftover honour. It did **not** name leftover-Doka honour onto the remount lock **before portal persist** after those Doka keep stamps:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#1129** | `victoryDokaKeepRemountPortalCreditWriteSkip.ts` | reads `#774` `pbv_victory_doka_keep_remount_slotN` | Honour replica Doka (250) onto the remount lock before portal persist so leftover shop writes 250, not Play-entry 200. Distinct from `#774` heal/shop, `#869` death, `#979` rename, `#1028` feat/GameKey. |
| **#1145** | `oneShotDokaKeepRemountPortalCreditWriteSkip.ts` | reads `#800` `pbv_oneshot_doka_keep_remount_slotN` | Same honour after one-shot Doka keep then portal persist. Distinct from `#800` heal/shop, `#877` death, `#986` rename, `#1029` feat/GameKey, `#1129` victory Doka. |
| **#1147** | `gameKeyDokaKeepRemountPortalCreditWriteSkip.ts` | reads `#811` `pbv_gamekey_doka_keep_remount_slotN` | Same honour after GameKey keep then portal persist. Distinct from `#811` heal/shop, `#900` death, `#1019` rename, `#1031` feat/GameKey, `#1129` victory. |
| **#1149** | `featDokaKeepRemountPortalCreditWriteSkip.ts` | reads `#812` `pbv_feat_doka_keep_remount_slotN` | Same honour after feat Doka keep then portal persist. Distinct from `#812` heal/shop, `#909` death, `#992` rename, `#1032` feat/GameKey additive, `#1147` GameKey. |
| **#1151** | `bossRushDokaKeepRemountPortalCreditWriteSkip.ts` | reads `#864` `pbv_boss_rush_doka_keep_remount_slotN` | Same honour after Boss Rush Doka keep then portal persist. Distinct from `#864` heal/shop, `#866` death, `#1020` rename, `#1025` feat/GameKey. |
| **#1153** | `spendKeepRemountPortalCreditWriteSkip.ts` | reads `#926` `pbv_spend_keep_remount_slotN` | Honour replica **post-spend** Doka onto the remount lock before portal persist. Distinct from `#926` shop, `#938` death, `#1002` rename, `#1129` credit stamp. |
| **#1157** | `absoluteDokaThrowKeepRemountPortalCreditWriteSkip.ts` | reads `#964` `pbv_absolute_doka_throw_keep_remount_slotN` | Honour replica Doka after shop/heal throw-after-accept then portal persist. Distinct from `#964` heal/shop, `#969` death, `#977` rename, `#1129` victory credit. |

Lab occupancy replay stays generate → destack → … → triune-pads (10-26-005) then **spent-bridge → slipstream → cinder-barrel → map-rotate**, all React-free. Reports add `spentBridgeUnseal` / `slipstreamUnseal` / `cinderBarrelUnseal` / `mapRotateUnseal` / `victoryDokaKeepPortal` / `oneShotDokaKeepPortal` / `gameKeyDokaKeepPortal` / `featDokaKeepPortal` / `bossRushDokaKeepPortal` / `spendKeepPortal` / `absoluteDokaThrowKeepPortal`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-26-006 **plus** #1129 / #1145 / #1147 / #1149 / #1151 / #1153 / #1157), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, Play-entry Doka after portal persist following those keeps.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` (#1141) or `mapGen.simulate` as the lab.

---

## 8. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–18 / drops 10–18 / elite 10–18 / Tables J–Q / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 19 / FSN drop 19 / elite 19 / Table R (same-calendar-day #1172 / #1170 / #1174 stay next cron).

---

## 9. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-27-001 | Owner `enabledWaves` must name 18 (union ingest of WDD wave 18) | P1 |
| WDEAD-2026-10-27-002 | Ingest FSN drop 18 and EED Tally/Rank/Spike/Odd; ENC-RUSH-67…70 teach Table P, not Table Q | P1 |
| WDEAD-2026-10-27-003 | `FAMILY_TYPES` stays seven; skip `dodeca_prelate` while remaining cap &lt; 12; Stave Post legal at remaining ≥ 1 | P1 |
| WDEAD-2026-10-27-004 | Rush Table Q must exist without `roomIndex > 9` | P1 |
| WDEAD-2026-10-27-005 | Encounter formations must compose with Spent Bridge / Slipstream / Cinder Barrel / MAP_ROTATE unseals after the triune-pads epoch | P1 |
| WDEAD-2026-10-27-006 | Simulation Laboratory spies leftover-Doka honour before portal persist after keep stamps, and reports spent-bridge / slipstream / cinder-barrel / map-rotate columns — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-27.md`](./ACTION_IDS_WDEAD_2026-10-27.md).
