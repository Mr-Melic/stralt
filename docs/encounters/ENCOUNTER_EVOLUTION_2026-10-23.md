# Encounter Evolution Catalog — 2026-10-23

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-23-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-14 Wave 13 packs `docs/design/ENEMY_FORMATIONS_2026-10-22.md` (PR #897), Wave 14 world features in `docs/WORLD_DYNAMICS.md` (PR #902, `WDD-2026-10-22-001`), Rush Table M `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.12 (PR #903). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-23) Wave 15 family catalog PR #941, plus any Wave 15 spell / world-feature / formation catalogs that land in parallel, stay **unconsumed**. Wave 14 **families** (`gaunt_mender`, `cadence_lagger`, `oct_prelate`, `even_hooder`, `gaunt_stinger`, `gaunt_stepper`, `still_gifter`, … — PR #899) wait for a later formation drop (drop 15). Wave 15 **bosses** stay Rush-only (Table M). Wave 13 **families** (`dry_gaiter`, `cadence_imprinter`, `six_prelate`, `odd_hooder`, `lean_stinger`, `parched_stepper`, `parched_siller`, `dry_holder`, `lean_lender`, `parched_sipper`, `lean_prelate`, `must_leaner`, `verse_leaner`, `lean_holder`, `diag_warder`, `mid_oather`, `void_reeler`, `foe_biter`, `dwell_marker`, `own_plater`, `cinder_skipper`, `full_plater`, `summon_toller`, `still_mender`, `cadence_rester`, `spent_taxer`, `brick_cracker`, `watch_lender`, `pair_purser`, `escort_cutter`, `dry_mender`) are legal **metadata locks** on drop-14 sheets, not a 30% lottery.

---

## 1. Why a fifteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–14 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, and Heave/Dual/Mid. Day-14 rooms spent leftover drop-13 packs (`FSN-HEAVE-LEND`, `FSN-DUAL-READY`, `FSN-MID-DRIFT`, …) and Wave 13 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-14 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-14 Wave 13 packs | Day-14 taught dual-**force** heal / leftover-**pair** bank / exact-2 miss as **rooms**. Still PDFs: `FSN-DRY-STEP`, `FSN-LEAN-SIP`, `FSN-ODD-MUST`, `FSN-VOID-DWELL`, `FSN-DRY-GATE`, `FSN-DIAG-OATH`, `FSN-CINDER-FULL`, `FSN-OWN-WATCH`, `FSN-IMPRINT-CHOIR`, `FSN-LEAN-COURT`, `FSN-PARCHED-QUIET`, `FSN-STILL-REST`, `FSN-FOE-ESCORT`, `FSN-SPENT-CRACK`, `FSN-PAIR-DRY`, `FSN-LEAN-HOLD` |
| World-feature Wave 14 | Day-14 **rooms** never spent `WF-HAZ-EVEN_SEAM`, `WF-HAZ-HURT_CINDER`, `WF-TRP-ECHO_PLATE`, `WF-TER-SLIDE_SCREEN`, `WF-OBS-RETREAT_SILL`, `WF-ZON-ALONE_FONT`, `WF-TEL-FULL_STEP`, `WF-INV-GAP_FILE`, `WF-ELT-MID_PICKET`, `WF-TRS-CLASH_CACHE`, `WF-SPL-CLOSE_TUTOR`, `WF-RSK-SCAR_OATH`, `WF-MOD-FILE_WALK`, `WF-EVT-FAR_HOUR`, `WF-ENV-HUNT_DRAFT` |
| Rush Table M | `M0`–`M3` (`jostle_subdeacon`+`counter_chaplain`, `peel_friar`+`cinder_lance`, `dilate_organist`+`levy_rector`, `hood_recluse`+`hexed_marker`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `evenSeamCells` / `hurtCinderCell` / `echoPlateCell` / `slideScreenCell` / `retreatSillCell` / `aloneFontCell` / `fullStepPads` / `fileWalkArmed` / `midPicketArmed` / `huntDraftArmed` / `farHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6** — do not spawn them while remaining cap < 6 (live cap is 2). Oct Span (`oct_prelate`) counts as **8** — wait for drop 15.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Dry / Lean / Odd / Void / Pair bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Dry Gait / Still Mend / Pair Dry live **only** on the named profiles. Do **not** ship `spell-parched-mend`.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-INCANT_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-FAR_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-15 ids (`jostle_subdeacon`, `peel_friar`, `dilate_organist`, `hood_recluse`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step **does not** count as leftover walk-MP for Dry Gait, Lean Sting, Must Lean, Verse Lean, or Parched Sill. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`.
- Dry Gait pays 8 only if **both** leftover walk MP = 0. One wet body is 0 HP. Parched Step relocates onto a free Chebyshev-1 of an ally whose leftover MP is already 0 — not Home / Heave / Ally Step, not `isSwap`. Lean Sting is 10, +8 iff **target** leftover AP = 0 **and** leftover MP ≥ 1. Parched Sip steals 1 leftover MP on that same window. Odd Hood zeros a hit from **odd** Chebyshev (1, 3, 5, …); even (0, 2, 4) lands and does **not** consume. Must Lean makes remaining **non-Strike** spells illegal unless leftover walk MP = 0. Void Reel is the **sixth** `applyAttract` dest (file / ally / foe / paint / hazard / then void-or-portal). Dwell Mark detonates on **end-turn occupy**. Dry Post detonates on end-turn occupy **and leftover AP = 0**; walk-on is safe; relocate-on is safe. Diag Stride makes the **next** walk diagonal-only. Mid Oath wants the next spell at Chebyshev **exactly 2**. Cinder Skip is next **1-tile** walk treating **cinder** as floor; lava / spikes / pits still tick. Full Plate is leftover **AP ≥ 3** → +RES (inverse of Tapped Plate’s leftover AP = 0). Own Plate zeros the next **own-turn** hit; off-turn hits land. Watch Lend: overwatch snap grants the **watcher** +1 AP (inverse of Watch Fee). Cadence Imprint **copies** matching remaining CDs onto the caster; the target keeps them. Verse Lean makes the last id illegal until leftover MP = 0. Lean Hold refuses Strike until leftover MP = 0. Pair Purse pokes iff leftover AP is **exactly 2**. Pair Dry heals iff leftover AP = 0.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 13 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-DRY-02 / ENC-SPELL-29 / ENC-ELITE-28 (gait skin) | leftover-**MP**=0 on **both** bodies **or** occupancy dest for Parched Step | Convert to ENC-READY-01 (queued day-14) without claiming Dry Gait |
| ENC-LEAN-01 / ENC-ELITE-28 (sting skin) | leftover AP = 0 **and** leftover MP ≥ 1 poke **or** leftover-AP=0 MP steal | Convert to ENC-DRY-01 (queued day-12) without claiming Lean |
| ENC-ODD-02 / ENC-SPELL-30 | Odd Hood odd-Chebyshev consume **or** leftover-MP tool lock | Convert to ENC-NEAR-01 or ENC-MID-01 (queued day-13 / day-14) without claiming Odd |
| ENC-DWELL-01 | sixth `applyAttract` dest (void/portal) **or** end-turn occupy paint | Convert to ENC-CINDER-01 (queued day-14) without claiming Void Reel |
| ENC-GATE-02 | leftover-AP=0 occupy detonate **and** walk-on 0 **or** `summonAI === "leanpost"` | Convert to ENC-DRIFT-01 (queued day-14) without claiming Dry Gate |
| ENC-DIAG-02 | next walk diagonal-only **or** next-spell exact Chebyshev 2 | Convert to ENC-INCH-01 (queued day-14) without claiming Diag |
| ENC-CINDER-02 | 1-tile cinder-as-floor **or** leftover-AP ≥ 3 +RES | Convert to ENC-SPIKE-01 (queued day-14) without claiming Cinder Skip |
| ENC-OWN-01 | own-turn miss consume **or** overwatch snap grants watcher +1 AP | Convert to ENC-OFF-01 (queued day-14) without claiming Own |
| ENC-IMPRINT-01 | copy matching remaining CDs onto caster **or** last-id until leftover MP = 0 | Convert to ENC-HALVE-01 (queued day-14) without claiming Imprint |
| ENC-PARCH-01 | leftover-MP=0 join dest **or** cover occupancy | Convert to ENC-JOIN-01 (queued day-14) without claiming Parched Quiet |
| ENC-STILL-01 | camped (walk-spent=0) heal **or** own remaining skip tick | Convert to ENC-DRY-02 without claiming Still Rest |
| ENC-PAIR-03 | leftover AP **exactly 2** poke **or** leftover-AP=0 heal | Convert to ENC-LEAN-01 without claiming Pair Dry |
| ENC-HOLD-04 / ENC-RARE-15 | Strike refuse until leftover MP = 0 **or** tools-until leftover MP = 0 | Convert to ENC-RITE-01 (queued day-14) without claiming Lean Hold |
| ENC-SLIDE-02 | 1-AP cardinal slide into empty floor **or** LoS-block while walk-through | Convert to ENC-FOLD-01 (queued day-14) without claiming Slide Screen |
| ENC-RETREAT-01 | wall→floor after player end-turn at Chebyshev ≥ 5 | Convert to ENC-KILL-01 (queued day-14) without claiming Retreat |
| ENC-FULL-01 | pad swap only if current HP ≥ 80% max (occupied dest swaps) | Convert to ENC-WOUND-01 (queued day-14) without claiming Full Step |
| ENC-PROT-15 | Alone Font heal only if no other living unit is Chebyshev ≤ 3 | Convert to ENC-PROT-14 (queued day-14, Rival) without claiming Alone |
| ENC-PRIO-17 | one-cast if the player ends a turn at Chebyshev ≤ 1 while they live | Convert to ENC-PRIO-16 (queued day-14) without claiming Close Tutor |
| ENC-AMBUSH-15 | elite appears only while player Chebyshev is 4 or 5 | Convert to ENC-AMBUSH-14 (queued day-14, ≥6) without claiming Mid |
| ENC-SURV-29 | end-of-turn tax if no living **enemy-side** unit is Chebyshev ≤ 3 | Convert to ENC-SURV-27 (queued day-14) without claiming Hunt Draft |
| ENC-GAP-01 | −threat while bonded elites are Chebyshev ≥ 4 apart | Convert to ENC-PAIR-02 (queued day-14) without claiming Gap File |
| ENC-CRACK-02 | walked-last-turn +1 AP tax **or** remove-adjacent-barrier | Convert to ENC-PIN-02 (queued day-14) without claiming Spent Crack |
| ENC-ESCORT-01 | adj-hostile-to-target bite **or** handler-with-pet-in-2 cut | Convert to ENC-FANG-01 (queued day-12) without claiming Foe Escort |
| ENC-RUSH-55…58 | Table M bosses + stole/stoup/antiphoner/capuche objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Dry / Lean / Odd primer + inserts)

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

| Beat | Depth hint | Job | Day-15 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (even-seam hop, dual-dry-MP heal, hurt cinder) | ENC-TEACH-15, ENC-SPELL-29, ENC-HAZ-29 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-16, ENC-AMBUSH-15, ENC-SPELL-30 |
| Combine | 2–3 | Two taught verbs | ENC-DRY-02, ENC-LEAN-01, ENC-ODD-02, ENC-HAZ-30, ENC-SLIDE-02, ENC-GATE-02 |
| Pressure | 3 | Clock, hunt ring, pull-to-void, or own-turn miss | ENC-SURV-29, ENC-PROT-15, ENC-DWELL-01, ENC-OWN-01, ENC-PRIO-17, ENC-GAP-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-15, ENC-BRANCH-15, ENC-TREAS-15, ENC-SCAR-01, ENC-FAR-01, ENC-FULL-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-28, ENC-ELITE-29, ENC-RARE-15, ENC-MAST-15, ENC-DIAG-02, ENC-CINDER-02, ENC-IMPRINT-01, ENC-HOLD-04 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-16, ENC-BOSS-15, ENC-RUSH-55…58 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–14 remain valid. Day-15 **Dry / Lean / Odd primer** is the default for accounts that already cleared Heave / Dual / Mid once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-15

ENCOUNTER_ID: ENC-TEACH-15  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is an even-round path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile moss-ochre ribbon of `WF-HAZ-EVEN_SEAM` across the mid-band (walk tiles cost 4% max HP **only on even rounds**; odd rounds are free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First even-round seam tax logs a teach line. Do not also apply Odd Seam (ENC-TEACH-14: tax on **odd**), Late Seam (ENC-TEACH-12: first **cell** free), Bond Seam (ENC-TEACH-13: tax only with a living allied summon), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: cross only on odd rounds, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is free on odd, a tax on even; waiting a pip is the answer, not a bigger nuke.” Inverse of ENC-TEACH-14. Prepares ENC-HAZ-30 / ENC-TREAS-15 (even-round devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-HURT_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-29`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-29

ENCOUNTER_ID: ENC-HAZ-29  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, it is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-HURT_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit with the **lowest current HP%**; ties break toward the player; 5% max HP on land). If HP% is tied and equal, it hunts the player. A floor path around the orb remains. Exit behind the bishop. Distinct from Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Shy Cinder (away from the nearest body), and Orbiting Cinder (clockwise square).  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: keep a healthier body / wounded summon as the hunt target.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts the wounded, not the last walker.” Distinct from ENC-HAZ-27 (still / 0-MP).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: pawn starts at 70% HP so the orb prefers it. High: inherit one even-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-30

ENCOUNTER_ID: ENC-HAZ-30  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. Pawn may take only the **first** walk tile freely if `WF-MOD-FILE_WALK` is on; further walk tiles that turn must keep that cardinal. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-15 even-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-15`) **plus** `WF-MOD-FILE_WALK` armed (after the first walk tile, further walk tiles must keep that cardinal; stop is legal; leftover MP may still pay teleport tiles). A cardinal dry detour exists. Distinct from One Stride (at most 1 MP), Orth Step (diagonal 2 MP), and Crosswind (slide after a paid step).  
SPECIAL_RULES: Scripted hazards only. File Walk does not rewrite damage. Attack Nearest is not a walk.  
OBJECTIVE: Clear all. Intended: one-tile step, then act; cross the seam on odd.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine even-round tax with a facing lock so “dash across and turn” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: One-tile walks remain usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Lean Sting. Peak: add `WF-ENV-HUNT_DRAFT` so ending far from hostiles is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-29

ENCOUNTER_ID: ENC-SPELL-29  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-DRY-STEP/SOLO-GAIT` fallback — 1× `dry_gaiter` queen (`spell-dry-gait` + `starter-shield`) + 1× pawn (`physical_attack` only). Parched Step off until band 1 honesty.  
AI_REQUIREMENTS: Gaiter Dry-Gaits only if **both** leftover walk MP = 0 **and** missing HP ≥ 8; else Shields. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Dry Gait (8 paid on dual leftover-MP=0) can drop `spell-dry-gait` if missing. Do **not** grant `spell-parched-mend`. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-dry-gait`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Dry Gait, convert to ENC-DRY-02. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-MP writer → ENC-SPELL-27 leftover without claiming Dry.  
OBJECTIVE: Defeat hostiles; emptying both walk pools into the 8 is the intended lesson (refuse it).  
FAILURE_CONDITION: Player death.  
REWARD: The spell id into the owned set + tiny Doka.  
TACTICAL_PURPOSE: Teach “keep 1 leftover MP on one body; the queen is a Shield bot until both pools are dry.”  
SOLVABILITY_REQUIREMENTS: Glyph (if any) is free floor, not a portal. Two walk-offs.  
REPLAYABILITY: Which leftover-MP heal is missing drives the room.  
SCALING_BEHAVIOUR: Mid: enable Parched Step on the pawn (`FSN-DRY-STEP`). High: inherit one even-seam tile. Never Dual Keep on this PAIR.  
STATUS: PROPOSED

---

### ENC-SPELL-30

ENCOUNTER_ID: ENC-SPELL-30  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-ODD-MUST/SOLO-HOOD` fallback — 1× `odd_hooder` knight (`spell-odd-hood` + `physical_attack`) + 1× bishop (`starter-frost` only). Must Lean off until honesty.  
AI_REQUIREMENTS: Hood skips if the only threat sits at even Chebyshev. Bishop Frosts from 3 (odd — the Hood eats it if the player stands there). Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-odd-hood` (primary). If already owned, glyph is `spell-must-lean`.  
MAP_REQUIREMENTS: Court with room to stand at 1, 2, **and** 3. Optional glyph on a side tile. Reject a 1-tile tunnel.  
SPECIAL_RULES: First odd-range miss logs a teach line. Glyph despawns if unused when the last enemy dies (player still wins). Honesty: missing odd consume → ENC-SPELL-28 leftover without claiming Odd.  
OBJECTIVE: Clear. Optional: step to Chebyshev 2, then Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + standard.  
TACTICAL_PURPOSE: Teach “melee at 1 is odd and whiffs; 2 is even and lands.” Prepares ENC-ODD-02.  
SOLVABILITY_REQUIREMENTS: Tiles exist at range 1, 2, and 3 from the Hood’s start. Glyph not on the only walk column.  
REPLAYABILITY: Hood chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Must Lean on the bishop (`FSN-ODD-MUST`). High: inherit one hurt-cinder. Never Far Hood on this PAIR.  
STATUS: PROPOSED

---

### ENC-DRY-02

ENCOUNTER_ID: ENC-DRY-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DRY-STEP` — 1× `dry_gaiter` queen (`spell-dry-gait` + `starter-shield`) + 1× `parched_stepper` queen without heal (`spell-parched-step` + `physical_attack`). No Dry / Still / Heave / Both / Bar Mend on PAIR. No Home / Heave / Ally Step / Cover on PAIR.  
AI_REQUIREMENTS: Gaiter healer; skip if either leftover MP ≥ 1. Stepper protector; skip if ally leftover MP ≥ 1 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Dry Gait or a legal Parched Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Gaiter needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Dry Gait: 8 HP iff **both** leftover walk MP = 0. One wet body is 0 HP. Parched Step is not ungated Home Step. Band 0 → show `FSN-DUAL-READY` instead. Honesty reroll → ENC-READY-01.  
OBJECTIVE: Defeat both. Intended: keep 1 leftover MP on one body; occupy every Chebyshev-1 of the Gaiter.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-MP discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Dual-dry-MP healer + leftover-MP=0 joiner. Distinct from ENC-HEAVE-01 (both **force-moved**) and ENC-BOTH-01 (both **walked**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Gaiter north vs east. Variant `FSN-DRY-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-PARCHED-QUIET` (add cover). Peak: inherit one even-seam gallery. Never `titans_vigor`. Never pack Heave Mend on this PAIR.  
STATUS: PROPOSED

---

### ENC-LEAN-01

ENCOUNTER_ID: ENC-LEAN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LEAN-SIP` — 1× `lean_stinger` knight (`spell-lean-sting` + `physical_attack`) + 1× `parched_sipper` pawn (`spell-parched-sip` + `starter-frost`). No Dry / Ready / Damp / Pair / Lone Purse on PAIR. No Dry Hold on PAIR.  
AI_REQUIREMENTS: Stinger lurks at 3 and commits when leftover AP = 0 **and** leftover MP ≥ 1 **or** HP% ≤ 40. Sipper Sips on that window; else Frosts. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lean Sting or Parched Sip can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Lean Sting: 10, +8 iff **target** leftover AP = 0 **and** leftover MP ≥ 1. Dual Keep does **not** empty leftover this turn. Honesty reroll → ENC-DRY-01. Band 0 → show `FSN-DRY-TAX`.  
OBJECTIVE: Defeat both. Intended: keep 1 leftover AP **or** spend leftover walk to 0.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-window discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Dry-purse / wet-walk poke. Distinct from ENC-DRY-01 (AP=0, no MP gate) and ENC-READY-01 (AP ≥ 1 **and** MP ≥ 1).  
SOLVABILITY_REQUIREMENTS: Flank path reachable; Sipper not trapped.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-LEAN-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: promote to `FSN-LEAN-COURT` (add Dry Hold). Never two Keep cards on PAIR.  
STATUS: PROPOSED

---

### ENC-ODD-02

ENCOUNTER_ID: ENC-ODD-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-ODD-MUST` — 1× `odd_hooder` pawn or knight (`spell-odd-hood` + `physical_attack`) + 1× `must_leaner` knight (`spell-must-lean` + `physical_attack`). No Near / Mid / Far Hood / Own / Off Plate on PAIR. No Cast Hold / Tool Hold / Must Drift on PAIR.  
AI_REQUIREMENTS: Hood skips if the only threat sits at even Chebyshev. Leaner skips if leftover MP already 0; gate on `isPhysical`, never `spell.name`. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Odd Hood or Must Lean can drop that id if missing.  
MAP_REQUIREMENTS: `openField`, `arena`, or `chessboard` with room to stand at 1, 2, **and** 3. Reject a 1-tile tunnel. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Odd Hood consumes **before** `dealDamage`. DoT does not consume. Must Lean: remaining **non-Strike** spells illegal unless leftover walk MP = 0. Strike stays legal. Honesty reroll → ENC-NEAR-01 or ENC-MID-01. Band 0 → show `FSN-NEAR-MUST`. Distinct from queued day-10 `ENC-ODD-01` (odd-round picket present / even-round absent — do not reuse that id).  
OBJECTIVE: Defeat both. Intended: step to Chebyshev 2, then Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + parity discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Parity miss + leftover-MP tool lock. Distinct from ENC-NEAR-01 (≤1) and ENC-MID-01 (exactly 2).  
SOLVABILITY_REQUIREMENTS: Tiles at 1, 2, and 3 from Hood start. Two walk-offs.  
REPLAYABILITY: Hood chassis pawn vs knight (`FSN-ODD-MUST/PAWN`).  
SCALING_BEHAVIOUR: High: promote to `FSN-ODD-MUST/GUN` (add glass sniper at minRange 3). Peak: inherit one even-seam. Never pack Far Hood.  
STATUS: PROPOSED

---

### ENC-DWELL-01

ENCOUNTER_ID: ENC-DWELL-01  
TYPE: hazard / displacement / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-VOID-DWELL` — 1× `void_reeler` queen (`starter-frost` + `spell-void-reel`) + 1× `dwell_marker` pawn or bishop (`spell-dwell-mark` + `physical_attack`). No Cinder / Paint / Foe / Ally / File Reel on PAIR. No Void Mirror on PAIR (that is `/MIRROR`).  
AI_REQUIREMENTS: Reeler pulls 1 toward nearest void or portal cell. Marker paints a cell that detonates if a unit **ends a turn** on it. Neither camps the only exit. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Void Reel or Dwell Mark can drop that id if missing.  
MAP_REQUIREMENTS: Arena with **one** scripted void-rift tile on a **gallery** (not the only path, not spawn/portal). Reeler needs LoS to the gallery. Two walk-offs after every legal pull dest.  
SPECIAL_RULES: Family lottery **off**. Void Reel: sixth `applyAttract` dest. Dest is **toward**, not onto, a world portal. Empty board (no void/portal cell) fizzles — weight 0 if no living void tile at spawn. Dwell Mark: walk-on and walk-off the same turn is free. Honesty reroll → ENC-CINDER-01.  
OBJECTIVE: Clear all. Intended: snipe the Marker; refuse the rim.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + displacement discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pull toward the rim, then end-turn occupy. Distinct from ENC-CINDER-01 (hazard dest + **enter** detonate) and ENC-PAINT-01 (paint dest).  
SOLVABILITY_REQUIREMENTS: Gallery void is not a cut-vertex. Pull dests are free, non-hazard, non-portal, with a walk-off.  
REPLAYABILITY: Gallery west vs east. High: `FSN-VOID-DWELL/MIRROR` (live `void_mirror` junior, **no** Swap).  
SCALING_BEHAVIOUR: Unlock real Void Reel only after apply exists. Never PAIR Void Reel with Cinder Reel.  
STATUS: PROPOSED

---

### ENC-GATE-02

ENCOUNTER_ID: ENC-GATE-02  
TYPE: protection / reinforcements / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DRY-GATE` — 1× `lean_prelate` rook (`spell-lean-post`) + 1× `parched_siller` rook (`spell-parched-sill`). Remaining cap ≥ 1. Dummy / Drift / Dwell / Ingress / Bait stay off CELL.  
AI_REQUIREMENTS: Prelate camps the post. Siller paints an adjacent tile that **forbids walk MP** (spells legal). Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lean Post or Parched Sill can drop that id if missing.  
MAP_REQUIREMENTS: Fortress courtyard + one side aisle. Post cell is floor. Sill tile is floor, not spawn/portal.  
SPECIAL_RULES: Family lottery **off**. Lean Post: end-turn occupy **and leftover AP = 0** detonates. Walk-on is safe. Relocate landing is safe. Camping 1 leftover AP on the post is safe. Parched Sill forbids **walk MP**, not Strike. Honesty reroll → ENC-DRIFT-01.  
OBJECTIVE: Defeat both. Intended: peel with 1 leftover AP; walk around the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Leftover-AP=0 post + tile walk-lock. Distinct from ENC-DRIFT-01 (relocate-landing detonate / walk-on **safe**, tile rejects **relocate dest**).  
SOLVABILITY_REQUIREMENTS: Side aisle reaches the post. Remaining cap ≥ 1. Do not spawn `FSN-LEAN-HOLD/SIX`.  
REPLAYABILITY: Post west gallery vs east. High: `FSN-DRY-GATE/STING` (add Lean Stinger as a **third** — never PAIR post+sting).  
SCALING_BEHAVIOUR: Do not spawn a second post while cap is 2. Never `FSN-LEAN-HOLD/SIX`.  
STATUS: PROPOSED

---

### ENC-DIAG-02

ENCOUNTER_ID: ENC-DIAG-02  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DIAG-OATH` — 1× `diag_warder` bishop (`spell-diag-stride`) + 1× `mid_oather` bishop (`spell-mid-oath` + `starter-frost`). No Diag Lock / Inch / Must Step / Must Span / Axis on PAIR. No Long / Near / Unit / Ground Oath / Mid Hood on PAIR.  
AI_REQUIREMENTS: Warder paints the next-walk diagonal-only tell. Oather wants the next spell at Chebyshev exactly 2. Frost at 1 or 3 fizzles. Strike stays legal at any range. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Diag Stride or Mid Oath can drop that id if missing.  
MAP_REQUIREMENTS: Chessboard or openField with **diagonal aisles** that reach both bishops without being the only exit. Orthogonal dests must exist so a failed confirm spends nothing.  
SPECIAL_RULES: Family lottery **off**. Next walk diagonal-only: orthogonal dests fail confirm; MP is not spent. Mid Oath: Frost at 1 or 3 fizzles. Honesty reroll → ENC-INCH-01.  
OBJECTIVE: Defeat both. Intended: one diagonal step, then Strike at any range **or** Frost at exactly 2.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + walk-shape discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Next walk diagonal-only + next spell exact 2. Distinct from ENC-INCH-01 (one next ≤ 1, **ortho legal**, next spell ≥ 3).  
SOLVABILITY_REQUIREMENTS: A diagonal path **and** an orthogonal path both exist. Bishops reachable by Strike from even Chebyshev.  
REPLAYABILITY: Warder west vs east. High: `FSN-DIAG-OATH/FAR` (add far stinger / glass sniper — never PAIR Mid Oath with Long Oath).  
SCALING_BEHAVIOUR: Add the gun before any HP bump. Never pack Odd Hood with Far Hood on this id.  
STATUS: PROPOSED

---

### ENC-CINDER-02

ENCOUNTER_ID: ENC-CINDER-02  
TYPE: hazard / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CINDER-FULL` — 1× `cinder_skipper` knight (`spell-cinder-skip` + `physical_attack`) + 1× `full_plater` rook (`spell-full-plate` + `spell-iron-skin`). No Spike / Lava / Pit / Ghost Skip on PAIR. No Tapped / Still / Empty / Ward Plate on PAIR.  
AI_REQUIREMENTS: Skipper takes a 1-tile cinder bridge the player does not have to take. It does not camp the only clean aisle. Plater walks into a **wide** lane and Plates when leftover AP ≥ 3. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cinder Skip or Full Plate can drop that id if missing.  
MAP_REQUIREMENTS: One scripted `WF-HAZ-HURT_CINDER` **or** a painted cinder floor cell on a **flank** bridge. A clean aisle exists. Weight 0 on maps with no cinder.  
SPECIAL_RULES: Family lottery **off**. Cinder Skip: next **1-tile** walk treats **cinder** as floor. A 2-step onto cinder still ticks. Lava / spikes / pits still tick. Teleport / Swap do not consume Skip. Full Plate: leftover **AP ≥ 3** → +RES. Honesty reroll → ENC-SPIKE-01.  
OBJECTIVE: Defeat both. Intended: take the clean aisle; spend down to 2 leftover AP so Full Plate fails.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Kiter skip + leftover-AP-high tank. Cousin of ENC-SPIKE-01 (spike skip + leftover-**AP=0** +RES) on **cinder** and the **full** purse.  
SOLVABILITY_REQUIREMENTS: Clean aisle reaches both. Cinder never walls a corridor.  
REPLAYABILITY: Bridge west vs east. High: `FSN-CINDER-FULL/EMBER` (add ember knight — still one clean aisle, at most one Inferno cadence).  
SCALING_BEHAVIOUR: Never PAIR Cinder Skip with Ember as a two-body. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-OWN-01

ENCOUNTER_ID: ENC-OWN-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-OWN-WATCH` — 1× `own_plater` rook (`spell-own-plate` + `physical_attack`) + 1× `watch_lender` pawn (`spell-watch-lend` + `physical_attack`). No Off Plate / Mid Hood / Sidestep / Morrow / Tick on PAIR. No Watch Fee / Watch Mute / Glass Sniper on PAIR.  
AI_REQUIREMENTS: Plater walks into a wide lane and Plates before the player’s turn. Lender camps Hold Ground / Far Watch facing. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Own Plate or Watch Lend can drop that id if missing.  
MAP_REQUIREMENTS: Fortress lane + side aisle. Overwatch file painted. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Own Plate: next **own-turn** hit 0 then consume. Hits on the player’s turn are full and do **not** consume. Watch Lend: overwatch snap still deals **and** grants the watcher +1 AP. Honesty reroll → ENC-OFF-01.  
OBJECTIVE: Defeat both. Intended: hit them on **their** off-turn (player turn); do not walk the watched file.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Own-turn miss + snap grants watcher AP. Inverse of ENC-OFF-01 (off-turn miss + snap **costs the walker** 1 AP).  
SOLVABILITY_REQUIREMENTS: Side aisle exists. Watched file is not the only path.  
REPLAYABILITY: Gallery N-S vs E-W. High: `FSN-OWN-WATCH/GUN` (one turret, remaining cap ≥ 1, `summonAI === "turret"`). Never PAIR Brick Crack with Castellan.  
SCALING_BEHAVIOUR: Add the turret before HP. Cap stays 2.  
STATUS: PROPOSED

---

### ENC-WAVE-16

ENCOUNTER_ID: ENC-WAVE-16  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave A `FSN-DRY-STEP` (gaiter + stepper). Wave B, after A is dead: `FSN-LEAN-SIP` (stinger + sipper). Living hostiles stay ≤ 4. Portal stays locked until B is dead (`holdPortalLocked`).  
AI_REQUIREMENTS: As the named PAIR sheets. Wave B does not spawn until A is empty. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave A may reveal Dry Gait. Wave B may reveal Lean Sting.  
MAP_REQUIREMENTS: Two courts connected by a 2-tile aisle. `waveSpawnCells` in the far court. Optional even-seam inherited from ENC-TEACH-15 on a **gallery**.  
SPECIAL_RULES: Two scripted waves, not a spawn trickle. B spawn counts toward `MAX_ENEMIES`. Random 30% family lottery is **off**. Honesty: missing leftover-MP writer **or** leftover-pair writer → freeze at Wave A (ENC-DRY-02) without claiming Lean.  
OBJECTIVE: Survive and clear both waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce dual-dry-MP heal, then ask dry-purse / wet-walk on the same aisle.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Cap 4 living.  
REPLAYABILITY: Wave B can swap to `FSN-ODD-MUST` if the account already answered Lean this run.  
SCALING_BEHAVIOUR: High: Wave B is `FSN-LEAN-COURT`. Peak: inherit even-seam on the A court. Never a third wave.  
STATUS: PROPOSED

---

### ENC-AMBUSH-15

ENCOUNTER_ID: ENC-AMBUSH-15  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible 2× pawns. One `WF-ELT-MID_PICKET` elite (same-tier × hard) occupies a painted post **only** while the player is Chebyshev 4 or 5 from that cell. Step to ≤3 or ≥6 and the post is empty floor in exploration (they leave, no purse). Dungeon: they stand from map start — required for map-clear. Band between Near Picket (≤3) and Far Picket (≥6). Distinct from High Picket (≥80% HP) and Low Picket (below 70%).  
AI_REQUIREMENTS: Visible pawns greedy. Elite uses the Mid Picket kit (Lean Stinger presentation if the chain taught ENC-LEAN-01). Soph 1–3 after trigger.  
SPELL_DISCOVERY_OPPORTUNITIES: Elite death after it used Lean Sting can drop that id if missing.  
MAP_REQUIREMENTS: Arena + painted mid post. 4–5 ring overlay. Exit reachable without touching the post.  
SPECIAL_RULES: Ambush units do not exist in the combatant store until the player enters the 4–5 band **or** this is a dungeon-chain (then they stand from frame 1). Soft: overkill on a pawn still leaves the elite if this is a run. Intent log: explicit `ambush: mid_picket`.  
OBJECTIVE: In a run: defeat pawns + elite. In exploration: pass by closing in, backing off, or fighting.  
FAILURE_CONDITION: Player death after committing to the fight.  
REWARD: Hard-band Doka on a fight win. Pass-without-fight: 0 extra.  
TACTICAL_PURPOSE: Punish lingering in the mid band. Distinct from ENC-AMBUSH-14 (elite at ≥6).  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without the elite. Elite not on the portal.  
REPLAYABILITY: Post N vs E. Elite chassis knight vs rook.  
SCALING_BEHAVIOUR: High: elite is `FSN-ODD-MUST` hooder. Never two mid pickets.  
STATUS: PROPOSED

---

### ENC-REINF-15

ENCOUNTER_ID: ENC-REINF-15  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: 1× bishop frost + 1× pawn. After the **second** unit steps `WF-TRP-ECHO_PLATE` (the echo tax), spawn 1× `watch_lender` on a gallery. Cap 1 extra, hard-cap 4 living.  
AI_REQUIREMENTS: Opener greedy / kite. Lender camps the watched file after spawn.  
SPELL_DISCOVERY_OPPORTUNITIES: Lender may reveal `spell-watch-lend` if used.  
MAP_REQUIREMENTS: Court + gallery. One `WF-TRP-ECHO_PLATE` on the approach (first stepper arms with **no** tax; the next stepper takes 8% max HP once; then floor). Never hidden. Never on spawn/portals. Distinct from Glyph Plate (first stepper taxes) and Spent Plate (first action, 0 AP spent).  
SPECIAL_RULES: Reinforcement trigger is `onEchoPlateSecondStep` (explicit). If living + pending would exceed 4, skip. Portal locked until the board is empty.  
OBJECTIVE: Clear all. Intended: arm the plate yourself and walk around, or send a summon to spend the echo.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus if no reinforcement ever spawned (player never paid the echo).  
TACTICAL_PURPOSE: Visible two-step trap as a horn. Distinct from ENC-REINF-14 (first-AP Spent Plate).  
SOLVABILITY_REQUIREMENTS: Plate walkable before, while armed, and after. `reinfCells` reachable, not on the portal.  
REPLAYABILITY: Plate west vs east.  
SCALING_BEHAVIOUR: High: Lender is `FSN-OWN-WATCH` with Own Plate. Never a second reinforcement.  
STATUS: PROPOSED

---

### ENC-SLIDE-02

ENCOUNTER_ID: ENC-SLIDE-02  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-SLIDE_SCREEN` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the short path and does not walk through the lattice to camp the only exit. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Sliding the screen to free a frost line (took the short path after 1 AP) can offer `spell-haste`. Walking through without sliding can offer `starter-shield` (patience). One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor has `WF-TER-SLIDE_SCREEN` (units may **walk through**; LoS is blocked; adjacent 1 AP slides it one cardinal into empty floor; adjacent 2 AP smashes it to floor). Long route already exists. Far `objectiveCell` banner. Distinct from Fold Wall (blocks **walk**) and Frost Pane (smash only).  
SPECIAL_RULES: Slide dest must be empty floor, not spawn±3, not a portal. Smash is optional. `holdPortalLocked` until banner tag **and** hostiles are dead.  
OBJECTIVE: Touch the banner and clear hostiles.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus Doka if the player never smashed (committed to walk-through or a 1-AP slide).  
TACTICAL_PURPOSE: Teach “walk through cover, slide it, or smash it.” Distinct from ENC-FOLD-01 (wall until smash) and ENC-SLIDE-01 (enter-push; standing free).  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to banner **with the lattice treated as a LoS wall that still walks**. Lattice is not a cut-vertex. Banner not on a portal.  
REPLAYABILITY: Screen north vs east.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: inherit one even-seam tile on the long path.  
STATUS: PROPOSED

---

### ENC-RETREAT-01

ENCOUNTER_ID: ENC-RETREAT-01  
TYPE: movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) on the short path behind a `WF-OBS-RETREAT_SILL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the far third and does not walk through the sill while it is a wall. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Opening the sill (ended a turn at Chebyshev ≥ 5) can offer `spell-haste`. Taking the long path can offer `starter-shield`. One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor cell starts as a wall (`WF-OBS-RETREAT_SILL`). It becomes floor after the **player** ends a turn at Chebyshev 5 or farther from that cell. A second spawn→portal route already exists. Distinct from Latch Sill (end-turn **adjacent**), Far Picket (elite at ≥6), Spell Sill (cast), and Kill Sill (any death).  
SPECIAL_RULES: Place only when a second spawn→portal route exists. Evaluate solvability as if the sill were already a wall. Never the only exit.  
OBJECTIVE: Touch the far banner (or clear hostiles). Opening the sill is the intended line, not a second fail.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus if the player opened the sill and never walked the long path.  
TACTICAL_PURPOSE: Teach “back off to open the short path.” Inverse of Latch Sill’s camp-adjacent.  
SOLVABILITY_REQUIREMENTS: Long path works with the sill treated as a wall. Sill not on spawn or a portal.  
REPLAYABILITY: Sill north vs east.  
SCALING_BEHAVIOUR: High: bishop also has Odd Hood so standing at 5 to open still has a parity tell. Never two retreat sills.  
STATUS: PROPOSED

---

### ENC-FULL-01

ENCOUNTER_ID: ENC-FULL-01  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× kiting bishops (`starter-frost`). 0 melee on entry.  
AI_REQUIREMENTS: Bishops hold the far third. They do not camp the pads.  
SPELL_DISCOVERY_OPPORTUNITIES: Using `WF-TEL-FULL_STEP` at least once (HP ≥ 80%) and winning can offer `spell-swap` if missing.  
MAP_REQUIREMENTS: Two linked gold-cyan pads (`WF-TEL-FULL_STEP`). Entering one for 1 MP exits the other only if the traveler’s current HP is at least 80% of max. Otherwise the MP is not spent and you stay. If the exit is occupied, the travelers swap. Always-open long path. Far banner `objectiveCell`. Inverse of Wound Step (below 50%). Distinct from Clear Step (empty dest, no HP gate) and Full Cache (≥90% to open).  
SPECIAL_RULES: Player must occupy the banner at least once (`touchedObjective`). Pad dest must be free-or-swappable, non-hazard, non-portal, with two walk-offs. Illegal dest = no swap, spend nothing.  
OBJECTIVE: Tag the banner and clear the bishops.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a healthy-only skip with a kite so taking a hit **closes** the pad. Inverse of ENC-WOUND-01.  
SOLVABILITY_REQUIREMENTS: Long path works with both pads permanently shut. A and B reachable floor, not spawn/portals.  
REPLAYABILITY: Pads H vs V.  
SCALING_BEHAVIOUR: Add a third bishop or poison, not a second pad pair. Peak: B sits adjacent to a Hurt Cinder (choice of pain if you arrive healthy).  
STATUS: PROPOSED

---

### ENC-IMPRINT-01

ENCOUNTER_ID: ENC-IMPRINT-01  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-IMPRINT-CHOIR` — 1× `cadence_imprinter` bishop (`spell-cadence-imprint`) + 1× `verse_leaner` bishop (`spell-verse-lean`) + 1× `ignite_alchemist` queen (Poison + Ignite). Never PAIR Imprint with Theft / Rest / Halve / Flush / Pin / Stall / Stretch / Trim. No Inferno on the Imprinter.  
AI_REQUIREMENTS: Imprinter copies matching remaining CDs onto itself (target keeps them). Verse Lean makes the last id illegal until leftover MP = 0. Ignite only if matching stacks ≥ 2. Soph 3–4. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cadence-imprint` / `spell-verse-lean`. Sibling `spell-cadence-lag` waits for Wave 14 families (unconsumed).  
MAP_REQUIREMENTS: Chapel nave + two stalls. Side aisle required. No lava.  
SPECIAL_RULES: Family lottery **off**. Unlock after ENC-HALVE-01 **or** ENC-TRIM-01 so the player has seen a CD rewrite. Honesty reroll → ENC-HALVE-01. Fallback `FSN-IMPRINT-CHOIR/NO-IGNITE` if stack consume is not ready.  
OBJECTIVE: Clear all. Intended order: Imprinter, then Verse, then Ignite.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “silence the copy” Doka if Imprinter dies first.  
TACTICAL_PURPOSE: Copy matching CDs, then pin the last id until leftover MP = 0. Distinct from ENC-HALVE-01 (÷2 + walk-peel).  
SOLVABILITY_REQUIREMENTS: Stalls connected; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Ignite on vs `/NO-IGNITE`.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-LEAN-HOLD` only if ENC-ODD-02 was answered this account. Still one Imprinter.  
STATUS: PROPOSED

---

### ENC-PARCH-01

ENCOUNTER_ID: ENC-PARCH-01  
TYPE: protection / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PARCHED-QUIET` — 1× `parched_stepper` + 1× `dry_gaiter` + 1× `cover_squire` (cover occupancy). Never PAIR Parched Step with Home / Heave / Ally / Hook as a two-body lesson.  
AI_REQUIREMENTS: Stepper joins a leftover-MP=0 ally. Gaiter Dry-Gaits only if both leftover MP = 0. Cover camps a wide choke if a side aisle exists. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-parched-step` / `spell-dry-gait`.  
MAP_REQUIREMENTS: Nave + one stall + side aisle. No lava.  
SPECIAL_RULES: Family lottery **off**. Unlock after ENC-DRY-02. Honesty: missing leftover-MP dest → ENC-JOIN-01 leftover without claiming Cover.  
OBJECTIVE: Clear all. Intended: occupy Cover’s Chebyshev-1 so the join has no dest; keep 1 leftover MP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit` is a joke on a three-body — prefer `under_15_turns`.  
TACTICAL_PURPOSE: Dry-step PAIR plus cover so occupancy is the answer. Prepares ENC-ELITE-28.  
SOLVABILITY_REQUIREMENTS: Stall connected; Cover cannot seal the nave.  
REPLAYABILITY: Cover live `iron_golem` vs leash_warden presentation.  
SCALING_BEHAVIOUR: Do not add a fourth body. Peak: inherit one even-seam gallery.  
STATUS: PROPOSED

---

### ENC-STILL-01

ENCOUNTER_ID: ENC-STILL-01  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STILL-REST` — 1× `still_mender` queen (`spell-still-mend` + `starter-shield`) + 1× `cadence_rester` bishop (`spell-cadence-rest`) + optional once-cantor. Camped (walk-spent = 0) heal + own remaining skip tick. Never PAIR Still Mend with Dry Gait / Dry Mend / Heave / Both / Bar / Pale.  
AI_REQUIREMENTS: Mender heals iff **caster** spent 0 walk MP this turn. Rester skips own remaining CD ticks. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-still-mend` / `spell-cadence-rest`.  
MAP_REQUIREMENTS: Small nave. No lava. Optional `mending_mist` **off** (would hide Still Mend).  
SPECIAL_RULES: Family lottery **off**. Honesty: missing walk-spent=0 flag → ENC-DRY-02 leftover without claiming Still.  
OBJECTIVE: Defeat the mender (rester optional). Intended: make the mender walk, then the 8 fails.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-adjacent XP on the mender + depth Doka.  
TACTICAL_PURPOSE: Camped heal vs dual-dry-MP heal. Distinct from ENC-DRY-02 (both leftover **MP** = 0, caster may have walked).  
SOLVABILITY_REQUIREMENTS: Nave connected. Hostiles start ≥ Chebyshev 4.  
REPLAYABILITY: Once-cantor on vs off.  
SCALING_BEHAVIOUR: Add the once-cantor before HP. Never pack Gaunt Mend (Wave 14 family, unconsumed).  
STATUS: PROPOSED

---

### ENC-SURV-29

ENCOUNTER_ID: ENC-SURV-29  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Start: 2× pawn + 1× bishop. Every 3 enemy-team turns, spawn 1 from {pawn, knight lurker, lean stinger} until the clock ends. Max 4 living.  
AI_REQUIREMENTS: Casters hold LoS. Lurkers prefer to stand **outside** Chebyshev 3 of the player so Hunt Draft taxes. Group tactics if soph ≥ 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Survive 8 turns without `spell-timestep` → rest shrine may offer timestep (reminder, not a free grant).  
MAP_REQUIREMENTS: Arena. `WF-ENV-HUNT_DRAFT` armed (end of each combatant turn, if no living **enemy-side** unit is within Chebyshev 3 they pay 3% max HP). Painted hunt rings of radius 3 around every living hostile. Allied summons do **not** count as shelter. Skip this id on maps that would start with zero enemy-side units. Optional `swift_winds` so kiting is possible.  
SPECIAL_RULES: Clock `surviveTurns: 10` player-turns. When it hits 0, remnants flee to the edge and despawn (not player kills). Portal unlocks only after the board is empty. Distinct from Isolation Chill (any living unit within 3), Open Draft (empty orthogonal neighbors), and Exit Draft (near a portal).  
OBJECTIVE: Be alive after 10 player turns, then clear or let remnants flee.  
FAILURE_CONDITION: Player death before clock + cleanup.  
REWARD: Survival table (depth × 50 Doka + 100 XP) plus kill XP only for units actually defeated. Prefer overlay `no_healing` over `no_damage_taken`.  
TACTICAL_PURPOSE: Pressure beat — a **hunt-ring** tax, not a shrinking void (ENC-SURV-03) and not an open-center tax (ENC-SURV-27).  
SOLVABILITY_REQUIREMENTS: A cell inside some hunt ring always exists while hostiles live; flee-edge tiles exist; hazard count ≤ 50.  
REPLAYABILITY: Opener caster frost vs weaken.  
SCALING_BEHAVIOUR: Mid uses only pawns in the pool. High unlocks the lurker. Peak unlocks the lean stinger. Never shorten the clock below 8.  
STATUS: PROPOSED

---

### ENC-SURV-30

ENCOUNTER_ID: ENC-SURV-30  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: DRY-STEP gaiter only (no stepper — the clock is the joiner). Wave B overlaps at turn 3: LEAN-SIP stinger (no sipper). Wave C at turn 6: one elite golem. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Stinger holds ≥ 3. Golem camps the last dry tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + even-seam ribbon (`inheritHazardsFrom: ENC-TEACH-15`). Hunt Draft **off**. Clock is the odd/even pip, not a shrinking void (that was ENC-SURV-03). Optional one `arcane_surge` **or** `arcane_overflow` (pick one). Never both. Never `titans_vigor`.  
SPECIAL_RULES: Overlap + even-seam is the escalation vs ENC-SURV-29. Flee remnants when the clock ends.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-29.  
TACTICAL_PURPOSE: Peak pressure that spends leftover modifiers and even-seam so late-game maps are not “odd seam again” or “hunt draft again.”  
SOLVABILITY_REQUIREMENTS: Dry detour exists; 4-unit occupancy leaves a walkable ring; seam never seals spawn or exit.  
REPLAYABILITY: surge vs overflow. Wave C golem vs void-mirror elite for Void-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-PROT-15

ENCOUNTER_ID: ENC-PROT-15  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× charger pawn + 1× bishop focusing the **alone font**.  
AI_REQUIREMENTS: All enemies prefer occupying `WF-ZON-ALONE_FONT` so they can deny the 8% drink (they do not heal from it unless they also peel to Chebyshev ≥ 4 from every other living unit). Lethal lookahead against a player standing on the basin.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player drank (ended a turn alone in the ring) and used `starter-shield` or `summon-sentinel`, rest may offer `summon-sentinel` if missing.  
MAP_REQUIREMENTS: Quiet teal basin (`WF-ZON-ALONE_FONT`, one walkable cell). First unit to end a turn here this map heals 8% max HP **only if no other living unit is within Chebyshev 3**; then the tile dries. Inverse of Rival Font (needs an enemy within 2). Distinct from Shrine Pool (unconditional) and Isolation Chill (tax if alone). Player spawns adjacent. Enemies from the far end + one side alley. No hazard on the basin.  
SPECIAL_RULES: The basin is a tile, not an allied token. Portal unlocks when hostiles are dead. The player does **not** fail if they never drink — peeling to drink is the intended line. Player HP persist via `saveBattleStats` on the progress lock.  
OBJECTIVE: Clear hostiles. Intended: peel to ≥ 4 and drink, or deny the bishop the tile.  
FAILURE_CONDITION: Player death only.  
REWARD: Protection-adjacent grant (band table) + kill XP. Overlay `direct_hit` (stay on the basin — harder, because neighbors cancel the drink).  
TACTICAL_PURPOSE: Contest a **solitude heal**, not a contested RES ring (ENC-PROT-03) and not a rival-adjacent heal (ENC-PROT-14).  
SOLVABILITY_REQUIREMENTS: Alley does not spawn on the basin. Basin not on spawn±3 or portal. Ring of Chebyshev 4 exists as walkable floor.  
REPLAYABILITY: Alley left/right. Bishop frost vs weaken.  
SCALING_BEHAVIOUR: Add a second alley flanker before raising ATK. Peak: pawn is Lean Stinger so leftover-window poke punishes camping the ring. Never two fonts.  
STATUS: PROPOSED

---

### ENC-PRIO-17

ENCOUNTER_ID: ENC-PRIO-17  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `WF-SPL-CLOSE_TUTOR` bishop (same-tier, medium threat, 1 extra `usableByEnemy` spell — prefer `spell-odd-hood` if the chain taught ENC-SPELL-30, else `starter-frost`) + 1× rook screen. Inverse of Range Tutor (end turn 4+ away). Distinct from Mark Tutor (adjacent 1 AP then LoS) and Grimoire Stalker (one-cast on death).  
AI_REQUIREMENTS: Tutor kites to stay at 2–3 so a close teach is a **commit**. Screen guards the tutor (`AI_BACKLINE_PROTECT`).  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn at Chebyshev ≤ 1 from the tutor while they still live, gain that spell id as a **single remaining cast** this map (does not call `upgradeSpell`, does not persist `spellLevel*` arrays). Killing them before that close teach grants the purse but not the one-cast. Winning after the teach can later grant the id into the owned set via the observation pipeline.  
MAP_REQUIREMENTS: Two-depth backline + screen line. Tutor needs a retreat tile.  
SPECIAL_RULES: Prefer replacing one existing spawn. In a run they count as hostiles for map-clear. One-cast metadata only.  
OBJECTIVE: Clear. Intended: plant adjacent for the teach, then finish.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + close-teach one-cast. Overlay `under_15_turns` rewards deleting the source after the plant.  
TACTICAL_PURPOSE: Inverse of ENC-PRIO-16 (plant far). Makes “walk up and stand” the discovery verb.  
SOLVABILITY_REQUIREMENTS: Backline reachable; tutor not trapped; screen does not seal the stall.  
REPLAYABILITY: Extra spell Odd Hood vs Dry Gait vs Lean Sting by which PAIR the account is missing.  
SCALING_BEHAVIOUR: High: screen is elite (`variant: elite`) still without Inferno. Never two tutors.  
STATUS: PROPOSED

---

### ENC-GAP-01

ENCOUNTER_ID: ENC-GAP-01  
TYPE: elite / optional challenge  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-GAP_FILE` as a **scripted dungeon room** — 2× same-band elites: one `FSN-DRY-STEP` gaiter elite + one `FSN-LEAN-SIP` stinger elite. While they are Chebyshev 4 or farther apart they use **hard** threat; while closer they use **medium** threat. Victory always pays hard reward multiplier. They do **not** world-attrition inside a run. Distinct from Paired File (−20% incoming while both live) and Duelist Circle (world-map bleed).  
AI_REQUIREMENTS: Gaiter backline; stinger flanker. They try to **keep** the 4-tile gap. They do **not** heal each other.  
SPELL_DISCOVERY_OPPORTUNITIES: Winner-of-two can drop Dry Gait or Lean Sting, whichever the survivor used.  
MAP_REQUIREMENTS: Painted spacing thread, 8–10 floor tiles. Both count as hostiles for map-clear. Ring not on spawn/portal.  
SPECIAL_RULES: In a run, contact is immediate combat at full HP. Cap 2 living elites + 0 trash. Portal locked until both are dead. Shove them together to drop threat.  
OBJECTIVE: Defeat both elites.  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band depth Doka + elite XP on both. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two taught elites at once — dual-dry-MP heal vs dry-purse poke — and a readable spacing tax. Pressure beat that is not a clock.  
SOLVABILITY_REQUIREMENTS: Floor; 2 elites start ≥ Chebyshev 4 from the player and from each other; walk-offs exist.  
REPLAYABILITY: Gaiter/stinger vs hooder/censor pair for Odd-branch accounts.  
SCALING_BEHAVIOUR: Do not add a third elite. Peak: clumped threat still medium, not a sponge.  
STATUS: PROPOSED

---

### ENC-PAIR-03

ENCOUNTER_ID: ENC-PAIR-03  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PAIR-DRY` — 1× `pair_purser` knight (`spell-pair-purse` + `physical_attack`) + 1× `dry_mender` queen (`spell-dry-mend` + `starter-shield`) + 1× arbiter rook. Leftover AP **exactly 2** poke + leftover-AP=0 heal. Never PAIR Pair Purse with Lean / Ready / Damp / Lone / Full. Never PAIR Dry Mend with Dry Gait / Still / Heave / Both.  
AI_REQUIREMENTS: Purser commits when leftover AP is exactly 2. Mender Dry-Mends only if leftover AP = 0. Arbiter camps a wide choke. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-pair-purse` / `spell-dry-mend`.  
MAP_REQUIREMENTS: Chapel nave + two stalls. Side aisle required.  
SPECIAL_RULES: Family lottery **off**. Unlock after ENC-LEAN-01 **or** ENC-DRY-02. Honesty reroll → ENC-LEAN-01.  
OBJECTIVE: Clear all. Intended: spend to 1 leftover AP (Purse misses) **or** keep 1 (Mend misses).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “break the pair” Doka if Purser dies first.  
TACTICAL_PURPOSE: Exact-2 poke plus AP=0 heal so leftover AP has **three** illegal numbers (0, 2, and “whatever they wanted”). Distinct from ENC-LEAN-01 (AP=0 **and** MP≥1).  
SOLVABILITY_REQUIREMENTS: Stalls connected; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Arbiter live `iron_golem` vs leash_warden.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-LEAN-COURT` only if ENC-LEAN-01 was answered. Still one Purser.  
STATUS: PROPOSED

---

### ENC-HOLD-04

ENCOUNTER_ID: ENC-HOLD-04  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LEAN-HOLD` lite — 1× `lean_holder` knight (`spell-lean-hold`) + 1× `must_leaner` knight (`spell-must-lean`) + 1× warden rook (`spell-iron-skin` / live `iron_golem` overlay). Strike-until leftover-MP=0 + tools-until leftover-MP=0 + warden. Never PAIR Lean Hold with Hold Knight / Rite / Tool Hold / Boot Hold.  
AI_REQUIREMENTS: Holder refuses Strike until leftover walk MP = 0. Leaner refuses non-Strike until leftover MP = 0. Warden interposes. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-lean-hold` / `spell-must-lean`.  
MAP_REQUIREMENTS: Fortress lane + side aisle. Reject a single-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Unlock after ENC-ODD-02. Honesty reroll → ENC-RITE-01. Variant drop optional warden if interpose is missing. Do **not** spawn `/SIX`.  
OBJECTIVE: Defeat all. Intended: dump leftover MP, then Strike **or** tool; or kill the Holder first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Dual leftover-MP lock (Strike **and** tools). Distinct from ENC-RITE-01 (Strike until a **spell**, then Long Oath ≥ 3) and ENC-HOLD-03 (spells until walk, Strike until a spell).  
SOLVABILITY_REQUIREMENTS: Side aisle reaches the Holder. Three walk-offs. Remaining cap does not include Six Plug.  
REPLAYABILITY: Warden golem vs leash.  
SCALING_BEHAVIOUR: Peak: convert to ENC-RARE-15 (full COURT). Still no Six Plug.  
STATUS: PROPOSED

---

### ENC-ELITE-28

ENCOUNTER_ID: ENC-ELITE-28  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-LEAN-COURT` — elite `ROLE-LEAN-STING` (`variant: elite`) + junior `parched_sipper` + junior `dry_holder` (cannot walk until leftover **AP = 0**). Elite is not a boss: no phase table, no `BossAbility`.  
AI_REQUIREMENTS: As ENC-LEAN-01 plus Hold: cannot walk until leftover AP = 0. Soph 4–6. No group-tactics required.  
SPELL_DISCOVERY_OPPORTUNITIES: Buffer-adjacent: observing Lean Sting after it used the +8 window can drop that id (once per character).  
MAP_REQUIREMENTS: `openField` or `arena`. Holder needs a tile that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Only one elite. Do not pack Dry / Ready / Pair Purse on this BRIGADE as a second poke. Honesty: missing leftover-pair writer → ENC-LEAN-01 leftover without claiming Court.  
OBJECTIVE: Defeat the elite. Supports optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of “keep 1 leftover AP **or** dump the last MP; the Holder cannot chase until they spend AP.” Consumes a real drop-14 BRIGADE.  
SOLVABILITY_REQUIREMENTS: Engagement pocket ≥ 2 walk-off tiles. Hostiles start ≥ Chebyshev 4 from the player.  
REPLAYABILITY: `/LEND` (add Lean Lender) vs base.  
SCALING_BEHAVIOUR: Add Lend uptime before any HP bump. Peak: still no Sacrifice.  
STATUS: PROPOSED

---

### ENC-ELITE-29

ENCOUNTER_ID: ENC-ELITE-29  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-DRY-STEP/E-STEP` — elite `parched_stepper` (`variant: elite`) + junior `dry_gaiter`.  
AI_REQUIREMENTS: As ENC-DRY-02. Elite Stepper never gets Lifesteal Nova. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Gaiter death after it used Dry Gait can complete observation of that id.  
MAP_REQUIREMENTS: Same as ENC-DRY-02. Optional inherited even-seam on a gallery.  
SPECIAL_RULES: Family lottery **off**. Only one elite. Honesty: missing leftover-MP writer → ENC-DRY-02 leftover.  
OBJECTIVE: Defeat both. Intended: keep 1 leftover MP; occupy join dests.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier on the Stepper only + standard Gaiter XP. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Elite leftover-MP joiner behind a dual-dry-MP heal. Distinct from ENC-ELITE-26 (Heave Choir).  
SOLVABILITY_REQUIREMENTS: Join dests legal. Two walk-offs.  
REPLAYABILITY: Stepper chassis queen vs knight.  
SCALING_BEHAVIOUR: Promote Cover only by converting to ENC-PARCH-01, never on this PAIR.  
STATUS: PROPOSED

---

### ENC-CRACK-02

ENCOUNTER_ID: ENC-CRACK-02  
TYPE: hazard / priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SPENT-CRACK` — 1× `spent_taxer` bishop (`spell-spent-tax`) + 1× `brick_cracker` rook (`spell-brick-crack`) + 1× glyph-tax scribe. Walked-last-turn +1 AP tax + remove-adjacent-barrier + glyph tax. Never PAIR Spent Tax with Still / Gait / Ley / Verse Tax. Never PAIR Brick Crack with Sprout / Shift / Wipe / Castellan.  
AI_REQUIREMENTS: Taxer applies if the target **walked last turn**. Cracker removes an adjacent barrier (never the only wall that is a cut-vertex — skip and log). Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-spent-tax` / `spell-brick-crack`.  
MAP_REQUIREMENTS: One scripted `spell-barrier`-lookalike **or** a Slide Screen leftover from ENC-SLIDE-02 (`inheritHazardsFrom: ENC-SLIDE-02`) so Crack has a legal target. Side aisle required so removing cover does not seal the exit.  
SPECIAL_RULES: Family lottery **off**. Solvability skip is mandatory if Crack would isolate spawn or portal. Honesty reroll → ENC-PIN-02.  
OBJECTIVE: Clear all. Intended: stand still a turn to refuse Spent Tax; let Crack eat the screen you already walked through.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Walked-last-turn tax + cover deletion. Distinct from ENC-PIN-02 (Bar Mend + Cadence Pin).  
SOLVABILITY_REQUIREMENTS: After every legal Crack, flood-fill still reaches spawn, hostiles, and exit.  
REPLAYABILITY: Screen vs a player Barrier if they brought it.  
SCALING_BEHAVIOUR: Never add a turret on this CADRE (`FSN-OWN-WATCH/GUN` stays theirs).  
STATUS: PROPOSED

---

### ENC-ESCORT-01

ENCOUNTER_ID: ENC-ESCORT-01  
TYPE: priority-target / anti-summon / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FOE-ESCORT` lite — 1× `foe_biter` knight (`spell-foe-bite`) + 1× `escort_cutter` bishop (`spell-escort-cut` + `spell-weaken`) + optional brood overlay **off** (cap 2). Adj-**hostile-to-target** bite + handler-with-pet-in-2 cut. Never PAIR Foe Bite with Side / Lone / Nook / Field / Wall Bite. Never PAIR Escort Cut with Banner / Pet / Crown / Null.  
AI_REQUIREMENTS: Biter prefers a dest adjacent to another hostile **and** the target. Cutter focuses the highest-threat player-side summon if one exists (`isSummon`) **and** a handler is within 2; else the player. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-foe-bite` / `spell-escort-cut`. Weight this room ×2 if the player has a summon **equipped** (build, not level) — still valid without pets.  
MAP_REQUIREMENTS: `openField` or fortress courtyard. Cutter needs LoS to the backline **and** a retreat tile. No sealed alcove.  
SPECIAL_RULES: Family lottery **off**. No drain on the cutter. No Inferno. If the player brought no pets, this is a softer iron-battery (cluster poke + weaken bishop) — that is fine.  
OBJECTIVE: Clear. Intended: delete the cutter if a pet is down; spread so Foe Bite has no cluster.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + anti-summon discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Crowd bite + handler cut. Distinct from ENC-NULL-01 (censor hunts the pet) and ENC-FANG-01 (reel-to-hostile + cluster poke).  
SOLVABILITY_REQUIREMENTS: Courtyard walk-offs; cutter not trapped.  
REPLAYABILITY: `/BROOD` only after ENC-REINF-03 and still cap 2.  
SCALING_BEHAVIOUR: High: biter is elite still without Inferno. Never a third bite flavor on PAIR.  
STATUS: PROPOSED

---

### ENC-RARE-15

ENCOUNTER_ID: ENC-RARE-15  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-LEAN-HOLD` (Holder + Must Leaner + warden) **or**, if the account has not answered ENC-ODD-02, `FSN-ODD-MUST/GUN` (Hood + Leaner + sniper). Rare elite tag on the Holder / Hood only (`variant: rare_elite`). **Never** `FSN-LEAN-HOLD/SIX` while cap is 2.  
AI_REQUIREMENTS: COURT/BRIGADE contracts. `escapeRoute` on the rare elite. `instantKill` / `betrayal` off. Lethal lookahead on.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-odd-hood`, `spell-lean-hold`, `spell-must-lean`, `spell-lean-sting`} not yet owned.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with two files. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-15 by default. Purple portal chrome only after clear. No Inferno on this sheet. Honesty reroll → ENC-HOLD-04 leftover.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes Lean Hold / Odd Lean the primer already taught.  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket.  
REPLAYABILITY: LEAN-HOLD vs ODD-MUST/GUN by which PAIR the account answered.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale warden iron-skin uptime and Hood consume, not HP. Never Six Plug.  
STATUS: PROPOSED

---

### ENC-TREAS-15

ENCOUNTER_ID: ENC-TREAS-15  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Three **devices**, not three chests (distinct from ENC-TREAS-02):

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-CLASH_CACHE` | 1 AP adjacent **only while** a living hostile is Chebyshev ≤ 1 from the player: medium Doka, no guardian. Inverse of Watch Cache (open when hostiles are far). Failed open spends AP only. | Medium `applyRewards` **or** wasted AP |
| `WF-RSK-SCAR_OATH` | Flag: if the next `applyRewards` happens while current HP is strictly below 50% of max, that credit uses the hard multiplier. ≥ 50% at credit → nothing extra. Distinct from Last Stand (≤30%). | Hard victory purse if you finish wounded |
| Echo seal | Arms `WF-TRP-ECHO_PLATE` and spawns `FSN-LEAN-SIP` (the first step is free; the pack is the second step) | Depth Doka × hard-band (still clamped) + Lean Sting observation |

AI_REQUIREMENTS: Echo-seal pack uses LEAN-SIP contracts.  
SPELL_DISCOVERY_OPPORTUNITIES: Echo-seal preview is always shown before combat.  
MAP_REQUIREMENTS: Three device tiles + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** clash-only leave after the cache resolves. Clash Cache needs a **summonable** 1-HP dummy **or** a living hostile — on entry spawn 1× pawn in a stall so the cache is legal without a suicide; the pawn is optional to kill.  
SPECIAL_RULES: Touching Echo seal locks the coward exit and the other devices. Clash can be used without locking the coward exit (pawn may still live). Scar can be used without combat. Losing Echo is a normal death. Jackpot numbers stay inside `applyRewards`.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Echo commit must be won.  
FAILURE_CONDITION: Player death after Echo commit. Coward / clash-miss is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **three different prices** (melee-open coin, finish-wounded multiplier, echo-pack). Distinct from ENC-TREAS-14 (Turn Cache / Cast Oath).  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. After Echo commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Device positions rotate. Echo pack LEAN-SIP vs ODD-MUST.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack Echo with `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SCAR-01

ENCOUNTER_ID: ENC-SCAR-01  
TYPE: optional challenge / treasure  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: 1× bishop frost + 1× pawn (the fight you flagged).  
AI_REQUIREMENTS: Standard kits.  
SPELL_DISCOVERY_OPPORTUNITIES: None. The wager is HP, not a spell.  
MAP_REQUIREMENTS: Cracked crimson inlay (`WF-RSK-SCAR_OATH`). End a turn on it to flag this map. If the next `applyRewards` happens while the player’s current HP is strictly below 50% of max, that credit uses the hard multiplier. If they are at or above 50% at credit, the flag pays nothing extra. Distinct from Last Stand (≤30% cash-out), Harvest Moon (stay ≥70%), Wound Cache (below 50% to open a chest), and ENC-OATH-01 (stillness).  
SPECIAL_RULES: Optional floor tile. Map is solvable if never used. HP check is current/max at the `applyRewards` enqueue. Death still uses `saveBattleStats`.  
OBJECTIVE: Clear hostiles. Flagging is the intended greed line, not a fail.  
FAILURE_CONDITION: Player death. Unflagged clear is success-with-less.  
REWARD: Hard multiplier on the next enqueue only if flagged **and** below 50%. Overlay none (the risk *is* the challenge).  
TACTICAL_PURPOSE: Opt-in wounded purse. Distinct from ENC-CAST-01 (must have cast) and ENC-TURN-01 (even-round device).  
SOLVABILITY_REQUIREMENTS: Inlay reachable, not on spawn/portal.  
REPLAYABILITY: Inlay N vs S of center.  
SCALING_BEHAVIOUR: Do not lower the 50% line. Tighten by kit, not HP.  
STATUS: PROPOSED

---

### ENC-FAR-01

ENCOUNTER_ID: ENC-FAR-01  
TYPE: optional challenge / survival  
RELATIVE_DIFFICULTY: MID (opt-in overlay)  
ENEMY_COMPOSITION: 2× kiting bishops (`starter-frost` + `spell-slow` at band 1). 0 melee on entry — so planting adjacent is a **choice**.  
AI_REQUIREMENTS: Bishops hold the far third. They do not walk to Chebyshev 1 unless the player already did.  
SPELL_DISCOVERY_OPPORTUNITIES: Winning without ever ending a turn adjacent can later offer `spell-haste`.  
MAP_REQUIREMENTS: Arena + `WF-EVT-FAR_HOUR` overlay (this map only: if the player never ended a turn at Chebyshev ≤ 1 from a living hostile, the next `applyRewards` uses the hard multiplier). Distinct from Harvest Moon (HP ≥70%), Clean Hands (no challenge ticks), Long Watch (victory on round 4+), and Exposed Line (LoS to two bodies).  
SPECIAL_RULES: Adjacent means Chebyshev ≤ 1 from a living enemy-side combatant at player end-of-turn. Summons as the front line still count if the **player** is not adjacent. Overlay does not rewrite `combatMath`.  
OBJECTIVE: Clear hostiles. Kiting for the hard purse is the intended line, not a fail.  
FAILURE_CONDITION: Player death only.  
REWARD: Hard multiplier if the far-hour flag holds; else standard. Overlay none (the overlay *is* the challenge).  
TACTICAL_PURPOSE: Reward never planting melee. Inverse of ENC-PROT-01’s stay-near-the-ward.  
SOLVABILITY_REQUIREMENTS: Bishops reachable by frost from Chebyshev ≥ 2. No blocks.  
REPLAYABILITY: Bishops N vs E.  
SCALING_BEHAVIOUR: High: bishops gain Odd Hood so standing at 1 is both a Far Hour fail **and** a parity miss.  
STATUS: PROPOSED

---

### ENC-REST-15

ENCOUNTER_ID: ENC-REST-15  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional scar / far-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-16 / ENC-DRY-02 / ENC-LEAN-01 observed Dry Gait / Lean Sting / Odd Hood, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-CLOSE_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-15. Optional `WF-RSK-SCAR_OATH` tile (flag next room only). Optional `WF-PRT-INCANT_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player has cast at least one `SpellConfig` spell this map; Attack Nearest and summon kits do not arm it; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Scar does not start combat. `uiLayout` unchanged. After one full Table L clear, shrine can enable day-15 `rushVariant` flags (`jostle_abacus`, `peel_lance`, `dilate_tithe`, `hood_hex`).  
OBJECTIVE: Choose an exit. Optional: shrine, scar, incant gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Scar is a modifier flag, not a Doka mint. Incant Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Dry-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and scar pass punch-roster / portal reachability. Incant Gate always in addition to a reachable stable portal. Scar not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Incant on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-15

ENCOUNTER_ID: ENC-BRANCH-15  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: dry | lean | odd | void` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: dry → ENC-DRY-02 or ENC-SPELL-29, lean → ENC-LEAN-01 or ENC-ELITE-28, odd → ENC-ODD-02 or ENC-SPELL-30, void → ENC-DWELL-01 or ENC-GATE-02. A sealed fifth door to ENC-RARE-15 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: dry | lean | odd | void` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-15 / ENC-BOSS-15). Day-14 `ENC-BRANCH-14` stays heave/dual/mid/cinder. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Heave / Dual / Mid / Cinder.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Gap File door (ENC-GAP-01) can replace Lean for accounts that already finished Lean this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is a Mid Picket (ENC-AMBUSH-15) so lingering to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-16

ENCOUNTER_ID: ENC-MINI-16  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `weeping_pawn` (heal-adjacent). Branch dry: `weeping_pawn`. Branch lean: `bone_cavalier`. Branch odd: `midnight_bishop`. Branch void: `void_grandmaster`. Do **not** use `jostle_subdeacon` / `peel_friar` / `dilate_organist` / `hood_recluse`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table M directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (even-seam / echo-plate / slide-screen / one void gallery tile) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Hood consume / one extra Dry Gait) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-15

ENCOUNTER_ID: ENC-BOSS-15  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Dry → `weeping_pawn`; Lean → `bone_cavalier`; Odd → `pale_archbishop`; Void → `enthroned_void` (if the chain taught void tiles) or `void_grandmaster`. If the chain taught Mid Picket (ENC-AMBUSH-15) **and** Odd was not taken, Ice/Hex-mixed accounts may use `midnight_bishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table M ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-16) or echo (ENC-REINF-15) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Dry may inherit 2 even-seam tiles off the only path; Lean may inherit one echo plate; Odd may inherit room to stand at 1/2/3; Void may inherit one gallery void tile (not a sealed pocket).  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (self-heal / charge / curse-reflect / void).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-15

