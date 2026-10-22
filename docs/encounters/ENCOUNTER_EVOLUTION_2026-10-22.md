# Encounter Evolution Catalog — 2026-10-22

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-22-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-13 Wave 12 packs `docs/design/ENEMY_FORMATIONS_2026-10-21.md` (PR #825), Wave 13 world features in `docs/WORLD_DYNAMICS.md` (PR #848, `WDD-2026-10-21-001`), Rush Table L `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.11 (PR #836). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-22) Wave 14 family / spell / world-feature catalogs, if any land in parallel, stay **unconsumed**. Wave 13 **families** (`dry_gaiter`, `cadence_imprinter`, `six_prelate`, `odd_hooder`, `lean_stinger`, `parched_stepper`, … — PR #840) wait for a later formation drop (drop 14). Wave 14 **bosses** stay Rush-only (Table L). Wave 12 **families** (`heave_mender`, `dual_keeper`, `mid_hooder`, `ready_stinger`, `cinder_reeler`, `drift_prelate`, … — PR #796) are legal **metadata locks** on drop-13 sheets, not a 30% lottery.

---

## 1. Why a fourteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–13 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, and Both/Stride/Near. Day-13 rooms spent leftover drop-12 packs (`FSN-BOTH-SPEND`, `FSN-STRIDE-DAMP`, `FSN-NEAR-MUST`, …) and Wave 12 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-13 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-13 Wave 12 packs | Day-13 taught dual-**walk** heal / leftover-**MP** bank / melee-band miss as **rooms**. Still PDFs: `FSN-HEAVE-LEND`, `FSN-DUAL-READY`, `FSN-MID-DRIFT`, `FSN-CINDER-MARK`, `FSN-DRIFT-GATE`, `FSN-SPIKE-TAP`, `FSN-OFF-FEE`, `FSN-INCH-OATH`, `FSN-HEAVE-CHOIR`, `FSN-DUAL-BANK`, `FSN-MID-STEP`, `FSN-HEAVE-QUIET`, `FSN-HALVE-PACE`, `FSN-RITE-LONG`, `FSN-BAR-PIN`, `FSN-DRIFT-COURT` |
| World-feature Wave 13 | Day-13 **rooms** never spent `WF-HAZ-ODD_SEAM`, `WF-HAZ-STILL_CINDER`, `WF-TRP-SPENT_PLATE`, `WF-TER-FOLD_WALL`, `WF-OBS-KILL_SILL`, `WF-ZON-RIVAL_FONT`, `WF-TEL-WOUND_STEP`, `WF-INV-PAIRED_FILE`, `WF-ELT-FAR_PICKET`, `WF-TRS-TURN_CACHE`, `WF-SPL-RANGE_TUTOR`, `WF-RSK-CAST_OATH`, `WF-MOD-ONE_STRIDE`, `WF-EVT-SUMMON_BELL`, `WF-ENV-OPEN_DRAFT` |
| Rush Table L | `L0`–`L3` (`effigy_clerk`+`lock_marshal`, `enter_deacon`+`stride_censor`, `split_acolyte`+`cord_familiar`, `quiet_chorister`+`bone_cavalier`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `oddSeamCells` / `stillCinderCell` / `spentPlateCell` / `foldWallCell` / `killSillCell` / `rivalFontCell` / `woundStepPads` / `openDraftArmed` / `oneStrideArmed` / `farPicketArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Drift Post count as **1**. Sept Plug / `FSN-DRIFT-COURT/SEPT` count as **7** — do not spawn them while remaining cap < 7 (live cap is 2). Six Span (`six_prelate`) counts as **6** — wait for drop 14.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Heave / Dual / Bar / Rival bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Heave Mend / Bar Mend / Rival Font live **only** on the named profiles.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-MARK_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-SUMMON_BELL` is exploration only (run maps require a clear).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-14 ids (`effigy_clerk`, `enter_deacon`, `split_acolyte`, `quiet_chorister`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Foe Reel / Paint Reel / Cinder Reel / Init Swap / Clear Step / Heave Step **does not** count as walk-MP for Dual Keep, Ready Sting, Tapped Plate, Verse Pace peel, or Spent Plate. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`.
- Heave Mend pays only if **both** already have `forcedMovedThisTurn`. One still body is 0 HP. Drift Lend is +1 current AP to an ally **after** they were shoved — not ungated Tempo, not Spent Lend (walk), not Dual Keep (next-start bank). Mid Hood zeros a hit from Chebyshev **exactly 2**, not ≤ 1 (Near) or ≥ 3 (Far). Must Drift forces remaining walks along `lastForcedMoveDir`, not Chebyshev 1 (Must Step) or Manhattan 2 (Must Span). Inch Stride caps **one** next walk at Chebyshev ≤ 1; stand (0 walk) is legal. Cinder Reel is the **fifth** `applyAttract` dest (file / ally / foe / paint / then hazard). Drift Post walk-on is **safe**; relocate-on detonates. Spike Skip is next **1-tile** walk only; a 2-step onto spikes still ticks. Off Plate zeros the next **off-turn** hit; hits on the Plater’s own turn land. Halve is `floor(remaining/2)` — 0 stays 0. Rite First refuses Strike until a **spell** resolves; Long Oath then wants that spell at range ≥ 3. Bar Mend heals iff a spell resolved this turn (`lastResolvedSpellId`).
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 12 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-HEAVE-01 / ENC-SPELL-27 / ENC-ELITE-26 | `forcedMovedThisTurn` on **both** bodies **or** ally `targetId` for Drift Lend | Convert to ENC-BASH-01 (queued day-12) without claiming Heave |
| ENC-READY-01 / ENC-ELITE-27 (bank skin) | leftover-**AP and MP** snapshot paid at next own turn start | Convert to ENC-DAMP-01 (queued day-13) without claiming Dual / Ready |
| ENC-MID-01 / ENC-SPELL-28 | Mid Hood exact-2 consume **or** `lastForcedMoveDir` with a legal step along that vector | Convert to ENC-NEAR-01 (queued day-13) without claiming Mid |
| ENC-CINDER-01 | fifth `applyAttract` dest (hazard) **or** a living lava/cinder/pit cell | Convert to ENC-PAINT-01 (queued day-13) without claiming Cinder |
| ENC-DRIFT-01 | relocate-landing detonate **and** walk-on 0 **or** `summonAI === "driftpost"` | Convert to ENC-DUMMY-01 (queued day-10) without claiming Drift |
| ENC-SPIKE-01 | 1-tile spike-as-floor **or** leftover-AP-0 +RES | Convert to ENC-SKIP-01 (queued day-13) without claiming Spike |
| ENC-INCH-01 | one next walk Chebyshev ≤ 1 **or** Long Oath range ≥ 3 | Convert to ENC-NEAR-01 without claiming Inch |
| ENC-OFF-01 | off-turn miss consume **or** overwatch snap +1 AP tax | Convert to ENC-BRICK-01 (queued day-13) without claiming Off |
| ENC-HALVE-01 | `floor(remaining/2)` **or** `lastResolvedSpellId` for Verse Pace | Convert to ENC-TRIM-01 (queued day-13) without claiming Halve |
| ENC-RITE-01 | Strike refuse until a spell **or** Long Oath | Convert to ENC-HOLD-03 (queued day-12) without claiming Rite |
| ENC-PIN-02 | Bar Mend `lastResolvedSpellId` **or** Cadence Pin freeze-one | Convert to ENC-BRAND-01 (queued day-8) without claiming Bar |
| ENC-FOLD-01 | 1-AP fold until round start **or** 2-AP smash | Convert to ENC-MOVE-24 (queued day-13, heal-sill) without claiming Fold |
| ENC-SPENT-01 | first-action (0 AP spent) plate tax | Convert to ENC-SIDE-01 (queued day-13) without claiming Spent |
| ENC-KILL-01 | wall→floor after a recorded HP-to-0 | Convert to ENC-MOVE-24 without claiming Kill |
| ENC-WOUND-01 | below-50% pad (occupied dest swaps) | Convert to ENC-CLEAR-01 (queued day-13) without claiming Wound |
| ENC-PROT-14 | Rival Font heal only if a living enemy is Chebyshev ≤ 2 | Convert to ENC-PROT-13 (queued day-13, Labor) without claiming Rival |
| ENC-PRIO-16 | one-cast if the player ends a turn at Chebyshev ≥ 4 while they live | Convert to ENC-PRIO-15 (queued day-13) without claiming Range Tutor |
| ENC-AMBUSH-14 | elite appears only while player Chebyshev ≥ 6 | Convert to ENC-AMBUSH-13 (queued day-13, ≥80% HP) without claiming Far |
| ENC-SURV-27 | end-of-turn tax if ≥ 3 empty orthogonal floor neighbors | Convert to ENC-SURV-25 (queued day-13) without claiming Open Draft |
| ENC-PAIR-02 | −20% incoming while both bonded elites live | Convert to ENC-WAVE-15 without claiming Paired File |
| ENC-RUSH-51…54 | Table L bosses + mannequin/narthex/pyx/muffler objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Heave / Dual / Mid primer + inserts)

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

| Beat | Depth hint | Job | Day-14 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (odd-seam hop, dual-force heal, still cinder) | ENC-TEACH-14, ENC-SPELL-27, ENC-HAZ-27 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-15, ENC-AMBUSH-14, ENC-SPELL-28 |
| Combine | 2–3 | Two taught verbs | ENC-HEAVE-01, ENC-READY-01, ENC-MID-01, ENC-HAZ-28, ENC-FOLD-01, ENC-SPENT-01 |
| Pressure | 3 | Clock, cluster, pull-to-cinder, or dual wallet | ENC-SURV-27, ENC-PROT-14, ENC-CINDER-01, ENC-DRIFT-01, ENC-PRIO-16, ENC-HALVE-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-14, ENC-BRANCH-14, ENC-TREAS-14, ENC-CAST-01, ENC-TURN-01, ENC-SUMMON-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-26, ENC-ELITE-27, ENC-RARE-14, ENC-MAST-14, ENC-SPIKE-01, ENC-INCH-01, ENC-RITE-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-15, ENC-BOSS-14, ENC-RUSH-51…54 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–13 remain valid. Day-14 **Heave / Dual / Mid primer** is the default for accounts that already cleared Both / Stride / Near once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-14

ENCOUNTER_ID: ENC-TEACH-14  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is an odd-round path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile ochre ribbon of `WF-HAZ-ODD_SEAM` across the mid-band (walk tiles cost 4% max HP **only on odd rounds**; even rounds are free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First odd-round seam tax logs a teach line. Do not also apply Late Seam (ENC-TEACH-12: first **cell** free), Bond Seam (ENC-TEACH-13: tax only with a living allied summon), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: cross only on even rounds, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is free on even, a tax on odd; waiting a pip is the answer, not a bigger nuke.” Prepares ENC-HAZ-28 / ENC-TURN-01 (even-round devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-STILL_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-27`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-27

ENCOUNTER_ID: ENC-HAZ-27  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand still **once**. Wounded pawns treat the orb’s **next hunt cell** like lava (`ENEMY_HAZARD_AVOID_HP_PCT`). Bishop kites off the painted still-chevron.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without an orb tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: One `WF-HAZ-STILL_CINDER` on a mid-court floor cell (at round start steps one tile toward a living unit that spent **0 MP** last round; 5% max HP on land). If every living unit spent MP, it stays. A floor path around the orb remains. Exit behind the bishop. Distinct from Hunting Lantern (steps toward the last MP spender), Shy Cinder (steps **away** from the nearest body), Orbiting Cinder (clockwise square), and Rim Cinder (outer ring).  
SPECIAL_RULES: Scripted still orb only. Never starts on spawn/portal. Tax via challenge HP recorders. If every hunt step is blocked it stays.  
OBJECTIVE: Clear all. Intended: keep spending MP so it stays put, or bait it onto a parked pawn.  
FAILURE_CONDITION: Player death (frost + orb tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing the land cell.  
TACTICAL_PURPOSE: Teach “this ember hunts **stillness**; a spent tile is the answer.” Inverse of ENC-HAZ-25 (shy).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb is floor, not a wall. Counts as 1 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Start cell west court vs east court.  
SCALING_BEHAVIOUR: Mid: inherit 2 odd-seam tiles on a **gallery** (`inheritHazardsFrom: ENC-TEACH-14`). High: bishop gains `spell-slow`. Never two still cinders.  
STATUS: PROPOSED

---

### ENC-HAZ-28

ENCOUNTER_ID: ENC-HAZ-28  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn charger. No kin-family overlay.  
AI_REQUIREMENTS: Bishop kites on cardinal files. Pawn may take only **one** paid walk if `WF-MOD-ONE_STRIDE` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-14 odd-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-14`) **plus** `WF-MOD-ONE_STRIDE` armed (at most 1 MP on movement per turn; leftover MP may still pay teleport tiles). A cardinal dry detour exists. Distinct from Orth Step (diagonal 2 MP), Crosswind (slide after a paid step), and Tight Grip (0-MP spells cost 1).  
SPECIAL_RULES: Scripted seam + one-stride only. Attack Nearest is not a walk. Ice / slime doublers still apply to the paid cost. Tax via challenge HP.  
OBJECTIVE: Clear all. Intended: wait for even, take the one legal step on the dry path; do not odd-cut the seam with the only walk.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine an odd-round path tax with a one-tile walk budget so “sprint the seam on odd” is the expensive line.  
SOLVABILITY_REQUIREMENTS: Cardinal path reaches both hostiles and the exit in multiple turns. Seam not on spawn/portal.  
REPLAYABILITY: Ribbon N-S vs E-W. High: enable a player-facing Drift Lend pawn (ENC-HEAVE-01) so the pack can **fund** a force-move that is not a walk.  
SCALING_BEHAVIOUR: High: enable Drift Lend. Peak: add `WF-ENV-OPEN_DRAFT` so ending in the open after the cut is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-27

ENCOUNTER_ID: ENC-SPELL-27  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-HEAVE-LEND/SOLO-MEND` fallback — 1× `heave_mender` queen (`spell-heave-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Drift Lend off until band 1 honesty.  
AI_REQUIREMENTS: Mender Shields, then mends **only** if `forcedMovedThisTurn` is true on **both** the mender and the carry; otherwise Shield / skip. Never drain / nova / Both / Clash / Shove / Chase / Bar Mend. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-heave-mend` (heal 8 iff **both** already have `forcedMovedThisTurn`) can drop that id if missing. Extra door `heave_cantor` — first child wins vs a later observe. Do not restamp claimed feats.  
MAP_REQUIREMENTS: Open court. No lava. One locked exit. Mender needs a tile at range 3 that is **not** the only aisle.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing force-move writer → Shield queen (still a valid teach: they did **not** mend after a stand). Do not fake the heal with `starter-heal`. Distinct from ENC-SPELL-23 (target-forced Shove Mend), ENC-SPELL-25 (dual-**walk** Both Mend), and ENC-CLASH-01 (Struck). Walk / Swap / Ally Step do not pay Heave Mend.  
OBJECTIVE: Defeat both. Optional: keep one body unshoved so the 8 never lands.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + heave-mend discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this mend is paid in **two shoves already taken**” on a clean court so ENC-HEAVE-01 can add Drift Lend without two new verbs.  
SOLVABILITY_REQUIREMENTS: Both reachable. Reject a 1-tile tunnel.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: Mid: enable Drift Lend on the pawn (`FSN-HEAVE-LEND`). High: inherit one odd-seam tile. Never Dual Keep on this PAIR.  
STATUS: PROPOSED

---

### ENC-SPELL-28

ENCOUNTER_ID: ENC-SPELL-28  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-MID-DRIFT/SOLO-HOOD` fallback — 1× `mid_hooder` knight (`spell-mid-hood` + `physical_attack`) + 1× bishop (`starter-frost` only). Must Drift off until honesty.  
AI_REQUIREMENTS: Hood stands in a **wide** lane and Hoods if a hostile can poke from Chebyshev 2 this turn. Hits from 1 or ≥ 3 land. DoT / lava do not consume. Bishop kites. No Must Drift until `lastForcedMoveDir` exists.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-mid-hood` can drop that id if missing. Extra door `mid_cantor`. First grant wins.  
MAP_REQUIREMENTS: Open court with a 3-column aisle. No lava on the only mid-band tile. One locked exit.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing exact-2 consume → fat Strike body (still a valid teach: the 2-step poke **landed**). Distinct from ENC-SPELL-26 (Near Hood ≤ 1) and ENC-HOOD-01 (Far Hood ≥ 3).  
OBJECTIVE: Defeat both. Optional: hit from 1 or 3 so the hood never consumes.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + mid-hood discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “exactly two is the miss; close or step out” so ENC-MID-01 can add Must Drift without two new verbs.  
SOLVABILITY_REQUIREMENTS: Both reachable. Reject `corridorMaze`.  
REPLAYABILITY: Hood west vs east.  
SCALING_BEHAVIOUR: Mid: enable Must Drift on the bishop (`FSN-MID-DRIFT`). High: inherit one still-cinder. Never Far Hood on this PAIR.  
STATUS: PROPOSED

---

### ENC-HEAVE-01

ENCOUNTER_ID: ENC-HEAVE-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HEAVE-LEND` — 1× `heave_mender` queen (`spell-heave-mend` + `starter-shield`) + 1× `drift_lender` bishop (`spell-drift-lend` + `starter-frost`). No Both / Clash / Shove / Bar Mend.  
AI_REQUIREMENTS: Lender holds until a shove already landed on the Mender; if she is still, Lender Frosts. Mender Heave-Mends only if both flags are true **and** missing HP ≥ 8; else Shields. Ally-first (`AI-ROL-05`) on the Lender. Soph 1–2. `groupTactics` not required.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-heave-mend` and `spell-drift-lend` if missing. First grant wins.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Lender that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Force-move writers required. Walk does **not** arm Heave Mend. Drift Lend is +1 current AP to the Mender **after** she was shoved — not Spent Lend, not Dual Keep, not Tempo. Honesty reroll → ENC-BASH-01.  
OBJECTIVE: Defeat both. Intended: keep one body unshoved.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine dual-force heal with a shove-funded buffer so “bash both, then eat the 8” is the expensive line.  
SOLVABILITY_REQUIREMENTS: Both reachable. Player keeps ≥ 1 walk-off after a typical bash.  
REPLAYABILITY: Mender north vs east. Variant `FSN-HEAVE-LEND/E-LEND`.  
SCALING_BEHAVIOUR: High: promote to `FSN-HEAVE-CHOIR` (add bruiser). Peak: inherit one odd-seam gallery. Never `titans_vigor`. Never pack Both Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-READY-01

ENCOUNTER_ID: ENC-READY-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DUAL-READY` — 1× `dual_keeper` bishop (`spell-dual-keep` + `starter-frost`) + 1× `ready_stinger` knight (`spell-ready-sting` + `physical_attack`). No Purse Keep / Stride Keep / Dry Sting / Damp Sting on PAIR.  
AI_REQUIREMENTS: Keeper Holds Keep if leftover AP ≥ 1 **and** leftover MP ≥ 1 and they still need a kite+cast next turn; else Frosts. Ready lurks at 3 and commits when both leftovers are ≥ 1 **or** HP% ≤ 40. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-dual-keep` and `spell-ready-sting` if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Ready needs a flank path that is not the only exit. Keeper needs a retreat tile. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Dual Keep: once/battle, cap 2 leftover AP **and** cap 2 leftover walk MP paid at next own turn start. Ready Sting: 10, +8 iff leftover AP ≥ 1 **and** leftover MP ≥ 1. Keep does not empty leftover until next start. Honesty reroll → ENC-DAMP-01. Band 0 → show `FSN-STRIDE-DAMP` instead.  
OBJECTIVE: Defeat both. Intended: empty one wallet this turn.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach leftover-**pair** as one resource: spend the last AP **or** the last tile. Distinct from ENC-DAMP-01 (MP-only) and ENC-DRY-01 (AP=0 poke).  
SOLVABILITY_REQUIREMENTS: Both reachable. Ready’s flank is not the only exit.  
REPLAYABILITY: Ready west vs east. Variant `FSN-DUAL-READY/E-READY`.  
SCALING_BEHAVIOUR: High: promote to `FSN-DUAL-BANK` (add Drift Sip). Never two Keep cards on PAIR.  
STATUS: PROPOSED

---

### ENC-MID-01

ENCOUNTER_ID: ENC-MID-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-MID-DRIFT` — 1× `mid_hooder` pawn or knight (`spell-mid-hood` + `physical_attack`) + 1× `must_drifter` knight (`spell-must-drift` + `physical_attack`). No Near Hood / Far Hood / Must Step / Inch on PAIR.  
AI_REQUIREMENTS: Hood stands in a **wide** lane and Hoods if a hostile can poke from 2 this turn. Drifter Must-Drifts only when a shove already landed **and** a walk-off that is **not** the forced vector remains (stand is the designed answer). Never turn-1 Must Drift into a dead-end. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-mid-hood` and `spell-must-drift` if missing.  
MAP_REQUIREMENTS: `openField`, `arena`, or `chessboard` with **wide** files. Reject `corridorMaze`. No lava on the only legal shove-dir step.  
SPECIAL_RULES: Family lottery **off**. Mid Hood: next damaging `dealDamage` from Chebyshev **exactly 2** misses, then consume. Must Drift: remaining walks this turn must follow `lastForcedMoveDir`. Stand (0 walk) is legal. Relocate any length is legal. Honesty reroll → ENC-NEAR-01. If the map has no legal step along a typical shove vector, **reroll this id**.  
OBJECTIVE: Defeat both. Intended: hit from 1 or 3; stand after a shove.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine anti-midrange with shove-dir lock. Closing answers Hood; standing answers Drift.  
SOLVABILITY_REQUIREMENTS: Wide files. A walk-off that is not the forced vector exists after a typical bash.  
REPLAYABILITY: Hood chassis pawn vs knight (`FSN-MID-DRIFT/PAWN`).  
SCALING_BEHAVIOUR: High: promote to `FSN-MID-STEP` (add glass sniper). Peak: inherit one odd-seam. Never pack Near Hood.  
STATUS: PROPOSED

---

### ENC-CINDER-01

ENCOUNTER_ID: ENC-CINDER-01  
TYPE: hazard battle / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CINDER-MARK` — 1× `cinder_reeler` queen (`starter-frost` + `spell-cinder-reel`) + 1× `ingress_marker` pawn or bishop (`spell-ingress-mark` + `physical_attack`). No Paint / Foe / Ally / File Reel on PAIR.  
AI_REQUIREMENTS: Marker paints a **flank** cell beside the hazard, never the only tile that reaches the Reeler. Reeler Reels only when Chebyshev ≥ 2, a living hazard exists, landing is **not** the hazard **and** not safer for the player, and a walk-off remains. Never turn-1 double onto one tile. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cinder-reel` and `spell-ingress-mark` if missing.  
MAP_REQUIREMENTS: `ruinsIslands` or `asymmetric` with **one** lava/cinder flavor cell **and** one clean approach. Reject lava-painted engagement with no clean aisle. No Void Rift tile as a legal landing. Dest must not be the hazard.  
SPECIAL_RULES: Family lottery **off**. Cinder Reel: pull 1 toward nearest hazard. Fifth `applyAttract` dest. Ingress Mark: cell paint; enter deals 10. Stand at paint time is free. Blink / Swap onto pays. Weight 0 if no living hazard at spawn. Honesty reroll → ENC-PAINT-01. Band 0 → show `FSN-PAINT-NOOK`.  
OBJECTIVE: Defeat both. Intended: occupy the toward-tile, or stand on the paint before it arms.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Displacement + enter-hazard assassin. Distinct from ENC-PAINT-01 (paint attract) and ENC-FANG-01 (body attract).  
SOLVABILITY_REQUIREMENTS: One clean aisle. Player keeps ≥ 1 escape tile after a legal reel.  
REPLAYABILITY: Hazard west vs east. High: `FSN-CINDER-MARK/EMBER` (ember knight as living hazard — still one clean aisle, at most one Inferno cadence).  
SCALING_BEHAVIOUR: Do not add a second reel. Never pack Paint Reel on this PAIR.  
STATUS: PROPOSED

---

### ENC-DRIFT-01

ENCOUNTER_ID: ENC-DRIFT-01  
TYPE: protection objective / elite encounter  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DRIFT-GATE` — 1× `drift_prelate` rook (`spell-drift-post`) + 1× `drift_siller` rook (`spell-drift-sill`). Remaining cap ≥ 1. Dummy / Bait / Ingress / Shove Sting stay off CELL.  
AI_REQUIREMENTS: Prelate plants on a **gallery** tile so a shove toward the Siller lands on the post — not toward the only exit. Siller paints a **flank choke**, never the only tile that reaches the Prelate. Skip if remaining cap < 1 or plant cell is the only player exit. `summonAI === "driftpost"`. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-drift-post` and `spell-drift-sill` if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Reject a 1-tile closet. No Time Warp. No slime on both approaches.  
SPECIAL_RULES: Family lottery **off**. Drift Post: empty-kit body, 1 HP, lifespan 3. Relocate landing deals 10 and it dies. **Walk onto is safe.** Counts as 1 toward cap. Drift Sill: occupant cannot be a relocate dest. Walk through. Shove / Swap / Heave Step onto fizzles (AP spent). Honesty reroll → ENC-DUMMY-01. Do not also Quiet / Cast Sill.  
OBJECTIVE: Defeat both. Post death ≠ victory. Intended: walk onto the post, walk through the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “walk is safe, shove is the bomb, the sill rejects the landing.” Prepares ENC-RARE-14 (Drift Court).  
SOLVABILITY_REQUIREMENTS: Second approach exists. Post never occupies spawn/portal.  
REPLAYABILITY: Post west gallery vs east. High: `FSN-DRIFT-GATE/STING` (add shove stinger as a **third** — never PAIR post+sting).  
SCALING_BEHAVIOUR: Do not spawn a second post while cap is 2. Never `FSN-DRIFT-COURT/SEPT`.  
STATUS: PROPOSED

---

### ENC-SPIKE-01

ENCOUNTER_ID: ENC-SPIKE-01  
TYPE: hazard battle / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPIKE-TAP` — 1× `spike_skipper` knight (`spell-spike-skip` + `physical_attack`) + 1× `tapped_plater` rook (`spell-tapped-plate` + `spell-iron-skin`). No Lava Skip / Pit Skip / Empty Plate / Dry Sting on PAIR.  
AI_REQUIREMENTS: Skipper takes a 1-tile spike bridge the player does not have to take. It does not camp the only clean aisle. Plater walks into a **wide** lane and Plates when leftover AP is 0. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-spike-skip` and `spell-tapped-plate` if missing.  
MAP_REQUIREMENTS: `ruinsIslands` or `asymmetric` with **one** spike flavor bridge **and** one clean approach. Reject spike-painted engagement with no clean aisle. Plater needs a retreat tile that is not the spike bridge.  
SPECIAL_RULES: Family lottery **off**. Spike Skip: next **1-tile** walk treats spikes as floor. A 2-step onto spikes still ticks. Tapped Plate: 0 leftover AP → +RES. Dual Keep does **not** empty leftover this turn. Honesty reroll → ENC-SKIP-01. Weight 0 on maps with no spikes.  
OBJECTIVE: Defeat both. Intended: take the clean aisle; keep 1 leftover AP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Kiter skip + leftover-AP tank. Cousin of ENC-SKIP-01 (lava skip + leftover-**MP** 0 +RES) on **spikes** and the **AP** wallet.  
SOLVABILITY_REQUIREMENTS: Clean aisle always walkable. Skip never ignores lava / pit / void / barriers.  
REPLAYABILITY: Bridge west vs east. High: `FSN-SPIKE-TAP/REAVE` (add rust reaver — still one clean aisle).  
SCALING_BEHAVIOUR: Do not add a second skipper. Never pack Lava Skip on this PAIR.  
STATUS: PROPOSED

---

### ENC-INCH-01

ENCOUNTER_ID: ENC-INCH-01  
TYPE: movement objective / elite encounter  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-INCH-OATH` — 1× `inch_warder` bishop (`spell-inch-stride`) + 1× `long_oather` bishop (`spell-long-oath` + `starter-frost`). No Must Step / Must Span / Pair Stride / Near Oath / Far Stinger on PAIR.  
AI_REQUIREMENTS: Inch Inches only when a 1-step exists **and** a tile at 3 remains after that step (or Strike is legal). Oather Oaths if a range<3 id is the next legal **and** a ≥3 lane exists. Never both on turn 1 against a full-HP player who has not acted — apply **one**, leave the other as the tell. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-inch-stride` and `spell-long-oath` if missing.  
MAP_REQUIREMENTS: `openField` or `arena` with a **main lane plus one side aisle** and a ≥3 Frost lane. Reject `corridorMaze`. No lava on the only 1-step.  
SPECIAL_RULES: Family lottery **off**. Inch Stride: **one** next walk Chebyshev ≤ 1. Stand (0 walk) is legal. Relocate any length is legal. Long Oath: next spell must have range ≥ 3. Frost at 1 fizzles. Strike stays legal. Do not also attach Near Oath. Honesty reroll → ENC-NEAR-01. If the map has no legal Chebyshev-1 step from typical stand, **reroll**.  
OBJECTIVE: Defeat both. Intended: stand, Strike, or walk the legal 1 then cast from 3.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Movement controller + min-range gun. Distinct from ENC-NEAR-01 (all remaining Chebyshev exactly 1) and ENC-HOLD-03 (spells until walk, Strike until a spell).  
SOLVABILITY_REQUIREMENTS: A 1-step and a ≥3 lane both exist. Neither is the only exit.  
REPLAYABILITY: Inch west vs east. High: `FSN-INCH-OATH/STING` (add far stinger as a **third** — never PAIR Long Oath with Far Stinger).  
SCALING_BEHAVIOUR: Do not add Near Oath. Peak: promote to ENC-RITE-01.  
STATUS: PROPOSED

---

### ENC-OFF-01

ENCOUNTER_ID: ENC-OFF-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-OFF-FEE` — 1× `off_plater` rook (`spell-off-plate` + `physical_attack`) + 1× `watch_feer` pawn (`spell-watch-fee` + `physical_attack`). No Far Hood / Morrow / Sidestep / Tick / Foe Plate / Mid Hood / Watch Mute on PAIR.  
AI_REQUIREMENTS: Plater holds a **wide** lane and Plates if a hostile can Strike this turn **before** the Plater acts. Feer camps a gallery file and Fees if overwatch is armed; else Strikes when reachable. Never turn-1 plate + fee on a full-HP player in a closet. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-off-plate` and `spell-watch-fee` if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `chessboard` with two files. Reject a single-tile tunnel. At least one legal player overwatch plant that is not the only exit **or** a pre-existing file.  
SPECIAL_RULES: Family lottery **off**. Off Plate: next **off-turn** damaging hit → 0, then consume. Hits on the Plater’s own turn land. Slow does **not** consume. Watch Fee: next overwatch snap also costs the walker 1 AP. The snap still **deals**. Honesty reroll → ENC-BRICK-01. If no overwatch exists at spawn, Feer Strikes (still a valid soft CELL).  
OBJECTIVE: Defeat both. Intended: hit the Plater **on their turn**; walk a second file.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Off-turn miss + anti-ranged tax. Cousin of ENC-BRICK-01 (Watch Mute) that **still hurts**.  
SOLVABILITY_REQUIREMENTS: Two files. Neither plate nor fee occupies the only exit.  
REPLAYABILITY: Gallery N-S vs E-W. High: `FSN-OFF-FEE/GUN` (one turret, remaining cap ≥ 1, `summonAI === "turret"`).  
SCALING_BEHAVIOUR: Do not mint a new overwatch. Never Watch Mute on this PAIR. Never Brick Sprout on this id.  
STATUS: PROPOSED

---

### ENC-WAVE-15

ENCOUNTER_ID: ENC-WAVE-15  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave A `FSN-HEAVE-LEND` (mender + lender). Wave B, after A is dead: `FSN-DUAL-READY` (keeper + ready). Living hostiles stay ≤ 4. Portal stays locked until B is dead (`holdPortalLocked`).  
AI_REQUIREMENTS: Wave A as ENC-HEAVE-01. Wave B does not spawn until every Wave A body is HP 0. Ready starts on a **gallery**, not on the player’s tile. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: Heave Mend from A, Dual Keep / Ready Sting from B. First grant wins.  
MAP_REQUIREMENTS: Courtyard + one gallery spawn for B. No lava on B’s spawn. Exit behind B’s gallery.  
SPECIAL_RULES: Two scripted waves, not a spawn trickle. B spawn counts toward `MAX_ENEMIES`. Honesty: missing force-move **or** leftover-pair writer → freeze at Wave A (ENC-HEAVE-01) without claiming Dual.  
OBJECTIVE: Clear A, then B. Optional: empty one wallet before B’s Ready commits.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + wave-clear XP via `applyRewards` once, after the portal unlocks. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce dual-force heal, then ask leftover-pair on the same court.  
SOLVABILITY_REQUIREMENTS: B spawn walk-reachable after A. Never spawn B on the portal.  
REPLAYABILITY: B gallery north vs east.  
SCALING_BEHAVIOUR: High: Wave B is `FSN-DUAL-BANK`. Peak: inherit odd-seam on the A court. Never a third wave.  
STATUS: PROPOSED

---

### ENC-AMBUSH-14

ENCOUNTER_ID: ENC-AMBUSH-14  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible 2× pawns. One `WF-ELT-FAR_PICKET` elite (same-tier × hard) occupies a painted post **only** while the player is Chebyshev 6 or farther from that cell. Step closer and the post is empty floor in exploration (they leave, no purse). Dungeon: they stand from map start — required for map-clear. Inverse of Near Picket. Distinct from High Picket (≥80% HP) and Low Picket (below 70%).  
AI_REQUIREMENTS: Pawns greedy. Elite is a `ready_stinger` or `mid_hooder` metadata lock (not a 30% lottery). No concealment fog required; distance **is** the tell.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional Ready / Mid observe if that kit fires.  
MAP_REQUIREMENTS: Long file ≥ 8 tiles. Post is floor. Exit reachable without touching. Counts as 1 enemy.  
SPECIAL_RULES: Appearance keys off Chebyshev distance to the player. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-13 without claiming Far. `fog_of_war` may still be used as a **wall-hook substitute** for ambush concealment, matching day-1…13 language — but Far Picket does not need it.  
OBJECTIVE: Clear required hostiles. Exploration: close in and walk past, or stay far and fight for the hard purse.  
FAILURE_CONDITION: Player death.  
REWARD: Standard; Far Picket victory uses hard multiplier via `applyRewards`. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “this picket hunts **range**; closing is the skip.” Inverse of ENC-HIGH-01.  
SOLVABILITY_REQUIREMENTS: Exit reachable without the post. In a run they are present from the start.  
REPLAYABILITY: Post north vs south.  
SCALING_BEHAVIOUR: High: elite is `FSN-INCH-OATH` oather. Never two far pickets.  
STATUS: PROPOSED

---

### ENC-REINF-14

ENCOUNTER_ID: ENC-REINF-14  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: 1× bishop frost + 1× pawn. After the player spends their **first AP** this fight, spawn 1× `watch_feer` on a gallery (`WF-TRP-SPENT_PLATE` already armed).  
AI_REQUIREMENTS: Opening pair as ENC-TEACH-14. Feer Fees if overwatch is armed; else Strikes. No kamikaze. Portal locked until all three are dead.  
SPELL_DISCOVERY_OPPORTUNITIES: Watch Fee if the Feer snaps.  
MAP_REQUIREMENTS: Court + gallery. One `WF-TRP-SPENT_PLATE` on the approach (first action of the turn, 0 AP spent, costs 8% max HP once; then floor). Never hidden. Never on spawn/portals.  
SPECIAL_RULES: Reinforcement is a scripted spawn, not a summon. Honesty: missing 0-AP plate writer → skip the plate, still spawn the Feer (do not claim Spent). Distinct from Glyph Plate (always taxes the first stepper) and Side Plate (opposing-side claim).  
OBJECTIVE: Clear all. Intended: spend AP (cast or Attack Nearest) **before** stepping the plate, then face the Feer.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a first-action tax with a late overwatch pawn so “walk first, then act” is the expensive line.  
SOLVABILITY_REQUIREMENTS: Feer spawn walk-reachable. Plate is floor before and after.  
REPLAYABILITY: Plate west vs east.  
SCALING_BEHAVIOUR: High: Feer is `FSN-OFF-FEE` with Off Plate. Never a second reinforcement.  
STATUS: PROPOSED

---

### ENC-FOLD-01

ENCOUNTER_ID: ENC-FOLD-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-FOLD_WALL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop kites behind the slab (LoS blocked until folded/smashed). Pawn patrols the bypass. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Hinged slate slab blocks walk and LoS. Adjacent 1 AP folds it to floor until the next round start, then it rebuilds if still intact. Adjacent 2 AP smashes it to permanent floor. A second spawn→portal route already exists with the wall intact. Distinct from Crumble Pillar (2 AP smash only), Tide Door (automatic odd/even), and Fallen Gate (two rounds then gone forever).  
SPECIAL_RULES: AP occupancy actions, not spells. Folded tile is floor until round-start rebuild. Smash is permanent. Honesty reroll → ENC-MOVE-24 without claiming Fold. Skip if `evaluateSolvability` would fail with it intact.  
OBJECTIVE: Clear all. Intended: spend 1 AP for a one-round window, smash when the cell is worth 2 AP, or take the long path.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach a **hinged** shortcut: rent a window or buy the hole. Prepares ENC-BOSS-14 fortress branch.  
SOLVABILITY_REQUIREMENTS: Must not be a cut-vertex with the wall intact. Bypass exists.  
REPLAYABILITY: Slab north choke vs east choke.  
SCALING_BEHAVIOUR: High: bishop gains Mid Hood. Never two fold walls.  
STATUS: PROPOSED

---

### ENC-SPENT-01

ENCOUNTER_ID: ENC-SPENT-01  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawns + 1× bishop frost.  
AI_REQUIREMENTS: Pawns greedy. Bishop kites. No lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TRP-SPENT_PLATE` on the mid approach. Visible. Walkable before and after. Never on spawn/portals.  
SPECIAL_RULES: One-shot step trigger only when AP spent this turn is 0. Challenge HP. Distinct from ENC-REINF-14 (this room has **no** extra spawn). Honesty reroll → ENC-SIDE-01.  
OBJECTIVE: Clear all. Intended: cast or Attack Nearest first, or send a summon that already spent AP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Isolate the first-action tax so ENC-REINF-14 / ENC-READY-01 can add a second verb.  
SOLVABILITY_REQUIREMENTS: Path around the plate. Plate is not a wall.  
REPLAYABILITY: Plate west vs east.  
SCALING_BEHAVIOUR: Mid: inherit two odd-seam tiles. High: enable Ready Sting on one pawn.  
STATUS: PROPOSED

---

### ENC-KILL-01

ENCOUNTER_ID: ENC-KILL-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop frost + 1× pawn. Optional 1-HP player-side summon already out is **not** required.  
AI_REQUIREMENTS: Bishop kites on the long path. Pawn sits on the short-path side of the sill (cannot cross until it opens).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: A short-path corridor cell starts as a wall (`WF-OBS-KILL_SILL`). It becomes floor for the rest of the map after any unit on the map hits 0 HP (player, enemy, or summon). A second spawn→portal route already exists. Distinct from Heal Sill (adjacent heal), Latch Sill (end-turn adjacent), Spell Sill (cast), and Stride Sill (MP spend).  
SPECIAL_RULES: Wall occupancy until a recorded HP-to-0. Does not call `applyRewards`. Death still uses `saveBattleStats`. Honesty reroll → ENC-MOVE-24. Never the only exit.  
OBJECTIVE: Clear all. Intended: take a fight or sacrifice a summon to open the short path, or take the long way.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “a death is a key.” Distinct from ENC-MOVE-24 (wall→floor after a recorded **heal**).  
SOLVABILITY_REQUIREMENTS: Evaluate solvability as if the sill were already a wall. Long path reaches the exit.  
REPLAYABILITY: Sill north vs east.  
SCALING_BEHAVIOUR: High: pawn is a Dummy Post (ENC-DUMMY-01 leftover) so a 1-HP pop opens the sill. Never two kill sills.  
STATUS: PROPOSED

---

### ENC-WOUND-01

ENCOUNTER_ID: ENC-WOUND-01  
TYPE: movement objective  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop frost + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn greedy. No teleport AI.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Two linked crimson-cyan pads (`WF-TEL-WOUND_STEP`). Entering one for 1 MP exits the other only if the traveler’s current HP is strictly below 50% of max. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Distinct from Clear Step (empty dest, no HP gate), High Picket (≥80% HP), and Full Cache (≥90% to open).  
SPECIAL_RULES: 1 MP from the unit’s current MP only on a successful below-50% landing. Not a teleport spell — do not key off `effectCategory`. Honesty reroll → ENC-CLEAR-01. Both on floor, not on spawn/portals. The map is solvable without using them.  
OBJECTIVE: Clear all. Optional: take a scratch then skip, or stand on the exit to force a swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach a wounded-only pad. Inverse of ENC-HIGH-01 (healthy skip).  
SOLVABILITY_REQUIREMENTS: Bypass exists. Occupied dest swaps rather than trapping.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit Open Draft so healthy camping in the open is a tax. Never a third pad.  
STATUS: PROPOSED

---

### ENC-HALVE-01

ENCOUNTER_ID: ENC-HALVE-01  
TYPE: priority-target / elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HALVE-PACE` — 1× `cadence_halver` bishop (`spell-cadence-halve`, `isLeader` optional) + 1× `verse_pacer` bishop (`spell-verse-pace`) + 1× `ignite_alchemist` queen (Poison + Ignite). Never PAIR Halve with Trim / Shave / Stretch / Stall / Crack / Pin. No Inferno on the Halver.  
AI_REQUIREMENTS: Turn 1: Pacer holds unless a last id already exists. Halver Halves only if highest remaining ≥ 2 **and** a recast would hurt. Ignite waits for stacks ≥ 2. One of the three peels a wisp (`focusAlreadySet`); the others stay on the player. Never all three on turn 1 against a full-HP player who has not acted — apply **two**, leave the third as the tell. Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cadence-halve` and `spell-verse-pace` if missing. Do not grant Trim / Stretch / Flush from this fight.  
MAP_REQUIREMENTS: `openField` or `arena` with two approaches. No Time Warp. No Glass Realm. ≥ 2 walk-offs from wherever Ignite can land.  
SPECIAL_RULES: Family lottery **off**. Halve `floor(remaining/2)` on Inferno so a 3 becomes 1. 0 stays 0. Verse Pace makes that recast **illegal until they walk**. Shove does **not** unlock the last id. Ignite only if matching stacks ≥ 2. Honesty reroll → ENC-TRIM-01. Fallback `FSN-HALVE-PACE/NO-IGNITE` if stack consume is not ready.  
OBJECTIVE: Defeat all. Intended: recast Frost not Inferno; walk to peel Verse Pace; sit on CD-0.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: 3→1 Inferno still illegal until they walk, then cash stacks. Cousin of ENC-TRIM-01 (−1) on **divide**.  
SOLVABILITY_REQUIREMENTS: Two approaches. If the player sits on CD-0, this is a Frost choir — intended.  
REPLAYABILITY: Halver-leader on vs `FSN-HALVE-PACE/NO-LEADER`.  
SCALING_BEHAVIOUR: Do not add Pin (that is ENC-PIN-02). Never a fourth body.  
STATUS: PROPOSED

---

### ENC-RITE-01

ENCOUNTER_ID: ENC-RITE-01  
TYPE: elite encounter / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-RITE-LONG` — 1× `rite_holder` knight (`spell-rite-first`) + 1× `long_oather` bishop (`spell-long-oath` + `starter-frost`) + 1× warden rook (`spell-iron-skin` / live `iron_golem` overlay). Never PAIR Rite with Hold Knight / First Verse / Tool Hold / Boot Hold / Quiet Sill.  
AI_REQUIREMENTS: Warden interposes on the Oather axis (`AI_BACKLINE_PROTECT`). Rite Rites if the player still wants to melee. Oather Oaths if a range<3 id is the next legal. Never all three on turn 1 against a full-HP player who has not acted — apply **two**. Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-rite-first` if missing. Long Oath may already have dropped from ENC-INCH-01.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `arena` with pillars. Oather needs a retreat tile that is not the Warden’s choke **and** a ≥3 Frost lane. Never a closed ring. Weight 0 on 1-tile closets.  
SPECIAL_RULES: Family lottery **off**. Rite First: Strike / `isPhysical` refuses until a **spell** resolves this turn. Long Oath: next spell range ≥ 3. Frost at 1 fizzles. Strike stays the designed unlock **after** a ≥3 confirm. Honesty reroll → ENC-HOLD-03. Variant `FSN-RITE-LONG/NO-WARD` if the warden interpose is missing.  
OBJECTIVE: Defeat all. Intended: cast from ≥ 3 (unlocks Strike), then melee.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Unlock Strike only with a spell that may also be range-illegal. Inverse of ENC-BOOT-OATH leftover (walk-until-Strike).  
SOLVABILITY_REQUIREMENTS: A ≥3 Frost lane exists. Warden is not a cut-vertex.  
REPLAYABILITY: Warden west vs east.  
SCALING_BEHAVIOUR: If the Rite dies, remaining pair is a min-range-3 bishop + golem — intended. Never add Near Oath.  
STATUS: PROPOSED

---

### ENC-PIN-02

ENCOUNTER_ID: ENC-PIN-02  
TYPE: elite encounter / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BAR-PIN` — 1× `bar_mender` queen (`spell-bar-mend` + `starter-shield`, `isLeader` optional) + 1× `cadence_pinner` bishop (`spell-cadence-pin`) + 1× ignite or frost junior. Never PAIR Bar Mend with Clash / Heave / Chase / Gait / Both. Never PAIR Pin with Halve / Stall / Trim / Flush / Thief.  
AI_REQUIREMENTS: Mender Bar-Mends only if `lastResolvedSpellId` is set **and** missing HP ≥ 8; else Shields. Pinner Pins the last resolved id (freeze remaining CD — not Halve). Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-bar-mend` and `spell-cadence-pin` if missing. Do not grant Heave / Clash / Halve from this fight.  
MAP_REQUIREMENTS: Open court, two approaches. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Bar Mend heals iff a **spell** resolved this turn (not Strike, not walk). Cadence Pin freezes **one** id. Honesty reroll → ENC-BRAND-01. Still Sprout is `FSN-BAR-PIN/STILL` (do not also Brick Sprout + Watch Fee).  
OBJECTIVE: Defeat all. Intended: Strike instead of recasting the pinned id; keep the queen unspelled.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing`.  
TACTICAL_PURPOSE: Cash the unlocking spell, freeze Inferno so they cannot recast. Distinct from ENC-HALVE-01 (divide remaining) and ENC-BRAND-01 (hit writes +1 CD).  
SOLVABILITY_REQUIREMENTS: Two approaches. Sitting on Strike is a complete answer.  
REPLAYABILITY: Pinner north vs east. High: `FSN-BAR-PIN/STILL`.  
SCALING_BEHAVIOUR: Do not pack Heave Mend. Never a fourth healer.  
STATUS: PROPOSED

---

### ENC-SURV-27

ENCOUNTER_ID: ENC-SURV-27  
TYPE: survival / hazard battle  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop frost + 1× pawn + optional 1× still-cinder (hazard, not a unit).  
AI_REQUIREMENTS: Bishop kites into the **open** (3+ empty orthogonal neighbors). Pawn charges. Wounded AI seeks hatched shelter.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: `WF-ENV-OPEN_DRAFT` armed. At the end of each combatant turn, if they have 3 or more empty orthogonal floor neighbors they pay 3% max HP. Wall-adjacent and occupied-adjacent cells show a shelter hatch. Inverse of Corner Draft (tax next to two or more walls) and Ash Rain (tax unless wall-adjacent). Distinct from Crowd Press (too many units nearby) and Isolation Chill (no unit within 3). Skip if the map has no floor cell with fewer than 3 empty orthogonal floor neighbors so shelter exists.  
SPECIAL_RULES: End-of-turn challenge HP. Summons pay it. Orthogonal neighbors only. No skipped turns. Honesty reroll → ENC-SURV-25. Tax is not a wall.  
OBJECTIVE: Survive and clear. Intended: hug a wall or a body, or shove a foe into the open.  
FAILURE_CONDITION: Player death. Optional overlay `no_healing` (not `no_damage_taken` — the draft **is** damage).  
REWARD: Standard. Overlay `no_healing`.  
TACTICAL_PURPOSE: Teach open-center tax. Inverse of ENC-SURV leftover corner-draft rooms.  
SOLVABILITY_REQUIREMENTS: Shelter cells exist. Draft never walls a corridor.  
REPLAYABILITY: Shelter on west wall vs a parked pawn.  
SCALING_BEHAVIOUR: High: inherit still-cinder (ENC-HAZ-27) so standing still in shelter also baits the orb. Peak: add One Stride. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-28

ENCOUNTER_ID: ENC-SURV-28  
TYPE: survival  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× pawns + 1× bishop. Portal locked for 8 rounds (`holdPortalLocked`) even if the board is clear early.  
AI_REQUIREMENTS: Standard kits. No kamikaze. After round 8, remaining hostiles still must die **or** the lock drops only if the board is empty — keep at least the bishop alive until round 8 or spawn a 1-HP dummy post on round 7 if the board is empty (counts as 1, remaining cap ≥ 1).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Odd-seam ribbon (`inheritHazardsFrom: ENC-TEACH-14`) plus Open Draft **off**. Clock is the odd/even pip, not a shrinking void (that was ENC-SURV-03).  
SPECIAL_RULES: Survival is “last until even-round 8 without dying,” then clear. Do not invent a new `ChallengeCondition`. Overlay `under_10_turns` is **wrong** here — use `under_50_damage`.  
OBJECTIVE: Still standing at round 8, then clear remaining hostiles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Pressure the odd-seam lesson on a clock without adding HP.  
SOLVABILITY_REQUIREMENTS: Dry detour exists. Dummy post, if used, never occupies spawn/portal.  
REPLAYABILITY: Clock 8 vs 10 at peak.  
SCALING_BEHAVIOUR: Peak: add One Stride. Never shrink the board.  
STATUS: PROPOSED

---

### ENC-PROT-14

ENCOUNTER_ID: ENC-PROT-14  
TYPE: protection objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop frost + 1× pawn. The font is a **tile**, not a unit.  
AI_REQUIREMENTS: Enemies path to drink `WF-ZON-RIVAL_FONT` if they are wounded and a living player-side unit is Chebyshev ≤ 2. Otherwise they fight.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Contested teal basin. The first unit to end a turn here this map heals 8% max HP only if a living enemy is within Chebyshev 2; then the tile dries. Ending here with no enemy in that ring does nothing and does not dry it. Distinct from Shrine Pool (unconditional first drink), Labor Font (2+ AP then heal), and Isolation Chill (tax if alone). Never on spawn/portals.  
SPECIAL_RULES: Zone tick, not a spell. Enemy means opposite side, living, Chebyshev ≤ 2. Player HP persist via `saveBattleStats` on the progress lock. Honesty reroll → ENC-PROT-13. Optional.  
OBJECTIVE: Clear all. Contest: plant next to a foe for a contested heal, deny the enemy the basin, or ignore it.  
FAILURE_CONDITION: Player death. The font drying is not a fail.  
REWARD: Standard. Overlay `no_healing` if the player drinks.  
TACTICAL_PURPOSE: Teach a **contested** heal — you must keep a foe close. Distinct from ENC-PROT-13 (work 2 AP).  
SOLVABILITY_REQUIREMENTS: Basin is walkable. Map is solvable if never used.  
REPLAYABILITY: Basin mid vs flank.  
SCALING_BEHAVIOUR: High: pawn is Ready Stinger so leftover-pair poke punishes camping the ring. Never two fonts.  
STATUS: PROPOSED

---

### ENC-PRIO-16

ENCOUNTER_ID: ENC-PRIO-16  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `WF-SPL-RANGE_TUTOR` same-tier enemy (medium threat) carrying 1 extra `usableByEnemy` spell (`spell-heave-mend` **or** `spell-mid-hood` — never both) + 2× pawns.  
AI_REQUIREMENTS: Tutor kites to stay at Chebyshev ≥ 4 if wounded. Pawns greedy. Tutor stays hostile after the teach.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn at Chebyshev 4 or farther from the tutor while they still live, the player gains that spell id as a **single remaining cast** this map. Killing them before that range teach grants the purse but not the one-cast. Distinct from Mercy Scribe (≤30% HP alive), Mark Tutor (adjacent 1 AP then LoS), Live Tutor (once per round while they live), and Grimoire Stalker (one-cast on death).  
MAP_REQUIREMENTS: Open court with a ≥4 kite ring. Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
SPECIAL_RULES: Metadata only (`usableByEnemy`, `targetType`, costs). One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Honesty reroll → ENC-PRIO-15. In a run they count as hostiles for map-clear.  
OBJECTIVE: Clear all. Optional: keep them alive at range for a one-shot.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional one-cast. Overlay `under_10_turns` if burst-killed.  
TACTICAL_PURPOSE: Priority is **not killing** until the range teach. Distinct from ENC-PRIO-15 (wound the scribe, keep them ≤30%).  
SOLVABILITY_REQUIREMENTS: Tutor reachable. Ring exists so the player can stand at 4.  
REPLAYABILITY: Tutor kit heave-mend vs mid-hood.  
SCALING_BEHAVIOUR: High: pawns are `FSN-INCH-OATH` so the 4-ring is also a min-range exam. Never two tutors.  
STATUS: PROPOSED

---

### ENC-PAIR-02

ENCOUNTER_ID: ENC-PAIR-02  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-PAIRED_FILE` — two extra same-tier elites (hard threat) share a painted bond. Suggested locks: `heave_mender` + `drift_lender` **or** `dual_keeper` + `ready_stinger`. While both live, each takes −20% of already-computed incoming hits (after existing RES/SR). When one dies the survivor loses the bond. Distinct from Duelist Circle, Phalanx Line, and Hollow File. Distinct from ENC-PAIR-01 (90° pair occupancy).  
AI_REQUIREMENTS: Bonded pair uses the matching `FSN-HEAVE-LEND` or `FSN-DUAL-READY` AI. No third elite.  
SPELL_DISCOVERY_OPPORTUNITIES: Matching Heave / Dual observe.  
MAP_REQUIREMENTS: Open court. Add enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2. Twin pennants visual.  
SPECIAL_RULES: The −20% scales the post-formula number — it does not replace `combatMath`. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-WAVE-15. Victory pays hard reward multiplier via `applyRewards`.  
OBJECTIVE: Burst one to break the bond then finish the survivor, fight both under the bond, or (exploration) walk to a portal and leave. In a run they count as hostiles for map-clear.  
FAILURE_CONDITION: Player death.  
REWARD: Hard multiplier. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two elites whose **together** is the armor. Distinct from ENC-DUEL-01 (rage-on-death).  
SOLVABILITY_REQUIREMENTS: Both reachable. Bond thread is chrome, not a wall.  
REPLAYABILITY: Heave pair vs Dual pair.  
SCALING_BEHAVIOUR: Peak: promote to the matching BRIGADE (`FSN-HEAVE-CHOIR` / `FSN-DUAL-BANK`) **without** the −20% (do not stack bond + brigade).  
STATUS: PROPOSED

---

### ENC-ELITE-26

ENCOUNTER_ID: ENC-ELITE-26  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HEAVE-CHOIR` — Heave Mend + Drift Lend + bruiser (Shoulder Bash). Unlock after ENC-HEAVE-01.  
AI_REQUIREMENTS: As ENC-HEAVE-01 plus the bruiser writes `forcedMovedThisTurn` on a dest that leaves a walk-off. Never all three on turn 1 against a full-HP player who has not acted. Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: Heave Mend / Drift Lend if still missing. Bounce File (`FSN-HEAVE-CHOIR/BOUNCE`) is a **replay skin**, not a second discovery.  
MAP_REQUIREMENTS: Courtyard + gallery. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Do not pack Both Mend. Honesty: missing force-move → ENC-HEAVE-01 leftover without claiming Choir.  
OBJECTIVE: Defeat all. Intended: occupy bash dest so neither flag writes.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing`.  
TACTICAL_PURPOSE: Shove both, cash the dual-force 8, fund the follow-up. Mastery of ENC-HEAVE-01.  
SOLVABILITY_REQUIREMENTS: Walk-off after bash. Bruiser dest never occupies the portal.  
REPLAYABILITY: Bruiser west vs east. Bounce File skin after one Choir clear.  
SCALING_BEHAVIOUR: Do not add a fourth healer. Peak: inherit Open Draft.  
STATUS: PROPOSED

---

### ENC-ELITE-27

ENCOUNTER_ID: ENC-ELITE-27  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DUAL-BANK` — Dual Keep + Ready Sting + Drift Sip. Unlock after ENC-READY-01.  
AI_REQUIREMENTS: As ENC-READY-01 plus Sip steals leftover AP iff the target was **force-moved** (not walked). Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Dual Keep / Ready Sting if still missing.  
MAP_REQUIREMENTS: Open court, two flanks. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Do not pack Purse Keep / Stride Keep. Honesty: missing leftover-pair writer → ENC-READY-01 leftover.  
OBJECTIVE: Defeat all. Intended: empty one wallet; occupy bash dest so Sip never pays.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Bank both wallets, poke leftover pair, steal the shoved AP. Mastery of ENC-READY-01.  
SOLVABILITY_REQUIREMENTS: Two flanks. Sip dest is not the only exit.  
REPLAYABILITY: Sip north vs east.  
SCALING_BEHAVIOUR: Do not add a second Keep. Never leftover-AP-only Purse as Dual’s writer.  
STATUS: PROPOSED

---

### ENC-RARE-14

ENCOUNTER_ID: ENC-RARE-14  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-DRIFT-COURT` — Drift Hold leader + Must Drift + Bash bruiser. Optional junior Mid Hood. One elite only (the Hold-leader). Unlock after ENC-MID-01 **and** a leader-boost CADRE (`FSN-RITE-LONG` or `FSN-BOOT-OATH`). **Skip** `FSN-DRIFT-COURT/SEPT` while remaining cap < 7.  
AI_REQUIREMENTS: Turn 1–2: Hold if they still want to kite. Bash toward a wall **beside** the engagement, never the last exit. Must-Drift only after a dir exists **and** a walk-off that is not that vector remains. Never all three on turn 1 against a full-HP player who has not acted. Soph 6–8. `escapeRoute` on. InstantKill / betrayal / Root stay off.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-drift-hold` if missing. Mid Hood may already have dropped.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets. Dungeon depth may not add a fifth hostile to this id.  
SPECIAL_RULES: 8% insert on depth 4, only if ENC-MID-01 exists this account. Drift Hold: walk MP refuses until `forcedMovedThisTurn`. Strike does **not** peel. Spells stay legal. Stand is legal. Honesty reroll → ENC-MID-01 leftover. Teaching BRIGADE `FSN-DRIFT-COURT/LANE` drops optional Hood. Side Brace / Lone Banner are **skins**, not this room.  
OBJECTIVE: Defeat all. Intended: occupy bash dest, stand, Strike, wait, or kill Hold.  
FAILURE_CONDITION: Player death.  
REWARD: High-band XP/Doka via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Court-scale walk lock without `instantKill`. Highest structured tempo threat in this drop. Still turn-based.  
SOLVABILITY_REQUIREMENTS: Gallery exists. Bash dest leaves a walk-off. Hold may retreat after a peel rather than suddenly one-shot.  
REPLAYABILITY: With Hood vs `FSN-DRIFT-COURT/LANE`. Brace / Banner skins after one Court clear.  
SCALING_BEHAVIOUR: Do not add a fifth hostile. Never Root + Hold. Never Sept while cap is 2.  
STATUS: PROPOSED

---

### ENC-TREAS-14

ENCOUNTER_ID: ENC-TREAS-14  
TYPE: treasure/risk room  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Optional 1× pawn guardian **only if** the player opens the chest on an odd round after a failed 1-AP spend (no guardian on even). Default: no guardian.  
AI_REQUIREMENTS: Guardian greedy if spawned. Portal unlocked if the chest is skipped.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible chest with an even-round pip (`WF-TRS-TURN_CACHE`). 1 AP adjacent opens it only on even rounds: a soft `applyRewards` grant and no guardian. On odd rounds the AP is spent and the chest stays closed. Distinct from Watch Cache, Gutter Steam, and Relic Cache (2 AP, maybe a guardian). Adjacent-open, not a wall. Optional.  
SPECIAL_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Failed open spends AP only. No `updateCharacter` Doka. `doka_fever` stays opt-in on a **different** tile, never as the chest’s scaler.  
OBJECTIVE: Optional: wait for even and spend 1 AP, skip the wait, or walk past.  
FAILURE_CONDITION: Player death if a guardian spawned. Skipping is success.  
REWARD: Soft grant on even open. Overlay none (the wait *is* the challenge).  
TACTICAL_PURPOSE: Even-round purse after the odd-seam lesson. Distinct from ENC-TREAS-13 (hire cache / summon-adjacent).  
SOLVABILITY_REQUIREMENTS: Map is solvable if the chest is never used.  
REPLAYABILITY: Chest west vs east.  
SCALING_BEHAVIOUR: High: inherit odd-seam so the wait is also a path tax. Never a hard grant on this chest.  
STATUS: PROPOSED

---

### ENC-TURN-01

ENCOUNTER_ID: ENC-TURN-01  
TYPE: treasure/risk room / rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None required. Rest-adjacent side room.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Same `WF-TRS-TURN_CACHE` as ENC-TREAS-14, placed on a rest map **beside** the white sanctuary portal (not on spawn).  
SPECIAL_RULES: Rest-only. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn. Opening does not start a fight.  
OBJECTIVE: Optional even-round open.  
FAILURE_CONDITION: None (rest). Leaving is always legal.  
REWARD: Soft grant. No overlay.  
TACTICAL_PURPOSE: Rest-map even-pip so ENC-REST-14 can offer this as a device without a combat roster.  
SOLVABILITY_REQUIREMENTS: Adjacent-open. Not a wall.  
REPLAYABILITY: Left alcove vs right.  
SCALING_BEHAVIOUR: Do not add a guardian on rest.  
STATUS: PROPOSED

---

### ENC-CAST-01

ENCOUNTER_ID: ENC-CAST-01  
TYPE: optional challenge / rest choice  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Standard rest-exit pack **or** none if flagged from a prior foyer. The inlay is the device.  
AI_REQUIREMENTS: If a pack exists, standard kits. Attack Nearest is **not** a cast.  
SPELL_DISCOVERY_OPPORTUNITIES: None. The wager is on **casting**, not discovering.  
MAP_REQUIREMENTS: Violet-slate inlay (`WF-RSK-CAST_OATH`). End a turn on it to flag this map. If the next `applyRewards` happens after the player has cast at least one `SpellConfig` spell this map (not Attack Nearest, not a summon kit), that credit uses the hard multiplier. If they never cast, the flag pays nothing extra. Distinct from Kindled Hour (map-wide must cast a paid-AP spell), Steel Hour (map-wide skip paid-AP spells), and Spare Oath (leftover AP at end of turn). Distinct from ENC-OATH-01 (stillness).  
SPECIAL_RULES: Optional floor tile. Map is solvable if never used. Cast means a player spell whose `SpellConfig` was spent. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
OBJECTIVE: Optional: flag a fight you will cast in, or stay unflagged and lean on Attack Nearest.  
FAILURE_CONDITION: Player death. An uncashed flag is not a fail.  
REWARD: Hard multiplier if cashed. No overlay (the risk *is* the challenge).  
TACTICAL_PURPOSE: Opt-in “I will cast.” Distinct from ENC-BAND-01 (mid-HP band) and ENC-SOLO-01 (no-pet).  
SOLVABILITY_REQUIREMENTS: Optional. Never on spawn/portal.  
REPLAYABILITY: Inlay mid vs flank.  
SCALING_BEHAVIOUR: High: pair with ENC-PRIO-16 so the one-cast also cashes the oath. Never a map-wide must-cast.  
STATUS: PROPOSED

---

### ENC-SUMMON-01

ENCOUNTER_ID: ENC-SUMMON-01  
TYPE: optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Exploration pack only. Forbidden as a dungeon-clear requirement.  
AI_REQUIREMENTS: Standard.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-SUMMON_BELL` overlay. This map only: if a living allied summon exists at the next `applyRewards`, that credit uses the hard multiplier. If no allied summon is alive at credit, that credit is unchanged. Inverse of Vacant Hour. Distinct from Bond Oath (voluntary flag that requires a living summon at credit) and Solo Oath (flag that fails if a summon still lives). Distinct from ENC-HIRE-01 (summon-adjacent chest).  
SPECIAL_RULES: Exploration only (run maps require a clear). Allied summon means player-side living unit that is not the player. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Leaving is always legal.  
OBJECTIVE: Optional: keep a summon alive through the credit, or skip pets and take normal rewards.  
FAILURE_CONDITION: Player death. Skipping pets is success.  
REWARD: Hard multiplier if a pet lives at credit. No overlay.  
TACTICAL_PURPOSE: Opt-in pet-up purse after Bond Seam taught that pets can **tax**. Inverse of ENC-SOLO-01.  
SOLVABILITY_REQUIREMENTS: No blocks.  
REPLAYABILITY: Bell chrome only.  
SCALING_BEHAVIOUR: Do not require a summon to leave. Never dungeon.  
STATUS: PROPOSED

---

### ENC-REST-14

ENCOUNTER_ID: ENC-REST-14  
TYPE: rest choices  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None. Rest map (`normal` / `dungeon` / `boss` already exposed).  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Rest may remind unowned Heave Mend / Mid Hood / Dual Keep as **hints**, not grants.  
MAP_REQUIREMENTS: White sanctuary portal colocates with spawn. Devices: Labor leftover from day-13 is **off**. New devices: Fold Wall as a **one-room side chapel** (optional), Turn Cache (ENC-TURN-01), Cast Oath inlay (ENC-CAST-01), Mark Gate as a **bonus gamble exit** (`WF-PRT-MARK_GATE` — rest/overworld only).  
SPECIAL_RULES: Snapshot dungeon-chain refs **before** `cleanupMap`. Mark Gate is not an exit until the player has dealt HP to a hostile this map, then entering rolls a random eligible overworld map and pays a hard `applyRewards` grant. It is never the only portal. Distinct from Tally Gate (4 AP spent, no hit required), Still Gate (no-fight), Latch Gate (1 AP adjacent to arm the gate itself), and Mercy Bell (leave a living hostile). Forbidden in dungeon, boss rush, and Death Realm.  
OBJECTIVE: Heal / shop / choose a side device / leave through the stable portal. Optional: land a hit this map to arm Mark Gate.  
FAILURE_CONDITION: None (rest). Death Realm still applies if a side chapel fight is taken.  
REWARD: Rest heal is not `applyRewards`. Device grants go through `applyRewards`. No overlay.  
TACTICAL_PURPOSE: Choice beat after Heave / Dual / Mid pressure. Mark Gate is the new rest verb.  
SOLVABILITY_REQUIREMENTS: Stable portal always reachable. Mark Gate unmarked does not count as an exit.  
REPLAYABILITY: Which device is offered (fold / turn / cast / mark).  
SCALING_BEHAVIOUR: Do not add a dungeon boss to rest.  
STATUS: PROPOSED

---

### ENC-BRANCH-14

ENCOUNTER_ID: ENC-BRANCH-14  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None in the foyer.  
MAP_REQUIREMENTS: Four locked exits labeled by **metadata** `branch: heave | dual | mid | cinder` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: heave → ENC-HEAVE-01, dual → ENC-READY-01, mid → ENC-MID-01, cinder → ENC-CINDER-01.  
SPECIAL_RULES: One choice. The flag skins ENC-MAST-14 and ENC-BOSS-14. Do not spawn all four packs in the foyer.  
OBJECTIVE: Pick a door and clear the destination.  
FAILURE_CONDITION: Player death in the destination. Foyer death is also Death Realm.  
REWARD: Destination reward. Overlay none in the foyer.  
TACTICAL_PURPOSE: Player-authored primer. ENC-BOSS-14 reads `branch`.  
SOLVABILITY_REQUIREMENTS: All four doors walk-reachable. None on spawn.  
REPLAYABILITY: Four destinations.  
SCALING_BEHAVIOUR: High: foyer pawn is a Far Picket (ENC-AMBUSH-14) so lingering to read doors is a fight. Never a fifth door.  
STATUS: PROPOSED

---

### ENC-MINI-15

ENCOUNTER_ID: ENC-MINI-15  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `weeping_pawn` (dummy-adjacent: a 1-HP extra is **not** Dummy Post unless honesty). Branch heave: `crimson_countess`. Branch dual: `eternal_pawn_king`. Branch mid: `midnight_bishop`. Branch cinder: `fetid_rook`. Do **not** use `effigy_clerk` / `enter_deacon` / `split_acolyte` / `quiet_chorister`.  
AI_REQUIREMENTS: Existing boss kits. No Table L directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (odd-seam / spent-plate / fold-wall / one spike bridge) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-14

ENCOUNTER_ID: ENC-BOSS-14  
TYPE: boss (dungeon capstone)  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One live `BossId` read from `branch`: heave → `crimson_countess`, dual → `eternal_pawn_king`, mid → `midnight_bishop`, cinder → `lord_of_static`. Default if no flag: `pale_archbishop`. Do **not** add Wave-14 ids.  
AI_REQUIREMENTS: Existing boss AI. No Table L objects (Mannequin / Narthex / Pyx / Muffler).  
SPELL_DISCOVERY_OPPORTUNITIES: Live boss discoverables only.  
MAP_REQUIREMENTS: Live boss arena plus **one** inherited Wave-13 feature from the branch (odd-seam gallery / spent-plate / still-cinder / spike bridge). Never on the boss tile or portal.  
SPECIAL_RULES: Dual-boss stays Rush-only. Live 19 `BOSS_IDS` remain the dungeon capstone fallbacks.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Dungeon-complete bonus via the one-shot id (`utils/dokaPersist.ts`) then `applyRewards`. Overlay `no_healing`.  
TACTICAL_PURPOSE: Prove the primer against a shipped kit, not a queued Wave-14 director.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited feature not a cut-vertex. Re-run solvability after overlay.  
REPLAYABILITY: Four branches + default.  
SCALING_BEHAVIOUR: Do not attach `titans_vigor`. Do not add a second boss.  
STATUS: PROPOSED

---

### ENC-MAST-14

ENCOUNTER_ID: ENC-MAST-14  
TYPE: mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Branch skin of the combine the account picked: heave → `FSN-HEAVE-CHOIR`, dual → `FSN-DUAL-BANK`, mid → `FSN-MID-STEP`, cinder → `FSN-CINDER-MARK/EMBER`.  
AI_REQUIREMENTS: Matching BRIGADE / variant AI. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Only if the combine observe never fired.  
MAP_REQUIREMENTS: Combine map plus one Wave-13 overlay (odd-seam or open-draft).  
SPECIAL_RULES: Insert after ENC-BRANCH-14. Honesty: missing writer → the PAIR leftover (ENC-HEAVE-01 / ENC-READY-01 / ENC-MID-01 / ENC-CINDER-01) without claiming mastery.  
OBJECTIVE: Defeat the pack using the taught answer (unshove / empty a wallet / stand or step to 1 or 3 / occupy the toward-tile).  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay matches the combine (`under_8_ap_per_turn` or `no_healing`).  
TACTICAL_PURPOSE: Prove the verb under a second tax.  
SOLVABILITY_REQUIREMENTS: Combine solvability plus overlay not a cut-vertex.  
REPLAYABILITY: Four skins.  
SCALING_BEHAVIOUR: Peak: inherit Open Draft. Never a second BRIGADE.  
STATUS: PROPOSED

---

### ENC-JOIN-01

ENCOUNTER_ID: ENC-JOIN-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HEAVE-QUIET` — Heave Step (join a **force-moved** ally) + Quiet Sill leftover **off** (Quiet is ENC-QUIET-01). Bodies: `heave_stepper` + a file gun (`glass_sniper` overlay or frost bishop). Never PAIR Heave Step with Home / Ally / Hook / Cover / Hinge as a two-body lesson.  
AI_REQUIREMENTS: Stepper joins a shoved ally dest (occupancy, **not** `isSwap`). Gun covers the file. Blocked / lava / pit dest spends AP (whole card fizzles — no partial). Player keeps ≥ 1 walk-off after the body lands. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-heave-step` if missing. Do not grant Home Step / Ally Step.  
MAP_REQUIREMENTS: Courtyard + gallery. Reject a closet.  
SPECIAL_RULES: Family lottery **off**. Heave Step dests are occupancy. Walk MP does not set force-move. Honesty reroll → ENC-ALLY-02 without claiming Join. Unlock after ENC-HEAVE-01 **or** ENC-HOME-01.  
OBJECTIVE: Defeat both. Intended: occupy the join dest; the stepper fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Join the shoved gun, cover the file. Three-body lesson stays BRIGADE; this CELL is the teach.  
SOLVABILITY_REQUIREMENTS: Join dest is not the only exit. Walk-off remains.  
REPLAYABILITY: Gun north vs east.  
SCALING_BEHAVIOUR: High: full `FSN-HEAVE-QUIET` three-body. Never Quiet Sill on this PAIR.  
STATUS: PROPOSED

---

### ENC-RUSH-51

ENCOUNTER_ID: ENC-RUSH-51  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table L `L0` — `effigy_clerk` + `lock_marshal`.  
AI_REQUIREMENTS: Plant straw on a **legal axis**; pop it without walking off-axis. Compass / dummy dest **never** occupies the Mannequin. Off-axis walks already reject (0 MP). Post is not a Rank Lock target. Not Goad / Bait / Cover / Counter / Grandmaster / Quiet / Fosse / Hex / Palisade / Ram / Hook / Rime. Hold if `summonAI === "dummypost"` **or** Rank Lock is missing.  
SPELL_DISCOVERY_OPPORTUNITIES: None required (Rush). Dummy Post may already have dropped from ENC-DUMMY-01.  
MAP_REQUIREMENTS: Rush court plus a painted Mannequin cell (floor) that Compass / dummy dest never occupy.  
SPECIAL_RULES: Unlock after one full Table K clear (`K0`–`K3`). New `roomIndex` namespace `L0`. Do **not** overwrite `BOSS_RUSH_ROOMS` or Tables B–K. Post HP **1** (fixed).  
OBJECTIVE: Defeat both. Post death ≠ victory.  
FAILURE_CONDITION: Player death.  
REWARD: Rush room grant via `completeBossRushRoom` (ignore client `dokaReward` / `xpReward`). Character must exist. Room-clear `applyRewards` only after `currentRoom` actually advanced.  
TACTICAL_PURPOSE: Taught Dummy Post + Rank Lock after day-10 ENC-DUMMY-01 and day-6 ENC-LOCK-01.  
SOLVABILITY_REQUIREMENTS: Mannequin ≠ Compass dest. Both bosses reachable. Post ≤ remaining cap.  
REPLAYABILITY: Mannequin west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP. Filter radius is the only P2 widen.  
STATUS: PROPOSED

---

### ENC-RUSH-52

ENCOUNTER_ID: ENC-RUSH-52  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table L `L1` — `enter_deacon` + `stride_censor`.  
AI_REQUIREMENTS: Pay walk-MP to **steal** the public 6, or let the extra drink. Ledger **never** occupies the Narthex. Forced-move enter is free of walk MP (Stride does not tax it) and **does** consume the pad. Not Font / Salve / Infirm / Mend Wick / Crypt / Fosse. Hold if Enter Mend paint **or** walk-MP tithe is missing.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Rush court plus a painted Narthex cell that the Ledger never occupies.  
SPECIAL_RULES: `L1` after `L0`. Occupant already standing when painted does **not** trigger. Swap-enter: until MIMA-001 lands, treat as legal position, heal **blocked**.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-51.  
TACTICAL_PURPOSE: Taught first-enter heal pad + walk-MP tithe after day-13 Labor / Stride.  
SOLVABILITY_REQUIREMENTS: Narthex free. Player can reach a pad this turn **or** refuse it.  
REPLAYABILITY: Narthex north vs south.  
SCALING_BEHAVIOUR: Do not add a third boss. P2 3-pad lattice is the only widen.  
STATUS: PROPOSED

---

### ENC-RUSH-53

ENCOUNTER_ID: ENC-RUSH-53  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table L `L2` — `split_acolyte` + `cord_familiar`.  
AI_REQUIREMENTS: Isolate the cup, or the **familiar** is the neighbor. Cord’s summon-gate **never** occupies the Pyx. Familiar death ≠ victory. Dummy Post extras are not preferred neighbors. Not Font / Cover / Infirm / Lend / Enter / Counter. Hold if Split Mend adjacent-ally scan **or** Cord summon-gate is missing.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Rush court plus a painted Pyx cell that the gate never occupies.  
SPECIAL_RULES: `L2` after `L1`. Split Mend heals the target 6 and the nearest living **other** ally at Chebyshev ≤ 1 for 6 — if no adjacent ally, the target receives the full 12. Primary is never the caster. Shared 4-extra cap.  
OBJECTIVE: Defeat both. Familiar death ≠ victory.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-51.  
TACTICAL_PURPOSE: Taught split-heal + familiar neighbor after day-9 ENC-SHARE-01 and Cord leftover.  
SOLVABILITY_REQUIREMENTS: Pyx free. Isolation (Chebyshev ≥ 2 from extras) is a complete answer.  
REPLAYABILITY: Pyx west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-54

ENCOUNTER_ID: ENC-RUSH-54  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table L `L3` — `quiet_chorister` + `bone_cavalier`.  
AI_REQUIREMENTS: Land the knight **off** the stall, or Strike from a legal cell. Spike-on-land dest **never** occupies the Muffler. Quiet never paints the knight-landing telegraph. Vault once/battle still answers. Not Oath / Dummy / Goad. Hold if Quiet Sill **or** `SPIKE_ON_LAND` dest writer is missing.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Quiet Sill may already have dropped from ENC-QUIET-01.  
MAP_REQUIREMENTS: Rush court plus a painted Muffler cell that the spike dest never occupies.  
SPECIAL_RULES: `L3` after `L2`. Quiet Sill paints a cell for 2 turns — the occupant cannot resolve `isPhysical === true` or id `physical_attack`; other spells stay legal; walk on/off is legal. Do **not** pack Dummy + Quiet (held: two Wave-14 cores).  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-51.  
TACTICAL_PURPOSE: Taught Quiet Sill + knight spike-on-land after day-13 ENC-QUIET-01 and live Bone Cavalier.  
SOLVABILITY_REQUIREMENTS: Muffler ≠ spike dest. A legal Strike cell exists off the stall.  
REPLAYABILITY: Muffler north vs south.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain AA — “Heave / Dual Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-14 then ENC-SPELL-27 (or ENC-SPELL-28 if Heave Mend already owned) |
| 2 | Reinforce | ENC-WAVE-15 |
| 3 | Combine | ENC-HEAVE-01 **or** ENC-READY-01 **or** ENC-MID-01 |
| 3 insert | Choice | ENC-BRANCH-14 → heave/dual/mid/cinder destinations |
| 4 | Pressure | ENC-SURV-27 **or** ENC-CINDER-01 **or** ENC-HALVE-01 **or** skip via ENC-REST-14 |
| 4 | Mastery | ENC-MAST-14 (branch skin) |
| 5 | Boss | ENC-BOSS-14 |

Rare: 8% on depth 4 to **insert** ENC-RARE-14 before mastery (only if ENC-MID-01 exists this account).  
Treasure: rest may offer ENC-TREAS-14 instead of ENC-PROT-14.  
Dummy side-story: replace combine with ENC-DRIFT-01 and mini-boss ENC-MINI-15 (`weeping_pawn`).

### Chain AB — “Fold / Kill Primer” (maxDepth 4)

ENC-FOLD-01 → ENC-KILL-01 → ENC-WOUND-01 → ENC-REST-14 → ENC-BOSS-14 (`alabaster_fortress` only if Fold was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-FOLD-01 as teach on accounts that already know Odd Seam.

### Rush injection (day-14)

After one full Table K clear, ENC-REST-14 shrine can enable: L0 → ENC-RUSH-51, L1 → ENC-RUSH-52, L2 → ENC-RUSH-53, L3 → ENC-RUSH-54. Day-1…day-13 flags for rooms 0–9 and Tables B–K remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-14, ENC-SPELL-27, ENC-SPELL-28 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-27, ENC-HAZ-28, ENC-FOLD-01, ENC-SPENT-01, ENC-KILL-01, ENC-WOUND-01 | `under_50_damage` |
| ENC-HEAVE-01, ENC-READY-01, ENC-MID-01, ENC-ELITE-26, ENC-ELITE-27, ENC-PAIR-02 | `under_8_ap_per_turn` |
| ENC-WAVE-15, ENC-PRIO-16, ENC-MAST-14, ENC-MINI-15, ENC-HALVE-01 | `under_10_turns` |
| ENC-DRIFT-01, ENC-INCH-01, ENC-RITE-01, ENC-JOIN-01, ENC-RARE-14 | `direct_hit` |
| ENC-PIN-02, ENC-ELITE-26, ENC-PROT-14, ENC-BOSS-14 | `no_healing` |
| ENC-SURV-27, ENC-SURV-28 | `no_healing` / `under_50_damage` (not `no_damage_taken`) |
| ENC-CINDER-01, ENC-SPIKE-01, ENC-OFF-01, ENC-AMBUSH-14, ENC-REINF-14 | `under_50_damage` |
| ENC-TREAS-14 / ENC-REST-14 / ENC-TURN-01 / ENC-CAST-01 / ENC-SUMMON-01 / ENC-BRANCH-14 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | 6 odd-seam tiles **or** 1 still cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | seam **or** spent plate | kill + optional glyph |
| MID | named drop-13 `FSN-*` or waves | backline guard | zone 1 + Heave/Dual/Mid | one Wave-13 `WF-*` | clock / pads / fold |
| HIGH | elite or choir | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / cluster / hold |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / COURT / rare | branch-skinned | mastery / Table L |

If a live player is over-levelled for a band, **promote the band’s verb** (add Drift Lend, enable Dual Bank, inherit seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-13 fields plus:

```
encounterId
encounterType        // + heave | dual_ready | mid_drift | cinder | drift_gate |
                     //   spike_tap | off_fee | inch | halve | rite | bar_pin |
                     //   odd_seam | still_cinder | spent_plate | fold_wall |
                     //   kill_sill | rival_font | wound_step | far_picket |
                     //   turn_cache | range_tutor | cast_oath | one_stride |
                     //   summon_bell | open_draft | paired_file | mark_gate |
                     //   join_step
formationId?         // FSN-HEAVE-LEND | FSN-DUAL-READY | FSN-MID-DRIFT |
                     // FSN-CINDER-MARK | FSN-DRIFT-GATE | FSN-SPIKE-TAP |
                     // FSN-OFF-FEE | FSN-INCH-OATH | FSN-HEAVE-CHOIR |
                     // FSN-DUAL-BANK | FSN-MID-STEP | FSN-HEAVE-QUIET |
                     // FSN-HALVE-PACE | FSN-RITE-LONG | FSN-BAR-PIN |
                     // FSN-DRIFT-COURT
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // heave | dual | mid | cinder
decoyId? / realId?
holdPortalLocked?
objectiveKind        // + deny_font | open_turn_cache | flag_cast_oath |
                     //   keep_range_tutor | knock_fold | plant_kill_sill |
                     //   arm_mark | steal_enter_pad | isolate_cup |
                     //   land_off_stall
failureKind
deviceTable[]        // ENC-REST-14 Fold / Turn / Cast / Mark
rushVariant?         // table_l0_effigy_lock | table_l1_enter_stride |
                     //   table_l2_split_cord | table_l3_quiet_bone
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Clerk / Deacon / Mender” logic — use `decoyId` / `realId` / `formationId` / `summonAI`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-21 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not. `fog_of_war` may still be used as a **wall-hook substitute** for ambush concealment, matching day-1…13 language.
- Dual-boss dungeon capstones (Rush only).
- Consuming same-day 2026-10-22 Wave 14 family / spell / world catalogs, if any land in parallel. Wave 13 families wait for a later formation drop. `FSN-DRIFT-COURT/SEPT` / Six Span / Penta / Quad stay held while `ENEMY_SUMMON_CAP` is 2 (Sept needs remaining ≥ 7).
- Faking Heave Mend without two force-move flags, Dual Keep without leftover-AP **and** leftover-MP, Ready Sting as Dry/Damp, Mid Hood as a ≤1 or ≥3 zero, Must Drift as Must Step, Cinder Reel as Paint Reel, Drift Post walk-on as a detonate, Spike Skip as a required player hop, Off Plate as an own-turn miss, Inch as all-remaining 1-steps, Halve as Trim −1, Rite as Boot Hold, Bar Mend as Heave, Fold as smash-only, Spent Plate as Glyph Plate, Kill Sill as Heal Sill, Wound Step as Clear Step, Rival Font as Labor Font, Far Picket as High Picket, Mark Gate / Summon Bell in a dungeon.
- Adding Wave-14 boss ids to dungeon ENC-BOSS-14 in the same PR as a Rush remap.
- Packing Dummy + Quiet (held: two Wave-14 cores). Packing Heave Mend with Both / Clash / Shove / Bar as a PAIR.

---

## 10. Pick order (day-14, after days 1–13 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–13 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-14 + ENC-SPELL-27 (odd-seam / heave-mend verbs)  
2. ENC-WAVE-15 (`formationId` HEAVE-LEND → DUAL-READY)  
3. ENC-HEAVE-01 or ENC-READY-01 or ENC-MID-01 (new pressure objects)  
4. ENC-BRANCH-14 (`branch: heave|dual|mid|cinder` snapshot-before-cleanup)  
5. ENC-BOSS-14 branch read  
6. Rush Table L variants 51–54 one room at a time (after the account has one full Table K clear)

Uniqueness: this file is the **fourteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
