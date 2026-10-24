# World, Dungeon & Encounter Admin Designer — 2026-10-24

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-da03ee72-cbb0-483f-b978-35e5bb5c3b09`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-23 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](https://github.com/Mr-Melic/stralt/pull/394) — wave-4 mix, family HP wipe, EED + FSN ingest, Rush Table C (`WDEAD-2026-09-22-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/451) — wave-5 mix, `bindWhileAlive`, Rush Table D (`WDEAD-2026-09-23-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-24.md`](https://github.com/Mr-Melic/stralt/pull/534) — waves 6–7, relative encounter objectives (`WDEAD-2026-09-24-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-25.md`](https://github.com/Mr-Melic/stralt/pull/593) — `whiteSanctuary`, Rush Table G + jackpot `complete(9)` (`WDEAD-2026-09-25-001` … `008`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/615) — destack/wander dump compose, Death Realm pending, modifier identity (`WDEAD-2026-09-26-001` … `004`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-27.md`](https://github.com/Mr-Melic/stralt/pull/684) — wave 9 mix, FSN 9–10 / EED ingest, Rush H/I, dump-floor-2 / choke / joint (`WDEAD-2026-09-27-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-28.md`](https://github.com/Mr-Melic/stralt/pull/739) — waves 10–11 mix, elite wave 10, knockback/swap/Lich/ghost compose, last-live chance-0, liveWxFlag honesty, death-cut remount spy (`WDEAD-2026-09-28-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-29.md`](https://github.com/Mr-Melic/stralt/pull/769) — EED Pace/Nail/Flush + FSN drop 11, elite wave 11 / `penta_prelate`, Rush Table J, twin-flank/midpoint/VOID + landing tax, portal-XP-keep remount spy (`WDEAD-2026-09-29-001` … `005`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-21.md`](https://github.com/Mr-Melic/stralt/pull/829) — WDD wave 12, EED Bash/Dry/Hood + FSN drop 12, elite wave 12 / `sept_prelate`, Rush Table K, Enthroned Void ANCHOR_TILES, keep-remount heal-wipe spy (`WDEAD-2026-10-21-001` … `006`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-22.md`](https://github.com/Mr-Melic/stralt/pull/908) — WDD waves 13–14, EED Both/Heave + FSN drops 13–14, elite waves 13–14 / `six_prelate` / `oct_prelate`, Rush Tables L–M, spike/lava/moveToward/king/erratic/shock + board-transform landing tax, remount HP / Rush Doka / one-shot / GameKey death-cut spy (`WDEAD-2026-10-22-001` … `006`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-23.md`](https://github.com/Mr-Melic/stralt/pull/932) — ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL compose after shock; feat / portal-XP / victory-XP / leftover-XP remount death-cut + spend keep + Doka-heal double-charge spy (`WDEAD-2026-10-23-001` … `002`). **Queued, not on `main`.** Explicitly deferred WDD wave 15, FSN drop 15, elite wave 15, and Rush Table N until those catalogs were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-24.md`](./ACTION_IDS_WDEAD_2026-10-24.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDEAD-2026-10-23-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and rails after #932** (WDD waves 15–16, FSN drops 15–16, elite waves 15–16 / `nine_prelate` / `dec_prelate`, Rush Tables N–O; adjacent-minion / BOARD_CLAIM / Void Rift / generate-time hazard unseals; spend-keep death-cut; shop/heal throw Doka keep + death-cut; throw-after-accept Doka-heal double-charge; rename/upgrade after shop-heal throw keep, victory / one-shot / feat Doka keep, and spend keep) would be forked if the owner pack were implemented from 10-23 alone.

Do **not** invent WDD wave 17, FSN drop 17, elite wave 17, or Rush Table P. No readable WDD wave-17 sibling as of this freeze. Queued **#993** (`WDD-2026-10-24-001`) is a readable wave-16 catalog — ingest it; do not invent a second copy. Queued **#1005** / **#997** / **#1004** / **#1006** / **#1002** are readable drop-16 / elite-16 / Table O / EED Gaunt / spend-keep rename siblings — ingest by union; do not invent extra ACTION_IDs. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / **#949** / **#993** land. **#680** / **#719** / **#786** / **#848** / **#902** / **#949** / **#993** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-16 ids**, do not overlay from Admin, do not restack that file in this program.

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

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP / spend keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, double-charge a Doka-heal whose replica HP already landed (parsed success **or** throw-after-accept), honour Play-entry Doka after a shop/heal `saveBattleStats` throw-after-accept, or debit rename/upgrade from Play-entry after a shop/heal throw keep, a victory Doka keep, or a spend keep.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / #908 / **#932** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / **#949** / **#993** WDD | Waves 4–**16** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 17. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 / **#956** / **#1005** FSN | Drops 4–**16**. Do not invent drop 17. Skip `FSN-GAUNT-HOLD/OCT` while remaining cap < 8. Skip `FSN-POISE-HOLD/NINE` while remaining cap < 9. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 / **#957** / **#1006** EED | Tide…Dry/Lean/Odd then Gaunt/Even/Brick/Orth. ENC-RUSH-55…58 teach Table M, not Table N. ENC-RUSH-59…62 teach Table N, not Table O. Do not invent a 10-24 encounter catalog beyond #1006. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 / **#941** / **#997** elite | Waves 4–**16**. Second roll. Never concatenate `FAMILY_TYPES`. Skip `nine_prelate` while remaining cap < 9. Skip `dec_prelate` while remaining cap < 10. Do not invent elite 17. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** boss bible | Tables C–**O**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table P. Do not restack Bone on N3. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| #914 / #920 / #925 occupancy | ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. **10-23-001 already owns these.** |
| **#933** adjacent minion `SpawnData` / **#965** `BOARD_CLAIM` 2×2 / **#970** Void Rift walk-tax / **#976** generate-time lava/ice/spikes | **New occupancy epoch after ink-veil.** Unique-corridor landings stay legal. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | Victory / one-shot / GameKey Doka. **10-22-006 already owns the spy.** |
| #909 / #912 / #918 / #919 remount death-cut after feat / portal-XP / victory-XP / leftover-XP keep | **10-23-002 already owns the spy.** |
| #926 spend keep (shop honour) | **10-23-002 already owns the shop/heal spy.** |
| #927 Doka-heal double-charge skip (parsed success) | **10-23-002 already owns the spy.** Do not invent a death-cut for #927. |
| **#938** spend-keep remount death-cut | Reads `#926` `pbv_spend_keep_remount_slotN`. Distinct from `#926` heal/shop honour. **New lab spy.** |
| **#964** shop/heal throw Doka keep | New stamp `pbv_absolute_doka_throw_keep_remount_slotN`. Distinct from `#926` rename/upgrade debit and `#854` parsed HP. **New lab spy.** |
| **#969** shop/heal throw Doka death-cut | Reads `#964`. Distinct from `#964` heal/shop honour. **New lab spy.** |
| **#971** throw-after-accept Doka-heal double-charge skip | Reads `#860` `pbv_absolute_hp_throw_keep_remount_slotN`. Distinct from `#927` parsed-success `#854` key. **New lab spy.** |
| **#977** rename/upgrade after shop/heal throw keep | Reads `#964`. Distinct from `#926` (different stamp) and from `#969` death. **New lab spy.** |
| **#979** rename/upgrade after victory Doka keep | Reads `#774` `pbv_victory_doka_keep_remount_slotN`. Distinct from `#869` death and `#774` heal/shop. **New lab spy.** |
| **#986** rename/upgrade after one-shot Doka keep | Reads `#800` `pbv_oneshot_doka_keep_remount_slotN`. Distinct from `#877` death and `#800` heal/shop. Distinct from `#979` victory stamp. **New lab spy.** #987 is a duplicate queue-break of the same sidecar — consume, do not fork. |
| **#992** rename/upgrade after feat Doka keep | Reads `#812` `pbv_feat_doka_keep_remount_slotN`. Distinct from `#909` death and `#812` heal/shop. Distinct from `#979` / `#986` (different stamps). **New lab spy.** |
| **#1002** rename/upgrade after spend keep | Reads `#926` `pbv_spend_keep_remount_slotN`. Distinct from `#926` heal/shop, `#938` death, `#977` (different stamp), `#979` (replica rose). **New lab spy.** |
| #742 / #756 / #759 / #764 / #767 portal-XP-keep remount | **09-29-005 already owns the heal/shop spy.** |
| #774 / #800 / #807 / #811 / #812 / #813 keep remount heal-wipe | **10-21-006 already owns the spy.** |
| #698 / #705 / #710 death-cut remount | **09-28-006 already owns the spy.** |
| #657 persist | Keep-then-additive. **09-27-007 already owns the spy.** |
| #334 / #415 / #585 / #741 / #934 / #996 AFDA | Honesty copy. Not owner knobs. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 / #960 LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 / #929 / #980 EBA | Consume, do not duplicate `EBA-*`. |
| #999 AEE | Consume, do not duplicate `AEE-*`. |
| #991 Expansion Director | Consume. Not a WDEAD overlay. |
| #901 portal whirlpool extract | Consume. Not a new occupancy epoch. |
| #911 pack kit assign | Combat honesty. Lab reports pack kits vs catalog; do not mint a new owner probability. Consume. |
| #910 / #913 / #915 / #916 / #917 / #921 / #922 / #923 / #924 / #947 / #967 / #974 / #978 combat share | Execute-gate honesty. Not a WDEAD overlay. |
| #904 Boss Rush recap wallet/level feats | Consume. Lab must not attach recap unlocks. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-23 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10. Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. Rest `maxLevel: 9999`. Region match is still a closed interval. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract. `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute. Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Do not re-issue. |
| `WDEAD-2026-09-28-001`…`007` | Yes (queued #739) | `enabledWaves` still cannot name 10 or 11 on `main`. `FAMILY_TYPES` is still seven. Do not re-issue. |
| `WDEAD-2026-09-29-001`…`005` | Yes (queued #769) | Do not re-issue 09-29-005 for later death-cut sidecars. |
| `WDEAD-2026-10-21-001`…`006` | Yes (queued #829) | Wave 12 / drop 12 / elite 12 / Table K / ANCHOR / keep-remount heal-wipe stay those IDs. Do not re-issue. |
| `WDEAD-2026-10-22-001`…`006` | Yes (queued #908) | Waves 13–14 / drops 13–14 / elite 13–14 / Table L–M / spike…shock compose / remount HP + Rush/one-shot/GameKey death-cut stay those IDs. Do not re-issue 10-22-001 if `enabledWaves` still cannot name 13 or 14. Do not re-issue 10-22-004 if L or M still cannot exist without `roomIndex > 9`. Do not re-issue 10-22-005 if spike/lava/shock/erratic compose is still missing. Do not re-issue 10-22-006 if remount HP / Rush Doka / one-shot / GameKey death-cut is still unspied. |
| `WDEAD-2026-10-23-001`…`002` | Yes (queued #932) | Illusion / larva / ink-veil compose and feat / portal-XP / victory-XP / leftover-XP death-cut / spend-keep **shop** / parsed-success Doka-heal double-charge stay those IDs. Post-ink adjacent-minion / BOARD_CLAIM / Void Rift / generate-time hazard unseals, spend-keep **death-cut**, shop/heal throw Doka keep + death-cut, throw-after-accept heal double-charge, and rename/upgrade after throw keep / victory / one-shot / feat / spend keep are **this** run. Do not re-issue 10-23-001 if ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL compose is still missing. Do not re-issue 10-23-002 if feat / portal-XP / victory-XP / leftover-XP death-cut / spend keep / Doka-heal double-charge is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5723; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.test.ts` 239 locks `FAMILY_VARIANT_CHANCE = 0.3`; 276–287 lock exactly those seven). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300).

---

## 2. WDD waves 15–16 are now readable — ingest by id union; do not invent wave 17

`WDEAD-2026-10-23` **refused to invent** wave 15. Queued **#949** (`WDD-2026-10-23-001`) now unions waves 4–14 onto `WORLD_FEATURES` and adds **16** wave-15 ids. Same-day **#993** (`WDD-2026-10-24-001`) unions that file set and adds **16** wave-16 ids (`LATEST_CATALOG_WAVE = 16` on that branch).

Wave 15 (`#949`):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-LAST_SEAM` | Last Seam | Last-stride tax when remaining MP is 0 |
| `WF-HAZ-RICH_CINDER` | Rich Cinder | Orb hunts highest HP% |
| `WF-TRP-CAST_PLATE` | Cast Plate | First SpellConfig cast from the plate taxes |
| `WF-TER-HUSH_CURTAIN` | Hush Curtain | Walkable LoS curtain; 1 AP parts while adjacent then reseals / 2 AP smashes |
| `WF-OBS-SPENT_SILL` | Spent Sill | Spent-AP end-turn unlatch |
| `WF-ZON-EMPTY_FONT` | Empty Font | 0 remaining AP heal |
| `WF-TEL-EMPTY_STEP` | Empty Step | 0-AP pads |
| `WF-PRT-VOW_GATE` | Vow Gate | **Exploration-only.** Illegal in dungeon / boss rush |
| `WF-INV-SHEATH_FILE` | Sheath File | Two elites; second AP-locked until the first dies or the player ends adjacent. Counts as hostiles for map-clear |
| `WF-ELT-ORTH_PICKET` | Orth Picket | Elite stands on shared row or column. Stands from map start in dungeon / boss rush so map-clear cannot softlock |
| `WF-TRS-LINE_CACHE` | Line Cache | Rank/file chest |
| `WF-SPL-ORTH_TUTOR` | Orth Tutor | File-share live teach one-cast |
| `WF-RSK-PLANT_OATH` | Plant Oath | Voluntary cash-out-planted wager |
| `WF-MOD-ACT_LOCK` | Act Lock | Walk-then-act lock after AP spend |
| `WF-EVT-CLOSE_HOUR` | Close Hour | End-adjacent-at-least-once event |
| `WF-ENV-FILE_SHADE` | File Shade | Shade-line end-turn tax unless sharing a hostile’s rank or file |

Wave 16 (`#993`):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-SPENT_SEAM` | Spent Seam | Spent-AP step tax when remaining AP is 0 (inverse Last Seam 0-MP) |
| `WF-HAZ-LEAN_CINDER` | Lean Cinder | Orb hunts fewest remaining AP |
| `WF-TRP-STRIDE_PLATE` | Stride Plate | First occupancy-walk leaving the plate taxes |
| `WF-TER-PIVOT_SLAB` | Pivot Slab | Walk-block open-LoS slab; 1 AP pivots / 2 AP smashes |
| `WF-OBS-HURT_SILL` | Hurt Sill | Wounded end-turn unlatch |
| `WF-ZON-HURT_FONT` | Hurt Font | Below-50% heal |
| `WF-TEL-SPARE_STEP` | Spare Step | Leftover-AP pads |
| `WF-PRT-STRIDE_GATE` | Stride Gate | **Exploration-only.** Illegal in dungeon / boss rush |
| `WF-INV-GUARD_FILE` | Guard File | Two elites; first walk-locked until the second dies or the player ends ≥4 away. Counts as hostiles |
| `WF-ELT-DIAG_PICKET` | Diag Picket | Elite stands off shared row and column (inverse Orth). Stands from map start in dungeon / boss rush |
| `WF-TRS-DIAG_CACHE` | Diag Cache | Off-axis chest |
| `WF-SPL-DIAG_TUTOR` | Diag Tutor | Off-axis live teach one-cast |
| `WF-RSK-SPENT_OATH` | Spent Oath | Voluntary cash-out-spent wager |
| `WF-MOD-CAST_LOCK` | Cast Lock | Walk-then-cast lock after SpellConfig |
| `WF-EVT-DIAG_HOUR` | Diag Hour | End-off-axis-at-least-once event |
| `WF-ENV-SPARE_DRAFT` | Spare Draft | Leftover-AP end-turn tax unless remaining AP is 0 |

Owner `enabledWaves` on `main` still cannot name 10, 11, 12, 13, 14, **15**, or **16**. Consume the readable ids from #344…#993. One roll budget still includes the 22 live modifiers (`WDEAD-2026-09-01-003` / `09-02-003`). Death Realm stays `[]`. Do not overlay from Admin. Do not restack `worldFeatures.ts`.

---

## 3. FSN drops 15–16 / EED Dry…Orth / elite waves 15–16 / Tables N–O — ingest; do not concatenate

| Catalog | PR | What the pack must name | Skip / honesty |
| :--- | :--- | :--- | :--- |
| FSN drop 15 | #956 | Wave **14** packs: `FSN-GAUNT-STEP`, `FSN-GAUNT-SIP`, `FSN-EVEN-ORTH`, `FSN-BRICK-WAKE`, `FSN-GAUNT-GATE`, `FSN-ORTH-TRI`, `FSN-GLYPH-FULL`, `FSN-GAIT-WATCH`, `FSN-GAUNT-CHOIR`, `FSN-GAUNT-COURT`, `FSN-GAUNT-QUIET`, `FSN-STILL-GRACE`, `FSN-LONE-AXIS`, `FSN-DEBT-ORBIT`, `FSN-PAIR-GIFT`, `FSN-GAUNT-HOLD` (+ named variants including `/OCT`) | Skip `FSN-GAUNT-HOLD/OCT` while remaining `ENEMY_SUMMON_CAP` < 8 (live cap is **2**). Band 0 honesty shows leftover drop-14 ids instead of claiming Gaunt |
| FSN drop 16 | #1005 | Wave **15** packs: `FSN-POISE-STEP`, `FSN-POISE-SIP`, `FSN-KNIGHT-QUAD`, `FSN-PIT-AXIS`, `FSN-POISE-GATE`, `FSN-SPENT-FULL`, `FSN-RIME-FILE`, `FSN-WATCH-SIP`, `FSN-POISE-CHOIR`, `FSN-SHOVE-DRIFT`, `FSN-POISE-QUIET`, `FSN-HOLLOW-SWAP`, `FSN-LONE-HAZARD`, `FSN-STRIKE-TAX`, `FSN-CROSS-POISE`, `FSN-POISE-HOLD` (+ `/NINE` / `/BOUNCE` / `/KENNEL` / `/NUDGE`) | Skip `FSN-POISE-HOLD/NINE` while remaining cap < 9. Do **not** mint `FSN-*` that require Wave **16** families — that is drop 17. Band 0 honesty shows leftover drop-15 Gaunt ids instead of claiming Poise |
| EED Dry/Lean/Odd | #957 | `ENC-TEACH-15`, `ENC-DRY-02`, `ENC-LEAN-01`, `ENC-ODD-02`, `ENC-HAZ-29`/`30`, `ENC-SPELL-29`/`30`, `ENC-REST-15`, `ENC-BRANCH-15`, `ENC-RUSH-55`…`58` | Spends leftover **drop-14** packs + Wave **14** WFs. `ENC-RUSH-55`…`58` teach **Table M**, not Table N. Never `FSN-LEAN-HOLD/SIX` while cap is 2 |
| EED Gaunt/Even/Brick/Orth | #1006 | `ENC-TEACH-16`, `ENC-GAUNT-01`, `ENC-BARE-01`, `ENC-EVEN-02`, `ENC-WAKE-01`, `ENC-GATE-03`, `ENC-TRI-01`, `ENC-DUMP-01`, `ENC-CURTAIN-01`, `ENC-RUNE-01`, `ENC-HAZ-31`/`32`, `ENC-SPELL-31`/`32`, `ENC-REST-16`, `ENC-BRANCH-16`, `ENC-RUSH-59`…`62` | Spends leftover **drop-15** Wave **14** packs + Wave **15** WFs + Table N. `ENC-RUSH-59`…`62` teach **Table N**, not Table O. Does not consume same-day Wave 16 families / FSN drop 16 / WDD wave 16. Vow Gate rest/overworld only. `branch: gaunt \| even \| brick \| orth` by metadata |
| Elite wave 15 | #941 | 31 families including `nine_prelate` and `poise_prelate` | Second roll after the seven live `FAMILY_TYPES`. Skip `nine_prelate` until remaining cap ≥ 9. `poise_prelate` is legal at remaining ≥ 1. `shove_marker` / `drift_gifter` fail closed until `forcedMovedThisTurn` exists. Never concatenate `FAMILY_TYPES` |
| Elite wave 16 | #997 | 31 families including `dec_prelate`, `tally_prelate`, `tally_mender`, `cadence_primer`, `purse_turner`, `shove_gifter` | Skip `dec_prelate` until remaining cap ≥ 10 (2×5, counts as 10). `tally_prelate` is legal at remaining ≥ 1. `shove_gifter` fails closed until the caster-authored writer exists. `verse_tallier` fails closed until `lastResolvedSpellId` exists. Do not invent elite 17 |
| Rush Table N | #951 | `N0`–`N3`: `wick_exorcist+march_prefect` … `must_preceptor+bias_prebendary` | New `roomIndex` namespace. Never canister `roomIndex > 9`. Jackpot `complete(9)` stays mandatory. Do not restack Bone on N3 |
| Rush Table O | #1004 | `O0`–`O3`: `boot_subprior+lock_marshal` … `mute_notary+dilate_organist` | After one Table N clear. Compass never on Caliga. Metronome never on Cista. Split-rook never on Plaster. Antiphoner never on Tabula. Wave 17 boss ids stay Rush-only. Do not invent Table P |

`FAMILY_TYPES` on `main` is still the seven overlay families (`spawnPolicy.ts` 49–57). Wave 15–16 families are a **second** roll, same as waves 4–14.

---

## 4. New occupancy epoch after ink-veil — adjacent minions / BOARD_CLAIM / Void Rift / generate-time hazards

`WDEAD-2026-10-23-001` named ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL. After #932:

- Queued **#933** snaps `SPAWN_MINIONS` / `SPLIT_ROOKS` / `SCROLL_SUMMON` / `PHANTOM_SPAWN` (`occupancyAdjacentSpawnUnseal.ts`). `getAdjacentTiles` (`allTiles` = floor OR portal) plants occupancy-blind `SpawnData`. Unique vs `#914` IllusionData (`isReal` copy is the only legal hit) and vs `#711`/`#732` boss-spawn / advance rasters: these are **required adjacent extras**. Occupancy floods still walk portals, so unique-bridge unseal never runs if a minion sits on the gate. Unique-corridor landings stay legal.
- Queued **#965** snaps Chessboard Lich `BOARD_CLAIM` (`occupancyBoardClaimUnseal.ts`). Random 2×2 AP-tax zone with `Math.floor(Math.random() * 14)` on a 16×16 board and **no** `allTiles` filter. Unique vs `#858` board-**transform** landing tax (combatant landing) and vs `#925` 3–4 INK_VEIL glyphs: this is the 2×2 `boardClaimZone` marker. Occupancy 1+1 unseal cannot move the zone. Unique-corridor and player-covering claims stay legal (walkable AP tax).
- Queued **#970** snaps Void Rift (`occupancyVoidRiftUnseal.ts`). One random `floor` cell per player turn, no fight-graph check, −3 HP walk dest. Unique vs `#765` `VOID_TILES` Manhattan-2 voids and vs `#925` INK_VEIL `allTiles` 3–4 glyphs: this is one floor-only `voidRiftTile`. Occupancy cannot move the marker. Player-covering and occupied fight-graph dests stay legal.
- Queued **#976** snaps generate-time / modifier-time `eligibleHazard` (`occupancyEligibleHazardUnseal.ts`). WX picks 1–3 (generate) or 3–8 (modifier) floor cells with no fight-graph check. Unique vs `#846` `SPIKE_ON_LAND` knight dest and `#855` `LAVA_TRAIL` origin: this is `GameMap.hazardTiles` (lava/ice/spikes) planted at generate / portal-transition. Production skips portals and the center 7×7. Occupancy cannot move hazard tiles.

Fight-graph snap onto a walkable cell; drop leftover-island dests rather than punch. Unique-corridor landings stay legal. None of these helpers is wired from WorldExploration / `useBossSystem` / `simulate.ts`.

VALIDATE epoch after 10-23-001 ink-veil: **adjacent-minion unseal → board-claim unseal → void-rift unseal → eligible-hazard unseal**. Report those columns rather than treating punched / snapped extras as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #933 / #965 / #970 / #976 to keep keep-clear art.

---

## 5. New remount spies — spend-keep death-cut, shop/heal throw Doka, throw heal double-charge, rename after throw / victory / one-shot / feat / spend keep

`WDEAD-2026-10-23-002` named feat / portal-XP / victory-XP / leftover-XP death-cut, spend-keep **shop** honour, and parsed-success Doka-heal double-charge. It did **not** name shop/heal throw Doka, rename after throw / victory keep, rename after one-shot / feat keep, **or** rename after spend keep:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#938** | `spendKeepRemountDeathCutWriteSkip.ts` | reads `#926` `pbv_spend_keep_remount_slotN` | Death-cut base is replica wallet after rename/upgrade throw-after-debit, not Play-entry. Distinct from `#926` heal/shop. |
| **#964** | `absoluteDokaThrowKeepRemountWriteSkip.ts` | **new** `pbv_absolute_doka_throw_keep_remount_slotN` | Shop / Doka-heal `saveBattleStats` throw-after-accept. Distinct from `#926` rename/upgrade debit and `#854` parsed HP. Explicit `#err` must not stamp. |
| **#969** | `absoluteDokaThrowKeepRemountDeathCutWriteSkip.ts` | reads `#964` | Death-cut base is replica Doka (190 → 114 / 150 → 90), not Play-entry 200 → 120. Distinct from `#964` heal/shop. |
| **#971** | `absoluteHpThrowKeepRemountHealSpendWriteSkip.ts` | reads `#860` `pbv_absolute_hp_throw_keep_remount_slotN` | Throw-after-accept Doka-heal then remount from Play-entry **below** derived maxHp would charge twice. Distinct from `#927` parsed-success `#854` key. Do not invent a death-cut for this. |
| **#977** | `absoluteDokaThrowKeepRemountRenameSpendWriteSkip.ts` | reads `#964` | Rename/upgrade debit base is replica wallet, not Play-entry. Distinct from `#926` (different stamp) and `#969` death. |
| **#979** | `victoryDokaKeepRemountRenameSpendWriteSkip.ts` | reads `#774` `pbv_victory_doka_keep_remount_slotN` | Rename/upgrade debit base is replica **risen** wallet. Distinct from `#869` death and `#774` heal/shop. Distinct from `#977` (replica **dropped**). |
| **#986** | `oneShotDokaKeepRemountRenameSpendWriteSkip.ts` | reads `#800` `pbv_oneshot_doka_keep_remount_slotN` | Rename/upgrade debit base is replica **risen** pickup. Distinct from `#877` death and `#800` heal/shop. Distinct from `#979` victory stamp. #987 duplicates this sidecar (queue break) — consume, do not fork. |
| **#992** | `featDokaKeepRemountRenameSpendWriteSkip.ts` | reads `#812` `pbv_feat_doka_keep_remount_slotN` | Rename/upgrade debit base is replica **risen** feat grant. Distinct from `#909` death and `#812` heal/shop. Distinct from `#979` / `#986`. |
| **#1002** | `spendKeepRemountRenameSpendWriteSkip.ts` | reads `#926` `pbv_spend_keep_remount_slotN` | Rename/upgrade debit base is replica **dropped** wallet. Distinct from `#926` heal/shop, `#938` death, `#977` (different stamp), `#979` (replica rose). |

Lab occupancy replay stays generate → destack → … → shock (10-22-005) → illusion → larva → ink-veil (10-23-001) then **adjacent-minion → board-claim → void-rift → eligible-hazard**, all React-free. Reports add `adjacentSpawnUnseal` / `boardClaimUnseal` / `voidRiftUnseal` / `eligibleHazardUnseal` / `spendKeepDeathCut` / `absoluteDokaThrowKeep` / `absoluteDokaThrowDeathCut` / `absoluteHpThrowHealSpend` / `absoluteDokaThrowRenameSpend` / `victoryDokaKeepRenameSpend` / `oneShotDokaKeepRenameSpend` / `featDokaKeepRenameSpend` / `spendKeepRenameSpend`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-23-002 **plus** #938 / #964 / #969 / #971 / #977 / #979 / #986 / #992 / #1002), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, Play-entry Doka honour after a shop/heal throw keep, and Play-entry rename debit after spend keep.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` or `mapGen.simulate` as the lab.

---

## 6. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–16 / drops 10–16 / elite 10–16 / Tables J–O / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`. Do not invent WDD wave 17 / FSN drop 17 / elite 17 / Table P.

---

## 7. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-10-24-001 | Owner enabledWaves can name catalogWave 15 and 16 — ingest WDD waves 15–16 by id union; Vow Gate and Stride Gate stay exploration-only | P0 |
| WDEAD-2026-10-24-002 | Encounter and dungeon room pools ingest EED Dry/Lean/Odd and Gaunt/Even/Brick/Orth plus FSN drops 15–16 by id union — skip OCT and NINE while summon cap is 2 | P1 |
| WDEAD-2026-10-24-003 | Elite waves 15–16 remain a second roll after FAMILY_TYPES — skip nine_prelate and dec_prelate while summon cap is 2; never concatenate | P1 |
| WDEAD-2026-10-24-004 | Boss Rush extra tables include N0–N3 and O0–O3 — never canister roomIndex > 9; jackpot complete(9) stays mandatory | P0 |
| WDEAD-2026-10-24-005 | Encounter formations must compose with adjacent-minion / BOARD_CLAIM / Void Rift / generate-time hazard unseals after the ink-veil epoch | P1 |
| WDEAD-2026-10-24-006 | Simulation Laboratory spies spend-keep death-cut, shop/heal throw Doka keep + death-cut, throw heal double-charge, and rename after throw / victory / one-shot / feat / spend keep — still non-RAF | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-10-24.md`](./ACTION_IDS_WDEAD_2026-10-24.md).
