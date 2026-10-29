# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 21

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-29  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Waves 2–20 are generation stamps (`generationMin`). This document does **not** replace any of them. It is Generation 21: one next walk permutation of **(4,3)** (antelope), exact-12 spell gate, fuse-tile pull, leftover **AP − MP === 3** paint, leftover **AP + MP === 8** one-body windows that Octave Mend (both-body) left open, leftover **exactly 3/0** damage and negate, remaining CDs `n>7` → `7`, and `generationMin: 21` family attachments.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-29.md`](./ACTION_IDS_SDE_2026-10-29.md).

**Do not implement production code from this PR.**

---

## 0. Sibling designs (do not duplicate)

| Sibling | Path / PR | Owns |
| :--- | :--- | :--- |
| Wave-1 discovery contract | #156 — `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | State machine, innate four, persist writers, UX copy, Wave-1 cards |
| Wave-2…20 discovery contracts | #226 / #300 / #371 / memory Wave 5 / #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / #962 / #1017 / **#1082** / **#1143** / **#1198** / **#1255** | `generationMin` 2…20, unique catalogs, specials |
| Wave-1…20 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `ACTION_IDS_SDE_2026-10-28.md` | Ownership split, observe hook, victory commit, G slots — **still blocking, still NEW** |
| Spell admin | through **#1291** (SDA-235…249) | Unique `ACTION_IDS_SDA_2026-10-29.md` / `SPELL_ADMIN_DESIGN_2026-10-29.md`. Do not overwrite. **#1226** still owns 220–234 |
| Tactical gap-fillers | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** / **#1309** | Stamp, do not clone. **#1251** is Wave **21** family CORE. **#1309** is Wave **22** family CORE |
| Family sheets | through **#1305** (`octave_mender` … `fresh_plater`) | Wave-21 CORE. Do not put unique §11 there. Wave-21 families consume unique **#1198** + **#1251**. **#1248** remains Wave-20 (`septet_mender` … `idle_plater`) |
| Boss extras | through **#1302** (`shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`) | Rush Table T. Leftover **#695** Shove Sting / Must Step **and** leftover **#726** Mid Hood / leftover **#787** Parched Step. Spectacular `NAVE_SHOVE` / `CHOIR_MUST` / `NAVE_MID` / `NAVE_OBLATE` stay `BOSS_ONLY`. Do not restamp. Do not remap `shove_cantor` / `must_preceptor` / `parched_cantor` / `parched_preacher` / `gait_cantor` / `halve_precentor` / `trim_precentor`. **#1244** remains Wave-21 Table S |
| Encounter rooms | **#1303** Sestet/Tern/Mire/Stock | Teach **#1189**+**#1082** verbs, not unique §11 antelope. `ENC-TEACH-21` / `ENC-SPELL-41` / `ENC-SPELL-42` / `ENC-HAZ-41` / `ENC-HAZ-42` / `ENC-SESTET-01` / `ENC-TERN-01` / `ENC-MIRE-01` / `ENC-RUSH-79`…`82`. STOCK ≠ `ENC-POISE-01`. **#1249** remains Stave/Ring/Rime/Match |
| World dynamics | **#1285** Wave-21 `WF-*-QUOTA_*` | Unique `ACTION_IDS_WDD_2026-10-29.md`. Do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`. `WF-SPL-QUOTA_TUTOR` never writes `ownedSpellIds`. Remaining AP equals max MP, not Poise remaining-MP-equals-max-MP. **#1235** remains Wave-20 `WF-*-POISE_*` |
| PX coherence | **#1300** | Unique `ACTION_IDS_PXA_2026-10-29.md`. MP is the **walk** resource; `CharacterStats.evasion` is persist-only |
| Formations | **#1294** drop 21 | Wave-20 packs. Unique `ENEMY_FORMATIONS_2026-10-29.md`. Clearing a formation is not a grant |
| Enemy/boss admin | **#1284** EBA 2026-10-29 | Unique files. Zero extra doors |
| World/dungeon admin | **#1289** WDEAD 2026-10-29 | Unique files. Occupancy/remount rails, not grants |
| Master roadmap | **#1281** MTD 2026-10-29 | Unique `ACTION_IDS_2026-10-29.md`. Do **not** restack `MASTER_ROADMAP.md` |
| AI increment | **#1307** AEE 2026-10-29 | Unique `ACTION_IDS_AEE_2026-10-29.md`. Inspector lists modules by id. Missing hint → drop |
| Content diversity | **#1295** 2026-10-29 | Unique files. Not CDA-031 (**#1069**) |
| Long horizon | **#1312** 2026-10-29 | Unique `ACTION_IDS_LHIPS_2026-10-29.md` / `LONG_HORIZON_2026-10-29.md`. Sim only. Do **not** restack `longHorizonSim.ts`. Never writes `ownedSpellIds`. **#1250** remains 2026-10-28 |
| Telemetry balance | **#1277** TBC 2026-10-29 | WAITING_FOR_TELEMETRY. Unique `ACTION_IDS_TBC_2026-10-29.md`. Not a spell catalog |

**Id collision rule:** do not reuse any id in §0.1. Wave-21 ids in §11 are new.

### 0.1 Reserved tombstone (never re-propose)

