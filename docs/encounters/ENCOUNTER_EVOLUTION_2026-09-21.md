# Encounter Evolution Catalog — 2026-09-21

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-21-001`.  
Parent catalogs:

- [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`)

**Do not reuse those IDs.** This file only adds new rooms. Do not rewrite prior catalogs.

Grounding: `origin/main` @ `0f5363f` plus sibling design — `docs/design/ENEMY_FORMATIONS_2026-09-02.md` (drop-3 `FSN-*`), `docs/ENEMY_AI_EVOLUTION.md`, `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-02.md` (Wave-3 families **deferred** — no `FSN-*` minted for Wick Court / Ice File / Fog Fuse here), `docs/WORLD_DYNAMICS.md` wave 3 (`WF-*`), `docs/design/BOSS_AND_SPELL_DISCOVERY.md` Rush Table B (`B0`–`B3`). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `ENEMY_SUMMON_COOLDOWN_TURNS = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS` (`bossTypes.ts` 390–410), 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`.

---

## 1. Why a fourth day

Day-1 taught the **Ash / Ice skeleton**. Day-2 taught the **Void primer**. Day-3 taught the **Hex primer** (Blood / Glass / Paper / Null) and spent drop-2 packs `FSN-HEX-BLOOD`, `FSN-GLASS-WARD`, `FSN-PAPER-PLAGUE`, `FSN-NULL-WALL`, `FSN-HOOK-FUSE`, `FSN-VEIL-HEX`, `FSN-KENNEL-LITANY`, `FSN-QUIET-CHOIR`, `FSN-BROKEN-GLASS`. Rush variants exist for rooms **0–9**.

After those rooms exist, high-level play is still “the same shape.” Day-4 changes **the question** again by spending the **Tide / File / Clock** verbs that already have formation sheets and leftover **wave-3** world-feature knobs.

Gaps this file fills (still unused as scripted rooms):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-3 formations | `FSN-IRON-TIDE`, `FSN-FILE-GUARD`, `FSN-MEND-KNIFE`, `FSN-HOOK-SLAM`, `FSN-BELL-CUT`, `FSN-WIRE-ROOT`, `FSN-EMBER-MEND`, `FSN-GRAVITY-TAX`, `FSN-FILE-WIRE`, `FSN-BELL-COURT`, `FSN-PLATE-LINK`, `FSN-MIST-HUNT`, `FSN-SHARD-BATTERY` are PDFs, not rooms |
| Leftover drop-2 sheets | `FSN-TIDE-STORM`, `FSN-MIRROR-REAVE`, `FSN-ASH-COURT`, `FSN-RIFT-KNOT` were named on day-3 but never given a dedicated beat (peak conversions only) |
| World-feature wave 3 | `WF-HAZ-NEEDLE_GRASS`, `WF-HAZ-ORBIT_CINDER`, `WF-TRP-CHEVRON_PLATE`, `WF-TER-FROST_PANE`, `WF-OBS-SPENT_BRIDGE`, `WF-ZON-RALLY_DRUM`, `WF-TEL-TRIUNE_PADS`, `WF-PRT-LATCH_GATE`, `WF-INV-SLEEPING_VANGUARD`, `WF-ELT-CART_GUARD`, `WF-TRS-SPLIT_CACHE`, `WF-SPL-LOANER_MAGE`, `WF-RSK-STILLNESS_OATH`, `WF-MOD-SHORT_FUSE`, `WF-EVT-HARVEST_MOON`, `WF-ENV-ISOLATION_CHILL` |
| Unused live modifiers | `thorned_ground` (far-walk tax — not a dungeon sponge), `frozen_terrain` (MP double — distinct from ice tiles), leftover `mending_mist` as an **opt-in rest shrine** only |
| Rush Table B | After one full rooms-0–9 clear: `B0` `cinder_lance`+`hexed_marker`, `B1` `hook_regent`+`goad_pretender`, `B2` `ivory_palisade`+`silent_conductor`, `B3` `unbound_pendulum`+`wick_prelate`. New `roomIndex` namespace. Do **not** overwrite `BOSS_RUSH_ROOMS` 0–9 or collide ENC-RUSH-01…10 |
| Wave-2 / Wave-4 solo capstones | `cinder_lance`, `unbound_pendulum`, `hook_regent`, `rime_margrave` stay **out of `BOSS_IDS`** until kits ship; dungeon capstones below fall back to live 19 |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

`doka_fever` remains the **opt-in** sponge from ENC-TREAS-03. Day-4 treasure uses `WF-TRS-SPLIT_CACHE` and `WF-EVT-HARVEST_MOON` instead.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / hold / cart rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `ownedFile`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer. Loaner one-casts (`WF-SPL-LOANER_MAGE`) do **not** persist `spellLevel*` arrays.
- `inferArchetype` still treats any `healAmount > 0` as healer. Buffers / clocks / storms / tax / ricochet must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. `FSN-MEND-KNIFE` is self-mend on purpose.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- Dual Slow / Frost / tide melee MP tax: cap applied MP debuff at **−2**. One Slow source per pack.
- `WF-PRT-LATCH_GATE` is **forbidden** in dungeon, boss rush, and Death Realm. Rest / overworld only, and never the only portal.
- `applyPushback` / `applyAttract` exist in `occupancy.ts` but have **no spell caller**. `FSN-HOOK-SLAM` / `FSN-GRAVITY-TAX` rooms below ship a **fallback** until `effectCategory` callers exist — they do not fake bash as “more Strike.”
- Tripwire must **not** be `placeBarrier`. Until that redefine lands, ENC-WIRE-01 teaches with **visible** `WF-TRP-CHEVRON_PLATE` only.
- Do not pack Wave-3 `coup_duelist` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-clock lesson.
- Isolation Chill (`WF-ENV-ISOLATION_CHILL`) **skips** if the map would start with only one living unit so a warm pair cannot exist.

---

## 3. Dungeon pacing (Tide / File / Clock primer + inserts)

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

| Beat | Depth hint | Job | Day-4 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (leave the file, needle camp-tax, loan a cast) | ENC-TEACH-04, ENC-SPELL-07, ENC-HAZ-07 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-05, ENC-AMBUSH-04 |
| Combine | 2–3 | Two taught verbs | ENC-HAZ-08, ENC-WIRE-01, ENC-MOVE-06, ENC-FILE-01, ENC-REINF-04 |
| Pressure | 3 | Clock, cart, isolation, or hook-slam | ENC-SURV-07, ENC-BELL-01, ENC-SLAM-01, ENC-PROT-04, ENC-CART-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-04, ENC-BRANCH-04, ENC-TREAS-04, ENC-OATH-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-06, ENC-ELITE-07, ENC-RARE-04, ENC-MAST-04, ENC-PRIO-06 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-05, ENC-BOSS-04, ENC-RUSH-11…14 |

Day-1 Ash / Ice, day-2 Void, and day-3 Hex chains remain valid. Day-4 **Tide / File / Clock primer** is the default for accounts that already cleared Ash, Ice, Void, **and** Hex once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-04

ENCOUNTER_ID: ENC-TEACH-04  
TYPE: teach mechanic / file geometry  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `FSN-FILE-GUARD/SOLO-FILE` — 1× `ROLE-LANCER` rook (Strike **only**, commits only on a shared file or rank). No protector, no elites, no families. Band 0.  
AI_REQUIREMENTS: Lancer is a charger that **skips** unless `player.x === lancer.x || player.y === lancer.y` (linear clone id optional — the AI contract is the teacher). No LoS puzzle, no group-tactics, no lethal lookahead. `instantKill` / `betrayal` off.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a geometry lesson. Optional later shrine names `proposed:spell-file-thrust` / `spell-file-lance` if that catalog lands.  
MAP_REQUIREMENTS: `chessboard` or `fortress` with **one 4-tile open file plus a gallery**. Reject a 1-tile tunnel. No lava/ice/spikes. No `paper_windstorm` (file is physical). Player spawn **off** the file. One locked exit at the far gallery.  
SPECIAL_RULES: `scriptedHazardsOnly`. First skipped lancer turn while the player is off-file logs a teach line. Do not also spawn a protector (that is ENC-WAVE-05 / ENC-ELITE-06). Reroll this id if the generated map has no 4-tile file.  
OBJECTIVE: Defeat the lancer. Optional: never share a rank.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “the rook only charges on your file; stepping into the gallery is the answer, not a bigger nuke.” Prepares ENC-ELITE-06 / `FSN-FILE-GUARD`. Distinct from ENC-TEACH-03 (wind halves **range**).  
SOLVABILITY_REQUIREMENTS: Lancer reachable by walking the gallery; a side aisle so the player can leave the file after a misstep. File never blocked by a barrier at spawn.  
REPLAYABILITY: File north–south vs east–west.  
SCALING_BEHAVIOUR: Do not raise levels. Mid: add the junior protector (`FSN-FILE-GUARD` PAIR) on the gallery. High: lancer gains `spell-haste` to re-align (still no Inferno, still no bash). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-07

ENCOUNTER_ID: ENC-HAZ-07  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× `tide_shade` bishop (`starter-frost` only).  
AI_REQUIREMENTS: Pawns start healthy so they may **end** one turn on needle grass; wounded pawns (`ENEMY_HAZARD_AVOID_HP_PCT`) refuse to end on grass. Bishop kites from clean floor. One Slow **or** Frost, never both stacked past −2 with live tide melee.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a second grass tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: A needle patch of 4–8 `WF-HAZ-NEEDLE_GRASS` tiles across the mid-band (walk-through **free**; ending a turn on a needle tile costs 4% max HP). A clean detour of ≥ 1 tile exists. Exit behind the bishop. Distinct from ENC-HAZ-01 (ice MP) and ENC-HAZ-05 (salt hop tax).  
SPECIAL_RULES: Scripted needle only. Do not mix salt or ice on this id. Counts toward `MAX_HAZARD_TILES`. Tax via `recordInBattleChallengeDamage` while `inBattleRef`. Never the only cell in a corridor.  
OBJECTIVE: Clear all. Intended line: cut through and **keep moving**, or take the clean detour.  
FAILURE_CONDITION: Player death (frost + camp tax).  
REWARD: Standard. Overlay `under_50_damage` rewards ending off the grass.  
TACTICAL_PURPOSE: Teach “walking the barbs is free; camping them is the tax.” Prepares ENC-MAST-04 (needle + file).  
SOLVABILITY_REQUIREMENTS: Clean detour reaches both pawns and the bishop. Grass never walls a corridor. Grass not on spawn±3 or the portal.  
REPLAYABILITY: Patch as a stripe vs a chevron.  
SCALING_BEHAVIOUR: Mid: add `swift_winds` (+2 MP) so the player *can* dash across and still end off-grass. High: bishop gains `spell-slow` **or** inherit 2 needle tiles from ENC-HAZ-07 into ENC-WAVE-05 — never both Slow and a second DoT. Never thicken the patch into a wall.  
STATUS: PROPOSED

---

### ENC-HAZ-08

ENCOUNTER_ID: ENC-HAZ-08  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-IRON-TIDE` — 1× `iron_golem` tank (Strike; Iron Skin at band 1) + 1× `tide_shade` kiter (`starter-frost`). No healer, no Swap, no Inferno.  
AI_REQUIREMENTS: Tank holds a **wide** lane. Shade keeps Chebyshev ≥ 3 and spends AP on Frost, repositioning 1–2 steps if LoS dies. Tank below 30% retreats **behind** the shade (`defensiveRetreat` once soph ≥ 3), not through the player.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Frost on a kiter that **leaves** (not a fat gun) can drop `starter-frost` if missing.  
MAP_REQUIREMENTS: `openField` / `arena` / `chessboard` with wide files. Reject `corridorMaze`. One `WF-HAZ-ORBIT_CINDER` 4-tile painted square in the **flank**, not the only approach (cinder steps one cell clockwise at round start; landing costs 5% max HP). A path around the square remains. Optional leftover 2 needle tiles from ENC-HAZ-07 (`inheritHazardsFrom: ENC-HAZ-07`) off the only path.  
SPECIAL_RULES: Scripted orbit only. Cinder never covers spawn/portal. Tank and shade start ≥ Chebyshev 4 from each other and from the player. Do not also apply `paper_windstorm` **and** a kiter unless the chain already taught wind (ENC-TEACH-03) — then it is fair (hits the kiter too).  
OBJECTIVE: Clear all. Intended line: stand in the hollow of the square, cut a side aisle, collapse the shade.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + frost observation. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine “the gun leaves” (`FSN-IRON-TIDE`) with a moving rim tax so standing in the lane is the wrong answer twice.  
SOLVABILITY_REQUIREMENTS: Path around the square; 2-unit occupancy leaves walk-offs; orbit counts as 1 toward the hazard cap.  
REPLAYABILITY: Square NW vs SE. Band 1 Slow (`FSN-IRON-TIDE/SLOW`) vs Poison — pick one.  
SCALING_BEHAVIOUR: High: elite tank (`FSN-IRON-TIDE/E-IRON`), shade stays junior. Peak: convert wave leftover to ENC-ELITE-07. Never add lava dest for the cinder.  
STATUS: PROPOSED

