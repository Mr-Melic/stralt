# Encounter Evolution Catalog — 2026-09-27

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-27-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-8 leftover packs `docs/design/ENEMY_FORMATIONS_2026-09-25.md` (PR #575), drop-9 Wave 8 packs `docs/design/ENEMY_FORMATIONS_2026-09-26.md` (PR #612), Wave 9 families `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-26.md` (PR #625), Wave 8 leftover world features in `docs/WORLD_DYNAMICS.md` (PR #613, `WDD-2026-09-26-001`), Rush Table H `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.7 (PR #638). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines.

Same-day (2026-09-27) Wave 10 family / spell / world-feature catalogs **do not exist yet**. Do not mint colliding `FSN-*` / `WF-*` / Wave-10 family ids here. Wave 10 **bosses** stay Rush-only (Table H).

---

## 1. Why a tenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–9 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, and Hug/Boot/Write/Dull. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-8 leftover packs | Day-9 spent `FSN-CAMP-TITHE` / `FSN-CORNER-FOG` / `FSN-TWIN-PLUG` as rooms. Still PDFs: `FSN-PURSE-MUTE`, `FSN-HINGE-GLANCE`, `FSN-VEIL-GOAD`, `FSN-SPARK-SPLIT`, `FSN-HINGE-WICK`, `FSN-POST-TITHE`, `FSN-PURSE-COURT`, `FSN-REEL-TITHE`, `FSN-HINGE-COVER`, `FSN-VEIL-CORNER`, `FSN-BREAK-CHOIR`, `FSN-CAP-VEIL`, `FSN-REEL-CORNER` |
| Wave 9 families | `gait_mender`, `pair_porter`, `cadence_flusher`, `lone_stinger`, `dummy_prelate`, `even_warder`, `walk_toller`, `gait_sealer`, `brick_shifter`, `hold_knight`, `leftover_lender` have packs (PR #625) but no dungeon beat. Day-9 left them for later. |
| World-feature leftovers | Day-9 **rooms** never spent `WF-TRP-WEARY_PLATE`, `WF-OBS-COIN_SILL`, `WF-TEL-BACKSTEP`, `WF-ELT-ODD_PICKET`, `WF-SPL-VOW_KEEPER`, `WF-RSK-BOND_OATH`. `WF-HAZ-TURNSTILE_EMBER` appeared only as inherit chrome. |
| Rush Table H | `H0`–`H3` (`crypt_sexton`+`cinder_lance`, `march_prefect`+`silent_conductor`, `aisle_canon`+`ram_castellan`, `orbit_succentor`+`ivory_palisade`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `wearyPlateCell` / `oddRoundPresent` / `backstepDest` / `dummyPostId` / `evenStrideArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post counts as **1**. Triple Span still counts as **3** — do not spawn `FSN-TRIPLE-PLUG`.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Purse / hinge / veil / spark / dummy / even / walk-toll bodies must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Gait Mend / Enter Mend / Split Mend live **only** on healer profiles.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-HEARTH_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane). Forbidden in dungeon, boss rush, and Death Realm.
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-10 ids (`crypt_sexton`, `march_prefect`, `aisle_canon`, `orbit_succentor`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot **does not** count as walk-MP for Gait Mend, Boot Sting, Must Pace, or Walk Toll.
- Pair Hinge dests are occupancy cells, **not** `isSwap`. Dummy Post is not Bait Pylon, not Goad-without-body, not Twin Span.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-PURSE-01 / ENC-ELITE-18 | leftover-AP ≥ 2 gate on Purse Cut | Convert to ENC-LEDGER-01 (queued day-7 leftover AP) or `FSN-TIDE-LOCK` frost kite |
| ENC-HINGE-01 / ENC-COVER-01 | clockwise self-rotate around a living **ally** pivot | Convert to ENC-FACE-01 (queued day-8 facing pip) |
| ENC-POST-01 | Rank Lock writer (`\|dx\|===0` XOR `\|dy\|===0`) | Convert to ENC-TITHE-02 (`FSN-CAMP-TITHE`, no lock) |
| ENC-REEL-01 | `applyAttract` **cast** caller + dest walk-off | Convert to ENC-TITHE-02; Oncoming Strike-only |
| ENC-SPARK-01 / ENC-PRIO-12 | spark whelp + current-actor death AP; summoner skip-lock | Convert to ENC-WAVE-01 pawn waves (no pet economy) |
| ENC-GAIT-01 / ENC-SPELL-19 | `walkMpSpentThisTurn` writer | Convert to ENC-SPELL-17 Boot Frost-only (queued day-9) |
| ENC-PAIR-01 | two-hostile 90° occupancy dests (not Swap) | Convert to ENC-TWIN-01 (queued day-7 ally-swap kennel) |
| ENC-DUMMY-01 | `summonAI: "dummypost"` + Chebyshev-1 taunt filter | Convert to ENC-PROT-03 decoy (queued day-3) without claiming a 1-HP post |
| ENC-EVEN-01 / ENC-TOLL-02 | even-Manhattan confirm **or** `nextWalkMpTax` | Convert to ENC-MOVE-16 tithe sill (queued day-9) |
| ENC-ODD-01 / ENC-AMBUSH-10 | odd-round present / even-round absent | Convert to ENC-CAMP-01 sleeping elites (queued day-8) |
| ENC-BACK-01 / ENC-MOVE-18 | reverse-of-facing dest occupancy | Convert to ENC-MOVE-16 Flank Step (queued day-9) |
| ENC-WICK-02 | Hinge Tile **not** `placeBarrier` + fuse occupancy | Convert to ENC-WICK-01 (queued day-5) |
| ENC-BREAK-01 | once/battle self CD → 0 | Convert to ENC-SPELL-16 glyph teacher (queued day-8) |
| ENC-RUSH-35…38 | Table H bosses + crypt wick / must-pace / triple-post / pivot objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Purse / Hinge / Gait primer + inserts)

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

| Beat | Depth hint | Job | Day-10 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (spend leftover, weary plate, walked heal) | ENC-TEACH-10, ENC-SPELL-19, ENC-HAZ-19 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-11, ENC-AMBUSH-10, ENC-SPELL-20 |
| Combine | 2–3 | Two taught verbs | ENC-PURSE-01, ENC-HINGE-01, ENC-GAIT-01, ENC-HAZ-20, ENC-MOVE-18 |
| Pressure | 3 | Clock, odd picket, dummy, or spark timing | ENC-SURV-19, ENC-PROT-10, ENC-DUMMY-01, ENC-PRIO-12, ENC-POST-01, ENC-PAIR-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-10, ENC-BRANCH-10, ENC-TREAS-10, ENC-BOND-01, ENC-VOW-01, ENC-ODD-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-18, ENC-ELITE-19, ENC-RARE-10, ENC-MAST-10, ENC-BREAK-01, ENC-CAP-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-11, ENC-BOSS-10, ENC-RUSH-35…38 |

Days 1–9 chains remain valid. Day-10 **Purse / Hinge / Gait primer** is the default for accounts that already cleared Hug / Boot / Write / Dull once (queued ENC-BRANCH-09). Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-10

ENCOUNTER_ID: ENC-TEACH-10  
TYPE: teach mechanic / elite-lite  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a leftover-AP lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. Modifier off. No lava/ice/spikes. Player spawn opposite the bishop. One locked exit. A painted HUD tell on the bishop’s first turn: “holding ≥ 2 AP after End Turn is the expensive answer.” Do **not** attach Purse Cut yet (that is ENC-PURSE-01).  
SPECIAL_RULES: `scriptedHazardsOnly`. First End Turn with leftover AP ≥ 2 logs a teach line. Distinct from ENC-LEDGER-01 (Ley leftover) and ENC-TITHE-02 (stand-gun).  
OBJECTIVE: Defeat both. Optional: dump to 0–1 AP before the bishop’s second turn.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “unspent AP is a tell the next room will cash.” Prepares ENC-PURSE-01 / `FSN-PURSE-MUTE`.  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can spend then stand.  
REPLAYABILITY: Bishop north vs east. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: replace the pawn with a `ROLE-MUTER` Frost-only bishop (still no Purse Cut). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-19

ENCOUNTER_ID: ENC-HAZ-19  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may end a 2+ AP turn on the plate **once**. Wounded pawns end 2+ AP turns off the plate. Bishop kites from non-plate floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a plate tax can later hint `spell-leftover-lend` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: One visible `WF-TRP-WEARY_PLATE` in the mid-band (step-on free; first unit to **end a turn** there after spending 2+ AP this turn pays 8% max HP once, then the plate is floor). A path around the plate. Exit behind the bishop. Inverse of queued Idle Pin / Rime Heel (those tax **not** spending).  
SPECIAL_RULES: Scripted plate only. Do not mix lectern ash (that is ENC-TEACH-09). Attack Nearest counts as AP. Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Clear all. Intended: dump a 5-AP Inferno **off** the plate, or camp the plate after a 0–1 AP turn.  
FAILURE_CONDITION: Player death (frost + weary tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing the plate tax.  
TACTICAL_PURPOSE: Teach “the bronze plate punishes a **spent** end, not standing still.” Distinct from lectern ash (casts) and bog silt (MP).  
SOLVABILITY_REQUIREMENTS: Path around the plate; plate never walls a corridor; not on spawn±3 or the portal. Counts as 1 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Plate center vs flank.  
SCALING_BEHAVIOUR: Mid: inherit 2 lectern-ash tiles on a **different** flank (`inheritHazardsFrom: ENC-TEACH-09`) so ash-cast and weary-end are two taxes. High: bishop gains `starter-poison`. Never two weary plates.  
STATUS: PROPOSED

---

### ENC-HAZ-20

ENCOUNTER_ID: ENC-HAZ-20  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PURSE-MUTE/SOLO` fallback — 1× bishop (`starter-frost`) + 1× pawn charger. No Purse Cut until honesty lands.  
AI_REQUIREMENTS: Bishop kites off the plus arms. Pawn may stand in the hollow. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: A 4-tile plus of `WF-HAZ-TURNSTILE_EMBER` (one arm occupied; 90° clockwise at round start; 5% max HP on land) **plus** the ENC-HAZ-19 weary plate on a **gallery** (`inheritHazardsFrom: ENC-HAZ-19`). A path around the plus. Hollow of the plus is safe.  
SPECIAL_RULES: Scripted ember + plate only. Ember never covers spawn/portal. Distinct from Orbiting Cinder (square) and Pendulum Censer (line reverse).  
OBJECTIVE: Clear all. Intended: stand in the hollow, cross after an arm leaves, dump AP off the plate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a rotating floor tax with a spent-end tax so “stand still and trade” is only correct in the hollow.  
SOLVABILITY_REQUIREMENTS: Path around the plus; hollow reachable; plate not on a plus arm. Ember counts as 1 hazard budget.  
REPLAYABILITY: Plus rotated 90° at spawn. Full `FSN-PURSE-MUTE` at high band **if** leftover-AP gate exists.  
SCALING_BEHAVIOUR: High: enable Purse Cut on the bishop (ENC-PURSE-01). Peak: add `WF-MOD-CLOSE_QUARTERS` (linear −1 range) so kiting from the hollow still costs a step. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-19

ENCOUNTER_ID: ENC-SPELL-19  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `gait_mender` bishop (healer profile; `spell-gait-mend` + `starter-frost`) + 1× pawn (`physical_attack` only). No elites.  
AI_REQUIREMENTS: Mender walks **then** mends if `walkMpSpentThisTurn` ≥ 1; otherwise Frost. Never drain / nova. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-gait-mend` (heal 8 iff the **caster** walked this turn) can drop that id if missing. Extra door `gait_cantor` — first child wins vs `gait_mender` observe. Do not restamp claimed feats.  
MAP_REQUIREMENTS: Open court. No lava. One locked exit. Optional 2-tile dry runway so the mender can buy the step.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing walk-spend writer → Frost-only (still a valid teach: they walked and did **not** mend). Do not fake the heal with `starter-heal`.  
OBJECTIVE: Defeat both. Optional: never let the mender cash a walked heal (pin, Nail Down, kill before the step).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + gait-mend discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this mend is paid in **tiles already spent**. Standing is 0 HP.” Prepares ENC-GAIT-01 (Gait Choir).  
SOLVABILITY_REQUIREMENTS: Both reachable. Runway not the only aisle.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: Mid: mender gains `starter-shield` on the pawn. High: replace pawn with `spare_pacer` (current walk MP gift) — still no Boot Sting unless the walk writer exists.  
STATUS: PROPOSED

---

### ENC-SPELL-20

ENCOUNTER_ID: ENC-SPELL-20  
TYPE: spell-discovery / movement  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `even_warder` rook (`spell-even-stride` + `physical_attack`) + 1× pawn charger.  
AI_REQUIREMENTS: Warder paints even-Manhattan on the player only if a 2-step (or 4-step) walk exists. Skip if the only walk is odd. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-even-stride` can drop that id if missing. MULTI child `even_gallery` — first child wins vs `even_warder` observe.  
MAP_REQUIREMENTS: Open court with **both** a 2-tile and a 3-tile approach painted (even vs odd). Do not also apply Rank Lock. Distinct from ENC-BIAS-01 (diagonal after cardinal pit).  
SPECIAL_RULES: Family lottery **off**. Honesty: missing even-Manhattan confirm → Warder Frosts / Strikes (soft PAIR). Odd-length confirms fail closed, never silently succeed.  
OBJECTIVE: Defeat both. Optional: only take even-length walks while painted.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + even-stride discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “odd-length walks fail while painted; a 2-step is the answer, not a bigger nuke.” Prepares ENC-EVEN-01 / ENC-TOLL-02.  
SOLVABILITY_REQUIREMENTS: Even-length path reaches the warder. Odd path exists so the fail is readable.  
REPLAYABILITY: Even runway N-S vs E-W.  
SCALING_BEHAVIOUR: Mid: add `walk_toller` as a second body (ENC-TOLL-02) **if** `nextWalkMpTax` exists. High: inherit weary plate so a 2-AP even walk that **ends** on bronze is the trap.  
STATUS: PROPOSED

---

### ENC-PURSE-01

ENCOUNTER_ID: ENC-PURSE-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PURSE-MUTE` — 1× `purse_scribe` bishop (`spell-purse-cut`) + 1× `gait_muter` bishop (`spell-stride-mute` / walk-fizzle).  
AI_REQUIREMENTS: Purse skips Cut if leftover AP < 2. Muter skips if already adjacent and they will Strike. Opposite corners. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Purse Cut or Stride Mute can drop that id if missing.  
MAP_REQUIREMENTS: `openField` or `arena` with two approaches. Reject a 1-tile tunnel (walk would be mandatory). No Time Warp. No Glass Realm. Optional inherit weary plate on a **flank** (`inheritHazardsFrom: ENC-HAZ-19`) — never the only aisle.  
SPECIAL_RULES: Band 0: **do not spawn** (kits missing) — show ENC-TEACH-10. Never both tax the same AP bar as a hardlock: Mute fizzles the **spell after a walk**; Purse punishes **unspent** AP. Answer is spend-then-stand **or** walk-then-Strike (2 AP). No Ledger. No Act Tax (that is `FSN-PURSE-COURT`).  
OBJECTIVE: Clear both. Intended: dump Inferno, then stand.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: The loaded bar cannot also walk. Combination of leftover poke + walk-fizzle.  
SOLVABILITY_REQUIREMENTS: Two approaches; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Purse N / Muter E vs swapped. High: `FSN-PURSE-COURT` (adds Act Tax) after ENC-ACT-01 exists.  
SCALING_BEHAVIOUR: Elite Purse only (`FSN-PURSE-MUTE/E-CUT`). Muter stays junior. Never steal leftover AP.  
STATUS: PROPOSED

---

### ENC-HINGE-01

ENCOUNTER_ID: ENC-HINGE-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HINGE-GLANCE` — 1× `hinge_squire` knight (`spell-hinge-step`) + 1× `glance_ward` queen **without heal** (`spell-glance-cut` or Frost if view unread).  
AI_REQUIREMENTS: Hinge skips no-ally / occupied dest; allied pivot only on BASE. Glance skips empty / wall / ally / missing view. Blackboard `hingeDest` so they do not stack. Start ≥ Chebyshev 4. Never turn-1 surround.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Hinge Step or Glance Cut can drop that id if missing.  
MAP_REQUIREMENTS: `asymmetric` or `ruinsIslands` with **two** flanks plus a rear tile that is not the only exit. Reject cramped `corridorMaze`. Clockwise dest is free floor, not lava / pit / portal.  
SPECIAL_RULES: Band 0: **do not spawn**. If `currentView` unread, Glance Frosts forever — still a valid soft PAIR (Hinge is the verb). Do **not** fake Glance with Oncoming. No Cover (that is ENC-COVER-01). No Vault / Hook / Mist.  
OBJECTIVE: Clear both. Intended: occupy the clockwise cell, or Nail Down the Squire.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: 90° self-rotate + new-front poke. The empty tile behind the pivot becomes a flank.  
SOLVABILITY_REQUIREMENTS: Clockwise dest walk-off; player keeps ≥ 1 escape tile after a swing.  
REPLAYABILITY: Pivot west vs south. High: ENC-COVER-01 (`FSN-HINGE-COVER`).  
SCALING_BEHAVIOUR: Elite Hinge only. Glance stays junior. Never two dash elites.  
STATUS: PROPOSED

---

### ENC-GAIT-01

ENCOUNTER_ID: ENC-GAIT-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 9 pack **Gait Choir** — `gait_mender` + `spare_pacer` + `boot_stinger`. Cap 3 living.  
AI_REQUIREMENTS: Buy the step, sting if walk-MP was spent, then cash the walked heal. Spare gifts **current** walk MP this turn, never persisted `CharacterStats.mp`. Boot fails closed (12 only) without the walk writer.  
SPELL_DISCOVERY_OPPORTUNITIES: Gait Mend / Spare Pace / Boot Sting observe if missing.  
MAP_REQUIREMENTS: 3-tile approach plus a gallery. No lectern ash on the sting file (double launch tax). Optional weary plate on a **gallery** only.  
SPECIAL_RULES: Family lottery **off**. Do **not** pack `gait_mender` with `pale_cantor` / `post_stinger` as PAIR. Isolated 1v1 **reroll**.  
OBJECTIVE: Clear all. Intended: pin the mender before the step, or take the gallery and ignore Boot +10.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Walked heal + walked sting + walk-MP gift. The step is the resource, not HP.  
SOLVABILITY_REQUIREMENTS: Gallery walk-off; three bodies Chebyshev ≥ 4 at start.  
REPLAYABILITY: Choir N vs E.  
SCALING_BEHAVIOUR: High: elite Boot only. Peak: inherit ENC-SPELL-20 even paint so the paid step must also be even.  
STATUS: PROPOSED

---

### ENC-WAVE-11

ENCOUNTER_ID: ENC-WAVE-11  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn chargers on open floor. Wave 2: `FSN-PURSE-MUTE` **or** (honesty) ENC-TEACH-10 bishop+pawn. Wave 3: 1× `even_warder` **or** Frost rook. Never more than 4 living. Portal locked until wave 3 clear (`holdPortalLocked`).  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 as ENC-PURSE-01. Wave 3 paints even-stride if the writer exists.  
SPELL_DISCOVERY_OPPORTUNITIES: Purse / Mute / Even as in the source rooms.  
MAP_REQUIREMENTS: Arena plus a gallery. Weary plate optional on a flank, never a wave-spawn cell. Spawn±3 and portal clear.  
SPECIAL_RULES: Next wave spawns only after the previous wave’s hostiles are dead. Extra spawns stay on the flood-fill from player spawn. Under `MAX_ENEMIES`.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns` is fair if the player dumps AP into wave 1.  
TACTICAL_PURPOSE: Reinforce leftover-AP then add even-walk. Not a denser pawn blob.  
SOLVABILITY_REQUIREMENTS: Each wave-cell set reachable; one dry path.  
REPLAYABILITY: Wave 2 purse-N vs mute-N.  
SCALING_BEHAVIOUR: High: wave 3 is `walk_toller` instead of even_warder. Never add a fourth wave.  
STATUS: PROPOSED

---

### ENC-AMBUSH-10

ENCOUNTER_ID: ENC-AMBUSH-10  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible: 1× pawn. Hidden until odd round: `WF-ELT-ODD_PICKET` elite (same-tier × hard) on a painted post. On even rounds the post is empty floor.  
AI_REQUIREMENTS: Visible pawn greedy. Picket uses elite kit only while present. Even-round absence is **not** a kill.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional Vow Keeper chrome is ENC-VOW-01, not this room.  
MAP_REQUIREMENTS: Post is floor. Exit reachable without touching the elite. Distinct from Even Picket (present on even) and ENC-CAMP-01 (sleeping).  
SPECIAL_RULES: In dungeon they are required for map-clear — wait for odd. Honesty: missing round-parity spawn → ENC-CAMP-01. Counts as 1 toward `MAX_ENEMIES`. Never turn-1 surround.  
OBJECTIVE: Defeat the pawn and the picket (engage on odd).  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band `applyRewards` for the picket kill + standard for the pawn. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the post is empty on even; the fight is on odd.” Prepares ENC-ODD-01 / ENC-SURV-20.  
SOLVABILITY_REQUIREMENTS: Post not on spawn±3 or portal. Absent-on-even is not a wall.  
REPLAYABILITY: Post N vs E.  
SCALING_BEHAVIOUR: High: picket is `hold_knight` (Strike illegal until they walk) if that family exists. Peak: two posts is **illegal** (one Odd Picket).  
STATUS: PROPOSED

---

### ENC-REINF-10

ENCOUNTER_ID: ENC-REINF-10  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: `FSN-SPARK-SPLIT` without the whelp planted. At the Chanter’s first turn, Spark Whelp (1 HP, lifespan 1, Strike only) plants if remaining summon cap ≥ 1. Splitter adjacent.  
AI_REQUIREMENTS: Spark skip if a whelp already lives. Splitter gifts leftover only if leftover ≥ 1 **and** adjacent. Summoner fall-through to Strike/Frost at cap — never skip the turn.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Spark Whelp / Split Purse can drop those ids if missing. Whelp death is 0 XP.  
MAP_REQUIREMENTS: Open court. Plant cell is not a portal, not spawn±3, not the only aisle.  
SPECIAL_RULES: Kill the whelp on **their** turn and the +1 AP is lost. Fade on the Chanter’s turn may grant — that is the honest risk. Do not also roll wolf/archer. Player-side whelp death does not enter `applyRewards`.  
OBJECTIVE: Clear Chanter, Splitter, and any living whelp.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Reinforcement is a 1-HP AP battery, not a third bruiser. Prepares ENC-PRIO-12 / ENC-SPARK-01.  
SOLVABILITY_REQUIREMENTS: Plant cell reachable; cap 1 whelp.  
REPLAYABILITY: Plant N vs E.  
SCALING_BEHAVIOUR: High: `FSN-SPARK-SPLIT/PURSE` (adds Break) after ENC-BREAK-01. Never two whelps.  
STATUS: PROPOSED

---

### ENC-POST-01

ENCOUNTER_ID: ENC-POST-01  
TYPE: hazard / priority / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-POST-TITHE` — `post_stinger` rook + `tithe_mason` bishop + `axis_locksmith` rook.  
AI_REQUIREMENTS: Post never walks then stings. Tithe never paints the only walk-off. Lock never seals the gallery. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Post Sting / Exit Tithe / Rank Lock observe if missing.  
MAP_REQUIREMENTS: `fortress` courtyard + gallery, or `chessboard` with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel. No lava on the painted cell. No Time Warp. Unlock after ENC-TITHE-02.  
SPECIAL_RULES: Rank Lock is the **one** rare. Walks still happen, only along current rank **or** file. Forced-move still works. Never Lock + Root + Mute on the same AP bar. Sit-and-cast remains legal. Extra player AP through `recordChallengeApSpend`.  
OBJECTIVE: Clear all. Intended: take the gallery; do not dump Inferno from the tithe cell.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Camp gun + leave-tax + axis lock. Three verbs, one aisle. Combination, not a new monster.  
SOLVABILITY_REQUIREMENTS: Gallery walk-off **off the file**; lock never deletes it.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Elite Post only. Tithe and Lock stay junior. Honesty: missing Rank Lock → ENC-TITHE-02.  
STATUS: PROPOSED

---

### ENC-REEL-01

ENCOUNTER_ID: ENC-REEL-01  
TYPE: movement / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-REEL-TITHE` — `file_reeler` rook + `tithe_mason` bishop + `oncoming_knight`.  
AI_REQUIREMENTS: Reel only on a shared rank **or** file; dest must leave a walk-off; 0 damage. Never reel onto lava / pit / fuse / portal. Oncoming fails closed without `currentView` → Strike-only body on the file.  
SPELL_DISCOVERY_OPPORTUNITIES: File Reel / Exit Tithe / Oncoming observe if missing.  
MAP_REQUIREMENTS: Shared file plus a **diagonal** gallery (full answer to Reel). Tithe cell on the file, not the only walk-off.  
SPECIAL_RULES: Unlock after ENC-TITHE-02 **and** (ENC-FACE-01 or Oncoming seen). No Hook / Sink / Pair. No Rank Lock (ENC-POST-01 owns that). Attract does not write facing.  
OBJECTIVE: Clear all. Intended: stand off-axis, or pay the leave-tax after a 1-tile pull.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Displacement sets up a tax, not a stun.  
SOLVABILITY_REQUIREMENTS: Dest walk-off; diagonal stance exists; player keeps ≥ 1 escape.  
REPLAYABILITY: File W vs E. High: `FSN-REEL-CORNER` as ENC-RARE-10.  
SCALING_BEHAVIOUR: Elite Reel only. Honesty: missing `applyAttract` caller → ENC-TITHE-02.  
STATUS: PROPOSED

---

### ENC-VEIL-01

ENCOUNTER_ID: ENC-VEIL-01  
TYPE: protection / priority  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-VEIL-GOAD` — `veil_cantor` bishop + `goad_herald` pawn/knight. Solo Goad fallback `FSN-VEIL-GOAD/SOLO` if Veil id is not ready.  
AI_REQUIREMENTS: Veil self 1 round; skip if already veiled; never smoke. Goad rewrites the legal **damaging** target. Non-damage tools ignore taunt. AoE that includes the Herald satisfies it. Strike still hits the Veil.  
SPELL_DISCOVERY_OPPORTUNITIES: Aim Veil / Goad observe if missing.  
MAP_REQUIREMENTS: Two approaches. Herald starts Chebyshev ≥ 4. No Smoke. No Cap (that is ENC-CAP-01).  
SPECIAL_RULES: Attack Nearest must skip a veiled primary. Distinct from ENC-PINCH-01 (occupancy sandwich) and ENC-DISP-01.  
OBJECTIVE: Clear both. Intended: Strike the Veil, AoE both, or Absolve Goad.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: You cannot *name* the glass; the Herald is the legal gun.  
SOLVABILITY_REQUIREMENTS: AoE cell exists that covers Herald without requiring a sealed pocket.  
REPLAYABILITY: Herald N vs E. High: `FSN-VEIL-CORNER` (adds Blind Corner). Peak: ENC-CAP-01.  
SCALING_BEHAVIOUR: Elite Goad only. Veil stays junior.  
STATUS: PROPOSED

---

### ENC-SPARK-01

ENCOUNTER_ID: ENC-SPARK-01  
TYPE: spell-discovery / priority  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPARK-SPLIT` — `spark_chanter` + `purse_splitter`. Whelp as ENC-REINF-10.  
AI_REQUIREMENTS: Same as ENC-REINF-10. CELL: Spark cap 1. No Break on CELL. No Act Bell.  
SPELL_DISCOVERY_OPPORTUNITIES: Spark Whelp / Split Purse.  
MAP_REQUIREMENTS: Open court. Isolated 1v1 **reroll**.  
SPECIAL_RULES: Designed answer: ignore the pet until the Chanter’s turn **ends** when possible. If fade grants on their turn, that is honest.  
OBJECTIVE: Clear both (and the whelp if alive).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: You choose **when** the 1-HP body dies.  
SOLVABILITY_REQUIREMENTS: Same as ENC-REINF-10.  
REPLAYABILITY: Splitter west vs east of Chanter.  
SCALING_BEHAVIOUR: Elite Spark only. High: `/PURSE` after ENC-BREAK-01.  
STATUS: PROPOSED

---

### ENC-PAIR-01

ENCOUNTER_ID: ENC-PAIR-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 9 pack **Pair Peel** — `pair_porter` + `lone_stinger` + `gait_sealer`.  
AI_REQUIREMENTS: Rotate two hostiles 90° around **their** midpoint (caster stays). Then nail feet. Then sting the isolated body. Dest cells of the 2×2 must be free floor. Not `isSwap`. Not `hinge_squire` (self around ally). Not `pivot_ward` (one body around caster).  
SPELL_DISCOVERY_OPPORTUNITIES: Pair Hinge / Lone Sting / Gait Seal observe if missing. Extra door `pair_usher` — first child wins vs `pair_porter` observe.  
MAP_REQUIREMENTS: Open 2×2 plus a gallery. Reject a closet (dest would be a lock).  
SPECIAL_RULES: Do **not** pack `pair_porter` with `hinge_squire` / `pivot_ward` / `pawn_broker` / `hook_chaplain`. Do **not** pack `lone_stinger` with `split_fanger` as PAIR. Honesty: missing occupancy dests → ENC-TWIN-01.  
OBJECTIVE: Clear all. Intended: occupy a dest cell, or clump so Lone Sting fails.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: They rotate **each other**, then the isolated poke pays.  
SOLVABILITY_REQUIREMENTS: Both dests walk-off; player keeps ≥ 1 escape.  
REPLAYABILITY: 2×2 N vs E.  
SCALING_BEHAVIOUR: Elite Porter only. Stinger and Sealer stay junior.  
STATUS: PROPOSED

---

### ENC-DUMMY-01

ENCOUNTER_ID: ENC-DUMMY-01  
TYPE: protection / priority  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 9 pack **Morrow Dummy** minus delayed plate if missing — `dummy_prelate` (`spell-dummy-post`, 1 HP, empty kit, Chebyshev-1 taunt) + `return_stinger`. Optional `morrow_warden` if delayed absorb exists.  
AI_REQUIREMENTS: Dummy counts as 1 toward summon cap. Cast-target filter: damaging spells/Strike legal on Dummy when Chebyshev-1 of it. Do not also roll bait / pylon / twin-span / triple-span / font / spark on this board.  
SPELL_DISCOVERY_OPPORTUNITIES: Dummy Post / Return Sting observe if missing. Extra door `dummy_castellan` — first child wins vs `dummy_prelate` observe.  
MAP_REQUIREMENTS: Open court. Dummy plant not on portal / spawn±3 / the only aisle.  
SPECIAL_RULES: Honesty: missing `dummypost` key → ENC-PROT-03 without claiming a 1-HP post. DoTs / lava do not consume Return Sting.  
OBJECTIVE: Clear all. Intended: AoE the Dummy with the stinger, or walk Chebyshev-2 and ignore taunt.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: The 1-HP post is the legal gun. Prepares Table H `H2` (posts as objects, not a third boss).  
SOLVABILITY_REQUIREMENTS: A Chebyshev-2 tile exists so taunt can be refused.  
REPLAYABILITY: Plant N vs E.  
SCALING_BEHAVIOUR: High: add `thin_warder` (incoming cap 30) **if** that family exists. Never two posts.  
STATUS: PROPOSED

---

### ENC-EVEN-01

ENCOUNTER_ID: ENC-EVEN-01  
TYPE: movement / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 9 pack **Even Toll** — `even_warder` + `walk_toller` + `gait_muter`.  
AI_REQUIREMENTS: Even Manhattan, then tax the remaining even step, then fizzle a spell-after-walk. Skip if the only walk is odd. Never Lock + Mute + Toll as a hardlock on a 1-tile tunnel.  
SPELL_DISCOVERY_OPPORTUNITIES: Even Stride / Walk Toll / Stride Mute.  
MAP_REQUIREMENTS: Even (2 or 4) and odd (3) approaches painted. Gallery exists.  
SPECIAL_RULES: Walk Toll is `nextWalkMpTax`, **not** `spell.mpCost` (Ley Toll remains the first MP spender). Do **not** pack `even_warder` with `diag_locksmith` / `axis_locksmith` as PAIR. Honesty: missing writers → ENC-SPELL-20.  
OBJECTIVE: Clear all. Intended: take the even runway, pay +1 MP **or** mute-stand.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Parity walk + walk-pool tax + walk-fizzle. Three answers, one file.  
SOLVABILITY_REQUIREMENTS: Even path reaches all three; odd path exists as a readable fail.  
REPLAYABILITY: Even runway N-S vs E-W.  
SCALING_BEHAVIOUR: Elite Toller only.  
STATUS: PROPOSED

---

### ENC-TOLL-02

ENCOUNTER_ID: ENC-TOLL-02  
TYPE: teach mechanic / movement  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `walk_toller` bishop (`spell-walk-toll` + `starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Toller paints next-walk +1 MP only if the player has a 2+ MP walk remaining. Skip if they are already adjacent. Distinct from ENC-TOLL-01 (queued day-3 shrine HP). Distinct from ENC-LEY-01 (current-MP spend on the **cast**).  
SPELL_DISCOVERY_OPPORTUNITIES: Walk Toll observe if missing. Encounter `toll_nave` is a teach, not the family name.  
MAP_REQUIREMENTS: Open court. One 3-tile runway. Modifier off.  
SPECIAL_RULES: CORE row `mpCost: 0`. Honesty: missing `nextWalkMpTax` → Frost kite (ENC-TEACH-03). Forced-move does not pay the tax.  
OBJECTIVE: Defeat both. Optional: walk 1 then Strike so the tax never lands on a 3-tile dash.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the tax is the **walk pool**, not the spell bar.” Prepares ENC-EVEN-01 and Table H `H1` (must-pace on a sounding file).  
SOLVABILITY_REQUIREMENTS: 1-tile and 3-tile walks both exist.  
REPLAYABILITY: Runway N vs E.  
SCALING_BEHAVIOUR: Mid: combine with ENC-SPELL-20. High: inherit weary plate so a taxed 2-AP end is the trap.  
STATUS: PROPOSED

---

### ENC-SURV-19

ENCOUNTER_ID: ENC-SURV-19  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop Frost + 1× `purse_scribe` (if honesty) else a second Frost bishop. No waves of HP sponges.  
AI_REQUIREMENTS: Kite. Purse skips leftover < 2.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Weary plate (ENC-HAZ-19) **plus** turnstile plus (ENC-HAZ-20). Survive **6 player turns** with at least one hostile alive (`holdPortalLocked`), then the portal unlocks **or** remaining hostiles become the clear condition — pick one in metadata (`objectiveKind: survive_turns` then `clear_remaining`). Hollow of the plus is the designed camp.  
SPECIAL_RULES: Clock is player turns, not a shrinking void (that is ENC-SURV-03). Overlay `no_healing` is fair; `no_damage_taken` is not.  
OBJECTIVE: Survive 6 turns then clear remaining, or clear early.  
FAILURE_CONDITION: Player death. Clock expiry without a living hostile still counts as success if they died to ember/plate (intended).  
REWARD: Standard + small clock bonus via `applyRewards` if the plate never taxed the player.  
TACTICAL_PURPOSE: Pressure the spend-end and the rotating arm without a denser roster.  
SOLVABILITY_REQUIREMENTS: Hollow reachable; path around plus; plate not on an arm.  
REPLAYABILITY: 6 vs 8 turns at peak (metadata), not more enemies.  
SCALING_BEHAVIOUR: High: enable Purse. Peak: Close Quarters. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-20

ENCOUNTER_ID: ENC-SURV-20  
TYPE: survival / ambush  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: ENC-AMBUSH-10 picket + 1× Frost bishop that kites on even rounds (when the post is empty).  
AI_REQUIREMENTS: Bishop does not occupy the post. Picket as ENC-AMBUSH-10.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Same post rules. A shelter tile off the post.  
SPECIAL_RULES: On even, the fight is the bishop only. On odd, both. Portal locked until picket is dead (`holdPortalLocked`).  
OBJECTIVE: Kill the picket (odd) without dying to the bishop on even.  
FAILURE_CONDITION: Player death.  
REWARD: Hard picket grant + standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: The empty post is a rest, not a skip of the dungeon.  
SOLVABILITY_REQUIREMENTS: Same as ENC-AMBUSH-10.  
REPLAYABILITY: Post N vs E.  
SCALING_BEHAVIOUR: Peak: picket is elite `hold_knight`. One picket only.  
STATUS: PROPOSED

---

### ENC-ELITE-18

ENCOUNTER_ID: ENC-ELITE-18  
TYPE: rare elite / purse  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PURSE-MUTE/E-CUT` — elite Purse + junior Muter. Optional third `leftover_lender` at peak **if** that family exists (Flush Lend without Ignite).  
AI_REQUIREMENTS: Elite Purse lethal lookahead allowed except gates 9/10. Still skip Cut if leftover < 2.  
SPELL_DISCOVERY_OPPORTUNITIES: Leftover Lend observe if the third body is present.  
MAP_REQUIREMENTS: Two approaches. Inherit weary plate on a flank.  
SPECIAL_RULES: Two elites cannot 22-every-turn a locked aisle — Muter stays junior. No steal.  
OBJECTIVE: Clear all.  
FAILURE_CONDITION: Player death.  
REWARD: Elite XP/Doka band (1.35× existing `level * 20`). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of leftover-AP at elite sophistication, not more HP.  
SOLVABILITY_REQUIREMENTS: Same as ENC-PURSE-01.  
REPLAYABILITY: Elite N vs E.  
SCALING_BEHAVIOUR: Change the **junior** role (Muter vs Lender), not levels.  
STATUS: PROPOSED

---

### ENC-ELITE-19

ENCOUNTER_ID: ENC-ELITE-19  
TYPE: rare elite / hinge  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Elite Hinge + junior Glance (`FSN-HINGE-GLANCE/E-HINGE`) **or** ENC-COVER-01 if Cover Step exists.  
AI_REQUIREMENTS: Full gates except 9/10. Still skip occupied clockwise dest. Never turn-1 surround.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-HINGE-01 / ENC-COVER-01.  
MAP_REQUIREMENTS: Two flanks + rear. Optional `WF-TEL-BACKSTEP` on a **gallery** (ENC-MOVE-18) so the player can refuse the new front.  
SPECIAL_RULES: Elite Hinge only.  
OBJECTIVE: Clear all.  
FAILURE_CONDITION: Player death.  
REWARD: Elite band. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Mastery of clockwise dest occupancy.  
SOLVABILITY_REQUIREMENTS: Same as ENC-HINGE-01.  
REPLAYABILITY: Pivot W vs S.  
SCALING_BEHAVIOUR: Promote Glance to Cover, not HP.  
STATUS: PROPOSED

---

### ENC-COVER-01

ENCOUNTER_ID: ENC-COVER-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HINGE-COVER` — `hinge_squire` + `cover_squire` (pivot) + `glance_ward`.  
AI_REQUIREMENTS: Cover on the pivot: next hit into the Squire redirects to Cover if adjacent. Glance the player’s new front after the swing. If view unread: Glance Frosts; sheet still teaches Hinge + Cover.  
SPELL_DISCOVERY_OPPORTUNITIES: Cover Step / Hinge / Glance.  
MAP_REQUIREMENTS: Same as ENC-HINGE-01 plus space for an adjacent Cover. Unlock after ENC-HINGE-01 **and** queued `FSN-BRAND-COVER`.  
SPECIAL_RULES: No Vault / Hook / Mist. No Brand on this sheet. If Hinge dies, remaining pair is Cover + Glance — intended.  
OBJECTIVE: Clear all. Intended: Glance/AoE that never targeted the Squire, or pull Cover off.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Swing behind the pivot, then redirect / Glance the new front.  
SOLVABILITY_REQUIREMENTS: Clockwise dest + Cover adjacency walk-offs.  
REPLAYABILITY: Cover west vs east of Hinge.  
SCALING_BEHAVIOUR: Elite Hinge-leader only.  
STATUS: PROPOSED

---

### ENC-WICK-02

ENCOUNTER_ID: ENC-WICK-02  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HINGE-WICK` — `hinge_mason` + `fuse_binder`.  
AI_REQUIREMENTS: Mason paints then steps off. Fuse a choke the player might enter next turn (never a full-HP player’s only tile on turn 1). CELL: **never** swap onto the fuse.  
SPELL_DISCOVERY_OPPORTUNITIES: Hinge Tile / Fuse observe if missing.  
MAP_REQUIREMENTS: Approach plus a gallery. Fuse cell ≠ hinge-tile cell. Unlock after ENC-WICK-01 **or** ENC-TRADE-01.  
SPECIAL_RULES: Do not ship until Hinge Tile is **not** `placeBarrier`. Caster death does **not** cancel the fuse. Nail Down the painter frees the tile. Distinct from ENC-WICK-01 (tile fuse occupancy without enter-swap).  
OBJECTIVE: Clear both. Intended: path around, or Nail Down, or teleport-off the fuse.  
FAILURE_CONDITION: Player death (fuse tick + frost).  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Enter-swap onto a **different** cell than the wick. Two delayed floors, one approach.  
SOLVABILITY_REQUIREMENTS: Gallery; fuse not the only aisle; dest walk-off.  
REPLAYABILITY: Fuse N vs E. High: `/TRAP` BRIGADE only if a second walk-off exists after the tick.  
SCALING_BEHAVIOUR: Elite Mason only. Honesty: missing engines → ENC-WICK-01.  
STATUS: PROPOSED

---

### ENC-BREAK-01

ENCOUNTER_ID: ENC-BREAK-01  
TYPE: priority-target / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BREAK-CHOIR` — `cadence_breaker` + `ignite_alchemist` + `tempo_precentor`. Isolated 1v1 **reroll**.  
AI_REQUIREMENTS: Break once/battle on last owned id with remaining CD > 0. BASE Breaker has **no** Inferno — Alchemist owns Ignite. Tempo gifts the turn **before** the cash. Skip duplicate Tempo.  
SPELL_DISCOVERY_OPPORTUNITIES: Cadence Break / Ignite / Tempo. Optional Flush (`cadence_flusher`) is a **later** peak scaler, not this PAIR-ban (do not pack Flusher with Breaker).  
MAP_REQUIREMENTS: Open court. No Glass Realm. No third DoT.  
SPECIAL_RULES: Unlock after queued `FSN-STACK-CASH` **and** `FSN-TEMPO-CHOIR`. One Inferno **cadence** even if ELITE Breaker holds Inferno after a public first resolve.  
OBJECTIVE: Clear all. Intended: kill the Breaker on the 4 AP dump; Mute the second window; strip stacks before Ignite.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Setup, gift, second window. Kill the buffer, not the sponge.  
SOLVABILITY_REQUIREMENTS: Three bodies start ≥ 4 apart.  
REPLAYABILITY: Breaker N vs E.  
SCALING_BEHAVIOUR: Elite Breaker-leader only. Never add a fourth DoT body.  
STATUS: PROPOSED

---

### ENC-CAP-01

ENCOUNTER_ID: ENC-CAP-01  
TYPE: protection / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CAP-VEIL` — `cap_warder` + `veil_cantor` + `goad_herald`.  
AI_REQUIREMENTS: Cap self before a public swing. Goad. Veil. Herald steps into Strike range. If Cap dies, remaining pair is `FSN-VEIL-GOAD` — intended.  
SPELL_DISCOVERY_OPPORTUNITIES: Turn Cap / Aim Veil / Goad.  
MAP_REQUIREMENTS: Two approaches. Unlock after ENC-VEIL-01 **and** (queued Plate Link or a 12-cap demo).  
SPECIAL_RULES: Next damaging hit after RES/SR is `min(applied, 12)`, then consume. DoT ticks do not consume. Two small hits beat Cap. No Inferno dump into a fresh cap on the same round. No Pain Link.  
OBJECTIVE: Clear all. Intended: two chips, wait expiry, AoE, or Strike the Veil after the round.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Forced 12 into the tank while the glass rejects the tile.  
SOLVABILITY_REQUIREMENTS: Chebyshev-2 tile exists; AoE cell covers Herald.  
REPLAYABILITY: Cap N vs E.  
SCALING_BEHAVIOUR: Elite Cap only.  
STATUS: PROPOSED

---

### ENC-PROT-10

ENCOUNTER_ID: ENC-PROT-10  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× Frost bishop + 1× pawn. Allied object: a **loaned** 1-HP Dummy Post already planted (player-side, does **not** count toward enemy summon cap). If Dummy engine missing, substitute a non-combat shrine pillar (HP 1, not a combatant) — honesty: then this room is ENC-PROT-09 chrome, not Dummy.  
AI_REQUIREMENTS: Hostiles prefer the Dummy/pillar if Chebyshev-1 taunt is live; otherwise the player.  
SPELL_DISCOVERY_OPPORTUNITIES: Dummy Post if the player did not already observe ENC-DUMMY-01.  
MAP_REQUIREMENTS: Pillar/post in mid-court, not on spawn/portal. Gallery around it.  
SPECIAL_RULES: Objective is keep the allied post alive **and** clear hostiles. Failure if the post dies. Player summons may occupy Chebyshev-1 to peel. Bond Oath (ENC-BOND-01) is rest-only, not this room.  
OBJECTIVE: Protect the post; defeat hostiles.  
FAILURE_CONDITION: Allied post HP ≤ 0 **or** player death.  
REWARD: Standard + protect bonus via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: You learned Dummy as an enemy gun; now it is your peel.  
SOLVABILITY_REQUIREMENTS: Path around the post; hostiles cannot spawn adjacent on turn 1.  
REPLAYABILITY: Post center vs flank.  
SCALING_BEHAVIOUR: High: add Goad on the pawn (must swing the post). Never a second allied post.  
STATUS: PROPOSED

---

### ENC-PRIO-12

ENCOUNTER_ID: ENC-PRIO-12  
TYPE: priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Same as ENC-SPARK-01, but the whelp is already planted at battle start on a painted cell.  
AI_REQUIREMENTS: Chanter is current first among hostiles **or** the strip shows who is current. Kill-on-their-turn is the lesson.  
SPELL_DISCOVERY_OPPORTUNITIES: Same as ENC-SPARK-01.  
MAP_REQUIREMENTS: Painted whelp cell. Initiative strip visible (existing HUD).  
SPECIAL_RULES: Real target is the Chanter **after** the whelp’s grant window. Killing the whelp on the Chanter’s turn is the fail of the puzzle, not a wipe.  
OBJECTIVE: Clear all. Optional: whelp dies off the Chanter’s turn.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + tiny skill bonus if the grant was denied (via `applyRewards`). Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Priority is **whose turn it is**, not the highest HP bar.  
SOLVABILITY_REQUIREMENTS: Same as ENC-SPARK-01.  
REPLAYABILITY: Whelp N vs E.  
SCALING_BEHAVIOUR: Do not add a second whelp.  
STATUS: PROPOSED

---

### ENC-MOVE-18

ENCOUNTER_ID: ENC-MOVE-18  
TYPE: movement objective  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop Frost + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-TEL-BACKSTEP` heel inlay on a gallery. Dest is one tile opposite current facing, empty floor, 1 MP. If dest blocked, MP is not spent. Distinct from ENC-MOVE-16 Flank Step (right of facing) and Cardinal Kick. Map solvable without using it.  
SPECIAL_RULES: Honesty: missing facing → dest fails closed (inlay is chrome). Not a teleport spell.  
OBJECTIVE: Defeat both. Optional: use Backstep to break melee once.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach reverse-of-facing step. Prepares ENC-ELITE-19 gallery and Table H `H3` (pivot onto a punched lane).  
SOLVABILITY_REQUIREMENTS: Dest on the walkable graph; not spawn/portal.  
REPLAYABILITY: Heel N vs E.  
SCALING_BEHAVIOUR: Mid: pawn starts adjacent so Backstep is the peel. High: inherit Close Quarters.  
STATUS: PROPOSED

---

### ENC-MOVE-19

ENCOUNTER_ID: ENC-MOVE-19  
TYPE: movement / choice  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop behind a short-path `WF-OBS-COIN_SILL` (wall until adjacent 1 AP opens it). 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop kites in the short-path room after unlatch **or** stays if the sill stays shut. Pawn patrols the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Place only when a second spawn→portal/hostile route already exists. Evaluate solvability **as if the sill were a wall**. Never the only exit. Distinct from Tithe Sill (HP, queued ENC-MOVE-16) and Latch Sill (free end-turn).  
SPECIAL_RULES: Any side may unlatch. No damage. Not a spell.  
OBJECTIVE: Defeat both. Choice: pay 1 AP for the short path, or walk the long way.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn` rewards the long path.  
TACTICAL_PURPOSE: AP is a door, not a nuke.  
SOLVABILITY_REQUIREMENTS: Long path reaches both hostiles and the exit without the sill.  
REPLAYABILITY: Sill N vs E.  
SCALING_BEHAVIOUR: High: bishop is Purse (ENC-PURSE-01) so buying the door **and** holding AP is the trap.  
STATUS: PROPOSED

---

### ENC-ODD-01

ENCOUNTER_ID: ENC-ODD-01  
TYPE: rare elite / choice  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-ELT-ODD_PICKET` elite alone (no extra pawn). Same-tier × hard.  
AI_REQUIREMENTS: Present odd, absent even. Extra spells `usableByEnemy` only.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Post floor. Exit reachable without touching. In dungeon they are required for clear.  
SPECIAL_RULES: Counts as 1 enemy. Even absence is not a wall and not a kill. Honesty: missing parity → ENC-ELITE-01.  
OBJECTIVE: Defeat the picket on odd.  
FAILURE_CONDITION: Player death.  
REWARD: Hard multiplier on `applyRewards`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Choice/rest-adjacent elite: wait even to reposition, fight odd.  
SOLVABILITY_REQUIREMENTS: Same as ENC-AMBUSH-10.  
REPLAYABILITY: Post N vs E.  
SCALING_BEHAVIOUR: Peak: kit is `hold_knight` or `pair_porter` witness — still one body.  
STATUS: PROPOSED

---

### ENC-VOW-01

ENCOUNTER_ID: ENC-VOW-01  
TYPE: spell-discovery / choice  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-VOW_KEEPER` — one same-tier enemy (medium) carrying 1 extra `usableByEnemy` spell (`starter-frost` or a already-observed id — never barrier/mirror/timestep).  
AI_REQUIREMENTS: Uses the extra id if legal. After adjacent 1 AP silence, that id is gone for the map.  
SPELL_DISCOVERY_OPPORTUNITIES: Killing without silencing grants that spell as a **single remaining cast this map**. Silence: they lose it and you do **not** gain it. Does not call `upgradeSpell`. Does not persist `spellLevel*` arrays. Distinct from Page Thief (you steal the cast) and Grave Scribe (queued ENC-SCRIBE-01).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn. Must stay reachable.  
SPECIAL_RULES: Does not stack. Metadata only.  
OBJECTIVE: Defeat them. Optional: silence then leave; or kill for the one-cast.  
FAILURE_CONDITION: Player death.  
REWARD: Standard; one-cast is not a persist unlock. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Discovery without a persist writer. Choice: disarm vs steal-once.  
SOLVABILITY_REQUIREMENTS: Reachable; under `MAX_ENEMIES`.  
REPLAYABILITY: Extra id Frost vs Poison (still catalog ids).  
SCALING_BEHAVIOUR: High: extra id is Walk Toll **if** observed this chain. Never a persist grant.  
STATUS: PROPOSED

---

### ENC-BOND-01

ENCOUNTER_ID: ENC-BOND-01  
TYPE: optional challenge / rest-adjacent  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: None required (rest overlay) **or** 1× Frost bishop if rolled as a mid dungeon insert.  
AI_REQUIREMENTS: If a bishop is present, kite only.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-RSK-BOND_OATH` bronze-slate inlay. Optional. Inverse of queued ENC-SOLO-01 (no-pet wager). Rest maps: shrine already `normal` / `dungeon` / `boss`.  
SPECIAL_RULES: End a turn on the inlay to flag this map. Next `applyRewards` uses the hard multiplier **if** at least one living player-side summon exists at credit. If none, the flag does nothing. Enemy summons do not count. Death still `saveBattleStats`. Forbidden as a dungeon **required** fail.  
OBJECTIVE: Optional wager. If hostiles present, defeat them.  
FAILURE_CONDITION: Player death only (wager miss is not a fail).  
REWARD: Hard multiplier **or** standard. Overlay none (the wager *is* the challenge).  
TACTICAL_PURPOSE: Keep a pet alive until credit, or stay unflagged.  
SOLVABILITY_REQUIREMENTS: Map solvable if the inlay is never used.  
REPLAYABILITY: Inlay N vs E.  
SCALING_BEHAVIOUR: Do not raise the multiplier with player level.  
STATUS: PROPOSED

---

### ENC-RARE-10

ENCOUNTER_ID: ENC-RARE-10  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-REEL-CORNER` COURT — file pull + blocked-LoS poke + pylon/span, leader. Cap summons at 2. Skip Triple Plug.  
AI_REQUIREMENTS: Leader boost default 10% per fallen non-leader. Reel dest walk-off. Corner needs a public block.  
SPELL_DISCOVERY_OPPORTUNITIES: File Reel / Blind Corner if not already granted.  
MAP_REQUIREMENTS: File + a blocked-LoS corner + gallery. Unlock after ENC-REEL-01 **and** ENC-VEIL-01 / ENC-CORNER-01.  
SPECIAL_RULES: Insert; does not replace a beat. No lava on reel dest.  
OBJECTIVE: Clear the court.  
FAILURE_CONDITION: Player death.  
REWARD: Rare elite band (1.60×). Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Pull onto a blocked-LoS cash. Combination of day-9 corner fog and day-10 reel.  
SOLVABILITY_REQUIREMENTS: Gallery; dest walk-off; pylon not sealing the only aisle.  
REPLAYABILITY: Court rotation 90°.  
SCALING_BEHAVIOUR: Change which junior is elite, not HP. Honesty: missing pylon → `FSN-REEL-TITHE` plus Corner Frost.  
STATUS: PROPOSED

---

### ENC-TREAS-10

ENCOUNTER_ID: ENC-TREAS-10  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Optional 1× pawn guardian **or** none if the player pays the Coin Sill and walks.  
AI_REQUIREMENTS: Pawn greedy if present.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-OBS-COIN_SILL` short path to a visible chest. Long path always exists. Chest credit via persist-lock `applyRewards` (medium). Distinct from Wound Cache (queued, HP gate) and Stride Cache (queued ENC-TREAS-09).  
SPECIAL_RULES: 1 AP unlatch. Guardian only if the short path is taken **and** a spawn slot remains. Skip chest if solvability would fail. `doka_fever` stays opt-in from older catalogs, not this primer.  
OBJECTIVE: Optional chest. Defeat guardian if present. Exit always available via long path.  
FAILURE_CONDITION: Player death. Skipping the chest is success.  
REWARD: Medium chest grant **or** nothing. Overlay none.  
TACTICAL_PURPOSE: Spend 1 AP for loot, or keep AP for ENC-PURSE-01 later in the chain.  
SOLVABILITY_REQUIREMENTS: Long path to exit without unlatch.  
REPLAYABILITY: Sill N vs E.  
SCALING_BEHAVIOUR: High: guardian is Vow Keeper (ENC-VOW-01). Never a second chest.  
STATUS: PROPOSED

---

### ENC-REST-10

ENCOUNTER_ID: ENC-REST-10  
TYPE: rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Rest reminder for Gait Mend / Walk Toll / Dummy Post if observed this chain and not owned — reminder, not a grant.  
MAP_REQUIREMENTS: Existing rest map. White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`). Optional `WF-PRT-HEARTH_GATE` as an **extra** overworld portal (full HP gamble) — never the only exit, never in dungeon/boss rush/Death Realm. Snapshot dungeon-chain refs **before** `cleanupMap`. Rest-exit must re-arm depth 1 (`shouldArmDungeonChainOnRestExit`).  
SPECIAL_RULES: Choices: heal via existing rest / doka-to-HP (must **not** set `healUsed` if overworld Doka-to-HP), take Hearth while at 100% HP, flag Bond Oath (ENC-BOND-01), or leave.  
OBJECTIVE: Choose and leave.  
FAILURE_CONDITION: None (leaving is success). Death Realm still if they somehow die.  
REWARD: None unless Hearth / Bond fires `applyRewards`.  
TACTICAL_PURPOSE: Choice/rest beat after purse/hinge/gait pressure.  
SOLVABILITY_REQUIREMENTS: Stable portal always reachable.  
REPLAYABILITY: Hearth present vs absent.  
SCALING_BEHAVIOUR: Do not add enemies to rest.  
STATUS: PROPOSED

---

### ENC-BRANCH-10

ENCOUNTER_ID: ENC-BRANCH-10  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn. Four locked color portals after clear.  
AI_REQUIREMENTS: Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Four-way foyer. Snapshot `branch: purse | hinge | gait | dummy` **before** `cleanupMap`. Portals are not `(0,0)`. White portal not used here.  
SPECIAL_RULES:  
- `purse` → ENC-PURSE-01 → ENC-POST-01 → ENC-BOSS-10 (`pale_archivist`)  
- `hinge` → ENC-HINGE-01 → ENC-COVER-01 → ENC-BOSS-10 (`void_grandmaster`)  
- `gait` → ENC-GAIT-01 → ENC-EVEN-01 → ENC-BOSS-10 (`bone_cavalier`)  
- `dummy` → ENC-DUMMY-01 → ENC-PROT-10 → ENC-BOSS-10 (`weeping_pawn`)  
Do not spawn Wave-10 boss ids.  
OBJECTIVE: Clear foyer; pick a branch.  
FAILURE_CONDITION: Player death.  
REWARD: Standard foyer. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Four verbs, four capstones. Rare rooms insert; they do not replace the foyer.  
SOLVABILITY_REQUIREMENTS: Four portals reachable after clear; pawn not on a portal.  
REPLAYABILITY: Portal colors permute.  
SCALING_BEHAVIOUR: Do not add a fifth branch.  
STATUS: PROPOSED

---

### ENC-MINI-11

ENCOUNTER_ID: ENC-MINI-11  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: One elite by `branch`: purse → elite Purse; hinge → elite Hinge; gait → elite Boot (or Gait Mender if Boot writer missing); dummy → elite Dummy owner (`dummy_prelate`). Plus 1× junior Frost. Not a `BossId`.  
AI_REQUIREMENTS: Elite gates except 9/10. Junior kites.  
SPELL_DISCOVERY_OPPORTUNITIES: Branch verb if not yet granted.  
MAP_REQUIREMENTS: Branch-skinned: purse two approaches; hinge two flanks; gait 3-tile + gallery; dummy Chebyshev-2 ring.  
SPECIAL_RULES: Depth 3–4 insert before ENC-BOSS-10. No dual elite.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss band (1.35×). Overlay `under_8_ap_per_turn` (purse/gait) or `direct_hit` (hinge/dummy).  
TACTICAL_PURPOSE: Exam of the foyer verb before the live 19-id capstone.  
SOLVABILITY_REQUIREMENTS: Branch walk-offs as in the source rooms.  
REPLAYABILITY: Four skins.  
SCALING_BEHAVIOUR: Junior role changes, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-10

ENCOUNTER_ID: ENC-BOSS-10  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: purse → `pale_archivist` (tempo / leftover); hinge → `void_grandmaster` (displacement); gait → `bone_cavalier` (charge after a walk); dummy → `weeping_pawn` (bait / 1-HP themed). If the chain taught decoy (ENC-PRIO-04) **and** dummy was not taken, mixed accounts may use `final_pawn` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** spawn `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` here.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-11) or spark (ENC-SPARK-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Branch skins: purse may inherit a weary plate off the only path; hinge may inherit a Backstep gallery; gait may inherit even-runway paint (chrome if writer missing); dummy may inherit a wide courtyard (no sealed larva pocket).  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: leftover / hinge dest / paid step / 1-HP bait.  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-10

ENCOUNTER_ID: ENC-MAST-10  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn; weary plate live. Wave 2: `FSN-PURSE-MUTE` **or** `FSN-HINGE-GLANCE` **or** Gait Choir **or** Dummy+Return by `branch`. Wave 3: elite leftover (E-CUT **or** E-HINGE **or** E-BOOT **or** E-DUMMY) + leftover.  
AI_REQUIREMENTS: Full sophistication allowed (lethal lookahead, overkill spill, LoS reposition, backline guard) except gates 9/10.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines weary plate (HAZ-19), turnstile plus (HAZ-20, optional), and branch walk-offs from ENC-BRANCH-10. Coin Sill **off** here (that is ENC-MOVE-19). Odd Picket **off** here (that is ENC-SURV-20).  
SPECIAL_RULES: Portal locked until wave 3 clear.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove leftover spend, clockwise dest, paid even step, or dummy peel.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one dry path; plus hollow optional.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role**, not its level.  
STATUS: PROPOSED

---

### ENC-RUSH-35

ENCOUNTER_ID: ENC-RUSH-35  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table H `H0`: `crypt_sexton` + `cinder_lance`. Combined mechanic: “Stand the wick **this** turn, or shoot the window before it opens.” Plus ENC-HAZ-19 weary-plate chrome (one bronze plate in the reachable set, not a new boss). Wick/pit **never** occupies a telegraphed lance tile. Weary plate **never** occupies a lance glow tile.  
AI_REQUIREMENTS: Existing combined mechanic. Grate and Brazier are both objects. Convert still waits 1 turn. Wrong-element still −50%. Trash does not receive lance heals.  
SPELL_DISCOVERY_OPPORTUNITIES: None (Rush is a mastery product).  
MAP_REQUIREMENTS: Current Rush preferred-cell solvability. Plate ⊆ reachable floor, not a preferred boss cell, not a lance glow, not a crypt wick.  
SPECIAL_RULES: `rushVariant: table_h0`. Persist still goes through `persistBossRushRoomClear` / `completeBossRushRoom` (client `dokaReward`/`xpReward` ignored). Unlock: one complete Table G clear. First Table H clear: no plate chrome. Later clears: ENC-HAZ-19 highlight. Hold if Pit Wick or lance objects are missing. Not Fosse / Wick-prelate / Lintel. Crypt + Fosse / Lintel / Palisade / Lock is illegal — this pairing is Cinder only.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death → abort rush (`resetRunState`).  
REWARD: Table H H0 table + tiny bonus if the player never dumped a 2+ AP end on the plate (skill, via `applyRewards`).  
TACTICAL_PURPOSE: Escalate H0 by teaching spent-end tax in the dungeon, then lighting the plate — not more HP.  
SOLVABILITY_REQUIREMENTS: Preferred cells + plate reachable. Hazard total ≤ 50. Wick never on lance glow.  
REPLAYABILITY: Plate W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Later “endless rush” at ENC-REST-10 may add the ENC-HAZ-19 plate (cap 1), never a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-36

ENCOUNTER_ID: ENC-RUSH-36  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table H `H1`: `march_prefect` + `silent_conductor`. Combined mechanic: “Take the required 1-MP step **on a sounding file**, then cast.” Plus ENC-TOLL-02 / ENC-EVEN-01 chrome (even-runway paint on the sounding file). Silence **never** forces a step off the sounding file.  
AI_REQUIREMENTS: Existing combined mechanic. Pulpit sits on a silenced file (tempting a plant). Musicians only (cap 4).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Sounding file is a 2-step (even) runway. Preferred cells free.  
SPECIAL_RULES: `rushVariant: table_h1`. Hold if Must Pace or silence objects are missing. Player Must Pace cannot refuse first-consume. Not Stride / Oath / Gaze / Levy. March + Goad is illegal (this pairing is Conductor).  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table H H1 table + tiny bonus if the required step stayed on the sounding file (skill).  
TACTICAL_PURPOSE: Add the walk-pool / even-step verb the Gait primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + sounding file reachable. Required step stays on the file.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by musician count (cap 4), not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-37

ENCOUNTER_ID: ENC-RUSH-37  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table H `H2`: `aisle_canon` + `ram_castellan`. Combined mechanic: “Ram answers **one** post of a three-post chain.” Plus ENC-DUMMY-01 chrome (one Dummy Post in the reachable set — counts as 1, **not** a Triple Span body). Ram ray **never** occupies **all** living posts.  
AI_REQUIREMENTS: Existing combined mechanic. Brace and Rood are both objects. Extra posts are not slam-faces. Dummy is not a boss.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Three-post chain in the reachable set. Preferred cells free. Remaining summon cap must fit Dummy (1) plus existing Rush summons (cap 2 total living summons).  
SPECIAL_RULES: `rushVariant: table_h2`. Hold if Triple Span objects **or** Dummy engine are missing — do **not** fake three posts with world walls. Player Triple Span cannot plant 4. Not Span / Palisade / Fosse / Lock / Mill. Aisle + Crypt is illegal (this pairing is Ram).  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table H H2 table + tiny bonus if Dummy died off the ram ray (skill).  
TACTICAL_PURPOSE: Add the 1-HP post verb without raising `ENEMY_SUMMON_CAP`.  
SOLVABILITY_REQUIREMENTS: Preferred cells + posts reachable. Ram never occupies all living posts.  
REPLAYABILITY: Chain N vs E.  
SCALING_BEHAVIOUR: Do not add a fourth post. Do not raise summon cap in this room.  
STATUS: PROPOSED

---

### ENC-RUSH-38

ENCOUNTER_ID: ENC-RUSH-38  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table H `H3`: `orbit_succentor` + `ivory_palisade`. Combined mechanic: “Pivot onto a punched lane, not into a sealed pocket.” Plus ENC-MOVE-18 Backstep chrome (one heel inlay on a punched lane). Dest **never** into a sealed pocket (`finalizePlayableLayout` after pivot). Landing must stay on a **punched** lane. Ambit is **not** a stake.  
AI_REQUIREMENTS: Existing combined mechanic.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Punched lane + gallery. Heel dest on the graph. Preferred cells free.  
SPECIAL_RULES: `rushVariant: table_h3`. Hold if Pivot Foe or palisade objects are missing. Player Pivot Foe cannot orbit a third body. Not Hinge / Grandmaster / Counter / Morrow / Fortress. Orbit + Crypt / Fosse / Wick is dest-onto-hazard — illegal (this pairing is Palisade).  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table H H3 table + tiny bonus if the player never pivoted into a would-be pocket (skill).  
TACTICAL_PURPOSE: Add reverse-step / punched-lane occupancy the Hinge primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + punched lane reachable. Pivot dest never a sealed pocket.  
REPLAYABILITY: Lane N vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by palisade iron-skin, not HP.  
STATUS: PROPOSED

---

## 5. Suggested chains

### Chain K — “Purse Primer” (maxDepth 4)

ENC-TEACH-10 → ENC-HAZ-19 → ENC-PURSE-01 → ENC-REST-10 → ENC-BOSS-10 (`pale_archivist` if foyer chose purse; default still reads `branch`).

### Chain L — “Hinge Primer” (maxDepth 5)

ENC-HINGE-01 → ENC-MOVE-18 → ENC-COVER-01 → ENC-WICK-02 → ENC-BRANCH-10 → ENC-BOSS-10.

### Chain M — “Gait Primer” (maxDepth 5)

ENC-SPELL-19 → ENC-TOLL-02 → ENC-GAIT-01 → ENC-EVEN-01 → ENC-MAST-10 → ENC-BOSS-10 (`bone_cavalier`).

### Chain N — “Dummy Primer” (maxDepth 4)

ENC-DUMMY-01 → ENC-PROT-10 → ENC-SPARK-01 → ENC-REST-10 → ENC-BOSS-10 (`weeping_pawn`).

### Rush injection (day-10)

After one full Table G clear, ENC-REST-10 shrine can enable: H0 → ENC-RUSH-35, H1 → ENC-RUSH-36, H2 → ENC-RUSH-37, H3 → ENC-RUSH-38. Days 1–9 flags for rooms 0–9 and Tables B–G remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-10, ENC-SPELL-19, ENC-SPELL-20, ENC-TOLL-02, ENC-VOW-01 | `under_15_turns` / `under_8_ap_per_turn` |
| ENC-HAZ-19, ENC-HAZ-20, ENC-MOVE-18, ENC-WICK-02, ENC-EVEN-01 | `under_50_damage` |
| ENC-WAVE-11 | `under_10_turns` |
| ENC-PROT-10, ENC-CAP-01, ENC-VEIL-01, ENC-DUMMY-01 | `direct_hit` |
| ENC-ELITE-18, ENC-PURSE-01, ENC-POST-01, ENC-BREAK-01 | `under_8_ap_per_turn` |
| ENC-SURV-19, ENC-SURV-20 | `no_healing` (not `no_damage_taken`) |
| ENC-HINGE-01, ENC-PAIR-01, ENC-SPARK-01, ENC-PRIO-12, ENC-ODD-01 | `under_15_turns` |
| ENC-TREAS-10 / ENC-REST-10 / ENC-BOND-01 / ENC-MOVE-19 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | weary plate **or** leftover-AP tell | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | plate **or** backstep **or** even runway | kill + optional glyph |
| MID | named drop-8 `FSN-*` or Wave 9 pair | backline guard | zone 1 + Purse/Hinge/Gait | one leftover `WF-*` | clock / tags / coin sill |
| HIGH | elite or picket | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / dummy / post lock |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table H |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit weary plate, open a second gallery, enable Purse Cut) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure from older catalogs, not this primer.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose prior-day fields plus:

```
encounterId
encounterType        // + purse_mute | hinge_glance | post_tithe | reel_tithe
                     //   | veil_goad | spark_split | gait_choir | pair_peel
                     //   | dummy_post | even_toll | walk_toll | weary_plate
                     //   | turnstile_plus | odd_picket | coin_sill | backstep
                     //   | vow_keeper | bond_oath | hinge_cover | hinge_wick
                     //   | break_choir | cap_veil | reel_corner
formationId?         // FSN-PURSE-MUTE | FSN-HINGE-GLANCE | FSN-VEIL-GOAD |
                     // FSN-SPARK-SPLIT | FSN-HINGE-WICK | FSN-POST-TITHE |
                     // FSN-PURSE-COURT | FSN-REEL-TITHE | FSN-HINGE-COVER |
                     // FSN-VEIL-CORNER | FSN-BREAK-CHOIR | FSN-CAP-VEIL |
                     // FSN-REEL-CORNER
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // leftover WF: WEARY_PLATE, COIN_SILL, BACKSTEP,
                     // ODD_PICKET, VOW_KEEPER, BOND_OATH, TURNSTILE_EMBER
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // purse | hinge | gait | dummy
wearyPlateCell?
oddRoundPresent?
backstepDest?
dummyPostId?
evenStrideArmed?
holdPortalLocked?
objectiveKind        // + survive_turns | unlatch_sill | protect_dummy
                     //   | deny_whelp_grant | odd_engage
failureKind
deviceTable[]        // ENC-TREAS-10
rushVariant?         // table_h0 | table_h1 | table_h2 | table_h3
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Crypt Sexton” logic — use `formationId` / `realId` / `dummyPostId` / `wearyPlateCell`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-26 IDs (including queued PRs #347 / #396 / #479 / #519 / #574 / #635).
- Touching `docs/WORLD_DYNAMICS.md`, `worldFeatures.ts`, formation PDFs, or `BOSS_AND_SPELL_DISCOVERY.md` in this change (those files are already on older open PRs).
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush / Table H only).
- Adding Wave-10 `crypt_sexton` / `march_prefect` / `aisle_canon` / `orbit_succentor` to live `BOSS_IDS` in the same PR as a room remap.
- Consuming a same-day 2026-09-27 Wave 10 family / spell / world-feature catalog as required engines — those files are not on this branch.
- Spawning `FSN-TRIPLE-PLUG` while live `ENEMY_SUMMON_CAP` is 2.
- Faking Purse Cut without leftover-AP ≥ 2, Hinge without an ally dest, Gait Mend without walk-spend, Pair Hinge as Swap, Dummy as Bait Pylon, Walk Toll as Ley `mpCost`, Odd Picket as a sleeping camp, Backstep without facing.

---

## 10. Pick order (day-10, after days 1–9 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 through day-9 pick orders still win if those verbs are missing (see those files / PRs).

Once those exist, implementers should pick:

1. ENC-TEACH-10 + ENC-SPELL-19 (leftover-AP / gait-walk verbs)  
2. ENC-WAVE-11 (`formationId` PURSE-MUTE → HINGE-GLANCE, with honesty fallbacks)  
3. ENC-PURSE-01 or ENC-HINGE-01 or ENC-GAIT-01 or ENC-DUMMY-01 (new pressure objects)  
4. ENC-BRANCH-10 (`branch: purse|hinge|gait|dummy` snapshot-before-cleanup)  
5. ENC-BOSS-10 branch read  
6. Rush Table H variants 35–38 one room at a time (after the account has one full Table G clear)

Uniqueness: this file is the **tenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