Prior unique SDE catalogs (Waves 1–20, memory Wave 5) and tactical catalogs (#120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #849, #890, #953, #1011, #1063, #1132, #1177, **#1251**, **#1309**) remain reserved in those contracts. This wave adds:

**#1255 Wave 20 SDE (never re-propose):** `spell-giraffe-stride`, `spell-undeca-oath`, `spell-trip-reel`, `spell-giraffe-bite`, `spell-skew-mark`, `spell-deep-plate`, `spell-trip-skip`, `spell-pair-gait`, `spell-summon-giraffe`, `spell-deep-gift`, `spell-cadence-sext`, `spell-trip-toll`, `spell-brick-split`, `spell-watch-clip`, `spell-pair-plate`, `spell-trip-cut`, `spell-giraffe-gate`, `spell-pack-giraffe`, `spell-giraffe-fold`.

**#1198 Wave 19 SDE (stamp as Wave 21 family CORE, do not clone):** `spell-camel-stride`, `spell-deca-oath`, `spell-glyph-reel`, `spell-camel-bite`, `spell-hollow-mark`, `spell-wide-plate`, `spell-fuse-skip`, `spell-hollow-sting`, `spell-summon-camel`, `spell-thin-gift`, `spell-cadence-quint`, `spell-prime-toll`, `spell-brick-levy`, `spell-watch-shave`, `spell-lean-gait`, `spell-glyph-cut`, `spell-fresh-plate`, `spell-pack-camel`, `spell-camel-fold`.

**#1251 tactical Wave 20 — stamp as Wave 21 family CORE, do not clone:** `spell-octave-mend`, `spell-cadence-quinte`, `spell-pentadeca-span`, `spell-kin-turn`, `spell-octave-hood`, `spell-octave-sting`, `spell-octave-step`, `spell-octave-sill`, `spell-octave-hold`, `spell-octave-lend`, `spell-octave-sip`, `spell-octave-post`, `spell-octave-bounce`, `spell-must-octave`, `spell-verse-octave`, `spell-court-quinte`. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for **Wave 22** sheets — do not restamp. Court Quinte never owned.

**#1309 tactical Wave 21 — stamp as Wave 22 family CORE, do not clone:** `spell-nonet-mend`, `spell-cadence-sixte`, `spell-hexadeca-span`, `spell-triad-turn`, `spell-nonet-hood`, `spell-nonet-sting`, `spell-nonet-step`, `spell-nonet-sill`, `spell-nonet-hold`, `spell-nonet-lend`, `spell-nonet-sip`, `spell-nonet-post`, `spell-nonet-bounce`, `spell-must-nonet`, `spell-verse-nonet`, `spell-court-sixte`. Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` wait for **Wave 23** sheets — do not restamp. Court Sixte never owned.

**Memory Wave 5 (still no GitHub PR — still tombstoned):** `spell-gaze-sill`, `spell-close-debt`, `spell-near-veil`, `spell-soft-step`, `spell-twice-mark`, `spell-rebound-ward`, `spell-cull-kennel`, `spell-whelp-sill`, `spell-ash-sill`, `spell-spent-lens`, `spell-wait-fang`, `spell-share-gaze`, `spell-body-glass`, `spell-last-stride`, `spell-post-hex`, `spell-turn-sill`, `spell-pack-cover`, `spell-false-gaze`, `spell-void-span`.

**Do not alias** Antelope Stride ↔ Giraffe Stride ↔ Camel Stride ↔ Hook Stride ↔ Tern Stride ↔ Knight Stride ↔ Ring Stride; Duodeca Oath ↔ Undeca Oath ↔ `span_dodeca` ↔ Pentadeca Span ↔ Hexadeca Span; Fuse Reel ↔ Trip Reel ↔ Glyph Reel ↔ Slide Reel; Split Mark ↔ Skew Mark ↔ Hollow Mark ↔ Idle Mark ↔ Octave Post ↔ Nonet Post; Octet Plate ↔ Deep Plate ↔ Pair Plate ↔ Octave Hood ↔ Nonet Hood; Wick Skip ↔ Fuse Skip ↔ Trip Skip ↔ Brier Skip; Octet Gift ↔ Deep Gift ↔ Thin Gift ↔ Wide Gift ↔ Octave Mend ↔ Nonet Mend; Trio Gait ↔ Pair Gait ↔ Thin Gait ↔ Hollow Sting ↔ Wide Sting ↔ Nonet Sting; Cadence Sept ↔ Cadence Sext ↔ Cadence Quint ↔ Cadence Quinte ↔ Cadence Sixte; Pack Antelope ↔ Pack Giraffe; Antelope Fold ↔ Giraffe Fold; Trio Plate ↔ Pair Plate ↔ Dry Plate; Antelope Gate ↔ Antelope Bite ↔ Duodeca Oath ↔ Kin Turn ↔ Giraffe Gate ↔ Triad Turn. Those are sibling-owned fantasies.

**Do not mint:** `spell-antelope-line`, `spell-zebra-stride`, `spell-alfil-stride`, `spell-ibis-stride`, `spell-giraffe-line`, `spell-octave-gift`, `spell-eight-gift`, `spell-nonet-gift`, `spell-trio-gift`, `spell-three-gait`, `spell-cadence-seven`, `spell-cadence-hepta`, `spell-cadence-six`, `spell-cadence-hexa`, `spell-duodeca-span`, `spell-twelve-span`, `spell-sixteen-span`, `spell-hexakaideca-span`, `spell-dodeca-oath`, `spell-fifteen-span`, `spell-undeca-span`, `spell-nona-span`, `spell-hook-line`, `spell-camel-line`, `spell-parched-mend`, `spell-trio-turn`, `spell-trine-turn`, `spell-choir-turn`. Stamp **#1063** `spell-dodeca-span`; stamp **#1251** `spell-octave-mend` / `spell-cadence-quinte` / `spell-pentadeca-span` / `spell-kin-turn`; stamp **#1309** `spell-nonet-mend` / `spell-cadence-sixte` / `spell-hexadeca-span` / `spell-triad-turn`; do not clone. **SDE already owns** `spell-fuse-skip` as Wave-19 pathLength-**1** fuse skip; this wave’s Wick Skip is pathLength-**2** onto the same occupancy — do not reuse the Wave-19 id.

### 0.2 Same-day / queued hole ownership (stamp, do not clone)

**#1251 owns** the G≥20 leftover-sum===8-unequal / CD `5→0` / fifteen-occupy / caster-plus-one-ally invert holes. This catalog’s unique §11 ids stay this document’s. Wave-21 family CORE is unique **#1198** Wave-19 verbs **plus** **#1251** (except Court Quinte; Octave Mend is healer CORE only). Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` — do not restamp.

**SDE wins** unique leftover collisions:

| Unique §11 | Window | Not a clone of |
| :--- | :--- | :--- |
| Octet Gift | leftover **AP + MP === 8** heal (one body) | Octave Mend (both-body leftover **sum === 8 AND unequal**); Nonet Mend (both-body leftover **sum === 9**); Wide Gift (AP≥2/MP≥1 quadrant, not an exact-sum gate); Deep Gift (1/≥2); Thin Gift (1/0); Gait Gift (≥2/0); Lean Gift (0/≥1) |
| Cadence Sept | remaining `n>7` → **7** | Cadence Sext (`n>6`→6); Cadence Quint (`n>5`→5); Cadence Quinte (`n===5`→0); Cadence Sixte (`n===6`→0) |
| Octet Plate | leftover **AP + MP === 8** negate | Octave Hood (both-body leftover-sum miss); Deep Plate (1/≥2); Pair Plate (2/0); Wide Plate (AP≥2/MP≥1) |
| Split Mark | turn-end leftover **AP − MP === 3** detonate | Skew Mark (AP − MP === **2**); Hollow Mark (0/0); Idle Mark (MP equals max); Last Mark (last leftover AP) |
| Trio Gait | leftover **AP === 3 AND MP === 0** damage | Pair Gait (2/0); Thin Gait (1/0); Hollow Sting (0/0); Wide Sting (AP≥2/MP≥1) |
| Trio Plate | leftover **AP === 3 AND MP === 0** negate | Pair Plate (2/0); Dry Plate (MP=0, **any** AP); Thin Plate (1/0) |

`octave_cantor` is **not** Octet Gift’s door. `quinte_precentor` is **not** Cadence Sept’s door. `span_pentadeca` is **not** Duodeca Oath’s door. `span_dodeca` is **not** Duodeca Oath. `span_hexadeca` is **not** Duodeca Oath. `nonet_cantor` is **not** Octet Gift’s door. `sixte_precentor` is **not** Cadence Sept’s door. `court_quinte_regent` is **not** `antelope_fold_regent`. `court_sixte_regent` is **not** `antelope_fold_regent`. `giraffe_gallery` is **not** Antelope Stride’s room. `fuse_nave` is **not** Wick Skip. `skew_pulpit` is **not** Split Mark. Do not name unique §11 families `octave_mender` / `cadence_quinter` / `cadence_quintrer` / `pentadeca_prelate` / `kin_turner` / `camel_warder` / `nonet_mender` / `cadence_sixter` / `hexadeca_prelate` / `triad_turner` / `septet_mender` / `giraffe_precentor` / `camel_precentor` (#1305 / #1248 / #1251 / #1309 / #1255 / #1198 own those slots).

Target-only leftover **sum === 8** is the hole Wave 20 reserved. Wide Gift already covers several of those *pairs* as a **quadrant**; Octet Gift is an **exact-sum predicate** (leftover 7 or 9 misses). **Do not mint** `spell-octave-gift` / `spell-eight-gift`. Leftover **AP − MP === 3** as a **heal** is Gait Gift for `(3,0)` and Wide Gift for `(4,1)` — **do not mint** `spell-split-gift`. Split Mark is the detonate, not a heal.

Same-day 2026-10-29 catalogs **opened** after first authoring. Stamp them; do not clone unique §11:

- **#1251** remains Wave-20 tactical. **Stamp it as Wave 21 family CORE** together with unique **#1198** Wave-19 verbs. Octave Mend is both-body leftover **sum === 8 AND unequal**. Cadence Quinte is remaining `n===5` → `0`. Pentadeca Span is fifteen occupy. Kin Turn is leftover invert on **caster + one same-side ally**. Court Quinte never owned. Extra doors wait for **Wave 22** sheets — do not restamp. **SDE wins** unique leftover collisions in the table above.
- **#1309** Wave-21 tactical. **Stamp it as Wave 22 family CORE** together with unique Wave-20 §11 (**#1255**). Nonet Mend is both-body leftover **sum === 9**. Cadence Sixte is remaining `n===6` → `0`. Hexadeca Span is sixteen occupy (axis-aligned 4×4). Triad Turn is leftover invert on **caster + one same-side ally + one opposite-side hostile**. Court Sixte never owned. Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` wait for **Wave 23** sheets — do not restamp. **SDE wins** unique leftover collisions: Octet Gift stays one-body leftover AP+MP===8, not Nonet Mend both-body sum===9 and not Octave Mend both-body sum===8 unequal; Cadence Sept stays `n>7→7`, not Cadence Sixte `6→0` and not Cadence Sext `n>6→6`; Duodeca Oath stays exact-12 spell gate, not Hexadeca Span occupy-weight 16; Antelope Gate stays next-spell dest (4,3), not Triad Turn.
- **#1305** Wave-21 families (`octave_mender` … `fresh_plater`) — do not restamp those `ENEMY_ID`s. Do not name unique §11 families after them.
- **#1255** Wave-20 SDE rooms `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent` — do not restamp. Unique Wave-20 §11 stay extras until Wave 22.
- **#1248** Wave-20 families (`septet_mender` … `idle_plater`) — do not restamp those `ENEMY_ID`s.
- **#1244** Wave-21 extra doors `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` — do not restamp.
- **#1302** Wave-22 extra doors `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate` — leftover **#695** Shove Sting / Must Step **and** leftover **#726** Mid Hood / leftover **#787** Parched Step. Spectacular `NAVE_SHOVE` / `CHOIR_MUST` / `NAVE_MID` / `NAVE_OBLATE` stay `BOSS_ONLY`. Do not remap `shove_cantor` / `must_preceptor` / `parched_cantor` / `parched_preacher` / `gait_cantor` / `halve_precentor` / `trim_precentor`.
- **#1303** ENC-TEACH-21 / ENC-SPELL-41 / ENC-SPELL-42 / ENC-HAZ-41 / ENC-HAZ-42 / ENC-SESTET-01 / ENC-TERN-01 / ENC-MIRE-01 / ENC-RUSH-79…82 — teach **#1189** / **#1082** verbs (Sestet Mend, Tern Stride, remaining-MP===max Stock), **not** unique §11 antelope. STOCK ≠ `ENC-POISE-01`.
- **#1249** ENC-TEACH-20 / ENC-SPELL-39 / ENC-SPELL-40 / ENC-RUSH-75…78 — teach **#1138** / **#1017** verbs, **not** unique giraffe or antelope.
- **#1285** Wave-21 `WF-*-QUOTA_*`. Unique `ACTION_IDS_WDD_2026-10-29.md`. Do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`. `WF-SPL-QUOTA_TUTOR` never writes `ownedSpellIds`.
- **#1235** Wave-20 `WF-*-POISE_*`. `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`.
- **#1291** SDA-235…249 unique files. Do not overwrite. **#1226** still owns 220–234.
- **#1281** MTD unique `ACTION_IDS_2026-10-29.md`. Do **not** restack `MASTER_ROADMAP.md`.
- **#1284** EBA / **#1289** WDEAD / **#1290** VAL / **#1294** FSN drop 21 / **#1295** content diversity / **#1297** dead-code / **#1298** UX / **#1299** persist helpers / **#1300** PX / **#1304** MIMA / **#1306** GFCF / **#1307** AEE / **#1277** TBC / **#1279** EBMA / **#1282** GTAD / **#1287** expansion — unique dated files; not leftover catalogs.
- **#1312** long-horizon 2026-10-29. Unique `ACTION_IDS_LHIPS_2026-10-29.md` / `LONG_HORIZON_2026-10-29.md`. Sim only; never writes `ownedSpellIds`. Do **not** restack `longHorizonSim.ts`.
- CDA-031 had **not** opened (**#1069** is 2026-10-25).

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Thirty calendar days after Wave 12, and one day after Wave 20, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

| Fact | Where (this HEAD) | Effect |
| :--- | :--- | :--- |
| Every `starterSpells` row is forced `isBaseSpell: true` and unioned into `ownedSpells` | `WorldExploration.tsx` 2395–2440 | The 32-id frontend catalog is pre-owned |
| Comment still says “ALL starter spells + physical attack” | `WorldExploration.tsx` 2395–2396 | Innate-four split (`SDE-2026-08-31-001`) not landed |
| Backend rows enter the library via `shouldIncludeBackendSpellInLibrary` | `adminSafety.ts` 712–718; WX 2410–2440 | Drops `usableByPlayer === false` unless already owned. **Does not** create a discovery path |
| No `ownedSpellIds` / `observedSpellIds` persist maps | `Character` still `spellLevelKeys` / `spellBarOrder` (`main.mo` 132–142) | Observation cannot survive reload |
| Recap grants XP/Doka/feats only | `PostBattleRecap.tsx` 6–34 `BattleRecapData` | No `discoveredSpells` field |
| Achievements grant Doka only | `admin.mo` `defaultAchievements()` 309–326 | All 15 feat doors are claimed or leftover. This wave **stamps none**. `survivor` stays leftover |
| Challenges grant Doka / XP / badge | `challengeCompletion.ts` `DEFAULT_CHALLENGES` 44–109 | All nine challenge ids remain claimed through Wave 7 |
| `upgradeSpell` levels a known id and **charges Doka** | `main.mo` | Must never be the grant writer |
| `ENEMY_KITS` is still piece-type + zone | `enemyAI.ts` 163–185 | Seeing a bishop cast Frost teaches nothing |
| `buildEnemyKit(pieceType, currentMap.levelZone)` still gets a `{ name, minLevel, maxLevel }` object | WX 11920; zone object at 4683–4687 | `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 194–199); every kit stays zone 0 |
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Octet Gift / Octave Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-21 unique ids stay `mpCost: 0`. Reach Toll / Summon Antelope / Pack Antelope / Watch Halt / Brick Trim are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Fuse Reel is attract-toward-**nearest painted fuse-tile occupancy**, a new dest flavor after Trip Reel (tripwire), Glyph Reel (glyph-tax), and Slide Reel (conveyor) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-21 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Fuse Cut keys off **painted fuse-tile** (`spell-fuse-tile`, #185), never a new `HazardTileType`. Thorned Ground (`mapModifiers.ts` 175–186) is a **map-modifier pathLength tax**, not occupancy. Wick Skip keys off **painted fuse-tile** occupancy and pathLength **2** |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21…29 docs. **#371 owns Wave-4 SDE. #1255 owns Wave-20 SDE. #1251 owns Wave-20 tactical (Wave 21 family CORE). #1309 owns Wave-21 tactical (Wave 22 family CORE). #1305 owns Wave-21 families. #1248 owns Wave-20 families. #1302 owns Wave-22 extra boss doors / Table T. #1244 owns Wave-21 extra boss doors / Table S.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-20 P0 remain the prerequisite. **Do not land Wave-21 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 21 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥21 rares make it sharper: a CHAMPION may hold the generation-21 verb until a (4,3) landing / painted fuse cell / leftover-sum-8 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 21 fills holes Waves 1–20, memory Wave 5, and sibling catalogs left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Giraffe Stride, Camel Stride, Hook Stride, Pack Giraffe, Pack Camel, Fuse Skip, Trip Reel, Cadence Sext, Cadence Quinte, Deep Gift, Octave Mend, Pair Gait, Pair Plate, Skew Mark, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 21 stamps `generationMin: 21`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Reach Toll **adds 1 AP** to the next **walk** whose Chebyshev ≥ 4. Brick Trim **subtracts 1 leftover AP** on the target if adjacent to a barrier. Summon Antelope taxes **allied summons** 1 AP when the walk landing is a (4,3) from origin. Pack Antelope locks **walk dests to (4,3)**. Watch Halt **zeroes leftover MP** from the walker on overwatch snap (does not grant to the caster). None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Discovery state machine (unchanged; Wave-21 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-21 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-antelope-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Antelope Stride later walk confirm-fail (Giraffe / Camel / Hook / orthogonal dest) | Already observed on the arm |
| `spell-split-mark` **paint** | **Yes** — paint is the use |
| Split Mark later turn-end detonate | **No second observe** |
| `spell-octet-plate` / `spell-trio-plate` **armed** | **Yes** |
| Later negated hit | **No second observe** |
| `spell-fuse-reel` AP spent, no painted fuse-tile in radius | **Yes** — fizzle after AP |
| `spell-octet-gift` AP spent, leftover AP+MP ≠ 8 | **Yes** — fizzle after AP |
| `spell-reach-toll` AP spent, target Chebyshev ≤ 3 | **Yes** — fizzle after AP |
| `spell-wick-skip` **armed** | **Yes** |
| Wick Skip later ignored fuse trigger | **No second observe** |
| Illegal confirm (no AP) | **No** |
| `spell-pack-antelope` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-antelope-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-21 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥21 family verbs in §11 **plus** #1198 / #1251 stamps in §0.2 / §12 |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Antelope Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Quinte stays `NOT_PLAYER_LEARNABLE` on `court_quinte_regent` |
| `ELITE` | Summon Antelope, Octet Gift, Watch Halt, Fuse Cut, Trio Plate. **#1251** Octave Hood / Octave Hold / Must Octave stamp as Wave 21 CORE, not unique §11 |
| `SPECIAL_ENCOUNTER` | `antelope_gallery` / `dozen_nave` / `wick_aisle` / `split_pulpit` / `wick_lane` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #1251 Octave Mend / Cadence Quinte / Pentadeca Span as Wave 21 CORE. Stamp #1198 unique Wave-19 verbs as Wave 21 CORE. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 20 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#1244**: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` (`CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`; leftover Gait Sip / Cadence Halve / Odd Hood / Cast Sill). **#1251**: `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave **22** sheets; not Table S). **#1255**: `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` / `giraffe_precentor` / `giraffe_fold_regent`. **#1198**: `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`. **#1248** family ids `septet_mender` … `idle_plater`.

---

## 5. Learnable vs closed

| Flag | Wave-21 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Antelope and Antelope Fold |
| `ENEMY_ONLY` | `spell-pack-antelope` on `antelope_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-antelope-fold` on `antelope_fold_regent` |
| `SYSTEM_ONLY` | None this wave |

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

---

## 6. Spell pool evolution (unbounded G)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 21 adds the **G≥21 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1…20 | As Waves 2–20 |
| 21 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 21` |
| 22+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-20 G20 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **21** for families listed in §12. It remains a data query, not a constant in combat math.

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 7. AI compatibility (Wave-21 hints)

Wave 1 §9.1 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_antelope_4_3` | flanker, kiter | Next walk dest is a permutation of (4,3); skip if Giraffe/Camel dest is the only legal close |
| `next_spell_exact_chebyshev_12` | caster, kiter | Next damaging spell only if Chebyshev to target === 12; skip if 11 (Undeca Oath) or 10 (Deca Oath) |
| `attract_toward_nearest_fuse_tile` | caster, controller | A painted fuse-tile cell exists in search radius; dest after attract is floor, not `map.portals` |
| `bonus_if_share_antelope_4_3_with_caster` | flanker | Target is a (4,3) from caster; skip if (4,1) (Giraffe Bite) or (3,2) (Camel Bite) |
| `detonate_if_turn_end_leftover_ap_minus_mp_eq_3` | caster, controller | Paint a cell the occupant will end on at leftover AP − MP === 3; skip if leftover diff is 2 (Skew Mark) |
| `negate_hit_if_leftover_ap_plus_mp_eq_8` | guardian, kiter | Caster leftover AP+MP === 8 at arm; skip if leftover is 2/0 (Pair Plate) or 1/≥2 (Deep Plate) |
| `skip_fuse_trigger_on_path_length_2` | kiter, flanker | A painted fuse-tile sits on a 2-step approach; skip if the needed walk is pathLength 1 (Fuse Skip’s window) |
| `bonus_if_leftover_ap_eq_3_and_mp_eq_0` | caster, berserker | Caster leftover 3/0; skip if leftover is 2/0 (Pair Gait) or 1/0 (Thin Gait) |
| `summon_walk_antelope_4_3_ap_tax` | summoner, guardian | ≥1 living allied summon; skip if none will land (4,3) from origin |
| `heal_if_leftover_ap_plus_mp_eq_8` | healer, buffer | Target leftover AP+MP === 8; skip if leftover is a Wide Gift quadrant that is not sum 8, or both-body sum===8 (Octave Mend) |
| `cap_remaining_cds_gt_7_to_7` | buffer, caster | An ally (or self) holds a remaining CD > 7; skip if all remaining ≤ 7 |
| `tax_next_walk_if_chebyshev_ge_4` | caster, controller | Target’s next walk would be Chebyshev ≥ 4; skip if already rooted |
| `trim_leftover_ap_if_adjacent_barrier` | caster, controller | Target is adjacent to a barrier; skip if leftover AP is already 0 |
| `overwatch_snap_zero_walker_leftover_mp` | kiter, caster | Arm when the player is likely to walk into band; snap leftover MP → 0, do not steal to caster |
| `negate_hit_if_leftover_ap_eq_3_and_mp_eq_0` | guardian | Caster leftover 3/0 at arm; skip if leftover 2/0 (Pair Plate) or leftover MP=0 at other AP (Dry Plate) |
| `bonus_if_near_fuse_occupancy` | caster, flanker | Target Chebyshev ≤ 2 from painted fuse-tile; skip if that cell is tripwire (Trip Cut) or glyph-tax (Glyph Cut) |
| `next_spell_exact_antelope_4_3` | caster, kiter | Next damaging spell only if target is a permutation of (4,3); skip if Chebyshev 12 (Duodeca Oath) is the only legal hole |
| `pack_walk_antelope_4_3` | buffer | CHAMPION only; skip if aura up |
| `fold_two_player_side_share_antelope_4_3` | **boss AI only** | Exactly two living player-side bodies sharing a (4,3); skip if they share (4,1) only (Giraffe Fold) |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 8. Persistence (Wave-1 writers; Wave-21 does not add a second path)

Wave 1 §8 is the persist contract. Wave 21 adds **no** new canister methods.

| Writer | Wave-21 use |
| :--- | :--- |
| `recordSpellObservation` | All `OBSERVATION_REQUIRED` cards |
| `commitSpellDiscoveries` | Victory grants; empty if already owned |
| `unlockOwnedSpell` | Not used this wave (no feat / challenge / boss-grant stamps) |

Rules that must stay true:

- Enqueue on `createProgressPersist`. `commit` after the canister write.
- Grant is owned-id **append only**.
- Must not call `upgradeSpell` (charges `spellLevelingBaseCost * 2^level`).
- Must not call `updateCharacter`.
- Must not mint Doka/XP.
- Must not reset `spellLevelKeys`.
- Duplicate victory callback → empty grant list.
- Death penalty (`saveBattleStats` 20/40) does not touch owned/observed.
- `localStorage` is cache only.
- Octet Gift HP gain: `healUsed` only when player-side HP actually increased.
- Brick Trim’s leftover-AP trim is **not** `recordChallengeApSpend`.
- Watch Halt’s leftover-MP zero is not incoming damage and is not `recordChallengeApSpend`.
- Wick Skip does not rewrite lava/spikes challenge paths.

---

## 9. Special encounters (Wave 21)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `antelope_gallery` | Blink Cutter on a board with legal (4,3) landings and blocked (4,1) / (3,2) / (3,1) / orthogonal-4 | `spell-antelope-stride` via observe+win |
| `dozen_nave` | Glass Sniper at Chebyshev 12 down a long file (not 11) | `spell-duodeca-oath` via observe+win |
| `wick_aisle` | Fuse Scribe with a painted fuse-tile the player must respect | `spell-fuse-reel` via observe+win |
| `split_pulpit` | Bone Scribe; occupant will end the turn at leftover AP − MP === 3 | `spell-split-mark` via observe+win |
| `wick_lane` | Tide Shade beside a painted fuse-tile on a 2-step approach | `spell-wick-skip` via observe+win |

Wave-20 `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` are not re-specified. `span_dodeca` stays Dodeca Span occupy-weight 12, not Duodeca Oath. `fuse_nave` stays Fuse Skip (pathLength 1), not Wick Skip. `wick_gallery` (Wave 6) is not Wick Skip.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–20 + sibling tactical catalogs already cover: push, pull, blink, root, (4,1) next walk, (3,2) next walk, (3,1) next walk, Chebyshev-3 orthogonal next walk, knight walk, Chebyshev-2-not-knight walk, exact-4…11 spell gates, tripwire pull, leftover-AP−MP===2 paint, leftover-1/≥2 heal and negate, leftover-2/0 damage and negate, leftover-sum===8 **both-body** heal, remaining `n>6`→6, remaining `5→0`, fifteen-cell occupy, caster-plus-one-ally invert.

**Still open (Wave 21 SDE unique ids).** Occupy-weights, leftover-sum===8 **both-body** family, CD quinte, and giraffe/camel/hook walks are siblings’; this table is what Discovery **adds**. Wave 20 §13 reserved four of these holes.

| Hole | Wave-21 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk permutation of **(4,3)** | `spell-antelope-stride` | Giraffe Stride is **only** `(4,1)`. Camel Stride is **only** `(3,2)`. Hook Stride is **only** `(3,1)`. Both Giraffe and Antelope are Chebyshev **4**; the permutation is the identity. Alfil `(2,2)` is Ring ∩ Diag. Zebra in fairy chess is `(2,3)` = this catalog’s Camel. Do not mint `spell-zebra-stride` / `spell-alfil-stride` / `spell-antelope-line` / `spell-ibis-stride` |
| Next spell illegal unless Chebyshev = 12 | `spell-duodeca-oath` | Undeca Oath is 11. Deca Oath is 10. Dodeca Span is occupy-weight 12 on `span_dodeca`. Do not mint `spell-dodeca-oath` / `spell-duodeca-span` / `spell-twelve-span` |
| Pull 1 toward nearest **painted fuse-tile occupancy** | `spell-fuse-reel` | Trip Reel is painted tripwire. Glyph Reel is painted glyph-tax. Slide Reel is painted conveyor. Brick Reel is **barrier**. Fuse Tile **is** the paint (`spell-fuse-tile`, #185). Dest is never `map.portals` |
| Bonus if share a **(4,3)** vector | `spell-antelope-bite` | Giraffe Bite is `(4,1)`. Camel Bite is `(3,2)`. Antelope Stride is a **walk** constraint. Antelope Gate is a **next-spell** gate |
| Cell detonates at occupant **turn end** iff leftover **AP − MP === 3** | `spell-split-mark` | Skew Mark detonates iff leftover **AP − MP === 2**. Hollow Mark is leftover **0/0**. Occupant leftover 3/0 or 4/1 fires this, not Skew. Do not mint `spell-split-gift` |
| Next hit is 0 while leftover **AP + MP === 8** | `spell-octet-plate` | Deep Plate is leftover **1/≥2**. Pair Plate is leftover **2/0**. Octave Hood is both-body leftover-sum miss. Octet Gift is the **heal** on this window |
| PathLength **2** walk onto a **painted fuse-tile** does not trigger this enter | `spell-wick-skip` | Fuse Skip is fuse occupancy + pathLength **1**. Trip Skip is tripwire occupancy + pathLength 2. Brier Skip is Thorned extra + pathLength 2, not occupancy. PathLength 1 onto fuse still triggers (Fuse Skip’s window) |
| Bonus if leftover AP **=== 3 AND** leftover MP **=== 0** | `spell-trio-gait` | Pair Gait is leftover **2/0**. Thin Gait is leftover **1/0**. Hollow Sting is leftover **0/0**. Wide Sting is leftover AP **≥ 2 AND** MP **≥ 1**. Trio Plate is the **negate** on 3/0. Do not mint `spell-trio-gift` / `spell-three-gait` |
| Allied summons pay +1 AP if this turn’s walk **landing** is a **(4,3)** from **origin** | `spell-summon-antelope` | Summon Giraffe taxes **(4,1)**. Summon Camel taxes **(3,2)**. Pack Antelope **locks** pack walks to (4,3) (`ENEMY_ONLY`) |
| Heal iff leftover **AP + MP === 8** (one body) | `spell-octet-gift` | Octave Mend is both-body leftover **sum === 8 AND unequal**. Wide Gift is AP ≥ 2 **and** MP ≥ 1 (quadrant, not exact sum). Deep Gift is AP === 1 **and** MP ≥ 2. `healAmount` stays 0 on the row. Do not mint `spell-octave-gift` / `spell-eight-gift` |
| Remaining CDs **n>7 → 7**; 0…7 unchanged | `spell-cadence-sept` | Cadence Sext is `n>6` → **6**. Cadence Quint is `n>5` → **5**. Cadence Quinte is `n===5` → 0. Hepta Oath is a **spell gate** exactly 7. Do not mint `spell-cadence-seven` / `spell-cadence-hepta` |
| Next **walk** +1 AP if Chebyshev ≥ 4 | `spell-reach-toll` | Trip Toll is Chebyshev ≤ 1 from **painted tripwire**. Brick Tax is adjacent **barrier**, walk +1 AP. Even Toll is leftover **AP even ≥ 2**. Not `spell.mpCost` |
| Trim leftover **AP** by 1 while adjacent to a **barrier** | `spell-brick-trim` | Watch Clip is snap **−1 leftover AP**. Brick Split **halves leftover MP** if adjacent barrier. Immediate leftover rewrite, not a flag |
| Overwatch snap **leftover MP → 0** on the walker (caster does not gain it) | `spell-watch-halt` | Watch Clip is snap **−1 leftover AP**. Watch Shave is snap **−1 leftover MP**. Watch Root **zeros leftover MP on cast**. Not `recordChallengeApSpend` |
| Next hit is 0 while leftover AP **=== 3 AND** leftover MP **=== 0** | `spell-trio-plate` | Pair Plate is leftover **2/0**. Dry Plate is leftover **MP = 0** at **any** AP. Trio Gait is **damage** on 3/0. Do not CORE with Dry Plate |
| Bonus if Chebyshev ≤ 2 from **painted fuse-tile occupancy** | `spell-fuse-cut` | Trip Cut is **tripwire**. Glyph Cut is **glyph-tax**. Slide Cut is **conveyor**. Fuse Reel **pulls**. Portal Cut is **world portals** |
| Next spell illegal unless target is a permutation of **(4,3)** | `spell-antelope-gate` | Duodeca Oath is Chebyshev **=== 12**. Antelope Bite is a **damage bonus** on (4,3). Antelope Stride is a **walk** gate. Giraffe Gate is dest **(4,1)** |
| Pack walks locked to permutation of **(4,3)** | `spell-pack-antelope` | Pack Giraffe is **(4,1)**. Pack Camel is **(3,2)**. Antelope Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies that share a **(4,3)** vector | `spell-antelope-fold` | Giraffe Fold is shared **(4,1)**. Camel Fold is shared **(3,2)**. Pawn Trade is two hostiles-to-caster. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 21)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–20, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, **#1177**, **#1198**, **#1251**, or **#1255**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Reach Toll / Summon Antelope / Pack Antelope / Watch Halt / Brick Trim are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 21 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #1255 / #1251 / #1198 key names for a different meaning.

```text
antelopeStride43,                 // dest is permutation of (4,3): eight cells
nextSpellExactChebyshev,          // Duodeca Oath — value 12 (reuse key; value distinguishes Undeca=11 / Deca=10)
attractTowardNearestFuseTile, fuseSearchRadius,
bonusIfShareAntelope43WithCaster, antelopeBiteBonus,
detonateIfTurnEndLeftoverApMinusMpEq3,
negateHitIfLeftoverApPlusMpEq8,
skipFuseTriggerOnPathLength2,
bonusIfLeftoverApEq3AndMpEq0, trioGaitBonus,
summonWalkAntelope43ApTax,
requireLeftoverApPlusMpEq8, octetGiftHeal,
capRemainingCdsAbove7To7,         // n>7 → 7; 0…7 stay
nextWalkApTaxIfChebyshevGe, reachTollMin,   // value 4
trimLeftoverApIfAdjacentBarrier,
overwatchSnapZeroWalkerLeftoverMp,
negateHitIfLeftoverApEq3AndMpEq0,
bonusIfNearFuseOccupancy, fuseCutRadius, fuseCutBonus,
nextSpellExactAntelope43,
packWalkAntelope43, packAuraRadius, packAuraDuration,
foldTwoPlayerSideShareAntelope43, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` / `farWatchMin` / `farWatchMax` for Watch Halt’s arm window; `nextSpellExactChebyshev` with value **12**.

---

### SPELL_ID: `spell-antelope-stride`

NAME: Antelope Stride  
ROLE: POSITION — one next walk must be a (4,3) dest  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rank_lancer`; `G ≥ 21` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥21. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm 1 turn. The caster’s **next walk** this turn is legal **only** if the dest is a permutation of (4,3): `(±4,±3)` and `(±3,±4)` (eight cells). Giraffe dests `(±4,±1)`, orthogonal dests including `(4,0)`, Camel dests `(3,2)`, Hook dests `(3,1)`, knight `(2,1)` dests, diagonal dests including `(4,4)`, and any Chebyshev ≠ 4 fail closed (walk confirm rejects; MP not spent). Teleport / Swap / Twin-gate are not that walk. Distinct from Giraffe Stride `(4,1)`, Camel Stride `(3,2)`, Hook Stride `(3,1)`, Tern Stride (Chebyshev 3 orthogonal), Knight Stride `(2,1)`, Ring Stride (Chebyshev 2, knight excluded). Fairy-chess zebra is `(2,3)` = Camel — do not mint `spell-zebra-stride`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_antelope_4_3"`. Flanker / kiter. Skip if no (4,3) landing is floor. **Do not** assign to chargers who only walk orthogonal.  
PLAYER_COUNTERPLAY: Occupy the eight (4,3) cells; stand so the only threat is a Giraffe landing; Root before they arm  
SYNERGIES: Phase Slip onto a (4,3); Antelope Bite after they land; Debt Mark (the gated walk also costs AP)  
BALANCE_RISK: (4,3) jumps a rank and almost a file. 2 AP, CD 2, **strict** geometry. Fail closed, never become Strike. Same Chebyshev 4 as Giraffe, different permutation.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Later confirm-fail does not second-observe. Standard observe → same-encounter win. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-duodeca-oath`

NAME: Duodeca Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 12  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `pale_cantor`; `G ≥ 21`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or listed control id; Strike / `physical_attack` stays legal) confirms only if Chebyshev(caster, target) === 12 (`effectParams: {"nextSpellExactChebyshev":12}`). Distinct from Undeca Oath (11), Deca Oath (10), Dodeca Span (occupy-weight 12 on `span_dodeca`). Do not mint `spell-dodeca-oath`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_12"`. Caster / kiter. Skip if they cannot reach a 12-hole this turn.  
PLAYER_COUNTERPLAY: Walk to 11 or 13; Barrier the file; force Strike  
SYNERGIES: Far Sting at 12; Split Pace after a long walk; Paper Wind to cut their follow-up  
BALANCE_RISK: Exact-12 is a sniper prison. 2 AP + CD 3 + Strike exempt. Do not also ignore LoS.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-fuse-reel`

NAME: Fuse Reel  
ROLE: POSITION — pull 1 toward nearest painted fuse-tile  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `plague_rat` or `glyph_sower`; `G ≥ 21`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `plague_rat`, `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest **painted fuse-tile occupancy** (`spell-fuse-tile`) in Chebyshev 6 (`effectParams: {"attractTowardNearestFuseTile":true,"fuseSearchRadius":6}`). If none exists, fizzle (AP spent). Dest is never `map.portals`, never a Twin Gate pad, never a world reserved cell. Distinct from Trip Reel (tripwire), Glyph Reel (glyph-tax), Slide Reel (conveyor), Brick Reel (barrier), Hook Line (toward caster).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_fuse_tile"`. Caster / controller. Skip if no fuse-tile cell, or if attract would land on lava while HP% < 40.  
PLAYER_COUNTERPLAY: Dispel the fuse; stand so attract is a no-op; Barrier the step  
SYNERGIES: Fuse Tile then reel; Fuse Cut after they sit next to the paint; Wick Skip through the fuse on a 2-step  
BALANCE_RISK: Pull onto a delayed fuse brick a turn. 2 AP, 1 step, G≥21, empty-board fizzle.  
PERSISTENCE_REQUIREMENTS: Fizzle after AP still observes. Dest hazard ticks via existing helpers.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-antelope-bite`

NAME: Antelope Bite  
ROLE: DAMAGE — bonus if share a (4,3) with the caster  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `shadow_lurker`; `G ≥ 21`; `aiProfile` flanker  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is exactly a permutation of (4,3) from the caster, deal an extra 12 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareAntelope43WithCaster":true,"antelopeBiteBonus":12}`). On-rank, on-file, on-diagonal, `(4,1)`, `(3,2)`, `(3,1)`, or `(2,1)` → 10 only. Distinct from Giraffe Bite `(4,1)`, Camel Bite `(3,2)`, Hook Bite `(3,1)`, Antelope Stride (walk gate), Antelope Gate (next-spell gate).  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_antelope_4_3_with_caster"`. Flanker. Walk or Antelope Stride first. Skip if adjacent (use Rear Cut / Strike).  
PLAYER_COUNTERPLAY: Stand off the eight (4,3) cells; summon-block one landing  
SYNERGIES: Antelope Stride then bite; Pawn Trade onto a (4,3)  
BALANCE_RISK: 22 through a fat leap is Frost-adjacent. Gate is strict geometry. Fail closed, never become Strike.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-geometry 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-split-mark`

NAME: Split Mark  
ROLE: TERRAIN — turn-end detonate iff leftover AP − leftover MP === 3  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `bone_scribe`; `G ≥ 21`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. At the **occupant’s turn end**, if leftover AP − leftover MP === 3 (legal leftover pairs include `(3,0)`, `(4,1)`, `(5,2)`, `(6,3)` …), deal 14 (spell, RES+SR) and consume (`effectParams: {"detonateIfTurnEndLeftoverApMinusMpEq3":true}`). Strike-from, walk-enter, teleport landing, leftover AP−MP===2, leftover 0/0, leftover MP equals max, leftover 1/0, leftover 1/1 → no detonate. Distinct from Skew Mark (diff **2**), Hollow Mark (0/0), Idle Mark (MP equals max), Last Mark (last AP), Dwell Mark (any occupy). Observation is the **paint**. Do not mint `spell-split-gift`.  
SCALING: damage follows dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_turn_end_leftover_ap_minus_mp_eq_3"`. Caster / controller. Paint a cell they will hold leftover diff 3 on. Skip if they will hold leftover diff 2 (Skew Mark).  
PLAYER_COUNTERPLAY: Spend to 0/0 or keep leftover 2/0 (Skew’s window); leave the cell; blink off  
SYNERGIES: Quiet Hex so they keep 4 leftover AP and 1 MP; Drain Courage to land on `(3,0)`  
BALANCE_RISK: 14 at end of a split leftover is a punish, not a trap-on-enter. 3 AP, CD 2, diff-3 gate.  
PERSISTENCE_REQUIREMENTS: Paint observes. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octet-plate`

NAME: Octet Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP + leftover MP === 8  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 21`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥21. `generationMin: 21`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **+ leftover MP === 8**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApPlusMpEq8":true}`). Leftover 2/0, 1/≥2, 3/0, 7, or 9 → full hit, charge remains until expiry. Distinct from Deep Plate (1/≥2), Pair Plate (2/0), Wide Plate (AP≥2/MP≥1 quadrant), Octave Hood (both-body leftover-sum miss), Octet Gift (heal on this window). Do not implement as `buffStat: "evasion"`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_plus_mp_eq_8"`. Guardian / kiter. Skip if leftover sum is not 8 or if Deep Plate / Pair Plate is already up.  
PLAYER_COUNTERPLAY: Force a 2-cost tool so the sum drops off 8; Soul Sip leftover MP; wait 1 turn  
SYNERGIES: Haste to hold a 5/3 or 4/4 camp; Octet Gift on a healer in the pack (do **not** CORE both on a BASE kit)  
BALANCE_RISK: An 8-sum leftover camp becomes unhittable for one swing. CD 2 + exact-sum gate. AoE: first instance consumes.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wick-skip`

NAME: Wick Skip  
ROLE: POSITION — pathLength 2 walk onto fuse-tile does not trigger this enter  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `tide_shade` or `plague_rat`; `G ≥ 21`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn, 1 consume. The next **pathLength 2** walk that **enters** a painted fuse-tile cell (`spell-fuse-tile`) does **not** trigger that cell this enter (`effectParams: {"skipFuseTriggerOnPathLength2":true}`). PathLength 1 still triggers (Fuse Skip’s window). Lava / spikes / ice leave-tax / glyph-tax / tripwire / Void Rift / conveyor / Thorned extra still tick. Distinct from Fuse Skip (fuse occupancy, pathLength **1**), Trip Skip (tripwire occupancy, pathLength 2), Brier Skip (Thorned extra, pathLength 2, **not** occupancy). Do not reuse `spell-fuse-skip`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_fuse_trigger_on_path_length_2"`. Kiter / flanker. Skip if no fuse-tile sits on a 2-step.  
PLAYER_COUNTERPLAY: Force a 1-step onto the fuse; wait; paint a second fuse  
SYNERGIES: Fuse Tile then skip through; Fuse Skip is a different pathLength rider — do not CORE both on a BASE kit  
BALANCE_RISK: Skipping a fuse on a 2-step is a positioning gift. PathLength gate + CD 2. Do not retune fuse damage.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Ignored trigger is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trio-gait`

NAME: Trio Gait  
ROLE: DAMAGE — bonus if leftover AP === 3 and leftover MP === 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `bone_scribe` or `purse_scribe`; `G ≥ 21`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `bone_scribe`, `purse_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥21. `generationMin: 21`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **caster’s** leftover AP === 3 **and** leftover MP === 0 at resolve, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq3AndMpEq0":true,"trioGaitBonus":8}`). Leftover 2/0, 1/0, 0/0, 1/1, 0/≥1, or AP≥2/MP≥1 → 10 only. Distinct from Pair Gait (2/0), Thin Gait (1/0), Hollow Sting (0/0), Wide Sting (AP≥2/MP≥1), Prime Gait (1/1), Lean Gait (0/≥1), Trio Plate (negate on 3/0). Do not mint `spell-trio-gift` / `spell-three-gait`.  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_3_and_mp_eq_0"`. Caster / berserker. Spend MP, keep exactly 3 AP. Skip if leftover is 2/0 or AP≥2/MP≥1.  
PLAYER_COUNTERPLAY: Soul Sip leftover AP to 2; Haste so they hold MP; Root  
SYNERGIES: Trio Plate on a guardian in the pack (do not CORE both on a BASE kit); Quiet Hex so a 4-AP tool leaves 3  
BALANCE_RISK: 18 after emptying MP and holding 3 AP is Frost-lite. Gate is exact 3/0.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-antelope`

NAME: Summon Antelope  
ROLE: SUMMONS — allied pets pay +1 AP to land (4,3) from origin  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 21`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 21`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon (same side) that this turn walks to a landing that is a permutation of (4,3) from **that summon’s walk origin** pays +1 AP (`effectParams: {"summonWalkAntelope43ApTax":true}`). Orthogonal / (4,1) / (3,2) / (3,1) / knight landings do not pay. Distinct from Summon Giraffe `(4,1)` tax, Summon Camel `(3,2)` tax, Pack Antelope (pack **lock**, `ENEMY_ONLY`).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_antelope_4_3_ap_tax"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Walk pets orthogonal or onto a Giraffe landing; Sever Tether; kill the chanter  
SYNERGIES: Kennel Lock keeps pets close so (4,3) is a stretch; Pack Antelope is CHAMPION-only and never owned — do not CORE both  
BALANCE_RISK: Player copy taxes **their** pets — a real downside when kiting with (4,3) leaps. Elite + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-octet-gift`

NAME: Octet Gift  
ROLE: SUPPORT — heal iff leftover AP + leftover MP === 8  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 21`; `aiProfile` healer/buffer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No `healAmount` on the row. If the **target’s** leftover AP **+ leftover MP === 8**, heal 10 (`effectParams: {"requireLeftoverApPlusMpEq8":true,"octetGiftHeal":10}`). Else fizzle (AP spent). Leftover 7, 9, 2/0, 1/≥2 that is not a sum-8 pair, or both-body leftover-sum===8 fail. Distinct from Octave Mend (both-body leftover **sum === 8 AND unequal**), Wide Gift (AP≥2/MP≥1 quadrant), Deep Gift (1/≥2), Thin Gift (1/0), Gait Gift (≥2/0), Lean Gift (0/≥1). Healer CORE only. Do not mint `spell-octave-gift` / `spell-eight-gift`.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_plus_mp_eq_8"`. Healer / buffer. Skip unless leftover sum is 8. Do **not** assign to non-healer CORE (`inferArchetype` still keys `healAmount > 0` — keep `healAmount: 0` on the row).  
PLAYER_COUNTERPLAY: Spend 1 AP so the sum drops off 8; Soul Sip leftover MP; Cursed Wound  
SYNERGIES: Quiet Hex so they keep a 5/3 camp; Haste so they hold MP; `easy_1` — the heal fails that challenge when HP actually increases  
BALANCE_RISK: 10 on an exact-sum-8 window is Blood Mend-lite. Elite + fizzle off-window. Exact sum is the identity versus Wide Gift’s quadrant.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. `healUsed` only if player-side HP increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-sept`

NAME: Cadence Sept  
ROLE: SUPPORT — remaining CDs n>7 → 7  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 21`; `aiProfile` buffer/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: No damage. Target may be self. Every remaining spell CD **n>7** becomes 7; 0/1/2/3/4/5/6/7 unchanged (`effectParams: {"capRemainingCdsAbove7To7":true}`). Distinct from Cadence Sext (`n>6`→6), Cadence Quint (`n>5`→5), Cadence Quad (`n>4`→4), Cadence Quinte (`5→0`). Do not CORE with Sext / Quint / Quad / Tern / Cap / Tierce / Dock / Snuff / Quarte / Quinte on the same BASE kit. Do not mint `spell-cadence-seven` / `spell-cadence-hepta`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_7_to_7"`. Buffer / caster. Skip if no remaining CD > 7.  
PLAYER_COUNTERPLAY: Wait the last tick; Dispel; force a 6-CD tool instead  
SYNERGIES: Inferno CD 3 is unchanged; a later 9-CD signature becomes 7. Hard_3 is AP, not CD.  
BALANCE_RISK: Capping 10→7 is a tempo gift. Ally-only + CD 3 + G≥21.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-reach-toll`

NAME: Reach Toll  
ROLE: CONTROL — next walk +1 AP if Chebyshev ≥ 4  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 21`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s **next walk of ≥ 1 tile** this battle (or 2 turns) would land at Chebyshev ≥ 4 from that walk’s origin, that walk also costs +1 AP (`effectParams: {"nextWalkApTaxIfChebyshevGe":true,"reachTollMin":4}`). Else fizzle (AP spent) when the next walk is Chebyshev ≤ 3. Teleport / Swap / Phase Slip / Twin-gate do **not** pay. Distinct from Trip Toll (Chebyshev ≤ 1 from **painted tripwire**), Brick Tax (adjacent **barrier**, walk +1 AP), Even Toll (AP even ≥ 2), Odd Toll (AP odd), Gait Toll (MP = 0). Not `spell.mpCost`. Giraffe / Antelope landings (Chebyshev 4) **do** pay.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_chebyshev_ge_4"`. Caster / controller. Skip if already rooted, or if Brick Tax already covers this body this turn.  
PLAYER_COUNTERPLAY: Walk Chebyshev ≤ 3; Dispel; blink  
SYNERGIES: Antelope Stride then the landing pays; Trip Toll on a different window (near tripwire vs long walk)  
BALANCE_RISK: Long leaps now also tax the leave. 2 AP, CD 2, Chebyshev gate. Inverse of near-tripwire toll.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-trim`

NAME: Brick Trim  
ROLE: CONTROL — leftover AP −1 if adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 21`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target is **adjacent to a barrier** at resolve, their leftover AP becomes `max(0, leftover AP − 1)` immediately (`effectParams: {"trimLeftoverApIfAdjacentBarrier":true}`). Else fizzle (AP spent). Not `spell.mpCost`. Distinct from Watch Clip (snap **−1 leftover AP**, no adjacency), Brick Split (**halve leftover MP** if adjacent barrier), Brick Levy (next **walk +1 MP**).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "trim_leftover_ap_if_adjacent_barrier"`. Caster / controller. Skip if no adjacent barrier, or if leftover AP is already 0.  
PLAYER_COUNTERPLAY: Step off the wall; blink; spend AP first so −1 is 0 anyway  
SYNERGIES: Barrier then trim; Brick Split on leftover MP of the same wall-hugger (do not CORE both on a BASE kit)  
BALANCE_RISK: Wall-hugging kiting loses 1 leftover AP. 2 AP, CD 2, adjacency gate. Challenge: leftover-AP rewrite is not `recordChallengeApSpend`.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Trim is not `recordChallengeApSpend`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-halt`

NAME: Watch Halt  
ROLE: DEFENSE — overwatch snap leftover MP → 0 (caster does not gain it)  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 21`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 21`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into Chebyshev 3 or 4 of the caster has leftover MP set to 0. The caster does **not** gain that MP (`effectParams: {"overwatchSnapZeroWalkerLeftoverMp":true,"farWatchMin":3,"farWatchMax":4,"overwatchDuration":2}`). Push/pull into the band **does** trigger. Teleport / Swap / Twin-gate **does not**. Distinct from Watch Clip (snap **−1 leftover AP**), Watch Shave (snap **−1 leftover MP**), Watch Drain (steal leftover MP to caster **on cast**), Watch Root (zero leftover MP **on cast**), Far Watch (deals damage). Observation is the **arm**. Not `recordChallengeApSpend`.  
SCALING: amount fixed; band fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_zero_walker_leftover_mp"`. Kiter / caster. Skip if the player is already in 1–2.  
PLAYER_COUNTERPLAY: Stay at 5+ or at 1–2; blink in; send a summon into 3  
SYNERGIES: Reach Toll (a Chebyshev-4 leave now costs AP **and** the snap empties leftover MP); Paper Wind  
BALANCE_RISK: Band 3–4 + empty leftover MP is a walk prison. Consume-on-first-body, CD 3, elite. Do not steal to caster. Stronger than Watch Shave (−1).  
PERSISTENCE_REQUIREMENTS: Arm observes. Snap does not second-observe. Zero is not `recordChallengeApSpend`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trio-plate`

NAME: Trio Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP === 3 and leftover MP === 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter` or `plate_warden`; variant ≥ ELITE or `G ≥ 21`; `aiProfile` guardian  
ENEMY_FAMILIES: `brood_chanter`, `plate_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **=== 3 AND** leftover MP **=== 0**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApEq3AndMpEq0":true}`). Leftover 2/0, 1/0, 4/0, 0/0, 3/1, or AP≥2/MP≥1 → full hit, charge remains until expiry. Distinct from Pair Plate (2/0), Thin Plate (1/0), Dry Plate (leftover MP=0 at **any** AP), Wide Plate (needs MP≥1), Trio Gait (damage on 3/0). Do not implement as `buffStat: "evasion"`. Do not CORE with Dry Plate.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_eq_3_and_mp_eq_0"`. Guardian. Arm while holding exactly 3 AP and 0 MP. Skip if Dry Plate / Pair Plate is already up.  
PLAYER_COUNTERPLAY: Force a 4-cost tool or a walk; wait 1 turn; AoE second instance  
SYNERGIES: Quiet Hex so a 4-AP tool leaves 3; Trio Gait on a different body (do not CORE both)  
BALANCE_RISK: A 3-AP empty-MP camp becomes unhittable for one swing. Elite + exact 3/0 gate. Stricter than Dry Plate.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-fuse-cut`

NAME: Fuse Cut  
ROLE: DAMAGE — bonus if Chebyshev ≤ 2 from painted fuse-tile  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `plague_rat`; variant ≥ ELITE or `G ≥ 21`; `aiProfile` caster/flanker  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from **painted fuse-tile occupancy**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfNearFuseOccupancy":true,"fuseCutRadius":2,"fuseCutBonus":8}`). Far from fuse, on a Twin Gate pad, next to tripwire only, or next to lava only → 10 only. Distinct from Trip Cut (tripwire), Glyph Cut (glyph-tax), Slide Cut (conveyor), Lava/Rime/Spike Cuts (live hazards), Fuse Reel (pull), Portal Cut (`map.portals`).  
SCALING: both numbers follow dmg%; radius fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_fuse_occupancy"`. Caster / flanker. Paint fuse first. Skip if no paint in 2 of the target.  
PLAYER_COUNTERPLAY: Step to 3 from the fuse; Dispel the paint; hug a tripwire instead (Trip Cut would want that)  
SYNERGIES: Fuse Tile then cut; Fuse Reel to pull them into 2  
BALANCE_RISK: 18 next to a delayed fuse is the combo. Elite + paint required.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-antelope-gate`

NAME: Antelope Gate  
ROLE: CONTROL — next spell illegal unless target is a (4,3)  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `blink_cutter`; `G ≥ 21`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or listed control id; Strike / `physical_attack` stays legal) confirms only if the target is a permutation of (4,3) from the caster (`effectParams: {"nextSpellExactAntelope43":true}`). Chebyshev 12, `(4,1)`, `(3,2)`, `(3,1)`, knight, orthogonal, and diagonal dests fail closed. Distinct from Duodeca Oath (Chebyshev === 12), Antelope Bite (damage bonus on (4,3)), Antelope Stride (walk gate), Giraffe Gate (dest (4,1)).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_antelope_4_3"`. Caster / kiter. Skip if they cannot reach a (4,3) hole this turn. Do **not** CORE with Antelope Bite on a BASE kit (the bite would always fire after the gate).  
PLAYER_COUNTERPLAY: Stand off the eight (4,3) cells; force Strike; Barrier one landing  
SYNERGIES: Antelope Stride onto a (4,3) then a gated poke from a different body; Far Sting is range, not geometry  
BALANCE_RISK: Geometry prison on the next spell. 2 AP + CD 3 + Strike exempt. Fail closed.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Confirm-fail does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-antelope`

NAME: Pack Antelope  
ROLE: SUPPORT — pack walks locked to permutation of (4,3)  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `antelope_precentor`; variant CHAMPION; `G ≥ 21`  
ENEMY_FAMILIES: `antelope_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 21`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only walk to dests that are a permutation of (4,3) from **that walker’s origin** (`effectParams: {"packWalkAntelope43":true,"packAuraRadius":2,"packAuraDuration":2}`). Does not grant extra AP. Distinct from Pack Giraffe `(4,1)`, Pack Camel `(3,2)`, Pack Hook `(3,1)`, Pack Ring (Chebyshev 2, knight excluded), Antelope Stride (self next walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_antelope_4_3"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; occupy the (4,3) cells  
SYNERGIES: Pack Giraffe is a different CHAMPION — **do not** put both on a BASE kit; CHAMPION may have Giraffe **or** Antelope, not both in CORE  
BALANCE_RISK: Forcing a pack onto (4,3) leaps is a scramble. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-antelope-fold`

