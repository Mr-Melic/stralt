# Encounter Evolution Catalog — 2026-09-28

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-28-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-10 Wave 9 packs `docs/design/ENEMY_FORMATIONS_2026-09-27.md` (PR #669), Wave 10 world features in `docs/WORLD_DYNAMICS.md` (PR #680, `WDD-2026-09-27-001`), Rush Table I `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.8 (PR #663). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-day (2026-09-28) Wave 11 family / spell / world-feature catalogs are landing in parallel (world dynamics PR #719, spell proposals PR #726, formation drop 11 PR #727). **Do not consume them** and do not mint colliding `FSN-*` / `WF-*` / Wave-11 family ids here. Wave 10 **families** (`shove_mender`, `gait_wicker`, `dry_stinger`, …, PR #686) wait for a later formation drop. Wave 11 **bosses** stay Rush-only (Table I).

---

## 1. Why an eleventh day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–10 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, and Purse/Hinge/Gait. Day-10 rooms spent leftover drop-8 packs (`FSN-PURSE-MUTE`, `FSN-HINGE-GLANCE`, …) and Wave 9 **families as solo teachers**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-10 Wave 9 packs | Day-10 taught gait-mend / dummy / even-stride as **solo** verbs. Still PDFs: `FSN-GAIT-PACE`, `FSN-LONE-NAIL`, `FSN-FLUSH-DUMP`, `FSN-MORROW-POST`, `FSN-PAIR-PEEL`, `FSN-WICK-SEAL`, `FSN-SPLIT-PAD`, `FSN-GAIT-CHOIR`, `FSN-FLUSH-LEND`, `FSN-SEAL-FILE`, `FSN-DIAG-BRICK`, `FSN-BODY-CAST`, `FSN-HOLD-RANGE`, `FSN-ALLY-WICK`, `FSN-BLINK-RANK`, `FSN-PEEL-COURT` |
| World-feature Wave 10 | Day-10 **rooms** never spent `WF-HAZ-RETRACE_DUST`, `WF-HAZ-CINDER_PLUMB`, `WF-TRP-KIN_PLATE`, `WF-TER-RAISE_SLAB`, `WF-OBS-SPELL_SILL`, `WF-ZON-COOL_STONE`, `WF-TEL-FAR_SWAP`, `WF-INV-RETREAT_COLUMN`, `WF-ELT-SPELL_PICKET`, `WF-TRS-FULL_CACHE`, `WF-SPL-LIVE_TUTOR`, `WF-RSK-MELEE_OATH`, `WF-MOD-SLOW_HAND`, `WF-EVT-CLEAN_HANDS`, `WF-ENV-FILE_WIND` |
| Rush Table I | `I0`–`I3` (`sole_thurifer`+`hook_regent`, `bias_prebendary`+`mill_seneschal`, `brick_cellarer`+`gaze_beadle`, `rebound_almoner`+`wedge_prior`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `retraceDustCells` / `plumbColumn` / `kinPlateCell` / `raiseSlabCell` / `spellSillCell` / `farSwapCell` / `fileWindArmed` / `mustSpanArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post counts as **1**. Quad Span counts as **4** — do not spawn `quad_prelate` / `FSN-*` that need remaining cap ≥ 4.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Pace / lone / flush / seal / hold / blink / body-mark bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Gait Mend / Wick Mend / Split Mend / Enter Mend live **only** on healer profiles.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-CLEAN_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth). Forbidden in dungeon, boss rush, and Death Realm.
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-11 ids (`sole_thurifer`, `bias_prebendary`, `brick_cellarer`, `rebound_almoner`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Ally Reel / Far Swap **does not** count as walk-MP for Gait Mend, Boot Sting, Gait Seal, Gait Wick, or Must Span.
- Pair Hinge dests are occupancy cells, **not** `isSwap`. Dummy Post is not Bait Pylon, not Goad-without-body, not Twin Span. Wick Mend is a **heal** convert, not Fuse, not Open Pit.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-PACE-01 / ENC-SPELL-21 / ENC-ELITE-20 | `walkMpSpentThisTurn` writer | Convert to ENC-SPELL-19 Frost-only gait teach (queued day-10) or `FSN-WARD-MEND` |
| ENC-LONE-01 / ENC-SEAL-01 | isolation Chebyshev-1 scan **or** walk-lock that leaves casts legal | Convert to ENC-SPELL-20 even-stride court (queued day-10) or `FSN-GLASS-WARD` |
| ENC-FLUSH-01 / ENC-ELITE-21 | once/battle ally all-CD → 0 | Convert to ENC-CRACK-01 (queued day-9 hostile CD0) without claiming Flush |
| ENC-MORROW-01 | next-turn absorb **or** `summonAI === "dummypost"` | Convert to ENC-DUMMY-01 (queued day-10) without claiming Morrow Plate |
| ENC-PEEL-01 / ENC-RARE-11 | two-hostile 90° occupancy dests (not Swap) | Convert to ENC-PAIR-01 (queued day-10) or ENC-HINGE-01 |
| ENC-WICK-03 | delayed **heal** convert (not `placeBarrier`, not fuse occupancy) | Convert to ENC-WICK-01 (queued day-5 tile fuse) |
| ENC-PAD-01 | Split 6/6 adjacent **and** first walk-enter heal | Convert to ENC-SPELL-19 + ENC-HAZ-19 (queued day-10) |
| ENC-DIAG-01 / ENC-RUSH-40 | diagonal-only walk filter **and** `barrierTiles` slide (not world walls) | Convert to ENC-BIAS-01 (queued day-7) without claiming Brick Shift |
| ENC-BODY-01 / ENC-PRIO-13 | unit-scoped Body Mark **and** Cast Mark non-Strike detonate | Convert to ENC-COUP-01 (queued day-5) without claiming both marks |
| ENC-HOLD-02 | Strike **illegal** until walk (other ids legal) | Convert to ENC-DULL-01 (queued day-9 Strike 0) |
| ENC-ALLY-01 | `applyAttract` toward **ally** + live paint copy | Convert to ENC-REEL-01 (queued day-10 file attract) |
| ENC-BLINK-01 | Blink Seal (no Swap/blink/pad, walks legal) + axis lock | Convert to ENC-FILE-01 (queued day-4) |
| ENC-MOVE-20 | farthest-living swap occupancy | Convert to ENC-DISP-01 (queued day-2 nearest swap) |
| ENC-MOVE-21 | wall→floor after a player `SpellConfig` (Attack Nearest does not count) | Convert to ENC-MOVE-04 wait-gate (queued day-3) |
| ENC-AMBUSH-11 | elite appears only after a player spell this map | Convert to ENC-CAMP-01 sleeping elites (queued day-8) |
| ENC-KIN-01 / ENC-PROT-11 | kin plate ally-adjacent skip | Convert to ENC-HAZ-19 weary plate (queued day-10) |
| ENC-SURV-21 | shared-file end-of-turn tax | Convert to ENC-SURV-06 ash-rain shelter (queued day-3) |
| ENC-RUSH-39…42 | Table I bosses + seal/diag/brick/rebound objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Pace / Nail / Flush primer + inserts)

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

| Beat | Depth hint | Job | Day-11 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (retrace hop, walked heal + spare, isolation gun) | ENC-TEACH-11, ENC-SPELL-21, ENC-HAZ-21 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-12, ENC-AMBUSH-11, ENC-SPELL-22 |
| Combine | 2–3 | Two taught verbs | ENC-PACE-01, ENC-LONE-01, ENC-FLUSH-01, ENC-HAZ-22, ENC-MOVE-20 |
| Pressure | 3 | Clock, post, peel, or shared-file tax | ENC-SURV-21, ENC-PROT-11, ENC-MORROW-01, ENC-PEEL-01, ENC-PRIO-13, ENC-HOLD-02 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-11, ENC-BRANCH-11, ENC-TREAS-11, ENC-CLEAN-01, ENC-TUTOR-01, ENC-MELEE-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-20, ENC-ELITE-21, ENC-RARE-11, ENC-MAST-11, ENC-SEAL-01, ENC-DIAG-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-12, ENC-BOSS-11, ENC-RUSH-39…42 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–10 remain valid. Day-11 **Pace / Nail / Flush primer** is the default for accounts that already cleared Purse / Hinge / Gait once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-11

ENCOUNTER_ID: ENC-TEACH-11  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a retrace-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. Four `WF-HAZ-RETRACE_DUST` tiles in a 2×2 pad on the mid-band (first visit to a given dust cell **this turn** is free; entering that same cell again this turn costs 4% max HP). A path around the pad. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First retrace tax logs a teach line. Do not also apply Salt Crust (that is ENC-HAZ-05) or Second Foot (queued day-6). Distinct from Bog Silt (MP) and Lectern Ash (casts). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: never retrace a dust cell.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the first hop is free; walking the same cell twice in one turn is the tax.” Prepares ENC-HAZ-22 / ENC-PACE-01 (you will want a 2-step that does **not** retrace).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can hop through each dust cell once. Dust never walls a corridor. Not on spawn±3 or the portal. Counts as 4 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Pad center vs flank. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-CINDER_PLUMB` column on a **different** flank (`inheritHazardsFrom: ENC-HAZ-21`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-21

ENCOUNTER_ID: ENC-HAZ-21  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand on the column **once**. Wounded pawns treat the next cell down like lava (`ENEMY_HAZARD_AVOID_HP_PCT`). Bishop kites from off-column floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a plumb tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: A painted 4-tile column of `WF-HAZ-CINDER_PLUMB` (cinder occupies one cell, falls one toward the marked bottom at each round start, wraps to the top; 5% max HP on land). A path around the column. Exit behind the bishop. Distinct from Pendulum Censer (horizontal), Skipping Cinder (2-tile hop), and Turnstile Ember (plus).  
SPECIAL_RULES: Scripted plumb only. Column never covers spawn/portal. Tax via challenge HP recorders.  
OBJECTIVE: Clear all. Intended: stand off-column, cross after it drops.  
FAILURE_CONDITION: Player death (frost + plumb tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing the column.  
TACTICAL_PURPOSE: Teach “the ember falls one cell each round; the next cell down is the tell.” Distinct from orbit squares and clockwise pluses.  
SOLVABILITY_REQUIREMENTS: Path around the column; column is floor, not a wall. Counts as 1 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Column west vs east. Bottom marked north vs south.  
SCALING_BEHAVIOUR: Mid: inherit 2 retrace-dust tiles on a **gallery** (`inheritHazardsFrom: ENC-TEACH-11`). High: bishop gains `spell-slow`. Never two plumb columns.  
STATUS: PROPOSED

---

### ENC-HAZ-22

ENCOUNTER_ID: ENC-HAZ-22  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn charger. No kin-family overlay until honesty lands.  
AI_REQUIREMENTS: Bishop kites off the plate. Pawn may step the plate without a summon (pays). No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning by planting a summon beside the plate can later hint a starter summon id if missing (reminder, not a grant).  
MAP_REQUIREMENTS: One visible `WF-TRP-KIN_PLATE` in the mid-band (first unit to step on it pays 8% max HP **unless** a living allied summon is orthogonally adjacent; then the plate becomes floor) **plus** the ENC-TEACH-11 dust pad on a **gallery** (`inheritHazardsFrom: ENC-TEACH-11`). A path around both. Distinct from Glyph Plate (always taxes) and Pressure Mosaic (two occupants).  
SPECIAL_RULES: Scripted plate + dust only. Plate never hidden. Attack Nearest is not a summon. Tax via challenge HP.  
OBJECTIVE: Clear all. Intended: summon beside the plate **or** walk around; hop dust once.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a kin-skip plate with a retrace tax so “dash the mid-band twice” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Path around plate and dust; plate not on a dust cell. Plate counts as 1 hazard budget.  
REPLAYABILITY: Plate left vs right. High: full `FSN-MORROW-POST` dummy plant **beside** the plate (ENC-MORROW-01) so the 1-HP post can be the “kin.”  
SCALING_BEHAVIOUR: High: enable dummy plant (ENC-MORROW-01). Peak: add `WF-ENV-FILE_WIND` so ending on the plate’s file with the pawn is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-21

ENCOUNTER_ID: ENC-SPELL-21  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-GAIT-PACE/SOLO-MEND` fallback — 1× `gait_mender` bishop (`spell-gait-mend` + `starter-frost`) + 1× pawn (`physical_attack` only). Spare Pace off until band 1 honesty.  
AI_REQUIREMENTS: Mender walks **then** mends if `walkMpSpentThisTurn` ≥ 1; otherwise Frost. Never drain / nova. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-gait-mend` (heal 8 iff the **caster** walked this turn) can drop that id if missing. Extra door `gait_cantor` — first child wins vs day-10 ENC-SPELL-19 observe. Do not restamp claimed feats.  
MAP_REQUIREMENTS: Open court. No lava. One locked exit. Optional 2-tile dry runway so the mender can buy the step **without** retracing dust.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing walk-spend writer → Frost-only (still a valid teach: they walked and did **not** mend). Do not fake the heal with `starter-heal`. Distinct from ENC-SPELL-19 (same verb, no Spare, no dust).  
OBJECTIVE: Defeat both. Optional: never let the mender cash a walked heal (pin, Nail Down, kill before the step).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + gait-mend discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Re-teach “this mend is paid in **tiles already spent**” on a clean court so ENC-PACE-01 can add Spare Pace without two new verbs.  
SOLVABILITY_REQUIREMENTS: Both reachable. Runway not the only aisle.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: Mid: enable `ROLE-SPARE` (`FSN-GAIT-PACE`). High: inherit 2 dust tiles on the runway (`inheritHazardsFrom: ENC-TEACH-11`) so the paid step cannot retrace.  
STATUS: PROPOSED

---

### ENC-SPELL-22

ENCOUNTER_ID: ENC-SPELL-22  
TYPE: spell-discovery / elite encounter  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-LONE-NAIL/SOLO` — 1× `lone_stinger` bishop (`spell-lone-sting` or Frost if isolation unread) + 1× pawn charger. Seal off until band 1.  
AI_REQUIREMENTS: Lone skips +8 if a Chebyshev-1 same-side hostile exists (player summon counts). Refuse dest Chebyshev ≤ 2. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-lone-sting` can drop that id if missing. MULTI child `lone_gallery` — first child wins vs observe.  
MAP_REQUIREMENTS: Fortress courtyard + **one gallery**. A 4-tile file toward the Lone. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Band 0: Frost only (isolation +8 off) — still a valid teach: the gun wants you **alone**. Honesty: missing isolation scan → Frost forever. No Gait Seal until ENC-LONE-01. No Split Fang.  
OBJECTIVE: Defeat both. Optional: keep a summon Chebyshev-1 so the +8 never fires.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + lone-sting discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this poke wants 0 adjacent allies; clump or it is Frost.” Prepares ENC-LONE-01 (adds the walk nail).  
SOLVABILITY_REQUIREMENTS: Gallery reaches the Lone. File is not the only aisle.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Mid: enable `ROLE-SEAL` (`FSN-LONE-NAIL`). High: inherit File Wind (`WF-ENV-FILE_WIND`) so clumping on the **file** costs HP — the answer is clump **off-file**.  
STATUS: PROPOSED

---

### ENC-PACE-01

ENCOUNTER_ID: ENC-PACE-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GAIT-PACE` — 1× `gait_mender` bishop (`spell-gait-mend`) + 1× `spare_pacer` knight (`spell-spare-pace`, current walk MP gift, **no** `healAmount`).  
AI_REQUIREMENTS: Mender: healer; skip if spend < 1 or missing HP < 8. Spare: buffer (`AI-ROL-05`); skip at max MP; never persist `CharacterStats.mp`. Opposite corners. Soph 1–2. Spare does **not** itself trigger Mend.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gait Mend or Spare Pace can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `fortress` courtyard with a gallery. Reject a 1-tile tunnel. No Time Warp. No lava on the Mender’s approach. Optional inherit dust on a **flank** (`inheritHazardsFrom: ENC-TEACH-11`) — never the only aisle.  
SPECIAL_RULES: Band 0: **do not spawn** — show ENC-SPELL-21. Forced-move / Swap / Pair Hinge / Dummy plant / Knight Slip does not pay Mend. No Boot Sting on PAIR (that is ENC-ELITE-20 / `FSN-GAIT-CHOIR`). No `pale_cantor`.  
OBJECTIVE: Clear both. Intended: Slow the last tile, or burst the glass Mender before they walk.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walked heal plus a gifted step. Combination of ENC-SPELL-21 and a buffer that does not heal.  
SOLVABILITY_REQUIREMENTS: Two approaches; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Mender N / Spare E vs swapped. High: `FSN-GAIT-CHOIR` after ENC-ELITE-20 exists.  
SCALING_BEHAVIOUR: Elite Mender only (`FSN-GAIT-PACE/E-GAIT`). Spare stays junior. Never add Boot on PAIR.  
STATUS: PROPOSED

---

### ENC-LONE-01

ENCOUNTER_ID: ENC-LONE-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LONE-NAIL` — 1× `lone_stinger` bishop (`spell-lone-sting`) + 1× `gait_sealer` pawn (`spell-gait-seal` / walk MP = 0, **casts remain legal**).  
AI_REQUIREMENTS: Lone: artillery; skip +8 on a clump; refuse dest Chebyshev ≤ 2. Seal: caster; will not refresh an already-sealed target. Start ≥ Chebyshev 4. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lone Sting or Gait Seal can drop that id if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel. No Time Warp. No lava on the sealed tile.  
SPECIAL_RULES: Band 0: **do not spawn** — show ENC-SPELL-22. Never Root (that is `FSN-WIRE-ROOT`). Never Muter (that is ENC-PURSE-01). No Porter (that is ENC-PEEL-01). No second gun.  
OBJECTIVE: Clear both. Intended: summon Chebyshev-1, Swap the Seal, or poke from 4 while sealed.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Isolation poke plus a walk nail. You clump **or** you walk (and the nail says you cannot).  
SOLVABILITY_REQUIREMENTS: Gallery reaches the Lone; sealed tile is not the only aisle.  
REPLAYABILITY: Seal west vs east. High: `FSN-SEAL-FILE` (ENC-SEAL-01) after the player answers LONE-NAIL once.  
SCALING_BEHAVIOUR: Elite Lone only (`FSN-LONE-NAIL/E-SHOT`). Seal stays junior. Never both elite at PAIR.  
STATUS: PROPOSED

---

### ENC-FLUSH-01

ENCOUNTER_ID: ENC-FLUSH-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FLUSH-DUMP` — 1× `cadence_flusher` bishop (`spell-cadence-flush`, once/battle ally all remaining CDs → 0) + 1× `leftover_lender` bishop **without heal** (`spell-leftover-lend`).  
AI_REQUIREMENTS: Flush: buffer; skip a bar of 0s; never target the player. Lend: buffer; skip at 0 leftover; never splice the current turn. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cadence Flush or Leftover Lend can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Reject a sealed pocket. No Time Warp on the Flush window. No Glass Realm.  
SPECIAL_RULES: Band 0: **do not spawn** — show ENC-TEACH-10 leftover-AP tell (queued day-10) or `FSN-HEX-BLOOD`. Never Flush the player. No Ignite on PAIR (that is ENC-ELITE-21). No Verse Thief / Empty Purse / Tempo Gift / Purse Lock. One Inferno cadence: the flushed id is the **ally’s**.  
OBJECTIVE: Clear both. Intended: burst the Flusher first, or sit at 0 leftover so Lend is a skip.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: All-bar CD gift plus leftover dump. Tempo scare, not a nuke. Distinct from ENC-CRACK-01 (hostile CD0) and ENC-PURSE-01 (leftover poke).  
SOLVABILITY_REQUIREMENTS: Two approaches; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Flusher N / Lender E vs swapped. High: `FSN-FLUSH-LEND` (adds Ignite).  
SCALING_BEHAVIOUR: Elite Flusher only (`FSN-FLUSH-DUMP/E-FLUSH`). Lender stays junior. Never add Ignite on PAIR.  
STATUS: PROPOSED

---

### ENC-MORROW-01

ENCOUNTER_ID: ENC-MORROW-01  
TYPE: elite encounter / protection  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-MORROW-POST` — 1× `morrow_warden` rook (`spell-morrow-plate`, absorb 10 **next own turn**) + 1× `dummy_prelate` rook (plants one 1-HP post, `summonAI: "dummypost"`).  
AI_REQUIREMENTS: Morrow: charger; arm then hold; VETERAN skip arm if they will die this round anyway. Dummy: setter; plant then step off (VETERAN); remaining cap ≥ 1; fall-through Strike, never skip-lock. Never `name.includes("dummy")`. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Morrow Plate or Dummy Post can drop that id if missing. Extra door vs ENC-DUMMY-01 — first child wins.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `arena` with ring space. Never a 1-tile closet (needs Chebyshev-1 around the post **and** a walk-off). No lava on the plant cell. Optional kin plate on a **flank** (`inheritHazardsFrom: ENC-HAZ-22`) so the post can be the “kin.”  
SPECIAL_RULES: Band 0: Morrow Strike only (plate off); Dummy is a body that will plant on band 1. No Return Sting on PAIR. No Goad on PAIR (Thin Goad is three bodies). No bait / pylon / span / twin / triple / font / turret / spark overlay. Posts are not `countsTowardKillRewards`.  
OBJECTIVE: Clear Morrow + Dummy (post remaining after Dummy dies despawns). Intended: snipe the post, hit Morrow **this** turn, walk Chebyshev-2.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit` (the post eats hugging shots).  
TACTICAL_PURPOSE: Delayed plate plus a 1-HP taunt post. You swing this turn **or** you eat the plate; you ignore the post **or** you waste a hit on 1 HP. Distinct from ENC-DUMMY-01 (no next-turn absorb).  
SOLVABILITY_REQUIREMENTS: ≥ 1 free Chebyshev-1 around the plant cell, none void. Exit reachable without hugging the post. Dummy + post count as 2 toward `MAX_ENEMIES` while planted.  
REPLAYABILITY: Plant west vs east. High: `/RETURN` CELL (Return Sting on the aura).  
SCALING_BEHAVIOUR: Elite Morrow only (`FSN-MORROW-POST/E-PLATE`). Dummy stays junior. Never two posts.  
STATUS: PROPOSED

---

### ENC-WAVE-12

ENCOUNTER_ID: ENC-WAVE-12  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-GAIT-PACE` (or ENC-SPELL-21 Frost-pair if walk writer missing). Wave 2: `FSN-LONE-NAIL` (or ENC-SPELL-22 Frost-gun if isolation unread). Wave 3: leftover Mender **or** leftover Lone, never both. Never more than 4 living hostiles. Band 0: do **not** spawn named packs — substitute 2× pawn + 1× bishop Frost.  
AI_REQUIREMENTS: Wave 1: Mender walk-then-mend; Spare ally-first. Wave 2: Lone isolation; Seal nails the file. Wave 3 leftover is greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 1 may reveal Gait Mend / Spare Pace. Wave 2 may complete Lone Sting / Gait Seal observation.  
MAP_REQUIREMENTS: Fortress lane + **one side aisle**. `waveSpawnCells` in the far lane. Optional `WF-HAZ-RETRACE_DUST` inherited from ENC-TEACH-11 on the **aisle** so a 2-step close cannot retrace.  
SPECIAL_RULES: Portal locked until wave 3 is clear. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns` is tight on purpose.  
TACTICAL_PURPOSE: Named drop-10 pairs as wave verbs — paid step, then isolation gun — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Side aisle reaches the Lone. Cap 4 living so Dummy / Spare summons are not starved.  
REPLAYABILITY: Wave 2 can swap to `FSN-MORROW-POST` if the player already answered LONE-NAIL this account.  
SCALING_BEHAVIOUR: High: wave 3 leftover is `FSN-GAIT-PACE/E-GAIT` **or** `FSN-LONE-NAIL/E-SHOT`. Peak: wave 2 is `FSN-SEAL-FILE` (still no Fang). No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-11

ENCOUNTER_ID: ENC-AMBUSH-11  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× pawn charger. Hidden until trigger: `WF-ELT-SPELL_PICKET` elite (`FSN-LONE-NAIL/E-SHOT` Lone, Frost-only if isolation unread) occupying a painted post.  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP). Picket Lone prefers isolated player (no summon) after it appears. Post is floor until trigger.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lone Sting from the picket can complete ENC-SPELL-22 observation.  
MAP_REQUIREMENTS: Arena with a painted spell-post cell. Trigger: player casts any `SpellConfig` this map. Attack Nearest / walking / summons **never** summon them (exploration contract). In dungeon they still wait on the first player spell so the teach is honest — `holdPortalLocked` until they appear **or** the bait dies after a 4-turn grace (see specials).  
SPECIAL_RULES: Ambush unit does not exist in the combatant store until trigger. Soft: if the player never casts, the picket remains empty and the bait clear **unlocks the portal** after turn 4 of empty post (exploration skip). In dungeon / boss rush: if no spell by turn 4, spawn the elite anyway so map-clear cannot soft-lock (`requiredForClear: true`). Distinct from ENC-ODD-01 (round parity) and ENC-CAMP-01 (sleeping elites). Intent log: explicit `ambush: spell_picket`.  
OBJECTIVE: Defeat bait + picket (or skip the picket by never casting, exploration only).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player never casts (melee-only skip). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Punish a panic nuke; teach that a `SpellConfig` can **call** a gun. Distinct from ENC-AMBUSH-03’s hunt lantern (MP spend).  
SOLVABILITY_REQUIREMENTS: Post reachable after spawn; bait cannot spawn on the portal; empty post is floor. Counts as 1 toward `MAX_ENEMIES` when present.  
REPLAYABILITY: Post left/right. High: picket is `FSN-SEAL-FILE` sniper instead of Lone.  
SCALING_BEHAVIOUR: Peak: inherit File Wind so the called gun shares your file. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REINF-11

ENCOUNTER_ID: ENC-REINF-11  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: 1× rook (`physical_attack`). Reinforcements: `WF-INV-RETREAT_COLUMN` three same-tier bodies (2× pawn + 1× bishop Frost) marching one tile per wander along a painted column toward a marked departure cell. Touching any starts them as hostiles. Never more than 4 living.  
AI_REQUIREMENTS: Start rook camps the intercept tile (`chokepointCamp` if soph ≥ 3). Column bodies do not decide until engaged. Once engaged they are greedy chargers / kiting bishop.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Dual-lane map. Painted column + departure cell on the far lane. Exit reachable **without** touching the column. Departure cell is never a portal and never spawn±3.  
SPECIAL_RULES: Portal locked while any column body remains **in dungeon**. Exploration: they leave with no purse if they reach departure (optional fight). Dungeon / boss rush: they do not depart — required for map-clear. Distinct from ENC-CART-01 (one elite + cart) and Horn Relay. If a column body cannot place, skip that body and log — never soft-lock. Family lottery **off**.  
OBJECTIVE: Intercept and clear all remaining column bodies + the rook.  
FAILURE_CONDITION: Player death. Soft (exploration only): letting them depart is a skip, not a fail.  
REWARD: Hard-band `applyRewards` if all three still stood at contact; medium if any already departed. Kill XP only for units actually defeated.  
TACTICAL_PURPOSE: A moving intercept that is **not** a denser spawn table. Distinct from wave-entry tiles (ENC-WAVE-12).  
SOLVABILITY_REQUIREMENTS: Path is floor. Counts as 3 toward `MAX_ENEMIES` plus the rook (4). Exit reachable without the column.  
REPLAYABILITY: Column west vs east. High: replace the bishop with a Spare Pacer if ENC-PACE-01 was taught.  
SCALING_BEHAVIOUR: Peak: one column body is elite Lone (still cap 4). No extra HP.  
STATUS: PROPOSED

---

### ENC-PEEL-01

ENCOUNTER_ID: ENC-PEEL-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PAIR-PEEL` — `FSN-LONE-NAIL` plus 1× `pair_porter` knight (`spell-pair-hinge`, 90° occupancy around **their** midpoint). Three bodies.  
AI_REQUIREMENTS: Porter skips no-pair / occupied dest; dests are occupancy, not `isSwap`. Lone and Seal as ENC-LONE-01. Blackboard `hingeDest` so they do not stack on the gun. Start ≥ Chebyshev 4. Never turn-1 surround.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Pair Hinge can drop that id if missing (extra door vs ENC-PAIR-01 / ENC-HINGE-01 — first child wins).  
MAP_REQUIREMENTS: `asymmetric` or `ruinsIslands` with **two** flanks plus a rear tile that is not the only exit. Clockwise dests free floor, not lava / pit / portal / dust-retrace-only aisle. Reject cramped `corridorMaze`.  
SPECIAL_RULES: Band 0: **do not spawn**. If pair-hinge dests missing, convert to ENC-LONE-01. Player keeps ≥ 1 walk-off after both bodies land. No Vault / Hook / Mist. No Split Fang.  
OBJECTIVE: Clear all three. Intended: occupy a dest cell, Nail Down the Porter, or stay diagonal to the 2×2.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Isolation gun after a 90° peel. Distinct from ENC-PAIR-01 (pair occupancy without the gun) and ENC-TWIN-01 (ally-swap kennel).  
SOLVABILITY_REQUIREMENTS: 2×2 dest cells reachable; 3-unit occupancy leaves a gallery.  
REPLAYABILITY: 2×2 north-west vs south-east. Peak: `FSN-PEEL-COURT` (ENC-RARE-11).  
SCALING_BEHAVIOUR: Do not add a fourth body until ENC-RARE-11. Tighten by elite Lone, not HP.  
STATUS: PROPOSED

---

### ENC-WICK-03

ENCOUNTER_ID: ENC-WICK-03  
TYPE: hazard / elite encounter  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WICK-SEAL` — 1× `wick_mender` bishop (healer; `spell-mend-wick`, delayed **heal** convert) + 1× `gait_sealer` pawn.  
AI_REQUIREMENTS: Wick: setter / healer; paint 1-turn walkable tile; convert heals occupant 8; VETERAN no nail-on-player-wick. Seal: as ENC-LONE-01. Never Fuse, never Open Pit, never `placeBarrier`.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mend Wick can drop that id if missing. Extra door vs ENC-SPELL-21 — different id.  
MAP_REQUIREMENTS: Arena plus a painted wick cell that is **not** the only aisle. Optional inherit dust on a **different** flank. No Time Warp.  
SPECIAL_RULES: Caster death does **not** cancel a live wick (SPELL_PROPOSALS delayed-tile law). Teleport-off works; walk-on at convert heals. Distinct from ENC-WICK-01 (fuse occupancy damage) and ENC-WICK-02 (hinge tile).  
OBJECTIVE: Clear both. Intended: step off before convert, or steal the 8, while sealed casts remain legal.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing` is fair (the stolen 8 is the tax).  
TACTICAL_PURPOSE: Delayed **heal** plus a walk nail. Standing on the wick is greed; standing off is the answer.  
SOLVABILITY_REQUIREMENTS: Wick cell floor; gallery exists; Seal cannot cover both wick and exit.  
REPLAYABILITY: Wick north vs south. High: `FSN-ALLY-WICK` (ENC-ALLY-01) after paint-copy honesty.  
SCALING_BEHAVIOUR: Elite Wick only. Seal stays junior. Never two live wicks.  
STATUS: PROPOSED

---

### ENC-PAD-01

ENCOUNTER_ID: ENC-PAD-01  
TYPE: elite encounter / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPLIT-PAD` — 1× `split_cantor` bishop (healer; `spell-split-mend`, 12 or 6/6 if living adjacent ally) + 1× `enter_mender` rook (`spell-enter-mend`, first walk-enter heals 6 once).  
AI_REQUIREMENTS: Split: healer; skip 6/6 if no living adjacent ally (full 12 on self / lowest missing). Enter: setter; occupant at paint does not trigger; teleport does not. Dummy is usually the **wrong** adjacent (1 HP, empty kit) — do not plant Dummy here.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Split Mend or Enter Mend can drop that id if missing.  
MAP_REQUIREMENTS: Open court plus one painted enter-pad that is not the only aisle. No Time Warp.  
SPECIAL_RULES: Band 0: **do not spawn** — show ENC-SPELL-21. No `pale_cantor`. No Gift Sill / Boon Mason / Glyph on this PAIR.  
OBJECTIVE: Clear both. Intended: separate them so Split is a single 12, and do not step the pad.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing`.  
TACTICAL_PURPOSE: Split heal plus an enter-heal pad. Inverse of ENC-HAZ-22 (enter **tax**).  
SOLVABILITY_REQUIREMENTS: Pad floor; two approaches; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Pad west vs east. High: add Spare Pace so the Cantor can step **off** the pad after painting.  
SCALING_BEHAVIOUR: Elite Cantor only. Enter stays junior. Never two pads.  
STATUS: PROPOSED

---

### ENC-SEAL-01

ENCOUNTER_ID: ENC-SEAL-01  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SEAL-FILE` — `FSN-LONE-NAIL` plus 1× `glass_sniper` **or** `far_stinger` bishop (min-range / far poke). Three bodies. Never Split Fang.  
AI_REQUIREMENTS: Seal nails the file. Lone isolation. Sniper / Far refuses dest Chebyshev ≤ 1 (Far) or ≤ 2 (Glass). One gun per activation. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Far Sting can drop that id if missing.  
MAP_REQUIREMENTS: Fortress lane + gallery (`FSN-GLASS-WARD` contract). File toward the guns. Optional `paper_windstorm` inherited from ENC-TEACH-03 so closing is the same verb as day-3 wind.  
SPECIAL_RULES: No Time Warp. No Glass Realm. Cap 3 living. Random lottery **off**.  
OBJECTIVE: Clear all. Intended: gallery the guns while sealed casts remain legal.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walk nail plus two range verbs. Mastery of ENC-LONE-01, not more HP.  
SOLVABILITY_REQUIREMENTS: Gallery reaches both guns; sealed tile not the only aisle.  
REPLAYABILITY: Far vs Glass as the third body. Peak: `FSN-HOLD-RANGE` (ENC-HOLD-02) replaces Lone.  
SCALING_BEHAVIOUR: Elite Seal **or** elite Far, never both. No extra HP.  
STATUS: PROPOSED

---

### ENC-DIAG-01

ENCOUNTER_ID: ENC-DIAG-01  
TYPE: movement / elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DIAG-BRICK` — 1× `diag_locksmith` bishop (`spell-diag-lock`, next walks must be diagonal) + 1× `brick_shifter` rook (`spell-brick-shift`, move an existing **barrier** 1 Chebyshev) + 1× cone bishop (`starter-frost` if `areaShape` unread; `spell-gale-cone` only if `hitTiles` exists).  
AI_REQUIREMENTS: Locksmith: caster; skip if the only remaining walk is already diagonal. Brick: setter; source is `barrierTiles`, **not** world walls; dest leaves a gallery. Cone: skip if `areaShape` unread (Frost-only). Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Diag Lock or Brick Shift can drop that id if missing. Extra door vs ENC-BIAS-01 — first child wins.  
MAP_REQUIREMENTS: Chessboard with a **diagonal gallery** plus one planted barrier that is not the only cover. Place `WF-TER-RAISE_SLAB` only if a second spawn→portal route already exists (player may pry cover). Reject maps with no diagonal step of length 1.  
SPECIAL_RULES: Cardinal step fails while painted. Spells remain legal. Player Brick Shift cannot mass-shove. Honesty: missing diag filter → ENC-BIAS-01 fallback. Missing `barrierTiles` writer → Frost pair, no brick.  
OBJECTIVE: Clear all. Intended: walk the diagonal, or raise/slide cover off the file.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Diagonal jail plus a sliding planted wall. Distinct from ENC-BIAS-01 (diagonal after cardinal pit) and ENC-HUG-01 (planted barrier +10). Prepares ENC-RUSH-40 / ENC-RUSH-41.  
SOLVABILITY_REQUIREMENTS: Evaluate solvability as if the slab were already a wall. Brick dest never seals the only exit. Cone tiles never occupy spawn.  
REPLAYABILITY: Diagonal NE vs NW. Peak: inherit Plumb Ember on a **cardinal** column so the illegal walk is also a tax.  
SCALING_BEHAVIOUR: Elite Locksmith only. Brick stays junior. Never two bricks.  
STATUS: PROPOSED

---

### ENC-BODY-01

ENCOUNTER_ID: ENC-BODY-01  
TYPE: priority-target / elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BODY-CAST` — 1× `body_marker` bishop (`spell-body-mark`, next hit on **that unit** ×1.5) + 1× `cast_marker` bishop (`spell-cast-mark`, detonates 12 if they cast a **non-Strike**) + 1× `coup_duelist` knight (`spell-coup-de-grace`, instant ≤25% — **not** Bell).  
AI_REQUIREMENTS: Body: skip if already marked. Cast: skip if they will Strike / walk / End Turn. Coup: refuse a healthy target (Jackal law). Do not pack Bell Sexton. Soph 4–5.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Body Mark, Cast Mark, or Coup can drop that id if missing. Extra door vs ENC-COUP-01.  
MAP_REQUIREMENTS: Open arena. No Time Warp on the mark window. No Glass Realm.  
SPECIAL_RULES: Body Mark is unit-scoped (they cannot walk it off). Cast Mark does not fire on Strike / walk / End Turn. Coup reads HP%, not absorb. One Inferno cadence.  
OBJECTIVE: Clear all. Intended: Strike / walk through Cast Mark, Absolve / wait Body Mark, stay above 25% into Coup.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two marks plus an execute. Priority is the Cast Marker if you must dump a spell, else the Coup if you are already wounded. Distinct from ENC-PRIO-04 (decoy king).  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy leaves a walkable ring.  
REPLAYABILITY: Coup chassis knight vs pawn. Peak: replace Coup with Flush (ENC-FLUSH-01) so the restored Inferno is the Cast-Mark bait.  
SCALING_BEHAVIOUR: Elite Cast Marker only. Never two Coups. No extra HP.  
STATUS: PROPOSED

---

### ENC-HOLD-02

ENCOUNTER_ID: ENC-HOLD-02  
TYPE: priority-target / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HOLD-RANGE` — 1× `hold_knight` (`spell-strike-hold`, Strike **illegal** until they walk) + 1× `gait_sealer` + 1× `far_stinger`.  
AI_REQUIREMENTS: Hold: flanker; other ids remain legal. Seal: casts legal. Far: skip at Chebyshev ≤ 1. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Strike Hold can drop that id if missing. Distinct from ENC-DULL-01 (Strike deals 0).  
MAP_REQUIREMENTS: Fortress + gallery. Far wants a 4-tile file. No Time Warp.  
SPECIAL_RULES: Do not PAIR Hold with Root (`snare_weaver`) — that is a spell lockout. Do not also Dull.  
OBJECTIVE: Clear all. Intended: walk to restore Strike **or** poke with other ids from 4 while sealed.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Strike-illegal plus walk-lock plus far gun. Mastery of ENC-LONE-01 / ENC-SEAL-01.  
SOLVABILITY_REQUIREMENTS: Gallery + file; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Hold west vs east. Peak: inherit Slow Hand (`WF-MOD-SLOW_HAND`) so 0-cooldown kit costs +1 AP — Attack Nearest stays legal.  
SCALING_BEHAVIOUR: Elite Hold **or** elite Far, never both. No extra HP.  
STATUS: PROPOSED

---

### ENC-ALLY-01

ENCOUNTER_ID: ENC-ALLY-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-ALLY-WICK` — 1× `ally_reeler` bishop (`spell-ally-reel`, pull 1 toward nearest **ally**) + 1× `echo_painter` queen **without heal** (`spell-echo-paint`, copy last cinder/rime/mire/void onto a neighbor) + 1× `fuse_binder` (`spell-fuse-tile`, 0 on cast).  
AI_REQUIREMENTS: Reel: skip if dest worse (lava / plumb next-cell / portal). Echo: skip if no live paint. Fuse: 0 on cast; dest legality; caster death does not cancel. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Ally Reel or Echo Paint can drop that id if missing. Extra door vs ENC-REEL-01.  
MAP_REQUIREMENTS: Arena plus **one** scripted paint cell (ember vein **or** rime **or** inherited plumb wash — pick **one**). Fuse cell is not the only aisle. Push/pull dest: free floor, player keeps ≥ 1 escape tile.  
SPECIAL_RULES: Attract toward **ally**, not caster (File Reel) and not other hostile (Foe Reel, Wave 10 — do not spawn). Teleport does not trip wires; fuse still ticks occupancy. No Glass Realm.  
OBJECTIVE: Clear all. Intended: occupy the reel dest, dispel / leave the copy, step off the wick.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Pull-to-ally plus copy-paint plus a 2-turn bomb. Distinct from ENC-FUSE-01 (kamikaze pull) and ENC-WICK-03 (heal wick).  
SOLVABILITY_REQUIREMENTS: Reel dest walk-off; fuse not on spawn/portal; paint exists before Echo can act.  
REPLAYABILITY: Paint type ember vs rime. Peak: inherit Retrace Dust so the reel dest cannot be a double-hop.  
SCALING_BEHAVIOUR: Elite Reel only. Fuse stays junior. Never two fuses on one cell.  
STATUS: PROPOSED

---

### ENC-BLINK-01

ENCOUNTER_ID: ENC-BLINK-01  
TYPE: movement / elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BLINK-RANK` — 1× `blink_sealer` bishop (`spell-blink-seal`, 2 turns cannot Swap / Phase Slip / pad / Pawn Trade; **walks remain legal**) + 1× `axis_locksmith` rook (`spell-rank-lock` or file lock) + 1× `rank_lancer` (`spell-file-lance` / file-only Strike clone).  
AI_REQUIREMENTS: Seal: skip empty board / already sealed. Lock: spells legal. Lancer: approach only along shared x or y (`AI-SYS-06`). Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Blink Seal or File Lance can drop that id if missing.  
MAP_REQUIREMENTS: Fortress file + gallery. Optional `WF-TEL-FAR_SWAP` on the **gallery** (ENC-MOVE-20) so the pad is illegal under Blink Seal — the tell is the far-anchor going dark.  
SPECIAL_RULES: Blink Seal blocks Swap/blink/pad only. Axis spells legal. Lancer file-only. Honesty: missing seal → ENC-FILE-01. Do not also Mist / Slip / Morrow Walker.  
OBJECTIVE: Clear all. Intended: walk off the file; do not spend the pad.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Cannot-blink plus axis lock plus file lance. Walk is the answer. Prepares ENC-RUSH-39 (seal + hook: reel is forced-move, legal).  
SOLVABILITY_REQUIREMENTS: Gallery exists; file is not a sealed pocket; Far Swap is optional.  
REPLAYABILITY: File N-S vs E-W. Peak: inherit File Wind so ending on the lancer’s file taxes.  
SCALING_BEHAVIOUR: Elite Sealer only. Lancer stays junior. No extra HP.  
STATUS: PROPOSED

---

### ENC-SURV-21

ENCOUNTER_ID: ENC-SURV-21  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Clock 8 player-turns. Start: 1× bishop Frost + 1× pawn. Every 3 enemy-team turns, spawn 1 reinforcement from {pawn, spare_pacer, lone_stinger Frost-only} until the timer ends. Max 4 living.  
AI_REQUIREMENTS: Group tactics if tier ≥ 4. Casters hold LoS. Spare never persist MP. Lone isolation only if the scan exists.  
SPELL_DISCOVERY_OPPORTUNITIES: Surviving without a long-range spell can later hint Melee Oath at rest (ENC-MELEE-01), not a grant.  
MAP_REQUIREMENTS: Arena with `WF-ENV-FILE_WIND` (3% max HP at end of turn if another living unit shares row or column). Skip if the map would start with only one living unit. Shelter = step off the shared file. Distinct from Isolation Chill (distance 3) and Sight Burn (LoS).  
SPECIAL_RULES: Clock is `surviveTurns: 8`. When the clock hits 0, remnants attempt to retreat; if they leave the board they despawn (do not count as player kills). Portal unlocks only after the board is empty. File-wind tax via challenge HP.  
OBJECTIVE: Be alive after 8 player turns, then clear or let remnants flee.  
FAILURE_CONDITION: Player death before the clock and cleanup.  
REWARD: Survival grant (depth × 40 Doka + 80 XP) plus kill XP only for units actually defeated. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Shared-file tax so late-game maps are not “void again” or “ash-rain again.” Clumping for ENC-LONE-01 now **costs**.  
SOLVABILITY_REQUIREMENTS: Off-file shelter cells exist; 4-unit occupancy leaves a walkable ring; tax is not a wall.  
REPLAYABILITY: Start bishop vs Lone Frost. Peak: overlap a Kin Plate on an off-file cell so shelter is the plate.  
SCALING_BEHAVIOUR: Overlap timing (first reinf at 3 vs 4) is the scaler. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-22

ENCOUNTER_ID: ENC-SURV-22  
TYPE: survival / optional challenge  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: `FSN-FLUSH-DUMP` Flusher only (no Lender — the clock is the leftover). Wave B overlaps at turn 3: `FSN-LONE-NAIL` Lone (no Seal). Wave C at turn 6: one Morrow Warden (no Dummy). Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Flusher once/battle. Lone isolation. Morrow arms plate if it will live.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-MOD-SLOW_HAND` (spells with `cooldown === 0` cost 1 extra AP; cooldown > 0 unchanged). Attack Nearest and summons are not spells. Never `titans_vigor`. Optional inherit File Wind from ENC-SURV-21 (`inheritModifierFrom` style — pick **one** of Slow Hand **or** File Wind, never both at PEAK).  
SPECIAL_RULES: Overlap + 0-cooldown tax is the escalation vs ENC-SURV-21. Flee remnants when the clock ends.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-21.  
TACTICAL_PURPOSE: Peak pressure that spends leftover Wave-10 modifier (`slow_hand`) and Flush tempo so late-game maps are not “file wind again.”  
SOLVABILITY_REQUIREMENTS: Melee / Attack Nearest / cooldown kits remain usable; 4-unit occupancy leaves a ring.  
REPLAYABILITY: Slow Hand vs File Wind. Wave C Morrow vs elite Spare.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-ELITE-20

ENCOUNTER_ID: ENC-ELITE-20  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GAIT-CHOIR` — `FSN-GAIT-PACE` plus 1× `boot_stinger` (`spell-boot-sting`, already-walked poke). Three bodies.  
AI_REQUIREMENTS: Mender / Spare as ENC-PACE-01. Boot: walk then sting; forced-move does not pay. Soph 4–6. Lethal lookahead allowed except gates 9/10.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Boot Sting can drop that id if missing (extra door vs ENC-BOOT-01 — first child wins).  
MAP_REQUIREMENTS: Fortress courtyard + gallery. Optional dust on a **flank**. No Time Warp.  
SPECIAL_RULES: Band 0: **do not spawn**. No `pale_cantor` / `post_stinger`. One Inferno cadence.  
OBJECTIVE: Clear all. Intended: deny the Mender’s step, then the Boot’s spent walk.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walked heal + spare + walked poke. Mastery of ENC-PACE-01, not more HP.  
SOLVABILITY_REQUIREMENTS: Gallery; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Boot west vs east. Peak: inherit Slow Hand so 0-cooldown Boot-adjacent kit costs extra AP.  
SCALING_BEHAVIOUR: Elite Mender only (`FSN-GAIT-PACE/E-GAIT` inside the choir). Boot stays junior.  
STATUS: PROPOSED

---

### ENC-ELITE-21

ENCOUNTER_ID: ENC-ELITE-21  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FLUSH-LEND` — `FSN-FLUSH-DUMP` plus 1× `ignite_alchemist` (`spell-ignite-stacks`, consume DoTs). Three bodies.  
AI_REQUIREMENTS: Flush / Lend as ENC-FLUSH-01. Ignite: skip if stack gate < 2. One Inferno cadence (the flushed id is the Alchemist’s, two windows on **their** bar). Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Ignite can drop that id if missing.  
MAP_REQUIREMENTS: Arena. No Glass Realm. No Time Warp on the Flush window.  
SPECIAL_RULES: Do not also pack Bell / Coup as a fourth execute. Do not Verse-steal.  
OBJECTIVE: Clear all. Intended: kill the Flusher before the restored Ignite window.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing`.  
TACTICAL_PURPOSE: Flush + leftover dump + cash-in. Mastery of ENC-FLUSH-01.  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy leaves a ring.  
REPLAYABILITY: Alchemist chassis bishop vs queen (still no healAmount).  
SCALING_BEHAVIOUR: Elite Flusher only. Alchemist stays junior. No extra HP.  
STATUS: PROPOSED

---

### ENC-PROT-11

ENCOUNTER_ID: ENC-PROT-11  
TYPE: protection  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `dummy_prelate` (plants a post that **is** the objective body) + 1× `lone_stinger` trying to snipe the player, not the post. Optional 1× pawn.  
AI_REQUIREMENTS: Dummy plants then steps off. Lone isolation vs the **player**. The post is allied to the Dummy (enemy-side) — this room inverts the usual “protect the shrine” by making the **player’s planted Raise Slab** the thing that must survive as cover, not an allied NPC.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Fortress + `WF-TER-RAISE_SLAB` (adjacent 1 AP pries a flagstone into a wall for the rest of the map). Place only when a second spawn→portal route already exists. Evaluate solvability as if already a wall. Optional kin plate on the long path.  
SPECIAL_RULES: Objective is **not** “keep an allied unit alive” (Stralt has no escort HP writer). Objective: raise the slab **before** the Lone’s second activation, then clear hostiles. `objectiveKind: raise_cover_then_clear`. Failure does **not** trigger if the slab stays floor — that is a worse fight, not a wipe, unless `FAILURE_CONDITION` overlay is on. Distinct from ENC-PROT-03 (decoy) and ENC-CART-01.  
OBJECTIVE: Optional: raise the slab before taking 50 challenge HP, then defeat all hostiles. Required: defeat all hostiles.  
FAILURE_CONDITION: Player death. Optional challenge fail: never raised the slab (overlay only).  
REWARD: Standard + small bonus Doka if the slab was raised (`applyRewards`). Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Spend 1 AP to create cover against an isolation gun. Inverse of smash-to-clear.  
SOLVABILITY_REQUIREMENTS: Second route exists; raised cell never the only exit; post plant ring legal.  
REPLAYABILITY: Slab west vs east. High: add File Wind so the cover file is a tax.  
SCALING_BEHAVIOUR: Elite Lone. Dummy stays junior. Never two slabs.  
STATUS: PROPOSED

---

### ENC-PRIO-13

ENCOUNTER_ID: ENC-PRIO-13  
TYPE: priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Visible: `FSN-FLUSH-DUMP` Flusher (glass) + Lender. Real threat: the Flusher. Optional decoy rook with `starter-shield` only.  
AI_REQUIREMENTS: Flusher is `realId`. Decoy rook is `decoyId` if present (no name check). Lender dumps leftover onto the Flusher, not the decoy.  
SPELL_DISCOVERY_OPPORTUNITIES: Flush / Lend as ENC-FLUSH-01.  
MAP_REQUIREMENTS: Open court. Flusher starts at Chebyshev ≥ 4. Decoy camps a choke.  
SPECIAL_RULES: Portal locked until **all** hostiles die (decoy included). Bonus Doka if the Flusher dies before the Lender’s first dump. Distinct from ENC-PRIO-12 (spark timing) and ENC-PRIO-04 (pawn-king decoy).  
OBJECTIVE: Clear all. Intended: cut the Flusher first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus if Flusher dies first (`applyRewards`). Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Priority is the CD gift, not the leftover mule, not the fat decoy.  
SOLVABILITY_REQUIREMENTS: All reachable; decoy cannot spawn on the portal.  
REPLAYABILITY: Decoy present vs omitted (low band).  
SCALING_BEHAVIOUR: High: add Ignite (ENC-ELITE-21) as the flushed ally — still cut Flusher first. No extra HP.  
STATUS: PROPOSED

---

### ENC-MOVE-20

ENCOUNTER_ID: ENC-MOVE-20  
TYPE: movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) in the backline + 1× pawn mid.  
AI_REQUIREMENTS: Bishop kites. Pawn greedy. Neither spends the pad on purpose unless soph ≥ 4 and the player is the farthest body.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a farthest-swap lesson.  
MAP_REQUIREMENTS: Dual-lane. One cyan `WF-TEL-FAR_SWAP` on the near lane (entering for 1 MP swaps you with the farthest other living unit; Chebyshev; initiative tiebreak). Inverse of Swap Anchor (nearest). Map solvable without using it. Not on spawn/portals.  
SPECIAL_RULES: 1 MP from current MP. Not a teleport spell — do not key off `effectCategory`. Forced-move does not pay Gait Mend. Distinct from ENC-DISP-01 (nearest swap telegraph) and ENC-MOVE-18 (backstep).  
OBJECTIVE: Defeat both. Optional: never use the pad, **or** use it once to yank the bishop.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the far-anchor trades you with the **farthest** body; standing closer makes you not the yank.” Prepares ENC-BLINK-01 (pad goes illegal).  
SOLVABILITY_REQUIREMENTS: Floor pad; both hostiles reachable without it.  
REPLAYABILITY: Pad west vs east. High: inherit Blink Seal after ENC-BLINK-01 is taught (pad dark).  
SCALING_BEHAVIOUR: Mid: bishop gains `spell-slow`. High: replace pawn with Spare Pacer. Never add a second pad.  
STATUS: PROPOSED

---

### ENC-MOVE-21

ENCOUNTER_ID: ENC-MOVE-21  
TYPE: movement / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× rook camping the **long** path + 1× bishop on the short path behind `WF-OBS-SPELL_SILL`.  
AI_REQUIREMENTS: Rook camps the long path. Bishop kites once the sill opens.  
SPELL_DISCOVERY_OPPORTUNITIES: First player `SpellConfig` this map unlatches the sill — observing that the Attack Nearest did **not** open it is the lesson (no grant).  
MAP_REQUIREMENTS: Short-path corridor cell starts as a wall (`WF-OBS-SPELL_SILL`). After the player casts any `SpellConfig`, it becomes floor. Place only when a second spawn→portal route already exists. Never the only exit. Distinct from Coin Sill (1 AP), Tithe Sill (HP), and Latch Sill (camp adjacent).  
SPECIAL_RULES: Attack Nearest is not a spell. Summons are not a spell. `holdPortalLocked` until hostiles are dead.  
OBJECTIVE: Clear all. Optional: open the short path with a cheap frost, then ignore the long rook.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns` rewards the short path.  
TACTICAL_PURPOSE: Spend a spell to open a wall. Inverse of ENC-AMBUSH-11 (spell **calls** a gun).  
SOLVABILITY_REQUIREMENTS: Long path reaches exit without the sill. Sill never the only exit.  
REPLAYABILITY: Sill north vs south. High: Spell Picket stands **on** the opened cell (ENC-AMBUSH-11 combine).  
SCALING_BEHAVIOUR: High: bishop is Lone Frost. Never two sills.  
STATUS: PROPOSED

---

### ENC-KIN-01

ENCOUNTER_ID: ENC-KIN-01  
TYPE: protection / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop Frost + 1× pawn. Player is expected to bring or summon a body.  
AI_REQUIREMENTS: Generic. Wounded AI does not treat the plate as lava (it is a one-shot).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Mid-band `WF-TRP-KIN_PLATE` as the only short approach; long gallery around. Distinct from ENC-HAZ-22 (adds dust).  
SPECIAL_RULES: First stepper pays 8% unless a living allied summon is orthogonally adjacent. Then floor.  
OBJECTIVE: Clear all. Optional: never pay the kin tax.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Reinforce “summon first, then step.” Prepares ENC-MORROW-01 (the post can be enemy kin, not yours).  
SOLVABILITY_REQUIREMENTS: Long gallery exists. Plate never hidden.  
REPLAYABILITY: Plate left vs right.  
SCALING_BEHAVIOUR: High: inherit ENC-HAZ-22 dust. Peak: Dummy plant beside the plate (enemy kin).  
STATUS: PROPOSED

---

### ENC-TUTOR-01

ENCOUNTER_ID: ENC-TUTOR-01  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-LIVE_TUTOR` — one same-tier enemy (medium threat) carrying 1 extra `usableByEnemy` spell from {`starter-frost`, `spell-iron-skin`, `spell-gait-mend` if walk writer exists}. Plus 1× pawn.  
AI_REQUIREMENTS: Tutor uses the extra id legally (SYS-13). Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: While they live, the player may spend that spell’s AP/MP to cast it **once per round**. Killing them grants the kill purse but ends the repeating loan. Does **not** call `upgradeSpell` and does not persist `spellLevel*` arrays. Distinct from Loaner Mage (one-shot without kill) and Grimoire Stalker (one-cast on death). Observation can still grant the id on win if missing.  
MAP_REQUIREMENTS: Open court. Prefer replacing one existing spawn. Must stay reachable.  
SPECIAL_RULES: Family lottery **off**. Metadata only (`usableByEnemy`, `targetType`, costs). Never name-check “tutor.”  
OBJECTIVE: Clear all. Optional: keep the tutor alive for N rounds then kill (greed).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional discovery grant on win. Overlay `under_15_turns` fights the greed.  
TACTICAL_PURPOSE: A repeating loan that is **not** possession. Kill vs keep is the choice.  
SOLVABILITY_REQUIREMENTS: Tutor reachable; counts as 1 toward `MAX_ENEMIES`.  
REPLAYABILITY: Loaned id frost vs iron-skin vs gait-mend.  
SCALING_BEHAVIOUR: High: loaned id is Spare Pace (buffer, no healAmount). Never two tutors.  
STATUS: PROPOSED

---

### ENC-COOL-01

ENCOUNTER_ID: ENC-COOL-01  
TYPE: rest choice / optional challenge  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× pawn + 1× bishop Frost. Soft fight so the stone is the decision.  
AI_REQUIREMENTS: Generic. Enemies can use the stone.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-ZON-COOL_STONE` — first unit to end a turn here this map banks one charge: their next spell this map with `cooldown > 0` may be cast as if cooldown were 0. Then the tile dries. Distinct from Short Fuse (map-wide round-1 lock) and Second Wind (AP refund).  
SPECIAL_RULES: Reads `SpellConfig.cooldown` only. Attack Nearest is not a spell. Null Field does not strip it.  
OBJECTIVE: Clear all. Optional: plant on the stone before the bishop does.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn` if you skipped the stone.  
TACTICAL_PURPOSE: Bank a cooldown skip or deny it. Choice, not a sponge.  
SOLVABILITY_REQUIREMENTS: Walkable. Never on spawn/portals.  
REPLAYABILITY: Stone center vs flank. High: inherit Slow Hand so 0-cooldown kit is expensive and the stone matters more.  
SCALING_BEHAVIOUR: High: bishop kit includes Inferno (zone ≥ 2) so the skip is Inferno. Never two stones.  
STATUS: PROPOSED

---

### ENC-TREAS-11

ENCOUNTER_ID: ENC-TREAS-11  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Optional guardian: 1× rook if the player opens while a hostile still lives. Prefer empty court + chest.  
AI_REQUIREMENTS: Guardian greedy if spawned.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible `WF-TRS-FULL_CACHE`. 1 AP adjacent opens only if current HP ≥ 90% of max: medium `applyRewards`, no guardian. Below 90%, the AP is spent and the chest stays closed. Inverse of Wound Cache (below 50%). Distinct from Blood Lock (pay HP to open).  
SPECIAL_RULES: Credits via persist-lock `applyRewards`. Failed open spends AP only. `doka_fever` stays opt-in elsewhere — not this chest. Never `titans_vigor`.  
OBJECTIVE: Optional: open while healthy, then clear remaining hostiles (if any). Portal unlocks when hostiles are dead even if the chest stays closed.  
FAILURE_CONDITION: Player death. Skipping the chest is not a fail.  
REWARD: Medium `applyRewards` on successful open + standard kill XP. Overlay none (the HP gate *is* the challenge).  
TACTICAL_PURPOSE: Heal-then-loot vs walk past. Distinct from ENC-TREAS-10 (coin sill).  
SOLVABILITY_REQUIREMENTS: Adjacent-open, not a wall. Exit reachable without opening.  
REPLAYABILITY: Chest north vs south. High: Kin Plate on the approach so healthy-open still asks for a summon.  
SCALING_BEHAVIOUR: High: guardian spawns on failed-open retry after a heal. Never two chests.  
STATUS: PROPOSED

---

### ENC-MELEE-01

ENCOUNTER_ID: ENC-MELEE-01  
TYPE: optional challenge / treasure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LONE-NAIL` Frost-band (isolation gun wants range) + 1× pawn.  
AI_REQUIREMENTS: Lone isolation. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Steel inlay `WF-RSK-MELEE_OATH`. End a turn on it to flag this map. If the next `applyRewards` happens without a player spell whose `maxRange` > 1 since the flag, that credit uses the hard multiplier. Attack Nearest, summons, and `maxRange ≤ 1` spells do not break it. Distinct from Steel Hour (skip paid-AP spells) and Kindled Hour (must cast an AP spell).  
SPECIAL_RULES: Reads `SpellConfig.maxRange` only. Death still uses `saveBattleStats`. Overlay none.  
OBJECTIVE: Clear all. Optional: flag melee/short-range for a hard purse.  
FAILURE_CONDITION: Player death. Breaking the flag with one long cast is not a fail.  
REWARD: Hard multiplier on the next `applyRewards` if the oath held; else standard.  
TACTICAL_PURPOSE: A range-oath against an isolation gun that **wants** you to snipe. Distinct from ENC-SOLO-01 (no-pet).  
SOLVABILITY_REQUIREMENTS: Optional floor tile. Map solvable if never used.  
REPLAYABILITY: Inlay west vs east. Peak: inherit Slow Hand so 0-cooldown long kit is expensive anyway.  
SCALING_BEHAVIOUR: High: enable Gait Seal so walking in is also nailed — Attack Nearest from 1 is the answer.  
STATUS: PROPOSED

---

### ENC-CLEAN-01

ENCOUNTER_ID: ENC-CLEAN-01  
TYPE: rest choice / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× pawn chargers. Soft fight. No dust / plumb / kin on this map unless the player **chooses** the risk door.  
AI_REQUIREMENTS: Generic chargers.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Rest-style foyer with `WF-EVT-CLEAN_HANDS` (if the player never paid HP through challenge recorders, the next `applyRewards` uses the hard multiplier). Optional extra `WF-PRT-CLEAN_GATE` **only** on rest / overworld (forbidden in dungeon / rush / Death Realm). Distinct from Harvest Moon (never drop below 70% current HP) and Hearth Gate (100% current HP).  
SPECIAL_RULES: Keys off existing challenge recorders only. Clean Gate sealed after any challenge tick and is not an exit. Always in addition to a reachable stable portal.  
OBJECTIVE: Clear the pawns without a challenge tick, **or** take the stable exit after a normal fight.  
FAILURE_CONDITION: Player death. Taking a tick is not a fail; it just seals the gamble.  
REWARD: Hard `applyRewards` if clean; else standard. Clean Gate hard grant is a **separate** rest/overworld roll.  
TACTICAL_PURPOSE: Skip hazards for a purse. Distinct from ENC-OATH-01 (stillness) and ENC-REST-10.  
SOLVABILITY_REQUIREMENTS: No blocks. Leaving is always legal via the stable portal.  
REPLAYABILITY: Foyer with / without Clean Gate (dungeon omits the gate).  
SCALING_BEHAVIOUR: High: replace one pawn with a Frost bishop (still no floor tax). Never add Retrace Dust to a Clean Hands exam.  
STATUS: PROPOSED

---

### ENC-RARE-11

ENCOUNTER_ID: ENC-RARE-11  
TYPE: rare elite  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-PEEL-COURT` — `FSN-PAIR-PEEL` plus 1× `split_fanger` (`spell-split-fang`, 16+16 iff a second hostile Chebyshev ≤ 1) as leader. Four bodies. Leader boost 10% per fallen non-leader.  
AI_REQUIREMENTS: Full gates except 9/10. One gun per activation. Hinge dest legality. Leader cuttable. Dummy can be the illegal Fang cluster — **do not** plant Dummy on this COURT. Soph 6–8.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Split Fang can drop that id if missing.  
MAP_REQUIREMENTS: Wide courtyard + two flanks + rear tile. Reject cramped maps. Engagement pocket ≥ 2 walk-offs.  
SPECIAL_RULES: Insert 8% on depth 4 **after** ENC-PEEL-01 exists this account. No fifth body. Cap living 4. No Glass Realm. No Time Warp.  
OBJECTIVE: Clear all. Intended: cut the leader first **or** spread so Fang is 16.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-band `applyRewards` (1.60× on `level * 20` XP / Doka via existing elite table). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pair-hinge + isolation gun + cluster gun + seal. Rare insert, not a depth-5 sponge.  
SOLVABILITY_REQUIREMENTS: 4-unit occupancy leaves a gallery; hinge dests free; no turn-1 surround.  
REPLAYABILITY: Leader Fang vs elite Lone.  
SCALING_BEHAVIOUR: Do not add a fifth body. Tighten by leader boost, not HP. Hold while Pair Hinge dests missing.  
STATUS: PROPOSED

---

### ENC-REST-11

ENCOUNTER_ID: ENC-REST-11  
TYPE: rest choices  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None (rest map). Optional 1× pawn if a shrine contest is rolled — skip if the player is already in Death Realm.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine may remind (not grant) Gait Mend / Spare Pace / Lone Sting if observed this chain but not yet owned.  
MAP_REQUIREMENTS: Rest template. White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`). Three exits: `normal` / `dungeon` / `boss`. Optional Cool Stone (ENC-COOL-01) **or** Full Cache (ENC-TREAS-11) **or** Clean Hands (ENC-CLEAN-01) — pick **one**. Snapshot dungeon-chain refs **before** `cleanupMap`.  
SPECIAL_RULES: Rest-exit must re-arm depth 1 on the refs (`shouldArmDungeonChainOnRestExit`). `WF-PRT-CLEAN_GATE` rest/overworld only. No Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean in dungeon-chain rooms.  
OBJECTIVE: Choose an exit. Optional: take the one device.  
FAILURE_CONDITION: Player death only if a contest pawn is rolled and wins. Leaving is always legal.  
REWARD: None for walking out. Device rewards via `applyRewards` only.  
TACTICAL_PURPOSE: Heal vs risk vs branch. Distinct from ENC-REST-10 (weary / coin / bond).  
SOLVABILITY_REQUIREMENTS: Spawn, shrine, and all three portals flood-fill reachable. White portal at spawn, never `(0, 0)` unless spawn is `(0, 0)`.  
REPLAYABILITY: Device coin-flip Cool / Full / Clean.  
SCALING_BEHAVIOUR: Do not add enemies as a rest scaler.  
STATUS: PROPOSED

---

### ENC-BRANCH-11

ENCOUNTER_ID: ENC-BRANCH-11  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 2× pawn. Destination packs are **not** spawned here.  
AI_REQUIREMENTS: Greedy pawns.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Four-way foyer. Doors tagged `branch: pace | nail | flush | morrow`. Snapshot `branch` **before** `cleanupMap`. Each door is a locked portal until foyer hostiles are dead, then unlocks.  
SPECIAL_RULES: `branchFlag` is explicit metadata. Do not infer from door art names. Destinations: pace → ENC-PACE-01 / ENC-ELITE-20 / ENC-BOSS-11 (`bone_cavalier`); nail → ENC-LONE-01 / ENC-SEAL-01 / ENC-BOSS-11 (`void_grandmaster`); flush → ENC-FLUSH-01 / ENC-ELITE-21 / ENC-BOSS-11 (`pale_archivist`); morrow → ENC-MORROW-01 / ENC-PROT-11 / ENC-BOSS-11 (`weeping_pawn`).  
OBJECTIVE: Clear foyer, pick a door.  
FAILURE_CONDITION: Player death.  
REWARD: Standard foyer XP. Destination rewards on those rooms. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Account-level identity for the primer. Distinct from ENC-BRANCH-10 (purse/hinge/gait/dummy).  
SOLVABILITY_REQUIREMENTS: All four doors reachable after foyer clear. Never spawn on an unlocked portal.  
REPLAYABILITY: Door order shuffle. Already-cleared branch can hide that door.  
SCALING_BEHAVIOUR: Do not add a fifth door. High: foyer pawns become Frost bishops.  
STATUS: PROPOSED

---

### ENC-MINI-12

ENCOUNTER_ID: ENC-MINI-12  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: One live `BossId` by `branch`: pace → `bone_cavalier` (charge after a walk); nail → `void_grandmaster` (displacement / isolation); flush → `pale_archivist` (tempo / leftover); morrow → `weeping_pawn` (bait / 1-HP themed). Plus 1× pawn choir. No dual-boss. Do **not** spawn `sole_thurifer` / `bias_prebendary` / `brick_cellarer` / `rebound_almoner`.  
AI_REQUIREMENTS: Named `BossAbility` scripts only. Pack modules must not ignore walls (Cavalier jump stays tagged). Choir greedy. Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Boss kit observe → grant if missing, same pipeline.  
MAP_REQUIREMENTS: Boss arena. Preferred cells + choir cell reachable. Optional inherit from the branch (dust / file / kin / cool stone) — one tax max.  
SPECIAL_RULES: Mini-boss is a dungeon-depth capstone drill, not Rush. Portal locked until boss + choir dead.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss table via `applyRewards` (not Rush `dokaReward` / `xpReward` fields — those stay 0 on `completeBossRushRoom`). Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove the branch verb against a live 19-id kit.  
SOLVABILITY_REQUIREMENTS: Preferred cells + choir reachable. Finalize after placement.  
REPLAYABILITY: Choir pawn vs warden (iron-skin) for accounts that already beat this mini once.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by choir iron-skin, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-11

ENCOUNTER_ID: ENC-BOSS-11  
TYPE: mini-boss / boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag as ENC-MINI-12. If the chain taught decoy (ENC-PRIO-04) **and** morrow was not taken, mixed accounts may use `final_pawn` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** spawn Table I ids here.  
AI_REQUIREMENTS: Named boss abilities + kit legality (AI-SYS-16). Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Boss kit observe.  
MAP_REQUIREMENTS: Depth-max arena. One inherited tax from the primer (dust **or** file wind **or** kin **or** slow hand — pick one). Never `titans_vigor`.  
SPECIAL_RULES: Capstone. Snapshot branch before cleanup.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Depth-5 `applyRewards` (multiplier 4). Overlay `no_healing`.  
TACTICAL_PURPOSE: Mastery exam: paid step / isolation nail / flush tempo / delayed plate.  
SOLVABILITY_REQUIREMENTS: Spawn, boss, exit reachable. Hazard overlay after finalize.  
REPLAYABILITY: Branch skins.  
SCALING_BEHAVIOUR: Inherit a second role (Spare / Seal / Dummy) as choir, not HP.  
STATUS: PROPOSED

---

### ENC-MAST-11

ENCOUNTER_ID: ENC-MAST-11  
TYPE: waves / mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn; retrace dust live. Wave 2: `FSN-GAIT-PACE` **or** `FSN-LONE-NAIL` **or** `FSN-FLUSH-DUMP` **or** `FSN-MORROW-POST` by `branch`. Wave 3: elite leftover (E-GAIT **or** E-SHOT **or** E-FLUSH **or** E-PLATE) + leftover. Never more than 4 living.  
AI_REQUIREMENTS: Full gates except 9/10. Honesty rerolls apply per pack.  
SPELL_DISCOVERY_OPPORTUNITIES: Finish any incomplete observe from the chain.  
MAP_REQUIREMENTS: Fortress + aisle. Dust on the aisle. `waveSpawnCells` far lane.  
SPECIAL_RULES: Portal locked until wave 3 clear. Skip unplaceable waves. Lottery **off**.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery-band `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove paid step, isolation nail, flush tempo, or delayed plate.  
SOLVABILITY_REQUIREMENTS: As ENC-WAVE-12 plus dust gallery.  
REPLAYABILITY: Branch skin. Peak: wave 2 is `FSN-PEEL-COURT` only if ENC-RARE-11 already inserted this account (still cap 4 — drop Dummy / Spare).  
SCALING_BEHAVIOUR: Wave 2 pack, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-39

ENCOUNTER_ID: ENC-RUSH-39  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table I `I0` — `sole_thurifer` + `hook_regent`. Winch and Thurible are both objects.  
AI_REQUIREMENTS: Named Wave-11 boss scripts. Seal **never** resolves on a hook-glow turn (one answer). Reel is forced-move (does **not** spend walk MP — legal under Gait Seal). Gates 9/10 off. Living hostiles well under `MAX_ENEMIES`.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Gait Seal / Hook Line if missing.  
MAP_REQUIREMENTS: Rush arena. Seal never on hook glow. Preferred cells reachable. Do not rewrite `BOSS_RUSH_ROOMS` 0–9.  
SPECIAL_RULES: Unlock after one complete Table H clear (`H0`–`H3`). New `roomIndex` namespace `I0`. Hold this variant if seal-on-glow / reel objects are missing. Not Rank Lock / Must Pace / Stride / Goad / Hex / Fosse / Conductor. Player Gait Seal cannot seal pets. Dual-boss Rush only.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death. `completeBossRushRoom` still ignores client `dokaReward`/`xpReward`.  
REWARD: Rush persist via existing room-clear funnel; credits through `applyRewards` only after `currentRoom` actually advanced.  
TACTICAL_PURPOSE: Add the seal-vs-reel readability the Pace / Nail primer taught in ENC-BLINK-01 / ENC-LONE-01, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + objects reachable. Seal never occupies the only walk-off on a glow turn.  
REPLAYABILITY: First Table I clear vs later skins (choir pawn vs warden).  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-40

ENCOUNTER_ID: ENC-RUSH-40  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table I `I1` — `bias_prebendary` + `mill_seneschal`. Hopper and Quoin are both objects. Bias P2 archer counts toward cap 4.  
AI_REQUIREMENTS: Mill cells **never** occupy a legal diagonal step. Mill is forced-move (legal under Diag Lock). Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Diag Lock if missing.  
MAP_REQUIREMENTS: Rush arena with a diagonal gallery. Mill never on a legal diagonal step.  
SPECIAL_RULES: `I1` after I0. Hold if mill / diag filter missing. Not Rank Lock / Sole / Rime / Lock. Player Diag Lock cannot brand pets. Hazard-tick mill dest waits on MIMA-005 — dest onto those paints is **illegal AI**.  
OBJECTIVE: Defeat both. Intended: ride the cardinal mill, then walk the diagonal.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-39.  
TACTICAL_PURPOSE: Add the diagonal-after-forced-move exam ENC-DIAG-01 taught.  
SOLVABILITY_REQUIREMENTS: A legal diagonal step exists that is not a mill cell.  
REPLAYABILITY: Mill clockwise vs counter.  
SCALING_BEHAVIOUR: Do not add a third boss. Archer already in cap 4.  
STATUS: PROPOSED

---

### ENC-RUSH-41

ENCOUNTER_ID: ENC-RUSH-41  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table I `I2` — `brick_cellarer` + `gaze_beadle`. Crosier and Mortar are both objects.  
AI_REQUIREMENTS: Brick dest **never** occupies the pin telegraph. Forced-move does **not** rewrite facing (the exam is the walk *after*). Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Brick Shift if missing.  
MAP_REQUIREMENTS: Rush arena with one planted barrier. Brick dest never on the pin telegraph.  
SPECIAL_RULES: `I2` after I1. Hold if `barrierTiles` slide missing. Not Palisade / Fortress / Fosse / Wedge / Queen. Player Brick Shift cannot mass-shove.  
OBJECTIVE: Defeat both. Intended: shift the brick that was blocking the look, then do not look.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-39.  
TACTICAL_PURPOSE: Sliding cover vs a gaze pin. Distinct from ENC-PROT-11 (player-raised slab).  
SOLVABILITY_REQUIREMENTS: Brick dest leaves a gallery; pin telegraph is public.  
REPLAYABILITY: Mortar west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-42

ENCOUNTER_ID: ENC-RUSH-42  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table I `I3` — `rebound_almoner` + `wedge_prior`. Lectern and Alms-dish are both objects.  
AI_REQUIREMENTS: Cone tiles **never** occupy the Alms-dish tile. The cone *is* an applied hit (legal Return consume). Gates 9/10 off. If cone `areaShape` unread, hold this variant.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Return Sting if missing (extra door vs ENC-MORROW-01 `/RETURN`).  
MAP_REQUIREMENTS: Rush arena. Cone never on the Alms-dish.  
SPECIAL_RULES: `I3` after I2. Unlock Table I complete after this room. Hold if Return / cone missing. Not Cover / Sovereign / Archbishop / Queen / Ram. DoT / lava do not consume Return.  
OBJECTIVE: Defeat both. Intended: arm the bowl, eat the cone, poke half back — **or** break the dish first.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-39. Jackpot language stays on live room 9, not I3.  
TACTICAL_PURPOSE: Return-sting readability after ENC-MORROW-01 `/RETURN`, without a third boss.  
SOLVABILITY_REQUIREMENTS: Dish and lectern reachable; cone occupancy leaves a walk-off.  
REPLAYABILITY: Wedge west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by dish HP, not boss HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain U — “Pace / Nail Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-11 then ENC-SPELL-21 (or ENC-SPELL-22 if Gait Mend already owned) |
| 2 | Reinforce | ENC-WAVE-12 |
| 3 | Combine | ENC-PACE-01 **or** ENC-LONE-01 **or** ENC-FLUSH-01 |
| 3 insert | Choice | ENC-BRANCH-11 → pace/nail/flush/morrow destinations |
| 4 | Pressure | ENC-SURV-21 **or** ENC-MORROW-01 **or** ENC-PEEL-01 **or** skip via ENC-REST-11 |
| 4 | Mastery | ENC-MAST-11 (branch skin) |
| 5 | Boss | ENC-BOSS-11 |

Rare: 8% on depth 4 to **insert** ENC-RARE-11 before mastery (only if ENC-PEEL-01 exists this account).  
Treasure: rest may offer ENC-TREAS-11 instead of ENC-PROT-11.  
Flush side-story: replace combine with ENC-PRIO-13 and mini-boss ENC-MINI-12 (`pale_archivist`).

### Chain V — “File / Slab Primer” (maxDepth 4)

ENC-MOVE-20 → ENC-MOVE-21 → ENC-DIAG-01 → ENC-REST-11 → ENC-BOSS-11 (`void_grandmaster` only if Nail was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-20 as teach on accounts that already know retrace/dust.

### Rush injection (day-11)

After one full Table H clear, ENC-REST-11 shrine can enable: I0 → ENC-RUSH-39, I1 → ENC-RUSH-40, I2 → ENC-RUSH-41, I3 → ENC-RUSH-42. Day-1…day-10 flags for rooms 0–9 and Tables B–H remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-11, ENC-SPELL-21, ENC-SPELL-22 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-21, ENC-HAZ-22, ENC-KIN-01 | `under_50_damage` |
| ENC-PACE-01, ENC-LONE-01, ENC-FLUSH-01, ENC-ELITE-20, ENC-ELITE-21 | `under_8_ap_per_turn` |
| ENC-WAVE-12, ENC-PRIO-13, ENC-MAST-11 | `under_10_turns` |
| ENC-MORROW-01, ENC-HOLD-02, ENC-PROT-11 | `direct_hit` |
| ENC-WICK-03, ENC-PAD-01, ENC-ELITE-21, ENC-BOSS-11 | `no_healing` |
| ENC-SURV-21, ENC-SURV-22 | `no_healing` (not `no_damage_taken`) |
| ENC-MOVE-20, ENC-MOVE-21, ENC-DIAG-01, ENC-BLINK-01 | `under_50_damage` |
| ENC-TREAS-11 / ENC-REST-11 / ENC-CLEAN-01 / ENC-MELEE-01 / ENC-TUTOR-01 / ENC-COOL-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | 4 retrace-dust tiles **or** 1 plumb column | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | dust **or** kin plate | kill + optional glyph |
| MID | named drop-10 `FSN-*` or waves | backline guard | zone 1 + Gait/Lone/Flush | one Wave-10 `WF-*` | clock / tags / far-swap |
| HIGH | elite or peel | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / peel / hold |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / COURT / rare | branch-skinned | mastery / Table I |

If a live player is over-levelled for a band, **promote the band’s verb** (add Spare, enable Seal, inherit dust, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-10 fields plus:

```
encounterId
encounterType        // + pace | lone | flush | morrow | peel | wick_heal |
                     //   pad | seal_file | diag_brick | body_cast | hold_range |
                     //   ally_wick | blink_rank | kin | tutor | cool | melee_oath |
                     //   clean_hands | spell_picket | retreat_column | far_swap |
                     //   spell_sill | raise_cover
formationId?         // FSN-GAIT-PACE | FSN-LONE-NAIL | FSN-FLUSH-DUMP |
                     // FSN-MORROW-POST | FSN-PAIR-PEEL | FSN-WICK-SEAL |
                     // FSN-SPLIT-PAD | FSN-GAIT-CHOIR | FSN-FLUSH-LEND |
                     // FSN-SEAL-FILE | FSN-DIAG-BRICK | FSN-BODY-CAST |
                     // FSN-HOLD-RANGE | FSN-ALLY-WICK | FSN-BLINK-RANK |
                     // FSN-PEEL-COURT
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // pace | nail | flush | morrow
decoyId? / realId?   // ENC-PRIO-13
holdPortalLocked?
objectiveKind        // + raise_cover_then_clear | open_full_cache |
                     //   flag_melee_oath | keep_tutor | bank_cool_stone
failureKind
deviceTable[]        // ENC-REST-11 Cool / Full / Clean
rushVariant?         // table_i0_seal_hook | table_i1_diag_mill |
                     //   table_i2_brick_gaze | table_i3_rebound_wedge
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Tutor / Final Pawn / Dummy” logic — use `decoyId` / `realId` / `formationId` / `summonAI === "dummypost"`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-27 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not. `fog_of_war` may still be used as a **wall-hook substitute** for ambush concealment, matching day-1…10 language.
- Dual-boss dungeon capstones (Rush only).
- Consuming same-day 2026-09-28 Wave 11 family / spell / world catalogs (PR #719 / #726 / #727). Wave 10 families (`shove_mender`, `gait_wicker`, `dry_stinger`, `quad_prelate`, …) wait for a later formation drop. `FSN-TRIPLE-PLUG` / Quad Span stay held while `ENEMY_SUMMON_CAP` is 2 (Quad needs remaining ≥ 4).
- Faking Gait Mend without walk-spend, Lone +8 without isolation scan, Flush without once/battle ally CD0, Morrow Plate as current-turn absorb, Pair Hinge as Swap, Wick Mend as Fuse, Brick Shift on world walls, Strike Hold as Strike 0, Ally Reel as File Reel, Far Swap as nearest Swap, Spell Sill opening on Attack Nearest, Clean Gate in a dungeon.
- Adding Wave-11 boss ids to dungeon ENC-BOSS-11 in the same PR as a Rush remap.

---

## 10. Pick order (day-11, after days 1–10 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–10 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-11 + ENC-SPELL-21 (retrace / gait-walk verbs)  
2. ENC-WAVE-12 (`formationId` GAIT-PACE → LONE-NAIL)  
3. ENC-PACE-01 or ENC-LONE-01 or ENC-FLUSH-01 (new pressure objects)  
4. ENC-BRANCH-11 (`branch: pace|nail|flush|morrow` snapshot-before-cleanup)  
5. ENC-BOSS-11 branch read  
6. Rush Table I variants 39–42 one room at a time (after the account has one full Table H clear)

Uniqueness: this file is the **eleventh** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