ENCOUNTER_ID: ENC-MAST-15  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on even-seam (`WF-HAZ-EVEN_SEAM`). Wave 2: `FSN-DRY-STEP` **or** `FSN-LEAN-SIP` **or** `FSN-ODD-MUST` **or** `FSN-VOID-DWELL` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Hood elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Full sophistication allowed (lethal lookahead, overkill spill, LoS reposition, backline guard). Wave 3 elite camps the safest dry, non-echo tile.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines even-seam aisle (TEACH-15), hurt-cinder gallery (HAZ-29), and a central alone font (PROT-15) that is **optional** — occupying it at end of player turn with no neighbor in 3 grants the 8% drink once. Scripted hazards only. Branch skins: Dry keeps even-seam; Lean keeps echo plate (HAZ-30 / REINF-15); Odd keeps 1/2/3 spacing; Void swaps seam for a gallery void and wave 2 becomes `FSN-VOID-DWELL`.  
SPECIAL_RULES: Portal locked until wave 3 clear. Honesty: missing writer → the PAIR leftover (ENC-DRY-02 / ENC-LEAN-01 / ENC-ODD-02 / ENC-DWELL-01) without claiming mastery. Insert after ENC-BRANCH-15.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove the player can refuse even-seam, keep 1 leftover MP **or** AP, step to even Chebyshev, and optionally peel for the font.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one dry path; font not on a portal.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role** (stepper vs stinger vs hood vs reeler), not its level.  
STATUS: PROPOSED

