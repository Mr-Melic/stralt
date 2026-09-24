# World, Dungeon & Encounter Admin Designer — 2026-09-24

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-ad7a94d9-2d41-4b28-a8e6-185188135607`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21, 2026-09-22, and 2026-09-23 briefs**)  
**Constraint:** design only. No production code, no RAF / mapGen / turn / damage-math edits.  
**Player rule:** Stralt has **no player level cap**. Every owner control must stay valid at hypothetical levels of 1, 50, 500, 5_000, 50_000, and 100_000. Never recommend a hard maximum player or enemy level.

Prior briefs (still the content-model contract):

- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-08-31.md) — pack, relative spawn, Simulation Lab, DRAFT → SIMULATE → VALIDATE → ACTIVATE (`WDEAD-2026-08-31-001` … `015`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-01.md) — lying knobs, `longHorizonSim` isolation, one roll budget, payable rewards (`WDEAD-2026-09-01-001` … `010`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md`](./WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md) — closed-interval 9999, unused `_rewardMultiplier`, wave-2 mix, AdminGuard 99/999, GameKey isolation, destack×formations, dungeon Doka curve (`WDEAD-2026-09-02-001` … `008`)
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-21.md`](https://github.com/Mr-Melic/stralt/pull/337) — wave-3 mix, wrap `spawnPolicy.ts`, `loanOneCast`, occupancy destack, lab spy, dual depth-5 freeze (`WDEAD-2026-09-21-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-22.md`](https://github.com/Mr-Melic/stralt/pull/394) — wave-4 mix, family HP wipe, EED day-4 + FSN drop-4 ingest, `copyLastCast`, Rush Table C, lab 100k, elite second-roll (`WDEAD-2026-09-22-001` … `007`). **Queued, not on `main`.**
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-23.md`](https://github.com/Mr-Melic/stralt/pull/451) — wave-5 mix, `bindWhileAlive`, EED day-5 + FSN drop-5, Rush Table D, elite wave 5 + `wRare`, portal-ring last-resort, Crush vs 999 pack (`WDEAD-2026-09-23-001` … `007`). **Queued, not on `main`.**

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-24.md`](./ACTION_IDS_WDEAD_2026-09-24.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, or `MIMA-*`.

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued sibling catalogs after #451** (wave 6–7 `WF-*`, FSN drop 6, elite wave 6, Rush Tables E–F, preferred-room far-island snap, leftover portal floor) would be forked if the owner pack were implemented from 09-23 alone.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list. Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, or Boss Rush persist writers.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 WDEAD | Prior designer IDs `001`…`007` each. Stay `NEW`. |
| #344 / #399 / #454 / #503 WDD | Waves 4–7 `WF-*` on the **same** `WORLD_FEATURES` array. `CatalogWave` becomes `1\|2\|3\|4\|5\|6\|7` after those land. On `main` it is still `1\|2\|3`. |
| #348 / #401 / #459 FSN | Drop 4, drop 5, then **drop 6** (Gale Pit / Twin Kennel / Pincer Gate / Oblique File — Wave 5 family combinations). |
| #349 / #405 / #452 elite | Waves 4–5 family sheets, then **Wave 6** (13 proposed families). |
| #367 / #406 / #474 / #518 boss bible | Tables C, D, then **E** (`E0`–`E3`) and **F** (`F0`–`F3`). |
| #430 / #436 / #444 / #484 / #494 / #500 map | Far-island skip, live-spawn keep-clear, portal-ring last-resort, **preferred-room snap**, dump-cell punch, leftover portal floor. |
| #334 / #415 AFDA | Honesty copy. Not owner knobs. Do not re-issue `WDEAD-2026-09-02-002`. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 / 09-22 / 09-23 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Chain 3–5 (WX 6232, 6324). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs (`gameTypes.ts` 482–498; `TABS` 5610–5626). Unused canister `updateDungeonProgress` also clamps depth 16 and stores `1.0 + depth*0.25` (`adminGuard.mo` 13; `main.mo` 2905–2923) — not a live payout; do not wire it as one. |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled on HEAD. `threeOrMorePercent` unread (`combatMath.ts` 72–75). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44). Rest / deathRealm still missing from `WorldFeatureRunMode` (`worldFeatures.ts` 67). |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (WX 3702). `_rewardMultiplier` still unused (`useBossRush.ts` 209, 243). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (`LATEST_CATALOG_WAVE = 3`, 52 `WF-*`). `spawnPolicy.ts` is live defaults, not knobs. Tests still lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Wave 4 is still queued. Do not re-issue the family-HP wipe. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Wave 5 / Table D / drop-5 / portal-ring last-resort / Crush columns. Stay `NEW`. Do not re-issue. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Waves 6 and 7 are not owner controls

On `main`, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). Catalog is 52 `WF-*` ids. `pickWeightedFeatures` (1853–1871) still mixes every wave into `MAX_ROLLED_FEATURES = 3`. WX still does not import `worldFeatures`. Live events are still the 22-id two-roll (`EXISTING_MAP_MODIFIER_IDS` 1890–1913) **plus** a documented three-roll in `mapModifierRegistry.rollActiveModifiers` (`mapModifiers.ts` 646–694: global + weighted + 50% second). Admin Modifiers honesty copy is correct that global/second are **not** Candid fields (`admin.mo` `MapModifierConfig` is only `triggerChance`).

Queued #344 / #399 / #454 (`WDD-2026-09-23-001`) / #503 (`WDD-2026-09-24-001`) extend the **same array**. Do not fork an eighth array.

| Wave | Distinct owner fields this pack must name |
| :--- | :--- |
| 6 (`#454`) | `WF-SPL-HUSH_BEARER` → `grantClass: hushOnKill` (deny that `usableByEnemy` id this map; inverse of Rune Bearer attune). `WF-MOD-TIGHT_GRIP` reads `SpellConfig.mpCost === 0` then costs 1 MP. `WF-ZON-IRON_PULSE` is −15% of the **already-computed** incoming hit. `WF-PRT-TWILIGHT_GATE` even-round extra portal, exploration-only. `WF-INV-SPLIT_BANNER` two distant elites (2 toward `MAX_ENEMIES`). `WF-ELT-STILL_WATCH` facing-cone required-hostile in runs. `WF-RSK-LAST_STAND` extreme `applyRewards` only if current HP ≤ 30% max at credit. `WF-EVT-SWIFT_MARCH` hard credit only if a fight never reached round 2. `WF-ENV-EXPOSED_LINE` LoS-to-two-bodies tax via challenge recorders. |
| 7 (`#503`) | `WF-SPL-PAGE_THIEF` → `grantClass: stealAndDisarm` (steal that extra row, then that enemy cannot cast it; not a persist upgrade). `WF-PRT-ASH_GATE` fight-then-gamble extra portal, exploration-only. `WF-INV-QUIET_CAMP` / `WF-ELT-EVEN_PICKET` run required-hostiles. `WF-ZON-LONG_ARM` standing non-linear +1 (metadata range). `WF-MOD-LONG_SHADOW` map-wide non-linear +1 (inverse Low Ceiling). `WF-EVT-STEEL_HOUR` no-paid-AP-spell flag. `WF-RSK-SOLO_OATH` no-living-summon wager. `WF-ENV-CRAMPED_STONE` wall-adjacent tax (inverse Ash Rain). |

`WDEAD-2026-09-23-001` stops at wave **5**. Owner `enabledWaves` after #503 must be any non-empty subset of `{1,2,3,4,5,6,7}`. Until VALIDATE, do not overlay waves 6 or 7. Dual-roll with the 22 live modifiers remains a VALIDATE fail (`WDEAD-2026-09-01-003`). Twilight Gate and Ash Gate join Flicker / Echo / Latch / Wager / Gambit / Pilgrim / Pact as exploration-only.

---

## 3. Encounter / formation catalogs — drop 6 is still data

`WDEAD-2026-09-23-003` ingested Wick/Rime/Smoke/Plus + FSN drop 5. Later:

- #459 (FSN drop 6) adds Gale Pit, Twin Kennel, Pincer Gate, Oblique File, and related teaching pairs from Wave 5 family sheets. Unique file `docs/design/ENEMY_FORMATIONS_2026-09-23.md`. Wave 6 families (`#452`) are **deferred** to a later drop — do not concatenate them onto drop 6 in Admin.

Owner room pools still **reference** `ENC-*` / `FSN-*` ids. VALIDATE rejects unknown `formationId`. Union overlapping helpers — one `export function` per name. Rest is still a **world** 10% portal (WX 4914–4934), not a dungeon room. `MAX_ENEMIES = 20`. Split Banner / Quiet Camp extras report `skippedForBudget`.

Encounter **objectives** are still `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109): flat Doka/XP **and** absolute conditions (`under_50_damage`, `under_15_turns`, `under_8_ap_per_turn`). A level-50_000 character with thousands of max HP makes “take less than 50 damage” free. Relative objectives belong on the encounter pack (`WDEAD-2026-09-24-007`), not a retune of live challenge math in this program.

---

## 4. Occupancy compose — preferred-room snap and leftover portal floor

`WDEAD-2026-09-23-006` already requires formations to compose with portal-ring last-resort and live-spawn keep-clear. After #451:

1. #484 — leftover far-island **spawn** snaps onto the largest battle component in the overworld flood (closer-to-center on ties). A seed already on a battle-walkable cell adjacent to a blocking portal, or on a room larger than 2 tiles, stays.
2. #494 — punch two fight-graph dump cells so a second summon cannot seal.
3. #500 — floor leftover portal tiles after punch so they cannot cut battle walk.

Owner VALIDATE:

- Authored COURT / plus-arm / wick-file / Gale Pit geometry must not treat preferred-room snap as the intended art. Sim reports `preferredRoomSnap`, `leftoverPortalFloored`, plus the 09-23 last-resort columns.
- Do not disable #484 / #494 / #500 to “keep formation art.” Do not edit `mapGen.ts` from this program.

On `main`, `collectValidEnemySpawnCells` still uses the hardcoded spawn diamond (`spawnPolicy.ts` 41–44, 183–188) and `generateEnemies` still scatters Chebyshev ≥ 4 then 30% family (WX 5711–5869).

---

## 5. Boss Rush tables are six namespaces, not a rewrite of 10 rooms

Live: `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` still do not skip rooms. `_rewardMultiplier` has zero readers. `completeBossRushRoom` stays `(0, 0)` and **rejects `roomIndex > 9`** (`main.mo` 3317). Room 9 `boss2Id: "weeping_pawn_2"` is still not a `BossId`.

Queued bible:

- Tables B / C / D as named by 09-22-005 / 09-23-004.
- **Table E** `E0`–`E3` after Table D (`#474`): mill+conductor, counter+ivory, wedge+cinder, levy+fosse. Wave-7 ids (`mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector`) stay out of live `BOSS_IDS`.
- **Table F** `F0`–`F3` after Table E (`#518`): gaze+span / cover+lintel pairings. Wave-8 ids (`gaze_beadle`, `span_chamberlain`, `cover_hospitaller`, `lintel_sacrist`) stay out of live `BOSS_IDS`.

Until VALIDATE, CatalogNote must not claim Table E/F or `rewardMultiplier` is live. Do not bind `_rewardMultiplier` as a second wallet write. Do not encode E/F as canister `roomIndex` 10–17 — that trap is a **career cap** on rush length. Owner sequencing uses letter namespaces. Relative scale is still offset + curve versus the player. Never a stored `levelMax`.

---

## 6. Elite wave 6 is still a second roll

Live: seven `EnemyFamily` ids, 30% equal overlay (`spawnPolicy.ts` 49–57, 35), no `isElite`. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002` — do not re-issue).

Queued #452 adds thirteen **PROPOSED** Wave 6 families (SPELL_PROPOSALS Wave 5 verbs: facing, stride mute, ally vault, two-cell span, cadence, cover, HP% lintel, act tax/bell). FSN drop 6 (`#459`) packs **Wave 5** families only.

Owner elite % remains a second roll. Do not append Wave 6 ids onto live `FAMILY_TYPES`. Restack union ≠ concatenate.

---

## 7. Simulation Laboratory — still missing; do not promote LHIPS or mapGen.simulate

No Admin Simulation tab. Tiers preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `longHorizonSim.ts` on `main` samples 10_000 / 50_000 (`STRESS_LEVELS` 82–85). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wave-mix histogram now includes **6 and 7**. Spy list unchanged from 09-21-005. Bundle must not import `longHorizonSim.ts` or `mapGen.simulate.ts`. Hypothetical 100_000 remains a preset, not a career cap.

---

## 8. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
  Dungeons       rooms · sequence · special · rest · branch · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3)
  World Events   eligibility (incl. rest / deathRealm) · rarity · hazards · elites
                 · grants · hooks · catalogWave 1–7
  Spawn          relative level · equal · above · elite · variant · size · family · spells · AI
                 (wraps spawnPolicy.ts; family stats declare battle-start survival)
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (WX still has zero reads).