NAME: Antelope Fold  
ROLE: POSITION — swap two player-side bodies that share a (4,3)  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `antelope_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `antelope_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **if and only if** they share a permutation of (4,3). If fewer than two, or they share only a (4,1) / (3,2) / (3,1) / rank / file / Chebyshev 3 orthogonal, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideShareAntelope43":true,"foldDamage":6}`). Distinct from Giraffe Fold `(4,1)`, Camel Fold `(3,2)`, Hook Fold `(3,1)`, Lane Fold (rank or file and Chebyshev 3), Leap Fold (Chebyshev 3 any geometry), Pawn Trade (two hostiles-to-caster). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_antelope_4_3"`. **Boss AI only.** Skip if 0–1 player-side bodies or they do not share (4,3).  
PLAYER_COUNTERPLAY: Fight without a summon; stand off (4,3); False Retreat decoy as the second body  
SYNERGIES: Antelope identity; Claim Ward does not block unit swap (same explicit as Giraffe Fold)  
BALANCE_RISK: Forced player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 21 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…20 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥21 | `spell-antelope-stride`, `spell-antelope-bite`. `spell-antelope-gate` as a G≥21 extra — do **not** CORE with Antelope Bite |
| `rank_lancer` | RARE / G≥21 | `spell-antelope-stride` |
| `shadow_lurker` | RARE / G≥21 | `spell-antelope-bite` |
| `glass_sniper` | RARE / G≥21 | `spell-duodeca-oath`, `spell-antelope-gate` |
| `glass_sniper` | ELITE | `spell-watch-halt` |
| `pale_cantor` | RARE / G≥21 | `spell-duodeca-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-octet-gift` (healer CORE only) |
| `glyph_sower` | RARE / G≥21 | `spell-fuse-reel`, `spell-split-mark` |
| `glyph_sower` | ELITE | `spell-fuse-cut` |
| `plague_rat` | RARE / G≥21 | `spell-fuse-reel`, `spell-wick-skip` |
| `plague_rat` | ELITE | `spell-fuse-cut` |
| `rime_mason` | RARE / G≥21 | `spell-brick-trim` |
| `bone_scribe` | RARE / G≥21 | `spell-split-mark`, `spell-trio-gait` |
| `purse_scribe` | RARE / G≥21 | `spell-trio-gait` |
| `tide_shade` | RARE / G≥21 | `spell-wick-skip` |
| `plate_warden` | ADVANCED / G≥21 | `spell-octet-plate` |
| `iron_golem` | ADVANCED / G≥21 | `spell-octet-plate` |
| `plate_warden` | ELITE | `spell-trio-plate` |
| `stone_castellan` | RARE / G≥21 | `spell-brick-trim` |
| `brood_chanter` | ELITE | `spell-summon-antelope`, `spell-trio-plate` |
| `cadence_thief` | RARE / G≥21 | `spell-cadence-sept` |
| `hex_chorister` | RARE / G≥21 | `spell-cadence-sept` |
| `tax_scribe` | RARE / G≥21 | `spell-reach-toll` |
| `ley_tollkeeper` | RARE / G≥21 | `spell-reach-toll` |
| `hood_lurker` | ELITE | `spell-watch-halt` |
| `antelope_precentor` CHAMPION | SIGNATURE | `spell-pack-antelope` (`ENEMY_ONLY`; not with Pack Giraffe / Pack Camel / Pack Hook / Pack Ring on the same BASE kit) |
| `antelope_fold_regent` | BOSS_ONLY | `spell-antelope-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-21 family CORE is unique #1198 + #1251

