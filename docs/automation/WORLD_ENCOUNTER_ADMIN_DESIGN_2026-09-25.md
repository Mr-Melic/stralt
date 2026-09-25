# World, Dungeon & Encounter Admin Designer — 2026-09-25

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-ce86ee30-1113-459f-abe4-83c842b09ebf`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-24 briefs**)  
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

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-25.md`](./ACTION_IDS_WDEAD_2026-09-25.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued sibling catalogs and occupancy PRs after #534** (elite waves 7–8, FSN drops 7–8, EED Ley/Gale/Face rooms, WDD wave 8, Rush Table G, white-gateway re-legalize, portal-seeded destack, occupied-alcove dump punch, jackpot `complete(9)` order, SpellSummonFields UI) would be forked if the owner pack were implemented from 09-24 alone.

Same-window catalogs that opened while this brief was in flight: #578 WDD wave 8, #572 Rush Table G, #574 Face/Mute/Span/Brand rooms, #575 FSN drop 8. Consume them. Do not fork a ninth `WORLD_FEATURES` array.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 482–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, or Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`).

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 WDEAD | Prior designer IDs `001`…`007` each. Stay `NEW`. |
| #344 / #399 / #454 / #503 / **#578** WDD | Waves 4–8 `WF-*` on the **same** `WORLD_FEATURES` array. `CatalogWave` becomes `1\|2\|3\|4\|5\|6\|7\|8` after those land. On `main` it is still `1\|2\|3`. |
| #348 / #401 / #459 / **#537** / **#575** FSN | Drops 4–6, then **drop 7** (Wave 6 packs) and **drop 8** (Wave 7 packs: Post Tithe / Purse Court / Corner Fog / Hinge Cover). |
| #347 / #396 / **#479** / **#519** / **#574** EED | Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, then **Face/Mute/Span/Brand** `ENC-*` rooms. |
| #349 / #405 / #452 / **#535** / **#558** elite | Waves 4–6 family sheets, then **Wave 7** (14 families) and **Wave 8** (17 families). |
| #367 / #406 / #474 / #518 / **#572** boss bible | Tables C–F, then **Table G** `G0`–`G3` (toll+cinder, hinge+palisade, veil+wick, oath+ram). |
| #430 / #436 / #444 / #484 / #494 / #500 / **#538** / **#542** / **#548** / **#553** map | Far-island skip, live-spawn keep-clear, portal-ring last-resort, preferred-room snap, dump-cell punch, leftover portal floor, then **occupied-alcove dump punch**, **punch-then-finalize lock**, **white-gateway re-legalize**, **portal-seeded destack**. |
| **#536** Rush persist | Jackpot `complete(9)` must run **before** `completeRun` / `resetRunState` abort. |
| **#564** admin UX | Spell editor now exposes summon AI / lifespan / piece / **absolute level** / hpScale / damageScale. Not a draft lifecycle. Do not re-issue `AUX-*`. |
| #334 / #415 AFDA | Honesty copy. Not owner knobs. Do not re-issue `WDEAD-2026-09-02-002`. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 / 09-22 / 09-23 / 09-24 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Chain 3–5 (WX 6232, 6324). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. Unused canister `updateDungeonProgress` still clamps depth 16 (`adminGuard.mo` 13; `main.mo` 2905–2923). |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers tab still unlabeled (`AdminDashboard.tsx` 3926–3928). `threeOrMorePercent` unread (`combatMath.ts` 72–75). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44; `EXISTING_MAP_MODIFIER_IDS` 1890–1913). Registry is a documented three-roll (`mapModifiers.ts` 646–694). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject (WX 3702). `_rewardMultiplier` still unused (`useBossRush.ts` 209, 243). CatalogNote still claims it is read (`AdminDashboard.tsx` 7141–7146). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99` (`adminGuard.mo` 411, 441). `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). **New live owner UI on the 99 cap → 09-25-002.** |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (`LATEST_CATALOG_WAVE = 3`, 52 `WF-*`). `spawnPolicy.ts` is live defaults, not knobs. Tests still lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start: `calcEnemyMaxHp(e.level)` (WX 11970–11974, 11991–11997). Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Wave 5 / Table D / drop-5 / portal-ring / Crush. Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | Waves 6–7 / drop 6 / Tables E–F / elite wave 6 / preferred-room snap / relative objectives. Stay `NEW`. Do not re-issue 09-24-001 for wave 8 (`WDEAD-2026-09-25-008`). Do not re-issue 09-24-007 if `DEFAULT_CHALLENGES` is still absolute (`challengeCompletion.ts` 44–109). |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. White sanctuary is a fourth run context, not exploration

`WorldFeatureRunMode` is `exploration | dungeon | bossRush` (`worldFeatures.ts` 67). `WorldFeatureContext.runMode` may be `deathRealm` (`worldFeatures.ts` 148); `isFeatureAllowedInContext` hard-returns false (1768–1769). Rest is still a **world** 10% portal (WX 4914–4934), not a dungeon room and not an enum value (`WDEAD-2026-09-01-010`).

White sanctuary / dungeon-complete gateway is a **different** occupancy:

- `placeWhitePortalAtSpawn` colocates the portal with spawn (`portalRules.ts` 285–290). WX attaches it **after** `generateEnemies` + `applyFinalizedLayout` (WX 6406–6407; `mapGen.ts` `attachWhitePortalAfterLegalize` 1834+).
- Queued #548 re-legalizes after the stamp so small-side hostiles stay engageable — the gateway is a new battle cut-vertex.
- Queued #553 destacks battle-start off a portal-seeded origin because flood from the gateway tile was empty (the seed **is** a wall to pathing).

`WDEAD-2026-09-01-010` named rest / deathRealm. It did not name white sanctuary. Owner dungeon **special rooms** must include this gateway as a first-class room type with its own eligibility (default: no `WF-*` extras, no rest-shop, no Death Realm modifiers). Do not treat white as exploration (Flicker / Ash / Twilight gates) or as a dungeon-chain floor (depth extras / Doka table). Sim reports `whiteSanctuary` as a run mode.

---

## 2.1 Wave 8 is not an owner control until VALIDATE

On `main`, `CatalogWave = 1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3`. Queued #578 (`WDD-2026-09-25-001`) extends the **same** array with 16 wave-8 ids: `WF-HAZ-BOG_SILT`, `WF-HAZ-TURNSTILE_EMBER`, `WF-TRP-WEARY_PLATE`, `WF-TER-MASON_CRATE`, `WF-OBS-COIN_SILL`, `WF-ZON-TRUE_STRIKE`, `WF-TEL-BACKSTEP`, `WF-PRT-HEARTH_GATE`, `WF-INV-HORN_RELAY`, `WF-ELT-ODD_PICKET`, `WF-TRS-WOUND_CACHE`, `WF-SPL-VOW_KEEPER`, `WF-RSK-BOND_OATH`, `WF-MOD-CLOSE_QUARTERS`, `WF-EVT-KINDLED_HOUR`, `WF-ENV-GALE_BITE`.

`WDEAD-2026-09-24-001` stops at waves **6–7**. Owner `enabledWaves` after #578 must be any non-empty subset of `{1,2,3,4,5,6,7,8}`. Dual-roll with the 22 live modifiers remains a VALIDATE fail (`WDEAD-2026-09-01-003`). Hearth Gate joins Flicker / Twilight / Ash / Pact / Wager / Latch / Gambit / Echo / Pilgrim as exploration-only. Odd Picket / Horn Relay count as run hostiles. `WF-SPL-VOW_KEEPER` is silence-without-gain (`grantClass: vowSilence`) — not hush-on-kill and not steal-and-disarm.

---

## 3. SpellSummonFields is a live absolute-level owner knob

Queued #564 adds `SpellSummonFields` to the owner spell editor (AI, lifespan, piece, **level**, hpScale, damageScale). Persist already had the fields; the form did not. Save still publishes immediately — not DRAFT → ACTIVATE.

That UI sits on top of AdminGuard `summonUnitDef.level > 99` (`adminGuard.mo` 441) and `minLevel > 999` (411). `WDEAD-2026-09-02-005` named those **career caps on catalog content**. It did not name a visible owner control that teaches “summons cap at 99.”

Owner spawn “advanced spell probability” / encounter summon extras / `grantClass` kits must scale off the **caster’s relative level** (offset + curve), never a stored absolute 99. Lifespan 20 and hpScale/damageScale 0–10 stay board-safety / Inf rails. Do not raise 99 to 999. Do not re-issue `AUX-*` (the editor copy). CatalogNote on that section must not claim the level field is a player-level max.

Linear unclamped summoner chance remains `0.12 + level * 0.02` (WX 11932–11934; `gameConstants.ts` 298–299) — still `WDEAD-2026-08-31-012`. Lab at hypothetical 50_000 reports ~100% summoners until that curve is wrapped.

---

## 4. Encounter / formation catalogs — drops 7–8 plus three EED days

`WDEAD-2026-09-24-003` ingested FSN drop 6 (Gale Pit / Twin Kennel / Pincer Gate / Oblique File) and bounded rooms as day-1…5 / drop-1…6.

Later / missed / same-window:

- #479 (`EED-2026-09-23-001`) — Ley / Fan / Pit / Font `ENC-*` rooms. Filed **after** #451; 09-24 did not name it.
- #519 — Gale / Twin / Pincer encounter **rooms** (`docs/encounters/ENCOUNTER_EVOLUTION_2026-09-24.md`). Distinct from FSN drop-6 formation sheets.
- #537 (FSN drop 7) — Face Court, Gait Snare, Vault File, Span Gate, … packing **Wave 6** families from #452.
- #574 — Face / Mute / Span / Brand `ENC-*` rooms (`docs/encounters/ENCOUNTER_EVOLUTION_2026-09-25.md`), including `ENC-RUSH-27…30` as Table F remixes — not a rewrite of live 0–9.
- #575 (FSN drop 8) — Post Tithe, Purse Court, Corner Fog, Hinge Cover, Reel Tithe, Twin Plug, Veil Corner, Break Choir, Cap Veil, Reel Corner packing **Wave 7** families from #535. Wave 8 families (`#558`) stay deferred to drop 9 — do not concatenate them onto drop 8.

Live `generateEnemies` still scatters 1..8 + depth extras, random chess piece, Chebyshev ≥ 4, then 30% family (WX 5711–5869). Rest is still a world portal. `MAX_ENEMIES = 20`. `canAddEnemies` skips at 20 (`worldFeatures.ts` 1782–1785); `rollOverworldEnemyCount` does **not** cap (`spawnPolicy.ts` 151–159).

---

## 5. Occupancy compose — white split, portal-seeded destack, occupied alcoves

`WDEAD-2026-09-24-006` named preferred-room snap (#484), dump cells (#494), leftover portal floor (#500). After #534:

1. #538 — punch a free dump cell when hostiles occupy every alcove (`countProgressionDumpCells` treated occupied alcoves as dump, so `ensureProgressionAlcove` skipped).
2. #542 — locks the WX punch-then-finalize solvability sequence. Owner rooms must not skip `finalizePlayableLayout`.
3. #548 — re-legalize after white gateway so small-side hostiles stay engageable.
4. #553 — destack battle-start off a portal-seeded origin (flood the largest adjacent floor island; a 2-tile crumb cannot win).

Owner VALIDATE: authored COURT / plus-arm / Face Court geometry must report `whiteSplitRelegalize`, `portalSeededDestack`, `occupiedAlcoveDumpPunch`, plus the 09-24 snap / floor columns. Drop a slot that cannot destack. Do not disable those PRs to keep formation art. Do not edit `mapGen.ts` from this program.

---

## 6. Boss Rush — jackpot `complete(9)` is a career-cap trap for extra tables

Live: `BOSS_RUSH_ROOMS` is 10 hardcoded pairs (`useBossRush.ts` 24–135). Admin enable + per-room `x` still do not skip rooms. `_rewardMultiplier` has zero readers. CatalogNote still claims it is read (7141–7146). `persistBossRushRoomClear` still `completeBossRushRoom(..., 0, 0)` (`bossRushProgress.ts` 186–191). Canister rejects `roomIndex > 9` (`main.mo` 3317).

Queued #536: clearing room 9 used to `completeRun` → `resetRunState` → `abortBossRush` **before** `complete(9)`, so master complete / run count / `highestRoomCompleted=10` never landed.

Queued #572 adds **Table G** `G0`–`G3` after Table F (toll+cinder, hinge+palisade, veil+wick, oath+ram). Wave-9 ids (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) stay out of live `BOSS_IDS`.

Owner sequencing VALIDATE:

- Live jackpot is still namespace room 9. Activating Tables B–G must not skip or rewrite `complete(9)`.
- Do not encode E/F/G as canister `roomIndex` 10–21.
- Evaluated multipliers still enter `computeRewardDeltas` only after VALIDATE (`WDEAD-2026-09-01-009`). Keep `(0, 0)` on the canister method.

---

## 7. Elite waves 7 and 8 are still a second roll

Live: seven `EnemyFamily` ids, 30% equal overlay (`spawnPolicy.ts` 49–57, 35), no `isElite`. Family HP/RES/SP still die at battle start (`WDEAD-2026-09-22-002`).

- #535 Wave 7: fourteen PROPOSED families (`post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder`) consuming SPELL_PROPOSALS Wave 6.
- #558 Wave 8: seventeen PROPOSED families (`wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `triple_span`, `cadence_cracker`, `once_cantor`, …) consuming SPELL_PROPOSALS Wave 7.

`WDEAD-2026-09-24-005` named Wave 6 only. FSN drop 7 packs Wave **6** families. FSN drop 8 packs Wave **7** families and defers Wave 8 to drop 9. Do not append Wave 7/8 ids onto live `FAMILY_TYPES`. Restack union ≠ concatenate.

---

## 8. Simulation Laboratory — still missing; new report columns

No Admin Simulation tab. Tiers preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). `longHorizonSim.ts` on `main` samples 10_000 / 50_000 (`STRESS_LEVELS` 82–85). Queued #560 is another LHIPS observation pass — **do not promote it**. Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`.

Lab reports (08-31-003 plus later runs plus this run): relative-level histogram, below/equal/above, families, variants, elites, AI, rare spells, discovery opportunities, formations, estimated difficulty, `skippedForBudget`, theoretical vs payable, `destackRelocations`, `catalogWave` mix (1–8), `preferredRoomSnap`, `leftoverPortalFloored`, **`whiteSanctuary`**, **`whiteSplitRelegalize`**, **`portalSeededDestack`**, **`occupiedAlcoveDumpPunch`**, **`smallSideHostiles`**, **`summonerFrequency`**, **`jackpotComplete9Order`**.

Spy list unchanged from 09-21-005, plus Boss Rush persist writers and the queued GameKey/portal `saveBattleStats` “keep” paths (#540 / #545 / #552) — the lab must not invoke those keeps. Hypothetical 100_000 remains a preset, not a career cap.

---

## 9. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3 / G0–G3)
                 jackpot complete(9) is mandatory before extra tables
  World Events   eligibility (rest / deathRealm / whiteSanctuary) · rarity · hazards
                 · elites · grants · hooks · catalogWave 1–8
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

55. `WorldFeatureRunMode` / dungeon special-room enum includes `whiteSanctuary`. White maps do not roll exploration-only gates. Sim mix reports the mode. Rest / deathRealm stay `WDEAD-2026-09-01-010`.
56. Summon templates on the pack are relative (offset + curve vs caster). SpellSummonFields absolute `level` is labeled catalog-only until VALIDATE. Do not raise AdminGuard 99.
57. Encounter / formation ids resolve to EED #479 / #519 / #574 and FSN drops 7–8 as well as earlier sheets. Unknown `formationId` fails VALIDATE. Wave 8 family ids are not on drop-8 sheets.
58. Rush sequencing distinguishes 0–9 / B / C / D / E / F / **G**. Activating extra tables does not skip `complete(9)` and does not use canister `roomIndex > 9`.
59. Elite rarity is still a **second** roll. Do not append Wave 7 or Wave 8 family ids onto live `FAMILY_TYPES`.
60. Sim reports `whiteSplitRelegalize` / `portalSeededDestack` / `occupiedAlcoveDumpPunch` / `smallSideHostiles`. Punch-then-finalize stays (`#542`). No `mapGen.ts` hunk.
61. Encounter size on a white-split small side may skip-for-budget; VALIDATE fails if the small side has 0 hostiles after re-legalize. `MAX_ENEMIES = 20` is a roster rail, not a player-level cap.
62. `enabledWaves` may include **8**; `CatalogWave` is `1|2|3|4|5|6|7|8` after #578 lands. Sim mix ≠ 100% wave 8 at `maxRolled=3`. Hearth Gate never rolls in dungeon / rush / deathRealm / whiteSanctuary. `grantClass` includes `vowSilence`.

---

## 10. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, white-split, or family HP.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 9 or Rush Table H.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #560 to Admin.
- Do not open a second reward or spell-level writer (including `updateDungeonProgress.bestRewardMultiplier`).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts`. World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 11. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-25-001 | Owner dungeon special-room / `WorldFeatureRunMode` includes `whiteSanctuary` | P0 |
| WDEAD-2026-09-25-002 | SpellSummonFields absolute level is not a spawn career cap — relative caster offset | P1 |
| WDEAD-2026-09-25-003 | Ingest EED Ley/Gale/Face rooms and FSN drops 7–8 — do not fork arrays | P1 |
| WDEAD-2026-09-25-004 | Rush extra tables include `G0`–`G3`; must not skip jackpot `complete(9)` or use `roomIndex > 9` | P1 |
| WDEAD-2026-09-25-005 | Elite waves 7 and 8 are still a second roll — never concatenate `FAMILY_TYPES` | P1 |
| WDEAD-2026-09-25-006 | Formations compose with white-split re-legalize, portal-seeded destack, occupied-alcove dump punch | P1 |
| WDEAD-2026-09-25-007 | Encounter size VALIDATE on the white-split small side — `MAX_ENEMIES` is not a level cap | P1 |
| WDEAD-2026-09-25-008 | Owner `enabledWaves` includes wave 8; `vowSilence`; Hearth Gate exploration-only | P0 |

Full records: [`ACTION_IDS_WDEAD_2026-09-25.md`](./ACTION_IDS_WDEAD_2026-09-25.md).
