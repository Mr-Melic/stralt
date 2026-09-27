# World, Dungeon & Encounter Admin Designer — 2026-09-27

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-ac536f0e-886e-473e-ac68-363d2b8d144a`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-26 briefs**)  
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
- [`WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-26.md`](https://github.com/Mr-Melic/stralt/pull/615) — destack/wander dump compose, Death Realm pending persist quarantine, modifier id/type VALIDATE, lab wander epoch (`WDEAD-2026-09-26-001` … `004`). **Queued, not on `main`.** Explicitly did **not** invent WDD wave 9 or Rush Table H because those catalogs did not exist when that cron started.

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-27.md`](./ACTION_IDS_WDEAD_2026-09-27.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDEAD-2026-09-26-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, `SDE-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued catalogs and occupancy/admin rails after #615** (WDD wave 9, FSN drop 9, EED Hug/Boot/Write/Dull, elite wave 9, Rush Tables H–I, wander/destack dump floor 2, choke-pocket snap, joint 2+2 unseal, seeded modifier pool rails, keep-then-additive persist) would be forked if the owner pack were implemented from 09-26 alone.

Do **not** invent WDD wave 10, FSN drop 11, elite wave 10, or Rush Table J. Same-day **#669** (FSN drop 10) and **#672** (EED Purse/Hinge/Gait) exist and are consumed below. `CatalogWave` on `main` is still `1|2|3` until #344 / #399 / #454 / #503 / #578 / **#613** land.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 483–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), or write `pbv_pending_death_penalty_*` / arm `deathTriggered`.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / #593 / **#615** WDEAD | Prior designer IDs. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 / **#613** WDD | Waves 4–**9** `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). |
| #348 / #401 / #459 / #537 / #575 / **#612** / **#669** FSN | Drops 4–**10**. Drop 10 packs Wave 9 families. Do not invent drop 11. |
| #347 / #396 / #479 / #519 / #574 / **#635** / **#672** EED | Tide…Brand, Hug/Boot/Write/Dull, plus **Purse/Hinge/Gait** `ENC-*` rooms. |
| #349 / #405 / #452 / #535 / #558 / **#625** elite | Waves 4–**9** family sheets. Second roll. Never concatenate `FAMILY_TYPES`. |
| #367 / #406 / #474 / #518 / #572 / **#638** / **#663** boss bible | Tables C–**I**. Jackpot `complete(9)` stays mandatory (`#536`). |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split / portal-seeded destack / generate-time occupied-alcove dump. **09-25-006 already owns these.** |
| #589 / #600 / #603 destack dump | Battle-start destack sits hostiles on generate-time dump cells. **09-26-001 already owns these.** |
| #591 / #608 wander dump | Free dump punch when wander occupies dump cells. **09-26-001 / 09-26-004 already own these.** |
| **#628** wander dump floor 2 | Punch until **free** dump ≥ 2 when wander occupies one of two alcoves (`enemyWanderDumpFloor.ts`). `#608` / `#494` no-op. |
| **#648** destack occupied dump floor 2 | Punch until **free** dump ≥ 2 when destack occupies one of two alcoves (`battleStartOccupiedDumpFloor.ts`). `#600` is occupancy-unaware. |
| **#651** choke-pocket snap | Relocate destack origin off a side pocket whose unique-bridge set is non-empty (`battleStartChokePocket.ts`). Dump helpers no-op (dump stays high). |
| **#656** joint 2+2 unseal | Peel dual-path 2+2 corpse cuts greedy occupancy misses (`occupancyJointUnseal.ts`). |
| #576 / #595 / #602 / #604 Death Realm pending | Skip heal / Items / rename / `upgradeSpell` / feat / GameKey while the timer is pending. **09-26-002 already owns eligibility.** |
| #605 admin safety | `validateMapModifier` rejects id/type mismatches. **09-26-003 already owns identity.** |
| **#626** / **#650** modifier pool | Refuse hard-delete of seeded `slime_flood` / `paper_windstorm`; refuse emptying the last live built-in row (`active=false` / `triggerChance=0`). |
| **#657** persist | Skip additive feat/GameKey `commit({ doka })` while unconfirmed keep is outstanding (`unconfirmedKeepAdditiveCommit.ts`). Lab spy. |
| #564 admin UX | SpellSummonFields absolute level. Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 AFDA | Honesty copy. Not owner knobs. |
| #540 / #545 / #552 / #580 / #599 / **#657** persist keeps | `saveBattleStats` “keep” after seeded/unseeded portal / GameKey / victory / additive. Lab must not invoke them. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 09-26 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Tests lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). Region match is still a closed interval (`WorldExploration.tsx` 3702). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44; `EXISTING_MAP_MODIFIER_IDS` 1890–1913). Registry is a documented three-roll (`mapModifiers.ts` 646–694). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1768–1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject. `_rewardMultiplier` still unused (`useBossRush.ts` 209). CatalogNote still claims it is read (`AdminDashboard.tsx` 7143). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9` (`main.mo` 3317). |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute (`under_15_turns`, `under_50_damage`, `under_8_ap_per_turn` — `challengeCompletion.ts` 44–109). Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. `enabledWaves` still cannot name 8 **or 9** on `main`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |
| `WDEAD-2026-09-26-001`…`004` | Yes (queued #615) | Destack/wander **free** dump compose, Death Realm pending quarantine, modifier id/type identity, lab wander epoch. Do not re-issue. Floor-2 / choke / joint-cut are **this** run. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Wave 9 exists now — owner `enabledWaves` must name it

`WDEAD-2026-09-25-008` named wave 8 (`#578`). `WDEAD-2026-09-26` refused to invent wave 9 because the newest same-day sibling then was telemetry #609. Queued **#613** (`WDD-2026-09-26-001`) now adds 16 overlay ids and types `CatalogWave = 1 … 9` / `LATEST_CATALOG_WAVE = 9` on the **same** `WORLD_FEATURES` array (PR 613 `worldFeatures.ts` 69, 120). On `main` the type is still `1 | 2 | 3` and `LATEST_CATALOG_WAVE = 3` (`worldFeatures.ts` 64, 115). `pickWeightedFeatures` still does not take a wave (`worldFeatures.ts` 1853–1869). `MAX_ROLLED_FEATURES = 3` (37). WX still does not import the catalog.

Wave 9 ids (one per requested category):

| Id | Name | Owner note |
| :--- | :--- | :--- |
| `WF-HAZ-LECTERN_ASH` | Lectern Ash | Cast occupancy tax; Attack Nearest / walk free |
| `WF-HAZ-SKIP_CINDER` | Skipping Cinder | 2-tile hop on a painted line |
| `WF-TRP-CAMP_PLATE` | Camp Plate | Tax if start **and** end of turn occupy |
| `WF-TER-TILT_SCREEN` | Tilt Screen | 1 AP flip walk-block ↔ LoS-block; 2 AP smash |
| `WF-OBS-TITHE_SILL` | Tithe Sill | Adjacent 8% max-HP unlatch; long path required |
| `WF-ZON-ROOT_CIRCLE` | Root Circle | Standing zone ignores push/attract/Crosswind |
| `WF-TEL-FLANK_STEP` | Flank Step | 1 MP sidestep to facing-right if empty |
| `WF-PRT-WANE_GATE` | Wane Gate | **Exploration-only.** ≤30% HP extra portal + hard `applyRewards`. Inverse of Hearth Gate |
| `WF-INV-HEIR_CORDON` | Heir Cordon | Elite + two minions. Dungeon / Rush: all three count for map-clear (`extraEnemyCount` 3) |
| `WF-ELT-NEAR_PICKET` | Near Picket | Elite present only within Chebyshev 3. Dungeon / Rush: required hostiles |
| `WF-TRS-STRIDE_CACHE` | Stride Cache | Open only after ≥1 MP this turn |
| `WF-SPL-GRAVE_SCRIBE` | Grave Scribe | Kill writes a one-cast **glyph** on the death tile; adjacent 1 AP pickup. Not Grimoire auto-grant |
| `WF-RSK-STRIDE_OATH` | Stride Oath | Next `applyRewards` uses hard multiplier only if the player spent MP after the flag |
| `WF-MOD-FAR_CAST` | Far Cast | `minRange` floor 2 for targeted spells; Attack Nearest unchanged |
| `WF-EVT-LONG_WATCH` | Long Watch | Victory on round 4+ uses hard multiplier |
| `WF-ENV-SIGHT_BURN` | Sight Burn | End-of-turn 3% max HP if an enemy has LoS |

`grantClass` after wave 9 is `none | mapAttune | oneCast | loanOneCast | copyLastCast | bindWhileAlive | hushOnKill | stealAndDisarm | vowSilence | glyphPickup | observe`. `glyphPickup` is in-memory, this map only, one remaining use **after** the 1 AP glyph tap — it must not call `upgradeSpell` or write spell-level arrays. Credits stay on `applyRewards`. Hazard HP stays on challenge recorders. Death Realm default catalog stays []. Dual-roll of the 22 live modifiers plus overlay remains a VALIDATE fail (`WDEAD-2026-09-01-003`).

Until VALIDATE, do not overlay wave 9 from Admin “to try #613.” Do not invent wave 10.

---

## 3. Drop 9 / Hug-Boot-Write-Dull / elite wave 9 are ingest, not concatenate

Queued **#612** (FSN drop 9) packs Wave **8** families from #558 as sixteen `FSN-*` sheets (Wall File, Boot Spare, Face Glance, Slip Pit, Pivot Wick, Triple Plug, Crack Verse, Hood Choir, Share Goad, Boon Boot, Dull Sill, Wick Face, Brand Reel, Spare Slip, Sill Brood). Hold `FSN-TRIPLE-PLUG` while live `ENEMY_SUMMON_CAP` is 2. Same-day **#669** (FSN drop 10) packs Wave **9** families from #625 as sixteen more `FSN-*` ids (GAIT-PACE, LONE-NAIL, FLUSH-DUMP, MORROW-POST, PAIR-PEEL, WICK-SEAL, SPLIT-PAD, GAIT-CHOIR, FLUSH-LEND, SEAL-FILE, DIAG-BRICK, BODY-CAST, HOLD-RANGE, ALLY-WICK, BLINK-RANK, PEEL-COURT). Extra doors `gait_cantor` / `pair_usher` / `flush_precentor` / `dummy_castellan` / `court_hinge_regent` stay elite extras, not `FAMILY_TYPES`. Do not invent drop 11.

Queued **#635** (EED-2026-09-26-001) adds Hug / Boot / Write / Dull rooms. Same-day **#672** (EED-2026-09-27-001) adds Purse / Hinge / Gait rooms (`ENC-PURSE-01`, `ENC-HINGE-01`, `ENC-GAIT-01`, `ENC-DUMMY-01`, Rush `ENC-RUSH-35`…`38` using Table H). Live 19 `BOSS_IDS` stay dungeon fallbacks; Tables H–I are Rush-only.

Queued **#625** elite wave 9 remains a **second roll** after `FAMILY_TYPES` (`spawnPolicy.ts` 49–57, seven live families, 30% equal-weight). Do not concatenate the 32 proposed ids onto `FAMILY_TYPES`. Do not wipe family HP at battle start (`WDEAD-2026-09-22-002`).

Owner Encounter / Dungeon tabs ingest those catalogs by **id union**. Duplicate `export function` copies of the same helper fail Caffeine `vite build`.

---

## 4. Rush Tables H and I are namespaces, not `roomIndex > 9`

Live Rush is still 10 hardcoded pairs (`useBossRush.ts` 24–135). Canister `completeBossRushRoom` still `#err`s `roomIndex > 9` (`main.mo` 3317) and ignores client Doka/XP (passes `0, 0`). Jackpot `complete(9)` is still mandatory before extra tables (`#536`). `_rewardMultiplier` is still unused.

Queued **#638** adds Wave 10 sheets (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) and **Table H** (`H0`–`H3`) additive after Table G. Queued **#663** adds Wave 11 sheets (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) and **Table I** (`I0`–`I3`) additive after Table H. Neither rewrites rooms 0–9. Neither is in `BOSS_IDS`.

Owner Boss Rush sequencing namespaces: `0–9` / `B0–B3` / `C0–C3` / `D0–D3` / `E0–E3` / `F0–F3` / `G0–G3` / `H0–H3` / `I0–I3`. Extra tables must **not** call `completeBossRushRoom` with `roomIndex > 9`. Jackpot `complete(9)` stays mandatory before H/I payouts. Relative scaling (offset + multiplier vs the player), never a stored absolute 99. Do not invent Table J.

---

## 5. New occupancy epochs after destack/wander free dump

`WDEAD-2026-09-25-006` named generate-time dump / white-split / portal-seeded destack. `WDEAD-2026-09-26-001` named destack-occupied **free** dump (#589 / #600 / #603) and wander-occupied **free** dump (#608). After #615, map integrity opened four more epochs that formations (Face Court / Span Gate / drop-9 COURT / `WF-INV-HEIR_CORDON`) must compose with:

1. **#628** — punch until **free** dump ≥ 2 when wander occupies one of two generate-time alcoves (`enemyWanderDumpFloor.ts`). Unique bridges still report dump ≥ 2, so `#494` / `#608` no-op.
2. **#648** — punch until **free** dump ≥ 2 when destack occupies one of two alcoves (`battleStartOccupiedDumpFloor.ts`). `#600` counts occupancy-unaware dump ≥ 2 and no-ops.
3. **#651** — snap destack origin off a choke pocket whose unique-bridge set is non-empty (`battleStartChokePocket.ts`). Dump counts stay high (191+ far-side floors), so dump punches no-op; four corpses on the neck still seal.
4. **#656** — peel a 2+2 dual-path joint cut that greedy one-at-a-time unseal misses (`occupancyJointUnseal.ts`). Mandatory dump can be 0 because every floor already counts as dump.

VALIDATE epochs are now: generate → destack → destack-dump → destack-occupied-floor-2 → choke-pocket snap → (overworld) wander-dump → wander-floor-2 → joint-cut unseal. Drop a slot that cannot destack. Do not punch walls; do not hop a portal cut; do not disable those PRs to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program. White sanctuary destack on the white portal still no-ops (mandatory 0).

---

## 6. One world-event catalog must keep a live built-in modifier pool

`WDEAD-2026-09-26-003` named id/type identity (`#605`): a live row’s `id` must equal `modifierType` and sit in `MODIFIER_BY_ID`. That rail does **not** stop the owner from deleting or retiring the last seeded hook.

Queued **#626** refuses hard-delete of seeded `slime_flood` / `paper_windstorm` (`AdminGuard.mapModifierHardDeleteRejected`). Seed only runs when the map is empty, so deleting one seeded row while the other remains never restores it. Queued **#650** refuses emptying the last live built-in row via `active=false` or `triggerChance=0` (`AdminGuard.mapModifierLastLiveRejected`). Custom / `gravity_well` rows may still retire. Live `rollActiveModifiers` keeps `active && MODIFIER_BY_ID.has(id)` with weight > 0 (`mapModifiers.ts` 667). After both seeded rows are gone the pool never rolls.

Owner VALIDATE:

- Seeded built-in ids stay in the catalog. Retire with `active=false` **only** while another built-in row stays live with weight > 0.
- Emptying the 22-id `EXISTING_MAP_MODIFIER_IDS` set (or the two seeded hooks that actually fire today) fails VALIDATE.
- Dual-roll still fails (`WDEAD-2026-09-01-003`). Identity mismatch still fails (`WDEAD-2026-09-26-003`).
- CatalogNote must not claim “Save succeeded, pool is live” after a last-row retire.

Until ACTIVATE, do not overlay wave 9 or merge catalogs from Admin “to try #650.”

---

## 7. Simulation Laboratory — still missing; new spy and columns

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #560 / #637). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`. Wander epoch stays a React-free replay (`WDEAD-2026-09-26-004`).

New report columns (in addition to 09-26): **`wanderDumpFloor2`**, **`destackOccupiedDumpFloor2`**, **`chokePocketSnap`**, **`jointCutUnseal`**, **`seededModifierPoolEmpty`**, **`keepThenAdditiveBlocked`**.

New spy (in addition to 09-21-005 / 09-26-004): queued **#657** `gateAdditiveCommitWhileUnconfirmed` — feat `claimAchievementReward` / `redeemGameKey` additive `commit({ doka })` while an unconfirmed one-shot keep is outstanding. The lab must not call those writers “to preview a keep.” Absolute `applyRewards` `newDoka` commit still uses the raw lock in live play; the lab still must not call it.

Hypothetical 100_000 remains a preset, not a career cap.

---

## 8. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
                 VALIDATE epochs: generate · destack · destack-dump · destack-occupied-floor-2
                 · choke-pocket · wander-dump · wander-floor-2 · joint-cut
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3 / G0–G3 / H0–H3 / I0–I3)
                 jackpot complete(9) is mandatory before extra tables
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants (incl. glyphPickup) · hooks
                 · catalogWave 1–9 · modifier id === type · seeded pool non-empty
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF) · keep-then-additive spy
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