Wave-21 family CORE consumes remaining **#1198** unique Wave-19 verbs (minus Thin Gift / Fresh Plate on non-healer kits; minus Pack Camel / Camel Fold) and **#1251** tactical Wave-20 ids (minus Court Quinte; Octave Mend healer CORE only) in **CORE**. Unique §11 ids may appear there only as G≥21 extras in a later family pass (Wave 23), not as this document’s CORE and **not** as #1248 / #1305 CORE. Do **not** put unique §11 ids in #1248 CORE or #1305 CORE. Do **not** restamp **#1248** `ENEMY_ID`s (`septet_mender` … `idle_plater`). Do **not** restamp **#1305** `ENEMY_ID`s (`octave_mender` … `fresh_plater`). `antelope_precentor` is not `giraffe_precentor` / `camel_precentor` / `hook_precentor` / `camel_warder`. `antelope_fold_regent` is not `giraffe_fold_regent` / `camel_fold_regent` / `court_quinte_regent` / `court_sixte_regent`.

Stamp, do not clone #1198: Camel Stride, Deca Oath, Glyph Reel, Camel Bite, Hollow Mark, Wide Plate, Fuse Skip, Hollow Sting, Summon Camel, Cadence Quint, Prime Toll, Brick Levy, Watch Shave, Lean Gait, Glyph Cut. Thin Gift stays healer CORE only. Pack Camel stays `ENEMY_ONLY` on `camel_precentor`. Camel Fold stays `BOSS_ONLY` on `camel_fold_regent`.

