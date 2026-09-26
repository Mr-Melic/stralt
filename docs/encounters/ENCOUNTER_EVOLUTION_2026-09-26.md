# Encounter Evolution Catalog — 2026-09-26

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-26-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519), `ENCOUNTER_EVOLUTION_2026-09-25.md` (`EED-2026-09-25-001`, PR #574). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-8 formations `docs/design/ENEMY_FORMATIONS_2026-09-25.md` (PR #575), drop-9 formations `docs/design/ENEMY_FORMATIONS_2026-09-26.md` (PR #612), Wave 8 families `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-25.md` (PR #558), Wave 7 tactical spells `docs/automation/SPELL_PROPOSALS_2026-09-24.md` (PR #525), Wave 8 world features (PR #578) and Wave 9 world features `docs/WORLD_DYNAMICS.md` (PR #613, `WDD-2026-09-26-001`), Rush Table G `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.6 (PR #572). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`. `WorldExploration.tsx` is 19,213 lines.

Same-day Wave 8 *spell* proposals (PR #563) still have **no family sheets**. Do not require those ids as room engines. Wave 9 **families** do not exist yet — Table G bosses stay Rush-only.

---

## 1. Why a ninth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–8 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, Gale/Twin/Pincer, and Face/Mute/Span/Brand. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-8 leftover packs | `FSN-CAMP-TITHE`, `FSN-POST-TITHE`, `FSN-PURSE-MUTE`, `FSN-PURSE-COURT`, `FSN-CORNER-FOG`, `FSN-HINGE-COVER`, `FSN-REEL-TITHE`, `FSN-TWIN-PLUG`, `FSN-VEIL-CORNER`, `FSN-BREAK-CHOIR`, `FSN-LEND-FAN`, `FSN-SPARK-SPLIT`, `FSN-HINGE-WICK`, `FSN-CAP-VEIL`, `FSN-REEL-CORNER` are PDFs; day-8 rooms spent drop-7 `FSN-FACE-PIN` / `MUTE-PIT` / `SPAN-GUN` instead |
| Drop-9 Wave 8 packs | `FSN-WALL-HUG`, `FSN-BOOT-STEP`, `FSN-FACE-WRITE`, `FSN-DULL-PET`, `FSN-SLIP-PIT`, `FSN-CRACK-VERSE`, `FSN-SHARE-GOAD`, `FSN-WALL-FILE`, `FSN-BOOT-SPARE`, `FSN-FACE-GLANCE`, `FSN-BOON-BOOT`, `FSN-PIVOT-WICK`, `FSN-HOOD-CHOIR`, `FSN-WICK-FACE`, `FSN-BRAND-REEL` — `FSN-TRIPLE-PLUG` is **held** until remaining summon cap ≥ 3 |
| Wave 8 families | `wall_stinger`, `file_brander`, `boot_stinger`, `face_shover`, `slip_squire`, `pivot_ward`, `cadence_cracker`, `once_cantor`, `hood_lurker`, `share_warden`, `spare_pacer`, `wick_painter`, `boon_mason`, `dull_censor`, `pet_siller`, `leash_cutter` have packs but no dungeon beat (day-8 left PR #558 for later) |
| World-feature wave 8 leftover | `WF-HAZ-BOG_SILT`, `WF-HAZ-TURNSTILE_EMBER`, `WF-TRP-WEARY_PLATE`, `WF-TER-MASON_CRATE`, `WF-OBS-COIN_SILL`, `WF-ZON-TRUE_STRIKE`, `WF-TEL-BACKSTEP`, `WF-PRT-HEARTH_GATE`, `WF-INV-HORN_RELAY`, `WF-ELT-ODD_PICKET`, `WF-TRS-WOUND_CACHE`, `WF-SPL-VOW_KEEPER`, `WF-RSK-BOND_OATH`, `WF-MOD-CLOSE_QUARTERS`, `WF-EVT-KINDLED_HOUR`, `WF-ENV-GALE_BITE` |
| World-feature wave 9 | `WF-HAZ-LECTERN_ASH`, `WF-HAZ-SKIP_CINDER`, `WF-TRP-CAMP_PLATE`, `WF-TER-TILT_SCREEN`, `WF-OBS-TITHE_SILL`, `WF-ZON-ROOT_CIRCLE`, `WF-TEL-FLANK_STEP`, `WF-PRT-WANE_GATE`, `WF-INV-HEIR_CORDON`, `WF-ELT-NEAR_PICKET`, `WF-TRS-STRIDE_CACHE`, `WF-SPL-GRAVE_SCRIBE`, `WF-RSK-STRIDE_OATH`, `WF-MOD-FAR_CAST`, `WF-EVT-LONG_WATCH`, `WF-ENV-SIGHT_BURN` |
| Rush Table G | `G0`–`G3` (`toll_ostiary`+`cinder_lance`, `hinge_precentor`+`ivory_palisade`, `veil_verger`+`wick_prelate`, `oath_dean`+`ram_castellan`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `barrierTiles[]` / `walkMpSpentThisTurn` / `shoveDest` / `sillCell` / `spanCells[]`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Buffers / hug guns / boot / face / dull / spare must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-WANE_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight / Ash / Hearth). Forbidden in dungeon, boss rush, and Death Realm.
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-9 ids (`toll_ostiary`, `hinge_precentor`, `veil_verger`, `oath_dean`) in the same PR as a Rush remap.
- World walls / smoke / pits / span posts are **not** `barrierTiles`. Hug +10 only pays off a planted barrier cell.
- Knight Slip / Swap / Shove Face / Pivot **does not** count as walk-MP for Boot Sting or Post Sting.
- `FSN-TRIPLE-PLUG` does not spawn while remaining `ENEMY_SUMMON_CAP` is 2. Show `FSN-TWIN-PLUG` / ENC-PLUG-01 instead.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-HUG-01 / ENC-ELITE-16 | planted `barrierTiles[]` distinct from world walls | Convert to ENC-ELITE-05 / `FSN-GLASS-WARD` (geometry gun without a mason) |
| ENC-BOOT-01 / ENC-SPELL-17 | battle-walk `walkMpSpentThisTurn` writer | Convert to ENC-TITHE-02 (`FSN-CAMP-TITHE` Frost-only stand-gun) |
| ENC-WRITE-01 | `applyPushback` cast caller + dest walk-off | Face Strike only; Glance Frosts; do not advertise a rewrite |
| ENC-DULL-01 | next-Strike-0 writer; sill occupancy | Convert to ENC-NULL-01 (`FSN-NULL-WALL`) |
| ENC-SLIP-01 | (2,1) dest occupancy + Pit Wick convert | Convert to ENC-PIT-01 (queued day-5) |
| ENC-CRACK-01 | hostile highest-CD → 0 once/battle | Convert to ENC-SPELL-16 (glyph teacher) |
| ENC-SHARE-01 | 50/50 hit split needs a living Chebyshev-1 ally | Convert to ENC-PINCH-01 (queued day-7 occupancy sandwich) |
| ENC-TITHE-02 | walk-spend writer for Post +10 | Frost + painted Exit Tithe cell only; do not claim 22 |
| ENC-PLUG-01 | two-cell occupancy on one id | Convert to ENC-SPAN-01 (queued day-8) |
| ENC-RUSH-31…34 | Table G bosses + tithe/hinge/cowl/brand objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Hug primer + inserts)

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

| Beat | Depth hint | Job | Day-9 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (cast-from-ash, planted hug, stand vs walk gun) | ENC-TEACH-09, ENC-SPELL-17, ENC-HAZ-17, ENC-TITHE-02 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-10, ENC-AMBUSH-09 |
| Combine | 2–3 | Two taught verbs | ENC-HUG-01, ENC-BOOT-01, ENC-WRITE-01, ENC-DULL-01, ENC-HAZ-18, ENC-MOVE-16 |
| Pressure | 3 | Clock, LoS tax, cordon, or skip-cinder | ENC-SURV-17, ENC-PROT-09, ENC-SLIP-01, ENC-CRACK-01, ENC-SHARE-01, ENC-PRIO-11 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-09, ENC-BRANCH-09, ENC-TREAS-09, ENC-OATH-02, ENC-NEAR-01, ENC-SCRIBE-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-16, ENC-ELITE-17, ENC-RARE-09, ENC-MAST-09, ENC-CORNER-01, ENC-PLUG-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-10, ENC-BOSS-09, ENC-RUSH-31…34 |

Days 1–8 chains remain valid. Day-9 **Hug primer** is the default for accounts that already cleared Face / Mute / Span / Brand once (queued ENC-BRANCH-08). Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-09

ENCOUNTER_ID: ENC-TEACH-09  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a cast-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. A 4-tile `WF-HAZ-LECTERN_ASH` patch across the mid-band (walk and Attack Nearest free; any `SpellConfig` cast while occupying ash costs 4% max HP). A dry detour of ≥ 1 tile exists. Player spawn opposite the bishop. One locked exit. Modifier off. No lava/ice/spikes. Do not also apply `WF-MOD-FAR_CAST` (would hide “cast from dry”).  
SPECIAL_RULES: `scriptedHazardsOnly`. First frost that taxes because it was cast from ash logs a teach line. Distinct from ENC-HAZ-15 rime (idle AP) and leftover `WF-HAZ-BOG_SILT` (MP). Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Defeat both. Optional: never cast from ash (Attack Nearest from the lectern, or frost from dry).  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the lectern punishes **spells**, not walking or Attack Nearest.” Prepares ENC-HUG-01 (geometry gun) and ENC-HAZ-17 (tighter ash).  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; dry detour reaches the bishop. Ash never walls a corridor. Ash not on spawn±3 or the portal.  
REPLAYABILITY: Patch horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: inherit `WF-MOD-FAR_CAST` so adjacency frost is also illegal — the lesson is step back onto **dry**. Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-17

ENCOUNTER_ID: ENC-HAZ-17  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may end a turn on leftover `WF-HAZ-BOG_SILT` **if they Strike**. Wounded pawns avoid launching a walk from silt. Bishop kites from dry / non-ash floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without an ash-cast tax can later hint `spell-spare-pace` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: Lectern ash ribbon of 4–6 tiles (ENC-TEACH-09 verb) **plus** a 3-tile bog-silt seam on a **flank** (`inheritHazardsFrom: ENC-TEACH-09` optional; `WF-HAZ-BOG_SILT` leftover from wave 8). Dry / non-silt detour of ≥ 1 tile. Exit behind the bishop.  
SPECIAL_RULES: Scripted ash + silt only. Do not mix ice. Attack Nearest from ash is the intended free line. Walking off silt is the tax.  
OBJECTIVE: Clear all. Intended: Strike from ash, frost from dry, never walk off silt.  
FAILURE_CONDITION: Player death (frost + ash-cast and/or silt-MP tax).  
REWARD: Standard. Overlay `under_50_damage` rewards refusing both taxes.  
TACTICAL_PURPOSE: Teach two inverse launch taxes: ash punishes spells, silt punishes MP. Distinct from flint dust (any AP) and rime (idle).  
SOLVABILITY_REQUIREMENTS: Dry detour reaches both pawns and the bishop. Seams never wall a corridor. Neither hazard on spawn±3 or the portal. Count toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ash H / silt V vs swapped.  
SCALING_BEHAVIOUR: Mid: add `swift_winds` (+2 MP) so the player *can* leave silt in one turn — the lesson is choosing not to. High: bishop gains `spell-slow`. Never thicken either seam into a wall.  
STATUS: PROPOSED

---

### ENC-HAZ-18

ENCOUNTER_ID: ENC-HAZ-18  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `tide_shade` bishop (`starter-frost` + `spell-slow` at band 1) + 2× pawn.  
AI_REQUIREMENTS: Pawns push toward the **next** skip-cinder landing. Bishop holds the far third and does not stand on the painted hop line.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Slow can complete that id if missing.  
MAP_REQUIREMENTS: Arena plus `WF-HAZ-SKIP_CINDER` (5-tile line, 2-tile hop each round start, 5% max HP on land; skipped cells this hop are safe). A floor path around the line. Optional leftover 2 lectern-ash tiles from ENC-TEACH-09 (`inheritHazardsFrom: ENC-TEACH-09`). Do not also place `WF-HAZ-TURNSTILE_EMBER` on the same map (two hopping cinders).  
SPECIAL_RULES: Scripted hazards only. Skip-cinder never covers spawn or exit. Distinct from ENC-HAZ-16 windrow (2-cycle in-out bar) and leftover turnstile (plus rotate).  
OBJECTIVE: Clear all. Intended: stand on a skipped cell, cross after it hops past.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a 2-tile hop tax with a kiter so “stand on the skip” is the answer, not a DPS race.  
SOLVABILITY_REQUIREMENTS: Path around the line; 3-unit occupancy leaves walk-offs; skip-cinder counts as 1 toward the hazard cap.  
REPLAYABILITY: Line N-S vs E-W.  
SCALING_BEHAVIOUR: High: replace one pawn with a `ROLE-BOOT` knight only if ENC-BOOT-01’s walk writer is live. Peak: inherit `WF-ENV-SIGHT_BURN` **only** if a wall can break LoS (world-dynamics skip-on-open-arena).  
STATUS: PROPOSED

---

### ENC-SPELL-17

ENCOUNTER_ID: ENC-SPELL-17  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× “boot pawn” that only Strikes after a painted **one-tile step** + 1× dummy bishop that **only** casts `starter-frost`. After the pawn’s first walked Strike resolves, a **boot glyph** appears on a side tile (`discoverSpellId: spell-boot-sting`; if owned, `spell-spare-pace`). Until `walkMpSpentThisTurn` exists, the pawn Strikes in place and the **glyph** is the teacher — do not advertise +10.  
AI_REQUIREMENTS: Pawn steps the painted cell if the writer is live; otherwise camps. Bishop prefers the aisle. Neither walks onto the glyph.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: `spell-boot-sting`. If owned: `spell-spare-pace`. If both owned: convert to ENC-BOOT-01.  
MAP_REQUIREMENTS: Open approach of 3 tiles + one side alcove for the glyph. No ice on both approaches. Optional `WF-HAZ-BOG_SILT` **off** on TEACH (would tax the teaching step).  
SPECIAL_RULES: Glyph despawns if unused when the last enemy dies (player still wins). Discovery does not auto-upgrade and does not auto-bar-insert (max 8). Slip / shove does not count as the teaching walk.  
OBJECTIVE: Clear. Optional: pick up the glyph and Strike after a real walk.  
FAILURE_CONDITION: Player death.  
REWARD: The spell id into the owned set + tiny Doka.  
TACTICAL_PURPOSE: Teach “the bonus is **this turn’s walk**, not a bigger number.” Inverse of ENC-TITHE-02 (the gun that wants to stand).  
SOLVABILITY_REQUIREMENTS: Alcove reachable; glyph not on the only walk column. Two walk-offs.  
REPLAYABILITY: Alcove left/right.  
SCALING_BEHAVIOUR: Does not scale; it retires when both boot/spare ids are owned.  
STATUS: PROPOSED

---

### ENC-SPELL-18

ENCOUNTER_ID: ENC-SPELL-18  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× “face pawn” that telegraphs a 0-damage shove into a painted dest + 1× dummy bishop (`starter-frost`). After the first legal shove (or after the first Strike if push is missing), a **write glyph** appears (`discoverSpellId: spell-shove-face`; if owned, `spell-dull-edge`).  
AI_REQUIREMENTS: Pawn skips if dest is blocked / lava / portal. Bishop does not walk onto the glyph. Does not recast Shove Face on TEACH (the glyph is the teacher).  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-shove-face` (primary). `spell-dull-edge` if shove-face is owned. If both owned: convert to ENC-WRITE-01 or ENC-DULL-01.  
MAP_REQUIREMENTS: Arena with a wall 2 tiles behind a typical stand (so occupying the dest zeros the shove) + glyph alcove. Reject `corridorMaze`.  
SPECIAL_RULES: Glyph despawns if unused when the last enemy dies. `applyPushback` dest must leave a walk-off. Collision = 0 rewrite.  
OBJECTIVE: Clear. Optional: pick up the glyph and shove / dull before the last kill.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + tiny Doka.  
TACTICAL_PURPOSE: Teach “the board can write facing” and “the next Strike can be 0.” Prepares ENC-WRITE-01 / ENC-DULL-01.  
SOLVABILITY_REQUIREMENTS: Dest free floor, not hazard, not portal, with a walk-off. Glyph not on the shove dest.  
REPLAYABILITY: Dest north vs east.  
SCALING_BEHAVIOUR: After both ids are owned, convert to ENC-WRITE-01 (exam).  
STATUS: PROPOSED

---

### ENC-TITHE-02

ENCOUNTER_ID: ENC-TITHE-02  
TYPE: teach mechanic / formation  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: `FSN-CAMP-TITHE` — `ROLE-POST` rook (proposed `post_stinger`, Frost at band 0; Post Sting only if walk-spend writer exists) + `ROLE-TITHE` bishop (paints **one** aisle cell with Exit Tithe). No Rank Lock on PAIR.  
AI_REQUIREMENTS: Post never walks then stings. Tithe never paints the only walk-off. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing a camped Post Sting can drop `spell-post-sting` if missing. Exit Tithe observation can drop `spell-exit-boon`’s inverse teacher (`spell-post-sting` stays primary).  
MAP_REQUIREMENTS: Fortress courtyard + **gallery** (`FSN-CAMP-TITHE` contract). Reject a 1-tile tunnel. No lava on the painted cell. No Time Warp.  
SPECIAL_RULES: Random 30% family lottery **off**. Until the walk-spend writer exists, Post Frosts — still the stand-gun lesson. Distinct from ENC-TITHE-01 (queued day-5 repeating HP tax wager) and ENC-SPELL-15 (wall/file geometry).  
OBJECTIVE: Defeat both. Intended: sit on the tithe and frost / Attack Nearest, or take the gallery.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + post-sting discovery. Overlay `under_8_ap_per_turn` (don’t dump Inferno from the tithe cell).  
TACTICAL_PURPOSE: Teach the **inverse** of ENC-BOOT-01: this gun wants to stand; leaving the cell is the tax.  
SOLVABILITY_REQUIREMENTS: Gallery reaches the Post. Painted cell is not a cut-vertex. Two walk-offs.  
REPLAYABILITY: Aisle N vs E.  
SCALING_BEHAVIOUR: High: convert to `FSN-POST-TITHE` (add Rank Lock) only after ENC-LOCK-01 was answered this account. Peak: elite Post (`/E-POST`), still no second gun.  
STATUS: PROPOSED

---

### ENC-WAVE-10

ENCOUNTER_ID: ENC-WAVE-10  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-CAMP-TITHE` (stand-gun). Wave 2: `FSN-WALL-HUG` (hug-gun + pylon) **or**, if `barrierTiles` are missing, leftover `FSN-GLASS-WARD`. Wave 3: leftover Post **or** leftover Hug, never both. Never more than 4 living hostiles. Band 0: wave 2 is Hug Frost + pylon body (no +10).  
AI_REQUIREMENTS: Wave 1: Post camps. Wave 2: Pylon plants then steps off; Hug skips +10 unless the player is Chebyshev-1 from the planted cell. Wave 3 leftover is greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 1 may reveal Post Sting. Wave 2 Hug can complete `spell-wall-sting` if ENC-SPELL-15 was skipped.  
MAP_REQUIREMENTS: Fortress lane + **one side aisle / gallery**. `waveSpawnCells` in the far lane. Optional lectern ash inherited from ENC-TEACH-09 (`inheritHazardsFrom: ENC-TEACH-09`) so casting from the aisle is the same tax.  
SPECIAL_RULES: Portal locked until wave 3 is clear. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns` is tight on purpose.  
TACTICAL_PURPOSE: Named leftover drop-8 then drop-9 PAIR as wave verbs — stand-gun, then planted-hug — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Gallery reaches the Hug. Cap 4 living so later summons are not starved.  
REPLAYABILITY: Wave 2 can swap to `FSN-BOOT-STEP` if the account already answered WALL-HUG this run.  
SCALING_BEHAVIOUR: High: wave 3 leftover is `FSN-WALL-HUG/E-HUG`. Peak: wave 2 is `FSN-WALL-FILE` (hug + pylon + file-brand) only if ENC-HUG-01 was answered. No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-09

ENCOUNTER_ID: ENC-AMBUSH-09  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× `WF-TRP-CAMP_PLATE` (not a combatant — first unit that occupies it at **both** start and end of their own turn pays 8% max HP once) + 1× wounded-looking pawn. Hidden until trigger: `FSN-BOOT-STEP` lite — 1× `ROLE-BOOT` knight (`physical_attack`; Boot Sting if writer live) + 1× `ROLE-SPARE` bishop (`spell-spare-pace` at band 1, else Frost).  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP). Boot prefers a walked dest after trigger. Spare grants only if the Boot is one short. Plate is not an AI actor. Inverse of ENC-AMBUSH-08 Idle Pin (0 MP) and leftover Weary Plate (2+ AP end-turn).  
SPELL_DISCOVERY_OPPORTUNITIES: Observing a walked Boot Sting can drop `spell-boot-sting` if missing.  
MAP_REQUIREMENTS: Arena with a camp-plate start cell (always visible). `ambushCells` behind a wall hook **or** `fog_of_war`. Trigger: player **camps** the plate (start+end same turn) **or** bait drops below 50% HP **or** the player crosses the midline.  
SPECIAL_RULES: Ambush units do not exist in the combatant store until trigger (portal locked because bait is alive). Plate tax via challenge HP; never on spawn/portal. Walking **through** the plate without camping does not fire the tax (and should not fire the ambush — midline / bait still can). Intent log: explicit `ambush: camp_plate`.  
OBJECTIVE: Defeat bait + ambushers. Plate remaining after clear is floor.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player walked through the plate without camping (read the trap). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Punish camping a “safe” inlay; teach that staying put can *call* a walk-gun. Distinct from ENC-AMBUSH-02 glyph and ENC-AMBUSH-03 lantern.  
SOLVABILITY_REQUIREMENTS: `ambushCells` reachable after spawn; plate path around exists; bait cannot spawn on the portal.  
REPLAYABILITY: Hook left/right. Spare omitted at low band (Boot only).  
SCALING_BEHAVIOUR: High: full `FSN-BOOT-SPARE` (add muter) only if ENC-MUTE-01 was answered. Peak: plate + one lectern-ash tile on a **flank**, not the only path.  
STATUS: PROPOSED

---

### ENC-REINF-09

ENCOUNTER_ID: ENC-REINF-09  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-INV-HEIR_CORDON` as a **scripted dungeon room** — 1× elite (`variant: elite`, rook chassis, `spell-iron-skin` + Strike) + 2× same-tier minion pawns. In a dungeon-chain minions **do not vanish** when the heir dies (world-dynamics run contract). Optional: if the heir is marked/exposed, a 1-pawn horn from leftover `WF-INV-HORN_RELAY` spawns on `reinfCells` (cap 1 extra, hard-cap 4 living).  
AI_REQUIREMENTS: Heir charger / chokepointCamp on the cordon. Minions screen. Reinforcement skip if living + pending would exceed 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Painted cordon of 3 floor cells. Exit reachable without touching in **exploration**; in a run all three are hostiles for map-clear. `reinfCells` adjacent to the heir, reachable floor, not the portal.  
SPECIAL_RULES: Dungeon-chain: must fight all three. Portal locked until the board is empty. Distinct from ENC-REINF-08 (queued day-8 reel) and ENC-CAMP-01 (three sleeping elites).  
OBJECTIVE: Clear all. Intended exploration line (if this chrome is reused overworld): burst the heir. In a run: clear minions so the heir cannot hide behind occupancy.  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band depth Doka + elite XP on the heir only. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Priority occupancy — three bodies that do not despawn in a run. Prepares Table G G0 trash-as-objects without a third boss.  
SOLVABILITY_REQUIREMENTS: Cordon floor; 3-unit occupancy leaves walk-offs; `reinfCells` never on the portal.  
REPLAYABILITY: Heir rook vs knight. Horn on/off.  
SCALING_BEHAVIOUR: Peak: heir is `FSN-WALL-HUG/E-HUG` (still one elite tag). Never add a third minion.  
STATUS: PROPOSED

---

### ENC-HUG-01

ENCOUNTER_ID: ENC-HUG-01  
TYPE: elite-adjacent / formation / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WALL-HUG` — `ROLE-HUG` rook (proposed `wall_stinger`, frost; Wall Sting only if a planted `barrierTiles` cell is Chebyshev-1 from the player) + `ROLE-PYLON` (plants **one** barrier cell, then steps off). No File Brand on PAIR. No second gun.  
AI_REQUIREMENTS: Hug artillery; skip +10 on open floor / world walls / pits / span. Pylon plant then step off; cap 1; fall-through Frost, never skip-lock. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Wall Sting +10 can drop `spell-wall-sting` if ENC-SPELL-15 did not.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with a 4-tile file **plus** a gallery. Reject a 1-tile tunnel. No lava on the planted cell. No Time Warp. Optional leftover `WF-TER-MASON_CRATE` as **cover**, never as the hug wall (crates are not `barrierTiles`).  
SPECIAL_RULES: Random 30% lottery off. Until pylon plant exists, Hug Frosts — still the “don’t hug *their* wall” lesson. `isTrap` must **not** be the plant writer (live `isTrap` → `placeBarrier` 3 is the honesty gap for tripwires, not this mason).  
OBJECTIVE: Defeat both. Intended: stay Chebyshev-2 from the planted cell; kill the glass Hug.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + wall-sting discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Planted geometry gun. Distinct from ENC-SPAN-01 (two-cell plug) and ENC-ELITE-05 (min-range sniper). Prepares `FSN-WALL-FILE`.  
SOLVABILITY_REQUIREMENTS: Gallery reaches the Hug. Planted cell is not the only aisle. Two walk-offs.  
REPLAYABILITY: Gallery W vs E.  
SCALING_BEHAVIOUR: High: `/E-HUG`. Peak: convert to `FSN-WALL-FILE` (add `ROLE-BRAND`) only after ENC-SPELL-15 File Brand was seen. Still no Triple Span.  
STATUS: PROPOSED

---

### ENC-BOOT-01

ENCOUNTER_ID: ENC-BOOT-01  
TYPE: elite-adjacent / formation / movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-BOOT-STEP` — `ROLE-BOOT` knight (proposed `boot_stinger`) + `ROLE-SPARE` bishop (proposed `spare_pacer`). Band 0: **do not spawn this id** — show ENC-TITHE-02.  
AI_REQUIREMENTS: Boot skips +10 if walk-spend is 0; never count Slip/shove/Swap as walk. Spare skips at max MP; never persist `CharacterStats.mp`. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-boot-sting` / `spell-spare-pace`.  
MAP_REQUIREMENTS: `openField` or `arena` with a 3-tile approach **plus** a side step. Reject a 1-tile tunnel. No ice on both approaches. Optional `WF-TEL-FLANK_STEP` as a **player** skip (1 MP right-of-facing) — dest must be empty floor.  
SPECIAL_RULES: Random 30% lottery off. Unlock after ENC-TITHE-02 or ENC-SPELL-17. Root / occupy-the-dest is the intended answer.  
OBJECTIVE: Defeat both. Intended: Nail Down / occupy the bought tile / stay at 4.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + boot/spare discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Walked poke + current-turn MP gift. Inverse of ENC-TITHE-02. Prepares `FSN-BOOT-SPARE` / `FSN-BOON-BOOT`.  
SOLVABILITY_REQUIREMENTS: Side step exists. Spare not trapped. Boot starts ≥ Chebyshev 4.  
REPLAYABILITY: Boot north vs east. `/SLIP` only after ENC-SLIP-01 (Slip does **not** pay Boot).  
SCALING_BEHAVIOUR: High: `/E-BOOT`. Peak: `FSN-BOOT-SPARE` (add muter) if ENC-MUTE-01 was answered. Never Boot+Post as two guns.  
STATUS: PROPOSED

---

### ENC-WRITE-01

ENCOUNTER_ID: ENC-WRITE-01  
TYPE: displacement / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FACE-WRITE` — `ROLE-FACE` knight (proposed `face_shover`, 0-damage push 1, writes `currentView` **only if** the player changed cell) + `ROLE-GLANCE` bishop (pokes the **new** front). No Oncoming on PAIR. No Bash / Chaplain / Recoil.  
AI_REQUIREMENTS: Face skips 0-slide / hazard dest. Glance skips unless facing matches **after** a public rewrite. Soph 1–2. Distinct from ENC-FACE-01 (lock one view, no shove) and ENC-HINGE-01 (self-rotate).  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-shove-face`. Glance frost can complete frost observation.  
MAP_REQUIREMENTS: Arena or asymmetric with pillars / a wall 2 tiles from typical stand, plus open floor the other way. Reject `corridorMaze`. No lava dest. No Void Rift landing. Optional `WF-ZON-ROOT_CIRCLE` as **player** anti-knockback (occupancy, not a buff spell).  
SPECIAL_RULES: Until `applyPushback` is a spell caller, Face Strikes and Glance Frosts — do not advertise a rewrite. Glance may use a real Shove Face write without a battle-walk view writer.  
OBJECTIVE: Defeat both. Intended: occupy the dest so push distance is 0.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + shove-face discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Displacement that **writes facing** for a gun. Prepares `FSN-FACE-GLANCE` (Oncoming) and Table G G3 (must-Strike while ram shoves you off melee).  
SOLVABILITY_REQUIREMENTS: Dest walk-off; Face cannot spawn adjacent (`MIN_CHEBYSHEV` 4). Root circle, if placed, is not on spawn/portal.  
REPLAYABILITY: Dest N vs E. Root circle on/off.  
SCALING_BEHAVIOUR: High: `/E-FACE`. Peak: `FSN-FACE-GLANCE` only if ENC-TEACH-08’s `currentView` walk writer is live (Oncoming). Never Court Shove on this grade.  
STATUS: PROPOSED

---

### ENC-DULL-01

ENCOUNTER_ID: ENC-DULL-01  
TYPE: priority-target / anti-summon / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-DULL-PET` — `ROLE-DULL` bishop (proposed `dull_censor`, next `physical_attack` deals 0 for 2 turns) + `ROLE-SILL` rook (proposed `pet_siller`, summons cannot **walk** onto one cell; player body walks freely). Weight ×2 if the player has a summon **equipped**.  
AI_REQUIREMENTS: Dull skips planted casters; never Mute Thread / Oath Blade. Sill skips empty board; never paints the only walk-off. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-dull-edge`. Sibling `spell-pet-sill` / `spell-short-leash` if those catalogs land.  
MAP_REQUIREMENTS: Open courtyard. Sill cell is **not** the only approach to Dull. No sealed alcove. Optional `WF-MOD-FAR_CAST` **off** on CELL (would hide “poke from 4”).  
SPECIAL_RULES: Distinct from ENC-NULL-01 (Weaken/Expose + golem). If no pets, this is Dull + Frost rook — fine. Short Leash is `/LEASH` only.  
OBJECTIVE: Clear. Intended: frost/slow instead of Strike; walk the player body through the sill.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + dull-edge discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Anti-melee + anti-summon park. Prepares `/BROOD` and Table G G2 (cannot *name* the veil — AoE / Strike from a different cell).  
SOLVABILITY_REQUIREMENTS: Courtyard walk-offs; Dull not trapped; sill not on the portal.  
REPLAYABILITY: `/LEASH` at high if a cutter exists. `/BROOD` only after ENC-REINF-03 (spark + sill, cap 1).  
SCALING_BEHAVIOUR: High: elite Dull (`/E-DULL`) still without Oath. Peak: convert to ENC-PRIO-11 (heir + dull).  
STATUS: PROPOSED

---

### ENC-SLIP-01

ENCOUNTER_ID: ENC-SLIP-01  
TYPE: movement / hazard / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SLIP-PIT` — `ROLE-SLIP` knight (proposed `slip_squire`, (2,1) dest must be free; dest-is-wall fails; walk MP stays 0) + `ROLE-WICK` rook (proposed `wick_painter`, paints a melee-approach cell walkable **now**, converts next turn to Open Pit — not `barrierTiles`, never `isTrap`).  
AI_REQUIREMENTS: Slip skips illegal dest. Wick paints a cell that is not the only aisle; units on convert are **not** displaced. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-knight-slip` / `spell-pit-wick`.  
MAP_REQUIREMENTS: Arena with a 3×3 knight-ring plus one painted wick cell. Reject a closet with no (2,1) dest. No lava on Slip dests. Optional leftover `WF-TER-TILT_SCREEN` as a LoS gate (1 AP tilt), never as a pit.  
SPECIAL_RULES: Slip does **not** pay Boot if a Boot is later added (PAIR ban). Leave during the wick window. Barrier last-writer filling the pit is legal counterplay.  
OBJECTIVE: Clear. Intended: plug the (2,1) ring; leave the wick before convert.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + slip/wick discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teleport that is **not** Vault/Hinge/Mist, plus a delayed pit that is not ENC-PIT-01’s immediate walk-block. Prepares `FSN-PIVOT-WICK` / `FSN-WICK-FACE`.  
SOLVABILITY_REQUIREMENTS: At least two legal Slip dests; wick not a cut-vertex; pit convert still leaves a path.  
REPLAYABILITY: Wick N vs E. `/BRAND` only after ENC-HUG-01.  
SCALING_BEHAVIOUR: High: elite Slip. Peak: `FSN-PIVOT-WICK` (add pivot + rank lock) only if ENC-LOCK-01 was answered.  
STATUS: PROPOSED

---

### ENC-CRACK-01

ENCOUNTER_ID: ENC-CRACK-01  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CRACK-VERSE` — `ROLE-CRACK` bishop (proposed `cadence_cracker`, once/battle sets target’s highest remaining CD → 0) + `ROLE-ONCE` bishop/queen without heal (proposed `once_cantor`, next spell fizzles if `spell.id === lastResolvedSpellId`). No Mute Thread.  
AI_REQUIREMENTS: Crack skips a bar of 0s; ties = highest remaining then lowest id. Once skips if no `lastResolvedSpellId` (first spell of the fight never fizzles). Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cadence-crack` / `spell-once-verse` if ENC-SPELL-16 did not finish them.  
MAP_REQUIREMENTS: Two stalls + nave. No Time Warp. No Glass Realm. Optional `WF-EVT-KINDLED_HOUR` leftover **off** (would force an AP spell that Crack then resets).  
SPECIAL_RULES: Unlock after ENC-SPELL-16. Crack restoring the player’s Inferno is still **one** enemy Inferno cadence — two windows on **their** bar. Alternate ids is the answer to Once.  
OBJECTIVE: Clear. Intended: sit with CDs at 0, then alternate frost/strike so Once misses.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + cadence discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Hostile CD reset + recast lock. Distinct from ENC-BRAND-01 (hit writes +1 CD) and ENC-ACT-01 (14 on become-current-actor).  
SOLVABILITY_REQUIREMENTS: Stalls connected; neither caster sealed.  
REPLAYABILITY: `/IGNITE` only if a non-Inferno DoT exists on the sheet.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-HOOD-CHOIR` (tick skip + ignite + absolve) as ENC-RARE-09.  
STATUS: PROPOSED

---

### ENC-SHARE-01

ENCOUNTER_ID: ENC-SHARE-01  
TYPE: protection / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SHARE-GOAD` — `ROLE-SHARE` rook/king (proposed `share_warden`, next damaging **hit** splits 50/50 after RES with nearest living Chebyshev-1 ally; missing ally at hit → full hit) + `ROLE-GOAD` (taunt / occupancy sandwich from queued `FSN-PINCH-GOAD` junior — Strike only if Share’s ally is the lower-HP body). DoT / lava do not consume Share.  
AI_REQUIREMENTS: Share skips if no adjacent same-side ally. Goad prefers the player into Strike range of the **lower-HP** ally. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-flank-share`. Sibling taunt ids if those catalogs land.  
MAP_REQUIREMENTS: Wide choke + two walk-offs. Reject a 1-tile tunnel (cannot separate). Optional `WF-ZON-ROOT_CIRCLE` so the player can plant against a later shove.  
SPECIAL_RULES: Separate them is the answer. Distinct from ENC-BRAND-COVER (whole-hit redirect) and ENC-PINCH-01 (occupancy sandwich without 50/50).  
OBJECTIVE: Defeat both. Intended: pull Share off the ally, then dump into the isolated body.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + flank-share discovery. Overlay `direct_hit` is a joke on a split — prefer `under_15_turns`.  
TACTICAL_PURPOSE: Occupancy as a **hit split**, not a heal. Prepares Table G G2 choir bounce without Cover Hospitaller.  
SOLVABILITY_REQUIREMENTS: Two tiles between spawn and the pair; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: `/CAP` at peak (Share + cap soak) — still one elite tag.  
SCALING_BEHAVIOUR: Add Haste uptime on Goad before HP. Never add Pain Link on this PAIR.  
STATUS: PROPOSED

---

### ENC-SURV-17

ENCOUNTER_ID: ENC-SURV-17  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Start: 2× pawn + 1× bishop (`starter-frost`). Every 3 enemy-team turns, spawn 1 from {pawn, `ROLE-BOOT` knight, `ROLE-HUG` rook} until the clock ends. Max 4 living. Skip Hug in the pool if `barrierTiles` missing.  
AI_REQUIREMENTS: Casters hold LoS (Sight Burn is the tax). Boot prefers a walked dest. Hug holds a planted cell if a pylon leftover exists. Group tactics if soph ≥ 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Survive 8 turns without `spell-timestep` → rest shrine may offer timestep (reminder, not a free grant).  
MAP_REQUIREMENTS: Arena with **at least one wall that can break LoS** (`WF-ENV-SIGHT_BURN` contract — skip this id on open arenas). Safe core of 5 tiles that includes a hide hatch. Optional leftover `WF-ENV-GALE_BITE` **off** (plant-or-pay-to-move stacks with Sight Burn).  
SPECIAL_RULES: Clock `surviveTurns: 10` player-turns. When it hits 0, remnants flee to the edge and despawn. Portal unlocks only after the board is empty. Sight Burn: end of each combatant turn, if any living enemy has LoS, pay 3% max HP. Ash Rain / Exposed Line stay off (those are older LoS taxes).  
OBJECTIVE: Be alive after 10 player turns, then clear or let remnants flee. Intended: end turns out of LoS.  
FAILURE_CONDITION: Player death before clock + cleanup.  
REWARD: Survival table (depth × 50 Doka + 100 XP) plus kill XP only for units actually defeated. Prefer overlay `no_healing` over `no_damage_taken`.  
TACTICAL_PURPOSE: Pressure beat — a **LoS** tax, not shrinking void (ENC-SURV-03), creeping ash (ENC-SURV-05), or idle rime (ENC-SURV-15).  
SOLVABILITY_REQUIREMENTS: Hide cells exist; flee-edge tiles exist; hazard count ≤ 50; never convert the exit to a wall.  
REPLAYABILITY: Hide N vs E. Opener bishop vs spare_pacer presentation.  
SCALING_BEHAVIOUR: Mid uses only pawns in the pool. High unlocks Boot. Peak unlocks Hug. Never shorten the clock below 8.  
STATUS: PROPOSED

---

### ENC-SURV-18

ENCOUNTER_ID: ENC-SURV-18  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: `FSN-CAMP-TITHE` Post only (no tithe — the clock is the tax). Wave B overlaps at turn 3: `FSN-WALL-HUG` Hug (no pylon). Wave C at turn 6: one elite Boot. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Hug holds ≥ Chebyshev 2 from any planted leftover. Boot camps the last dry, non-ash tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-HAZ-SKIP_CINDER` line (ENC-HAZ-18) + Sight Burn hide (ENC-SURV-17). Skip if no LoS-break wall. Optional one `WF-MOD-FAR_CAST` **or** leftover `WF-MOD-CLOSE_QUARTERS` (pick one: minRange 2 vs linear maxRange −1). Never both. Never `titans_vigor`.  
SPECIAL_RULES: Overlap + skip-cinder + LoS tax is the escalation vs ENC-SURV-17. Flee remnants when the clock ends.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-17. Overlay `no_healing`.  
TACTICAL_PURPOSE: Peak pressure that spends leftover Close Quarters / Far Cast so late-game maps are not “sight burn again.”  
SOLVABILITY_REQUIREMENTS: Shelter cells exist; 4-unit occupancy leaves a walkable ring; skip-cinder never seals spawn or exit.  
REPLAYABILITY: Far Cast vs Close Quarters. Wave C Boot vs elite Dull for Null-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-ELITE-16

ENCOUNTER_ID: ENC-ELITE-16  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-WALL-HUG/E-HUG` — elite Hug + junior Pylon. Elite is not a boss: no phase table, no `BossAbility`. File Brand stays **off** this PAIR.  
AI_REQUIREMENTS: Same as ENC-HUG-01. Soph 1–3. Lethal lookahead on.  
SPELL_DISCOVERY_OPPORTUNITIES: Elite death after it used Wall Sting +10 can drop that id (once per character).  
MAP_REQUIREMENTS: Same gallery contract as ENC-HUG-01. Optional `WF-ZON-TRUE_STRIKE` leftover (linear +15%) **off** — would hide the hug +10 as “just more damage.”  
SPECIAL_RULES: Random 30% lottery off. Only one elite. If pack size would be 1, reroll (Hug must not spawn solo).  
OBJECTIVE: Defeat both. Intended line: gallery → Hug first.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Mastery of “Chebyshev-2 from *their* wall.” Consumes a real drop-9 PAIR.  
SOLVABILITY_REQUIREMENTS: Gallery reaches the Hug. Two walk-offs.  
REPLAYABILITY: `/GOLEM` pylon vs `pylon_prelate` presentation.  
SCALING_BEHAVIOUR: Promote Brand only by converting to ENC-RARE-09 (`FSN-BRAND-REEL` or `FSN-WALL-FILE`), never on this PAIR.  
STATUS: PROPOSED

---

### ENC-ELITE-17

ENCOUNTER_ID: ENC-ELITE-17  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-BOOT-STEP/E-BOOT` — elite Boot + junior Spare. `spell-sacrifice` off. `aiStrategy: "berserk"` only below 30% HP.  
AI_REQUIREMENTS: Same as ENC-BOOT-01. Until walk-spend writer is honest, do **not** ship this id — fall back to ENC-ELITE-16 or ENC-TITHE-02 `/E-POST`.  
SPELL_DISCOVERY_OPPORTUNITIES: Spare death after it used Spare Pace can drop that id.  
MAP_REQUIREMENTS: Same 3-tile approach + side step as ENC-BOOT-01.  
SPECIAL_RULES: Random 30% lottery off. Only one elite. Do not inflate elite HP beyond band knight + one Spare cycle.  
OBJECTIVE: Defeat the elite. Spare optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of “force a stand; the Boot without a step is a fat Strike.”  
SOLVABILITY_REQUIREMENTS: Engagement pocket ≥ 2 walk-off tiles. Hostiles start ≥ Chebyshev 4.  
REPLAYABILITY: `/KNIGHT` vs pawn Boot.  
SCALING_BEHAVIOUR: Add muter only by converting to `FSN-BOOT-SPARE`. Peak: Boot may berserk below 30% — still no Post on this PAIR.  
STATUS: PROPOSED

---

### ENC-PROT-09

ENCOUNTER_ID: ENC-PROT-09  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× charger pawn + 1× `ROLE-FACE` knight focusing the **root circle**.  
AI_REQUIREMENTS: All enemies prefer occupying `WF-ZON-ROOT_CIRCLE` so pushback / attract / Crosswind **do not move them**. They still shove the **player** off the ring if dest is legal. Lethal lookahead against a player standing on the ring. They do not retreat from the ring.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player held the ring for ≥ 4 player-turns, rest may offer `spell-shove-face` if missing (you felt the plant).  
MAP_REQUIREMENTS: Central root inlay (`WF-ZON-ROOT_CIRCLE`, one walkable cell). Player spawns adjacent. Enemies from the far end + one side alley. No hazard on the ring. Distinct from ENC-PROT-03 ward circle (+20% RES) and ENC-PROT-08 Long Arm.  
SPECIAL_RULES: The ring is a tile, not an allied token. Portal unlocks when hostiles are dead. The player does **not** fail if they never stand on the ring — holding it is the intended line (ignore Face shove). Optional fail-if-enemy-held-4-turns is **off**. Mirror Step / Flank Step still move a holder (teleport ≠ forced movement).  
OBJECTIVE: Clear hostiles. Intended: occupy the ring so Face cannot dump you into skip-cinder / ash.  
FAILURE_CONDITION: Player death only.  
REWARD: Protection-adjacent grant (band table) + kill XP. Overlay `direct_hit` (stay on the ring).  
TACTICAL_PURPOSE: Contest an **anti-knockback tile**. Makes occupancy the answer to ENC-WRITE-01.  
SOLVABILITY_REQUIREMENTS: Alley does not spawn on the ring. Ring not on spawn±3 or portal. If any hazard exists, it is not adjacent to the ring.  
REPLAYABILITY: Alley left/right. Face vs Boot as the third melee.  
SCALING_BEHAVIOUR: Add a second alley flanker before raising ATK. Peak: inherit skip-cinder on a **flank** (still not a fail if you refuse the tile).  
STATUS: PROPOSED

---

### ENC-PRIO-11

ENCOUNTER_ID: ENC-PRIO-11  
TYPE: priority-target / decoy-adjacent  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Heir cordon chrome (ENC-REINF-09) **plus** `FSN-DULL-PET` lite on the heir (Dull Edge on the elite, Sill on a minion). Explicit metadata `realId` = heir, `sillCell` on a minion — never name checks.  
AI_REQUIREMENTS: Screen guards the **heir**. Dull brands when the player is adjacent. If the heir dies first, minions still remain (run contract) but Sill despawns with its owner.  
SPELL_DISCOVERY_OPPORTUNITIES: Killing the heir first (the real threat) can drop `spell-dull-edge` if missing.  
MAP_REQUIREMENTS: Cordon + stall for the sill minion. Stall reachable without walking the heir post.  
SPECIAL_RULES: Portal locked until all three are dead. Distinct from ENC-PRIO-04 (decoy king) — here the loud elite **is** real; Dull makes Strike the wrong first button.  
OBJECTIVE: Defeat the heir. Minions are legal but the wrong first dump if you only Strike.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + priority bonus if the heir died before both minions. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach Table G G3’s “you must Strike” **inverse** — here Strike is 0, so frost first — then G3 flips it.  
SOLVABILITY_REQUIREMENTS: Stall reachable; sill not on the portal; screen does not seal the heir.  
REPLAYABILITY: Stall west vs east.  
SCALING_BEHAVIOUR: High: heir also has iron-skin. Peak: add `/LEASH` on a living player summon only. No HP inflation.  
STATUS: PROPOSED

---

### ENC-MOVE-16

ENCOUNTER_ID: ENC-MOVE-16  
TYPE: movement objective / timing  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× kiting bishop (`starter-frost`) on the **short** path behind a `WF-OBS-TITHE_SILL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the short path and does not walk through the sill while it is a wall. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Paying the tithe (8% max HP, no AP) and winning can offer `spell-exit-boon` (you bought a leave). Taking the long path can offer `starter-shield` (patience). One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor has Tithe Sill (wall until adjacent HP tithe). Long route already exists (placement contract: never the only exit). Far `objectiveCell` banner. Distinct from ENC-MOVE-14 Latch Sill (free adjacent end-turn) and leftover Coin Sill (1 AP, no HP).  
SPECIAL_RULES: Sill is a wall while shut (LoS + walk). Tithe via challenge HP. Enemies may wait. `holdPortalLocked` until the player occupies the banner **and** hostiles are dead.  
OBJECTIVE: Touch the banner and clear hostiles.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus Doka if the player never stood adjacent to the shut sill (committed to the long line).  
TACTICAL_PURPOSE: Teach “pay HP vs spend MP now.” Distinct from Fallen Gate (clock) and Coin Sill (AP).  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to banner **without** the sill. Sill is not a cut-vertex. Banner not on a portal. Evaluate solvability as if the sill were a wall.  
REPLAYABILITY: Sill north vs east. High: replace with leftover Coin Sill (1 AP) as a seed variant.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: one `WF-TEL-FLANK_STEP` on the long path (1 MP right-skip, dest empty).  
STATUS: PROPOSED

---

### ENC-MOVE-17

ENCOUNTER_ID: ENC-MOVE-17  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× kiting bishops (`starter-frost` + `spell-slow` at band 1). 0 melee on entry.  
AI_REQUIREMENTS: Bishops hold the far third. They do not stand on Flank Step dests.  
SPELL_DISCOVERY_OPPORTUNITIES: Using `WF-TEL-FLANK_STEP` at least once and winning can offer `spell-knight-slip` if missing (the inlay is the teacher; Slip is the (2,1) cousin).  
MAP_REQUIREMENTS: Skip-cinder line from ENC-HAZ-18 on the short corridor. Always-open long path. One `WF-TEL-FLANK_STEP` whose dest skips the next hop cell if dest is legal. Far banner `objectiveCell`.  
SPECIAL_RULES: Player must occupy the banner at least once (`touchedObjective`). Flank dest must be free, non-hazard, non-portal, with two walk-offs. Illegal dest = no step, spend nothing. Distinct from ENC-MOVE-05 Slipstream (A→B pad) and leftover Backstep (opposite facing).  
OBJECTIVE: Tag the banner and clear the bishops.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine skip-cinder timing with a facing-relative sidestep so MP is a third option (wait / walk long / flank).  
SOLVABILITY_REQUIREMENTS: Long path works with the cinder permanently on the short line. Inlay and dest reachable floor, not spawn/portals.  
REPLAYABILITY: Line H vs V. Flank inlay on spawn-side vs mid.  
SCALING_BEHAVIOUR: Add a third bishop or poison, not a second cinder. Peak: dest sits adjacent to lectern ash (choice of pain if you then cast).  
STATUS: PROPOSED

---

### ENC-CORNER-01

ENCOUNTER_ID: ENC-CORNER-01  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Leftover `FSN-CORNER-FOG` — `ROLE-CORNER` bishop (proposed `corner_bishop`, blocked-LoS poke) + fog/smoke junior **or** a pylon third. No second gun (`glass_sniper` / `far_stinger`) as PAIR.  
AI_REQUIREMENTS: Corner skips unless LoS to the player is blocked (world wall, crate, tilt screen, pylon). Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Winning from a blocked angle can drop a sibling blind-corner id if that catalog lands; else complete frost.  
MAP_REQUIREMENTS: Courtyard + one `WF-TER-TILT_SCREEN` (starts walk-block / LoS open; 1 AP tilt to walkable / LoS-block). Gallery required. Distinct from ENC-HUG-01 (hug *planted* barrier, LoS open).  
SPECIAL_RULES: Random 30% lottery off. Tilt Screen must not be a cut-vertex in the starting state. Do not treat the screen as `barrierTiles` for Hug.  
OBJECTIVE: Defeat both. Intended: smash or bypass the screen so Corner’s poke fizzles, then dump.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Spend leftover drop-8 Corner Fog as a room that uses wave-9 Tilt Screen. Blind poke ≠ hug poke.  
SOLVABILITY_REQUIREMENTS: Bypass exists with the screen intact. Two walk-offs.  
REPLAYABILITY: Screen N vs E. Crate leftover vs Tilt Screen.  
SCALING_BEHAVIOUR: Peak: add leftover `FSN-VEIL-CORNER` (veil cantor) only if ENC-RARE-08 was not this chain. Still one elite tag.  
STATUS: PROPOSED

---

### ENC-PLUG-01

ENCOUNTER_ID: ENC-PLUG-01  
TYPE: formation / occupancy  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Leftover `FSN-TWIN-PLUG` — `ROLE-TWIN` (two 1-HP posts, fills `ENEMY_SUMMON_CAP`) + a junior sniper/frost bishop. **Not** `FSN-TRIPLE-PLUG` (needs remaining cap ≥ 3).  
AI_REQUIREMENTS: Twin is `isSummoner` for twin-span only; posts empty kit; Strike illegal on posts. Sniper holds Chebyshev ≥ 3. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Collapsing a post can complete span observation if ENC-SPAN-01 was skipped.  
MAP_REQUIREMENTS: 2-wide file + gallery. Closet with no 2-line → **reroll**. Posts are not `countsTowardKillRewards`.  
SPECIAL_RULES: Hold Triple Plug. Distinct from ENC-SPAN-01 (two-cell plug on one id) — here two summons **are** the plug. Portal locked until posts and sniper are gone.  
OBJECTIVE: Defeat the sniper; kill one post to break the chain.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Cap-2 occupancy exam. Prepares Table G G1 punched-lane hinge without minting three posts.  
SOLVABILITY_REQUIREMENTS: Gallery reaches the sniper. Posts never occupy both gallery and the only aisle.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Do not raise cap. Peak: sniper is elite still without a third post.  
STATUS: PROPOSED

---

### ENC-NEAR-01

ENCOUNTER_ID: ENC-NEAR-01  
TYPE: elite / optional challenge  
RELATIVE_DIFFICULTY: HIGH (opt-in in exploration; required in a run)  
ENEMY_COMPOSITION: 1× `WF-ELT-NEAR_PICKET` elite (`spell-iron-skin` + Strike). Present only while a player is within 3 Chebyshev. Farther away the post is empty floor. Distinct from leftover Odd Picket (round parity) and Even Picket (ENC-PICKET-01).  
AI_REQUIREMENTS: Stationary on the post while present. Then charger. Absence while far is not a wall and not a kill.  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Painted post + 3-tile ring. Exit reachable without entering the ring. Place only when a second spawn→portal route exists.  
SPECIAL_RULES: Exploration: stay far and leave, or step in. Dungeon-chain: must approach — they are required for map-clear. Portal locked while the picket lives in a run.  
OBJECTIVE: In a run: defeat the picket. In exploration: pass by fight or stay outside 3.  
FAILURE_CONDITION: Player death after committing to the fight. Far leave is success-with-less.  
REWARD: Hard-band Doka on a fight win. Far leave: 0 extra.  
TACTICAL_PURPOSE: “Stay far or step in” as a room, not a random overworld overlay. Inverse of Leash Warden (always on-board).  
SOLVABILITY_REQUIREMENTS: Long path works with the picket treated as absent (far). Post not on the only portal.  
REPLAYABILITY: Post rook vs knight.  
SCALING_BEHAVIOUR: Peak: picket is `FSN-WALL-HUG` Hug (pylon sits behind on the short path) — still one elite tag.  
STATUS: PROPOSED

---

### ENC-OATH-02

ENCOUNTER_ID: ENC-OATH-02  
TYPE: treasure / risk / optional challenge  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. `WF-RSK-STRIDE_OATH` inlay. Optional: flag then fight `FSN-BOOT-STEP` so the next credit happens after a walk. Distinct from ENC-OATH-01 (stillness wager) and leftover Bond Oath (keep-a-summon).  
AI_REQUIREMENTS: Boot pack uses ENC-BOOT-01 contracts if the player starts the fight.  
SPELL_DISCOVERY_OPPORTUNITIES: Preview shown before combat.  
MAP_REQUIREMENTS: Oath inlay + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** leave after flagging without a fight (flag does nothing if they never walked).  
SPECIAL_RULES: End a turn on the inlay to flag. If the next `applyRewards` happens after ≥ 1 MP spent since the flag, that credit uses the hard multiplier. Attack Nearest / AP spells / summons do not arm it. Teleport tiles do. Losing the fight is a normal death.  
OBJECTIVE: Resolve the wager **or** take the coward exit. Fight commit must be won.  
FAILURE_CONDITION: Player death after fight commit. Coward / unarmed flag is success-with-less.  
REWARD: Hard multiplier on the next credit if armed; else standard/none. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat: wager that you **will walk**. Inverse of Stillness Oath.  
SOLVABILITY_REQUIREMENTS: Inlay and coward exit reachable on entry. After fight commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Boot pack vs Hug pack.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack with `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SCRIBE-01

ENCOUNTER_ID: ENC-SCRIBE-01  
TYPE: spell-discovery / elite-adjacent  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `WF-SPL-GRAVE_SCRIBE` same-tier enemy (medium threat) carrying 1 extra `usableByEnemy` spell from {`spell-wall-sting`, `spell-boot-sting`, `spell-shove-face`, `spell-dull-edge`} not yet owned. On death the id is written onto the death tile as a one-cast glyph.  
AI_REQUIREMENTS: Generic kit plus the extra id. Does not camp the glyph tile after death (they are dead).  
SPELL_DISCOVERY_OPPORTUNITIES: Adjacent 1 AP picks the glyph as a **single remaining cast** this map. Leaving without pickup loses it. Killing does **not** auto-grant and does not call `upgradeSpell`. Distinct from ENC-PAGE-01 (queued day-8 page thief) and Grimoire Stalker (auto one-cast).  
MAP_REQUIREMENTS: Single room. Death floor cell must remain floor (not a portal). Prefer replacing one existing spawn.  
SPECIAL_RULES: Glyph occupies the death cell. Discovery into the owned set still follows use → observe → win if they pickup-and-cast and then win; pickup alone is this-map-only.  
OBJECTIVE: Defeat the scribe; optional: spend 1 AP on the glyph and use it.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + optional this-map cast. If they used the glyph and won, the id may enter the owned set via the sibling pipeline.  
TACTICAL_PURPOSE: Observation that is a **floor glyph**, not a shrine grant.  
SOLVABILITY_REQUIREMENTS: Scribe reachable; glyph cell not a wall.  
REPLAYABILITY: Which missing id they carry.  
SCALING_BEHAVIOUR: Does not scale; it retires when all four ids are owned (becomes ENC-ELITE-16).  
STATUS: PROPOSED

---

### ENC-RARE-09

ENCOUNTER_ID: ENC-RARE-09  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-HOOD-CHOIR` (tick skip + ignite + absolve) **or**, if the account has not answered ENC-HUG-01, `FSN-BRAND-REEL` (brand + reel + hug-gun) **or** `FSN-WICK-FACE` (wick + shove-face + fuse). Rare elite tag on the choirmaster / brander / wicker only (`variant: rare_elite`). Hold `FSN-TRIPLE-PLUG`.  
AI_REQUIREMENTS: CADRE contracts. `escapeRoute` on the rare elite. `instantKill` / `betrayal` off. Lethal lookahead on. Fuse **never** paints the martyr tile if WICK-FACE is used. Hood: lava/spikes are **not** DoT ticks.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-tick-hood`, `spell-file-brand`, `spell-pit-wick`, `spell-flank-share`} not yet owned.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with two files. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-09 by default. Purple portal chrome only after clear. No Glass Realm on Hood/Wick sheets.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes a CADRE the primer already taught.  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket; wick/fuse dests legal if used.  
REPLAYABILITY: HOOD-CHOIR vs BRAND-REEL vs WICK-FACE by which PAIR the account answered.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale support kit, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-09

ENCOUNTER_ID: ENC-TREAS-09  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Three **devices**, not three chests (distinct from ENC-TREAS-02 / ENC-TREAS-08):

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-STRIDE_CACHE` | 1 AP adjacent only if the opener spent ≥ 1 MP this turn: medium Doka. Else 5% max-HP tax, chest stays (retry). Inverse of Trip Cache. | Medium `applyRewards` **or** tax |
| Leftover `WF-TRS-WOUND_CACHE` | Open only below 50% current HP: hard Doka, no guardian. | Hard purse **or** leave |
| Far-cast seal | Turns on `WF-MOD-FAR_CAST` (spells with `minRange` below 2 treated as 2) and spawns `FSN-WALL-HUG` | Depth Doka ×1.75 + Wall Sting observation |

AI_REQUIREMENTS: Far-cast pack uses WALL-HUG contracts.  
SPELL_DISCOVERY_OPPORTUNITIES: Far-cast preview is always shown before combat.  
MAP_REQUIREMENTS: Three device tiles + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** stride-cache-only leave after the chest resolves.  
SPECIAL_RULES: Touching Far-cast seal locks the coward exit and the other devices. Stride cache can be used without locking the coward exit. Wound cache can be used without combat. Losing Far-cast is a normal death. Jackpot numbers stay inside `applyRewards`. Attack Nearest remains legal under Far Cast.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Far-cast commit must be won.  
FAILURE_CONDITION: Player death after Far-cast commit. Coward / stride-miss / wound-skip is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **three different prices** (walk-then-open, HP-floor chest, adjacency-cast ban). Distinct from ENC-TREAS-08 watch/steel devices.  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. After Far-cast commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Device positions rotate. Far-cast pack WALL-HUG vs BOOT-STEP.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack Far Cast with `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REST-09

ENCOUNTER_ID: ENC-REST-09  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional stride oath / wane shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-10 / ENC-HUG-01 / ENC-BOOT-01 observed Wall Sting / Boot Sting, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-GRAVE_SCRIBE` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-09. Optional `WF-RSK-STRIDE_OATH` tile (flag next room only). Optional leftover `WF-PRT-HEARTH_GATE` **or** `WF-PRT-WANE_GATE` as overworld chrome only (both forbidden in dungeon / rush / Death Realm). Optional `WF-EVT-LONG_WATCH` (round-4+ hard credit) as a rest-exit flag for the next fight.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Oath does not start combat. `uiLayout` unchanged. After one full Table F clear, shrine can enable day-9 `rushVariant` flags (`table_g0` … `table_g3`).  
OBJECTIVE: Choose an exit. Optional: shrine, oath, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Oath is a modifier flag, not a Doka mint.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Hug-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Oath not on spawn or a portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Long Watch on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-09

ENCOUNTER_ID: ENC-BRANCH-09  
TYPE: branching paths  
RELATIVE_DIFFICULTY: LOW (the choice is the content)  
ENEMY_COMPOSITION: None on the foyer.  
AI_REQUIREMENTS: None in-foyer.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four portals: Hug (planted barrier / WALL-HUG → ENC-HUG-01 or ENC-ELITE-16), Boot (walked poke / BOOT-STEP → ENC-TEACH-09 or ENC-BOOT-01), Write (shove-face / FACE-WRITE → ENC-SPELL-18 or ENC-WRITE-01), Dull (Strike 0 / DULL-PET → ENC-DULL-01 or ENC-PRIO-11). A sealed fifth door to ENC-RARE-09 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: hug | boot | write | dull` on the dungeon snapshot (**before** `cleanupMap`). Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-09 / ENC-BOSS-09). Day-8 `ENC-BRANCH-08` stays Face/Mute/Span/Brand. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Gaze / Span Chamberlain / Cover / Lintel.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Slip door (ENC-SLIP-01) can replace Write for accounts that already finished Write this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band.  
STATUS: PROPOSED

---

### ENC-MINI-10

ENCOUNTER_ID: ENC-MINI-10  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Hug Lieutenant — rook chassis, kit from `ROLE-HUG` **plus** one Strike (so it is not a pure glass gun): `starter-frost` + `spell-wall-sting` (if barrier plant exists) + `physical_attack`. 1× pylon choir. Not in `BOSS_IDS`. No phase-2 table.  
AI_REQUIREMENTS: Lieutenant Stings only if the player hugs the planted cell; else Frost / Strike. Choir plants then steps off. If the lieutenant would die, it tries one Frost (priority).  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-wall-sting` drop (once) if used.  
MAP_REQUIREMENTS: Small nave + one gallery. No lava on the plant cell. No `titans_vigor`.  
SPECIAL_RULES: At 30% HP the lieutenant gains **one** extra Sting cycle only if the chain taught WALL-HUG (ENC-WAVE-10 / ENC-HUG-01). Otherwise it only Frosts. Honest to pacing.  
OBJECTIVE: Defeat the lieutenant (choir flees on death).  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss 2× XP on the lieutenant + depth Doka. Not a Boss Rush room.  
TACTICAL_PURPOSE: Hug-branch capstone-adjacent without `toll_ostiary`’s tithe state machine.  
SOLVABILITY_REQUIREMENTS: Gallery connected to the nave.  
REPLAYABILITY: Choir spare_pacer if Boot was taken; glance if Write; sill if Dull.  
SCALING_BEHAVIOUR: Add a second choir body before any HP bump. Peak: lieutenant kit adds `spell-file-brand` (still no Inferno).  
STATUS: PROPOSED

---

### ENC-BOSS-09

ENCOUNTER_ID: ENC-BOSS-09  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Hug → `alabaster_fortress` (geometry / walls); Boot → `bone_cavalier` (charge after a walk); Write → `mirror_sovereign` (facing / displacement); Dull → `broodmother_rook` (pets vs sill). If the chain taught decoy (ENC-PRIO-04) **and** Hug was not taken, mixed accounts may use `eternal_pawn_king` **alone** (not a Rush pair). No dual-boss unless this is a Rush injection. Do **not** spawn `toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean` here.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-10) or slip-pit (ENC-SLIP-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Hug may add 1 planted-lookalike crate off the only path (not `barrierTiles`); Boot may inherit 2 bog-silt tiles on a flank; Write may inherit a root circle (optional plant); Dull may inherit a wide courtyard (no sealed larva pocket).  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (walls / charge / mirrors / brood).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-09

ENCOUNTER_ID: ENC-MAST-09  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on lectern ash (`WF-HAZ-LECTERN_ASH`). Wave 2: `FSN-WALL-HUG` **or** `FSN-BOOT-STEP` **or** `FSN-FACE-WRITE` **or** `FSN-DULL-PET` by `branch`. Wave 3: elite leftover (E-HUG **or** E-BOOT **or** E-FACE **or** E-DULL) + leftover.  
AI_REQUIREMENTS: Full sophistication allowed (lethal lookahead, overkill spill, LoS reposition, backline guard). Wave 3 elite camps the safest dry, non-ash, in-LoS-hide tile.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines lectern ash (TEACH-09), skip-cinder (HAZ-18), and a central root circle (PROT-09) that is **optional** — occupying it at end of player turn ignores Face shove / Crosswind for the next enemy phase. Scripted hazards only. Branch skins: Hug keeps a gallery; Boot keeps a 3-tile approach; Write keeps dest walk-offs; Dull keeps a sill that is not the only aisle. Sight Burn **off** here (that is ENC-SURV-17).  
SPECIAL_RULES: Portal locked until wave 3 clear.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove the player can refuse ash-casts, skip the cinder, and optionally plant on the root.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one dry path; ring not on a portal.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role** (hug vs boot vs face vs dull), not its level.  
STATUS: PROPOSED

---

### ENC-RUSH-31

ENCOUNTER_ID: ENC-RUSH-31  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table G `G0`: `toll_ostiary` + `cinder_lance`. Combined mechanic: “Charge the glowing window **or** stay on the tithe and poke.” Plus ENC-TITHE-02 aisle chrome (one Exit Tithe cell highlighted, not a new boss). Tithe cells **never** occupy a telegraphed lance tile.  
AI_REQUIREMENTS: Existing combined mechanic. Stoop and Brazier are both objects. Trash does not receive lance heals.  
SPELL_DISCOVERY_OPPORTUNITIES: None (Rush is a mastery product).  
MAP_REQUIREMENTS: Current Rush preferred-cell solvability. Tithe aisle ⊆ reachable floor, not a preferred boss cell, not a lance glow tile.  
SPECIAL_RULES: `rushVariant: table_g0`. Persist still goes through `persistBossRushRoomClear` / `completeBossRushRoom` (client `dokaReward`/`xpReward` ignored). First Table G clear: no aisle chrome. Later clears: ENC-TITHE-02 highlight. Hold if Exit Tithe or lance objects are missing.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death → abort rush (`resetRunState`).  
REWARD: Table G G0 table + tiny bonus if the player never dumped a 5-AP spell from the tithe cell (skill, via `applyRewards`).  
TACTICAL_PURPOSE: Escalate G0 by teaching the stand-gun / leave-tax verb in the dungeon, then lighting the aisle — not more HP.  
SOLVABILITY_REQUIREMENTS: Preferred cells + aisle reachable. Hazard total ≤ 50. Tithe never on lance glow.  
REPLAYABILITY: Aisle W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Later “endless rush” at ENC-REST-09 may add the ENC-TITHE-02 Post (cap 1), never a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-32

ENCOUNTER_ID: ENC-RUSH-32  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table G `G1`: `hinge_precentor` + `ivory_palisade`. Combined mechanic: “Enter-swap across the punched lane, not into a sealed pocket.” Plus ENC-PLUG-01 gallery chrome (one 2-wide file in the reachable set). Hinge **never** paints a sealed pocket. Swap landing must stay on a punched lane (`finalizePlayableLayout` after swap).  
AI_REQUIREMENTS: Existing combined mechanic. Peg and stakes are both objects. Gallery is not a boss.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: 2-wide file + gallery in the reachable set. Preferred cells free.  
SPECIAL_RULES: `rushVariant: table_g1`. Hold if Hinge Tile or palisade objects are missing. Do not pair with Fortress (two shrinks).  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table G G1 table + tiny bonus if the player never swapped into a would-be pocket (skill).  
TACTICAL_PURPOSE: Add the occupancy / punched-lane verb the Hug primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + gallery reachable. Hinge never into a sealed pocket.  
REPLAYABILITY: Gallery N vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by palisade iron-skin, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-33

ENCOUNTER_ID: ENC-RUSH-33  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table G `G2`: `veil_verger` + `wick_prelate`. Combined mechanic: “You cannot *name* him; douse the wicks with AoE / Strike.” Plus ENC-DULL-01 sill chrome (one Pet Sill cell — player body walks, summons cannot park). Fuses **never** paint the veiled tile.  
AI_REQUIREMENTS: Existing combined mechanic. Snuffer and Cowl are both objects. Shared extra: bomber only (cap 4 living including summons). Wisp is not a fuse gate.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Sill ⊆ reachable floor, not a fuse wick, not the cowl tile.  
SPECIAL_RULES: `rushVariant: table_g2`. Choir is not a boss. Hold if Aim Veil or wick objects are missing. First Table G clear: no Sill chrome. Later clears: Sill cycle. Player Aim Veil cannot reject Attack Nearest.  
OBJECTIVE: Defeat both bosses; Sill optional.  
FAILURE_CONDITION: Player death.  
REWARD: Table G G2 table + tiny bonus if the player never parked a summon on the sill.  
TACTICAL_PURPOSE: Add the anti-park / cannot-name verb to a veil/wick pair.  
SOLVABILITY_REQUIREMENTS: Preferred cells + sill reachable. Fuses not on the veiled tile.  
REPLAYABILITY: Sill N vs S of center.  
SCALING_BEHAVIOUR: Do not add a third boss. Sill uptime is the scaler.  
STATUS: PROPOSED

---

### ENC-RUSH-34

ENCOUNTER_ID: ENC-RUSH-34  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table G `G3`: `oath_dean` + `ram_castellan`. Combined mechanic: “You must Strike; he shoves you **off** melee.” Plus ENC-WRITE-01 dest chrome (one painted shove dest with a walk-off). Brand telegraph **never** occupies the ram ray. After a slam, a legal Strike tile must still exist (`finalizePlayableLayout`).  
AI_REQUIREMENTS: Existing combined mechanic. Brace and Paten are both objects. Face-shove chrome is not a boss.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Painted dest ⊆ reachable floor, not the ram ray, not the brand telegraph.  
SPECIAL_RULES: `rushVariant: table_g3`. Dest is not a boss. Hold if Oath Blade or ram objects are missing. Player Oath Blade cannot last 2 turns. Distinct from ENC-RUSH-30 (stay still / crawl) — here Strike is **required** after being shoved.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table G G3 table + tiny bonus if the player stepped back onto a legal Strike tile after every slam (skill).  
TACTICAL_PURPOSE: Add the shove-write / must-Strike verb the Write branch taught.  
SOLVABILITY_REQUIREMENTS: Preferred cells + dest reachable. Brand telegraph never on the ram ray. A Strike tile remains after slam.  
REPLAYABILITY: Dest W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Shove uptime, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain I — “Hug Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-09 then ENC-SPELL-17 (or ENC-TITHE-02 if boot writer missing) |
| 2 | Reinforce | ENC-WAVE-10 |
| 3 | Combine | ENC-HAZ-17 then ENC-HUG-01 **or** ENC-BOOT-01 **or** ENC-WRITE-01 **or** ENC-DULL-01 |
| 3 insert | Choice | ENC-BRANCH-09 → Hug/Boot/Write/Dull destinations |
| 4 | Pressure | ENC-SURV-17 **or** ENC-PROT-09 **or** ENC-SLIP-01 **or** skip via ENC-REST-09 |
| 4 | Mastery | ENC-MAST-09 (branch skin) |
| 5 | Boss | ENC-BOSS-09 |

Rare: 8% on depth 4 to **insert** ENC-RARE-09 before mastery.  
Treasure: rest may offer ENC-TREAS-09 instead of PROT-09.  
Corner side-story: replace combine with ENC-CORNER-01 and mini-boss ENC-MINI-10; capstone may become `alabaster_fortress` if Hug was the door.

### Chain J — “Sill Primer” (maxDepth 4)

ENC-MOVE-16 → ENC-MOVE-17 → ENC-NEAR-01 → ENC-REST-09 → ENC-BOSS-09 (`broodmother_rook` only if Dull was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-16 as teach on accounts that already know lectern/hug.

### Rush injection (day-9)

After one full Table F clear, ENC-REST-09 shrine can enable: G0 → ENC-RUSH-31, G1 → ENC-RUSH-32, G2 → ENC-RUSH-33, G3 → ENC-RUSH-34. Days 1–8 flags for rooms 0–9 and Tables B–F remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-09, ENC-SPELL-17, ENC-SPELL-18, ENC-SCRIBE-01 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-17, ENC-HAZ-18, ENC-MOVE-16, ENC-MOVE-17, ENC-SLIP-01 | `under_50_damage` |
| ENC-WAVE-10 | `under_10_turns` |
| ENC-PROT-09, ENC-MAST-09 | `direct_hit` |
| ENC-ELITE-16, ENC-ELITE-17, ENC-HUG-01, ENC-BOOT-01, ENC-WRITE-01, ENC-CRACK-01, ENC-TITHE-02 | `under_8_ap_per_turn` |
| ENC-SURV-17, ENC-SURV-18 | `no_healing` (not `no_damage_taken`) |
| ENC-DULL-01, ENC-SHARE-01, ENC-PRIO-11, ENC-PLUG-01, ENC-CORNER-01 | `under_15_turns` |
| ENC-TREAS-09 / ENC-REST-09 / ENC-OATH-02 / ENC-NEAR-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | lectern ash **or** painted stand-gun | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | ash **or** silt **or** camp plate | kill + optional glyph |
| MID | named drop-8/9 `FSN-*` or waves | backline guard | zone 1 + Hug/Boot/Write | one `WF-*` | clock / tags / tithe sill |
| HIGH | elite or cordon | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / slip / dull |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table G |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit ash, open a second gallery, enable Boot +10) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure from older catalogs, not this primer.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose prior-day fields plus:

```
encounterId
encounterType        // + hug_wall | boot_walk | face_write | dull_sill
                     //   | slip_wick | crack_verse | flank_share | camp_tithe
                     //   | corner_fog | twin_plug | near_picket | stride_oath
                     //   | grave_scribe | lectern_ash | skip_cinder | sight_burn
formationId?         // FSN-WALL-HUG | FSN-BOOT-STEP | FSN-FACE-WRITE |
                     // FSN-DULL-PET | FSN-SLIP-PIT | FSN-CRACK-VERSE |
                     // FSN-SHARE-GOAD | FSN-WALL-FILE | FSN-BOOT-SPARE |
                     // FSN-FACE-GLANCE | FSN-BOON-BOOT | FSN-PIVOT-WICK |
                     // FSN-HOOD-CHOIR | FSN-WICK-FACE | FSN-BRAND-REEL |
                     // FSN-CAMP-TITHE | FSN-CORNER-FOG | FSN-TWIN-PLUG
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize (wave 8 leftover + wave 9)
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // hug | boot | write | dull
barrierTiles[]?      // ENC-HUG-01 planted mason cell (not world walls)
walkMpSpentThisTurn? // ENC-BOOT-01 honesty
shoveDest?           // ENC-WRITE-01
sillCell?            // ENC-DULL-01
spanCells[]?         // ENC-PLUG-01 twin posts
holdPortalLocked?
objectiveKind        // + occupy_root | pay_tithe_sill | flank_step
                     //   | near_picket | stride_cache | steal_grave
failureKind
deviceTable[]        // ENC-TREAS-09
rushVariant?         // table_g0 | table_g1 | table_g2 | table_g3
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Toll Ostiary” logic — use `formationId` / `realId` / `barrierTiles[]` / `sillCell`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-25 IDs (including queued PRs #347 / #396 / #479 / #519 / #574).
- Touching `docs/WORLD_DYNAMICS.md`, `worldFeatures.ts`, formation PDFs, or `BOSS_AND_SPELL_DISCOVERY.md` in this change (those files are already on older open PRs).
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush / Table G only).
- Adding Wave-9 `toll_ostiary` / `hinge_precentor` / `veil_verger` / `oath_dean` to live `BOSS_IDS` in the same PR as a room remap.
- Consuming same-day Wave 8 *spell* proposals (PR #563) as required engines — no family sheets yet.
- Spawning `FSN-TRIPLE-PLUG` while live `ENEMY_SUMMON_CAP` is 2.
- Faking Hug +10 off world walls, Boot +10 off Slip/shove, Face rewrite off a 0-slide, Dull without a Strike-0 writer, Twin Plug without two-cell occupancy.

---

## 10. Pick order (day-9, after days 1–8 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 through day-8 pick orders still win if those verbs are missing (see those files / PRs).

Once those exist, implementers should pick:

1. ENC-TEACH-09 + ENC-SPELL-17 (lectern ash / boot-walk verbs)  
2. ENC-WAVE-10 (`formationId` CAMP-TITHE → WALL-HUG, with honesty fallbacks)  
3. ENC-HUG-01 or ENC-BOOT-01 or ENC-WRITE-01 or ENC-DULL-01 (new pressure objects)  
4. ENC-BRANCH-09 (`branch: hug|boot|write|dull` snapshot-before-cleanup)  
5. ENC-BOSS-09 branch read  
6. Rush Table G variants 31–34 one room at a time (after the account has one full Table F clear)

Uniqueness: this file is the **ninth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
