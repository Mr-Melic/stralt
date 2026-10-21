# Encounter Evolution Catalog — 2026-10-21

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-10-21-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737), `ENCOUNTER_EVOLUTION_2026-09-29.md` (`EED-2026-09-29-001`, PR #771). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-12 Wave 11 packs `docs/design/ENEMY_FORMATIONS_2026-09-29.md` (PR #794), Wave 12 world features in `docs/WORLD_DYNAMICS.md` (PR #786, `WDD-2026-09-29-001`), Rush Table K `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.10 (PR #808). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-calendar-day (2026-10-21) Wave 13 family / spell / world-feature catalogs, if any land in parallel, stay **unconsumed**. Wave 12 **families** (`flush_psalmist` is a **boss** id, not a family — Wave 12 elite sheets live in PR #796) wait for a later formation drop (drop 13). Wave 13 **bosses** stay Rush-only (Table K).

---

## 1. Why a thirteenth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–12 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, Pace/Nail/Flush, and Bash/Dry/Hood. Day-12 rooms spent leftover drop-11 packs (`FSN-SHOVE-BASH`, `FSN-DRY-TAX`, `FSN-WICK-HOOD`, …) and Wave 11 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

This run is the first catalog after 2026-09-29. The gap does not authorize rewriting those sheets. It spends verbs that day-12 **explicitly left on the table**.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-12 Wave 11 packs | Day-12 taught shove-mend / leftover-**AP** / far-hood as **rooms**. Still PDFs: `FSN-BOTH-SPEND`, `FSN-STRIDE-DAMP`, `FSN-NEAR-MUST`, `FSN-PAINT-NOOK`, `FSN-ALLY-SILL`, `FSN-BODY-CLASH`, `FSN-LAVA-STILL`, `FSN-BRICK-WATCH`, `FSN-BOTH-CHOIR`, `FSN-STRIDE-BANK`, `FSN-NEAR-STEP`, `FSN-SHOVE-PACE`, `FSN-TRIM-TAX`, `FSN-STRIDE-PULPIT`, `FSN-BOOT-OATH`, `FSN-CAST-QUIET` |
| World-feature Wave 12 | Day-12 **rooms** never spent `WF-HAZ-BOND_SEAM`, `WF-HAZ-SHY_CINDER`, `WF-TRP-SIDE_PLATE`, `WF-TER-BLAST_URN`, `WF-OBS-HEAL_SILL`, `WF-ZON-LABOR_FONT`, `WF-TEL-CLEAR_STEP`, `WF-INV-HOLLOW_FILE`, `WF-ELT-HIGH_PICKET`, `WF-TRS-HIRE_CACHE`, `WF-SPL-MERCY_SCRIBE`, `WF-RSK-BAND_OATH`, `WF-MOD-ORTH_STEP`, `WF-EVT-MERCY_BELL`, `WF-ENV-EXIT_DRAFT` |
| Rush Table K | `K0`–`K3` (`flush_psalmist`+`gaze_beadle`, `lone_lector`+`aisle_canon`, `plate_bursar`+`ram_castellan`, `lend_proctor`+`brick_cellarer`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `bondSeamCells` / `shyCinderCell` / `sidePlateCell` / `blastUrnCell` / `healSillCell` / `laborFontCell` / `clearStepPads` / `exitDraftRing` / `orthStepArmed` / `highPicketArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post counts as **1**. Penta Plug / `FSN-CAST-QUIET/PENTA` count as **5** — do not spawn them while remaining cap < 5 (live cap is 2).
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Both / stride / clash / labor bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Both Mend / Clash Mend / Spent Lend live **only** on the named profiles.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-TALLY_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still). Forbidden in dungeon, boss rush, and Death Realm. `WF-EVT-MERCY_BELL` is exploration only (run maps require a clear).
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-13 ids (`flush_psalmist`, `lone_lector`, `plate_bursar`, `lend_proctor`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Pair Pace / Home Step / Ally Step / Foe Reel / Paint Reel / Init Swap / Clear Step **does not** count as walk-MP for Both Mend, Spent Lend, Damp Sting, Stride Keep, Gait Sip, Must Step, or Stride Mark.
- Ally Step dests are occupancy cells, **not** `isSwap`. Paint Reel is the **fourth** `applyAttract` dest (file / ally / foe / then paint). Clash Mend pays only if the **target Struck** this turn (`physical_attack` / `isPhysical: true`). Walk / shove / DoT / lava do not pay it. Near Hood zeros a hit from Chebyshev ≤ 1, not ≥ 3 (that is Far Hood / ENC-HOOD-01). Must Step forces remaining walks Chebyshev **1**, not Manhattan 2 (that is Must Span).
- Live families stay the seven overlays in `FAMILY_TYPES` (`wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`). Proposed Wave 11 family ids on a sheet are **metadata locks**, not a 30% lottery.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-BOTH-01 / ENC-SPELL-25 / ENC-ELITE-24 | `walkMpSpentThisTurn` on **both** bodies **or** ally `targetId` for Spent / Spare | Convert to ENC-PACE-01 (queued day-11) without claiming Both |
| ENC-DAMP-01 / ENC-ELITE-25 (bank skin) | leftover-**MP** snapshot paid at next own turn start | Convert to ENC-DRY-01 (queued day-12) without claiming Damp / Keep |
| ENC-NEAR-01 / ENC-SPELL-26 | Near Hood range consume **or** Must Step Chebyshev-1 with a legal 1-step | Convert to ENC-HOOD-01 (queued day-12) without claiming Near |
| ENC-PAINT-01 | fourth `applyAttract` dest (paint) **or** exactly-one-block scan | Convert to ENC-FANG-01 (queued day-12) without claiming Paint / Nook |
| ENC-ALLY-02 | Ally Step relocate (not `isSwap`) **or** Cast Sill non-physical refuse | Convert to ENC-HOME-01 (queued day-12) without claiming Ally Quiet |
| ENC-CLASH-01 | `struckThisTurn` on the striker **or** Body Sill primary-only | Convert to ENC-BASH-01 (queued day-12) without claiming Clash |
| ENC-SKIP-01 | 1-tile lava-as-floor **or** leftover-MP-0 +RES | Convert to ENC-SLIP-01 (queued day-9) without claiming Skip |
| ENC-BRICK-01 | erase an **existing** barrier (not a wall punch) **or** Watch Mute consume | Convert to ENC-WIPE-01 (queued day-12) without claiming Brick |
| ENC-PACE-02 | `forcedMovedThisTurn` **and** Pair Pace occupancy dests | Convert to ENC-EXIT-01 (queued day-12) without claiming Pace |
| ENC-TRIM-01 | `lastResolvedSpellId` **or** Trim 0-stays-0 | Convert to ENC-STRETCH-01 (queued day-12) without claiming Trim |
| ENC-QUIET-01 / ENC-RARE-13 | Cast + Quiet on **two different tiles** **or** Tool Hold until Strike | Convert to ENC-HOLD-03 (queued day-12) without claiming Quiet |
| ENC-PROT-13 | Labor Font 2-AP drink **or** Hollow File soft-threat extras | Convert to ENC-PROT-12 (queued day-12) without claiming Labor |
| ENC-PRIO-15 | living ≤30% end-of-turn one-cast **without** `upgradeSpell` | Convert to ENC-MARK-01 (queued day-12) without claiming Mercy Scribe |
| ENC-AMBUSH-13 / ENC-HIGH-01 | elite appears only while current HP ≥ 80% max | Convert to ENC-AMBUSH-12 (queued day-12, <70%) without claiming High |
| ENC-SURV-25 | end-of-turn Manhattan-2 portal ring tax | Convert to ENC-SURV-23 (queued day-12) without claiming Draft |
| ENC-MOVE-24 | wall→floor after a recorded **heal** while adjacent | Convert to ENC-MOVE-23 (queued day-12, walk-MP sill) without claiming Heal |
| ENC-MOVE-25 / ENC-CLEAR-01 | empty-dest pad (occupied dest spends **0** MP) | Convert to ENC-INIT-01 (queued day-12, swap) without claiming Clear |
| ENC-RUSH-47…50 | Table K bosses + psalter/ambo/aumbry/coffer objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Both / Stride / Near primer + inserts)

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

| Beat | Depth hint | Job | Day-13 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (bonded-seam hop, dual-walk heal, fleeing cinder) | ENC-TEACH-13, ENC-SPELL-25, ENC-HAZ-25 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-14, ENC-AMBUSH-13, ENC-SPELL-26 |
| Combine | 2–3 | Two taught verbs | ENC-BOTH-01, ENC-DAMP-01, ENC-NEAR-01, ENC-HAZ-26, ENC-MOVE-24 |
| Pressure | 3 | Clock, cluster, pull-to-paint, or dual sill | ENC-SURV-25, ENC-PROT-13, ENC-PAINT-01, ENC-CLASH-01, ENC-PRIO-15, ENC-QUIET-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-13, ENC-BRANCH-13, ENC-TREAS-13, ENC-HIRE-01, ENC-BAND-01, ENC-MERCY-02 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-24, ENC-ELITE-25, ENC-RARE-13, ENC-MAST-13, ENC-SKIP-01, ENC-PACE-02 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-14, ENC-BOSS-13, ENC-RUSH-47…50 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–12 remain valid. Day-13 **Both / Stride / Near primer** is the default for accounts that already cleared Bash / Dry / Hood once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-13

ENCOUNTER_ID: ENC-TEACH-13  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families, no player-side summon required.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a pet-bond tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile copper ribbon of `WF-HAZ-BOND_SEAM` across the mid-band (walk tiles are free **unless** a living allied summon exists; then each seam step costs 4% max HP). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First bonded-seam tax (only possible if the player already summoned) logs a teach line. Do not also apply Late Seam (ENC-TEACH-12: first **cell** free) or Salt Crust (ENC-HAZ-05). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: never summon this room, or walk the dry detour with a pet out.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the seam is free until you bring a friend; the pet is the tax.” Prepares ENC-HAZ-26 / ENC-HIRE-01 (you will **want** a summon on a different tile).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the ribbon **or** the dry detour. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-SHY_CINDER` on a **gallery** (`inheritHazardsFrom: ENC-HAZ-25`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-25

ENCOUNTER_ID: ENC-HAZ-25  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand next to the orb **once**. Wounded pawns treat the orb’s **next flee cell** like lava (`ENEMY_HAZARD_AVOID_HP_PCT`). Bishop kites off the painted chevron.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without an orb tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: One `WF-HAZ-SHY_CINDER` on a mid-court floor cell (at round start steps one tile **away** from the nearest living unit; 5% max HP on land). A floor path around the orb remains. Exit behind the bishop. Distinct from Hunting Lantern (steps toward the last MP spender), Orbiting Cinder (clockwise square), Rim Cinder (outer ring), and Skipping Cinder (2-tile hop).  
SPECIAL_RULES: Scripted shy orb only. Never starts on spawn/portal. Tax via challenge HP recorders. If every flee step is blocked it stays.  
OBJECTIVE: Clear all. Intended: give it space so it drifts off the path, or pin it into a corner.  
FAILURE_CONDITION: Player death (frost + orb tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing the land cell.  
TACTICAL_PURPOSE: Teach “this ember runs **from** you; crowding it is the tax.” Distinct from hunting and orbiting orbs.  
SOLVABILITY_REQUIREMENTS: Path around the orb; orb is floor, not a wall. Counts as 1 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Start cell west court vs east court.  
SCALING_BEHAVIOUR: Mid: inherit 2 bond-seam tiles on a **gallery** (`inheritHazardsFrom: ENC-TEACH-13`). High: bishop gains `spell-slow`. Never two shy cinders.  
STATUS: PROPOSED

---

### ENC-HAZ-26

ENCOUNTER_ID: ENC-HAZ-26  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn charger. No kin-family overlay.  
AI_REQUIREMENTS: Bishop kites on cardinal files. Pawn may take a diagonal if `WF-MOD-ORTH_STEP` is on (pays 2 MP). No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: The ENC-TEACH-13 bond-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-13`) **plus** `WF-MOD-ORTH_STEP` armed (orthogonal neighbor = 1 MP; diagonal neighbor = 2 MP). A cardinal dry detour exists. Distinct from Crosswind (slide after a paid step) and Tight Grip (0-MP spells cost 1).  
SPECIAL_RULES: Scripted seam + orth only. Attack Nearest is not a walk. Ice / slime doublers still apply to the paid cost. Tax via challenge HP.  
OBJECTIVE: Clear all. Intended: walk the cardinal dry path; do not diagonal-cut the seam with a pet out.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a pet-bond tax with a diagonal surcharge so “cut the corner with a Wisp out” is the expensive line.  
SOLVABILITY_REQUIREMENTS: Cardinal path reaches both hostiles and the exit. Seam not on spawn/portal.  
REPLAYABILITY: Ribbon N-S vs E-W. High: enable a player-facing Spent Lend pawn (ENC-BOTH-01) so the pack can **fund** a 2-MP diagonal.  
SCALING_BEHAVIOUR: High: enable Spent Lend. Peak: add `WF-ENV-EXIT_DRAFT` so ending next to the portal after the cut is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-25

ENCOUNTER_ID: ENC-SPELL-25  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-BOTH-SPEND/SOLO-MEND` fallback — 1× `both_mender` queen (`spell-both-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Spent Lend off until band 1 honesty.  
AI_REQUIREMENTS: Mender Shields, then mends **only** if `walkMpSpentThisTurn` is true on **both** the mender and the carry; otherwise Shield / skip. Never drain / nova / Gait / Chase / Shove / Clash Mend. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-both-mend` (heal 8 iff **both** already spent walk MP this turn) can drop that id if missing. Extra door `both_cantor` — first child wins vs a later observe. Do not restamp claimed feats.  
MAP_REQUIREMENTS: Open court. No lava. One locked exit. Mender needs a tile at range 3 that is **not** the only aisle.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing walk-spend writer → Shield queen (still a valid teach: they did **not** mend after a stand). Do not fake the heal with `starter-heal`. Distinct from ENC-SPELL-21 (caster-walked Gait Mend) and ENC-SPELL-23 (force-moved Shove Mend). Force-move / Swap / Ally Step do not pay Both Mend.  
OBJECTIVE: Defeat both. Optional: keep one body still so the 8 never lands.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + both-mend discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this mend is paid in **two walks already taken**” on a clean court so ENC-BOTH-01 can add Spent Lend without two new verbs.  
SOLVABILITY_REQUIREMENTS: Both reachable. Reject a 1-tile tunnel.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: Mid: enable `ROLE-SPENT-LEND` (`FSN-BOTH-SPEND`). High: inherit 2 bond-seam tiles on the walk file (`inheritHazardsFrom: ENC-TEACH-13`) so the funded second step cannot also be a pet tax.  
STATUS: PROPOSED

---

### ENC-SPELL-26

ENCOUNTER_ID: ENC-SPELL-26  
TYPE: spell-discovery / elite encounter  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-NEAR-MUST/SOLO` — 1× `near_hooder` bishop (`spell-near-hood` or Frost if range-consume unread) + 1× pawn charger. Must Step off until band 1.  
AI_REQUIREMENTS: Hooder kites at Chebyshev 3–4 and spends Near Hood on the player when they close to ≤ 1. Pawn greedy. No Far Hood (that is ENC-SPELL-24).  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-near-hood` (next hit from Chebyshev ≤ 1 deals 0) can drop that id if missing. Extra door `must_stepper` if Must Step is shown.  
MAP_REQUIREMENTS: Open court, one wide lane. No lava. A legal Chebyshev-1 step exists from the player spawn toward the hooder. One locked exit.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing Near Hood consume → Frost bishop (do not claim the miss). Distinct from ENC-HOOD-01 (Far Hood, ≥ 3 zeros). Strike stays legal.  
OBJECTIVE: Defeat both. Optional: confirm from range 2–3 so the hood never spends.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + near-hood discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “melee-band is the miss; take one step **off** adjacency, then confirm.” Prepares ENC-NEAR-01 (Must Step forces the 1-step **into** the miss).  
SOLVABILITY_REQUIREMENTS: Both reachable. A 2-tile aisle so the player can stand at range 2.  
REPLAYABILITY: Hooder north vs east.  
SCALING_BEHAVIOUR: Mid: enable Must Step (`FSN-NEAR-MUST`). High: inherit shy cinder on a gallery (`inheritHazardsFrom: ENC-HAZ-25`) so the forced 1-step can land on the flee cell.  
STATUS: PROPOSED

---

### ENC-BOTH-01

ENCOUNTER_ID: ENC-BOTH-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-BOTH-SPEND` — 1× `both_mender` queen (`spell-both-mend` + `starter-shield`) + 1× `spent_lender` bishop (`spell-spent-lend` + `starter-frost`). No Inferno. No Spare Pace (that is ENC-ELITE-24).  
AI_REQUIREMENTS: Lender is ally-first (`AI-ROL-05`): holds until the mender has walked, then grants +1 current MP; else Frosts. Mender walks 1, then Both-Mends only if the carry also walked **and** missing HP ≥ 8. Soph 1–2. `groupTactics` off. Until ally `targetId` actually buffs, **do not ship** — reroll to ENC-SPELL-25.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-both-mend` or `spell-spent-lend` can drop the missing id.  
MAP_REQUIREMENTS: `openField` or `arena`. Mender needs a tile at range 3 from the Lender that is not the only exit. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Walk-spend writer required. Force-move does **not** arm Both Mend. Hostiles start ≥ Chebyshev 4 apart.  
OBJECTIVE: Clear all. Intended: Root or freeze **one** body so the dual-walk 8 never pays.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + both/lend discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine dual-walk heal with a walked-ally MP grant so “let them both step, then dump AP into the 8” is the wrong line.  
SOLVABILITY_REQUIREMENTS: Both reachable; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Lender west vs east.  
SCALING_BEHAVIOUR: High: promote to `FSN-BOTH-CHOIR` (ENC-ELITE-24). Peak: inherit bond-seam on the funded file. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-DAMP-01

ENCOUNTER_ID: ENC-DAMP-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-STRIDE-DAMP` — 1× `stride_keeper` bishop (`spell-stride-keep` + Frost) + 1× `damp_stinger` knight (`spell-damp-sting`). No Gait Sip (that is `FSN-STRIDE-BANK`). No Purse Keep (PAIR ban).  
AI_REQUIREMENTS: Keeper Holds Keep if leftover walk MP ≥ 1 and they still need a kite next turn; else Frosts. Damp lurks at 3 and commits when leftover walk MP ≥ 2 **or** HP% ≤ 40. Hostiles start ≥ 4 apart.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-damp-sting` or `spell-stride-keep` can drop the missing id.  
MAP_REQUIREMENTS: Open court plus a 2-tile “waste aisle” the player can spend leftover MP into without approaching. No lava.  
SPECIAL_RULES: Distinct from ENC-DRY-01 (leftover-**AP** = 0 poke) and ENC-KEEP-01 (AP bank). Leftover-MP bank pays at **that unit’s next turn start**, not a queue splice. Death before next start expires the bank. Band 0 → do not spawn; show ENC-HAZ-05 / `FSN-IRON-TIDE`.  
OBJECTIVE: Clear all. Intended: spend the last tiles **this** turn so Damp’s +8 is off.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + damp/keep discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach leftover **walk MP** as a resource the knife waits for — Purse Keep’s cousin on the walk axis.  
SOLVABILITY_REQUIREMENTS: Waste aisle is floor; both reachable.  
REPLAYABILITY: Damp north vs south.  
SCALING_BEHAVIOUR: High: promote to `FSN-STRIDE-BANK` (add Gait Sip). Peak: inherit Orth Step so spending leftover MP on a diagonal is a 2-MP tax. Never two leftover-MP banks.  
STATUS: PROPOSED

---

### ENC-NEAR-01

ENCOUNTER_ID: ENC-NEAR-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-NEAR-MUST` — 1× `near_hooder` bishop (`spell-near-hood`) + 1× `must_stepper` rook (`spell-must-step` + `physical_attack`). No Far Hood. No Must Span.  
AI_REQUIREMENTS: Hooder kites at 3–4 and spends Hood when the player is ≤ 1. Stepper forces remaining walks Chebyshev **1** if a legal 1-step exists; otherwise skip (do not Root). No lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-near-hood` or `spell-must-step` can drop the missing id.  
MAP_REQUIREMENTS: Open court with a painted 1-step that lands **adjacent** to the hooder if the player is on the mid-band. A legal 1-step that does **not** enter adjacency also exists (peel).  
SPECIAL_RULES: Family lottery **off**. Missing Near Hood **or** Must Step → ENC-SPELL-26. Distinct from ENC-HOOD-01 (Far) and ENC-HOLD-02 (Strike illegal until walk). Strike stays legal.  
OBJECTIVE: Clear all. Intended: take the peel 1-step, then confirm from 2.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + near/must discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine a melee-band miss with a forced 1-step so “stand still and Strike” is the wrong answer **and** “step in” is the trap.  
SOLVABILITY_REQUIREMENTS: Legal 1-step exists from spawn and from the mid-band. Peel tile is not lava / portal / seam.  
REPLAYABILITY: Forced step north vs east.  
SCALING_BEHAVIOUR: High: promote to `FSN-NEAR-STEP` (add glass sniper at 3). Peak: inherit shy cinder so the forced step can land on the flee cell.  
STATUS: PROPOSED

---

### ENC-PAINT-01

ENCOUNTER_ID: ENC-PAINT-01  
TYPE: priority-target / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PAINT-NOOK` — 1× `paint_reeler` bishop (`starter-frost` + `spell-paint-reel`) + 1× `nook_biter` knight (`spell-nook-bite`). No Foe / Ally / File Reel. No Fuse on PAIR (`FSN-PAINT-NOOK/FUSE` is High).  
AI_REQUIREMENTS: Reeler paints a floor cell (glyph, not a wall), then pulls 1 toward nearest paint. Biter commits only if the destination has exactly **one** adjacent block. No Inferno.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-paint-reel` or `spell-nook-bite` can drop the missing id.  
MAP_REQUIREMENTS: Arena with one painted alcove (exactly one adjacent wall) and an open 2×2. Paint cell is floor. Never lava dest.  
SPECIAL_RULES: Family lottery **off**. Paint Reel is dest flavor #4. Wipe the paint after the pull. Occupancy dests; blocked dest spends AP and fizzles. Band 0 → ENC-FANG-01.  
OBJECTIVE: Clear all. Intended: wipe the paint, fight in the open (0-block) or a two-wall corner (2-block).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + paint/nook discovery. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Pull toward **paint**, not a body, then cash a geometry poke. Distinct from ENC-FANG-01 (reel-to-hostile).  
SOLVABILITY_REQUIREMENTS: Open 2×2 and the alcove both reachable; player keeps ≥ 1 walk-off after the pull.  
REPLAYABILITY: Alcove west vs east. High: `FSN-PAINT-NOOK/FUSE` adds a wick on the alcove (step off before the tick).  
SCALING_BEHAVIOUR: High: enable Fuse variant. Peak: inherit Side Plate on the alcove so the pulled unit can also claim/pay a plate. Never lava dest.  
STATUS: PROPOSED

---

### ENC-WAVE-14

ENCOUNTER_ID: ENC-WAVE-14  
TYPE: waves  
RELATIVE_DIFFICULTY: LOW → MID  
ENEMY_COMPOSITION: Wave 1 = `FSN-BOTH-SPEND` (queen + lender). Wave 2 (after wave 1 dead, portal still locked) = `FSN-STRIDE-DAMP` (keeper + damp). Living hostiles ≤ 4.  
AI_REQUIREMENTS: Wave 1 as ENC-BOTH-01. Wave 2 as ENC-DAMP-01. No wave-2 spawn until wave 1 is dead. `holdPortalLocked` while either wave is pending.  
SPELL_DISCOVERY_OPPORTUNITIES: Both Mend / Spent Lend on wave 1; Damp Sting / Stride Keep on wave 2. First observe wins.  
MAP_REQUIREMENTS: Arena with a marked wave-2 door (east or north). Wave-2 spawn cells stay on the spawn flood-fill. No lava.  
SPECIAL_RULES: `holdPortalLocked` until wave 2 clears. Wave-2 cells Chebyshev ≥ 4 from the player. Skip wave 2 if remaining `MAX_ENEMIES` < 2. Family lottery **off**.  
OBJECTIVE: Clear both waves.  
FAILURE_CONDITION: Player death.  
REWARD: Standard after the **final** clear only (one `applyRewards`). Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce “keep one body still” then flip the question to leftover **walk MP**.  
SOLVABILITY_REQUIREMENTS: Both wave doors reachable; portal reserved.  
REPLAYABILITY: Wave-2 door east vs north.  
SCALING_BEHAVIOUR: High: wave 2 becomes `FSN-STRIDE-BANK`. Peak: inherit 2 bond-seam tiles on the wave-2 aisle. Never a third wave.  
STATUS: PROPOSED

---

### ENC-AMBUSH-13

ENCOUNTER_ID: ENC-AMBUSH-13  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible: 1× bishop (`starter-frost`) + 1× pawn. Ambush: 1× `WF-ELT-HIGH_PICKET` elite (same-tier × hard, Frost + `physical_attack`) appears only while the player’s current HP is ≥ 80% of max. Below 80% the post is empty floor.  
AI_REQUIREMENTS: Visible pack as ENC-TEACH-13. Elite is a backline kiter once present. No concealment fog required (`fog_of_war` may be chrome only).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Open court plus a painted high post (floor). Exit reachable without touching the post. Distinct from ENC-AMBUSH-12 (appears **below** 70%) and Near Picket (proximity).  
SPECIAL_RULES: In dungeon / boss rush the elite **stands from map start** (required for map-clear) — the ≥80% gate is exploration only. Counts as 1 toward `MAX_ENEMIES`. Inverse of Low Picket.  
OBJECTIVE: Clear visible hostiles. In a run, also clear the picket. Optional (explore): dip below 80% and walk past.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Hard purse on the picket only if it was fought. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “staying topped **invites** the elite; a scratch is the skip.” Inverse of day-12’s wounded ambush.  
SOLVABILITY_REQUIREMENTS: Post is floor. Exit without the post.  
REPLAYABILITY: Post west vs east.  
SCALING_BEHAVIOUR: High: elite gains Near Hood (ENC-SPELL-26). Peak: inherit shy cinder so dipping HP also baits the orb. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REINF-13

ENCOUNTER_ID: ENC-REINF-13  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: 2× pawn chargers. Reinforcement: `WF-INV-HOLLOW_FILE` — +4 same-tier hostiles at soft threat (0.6) after the first pawn dies, only if remaining cap ≥ 4.  
AI_REQUIREMENTS: Opening pawns greedy. Reinforcements are soft-threat chargers (no elites, no kits above band 0). No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Wide arena. Extra spawns stay on the spawn flood-fill. Never block portals.  
SPECIAL_RULES: Add enemies only up to `MAX_ENEMIES`. Skip the roll if the roster cannot fit 4. Distinct from Warband (fewer bodies, extreme threat) and Phalanx Line (three hard elites). `holdPortalLocked` while extras are pending.  
OBJECTIVE: Clear all, **or** (explore) walk to a portal and leave before the horn. In a run, extras are map-clear hostiles.  
FAILURE_CONDITION: Player death.  
REWARD: Medium multiplier via `applyRewards` after the final clear. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: A crowded but weaker same-tier pack — density, not level.  
SOLVABILITY_REQUIREMENTS: Every extra spawn flood-fills from player spawn.  
REPLAYABILITY: Horn east vs south.  
SCALING_BEHAVIOUR: High: one reinforcement is a `near_hooder` (still soft threat). Peak: inherit Orth Step so the swarm’s diagonals cost 2. Never raise levels.  
STATUS: PROPOSED

---

### ENC-ALLY-02

ENCOUNTER_ID: ENC-ALLY-02  
TYPE: movement objective / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-ALLY-SILL` — 1× `ally_stepper` bishop (`spell-ally-step` + Frost) + 1× `cast_siller` rook (Cast Sill paint + `physical_attack`). No Home Step. No Quiet Sill (that is COURT).  
AI_REQUIREMENTS: Stepper relocates a living ally **onto the caster’s adjacent free cell** (occupancy, not swap). Siller paints one floor cell that forbids **non-physical** (spells fizzle; Strike legal). Two **different** tiles.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-ally-step` or `spell-cast-sill` can drop the missing id.  
MAP_REQUIREMENTS: Arena with a painted Cast Sill cell and a free adj of the stepper that is not the only exit.  
SPECIAL_RULES: Distinct from ENC-HOME-01 (caster **joins** the ally onto a Quiet Sill). Blocked dest spends AP (whole card fizzles). Quiet Sill / Tool Hold stay off CELL.  
OBJECTIVE: Clear all. Intended: stand off the sill to cast; Strike on the sill; isolate so Ally Step has no dest.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + ally-step / cast-sill discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Ally **comes to the caster**, then a Strike-only tile — inverse of Home Quiet.  
SOLVABILITY_REQUIREMENTS: Walk-off on the sill; dest is not lava / portal / seam.  
REPLAYABILITY: Sill west vs east. High: `FSN-ALLY-SILL/MEND` adds Split Mend, not Quiet.  
SCALING_BEHAVIOUR: High: enable Split Mend variant. Peak: inherit Heal Sill on a **second** corridor so a heal opens a short path **and** the Cast Sill still forbids that heal on its tile.  
STATUS: PROPOSED

---

### ENC-CLASH-01

ENCOUNTER_ID: ENC-CLASH-01  
TYPE: protection objective / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BODY-CLASH` — 1× `body_siller` rook (Body Sill + `physical_attack`) + 1× `clash_mender` queen (`spell-clash-mend` + `starter-shield`). No Shove / Gait / Both Mend.  
AI_REQUIREMENTS: Siller plants on a floor cell; **primary** cannot leave (pets walk). Mender heals 8 **iff** the target Struck this turn. Skip if `struckThisTurn` is 0. Never drain / nova.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-clash-mend` or `spell-body-sill` can drop the missing id.  
MAP_REQUIREMENTS: Arena plus a painted body-sill cell that is not the only aisle. Pets (if any) have a walk-off that the primary does not.  
SPECIAL_RULES: Family lottery **off**. `struckThisTurn` writes only on successful Strike / `physical_attack` / `isPhysical: true`. Walk / shove / DoT / lava do not pay. Missing flag → ENC-BASH-01.  
OBJECTIVE: Clear all. Intended: do **not** Strike the carry; walk / shove / spell the queen down.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + clash discovery. Overlay `no_healing` (the 8 is their problem).  
TACTICAL_PURPOSE: “Don’t punch the planted tank — that **is** the heal.” Distinct from Shove Mend (someone else moved you).  
SOLVABILITY_REQUIREMENTS: Queen reachable without standing on the sill. Blink / Swap ends Body Sill.  
REPLAYABILITY: Sill north vs south. High: `FSN-BODY-CLASH/SPAWN` adds a Dummy Post (counts as 1).  
SCALING_BEHAVIOUR: High: enable Dummy Post. Peak: inherit Bond Seam so a pet walk on the ribbon is a tax while the primary stays planted. Never two Clash Menders.  
STATUS: PROPOSED

---

### ENC-SKIP-01

ENCOUNTER_ID: ENC-SKIP-01  
TYPE: hazard battle / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LAVA-STILL` — 1× `lava_skipper` knight (`spell-lava-skip` + `physical_attack`) + 1× `still_plater` bishop (`spell-still-plate` + Frost). No Pit Skip. No Empty Plate.  
AI_REQUIREMENTS: Skipper uses the 1-tile lava-as-floor only to cross the painted gap; pit / void still illegal. Plater arms leftover-walk-MP-0 → +RES. Wounded AI still avoids a **second** lava tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-lava-skip` or `spell-still-plate` can drop the missing id.  
MAP_REQUIREMENTS: One 1-tile lava gap with a dry detour of ≥ 2 tiles. Player path never **requires** the gap. Distinct from ENC-SLIP-01 (knight-slip + wick pit).  
SPECIAL_RULES: Scripted single lava tile only (counts toward `MAX_HAZARD_TILES`). Maps stay solvable for the **player** without Skip. Still Plate is leftover-**MP** 0, not leftover-AP 0 (ENC-DRY-01).  
OBJECTIVE: Clear all. Intended: take the dry detour; keep them wanting a last tile so +RES never arms.  
FAILURE_CONDITION: Player death (frost + lava).  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: One legal lava hop for **them**, plus a leftover-MP plate — not a lava sponge.  
SOLVABILITY_REQUIREMENTS: Dry detour reaches both and the exit. Lava not on spawn/portal. One clean aisle.  
REPLAYABILITY: Gap west vs east. High: `FSN-LAVA-STILL/EMBER` adds ember melee-burn on the skipper only.  
SCALING_BEHAVIOUR: High: enable ember variant. Peak: inherit Orth Step so the dry detour’s diagonal is 2 MP. Never thicken the gap.  
STATUS: PROPOSED

---

### ENC-BRICK-01

ENCOUNTER_ID: ENC-BRICK-01  
TYPE: hazard / elite encounter  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-BRICK-WATCH` — 1× `brick_wiper` rook (`spell-brick-wipe` + `physical_attack`) + 1× `watch_muter` bishop (`spell-watch-mute` + Frost). No Echo Wipe. No two-erase PAIR.  
AI_REQUIREMENTS: Wiper erases **one existing** adjacent barrier, then Strikes. Muter spends Watch Mute on the next overwatch snap (deals 0, still consumes). No wall punch.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-brick-wipe` or `spell-watch-mute` can drop the missing id.  
MAP_REQUIREMENTS: Arena with **two** pre-placed barrier tiles (scripted, not `spell-barrier` on an enemy). A path that never needs either wall.  
SPECIAL_RULES: Erase existing barrier only. World walls are not brick sources. Watch Mute consumes the snap. Distinct from ENC-WIPE-01 (erase **paint**). `usableByEnemy` stays false for `spell-barrier`.  
OBJECTIVE: Clear all. Intended: re-plant after the erase, or fight without the wall; walk another file after the muted snap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + brick/mute discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: They delete **your** cover, then zero the overwatch you wanted to punish the delete with.  
SOLVABILITY_REQUIREMENTS: Path without either barrier; erase never seals the exit.  
REPLAYABILITY: Walls N-S vs E-W. High: `FSN-BRICK-WATCH/GUN` adds a stone turret (counts as 1, not a second erase).  
SCALING_BEHAVIOUR: High: enable turret variant. Peak: inherit Side Plate between the walls. Never two wipers.  
STATUS: PROPOSED

---

### ENC-PACE-02

ENCOUNTER_ID: ENC-PACE-02  
TYPE: movement objective / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SHOVE-PACE` — 1× `paint_reeler` bishop (paint + Frost) + 1× `pair_pacer` rook (`spell-pair-pace`) + 1× `shove_stinger` pawn (`spell-shove-sting`). No Exit Sting PAIR.  
AI_REQUIREMENTS: Reeler paints a landing. Pacer translates caster+ally 1 (occupancy dests). Stinger deals 8 on the **force-landing** (walk-on is free). Skip if `forcedMovedThisTurn` unread.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-pair-pace` or `spell-shove-sting` can drop the missing id.  
MAP_REQUIREMENTS: Arena plus a painted landing that is not lava / portal / the only aisle. Player keeps ≥ 1 walk-off after the pair lands.  
SPECIAL_RULES: Pair Pace dests are occupancy, **not** `isSwap`. Walk MP does **not** set `forcedMovedThisTurn`. Missing writer → ENC-EXIT-01. Distinct from ENC-PACE-01 (walked heal + spare).  
OBJECTIVE: Clear all. Intended: occupy the toward-tile, or stand so the pair fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Paint the landing, march the pair onto it, bash the rest — Shove Mend’s cousin that **hurts** the landing.  
SOLVABILITY_REQUIREMENTS: Blocked dest fizzles (no partial). Landing not a seam/lava.  
REPLAYABILITY: Landing west vs east. High: `FSN-SHOVE-PACE/FILE` files the pair instead of translating 1.  
SCALING_BEHAVIOUR: High: enable File variant. Peak: inherit Bond Seam on the landing so a pet in the pair also pays the ribbon.  
STATUS: PROPOSED

---

### ENC-TRIM-01

ENCOUNTER_ID: ENC-TRIM-01  
TYPE: priority-target / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TRIM-TAX` — 1× `cadence_trimmer` bishop (`spell-cadence-trim` + `starter-inferno`) + 1× `verse_taxer` rook (`spell-verse-tax`) + 1× pawn charger. No Stretch / Flush / Crack PAIR.  
AI_REQUIREMENTS: Trimmer −1 remaining CD on one **hostile** Inferno so they recast into Verse Tax (+1 AP on last-id). Skip recast of an already-active Inferno. One Inferno cadence per pack.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-cadence-trim` or `spell-verse-tax` can drop the missing id.  
MAP_REQUIREMENTS: Open court. No lava. A LoS file for Inferno that is not the only exit.  
SPECIAL_RULES: `lastResolvedSpellId` required. Trim 0-stays-0. Ignite stack gate ≥ 2 before cash. Missing writer → ENC-STRETCH-01. Distinct from ENC-FLUSH-01 (all-bar CD gift).  
OBJECTIVE: Clear all. Intended: kill the Trimmer first, or sit on CD-0 and refuse the recast.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + trim/tax discovery. Overlay `no_healing`.  
TACTICAL_PURPOSE: They **shave your Inferno** so the next cast is the expensive last-id.  
SOLVABILITY_REQUIREMENTS: All three reachable; Inferno file not a tunnel.  
REPLAYABILITY: Trimmer north vs east.  
SCALING_BEHAVIOUR: High: add `ROLE-IGNITE` only if stack gate is honest. Peak: inherit Orth Step so the reposition off the Inferno file costs 2 on a diagonal. Never two cadence directors.  
STATUS: PROPOSED

---

### ENC-QUIET-01

ENCOUNTER_ID: ENC-QUIET-01  
TYPE: elite encounter / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CAST-QUIET` (no Penta) — 1× `cast_siller` rook + 1× `quiet_siller` bishop + 1× `tool_holder` knight (`spell-tool-hold` + Strike). Living hostiles = 3.  
AI_REQUIREMENTS: Cast Sill forbids **non-physical** on tile A. Quiet Sill forbids **Strike** / `isPhysical` on tile B. Tool Hold: that unit cannot spend tools until it Strikes. Walk-off on **at most one** sill. Never Root.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-cast-sill`, `spell-quiet-sill`, or `spell-tool-hold` can drop the missing id.  
MAP_REQUIREMENTS: Arena with **two different** painted sill tiles and a third open file. Never the only aisle.  
SPECIAL_RULES: Two-tile honesty. `FSN-CAST-QUIET/PENTA` is **illegal** at cap 2. `FSN-CAST-QUIET/KENNEL` (Full Purse) is Peak only. Distinct from ENC-HOLD-03 (unit dual hold, no tiles).  
OBJECTIVE: Clear all. Intended: cast off tile A, Strike off tile B, make the holder Strike then peel.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Three locks, three answers — tile / tile / unit — without a stun.  
SOLVABILITY_REQUIREMENTS: Walk-off on at most one sill; both sills floor; exit not a sill.  
REPLAYABILITY: Sill pair N/S vs E/W.  
SCALING_BEHAVIOUR: Peak: `FSN-CAST-QUIET/KENNEL` adds Full Purse (10+8 if leftover AP ≥ 3) — spend down to 2. Never Penta.  
STATUS: PROPOSED

---

### ENC-SIDE-01

ENCOUNTER_ID: ENC-SIDE-01  
TYPE: hazard battle  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn charger.  
AI_REQUIREMENTS: Bishop kites off the plate. Pawn may claim it (same-side free). No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One visible `WF-TRP-SIDE_PLATE` in the mid-band (first unit to step paints their side; the next **other-side** stepper pays 8% max HP once; then floor). A path around. Distinct from Glyph Plate (always taxes first stepper) and Dash Plate (2 MP skip).  
SPECIAL_RULES: Always visible. Never hidden. Never on spawn/portals. Challenge HP. Side is player vs enemy occupancy.  
OBJECTIVE: Clear all. Intended: claim it for your side, bait the pawn onto a claimed plate, or walk around.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: A plate you can **own** — the tax is the other side.  
SOLVABILITY_REQUIREMENTS: Walkable before and after. Path around.  
REPLAYABILITY: Plate left vs right.  
SCALING_BEHAVIOUR: Mid: inherit 2 bond-seam tiles on a gallery. High: add a second pawn so the claim race is real. Never two plates.  
STATUS: PROPOSED

---

### ENC-CLEAR-01

ENCOUNTER_ID: ENC-CLEAR-01  
TYPE: movement objective  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop may stand on a pad to deny the pair. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Two linked cyan `WF-TEL-CLEAR_STEP` pads. Entering one for 1 MP exits the other **only if empty**. Occupied dest: MP not spent, stay. No swap. Distinct from ENC-INIT-01 (lowest-HP swap) and Far Swap.  
SPECIAL_RULES: 1 MP from current MP only on a successful empty landing. Not a teleport spell — do not key off `effectCategory`. Map solvable without the pads.  
OBJECTIVE: Clear all. Optional: spend 1 MP into a clear pad, or stand on the exit to deny.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: A skip that **fails closed** when the dest is occupied — opposite of swap pads.  
SOLVABILITY_REQUIREMENTS: Both pads on floor, not spawn/portals.  
REPLAYABILITY: Pads N-S vs E-W.  
SCALING_BEHAVIOUR: Mid: bishop starts on the far pad. High: inherit shy cinder so the flee cell can occupy a pad.  
STATUS: PROPOSED

---

### ENC-MOVE-24

ENCOUNTER_ID: ENC-MOVE-24  
TYPE: movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn behind a short-path wall.  
AI_REQUIREMENTS: Bishop kites on the long path. Pawn camps the short-path side. No healer kit on the pawn (Heal Sill is a **player** key).  
SPELL_DISCOVERY_OPPORTUNITIES: None required. A rest later may hint `starter-heal` if the account already owns it (reminder).  
MAP_REQUIREMENTS: `WF-OBS-HEAL_SILL` on a short-path corridor cell (starts wall; becomes floor after any unit heals while adjacent). A **second** spawn→portal route already exists. Distinct from Stride Sill (MP spend), Spell Sill (cast), Coin Sill (1 AP), Tithe Sill (HP tax).  
SPECIAL_RULES: Place only when the long path already solves the map. Evaluate solvability as if the sill were already a wall. Zone / potion / Wisp / Blood Mend HP gain all count.  
OBJECTIVE: Clear all. Optional: spend a heal adjacent to open the short path.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: “The short path costs a heal you might have wanted anyway.”  
SOLVABILITY_REQUIREMENTS: Long path reaches spawn, hostiles, and exit. Sill never the only exit.  
REPLAYABILITY: Sill west corridor vs east.  
SCALING_BEHAVIOUR: High: inherit Labor Font on the long path so the worked heal can also open the sill if you drink adjacent. Never the only exit.  
STATUS: PROPOSED

---

### ENC-MOVE-25

ENCOUNTER_ID: ENC-MOVE-25  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: Bishop kites. Pawn may stand adjacent to the urn. No 2-AP detonate on the AI until an occupancy caller exists; otherwise the urn is scenery the **player** spends.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-TER-BLAST_URN` on a mid floor cell (walk-through, LoS open). Adjacent 2 AP (no spell) detonates: Chebyshev 1 pays 6% max HP, including the detonator if still adjacent; then clear floor. Distinct from Cinder Barrel (roll / smash wall) and Sealed Urn (treasure coin-flip).  
SPECIAL_RULES: Smash is optional. Never on spawn/portals. Challenge HP. Does not rewrite `combatMath`.  
OBJECTIVE: Clear all. Optional: spend 2 AP to blast a pile, or shove a foe adjacent then detonate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: A walk-through bomb you **choose** to spend AP on.  
SOLVABILITY_REQUIREMENTS: Does not block walk or LoS.  
REPLAYABILITY: Urn mid-west vs mid-east.  
SCALING_BEHAVIOUR: High: two pawns so the ring can catch both. Peak: inherit Side Plate under the urn so the detonator may also claim/pay. Never two urns.  
STATUS: PROPOSED

---

### ENC-SURV-25

ENCOUNTER_ID: ENC-SURV-25  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 2× pawn chargers.  
AI_REQUIREMENTS: Pawns may camp the portal choke (and pay the draft). Bishop kites outside the ring. Wounded AI avoids the next draft cells.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One locked exit with a painted Manhattan-2 `WF-ENV-EXIT_DRAFT` ring (end of each combatant turn, if within Manhattan 2 of any portal cell, pay 3% max HP). Portal cells themselves never tax. Distinct from Ash Rain (wall shelter), Corner Draft (two-wall alcove), Sight Burn (LoS to you).  
SPECIAL_RULES: End-of-turn challenge HP. Summons pay it. `holdPortalLocked` until hostiles are dead. Survive until clear — no turn cap.  
OBJECTIVE: Clear all without camping the ring. Dart onto the portal in one step after unlock.  
FAILURE_CONDITION: Player death (frost + draft).  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: The exit is the hazard. Holding the choke is the tax.  
SOLVABILITY_REQUIREMENTS: Portal reserved and untaxed. A floor path to the portal always exists. Tax is not a wall.  
REPLAYABILITY: Portal north vs east.  
SCALING_BEHAVIOUR: High: inherit shy cinder so the flee cell can sit on the ring. Peak: inherit Orth Step so leaving the ring on a diagonal is 2 MP. Never thicken to Manhattan 3.  
STATUS: PROPOSED

---

### ENC-SURV-26

ENCOUNTER_ID: ENC-SURV-26  
TYPE: survival / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn.  
AI_REQUIREMENTS: As ENC-HAZ-25 + ENC-SURV-25.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: ENC-HAZ-25 shy cinder **plus** ENC-SURV-25 exit-draft ring (`inheritHazardsFrom: ENC-HAZ-25` and `ENC-SURV-25`). A floor path that is neither the orb’s next flee cell nor the ring.  
SPECIAL_RULES: Scripted only. Two taxes, two answers: pin the orb, end turns off the ring.  
OBJECTIVE: Clear all.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing`.  
TACTICAL_PURPOSE: Fleeing ember + portal-ring tax so “back up to the exit” feeds the orb **and** the draft.  
SOLVABILITY_REQUIREMENTS: Interior path remains. Orb never starts on the ring. Hazard budget 1 + ring paint (ring is not extra hazard tiles).  
REPLAYABILITY: Orb west / portal east vs swapped.  
SCALING_BEHAVIOUR: Peak: inherit Bond Seam on the interior so a pet also taxes the safe path. Never a second orb.  
STATUS: PROPOSED

---

### ENC-ELITE-24

ENCOUNTER_ID: ENC-ELITE-24  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BOTH-CHOIR` — `FSN-BOTH-SPEND` plus 1× `spare_pacer` pawn (`spell-spare-pace`, ungated +1 MP). Three bodies. No Tempo. No Boot Lend PAIR.  
AI_REQUIREMENTS: Spare funds a walk **before** the dual-walk check. Mender still skips if either walk flag is 0. Lender ally-first. Soph 3. Backline guard on the queen.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-spare-pace` can drop that id if missing (Both / Spent already taught).  
MAP_REQUIREMENTS: Arena. Reject tunnels. Hostiles start ≥ 4 apart.  
SPECIAL_RULES: Unlock after ENC-BOTH-01. Family lottery **off**. Walk-spend writer + ally `targetId` required.  
OBJECTIVE: Clear all. Intended: Root the spare **or** the queen so the funded 8 still needs two walks.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Fund two walks, then cash the dual-walk 8 — the PAIR with a banker.  
SOLVABILITY_REQUIREMENTS: Three-unit occupancy leaves walk-offs.  
REPLAYABILITY: Spare west vs east.  
SCALING_BEHAVIOUR: Peak: inherit bond-seam on the funded file. Never add a fourth healer.  
STATUS: PROPOSED

---

### ENC-ELITE-25

ENCOUNTER_ID: ENC-ELITE-25  
TYPE: elite encounter / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BOOT-OATH` — 1× `boot_holder` rook (cannot walk until Strike) + 1× `near_oather` bishop (next spell range ≤ 1) + 1× pawn charger. No Hold Knight PAIR. No Far Hood.  
AI_REQUIREMENTS: Holder Strikes once, then peels. Oather Frosts at 4 (fizzles under the oath) or closes to 1. Strike stays legal. Never Root.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-boot-hold` or `spell-near-oath` can drop the missing id.  
MAP_REQUIREMENTS: Open court, one wide lane. A range-1 tile that is not the only aisle.  
SPECIAL_RULES: Unlock after ENC-NEAR-01 **or** ENC-HOLD-03. Distinct from ENC-HOLD-02 (Strike illegal until walk). `FSN-BOOT-OATH/GOAD` and `/SHAVE` are Peak skins, never both.  
OBJECTIVE: Clear all. Intended: make the holder Strike then peel; Frost at 4 is a wasted oath.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Nail feet until Strike, then forbid long confirms.  
SOLVABILITY_REQUIREMENTS: Holder reachable by walking; range-1 tile exists.  
REPLAYABILITY: Holder north vs east. Peak: `/GOAD` **or** `/SHAVE`, not both.  
SCALING_BEHAVIOUR: Peak: one named variant. Never pack with ENC-QUIET-01 in the same room.  
STATUS: PROPOSED

---

### ENC-PROT-13

ENCOUNTER_ID: ENC-PROT-13  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 2× pawn chargers who path toward `WF-ZON-LABOR_FONT`. Optional +2 soft-threat extras from `WF-INV-HOLLOW_FILE` if remaining cap ≥ 2 (not the full +4).  
AI_REQUIREMENTS: Pawns prefer the font cell if they already spent ≥ 2 AP this turn (they can drink). Bishop kites. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Copper `WF-ZON-LABOR_FONT` (first unit to end a turn here heals 6% max HP **only if** they already spent ≥ 2 AP this turn; then dries). Walkable. Never on spawn/portals. Distinct from Shrine Pool (unconditional) and Second Wind (AP refund).  
SPECIAL_RULES: Zone tick, not a spell. Reads AP already spent. Player HP persist via `saveBattleStats` on the progress lock. Enemies can drink it.  
OBJECTIVE: Deny the font **or** drink it yourself after 2 AP, then clear. The font drying is not a fail.  
FAILURE_CONDITION: Player death. Font drink by an enemy is a **lost bonus**, not a fail.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: A worked heal you contest — dump 2 AP then plant, or shove them off.  
SOLVABILITY_REQUIREMENTS: Font optional. Exit reachable without it.  
REPLAYABILITY: Font west vs east.  
SCALING_BEHAVIOUR: High: enable 2 Hollow File extras. Peak: inherit Exit Draft so camping the font near a portal also taxes.  
STATUS: PROPOSED

---

### ENC-PRIO-15

ENCOUNTER_ID: ENC-PRIO-15  
TYPE: priority-target / spell-discovery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `WF-SPL-MERCY_SCRIBE` bishop (1 extra `usableByEnemy` spell — prefer `starter-frost` or a taught Wave 11 id already in the kit) + 2× pawn decoys (`physical_attack` only).  
AI_REQUIREMENTS: Scribe kites. Pawns greedy. No name heuristic — `realId` is the scribe, `decoyId[]` are the pawns.  
SPELL_DISCOVERY_OPPORTUNITIES: If the scribe is reduced to ≤30% HP and still living at end of that turn, the player gains that spell id as a **single remaining cast** this map. Killing them before the threshold grants the purse but not the one-cast. Distinct from Grimoire Stalker (one-cast on **death**) and Loaner Mage (1 AP loan).  
MAP_REQUIREMENTS: Open court. Scribe starts ≥ Chebyshev 4 from the pawns.  
SPECIAL_RULES: One-cast does **not** call `upgradeSpell` and does not persist `spellLevel*` arrays. They stay hostile after the teach. In a run they count for map-clear.  
OBJECTIVE: Wound the scribe to 30% and keep them alive for the one-shot, **or** burst-kill for the purse.  
FAILURE_CONDITION: Player death. Killing the scribe early is a **lost cast**, not a fail.  
REWARD: Standard purse on kill. Overlay `under_10_turns` fights the wound-and-hold line.  
TACTICAL_PURPOSE: Priority is “stop the last hit,” not “kill the named one first.”  
SOLVABILITY_REQUIREMENTS: All reachable. Prefer replacing one existing spawn.  
REPLAYABILITY: Scribe north vs east.  
SCALING_BEHAVIOUR: High: extra spell is `spell-both-mend` (observe still requires the walk gate). Peak: inherit shy cinder so the hold-at-30% cell can be the flee land.  
STATUS: PROPOSED

---

### ENC-URN-01

ENCOUNTER_ID: ENC-URN-01  
TYPE: hazard / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× pawn chargers clustered mid.  
AI_REQUIREMENTS: Pawns may clump adjacent to the urn. No AI detonate unless occupancy 2-AP action exists.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Same urn contract as ENC-MOVE-25, but the urn sits **between** the two pawns (Chebyshev 1 of both).  
SPECIAL_RULES: Optional blast. Overlay `under_5_turns` is fair if the player detonates the clump.  
OBJECTIVE: Clear all. Optional: 2 AP detonate to tag both pawns.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_5_turns` if the blast is used.  
TACTICAL_PURPOSE: The urn is a tempo button, not a puzzle wall.  
SOLVABILITY_REQUIREMENTS: Walk-through. Path around.  
REPLAYABILITY: Cluster west vs east.  
SCALING_BEHAVIOUR: High: add a bishop outside the ring so the blast is not the whole room.  
STATUS: PROPOSED

---

### ENC-ORTH-01

ENCOUNTER_ID: ENC-ORTH-01  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× `tide_shade` pawn (`physical_attack` only; live melee −1 MP counts toward the −2 cap).  
AI_REQUIREMENTS: Bishop kites on cardinal files. Pawn may take a 2-MP diagonal to close. Dual Slow / Frost / tide cap at −2.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-MOD-ORTH_STEP` armed. Open court. Cardinal walks fully usable. No ice (double tax is a sponge).  
SPECIAL_RULES: Reads grid adjacency only. Attack Nearest is not a walk. Distinct from ENC-HAZ-26 (seam + orth).  
OBJECTIVE: Clear all. Intended: walk the cardinal grid; pay 2 MP for a diagonal only when tempo is worth it.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: A movement tax that is **not** a hazard tile and not a level bump.  
SOLVABILITY_REQUIREMENTS: No tile change. Cardinal path solves the room.  
REPLAYABILITY: Bishop north vs east.  
SCALING_BEHAVIOUR: High: inherit Side Plate on a diagonal shortcut. Peak: inherit Bond Seam on a cardinal file. Never ice + orth.  
STATUS: PROPOSED

---

### ENC-HIGH-01

ENCOUNTER_ID: ENC-HIGH-01  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Solo `WF-ELT-HIGH_PICKET` elite (`near_hooder` kit if ENC-SPELL-26 was taught; else Frost + Strike).  
AI_REQUIREMENTS: Kiter at 3–4. Near Hood if honest. No group tactics.  
SPELL_DISCOVERY_OPPORTUNITIES: Near Hood if not yet granted.  
MAP_REQUIREMENTS: Painted post, floor. Exit reachable without touching. In a run they stand from start.  
SPECIAL_RULES: Insert, do not replace a beat. Explore: appear only at ≥80% HP. Distinct from ENC-AMBUSH-13 (this room **is** the picket).  
OBJECTIVE: Defeat the picket, or (explore) dip below 80% and leave.  
FAILURE_CONDITION: Player death. Walking past in explore is not a fail.  
REWARD: Hard purse via `applyRewards` if fought. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: A rare elite you can **decline** by taking a scratch.  
SOLVABILITY_REQUIREMENTS: Post is floor. Counts as 1.  
REPLAYABILITY: Post gallery vs court.  
SCALING_BEHAVIOUR: Peak: elite is `FSN-NEAR-MUST` (two bodies) only if remaining cap ≥ 2.  
STATUS: PROPOSED

---

### ENC-TREAS-13

ENCOUNTER_ID: ENC-TREAS-13  
TYPE: treasure / risk room  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× pawn guardian (`physical_attack`) who does **not** sit adjacent to the chest (Hire Cache has no guardian).  
AI_REQUIREMENTS: Pawn greedy. Does not camp the chest.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Visible `WF-TRS-HIRE_CACHE` (1 AP adjacent opens **only** while a living allied summon occupies a cell adjacent to the chest: soft `applyRewards`, no guardian). Without the summon the AP is spent and the chest stays closed. Distinct from Kin Plate (trap skip) and Relic Cache (2 AP, maybe a guardian).  
SPECIAL_RULES: Credits via persist-lock `applyRewards`. Failed open spends AP only. No `updateCharacter` Doka. Optional.  
OBJECTIVE: Bring a summon to the chest and spend 1 AP, **or** clear the pawn and leave.  
FAILURE_CONDITION: Player death. Skipping the chest is not a fail.  
REWARD: Soft grant on open + standard clear. No overlay (the risk *is* the challenge).  
TACTICAL_PURPOSE: The pet you were taught to **leave home** on Bond Seam is the key here.  
SOLVABILITY_REQUIREMENTS: Adjacent-open, not a wall.  
REPLAYABILITY: Chest west vs east.  
SCALING_BEHAVIOUR: High: inherit Bond Seam between spawn and chest so the pet walk is a tax. Peak: inherit Band Oath so the credit wants mid-band HP.  
STATUS: PROPOSED

---

### ENC-HIRE-01

ENCOUNTER_ID: ENC-HIRE-01  
TYPE: treasure / rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None. Rest-adjacent insert.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Rest map (`normal` / `dungeon` / `boss` already exposed) plus Hire Cache as ENC-TREAS-13 without the pawn. White sanctuary portal colocates with spawn.  
SPECIAL_RULES: Snapshot dungeon-chain refs **before** `cleanupMap`. Failed open spends AP only.  
OBJECTIVE: Summon then open, or walk to the sanctuary portal.  
FAILURE_CONDITION: None (rest). Death Realm still applies if the player somehow dies.  
REWARD: Soft `applyRewards` on open.  
TACTICAL_PURPOSE: A calm hire after Bond Seam taught “pets cost.”  
SOLVABILITY_REQUIREMENTS: Rest solvability unchanged. Cache optional.  
REPLAYABILITY: Cache left vs right of spawn.  
SCALING_BEHAVIOUR: None. Never a hostile on this id.  
STATUS: PROPOSED

---

### ENC-BAND-01

ENCOUNTER_ID: ENC-BAND-01  
TYPE: optional challenge / treasure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× bishop + 1× pawn (standard clear).  
AI_REQUIREMENTS: As ENC-TEACH-13.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Copper-slate `WF-RSK-BAND_OATH` inlay. End a turn on it to flag this map. If the next `applyRewards` happens while current HP is **strictly above 40% and strictly below 70%**, that credit uses the hard multiplier. Outside the band the flag pays nothing extra. Distinct from Harvest Moon (≥70%), Last Stand / Wane Gate (≤30%), Full Cache (≥90%).  
SPECIAL_RULES: Optional floor tile. HP checks after challenge recorders and combat. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`.  
OBJECTIVE: Clear all. Optional: sit in the mid band before the credit.  
FAILURE_CONDITION: Player death. Missing the band is a **lost multiplier**, not a fail.  
REWARD: Standard, plus hard multiplier if flagged and in-band. No overlay.  
TACTICAL_PURPOSE: A mid-HP wager — inverse of “stay topped” (High Picket) and “go low” (Last Stand).  
SOLVABILITY_REQUIREMENTS: Map solvable if never used.  
REPLAYABILITY: Inlay mid vs south.  
SCALING_BEHAVIOUR: High: inherit Labor Font so the worked heal can push you **out** of the band.  
STATUS: PROPOSED

---

### ENC-MERCY-02

ENCOUNTER_ID: ENC-MERCY-02  
TYPE: optional challenge / rest choice  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Explore: 2× pawn chargers who **may be left alive**. Run maps: do not spawn this id (Mercy Bell is exploration only).  
AI_REQUIREMENTS: Pawns greedy if engaged.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Overworld / rest-adjacent map with `WF-EVT-MERCY_BELL`. Leave through a portal with ≥ 1 living hostile → portal `applyRewards` uses the **hard** multiplier. Start any fight and clear every hostile → victory uses the **medium** multiplier. Inverse of Pilgrim Banners (peace medium / fight hard). Distinct from ENC-MERCY-01 (queued day-5, shoot the font) and Still Gate (no-fight extra portal).  
SPECIAL_RULES: Exploration only. Run maps require a clear — skip this id. Death-realm guards still block entry.  
OBJECTIVE: Leave a living hostile and take a hard portal purse, **or** clear for a medium victory purse.  
FAILURE_CONDITION: Player death. Either choice succeeds.  
REWARD: Hard or medium via persist-lock `applyRewards`. No overlay.  
TACTICAL_PURPOSE: Mercy is **leaving someone standing**, not a heal.  
SOLVABILITY_REQUIREMENTS: Leaving is always legal. No blocks.  
REPLAYABILITY: Pack south vs east of the portal.  
SCALING_BEHAVIOUR: High: inherit Hire Cache so the pet you brought for the chest can be the living hostile you leave. Never a dungeon/rush spawn.  
STATUS: PROPOSED

---

### ENC-LABOR-01

ENCOUNTER_ID: ENC-LABOR-01  
TYPE: rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None, or 1× sleeping pawn if the rest skin is `dungeon`.  
AI_REQUIREMENTS: Sleeping pawn does not act until damaged (ENC-CAMP-01 rule).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Rest map plus `WF-ZON-LABOR_FONT`. White sanctuary portal at spawn.  
SPECIAL_RULES: Snapshot dungeon-chain refs before `cleanupMap`. First drink after ≥ 2 AP spent heals 6% and dries. 0–1 AP spent does nothing and does not dry.  
OBJECTIVE: Work 2 AP then plant, or ignore and take the sanctuary.  
FAILURE_CONDITION: None (rest).  
REWARD: Zone heal only (persist via `saveBattleStats`). No Doka.  
TACTICAL_PURPOSE: A rest heal that still asks for spent AP — not a free shrine.  
SOLVABILITY_REQUIREMENTS: Font optional. Sanctuary always reachable.  
REPLAYABILITY: Font opposite spawn vs adjacent.  
SCALING_BEHAVIOUR: Dungeon rest may add the sleeping pawn. Never a Rush font.  
STATUS: PROPOSED

---

### ENC-TALLY-01

ENCOUNTER_ID: ENC-TALLY-01  
TYPE: branching paths / rest choice  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: None required. Overworld / rest only.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Extra `WF-PRT-TALLY_GATE` plus a reachable **stable** portal. Tally-rim portal is not an exit until the player has spent ≥ 4 AP this map (painted 0→4). Then entering rolls a random eligible overworld map and pays a hard `applyRewards` grant. Distinct from Latch Gate (1 AP adjacent to arm the gate itself) and Still Gate (no-fight).  
SPECIAL_RULES: Always in addition to a stable portal. Forbidden in dungeon, boss rush, and Death Realm. Below 4 AP spent it does not count as an exit. Tally keys off player AP spent this map (spells and Attack Nearest).  
OBJECTIVE: Spend AP this map to arm a bonus gamble exit, or take the stable portal.  
FAILURE_CONDITION: None. Ignoring the tally is success.  
REWARD: Hard grant on the tally portal via persist-lock `applyRewards`.  
TACTICAL_PURPOSE: A rest/overworld gamble that cannot replace the real exit.  
SOLVABILITY_REQUIREMENTS: Stable portal always works. Tally never the only portal.  
REPLAYABILITY: Tally north vs east of spawn.  
SCALING_BEHAVIOUR: None. Never a dungeon spawn.  
STATUS: PROPOSED

---

### ENC-RARE-13

ENCOUNTER_ID: ENC-RARE-13  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-CAST-QUIET` as ENC-QUIET-01, **or** `FSN-STRIDE-PULPIT` — 1× `stride_marker` bishop (cell-leave detonate 12) + 1× `pair_strider` rook (one next walk Manhattan exactly 2) + 1× `gait_sealer` pawn (cannot walk; spells legal). No Penta. No Root.  
AI_REQUIREMENTS: Marker paints a cell; leave on a walk → 12. Stand or blink off (clears, 0). Strider offers **one** legal 2-step or stand (0 walk legal). Sealer cannot walk.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-stride-mark` or `spell-pair-stride` can drop the missing id.  
MAP_REQUIREMENTS: Arena with a painted mark cell and a legal Manhattan-2 off it. Insert only if the matching combine exists this account (Quiet **or** Near/Both).  
SPECIAL_RULES: 8% on depth 4 to **insert** before mastery. `FSN-STRIDE-PULPIT/GAIT` is the Gait Pulpit skin, never Verse+Last Mute PAIR. Penta illegal.  
OBJECTIVE: Clear all. Intended: stand on the mark, or take the legal 2-step **off** it.  
FAILURE_CONDITION: Player death.  
REWARD: Peak-band victory via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Rare proof of “the cell is the bomb; the 2-step is the answer.”  
SOLVABILITY_REQUIREMENTS: Legal 2-step exists. Seal leaves casts legal.  
REPLAYABILITY: Pulpit vs Quiet skin, never both.  
SCALING_BEHAVIOUR: Do not add a fourth body. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REST-13

ENCOUNTER_ID: ENC-REST-13  
TYPE: rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Rest shrine may remind a missing Both Mend / Near Hood / Damp Sting id already observed (not a grant).  
MAP_REQUIREMENTS: Rest map. Devices: Labor Font, Hire Cache, Band Oath inlay, Tally Gate (overworld rest only), sanctuary portal at spawn.  
SPECIAL_RULES: Snapshot dungeon-chain refs before `cleanupMap`. Device table `ENC-REST-13` = Labor / Hire / Band / Tally. Tally forbidden in dungeon rest.  
OBJECTIVE: Drink, hire, wager, gamble, or leave.  
FAILURE_CONDITION: None.  
REWARD: Device-specific. No overlay.  
TACTICAL_PURPOSE: Choice / rest beat after Both / Stride / Near pressure.  
SOLVABILITY_REQUIREMENTS: Sanctuary always reachable.  
REPLAYABILITY: Device set of 2 from the four.  
SCALING_BEHAVIOUR: After one Table J clear, shrine can enable Table K (ENC-RUSH-47…50).  
STATUS: PROPOSED

---

### ENC-BRANCH-13

ENCOUNTER_ID: ENC-BRANCH-13  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 1× pawn charger. Destinations are other day-13 ids (not extra packs in the foyer).  
AI_REQUIREMENTS: Foyer pawn greedy. Destination AI from the chosen sheet.  
SPELL_DISCOVERY_OPPORTUNITIES: None in the foyer.  
MAP_REQUIREMENTS: Four locked destination portals painted `both` / `stride` / `near` / `paint` plus the foyer exit after the pawn. Snapshot `branchFlag` **before** `cleanupMap`.  
SPECIAL_RULES: Destinations: `both` → ENC-BOTH-01 or ENC-ELITE-24; `stride` → ENC-DAMP-01 or ENC-SKIP-01; `near` → ENC-NEAR-01 or ENC-ELITE-25; `paint` → ENC-PAINT-01 or ENC-PACE-02. White sanctuary never at (0,0).  
OBJECTIVE: Clear the foyer pawn, pick one branch.  
FAILURE_CONDITION: Player death in the foyer.  
REWARD: Foyer is low-band; destination pays its own sheet.  
TACTICAL_PURPOSE: Persist the primer verb so ENC-BOSS-13 / ENC-MAST-13 can read it.  
SOLVABILITY_REQUIREMENTS: All four destinations flood-fill from foyer spawn.  
REPLAYABILITY: Portal order rotates.  
SCALING_BEHAVIOUR: High: foyer pawn is a `damp_stinger` (leftover-MP poke) — still one body.  
STATUS: PROPOSED

---

### ENC-MINI-14

ENCOUNTER_ID: ENC-MINI-14  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× live `BossId` `broodmother_rook` (summon kit, cap 2) + 1× pawn charger. No Wave-13 ids.  
AI_REQUIREMENTS: Rook summons on cooldown (`ENEMY_SUMMON_COOLDOWN_TURNS = 2`) up to cap 2. Pawn greedy. No instantKill / betrayal.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing the rook’s live summon id can drop it if missing.  
MAP_REQUIREMENTS: Arena plus a 4-tile bond-seam gallery (`inheritHazardsFrom: ENC-TEACH-13`) so the pet the rook makes taxes **their** walk too.  
SPECIAL_RULES: Live 19 `BOSS_IDS` only. Dual-boss is Rush only. Side-story for Bond / Hire accounts.  
OBJECTIVE: Defeat both. Optional: never summon yourself so the seam stays free.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss band via `applyRewards`. Overlay `no_healing`.  
TACTICAL_PURPOSE: Capstone of “pets are the tax” using a shipped summon boss, not a new id.  
SOLVABILITY_REQUIREMENTS: Rook reachable; seam not on portal. Summons ≤ 2.  
REPLAYABILITY: Rook north vs east. Paint-branch accounts may swap to `mirror_sovereign` (still one boss).  
SCALING_BEHAVIOUR: Peak: inherit Exit Draft. Never add `flush_psalmist`.  
STATUS: PROPOSED

---

### ENC-BOSS-13

ENCOUNTER_ID: ENC-BOSS-13  
TYPE: boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One live `BossId` read from `branchFlag`: `both` → `pale_archbishop`; `stride` → `twin_monarchs`; `near` → `midnight_bishop`; `paint` → `mirror_sovereign`; missing flag → `pale_archbishop`. No Wave-13 ids.  
AI_REQUIREMENTS: Existing boss kits in `bossKits.ts`. No new abilities. No dual-boss.  
SPELL_DISCOVERY_OPPORTUNITIES: Observation of the boss kit follows the existing pipeline.  
MAP_REQUIREMENTS: Boss court. Branch inherit: `both` → 4 bond-seam tiles; `stride` → 1 lava gap + dry detour (ENC-SKIP-01); `near` → painted 1-step peel; `paint` → one alcove + open 2×2.  
SPECIAL_RULES: Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add `flush_psalmist` / `lone_lector` / `plate_bursar` / `lend_proctor` in the same PR as a Rush remap. Snapshot branch before `cleanupMap`.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Depth-5 dungeon grant via `applyRewards`. Overlay `no_healing` on Archbishop / Monarchs; `under_10_turns` on Bishop / Sovereign.  
TACTICAL_PURPOSE: Prove the taught verb on a shipped boss, not a new HP sponge.  
SOLVABILITY_REQUIREMENTS: Boss reachable; inherit hazards never seal the exit.  
REPLAYABILITY: Branch skins.  
SCALING_BEHAVIOUR: Tighten by inherit objects, not HP. Never `titans_vigor`. Never dual-boss.  
STATUS: PROPOSED

---

### ENC-MAST-13

ENCOUNTER_ID: ENC-MAST-13  
TYPE: mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Branch skin: `both` → `FSN-BOTH-CHOIR`; `stride` → `FSN-STRIDE-BANK`; `near` → `FSN-NEAR-STEP`; `paint` → `FSN-PAINT-NOOK/FUSE`.  
AI_REQUIREMENTS: As the named formation sheet (PR #794). Soph 3–4. Lethal lookahead on HIGH only.  
SPELL_DISCOVERY_OPPORTUNITIES: Fill any still-missing taught id from the branch.  
MAP_REQUIREMENTS: Mastery court plus the branch inherit from ENC-BOSS-13 (without the boss body).  
SPECIAL_RULES: Requires ENC-BRANCH-13 flag this account. Insert ENC-RARE-13 **before** this beat at 8% if the matching combine exists.  
OBJECTIVE: Clear the branch pack.  
FAILURE_CONDITION: Player death.  
REWARD: High-band via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove the primer without a boss HP bar.  
SOLVABILITY_REQUIREMENTS: Pack occupancy leaves walk-offs; inherit never walls.  
REPLAYABILITY: Four skins.  
SCALING_BEHAVIOUR: Peak: add Exit Draft only on `stride` / `paint`. Never promote to COURT + Penta.  
STATUS: PROPOSED

---

### ENC-RUSH-47

ENCOUNTER_ID: ENC-RUSH-47  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table K `K0` — `flush_psalmist` + `gaze_beadle`.  
AI_REQUIREMENTS: Flush the choir’s bar, then the recast must still honor **facing**. Crosier / facing-pin cell **never** occupies the Psalter. Missing `currentView` never pins. Flush cannot target him (self illegal).  
SPELL_DISCOVERY_OPPORTUNITIES: None required (Rush).  
MAP_REQUIREMENTS: Rush court plus a painted Psalter cell (floor) that is **not** the Crosier / facing-pin cell.  
SPECIAL_RULES: Unlock after one full Table J clear (`J0`–`J3`). New `roomIndex` namespace `K0`. Do **not** overwrite `BOSS_RUSH_ROOMS` or Tables B–J. Not Surplus / Lend / Grandmaster / Conductor / Wedge / Queen. Hold if `currentView` is missing.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Rush room grant via `completeBossRushRoom` (ignore client `dokaReward` / `xpReward`). Character must exist. Room-clear `applyRewards` only after `currentRoom` actually advanced.  
TACTICAL_PURPOSE: Taught cadence-flush + facing after day-8 Face and day-12 Stretch.  
SOLVABILITY_REQUIREMENTS: Psalter ≠ Crosier. Both bosses reachable.  
REPLAYABILITY: Psalter west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-48

ENCOUNTER_ID: ENC-RUSH-48  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table K `K1` — `lone_lector` + `aisle_canon`.  
AI_REQUIREMENTS: Cluster with a pet to deny the +8; the **posts occupy the hug tiles**. Triple-span posts **never** occupy the Ambo. Posts are enemy-side — they do **not** break your isolation. Sentinel + Archer + posts share remaining cap. Live cap 2: spawn **at most two** posts (not Triple).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Rush court plus a painted Ambo cell that posts never occupy.  
SPECIAL_RULES: `K1` after `K0`. Hold if isolation scan is missing. Not Brand / Hexed / Span / Cover / Cord. Do not spawn Triple-span while cap < 3.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-47.  
TACTICAL_PURPOSE: Taught Lone Nail + aisle posts after day-11 ENC-LONE-01.  
SOLVABILITY_REQUIREMENTS: Ambo free. Posts ≤ remaining cap.  
REPLAYABILITY: Ambo north vs south.  
SCALING_BEHAVIOUR: Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-49

ENCOUNTER_ID: ENC-RUSH-49  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table K `K2` — `plate_bursar` + `ram_castellan`.  
AI_REQUIREMENTS: Ram him on the **arming** turn; do not swing the plated turn. Brace dest **never** occupies the Aumbry. This turn’s ram is **not** absorbed (delay 1).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Rush court plus a painted Aumbry cell that the Brace dest never occupies.  
SPECIAL_RULES: `K2` after `K1`. Hold if Morrow Plate delay-1 **or** ram dest writer is missing. Not Morrow / Rebound / Cover / Wick / Fosse / Hook.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-47.  
TACTICAL_PURPOSE: Taught delayed plate + ram after day-11 ENC-MORROW-01.  
SOLVABILITY_REQUIREMENTS: Aumbry ≠ Brace dest. Player keeps a walk-off after the ram.  
REPLAYABILITY: Aumbry west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-50

ENCOUNTER_ID: ENC-RUSH-50  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table K `K3` — `lend_proctor` + `brick_cellarer`.  
AI_REQUIREMENTS: Dump leftover AP to the pet while the **brick slides the spend lane**. Mortar dest **never** occupies the Coffer. Lend does not grant AP above max. World walls are not brick sources.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Rush court plus a painted Coffer cell and **one** pre-placed barrier the Cellarer can slide.  
SPECIAL_RULES: `K3` after `K2`. Hold if leftover-AP lend **or** brick-slide dest is missing. Not Flush / Surplus / Font / Palisade / Fosse.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-47.  
TACTICAL_PURPOSE: Taught leftover-AP dump + brick after day-10 Purse and ENC-BRICK-01.  
SOLVABILITY_REQUIREMENTS: Coffer ≠ Mortar dest. Path remains after the slide.  
REPLAYABILITY: Coffer north vs south.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain Y — “Both / Stride Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-13 then ENC-SPELL-25 (or ENC-SPELL-26 if Both Mend already owned) |
| 2 | Reinforce | ENC-WAVE-14 |
| 3 | Combine | ENC-BOTH-01 **or** ENC-DAMP-01 **or** ENC-NEAR-01 |
| 3 insert | Choice | ENC-BRANCH-13 → both/stride/near/paint destinations |
| 4 | Pressure | ENC-SURV-25 **or** ENC-PAINT-01 **or** ENC-CLASH-01 **or** skip via ENC-REST-13 |
| 4 | Mastery | ENC-MAST-13 (branch skin) |
| 5 | Boss | ENC-BOSS-13 |

Rare: 8% on depth 4 to **insert** ENC-RARE-13 before mastery (only if the matching combine exists this account).  
Treasure: rest may offer ENC-TREAS-13 instead of ENC-PROT-13.  
Bond side-story: replace combine with ENC-PRIO-15 and mini-boss ENC-MINI-14 (`broodmother_rook`).

### Chain Z — “Clear / Heal Primer” (maxDepth 4)

ENC-CLEAR-01 → ENC-MOVE-24 → ENC-ORTH-01 → ENC-REST-13 → ENC-BOSS-13 (`midnight_bishop` only if Near was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-CLEAR-01 as teach on accounts that already know Bond Seam.

### Rush injection (day-13)

After one full Table J clear, ENC-REST-13 shrine can enable: K0 → ENC-RUSH-47, K1 → ENC-RUSH-48, K2 → ENC-RUSH-49, K3 → ENC-RUSH-50. Day-1…day-12 flags for rooms 0–9 and Tables B–J remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-13, ENC-SPELL-25, ENC-SPELL-26 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-25, ENC-HAZ-26, ENC-SIDE-01, ENC-ORTH-01, ENC-CLEAR-01 | `under_50_damage` |
| ENC-BOTH-01, ENC-DAMP-01, ENC-NEAR-01, ENC-ELITE-24, ENC-ELITE-25 | `under_8_ap_per_turn` |
| ENC-WAVE-14, ENC-PRIO-15, ENC-MAST-13 | `under_10_turns` |
| ENC-PACE-02, ENC-QUIET-01, ENC-PROT-13 | `direct_hit` |
| ENC-CLASH-01, ENC-TRIM-01, ENC-ELITE-25, ENC-BOSS-13 | `no_healing` |
| ENC-SURV-25, ENC-SURV-26 | `no_healing` (not `no_damage_taken`) |
| ENC-MOVE-24, ENC-MOVE-25, ENC-ALLY-02, ENC-SKIP-01, ENC-BRICK-01 | `under_50_damage` |
| ENC-URN-01 | `under_5_turns` if the blast is used |
| ENC-TREAS-13 / ENC-REST-13 / ENC-HIRE-01 / ENC-BAND-01 / ENC-MERCY-02 / ENC-LABOR-01 / ENC-TALLY-01 / ENC-HIGH-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | 6 bond-seam tiles **or** 1 shy cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | seam **or** side plate | kill + optional glyph |
| MID | named drop-12 `FSN-*` or waves | backline guard | zone 1 + Both/Damp/Near | one Wave-12 `WF-*` | clock / pads / orth |
| HIGH | elite or choir | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / cluster / hold |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / COURT / rare | branch-skinned | mastery / Table K |

If a live player is over-levelled for a band, **promote the band’s verb** (add Spare Pace, enable Bank, inherit seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-12 fields plus:

```
encounterId
encounterType        // + both | damp | near | paint | clash | skip | brick |
                     //   pace_pair | trim | quiet | bond_seam | shy_cinder |
                     //   side_plate | labor_font | clear_step | hire_cache |
                     //   band_oath | orth_step | tally_gate | blast_urn |
                     //   hollow_file | high_picket | heal_sill | exit_draft |
                     //   mercy_scribe | mercy_bell | ally_sill
formationId?         // FSN-BOTH-SPEND | FSN-STRIDE-DAMP | FSN-NEAR-MUST |
                     // FSN-PAINT-NOOK | FSN-ALLY-SILL | FSN-BODY-CLASH |
                     // FSN-LAVA-STILL | FSN-BRICK-WATCH | FSN-BOTH-CHOIR |
                     // FSN-STRIDE-BANK | FSN-NEAR-STEP | FSN-SHOVE-PACE |
                     // FSN-TRIM-TAX | FSN-STRIDE-PULPIT | FSN-BOOT-OATH |
                     // FSN-CAST-QUIET
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // both | stride | near | paint
decoyId? / realId?   // ENC-PRIO-15
holdPortalLocked?
objectiveKind        // + deny_font | open_hire_cache | flag_band_oath |
                     //   keep_mercy | wound_scribe | knock_urn |
                     //   plant_clear_pad | arm_tally
failureKind
deviceTable[]        // ENC-REST-13 Labor / Hire / Band / Tally
rushVariant?         // table_k0_flush_gaze | table_k1_lone_aisle |
                     //   table_k2_plate_ram | table_k3_lend_brick
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Scribe / Final Pawn / Mender” logic — use `decoyId` / `realId` / `formationId` / `summonAI`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-29 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not. `fog_of_war` may still be used as a **wall-hook substitute** for ambush concealment, matching day-1…12 language.
- Dual-boss dungeon capstones (Rush only).
- Consuming same-day 2026-10-21 Wave 13 family / spell / world catalogs, if any land in parallel. Wave 12 families wait for a later formation drop. `FSN-CAST-QUIET/PENTA` / Quad Span / `FSN-HOLD-VERSE/QUAD` stay held while `ENEMY_SUMMON_CAP` is 2 (Penta needs remaining ≥ 5).
- Faking Both Mend without two walk-spend flags, Damp +8 without leftover-MP ≥ 2, Near Hood as a ≥3 zero, Must Step as Manhattan 2, Paint Reel as Foe Reel, Ally Step as Swap, Clash Mend as Shove Mend, Lava Skip as a required player hop, Brick Wipe as a wall punch, Pair Pace as `isSwap`, Verse Tax without `lastResolvedSpellId`, Cast+Quiet on one tile, Tally / Mercy Bell in a dungeon, High Picket as Low Picket.
- Adding Wave-13 boss ids to dungeon ENC-BOSS-13 in the same PR as a Rush remap.

---

## 10. Pick order (day-13, after days 1–12 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–12 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-13 + ENC-SPELL-25 (bond-seam / both-mend verbs)  
2. ENC-WAVE-14 (`formationId` BOTH-SPEND → STRIDE-DAMP)  
3. ENC-BOTH-01 or ENC-DAMP-01 or ENC-NEAR-01 (new pressure objects)  
4. ENC-BRANCH-13 (`branch: both|stride|near|paint` snapshot-before-cleanup)  
5. ENC-BOSS-13 branch read  
6. Rush Table K variants 47–50 one room at a time (after the account has one full Table J clear)

Uniqueness: this file is the **thirteenth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