Stamp, do not clone #1251: Octave Mend (healer CORE only), Cadence Quinte, Pentadeca Span (implementation-blocked while summon cap is 2), Kin Turn, Octave Hood, Octave Sting, Octave Step, Octave Sill, Octave Hold, Octave Lend, Octave Sip, Octave Post, Octave Bounce, Must Octave, Verse Octave. Court Quinte stays `NOT_PLAYER_LEARNABLE` on `court_quinte_regent`. Do **not** CORE Must Octave with Octave Hold. Do **not** CORE Cadence Quinte with Cadence Sept / Cadence Sext / Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap / Cadence Dock / Cadence Snuff / Cadence Tierce / Cadence Quarte / Cadence Sixte. Do **not** CORE Octave Mend with Octet Gift / Thin Gift / Wide Gift / Gait Gift / Prime Gift / Deep Gift / Septet Mend / Sestet Mend / Stave Mend / Score Mend / Nonet Mend. Do **not** CORE Kin Turn with Antelope Gate / Giraffe Gate / Feud Turn / Psalm Turn / Hymn Turn / Purse Turn / Tempo Invert / Bar Cross / Duel Turn / Triad Turn. Do **not** CORE Cadence Sept with Cadence Sext / Cadence Quinte / Cadence Sixte.

**SDE wins** unique leftover collisions: Octet Gift stays leftover **AP + MP === 8** (one body); Cadence Sept stays remaining `n>7` → `7`; Octet Plate stays leftover **AP + MP === 8** negate; Split Mark stays turn-end leftover **AP − MP === 3**; Trio Gait stays leftover **3/0** damage; Trio Plate stays leftover **3/0** negate. Do **not** mint `spell-octave-gift` / `spell-eight-gift` / `spell-nonet-gift` / `spell-trio-gift` / `spell-zebra-stride` / `spell-alfil-stride` / `spell-antelope-line` / `spell-ibis-stride` / `spell-cadence-seven` / `spell-cadence-six` / `spell-duodeca-span` / `spell-twelve-span` / `spell-sixteen-span` / `spell-dodeca-oath` / `spell-trio-turn`. **#1063** owns `spell-dodeca-span` — stamp, do not clone. **#1251** owns `spell-octave-mend` / `spell-cadence-quinte` / `spell-pentadeca-span` / `spell-kin-turn` — stamp, do not clone. **#1309** owns `spell-nonet-mend` / `spell-cadence-sixte` / `spell-hexadeca-span` / `spell-triad-turn` — stamp, do not clone.

