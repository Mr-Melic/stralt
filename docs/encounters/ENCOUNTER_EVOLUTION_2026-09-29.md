# Encounter Evolution Catalog — 2026-09-29

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-29-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574), `ENCOUNTER_EVOLUTION_2026-09-26.md` (`EED-2026-09-26-001`, PR #635), `ENCOUNTER_EVOLUTION_2026-09-27.md` (`EED-2026-09-27-001`, PR #672), `ENCOUNTER_EVOLUTION_2026-09-28.md` (`EED-2026-09-28-001`, PR #737). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-11 Wave 10 packs `docs/design/ENEMY_FORMATIONS_2026-09-28.md` (PR #727), Wave 11 world features in `docs/WORLD_DYNAMICS.md` (PR #719, `WDD-2026-09-28-001`), Rush Table J `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.9 (PR #753). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines. `enemyAI.ts` is 2,580 lines.

Same-day (2026-09-29) Wave 12 family / spell / world-feature catalogs will land in parallel. **Do not consume them** and do not mint colliding `FSN-*` / `WF-*` / Wave-12 family ids here. Wave 11 **families** (`infirm_chanter` is a **boss** id, not a family — Wave 11 elite sheets live in PR #752) wait for a later formation drop. Wave 12 **bosses** stay Rush-only (Table J).

---

## 1. Why a twelfth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–11 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, Face/Mute/Span/Brand, Hug/Boot/Write/Dull, Purse/Hinge/Gait, and Pace/Nail/Flush. Day-11 rooms spent leftover drop-10 packs (`FSN-GAIT-PACE`, `FSN-LONE-NAIL`, `FSN-FLUSH-DUMP`, …) and Wave 10 **world features**. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-11 Wave 10 packs | Day-11 taught gait-walk / isolation nail / flush tempo as **rooms**. Still PDFs: `FSN-SHOVE-BASH`, `FSN-DRY-TAX`, `FSN-WICK-HOOD`, `FSN-TICK-RAT`, `FSN-HOME-SILL`, `FSN-EXIT-PAIR`, `FSN-FOE-FANG`, `FSN-FIELD-WIPE`, `FSN-SHOVE-CHOIR`, `FSN-WICK-SPAN`, `FSN-DRY-KEEP`, `FSN-BOOT-CHASE`, `FSN-STRETCH-MUTE`, `FSN-HOME-QUIET`, `FSN-FOE-WOUND`, `FSN-HOLD-VERSE` |
| World-feature Wave 11 | Day-11 **rooms** never spent `WF-HAZ-LATE_SEAM`, `WF-HAZ-RIM_CINDER`, `WF-TRP-DASH_PLATE`, `WF-TER-LOOSE_KEYSTONE`, `WF-OBS-STRIDE_SILL`, `WF-ZON-QUICK_HAND`, `WF-TEL-INIT_SWAP`, `WF-INV-WOUNDED_FILE`, `WF-ELT-LOW_PICKET`, `WF-TRS-LATE_CACHE`, `WF-SPL-MARK_TUTOR`, `WF-RSK-SPARE_OATH`, `WF-MOD-COLD_OPEN`, `WF-EVT-VACANT_HOUR`, `WF-ENV-CORNER_DRAFT` |
| Rush Table J | `J0`–`J3` (`infirm_chanter`+`levy_rector`, `yoke_subchanter`+`veil_verger`, `salve_wicker`+`bait_vicar`, `brand_curate`+`oath_dean`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `lateSeamCells` / `rimCinderRing` / `dashPlateCell` / `keystoneCell` / `strideSillCell` / `quickHandCell` / `initSwapCell` / `cornerDraftArmed` / `coldOpenArmed` / `mustSpanArmed`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Dummy Post counts as **1**. Quad Span / `FSN-HOLD-VERSE/QUAD` count as **4** — do not spawn them while remaining cap < 4.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Bash / dry / hood / tick / home / exit / fang / wipe bodies must **not** carry drain / nova / rallying-cry unless they are the named healer slot. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Shove Mend / Chase Mend / Split Mend live **only** on healer profiles.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-STILL_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean). Forbidden in dungeon, boss rush, and Death Realm.
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-12 ids (`infirm_chanter`, `yoke_subchanter`, `salve_wicker`, `brand_curate`) in the same PR as a Rush remap.
- Knight Slip / Swap / Shove Face / Pivot / Pair Hinge / Pair Slide / Home Step / Foe Reel / Init Swap **does not** count as walk-MP for Gait Mend, Boot Sting, Gait Seal, Gait Wick, Must Span, or Chase Mend.
- Pair Slide dests are occupancy cells, **not** `isSwap`. Home Step is self-relocate onto a free adj of the targeted ally. Foe Reel attracts toward **another hostile**, not self. Tick Plate eats **one** DoT tick, not a hit. Far Hood zeros a hit from Chebyshev ≥ 3, not 1–2. Quiet Sill forbids Strike / `isPhysical` on the painted cell; spells stay legal. Echo Wipe erases **paint**, not walls.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-BASH-01 / ENC-SPELL-23 / ENC-ELITE-22 | `forcedMovedThisTurn` writer | Convert to ENC-SLAM-01 (queued day-4) without claiming Shove Mend |
| ENC-DRY-01 / ENC-KEEP-01 | leftover-AP gate **or** Dry Sting +8 on leftover 0 | Convert to ENC-PURSE-01 (queued day-10) without claiming Dry |
| ENC-HOOD-01 / ENC-SPELL-24 | `walkMpSpentThisTurn` writer **or** Far Hood consume | Convert to ENC-BOOT-01 (queued day-9) or ENC-TEACH-03 (range tax) |
| ENC-TICK-01 | one-tick consume that leaves the other DoT | Convert to ENC-HAZ-06 paper-plague (queued day-3) without claiming Plate |
| ENC-HOME-01 | self-relocate dests (not Swap) **or** Quiet Sill `isPhysical` refuse | Convert to ENC-HINGE-01 (queued day-10) without claiming Home |
| ENC-EXIT-01 | pair occupancy dests **or** leave-hook (walk **or** force-move) | Convert to ENC-PEEL-01 (queued day-11) without claiming Exit |
| ENC-FANG-01 / ENC-PRIO-14 | `applyAttract` toward **other hostile** | Convert to ENC-ALLY-01 (queued day-11) without claiming Fang |
| ENC-WIPE-01 | paint-erase that is not a wall punch | Convert to ENC-HUG-01 (queued day-9) without claiming Wipe |
| ENC-HOLD-03 / ENC-RARE-12 | dual hold flags (spells until walk **and** Strike until a spell) | Convert to ENC-HOLD-02 (queued day-11) without claiming Verse |
| ENC-CHASE-01 | Boot Lend unmoved gate **and** Chase Mend target-walked | Convert to ENC-PACE-01 (queued day-11) without claiming Chase |
| ENC-STRETCH-01 | `lastResolvedSpellId` **or** remaining-CD ×2 | Convert to ENC-CRACK-01 (queued day-9) without claiming Stretch |
| ENC-MOVE-22 | lowest-HP% swap occupancy | Convert to ENC-MOVE-20 farthest-living (queued day-11) |
| ENC-MOVE-23 | wall→floor after a player **walk MP** (Attack Nearest does not count) | Convert to ENC-MOVE-21 spell-sill (queued day-11) |
| ENC-AMBUSH-12 | elite appears only while current HP < 70% max | Convert to ENC-CAMP-01 sleeping elites (queued day-8) |
| ENC-PROT-12 | wounded-file world attrition **or** low-picket HP gate | Convert to ENC-PROT-11 kin plate (queued day-11) |
| ENC-SURV-23 | end-of-turn 2-wall adjacency tax | Convert to ENC-SURV-06 ash-rain shelter (queued day-3) |
| ENC-RUSH-43…46 | Table J bosses + infirmary/cowl/pad/stylus objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Bash / Dry / Hood primer + inserts)

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

| Beat | Depth hint | Job | Day-12 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (late-seam hop, shove-then-heal, leftover-0 poke) | ENC-TEACH-12, ENC-SPELL-23, ENC-HAZ-23 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-13, ENC-AMBUSH-12, ENC-SPELL-24 |
| Combine | 2–3 | Two taught verbs | ENC-BASH-01, ENC-DRY-01, ENC-HOOD-01, ENC-HAZ-24, ENC-MOVE-22 |
| Pressure | 3 | Clock, cluster, chase, or dual hold | ENC-SURV-23, ENC-PROT-12, ENC-TICK-01, ENC-CHASE-01, ENC-PRIO-14, ENC-HOLD-03 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-12, ENC-BRANCH-12, ENC-TREAS-12, ENC-SPARE-01, ENC-VACANT-01, ENC-MARK-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-22, ENC-ELITE-23, ENC-RARE-12, ENC-MAST-12, ENC-EXIT-01, ENC-FANG-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-13, ENC-BOSS-12, ENC-RUSH-43…46 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and queued days 4–11 remain valid. Day-12 **Bash / Dry / Hood primer** is the default for accounts that already cleared Pace / Nail / Flush once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-12

ENCOUNTER_ID: ENC-TEACH-12  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a late-step tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 6-tile ochre ribbon of `WF-HAZ-LATE_SEAM` across the mid-band (the **first cell entered this turn** is free even if it is a seam; after that first step, entering a seam cell costs 4% max HP). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First late-seam tax logs a teach line. Do not also apply Salt Crust (ENC-HAZ-05: first **salt** cell free even as a later step) or Retrace Dust (ENC-TEACH-11: same cell twice). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: spend the first step **on** the seam, then leave it.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “open on the seam; a second seam step in the same turn is the tax.” Prepares ENC-HAZ-24 / ENC-BASH-01 (you will want a 2-step that does **not** pay twice).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a 3-column aisle so the player can take the first step onto the ribbon then peel off. Seam never walls a corridor. Not on spawn±3 or the portal. Counts as 6 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit one `WF-HAZ-RIM_CINDER` ring on a **gallery** (`inheritHazardsFrom: ENC-HAZ-23`). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-23

ENCOUNTER_ID: ENC-HAZ-23  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand on the rim **once**. Wounded pawns treat the next clockwise rim cell like lava (`ENEMY_HAZARD_AVOID_HP_PCT`). Bishop kites from the unmarked interior.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a rim tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: A painted outer-ring of ≥ 6 floor cells with one `WF-HAZ-RIM_CINDER` occupying one rim cell (slides one cell clockwise at each round start, wrapping; 5% max HP on land). Interior is unmarked floor. A path that never needs the rim. Exit behind the bishop. Distinct from Orbiting Cinder (4-tile square), Turnstile Ember (plus), Plumb Ember (vertical column), and Skipping Cinder (2-tile hop).  
SPECIAL_RULES: Scripted rim only. Rim never covers spawn/portal. Tax via challenge HP recorders. Skip the roll if the map has no closed walkable rim of at least 4 floor cells.  
OBJECTIVE: Clear all. Intended: stand in the interior, cross after it passes.  
FAILURE_CONDITION: Player death (frost + rim tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing the rim.  
TACTICAL_PURPOSE: Teach “the ember rides the outer ring clockwise; the interior is free.” Distinct from falling columns and hopping pluses.  
SOLVABILITY_REQUIREMENTS: Interior path remains; rim is floor, not a wall. Counts as 1 toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ring west court vs east court. Start cell north vs south.  
SCALING_BEHAVIOUR: Mid: inherit 2 late-seam tiles on a **gallery** (`inheritHazardsFrom: ENC-TEACH-12`). High: bishop gains `spell-slow`. Never two rim cinders.  
STATUS: PROPOSED

---

### ENC-HAZ-24

ENCOUNTER_ID: ENC-HAZ-24  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`) + 1× pawn charger. No kin-family overlay.  
AI_REQUIREMENTS: Bishop kites off the plate. Pawn may step the plate as a first step (pays). No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One visible `WF-TRP-DASH_PLATE` in the mid-band (first unit to step on it pays 8% max HP **unless** they already spent 2 or more MP this turn; then the plate becomes floor) **plus** the ENC-TEACH-12 late-seam ribbon on a **gallery** (`inheritHazardsFrom: ENC-TEACH-12`). A path around both. Distinct from Glyph Plate (always taxes), Kin Plate (summon-adj skip), Weary Plate (end-turn after 2+ AP), and Idle Pin (end-turn 0 MP).  
SPECIAL_RULES: Scripted plate + seam only. Plate never hidden. Attack Nearest is not a walk. Force-move onto the plate as a first step still pays. Tax via challenge HP.  
OBJECTIVE: Clear all. Intended: dash 2 MP then step **or** walk around; spend the first step on the seam, not as a second seam hop.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a dash-skip plate with a late-step tax so “sprint the mid-band for free” is the wrong answer unless you already paid 2 MP.  
SOLVABILITY_REQUIREMENTS: Path around plate and seam; plate not on a seam cell. Plate counts as 1 hazard budget.  
REPLAYABILITY: Plate left vs right. High: enable `FSN-BOOT-CHASE` spare (ENC-CHASE-01) so the pack can **fund** the 2 MP.  
SCALING_BEHAVIOUR: High: enable Boot Lend (ENC-CHASE-01). Peak: add `WF-ENV-CORNER_DRAFT` so ending in an alcove after the dash is a second tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-23

ENCOUNTER_ID: ENC-SPELL-23  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-SHOVE-BASH/SOLO-MEND` fallback — 1× `shove_mender` queen (`spell-shove-mend` + `starter-shield`) + 1× pawn (`physical_attack` only). Shoulder Bash off until band 1 honesty.  
AI_REQUIREMENTS: Mender Shields, then mends **only** if `forcedMovedThisTurn` is true on the target; otherwise Shield / skip. Never drain / nova / Gait Mend / Chase Mend. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-shove-mend` (heal 8 iff the **target** was force-moved this turn) can drop that id if missing. Extra door `shove_cantor` — first child wins vs a later observe. Do not restamp claimed feats.  
MAP_REQUIREMENTS: Open court. No lava. One locked exit. A side wall the player can be bashed **beside**, never the last exit.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing force-move flag → Shield queen (still a valid teach: they did **not** mend after a walk). Do not fake the heal with `starter-heal`. Distinct from ENC-SPELL-21 (caster-walked Gait Mend). Walk MP does not pay Shove Mend.  
OBJECTIVE: Defeat both. Optional: never let the mender cash a shove heal (refuse the bash, Nail Down, kill before the flag).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + shove-mend discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this mend is paid in **someone else moving you**” on a clean court so ENC-BASH-01 can add Shoulder Bash without two new verbs.  
SOLVABILITY_REQUIREMENTS: Both reachable. Side wall not the only aisle.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: Mid: enable `ROLE-PUSHER` (`FSN-SHOVE-BASH`). High: inherit 2 late-seam tiles on the bash file (`inheritHazardsFrom: ENC-TEACH-12`) so the paid displace cannot double-tax the ribbon.  
STATUS: PROPOSED

---

### ENC-SPELL-24

ENCOUNTER_ID: ENC-SPELL-24  
TYPE: spell-discovery / elite encounter  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-DRY-TAX/SOLO` **or** `FSN-WICK-HOOD/SOLO-WICK` — 1× `dry_stinger` knight (`spell-dry-sting` or Frost if leftover unread) **or** 1× `gait_wicker` pawn (`spell-gait-wick` or Frost if walk-spend unread) + 1× pawn charger. Act Tax / Far Hood off until band 1.  
AI_REQUIREMENTS: Dry skips +8 if leftover AP ≥ 1 (12 still legal). Wicker Marks if the player still has walk MP; stand is 0. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `spell-dry-sting` **or** `spell-gait-wick` can drop that id if missing. MULTI child `dry_gallery` / `wick_gallery` — first child wins vs observe. Do not teach both verbs in one room; the unused id waits for ENC-DRY-01 / ENC-HOOD-01.  
MAP_REQUIREMENTS: Fortress courtyard + **one gallery**. A 4-tile file toward the gun. Reject a 1-tile tunnel.  
SPECIAL_RULES: Family lottery **off**. Band 0: Frost only — still a valid teach: Dry wants an empty bar, Wick wants a next walk. Honesty: missing leftover scan → Frost forever on Dry; missing walk-spend → Frost forever on Wick. No Purse Keep until ENC-KEEP-01. No Far Hood until ENC-HOOD-01.  
OBJECTIVE: Defeat both. Optional: keep 1 leftover AP (Dry) **or** stand this turn (Wick).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + dry-sting **or** gait-wick discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach one of “empty bar = +8” **or** “the next walk detonates” so the PAIR rooms can add the second role.  
SOLVABILITY_REQUIREMENTS: Both reachable. Gallery not the only aisle.  
REPLAYABILITY: Dry file vs Wick file (account flag `spell24Skin: dry|hood`).  
SCALING_BEHAVIOUR: Mid: enable the missing PAIR role (`FSN-DRY-TAX` or `FSN-WICK-HOOD`). High: inherit late-seam on the file.  
STATUS: PROPOSED

---

### ENC-BASH-01

ENCOUNTER_ID: ENC-BASH-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SHOVE-BASH` — 1× `bash_bruiser` pawn/knight (Strike + Shoulder Bash) + 1× `shove_mender` queen (Shove Mend + Shield). No Inferno. No Gait / Chase Mend.  
AI_REQUIREMENTS: Bruiser walks a flank and Bashes after the player is on a file, aiming at a wall **beside** the engagement, never the last exit. Bash into open floor is skipped (VETERAN). Mender stays Chebyshev ≥ 3; mends only if the force-move flag is true. Hostiles start ≥ 4 apart. Never turn-1 bash on a full-HP player into a dead end.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Shoulder Bash / Shove Mend if missing. Extra door vs ENC-SPELL-23.  
MAP_REQUIREMENTS: Open court + one side wall. Bash dest: free floor, not lava / pit / fuse, player keeps ≥ 1 walk-off. Optional 2 late-seam tiles on a **gallery** (`inheritHazardsFrom: ENC-TEACH-12`).  
SPECIAL_RULES: Family lottery **off**. Elite: Bruiser only. Band 0: do not spawn this id — show ENC-SPELL-23. Honesty: missing `forcedMovedThisTurn` → Shield queen (ENC-SPELL-23). Collision bonus vs wall is allowed if a side step remains.  
OBJECTIVE: Defeat both. Intended: eat the bash off-file **or** kill the mender before the flag cashes.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine displace-then-heal so “stand still and trade” feeds the 8. Distinct from ENC-SLAM-01 (attract then push, no mend).  
SOLVABILITY_REQUIREMENTS: Walk-off after bash; dest not the portal; 2-unit occupancy leaves an aisle.  
REPLAYABILITY: Bash file west vs east. High: `FSN-SHOVE-CHOIR` (ENC-ELITE-22) adds Pair Slide as a **second** force-move — never bash **and** slide the same body the same round.  
SCALING_BEHAVIOUR: High: choir (ENC-ELITE-22). Peak: inherit dash plate (ENC-HAZ-24) so a bash onto the plate as a first step is a tax, not a skip. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-DRY-01

ENCOUNTER_ID: ENC-DRY-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DRY-TAX` — 1× `dry_stinger` knight (Strike + Dry Sting) + 1× `act_teller` bishop (Frost + Act Tax). No Purse Keep (that is ENC-KEEP-01). No Empty Plate. No drain on the Teller.  
AI_REQUIREMENTS: Teller stays at 3–4 and Taxes if leftover ≥ 2. Dry lurks at 3 and **ignores** a wet bar unless 12 kills. Hostiles start ≥ 4 apart. Never turn-1 20 on a full-HP full-bar player. Gate is leftover **before** Dry’s own AP debit.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Dry Sting / Act Tax if missing. Extra door vs ENC-SPELL-24 `/DRY`.  
MAP_REQUIREMENTS: Fortress courtyard + gallery. No lava. One locked exit.  
SPECIAL_RULES: Family lottery **off**. Elite: Dry only. Honesty: missing leftover-AP gate → ENC-PURSE-01 language without claiming Dry. Unlock after ENC-FLUSH-01 **or** ENC-SPELL-24 dry skin (player has seen leftover AP as a resource).  
OBJECTIVE: Defeat both. Intended: keep 1 leftover so the +8 never lands, **or** dump and kill Dry first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “spending the last 2 is expensive because the knight cashes 0 leftover.” Distinct from ENC-PURSE-01 (leftover ≥ 2 is the **tax condition**, not the empty-bar gun).  
SOLVABILITY_REQUIREMENTS: Both reachable; gallery not a 1-tile tunnel.  
REPLAYABILITY: Dry west vs east. High: `FSN-DRY-KEEP` (ENC-KEEP-01) banks **their** leftover — Dry still does not see 0 while Keep is armed **this** turn.  
SCALING_BEHAVIOUR: High: Keep (ENC-KEEP-01). Peak: inherit `WF-RSK-SPARE_OATH` (ENC-SPARE-01) so winning with leftover AP is **also** the wager — two leftover questions, one bar. Never Empty Plate.  
STATUS: PROPOSED

---

### ENC-HOOD-01

ENCOUNTER_ID: ENC-HOOD-01  
TYPE: elite encounter / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WICK-HOOD` — 1× `gait_wicker` pawn/bishop (Gait Wick, no heal) + 1× `far_hooder` bishop (Far Hood + Frost). No Must Span (that is ENC-ELITE-23). No Fuse.  
AI_REQUIREMENTS: Wicker Marks if the player still has walk MP; will not refresh an already-marked target. Hooder Hoods if nearest hostile ≥ 3; skips if you are already at 2. Relocate / Swap / Home Step does **not** detonate Wick. Stand is 0.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Gait Wick / Far Hood if missing. Extra door vs ENC-SPELL-24 `/HOOD`.  
MAP_REQUIREMENTS: Open court. A 4-range sniper perch **and** a close pocket at Chebyshev 2. No min-range wall that makes closing illegal.  
SPECIAL_RULES: Family lottery **off**. Elite: Hooder only. Honesty: missing walk-spend → Frost/Strike PAIR (soft). Distinct from ENC-BOOT-01 (already-walked **now**) and ENC-WICK-01 (tile fuse occupancy). DoT does not consume Hood. Hits from 1–2 land.  
OBJECTIVE: Defeat both. Intended: stand (Wick 0, Hood eats the snipe) **or** close to 2 (detonate Wick, answer Hood). That is the PAIR question, not a lock.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Force a readable choice between “don’t walk” and “don’t snipe.” Prepares ENC-ELITE-23 (`FSN-WICK-SPAN`: the close is a **forced 2-step**).  
SOLVABILITY_REQUIREMENTS: A Chebyshev-2 pocket exists that is not the portal; perch reachable by walking around, not only through Wick paint.  
REPLAYABILITY: Perch north vs east. High: Must Span (ENC-ELITE-23).  
SCALING_BEHAVIOUR: High: `FSN-WICK-SPAN`. Peak: inherit late-seam on the 2-step so the forced close cannot hop the ribbon twice. Never Fuse.  
STATUS: PROPOSED

---

### ENC-TICK-01

ENCOUNTER_ID: ENC-TICK-01  
TYPE: hazard battles / pressure  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TICK-RAT` — 1× `tick_plater` rook (Strike + Tick Plate) + 1× live `plague_rat` pawn (`starter-poison` + `spell-venom-strike`). No Empty Plate. No Ignite (that is ENC-STRETCH-01). No drain on the rat.  
AI_REQUIREMENTS: Rat applies and leaves (VETERAN: refuse melee on a target that already has this rat’s venom). Plater Plates when own next tick ≥ 8, else Strikes. If the player never paints, this is a fat rook + glass pawn — fine.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Tick Plate / venom-strike / poison can drop that id if missing. Extra door vs ENC-HAZ-06.  
MAP_REQUIREMENTS: Arena plus optional leftover 2 late-seam tiles (`inheritHazardsFrom: ENC-TEACH-12`). No Glass Realm (DoT + double damage is a sponge). No Inferno on PAIR.  
SPECIAL_RULES: Family lottery **off**. Elite: Plater only. Never an elite rat. Tick Plate consumes **one** tick that would apply HP loss, then expires. Two DoT types still land the other. Direct hits unaffected. Iron Golem DoT-immunity is a **counter**, not a member.  
OBJECTIVE: Clear all. Intended: kill the rat before a second stack, then poke the plated rook while it is eating a tick.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing` is fair (DoT is the tax).  
TACTICAL_PURPOSE: Teach “stacked DoT vs a body that **eats one tick**” so standing still is wrong and a single cleanse is not enough. Distinct from ENC-HAZ-06 (no plate).  
SOLVABILITY_REQUIREMENTS: 2-unit occupancy leaves walk-offs; rat starts ≥ Chebyshev 4 from the plater.  
REPLAYABILITY: Rat west vs east. High: `FSN-TICK-RAT/EMPTY` (Tick Empty) only if Empty Plate honesty exists — otherwise stay PAIR. Peak: ENC-STRETCH-01 adds Ignite as a **later** cash, not on this room.  
SCALING_BEHAVIOUR: High: inherit gutter steam from ENC-HAZ-06 **or** late-seam, not both. Never Glass Realm. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-WAVE-13

ENCOUNTER_ID: ENC-WAVE-13  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: 2× pawn chargers (no families). Wave 2: `FSN-SHOVE-BASH` **or** `FSN-DRY-TAX` **or** `FSN-WICK-HOOD` by `branch` (or `formationId` if no foyer yet). Never more than 4 living. Skip wave 2 if honesty reroll would convert the pack.  
AI_REQUIREMENTS: Wave 1 greedy. Wave 2 uses the PAIR sheet. `holdPortalLocked` until wave 2 clear. Far-lane `waveSpawnCells` — never on spawn±3 or the portal.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 2 observe as the matching SPELL / BASH / DRY / HOOD room.  
MAP_REQUIREMENTS: Fortress + aisle. Late-seam ribbon on the aisle (`inheritHazardsFrom: ENC-TEACH-12`) so wave-2 displace / 2-step / leftover dump cannot hop twice.  
SPECIAL_RULES: Portal locked until both waves clear. Lottery **off**. If wave 2 cannot place (cap, occupancy), skip it and keep one pawn alive as the lock.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Reinforce the primer verb after a trivial opener so the PAIR is the exam, not the first thing on the map.  
SOLVABILITY_REQUIREMENTS: Wave-2 cells flood-fill from spawn; skip unplaceable waves; living hostiles well under `MAX_ENEMIES`.  
REPLAYABILITY: Branch skin. High: wave 2 is CELL (`FSN-HOME-SILL` / `FSN-EXIT-PAIR` / `FSN-FOE-FANG`) if the matching combine already cleared this account.  
SCALING_BEHAVIOUR: Wave 2 pack, not HP. Never a third wave here (that is ENC-MAST-12).  
STATUS: PROPOSED

---

### ENC-AMBUSH-12

ENCOUNTER_ID: ENC-AMBUSH-12  
TYPE: ambushes  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: 1× bishop (`starter-frost`) + 1× pawn. Ambush elite: 1× `dry_stinger` **or** `far_hooder` (hard threat, same-tier) on a painted `WF-ELT-LOW_PICKET` post that occupies only while the player’s current HP is below 70% of max. At or above 70% the post is empty floor. Dungeon / boss rush: they stand from map start (required for map-clear).  
AI_REQUIREMENTS: Opener greedy. Elite uses Dry or Hood sheet (one verb). No betrayal.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe the elite’s id if missing.  
MAP_REQUIREMENTS: Courtyard + painted post. Exit reachable without touching the post. Post is floor. Counts as 1 toward `MAX_ENEMIES` when standing. Distinct from Near Picket (proximity), Spell Picket (after a cast), Odd/Even Picket (round parity), and ENC-AMBUSH-11 (elite after a player **spell**).  
SPECIAL_RULES: Appearance keys off current/max HP. Honesty: missing HP gate → ENC-CAMP-01 sleeping elites without claiming Low Picket. `fog_of_war` may hide the post as chrome only.  
OBJECTIVE: Clear opener; fight the picket if it stands (in a run it already does). Exploration: stay ≥ 70% and walk past.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + hard purse if the picket was fought. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “this elite is a health wager, not a fog surprise.” Distinct from ENC-CAMP-01 (sleeping).  
SOLVABILITY_REQUIREMENTS: Exit without the post; post never on spawn±3. In a run, picket is a hostile from start.  
REPLAYABILITY: Dry picket vs Hood picket.  
SCALING_BEHAVIOUR: High: inherit late-seam on the approach. Never two pickets.  
STATUS: PROPOSED

---

### ENC-REINF-12

ENCOUNTER_ID: ENC-REINF-12  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: `FSN-TICK-RAT` (2). Reinforcement on round 3: 1× `echo_wiper` bishop (`spell-echo-wipe` or Frost) if a living hostile remains and cap allows. Never more than 3 living.  
AI_REQUIREMENTS: PAIR sheet, then Wiper erases paint (late-seam / rim / wick) **or** Frosts if no paint. Skip if remaining cap < 1.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Echo Wipe if missing. Extra door vs ENC-WIPE-01.  
MAP_REQUIREMENTS: Arena + late-seam ribbon. `reinfCell` far lane. Distinct from ENC-REINF-11 (spell-sill tutor).  
SPECIAL_RULES: `holdPortalLocked` until all dead including the wiper. Skip the wiper if unplaceable. Wipe erases **paint**, not walls.  
OBJECTIVE: Clear start pack and the round-3 body.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Teach “the third body deletes the tax you were using as cover.” Prepares ENC-WIPE-01.  
SOLVABILITY_REQUIREMENTS: Reinf cell reachable; skip if occupancy fails; never spawn on portal.  
REPLAYABILITY: Wiper north vs east. High: replace wiper with `field_biter` if ENC-WIPE-01 already taught.  
SCALING_BEHAVIOUR: Do not add a fourth body. Tighten by paint amount, not HP.  
STATUS: PROPOSED

---

### ENC-HOME-01

ENCOUNTER_ID: ENC-HOME-01  
TYPE: movement objectives / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HOME-SILL` — 1× `home_stepper` queen (Home Step, no heal) + 1× `quiet_siller` rook (Quiet Sill, no heal). No Split Mend (that is `FSN-HOME-QUIET` on ENC-RARE-12 peak). No Hinge / Hook / Ally Reel.  
AI_REQUIREMENTS: Siller paints the melee tile the player wants, **not** both approaches. Home Steps only if a free adj **seals or rescues**, never onto the player’s last exit. Never turn-1 surround. Start ≥ 4 apart. Home Step is relocate, **not** `isSwap`. Landing hazards **must tick**.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Home Step / Quiet Sill if missing.  
MAP_REQUIREMENTS: Courtyard + two approach tiles to the siller. Quiet Sill: occupant cannot resolve Strike / `isPhysical`; spells stay legal; Attack Nearest from this cell must refuse.  
SPECIAL_RULES: Family lottery **off**. Elite: Siller only. Honesty: missing relocate dests → ENC-HINGE-01. Occupying the ring (the other adj) is the complete answer.  
OBJECTIVE: Defeat both. Intended: take the unpainted approach **or** spell off the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “they teleport onto a friend; the painted cell forbids melee.” Distinct from ENC-HINGE-01 (90° ally dest, both move).  
SOLVABILITY_REQUIREMENTS: A second adj remains free after Home lands; never both on the only exit.  
REPLAYABILITY: Sill west vs east. High: `FSN-HOME-QUIET` adds Split Mend — Home landing **onto** Quiet next to Split is the clump.  
SCALING_BEHAVIOUR: High: Quiet cadre. Peak: inherit dash plate on the unpainted approach. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-EXIT-01

ENCOUNTER_ID: ENC-EXIT-01  
TYPE: movement objectives / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-EXIT-PAIR` — 1× `exit_stinger` pawn/rook (Exit Sting) + 1× `pair_slider` queen/king (Pair Slide, no heal). Fuse off (`FSN-EXIT-PAIR/FUSE` is a later skin). Porter / Broker / Hinge stay off.  
AI_REQUIREMENTS: Exit paints a peel tile or the player’s feet. Slider Slides only if both dests are free **and** at least one landing is the sting **and** a walk-off **out of** the sting cell remains. Slider skips if < 2 player-side bodies **or** dest blocked; if the player brought no summon, Slider Frosts — still a pair. Never turn-1 slide onto lava. Never slide both bodies onto the only aisle. Gait Wick does **not** detonate on this slide. Shove Mend **does** arm if a Mender is added later.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Exit Sting / Pair Slide if missing. Extra door vs ENC-PEEL-01.  
MAP_REQUIREMENTS: Two occupancy dests painted. Exit cell is floor. Distinct from ENC-PEEL-01 (90° hinge + lone nail).  
SPECIAL_RULES: Family lottery **off**. Elite: Slider only. Honesty: missing pair occupancy dests → ENC-PEEL-01. Leave-hook is walk **or** force-move / Swap / Home Step off. Enter does not tick. Standing is 0.  
OBJECTIVE: Defeat both. Intended: stand (sting 0) **or** leave on your own terms before they translate you onto the paint.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “they paint leave, then shove the pair onto it.” Distinct from ENC-PEEL-01 and ENC-SLAM-01.  
SOLVABILITY_REQUIREMENTS: Walk-off out of the sting cell after slide; dests not lava / portal.  
REPLAYABILITY: Sting north vs south. High: `/FUSE` skin only if fuse occupancy exists and is publicly told.  
SCALING_BEHAVIOUR: High: add junior Shove Mend (choir) **or** Fuse skin, not both. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-FANG-01

ENCOUNTER_ID: ENC-FANG-01  
TYPE: priority-target battles / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FOE-FANG` — 1× `foe_reeler` bishop (Foe Reel, no heal) + 1× `split_fanger` knight/queen (Split Fang, no heal). No Wound Mark (that is ENC-RARE-12 `/WOUND`). No dummy. Ally / File / Hook / Sink stay off.  
AI_REQUIREMENTS: Fang holds at 3. Reel Reels only if the step lands into Fang range **and** a walk-off remains. If the player brought no summon, Reel Frosts and Fang is a 16 — intended soft CELL. Fang skips the +16 if no second hostile Chebyshev ≤ 1. Reel skips if isolated.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Foe Reel / Split Fang if missing. Extra door vs ENC-ALLY-01.  
MAP_REQUIREMENTS: Open court. Cluster pocket at Chebyshev 1 of Fang’s perch. Distinct from ENC-ALLY-01 (pull toward **ally**).  
SPECIAL_RULES: Family lottery **off**. Elite: Fang only. Honesty: missing attract-to-other-hostile → ENC-ALLY-01. Dummy can be an illegal cluster — not on this CELL. `FSN-FOE-FANG/PIT` only if open pit occupancy exists (else skip).  
OBJECTIVE: Defeat both. Intended: isolate (Fang is 16) **or** break the reel before the cluster poke.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Teach “they clump you toward another hostile, then cash the cluster.” Distinct from ENC-PRIO-13 (decoy king / body mark).  
SOLVABILITY_REQUIREMENTS: Walk-off after reel; never reel onto the only exit.  
REPLAYABILITY: Fang west vs east. High: `FSN-FOE-WOUND` (ENC-RARE-12) adds Wound Mark — DoT / lava do **not** detonate.  
SCALING_BEHAVIOUR: High: Wound cadre. Never two pull elites. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-WIPE-01

ENCOUNTER_ID: ENC-WIPE-01  
TYPE: hazard battles / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FIELD-WIPE` — 1× `echo_wiper` bishop (Echo Wipe) + 1× `field_biter` knight/bishop (Field Bite). Brick Shift off (`FSN-FIELD-WIPE/BRICK` is a later skin). Echo Paint / Ember / Fuse stay off.  
AI_REQUIREMENTS: Wiper skips if no paint (Frost). Biter skips if they hug a blocking tile (Strike). Wiper erases the cell the player stands on **or** the only Cinder path that is **not** the last exit. Biter waits for open floor. Never wipe the only safe tile that is also the only walk-off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Echo Wipe / Field Bite if missing. Extra door vs ENC-REINF-12.  
MAP_REQUIREMENTS: Open `chessboard` preferred (weight ×1.5); `corridorMaze` weight 0.5. Scripted late-seam **or** rim cinder as the paint (`inheritHazardsFrom: ENC-TEACH-12` **or** ENC-HAZ-23 — pick one). Barrier / wall / pit occupancy / span post count as blocking for Field Bite. Echo Wipe is **not** a block.  
SPECIAL_RULES: Family lottery **off**. Elite: Biter only. Honesty: missing paint-erase → ENC-HUG-01. If the map has no paint, Wiper Frosts forever — still a CELL of poke. Do not fake paint.  
OBJECTIVE: Defeat both. Intended: hug a real block so Bite is 10, **or** keep paint the wiper cannot afford to delete.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “they delete your cover, then cash open floor.” Inverse of ENC-HUG-01 (bonus if adj block).  
SOLVABILITY_REQUIREMENTS: Maps stay solvable (paint erase, not a wall punch). A blocking tile exists that is not the last exit.  
REPLAYABILITY: Seam paint vs rim paint. High: `/BRICK` only if `barrierTiles` slide exists (else ENC-DIAG-01 language).  
SCALING_BEHAVIOUR: High: Brick skin **or** inherit corner draft (ENC-DRAFT-01), not both. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-CHASE-01

ENCOUNTER_ID: ENC-CHASE-01  
TYPE: protection objectives / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BOOT-CHASE` — 1× `boot_lender` bishop (Boot Lend, no heal) + 1× `chase_mender` queen (Chase Mend + Shield) + 1× `spare_pacer` rook/pawn (Spare Pace, elite). Never a PAIR of Boot Lend + Spare Pace without Chase. Gait Mend / Shove Mend stay off vs Chase.  
AI_REQUIREMENTS: Lender Lends +1 current MP if the target has not spent walk MP; fizzle if they already walked. Spare funds +1 now. Chase mends 8 iff the **target** walked this turn (not the caster, not force-move). Forced-move does **not** pay Chase and does **not** block Boot Lend. Elite: Spare only.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Boot Lend / Chase Mend / Spare Pace if missing. Extra door vs ENC-PACE-01 / ENC-BOOT-01.  
MAP_REQUIREMENTS: Open court + 2-tile runway. Optional dash plate (ENC-HAZ-24) so the funded 2 MP **also** skips the plate.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing walk-spend **or** unmoved lend gate → ENC-PACE-01. Unlock after ENC-PACE-01 **and** ENC-BOOT-01.  
OBJECTIVE: Defeat all three. Intended: walk before they lend (fizzle) **or** pin the spare so the 2-step never funds.  
FAILURE_CONDITION: Player death. Optional: fail-protect if a scripted ally wisp is present and dies — **do not** add a wisp on first ship (cap and readability). First ship is kill-all.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Teach “they fund the walk, then cash the **target-walked** heal.” Distinct from ENC-PACE-01 (caster-walked Gait Mend + Spare).  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy leaves an aisle; runway not the only exit. Living hostiles well under cap.  
REPLAYABILITY: Spare west vs east. Peak: inherit late-seam on the runway.  
SCALING_BEHAVIOUR: Do not add a fourth body. Tighten by Spare elite tag, not HP.  
STATUS: PROPOSED

---

### ENC-KEEP-01

ENCOUNTER_ID: ENC-KEEP-01  
TYPE: elite encounter / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DRY-KEEP` — 1× `dry_stinger` (elite) + 1× `purse_keeper` king (Purse Keep, no heal, no Inferno) + 1× `act_teller` bishop. Leftover Lend / Lock / Empty Plate stay off.  
AI_REQUIREMENTS: As ENC-DRY-01 plus Keeper banks **their** leftover once/battle, pays at **next own turn start**, cap 3. Death discards the bank. Dry does **not** see 0 leftover while Keep is armed **this** turn. Keep snapshot is leftover **before** Late Purse / Pack Tithe burn. Not Timestep.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Purse Keep if missing. Extra door vs ENC-DRY-01.  
MAP_REQUIREMENTS: Fortress + gallery. No lava.  
SPECIAL_RULES: Family lottery **off**. Honesty: missing leftover gate → ENC-DRY-01 PAIR without Keep. Unlock after ENC-DRY-01.  
OBJECTIVE: Defeat all three. Intended: kill the Keeper before the bank pays **or** keep 1 leftover through Tax.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Add “they bank their leftover for a later 4-AP card” on top of the empty-bar gun. Distinct from ENC-FLUSH-01 (all-bar CD gift).  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy; gallery aisle.  
REPLAYABILITY: Keeper north vs east.  
SCALING_BEHAVIOUR: Do not add Inferno on the Keeper at BRIGADE. Never Empty Plate.  
STATUS: PROPOSED

---

### ENC-STRETCH-01

ENCOUNTER_ID: ENC-STRETCH-01  
TYPE: spell-discovery / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-STRETCH-MUTE` — 1× `cadence_stretcher` bishop (Cadence Stretch, optional leader) + 1× `last_muter` bishop (Last Mute) + 1× `ignite_alchemist` pawn (Ignite). Stall / Crack / Flush stay off vs Stretch. No Glass Realm. No Time Warp. One Inferno cadence (the **player’s**) being stretched is the identity — no second Inferno on the pack.  
AI_REQUIREMENTS: Stretch ×2 remaining Inferno / Fuse CD (cap 8, 0 stays 0). Mute bans the last resolved spell id. Ignite consumes stacks in the window. Missing `lastResolvedSpellId` → Muter Frosts forever (softer CADRE, still valid). Elite: Stretcher-leader only.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Cadence Stretch / Last Mute / Ignite if missing. Extra door vs ENC-CRACK-01 / ENC-FLUSH-01.  
MAP_REQUIREMENTS: Open court. No void rift. Optional tick-rat paint from ENC-TICK-01 on a gallery (DoT stacks for Ignite — not required).  
SPECIAL_RULES: Family lottery **off**. Honesty: missing last-id **or** remaining-CD writer → ENC-CRACK-01. Unlock after ENC-CRACK-01 **or** ENC-FLUSH-01. Sit on CD-0 ids. Once-per-battle flags are not CDs.  
OBJECTIVE: Defeat all three. Intended: recast a different id after Mute **or** never paint Inferno so Stretch is 0.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing`.  
TACTICAL_PURPOSE: Teach “they double your remaining Inferno, ban the last id, then cash stacks.” Distinct from ENC-CRACK-01 (hostile CD0 + recast lock) and ENC-FLUSH-01 (ally all-CD gift).  
SOLVABILITY_REQUIREMENTS: 3-unit occupancy; no Glass Realm.  
REPLAYABILITY: `/STALL` skin only if stall honesty exists.  
SCALING_BEHAVIOUR: Leader-boost is the escalation, not three elites. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HOLD-03

ENCOUNTER_ID: ENC-HOLD-03  
TYPE: movement objectives / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HOLD-VERSE` — 1× `hold_caster` rook (Cast Hold, leader) + 1× `first_verser` bishop (Verse First) + 1× `gait_sealer` pawn/bishop (Gait Seal). Optional fourth Far Hood **omitted** on first ship (cap and readability). Never PAIR Hold Caster with Hold Knight / Gait Seal / Root as a two-body sheet. Root stays off (Hold + Root is a full spell lockout). `FSN-HOLD-VERSE/QUAD` skipped while `ENEMY_SUMMON_CAP` is 2.  
AI_REQUIREMENTS: Spells illegal until walk (Cast Hold). Strike illegal until a spell (Verse First). Feet nailed (Gait Seal). Strike through Cast Hold is legal **until** Verse First lands. Walking clears Cast Hold **and** detonates nothing on this sheet (no Wick). Gates 9/10 off. `escapeRoute` (6) on: wounded Hold walks to the gallery, not through the player. `bottleneckControl` (8) only if a gallery exists. One elite: the Hold-leader.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Cast Hold / Verse First / Gait Seal if missing. Extra door vs ENC-HOLD-02.  
MAP_REQUIREMENTS: Fortress + gallery. Distinct from ENC-HOLD-02 (Strike illegal until walk; other ids legal).  
SPECIAL_RULES: Family lottery **off**. Honesty: missing dual hold flags → ENC-HOLD-02. Unlock after ENC-HOLD-02 **and** a leader-boost CADRE. Dungeon depth may not add a fifth hostile to this id. Teaching variant `FSN-HOLD-VERSE/LANE`: drop Verse — Cast Hold + Seal only, **only** if the player has already answered ENC-HOLD-02.  
OBJECTIVE: Defeat all three. Intended: walk (clear Cast Hold, eat Seal) then spell (clear Verse) then Strike — **or** kill Verse first and Strike through Hold.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Three-lock lesson: spells until walk, Strike until a spell, feet nailed. Distinct from ENC-HOLD-01 (banner contest) and ENC-VERSE-01 (pulpit).  
SOLVABILITY_REQUIREMENTS: Gallery walk exists that is not the portal; 3-unit occupancy leaves an aisle.  
REPLAYABILITY: `/CROWN` skin (leader already on) vs `/LANE` teaching cut.  
SCALING_BEHAVIOUR: Do not add Hood on first ship. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-KEY-01

ENCOUNTER_ID: ENC-KEY-01  
TYPE: map structures / movement objectives  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`, linear kit) + 1× pawn charger.  
AI_REQUIREMENTS: Bishop threads linear frost **through** the keystone (LoS open). Pawn body-blocks the knock-down cell. No lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning by shooting through the stone can later hint a linear id if missing (reminder, not a grant).  
MAP_REQUIREMENTS: One `WF-TER-LOOSE_KEYSTONE` on a corridor cell that is **not** a cut-vertex (blocks walk and occupancy, LoS open; adjacent 1 AP knocks it down to floor). Inverse of Frost Pane (walkable LoS block). Distinct from Crumble Pillar (blocks walk and LoS, 2 AP) and Raise Slab (floor into wall). Bypass path exists.  
SPECIAL_RULES: Scripted keystone only. 1 AP occupancy action. No damage. Does not count as a wall for LoS. Skip if `evaluateSolvability` would fail with it intact.  
OBJECTIVE: Clear all. Optional: knock the stone for the cell, or ignore it and take the bypass.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “this wall lets shots through; 1 AP buys the cell.” Prepares ENC-WIPE-01 / linear echo maps.  
SOLVABILITY_REQUIREMENTS: Must not be a cut-vertex; bypass flood-fills spawn→hostiles→exit.  
REPLAYABILITY: Keystone north corridor vs east.  
SCALING_BEHAVIOUR: Mid: bishop gains a second linear id. High: inherit late-seam on the bypass. Never two keystones that cut.  
STATUS: PROPOSED

---

### ENC-QUICK-01

ENCOUNTER_ID: ENC-QUICK-01  
TYPE: optional challenges / spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× bishop (`starter-frost`, `cooldown === 0`) + 1× pawn.  
AI_REQUIREMENTS: Bishop will step the brass if it is free and they have a 0-cooldown cast queued. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: None granted from the tile. Observe frost as usual.  
MAP_REQUIREMENTS: One `WF-ZON-QUICK_HAND` brass inlay (first unit to end a turn here this map banks one charge: their next spell this map with `cooldown === 0` costs 1 less AP, minimum 0; then the tile dries). Inverse of Slow Hand (ENC-COOL-01 sibling: 0-cooldown +1 AP). Distinct from Second Wind (refund 1 already-spent AP) and Cool Stone (cooldown skip).  
SPECIAL_RULES: Reads `SpellConfig.cooldown` and `apCost` only. One charge, this map. Attack Nearest is not a spell. Null Field does not strip it. Optional floor — map solvable if never used.  
OBJECTIVE: Clear all. Optional: plant on the brass before the bishop does.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. No extra from the brass (the discount **is** the reward). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “0-cooldown can go cheaper if you camp the inlay first.” Distinct from ENC-COOL-01 (skip a CD).  
SOLVABILITY_REQUIREMENTS: Brass walkable; never on spawn/portals.  
REPLAYABILITY: Brass mid vs flank. High: pair with ENC-COLD-01 so round 1 0-cooldown is locked **and** the brass waits for round 2.  
SCALING_BEHAVIOUR: Do not add a second brass. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-INIT-01

ENCOUNTER_ID: ENC-INIT-01  
TYPE: movement objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× wounded-looking `plague_rat` pawn (starts at 40% HP, poison kit) + 1× full-HP bishop (`starter-frost`) + 1× pawn charger.  
AI_REQUIREMENTS: Rat kites to stay the lowest HP%. Bishop kites. Charger greedy. No kamikaze.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-TEL-INIT_SWAP` cyan wound-anchor (entering it for 1 MP swaps you with the living unit that currently has the lowest HP percent; ties break by live initiative; if no other living unit exists, the MP is spent and you stay). Distinct from Swap Anchor (nearest) and Far Swap (ENC-MOVE-20, farthest).  
SPECIAL_RULES: 1 MP from the unit’s current MP. Not a teleport spell — do not key off `effectCategory`. Honesty: missing lowest-HP% scan → ENC-MOVE-20.  
OBJECTIVE: Clear all. Optional: spend 1 MP to yank the wounded rat into melee.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “this pad trades you with the **most wounded** body.” Distinct from ENC-MOVE-20 (farthest living).  
SOLVABILITY_REQUIREMENTS: Map solvable without the pad; pad not on spawn/portals.  
REPLAYABILITY: Pad west vs east. High: inherit late-seam on the pad so the 1 MP step cannot be a second seam hop.  
SCALING_BEHAVIOUR: Do not add a second pad. Peak: rat starts at 60% so a player on 50% **is** the yank target — still no HP sponge.  
STATUS: PROPOSED

---

### ENC-MOVE-22

ENCOUNTER_ID: ENC-MOVE-22  
TYPE: movement objectives / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-HOME-SILL` **or** the ENC-INIT-01 trio if Home honesty is missing.  
AI_REQUIREMENTS: As ENC-HOME-01 **or** ENC-INIT-01.  
SPELL_DISCOVERY_OPPORTUNITIES: Home Step if the SILL pack is used.  
MAP_REQUIREMENTS: Init Swap pad **plus** Quiet Sill paint on a **different** cell. Never both on the same tile.  
SPECIAL_RULES: Combine lowest-HP% swap with a melee-forbid tile so yanking the wounded body onto the sill wastes Strike. Honesty: missing either verb → ship the working one as ENC-INIT-01 or ENC-HOME-01.  
OBJECTIVE: Clear all. Intended: yank onto open floor, not onto the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine two relocate verbs without making either a lock.  
SOLVABILITY_REQUIREMENTS: Pad and sill both optional for solvability; hostiles reachable by walking.  
REPLAYABILITY: Pad/sill swap sides.  
SCALING_BEHAVIOUR: High: Home Steps after a yank (landing tax ticks). Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-MOVE-23

ENCOUNTER_ID: ENC-MOVE-23  
TYPE: movement objectives  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop behind a short-path wall + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop kites once the sill opens. Pawn guards the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-OBS-STRIDE_SILL` short-path corridor cell starts as a wall. After the player spends 1 or more MP this map, it becomes floor for the rest of the map. Attack Nearest, spells, and summons do not unlatch it. Distinct from Spell Sill (ENC-MOVE-21, cast), Coin Sill (1 AP), Tithe Sill (HP), and Latch Sill (camp adjacent). Place only when a second spawn→portal route already exists.  
SPECIAL_RULES: Honesty: missing walk-MP latch → ENC-MOVE-21. Never the only exit.  
OBJECTIVE: Clear all. Optional: take one step to open the short path.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “walking unlatches the short corridor; Attack Nearest does not.” Distinct from ENC-MOVE-21 (spell unlatch).  
SOLVABILITY_REQUIREMENTS: Long path already spawn→portal; sill never the only exit.  
REPLAYABILITY: Sill north vs east. High: inherit dash plate on the short path so the unlatch step wants 2 MP.  
SCALING_BEHAVIOUR: Do not add a second sill. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-23

ENCOUNTER_ID: ENC-SURV-23  
TYPE: survival / hazard battles  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`). No elites until high band.  
AI_REQUIREMENTS: Pawns may camp corners (pay the draft). Bishop kites on 0–1-wall hatch cells. Wounded AI treats corner cells like lava.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Arena with hatched 0–1-wall shelter cells. `WF-ENV-CORNER_DRAFT` armed (end of each combatant turn, if adjacent to two or more walls, pay 3% max HP). Distinct from Ash Rain (tax unless wall-adjacent) and Cramped Stone (tax if adjacent to any one wall). Optional rim cinder on the outer ring (`inheritHazardsFrom: ENC-HAZ-23`) so the interior hatch is the only free stand. Skip if the map has no floor cell adjacent to fewer than 2 walls.  
SPECIAL_RULES: End-of-turn challenge HP. Summons pay it. Orthogonal wall adjacency only. No skipped turns. `holdPortalLocked` until hostiles dead **or** 8 rounds elapsed with the player still alive (survival clock) — if the clock is used, keep one pawn as the lock **or** set `holdPortalLocked` explicitly. First ship: kill-all, clock is optional overlay flavour not a second failure.  
OBJECTIVE: Clear all while ending turns on hatched cells. Optional: shove a foe into an alcove.  
FAILURE_CONDITION: Player death (draft + frost). Do not fail the room for taking draft tax.  
REWARD: Standard. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Teach “corners draft; the open edge is shelter.” Distinct from ENC-SURV-21 (shared-file tax) and ENC-SURV-06 (ash-rain).  
SOLVABILITY_REQUIREMENTS: Shelter cells exist; draft is not a wall; rim (if inherited) never covers spawn/portal.  
REPLAYABILITY: Draft-only vs draft+rim.  
SCALING_BEHAVIOUR: High: inherit late-seam on hatch cells so shelter still has a hop tax. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-24

ENCOUNTER_ID: ENC-SURV-24  
TYPE: survival / elite encounters  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-WOUNDED_FILE` — two extra same-tier elites (hard threat) on a painted 2-tile file. They do not wander. Out of battle, the elite closer to the player loses 5% max HP each wander tick and the farther one heals 5% (cannot exceed max). Touching either starts a normal battle with both at remaining HP. Dungeon / boss rush: they count as hostiles for map-clear.  
AI_REQUIREMENTS: File elites use Dry **or** Hood kits (one each). No wander in battle.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe the elite kits if missing.  
MAP_REQUIREMENTS: Painted 2-tile file. Exit reachable without touching either. Counts as 2 toward `MAX_ENEMIES`. Exploration: leave without touching.  
SPECIAL_RULES: World attrition does not call `applyRewards`. Contact is a normal battle. Extra spells from `usableByEnemy` only. Victory pays hard if both still stood, medium if one already vanished. Honesty: missing world attrition → ENC-PROT-12 low picket without claiming the file bleed.  
OBJECTIVE: In a run: clear both. Exploration: wait until one is low, join, or never enter.  
FAILURE_CONDITION: Player death. Leaving the file in exploration is legal.  
REWARD: Hard or medium `applyRewards` as the feature sheet. Overlay `under_10_turns` in a run.  
TACTICAL_PURPOSE: Teach “two posts bleed toward you; the farther one heals.” Distinct from ENC-DUEL-01 (rage-on-death) and ENC-CAMP-01.  
SOLVABILITY_REQUIREMENTS: File is floor; exit without touching; skip if roster cannot fit 2.  
REPLAYABILITY: Dry+Hood vs Tick+Bash skins.  
SCALING_BEHAVIOUR: Do not add a third file body. Threat multiplier, not level.  
STATUS: PROPOSED

---

### ENC-ELITE-22

ENCOUNTER_ID: ENC-ELITE-22  
TYPE: elite encounters / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SHOVE-CHOIR` — 1× `bash_bruiser` (elite) + 1× `pair_slider` (no heal) + 1× `shove_mender`. Two queens, two jobs. Hook / Swap stay off.  
AI_REQUIREMENTS: Bash **or** Slide can arm Shove Mend. Do not bash **and** slide the same body on the same round (unreadable double displace). Dest banned from lava / void. Prefer landing that **is** a force-move if a walk-off remains.  
SPELL_DISCOVERY_OPPORTUNITIES: Finish incomplete Bash / Slide / Mend observe.  
MAP_REQUIREMENTS: Court + side wall + two slide dests. Inherit late-seam on a gallery.  
SPECIAL_RULES: Lottery **off**. Unlock after ENC-BASH-01. Honesty: missing force-move → ENC-BASH-01 PAIR.  
OBJECTIVE: Defeat all three.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-band `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove displace-then-heal when **two** force-moves exist. Distinct from ENC-ELITE-20 (gait pace).  
SOLVABILITY_REQUIREMENTS: Walk-off after bash and after slide; 3-unit occupancy.  
REPLAYABILITY: Choir west vs east.  
SCALING_BEHAVIOUR: Bruiser elite tag only. Never two displacement elites.  
STATUS: PROPOSED

---

### ENC-ELITE-23

ENCOUNTER_ID: ENC-ELITE-23  
TYPE: elite encounters / mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WICK-SPAN` **or** `FSN-DRY-KEEP` by `branch` (`hood` → Span, `dry` → Keep, `bash`/`tick` default Span). Span: Wicker + Must Spanner + Hooder (elite Hooder). Keep: as ENC-KEEP-01.  
AI_REQUIREMENTS: Must Span: remaining walks this turn must be Manhattan exactly 2. 1-step and 3-step illegal. 0 walk legal. Knight 2-1 jumps are **not** walks. Forced-move any length is legal (does not detonate Wick, does not pay Must Span). Wick detonates on that forced 2-step. Hood zeros the shot from 4 if they refuse to close.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Must Span if missing. Extra door vs ENC-HOOD-01 / ENC-SPAN-01.  
MAP_REQUIREMENTS: A painted 2-step chevron toward the Hooder. Distinct from ENC-SPAN-01 (two-cell **plug**, not a walk length).  
SPECIAL_RULES: Lottery **off**. Honesty: missing walk-MP **or** Manhattan-2 filter → ENC-HOOD-01. Unlock after ENC-HOOD-01. `/ODD` rebate skin only if odd-round honesty exists.  
OBJECTIVE: Defeat all three. Intended: stand (Span legal, Wick 0, Hood eats 4) **or** take exactly 2.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-band `applyRewards`. Overlay `no_healing`.  
TACTICAL_PURPOSE: Force the Hood close to be a **2-step**, not any close. Distinct from ENC-SPAN-01 and ENC-HOLD-03.  
SOLVABILITY_REQUIREMENTS: A Manhattan-2 path exists that is not the portal; 3-unit occupancy.  
REPLAYABILITY: Span vs Keep branch skin.  
SCALING_BEHAVIOUR: Hooder elite only. Never Fuse.  
STATUS: PROPOSED

---

### ENC-PROT-12

ENCOUNTER_ID: ENC-PROT-12  
TYPE: protection objectives  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `shove_mender` (the protected body — junior Shield/Mend) + 2× pawn chargers that try to **not** kill her (they peel the player). Optional Low Picket elite if HP < 70% (ENC-AMBUSH-12). No dual-boss.  
AI_REQUIREMENTS: Mender kites to stay alive. Pawns greedy on the player. If the mender dies, remaining hostiles enrage **without** betrayal (logged shout only). Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Shove Mend if missing.  
MAP_REQUIREMENTS: Courtyard. Mender starts Chebyshev ≥ 4 from spawn. Optional wounded-file chrome (ENC-SURV-24) **off** this room — pick one protection fantasy.  
SPECIAL_RULES: First ship **does not** fail the room if the mender dies (still a kill-all). Optional overlay `direct_hit` rewards ignoring the pawns. A later implementer may add `failureKind: ally_down` only with an explicit ally id — not inferred from the name “mender.” Honesty: missing force-move mend → Shield queen to protect (still readable).  
OBJECTIVE: Defeat all. Intended: peel the mender first **or** ignore her and eat the 8 after a bash from a later insert.  
FAILURE_CONDITION: Player death. Ally-down is **not** a hard fail on first ship.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Priority on a heal body that only cashes after a displace — different from ENC-PROT-11 (kin plate).  
SOLVABILITY_REQUIREMENTS: All three reachable; mender not on the portal.  
REPLAYABILITY: Mender north vs east.  
SCALING_BEHAVIOUR: High: add Bruiser (ENC-BASH-01) so the 8 can actually land. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-PRIO-14

ENCOUNTER_ID: ENC-PRIO-14  
TYPE: priority-target battles  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FOE-FANG` plus a junior Frost bishop decoy (`decoyId`) that is **not** the cluster partner. Real cluster partner is the Fang (`realId`). Distinct from ENC-PRIO-13 (body-mark decoy king) and ENC-PRIO-04 (decoy king).  
AI_REQUIREMENTS: Reel prefers clustering the player toward Fang, never toward the decoy. Decoy Frosts and flees. Fang skips +16 if the only Chebyshev-1 hostile is the decoy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Split Fang if missing.  
MAP_REQUIREMENTS: Three-body court. Decoy starts closer to the player than Fang.  
SPECIAL_RULES: `decoyId` / `realId` explicit. Do not infer from display names. Honesty: missing Foe Reel → ENC-FANG-01 without decoy. Living hostiles ≤ 3.  
OBJECTIVE: Defeat all. Intended: ignore the decoy, break Fang, isolate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Priority exam: the close bishop is bait; the cluster gun is the real.  
SOLVABILITY_REQUIREMENTS: All reachable; decoy not on the portal.  
REPLAYABILITY: Decoy west vs east. Peak: Wound Mark on Fang (ENC-RARE-12) — still one exam.  
SCALING_BEHAVIOUR: Do not add a fourth body. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-DRAFT-01

ENCOUNTER_ID: ENC-DRAFT-01  
TYPE: hazard battles  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× pawn + 1× bishop. Same as ENC-SURV-23 opener without the survival clock language.  
AI_REQUIREMENTS: Bishop holds hatch cells. Pawns may pay corners.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-ENV-CORNER_DRAFT` only. No rim unless inherited at high.  
SPECIAL_RULES: Teach-adjacent version of ENC-SURV-23 for chains that already know late-seam. Overlay `under_50_damage`.  
OBJECTIVE: Clear all from hatch cells.  
FAILURE_CONDITION: Player death.  
REWARD: Standard.  
TACTICAL_PURPOSE: Isolate the draft verb so ENC-SURV-23 can add rim.  
SOLVABILITY_REQUIREMENTS: Shelter exists.  
REPLAYABILITY: Arena vs gallery alcoves.  
SCALING_BEHAVIOUR: High: become ENC-SURV-23 (add rim).  
STATUS: PROPOSED

---

### ENC-COLD-01

ENCOUNTER_ID: ENC-COLD-01  
TYPE: optional challenges / spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop with a `cooldown > 0` kit (`spell-slow` or Frost if unread) + 1× pawn + optional Quick Hand brass (ENC-QUICK-01).  
AI_REQUIREMENTS: Bishop opens with the cooldown spell on round 1. Pawn melee.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe the cooldown id if missing.  
MAP_REQUIREMENTS: `WF-MOD-COLD_OPEN` armed (spells with `cooldown === 0` cannot be cast on round 1; cooldown > 0 unchanged). Inverse of Short Fuse (cooldown spells locked round 1). Distinct from ENC-FLUSH-01 (gift CD0).  
SPECIAL_RULES: Reads `SpellConfig.cooldown` only. Attack Nearest and summons are not spells. Round 2+ uses the normal cooldown clock. Honesty: missing round-1 0-CD lock → still a valid Frost/melee room without claiming Cold Open.  
OBJECTIVE: Clear all. Intended: open with cooldown spells or melee, wait a round for 0-CD kit.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “cantrips sleep round 1; prepared spells do not.” Distinct from ENC-QUICK-01 (cheapen 0-CD later).  
SOLVABILITY_REQUIREMENTS: Melee, Attack Nearest, summons, and cooldown kits remain usable. No tile change.  
REPLAYABILITY: With vs without brass.  
SCALING_BEHAVIOUR: High: pair Quick Hand so round 2’s first 0-CD is discounted. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-TREAS-12

ENCOUNTER_ID: ENC-TREAS-12  
TYPE: treasure/risk rooms  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: None required. Optional 1× pawn guardian if the chest is opened **before** round 3 (failed open does **not** spawn — AP spent only).  
AI_REQUIREMENTS: Guardian greedy if present.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-TRS-LATE_CACHE` visible chest with three round pips. 1 AP adjacent opens it only on round 3 or later: a medium `applyRewards` grant and no guardian. Before round 3 the AP is spent and the chest stays closed. Out of battle, two wander ticks count as reaching “round 3.” Distinct from Patience Cache (open now for soft, or wait for a coin flip), Full Cache (ENC-TREAS-11), and Trip Cache (0 MP this turn).  
SPECIAL_RULES: AP cost, not a spell. Credits via persist-lock `applyRewards`. Failed open spends AP only. No `updateCharacter` Doka. Optional. `doka_fever` stays **opt-in** on a second device, never default.  
OBJECTIVE: Wait then open, spend AP too early and fail, or walk past.  
FAILURE_CONDITION: Player death only if a later guardian is rolled (high band). Leaving is always legal.  
REWARD: Medium `applyRewards` on successful open. Overlay none (the wait *is* the challenge).  
TACTICAL_PURPOSE: Teach “this purse wants two rounds of patience.” Distinct from ENC-TREAS-11 (full cache / cool / clean).  
SOLVABILITY_REQUIREMENTS: Adjacent-open, not a wall. Map solvable if never used.  
REPLAYABILITY: Chest west vs east. High: pawn guardian after a failed open **once**.  
SCALING_BEHAVIOUR: Do not raise the grant into clamp range. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPARE-01

ENCOUNTER_ID: ENC-SPARE-01  
TYPE: optional challenges / rest choices  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DRY-TAX` **or** 2× pawn if Dry honesty is missing.  
AI_REQUIREMENTS: As ENC-DRY-01.  
SPELL_DISCOVERY_OPPORTUNITIES: None extra.  
MAP_REQUIREMENTS: One `WF-RSK-SPARE_OATH` brass-slate inlay. End a turn on it to flag this map. If the next `applyRewards` happens after a player turn that ended with at least 1 AP remaining, that credit uses the hard multiplier. If the last player turn before credit spent their last AP, the flag pays nothing extra. Distinct from Stillness Oath (no MP), Steel Hour (never cast a paid-AP spell), Kindled Hour (must cast a paid-AP spell), and ENC-OATH-01 / ENC-OATH-02.  
SPECIAL_RULES: Reads remaining AP on the last completed player turn. Attack Nearest spends AP and can break it. Multiplier on the next `applyRewards` enqueue only. Death still uses `saveBattleStats`. Optional. Pairing with ENC-DRY-01 is intentional: Dry wants leftover **0**, Spare wants leftover **≥ 1** — the room is the contradiction.  
OBJECTIVE: Flag a fight you can win with AP left over, or stay unflagged and dump your hand (and starve Dry).  
FAILURE_CONDITION: Player death. Unflagged leave is legal.  
REWARD: Hard multiplier on the next credit if the oath holds; else standard. Overlay none.  
TACTICAL_PURPOSE: Optional wager that **fights** the Dry verb. Distinct from ENC-MELEE-01 / ENC-CLEAN-01.  
SOLVABILITY_REQUIREMENTS: Optional floor tile.  
REPLAYABILITY: With Dry pack vs pawn opener.  
SCALING_BEHAVIOUR: Do not add Keep (ENC-KEEP-01) on the same map — three leftover questions is unreadable.  
STATUS: PROPOSED

---

### ENC-VACANT-01

ENCOUNTER_ID: ENC-VACANT-01  
TYPE: optional challenges  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× pawn + 1× bishop. No enemy summoner.  
AI_REQUIREMENTS: Greedy / kite. No `isSummoner`.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-EVT-VACANT_HOUR` corona (if the player never spawned a living allied summon this map, the next `applyRewards` uses the hard multiplier; if any allied summon existed even if it later died, credit is unchanged). Inverse of Bond Oath (requires a living summon at credit). Distinct from Solo Oath (ENC-SOLO-01: flag; checks summons still alive at credit).  
SPECIAL_RULES: Keys off whether a player-side summon unit was created this map. Multipliers on persist-lock `applyRewards` only. Does not rewrite `combatMath`. Death still uses `saveBattleStats`.  
OBJECTIVE: Skip summons for a hard purse, or summon and accept normal rewards.  
FAILURE_CONDITION: Player death. Leaving is always legal.  
REWARD: Hard or standard as the feature. Overlay none.  
TACTICAL_PURPOSE: Optional no-pet wager without ENC-SOLO-01’s “still alive at credit” check. Distinct from ENC-SOLO-01.  
SOLVABILITY_REQUIREMENTS: No blocks.  
REPLAYABILITY: With vs without a starter summon already owned.  
SCALING_BEHAVIOUR: Do not add an enemy summoner (that forces a pet). Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-MARK-01

ENCOUNTER_ID: ENC-MARK-01  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: One same-tier `WF-SPL-MARK_TUTOR` enemy (medium threat) with 1 extra `usableByEnemy` spell (prefer Far Hood **or** Dry Sting **or** Tick Plate — one, metadata only) + 1× pawn charger.  
AI_REQUIREMENTS: Tutor kites to break LoS after being marked. Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Adjacent 1 AP marks them. Until they die or you lose LoS, you may spend that spell’s AP/MP to cast it **once** (one total, not per round). Killing them grants the purse but does not add a second copy. Distinct from Loaner Mage (instant one-shot, no mark/LoS), Live Tutor (ENC-TUTOR-01, once per round while they live), and Grimoire Stalker (one-cast on death). Mark and the one-cast do **not** call `upgradeSpell` and do not persist `spellLevel*` arrays. Winning the room can still observe the id through the normal pipeline if they cast it.  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
SPECIAL_RULES: Metadata only (`usableByEnemy`, `targetType`, costs, cooldown). Honesty: missing mark/LoS one-shot → ENC-TUTOR-01.  
OBJECTIVE: Spend 1 AP to mark a one-shot you must keep in LoS, kill them for the purse, or ignore them.  
FAILURE_CONDITION: Player death.  
REWARD: Medium purse via `applyRewards` on kill. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “borrow once while you hold LoS; the corpse is not a second copy.” Distinct from ENC-TUTOR-01.  
SOLVABILITY_REQUIREMENTS: Tutor reachable; not on portal.  
REPLAYABILITY: Hood vs Dry vs Plate loaner.  
SCALING_BEHAVIOUR: Do not add a second tutor. Never persist the loaned id from the tile.  
STATUS: PROPOSED

---

### ENC-RARE-12

ENCOUNTER_ID: ENC-RARE-12  
TYPE: rare elite rooms  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-HOLD-VERSE` **or** `FSN-FOE-WOUND` **or** `FSN-HOME-QUIET` by insert table (8% on depth 4, only if the matching combine already exists this account). Wound: Reel + Wound Marker + Fang-leader. Quiet: Home + Quiet + Split Cantor. Hold: as ENC-HOLD-03. `FSN-HOLD-VERSE/QUAD` skipped. Cap 4 living.  
AI_REQUIREMENTS: Matching COURT/CADRE sheet. Gates 9/10 off. Wound: DoT / lava do **not** detonate; follow-up must be a damaging **hit**. Quiet: Split 6/6 if Home is adj after the step; no dummy.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Wound Mark / Split Mend / Verse First if missing.  
MAP_REQUIREMENTS: Fortress + gallery. One inherited primer tax max.  
SPECIAL_RULES: Insert; do not replace a beat. Lottery **off**. Honesty rerolls to the matching combine (ENC-HOLD-03 / ENC-FANG-01 / ENC-HOME-01).  
OBJECTIVE: Defeat the rare pack.  
FAILURE_CONDITION: Player death.  
REWARD: Rare-band `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Peak exam of three-lock, cluster+mark, or relocate+sill+split. Distinct from ENC-RARE-11 (peel court).  
SOLVABILITY_REQUIREMENTS: As the underlying sheet; skip unplaceable inserts.  
REPLAYABILITY: Three skins. Peak: `/KENNEL` Wound only if Twin Guard exists.  
SCALING_BEHAVIOUR: One elite only. Never a fifth hostile on Hold.  
STATUS: PROPOSED

---

### ENC-REST-12

ENCOUNTER_ID: ENC-REST-12  
TYPE: rest choices  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None (rest map). Optional 1× pawn if a shrine contest is rolled — skip if the player is already in Death Realm.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine may remind (not grant) Shove Mend / Dry Sting / Gait Wick / Far Hood if observed this chain but not yet owned.  
MAP_REQUIREMENTS: Rest template. White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`). Three exits: `normal` / `dungeon` / `boss`. Optional Late Cache (ENC-TREAS-12) **or** Spare Oath (ENC-SPARE-01) **or** Vacant Hour (ENC-VACANT-01) **or** Quick Hand (ENC-QUICK-01) — pick **one**. Snapshot dungeon-chain refs **before** `cleanupMap`.  
SPECIAL_RULES: Rest-exit must re-arm depth 1 on the refs (`shouldArmDungeonChainOnRestExit`). `WF-PRT-STILL_GATE` rest/overworld only. No Latch / Wager / Pact / Twilight / Ash / Wane / Hearth / Clean / Still in dungeon-chain rooms.  
OBJECTIVE: Choose an exit. Optional: take the one device.  
FAILURE_CONDITION: Player death only if a contest pawn is rolled and wins. Leaving is always legal.  
REWARD: None for walking out. Device rewards via `applyRewards` only.  
TACTICAL_PURPOSE: Heal vs risk vs branch. Distinct from ENC-REST-11 (cool / full / clean).  
SOLVABILITY_REQUIREMENTS: Spawn, shrine, and all three portals flood-fill reachable. White portal at spawn, never `(0, 0)` unless spawn is `(0, 0)`.  
REPLAYABILITY: Device coin-flip Late / Spare / Vacant / Quick.  
SCALING_BEHAVIOUR: Do not add enemies as a rest scaler.  
STATUS: PROPOSED

---

### ENC-BRANCH-12

ENCOUNTER_ID: ENC-BRANCH-12  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 2× pawn. Destination packs are **not** spawned here.  
AI_REQUIREMENTS: Greedy pawns.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Four-way foyer. Doors tagged `branch: bash | dry | hood | tick`. Snapshot `branch` **before** `cleanupMap`. Each door is a locked portal until foyer hostiles are dead, then unlocks.  
SPECIAL_RULES: `branchFlag` is explicit metadata. Do not infer from door art names. Destinations: bash → ENC-BASH-01 / ENC-ELITE-22 / ENC-BOSS-12 (`bone_cavalier`); dry → ENC-DRY-01 / ENC-KEEP-01 / ENC-BOSS-12 (`pale_archivist`); hood → ENC-HOOD-01 / ENC-ELITE-23 / ENC-BOSS-12 (`midnight_bishop`); tick → ENC-TICK-01 / ENC-STRETCH-01 / ENC-BOSS-12 (`fetid_rook`).  
OBJECTIVE: Clear foyer, pick a door.  
FAILURE_CONDITION: Player death.  
REWARD: Standard foyer XP. Destination rewards on those rooms. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Account-level identity for the primer. Distinct from ENC-BRANCH-11 (pace/nail/flush/morrow).  
SOLVABILITY_REQUIREMENTS: All four doors reachable after foyer clear. Never spawn on an unlocked portal.  
REPLAYABILITY: Door order shuffle. Already-cleared branch can hide that door.  
SCALING_BEHAVIOUR: Do not add a fifth door. High: foyer pawns become Frost bishops.  
STATUS: PROPOSED

---

### ENC-MINI-13

ENCOUNTER_ID: ENC-MINI-13  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: One live `BossId` by `branch`: bash → `bone_cavalier` (charge / displace); dry → `pale_archivist` (tempo / leftover); hood → `midnight_bishop` (range / hood-like kite); tick → `fetid_rook` (DoT court). Plus 1× pawn choir. No dual-boss. Do **not** spawn `infirm_chanter` / `yoke_subchanter` / `salve_wicker` / `brand_curate`.  
AI_REQUIREMENTS: Named `BossAbility` scripts only. Pack modules must not ignore walls (Cavalier jump stays tagged). Choir greedy. Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Boss kit observe → grant if missing, same pipeline.  
MAP_REQUIREMENTS: Boss arena. Preferred cells + choir cell reachable. Optional inherit from the branch (late-seam / rim / dash / draft) — one tax max.  
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

### ENC-BOSS-12

ENCOUNTER_ID: ENC-BOSS-12  
TYPE: mini-boss / boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag as ENC-MINI-13. If the chain taught decoy (ENC-PRIO-04) **and** tick was not taken, mixed accounts may use `final_pawn` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** spawn Table J ids here.  
AI_REQUIREMENTS: Named boss abilities + kit legality (AI-SYS-16). Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Boss kit observe.  
MAP_REQUIREMENTS: Depth-max arena. One inherited tax from the primer (late-seam **or** rim **or** dash **or** corner draft — pick one). Never `titans_vigor`.  
SPECIAL_RULES: Capstone. Snapshot branch before cleanup.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Depth-5 `applyRewards` (multiplier 4). Overlay `no_healing`.  
TACTICAL_PURPOSE: Mastery exam: displace-heal / empty-bar poke / wick-vs-hood / stacked-DoT plate.  
SOLVABILITY_REQUIREMENTS: Spawn, boss, exit reachable. Hazard overlay after finalize.  
REPLAYABILITY: Branch skins.  
SCALING_BEHAVIOUR: Inherit a second role (Slider / Keeper / Spanner / Ignite) as choir, not HP.  
STATUS: PROPOSED

---

### ENC-MAST-12

ENCOUNTER_ID: ENC-MAST-12  
TYPE: waves / mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn; late-seam live. Wave 2: `FSN-SHOVE-BASH` **or** `FSN-DRY-TAX` **or** `FSN-WICK-HOOD` **or** `FSN-TICK-RAT` by `branch`. Wave 3: elite leftover (E-BASH **or** E-DRY **or** E-HOOD **or** E-PLATE) + leftover. Never more than 4 living.  
AI_REQUIREMENTS: Full gates except 9/10. Honesty rerolls apply per pack.  
SPELL_DISCOVERY_OPPORTUNITIES: Finish any incomplete observe from the chain.  
MAP_REQUIREMENTS: Fortress + aisle. Seam on the aisle. `waveSpawnCells` far lane.  
SPECIAL_RULES: Portal locked until wave 3 clear. Skip unplaceable waves. Lottery **off**.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery-band `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Prove displace-heal, empty-bar poke, wick-vs-hood, or tick-plate.  
SOLVABILITY_REQUIREMENTS: As ENC-WAVE-13 plus seam gallery.  
REPLAYABILITY: Branch skin. Peak: wave 2 is `FSN-HOLD-VERSE` only if ENC-RARE-12 already inserted this account (still cap 4 — drop Hood).  
SCALING_BEHAVIOUR: Wave 2 pack, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-43

ENCOUNTER_ID: ENC-RUSH-43  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table J `J0` — `infirm_chanter` + `levy_rector`. Infirmary and Tithe-box are both objects.  
AI_REQUIREMENTS: Named Wave-12 boss scripts. Tithe-box **never** occupies the Infirmary. Levy’s tax is not a walk reject. Infirmary break does **not** clear Hex Toll. Player Gait Mend cannot siphon from the foe’s walk. Gates 9/10 off. Living hostiles well under `MAX_ENEMIES`.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Gait Mend / Hex Toll if missing.  
MAP_REQUIREMENTS: Rush arena. Tithe-box never on the Infirmary. Preferred cells reachable. Do not rewrite `BOSS_RUSH_ROOMS` 0–9 or Tables B–I.  
SPECIAL_RULES: Unlock after one complete Table I clear (`I0`–`I3`). New `roomIndex` namespace `J0`. Hold this variant if infirmary / tithe objects are missing. Not Sole / March / Stride / Hex / Font / Lock / Bias / Lament. Dual-boss Rush only.  
OBJECTIVE: Defeat both bosses. Intended: walk to pay the hymn, then the **next spell is taxed**.  
FAILURE_CONDITION: Player death. `completeBossRushRoom` still ignores client `dokaReward`/`xpReward`.  
REWARD: Rush persist via existing room-clear funnel; credits through `applyRewards` only after `currentRoom` actually advanced.  
TACTICAL_PURPOSE: Add the walk-then-tax readability the Bash / Dry primer taught in ENC-CHASE-01 / ENC-DRY-01, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + objects reachable. Tithe-box never occupies the Infirmary.  
REPLAYABILITY: First Table J clear vs later skins (choir pawn vs warden).  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-44

ENCOUNTER_ID: ENC-RUSH-44  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table J `J1` — `yoke_subchanter` + `veil_verger`. Pair dests and Cowl are both objects.  
AI_REQUIREMENTS: Pair dests **never** occupy the Cowl. Veil reject spends 0 AP. Occupancy dests, not `swapPositions`. Player Pair Hinge cannot mass-hinge. Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Pair Hinge / Veil if missing.  
MAP_REQUIREMENTS: Rush arena. Dests never on the Cowl.  
SPECIAL_RULES: `J1` after J0. Hold if pair-occupancy dests / veil objects missing. Not Hinge / Orbit / Counter / Cover / Goad / Bait / Grandmaster / Morrow / Hook / Dowager / Mill / Ram / Cord.  
OBJECTIVE: Defeat both. Intended: they rotate, then the primary you wanted is **veiled**.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-43.  
TACTICAL_PURPOSE: Add the pair-translate vs hidden-primary exam ENC-EXIT-01 / ENC-HOME-01 taught.  
SOLVABILITY_REQUIREMENTS: Legal dests exist that are not the Cowl; walk-off remains.  
REPLAYABILITY: Rotate clockwise vs counter.  
SCALING_BEHAVIOUR: Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-45

ENCOUNTER_ID: ENC-RUSH-45  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table J `J2` — `salve_wicker` + `bait_vicar`. Salve pad and bait intercept are both objects. Sentinel + Wisp share cap 4.  
AI_REQUIREMENTS: Bait intercept **never** occupies the pad. Pad tick is heal, not damage. Player Mend Wick is one cell, delay 2, radius 0. Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Mend Wick / Bait if missing. Extra door vs ENC-WICK-03.  
MAP_REQUIREMENTS: Rush arena. Intercept never on the pad.  
SPECIAL_RULES: `J2` after J1. Hold if delayed-heal pad / bait intercept missing. Not Goad / Font / Wick / Crypt / Infirm / Lament.  
OBJECTIVE: Defeat both. Intended: enter the salve pad; the pylon **intercepts the path**.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-43.  
TACTICAL_PURPOSE: Add delayed-heal vs path-intercept after ENC-HOOD-01 / ENC-CHASE-01, without a third boss.  
SOLVABILITY_REQUIREMENTS: Pad reachable; intercept not the only aisle.  
REPLAYABILITY: Pad west vs east.  
SCALING_BEHAVIOUR: Sentinel + Wisp already in cap 4. Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-46

ENCOUNTER_ID: ENC-RUSH-46  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table J `J3` — `brand_curate` + `oath_dean`. Stylus and Oath telegraph are both objects.  
AI_REQUIREMENTS: Oath telegraph **never** occupies the Stylus. The Strike Oath *allows* **is** the Body Mark consume (one exam). Non-Strike still fizzles (AP spent). Player Body Mark cannot brand two bodies. Gates 9/10 off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Body Mark / Strike Oath if missing. Extra door vs ENC-HOLD-03 / ENC-PRIO-13.  
MAP_REQUIREMENTS: Rush arena. Telegraph never on the Stylus.  
SPECIAL_RULES: `J3` after J2. Unlock Table J complete after this room. Hold if mark / oath objects missing. Not Hexed / Archivist / Goad / Veil / Rebound / Conductor / Levy.  
OBJECTIVE: Defeat both. Intended: Strike is the only legal damage, and it is **amped**.  
FAILURE_CONDITION: Player death.  
REWARD: As ENC-RUSH-43. Jackpot language stays on live room 9, not J3.  
TACTICAL_PURPOSE: Strike-hold + mark consume after ENC-HOLD-03 / ENC-FANG-01, without a third boss.  
SOLVABILITY_REQUIREMENTS: Stylus and lectern reachable; telegraph occupancy leaves a walk-off.  
REPLAYABILITY: Stylus west vs east.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by object timing, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain W — “Bash / Dry Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-12 then ENC-SPELL-23 (or ENC-SPELL-24 if Shove Mend already owned) |
| 2 | Reinforce | ENC-WAVE-13 |
| 3 | Combine | ENC-BASH-01 **or** ENC-DRY-01 **or** ENC-HOOD-01 |
| 3 insert | Choice | ENC-BRANCH-12 → bash/dry/hood/tick destinations |
| 4 | Pressure | ENC-SURV-23 **or** ENC-TICK-01 **or** ENC-CHASE-01 **or** skip via ENC-REST-12 |
| 4 | Mastery | ENC-MAST-12 (branch skin) |
| 5 | Boss | ENC-BOSS-12 |

Rare: 8% on depth 4 to **insert** ENC-RARE-12 before mastery (only if the matching combine exists this account).  
Treasure: rest may offer ENC-TREAS-12 instead of ENC-PROT-12.  
Tick side-story: replace combine with ENC-PRIO-14 and mini-boss ENC-MINI-13 (`fetid_rook`).

### Chain X — “Keystone / Swap Primer” (maxDepth 4)

ENC-KEY-01 → ENC-MOVE-22 → ENC-MOVE-23 → ENC-REST-12 → ENC-BOSS-12 (`midnight_bishop` only if Hood was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-KEY-01 as teach on accounts that already know late-seam.

### Rush injection (day-12)

After one full Table I clear, ENC-REST-12 shrine can enable: J0 → ENC-RUSH-43, J1 → ENC-RUSH-44, J2 → ENC-RUSH-45, J3 → ENC-RUSH-46. Day-1…day-11 flags for rooms 0–9 and Tables B–I remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-12, ENC-SPELL-23, ENC-SPELL-24 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-23, ENC-HAZ-24, ENC-KEY-01, ENC-DRAFT-01 | `under_50_damage` |
| ENC-BASH-01, ENC-DRY-01, ENC-HOOD-01, ENC-ELITE-22, ENC-ELITE-23, ENC-KEEP-01 | `under_8_ap_per_turn` |
| ENC-WAVE-13, ENC-PRIO-14, ENC-MAST-12 | `under_10_turns` |
| ENC-CHASE-01, ENC-HOLD-03, ENC-PROT-12 | `direct_hit` |
| ENC-TICK-01, ENC-STRETCH-01, ENC-ELITE-23, ENC-BOSS-12 | `no_healing` |
| ENC-SURV-23, ENC-SURV-24 | `no_healing` (not `no_damage_taken`) |
| ENC-MOVE-22, ENC-MOVE-23, ENC-HOME-01, ENC-INIT-01, ENC-WIPE-01 | `under_50_damage` |
| ENC-TREAS-12 / ENC-REST-12 / ENC-SPARE-01 / ENC-VACANT-01 / ENC-MARK-01 / ENC-QUICK-01 / ENC-COLD-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | 6 late-seam tiles **or** 1 rim cinder | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | seam **or** dash plate | kill + optional glyph |
| MID | named drop-11 `FSN-*` or waves | backline guard | zone 1 + Bash/Dry/Hood | one Wave-11 `WF-*` | clock / tags / init-swap |
| HIGH | elite or choir | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / cluster / hold |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / COURT / rare | branch-skinned | mastery / Table J |

If a live player is over-levelled for a band, **promote the band’s verb** (add Slider, enable Keep, inherit seam, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-11 fields plus:

```
encounterId
encounterType        // + bash | dry | hood | tick | home | exit | fang | wipe |
                     //   chase | keep | stretch | hold_verse | keystone | quick |
                     //   init_swap | stride_sill | draft | cold_open | late_cache |
                     //   spare_oath | vacant_hour | mark_tutor | low_picket |
                     //   wounded_file | rim_cinder | dash_plate | late_seam
formationId?         // FSN-SHOVE-BASH | FSN-DRY-TAX | FSN-WICK-HOOD |
                     // FSN-TICK-RAT | FSN-HOME-SILL | FSN-EXIT-PAIR |
                     // FSN-FOE-FANG | FSN-FIELD-WIPE | FSN-SHOVE-CHOIR |
                     // FSN-WICK-SPAN | FSN-DRY-KEEP | FSN-BOOT-CHASE |
                     // FSN-STRETCH-MUTE | FSN-HOME-QUIET | FSN-FOE-WOUND |
                     // FSN-HOLD-VERSE
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // bash | dry | hood | tick
decoyId? / realId?   // ENC-PRIO-14
holdPortalLocked?
objectiveKind        // + dash_then_clear | open_late_cache |
                     //   flag_spare_oath | keep_vacant | mark_tutor |
                     //   knock_keystone | plant_quick_hand
failureKind
deviceTable[]        // ENC-REST-12 Late / Spare / Vacant / Quick
rushVariant?         // table_j0_infirm_levy | table_j1_yoke_veil |
                     //   table_j2_salve_bait | table_j3_brand_oath
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Tutor / Final Pawn / Mender” logic — use `decoyId` / `realId` / `formationId` / `summonAI`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-28 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not. `fog_of_war` may still be used as a **wall-hook substitute** for ambush concealment, matching day-1…11 language.
- Dual-boss dungeon capstones (Rush only).
- Consuming same-day 2026-09-29 Wave 12 family / spell / world catalogs. Wave 11 families wait for a later formation drop. `FSN-TRIPLE-PLUG` / Quad Span / `FSN-HOLD-VERSE/QUAD` stay held while `ENEMY_SUMMON_CAP` is 2 (Quad needs remaining ≥ 4).
- Faking Shove Mend without `forcedMovedThisTurn`, Dry +8 without leftover 0, Gait Wick without walk-spend, Far Hood as a 1–2 zero, Tick Plate as a hit absorb, Home Step as Swap, Pair Slide as `isSwap`, Foe Reel as self-attract, Echo Wipe as a wall punch, Must Span as two-cell plug, Cast Hold as Strike-hold-only, Cold Open as Short Fuse, Still Gate in a dungeon.
- Adding Wave-12 boss ids to dungeon ENC-BOSS-12 in the same PR as a Rush remap.

---

## 10. Pick order (day-12, after days 1–11 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Queued days 4–11 still win in date order if those verbs are missing (see those files’ §10).

Once those exist, implementers should pick:

1. ENC-TEACH-12 + ENC-SPELL-23 (late-seam / shove-mend verbs)  
2. ENC-WAVE-13 (`formationId` SHOVE-BASH → DRY-TAX)  
3. ENC-BASH-01 or ENC-DRY-01 or ENC-HOOD-01 (new pressure objects)  
4. ENC-BRANCH-12 (`branch: bash|dry|hood|tick` snapshot-before-cleanup)  
5. ENC-BOSS-12 branch read  
6. Rush Table J variants 43–46 one room at a time (after the account has one full Table I clear)

Uniqueness: this file is the **twelfth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