---

### ENC-RUSH-55

ENCOUNTER_ID: ENC-RUSH-55  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room M0 remix: `jostle_subdeacon` + `counter_chaplain` as Table M `M0`, plus ENC-DRY-02’s **leftover-MP chrome** (one gallery tile highlighted “keep 1 MP”, not a new boss). Combined mechanic remains: they swap **your** pack; he still has to shove **his** clerk onto a free cell to bank 8.  
AI_REQUIREMENTS: Existing combined mechanic. Abacus dest **never** occupies the Stole. Counter does **not** arm his extra (`forcedMovedThisTurn` is boss-side only from *his* shove). Trash (cap 1 pawn) only if the account learned ENC-DRY-02 (`rushVariant: jostle_abacus`). Trash does not receive jostle heals.  
SPELL_DISCOVERY_OPPORTUNITIES: None (Rush is a mastery product).  
MAP_REQUIREMENTS: Current Rush preferred-cell solvability. Gallery ⊆ reachable floor, not a preferred boss cell. Abacus dest never on the Stole.  
SPECIAL_RULES: `rushVariant: jostle_abacus`. Persist still goes through `persistBossRushRoomClear` / `completeBossRushRoom` (client `dokaReward`/`xpReward` ignored). First Table M clear: no gallery chrome (must commit to the live pair). Later clears: leftover-MP highlight. Hold if Table M objects are missing.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death → abort rush (`resetRunState`).  
REWARD: Table M room 0 table (design band; do not rewrite rooms 0–9 or L0–L3) + tiny bonus if the player never emptied both walk pools (skill, via `applyRewards`).  
TACTICAL_PURPOSE: Escalate M0 by teaching leftover-MP as a readable refuse, not more HP.  
SOLVABILITY_REQUIREMENTS: Preferred cells + gallery reachable. Hazard total ≤ 50.  
REPLAYABILITY: Gallery W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Not Ram / Hook / Mill / Rime / Dowager / Yoke / Orbit / Hinge / Grandmaster / Morrow / Split / Enter / Font.  
STATUS: PROPOSED

