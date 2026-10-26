# Encounter Evolution Catalog — 2026-10-26

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-26-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957), `ENCOUNTER_EVOLUTION_2026-10-24.md` (`EED-2026-10-24-001`, PR #1006), `ENCOUNTER_EVOLUTION_2026-10-25.md` (`EED-2026-10-25-001`, PR #1056). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-17 Wave 16 packs `docs/design/ENEMY_FORMATIONS_2026-10-25.md` (PR #1075), Wave 17 world features in `docs/WORLD_DYNAMICS.md` (PR #1064, `WDD-2026-10-25-001`), Rush Table P `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.15 (PR #1080). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-26) Wave 18 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 17 **families** (`score_mender`, `file_warder`, `hexa_oather`, `lava_reeler`, `strike_marker`, `shock_skipper`, `even_stinger`, `lean_gifter`, `cadence_snuffer`, `hendeca_prelate`, … — PR #1073) wait for a later formation drop (drop 18). Wave 18 **bosses** stay Rush-only (Table P). Wave 16 **families** (`tally_mender`, `tally_stinger`, `tally_stepper`, `tally_sipper`, `tally_siller`, `tally_holder`, `tally_lender`, `tally_prelate`, `tally_bouncer`, `tally_hooder`, `must_tallier`, `verse_tallier`, `rank_warder`, `penta_oather`, `spike_reeler`, `screen_biter`, `swap_marker`, `odd_plater`, `mire_skipper`, `odd_stinger`, `summon_verser`, `equal_gifter`, `cast_toller`, `brick_stepper`, `watch_banker`, `tied_gaiter`, `portal_cutter`, `shove_gifter`, `cadence_primer`, `purse_turner`, `dec_prelate`) are legal **metadata locks** on drop-17 sheets, not a 30% lottery.

---

## 1. Why an eighteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–17 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, Dry/Lean/Odd, Gaunt/Even/Brick/Orth, and Poise/Knight/Pit/Spent. Day-17 rooms spent leftover drop-16 packs (`FSN-POISE-STEP`, `FSN-POISE-SIP`, `FSN-KNIGHT-QUAD`, …) and Wave 16 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-17 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-17 Wave 16 packs | Day-17 taught leftover **AP === MP ≥ 1** / leftover-AP miss / L-step as **rooms**. Still PDFs: `FSN-TALLY-STEP`, `FSN-TALLY-SIP`, `FSN-RANK-PENTA`, `FSN-SPIKE-SCREEN`, `FSN-TALLY-GATE`, `FSN-ODD-COURT`, `FSN-MIRE-FILE`, `FSN-WATCH-BANK`, `FSN-TALLY-CHOIR`, `FSN-EQUAL-SHOVE`, `FSN-TALLY-QUIET`, `FSN-PURSE-TALLY`, `FSN-TIED-PORTAL`, `FSN-PRIME-TAX`, `FSN-SWAP-BRICK`, `FSN-TALLY-HOLD` |
| World-feature Wave 17 | Day-17 **rooms** never spent `WF-HAZ-HALE_SEAM`, `WF-HAZ-CAST_CINDER`, `WF-TRP-HEFT_PLATE`, `WF-TER-SLIT_WALL`, `WF-OBS-HALE_SILL`, `WF-ZON-PLANT_FONT`, `WF-TEL-FILE_STEP`, `WF-INV-MUTE_FILE`, `WF-ELT-PLANT_PICKET`, `WF-TRS-PLANT_CACHE`, `WF-SPL-PLANT_TUTOR`, `WF-RSK-HALE_OATH`, `WF-MOD-WALK_LOCK`, `WF-EVT-FILE_HOUR`, `WF-ENV-STRIDE_DRAFT` |
| Rush Table P | `P0`–`P3` (`slide_porter`+`peel_friar`, `both_capitular`+`lord_of_static`, `heave_kitchener`+`mill_seneschal`, `parched_preacher`+`dry_nuncio`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `haleSeamCells` / `castCinderCell` / `heftPlateCell` / `slitWallCell` / `haleSillCell` / `plantFontCell` / `fileStepPads` / `walkLockArmed` / `plantPicketArmed` / `strideDraftArmed` / `fileHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post / Poise Post / Tally Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8**. Nine Plug (`nine_prelate`, `FSN-POISE-HOLD/NINE`) counts as **9**. Dec Plug (`dec_prelate`, `FSN-TALLY-HOLD/DEC`) counts as **10** — wait for remaining cap ≥ 10 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Tally / Equal Gift / Shove Gift / Poise / Hollow Gift / Drift Gift / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Tally Mend / Equal Gift / Shove Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Poise Mend as Tally Mend (Poise is **both leftover AP === MP ≥ 1**; Tally is **both leftover AP + leftover MP === 3**). Do **not** clone Gaunt Mend as Tally Mend (Gaunt is **both leftover 0**). Do **not** clone Equal Gift as Tally Mend (Equal Gift is **target-only** tied ≥ 1). Do **not** clone Purse Turn as Bar Cross (Purse Turn is **one** hostile invert; Bar Cross is two-body **cross**). Do **not** clone Watch Bank as Watch Sip (Bank **grants a leftover-AP bank**; Sip **steals**).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-NEAR_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant / Vow / Stride). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-FILE_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-18 ids (`slide_porter`, `both_capitular`, `heave_kitchener`, `parched_preacher`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / Gaunt Step / Poise Step / **Tally Step** / Brick Step **does not** count as leftover walk-MP for Tally Mend, Tally Sting, Tally Sip, Tally Sill, Tally Post, Must Tally, Verse Tally, Tally Hold, Odd Plate, Odd Sting, or Pair Gait. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Tally Step dests are occupancy, **not** `isSwap`. Brick Step dests are occupancy through an adjacent barrier, **not** Brick Nudge and **not** `isSwap`.
- Tally Mend pays 8 only if **caster and target** leftover AP + leftover MP **=== 3** after the 3 AP is paid. One broken sum on one body is 0 HP. Dual Keep leftover **opens** Tally on (2,1) / (1,2) / (3,0) / (0,3) and **closes** Poise (2/2 and 1/1) and Gaunt / Hollow Gift (0/0). `0 = 0` is Gaunt’s window, not this primer. `2 = 2` is Poise’s window, not this primer. Tally Step relocates onto a free Chebyshev-1 of an ally whose leftover AP + leftover MP === 3 — not Poise / Gaunt / Parched / Home / Heave / Ally Step. Tally Sting is 10, +8 iff leftover AP + leftover MP === 3. Tally Sip steals 1 leftover AP iff leftover sum === 3 **and leftover AP ≥ 1** ((0,3) fizzles). Rank Stride makes the **next** walk dest share the **rank** (`dest.y == y_at_arm`). Penta Oath wants the next spell at Chebyshev **exactly 5**; Strike stays legal. Spike Reel is the **ninth** `applyAttract` dest (file / ally / foe / paint / hazard / void / barrier / pit / then **spike occupancy**). Dest is **toward**, not onto, a world portal. Screen Bite bonuses a target whose Bresenham is **blocked** (Dummy Post is not cover). Swap Mark detonates on **teleport landing**; walk / push / pull / slide are free. Tally Post detonates on end-turn occupy **and leftover AP + leftover MP === 3**; walk-on is safe; dump a pool is safe; Dual Keep 2/2 is safe. Tally Sill taxes start-turn occupy **and leftover sum === 3**; paint stays. Mire Skip is next **1-tile** walk treating **mire enter-tax** as floor; lava / spikes / pits / rime / glyph / cinder still tick. Odd Plate zeros the next hit **while leftover AP is odd**; leftover AP even at impact **lands** and charge **stays**. Watch Bank: overwatch snap **banks** the walker’s leftover AP +1 (inverse of Watch Sip’s steal). Equal Gift heals iff the **target** leftover AP === leftover MP ≥ 1; caster leftover unread. Shove Gift heals iff **this caster** force-moved the target. Purse Turn inverts **one** hostile leftover AP↔MP (equal leftover is a no-op). Verse Tally makes the last id illegal until leftover sum === 3. Must Tally makes remaining **non-Strike** spells illegal unless leftover sum === 3 **and** last AP. Tally Hold refuses walk MP until leftover sum === 3; spells stay legal. Cadence Prime writes remaining `n===0` → `1`. Cast Toll is Struck-last-turn next-**spell** +1 AP. Brick Step relocates **through** an adjacent barrier — skip if dest occupied / hazard / portal or if `findPath` after the hypothetical relocate would not reach an exit. Tied Gait is leftover AP **and** leftover MP **exactly 2**. Portal Cut bonuses a target Chebyshev ≤ 2 from a **world portal** (Twin Gate pads do not count).
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 16 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-TALLY-01 / ENC-SPELL-35 / ENC-ELITE-34 (mend skin) | leftover AP + leftover MP **=== 3** on **both** bodies **or** occupancy dest for Tally Step | Convert to ENC-POISE-01 (queued day-17) without claiming Tally Mend |
| ENC-SUM-01 / ENC-ELITE-34 (sting skin) | leftover-sum===3 poke **or** leftover-sum leftover-AP steal ((0,3) fizzles) | Convert to ENC-TIED-01 (queued day-17) without claiming Tally / Sum |
| ENC-RANK-01 / ENC-SPELL-36 | next-walk dest shares rank **or** next-spell exact Chebyshev 5 | Convert to ENC-KNIGHT-01 or ENC-TRI-01 (queued day-16/17) without claiming Rank / Penta |
| ENC-SPIKE-02 | ninth `applyAttract` dest (spike occupancy) **or** Bresenham-blocked bite | Convert to ENC-PIT-02 (queued day-17) without claiming Spike Reel |
| ENC-GATE-05 | leftover-sum===3 occupy detonate **and** walk-on 0 **or** `summonAI === "tallypost"` | Convert to ENC-GATE-04 (queued day-17) without claiming Tally Gate |
| ENC-ODD-03 | leftover-AP-odd miss **or** leftover-AP-odd poke | Convert to ENC-SPENT-02 (queued day-17) without claiming Odd Plate |
| ENC-MIRE-01 | 1-tile mire-tax-as-floor | Convert to ENC-RIME-02 (queued day-17) without claiming Mire Skip |
| ENC-SNAP-02 | overwatch snap **banks** walker leftover AP | Convert to ENC-SNAP-01 (queued day-17) without claiming Watch Bank |
| ENC-EQUAL-01 | target leftover-tied ≥ 1 heal **or** caster-authored `forcedMovedThisTurn` | Convert to ENC-HOLLOW-01 or ENC-SHUNT-01 (queued day-17) without claiming Equal / Shove Gift |
| ENC-TURN-01 | one-hostile leftover AP↔MP invert **or** Dual Keep leftover as leftover | Convert to ENC-CROSS-01 leftover without claiming Purse Turn |
| ENC-PEEK-01 | teleport-landing consume **or** through-barrier dest occupancy | Convert to ENC-SHUNT-01 (queued day-17) without claiming Swap Mark / Brick Step |
| ENC-HOLD-07 / ENC-RARE-18 | walk refuse until leftover sum === 3 **or** tools-until leftover-sum===3 **and** last AP | Convert to ENC-HOLD-06 (queued day-17) without claiming Tally Hold |
| ENC-PRIME-01 / ENC-DEBT-03 | remaining `n===0` → `1` **or** Struck-last-turn next-spell +1 AP | Convert to ENC-DEBT-02 (queued day-17) without claiming Prime / Cast Toll |
| ENC-TIED-02 / ENC-PORT-01 | leftover AP **and** leftover MP exactly 2 **or** world-portal Chebyshev ≤ 2 bite | Convert to ENC-LONE-03 (queued day-17) without claiming Tied Gait / Portal Cut |
| ENC-QUIET-02 | leftover-sum join + leftover-sum heal + cover | Convert to ENC-TALLY-01 leftover without claiming Quiet |
| ENC-SLIT-01 | walk-block LoS-slit **or** 1-AP adjacent 90° rotate | Convert to ENC-SLAB-01 (queued day-17) without claiming Slit Wall |
| ENC-HALE-01 | wall→floor after player end-turn with current HP ≥ 80% of max | Convert to ENC-HURT-01 (queued day-17) without claiming Hale |
| ENC-HEFT-01 | occupancy-walk onto plate is free; first **forced** landing taxes | Convert to ENC-LEAVE-01 (queued day-17) without claiming Heft |
| ENC-PAD-01 | pad swap only if traveler shares a row or column with a living hostile | Convert to ENC-SPARE-01 (queued day-17) without claiming File Step |
| ENC-PROT-18 | Plant Font heal only if remaining MP is 0 | Convert to ENC-PROT-17 (queued day-17, Hurt) without claiming Plant |
| ENC-PRIO-20 | one-cast if the player ends a turn at remaining MP 0 while they live | Convert to ENC-PRIO-19 (queued day-17) without claiming Plant Tutor |
| ENC-AMBUSH-18 | elite appears only while remaining MP is 0 | Convert to ENC-AMBUSH-17 (queued day-17, off-axis) without claiming Plant |
| ENC-SURV-35 | end-of-turn tax if remaining MP ≥ 1 | Convert to ENC-SURV-33 (queued day-17) without claiming Stride Draft |
| ENC-MUTE-02 | first elite cannot spend `SpellConfig` until second dies **or** player ends adjacent | Convert to ENC-GUARD-01 (queued day-17) without claiming Mute File |
| ENC-TEACH-18 / ENC-HAZ-36 | hale (≥50% HP) seam tax **or** walk-then-no-spell lock | Convert to ENC-TEACH-17 / ENC-HAZ-34 (queued day-17) without claiming Hale / Walk Lock |
| ENC-HAZ-35 | orb hunts last `SpellConfig` spender | Convert to ENC-HAZ-33 (queued day-17) without claiming Cast Cinder |
| ENC-RUSH-67…70 | Table P bosses + Litter/Gaiter/Spit/Flagon objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Tally / Rank / Spike / Odd primer + inserts)

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

| Beat | Depth hint | Job | Day-18 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (hale-seam hop, leftover-sum heal, cast cinder) | ENC-TEACH-18, ENC-SPELL-35, ENC-HAZ-35 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-19, ENC-AMBUSH-18, ENC-SPELL-36 |
| Combine | 2–3 | Two taught verbs | ENC-TALLY-01, ENC-SUM-01, ENC-RANK-01, ENC-HAZ-36, ENC-SLIT-01, ENC-GATE-05 |
| Pressure | 3 | Clock, stride draft, pull-to-spike, or leftover-sum miss | ENC-SURV-35, ENC-PROT-18, ENC-SPIKE-02, ENC-SNAP-02, ENC-PRIO-20, ENC-MUTE-02 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-18, ENC-BRANCH-18, ENC-TREAS-18, ENC-HALE-02, ENC-HOUR-02, ENC-PAD-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-34, ENC-ELITE-35, ENC-RARE-18, ENC-MAST-18, ENC-ODD-03, ENC-MIRE-01, ENC-DEBT-03, ENC-HOLD-07 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-19, ENC-BOSS-18, ENC-RUSH-67…70 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–17 remain valid. Day-18 **Tally / Rank / Spike / Odd primer** is the default for accounts that already cleared Poise / Knight / Pit / Spent once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-18

ENCOUNTER_ID: ENC-TEACH-18  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a hale-HP path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile pale gold-slate ribbon of `WF-HAZ-HALE_SEAM` across the mid-band (walk tiles cost 4% max HP **only if current HP is at least 50% of max**; wounded steps are free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First hale-step tax logs a teach line. Do not also apply Spent Seam (ENC-TEACH-17: tax on **0 remaining AP**), Last Seam (ENC-TEACH-16: tax on **0 remaining MP**), Even Seam (ENC-TEACH-15: tax on **even rounds**), Odd Seam (ENC-TEACH-14: tax on **odd**), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: take a wound first so the ribbon is free floor, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is a tax while you are hale, free floor once you are already wounded; stopping healthy is the expensive answer, not a bigger nuke.” Inverse of ENC-HURT-01’s below-50% open. Prepares ENC-HAZ-36 / ENC-TREAS-18 (hale / planted-MP devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-CAST_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-35`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-35

ENCOUNTER_ID: ENC-HAZ-35  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a caster body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-CAST_CINDER` on a mid-court floor cell (at round start steps one tile toward the last unit that spent a `SpellConfig` this round; if nobody cast, it sits still; 5% max HP on land). Inverse of Lean Cinder (ENC-HAZ-33: hunts the **fewest remaining AP**). Distinct from Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Hurt Cinder (lowest HP%), Rich Cinder (highest HP%), and Orbiting Cinder (clockwise square). Attack Nearest and summon kits do not pull it. A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: Attack Nearest so it does not advance, or bait it onto an enemy caster.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts the last **spell** spender, not the spent-AP body.” Distinct from ENC-HAZ-33 (lean / fewest remaining AP).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: bishop starts having just Frosted so the orb prefers the player until you skip a cast. High: inherit one hale-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-36

ENCOUNTER_ID: ENC-HAZ-36  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. After either spends MP on an occupancy-walk, further `SpellConfig` spends are illegal this turn if `WF-MOD-WALK_LOCK` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-18 hale-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-18`) **plus** `WF-MOD-WALK_LOCK` armed (after a unit spends MP on an occupancy-walk this turn, further `SpellConfig` spends are illegal; leftover AP may still pay Attack Nearest). A dry detour exists. Inverse of Cast Lock (ENC-HAZ-34: after a spell, no walks). Distinct from Act Lock (ENC-HAZ-32: after **any** AP spend), File Walk (committed facing after the first step), and One Stride (at most 1 MP).  
SPECIAL_RULES: Scripted hazards only. Walk Lock does not rewrite damage. Attack Nearest is not a spell. Teleport tiles are not walks.  
OBJECTIVE: Clear all. Intended: cast first, then walk; take a wound so the hale ribbon is free, or walk the dry detour.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine hale-HP tax with a walk-then-no-spell lock so “dash across then Frost” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Cast-then-walk remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Tally Sting. Peak: add `WF-ENV-STRIDE_DRAFT` so ending with leftover MP is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-35

ENCOUNTER_ID: ENC-SPELL-35  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-TALLY-STEP/SOLO-MEND` fallback — 1× `tally_mender` queen (`spell-tally-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Tally Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Tally-Mends only if **caster and target** leftover AP + leftover MP === 3 **and** missing HP ≥ 8; else Shields. Dual Keep 2/2 is **Poise, skip**. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tally Mend (8 paid on four leftover-sum===3 flags) can drop `spell-tally-mend` if missing. Do **not** grant `spell-poise-mend`, Gaunt Mend, or Equal Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-tally-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Tally Mend, convert to ENC-TALLY-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-sum writer → ENC-SPELL-33 leftover without claiming Tally. Band 0 → show `FSN-POISE-STEP`. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-tally-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “four leftover-sum===3 flags cash 8; one broken sum on one body is 0 HP.” Distinct from ENC-SPELL-33 (leftover-**tied ≥ 1**).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Tally Step on a second queen (promote to ENC-TALLY-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-36

ENCOUNTER_ID: ENC-SPELL-36  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-RANK-PENTA/SOLO-STRIDE` fallback — 1× `rank_warder` pawn or knight (`spell-rank-stride` + `physical_attack`) + 1× bishop (`starter-frost` only). Penta Oath off until band 1 honesty.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal same-rank floor. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Rank Stride (same-rank dest lock) can drop `spell-rank-stride` if missing. If already owned, glyph is `starter-frost`. Extra room `rank_gallery` is **not** this family.  
MAP_REQUIREMENTS: Open court with room to stand at same-rank dests. Optional glyph (`discoverSpellId: spell-rank-stride`).  
SPECIAL_RULES: If the player already owns Rank Stride, convert to ENC-RANK-01. Honesty: missing same-rank dest filter → ENC-SPELL-34 leftover without claiming Rank. Band 0 → show `FSN-KNIGHT-QUAD`. File-changing walks are illegal. Stand / Swap / forced-move still answer.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: stand, Swap, or take a legal same-rank step.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-rank-stride`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the next walk stays on this rank, not an L and not a file change.” Distinct from ENC-SPELL-34 (L-step + exact-4).  
SOLVABILITY_REQUIREMENTS: At least one legal same-rank floor dest from the player’s start. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Penta Oath (promote to ENC-RANK-01). Never pack Knight Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-TALLY-01

ENCOUNTER_ID: ENC-TALLY-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TALLY-STEP` — 1× `tally_mender` queen (`spell-tally-mend` + `starter-shield`) + 1× `tally_stepper` queen without heal (`spell-tally-step` + `physical_attack`). No Poise / Gaunt / Hollow / Dry / Still / Heave / Both / Bar / Gift / Equal Mend on PAIR. No Poise / Gaunt / Parched / Home / Heave / Ally Step / Cover on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if leftover sum ≠ 3. Stepper protector; skip if ally leftover sum ≠ 3 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tally Mend or a legal Tally Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Tally Mend: 8 HP iff **caster and target** leftover AP + leftover MP === 3. One broken sum is 0 HP. Tally Step is not ungated Home Step and not Poise Step. Band 0 → show `FSN-POISE-STEP`. Honesty reroll → ENC-POISE-01. Dual Keep leftover **is** leftover. `0 = 0` does **not** fire. `2 = 2` does **not** fire.  
OBJECTIVE: Defeat both. Intended: spend 1 leftover AP **or** 1 leftover MP on one body so the sum leaves 3; occupy every Chebyshev-1 of the Mender.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag leftover-sum===3 healer + four-flag joiner. Distinct from ENC-POISE-01 (leftover-**tied ≥ 1**) and ENC-GAUNT-01 (leftover-**both 0**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-TALLY-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-TALLY-QUIET` (add cover). Peak: inherit one hale-seam gallery. Never `titans_vigor`. Never pack Poise Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-SUM-01

ENCOUNTER_ID: ENC-SUM-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TALLY-SIP` — 1× `tally_stinger` pawn (`spell-tally-sting` + `physical_attack`) + 1× `tally_sipper` pawn without heal (`spell-tally-sip` + `physical_attack`). No Poise / Gaunt / Dry / Lean / Full / Odd Sting on PAIR. No Poise / Bare / Watch Sip on PAIR.  
AI_REQUIREMENTS: Stinger commits on leftover sum === 3; skip rider if sum ≠ 3 unless 10 still kills. Sipper skips if leftover sum ≠ 3 **or** leftover AP = 0. Dual Keep (2,1) / (1,2) / (3,0) **opens** the 8; (0,3) fizzles the sip. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tally Sting or a legal Tally Sip can drop that id if missing.  
MAP_REQUIREMENTS: `openField`. A dry aisle so Dual Keep 2/2 is a legal plant that **closes** this PAIR.  
SPECIAL_RULES: Family lottery **off**. Tally Sting: 10 + 8 iff leftover sum === 3. Tally Sip: steal 1 leftover AP iff leftover sum === 3 and leftover AP ≥ 1. Band 0 → show `FSN-POISE-SIP`. Honesty reroll → ENC-TIED-01.  
OBJECTIVE: Defeat both. Intended: Dual Keep 2/2 (Poise window) **or** dump both pools to 0 (Gaunt window) so the sum leaves 3.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-sum discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum poke + leftover-sum leftover-AP steal. Distinct from ENC-TIED-01 (leftover-**tied ≥ 1** poke).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Sip never stacks past −1 leftover AP.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-TALLY-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: promote to `FSN-PURSE-TALLY` (add invert). Never pack Poise Sting on this PAIR.  
STATUS: PROPOSED

---

### ENC-RANK-01

ENCOUNTER_ID: ENC-RANK-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-RANK-PENTA` — 1× `rank_warder` knight (`spell-rank-stride` + `physical_attack`) + 1× `penta_oather` bishop (`spell-penta-oath` + `starter-frost`). No Knight / Orth / Diag / Inch Warder on PAIR. No Quad / Tri / Mid / Long Oather on PAIR. Extra rooms `rank_gallery` / `penta_nave` are **not** these families.  
AI_REQUIREMENTS: Warder skips if the player has 0 MP or no legal same-rank floor. Oather skips if they have no ranged id. Strike stays legal. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Rank Stride or Penta Oath can drop that id if missing.  
MAP_REQUIREMENTS: Open court with a legal same-rank floor dest **and** a tile at Chebyshev 5. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Next walk dest shares rank. Next spell exact Chebyshev 5. Blink does not pay. Band 0 → show `FSN-KNIGHT-QUAD`. Honesty reroll → ENC-KNIGHT-01.  
OBJECTIVE: Defeat both. Intended: stand, Swap, take a legal same-rank step, or Strike from Chebyshev ≠ 5.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + rank/penta discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Same-rank walk lock + exact-5 spell oath. Distinct from ENC-KNIGHT-01 (L-step + exact-4).  
SOLVABILITY_REQUIREMENTS: At least one legal same-rank floor dest and one Chebyshev-5 tile. Two walk-offs that are stand / Swap.  
REPLAYABILITY: Warder north rank vs east rank.  
SCALING_BEHAVIOUR: High: inherit hale-seam on a **file** (off-rank is free). Never pack Knight Stride on this PAIR.  
STATUS: PROPOSED

---

### ENC-SPIKE-02

ENCOUNTER_ID: ENC-SPIKE-02  
TYPE: hazard / elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SPIKE-SCREEN` — 1× `spike_reeler` bishop (`spell-spike-reel` + `starter-frost`) + 1× `screen_biter` knight (`spell-screen-bite` + `physical_attack`). No Pit / Brick / Void / Cinder / Paint Reeler on PAIR. No Axis / Foe / Side / Lone Biter on PAIR. Extra room `spike_aisle` is **not** this family. ENC-SPIKE-01 remains queued day-14 (1-tile spike **skip**).  
AI_REQUIREMENTS: Reeler skips if no spike occupancy in 6. Dest is **toward**, not onto; ninth `applyAttract` flavor. Biter skips rider if Bresenham is clear unless 10 still kills. Dummy Post is not cover. Hostiles start ≥ 4 apart. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Spike Reel or Screen Bite can drop that id if missing.  
MAP_REQUIREMENTS: One painted spike occupancy in 6 of the Reeler, never on spawn±3 or the portal. A walk-off that is **not** the spike cell **and not** a world portal. Optional slit wall on a **gallery** is not this sheet’s cover (Dummy Post is not cover either).  
SPECIAL_RULES: Family lottery **off**. Dest never a world portal. Honesty reroll → ENC-PIT-02. Band 0 → show `FSN-PIT-AXIS`.  
OBJECTIVE: Defeat both. Intended: stand so the pull is toward a dry tile; do not give the biter a blocked Bresenham.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + spike/screen discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pull toward spike occupancy + Bresenham-blocked bite. Distinct from ENC-PIT-02 (pull toward **pit** + caster-axis bite) and ENC-SPIKE-01 (1-tile spike skip).  
SOLVABILITY_REQUIREMENTS: Spike in 6. Pull dest leaves a walk-off. Never a sealed pocket.  
REPLAYABILITY: Spike west vs east gallery.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on the **approach**, never on the spike cell. Never two reels.  
STATUS: PROPOSED

---

### ENC-GATE-05

ENCOUNTER_ID: ENC-GATE-05  
TYPE: protection-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TALLY-GATE` — 1× `tally_prelate` pawn (`spell-tally-post` + `physical_attack`, `summonAI: "tallypost"`) + 1× `tally_siller` rook (`spell-tally-sill` + `starter-frost`). No Poise / Gaunt / Dummy / Drift / Lean Prelate on PAIR. No Poise / Gaunt / Wake / Shove Siller on PAIR. Counts as **1** post.  
AI_REQUIREMENTS: Prelate is summoner for tallypost only; skip if plant cell blocked. Siller skips if occupant leftover sum already ≠ 3. Walk-on the post is **safe**. Dump a pool is **safe**. Dual Keep 2/2 is **safe**. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tally Post or Tally Sill can drop that id if missing.  
MAP_REQUIREMENTS: Two different tiles: post plant and sill paint. Never on spawn±3 or the portal. Exit reachable without occupying either.  
SPECIAL_RULES: Family lottery **off**. End-turn leftover-sum===3 occupy detonates. Start-turn leftover-sum===3 occupy on the sill takes 8; paint stays. Honesty: missing `summonAI === "tallypost"` → ENC-GATE-04. Band 0 → show `FSN-POISE-GATE`.  
OBJECTIVE: Defeat both. Intended: walk onto the post with leftover sum ≠ 3; dump a pool before end-turn; Dual Keep 2/2.  
FAILURE_CONDITION: Player death. Post death is a win condition for that body, not a map fail.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum===3 post + start-turn leftover-sum===3 sill. Distinct from ENC-GATE-04 (leftover-**tied ≥ 1** occupy).  
SOLVABILITY_REQUIREMENTS: Two different tiles. Remaining cap ≥ 1. Player keeps ≥ 1 walk-off that is not the post.  
REPLAYABILITY: Post north vs east.  
SCALING_BEHAVIOUR: High: inherit hale-seam on a **gallery**, never on the post. Never Dec Plug.  
STATUS: PROPOSED

---

### ENC-ODD-03

ENCOUNTER_ID: ENC-ODD-03  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-ODD-COURT` — 1× `odd_plater` rook (`spell-odd-plate` + `starter-shield`) + 1× bishop (`starter-frost` only). `/STING` (`odd_stinger`) is the 3-body, never Plate+Sting as PAIR. No Spent / Gait / Own / Off Plater on PAIR. ENC-ODD-01 remains queued day-10 (odd-round picket). ENC-ODD-02 remains queued day-15 (odd-Chebyshev miss).  
AI_REQUIREMENTS: Plater skips if leftover AP already even. Leftover AP odd miss; leftover AP even at impact **lands** and charge **stays**. Bishop kites. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Odd Plate can drop `spell-odd-plate` if missing.  
MAP_REQUIREMENTS: Open court. A Dual Keep 2/2 plant is legal (even leftover **lands**).  
SPECIAL_RULES: Family lottery **off**. Never Plate+Sting as PAIR. Band 0 → show `FSN-SPENT-FULL`. Honesty reroll → ENC-SPENT-02.  
OBJECTIVE: Defeat both. Intended: spend 1 leftover AP so leftover AP is even at impact.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + odd-plate discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-AP-odd miss + absorb plate. Distinct from ENC-SPENT-02 (leftover-AP ≥ 1 miss).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Even leftover is a legal Strike.  
REPLAYABILITY: Plater west vs east. High band may promote to `/STING` as a **third** body only.  
SCALING_BEHAVIOUR: High: add `odd_stinger` as the 3-body (`FSN-ODD-COURT/STING`). Never two plates.  
STATUS: PROPOSED

---

### ENC-MIRE-01

ENCOUNTER_ID: ENC-MIRE-01  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-MIRE-FILE` — 1× `mire_skipper` knight (`spell-mire-skip` + `physical_attack`) + 1× bishop (`starter-frost` only). No Rime / Glyph / Cinder / Spike / Lava / Pit Skipper on PAIR. Extra room `mire_nave` is **not** this family.  
AI_REQUIREMENTS: Skipper skips if the next walk is not a 1-step across mire. Length ≥ 2 pays. Bishop kites. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mire Skip can drop `spell-mire-skip` if missing.  
MAP_REQUIREMENTS: One painted mire enter-tax cell **or** a legal flank paint. One clean aisle. Never on spawn±3 or the portal. Rime / lava / spike / glyph still tick.  
SPECIAL_RULES: Family lottery **off**. 1-tile mire enter-tax skip. Band 0 → show `FSN-RIME-FILE`. Honesty reroll → ENC-RIME-02.  
OBJECTIVE: Defeat both. Optional: hop the 1-tile mire; take the clean aisle.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “one tile of mire is floor for the skipper; two tiles still tax.” Distinct from ENC-RIME-02 (1-tile **rime leave-tax** skip).  
SOLVABILITY_REQUIREMENTS: One clean aisle. Mire is not a wall. Counts toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Mire west vs east gallery.  
SCALING_BEHAVIOUR: High: inherit hale-seam on a **different** gallery. Never two mires on the only aisle.  
STATUS: PROPOSED

---

### ENC-SNAP-02

ENCOUNTER_ID: ENC-SNAP-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WATCH-BANK` — 1× `watch_banker` bishop (`spell-watch-bank` + `starter-frost`) + 1× optic / rook (`starter-frost` only). No Watch Sip / Alms / Lender / Fee / Mute on PAIR. Never Bank+Gun as PAIR. ENC-SNAP-01 remains queued day-17 (snap **steals** leftover AP).  
AI_REQUIREMENTS: Banker skips if Dual Keep already covers them **or** no overwatch is armed. Snap still deals. **Walker** leftover AP **+1 bank**. Dual Keep wins. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Watch Bank can drop `spell-watch-bank` if missing. Do **not** grant Watch Sip.  
MAP_REQUIREMENTS: Open court with a painted overwatch lane. Exit not on the lane.  
SPECIAL_RULES: Family lottery **off**. Bank is not a steal and does not stack with Dual Keep. Band 0 → show `FSN-WATCH-SIP`. Honesty reroll → ENC-SNAP-01.  
OBJECTIVE: Defeat both. Intended: Dual Keep so the bank is a no-op; Attack Nearest so you are not the walker; stand off the lane.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + watch-bank discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Overwatch snap **banks** leftover AP. Distinct from ENC-SNAP-01 (snap **steals**).  
SOLVABILITY_REQUIREMENTS: Lane is not a wall. Dual Keep plant exists.  
REPLAYABILITY: Lane N-S vs E-W.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on a **gallery**, never on the lane. Never Bank+Gun PAIR.  
STATUS: PROPOSED

---

### ENC-EQUAL-01

ENCOUNTER_ID: ENC-EQUAL-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-EQUAL-SHOVE` — 1× `equal_gifter` queen with heal (`spell-equal-gift` + `starter-shield`) + 1× `shove_gifter` queen with heal (`spell-shove-gift` + `starter-shield`) + 1× pawn (`physical_attack`) as bash. Never Equal+Tally as PAIR. No Poise / Gaunt / Hollow / Drift / Still Gift on the PAIR healers.  
AI_REQUIREMENTS: Equal Gifter skips if target leftover AP ≠ leftover MP **or** leftover AP = 0 or missing HP < 10; caster leftover unread. Shove Gifter skips if **this caster** did not force-move the target or missing HP < 10. Walk / Swap / Tally Step / Brick Step do **not** count. Bash dest legality required. Hostiles start ≥ 4 apart. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Equal Gift or Shove Gift can drop that id if missing. Do **not** grant Tally / Poise / Hollow.  
MAP_REQUIREMENTS: Open court with a legal bash dest that is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Until `forcedMovedThisTurn` **and** a caster-authored bit exist, show `FSN-SHOVE-DRIFT` instead. Honesty reroll → ENC-HOLLOW-01 or ENC-SHUNT-01. Band 0 → show `FSN-SHOVE-DRIFT`.  
OBJECTIVE: Defeat all. Intended: break the target’s leftover tie; do not stand where this caster can bash you onto a friend.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + equal/shove discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Target-tied-≥1 heal + caster-authored force heal + bash. Distinct from ENC-HOLLOW-01 (target leftover **both 0**) and ENC-SHUNT-01 (force-move **landing consume**).  
SOLVABILITY_REQUIREMENTS: Bash dest free floor, not portal. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Gifter north vs east.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on a gallery. Never pack Tally Mend on this BRIGADE.  
STATUS: PROPOSED

---

### ENC-TURN-01

ENCOUNTER_ID: ENC-TURN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PURSE-TALLY` — 1× `purse_turner` queen without heal (`starter-frost` + `spell-purse-turn`) + 1× `tally_mender` + 1× `tally_stinger`. Never Bar Cross / Dual Keep / tile Swap PAIR.  
AI_REQUIREMENTS: Turner skips if leftover AP === leftover MP (no-op). Invert one hostile leftover AP↔MP; sum invariant. Mender / stinger as ENC-TALLY-01 / ENC-SUM-01. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Purse Turn, Tally Mend, or Tally Sting can drop that id if missing. Do **not** grant Bar Cross.  
MAP_REQUIREMENTS: Open court. Dual Keep 2/2 plant exists (invert is a no-op on equal leftover).  
SPECIAL_RULES: Family lottery **off**. Honesty reroll → ENC-CROSS-01. Band 0 → show `FSN-TALLY-STEP` + `FSN-TALLY-SIP`.  
OBJECTIVE: Defeat all. Intended: Dual Keep so invert is a no-op; or accept (2,1) becoming (1,2) and spend before the sting.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + purse-turn discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: One-hostile leftover invert + leftover-sum heal + leftover-sum sting. Distinct from ENC-CROSS-01 (two-body leftover **cross**).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Equal leftover is a legal plant.  
REPLAYABILITY: Turner west vs east.  
SCALING_BEHAVIOUR: Peak: inherit walk-lock. Never pack Bar Cross on this BRIGADE.  
STATUS: PROPOSED

---

### ENC-PEEK-01

ENCOUNTER_ID: ENC-PEEK-01  
TYPE: map structure / elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SWAP-BRICK` — 1× `swap_marker` bishop (`spell-swap-mark` + `starter-frost`) + 1× `brick_stepper` knight (`spell-brick-step` + `physical_attack`) + 1× mist walker (`spell-swap` or mist step). Extra room `swap_pulpit` is **not** this family.  
AI_REQUIREMENTS: Marker skips if no teleport tool in the pack **or** player kit. 0 on cast; teleport landing detonates and consumes; walk-on is **free**. Stepper skips if no adjacent barrier **or** dest occupied/hazard; relocate through barrier, barrier **stays**; not Nudge, not `isSwap`. Relocate does **not** trip Swap Mark. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Swap Mark or Brick Step can drop that id if missing.  
MAP_REQUIREMENTS: One already-planted barrier (not minted from empty floor) with an empty, in-bounds, non-portal dest immediately beyond it. `findPath` after the hypothetical relocate must still reach an exit. Never seal the last aisle.  
SPECIAL_RULES: Family lottery **off**. Walk / push / pull / slide do **not** trip Swap Mark. Honesty reroll → ENC-SHUNT-01. Band 0 → show `FSN-SHOVE-DRIFT`.  
OBJECTIVE: Defeat all. Intended: walk onto the mark (free); do not Swap onto it; stand so Brick Step dest is occupied.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + swap/brick discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teleport-landing paint + through-barrier peek. Distinct from ENC-SHUNT-01 (force-move **landing** consume) and ENC-SLAB-01 (pivot a walk-block).  
SOLVABILITY_REQUIREMENTS: Barrier dest occupancy skip is mandatory. Map solvable with the barrier intact.  
REPLAYABILITY: Barrier west vs east aisle.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on a gallery. Never two Brick Steps.  
STATUS: PROPOSED

---

### ENC-HOLD-07

ENCOUNTER_ID: ENC-HOLD-07  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-TALLY-HOLD` — 1× `tally_holder` knight (`spell-tally-hold` + `physical_attack`) + 1× `must_tallier` knight (`spell-must-tally` + `physical_attack`) + 1× warden / rook (`starter-shield`). **Never PAIR Tally Hold + Must Tally as a two-body sheet** — this COURT is the three-body lesson. Nine / Dec Plug off.  
AI_REQUIREMENTS: Holder skips if leftover sum ≠ 3; cannot walk while leftover-sum===3; spells stay legal. Must-Tallier skips if leftover sum ≠ 3; non-Strike illegal unless leftover-sum===3 **and** last AP; Strike stays legal. Never Root. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tally Hold or Must Tally can drop that id if missing.  
MAP_REQUIREMENTS: Open court, never a closed ring. Dual Keep 2/2 plant peels Hold. Spend-1-leftover aisle exists.  
SPECIAL_RULES: Family lottery **off**. Spend 1 leftover so the sum leaves 3 **or** Dual Keep 2/2 peels Hold; last AP on Strike peels Must. Honesty reroll → ENC-HOLD-06. Band 0 → show `FSN-POISE-HOLD`. Dec Plug (`FSN-TALLY-HOLD/DEC`) stays **off** while remaining cap < 10.  
OBJECTIVE: Defeat the COURT. Intended: Dual Keep 2/2, or dump a pool, or last-AP Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Hard multiplier via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walk-until leftover-sum===3 + tools-until leftover-sum===3 **and** last AP. Distinct from ENC-HOLD-06 (leftover-**tied ≥ 1**).  
SOLVABILITY_REQUIREMENTS: Never a closed ring. Strike remains a legal answer. Living hostiles ≤ 4.  
REPLAYABILITY: Holder west vs east. Bounce Tally (`FSN-TALLY-HOLD/BOUNCE`) may replace optional Hood.  
SCALING_BEHAVIOUR: Do not add Dec. Tighten by Bounce Ring, not HP.  
STATUS: PROPOSED

---

### ENC-PRIME-01

ENCOUNTER_ID: ENC-PRIME-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PRIME-TAX` — 1× `cadence_primer` bishop (`spell-cadence-prime` + `starter-frost`) + 1× `cast_toller` bishop (`spell-cast-toll` + `starter-frost`) + 1× glyph tax scribe (`starter-frost`). Never Cast-Toll+Scribe as PAIR. Never Floor / Rise / Snuff. Extra door `prime_precentor` is **not** this family.  
AI_REQUIREMENTS: Primer skips if every remaining is already > 0; remaining `n===0` → `1`; ones stay 1; `n>1` unchanged. Toller skips if they only spelled or walked last turn; next **spell** +1 AP if they **Struck**; Strike still costs 2. Relocate does not pay. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cadence Prime or Cast Toll can drop that id if missing. Do **not** grant Cadence Floor / Rise / Snuff.  
MAP_REQUIREMENTS: Open court. A Strike-then-wait aisle exists.  
SPECIAL_RULES: Family lottery **off**. Until `struckThisTurn` exists, show `FSN-STRIKE-TAX` instead. Honesty reroll → ENC-DEBT-02. Band 0 → show `FSN-STRIKE-TAX`.  
OBJECTIVE: Defeat all. Intended: do not Strike last turn if you need a cheap spell next; spend leftover CD before Prime writes 0→1.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + prime/toll discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Remaining 0→1 + Struck-last-turn spell tax + glyph tax. Distinct from ENC-DEBT-02 (Struck-last-turn **walk** tax).  
SOLVABILITY_REQUIREMENTS: Strike remains legal. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Primer west vs east.  
SCALING_BEHAVIOUR: Peak: inherit walk-lock so “Strike then Frost” is also gated. Never Floor / Rise / Snuff.  
STATUS: PROPOSED

---

### ENC-TIED-02

ENCOUNTER_ID: ENC-TIED-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TIED-PORTAL` — 1× `tied_gaiter` pawn (`spell-tied-gait` + `physical_attack`) + 1× `portal_cutter` pawn (`spell-portal-cut` + `physical_attack`) + optional live void-mirror reflect on one body. ENC-TIED-01 remains queued day-17 (leftover-**tied ≥ 1** poke). Twin Gate pads do **not** count as portals.  
AI_REQUIREMENTS: Gaiter skips if leftover AP is not exactly 2 **or** leftover MP is not exactly 2 unless 10 still kills. Cutter skips rider if target is Chebyshev > 2 from every `map.portals` cell. Physical is the open. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tied Gait or Portal Cut can drop that id if missing.  
MAP_REQUIREMENTS: One world portal (locked while hostiles remain) with a Chebyshev-2 ring that is not the only walk-off. Exit reachable without standing in the ring.  
SPECIAL_RULES: Family lottery **off**. Dual Keep 2/2 **is** Tied Gait’s window (and Poise’s). Honesty reroll → ENC-LONE-03. Band 0 → show `FSN-TALLY-SIP` or `FSN-LONE-HAZARD`.  
OBJECTIVE: Defeat both. Intended: spend 1 leftover AP **or** 1 leftover MP so leftover is not exactly 2/2; fight outside the portal ring.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + tied/portal discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover exact 2/2 poke + world-portal threshold poke + reflect. Distinct from ENC-TIED-01 (tied-≥1 poke, no portal) and ENC-LONE-03 (leftover MP **exactly 1** + painted-hazard cut).  
SOLVABILITY_REQUIREMENTS: Portal ring is not a wall. Physical Strike remains legal.  
REPLAYABILITY: Portal west vs east. Variant ENC-PORT-01 skin: cutter elite only.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on a gallery, never on the portal. Never two portals.  
STATUS: PROPOSED

---

### ENC-PORT-01

ENCOUNTER_ID: ENC-PORT-01  
TYPE: priority-target / elite  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `portal_cutter` elite pawn (`spell-portal-cut` + `physical_attack`) + 1× bishop (`starter-frost`). Tied Gait off. Twin Gate pads do **not** count.  
AI_REQUIREMENTS: Cutter skips rider if target is Chebyshev > 2 from every `map.portals` cell. Bishop kites off the ring. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Portal Cut can drop `spell-portal-cut` if missing.  
MAP_REQUIREMENTS: One locked world portal. Chebyshev-2 ring painted. Exit reachable without standing in the ring.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing portal occupancy scan → ENC-LONE-03 leftover without claiming Portal Cut.  
OBJECTIVE: Defeat both. Intended: fight outside the ring so the bonus is off.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Isolated portal-threshold poke. Distinct from ENC-TIED-02 (adds exact 2/2).  
SOLVABILITY_REQUIREMENTS: Ring is not a wall.  
REPLAYABILITY: Portal north vs south.  
SCALING_BEHAVIOUR: High: promote to ENC-TIED-02. Never two cutters.  
STATUS: PROPOSED

---

### ENC-WAVE-19

ENCOUNTER_ID: ENC-WAVE-19  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Wave 1: 3× pawn (`physical_attack`). Wave 2: `FSN-TALLY-STEP` fallback (mender + stepper) **or** `FSN-TALLY-SIP` if Tally Mend already owned. Wave 3: 1× rook (`physical_attack`) + leftover pawn. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR AI (mender skip if leftover sum ≠ 3; stinger commits on leftover sum === 3). Wave 3 rook camps the choke via `chokepointCamp` only if AI tier ≥ 3.  
SPELL_DISCOVERY_OPPORTUNITIES: Optional overlay: a dead mender drops `spell-tally-mend` if ENC-SPELL-35 was skipped this chain.  
MAP_REQUIREMENTS: One choke (2-tile corridor) between spawn side and a backline alcove. `waveSpawnCells` marked. Exit behind the alcove. Optional hale-seam ribbon on the **gallery**, never in the choke.  
SPECIAL_RULES: Portal stays locked until wave 3 is clear. Next wave spawns at the start of the enemy phase after the previous wave is dead, on `waveSpawnCells` only (must be free floor). If a cell is occupied, spill to the nearest free reachable floor. Soft fail: if a wave cannot place any unit, skip that wave and log it. Honesty: missing leftover-sum → wave 2 is ENC-WAVE-18 leftover without claiming Tally.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player HP ≤ 0.  
REWARD: Victory XP counts all three waves’ defeated levels. Depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cadence — spend on wave 1, break Dual Keep 2/2 (or dump to 0) before the leftover-sum healer, then break the choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Choke must not isolate the player from the exit after walls finalize. Cap living hostiles so `ENEMY_SUMMON_CAP` is not starved later.  
REPLAYABILITY: Wave 2 rotates `FSN-TALLY-STEP` / `FSN-TALLY-SIP` / `FSN-RANK-PENTA` by seed. Choke side flips.  
SCALING_BEHAVIOUR: Mid: wave 2 gains the named kit. High: wave 3 rook learns `spell-iron-skin`. Peak: add a 2-pawn “echo” wave only if the player’s kill time on wave 1 was under 2 turns (skill-scaled, not level-scaled).  
STATUS: PROPOSED

---

### ENC-AMBUSH-18

ENCOUNTER_ID: ENC-AMBUSH-18  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Overworld / exploration: `WF-ELT-PLANT_PICKET` — one same-tier elite occupies a painted post **only while the player’s remaining MP is 0**. Spend MP and the post is empty floor (exploration: they leave, no purse). Dungeon / boss rush: they stand from map start — required for map-clear. Inverse of Spare Picket (leftover AP). Distinct from Diag Picket (ENC-AMBUSH-17: off-axis), Orth Picket (ENC-AMBUSH-16: on-axis), Near Picket (≤3), and Spell Picket (after a cast).  
AI_REQUIREMENTS: Elite uses live kit for the piece. No lookahead until engaged. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: elite may carry one `usableByEnemy` extra that ENC-PRIO-20 can teach.  
MAP_REQUIREMENTS: Painted post is floor. Exit reachable without touching. Counts as 1 enemy. Empty-MP pip painted.  
SPECIAL_RULES: Appearance keys off remaining MP being 0. World contact starts a normal battle. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-17.  
OBJECTIVE: Fight them (dungeon) or spend MP and pass (exploration).  
FAILURE_CONDITION: Player death in the fight. Walking past with leftover MP is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the picket only exists while you are **planted** (0 MP).” Inverse of leftover-AP pickets.  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without touching. In a run they are present from the start and reachable.  
REPLAYABILITY: Post north vs east.  
SCALING_BEHAVIOUR: High: elite is Tally Hood so leftover sum === 3 on the planted body is a miss — spend a pool then Strike. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-18

ENCOUNTER_ID: ENC-REINF-18  
TYPE: reinforcements / waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn. Wave 2 (reinforcement): 1× bishop (`starter-frost`) spawns on `waveSpawnCells` when the first pawn dies — **not** a Mute File (that is ENC-MUTE-02). Distinct from ENC-REINF-17 (echo bishop after a kill, Guard File leftover).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Alcove `waveSpawnCells` behind a 2-tile choke. Portal locked until both waves clear.  
SPECIAL_RULES: Reinforcement at the start of the enemy phase after the trigger kill. Occupied cell spills to nearest free reachable floor. `holdPortalLocked` until wave 2 is down.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death. Soft fail: if wave 2 cannot place, skip and log.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce after a kill so bursting the first pawn is a choice, not always correct. Distinct from ENC-MUTE-02 (spell-lock until adjacent).  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop vs queen (frost only) by seed.  
SCALING_BEHAVIOUR: High: wave 2 is Tally Hood. Peak: inherit hale-seam on the gallery.  
STATUS: PROPOSED

---

### ENC-SLIT-01

ENCOUNTER_ID: ENC-SLIT-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-SLIT_WALL` + 1× pawn on the player’s side.  
AI_REQUIREMENTS: Bishop kites behind the closed faces. Pawn charges around it. No smash AI unless the player already rotated.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One carved wall occupies a cell: it **blocks walk and line of sight except along one painted facing** (the slit). Adjacent 1 AP (no spell) rotates the slit 90° clockwise. Adjacent 2 AP smashes it to clear floor. Distinct from Pivot Slab (ENC-SLAB-01: walk-block, LoS **open**, relocates), Hush Curtain (ENC-CURTAIN-01: walk-through LoS-block), Fold Wall (full LoS block that folds), Reed Screen (walk-block, fully open LoS), Frost Pane (walkable LoS block), and Crumble Pillar (smash only). Never on spawn/portals.  
SPECIAL_RULES: Rotate and smash are AP occupancy actions, not spells. No damage. Skip if `evaluateSolvability` would fail with the wall intact. Honesty reroll → ENC-SLAB-01.  
OBJECTIVE: Clear all. Intended: spend 1 AP to aim the slit for a linear shot, spend 2 AP to smash, hide behind a closed face, or take the bypass.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “walk-block LoS-slit; rotate is 1 AP, smash is 2 AP.” Distinct from ENC-SLAB-01 (walk-block LoS-**open**).  
SOLVABILITY_REQUIREMENTS: Must not be a cut-vertex. Map solvable with the wall intact. Bypass exists.  
REPLAYABILITY: Slit west vs east aisle. Initial facing N vs E.  
SCALING_BEHAVIOUR: High: bishop gains `starter-poison`. Never two slits on the only aisle.  
STATUS: PROPOSED

---

### ENC-HEFT-01

ENCOUNTER_ID: ENC-HEFT-01  
TYPE: hazard / trap  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop may occupy the plate and Frost (voluntary walk-on is free). Pawn shoved onto it pays.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One visible `WF-TRP-HEFT_PLATE` (a voluntary occupancy-walk onto it is free; the first **forced** movement onto it this map — push, attract, wind slide, swap, or a teleport tile — costs that traveler 8% max HP once; then the plate becomes floor). Distinct from Glyph Plate (any enter), Stride Plate (ENC-LEAVE-01: first **leave**), Glass Shard (forced occupancy as a lasting hazard), Chevron Plate (facing-safe enter), and Echo Plate (first-step arms / second-step taxes). Never hidden. Never on spawn/portals.  
SPECIAL_RULES: Trigger keys off forced occupancy onto the plate. Challenge HP. Honesty: missing forced-landing trigger → skip the plate, keep the fight.  
OBJECTIVE: Clear all. Optional: walk onto it yourself; refuse the shove that would dump you on; bait an enemy into a forced landing.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the plate taxes the first **forced landing**, not the voluntary step and not the leave.” Distinct from ENC-LEAVE-01 (first **leave**).  
SOLVABILITY_REQUIREMENTS: Walkable before and after. Optional.  
REPLAYABILITY: Plate mid vs flank.  
SCALING_BEHAVIOUR: High: inherit hale-seam on a **different** gallery. Never two plates.  
STATUS: PROPOSED

---

### ENC-HALE-01

ENCOUNTER_ID: ENC-HALE-01  
TYPE: map structure / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn on the long path. Short-path corridor cell starts as a wall (`WF-OBS-HALE_SILL`).  
AI_REQUIREMENTS: Both take the long path. Neither pathfinds through the sill until it is floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Place only when a second spawn→portal route already exists. Evaluate solvability as if the sill were already a wall. Never the only exit. Inverse of Hurt Sill (ENC-HURT-01: opens below 50%). Distinct from Spent Sill (ENC-DUMP-01: end-turn 0 AP), Retreat Sill (end-turn ≥5 away), Full Cache (≥90% to open a chest), and Hearth Gate (full-HP extra portal).  
SPECIAL_RULES: Wall occupancy until a player end-of-turn with current HP **at least 80% of max**. Then floor for the rest of the map. No damage. Honesty reroll → ENC-HURT-01.  
OBJECTIVE: Clear all. Optional: end a turn healthy to open the short path.  
FAILURE_CONDITION: Player death. Leaving the sill closed is not a fail.  
REWARD: Standard. Overlay `under_50_damage` (pairs with staying hale on the long path).  
TACTICAL_PURPOSE: Teach “the short path opens when you end **hale**, not wounded.” Inverse of ENC-HURT-01.  
SOLVABILITY_REQUIREMENTS: Second route exists. Sill never the only exit.  
REPLAYABILITY: Sill west vs east of the long path.  
SCALING_BEHAVIOUR: High: inherit hale-seam on the long path so staying hale is a tax. Never two sills.  
STATUS: PROPOSED

---

### ENC-PAD-01

ENCOUNTER_ID: ENC-PAD-01  
TYPE: movement objective / teleport pads  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop may stand on a hostile’s rank so the pads work. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Two linked rank-cyan pads (`WF-TEL-FILE_STEP`). Entering one for 1 MP exits the other **only while the traveler shares a row or column with a living hostile**. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Distinct from Spare Step (ENC-SPARE-01: leftover AP), Empty Step (0 AP), Clear Step (empty dest, no axis gate), File Slide (always slides along the farthest file), and Diag Cache / Diag Hour (need off-axis). Both on floor, not on spawn/portals. The map is solvable without using them.  
SPECIAL_RULES: 1 MP from the unit’s current MP only on a successful on-axis landing. Not a teleport spell. Honesty reroll → ENC-SPARE-01.  
OBJECTIVE: Clear all. Optional: stand on a hostile’s rank or file then spend 1 MP, walk the long way, or leave the pair as an on-axis enemy escape.  
FAILURE_CONDITION: Player death. Skipping the pads is not a fail.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the pads only fire on-axis.” Inverse of ENC-SPARE-01 (leftover-AP pads).  
SOLVABILITY_REQUIREMENTS: Map solvable without the pads.  
REPLAYABILITY: Pads west vs east of mid.  
SCALING_BEHAVIOUR: High: inherit walk-lock so pad-then-cast is illegal. Never a third pad.  
STATUS: PROPOSED

---

### ENC-MUTE-02

ENCOUNTER_ID: ENC-MUTE-02  
TYPE: elite encounters / optional challenge  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-MUTE_FILE` — two extra same-tier elites share a painted file. The first (painted mute pennant) cannot spend `SpellConfig` until the second is dead **OR** the player ends a turn adjacent to the muted one. Attack Nearest and occupancy-walks stay legal. ENC-MUTE-01 remains queued day-8 (walk-then-fizzle). Distinct from Sheath File (second AP-locked), Guard File (ENC-GUARD-01: first **walk**-locked), Sleeping Vanguard (both world-asleep until touch), and Paired File (−20% incoming while both live).  
AI_REQUIREMENTS: Free caster uses live kit. Muted one Strikes / walks until peeled. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Painted file. Adds enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2. Exit reachable without touching.  
SPECIAL_RULES: In dungeon / boss rush they count as hostiles for map-clear. Honesty reroll → ENC-GUARD-01.  
OBJECTIVE: Fight them (dungeon) or walk to a portal and leave (exploration). Optional: plant adjacent so the mute can cast, or burst the free caster first.  
FAILURE_CONDITION: Player death in the fight. Walking past is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “the pennant cannot **cast** until you peel the partner or plant adjacent.” Distinct from ENC-GUARD-01 (cannot **walk**).  
SOLVABILITY_REQUIREMENTS: Skip if roster cannot fit 2. Both reachable.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Peak: muted one is Tally Holder so leftover-sum===3 also locks walks — spend a pool **and** plant or peel. Never three elites.  
STATUS: PROPOSED

---

### ENC-SURV-35

ENCOUNTER_ID: ENC-SURV-35  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn. Optional 1-HP summon pays the tax too.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither dumps MP on purpose unless wounded.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-ENV-STRIDE_DRAFT` overlay (at the end of each combatant turn, if they still have at least 1 remaining MP they pay 3% max HP; ending planted — 0 remaining MP — is shelter). Distinct from Spare Draft (ENC-SURV-33: leftover **AP**), Stagnant Haze (tax if you spent 0 MP this turn), Gale Bite (tax on the MP spend itself), and Plant Font (heal at 0 MP). Does not add walls.  
SPECIAL_RULES: End-of-turn challenge HP. Remaining MP is the unit’s current MP at end of turn. Summons pay it. No skipped turns. Honesty reroll → ENC-SURV-33.  
OBJECTIVE: Clear all. Intended: dump remaining MP before ending the turn, hold leftover MP and pay, or shove a foe so they end planted.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: End-of-turn leftover-**MP** tax. Inverse of ENC-SURV-33 (leftover-**AP** tax).  
SOLVABILITY_REQUIREMENTS: Tax is not a wall. Cast-then-dump remains usable.  
REPLAYABILITY: Overlay on / off from rest as ENC-HOUR-02’s cousin.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam on a gallery. Never a second draft.  
STATUS: PROPOSED

---

### ENC-SURV-36

ENCOUNTER_ID: ENC-SURV-36  
TYPE: survival / optional wager overlay  
RELATIVE_DIFFICULTY: MID (opt-in when from rest; HIGH when forced)  
ENEMY_COMPOSITION: Uses the room’s roster (typically ENC-MAST-18 or ENC-TREAS-18).  
AI_REQUIREMENTS: Next room.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-FILE_HOUR` overlay (if the player ended at least one turn sharing a row or column with a living hostile, the next `applyRewards` uses the hard multiplier). Inverse of Diag Hour (ENC-SURV-34 / ENC-HOUR-01). Distinct from Close Hour (end Chebyshev ≤ 1 at least once), Far Hour (never end adjacent), Line Cache (open on a shared file), and Orth Picket (elite on a shared file).  
SPECIAL_RULES: On-axis means sharing a row or a column with any living enemy-side combatant at player end-of-turn. Multipliers on persist-lock `applyRewards` only. Honesty reroll → ENC-SURV-34.  
OBJECTIVE: Optional: plant on-axis once then kite the diagonal.  
FAILURE_CONDITION: Next-room death. Declining the overlay is not a fail.  
REWARD: Hard multiplier if armed and planted on-axis.  
TACTICAL_PURPOSE: On-axis reward wager. Inverse of ENC-SURV-34 (off-axis).  
SOLVABILITY_REQUIREMENTS: Overlay does not block. Leaving is always legal.  
REPLAYABILITY: On/off from rest.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-PROT-18

ENCOUNTER_ID: ENC-PROT-18  
TYPE: protection objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn. The basin is not a third hostile. Enemies can drink it.  
AI_REQUIREMENTS: Bishop may path to the font if missing HP ≥ 8 and remaining MP is already 0. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One still-water basin `WF-ZON-PLANT_FONT`. The first unit to end a turn here this map heals 8% max HP **only if remaining MP is 0**; then the tile dries. Ending here with leftover MP does nothing and does not dry it. Inverse of Empty Font (0 remaining AP). Distinct from Hurt Font (ENC-PROT-17: heal only below 50% HP), Rally Drum (1 MP refund), Plant Oath (ENC-PLANT-01: 0 MP at credit for a purse), Shrine Pool (unconditional first drink), and Labor Font (2+ AP spent). Walkable. Optional. Never on spawn/portals.  
SPECIAL_RULES: Zone tick, not a spell. Player HP persist via `saveBattleStats` on the progress lock. Null Field does not strip it. Honesty reroll → ENC-PROT-17.  
OBJECTIVE: Clear all. Optional: dump MP then plant for the heal, deny the enemy the basin, or ignore it.  
FAILURE_CONDITION: Player death. Skipping the font is not a fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Contest a planted-MP heal. Inverse of ENC-PROT-17 (hurt-HP heal).  
SOLVABILITY_REQUIREMENTS: Optional. Map solvable if never drunk.  
REPLAYABILITY: Font west vs east of mid.  
SCALING_BEHAVIOUR: High: inherit stride-draft so holding leftover MP is a tax **and** denies the font. Never two fonts.  
STATUS: PROPOSED

---

### ENC-PRIO-20

ENCOUNTER_ID: ENC-PRIO-20  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-PLANT_TUTOR` — one same-tier enemy (medium threat) carries 1 extra `usableByEnemy` spell + 1× pawn. They stay hostile after the teach.  
AI_REQUIREMENTS: Tutor kites. Pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn at remaining MP **0** while they still live (any distance), the player gains that spell id as a **single remaining cast this map**. Killing them before that planted teach grants the purse but not the one-cast. One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Distinct from Diag Tutor (ENC-PRIO-19: off-axis), Orth Tutor (shared file), Close Tutor (end turn adjacent), Range Tutor (end turn 4+ away), and Live Tutor (repeating loan while they live).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
SPECIAL_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). Honesty reroll → ENC-PRIO-19.  
OBJECTIVE: Optional: dump MP and end a turn for a one-shot, burst-kill for the purse, or ignore them.  
FAILURE_CONDITION: Player death. Skipping the teach is not a fail.  
REWARD: Standard kill + optional one-cast. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Planted-MP teach. Distinct from ENC-PRIO-19 (off-axis plant).  
SOLVABILITY_REQUIREMENTS: Tutor reachable. In dungeon they count as hostiles for map-clear.  
REPLAYABILITY: Extra spell rotates among `starter-frost` / `starter-poison` / `starter-shield`.  
SCALING_BEHAVIOUR: High: tutor is Tally Hood so leftover-sum===3 also misses — spend a pool **and** dump MP. Never two tutors.  
STATUS: PROPOSED

---

### ENC-HALE-02

ENCOUNTER_ID: ENC-HALE-02  
TYPE: optional challenge / rest-adjacent wager  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None required on the inlay map; if a fight follows, the next room’s roster.  
AI_REQUIREMENTS: None on the inlay.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Optional `WF-RSK-HALE_OATH` hale-gold inlay. End a turn on it to flag this map. If the next `applyRewards` happens while the player’s current HP is **at least 80% of max**, that credit uses the hard multiplier. If they are below 80% at credit, the flag pays nothing extra. Snapshot at credit — dipping then healing still counts. Distinct from Spent Oath (ENC-BANK-01: leftover AP = 0), Plant Oath (ENC-PLANT-01: leftover MP = 0), Harvest Moon (never dropped below 70% this map), Scar Oath (below 50% at credit), Last Stand (≤30%), and Hurt Font (heal below 50%). Optional floor tile. Map is solvable if never used.  
SPECIAL_RULES: HP check is current / max at the `applyRewards` enqueue. Multiplier on the next enqueue only. Death still uses `saveBattleStats`.  
OBJECTIVE: Optional: flag a fight you will cash out hale, or stay unflagged and spend HP freely.  
FAILURE_CONDITION: None on the inlay. Next-room death is Death Realm.  
REWARD: Hard multiplier **or** nothing extra. No overlay.  
TACTICAL_PURPOSE: Opt-in hale-HP wager. Distinct from ENC-BANK-01 (leftover-AP=0) and ENC-PLANT-01 (leftover-MP=0).  
SOLVABILITY_REQUIREMENTS: Optional. Not on spawn or a portal.  
REPLAYABILITY: Inlay west vs east of spawn.  
SCALING_BEHAVIOUR: Rest/treasure only. Never a required dungeon tax.  
STATUS: PROPOSED

---

### ENC-QUIET-02

ENCOUNTER_ID: ENC-QUIET-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TALLY-QUIET` — 1× `tally_stepper` + 1× `tally_mender` + 1× `cover_squire` (`starter-shield`). ENC-QUIET-01 remains queued day-13 (Cast + Quiet on two tiles). No Poise Quiet / Gaunt Quiet clone.  
AI_REQUIREMENTS: Same as ENC-TALLY-01 plus Cover Shield on the mender. Ally `targetId` for Cover Shield on Quiet only. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-TALLY-01. Cover is not a grant.  
MAP_REQUIREMENTS: Open court. Cover dest is not the only exit.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-sum **or** occupancy dest → ENC-TALLY-01 leftover without claiming Quiet. Band 0 → show `FSN-TALLY-STEP`.  
OBJECTIVE: Defeat all. Intended: break leftover-sum===3 on one body; occupy every Chebyshev-1 of the Mender including the cover tile.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Tally step + tally mend + cover. Distinct from ENC-TALLY-01 (no cover) and ENC-QUIET-01 (Cast/Quiet tiles).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Cover dest walk-off exists.  
REPLAYABILITY: Cover west vs east of the mender. Lend Hood (`FSN-TALLY-QUIET/LEND`) may replace Cover at peak.  
SCALING_BEHAVIOUR: Peak: Lend Hood junior. Never a fourth body.  
STATUS: PROPOSED

---

### ENC-DEBT-03

ENCOUNTER_ID: ENC-DEBT-03  
TYPE: elite-adjacent / tax  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `cast_toller` bishop (`spell-cast-toll` + `starter-frost`) + 1× pawn (`physical_attack`). Cadence Prime off until ENC-PRIME-01. ENC-DEBT-02 remains queued day-17 (Struck-last-turn **walk** tax). ENC-DEBT-01 remains queued day-16.  
AI_REQUIREMENTS: Toller skips if they only spelled or walked last turn. Next **spell** +1 AP if they **Struck**. Strike still costs 2. Relocate does not pay. Pawn greedy. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cast Toll can drop `spell-cast-toll` if missing.  
MAP_REQUIREMENTS: Open court. A Strike-then-wait aisle exists.  
SPECIAL_RULES: Until `struckThisTurn` exists, show Strike Debt leftover without claiming Cast Toll. Honesty reroll → ENC-DEBT-02.  
OBJECTIVE: Defeat both. Intended: do not Strike last turn if you need a cheap spell next.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Isolated Struck-last-turn **spell** tax. Distinct from ENC-DEBT-02 (Struck-last-turn **walk** tax).  
SOLVABILITY_REQUIREMENTS: Strike remains legal.  
REPLAYABILITY: Toller west vs east.  
SCALING_BEHAVIOUR: High: promote to ENC-PRIME-01. Never two tollers.  
STATUS: PROPOSED

---

### ENC-ELITE-34

ENCOUNTER_ID: ENC-ELITE-34  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TALLY-CHOIR` — 1× `tally_mender` + 1× `verse_tallier` bishop (`spell-verse-tally` + `starter-frost`) + 1× ignite pawn (`starter-poison` or ignite). Ignite stack gate ≥ 2. No Poise / Gaunt Choir on PAIR.  
AI_REQUIREMENTS: Mender as ENC-TALLY-01. Verser skips if no `lastResolvedSpellId`; leftover sum === 3 peels; `0 = 0` does **not**; `2 = 2` does **not**; shove does **not**. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Verse Tally or Tally Mend can drop that id if missing.  
MAP_REQUIREMENTS: Open court. Dual Keep 2/2 plant exists (does **not** peel Verse Tally).  
SPECIAL_RULES: Family lottery **off**. Until `lastResolvedSpellId` exists, show `FSN-POISE-CHOIR` instead. Honesty reroll → ENC-ELITE-32. Band 0 → show `FSN-POISE-CHOIR`.  
OBJECTIVE: Defeat all. Intended: spend leftover so the sum leaves 3; recast last id only after the peel; do not Dual Keep 2/2 expecting a peel.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-sum===3 heal + last-id until leftover-sum===3 + ignite. Distinct from ENC-ELITE-32 (leftover-**tied ≥ 1** choir).  
SOLVABILITY_REQUIREMENTS: Strike remains legal. Three-unit occupancy leaves an exit.  
REPLAYABILITY: Verser west vs east.  
SCALING_BEHAVIOUR: Peak: inherit hale-seam. Never a fourth ignite.  
STATUS: PROPOSED

---

### ENC-ELITE-35

ENCOUNTER_ID: ENC-ELITE-35  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Rank Screen skin of `FSN-RANK-PENTA` as an **elite** — `rank_warder` elite + `penta_oather` elite. No COURT bodies.  
AI_REQUIREMENTS: Same as ENC-RANK-01 at soph 4–6. Lethal lookahead on the oather only if AI tier ≥ 6.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-RANK-01 if the chain skipped ENC-SPELL-36.  
MAP_REQUIREMENTS: Same as ENC-RANK-01 plus one hale-seam gallery (never on the only same-rank dest).  
SPECIAL_RULES: Family lottery **off**. Honesty reroll → ENC-ELITE-33 leftover without claiming Rank Screen.  
OBJECTIVE: Defeat both elites.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove same-rank + exact-5 under a hale tax. Distinct from ENC-ELITE-33 (Knight / Quad leftover).  
SOLVABILITY_REQUIREMENTS: Same as ENC-RANK-01. Hale-seam not a cut-vertex.  
REPLAYABILITY: Rank N vs E.  
SCALING_BEHAVIOUR: Peak: inherit walk-lock. Never a third elite.  
STATUS: PROPOSED

---

### ENC-RARE-18

ENCOUNTER_ID: ENC-RARE-18  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-TALLY-HOLD` (ENC-HOLD-07) as an **insert** on depth 4, not a replacement beat. 8% on depth 4 after the account has answered ENC-TALLY-01 **and** ENC-HOLD-06. Dec Plug (`FSN-TALLY-HOLD/DEC`) stays **off** while remaining cap < 10. Bounce Tally (`FSN-TALLY-HOLD/BOUNCE`) may replace optional Hood if the account already answered ENC-SUM-01. Verse Kennel (`FSN-TALLY-HOLD/KENNEL`) stays off unless a living player-side summon exists **and** cap allows.  
AI_REQUIREMENTS: Same as ENC-HOLD-07.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-HOLD-07.  
MAP_REQUIREMENTS: Same as ENC-HOLD-07. Never a closed ring.  
SPECIAL_RULES: Insert, do not replace mastery. `holdPortalLocked` until the COURT is down. Honesty reroll → ENC-RARE-17.  
OBJECTIVE: Defeat the rare COURT.  
FAILURE_CONDITION: Player death.  
REWARD: Rare multiplier via `applyRewards` (hard). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Optional peak leftover-sum exam. Distinct from ENC-RARE-17 (Poise Hold).  
SOLVABILITY_REQUIREMENTS: Same as ENC-HOLD-07.  
REPLAYABILITY: Hood vs Bounce Ring vs Lane (no fourth).  
SCALING_BEHAVIOUR: Do not add Dec. Tighten by Bounce Ring, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-18

ENCOUNTER_ID: ENC-TREAS-18  
TYPE: treasure/risk rooms  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn still on the board (the chest is not a third hostile).  
AI_REQUIREMENTS: Bishop kites. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible `WF-TRS-PLANT_CACHE` chest. 1 AP adjacent opens it **only while remaining MP is 0**: a medium `applyRewards` grant and no guardian. If leftover MP remains the AP is spent and the chest stays closed. Inverse of Spare Cache (leftover AP). Distinct from Diag Cache (ENC-TREAS-17: off-axis), Line Cache (ENC-TREAS-16: shared file), Trip Cache (open before any MP this map), and Stride Cache (must walk then open). Adjacent-open, not a wall. Optional.  
SPECIAL_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Failed open spends AP only. Optional hale-seam ribbon on a **gallery**.  
OBJECTIVE: Clear all. Optional: dump MP then spend 1 AP, kite until you are already planted, or walk past.  
FAILURE_CONDITION: Player death. Skipping the chest is not a fail.  
REWARD: Standard kill + optional medium grant. No overlay (the chest *is* the challenge).  
TACTICAL_PURPOSE: Treasure that wants a **planted-MP** open. Inverse of leftover-AP caches. Distinct from ENC-TREAS-17 (off-axis plant).  
SOLVABILITY_REQUIREMENTS: Chest not a wall. Map solvable if never opened.  
REPLAYABILITY: Chest west vs east of mid.  
SCALING_BEHAVIOUR: High: bishop is Tally Hood so leftover-sum===3 on the planted body is a miss — open after spending a pool.  
STATUS: PROPOSED

---

### ENC-HOUR-02

ENCOUNTER_ID: ENC-HOUR-02  
TYPE: optional challenge / wager  
RELATIVE_DIFFICULTY: MID (opt-in)  
ENEMY_COMPOSITION: Uses the next room’s roster (typically ENC-TREAS-18 or ENC-MAST-18).  
AI_REQUIREMENTS: Next room.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-FILE_HOUR` overlay on the next fight (same mechanic as ENC-SURV-36, offered from rest as a **choice** rather than a forced overlay). Inverse of ENC-HOUR-01 (Diag Hour).  
SPECIAL_RULES: Rest shrine can enable `fileHourArmed` on the next dungeon room. Never on rest combat (rest has no hostiles).  
OBJECTIVE: Choose to plant on-axis once in the next fight for a hard purse.  
FAILURE_CONDITION: Next-room death. Declining the overlay is not a fail.  
REWARD: Hard multiplier if armed and planted on-axis.  
TACTICAL_PURPOSE: Rest-offered on-axis wager. Distinct from ENC-SURV-36 (forced overlay) and ENC-HOUR-01 (off-axis).  
SOLVABILITY_REQUIREMENTS: Overlay does not block.  
REPLAYABILITY: On/off from rest.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-REST-18

ENCOUNTER_ID: ENC-REST-18  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional hale-oath / file-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-19 / ENC-TALLY-01 / ENC-RANK-01 observed Tally Mend / Rank Stride / Penta Oath, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-PLANT_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-18. Optional `WF-RSK-HALE_OATH` tile (flag next room only). Optional `WF-PRT-NEAR_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player has ended a turn at Chebyshev ≤ 1 from a living hostile this map; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Hale oath does not start combat. `uiLayout` unchanged. After one full Table O clear, shrine can enable day-18 `rushVariant` flags (`slide_peel`, `both_static`, `heave_mill`, `parched_dry`).  
OBJECTIVE: Choose an exit. Optional: shrine, hale oath, near gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Hale oath is a modifier flag, not a Doka mint. Near Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Tally-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Near Gate always in addition to a reachable stable portal. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Near on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-18

ENCOUNTER_ID: ENC-BRANCH-18  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: tally | rank | spike | odd` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: tally → ENC-TALLY-01 or ENC-SPELL-35, rank → ENC-RANK-01 or ENC-SPELL-36, spike → ENC-SPIKE-02 or ENC-GATE-05, odd → ENC-ODD-03 or ENC-SNAP-02. A sealed fifth door to ENC-RARE-18 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: tally | rank | spike | odd` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-18 / ENC-BOSS-18). Day-17 `ENC-BRANCH-17` stays poise/knight/pit/spent. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Poise / Knight / Pit / Spent.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Mute File door (ENC-MUTE-02) can replace Rank for accounts that already finished Rank this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Plant Picket (ENC-AMBUSH-18) so lingering planted (0 MP) to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-19

ENCOUNTER_ID: ENC-MINI-19  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (tally / leftover-sum adjacent). Branch tally: `starved_vampire_pawn`. Branch rank: `bone_cavalier`. Branch spike: `alabaster_fortress`. Branch odd: `midnight_bishop`. Do **not** use `slide_porter` / `both_capitular` / `heave_kitchener` / `parched_preacher`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table P directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (hale-seam / slit-wall / one spike gallery / leftover-odd aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Tally Hood consume / one extra Tally Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-18

ENCOUNTER_ID: ENC-BOSS-18  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Tally → `starved_vampire_pawn`; Rank → `bone_cavalier`; Spike → `alabaster_fortress`; Odd → `midnight_bishop`. If the chain taught Plant Picket (ENC-AMBUSH-18) **and** Rank was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table P ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-19) or mute (ENC-MUTE-02) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Tally may inherit 2 hale-seam tiles off the only path; Rank may inherit room for same-rank steps plus a Chebyshev-5 aisle; Spike may inherit one spike gallery (not a sealed pocket); Odd may inherit slit wall on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / charge-on-file / fortress spikes / curse-reflect).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-18

ENCOUNTER_ID: ENC-MAST-18  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on hale-seam (`WF-HAZ-HALE_SEAM`). Wave 2: `FSN-TALLY-STEP` **or** `FSN-TALLY-SIP` **or** `FSN-RANK-PENTA` **or** `FSN-SPIKE-SCREEN` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Warder elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave AI as ENC-WAVE-19 plus the named PAIR. Soph 4–6 on wave 3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already observed the CORE; else the wave-2 glyph may still drop.  
MAP_REQUIREMENTS: Choke + gallery. Hale-seam on the gallery, never in the choke. Branch skins add slit / spike / leftover-odd aisle / walk-lock on a **second** gallery. Portal locked until wave 3 is clear.  
SPECIAL_RULES: `holdPortalLocked` until wave 3 is down. Honesty: missing leftover-sum / same-rank / spike attract → wave 2 is ENC-MAST-17 leftover without claiming the day-18 verb.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery XP via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove the taught primer under a hale-HP tax and a choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Inherited device not a cut-vertex. Living hostiles ≤ 5.  
REPLAYABILITY: Four branch skins. Choke side flips.  
SCALING_BEHAVIOUR: Peak: wave 3 gains Tally Hood junior. Never a sixth body. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-RUSH-67

ENCOUNTER_ID: ENC-RUSH-67  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room P0 remix: `slide_porter` + `peel_friar` as Table P `P0`. Combined mechanic remains: he slides the pair onto / off an Exit Sting. Enter does **not** tick; the *leave* does. Stoup dest **never** occupies the Litter. Dest onto lava / spike is illegal AI (MIMA-005). Wolf is not a player-pair partner. Not Yoke / Mill / Ram / Hook / Countess / Fosse / Crypt / Cord.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-HEFT-01 / ENC-LEAVE-01, a **painted leave pip** (visual only) shows the next consume — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Pair Hinge, Pawn Trade, Slide Tile, or Draw Together. Player Pair Slide dests onto lava / spike stay illegal until MIMA-001 / 005.  
MAP_REQUIREMENTS: Preferred cells. Stoup never on Litter.  
SPECIAL_RULES: `rushVariant: slide_peel`. Unlock after one full Table O clear.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table P room 0 table + tiny bonus if the first leave consumed his Exit Sting (skill).  
TACTICAL_PURPOSE: Add the leave-exam the Heft / Leave primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Stoup never on Litter. Twin counts as a body, not a second boss.  
REPLAYABILITY: Litter N vs S of the Stoup.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten leave cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-68

ENCOUNTER_ID: ENC-RUSH-68  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room P1 remix: `both_capitular` + `lord_of_static` as Table P `P1`. Combined mechanic remains: both of you walk to take 8, while the shock graph taxes standing. Shock dest **never** occupies the Gaiter. Force-move does **not** arm Both Mend. Novice death ≠ victory. Not Infirm / Jostle / March / Sole / Wick / Must / Stride.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-TALLY-01, a **painted leftover-sum pip** (visual only) shows Dual Keep vs Tally windows — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Gait Mend, Chase Mend, Shove Mend, or Heave Mend.  
MAP_REQUIREMENTS: Preferred cells. Shock dest never on Gaiter.  
SPECIAL_RULES: `rushVariant: both_static`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table P room 1 table + tiny bonus if the first Both Mend was refused by standing still (skill).  
TACTICAL_PURPOSE: Add the walk-exam the Tally / Plant primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Shock dest never on Gaiter. Novice death ≠ victory.  
REPLAYABILITY: Gaiter N vs S of shock.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten shock cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-69

ENCOUNTER_ID: ENC-RUSH-69  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room P2 remix: `heave_kitchener` + `mill_seneschal` as Table P `P2`. Combined mechanic remains: mill cells force-move you; heave heals if **both** he and the extra were forced. Hopper dest **never** occupies the Spit. P2 `NAVE_HEAVE` translate is occupancy, not mill paint. Not Jostle / Yoke / Ram / Hook / Slide / Countess / Fosse.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-EQUAL-01 / ENC-PEEK-01, a **painted force pip** (visual only) shows the next mill cell — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Shove Mend, Both Mend, Heave Step, or Pair Pace.  
MAP_REQUIREMENTS: Preferred cells. Hopper never on Spit.  
SPECIAL_RULES: `rushVariant: heave_mill`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table P room 2 table + tiny bonus if the first mill cell was refused (skill).  
TACTICAL_PURPOSE: Add the force-exam the Equal / Peek primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Hopper never on Spit.  
REPLAYABILITY: Spit N vs S of Hopper.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten mill cadence, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-70

ENCOUNTER_ID: ENC-RUSH-70  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room P3 remix: `parched_preacher` + `dry_nuncio` as Table P `P3`. Combined mechanic remains: leftover **MP** = 0 heal vs leftover **AP** = 0 sting. Cruet dest **never** occupies the Flagon. Leftover AP does not arm Parched. Not Surplus / Purse / Lend / Both / Infirm / Dry Mend clone / Dry Gait (#802) grant.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-SUM-01 / ENC-ODD-03, a **painted leftover pip** (visual only) shows AP vs MP windows — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Do **not** grant Dry Mend, Still Mend, Dry Sting, or Both Mend.  
MAP_REQUIREMENTS: Preferred cells. Cruet never on Flagon.  
SPECIAL_RULES: `rushVariant: parched_dry`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table P room 3 table + tiny bonus if the first Parched Mend was refused by holding leftover MP (skill).  
TACTICAL_PURPOSE: Add the leftover-pool exam the Tally / Odd primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Cruet never on Flagon. Strike remains a legal answer.  
REPLAYABILITY: Flagon N vs S of Cruet.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten leftover window, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain S — “Tally Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-18 then ENC-SPELL-35 (or ENC-SPELL-36 if Tally Mend already owned) |
| 2 | Reinforce | ENC-WAVE-19 |
| 3 | Combine | ENC-HAZ-35 then ENC-TALLY-01 **or** ENC-SUM-01 **or** ENC-RANK-01 |
| 3 insert | Choice | ENC-BRANCH-18 → Tally/Rank/Spike/Odd destinations |
| 4 | Pressure | ENC-SURV-35 **or** ENC-PROT-18 **or** ENC-MUTE-02 **or** skip via ENC-REST-18 |
| 4 | Mastery | ENC-MAST-18 (branch skin) |
| 5 | Boss | ENC-BOSS-18 |

Rare: 8% on depth 4 to **insert** ENC-RARE-18 before mastery.  
Treasure: rest may offer ENC-TREAS-18 instead of PROT-18.  
Spike side-story: replace combine with ENC-SPIKE-02 and mini-boss ENC-MINI-19; capstone may become `alabaster_fortress` if Spike was the door.

### Chain T — “Hale Primer” (maxDepth 4)

ENC-SLIT-01 → ENC-HALE-01 → ENC-PAD-01 → ENC-REST-18 → ENC-BOSS-18 (`midnight_bishop` only if Odd was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-SLIT-01 as teach on accounts that already know hale-seam / leftover-sum.

### Rush injection (day-18)

After one full Table O clear, ENC-REST-18 shrine can enable: P0 → ENC-RUSH-67, P1 → ENC-RUSH-68, P2 → ENC-RUSH-69, P3 → ENC-RUSH-70. Day-1…day-17 flags for rooms 0–9 and Tables B–O remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-18, ENC-SPELL-35, ENC-SPELL-36 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-35, ENC-MIRE-01, ENC-PAD-01, ENC-HEFT-01 | `under_50_damage` |
| ENC-HAZ-36, ENC-WAVE-19 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-18, ENC-MAST-18, ENC-SLIT-01, ENC-PORT-01 | `direct_hit` |
| ENC-TALLY-01, ENC-SUM-01, ENC-ELITE-34, ENC-ELITE-35, ENC-SPIKE-02, ENC-SNAP-02, ENC-MUTE-02, ENC-HOLD-07 | `under_8_ap_per_turn` |
| ENC-SURV-35, ENC-HALE-01 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-18 / ENC-REST-18 bank / ENC-HALE-02 / ENC-HOUR-02 / ENC-SURV-36 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `hale_seam` or 1 cast cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | hale-seam **or** heft plate | kill + optional glyph |
| MID | named drop-17 `FSN-*` or waves | backline guard | zone 1 + Tally Mend / Rank Stride | one `WF-*` | clock / tags / gate |
| HIGH | elite or mute file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / spike / leftover-sum miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush P0–P3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit hale-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Hale Oath / File Hour / Plant Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-17 fields plus:

```
encounterId
encounterType        // + tally_step | tally_sip | rank_penta | spike_screen |
                     //   tally_gate | odd_court | mire_file | watch_bank |
                     //   tally_choir | equal_shove | tally_quiet | purse_tally |
                     //   tied_portal | prime_tax | swap_brick | tally_hold |
                     //   hale_seam | cast_cinder | heft_plate | slit_wall |
                     //   hale_sill | plant_font | file_step | mute_file |
                     //   plant_picket | plant_cache | plant_tutor | hale_oath |
                     //   walk_lock | file_hour | stride_draft
formationId?         // FSN-TALLY-STEP | FSN-TALLY-SIP | FSN-RANK-PENTA |
                     // FSN-SPIKE-SCREEN | FSN-TALLY-GATE | FSN-ODD-COURT |
                     // FSN-MIRE-FILE | FSN-WATCH-BANK | FSN-TALLY-CHOIR |
                     // FSN-EQUAL-SHOVE | FSN-TALLY-QUIET | FSN-PURSE-TALLY |
                     // FSN-TIED-PORTAL | FSN-PRIME-TAX | FSN-SWAP-BRICK |
                     // FSN-TALLY-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // tally | rank | spike | odd
haleSeamCells? / castCinderCell? / heftPlateCell?
slitWallCell? / haleSillCell? / plantFontCell?
fileStepPads? / walkLockArmed? / plantPicketArmed?
strideDraftArmed? / fileHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_plant_font | open_hale | drink_plant |
                     //   tag_plant | choose_device | odd_file | slit_wall
failureKind
deviceTable[]        // ENC-TREAS-18
rushVariant?         // slide_peel | both_static | heave_mill | parched_dry
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Plant Picket” logic — use `formationId` / `plantPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-25 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-17 families (`score_mender`, `file_warder`, …) or Wave-18 spell unique CORE — those wait on same-day / later catalogs. This catalog consumes drop-17 **formations** that can stand on Wave-16 kits.
- Faking Tally Mend without leftover-sum===3 on both bodies, Tally Sting as Poise/Tied, Rank Stride as Knight / Orth, Spike Reel as Pit Reel, Tally Post walk-on as a detonate, Mire Skip as a required player hop, Odd Plate as a leftover-AP≥1 miss, Watch Bank as Watch Sip, Equal Gift as Tally / Poise / Hollow, Purse Turn as Bar Cross, Tally Hold as Poise Hold, Slit as Pivot, Hale as Hurt, File Step as Spare Step, Plant Font as Hurt Font, Plant Picket as Diag Picket, Plant Tutor as Diag Tutor, Stride Draft as Spare Draft, Mute File as Guard File, Near Gate in a dungeon, Dec Plug while cap is 2.
- Consuming same-day 2026-10-26 Wave 18 family / spell / world catalogs.

---

## 10. Pick order (day-18, after days 1–17 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–17 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-18 + ENC-SPELL-35 (hale-seam / tally-mend verbs)  
2. ENC-WAVE-19 (`formationId` TALLY-STEP → TALLY-SIP)  
3. ENC-TALLY-01 or ENC-SUM-01 or ENC-RANK-01 (new pressure objects)  
4. ENC-BRANCH-18 (`branch: tally|rank|spike|odd` snapshot-before-cleanup)  
5. ENC-BOSS-18 branch read  
6. Rush Table P variants 67–70 one room at a time (after the account has one full Table O clear)

Uniqueness: this file is the **eighteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
