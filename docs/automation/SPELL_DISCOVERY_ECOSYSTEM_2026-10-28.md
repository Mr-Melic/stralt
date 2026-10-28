# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 20

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-28  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Waves 2–19 are generation stamps (`generationMin`). This document does **not** replace any of them. It is Generation 20: one next walk permutation of **(4,1)** (giraffe), exact-11 spell gate, tripwire pull, leftover **AP − MP === 2** paint, leftover **AP === 1 AND MP ≥ 2** windows that Thin/Prime/Wide left open, leftover **exactly 2/0** damage and negate, remaining CDs `n>6` → `6`, and `generationMin: 20` family attachments.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-28.md`](./ACTION_IDS_SDE_2026-10-28.md).

**Do not implement production code from this PR.**

---

## 0. Sibling designs (do not duplicate)

| Sibling | Path / PR | Owns |
| :--- | :--- | :--- |
| Wave-1 discovery contract | #156 — `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | State machine, innate four, persist writers, UX copy, Wave-1 cards |
| Wave-2…19 discovery contracts | #226 / #300 / #371 / memory Wave 5 / #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / #962 / #1017 / **#1082** / **#1143** / **#1198** | `generationMin` 2…19, unique catalogs, specials |
| Wave-1…19 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `ACTION_IDS_SDE_2026-10-27.md` | Ownership split, observe hook, victory commit, G slots — **still blocking, still NEW** |
| Spell admin | #116 / #187 / **#1078** (SDA-175…189) / **#1140** (SDA-190…204) / **#1187** (SDA-205…219) / **#1226** (SDA-220…234) | `ownedSpellIds` / `observedSpellIds`, soft-retire. Do not overwrite those unique files |
| Tactical gap-fillers | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** | Stamp, do not clone. **#1177** is Wave **20** family CORE. **#1251** (Octave Mend … Court Quinte) is Wave **21** family CORE |
| Family sheets | through **#1138** (`stave_mender` … `cast_plater`) / **#1189** (`sestet_mender` … `strike_plater`) / **#1248** (`septet_mender` … `idle_plater`) | Wave-18 CORE / Wave-19 CORE / Wave-20 CORE. Do not put unique §11 there. Wave-20 families consume unique **#1143** + **#1177** |
| Boss extras | through **#1139** / **#1170** (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`) / **#1244** (`sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`) | Rush Table Q / Table R / Table S. Do not restamp. Do not remap `gait_cantor` / `halve_precentor` / `trim_precentor` |
| Encounter rooms | **#1121** Tally/Rank/Spike/Odd / **#1195** Score/File/Lava/Ready / **#1249** Stave/Ring/Rime/Match | Teach **#997** / **#1073** / **#1138**+**#1017** verbs, not unique §11 giraffe |
| World dynamics | **#1114** Wave-18 `WF-*` / **#1172** Wave-19 `WF-*-MATCH_*` / **#1235** Wave-20 `WF-*-POISE_*` | Unique `ACTION_IDS_WDD_2026-10-28.md`. Do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`. `WF-SPL-READY_TUTOR` / `WF-SPL-MATCH_TUTOR` / `WF-SPL-POISE_TUTOR` never write `ownedSpellIds` |
| PX coherence | **#1175** / **#1246** | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |
| Formations | **#1176** drop 19 / **#1237** drop 20 | Wave-18 / Wave-19 packs. Clearing a formation is not a grant |
| Enemy/boss admin | **#1163** / **#1218** EBA 2026-10-28 | Unique files. Zero extra doors. No new EBA IDs |
| World/dungeon admin | **#1183** / **#1236** WDEAD 2026-10-28 | Unique files. Occupancy/remount rails, not grants |
| Master roadmap | **#1186** / **#1254** MTD 2026-10-28 | Not a tactical catalog. Unique `ACTION_IDS_2026-10-28.md` + restack of `MASTER_ROADMAP.md` — do **not** restack that file |
| AI increment | **#1192** / **#1240** AEE 2026-10-28 | Inspector lists modules by id. Missing hint → drop |
| Content diversity | **#1167** / **#1222** 2026-10-28 | Not CDA-031. CDA-031 had **not** opened. CDA-031 is **#1069** (2026-10-25), not today’s content diversity |
| Long horizon | **#1197** / **#1250** 2026-10-28 | Sim only. Not a spell catalog |

**Id collision rule:** do not reuse any id in §0.1. Wave-20 ids in §11 are new.

### 0.1 Reserved tombstone (never re-propose)