67. Owner `enabledWaves` can name 9. Wane Gate stays exploration-only. Grave Scribe is `grantClass: glyphPickup`. Heir Cordon / Near Picket count as hostiles in dungeon / Rush. Dual-roll still fails. Do not overlay from Admin. Do not invent wave 10.
68. Encounter / dungeon rooms ingest EED Hug/Boot/Write/Dull / Purse/Hinge/Gait and FSN drops 9–10 by id union. Hold Triple Plug while summon cap is 2. Do not invent drop 11. Do not concatenate `FAMILY_TYPES`.
69. Elite wave 9 is a second roll. Extra doors are not family ids.
70. Rush namespaces include `H0`–`H3` / `I0`–`I3`. Never `roomIndex > 9`. Jackpot `complete(9)` stays mandatory. Do not invent Table J.
71. Formations compose with wander dump floor 2, destack occupied dump floor 2, choke-pocket snap, and joint 2+2 unseal. Sim reports those columns. Free-dump compose stays 09-26-001. No `mapGen.ts` / RAF hunk.
72. Seeded built-in modifier pool cannot be emptied or hard-deleted. Identity mismatch stays 09-26-003. Dual-roll stays 09-01-003.
73. Lab spy includes #657 keep-then-additive. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, or `mapGen.simulate.ts`.

