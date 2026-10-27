# Dynamic Spell Discovery & Enemy Spell Evolution — Wave 19

**Author:** Dynamic Spell Discovery and Enemy Spell Evolution Designer  
**Automation:** `c26e5a83-a492-11f1-a7d1-d6b4613131ce`  
**Date:** 2026-10-27  
**Status:** PROPOSED — design only. **No production code in this change.**  
**HEAD audited:** `0f5363f` (`Merge pull request #332` — report-findings orchestration)

Stralt has **no character level cap**. Wave 1 ([`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md), PR #156) is the **product law** for observe → win → unlock. Waves 2–18 are generation stamps (`generationMin`). This document does **not** replace any of them. It is Generation 19: one next walk permutation of **(3,2)**, exact-10 spell gate, glyph-tax pull, leftover 0/0 and 1/0 and AP≥2/MP≥1 windows that earlier waves left open on a **different axis**, and `generationMin: 19` family attachments.

ACTION_IDs: [`ACTION_IDS_SDE_2026-10-27.md`](./ACTION_IDS_SDE_2026-10-27.md).

**Do not implement production code from this PR.**

---

## 0. Sibling designs (do not duplicate)

| Sibling | Path / PR | Owns |
| :--- | :--- | :--- |
| Wave-1 discovery contract | #156 — `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | State machine, innate four, persist writers, UX copy, Wave-1 cards |
| Wave-2…18 discovery contracts | #226 / #300 / #371 / memory Wave 5 / #480 / #533 / #590 / #646 / #679 / #747 / #802 / #837 / #906 / #962 / #1017 / **#1082** / **#1143** | `generationMin` 2…18, unique catalogs, specials |
| Wave-1…18 ACTION_IDs | `ACTION_IDS_SDE_2026-08-31.md` … `ACTION_IDS_SDE_2026-10-26.md` | Ownership split, observe hook, victory commit, G slots — **still blocking, still NEW** |
| Spell admin | #116 / #187 / **#1078** (SDA-175…189) / **#1140** (SDA-190…204) / **#1187** (SDA-205…219) | `ownedSpellIds` / `observedSpellIds`, soft-retire. Do not overwrite those files |
| Tactical gap-fillers | #120 / #185 / #282 / #342 / #411 / #463 / #525 / #563 / #636 / #695 / #726 / #787 / #849 / #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** | Stamp, do not clone. **#1132** is Wave **19** family CORE. **#1177** is Wave **20** family CORE |
| Family sheets | through **#1138** (`stave_mender` … `cast_plater`) / **#1189** (`sestet_mender` … `strike_plater`) | Wave-18 CORE / Wave-19 CORE. Do not put unique §11 there |
| Boss extras | through **#1139** (`stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`) / **#1170** (`trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`) | Rush Table Q / Table R. Do not restamp |
| Encounter rooms | **#1121** Tally/Rank/Spike/Odd / **#1195** Score/File/Lava/Ready | Teach **#997** / **#1073** verbs, not unique §11 |
| World dynamics | **#1114** Wave-18 `WF-*` / **#1172** Wave-19 `WF-*-MATCH_*` | `WF-SPL-READY_TUTOR` / `WF-SPL-MATCH_TUTOR` never write `ownedSpellIds` |
| PX coherence | **#1175** `PX_COHERENCE_AUDIT_2026-10-27.md` | MP is the **walk** resource; `CharacterStats.evasion` is persist-only |
| Formations | **#1176** drop 19 (`ENEMY_FORMATIONS_2026-10-27.md`) | Wave-18 packs. Clearing a formation is not a grant |
| Enemy/boss admin | **#1163** EBA 2026-10-27 | Zero extra doors. No new EBA IDs |
| World/dungeon admin | **#1183** WDEAD 2026-10-27 | Occupancy/remount rails, not grants |
| Master roadmap | **#1186** MTD 2026-10-27 | Not a tactical catalog |
| AI increment | **#1192** AEE 2026-10-27 | Inspector lists modules by id. Missing hint → drop |
| Content diversity | **#1167** 2026-10-27 | Not CDA-031. CDA-031 had **not** opened at this stamp |
| Long horizon | **#1197** 2026-10-27 | Sim only. Not a spell catalog |

**Id collision rule:** do not reuse any id in §0.1. Wave-19 ids in §11 are new.

### 0.1 Reserved tombstone (never re-propose)

Prior unique SDE catalogs (Waves 1–18, memory Wave 5) and tactical catalogs (#120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #849, #890, #953, #1011, #1063, **#1132**, **#1177**) remain reserved in those contracts. This wave adds:

**#1143 Wave 18 SDE (never re-propose):** `spell-hook-stride`, `spell-nona-oath`, `spell-slide-reel`, `spell-hook-bite`, `spell-idle-mark`, `spell-thin-plate`, `spell-brier-skip`, `spell-wide-sting`, `spell-summon-hook`, `spell-wide-gift`, `spell-cadence-quad`, `spell-even-toll`, `spell-brick-fee`, `spell-watch-bind`, `spell-prime-gait`, `spell-slide-cut`, `spell-idle-plate`, `spell-pack-hook`, `spell-hook-fold`.

**#1082 Wave 17 SDE (stamp as Wave 19 family CORE, do not clone):** `spell-tern-stride`, `spell-octa-oath`, `spell-mire-reel`, `spell-diag-bite`, `spell-summon-mark`, `spell-prime-plate`, `spell-slide-skip`, `spell-capped-sting`, `spell-summon-orth`, `spell-gait-gift`, `spell-cadence-tern`, `spell-odd-toll`, `spell-brick-tax`, `spell-watch-tax`, `spell-thin-gait`, `spell-lava-cut`, `spell-strike-plate`, `spell-pack-ring`, `spell-lane-fold`.

**#1132 tactical Wave 18 — stamp as Wave 19 family CORE, do not clone:** `spell-sestet-mend`, `spell-cadence-tierce`, `spell-trideca-span`, `spell-psalm-turn`, `spell-sestet-hood`, `spell-sestet-sting`, `spell-sestet-step`, `spell-sestet-sill`, `spell-sestet-hold`, `spell-sestet-lend`, `spell-sestet-sip`, `spell-sestet-post`, `spell-sestet-bounce`, `spell-must-sestet`, `spell-verse-sestet`, `spell-court-tierce`. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` — do not restamp.

**#1177 tactical Wave 19 — stamp as Wave 20 family CORE, do not clone:** `spell-septet-mend`, `spell-cadence-quarte`, `spell-tetradeca-span`, `spell-feud-turn`, `spell-septet-hood`, `spell-septet-sting`, `spell-septet-step`, `spell-septet-sill`, `spell-septet-hold`, `spell-septet-lend`, `spell-septet-sip`, `spell-septet-post`, `spell-septet-bounce`, `spell-must-septet`, `spell-verse-septet`, `spell-court-quarte`. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` — do not restamp.

**Memory Wave 5 (still no GitHub PR — still tombstoned):** `spell-gaze-sill`, `spell-close-debt`, `spell-near-veil`, `spell-soft-step`, `spell-twice-mark`, `spell-rebound-ward`, `spell-cull-kennel`, `spell-whelp-sill`, `spell-ash-sill`, `spell-spent-lens`, `spell-wait-fang`, `spell-share-gaze`, `spell-body-glass`, `spell-last-stride`, `spell-post-hex`, `spell-turn-sill`, `spell-pack-cover`, `spell-false-gaze`, `spell-void-span`.

**Do not alias** Camel Stride ↔ Hook Stride ↔ Tern Stride ↔ Knight Stride ↔ Ring Stride; Deca Oath ↔ Nona Oath ↔ `span_dec` ↔ Tetradeca Span; Glyph Reel ↔ Slide Reel ↔ Brick Reel; Hollow Mark ↔ Idle Mark ↔ Last Mark; Wide Plate ↔ Thin Plate ↔ Wide Sting ↔ Wide Gift ↔ Septet Hood; Fuse Skip ↔ Brier Skip ↔ Slide Skip; Thin Gift ↔ Thin Gait ↔ Septet Mend; Cadence Quint ↔ Cadence Quad ↔ Cadence Tierce ↔ Cadence Quarte; Pack Camel ↔ Pack Hook; Camel Fold ↔ Hook Fold; Fresh Plate ↔ Idle Plate ↔ Fresh Sting; Feud Turn ↔ Psalm Turn ↔ Duel Turn. Those are sibling-owned fantasies.

**Do not mint:** `spell-camel-line`, `spell-alfil-stride`, `spell-fourteen-span`, `spell-deca-span`, `spell-nona-span`, `spell-thirteen-span`, `spell-sestet-gift`, `spell-quint-mend`, `spell-cadence-cinque`, `spell-cadence-fifth`, `spell-cadence-trey`, `spell-thin-sting`, `spell-wide-gait`, `spell-even-plate`, `spell-hook-line`, `spell-parched-mend`, `spell-score-gift`, `spell-stave-gift`, `spell-mixed-turn`, `spell-septet-gift`, `spell-cadence-quatro`. Stamp **#1177** `spell-septet-mend` / `spell-cadence-quarte` / `spell-tetradeca-span` / `spell-feud-turn`; do not clone.

### 0.2 Same-day / queued hole ownership (stamp, do not clone)

**#1132 owns** the G≥18 leftover-sum===6 / CD `3→0` / thirteen-occupy / mixed-side invert holes. This catalog’s unique §11 ids stay this document’s. Wave-19 family CORE is unique **#1082** Wave-17 verbs **plus** **#1132** (except Court Tierce; Sestet Mend is healer CORE only). Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` — do not restamp.

**SDE wins** unique leftover collisions:

| Unique §11 | Window | Not a clone of |
| :--- | :--- | :--- |
| Thin Gift | leftover **AP === 1 AND MP === 0** heal | Thin Gait (same window, **damage**); Wide Gift (AP≥2/MP≥1 heal); Gait Gift (AP≥2/MP=0 heal); **#1177** Septet Mend (both-body leftover **sum === 7**) |
| Cadence Quint | remaining `n>5` → **5** | Cadence Quad (`n>4`→4); Cadence Tierce (`3→0`); Cadence Tern (`n>3`→3); **#1177** Cadence Quarte (`n===4`→0) |
| Wide Plate | leftover **AP ≥ 2 AND MP ≥ 1** negate | Wide Sting (same window, **damage**); Wide Gift (heal); Thin Plate (1/0 negate); Sestet Hood (sum===6 unequal miss); **#1177** Septet Hood (sum===7 miss) |
| Hollow Mark | turn-end leftover **AP === 0 AND MP === 0** detonate | Idle Mark (leftover **MP equals max**); Last Mark (last leftover **AP**); Dwell Mark (any end-turn occupy); Gaunt Post (tactical 0/0 post); **#1177** Septet Post (sum===7 occupy detonate) |
| Fresh Plate | leftover **AP equals max** negate | Idle Plate (leftover **MP equals max**); Fresh Sting (same window, **damage**) |

`sestet_cantor` is **not** Thin Gift’s door. `tierce_precentor` is **not** Cadence Quint’s door. `span_trideca` is **not** Camel Fold’s door. `court_tierce_regent` is **not** `camel_fold_regent`. `septet_cantor` is **not** Thin Gift’s door. `quarte_precentor` is **not** Cadence Quint’s door. `span_tetradeca` is **not** Deca Oath’s door. `court_quarte_regent` is **not** `camel_fold_regent`. Do not name unique §11 families `sestet_mender` / `cadence_tiercer` / `trideca_prelate` / `psalm_turner` / `stave_mender` / `cadence_docker` / `dodeca_prelate` / `hymn_turner` / `septet_mender` / `cadence_quarter` / `tetradeca_prelate` / `feud_turner` (#1189 / #1138 / #1073 / #997 / #941 own those slots).

Same-day 2026-10-27 catalogs **did** open after the 00:04 UTC cron. Stamp, do not clone unique §11:

- **#1177** Wave-19 tactical (`SPELL_PROPOSALS_2026-10-27.md`) is Wave **20** family CORE. Septet Mend is both-body leftover **sum === 7**. Cadence Quarte is remaining `n===4` → `0`. Tetradeca Span is fourteen occupy (axis-aligned **2×7**). Feud Turn is leftover invert on **caster + one hostile**. Court Quarte never owned.
- **#1189** Wave-19 families (`sestet_mender` … `strike_plater`) consume **#1082** unique CORE (minus Pack Ring / Lane Fold) **plus** **#1132** (minus Court Tierce). Do not restamp those `ENEMY_ID`s. Unique Wave-18 §11 stay extras until Wave 20. Unique §11 stay extras until Wave 21.
- **#1170** Wave-20 extra doors `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` (leftover #695 Cadence Trim / Near Hood + leftover #726 Ready Sting + leftover #787 Lean Sting). `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`. Do **not** remap `trim_precentor`. Rush **Table R**. No new `#137` ids.
- **#1195** ENC-TEACH-19 … ENC-RUSH-74 (Score/File/Lava/Ready). Teach **#1073** verbs, not unique §11.
- **#1172** Wave-19 `WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT` (WDD-2026-10-27-001). `WF-SPL-MATCH_TUTOR` never writes `ownedSpellIds`. Do not restack `WORLD_DYNAMICS.md` / `worldFeatures.ts`.
- **#1187** SDA-205…219 unique files. Do not overwrite.
- **#1163** EBA / **#1183** WDEAD / **#1186** MTD / **#1192** AEE / **#1176** FSN drop 19 / **#1175** PX / **#1167** content diversity / **#1197** long-horizon sim — stamp; not spell catalogs. CDA-031 had **not** opened at this stamp.

---

## 1. Why discovery is still inert (re-audit `origin/main` @ `0f5363f`)

Twenty-eight calendar days after Wave 12, and one day after Wave 18, did not add a spell id, did not split `isBaseSpell`, and did not debit `spell.mpCost`. The live HEAD is still **`0f5363f`**. WX is still **19,213** lines (`wc -l`). The defects did not shrink.

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
| `inferArchetype` still treats any `healAmount > 0` as healer | `enemyAI.ts` 447–452 | Drain kits become healers. Thin Gift / Wide Gift / Score Mend **must not** land in non-healer CORE |
| Summon archetype still falls back to **name** | `enemyAI.ts` 217–224 (`wolf` / `golem` / `wisp`) | Forbidden for new ids |
| `computeAITier` still plateaus at label 10 after level 900 + 30% noise | `combatMath.ts` 36–52 | Soft band, **not** a content cap |
| `pickEnemyLevelFromTiers` still clamps `maxTier = floor(999 / ts)` | `combatMath.ts` 54–58 | Spawn safety rail, **not** a last generation |
| `executeCastAttempt` gates **AP only** | WX 17096–17207 | Ley Toll / Undertow / Sanguine Toll are illegal to ship until MP debit exists |
| Every frontend `mpCost` is `0` | `spellData.ts` (all 32 rows) | Wave-19 unique ids stay `mpCost: 0`. Prime Toll / Summon Camel / Pack Camel / Watch Shave / Brick Levy are flags, not `spell.mpCost` |
| `areaShape` is unread | `targeting.ts` 690–727; area expand is Chebyshev `areaRadius` | Unused this wave |
| `applyPushback` / `applyAttract` have no cast callers | `occupancy.ts` 482 / 537 | Glyph Reel is attract-toward-**nearest painted glyph-tax occupancy**, a new dest flavor after Slide Reel (conveyor), Mire Reel, Lava Reel, Rime Reel, Spike Reel, Pit Reel, Cinder Reel, Void Reel, and Brick Reel (barrier) |
| `Enemy.currentView` unread in combat | Field `gameTypes.ts` 297; overworld wander writer WX 6924–6938 | Face Away / Oncoming / Glance Cut / About Face / Shove Face **fail closed**. **No new Wave-19 facing cards** |
| `CharacterStats.evasion` unused in combat | persist field `gameTypes.ts` 64 | Sidestep / Surplus remain `evadeNextHits`, not a miss % |
| Live hazard types | `gameTypes.ts` 437 `HazardTileType` = `lava` \| `ice` \| `spikes` | Glyph Cut keys off **painted glyph-tax**, never a new `HazardTileType`. Thorned Ground (`mapModifiers.ts` 175–186) is a **map-modifier pathLength tax**, not occupancy. Fuse Skip keys off **painted fuse** occupancy and pathLength **1** |
| Open PR queue | #327+, then 2026-09-21…29 docs, then 2026-10-21…27 docs. **#371 owns Wave-4 SDE. #906 owns Wave-14 SDE. #962 owns Wave-15 SDE. #1017 owns Wave-16 SDE. #1082 owns Wave-17 SDE. #1143 owns Wave-18 SDE. #953 owns Wave-15 tactical. #1011 owns Wave-16 tactical. #1063 owns Wave-17 tactical (Wave 18 family CORE). #1132 owns Wave-18 tactical (Wave 19 family CORE). #1177 owns Wave-19 tactical (Wave 20 family CORE). #941 owns Wave-15 families. #997 owns Wave-16 families. #1073 owns Wave-17 families. #1138 owns Wave-18 families. #1189 owns Wave-19 families. #951 owns Wave-16 extra boss doors. #1004 owns Wave-17 extra boss doors. #1080 owns Wave-18 extra boss doors. #1139 owns Wave-19 extra boss doors. #1170 owns Wave-20 extra boss doors / Table R. #1078 owns SDA-175…189. #1140 owns SDA-190…204. #1187 owns SDA-205…219. #982 owns CDA-030. #1056 owns prior ENC-*. #1121 owns Tally/Rank/Spike/Odd ENC-*. #1195 owns Score/File/Lava/Ready ENC-*. #1064 owns Wave-17 WF-*. #1114 owns Wave-18 WF-*. #1172 owns Wave-19 WF-*. #1111 / #1163 own EBA (zero extra doors). #1128 / #1183 own WDEAD. #1176 owns FSN drop 19. #1192 owns AEE. #1186 owns MTD. #1175 owns PX.** | This change adds two new dated files only |

Quality audit still marks discovery pacing `NO_MEASURABLE_EFFECT`. Wave-1 P0 through Wave-18 P0 remain the prerequisite. **Do not land Wave-19 data before the ownership split and G resolve.**

**Do not unlock because the encounter started.**  
**Do not require the player to be hit.** Hostile **use** (WX-applied `kind === "cast"` that spent AP) is sufficient observation.

---

## 2. Design principles (unchanged law)

Wave 1 §2 still applies in full. Restated only where Wave 19 adds a clause:

1. **Id is identity.** Observation, kits, AI, and grants key off `spell.id` only.
2. **Catalog ≠ ownership.**
3. **Use → observe → win → unlock** is the default `ENEMY_DISCOVERY` path. Same-encounter victory. `allowLaterVictory` defaults **false**.
4. **Tactical patience** is a real decision. G≥19 rares make it sharper: a CHAMPION may hold the generation-19 verb until a (3,2) landing / painted glyph-tax cell / leftover-0/0 window is already on the board.
5. **Not every ability is player-learnable.** `ENEMY_ONLY` / `BOSS_ONLY` / `SYSTEM_ONLY` remain closed.
6. **Never assign a spell an AI cannot use.** Missing `aiProfile` / `aiHint` = drop from resolve.
7. **Expand, do not replace.** Wave 19 fills holes Waves 1–18, memory Wave 5, #120, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, and **#1177** left open for this unique catalog (see §10). It does not clone Shield, Quiet Hex, Hook Stride, Tern Stride, Knight Stride, Ring Stride, Pack Hook, Pack Ring, Hook Line, Hook Bite, Slide Reel, Brier Skip, Cadence Quad, Cadence Tierce, Cadence Quarte, Wide Gift, Thin Gait, Thin Plate, Idle Mark, Idle Plate, Fresh Sting, Septet Mend, Tetradeca Span, Feud Turn, or Hex of Silence.
8. **No last tier.** `G = floor(max(0, R) / T)` is unbounded. Wave 19 stamps `generationMin: 19`. When the next designer needs a verb, they stamp `generationMin = currentPublishedMax(family) + 1`.
9. **Backend-authoritative, idempotent.** Same writers as Wave 1 §8. No Doka/XP from the grant. No `upgradeSpell`. No `updateCharacter`.
10. **Single recap.** `NEW SPELL DISCOVERED` on root `PostBattleRecap` only.
11. **Do not touch** RAF, map generation, turn logic, or damage math (`combatMath.ts` RES/SR/CHC/dealDamage). Payload numbers are `SpellConfig.damage` / `effectParams` resolved **before** existing `dealDamage`.
12. **MP is the walk resource.** Catalog default stays `mpCost: 0`. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. **No fourth.** Prime Toll **adds 1 AP** to the next **walk** if leftover AP===1 AND leftover MP===1. Brick Levy **adds 1 MP** to the next **walk** while adjacent to a barrier. Summon Camel taxes **allied summons** 1 AP when the walk landing is a (3,2) from origin. Pack Camel locks **walk dests to (3,2)**. Watch Shave **subtracts 1 leftover MP** from the walker on overwatch snap (does not grant to the caster). None of those is `spell.mpCost`.
13. **Evasion persist field stays unread.** Do not teach Enemy Register “evasion %.” Do not add a miss roll to `combatMath.ts`.
14. **Loaner orbs / `WF-SPL-*` never write `ownedSpellIds`.**

Innate seed is still **four ids only:** `physical_attack`, `starter-shield`, `starter-poison`, `starter-heal`.

---

## 3. Discovery state machine (unchanged; Wave-19 edges)

Wave 1 §3. Default path:

1. Enemy possesses an eligible player-learnable id.
2. Enemy **uses** it (`kind === "cast"` and AP spent).
3. Id becomes `OBSERVED` for this encounter (and persist-observed if the writer exists).
4. Player **wins the same encounter**.
5. Id becomes permanently unlocked in the Spell Library.

Wave-19 edges (additive):

| Event | Observes? |
| :--- | :--- |
| Encounter start, kit preview, telegraph | **No** |
| `spell-camel-stride` **armed** (AP spent) | **Yes** — the technique was used |
| Camel Stride later walk confirm-fail (orthogonal / (3,1) / knight / diagonal dest) | Already observed on the arm |
| `spell-hollow-mark` **paint** | **Yes** — paint is the use |
| Hollow Mark later turn-end detonate | **No second observe** |
| `spell-wide-plate` **armed** | **Yes** |
| Wide Plate later negated hit | **No second observe** |
| `spell-glyph-reel` AP spent, no painted glyph-tax in radius | **Yes** — fizzle after AP |
| `spell-thin-gift` AP spent, leftover not 1/0 | **Yes** — fizzle after AP |
| `spell-prime-toll` AP spent, leftover not 1/1 | **Yes** — fizzle after AP |
| `spell-fuse-skip` **armed** | **Yes** |
| Fuse Skip later ignored fuse detonate | **No second observe** |
| Illegal confirm (no AP) | **No** |
| `spell-pack-camel` aura ticking without a cast | **No** — no AP spend, and `ENEMY_ONLY` anyway |
| `spell-camel-fold` | **No persist** — `BOSS_ONLY`; optional dim `UNKNOWN TECHNIQUE` log |
| Player-controlled summon casts | **No** |
| Defeat after observe | Observed may persist; **not** granted |

In-battle cue: `TECHNIQUE OBSERVED` (non-blocking, carved-stone / crimson).  
Victory recap: `NEW SPELL DISCOVERED` with name, role, AP, range, target type, key effect, source enemy.

---

## 4. Acquisition sources

| Source | Wave-19 use |
| :--- | :--- |
| `ENEMY_DISCOVERY` | Unique G≥19 family verbs in §11 **plus** #1082 / #1132 stamps in §0.2 / §12 |
| `ACHIEVEMENT` | **None.** All 15 feat doors claimed or leftover. Never `unstoppable` / `level_10` |
| `CHALLENGE` | **None.** All nine challenge ids claimed through Wave 7 |
| `BOSS` | Camel Fold is `BOSS_ONLY` (not a grant). No new boss-grant MULTI this wave. Court Tierce stays `NOT_PLAYER_LEARNABLE` on `court_tierce_regent`. Court Quarte stays kit-only on `court_quarte_regent` |
| `ELITE` | Summon Camel, Thin Gift, Watch Shave, Glyph Cut, Fresh Plate. **#1132** Sestet Hood / Sestet Hold / Must Sestet stamp as Wave 19 CORE, not unique §11. **#1177** Septet Hood / Septet Hold / Must Septet stamp as Wave 20 CORE |
| `SPECIAL_ENCOUNTER` | `camel_gallery` / `deca_nave` / `cipher_aisle` / `hollow_pulpit` / `fuse_nave` teach via observe+win (not extra grants) |
| `MULTI_SOURCE` | Stamp #1132 Sestet Mend / Cadence Tierce / Trideca Span as Wave 19 CORE. Stamp #1082 unique Wave-17 verbs as Wave 19 CORE. Stamp #1177 Septet Mend / Cadence Quarte / Tetradeca Span as Wave 20 CORE. Unique §11 are not MULTI this wave |

### 4.1 Claimed doors (do not restamp)

Feat doors remain claimed as in Wave 18 §4.1. `survivor` leftover (Last Ember / Last Ward). `jackpot` is Absolve. `leader_slayer` is Crown Cut. `spell_master` is Full Bar.

Challenge doors remain claimed through Wave 7 (`easy_1` Bloodless Plate, `hard_1` Thin Ward, `legendary_1` Clean Blood, …).

Boss extra doors through **#951**: `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. **#1004**: `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary`. **#1080**: `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. **#1139**: `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`. **#1170**: `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` (`CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` stay `BOSS_ONLY`; do **not** remap `trim_precentor`). #890 `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent`. #953 `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent`. **#1011**: `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent`. **#1063**: `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent`. **#1132**: `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`. **#1177**: `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`. **#1017**: `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent`. **#1082**: `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent`. **#1143**: `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent`. **#1073** family ids `score_mender` … `summon_plater` — do not restamp. **#1138** family ids `stave_mender` … `cast_plater` — do not restamp. **#1189** family ids `sestet_mender` … `strike_plater` — do not restamp.

---

## 5. Learnable vs closed

| Flag | Wave-19 ids |
| :--- | :--- |
| `PLAYER_LEARNABLE` | Unique §11 except Pack Camel and Camel Fold |
| `ENEMY_ONLY` | `spell-pack-camel` on `camel_precentor` CHAMPION |
| `BOSS_ONLY` | `spell-camel-fold` on `camel_fold_regent` |
| `SYSTEM_ONLY` | None this wave |

`usableByPlayer` / `usableByEnemy` remain **cast gates**, not acquisition.

---

## 6. Spell pool evolution (unbounded G)

Wave 1 §6 five pools and Wave 2 §5 generation stamp stay. Wave 19 adds the **G≥19 extra slot**.

```
G = floor(max(0, R) / T)     // 0, 1, 2, … no maximum
R = enemy.level − player.level
T = current tierSize (default 10)
```

| G | Pool policy (additive) |
| :--- | :--- |
| 0 | CORE only (+ Strike if empty) |
| 1…18 | As Waves 2–18 |
| 19 | One additional ADVANCED ∪ RARE ∪ ELITE slot with `generationMin ≤ 19` |
| 20+ | Same recipe. Add a definition with `generationMin = currentPublishedMax(family) + 1`. **Still the same family.** |

There is **no** `G_max`. Do not delete Wave-1 CORE or Wave-18 G18 verbs to “make room.” Do not require `enemy.level >= N` as a last level.

`currentPublishedMax` after this document is **19** for families listed in §12. It remains a data query, not a constant in combat math.

Kit growth must pass a **number** (`G` or `floor(enemy.level / T)`), not `currentMap.levelZone` (the NaN bug is still live at `WorldExploration.tsx` 11920).

---

## 7. AI compatibility (Wave-19 hints)

Wave 1 §9.1 profiles still required. Until a profile exists, **do not** put its required spells in a live pool. Healer-inference lock unchanged: non-healer CORE must not include `healAmount > 0`.

| `aiHint` | Safe profiles | Predicate (intent) |
| :--- | :--- | :--- |
| `walk_camel_3_2` | flanker, kiter | Next walk dest is a permutation of (3,2); skip if Tern/Hook/Knight dest is the only legal close |
| `next_spell_exact_chebyshev_10` | caster, kiter | Next damaging spell only if Chebyshev to target === 10; skip if 9 (Nona Oath) or 8 (Octa Oath) |
| `attract_toward_nearest_glyph_tax` | caster, controller | A painted glyph-tax cell exists in search radius; dest after attract is floor, not `map.portals` |
| `bonus_if_share_camel_3_2_with_caster` | flanker | Target is a (3,2) from caster; skip if (3,1) (Hook Bite) or (2,1) (Knight Pierce) |
| `detonate_if_turn_end_leftover_ap_and_mp_eq_0` | caster, controller | Paint a cell the occupant will end on at 0/0 leftover; skip if they still hold AP or MP |
| `negate_hit_if_leftover_ap_ge_2_and_mp_ge_1` | guardian, kiter | Caster leftover AP≥2 and MP≥1 at arm; skip if leftover is 1/0 (Thin Plate) or 1/1 (Prime Plate) |
| `skip_fuse_detonate_on_path_length_1` | kiter, flanker | A painted fuse cell sits on a 1-step approach; skip if the needed walk is pathLength ≥ 2 |
| `bonus_if_leftover_ap_eq_0_and_mp_eq_0` | caster, berserker | Caster leftover 0/0; skip if leftover 1/0 (Thin Gait) or AP≥2/MP≥1 (Wide Sting) |
| `summon_walk_camel_3_2_ap_tax` | summoner, guardian | ≥1 living allied summon; skip if none will land (3,2) from origin |
| `heal_if_leftover_ap_eq_1_and_mp_eq_0` | healer, buffer | Target leftover 1/0; skip if leftover 2/0 (Gait Gift) or 1/1 (Prime Gift) |
| `cap_remaining_cds_gt_5_to_5` | buffer, caster | An ally (or self) holds a remaining CD > 5; skip if all remaining ≤ 5 (Quad already capped those >4 to 4 only when Quad is in kit and was used) |
| `tax_next_walk_if_leftover_ap_eq_1_and_mp_eq_1` | caster, controller | Target leftover 1/1; skip if leftover AP even ≥ 2 (Even Toll) or leftover AP odd (Odd Toll) |
| `tax_next_walk_mp_if_adjacent_barrier` | caster, controller | Target is adjacent to a barrier; skip if Brick Tax (walk +1 AP) already covers the same body this turn |
| `overwatch_snap_shave_walker_leftover_mp` | kiter, caster | Arm when the player is likely to walk into band; snap −1 leftover MP, do not steal to caster |
| `bonus_if_leftover_ap_eq_0_and_mp_ge_1` | caster, kiter | Caster leftover AP=0 and MP≥1; skip if leftover 0/0 (Hollow Sting) |
| `bonus_if_near_glyph_tax_occupancy` | caster, flanker | Target Chebyshev ≤ 2 from painted glyph-tax; skip if that cell is a conveyor (Slide Cut) |
| `negate_hit_if_leftover_ap_equals_max` | guardian | Caster leftover AP equals max AP; skip if leftover MP equals max (Idle Plate) |
| `pack_walk_camel_3_2` | buffer | CHAMPION only; skip if aura up |
| `fold_two_player_side_share_camel_3_2` | **boss AI only** | Exactly two living player-side bodies sharing a (3,2); skip if they share (3,1) only (Hook Fold) |

If no listed profile can satisfy the hint, the spell is `ENEMY_ONLY` **or** `usableByEnemy: false`.

---

## 8. Persistence (Wave-1 writers; Wave-19 does not add a second path)

Wave 1 §8 is the persist contract. Wave 19 adds **no** new canister methods.

| Writer | Wave-19 use |
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
- Thin Gift HP gain: `healUsed` only when player-side HP actually increased.
- Brick Levy’s +1 walk MP is **not** `recordChallengeApSpend`.
- Watch Shave’s leftover-MP shave is not incoming damage.
- Fuse Skip does not rewrite lava/spikes challenge paths.

---

## 9. Special encounters (Wave 19)

Tagged world/dungeon rooms. Not level gates. Maps stay solvable (`finalizePlayableLayout`). Rewards still go through `applyRewards`; the **spell** grant is observe+win, never a second wallet. **Do not** implement the `fog_of_war` stub. **Do not** edit `mapGen.ts` algorithms.

| `encounterId` | Composition (intent) | Discoverable |
| :--- | :--- | :--- |
| `camel_gallery` | Blink Cutter on a board with legal (3,2) landings and blocked orthogonal-3 / (3,1) / (2,1) | `spell-camel-stride` via observe+win |
| `deca_nave` | Glass Sniper at Chebyshev 10 down a long file (not 9) | `spell-deca-oath` via observe+win |
| `cipher_aisle` | Glyph Sower with a painted glyph-tax cell the player must respect | `spell-glyph-reel` via observe+win |
| `hollow_pulpit` | Bone Scribe; occupant will end the turn at leftover 0/0 | `spell-hollow-mark` via observe+win |
| `fuse_nave` | Tide Shade beside a painted fuse on a 1-step approach | `spell-fuse-skip` via observe+win |

Wave-18 `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` are not re-specified. `span_dec` stays Dec Span occupy-weight 10, not Deca Oath.

---

## 10. Balance doctrine — holes this wave fills

Waves 1–18 + sibling tactical catalogs already cover: push, pull, blink, root, range buff and cut, absorb, redirect, cleanse, burn tile, hidden trap, AP zone, turret, sacrificial pet, (3,1) next walk, Chebyshev-3 orthogonal next walk, knight walk, Chebyshev-2-not-knight walk, exact-4…9 spell gates, conveyor pull, leftover-MP-equals-max paint, leftover-1/0 negate, Thorned pathLength-2 skip, leftover AP≥2/MP≥1 damage and heal, CD cap `n>4`→4, leftover-AP-even walk tax, barrier-adjacent next-spell tax, overwatch snap that forbids the next walk, leftover-1/1 damage, conveyor-adjacent poke, leftover-MP-equals-max negate, pack (3,1) lock, (3,1) fold, leftover-sum===6 unequal heal, remaining `3→0`, thirteen-cell occupy, mixed-side invert, leftover-sum===7 heal, remaining `4→0`, fourteen-cell occupy (2×7), caster-plus-one-hostile invert.

**Still open (Wave 19 SDE unique ids).** Occupy-weights, leftover-sum===6 family, CD tierce/dock/snuff, and (3,1)/tern/ring walks are siblings’; this table is what Discovery **adds**.

| Hole | Wave-19 id | Why it is not a clone |
| :--- | :--- | :--- |
| One next walk permutation of **(3,2)** | `spell-camel-stride` | Hook Stride is **only** `(3,1)`. Tern Stride is Chebyshev **exactly 3, orthogonal only** `(±3,0)/(0,±3)`. Knight Stride is **only** `(2,1)`. Ring Stride is Chebyshev **exactly 2**, knight excluded. Diag Stride is `\|dx\|==\|dy\|`. Alfil `(2,2)` is Ring ∩ Diag. Hook Line is a **pull toward caster** |
| Next spell illegal unless Chebyshev = 10 | `spell-deca-oath` | Nona Oath is 9. Octa Oath is 8. Dec Span is occupy-weight 10. Long Oath is ≥ 3. Do not mint `spell-deca-span` |
| Pull 1 toward nearest **painted glyph-tax occupancy** | `spell-glyph-reel` | Slide Reel is painted conveyor. Brick Reel is **barrier**. Glyph Tax **is** the paint. Dest is never `map.portals` |
| Bonus if share a **(3,2)** vector | `spell-camel-bite` | Hook Bite is `(3,1)`. Diag Bite is `\|dx\|==\|dy\|`. File Bite is **file only**. Rank Bite is **rank only**. Knight Pierce is a **(2,1)** poke. Camel Stride is a **walk** constraint |
| Cell detonates at occupant **turn end** iff leftover AP **and** leftover MP are **both 0** | `spell-hollow-mark` | Idle Mark detonates iff leftover **MP equals max**. Last Mark is last leftover **AP**. Dwell Mark is **any** end-turn occupy. Wake Mark is **start-of-turn**. They must **spend both leftover pools** for this paint to fire |
| Next hit is 0 while leftover AP **≥ 2 AND** leftover MP **≥ 1** | `spell-wide-plate` | Thin Plate is leftover **1/0**. Prime Plate is leftover **1/1**. Dual Plate is leftover both even ≥ 2. Wide Sting is a **damage bonus** on the same window. Sestet Hood is leftover **sum === 6 unequal** |
| PathLength **1** walk onto a **painted fuse** does not detonate this enter | `spell-fuse-skip` | Brier Skip is Thorned extra + pathLength **2**, not occupancy. Slide Skip is conveyor auto-push. Cinder / Glyph / Rift skips are other taxes. Fuse timer still ticks. PathLength ≥ 2 still detonates |
| Bonus if leftover AP **=== 0 AND** leftover MP **=== 0** | `spell-hollow-sting` | Thin Gait is leftover **1/0**. Wide Sting is leftover AP **≥ 2 AND** MP **≥ 1**. Prime Gait is leftover **1/1**. Fresh Sting is leftover AP **equals max**. Hollow Gift is the **heal** on leftover 0/0. Do not mint `spell-thin-sting` |
| Allied summons pay +1 AP if this turn’s walk **landing** is a **(3,2)** from **origin** | `spell-summon-camel` | Summon Hook taxes **(3,1)**. Summon Orth taxes each **diagonal step**. Summon File taxes walk **off file**. Pack Camel **locks** pack walks to (3,2) (`ENEMY_ONLY`) |
| Heal iff leftover AP **=== 1 AND** leftover MP **=== 0** | `spell-thin-gift` | Thin Gait is the **damage** on the same window. Gait Gift is AP ≥ 2 **and** MP = 0. Lean Gift is AP = 0 **and** MP ≥ 1. Prime Gift is **1/1**. Wide Gift is AP ≥ 2 **and** MP ≥ 1. `healAmount` stays 0 on the row |
| Remaining CDs **n>5 → 5**; 0/1/2/3/4/5 unchanged | `spell-cadence-quint` | Cadence Quad is `n>4` → **4**. Cadence Tern is `n>3` → **3**. Cadence Cap is `n>2` → **2**. Cadence Tierce is `n===3` → 0. Penta Oath is a **spell gate** exactly 5. Do not mint `spell-cadence-cinque` |
| Next **walk** +1 AP if leftover **AP === 1 AND leftover MP === 1** | `spell-prime-toll` | Even Toll is leftover **AP even ≥ 2**. Odd Toll is leftover **AP odd**. Gait Toll is leftover **MP = 0**. Prime Gait is **damage** on leftover 1/1. Prime Gift / Prime Plate own **1/1** as heal / negate |
| Next **walk** +1 **MP** while adjacent to a **barrier** | `spell-brick-levy` | Brick Tax is next **walk +1 AP**. Brick Fee is next **spell +1 AP**. Brick Hold **forbids** the walk. Frozen/Slime is a **map-modifier** walk-MP doubler on every walk, not a unit flag. Not `spell.mpCost` |
| Overwatch snap **−1 leftover MP** on the walker (caster does not gain it) | `spell-watch-shave` | Watch Drain **steals** 1 leftover MP to the caster **on cast**. Watch Root **zeros** leftover MP **on cast**. Watch Bind **forbids** the walker’s next walk. Watch Tax taxes next **spell** +1 AP |
| Bonus if leftover AP **=== 0 AND** leftover MP **≥ 1** | `spell-lean-gait` | Lean Gift is the **heal** on the same window. Hollow Sting is leftover **0/0**. Thin Gait is leftover **1/0**. Wide Sting is leftover AP≥2/MP≥1. Do not mint `spell-lean-sting` |
| Bonus if Chebyshev ≤ 2 from **painted glyph-tax occupancy** | `spell-glyph-cut` | Slide Cut is **conveyor** occupancy. Lava / Rime / Spike Cuts are live hazards. Glyph Reel **pulls**. Portal Cut is **world portals** |
| Next hit is 0 while leftover AP **equals max AP** | `spell-fresh-plate` | Idle Plate is leftover **MP equals max**. Fresh Sting is a **damage bonus** on leftover AP equals max. Dry Plate is leftover **MP = 0**. Cast Plate zeros the next **outgoing non-Strike** |
| Pack walks locked to permutation of **(3,2)** | `spell-pack-camel` | Pack Hook is **(3,1)**. Pack Ring is Chebyshev **exactly 2**, knight excluded. Pack Orth is **orthogonal** (any length). Camel Stride is one next walk from **self**. Never owned |
| Swap two player-side bodies that share a **(3,2)** vector | `spell-camel-fold` | Hook Fold is shared **(3,1)**. Lane Fold is shared rank **or** file **and** Chebyshev **exactly 3**. Leap Fold is Chebyshev **exactly 3**, **any geometry**. Knight Fold is a different boss. Never owned |

Duplicates still forbidden: Shield ≈ Iron Skin; Blood Mend ≈ Rally; Poison ≈ Venom; Expose ≈ Veil; Mirror ≈ Reflect Barrier.

Power bands unchanged (Wave 1 §10). Signature 6 AP stays `ENEMY_ONLY` / `BOSS_ONLY` unless a card says otherwise.

**PX reconciliation:** `PX_COHERENCE_AUDIT` KEEP on “almost every spell `mpCost: 0`” stands as the **catalog default**. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll. Do not add a fourth. Do not invent a mana stat.

---

## 11. Proposed spells (Wave 19)

All rows: `STATUS: PROPOSED`. `isBaseSpell: false`. None of these ids exist in `spellData.ts`, `SPELL_ID_CATALOG`, Waves 1–18, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #525, #563, #636, #695, #726, #787, #802, #837, #849, #890, #906, #953, #962, #1011, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, or **#1177**.

`SCALING` follows existing `spellDmgGrowthPercent` / `upgradeSpell` unless marked fixed.

`mpCost: 0` on every unique row. Prime Toll / Summon Camel / Pack Camel / Watch Shave / Brick Levy are flags, not `spell.mpCost`.

### 11.1 New `effectParams` keys (Wave 19 only)

Parsers whitelist. Unknown keys ignored. Missing key → effect does not fire. Do **not** add name tables. Do **not** reuse #1143 / #1132 / #1082 / #1063 / #1017 / **#1177** key names for a different meaning.

```text
camelStride32,                    // dest is permutation of (3,2): eight cells
nextSpellExactChebyshev,          // Deca Oath — value 10 (reuse key; value distinguishes Nona=9 / Octa=8)
attractTowardNearestGlyphTax, glyphTaxSearchRadius,
bonusIfShareCamel32WithCaster, camelBiteBonus,
detonateIfTurnEndLeftoverApAndMpEq0,
negateHitIfLeftoverApGe2AndMpGe1,
skipFuseDetonateOnPathLength1,
bonusIfLeftoverApEq0AndMpEq0, hollowStingBonus,
summonWalkCamel32ApTax,
requireLeftoverApEq1AndMpEq0, thinGiftHeal,
capRemainingCdsAbove5To5,         // n>5 → 5; 0/1/2/3/4/5 stay
nextWalkApTaxIfLeftoverApEq1AndMpEq1,
nextWalkMpTaxIfAdjacentBarrier,
overwatchSnapShaveWalkerLeftoverMp,
bonusIfLeftoverApEq0AndMpGe1, leanGaitBonus,
bonusIfNearGlyphTaxOccupancy, glyphCutRadius, glyphCutBonus,
negateHitIfLeftoverApEqualsMax,
packWalkCamel32, packAuraRadius, packAuraDuration,
foldTwoPlayerSideShareCamel32, foldDamage
```

Reuse from earlier waves where the meaning is identical: `overwatchDuration` for Watch Shave’s arm window; `nextSpellExactChebyshev` with value **10**.

---

### SPELL_ID: `spell-camel-stride`

NAME: Camel Stride  
ROLE: POSITION — one next walk must be a (3,2) dest  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `rank_lancer`; `G ≥ 19` or variant ≥ CHAMPION; `aiProfile` flanker/kiter  
ENEMY_FAMILIES: `blink_cutter`, `rank_lancer`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE / G≥19. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: Arm 1 turn. The caster’s **next walk** this turn is legal **only** if the dest is a permutation of (3,2): `(±3,±2)` and `(±2,±3)` (eight cells). Orthogonal dests, `(3,1)` dests, knight `(2,1)` dests, diagonal dests, and any Chebyshev ≠ 3 fail closed (walk confirm rejects; MP not spent). Teleport / Swap / Twin-gate are not that walk. Distinct from Hook Stride `(3,1)`, Tern Stride (Chebyshev 3 orthogonal), Knight Stride `(2,1)`, Ring Stride (Chebyshev 2, knight excluded).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "walk_camel_3_2"`. Flanker / kiter. Skip if no (3,2) landing is floor. **Do not** assign to chargers who only walk orthogonal.  
PLAYER_COUNTERPLAY: Occupy the eight (3,2) cells; stand so the only threat is a Tern/Hook landing; Root before they arm  
SYNERGIES: Phase Slip onto a (3,2); Camel Bite after they land; Debt Mark (the gated walk also costs AP)  
BALANCE_RISK: (3,2) jumps over a file of pawns. 2 AP, CD 2, **strict** geometry. Fail closed, never become Strike.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Later confirm-fail does not second-observe. Standard observe → same-encounter win. No Doka.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-deca-oath`

NAME: Deca Oath  
ROLE: CONTROL — next spell illegal unless Chebyshev = 10  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `pale_cantor`; `G ≥ 19`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `glass_sniper`, `pale_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 1 turn. The caster’s next **spell** (`damage > 0` or listed control id; Strike / `physical_attack` stays legal) confirms only if Chebyshev(caster, target) === 10 (`effectParams: {"nextSpellExactChebyshev":10}`). Distinct from Nona Oath (9), Octa Oath (8), Dec Span (occupy-weight 10 on `span_dec`).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "next_spell_exact_chebyshev_10"`. Caster / kiter. Skip if they cannot reach a 10-hole this turn.  
PLAYER_COUNTERPLAY: Walk to 9 or 11; Barrier the file; force Strike  
SYNERGIES: Far Sting at 10; Split Pace after a long walk; Paper Wind to cut their follow-up  
BALANCE_RISK: Exact-10 is a sniper prison. 2 AP + CD 3 + Strike exempt. Do not also ignore LoS.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-glyph-reel`

NAME: Glyph Reel  
ROLE: POSITION — pull 1 toward nearest painted glyph-tax  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `rime_mason`; `G ≥ 19`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. Attract the target 1 tile toward the nearest **painted glyph-tax occupancy** in Chebyshev 6 (`effectParams: {"attractTowardNearestGlyphTax":true,"glyphTaxSearchRadius":6}`). If none exists, fizzle (AP spent). Dest is never `map.portals`, never a Twin Gate pad, never a world reserved cell. Distinct from Slide Reel (conveyor), Brick Reel (barrier), Glyph Tax (the paint itself), Hook Line (toward caster).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "attract_toward_nearest_glyph_tax"`. Caster / controller. Skip if no glyph-tax cell, or if attract would land on lava while HP% < 40.  
PLAYER_COUNTERPLAY: Dispel the glyph-tax; stand so attract is a no-op; Barrier the step  
SYNERGIES: Glyph Tax then reel; Glyph Cut after they sit next to the paint; File Slide onto the tax  
BALANCE_RISK: Pull onto a 3-AP tax tile bricks a turn. 2 AP, 1 step, G≥19, empty-board fizzle.  
PERSISTENCE_REQUIREMENTS: Fizzle after AP still observes. Dest hazard ticks via existing helpers.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-camel-bite`

NAME: Camel Bite  
ROLE: DAMAGE — bonus if share a (3,2) with the caster  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `blink_cutter` or `shadow_lurker`; `G ≥ 19`; `aiProfile` flanker  
ENEMY_FAMILIES: `blink_cutter`, `shadow_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is exactly a permutation of (3,2) from the caster, deal an extra 12 as a **second** existing `dealDamage` call (`effectParams: {"bonusIfShareCamel32WithCaster":true,"camelBiteBonus":12}`). On-rank, on-file, on-diagonal, `(3,1)`, or `(2,1)` → 10 only. Distinct from Hook Bite `(3,1)`, Knight Pierce `(2,1)` poke, Camel Stride (walk gate).  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_share_camel_3_2_with_caster"`. Flanker. Walk or Camel Stride first. Skip if adjacent (use Rear Cut / Strike).  
PLAYER_COUNTERPLAY: Stand off the eight (3,2) cells; summon-block one landing  
SYNERGIES: Camel Stride then bite; Pawn Trade onto a (3,2)  
BALANCE_RISK: 22 through a jump is Frost-adjacent. Gate is strict geometry. Fail closed, never become Strike.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-geometry 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hollow-mark`

NAME: Hollow Mark  
ROLE: TERRAIN — turn-end detonate iff leftover AP and MP are both 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `bone_scribe`; `G ≥ 19`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `glyph_sower`, `bone_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 3  
RANGE: 3  
TARGET_TYPE: ground  
LOS: true  
COOLDOWN: 2  
EFFECT: `freeCells: true`. Paint one floor cell 2 turns. At the **occupant’s turn end**, if leftover AP === 0 **and** leftover MP === 0, deal 14 (spell, RES+SR) and consume (`effectParams: {"detonateIfTurnEndLeftoverApAndMpEq0":true}`). Strike-from, walk-enter, teleport landing, leftover MP equals max, last leftover AP, leftover 1/0, leftover 1/1 → no detonate. Distinct from Idle Mark (MP equals max), Last Mark (last AP), Dwell Mark (any occupy). Observation is the **paint**.  
SCALING: damage follows dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "detonate_if_turn_end_leftover_ap_and_mp_eq_0"`. Caster / controller. Paint a cell they will empty both pools on. Skip if they still hold a 2-cost tool.  
PLAYER_COUNTERPLAY: Keep 1 AP or 1 MP; leave the cell; blink off  
SYNERGIES: Drain Courage / Soul Sip to empty pools; Quiet Hex so they spend the last AP on a taxed spell  
BALANCE_RISK: 14 at end of a spent turn is a punish, not a trap-on-enter. 3 AP, CD 2, both-pool gate.  
PERSISTENCE_REQUIREMENTS: Paint observes. Detonate does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-wide-plate`

NAME: Wide Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP ≥ 2 and leftover MP ≥ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 19`; `aiProfile` guardian  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥19. `generationMin: 19`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **≥ 2 AND** leftover MP **≥ 1**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApGe2AndMpGe1":true}`). Leftover 1/0, 1/1, 2/0, or 0/≥1 → full hit, charge remains until expiry. Distinct from Thin Plate (1/0), Prime Plate (1/1), Dual Plate (both even ≥ 2), Wide Sting (damage bonus on this window), Sestet Hood (sum===6 unequal). Do not implement as `buffStat: "evasion"`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_ge_2_and_mp_ge_1"`. Guardian / kiter. Skip if leftover is not AP≥2/MP≥1 or if Thin Plate is already up.  
PLAYER_COUNTERPLAY: Wait until they walk (MP drops); throw a 0-damage control first; Quiet Hex so they spend the leftover AP  
SYNERGIES: Haste to hold MP; Wide Sting on a different body in the pack (do **not** CORE both on a BASE kit)  
BALANCE_RISK: A 2-AP/1-MP camp becomes unhittable for one swing. CD 2 + leftover gate. AoE: first instance consumes.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-fuse-skip`

NAME: Fuse Skip  
ROLE: POSITION — pathLength 1 walk onto fuse does not detonate this enter  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `tide_shade` or `plague_rat`; `G ≥ 19`; `aiProfile` kiter/flanker  
ENEMY_FAMILIES: `tide_shade`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn, 1 consume. The next **pathLength 1** walk that **enters** a painted fuse cell (`spell-fuse-tile`) does **not** detonate that cell this enter (`effectParams: {"skipFuseDetonateOnPathLength1":true}`). Timer still ticks. PathLength ≥ 2 still detonates. Lava / spikes / ice leave-tax / glyph-tax / Void Rift / conveyor / Thorned extra still tick. If enter-detonate is not wired when Fuse Tile lands, the skip **defers that cell’s timer by 1 turn** instead (same AP, same observe). Distinct from Brier Skip (Thorned extra, pathLength 2, not occupancy).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "skip_fuse_detonate_on_path_length_1"`. Kiter / flanker. Skip if no fuse sits on a 1-step.  
PLAYER_COUNTERPLAY: Force a 2-step onto the fuse; wait the timer; paint a second fuse  
SYNERGIES: Fuse Tile then skip through; Slide Skip is a different conveyor rider — do not CORE both on a BASE kit  
BALANCE_RISK: Skipping a 3-turn fuse on a 1-step is a positioning gift. PathLength gate + CD 2. Do not retune fuse damage.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Ignored detonate is not a second observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-hollow-sting`

NAME: Hollow Sting  
ROLE: DAMAGE — bonus if leftover AP and MP are both 0  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `plate_warden` or `iron_golem`; `G ≥ 19`; `aiProfile` caster/berserker  
ENEMY_FAMILIES: `plate_warden`, `iron_golem`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥19. `generationMin: 19`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **caster’s** leftover AP === 0 **and** leftover MP === 0 at resolve, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq0AndMpEq0":true,"hollowStingBonus":8}`). Leftover 1/0, 2/0, 0/≥1, or AP≥2/MP≥1 → 10 only. Distinct from Thin Gait (1/0 damage), Wide Sting (AP≥2/MP≥1 damage), Hollow Gift (0/0 **heal**), Hollow Mark (cell detonate).  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_0_and_mp_eq_0"`. Caster / berserker. Spend pools first. Skip if Thin Gait would already fire.  
PLAYER_COUNTERPLAY: Keep them from emptying both pools; Root so they cannot spend MP walking  
SYNERGIES: Hollow Mark on the cell they emptied on; Ley Toll is a different MP spend — do not add `mpCost` here  
BALANCE_RISK: 18 after a spent turn is Frost-lite. Gate is both pools empty. 2 AP, CD 1.  
PERSISTENCE_REQUIREMENTS: Standard observe → win. Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-summon-camel`

NAME: Summon Camel  
ROLE: SUMMONS — allied pets pay +1 AP to land (3,2) from origin  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter`; variant ≥ ELITE or `G ≥ 19`; `aiProfile` summoner/guardian  
ENEMY_FAMILIES: `brood_chanter`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 19`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: 2 turns. Every living **allied** summon (same side) that this turn walks to a landing that is a permutation of (3,2) from **that summon’s walk origin** pays +1 AP (`effectParams: {"summonWalkCamel32ApTax":true}`). Orthogonal / (3,1) / knight landings do not pay. Distinct from Summon Hook `(3,1)` tax, Summon Orth (diagonal step tax), Pack Camel (pack **lock**, `ENEMY_ONLY`).  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "summon_walk_camel_3_2_ap_tax"`. Summoner / guardian. Skip if no allied summon. Drop this id if `summonAI` is empty (Wave 1 name-fallback still live).  
PLAYER_COUNTERPLAY: Walk pets orthogonal; Sever Tether; kill the chanter  
SYNERGIES: Kennel Lock keeps pets close so (3,2) is a stretch; Pack Camel is CHAMPION-only and never owned — do not CORE both  
BALANCE_RISK: Player copy taxes **their** pets — a real downside when kiting with (3,2) jumps. Elite + CD 3.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-thin-gift`

NAME: Thin Gift  
ROLE: SUPPORT — heal iff leftover AP === 1 and leftover MP === 0  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `pale_cantor` or `font_cantor`; variant ≥ ELITE or `G ≥ 19`; `aiProfile` healer/buffer  
ENEMY_FAMILIES: `pale_cantor`, `font_cantor`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 2  
EFFECT: No `healAmount` on the row. If the **target’s** leftover AP === 1 **and** leftover MP === 0, heal 10 (`effectParams: {"requireLeftoverApEq1AndMpEq0":true,"thinGiftHeal":10}`). Else fizzle (AP spent). Leftover 2/0, 1/1, 0/≥1, or AP≥2/MP≥1 fail. Distinct from Thin Gait (same window, **damage**), Gait Gift (AP≥2/MP=0 heal), Prime Gift (1/1 heal), Wide Gift (AP≥2/MP≥1 heal), Lean Gift (AP=0/MP≥1 heal), Sestet Mend (both-body sum===6 unequal). Healer CORE only.  
SCALING: heal fixed  
AI_REQUIREMENTS: `aiHint: "heal_if_leftover_ap_eq_1_and_mp_eq_0"`. Healer / buffer. Skip unless leftover is 1/0. Do **not** assign to non-healer CORE (`inferArchetype` still keys `healAmount > 0` — keep `healAmount: 0` on the row).  
PLAYER_COUNTERPLAY: Spend the last AP; Haste so they hold MP; Cursed Wound  
SYNERGIES: Quiet Hex so they keep 1 leftover AP; `easy_1` — the heal fails that challenge when HP actually increases  
BALANCE_RISK: 10 on a 1/0 window is Blood Mend-lite. Elite + fizzle off-window.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes. `healUsed` only if player-side HP increased.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-cadence-quint`

NAME: Cadence Quint  
ROLE: SUPPORT — remaining CDs n>5 → 5  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `cadence_thief` or `hex_chorister`; `G ≥ 19`; `aiProfile` buffer/caster  
ENEMY_FAMILIES: `cadence_thief`, `hex_chorister`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: ally  
LOS: false  
COOLDOWN: 3  
EFFECT: No damage. Target may be self. Every remaining spell CD **n>5** becomes 5; 0/1/2/3/4/5 unchanged (`effectParams: {"capRemainingCdsAbove5To5":true}`). Distinct from Cadence Quad (`n>4`→4), Cadence Tern (`n>3`→3), Cadence Cap (`n>2`→2), Cadence Tierce (`3→0`). Do not CORE with Quad / Tern / Cap / Tierce / Dock / Snuff on the same BASE kit.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "cap_remaining_cds_gt_5_to_5"`. Buffer / caster. Skip if no remaining CD > 5.  
PLAYER_COUNTERPLAY: Wait the last tick; Dispel; force a 4-CD tool instead  
SYNERGIES: Inferno CD 3 is unchanged; a later 6-CD signature becomes 5. Hard_3 is AP, not CD.  
BALANCE_RISK: Capping 8→5 is a tempo gift. Ally-only + CD 3 + G≥19.  
PERSISTENCE_REQUIREMENTS: Standard observe → win.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-prime-toll`

NAME: Prime Toll  
ROLE: CONTROL — next walk +1 AP if leftover is 1/1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `tax_scribe` or `ley_tollkeeper`; `G ≥ 19`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `tax_scribe`, `ley_tollkeeper`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target’s leftover AP === 1 **and** leftover MP === 1, their **next walk of ≥ 1 tile** this battle (or 2 turns) also costs +1 AP (`effectParams: {"nextWalkApTaxIfLeftoverApEq1AndMpEq1":true}`). Else fizzle (AP spent). Teleport / Swap / Phase Slip / Twin-gate do **not** pay. Distinct from Even Toll (AP even ≥ 2), Odd Toll (AP odd), Gait Toll (MP = 0), Prime Gait (damage on 1/1). Not `spell.mpCost`.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_if_leftover_ap_eq_1_and_mp_eq_1"`. Caster / controller. Skip if leftover is not 1/1 or if already rooted.  
PLAYER_COUNTERPLAY: Blink off; spend the last AP or MP first; pay the 1 AP  
SYNERGIES: Prime Gift / Prime Plate on a different body; Far Watch (walking now costs AP **and** snaps)  
BALANCE_RISK: 1/1 is a narrow window. Fizzle off-window. G≥19.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-brick-levy`

NAME: Brick Levy  
ROLE: CONTROL — next walk +1 MP while adjacent to a barrier  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Families `stone_castellan` or `rime_mason`; `G ≥ 19`; `aiProfile` caster/controller  
ENEMY_FAMILIES: `stone_castellan`, `rime_mason`  
RELATIVE_DIFFICULTY_REQUIREMENT: RARE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 4  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 2  
EFFECT: No damage. If the target is **adjacent to a barrier** at resolve, their **next walk of ≥ 1 tile** also costs +1 **MP** from the walk pool (`effectParams: {"nextWalkMpTaxIfAdjacentBarrier":true}`). Else fizzle (AP spent). Not `spell.mpCost`. Distinct from Brick Tax (walk **+1 AP**), Brick Fee (next **spell +1 AP**), Brick Hold (forbid walk), Frozen/Slime (map-modifier MP doubler on **every** walk). Frozen/Slime still apply; levy is an extra +1 after those modifiers.  
SCALING: tax fixed  
AI_REQUIREMENTS: `aiHint: "tax_next_walk_mp_if_adjacent_barrier"`. Caster / controller. Skip if no adjacent barrier, or if Brick Tax already covers this body this turn.  
PLAYER_COUNTERPLAY: Step off the wall; Barrier last-writer fills a pit but **is** a barrier — standing next to your own wall still pays; blink  
SYNERGIES: Barrier then levy; Brick Fee on a different window (spell vs walk)  
BALANCE_RISK: Wall-hugging melee pays MP to leave. 2 AP, CD 2, adjacency gate. Challenge: MP spend is not AP.  
PERSISTENCE_REQUIREMENTS: Fizzle still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-watch-shave`

NAME: Watch Shave  
ROLE: DEFENSE — overwatch snap −1 leftover MP (caster does not gain it)  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glass_sniper` or `hood_lurker`; variant ≥ ELITE or `G ≥ 19`; `aiProfile` kiter/caster  
ENEMY_FAMILIES: `glass_sniper`, `hood_lurker`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 19`  
RARITY: RARE  
AP_COST: 3  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 3  
EFFECT: Stance, 2 turns, **visible**. The next hostile who **walks** into Chebyshev 3 or 4 of the caster loses 1 leftover MP (min 0). The caster does **not** gain that MP (`effectParams: {"overwatchSnapShaveWalkerLeftoverMp":true,"farWatchMin":3,"farWatchMax":4,"overwatchDuration":2}`). Push/pull into the band **does** trigger. Teleport / Swap / Twin-gate **does not**. Distinct from Watch Drain (steal to caster **on cast**), Watch Root (zero leftover MP **on cast**), Watch Bind (forbid next walk), Far Watch (deals damage). Observation is the **arm**.  
SCALING: amount fixed; band fixed  
AI_REQUIREMENTS: `aiHint: "overwatch_snap_shave_walker_leftover_mp"`. Kiter / caster. Skip if the player is already in 1–2.  
PLAYER_COUNTERPLAY: Stay at 5+ or at 1–2; blink in; send a summon into 3  
SYNERGIES: Brick Levy (leaving a wall now costs MP **and** the snap shaves another); Paper Wind  
BALANCE_RISK: Band 3–4 + Soul Sip is an MP prison. Consume-on-first-body, CD 3, elite. Do not steal to caster.  
PERSISTENCE_REQUIREMENTS: Arm observes. Snap does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-lean-gait`

NAME: Lean Gait  
ROLE: DAMAGE — bonus if leftover AP = 0 and leftover MP ≥ 1  
ACQUISITION_SOURCE: ENEMY_DISCOVERY  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `bone_scribe` or `purse_scribe`; `G ≥ 19`; `aiProfile` caster/kiter  
ENEMY_FAMILIES: `bone_scribe`, `purse_scribe`  
RELATIVE_DIFFICULTY_REQUIREMENT: ADVANCED / G≥19. `generationMin: 19`  
RARITY: UNCOMMON  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the **caster’s** leftover AP === 0 **and** leftover MP ≥ 1 at resolve, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfLeftoverApEq0AndMpGe1":true,"leanGaitBonus":8}`). Leftover 0/0, 1/0, 1/1, or AP≥2 → 10 only. Distinct from Lean Gift (same window, **heal**), Hollow Sting (0/0 damage), Thin Gait (1/0 damage), Wide Sting (AP≥2/MP≥1 damage). Do not mint `spell-lean-sting`.  
SCALING: both numbers follow dmg%; gate fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_leftover_ap_eq_0_and_mp_ge_1"`. Caster / kiter. Spend AP, keep MP. Skip if leftover is 0/0.  
PLAYER_COUNTERPLAY: Soul Sip the last MP; force a walk so they drop MP; Root  
SYNERGIES: Slow then sting; Lean Gift on a healer in the pack (do not CORE both on a BASE kit)  
BALANCE_RISK: 18 after emptying AP is Frost-lite. Gate is AP empty **and** MP held.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-glyph-cut`

NAME: Glyph Cut  
ROLE: DAMAGE — bonus if Chebyshev ≤ 2 from painted glyph-tax  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `glyph_sower` or `plague_rat`; variant ≥ ELITE or `G ≥ 19`; `aiProfile` caster/flanker  
ENEMY_FAMILIES: `glyph_sower`, `plague_rat`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 3  
TARGET_TYPE: enemy  
LOS: true  
COOLDOWN: 1  
EFFECT: Deal 10. If the target is Chebyshev ≤ 2 from **painted glyph-tax occupancy**, deal an extra 8 as a second `dealDamage` (`effectParams: {"bonusIfNearGlyphTaxOccupancy":true,"glyphCutRadius":2,"glyphCutBonus":8}`). Far from glyph-tax, on a Twin Gate pad, or next to lava only → 10 only. Distinct from Slide Cut (conveyor), Lava/Rime/Spike Cuts (live hazards), Glyph Reel (pull), Portal Cut (`map.portals`).  
SCALING: both numbers follow dmg%; radius fixed  
AI_REQUIREMENTS: `aiHint: "bonus_if_near_glyph_tax_occupancy"`. Caster / flanker. Paint glyph-tax first. Skip if no paint in 2 of the target.  
PLAYER_COUNTERPLAY: Step to 3 from the tax; Dispel the paint; hug a conveyor instead (Slide Cut would want that)  
SYNERGIES: Glyph Tax then cut; Glyph Reel to pull them into 2  
BALANCE_RISK: 18 next to an AP-tax tile is the combo. Elite + paint required.  
PERSISTENCE_REQUIREMENTS: Off-window 10 still observes.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-fresh-plate`

NAME: Fresh Plate  
ROLE: DEFENSE — next hit is 0 while leftover AP equals max AP  
ACQUISITION_SOURCE: ELITE  
PLAYER_LEARNABLE: true  
OBSERVATION_REQUIRED: true  
MINIMUM_ELIGIBILITY: Family `brood_chanter` or `plate_warden`; variant ≥ ELITE or `G ≥ 19`; `aiProfile` guardian  
ENEMY_FAMILIES: `brood_chanter`, `plate_warden`  
RELATIVE_DIFFICULTY_REQUIREMENT: ELITE_POOL. `generationMin: 19`  
RARITY: RARE  
AP_COST: 2  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 2  
EFFECT: 1 turn or 1 incoming damaging instance, whichever first. While leftover AP **equals max AP**, the next damaging instance against this unit deals 0 (consume) (`effectParams: {"negateHitIfLeftoverApEqualsMax":true}`). Walking or casting drops leftover AP below max → full hit, charge remains until expiry. Distinct from Idle Plate (leftover **MP** equals max), Fresh Sting (damage bonus on leftover AP equals max), Dry Plate (leftover MP = 0). Do not implement as `buffStat: "evasion"`.  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "negate_hit_if_leftover_ap_equals_max"`. Guardian. Arm before spending AP. Skip if Idle Plate is already up (last negate writer wins — do not double-cast).  
PLAYER_COUNTERPLAY: Force a walk or a 2-cost tool first; wait 1 turn; AoE second instance  
SYNERGIES: Timestep refill after a spend does **not** re-arm this charge; Haste is MP, not AP  
BALANCE_RISK: A full-AP camp becomes unhittable for one swing. Elite + leftover-equals-max gate.  
PERSISTENCE_REQUIREMENTS: Observe on the **arm**. Negated hit does not second-observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-pack-camel`

NAME: Pack Camel  
ROLE: SUPPORT — pack walks locked to permutation of (3,2)  
ACQUISITION_SOURCE: ENEMY_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: Family `camel_precentor`; variant CHAMPION; `G ≥ 19`  
ENEMY_FAMILIES: `camel_precentor`  
RELATIVE_DIFFICULTY_REQUIREMENT: SIGNATURE. `generationMin: 19`  
RARITY: RARE  
AP_COST: 4  
RANGE: 0  
TARGET_TYPE: self  
LOS: false  
COOLDOWN: 4  
EFFECT: 2 turns. Living allies at Chebyshev ≤ 2 may only walk to dests that are a permutation of (3,2) from **that walker’s origin** (`effectParams: {"packWalkCamel32":true,"packAuraRadius":2,"packAuraDuration":2}`). Does not grant extra AP. Distinct from Pack Hook `(3,1)`, Pack Ring (Chebyshev 2, knight excluded), Pack Orth (any orthogonal), Camel Stride (self next walk).  
SCALING: none  
AI_REQUIREMENTS: `aiHint: "pack_walk_camel_3_2"`. Buffer. CHAMPION only. Skip if aura up or no ally in 2.  
PLAYER_COUNTERPLAY: Kill the Precentor; pull allies out of 2; occupy the (3,2) cells  
SYNERGIES: Pack Hook is a different CHAMPION — **do not** put both on a BASE kit; CHAMPION may have Hook **or** Camel, not both in CORE  
BALANCE_RISK: Forcing a pack onto (3,2) jumps is a scramble. ENEMY_ONLY + CHAMPION + CD 4. **Never** write `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Optional `UNKNOWN TECHNIQUE` log. Aura tick without a new cast does not observe.  
STATUS: PROPOSED

---

### SPELL_ID: `spell-camel-fold`

NAME: Camel Fold  
ROLE: POSITION — swap two player-side bodies that share a (3,2)  
ACQUISITION_SOURCE: BOSS_ONLY  
PLAYER_LEARNABLE: false  
OBSERVATION_REQUIRED: false  
MINIMUM_ELIGIBILITY: `camel_fold_regent` kit / phase 2. Not a world pack  
ENEMY_FAMILIES: none (boss id `camel_fold_regent`)  
RELATIVE_DIFFICULTY_REQUIREMENT: Boss signature. Not a G table  
RARITY: UNIQUE  
AP_COST: 4  
RANGE: 6  
TARGET_TYPE: enemy  
LOS: false  
COOLDOWN: 3  
EFFECT: Swap the two living **player-side** bodies (player + a summon) **if and only if** they share a permutation of (3,2). If fewer than two, or they share only a (3,1) / rank / file / Chebyshev 3 orthogonal, fizzle. Then deal 6 (spell) to each (`effectParams: {"foldTwoPlayerSideShareCamel32":true,"foldDamage":6}`). Distinct from Hook Fold `(3,1)`, Lane Fold (rank or file and Chebyshev 3), Leap Fold (Chebyshev 3 any geometry), Pawn Trade (two hostiles-to-caster). Never owned.  
SCALING: damage follows dmg%  
AI_REQUIREMENTS: `aiHint: "fold_two_player_side_share_camel_3_2"`. **Boss AI only.** Skip if 0–1 player-side bodies or they do not share (3,2).  
PLAYER_COUNTERPLAY: Fight without a summon; stand off (3,2); False Retreat decoy as the second body  
SYNERGIES: Camel identity; Claim Ward does not block unit swap (same explicit as Hook Fold)  
BALANCE_RISK: Forced player/summon swap + 6 is a mechanic, not a farmable spell. BOSS_ONLY. **Never** `ownedSpellIds`.  
PERSISTENCE_REQUIREMENTS: None. Dim `UNKNOWN TECHNIQUE` log optional.  
STATUS: PROPOSED

---

## 12. Family pool attachments (Wave 19 only)

Add these ids to the **named** family pools in a later data PR. Do not grab random `usableByEnemy` rows. Do not retire Wave-1…18 attachments.

| Family | Pool | Id |
| :--- | :--- | :--- |
| `blink_cutter` | RARE / G≥19 | `spell-camel-stride`, `spell-camel-bite` |
| `rank_lancer` | RARE / G≥19 | `spell-camel-stride` |
| `shadow_lurker` | RARE / G≥19 | `spell-camel-bite` |
| `glass_sniper` | RARE / G≥19 | `spell-deca-oath` |
| `glass_sniper` | ELITE | `spell-watch-shave` |
| `pale_cantor` | RARE / G≥19 | `spell-deca-oath` |
| `pale_cantor` / `font_cantor` | ELITE | `spell-thin-gift` (healer CORE only) |
| `glyph_sower` | RARE / G≥19 | `spell-glyph-reel`, `spell-hollow-mark` |
| `glyph_sower` | ELITE | `spell-glyph-cut` |
| `rime_mason` | RARE / G≥19 | `spell-glyph-reel`, `spell-brick-levy` |
| `bone_scribe` | RARE / G≥19 | `spell-hollow-mark`, `spell-lean-gait` |
| `purse_scribe` | RARE / G≥19 | `spell-lean-gait` |
| `tide_shade` | RARE / G≥19 | `spell-fuse-skip` |
| `plague_rat` | RARE / G≥19 | `spell-fuse-skip` |
| `plague_rat` | ELITE | `spell-glyph-cut` |
| `plate_warden` | ADVANCED / G≥19 | `spell-wide-plate`, `spell-hollow-sting` |
| `iron_golem` | ADVANCED / G≥19 | `spell-wide-plate`, `spell-hollow-sting` |
| `plate_warden` | ELITE | `spell-fresh-plate` |
| `stone_castellan` | RARE / G≥19 | `spell-brick-levy` |
| `brood_chanter` | ELITE | `spell-summon-camel`, `spell-fresh-plate` |
| `cadence_thief` | RARE / G≥19 | `spell-cadence-quint` |
| `hex_chorister` | RARE / G≥19 | `spell-cadence-quint` |
| `tax_scribe` | RARE / G≥19 | `spell-prime-toll` |
| `ley_tollkeeper` | RARE / G≥19 | `spell-prime-toll` |
| `hood_lurker` | ELITE | `spell-watch-shave` |
| `camel_precentor` CHAMPION | SIGNATURE | `spell-pack-camel` (`ENEMY_ONLY`; not with Pack Hook / Pack Ring / Pack Orth / Pack Diag / Pack File / Pack Rank / Pack Cap / Pack Long / Pack Close on the same BASE kit) |
| `camel_fold_regent` | BOSS_ONLY | `spell-camel-fold` |

Empty slot → skip. Empty kit → `[physical_attack]`.

### 12.1 Wave-19 family CORE is unique #1082 + #1132

Wave-19 family CORE consumes remaining **#1082** unique Wave-17 verbs (minus Gait Gift / Strike Plate on non-healer kits; minus Pack Ring / Lane Fold) and **#1132** tactical Wave-18 ids (minus Court Tierce; Sestet Mend healer CORE only) in **CORE**. **#1189** already named those families (`sestet_mender` … `strike_plater`) — do **not** restamp. Unique §11 ids may appear there only as G≥19 extras in a later family pass (Wave 21), not as this document’s CORE and **not** as #899 / #941 / #997 / **#1073** / **#1138** / **#1189** CORE. Do **not** put unique §11 ids in #840 CORE, #899 CORE, #941 CORE, #997 CORE, **#1073** CORE, **#1138** CORE, or **#1189** CORE. Do **not** restamp #941 `ENEMY_ID`s (`poise_mender` … `drift_gifter`). Do **not** restamp #997 `ENEMY_ID`s (`tally_mender` … `shove_gifter`). Do **not** restamp **#1073** `ENEMY_ID`s (`score_mender` … `summon_plater`). Do **not** restamp **#1138** `ENEMY_ID`s (`stave_mender` … `cast_plater`). Do **not** restamp **#1189** `ENEMY_ID`s (`sestet_mender` … `strike_plater`). Do **not** name unique §11 families after those `ENEMY_ID`s. `camel_precentor` is not `hook_precentor` / `ring_warder` / `hoop_precentor`. `camel_fold_regent` is not `hook_fold_regent` / `trideca_prelate` / `court_tierce_regent` / `court_quarte_regent`.

Stamp, do not clone #1082: Tern Stride, Octa Oath, Mire Reel, Diag Bite, Summon Mark, Prime Plate, Slide Skip, Capped Sting, Summon Orth, Cadence Tern, Odd Toll, Brick Tax, Watch Tax, Thin Gait, Lava Cut. Gait Gift stays healer CORE only. Pack Ring stays `ENEMY_ONLY` on `hoop_precentor`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`.

Stamp, do not clone #1132: Sestet Mend (healer CORE only), Cadence Tierce, Trideca Span (implementation-blocked while summon cap is 2), Psalm Turn, Sestet Hood, Sestet Sting, Sestet Step, Sestet Sill, Sestet Hold, Sestet Lend, Sestet Sip, Sestet Post, Sestet Bounce, Must Sestet, Verse Sestet. Court Tierce stays `NOT_PLAYER_LEARNABLE` on `court_tierce_regent`. Do **not** CORE Must Sestet with Sestet Hold. Do **not** CORE Cadence Tierce with Cadence Quint / Cadence Quad / Cadence Tern / Cadence Cap / Cadence Dock / Cadence Snuff / Cadence Quarte. Do **not** CORE Sestet Mend with Thin Gift / Wide Gift / Gait Gift / Prime Gift / Stave Mend / Score Mend / Septet Mend. Do **not** CORE Psalm Turn with Hymn Turn / Purse Turn / Tempo Invert / Bar Cross / Duel Turn / Feud Turn. Do **not** CORE Cadence Quint with Cadence Quad / Cadence Quarte.

**SDE wins** unique leftover collisions: Thin Gift stays leftover AP **=== 1 AND** leftover MP **=== 0**; Cadence Quint stays remaining `n>5` → `5`; Wide Plate stays leftover **AP ≥ 2 AND MP ≥ 1** negate; Hollow Mark stays turn-end leftover **0/0**; Fresh Plate stays leftover **AP equals max** negate. Do **not** mint `spell-score-gift` / `spell-stave-gift` / `spell-sestet-gift` / `spell-septet-gift` / `spell-eleven-span` / `spell-twin-turn` / `spell-cadence-kill` / `spell-court-drop` / `spell-quint-mend` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-thirteen-span` / `spell-fourteen-span` / `spell-deca-span` / `spell-hook-line` / `spell-camel-line` / `spell-cadence-trey` / `spell-cadence-cinque` / `spell-mixed-turn` / `spell-thin-sting` / `spell-wide-gait` / `spell-alfil-stride`. **#1063** owns `spell-dodeca-span` — stamp, do not clone. **#1132** owns `spell-trideca-span` / `spell-sestet-mend` / `spell-cadence-tierce` / `spell-psalm-turn` — stamp, do not clone. **#1177** owns `spell-tetradeca-span` / `spell-septet-mend` / `spell-cadence-quarte` / `spell-feud-turn` — stamp, do not clone.

### 12.2 Wave-18 unique extras (deferred)

#1143 unique Wave-18 verbs (`spell-hook-stride` … `spell-hook-fold`) stay G≥18 extras until Wave 20 families consume them. This catalog does not mint those family ids and does not put unique §11 in those CORE rows. Pack Hook stays `ENEMY_ONLY` on `hook_precentor`. Hook Fold stays `BOSS_ONLY` on `hook_fold_regent`.

### 12.3 Same-day tactical CORE (Wave 20)

**#1177** (`SPELL_PROPOSALS_2026-10-27.md`) **did** open. Stamp it as Wave **20** family CORE together with unique Wave-18 §11 (#1143). Do **not** put those ids in Wave-19 family CORE or unique §11. Unique §11 stay this catalog’s until Wave 21. Do **not** CORE Septet Mend with Thin Gift. Do **not** CORE Cadence Quarte with Cadence Quint. Do **not** CORE Tetradeca Span with Deca Oath. Do **not** CORE Feud Turn with Psalm Turn.

Do not pool #282 `spell-hex-toll`.

---

## 13. How to add Generation 20 forever

Same recipe as Wave 18 §13:

1. Pick a hole that is not in §10 or the tombstone.
2. Stamp `generationMin = currentPublishedMax(family) + 1` (will be 20 after this wave ships for families in §12).
3. Default `ENEMY_DISCOVERY` + observe + same-encounter win.
4. Write `AI_REQUIREMENTS`. If no profile can satisfy them, `usableByEnemy: false` or `ENEMY_ONLY`.
5. Explicit `SpellConfig` metadata. No `if (spell.name === …)`.
6. Add the id to the family pool **and** `SPELL_ID_CATALOG` **and** `spellData.ts` in the **same** implementation PR.
7. Persist only through Wave 1 §8 writers.
8. UX: `TECHNIQUE OBSERVED` / `NEW SPELL DISCOVERED`.
9. `STATUS: PROPOSED` until a human/orchestrator picks the ACTION_ID.
10. Do not restamp any door in §4.1. Do not add a fourth `mpCost > 0` walk-positioning snipe. Do not pool Hex Toll. Do not gate on `unstoppable`. Do not resurrect memory Wave-5 ids. Do not stamp `survivor` unless Last Ember / Last Ward are retired. Do not restamp `jackpot` (Absolve). Do not restamp #890 / #953 / #1011 / **#1063** / **#1132** / **#1177** extra doors. Do not restamp #906 / #962 / **#1017** / **#1082** / **#1143** rooms. Do not restamp #899 / **#941** / **#997** / **#1073** / **#1138** / **#1189** family ids. Do not restamp #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** extra doors. Do not consume #771 primer room ids. Do not consume #826 / #885 / #957 / **#1006** / **#1056** / **#1121** / **#1195** ENC-* ids. Do not consume #949 / **#993** / **#1064** / **#1114** / **#1172** `WF-*`. Do not mint the §0.1 forbidden aliases.

Suggested Wave-20 holes (do not fill today): mid-RAF splice (**hold**); a fourth pure `mpCost > 0` walk snipe (**hold**); player-owned Hex of Silence (**hold**); leftover door `survivor`; dedicated CORE families for unique Wave-18 §11 verbs **and** **#1177** (this catalog’s unique ids stay extras until Wave 21); one next walk permutation of **(4,1)** (giraffe); leftover AP − leftover MP === 2 (collides with Score (3,1) and Sestet (4,2)). Invert leftover AP↔MP on **ally** is **Wave 3 Tempo Invert**. Hostile invert is **#953 Purse Turn**. Two-hostile invert is **#1011 Duel Turn**. Two-ally invert (caster stays) is **#1063 Hymn Turn**. Mixed-side invert (caster stays) is **#1132 Psalm Turn**. Caster-plus-one-hostile invert is **#1177 Feud Turn**. Two-body leftover cross is **#890 Bar Cross**. Eight-cell occupy is **#849 Oct Span**. Nine-cell occupy is **#890 Nine Span**. Ten-cell occupy is **#953 Dec Span**. Eleven-cell occupy is **#1011 Hendeca Span**. Twelve-cell occupy is **#1063 Dodeca Span**. Thirteen-cell occupy is **#1132 Trideca Span**. Fourteen-cell occupy (2×7) is **#1177 Tetradeca Span**. Both-body leftover sum===4 unequal heal is **#1011 Score Mend**. Both-body leftover sum===5 heal is **#1063 Stave Mend**. Both-body leftover sum===6 unequal heal is **#1132 Sestet Mend**. Both-body leftover sum===7 heal is **#1177 Septet Mend**. Remaining `1→0` is **#1011 Cadence Snuff**. Remaining `2→0` is **#1063 Cadence Dock**. Remaining `3→0` is **#1132 Cadence Tierce**. Remaining `4→0` is **#1177 Cadence Quarte**. Remaining `n>2`→`2` is **#1017 Cadence Cap**. Remaining `n>3`→`3` is **#1082 Cadence Tern**. Remaining `n>4`→`4` is **#1143 Cadence Quad**. Remaining `n>5`→`5` is this wave’s Cadence Quint. Chebyshev-3 orthogonal next walk is #1082 Tern Stride. Chebyshev-2-not-knight next walk is #1017 Ring Stride. (3,1) next walk is #1143 Hook Stride. (3,2) next walk is this wave’s Camel Stride. Pack Hook stays `ENEMY_ONLY` on `hook_precentor`. Pack Camel stays `ENEMY_ONLY` on `camel_precentor`. Lane Fold stays `BOSS_ONLY` on `lane_fold_regent`. Hook Fold stays `BOSS_ONLY` on `hook_fold_regent`. Camel Fold stays `BOSS_ONLY` on `camel_fold_regent`. Court Tierce stays kit-only on `court_tierce_regent`. Court Quarte stays kit-only on `court_quarte_regent`. Facing cards still fail closed.

---

## 14. Implementation slices (later PRs — not this change)

Wave-1 slices A–D **before** any Wave-2 data. Each later generation **before** the next. Coordinate #411 / #463 / #480 / #525 / #533 / #563 / #590 / #636 / #646 / #679 / #695 / #726 / #747 / #752 / #787 / #802 / #808 / #837 / #849 / #836 / #890 / #899 / #906 / #941 / #951 / #953 / #962 / **#997** / **#1004** / **#1011** / **#1017** / **#1063** / **#1073** / **#1078** / **#1080** / **#1082** / **#1132** / **#1138** / **#1139** / **#1140** / **#1143** / **#1170** / **#1177** / **#1187** / **#1189** / **#1195** so those catalogs land **once**.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| W19-A. G≥19 extra slot | Kit resolver | `pickEnemyLevelFromTiers` percents; `combatMath.ts` |
| W19-B. New `aiHint` predicates | `decide*` helpers | Name fallbacks; RAF |
| W19-C. Wave-19 **unique** data | `spellData.ts` + kits + catalog | Name heuristics; cloning #1082 / #1132 / #1143 / #1177 ids |
| W19-D. Special rooms | Encounter tag table | `mapGen.ts` algorithms; `fog_of_war` stub |
| W19-E. No new feat/challenge/boss stamps | — | Doka formula; `unstoppable`; leftover `survivor` |
| W19-F. Painted glyph-tax / fuse occupancy | Glyph Tax / Fuse Tile tables | `map.portals`; new `HazardTileType`; editing Thorned Ground extra numbers |

Extract helpers. Do not grow `WorldExploration.tsx` (already 19,213 lines).

This document adds **zero** new `mpCost > 0` ids. Combined paper spenders remain Ley Toll, Undertow, Sanguine Toll.

Watch Shave must not add an evasion roll to `dealDamage`. Glyph Cut must not edit RES/SR/CHC math. Deca Oath must not clone Dec Span. Fuse Skip must not retune fuse damage. Brick Levy must not use walk `applyMpCost` map modifiers as the levy itself.

---

## 15. QA matrix (additive to Wave 1 §14 … Wave 18 §15)

| # | Check | Pass |
| :--- | :--- | :--- |
| W19-1 | Encounter start | Possessed-but-unused G19 id does not observe |
| W19-2 | Camel Stride dest orthogonal, (3,1), knight, diagonal, or Chebyshev ≠ 3 | Confirm fails; MP not spent; Camel Stride already observed |
| W19-3 | `camel_gallery` defeat | Does not grant. Victory grants once |
| W19-4 | `hook_gallery` / `tern_gallery` / `ring_gallery` / `knight_gallery` / `file_gallery` / `orth_gallery` / `rank_gallery` / `even_gallery` / `pair_gallery` | Do not grant Camel Stride |
| W19-5 | Deca Oath then Frost at Chebyshev 8, 9, or 11 | Confirm fails; Strike still legal |
| W19-6 | Glyph Reel no painted glyph-tax | Fizzle observes; no pull. Dest is not `map.portals`, not live lava/ice/spikes, not painted conveyor |
| W19-7 | Camel Bite on-rank, on-file, on-diagonal, (3,1), or (2,1) | 10 only. Hook Bite would want `(3,1)`. Knight Pierce would want `(2,1)` |
| W19-8 | Hollow Mark Strike-from / walk-enter / teleport landing / last-AP / leftover MP equals max / leftover 1/0 at turn end | No detonate. Idle Mark would detonate on leftover MP equals max. Last Mark would detonate on last AP. Dwell Mark would detonate on any end-turn occupy |
| W19-9 | Wide Plate hit while leftover not AP≥2/MP≥1 | Full hit; charge remains. Hit while leftover AP≥2/MP≥1 consumes. Thin Plate would want leftover 1/0. Prime Plate would want leftover 1/1 |
| W19-10 | Fuse Skip across lava / spikes / ice leave-tax / glyph-tax / Void Rift / conveyor / Thorned extra / pathLength ≥ 2 | Those taxes still tick. Skip is fuse occupancy + pathLength 1 only |
| W19-11 | Hollow Sting leftover 1/0, 1/1, 2/0, or AP≥2/MP≥1 | 10 only. Thin Gait would bonus leftover 1/0. Wide Sting would bonus AP≥2/MP≥1. Prime Gait would bonus leftover 1/1 |
| W19-12 | Summon Camel vs Summon Hook vs Summon Orth vs Pack Camel | Pets pay AP to **land (3,2) from origin** vs **(3,1)** vs **walk diagonal** vs pack **(3,2) lock** |
| W19-13 | Thin Gift after leftover 2/0 or 1/1 or 0/≥1 | Fizzle observes; no heal. Gait Gift would want AP≥2/MP=0. Prime Gift would want 1/1. Lean Gift would want AP=0/MP≥1. Wide Gift would want AP≥2/MP≥1. Sestet Mend would want both-body sum === 6 unequal |
| W19-14 | Cadence Quint vs Quad vs Tern vs Cap vs Floor vs Rise vs Prime vs Stall vs Snuff vs Dock vs Tierce | Remaining `n>5` → 5 vs `n>4` → 4 vs `n>3` → 3 vs `n>2` → 2 vs `n>1` → 1 vs `n==1` → 2 vs `n==0` → 1 vs +1 **all** vs `n===1` → 0 vs `n===2` → 0 vs `n===3` → 0 |
| W19-15 | Prime Toll while leftover not 1/1 | Fizzle observes. Even Toll would tax a walk if leftover **AP is even ≥ 2**. Odd Toll would tax leftover **AP odd**. Gait Toll would tax leftover **MP = 0** |
| W19-16 | Brick Levy with no adjacent barrier | Fizzle observes; walks untaxed. Brick Tax would tax the walk **+1 AP**. Brick Fee would tax the **spell**. Brick Hold would forbid the walk |
| W19-17 | Watch Shave vs Bind vs Tax vs Drain vs Root vs Sip vs Far Watch | Snap −1 leftover **MP** (no steal) vs forbids next **walk** vs taxes next **spell** +1 AP vs steals leftover **MP to caster on cast** vs zeros leftover **MP on cast** vs steals AP vs deals damage |
| W19-18 | Lean Gait leftover 0/0, 1/0, or 1/1 | 10 only. Hollow Sting would bonus leftover 0/0. Thin Gait would bonus leftover 1/0. Lean Gift would want AP=0/MP≥1 as **heal** |
| W19-19 | Glyph Cut far from glyph-tax / on a Twin Gate pad / next to lava only | 10 only. Slide Cut would want conveyor occupancy. Lava Cut would want lava occupancy. Glyph Reel would pull |
| W19-20 | Fresh Plate then a 2-AP cast then a hit | Casting drops leftover AP below max; hit deals full; charge remains until expiry. Idle Plate would want leftover MP equals max. Fresh Sting would bonus leftover AP equals max as **damage** |
| W19-21 | Pack Camel / Camel Fold | Never in `ownedSpellIds` |
| W19-22 | Loaner / `WF-SPL-*` / #771 primer / #826 / #885 / #957 / #1006 / **#1056** / **#1121** / **#1195** ENC-* / **#1064** / **#1114** / **#1172** WF-* | No `ownedSpellIds` / `spellLevelKeys` / `upgradeSpell` |
| W19-23 | G=18 Tide | No Camel Stride / Prime Toll (`generationMin: 19`) |
| W19-24 | Duplicate victory | One owned row; levels untouched; no Doka from the grant |
| W19-25 | No cloned ids | Unique §11 ids absent from #906 / #953 / #962 / #1011 / **#1017** / **#1063** / **#1082** / **#1132** / **#1143** / **#1177** catalogs |
| W19-26 | No fourth `mpCost > 0` | Unique §11 rows are all 0. Prime Toll / Summon Camel / Pack Camel / Watch Shave / Brick Levy are flags |
| W19-27 | Hex Toll | Still not in any SDE pool |
| W19-28 | Memory Wave-5 / Wave-18 unique ids | Not re-proposed. Absent from `spellData.ts` |
| W19-29 | `jackpot` / `survivor` / `leader_slayer` / `spell_master` | Still not this catalog. Absolve / Last Ember / Crown Cut / Full Bar unchanged |
| W19-30 | #890 extra doors | `poise_cantor` / `floor_precentor` / `span_nine` / `court_floor_regent` not restamped |
| W19-30b | #906 rooms / doors | `rank_gallery` / `rank_precentor` / `rank_fold_regent` / `mire_nave` not restamped |
| W19-30c | #899 family ids | Unique §11 not CORE on `gaunt_mender` … `axis_cutter`. `camel_precentor` / `camel_fold_regent` not #899 ids |
| W19-30d | #903 extra doors | `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse` not restamped |
| W19-30e | #962 rooms / doors | `file_gallery` / `diag_precentor` / `far_fold_regent` not restamped |
| W19-30f | #941 family ids | Unique §11 not CORE on `poise_mender` … `drift_gifter`. `camel_gallery` is not `knight_gallery` / `hook_gallery` |
| W19-30g | #951 extra doors | `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor` not restamped. `camel_fold_regent` is not those ids |
| W19-30h | #953 tactical ids | Unique §11 does not clone Tally Mend / Cadence Prime / Dec Span / Purse Turn. Extra doors `tally_cantor` / `prime_precentor` / `span_dec` / `court_prime_regent` not restamped. `span_dec` still teaches Dec Span, not Deca Oath |
| W19-30i | #957 ENC-* | `ENC-DRY-02` / `ENC-LEAN-01` / `ENC-ODD-02` not consumed as spell grants |
| W19-30j | #997 family ids | Unique §11 not CORE on `tally_mender` … `shove_gifter` |
| W19-30k | #1004 extra doors | `boot_subprior` / `purse_steward` / `tick_infirmarer` / `mute_notary` not restamped |
| W19-30r | #1080 extra doors | `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher` not restamped. `CHOIR_SLIDE` / `CHOIR_BOTH` / `NAVE_HEAVE` / `CHOIR_PARCHED` never owned |
| W19-30s | #1078 SDA files | `ACTION_IDS_SDA_2026-10-25.md` / `SPELL_ADMIN_DESIGN_2026-10-25.md` not overwritten. SDA-175…189 not re-filed |
| W19-30l | #1006 ENC-* | `ENC-GAUNT-01` / `ENC-EVEN-02` / `ENC-TRI-01` / `ENC-DUMP-01` not consumed as spell grants |
| W19-30m | #1011 tactical ids | Unique §11 does not clone Score Mend / Cadence Snuff / Hendeca Span / Duel Turn. Extra doors `score_cantor` / `snuff_precentor` / `span_hendeca` / `court_snuff_regent` not restamped |
| W19-30n | #1017 rooms / doors | `ring_gallery` / `hepta_nave` / `frost_aisle` / `last_pulpit` / `rift_court` / `lane_precentor` / `leap_fold_regent` not restamped |
| W19-30o | #1063 tactical ids | Unique §11 does not clone Stave Mend / Cadence Dock / Dodeca Span / Hymn Turn. Extra doors `stave_cantor` / `dock_precentor` / `span_dodeca` / `court_dock_regent` not restamped |
| W19-30x | #1132 tactical ids | Unique §11 does not clone Sestet Mend / Cadence Tierce / Trideca Span / Psalm Turn. Cadence Quint is `n>5` → 5, not `3→0`. Thin Gift is leftover 1/0, not both-body sum===6 unequal. Wide Plate is leftover AP≥2/MP≥1 negate, not Sestet Hood. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent` not restamped |
| W19-30ac | #1177 tactical ids | Unique §11 does not clone Septet Mend / Cadence Quarte / Tetradeca Span / Feud Turn. Cadence Quint is `n>5` → 5, not `4→0`. Thin Gift is leftover 1/0, not both-body sum===7. Deca Oath is exact-10 spell gate, not occupy-weight 14. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent` not restamped |
| W19-30ad | #1189 family ids | Unique §11 not CORE on `sestet_mender` … `strike_plater`. `camel_precentor` is not `sestet_mender` / `gait_gifter`. `camel_fold_regent` is not `court_tierce_regent` |
| W19-30ae | #1170 extra doors | `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic` not restamped. `CHOIR_TRIM` / `NAVE_READY` / `CHOIR_LEAN` / `NAVE_NEAR` never owned. `trim_precentor` is not remapped |
| W19-30af | #1195 ENC-* | `ENC-TEACH-19` / `ENC-SPELL-37` / `ENC-SCORE-01` / `ENC-FILE-02` / `ENC-LAVA-01` / `ENC-READY-01` / `ENC-RUSH-71`…`74` not consumed as unique §11 grants |
| W19-30ag | #1172 WF-* | `WF-HAZ-MATCH_SEAM` … `WF-ENV-MATCH_DRAFT` never write `ownedSpellIds`. `WF-SPL-MATCH_TUTOR` is not a grant |
| W19-30ah | #1187 SDA files | `ACTION_IDS_SDA_2026-10-27.md` / `SPELL_ADMIN_DESIGN_2026-10-27.md` not overwritten. SDA-205…219 not re-filed |
| W19-30ai | #1176 FSN drop 19 | Formation clear is not a grant. Unique `ENEMY_FORMATIONS_2026-10-27.md` not overwritten |
| W19-30aj | #1163 EBA / #1183 WDEAD / #1186 MTD / #1192 AEE / #1175 PX / #1167 CDA | Zero extra doors. Do not invent Rush Table S. CDA-031 had not opened |
| W19-30y | #1138 family ids | Unique §11 not CORE on `stave_mender` … `cast_plater`. `camel_precentor` is not `hook_precentor` / `ring_warder`. `camel_fold_regent` is not `hook_fold_regent` / `dodeca_prelate` |
| W19-30z | #1139 extra doors | `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost` not restamped. `NAVE_STRIDE` / `NAVE_DUAL` / `CHOIR_IMPRINT` / `CHOIR_DAMP` never owned |
| W19-30aa | #1140 SDA files | `ACTION_IDS_SDA_2026-10-26.md` / `SPELL_ADMIN_DESIGN_2026-10-26.md` not overwritten. SDA-190…204 not re-filed |
| W19-30p | #1073 family ids | Unique §11 not CORE on `score_mender` … `summon_plater` |
| W19-30q | #1056 ENC-* | `ENC-TEACH-17` / `ENC-SPELL-33` / `ENC-POISE-01` / `ENC-TIED-01` / `ENC-KNIGHT-01` / `ENC-PIT-02` / `ENC-WAVE-18` not consumed as spell grants |
| W19-30t | #1082 rooms / doors | `tern_gallery` / `octa_nave` / `bog_aisle` / `spawn_pulpit` / `belt_nave` / `hoop_precentor` / `lane_fold_regent` not restamped. Unique §11 does not clone Tern Stride / Cadence Tern / Pack Ring / Lane Fold. `tern_gallery` still teaches Tern Stride, not Camel Stride |
| W19-30u | #1143 rooms / doors | `hook_gallery` / `nona_nave` / `mill_aisle` / `idle_pulpit` / `brier_nave` / `hook_precentor` / `hook_fold_regent` not restamped. Unique §11 does not clone Hook Stride / Cadence Quad / Pack Hook / Hook Fold. `hook_gallery` still teaches Hook Stride, not Camel Stride. `nona_nave` still teaches Nona Oath, not Deca Oath. `idle_pulpit` still teaches Idle Mark, not Hollow Mark. `brier_nave` still teaches Brier Skip, not Fuse Skip. `mill_aisle` still teaches Slide Reel, not Glyph Reel |
| W19-30v | #1121 ENC-* | `ENC-TEACH-18` / `ENC-SPELL-35` / `ENC-SPELL-36` / `ENC-TALLY-01` / `ENC-RANK-01` / `ENC-SPIKE-02` / `ENC-MIRE-01` / `ENC-RUSH-67`…`70` not consumed as unique §11 grants |
| W19-30w | #1114 WF-* | `WF-HAZ-PAIR_SEAM` … `WF-ENV-PAIR_DRAFT` never write `ownedSpellIds` |
| W19-30ab | #1111 EBA / #1128 WDEAD | Zero extra doors. Do not invent Rush Table S. Do not restamp `stride_chancellor` / `damp_provost`. **#1170** owns Table R |
| W19-31 | `spell-even-plate` / `spell-octa-span` / `spell-twelve-span` / `spell-nona-span` / `spell-deca-span` / `spell-camel-line` / `spell-hook-line` | Still tombstoned. Wide Plate is the AP≥2/MP≥1 negate, not `even-plate`. Deca Oath is the exact-10 spell gate, not occupy-weight 10. Dodeca Span (#1063) owns twelve occupy. Camel Stride is a walk constraint, not Hook Line |
| W19-32 | Typecheck | `pnpm typecheck` / `pnpm check` clean when code lands |

---

## 16. Out of scope

- Production TypeScript / Motoko / Candid in this PR
- RAF, map generation, turn logic, or damage math
- Re-authoring Waves 1–18, memory Wave 5, #120, #137, #185, #282, #342, #411, #463, #480, #525, #533, #563, #590, #636, #646, #679, #695, #726, #747, #787, #802, #837, #849, #890, #906, #953, **#962**, **#1011**, **#1017**, **#1063**, **#1082**, **#1132**, **#1143**, or **#1177** cards
- Gating on `unstoppable` / `level_10`
- Implementing the `fog_of_war` map-modifier stub
- Reading `CharacterStats.evasion` in `combatMath.ts`
- A fourth `mpCost > 0` walk-positioning snipe
- Pooling Hex Toll
- Restamping any door in §4.1
- New `AchievementConfig` rows
- Editing `BOSS_AND_SPELL_DISCOVERY.md` (#367 / #406 / #474 / #518 / #572 / #638 / #663 / #753 / #808 / #836 / #903 / **#951** / **#1004** / **#1080** / **#1139** / **#1170** own extra doors)
- Resurrecting `SPELL_DISCOVERY_ECOSYSTEM_2026-09-22.md` unique ids
- Consuming #771 / #826 / #885 / **#957** / **#1006** / **#1056** / **#1121** / **#1195** ENC-* as spell grants
- Consuming **#1114** Wave-18 `WF-*` or **#1172** Wave-19 `WF-*` as spell grants
- Overwriting **#1187** SDA / **#1189** family / **#1176** FSN dated files

---

## 17. Wave-19 index

**Unique SDE ids (19):** camel-stride, deca-oath, glyph-reel, camel-bite, hollow-mark, wide-plate, fuse-skip, hollow-sting, summon-camel, thin-gift, cadence-quint, prime-toll, brick-levy, watch-shave, lean-gait, glyph-cut, fresh-plate, pack-camel, camel-fold.

**#1082 stamps (do not clone; Wave-19 family CORE):** Tern Stride, Octa Oath, Mire Reel, Diag Bite, Summon Mark, Prime Plate, Slide Skip, Capped Sting, Summon Orth, Gait Gift, Cadence Tern, Odd Toll, Brick Tax, Watch Tax, Thin Gait, Lava Cut, Strike Plate, Pack Ring, Lane Fold.

**#1132 stamps (do not clone; Wave-19 family CORE):** Sestet Mend, Cadence Tierce, Trideca Span, Psalm Turn, Sestet Hood, Sestet Sting, Sestet Step, Sestet Sill, Sestet Hold, Sestet Lend, Sestet Sip, Sestet Post, Sestet Bounce, Must Sestet, Verse Sestet, Court Tierce. Extra doors `sestet_cantor` / `tierce_precentor` / `span_trideca` / `court_tierce_regent`.

**#1177 stamps (do not clone; Wave-20 family CORE):** Septet Mend, Cadence Quarte, Tetradeca Span, Feud Turn, Septet Hood, Septet Sting, Septet Step, Septet Sill, Septet Hold, Septet Lend, Septet Sip, Septet Post, Septet Bounce, Must Septet, Verse Septet, Court Quarte. Extra doors `septet_cantor` / `quarte_precentor` / `span_tetradeca` / `court_quarte_regent`.

**#1189 families (do not restamp):** `sestet_mender` … `strike_plater`.

| SPELL_ID | Source | Learnable | Family / gate | Hole |
| :--- | :--- | :--- | :--- | :--- |
| `spell-camel-stride` | ENEMY_DISCOVERY | yes | blink_cutter / rank_lancer G≥19 | One next walk (3,2) |
| `spell-deca-oath` | ENEMY_DISCOVERY | yes | glass_sniper / pale_cantor | Next spell Chebyshev = 10 |
| `spell-glyph-reel` | ENEMY_DISCOVERY | yes | glyph_sower / rime_mason | Pull 1 toward glyph-tax |
| `spell-camel-bite` | ENEMY_DISCOVERY | yes | blink_cutter / shadow_lurker | Bonus if share (3,2) |
| `spell-hollow-mark` | ENEMY_DISCOVERY | yes | glyph_sower / bone_scribe | Turn-end detonate at leftover 0/0 |
| `spell-wide-plate` | ENEMY_DISCOVERY | yes | plate_warden / iron_golem | Negate if leftover AP≥2/MP≥1 |
| `spell-fuse-skip` | ENEMY_DISCOVERY | yes | tide_shade / plague_rat | PathLength 1 onto fuse no detonate |
| `spell-hollow-sting` | ENEMY_DISCOVERY | yes | plate_warden / iron_golem | Bonus if leftover 0/0 |
| `spell-summon-camel` | ELITE | yes | brood_chanter | Pets pay AP to land (3,2) |
| `spell-thin-gift` | ELITE | yes | pale_cantor / font_cantor | Heal iff leftover 1/0 |
| `spell-cadence-quint` | ENEMY_DISCOVERY | yes | cadence_thief / hex_chorister | Remaining n>5 → 5 |
| `spell-prime-toll` | ENEMY_DISCOVERY | yes | tax_scribe / ley_tollkeeper | Next walk +1 AP if leftover 1/1 |
| `spell-brick-levy` | ENEMY_DISCOVERY | yes | stone_castellan / rime_mason | Next walk +1 MP if adjacent barrier |
| `spell-watch-shave` | ELITE | yes | glass_sniper / hood_lurker | Overwatch snap −1 leftover MP |
| `spell-lean-gait` | ENEMY_DISCOVERY | yes | bone_scribe / purse_scribe | Bonus if leftover AP=0 and MP≥1 |
| `spell-glyph-cut` | ELITE | yes | glyph_sower / plague_rat | Bonus if near glyph-tax |
| `spell-fresh-plate` | ELITE | yes | brood_chanter / plate_warden | Negate if leftover AP equals max |
| `spell-pack-camel` | ENEMY_ONLY | no | camel_precentor CHAMPION | Pack walks locked to (3,2) |
| `spell-camel-fold` | BOSS_ONLY | no | camel_fold_regent | Fold two player-side bodies sharing (3,2) |

All unique rows STATUS: **PROPOSED**.

---

**Document status:** PROPOSED. Safe to review and to implement in sliced PRs after Wave-1 P0 through Wave-18 data, and after a human or orchestrator picks an ACTION_ID. Coordinate with #1132 so Sestet Mend / Cadence Tierce / Trideca Span land once as Wave-19 family CORE. Coordinate with #1177 so Septet Mend / Cadence Quarte / Tetradeca Span land once as Wave-20 family CORE. Not a license to land combat code in the same change as this spec.
