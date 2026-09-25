# Encounter Evolution Catalog — 2026-09-25

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-25-001`.  
Parent catalogs (on `main`): [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`), [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`), [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`).  
Queued sibling catalogs (open PRs, **do not reuse those IDs**): `ENCOUNTER_EVOLUTION_2026-09-21.md` (`EED-2026-09-21-001`, PR #347), `ENCOUNTER_EVOLUTION_2026-09-22.md` (`EED-2026-09-22-001`, PR #396), `ENCOUNTER_EVOLUTION_2026-09-23.md` (`EED-2026-09-23-001`, PR #479), `ENCOUNTER_EVOLUTION_2026-09-24.md` (`EED-2026-09-24-001`, PR #519). This file only adds new rooms.

Grounding: `main` @ `0f5363f` plus sibling design already queued — drop-7 formations `docs/design/ENEMY_FORMATIONS_2026-09-24.md` (PR #537), Wave 7 families `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-24.md` (PR #535), Wave 7 spells `docs/automation/SPELL_PROPOSALS_2026-09-24.md` (PR #525), Wave 7 world features `docs/WORLD_DYNAMICS.md` (PR #503, `WDD-2026-09-24-001`), Rush Table F `docs/design/BOSS_AND_SPELL_DISCOVERY.md` §10.5 (PR #518). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS`, 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`.

Same-day siblings (Wave 8 elite PR #558, Wave 8 spell PR #563) are **not** consumed here — they are another day's primer. Do not steal their ids.

---

## 1. Why an eighth day

Days 1–3 on `main` taught Ash / Ice / Void / Hex. Queued days 4–7 taught Tide/File/Clock, Wick/Rime/Smoke/Plus, Ley/Fan/Pit/Font, and Gale/Twin/Pincer. After those rooms exist, high-level play is still “the same shape” unless the **question** changes again.

Gaps this file fills (still unused as scripted rooms even after the queued catalogs):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-7 formations | `FSN-FACE-PIN`, `FSN-MUTE-PIT`, `FSN-SPAN-GUN`, `FSN-BRAND-MEND`, `FSN-VAULT-ORIGIN`, `FSN-ACT-GIFT`, `FSN-FACE-COURT`, `FSN-GAIT-SNARE`, `FSN-PIN-PIT`, `FSN-CADENCE-MUTE`, `FSN-VAULT-FILE`, `FSN-SPAN-GATE`, `FSN-SPAN-PLUG`, `FSN-BRAND-COVER`, `FSN-LINTEL-COUP`, `FSN-FACE-SPAN` are PDFs, not rooms |
| Wave 7 families | `post_stinger`, `purse_scribe`, `corner_bishop`, `hinge_squire`, `file_reeler`, `twin_span`, `veil_cantor`, `cadence_breaker`, `cadence_lender`, `purse_splitter`, `tithe_mason`, `hinge_mason`, `spark_chanter`, `cap_warder` have packs (Post Tithe, Purse Court, Twin Plug, …) but no dungeon beat |
| Wave 7 spells | `spell-wall-sting`, `spell-file-brand`, `spell-boot-sting`, `spell-shove-face`, `spell-knight-slip`, `spell-pivot-foe`, `spell-triple-span`, `spell-cadence-crack`, `spell-must-pace`, `spell-once-verse`, `spell-tick-hood`, `spell-flank-share`, `spell-spare-pace`, `spell-pit-wick`, `spell-exit-boon`, `spell-court-shove` |
| World-feature wave 7 | `WF-HAZ-RIME_HEEL`, `WF-HAZ-WINDROW`, `WF-TRP-IDLE_PIN`, `WF-TER-WATTLE_HURDLE`, `WF-OBS-LATCH_SILL`, `WF-ZON-LONG_ARM`, `WF-TEL-FILE_SLIDE`, `WF-PRT-ASH_GATE`, `WF-INV-QUIET_CAMP`, `WF-ELT-EVEN_PICKET`, `WF-TRS-WATCH_CACHE`, `WF-SPL-PAGE_THIEF`, `WF-RSK-SOLO_OATH`, `WF-MOD-LONG_SHADOW`, `WF-EVT-STEEL_HOUR`, `WF-ENV-CRAMPED_STONE` |
| Rush Table F | `F0`–`F3` (`gaze_beadle`+`hook_regent`, `span_chamberlain`+`ram_castellan`, `cover_hospitaller`+`wick_prelate`, `lintel_sacrist`+`stride_censor`) have no taught dungeon verb |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `currentView` / `spanCells[]` / `brandTargetId`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer.
- `inferArchetype` still treats any `healAmount > 0` as healer. Buffers / pin cantors / brand plates must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- `WF-PRT-ASH_GATE` is rest / overworld only (with Latch / Wager / Pact / Twilight). Forbidden in dungeon, boss rush, and Death Realm.
- Live 19 `BOSS_IDS` remain dungeon capstone fallbacks. Do not add Wave-8 ids (`gaze_beadle`, …) in the same PR as a Rush remap.

Honesty rerolls (do not fake the verb):

| Room | Missing engine | Fallback |
| :--- | :--- | :--- |
| ENC-FACE-01 / ENC-TEACH-08 | battle-walk `currentView` writer | Convert to ENC-PINCH-01 (queued day-7) or ENC-WAVE-01 pawn drill |
| ENC-MUTE-01 | walk-debit actually arms next-spell fizzle | Frost + Slow only; do not claim Mute |
| ENC-SPAN-01 | occupancy can mark a second cell on one id | Convert to ENC-ELITE-05 / `FSN-GLASS-WARD` (1-cell door) |
| ENC-BRAND-01 | next-hit +1 CD writer; ally Shield `targetId` | `/SOLO` self-mend Cantor; Brand skipped |
| ENC-VAULT-01 | File Vault two-step + origin tax reader | Convert to ENC-REINF-03 kennel |
| ENC-ACT-01 | turn-start 14 flag (not RAF) | Convert to ENC-BELL-01 (queued day-4) |
| ENC-RUSH-27…30 | Table F bosses + pin/span/cover/lintel objects | Hold the variant; first Rush clear still uses live rooms 0–9 |

---

## 3. Dungeon pacing (Face primer + inserts)

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

| Beat | Depth hint | Job | Day-8 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (face pip, idle tax, two-cell plug) | ENC-TEACH-08, ENC-SPELL-15, ENC-HAZ-15 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-09, ENC-AMBUSH-08 |
| Combine | 2–3 | Two taught verbs | ENC-FACE-01, ENC-MUTE-01, ENC-SPAN-01, ENC-HAZ-16, ENC-MOVE-14 |
| Pressure | 3 | Clock, camp, picket, or cramped stone | ENC-SURV-15, ENC-PROT-08, ENC-CAMP-01, ENC-ACT-01, ENC-PRIO-10 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-08, ENC-BRANCH-08, ENC-TREAS-08, ENC-SOLO-01, ENC-PICKET-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-14, ENC-ELITE-15, ENC-RARE-08, ENC-MAST-08, ENC-BRAND-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-09, ENC-BOSS-08, ENC-RUSH-27…30 |

Days 1–7 chains remain valid. Day-8 **Face primer** is the default for accounts that already cleared Gale / Twin / Pincer once (queued ENC-BRANCH-07). Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-08

ENCOUNTER_ID: ENC-TEACH-08  
TYPE: teach mechanic / facing  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× knight (`physical_attack` only) + 1× bishop (`starter-frost` only). No elites, no families. Until `currentView` exists, the knight is a greedy charger and the bishop kites — **do not** advertise a facing pip.  
AI_REQUIREMENTS: Knight commits only when it can reach this turn. Bishop kites at Chebyshev ≥ 3. No LoS puzzle, no group-tactics, no lethal lookahead. No Oncoming (+10) until the writer is live.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a facing / approach lesson.  
MAP_REQUIREMENTS: Open court, one painted **front wedge** tile between spawn and the knight (the cell the knight wants). Modifier off. No lava/ice/spikes. Player spawn opposite the bishop. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. When `currentView` is live, a teach line logs the first time the player ends a turn facing the knight. Do not also apply `WF-MOD-LONG_SHADOW` (would hide “walk closer”).  
OBJECTIVE: Defeat both. Optional: end a turn not facing the knight.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the wedge in front of the charger is the cash cell; looking at him is the tax.” Prepares ENC-FACE-01 / `FSN-FACE-PIN`.  
SOLVABILITY_REQUIREMENTS: Both hostiles reachable by walking; a side step so the player can turn off the wedge. Wedge is floor, not a portal.  
REPLAYABILITY: Wedge north vs east. Knight can sit on pawn chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: convert to ENC-FACE-01 (Pin + Oncoming). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-15

ENCOUNTER_ID: ENC-HAZ-15  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may end a turn on rime **if they spent AP**. Wounded pawns avoid ending idle on rime. Bishop kites from dry floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without an idle-rime tax can later hint `spell-spare-pace` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: A rime patch of 4–6 `WF-HAZ-RIME_HEEL` tiles across the mid-band (walk-through free; ending a turn after 0 AP costs 4% max HP). A dry detour of ≥ 1 tile exists. Exit behind the bishop.  
SPECIAL_RULES: Scripted rime only. Distinct from ENC-HAZ-01 ice (MP), ENC-HAZ-05 salt (extra hops), ENC-HAZ-07 needle (any end-turn). Tax via `recordInBattleChallengeDamage` while `inBattleRef`. Do not mix ice.  
OBJECTIVE: Clear all. Intended: spend AP (Strike / frost) while standing on rime, or hop off before ending idle.  
FAILURE_CONDITION: Player death (frost + idle tax).  
REWARD: Standard. Overlay `under_50_damage` rewards acting from the frost instead of camping.  
TACTICAL_PURPOSE: Teach “rime punishes **waiting**, not walking.” Inverse of Leave Bell (queued ENC day-7); distinct from Idle Pin (ENC-AMBUSH-08).  
SOLVABILITY_REQUIREMENTS: Dry detour reaches both pawns and the bishop. Rime never walls a corridor. Rime not on spawn±3 or the portal.  
REPLAYABILITY: Patch horizontal vs chevron.  
SCALING_BEHAVIOUR: Mid: add `swift_winds` (+2 MP) so the player *can* leave in one turn. High: bishop gains `spell-slow`. Never thicken rime into a wall.  
STATUS: PROPOSED

---

### ENC-HAZ-16

ENCOUNTER_ID: ENC-HAZ-16  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `tide_shade` bishop (`starter-frost` + `spell-slow` at band 1) + 2× pawn.  
AI_REQUIREMENTS: Pawns push toward the **next** windrow pair. Bishop holds the far third and does not stand on the painted hop cells.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Slow can complete that id if missing.  
MAP_REQUIREMENTS: Arena plus `WF-HAZ-WINDROW` (2-tile ember bar hops to the parallel pair each round start; 5% max HP on land). A floor path around both pairs. Optional leftover 2 rime tiles from ENC-HAZ-15 (`inheritHazardsFrom: ENC-HAZ-15`).  
SPECIAL_RULES: Scripted hazards only. Windrow never covers spawn or exit. Inverse of ENC-HAZ-08 orbit cinder (4-tile square vs 2-cycle in-out bar).  
OBJECTIVE: Clear all. Intended: stand in the hollow, cross after the hop.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a hopping tax with a kiter so “stand still in the hollow” is the answer, not a DPS race.  
SOLVABILITY_REQUIREMENTS: Path around both pairs; 3-unit occupancy leaves walk-offs; windrow counts as 2 toward the hazard cap.  
REPLAYABILITY: Hop axis H vs V.  
SCALING_BEHAVIOUR: High: replace one pawn with a `ROLE-ONCOMING` knight only if ENC-TEACH-08’s facing writer is live. Peak: inherit `WF-ENV-CRAMPED_STONE` on a **flank** wall ring, not the hollow.  
STATUS: PROPOSED

---

### ENC-SPELL-15

ENCOUNTER_ID: ENC-SPELL-15  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× “brand pawn” that only Strikes from a painted **wall-adjacent** cell + 1× dummy bishop that **only** casts `starter-frost` down the file. After the first Strike from the wall cell resolves, a **brand glyph** appears on a side tile (`discoverSpellId: spell-wall-sting` or `spell-file-brand` if wall-sting is owned).  
AI_REQUIREMENTS: Pawn camps the wall cell. Bishop prefers the file. Neither walks onto the glyph.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: `spell-wall-sting`. If owned: `spell-file-brand`. If both owned: convert to ENC-ELITE-14.  
MAP_REQUIREMENTS: Straight aisle + one wall column + one side alcove for the glyph. Optional `WF-MOD-LONG_SHADOW` **off** on TEACH (would hide the wall bonus).  
SPECIAL_RULES: Glyph despawns if unused when the last enemy dies (player still wins). Discovery does not auto-upgrade and does not auto-bar-insert (max 8).  
OBJECTIVE: Clear. Optional: pick up the glyph and Strike from the wall / file before the last kill.  
FAILURE_CONDITION: Player death.  
REWARD: The spell id into the owned set + tiny Doka.  
TACTICAL_PURPOSE: Teach “geometry (wall / file) is a damage bonus, not a bigger number.” Prepares ENC-SPAN-01 (two-cell plug on a file).  
SOLVABILITY_REQUIREMENTS: Alcove reachable; glyph not on the aisle’s only walk column.  
REPLAYABILITY: Wall column left/right.  
SCALING_BEHAVIOUR: Does not scale; it retires when both geometry ids are owned.  
STATUS: PROPOSED

---

### ENC-SPELL-16

ENCOUNTER_ID: ENC-SPELL-16  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `cadence_breaker` presentation bishop (`spell-inferno` at kit band 2 **or** `starter-frost` if Inferno is not enemy-legal yet) + 1× pawn. After the bishop’s first cooldown spell resolves, a **crack glyph** appears (`discoverSpellId: spell-cadence-crack`). If that id is owned, glyph is `spell-once-verse`.  
AI_REQUIREMENTS: Bishop prefers the aisle. Does not recast Crack on TEACH (the glyph is the teacher). Pawn is generic.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cadence-crack` (primary). `spell-once-verse` if Crack is owned.  
MAP_REQUIREMENTS: Single room, two pillars, glyph alcove. No extra modifiers. Optional `WF-EVT-STEEL_HOUR` **off** (would forbid the AP spell that teaches Crack).  
SPECIAL_RULES: If both ids are owned, convert to ENC-CADENCE-01. `spell-cadence-crack` is once/battle — do not stack two Crack bodies.  
OBJECTIVE: Defeat hostiles; stepping the glyph (or observing a reset) is the intended lesson.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + standard.  
TACTICAL_PURPOSE: Teach “reset the highest CD” as a found verb before ENC-BRAND-01 makes **your** CD the tax.  
SOLVABILITY_REQUIREMENTS: Glyph is free floor, not a portal. Two walk-offs.  
REPLAYABILITY: Which cadence id is missing drives the room.  
SCALING_BEHAVIOUR: Does not scale; it retires into ENC-CADENCE-01 / ENC-BRAND-01.  
STATUS: PROPOSED

---

### ENC-WAVE-09

ENCOUNTER_ID: ENC-WAVE-09  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-FACE-PIN` (Pin cantor + Oncoming knight) **or**, until facing is live, 2× pawn + 1× frost bishop. Wave 2: `FSN-SPAN-GUN` (span rook + min-range sniper). Wave 3: leftover Pin knight **or** leftover sniper, never both. Never more than 4 living hostiles.  
AI_REQUIREMENTS: Wave 1: cantor Pins if the knight can reach the wedge; knight Oncomings only when facing is public. Wave 2: warder spans a 2-wide file; sniper holds Chebyshev ≥ 3. Wave 3 leftover is greedy. Until span occupancy exists, wave 2 is `FSN-GLASS-WARD` (1-cell door).  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 1 may reveal `spell-shove-face` if used. Wave 2 sniper can complete frost / `spell-file-brand`.  
MAP_REQUIREMENTS: Fortress lane **two cells wide** + one side aisle (span contract). `waveSpawnCells` in the far lane. Optional `inheritModifierFrom: ENC-TEACH-08` unused — facing is the verb.  
SPECIAL_RULES: Portal locked until wave 3 is clear. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns` is tight on purpose.  
TACTICAL_PURPOSE: Named drop-7 pairs as wave verbs — face cash, then two-cell plug — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Side aisle reaches the sniper. File is 2-wide. Cap 4 living.  
REPLAYABILITY: Wave 2 can swap to `FSN-MUTE-PIT` if the player already answered SPAN-GUN this account.  
SCALING_BEHAVIOUR: High: wave 3 leftover is elite Oncoming (still no Glance). Peak: wave 2 sniper is elite, still no Glance on PAIR. No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-08

ENCOUNTER_ID: ENC-AMBUSH-08  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× `WF-TRP-IDLE_PIN` (not a combatant — first unit to **end a turn on it after 0 MP** pays 8% max HP once, then floor) + 1× wounded-looking pawn. Hidden until trigger: `FSN-MUTE-PIT` lite — 1× muter bishop (`starter-frost`; Mute only if walk-fizzle is live) + 1× pit rook (Open Pit on one close tile, or a painted floor “pit” chrome until occupancy pits exist).  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP). Muter arms Mute only if the player still needs ≥ 1 walk MP to threaten. Pit mason paints a tile that is **not** the only walk-off.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mute / Open Pit / `spell-pit-wick` can later offer that id at rest if missing.  
MAP_REQUIREMENTS: Arena with a pin start cell. `ambushCells` behind a wall hook **or** `fog_of_war`. Trigger: player ends a turn on the pin with 0 MP **or** bait drops below 50% HP **or** the player crosses the midline.  
SPECIAL_RULES: Ambush units do not exist in the combatant store until trigger (portal locked because bait is alive). Pin tax is challenge HP; it never starts on spawn/portal. Soft: killing the bait with overkill still fires the ambush. Intent log: explicit `ambush: idle_pin`. Distinct from ENC-AMBUSH-03 (lantern hunts MP spend) — this punishes **stopping**.  
OBJECTIVE: Defeat bait + ambushers. Pin remaining after clear is floor.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player never idled on the pin (stepped through or spent MP). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Punish camping the shiny plate; teach that ending still on a bronze pin is the trap.  
SOLVABILITY_REQUIREMENTS: `ambushCells` reachable after spawn; a walk-through path that does not require ending on the pin exists; bait cannot spawn on the portal.  
REPLAYABILITY: Hook left/right. Muter can be omitted at low band (pit only).  
SCALING_BEHAVIOUR: High: full `FSN-MUTE-PIT`. Peak: pin + one `WF-HAZ-RIME_HEEL` tile adjacent (idle on either tax).  
STATUS: PROPOSED

---

### ENC-REINF-08

ENCOUNTER_ID: ENC-REINF-08  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `WF-SPL-PAGE_THIEF` presentation — 1× medium bishop carrying one extra `usableByEnemy` id (`spell-spare-pace` or `spell-exit-boon`) + 1× rook screen. Adjacent 1 AP **loans** that id as a single remaining cast this map and they lose it. If the thief is killed without a loan, the same one-cast grants on death (does not stack). On loan **or** on first Strike against the thief, a 1-pawn reinforcement spawns on `reinfCells` (cap 1 extra, hard-cap 4 living).  
AI_REQUIREMENTS: Thief kites and spends the extra id until stolen. Screen guards the thief (`AI_BACKLINE_PROTECT`). Pawn is greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: The stolen / kill-grant id is a **one-cast**, not `upgradeSpell` and not a persist `spellLevel*` write. Observation of the extra id can still queue a later rest grant.  
MAP_REQUIREMENTS: Two-depth backline + screen line. `reinfCells` adjacent to the thief, reachable floor.  
SPECIAL_RULES: Reinforcement trigger is `onThiefTouched` (loan or damage), not on-death (that is ENC-REINF-02). Distinct from ENC-REINF-03 (`onSummonerExposed`). If living + pending would exceed 4, skip further spawns. Portal locked until the board is empty. Loan does not start a second combat.  
OBJECTIVE: Clear all. Implicit: steal then delete, or just delete.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + priority bonus if no pawn reinforcement ever spawned (killed without touching / loaning).  
TACTICAL_PURPOSE: Kennel-adjacent — extra pawn only if you **interact**. Teaches Wave 7 Page Thief as a room.  
SOLVABILITY_REQUIREMENTS: Backline reachable; `reinfCells` never on the portal.  
REPLAYABILITY: Extra id spare-pace vs exit-boon vs cadence-crack.  
SCALING_BEHAVIOUR: Screen gains `spell-iron-skin` before the thief gains a third spell. Cap stays 4.  
STATUS: PROPOSED

---

### ENC-SURV-15

ENCOUNTER_ID: ENC-SURV-15  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Start: 2× pawn + 1× bishop. Every 3 enemy-team turns, spawn 1 from {pawn, Oncoming knight if facing live, muter bishop} until the clock ends. Max 4 living.  
AI_REQUIREMENTS: Casters hold LoS. Knights prefer the **open center** so the player is punished for hugging walls. Group tactics if soph ≥ 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Survive 8 turns without `spell-timestep` → rest shrine may offer timestep (reminder, not a free grant).  
MAP_REQUIREMENTS: Arena with walls. `WF-ENV-CRAMPED_STONE` (3% max HP if wall-adjacent at end of turn — inverse of ENC-SURV-06 ash-rain). Skip this id on maps with **no** open (non-wall-adjacent) floor. Optional `swift_winds` so kiting the center is possible.  
SPECIAL_RULES: Clock `surviveTurns: 10` player-turns. When it hits 0, remnants flee to the edge and despawn. Portal unlocks only after the board is empty. Cramped tax never seals spawn or exit.  
OBJECTIVE: Be alive after 10 player turns, then clear or let remnants flee.  
FAILURE_CONDITION: Player death before clock + cleanup.  
REWARD: Survival table (depth × 50 Doka + 100 XP) plus kill XP only for units actually defeated. Prefer overlay `no_healing` over `no_damage_taken`.  
TACTICAL_PURPOSE: Pressure beat — **center is shelter**, walls are the tax. Distinct from ENC-SURV-06 (wall-hug shelter).  
SOLVABILITY_REQUIREMENTS: Open-center cells exist; flee-edge tiles exist; hazard count ≤ 50.  
REPLAYABILITY: Bishop frost vs muter.  
SCALING_BEHAVIOUR: Mid uses only pawns in the pool. High unlocks the knight. Peak unlocks the muter. Never shorten the clock below 8.  
STATUS: PROPOSED

---

### ENC-SURV-16

ENCOUNTER_ID: ENC-SURV-16  
TYPE: survival / optional challenge  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: `FSN-FACE-PIN` lite (knight only). Wave B overlaps at turn 3: span sniper (no warder). Wave C at turn 6: one elite golem. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Sniper holds ≥ 3. Golem camps the last open (non-wall) tile if Cramped is on.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-EVT-STEEL_HOUR` (hard `applyRewards` if the player never casts a spell with `apCost ≥ 1`; Attack Nearest / summons / 0-AP legal). Pick **one** of Steel Hour **or** `WF-RSK-SOLO_OATH` (hard purse if zero living player summons at credit) — never both. Optional cramped stone from ENC-SURV-15. Never `titans_vigor`.  
SPECIAL_RULES: Overlap + “win without spending AP on a spell” is the escalation vs ENC-SURV-15. Flee remnants when the clock ends. Steel Hour is opt-in flavor on a survival map — failing it does not fail the room.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-15. Steel Hour / Solo Oath only multiplies the next `applyRewards` enqueue.  
TACTICAL_PURPOSE: Peak pressure that spends leftover Wave 7 events so late-game maps are not “cramped again.”  
SOLVABILITY_REQUIREMENTS: 4-unit occupancy leaves a walkable ring; Steel Hour does not block Attack Nearest.  
REPLAYABILITY: Steel Hour vs Solo Oath. Wave C golem vs span warder.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-ELITE-14

ENCOUNTER_ID: ENC-ELITE-14  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-FACE-PIN` elite — elite `ROLE-ONCOMING` knight (`variant: elite`, Strike + Oncoming when facing is public) + junior `ROLE-PIN` bishop (Facing Pin + Frost, **no** heal, no Glance). Elite is not a boss: no phase table, no `BossAbility`. Until facing is live, do **not** ship this id — fall back to ENC-ELITE-01.  
AI_REQUIREMENTS: Pin toward the cantor, then Oncoming only when the +10 is public. Isolated 1v1 Pin **reroll**. Soph 1–3. No group-tactics required.  
SPELL_DISCOVERY_OPPORTUNITIES: Knight death after it used Oncoming / `spell-shove-face` can drop that id (once per character).  
MAP_REQUIREMENTS: `openField` or `arena` with a painted front wedge. Reject a 1-tile tunnel. Pin needs a tile at range that is **not** the player’s only exit.  
SPECIAL_RULES: Random 30% family lottery is **off**. Only one elite. Do not inflate elite HP beyond band knight + one Oncoming cycle.  
OBJECTIVE: Defeat the elite. Pin optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn` (don’t dump into the facing window).  
TACTICAL_PURPOSE: Mastery of “don’t look at the cash body; hug / diagonal / wait Pin out.” Consumes a real drop-7 PAIR.  
SOLVABILITY_REQUIREMENTS: Engagement pocket ≥ 2 walk-off tiles. Hostiles start ≥ Chebyshev 4. Wedge is floor.  
REPLAYABILITY: `/PAWN` Oncoming vs knight.  
SCALING_BEHAVIOUR: Add Pin duration before any HP bump. Peak: convert to `FSN-FACE-COURT` (add Glance) only after ENC-ELITE-14 was answered this account.  
STATUS: PROPOSED

---

### ENC-ELITE-15

ENCOUNTER_ID: ENC-ELITE-15  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-SPAN-GUN` elite — elite `ROLE-SPAN` rook (`variant: elite`, Span Guard two-cell) + junior sniper bishop (frost; Glance stays **off** this PAIR). Until second-cell occupancy exists, convert to ENC-ELITE-05 (`FSN-GLASS-WARD`).  
AI_REQUIREMENTS: Warder spans a 2-wide file if a gallery exists; otherwise reroll. Sniper holds Chebyshev ≥ 3 and never Nova. Soph 1–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Sniper death after it used frost can complete frost observation. Sibling `spell-triple-span` is the intended **next** drop — COURT only.  
MAP_REQUIREMENTS: Fortress or openField with **main file two cells wide plus one side aisle**. Reject a single-tile tunnel. No lava on the only approach. Optional `WF-ZON-LONG_ARM` **off** (would give the sniper extra non-linear reach and hide the min-range lesson).  
SPECIAL_RULES: Random 30% lottery off. Only one elite. If pack size would be 1, reroll (sniper must not spawn solo). Targeting either span cell hits the warder.  
OBJECTIVE: Defeat both. Intended line: aisle → sniper first, or burst the one HP bar on the plug.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier on the warder only + standard bishop XP. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Two-cell plug behind a gun. Distinct from ENC-ELITE-05 (1-cell door) and ENC-ELITE-03 (fat artillery).  
SOLVABILITY_REQUIREMENTS: Side aisle reaches the sniper. Two walk-offs. File is 2-wide.  
REPLAYABILITY: Live `iron_golem` presentation vs proposed `span_warder`.  
SCALING_BEHAVIOUR: Promote Glance only by converting to ENC-RARE-08 (`FSN-FACE-SPAN` / `FSN-SPAN-GATE`), never on this PAIR.  
STATUS: PROPOSED

---

### ENC-PROT-08

ENCOUNTER_ID: ENC-PROT-08  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× charger pawn + 1× bishop focusing the **Long Arm** tile.  
AI_REQUIREMENTS: All enemies prefer occupying `WF-ZON-LONG_ARM` (`objectiveCell` / `protectTargetId` override) so they gain +1 non-linear `maxRange`. Lethal lookahead against a player standing on the inlay. They do not retreat from the inlay.  
SPELL_DISCOVERY_OPPORTUNITIES: If the player held the inlay for ≥ 4 player-turns and used `starter-shield` or `summon-sentinel`, rest may offer `summon-sentinel` if missing.  
MAP_REQUIREMENTS: Central brass inlay (`WF-ZON-LONG_ARM`, one walkable cell). Player spawns adjacent. Enemies from the far end + one side alley. No hazard on the inlay. Linear spells / Attack Nearest / summons unchanged (feature contract).  
SPECIAL_RULES: The inlay is a tile, not an allied token (distinct from ENC-PROT-01 walking ward and ENC-PROT-02 shrine HP). Distinct from ENC-PROT-03 (RES ring). Portal unlocks when hostiles are dead. Holding it is the intended line, not a fail-if-empty.  
OBJECTIVE: Clear hostiles. Intended: occupy the inlay so frost from mid-range hits you first, or pull the fight off it and deny the bishop the tile.  
FAILURE_CONDITION: Player death only.  
REWARD: Protection-adjacent grant (band table) + kill XP. Overlay `direct_hit` (stay on the inlay).  
TACTICAL_PURPOSE: Contest a **range tile**, not a RES tile or escort HP. Makes occupancy matter for non-linear kits.  
SOLVABILITY_REQUIREMENTS: Alley does not spawn on the inlay. Inlay not on spawn±3 or portal.  
REPLAYABILITY: Alley left/right. Bishop frost vs weaken.  
SCALING_BEHAVIOUR: Add a second alley flanker before raising ATK. Peak: `WF-MOD-LONG_SHADOW` on so **everyone** already has +1 non-linear — the inlay is then a second +1 (stacking must be explicit replace, not +2). Prefer replace.  
STATUS: PROPOSED

---

### ENC-PRIO-10

ENCOUNTER_ID: ENC-PRIO-10  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CADENCE-MUTE` lite — `ROLE-THIEF` / `cadence_breaker` bishop (reset highest hostile CD once/battle + Frost) + `ROLE-MUTER` bishop (Stride Mute if live, else Slow) + 1× pawn screen. Cap 3 living. No Inferno on the breaker this room (that is ENC-SPELL-16’s later exam).  
AI_REQUIREMENTS: Breaker spends Crack on the player’s highest `cooldown > 0` id if one was used; else Frosts. Muter skips Mute if the player is already adjacent. Screen body-blocks. If the breaker dies, muter **holds** (no invented nuke). Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-cadence-crack` / `spell-once-verse` / `spell-tick-hood`.  
MAP_REQUIREMENTS: Chapel nave + two stalls. Side aisle required. No lava. Optional `WF-EVT-STEEL_HOUR` **off** (would hide the CD lesson).  
SPECIAL_RULES: Unlock after ENC-SPELL-16 **or** ENC-WAVE-09 so the player has seen a CD verb. At most one Crack body.  
OBJECTIVE: Clear all. Intended order: breaker, then muter, then pawn.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “silence the cadence” Doka if breaker dies first.  
TACTICAL_PURPOSE: Combine taught Crack with Mute so the question is “who steals your tempo.” Prepares ENC-BRAND-01 (your hit writes CD) and Table F `cover_hospitaller` (hits bounce).  
SOLVABILITY_REQUIREMENTS: Stalls connected; screen cannot seal the nave; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Screen pawn vs iron-skin rook.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-BRAND-COVER` only if ENC-BRAND-01 was answered this account. Still one Crack.  
STATUS: PROPOSED

---

### ENC-MOVE-14

ENCOUNTER_ID: ENC-MOVE-14  
TYPE: movement objective / timing  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× kiting bishop (`starter-frost`) on the **short** path behind a `WF-OBS-LATCH_SILL` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the short path and does not walk through the sill while it is a wall. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Reaching the far banner **before** the sill opens (took the long path) can offer `spell-haste` or `spell-spare-pace`. Waiting adjacent one turn (unlatch) can offer `starter-shield` (patience). One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor has `WF-OBS-LATCH_SILL` (wall until a unit **ends a turn adjacent**, then floor). Long route already exists (placement contract: never the only exit). Far `objectiveCell` banner. Exit locked until the player occupies the banner **and** hostiles are dead.  
SPECIAL_RULES: Sill is a wall while shut (LoS + walk). Distinct from ENC-MOVE-04 (2-round timer) and ENC-MOVE-05 (odd/even tide door) — this is **camp one turn to unlatch**. Enemies may wait. `holdPortalLocked` until cleanup.  
OBJECTIVE: Touch the banner and clear hostiles.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus Doka if the player never stood adjacent to the sill (committed to the long line).  
TACTICAL_PURPOSE: Teach “spend one idle turn vs spend MP now.”  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to banner **without** the sill. Sill is not a cut-vertex. Banner not on a portal.  
REPLAYABILITY: Sill north vs east. High: replace sill with `WF-TER-WATTLE_HURDLE` (1 AP vault / 2 AP cut) as ENC-MOVE-15.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: one `WF-HAZ-WINDROW` pair on the long path (choice of hop tax).  
STATUS: PROPOSED

---

### ENC-MOVE-15

ENCOUNTER_ID: ENC-MOVE-15  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× kiting bishops (`starter-frost` + `spell-slow` at band 1). 0 melee on entry.  
AI_REQUIREMENTS: Bishops hold the far third. They do not vault the hurdle (leave it as a gate).  
SPELL_DISCOVERY_OPPORTUNITIES: Using `WF-TEL-FILE_SLIDE` at least once and winning can offer `spell-spare-pace` or `spell-knight-slip` if missing (the inlay is the teacher). Vaulting the hurdle can offer `spell-knight-slip` instead (one per character, not both).  
MAP_REQUIREMENTS: `WF-TER-WATTLE_HURDLE` on the short corridor (blocks walk/occupancy, **not** LoS; 1 AP vault to opposite empty floor, 2 AP cut to floor). Always-open long path. One `WF-TEL-FILE_SLIDE` (1 MP slides along a painted file to the farthest empty cell). Far banner `objectiveCell`.  
SPECIAL_RULES: Player must occupy the banner at least once (`touchedObjective`). File-slide dest must be free, non-hazard, non-portal, with two walk-offs. Illegal dest = no slide, spend nothing. Hurdle is not a pit (0 damage).  
OBJECTIVE: Tag the banner and clear the bishops.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a vault gate with a file skip so MP / 1 AP / long walk are three options.  
SOLVABILITY_REQUIREMENTS: Long path works with the hurdle permanently up. Slide A and dest reachable floor, not spawn/portals. Bishops reachable by frost from the banner.  
REPLAYABILITY: Hurdle H vs V. Slide file N-S vs E-W.  
SCALING_BEHAVIOUR: Add a third bishop or poison, not a second hurdle. Peak: dest sits adjacent to a `WF-HAZ-RIME_HEEL` tile (idle tax after the skip).  
STATUS: PROPOSED

---

### ENC-FACE-01

ENCOUNTER_ID: ENC-FACE-01  
TYPE: elite-adjacent / facing / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FACE-PIN` — Pin cantor + Oncoming knight. Optional third pawn only so Oncoming can legally see a facing target without turn-1 surround.  
AI_REQUIREMENTS: Formation contracts. Pin first if the knight can reach the wedge this or next turn; else Frost. Knight Oncomings only when `currentView` toward the caster is public. Never turn-1 surround. Start ≥ Chebyshev 4. Until facing is live, **reroll** this id to ENC-TEACH-08.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Pin / Oncoming / `spell-shove-face` can drop that id.  
MAP_REQUIREMENTS: `arena` or `openField` with ≥ 8 free floor cells and a painted wedge. Reject `corridorMaze`. One optional rime tile on a **flank**, never on both approaches.  
SPECIAL_RULES: At most one Pin body. Isolated 1v1 Pin reroll. Do not pack Gaze + Wedge (Table F illegal pair) — this room is Pin+Oncoming only.  
OBJECTIVE: Clear all. Intended line: hug / diagonal / turn away, then delete the knight.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + facing discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Patient facing cash. Prepares `FSN-FACE-COURT` and Table F `F0` (“do not look at him”).  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal wedge. Knight cannot spawn adjacent (`MIN_CHEBYSHEV`).  
REPLAYABILITY: `/PAWN` vs knight. High: `FSN-FACE-COURT` adds Glance only after this PAIR is answered.  
SCALING_BEHAVIOUR: Unlock real Oncoming +10 only after the facing writer exists. Peak: convert to ENC-ELITE-14.  
STATUS: PROPOSED

---

### ENC-MUTE-01

ENCOUNTER_ID: ENC-MUTE-01  
TYPE: hazard / priority-target / walk-fizzle  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-MUTE-PIT` — muter bishop + pit mason (one Open Pit on a close tile that is not the only walk-off).  
AI_REQUIREMENTS: Mason pits the close tile they must enter to Strike. Muter arms Mute only if they still need ≥ 1 walk to threaten; if already adjacent, Frost / Slow (VETERAN skip Mute). Until walk-fizzle is live, muter uses Slow only. Do not ship Pit as Barrier.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-pit-wick` / Open Pit / Stride Mute sibling ids.  
MAP_REQUIREMENTS: `openField` or fortress courtyard. Pit dest not the only walk-off. Two walk-offs after every legal dest. No sealed alcove.  
SPECIAL_RULES: Blink / Swap / Vault do not trip Mute (feature contract). Cast-first-then-walk is the complete answer. Distinct from ENC-PIT-01 (queued day-6 LoS-open pit without Mute).  
OBJECTIVE: Clear. Intended: Strike from adjacency (no walk) or walk around the pit and eat a Frost, not a fizzle.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + mute/pit discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Walk-then-fizzle exam. Prepares `FSN-GAIT-SNARE` and Table F `F3` (stay still on the high bank).  
SOLVABILITY_REQUIREMENTS: Courtyard walk-offs; pit not on the portal; mason not trapped.  
REPLAYABILITY: `/FROST-ONLY` muter vs full Mute.  
SCALING_BEHAVIOUR: High: convert to `FSN-GAIT-SNARE` (add Oncoming) only if ENC-FACE-01 was answered. Peak: `FSN-PIN-PIT` (Pin + Gale + pit) only after Gale rooms exist this account.  
STATUS: PROPOSED

---

### ENC-SPAN-01

ENCOUNTER_ID: ENC-SPAN-01  
TYPE: movement objective / formation  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SPAN-GUN` — span rook + min-range sniper.  
AI_REQUIREMENTS: Span only if the second cell plugs a 2-wide file **and** a gallery exists. Otherwise reroll. Sniper minRange 3. Until second-cell occupancy exists, convert to ENC-ELITE-05.  
SPELL_DISCOVERY_OPPORTUNITIES: Frost / `spell-file-brand` / later `spell-triple-span`.  
MAP_REQUIREMENTS: 2-wide file + gallery. Far banner optional (`touchedObjective` not required — kill is enough). Reject closets.  
SPECIAL_RULES: Targeting either span cell hits the warder. Barrier on the second cell shrinks the span (player tool). Do not fake Span with two Barriers.  
OBJECTIVE: Clear. Intended: walk the gallery and collapse the sniper, or burst the one HP bar.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Two-cell plug as a room. Prepares ENC-ELITE-15, `FSN-SPAN-GATE`, and Table F `F1` (shove answers **one** cell of a two-cell body).  
SOLVABILITY_REQUIREMENTS: Gallery reaches the sniper; file 2-wide; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: `/GOLEM` presentation vs `span_warder`.  
SCALING_BEHAVIOUR: High: `FSN-SPAN-PLUG` (2-cell post + goad + lancer) only after ENC-PINCH-01 was answered. Peak: `FSN-SPAN-GATE` adds lintel — hold if Low Lintel object is missing.  
STATUS: PROPOSED

---

### ENC-BRAND-01

ENCOUNTER_ID: ENC-BRAND-01  
TYPE: elite / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BRAND-MEND` — brand plate rook (Cadence Brand: next hostile **hit** writes +1 CD on that id) + cantor queen (`starter-heal` self + `starter-shield` ally if `targetId` apply exists; else `/SOLO` self-mend only).  
AI_REQUIREMENTS: Plate walks into the path and Brands when a player nuke is off CD (peer). Cantor stays ≥ 3, Shields the plate under 50%, else self-mends. If the plate dies, remaining cantor holds. No `starter-heal` on the plate (heal-first would steal charger). Until +1 CD writer exists, plate is iron-skin rook and this room is ENC-ELITE-01 chrome — **do not** advertise Brand.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-file-brand` is geometry, not this consume. Sibling Cadence Brand / `spell-cadence-crack` (counter-play: reset after they brand you).  
MAP_REQUIREMENTS: Small nave + one stall. No lava. No Glass Realm.  
SPECIAL_RULES: Miss / DoT / lava do **not** consume Brand. Strike does. Unlock after ENC-SPELL-16. At most one Brand body.  
OBJECTIVE: Defeat the plate (cantor flees on death — pick flee). Intended: Strike-tax a 1-CD or wait 2 turns; do not dump Inferno into a fresh brand.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-adjacent 2× XP on the plate + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Hit lands, nuke sits. Distinct from ENC-ELITE-04 (Enrage window) and plate absorb (queued ENC-PLATE). Prepares Table F `F2` (hits bounce to choir).  
SOLVABILITY_REQUIREMENTS: Stall connected. Two walk-offs.  
REPLAYABILITY: `/SOLO` cantor vs Shield-apply cantor.  
SCALING_BEHAVIOUR: Peak: `FSN-BRAND-COVER` (add Cover Squire) only after Cover Step apply exists. Still one Brand.  
STATUS: PROPOSED

---

### ENC-VAULT-01

ENCOUNTER_ID: ENC-VAULT-01  
TYPE: reinforcements / displacement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-VAULT-ORIGIN` — vault chaplain (queen **without** heal) + origin mason + 1× pawn (or wolf overlay on **one** body so Vault has a 3–4 landing). Isolated chaplain **reroll**. Summon cap 2.  
AI_REQUIREMENTS: Origin paints the player’s tile if they hold a 3+ AP id, else holds. Chaplain Vaults the pawn onto a 3–4 cell that is **not** the player’s last exit. Landing must tick hazards. No lava landing if ally HP% < 40. Player keeps ≥ 1 escape tile. Until File Vault two-step exists, convert to ENC-REINF-03.  
SPELL_DISCOVERY_OPPORTUNITIES: File Vault / Cast Snare / `spell-knight-slip`.  
MAP_REQUIREMENTS: Two-depth backline + a 3–4 landing pocket with two walk-offs. No void on landing cells.  
SPECIAL_RULES: Never turn-1 drop a pet adjacent on all sides. Start ≥ 4. Pet landing ≥ 2 from the player. Portal locked until the board is empty. Pets do not grant extra XP.  
OBJECTIVE: Clear all. Implicit priority: chaplain (no more vaults).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + priority bonus if the pawn never vaulted.  
TACTICAL_PURPOSE: Ally-blink + origin tax. Distinct from ENC-REINF-03 (summoner cap) and queued ENC-TWIN-01 (two-hostile swap).  
SOLVABILITY_REQUIREMENTS: Landing pocket reachable; dest legal; pawn cannot spawn on the portal.  
REPLAYABILITY: Wolf vs pawn landing body.  
SCALING_BEHAVIOUR: Peak: `FSN-VAULT-FILE` adds Glance only after ENC-FACE-01. Cap stays 2.  
STATUS: PROPOSED

---

### ENC-ACT-01

ENCOUNTER_ID: ENC-ACT-01  
TYPE: survival / priority-target / clock  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-ACT-GIFT` — act sexton (queen **without** heal; Act Bell 14 when they become current actor) + tempo king (gifts **the Sexton**, never the player). No `bell_sexton` / `fuse_binder` on this sheet.  
AI_REQUIREMENTS: Turn 1: Tempo gifts the Sexton. Sexton Bells only if the player has a remaining slot **and** is not already ≤ 20%. Until the turn-start flag reader exists, convert to ENC-BELL-01 (queued day-4 painted pip).  
SPELL_DISCOVERY_OPPORTUNITIES: Act Bell / Tempo Gift observation. Not a Timestep grant.  
MAP_REQUIREMENTS: Arena, safe core of 5 tiles. No shrinking void. Optional one `WF-HAZ-RIME_HEEL` patch on a flank (idle tax ≠ Bell).  
SPECIAL_RULES: Death before the slot drops the Bell. Evade consumes if it is a hit. Overlay `under_8_ap_per_turn` (spend the slot before the tick). Distinct from ENC-BELL-01 (unit HP% execute) and ENC-WICK-01 (tile occupancy bomb).  
OBJECTIVE: Clear. Intended: spend the remaining AP slot or kill the Sexton before you become current actor.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + clock discovery.  
TACTICAL_PURPOSE: 14 on become-current-actor — a clock that punishes **saving a nuke**.  
SOLVABILITY_REQUIREMENTS: Core reachable; two walk-offs; sexton not in a pocket.  
REPLAYABILITY: Tempo `/BAIT` (gifts nothing) vs gift-Sexton.  
SCALING_BEHAVIOUR: Do not attach Glass Realm. Peak: leftover pawn so the player has a second body to “be current” — still cap 3.  
STATUS: PROPOSED

---

### ENC-REEL-01

ENCOUNTER_ID: ENC-REEL-01  
TYPE: priority-target / displacement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 7 pack **Reel Tithe** lite — `file_reeler` bishop (`spell-hook-line` or frost-only until hook landing is legal) + `tithe_mason` rook (zone AP tax on a painted cell) + optional `oncoming_knight` only if ENC-FACE-01 was answered. Cap 3.  
AI_REQUIREMENTS: Reeler pulls onto the tax cell only if dest is free, non-lava, non-void, non-portal, with a walk-off. Tithe does not overlap two taxes. Oncoming only when facing is public. Until attract callers exist, reeler Frosts and the tithe cell is still the lesson.  
SPELL_DISCOVERY_OPPORTUNITIES: Hook Line / Glyph Tax / `spell-file-brand`.  
MAP_REQUIREMENTS: One 4-tile file + tax cell off the only exit. Reject closets.  
SPECIAL_RULES: Distinct from ENC-FUSE-01 (martyr) and ENC-SLAM-01 (queued pull+push). Do not pack `file_reeler` with `void_anchoret` (same pull lesson).  
OBJECTIVE: Clear. Intended: stand off the tax, or spend the +1 AP and leave.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + pull/tax discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pull onto a tax. Prepares Table F `F0` (get reeled, then do not look).  
SOLVABILITY_REQUIREMENTS: File exists; dest legality; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Frost-only reeler vs real hook.  
SCALING_BEHAVIOUR: Unlock real hook only after apply exists. Peak: `hinge_mason` enter-swap onto the tax (ENC-HINGE-01) instead of a third body.  
STATUS: PROPOSED

---

### ENC-HINGE-01

ENCOUNTER_ID: ENC-HINGE-01  
TYPE: ambush / displacement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 7 **Hinge Trap** lite — `hinge_squire` knight (pivot 90° around caster / `spell-pivot-foe`) + `pit_mason` (one pit) **or** `fuse_binder` only if ENC-WICK-01 was answered this account (never both pit and wick). Cap 3 including a leftover pawn.  
AI_REQUIREMENTS: Hinge swings the player onto the pit/wick only if dest is legal and a walk-off remains. Until pivot apply exists, hinge is a flanker knight and the pit is still the lesson.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-pivot-foe` / `spell-knight-slip` / pit-wick.  
MAP_REQUIREMENTS: Painted pivot arc (3 floor cells). Pit/wick not on spawn/portal.  
SPECIAL_RULES: Do not pack hinge with vault/hook/shove/mist (Wave 7 illegal PAIR list). Soft: overkill on the squire still leaves the pit on the floor.  
OBJECTIVE: Clear. Intended: stand off the arc, or occupy the dest so the pivot fizzles.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + pivot discovery.  
TACTICAL_PURPOSE: Rotate onto a hole. Distinct from ENC-AMBUSH-08 (idle pin) and ENC-DISP-01 (pads).  
SOLVABILITY_REQUIREMENTS: Arc cells reachable; dest legality; two walk-offs after pivot.  
REPLAYABILITY: Pit vs wick (if wick taught).  
SCALING_BEHAVIOUR: Peak: `hinge_squire` + `cover_squire` (Hinge Cover pack) only after Brand Cover exists.  
STATUS: PROPOSED

---

### ENC-CAMP-01

ENCOUNTER_ID: ENC-CAMP-01  
TYPE: elite / optional challenge / invasion  
RELATIVE_DIFFICULTY: HIGH (opt-in in exploration; required in a run)  
ENEMY_COMPOSITION: `WF-INV-QUIET_CAMP` — 3× same-band elites on painted cots around a fire. They do not wander. Contact: ending a turn within Chebyshev 2 of any, or touching one, starts combat with all three. In exploration, leave without waking. In dungeon / boss rush they count as hostiles for map-clear.  
AI_REQUIREMENTS: Once woken: one Oncoming / span / brand kit split (one verb each, not three of the same). They do not heal each other. If one dies, survivors do **not** gain Enrage (that is ENC-DUEL-01). Cap 3 living elites + 0 trash.  
SPELL_DISCOVERY_OPPORTUNITIES: Winner can drop one of frost / iron-skin / brand observation.  
MAP_REQUIREMENTS: Fire + three cots. Exit reachable without stepping Chebyshev ≤ 2 in exploration. Cots not on spawn/portal. Counts as 3 toward `MAX_ENEMIES`.  
SPECIAL_RULES: In a run, contact is immediate at full HP (no wait-for-attrition cheese). Portal locked until all three are dead. Distinct from ENC-DUEL-01 (2 elites on a ring) and queued ENC-VANG (2 sleeping).  
OBJECTIVE: In a run: defeat all three. In exploration: pass by berth or fight.  
FAILURE_CONDITION: Player death after waking. Berth is success-with-less.  
REWARD: Hard-band depth Doka + elite XP on all three. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Three taught elites at once — face / plug / brand — as an opt-in camp, not more HP.  
SOLVABILITY_REQUIREMENTS: Berth path exists in exploration; 3 elites start ≥ Chebyshev 4 from the player once combat starts; walk-offs exist.  
REPLAYABILITY: Verb split Face+Span+Brand vs Mute+Vault+Act for mixed accounts.  
SCALING_BEHAVIOUR: Do not add a fourth elite. Peak: survivors gain Haste (one turn), not HP.  
STATUS: PROPOSED

---

### ENC-PICKET-01

ENCOUNTER_ID: ENC-PICKET-01  
TYPE: elite / movement / timing  
RELATIVE_DIFFICULTY: HIGH (opt-in in exploration; required in a run)  
ENEMY_COMPOSITION: 1× `WF-ELT-EVEN_PICKET` elite rook (`spell-iron-skin` + Strike). Present on **even** rounds; off the board on odd (post is empty floor).  
AI_REQUIREMENTS: Stationary on the post while present. Then charger / chokepointCamp on the short path. While absent, the post is floor (player may cross).  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Short path with the post on a painted cell. Long path already exists. Place only when a second spawn→portal route exists.  
SPECIAL_RULES: Exploration: fight on even, cross empty post on odd, or walk long. Dungeon-chain: must fight (wait for even). Portal locked while the picket lives in a run. Distinct from ENC-TOLL-01 (always present, HP-pay) and ENC-CART-01 (moving intercept).  
OBJECTIVE: In a run: defeat the picket. In exploration: pass by fight, odd-cross, or long path.  
FAILURE_CONDITION: Player death after committing to the fight. Odd-cross / long path is success-with-less.  
REWARD: Hard-band Doka on a fight win. Odd-cross / long: 0 extra.  
TACTICAL_PURPOSE: “Wait for even, walk odd, or take the long path” as a room.  
SOLVABILITY_REQUIREMENTS: Long path works with the picket treated as a wall. Post not on the only portal.  
REPLAYABILITY: Rook vs knight chassis.  
SCALING_BEHAVIOUR: Peak: picket is `FSN-SPAN-GUN` warder (sniper sits behind on the short path) — still one elite tag, still even/odd.  
STATUS: PROPOSED

---

### ENC-SOLO-01

ENCOUNTER_ID: ENC-SOLO-01  
TYPE: treasure / risk / optional challenge  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. One `WF-RSK-SOLO_OATH` inlay. Optional second device: `WF-EVT-STEEL_HOUR` chrome **or** Fever-off. Touching the inlay flags: next `applyRewards` uses hard multiplier **only if** zero living player-side summons at credit.  
AI_REQUIREMENTS: If the player then takes a fight (progress portal), spawn `FSN-SPAN-GUN` or `FSN-FACE-PIN` on reachable cells.  
SPELL_DISCOVERY_OPPORTUNITIES: Preview is always shown before combat.  
MAP_REQUIREMENTS: Inlay + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** inlay-only leave after the flag is set or refused.  
SPECIAL_RULES: Flag is not a buff spell. Summons alive at credit cancel the hard multiplier (feature contract). Distinct from ENC-OATH-01 (stillness / no MP) and ENC-LAST-01 (≤30% HP). Losing the fight is a normal death. Jackpot numbers stay inside `applyRewards`.  
OBJECTIVE: Resolve the oath **or** take the coward exit. Fight commit must be won.  
FAILURE_CONDITION: Player death after fight commit. Coward / refused oath is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat — wager that you can win **without a living pet**.  
SOLVABILITY_REQUIREMENTS: Inlay and coward exit reachable on entry. After commit, spawn the pack off the progress portal.  
REPLAYABILITY: Fight pack SPAN-GUN vs FACE-PIN.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack with `titans_vigor` or `doka_fever`.  
STATUS: PROPOSED

---

### ENC-PAGE-01

ENCOUNTER_ID: ENC-PAGE-01  
TYPE: spell-discovery / elite-adjacent  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× Page Thief bishop (extra `usableByEnemy` id) + 1× pawn. Same loan rules as ENC-REINF-08 **without** the pawn reinforcement.  
AI_REQUIREMENTS: Thief kites. Pawn is generic.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: the extra id as a one-cast (`spell-spare-pace` / `spell-exit-boon` / `spell-tick-hood`). Kill-grant does not stack with loan.  
MAP_REQUIREMENTS: Single room, two pillars. No extra modifiers.  
SPECIAL_RULES: If the player already owns the extra id, convert to ENC-REINF-08. Loan / kill-grant do not persist `spellLevel*` arrays.  
OBJECTIVE: Defeat hostiles; loan optional.  
FAILURE_CONDITION: Player death.  
REWARD: One-cast + tiny Doka + standard kill XP.  
TACTICAL_PURPOSE: Teach Page Thief as a found one-shot before the reinforcement exam.  
SOLVABILITY_REQUIREMENTS: Two walk-offs. Thief not on a portal.  
REPLAYABILITY: Which extra id is missing drives the room.  
SCALING_BEHAVIOUR: Does not scale; it promotes to ENC-REINF-08.  
STATUS: PROPOSED

---

### ENC-CADENCE-01

ENCOUNTER_ID: ENC-CADENCE-01  
TYPE: mastery / waves / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: `FSN-BRAND-MEND` lite (plate only). Wave 2: `FSN-CADENCE-MUTE` breaker + muter. Wave 3: elite leftover (branded plate **or** Crack bishop) + leftover pawn. Cap 4 living.  
AI_REQUIREMENTS: Full sophistication allowed except instantKill / betrayal. Wave 3 elite camps the safest dry, non-rime tile.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines wall aisle (SPELL-15), rime patch (HAZ-15), and a central Long Arm (PROT-08) that is **optional**. Scripted hazards only. Branch skins: Face keeps the wedge; Mute keeps one pit; Span keeps the 2-wide file; Brand keeps the plate.  
SPECIAL_RULES: Portal locked until wave 3 clear.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove the player can refuse idle rime, turn off a wedge, walk a gallery, and not dump a nuke into Brand.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one dry path; Long Arm not on a portal.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role** (Oncoming vs Span vs Brand vs Crack), not its level.  
STATUS: PROPOSED

---

### ENC-RARE-08

ENCOUNTER_ID: ENC-RARE-08  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-FACE-SPAN` (Face Court + two-cell plug, leader) **or**, if the account has not answered ENC-ELITE-14, `FSN-LINTEL-COUP` lite (HP%-gated walk + 25% execute — **hold** if Coup rooms were never taught; then `FSN-SPAN-GATE` instead). Rare elite tag on the leader only (`variant: rare_elite`).  
AI_REQUIREMENTS: COURT contracts. `escapeRoute` on the rare elite. `instantKill` / `betrayal` off. Lethal lookahead on. Span never occupies both cells of a ram ray (Table F F1 rule, even in a dungeon). Pin never occupies a telegraphed hook tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-triple-span`, `spell-cadence-crack`, `spell-pivot-foe`, `spell-knight-slip`} not yet owned.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with two files. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-08 by default. Purple portal chrome only after clear. No Inferno on this sheet.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes Face/Span the primer already taught.  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket; span dest legal.  
REPLAYABILITY: FACE-SPAN vs SPAN-GATE vs LINTEL-COUP by which PAIR the account answered.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale support kit and leader uptime, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-08

ENCOUNTER_ID: ENC-TREAS-08  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Three **devices**, not three chests (distinct from ENC-TREAS-02 / 03 / 07):

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-WATCH_CACHE` | 1 AP: medium Doka **only if** no hostile within 3 Chebyshev; else 5% max-HP tax and the chest stays | Medium `applyRewards` **or** tax-and-retry |
| `WF-RSK-SOLO_OATH` | Flag: hard multiplier if zero living summons at next credit | Hard victory purse if you then take a fight without pets |
| Steel seal | Turns on `WF-EVT-STEEL_HOUR` (no `apCost ≥ 1` spells) and spawns `FSN-SPAN-GUN` | Depth Doka hard if the oath held + Span observation |

AI_REQUIREMENTS: Steel-seal pack uses SPAN-GUN contracts. Watch Cache has **no** guardian (the tax is the retry).  
SPELL_DISCOVERY_OPPORTUNITIES: Steel-seal preview is always shown before combat.  
MAP_REQUIREMENTS: Three device tiles + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** cache-only leave after the cache resolves.  
SPECIAL_RULES: Touching Steel seal locks the coward exit and the other devices. Cache can be used without locking the coward exit (but hostiles from a later fight count for the 3-tile rule). Solo can be used without combat. Losing Steel is a normal death. Jackpot numbers stay inside `applyRewards`.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Steel commit must be won.  
FAILURE_CONDITION: Player death after Steel commit. Coward / cache-miss is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **three different prices** (clear-then-open, no-pet wager, no-AP-spell fight). Distinct from ENC-TREAS-03 (urn / compact / fever sponge).  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. After Steel commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Device positions rotate. Steel pack SPAN-GUN vs FACE-PIN.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack Steel with `titans_vigor` or `doka_fever`.  
STATUS: PROPOSED

---

### ENC-REST-08

ENCOUNTER_ID: ENC-REST-08  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional Solo / Steel shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-09 / ENC-FACE-01 / ENC-SPELL-16 observed Pin / Crack / Span, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-PAGE_THIEF` is **not** spawned on rest (would start combat).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-08. Optional `WF-RSK-SOLO_OATH` tile (flag next room only). Optional `WF-ZON-LONG_ARM` (range inlay flavor on rest is “one extra shrine tap,” still not a combat). Optional `WF-PRT-ASH_GATE` **overworld/rest only** (fight-then-gamble extra portal — never the only exit; forbidden in dungeon / rush / Death Realm).  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Solo / Steel do not start combat. `uiLayout` unchanged. After one full Table E clear, shrine can enable day-8 `rushVariant` flags (`table_f0` … `table_f3`).  
OBJECTIVE: Choose an exit. Optional: shrine, oath, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Oath is a modifier flag, not a Doka mint.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Face-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and oath pass punch-roster / portal reachability. Oath / Ash Gate not on spawn or a portal. Ash Gate never the only exit.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Long Arm on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-08

ENCOUNTER_ID: ENC-BRANCH-08  
TYPE: branching paths  
RELATIVE_DIFFICULTY: LOW (the choice is the content)  
ENEMY_COMPOSITION: None on the foyer.  
AI_REQUIREMENTS: None in-foyer.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four portals: Face (`currentView` / FACE-PIN → ENC-TEACH-08 or ENC-FACE-01), Mute (walk-fizzle / MUTE-PIT → ENC-AMBUSH-08 or ENC-MUTE-01), Span (two-cell plug / SPAN-GUN → ENC-SPAN-01 or ENC-ELITE-15), Brand (hit-writes-CD / BRAND-MEND → ENC-SPELL-16 or ENC-BRAND-01). A sealed fifth door to ENC-RARE-08 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: face | mute | span | brand` on the dungeon snapshot (**before** `cleanupMap`). Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-08 / ENC-BOSS-08). Day-7 `ENC-BRANCH-07` stays Gale/Twin/Pincer/Oblique. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Countess / Archbishop / Grandmaster / Gale.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Quiet Camp door (ENC-CAMP-01) can replace Face for accounts that already finished Face this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band.  
STATUS: PROPOSED

---

### ENC-MINI-09

ENCOUNTER_ID: ENC-MINI-09  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Face Lieutenant — king chassis, kit from `ROLE-PIN` **plus** one Strike (so it is not a pure glass bot): Facing Pin (if live) + Frost + `physical_attack`. 1× Oncoming knight choir. Not in `BOSS_IDS`. No phase-2 table. Until facing is live: Frost + Strike only, choir is a greedy knight.  
AI_REQUIREMENTS: Lieutenant Pins first, then Frosts, then Strikes only if the choir is dead. Choir Oncomings only when facing is public. If the lieutenant would die, it tries one Pin on the player **only if** apply allows; otherwise it Strikes.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-shove-face` drop (once) if used.  
MAP_REQUIREMENTS: Small nave + one stall + painted wedge. No lava. No Gaze Beadle (that is Table F).  
SPECIAL_RULES: At 30% HP the lieutenant gains **one** extra Pin cycle only if the chain taught FACE-PIN (ENC-WAVE-09 / ENC-FACE-01). Otherwise it only Frosts the choir once. Honest to pacing.  
OBJECTIVE: Defeat the lieutenant (choir flees on death).  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss 2× XP on the lieutenant + depth Doka. Not a Boss Rush room.  
TACTICAL_PURPOSE: Face-branch capstone-adjacent without `gaze_beadle`’s Rush state machine.  
SOLVABILITY_REQUIREMENTS: Stall connected to the nave. Wedge is floor.  
REPLAYABILITY: Choir sniper (frost) if Span was taken; muter if Mute; plate if Brand.  
SCALING_BEHAVIOUR: Add a second choir body before any HP bump. Peak: lieutenant kit adds `spell-iron-skin` (still no Inferno, still no Gaze).  
STATUS: PROPOSED

---

### ENC-BOSS-08

ENCOUNTER_ID: ENC-BOSS-08  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Face → `bone_cavalier` (file / charge); Mute → `lord_of_static` (walk-then-fizzle exam uses bounce aisle); Span → `alabaster_fortress` (walls as occupancy); Brand → `chessboard_lich` (marked zones as CD-like taxes). If the chain taught picket (ENC-PICKET-01) **and** Face was not taken, mixed accounts may use `eternal_pawn_king` **alone** (not the Rush pair). No dual-boss unless this is a Rush injection. **Do not** spawn Wave-8 `gaze_beadle` here.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-09) or vault (ENC-VAULT-01) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Face may add a painted wedge off the only path; Mute may inherit 1 pit chrome (not Barrier); Span may inherit a 2-wide file; Brand may inherit 0 extra Inferno.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (charge file / bounce aisle / wall occupy / zone tax).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-MAST-08

ENCOUNTER_ID: ENC-MAST-08  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on rime (`WF-HAZ-RIME_HEEL`). Wave 2: `FSN-FACE-PIN` **or** `FSN-SPAN-GUN` **or** `FSN-MUTE-PIT` **or** `FSN-BRAND-MEND` by `branch`. Wave 3: elite leftover (Oncoming / E-SPAN / muter / plate) + leftover.  
AI_REQUIREMENTS: Full sophistication allowed (lethal lookahead, overkill spill, LoS reposition, backline guard). Wave 3 elite camps the safest dry, non-windrow tile.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines wedge (TEACH-08), rime (HAZ-15), 2-wide file (SPAN-01), and a central Long Arm (PROT-08) that is **optional**. Scripted hazards only. Branch skins as ENC-CADENCE-01.  
SPECIAL_RULES: Portal locked until wave 3 clear.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove the player can refuse idle rime, turn off a wedge, walk a gallery, and optionally spend occupancy on Long Arm.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one dry path; Long Arm not on a portal.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role**, not its level.  
STATUS: PROPOSED

---

### ENC-RUSH-27

ENCOUNTER_ID: ENC-RUSH-27  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table F room `F0`: `gaze_beadle` + `hook_regent` (PR #518). Combined mechanic: “Get reeled, then **do not look** at him.” Plus ENC-FACE-01’s **wedge chrome** (one painted front wedge, not a new boss).  
AI_REQUIREMENTS: Existing Table F combined mechanic. Pin **never** occupies a telegraphed hook tile. Forced-move does **not** rewrite facing. Trash (cap 1 pawn) guards the **hook glow**, not the Beadle — only if the account learned ENC-FACE-01 (`rushVariant: table_f0`). Trash does not receive boss heals.  
SPELL_DISCOVERY_OPPORTUNITIES: None (Rush is a mastery product).  
MAP_REQUIREMENTS: Table F preferred-cell solvability. Wedge ⊆ reachable floor, not a preferred boss cell, not a hook glow.  
SPECIAL_RULES: `rushVariant: table_f0`. Persist still goes through `persistBossRushRoomClear` / `completeBossRushRoom` (client `dokaReward`/`xpReward` ignored). Unlock: one complete Table E clear (E0–E3). Do **not** overwrite rooms 0–9 or Tables B–E. Hold this id if Gaze / Hook objects are missing.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death → abort rush (`resetRunState`).  
REWARD: Table F F0 table (sibling boss sheet) + tiny bonus if the player never ended a turn facing the Beadle during a pin window (skill, via `applyRewards`).  
TACTICAL_PURPOSE: Escalate Table F by teaching the facing verb in the dungeon, then lighting the wedge — not more HP.  
SOLVABILITY_REQUIREMENTS: Preferred cells + wedge reachable. Hazard total ≤ 50. Pin not on hook glow.  
REPLAYABILITY: Wedge W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Later “endless rush” at ENC-REST-08 may add the ENC-FACE-01 choir pawn (cap 1), never a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-28

ENCOUNTER_ID: ENC-RUSH-28  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table F `F1`: `span_chamberlain` + `ram_castellan`. Combined mechanic: “Shove answers **one** cell of a two-cell body.” Plus ENC-SPAN-01 gallery chrome.  
AI_REQUIREMENTS: Existing combined mechanic. Ram ray **never** occupies **both** span cells. Brace and Truss are both objects.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: 2-wide file + gallery in the reachable set. Preferred cells free.  
SPECIAL_RULES: `rushVariant: table_f1`. Hold if Span occupancy or Ram ray is missing. Gallery is not a boss.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table F F1 table + tiny bonus if the player collapsed the chamberlain by hitting either span cell (skill).  
TACTICAL_PURPOSE: Add the two-cell plug verb the Face primer taught, without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + gallery reachable. Ram never occupies both span cells.  
REPLAYABILITY: Gallery N vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by chamberlain iron-skin, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-29

ENCOUNTER_ID: ENC-RUSH-29  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table F `F2`: `cover_hospitaller` + `wick_prelate`. Combined mechanic: “Hits bounce to the choir; douse the wicks.” Plus ENC-BRAND-01 plate chrome (one Brand cycle on the hospitaller **only if** ENC-BRAND-01 was learned).  
AI_REQUIREMENTS: Existing combined mechanic. Fuses **never** paint the martyr tile. Snuffer and Bier are both objects. Wisp is not a fuse gate. Brand miss/DoT/lava do not consume.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Brand plate cell ⊆ reachable floor, not a fuse wick, not a martyr tile.  
SPECIAL_RULES: `rushVariant: table_f2`. Choir is not a boss. Hold if Cover Step or wick objects are missing. First Table F clear: no Brand chrome. Later clears: Brand cycle.  
OBJECTIVE: Defeat both bosses; Brand optional.  
FAILURE_CONDITION: Player death.  
REWARD: Table F F2 table + tiny bonus if the player never dumped a `cooldown > 0` spell into a fresh Brand.  
TACTICAL_PURPOSE: Add the hit-writes-CD verb to a bounce/wick pair.  
SOLVABILITY_REQUIREMENTS: Preferred cells + plate cell reachable. Fuses not on martyr tile.  
REPLAYABILITY: Plate N vs S of center.  
SCALING_BEHAVIOUR: Do not add a third boss. Brand uptime is the scaler.  
STATUS: PROPOSED

---

### ENC-RUSH-30

ENCOUNTER_ID: ENC-RUSH-30  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table F `F3`: `lintel_sacrist` + `stride_censor`. Combined mechanic: “Stay still on the high bank **or** crawl at ≤ 50%.” Plus ENC-MUTE-01 pit chrome (one Open Pit off the start tile).  
AI_REQUIREMENTS: Existing combined mechanic. Lintel cells **never** occupy the start tile (no forced first-step crawl). Ledger and high bank are objects. Mute does not trip on blink/swap/vault.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Pit ⊆ reachable floor, not the start tile, not a lintel cell.  
SPECIAL_RULES: `rushVariant: table_f3`. Pit is not a boss. Hold if Low Lintel or Stride Mute objects are missing.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table F F3 table + tiny bonus if the player never walked onto the pit **and** never fizzled a spell after a walk (skill).  
TACTICAL_PURPOSE: Add the walk-then-fizzle / stay-still verb the Mute branch taught.  
SOLVABILITY_REQUIREMENTS: Preferred cells + pit reachable. Lintel never on the start tile.  
REPLAYABILITY: Pit W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Mute uptime, not HP.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain G — “Face Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-08 then ENC-SPELL-15 (or ENC-SPELL-16 if wall/file ids already owned) |
| 2 | Reinforce | ENC-WAVE-09 |
| 3 | Combine | ENC-HAZ-15 then ENC-FACE-01 **or** ENC-MUTE-01 **or** ENC-SPAN-01 |
| 3 insert | Choice | ENC-BRANCH-08 → Face/Mute/Span/Brand destinations |
| 4 | Pressure | ENC-SURV-15 **or** ENC-PROT-08 **or** ENC-CAMP-01 **or** skip via ENC-REST-08 |
| 4 | Mastery | ENC-MAST-08 (branch skin) |
| 5 | Boss | ENC-BOSS-08 |

Rare: 8% on depth 4 to **insert** ENC-RARE-08 before mastery.  
Treasure: rest may offer ENC-TREAS-08 instead of PROT-08.  
Cadence side-story: replace combine with ENC-BRAND-01 and mini-boss ENC-MINI-09; capstone may become `chessboard_lich` if Brand was the door.

### Chain H — “Latch Primer” (maxDepth 4)

ENC-MOVE-14 → ENC-MOVE-15 → ENC-PICKET-01 → ENC-REST-08 → ENC-BOSS-08 (`alabaster_fortress` only if Span was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-14 as teach on accounts that already know rime/face.

### Rush injection (day-8)

After one full Table E clear, ENC-REST-08 shrine can enable: F0 → ENC-RUSH-27, F1 → ENC-RUSH-28, F2 → ENC-RUSH-29, F3 → ENC-RUSH-30. Days 1–7 flags for rooms 0–9 and Tables B–E remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-08, ENC-SPELL-15, ENC-SPELL-16, ENC-PAGE-01 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-15, ENC-HAZ-16, ENC-MOVE-14, ENC-MOVE-15 | `under_50_damage` |
| ENC-WAVE-09 | `under_10_turns` |
| ENC-PROT-08, ENC-MAST-08 | `direct_hit` |
| ENC-ELITE-14, ENC-ELITE-15, ENC-FACE-01, ENC-BRAND-01, ENC-ACT-01, ENC-CAMP-01 | `under_8_ap_per_turn` |
| ENC-SURV-15, ENC-SURV-16 | `no_healing` (not `no_damage_taken`) |
| ENC-MUTE-01, ENC-SPAN-01, ENC-PRIO-10 | `under_15_turns` |
| ENC-TREAS-08 / ENC-REST-08 / ENC-SOLO-01 / ENC-PICKET-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | rime **or** painted wedge | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | rime **or** idle pin | kill + optional glyph |
| MID | named drop-7 `FSN-*` or waves | backline guard | zone 1 + Pin/Span/Mute | one `WF-*` | clock / tags / latch |
| HIGH | elite or camp | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / vault / brand |
| PEAK | overlap or boss | full gates except 9/10 | COURT / rare | branch-skinned | mastery / Table F |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit rime, open a second aisle, enable facing +10) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure from older catalogs, not this primer.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose prior-day fields plus:

```
encounterId
encounterType        // + facing | mute_fizzle | span_plug | cadence_brand
                     //   | vault_origin | act_bell | reel_tithe | hinge_pivot
                     //   | quiet_camp | even_picket | solo_oath | page_thief
formationId?         // FSN-FACE-PIN | FSN-MUTE-PIT | FSN-SPAN-GUN |
                     // FSN-BRAND-MEND | FSN-VAULT-ORIGIN | FSN-ACT-GIFT |
                     // FSN-FACE-COURT | FSN-GAIT-SNARE | FSN-CADENCE-MUTE |
                     // FSN-VAULT-FILE | FSN-SPAN-GATE | FSN-SPAN-PLUG |
                     // FSN-BRAND-COVER | FSN-LINTEL-COUP | FSN-FACE-SPAN
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize (wave 7 ids)
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // face | mute | span | brand
spanCells[]?         // ENC-SPAN-01 two-cell occupy
wedgeCell?           // ENC-FACE-01 / ENC-TEACH-08
brandTargetId?
holdPortalLocked?
objectiveKind        // + occupy_long_arm | wait_latch | vault_hurdle
                     //   | even_picket | steal_page | choose_device
failureKind
deviceTable[]        // ENC-TREAS-08
rushVariant?         // table_f0 | table_f1 | table_f2 | table_f3
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Gaze Beadle” logic — use `formationId` / `decoyId` / `spanCells[]` / `currentView`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-24 IDs (including queued PRs #347 / #396 / #479 / #519).
- Touching `docs/WORLD_DYNAMICS.md`, `worldFeatures.ts`, formation PDFs, or `BOSS_AND_SPELL_DISCOVERY.md` in this change (those files are already on older open PRs).
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush / Table F only).
- Adding Wave-8 `gaze_beadle` / `span_chamberlain` / `cover_hospitaller` / `lintel_sacrist` to live `BOSS_IDS` in the same PR as a room remap.
- Consuming same-day Wave 8 elite (PR #558) or Wave 8 spell (PR #563) ids — leave those for a later catalog.
- Faking Facing Pin without a `currentView` writer, Span without two-cell occupancy, Mute without walk-fizzle, Brand without a next-hit CD writer, Act Bell without a turn-start flag, Vault without a two-step ally blink.

---

## 10. Pick order (day-8, after days 1–7 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 through day-7 pick orders still win if those verbs are missing (see those files / PRs).

Once those exist, implementers should pick:

1. ENC-TEACH-08 + ENC-SPELL-15 (facing / geometry verbs)  
2. ENC-WAVE-09 (`formationId` FACE-PIN → SPAN-GUN, with honesty fallbacks)  
3. ENC-FACE-01 or ENC-MUTE-01 or ENC-SPAN-01 (new pressure objects)  
4. ENC-BRANCH-08 (`branch: face|mute|span|brand` snapshot-before-cleanup)  
5. ENC-BOSS-08 branch read  
6. Rush Table F variants 27–30 one room at a time (after the account has one full Table E clear)

Uniqueness: this file is the **eighth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
