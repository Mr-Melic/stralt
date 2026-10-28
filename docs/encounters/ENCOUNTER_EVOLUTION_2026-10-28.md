# Encounter Evolution Catalog — 2026-10-28

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-28-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957), `ENCOUNTER_EVOLUTION_2026-10-24.md` (`EED-2026-10-24-001`, PR #1006), `ENCOUNTER_EVOLUTION_2026-10-25.md` (`EED-2026-10-25-001`, PR #1056), `ENCOUNTER_EVOLUTION_2026-10-26.md` (`EED-2026-10-26-001`, PR #1121), `ENCOUNTER_EVOLUTION_2026-10-27.md` (`EED-2026-10-27-001`, PR #1195). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-19 Wave 18 packs `docs/design/ENEMY_FORMATIONS_2026-10-27.md` (PR #1176), Wave 19 world features in `docs/WORLD_DYNAMICS.md` (PR #1172, `WDD-2026-10-27-001`), Rush Table R `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.17 (PR #1170). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-28) Wave 20 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 19 **families** (Sestet / Tierce / Trideca / Psalm and the rest of PR #1189) wait for a later formation drop (drop 20). Wave 20 **bosses** stay Rush-only (Table R). Wave 18 **families** (`stave_mender`, `stave_stinger`, `stave_stepper`, `stave_sipper`, `stave_siller`, `stave_holder`, `stave_lender`, `stave_prelate`, `stave_bouncer`, `stave_hooder`, `must_staver`, `verse_staver`, `ring_warder`, `hepta_oather`, `rime_reeler`, `rank_biter`, `last_marker`, `dual_plater`, `rift_skipper`, `fresh_stinger`, `prime_gifter`, `cadence_capper`, `cadence_docker`, `gait_toller`, `brick_holder`, `watch_drainer`, `even_gaiter`, `rime_cutter`, `hymn_turner`, `dodeca_prelate`, … — PR #1138 / drop 19) are legal **metadata locks** on drop-19 sheets, not a 30% lottery.

---

## 1. Why a twentieth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–19 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, Dry/Lean/Odd, Gaunt/Even/Brick/Orth, Poise/Knight/Pit/Spent, Tally/Rank/Spike/Odd, and Score/File/Lava/Ready. Day-19 rooms spent leftover drop-18 packs (`FSN-SCORE-STEP`, `FSN-SCORE-SIP`, `FSN-FILE-HEXA`, …) and Wave 18 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-19 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-19 Wave 18 packs | Day-19 taught leftover **AP + MP === 4 AND unequal** / remaining-AP-equals-max / same-**file** walk as **rooms**. Still PDFs: `FSN-STAVE-STEP`, `FSN-STAVE-SIP`, `FSN-RING-HEPTA`, `FSN-RIME-RANK`, `FSN-STAVE-GATE`, `FSN-LAST-DUAL`, `FSN-RIFT-FRESH`, `FSN-WATCH-EVEN`, `FSN-STAVE-CHOIR`, `FSN-PRIME-CAP`, `FSN-STAVE-QUIET`, `FSN-HYMN-STAVE`, `FSN-DOCK-VERSE`, `FSN-GAIT-BRICK`, `FSN-PURSE-STAVE`, `FSN-STAVE-HOLD` |
| World-feature Wave 19 | Day-19 **rooms** never spent `WF-HAZ-MATCH_SEAM`, `WF-HAZ-MATCH_CINDER`, `WF-TRP-MATCH_PLATE`, `WF-TER-MATCH_PANE`, `WF-OBS-MATCH_SILL`, `WF-ZON-MATCH_FONT`, `WF-TEL-MATCH_STEP`, `WF-INV-MATCH_FILE`, `WF-ELT-MATCH_PICKET`, `WF-TRS-MATCH_CACHE`, `WF-SPL-MATCH_TUTOR`, `WF-RSK-MATCH_OATH`, `WF-MOD-MATCH_CAST`, `WF-EVT-MATCH_HOUR`, `WF-ENV-MATCH_DRAFT` |
| Rush Table R | `R0`–`R3` (`trim_abbot`+`bait_vicar`, `ready_commissary`+`silent_conductor`, `lean_procurator`+`ivory_palisade`, `near_scholastic`+`ram_castellan`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `matchSeamCells` / `matchCinderCell` / `matchPlateCell` / `matchPaneCell` / `matchSillCell` / `matchFontCell` / `matchStepPads` / `matchCastArmed` / `matchPicketArmed` / `matchDraftArmed` / `matchHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8**. Nine Plug (`nine_prelate`, `FSN-POISE-HOLD/NINE`) counts as **9**. Dec Plug (`dec_prelate`, `FSN-TALLY-HOLD/DEC`) counts as **10**. Hendeca Plug (`hendeca_prelate`, `FSN-SCORE-HOLD/HENDECA`) counts as **11**. Dodeca Plug (`dodeca_prelate`, `FSN-STAVE-HOLD/DODECA`) counts as **12** — wait for remaining cap ≥ 12 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Stave / Prime Gift / Score / Lean Gift / Equal Gift / Shove Gift / Tally / Poise / Hollow Gift / Drift Gift / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Stave Mend / Prime Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Score Mend as Stave Mend (Score is leftover **sum === 4 AND unequal**; Stave is leftover **sum === 5**). Do **not** clone Tally Mend as Stave Mend (Tally is leftover **sum === 3**). Do **not** clone Poise Mend as Stave Mend (Poise is **both leftover AP === MP ≥ 1**). Do **not** clone Gaunt Mend as Stave Mend (Gaunt is **both leftover 0**). Do **not** clone Equal Gift as Prime Gift (Equal Gift is **target-only** tied ≥ 1; Prime Gift is leftover **exactly 1/1**). Do **not** clone Duel Turn as Hymn Turn (Duel Turn is **two hostiles**; Hymn Turn is **two allies**, caster stays). Do **not** clone Watch Drain as Watch Root or Watch Sip (Drain **steals leftover MP**; Root **zeros leftover MP**; Sip **steals leftover AP**). Do **not** clone Rank Bite as File Bite or Axis Bite (Rank Bite is **rank-only**; File Bite is **file-only**; Axis Bite is rank **or** file). Do **not** clone Dual Plate as Dual Keep or Poise Hood (Dual Plate is leftover AP **even ≥ 2 AND** leftover MP **even ≥ 2** miss; Dual Keep is a **bank**; Poise Hood is leftover **AP === MP ≥ 1**). Do **not** clone Brick Hold as Brick Brace (Hold is a **walk lock**; Brace is a **hit miss**).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-MATCH_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow / Stride / Near / Ready). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-MATCH_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-20 ids (`trim_abbot`, `ready_commissary`, `lean_procurator`, `near_scholastic`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Score Step / **Stave Step** / Brick Step **does not** count as leftover walk-MP for Stave Mend, Stave Sting, Stave Sip, Stave Sill, Stave Post, Must Stave, Verse Stave, Stave Hold, Even Gait, Fresh Sting, or Prime Gift. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Stave Step dests are occupancy, **not** `isSwap`. Brick Hold **does not move** the barrier and **does not negate hits**.
- Stave Mend pays 8 only if **caster and target** leftover AP + leftover MP **=== 5** after the 3 AP is paid. One broken sum is 0 HP. Dual Keep leftover **cannot** sit on sum 5 (max surviving leftover is 2/2 = sum 4). Dual Keep 2/2 is **Poise / Dual Plate, not Stave**. Dual Keep 1/1 is **Prime Gift, not Stave**. Dual Keep leftover-sum 4 unequal is **Score**. Dual Keep leftover-sum 3 is **Tally**. Dual Keep 0/0 is **Gaunt**. Tally Lend (2,1)→(3,2) **manufactures Stave**. `0 = 0` is Gaunt’s window, not this primer. `2 = 2` is Poise’s window, not this primer. `3 = 1` is Score’s window, not this primer. `3 = 0` is Tally’s window, not this primer. `1 = 1` is Prime Gift’s window, not this primer. Stave Step relocates onto a free Chebyshev-1 of an ally whose leftover AP + leftover MP === 5 — not Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally Step. Stave Sting is 10, +8 iff leftover AP + leftover MP === 5. Stave Sip steals 1 leftover AP iff leftover sum === 5 **and leftover AP ≥ 1** ((0,5) fizzles; (3,2)→(2,2) **manufactures Poise**; (4,1)→(3,1) **manufactures Score**). Ring Stride makes the **next** walk dest Chebyshev **exactly 2**, knight `(2,1)` **excluded**. Orthogonal 2 and diagonal `(2,2)` **are** legal. Hepta Oath wants the next spell at Chebyshev **exactly 7**; Strike stays legal. Rime Reel is the **eleventh** `applyAttract` dest (file / ally / foe / paint / hazard / void / barrier / pit / spike / lava / then **ice occupancy**). Dest is **toward**, not onto, a world portal. Rank Bite bonuses a target who shares the caster’s **rank only** (file match without rank is 0). Last Mark detonates on **last leftover AP spent while occupying the painted cell**; walk-on / leftover-AP-remaining spell-from / leftover-AP-remaining Strike-from / teleport / Swap / Stave Step are free. Stave Post detonates on end-turn occupy **and leftover AP + leftover MP === 5**; walk-on is safe; dump a pool is safe; Dual Keep 2/2 is safe; leftover-sum 4 unequal is safe; leftover-sum 3 is safe. Stave Sill taxes start-turn occupy **and leftover sum === 5**; paint stays. Rift Skip is next **1-tile** walk treating **Void Rift enter-tax** as floor; lava / spikes / pits / rime / glyph / cinder / mire / shock still tick. Dual Plate zeros the next hit **while leftover AP even ≥ 2 AND leftover MP even ≥ 2**; leftover 0 is even and **excluded**; leftover 1/1 lands. Watch Drain: overwatch snap **steals 1 leftover MP** on the walker (inverse of Watch Root’s leftover-MP zero and Watch Sip’s leftover-AP steal). Even Gait is leftover **MP even and ≥ 2** (0 is even and **excluded**). Fresh Sting is leftover **AP equals that body’s max AP** (leftover 3 from a higher max **misses**). Prime Gift heals iff leftover is **exactly 1/1**. Hymn Turn inverts leftover AP↔MP on **two allies**; caster leftover **unchanged**. Verse Stave makes the last id illegal until leftover sum === 5 (`0 = 0` does not peel; `2 = 2` does not; `3 = 1` does not; `3 = 0` does not; `1 = 1` does not; shove does not). Must Stave makes remaining **non-Strike** spells illegal unless leftover sum === 5 **and** last AP. Stave Hold refuses walk MP until leftover sum === 5; spells stay legal. Cadence Cap writes remaining `n>2` → `2`. Cadence Dock writes remaining `n===2` → `0`. Gait Toll is leftover-MP=0 next-**walk** +1 AP. Brick Hold zeros walks if a **barrier is adjacent**; destroying the barrier resumes walks and lock **stays**.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 18 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-STAVE-01 / ENC-SPELL-39 / ENC-ELITE-38 (mend skin) | leftover AP + leftover MP **=== 5** on **both** bodies **or** occupancy dest for Stave Step | Convert to ENC-SCORE-01 (queued day-19) without claiming Stave Mend |
| ENC-FIVE-01 / ENC-ELITE-38 (sting skin) | leftover-sum===5 poke **or** leftover-sum leftover-AP steal ((0,5) fizzles; (3,2)→(2,2) manufactures Poise; (4,1)→(3,1) manufactures Score) | Convert to ENC-UNEQ-01 (queued day-19) without claiming Stave / Five |
| ENC-RING-01 / ENC-SPELL-40 | next-walk dest Chebyshev == 2 AND not knight **or** next-spell exact Chebyshev 7 | Convert to ENC-FILE-02 or ENC-KNIGHT-01 (queued day-17/19) without claiming Ring / Hepta |
| ENC-RIME-02 | eleventh `applyAttract` dest (ice occupancy) **or** share-rank-only bite | Convert to ENC-LAVA-01 (queued day-19) without claiming Rime Reel |
| ENC-GATE-07 | leftover-sum===5 occupy detonate **and** walk-on 0 **or** `summonAI === "stavepost"` | Convert to ENC-GATE-06 (queued day-19) without claiming Stave Gate |
| ENC-LAST-02 | last-leftover-AP-on-cell consume **or** leftover even/even ≥ 2 miss | Convert to ENC-STRIKE-01 (queued day-19) without claiming Last Mark / Dual Plate |
| ENC-RIFT-01 | 1-tile Void Rift-tax-as-floor **or** leftover-AP===max poke | Convert to ENC-SHOCK-01 (queued day-19) without claiming Rift Skip |
| ENC-SNAP-04 | overwatch snap **steals 1 leftover MP** | Convert to ENC-SNAP-03 (queued day-19) without claiming Watch Drain |
| ENC-PRIME-02 | leftover exactly 1/1 heal **or** remaining `n>2` → `2` | Convert to ENC-LEAN-02 leftover without claiming Prime Gift / Cap |
| ENC-HYMN-01 | two-ally leftover AP↔MP invert **or** Dual Keep leftover as leftover | Convert to ENC-DUEL-02 leftover without claiming Hymn Turn |
| ENC-HOLD-09 / ENC-RARE-20 | walk refuse until leftover sum === 5 **or** tools-until leftover-sum===5 **and** last AP | Convert to ENC-HOLD-08 (queued day-19) without claiming Stave Hold |
| ENC-DOCK-01 / ENC-PRIME-02 (cap skin) | remaining `n===2` → `0` **or** remaining `n>2` → `2` | Convert to ENC-SNUFF-01 (queued day-19) without claiming Dock / Cap |
| ENC-QUIET-04 | leftover-sum-5 join + leftover-sum-5 heal + cover | Convert to ENC-STAVE-01 leftover without claiming Quiet |
| ENC-PANE-01 | walk-through LoS-block pane that smashes 1 AP only while remaining AP === remaining MP | Convert to ENC-COLUMN-01 (queued day-19) without claiming Match Pane |
| ENC-PLATE-01 | occupancy-walk onto plate is free while mismatched; first **matched** enter taxes | Convert to ENC-SKEW-01 (queued day-19) without claiming Match Plate |
| ENC-SILL-01 | wall→floor after player end-turn with remaining AP equal to remaining MP | Convert to ENC-READY-01 (queued day-19) without claiming Match Sill |
| ENC-PAD-03 | pad swap only while remaining AP equals remaining MP before the 1 MP | Convert to ENC-PAD-02 (queued day-19) without claiming Match Step |
| ENC-PROT-20 | Match Font heal only if remaining AP equals remaining MP | Convert to ENC-PROT-19 (queued day-19, Pair) without claiming Match |
| ENC-PRIO-22 | one-cast if the player ends a turn with remaining AP equal to remaining MP while they live | Convert to ENC-PRIO-21 (queued day-19) without claiming Match Tutor |
| ENC-AMBUSH-20 | elite appears only while remaining AP equals remaining MP | Convert to ENC-AMBUSH-19 (queued day-19, remaining-AP-equals-max) without claiming Match |
| ENC-SURV-38 | end-of-turn tax if remaining AP equals remaining MP | Convert to ENC-SURV-37 (queued day-19) without claiming Match Draft |
| ENC-MATCH-01 | first elite cannot spend AP until second dies **or** player ends with remaining AP = remaining MP | Convert to ENC-READY-02 (queued day-19) without claiming Match File |
| ENC-TEACH-20 / ENC-HAZ-40 | match (remaining AP === remaining MP) seam tax **or** SpellConfig legal only while remaining AP equals remaining MP | Convert to ENC-TEACH-19 / ENC-HAZ-38 (queued day-19) without claiming Match / Match Cast |
| ENC-HAZ-39 | orb hunts a currently matched unit | Convert to ENC-HAZ-37 (queued day-19) without claiming Match Cinder |
| ENC-BRICK-01 | leftover-MP=0 next-walk +1 AP **or** barrier-adjacent walk lock | Convert to ENC-BRACE-01 (queued day-19) without claiming Gait Toll / Brick Hold |
| ENC-RUSH-75…78 | Table R bosses + Snip/Coffer/Fast/Visor objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Stave / Ring / Rime / Match primer + inserts)

Standard chain (maxDepth 4 or 5):

```
teach mechanic
  → reinforce
  → combine
  → pressure
  → choice / rest
  → mastery
  → boss
```

| Beat | Depth hint | Job | Day-20 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (match-seam hop, leftover-sum-5 heal, match cinder) | ENC-TEACH-20, ENC-SPELL-39, ENC-HAZ-39 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-21, ENC-AMBUSH-20, ENC-SPELL-40 |
| Combine | 2–3 | Two taught verbs | ENC-STAVE-01, ENC-FIVE-01, ENC-RING-01, ENC-HAZ-40, ENC-PANE-01, ENC-GATE-07 |
| Pressure | 3 | Clock, match draft, pull-to-ice, or leftover-sum-5 miss | ENC-SURV-38, ENC-PROT-20, ENC-RIME-02, ENC-SNAP-04, ENC-PRIO-22, ENC-MATCH-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-20, ENC-BRANCH-20, ENC-TREAS-20, ENC-OATH-03, ENC-HOUR-04, ENC-PAD-03 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-38, ENC-ELITE-39, ENC-RARE-20, ENC-MAST-20, ENC-LAST-02, ENC-RIFT-01, ENC-DOCK-01, ENC-HOLD-09 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-21, ENC-BOSS-20, ENC-RUSH-75…78 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–19 remain valid. Day-20 **Stave / Ring / Rime / Match primer** is the default for accounts that already cleared Score / File / Lava / Ready once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-20

ENCOUNTER_ID: ENC-TEACH-20  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a match-HP path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile balanced-slate ribbon of `WF-HAZ-MATCH_SEAM` across the mid-band (walk tiles cost 4% max HP **only while remaining AP equals remaining MP**; mismatched remaining pools are free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First matched-step tax logs a teach line. Do not also apply Pair Seam (ENC-TEACH-19: tax while another living unit is Chebyshev ≤ 1), Hale Seam (ENC-TEACH-18: tax while current HP ≥ 50%), Spent Seam (ENC-TEACH-17: tax on **0 remaining AP**), Last Seam (ENC-TEACH-16: tax on **0 remaining MP**), Even Seam, Odd Seam, Bonded Seam (tax while you have no living summon), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: cross while remaining AP disagrees with remaining MP so the ribbon is free floor, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is a tax while the two remaining pools match, free floor once they disagree; dumping one pool is the expensive answer, not a bigger nuke.” Inverse of ENC-SURV-38’s end-turn match tax. Prepares ENC-HAZ-40 / ENC-TREAS-20 (match / match devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-MATCH_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-39`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-39

ENCOUNTER_ID: ENC-HAZ-39  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a matched body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-MATCH_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit whose remaining AP currently equals remaining MP; ties prefer the lowest combatant id; if nobody is matched, it sits still; 5% max HP on land). Inverse of Busy Cinder (ENC-HAZ-37: hunts the **most AP spent last round**). Distinct from Lean Cinder (ENC-HAZ-33: hunts the **fewest remaining AP**), Cast Cinder (ENC-HAZ-35: last `SpellConfig` spender), Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Hurt Cinder (lowest HP%), Rich Cinder (highest HP%), and Orbiting Cinder (clockwise square). Attack Nearest **does not** pull it (it reads remaining pools, not last AP spend). A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: stay mismatched so it sits, or bait it onto a matched enemy caster.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts a **currently matched** body, not the busiest AP spender.” Distinct from ENC-HAZ-37 (busy / most AP spent).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: bishop starts matched so the orb prefers it until you mismatch. High: inherit one match-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-40

ENCOUNTER_ID: ENC-HAZ-40  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. `SpellConfig` spends are illegal while remaining AP disagrees with remaining MP if `WF-MOD-MATCH_CAST` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-20 match-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-20`) **plus** `WF-MOD-MATCH_CAST` armed (each combatant may spend a `SpellConfig` only while remaining AP equals remaining MP before that spend; Attack Nearest, summons, occupancy-walks, and 0-spell turns stay legal). A dry detour exists. Inverse of Once Cast (ENC-HAZ-38: at most one `SpellConfig` this turn). Distinct from Walk Lock (ENC-HAZ-36: after a walk, no casts), Cast Lock (ENC-HAZ-34: after a spell, no walks), Act Lock (ENC-HAZ-32: after **any** AP spend), File Walk (committed facing after the first step), and One Stride (at most 1 MP).  
SPECIAL_RULES: Scripted hazards only. Match Cast does not rewrite damage. Attack Nearest is not a spell. Teleport tiles are not walks.  
OBJECTIVE: Clear all. Intended: dump one pool then Attack Nearest; equalize then Frost; cross the seam while mismatched, or walk the dry detour.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine match-HP tax with a match-only-cast lock so “Frost then Inferno then dash through a matched clump” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Mismatched Attack Nearest remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Stave Sting. Peak: add `WF-ENV-MATCH_DRAFT` so ending matched is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-39

ENCOUNTER_ID: ENC-SPELL-39  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-STAVE-STEP/SOLO-MEND` fallback — 1× `stave_mender` queen (`spell-stave-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Stave Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Stave-Mends only if **caster and target** leftover AP + leftover MP === 5 **and** missing HP ≥ 8; else Shields. Dual Keep 2/2 is **Poise, skip**. Dual Keep leftover-sum 4 unequal is **Score, skip**. Dual Keep leftover-sum 3 is **Tally, skip**. Dual Keep 1/1 is **Prime Gift, skip**. Dual Keep **cannot** open Stave. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Mend (8 paid on leftover-sum===5 flags) can drop `spell-stave-mend` if missing. Do **not** grant `spell-score-mend`, Tally Mend, Poise Mend, Gaunt Mend, or Prime Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-stave-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Stave Mend, convert to ENC-STAVE-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-sum-5 writer → ENC-SPELL-37 leftover without claiming Stave. Band 0 → show `FSN-SCORE-STEP`. Dual Keep leftover **cannot** fake sum 5. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 1` does **not** fire. `3 = 0` does **not** fire. `1 = 1` does **not** fire.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-stave-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “leftover-sum===5 flags cash 8; Dual Keep 2/2 is Poise, not Stave; Tally Lend can manufacture the window.” Distinct from ENC-SPELL-37 (leftover-**sum === 4 AND unequal**).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Stave Step on a second queen (promote to ENC-STAVE-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-40

ENCOUNTER_ID: ENC-SPELL-40  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-RING-HEPTA/SOLO-STRIDE` fallback — 1× `ring_warder` pawn or knight (`spell-ring-stride` + `physical_attack`) + 1× bishop (`starter-frost` only). Hepta Oath off until band 1 honesty.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal Chebyshev-2 non-knight floor. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Ring Stride (Chebyshev-2 dest lock, knight hop excluded) can drop `spell-ring-stride` if missing. If already owned, glyph is `starter-frost`. Extra room `ring_gallery` is **not** this family.  
MAP_REQUIREMENTS: Open court with room to stand at Chebyshev-2 dests that are not knight hops. Optional glyph (`discoverSpellId: spell-ring-stride`).  
SPECIAL_RULES: If the player already owns Ring Stride, convert to ENC-RING-01. Honesty: missing Chebyshev-2 non-knight dest filter → ENC-SPELL-38 leftover without claiming Ring. Band 0 → show `FSN-FILE-HEXA`. Knight hops are illegal. Orthogonal 2 and `(2,2)` stay legal. Stand / Swap / forced-move still answer. Never PAIR Ring Stride + Rank Bite.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: stand, Swap, or take a legal Chebyshev-2 non-knight step.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-ring-stride`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the next walk is a ring of 2, not a knight hop and not a file lock.” Distinct from ENC-SPELL-38 (same-**file** + exact-6).  
SOLVABILITY_REQUIREMENTS: At least one legal Chebyshev-2 non-knight floor dest from the player’s start. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Hepta Oath (promote to ENC-RING-01). Never pack File Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-STAVE-01

ENCOUNTER_ID: ENC-STAVE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STAVE-STEP` — 1× `stave_mender` queen (`spell-stave-mend` + `starter-shield`) + 1× `stave_stepper` queen without heal (`spell-stave-step` + `physical_attack`). No Score / Tally / Poise / Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift / Equal / Lean / Prime Mend on PAIR. No Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Cover Step on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if leftover sum ≠ 5. Stepper protector; skip if ally leftover sum ≠ 5 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Mend or a legal Stave Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Stave Mend: 8 HP iff **caster and target** leftover AP + leftover MP === 5. One broken sum is 0 HP. Stave Step is not ungated Home Step and not Score Step. Band 0 → show `FSN-SCORE-STEP`. Honesty reroll → ENC-SCORE-01. Dual Keep leftover **cannot** fake sum 5. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 1` does **not** fire. `3 = 0` does **not** fire. `1 = 1` does **not** fire.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2 (Poise window, closes Stave) **or** dump one pool so the sum leaves 5 **or** Tally Lend to manufacture (3,2).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-5 discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum===5 healer + leftover-sum===5 joiner. Distinct from ENC-SCORE-01 (leftover-**sum === 4 AND unequal**) and ENC-TALLY-01 (leftover-**sum === 3**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-STAVE-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-STAVE-QUIET` (add cover). Peak: inherit one match-seam gallery. Never `titans_vigor`. Never pack Score Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-FIVE-01

ENCOUNTER_ID: ENC-FIVE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STAVE-SIP` — 1× `stave_stinger` pawn (`spell-stave-sting` + `physical_attack`) + 1× `stave_sipper` pawn without heal (`spell-stave-sip` + `physical_attack`). No Score / Tally / Poise / Gaunt / Dry / Lean / Damp / Ready / Full / Odd / Even / Fresh Sting on PAIR. No Score / Tally / Poise / Bare / Parched / Gait / Drift / Watch Sip on PAIR.  
AI_REQUIREMENTS: Stinger commits on leftover sum === 5; skip rider unless 10 still kills. Sipper skip if leftover sum ≠ 5 **or** leftover AP = 0. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Sting or a legal Stave Sip can drop that id if missing. Do **not** grant Score Sting / Score Sip.  
MAP_REQUIREMENTS: `openField`. Sipper needs a tile at range 3 that is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Stave Sting: 10, +8 iff leftover sum === 5. Stave Sip: steal 1 leftover AP iff leftover sum === 5 and leftover AP ≥ 1. (0,5) fizzles. (3,2)→(2,2) **manufactures Poise**. (4,1)→(3,1) **manufactures Score**. Band 0 → show `FSN-SCORE-SIP`. Honesty reroll → ENC-UNEQ-01. Dual Keep cannot open the 8.  
OBJECTIVE: Defeat both. Intended: sit on Dual Keep 2/2 so the sting misses, or dump leftover AP so Sip fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-5 discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum===5 poke + leftover-sum leftover-AP steal. Distinct from ENC-UNEQ-01 (leftover-**sum === 4 AND unequal**).  
SOLVABILITY_REQUIREMENTS: Both reachable. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-STAVE-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: enable Stave Sill on a third body (promote to ENC-GATE-07). Never pack Score Sting on this PAIR.  
STATUS: PROPOSED

---

### ENC-RING-01

ENCOUNTER_ID: ENC-RING-01  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-RING-HEPTA` — 1× `ring_warder` knight (`spell-ring-stride` + `physical_attack`) + 1× `hepta_oather` bishop (`spell-hepta-oath` + `starter-frost`). No File / Rank / Knight / Orth / Diag / Inch Stride on PAIR. No Hexa / Penta / Quad / Tri / Mid / Long Oath on PAIR.  
AI_REQUIREMENTS: Warder skips if 0 MP or no legal Chebyshev-2 non-knight floor. Oather skips if they have no ranged id. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Ring Stride or Hepta Oath can drop that id if missing. Extra rooms `ring_gallery` / `hepta_nave` are **not** these families.  
MAP_REQUIREMENTS: Open court with a legal Chebyshev-2 non-knight floor **and** a tile at Chebyshev 7. Reject a 1-tile closet.  
SPECIAL_RULES: Family lottery **off**. Ring Stride: next walk dest Chebyshev **exactly 2**, knight `(2,1)` **excluded**. Orthogonal 2 and `(2,2)` legal. Hepta Oath: next spell exact Chebyshev **7**; Strike stays legal. Band 0 → show `FSN-FILE-HEXA`. Honesty reroll → ENC-FILE-02. Blink does not pay. Never PAIR Ring Stride + Rank Bite.  
OBJECTIVE: Defeat both. Intended: stand, Swap, or take a legal ring step; Strike instead of a ranged id while the oath is up.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Ring / Hepta discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Chebyshev-2 ring walk + exact-7 oath. Distinct from ENC-FILE-02 (same-**file** + exact-6).  
SOLVABILITY_REQUIREMENTS: A legal Chebyshev-2 non-knight dest and a Chebyshev-7 tile exist. Strike remains a legal answer.  
REPLAYABILITY: Warder chassis knight vs pawn. Variant `FSN-RING-HEPTA/GUN`.  
SCALING_BEHAVIOUR: High: enable Stave Hold on a third body. Never pack File Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-RIME-02

ENCOUNTER_ID: ENC-RIME-02  
TYPE: hazard / priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-RIME-RANK` — 1× `rime_reeler` bishop (`spell-rime-reel` + `starter-frost`) + 1× `rank_biter` knight (`spell-rank-bite` + `physical_attack`). No Lava / Spike / Pit / Brick / Void / Cinder / Paint / Foe / Ally / File Reel on PAIR. No File / Axis / Screen / Foe / Side / Lone Bite on PAIR.  
AI_REQUIREMENTS: Reeler skips if no ice occupancy in 6. Biter skip rider if they do not share **rank only** unless 10 still kills. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Rime Reel or Rank Bite can drop that id if missing. Extra room `frost_aisle` is **not** this family.  
MAP_REQUIREMENTS: One ice gallery of 3–5 tiles off the only path. Exit behind the reeler. Ice never on spawn±3 or the portal.  
SPECIAL_RULES: Family lottery **off**. Rime Reel is the **eleventh** `applyAttract` dest (ice occupancy). Dest is **toward**, not onto, a world portal. Rank Bite: 10 + 10 if `target.y == caster.y` and `target.x != caster.x`; file-only → 10 only. Band 0 → show `FSN-LAVA-FILE`. Honesty reroll → ENC-LAVA-01. Never PAIR Rime Reel + Lava Reel. Never PAIR Rank Bite + Rank Stride.  
OBJECTIVE: Defeat both. Intended: stand off the reeler’s rank, or step so ice is not the cheapest dest.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Rime / Rank discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Pull toward ice + share-rank-only bite. Distinct from ENC-LAVA-01 (lava occupancy + share-file-only).  
SOLVABILITY_REQUIREMENTS: Ice gallery is not a cut-vertex. Reeler dest leaves a walk-off that is **not** the ice cell **and not** a world portal.  
REPLAYABILITY: Ice west vs east. Variant `FSN-RIME-RANK/GLYPH`.  
SCALING_BEHAVIOUR: Peak: inherit one match-seam on a **flank**. Never two reelers.  
STATUS: PROPOSED

---

### ENC-GATE-07

ENCOUNTER_ID: ENC-GATE-07  
TYPE: protection objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STAVE-GATE` — 1× `stave_prelate` pawn (`spell-stave-post` + `physical_attack`) + 1× `stave_siller` rook (`spell-stave-sill` + `starter-frost`). No Score / Tally / Poise / Gaunt / Dummy / Drift / Lean Post on PAIR. No Score / Tally / Poise / Gaunt / Wake / Parched / Drift / Quiet Sill on PAIR.  
AI_REQUIREMENTS: Prelate `isSummoner` for stavepost only; skip if remaining cap < 1 or the plant cell is blocked. Siller skip if occupant leftover sum already ≠ 5. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Post or Stave Sill can drop that id if missing.  
MAP_REQUIREMENTS: Two different painted tiles: post cell and sill cell. Exit reachable without occupying either.  
SPECIAL_RULES: Family lottery **off**. Stave Post: end-turn occupy **and leftover sum === 5** detonates; walk-on is **safe**; dump a pool is **safe**; Dual Keep 2/2 is **safe**; leftover-sum 4 unequal is **safe**; leftover-sum 3 is **safe**. Stave Sill: start-turn occupy **and leftover sum === 5** taxes 8; paint stays. `summonAI === "stavepost"` required. Band 0 → show `FSN-SCORE-GATE`. Honesty reroll → ENC-GATE-06. Two different tiles. Never a second post.  
OBJECTIVE: Defeat both. Intended: walk onto the post with leftover sum ≠ 5, dump a pool before end-turn, or sit Dual Keep 2/2.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Leftover-sum===5 post + start-turn leftover-sum===5 sill. Distinct from ENC-GATE-06 (leftover-**sum === 4 AND unequal**).  
SOLVABILITY_REQUIREMENTS: Both tiles floor. Player keeps ≥ 1 walk-off after a hypothetical occupy. Living hostiles ≤ 3 (post counts as 1).  
REPLAYABILITY: Post north vs east of sill. Variant `FSN-STAVE-GATE/STING`.  
SCALING_BEHAVIOUR: High: enable Stave Sting on a third body. Never Dodeca on this CELL (cap 2).  
STATUS: PROPOSED

---

### ENC-LAST-02

ENCOUNTER_ID: ENC-LAST-02  
TYPE: hazard / elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LAST-DUAL` — 1× `last_marker` bishop (`spell-last-mark` + `starter-frost`) + 1× `dual_plater` rook (`spell-dual-plate` + `starter-shield`). No Strike / Swap / Shove / Cast / Wake / Dwell Marker on PAIR. No Dry / Gait / Spent / Odd / Own / Off / Stave Hood on PAIR.  
AI_REQUIREMENTS: Marker skips if no last-AP spender in the pack. Plater skip if leftover AP or leftover MP is odd **or** < 2. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Last Mark or Dual Plate can drop that id if missing. Extra room `last_pulpit` is **not** this family.  
MAP_REQUIREMENTS: One painted last-mark cell off the only path. Exit reachable without occupying it.  
SPECIAL_RULES: Family lottery **off**. Last Mark: last leftover AP spent while occupying the painted cell detonates and consumes; walk-on is **free**; leftover-AP-remaining spell-from is **free**; leftover-AP-remaining Strike-from is **free**; teleport / Swap / Stave Step do not pay. Dual Plate: next hit 0 **while leftover AP even ≥ 2 AND leftover MP even ≥ 2**; leftover 0 excluded; leftover 1/1 lands. Band 0 → show `FSN-STRIKE-DRY`. Honesty reroll → ENC-STRIKE-01. Never Mark+Goad as PAIR (`/GOAD` is the 3-body). Never Plate+Sting as PAIR (`/FRESH` is Dual Fresh).  
OBJECTIVE: Defeat both. Intended: walk onto the paint with leftover AP remaining, or sit leftover 1/1 so Dual Plate lands.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Last-AP-on-cell paint + leftover even/even ≥ 2 miss. Distinct from ENC-STRIKE-01 (Strike-from-cell + leftover-MP=0 miss).  
SOLVABILITY_REQUIREMENTS: Paint is floor, not a portal. Strike with leftover AP remaining is a complete answer.  
REPLAYABILITY: Paint west vs east. Variant `FSN-LAST-DUAL/GOAD` at high (3-body).  
SCALING_BEHAVIOUR: High: promote to `/GOAD`. Never two paints.  
STATUS: PROPOSED

---

### ENC-RIFT-01

ENCOUNTER_ID: ENC-RIFT-01  
TYPE: hazard / elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-RIFT-FRESH` — 1× `rift_skipper` bishop (`spell-rift-skip` + `physical_attack`) + 1× `fresh_stinger` pawn (`spell-fresh-sting` + `physical_attack`). No Shock / Mire / Rime / Glyph / Cinder / Spike / Lava / Pit Skip on PAIR. No Full / Even / Odd / Gaunt / Stave / Score / Tied Sting on PAIR.  
AI_REQUIREMENTS: Skipper skip if the next walk is not a 1-step across Void Rift. Stinger skip rider if leftover AP ≠ max AP unless 10 still kills. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Rift Skip or Fresh Sting can drop that id if missing. Extra room `rift_court` is **not** this family.  
MAP_REQUIREMENTS: One Void Rift cell on a 1-tile aisle plus a floor path around it. Exit behind the skipper.  
SPECIAL_RULES: Family lottery **off**. Rift Skip: next **1-tile** walk treats Void Rift enter-tax as floor; lava / spikes / pits / rime / glyph / cinder / mire / shock still tick; length ≥ 2 pays. Fresh Sting: leftover **AP equals that body’s max AP**; leftover 3 from a higher max **misses**. Band 0 → show `FSN-SHOCK-EVEN`. Honesty reroll → ENC-SHOCK-01. Never two rifts.  
OBJECTIVE: Defeat both. Intended: hop the rift in one tile, or spend AP so leftover ≠ max before the sting.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: 1-tile Void Rift skip + leftover-AP===max poke. Distinct from ENC-SHOCK-01 (shock skip + leftover-AP even ≥ 2).  
SOLVABILITY_REQUIREMENTS: A floor path around the rift. Rift never walls a corridor.  
REPLAYABILITY: Rift west vs east aisle. Variant `FSN-RIFT-FRESH/TIDE`.  
SCALING_BEHAVIOUR: High: inherit one match-seam on a **gallery**. Never pack Shock Skip on this CELL.  
STATUS: PROPOSED

---

### ENC-SNAP-04

ENCOUNTER_ID: ENC-SNAP-04  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WATCH-EVEN` — 1× `watch_drainer` bishop (`spell-watch-drain` + `starter-frost`) + 1× `even_gaiter` pawn (`spell-even-gait` + `physical_attack`). No Watch Root / Bank / Sip / Alm / Lend / Fee / Mute on PAIR. No Odd / Lone / Pair / Even Sting / Tied / Full / Dry Gait on PAIR.  
AI_REQUIREMENTS: Drainer skip if leftover MP already 0 **or** no overwatch is armed. Gaiter skip if leftover MP is odd **or** leftover MP = 0 unless 10 still kills. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Watch Drain or Even Gait can drop that id if missing.  
MAP_REQUIREMENTS: One overwatch painted cell with a walk-through aisle. Exit reachable without the overwatch.  
SPECIAL_RULES: Family lottery **off**. Watch Drain: snap still deals; **walker** leftover MP **−1**, transferred to watcher; never zeros the bar (that is Watch Root); never steals leftover AP (that is Watch Sip). Even Gait: leftover **MP even and ≥ 2**; leftover MP 0 is even and **excluded**. Band 0 → show `FSN-WATCH-ODD`. Honesty reroll → ENC-SNAP-03. Never Drain+Gun as PAIR (`/GUN` is the 3-body).  
OBJECTIVE: Defeat both. Intended: dump leftover MP to 0 or 1 so Drain / Even Gait miss, or walk around the overwatch.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Overwatch snap steals leftover MP + leftover-MP-even ≥ 2 poke. Distinct from ENC-SNAP-03 (snap **zeros leftover MP**).  
SOLVABILITY_REQUIREMENTS: Path around the overwatch. Snap is not a wall.  
REPLAYABILITY: Overwatch north vs east. Variant `FSN-WATCH-EVEN/GUN` at high.  
SCALING_BEHAVIOUR: High: promote to `/GUN`. Never two overwatches.  
STATUS: PROPOSED

---

### ENC-HYMN-01

ENCOUNTER_ID: ENC-HYMN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HYMN-STAVE` — 1× `hymn_turner` queen without heal (`spell-hymn-turn` + `starter-frost`) + 1× `stave_mender` queen (`spell-stave-mend` + `starter-shield`) + 1× `stave_stinger` pawn (`spell-stave-sting` + `physical_attack`). No Duel / Purse Turn on this BRIGADE as a second invert. No Score / Tally / Poise Mend on PAIR with the mender.  
AI_REQUIREMENTS: Turner skip if pack size < 3 **or** both leftover pairs already equal; invert two **allies**; caster leftover **unchanged**. Mender / stinger use leftover-sum===5 gates. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Hymn Turn or Stave Mend can drop that id if missing. Do **not** grant Duel Turn.  
MAP_REQUIREMENTS: Open court, three start tiles ≥ 4 apart. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Hymn Turn: invert leftover AP↔MP on **two allies**; sum invariant; equal leftover is a no-op; caster stays. Never Duel Turn / Purse Turn PAIR. Dual Keep leftover **is** leftover after the invert. Honesty reroll → ENC-DUEL-02. Band 0 → show `FSN-STAVE-STEP`.  
OBJECTIVE: Defeat all three. Intended: kill the turner first so the leftover-sum-5 window cannot be manufactured, or Dual Keep 2/2 so Stave still misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Hymn discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two-ally leftover invert + leftover-sum===5 heal + leftover-sum===5 sting. Distinct from ENC-DUEL-02 (two-**hostile** invert).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Turner skip if pack < 3.  
REPLAYABILITY: Turner north vs east.  
SCALING_BEHAVIOUR: Peak: inherit one match-seam gallery. Never pack Duel Turn on this BRIGADE.  
STATUS: PROPOSED

---

### ENC-PRIME-02

ENCOUNTER_ID: ENC-PRIME-02  
TYPE: spell-discovery / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PRIME-CAP` — 1× `prime_gifter` queen (`spell-prime-gift` + `starter-shield`) + 1× `cadence_capper` bishop (`spell-cadence-cap` + `starter-frost`) + 1× pawn (`physical_attack`). No Stave / Score / Tally / Poise / Gaunt / Hollow / Equal / Lean Mend on PAIR with the gifter. No Cadence Dock / Snuff / Rise / Prime / Floor on PAIR with the capper.  
AI_REQUIREMENTS: Gifter skip if leftover is not **exactly 1/1** or missing HP < 10. Dual Keep 1/1 **opens** the window; Dual Keep 2/2 is Poise, skip. Capper skip if every remaining is already ≤ 2. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Prime Gift or Cadence Cap can drop that id if missing. Do **not** grant Stave Mend or Cadence Dock.  
MAP_REQUIREMENTS: Open court plus one font tile (not a heal zone that clones Match Font).  
SPECIAL_RULES: Family lottery **off**. Prime Gift: leftover **exactly 1/1**. Cadence Cap: remaining `n>2` → `2`; zeros stay 0; ones stay 1; twos stay 2. **Never PAIR Cap + Dock.** Never Floor / Prime / Rise / Snuff on the same AP bar. Honesty reroll → ENC-LEAN-02. Band 0 → show `FSN-LEAN-RISE`.  
OBJECTIVE: Defeat all three. Intended: Dual Keep 2/2 so Prime Gift skips, or sit remaining already ≤ 2 so Cap fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Prime / Cap discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Leftover 1/1 heal + remaining n>2→2. Distinct from ENC-LEAN-02 (leftover AP=0 and MP≥1 heal + remaining 1→2).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Cap never deletes remaining 0/1.  
REPLAYABILITY: Gifter west vs east.  
SCALING_BEHAVIOUR: High: do **not** add Dock. Peak: inherit Match Cast. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-DOCK-01

ENCOUNTER_ID: ENC-DOCK-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DOCK-VERSE` — 1× `cadence_docker` bishop (`spell-cadence-dock` + `starter-frost`) + 1× `verse_staver` bishop (`spell-verse-stave` + `starter-frost`) + 1× pawn (`physical_attack`). No Cap / Rise / Snuff / Prime / Floor on PAIR with the docker. No Verse Score / Tally / Poise / Gaunt on PAIR with the verser.  
AI_REQUIREMENTS: Docker skip if every remaining is already ≠ 2. Verser skip if no `lastResolvedSpellId`. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cadence Dock or Verse Stave can drop that id if missing. Extra door `dock_precentor` is **not** this family.  
MAP_REQUIREMENTS: Open court. Optional glyph tax tile that is **not** a second remaining rewrite.  
SPECIAL_RULES: Family lottery **off**. Cadence Dock: remaining `n===2` → `0`; zeros stay 0; `n===1` and `n>2` unchanged. Verse Stave: last-id illegal until leftover sum === 5; `0 = 0` does not peel; `2 = 2` does not; `3 = 1` does not; `1 = 1` does not; shove does not. **Never PAIR Cap + Dock.** Never Verse-Stave+Scribe as PAIR. Honesty reroll → ENC-SNUFF-01. Band 0 → show `FSN-SCORE-CHOIR`.  
OBJECTIVE: Defeat all three. Intended: sit remaining ≠ 2 so Dock fizzles, Dual Keep 2/2 so Verse does not peel, Strike as the legal last-id answer.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Remaining 2→0 + last-id until leftover-sum===5. Distinct from ENC-SNUFF-01 (remaining 1→0 + Verse Score).  
SOLVABILITY_REQUIREMENTS: Strike remains legal while Verse is up. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Docker north vs east. Variant `FSN-DOCK-VERSE/CAP` is **illegal** as a two-body; do not ship it as PAIR.  
SCALING_BEHAVIOUR: Peak: inherit Match Cast. Never add Cap to this CADRE.  
STATUS: PROPOSED

---

### ENC-HOLD-09

ENCOUNTER_ID: ENC-HOLD-09  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-STAVE-HOLD` — 1× `stave_holder` knight (`spell-stave-hold` + `physical_attack`) + 1× `must_staver` knight (`spell-must-stave` + `physical_attack`) + 1× warden rook (`starter-shield`). No Score / Tally / Poise / Odd / Dry / Drift / Boot Hold on PAIR. No Must Score / Tally / Poise / Gaunt / Lean on PAIR. **Never PAIR Stave Hold + Must Stave as a two-body** — this COURT is the three-body lesson.  
AI_REQUIREMENTS: Holder skip if leftover sum ≠ 5. Must skip if leftover sum ≠ 5. Warden body-blocks. Soph 3–4. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Hold or Must Stave can drop that id if missing.  
MAP_REQUIREMENTS: Arena with a 2-tile choke. Warden camps the choke. Exit behind the holder.  
SPECIAL_RULES: Family lottery **off**. Stave Hold: cannot walk while leftover-sum===5; spells stay legal. Must Stave: non-Strike illegal unless leftover-sum===5 **and** last AP; Strike stays legal. Dual Keep 2/2 peels Hold. Spend 1 leftover so the sum leaves 5. Last AP on Strike peels Must. Honesty reroll → ENC-HOLD-08. Hold `FSN-STAVE-HOLD/DODECA` while `ENEMY_SUMMON_CAP` is 2. Never Root + Gait Seal + Dry Hold + Score Hold + Stave Hold on the same AP bar.  
OBJECTIVE: Defeat all three. Intended: Dual Keep 2/2 (peels Hold) then Strike as last AP (peels Must).  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band victory XP + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walk-until leftover-sum===5 + tools-until leftover-sum===5 **and** last AP. Distinct from ENC-HOLD-08 (leftover-**sum === 4 AND unequal**).  
SOLVABILITY_REQUIREMENTS: Strike remains legal. Three-unit occupancy leaves a walk-off after Dual Keep.  
REPLAYABILITY: Holder west vs east of Must. Variant `/BOUNCE` at high (leftover-sum-5 bounce, not a second Hold).  
SCALING_BEHAVIOUR: Peak: inherit Match Draft. Never Dodeca until cap ≥ 12.  
STATUS: PROPOSED

---

### ENC-QUIET-04

ENCOUNTER_ID: ENC-QUIET-04  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STAVE-QUIET` — 1× `stave_stepper` queen (`spell-stave-step` + `physical_attack`) + 1× `stave_mender` queen (`spell-stave-mend` + `starter-shield`) + 1× `cover_squire` knight (`starter-shield` only). Ally `targetId` for Cover Shield required before this id ships.  
AI_REQUIREMENTS: Stepper / mender leftover-sum===5 gates. Cover applies Shield to the mender. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if ENC-STAVE-01 already granted Stave Mend / Step. Cover is not a grant.  
MAP_REQUIREMENTS: Open court. Cover needs a tile adjacent to the mender that is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Band 0: **do not spawn this id**. Show `FSN-STAVE-STEP`. Honesty: missing ally `targetId` → ENC-STAVE-01 leftover without claiming Quiet. Variant `FSN-STAVE-QUIET/LEND` adds Stave Lend (+1 AP and +1 MP if leftover sum === 5 — **exits** to sum 7); do not ship Lend before ally apply exists.  
OBJECTIVE: Defeat all three. Intended: kill Cover first, Dual Keep 2/2 so Stave misses, or dump a pool.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Stave step + stave mend + cover. The PAIR `FSN-STAVE-STEP` taught the two leftover reads; Cover is the third body.  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Cover Shield is not a wall.  
REPLAYABILITY: Cover north vs east of mender.  
SCALING_BEHAVIOUR: Peak: `/LEND` escort. Never pack Score Quiet on this BRIGADE.  
STATUS: PROPOSED

---

### ENC-BRICK-01

ENCOUNTER_ID: ENC-BRICK-01  
TYPE: map structure / movement objective / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GAIT-BRICK` — 1× `gait_toller` bishop (`spell-gait-toll` + `starter-frost`) + 1× `brick_holder` rook (`spell-brick-hold` + `physical_attack`) + 1× `stone_castellan` rook turret (`physical_attack`, `mp: 0`). No Still / Cast / Walk / Summon Toll on PAIR with the toller. No Brick Brace / Step / Nudge on PAIR with the holder.  
AI_REQUIREMENTS: Toller skip if leftover MP ≥ 1. Holder skip if no barrier is adjacent. Turret AI (`mp: 0`, no path). Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gait Toll or Brick Hold can drop that id if missing.  
MAP_REQUIREMENTS: One planted barrier adjacent to the holder’s start. A gallery around the barrier. Exit reachable after destroying the barrier **or** walking the gallery.  
SPECIAL_RULES: Family lottery **off**. Gait Toll: next-**walk** +1 AP if leftover **MP = 0**; relocate / Swap do not pay. Brick Hold: cannot **walk** while adjacent to a **barrier**; destroy the barrier and walks resume; lock **stays**; never Brace / Step. Never Hold+Brace PAIR. Never Toll+Scribe PAIR. Honesty reroll → ENC-BRACE-01. Band 0 → show `FSN-STILL-BRACE`.  
OBJECTIVE: Defeat all three. Intended: destroy the barrier then walk, or keep leftover MP ≥ 1 so Toll misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Leftover-MP=0 walk tax + barrier-adjacent walk lock + turret. Distinct from ENC-BRACE-01 (barrier-adjacent **hit miss** + Still Toll next-**spell**).  
SOLVABILITY_REQUIREMENTS: Gallery around the barrier. Destroying the barrier is a complete answer. Turret is not a cut-vertex.  
REPLAYABILITY: Barrier west vs east of holder.  
SCALING_BEHAVIOUR: Peak: inherit Match Pane on a **second** LoS cell (smash only while matched). Never two barriers.  
STATUS: PROPOSED

---

### ENC-PANE-01

ENCOUNTER_ID: ENC-PANE-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-MATCH_PANE` + 1× pawn on the player’s side.  
AI_REQUIREMENTS: Bishop kites behind the pane. Pawn charges. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TER-MATCH_PANE` on the mid-band (walkable LoS block; adjacent 1 AP smash **only while remaining AP equals remaining MP** before the spend; a mismatched smash is illegal and spends nothing). A walk-through around the pane exists. Inverse of Brace Column (ENC-COLUMN-01: walk+LoS wall, brace 1 AP / smash 2 AP if unbraced). Distinct from Frost Pane (1 AP smash always), Reed Screen (open LoS), Slit Wall (rotate a facing), and Hush Curtain (blocks spells).  
SPECIAL_RULES: Scripted pane only. Smash is an AP occupancy action, not a spell. Map is solvable with the pane intact. Honesty reroll → ENC-COLUMN-01.  
OBJECTIVE: Defeat both. Optional: equalize then smash for a linear shot, or walk through and accept the blind.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the pane is a matched smash, not a Brace Column.” Distinct from ENC-COLUMN-01.  
SOLVABILITY_REQUIREMENTS: Walk-through exists. Pane never on spawn±3 or the portal. Smash is optional.  
REPLAYABILITY: Pane N-S vs E-W.  
SCALING_BEHAVIOUR: High: bishop gains Stave Hood so leftover-sum===5 on a matched smash is a miss. Never two panes.  
STATUS: PROPOSED

---

### ENC-PLATE-01

ENCOUNTER_ID: ENC-PLATE-01  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the plate.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TRP-MATCH_PLATE` on a mid-court floor cell (mismatched enter is free and leaves the plate armed; first **matched** enter this map costs 8% max HP once, then floor). Inverse of Skew Plate (ENC-SKEW-01: first **diagonal** enter taxes). Distinct from Glyph Plate (any enter), Chevron Plate (one painted facing), Spent Plate (remaining AP 0), Dash Plate (after an MP spend), and Camp Plate (end-turn). Always visible from adjacent tiles.  
SPECIAL_RULES: Scripted plate only. Never on spawn±3 or the portal. Tax via in-battle challenge HP. Honesty reroll → ENC-SKEW-01.  
OBJECTIVE: Clear all. Optional: step on while mismatched, or bait a matched foe.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the plate is free while the two remaining pools disagree; matching is the tax.” Distinct from ENC-SKEW-01 (diagonal).  
SOLVABILITY_REQUIREMENTS: Plate is walkable before and after. Never seals a path.  
REPLAYABILITY: Plate west vs east.  
SCALING_BEHAVIOUR: High: inherit one match-seam on a **flank**. Never two plates.  
STATUS: PROPOSED

---

### ENC-WAVE-21

ENCOUNTER_ID: ENC-WAVE-21  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Wave 1: 3× pawn (`physical_attack`). Wave 2: `FSN-STAVE-STEP` fallback (mender + stepper) **or** `FSN-STAVE-SIP` if Stave Mend already owned. Wave 3: 1× rook (`physical_attack`) + leftover pawn. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR AI (mender skip if leftover sum ≠ 5; stinger commits on leftover sum === 5). Wave 3 rook camps the choke via `chokepointCamp` only if AI tier ≥ 3.  
SPELL_DISCOVERY_OPPORTUNITIES: Optional overlay: a dead mender drops `spell-stave-mend` if ENC-SPELL-39 was skipped this chain.  
MAP_REQUIREMENTS: One choke (2-tile corridor) between spawn side and a backline alcove. `waveSpawnCells` marked. Exit behind the alcove. Optional match-seam ribbon on the **gallery**, never in the choke.  
SPECIAL_RULES: Portal stays locked until wave 3 is clear. Next wave spawns at the start of the enemy phase after the previous wave is dead, on `waveSpawnCells` only (must be free floor). If a cell is occupied, spill to the nearest free reachable floor. Soft fail: if a wave cannot place any unit, skip that wave and log it. Honesty: missing leftover-sum-5 → wave 2 is ENC-WAVE-20 leftover without claiming Stave.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player HP ≤ 0.  
REWARD: Victory XP counts all three waves’ defeated levels. Depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cadence — spend on wave 1, Dual Keep 2/2 (closes Stave) before the leftover-sum-5 healer, then break the choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Choke must not isolate the player from the exit after walls finalize. Cap living hostiles so `ENEMY_SUMMON_CAP` is not starved later.  
REPLAYABILITY: Wave 2 rotates `FSN-STAVE-STEP` / `FSN-STAVE-SIP` / `FSN-RING-HEPTA` by seed. Choke side flips.  
SCALING_BEHAVIOUR: Mid: wave 2 gains the named kit. High: wave 3 rook learns `spell-iron-skin`. Peak: add a 2-pawn “echo” wave only if the player’s kill time on wave 1 was under 2 turns (skill-scaled, not level-scaled).  
STATUS: PROPOSED

---

### ENC-AMBUSH-20

ENCOUNTER_ID: ENC-AMBUSH-20  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Overworld / exploration: `WF-ELT-MATCH_PICKET` — one same-tier elite occupies a painted post **only while the player’s remaining AP equals remaining MP**. Mismatch the two remaining pools and the post is empty floor (exploration: they leave, no purse). Dungeon / boss rush: they stand from map start — required for map-clear. Inverse of Ready Picket (ENC-AMBUSH-19: remaining AP equals max AP). Distinct from Plant Picket (ENC-AMBUSH-18: remaining MP 0), Spare Picket (leftover AP), Diag Picket (ENC-AMBUSH-17: off-axis), Orth Picket (ENC-AMBUSH-16: on-axis), Near Picket (≤3), High Picket (≥80% HP), and Spell Picket (after a cast).  
AI_REQUIREMENTS: Elite uses live kit for the piece. No lookahead until engaged. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: elite may carry one `usableByEnemy` extra that ENC-PRIO-22 can teach.  
MAP_REQUIREMENTS: Painted post is floor. Exit reachable without touching. Counts as 1 enemy. Match pip painted.  
SPECIAL_RULES: Appearance keys off remaining AP equaling remaining MP. World contact starts a normal battle. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-19.  
OBJECTIVE: Fight them (dungeon) or mismatch remaining pools and pass (exploration).  
FAILURE_CONDITION: Player death in the fight. Walking past after mismatching is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the picket only exists while you are **matched** (remaining AP equals remaining MP).” Inverse of ready (max AP) pickets.  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without touching. In a run they are present from the start and reachable.  
REPLAYABILITY: Post north vs east.  
SCALING_BEHAVIOUR: High: elite is Stave Hood so leftover sum === 5 on the matched body is a miss — dump a pool then Strike. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-20

ENCOUNTER_ID: ENC-REINF-20  
TYPE: reinforcements / waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn. Wave 2 (reinforcement): 1× bishop (`starter-frost`) spawns on `waveSpawnCells` when the first pawn dies — **not** a Match File (that is ENC-MATCH-01). Distinct from ENC-REINF-19 (echo bishop after a kill, Ready File leftover).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Alcove `waveSpawnCells` behind a 2-tile choke. Portal locked until both waves clear.  
SPECIAL_RULES: Reinforcement at the start of the enemy phase after the trigger kill. Occupied cell spills to nearest free reachable floor. `holdPortalLocked` until wave 2 is down.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death. Soft fail: if wave 2 cannot place, skip and log.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce after a kill so bursting the first pawn is a choice, not always correct. Distinct from ENC-MATCH-01 (AP-lock until match).  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop vs queen (frost only) by seed.  
SCALING_BEHAVIOUR: High: wave 2 is Stave Hood. Peak: inherit match-seam on the gallery.  
STATUS: PROPOSED

---

### ENC-MATCH-01

ENCOUNTER_ID: ENC-MATCH-01  
TYPE: priority-target / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-MATCH_FILE` — two extra same-tier elites share a painted file. The first (painted match pennant) cannot spend AP until the second is dead **OR** the player ends a turn with remaining AP equal to remaining MP. Occupancy-walks (MP) stay legal. Distinct from Ready File (ENC-READY-02: unlock on remaining AP equals max AP), Mute File (ENC-MUTE-02: first SpellConfig-locked until adjacent), Sheath File (second AP-locked until the first dies or you end adjacent), Guard File (first walk-locked), and Sleeping Vanguard (both world-asleep until touch).  
AI_REQUIREMENTS: Free spender uses live kit. Match-locked elite may walk MP but cannot spend AP until unlocked. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Painted file. Exit reachable. Adds enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2.  
SPECIAL_RULES: Match lock is occupancy/turn state, not a buff spell. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-READY-02.  
OBJECTIVE: Clear both. Intended: burst the free spender first, **or** equalize remaining AP and MP once so both act and you accept the race.  
FAILURE_CONDITION: Player death.  
REWARD: Hard reward multiplier via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “equalize remaining AP and MP to wake the match elite, or burst the free spender while the other cannot spend AP.” Distinct from ENC-READY-02 (skip-AP / max AP).  
SOLVABILITY_REQUIREMENTS: Both reachable. MP walks remain legal for the locked elite. Living hostiles ≤ 4.  
REPLAYABILITY: Match pennant N vs S of the file.  
SCALING_BEHAVIOUR: Peak: inherit Match Cast so the unlocked elite still has to match to spend a `SpellConfig`. Never three on the file.  
STATUS: PROPOSED

---

### ENC-SILL-01

ENCOUNTER_ID: ENC-SILL-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) on the long path + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on the long path. Pawn charges.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: A short-path corridor cell starts as `WF-OBS-MATCH_SILL` (wall until the player ends a turn with remaining AP equal to remaining MP; then floor). A second spawn→portal route already exists (the long path). Inverse of Ready Sill (ENC-READY-01: remaining AP equals max AP). Distinct from Spent Sill (remaining AP 0), Plant Font (heal at remaining MP 0), Hale Sill (≥80% HP), and Empty Step (0 AP pads).  
SPECIAL_RULES: Place only when a second route already exists. Evaluate solvability as if the sill were already a wall. Never the only exit. Honesty reroll → ENC-READY-01.  
OBJECTIVE: Defeat both. Optional: equalize then end-turn to open the short path, or take the long way.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “matching remaining AP and MP unlatches the short path; Ready Sill wanted skip-AP instead.” Distinct from ENC-READY-01.  
SOLVABILITY_REQUIREMENTS: Long path reachable with the sill as a wall. Sill never on spawn±3 or a portal.  
REPLAYABILITY: Sill west vs east of the long path.  
SCALING_BEHAVIOUR: High: bishop is Stave Hood. Never two sills.  
STATUS: PROPOSED

---

### ENC-SURV-38

ENCOUNTER_ID: ENC-SURV-38  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Clock 6. Wave A: 2× pawn. Wave B overlaps at turn 3: 1× bishop (`starter-frost`). Hard-cap 3 living.  
AI_REQUIREMENTS: Pawns greedy. Bishop kites. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Arena + `WF-ENV-MATCH_DRAFT` (3% max HP if remaining AP equals remaining MP at end of turn; ending mismatched is shelter). Inverse of Pair Draft (ENC-SURV-37: tax when another living unit is Chebyshev ≤ 1). Distinct from Spare Draft (dump leftover AP or pay), Stride Draft (dump leftover MP or pay), Isolation Chill (tax when nobody is within 3), Ready Hour (remaining AP equals max AP), and Empty Font (heal at remaining AP 0).  
SPECIAL_RULES: Overlap + match-draft shelter is the escalation vs ENC-SURV-37. Flee remnants when the clock ends. Honesty reroll → ENC-SURV-37. Never `titans_vigor`.  
OBJECTIVE: Survive the clock, then clean or let flee. Optional overlay `no_healing`.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-37.  
TACTICAL_PURPOSE: Peak pressure that spends leftover match verbs so late-game maps are not “pair draft again” or “ready hour again.”  
SOLVABILITY_REQUIREMENTS: Tax is not a wall. Maps remain solvable if every unit always pays. Living hostiles ≤ 3.  
REPLAYABILITY: Wave B at turn 3 vs 4.  
SCALING_BEHAVIOUR: Overlap timing is the scaler. Peak: inherit one match-cinder on a gallery.  
STATUS: PROPOSED

---

### ENC-PROT-20

ENCOUNTER_ID: ENC-PROT-20  
TYPE: protection objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn racing the basin.  
AI_REQUIREMENTS: Bishop kites toward the font if it can drink. Pawn charges the player.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-ZON-MATCH_FONT` basin (first unit to end a turn here this map heals 8% max HP **only if remaining AP equals remaining MP**; then the tile dries; ending here mismatched does nothing and does not dry it). Inverse of Pair Font (ENC-PROT-19: heal only if another living unit is Chebyshev ≤ 1). Distinct from Ready Hour (remaining AP equals max AP), Empty Font (remaining AP 0), Plant Font (remaining MP 0), Alone Font (no neighbor), and Shrine Pool (unconditional first drink).  
SPECIAL_RULES: Heal is a zone tick, not a spell. If the drinker is the player, persist the new HP through `saveBattleStats` on the progress lock. Does not call `applyRewards`. Honesty reroll → ENC-PROT-19.  
OBJECTIVE: Defeat both. Optional: equalize then plant on the basin, or deny the enemy the drink.  
FAILURE_CONDITION: Player death. Losing the drink is not a fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the font pays only while remaining AP equals remaining MP.” Distinct from ENC-PROT-19 (pair).  
SOLVABILITY_REQUIREMENTS: Basin is walkable floor. Never on spawn or portals. Does not block exits.  
REPLAYABILITY: Basin west vs east.  
SCALING_BEHAVIOUR: High: bishop starts matched. Never two fonts.  
STATUS: PROPOSED

---

### ENC-PRIO-22

ENCOUNTER_ID: ENC-PRIO-22  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-MATCH_TUTOR` — one same-tier enemy (medium threat) carries 1 extra `SpellConfig` row with `usableByEnemy === true`, plus 1× pawn.  
AI_REQUIREMENTS: Tutor uses the extra row only if remaining AP equals remaining MP before the spend. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn with remaining AP equal to remaining MP while they still live (any distance), the player gains that spell id as a single remaining cast this map. Killing them before that match teach grants the purse but not the one-cast. The one-cast does not call `upgradeSpell` and does not persist spellLevel arrays. Distinct from Ready Tutor (ENC-PRIO-21: remaining AP equals max AP), Plant Tutor (ENC-PRIO-20: remaining MP 0), Close Tutor (end turn adjacent), Live Tutor (repeating loan while they live), and Steel Hour (skip paid-AP spells for a purse).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; otherwise +1 if under `MAX_ENEMIES`. Must remain reachable. In dungeon / boss rush they count as hostiles for map-clear.  
SPECIAL_RULES: Teach does not pacify them. Honesty reroll → ENC-PRIO-21. Extra spells from `usableByEnemy` only.  
OBJECTIVE: Equalize remaining AP and MP and end a turn for a one-shot, burst-kill for the purse, or ignore them.  
FAILURE_CONDITION: Player death. Skipping the teach is still a win.  
REWARD: Standard via `applyRewards`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “matching remaining pools loans a cast; Ready Tutor wanted skip-AP instead.” Distinct from ENC-PRIO-21.  
SOLVABILITY_REQUIREMENTS: Tutor reachable. Living hostiles ≤ 3.  
REPLAYABILITY: Extra row rotates among `starter-frost` / `starter-poison` / `starter-shield`.  
SCALING_BEHAVIOUR: High: tutor is Stave Hood. Never two tutors.  
STATUS: PROPOSED

---

### ENC-ELITE-38

ENCOUNTER_ID: ENC-ELITE-38  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STAVE-STEP/E-STEP` **or** `FSN-STAVE-SIP/E-STING` by seed — named leftover-sum-5 PAIR with the elite tag on the stepper **or** the stinger. No second elite.  
AI_REQUIREMENTS: PAIR AI plus soph 2–3 on the elite body. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-STAVE-01 / ENC-FIVE-01 if those were skipped.  
MAP_REQUIREMENTS: Arena. Optional match-seam on a **gallery**.  
SPECIAL_RULES: Family lottery **off**. Elite tag does not multiply HP; it enables one extra kit row (`starter-iron-skin` on E-STEP, `starter-poison` on E-STING). Honesty: missing leftover-sum-5 → ENC-ELITE-36 leftover without claiming Stave.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Elite table via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove leftover-sum===5 under an elite tag without a sponge. Distinct from ENC-ELITE-36 (leftover-sum-4-unequal).  
SOLVABILITY_REQUIREMENTS: Two-unit occupancy leaves an exit. Elite tag is not a second body.  
REPLAYABILITY: E-STEP vs E-STING by seed.  
SCALING_BEHAVIOUR: Peak: inherit Match Cast. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-ELITE-39

ENCOUNTER_ID: ENC-ELITE-39  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-RING-HEPTA/GUN` **or** `FSN-RIME-RANK/GLYPH` by seed — named ring **or** rime PAIR with one elite tag. No second elite.  
AI_REQUIREMENTS: PAIR AI plus soph 2–3 on the elite body. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-RING-01 / ENC-RIME-02 if those were skipped.  
MAP_REQUIREMENTS: Arena with a legal Chebyshev-2 non-knight dest **or** an ice gallery, matching the seed.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing Ring / Rime writer → ENC-ELITE-37 leftover without claiming Ring / Rime.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Elite table via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Prove ring-walk **or** ice-reel under an elite tag. Distinct from ENC-ELITE-37 (File / Lava leftover).  
SOLVABILITY_REQUIREMENTS: Matching device is not a cut-vertex. Strike remains legal under Hepta.  
REPLAYABILITY: Ring vs Rime by seed.  
SCALING_BEHAVIOUR: Peak: inherit Match Pane. Never two elites.  
STATUS: PROPOSED

---

### ENC-RARE-20

ENCOUNTER_ID: ENC-RARE-20  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-STAVE-HOLD` three-body (holder + must + warden) **or** `FSN-STAVE-CHOIR` (mender + verser + ignite pawn) by seed. Inserts; does not replace a beat. Weight 8% on depth 4 after ENC-BRANCH-20.  
AI_REQUIREMENTS: COURT / BRIGADE soph 3–4. InstantKill / betrayal off. Hold `FSN-STAVE-HOLD/DODECA` while cap is 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Stave Hold / Must Stave / Verse Stave can drop that id if missing.  
MAP_REQUIREMENTS: Arena with a 2-tile choke. Optional match-draft overlay.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-sum-5 walk lock / last-id writer → ENC-RARE-19 leftover without claiming Stave Hold. Never PAIR Stave Hold + Must Stave as a two-body (the COURT is the three-body).  
OBJECTIVE: Defeat the rare pack.  
FAILURE_CONDITION: Player death. Skipping the insert (weight miss) is not a fail.  
REWARD: Rare elite table via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Long-term mastery insert after all four branches are known. Distinct from ENC-RARE-19 (Score Hold).  
SOLVABILITY_REQUIREMENTS: Strike remains legal. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Hold vs Choir by seed.  
SCALING_BEHAVIOUR: Do not add Dodeca. Tighten by Match Draft, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-20

ENCOUNTER_ID: ENC-TREAS-20  
TYPE: treasure / risk room  
RELATIVE_DIFFICULTY: MID — optional match-oath is HIGH  
ENEMY_COMPOSITION: None required. Optional 1× pawn if the seed rolls a guardian (then it is no longer Match Cache).  
AI_REQUIREMENTS: Guardian, if any, greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: A visible `WF-TRS-MATCH_CACHE` chest with a balance pip. 1 AP adjacent opens it **only while remaining AP equals remaining MP** before the spend: a medium `applyRewards` grant and no guardian. A mismatched open is illegal and spends nothing. Inverse of Round Cache (opens rounds 1–2). Distinct from Late Cache (opens from round 3), Plant Cache (remaining MP 0), Empty Font (heal at remaining AP 0), Trip Cache (open before any MP this map), and Patience Cache (wait-or-open). Optional `WF-RSK-MATCH_OATH` inlay on a second tile.  
SPECIAL_RULES: Open cost is AP, not a spell. Credits via `applyRewards` on the persist lock. Failed mismatched open spends nothing. Do not write Doka with `updateCharacter`. Honesty reroll → ENC-TREAS-19.  
OBJECTIVE: Equalize then spend 1 AP to open, wait and stay mismatched, or walk past.  
FAILURE_CONDITION: Player death if a guardian rolled. Skipping the chest is still a win.  
REWARD: Medium purse via `applyRewards`. Overlay: none (the risk *is* the challenge).  
TACTICAL_PURPOSE: Opt-in match purse so high-level rest is not “bigger Doka.” Distinct from ENC-TREAS-19 (Ready / pair devices).  
SOLVABILITY_REQUIREMENTS: Chest occupies a floor cell but is walkable-adjacent, not a wall. Optional. Never on spawn/portals.  
REPLAYABILITY: Chest west vs east. Oath on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, a guardian pawn may sit adjacent (still not a sponge).  
STATUS: PROPOSED

---

### ENC-OATH-03

ENCOUNTER_ID: ENC-OATH-03  
TYPE: optional challenge / rest choice  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None. `WF-RSK-MATCH_OATH` inlay only.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: A balanced inlay. Voluntarily ending a turn on it flags this map. If the next `applyRewards` happens while the player's remaining AP equals remaining MP, that credit uses the hard multiplier. If the two remaining pools disagree at credit, the flag pays nothing extra. Snapshot at credit. Distinct from Ready Hour (ENC-HOUR-03: ended remaining AP equals max AP at least once), Pair Oath (ENC-OATH-02: Chebyshev ≤ 1 at credit), Spent Oath (cash out at remaining AP 0), Plant Oath (cash out at remaining MP 0), and Spare Oath (leftover AP).  
SPECIAL_RULES: Match check is remaining AP === remaining MP at the `applyRewards` enqueue. Multiplier applies to the next `applyRewards` enqueue only. Death still uses `saveBattleStats`. Not a buff spell (Null Field does not strip the flag). Honesty reroll → ENC-OATH-02.  
OBJECTIVE: Flag a fight you will cash out matched, or stay unflagged and finish mismatched.  
FAILURE_CONDITION: None on the inlay.  
REWARD: Hard multiplier on the next `applyRewards` if matched at credit; otherwise nothing extra. Overlay: none.  
TACTICAL_PURPOSE: Voluntary cash-out-match wager. Distinct from ENC-OATH-02 (pair).  
SOLVABILITY_REQUIREMENTS: Optional floor tile. Map remains solvable if never used. Never on spawn/portals.  
REPLAYABILITY: Inlay west vs east.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-HOUR-04

ENCOUNTER_ID: ENC-HOUR-04  
TYPE: optional challenge / world event  
RELATIVE_DIFFICULTY: MID (opt-in)  
ENEMY_COMPOSITION: Uses the current room’s hostiles. Overlay only.  
AI_REQUIREMENTS: Unchanged.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-MATCH_HOUR` overlay (this map only: if the player ended at least one turn with remaining AP equal to remaining MP, the next `applyRewards` uses the hard multiplier; always ending mismatched leaves rewards unchanged). Distinct from Ready Hour (ENC-HOUR-03: remaining AP equals max AP), Spent Oath (cash out at remaining AP 0), Plant Oath (cash out at remaining MP 0), Vacant Hour (skip summons), and Match Gate (arm an extra portal).  
SPECIAL_RULES: Match means remaining AP === remaining MP at player end-of-turn. Multiplier applies only to persist-lock `applyRewards`. Does not rewrite combatMath. Death still uses `saveBattleStats`. Optional — never forces a fight. Honesty reroll → ENC-HOUR-03. `WF-EVT-MATCH_HOUR` may overlay a dungeon as a reward wager (no extra portal).  
OBJECTIVE: Equalize remaining AP and MP on at least one end-turn for a hard purse, or stay mismatched every turn and accept normal rewards.  
FAILURE_CONDITION: Unchanged (the overlay never fails the room).  
REWARD: Hard multiplier if the flag armed; otherwise the room’s normal table. Overlay: none.  
TACTICAL_PURPOSE: Opt-in match hour so late maps are not “ready hour again.” Distinct from ENC-HOUR-03.  
SOLVABILITY_REQUIREMENTS: No tile blocks. Portals unchanged. Leaving is always legal.  
REPLAYABILITY: Overlay on/off by seed.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-PAD-03

ENCOUNTER_ID: ENC-PAD-03  
TYPE: movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) on the far pad + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on the far pad. Pawn charges.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Two `WF-TEL-MATCH_STEP` pads. Spending 1 MP to swap is legal **only while remaining AP equals remaining MP before that 1 MP**. A mismatched swap is illegal and spends nothing. Inverse of Skew Step (ENC-PAD-02: pad swap only if traveler shares neither row nor column with a living hostile). Distinct from Empty Step (remaining AP 0), Spare leftover-AP pads, File on-axis pads, Plant remaining-MP-0 heal pads, and Ready remaining-AP-equals-max-AP pads.  
SPECIAL_RULES: Pads are floor. Honesty reroll → ENC-PAD-02. Never the only exit.  
OBJECTIVE: Defeat both. Optional: equalize then swap onto the far pad, or walk the long way.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “matching remaining pools pays the pad; Skew Step wanted an off-axis traveler instead.” Distinct from ENC-PAD-02.  
SOLVABILITY_REQUIREMENTS: A walk route exists without the swap. Pads never on spawn±3 or a portal.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: High: bishop is Stave Hood. Never three pads.  
STATUS: PROPOSED

---

### ENC-REST-20

ENCOUNTER_ID: ENC-REST-20  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional match-oath / match-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-21 / ENC-STAVE-01 / ENC-RING-01 observed Stave Mend / Ring Stride / Hepta Oath, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-MATCH_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-20. Optional `WF-RSK-MATCH_OATH` tile (flag next room only). Optional `WF-PRT-MATCH_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player has ended a turn with remaining AP equal to remaining MP this map; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Match oath does not start combat. `uiLayout` unchanged. After one full Table Q clear, shrine can enable day-20 `rushVariant` flags (`trim_bait`, `ready_conductor`, `lean_palisade`, `near_ram`).  
OBJECTIVE: Choose an exit. Optional: shrine, match oath, match gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Match oath is a modifier flag, not a Doka mint. Match Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Stave-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Match Gate always in addition to a reachable stable portal. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Match on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-20

ENCOUNTER_ID: ENC-BRANCH-20  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: stave | ring | rime | match` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: stave → ENC-STAVE-01 or ENC-SPELL-39, ring → ENC-RING-01 or ENC-SPELL-40, rime → ENC-RIME-02 or ENC-GATE-07, match → ENC-SILL-01 or ENC-SNAP-04. A sealed fifth door to ENC-RARE-20 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: stave | ring | rime | match` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-20 / ENC-BOSS-20). Day-19 `ENC-BRANCH-19` stays score/file/lava/ready. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Score / File / Lava / Ready.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Match File door (ENC-MATCH-01) can replace Ring for accounts that already finished Ring this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Match Picket (ENC-AMBUSH-20) so lingering matched (remaining AP equals remaining MP) to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-21

ENCOUNTER_ID: ENC-MINI-21  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (stave / leftover-sum-5 adjacent). Branch stave: `starved_vampire_pawn`. Branch ring: `bone_cavalier`. Branch rime: `crimson_countess`. Branch match: `midnight_bishop`. Do **not** use `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table R directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (match-seam / match-pane / one ice gallery / leftover-match aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Stave Hood consume / one extra Stave Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-20

ENCOUNTER_ID: ENC-BOSS-20  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Stave → `starved_vampire_pawn`; Ring → `bone_cavalier`; Rime → `crimson_countess`; Match → `midnight_bishop`. If the chain taught Match Picket (ENC-AMBUSH-20) **and** Ring was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table R ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-21) or match-file (ENC-MATCH-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Stave may inherit 2 match-seam tiles off the only path; Ring may inherit room for Chebyshev-2 non-knight steps plus a Chebyshev-7 aisle; Rime may inherit one ice gallery (not a sealed pocket); Match may inherit match pane on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / charge-on-ring / ice-blood / curse-reflect).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-20

ENCOUNTER_ID: ENC-MAST-20  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on match-seam (`WF-HAZ-MATCH_SEAM`). Wave 2: `FSN-STAVE-STEP` **or** `FSN-STAVE-SIP` **or** `FSN-RING-HEPTA` **or** `FSN-RIME-RANK` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Warder elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 PAIR AI. Wave 3 elite soph 2–3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already granted the primer ids.  
MAP_REQUIREMENTS: Choke between wave 1 and wave 2. Branch device on a **gallery**: stave → leftover Dual Keep 2/2 aisle (closes Stave); ring → Chebyshev-2 non-knight plus Chebyshev-7; rime → ice gallery off the only path; match → Match Sill on the short path. `holdPortalLocked` until wave 3 is clear.  
SPECIAL_RULES: Portal locked. Soft-fail skip if a wave cannot place. Honesty: missing the branch writer → ENC-MAST-19 leftover without claiming Stave / Ring / Rime / Match.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band victory XP + depth Doka. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Exam that stacks teach → reinforce → the named drop-19 PAIR.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4. Branch device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Peak: inherit Match Draft. Never a fourth wave.  
STATUS: PROPOSED

---

### ENC-KENNEL-01

ENCOUNTER_ID: ENC-KENNEL-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STAVE-HOLD/KENNEL` variant — 1× `summon_filer` king (`spell-summon-file` + `starter-frost`) + 1× `rime_cutter` pawn (`spell-rime-cut` + `physical_attack`) + one allied summon already planted (counts toward cap 2). Never File+Plate PAIR.  
AI_REQUIREMENTS: Filer skip if no allied summon; pets pay +1 AP to **walk off the summoner’s file**; on-file walks are free. Cutter skip rider if target is Chebyshev > 2 from every ice occupancy cell. Drop if `summonAI` empty. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Summon File or Rime Cut can drop that id if missing. Twin Gate pads do **not** count as ice.  
MAP_REQUIREMENTS: One ice gallery of 3 tiles. Exit reachable without crossing the kennel. Living hostiles + pets ≤ cap.  
SPECIAL_RULES: Family lottery **off**. Hold while remaining cap < 1 for the planted pet. Honesty: missing pet-walk-off-file tax → ENC-HOLD-09 leftover without claiming Kennel. Never File+Plate PAIR. Never two pets (cap 2 with the planted one).  
OBJECTIVE: Defeat the handler pack. Intended: keep the pet on-file so the tax never fires, or stand Chebyshev > 2 from ice so Cut misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Pet file-tax + ice-threshold poke. Distinct from ENC-TWIN-01 (ally-swap kennel).  
SOLVABILITY_REQUIREMENTS: Pet plant is free floor. Cap living enemy summons ≤ 2. Ice gallery is not a cut-vertex.  
REPLAYABILITY: Ice west vs east.  
SCALING_BEHAVIOUR: Peak: inherit Match Pane. Never a second pet.  
STATUS: PROPOSED

---

### ENC-RUSH-75

ENCOUNTER_ID: ENC-RUSH-75  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room R0 remix: `trim_abbot` + `bait_vicar` as Table R `R0`. Combined mechanic remains: recast the lock he just shaved, or feed the pylon. Censer dest **never** occupies the Snip. Trim is remaining −1, not steal. Bait intercepts the **recast**, not remaining CD. Empty remaining fizzles. Not Imprint / Dilate / Flush / Goad / Halve.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-DOCK-01 / ENC-PRIME-02, a **painted remaining pip** (visual only) shows Cap / Dock vs Trim — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Cadence Trim, Cadence Cap, or Cadence Dock.  
MAP_REQUIREMENTS: Preferred cells. Censer never on Snip.  
SPECIAL_RULES: `rushVariant: trim_bait`. Unlock after one complete Table Q clear.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table R room 0 table + tiny bonus if the first recast Trim was refused by sitting remaining already 0 (skill).  
TACTICAL_PURPOSE: Add the remaining-CD exam the Dock / Cap primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Censer never on Snip. Novice death ≠ victory.  
REPLAYABILITY: Snip N vs S of Censer.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten trim cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-76

ENCOUNTER_ID: ENC-RUSH-76  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room R1 remix: `ready_commissary` + `silent_conductor` as Table R `R1`. Combined mechanic remains: hold leftover AP **and** leftover MP on a sounding file. Silence files **never** occupy the Coffer. Ready leftover is **both** currencies ≥ 1, not leftover-MP ≥ 2. Dual Keep unpaid bank does not arm the +8. Not Dual / Stride / Purse / Damp / Lean / Dry.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-STAVE-01 / ENC-FIVE-01, a **painted leftover pip** (visual only) shows Dual Keep vs Stave windows vs Ready both-currencies — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Ready Sting, Stave Mend, or Dual Keep.  
MAP_REQUIREMENTS: Preferred cells. Silence never on Coffer.  
SPECIAL_RULES: `rushVariant: ready_conductor`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table R room 1 table + tiny bonus if the first Ready bonus was refused by dumping one leftover (skill).  
TACTICAL_PURPOSE: Add the leftover-exam the Stave primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Silence never on Coffer. Novice death ≠ victory.  
REPLAYABILITY: Coffer N vs S of silence file.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten leftover window, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-77

ENCOUNTER_ID: ENC-RUSH-77  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room R2 remix: `lean_procurator` + `ivory_palisade` as Table R `R2`. Combined mechanic remains: dump AP, keep a walk chip, poke through a punched lane. Punched lanes **never** occupy the Fast. Lean leftover is AP **= 0** **and** MP ≥ 1, not Dry (AP=0, no MP gate) and not Damp (MP ≥ 2). Not Dry / Damp / Ready / Parched / Fortress.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-BRICK-01 / ENC-PANE-01, a **painted lane pip** (visual only) shows Brace / Match Pane vs punched Fast — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Lean Sting, Brick Hold, or Match Pane.  
MAP_REQUIREMENTS: Preferred cells. Punched lanes never on Fast.  
SPECIAL_RULES: `rushVariant: lean_palisade`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table R room 2 table + tiny bonus if the first Lean poke was refused by keeping leftover AP (skill).  
TACTICAL_PURPOSE: Add the leftover-AP=0 exam the Match / Brick primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Punched lanes never on Fast. Strike remains a legal answer.  
REPLAYABILITY: Fast N vs S of punched lane.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten lane cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-78

ENCOUNTER_ID: ENC-RUSH-78  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room R3 remix: `near_scholastic` + `ram_castellan` as Table R `R3`. Combined mechanic remains: get shoved adjacent, then your Strike misses. Ram ray **never** occupies the Visor. After the slam, Chebyshev 1 is the Near Hood window; step to 2 before Strike. Slam is spell-hit from the ray’s far cell, not a consume. Not Hood Recluse / Rebound / Cover / Fosse / Hook / Rime. Table R3 is ram **without** a hazard floor.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-RING-01, a **painted ring pip** (visual only) shows Chebyshev-2 Ring Stride vs Near Hood ≤ 1 — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Near Hood, Ring Stride, or Ram.  
MAP_REQUIREMENTS: Preferred cells. Ram ray never on Visor. No lava / rime under the slam dest (MIMA-005).  
SPECIAL_RULES: `rushVariant: near_ram`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table R room 3 table + tiny bonus if the first Near miss was refused by stepping to Chebyshev 2 (skill).  
TACTICAL_PURPOSE: Add the adjacency-exam the Ring primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Ram ray never on Visor. Strike from Chebyshev 2 remains a legal answer.  
REPLAYABILITY: Visor N vs S of ram ray.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten slam cadence, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain T — “Stave Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-20 then ENC-SPELL-39 (or ENC-SPELL-40 if Stave Mend already owned) |
| 2 | Reinforce | ENC-WAVE-21 |
| 3 | Combine | ENC-HAZ-40 then ENC-STAVE-01 **or** ENC-RING-01 |
| 3 insert | Choice | ENC-BRANCH-20 → stave/ring/rime/match destinations |
| 4 | Pressure | ENC-SURV-38 **or** ENC-PROT-20 **or** ENC-MATCH-01 **or** skip via ENC-REST-20 |
| 4 | Mastery | ENC-MAST-20 (branch skin) |
| 5 | Boss | ENC-BOSS-20 |

Rare: 8% on depth 4 to **insert** ENC-RARE-20 before mastery.  
Treasure: rest may offer ENC-TREAS-20 instead of PROT-20.  
Decoy side-story: replace combine with ENC-PRIO-22 and mini-boss ENC-MINI-21; capstone may become `midnight_bishop` if Match was not the door.

### Chain U — “Match Sill Primer” (maxDepth 4)

ENC-PLATE-01 → ENC-SILL-01 → ENC-PAD-03 → ENC-REST-20 → ENC-BOSS-20 (`midnight_bishop` only if Match was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-PLATE-01 as teach on accounts that already know pair-seam / ready-sill.

### Rush injection (day-20)

After one full Table Q clear, ENC-REST-20 shrine can enable: room R0 → ENC-RUSH-75, room R1 → ENC-RUSH-76, room R2 → ENC-RUSH-77, room R3 → ENC-RUSH-78. Day-19 flags for Q0–Q3 and earlier table flags remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-20, ENC-SPELL-39, ENC-SPELL-40 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-39, ENC-RIFT-01, ENC-PAD-03, ENC-PLATE-01 | `under_50_damage` |
| ENC-HAZ-40, ENC-WAVE-21 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-20, ENC-MAST-20, ENC-PANE-01, ENC-RIME-02, ENC-KENNEL-01 | `direct_hit` |
| ENC-STAVE-01, ENC-FIVE-01, ENC-ELITE-38, ENC-ELITE-39, ENC-RING-01, ENC-SNAP-04, ENC-MATCH-01, ENC-HOLD-09 | `under_8_ap_per_turn` |
| ENC-SURV-38 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-20 / ENC-REST-20 bank / ENC-OATH-03 / ENC-HOUR-04 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `match_seam` or 1 match cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | match-seam **or** match plate | kill + optional glyph |
| MID | named drop-19 `FSN-*` or waves | backline guard | zone 1 + Stave Mend / Ring Stride | one `WF-*` | clock / tags / gate |
| HIGH | elite or match file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / ice / leftover-sum-5 miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush R0–R3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit match-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Match Oath / Match Hour / Match Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-19 fields plus:

```
encounterId
encounterType        // + stave_step | stave_sip | ring_hepta | rime_rank |
                     //   stave_gate | last_dual | rift_fresh | watch_even |
                     //   stave_choir | prime_cap | stave_quiet | hymn_stave |
                     //   dock_verse | gait_brick | purse_stave | stave_hold |
                     //   match_seam | match_cinder | match_plate | match_pane |
                     //   match_sill | match_font | match_step | match_file |
                     //   match_picket | match_cache | match_tutor | match_oath |
                     //   match_cast | match_hour | match_draft
formationId?         // FSN-STAVE-STEP | FSN-STAVE-SIP | FSN-RING-HEPTA |
                     // FSN-RIME-RANK | FSN-STAVE-GATE | FSN-LAST-DUAL |
                     // FSN-RIFT-FRESH | FSN-WATCH-EVEN | FSN-STAVE-CHOIR |
                     // FSN-PRIME-CAP | FSN-STAVE-QUIET | FSN-HYMN-STAVE |
                     // FSN-DOCK-VERSE | FSN-GAIT-BRICK | FSN-PURSE-STAVE |
                     // FSN-STAVE-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // stave | ring | rime | match
matchSeamCells? / matchCinderCell? / matchPlateCell?
matchPaneCell? / matchSillCell? / matchFontCell?
matchStepPads? / matchCastArmed? / matchPicketArmed?
matchDraftArmed? / matchHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_match_font | open_match | drink_match |
                     //   tag_match | choose_device | match_file | match_pane
failureKind
deviceTable[]        // ENC-TREAS-20
rushVariant?         // trim_bait | ready_conductor | lean_palisade | near_ram
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Match Picket” logic — use `formationId` / `matchPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-27 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-19 families (Sestet / Tierce / Trideca / Psalm, …) or Wave-20 spell unique CORE — those wait on same-day / later catalogs. This catalog consumes drop-19 **formations** that can stand on Wave-18 kits.
- Faking Stave Mend without leftover-sum===5 on both bodies, Stave Sting as Score/Tied, Ring Stride as File / Knight, Rime Reel as Lava Reel, Stave Post walk-on as a detonate, Rift Skip as a required player hop, Dual Plate as a leftover-0 miss, Watch Drain as Watch Root or Watch Sip, Prime Gift as Tally / Poise / Equal, Hymn Turn as Duel Turn, Stave Hold as Score Hold, Match Pane as Brace Column, Match Sill as Ready, Match Step as Skew Step, Match Font as Pair Font, Match Picket as Ready Picket, Match Tutor as Ready Tutor, Match Draft as Pair Draft, Match File as Ready File, Match Gate in a dungeon, Dodeca Plug while cap is 2.
- Packing Cadence Cap with Cadence Dock. Packing Ring Stride with Rank Bite. Packing Stave Hold with Must Stave as a two-body. Packing Stave Mend with Score / Tally / Poise / Gaunt / Prime Gift menders.
- Consuming same-day 2026-10-28 Wave 20 family / spell / world catalogs.

---

## 10. Pick order (day-20, after days 1–19 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–19 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-20 + ENC-SPELL-39 (match-seam / stave-mend verbs)  
2. ENC-WAVE-21 (`formationId` STAVE-STEP → STAVE-SIP)  
3. ENC-STAVE-01 or ENC-FIVE-01 or ENC-RING-01 (new pressure objects)  
4. ENC-BRANCH-20 (`branch: stave|ring|rime|match` snapshot-before-cleanup)  
5. ENC-BOSS-20 branch read  
6. Rush Table R variants 75–78 one room at a time (after the account has one full Table Q clear)

Uniqueness: this file is the **twentieth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