---

### ENC-WAVE-05

ENCOUNTER_ID: ENC-WAVE-05  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-IRON-TIDE` (golem + tide-shade). Wave 2: `FSN-FILE-GUARD` (lancer + gallery protector). Wave 3: leftover shade **or** leftover lancer, never both. Never more than 4 living hostiles. Band 0: FILE-GUARD lancer is Strike-on-file only.  
AI_REQUIREMENTS: Wave 1 kite contract. Wave 2 file contract + protector body-blocks the **gallery**, not the file (the file is the designed answer). Wave 3 leftover uses the same contract as its parent. No summons.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: observing both Frost-kite and file-skip in one room can later hint File Lance at a boss door.  
MAP_REQUIREMENTS: Fortress / chessboard that satisfies **both** a wide lane (IRON-TIDE) **and** one 4-tile file plus gallery (FILE-GUARD). `waveSpawnCells` in the far lane. Optional needle inherit from ENC-HAZ-07 on a **flank**, not the file. Reject maps that fail either geometry.  
SPECIAL_RULES: Portal locked until the last living hostile of wave 3 is dead **or** `holdPortalLocked` until wave 3 spawns. Hard-cap 4 living. Random 30% family lottery **off**.  
OBJECTIVE: Survive the waves; clear all.  
FAILURE_CONDITION: Player death.  
REWARD: Standard wave table + depth Doka. Overlay `under_10_turns` is tight; prefer `under_15_turns` on first clear.  
TACTICAL_PURPOSE: Reinforce both teach verbs in sequence so mastery is not “the same PAIR twice.” Prepares ENC-MAST-04.  
SOLVABILITY_REQUIREMENTS: Wave spawn cells reachable and not on the portal. Gallery exists after wave 1 debris (no new walls).  
REPLAYABILITY: Wave 2 can swap to `FSN-TIDE-STORM/FROST-ONLY` if the account already answered FILE-GUARD this week (leftover drop-2 kiter + artillery, still one Slow source).  
SCALING_BEHAVIOUR: High: wave 3 leftover is `FSN-FILE-GUARD/E-RANK` (elite lancer, Haste to re-align, still no bash). Peak: wave 1 shade is elite, tank stays junior. No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-04

ENCOUNTER_ID: ENC-AMBUSH-04  
TYPE: ambush / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× `WF-TRP-CHEVRON_PLATE` (always-visible; stepping from the painted facing is free, any other approach costs 8% max HP once then the plate becomes floor) + 1× sleeping-looking pawn on a cot. Hidden until wake: `WF-INV-SLEEPING_VANGUARD` — 2× same-band elites (hard threat): one `FSN-MEND-KNIFE` assassin (`physical_attack` + `spell-venom-strike`) + one self-mend queen (`starter-heal` only). Band 0: **do not** spawn MEND-KNIFE (heal is band 1) — substitute `FSN-FROST-KNIFE` (controller + assassin, no self-mend).  
AI_REQUIREMENTS: Cots do not wander. Adjacent contact wakes both. Assassin paths a flank that is **not** the only player exit. Queen stays ≥ 3 back and self-mends under 50%. No Shadow Veil on PAIR (that is `FSN-VEIL-HEX`). No Inferno on the queen.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Venom or Blood Mend can drop that id if missing.  
MAP_REQUIREMENTS: Courtyard. Chevron on a **side** approach to the cots, never the only path. Exit reachable without stepping adjacent to a cot **in exploration**. In a dungeon-chain both elites count as hostiles for map-clear. Cots are floor. Counts as 2 toward `MAX_ENEMIES`.  
SPECIAL_RULES: Exploration: leave without waking is legal. Dungeon-chain: portal locked while they live (must fight). Wake starts a normal battle at full HP. Victory pays hard-band Doka. Cap 2 elites + 0 trash. Do not also hide a tripwire (trap redefine is not ready).  
OBJECTIVE: In a run: defeat both. In exploration: wake for the purse or give the cots a wide berth.  
FAILURE_CONDITION: Player death after waking. Leaving asleep is success-with-less.  
REWARD: Hard-band depth Doka on a fight win. Skip: 0 extra. Overlay `under_50_damage` if they woke via the chevron’s safe facing.  
TACTICAL_PURPOSE: Ambush that is **readable** (cots + painted chevron) rather than fog concealment. Teaches “approach from the mark.” Distinct from ENC-AMBUSH-03 (lantern + lurker).  
SOLVABILITY_REQUIREMENTS: Long path never adjacent to cots. Chevron walkable before and after. Two elites start ≥ Chebyshev 4 from the player once combat begins.  
REPLAYABILITY: Assassin/queen vs `FSN-MIRROR-REAVE` (reflect + haste closer) for accounts that already answered MEND-KNIFE.  
SCALING_BEHAVIOUR: High: elite assassin (`FSN-MEND-KNIFE/E-VENOM`), healer stays junior. Peak: `FSN-MEND-KNIFE/EMBER` (live melee burn) still no Inferno on the queen.  
STATUS: PROPOSED

---

### ENC-REINF-04

ENCOUNTER_ID: ENC-REINF-04  
TYPE: reinforcements / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-EMBER-MEND/NO-PAWN` — 1× `ember_knight` (`physical_attack`; live melee-burn; `spell-inferno` **only** if kit band 2 and not the same turn as a melee apply) + 1× `bone_scribe` queen (`starter-heal` self; `starter-shield` on the knight **only if** ally `targetId` apply exists, else self-mend only). When the ember is marked **or** drops below 50%, a 1-pawn reinforcement spawns on `reinfCells` (cap 1 extra, hard-cap 3 living). No Swap, no martyr, no Mark (those are `FSN-ASH-COURT`).  
AI_REQUIREMENTS: Ember is a flanker, **not** berserk. Healer stays at 4, opposite corner, with `AI_BACKLINE_PROTECT` at soph 4. Pawn is a greedy charger. Band 0: **do not spawn this id** — show ENC-HAZ-08 instead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Inferno or Shield can drop that id if missing.  
MAP_REQUIREMENTS: `asymmetric` or `ruinsIslands` with two approaches. One may be warm flavor; one must be clean. Reject lava-painted engagement + Inferno. Healer needs a retreat tile that is not the ember’s choke. Optional 2 needle tiles on the **clean** approach only if ENC-HAZ-07 was taught this chain.  
SPECIAL_RULES: `isSummoner` off. Random 12% summoner overlay **off** on both bodies. If ally Shield apply is missing, the sheet is a softer burn + glass healer (still valid). Do not also give the ember lifesteal-on-burn (`vampiric_ground` off).  
OBJECTIVE: Clear all, including the pawn if it spawned. Intended line: burst the scribe first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `no_healing` is fair (the tax is burn).  
TACTICAL_PURPOSE: Hazard + healer without a displacer — drop-1 never stacked those two. Reinforcement is the “second burn body,” not a new verb.  
SOLVABILITY_REQUIREMENTS: `reinfCells` reachable, not on the portal, ≥ Chebyshev 4 from the player. Two approaches remain after the pawn exists.  
REPLAYABILITY: `FSN-EMBER-MEND/NO-INFERNO` (melee burn only) vs full band-2 Inferno.  
SCALING_BEHAVIOUR: High: elite ember, healer stays junior. Peak: convert to `FSN-ASH-COURT/NO-FUSE` (ember + glyph, leftover drop-2) only if the chain already taught Mark (ENC-SPELL-06). Still one Inferno cadence.  
STATUS: PROPOSED

