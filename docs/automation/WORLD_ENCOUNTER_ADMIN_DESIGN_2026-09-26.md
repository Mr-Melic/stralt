# World, Dungeon & Encounter Admin Designer — 2026-09-26

**Source automation:** World, Dungeon & Encounter Admin Designer (`1592c6c0-a499-11f1-a7d1-d6b4613131ce`)  
**This run:** `bc-7a6ba5a1-6a6f-4292-9350-9d089a18d9fd`  
**HEAD inspected:** `0f5363f` (`main` after #332 — **same HEAD as the 2026-09-21 through 2026-09-25 briefs**)  
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

This run’s IDs: [`ACTION_IDS_WDEAD_2026-09-26.md`](./ACTION_IDS_WDEAD_2026-09-26.md).

Do **not** re-issue `WDEAD-2026-08-31-*`, `WDEAD-2026-09-01-*`, `WDEAD-2026-09-02-*`, `WDEAD-2026-09-21-*`, `WDEAD-2026-09-22-*`, `WDEAD-2026-09-23-*`, `WDEAD-2026-09-24-*`, `WDEAD-2026-09-25-*`, `WDD-*`, `EBA-*`, `EED-*` / `ENC-*`, `FSN-*`, `AFDA-*`, `LHIPS-*`, `EBMA-*`, `MIMA-*`, `TBC-*`, or `AUX-*` (admin UX #564).

Live spawn/admin code has not moved since 09-21 (`0f5363f`). New IDs exist because **queued occupancy and persist PRs after #593** (destack-occupied dump, wander-occupied dump, Death Realm pending credit gates, map-modifier id/type reject) would be forked if the owner pack were implemented from 09-25 alone.

Do **not** invent WDD wave 9, FSN drop 9, elite wave 9, or Rush Table H. Those catalogs do not exist yet (newest same-day sibling is telemetry #609). `CatalogWave` on `main` is still `1|2|3` until #344 / #399 / #454 / #503 / #578 land.

---

## 0. What this cron is for

The owner pack, relative spawn knobs, Simulation Laboratory, and DRAFT → SIMULATE → VALIDATE → ACTIVATE **still do not exist**. Admin is still the 15-tab CRUD list (`gameTypes.ts` 483–498; `TABS` 5610–5626). Save is still live.

Preferred lifecycle is unchanged:

**DRAFT → SIMULATE → VALIDATE → ACTIVATE**

Admin / debug / simulation stay **dev-gated**. Simulation must never call `applyRewards`, `saveBattleStats`, `upgradeSpell`, `claimAchievementReward`, `processPendingPurchases`, `redeemGameKey`, persist-lock `commit`, one-shot Doka claim/settle, achievement unlock writers, Boss Rush persist writers (`completeBossRushRoom`, `setBossRushProgress`, `resetBossRush`, `abortBossRush`), or write `pbv_pending_death_penalty_*` / arm `deathTriggered`.

Oldest-first queued siblings this brief consumes (do not duplicate their IDs):

| PR | Role vs this pack |
| :--- | :--- |
| #337 / #394 / #451 / #534 / **#593** WDEAD | Prior designer IDs `001`…`007` / `008`. Stay `NEW`. |
| #344 / #399 / #454 / #503 / #578 WDD | Waves 4–8 `WF-*` on the **same** `WORLD_FEATURES` array. On `main` `CatalogWave` is still `1\|2\|3` (`worldFeatures.ts` 64, 115). |
| #348 / #401 / #459 / #537 / #575 FSN | Drops 4–8. Wave 8 families stay deferred to drop 9. |
| #347 / #396 / #479 / #519 / #574 EED | Tide…Brand `ENC-*` rooms. |
| #349 / #405 / #452 / #535 / #558 elite | Waves 4–8 family sheets. Second roll. Never concatenate `FAMILY_TYPES`. |
| #367 / #406 / #474 / #518 / #572 boss bible | Tables C–G. Jackpot `complete(9)` stays mandatory (`#536`). |
| #430 / #436 / #444 / #484 / #494 / #500 / #538 / #542 / #548 / #553 map | Far-island → white-split / portal-seeded destack / generate-time occupied-alcove dump. **09-25-006 already owns these.** |
| **#589 / #600 / #603** destack dump | Battle-start destack sits hostiles on generate-time dump cells; free dump can hit 0. New helpers: `battleStartDump.ts`, `battleStartDumpFloor.ts`, `battleStartFreeDump.ts`. |
| **#591 / #608** wander dump | `#591` extracts `advanceEnemyWander`. `#608` punches a free dump alcove when **wander** occupies dump cells (`enemyWanderDump.ts`). Generate-time `#538` does **not** see wandered bodies. |
| **#576 / #595 / #602 / #604** Death Realm pending | Skip Doka-to-HP, Items Buy, rename / `upgradeSpell`, feat claim / GameKey redeem while the 1.5s (exploration) / 300ms (in-battle) timer is pending. |
| **#605** admin safety | `validateMapModifier` rejects id/type mismatches (`mod_<ts>` + switched `modifierType`). Live hook keys `config.id ∩ MODIFIER_BY_ID`; HUD filters `modifierType`. |
| #564 admin UX | SpellSummonFields absolute level. Do not re-issue `AUX-*` or `WDEAD-2026-09-25-002`. |
| #334 / #415 / #585 AFDA | Honesty copy. Not owner knobs. |
| #540 / #545 / #552 / #580 / #599 persist keeps | `saveBattleStats` “keep” after seeded/unseeded portal / GameKey / victory. Lab must not invoke them (`WDEAD-2026-09-21-005` / 09-25 spy list). Do not re-issue. |

---

## 1. Re-audit: prior WDEAD IDs (all still `NEW` except 013 PARTIAL)

Live evidence is the 09-21 … 09-25 tables at the same HEAD. Line numbers re-checked this run.

| Cluster | Still true? | This-run note |
| :--- | :--- | :--- |
| `WDEAD-2026-08-31-001`…`015` | Yes (013 PARTIAL) | Picker `floor(999 / ts)` (`combatMath.ts` 58). `computeAITier` stops at 900 → tier 10; 30% uniform 1–10 (36–51). Dungeon extras/Doka still `min(depth, 5)` (`spawnPolicy.ts` 29, 144; `portalRules.ts` 161). Death Realm fallbacks `maxLevel: 5` (WX 13514, 13646) vs entry `9999` (5439). Rest `maxLevel: 9999` (5517). No Simulation / Drafts / Encounters / Dungeons / World Events / Spawn tabs. |
| `WDEAD-2026-09-01-001`…`010` | Yes | Tiers unlabeled; preview still `[1, 10, 25, 50, 100, 200, 500]` (`AdminDashboard.tsx` 3877). Dual-roll 22 modifiers still the WDD placement contract (`docs/WORLD_DYNAMICS.md` 44; `EXISTING_MAP_MODIFIER_IDS` 1890–1913). Registry is a documented three-roll (`mapModifiers.ts` 646–694). `WorldFeatureRunMode` is still `exploration \| dungeon \| bossRush` (`worldFeatures.ts` 67). `isFeatureAllowedInContext` hard-returns false for `deathRealm` (1768–1769). Rest is not an enum value. |
| `WDEAD-2026-09-02-001`…`008` | Yes | Closed 9999 still a reject. `_rewardMultiplier` still unused. CatalogNote still claims it is read (`AdminDashboard.tsx` 7143). AdminGuard `minLevel > 999` / `summonUnitDef.level > 99`. `completeBossRushRoom` still `(0, 0)` and `roomIndex > 9`. |
| `WDEAD-2026-09-21-001`…`007` | Yes (queued #337) | Wave 3 is on `main` (52 `WF-*`, `LATEST_CATALOG_WAVE = 3`). `spawnPolicy.ts` is live defaults. Tests still lock `dungeonSpawnExtras(99) === extras(5)` (`spawnPolicy.test.ts` 84). |
| `WDEAD-2026-09-22-001`…`007` | Yes (queued #394) | Family HP still discarded at battle start. Do not re-issue 09-22-002. |
| `WDEAD-2026-09-23-001`…`007` | Yes (queued #451) | Stay `NEW`. |
| `WDEAD-2026-09-24-001`…`007` | Yes (queued #534) | `DEFAULT_CHALLENGES` still absolute (`under_15_turns`, `under_50_damage`, `under_8_ap_per_turn` — `challengeCompletion.ts` 44–109). Do not re-issue 09-24-007. |
| `WDEAD-2026-09-25-001`…`008` | Yes (queued #593) | `WorldFeatureRunMode` still lacks `whiteSanctuary`. `enabledWaves` still cannot name 8 on `main`. Do not re-issue 09-25-001 / 09-25-006 / 09-25-008. |

Missing tabs (unchanged): Encounters, Dungeons, World Events, Spawn (beyond coarse tiers), Simulation, Drafts.

---

## 2. Destack dump and wander dump are new occupancy epochs

`WDEAD-2026-09-25-006` named generate-time occupied-alcove dump punch (#538), punch-then-finalize (#542), white-gateway re-legalize (#548), and portal-seeded destack (#553). Those helpers count dump cells **at generate / battle-start flood**, then treat occupied alcoves as already-dump.

After #593, map integrity opened a **second and third dump epoch**:

1. **#589** — punch a dump alcove after battle-start destack consumes the last free dump (`battleStartDump.ts`).
2. **#600** — restore dump **floor 2** after destack occupies one alcove (`battleStartDumpFloor.ts`). Unique player→exit bridges can still report dump ≥ 2 while free dump is 1.
3. **#603** — punch a free dump alcove when destack occupies **every** dump cell (`battleStartFreeDump.ts`). `#600` no-ops when the count still looks ≥ 2.
4. **#608** — punch a free dump alcove when **overworld wander** sits hostiles on generate-time dump cells (`enemyWanderDump.ts`). `#538` / destack dump helpers do **not** treat wandered bodies as occupants.
5. **#591** — extracts `advanceEnemyWander` from `WorldExploration`. Live wiring of `#608` waits on that extract.

Owner formations (Face Court / Span Gate / drop-8 COURT / `WF-INV-WARBAND`) assume authored cells after generate. Destack can relocate bodies **onto** dump alcoves; wander can do the same later in the overworld tick. A dump punch after that is a new wall/floor edit. VALIDATE must report `destackOccupiedDumpPunch`, `dumpFloor2AfterDestack`, and `wanderOccupiedDumpPunch`. Drop a slot that cannot destack. Do not disable #589/#600/#603/#608 to keep formation art. Do not edit `mapGen.ts` or the RAF loop from this program.

---

## 3. Death Realm pending is a persist quarantine, not only a run-mode

`WDEAD-2026-09-01-010` / `WDEAD-2026-09-25-001` named `deathRealm` and `whiteSanctuary` as **map** eligibility. Live `pickWeightedFeatures` already returns `[]` for `runMode === "deathRealm"` (`worldFeatures.ts` 1858). Portals and encounters already use `isDeathRealmTransitionPending` (`deathGuards.ts` 36–41; test at `deathGuards.test.ts` 55–58).

That is **not** the 1.5s (exploration) / 300ms (in-battle lava) **pending** window:

- `persistDeathPenalty` restores respawn HP in the same death tick (`deathGuards.ts` 31–34).
- App-root recap is `pointer-events: none`, so HUD Trophy / Buy Doka stay clickable.
- Queued **#576** skips Doka-to-HP heal.
- Queued **#595** skips Items Buy.
- Queued **#602** skips rename and `upgradeSpell`.
- Queued **#604** skips feat `claimAchievementReward` and `redeemGameKey` (`deathRealmPendingCredit.ts`). Those credits enqueue after the 20/40 snapshot; a later recap heal `saveBattleStats` can persist the untaxed grant through Death Realm load.

Owner World Events / rest-room / shop / feat / GameKey rewards must be **ineligible while pending** — not only after the Death Realm map loads. Simulation must never write `pbv_pending_death_penalty_*`, never arm `deathTriggered`, and never call those credit methods “to preview a death map.” `grantClass` / `rewardPath: applyRewards` events do not fire during pending. Rest-as-room stays `WDEAD-2026-08-31-007`; Death Realm default catalog stays [].

Do not treat this as a player-level cap. Do not raise the 1.5s timer as an owner “difficulty” knob.

---

## 4. One world-event catalog must reject modifier id/type mismatches

Queued **#605** (`mapModifierIdentityRejected` inside `validateMapModifier`): official Add Modifier sets `id=mod_<timestamp>` and `modifierType=slime_flood`. Live `rollActiveModifiers` keys the engine hook by `config.id ∩ MODIFIER_BY_ID` (`mapModifiers.ts` 667). `visibleMapModifiers` filters the HUD by `modifierType`. Switching the type dropdown to `paper_windstorm` keeps the slime_flood MP hook and hides the overlay. Legacy no-hook ids (`lava_fields`, `custom`) are rejected. Map modifiers have **no** last-good rollback.

`WDEAD-2026-09-01-003` / `WDEAD-2026-09-25-008` asked for **one** owner catalog that includes `WF-*` and the 22 live modifier ids (`EXISTING_MAP_MODIFIER_IDS`, `worldFeatures.ts` 1890–1913) and **one** roll budget after ACTIVATE. They did not name the id/type identity rail.

Owner VALIDATE:

- A live modifier row’s `id` must equal its `modifierType` and must be in `MODIFIER_BY_ID`.
- `WF-*` ids stay `WF-*`. Do not store a wave-8 feature as `id=mod_…` with `modifierType=WF-PRT-HEARTH_GATE`.
- Dual-roll (22 live + overlay) remains a VALIDATE fail.
- CatalogNote on the Map Modifiers tab must not claim a mismatched row is “live” because Save succeeded.

Until VALIDATE, do not overlay wave 8 or merge catalogs from Admin “to try #605.”

---

## 5. Simulation Laboratory — wander epoch, still missing

No Admin Simulation tab. Tiers preview still caps samples at 500. `longHorizonSim.ts` on `main` samples 10_000 / 50_000 — **do not promote it** (including queued LHIPS #560). Crush vs the 999-capped pack stays `WDEAD-2026-09-23-007`.

New report columns (in addition to 09-25): **`destackOccupiedDumpPunch`**, **`dumpFloor2AfterDestack`**, **`wanderOccupiedDumpPunch`**, **`deathRealmPendingBlocks`**, **`modifierIdTypeMismatch`**.

Wander epoch is a **non-RAF occupancy replay**: generate → destack → (optional) wander ticks → dump punch. Use a React-free helper (the `#608` test simulator class, not `WorldExploration` / `#591` live extract). Spy list from 09-21-005 plus:

- `claimAchievementReward` / `redeemGameKey` through `#604` gates
- `upgradeSpell` / rename / Items buy / Doka-to-HP during pending
- `pbv_pending_death_penalty_*` writes
- Rush persist writers
- queued `saveBattleStats` keep paths (#540 / #545 / #552 / #580 / #599)

Hypothetical 100_000 remains a preset, not a career cap.

---

## 6. Owner console IA (unchanged, still missing)

Carved-stone, dark slate, crimson (`#13161f`, `#d8463f`, `#f0c44a`).

```
CONTENT
  Encounters     pools · formations · rarity · objectives · rewards · hazards · rules
                 (ids from EED / FSN catalogs — union, never concatenate copies)
                 VALIDATE epochs: generate · destack · destack-dump · wander-dump
  Dungeons       rooms · sequence · special (incl. white sanctuary) · rest · branch
                 · bosses · modifiers · rewards
  Boss Rush      pool · scale · progression · multipliers · sequence
                 (namespaces 0–9 / B0–B3 / C0–C3 / D0–D3 / E0–E3 / F0–F3 / G0–G3)
                 jackpot complete(9) is mandatory before extra tables
  World Events   eligibility (rest / deathRealm / deathRealmPending / whiteSanctuary)
                 · rarity · hazards · elites · grants · hooks · catalogWave 1–8
                 · modifier id === type (no mod_<ts> drift)
  Spawn          relative level · equal · above · elite · variant · size · family
                 · spells (relative caster offset, not summonUnitDef.level 99) · AI
  Simulation     hypothetical level (unbounded, incl. 100_000) · N · seed · reports
                 · wander epoch (non-RAF)
LIFECYCLE
  Drafts         diff vs active · simulate · validate · activate
LEGACY (label unused knobs until migrate)
  Enemies / Regions / Tiers / Modifiers / Bosses / Names
```

Enemy Register chrome is flavor lore — not an encounter catalog and not `getEnemyConfigs` (engine still has **zero** `enemyConfigs` reads).

### Validate gates (08-31 §6 + later runs + this run)

63. Formations compose with destack-occupied dump (#589 / #600 / #603) and wander-occupied dump (#608). Sim reports those columns. Punch-then-finalize stays (#542). No `mapGen.ts` / RAF hunk. Do not re-issue 09-25-006.
64. World Events / rest-shop / feat / GameKey / heal / rename / `upgradeSpell` are ineligible while `isDeathRealmTransitionPending`. Lab spy includes `#604` gates and `pbv_pending_death_penalty_*`. Death Realm **map** default [] stays `WDEAD-2026-09-01-010`.
65. One catalog: live modifier `id` equals `modifierType` and is in `MODIFIER_BY_ID`. `WF-*` ids stay `WF-*`. `mod_<timestamp>` / `lava_fields` / `custom` fail VALIDATE. Dual-roll still fails (`WDEAD-2026-09-01-003`).
66. Lab wander epoch is a React-free replay. Do not import `WorldExploration`, `#591` live wander, `longHorizonSim`, or `mapGen.simulate.ts`.

---

## 7. What this program must not do

- Do not implement the pack, the lab, or the tabs in this run.
- Do not edit `WorldExploration.tsx` to overlay waves, wander dump, or family HP.
- Do not edit RAF, `mapGen.ts`, turn order, or `calcScaledDamage`.
- Do not add `levelMax` “for safety” or raise 9999 / 99 / 999 / 100000 as a substitute for relative eligibility.
- Do not invent WDD wave 9, FSN drop 9, elite wave 9, or Rush Table H.
- Do not promote `longHorizonSim` / `mapGen.simulate.ts` / LHIPS #560 to Admin.
- Do not open a second reward or spell-level writer (including GameKey or feat claim from the lab).
- Do not re-issue prior WDEAD / WDD / EBA / EED / FSN / AFDA / LHIPS / AUX / TBC IDs.
- Do not retune `100 * 2^(N-1)` or Crush.
- Do not mint INIT from Simulation or `saveBattleStats`.
- Do not concatenate sibling catalogs.
- Do not re-issue 09-22-002 (family HP wipe), 09-24-007 (absolute challenges), 09-25-001 (whiteSanctuary), or 09-25-008 (wave 8).

Extract path (unchanged): wrap `engine/spawnPolicy.ts`; add `engine/encounterFormations.ts`, `engine/encounterSim.ts`, `engine/dungeonPolicy.ts`. Occupancy stays `engine/occupancy.ts` + `engine/battleStartPlacement.ts` plus the queued dump helpers (`battleStartDump.ts`, `battleStartDumpFloor.ts`, `battleStartFreeDump.ts`, `enemyWanderDump.ts`). World-event weights load from the **active** pack (`worldFeatures.ts` is the WDD catalog).

---

## 8. ACTION_ID index (this run only)

| ID | Title | Priority |
| :--- | :--- | :--- |
| WDEAD-2026-09-26-001 | Formations compose with destack-occupied dump and wander-occupied dump | P1 |
| WDEAD-2026-09-26-002 | Death Realm pending is a persist quarantine — rest/shop/feat/GameKey/heal/upgrade ineligible | P0 |
| WDEAD-2026-09-26-003 | One world-event catalog rejects map-modifier id/type mismatches | P1 |
| WDEAD-2026-09-26-004 | Simulation Laboratory wander epoch is a non-RAF occupancy replay | P1 |

Full records: [`ACTION_IDS_WDEAD_2026-09-26.md`](./ACTION_IDS_WDEAD_2026-09-26.md).
