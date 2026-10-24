# Encounter Evolution Catalog — 2026-10-24

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-24-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771), `ENCOUNTER_EVOLUTION_2026-10-21.md` (`EED-2026-10-21-001`, PR #826), `ENCOUNTER_EVOLUTION_2026-10-22.md` (`EED-2026-10-22-001`, PR #885), `ENCOUNTER_EVOLUTION_2026-10-23.md` (`EED-2026-10-23-001`, PR #957). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-15 Wave 14 packs `docs/design/ENEMY_FORMATIONS_2026-10-23.md` (PR #956), Wave 15 world features in `docs/WORLD_DYNAMICS.md` (PR #949, `WDD-2026-10-23-001`), Rush Table N `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.13 (PR #951). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-24) Wave 16 family / spell / world-feature / formation catalogs that land in parallel stay **unconsumed**. Wave 15 **families** (`hollow_gifter`, `cadence_floorer`, `nine_prelate`, `odd_strider`, `poise_mender`, … — PR #941) wait for a later formation drop (drop 16). Wave 16 **bosses** stay Rush-only (Table N). Wave 14 **families** (`gaunt_mender`, `cadence_lagger`, `oct_prelate`, `even_hooder`, `gaunt_stinger`, `gaunt_stepper`, `gaunt_siller`, `odd_holder`, `gaunt_lender`, `bare_sipper`, `gaunt_prelate`, `gaunt_bouncer`, `must_gaunter`, `verse_gaunter`, `gaunt_holder`, `orth_warder`, `tri_oather`, `brick_reeler`, `lone_biter`, `wake_marker`, `gait_plater`, `glyph_skipper`, `full_gaiter`, `summon_gaiter`, `still_gifter`, `cadence_gracer`, `debt_caster`, `brick_orbiter`, `watch_almer`, `pair_gaiter`, `axis_cutter`) are legal **metadata locks** on drop-15 sheets, not a 30% lottery.

---

## 1. Why a sixteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–15 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, Bash/Dry/Hood, Both/Stride/Near, Heave/Dual/Mid, and Dry/Lean/Odd. Day-15 rooms spent leftover drop-14 packs (`FSN-DRY-STEP`, `FSN-LEAN-SIP`, `FSN-ODD-MUST`, …) and Wave 14 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run spends verbs that day-15 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-15 Wave 14 packs | Day-15 taught dual-**dry-MP** heal / leftover-**window** poke / odd-Chebyshev miss as **rooms**. Still PDFs: `FSN-GAUNT-STEP`, `FSN-GAUNT-SIP`, `FSN-EVEN-ORTH`, `FSN-BRICK-WAKE`, `FSN-GAUNT-GATE`, `FSN-ORTH-TRI`, `FSN-GLYPH-FULL`, `FSN-GAIT-WATCH`, `FSN-GAUNT-CHOIR`, `FSN-GAUNT-COURT`, `FSN-GAUNT-QUIET`, `FSN-STILL-GRACE`, `FSN-LONE-AXIS`, `FSN-DEBT-ORBIT`, `FSN-PAIR-GIFT`, `FSN-GAUNT-HOLD` |
| World-feature Wave 15 | Day-15 **rooms** never spent `WF-HAZ-LAST_SEAM`, `WF-HAZ-RICH_CINDER`, `WF-TRP-CAST_PLATE`, `WF-TER-HUSH_CURTAIN`, `WF-OBS-SPENT_SILL`, `WF-ZON-EMPTY_FONT`, `WF-TEL-EMPTY_STEP`, `WF-INV-SHEATH_FILE`, `WF-ELT-ORTH_PICKET`, `WF-TRS-LINE_CACHE`, `WF-SPL-ORTH_TUTOR`, `WF-RSK-PLANT_OATH`, `WF-MOD-ACT_LOCK`, `WF-EVT-CLOSE_HOUR`, `WF-ENV-FILE_SHADE` |
| Rush Table N | `N0`–`N3` (`wick_exorcist`+`march_prefect`, `dry_nuncio`+`eternal_pawn_king`, `hearth_legate`+`cover_hospitaller`, `must_preceptor`+`bias_prebendary`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `lastSeamCells` / `richCinderCell` / `castPlateCell` / `hushCurtainCell` / `spentSillCell` / `emptyFontCell` / `emptyStepPads` / `actLockArmed` / `orthPicketArmed` / `fileShadeArmed` / `closeHourArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post / Lean Post / Gaunt Post count as **1**. Six Plug / `FSN-LEAN-HOLD/SIX` count as **6**. Sept / `FSN-DRIFT-COURT/SEPT` count as **7**. Oct Plug (`oct_prelate`, `FSN-GAUNT-HOLD/OCT`) counts as **8** — wait for remaining cap ≥ 8 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Gaunt / Still Gift / Pair Gift bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Gaunt Mend / Still Gift / Pair Gift live **only** on the named profiles. Do **not** ship `spell-parched-mend` beside Dry Gait. Do **not** clone Hollow Gift as Gaunt Mend (Hollow Gift is **target-only** both-pools — Wave 15, unconsumed).
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-VOW_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still / Tally / Mark / Incant). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-CLOSE_HOUR` may overlay a dungeon as a reward wager (no extra portal).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-16 ids (`wick_exorcist`, `dry_nuncio`, `hearth_legate`, `must_preceptor`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Heave Step / Parched Step / **Gaunt Step** **does not** count as leftover walk-MP for Gaunt Mend, Gaunt Sting, Bare Sip, Gaunt Sill, Gaunt Post, Must Gaunt, Verse Gaunt, Gaunt Hold, Gait Plate, Full Gait, or Pair Gait. Walk MP must **not** set `forcedMovedThisTurn` / `lastForcedMoveDir`. Gaunt Step dests are occupancy, **not** `isSwap`.
- Gaunt Mend pays 8 only if **caster and target** leftover AP = 0 **and** leftover MP = 0 after the 3 AP is paid. One wet pool on one body is 0 HP. Gaunt Step relocates onto a free Chebyshev-1 of an ally whose leftover AP **and** leftover MP are already 0 — not Parched / Home / Heave / Ally Step. Gaunt Sting is 10, +8 iff **target** leftover AP = 0 **and** leftover MP = 0. Bare Sip steals 1 leftover AP iff leftover MP = 0 **and** leftover AP ≥ 1. Even Hood zeros a hit from **even** Chebyshev (0, 2, 4, …); odd (1, 3, 5) lands and does **not** consume. Same-cell (0) **misses**. Orth Stride makes the **next** walk orthogonal-only (`|dx|==0 XOR |dy|==0`). Tri Oath wants the next spell at Chebyshev **exactly 3**; Strike stays legal. Brick Reel is the **seventh** `applyAttract` dest (file / ally / foe / paint / hazard / void / then **barrier**). Wake Mark detonates on **start-turn occupy**. Gaunt Post detonates on end-turn occupy **and leftover AP = 0 and leftover MP = 0**; walk-on is safe; leftover ≥ 1 is safe. Gaunt Sill taxes start-turn occupy **and both leftover 0**; paint stays. Glyph Skip is next **1-tile** walk treating **glyph-tax** as floor; lava / spikes / pits / cinder still tick. Full Gait is leftover **MP ≥ 3** → +RES (inverse of Full Plate’s leftover AP ≥ 3). Gait Plate zeros the next hit **while leftover MP ≥ 1**; leftover MP 0 at impact **lands**. Watch Alms: overwatch snap grants the **walker** +1 AP (inverse of Watch Lend’s watcher grant). Pair Gait pokes iff leftover MP is **exactly 2**. Still Gift heals iff the **target** spent 0 walk MP this turn. Cast Debt is spelled-**last-turn** next-walk +1 AP; Strike last turn does **not** arm it. Verse Gaunt makes the last id illegal until leftover AP = 0 **and** leftover MP = 0. Must Gaunt makes remaining **non-Strike** spells illegal unless leftover MP = 0 **and** last AP. Gaunt Hold refuses Strike until leftover MP = 0 **and** last AP. Lone Bite pokes iff the target is isolated from **all** units (caster counts). Axis Cut bonuses a handler who shares a **rank or file** with a pet.
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 14 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-GAUNT-01 / ENC-SPELL-31 / ENC-ELITE-30 (mend skin) | leftover-**AP**=0 **and** leftover-**MP**=0 on **both** bodies **or** occupancy dest for Gaunt Step | Convert to ENC-DRY-02 (queued day-15) without claiming Gaunt Mend |
| ENC-BARE-01 / ENC-ELITE-30 (sting skin) | leftover AP = 0 **and** leftover MP = 0 poke **or** leftover-MP=0 AP steal | Convert to ENC-LEAN-01 (queued day-15) without claiming Gaunt / Bare |
| ENC-EVEN-02 / ENC-SPELL-32 | Even Hood even-Chebyshev consume **or** next-walk orthogonal-only | Convert to ENC-ODD-02 or ENC-DIAG-02 (queued day-15) without claiming Even |
| ENC-WAKE-01 | seventh `applyAttract` dest (barrier) **or** start-turn occupy paint | Convert to ENC-DWELL-01 (queued day-15) without claiming Brick Reel |
| ENC-GATE-03 | leftover-AP=0 **and** leftover-MP=0 occupy detonate **and** walk-on 0 **or** `summonAI === "gauntpost"` | Convert to ENC-GATE-02 (queued day-15) without claiming Gaunt Gate |
| ENC-TRI-01 | next walk orthogonal-only **or** next-spell exact Chebyshev 3 | Convert to ENC-DIAG-02 (queued day-15) without claiming Orth / Tri |
| ENC-GLYPH-01 | 1-tile glyph-tax-as-floor **or** leftover-MP ≥ 3 +RES | Convert to ENC-CINDER-02 (queued day-15) without claiming Glyph Skip |
| ENC-ALMS-01 | leftover-MP ≥ 1 miss **or** overwatch snap grants walker +1 AP | Convert to ENC-OWN-01 (queued day-15) without claiming Gait Plate / Alms |
| ENC-DEBT-01 | spelled-last-turn walk tax **or** orbit-adjacent-barrier without sealing the last aisle | Convert to ENC-CRACK-02 (queued day-15) without claiming Cast Debt |
| ENC-PAIR-04 | leftover MP **exactly 2** poke **or** target-camp (`walkMpSpentThisTurn` = 0) heal | Convert to ENC-PAIR-03 (queued day-15) without claiming Pair Gift |
| ENC-HOLD-05 / ENC-RARE-16 | Strike refuse until leftover MP = 0 **and** last AP **or** tools-until leftover MP = 0 **and** last AP | Convert to ENC-HOLD-04 (queued day-15) without claiming Gaunt Hold |
| ENC-CURTAIN-01 | walk-through LoS-block **or** 1-AP adjacent part | Convert to ENC-SLIDE-02 (queued day-15) without claiming Hush Curtain |
| ENC-DUMP-01 | wall→floor after player end-turn with remaining AP === 0 | Convert to ENC-RETREAT-01 (queued day-15) without claiming Spent |
| ENC-EMPTY-02 | pad swap only if remaining AP === 0 | Convert to ENC-FULL-01 (queued day-15) without claiming Empty Step |
| ENC-PROT-16 | Empty Font heal only if remaining AP === 0 | Convert to ENC-PROT-15 (queued day-15, Alone) without claiming Empty |
| ENC-PRIO-18 | one-cast if the player ends a turn sharing a **rank or file** while they live | Convert to ENC-PRIO-17 (queued day-15) without claiming Orth Tutor |
| ENC-AMBUSH-16 | elite appears only while the player shares the post’s **row or column** | Convert to ENC-AMBUSH-15 (queued day-15, Chebyshev 4–5) without claiming Orth |
| ENC-SURV-31 | end-of-turn tax if the player does **not** share a row or column with a living enemy-side unit | Convert to ENC-SURV-29 (queued day-15) without claiming File Shade |
| ENC-SHEATH-01 | second elite cannot spend AP on spells until first dies **or** player ends adjacent | Convert to ENC-GAP-01 (queued day-15) without claiming Sheath File |
| ENC-LONE-02 | isolation from **all** units **or** handler-on-file cut | Convert to ENC-ESCORT-01 (queued day-15) without claiming Lone Axis |
| ENC-RUSH-59…62 | Table N bosses + cresset/cruet/andiron/ell objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Gaunt / Even / Brick / Orth primer + inserts)

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

| Beat | Depth hint | Job | Day-16 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (last-seam hop, four-flag heal, rich cinder) | ENC-TEACH-16, ENC-SPELL-31, ENC-HAZ-31 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-17, ENC-AMBUSH-16, ENC-SPELL-32 |
| Combine | 2–3 | Two taught verbs | ENC-GAUNT-01, ENC-BARE-01, ENC-EVEN-02, ENC-HAZ-32, ENC-CURTAIN-01, ENC-GATE-03 |
| Pressure | 3 | Clock, file shade, pull-to-brick, or leftover-MP miss | ENC-SURV-31, ENC-PROT-16, ENC-WAKE-01, ENC-ALMS-01, ENC-PRIO-18, ENC-SHEATH-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-16, ENC-BRANCH-16, ENC-TREAS-16, ENC-PLANT-01, ENC-CLOSE-01, ENC-EMPTY-02 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-30, ENC-ELITE-31, ENC-RARE-16, ENC-MAST-16, ENC-TRI-01, ENC-GLYPH-01, ENC-DEBT-01, ENC-HOLD-05 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-17, ENC-BOSS-16, ENC-RUSH-59…62 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–15 remain valid. Day-16 **Gaunt / Even / Brick / Orth primer** is the default for accounts that already cleared Dry / Lean / Odd once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-16

ENCOUNTER_ID: ENC-TEACH-16  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a last-stride path-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile slate-ochre ribbon of `WF-HAZ-LAST_SEAM` across the mid-band (walk tiles cost 4% max HP **only if remaining MP after that step is 0**; leftover MP is free floor). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First 0-MP seam tax logs a teach line. Do not also apply Even Seam (ENC-TEACH-15: tax on **even rounds**), Odd Seam (ENC-TEACH-14: tax on **odd**), Late Seam (ENC-TEACH-12: first **cell** free), Bond Seam (ENC-TEACH-13: tax only with a living allied summon), or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: stop one tile short so leftover MP remains, or walk the dry detour.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is free while you still have MP, a tax on the last stride; stopping short is the answer, not a bigger nuke.” Inverse of ENC-TEACH-15’s round-parity tax. Prepares ENC-HAZ-32 / ENC-TREAS-16 (spent-AP / leftover-MP devices).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-RICH_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-31`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-31

ENCOUNTER_ID: ENC-HAZ-31  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn (`physical_attack`). Optional 1-HP player-side summon is **not** required; if the player brought one, a full-HP body is legal bait.  
AI_REQUIREMENTS: Bishop kites. Pawn charges. Neither camps the orb’s next cell on purpose.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-RICH_CINDER` on a mid-court floor cell (at round start steps one tile toward the living unit with the **highest current HP%**; ties break toward the player; 5% max HP on land). Inverse of Hurt Cinder (ENC-HAZ-29: hunts the **lowest** HP%). Distinct from Hunting Lantern (last MP spender), Still Cinder (0-MP spender), Shy Cinder (away from the nearest body), and Orbiting Cinder (clockwise square). A floor path around the orb remains. Exit behind the bishop.  
SPECIAL_RULES: Scripted orb only. Never starts on spawn±3 or the portal. Tax via in-battle challenge HP. First land logs a teach line.  
OBJECTIVE: Clear all. Optional: stay the wounded body so the orb hunts a healthier foe, or park a full-HP summon as bait.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the orb hunts the healthiest, not the wounded.” Distinct from ENC-HAZ-29 (hurt / lowest HP%).  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb counts as 1 toward the hazard cap.  
REPLAYABILITY: Orb west vs east gallery.  
SCALING_BEHAVIOUR: Mid: pawn starts at 100% so the orb prefers it until you chip it. High: inherit one last-seam tile on a **flank**. Never two orbs.  
STATUS: PROPOSED

---

### ENC-HAZ-32

ENCOUNTER_ID: ENC-HAZ-32  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites on cardinal files. After either spends AP, further occupancy-walk MP is illegal this turn if `WF-MOD-ACT_LOCK` is on. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-16 last-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-16`) **plus** `WF-MOD-ACT_LOCK` armed (after a unit spends AP this turn, further occupancy-walk MP spends are illegal; leftover MP may still pay teleport tiles). A dry detour exists. Distinct from File Walk (committed facing after the first step), One Stride (at most 1 MP), and Slow Hand (0-cooldown spells +1 AP).  
SPECIAL_RULES: Scripted hazards only. Act Lock does not rewrite damage. Attack Nearest is not a walk. Teleport tiles are not walks.  
OBJECTIVE: Clear all. Intended: walk first, then act; stop one tile short of the seam so leftover MP remains.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Combine last-stride tax with an act-then-no-walk lock so “cast then dash across” is the wrong answer.  
SOLVABILITY_REQUIREMENTS: Walk-then-act remains usable; seam is not a wall; desturn never isolates the exit.  
REPLAYABILITY: Facing N-S vs E-W.  
SCALING_BEHAVIOUR: High: enable Gaunt Sting. Peak: add `WF-ENV-FILE_SHADE` so ending off a hostile’s rank/file is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-31

ENCOUNTER_ID: ENC-SPELL-31  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-GAUNT-STEP/SOLO-MEND` fallback — 1× `gaunt_mender` queen (`spell-gaunt-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Gaunt Step off until band 1 honesty.  
AI_REQUIREMENTS: Mender Gaunt-Mends only if **caster and target** leftover AP = 0 **and** leftover MP = 0 **and** missing HP ≥ 8; else Shields. Pawn greedy. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Mend (8 paid on four leftover-0 flags) can drop `spell-gaunt-mend` if missing. Do **not** grant `spell-parched-mend` or Hollow Gift. If already owned, glyph is `starter-shield`.  
MAP_REQUIREMENTS: Open court, two pillars, optional glyph tile (`discoverSpellId: spell-gaunt-mend`). No extra modifiers.  
SPECIAL_RULES: If the player already owns Gaunt Mend, convert to ENC-GAUNT-01. Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Honesty: missing leftover-pair writer → ENC-SPELL-29 leftover without claiming Gaunt. Band 0 → show `FSN-DRY-STEP`. Dual Keep leftover is **not** empty.  
OBJECTIVE: Defeat both. Optional: pick up the glyph before the last kill.  
FAILURE_CONDITION: Player death. Glyph despawns unused (still a win).  
REWARD: Standard + optional grant of `spell-gaunt-mend` to the spellbook. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “four leftover-0 flags cash 8; one wet pool on one body is 0 HP.” Distinct from ENC-SPELL-29 (leftover-**MP**=0 only).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable. Glyph is floor, not a portal.  
REPLAYABILITY: Glyph skipped if owned. Pawn vs knight chassis at mid.  
SCALING_BEHAVIOUR: Mid: enable Gaunt Step on a second queen (promote to ENC-GAUNT-01). Never Inferno on the mender.  
STATUS: PROPOSED

---

### ENC-SPELL-32

ENCOUNTER_ID: ENC-SPELL-32  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-EVEN-ORTH/SOLO-HOOD` fallback — 1× `even_hooder` pawn or knight (`spell-even-hood` + `physical_attack`) + 1× bishop (`starter-frost` only). Orth Stride off until band 1 honesty.  
AI_REQUIREMENTS: Hood skips if the only threat sits at odd Chebyshev. Bishop kites. Soph 0–1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Even Hood (even-Chebyshev consume) can drop `spell-even-hood` if missing. If already owned, glyph is `starter-frost`.  
MAP_REQUIREMENTS: Open court with room to stand at 1, 2, **and** 3. Optional glyph (`discoverSpellId: spell-even-hood`).  
SPECIAL_RULES: If the player already owns Even Hood, convert to ENC-EVEN-02. Honesty: missing even-Chebyshev consume → ENC-SPELL-30 leftover without claiming Even. Band 0 → show `FSN-ODD-MUST`. DoT does not consume. Same-cell (0) **misses**.  
OBJECTIVE: Defeat both. Optional: pick up the glyph. Intended: step to Chebyshev 1, then Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional grant of `spell-even-hood`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “even range misses; odd lands.” Inverse of ENC-SPELL-30 (odd miss).  
SOLVABILITY_REQUIREMENTS: Tiles at 1, 2, and 3 from Hood start. Two walk-offs.  
REPLAYABILITY: Hood chassis pawn vs knight.  
SCALING_BEHAVIOUR: Mid: enable Orth Stride (promote to ENC-EVEN-02). Never pack Odd Hood on this PAIR.  
STATUS: PROPOSED

---

### ENC-GAUNT-01

ENCOUNTER_ID: ENC-GAUNT-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GAUNT-STEP` — 1× `gaunt_mender` queen (`spell-gaunt-mend` + `starter-shield`) + 1× `gaunt_stepper` queen without heal (`spell-gaunt-step` + `physical_attack`). No Dry / Still / Heave / Both / Bar / Gift Mend on PAIR. No Parched / Home / Heave / Ally Step / Cover on PAIR.  
AI_REQUIREMENTS: Mender healer; skip if any leftover ≥ 1. Stepper protector; skip if ally leftover AP ≥ 1 or leftover MP ≥ 1 or no free dest. Until occupancy dests exist (not `isSwap`), this sheet must not ship. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Mend or a legal Gaunt Step can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Stepper that is **not** the player’s only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Gaunt Mend: 8 HP iff **caster and target** leftover AP = 0 **and** leftover MP = 0. One wet pool is 0 HP. Gaunt Step is not ungated Home Step and not Parched Step. Band 0 → show `FSN-DRY-STEP`. Honesty reroll → ENC-DRY-02. Dual Keep leftover is **not** empty.  
OBJECTIVE: Defeat both. Intended: keep 1 leftover AP **or** 1 leftover MP on one body; occupy every Chebyshev-1 of the Mender.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-pair discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag healer + four-flag joiner. Distinct from ENC-DRY-02 (leftover-**MP**=0 only) and ENC-HEAVE-01 (both **force-moved**).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal Step dest. Two-unit occupancy leaves an exit.  
REPLAYABILITY: Mender north vs east. Variant `FSN-GAUNT-STEP/E-STEP`.  
SCALING_BEHAVIOUR: High: promote to `FSN-GAUNT-QUIET` (add cover). Peak: inherit one last-seam gallery. Never `titans_vigor`. Never pack Dry Gait on this PAIR.  
STATUS: PROPOSED

---

### ENC-BARE-01

ENCOUNTER_ID: ENC-BARE-01  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GAUNT-SIP` — 1× `gaunt_stinger` pawn (`spell-gaunt-sting` + `physical_attack`) + 1× `bare_sipper` pawn (`spell-bare-sip` + `starter-frost`). No Lean / Dry / Ready / Pair / Lone Purse on PAIR. No Odd Hold on PAIR.  
AI_REQUIREMENTS: Stinger lurks at 3 and commits when leftover AP = 0 **and** leftover MP = 0 **or** HP% ≤ 40. Sipper Sips if leftover MP = 0 **and** leftover AP ≥ 1; else Frosts. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Sting or Bare Sip can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Stinger needs a flank path that is not the only exit. Sipper needs a retreat tile. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Gaunt Sting: 10, +8 iff **target** leftover AP = 0 **and** leftover MP = 0. Bare Sip: 8, then steal 1 leftover AP iff leftover MP = 0 **and** leftover AP ≥ 1. Dual Keep leftover is **not** 0. Honesty reroll → ENC-LEAN-01. Band 0 → show `FSN-LEAN-SIP`. Cap applied leftover-AP steal at −1 with one Slow source.  
OBJECTIVE: Defeat both. Intended: keep 1 leftover AP **or** 1 leftover MP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + leftover-window discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Fully-spent poke + leftover-MP=0 AP steal. Distinct from ENC-LEAN-01 (AP=0 **and** MP ≥ 1) and ENC-DRY-01 (AP=0, no MP gate).  
SOLVABILITY_REQUIREMENTS: Flank path reachable; Sipper not trapped.  
REPLAYABILITY: Stinger west vs east. Variant `FSN-GAUNT-SIP/E-STING`.  
SCALING_BEHAVIOUR: High: promote to `FSN-GAUNT-COURT` (add Odd Hold). Never two Keep cards on PAIR.  
STATUS: PROPOSED

---

### ENC-EVEN-02

ENCOUNTER_ID: ENC-EVEN-02  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-EVEN-ORTH` — 1× `even_hooder` pawn or knight (`spell-even-hood` + `physical_attack`) + 1× `orth_warder` knight (`spell-orth-stride` + `physical_attack`). No Odd / Near / Mid / Far Hood / Own / Off / Gait Plate on PAIR. No Diag / Inch / Must Step on PAIR. Distinct from queued day-10 `ENC-EVEN-01` (even-Manhattan walk-pool tax — do not reuse that id).  
AI_REQUIREMENTS: Hood skips if the only threat sits at odd Chebyshev. Warder skips if only dests are diagonal and Strike is better; **do not** assign to kits whose only walk is knight-jump. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Even Hood or Orth Stride can drop that id if missing.  
MAP_REQUIREMENTS: `openField`, `arena`, or `chessboard` with room to stand at 1, 2, **and** 3, plus at least one orthogonal aisle. Reject a 1-tile diagonal-only tunnel. No Time Warp.  
SPECIAL_RULES: Family lottery **off**. Even Hood consumes **before** `dealDamage`. DoT does not consume. Orth Stride: next walk orthogonal only; teleport / Swap do not pay. Honesty reroll → ENC-ODD-02 or ENC-DIAG-02. Band 0 → show `FSN-ODD-MUST`.  
OBJECTIVE: Defeat both. Intended: step to Chebyshev 1, then Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + parity discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Even-range miss + orthogonal-only next walk. Distinct from ENC-ODD-02 (odd miss + leftover-MP tool lock) and ENC-DIAG-02 (diagonal-only + exact 2).  
SOLVABILITY_REQUIREMENTS: Tiles at 1, 2, and 3 from Hood start. Two walk-offs. One orthogonal aisle.  
REPLAYABILITY: Hood chassis pawn vs knight (`FSN-EVEN-ORTH/PAWN`).  
SCALING_BEHAVIOUR: High: promote to `FSN-EVEN-ORTH/GUN` (add glass sniper at minRange 3). Peak: inherit one last-seam. Never pack Odd Hood.  
STATUS: PROPOSED

---

### ENC-WAKE-01

ENCOUNTER_ID: ENC-WAKE-01  
TYPE: hazard / displacement / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BRICK-WAKE` — 1× `brick_reeler` rook (`starter-frost` + `spell-brick-reel`) + 1× `wake_marker` bishop (`spell-wake-mark` + `physical_attack`). No Void / Cinder / Paint / Foe / Ally / File Reel on PAIR. No Dwell / Ingress / Gaunt Sill on PAIR.  
AI_REQUIREMENTS: Reeler pulls 1 toward nearest **barrier** in Chebyshev ≤ 6. Marker paints a cell that detonates if a unit **begins their turn** on it. Neither camps the only exit. Soph 2–3. Until the seventh `applyAttract` dest exists, this sheet must not ship.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Brick Reel or Wake Mark can drop that id if missing.  
MAP_REQUIREMENTS: `arena`, `fortress`, or `asymmetric` with **at least one barrier** 2 tiles from typical stand, plus open floor the other way. Reject `openField` with no barriers (reroll). Reject `corridorMaze`. Reeler needs LoS to the barrier. Two walk-offs after every legal pull dest.  
SPECIAL_RULES: Family lottery **off**. Brick Reel: seventh `applyAttract` dest. Dest is **toward**, not onto, a world portal. Empty board (no barrier in 6) fizzles — weight 0 if no living barrier at spawn. Wake Mark: walk-on and walk-off the same turn is free. Swap onto the cell does **not** detonate until their next turn **starts** there. Honesty reroll → ENC-DWELL-01.  
OBJECTIVE: Clear all. Intended: snipe the Marker; leave the toward-cell before your turn starts.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + displacement discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pull toward the wall, then start-turn occupy. Distinct from ENC-DWELL-01 (void dest + **end-turn** occupy) and ENC-CINDER-01 (hazard dest + **enter** detonate).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal pull dest that is **not** the barrier cell. Marker paint never on the only aisle.  
REPLAYABILITY: Barrier west vs east. Variant `FSN-BRICK-WAKE/GLYPH`.  
SCALING_BEHAVIOUR: High: add glyph sower junior (`FSN-BRICK-WAKE/GLYPH`). Never two Reel dest flavors. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-GATE-03

ENCOUNTER_ID: ENC-GATE-03  
TYPE: elite-adjacent / protection-adjacent  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GAUNT-GATE` — 1× `gaunt_prelate` pawn (`physical_attack` + `spell-gaunt-post`) + 1× `gaunt_siller` rook (`starter-frost` + `spell-gaunt-sill`). No Lean / Dummy / Drift / Dwell / Wake Post on CELL. No Gaunt Sting on BASE.  
AI_REQUIREMENTS: Prelate places the post then steps off; skip if Dual Keep / walk-off is free; fall through to Strike at cap (never skip-lock). Siller paints a **different** cell; skip if they can Dual Keep or walk off. Soph 2–3. `summonAI === "gauntpost"` required. Remaining cap ≥ 1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Post or Gaunt Sill can drop that id if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `corridorMaze` **with a detour**. Two distinct free floor cells that are not the only player↔exit path. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Gaunt Post: end-turn occupy **and leftover AP = 0 and leftover MP = 0** detonates (10) and the post dies. Walk-on is safe. Relocate landing is safe. Leftover ≥ 1 is safe. Gaunt Sill: start-turn occupy **and both leftover 0** deals 8; paint **stays**. Honesty reroll → ENC-GATE-02. Live cap 2 is enough for this 1-cell post.  
OBJECTIVE: Defeat both. Intended: keep a 1-chip on both leftover pools; leave both painted cells.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Fully-spent post + start-turn fully-spent sill. Distinct from ENC-GATE-02 (leftover-**AP**=0 only) and ENC-DWELL-01 (ungated end-turn occupy).  
SOLVABILITY_REQUIREMENTS: Two distinct free floor cells; post never on the only aisle; player keeps ≥ 1 walk-off.  
REPLAYABILITY: Post west vs east. Variant `FSN-GAUNT-GATE/STING`.  
SCALING_BEHAVIOUR: High: add Gaunt Sting junior (`FSN-GAUNT-GATE/STING`). Never paint the post’s cell as the sill on BASE.  
STATUS: PROPOSED

---

### ENC-TRI-01

ENCOUNTER_ID: ENC-TRI-01  
TYPE: elite-adjacent / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-ORTH-TRI` — 1× `orth_warder` knight (`spell-orth-stride` + `physical_attack`) + 1× `tri_oather` bishop (`spell-tri-oath` + `starter-frost`). No Diag / Inch / Must Step / Mid / Long Oath on CELL. No Far Stinger on BASE.  
AI_REQUIREMENTS: Warder Orths if a rank/file dest exists; skip if only dests are diagonal. Oather Oaths then Frosts at 3 if LoS is open; else holds. Never both on turn 1 against a full-HP player who has not acted. Hostiles start ≥ 4 apart. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Orth Stride or Tri Oath can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `chessboard` with an orthogonal aisle **and** tiles at Chebyshev 1, 2, 3, and 4 from the Oather start. Reject a 1-tile diagonal-only tunnel. No Time Warp. Pack Cap (maxRange 2) stays off.  
SPECIAL_RULES: Family lottery **off**. Orth Stride: next walk orthogonal only. Tri Oath: next **spell** illegal unless Chebyshev **exactly 3**. Strike stays legal at 1. Frost at 1, 2, or ≥ 4 fizzles (AP not spent). Honesty reroll → ENC-DIAG-02. Distinct from queued day-13 `ENC-ORTH-01` (Orth Step world-feature room — do not reuse that id).  
OBJECTIVE: Defeat both. Intended: close to 1, then Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + shape-lock discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Orthogonal-only walk + exact-3 oath. Distinct from ENC-DIAG-02 (diagonal + exact 2) and ENC-EVEN-02 (even miss + orth walk, **no** oath).  
SOLVABILITY_REQUIREMENTS: Orthogonal aisle; tiles at 1–4; two walk-offs.  
REPLAYABILITY: Oather north vs east. Variant `FSN-ORTH-TRI/FAR`.  
SCALING_BEHAVIOUR: High: add far stinger junior (`FSN-ORTH-TRI/FAR`). Never two walk-shape locks.  
STATUS: PROPOSED

---

### ENC-GLYPH-01

ENCOUNTER_ID: ENC-GLYPH-01  
TYPE: hazard / elite-adjacent  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-GLYPH-FULL` — 1× `glyph_skipper` pawn (`physical_attack` + `spell-glyph-skip`) + 1× `full_gaiter` rook (`starter-shield` + `spell-full-gait`). No Cinder / Spike / Lava / Pit Skip on CELL. No Full Plate / Tapped / Still / Empty Plate on CELL.  
AI_REQUIREMENTS: Skipper skips if the next walk is not a 1-step across glyph-tax. Gaiter skips if leftover MP ≤ 2 after the 2-AP pay. Hostiles start ≥ 4 apart. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Glyph Skip or Full Gait can drop that id if missing.  
MAP_REQUIREMENTS: Open court with **one** painted glyph-tax tile (not last-seam, not even-seam) on a gallery. A 1-tile hop across it must exist. Exit not on the glyph.  
SPECIAL_RULES: Family lottery **off**. Glyph Skip: next **1-tile** walk treats **glyph-tax** as floor; lava / spikes / pits / cinder still tick. Full Gait: leftover **MP ≥ 3** → +RES (inverse of ENC-CINDER-02’s leftover **AP ≥ 3**). Honesty reroll → ENC-CINDER-02.  
OBJECTIVE: Clear all. Optional: hop the glyph with leftover MP ≥ 3 so Full Gait’s +RES is the wrong answer for you.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: 1-tile glyph-tax skip + leftover-MP≥3 +RES. Distinct from ENC-CINDER-02 (cinder skip + leftover-AP≥3).  
SOLVABILITY_REQUIREMENTS: 1-tile hop exists; glyph not a wall; hop dest is floor. Counts as 1 toward the hazard cap.  
REPLAYABILITY: Glyph west vs east. Variant `FSN-GLYPH-FULL/LEY`.  
SCALING_BEHAVIOUR: High: inherit one last-seam on a **different** gallery. Never two skip flavors.  
STATUS: PROPOSED

---

### ENC-ALMS-01

ENCOUNTER_ID: ENC-ALMS-01  
TYPE: elite-adjacent / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GAIT-WATCH` — 1× `gait_plater` rook (`starter-shield` + `spell-gait-plate`) + 1× `watch_almer` bishop (`starter-frost` + `spell-watch-alms`). No Own / Off Plate / Mid Hood on CELL. No Watch Lend / Watch Fee / Watch Mute as PAIR.  
AI_REQUIREMENTS: Plater skips if leftover MP already 0. Almer skips if no overwatch is armed. Neither camps the only exit. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gait Plate or Watch Alms can drop that id if missing.  
MAP_REQUIREMENTS: `arena` with one overwatch line (painted) that is **not** the only aisle. Room to stand with leftover MP 0 **or** ≥ 1.  
SPECIAL_RULES: Family lottery **off**. Gait Plate: next hit 0 **while leftover MP ≥ 1**; leftover MP 0 at impact **lands**. Watch Alms: snap still deals; **walker** +1 AP (inverse of ENC-OWN-01’s watcher grant). Honesty reroll → ENC-OWN-01. Turret gun stays off BASE (`FSN-GAIT-WATCH/GUN`).  
OBJECTIVE: Clear all. Intended: dump leftover MP so the plate lands, **or** refuse the overwatch line so Alms never snaps.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-MP miss + snap grants walker AP. Distinct from ENC-OWN-01 (own-turn miss + watcher +1 AP).  
SOLVABILITY_REQUIREMENTS: Overwatch line not a cut-vertex. Two walk-offs.  
REPLAYABILITY: Plate west vs east. Variant `FSN-GAIT-WATCH/GUN` only after this BASE is answered.  
SCALING_BEHAVIOUR: High: add turret junior (`FSN-GAIT-WATCH/GUN`). Never two snap-grant engines.  
STATUS: PROPOSED

---

### ENC-DEBT-01

ENCOUNTER_ID: ENC-DEBT-01  
TYPE: elite-adjacent / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DEBT-ORBIT` — 1× `debt_caster` bishop (`starter-frost` + `spell-cast-debt`) + 1× `brick_orbiter` rook (`starter-frost` + `spell-brick-orbit`) + optional `ROLE-GLYPH` junior. No Spent / Still / Gait Tax as PAIR. No Brick Crack / Sprout / Slide / Wipe as PAIR.  
AI_REQUIREMENTS: Debter skips if they only Struck or camped last turn. Orbiter skips if no adjacent barrier **or** the orbit would seal the last path (`findPath` after a hypothetical orbit). Soph 4–6. Until spelled-last-turn exists, this sheet must not ship.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Cast Debt or Brick Orbit can drop that id if missing.  
MAP_REQUIREMENTS: `fortress` courtyard with **one** already-planted barrier that can orbit without sealing the last aisle. Reject cramped 1-tile closets.  
SPECIAL_RULES: Family lottery **off**. Cast Debt: spelled-**last-turn** next-walk +1 AP; Strike last turn does **not** arm it. Brick Orbit: paint-only move of an **already planted** barrier; does not mint a new one from empty floor; solvability skip is mandatory. Honesty reroll → ENC-CRACK-02. Until spelled-last-turn writer lands, show `FSN-SPENT-CRACK`.  
OBJECTIVE: Clear all. Intended: Strike (not spell) the turn before you walk; refuse the orbit if it would close the gallery.  
FAILURE_CONDITION: Player death. Soft fail: if orbit would seal the last aisle, skip the orbit — never soft-lock the portal.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Spelled-last-turn walk tax + orbit barrier. Distinct from ENC-CRACK-02 (walked-last-turn next-spell tax + remove-adjacent-barrier).  
SOLVABILITY_REQUIREMENTS: Exit reachable after every legal orbit. Barrier never on spawn/portal.  
REPLAYABILITY: Barrier clockwise vs counter-clockwise gallery.  
SCALING_BEHAVIOUR: High: add glyph sower junior. Never seal the last aisle. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-WAVE-17

ENCOUNTER_ID: ENC-WAVE-17  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Wave 1: 3× pawn (`physical_attack`). Wave 2: `FSN-GAUNT-STEP` fallback (mender + stepper) **or** `FSN-GAUNT-SIP` if Gaunt Mend already owned. Wave 3: 1× rook (`physical_attack`) + leftover pawn. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR AI (mender skip if leftover ≥ 1; stinger commits on both leftover 0). Wave 3 rook camps the choke via `chokepointCamp` only if AI tier ≥ 3.  
SPELL_DISCOVERY_OPPORTUNITIES: Optional overlay: a dead mender drops `spell-gaunt-mend` if ENC-SPELL-31 was skipped this chain.  
MAP_REQUIREMENTS: One choke (2-tile corridor) between spawn side and a backline alcove. `waveSpawnCells` marked. Exit behind the alcove. Optional last-seam ribbon on the **gallery**, never in the choke.  
SPECIAL_RULES: Portal stays locked until wave 3 is clear. Next wave spawns at the start of the enemy phase after the previous wave is dead, on `waveSpawnCells` only (must be free floor). If a cell is occupied, spill to the nearest free reachable floor. Soft fail: if a wave cannot place any unit, skip that wave and log it. Honesty: missing leftover-pair → wave 2 is ENC-WAVE-16 leftover without claiming Gaunt.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player HP ≤ 0.  
REWARD: Victory XP counts all three waves’ defeated levels. Depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cadence — spend on wave 1, conserve leftover chips for the four-flag healer, then break the choke.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Choke must not isolate the player from the exit after walls finalize. Cap living hostiles so `ENEMY_SUMMON_CAP` is not starved later.  
REPLAYABILITY: Wave 2 rotates `FSN-GAUNT-STEP` / `FSN-GAUNT-SIP` / `FSN-EVEN-ORTH` by seed. Choke side flips.  
SCALING_BEHAVIOUR: Mid: wave 2 gains the named kit. High: wave 3 rook learns `spell-iron-skin`. Peak: add a 2-pawn “echo” wave only if the player’s kill time on wave 1 was under 2 turns (skill-scaled, not level-scaled).  
STATUS: PROPOSED

---

### ENC-AMBUSH-16

ENCOUNTER_ID: ENC-AMBUSH-16  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Overworld / exploration: `WF-ELT-ORTH_PICKET` — one same-tier elite occupies a painted post **only while the player shares that cell’s row or column**. Step off-axis and the post is empty floor (exploration: they leave, no purse). Dungeon / boss rush: they stand from map start — required for map-clear. Distinct from Near Picket (≤3), Mid Picket (ENC-AMBUSH-15: Chebyshev 4–5), Far Picket (≥6), and Spell Picket (after a cast).  
AI_REQUIREMENTS: Elite uses live kit for the piece. No lookahead until engaged. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: elite may carry one `usableByEnemy` extra that ENC-PRIO-18 can teach.  
MAP_REQUIREMENTS: Painted post is floor. Exit reachable without touching. Counts as 1 enemy. Rank/file lines painted.  
SPECIAL_RULES: Appearance keys off sharing the post’s row or column with the player. World contact starts a normal battle. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-AMBUSH-15.  
OBJECTIVE: Fight them (dungeon) or walk past off-axis (exploration).  
FAILURE_CONDITION: Player death in the fight. Walking past is not a fail.  
REWARD: Hard purse via `applyRewards` on victory. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “the picket only exists on the rank or file.” Distinct from ENC-AMBUSH-15 (distance band).  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit reachable without touching. In a run they are present from the start and reachable.  
REPLAYABILITY: Post north file vs east rank.  
SCALING_BEHAVIOUR: High: elite is Even Hood so standing at 2 on the file is a miss. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-16

ENCOUNTER_ID: ENC-REINF-16  
TYPE: reinforcements / waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn. Wave 2 (reinforcement): 1× bishop (`starter-frost`) spawns on `waveSpawnCells` when the first pawn dies — **not** a Sheath File (that is ENC-SHEATH-01). Distinct from ENC-REINF-15 (echo pawn).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Alcove `waveSpawnCells` behind a 2-tile choke. Portal locked until both waves clear.  
SPECIAL_RULES: Reinforcement at the start of the enemy phase after the trigger kill. Occupied cell spills to nearest free reachable floor. `holdPortalLocked` until wave 2 is down.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death. Soft fail: if wave 2 cannot place, skip and log.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce after a kill so bursting the first pawn is a choice, not always correct. Distinct from ENC-SHEATH-01 (sheathed AP lock until adjacent or first dies).  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Living hostiles ≤ 4.  
REPLAYABILITY: Bishop vs queen (frost only) by seed.  
SCALING_BEHAVIOUR: High: wave 2 is Even Hood. Peak: inherit last-seam on the gallery.  
STATUS: PROPOSED

---

### ENC-CURTAIN-01

ENCOUNTER_ID: ENC-CURTAIN-01  
TYPE: map structure / movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) behind a `WF-TER-HUSH_CURTAIN` + 1× pawn on the player’s side.  
AI_REQUIREMENTS: Bishop kites behind the lattice (LoS-block). Pawn charges through it (walk-through). No smash AI.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One hanging lattice occupies a cell: units may **walk through**, but it **blocks LoS**. Adjacent 1 AP parts it until the parting unit is no longer adjacent; then it reseals. Adjacent 2 AP smashes it to floor. Distinct from Frost Pane (smash only), Slide Screen (ENC-SLIDE-02: 1 AP relocates), and Reed Screen (blocks walk, not LoS). Never on spawn/portals.  
SPECIAL_RULES: Part and smash are AP occupancy actions, not spells. No damage. Counts as a wall for LoS until parted or smashed. Honesty reroll → ENC-SLIDE-02. Distinct from queued day-7 `ENC-HUSH-01` (Hush Bearer world-feature room — do not reuse that id).  
OBJECTIVE: Clear all. Intended: walk through and melee the bishop, **or** spend 1 AP to hold it open for a linear shot and stay adjacent.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “walk-through LoS-block; part is a stance, smash is 2 AP.” Distinct from ENC-SLIDE-02 (1-AP cardinal slide).  
SOLVABILITY_REQUIREMENTS: Does not block walk. Map solvable with the lattice still hanging. Never the only cell in a corridor as a wall.  
REPLAYABILITY: Lattice west vs east aisle.  
SCALING_BEHAVIOUR: High: bishop gains `starter-poison`. Never two lattices on the only aisle.  
STATUS: PROPOSED

---

### ENC-DUMP-01

ENCOUNTER_ID: ENC-DUMP-01  
TYPE: map structure / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn on the long path. Short-path corridor cell starts as a wall (`WF-OBS-SPENT_SILL`).  
AI_REQUIREMENTS: Both take the long path. Neither pathfinds through the sill until it is floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Place only when a second spawn→portal route already exists. Evaluate solvability as if the sill were already a wall. Never the only exit. Distinct from Coin Sill (1 AP adjacent to open now), Tally Gate (4 AP spent extra portal), Latch Sill (end-turn adjacent), and Retreat Sill (ENC-RETREAT-01: end-turn ≥5 away).  
SPECIAL_RULES: Wall occupancy until a player end-of-turn with remaining AP === 0. Then floor for the rest of the map. No damage. Honesty reroll → ENC-RETREAT-01. Distinct from queued day-14 `ENC-SPENT-01` (Spent Plate leftover-AP overlay — do not reuse that id).  
OBJECTIVE: Clear all. Optional: dump remaining AP and end the turn to open the short path.  
FAILURE_CONDITION: Player death. Leaving the sill closed is not a fail.  
REWARD: Standard. Overlay `under_8_ap_per_turn` (pairs with the dump).  
TACTICAL_PURPOSE: Teach “empty-AP end-turn opens the short path.” Inverse of ENC-RETREAT-01 (end far away).  
SOLVABILITY_REQUIREMENTS: Long path already spawn→portal. Sill never the only exit.  
REPLAYABILITY: Sill north vs south of the long path.  
SCALING_BEHAVIOUR: High: inherit Act Lock so dumping AP also forbids a leftover walk.  
STATUS: PROPOSED

---

### ENC-EMPTY-01

ENCOUNTER_ID: ENC-EMPTY-01  
TYPE: protection objectives / zone  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn. The font is the contest, not a third body.  
AI_REQUIREMENTS: Bishop may plant on the font if remaining AP is already 0. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-ZON-EMPTY_FONT` basin (first unit to end a turn here this map heals 8% max HP **only if they have 0 remaining AP**; then the tile dries). Inverse of Labor Font (needs 2+ AP spent). Distinct from Alone Font (ENC-PROT-15: heal only if no other living unit is Chebyshev ≤ 3) and Shrine Pool (unconditional). Walkable. Never on spawn/portals.  
SPECIAL_RULES: Zone tick, not a spell. Remaining AP is the unit’s current AP at end of turn. Player HP persist via `saveBattleStats` on the progress lock. Honesty reroll → ENC-PROT-15.  
OBJECTIVE: Clear all. Optional: dump AP then plant for a spent heal, or deny the enemy the basin.  
FAILURE_CONDITION: Player death. Ignoring the font is not a fail.  
REWARD: Standard. Overlay `no_healing` is a natural hard overlay (skip the font).  
TACTICAL_PURPOSE: Contest a spent-AP heal. Distinct from ENC-PROT-15 (alone / isolation heal).  
SOLVABILITY_REQUIREMENTS: Font optional. Map solvable if never used.  
REPLAYABILITY: Font west vs east alcove.  
SCALING_BEHAVIOUR: High: pawn starts closer so denying the font is a fight. Never two fonts.  
STATUS: PROPOSED

---

### ENC-EMPTY-02

ENCOUNTER_ID: ENC-EMPTY-02  
TYPE: movement objectives / teleport pads  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop + 1× pawn. Pads are optional.  
AI_REQUIREMENTS: Neither is required to use the pads. Bishop may dump AP then pad if remaining AP is 0.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Two linked copper-cyan pads (`WF-TEL-EMPTY_STEP`). Entering one for 1 MP exits the other **only if the traveler’s remaining AP is 0**. Otherwise the MP is not spent and you stay. Distinct from Full Step (ENC-FULL-01: ≥80% HP), Wound Step (below 50% HP), and Clear Step (empty dest). Both on floor, not on spawn/portals. The map is solvable without using them.  
SPECIAL_RULES: 1 MP from the unit’s current MP only on a successful 0-AP landing. Not a teleport spell — do not key off `effectCategory`. Honesty reroll → ENC-FULL-01.  
OBJECTIVE: Clear all. Optional: dump AP then spend 1 MP, or stand on the exit to force a swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “pads only fire when you already spent out.” Inverse of ENC-FULL-01 (HP% gate).  
SOLVABILITY_REQUIREMENTS: Map solvable without the pads. Occupied dest swaps.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: High: inherit Act Lock so dumping AP also forbids a leftover walk onto the pad.  
STATUS: PROPOSED

---

### ENC-RUNE-01

ENCOUNTER_ID: ENC-RUNE-01  
TYPE: hazard / trap  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn. Distinct from queued day-14 `ENC-CAST-01` (Cast Oath wager — do not reuse that id).  
AI_REQUIREMENTS: Bishop may occupy the plate and Frost (paying the tax). Pawn does not trigger it (Attack Nearest / Strike).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One visible `WF-TRP-CAST_PLATE` (stepping on it is free; the first `SpellConfig` cast by a unit occupying the plate this map costs that caster 8% max HP once; then the plate becomes floor). Distinct from Glyph Plate (step tax), Echo Plate (first step arms, second taxes), and Spell Picket (elite after any cast). Never hidden. Never on spawn/portals.  
SPECIAL_RULES: Trigger keys off a `SpellConfig` spend while occupying the plate. Attack Nearest and summon kits do not trigger it. Challenge HP. Honesty: missing spell-occupy trigger → skip the plate, keep the fight.  
OBJECTIVE: Clear all. Optional: leave before you spend a spell, or shove a foe onto it then wait for their cast.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the plate taxes the first spell from that cell, not the step.”  
SOLVABILITY_REQUIREMENTS: Walkable before and after. Optional.  
REPLAYABILITY: Plate mid vs flank.  
SCALING_BEHAVIOUR: High: inherit last-seam on a **different** gallery. Never two plates.  
STATUS: PROPOSED

---

### ENC-SURV-31

ENCOUNTER_ID: ENC-SURV-31  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× bishop (`starter-frost`) starting on opposite ranks.  
AI_REQUIREMENTS: Bishops kite on their rank/file so a shade line exists. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: `WF-ENV-FILE_SHADE` armed: at the end of each combatant turn, if they do **not** share a row or column with a living enemy-side unit they pay 3% max HP. Painted shade lines sit on every hostile’s rank and file. Inverse of File Wind (tax **on** a shared file). Distinct from Hunt Draft (ENC-SURV-29: Chebyshev 3 ring), Isolation Chill (any living unit within 3), and Exposed Line (LoS to two bodies). Skip if the map would start with zero enemy-side units.  
SPECIAL_RULES: End-of-turn challenge HP. Enemy-side only — player-side summons do **not** shelter. No skipped turns. Honesty reroll → ENC-SURV-29. Clock: 8 player turns; portal still locked until hostiles are down (`holdPortalLocked` not required because hostiles remain).  
OBJECTIVE: Survive 8 turns **or** clear both (clear wins early). Intended: end turns on a painted rank or file.  
FAILURE_CONDITION: Player death. Surviving 8 turns with hostiles alive still unlocks the portal only after they die — this is not a timer-unlock room.  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Pressure by **leaving** the file, not by standing on it. Distinct from ENC-SURV-29 (tax if far from hostiles).  
SOLVABILITY_REQUIREMENTS: Tax is not a wall. Both bishops reachable. Shade lines painted.  
REPLAYABILITY: Bishops N-S ranks vs E-W files.  
SCALING_BEHAVIOUR: Peak: add a pawn on a third file. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-32

ENCOUNTER_ID: ENC-SURV-32  
TYPE: survival / optional wager  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× rook + 1× pawn.  
AI_REQUIREMENTS: Rook body-blocks. Pawn charges.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Open court. `WF-EVT-CLOSE_HOUR` overlay: if the player ended at least one turn at Chebyshev ≤ 1 from a living hostile, the next `applyRewards` uses the hard multiplier. Inverse of Far Hour (ENC-FAR-01: hard if you **never** end adjacent). Distinct from Clash Cache (open in melee). No blocks.  
SPECIAL_RULES: Adjacent means Chebyshev ≤ 1 from a living enemy-side combatant at player end-of-turn. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Honesty: missing adjacent-end-turn flag → room still plays as a kill fight without the wager.  
OBJECTIVE: Clear all. Optional: plant adjacent at least once for a hard purse, or kite and accept normal rewards.  
FAILURE_CONDITION: Player death. Never planting is not a fail.  
REWARD: Standard, or hard multiplier if the flag armed. Overlay none (the wager *is* the challenge).  
TACTICAL_PURPOSE: Opt-in melee plant for a purse. Inverse of ENC-FAR-01 / ENC-SURV-30.  
SOLVABILITY_REQUIREMENTS: Leaving is always legal. Hostiles reachable.  
REPLAYABILITY: Rook west vs east.  
SCALING_BEHAVIOUR: High: rook learns iron-skin so planting is a real hit. Never two hour overlays.  
STATUS: PROPOSED

---

### ENC-PROT-16

ENCOUNTER_ID: ENC-PROT-16  
TYPE: protection objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn racing the player to `WF-ZON-EMPTY_FONT`. Optional 1-HP player-side summon is legal to dump AP and plant.  
AI_REQUIREMENTS: Bishop plants on the font if remaining AP is 0 this turn. Pawn may shove the player off. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Same basin as ENC-EMPTY-01, plus a second approach so the player can contest. Inherit last-seam on a **gallery** (`inheritHazardsFrom: ENC-TEACH-16`) so dumping MP to reach it is a second question.  
SPECIAL_RULES: First empty-AP end-turn on the font drinks and dries. If the enemy drinks, the player still wins by killing — the font is optional. Honesty reroll → ENC-PROT-15.  
OBJECTIVE: Clear all. Optional: drink after dumping AP; deny the enemy the basin.  
FAILURE_CONDITION: Player death. Enemy drinking is not a fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Protect / contest a spent-AP heal under a last-stride tax. Combine teach + zone.  
SOLVABILITY_REQUIREMENTS: Two approaches. Font not on the only aisle. Seam not a wall.  
REPLAYABILITY: Font alcove flips.  
SCALING_BEHAVIOUR: High: pawn starts adjacent to the font. Never a third body.  
STATUS: PROPOSED

---

### ENC-PRIO-18

ENCOUNTER_ID: ENC-PRIO-18  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-ORTH_TUTOR` — one same-tier enemy (medium) carries 1 extra `usableByEnemy` spell (prefer `starter-frost` if the player lacks it; else `spell-even-hood` if missing; else `starter-poison`). Plus 1× pawn decoy.  
AI_REQUIREMENTS: Tutor kites on a rank/file. Pawn greedy. No lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player ends a turn **sharing a row or column** with the tutor while they still live, the player gains that spell id as a **single remaining cast** this map. Killing them before that file teach grants the purse but not the one-cast. Distinct from Close Tutor (ENC-PRIO-17: end turn adjacent), Range Tutor (end turn 4+ away), and Mark Tutor (adjacent 1 AP then LoS).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable. Rank/file lines painted.  
SPECIAL_RULES: One-cast does not call `upgradeSpell` and does not persist `spellLevel*` arrays. Honesty reroll → ENC-PRIO-17.  
OBJECTIVE: Clear all. Optional: plant on their file for the teach then leave; burst-kill if you want the purse more than the cast.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional one-cast. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Priority-target with a file-teach, not a melee-teach. Distinct from ENC-PRIO-17 (Chebyshev ≤ 1).  
SOLVABILITY_REQUIREMENTS: Tutor reachable. In a run they count as hostiles for map-clear.  
REPLAYABILITY: Extra spell rotates among missing ids.  
SCALING_BEHAVIOUR: High: tutor is Even Hood so planting on the file at range 2 is a miss — step to 1 on the file.  
STATUS: PROPOSED

---

### ENC-SHEATH-01

ENCOUNTER_ID: ENC-SHEATH-01  
TYPE: priority-target / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-SHEATH_FILE` — two extra same-tier elites share a painted file. The second (sheathed pennant) cannot spend AP on spells or Attack Nearest until the first is dead **OR** the player ends a turn adjacent to the sheathed one. Distinct from Sleeping Vanguard (both world-asleep until touch), Gap File (ENC-GAP-01: −threat while bonded elites are Chebyshev ≥ 4 apart), and Paired File (−20% incoming while both live).  
AI_REQUIREMENTS: Live elite uses the kit. Sheathed elite is occupancy-locked until wake. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Painted file with two posts. Add enemies only up to `MAX_ENEMIES`. Skip if the roster cannot fit 2. In dungeon / boss rush they count as hostiles for map-clear.  
SPECIAL_RULES: Sheathed AP lock is occupancy/turn state, not a buff spell. Extra spells from `usableByEnemy` only. Honesty reroll → ENC-GAP-01.  
OBJECTIVE: Burst the live one before the sheath wakes, plant adjacent to wake both, or (exploration) walk to a portal and leave.  
FAILURE_CONDITION: Player death. Leaving without engaging is legal in exploration.  
REWARD: Hard reward multiplier via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Priority-target with a sheathed second. Distinct from ENC-GAP-01 (spacing threat).  
SOLVABILITY_REQUIREMENTS: Both posts floor. Exit reachable. Living hostiles well under cap.  
REPLAYABILITY: Live pennant north vs south of the file.  
SCALING_BEHAVIOUR: High: live elite is Gaunt Stinger. Never three pennants.  
STATUS: PROPOSED

---

### ENC-PAIR-04

ENCOUNTER_ID: ENC-PAIR-04  
TYPE: elite-adjacent / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PAIR-GIFT` — 1× `pair_gaiter` bishop (`physical_attack` + `spell-pair-gait`) + 1× `still_gifter` queen (`spell-still-gift` + `starter-shield`) + 1× `coil_arbiter` king (Slow + Frost, **no drain** on BASE). Never PAIR Pair Gait with Pair Purse / Gaunt Sting / Lone / Dry / Ready. Never PAIR Still Gift with Gaunt Mend / Still Mend / Dry Gait.  
AI_REQUIREMENTS: Gaiter lurks at 3 and commits when leftover MP is exactly 2 **or** HP% ≤ 40. Gifter Gifts only if the target spent 0 walk MP **and** missing HP ≥ 8; else Shields. Arbiter Slow first (`AI-TEM-04`: no second Slow). Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Pair Gait or Still Gift can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena`. Gaiter needs a flank path that is not the only exit. Gifter needs a retreat tile. No Time Warp. No Glass Realm.  
SPECIAL_RULES: Family lottery **off**. Pair Gait: 10 + 8 iff **target** leftover MP at resolve is **exactly 2**. Leftover 0, 1, or ≥ 3 is 10 only. Still Gift: heal 8 iff the **target** spent 0 walk MP this turn. Caster may have walked. Cap Slow at −2 MP. Honesty reroll → ENC-PAIR-03. Drain Courage stays off BASE.  
OBJECTIVE: Defeat all. Intended: spend leftover MP to 1 or 0, sit at 3+, **or** walk the wounded body 1 MP.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Exact-2 walk-MP poke + target-camp heal. Distinct from ENC-PAIR-03 (leftover **AP** exactly 2 / leftover-AP=0 heal).  
SOLVABILITY_REQUIREMENTS: Flank path reachable; three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Gaiter west vs east. Variant `FSN-PAIR-GIFT/DRAIN` only after `FSN-RIFT-KNOT` has been seen.  
SCALING_BEHAVIOUR: Peak: inherit last-seam on a gallery. Never Gaunt Mend on this id.  
STATUS: PROPOSED

---

### ENC-HOLD-05

ENCOUNTER_ID: ENC-HOLD-05  
TYPE: elite encounters / mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-GAUNT-HOLD` — 1× `gaunt_holder` pawn or knight (`isLeader`, `spell-gaunt-hold` + `physical_attack`) + 1× `must_gaunter` knight (`spell-must-gaunt` + `physical_attack`) + 1× `ROLE-WARDEN` rook (`iron_golem` overlay legal, Shield / Iron Skin). Optional fourth: Even Hood junior **or** omit. Never PAIR Gaunt Hold with Lean Hold / Hold Knight / Rite / Tool / Boot / Must Gaunt as a two-body.  
AI_REQUIREMENTS: Hold skips if leftover MP already 0 **and** leftover AP already equals Strike cost; gate on `isPhysical === true`, never `spell.name`. Must-Gaunt skips if leftover MP already 0 **and** leftover AP already equals next spell cost. Warden interposes with a **gap**. Never all three on turn 1 against a full-HP player who has not acted. `escapeRoute` (6) on. `bottleneckControl` (8) only if a gallery exists. InstantKill / betrayal off. Root stays off. Soph 6–8.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Hold or Must Gaunt can drop that id if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `openField` with cover pillars. Never a closed ring. Weight 0 on cramped 1-tile closets. Player must have a tile that is **off** the warden axis **and** ≥ 2 walk-offs.  
SPECIAL_RULES: Family lottery **off**. Gaunt Hold: cannot confirm Strike unless leftover walk MP = 0 **and** leftover AP **before paying Strike equals Strike’s AP cost**. Must Gaunt: remaining **non-Strike** spells confirm-fail unless leftover walk MP = 0 **and** leftover AP **after paying that spell** would be 0. Leader boost 10% × fallen escort. Dungeon depth may not add a fifth hostile to this id. Honesty reroll → ENC-HOLD-04. Teaching variant `FSN-GAUNT-HOLD/LANE` drops optional Hood. Hold `FSN-GAUNT-HOLD/OCT` while remaining cap < 8.  
OBJECTIVE: Defeat all. Intended: dump leftover MP **and** spend last AP (both locks peel), live on waiting, kill Hold, or blink / Swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + mastery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Court-scale leftover-MP **and** last-AP lock without `instantKill`. Distinct from ENC-HOLD-04 (Strike refuse until leftover MP = 0 **only**).  
SOLVABILITY_REQUIREMENTS: Gallery walk-off. Never a closed ring. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Hold chassis pawn vs knight. Hood on/off.  
SCALING_BEHAVIOUR: Do not add a fifth body. Tighten by leaving the Hood on, not HP. Never Root.  
STATUS: PROPOSED

---

### ENC-LONE-02

ENCOUNTER_ID: ENC-LONE-02  
TYPE: elite-adjacent / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LONE-AXIS` — 1× `lone_biter` knight (`physical_attack` + `spell-lone-bite`) + 1× `axis_cutter` bishop (`physical_attack` + `spell-leash-cut`) + optional brood overlay **off** while `ENEMY_SUMMON_CAP` is 2 if a third summon engine would exceed cap. Never PAIR Lone Bite with Foe Bite / Side Bite / Lone Sting. Never PAIR Axis Cut with Escort / Leash / Pet / Banner Cut.  
AI_REQUIREMENTS: Biter skips if any living unit of any side is Chebyshev 1 of the target; caster counts. Cutter skips if no allied summon on the **handler’s** rank or file. Dummy Post is not a pet. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Lone Bite or Axis Cut can drop that id if missing.  
MAP_REQUIREMENTS: `openField` with room to stand isolated **or** adjacent to a pet. Reject a 1-tile closet (forced isolation).  
SPECIAL_RULES: Family lottery **off**. Lone Bite: bonus iff the target is isolated from **all** units. Axis Cut: bonus vs handler-on-**rank-or-file** with a pet. Honesty reroll → ENC-ESCORT-01. Brood overlay waits if cap would exceed 2.  
OBJECTIVE: Defeat all. Intended: stand next to a summon or the biter; keep pets off the handler’s rank/file.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Isolation from **all** units + handler-on-file cut. Distinct from ENC-ESCORT-01 (adj-hostile-to-target bite + handler-with-pet-in-2).  
SOLVABILITY_REQUIREMENTS: Room to stand isolated **and** bunched. Two walk-offs.  
REPLAYABILITY: Biter west vs east. Brood on only if cap allows.  
SCALING_BEHAVIOUR: High: cutter is the leader. Never two isolation engines.  
STATUS: PROPOSED

---

### ENC-ELITE-30

ENCOUNTER_ID: ENC-ELITE-30  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GAUNT-CHOIR` — 1× `gaunt_mender` queen (`spell-gaunt-mend` + `starter-shield`) + 1× `verse_gaunter` bishop (`starter-frost` + `spell-verse-gaunt`) + 1× ignite junior (`ember_knight` overlay legal, no second heal). Never PAIR Verse Gaunt with Verse Lean / Verse Pace / Last Mute. Never PAIR Gaunt Mend with Dry / Still / Heave / Both / Bar / Gift.  
AI_REQUIREMENTS: Mender skip if any leftover ≥ 1. Verse skips if no `lastResolvedSpellId`. Ignite holds until the choir has taught the leftover-0 window. Soph 3–4. Until `lastResolvedSpellId` exists, show `FSN-IMPRINT-CHOIR` (ENC-IMPRINT-01) instead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Gaunt Mend or Verse Gaunt can drop that id if missing.  
MAP_REQUIREMENTS: `arena` with cover pillars. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Verse Gaunt: last-id illegal until leftover AP = 0 **and** leftover MP = 0. Forced-move does **not** peel Verse Gaunt. Honesty reroll → ENC-IMPRINT-01. Pad-then-verse variant `FSN-GAUNT-CHOIR/LAG` is BRIGADE, not a two-CD PAIR.  
OBJECTIVE: Defeat all. Intended: keep 1 leftover chip so Mend is 0 **and** Verse stays on; or dump both leftover pools to peel Verse and accept the 8.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Four-flag heal + last-id until both leftover 0. Distinct from ENC-IMPRINT-01 (copy matching CDs / last-id until leftover **MP** = 0).  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves an exit. Hostiles start ≥ 4 apart.  
REPLAYABILITY: Verse west vs east. Lag variant after this BASE is answered.  
SCALING_BEHAVIOUR: Peak: inherit last-seam. Never two last-id engines.  
STATUS: PROPOSED

---

### ENC-ELITE-31

ENCOUNTER_ID: ENC-ELITE-31  
TYPE: elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Branch skin. Default / gaunt: `FSN-GAUNT-QUIET` — Gaunt Step + Gaunt Mend + cover. Even: `FSN-GAUNT-COURT` — Gaunt Sting + Bare Sip + Odd Hold. Brick: `FSN-STILL-GRACE` — camped-target heal + next-own skip CD + once. Orth: `FSN-ORTH-TRI/FAR` if ENC-TRI-01 was taught, else `FSN-EVEN-ORTH/GUN`.  
AI_REQUIREMENTS: Named formation AI. Cover / Hold / Grace skip-locks as in the formation sheet. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing the named CORE can drop it if missing.  
MAP_REQUIREMENTS: Formation `MAP_REQUIREMENTS`. Inherit one taught device from the branch (last-seam / rich-cinder / hush / orth aisle) on a **gallery**.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover-pair / even-hood / start-turn occupy / orth-walk → convert to ENC-ELITE-28 leftover without claiming the day-16 verb.  
OBJECTIVE: Defeat all.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Branch-skinned elite using the taught pack. Distinct from ENC-ELITE-28 / ENC-ELITE-29 (Dry / Lean / Odd / Void).  
SOLVABILITY_REQUIREMENTS: Formation solvability plus inherited device not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Peak: promote Quiet to Court or Court to Hold. Never a fifth body on Quiet.  
STATUS: PROPOSED

---

### ENC-RARE-16

ENCOUNTER_ID: ENC-RARE-16  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-GAUNT-HOLD` (ENC-HOLD-05) as an **insert** on depth 4, not a replacement beat. 8% on depth 4 after the account has answered ENC-GAUNT-01 **and** ENC-HOLD-04. Oct Plug (`FSN-GAUNT-HOLD/OCT`) stays **off** while remaining cap < 8. Bounce Ring (`FSN-GAUNT-HOLD/BOUNCE`) may replace optional Hood if the account already answered ENC-BARE-01.  
AI_REQUIREMENTS: Same as ENC-HOLD-05.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-HOLD-05.  
MAP_REQUIREMENTS: Same as ENC-HOLD-05. Never a closed ring.  
SPECIAL_RULES: Insert, do not replace mastery. `holdPortalLocked` until the COURT is down. Honesty reroll → ENC-RARE-15.  
OBJECTIVE: Defeat the rare COURT.  
FAILURE_CONDITION: Player death.  
REWARD: Rare multiplier via `applyRewards` (hard). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Optional peak leftover-pair exam. Distinct from ENC-RARE-15 (Lean Hold).  
SOLVABILITY_REQUIREMENTS: Same as ENC-HOLD-05.  
REPLAYABILITY: Hood vs Bounce Ring vs Lane (no fourth).  
SCALING_BEHAVIOUR: Do not add Oct. Tighten by Bounce Ring, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-16

ENCOUNTER_ID: ENC-TREAS-16  
TYPE: treasure/risk rooms  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop + 1× pawn still on the board (the chest is not a third hostile).  
AI_REQUIREMENTS: Bishop kites on a rank/file so a line can be shared. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible `WF-TRS-LINE_CACHE` chest. 1 AP adjacent opens it **only while a living hostile shares the player’s row or column**: a medium `applyRewards` grant and no guardian. Distinct from Clash Cache (hostile Chebyshev ≤ 1), Watch Cache (no hostile within 3), and Hire Cache (allied summon adjacent to the chest). Adjacent-open, not a wall. Optional.  
SPECIAL_RULES: AP cost, not a spell. Hostile means living enemy-side sharing the player’s row or column. Credits via persist-lock `applyRewards`. Failed open spends AP only. Optional last-seam ribbon on a **gallery**.  
OBJECTIVE: Clear all. Optional: open while a foe is on your rank or file, pull one onto the line then spend 1 AP, or walk past.  
FAILURE_CONDITION: Player death. Skipping the chest is not a fail.  
REWARD: Standard kill + optional medium grant. No overlay (the chest *is* the challenge).  
TACTICAL_PURPOSE: Treasure that wants a shared file, not melee. Distinct from ENC-TREAS-15 (even-round devices).  
SOLVABILITY_REQUIREMENTS: Chest not a wall. Map solvable if never opened.  
REPLAYABILITY: Chest west vs east of the painted file.  
SCALING_BEHAVIOUR: High: bishop is Even Hood so sharing the file at range 2 is a miss — open from Chebyshev 1 on the file.  
STATUS: PROPOSED

---

### ENC-PLANT-01

ENCOUNTER_ID: ENC-PLANT-01  
TYPE: optional challenge / rest-adjacent wager  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: None required on the inlay map; if a fight follows, the next room’s roster.  
AI_REQUIREMENTS: None on the inlay.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Optional `WF-RSK-PLANT_OATH` rooted slate inlay. End a turn on it to flag this map. If the next `applyRewards` happens while the player’s remaining MP is 0, that credit uses the hard multiplier. If they still have leftover MP at credit, the flag pays nothing extra. Distinct from Stillness Oath (any MP spend after the flag clears it), Scar Oath (ENC-SCAR-01: below 50% HP at credit), and Stride Oath (must have walked). Optional floor tile. Map is solvable if never used.  
SPECIAL_RULES: MP check is remaining MP at the `applyRewards` enqueue. Multiplier on the next enqueue only. Death still uses `saveBattleStats`. Walking after the flag is legal — only the credit-time remainder matters.  
OBJECTIVE: Optional: flag a fight you will cash out planted, or stay unflagged and keep leftover MP.  
FAILURE_CONDITION: None on the inlay. Next-room death is Death Realm.  
REWARD: Hard multiplier **or** nothing extra. No overlay.  
TACTICAL_PURPOSE: Opt-in leftover-MP=0 wager. Distinct from ENC-SCAR-01 (HP%) and ENC-FAR-01 (never adjacent).  
SOLVABILITY_REQUIREMENTS: Optional. Not on spawn or a portal.  
REPLAYABILITY: Inlay west vs east of spawn.  
SCALING_BEHAVIOUR: Rest/treasure only. Never a required dungeon tax.  
STATUS: PROPOSED

---

### ENC-CLOSE-01

ENCOUNTER_ID: ENC-CLOSE-01  
TYPE: optional challenge / wager  
RELATIVE_DIFFICULTY: MID (opt-in)  
ENEMY_COMPOSITION: Uses the next room’s roster (typically ENC-TREAS-16 or ENC-MAST-16).  
AI_REQUIREMENTS: Next room.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-CLOSE_HOUR` overlay on the next fight (same mechanic as ENC-SURV-32, offered from rest as a **choice** rather than a forced overlay). Inverse of ENC-FAR-01.  
SPECIAL_RULES: Rest shrine can enable `closeHourArmed` on the next dungeon room. Never on rest combat (rest has no hostiles).  
OBJECTIVE: Choose to plant adjacent once in the next fight for a hard purse.  
FAILURE_CONDITION: Next-room death. Declining the overlay is not a fail.  
REWARD: Hard multiplier if armed and planted.  
TACTICAL_PURPOSE: Rest-offered melee wager. Distinct from ENC-SURV-32 (forced overlay on a scripted survival room).  
SOLVABILITY_REQUIREMENTS: Overlay does not block.  
REPLAYABILITY: On/off from rest.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-REST-16

ENCOUNTER_ID: ENC-REST-16  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional plant / close-hour shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-17 / ENC-GAUNT-01 / ENC-EVEN-02 observed Gaunt Mend / Even Hood / Orth Stride, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-ORTH_TUTOR` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-16. Optional `WF-RSK-PLANT_OATH` tile (flag next room only). Optional `WF-PRT-VOW_GATE` as a **bonus gamble exit** (rest/overworld only — not an exit until the player ends a turn adjacent; never the only portal). White sanctuary portal colocates with spawn.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Plant does not start combat. `uiLayout` unchanged. After one full Table M clear, shrine can enable day-16 `rushVariant` flags (`wick_march`, `dry_eternal`, `hearth_cover`, `must_bias`).  
OBJECTIVE: Choose an exit. Optional: shrine, plant, vow gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Plant is a modifier flag, not a Doka mint. Vow Gate bonus via `applyRewards` on the persist lock.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Gaunt-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and plant pass punch-roster / portal reachability. Vow Gate always in addition to a reachable stable portal. Plant not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Vow on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-16

ENCOUNTER_ID: ENC-BRANCH-16  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Destinations are other IDs, not extra foyer bodies.  
AI_REQUIREMENTS: Foyer pawn greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four locked-until-step portals labeled by **metadata** `branch: gaunt | even | brick | orth` (never by display name). Snapshot the chosen flag **before** `cleanupMap`. Destinations: gaunt → ENC-GAUNT-01 or ENC-SPELL-31, even → ENC-EVEN-02 or ENC-SPELL-32, brick → ENC-WAKE-01 or ENC-GATE-03, orth → ENC-TRI-01 or ENC-ALMS-01. A sealed fifth door to ENC-RARE-16 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: gaunt | even | brick | orth` on the dungeon snapshot. Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-16 / ENC-BOSS-16). Day-15 `ENC-BRANCH-15` stays dry/lean/odd/void. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer. Foyer death is Death Realm.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Dry / Lean / Odd / Void.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Sheath File door (ENC-SHEATH-01) can replace Even for accounts that already finished Even this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band. High: foyer pawn is an Orth Picket (ENC-AMBUSH-16) so lingering to read doors is a fight. Never a sixth door.  
STATUS: PROPOSED

---

### ENC-MINI-17

ENCOUNTER_ID: ENC-MINI-17  
TYPE: mini-bosses  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `BOSS_IDS` only. Default: `starved_vampire_pawn` (spent / empty-AP adjacent). Branch gaunt: `starved_vampire_pawn`. Branch even: `midnight_bishop`. Branch brick: `alabaster_fortress`. Branch orth: `bone_cavalier`. Do **not** use `wick_exorcist` / `dry_nuncio` / `hearth_legate` / `must_preceptor`. Not a dual-boss. No phase-2 table beyond the live kit.  
AI_REQUIREMENTS: Existing boss kits. No Table N directors. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: Live discoverables on that `BossId` only.  
MAP_REQUIREMENTS: Arena matching the live boss sheet. Inherit one taught device from the branch (last-seam / hush-curtain / one barrier gallery / orth aisle) on a **gallery**, never on the boss tile.  
SPECIAL_RULES: Single boss. Dual-boss dungeon capstones stay Rush-only. Honest to pacing: at 30% HP the lieutenant-feel extra (one extra Even Hood consume / one extra Gaunt Mend) only if the chain taught that verb.  
OBJECTIVE: Defeat the mini-boss.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-lite using a live id plus one taught verb.  
SOLVABILITY_REQUIREMENTS: Boss reachable. Inherited device is not a cut-vertex.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Do not add a second boss. Tighten by device timing, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-16

ENCOUNTER_ID: ENC-BOSS-16  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Gaunt → `starved_vampire_pawn`; Even → `midnight_bishop`; Brick → `alabaster_fortress`; Orth → `bone_cavalier`. If the chain taught Orth Picket (ENC-AMBUSH-16) **and** Even was not taken, Ice/Hex-mixed accounts may use `pale_archbishop` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** use Table N ids.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-17) or sheath (ENC-SHEATH-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Gaunt may inherit 2 last-seam tiles off the only path; Even may inherit room to stand at 1/2/3 plus an orthogonal aisle; Brick may inherit one barrier gallery (not a sealed pocket); Orth may inherit hush curtain on a gallery.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (spent drain / curse-reflect / fortress walls / charge-on-file).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-16

ENCOUNTER_ID: ENC-MAST-16  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on last-seam (`WF-HAZ-LAST_SEAM`). Wave 2: `FSN-GAUNT-STEP` **or** `FSN-GAUNT-SIP` **or** `FSN-EVEN-ORTH` **or** `FSN-BRICK-WAKE` by `branch`. Wave 3: elite leftover (E-STEP stepper **or** E-STING stinger **or** Hood elite **or** Reeler elite) + leftover.  
AI_REQUIREMENTS: Wave AI as ENC-WAVE-17 plus the named PAIR. Soph 4–6 on wave 3. InstantKill / betrayal off.  
SPELL_DISCOVERY_OPPORTUNITIES: None new if the chain already observed the CORE; else the wave-2 glyph may still drop.  
MAP_REQUIREMENTS: Choke + gallery. Last-seam on the gallery, never in the choke. Branch skins add hush / barrier / orth aisle / act-lock on a **second** gallery. Portal locked until wave 3 is clear.  
SPECIAL_RULES: Three waves. Living hostiles ≤ 4. Honesty: missing leftover-pair / even-hood / brick-reel → wave 2 is ENC-MAST-15 leftover without claiming Gaunt.  
OBJECTIVE: Clear all three waves. Prove the taught verb under a last-stride tax.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery XP/Doka via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Final exam before the capstone. Branch-skinned.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` reachable. Seam not a wall. Inherited device not a cut-vertex.  
REPLAYABILITY: Four branch skins. Wave-3 elite chassis rotates.  
SCALING_BEHAVIOUR: Do not add a fourth wave. Tighten by Act Lock on the gallery, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-59

ENCOUNTER_ID: ENC-RUSH-59  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room N0 remix: `wick_exorcist` + `march_prefect` as Table N `N0`. Combined mechanic remains: the required pace **is** the detonating walk. Stand and Strike, or spend the 2-step and eat 10. Pulpit **never** occupies the Cresset. Forced-move is not walk MP (Must Pace does not consume; Gait Wick does not detonate). Not Sole / Infirm / Stride / Peel / Toll.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-TEACH-16 / ENC-HAZ-32, a **painted last-stride pip** (visual only) shows which walk would dump leftover MP onto the wick — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Gait Wick cannot last past consume or 2 of the target’s turns. Do **not** grant Boot Sting, Post Sting, Fuse Tile, or Pit Wick.  
MAP_REQUIREMENTS: Preferred cells. Pulpit never on Cresset. Last-stride overlay must not sit on portals.  
SPECIAL_RULES: `rushVariant: wick_march`. Unlock: one complete clear of Table M (M0–M3). **New table**, new `roomIndex` namespace `N0`. Do **not** overwrite `BOSS_RUSH_ROOMS` or Tables B–M.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table N room 0 table.  
TACTICAL_PURPOSE: Add the last-stride readability the Gaunt primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Pulpit never on Cresset.  
REPLAYABILITY: Last-stride pip N vs S of Cresset.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten Wick min (stay next walk MP), not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-60

ENCOUNTER_ID: ENC-RUSH-60  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room N1 remix: `dry_nuncio` + `eternal_pawn_king` as Table N `N1`. Combined mechanic remains: keep **1 AP** through the drain, or the sting is 20. Advance stones **never** occupy the Cruet. Drain Courage debit is **their** AP, then leftover is re-read. Not Surplus / Lend / Levy.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-BARE-01 / ENC-GAUNT-01, a **painted leftover-AP pip** (visual only) shows whether the next sting is 12 or 20 — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Dry Sting cannot target allies. Do **not** grant Empty Plate, Purse Cut, Post Sting, or Lone Sting.  
MAP_REQUIREMENTS: Preferred cells. Stones never on Cruet.  
SPECIAL_RULES: `rushVariant: dry_eternal`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table N room 1 table + tiny bonus if leftover AP stayed ≥ 1 through the drain (skill).  
TACTICAL_PURPOSE: Add the leftover-AP tell the Gaunt primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells reachable. Stones never on Cruet.  
REPLAYABILITY: Stones west vs east of Cruet.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by leftover-AP pip, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-61

ENCOUNTER_ID: ENC-RUSH-61  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room N2 remix: `hearth_legate` + `cover_hospitaller` as Table N `N2`. Combined mechanic remains: he joins the martyr; your **next hit** goes to the extra. Bier dest **never** occupies the Andiron. Occupy the landing **or** Strike the extra. Not Yoke / Orbit / Hinge / Grandmaster / Morrow / Jostle / Bait / Goad / Cord.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-GAUNT-01, a **painted Chebyshev-1 ring** (visual only) around the extra shows legal Home Step dests — occupancy, **not** `isSwap`.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Home Step cannot target hostiles. Do **not** grant Hinge Step, Morrow Step, Cover Step, or Swap.  
MAP_REQUIREMENTS: Preferred cells. Bier never on Andiron.  
SPECIAL_RULES: `rushVariant: hearth_cover`. Home Step dests are occupancy. No free adj = fizzle, AP spent.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table N room 2 table.  
TACTICAL_PURPOSE: Add the join-dest readability the Gaunt Step primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + join dests reachable. Bier never on Andiron. Player keeps ≥ 1 walk-off after a legal dest.  
REPLAYABILITY: Andiron N vs S.  
SCALING_BEHAVIOUR: Do not add a third boss. Dest stays occupancy, not swap.  
STATUS: PROPOSED

---

### ENC-RUSH-62

ENCOUNTER_ID: ENC-RUSH-62  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Room N3 remix: `must_preceptor` + `bias_prebendary` as Table N `N3`. Combined mechanic remains: the only legal walks are diagonal **1,1** (Manhattan 2 **and** diagonal). Quoin dest **never** occupies the Ell. Cardinal 2-steps are Bias-illegal; 1-steps are Must-illegal. Stand / Swap / forced-move still answer. Not Sole / Lock / Fosse / Palisade / March.  
AI_REQUIREMENTS: Existing combined mechanic. If the account learned ENC-TRI-01 / ENC-EVEN-02, a **painted 1,1 diamond** (visual only) shows the only legal walks — no new formula.  
SPELL_DISCOVERY_OPPORTUNITIES: None. Player Must Span cannot last past the target’s current turn. Do **not** grant Must Pace, Rank Lock, or Diag Lock. Illegal walk spends 0 MP.  
MAP_REQUIREMENTS: Preferred cells. Quoin never on Ell. Diamond overlay must not sit on portals.  
SPECIAL_RULES: `rushVariant: must_bias`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table N room 3 table + tiny bonus if the player Striked from the diamond without walking (skill).  
TACTICAL_PURPOSE: Add the walk-shape exam the Orth primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + diamond tiles reachable. Quoin never on Ell. At least one floor dest remains (stand / Swap / forced-move).  
REPLAYABILITY: Diamond N vs S of Ell.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten Bias dests, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain O — “Gaunt Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-16 then ENC-SPELL-31 (or ENC-SPELL-32 if Gaunt Mend already owned) |
| 2 | Reinforce | ENC-WAVE-17 |
| 3 | Combine | ENC-HAZ-31 then ENC-GAUNT-01 **or** ENC-BARE-01 **or** ENC-EVEN-02 |
| 3 insert | Choice | ENC-BRANCH-16 → Gaunt/Even/Brick/Orth destinations |
| 4 | Pressure | ENC-SURV-31 **or** ENC-PROT-16 **or** ENC-SHEATH-01 **or** skip via ENC-REST-16 |
| 4 | Mastery | ENC-MAST-16 (branch skin) |
| 5 | Boss | ENC-BOSS-16 |

Rare: 8% on depth 4 to **insert** ENC-RARE-16 before mastery.  
Treasure: rest may offer ENC-TREAS-16 instead of PROT-16.  
Brick side-story: replace combine with ENC-WAKE-01 and mini-boss ENC-MINI-17; capstone may become `alabaster_fortress` if Brick was the door.

### Chain P — “File Primer” (maxDepth 4)

ENC-CURTAIN-01 → ENC-DUMP-01 → ENC-EMPTY-02 → ENC-REST-16 → ENC-BOSS-16 (`bone_cavalier` only if Orth was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-CURTAIN-01 as teach on accounts that already know last-seam / leftover-pair.

### Rush injection (day-16)

After one full Table M clear, ENC-REST-16 shrine can enable: N0 → ENC-RUSH-59, N1 → ENC-RUSH-60, N2 → ENC-RUSH-61, N3 → ENC-RUSH-62. Day-1…day-15 flags for rooms 0–9 and Tables B–M remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-16, ENC-SPELL-31, ENC-SPELL-32 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-31, ENC-GLYPH-01, ENC-EMPTY-02, ENC-RUNE-01 | `under_50_damage` |
| ENC-HAZ-32, ENC-WAVE-17 | `under_10_turns` / `under_15_turns` |
| ENC-PROT-16, ENC-MAST-16, ENC-CURTAIN-01, ENC-LONE-02 | `direct_hit` |
| ENC-GAUNT-01, ENC-BARE-01, ENC-ELITE-30, ENC-ELITE-31, ENC-WAKE-01, ENC-ALMS-01, ENC-SHEATH-01, ENC-HOLD-05 | `under_8_ap_per_turn` |
| ENC-SURV-31, ENC-EMPTY-01 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-16 / ENC-REST-16 plant / ENC-PLANT-01 / ENC-CLOSE-01 / ENC-SURV-32 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | `last_seam` or 1 rich cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | last-seam **or** cast plate | kill + optional glyph |
| MID | named drop-15 `FSN-*` or waves | backline guard | zone 1 + Gaunt Mend / Even Hood | one `WF-*` | clock / tags / gate |
| HIGH | elite or sheath file | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / wake / leftover-MP miss |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / rush N0–N3 |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit last-seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. Plant / Close Hour / Line Cache stay opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-15 fields plus:

```
encounterId
encounterType        // + gaunt_step | gaunt_sip | even_orth | brick_wake | gaunt_gate |
                     //   orth_tri | glyph_full | gait_watch | gaunt_choir | gaunt_court |
                     //   gaunt_quiet | still_grace | lone_axis | debt_orbit | pair_gift |
                     //   gaunt_hold | last_seam | rich_cinder | cast_plate | hush_curtain |
                     //   spent_sill | empty_font | empty_step | sheath_file | orth_picket |
                     //   line_cache | orth_tutor | plant_oath | act_lock | close_hour | file_shade
formationId?         // FSN-GAUNT-STEP | FSN-GAUNT-SIP | FSN-EVEN-ORTH |
                     // FSN-BRICK-WAKE | FSN-GAUNT-GATE | FSN-ORTH-TRI |
                     // FSN-GLYPH-FULL | FSN-GAIT-WATCH | FSN-GAUNT-CHOIR |
                     // FSN-GAUNT-COURT | FSN-GAUNT-QUIET | FSN-STILL-GRACE |
                     // FSN-LONE-AXIS | FSN-DEBT-ORBIT | FSN-PAIR-GIFT |
                     // FSN-GAUNT-HOLD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // gaunt | even | brick | orth
lastSeamCells? / richCinderCell? / castPlateCell?
hushCurtainCell? / spentSillCell? / emptyFontCell?
emptyStepPads? / actLockArmed? / orthPicketArmed?
fileShadeArmed? / closeHourArmed?
holdPortalLocked?
objectiveKind        // + occupy_empty_font | open_spent | drink_empty |
                     //   tag_file | choose_device | plant_file | part_curtain
failureKind
deviceTable[]        // ENC-TREAS-16
rushVariant?         // wick_march | dry_eternal | hearth_cover | must_bias
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Orth Picket” logic — use `formationId` / `orthPicketArmed` / `branchFlag`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-10-23 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush only).
- Wiring Wave-15 families (`hollow_gifter`, `cadence_floorer`, `nine_prelate`, `odd_strider`, …) or Wave-16 spell unique CORE (`spell-gait-wick`, `spell-dry-sting`, `spell-home-step`, `spell-must-span`, …) — those wait on same-day / later catalogs. This catalog consumes drop-15 **formations** that can stand on Wave-14 kits.
- Faking Gaunt Mend without four leftover-0 flags, Gaunt Sting as Lean/Dry, Even Hood as an odd / ≤1 / exact-2 / ≥3 zero, Orth Stride as Diag, Brick Reel as Void Reel, Gaunt Post walk-on as a detonate, Glyph Skip as a required player hop, Gait Plate as an own-turn miss, Full Gait as Full Plate, Cast Debt as Spent Crack, Pair Gift as Pair Dry, Gaunt Hold as Lean Hold, Hush as Slide, Spent as Retreat, Empty Step as Full Step, Empty Font as Alone Font, Orth Picket as Mid Picket, Orth Tutor as Close Tutor, File Shade as Hunt Draft, Sheath File as Gap File, Vow Gate in a dungeon, Oct Plug while cap is 2.
- Consuming same-day 2026-10-24 Wave 16 family / spell / world catalogs.

---

## 10. Pick order (day-16, after days 1–15 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–15 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-16 + ENC-SPELL-31 (last-seam / gaunt-mend verbs)  
2. ENC-WAVE-17 (`formationId` GAUNT-STEP → GAUNT-SIP)  
3. ENC-GAUNT-01 or ENC-BARE-01 or ENC-EVEN-02 (new pressure objects)  
4. ENC-BRANCH-16 (`branch: gaunt|even|brick|orth` snapshot-before-cleanup)  
5. ENC-BOSS-16 branch read  
6. Rush Table N variants 59–62 one room at a time (after the account has one full Table M clear)

Uniqueness: this file is the **sixteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