---

### ENC-SURV-07

ENCOUNTER_ID: ENC-SURV-07  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Clock 8. Wave A: `FSN-IRON-TIDE` shade only (no tank — isolation is the tank). Wave B overlaps at turn 3: 1× pawn charger. Wave C at turn 6: 1× junior golem. Overlap allowed; hard-cap 3 living (player + 3 hostiles + optional player summon can share rings).  
AI_REQUIREMENTS: Shade kites at 3. Pawn greedy. Golem camps a warm ring around the shade if Isolation is on. Full gates except `instantKill` / `betrayal`.  
SPELL_DISCOVERY_OPPORTUNITIES: Holding to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-ENV-ISOLATION_CHILL` (end of each combatant turn, if no other living unit is within 3 Chebyshev, pay 3% max HP). Painted warm rings. **Skip this id** if the map would start with only one living unit. Optional leftover orbit square from ENC-HAZ-08 on a **rim** that is not the only warm huddle. Never `titans_vigor`. Never Glass Realm.  
SPECIAL_RULES: Summons count as living units (a front-liner shares the ring). Tax via challenge HP recorders. Flee remnants when the clock ends. Portal locked until the clock completes **or** all hostiles are dead.  
OBJECTIVE: Survive the clock, then clean or let flee. Intended line: clump or summon to stay warm; do not kite alone.  
FAILURE_CONDITION: Player death.  
REWARD: Survival table (higher than a standard clear). Overlay `no_healing` (not `no_damage_taken` — the chill is a tax).  
TACTICAL_PURPOSE: Pressure that spends leftover wave-3 Isolation so late-game maps are not “void again,” “salt again,” or “ash-rain again.”  
SOLVABILITY_REQUIREMENTS: A warm pair can exist at spawn (player + at least one hostile within 3 is **not** required at t=0; a huddle tile between them must exist). Chill never seals spawn or exit.  
REPLAYABILITY: Wave C golem vs tide-shade elite for Tide-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler. Do not add a fourth hostile.  
STATUS: PROPOSED

---

### ENC-ELITE-06

ENCOUNTER_ID: ENC-ELITE-06  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-FILE-GUARD/E-RANK` — elite `ROLE-LANCER` (Haste to re-align, still no bash, still no Inferno) + junior `ROLE-PROTECTOR` golem on the gallery. Elite is not a boss: no phase table, no `BossAbility`.  
AI_REQUIREMENTS: Lancer linear-only (`AI-SYS-06` or skip-unless-shared-axis). Protector body-blocks the gallery, never stands on the file. Soph 3–4. `chokepointCamp` only if a side aisle exists.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Haste used to re-align can drop `spell-haste` if missing.  
MAP_REQUIREMENTS: Same 4-tile file + gallery as ENC-TEACH-04, tighter (gallery 1 tile). No Barrier occupying the file at spawn. Optional `WF-TER-FROST_PANE` on the **gallery** (walk-through, blocks LoS, 1 AP smash) so linear shots at the protector cost a smash — not on the file (that would hide the answer).  
SPECIAL_RULES: Family lottery off. One elite tag only.  
OBJECTIVE: Defeat both. Intended line: never share a rank; collapse the lancer from the gallery.  
FAILURE_CONDITION: Player death.  
REWARD: Elite XP on the lancer + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: File PAIR with a peel. Distinct from ENC-ELITE-03 (`FSN-IRON-BATTERY` fat artillery) and ENC-ELITE-05 (min-range sniper).  
SOLVABILITY_REQUIREMENTS: Gallery smash is optional; map solvable without smashing. File open.  
REPLAYABILITY: File N–S vs E–W. Protector can sit on knight chassis at mid (still gallery peel).  
SCALING_BEHAVIOUR: Promote bash only by converting to ENC-SLAM-01 / `FSN-HOOK-SLAM`, never on this PAIR. Peak: convert to ENC-RARE-04 (`FSN-FILE-WIRE`) if ENC-WIRE-01 was answered this account.  
STATUS: PROPOSED

---

### ENC-ELITE-07

ENCOUNTER_ID: ENC-ELITE-07  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-IRON-TIDE/E-IRON` — elite `iron_golem` tank + junior `tide_shade` (`starter-frost`; band 1 Slow **or** Poison, never both).  
AI_REQUIREMENTS: Same IRON-TIDE contracts. Elite tank may `chokepointCamp` if a side aisle exists. Shade still refuses to walk in at PAIR.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Iron Skin can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Wide files. Optional `WF-MOD-SHORT_FUSE` (spells with `cooldown > 0` cannot be cast on round 1 — reads `SpellConfig.cooldown` only). Melee, Attack Nearest, summons, and 0-cooldown kits remain usable.  
SPECIAL_RULES: Short Fuse is the elite tax, not more HP. Do not also attach Time Warp. Do not attach Isolation (that is ENC-SURV-07).  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Elite XP on the tank + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: “The gun leaves” at elite grade, plus a round-1 cooldown lock so the opener is walk or Strike. Distinct from ENC-ELITE-04 (Enrage bruiser).  
SOLVABILITY_REQUIREMENTS: Side aisle; shade reachable; Short Fuse does not block tiles.  
REPLAYABILITY: Slow vs Poison band-1 pick. Short Fuse on/off for accounts that already know the PAIR.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-TIDE-STORM/FROST-ONLY` (leftover drop-2 kiter + storm artillery) still one Slow source, still no `starter-blast` until bounce apply is honest.  
STATUS: PROPOSED

---

### ENC-PROT-04

ENCOUNTER_ID: ENC-PROT-04  
TYPE: protection objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× pawn charger + 1× bishop kiter (`starter-frost`). Neither starts on the drum.  
AI_REQUIREMENTS: First enemy that can legally end a turn on `WF-ZON-RALLY_DRUM` **will** (MP refund 1, then the tile dries). After it dries, both fight normally. Player can deny by ending there first.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Courtyard with a bronze `WF-ZON-RALLY_DRUM` inlay (walkable, optional, never on spawn/portals). A second approach so contesting the drum is not the only path to the bishop. Optional needle patch on the **long** path (ENC-HAZ-07 inherit) so racing the drum has a price.  
SPECIAL_RULES: Drum refund is MP, not a spell and not a heal. Does not call `saveBattleStats` or `applyRewards`. Null Field does not strip it. Enemies can use it. Occupying the drum is **not** required to unlock the portal — killing hostiles is. Optional challenge: occupy the drum at end of the **player’s** first turn (`objectiveKind: occupy_rally_drum`).  
OBJECTIVE: Defeat both. Optional: claim the drum before the pawn does.  
FAILURE_CONDITION: Player death. Failing the optional occupy does not fail the room.  
REWARD: Standard. Optional occupy pays a small `applyRewards` crumb (easy overlay table), still clamped. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Protection that is a **contest for a resource**, not a fragile NPC (those are ENC-PROT-01…03). Teaches deny-the-refund.  
SOLVABILITY_REQUIREMENTS: Drum optional; map solvable if never used. Hostiles reachable without the drum.  
REPLAYABILITY: Drum center vs gallery.  
SCALING_BEHAVIOUR: High: bishop gains Haste after the drum dries (one cycle). Peak: add `WF-ZON-SECOND_WIND` on a **different** tile (AP refund) — still one claim each, never stack both refunds on one tile.  
STATUS: PROPOSED

---

### ENC-PRIO-06

