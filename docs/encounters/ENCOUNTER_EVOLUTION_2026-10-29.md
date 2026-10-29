# Encounter Evolution Catalog — 2026-10-29

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-29-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957), `ENCOUNTER_EVOLUTION_2026-10-24.md` (`EED-2026-10-24-001`, PR #1006), `ENCOUNTER_EVOLUTION_2026-10-25.md` (`EED-2026-10-25-001`, PR #1056), `ENCOUNTER_EVOLUTION_2026-10-26.md` (`EED-2026-10-26-001`, PR #1121), `ENCOUNTER_EVOLUTION_2026-10-27.md` (`EED-2026-10-27-001`, PR #1195), `ENCOUNTER_EVOLUTION_2026-10-28.md` (`EED-2026-10-28-001`, PR #1249). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-20 Wave 19 packs `docs/design/ENEMY_FORMATIONS_2026-10-28.md` (PR #1237), Wave 20 world features in `docs/WORLD_DYNAMICS.md` (PR #1235, `WDD-2026-10-28-001`), Rush Table S `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.18 (PR #1244). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-29) Wave 21 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 20 **families** (Septet / Quarte / Tetradeca and the rest of PR #1248) wait for a later formation drop (drop 21). Wave 21 **bosses** stay Rush-only (Table S). Wave 19 **families** (`sestet_mender`, `sestet_stinger`, `sestet_stepper`, `sestet_sipper`, `sestet_siller`, `sestet_holder`, `sestet_lender`, `sestet_prelate`, `sestet_bouncer`, `sestet_hooder`, `must_sesteter`, `verse_sesteter`, `tern_warder`, `octa_oather`, `mire_reeler`, `diag_biter`, `summon_marker`, `prime_plater`, `slide_skipper`, `capped_stinger`, `gait_gifter`, `cadence_terner`, `cadence_tiercer`, `odd_toller`, `brick_taxer`, `watch_taxer`, `thin_gaiter`, `lava_cutter`, `psalm_turner`, `trideca_prelate`, … — PR #1189 / drop 20) are legal **metadata locks** on drop-20 sheets, not a 30% lottery.

Naming collision: queued day-17 `ENC-POISE-01` is leftover **AP === MP ≥ 1**. Wave-20 world features reuse the word **Poise** for remaining **MP === max MP**. Encounter IDs in this file use **`STOCK`** for that remaining-MP-equals-max axis and still place the live `WF-*-POISE_*` ids. Do **not** honesty-reroll a Stock room into `ENC-POISE-01`.

---

## 1. Why a twenty-first day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–20 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, Dry/Lean/Odd, Gaunt/Even/Brick/Orth, Poise/Knight/Pit/Spent, Tally/Rank/Spike/Odd, Score/File/Lava/Ready, and Stave/Ring/Rime/Match. Day-20 rooms spent leftover drop-19 packs (`FSN-STAVE-STEP`, `FSN-STAVE-SIP`, `FSN-RING-HEPTA`, …) and Wave 19 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-20 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-20 Wave 19 packs | Day-20 taught leftover **AP + MP === 5** / Chebyshev-**2** non-knight walk / ice occupancy. Still PDFs: `FSN-SESTET-STEP`, `FSN-SESTET-SIP`, `FSN-TERN-OCTA`, `FSN-MIRE-DIAG`, `FSN-SESTET-GATE`, `FSN-SPAWN-PRIME`, `FSN-SLIDE-CAP`, `FSN-WATCH-THIN`, `FSN-SESTET-CHOIR`, `FSN-GAIT-TERN`, `FSN-SESTET-QUIET`, `FSN-PSALM-SESTET`, `FSN-TIERCE-VERSE`, `FSN-ODD-BRICK`, `FSN-PURSE-SESTET`, `FSN-SESTET-HOLD` |
| World-feature Wave 20 | Day-20 **rooms** never spent `WF-HAZ-POISE_SEAM`, `WF-HAZ-POISE_CINDER`, `WF-TRP-POISE_PLATE`, `WF-TER-POISE_PANE`, `WF-OBS-POISE_SILL`, `WF-ZON-POISE_FONT`, `WF-TEL-POISE_STEP`, `WF-INV-POISE_FILE`, `WF-ELT-POISE_PICKET`, `WF-TRS-POISE_CACHE`, `WF-SPL-POISE_TUTOR`, `WF-RSK-POISE_OATH`, `WF-MOD-POISE_CAST`, `WF-EVT-POISE_HOUR`, `WF-ENV-POISE_DRAFT` |
| Rush Table S | `S0`–`S3` (`sip_visitor`+`gaze_beadle`, `halve_registrar`+`veil_verger`, `odd_penitentiary`+`cinder_lance`, `sill_suffragan`+`goad_pretender`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `stockSeamCells` / `stockCinderCell` / `stockPlateCell` / `stockPaneCell` / `stockSillCell` / `stockFontCell` / `stockStepPads` / `stockCastArmed` / `stockPicketArmed` / `stockDraftArmed` / `stockHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post / Stave Post / Sestet Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8**. Nine Plug (`nine_prelate`, `FSN-POISE-HOLD/NINE`) counts as **9**. Dec Plug (`dec_prelate`, `FSN-TALLY-HOLD/DEC`) counts as **10**. Hendeca Plug (`hendeca_prelate`, `FSN-SCORE-HOLD/HENDECA`) counts as **11**. Dodeca Plug (`dodeca_prelate`, `FSN-STAVE-HOLD/DODECA`) counts as **12**. Trideca Plug (`trideca_prelate`, `FSN-SESTET-HOLD/TRIDECA`) counts as **13** — wait for remaining cap ≥ 13 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Sestet / Gait Gift / Stave / Prime Gift / Score / Lean Gift / Equal Gift / Shove Gift / Tally / Poise / Hollow Gift / Drift Gift / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Sestet Mend / Gait Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Stave Mend as Sestet Mend (Stave is leftover **sum === 5**; Sestet is leftover **sum === 6 AND unequal**). Do **not** clone Score Mend as Sestet Mend (Score is leftover **sum === 4 AND unequal**). Do **not** clone Tally Mend as Sestet Mend (Tally is leftover **sum === 3**). Do **not** clone Poise Mend as Sestet Mend (Poise is **both leftover AP === MP ≥ 1**). Do **not** clone Gaunt Mend as Sestet Mend (Gaunt is **both leftover 0**). Do **not** clone Equal Gift as Gait Gift (Equal Gift is **target-only** tied ≥ 1; Gait Gift is leftover **AP ≥ 2 AND MP = 0** on **one** body). Do **not** clone Prime Gift as Gait Gift (Prime Gift is leftover **exactly 1/1**). Do **not** clone Hymn Turn as Psalm Turn (Hymn Turn is **two allies**; Psalm Turn is **one ally and one hostile**, caster stays). Do **not** clone Duel Turn as Psalm Turn (Duel Turn is **two hostiles**). Do **not** clone Watch Tax as Watch Drain or Watch Root or Watch Sip (Tax **charges next spell +1 AP**; Drain **steals leftover MP**; Root **zeros leftover MP**; Sip **steals leftover AP**). Do **not** clone Diag Bite as File Bite or Rank Bite or Axis Bite (Diag Bite is **diagonal**; File Bite is **file-only**; Rank Bite is **rank-only**; Axis Bite is rank **or** file). Do **not** clone Capped Sting as Fresh Sting (Capped is leftover **MP === max MP**; Fresh is leftover **AP === max AP**). Do **not** clone Brick Tax as Brick Hold (Tax is a **walk +1 AP**; Hold is a **walk lock**). Do **not** clone Cadence Tierce as Cadence Tern (Tierce **kills** a remaining 3; Tern **writes** remaining >3 to 3 and **leaves** threes). Do **not** clone Ring Stride as Tern Stride (Ring is Chebyshev **2**, knight excluded, `(2,2)` legal; Tern is Chebyshev **3 orthogonal only**). Do **not** clone Match Seam as Stock Seam (Match taxes remaining **AP === remaining MP**; Stock taxes remaining **MP === max MP**).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-POISE_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow / Stride / Near / Ready / Match). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-POISE_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-21 ids (`sip_visitor`, `halve_registrar`, `odd_penitentiary`, `sill_suffragan`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / Score Step / Stave Step / **Sestet Step** / Tern Stride / Brick Step **does not** count as leftover walk-MP for Sestet Mend, Sestet Sting, Sestet Sip, Sestet Sill, Sestet Post, Must Sestet, Verse Sestet, Sestet Hold, Gait Gift, Capped Sting, Thin Gait, or Prime Plate. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Sestet Step dests are occupancy, **not** `isSwap`. Brick Tax **does not forbid** the walk and **does not negate hits**.
- Sestet Mend pays 8 only if **caster and target** leftover AP + leftover MP **=== 6 AND leftover AP ≠ leftover MP** after the 3 AP is paid. Legal pairs: `(6,0)` `(0,6)` `(5,1)` `(1,5)` `(4,2)` `(2,4)`. One broken sum **or** a tie is 0 HP. Dual Keep leftover **cannot** sit on sum 6. Dual Keep 2/2 is **Poise / Dual Plate, not Sestet**. Dual Keep leftover-sum 5 is **Stave**. Dual Keep leftover-sum 4 unequal is **Score**. Dual Keep leftover-sum 3 is **Tally**. Dual Keep 1/1 is **Prime Gift / Prime Plate**. Dual Keep 2/0 **can** open Gait Gift (one-body; Sestet still needs **both**). Dual Keep 1/0 **can** open Thin Gait. Score Lend (3,1)→(4,2) **manufactures Sestet**. `0 = 0` is Gaunt’s window, not this primer. `2 = 2` is Poise’s window, not this primer. `3 = 3` is Poise’s window, not this primer. `3 = 2` is Stave’s window, not this primer. `3 = 1` is Score’s window, not this primer. `3 = 0` is Tally’s window, not this primer. `1 = 1` is Prime Gift’s window, not this primer. Sestet Step relocates onto a free Chebyshev-1 of an ally whose leftover AP + leftover MP === 6 **and** unequal — not Stave / Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally Step. Sestet Sting is 10, +8 iff leftover AP + leftover MP === 6 **AND** unequal. Sestet Sip steals 1 leftover AP iff leftover sum === 6 unequal **and leftover AP ≥ 1** (`(0,6)` fizzles; `(4,2)`→`(3,2)` **manufactures Stave**; `(5,1)`→`(4,1)` **manufactures Stave**; `(6,0)`→`(5,0)` **manufactures Stave**). Tern Stride makes the **next** walk dest Chebyshev **exactly 3**, **orthogonal only**. `(3,0)` / `(0,3)` **are** legal. `(2,1)` **is not**. `(2,2)` **is not** (Ring Stride). Octa Oath wants the next spell at Chebyshev **exactly 8**; Strike stays legal. Mire Reel is the **twelfth** `applyAttract` dest (file / ally / foe / paint / hazard / void / barrier / pit / spike / lava / ice / then **mire occupancy**). Dest is **toward**, not onto, a world portal. Diag Bite bonuses a target who shares a **diagonal** `|dx|==|dy|` (file match without diagonal is 0; rank match without diagonal is 0). Summon Mark detonates on **summon spawn onto the painted cell**; walk-on / leftover-AP-remaining spell-from / leftover-AP-remaining Strike-from / last leftover AP on the cell / teleport / Swap / Sestet Step are free. Sestet Post detonates on end-turn occupy **and leftover AP + leftover MP === 6 AND unequal**; walk-on is safe; dump a pool is safe; Dual Keep 2/2 is safe; leftover-sum 5 is safe; leftover-sum 4 unequal is safe; leftover-sum 3 is safe. Sestet Sill taxes start-turn occupy **and leftover sum === 6 unequal**; paint stays. Slide Skip is next **1-tile** walk treating **conveyor auto-push** as floor; length ≥ 2 **pays**; lava / spikes / pits / rime / glyph / cinder / mire / shock / rift still tick. Capped Sting is leftover **MP equals that body’s max MP** poke; they may have spent AP and still hold max MP — Capped Sting **still hits**. Prime Plate zeros the next hit **while leftover AP === 1 AND leftover MP === 1**; leftover 2/2 lands (Dual Plate); leftover 1/0 lands (Thin Gait). Watch Tax: overwatch snap **taxes the walker’s next spell +1 AP** (inverse of Watch Drain’s leftover-MP steal and Watch Sip’s leftover-AP steal). Thin Gait is leftover **AP === 1 AND leftover MP === 0**. Gait Gift heals iff leftover **AP ≥ 2 AND leftover MP = 0**. Psalm Turn inverts leftover AP↔MP on **one same-side non-caster and one opposite-side**; caster leftover **unchanged**. Verse Sestet makes the last id illegal until leftover sum === 6 unequal (`0 = 0` does not peel; `2 = 2` does not; `3 = 3` does not; `3 = 2` does not; `3 = 1` does not; `1 = 1` does not; shove does not; Dual Keep does not). Must Sestet makes remaining **non-Strike** spells illegal unless leftover sum === 6 unequal **and** last AP. Sestet Hold refuses walk MP until leftover sum === 6 unequal; spells stay legal. Cadence Tern writes remaining `n>3` → `3`. Cadence Tierce writes remaining `n===3` → `0`. Odd Toll is leftover-AP-odd next-**walk** +1 AP. Brick Tax is next **walk** +1 AP while adjacent to a **barrier**.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 19 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-SESTET-01 / ENC-SPELL-41 / ENC-ELITE-40 (mend skin) | leftover AP + leftover MP **=== 6 AND unequal** on **both** bodies **or** occupancy dest for Sestet Step | Convert to ENC-STAVE-01 (queued day-20) without claiming Sestet Mend |
| ENC-SIX-01 / ENC-ELITE-40 (sting skin) | leftover-sum===6 unequal poke **or** leftover-sum leftover-AP steal (`(0,6)` fizzles; `(4,2)`→`(3,2)` manufactures Stave) | Convert to ENC-FIVE-01 (queued day-20) without claiming Sestet / Six |
| ENC-TERN-01 / ENC-SPELL-42 | next-walk dest Chebyshev == 3 AND orthogonal **or** next-spell exact Chebyshev 8 | Convert to ENC-RING-01 (queued day-20) without claiming Tern / Octa |
| ENC-MIRE-01 | twelfth `applyAttract` dest (mire occupancy) **or** share-diagonal bite | Convert to ENC-RIME-02 (queued day-20) without claiming Mire Reel |
| ENC-GATE-08 | leftover-sum===6 unequal occupy detonate **and** walk-on 0 **or** `summonAI === "sestetpost"` | Convert to ENC-GATE-07 (queued day-20) without claiming Sestet Gate |
| ENC-SPAWN-01 | summon-spawn-onto consume **or** leftover 1/1 miss | Convert to ENC-LAST-02 (queued day-20) without claiming Summon Mark / Prime Plate |
| ENC-SLIDE-02 / ENC-CAPPED-01 | 1-tile conveyor-tax-as-floor **or** leftover-MP===max poke | Convert to ENC-RIFT-01 (queued day-20) without claiming Slide Skip / Capped |
| ENC-SNAP-05 | overwatch snap **taxes next spell +1 AP** | Convert to ENC-SNAP-04 (queued day-20) without claiming Watch Tax |
| ENC-GIFT-01 | leftover AP≥2 AND MP=0 heal **or** remaining `n>3` → `3` | Convert to ENC-PRIME-02 leftover without claiming Gait Gift / Tern |
| ENC-PSALM-01 | mixed-side leftover AP↔MP invert **or** Dual Keep leftover as leftover | Convert to ENC-HYMN-01 leftover without claiming Psalm Turn |
| ENC-HOLD-10 / ENC-RARE-21 | walk refuse until leftover sum === 6 unequal **or** tools-until leftover-sum===6 unequal **and** last AP | Convert to ENC-HOLD-09 (queued day-20) without claiming Sestet Hold |
| ENC-TIERCE-01 / ENC-GIFT-01 (tern skin) | remaining `n===3` → `0` **or** remaining `n>3` → `3` | Convert to ENC-DOCK-01 (queued day-20) without claiming Tierce / Tern |
| ENC-QUIET-05 | leftover-sum-6-unequal join + leftover-sum-6-unequal heal + cover | Convert to ENC-SESTET-01 leftover without claiming Quiet |
| ENC-PANE-02 | walk-through LoS-block pane that smashes 1 AP only while remaining MP === max MP | Convert to ENC-PANE-01 (queued day-20) without claiming Stock Pane |
| ENC-PLATE-02 | occupancy-walk onto plate is free while remaining MP ≠ max MP; first **full-stock** enter taxes | Convert to ENC-PLATE-01 (queued day-20) without claiming Stock Plate |
| ENC-SILL-02 | wall→floor after player end-turn with remaining MP equal to max MP | Convert to ENC-SILL-01 (queued day-20) without claiming Stock Sill |
| ENC-PAD-04 | pad swap only while remaining MP equals max MP before the 1 MP | Convert to ENC-PAD-03 (queued day-20) without claiming Stock Step |
| ENC-PROT-21 | Stock Font heal only if remaining MP equals max MP | Convert to ENC-PROT-20 (queued day-20, Match) without claiming Stock |
| ENC-PRIO-23 | one-cast if the player ends a turn with remaining MP equal to max MP while they live | Convert to ENC-PRIO-22 (queued day-20) without claiming Stock Tutor |
| ENC-AMBUSH-21 | elite appears only while remaining MP equals max MP | Convert to ENC-AMBUSH-20 (queued day-20, remaining AP equals remaining MP) without claiming Stock |
| ENC-SURV-39 | end-of-turn tax if remaining MP equals max MP | Convert to ENC-SURV-38 (queued day-20) without claiming Stock Draft |
| ENC-STOCK-01 | first elite cannot spend AP until second dies / remaining MP === max MP | Convert to ENC-MATCH-01 (queued day-20) without claiming Stock File |
| ENC-TEACH-21 / ENC-HAZ-42 | stock (remaining MP === max MP) seam tax **or** SpellConfig legal only while remaining MP equals max MP | Convert to ENC-TEACH-20 / ENC-HAZ-40 (queued day-20) without claiming Stock / Stock Cast |
| ENC-HAZ-41 | orb hunts a currently full-stock unit | Convert to ENC-HAZ-39 (queued day-20) without claiming Stock Cinder |
| ENC-BRICK-02 | leftover-AP-odd next-walk +1 AP **or** barrier-adjacent walk tax | Convert to ENC-BRICK-01 (queued day-20) without claiming Odd Toll / Brick Tax |
| ENC-THIN-01 | leftover exactly 1/0 poke **or** leftover 1/1 miss | Convert to ENC-SPAWN-01 leftover without claiming Thin |
| ENC-KENNEL-02 | pet walk-diagonal AP tax **or** lava-threshold poke | Convert to ENC-KENNEL-01 (queued day-20) without claiming Lava Kennel |
| ENC-RUSH-79…82 | Table S bosses + Lavabo/Diurnal/Amice/Jamb objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Sestet / Tern / Mire / Stock primer + inserts)

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

| Beat | Depth hint | Job | Day-21 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (stock-seam hop, leftover-sum-6-unequal heal, stock cinder) | ENC-TEACH-21, ENC-SPELL-41, ENC-HAZ-41 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-22, ENC-AMBUSH-21, ENC-SPELL-42 |
| Combine | 2–3 | Two taught verbs | ENC-SESTET-01, ENC-SIX-01, ENC-TERN-01, ENC-HAZ-42, ENC-PANE-02, ENC-GATE-08 |
| Pressure | 3 | Clock, stock draft, pull-to-mire, or leftover-sum-6-unequal miss | ENC-SURV-39, ENC-PROT-21, ENC-MIRE-01, ENC-SNAP-05, ENC-PRIO-23, ENC-STOCK-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-21, ENC-BRANCH-21, ENC-TREAS-21, ENC-OATH-04, ENC-HOUR-05, ENC-PAD-04 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-40, ENC-ELITE-41, ENC-RARE-21, ENC-MAST-21, ENC-SPAWN-01, ENC-SLIDE-02, ENC-TIERCE-01, ENC-HOLD-10 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-22, ENC-BOSS-21, ENC-RUSH-79…82 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–20 remain valid. Day-21 **Sestet / Tern / Mire / Stock primer** is the default for accounts that already cleared Stave / Ring / Rime / Match once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-21

ENCOUNTER_ID: ENC-TEACH-21  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a full-stock path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile still-foot ribbon of `WF-HAZ-POISE_SEAM` across the mid-band (walk tiles cost 4% max HP **only while remaining MP equals max MP**; any spent MP is free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First full-stock-step tax logs a teach line. Do not also apply Match Seam (ENC-TEACH-20: tax while remaining AP equals remaining MP), Pair Seam (ENC-TEACH-19: tax while another living unit is Chebyshev ≤ 1), Hale Seam (ENC-TEACH-18: tax while current HP ≥ 50%), Spent Seam (ENC-TEACH-17: tax on **0 remaining AP**), Last Seam (ENC-TEACH-16: tax on **0 remaining MP**), Even Seam, Odd Seam, Bonded Seam, or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: spend 1 MP so the ribbon is free floor, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is a tax while the movement stock is full, free floor once you spend a chip; dumping the last MP is the expensive answer, not a bigger nuke.” Inverse of ENC-SURV-39’s end-turn full-stock tax. Prepares ENC-HAZ-42 / ENC-TREAS-21 (stock / stock devices). Distinct from ENC-TEACH-20 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-POISE_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-41`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-41

ENCOUNTER_ID: ENC-HAZ-41  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a full-stock body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-POISE_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit whose remaining MP currently equals max MP; ties prefer the lowest combatant id; if nobody is full-stock, it sits still; 5% max HP on land). Inverse of Match Cinder (ENC-HAZ-39: hunts remaining **AP === remaining MP**). Distinct from Busy Cinder (ENC-HAZ-37: hunts the **most AP spent last round**), Lean Cinder (ENC-HAZ-33: hunts the **fewest remaining AP**), Cast Cinder (ENC-HAZ-35: last `SpellConfig` spender), Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Hurt Cinder (lowest HP%), Rich Cinder (highest HP%), and Orbiting Cinder (clockwise square). Attack Nearest **does not** pull it (it reads remaining MP vs max, not last AP spend). A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: spend 1 MP so it sits, or bait it onto a full-stock enemy caster.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts a **currently full-stock** body, not a matched remaining-AP/MP body.” Distinct from ENC-HAZ-39 (match / remaining AP equals remaining MP).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: bishop starts full-stock so the orb prefers it until you spend MP. High: inherit one stock-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-42

ENCOUNTER_ID: ENC-HAZ-42  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. `SpellConfig` spends are illegal while remaining MP disagrees with max MP if `WF-MOD-POISE_CAST` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-21 stock-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-21`) **plus** `WF-MOD-POISE_CAST` armed (each combatant may spend a `SpellConfig` only while remaining MP equals max MP before that spend; Attack Nearest, summons, occupancy-walks, and 0-spell turns stay legal). A dry detour exists. Inverse of Match Cast (ENC-HAZ-40: remaining AP equals remaining MP). Distinct from Once Cast (ENC-HAZ-38: at most one `SpellConfig` this turn), Walk Lock (ENC-HAZ-36: after a walk, no casts), Cast Lock (ENC-HAZ-34: after a spell, no walks), Act Lock (ENC-HAZ-32: after **any** AP spend), File Walk (committed facing after the first step), and One Stride (at most 1 MP).  
SPECIAL_RULES: Scripted hazards only. Stock Cast does not rewrite damage. Attack Nearest is not a spell. Teleport tiles are not walks. Any MP spend, including 1 MP tiles, spends the stock.  
OBJECTIVE: Clear all. Intended: spend 1 MP then Attack Nearest; keep full stock then Frost; cross the seam after spending MP, or walk the dry detour.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine full-stock-HP tax with a full-stock-only-cast lock so “Frost then Inferno then dash through a full-stock clump” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Spent-MP Attack Nearest remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Sestet Sting. Peak: add `WF-ENV-POISE_DRAFT` so ending full-stock is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-41

ENCOUNTER_ID: ENC-SPELL-41  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-SESTET-STEP/SOLO-MEND` fallback — 1× `sestet_mender` queen (`spell-sestet-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Sestet Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Sestet-Mends only if **caster and target** leftover AP + leftover MP === 6 **AND** unequal **and** missing HP ≥ 8; else Shields. Dual Keep 2/2 is **Poise, skip**. Dual Keep leftover-sum 5 is **Stave, skip**. Dual Keep leftover-sum 4 unequal is **Score, skip**. Dual Keep leftover-sum 3 is **Tally, skip**. Dual Keep 1/1 is **Prime Gift, skip**. Dual Keep **cannot** open Sestet. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Mend (8 paid on leftover-sum===6 unequal flags) can drop `spell-sestet-mend` if missing. Do **not** grant `spell-stave-mend`, Score Mend, Tally Mend, Poise Mend, Gaunt Mend, or Prime Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-sestet-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Sestet Mend, convert to ENC-SESTET-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-sum-6-unequal writer → ENC-SPELL-39 leftover without claiming Sestet. Band 0 → show `FSN-STAVE-STEP`. Dual Keep leftover **cannot** fake sum 6. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 3` does **not** fire. `3 = 2` does **not** fire. `3 = 1` does **not** fire. `1 = 1` does **not** fire.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-sestet-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “leftover-sum===6 unequal flags cash 8; Dual Keep cannot open this; Score Lend can manufacture the window.” Distinct from ENC-SPELL-39 (leftover-**sum === 5**).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Sestet Step on a second queen (promote to ENC-SESTET-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-42

ENCOUNTER_ID: ENC-SPELL-42  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-TERN-OCTA/SOLO-STRIDE` fallback — 1× `tern_warder` pawn or knight (`spell-tern-stride` + `physical_attack`) + 1× bishop (`starter-frost` only). Octa Oath off until band 1 honesty.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal Chebyshev-3 orthogonal floor. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tern Stride (Chebyshev-3 orthogonal dest lock) can drop `spell-tern-stride` if missing. If already owned, glyph is `starter-frost`. Extra room `tern_gallery` is **not** this family.  
MAP_REQUIREMENTS: Open court with room to stand at Chebyshev-3 orthogonal dests. Optional glyph (`discoverSpellId: spell-tern-stride`).  
SPECIAL_RULES: If the player already owns Tern Stride, convert to ENC-TERN-01. Honesty: missing Chebyshev-3 orthogonal dest filter → ENC-SPELL-40 leftover without claiming Tern. Band 0 → show `FSN-RING-HEPTA`. Knight hops are illegal. `(2,2)` is illegal. `(3,0)` / `(0,3)` stay legal. Stand / Swap / forced-move still answer. Never PAIR Tern Stride + Octa Oath as a two-body without the peeler. Never PAIR Tern + Tierce.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: stand, Swap, or take a legal Chebyshev-3 orthogonal step.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-tern-stride`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the next walk is a tern of 3 orthogonal, not a ring of 2 and not a knight hop.” Distinct from ENC-SPELL-40 (Chebyshev-**2** non-knight + exact-7).  
SOLVABILITY_REQUIREMENTS: At least one legal Chebyshev-3 orthogonal floor dest from the player’s start. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Octa Oath (promote to ENC-TERN-01). Never pack Ring Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-SESTET-01

ENCOUNTER_ID: ENC-SESTET-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SESTET-STEP` — 1× `sestet_mender` queen (`spell-sestet-mend` + `starter-shield`) + 1× `sestet_stepper` queen without heal (`spell-sestet-step` + `physical_attack`). No Stave / Score / Tally / Poise / Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift / Equal / Lean / Prime / Gait Mend on PAIR. No Stave / Score / Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Cover Step on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if leftover sum ≠ 6 or either pair is a tie. Stepper protector; skip if ally leftover sum ≠ 6 or ally tied or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Mend or a legal Sestet Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Sestet Mend: 8 HP iff **caster and target** leftover AP + leftover MP === 6 **AND** unequal. One broken sum or a tie is 0 HP. Sestet Step is not ungated Home Step and not Stave Step. Band 0 → show `FSN-STAVE-STEP`. Honesty reroll → ENC-STAVE-01. Dual Keep leftover **cannot** fake sum 6. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 3` does **not** fire. `3 = 2` does **not** fire. `3 = 1` does **not** fire. `1 = 1` does **not** fire.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2 (Poise window, closes Sestet) **or** dump one pool so the sum leaves 6 **or** Score Lend to manufacture `(4,2)`.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-6-unequal discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum===6 unequal healer + leftover-sum===6 unequal joiner. Distinct from ENC-STAVE-01 (leftover-**sum === 5**) and ENC-SCORE-01 (leftover-**sum === 4 AND unequal**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-SESTET-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: elite Stepper. Peak: promote to ENC-QUIET-05 (Cover). Never Inferno. Never pack Stave Mend on PAIR.  
STATUS: PROPOSED

---

### ENC-SIX-01

ENCOUNTER_ID: ENC-SIX-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SESTET-SIP` — 1× `sestet_stinger` pawn (`spell-sestet-sting` + `physical_attack`) + 1× `sestet_sipper` pawn (`spell-sestet-sip` + `physical_attack`). No Watch Sip / Watch Drain / Stave Sip / Score Sip on PAIR.  
AI_REQUIREMENTS: Stinger lurks at 3 and commits when leftover sum === 6 unequal **or** HP% ≤ 40. Sipper Sips if leftover sum === 6 unequal and leftover AP ≥ 1; else Strikes. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Sting or Sestet Sip can drop that id if missing.  
MAP_REQUIREMENTS: Open court with a 3-tile lurk gallery. Exit reachable without crossing both bodies.  
SPECIAL_RULES: Family lottery **off**. Sestet Sting: 10, +8 iff leftover sum === 6 unequal. Dual Keep **cannot** open the 8. Sestet Sip: steal 1 leftover AP iff leftover sum === 6 unequal and leftover AP ≥ 1. **Sip always manufactures Stave when it lands.** `(0,6)` fizzles Sip and still fires Sting. Band 0 → show `FSN-STAVE-SIP`. Honesty reroll → ENC-FIVE-01. Cap leftover-AP steal at −1 with one Slow source.  
OBJECTIVE: Defeat both. Intended: sit `(0,6)` so Sip fizzles then dump MP too, **or** Dual Keep 2/2, **or** spend 1 leftover AP off `(4,2)`.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-6-unequal discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum-6-unequal poke + leftover-sum leftover-AP steal that **manufactures Stave**. Distinct from ENC-FIVE-01 (leftover-**sum === 5**). Prepares ENC-PURSE-02.  
SOLVABILITY_REQUIREMENTS: Two-unit occupancy leaves an exit. Lurk gallery is not a sealed pocket.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-SESTET-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: elite Stinger. Peak: inherit stock-seam on a **flank**. Never pack Watch Sip on PAIR.  
STATUS: PROPOSED

---

### ENC-TERN-01

ENCOUNTER_ID: ENC-TERN-01  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TERN-OCTA` — 1× `tern_warder` (`spell-tern-stride` + `physical_attack`) + 1× `octa_oather` bishop (`spell-octa-oath` + `starter-frost`). Strike stays legal on both.  
AI_REQUIREMENTS: Warder skips if no legal Chebyshev-3 orthogonal dest. Oather skips if the next spell cannot sit at Chebyshev 8. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tern Stride or Octa Oath can drop that id if missing.  
MAP_REQUIREMENTS: Open court with at least one Chebyshev-3 orthogonal aisle **and** a Chebyshev-8 shot lane. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Tern Stride: next walk dest Chebyshev **exactly 3**, orthogonal only. `(2,1)` illegal. `(2,2)` illegal. Octa Oath: next spell exact Chebyshev **8**; Strike stays legal. Band 0 → show `FSN-RING-HEPTA`. Honesty reroll → ENC-RING-01. Never PAIR Tern + Tierce. Never PAIR Tern Stride + Octa Oath without the peeler on a two-gun.  
OBJECTIVE: Defeat both. Intended: stand / Swap / take a legal tern step; Strike from any range; oath-spell only from 8.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + walk-shape discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Next-walk Chebyshev-3 orthogonal + next-spell exact 8. Distinct from ENC-RING-01 (Chebyshev-**2** non-knight + exact-**7**).  
SOLVABILITY_REQUIREMENTS: At least one legal tern dest and one Chebyshev-8 floor from spawn-side. Strike remains a complete answer.  
REPLAYABILITY: Aisle N-S vs E-W. Variant `FSN-TERN-OCTA/GUN` is ENC-ELITE-41, not this PAIR.  
SCALING_BEHAVIOUR: High: enable the Gun as ENC-ELITE-41. Never pack Ring Stride on PAIR.  
STATUS: PROPOSED

---

### ENC-MIRE-01

ENCOUNTER_ID: ENC-MIRE-01  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-MIRE-DIAG` — 1× `mire_reeler` knight (`spell-mire-reel` + `starter-frost`) + 1× `diag_biter` pawn (`spell-diag-bite` + `physical_attack`).  
AI_REQUIREMENTS: Reeler dest is **toward** painted mire occupancy, never onto a world portal, never onto lava if a dry toward-cell exists. Biter skip rider if the target does not share a diagonal. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mire Reel or Diag Bite can drop that id if missing.  
MAP_REQUIREMENTS: One painted mire occupancy of 3 tiles on a **gallery**, never the only path. Side aisle required. Extra room `bog_aisle` is **not** this family.  
SPECIAL_RULES: Family lottery **off**. Mire Reel is the twelfth `applyAttract` dest (after ice). Diag Bite bonuses `|dx|==|dy|` only. Never PAIR Diag Bite + Diag Ward / Diag Lock. Band 0 → show `FSN-RIME-RANK`. Honesty reroll → ENC-RIME-02. Twin Gate pads do **not** count as mire.  
OBJECTIVE: Defeat both. Intended: stand off-diagonal, refuse the toward-pull by occupying a dry toward-cell first, or kill the Reeler.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + occupancy-toward discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Pull toward painted mire + share-diagonal bite. Distinct from ENC-RIME-02 (ice + **rank**-only) and ENC-LAVA-01 (lava + **file**-only).  
SOLVABILITY_REQUIREMENTS: Dry path around mire. Toward dests have walk-offs. Mire is not a cut-vertex. Counts toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Gallery west vs east. Variant `FSN-MIRE-DIAG/GLYPH` adds a glyph sower as a third body — never two reels.  
SCALING_BEHAVIOUR: High: inherit stock-seam on a **flank**. Peak: Glyph variant. Never two reels.  
STATUS: PROPOSED

---

### ENC-GATE-08

ENCOUNTER_ID: ENC-GATE-08  
TYPE: protection objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SESTET-GATE` — 1× `sestet_prelate` pawn (`spell-sestet-post` + `physical_attack`, `summonAI: "sestetpost"`) + 1× `sestet_siller` rook (`spell-sestet-sill` + `starter-frost`). Two different tiles.  
AI_REQUIREMENTS: Prelate plants the post on a free floor cell that is **not** spawn/portal/sill. Siller never paints the post’s cell. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Post or Sestet Sill can drop that id if missing.  
MAP_REQUIREMENTS: Two marked floor cells ≥ Chebyshev 3 apart. Exit reachable without occupying either.  
SPECIAL_RULES: Family lottery **off**. Sestet Post: end-turn occupy with leftover sum === 6 unequal deals 10 and the post dies. Walk-enter is **safe**. Dual Keep 2/2 / leftover-sum 5 / leftover-sum 4 unequal / leftover-sum 3 overnight is **safe**. Sestet Sill: start-turn leftover-sum===6 unequal tax; paint stays 2 turns. Band 0 → show `FSN-STAVE-GATE`. Honesty: missing `summonAI === "sestetpost"` → ENC-GATE-07. Remaining cap ≥ 1 for the post body.  
OBJECTIVE: Defeat both. Intended: leave before end-turn, dump to leftover-sum 5 (Stave Post’s window), Dual Keep 2/2, or kill the 1-HP post.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Leftover-sum-6-unequal post + start-turn leftover-sum-6-unequal sill. Distinct from ENC-GATE-07 (leftover-**sum === 5**).  
SOLVABILITY_REQUIREMENTS: Post and sill are free floor, not portals. Walk-on the post is legal. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Post north vs east. Variant `FSN-SESTET-GATE/STING` adds Sting as a third body — never two posts. Never PAIR Post + Sting without the Sill peeler.  
SCALING_BEHAVIOUR: High: Sting variant. Never a second post.  
STATUS: PROPOSED

---

### ENC-WAVE-22

ENCOUNTER_ID: ENC-WAVE-22  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-SESTET-STEP` (or band-0 `FSN-STAVE-STEP` if leftover-sum-6-unequal is missing). Wave 2: `FSN-SESTET-SIP` (or band-0 `FSN-STAVE-SIP`). Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 PAIR AI. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 1 may reveal Sestet Mend / Sestet Step. Wave 2 may reveal Sestet Sting / Sestet Sip.  
MAP_REQUIREMENTS: Fortress lane + **one side aisle**. `waveSpawnCells` in the far lane. Optional stock-seam inherited from ENC-TEACH-21 (`inheritModifierFrom: ENC-TEACH-21`) so spending MP is the same verb.  
SPECIAL_RULES: Portal locked until wave 2 is clear. Score Lend is **not** on either PAIR (it manufactures Sestet on a later CADRE). Honesty: missing leftover-sum-6-unequal → ENC-WAVE-21 leftover without claiming Sestet.  
OBJECTIVE: Survive and clear both waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Named drop-20 pairs as wave verbs — leftover-sum-6-unequal heal window, then leftover-sum-6-unequal poke that manufactures Stave — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Side aisle reaches the backline. Cap 4 living so later summons are not starved.  
REPLAYABILITY: Wave 2 can swap to `FSN-TERN-OCTA` if the player already answered SESTET-SIP this account.  
SCALING_BEHAVIOUR: High: wave 2 leftover is `FSN-SESTET-SIP/E-STING`. Peak: inherit Stock Cast. No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-21

ENCOUNTER_ID: ENC-AMBUSH-21  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× pawn (`physical_attack`). Hidden until trigger: `WF-ELT-POISE_PICKET` elite rook (`spell-iron-skin` + Strike).  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP). Picket is stationary until it stands, then charger. Picket is not an AI actor while remaining MP ≠ max MP (exploration: they leave). In a dungeon they stand from map start.  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Painted post cell. Trigger: player remaining MP equals max MP (the post fills) **or** bait drops below 50% HP **or** the player crosses the midline. In dungeon / boss rush the picket stands from map start (required for map-clear).  
SPECIAL_RULES: Ambush units do not exist in the combatant store until trigger **in exploration**. In a run they exist from spawn (`holdPortalLocked`). Inverse of ENC-AMBUSH-20 (Match Picket: remaining AP equals remaining MP). Distinct from Ready Picket (remaining AP equals max AP) and Plant Picket (remaining MP 0). Soft: killing the bait with overkill still fires the ambush. Intent log: explicit `ambush: stock_picket`.  
OBJECTIVE: Defeat bait + picket.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player spent MP before the midline (stood spent so the picket did not hunt). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Punish camping full-stock; teach that remaining MP === max MP can *call* a post. Distinct from ENC-AMBUSH-20’s matched remaining pools.  
SOLVABILITY_REQUIREMENTS: `ambushCells` reachable after spawn; bait cannot spawn on the portal. Picket counts as 1 toward `MAX_ENEMIES`.  
REPLAYABILITY: Post left/right. Bait can be omitted at low band (picket only, dungeon-required).  
SCALING_BEHAVIOUR: High: picket is `FSN-SESTET-HOLD` warden presentation (still one elite tag). Peak: inherit one stock-seam tile on a **flank**.  
STATUS: PROPOSED

---

### ENC-REINF-21

ENCOUNTER_ID: ENC-REINF-21  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPAWN-PRIME/GOAD` — 1× `summon_marker` rook (`spell-summon-mark` + `starter-frost`) + 1× `prime_plater` knight (`spell-prime-plate` + `starter-shield`) + 1× `brood_chanter` king (`isSummoner`, one pet, cap 1). Never Mark+Goad as a two-body. Living hostiles + pets ≤ 4. Summon cap 2 with the planted pet counting 1.  
AI_REQUIREMENTS: Marker paints a free floor cell; skip if no free floor. Plater skips if leftover is not exactly 1/1. Chanter skip if cap or no free floor. If the marker is marked/exposed, a 1-pawn reinforcement spawns on `reinfCells` (cap 1 extra).  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Summon Mark or Prime Plate can drop that id if missing.  
MAP_REQUIREMENTS: Two-depth backline + screen line. Paint cell is not spawn/portal. `reinfCells` adjacent to the king, reachable floor.  
SPECIAL_RULES: Reinforcement trigger is `onMarkerExposed` (explicit). If living + pending would exceed 4, skip further spawns. Portal locked until the board is empty. Honesty: missing summon-spawn-onto writer → ENC-LAST-02 leftover without claiming Spawn Prime. Walk-on the paint is **safe**. Spell-from is **safe**. Last leftover AP on the cell is **safe**. Never PAIR Mark + Goad as a two-body.  
OBJECTIVE: Clear all. Implicit priority: marker, then chanter.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + priority bonus if no pawn reinforcement ever spawned.  
TACTICAL_PURPOSE: Spawn-onto paint plus leftover-1/1 miss. Distinct from ENC-REINF-20 (match remaining-AP-equals-max) and ENC-LAST-02 (last leftover AP on the cell).  
SOLVABILITY_REQUIREMENTS: Backline reachable; summons spawn on free reachable floor only; `reinfCells` never on the portal.  
REPLAYABILITY: `/THIN` (ENC-THIN-01) if the player already answered Goad this account.  
SCALING_BEHAVIOUR: Support gains Iron Skin on the pet before the chanter gains a third spell. Cap stays 2.  
STATUS: PROPOSED

---

### ENC-SPAWN-01

ENCOUNTER_ID: ENC-SPAWN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPAWN-PRIME` — 1× `summon_marker` + 1× `prime_plater`. No Goad on this CELL.  
AI_REQUIREMENTS: Marker setter. Plater guardian; skip leftover not 1/1. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Summon Mark or Prime Plate can drop that id if missing.  
MAP_REQUIREMENTS: Open court, one painted cell. Exit reachable without occupying the paint.  
SPECIAL_RULES: Family lottery **off**. Summon Mark: summon spawn onto the paint consumes. Prime Plate: next hit 0 while leftover **exactly 1/1**. Hit at 2/2 lands. Hit at 1/0 lands. Band 0 → show `FSN-LAST-DUAL`. Honesty reroll → ENC-LAST-02. Dual Keep 1/1 **opens** the miss.  
OBJECTIVE: Defeat both. Intended: spawn onto a neighbor, wait the paint, or hit off 1/1.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Spawn-onto paint + leftover 1/1 miss. Distinct from ENC-LAST-02 (last leftover AP + even/even miss).  
SOLVABILITY_REQUIREMENTS: Paint is free floor, not a portal. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Paint west vs east.  
SCALING_BEHAVIOUR: High: promote to ENC-REINF-21 (`/GOAD`). Peak: ENC-THIN-01 (`/THIN`). Never Mark+Goad PAIR.  
STATUS: PROPOSED

---

### ENC-SLIDE-02

ENCOUNTER_ID: ENC-SLIDE-02  
TYPE: movement objective / hazard / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SLIDE-CAP` — 1× `slide_skipper` pawn (`spell-slide-skip` + `physical_attack`) + 1× `capped_stinger` pawn (`spell-capped-sting` + `physical_attack`).  
AI_REQUIREMENTS: Skipper skip if no 1-tile conveyor. Stinger lurks at 3 and commits when leftover MP === max **or** HP% ≤ 40. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Slide Skip or Capped Sting can drop that id if missing. Extra room `belt_nave` is **not** this family.  
MAP_REQUIREMENTS: One 1-tile conveyor on a **gallery**, never the only path. Length ≥ 2 **pays**. A dry detour exists.  
SPECIAL_RULES: Family lottery **off**. Slide Skip treats 1-tile conveyor auto-push as floor. Capped Sting: 10, +8 iff leftover MP **equals that body’s max MP**. Fresh Sting (leftover AP === max) **misses** a spent-AP / max-MP bar. Band 0 → show `FSN-RIFT-FRESH`. Honesty reroll → ENC-RIFT-01. Distinct from ENC-SLIDE-01 (queued day-5 enter-push; standing free).  
OBJECTIVE: Defeat both. Intended: spend 1 walk MP, sit leftover MP 0, or fight belt-less.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: 1-tile conveyor skip + leftover-MP===max poke. Distinct from ENC-RIFT-01 (Void Rift skip + leftover-**AP===max** poke). Prepares ENC-CAPPED-01.  
SOLVABILITY_REQUIREMENTS: Dry detour reaches both. Conveyor is not a cut-vertex. Counts toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Belt N-S vs E-W. Variant `FSN-SLIDE-CAP/TIDE` adds a tide-shade — never two skips. Cap Slow at −2.  
SCALING_BEHAVIOUR: High: Tide variant. Peak: inherit stock-seam on a **flank**. Never a second belt.  
STATUS: PROPOSED

---

### ENC-CAPPED-01

ENCOUNTER_ID: ENC-CAPPED-01  
TYPE: elite / optional challenge  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Elite `capped_stinger` (`variant: elite`, Capped Sting + Strike) + junior skipper (Slide Skip only). Same PAIR as ENC-SLIDE-02 with elite tag on the stinger.  
AI_REQUIREMENTS: Elite commits when leftover MP === max. Skipper holds the belt. Soph 2–3. Lethal lookahead on.  
SPELL_DISCOVERY_OPPORTUNITIES: Elite death after it used Capped Sting can drop that id (once per character).  
MAP_REQUIREMENTS: Same as ENC-SLIDE-02 plus a painted still-foot ring so full-stock is readable.  
SPECIAL_RULES: Random 30% lottery **off**. Only one elite. They may have spent AP and still hold max MP — the +8 **still hits**. Do not inflate elite HP beyond band pawn + one Capped cycle.  
OBJECTIVE: Defeat the elite. Skipper optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of “spend a walk chip; leftover MP below max turns the elite into a fat Strike.”  
SOLVABILITY_REQUIREMENTS: Engagement pocket ≥ 2 walk-off tiles. Hostiles start ≥ Chebyshev 4 from the player.  
REPLAYABILITY: Belt left/right.  
SCALING_BEHAVIOUR: Add skipper Iron Skin before any HP bump. Peak: inherit Stock Draft. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SNAP-05

ENCOUNTER_ID: ENC-SNAP-05  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WATCH-THIN` — 1× `watch_taxer` bishop (`spell-watch-tax` + `starter-frost`) + 1× `thin_gaiter` pawn (`spell-thin-gait` + `physical_attack`). Never Tax+Gun PAIR.  
AI_REQUIREMENTS: Taxer overwatch; snap taxes the walker’s next spell +1 AP. Thin skip if leftover is not **exactly 1/0** unless 10 still kills. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Watch Tax or Thin Gait can drop that id if missing.  
MAP_REQUIREMENTS: Gallery overwatch tile + a 1/0 aisle. Exit reachable without crossing the gun lane.  
SPECIAL_RULES: Family lottery **off**. Watch Tax is **not** Watch Drain (leftover-MP steal), Watch Root (leftover-MP zero), or Watch Sip (leftover-AP steal). Thin Gait leftover 1/1 is Prime; leftover 0/0 is Gaunt; leftover 2/0 is Gait Gift. Band 0 → show `FSN-WATCH-EVEN`. Honesty reroll → ENC-SNAP-04. Never Tax+Gun as a two-body (`/GUN` is the 3-body).  
OBJECTIVE: Defeat both. Intended: Attack Nearest so the next-spell tax never fires, or sit leftover 1/1 / 0/0 / 2/0 so Thin misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + anti-walk-spell discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Overwatch next-spell +1 AP + leftover-1/0 poke. Distinct from ENC-SNAP-04 (Watch Drain leftover-MP steal).  
SOLVABILITY_REQUIREMENTS: Overwatch tile is floor. Two-unit occupancy leaves an exit. Strike remains a complete answer.  
REPLAYABILITY: Gun lane N vs E. Variant `FSN-WATCH-THIN/GUN` adds a glass sniper as a third body — never Tax+Gun PAIR.  
SCALING_BEHAVIOUR: High: `/GUN`. Peak: inherit Stock Cast so the taxed spell is also stock-gated. Never two taxers.  
STATUS: PROPOSED

---

### ENC-THIN-01

ENCOUNTER_ID: ENC-THIN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SPAWN-PRIME/THIN` — 1× `thin_gaiter` + 1× `prime_plater` + 1× `plate_warden` rook (`starter-shield`). Never Plate+Thin as a two-body.  
AI_REQUIREMENTS: Thin skip leftover not 1/0. Plater skip leftover not 1/1. Warden interposes. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Thin Gait after a Prime Plate miss can drop Thin Gait if missing.  
MAP_REQUIREMENTS: Open court. Three-unit occupancy leaves walk-offs.  
SPECIAL_RULES: Unlock after ENC-SPAWN-01. Camp 1/1 miss, then poke leftover 1/0 after they spend the MP. Dual Keep 1/1 opens the miss. Dual Keep 1/0 opens Thin. Never PAIR Plate + Thin as a two-body.  
OBJECTIVE: Defeat all. Intended: hit off 1/1, dump the last AP so leftover is not 1/0, or kill Thin first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: 1/1 miss then 1/0 poke. Distinct from ENC-SPAWN-01 (spawn-onto + 1/1 miss without the 1/0).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 from the player.  
REPLAYABILITY: Thin north vs east.  
SCALING_BEHAVIOUR: Do not add a fourth body. Peak: inherit Stock Draft.  
STATUS: PROPOSED

---

### ENC-PANE-02

ENCOUNTER_ID: ENC-PANE-02  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop holds LoS through the pane. Pawn charges the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Short corridor has `WF-TER-POISE_PANE` (walkable LoS-block; smash costs 1 AP **only while remaining MP equals max MP**; spent-MP smash is free LoS). Always-open long path. Inverse of ENC-PANE-01 (Match Pane: smash only while remaining AP equals remaining MP). Distinct from Frost Pane (1 AP smash always), Brace Column (walk+LoS brace/smash), Reed Screen (open LoS), Slit (rotate), Hush (blocks spells).  
SPECIAL_RULES: Pane is not a wall for walking. Smash is optional. Long path works with the pane permanently opaque.  
OBJECTIVE: Clear hostiles. Intended: spend 1 MP then smash for free, or walk the long path.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit` if they smash while full-stock (paid the tax).  
TACTICAL_PURPOSE: Teach “full-stock LoS smash costs AP; a spent chip makes the pane cheap.” Distinct from ENC-PANE-01 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to bishop **without** the pane. Pane is not a cut-vertex.  
REPLAYABILITY: Pane north vs east.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: inherit stock-seam on the long path.  
STATUS: PROPOSED

---

### ENC-PLATE-02

ENCOUNTER_ID: ENC-PLATE-02  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop + 1× pawn.  
AI_REQUIREMENTS: Neither camps the plate.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TRP-POISE_PLATE` on a mid-court floor cell (occupancy-walk onto the plate is free while remaining MP ≠ max MP; first **full-stock** enter taxes 6% max HP). Inverse of ENC-PLATE-01 (Match Plate: first **matched** enter taxes). Distinct from Glyph Plate (any-enter), Chevron (painted facing), Skew (diagonal), Spent Plate (remaining AP 0), Dash (after MP), Camp (end-turn).  
SPECIAL_RULES: Scripted plate only. Never on spawn±3 or the portal. Walk-off is free.  
OBJECTIVE: Clear all. Optional: spend MP before stepping the plate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the plate cares about a full movement stock, not matched remaining pools.”  
SOLVABILITY_REQUIREMENTS: Path around the plate. Counts as 1 toward the hazard cap.  
REPLAYABILITY: Plate west vs east.  
SCALING_BEHAVIOUR: Mid: inherit stock cinder on a **gallery**. Never two plates.  
STATUS: PROPOSED

---

### ENC-SILL-02

ENCOUNTER_ID: ENC-SILL-02  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× kiting bishop on the **short** path behind a `WF-OBS-POISE_SILL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the short path and does not walk through the sill while it is a wall. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Reaching the far banner **before** the sill unlatches (took the long path) can offer `spell-haste`. Waiting and walking the short path after a full-stock end-turn can offer `starter-shield` (patience). One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor has `WF-OBS-POISE_SILL` (wall until the player ends a turn with remaining MP equal to max MP, then floor). Long route already exists. Far `objectiveCell` banner. Exit locked until the player occupies the banner **and** hostiles are dead. Inverse of ENC-SILL-01 (Match Sill: remaining AP equals remaining MP). Distinct from Ready Sill (remaining AP equals max AP) and Plant Font (remaining MP 0).  
SPECIAL_RULES: Sill is a wall while up (LoS + walk). Enemies may wait. `holdPortalLocked` until cleanup.  
OBJECTIVE: Touch the banner and clear hostiles.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus Doka if the player never stood adjacent to the sill while it was up (committed to a line).  
TACTICAL_PURPOSE: Teach “end a turn full-stock vs spend MP now and walk long.” Distinct from ENC-SILL-01 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to banner **without** the sill. Sill is not a cut-vertex. Banner not on a portal.  
REPLAYABILITY: Sill north vs east.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: inherit stock-seam on the long path.  
STATUS: PROPOSED

---

### ENC-SURV-39

ENCOUNTER_ID: ENC-SURV-39  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Start: 2× pawn + 1× bishop. Every 3 enemy-team turns, spawn 1 from {pawn, knight lurker, sestet-stinger presentation} until the clock ends. Max 4 living.  
AI_REQUIREMENTS: Casters hold LoS. Lurkers prefer the **next** full-stock body so the player is punished for camping max MP. Group tactics if soph ≥ 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Survive 8 turns without `spell-timestep` → rest shrine may offer timestep (reminder, not a free grant).  
MAP_REQUIREMENTS: Arena. Safe core of 5 tiles. `WF-ENV-POISE_DRAFT` armed (3% max HP if remaining MP equals max MP at end of turn; ending after spending any MP is shelter). Painted still-foot rings sit around full-stock bodies. Inverse of ENC-SURV-38 (Match Draft: tax when remaining AP equals remaining MP). Optional `swift_winds` so kiting is possible. Parallel floor path remains.  
SPECIAL_RULES: Clock `surviveTurns: 10` player-turns. When it hits 0, remnants flee to the edge and despawn (not player kills). Portal unlocks only after the board is empty. Draft never seals spawn or exit.  
OBJECTIVE: Be alive after 10 player turns, then clear or let remnants flee.  
FAILURE_CONDITION: Player death before clock + cleanup.  
REWARD: Survival table (depth × 50 Doka + 100 XP) plus kill XP only for units actually defeated. Prefer overlay `no_healing` over `no_damage_taken`.  
TACTICAL_PURPOSE: Pressure beat — a **full-stock** end-turn tax, not a matched remaining-pool tax (ENC-SURV-38) and not a shrinking void (ENC-SURV-03).  
SOLVABILITY_REQUIREMENTS: Core always reachable; flee-edge tiles exist; hazard count ≤ 50.  
REPLAYABILITY: Opener caster bishop vs bone_scribe.  
SCALING_BEHAVIOUR: Mid uses only pawns in the pool. High unlocks the lurker. Peak unlocks the sestet-stinger presentation. Never shorten the clock below 8.  
STATUS: PROPOSED

---

### ENC-ELITE-40

ENCOUNTER_ID: ENC-ELITE-40  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-SESTET-STEP/E-STEP` — elite Stepper (`variant: elite`, Sestet Step + Strike) + junior Mender (Sestet Mend + Shield). Elite is not a boss: no phase table, no `BossAbility`.  
AI_REQUIREMENTS: Mender healer; skip if leftover sum ≠ 6 or tied. Stepper protector. Soph 1–3. Until occupancy dests exist, do **not** ship this id — fall back to ENC-ELITE-38.  
SPELL_DISCOVERY_OPPORTUNITIES: Mender death after it used Sestet Mend can drop that id (once per character).  
MAP_REQUIREMENTS: `openField` or `arena`. Reject a 1-tile tunnel.  
SPECIAL_RULES: Random 30% family lottery is **off**. Only one elite. Do not inflate elite HP beyond band queen + one Sestet cycle. Dual Keep cannot fake the window.  
OBJECTIVE: Defeat the elite. Mender optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of “dump a leftover so the sum leaves 6; the Stepper without a leftover-sum-6-unequal ally is Frost.” Consumes a real drop-20 PAIR.  
SOLVABILITY_REQUIREMENTS: Engagement pocket ≥ 2 walk-off tiles. Hostiles start ≥ Chebyshev 4 from the player.  
REPLAYABILITY: `/E-STING` on `FSN-SESTET-SIP` as the sting skin of the same beat.  
SCALING_BEHAVIOUR: Add Cover only by converting to ENC-QUIET-05, never on this PAIR.  
STATUS: PROPOSED

---

### ENC-ELITE-41

ENCOUNTER_ID: ENC-ELITE-41  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-TERN-OCTA/GUN` — elite `glass_sniper` bishop (`variant: elite`, frost; sits at Chebyshev 8) + junior Tern Warder + junior Octa Oather. Never two guns. Never PAIR Tern + Gun without the Oather peeler.  
AI_REQUIREMENTS: Warden filters tern dests. Oather holds the 8-lane. Sniper holds Chebyshev ≥ 8 and never Nova. If the player enters 2, sniper steps away. Soph 1–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Sniper death after it used frost can complete frost observation. Sibling `spell-tern-stride` if missing.  
MAP_REQUIREMENTS: Fortress or openField with **main lane plus one side aisle** plus a Chebyshev-8 shot. Reject a single-tile tunnel. No lava on the only approach.  
SPECIAL_RULES: Random 30% lottery off. Only one elite. If pack size would be 1, reroll (sniper must not spawn solo).  
OBJECTIVE: Defeat all. Intended line: aisle → oather first so the gun’s 8-lane peels.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier on the sniper only + standard XP. Overlay `under_15_turns` (not `direct_hit` — this is a lane fight).  
TACTICAL_PURPOSE: Exact-8 gun behind a tern door. Distinct from ENC-ELITE-39 (`FSN-RING-HEPTA` exact-7).  
SOLVABILITY_REQUIREMENTS: Side aisle reaches the sniper. Two walk-offs in the engagement pocket. Strike remains legal.  
REPLAYABILITY: `/GOLEM` warden vs leash_warden presentation.  
SCALING_BEHAVIOUR: Do not add a second gun. Scale oather Haste uptime, not HP.  
STATUS: PROPOSED

---

### ENC-PROT-21

ENCOUNTER_ID: ENC-PROT-21  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× charger pawn + 1× bishop focusing the **stock font**.  
AI_REQUIREMENTS: All enemies prefer occupying `WF-ZON-POISE_FONT` (`objectiveCell` / `protectTargetId` override) so the first full-stock end-turn there heals 8% max HP then dries. They do not retreat from the font. Ending after spending any MP does nothing and does not dry it.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player drank the font at remaining MP equals max MP and used `starter-shield` or `summon-sentinel`, rest may offer `summon-sentinel` if missing.  
MAP_REQUIREMENTS: Central still-foot basin (`WF-ZON-POISE_FONT`, one walkable cell). Player spawns adjacent. Enemies from the far end + one side alley. No hazard on the font. Inverse of ENC-PROT-20 (Match Font: remaining AP equals remaining MP). Distinct from Ready Hour (remaining AP equals max AP), Empty Font (remaining AP 0), Plant Font (remaining MP 0), Pair Font (Chebyshev ≤ 1), Alone Font (no neighbor), Shrine Pool (unconditional).  
SPECIAL_RULES: The font is a tile, not an allied token. Portal unlocks when hostiles are dead. The player does **not** fail if they never drink — holding it is the intended line. Optional fail-if-enemy-drank is **off**. Heal is a zone tick, not a spell. If the drinker is the player, persist the new HP through `saveBattleStats` on the progress lock. Does not call `applyRewards`.  
OBJECTIVE: Clear hostiles. Intended: occupy the font full-stock so the 8% lands on you, or pull the fight off it and deny the bishop the tile.  
FAILURE_CONDITION: Player death only.  
REWARD: Protection-adjacent grant (band table) + kill XP. Overlay `direct_hit` (stay on the font).  
TACTICAL_PURPOSE: Contest a **full-stock heal tile**, not a matched remaining-pool font (ENC-PROT-20).  
SOLVABILITY_REQUIREMENTS: Alley does not spawn on the font. Font not on spawn±3 or portal. If any hazard exists, it is not adjacent to the font.  
REPLAYABILITY: Alley left/right. Bishop frost vs weaken.  
SCALING_BEHAVIOUR: Add a second alley flanker before raising ATK. Peak: `mending_mist` **off** (would hide the font drink).  
STATUS: PROPOSED

---

### ENC-PRIO-23

ENCOUNTER_ID: ENC-PRIO-23  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `WF-SPL-POISE_TUTOR` medium enemy carrying 1 extra `SpellConfig` row with `usableByEnemy === true` (prefer `spell-sestet-mend` if missing, else `spell-tern-stride`) + 1× rook screen.  
AI_REQUIREMENTS: Tutor kites. Screen guards the tutor (`AI_BACKLINE_PROTECT` on `tutorId`).  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn with remaining MP equal to max MP while the tutor still lives (any distance), the player gains that spell id as a **single remaining cast this map**. Killing them before that stock teach grants the purse but not the one-cast. They stay hostile after the teach. Inverse of ENC-PRIO-22 (Match Tutor: remaining AP equals remaining MP). Distinct from Ready Tutor, Plant Tutor, Close Tutor, Live Tutor, Steel Hour.  
MAP_REQUIREMENTS: Open court. Tutor needs LoS and a retreat tile. Screen does not seal the tutor.  
SPECIAL_RULES: Unlock after ENC-TEACH-21 so the player has seen full-stock as a resource. Possession of the one-cast is not observation for the sibling pipeline — winning after the tutor **used** the extra row still follows use → observe → win → grant.  
OBJECTIVE: Clear. Intended: end a turn full-stock at any distance, then kill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + the one-cast if the teach fired. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Full-stock teach at any distance. Distinct from ENC-PRIO-22 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Tutor reachable; screen does not seal.  
REPLAYABILITY: Extra row sestet-mend vs tern-stride by which glyph is missing.  
SCALING_BEHAVIOUR: High: screen is elite. Never a second tutor.  
STATUS: PROPOSED

---

### ENC-STOCK-01

ENCOUNTER_ID: ENC-STOCK-01  
TYPE: elite / optional challenge / duel  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-POISE_FILE` as a **scripted dungeon room** — 2× same-band elites (hard threat presentation): one `FSN-SESTET-STEP` stepper elite + one `FSN-TERN-OCTA` warder elite. The first (painted still-foot pennant) cannot spend AP until the second is dead **OR** the player ends a turn with remaining MP equal to max MP. Occupancy-walks (MP) stay legal. Inverse of ENC-MATCH-01 (remaining AP equals remaining MP unlock). Distinct from Ready File, Sheath File, Mute File, Guard File, Sleeping Vanguard.  
AI_REQUIREMENTS: Locked elite occupancy-walks only until unlock. Unlocked elite uses its PAIR AI. They do **not** heal each other.  
SPELL_DISCOVERY_OPPORTUNITIES: Winner-of-two can drop Sestet Step or Tern Stride, whichever the unlocked body used.  
MAP_REQUIREMENTS: Painted file, 6–8 floor tiles. Exit reachable without entering the file **in exploration**; in a dungeon-chain both count as hostiles for map-clear (must fight). File not on spawn/portal.  
SPECIAL_RULES: In a run, contact is immediate combat. Victory pays hard-band Doka. Cap 2 living elites + 0 trash. Portal locked until both are dead.  
OBJECTIVE: Defeat both elites. Intended: spend 1 MP to unlock early, or kill the free elite first.  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band depth Doka + elite XP on both. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two different taught elites at once — leftover-sum-6-unequal joiner vs tern walk — and a readable full-stock unlock. Pressure beat that is not a clock.  
SOLVABILITY_REQUIREMENTS: File floor; 2 elites start ≥ Chebyshev 4 from the player and from each other; walk-offs exist.  
REPLAYABILITY: Stepper/warder vs stinger/reeler pair for Mire-branch accounts.  
SCALING_BEHAVIOUR: Do not add a third elite. Peak: inherit Stock Draft.  
STATUS: PROPOSED

---

### ENC-PAD-04

ENCOUNTER_ID: ENC-PAD-04  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× kiting bishops (`starter-frost`). 0 melee on entry.  
AI_REQUIREMENTS: Bishops hold the far third. They do not enter a pad.  
SPELL_DISCOVERY_OPPORTUNITIES: Using `WF-TEL-POISE_STEP` at least once and winning can offer `spell-swap` if missing (the pad is the teacher).  
MAP_REQUIREMENTS: Two linked still-foot cyan pads (`WF-TEL-POISE_STEP`). Entering one for 1 MP exits the other **only while remaining MP equals max MP before the spend**. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Far banner `objectiveCell`. Inverse of ENC-PAD-03 (Match Step: remaining AP equals remaining MP). Distinct from Empty Step (remaining AP 0), Spare Step (leftover AP), File Step (on-axis), Skew Step (sharing neither rank nor file).  
SPECIAL_RULES: Player must occupy the banner at least once (`touchedObjective`). Pad dest must be free-or-swap, non-hazard, non-portal, with two walk-offs. Illegal dest = no swap, spend nothing.  
OBJECTIVE: Tag the banner and clear the bishops.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a full-stock pad skip so MP is a third option (wait / walk long / pad while full-stock). Distinct from ENC-PAD-03 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Long path works with both pads illegal. A and B reachable floor, not spawn/portals. Bishops reachable by frost from the banner.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: Add a third bishop or poison, not a second pad pair. Peak: B sits adjacent to a stock-seam tile.  
STATUS: PROPOSED

---

### ENC-RARE-21

ENCOUNTER_ID: ENC-RARE-21  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-SESTET-HOLD` COURT (Sestet Hold + Must Sestet + warden) **or**, if the account has not answered ENC-ELITE-40, `FSN-SESTET-CHOIR` lite (mender + verse + ignite). Rare elite tag on the holder only (`variant: rare_elite`). **Do not** spawn `FSN-SESTET-HOLD/TRIDECA` while remaining cap < 13 (live cap is 2).  
AI_REQUIREMENTS: COURT contracts. `escapeRoute` on the rare elite. `instantKill` / `betrayal` off. Lethal lookahead on. **Never PAIR Sestet Hold + Must Sestet as a two-body** — the COURT of three is why both exist.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-sestet-hold`, `spell-must-sestet`, `spell-sestet-mend`, `spell-tern-stride`} not yet owned.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with two files. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-21 by default. Purple portal chrome only after clear. No Inferno on this sheet. Dual Keep **cannot** peel Verse Sestet or lift Sestet Hold.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes Sestet Hold / Choir the primer already taught.  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket. Three-unit occupancy leaves walk-offs.  
REPLAYABILITY: SESTET-HOLD vs SESTET-CHOIR by which PAIR the account answered.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale warden Iron Skin, not HP. Never Trideca.  
STATUS: PROPOSED

---

### ENC-TREAS-21

ENCOUNTER_ID: ENC-TREAS-21  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Three **devices**, not three chests (distinct from ENC-TREAS-20’s match devices):

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-POISE_CACHE` | 1 AP only while remaining MP equals max MP: medium Doka, no guardian. A walked open is illegal and spends nothing. | Medium `applyRewards` |
| `WF-RSK-POISE_OATH` | Flag: next credit uses hard multiplier **only if** remaining MP equals max MP at credit. Spent MP at credit pays nothing extra. | Hard victory purse if you then take a fight while full-stock |
| Fever seal | Turns on live `doka_fever` (enemies +25% HP, Doka ×2) and spawns `FSN-SESTET-STEP` | Depth Doka ×2 (still clamped) + Sestet observation |

AI_REQUIREMENTS: Fever-seal pack uses SESTET-STEP contracts.  
SPELL_DISCOVERY_OPPORTUNITIES: Fever-seal preview is always shown before combat.  
MAP_REQUIREMENTS: Three device tiles + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** cache-only leave after the cache resolves. Inverse of ENC-TREAS-20 (Match Cache / Match Oath). Distinct from Round Cache, Late Cache, Plant Cache, Trip Cache, Patience Cache.  
SPECIAL_RULES: Touching Fever seal locks the coward exit and the other devices. Cache can be used without locking the coward exit. Oath can be used without combat. Losing Fever is a normal death. Jackpot numbers stay inside `applyRewards`. `doka_fever` is the **opt-in sponge**; it is not applied to teach/reinforce rooms.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Fever commit must be won.  
FAILURE_CONDITION: Player death after Fever commit. Coward / cache-miss is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **three different full-stock prices** (coin, credit-while-full-stock, HP-sponge-for-Doka). Distinct from ENC-TREAS-20’s matched remaining-pool devices.  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. After Fever commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Device positions rotate. Fever pack SESTET-STEP vs TERN-OCTA.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack Fever with `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REST-21

ENCOUNTER_ID: ENC-REST-21  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional oath / fever shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-22 / ENC-ELITE-40 observed Sestet Mend / Tern Stride, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-POISE_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-21. Optional `WF-RSK-POISE_OATH` tile (flag next room only). Optional `WF-PRT-POISE_GATE` (rest / overworld only — extra exit after a full-stock end-turn; never the only portal; forbidden in dungeon / boss rush / Death Realm). Optional `WF-EVT-POISE_HOUR` chrome if this rest is reached from overworld (run maps still require a clear).  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Oath does not start combat. `uiLayout` unchanged. After one full Table R clear, shrine can enable day-21 `rushVariant` flags (`sip_gaze`, `halve_veil`, `odd_cinder`, `sill_goad`).  
OBJECTIVE: Choose an exit. Optional: shrine, oath, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Oath is a modifier flag, not a Doka mint.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Sestet-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Poise Gate always in addition to a reachable stable portal. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Stock on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-OATH-04

ENCOUNTER_ID: ENC-OATH-04  
TYPE: optional challenge / treasure  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None until the player flags the oath **and** takes a fight exit.  
AI_REQUIREMENTS: Next fight uses the destination room’s AI.  
SPELL_DISCOVERY_OPPORTUNITIES: None on the oath tile.  
MAP_REQUIREMENTS: One `WF-RSK-POISE_OATH` inlay on a rest or treasure foyer. Inverse of ENC-OATH-03 (Match Oath: remaining AP equals remaining MP at credit). Distinct from Ready Hour, Spent Oath, Plant Oath, Spare Oath, Pair Oath.  
SPECIAL_RULES: Voluntarily ending a turn on it flags this map. If the next `applyRewards` happens while remaining MP equals max MP, that credit uses the hard multiplier. If any MP was already spent at credit, the flag pays nothing extra. Snapshot at credit. Death still uses `saveBattleStats`.  
OBJECTIVE: Flag or skip.  
FAILURE_CONDITION: None on the oath tile.  
REWARD: Hard multiplier on the next credit if the player is full-stock at enqueue; otherwise nothing extra.  
TACTICAL_PURPOSE: Voluntary cash-out-full-stock wager. Distinct from ENC-OATH-03 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Inlay is floor, not spawn/portal.  
REPLAYABILITY: Inlay north vs east of the rest shrine.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-HOUR-05

ENCOUNTER_ID: ENC-HOUR-05  
TYPE: optional challenge  
RELATIVE_DIFFICULTY: none (wager)  
ENEMY_COMPOSITION: Overlay on another room; no extra bodies.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-POISE_HOUR` may overlay a dungeon as a reward wager (no extra portal). Inverse of ENC-HOUR-04 (Match Hour). Distinct from Ready Hour, Spent Oath, Plant Oath, Vacant Hour, Poise Gate.  
SPECIAL_RULES: If the player ended at least one turn with remaining MP equal to max MP, the next `applyRewards` uses the hard multiplier. Always ending after spending MP leaves rewards unchanged. Optional — never forces a fight.  
OBJECTIVE: End at least one turn full-stock, or ignore.  
FAILURE_CONDITION: None.  
REWARD: Hard multiplier on the next persist-lock `applyRewards` if the hour armed.  
TACTICAL_PURPOSE: End-full-stock-at-least-once event. Distinct from ENC-HOUR-04 (matched remaining pools).  
SOLVABILITY_REQUIREMENTS: Overlay never adds a portal. Death Realm rolls stay empty.  
REPLAYABILITY: On/off per rest shrine.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-BRANCH-21

ENCOUNTER_ID: ENC-BRANCH-21  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: sestet | tern | mire | stock` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: sestet → ENC-SESTET-01 or ENC-SPELL-41, tern → ENC-TERN-01 or ENC-SPELL-42, mire → ENC-MIRE-01 or ENC-GATE-08, stock → ENC-SILL-02 or ENC-SNAP-05. A sealed fifth door to ENC-RARE-21 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: sestet | tern | mire | stock` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-21 / ENC-BOSS-21). Day-20 `ENC-BRANCH-20` stays stave/ring/rime/match. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Stave / Ring / Rime / Match.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Stock File door (ENC-STOCK-01) can replace Tern for accounts that already finished Tern this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Stock Picket (ENC-AMBUSH-21) so lingering full-stock to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-HOLD-10

ENCOUNTER_ID: ENC-HOLD-10  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SESTET-HOLD` lite — 1× `sestet_holder` knight (`spell-sestet-hold` + `physical_attack`) + 1× warden rook (`starter-shield` + Strike). Must Sestet **off** this PAIR (that is the COURT).  
AI_REQUIREMENTS: Holder skip if leftover sum ≠ 6 or tied. Warden interposes. Soph 2–3. **Never PAIR Sestet Hold + Must Sestet.**  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Hold can drop that id if missing.  
MAP_REQUIREMENTS: Wide choke + side aisle. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Sestet Hold refuses walk MP until leftover sum === 6 unequal; spells stay legal. Dual Keep cannot lift. Band 0 → show `FSN-STAVE-HOLD`. Honesty reroll → ENC-HOLD-09.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2, dump to leftover-sum 5, or Strike (spells stay legal).  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walk lock keyed on leftover-sum-6-unequal. Distinct from ENC-HOLD-09 (leftover-**sum === 5**).  
SOLVABILITY_REQUIREMENTS: Side aisle exists. Two-unit occupancy leaves an exit. Strike remains a complete answer.  
REPLAYABILITY: Holder chassis knight vs pawn. COURT three-body is ENC-RARE-21, not this PAIR.  
SCALING_BEHAVIOUR: Peak: convert to ENC-RARE-21. Never Must Sestet on PAIR.  
STATUS: PROPOSED

---

### ENC-QUIET-05

ENCOUNTER_ID: ENC-QUIET-05  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SESTET-QUIET` — 1× `sestet_stepper` + 1× `sestet_mender` + 1× cover squire (`starter-shield` + Strike). Variant `FSN-SESTET-QUIET/LEND` replaces cover with `sestet_lender` (`spell-sestet-lend`: +1 AP and +1 MP if leftover sum === 6 unequal — **exits** to sum 8; inequality preserved).  
AI_REQUIREMENTS: BRIGADE contracts. Lender skip if ally leftover sum ≠ 6 or tied. Cover interposes. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Sestet Lend can drop that id if missing. Sestet Lend **cannot** manufacture Poise.  
MAP_REQUIREMENTS: Chapel nave + two stalls. Side aisle required. No lava.  
SPECIAL_RULES: Unlock after ENC-SESTET-01. At most one mender. Honesty: missing leftover-sum-6-unequal join + heal + cover → ENC-SESTET-01 leftover without claiming Quiet.  
OBJECTIVE: Clear all. Intended order: mender, then stepper, then cover.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “silence the sestet” Doka if mender dies first.  
TACTICAL_PURPOSE: Combine taught SESTET-STEP with cover so the question is “who is the sustain.” `/LEND` teaches the manufacture window for later CADRE.  
SOLVABILITY_REQUIREMENTS: Stalls connected; cover cannot seal the nave; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Cover vs Lend by which variant.  
SCALING_BEHAVIOUR: Peak: convert to ENC-RARE-21 only if ENC-HOLD-10 was answered this account. Still one mender.  
STATUS: PROPOSED

---

### ENC-PSALM-01

ENCOUNTER_ID: ENC-PSALM-01  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PSALM-SESTET` — 1× `psalm_turner` queen without heal (`spell-psalm-turn` + `starter-frost`) + 1× `sestet_mender` + 1× `sestet_stinger`.  
AI_REQUIREMENTS: Turner skip if pack size < 2 living same-side non-casters **or** no opposite-side in r3 **or** both leftover pairs already equal; invert **one ally and one hostile**; caster leftover **unchanged**; sum invariant. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Psalm Turn can drop that id if missing. Do **not** grant Hymn Turn, Duel Turn, or Purse Turn.  
MAP_REQUIREMENTS: Nave + two stalls. Side aisle required.  
SPECIAL_RULES: Unlock after ENC-SESTET-01 **or** ENC-SIX-01. **Not** Hymn Turn (two allies) / Duel Turn (two hostiles) / Purse Turn (one hostile). Choir Hymn is a Wave-1 **heal**. Honesty reroll → ENC-HYMN-01 leftover without claiming Psalm.  
OBJECTIVE: Clear all. Intended: kill the Turner before a mixed invert manufactures a Sestet window you did not ask for.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “silence the psalm” Doka if Turner dies first.  
TACTICAL_PURPOSE: Mixed-side leftover invert + leftover-sum-6-unequal heal + leftover-sum-6-unequal sting. Distinct from ENC-HYMN-01 (two-**ally** invert).  
SOLVABILITY_REQUIREMENTS: Stalls connected. 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Turner north vs east. CADRE `FSN-PURSE-SESTET` is ENC-PURSE-02, not this BRIGADE.  
SCALING_BEHAVIOUR: Peak: promote to ENC-PURSE-02 (sip manufactures Stave). Never two Turners.  
STATUS: PROPOSED

---

### ENC-PURSE-02

ENCOUNTER_ID: ENC-PURSE-02  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PURSE-SESTET` — 1× `psalm_turner` + 1× `sestet_sipper` + 1× leftover-sum-5 stinger presentation (`stave_stinger` metadata lock).  
AI_REQUIREMENTS: CADRE contracts. Sipper skip leftover AP = 0. Distinct from ENC-PURSE-01 (queued day-10 leftover AP ≥ 2).  
SPELL_DISCOVERY_OPPORTUNITIES: Observing the Sip after a Psalm invert can drop Sestet Sip if missing.  
MAP_REQUIREMENTS: Nave + stall. Side aisle required.  
SPECIAL_RULES: Unlock after ENC-PSALM-01 **or** ENC-SIX-01. Mixed-side invert then leftover-sum-6-unequal sip **manufactures Stave**, then leftover-sum-5 sting. Honesty: missing mixed invert or leftover-sum sip → ENC-PSALM-01 leftover without claiming Purse Sestet.  
OBJECTIVE: Clear all. Intended: kill Sipper first so the manufacture never fires.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Psalm invert + Sestet Sip manufactures Stave + Stave Sting. Distinct from ENC-PSALM-01 (no sip) and ENC-HYMN-01 (ally-only).  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Sipper west vs east.  
SCALING_BEHAVIOUR: Do not add a fourth body. Never two sips.  
STATUS: PROPOSED

---

### ENC-TIERCE-01

ENCOUNTER_ID: ENC-TIERCE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TIERCE-VERSE` — 1× `cadence_tiercer` bishop (`spell-cadence-tierce` + `starter-frost`) + 1× `verse_sesteter` bishop (`spell-verse-sestet` + `starter-frost`) + 1× glyph taxer. Remaining `n===3` → `0` plus last-id until leftover-sum===6 unequal plus glyph tax.  
AI_REQUIREMENTS: Tiercer skip if no remaining 3. Verse skip if no `lastResolvedSpellId`. **Never PAIR Tern + Tierce.** Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cadence Tierce or Verse Sestet can drop that id if missing. Do **not** grant Cadence Tern, Cap, Dock, Snuff, Rise, or Prime.  
MAP_REQUIREMENTS: Chapel + glyph tile. Side aisle required.  
SPECIAL_RULES: Unlock after ENC-HOLD-10 **or** ENC-GIFT-01. Cadence Tierce **kills** a remaining 3; Tern **writes** remaining >3 to 3 and **leaves** threes. Forced-move does **not** peel Verse Sestet. Dual Keep **cannot** lift. Honesty: missing remaining-3 rewrite or last-id writer → ENC-DOCK-01 leftover without claiming Tierce. Variant `FSN-TIERCE-VERSE/TERN` is **illegal** as a two-body (Tern+Tierce PAIR ban); do not ship it.  
OBJECTIVE: Defeat all. Intended: sit remaining already 0, or recast a different id so Verse never locks Inferno.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + remaining-CD discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Remaining 3→0 + last-id until leftover-sum-6-unequal. Distinct from ENC-DOCK-01 (remaining 2→0 + leftover-sum-5 peel). Prepares ENC-RUSH-80’s Halve (floor-divide, not kill-a-3).  
SOLVABILITY_REQUIREMENTS: Glyph is floor. 3-unit occupancy leaves walk-offs. Strike remains a complete answer.  
REPLAYABILITY: Glyph west vs east.  
SCALING_BEHAVIOUR: Peak: inherit Stock Cast. Never Tern+Tierce.  
STATUS: PROPOSED

---

### ENC-GIFT-01

ENCOUNTER_ID: ENC-GIFT-01  
TYPE: spell-discovery / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GAIT-TERN` — 1× `gait_gifter` queen with heal (`spell-gait-gift` + `starter-shield`) + 1× `cadence_terner` bishop (`spell-cadence-tern` + `starter-frost`) + 1× font presentation. Leftover AP≥2 / MP=0 heal + remaining `n>3` → `3` + font.  
AI_REQUIREMENTS: Gifter skip if leftover AP < 2 **or** leftover MP ≠ 0 or missing HP < 8. Dual Keep 2/0 **opens**. Dual Keep 2/2 is Poise, skip. Dual Keep 1/1 is Prime Gift, skip. Terner skip if no remaining > 3. **Never PAIR Tern + Tierce.** Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gait Gift or Cadence Tern can drop that id if missing. Do **not** grant Sestet Mend, Prime Gift, Equal Gift, or Cadence Tierce.  
MAP_REQUIREMENTS: Open court + one font tile (not `WF-ZON-POISE_FONT` unless inherited from ENC-PROT-21 on a **gallery**).  
SPECIAL_RULES: Family lottery **off**. Gait Gift is leftover **AP ≥ 2 AND leftover MP = 0** on **one** body. Dual Keep 2/0 **can** open this. Honesty: missing leftover-AP≥2/MP=0 heal or remaining `n>3→3` → ENC-PRIME-02 leftover without claiming Gait Gift / Tern.  
OBJECTIVE: Defeat all. Intended: sit leftover MP ≥ 1 so Gift fizzles, or sit remaining already ≤ 3 so Tern fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: One-body leftover-AP≥2/MP=0 heal + remaining n>3→3. Distinct from ENC-SESTET-01 (both-bodies leftover-sum-6-unequal) and ENC-PRIME-02 (leftover exactly 1/1 + remaining n>2→2).  
SOLVABILITY_REQUIREMENTS: Font is floor, not a portal. 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Gifter north vs east.  
SCALING_BEHAVIOUR: High: inherit Stock Font on a **gallery**. Never Tern+Tierce.  
STATUS: PROPOSED

---

### ENC-BRICK-02

ENCOUNTER_ID: ENC-BRICK-02  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-ODD-BRICK` — 1× `odd_toller` bishop (`spell-odd-toll` + `starter-frost`) + 1× `brick_taxer` rook (`spell-brick-tax` + Strike) + 1× turret presentation (`stone_castellan` metadata lock). Leftover-AP-odd walk tax + barrier-adjacent walk tax + turret.  
AI_REQUIREMENTS: Toller skip if leftover AP is even. Taxer skip if no adjacent barrier. Relocate / Swap do not pay Odd Toll. Soph 2–3. Never Toll+Scribe PAIR. Never Tax+Hold PAIR.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Odd Toll or Brick Tax can drop that id if missing. Do **not** grant Brick Hold, Gait Toll, or Brick Brace.  
MAP_REQUIREMENTS: One destructible barrier tile on a **gallery**, never the only path. Side aisle required. Extra room `odd_nave` is **not** this family.  
SPECIAL_RULES: Family lottery **off**. Odd Toll: next **walk** +1 AP if leftover **AP is odd**. Brick Tax: next **walk** +1 AP while adjacent to a **barrier**; destroy the barrier and the tax drops; lock **stays** until duration. Distinct from ENC-BRICK-01 (queued day-20 Gait Toll leftover-MP=0 next-walk + Brick **Hold**). Honesty reroll → ENC-BRICK-01 leftover without claiming Odd Toll / Brick Tax.  
OBJECTIVE: Defeat all. Intended: keep leftover AP even, destroy the barrier, or Attack Nearest so the walk tax never fires.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-AP-odd walk tax + barrier-adjacent walk tax. Distinct from ENC-BRICK-01 (leftover-MP=0 walk tax + barrier-adjacent **walk lock**).  
SOLVABILITY_REQUIREMENTS: Barrier is not a cut-vertex. 3-unit occupancy leaves walk-offs. Strike remains a complete answer.  
REPLAYABILITY: Barrier west vs east.  
SCALING_BEHAVIOUR: Peak: inherit Stock Pane. Never Tax+Hold PAIR.  
STATUS: PROPOSED

---

### ENC-KENNEL-02

ENCOUNTER_ID: ENC-KENNEL-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SESTET-HOLD/KENNEL` variant — 1× `summon_orther` king (`spell-summon-orth` + `starter-frost`) + 1× `lava_cutter` pawn (`spell-lava-cut` + `physical_attack`) + one allied summon already planted (counts toward cap 2). Never Orth+Plate PAIR.  
AI_REQUIREMENTS: Orther skip if no allied summon; pets pay +1 AP to **walk diagonal**; orthogonal walks are free. Cutter skip rider if target is Chebyshev > 2 from every lava occupancy cell. Drop if `summonAI` empty. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Summon Orth or Lava Cut can drop that id if missing. Twin Gate pads do **not** count as lava.  
MAP_REQUIREMENTS: One lava gallery of 3 tiles. Exit reachable without crossing the kennel. Living hostiles + pets ≤ cap.  
SPECIAL_RULES: Family lottery **off**. Hold while remaining cap < 1 for the planted pet. Honesty: missing pet-walk-diagonal tax → ENC-KENNEL-01 leftover without claiming Lava Kennel. Never Orth+Plate PAIR. Never two pets (cap 2 with the planted one). Distinct from ENC-KENNEL-01 (Summon **File** + **Rime** Cut).  
OBJECTIVE: Defeat the handler pack. Intended: keep the pet orthogonal so the tax never fires, or stand Chebyshev > 2 from lava so Cut misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Pet diagonal-tax + lava-threshold poke. Distinct from ENC-KENNEL-01 (file-tax + ice-threshold).  
SOLVABILITY_REQUIREMENTS: Pet plant is free floor. Cap living enemy summons ≤ 2. Lava gallery is not a cut-vertex. Counts toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Lava west vs east.  
SCALING_BEHAVIOUR: Peak: inherit Stock Pane. Never a second pet.  
STATUS: PROPOSED

---

### ENC-MINI-22

ENCOUNTER_ID: ENC-MINI-22  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (sestet / leftover-sum-6-unequal adjacent). Branch sestet: `starved_vampire_pawn`. Branch tern: `bone_cavalier`. Branch mire: `crimson_countess`. Branch stock: `midnight_bishop`. Do **not** use `sip_visitor` / `halve_registrar` / `odd_penitentiary` / `sill_suffragan`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table S directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (stock-seam / stock-pane / one mire gallery / leftover-sestet aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Sestet Hood consume / one extra Sestet Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-21

ENCOUNTER_ID: ENC-BOSS-21  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Sestet → `starved_vampire_pawn`; Tern → `bone_cavalier`; Mire → `crimson_countess`; Stock → `midnight_bishop`. If the chain taught Stock Picket (ENC-AMBUSH-21) **and** Tern was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table S ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-22) or stock-file (ENC-STOCK-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Sestet may inherit 2 stock-seam tiles off the only path; Tern may inherit room for Chebyshev-3 orthogonal steps plus a Chebyshev-8 aisle; Mire may inherit one mire gallery (not a sealed pocket); Stock may inherit stock pane on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / charge-on-tern / lava-blood / curse-reflect).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-21

ENCOUNTER_ID: ENC-MAST-21  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on stock-seam (`WF-HAZ-POISE_SEAM`). Wave 2: `FSN-SESTET-STEP` **or** `FSN-SESTET-SIP` **or** `FSN-TERN-OCTA` **or** `FSN-MIRE-DIAG` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Warder elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 PAIR AI. Wave 3 elite soph 2–3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already granted the primer ids.  
MAP_REQUIREMENTS: Choke between wave 1 and wave 2. Branch device on a **gallery**: sestet → leftover Dual Keep 2/2 aisle (closes Sestet); tern → Chebyshev-3 orthogonal plus Chebyshev-8; mire → mire gallery off the only path; stock → Stock Sill on the short path. `holdPortalLocked` until wave 3 is clear.  
SPECIAL_RULES: Portal locked. Soft-fail skip if a wave cannot place. Honesty: missing the branch writer → ENC-MAST-20 leftover without claiming Sestet / Tern / Mire / Stock.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band victory XP + depth Doka. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Exam that stacks teach → reinforce → the named drop-20 PAIR.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4. Branch device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Peak: inherit Stock Draft. Never a fourth wave.  
STATUS: PROPOSED

---

### ENC-RUSH-79

ENCOUNTER_ID: ENC-RUSH-79  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room S0 remix: `sip_visitor` + `gaze_beadle` as Table S `S0`. Combined mechanic remains: walk to reface, or keep facing and eat the pin. Crosier dest **never** occupies the Lavabo. Sip is walk-gated current-MP steal, not leftover-MP bank. Forced-move does not arm. Not Stride Censor / March / Sole / Wick / Infirm / Stride Chancellor / Must / Damp / Wedge / Queen.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SLIDE-02 / ENC-CAPPED-01, a **painted stock pip** (visual only) shows leftover-MP===max vs walk-gated current-MP steal — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Gait Sip, Capped Sting, or Facing Pin.  
MAP_REQUIREMENTS: Preferred cells. Crosier never on Lavabo.  
SPECIAL_RULES: `rushVariant: sip_gaze`. Unlock after one complete Table R clear.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table S room 0 table + tiny bonus if the first Sip was refused by standing (skill).  
TACTICAL_PURPOSE: Add the walk-MP exam the Stock / Capped primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Crosier never on Lavabo. Novice death ≠ victory.  
REPLAYABILITY: Lavabo N vs S of Crosier.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten sip cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-80

ENCOUNTER_ID: ENC-RUSH-80  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room S1 remix: `halve_registrar` + `veil_verger` as Table S `S1`. Combined mechanic remains: recast the lock he just halved, or the primary rejects. Cowl dest **never** occupies the Diurnal. Halve is remaining `floor(n/2)`, not steal. Aim Veil rejects the **recast**, not remaining CD. Empty remaining fizzles. Not Trim / Imprint / Dilate / Flush / Bait / Cover / Goad.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-TIERCE-01 / ENC-GIFT-01, a **painted remaining pip** (visual only) shows Tern / Tierce vs Halve — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Cadence Halve, Cadence Tern, or Cadence Tierce.  
MAP_REQUIREMENTS: Preferred cells. Cowl never on Diurnal.  
SPECIAL_RULES: `rushVariant: halve_veil`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table S room 1 table + tiny bonus if the first recast Halve was refused by sitting remaining already 0 (skill).  
TACTICAL_PURPOSE: Add the remaining-CD exam the Tierce / Tern primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Cowl never on Diurnal. Novice death ≠ victory.  
REPLAYABILITY: Diurnal N vs S of Cowl.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten halve cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-81

ENCOUNTER_ID: ENC-RUSH-81  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room S2 remix: `odd_penitentiary` + `cinder_lance` as Table S `S2`. Combined mechanic remains: charge the glowing window from **even** range. Lance glow **never** occupies the Amice. Odd Hood blanks Chebyshev 1 / 3 / 5; even (2, 4) lance hits. Wrong-element is still −50%, not immune. Not Near / Hood Recluse / Rebound / Cover / Far / Hex.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-TERN-01, a **painted tern pip** (visual only) shows Chebyshev-3 orthogonal vs Odd Hood 1 / 3 / 5 — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Odd Hood, Tern Stride, or Cinder Lance.  
MAP_REQUIREMENTS: Preferred cells. Lance glow never on Amice.  
SPECIAL_RULES: `rushVariant: odd_cinder`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table S room 2 table + tiny bonus if the first Odd miss was refused by stepping to Chebyshev 2 or 4 (skill).  
TACTICAL_PURPOSE: Add the odd-range exam the Tern primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Lance glow never on Amice. Strike from even Chebyshev remains a legal answer.  
REPLAYABILITY: Amice N vs S of lance glow.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten lance cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-82

ENCOUNTER_ID: ENC-RUSH-82  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room S3 remix: `sill_suffragan` + `goad_pretender` as Table S `S3`. Combined mechanic remains: get goaded onto the sill, then Strike — spells fizzle. Crown dest **never** occupies the Jamb. Taunt does **not** force a spell (player may Strike). Cast Sill forbids non-physical; Strike stays legal. Not Quiet / Oath / Peel / Enter / Bait / Dummy.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SILL-02 / ENC-HOLD-10, a **painted sill pip** (visual only) shows Stock Sill / Sestet Hold vs Cast Sill — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Cast Sill, Sestet Hold, or Goad.  
MAP_REQUIREMENTS: Preferred cells. Crown never on Jamb.  
SPECIAL_RULES: `rushVariant: sill_goad`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table S room 3 table + tiny bonus if the first Goad was answered with Strike (skill).  
TACTICAL_PURPOSE: Add the Strike-on-sill exam the Stock Sill / Hold primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Crown never on Jamb. Strike remains a legal answer.  
REPLAYABILITY: Jamb N vs S of Crown.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten goad cadence, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain V — “Sestet Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-21 then ENC-SPELL-41 (or ENC-SPELL-42 if Sestet Mend already owned) |
| 2 | Reinforce | ENC-WAVE-22 |
| 3 | Combine | ENC-HAZ-42 then ENC-SESTET-01 **or** ENC-TERN-01 |
| 3 insert | Choice | ENC-BRANCH-21 → sestet/tern/mire/stock destinations |
| 4 | Pressure | ENC-SURV-39 **or** ENC-PROT-21 **or** ENC-STOCK-01 **or** skip via ENC-REST-21 |
| 4 | Mastery | ENC-MAST-21 (branch skin) |
| 5 | Boss | ENC-BOSS-21 |

Rare: 8% on depth 4 to **insert** ENC-RARE-21 before mastery.  
Treasure: rest may offer ENC-TREAS-21 instead of PROT-21.  
Decoy side-story: replace combine with ENC-PRIO-23 and mini-boss ENC-MINI-22; capstone may become `midnight_bishop` if Stock was not the door.

### Chain W — “Stock Sill Primer” (maxDepth 4)

ENC-PLATE-02 → ENC-SILL-02 → ENC-PAD-04 → ENC-REST-21 → ENC-BOSS-21 (`midnight_bishop` only if Stock was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-PLATE-02 as teach on accounts that already know match-seam / match-sill.

### Rush injection (day-21)

After one full Table R clear, ENC-REST-21 shrine can enable: room S0 → ENC-RUSH-79, room S1 → ENC-RUSH-80, room S2 → ENC-RUSH-81, room S3 → ENC-RUSH-82. Day-20 flags for R0–R3 and earlier table flags remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-21, ENC-SPELL-41, ENC-SPELL-42 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-41, ENC-SLIDE-02, ENC-PAD-04, ENC-PLATE-02 | `under_50_damage` |
| ENC-HAZ-42, ENC-WAVE-22 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-21, ENC-MAST-21, ENC-PANE-02, ENC-MIRE-01, ENC-KENNEL-02 | `direct_hit` |
| ENC-SESTET-01, ENC-SIX-01, ENC-ELITE-40, ENC-ELITE-41, ENC-TERN-01, ENC-SNAP-05, ENC-STOCK-01, ENC-HOLD-10 | `under_8_ap_per_turn` |
| ENC-SURV-39 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-21 / ENC-REST-21 bank / ENC-OATH-04 / ENC-HOUR-05 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `poise_seam` or 1 poise cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | stock-seam **or** stock plate | kill + optional glyph |
| MID | named drop-20 `FSN-*` or waves | backline guard | zone 1 + Sestet Mend / Tern Stride | one `WF-*` | clock / tags / gate |
| HIGH | elite or stock file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / mire / leftover-sum-6-unequal miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush S0–S3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit stock-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Stock Oath / Stock Hour / Stock Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-20 fields plus:

```
encounterId
encounterType        // + sestet_step | sestet_sip | tern_octa | mire_diag |
                     //   sestet_gate | spawn_prime | slide_cap | watch_thin |
                     //   sestet_choir | gait_tern | sestet_quiet | psalm_sestet |
                     //   tierce_verse | odd_brick | purse_sestet | sestet_hold |
                     //   stock_seam | stock_cinder | stock_plate | stock_pane |
                     //   stock_sill | stock_font | stock_step | stock_file |
                     //   stock_picket | stock_cache | stock_tutor | stock_oath |
                     //   stock_cast | stock_hour | stock_draft
formationId?         // FSN-SESTET-STEP | FSN-SESTET-SIP | FSN-TERN-OCTA |
                     // FSN-MIRE-DIAG | FSN-SESTET-GATE | FSN-SPAWN-PRIME |
                     // FSN-SLIDE-CAP | FSN-WATCH-THIN | FSN-SESTET-CHOIR |
                     // FSN-GAIT-TERN | FSN-SESTET-QUIET | FSN-PSALM-SESTET |
                     // FSN-TIERCE-VERSE | FSN-ODD-BRICK | FSN-PURSE-SESTET |
                     // FSN-SESTET-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // sestet | tern | mire | stock
stockSeamCells? / stockCinderCell? / stockPlateCell?
stockPaneCell? / stockSillCell? / stockFontCell?
stockStepPads? / stockCastArmed? / stockPicketArmed?
stockDraftArmed? / stockHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_stock_font | open_stock | drink_stock |
                     //   tag_stock | choose_device | stock_file | stock_pane
failureKind
deviceTable[]        // ENC-TREAS-21
rushVariant?         // sip_gaze | halve_veil | odd_cinder | sill_goad
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Stock Picket” logic — use `formationId` / `stockPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-28 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a dungeon scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-20 families (Septet / Quarte / Tetradeca, …) or Wave-21 spell unique CORE — those wait on same-day / later catalogs. This catalog consumes drop-20 **formations** that can stand on Wave-19 kits.
- Faking Sestet Mend without leftover-sum===6 unequal on both bodies, Sestet Sting as Stave/Tied, Tern Stride as Ring / Knight, Mire Reel as Rime Reel, Sestet Post walk-on as a detonate, Slide Skip as a required player hop, Prime Plate as a leftover-0 miss, Watch Tax as Watch Drain or Watch Sip, Gait Gift as Sestet / Prime / Equal, Psalm Turn as Hymn Turn, Sestet Hold as Stave Hold, Stock Pane as Match Pane, Stock Sill as Match Sill, Stock Step as Match Step, Stock Font as Match Font, Stock Picket as Match Picket, Stock Tutor as Match Tutor, Stock Draft as Match Draft, Stock File as Match File, Poise Gate in a dungeon, Trideca Plug while cap is 2.
- Packing Cadence Tern with Cadence Tierce. Packing Tern Stride with Octa Oath as a two-gun without the peeler. Packing Sestet Hold with Must Sestet as a two-body. Packing Sestet Mend with Stave / Score / Tally / Poise / Gaunt / Prime / Gait Gift menders. Packing Mark + Goad as a two-body. Packing Plate + Thin as a two-body. Packing Tax + Gun as a two-body. Packing Diag Bite + Diag Ward. Packing Post + Sting without the Sill peeler.
- Honesty-rerolling a Stock room into `ENC-POISE-01` (queued day-17 leftover AP === MP ≥ 1). Stock is remaining **MP === max MP**.
- Consuming same-day 2026-10-29 Wave 21 family / spell / world catalogs.

---

## 10. Pick order (day-21, after days 1–20 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–20 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-21 + ENC-SPELL-41 (stock-seam / sestet-mend verbs)  
2. ENC-WAVE-22 (`formationId` SESTET-STEP → SESTET-SIP)  
3. ENC-SESTET-01 or ENC-SIX-01 or ENC-TERN-01 (new pressure objects)  
4. ENC-BRANCH-21 (`branch: sestet|tern|mire|stock` snapshot-before-cleanup)  
5. ENC-BOSS-21 branch read  
6. Rush Table S variants 79–82 one room at a time (after the account has one full Table R clear)

Uniqueness: this file is the **twenty-first** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