### 12.2 Wave-20 unique extras (deferred)

#1255 unique Wave-20 verbs (`spell-giraffe-stride` … `spell-giraffe-fold`) stay G≥20 extras until Wave 22 families consume them **together with #1309**. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Giraffe stays `ENEMY_ONLY` on `giraffe_precentor`. Giraffe Fold stays `BOSS_ONLY` on `giraffe_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 22)

**#1309** opened as Wave-21 tactical. **Stamp it as Wave 22 family CORE** together with unique Wave-20 §11 (**#1255**). Do **not** put those ids in Wave-21 family CORE or unique §11. Unique §11 stay this catalog’s until Wave 23. Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` wait for Wave 23 sheets — do not restamp. Court Sixte never owned. Do not clone unique leftover collisions listed in §0.2. Do **not** CORE Nonet Mend with Octet Gift / Octave Mend. Do **not** CORE Cadence Sixte with Cadence Sept / Cadence Sext / Cadence Quinte. Do **not** CORE Hexadeca Span with Duodeca Oath / Pentadeca Span. Do **not** CORE Triad Turn with Kin Turn / Antelope Gate.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 22 forever

Same recipe as Wave 20 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 22 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor`. Do not mint the §0.1 forbidden aliases.

Suggested Wave-22 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-20 §11 verbs **plus #1309** (Wave 22 family CORE — do not fill those ids here); one next walk permutation of **(5,1)** (ibis / fiveleaper); leftover AP − leftover MP === **4**; leftover AP === **4 AND** leftover MP === **0**; leftover AP === **2 AND** leftover MP === **1**; remaining `n===7` → `0`; seventeen-cell occupy; target-only leftover **sum === 9** heal. Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Caster-plus-one-ally invert is **#1251 Kin Turn**. Caster+ally+hostile invert is **#1309 Triad Turn**. Sixteen-cell occupy is **#1309 Hexadeca Span**. Remaining `n===6`→`0` is **#1309 Cadence Sixte**. Both-body leftover **sum === 9** is **#1309 Nonet Mend**. Remaining `n>7`→`7` is this wave’s Cadence Sept. (4,3) next walk is this wave’s Antelope Stride. (4,1) next walk is #1255 Giraffe Stride. Pack Antelope stays `ENEMY_ONLY` on `antelope_precentor`. Antelope Fold stays `BOSS_ONLY` on `antelope_fold_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #787 / #802 / #837 / #849 / #890 / #906 / #953 / #962 / **#1011** / **#1017** / **#1063** / **#1082** / **#1132** / **#1143** / **#1177** / **#1198** / **#1244** / **#1248** / **#1249** / **#1251** / **#1255** / **#1285** / **#1291** / **#1302** / **#1303** / **#1305** / **#1309** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W21-A. G≥21 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W21-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W21-C. Wave-21 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #1198 / #1251 / #1255 ids |
| W21-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub |
| W21-E. No new feat/challenge/boss stamps | — | Doka formula; `unstoppable`; leftover `survivor` |
| W21-F. Painted fuse-tile occupancy | Fuse Tile (#185) tables | `map.portals`; new `HazardTileType`; editing Thorned Ground extra numbers |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

Watch Halt must not add an evasion roll to `dealDamage` and must not call `recordChallengeApSpend`. Fuse Cut must not edit RES/SR/CHC math. Duodeca Oath must not clone Dodeca Span. Wick Skip must not retune fuse damage. Brick Trim must not use walk `applyMpCost` map modifiers as the trim itself.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 20 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W21-1 | Encounter start | Possessed-but-unused G21 id does not observe |
| W21-2 | Antelope Stride dest (4,1), (4,0), (3,2), (3,1), knight, (4,4), or Chebyshev ≠ 4 | Confirm fails; MP not spent; Antelope Stride already observed |
| W21-3 | `antelope_gallery` defeat | Does not grant. Victory grants once |
| W21-4 | `giraffe_gallery` / `camel_gallery` / `hook_gallery` / `tern_gallery` / `ring_gallery` / `knight_gallery` | Do not grant Antelope Stride |
| W21-5 | Duodeca Oath then Frost at Chebyshev 10, 11, or 13 | Confirm fails; Strike still legal |
| W21-6 | Fuse Reel no painted fuse-tile | Fizzle observes; no pull. Dest is not `map.portals`, not live lava/ice/spikes, not painted tripwire, not painted glyph-tax |
| W21-7 | Antelope Bite on-rank, on-file, on-diagonal, (4,1), (3,2), (3,1), or (2,1) | 10 only. Giraffe Bite would want `(4,1)`. Camel Bite would want `(3,2)` |
| W21-8 | Split Mark Strike-from / walk-enter / leftover AP−MP===2 / leftover 0/0 / leftover MP equals max at turn end | No detonate. Skew Mark would detonate on leftover AP−MP===2. Occupant leftover 3/0 or 4/1 **does** detonate |
| W21-9 | Octet Plate hit while leftover AP+MP ≠ 8 | Full hit; charge remains. Hit while leftover 5/3 consumes. Deep Plate would want leftover 1/≥2. Pair Plate would want leftover 2/0 |
| W21-10 | Wick Skip across lava / spikes / ice leave-tax / glyph-tax / tripwire / Void Rift / conveyor / Thorned extra / pathLength 1 | Those taxes still tick. Skip is fuse occupancy + pathLength 2 only. PathLength 1 onto fuse still triggers. Fuse Skip would want fuse + pathLength 1. Trip Skip would want tripwire + pathLength 2 |
| W21-11 | Trio Gait leftover 2/0, 1/0, 0/0, 1/1, or AP≥2/MP≥1 | 10 only. Pair Gait would bonus leftover 2/0. Thin Gait would bonus leftover 1/0. Wide Sting would bonus AP≥2/MP≥1 |
| W21-12 | Summon Antelope vs Summon Giraffe vs Summon Camel vs Pack Antelope | Pets pay AP to **land (4,3) from origin** vs **(4,1)** vs **(3,2)** vs pack **(4,3) lock** |
| W21-13 | Octet Gift after leftover 7 or 9 or 2/0 or 1/1 | Fizzle observes; no heal. Octave Mend would want both-body leftover sum === 8 AND unequal. Wide Gift would want AP≥2/MP≥1 without an exact sum. Deep Gift would want 1/≥2. Leftover 4/4 **does** heal |
| W21-14 | Cadence Sept vs Sext vs Quint vs Quad vs Tern vs Cap vs Floor vs Rise vs Prime vs Stall vs Snuff vs Dock vs Tierce vs Quarte vs Quinte vs Sixte | Remaining `n>7` → 7 vs `n>6` → 6 vs `n>5` → 5 vs `n>4` → 4 vs `n>3` → 3 vs `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 vs `n===2` → 0 vs `n===3` → 0 vs `n===4` → 0 vs `n===5` → 0 vs `n===6` → 0 |
| W21-15 | Reach Toll then a Chebyshev ≤ 3 walk | Fizzle observes. Trip Toll would tax a walk if Chebyshev ≤ 1 from **tripwire**. Brick Tax would tax a walk if adjacent **barrier**. A Chebyshev 4 Giraffe/Antelope landing **does** pay |
| W21-16 | Brick Trim with no adjacent barrier | Fizzle observes; leftover AP unchanged. Watch Clip would snap −1 leftover AP with no adjacency. Brick Split would halve leftover MP |
| W21-17 | Watch Halt vs Clip vs Shave vs Bind vs Tax vs Drain vs Root vs Sip vs Far Watch | Snap leftover **MP → 0** (no steal) vs snap −1 leftover **AP** vs snap −1 leftover **MP** vs forbids next **walk** vs taxes next **spell** +1 AP vs steals leftover **MP to caster on cast** vs zeros leftover **MP on cast** vs steals AP vs deals damage |
| W21-18 | Trio Plate then leftover 2/0, 4/0, or 3/1 | Full hit; charge remains. Pair Plate would want leftover 2/0. Dry Plate would negate leftover MP=0 at **any** AP including 4/0. Trio Gait would bonus leftover 3/0 as **damage** |
| W21-19 | Fuse Cut far from fuse / on a Twin Gate pad / next to tripwire only / next to lava only | 10 only. Trip Cut would want tripwire occupancy. Glyph Cut would want glyph-tax occupancy. Fuse Reel would pull |
| W21-20 | Antelope Gate then Frost at Chebyshev 12, (4,1), or adjacent | Confirm fails; Strike still legal. Duodeca Oath would want Chebyshev 12. Giraffe Gate would want (4,1). Antelope Bite would deal bonus on (4,3) without gating other dests |
| W21-21 | Pack Antelope / Antelope Fold | Never in `ownedSpellIds` |
| W21-22 | Loaner / `WF-SPL-*` / prior ENC-* / **#1235** WF-* / **#1285** `WF-*-QUOTA_*` / **#1303** ENC-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W21-23 | G=20 Tide | No Antelope Stride / Reach Toll (`generationMin: 21`) |
| W21-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W21-25 | No cloned ids | Unique §11 ids absent from #1198 / #1251 / #1255 catalogs |
| W21-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Reach Toll / Summon Antelope / Pack Antelope / Watch Halt / Brick Trim are flags |
| W21-27 | Hex Toll | Still not in any SDE pool |
| W21-28 | Memory Wave-5 / Wave-20 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W21-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog |
| W21-30 | #1255 rooms / doors | `giraffe_gallery` / `giraffe_precentor` / `giraffe_fold_regent` not restamped. Unique §11 does not clone Giraffe Stride / Cadence Sext / Pack Giraffe / Giraffe Fold |
| W21-31 | #1251 tactical ids | Unique §11 does not clone Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` not restamped |
| W21-32 | #1198 rooms / doors | `camel_gallery` / `fuse_nave` / `camel_precentor` / `camel_fold_regent` not restamped. `fuse_nave` still teaches Fuse Skip, not Wick Skip |
| W21-33 | #1248 / #1244 / #1305 / #1302 | Family ids and extra doors not restamped. `octave_mender` … `fresh_plater` stay #1305. `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate` stay #1302 |
| W21-36 | #1309 tactical ids | Unique §11 does not clone Nonet Mend / Cadence Sixte / Hexadeca Span / Triad Turn. Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` not restamped |
| W21-34 | `spell-octave-gift` / `spell-nonet-gift` / `spell-zebra-stride` / `spell-alfil-stride` / `spell-ibis-stride` / `spell-dodeca-oath` / `spell-antelope-line` / `spell-sixteen-span` / `spell-cadence-six` / `spell-trio-turn` | Still tombstoned |
| W21-35 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–20, memory Wave 5, or sibling tactical catalogs
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Consuming prior ENC-* / WF-* as spell grants
- Overwriting **#1226** / **#1291** SDA / **#1248** / **#1305** family / **#1255** SDE / **#1309** tactical dated files
- Restacking `WORLD_DYNAMICS.md` / `worldFeatures.ts` / `MASTER_ROADMAP.md` / `BOSS_AND_SPELL_DISCOVERY.md`

---

## 17. Wave-21 index

**Unique SDE ids (19):** antelope-stride, duodeca-oath, fuse-reel, antelope-bite, split-mark, octet-plate, wick-skip, trio-gait, summon-antelope, octet-gift, cadence-sept, reach-toll, brick-trim, watch-halt, trio-plate, fuse-cut, antelope-gate, pack-antelope, antelope-fold.

**#1198 stamps (do not clone; Wave-21 family CORE):** Camel Stride, Deca Oath, Glyph Reel, Camel Bite, Hollow Mark, Wide Plate, Fuse Skip, Hollow Sting, Summon Camel, Thin Gift, Cadence Quint, Prime Toll, Brick Levy, Watch Shave, Lean Gait, Glyph Cut, Fresh Plate, Pack Camel, Camel Fold.

**#1251 stamps (do not clone; Wave-21 family CORE):** Octave Mend, Cadence Quinte, Pentadeca Span, Kin Turn, Octave Hood, Octave Sting, Octave Step, Octave Sill, Octave Hold, Octave Lend, Octave Sip, Octave Post, Octave Bounce, Must Octave, Verse Octave, Court Quinte. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave 22 sheets).

**#1309 stamps (do not clone; Wave-22 family CORE):** Nonet Mend, Cadence Sixte, Hexadeca Span, Triad Turn, Nonet Hood, Nonet Sting, Nonet Step, Nonet Sill, Nonet Hold, Nonet Lend, Nonet Sip, Nonet Post, Nonet Bounce, Must Nonet, Verse Nonet, Court Sixte. Extra doors `nonet_cantor` / `sixte_precentor` / `span_hexadeca` / `court_sixte_regent` (Wave 23 sheets).

**#1255 stamps (do not clone; extras until Wave 22, then CORE with #1309):** Giraffe Stride, Undeca Oath, Trip Reel, Giraffe Bite, Skew Mark, Deep Plate, Trip Skip, Pair Gait, Summon Giraffe, Deep Gift, Cadence Sext, Trip Toll, Brick Split, Watch Clip, Pair Plate, Trip Cut, Giraffe Gate, Pack Giraffe, Giraffe Fold.

**#1305 stamps (do not restamp):** `octave_mender` … `fresh_plater`.

**#1248 stamps (do not restamp):** `septet_mender` … `idle_plater`.

**#1244 stamps (do not restamp):** `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`.

**#1302 stamps (do not restamp):** `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-antelope-stride` | ENEMY_DISCOVERY | yes | blink_cutter / rank_lancer G≥21 | One next walk (4,3) |
| `spell-duodeca-oath` | ENEMY_DISCOVERY | yes | glass_sniper / pale_cantor | Next spell Chebyshev = 12 |
| `spell-fuse-reel` | ENEMY_DISCOVERY | yes | plague_rat / glyph_sower | Pull 1 toward fuse-tile |
| `spell-antelope-bite` | ENEMY_DISCOVERY | yes | blink_cutter / shadow_lurker | Bonus if share (4,3) |
| `spell-split-mark` | ENEMY_DISCOVERY | yes | glyph_sower / bone_scribe | Turn-end detonate at leftover AP−MP===3 |
| `spell-octet-plate` | ENEMY_DISCOVERY | yes | plate_warden / iron_golem | Negate if leftover AP+MP===8 |
| `spell-wick-skip` | ENEMY_DISCOVERY | yes | tide_shade / plague_rat | PathLength 2 onto fuse no trigger |
| `spell-trio-gait` | ENEMY_DISCOVERY | yes | bone_scribe / purse_scribe | Bonus if leftover 3/0 |
| `spell-summon-antelope` | ELITE | yes | brood_chanter | Pets pay AP to land (4,3) |
| `spell-octet-gift` | ELITE | yes | pale_cantor / font_cantor | Heal iff leftover AP+MP===8 |
| `spell-cadence-sept` | ENEMY_DISCOVERY | yes | cadence_thief / hex_chorister | Remaining n>7 → 7 |
| `spell-reach-toll` | ENEMY_DISCOVERY | yes | tax_scribe / ley_tollkeeper | Next walk +1 AP if Chebyshev ≥ 4 |
| `spell-brick-trim` | ENEMY_DISCOVERY | yes | stone_castellan / rime_mason | −1 leftover AP if adjacent barrier |
| `spell-watch-halt` | ELITE | yes | glass_sniper / hood_lurker | Overwatch snap leftover MP → 0 |
| `spell-trio-plate` | ELITE | yes | brood_chanter / plate_warden | Negate if leftover 3/0 |
| `spell-fuse-cut` | ELITE | yes | glyph_sower / plague_rat | Bonus if near fuse-tile |
| `spell-antelope-gate` | ENEMY_DISCOVERY | yes | glass_sniper / blink_cutter | Next spell only if target is (4,3) |
| `spell-pack-antelope` | ENEMY_ONLY | no | antelope_precentor CHAMPION | Pack walks locked to (4,3) |
| `spell-antelope-fold` | BOSS_ONLY | no | antelope_fold_regent | Fold two player-side bodies sharing (4,3) |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-20 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #1251 so Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn land once as Wave-21 family CORE. Coordinate with #1198 so Camel Stride / Cadence Quint land once as Wave-21 family CORE. Coordinate with #1305 so `octave_mender` … `fresh_plater` land once. Coordinate with #1309 so Nonet Mend / Cadence Sixte / Hexadeca Span / Triad Turn land once as Wave-22 family CORE. Coordinate with #1255 so Giraffe Stride stays extras until Wave 22. Not a license to land combat code in the same change as this spec.