ENCOUNTER_ID: ENC-PRIO-06  
TYPE: priority-target battle  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BELL-CUT` — 1× `ROLE-CLOCK` queen **without heal** (`proposed:spell-grave-bell` + `spell-weaken`; **no** Inferno, drain, Glass Realm, Time Warp) + 1× `ROLE-EXECUTE` knight (`physical_attack` + `spell-mark`; Sacrifice off until player ≤ 30% **and** Bell is ticking). If Grave Bell is not a live id, the clock is a **painted 2-turn pip** on the queen’s tile (`objectiveKind: survive_bell_pip`) that deals 0 on “cast” and 10 at tick (36 only if HP% ≤ 30) via challenge HP — never a hidden damage formula rewrite.  
AI_REQUIREMENTS: Clock: caster; never recast the same bell pair; heal-less so inference stays caster. Never Bell a full-HP player on turn 1. Execute: lurk at 3; commit when Bell is ticking **or** HP% ≤ 40. Soph 2–3. Do **not** pack `coup_duelist` here.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Weaken / Mark can drop those ids. Grave Bell observation only if the live spell id exists.  
MAP_REQUIREMENTS: `openField` or `arena`. Jackal needs a flank path that is not the only exit. Sexton needs a retreat tile. No Thorned Ground on the only path to the Sexton. ≥ 2 walk-offs from wherever Bell can land. Hostiles start ≥ Chebyshev 4 apart.  
SPECIAL_RULES: Killing the Sexton does **not** clear the Bell / pip — that is the read. The Jackal is the body you can delete to make 10 survivable. Mend above 30% before the tick is the other answer. If pack size would be 1, reroll.  
OBJECTIVE: Defeat both. Intended line: burst the Jackal, then eat 10 — **or** heal above 30% and ignore the knife.  
FAILURE_CONDITION: Player death (especially trading the Jackal at ≤ 30%).  
REWARD: Standard + discovery. Overlay `no_healing` is the hard read of this room (fair only after the account has seen the pip once without the overlay).  
TACTICAL_PURPOSE: Priority is the **execute**, not the clock body. Prepares ENC-RUSH-14 (pendulum vs wick — one answer at a time) and `FSN-BELL-COURT`.  
SOLVABILITY_REQUIREMENTS: Two approaches; player can heal or kill the Jackal before tick; pip/Bell never walls a tile.  
REPLAYABILITY: `FSN-BELL-CUT/WOUND` (Cursed Wound on the window) at peak, still no Glass Realm.  
SCALING_BEHAVIOUR: Elite Sexton only (`FSN-BELL-CUT/E-BELL`). Jackal stays junior so two elites cannot 100–0 from full HP. Convert to `FSN-BELL-COURT` only after this CELL is answered.  
STATUS: PROPOSED

---

### ENC-MOVE-06

ENCOUNTER_ID: ENC-MOVE-06  
TYPE: movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop kiter (`starter-frost`) on the **long** path + 1× pawn on the far side of the bridge.  
AI_REQUIREMENTS: Bishop kites. Pawn is greedy once the player shares a path. Neither camps the bridge as a wall.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-OBS-SPENT_BRIDGE` — a short-path floor cell with three painted pips. Each time **any** unit leaves the cell, one pip burns. After three crossings the cell becomes a wall for the rest of the map. Place **only** when a second spawn→portal route already exists. Evaluate solvability **as if the bridge were already a wall**. Departure/portal never on the bridge.  
SPECIAL_RULES: No damage. Teleport / Mist Step past does not spend a pip (wave-3 identity: teleport does not trip). Optional `objectiveKind: cross_bridge_twice` (use two pips, save one for retreat).  
OBJECTIVE: Clear all. Optional: spend at most two crossings.  
FAILURE_CONDITION: Player death. Burning the third pip does not fail the room if the long path remains. Soft-lock is a **design bug** — do not ship without the long path.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Movement as a **budget**, not a race clock (those are ENC-MOVE-01…05). Teaches “the short path is finite.”  
SOLVABILITY_REQUIREMENTS: Long path works with the bridge treated as a wall from turn 0. Bridge never the only exit. Never on spawn±3.  
REPLAYABILITY: Bridge north vs east.  
SCALING_BEHAVIOUR: High: bishop gains Slow (still one MP story). Peak: add ENC-FILE-01’s frost pane on the long path so the budget vs LoS smash is a real choice. Never reduce to two pips.  
STATUS: PROPOSED

---

### ENC-MOVE-07

ENCOUNTER_ID: ENC-MOVE-07  
TYPE: movement objective / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `ROLE-MIST` knight (`physical_attack`; `proposed:spell-mist-step` **only if** that id is enemy-legal for this body — else Haste + Strike, dest must still be a free non-void flank). 1× pawn charger. No lurker (that is `FSN-MIST-HUNT`).  
AI_REQUIREMENTS: Mist Steps (or Hastes) to a rear/side tile that is not the only player exit, then Strikes next turn. Never turn-1 surround. Start ≥ Chebyshev 4. If Step id is missing, do not skip-lock the turn — fall through to Strike.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mist Step / Haste can drop that id if missing. Glyph fallback: `discoverSpellId: spell-haste` on a triune pad.  
MAP_REQUIREMENTS: `asymmetric` with two flanks. Three `WF-TEL-TRIUNE_PADS` (1→2→3→1, 1 MP, occupied pads swap). All three on floor, not on spawn/portals. Map solvable **without** using them. Optional one `WF-TER-FROST_PANE` between pad 1 and 2 (walk-through LoS wall).  
SPECIAL_RULES: Pads cost 1 MP from the unit’s current MP. Not a teleport spell — do not key off `effectCategory`. Player standing on the next clockwise pad blocks or forces a swap. Reject cramped `corridorMaze`.  
OBJECTIVE: Clear all. Optional: use a pad once to break melee.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine a dash assassin with a **player-usable** carousel so displacement is a tool, not only an enemy hook. Prepares ENC-SLAM-01.  
SOLVABILITY_REQUIREMENTS: Trio optional; frost pane smash optional; two flanks remain if pad 2 is occupied.  
REPLAYABILITY: Pad order clockwise vs mirrored.  
SCALING_BEHAVIOUR: High: full `FSN-MIST-HUNT/NO-LEECH` (add lurker, still no familiar). Peak: `FSN-MIST-HUNT` with bait familiar only if `spell-blood-familiar` is live **and** summoner cooldown fall-through exists (today skip-lock must not ship).  
STATUS: PROPOSED

---

### ENC-FILE-01

ENCOUNTER_ID: ENC-FILE-01  
TYPE: file / combine / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-FILE-GUARD` PAIR (lancer + gallery protector).  
AI_REQUIREMENTS: Same as ENC-TEACH-04 / ENC-ELITE-06 without the elite tag. Protector does not smash panes.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: 4-tile file + gallery. One `WF-TER-FROST_PANE` **on the file** between player and lancer (walk through blind, or 1 AP smash for LoS). A second pane must **not** seal the gallery. Optional chevron on the gallery approach (`inherit` from ENC-AMBUSH-04 facing).  
SPECIAL_RULES: Smash is occupancy, 1 AP, no damage, no spell. Pane is a wall for LoS until smashed, floor for walk. Never on spawn/portals. Do not also apply `WF-MOD-LOW_CEILING` (double LoS tax).  
OBJECTIVE: Defeat both. Intended line: walk the gallery (ignore the pane) **or** smash and snipe the lancer.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit` is fair only if the player smashed (otherwise it punishes the designed gallery answer — do not advertise `direct_hit` on first clear).  
TACTICAL_PURPOSE: File geometry + LoS furniture. The pane is a **question**, not cover for a sniper (that is ENC-ELITE-05).  
SOLVABILITY_REQUIREMENTS: Gallery never gated by a pane. Smash optional. File remains walkable through the pane.  
REPLAYABILITY: Pane on file vs pane on gallery (ENC-ELITE-06 already used gallery).  
SCALING_BEHAVIOUR: High: lancer Haste. Peak: convert to `FSN-FILE-WIRE/NO-LEADER` only after ENC-WIRE-01.  
STATUS: PROPOSED

---

### ENC-BELL-01

ENCOUNTER_ID: ENC-BELL-01  
TYPE: teach mechanic / clock (pressure-adjacent)  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Teaching CELL: 1× clock queen (`spell-weaken` only + painted pip) + 1× jackal knight (`physical_attack` only, no Mark, no Sacrifice). Softer than ENC-PRIO-06.  
AI_REQUIREMENTS: Queen Bells/pips only if player HP% ≤ 70 (already wounded from the map) **or** always shows the icon at TEACH if a public DoT is already on the player — never pip a full-HP player on turn 1. Jackal ignores a healthy player; commits at ≤ 40% or when the pip is ticking.  
SPELL_DISCOVERY_OPPORTUNITIES: Glyph on the queen’s retreat tile: `discoverSpellId: starter-heal` if the player does not own Blood Mend (self-heal is the designed answer). If already owned, glyph is `spell-mark`.  
MAP_REQUIREMENTS: Open court. Two walk-offs. No Isolation Chill (double clock). No Thorned Ground.  
SPECIAL_RULES: First pip that resolves for 10 while the player is ≥ 31% logs a teach line (“the knife is the spike”). Glyph despawns unused when the last enemy dies (still a win).  
OBJECTIVE: Clear. Optional: pick up the glyph and mend before the tick.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach the Bell read **before** ENC-PRIO-06 adds Mark and Wound. Distinct from ENC-SPELL-05 (Enrage king).  
SOLVABILITY_REQUIREMENTS: Glyph free floor, not a portal. Jackal flank is not the only exit.  
REPLAYABILITY: Glyph left/right alcove.  
SCALING_BEHAVIOUR: Does not scale; it retires into ENC-PRIO-06 when the account has seen one pip.  
STATUS: PROPOSED

---

### ENC-WIRE-01