---

### ENC-RUSH-56

ENCOUNTER_ID: ENC-RUSH-56  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room M1 remix: `peel_friar` + `cinder_lance` as Table M `M1`. Combined mechanic remains: stand the sting to shoot the window, or peel and eat 8. Exit sting **never** occupies a telegraphed lance tile.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-REINF-15 / ENC-CINDER-02, a **painted echo pip** (visual only) shows which cell is the second step — no new damage formula. Optional 1× echo pawn from ENC-REINF-15 despawns when Peel dies.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Stoup and Brazier are both objects. Echo pip must not sit on portals or lance glow.  
SPECIAL_RULES: `rushVariant: peel_lance`. Echo pawn is not a boss and does not count toward `completeBossRushRoom` (prefer despawn). Wrong-element still −50%. Hold if pits/`tauntCasterId` objects are missing. Not Hex / Toll / Quiet / Enter.  
OBJECTIVE: Defeat both bosses; echo pawn optional.  
FAILURE_CONDITION: Player death.  
REWARD: Table M room 1 table + tiny bonus if the echo pawn died before Peel (skill).  
TACTICAL_PURPOSE: Add the two-step echo verb the Dry primer taught in ENC-REINF-15, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + echo cell reachable. Exit sting never on lance glow.  
REPLAYABILITY: Echo pawn vs warden (iron-skin) for accounts that already beat M1 once.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by echo iron-skin, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-57