---

## 9. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, dump helpers, or family HP.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 10, FSN drop 11, elite wave 10, or Rush Table J.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #560 / #637 to Admin.
- Do not open a second reward or spell-level writer (including GameKey or feat claim from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC / SDE IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), 09-25-008 (wave 8), or 09-26-001…004.

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump / snap / unseal helpers (`battleStartDump.ts`, `battleStartDumpFloor.ts`, `battleStartFreeDump.ts`, `battleStartOccupiedDumpFloor.ts`, `enemyWanderDump.ts`, `enemyWanderDumpFloor.ts`, `battleStartChokePocket.ts`, `occupancyJointUnseal.ts`). World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 10. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-27-001 | Owner enabledWaves includes WDD wave 9; Wane Gate exploration-only; Grave Scribe is glyphPickup | P0 |
| WDEAD-2026-09-27-002 | Ingest EED Hug/Boot/Write/Dull / Purse/Hinge/Gait and FSN drops 9–10 by id union | P1 |
| WDEAD-2026-09-27-003 | Elite wave 9 remains a second roll — never concatenate FAMILY_TYPES | P1 |
| WDEAD-2026-09-27-004 | Rush extra tables include H0–H3 and I0–I3; never roomIndex > 9 | P0 |
| WDEAD-2026-09-27-005 | Formations compose with wander/destack dump floor 2, choke-pocket snap, and joint 2+2 unseal | P1 |
| WDEAD-2026-09-27-006 | One catalog VALIDATE refuses emptying or hard-deleting the seeded live modifier pool | P1 |
| WDEAD-2026-09-27-007 | Simulation Laboratory spies keep-then-additive feat/GameKey and reports the new occupancy columns | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-27.md`](./ACTION_IDS_WDEAD_2026-09-27.md).