ENCOUNTER_ID: ENC-WIRE-01  
TYPE: trap / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WIRE-ROOT/LIVE-FROST` — 1× `ROLE-TRAPPER` rook (no hidden wire until trap ≠ `placeBarrier`) + 1× `ROLE-ROOTER` bishop (`starter-frost` only if Root id is not ready; live Root Snare if walk-lock-with-spells-legal exists).  
AI_REQUIREMENTS: Trapper: setter that **steps onto then off** a visible `WF-TRP-CHEVRON_PLATE` (the plate **is** the wire for this drop). Never plate both approaches. Never plate the only tile that reaches the Weaver. Rooter: caster; will not refresh Root; Root only if a walk-off after expiry **or** a legal cast from the tile exists. Spells stay legal on a rooted tile. No Slow (third MP story). No Inferno. No Time Warp.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Frost / Root can drop that id. Chevron is not a spell.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, **or** `corridorMaze` **with a detour**. Reject a 1-tile tunnel (plate + Root on the only tile is a hardlock). Chevron always visible. Never on spawn/portals.  
SPECIAL_RULES: Do not ship a hidden tripwire while `isTrap → placeBarrier`. Teleport / Mist Step does **not** trigger the chevron (wave-3 trap identity). Probe with a summon must be possible. Elite: Weaver only.  
OBJECTIVE: Clear all. Intended line: enter from the chevron facing, or go around; cast from a rooted tile.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Information (facing) plus a walk lock. Teaching pair for File & Wire without the Lancer yet.  
SOLVABILITY_REQUIREMENTS: Second approach exists. Plate walkable before and after. Root expires.  
REPLAYABILITY: Chevron facing N vs E. `FSN-WIRE-ROOT/DECOY` (Mark on a **different** tile) at high band if Mark is owned.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-FILE-WIRE/NO-LEADER` (add lancer) only after ENC-TEACH-04. Still one wire.  
STATUS: PROPOSED

---

### ENC-SLAM-01

ENCOUNTER_ID: ENC-SLAM-01  
TYPE: displacement / pressure  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-HOOK-SLAM` — 1× `ROLE-ANCHOR` bishop (Hook Line if `applyAttract` has an `effectCategory` caller; else frost + skip-if-adjacent so **hug the bishop** is still the immune) + 1× `ROLE-PUSHER` pawn or knight (Shoulder Bash **only** if `applyPushback` has a caller **and** dest scoring is not “more Strike”; else the pusher is a flank charger that **skips** bash into open floor — occupancy bump into a wall allowed if a side step remains). No Swap. No Inferno. No martyr. Distinct from ENC-FUSE-01 (Swap + kamikaze) and ENC-DISP-01 (mirror step).  
AI_REQUIREMENTS: Anchor: caster; skip hook if landing is safer for the player; adjacent = immune; dest free floor, not lava / spikes / void / portal, player keeps ≥ 1 escape tile. Pusher: charger; skip bash into open floor; dest must not use lava. Never turn-1 double displace onto one tile. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Hook Line / Shoulder Bash can drop those ids if live. Else frost observation only.  
MAP_REQUIREMENTS: `arena` or `asymmetric` with **pillars / a wall 2 tiles from typical stand**, plus open floor the other way. Reject `corridorMaze`. No Void Rift tile as a legal landing. No lava dest. Optional triune pad **off** the hook ray (ENC-MOVE-07 inherit) as a player escape.  
SPECIAL_RULES: If **neither** attract nor push caller exists, **do not spawn this id** — show ENC-MOVE-07 (pads as the displacement teacher). Do not fake bash as extra Strike damage.  
OBJECTIVE: Defeat both. Intended line: stand adjacent to the Anchor; keep a tile behind you.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Attract then push. Wave-2 Gravity Choir minus the tax (tax is `FSN-GRAVITY-TAX`, peak convert only).  
SOLVABILITY_REQUIREMENTS: Hook and bash dests each leave a walk-off. Diagonal-only stance is a full answer.  
REPLAYABILITY: `FSN-HOOK-SLAM/KNIGHT` (flank pusher) vs pawn.  
SCALING_BEHAVIOUR: Elite Pusher only (`FSN-HOOK-SLAM/E-BASH`). Peak: `FSN-GRAVITY-TAX` (add `ROLE-TAX` Glyph Tax zone) only after this CELL is answered **and** tax id is live. Still no lava dest. Still one AP-tax engine.  
STATUS: PROPOSED

---

### ENC-CART-01

ENCOUNTER_ID: ENC-CART-01  
TYPE: elite / movement / intercept  
RELATIVE_DIFFICULTY: HIGH (opt-in in exploration; required in a run)  
ENEMY_COMPOSITION: 1× `WF-ELT-CART_GUARD` elite rook (`spell-iron-skin` + Strike; same-tier × hard). Escorts a painted cart one tile per wander along a 5–7 tile path toward a marked departure cell.  
AI_REQUIREMENTS: World: wander along the path, no combat until touch. In-run: they do **not** depart — required for map-clear (`holdPortalLocked` while the elite lives). In combat: charger / `chokepointCamp` on the path.  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing.  
MAP_REQUIREMENTS: Path is floor. Exit reachable without touching the elite. Counts as 1 toward `MAX_ENEMIES`. Departure is never a portal and never spawn±3. Place only when a second spawn→portal route exists. Distinct from ENC-TOLL-01 (stationary short-path keeper).  
SPECIAL_RULES: Exploration: intercept to fight (hard purse), or let them depart (no fight, no purse, departure does **not** call `applyRewards`). Dungeon / boss rush: must fight. Extra spells from `usableByEnemy` only.  
OBJECTIVE: In a run: defeat the escort. In exploration: intercept, or let them leave.  
FAILURE_CONDITION: Player death after committing to the fight. Departure is success-with-less.  
REWARD: Hard-band Doka on a fight win. Departure: 0 extra. Overlay `under_10_turns` (the cart is the clock).  
TACTICAL_PURPOSE: A moving elite with a **leave-the-map** fail for the purse, not HP. Pressure beat that is not Isolation or Bell.  
SOLVABILITY_REQUIREMENTS: Long path works with the elite treated as a wall. Departure cell is floor, not an exit.  
REPLAYABILITY: Escort chassis rook vs `FSN-FILE-GUARD` lancer (file is the path).  
SCALING_BEHAVIOUR: Peak: escort is `FSN-FILE-GUARD/E-RANK` (still one elite tag). Do not add a second cart.  
STATUS: PROPOSED

---

### ENC-OATH-01

ENCOUNTER_ID: ENC-OATH-01  
TYPE: treasure / risk / optional challenge  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Flag tile: `WF-RSK-STILLNESS_OATH`. If the player flags, spawn `FSN-IRON-TIDE` (golem + shade) on `oathCells` — they **walk to the player** (chargers / kiter that still keeps range 3).  
AI_REQUIREMENTS: Pack uses IRON-TIDE contracts. Shade may kite **toward** the player’s huddle so the player can answer without walking.  
SPELL_DISCOVERY_OPPORTUNITIES: None guaranteed. Frost observation if they fight.  
MAP_REQUIREMENTS: Slate inlay + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the flagged fight is won. Oath tile never on spawn/portals.  
SPECIAL_RULES: End a turn on the slate to flag this map. While flagged, any **player MP spend** clears the flag. Attack Nearest, AP spells, and summons do **not**. If the flag is still held at the next `applyRewards`, that credit uses the hard multiplier. Walk and 1 MP tiles (triune pads, slipstream) clear it. Death still uses `saveBattleStats`. Losing the fight is a normal death. Distinct from ENC-TREAS-03 compact (incoming tax) and ENC-TREAS-02 gambit.  
OBJECTIVE: Resolve: skip, or flag and win without walking / MP.  
FAILURE_CONDITION: Player death after flag+fight. Coward / cleared flag is success-with-less.  
REWARD: Hard multiplier on the victory `applyRewards` if the flag holds. Coward: 0 extra. Overlay: none (the oath *is* the challenge).  
TACTICAL_PURPOSE: Wager that enemies will come to you (or a summon will walk). High-level players opt into constraint instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: Coward exit reachable on entry. After flag, spawn the pack on reachable cells not on the progress portal, with a path **to** the player that the AI will take.  
REPLAYABILITY: IRON-TIDE vs FILE-GUARD (lancer walks the file to the huddle — still no player walk required if they stood off-file).  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack with `doka_fever` or `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-RARE-04

ENCOUNTER_ID: ENC-RARE-04  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-FILE-WIRE/NO-LEADER` (lancer + trapper + rooter) **or**, if the account has not answered ENC-WIRE-01, `FSN-SHARD-BATTERY/LANE` (castellan + glyph only — drop Ricochet and optional Lancer). Rare elite tag on the lancer / castellan only (`variant: rare_elite`). Turret cap 1, lifespan 4, `mp: 0`, must not path; shares `ENEMY_SUMMON_CAP`.  
AI_REQUIREMENTS: CADRE/COURT contracts. `escapeRoute` on the rare elite (walks to the gallery, not through the player). `instantKill` / `betrayal` off. Lethal lookahead on. `bottleneckControl` only if a gallery exists. Trapper never wires both exits. Glyph does not recast Mark on a vacated tile. Turret owner must not skip-lock if the turret id is on cooldown — fall through to Shield / Frost.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-mark`, `spell-haste`, `spell-iron-skin`, `spell-root-snare`} not yet owned. Sibling File Lance / Glyph Tax / Stone Turret if those catalogs land.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with a 4-tile file **plus** a file the player can take. Never a closed ring. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain. Turret placement ring: ≥ 3 free cells, none void.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-04 by default. Purple portal chrome only after clear. No Inferno on this sheet. One dedicated summoner engine (turret **or** none — never wolf+turret). Random 12% summoner overlay **off**.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes File & Wire / Shard Battery the primer already taught. Distinct from ENC-RARE-03 (Broken Glass / Chorus).  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket; turret ring legal if used; wire not the only cell that leaves the file.  
REPLAYABILITY: FILE-WIRE vs SHARD-BATTERY/LANE by which CELL the account answered. `FSN-PLATE-LINK/NO-CANTOR` (absorb + redirect) as a third skin only if Ward Plate **and** Pain Link are live.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale Mark uptime and gallery tightness, not HP. `FSN-SHARD-BATTERY` full COURT (add Ricochet) only if bounce predicate is honest.  
STATUS: PROPOSED