### Validate gates (08-31 §6 + later runs + this run)

48. `enabledWaves` may include **6 and 7**; `CatalogWave` is `1|2|3|4|5|6|7` after #454/#503 land. Sim mix ≠ 100% newest wave at `maxRolled=3`. Twilight Gate and Ash Gate never roll in dungeon / rush / deathRealm.
49. `grantClass` includes `hushOnKill` and `stealAndDisarm`. Zero `upgradeSpell`. Tight Grip / Long Shadow / Long Arm read `mpCost` / non-linear range metadata only.
50. Encounter / formation ids resolve to FSN drop-6 as well as earlier sheets. Unknown `formationId` fails VALIDATE.
51. Rush sequencing distinguishes rooms 0–9, `B0`–`B3`, `C0`–`C3`, `D0`–`D3`, `E0`–`E3`, `F0`–`F3`. Activating E/F does not rewrite earlier namespaces and does not use canister `roomIndex > 9`.
52. Elite rarity is still a **second** roll. Do not append Wave 6 family ids onto live `FAMILY_TYPES`.
53. Sim reports `preferredRoomSnap` / `leftoverPortalFloored`. Dungeon rooms still have ≥ 1 hostile. No `mapGen.ts` hunk.
54. Encounter objectives on the pack are relative (% max HP, turn-budget vs fight length), not absolute `50` damage / `15` turns. Lab never credits challenge Doka.