ENCOUNTER_ID: ENC-RUSH-57  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room M2 remix: `dilate_organist` + `levy_rector` as Table M `M2`. Combined mechanic remains: Stretch Inferno late, then the recast is **taxed**. Tithe-box **never** occupies the Antiphoner. Strike stays legal (remaining 0).  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-IMPRINT-01, a **painted last-id pip** (visual only) shows which spell is stretched — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Tithe-box not on Antiphoner.  
SPECIAL_RULES: `rushVariant: dilate_tithe`. Not Flush / Conductor / Surplus / Court Stretch. Player Cadence Stretch cannot target allies.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table M room 2 table.  
TACTICAL_PURPOSE: Escalate by adding the imprint/verse readability the primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Tithe-box never on Antiphoner.  
REPLAYABILITY: Last-id pip Inferno vs Slow by seed.  
SCALING_BEHAVIOUR: Do not add a third boss. Stretch cap stays 8.  
STATUS: PROPOSED

---

### ENC-RUSH-58

ENCOUNTER_ID: ENC-RUSH-58  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room M3 remix: `hood_recluse` + `hexed_marker` as Table M `M3`. Combined mechanic remains: leave the Hex **toward** him and land the shot from Chebyshev 2. Hex **never** occupies the Capuche. Hood min stays Chebyshev **3**. Leaving Hex at range 4 to a cell still ≥ 3 still consumes.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-ODD-02 / ENC-SPELL-30, a **painted even-band ring** (visual only) at Chebyshev 2 shows the legal shot — no new damage formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Hex dest never on Capuche. Even-band overlay must not sit on portals.  
SPECIAL_RULES: `rushVariant: hood_hex`. Not Queen / Static / Sole / Lock / Fosse / Rebound / Peel (two leave directors on Peel, not here). Player Far Hood cannot last past consume or 2 of their turns. Hits from 1–2 land and do **not** consume.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table M room 3 table + tiny bonus if the player landed the shot from Chebyshev 2 (skill).  
TACTICAL_PURPOSE: Add the even-Chebyshev verb the Odd primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + even-band tiles reachable. Hex never on Capuche.  
REPLAYABILITY: Even-band N vs S of Capuche.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten Hood min (stay 3), not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain M — “Dry Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-15 then ENC-SPELL-29 (or ENC-SPELL-30 if Dry Gait already owned) |
| 2 | Reinforce | ENC-WAVE-16 |
| 3 | Combine | ENC-HAZ-29 then ENC-DRY-02 **or** ENC-LEAN-01 **or** ENC-ODD-02 |
| 3 insert | Choice | ENC-BRANCH-15 → Dry/Lean/Odd/Void destinations |
| 4 | Pressure | ENC-SURV-29 **or** ENC-PROT-15 **or** ENC-GAP-01 **or** skip via ENC-REST-15 |
| 4 | Mastery | ENC-MAST-15 (branch skin) |
| 5 | Boss | ENC-BOSS-15 |