---

### ENC-TREAS-04

ENCOUNTER_ID: ENC-TREAS-04  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Devices:

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-SPLIT_CACHE` left | 1 AP: opens left, **collapses right**. Soft `applyRewards`, no guardian | Soft purse |
| `WF-TRS-SPLIT_CACHE` right | 1 AP: opens right, **collapses left**. Hard `applyRewards`, 50% one same-tier guardian (`FSN-FILE-GUARD/SOLO-FILE`) | Hard purse ± one lancer |
| `WF-EVT-HARVEST_MOON` | No AP: this map only, if current HP never dropped below 70% of max, the next `applyRewards` uses the hard multiplier | Hard victory purse on a **later** fight this map, or nothing if they already took a cache grant |

AI_REQUIREMENTS: Right-niche guardian uses FILE-GUARD/SOLO-FILE contracts if it rolls.  
SPELL_DISCOVERY_OPPORTUNITIES: Guardian frost/file skip is observable. Harvest is not a spell.  
MAP_REQUIREMENTS: Twin niches + harvest corona chrome + a white coward exit near spawn. Progress portal locked until coward-leave **or** a cache resolves **or** a guardian fight is won. Niches adjacent-open, not walls. If no guardian cell, the right niche pays the hard grant with no guardian.  
SPECIAL_RULES: Opening one cache destroys the other — no double grant. Harvest multipliers on persist-lock `applyRewards` only. HP checks after challenge recorders and combat. Death still `saveBattleStats`. Harvest does **not** rewrite `combatMath`. Distinct from ENC-TREAS-03 (urn / compact / fever). Do not stack Harvest with Fever or `titans_vigor`.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Right-niche guardian must be won if it spawned.  
FAILURE_CONDITION: Player death after guardian spawn. Coward / left-niche is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **split information** (sure small vs gamble) plus a cleanliness wager.  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. Guardian spawns on a reachable cell not on the progress portal.  
REPLAYABILITY: Left/right niches swap visually. Guardian FILE-GUARD vs IRON-TIDE shade.  
SCALING_BEHAVIOUR: Raise information (preview 50% guardian kit) rather than HP.  
STATUS: PROPOSED

---

### ENC-REST-04

ENCOUNTER_ID: ENC-REST-04  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional latch / harvest shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-TEACH-04 / ENC-BELL-01 observed File / Bell verbs, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-LOANER_MAGE` is **not** spawned on rest (would start combat) — ENC-SPELL-07 is the adjacent room.  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-04. Optional `WF-RSK-STILLNESS_OATH` tile (flag **next** room only). Optional `WF-ZON-RALLY_DRUM` (one extra shrine tap of MP, still not combat). Optional `WF-PRT-LATCH_GATE` **only if this rest is reached from overworld** (forbidden in dungeon / boss rush / Death Realm; always in addition to a reachable stable portal; unarmed it does not count as an exit).  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Latch arm cost is 1 AP; entry is a portal transition; bonus via `applyRewards` on the persist lock (same as portal +10). Death-realm guards still block entry while armed. `uiLayout` unchanged. After one full Rush clear **and** day-3 `decoy_reveal` / `half_death_rage` flags exist, shrine can enable day-4 `rushVariant` flags (`table_b_lance_hex`, `table_b_hook_goad`, `table_b_palisade_silence`, `table_b_pendulum_wick`).  
OBJECTIVE: Choose an exit. Optional: shrine, oath flag, latch gamble, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Latch bonus is a persist-lock grant on **entry**, not a rest mint.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Tide/File/Clock risk instead of a bigger number. Latch is the overworld-only extra.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. Latch never the only portal. Oath / drum / latch not on spawn.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Latch on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-BRANCH-04

ENCOUNTER_ID: ENC-BRANCH-04  
TYPE: branching paths  
RELATIVE_DIFFICULTY: LOW (the choice is the content)  
ENEMY_COMPOSITION: None on the foyer.  
AI_REQUIREMENTS: None in-foyer.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four portals: Tide (`FSN-IRON-TIDE` / Isolation → ENC-HAZ-08 or ENC-ELITE-07), File (lancer / pane / wire → ENC-TEACH-04 or ENC-FILE-01 or ENC-ELITE-06), Clock (Bell / Harvest → ENC-BELL-01 or ENC-PRIO-06), Mist (pads / cart / mist-hunt → ENC-MOVE-07 or ENC-CART-01). A sealed fifth door to ENC-RARE-04 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: tide | file | clock | mist` on the dungeon snapshot (**before** `cleanupMap`). Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-04 / ENC-BOSS-04). Day-1 stays two-door; day-2 stays Ash/Ice/Void; day-3 stays Blood/Glass/Paper/Null. This is the account-upgrade foyer after those four are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Countess / Archbishop / Grandmaster / Vampire.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Oath door (ENC-OATH-01) can replace Tide for accounts that already finished Tide this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band.  
STATUS: PROPOSED

---

### ENC-MINI-05

ENCOUNTER_ID: ENC-MINI-05  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: File Lieutenant — rook chassis, kit from `ROLE-LANCER` **plus** one Haste: Strike-on-file + `spell-haste`. 1× gallery pawn choir. Not in `BOSS_IDS`. No phase-2 table. No bash until ENC-SLAM-01 was taught this chain.  
AI_REQUIREMENTS: Lieutenant only charges on a shared axis. Choir is a greedy charger on the gallery. If the lieutenant would die off-file, it Hastes once to re-align, then Strikes only if the player shares the file.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-haste` drop (once) if used. File Lance observation only if the live id exists on this body.  
MAP_REQUIREMENTS: Small nave + one gallery. One 4-tile file. No lava. Optional one frost pane on the gallery (smash for a linear shot).  
SPECIAL_RULES: At 30% HP the lieutenant gains **one** extra Haste cycle only if the chain taught FILE-GUARD (ENC-WAVE-05 / ENC-ELITE-06). Otherwise it only skip-charges. Honest to pacing.  
OBJECTIVE: Defeat the lieutenant (choir flees on death).  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss 2× XP on the lieutenant + depth Doka. Not a Boss Rush room.  
TACTICAL_PURPOSE: File-branch capstone-adjacent without adding `cinder_lance` to `BOSS_IDS`.  
SOLVABILITY_REQUIREMENTS: Gallery connected to the nave. File open.  
REPLAYABILITY: Choir shade (frost) if Tide was taken; jackal if Clock; mist-knight if Mist.  
SCALING_BEHAVIOUR: Add a second choir body before any HP bump. Peak: lieutenant kit adds `spell-iron-skin` (still no Inferno, still no bash unless SLAM was taught).  
STATUS: PROPOSED

---

### ENC-BOSS-04

ENCOUNTER_ID: ENC-BOSS-04  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag, **preferring live 19** until Wave-2/4 kits ship:

| `branch` | Live fallback (`BOSS_IDS`) | Wave kit if shipped (still **do not** add to `BOSS_IDS` in the same PR as a string remap) |
| :--- | :--- | :--- |
| Tide | `lord_of_static` (chain / kite punish) | `rime_margrave` (ice file — **solo**; never pair with Hook or Countess) |
| File | `bone_cavalier` (charge) | `cinder_lance` |
| Clock | `chessboard_lich` (curse-zone clocks) | `unbound_pendulum` |
| Mist | `void_grandmaster` (ghosts / identify) | `hook_regent` (linear hook; **not** with Countess / Static / Rime) |

If the chain taught Bell (ENC-PRIO-06) **and** Clock was not taken, Ice/Void-mixed accounts may use `midnight_bishop` **alone** (not the Rush pair). No dual-boss unless this is a Rush injection.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for live ids. Wave kits use their bible sheets. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-05) or slam (ENC-SLAM-01) — trash does not receive boss heals / reflect / larva bursts. Shared extra cap: 4.  
SPELL_DISCOVERY_OPPORTUNITIES: File Lance / Hook Line / Rime Tile / Grave-adjacent ids follow `docs/design/BOSS_AND_SPELL_DISCOVERY.md` (use → observe → win → grant). None new invented here.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Tide may inherit Isolation **only if** a warm pair can exist (boss + player); File may inherit one frost pane on a **gallery**; Clock may inherit a painted pip chrome (no second damage clock); Mist may inherit triune pads **off** the only exit.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP. Do not pair illegal Table B holds (`rime_margrave`+`hook_regent`, two attract verbs, two shrinks).  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (kite-chain / file-charge / zone-clock / ghost-identify).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-SPELL-07