Prior unique SDE catalogs (Waves 1–19, memory Wave 5) and tactical catalogs (#120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #849, #890, #953, #1011, #1063, #1132, **#1177**) remain reserved in those contracts. This wave adds:

**#1198 Wave 19 SDE (never re-propose):** `spell-camel-stride`, `spell-deca-oath`, `spell-glyph-reel`, `spell-camel-bite`, `spell-hollow-mark`, `spell-wide-plate`, `spell-fuse-skip`, `spell-hollow-sting`, `spell-summon-camel`, `spell-thin-gift`, `spell-cadence-quint`, `spell-prime-toll`, `spell-brick-levy`, `spell-watch-shave`, `spell-lean-gait`, `spell-glyph-cut`, `spell-fresh-plate`, `spell-pack-camel`, `spell-camel-fold`.

**#1143 Wave 18 SDE (stamp as Wave 20 family CORE, do not clone):** `spell-hook-stride`, `spell-nona-oath`, `spell-slide-reel`, `spell-hook-bite`, `spell-idle-mark`, `spell-thin-plate`, `spell-brier-skip`, `spell-wide-sting`, `spell-summon-hook`, `spell-wide-gift`, `spell-cadence-quad`, `spell-even-toll`, `spell-brick-fee`, `spell-watch-bind`, `spell-prime-gait`, `spell-slide-cut`, `spell-idle-plate`, `spell-pack-hook`, `spell-hook-fold`.

**#1177 tactical Wave 19 — stamp as Wave 20 family CORE, do not clone:** `spell-septet-mend`, `spell-cadence-quarte`, `spell-tetradeca-span`, `spell-feud-turn`, `spell-septet-hood`, `spell-septet-sting`, `spell-septet-step`, `spell-septet-sill`, `spell-septet-hold`, `spell-septet-lend`, `spell-septet-sip`, `spell-septet-post`, `spell-septet-bounce`, `spell-must-septet`, `spell-verse-septet`, `spell-court-quarte`. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` — do not restamp.

**#1251 tactical Wave 20 — stamp as Wave 21 family CORE, do not clone:** `spell-octave-mend`, `spell-cadence-quinte`, `spell-pentadeca-span`, `spell-kin-turn`, `spell-octave-hood`, `spell-octave-sting`, `spell-octave-step`, `spell-octave-sill`, `spell-octave-hold`, `spell-octave-lend`, `spell-octave-sip`, `spell-octave-post`, `spell-octave-bounce`, `spell-must-octave`, `spell-verse-octave`, `spell-court-quinte`. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for **Wave 22** sheets — do not restamp. Court Quinte never owned.

**Memory Wave 5 (still no GitHub PR — still tombstoned):** `spell-gaze-sill`, `spell-close-debt`, `spell-near-veil`, `spell-soft-step`, `spell-twice-mark`, `spell-rebound-ward`, `spell-cull-kennel`, `spell-whelp-sill`, `spell-ash-sill`, `spell-spent-lens`, `spell-wait-fang`, `spell-share-gaze`, `spell-body-glass`, `spell-last-stride`, `spell-post-hex`, `spell-turn-sill`, `spell-pack-cover`, `spell-false-gaze`, `spell-void-span`.

**Do not alias** Giraffe Stride ↔ Camel Stride ↔ Hook Stride ↔ Tern Stride ↔ Knight Stride ↔ Ring Stride; Undeca Oath ↔ Deca Oath ↔ `span_hendeca` ↔ Tetradeca Span ↔ Pentadeca Span; Trip Reel ↔ Glyph Reel ↔ Slide Reel; Skew Mark ↔ Hollow Mark ↔ Idle Mark ↔ Last Mark ↔ Octave Post; Deep Plate ↔ Thin Plate ↔ Prime Plate ↔ Wide Plate ↔ Octave Hood; Trip Skip ↔ Fuse Skip ↔ Brier Skip; Deep Gift ↔ Thin Gift ↔ Prime Gift ↔ Wide Gift ↔ Septet Mend ↔ Octave Mend; Pair Gait ↔ Thin Gait ↔ Hollow Sting ↔ Wide Sting; Cadence Sext ↔ Cadence Quint ↔ Cadence Quarte ↔ Cadence Quinte; Pack Giraffe ↔ Pack Camel; Giraffe Fold ↔ Camel Fold; Pair Plate ↔ Dry Plate ↔ Thin Plate; Giraffe Gate ↔ Giraffe Bite ↔ Undeca Oath ↔ Kin Turn; Feud Turn ↔ Psalm Turn ↔ Kin Turn. Those are sibling-owned fantasies.

**Do not mint:** `spell-giraffe-line`, `spell-alfil-stride`, `spell-fifteen-span`, `spell-pentakaideca-span`, `spell-undeca-span`, `spell-hendeca-oath`, `spell-deca-span`, `spell-nona-span`, `spell-thirteen-span`, `spell-fourteen-span`, `spell-sestet-gift`, `spell-septet-gift`, `spell-hept-gift`, `spell-seven-gift`, `spell-skew-gift`, `spell-octave-gift`, `spell-eight-gift`, `spell-quint-mend`, `spell-cadence-six`, `spell-cadence-hexa`, `spell-cadence-sice`, `spell-cadence-cinque`, `spell-cadence-fifth`, `spell-thin-sting`, `spell-wide-gait`, `spell-even-plate`, `spell-hook-line`, `spell-camel-line`, `spell-parched-mend`, `spell-score-gift`, `spell-stave-gift`, `spell-mixed-turn`, `spell-duet-turn`, `spell-deep-sting`, `spell-pair-toll`. Stamp **#1177** `spell-septet-mend` / `spell-cadence-quarte` / `spell-tetradeca-span` / `spell-feud-turn`; stamp **#1251** `spell-octave-mend` / `spell-cadence-quinte` / `spell-pentadeca-span` / `spell-kin-turn`; do not clone. **SDE already owns** `spell-skew-mark` (turn-end leftover **AP − MP === 2** detonate); #1251 correctly held that hole and must not mint a `spell-skew-*` family.

### 0.2 Same-day / queued hole ownership (stamp, do not clone)

**#1177 owns** the G≥19 leftover-sum===7 / CD `4→0` / fourteen-occupy / caster-plus-one-hostile invert holes. This catalog’s unique §11 ids stay this document’s. Wave-20 family CORE is unique **#1143** Wave-18 verbs **plus** **#1177** (except Court Quarte; Septet Mend is healer CORE only). Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` — do not restamp.

**SDE wins** unique leftover collisions:

| Unique §11 | Window | Not a clone of |
| :--- | :--- | :--- |
| Deep Gift | leftover **AP === 1 AND MP ≥ 2** heal | Thin Gift (1/0); Prime Gift (1/1); Wide Gift (AP≥2/MP≥1); Gait Gift (AP≥2/MP=0); Lean Gift (AP=0/MP≥1); **#1177** Septet Mend (both-body leftover **sum === 7**) |
| Cadence Sext | remaining `n>6` → **6** | Cadence Quint (`n>5`→5); Cadence Quad (`n>4`→4); Cadence Quarte (`n===4`→0); Cadence Tierce (`3→0`) |
| Deep Plate | leftover **AP === 1 AND MP ≥ 2** negate | Thin Plate (1/0); Prime Plate (1/1); Wide Plate (AP≥2/MP≥1); Septet Hood (sum===7 miss) |
| Skew Mark | turn-end leftover **AP − MP === 2** detonate | Hollow Mark (0/0); Idle Mark (MP equals max); Last Mark (last leftover AP); Dwell Mark (any occupy); Score Post / Sestet Post / Septet Post (tactical occupy leftover-sum) |
| Pair Gait | leftover **AP === 2 AND MP === 0** damage | Thin Gait (1/0); Hollow Sting (0/0); Wide Sting (AP≥2/MP≥1); Prime Gait (1/1); Lean Gait (0/≥1) |
| Pair Plate | leftover **AP === 2 AND MP === 0** negate | Thin Plate (1/0); Dry Plate (leftover MP=0, **any** AP); Wide Plate (needs MP≥1); Dual Plate (both even ≥ 2) |

`septet_cantor` is **not** Deep Gift’s door. `quarte_precentor` is **not** Cadence Sext’s door. `span_tetradeca` is **not** Undeca Oath’s door. `court_quarte_regent` is **not** `giraffe_fold_regent`. `camel_gallery` is **not** Giraffe Stride’s room. `span_hendeca` is **not** Undeca Oath. `octave_cantor` is **not** Deep Gift’s door. `quinte_precentor` is **not** Cadence Sext’s door. `span_pentadeca` is **not** Undeca Oath’s door. `court_quinte_regent` is **not** `giraffe_fold_regent`. Do not name unique §11 families `septet_mender` / `cadence_quarterer` / `tetradeca_prelate` / `feud_turner` / `sestet_mender` / `camel_precentor` / `octave_mender` / `cadence_quinter` / `pentadeca_prelate` / `kin_turner` (#1248 / #1189 / #1138 / #1198 / #1251 own those slots).

Target-only leftover **sum === 7** as a family is already Wide Gift `(6,1)(5,2)(4,3)(3,4)(2,5)` / Gait Gift `(7,0)` / Lean Gift `(0,7)`. The only open one-body pair is leftover **1/6**, which Deep Gift covers as leftover AP===1 AND leftover MP≥2. **Do not mint** `spell-septet-gift` / `spell-hept-gift`. Leftover **AP − MP === 2** as a **heal** is Wide Gift for every MP≥1 pair and Gait Gift for `(2,0)` — **do not mint** `spell-skew-gift`. Skew Mark is the detonate, not a heal.

Same-day 2026-10-28 catalogs **opened** after first authoring. Stamp them; do not clone unique §11:

- **#1177** remains Wave-19 tactical. **Stamp it as Wave 20 family CORE** together with unique **#1143** Wave-18 verbs. Septet Mend is both-body leftover **sum === 7**. Cadence Quarte is remaining `n===4` → `0`. Tetradeca Span is fourteen occupy (axis-aligned **2×7**). Feud Turn is leftover invert on **caster + one hostile**. Court Quarte never owned.
- **#1251** Wave-20 tactical (opened 00:21 UTC). **Stamp it as Wave 21 family CORE** together with unique Wave-19 §11 (**#1198**). Octave Mend is both-body leftover **sum === 8 AND unequal**. Cadence Quinte is remaining `n===5` → `0`. Pentadeca Span is fifteen occupy (stretched plus **longArm 4 / shortArm 3**). Kin Turn is leftover invert on **caster + one same-side ally** (caster participates). Court Quinte never owned. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for **Wave 22** sheets — do not restamp. **SDE wins** unique leftover collisions in the table above: Deep Gift stays leftover **1/≥2**, not Octave Mend; Cadence Sext stays `n>6→6`, not Cadence Quinte `5→0`; Deep Plate stays leftover AP===1/MP≥2 negate, not Octave Hood; Skew Mark stays turn-end leftover **AP − MP === 2** (that hole is **not** still open — #1251 correctly held a `spell-skew-*` family); Pair Gait / Pair Plate stay leftover **2/0**; Undeca Oath stays exact-11 **spell gate**, not Pentadeca Span occupy-weight 15; Giraffe Gate stays next-spell dest permutation of **(4,1)**, not Kin Turn. Do **not** mint `spell-octave-gift` / `spell-eight-gift` (target-only sum===8 stays a Wave-21 unique hole). Do **not** mint `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-cadence-cinque` / `spell-cadence-fifth` / `spell-duet-turn`.
- **#1248** Wave-20 families (`septet_mender`, `cadence_quarterer`, `tetradeca_prelate`, `feud_turner`, `septet_hooder`, `septet_stinger`, `septet_stepper`, `septet_siller`, `septet_holder`, `septet_lender`, `septet_sipper`, `septet_prelate`, `septet_bouncer`, `must_septeter`, `verse_septeter`, `hook_warder`, `nona_oather`, `slide_reeler`, `hook_biter`, `idle_marker`, `thin_plater`, `brier_skipper`, `wide_stinger`, `hook_taxer`, `wide_gifter`, `cadence_quadder`, `even_toller`, `brick_feer`, `watch_binder`, `prime_gaiter`, `slide_cutter`, `idle_plater`) consume unique **#1143** (minus Pack Hook / Hook Fold; Wide Gift healer CORE only) **plus** **#1177** (minus Court Quarte; Septet Mend healer CORE only). Do not restamp those `ENEMY_ID`s. Unique §11 stay extras until Wave 22. Unique Wave-19 §11 stay extras until Wave 21.
- **#1189** Wave-19 families (`sestet_mender` … `strike_plater`) consume **#1082** unique CORE (minus Pack Ring / Lane Fold) **plus** **#1132** (minus Court Tierce). Do not restamp those `ENEMY_ID`s.
- **#1170** Wave-20 extra doors `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`. `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`. Do **not** remap `trim_precentor`. Rush **Table R**.
- **#1244** Wave-21 extra doors `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`. Leftover Gait Sip / Cadence Halve / Odd Hood / Cast Sill. Spectacular `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`. Do **not** remap `gait_cantor` / `halve_precentor` / `trim_precentor`. Rush **Table S**.
- **#1249** ENC-TEACH-20 / ENC-SPELL-39 / ENC-SPELL-40 / ENC-RUSH-75…78 (Stave/Ring/Rime/Match). Teach **#1138** / **#1017** verbs (Stave Mend, Ring Stride), **not** unique §11 giraffe.
- **#1235** Wave-20 `WF-HAZ-POISE_SEAM` … `WF-ENV-POISE_DRAFT`. Unique `ACTION_IDS_WDD_2026-10-28.md`. Do **not** restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`. `WF-SPL-POISE_TUTOR` never writes `ownedSpellIds`. Remaining-MP-equals-max is **not** Skew Mark (leftover AP − MP === 2 detonate) and **not** Idle Mark (leftover MP equals max **detonate**).
- **#1226** SDA-220…234 unique files. Do not overwrite **#1187** SDA-205…219.
- **#1236** WDEAD unique files. **#1218** EBA unique files (zero extra doors). **#1237** FSN drop 20 (Wave-19 packs). **#1240** AEE. **#1246** PX. **#1250** long-horizon. **#1222** content diversity — not CDA-031 (**#1069**). **#1254** MTD unique `ACTION_IDS_2026-10-28.md` — do **not** restack `MASTER_ROADMAP.md`.
- **#1195** ENC-TEACH-19 … ENC-RUSH-74 (Score/File/Lava/Ready). Teach **#1073** verbs, not unique §11.
- **#1172** Wave-19 `WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT`. `WF-SPL-MATCH_TUTOR` never writes `ownedSpellIds`.
- **#1198** Wave-19 SDE rooms `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent` — do not restamp.
- CDA-031 had **not** opened at this stamp.

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-nine calendar days after Wave 12, and one day after Wave 19, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Deep Gift / Wide Gift / Septet Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-20 unique ids stay `mpCost: 0`. Trip Toll / Summon Giraffe / Pack Giraffe / Watch Clip / Brick Split are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Trip Reel is attract-toward-**nearest painted tripwire occupancy**, a new dest flavor after Glyph Reel (glyph-tax) and Slide Reel (conveyor) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-20 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Trip Cut keys off **painted tripwire** (`spell-tripwire`, #120), never a new `HazardTileType`. Thorned Ground (`mapModifiers.ts` 175–186) is a **map-modifier pathLength tax**, not occupancy. Trip Skip keys off **painted tripwire** occupancy and pathLength **2** |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21…27 docs. **#371 owns Wave-4 SDE. #906 owns Wave-14 SDE. #962 owns Wave-15 SDE. #1017 owns Wave-16 SDE. #1082 owns Wave-17 SDE. #1143 owns Wave-18 SDE. #1198 owns Wave-19 SDE. #953 owns Wave-15 tactical. #1011 owns Wave-16 tactical. #1063 owns Wave-17 tactical (Wave 18 family CORE). #1132 owns Wave-18 tactical (Wave 19 family CORE). #1177 owns Wave-19 tactical (Wave 20 family CORE). #941 owns Wave-15 families. #997 owns Wave-16 families. #1073 owns Wave-17 families. #1138 owns Wave-18 families. #1189 owns Wave-19 families. #951 owns Wave-16 extra boss doors. #1004 owns Wave-17 extra boss doors. #1080 owns Wave-18 extra boss doors. #1139 owns Wave-19 extra boss doors. #1170 owns Wave-20 extra boss doors / Table R. #1078 owns SDA-175…189. #1140 owns SDA-190…204. #1187 owns SDA-205…219. #982 owns CDA-030. #1056 owns prior ENC-*. #1121 owns Tally/Rank/Spike/Odd ENC-*. #1195 owns Score/File/Lava/Ready ENC-*. #1064 owns Wave-17 WF-*. #1114 owns Wave-18 WF-*. #1172 owns Wave-19 WF-*. #1111 / #1163 own EBA (zero extra doors). #1128 / #1183 own WDEAD. #1176 owns FSN drop 19. #1192 owns AEE. #1186 owns MTD. #1175 owns PX.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-19 P0 remain the prerequisite. **Do not land Wave-20 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 20 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥20 rares make it sharper: a CHAMPION may hold the generation-20 verb until a (4,1) landing / painted tripwire cell / leftover-1/≥2 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 20 fills holes Waves 1–19, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, **#1177**, and **#1198** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Camel Stride, Hook Stride, Tern Stride, Knight Stride, Ring Stride, Pack Camel, Pack Hook, Hook Line, Camel Bite, Glyph Reel, Fuse Skip, Cadence Quint, Cadence Quarte, Thin Gift, Wide Gift, Thin Plate, Wide Plate, Hollow Mark, Idle Mark, Fresh Plate, Septet Mend, Tetradeca Span, Feud Turn, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 20 stamps `generationMin: 20`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Trip Toll **adds 1 AP** to the next **walk** while Chebyshev ≤ 1 from painted tripwire. Brick Split **halves leftover MP** on the target if adjacent to a barrier. Summon Giraffe taxes **allied summons** 1 AP when the walk landing is a (4,1) from origin. Pack Giraffe locks **walk dests to (4,1)**. Watch Clip **subtracts 1 leftover AP** from the walker on overwatch snap (does not grant to the caster). None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Discovery state machine (unchanged; Wave-20 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-20 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-giraffe-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Giraffe Stride later walk confirm-fail (orthogonal / (3,2) / (3,1) / knight dest) | Already observed on the arm |
| `spell-skew-mark` **paint** | **Yes** — paint is the use |
| Skew Mark later turn-end detonate | **No second observe** |
| `spell-deep-plate` / `spell-pair-plate` **armed** | **Yes** |
| Later negated hit | **No second observe** |
| `spell-trip-reel` AP spent, no painted tripwire in radius | **Yes** — fizzle after AP |
| `spell-deep-gift` AP spent, leftover not AP===1/MP≥2 | **Yes** — fizzle after AP |
| `spell-trip-toll` AP spent, target not Chebyshev ≤ 1 from tripwire | **Yes** — fizzle after AP |
| `spell-trip-skip` **armed** | **Yes** |
| Trip Skip later ignored tripwire trigger | **No second observe** |
| Illegal confirm (no AP) | **No** |
| `spell-pack-giraffe` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-giraffe-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-20 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥20 family verbs in §11 **plus** #1143 / #1177 stamps in §0.2 / §12 |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Giraffe Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Quarte stays `NOT_PLAYER_LEARNABLE` on `court_quarte_regent` |
| `ELITE` | Summon Giraffe, Deep Gift, Watch Clip, Trip Cut, Pair Plate. **#1177** Septet Hood / Septet Hold / Must Septet stamp as Wave 20 CORE, not unique §11 |
| `SPECIAL_ENCOUNTER` | `giraffe_gallery` / `undeca_nave` / `trip_aisle` / `skew_pulpit` / `trip_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #1177 Septet Mend / Cadence Quarte / Tetradeca Span as Wave 20 CORE. Stamp #1143 unique Wave-18 verbs as Wave 20 CORE. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 19 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#1170**: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` (`CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`; do **not** remap `trim_precentor`). **#1244**: `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` (`CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` stay `BOSS_ONLY`; leftover Gait Sip / Cadence Halve / Odd Hood / Cast Sill; do **not** remap `gait_cantor` / `halve_precentor` / `trim_precentor`). **#1139**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`. **#1080**: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. #890 `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #953 `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011**: `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063**: `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1132**: `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. **#1177**: `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. **#1251**: `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave **22** sheets; not Table S). **#1017**: `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082**: `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. **#1143**: `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`. **#1198**: `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent`. **#1073** family ids `score_mender` … `summon_plater`. **#1138** family ids `stave_mender` … `cast_plater`. **#1189** family ids `sestet_mender` … `strike_plater`. **#1248** family ids `septet_mender` … `idle_plater`.

---

## 5. Learnable vs closed

| Flag | Wave-20 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Giraffe and Giraffe Fold |
| `ENEMY_ONLY` | `spell-pack-giraffe` on `giraffe_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-giraffe-fold` on `giraffe_fold_regent` |
| `SYSTEM_ONLY` | None this wave |

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

---

## 6. Spell pool evolution (unbounded G)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 20 adds the **G≥20 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1…19 | As Waves 2–19 |
| 20 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 20` |
| 21+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-19 G19 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **20** for families listed in §12. It remains a data query, not a constant in combat math.

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 7. AI compatibility (Wave-20 hints)

Wave 1 §9.1 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_giraffe_4_1` | flanker, kiter | Next walk dest is a permutation of (4,1); skip if Camel/Hook/Tern dest is the only legal close |
| `next_spell_exact_chebyshev_11` | caster, kiter | Next damaging spell only if Chebyshev to target === 11; skip if 10 (Deca Oath) or 9 (Nona Oath) |
| `attract_toward_nearest_tripwire` | caster, controller | A painted tripwire cell exists in search radius; dest after attract is floor, not `map.portals` |
| `bonus_if_share_giraffe_4_1_with_caster` | flanker | Target is a (4,1) from caster; skip if (3,2) (Camel Bite) or (3,1) (Hook Bite) or (2,1) (Knight Pierce) |
| `detonate_if_turn_end_leftover_ap_minus_mp_eq_2` | caster, controller | Paint a cell the occupant will end on at leftover AP − MP === 2; skip if leftover is 0/0 (Hollow Mark) |
| `negate_hit_if_leftover_ap_eq_1_and_mp_ge_2` | guardian, kiter | Caster leftover AP===1 and MP≥2 at arm; skip if leftover is 1/0 (Thin Plate) or 1/1 (Prime Plate) |
| `skip_tripwire_trigger_on_path_length_2` | kiter, flanker | A painted tripwire sits on a 2-step approach; skip if the needed walk is pathLength 1 (that still triggers) |
| `bonus_if_leftover_ap_eq_2_and_mp_eq_0` | caster, berserker | Caster leftover 2/0; skip if leftover 1/0 (Thin Gait) or 0/0 (Hollow Sting) or AP≥2/MP≥1 (Wide Sting) |
| `summon_walk_giraffe_4_1_ap_tax` | summoner, guardian | ≥1 living allied summon; skip if none will land (4,1) from origin |
| `heal_if_leftover_ap_eq_1_and_mp_ge_2` | healer, buffer | Target leftover AP===1 and MP≥2; skip if leftover 1/0 (Thin Gift) or 1/1 (Prime Gift) |
| `cap_remaining_cds_gt_6_to_6` | buffer, caster | An ally (or self) holds a remaining CD > 6; skip if all remaining ≤ 6 (Quint already capped those >5 to 5 only when Quint is in kit and was used) |
| `tax_next_walk_if_near_tripwire` | caster, controller | Target Chebyshev ≤ 1 from painted tripwire; skip if Brick Tax (adjacent barrier, walk +1 AP) already covers the same body this turn |
| `halve_leftover_mp_if_adjacent_barrier` | caster, controller | Target is adjacent to a barrier; skip if leftover MP is already 0 (Watch Root would want that) |
| `overwatch_snap_clip_walker_leftover_ap` | kiter, caster | Arm when the player is likely to walk into band; snap −1 leftover AP, do not steal to caster, do not call `recordChallengeApSpend` |
| `negate_hit_if_leftover_ap_eq_2_and_mp_eq_0` | guardian | Caster leftover 2/0 at arm; skip if leftover MP=0 at other AP (Dry Plate) or leftover 1/0 (Thin Plate) |
| `bonus_if_near_tripwire_occupancy` | caster, flanker | Target Chebyshev ≤ 2 from painted tripwire; skip if that cell is glyph-tax (Glyph Cut) or conveyor (Slide Cut) |
| `next_spell_exact_giraffe_4_1` | caster, kiter | Next damaging spell only if target is a permutation of (4,1); skip if Chebyshev 11 (Undeca Oath) is the only legal hole |
| `pack_walk_giraffe_4_1` | buffer | CHAMPION only; skip if aura up |
| `fold_two_player_side_share_giraffe_4_1` | **boss AI only** | Exactly two living player-side bodies sharing a (4,1); skip if they share (3,2) only (Camel Fold) |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 8. Persistence (Wave-1 writers; Wave-20 does not add a second path)

Wave 1 §8 is the persist contract. Wave 20 adds **no** new canister methods.

| Writer | Wave-20 use |
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
- Deep Gift HP gain: `healUsed` only when player-side HP actually increased.
- Brick Split’s leftover-MP halve is **not** `recordChallengeApSpend`.
- Watch Clip’s leftover-AP clip is not incoming damage and is not `recordChallengeApSpend`.
- Trip Skip does not rewrite lava/spikes challenge paths.

---

## 9. Special encounters (Wave 20)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `giraffe_gallery` | Blink Cutter on a board with legal (4,1) landings and blocked (3,2) / (3,1) / orthogonal-3 / (2,1) | `spell-giraffe-stride` via observe+win |
| `undeca_nave` | Glass Sniper at Chebyshev 11 down a long file (not 10) | `spell-undeca-oath` via observe+win |
| `trip_aisle` | Trap Scribe with a painted tripwire cell the player must respect | `spell-trip-reel` via observe+win |
| `skew_pulpit` | Bone Scribe; occupant will end the turn at leftover AP − MP === 2 | `spell-skew-mark` via observe+win |
| `trip_nave` | Tide Shade beside a painted tripwire on a 2-step approach | `spell-trip-skip` via observe+win |

Wave-19 `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` are not re-specified. `span_hendeca` stays Hendeca Span occupy-weight 11, not Undeca Oath. `fuse_nave` stays Fuse Skip, not Trip Skip.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–19 + sibling tactical catalogs already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, (3,2) next walk, (3,1) next walk, Chebyshev-3 orthogonal next walk, knight walk, Chebyshev-2-not-knight walk, exact-4…10 spell gates, conveyor pull, glyph-tax pull, leftover-0/0 paint, leftover-1/0 heal and negate, leftover AP≥2/MP≥1 negate and heal, leftover-MP-equals-max paint, Thorned pathLength-2 skip, fuse pathLength-1 skip, CD cap `n>5`→5, leftover-1/1 walk tax, barrier-adjacent next-walk MP tax, overwatch snap that shaves leftover MP, leftover AP=0/MP≥1 damage, glyph-tax-adjacent poke, leftover-AP-equals-max negate, pack (3,2) lock, (3,2) fold, leftover-sum===7 heal, remaining `4→0`, fourteen-cell occupy (2×7), caster-plus-one-hostile invert.

**Still open (Wave 20 SDE unique ids).** Occupy-weights, leftover-sum===7 family, CD quarte/tierce/dock/snuff, and camel/hook/tern/ring walks are siblings’; this table is what Discovery **adds**.

| Hole | Wave-20 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk permutation of **(4,1)** | `spell-giraffe-stride` | Camel Stride is **only** `(3,2)`. Hook Stride is **only** `(3,1)`. Tern Stride is Chebyshev **exactly 3, orthogonal only**. Knight Stride is **only** `(2,1)`. Ring Stride is Chebyshev **exactly 2**, knight excluded. Alfil `(2,2)` is Ring ∩ Diag. Hook Line is a **pull toward caster**. Do not mint `spell-giraffe-line` / `spell-alfil-stride` |
| Next spell illegal unless Chebyshev = 11 | `spell-undeca-oath` | Deca Oath is 10. Nona Oath is 9. Hendeca Span is occupy-weight 11 on `span_hendeca`. Long Oath is ≥ 3. Do not mint `spell-undeca-span` / `spell-hendeca-oath` |
| Pull 1 toward nearest **painted tripwire occupancy** | `spell-trip-reel` | Glyph Reel is painted glyph-tax. Slide Reel is painted conveyor. Brick Reel is **barrier**. Tripwire **is** the paint (`spell-tripwire`, #120). Dest is never `map.portals` |
| Bonus if share a **(4,1)** vector | `spell-giraffe-bite` | Camel Bite is `(3,2)`. Hook Bite is `(3,1)`. Knight Pierce is a **(2,1)** poke. Giraffe Stride is a **walk** constraint. Giraffe Gate is a **next-spell** gate |
| Cell detonates at occupant **turn end** iff leftover **AP − MP === 2** | `spell-skew-mark` | Hollow Mark detonates iff leftover **0/0**. Idle Mark is leftover **MP equals max**. Last Mark is last leftover **AP**. Dwell Mark is **any** end-turn occupy. Score/Sestet/Septet Post are tactical occupy leftover-**sum**. Occupant leftover 3/1 or 2/0 fires this, not Hollow. Do not mint `spell-skew-gift` |
| Next hit is 0 while leftover AP **=== 1 AND** leftover MP **≥ 2** | `spell-deep-plate` | Thin Plate is leftover **1/0**. Prime Plate is leftover **1/1**. Wide Plate is leftover **AP ≥ 2 AND MP ≥ 1**. Dual Plate is leftover both even ≥ 2. Deep Gift is the **heal** on this window |
| PathLength **2** walk onto a **painted tripwire** does not trigger this enter | `spell-trip-skip` | Fuse Skip is fuse occupancy + pathLength **1**. Brier Skip is Thorned extra + pathLength **2**, not occupancy. Glyph / Cinder / Rift skips are other taxes. PathLength 1 onto tripwire still triggers |
| Bonus if leftover AP **=== 2 AND** leftover MP **=== 0** | `spell-pair-gait` | Thin Gait is leftover **1/0**. Hollow Sting is leftover **0/0**. Wide Sting is leftover AP **≥ 2 AND** MP **≥ 1**. Prime Gait is leftover **1/1**. Lean Gait is leftover **0/≥1**. Pair Plate is the **negate** on 2/0. Do not mint `spell-pair-toll` (Even Toll + Gait Toll already tax 2/0 walks) |
| Allied summons pay +1 AP if this turn’s walk **landing** is a **(4,1)** from **origin** | `spell-summon-giraffe` | Summon Camel taxes **(3,2)**. Summon Hook taxes **(3,1)**. Summon Orth taxes each **diagonal step**. Pack Giraffe **locks** pack walks to (4,1) (`ENEMY_ONLY`) |
| Heal iff leftover AP **=== 1 AND** leftover MP **≥ 2** | `spell-deep-gift` | Thin Gift is leftover **1/0**. Prime Gift is leftover **1/1**. Wide Gift is AP ≥ 2 **and** MP ≥ 1. Gait Gift is AP ≥ 2 **and** MP = 0. Lean Gift is AP = 0 **and** MP ≥ 1. `healAmount` stays 0 on the row. Do not mint `spell-septet-gift` |
| Remaining CDs **n>6 → 6**; 0…6 unchanged | `spell-cadence-sext` | Cadence Quint is `n>5` → **5**. Cadence Quad is `n>4` → **4**. Cadence Cap is `n>2` → **2**. Cadence Quarte is `n===4` → 0. Hexa Oath is a **spell gate** exactly 6. Do not mint `spell-cadence-six` / `spell-cadence-hexa` |
| Next **walk** +1 AP if Chebyshev ≤ 1 from **painted tripwire** | `spell-trip-toll` | Brick Tax is adjacent **barrier**, walk +1 AP. Brick Levy is adjacent barrier, walk +1 **MP**. Even Toll is leftover **AP even ≥ 2**. Odd Toll is leftover **AP odd**. Gait Toll is leftover **MP = 0**. Prime Toll is leftover **1/1**. Not `spell.mpCost` |
| Halve leftover **MP** (floor) while adjacent to a **barrier** | `spell-brick-split` | Watch Root **zeros** leftover MP **on cast**. Watch Shave **−1 leftover MP on snap**. Brick Levy is next **walk +1 MP**. Frozen/Slime is a **map-modifier** walk-MP doubler. Immediate leftover rewrite, not a flag |
| Overwatch snap **−1 leftover AP** on the walker (caster does not gain it) | `spell-watch-clip` | Watch Shave is snap **−1 leftover MP**. Watch Drain **steals** leftover MP to the caster **on cast**. Watch Bind **forbids** the walker’s next walk. Watch Tax taxes next **spell** +1 AP. Not `recordChallengeApSpend` |
| Next hit is 0 while leftover AP **=== 2 AND** leftover MP **=== 0** | `spell-pair-plate` | Thin Plate is leftover **1/0**. Dry Plate is leftover **MP = 0** at **any** AP. Wide Plate needs MP ≥ 1. Dual Plate is both even ≥ 2. Pair Gait is **damage** on 2/0. Do not CORE with Dry Plate |
| Bonus if Chebyshev ≤ 2 from **painted tripwire occupancy** | `spell-trip-cut` | Glyph Cut is **glyph-tax** occupancy. Slide Cut is **conveyor**. Lava / Rime / Spike Cuts are live hazards. Trip Reel **pulls**. Portal Cut is **world portals** |
| Next spell illegal unless target is a permutation of **(4,1)** | `spell-giraffe-gate` | Undeca Oath is Chebyshev **=== 11**. Giraffe Bite is a **damage bonus** on (4,1). Giraffe Stride is a **walk** gate. Mid Oath is exact Chebyshev 2. Strike / `physical_attack` stays legal |
| Pack walks locked to permutation of **(4,1)** | `spell-pack-giraffe` | Pack Camel is **(3,2)**. Pack Hook is **(3,1)**. Pack Ring is Chebyshev **exactly 2**, knight excluded. Giraffe Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies that share a **(4,1)** vector | `spell-giraffe-fold` | Camel Fold is shared **(3,2)**. Hook Fold is shared **(3,1)**. Lane Fold is shared rank **or** file **and** Chebyshev **exactly 3**. Leap Fold is Chebyshev **exactly 3**, **any geometry**. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 20)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–19, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, **#1177**, or **#1198**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Trip Toll / Summon Giraffe / Pack Giraffe / Watch Clip / Brick Split are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 20 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #1198 / #1177 / #1143 / #1132 / #1082 / #1063 / #1017 key names for a different meaning.

```text
giraffeStride41,                  // dest is permutation of (4,1): eight cells
nextSpellExactChebyshev,          // Undeca Oath — value 11 (reuse key; value distinguishes Deca=10 / Nona=9)
attractTowardNearestTripwire, tripwireSearchRadius,
bonusIfShareGiraffe41WithCaster, giraffeBiteBonus,
detonateIfTurnEndLeftoverApMinusMpEq2,
negateHitIfLeftoverApEq1AndMpGe2,
skipTripwireTriggerOnPathLength2,
bonusIfLeftoverApEq2AndMpEq0, pairGaitBonus,
summonWalkGiraffe41ApTax,
requireLeftoverApEq1AndMpGe2, deepGiftHeal,
capRemainingCdsAbove6To6,         // n>6 → 6; 0…6 stay
nextWalkApTaxIfNearTripwire, tripTollRadius,
halveLeftoverMpIfAdjacentBarrier,
overwatchSnapClipWalkerLeftoverAp,
negateHitIfLeftoverApEq2AndMpEq0,
bonusIfNearTripwireOccupancy, tripCutRadius, tripCutBonus,
nextSpellExactGiraffe41,
packWalkGiraffe41, packAuraRadius, packAuraDuration,
foldTwoPlayerSideShareGiraffe41, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` / `farWatchMin` / `farWatchMax` for Watch Clip’s arm window; `nextSpellExactChebyshev` with value **11**.

---

### SPELL_ID: `spell-giraffe-stride`

NAME: Giraffe Stride  
ROLE: POSITION — one next walk must be a (4,1) dest  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rank_lancer`; `G ≥ 20` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥20. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm 1 turn. The caster’s **next walk** this turn is legal **only** if the dest is a permutation of (4,1): `(±4,±1)` and `(±1,±4)` (eight cells). Orthogonal dests including `(4,0)`, `(3,2)` dests, `(3,1)` dests, knight `(2,1)` dests, diagonal dests, and any Chebyshev ≠ 4 fail closed (walk confirm rejects; MP not spent). Teleport / Swap / Twin-gate are not that walk. Distinct from Camel Stride `(3,2)`, Hook Stride `(3,1)`, Tern Stride (Chebyshev 3 orthogonal), Knight Stride `(2,1)`, Ring Stride (Chebyshev 2, knight excluded).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_giraffe_4_1"`. Flanker / kiter. Skip if no (4,1) landing is floor. **Do not** assign to chargers who only walk orthogonal.  
PLAYER_COUNTERPLAY: Occupy the eight (4,1) cells; stand so the only threat is a Camel/Hook landing; Root before they arm  
SYNERGIES: Phase Slip onto a (4,1); Giraffe Bite after they land; Debt Mark (the gated walk also costs AP)  
BALANCE_RISK: (4,1) jumps a rank and a file. 2 AP, CD 2, **strict** geometry. Fail closed, never become Strike.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Later confirm-fail does not second-observe. Standard observe → same-encounter win. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-undeca-oath`

NAME: Undeca Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 11  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `pale_cantor`; `G ≥ 20`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or listed control id; Strike / `physical_attack` stays legal) confirms only if Chebyshev(caster, target) === 11 (`effectParams: {"nextSpellExactChebyshev":11}`). Distinct from Deca Oath (10), Nona Oath (9), Hendeca Span (occupy-weight 11 on `span_hendeca`).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_11"`. Caster / kiter. Skip if they cannot reach an 11-hole this turn.  
PLAYER_COUNTERPLAY: Walk to 10 or 12; Barrier the file; force Strike  
SYNERGIES: Far Sting at 11; Split Pace after a long walk; Paper Wind to cut their follow-up  
BALANCE_RISK: Exact-11 is a sniper prison. 2 AP + CD 3 + Strike exempt. Do not also ignore LoS.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trip-reel`

NAME: Trip Reel  
ROLE: POSITION — pull 1 toward nearest painted tripwire  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `plague_rat` or `glyph_sower`; `G ≥ 20`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `plague_rat`, `glyph_sower`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest **painted tripwire occupancy** (`spell-tripwire`) in Chebyshev 6 (`effectParams: {"attractTowardNearestTripwire":true,"tripwireSearchRadius":6}`). If none exists, fizzle (AP spent). Dest is never `map.portals`, never a Twin Gate pad, never a world reserved cell. Distinct from Glyph Reel (glyph-tax), Slide Reel (conveyor), Brick Reel (barrier), Hook Line (toward caster).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_tripwire"`. Caster / controller. Skip if no tripwire cell, or if attract would land on lava while HP% < 40.  
PLAYER_COUNTERPLAY: Dispel the tripwire; stand so attract is a no-op; Barrier the step  
SYNERGIES: Tripwire then reel; Trip Cut after they sit next to the paint; File Slide onto the wire  
BALANCE_RISK: Pull onto a trigger tile bricks a turn. 2 AP, 1 step, G≥20, empty-board fizzle.  
PERSISTENCE_REQUIREMENTS: Fizzle after AP still observes. Dest hazard ticks via existing helpers.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-giraffe-bite`

NAME: Giraffe Bite  
ROLE: DAMAGE — bonus if share a (4,1) with the caster  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `shadow_lurker`; `G ≥ 20`; `aiProfile` flanker  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is exactly a permutation of (4,1) from the caster, deal an extra 12 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareGiraffe41WithCaster":true,"giraffeBiteBonus":12}`). On-rank, on-file, on-diagonal, `(3,2)`, `(3,1)`, or `(2,1)` → 10 only. Distinct from Camel Bite `(3,2)`, Hook Bite `(3,1)`, Knight Pierce `(2,1)` poke, Giraffe Stride (walk gate), Giraffe Gate (next-spell gate).  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_giraffe_4_1_with_caster"`. Flanker. Walk or Giraffe Stride first. Skip if adjacent (use Rear Cut / Strike).  
PLAYER_COUNTERPLAY: Stand off the eight (4,1) cells; summon-block one landing  
SYNERGIES: Giraffe Stride then bite; Pawn Trade onto a (4,1)  
BALANCE_RISK: 22 through a jump is Frost-adjacent. Gate is strict geometry. Fail closed, never become Strike.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-geometry 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-skew-mark`

NAME: Skew Mark  
ROLE: TERRAIN — turn-end detonate iff leftover AP − leftover MP === 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `bone_scribe`; `G ≥ 20`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. At the **occupant’s turn end**, if leftover AP − leftover MP === 2 (legal leftover pairs include `(2,0)`, `(3,1)`, `(4,2)`, `(5,3)` …), deal 14 (spell, RES+SR) and consume (`effectParams: {"detonateIfTurnEndLeftoverApMinusMpEq2":true}`). Strike-from, walk-enter, teleport landing, leftover 0/0, leftover MP equals max, last leftover AP, leftover 1/0, leftover 1/1 → no detonate. Distinct from Hollow Mark (0/0), Idle Mark (MP equals max), Last Mark (last AP), Dwell Mark (any occupy), Score/Sestet/Septet Post (tactical occupy leftover-sum). Observation is the **paint**. Do not mint `spell-skew-gift`.  
SCALING: damage follows dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_turn_end_leftover_ap_minus_mp_eq_2"`. Caster / controller. Paint a cell they will hold leftover diff 2 on. Skip if they will empty both pools (Hollow Mark).  
PLAYER_COUNTERPLAY: Spend to 0/0 or keep leftover 1/1; leave the cell; blink off  
SYNERGIES: Quiet Hex so they keep 3 leftover AP and 1 MP; Drain Courage to land on `(2,0)`  
BALANCE_RISK: 14 at end of a skewed leftover is a punish, not a trap-on-enter. 3 AP, CD 2, diff-2 gate.  
PERSISTENCE_REQUIREMENTS: Paint observes. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-deep-plate`

NAME: Deep Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP === 1 and leftover MP ≥ 2  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 20`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥20. `generationMin: 20`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **=== 1 AND** leftover MP **≥ 2**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApEq1AndMpGe2":true}`). Leftover 1/0, 1/1, 2/0, AP≥2/MP≥1, or 0/≥1 → full hit, charge remains until expiry. Distinct from Thin Plate (1/0), Prime Plate (1/1), Wide Plate (AP≥2/MP≥1), Dual Plate (both even ≥ 2), Deep Gift (heal on this window). Do not implement as `buffStat: "evasion"`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_eq_1_and_mp_ge_2"`. Guardian / kiter. Skip if leftover is not AP===1/MP≥2 or if Thin Plate is already up.  
PLAYER_COUNTERPLAY: Force a 2-cost tool (leftover AP drops to 0); Soul Sip leftover MP to 1; wait 1 turn  
SYNERGIES: Haste to hold MP ≥ 2 after a 1-AP poke; Deep Gift on a healer in the pack (do **not** CORE both on a BASE kit)  
BALANCE_RISK: A 1-AP/2-MP camp becomes unhittable for one swing. CD 2 + leftover gate. AoE: first instance consumes.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trip-skip`

NAME: Trip Skip  
ROLE: POSITION — pathLength 2 walk onto tripwire does not trigger this enter  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `tide_shade` or `plague_rat`; `G ≥ 20`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn, 1 consume. The next **pathLength 2** walk that **enters** a painted tripwire cell (`spell-tripwire`) does **not** trigger that cell this enter (`effectParams: {"skipTripwireTriggerOnPathLength2":true}`). PathLength 1 still triggers. Lava / spikes / ice leave-tax / glyph-tax / fuse / Void Rift / conveyor / Thorned extra still tick. Distinct from Fuse Skip (fuse occupancy, pathLength **1**), Brier Skip (Thorned extra, pathLength 2, **not** occupancy).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_tripwire_trigger_on_path_length_2"`. Kiter / flanker. Skip if no tripwire sits on a 2-step.  
PLAYER_COUNTERPLAY: Force a 1-step onto the wire; wait; paint a second tripwire  
SYNERGIES: Tripwire then skip through; Fuse Skip is a different occupancy rider — do not CORE both on a BASE kit  
BALANCE_RISK: Skipping a tripwire on a 2-step is a positioning gift. PathLength gate + CD 2. Do not retune tripwire damage.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Ignored trigger is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-gait`

NAME: Pair Gait  
ROLE: DAMAGE — bonus if leftover AP === 2 and leftover MP === 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `bone_scribe` or `purse_scribe`; `G ≥ 20`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `bone_scribe`, `purse_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥20. `generationMin: 20`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **caster’s** leftover AP === 2 **and** leftover MP === 0 at resolve, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq2AndMpEq0":true,"pairGaitBonus":8}`). Leftover 1/0, 0/0, 1/1, 0/≥1, or AP≥2/MP≥1 → 10 only. Distinct from Thin Gait (1/0), Hollow Sting (0/0), Wide Sting (AP≥2/MP≥1), Prime Gait (1/1), Lean Gait (0/≥1), Pair Plate (negate on 2/0). Do not mint `spell-pair-toll`.  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_2_and_mp_eq_0"`. Caster / berserker. Spend MP, keep exactly 2 AP. Skip if leftover is 1/0 or AP≥2/MP≥1.  
PLAYER_COUNTERPLAY: Soul Sip leftover AP to 1; Haste so they hold MP; Root  
SYNERGIES: Pair Plate on a guardian in the pack (do not CORE both on a BASE kit); Quiet Hex so a 3-AP tool leaves 2  
BALANCE_RISK: 18 after emptying MP and holding 2 AP is Frost-lite. Gate is exact 2/0.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-giraffe`

NAME: Summon Giraffe  
ROLE: SUMMONS — allied pets pay +1 AP to land (4,1) from origin  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 20`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 20`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon (same side) that this turn walks to a landing that is a permutation of (4,1) from **that summon’s walk origin** pays +1 AP (`effectParams: {"summonWalkGiraffe41ApTax":true}`). Orthogonal / (3,2) / (3,1) / knight landings do not pay. Distinct from Summon Camel `(3,2)` tax, Summon Hook `(3,1)` tax, Summon Orth (diagonal step tax), Pack Giraffe (pack **lock**, `ENEMY_ONLY`).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_giraffe_4_1_ap_tax"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Walk pets orthogonal; Sever Tether; kill the chanter  
SYNERGIES: Kennel Lock keeps pets close so (4,1) is a stretch; Pack Giraffe is CHAMPION-only and never owned — do not CORE both  
BALANCE_RISK: Player copy taxes **their** pets — a real downside when kiting with (4,1) jumps. Elite + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-deep-gift`

NAME: Deep Gift  
ROLE: SUPPORT — heal iff leftover AP === 1 and leftover MP ≥ 2  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 20`; `aiProfile` healer/buffer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No `healAmount` on the row. If the **target’s** leftover AP === 1 **and** leftover MP ≥ 2, heal 10 (`effectParams: {"requireLeftoverApEq1AndMpGe2":true,"deepGiftHeal":10}`). Else fizzle (AP spent). Leftover 1/0, 1/1, 2/0, 0/≥1, or AP≥2/MP≥1 fail. Distinct from Thin Gift (1/0 heal), Prime Gift (1/1 heal), Wide Gift (AP≥2/MP≥1 heal), Gait Gift (AP≥2/MP=0 heal), Lean Gift (AP=0/MP≥1 heal), Septet Mend (both-body sum===7). Healer CORE only. Do not mint `spell-septet-gift` / `spell-hept-gift`.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_eq_1_and_mp_ge_2"`. Healer / buffer. Skip unless leftover is AP===1/MP≥2. Do **not** assign to non-healer CORE (`inferArchetype` still keys `healAmount > 0` — keep `healAmount: 0` on the row).  
PLAYER_COUNTERPLAY: Spend the last AP; Soul Sip leftover MP to 1; Cursed Wound  
SYNERGIES: Quiet Hex so they keep 1 leftover AP; Haste so they hold MP ≥ 2; `easy_1` — the heal fails that challenge when HP actually increases  
BALANCE_RISK: 10 on a 1/≥2 window is Blood Mend-lite. Elite + fizzle off-window.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. `healUsed` only if player-side HP increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-sext`

NAME: Cadence Sext  
ROLE: SUPPORT — remaining CDs n>6 → 6  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 20`; `aiProfile` buffer/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: No damage. Target may be self. Every remaining spell CD **n>6** becomes 6; 0/1/2/3/4/5/6 unchanged (`effectParams: {"capRemainingCdsAbove6To6":true}`). Distinct from Cadence Quint (`n>5`→5), Cadence Quad (`n>4`→4), Cadence Tern (`n>3`→3), Cadence Cap (`n>2`→2), Cadence Quarte (`4→0`). Do not CORE with Quint / Quad / Tern / Cap / Tierce / Dock / Snuff / Quarte on the same BASE kit. Do not mint `spell-cadence-six` / `spell-cadence-hexa`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_6_to_6"`. Buffer / caster. Skip if no remaining CD > 6.  
PLAYER_COUNTERPLAY: Wait the last tick; Dispel; force a 5-CD tool instead  
SYNERGIES: Inferno CD 3 is unchanged; a later 8-CD signature becomes 6. Hard_3 is AP, not CD.  
BALANCE_RISK: Capping 9→6 is a tempo gift. Ally-only + CD 3 + G≥20.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trip-toll`

NAME: Trip Toll  
ROLE: CONTROL — next walk +1 AP if Chebyshev ≤ 1 from painted tripwire  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 20`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target is Chebyshev ≤ 1 from **painted tripwire occupancy**, their **next walk of ≥ 1 tile** this battle (or 2 turns) also costs +1 AP (`effectParams: {"nextWalkApTaxIfNearTripwire":true,"tripTollRadius":1}`). Else fizzle (AP spent). Teleport / Swap / Phase Slip / Twin-gate do **not** pay. Distinct from Brick Tax (adjacent **barrier**, walk +1 AP), Brick Levy (adjacent barrier, walk +1 **MP**), Even Toll (AP even ≥ 2), Odd Toll (AP odd), Gait Toll (MP = 0), Prime Toll (leftover 1/1). Not `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_near_tripwire"`. Caster / controller. Skip if no tripwire in 1, or if already rooted, or if Brick Tax already covers this body this turn.  
PLAYER_COUNTERPLAY: Step to 2 from the wire; Dispel the paint; blink  
SYNERGIES: Tripwire then toll; Trip Cut on a different window (damage vs tax)  
BALANCE_RISK: Standing on a trigger tile now also taxes the leave. 2 AP, CD 2, occupancy gate.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-split`

NAME: Brick Split  
ROLE: CONTROL — leftover MP halved if adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 20`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target is **adjacent to a barrier** at resolve, their leftover MP becomes `floor(leftover MP / 2)` (min 0) immediately (`effectParams: {"halveLeftoverMpIfAdjacentBarrier":true}`). Else fizzle (AP spent). Not `spell.mpCost`. Distinct from Watch Root (zero leftover MP **on cast**, no adjacency), Watch Shave (−1 leftover MP **on snap**), Brick Levy (next **walk +1 MP**), Frozen/Slime (map-modifier MP doubler on **every** walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "halve_leftover_mp_if_adjacent_barrier"`. Caster / controller. Skip if no adjacent barrier, or if leftover MP is already 0.  
PLAYER_COUNTERPLAY: Step off the wall; blink; spend MP first so floor/2 is 0 anyway  
SYNERGIES: Barrier then split; Brick Levy on a later walk (split first, then tax the leave)  
BALANCE_RISK: Wall-hugging kiting loses half leftover MP. 2 AP, CD 2, adjacency gate. Challenge: leftover-MP rewrite is not AP.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. Halve is not `recordChallengeApSpend`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-clip`

NAME: Watch Clip  
ROLE: DEFENSE — overwatch snap −1 leftover AP (caster does not gain it)  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 20`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 20`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into Chebyshev 3 or 4 of the caster loses 1 leftover AP (min 0). The caster does **not** gain that AP (`effectParams: {"overwatchSnapClipWalkerLeftoverAp":true,"farWatchMin":3,"farWatchMax":4,"overwatchDuration":2}`). Push/pull into the band **does** trigger. Teleport / Swap / Twin-gate **does not**. Distinct from Watch Shave (snap **−1 leftover MP**), Watch Drain (steal leftover MP to caster **on cast**), Watch Bind (forbid next walk), Far Watch (deals damage). Observation is the **arm**. Not `recordChallengeApSpend`.  
SCALING: amount fixed; band fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_clip_walker_leftover_ap"`. Kiter / caster. Skip if the player is already in 1–2.  
PLAYER_COUNTERPLAY: Stay at 5+ or at 1–2; blink in; send a summon into 3  
SYNERGIES: Trip Toll (leaving a wire now costs AP **and** the snap clips another leftover AP); Paper Wind  
BALANCE_RISK: Band 3–4 + Drain Courage is an AP prison. Consume-on-first-body, CD 3, elite. Do not steal to caster.  
PERSISTENCE_REQUIREMENTS: Arm observes. Snap does not second-observe. Clip is not `recordChallengeApSpend`.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pair-plate`

NAME: Pair Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP === 2 and leftover MP === 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter` or `plate_warden`; variant ≥ ELITE or `G ≥ 20`; `aiProfile` guardian  
ENEMY_FAMILIES: `brood_chanter`, `plate_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **=== 2 AND** leftover MP **=== 0**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApEq2AndMpEq0":true}`). Leftover 1/0, 3/0, 0/0, 2/1, or AP≥2/MP≥1 → full hit, charge remains until expiry. Distinct from Thin Plate (1/0), Dry Plate (leftover MP=0 at **any** AP), Wide Plate (needs MP≥1), Dual Plate (both even ≥ 2), Pair Gait (damage on 2/0). Do not implement as `buffStat: "evasion"`. Do not CORE with Dry Plate.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_eq_2_and_mp_eq_0"`. Guardian. Arm while holding exactly 2 AP and 0 MP. Skip if Dry Plate / Thin Plate is already up.  
PLAYER_COUNTERPLAY: Force a 3-cost tool or a walk; wait 1 turn; AoE second instance  
SYNERGIES: Quiet Hex so a 3-AP tool leaves 2; Pair Gait on a different body (do not CORE both)  
BALANCE_RISK: A 2-AP empty-MP camp becomes unhittable for one swing. Elite + exact 2/0 gate. Stricter than Dry Plate.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-trip-cut`

NAME: Trip Cut  
ROLE: DAMAGE — bonus if Chebyshev ≤ 2 from painted tripwire  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `plague_rat`; variant ≥ ELITE or `G ≥ 20`; `aiProfile` caster/flanker  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from **painted tripwire occupancy**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfNearTripwireOccupancy":true,"tripCutRadius":2,"tripCutBonus":8}`). Far from tripwire, on a Twin Gate pad, next to glyph-tax only, or next to lava only → 10 only. Distinct from Glyph Cut (glyph-tax), Slide Cut (conveyor), Lava/Rime/Spike Cuts (live hazards), Trip Reel (pull), Portal Cut (`map.portals`).  
SCALING: both numbers follow dmg%; radius fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_tripwire_occupancy"`. Caster / flanker. Paint tripwire first. Skip if no paint in 2 of the target.  
PLAYER_COUNTERPLAY: Step to 3 from the wire; Dispel the paint; hug a glyph-tax instead (Glyph Cut would want that)  
SYNERGIES: Tripwire then cut; Trip Reel to pull them into 2  
BALANCE_RISK: 18 next to a trigger tile is the combo. Elite + paint required.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-giraffe-gate`

NAME: Giraffe Gate  
ROLE: CONTROL — next spell illegal unless target is a (4,1)  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `blink_cutter`; `G ≥ 20`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `blink_cutter`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or listed control id; Strike / `physical_attack` stays legal) confirms only if the target is a permutation of (4,1) from the caster (`effectParams: {"nextSpellExactGiraffe41":true}`). Chebyshev 11, `(3,2)`, `(3,1)`, knight, orthogonal, and diagonal dests fail closed. Distinct from Undeca Oath (Chebyshev === 11), Giraffe Bite (damage bonus on (4,1)), Giraffe Stride (walk gate), Mid Oath (exact Chebyshev 2).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_giraffe_4_1"`. Caster / kiter. Skip if they cannot reach a (4,1) hole this turn. Do **not** CORE with Giraffe Bite on a BASE kit (the bite would always fire after the gate).  
PLAYER_COUNTERPLAY: Stand off the eight (4,1) cells; force Strike; Barrier one landing  
SYNERGIES: Giraffe Stride onto a (4,1) then a gated poke from a different body; Far Sting is range, not geometry  
BALANCE_RISK: Geometry prison on the next spell. 2 AP + CD 3 + Strike exempt. Fail closed.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Confirm-fail does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-giraffe`

NAME: Pack Giraffe  
ROLE: SUPPORT — pack walks locked to permutation of (4,1)  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `giraffe_precentor`; variant CHAMPION; `G ≥ 20`  
ENEMY_FAMILIES: `giraffe_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 20`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only walk to dests that are a permutation of (4,1) from **that walker’s origin** (`effectParams: {"packWalkGiraffe41":true,"packAuraRadius":2,"packAuraDuration":2}`). Does not grant extra AP. Distinct from Pack Camel `(3,2)`, Pack Hook `(3,1)`, Pack Ring (Chebyshev 2, knight excluded), Pack Orth (any orthogonal), Giraffe Stride (self next walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_giraffe_4_1"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; occupy the (4,1) cells  
SYNERGIES: Pack Camel is a different CHAMPION — **do not** put both on a BASE kit; CHAMPION may have Camel **or** Giraffe, not both in CORE  
BALANCE_RISK: Forcing a pack onto (4,1) jumps is a scramble. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-giraffe-fold`

NAME: Giraffe Fold  
ROLE: POSITION — swap two player-side bodies that share a (4,1)  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `giraffe_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `giraffe_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **if and only if** they share a permutation of (4,1). If fewer than two, or they share only a (3,2) / (3,1) / rank / file / Chebyshev 3 orthogonal, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideShareGiraffe41":true,"foldDamage":6}`). Distinct from Camel Fold `(3,2)`, Hook Fold `(3,1)`, Lane Fold (rank or file and Chebyshev 3), Leap Fold (Chebyshev 3 any geometry), Pawn Trade (two hostiles-to-caster). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_giraffe_4_1"`. **Boss AI only.** Skip if 0–1 player-side bodies or they do not share (4,1).  
PLAYER_COUNTERPLAY: Fight without a summon; stand off (4,1); False Retreat decoy as the second body  
SYNERGIES: Giraffe identity; Claim Ward does not block unit swap (same explicit as Camel Fold)  
BALANCE_RISK: Forced player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 20 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…19 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥20 | `spell-giraffe-stride`, `spell-giraffe-bite`. `spell-giraffe-gate` as a G≥20 extra — do **not** CORE with Giraffe Bite |
| `rank_lancer` | RARE / G≥20 | `spell-giraffe-stride` |
| `shadow_lurker` | RARE / G≥20 | `spell-giraffe-bite` |
| `glass_sniper` | RARE / G≥20 | `spell-undeca-oath`, `spell-giraffe-gate` |
| `glass_sniper` | ELITE | `spell-watch-clip` |
| `pale_cantor` | RARE / G≥20 | `spell-undeca-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-deep-gift` (healer CORE only) |
| `glyph_sower` | RARE / G≥20 | `spell-trip-reel`, `spell-skew-mark` |
| `glyph_sower` | ELITE | `spell-trip-cut` |
| `plague_rat` | RARE / G≥20 | `spell-trip-reel`, `spell-trip-skip` |
| `plague_rat` | ELITE | `spell-trip-cut` |
| `rime_mason` | RARE / G≥20 | `spell-brick-split` |
| `bone_scribe` | RARE / G≥20 | `spell-skew-mark`, `spell-pair-gait` |
| `purse_scribe` | RARE / G≥20 | `spell-pair-gait` |
| `tide_shade` | RARE / G≥20 | `spell-trip-skip` |
| `plate_warden` | ADVANCED / G≥20 | `spell-deep-plate` |
| `iron_golem` | ADVANCED / G≥20 | `spell-deep-plate` |
| `plate_warden` | ELITE | `spell-pair-plate` |
| `stone_castellan` | RARE / G≥20 | `spell-brick-split` |
| `brood_chanter` | ELITE | `spell-summon-giraffe`, `spell-pair-plate` |
| `cadence_thief` | RARE / G≥20 | `spell-cadence-sext` |
| `hex_chorister` | RARE / G≥20 | `spell-cadence-sext` |
| `tax_scribe` | RARE / G≥20 | `spell-trip-toll` |
| `ley_tollkeeper` | RARE / G≥20 | `spell-trip-toll` |
| `hood_lurker` | ELITE | `spell-watch-clip` |
| `giraffe_precentor` CHAMPION | SIGNATURE | `spell-pack-giraffe` (`ENEMY_ONLY`; not with Pack Camel / Pack Hook / Pack Ring / Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `giraffe_fold_regent` | BOSS_ONLY | `spell-giraffe-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-20 family CORE is unique #1143 + #1177

Wave-20 family CORE consumes remaining **#1143** unique Wave-18 verbs (minus Wide Gift / Idle Plate on non-healer kits; minus Pack Hook / Hook Fold) and **#1177** tactical Wave-19 ids (minus Court Quarte; Septet Mend healer CORE only) in **CORE**. **#1248** named those families (`septet_mender` … `idle_plater`) — do **not** restamp those `ENEMY_ID`s. Unique §11 ids may appear there only as G≥20 extras in a later family pass (Wave 22), not as this document’s CORE and **not** as #899 / #941 / #997 / **#1073** / **#1138** / **#1189** / **#1248** CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, #941 CORE, #997 CORE, **#1073** CORE, **#1138** CORE, **#1189** CORE, or **#1248** CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** restamp #997 `ENEMY_ID`s (`tally_mender` … `shove_gifter`). Do **not** restamp **#1073** `ENEMY_ID`s (`score_mender` … `summon_plater`). Do **not** restamp **#1138** `ENEMY_ID`s (`stave_mender` … `cast_plater`). Do **not** restamp **#1189** `ENEMY_ID`s (`sestet_mender` … `strike_plater`). Do **not** restamp **#1248** `ENEMY_ID`s (`septet_mender` … `idle_plater`). Do **not** name unique §11 families after those `ENEMY_ID`s. `giraffe_precentor` is not `camel_precentor` / `hook_precentor` / `ring_warder` / `hoop_precentor` / `hook_warder`. `giraffe_fold_regent` is not `camel_fold_regent` / `hook_fold_regent` / `court_quarte_regent` / `court_tierce_regent` / `court_quinte_regent`.

Stamp, do not clone #1143: Hook Stride, Nona Oath, Slide Reel, Hook Bite, Idle Mark, Thin Plate, Brier Skip, Wide Sting, Summon Hook, Cadence Quad, Even Toll, Brick Fee, Watch Bind, Prime Gait, Slide Cut. Wide Gift stays healer CORE only. Pack Hook stays `ENEMY_ONLY` on `hook_precentor`. Hook Fold stays `BOSS_ONLY` on `hook_fold_regent`.

Stamp, do not clone #1177: Septet Mend (healer CORE only), Cadence Quarte, Tetradeca Span (implementation-blocked while summon cap is 2), Feud Turn, Septet Hood, Septet Sting, Septet Step, Septet Sill, Septet Hold, Septet Lend, Septet Sip, Septet Post, Septet Bounce, Must Septet, Verse Septet. Court Quarte stays `NOT_PLAYER_LEARNABLE` on `court_quarte_regent`. Do **not** CORE Must Septet with Septet Hold. Do **not** CORE Cadence Quarte with Cadence Sext / Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap / Cadence Dock / Cadence Snuff / Cadence Tierce / Cadence Quinte. Do **not** CORE Septet Mend with Deep Gift / Thin Gift / Wide Gift / Gait Gift / Prime Gift / Sestet Mend / Stave Mend / Score Mend / Octave Mend. Do **not** CORE Feud Turn with Psalm Turn / Hymn Turn / Purse Turn / Tempo Invert / Bar Cross / Duel Turn / Kin Turn. Do **not** CORE Cadence Sext with Cadence Quint / Cadence Quarte / Cadence Quinte.

**SDE wins** unique leftover collisions: Deep Gift stays leftover AP **=== 1 AND** leftover MP **≥ 2**; Cadence Sext stays remaining `n>6` → `6`; Deep Plate stays leftover **AP === 1 AND MP ≥ 2** negate; Skew Mark stays turn-end leftover **AP − MP === 2**; Pair Gait stays leftover **2/0** damage; Pair Plate stays leftover **2/0** negate. Do **not** mint `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-hept-gift` / `spell-skew-gift` / `spell-octave-gift` / `spell-eight-gift` / `spell-eleven-span` / `spell-undeca-span` / `spell-fifteen-span` / `spell-pentakaideca-span` / `spell-twin-turn` / `spell-duet-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-deca-span` / `spell-hook-line` / `spell-camel-line` / `spell-giraffe-line` / `spell-cadence-six` / `spell-cadence-hexa` / `spell-cadence-cinque` / `spell-cadence-fifth` / `spell-mixed-turn` / `spell-thin-sting` / `spell-wide-gait` / `spell-alfil-stride` / `spell-pair-toll` / `spell-deep-sting`. **#1063** owns `spell-dodeca-span` — stamp, do not clone. **#1132** owns `spell-trideca-span` / `spell-sestet-mend` / `spell-cadence-tierce` / `spell-psalm-turn` — stamp, do not clone. **#1177** owns `spell-tetradeca-span` / `spell-septet-mend` / `spell-cadence-quarte` / `spell-feud-turn` — stamp, do not clone. **#1251** owns `spell-octave-mend` / `spell-cadence-quinte` / `spell-pentadeca-span` / `spell-kin-turn` — stamp, do not clone.

### 12.2 Wave-19 unique extras (deferred)

#1198 unique Wave-19 verbs (`spell-camel-stride` … `spell-camel-fold`) stay G≥19 extras until Wave 21 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Camel stays `ENEMY_ONLY` on `camel_precentor`. Camel Fold stays `BOSS_ONLY` on `camel_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 21)

**#1251** opened 00:21 UTC as Wave-20 tactical. **Stamp it as Wave 21 family CORE** together with unique Wave-19 §11 (**#1198**). Do **not** put those ids in Wave-20 family CORE or unique §11. Unique §11 stay this catalog’s until Wave 22. Octave Mend is both-body leftover **sum === 8 AND unequal** (healer CORE only). Cadence Quinte is remaining `n===5` → `0`. Pentadeca Span is occupy-weight **15** (implementation-blocked while summon cap is 2). Kin Turn is leftover invert on **caster + one same-side ally**. Court Quinte stays `NOT_PLAYER_LEARNABLE` on `court_quinte_regent`. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` wait for Wave 22 — do not restamp. Do **not** CORE Octave Mend with Deep Gift / Thin Gift / Wide Gift / Gait Gift / Prime Gift / Septet Mend / Sestet Mend / Stave Mend / Score Mend. Do **not** CORE Cadence Quinte with Cadence Sext / Cadence Quint / Cadence Quarte / Cadence Quad / Cadence Tern / Cadence Cap / Cadence Dock / Cadence Snuff / Cadence Tierce. Do **not** CORE Pentadeca Span with Undeca Oath / Tetradeca Span / Trideca Span / Hendeca Span. Do **not** CORE Kin Turn with Giraffe Gate / Feud Turn / Psalm Turn / Hymn Turn / Duel Turn / Purse Turn / Tempo Invert / Bar Cross. Do **not** CORE Octave Hood with Deep Plate / Pair Plate / Thin Plate / Wide Plate / Septet Hood. Do **not** CORE Octave Post with Skew Mark / Hollow Mark / Idle Mark.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 21 forever

Same recipe as Wave 19 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 21 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** / **#1251** extra doors. Do not restamp #906 / #962 / **#1017** / **#1082** / **#1143** / **#1198** rooms. Do not restamp #899 / **#941** / **#997** / **#1073** / **#1138** / **#1189** / **#1248** family ids. Do not restamp #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** / **#1244** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 / #957 / **#1006** / **#1056** / **#1121** / **#1195** / **#1249** ENC-* ids. Do not consume #949 / **#993** / **#1064** / **#1114** / **#1172** / **#1235** `WF-*`. Do not mint the §0.1 forbidden aliases. Do not overwrite **#1226** SDA unique files. Do not restack **#1235** `WORLD_DYNAMICS.md` / `worldFeatures.ts`.

Suggested Wave-21 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-19 §11 verbs **and** **#1251** (this catalog’s unique ids stay extras until Wave 22); one next walk permutation of **(4,3)** (zebra / antelope); leftover AP − leftover MP === **3**; leftover AP === **3 AND** leftover MP === **0**; **target-only leftover sum === 8** heal (Octave Mend is both-body; do **not** mint `spell-octave-gift` as a clone). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-hostile invert is **#1011 Duel Turn**. Two-ally invert (caster stays) is **#1063 Hymn Turn**. Mixed-side invert (caster stays) is **#1132 Psalm Turn**. Caster-plus-one-hostile invert is **#1177 Feud Turn**. Caster-plus-one-ally invert is **#1251 Kin Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Eleven-cell occupy is **#1011 Hendeca Span**. Twelve-cell occupy is **#1063 Dodeca Span**. Thirteen-cell occupy is **#1132 Trideca Span**. Fourteen-cell occupy (2×7) is **#1177 Tetradeca Span**. Fifteen-cell occupy is **#1251 Pentadeca Span**. Both-body leftover sum===4 unequal heal is **#1011 Score Mend**. Both-body leftover sum===5 heal is **#1063 Stave Mend**. Both-body leftover sum===6 unequal heal is **#1132 Sestet Mend**. Both-body leftover sum===7 heal is **#1177 Septet Mend**. Both-body leftover sum===8 unequal heal is **#1251 Octave Mend**. Remaining `1→0` is **#1011 Cadence Snuff**. Remaining `2→0` is **#1063 Cadence Dock**. Remaining `3→0` is **#1132 Cadence Tierce**. Remaining `4→0` is **#1177 Cadence Quarte**. Remaining `5→0` is **#1251 Cadence Quinte**. Remaining `n>2`→`2` is **#1017 Cadence Cap**. Remaining `n>3`→`3` is **#1082 Cadence Tern**. Remaining `n>4`→`4` is **#1143 Cadence Quad**. Remaining `n>5`→`5` is **#1198 Cadence Quint**. Remaining `n>6`→`6` is this wave’s Cadence Sext. Chebyshev-3 orthogonal next walk is #1082 Tern Stride. Chebyshev-2-not-knight next walk is #1017 Ring Stride. (3,1) next walk is #1143 Hook Stride. (3,2) next walk is #1198 Camel Stride. (4,1) next walk is this wave’s Giraffe Stride. Pack Hook stays `ENEMY_ONLY` on `hook_precentor`. Pack Camel stays `ENEMY_ONLY` on `camel_precentor`. Pack Giraffe stays `ENEMY_ONLY` on `giraffe_precentor`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`. Hook Fold stays `BOSS_ONLY` on `hook_fold_regent`. Camel Fold stays `BOSS_ONLY` on `camel_fold_regent`. Giraffe Fold stays `BOSS_ONLY` on `giraffe_fold_regent`. Court Tierce stays kit-only on `court_tierce_regent`. Court Quarte stays kit-only on `court_quarte_regent`. Court Quinte stays kit-only on `court_quinte_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** / **#1082** / **#1132** / **#1138** / **#1139** / **#1140** / **#1143** / **#1170** / **#1177** / **#1187** / **#1189** / **#1195** / **#1198** / **#1226** / **#1235** / **#1244** / **#1248** / **#1249** / **#1251** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W20-A. G≥20 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W20-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W20-C. Wave-20 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #1143 / #1177 / #1198 / **#1251** ids |
| W20-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub |
| W20-E. No new feat/challenge/boss stamps | — | Doka formula; `unstoppable`; leftover `survivor` |
| W20-F. Painted tripwire occupancy | Tripwire (#120) tables | `map.portals`; new `HazardTileType`; editing Thorned Ground extra numbers |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

Watch Clip must not add an evasion roll to `dealDamage` and must not call `recordChallengeApSpend`. Trip Cut must not edit RES/SR/CHC math. Undeca Oath must not clone Hendeca Span. Trip Skip must not retune tripwire damage. Brick Split must not use walk `applyMpCost` map modifiers as the split itself.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 19 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W20-1 | Encounter start | Possessed-but-unused G20 id does not observe |
| W20-2 | Giraffe Stride dest orthogonal, (4,0), (3,2), (3,1), knight, diagonal, or Chebyshev ≠ 4 | Confirm fails; MP not spent; Giraffe Stride already observed |
| W20-3 | `giraffe_gallery` defeat | Does not grant. Victory grants once |
| W20-4 | `camel_gallery` / `hook_gallery` / `tern_gallery` / `ring_gallery` / `knight_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `even_gallery` / `pair_gallery` | Do not grant Giraffe Stride |
| W20-5 | Undeca Oath then Frost at Chebyshev 9, 10, or 12 | Confirm fails; Strike still legal |
| W20-6 | Trip Reel no painted tripwire | Fizzle observes; no pull. Dest is not `map.portals`, not live lava/ice/spikes, not painted glyph-tax, not painted conveyor |
| W20-7 | Giraffe Bite on-rank, on-file, on-diagonal, (3,2), (3,1), or (2,1) | 10 only. Camel Bite would want `(3,2)`. Hook Bite would want `(3,1)`. Knight Pierce would want `(2,1)` |
| W20-8 | Skew Mark Strike-from / walk-enter / teleport landing / leftover 0/0 / leftover MP equals max / leftover 1/0 / leftover 1/1 at turn end | No detonate. Hollow Mark would detonate on leftover 0/0. Idle Mark would detonate on leftover MP equals max. Last Mark would detonate on last AP. Dwell Mark would detonate on any end-turn occupy. Occupant leftover 3/1 or 2/0 **does** detonate |
| W20-9 | Deep Plate hit while leftover not AP===1/MP≥2 | Full hit; charge remains. Hit while leftover 1/2 consumes. Thin Plate would want leftover 1/0. Prime Plate would want leftover 1/1. Wide Plate would want AP≥2/MP≥1 |
| W20-10 | Trip Skip across lava / spikes / ice leave-tax / glyph-tax / fuse / Void Rift / conveyor / Thorned extra / pathLength 1 | Those taxes still tick. Skip is tripwire occupancy + pathLength 2 only. PathLength 1 onto tripwire still triggers. Fuse Skip would want fuse + pathLength 1. Brier Skip would want Thorned extra + pathLength 2 |
| W20-11 | Pair Gait leftover 1/0, 0/0, 1/1, 0/≥1, or AP≥2/MP≥1 | 10 only. Thin Gait would bonus leftover 1/0. Hollow Sting would bonus leftover 0/0. Wide Sting would bonus AP≥2/MP≥1. Prime Gait would bonus leftover 1/1 |
| W20-12 | Summon Giraffe vs Summon Camel vs Summon Hook vs Pack Giraffe | Pets pay AP to **land (4,1) from origin** vs **(3,2)** vs **(3,1)** vs pack **(4,1) lock** |
| W20-13 | Deep Gift after leftover 1/0 or 1/1 or 2/0 or 0/≥1 or AP≥2/MP≥1 | Fizzle observes; no heal. Thin Gift would want 1/0. Prime Gift would want 1/1. Gait Gift would want AP≥2/MP=0. Wide Gift would want AP≥2/MP≥1. Lean Gift would want AP=0/MP≥1. Septet Mend would want both-body sum === 7. Leftover 1/2 **does** heal |
| W20-14 | Cadence Sext vs Quint vs Quad vs Tern vs Cap vs Floor vs Rise vs Prime vs Stall vs Snuff vs Dock vs Tierce vs Quarte | Remaining `n>6` → 6 vs `n>5` → 5 vs `n>4` → 4 vs `n>3` → 3 vs `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 vs `n===2` → 0 vs `n===3` → 0 vs `n===4` → 0 |
| W20-15 | Trip Toll while Chebyshev ≥ 2 from tripwire | Fizzle observes. Brick Tax would tax a walk if adjacent **barrier**. Even Toll would tax leftover **AP even ≥ 2**. Odd Toll would tax leftover **AP odd**. Gait Toll would tax leftover **MP = 0**. Prime Toll would tax leftover **1/1** |
| W20-16 | Brick Split with no adjacent barrier | Fizzle observes; leftover MP unchanged. Watch Root would zero leftover MP with no adjacency. Watch Shave would snap −1 leftover MP. Brick Levy would tax the next walk +1 MP |
| W20-17 | Watch Clip vs Shave vs Bind vs Tax vs Drain vs Root vs Sip vs Far Watch | Snap −1 leftover **AP** (no steal, not `recordChallengeApSpend`) vs snap −1 leftover **MP** vs forbids next **walk** vs taxes next **spell** +1 AP vs steals leftover **MP to caster on cast** vs zeros leftover **MP on cast** vs steals AP vs deals damage |
| W20-18 | Pair Plate then leftover 1/0, 3/0, or 2/1 | Full hit; charge remains. Thin Plate would want leftover 1/0. Dry Plate would negate leftover MP=0 at **any** AP including 3/0. Pair Gait would bonus leftover 2/0 as **damage** |
| W20-19 | Trip Cut far from tripwire / on a Twin Gate pad / next to glyph-tax only / next to lava only | 10 only. Glyph Cut would want glyph-tax occupancy. Slide Cut would want conveyor occupancy. Lava Cut would want lava occupancy. Trip Reel would pull |
| W20-20 | Giraffe Gate then Frost at Chebyshev 11, (3,2), or adjacent | Confirm fails; Strike still legal. Undeca Oath would want Chebyshev 11. Giraffe Bite would deal bonus on (4,1) without gating other dests |
| W20-21 | Pack Giraffe / Giraffe Fold | Never in `ownedSpellIds` |
| W20-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 / #1006 / **#1056** / **#1121** / **#1195** / **#1249** ENC-* / **#1064** / **#1114** / **#1172** / **#1235** WF-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W20-23 | G=19 Tide | No Giraffe Stride / Trip Toll (`generationMin: 20`) |
| W20-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W20-25 | No cloned ids | Unique §11 ids absent from #906 / #953 / #962 / #1011 / **#1017** / **#1063** / **#1082** / **#1132** / **#1143** / **#1177** / **#1198** / **#1251** catalogs |
| W20-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Trip Toll / Summon Giraffe / Pack Giraffe / Watch Clip / Brick Split are flags |
| W20-27 | Hex Toll | Still not in any SDE pool |
| W20-28 | Memory Wave-5 / Wave-19 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W20-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W20-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W20-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` / `mire_nave` not restamped |
| W20-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `giraffe_precentor` / `giraffe_fold_regent` not #899 ids |
| W20-30n | #1017 rooms / doors | `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent` not restamped |
| W20-30o | #1063 tactical ids | Unique §11 does not clone Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn |
| W20-30x | #1132 tactical ids | Unique §11 does not clone Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn |
| W20-30ac | #1177 tactical ids | Unique §11 does not clone Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn. Cadence Sext is `n>6` → 6, not `4→0`. Deep Gift is leftover 1/≥2, not both-body sum===7. Undeca Oath is exact-11 spell gate, not occupy-weight 14. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` not restamped |
| W20-30ad | #1189 family ids | Unique §11 not CORE on `sestet_mender` … `strike_plater`. `giraffe_precentor` is not `sestet_mender` / `gait_gifter`. `giraffe_fold_regent` is not `court_tierce_regent` |
| W20-30ae | #1170 extra doors | `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` not restamped. `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` never owned. `trim_precentor` is not remapped |
| W20-30af | #1195 ENC-* | `ENC-TEACH-19` / `ENC-SPELL-37` / `ENC-SCORE-01` / `ENC-FILE-02` / `ENC-LAVA-01` / `ENC-READY-01` / `ENC-RUSH-71`…`74` not consumed as unique §11 grants |
| W20-30ag | #1172 WF-* | `WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT` never write `ownedSpellIds`. `WF-SPL-MATCH_TUTOR` is not a grant |
| W20-30ah | #1187 SDA files | `ACTION_IDS_SDA_2026-10-27.md` / `SPELL_ADMIN_DESIGN_2026-10-27.md` not overwritten. SDA-205…219 not re-filed |
| W20-30ai | #1176 FSN drop 19 | Formation clear is not a grant |
| W20-30aj | #1163 / **#1218** EBA / #1183 / **#1236** WDEAD / #1186 / **#1254** MTD / #1192 / **#1240** AEE / #1175 / **#1246** PX / #1167 / **#1222** CDA | Unique EBA/WDEAD files. Zero extra doors. Rush Table S is **#1244**. Do not restack `MASTER_ROADMAP.md`. CDA-031 had not opened (**#1069** is 2026-10-25, not #1222) |
| W20-30al | **#1244** extra doors | `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan` not restamped. `CHOIR_SIP` / `CHOIR_HALVE` / `NAVE_ODD` / `NAVE_SILL` never owned. `gait_cantor` / `halve_precentor` / `trim_precentor` not remapped |
| W20-30am | **#1248** family ids | Unique §11 not CORE on `septet_mender` … `idle_plater`. `giraffe_precentor` is not `hook_warder` / `wide_gifter`. `giraffe_fold_regent` is not `court_quarte_regent` |
| W20-30an | **#1251** tactical ids | Unique §11 does not clone Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn. Cadence Sext is `n>6` → 6, not `5→0`. Deep Gift is leftover 1/≥2, not both-body sum===8 unequal. Undeca Oath is exact-11 spell gate, not occupy-weight 15. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` not restamped |
| W20-30ao | **#1249** ENC-* | `ENC-TEACH-20` / `ENC-SPELL-39` / `ENC-SPELL-40` / `ENC-RUSH-75`…`78` not consumed as unique §11 grants. Teach Stave Mend / Ring Stride, not Giraffe Stride |
| W20-30ap | **#1235** WF-* | `WF-HAZ-POISE_SEAM` … `WF-ENV-POISE_DRAFT` never write `ownedSpellIds`. `WF-SPL-POISE_TUTOR` is not a grant. Do not restack `WORLD_DYNAMICS.md` / `worldFeatures.ts` |
| W20-30aq | **#1226** SDA files | `ACTION_IDS_SDA_2026-10-28.md` / `SPELL_ADMIN_DESIGN_2026-10-28.md` not overwritten. SDA-220…234 not re-filed |
| W20-30ar | **#1237** FSN drop 20 | Formation clear is not a grant |
| W20-30ak | #1198 rooms / doors | `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` / `camel_precentor` / `camel_fold_regent` not restamped. Unique §11 does not clone Camel Stride / Cadence Quint / Pack Camel / Camel Fold. `camel_gallery` still teaches Camel Stride, not Giraffe Stride. `deca_nave` still teaches Deca Oath, not Undeca Oath. `cipher_aisle` still teaches Glyph Reel, not Trip Reel. `hollow_pulpit` still teaches Hollow Mark, not Skew Mark. `fuse_nave` still teaches Fuse Skip, not Trip Skip |
| W20-30u | #1143 rooms / doors | `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent` not restamped. Unique §11 does not clone Hook Stride / Cadence Quad / Pack Hook / Hook Fold |
| W20-30t | #1082 rooms / doors | `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent` not restamped |
| W20-31 | `spell-even-plate` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-deca-span` / `spell-undeca-span` / `spell-camel-line` / `spell-hook-line` / `spell-giraffe-line` / `spell-septet-gift` / `spell-octave-gift` / `spell-skew-gift` / `spell-alfil-stride` / `spell-fifteen-span` / `spell-cadence-cinque` / `spell-duet-turn` | Still tombstoned. Deep Plate is the AP===1/MP≥2 negate, not `even-plate`. Undeca Oath is the exact-11 spell gate, not occupy-weight 11 and not occupy-weight 15. Giraffe Stride is a walk constraint, not Hook Line. Deep Gift is leftover 1/≥2, not both-body sum===7 and not both-body sum===8 |
| W20-32 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–19, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, **#1011**, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, **#1177**, **#1198**, or **#1251** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** / **#1244** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Consuming #771 / #826 / #885 / **#957** / **#1006** / **#1056** / **#1121** / **#1195** / **#1249** ENC-* as spell grants
- Consuming **#1114** Wave-18 `WF-*`, **#1172** Wave-19 `WF-*`, or **#1235** Wave-20 `WF-*` as spell grants
- Restacking **#1235** `WORLD_DYNAMICS.md` / `worldFeatures.ts`
- Overwriting **#1187** / **#1226** SDA / **#1189** / **#1248** family / **#1176** / **#1237** FSN / **#1198** SDE dated files
- Restacking **#1254** `MASTER_ROADMAP.md`

---

## 17. Wave-20 index

**Unique SDE ids (19):** giraffe-stride, undeca-oath, trip-reel, giraffe-bite, skew-mark, deep-plate, trip-skip, pair-gait, summon-giraffe, deep-gift, cadence-sext, trip-toll, brick-split, watch-clip, pair-plate, trip-cut, giraffe-gate, pack-giraffe, giraffe-fold.

**#1143 stamps (do not clone; Wave-20 family CORE):** Hook Stride, Nona Oath, Slide Reel, Hook Bite, Idle Mark, Thin Plate, Brier Skip, Wide Sting, Summon Hook, Wide Gift, Cadence Quad, Even Toll, Brick Fee, Watch Bind, Prime Gait, Slide Cut, Idle Plate, Pack Hook, Hook Fold.

**#1177 stamps (do not clone; Wave-20 family CORE):** Septet Mend, Cadence Quarte, Tetradeca Span, Feud Turn, Septet Hood, Septet Sting, Septet Step, Septet Sill, Septet Hold, Septet Lend, Septet Sip, Septet Post, Septet Bounce, Must Septet, Verse Septet, Court Quarte. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`.

**#1198 stamps (do not clone; extras until Wave 21):** Camel Stride, Deca Oath, Glyph Reel, Camel Bite, Hollow Mark, Wide Plate, Fuse Skip, Hollow Sting, Summon Camel, Thin Gift, Cadence Quint, Prime Toll, Brick Levy, Watch Shave, Lean Gait, Glyph Cut, Fresh Plate, Pack Camel, Camel Fold.

**#1251 stamps (do not clone; Wave-21 family CORE):** Octave Mend, Cadence Quinte, Pentadeca Span, Kin Turn, Octave Hood, Octave Sting, Octave Step, Octave Sill, Octave Hold, Octave Lend, Octave Sip, Octave Post, Octave Bounce, Must Octave, Verse Octave, Court Quinte. Extra doors `octave_cantor` / `quinte_precentor` / `span_pentadeca` / `court_quinte_regent` (Wave 22 sheets).

**#1248 stamps (do not restamp):** `septet_mender` … `idle_plater`.

**#1244 stamps (do not restamp):** `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-giraffe-stride` | ENEMY_DISCOVERY | yes | blink_cutter / rank_lancer G≥20 | One next walk (4,1) |
| `spell-undeca-oath` | ENEMY_DISCOVERY | yes | glass_sniper / pale_cantor | Next spell Chebyshev = 11 |
| `spell-trip-reel` | ENEMY_DISCOVERY | yes | plague_rat / glyph_sower | Pull 1 toward tripwire |
| `spell-giraffe-bite` | ENEMY_DISCOVERY | yes | blink_cutter / shadow_lurker | Bonus if share (4,1) |
| `spell-skew-mark` | ENEMY_DISCOVERY | yes | glyph_sower / bone_scribe | Turn-end detonate at leftover AP−MP===2 |
| `spell-deep-plate` | ENEMY_DISCOVERY | yes | plate_warden / iron_golem | Negate if leftover AP===1/MP≥2 |
| `spell-trip-skip` | ENEMY_DISCOVERY | yes | tide_shade / plague_rat | PathLength 2 onto tripwire no trigger |
| `spell-pair-gait` | ENEMY_DISCOVERY | yes | bone_scribe / purse_scribe | Bonus if leftover 2/0 |
| `spell-summon-giraffe` | ELITE | yes | brood_chanter | Pets pay AP to land (4,1) |
| `spell-deep-gift` | ELITE | yes | pale_cantor / font_cantor | Heal iff leftover AP===1/MP≥2 |
| `spell-cadence-sext` | ENEMY_DISCOVERY | yes | cadence_thief / hex_chorister | Remaining n>6 → 6 |
| `spell-trip-toll` | ENEMY_DISCOVERY | yes | tax_scribe / ley_tollkeeper | Next walk +1 AP near tripwire |
| `spell-brick-split` | ENEMY_DISCOVERY | yes | stone_castellan / rime_mason | Halve leftover MP if adjacent barrier |
| `spell-watch-clip` | ELITE | yes | glass_sniper / hood_lurker | Overwatch snap −1 leftover AP |
| `spell-pair-plate` | ELITE | yes | brood_chanter / plate_warden | Negate if leftover 2/0 |
| `spell-trip-cut` | ELITE | yes | glyph_sower / plague_rat | Bonus if near tripwire |
| `spell-giraffe-gate` | ENEMY_DISCOVERY | yes | glass_sniper / blink_cutter | Next spell only if target is (4,1) |
| `spell-pack-giraffe` | ENEMY_ONLY | no | giraffe_precentor CHAMPION | Pack walks locked to (4,1) |
| `spell-giraffe-fold` | BOSS_ONLY | no | giraffe_fold_regent | Fold two player-side bodies sharing (4,1) |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-19 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #1177 so Septet Mend / Cadence Quarte / Tetradeca Span land once as Wave-20 family CORE. Coordinate with #1143 so Hook Stride / Cadence Quad land once as Wave-20 family CORE. Coordinate with #1248 so those Wave-20 families name **#1143**+**#1177** once. Coordinate with #1198 so Camel Stride stays extras until Wave 21. Coordinate with #1251 so Octave Mend / Cadence Quinte / Pentadeca Span / Kin Turn land once as Wave-21 family CORE. Not a license to land combat code in the same change as this spec.
