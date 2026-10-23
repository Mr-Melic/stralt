# World, Dungeon & Encounter Admin Designer — 2026-10-23

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-3ca00967-55ef-4f5e-9788-a16510d303d7`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-10-22 briefs**)  
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
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-10-22.md`](https://github.com/Mr-Melic/stralt/pull/908) — WDD waves 13–14, EED Both/Heave + FSN drops 13–14, elite waves 13–14 / `six_prelate` / `oct_prelate`, Rush Tables L–M, spike/lava/moveToward/king/erratic/shock + board-transform landing tax, remount HP / Rush Doka / one-shot / GameKey death-cut spy (`WDEAD-2026-10-22-001` … `006`). **Queued, not on `main`.** Explicitly deferred WDD wave 15, FSN drop 15, elite wave 15, and Rush Table N until those catalogs were readable.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-10-23.md`](./ACTION_IDS_WDEAD_2026-10-23.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDEAD-2026-09-27-*`, `WDEAD-2026-09-28-*`, `WDEAD-2026-09-29-*`, `WDEAD-2026-10-21-*`, `WDEAD-2026-10-22-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, `CRC-*`, `AEE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued occupancy and persist-keep rails after #908** (Void Grandmaster `ILLUSION_SPLIT`, Broodmother Rook `LARVAE_SPAWN`, Pale Archivist `INK_VEIL`; feat / portal-XP / victory-XP / leftover-XP remount death-cut; rename/upgrade spend keep; Doka-heal double-charge skip) would be forked if the owner pack were implemented from 10-22 alone.

Do **not** invent WDD wave 15, FSN drop 15, elite wave 15, or Rush Table N. No same-day WDD / FSN / elite / Rush sibling exists after #902 / #897 / #899 / #903. `CatalogWave` on `main` is still `1 | 2 | 3` until #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 land. **#680** / **#719** / **#786** / **#848** / **#902** restack `worldFeatures.ts` — consume the **readable wave-10 … wave-14 ids**, do not overlay from Admin, do not restack that file in this program.

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

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), write `pbv_pending_death_penalty_*` / arm `deathTriggered`, replay death-cut `saveBattleStats` after a later confirmed credit, honour remount unpaid-death XP from Play-entry, wipe after a portal +10 XP keep remount, wipe after a keep remount of victory Doka / one-shot Doka / victory XP / leftover XP / GameKey / feat claim, wipe remount HP after death / heal / throw-after-accept, wipe remount death after Boss Rush Doka / victory Doka / one-shot Doka / GameKey / feat / portal-XP / victory-XP / leftover-XP keep, stamp a rename/upgrade spend keep then honour a pre-debit wallet, or double-charge a Doka-heal whose replica HP already landed.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / #615 / #684 / #739 / #769 / #829 / **#908** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 WDD | Waves 4–**14** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). Do not invent wave 15. Do not restack `worldFeatures.ts`. |
| #348 / #401 / #459 / #537 / #575 / #612 / #669 / #727 / #794 / #825 / #897 FSN | Drops 4–**14**. Do not invent drop 15. |
| #347 / #396 / #479 / #519 / #574 / #635 / #672 / #737 / #771 / #826 / #885 EED | Tide…Heave. Do not invent a 10-23 encounter catalog. |
| #349 / #405 / #452 / #535 / #558 / #625 / #686 / #752 / #796 / #840 / #899 elite | Waves 4–**14**. Second roll. Never concatenate `FAMILY_TYPES`. Do not invent elite 15. |
| #367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 boss bible | Tables C–**M**. Jackpot `complete(9)` stays mandatory (`#536` / `#803`). Do not invent Table N. |
| #846 / #855 / #859 / #867 / #858 / #863 / #896 occupancy | Spike / lava / greedy `moveToward` / king-step / board-transform landing tax / erratic hop / `SHOCK_TILES`. **10-22-005 already owns these.** |
| **#914** `ILLUSION_SPLIT` / **#920** `LARVAE_SPAWN` / **#925** `INK_VEIL` | **New occupancy epoch after shock.** Unique-corridor copies / larvae / glyphs stay legal. |
| #847 / #854 / #860 remount HP keep | **10-22-006 already owns the spy.** |
| #864 / #866 Boss Rush Doka keep | **10-22-006 already owns the spy.** |
| #869 / #877 / #900 remount death-cut after Doka keep | Victory / one-shot / GameKey Doka. **10-22-006 already owns the spy.** |
| **#909** feat Doka remount death-cut | Reads `#812` `pbv_feat_doka_keep_remount_slotN`. Distinct from `#812` heal/shop honour. **New lab spy.** |
| **#912** portal XP remount death-cut | Reads `#767` `pbv_portal_xp_keep_remount_slotN`. Distinct from 09-29-005 heal/shop spy. **New lab spy.** |
| **#918** victory XP remount death-cut | Reads `#807` `pbv_victory_xp_keep_remount_slotN`. Distinct from `#869` victory Doka. **New lab spy.** |
| **#919** leftover XP remount death-cut | Reads `#813` `pbv_xp_credit_keep_remount_slotN`. Distinct from throw-after-add `#912` / `#918`. **New lab spy.** |
| **#926** rename/upgrade spend keep | Unique key `pbv_spend_keep_remount_slotN`. Inverse of credit stamps (live wallet that did **not drop**). **New lab spy.** |
| **#927** Doka-heal double-charge skip | Reads `#854` `pbv_absolute_hp_keep_remount_slotN`. Distinct from `#854` shop leftover HP honour. **New lab spy.** |
| #742 / #756 / #759 / #764 / #767 portal-XP-keep remount | **09-29-005 already owns the heal/shop spy.** |
| #774 / #800 / #807 / #811 / #812 / #813 keep remount heal-wipe | **10-21-006 already owns the spy.** |
| #698 / #705 / #710 death-cut remount | **09-28-006 already owns the spy.** |
| #657 persist | Keep-then-additive. **09-27-007 already owns the spy.** |
| #334 / #415 / #585 / #741 AFDA | Honesty copy. Not owner knobs. Do not re-issue 09-02-002. |
| #670 / #637 / #748 / #819 / #898 LHIPS | Do not promote to Admin Simulation. |
| #746 / #792 / #817 / #876 EBA | Consume, do not duplicate `EBA-*`. |
| #901 portal whirlpool extract | Consume. Not a new occupancy epoch. |
| **#911** pack kit assign | Combat honesty when the backend catalog misses starter ids. Lab reports pack kits vs catalog; do not mint a new owner probability. Consume. |
| **#910 / #913 / #915 / #916 / #917 / #921 / #922 / #923 / #924** combat share | Execute-gate honesty. Not a WDEAD overlay. |
| **#904** Boss Rush recap wallet/level feats | Consume. Lab must not attach recap unlocks. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 10-22 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10. Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` vs entry `9999`. Rest `maxLevel: 9999`. Region match is still a closed interval. No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Admin is still 15 tabs (`AdminDashboard.tsx` 5610–5626). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract (`EXISTING_MAP_MODIFIER_IDS` 1890–1913). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (`DEFAULT_ELIGIBILITY_LEVEL_MAX` 138). `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read. AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start (`WX` 11970–11974). Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute. Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Do not re-issue. |
| `WDEAD-2026-09-27-001`…`007` | Yes (queued #684) | Do not re-issue. |
| `WDEAD-2026-09-28-001`…`007` | Yes (queued #739) | `enabledWaves` still cannot name 10 or 11 on `main`. `FAMILY_TYPES` is still seven. Do not re-issue 09-28-001…007. |
| `WDEAD-2026-09-29-001`…`005` | Yes (queued #769) | FSN drop 11 / elite 11 / Table J / twin-flank / midpoint / VOID / portal-keep **heal/shop** remount stay those IDs. Do not re-issue 09-29-005 for the new **death-cut** sidecar (#912). |
| `WDEAD-2026-10-21-001`…`006` | Yes (queued #829) | Wave 12 / drop 12 / elite 12 / Table K / ANCHOR / keep-remount heal-wipe stay those IDs. Do not re-issue. |
| `WDEAD-2026-10-22-001`…`006` | Yes (queued #908) | Waves 13–14 / drops 13–14 / elite 13–14 / Table L–M / spike…shock compose / remount HP + Rush/one-shot/GameKey death-cut stay those IDs. Post-shock illusion / larva / ink unseals and feat / portal-XP / victory-XP / leftover-XP / spend / heal-double-charge spies are **this** run. Do not re-issue 10-22-001 if `enabledWaves` still cannot name 13 or 14. Do not re-issue 10-22-002 if FSN drop 13 / ENC-BOTH-01 / ENC-HEAVE-01 still uningested. Do not re-issue 10-22-003 if `FAMILY_TYPES` is still seven / six and oct still illegal at cap 2. Do not re-issue 10-22-004 if L or M still cannot exist without `roomIndex > 9`. Do not re-issue 10-22-005 if spike/lava/shock/erratic compose is still missing. Do not re-issue 10-22-006 if remount HP / Rush Doka / one-shot / GameKey death-cut is still unspied. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

`generateEnemies` still scatters `rollOverworldEnemyCount` (1..8 + depth extras), random chess piece, quadrant + Chebyshev ≥ 4 (`WX` 5711–5723; `spawnPolicy.ts` 31–57). Family overlay is still 30% equal-weight over seven `FAMILY_TYPES` (`spawnPolicy.test.ts` 239 locks `FAMILY_VARIANT_CHANCE = 0.3`). Engine still has **zero** `enemyConfigs` reads in WorldExploration. WX still does not import `worldFeatures`. `MAX_ENEMIES = 20` (`gameConstants.ts` 10). `ENEMY_SUMMON_CAP = 2` (`gameConstants.ts` 300). Kit assignment still passes `currentMap.levelZone` object (`WX` 11920) and still `normalizedSpellPool.find`s catalog rows (`WX` 11921–11923) — #911 fills missing starter kit ids; consume, do not mint a new owner “advanced spell” knob.

---

## 2. No WDD wave 15 / FSN drop 15 / elite 15 / Table N — do not invent them

`WDEAD-2026-10-22` **refused to invent** those catalogs. Search at freeze (`created:>=2026-10-23`, plus open PRs after #908) shows **zero** WDD / FSN / EED / elite / Rush-table siblings. Owner `enabledWaves` on `main` still cannot name 10, 11, 12, 13, or 14. Consume the readable ids from #344…#902 / #348…#897 / #347…#885 / #349…#899 / #367…#903. One roll budget still includes the 22 live modifiers (`WDEAD-2026-09-01-003` / `09-02-003`). Death Realm stays `[]`. Do not overlay from Admin. Do not restack `worldFeatures.ts`.

---

## 3. New occupancy epoch after shock — ILLUSION_SPLIT / LARVAE_SPAWN / INK_VEIL

`WDEAD-2026-10-22-005` named spike / lava / greedy `moveToward` / king-step / Chessboard Lich board-transform landing tax / leader-death erratic hop / `SHOCK_TILES`. After #908:

- Queued **#914** snaps Void Grandmaster `ILLUSION_SPLIT` off portal and leftover crumbs (`occupancyIllusionUnseal.ts`). `getAdjacentTiles` (`allTiles` = floor OR portal) plants occupancy-blind `IllusionData`; `realIndex` 0..2 can pick the boss cell, the gate, or a far-side leftover CA crumb after a `tilesForBossAI` hop. Occupancy 1+1 unseal relocates combatants and **cannot** move illusion markers (`isOccupied` never sees `bossState.illusions`). Unique vs `#711`/`#732` SpawnData and vs `#896` `activeShockTiles`: the `isReal` copy is the only legal hit.
- Queued **#920** snaps Broodmother Rook `LARVAE_SPAWN` (`occupancyLarvaUnseal.ts`). One random orthogonal neighbor can be the gate or a far crumb. Occupancy cannot move `bossState.larvae`, so `SHELL_ARMOR` never drops and clearing never unlocks. Unique vs IllusionData / ShockTile / glyphedTiles / hazardTiles. Empty adj plants nothing (no origin copy).
- Queued **#925** snaps Pale Archivist `INK_VEIL` (`occupancyInkVeilUnseal.ts`). Raster-scans `allTiles` and plants 3–4 occupancy-blind stealth/trap `glyphedTiles`. Unique vs Enthroned Void’s two required-step `DAMAGE_IMMUNE` glyphs (`#770` / 10-21-005): this is the 3–4 INK_VEIL shuffle (not DAMAGE_IMMUNE, not a `turnsLeft` tick). A glyph on the gate or far crumb never taxes the player route.

Fight-graph snap onto a walkable cell; drop leftover-island dests rather than punch. Unique-corridor landings stay legal (copies on an already-walkable fight-graph cell do not need a punch). None of these helpers is wired from WorldExploration / `useBossSystem` / `simulate.ts`. Occupancy 1+1 unseal still cannot move markers.

VALIDATE epoch after 10-22-005 shock: **illusion unseal → larva unseal → ink-veil unseal**. Report those columns rather than treating punched / snapped copies as authored COURT art. Drop a slot that cannot destack; do not punch walls; do not hop a portal cut; do not disable #914 / #920 / #925 to keep keep-clear art.

---

## 4. New remount spies — feat / portal-XP / victory-XP / leftover-XP death-cut, spend keep, Doka-heal double charge

`WDEAD-2026-10-22-006` named remount HP keep, Boss Rush Doka keep, and one-shot / GameKey death-cut. It did **not** name:

| PR | Sidecar | Stamp key | Polarity |
| :--- | :--- | :--- | :--- |
| **#909** | `featDokaKeepRemountDeathCutWriteSkip.ts` | reads `#812` `pbv_feat_doka_keep_remount_slotN` | Death-cut base is replica feat Doka, not Play-entry. Distinct from `#812` heal/shop. |
| **#912** | `portalXpKeepRemountDeathCutWriteSkip.ts` | reads `#767` `pbv_portal_xp_keep_remount_slotN` | Death-cut base is replica leftover 110, not Play-entry 100. Distinct from 09-29-005 heal/shop. |
| **#918** | `victoryXpKeepRemountDeathCutWriteSkip.ts` | reads `#807` `pbv_victory_xp_keep_remount_slotN` | Death-cut base is replica victory leftover. Distinct from `#869` victory **Doka**. |
| **#919** | `xpCreditKeepRemountDeathCutWriteSkip.ts` | reads `#813` `pbv_xp_credit_keep_remount_slotN` | **Successful** leftover (no throw). Distinct from throw-after-add `#912` / `#918`. |
| **#926** | `spendKeepRemountWriteSkip.ts` | **new** `pbv_spend_keep_remount_slotN` | Inverse of credit stamps: live wallet that did **not drop** after rename/upgrade throw-after-debit is the pre-debit snapshot. Honouring it on remount shop is a free BuffShop item. |
| **#927** | `absoluteHpKeepRemountHealSpendWriteSkip.ts` | reads `#854` `pbv_absolute_hp_keep_remount_slotN` | Successful Doka-heal then remount from Play-entry **below** derived maxHp would charge twice. Distinct from `#854` shop leftover HP (HIGH Play-entry). Do not invent a death-cut for this — a DeathCut cannot distinguish a false-kill from a legitimate post-remount death. |

Lab occupancy replay stays generate → destack → … → shock (10-22-006) then **illusion → larva → ink-veil**, all React-free. Reports add `illusionUnseal` / `larvaUnseal` / `inkVeilUnseal` / `featDokaKeepDeathCut` / `portalXpKeepDeathCut` / `victoryXpKeepDeathCut` / `xpCreditKeepDeathCut` / `spendKeepRemount` / `absoluteHpKeepHealSpend`. Spy allow-list still fails on `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist `commit` (including every keep/remount writer listed in 10-22-006 **plus** #909 / #912 / #918 / #919 / #926 / #927), `pbv_*` / inventory / unpaid-death keys, Rush persist writers, and Play-entry XP honour after portal keep.

Hypothetical presets remain 1 / 10 / 100 / 1_000 / 10_000 / 50_000 / 100_000 (unbounded input, not a cap). Do not treat `longHorizonSim` or `mapGen.simulate` as the lab.

---

## 5. Owner control reminder (unchanged contract)

Every knob stays **relative** to the hypothetical player: offsets and probabilities, never stored absolute 99 / 999 / 9999 / 100000 as a reject. Extreme hypothetical levels must roll. Simulation must never modify player state, rewards, progression, or economy. Prefer **DRAFT → SIMULATE → VALIDATE → ACTIVATE**. Until VALIDATE, waves 10–14 / drops 10–14 / elite 10–14 / Tables J–M / occupancy unseals stay data. Do not overlay from Admin. Do not concatenate `FAMILY_TYPES` / ENC / FSN catalogs. Do not retune Crush (LHIPS). Do not restack `worldFeatures.ts`.