ENCOUNTER_ID: ENC-SPELL-07  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: `WF-SPL-LOANER_MAGE` — 1× same-tier enemy (medium threat) carrying 1 extra `usableByEnemy` spell (`starter-frost` on teach; `spell-slow` if frost is already owned; never barrier / mirror / timestep / rallying-cry). They stay hostile after a loan. Prefer replacing one existing spawn.  
AI_REQUIREMENTS: Generic caster / charger matching piece. Does not skip-lock after the loan.  
SPELL_DISCOVERY_OPPORTUNITIES: Adjacent 1 AP loans that spell id as a **single remaining cast** this map without killing them. Killing them grants the same one-cast if you have not already taken it (does not stack). Loan and kill-grant do **not** call `upgradeSpell` and do **not** persist `spellLevel*` arrays. After win, sibling observation pipeline may still grant the id into the owned set if the observe→win persist exists.  
MAP_REQUIREMENTS: Single room, offered-orb chrome. No extra modifiers. Must stay reachable.  
SPECIAL_RULES: If the player already owns Frost and Slow, convert to ENC-SPELL-08. Discovery does not auto-bar-insert (max 8).  
OBJECTIVE: Borrow, kill, or ignore; then clear if they remain.  
FAILURE_CONDITION: Player death. Ignoring is a win only if no other hostiles remain — this room’s loaner **is** the hostile, so ignore-and-leave is exploration-only; in a run they count for map-clear.  
REWARD: The one-cast + tiny Doka on kill. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “borrow a verb without a bar slot” vs “kill for the purse plus the same one-cast.” Distinct from ENC-SPELL-01…06 glyphs.  
SOLVABILITY_REQUIREMENTS: Loaner reachable; 1 AP adjacent-open is not a wall.  
REPLAYABILITY: Which extra id is missing drives the room.  
SCALING_BEHAVIOUR: Does not scale; it retires when the carried id is owned (becomes ENC-ELITE-07 or ENC-SPELL-08).  
STATUS: PROPOSED

---

### ENC-SPELL-08

ENCOUNTER_ID: ENC-SPELL-08  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× weaver bishop that telegraphs frost (or Root if live) down a **wide** lane + 1× pawn. After the first frost/root resolves, a **glyph** appears on a side tile (`discoverSpellId: spell-root-snare` if that id exists, else `spell-slow`).  
AI_REQUIREMENTS: Bishop prefers the lane. Does not walk onto the glyph. Does not refresh Root on TEACH (the glyph is the teacher). Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Root Snare (primary). If already owned, glyph is `spell-haste` (Mist primer) instead.  
MAP_REQUIREMENTS: Straight aisle + one side alcove for the glyph. Optional one chevron on the **unsafe** aisle entry (ENC-WIRE-01 preview). No Time Warp.  
SPECIAL_RULES: Root is a walk lock, **casts still legal**. First root/frost that leaves the player able to nuke from the tile logs a teach line. Glyph despawns if unused when the last enemy dies (player still wins).  
OBJECTIVE: Clear. Optional: pick up the glyph and Root the pawn before closing.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + standard.  
TACTICAL_PURPOSE: Teach Root/Slow as a found verb on the same aisle language as ENC-SPELL-06 (Mark), without cloning Mark.  
SOLVABILITY_REQUIREMENTS: Alcove reachable; glyph not on the aisle’s only walk column; Root expires or a cast from the tile exists.  
REPLAYABILITY: Alcove left/right.  
SCALING_BEHAVIOUR: High: convert to ENC-WIRE-01. Does not add HP.  
STATUS: PROPOSED

---

### ENC-MAST-04

ENCOUNTER_ID: ENC-MAST-04  
TYPE: mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on needle grass (`WF-HAZ-NEEDLE_GRASS`). Wave 2: `FSN-IRON-TIDE` **or** `FSN-FILE-GUARD` by `branch` (Tide vs File; Clock uses `FSN-BELL-CUT`; Mist uses `FSN-MIST-HUNT/NO-LEECH`). Wave 3: elite leftover (E-IRON tank **or** E-RANK lancer **or** E-BELL sexton **or** E-STEP mist) + leftover. Hard-cap 4 living.  
AI_REQUIREMENTS: Full contracts of the named packs. Wave 3 elite uses `escapeRoute`.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; this is the exam.  
MAP_REQUIREMENTS: Combines file+gallery (TEACH-04), needle patch (HAZ-07), and a central rally drum (PROT-04) that is **optional** — occupying it at end of player turn refunds 1 MP already spent (cannot exceed max). Scripted hazards only. Branch skins: Tide adds Isolation **only if** a warm pair can exist; File keeps one frost pane on the gallery; Clock keeps a painted pip chrome (no second damage engine); Mist keeps triune pads off the only exit.  
SPECIAL_RULES: Portal locked until wave 3 is dead. Random family lottery off. Do not attach Short Fuse **and** Isolation (two opener taxes).  
OBJECTIVE: Clear all waves. Optional: claim the drum on wave 1.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band (≈ 2× depth victory). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove the primer verbs together without a new monster.  
SOLVABILITY_REQUIREMENTS: Gallery, clean needle detour, drum optional, wave cells legal. Isolation skip-rule still applies.  
REPLAYABILITY: Branch skin is the replay.  
SCALING_BEHAVIOUR: Wave 3 elite tag is the scaler, not HP. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-RUSH-11

ENCOUNTER_ID: ENC-RUSH-11  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Rush **Table B** room `B0` — `cinder_lance` + `hexed_marker`. Shared extra cap 4. Hex **never** occupies a telegraphed lance tile. Wrong-element is still −50%, not immune. Do **not** overwrite `BOSS_RUSH_ROOMS[0]` (Archbishop + Weeping Pawn).  
AI_REQUIREMENTS: Existing / bible kits. Lance telegraphs 1 turn. Marker paints Hex off the glow.  
SPELL_DISCOVERY_OPPORTUNITIES: File Lance observe→win if that door exists.  
MAP_REQUIREMENTS: Chessboard with a 4-tile file **plus** a hex-legal tile that is not on the telegraph. Preferred cells + `applyFinalizedLayout`. Unlock: one complete clear of rooms 0–9 (after the room-9 `second_lament` remap).  
SPECIAL_RULES: New `roomIndex` namespace `B0`. Flat rewards continue the jackpot curve without a player-level exponent. Persist through `buildBossRushPersistInput` → `applyRewards` only. Do not also multiply by `rewardDokaMultiplier`. Do not collide ENC-RUSH-01…10.  
OBJECTIVE: Defeat both. Intended line: charge the glowing window **and** leave the Hex.  
FAILURE_CONDITION: Player death (Rush abort rules unchanged).  
REWARD: Document Table B Doka/XP (continue 500–5000 curve; B0 sits at the post-jackpot floor — implementer picks a flat number, not a level exponent).  
TACTICAL_PURPOSE: Inject the File primer into Rush without rewriting room 0.  
SOLVABILITY_REQUIREMENTS: Hex tile ≠ lance telegraph. Walk-offs exist.  
REPLAYABILITY: None until Table C.  
SCALING_BEHAVIOUR: Extra cap 4. Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-12

ENCOUNTER_ID: ENC-RUSH-12  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table B `B1` — `hook_regent` + `goad_pretender`. Winch and Crown are both objects (0 victory XP). Taunt does **not** force standing on the hook glow (player may tool-cast). Not Countess / Static / Rime.  
AI_REQUIREMENTS: Hook legality from ENC-SLAM-01 (landing walk-off). Goad forces targeting, not occupancy on the glow.  
SPELL_DISCOVERY_OPPORTUNITIES: Hook Line observe→win if that door exists.  
MAP_REQUIREMENTS: Arena with pillars 2 tiles from typical stand. Unlock: rooms 0–9 cleared once. `roomIndex: B1`.  
SPECIAL_RULES: Same persist rules as ENC-RUSH-11. Do not pair `sinkhole_dowager` here (two attract verbs).  
OBJECTIVE: Defeat both. Intended line: get pulled, **or** get goaded into walking onto the ray — never both as a forced brick.  
FAILURE_CONDITION: Player death.  
REWARD: Flat Table B.  
TACTICAL_PURPOSE: Inject Hook + Goad after ENC-SLAM-01 taught hug-the-anchor.  
SOLVABILITY_REQUIREMENTS: Glow ≠ Crown occupancy. Adjacent-to-hook remains immune.  
REPLAYABILITY: None until Table C.  
SCALING_BEHAVIOUR: Extra cap 4.  
STATUS: PROPOSED

---

### ENC-RUSH-13

ENCOUNTER_ID: ENC-RUSH-13  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table B `B2` — `ivory_palisade` + `silent_conductor`. Silence files are the **punched** lanes, never the staked files. Not Fortress (two shrinks). Sentinel + musicians share cap 4.  
AI_REQUIREMENTS: Palisade stakes galleries. Conductor silences open lanes. Player must fight from a sounding **open** lane.  
SPELL_DISCOVERY_OPPORTUNITIES: None required (bible doors if present).  
MAP_REQUIREMENTS: Fortress courtyard + gallery (File primer geometry). Unlock: rooms 0–9 cleared. `roomIndex: B2`.  
SPECIAL_RULES: Do not pair `ivory_palisade` with `alabaster_fortress`. Do not collide ENC-RUSH-08 (Fortress + Broodmother).  
OBJECTIVE: Defeat both from a legal sounding lane.  
FAILURE_CONDITION: Player death.  
REWARD: Flat Table B.  
TACTICAL_PURPOSE: Inject shrink-vs-silence after the player already knows galleries from ENC-TEACH-04.  
SOLVABILITY_REQUIREMENTS: At least one punched lane remains walkable and not silenced. Stake tiles are not the only exit.  
REPLAYABILITY: None until Table C.  
SCALING_BEHAVIOUR: Extra cap 4.  
STATUS: PROPOSED