---

## 9. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay wave 6/7 or to “fix” family HP or Crush.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not promote `longHorizonSim` or `mapGen.simulate.ts` to Admin.
- Do not open a second reward or spell-level writer (including `updateDungeonProgress.bestRewardMultiplier`).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts`. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 10. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-24-001 | Owner `enabledWaves` includes waves 6–7; one roll budget | P0 |
| WDEAD-2026-09-24-002 | `grantClass: hushOnKill` / `stealAndDisarm`; Tight Grip / Iron Pulse / Long Arm / Long Shadow / Steel Hour via registry | P1 |
| WDEAD-2026-09-24-003 | Ingest FSN drop-6 as encounter data — do not fork arrays | P1 |
| WDEAD-2026-09-24-004 | Rush sequencing namespaces add `E0`–`E3` / `F0`–`F3` — never `roomIndex > 9` | P1 |
| WDEAD-2026-09-24-005 | Elite wave 6 is still a second roll — never concatenate `FAMILY_TYPES` | P1 |
| WDEAD-2026-09-24-006 | Formations compose with preferred-room snap and leftover portal floor | P1 |
| WDEAD-2026-09-24-007 | Encounter objectives are relative — `DEFAULT_CHALLENGES` absolute 50-damage / 15-turn gates are not owner policy | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-24.md`](./ACTION_IDS_WDEAD_2026-09-24.md).
