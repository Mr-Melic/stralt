# Encounter Evolution Catalog — 2026-10-27

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-27-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957), `ENCOUNTER_EVOLUTION_2026-10-24.md` (`EED-2026-10-24-001`, PR #1006), `ENCOUNTER_EVOLUTION_2026-10-25.md` (`EED-2026-10-25-001`, PR #1056), `ENCOUNTER_EVOLUTION_2026-10-26.md` (`EED-2026-10-26-001`, PR #1121). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-18 Wave 17 packs `docs/design/ENEMY_FORMATIONS_2026-10-26.md` (PR #1134), Wave 18 world features in `docs/WORLD_DYNAMICS.md` (PR #1114, `WDD-2026-10-26-001`), Rush Table Q `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.16 (PR #1139). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-27) Wave 19 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 18 **families** (Stave / Dock / Dodeca / Hymn and the rest of PR #1138) wait for a later formation drop (drop 19). Wave 19 **bosses** stay Rush-only (Table Q). Wave 17 **families** (`score_mender`, `score_stinger`, `score_stepper`, `score_sipper`, `score_siller`, `score_holder`, `score_lender`, `score_prelate`, `score_bouncer`, `score_hooder`, `must_scorer`, `verse_scorer`, `file_warder`, `hexa_oather`, `lava_reeler`, `file_biter`, `strike_marker`, `dry_plater`, `shock_skipper`, `even_stinger`, `lean_gifter`, `cadence_riser`, `cadence_snuffer`, `still_toller`, `brick_bracer`, `watch_rooter`, `odd_gaiter`, `spike_cutter`, `duel_turner`, `hendeca_prelate`, … — PR #1073) are legal **metadata locks** on drop-18 sheets, not a 30% lottery.

---

## 1. Why a nineteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–18 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, Dry/Lean/Odd, Gaunt/Even/Brick/Orth, Poise/Knight/Pit/Spent, and Tally/Rank/Spike/Odd. Day-18 rooms spent leftover drop-17 packs (`FSN-TALLY-STEP`, `FSN-TALLY-SIP`, `FSN-RANK-PENTA`, …) and Wave 17 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-18 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-18 Wave 17 packs | Day-18 taught leftover **AP + MP === 3** / leftover-AP-odd miss / same-**rank** walk as **rooms**. Still PDFs: `FSN-SCORE-STEP`, `FSN-SCORE-SIP`, `FSN-FILE-HEXA`, `FSN-LAVA-FILE`, `FSN-SCORE-GATE`, `FSN-STRIKE-DRY`, `FSN-SHOCK-EVEN`, `FSN-WATCH-ODD`, `FSN-SCORE-CHOIR`, `FSN-LEAN-RISE`, `FSN-SCORE-QUIET`, `FSN-DUEL-SCORE`, `FSN-SNUFF-VERSE`, `FSN-STILL-BRACE`, `FSN-PURSE-SCORE`, `FSN-SCORE-HOLD` |
| World-feature Wave 18 | Day-18 **rooms** never spent `WF-HAZ-PAIR_SEAM`, `WF-HAZ-BUSY_CINDER`, `WF-TRP-SKEW_PLATE`, `WF-TER-BRACE_COLUMN`, `WF-OBS-READY_SILL`, `WF-ZON-PAIR_FONT`, `WF-TEL-SKEW_STEP`, `WF-INV-READY_FILE`, `WF-ELT-READY_PICKET`, `WF-TRS-ROUND_CACHE`, `WF-SPL-READY_TUTOR`, `WF-RSK-PAIR_OATH`, `WF-MOD-ONCE_CAST`, `WF-EVT-READY_HOUR`, `WF-ENV-PAIR_DRAFT` |
| Rush Table Q | `Q0`–`Q3` (`stride_chancellor`+`lock_marshal`, `dual_treasurer`+`levy_rector`, `imprint_archdeacon`+`mute_notary`, `damp_provost`+`hexed_marker`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `pairSeamCells` / `busyCinderCell` / `skewPlateCell` / `braceColumnCell` / `readySillCell` / `pairFontCell` / `skewStepPads` / `onceCastArmed` / `readyPicketArmed` / `pairDraftArmed` / `readyHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post / Poise Post / Tally Post / Score Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8**. Nine Plug (`nine_prelate`, `FSN-POISE-HOLD/NINE`) counts as **9**. Dec Plug (`dec_prelate`, `FSN-TALLY-HOLD/DEC`) counts as **10**. Hendeca Plug (`hendeca_prelate`, `FSN-SCORE-HOLD/HENDECA`) counts as **11** — wait for remaining cap ≥ 11 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Score / Lean Gift / Equal Gift / Shove Gift / Tally / Poise / Hollow Gift / Drift Gift / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Score Mend / Lean Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Tally Mend as Score Mend (Tally is leftover **sum === 3**; Score is leftover **sum === 4 AND unequal**). Do **not** clone Poise Mend as Score Mend (Poise is **both leftover AP === MP ≥ 1**). Do **not** clone Gaunt Mend as Score Mend (Gaunt is **both leftover 0**). Do **not** clone Equal Gift as Lean Gift (Equal Gift is **target-only** tied ≥ 1; Lean Gift is leftover **AP = 0 and MP ≥ 1**). Do **not** clone Purse Turn as Duel Turn (Purse Turn is **one** hostile invert; Duel Turn is **two** hostiles). Do **not** clone Watch Root as Watch Bank or Watch Sip (Root **zeros leftover MP**; Bank **grants a leftover-AP bank**; Sip **steals leftover AP**). Do **not** clone File Bite as Axis Bite or Screen Bite (File Bite is **file-only**; Axis Bite is rank **or** file; Screen Bite is Bresenham **blocked**).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-READY_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow / Stride / Near). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-READY_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-19 ids (`stride_chancellor`, `dual_treasurer`, `imprint_archdeacon`, `damp_provost`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / Gaunt Step / Poise Step / Tally Step / **Score Step** / Brick Step **does not** count as leftover walk-MP for Score Mend, Score Sting, Score Sip, Score Sill, Score Post, Must Score, Verse Score, Score Hold, Odd Gait, Even Sting, or Lean Gift. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Score Step dests are occupancy, **not** `isSwap`. Brick Brace **does not move** the barrier.
- Score Mend pays 8 only if **caster and target** leftover AP + leftover MP **=== 4 AND unequal** after the 3 AP is paid. One broken sum **or** a tie on one body is 0 HP. Dual Keep leftover **opens** Score on (3,1) / (1,3) / (4,0) / (0,4) and **closes** Score on 2/2 (Poise) and leftover-sum 3 (Tally) and 0/0 (Gaunt). `0 = 0` is Gaunt’s window, not this primer. `2 = 2` is Poise’s window, not this primer. `3 = 0` is Tally’s window, not this primer. Score Step relocates onto a free Chebyshev-1 of an ally whose leftover AP + leftover MP === 4 AND unequal — not Tally / Poise / Gaunt / Parched / Home / Heave / Ally Step. Score Sting is 10, +8 iff leftover AP + leftover MP === 4 AND unequal. Score Sip steals 1 leftover AP iff leftover sum === 4 AND unequal **and leftover AP ≥ 1** ((0,4) fizzles; (3,1)→(2,1) **manufactures Tally**). File Stride makes the **next** walk dest share the **file** (`dest.x == x_at_arm`). Hexa Oath wants the next spell at Chebyshev **exactly 6**; Strike stays legal. Lava Reel is the **tenth** `applyAttract` dest (file / ally / foe / paint / hazard / void / barrier / pit / spike / then **lava occupancy**). Dest is **toward**, not onto, a world portal. File Bite bonuses a target who shares the caster’s **file only** (rank match without file is 0). Strike Mark detonates on **Strike originating on the painted cell**; walk-on / spell-from / teleport / Swap / Score Step are free. Score Post detonates on end-turn occupy **and leftover AP + leftover MP === 4 AND unequal**; walk-on is safe; dump a pool is safe; Dual Keep 2/2 is safe; leftover-sum 3 is safe. Score Sill taxes start-turn occupy **and leftover sum === 4 AND unequal**; paint stays. Shock Skip is next **1-tile** walk treating **shock enter-tax** as floor; lava / spikes / pits / rime / glyph / cinder / mire still tick. Dry Plate zeros the next hit **while leftover MP is 0**; leftover MP ≥ 1 at impact **lands** and charge **stays**. Watch Root: overwatch snap **zeros leftover MP** on the walker (inverse of Watch Bank’s leftover-AP bank and Watch Sip’s leftover-AP steal). Even Sting is leftover **AP even and ≥ 2** (0 is even and **excluded**). Odd Gait is leftover **MP odd**. Lean Gift heals iff leftover **AP = 0 and leftover MP ≥ 1**. Duel Turn inverts leftover AP↔MP on **two hostiles independently**. Verse Score makes the last id illegal until leftover sum === 4 AND unequal (`0 = 0` does not peel; `2 = 2` does not; `3 = 0` does not; shove does not). Must Score makes remaining **non-Strike** spells illegal unless leftover sum === 4 AND unequal **and** last AP. Score Hold refuses walk MP until leftover sum === 4 AND unequal; spells stay legal. Cadence Rise writes remaining `n===1` → `2`. Cadence Snuff writes remaining `n===1` → `0`. Still Toll is leftover-MP=0 next-**spell** +1 AP. Brick Brace zeros the next hit if a **barrier is adjacent**; destroying the barrier lands the hit and charge **stays**.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 17 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-SCORE-01 / ENC-SPELL-37 / ENC-ELITE-36 (mend skin) | leftover AP + leftover MP **=== 4 AND unequal** on **both** bodies **or** occupancy dest for Score Step | Convert to ENC-TALLY-01 (queued day-18) without claiming Score Mend |
| ENC-UNEQ-01 / ENC-ELITE-36 (sting skin) | leftover-sum===4 unequal poke **or** leftover-sum leftover-AP steal ((0,4) fizzles; (3,1)→(2,1) manufactures Tally) | Convert to ENC-SUM-01 (queued day-18) without claiming Score / Unequal |
| ENC-FILE-02 / ENC-SPELL-38 | next-walk dest shares file **or** next-spell exact Chebyshev 6 | Convert to ENC-RANK-01 or ENC-KNIGHT-01 (queued day-17/18) without claiming File / Hexa |
| ENC-LAVA-01 | tenth `applyAttract` dest (lava occupancy) **or** share-file-only bite | Convert to ENC-SPIKE-02 (queued day-18) without claiming Lava Reel |
| ENC-GATE-06 | leftover-sum===4 unequal occupy detonate **and** walk-on 0 **or** `summonAI === "scorepost"` | Convert to ENC-GATE-05 (queued day-18) without claiming Score Gate |
| ENC-STRIKE-01 | Strike-from-cell consume **or** leftover-MP=0 miss | Convert to ENC-PEEK-01 (queued day-18) without claiming Strike Mark / Dry Plate |
| ENC-SHOCK-01 | 1-tile shock-tax-as-floor **or** leftover-AP even ≥ 2 poke (0 excluded) | Convert to ENC-MIRE-01 (queued day-18) without claiming Shock Skip |
| ENC-SNAP-03 | overwatch snap **zeros leftover MP** | Convert to ENC-SNAP-02 (queued day-18) without claiming Watch Root |
| ENC-LEAN-02 | leftover AP=0 and leftover MP ≥ 1 heal **or** remaining `1→2` | Convert to ENC-EQUAL-01 or ENC-PRIME-01 leftover without claiming Lean Gift / Rise |
| ENC-DUEL-02 | two-hostile leftover AP↔MP invert **or** Dual Keep leftover as leftover | Convert to ENC-TURN-01 leftover without claiming Duel Turn |
| ENC-HOLD-08 / ENC-RARE-19 | walk refuse until leftover sum === 4 AND unequal **or** tools-until leftover-sum===4 unequal **and** last AP | Convert to ENC-HOLD-07 (queued day-18) without claiming Score Hold |
| ENC-SNUFF-01 / ENC-LEAN-02 (rise skin) | remaining `n===1` → `0` **or** remaining `n===1` → `2` | Convert to ENC-PRIME-01 (queued day-18) without claiming Snuff / Rise |
| ENC-QUIET-03 | leftover-sum-4-unequal join + leftover-sum-4-unequal heal + cover | Convert to ENC-SCORE-01 leftover without claiming Quiet |
| ENC-COLUMN-01 | walk-block LoS-block column that braces 1 AP / smashes 2 AP if unbraced | Convert to ENC-SLIT-01 (queued day-18) without claiming Brace Column |
| ENC-SKEW-01 | occupancy-walk onto plate is free from a cardinal; first **diagonal** enter taxes | Convert to ENC-HEFT-01 (queued day-18) without claiming Skew |
| ENC-READY-01 | wall→floor after player end-turn with remaining AP equal to max AP | Convert to ENC-HALE-01 (queued day-18) without claiming Ready |
| ENC-PAD-02 | pad swap only if traveler shares **neither** row nor column with a living hostile | Convert to ENC-PAD-01 (queued day-18) without claiming Skew Step |
| ENC-PROT-19 | Pair Font heal only if another living unit is Chebyshev ≤ 1 | Convert to ENC-PROT-18 (queued day-18, Plant) without claiming Pair |
| ENC-PRIO-21 | one-cast if the player ends a turn with remaining AP equal to max AP while they live | Convert to ENC-PRIO-20 (queued day-18) without claiming Ready Tutor |
| ENC-AMBUSH-19 | elite appears only while remaining AP equals max AP | Convert to ENC-AMBUSH-18 (queued day-18, planted-MP) without claiming Ready |
| ENC-SURV-37 | end-of-turn tax if another living unit is Chebyshev ≤ 1 | Convert to ENC-SURV-35 (queued day-18) without claiming Pair Draft |
| ENC-READY-02 | first elite cannot spend AP until second dies **or** player ends with remaining AP = max AP | Convert to ENC-MUTE-02 (queued day-18) without claiming Ready File |
| ENC-TEACH-19 / ENC-HAZ-38 | pair (Chebyshev ≤ 1) seam tax **or** at-most-one SpellConfig lock | Convert to ENC-TEACH-18 / ENC-HAZ-36 (queued day-18) without claiming Pair / Once Cast |
| ENC-HAZ-37 | orb hunts the unit that spent the **most AP** last round | Convert to ENC-HAZ-35 (queued day-18) without claiming Busy Cinder |
| ENC-RUSH-71…74 | Table Q bosses + Compass/Bourse/Platen/Sump objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Score / File / Lava / Ready primer + inserts)

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

| Beat | Depth hint | Job | Day-19 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (pair-seam hop, leftover-sum-4-unequal heal, busy cinder) | ENC-TEACH-19, ENC-SPELL-37, ENC-HAZ-37 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-20, ENC-AMBUSH-19, ENC-SPELL-38 |
| Combine | 2–3 | Two taught verbs | ENC-SCORE-01, ENC-UNEQ-01, ENC-FILE-02, ENC-HAZ-38, ENC-COLUMN-01, ENC-GATE-06 |
| Pressure | 3 | Clock, pair draft, pull-to-lava, or leftover-sum-4-unequal miss | ENC-SURV-37, ENC-PROT-19, ENC-LAVA-01, ENC-SNAP-03, ENC-PRIO-21, ENC-READY-02 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-19, ENC-BRANCH-19, ENC-TREAS-19, ENC-OATH-02, ENC-HOUR-03, ENC-PAD-02 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-36, ENC-ELITE-37, ENC-RARE-19, ENC-MAST-19, ENC-STRIKE-01, ENC-SHOCK-01, ENC-SNUFF-01, ENC-HOLD-08 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-20, ENC-BOSS-19, ENC-RUSH-71…74 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–18 remain valid. Day-19 **Score / File / Lava / Ready primer** is the default for accounts that already cleared Tally / Rank / Spike / Odd once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-19

ENCOUNTER_ID: ENC-TEACH-19  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a pair-HP path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile olive-slate ribbon of `WF-HAZ-PAIR_SEAM` across the mid-band (walk tiles cost 4% max HP **only if another living unit is Chebyshev ≤ 1**; solo steps are free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First pair-step tax logs a teach line. Do not also apply Hale Seam (ENC-TEACH-18: tax while current HP ≥ 50%), Spent Seam (ENC-TEACH-17: tax on **0 remaining AP**), Last Seam (ENC-TEACH-16: tax on **0 remaining MP**), Even Seam, Odd Seam, Bonded Seam (tax while you have no living summon), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: cross while you are alone so the ribbon is free floor, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is a tax while you share a cell-ring, free floor once you are alone; stopping next to a body is the expensive answer, not a bigger nuke.” Inverse of ENC-SURV-37’s end-turn pair tax. Prepares ENC-HAZ-38 / ENC-TREAS-19 (pair / ready devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-BUSY_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-37`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-37

ENCOUNTER_ID: ENC-HAZ-37  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a spender body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-BUSY_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit that spent the **most AP** last round; ties prefer the lowest combatant id; if nobody spent AP, it sits still; 5% max HP on land). Inverse of Lean Cinder (ENC-HAZ-33: hunts the **fewest remaining AP**). Distinct from Cast Cinder (ENC-HAZ-35: last `SpellConfig` spender), Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Hurt Cinder (lowest HP%), Rich Cinder (highest HP%), and Orbiting Cinder (clockwise square). Attack Nearest **does** pull it (it is an AP spend). A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: skip AP so it sits, or bait it onto the busiest enemy caster.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts the **busiest AP** body, not the last spell spender.” Distinct from ENC-HAZ-35 (cast / last SpellConfig).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: bishop starts having just spent so the orb prefers the player until you skip AP. High: inherit one pair-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-38

ENCOUNTER_ID: ENC-HAZ-38  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. After either spends one `SpellConfig`, further `SpellConfig` spends are illegal this turn if `WF-MOD-ONCE_CAST` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-19 pair-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-19`) **plus** `WF-MOD-ONCE_CAST` armed (each combatant may spend at most one `SpellConfig` this turn; Attack Nearest, summons, occupancy-walks, and 0-spell turns stay legal). A dry detour exists. Inverse of Walk Lock (ENC-HAZ-36: after a walk, no casts). Distinct from Cast Lock (ENC-HAZ-34: after a spell, no walks), Act Lock (ENC-HAZ-32: after **any** AP spend), File Walk (committed facing after the first step), and One Stride (at most 1 MP).  
SPECIAL_RULES: Scripted hazards only. Once Cast does not rewrite damage. Attack Nearest is not a spell. Teleport tiles are not walks.  
OBJECTIVE: Clear all. Intended: one spell then Attack Nearest; cross the seam while you are alone, or walk the dry detour.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine pair-HP tax with a one-spell lock so “Frost then Inferno then dash through a clump” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: One-spell then Attack Nearest remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Score Sting. Peak: add `WF-ENV-PAIR_DRAFT` so ending next to a body is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-37

ENCOUNTER_ID: ENC-SPELL-37  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-SCORE-STEP/SOLO-MEND` fallback — 1× `score_mender` queen (`spell-score-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Score Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Score-Mends only if **caster and target** leftover AP + leftover MP === 4 AND unequal **and** missing HP ≥ 8; else Shields. Dual Keep 2/2 is **Poise, skip**. Dual Keep leftover-sum 3 is **Tally, skip**. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Score Mend (8 paid on four leftover-sum===4 unequal flags) can drop `spell-score-mend` if missing. Do **not** grant `spell-tally-mend`, Poise Mend, Gaunt Mend, or Equal Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-score-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Score Mend, convert to ENC-SCORE-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-sum-4-unequal writer → ENC-SPELL-35 leftover without claiming Score. Band 0 → show `FSN-TALLY-STEP`. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 0` does **not** fire.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-score-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “four leftover-sum===4 unequal flags cash 8; a tie or a sum of 3 on one body is 0 HP.” Distinct from ENC-SPELL-35 (leftover-**sum === 3**).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Score Step on a second queen (promote to ENC-SCORE-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-38

ENCOUNTER_ID: ENC-SPELL-38  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-FILE-HEXA/SOLO-STRIDE` fallback — 1× `file_warder` pawn or knight (`spell-file-stride` + `physical_attack`) + 1× bishop (`starter-frost` only). Hexa Oath off until band 1 honesty.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal same-file floor. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing File Stride (same-file dest lock) can drop `spell-file-stride` if missing. If already owned, glyph is `starter-frost`. Extra room `file_gallery` is **not** this family.  
MAP_REQUIREMENTS: Open court with room to stand at same-file dests. Optional glyph (`discoverSpellId: spell-file-stride`).  
SPECIAL_RULES: If the player already owns File Stride, convert to ENC-FILE-02. Honesty: missing same-file dest filter → ENC-SPELL-36 leftover without claiming File. Band 0 → show `FSN-RANK-PENTA`. Rank-changing walks are illegal. Stand / Swap / forced-move still answer. Never PAIR File Stride + File Bite.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: stand, Swap, or take a legal same-file step.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-file-stride`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the next walk stays on this file, not a rank change and not an L.” Distinct from ENC-SPELL-36 (same-**rank** + exact-5).  
SOLVABILITY_REQUIREMENTS: At least one legal same-file floor dest from the player’s start. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Hexa Oath (promote to ENC-FILE-02). Never pack Rank Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-SCORE-01

ENCOUNTER_ID: ENC-SCORE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SCORE-STEP` — 1× `score_mender` queen (`spell-score-mend` + `starter-shield`) + 1× `score_stepper` queen without heal (`spell-score-step` + `physical_attack`). No Tally / Poise / Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift / Equal / Lean Mend on PAIR. No Tally / Poise / Gaunt / Parched / Home / Heave / Ally / Cover Step on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if leftover sum ≠ 4 **or** leftover AP === leftover MP. Stepper protector; skip if ally leftover sum ≠ 4 **or** a tie or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Score Mend or a legal Score Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Score Mend: 8 HP iff **caster and target** leftover AP + leftover MP === 4 AND unequal. One broken sum or a tie is 0 HP. Score Step is not ungated Home Step and not Tally Step. Band 0 → show `FSN-TALLY-STEP`. Honesty reroll → ENC-TALLY-01. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire. `3 = 0` does **not** fire.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2 (Poise window) **or** dump one pool so the sum leaves 4 **or** equalize the two leftovers.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-4-unequal discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag leftover-sum===4 unequal healer + four-flag joiner. Distinct from ENC-TALLY-01 (leftover-**sum === 3**) and ENC-POISE-01 (leftover-**tied ≥ 1**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-SCORE-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-SCORE-QUIET` (add cover). Peak: inherit one pair-seam gallery. Never `titans_vigor`. Never pack Tally Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-UNEQ-01

ENCOUNTER_ID: ENC-UNEQ-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SCORE-SIP` — 1× `score_stinger` pawn (`spell-score-sting` + `physical_attack`) + 1× `score_sipper` pawn without heal (`spell-score-sip` + `physical_attack`). No Tally / Poise / Gaunt / Dry / Lean / Full / Odd / Even Sting on PAIR. No Tally / Poise / Bare / Watch Sip on PAIR.  
AI_REQUIREMENTS: Stinger commits on leftover sum === 4 AND unequal; skip rider if the window is closed unless 10 still kills. Sipper skips if leftover sum ≠ 4 **or** a tie **or** leftover AP = 0. Dual Keep (3,1) / (1,3) **opens** the 8; (3,1)→(2,1) **manufactures Tally** after a sip; (0,4) fizzles the sip. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Score Sting or a legal Score Sip can drop that id if missing.  
MAP_REQUIREMENTS: `openField`. A dry aisle so Dual Keep 2/2 is a legal plant that **closes** this PAIR.  
SPECIAL_RULES: Family lottery **off**. Score Sting: 10 + 8 iff leftover sum === 4 AND unequal. Score Sip: steal 1 leftover AP iff leftover sum === 4 AND unequal and leftover AP ≥ 1. Band 0 → show `FSN-TALLY-SIP`. Honesty reroll → ENC-SUM-01.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2 (Poise window) **or** dump both pools to 0 (Gaunt window) **or** land leftover-sum 3 (Tally window) so the unequal-4 window closes.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum-4-unequal discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum-4-unequal poke + leftover-sum leftover-AP steal. Distinct from ENC-SUM-01 (leftover-**sum === 3** poke).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Sip never stacks past −1 leftover AP.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-SCORE-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: promote to `FSN-PURSE-SCORE` (add two-hostile invert). Never pack Tally Sting on this PAIR.  
STATUS: PROPOSED

---

### ENC-FILE-02

ENCOUNTER_ID: ENC-FILE-02  
TYPE: elite-adjacent / formation / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FILE-HEXA` — 1× `file_warder` (`spell-file-stride` + `physical_attack`) + 1× `hexa_oather` bishop (`spell-hexa-oath` + `starter-frost`). No Rank / Knight / Orth / Diag Warder on PAIR. No Penta / Quad / Tri Oather on PAIR. Never File Bite on this PAIR.  
AI_REQUIREMENTS: Warder skips if no legal same-file dest. Oather skips Hexa if the next spell cannot legally sit at Chebyshev 6; Strike stays legal. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing File Stride or Hexa Oath can drop that id if missing.  
MAP_REQUIREMENTS: `openField` with a legal same-file aisle **and** at least one tile at Chebyshev 6 from the player’s start that is not the portal. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. File Stride: next walk dest shares file. Hexa Oath: next spell exact Chebyshev 6. Blink / Swap / Score Step do not pay the oath. Band 0 → show `FSN-RANK-PENTA`. Honesty reroll → ENC-RANK-01. Extra room `hexa_nave` is **not** this family.  
OBJECTIVE: Defeat both. Intended: stand, Swap, take a legal same-file step, or Strike from a non-6 tile so the oath fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + file/hexa discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Same-file walk lock + exact-6 spell oath. Distinct from ENC-RANK-01 (same-**rank** + exact-5) and ENC-FILE-01 (queued day-4 file + pane).  
SOLVABILITY_REQUIREMENTS: A legal same-file floor dest exists. A Chebyshev-6 tile exists. Strike remains a complete answer.  
REPLAYABILITY: Warder N vs E. Variant `FSN-FILE-HEXA/E-OATH`.  
SCALING_BEHAVIOUR: High: inherit Once Cast so the oath spell is the only `SpellConfig` this turn. Never pack File Bite on this PAIR.  
STATUS: PROPOSED

---

### ENC-LAVA-01

ENCOUNTER_ID: ENC-LAVA-01  
TYPE: hazard / priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LAVA-FILE` — 1× `lava_reeler` pawn (`spell-lava-reel` + `physical_attack`) + 1× `file_biter` pawn (`spell-file-bite` + `physical_attack`). No Spike / Pit / Brick / Void / Cinder Reeler on PAIR. No Axis / Screen / Foe Biter on PAIR. Never File Stride on this PAIR.  
AI_REQUIREMENTS: Reeler pulls toward lava occupancy (tenth `applyAttract` dest). Dest is **toward**, not onto, a world portal. Biter bonuses a target who shares the caster’s **file only**. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lava Reel or File Bite can drop that id if missing.  
MAP_REQUIREMENTS: One lava gallery of 3–5 tiles off the only path (`scriptedHazardsOnly`). A walk-off that is **not** the lava cell **and not** a world portal remains after a legal reel dest. Extra room `lava_aisle` is **not** this family.  
SPECIAL_RULES: Family lottery **off**. Lava Reel dest never occupies the portal. File Bite rank-match without file is 0. Band 0 → show `FSN-SPIKE-SCREEN`. Honesty reroll → ENC-SPIKE-02. Counts toward `MAX_HAZARD_TILES`.  
OBJECTIVE: Defeat both. Intended: step off the reeler’s file, stand so the dest would be a portal (fizzle), or occupy the walk-off the reel needs.  
FAILURE_CONDITION: Player death (lava tax + bite).  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Pull-toward-lava plus file-only bite so “stand on the file and trade” is the wrong answer. Distinct from ENC-SPIKE-02 (spike occupancy + Bresenham-blocked bite).  
SOLVABILITY_REQUIREMENTS: Path around lava; reel dest leaves a walk-off; lava never walls a corridor; not on spawn±3 or the portal.  
REPLAYABILITY: Gallery west vs east.  
SCALING_BEHAVIOUR: Peak: inherit pair-seam on a **flank**, never into the lava. Never two reelers.  
STATUS: PROPOSED

---

### ENC-GATE-06

ENCOUNTER_ID: ENC-GATE-06  
TYPE: protection objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SCORE-GATE` — 1× `score_prelate` (`summonAI === "scorepost"`, empty kit, 1-HP occupy post) + 1× `score_siller` pawn (`spell-score-sill` paint + `physical_attack`). No Tally / Poise / Gaunt / Dummy / Drift / Lean Prelate on PAIR. No Wake / Swap / Strike Marker on PAIR.  
AI_REQUIREMENTS: Prelate is a post, not a walker. Siller paints start-turn leftover-sum===4 unequal occupy. Walk-on the post is **safe**. Dual Keep 2/2 is **safe**. Leftover-sum 3 is **safe**. Soph 1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Score Sill can drop that id if missing. Do **not** grant Tally Post.  
MAP_REQUIREMENTS: Two different floor tiles: post and sill, neither on spawn/portal. Player keeps ≥ 1 walk-off after either occupy.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing `summonAI === "scorepost"` or leftover-sum-4-unequal occupy → ENC-GATE-05 leftover. Band 0 → show `FSN-TALLY-GATE`. Dummy Post counts as 1 toward the summon cap.  
OBJECTIVE: Defeat both. Intended: dump a pool **or** Dual Keep 2/2 **or** land leftover-sum 3 before ending the turn on the post; walk onto the post mid-turn is free.  
FAILURE_CONDITION: Player death. End-turn occupy with leftover sum === 4 AND unequal detonates (challenge HP).  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Leftover-sum-4-unequal post + start-turn leftover-sum-4-unequal sill. Distinct from ENC-GATE-05 (leftover-**sum === 3**).  
SOLVABILITY_REQUIREMENTS: Both tiles reachable. Walk-on 0. Dump-a-pool 0. 2/2 0. Leftover-sum 3 0.  
REPLAYABILITY: Post N vs E of sill.  
SCALING_BEHAVIOUR: High: promote to `FSN-SCORE-HOLD` 3-body (not Hendeca). Never Hendeca while cap is 2.  
STATUS: PROPOSED

---

### ENC-STRIKE-01

ENCOUNTER_ID: ENC-STRIKE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STRIKE-DRY` — 1× `strike_marker` pawn (`spell-strike-mark` + `physical_attack`) + 1× `dry_plater` pawn (`spell-dry-plate` + `physical_attack`). No Swap / Shove / Cast Marker on PAIR. No Gait / Spent / Odd Plater on PAIR. Never Mark+Goad as PAIR (`/GOAD` is the 3-body).  
AI_REQUIREMENTS: Marker paints a cell; Strike originating on that cell consumes it. Walk-on is free. Spell-from is free. Teleport / Swap / Score Step do not pay. Plater zeros the next hit **while leftover MP is 0**; leftover MP ≥ 1 lands and charge stays. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Strike Mark or Dry Plate can drop that id if missing. Extra room `strike_pulpit` is **not** this family.  
MAP_REQUIREMENTS: Open court. Painted cell is floor, not spawn/portal/hazard.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing Strike-from-cell writer → ENC-PEEK-01 leftover without claiming Strike Mark. Band 0 → show `FSN-SWAP-BRICK`.  
OBJECTIVE: Defeat both. Intended: Attack Nearest / walk-on the paint / hold leftover MP ≥ 1 so Dry Plate misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Strike-from paint + leftover-MP=0 miss. Distinct from ENC-PEEK-01 (teleport-landing consume + through-barrier dest).  
SOLVABILITY_REQUIREMENTS: Paint is floor. Walk-on 0. Spell-from 0. Leftover MP ≥ 1 is a complete Dry Plate answer.  
REPLAYABILITY: Paint west vs east.  
SCALING_BEHAVIOUR: High: promote to `FSN-STRIKE-DRY/GOAD` 3-body. Never two paints.  
STATUS: PROPOSED

---

### ENC-SHOCK-01

ENCOUNTER_ID: ENC-SHOCK-01  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SHOCK-EVEN` — 1× `shock_skipper` pawn (`spell-shock-skip` + `physical_attack`) + 1× `even_stinger` pawn (`spell-even-sting` + `physical_attack`). No Mire / Rime / Glyph / Cinder / Spike / Lava Skipper on PAIR. No Odd / Full / Tally / Score Stinger on PAIR.  
AI_REQUIREMENTS: Skipper’s next **1-tile** walk treats shock enter-tax as floor; length ≥ 2 pays. Stinger commits on leftover AP even **and ≥ 2**; leftover AP 0 is even and **excluded**. Hostiles start ≥ 4 apart. Soph 1–2. Extra room `shock_nave` is **not** this family.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Shock Skip or Even Sting can drop that id if missing.  
MAP_REQUIREMENTS: One clean aisle plus 2–4 shock cells off the only path (`scriptedHazardsOnly`). A 1-tile hop exists.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing 1-tile shock-as-floor → ENC-MIRE-01 leftover. Band 0 → show `FSN-MIRE-FILE`. Shock is not lava / spikes / pits.  
OBJECTIVE: Defeat both. Intended: hop 1 then stop; dump leftover AP to 0 or 1 (odd) so Even Sting is 10 with no rider.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: 1-tile shock skip + leftover-AP even ≥ 2 poke. Distinct from ENC-MIRE-01 (mire-tax-as-floor) and ENC-EVEN-02 (even-Chebyshev miss).  
SOLVABILITY_REQUIREMENTS: One clean aisle. Shock never walls a corridor. 1-tile hop exists.  
REPLAYABILITY: Aisle N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit pair-seam on a **gallery**. Never thicken shock into a wall.  
STATUS: PROPOSED

---

### ENC-SNAP-03

ENCOUNTER_ID: ENC-SNAP-03  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WATCH-ODD` — 1× `watch_rooter` rook (`spell-watch-root` + `physical_attack`) + 1× `odd_gaiter` pawn (`spell-odd-gait` + `physical_attack`). No Watch Banker / Sipper on PAIR. No Lone / Pair / Tied Gaiter / Odd Stinger on PAIR. Never Root+Gun as PAIR.  
AI_REQUIREMENTS: Rooter overwatch snap **zeros leftover MP** on the walker; still deals. Never steal leftover AP (Watch Sip). Never bank leftover AP (Watch Bank). Gaiter commits on leftover **MP odd**. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Watch Root or Odd Gait can drop that id if missing.  
MAP_REQUIREMENTS: Open court with a painted overwatch file. A walk that does **not** enter the file exists.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-MP dump on snap → ENC-SNAP-02 leftover without claiming Root. Band 0 → show `FSN-WATCH-BANK`. Dual Keep leftover that survives turn start **is** leftover — Root then dumps the MP half.  
OBJECTIVE: Defeat both. Intended: walk off the overwatch file, or hold leftover MP even so Odd Gait is 10 with no rider.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Snap zeros leftover MP + leftover-MP-odd poke. Distinct from ENC-SNAP-02 (snap **banks** leftover AP) and ENC-ODD-03 (leftover-**AP**-odd miss).  
SOLVABILITY_REQUIREMENTS: Off-file walk exists. Root never stacks with a second leftover-MP dump.  
REPLAYABILITY: Overwatch N vs E.  
SCALING_BEHAVIOUR: High: inherit Once Cast. Never pack Watch Sip on this PAIR.  
STATUS: PROPOSED

---

### ENC-LEAN-02

ENCOUNTER_ID: ENC-LEAN-02  
TYPE: elite-adjacent / formation / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LEAN-RISE` — 1× `lean_gifter` queen (`spell-lean-gift` + `starter-shield`) + 1× `cadence_riser` bishop (`spell-cadence-rise` + `starter-frost`) + 1× font pawn (`physical_attack` only). No Score / Tally / Poise / Gaunt / Equal / Hollow Mend on this BRIGADE. Never PAIR Rise + Snuff.  
AI_REQUIREMENTS: Gifter heals iff leftover **AP = 0 and leftover MP ≥ 1**; Dual Keep **destroys** this window if it banks AP. Riser writes remaining `n===1` → `2`; skip if remaining ≠ 1. Font greedy. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lean Gift or Cadence Rise can drop that id if missing. Do **not** grant Score Mend or Cadence Prime.  
MAP_REQUIREMENTS: `arena`. Font is not the only exit body-block.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-AP=0 and MP≥1 heal → ENC-EQUAL-01 leftover without claiming Lean Gift. Band 0 → show `FSN-PAIR-DRY`. Do **not** invent `lean_cantor`.  
OBJECTIVE: Defeat all. Intended: keep leftover AP ≥ 1 so Lean Gift is 0 HP; spend remaining CD off 1 so Rise fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + lean/rise discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover AP=0 and MP≥1 heal + remaining 1→2. Distinct from ENC-LEAN-01 (queued day-15 dry-purse/wet-walk poke) and ENC-PRIME-01 (remaining `0→1`).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Keeping leftover AP ≥ 1 is a complete Lean Gift answer.  
REPLAYABILITY: Gifter N vs E.  
SCALING_BEHAVIOUR: High: inherit Ready Sill so skipping AP (which **opens** Lean Gift) is also the short-path key. Never pack Cadence Snuff on this BRIGADE.  
STATUS: PROPOSED

---

### ENC-DUEL-02

ENCOUNTER_ID: ENC-DUEL-02  
TYPE: elite encounters / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DUEL-SCORE` — 1× `duel_turner` queen (`spell-duel-turn` + `starter-frost`) + 1× `score_mender` (`spell-score-mend` + `starter-shield`) + 1× `score_stinger` (`spell-score-sting` + `physical_attack`). No Purse Turner / Bar Crosser as PAIR. Hymn Turn (two **allies**) stays Wave 18 — unconsumed.  
AI_REQUIREMENTS: Turner inverts leftover AP↔MP on **two hostiles independently**; equal leftover on a body is a no-op for that body. Mender / Stinger use Score windows. Hostiles start ≥ 4 apart. Soph 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Duel Turn can drop that id if missing. Do **not** grant Purse Turn.  
MAP_REQUIREMENTS: `arena`. Three walk-offs.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing two-hostile invert → ENC-TURN-01 leftover without claiming Duel. Band 0 → show `FSN-SCORE-STEP` + `FSN-SCORE-SIP`.  
OBJECTIVE: Defeat all. Intended: equalize leftover on both player-side bodies so invert is a no-op, **or** Dual Keep 2/2 so Score windows close.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two-hostile leftover invert plus leftover-sum-4-unequal heal/sting. Distinct from ENC-DUEL-01 (queued day-3 two elites + rage-on-death) and ENC-TURN-01 (one-hostile invert).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Equal leftover is a complete invert answer.  
REPLAYABILITY: Turner N vs E.  
SCALING_BEHAVIOUR: Peak: promote to `FSN-PURSE-SCORE` (sip manufactures Tally). Never two inverters.  
STATUS: PROPOSED

---

### ENC-SNUFF-01

ENCOUNTER_ID: ENC-SNUFF-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SNUFF-VERSE` — 1× `cadence_snuffer` bishop (`spell-cadence-snuff` + `starter-frost`) + 1× `verse_scorer` bishop (`spell-verse-score` + `starter-frost`) + 1× glyph pawn (`physical_attack`). Never PAIR Rise + Snuff. No Cadence Primer on this CADRE.  
AI_REQUIREMENTS: Snuffer writes remaining `n===1` → `0`; skip if remaining ≠ 1. Verser makes last-id illegal until leftover sum === 4 AND unequal; `0 = 0` does not peel; `2 = 2` does not; `3 = 0` does not; shove does not. Glyph greedy. Soph 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cadence Snuff or Verse Score can drop that id if missing. Do **not** grant Cadence Prime.  
MAP_REQUIREMENTS: `arena`. Glyph tax tile is optional floor, not a wall.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing remaining `1→0` **or** `lastResolvedSpellId` → ENC-PRIME-01 leftover without claiming Snuff. Band 0 → show `FSN-PRIME-TAX`. Forced-move does **not** peel Verse Score.  
OBJECTIVE: Defeat all. Intended: spend remaining off 1 so Snuff fizzles; Dual Keep 2/2 or leftover-sum 3 so Verse Score stays locked and you Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Remaining 1→0 plus last-id until leftover-sum===4 unequal. Distinct from ENC-PRIME-01 (remaining `0→1`) and ENC-HOLD-07 (Tally Hold).  
SOLVABILITY_REQUIREMENTS: Strike remains a complete answer while Verse Score is locked. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Snuffer N vs E.  
SCALING_BEHAVIOUR: Peak: inherit Once Cast so the last legal `SpellConfig` is the one Verse Score just locked. Never pack Cadence Rise on this CADRE.  
STATUS: PROPOSED

---

### ENC-BRACE-01

ENCOUNTER_ID: ENC-BRACE-01  
TYPE: map structure / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STILL-BRACE` — 1× `still_toller` bishop (`spell-still-toll` + `starter-frost`) + 1× `brick_bracer` rook (`spell-brick-brace` + `physical_attack`) + 1× `stone_castellan` (turret extras, `physical_attack`). No Brick Stepper / Nudger as PAIR. Never Brace+Step PAIR.  
AI_REQUIREMENTS: Toller: next-**spell** +1 AP if leftover **MP = 0**. Bracer: next hit 0 if a **barrier is adjacent**; it does **not** mint a new barrier from empty floor and does **not** move the barrier. Destroy it and the hit lands; charge stays. Castellan camps. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Still Toll or Brick Brace can drop that id if missing.  
MAP_REQUIREMENTS: One already-planted barrier on a gallery (not a cut-vertex). Bypass exists.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing barrier-adjacent miss → ENC-STRIKE-01 leftover without claiming Brace. `usableByEnemy` stays false for `spell-barrier` — this sheet camps an **already planted** barrier.  
OBJECTIVE: Defeat all. Intended: smash the barrier so Brace is 0, or hold leftover MP ≥ 1 so Still Toll is 0.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Leftover-MP=0 spell tax + barrier-adjacent miss + turret. Distinct from ENC-COLUMN-01 (brace/smash occupancy column).  
SOLVABILITY_REQUIREMENTS: Barrier is not a cut-vertex. Smash is optional. Bypass exists.  
REPLAYABILITY: Barrier west vs east aisle.  
SCALING_BEHAVIOUR: High: inherit Brace Column as the planted barrier (`inheritHazardsFrom: ENC-COLUMN-01`). Never two barriers on the only aisle.  
STATUS: PROPOSED

---

### ENC-HOLD-08

ENCOUNTER_ID: ENC-HOLD-08  
TYPE: elite encounters / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SCORE-HOLD` — 1× `score_holder` rook (`spell-score-hold` + `physical_attack`) + 1× `must_scorer` bishop (`spell-must-score` + `starter-frost`) + 1× warden pawn (`physical_attack`). **Never PAIR Score Hold + Must Score as a two-body** — this is the legal 3-body COURT. No Hendeca. No Tally / Poise Hold on this COURT.  
AI_REQUIREMENTS: Holder refuses walk MP until leftover sum === 4 AND unequal; spells stay legal. Must Score: remaining non-Strike spells illegal unless leftover sum === 4 AND unequal **and** last AP. Warden greedy. Soph 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Score Hold or Must Score can drop that id if missing.  
MAP_REQUIREMENTS: `arena`. Three walk-offs. No 11-cell occupy.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-sum-4-unequal walk refuse → ENC-HOLD-07 leftover. Band 0 → show `FSN-TALLY-HOLD`. Hold `FSN-SCORE-HOLD/HENDECA` while `ENEMY_SUMMON_CAP` is 2.  
OBJECTIVE: Defeat all. Intended: Dual Keep 2/2 or leftover-sum 3 so walks stay legal and Must Score stays locked; Strike is always legal.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walk-until leftover-sum===4 unequal + tools-until leftover-sum===4 unequal and last AP. Distinct from ENC-HOLD-07 (leftover-**sum === 3**).  
SOLVABILITY_REQUIREMENTS: Strike remains a complete answer. Three-unit occupancy leaves an exit. Hendeca never plants.  
REPLAYABILITY: Holder N vs E.  
SCALING_BEHAVIOUR: Peak: inherit Once Cast. Never Hendeca. Never a second Hold engine.  
STATUS: PROPOSED

---

### ENC-QUIET-03

ENCOUNTER_ID: ENC-QUIET-03  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SCORE-QUIET` — 1× `score_stepper` + 1× `score_mender` + 1× cover rook (`starter-shield` + `physical_attack`). No Tally / Poise Quiet as a second cover engine.  
AI_REQUIREMENTS: Same as ENC-SCORE-01 plus cover. Cover Shields the mender if missing HP ≥ 8 and leftover window is open. Soph 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-SCORE-01.  
MAP_REQUIREMENTS: `arena`. Cover needs a tile at range 2 from the mender that is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-sum-4-unequal join + heal → ENC-SCORE-01 leftover without claiming Quiet.  
OBJECTIVE: Defeat all. Intended: close the Score window, then isolate the cover.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Three-body leftover-sum-4-unequal join + heal + cover. Distinct from ENC-QUIET-02 (queued day-18 leftover-sum===3 Quiet).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit.  
REPLAYABILITY: Cover N vs E.  
SCALING_BEHAVIOUR: Peak: inherit pair-seam gallery. Never a fourth body.  
STATUS: PROPOSED

---

### ENC-WAVE-20

ENCOUNTER_ID: ENC-WAVE-20  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Wave 1: 3× pawn (`physical_attack`). Wave 2: `FSN-SCORE-STEP` fallback (mender + stepper) **or** `FSN-SCORE-SIP` if Score Mend already owned. Wave 3: 1× rook (`physical_attack`) + leftover pawn. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR AI (mender skip if leftover sum ≠ 4 or a tie; stinger commits on leftover sum === 4 AND unequal). Wave 3 rook camps the choke via `chokepointCamp` only if AI tier ≥ 3.  
SPELL_DISCOVERY_OPPORTUNITIES: Optional overlay: a dead mender drops `spell-score-mend` if ENC-SPELL-37 was skipped this chain.  
MAP_REQUIREMENTS: One choke (2-tile corridor) between spawn side and a backline alcove. `waveSpawnCells` marked. Exit behind the alcove. Optional pair-seam ribbon on the **gallery**, never in the choke.  
SPECIAL_RULES: Portal stays locked until wave 3 is clear. Next wave spawns at the start of the enemy phase after the previous wave is dead, on `waveSpawnCells` only (must be free floor). If a cell is occupied, spill to the nearest free reachable floor. Soft fail: if a wave cannot place any unit, skip that wave and log it. Honesty: missing leftover-sum-4-unequal → wave 2 is ENC-WAVE-19 leftover without claiming Score.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player HP ≤ 0.  
REWARD: Victory XP counts all three waves’ defeated levels. Depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cadence — spend on wave 1, Dual Keep 2/2 (or leftover-sum 3) before the leftover-sum-4-unequal healer, then break the choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Choke must not isolate the player from the exit after walls finalize. Cap living hostiles so `ENEMY_SUMMON_CAP` is not starved later.  
REPLAYABILITY: Wave 2 rotates `FSN-SCORE-STEP` / `FSN-SCORE-SIP` / `FSN-FILE-HEXA` by seed. Choke side flips.  
SCALING_BEHAVIOUR: Mid: wave 2 gains the named kit. High: wave 3 rook learns `spell-iron-skin`. Peak: add a 2-pawn “echo” wave only if the player’s kill time on wave 1 was under 2 turns (skill-scaled, not level-scaled).  
STATUS: PROPOSED

---

### ENC-AMBUSH-19

ENCOUNTER_ID: ENC-AMBUSH-19  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Overworld / exploration: `WF-ELT-READY_PICKET` — one same-tier elite occupies a painted post **only while the player’s remaining AP equals max AP**. Spend any AP and the post is empty floor (exploration: they leave, no purse). Dungeon / boss rush: they stand from map start — required for map-clear. Inverse of Plant Picket (ENC-AMBUSH-18: remaining MP 0). Distinct from Spare Picket (leftover AP), Diag Picket (ENC-AMBUSH-17: off-axis), Orth Picket (ENC-AMBUSH-16: on-axis), Near Picket (≤3), High Picket (≥80% HP), and Spell Picket (after a cast).  
AI_REQUIREMENTS: Elite uses live kit for the piece. No lookahead until engaged. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: elite may carry one `usableByEnemy` extra that ENC-PRIO-21 can teach.  
MAP_REQUIREMENTS: Painted post is floor. Exit reachable without touching. Counts as 1 enemy. Full-AP pip painted.  
SPECIAL_RULES: Appearance keys off remaining AP equaling max AP. World contact starts a normal battle. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-18.  
OBJECTIVE: Fight them (dungeon) or spend AP and pass (exploration).  
FAILURE_CONDITION: Player death in the fight. Walking past after spending AP is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the picket only exists while you are **ready** (no AP spent).” Inverse of planted-MP pickets.  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without touching. In a run they are present from the start and reachable.  
REPLAYABILITY: Post north vs east.  
SCALING_BEHAVIOUR: High: elite is Score Hood so leftover sum === 4 AND unequal on the ready body is a miss — spend a pool then Strike. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-19

ENCOUNTER_ID: ENC-REINF-19  
TYPE: reinforcements / waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn. Wave 2 (reinforcement): 1× bishop (`starter-frost`) spawns on `waveSpawnCells` when the first pawn dies — **not** a Ready File (that is ENC-READY-02). Distinct from ENC-REINF-18 (echo bishop after a kill, Mute File leftover).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Alcove `waveSpawnCells` behind a 2-tile choke. Portal locked until both waves clear.  
SPECIAL_RULES: Reinforcement at the start of the enemy phase after the trigger kill. Occupied cell spills to nearest free reachable floor. `holdPortalLocked` until wave 2 is down.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death. Soft fail: if wave 2 cannot place, skip and log.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce after a kill so bursting the first pawn is a choice, not always correct. Distinct from ENC-READY-02 (AP-lock until skip-AP).  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop vs queen (frost only) by seed.  
SCALING_BEHAVIOUR: High: wave 2 is Score Hood. Peak: inherit pair-seam on the gallery.  
STATUS: PROPOSED

---

### ENC-READY-02

ENCOUNTER_ID: ENC-READY-02  
TYPE: priority-target / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-READY_FILE` — two extra same-tier elites share a painted file. The first (painted ready pennant) cannot spend AP until the second is dead **OR** the player ends a turn with remaining AP equal to max AP. Occupancy-walks (MP) stay legal. Distinct from Mute File (ENC-MUTE-02: first SpellConfig-locked until adjacent), Sheath File (second AP-locked until the first dies or you end adjacent), Guard File (first walk-locked), and Sleeping Vanguard (both world-asleep until touch).  
AI_REQUIREMENTS: Free spender uses live kit. Ready-locked elite may walk MP but cannot spend AP until unlocked. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Painted file. Exit reachable. Adds enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2.  
SPECIAL_RULES: Ready lock is occupancy/turn state, not a buff spell. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-MUTE-02.  
OBJECTIVE: Clear both. Intended: burst the free spender first, **or** skip AP once so both act and you accept the race.  
FAILURE_CONDITION: Player death.  
REWARD: Hard reward multiplier via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “skip AP to wake the ready elite, or burst the free spender while the other cannot spend AP.” Distinct from ENC-MUTE-02 (spell-lock until adjacent).  
SOLVABILITY_REQUIREMENTS: Both reachable. MP walks remain legal for the locked elite. Living hostiles ≤ 4.  
REPLAYABILITY: Ready pennant N vs S of the file.  
SCALING_BEHAVIOUR: Peak: inherit Once Cast so the unlocked elite still has one `SpellConfig`. Never three on the file.  
STATUS: PROPOSED

---

### ENC-COLUMN-01

ENCOUNTER_ID: ENC-COLUMN-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-BRACE_COLUMN` + 1× pawn on the player’s side.  
AI_REQUIREMENTS: Bishop kites behind the column. Pawn charges around it. No smash AI unless the player already left it unbraced.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One cracked column occupies a cell: it **blocks walk and line of sight**. Adjacent 1 AP (no spell) braces it until the next round start — while braced it cannot be smashed. Adjacent 2 AP smashes it to clear floor only if it is unbraced. Distinct from Slit Wall (ENC-SLIT-01: rotate a facing, LoS along the slit), Pivot Slab (ENC-SLAB-01: walk-block, LoS **open**, relocates), Hush Curtain (ENC-CURTAIN-01: walk-through LoS-block), Fold Wall (full LoS block that folds), Reed Screen (walk-block, fully open LoS), and Crumble Pillar (smash only). Never on spawn/portals.  
SPECIAL_RULES: Brace and smash are AP occupancy actions, not spells. No damage. Brace lasts until the next round start. Null Field does not strip it. Skip if `evaluateSolvability` would fail with the column intact. Honesty reroll → ENC-SLIT-01.  
OBJECTIVE: Clear all. Intended: spend 1 AP to keep cover through the next round, spend 2 AP to smash while unbraced, or take the bypass.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “walk-block LoS-block column; brace is 1 AP, smash is 2 AP if nobody braced it.” Distinct from ENC-SLIT-01 (rotate a slit) and ENC-BRACE-01 (family miss if a barrier is adjacent).  
SOLVABILITY_REQUIREMENTS: Must not be a cut-vertex. Map solvable with the column intact. Bypass exists. Smash is optional.  
REPLAYABILITY: Column west vs east aisle.  
SCALING_BEHAVIOUR: High: bishop gains `starter-poison`. Never two columns on the only aisle.  
STATUS: PROPOSED

---

### ENC-SKEW-01

ENCOUNTER_ID: ENC-SKEW-01  
TYPE: hazard / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn may take **one** cardinal step onto the plate (free); wounded pawns avoid a diagonal enter (`ENEMY_HAZARD_AVOID_HP_PCT`).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TRP-SKEW_PLATE` on a mid-court floor cell. Stepping onto it from an orthogonal neighbor is free. The first step onto it from a diagonal neighbor this map costs 8% max HP once; then the plate becomes floor. Distinct from Chevron Plate (one painted facing is safe), Side Plate, Heft Plate (ENC-HEFT-01: first **forced** landing), Glyph Plate (any enter), and Diag Hour (map-wide off-axis purse). A cardinal approach exists. Exit behind the bishop.  
SPECIAL_RULES: Scripted plate only. One-shot. Never hidden. Never on spawn/portals. Tax via in-battle challenge HP. Honesty reroll → ENC-HEFT-01.  
OBJECTIVE: Clear all. Intended: approach on a cardinal, spend MP to go around, or bait an enemy in on the diagonal.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “cardinal enter is free; the first diagonal enter is the tax.” Distinct from ENC-HEFT-01 (forced landing).  
SOLVABILITY_REQUIREMENTS: Walkable before and after. Cardinal approach exists. Plate is not a wall.  
REPLAYABILITY: Plate west vs east of the bishop.  
SCALING_BEHAVIOUR: High: inherit pair-seam on a **flank**. Never two plates.  
STATUS: PROPOSED

---

### ENC-READY-01

ENCOUNTER_ID: ENC-READY-01  
TYPE: movement objective / map structure  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-OBS-READY_SILL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop kites on the short-path side. Pawn camps the long path. No smash AI.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: A short-path corridor cell starts as a wall. It becomes floor for the rest of the map after the player ends a turn with remaining AP equal to max AP (no AP spent that turn). Inverse of Spent Sill (opens at 0 remaining AP). Distinct from Empty Font (heal at 0 remaining AP), Hale Sill (ENC-HALE-01: ≥80% HP), Empty Step (0 AP pads), and Act Lock (after AP, no walks). A second spawn→portal route already exists.  
SPECIAL_RULES: Place only when a second route exists. Evaluate solvability as if the sill were already a wall. Never the only exit. Honesty reroll → ENC-HALE-01.  
OBJECTIVE: Clear all. Intended: end a turn without spending AP to open the short path, take the long way, or wait until a round you already planned to skip AP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “skip AP once to open the short path.” Inverse of dump-AP sills. Prepares ENC-AMBUSH-19 / ENC-PRIO-21.  
SOLVABILITY_REQUIREMENTS: Long path reaches both hostiles and the exit with the sill still a wall. Sill never the only exit.  
REPLAYABILITY: Sill N vs E of the long path.  
SCALING_BEHAVIOUR: High: bishop is Ready Tutor (ENC-PRIO-21). Never two sills.  
STATUS: PROPOSED

---

### ENC-PAD-02

ENCOUNTER_ID: ENC-PAD-02  
TYPE: movement objective  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps a pad on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Two linked `WF-TEL-SKEW_STEP` pads. Entering one for 1 MP exits the other only while the traveler shares **neither** row nor column with any living hostile. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Inverse of File Step (ENC-PAD-01: on-axis with a hostile). Distinct from Diag Cache / Diag Hour / Diag Picket / Diag Tutor, Flank Step, and Clear Step (empty dest, no axis gate).  
SPECIAL_RULES: Both on floor, not on spawn/portals. The map is solvable without using them. 1 MP from the unit’s current MP only on a successful off-axis landing. Not a teleport spell. Honesty reroll → ENC-PAD-01.  
OBJECTIVE: Clear all. Optional: stand off every hostile’s rank and file then spend 1 MP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the skip only works while you are off every hostile’s rank **and** file.” Inverse of ENC-PAD-01 (on-axis skip).  
SOLVABILITY_REQUIREMENTS: Both pads floor. Map solvable without them.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit Once Cast. Never three pads.  
STATUS: PROPOSED

---

### ENC-SURV-37

ENCOUNTER_ID: ENC-SURV-37  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× pawn + 1× bishop (`starter-frost`). Optional 1-HP player-side summon is **legal bait** (it also pays the tax).  
AI_REQUIREMENTS: Pawns charge. Bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: `WF-ENV-PAIR_DRAFT` armed. At the end of each combatant turn, if another living unit is Chebyshev ≤ 1 they pay 3% max HP. Ending the turn with nobody adjacent is shelter. Inverse of Isolation Chill (tax when nobody is within 3). Distinct from Crowd Press (tax at 3+ bodies), Hunt Draft (tax unless close to a hostile), Pair Font (heal while paired), and Pair Seam (ENC-TEACH-19: **step** tax while paired). Open court so ending alone is always possible.  
SPECIAL_RULES: End-of-turn challenge HP. Pair check is Chebyshev ≤ 1 from any other living combatant. Summons pay it. No skipped turns. Skip if the map would start with only one living unit so a pair cannot exist. Honesty reroll → ENC-SURV-35.  
OBJECTIVE: Survive and clear all. Intended: end turns alone; shove a foe after they have already acted.  
FAILURE_CONDITION: Player death (frost + pair tax).  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Clock that taxes **clumping**, not leftover MP (ENC-SURV-35) and not hale-HP (ENC-HALE-01).  
SOLVABILITY_REQUIREMENTS: Does not add walls. A tile with an empty ring exists from spawn. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop N vs E.  
SCALING_BEHAVIOUR: Peak: inherit pair-seam so stepping next to a body is also a tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-PROT-19

ENCOUNTER_ID: ENC-PROT-19  
TYPE: protection objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn. The font is the objective object, not a third hostile.  
AI_REQUIREMENTS: Bishop kites toward the font if the player is about to drink. Pawn contests the ring. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-ZON-PAIR_FONT`. The first unit to end a turn here this map heals 8% max HP only if another living unit is Chebyshev ≤ 1; then the tile dries. Ending here alone does nothing and does not dry it. Enemies can drink it. Inverse of Alone Font. Distinct from Rival Font (must be next to a foe), Isolation Chill, Plant Font (ENC-PROT-18: heal at 0 remaining MP), and Shrine Pool (unconditional first drink).  
SPECIAL_RULES: Zone tick, not a spell. Player HP persist via `saveBattleStats` on the progress lock. Null Field does not strip it. Honesty reroll → ENC-PROT-18.  
OBJECTIVE: Clear all. Optional: plant next to a body for the heal, deny the enemy the basin, or ignore it.  
FAILURE_CONDITION: Player death. Letting the enemy drink is not a room fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Contest a heal that only pays if you share a cell-ring. Distinct from ENC-PROT-18 (planted-MP drink).  
SOLVABILITY_REQUIREMENTS: Font walkable. Optional. Never on spawn/portals.  
REPLAYABILITY: Font west vs east of the bishop.  
SCALING_BEHAVIOUR: High: inherit Pair Draft so drinking next to a body also taxes the end-turn. Never two fonts.  
STATUS: PROPOSED

---

### ENC-PRIO-21

ENCOUNTER_ID: ENC-PRIO-21  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-READY_TUTOR` — one same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell. Prefer `spell-score-mend` if ENC-SPELL-37 was skipped, else `spell-file-stride`.  
AI_REQUIREMENTS: Tutor kites. Does not skip the turn after the teach. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn with remaining AP equal to max AP while they still live (any distance), the player gains that spell id as a **single remaining cast this map**. Killing them before that ready teach grants the purse but not the one-cast. They stay hostile after the teach. Distinct from Plant Tutor (ENC-PRIO-20: remaining MP 0), Close Tutor (end turn adjacent), Live Tutor (repeating loan while they live), Empty Font (heal at 0 AP), and Steel Hour (skip paid-AP spells for a purse).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
SPECIAL_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Honesty reroll → ENC-PRIO-20.  
OBJECTIVE: Clear them. Optional: skip AP and end a turn for the one-shot.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional one-cast. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “skip AP once for a one-shot, or burst-kill for the purse.” Distinct from ENC-PRIO-20 (planted-MP teach).  
SOLVABILITY_REQUIREMENTS: Tutor reachable. In dungeon / boss rush they count as hostiles for map-clear.  
REPLAYABILITY: Extra id rotates Score Mend / File Stride / Score Sting.  
SCALING_BEHAVIOUR: High: inherit Ready Picket so skipping AP is also a fight. Never two tutors.  
STATUS: PROPOSED

---

### ENC-ELITE-36

ENCOUNTER_ID: ENC-ELITE-36  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Elite skin of ENC-SCORE-01 **or** ENC-UNEQ-01 by `branch`. Score branch: `FSN-SCORE-STEP/E-STEP`. Unequal/file leftover: `FSN-SCORE-SIP/E-STING`. No second elite.  
AI_REQUIREMENTS: Soph 2–3. Lethal lookahead on if AI tier allows. InstantKill / betrayal off. Backline protect on for the mender skin.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as the base PAIR.  
MAP_REQUIREMENTS: `arena`. Inherit one taught device from the branch on a **gallery**.  
SPECIAL_RULES: Family lottery **off**. Honesty same as the base PAIR.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: High-band victory XP + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove leftover-sum-4-unequal under an elite tag, not a bigger HP bar.  
SOLVABILITY_REQUIREMENTS: Same as the base PAIR.  
REPLAYABILITY: Two skins.  
SCALING_BEHAVIOUR: Peak: inherit Once Cast. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-ELITE-37

ENCOUNTER_ID: ENC-ELITE-37  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Elite skin of ENC-FILE-02 **or** ENC-LAVA-01 by `branch`. File: `FSN-FILE-HEXA/E-OATH`. Lava: `FSN-LAVA-FILE/E-REEL`. Never both File Stride and File Bite.  
AI_REQUIREMENTS: Soph 2–3. LoS reposition on for the oather. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as the base PAIR.  
MAP_REQUIREMENTS: `arena` plus the named hazard gallery for lava.  
SPECIAL_RULES: Family lottery **off**. Honesty same as the base PAIR.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: High-band. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove file-lock / lava-reel under an elite tag.  
SOLVABILITY_REQUIREMENTS: Same as the base PAIR.  
REPLAYABILITY: Two skins.  
SCALING_BEHAVIOUR: Peak: inherit pair-seam on a **gallery**, never into lava.  
STATUS: PROPOSED

---

### ENC-RARE-19

ENCOUNTER_ID: ENC-RARE-19  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-SCORE-HOLD` 3-body (ENC-HOLD-08) **or**, if the account already cleared Score Hold this week, `FSN-DUEL-SCORE` (ENC-DUEL-02). Never Hendeca. Never a fourth body.  
AI_REQUIREMENTS: Same as the named COURT / BRIGADE. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as the named sheet.  
MAP_REQUIREMENTS: `arena`. Optional sealed fifth door from ENC-BRANCH-19.  
SPECIAL_RULES: Insert only. 8% on depth 4 after ENC-BRANCH-19 has been seen. Honesty same as ENC-HOLD-08 / ENC-DUEL-02.  
OBJECTIVE: Defeat all.  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band + named discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Long-term rare that is a **new question** (walk-until leftover-sum-4-unequal, or two-hostile invert), not a sponge.  
SOLVABILITY_REQUIREMENTS: Same as the named sheet. Hendeca never plants.  
REPLAYABILITY: Hold vs Duel by weekly seed.  
SCALING_BEHAVIOUR: Do not add Hendeca. Tighten by Once Cast, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-19

ENCOUNTER_ID: ENC-TREAS-19  
TYPE: treasure/risk rooms  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: None required. Optional 1× pawn guardian if opened from round 3 **fails closed** (the chest already sealed — do not spawn a surprise elite).  
AI_REQUIREMENTS: None if unopened.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-TRS-ROUND_CACHE`. A visible chest with a round pip. 1 AP adjacent opens it only on rounds 1–2: a medium `applyRewards` grant and no guardian. From round 3 the chest seals and cannot open (no grant). Inverse of Late Cache (opens from round 3). Distinct from Trip Cache (open before any MP this map), Swift March (win in round 1), Patience Cache (wait-or-open), and Cold Open (0-cooldown locked round 1). Optional rest risk-exit from ENC-REST-19.  
SPECIAL_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Failed open after round 2 spends nothing. Optional. Never on spawn/portals.  
OBJECTIVE: Open in the first two rounds, wait and let it seal, or walk past.  
FAILURE_CONDITION: None on the chest. Player death if a later fight is joined.  
REWARD: Medium `applyRewards` if opened on rounds 1–2. No overlay (the risk *is* the challenge).  
TACTICAL_PURPOSE: Teach “early open or never.” Distinct from ENC-TREAS-18 (hale / planted-MP cache).  
SOLVABILITY_REQUIREMENTS: Adjacent-open, not a wall. Map solvable if never used.  
REPLAYABILITY: Chest west vs east.  
SCALING_BEHAVIOUR: Rest may offer this instead of PROT-19. Never two chests.  
STATUS: PROPOSED

---

### ENC-OATH-02

ENCOUNTER_ID: ENC-OATH-02  
TYPE: optional challenge / rest insert  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None. `WF-RSK-PAIR_OATH` tile only.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: A paired inlay. Voluntarily ending a turn on it flags this map. If the next `applyRewards` happens while another living unit is Chebyshev ≤ 1 from the player, that credit uses the hard multiplier. If the player is alone at credit, the flag pays nothing extra. Snapshot at credit. Distinct from Close Hour (ended Chebyshev ≤ 1 from a hostile at least once this map), Far Hour (never end adjacent), Isolation Chill, Crowd Press, Pair Font (heal while paired), and ENC-OATH-01 (queued day-4 stillness wager).  
SPECIAL_RULES: Optional floor tile. Map is solvable if never used. Pair check is Chebyshev ≤ 1 from any other living combatant at the `applyRewards` enqueue. Multiplier on the next enqueue only. Death still uses `saveBattleStats`.  
OBJECTIVE: Flag a fight you will cash out next to a body, or stay unflagged and finish alone.  
FAILURE_CONDITION: None. Skipping is legal.  
REWARD: Hard multiplier on the next `applyRewards` if paired at credit. No overlay.  
TACTICAL_PURPOSE: Opt-in purse that wants a **pair at credit**, not hale-HP (ENC-HALE-02) and not leftover-sum.  
SOLVABILITY_REQUIREMENTS: Optional. Not on spawn or a portal.  
REPLAYABILITY: Tile N vs E of spawn.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, shrine can show this next to Ready Hour.  
STATUS: PROPOSED

---

### ENC-HOUR-03

ENCOUNTER_ID: ENC-HOUR-03  
TYPE: optional challenge  
RELATIVE_DIFFICULTY: MID (opt-in)  
ENEMY_COMPOSITION: None. `WF-EVT-READY_HOUR` overlay.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: This map only: if the player ended at least one turn with remaining AP equal to max AP, the next `applyRewards` uses the hard multiplier. Always spending AP before every end-turn leaves rewards unchanged. Inverse of Spent Oath (cash out at 0 remaining AP). Distinct from Steel Hour (skip paid-AP spells for a purse), Empty Font (heal at 0 remaining AP), Vacant Hour (skip summons), Ready Gate (arm an extra portal), and ENC-HOUR-02 (queued day-18 file-hour).  
SPECIAL_RULES: Ready means remaining AP equal to max AP at player end-of-turn. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Honesty: missing remaining-AP = max-AP reader → skip the overlay without claiming Ready Hour.  
OBJECTIVE: Skip AP on at least one end-turn for a hard purse, or spend AP every turn and accept normal rewards.  
FAILURE_CONDITION: None. Leaving is always legal.  
REWARD: Hard multiplier if the ready flag is set. No overlay.  
TACTICAL_PURPOSE: Opt-in purse that wants a **skipped-AP turn**, not planted-MP (ENC-HOUR-02).  
SOLVABILITY_REQUIREMENTS: No blocks.  
REPLAYABILITY: Overlay on/off.  
SCALING_BEHAVIOUR: Rest shrine can enable this after one Score primer clear.  
STATUS: PROPOSED

---

### ENC-REST-19

ENCOUNTER_ID: ENC-REST-19  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional pair-oath / ready-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-20 / ENC-SCORE-01 / ENC-FILE-02 observed Score Mend / File Stride / Hexa Oath, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-READY_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-19. Optional `WF-RSK-PAIR_OATH` tile (flag next room only). Optional `WF-PRT-READY_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player has ended a turn with remaining AP equal to max AP this map; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Pair oath does not start combat. `uiLayout` unchanged. After one full Table P clear, shrine can enable day-19 `rushVariant` flags (`stride_lock`, `dual_levy`, `imprint_mute`, `damp_hex`).  
OBJECTIVE: Choose an exit. Optional: shrine, pair oath, ready gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Pair oath is a modifier flag, not a Doka mint. Ready Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Score-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Ready Gate always in addition to a reachable stable portal. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Ready on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-19

ENCOUNTER_ID: ENC-BRANCH-19  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: score | file | lava | ready` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: score → ENC-SCORE-01 or ENC-SPELL-37, file → ENC-FILE-02 or ENC-SPELL-38, lava → ENC-LAVA-01 or ENC-GATE-06, ready → ENC-READY-01 or ENC-SNAP-03. A sealed fifth door to ENC-RARE-19 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: score | file | lava | ready` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-19 / ENC-BOSS-19). Day-18 `ENC-BRANCH-18` stays tally/rank/spike/odd. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Tally / Rank / Spike / Odd.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Ready File door (ENC-READY-02) can replace File for accounts that already finished File this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Ready Picket (ENC-AMBUSH-19) so lingering unspent (max AP) to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-20

ENCOUNTER_ID: ENC-MINI-20  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (score / leftover-sum-4-unequal adjacent). Branch score: `starved_vampire_pawn`. Branch file: `bone_cavalier`. Branch lava: `crimson_countess`. Branch ready: `midnight_bishop`. Do **not** use `stride_chancellor` / `dual_treasurer` / `imprint_archdeacon` / `damp_provost`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table Q directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (pair-seam / brace-column / one lava gallery / leftover-ready aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Score Hood consume / one extra Score Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-19

ENCOUNTER_ID: ENC-BOSS-19  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Score → `starved_vampire_pawn`; File → `bone_cavalier`; Lava → `crimson_countess`; Ready → `midnight_bishop`. If the chain taught Ready Picket (ENC-AMBUSH-19) **and** File was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table Q ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-20) or ready-file (ENC-READY-02) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Score may inherit 2 pair-seam tiles off the only path; File may inherit room for same-file steps plus a Chebyshev-6 aisle; Lava may inherit one lava gallery (not a sealed pocket); Ready may inherit brace column on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / charge-on-file / lava-blood / curse-reflect).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-19

ENCOUNTER_ID: ENC-MAST-19  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on pair-seam (`WF-HAZ-PAIR_SEAM`). Wave 2: `FSN-SCORE-STEP` **or** `FSN-SCORE-SIP` **or** `FSN-FILE-HEXA` **or** `FSN-LAVA-FILE` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Warder elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 PAIR AI. Wave 3 elite soph 2–3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already granted the primer ids.  
MAP_REQUIREMENTS: Choke between wave 1 and wave 2. Branch device on a **gallery**: score → leftover Dual Keep 2/2 aisle; file → same-file plus Chebyshev-6; lava → lava gallery off the only path; ready → Ready Sill on the short path. `holdPortalLocked` until wave 3 is clear.  
SPECIAL_RULES: Portal locked. Soft-fail skip if a wave cannot place. Honesty: missing the branch writer → ENC-MAST-18 leftover without claiming Score / File / Lava / Ready.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band victory XP + depth Doka. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Exam that stacks teach → reinforce → the named drop-18 PAIR.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4. Branch device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not raise levels. Tighten by Once Cast or Pair Draft, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-71

ENCOUNTER_ID: ENC-RUSH-71  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room Q0 remix: `stride_chancellor` + `lock_marshal` as Table Q `Q0`. Combined mechanic remains: bank leftover walk MP while remaining walks this turn are axis-locked. Compass dest **never** occupies the Scrip. Off-axis walk rejects **before** MP debit so leftover is honest. Pay is next start, not a queue splice. Novice death ≠ victory. Not Purse / Dual / Surplus / Lend / Parched / Stride Censor / March / Sole / Wick / Must.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-FILE-02, a **painted file pip** (visual only) shows axis-lock vs File Stride — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Stride Keep, File Stride, or Dual Keep.  
MAP_REQUIREMENTS: Preferred cells. Compass never on Scrip.  
SPECIAL_RULES: `rushVariant: stride_lock`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table Q room 0 table + tiny bonus if the first off-axis walk was refused (skill).  
TACTICAL_PURPOSE: Add the walk-exam the File primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Compass never on Scrip. Novice death ≠ victory.  
REPLAYABILITY: Scrip N vs S of Compass.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten axis cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-72

ENCOUNTER_ID: ENC-RUSH-72  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room Q1 remix: `dual_treasurer` + `levy_rector` as Table Q `Q1`. Combined mechanic remains: bank **both** leftovers, or spend the next spell into Hex Toll. Tithe-box dest **never** occupies the Bourse. Dual skip if either leftover is 0. Hex Toll is next-cast AP tax, not leftover. Not Purse / Stride / Surplus / Lend / Parched.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SCORE-01 / ENC-UNEQ-01, a **painted leftover pip** (visual only) shows Dual Keep vs Score windows — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Dual Keep, Score Mend, or Hex Toll.  
MAP_REQUIREMENTS: Preferred cells. Tithe-box never on Bourse.  
SPECIAL_RULES: `rushVariant: dual_levy`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table Q room 1 table + tiny bonus if the first Dual Keep was refused by dumping a pool (skill).  
TACTICAL_PURPOSE: Add the leftover-exam the Score primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Tithe-box never on Bourse. Novice death ≠ victory.  
REPLAYABILITY: Bourse N vs S of Tithe-box.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten leftover window, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-73

ENCOUNTER_ID: ENC-RUSH-73  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room Q2 remix: `imprint_archdeacon` + `mute_notary` as Table Q `Q2`. Combined mechanic remains: copy matching remaining CDs **and** last resolved id is illegal 1 turn. Tabula dest **never** occupies the Platen. Imprint is copy, not steal. Last Mute is last-id, not remaining CD. Empty intersection fizzles. Not Dilate / Flush / Cadence Stretch.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SNUFF-01, a **painted last-id pip** (visual only) shows Verse Score vs Last Mute — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Cadence Imprint, Cadence Snuff, or Last Mute.  
MAP_REQUIREMENTS: Preferred cells. Tabula never on Platen.  
SPECIAL_RULES: `rushVariant: imprint_mute`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table Q room 2 table + tiny bonus if the first Imprint intersection was empty on purpose (skill).  
TACTICAL_PURPOSE: Add the cadence-exam the Snuff primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Tabula never on Platen. Strike remains a legal answer while Last Mute is up.  
REPLAYABILITY: Platen N vs S of Tabula.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten copy cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-74

ENCOUNTER_ID: ENC-RUSH-74  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room Q3 remix: `damp_provost` + `hexed_marker` as Table Q `Q3`. Combined mechanic remains: hold leftover walk MP ≥ 2 and eat +10, or spend to leave the Hex. Hex dest **never** occupies the Sump. Damp leftover is walk **MP ≥ 2**, not leftover AP. Hex leave is the spend that can deny the bonus. Not Dry / Parched / Stride / Dual.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SNAP-03 / ENC-SHOCK-01, a **painted leftover-MP pip** (visual only) shows Root dump vs Damp hold — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Damp Sting, Watch Root, or Hex.  
MAP_REQUIREMENTS: Preferred cells. Hex never on Sump.  
SPECIAL_RULES: `rushVariant: damp_hex`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table Q room 3 table + tiny bonus if the first Damp bonus was refused by dumping leftover MP (skill).  
TACTICAL_PURPOSE: Add the leftover-MP exam the Ready / Root primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Hex never on Sump. Strike remains a legal answer.  
REPLAYABILITY: Sump N vs S of Hex.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten leftover-MP window, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain U — “Score Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-19 then ENC-SPELL-37 (or ENC-SPELL-38 if Score Mend already owned) |
| 2 | Reinforce | ENC-WAVE-20 |
| 3 | Combine | ENC-HAZ-37 then ENC-SCORE-01 **or** ENC-UNEQ-01 **or** ENC-FILE-02 |
| 3 insert | Choice | ENC-BRANCH-19 → Score/File/Lava/Ready destinations |
| 4 | Pressure | ENC-SURV-37 **or** ENC-PROT-19 **or** ENC-READY-02 **or** skip via ENC-REST-19 |
| 4 | Mastery | ENC-MAST-19 (branch skin) |
| 5 | Boss | ENC-BOSS-19 |

Rare: 8% on depth 4 to **insert** ENC-RARE-19 before mastery.  
Treasure: rest may offer ENC-TREAS-19 instead of PROT-19.  
Lava side-story: replace combine with ENC-LAVA-01 and mini-boss ENC-MINI-20; capstone may become `crimson_countess` if Lava was the door.

### Chain V — “Ready Primer” (maxDepth 4)

ENC-COLUMN-01 → ENC-READY-01 → ENC-PAD-02 → ENC-REST-19 → ENC-BOSS-19 (`midnight_bishop` only if Ready was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-COLUMN-01 as teach on accounts that already know pair-seam / leftover-sum-4-unequal.

### Rush injection (day-19)

After one full Table P clear, ENC-REST-19 shrine can enable: Q0 → ENC-RUSH-71, Q1 → ENC-RUSH-72, Q2 → ENC-RUSH-73, Q3 → ENC-RUSH-74. Day-1…day-18 flags for rooms 0–9 and Tables B–P remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-19, ENC-SPELL-37, ENC-SPELL-38 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-37, ENC-SHOCK-01, ENC-PAD-02, ENC-SKEW-01 | `under_50_damage` |
| ENC-HAZ-38, ENC-WAVE-20 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-19, ENC-MAST-19, ENC-COLUMN-01, ENC-LAVA-01 | `direct_hit` |
| ENC-SCORE-01, ENC-UNEQ-01, ENC-ELITE-36, ENC-ELITE-37, ENC-FILE-02, ENC-SNAP-03, ENC-READY-02, ENC-HOLD-08 | `under_8_ap_per_turn` |
| ENC-SURV-37 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-19 / ENC-REST-19 bank / ENC-OATH-02 / ENC-HOUR-03 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `pair_seam` or 1 busy cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | pair-seam **or** skew plate | kill + optional glyph |
| MID | named drop-18 `FSN-*` or waves | backline guard | zone 1 + Score Mend / File Stride | one `WF-*` | clock / tags / gate |
| HIGH | elite or ready file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / lava / leftover-sum-4-unequal miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush Q0–Q3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit pair-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Pair Oath / Ready Hour / Round Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-18 fields plus:

```
encounterId
encounterType        // + score_step | score_sip | file_hexa | lava_file |
                     //   score_gate | strike_dry | shock_even | watch_odd |
                     //   score_choir | lean_rise | score_quiet | duel_score |
                     //   snuff_verse | still_brace | purse_score | score_hold |
                     //   pair_seam | busy_cinder | skew_plate | brace_column |
                     //   ready_sill | pair_font | skew_step | ready_file |
                     //   ready_picket | round_cache | ready_tutor | pair_oath |
                     //   once_cast | ready_hour | pair_draft
formationId?         // FSN-SCORE-STEP | FSN-SCORE-SIP | FSN-FILE-HEXA |
                     // FSN-LAVA-FILE | FSN-SCORE-GATE | FSN-STRIKE-DRY |
                     // FSN-SHOCK-EVEN | FSN-WATCH-ODD | FSN-SCORE-CHOIR |
                     // FSN-LEAN-RISE | FSN-SCORE-QUIET | FSN-DUEL-SCORE |
                     // FSN-SNUFF-VERSE | FSN-STILL-BRACE | FSN-PURSE-SCORE |
                     // FSN-SCORE-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // score | file | lava | ready
pairSeamCells? / busyCinderCell? / skewPlateCell?
braceColumnCell? / readySillCell? / pairFontCell?
skewStepPads? / onceCastArmed? / readyPicketArmed?
pairDraftArmed? / readyHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_pair_font | open_ready | drink_pair |
                     //   tag_ready | choose_device | ready_file | brace_column
failureKind
deviceTable[]        // ENC-TREAS-19
rushVariant?         // stride_lock | dual_levy | imprint_mute | damp_hex
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Ready Picket” logic — use `formationId` / `readyPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-26 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-18 families (Stave / Dock / Dodeca / Hymn, …) or Wave-19 spell unique CORE — those wait on same-day / later catalogs. This catalog consumes drop-18 **formations** that can stand on Wave-17 kits.
- Faking Score Mend without leftover-sum===4 unequal on both bodies, Score Sting as Tally/Tied, File Stride as Rank / Orth, Lava Reel as Spike Reel, Score Post walk-on as a detonate, Shock Skip as a required player hop, Dry Plate as a leftover-MP≥1 miss, Watch Root as Watch Bank or Watch Sip, Lean Gift as Tally / Poise / Equal, Duel Turn as Purse Turn, Score Hold as Tally Hold, Brace Column as Slit, Ready as Hale, Skew Step as File Step, Pair Font as Plant Font, Ready Picket as Plant Picket, Ready Tutor as Plant Tutor, Pair Draft as Stride Draft, Ready File as Mute File, Ready Gate in a dungeon, Hendeca Plug while cap is 2.
- Packing Cadence Rise with Cadence Snuff. Packing File Stride with File Bite. Packing Score Hold with Must Score as a two-body PAIR. Packing Score Mend with Tally / Poise / Gaunt menders.
- Consuming same-day 2026-10-27 Wave 19 family / spell / world catalogs.

---

## 10. Pick order (day-19, after days 1–18 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–18 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-19 + ENC-SPELL-37 (pair-seam / score-mend verbs)  
2. ENC-WAVE-20 (`formationId` SCORE-STEP → SCORE-SIP)  
3. ENC-SCORE-01 or ENC-UNEQ-01 or ENC-FILE-02 (new pressure objects)  
4. ENC-BRANCH-19 (`branch: score|file|lava|ready` snapshot-before-cleanup)  
5. ENC-BOSS-19 branch read  
6. Rush Table Q variants 71–74 one room at a time (after the account has one full Table P clear)

Uniqueness: this file is the **nineteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