---

### ENC-RUSH-14

ENCOUNTER_ID: ENC-RUSH-14  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table B `B3` — `unbound_pendulum` + `wick_prelate`. Fuses do **not** tick on a pendulum-sweep telegraph turn (one answer at a time). Metronomes delay enrage; Snuffer delays fuses. Shared extra cap: bomber only.  
AI_REQUIREMENTS: Pendulum sweep telegraphs 1 turn. Wick fuses are objects (0 XP). Do not also Bell-pip (ENC-PRIO-06 already taught clocks).  
SPELL_DISCOVERY_OPPORTUNITIES: Fuse / metronome doors if the bible lists them.  
MAP_REQUIREMENTS: Open court (Clock primer). Unlock: rooms 0–9 cleared. `roomIndex: B3`.  
SPECIAL_RULES: Held illegal pairs stay out (`sinkhole_dowager`+`wick_prelate` occupancy-at-tick untested). Do not collide ENC-RUSH-10 (Midnight + Twin Monarchs rage).  
OBJECTIVE: Defeat both. Intended line: race the clock **or** douse the wicks — never both on the same telegraph turn.  
FAILURE_CONDITION: Player death.  
REWARD: Flat Table B (pre-jackpot peak; room 9 Table A remains the 5000/2000 jackpot).  
TACTICAL_PURPOSE: Inject dual clocks after ENC-BELL-01 / ENC-PRIO-06 taught “heal out or delete the knife.”  
SOLVABILITY_REQUIREMENTS: A tile outside the sweep exists. Wicks are destructible. Bomber extra respects kamikaze min-targets.  
REPLAYABILITY: None until Table C.  
SCALING_BEHAVIOUR: Extra cap bomber-only. Do not add a third boss.  
STATUS: PROPOSED

---

### ENC-SURV-08

ENCOUNTER_ID: ENC-SURV-08  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: FILE-GUARD lancer only (no protector — Short Fuse is the protector). Wave B overlaps at turn 3: IRON-TIDE shade (no tank). Wave C at turn 6: one elite golem. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Lancer holds the file. Shade kites. Golem camps the last clean tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-HAZ-ORBIT_CINDER` + `WF-MOD-SHORT_FUSE` (0-cooldown / melee / summons legal on round 1). Skip Isolation here (ENC-SURV-07 already spent it). Never both Short Fuse and `arcane_overflow`. Never `titans_vigor`.  
SPECIAL_RULES: Overlap + orbit rim + round-1 cooldown lock is the escalation vs ENC-SURV-07. Flee remnants when the clock ends.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-07. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Peak pressure that spends leftover Short Fuse + orbit so late-game maps are not “chill again” or “ash-rain again.”  
SOLVABILITY_REQUIREMENTS: Path around the square; 4-unit occupancy leaves a walkable ring; Short Fuse never seals tiles; orbit never covers spawn or exit.  
REPLAYABILITY: Wave C golem vs mist elite for Mist-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain G — “Tide / File / Clock Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-04 then ENC-SPELL-07 (or ENC-SPELL-08 if Frost/Slow already owned) |
| 2 | Reinforce | ENC-WAVE-05 |
| 3 | Combine | ENC-HAZ-07 then ENC-FILE-01 **or** ENC-WIRE-01 **or** ENC-MOVE-06 |
| 3 insert | Choice | ENC-BRANCH-04 → Tide/File/Clock/Mist destinations |
| 4 | Pressure | ENC-SURV-07 **or** ENC-BELL-01→ENC-PRIO-06 **or** ENC-SLAM-01 **or** ENC-CART-01 **or** skip via ENC-REST-04 |
| 4 | Mastery | ENC-MAST-04 (branch skin) |
| 5 | Boss | ENC-BOSS-04 |

Rare: 8% on depth 4 to **insert** ENC-RARE-04 before mastery.  
Treasure: rest may offer ENC-TREAS-04 instead of PROT-04.  
Oath side-story: replace combine with ENC-OATH-01 and mini-boss ENC-MINI-05; capstone may become `bone_cavalier` if File was not the door.

### Chain H — “Bridge Primer” (maxDepth 4)

ENC-MOVE-06 → ENC-MOVE-07 → ENC-CART-01 → ENC-REST-04 → ENC-BOSS-04 (`void_grandmaster` only if Mist was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-06 as teach on accounts that already know file/needle.

### Rush injection (day-4)

After one full Table A Rush clear (and the room-9 `second_lament` remap), ENC-REST-04 shrine can enable: `B0` → ENC-RUSH-11, `B1` → ENC-RUSH-12, `B2` → ENC-RUSH-13, `B3` → ENC-RUSH-14. Day-1 flags for rooms 0 / 3 / 9, day-2 flags for rooms 1 / 2 / 4 / 5 / 8, and day-3 flags for rooms 6 / 7 remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-04, ENC-SPELL-07, ENC-SPELL-08, ENC-BELL-01 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-07, ENC-HAZ-08, ENC-WIRE-01, ENC-MOVE-06, ENC-MOVE-07 | `under_50_damage` |
| ENC-REINF-04 | `no_healing` |
| ENC-WAVE-05 | `under_15_turns` (first clear); `under_10_turns` after |
| ENC-PROT-04, ENC-FILE-01 | `under_50_damage` (not `direct_hit` on first FILE-01 clear) |
| ENC-ELITE-06, ENC-ELITE-07, ENC-SLAM-01, ENC-MAST-04 | `under_8_ap_per_turn` |
| ENC-SURV-07, ENC-SURV-08 | `no_healing` (not `no_damage_taken`) |
| ENC-CART-01 | `under_10_turns` |
| ENC-PRIO-06 | `no_healing` only after one pip has been seen |
| ENC-TREAS-04 / ENC-REST-04 latch / ENC-OATH-01 | no overlay (the risk *is* the challenge) |
| ENC-AMBUSH-04 | `under_50_damage` if they used the chevron facing |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 1–2 roles, one verb | no lookahead | zone 0, no family | needle grass or open file | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | needle **or** chevron | kill + optional glyph |
| MID | named drop-3 `FSN-*` or waves | backline guard | zone 1 + Haste/Iron Skin | one `WF-*` | clock / tags / drum / bridge |
| HIGH | elite or slam / cart | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / oath / intercept |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table B |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit needle, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure (day-3). Harvest Moon / Stillness Oath are day-4 opt-in multipliers on `applyRewards` only.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1/day-2/day-3 fields plus:

```
encounterId
encounterType        // + file | bell | wire | slam | cart | oath
formationId?         // FSN-IRON-TIDE | FSN-FILE-GUARD | FSN-MEND-KNIFE |
                     // FSN-HOOK-SLAM | FSN-BELL-CUT | FSN-WIRE-ROOT |
                     // FSN-EMBER-MEND | FSN-GRAVITY-TAX | FSN-FILE-WIRE |
                     // FSN-BELL-COURT | FSN-PLATE-LINK | FSN-MIST-HUNT |
                     // FSN-SHARD-BATTERY
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
ownedFile?           // axis for ROLE-LANCER
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // tide | file | clock | mist
holdPortalLocked?
objectiveKind        // + occupy_rally_drum | cross_bridge_twice |
                     // survive_bell_pip | intercept_cart | hold_stillness
failureKind
deviceTable[]        // ENC-TREAS-04
rushVariant?         // table_b_lance_hex | table_b_hook_goad |
                     // table_b_palisade_silence | table_b_pendulum_wick
rushTable?           // A (rooms 0–9) | B (B0–B3)
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called File Lieutenant / Final Pawn” logic — use `formationId` / `ownedFile` / `decoyId`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31, 2026-09-01, or 2026-09-02 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not (those four are announce-only in `mapModifiers.ts` as of `0f5363f`).
- Dual-boss dungeon capstones (Rush only).
- Adding Wave-2/3/4 ids to `BOSS_IDS` in the same change as a Rush string remap.
- Wiring `applyPushback` / `applyAttract` callers, trap≠`placeBarrier`, Grave Bell, turret summon AI, or ally `targetId` apply — rooms above name **fallbacks** until those exist.
- Minting `FSN-*` ids for Wave-3 elite packs (Wick Court, Ice File, Fog Fuse, …). Those wait on the next formation drop.
- `WF-PRT-LATCH_GATE` inside dungeon / boss rush / Death Realm.

---

## 10. Pick order (day-4, after day-1 / day-2 / day-3 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Once those exist, implementers should pick:

1. ENC-TEACH-04 + ENC-HAZ-07 (file / needle verbs). `FSN-IRON-TIDE` band 0 can ship in the same slice as ENC-WAVE-05.  
2. ENC-WAVE-05 (`formationId` IRON-TIDE → FILE-GUARD)  
3. ENC-BELL-01 or ENC-WIRE-01 or ENC-SLAM-01 (new pressure objects — Bell pip / visible chevron / pads-first if attract callers are missing)  
4. ENC-BRANCH-04 (`branch: tide|file|clock|mist` snapshot-before-cleanup)  
5. ENC-BOSS-04 branch read (live 19 fallbacks)  
6. Rush Table B (ENC-RUSH-11…14) one room at a time, only after the account has one full Table A clear  

Uniqueness: this file is the **fourth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