Rare: 8% on depth 4 to **insert** ENC-RARE-15 before mastery.  
Treasure: rest may offer ENC-TREAS-15 instead of PROT-15.  
Void side-story: replace combine with ENC-DWELL-01 and mini-boss ENC-MINI-16; capstone may become `enthroned_void` if Void was the door.

### Chain N — “File Primer” (maxDepth 4)

ENC-SLIDE-02 → ENC-RETREAT-01 → ENC-FULL-01 → ENC-REST-15 → ENC-BOSS-15 (`void_grandmaster` only if Void was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-SLIDE-02 as teach on accounts that already know even-seam / leftover-MP.

### Rush injection (day-15)

After one full Table L clear, ENC-REST-15 shrine can enable: M0 → ENC-RUSH-55, M1 → ENC-RUSH-56, M2 → ENC-RUSH-57, M3 → ENC-RUSH-58. Day-1…day-14 flags for rooms 0–9 and Tables B–L remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-15, ENC-SPELL-29, ENC-SPELL-30 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-29, ENC-CINDER-02, ENC-FULL-01, ENC-DIAG-02 | `under_50_damage` |
| ENC-HAZ-30, ENC-WAVE-16 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-15, ENC-MAST-15 | `direct_hit` |
| ENC-DRY-02, ENC-LEAN-01, ENC-ELITE-28, ENC-ELITE-29, ENC-OWN-01, ENC-DWELL-01, ENC-GAP-01, ENC-HOLD-04 | `under_8_ap_per_turn` |
| ENC-SURV-29, ENC-SURV-30 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-15 / ENC-REST-15 scar / ENC-SCAR-01 / ENC-FAR-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `even_seam` or 1 hurt cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | even-seam **or** echo plate | kill + optional glyph |
| MID | named drop-14 `FSN-*` or waves | backline guard | zone 1 + Dry Gait / Lean Sting | one `WF-*` | clock / tags / gate |
| HIGH | elite or gap file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / dwell / own-turn |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush M0–M3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit even-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Scar / Far Hour / Clash stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-14 fields plus:

```
encounterId
encounterType        // + dry_gait | lean_sip | odd_must | void_dwell | dry_gate |
                     //   diag_oath | cinder_skip | own_watch | imprint | parch_quiet |
                     //   still_rest | gap_file | clash_cache | scar_oath | far_hour |
                     //   mid_picket | close_tutor | retreat_sill | full_step | slide_screen
formationId?         // FSN-DRY-STEP | FSN-LEAN-SIP | FSN-ODD-MUST |
                     // FSN-VOID-DWELL | FSN-DRY-GATE | FSN-DIAG-OATH |
                     // FSN-CINDER-FULL | FSN-OWN-WATCH | FSN-IMPRINT-CHOIR |
                     // FSN-LEAN-COURT | FSN-PARCHED-QUIET | FSN-STILL-REST |
                     // FSN-FOE-ESCORT | FSN-SPENT-CRACK | FSN-PAIR-DRY |
                     // FSN-LEAN-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // dry | lean | odd | void
evenSeamCells? / hurtCinderCell? / echoPlateCell?
slideScreenCell? / retreatSillCell? / aloneFontCell?
fullStepPads? / fileWalkArmed? / midPicketArmed?
huntDraftArmed? / farHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_alone_font | open_retreat | drink_alone |
                     //   tag_banner | choose_device | plant_close
failureKind
deviceTable[]        // ENC-TREAS-15
rushVariant?         // jostle_abacus | peel_lance | dilate_tithe | hood_hex
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Mid Picket” logic — use `formationId` / `midPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-22 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-14 families (`gaunt_mender`, `cadence_lagger`, `oct_prelate`, `even_hooder`, …) or Wave-15 spell unique CORE (`spell-poise-mend`, `spell-cadence-floor`, `spell-nine-span`, `spell-bar-cross`, …) — those wait on same-day / later catalogs. This catalog consumes drop-14 **formations** that can stand on Wave-13 kits.
- Faking Dry Gait without two leftover-MP=0 flags, Lean Sting as Dry/Ready, Odd Hood as a ≤1 / exact-2 / ≥3 zero, Must Lean as Must Drift, Void Reel as Cinder Reel, Dry Post walk-on as a detonate, Cinder Skip as a required player hop, Own Plate as an off-turn miss, Diag as Inch, Full Plate as Tapped, Imprint as Halve, Slide as Fold, Retreat as Kill Sill, Full Step as Wound Step, Alone Font as Rival Font, Mid Picket as Far Picket, Close Tutor as Range Tutor, Hunt Draft as Open Draft, Gap File as Paired File, Incant Gate in a dungeon, Six Plug while cap is 2.
- Consuming same-day 2026-10-23 Wave 15 family / spell / world catalogs.

---

## 10. Pick order (day-15, after days 1–14 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–14 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-15 + ENC-SPELL-29 (even-seam / dry-gait verbs)  
2. ENC-WAVE-16 (`formationId` DRY-STEP → LEAN-SIP)  
3. ENC-DRY-02 or ENC-LEAN-01 or ENC-ODD-02 (new pressure objects)  
4. ENC-BRANCH-15 (`branch: dry|lean|odd|void` snapshot-before-cleanup)  
5. ENC-BOSS-15 branch read  
6. Rush Table M variants 55–58 one room at a time (after the account has one full Table L clear)

Uniqueness: this file is the **fifteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
