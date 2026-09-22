# Encounter Evolution Catalog — 2026-09-22

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-22-001`.  
Parent catalogs:

- [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-21.md`](./ENCOUNTER_EVOLUTION_2026-09-21.md) (`EED-2026-09-21-001`, open PR #347 — not yet on `main`)

**Do not reuse those IDs.** This file only adds new rooms. Do not rewrite prior catalogs.

Grounding: `origin/main` @ `0f5363f` plus sibling design — `docs/design/ENEMY_FORMATIONS_2026-09-21.md` (drop-4 `FSN-*`, open PR #348), `docs/ENEMY_AI_EVOLUTION.md`, `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-02.md` (Wave-3 families: Wick / Rime / Smoke / Plus / Tempo / Coup / Rescue / Bastion), `docs/WORLD_DYNAMICS.md` wave 4 (`WF-*`, open PR #344), `docs/design/BOSS_AND_SPELL_DISCOVERY.md` Rush Table C (`C0`–`C3`, open PR #367). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50`, `MAX_ENEMIES = 20`, `ENEMY_SUMMON_CAP = 2`, `ENEMY_SUMMON_COOLDOWN_TURNS = 2`, `AI_KAMIKAZE_MIN_TARGETS = 2`, 19 `BOSS_IDS` (`bossTypes.ts` 390–410), 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay, atomic `applyRewards`.

---

## 1. Why a fifth day

Day-1 taught the **Ash / Ice skeleton**. Day-2 taught the **Void primer**. Day-3 taught the **Hex primer** (Blood / Glass / Paper / Null). Day-4 taught the **Tide / File / Clock primer** and spent drop-3 packs `FSN-IRON-TIDE`, `FSN-FILE-GUARD`, `FSN-MEND-KNIFE`, `FSN-HOOK-SLAM`, `FSN-BELL-CUT`, `FSN-WIRE-ROOT`, `FSN-EMBER-MEND`, `FSN-FILE-WIRE`, `FSN-MIST-HUNT`, plus wave-3 world features (needle, orbit, chevron, pane, drum, cart, oath). Rush variants exist for Table A rooms **0–9** and Table B `B0`–`B3` (`ENC-RUSH-11`…`14`).

After those rooms exist, high-level play is still “the same shape.” Day-5 changes **the question** again by spending the **Wick / Rime / Smoke / Plus** verbs that already have drop-4 formation sheets and leftover **wave-4** world-feature knobs. The new question is not “leave the file” or “survive the pip.” It is **occupancy clocks and painted geometry that is not a rank**: a fuse you can walk off, a rime cell you pay only on enter, a plus-arm you can stand beside, a fog you can walk through.

Gaps this file fills (still unused as scripted rooms):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-4 formations | `FSN-WICK-STEP`, `FSN-RIME-RANK`, `FSN-SMOKE-GLASS`, `FSN-STACK-CASH`, `FSN-COUP-ROT`, `FSN-WICK-COURT`, `FSN-TEMPO-CHOIR`, `FSN-FOG-FUSE`, `FSN-RESCUE-LINE`, `FSN-ICE-FILE`, `FSN-SMOKE-HUNT`, `FSN-PLUS-BATTERY`, `FSN-ABSOLVE-RACE`, `FSN-TWIN-PLATE`, `FSN-FINISH-LINE`, `FSN-BASTION-GATE` are PDFs, not rooms |
| Leftover drop-3 sheets | `FSN-GRAVITY-TAX`, `FSN-PLATE-LINK`, `FSN-BELL-COURT` were named on day-4 as peak converts only |
| Leftover drop-2 sheets | `FSN-RIFT-KNOT` still has no dedicated beat (ENC-RARE peak skins only) |
| World-feature wave 4 | `WF-HAZ-FLINT_DUST`, `WF-HAZ-PENDULUM_CENSER`, `WF-TRP-DELAY_GNOMON`, `WF-TER-REED_SCREEN`, `WF-OBS-HOURGLASS_ARCH`, `WF-ZON-VEIL_FONT`, `WF-TEL-SWAP_ANCHOR`, `WF-PRT-WAGER_GATE`, `WF-INV-PHALANX_LINE`, `WF-ELT-LEASH_WARDEN`, `WF-TRS-PATIENCE_CACHE`, `WF-SPL-ECHO_SCRIBE`, `WF-RSK-SEEPING_TITHE`, `WF-MOD-HEAVY_INCANT`, `WF-EVT-IRON_LENT`, `WF-ENV-STAGNANT_HAZE` |
| Unused live modifiers | leftover `iron_curse` (heal-halved, RES up — rest / Iron Lent only), leftover `chaos_initiative` as an **opt-in rest shrine** only. `thorned_ground` was day-4; do not re-spend it as a dungeon sponge |
| Rush Table C | After one full Table B clear: `C0` `ram_castellan`+`hexed_marker`, `C1` `fosse_warden`+`cinder_lance`, `C2` `stride_censor`+`silent_conductor`, `C3` `morrow_herald`+`goad_pretender`. New `roomIndex` namespace. Do **not** overwrite `BOSS_RUSH_ROOMS` 0–9 or Table B `B0`–`B3`, and do not collide `ENC-RUSH-01`…`14` |
| Wave-5 solo capstones | `ram_castellan`, `fosse_warden`, `stride_censor`, `morrow_herald` stay **out of `BOSS_IDS`** until kits ship; dungeon capstones below fall back to live 19 |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

`doka_fever` remains the **opt-in** sponge from ENC-TREAS-03. Day-4 treasure used Split Cache / Harvest Moon. Day-5 treasure uses `WF-TRS-PATIENCE_CACHE` and `WF-RSK-SEEPING_TITHE` instead.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / leash / phalanx rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `ownedFile`, `plusOrigin`, `fusedCell`, `rimeFile`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise.
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet. Coup is a **25% HP% Strike gate**, not `instantKill`.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer. Echo-scribe one-casts (`WF-SPL-ECHO_SCRIBE`) do **not** persist `spellLevel*` arrays. Loaner one-casts (`WF-SPL-LOANER_MAGE`) were day-4.
- `inferArchetype` still treats any `healAmount > 0` as healer. Binders / tempo / plus / smoke / ignite / coup / tax must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- Dual Slow / Frost / tide melee / **rime enter** MP tax: cap applied MP debuff at **−2**. One Slow source per pack. Do not also Root + Rime + Slow on the same AP bar.
- `WF-PRT-LATCH_GATE` and `WF-PRT-WAGER_GATE` are **forbidden** in dungeon, boss rush, and Death Realm. Rest / overworld only, and never the only portal.
- `applyPushback` / `applyAttract` exist in `occupancy.ts` but have **no spell caller**. Fuse + bash rooms below ship a **fallback** until `effectCategory` callers exist — they do not fake bash as “more Strike,” and they do not fake fuse as Inferno.
- Do not pack `coup_duelist` with `bell_sexton` as a teaching pair. `FSN-BELL-CUT` stays the delayed-clock lesson; `FSN-COUP-ROT` is the instant-25% lesson.
- `FSN-FOG-FUSE` **does not ship** unless a wick tell remains public under smoke. Hidden occupancy without a tell is a hardlock.
- `FSN-TEMPO-CHOIR` **does not ship** until ally `targetId` apply exists for Tempo (same gate as Enrage). Until then ENC-REINF-05 uses `FSN-STACK-CASH`.
- Isolation Chill skips if the map would start with only one living unit. Stagnant Haze does **not** skip for that reason (the player can spend 1 MP alone).
- Phalanx Line skips if the roster cannot fit 3 extra enemies.

---

## 3. Dungeon pacing (Wick / Rime / Smoke / Plus primer + inserts)

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

| Beat | Depth hint | Job | Day-5 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (flint AP-tax, painted fuse, rime enter) | ENC-TEACH-05, ENC-SPELL-09, ENC-HAZ-09 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-06, ENC-AMBUSH-05 |
| Combine | 2–3 | Two taught verbs | ENC-HAZ-10, ENC-WICK-01, ENC-RIME-01, ENC-REINF-05, ENC-MOVE-08, ENC-FONT-01 |
| Pressure | 3 | Clock, coupe, plus, rescue, or leash | ENC-SURV-09, ENC-COUP-01, ENC-PLUS-01, ENC-PROT-05, ENC-LEASH-01, ENC-PRIO-07 |
| Choice / rest | mid | Heal vs wait-chest vs four-way branch vs tithe | ENC-REST-05, ENC-BRANCH-05, ENC-TREAS-05, ENC-TITHE-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-08, ENC-ELITE-09, ENC-RARE-05, ENC-MAST-05, ENC-TAX-01, ENC-MOVE-09 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-06, ENC-BOSS-05, ENC-RUSH-15…18 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, and day-4 Tide / File / Clock chains remain valid. Day-5 **Wick / Rime / Smoke / Plus primer** is the default for accounts that already cleared Ash, Ice, Void, Hex, **and** Tide/File/Clock once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-05

ENCOUNTER_ID: ENC-TEACH-05  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead. `instantKill` / `betrayal` off.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a casting-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. Four to six `WF-HAZ-FLINT_DUST` tiles on the **mid-band** (walk free; spending AP — a spell or Attack Nearest — while occupying a flint tile costs 4% max HP). A clean-floor aisle of ≥ 1 tile exists. No lava/ice/spikes. No `paper_windstorm` (the tax is AP spend, not range). Player spawn on clean floor. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First AP spend that fires from flint logs a teach line. Do not also apply `WF-MOD-HEAVY_INCANT` (double tax). Do not mix salt (that is ENC-HAZ-05) or needle grass (that is ENC-HAZ-07).  
OBJECTIVE: Defeat both. Optional: never spend AP from a flint tile.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “walking the dust is free; casting from it is the tax. Step off, then spend.” Prepares ENC-PLUS-01 (geometry gun) and ENC-ELITE-08 (fuse + bash). Distinct from ENC-TEACH-03 (wind halves **range**) and ENC-TEACH-04 (lancer only on **file**).  
SOLVABILITY_REQUIREMENTS: Bishop reachable by walking; flint never walls a corridor; flint not on spawn±3 or the portal. Clean aisle reaches both units.  
REPLAYABILITY: Flint ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: replace the pawn with a `ROLE-WARDEN` rook that body-blocks the clean aisle (still no extra HP). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-09

ENCOUNTER_ID: ENC-HAZ-09  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× `tide_shade` bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand on the nave once; wounded pawns avoid the **next** censer cell. Bishop kites from off-nave floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a censer tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: A painted 5-tile nave with `WF-HAZ-PENDULUM_CENSER` (1-tile step each round start, reverse at the ends, 5% max HP on landing). A path around the nave exists. Exit behind the bishop. Distinct from ENC-HAZ-08’s `WF-HAZ-ORBIT_CINDER` (clockwise square).  
SPECIAL_RULES: Scripted censer only. Do not mix orbit cinder (that is ENC-HAZ-08). Counts as 1 toward `MAX_HAZARD_TILES`. Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Clear all. Intended line: cross just after the censer passes.  
FAILURE_CONDITION: Player death (frost + censer tax).  
REWARD: Standard. Overlay `under_50_damage` rewards never sharing a cell with the next pip.  
TACTICAL_PURPOSE: Teach “the nave reverses; standing on the next cell is a tax, standing beside it is free.” Distinct from creeping ash (one-way lane) and orbit cinder (square).  
SOLVABILITY_REQUIREMENTS: Path around the nave reaches both pawns and the bishop. Censer never covers spawn or the portal. Nave is floor, not a wall.  
REPLAYABILITY: Nave N-S vs E-W. Start cell at north end vs south end.  
SCALING_BEHAVIOUR: Mid: add `swift_winds` (+2 MP) so the player *can* dash the whole nave in one turn — the lesson is choosing not to. High: bishop gains `spell-slow`. Never thicken the nave into a wall.  
STATUS: PROPOSED

---

### ENC-HAZ-10

ENCOUNTER_ID: ENC-HAZ-10  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SMOKE-GLASS/WRAITH` — 1× smoke bishop (`starter-frost` only if smoke id is missing → **reroll this id**, never fake Barrier) + 1× sniper bishop (`starter-frost`, dest Chebyshev ≥ 3). Band 0: both Frost only.  
AI_REQUIREMENTS: Thurifer smokes only a cell that currently breaks live LoS to the sniper, then steps aside (smoke remains walkable). Sniper refuses dest Chebyshev ≤ 2. No Inferno. No Mark on PAIR.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `starter-frost` can complete frost observation. If `proposed:spell-smoke-veil` is live and used, that id may drop after a win.  
MAP_REQUIREMENTS: Fortress or open field with a **main lane plus one side aisle**. One `WF-TER-REED_SCREEN` on a gallery cell (blocks walk, **not** LoS; 1 AP cuts it to floor). Inverse of ENC-FILE-01’s frost pane (walk-through, LoS-block). Optional leftover flint from ENC-TEACH-05 (`inheritHazardsFrom: ENC-TEACH-05`) on the **lane**, not the aisle.  
SPECIAL_RULES: Scripted hazards only. Skip Reed Screen if it would be a cut-vertex. Smoke + Reed on the **same** cell is forbidden (walk-block + fog is a lock). Hostiles start ≥ Chebyshev 4 apart.  
OBJECTIVE: Clear all. Intended line: walk the smoke, cut the reed only if the aisle is worth 1 AP, shoot through the reed at the sniper.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + frost/smoke discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine walk-through fog with a shoot-through walk-block so “the lane is a wall” is the wrong read.  
SOLVABILITY_REQUIREMENTS: Side aisle reaches the sniper without cutting the reed. Reed skip if solvability fails with it intact. Smoke is not a wall. 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Reed on north gallery vs east. Full `FSN-SMOKE-HUNT` (add Optic) only at peak after this PAIR is answered.  
SCALING_BEHAVIOUR: High: sniper is `FSN-SMOKE-GLASS/E-SHOT` (still no Mark). Peak: convert to ENC-ELITE-09’s smoke skin only if ENC-FONT-01 was answered. Never add Fog of War as a second LoS tax.  
STATUS: PROPOSED

---

### ENC-WAVE-06

ENCOUNTER_ID: ENC-WAVE-06  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave 1: `FSN-WICK-STEP/FROST` — 1× fuse queen **without heal** (`starter-frost` + a **painted fused cell** if `spell-fuse-tile` apply is missing — **reroll** rather than fake Inferno) + 1× pusher pawn (Strike only until bash caller exists). Wave 2: `FSN-RIME-RANK/FROST` — 1× rime bishop (Frost; one painted file cell) + 1× lancer rook (Strike **only** on a shared file). Wave 3: leftover pusher **or** leftover lancer, never both. Never more than 4 living hostiles. Band 0: do **not** spawn live fuse+bash on the same turn.  
AI_REQUIREMENTS: Wave 1: Binder fuses a choke, never both exits, never the tile under a full-HP player on turn 1 if a ring exists. Pusher skips bash into open floor; dest scoring must not use lava **or** the last unfused exit. Wave 2: Lancer skips unless `player.x === lancer.x || player.y === lancer.y`. Mason paints **one** file. Wave 3 leftover is greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave 1 fuse-tile (or frost) observation. Wave 2 file-lance / frost if used and the player wins.  
MAP_REQUIREMENTS: Arena or asymmetric with **pillars / a wall 2 tiles from typical stand** plus two walk-offs, **and** a 4-tile open file plus a gallery. Reject `corridorMaze`. `waveSpawnCells` in the far lane. Optional flint inherited from ENC-TEACH-05 (`inheritModifierFrom` is wrong here — inherit **tiles**, `inheritHazardsFrom: ENC-TEACH-05`) so casting from the fuse cell is the same verb.  
SPECIAL_RULES: Portal locked until wave 3 is clear. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**. Fuse deals 0 on “cast”; identity is occupancy at tick (challenge HP 8% once, then the cell is floor). Rime enter is a separate 3% max-HP **or** −1 MP tax — pick one per seed, never both.  
OBJECTIVE: Survive and clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns` is tight on purpose.  
TACTICAL_PURPOSE: Named drop-4 pairs as wave verbs — occupancy clock, then enter-tax file — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Gallery reaches off-file. Two walk-offs from every fused cell. Cap 4 living so later summons are not starved.  
REPLAYABILITY: Wave 2 can swap to `FSN-FILE-GUARD/SOLO-FILE` if the account already answered RIME-RANK this week (day-4 leftover).  
SCALING_BEHAVIOUR: High: wave 3 leftover is `FSN-WICK-STEP/E-WICK` (elite binder, still no Inferno). Peak: wave 2 lancer is `FSN-RIME-RANK/E-RANK` (Haste to re-align, still no Root). No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-05

ENCOUNTER_ID: ENC-AMBUSH-05  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× `WF-TRP-DELAY_GNOMON` (always-visible sundial; first step arms a 2-round fuse with **no** tax; two round-starts later everyone on that cell pays 6% max HP once, then floor) + 1× wounded-looking pawn. Hidden until trigger: `FSN-STACK-CASH` — 1× `plague_rat` pawn (`starter-poison` + `spell-venom-strike` at band 1) + 1× ignite queen **without heal** (`starter-poison`; Ignite **only if** that id is enemy-legal — else the queen waits then Frosts). Band 0: queen is Poison-only.  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP). Rat applies and leaves. Queen refuses Ignite at 1 stack (VETERAN); BASE may cash 1 stack so the verb still teaches. Gnomon is not an AI actor. No Coup on this sheet (that is ENC-COUP-01). No Inferno on the queen.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing `starter-poison` / `spell-venom-strike` can drop that id if missing. Ignite observe only if the queen cashed.  
MAP_REQUIREMENTS: Arena with a gnomon start cell. `ambushCells` behind a wall hook. Trigger: player arms the gnomon **or** bait drops below 50% HP **or** the player crosses the midline. Do not hide the gnomon.  
SPECIAL_RULES: Ambush units do not exist in the combatant store until trigger (portal locked because bait is alive). Gnomon tax via challenge HP. Soft: killing the bait with overkill still fires the ambush. Intent log: explicit `ambush: gnomon`. Distinct from ENC-AMBUSH-04 (chevron facing + sleeping vanguard) and ENC-AMBUSH-03 (hunt lantern).  
OBJECTIVE: Defeat bait + ambushers. Gnomon remaining after clear is floor (despawn if still armed — no delayed tax after victory).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player never armed the gnomon (stood still / walked around). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Teach delayed occupancy: arming a plate as area-denial is a choice, not a trap you could not see. The cash-in queen is why standing on the armed cell for two rounds is expensive.  
SOLVABILITY_REQUIREMENTS: `ambushCells` reachable after spawn; path around the gnomon exists; bait cannot spawn on the portal. Hostiles start ≥ 4 apart after trigger.  
REPLAYABILITY: Hook left/right. Queen can be omitted at low band (rat only).  
SCALING_BEHAVIOUR: High: elite alchemist (`FSN-STACK-CASH` elite tag), rat stays junior. Peak: convert to `FSN-TEMPO-CHOIR/NO-LEADER` **only if** ally `targetId` apply exists. Still no Coup.  
STATUS: PROPOSED

---

### ENC-REINF-05

ENCOUNTER_ID: ENC-REINF-05  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WICK-STEP` on the board (binder + pusher). When the fused cell ticks **or** the binder drops below 50%, a 1-pawn reinforcement spawns on `reinfCells` (cap 1 extra, hard-cap 3 living). No Swap, no martyr, no Sink (those are `FSN-WICK-COURT`).  
AI_REQUIREMENTS: Binder never recasts a second fuse while one is live. Pusher still skips bash into open floor. Reinforcement is a greedy charger. No group-tactics required.  
SPELL_DISCOVERY_OPPORTUNITIES: Fuse-tile / frost as ENC-WAVE-06.  
MAP_REQUIREMENTS: Same two-walk-off arena as ENC-WICK-01. `reinfCells` ⊆ reachable floor, not on spawn/portal, not on the live fused cell.  
SPECIAL_RULES: Portal locked until all three (or the leftover two if reinf skipped) are dead. If `reinfCells` is occupied, spill to nearest free reachable floor; if none, skip and log. Random 30% lottery off.  
OBJECTIVE: Clear binder, pusher, and the reinforcement if it spawned.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing` is fair (the tax is occupancy, not a sponge).  
TACTICAL_PURPOSE: Reinforce the wick verb: the bomb is the clock; the extra pawn is why you cannot camp the walk-off forever. Distinct from ENC-REINF-04 (ember marked → pawn).  
SOLVABILITY_REQUIREMENTS: `reinfCells` reachable; 3-unit occupancy leaves a walkable ring; fuse never seals both exits.  
REPLAYABILITY: `FSN-WICK-STEP/FROST` vs full band-1 bash if the caller exists.  
SCALING_BEHAVIOUR: High: elite binder, pusher stays junior. Peak: convert to `FSN-WICK-COURT` (add Sink) only after ENC-WICK-01 **and** tile-attract is honest. Still no lava dest.  
STATUS: PROPOSED

---

### ENC-SURV-09

ENCOUNTER_ID: ENC-SURV-09  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Clock 8. Wave A: 1× fuse binder only (no pusher — haze is the pusher). Wave B overlaps at turn 3: 1× pawn charger. Wave C at turn 6: 1× junior golem. Overlap allowed; hard-cap 3 living.  
AI_REQUIREMENTS: Binder fuses a choke then kites. Pawn greedy. Golem camps a clean (non-flint) tile. Full gates except instantKill / betrayal.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-ENV-STAGNANT_HAZE` (end a turn having spent 0 MP → 3% max HP). Optional 4 flint tiles on the **outer** ring (`inheritHazardsFrom: ENC-TEACH-05`) so planting to linear-shot is a double tax. Skip Isolation here (ENC-SURV-07 already spent it). Never `titans_vigor`. Never both haze and `arcane_overflow`.  
SPECIAL_RULES: Overlap + “must shuffle” is the escalation vs ENC-SURV-07 (clump-or-pay). Flee remnants when the clock ends. Attack Nearest and AP spells do **not** count as MP.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Survival table (depth × 40 Doka + 80 XP band) plus kill XP only for units actually defeated. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Pressure that spends leftover Stagnant Haze so late-game maps are not “chill again” or “ash-rain again.”  
SOLVABILITY_REQUIREMENTS: The tax is not a wall. 3-unit occupancy leaves a walkable ring. Flint never seals spawn or exit.  
REPLAYABILITY: Wave C golem vs smoke bishop for Smoke-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-ELITE-08

ENCOUNTER_ID: ENC-ELITE-08  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-WICK-STEP/E-WICK` — elite fuse binder + junior pusher. Elite is not a boss: no phase table, no `BossAbility`.  
AI_REQUIREMENTS: Lethal lookahead on. Binder VETERAN: skip fuse if the player has MP ≥ 3 and a ring exists. Pusher still junior (no second elite tag). `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: Fuse-tile / Shoulder Bash if the caller exists and is used.  
MAP_REQUIREMENTS: Same two-walk-off arena as ENC-WICK-01. No lava dest.  
SPECIAL_RULES: One live fuse at a time. Random 30% lottery off.  
OBJECTIVE: Defeat both. Optional: never occupy a fused cell at tick.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-band victory XP + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Wick PAIR with an elite binder. Distinct from ENC-ELITE-06 (file lancer) and ENC-ELITE-04 (hex blood).  
SOLVABILITY_REQUIREMENTS: Two walk-offs; fuse never both exits.  
REPLAYABILITY: Elite binder vs `FSN-WICK-COURT` convert at peak if Sink is live.  
SCALING_BEHAVIOUR: Do not add a second elite. Scale fuse cadence and pillar tightness, not HP.  
STATUS: PROPOSED

---

### ENC-ELITE-09

ENCOUNTER_ID: ENC-ELITE-09  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-RIME-RANK/E-RANK` — elite `ROLE-LANCER` (Haste to re-align, still no Root, still no bash) + junior rime mason on **one** file.  
AI_REQUIREMENTS: Lancer linear-only. Mason paints the file the lancer wants, not both galleries. Lethal lookahead on.  
SPELL_DISCOVERY_OPPORTUNITIES: File-lance / frost.  
MAP_REQUIREMENTS: `chessboard` or `fortress` with a 4-tile file **and** two galleries. Reroll if no 4-tile file. Ice/rime must not cover both galleries.  
SPECIAL_RULES: One Slow source. Rime enter tax **or** Frost −1, never Root + Rime + Slow. Random 30% lottery off.  
OBJECTIVE: Defeat both. Optional: never share the painted file.  
FAILURE_CONDITION: Player death.  
REWARD: Elite-band. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Rime PAIR with an elite lancer. Distinct from ENC-ELITE-06 (`FSN-FILE-GUARD` peel) and ENC-ELITE-07 (`FSN-IRON-TIDE` tank).  
SOLVABILITY_REQUIREMENTS: Both galleries reachable; rime not on spawn/portal.  
REPLAYABILITY: `FSN-RIME-RANK/FROST` vs convert to `FSN-ICE-FILE/NO-ROOT` at peak if ENC-WIRE-01 was answered this account.  
SCALING_BEHAVIOUR: Promote Root only by converting to `FSN-ICE-FILE`, never on this PAIR.  
STATUS: PROPOSED

---

### ENC-PROT-05

ENCOUNTER_ID: ENC-PROT-05  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-RESCUE-LINE/SHOT` — 1× chaplain rook (Leash Hook **only if** attract caller + ally dest scoring exist; else `starter-shield` / `spell-iron-skin` on the sniper **if** ally `targetId` apply exists, else the chaplain is a fat body) + 1× sniper bishop (`starter-frost`, minRange 3). Teaching CELL omits the third warden. Band 0: no Inferno.  
AI_REQUIREMENTS: Chaplain pulls the sniper only if the sniper is in melee or on a hazard **and** a free ring cell exists that is not the player’s last exit. VETERAN: do not spend if the landing is occupied. Sniper holds ≥ 3. `AI_BACKLINE_PROTECT` on. No Tempo. No Pylon (that is ENC-RARE-05).  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Shield / Iron Skin / (if live) Leash Hook can drop that id if missing.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or open field with cover pillars. Sniper needs a step-off. Chaplain ring needs ≥ 2 free cells. Reject a 1-tile closet. Optional `WF-ZON-VEIL_FONT` on a gallery cell so occupying it hides the sniper’s linear ray — either side may hold it.  
SPECIAL_RULES: The “protect” object is the **sniper’s life as a gun**, not a civilian. Portal locked until both are dead. Distinct from ENC-PROT-01 (escort a shrine) and ENC-PROT-04 (rally drum).  
OBJECTIVE: Defeat both. Intended line: stand on the landing tiles so the rescue fizzles, then collapse the sniper.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage` (not `direct_hit` on first clear — the font invites non-linear tools).  
TACTICAL_PURPOSE: Same gun as Glass Ward; the new verb is **yank the gun off melee**.  
SOLVABILITY_REQUIREMENTS: Two approaches; ring cells reachable; font never on spawn/portal; font is not a walk wall.  
REPLAYABILITY: `FSN-RESCUE-LINE/GOLEM` (add junior warden). `FSN-RESCUE-LINE/CANTOR` at peak (pull a self-mend queen) still no Inferno.  
SCALING_BEHAVIOUR: Elite Chaplain only. Sniper stays junior so two elites cannot 100–0 from full HP.  
STATUS: PROPOSED

---

### ENC-PRIO-07

ENCOUNTER_ID: ENC-PRIO-07  
TYPE: priority-target battle  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-WICK-COURT` lite — elite fuse binder + junior pusher. No Sink on first clear. A **painted fused cell** is the public clock.  
AI_REQUIREMENTS: Binder is the priority body. Pusher peels. `decoyId` unused (the bomb is a tile, not a decoy king). Lethal lookahead on the binder only if the player stands on the wick.  
SPELL_DISCOVERY_OPPORTUNITIES: Fuse-tile.  
MAP_REQUIREMENTS: Two-walk-off arena. Wick tell must stay public.  
SPECIAL_RULES: Intent log names `priorityId: binder`. Killing the pusher first is legal and slower. Distinct from ENC-PRIO-04 (decoy king) and ENC-PRIO-06 (bell pip).  
OBJECTIVE: Defeat the binder before a second tick, then the pusher.  
FAILURE_CONDITION: Player death. A second tick does **not** fail the room (it is a tax).  
REWARD: Standard + small bonus Doka if the binder dies before the first tick. Credit through `applyRewards`. Overlay `no_healing` only after one wick has been seen this account.  
TACTICAL_PURPOSE: Priority is the **bomb author**, not the bruiser. Prepares ENC-RUSH-15 (ram + hex — one object at a time) and ENC-BOSS-05 Wick branch.  
SOLVABILITY_REQUIREMENTS: Two walk-offs; binder reachable by walking.  
REPLAYABILITY: Add Sink (`FSN-WICK-COURT`) at peak if tile-attract is honest.  
SCALING_BEHAVIOUR: Elite Binder only.  
STATUS: PROPOSED

---

### ENC-MOVE-08

ENCOUNTER_ID: ENC-MOVE-08  
TYPE: movement objective  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `ROLE-MIST` knight (`physical_attack`; `proposed:spell-mist-step` **only if** that id is enemy-legal for this body — else Haste + Strike) + 1× pawn charger. No lurker (that is `FSN-MIST-HUNT`).  
AI_REQUIREMENTS: Mist dest must still be a free non-void flank, never the player’s last exit, never a fused cell. Pawn greedy. No LoS puzzle.  
SPELL_DISCOVERY_OPPORTUNITIES: Haste / (if live) Mist Step observe.  
MAP_REQUIREMENTS: Two spawn→portal routes. Short path uses `WF-OBS-HOURGLASS_ARCH` (walkable for three round-starts, then a wall for the rest of the map). Evaluate solvability **as if the arch were already a wall**. Inverse of ENC-MOVE-04’s fallen gate (starts blocked, then opens). Never the only exit.  
SPECIAL_RULES: `objectiveKind: cross_arch_before_seal`. Crossing after the seal is impossible by design; the long path remains. Portal still locked while hostiles live.  
OBJECTIVE: Defeat both. Optional: use the arch at least once before pip 0.  
FAILURE_CONDITION: Player death. Missing the arch is not a fail.  
REWARD: Standard + small bonus Doka if the arch was used. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the shortcut expires.” Distinct from spent bridge (three crossings) and fallen gate (wait to open).  
SOLVABILITY_REQUIREMENTS: Long path spawn→portal without the arch. Arch never on spawn±3. Hostiles reachable via the long path.  
REPLAYABILITY: Arch on north short path vs east.  
SCALING_BEHAVIOUR: High: full `FSN-MIST-HUNT/NO-LEECH`. Peak: haze overlay so planting on the long path after the seal is a tax.  
STATUS: PROPOSED

---

### ENC-MOVE-09

ENCOUNTER_ID: ENC-MOVE-09  
TYPE: movement objective / displacement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× rook warden (`physical_attack` + `starter-shield` at band 1) + 1× bishop (`starter-frost`).  
AI_REQUIREMENTS: Warden camps the far side of `WF-TEL-SWAP_ANCHOR`. Bishop kites. Neither spends the pad unless the player is the nearest body and a swap would dump the player onto leftover flint (`inheritHazardsFrom: ENC-TEACH-05`, optional).  
SPELL_DISCOVERY_OPPORTUNITIES: Shield / frost. Swap-the-spell (`spell-swap`) is **not** granted from the pad (the pad is occupancy, not a spell). Observing live `spell-swap` still requires a kit cast.  
MAP_REQUIREMENTS: Arena with one cyan `WF-TEL-SWAP_ANCHOR` (1 MP swaps with the nearest other living unit; ties break by live initiative; if no other living unit, MP is not spent). Map is solvable without using it. Distinct from ENC-DISP-01 (mirror step pair) and ENC-MOVE-07 (triune pads).  
SPECIAL_RULES: `objectiveKind: optional_nearest_swap`. Swap stays on the walkable graph. Do not key the pad off `effectCategory`.  
OBJECTIVE: Defeat both. Optional: swap once to steal the warden’s tile.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Nearest-body yank as a **map verb**, not a kit. Prepares ENC-RUSH-18 (painted landing vs goad — tools still ignore taunt).  
SOLVABILITY_REQUIREMENTS: Pad not on spawn/portal; both hostiles reachable without it; flint (if inherited) never the only floor around the pad.  
REPLAYABILITY: Pad center vs flank. High: add a junior pawn so “nearest” is a real choice.  
SCALING_BEHAVIOUR: High: warden is elite occupy. Peak: convert to `FSN-BROKEN-GLASS` leftover only if Swap-in was already taught (ENC-DISP-01). Never lava dest.  
STATUS: PROPOSED

---

### ENC-WICK-01

ENCOUNTER_ID: ENC-WICK-01  
TYPE: hazard / fuse occupancy  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-WICK-STEP` — 1× `ROLE-FUSE` queen **without heal** + 1× `ROLE-PUSHER` pawn. Band 0: Frost + painted fused cell; pusher Strike only. Band 1: Fuse + Shoulder Bash **only if** both apply exist.  
AI_REQUIREMENTS: Fuse legality (not both exits; VETERAN skip if MP ≥ 3 and a ring exists). Pusher: skip bash into open floor; dest scoring must not use lava **or** the last unfused exit. Soph 1–2. `groupTactics` not required. Distinct from ENC-FUSE-01 (Swap + kamikaze) and ENC-BELL-01 (unit pip).  
SPELL_DISCOVERY_OPPORTUNITIES: `proposed:spell-fuse-tile` / Shoulder Bash if used. Frost fallback does not grant a fake fuse id.  
MAP_REQUIREMENTS: `arena` or `asymmetric` with pillars / a wall 2 tiles from typical stand, plus two walk-offs. Reject `corridorMaze`. No lava dest. No Void Rift as a legal landing.  
SPECIAL_RULES: Fuse deals 0 on cast. Identity is occupancy at tick. Mark (band 1 optional) sits on a **different** tile as a decoy — Mark does not amp the fuse. Time Warp is **banned** on this id. If fuse apply is not ready, the painted cell still ticks via challenge HP — never Inferno.  
OBJECTIVE: Defeat both. Intended line: leave the cell, occupy the bash landing, or hug a wall the other way.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: The bomb is a **tile**. Standing still is expensive; stepping off is complete.  
SOLVABILITY_REQUIREMENTS: Two walk-offs from the fused cell; fuse never both exits; never the tile under a full-HP player on turn 1 if they can still walk around.  
REPLAYABILITY: `FSN-WICK-STEP/FROST` vs `/E-WICK`.  
SCALING_BEHAVIOUR: Elite Binder only. Peak: `FSN-WICK-COURT` (add Sink) only after this CELL is answered **and** sink landing is honest. Still no lava dest. Still one fuse.  
STATUS: PROPOSED

---

### ENC-RIME-01

ENCOUNTER_ID: ENC-RIME-01  
TYPE: file geometry / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-RIME-RANK` — 1× `ROLE-RIME` bishop + 1× `ROLE-LANCER` rook. Band 0: lancer Strike-on-file only; mason Frosts. Band 1: mason paints the file the lancer wants.  
AI_REQUIREMENTS: Lancer skips unless shared file or rank. Mason paints **one** file, never both galleries. No Root on PAIR. No Slow on the base sheet (rime is the tile tax). Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: File-lance / frost. Do not invent `wave2:spell-file-thrust`.  
MAP_REQUIREMENTS: `chessboard` or `fortress` with **one 4-tile open file plus two galleries**. Reject maps with no 4-tile file. Rime cell is floor. Distinct from ENC-TEACH-04 (no ice tax) and ENC-HAZ-01 (ice tiles, MP double, not a file paint).  
SPECIAL_RULES: Rime enter tax: 3% max HP **or** −1 MP, never both, never also Root. Teleport / Mist Step does **not** pay rime. `ownedFile` metadata. Random 30% lottery off.  
OBJECTIVE: Defeat both. Optional: never share the painted file.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns` / `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the ice is a **cell on the file**, not the whole board. Off-axis you are safe.”  
SOLVABILITY_REQUIREMENTS: Both galleries reachable; rime not on spawn/portal; file not a 1-tile tunnel.  
REPLAYABILITY: File N-S vs E-W. `FSN-RIME-RANK/FROST` if rime apply is not ready — do **not** fake rime with Slow.  
SCALING_BEHAVIOUR: Elite Lancer only (`FSN-RIME-RANK/E-RANK`). Peak: `FSN-ICE-FILE/NO-ROOT` only after ENC-WIRE-01. Still one Slow source.  
STATUS: PROPOSED

---

### ENC-COUP-01

ENCOUNTER_ID: ENC-COUP-01  
TYPE: priority-target / execute  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-COUP-ROT` — 1× `plague_rat` pawn (Poison / Venom) + 1× `ROLE-COUP` knight (`physical_attack`; Coup Strike **only if** player HP% ≤ 25). No Bell. No Sexton. No Inferno. No Glass Realm. No Time Warp. No Sacrifice on the rat.  
AI_REQUIREMENTS: Rat apply-and-leave. Coup paths to 1 and **Strikes only if HP% > 25**, or holds. Never Coup a full-HP player. Never turn-1 surround. Hostiles start ≥ 4 apart. Soph 2–3. Absorb (Ward Plate) is a **counter**, not a member — Coup must not treat absorb as HP.  
SPELL_DISCOVERY_OPPORTUNITIES: Poison / Venom. Coup is ENEMY_ONLY if that is how the proposal ships — observation records, grant never fires.  
MAP_REQUIREMENTS: `openField` or `asymmetric` with two approaches. Coup’s flank must not be the only player exit. No Thorned Ground on the only path to the rat (taxes the correct “stop the ticks” play).  
SPECIAL_RULES: Do not invent `instantKill`. 25% of a full bar is still a large number — Coup is a **finisher**, not a delete. Distinct from ENC-BELL-01 (2-turn clock, 30% tick). Do not pack with `bell_sexton`.  
OBJECTIVE: Defeat both. Intended line: mend above 25%, or kill the glass Coup (`hp` ~0.75) before the window.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `no_healing` only after one Coup window has been seen (otherwise it fights the intended mend). First clear: `under_50_damage`.  
TACTICAL_PURPOSE: Instant-25% lesson. The delayed-clock lesson stays on ENC-BELL-01.  
SOLVABILITY_REQUIREMENTS: Two approaches; rat reachable; Coup cannot spawn on the portal.  
REPLAYABILITY: `FSN-COUP-ROT/VEIL` (Shadow Veil on the approach) at high band. `FSN-COUP-ROT/E-COUP` elite Coup, still no turn-1 Coup on full HP.  
SCALING_BEHAVIOUR: Elite Coup only. Rat stays junior so two elites cannot 100–0 from 26%. Peak: convert to `FSN-FINISH-LINE` only after this CELL **and** ENC-STACK via ENC-AMBUSH-05. Never Tempo-gift the Coup.  
STATUS: PROPOSED

---

### ENC-PLUS-01

ENCOUNTER_ID: ENC-PLUS-01  
TYPE: geometry artillery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PLUS-BATTERY/LANE` — 1× `ROLE-PLUS` rook or queen **without heal** (`starter-frost`; Cross Cut **only if** `hitTiles` occupancy predicate is honest) + 1× glyph bishop (`spell-mark` + `starter-poison`). No Sink on first clear (tile-attract may be missing). No Turret / Pylon. No second `hitsMultiple`. No `starter-blast`.  
AI_REQUIREMENTS: Plus counts `hitTiles` occupancy, never name; skip Cross without geometry. Glyph does not recast Mark on a vacated tile. Solo unmarked player → Frost, not plus. Soph 4–6. Blackboard: `plusOrigin`.  
SPELL_DISCOVERY_OPPORTUNITIES: Mark / Poison / (if live) Cross Cut.  
MAP_REQUIREMENTS: `chessboard`, `openField`, or `arena` with a **5-tile plus** and diagonal walk-offs. Weight 0 on cramped closets / `ruinsIslands` pockets. Optional flint on **one arm** (`inheritHazardsFrom: ENC-TEACH-05`) so clumping to cast is a tax.  
SPECIAL_RULES: Diagonals are safe. Random 30% lottery off. Distinct from ENC-RARE-04 (`FSN-SHARD-BATTERY` bounce) and ENC-WAVE-04 (file/sniper).  
OBJECTIVE: Defeat both. Intended line: diagonal stance, split from a Wisp, step off the Mark.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Geometry gun on a **plus**, not a file. Clumping with a summon is the fail.  
SOLVABILITY_REQUIREMENTS: Diagonal walk-offs from every arm; plus never covers spawn/portal; 2-unit occupancy leaves a corner.  
REPLAYABILITY: `FSN-PLUS-BATTERY/NO-MARK` (Poison only). Full CADRE (add Sink) only if sink landing prefers an arm **and** a diagonal walk-off remains.  
SCALING_BEHAVIOUR: Elite Plus-leader only. Glyph and Sink stay junior.  
STATUS: PROPOSED

---

### ENC-LEASH-01

ENCOUNTER_ID: ENC-LEASH-01  
TYPE: elite intercept / movement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `WF-ELT-LEASH_WARDEN` elite (same-tier × hard) — live `iron_golem` chassis, Strike + `spell-iron-skin` at band 1. Wanders only inside a painted Chebyshev-3 leash around a post. In dungeon they count as a hostile for map-clear — the player must enter the leash.  
AI_REQUIREMENTS: Warden does not path outside the leash. Chokepoint-camp inside the ring. No second elite. No cart (that is ENC-CART-01).  
SPELL_DISCOVERY_OPPORTUNITIES: Iron Skin.  
MAP_REQUIREMENTS: Post + leash ring are floor. Exit reachable without entering the leash **for solvability evaluation**, but the portal stays locked while the warden lives (dungeon). Post is never a portal and never spawn±3. Optional reed screen on one leash cell (cut to enter cheaper).  
SPECIAL_RULES: `objectiveKind: enter_leash`. Distinct from ENC-CART-01 (moving intercept along a path) and ENC-TOLL-01 (pay or long path). Exploration would allow a berth; this sheet is dungeon, so berth is not a win.  
OBJECTIVE: Enter the leash and defeat the warden.  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band `applyRewards` (world-feature hard multiplier on the map’s normal grant — not a second writer). Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Circle until the warden is isolated, then step in. The leash is not a wall.  
SOLVABILITY_REQUIREMENTS: Exit graph exists without the leash; counts as 1 toward `MAX_ENEMIES`; post reachable once the player chooses to enter.  
REPLAYABILITY: Post NW vs SE. High: warden kit adds frost along the leash rim. Peak: convert to `WF-INV-PHALANX_LINE` (3 elites) only if the roster can fit 3 — that is ENC-RARE-05’s other skin, not this id.  
SCALING_BEHAVIOUR: Same-tier × threat 1.35 → 1.75, not extra HP sponges. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-FONT-01

ENCOUNTER_ID: ENC-FONT-01  
TYPE: hold / LoS contest  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-SMOKE-GLASS` PAIR (thurifer + sniper) contesting a `WF-ZON-VEIL_FONT`.  
AI_REQUIREMENTS: Sniper holds minRange 3. Thurifer smokes a live ray **or** occupies the font (while occupying, `linear === true` spells treat that cell as a LoS wall). Non-linear, Attack Nearest, and summons unchanged. Either side may hold the font.  
SPELL_DISCOVERY_OPPORTUNITIES: Frost / smoke.  
MAP_REQUIREMENTS: Fortress lane + side aisle. Font on a gallery cell, never spawn/portal. Font is not a walk wall. Optional reed on the **other** gallery (shoot-through). Do not also Fog of War.  
SPECIAL_RULES: `objectiveKind: occupy_veil_font`. Portal locked until hostiles are dead, not until the font is held. Distinct from ENC-HOLD-01 (banner contest) and ENC-PROT-03 (ward circle). Null Field does not strip the font (it is occupancy, not a buff).  
OBJECTIVE: Defeat both. Optional: occupy the font during the sniper’s cast so the frost fizzles LoS.  
FAILURE_CONDITION: Player death. Losing the font is not a fail.  
REWARD: Standard + small bonus Doka if the player occupied the font for ≥ 2 player-turns. Overlay `direct_hit` is fair (non-linear tools are the intended contest).  
TACTICAL_PURPOSE: Plant on the font to hide from linear — and give up linear yourself.  
SOLVABILITY_REQUIREMENTS: Aisle reaches the sniper without the font; font walkable; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Font north vs east. High: `FSN-SMOKE-GLASS/E-SHOT`. Peak: `FSN-SMOKE-HUNT` add Optic (range shrink) only after this PAIR.  
SCALING_BEHAVIOUR: Elite Sniper only. Thurifer stays junior.  
STATUS: PROPOSED

---

### ENC-TAX-01

ENCOUNTER_ID: ENC-TAX-01  
TYPE: hazard / leftover drop-3  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GRAVITY-TAX` lite — 1× `ROLE-ANCHOR` bishop (Hook Line if attract caller exists; else frost + skip-if-adjacent so hugging the bishop is still the immune) + 1× `ROLE-TAX` scribe (`spell-mark` on a **painted tax glyph**; standing on it at end of turn costs 4% max HP via challenge HP). No pusher on first clear (ENC-SLAM-01 already taught bash). No Inferno. No lava dest.  
AI_REQUIREMENTS: Anchor skips if the player is adjacent. Tax does not recast Mark on a vacated glyph. One AP-tax engine. Distinct from ENC-SLAM-01 (attract then push, peak convert only).  
SPELL_DISCOVERY_OPPORTUNITIES: Mark / frost / (if live) Hook Line. Glyph Tax as ENEMY_ONLY if that is how the proposal ships.  
MAP_REQUIREMENTS: Arena with one painted glyph cell and two walk-offs. Glyph never on spawn/portal.  
SPECIAL_RULES: Skip this id if ENC-SLAM-01 has not been answered this account (the pull without a taught hug-immune is a new verb stacked on an old one). If attract callers are missing, the bishop is frost-kite only and the glyph is the whole lesson.  
OBJECTIVE: Defeat both. Intended line: hug the anchor, step off the glyph before end of turn.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Spend leftover `FSN-GRAVITY-TAX` as a **dedicated** beat, not a silent peak convert.  
SOLVABILITY_REQUIREMENTS: Path around the glyph; hug-tiles exist adjacent to the bishop; 2-unit occupancy leaves a ring.  
REPLAYABILITY: Glyph N vs E. Peak: add junior pusher (`FSN-HOOK-SLAM` + tax) still one AP-tax engine.  
SCALING_BEHAVIOUR: Elite Tax only. Anchor stays junior.  
STATUS: PROPOSED

---

### ENC-TITHE-01

ENCOUNTER_ID: ENC-TITHE-01  
TYPE: optional challenge / treasure-risk  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Empty on entry. Flag tile: `WF-RSK-SEEPING_TITHE`. If the player flags (end a turn on the inlay, pay 8% max HP once), spawn `FSN-WICK-STEP` (binder + pusher) on `titheCells` — they walk to the player. Per-turn 4% max HP starts on subsequent **player** turns. Enemies do not pay the tithe.  
AI_REQUIREMENTS: Same as ENC-WICK-01. If the player never flags, no hostiles spawn and the portal unlocks (the skip is complete).  
SPELL_DISCOVERY_OPPORTUNITIES: None if skipped. Fuse observe if flagged and they cast.  
MAP_REQUIREMENTS: Rest-like court with a copper-black inlay and a locked progression portal that **unlocks on skip or on clear**. Inlay not on spawn. Distinct from ENC-OATH-01 (no-walk wager) and ENC-TREAS-03 (doka_fever).  
SPECIAL_RULES: `objectiveKind: flag_seeping_tithe`. Extreme `applyRewards` multiplier on the **next** enqueue only if the player flagged. One flag, this map only. Death still uses `saveBattleStats`. Overlay none (the tithe *is* the challenge).  
OBJECTIVE: Skip, or flag and clear the wick PAIR.  
FAILURE_CONDITION: Player death after flagging. Skipping is success with the normal (not extreme) grant.  
REWARD: Skip: low rest grant. Flag + clear: extreme multiplier on the victory `applyRewards`. Never a second writer.  
TACTICAL_PURPOSE: Repeating HP tax for an extreme purse. Optional.  
SOLVABILITY_REQUIREMENTS: Map solvable if the inlay is never used. `titheCells` reachable. Portal never the inlay.  
REPLAYABILITY: Wick PAIR vs `FSN-RIME-RANK` for Rime-branched accounts.  
SCALING_BEHAVIOUR: Same-tier spawn. Do not raise levels to “make the tithe worth it.”  
STATUS: PROPOSED

---

### ENC-RARE-05

ENCOUNTER_ID: ENC-RARE-05  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-BASTION-GATE/POST` — 1× `ROLE-PYLON` rook (stationary 0-damage summon, cap 1, lifespan 4, `ap: 0`, `mp: 0`, must not path, must not cast, `damageScale: 0`) + 1× `ROLE-GOAD` pawn or knight (Goad if `tauntCasterId` exists; else the herald is a charger that **body-blocks** the pylon file). Teaching BRIGADE omits sniper and smoke. If pylon summon AI is missing, substitute live `iron_golem` occupy + goad-charger — still no turret (`stone_castellan`). Do not co-spawn turret. Shares `ENEMY_SUMMON_CAP` (this sheet uses 1).  
AI_REQUIREMENTS: Pylon owner: summoner + proposed cap/cooldown fall-through (Shield or Frost, never skip-lock). Goad: skip redundant Goad; non-damage ignores taunt. Soph 6–8 on full COURT; POST ships at 3–4. `instantKill` / `betrayal` off. `bottleneckControl` only if a gallery exists. **Do not ship Goad** before `tauntCasterId`.  
SPELL_DISCOVERY_OPPORTUNITIES: Goad / Shield. Pylon is not a spell grant. 0 XP on pylon death.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or corridor **with a detour**. Never a closed ring. Weight 0 on 1-tile closets. Pylon placement ring: ≥ 3 free cells, none void. Player must have a tile off the blocked file. Alternate skin: `WF-INV-PHALANX_LINE` (3 same-tier elites in a painted line) if the roster can fit 3 **and** the account has not answered POST this week.  
SPECIAL_RULES: One elite only: the Prelate-leader (or the middle phalanx body). Pain Link stays **off**. Open field: **reroll** this id rather than retune pylon damage. Rare elite tag (`variant: rare_elite`). Insert; do not replace a beat.  
OBJECTIVE: Defeat the pack (pylon death is not a player kill).  
FAILURE_CONDITION: Player death.  
REWARD: Rare-band Doka/XP via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Taunt into a post, or walk the gallery. Court-scale geometry without a new sprite.  
SOLVABILITY_REQUIREMENTS: Detour exists; pylon ring legal; phalanx skip if cap would break.  
REPLAYABILITY: POST vs Phalanx Line vs `FSN-ICE-FILE/NO-LEADER` if the account answered ENC-RIME-01 + ENC-WIRE-01. `FSN-PLATE-LINK/NO-CANTOR` (absorb + redirect) as a fourth skin only if Ward Plate **and** Pain Link are live. `FSN-BELL-COURT` only after ENC-BELL-01. `FSN-RIFT-KNOT` only after a Void-mixed account answered ENC-TEACH-02.  
SCALING_BEHAVIOUR: Do not add a fifth hostile to this id. Extra dungeon bodies spawn elsewhere, outside Chebyshev 4, as a separate PAIR.  
STATUS: PROPOSED

---

### ENC-TREAS-05

ENCOUNTER_ID: ENC-TREAS-05  
TYPE: treasure / risk room  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Empty until a cache resolves. Device: `WF-TRS-PATIENCE_CACHE` (visible chest with two sand pips). Adjacent 1 AP opens it **now** for a guaranteed soft `applyRewards` grant and no guardian. If left closed, after two round-starts it auto-opens: 50% medium grant, 50% one same-tier guardian (`FSN-RIME-RANK/FROST` lancer only) and no grant. Manual open cancels the auto-open — no double grant. Optional second device: `WF-EVT-IRON_LENT` (if current HP never increased this map, the next `applyRewards` uses the hard multiplier).  
AI_REQUIREMENTS: Guardian, if spawned, is Strike-on-file only. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Rest-like court. Chest adjacent-open, not a wall. If no guardian cell, a failed auto-open pays the medium grant with no guardian. Portal colocates with spawn after resolve. Distinct from ENC-TREAS-04 (split left/right) and ENC-TREAS-02 (three chests).  
SPECIAL_RULES: `deviceTable[]`. Credits via persist-lock `applyRewards` only. `doka_fever` stays out. Overlay none (the wait *is* the challenge). Iron Lent: taking damage is allowed; any HP **gain** (shrine, potion, zone heal) voids the hard multiplier.  
OBJECTIVE: Open now, wait, or walk past (portal still works).  
FAILURE_CONDITION: Player death if a guardian spawns. Walking past is success with no chest grant.  
REWARD: Soft / medium / hard as above. Guardian victory pays standard kill XP plus the **missed** chest is gone.  
TACTICAL_PURPOSE: Sure small purse vs maybe-better auto-open. Iron Lent asks whether you skip heals.  
SOLVABILITY_REQUIREMENTS: Chest not a cut-vertex; guardian cell reachable if used; portal reachable without opening.  
REPLAYABILITY: Guardian lancer vs wick binder for Wick-branched accounts.  
SCALING_BEHAVIOUR: Same-tier guardian. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-REST-05

ENCOUNTER_ID: ENC-REST-05  
TYPE: rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: None. Optional shrine pool leftover (`WF-ZON-SHRINE_POOL`) **or** Iron Lent corona — never both (heal vs skip-heal wager).  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine reminder for missing fuse / rime / plus ids already observed this chain. Reminder, not a grant. Optional `WF-SPL-ECHO_SCRIBE` is ENC-SPELL-10, not this rest.  
MAP_REQUIREMENTS: White / rest map. Three exits: `normal` (overworld), `dungeon` (continue chain), `boss` (Boss Rush). White sanctuary portal colocates with spawn (`placeWhitePortalAtSpawn`), never `(0, 0)`. Snapshot dungeon-chain refs **before** `cleanupMap`. Rest-exit must re-arm depth 1 on the refs (`shouldArmDungeonChainOnRestExit`). `WF-PRT-WAGER_GATE` **forbidden** here if this rest is inside a dungeon-chain (portal-filter). Overworld-only wager gate may sit beside a stable exit. `WF-PRT-LATCH_GATE` rest/overworld only, never the only portal.  
SPECIAL_RULES: No hostiles. `holdPortalLocked` false. Optional `chaos_initiative` as an **announce-and-opt-in shrine** only if a later human wires a WX hook; until then do not pretend it reshuffles this rest.  
OBJECTIVE: Choose an exit. Optional: drink, or skip-heal for Iron Lent then take `dungeon`.  
FAILURE_CONDITION: None in-room. Death Realm if the player somehow dies (should be impossible).  
REWARD: None, or shrine 8% max HP (not `applyRewards`). Iron Lent multiplies the **next** dungeon room’s `applyRewards` only.  
TACTICAL_PURPOSE: Choice / rest beat. Skip pressure at the cost of a weaker mastery reward.  
SOLVABILITY_REQUIREMENTS: All three exit types reachable from spawn. White portal on spawn.  
REPLAYABILITY: Shrine vs Lent vs neither.  
SCALING_BEHAVIOUR: None.  
STATUS: PROPOSED

---

### ENC-BRANCH-05

ENCOUNTER_ID: ENC-BRANCH-05  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Foyer: 2× pawn chargers (no elites). Doors are the content.  
AI_REQUIREMENTS: Pawns greedy. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: None in the foyer.  
MAP_REQUIREMENTS: Foyer with four portals: Wick (`FSN-WICK-STEP` / pendulum / gnomon → ENC-WICK-01 or ENC-HAZ-09 or ENC-PRIO-07), Rime (lancer / painted file → ENC-TEACH-05’s cousin ENC-RIME-01 or ENC-ELITE-09), Smoke (reed / font / haze → ENC-HAZ-10 or ENC-FONT-01 or ENC-SURV-09), Plus (flint / plus-arm → ENC-PLUS-01 or ENC-TEACH-05). A sealed fifth door to ENC-RARE-05 opens only if the account has cleared all four branches at least once (long-term, not this run). Snapshot `branchFlag` **before** `cleanupMap`.  
SPECIAL_RULES: `branchFlag?: wick | rime | smoke | plus`. Portals locked until foyer pawns are dead. Do not infer branch from door art names — use `branchFlag`.  
OBJECTIVE: Clear the foyer, pick a door.  
FAILURE_CONDITION: Player death.  
REWARD: Foyer standard. Branch rooms pay their own tables.  
TACTICAL_PURPOSE: Four-way identity pick so mastery / boss read a remembered verb.  
SOLVABILITY_REQUIREMENTS: All four doors reachable after foyer clear; fifth sealed door does not block solvability.  
REPLAYABILITY: Door order clockwise vs mirrored.  
SCALING_BEHAVIOUR: Foyer stays 2 pawns. Difficulty lives behind the doors.  
STATUS: PROPOSED

---

### ENC-MINI-06

ENCOUNTER_ID: ENC-MINI-06  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Live `bone_cavalier` **solo** (knight landings / vault kit from `bossKits.ts`) as a dungeon mini-boss. Wave-5 `ram_castellan` stays **out of `BOSS_IDS`**. No dual-boss. No Table C pairing.  
AI_REQUIREMENTS: Existing cavalier boss AI. No `instantKill`. Preferred cells from current boss spawn.  
SPELL_DISCOVERY_OPPORTUNITIES: Vault / Caltrop if those ids are in the live kit and used.  
MAP_REQUIREMENTS: Fortress lane + gallery (file ram reads). Optional hourglass arch on the short path so the landing race has a timer.  
SPECIAL_RULES: Mini-boss: one `BossId`, no Rush partner. Distinct from ENC-MINI-05 (tide/file clock mini). Do not add Wave-5 ids in the same change as a Rush remap.  
OBJECTIVE: Defeat the cavalier.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss band via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: File-ram readability the Wick primer taught in ENC-WICK-01 / ENC-RIME-01, without a second boss. Prepares ENC-RUSH-15.  
SOLVABILITY_REQUIREMENTS: Preferred cells + gallery reachable.  
REPLAYABILITY: Cavalier vs `alabaster_fortress` for Plus-branched accounts (post occupy).  
SCALING_BEHAVIOUR: Do not add a partner. Tighten by gallery tightness and leftover flint, not HP.  
STATUS: PROPOSED

---

### ENC-BOSS-05

ENCOUNTER_ID: ENC-BOSS-05  
TYPE: boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One live `BossId` from the 19, read from `branchFlag`:

| `branchFlag` | Live fallback | Why this verb |
| :--- | :--- | :--- |
| `wick` | `crimson_countess` | Occupancy / trail clock without a new fuse boss |
| `rime` | `bone_cavalier` | File / landing tax |
| `smoke` | `void_grandmaster` | LoS / identity (illusions, not fog-of-war chrome) |
| `plus` | `alabaster_fortress` | Occupy / shrink geometry |
| unset | `fetid_rook` | Rot stacks as a generic “clock you can see” |

Wave-5 ids stay out. Dual-boss dungeon capstones stay Rush-only.  
AI_REQUIREMENTS: Existing boss AI for that id. Full gates except 9/10.  
SPELL_DISCOVERY_OPPORTUNITIES: Per `bossKits.ts` for that id; observation still requires use → win.  
MAP_REQUIREMENTS: Boss arena matching the live kit (Countess lava cap 50; Cavalier preferred cells; Grandmaster identity space; Fortress resonance walls must not seal pockets). Re-run solvability after kit tiles.  
SPECIAL_RULES: Read `branchFlag` snapshotted before cleanup. Do not name-match “if they are called Ram Castellan.”  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death.  
REWARD: Boss-band depth Doka/XP via `applyRewards`. Rush Doka in `BOSS_RUSH_ROOMS` is a different table.  
TACTICAL_PURPOSE: Capstone using the taught verb + one shipped `BossId`.  
SOLVABILITY_REQUIREMENTS: Spawn, boss, and exit reachable; kit extras under cap 4 where the bible says so; hazards ≤ 50.  
REPLAYABILITY: Branch table above.  
SCALING_BEHAVIOUR: Boss sheets already scale by phase, not by player level. Do not attach `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-09

ENCOUNTER_ID: ENC-SPELL-09  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× fuse queen **without heal** (`starter-frost` + painted fused cell). No pusher (the discovery is the occupancy tell).  
AI_REQUIREMENTS: Queen fuses a choke with two walk-offs, never both exits. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: `proposed:spell-fuse-tile` if live, used, and the player wins. Fallback: frost observation only — do **not** grant a fake fuse id from a painted cell. Possession is not observation.  
MAP_REQUIREMENTS: Small court, two walk-offs, one fused cell with a public pip. No lava.  
SPECIAL_RULES: `scriptedHazardsOnly`. Teach line on first tick the player is **not** on the cell (“the bomb is the floor”).  
OBJECTIVE: Defeat the queen. Optional: never occupy the cell at tick.  
FAILURE_CONDITION: Player death.  
REWARD: Low-band + possible fuse grant through the discovery pipeline (not `upgradeSpell` as a writer of new ownership — grant then the player levels via `upgradeSpell` later). Overlay `under_15_turns`.  
TACTICAL_PURPOSE: One-spell lesson that prepares ENC-WICK-01. Distinct from ENC-SPELL-07 (loaner mage).  
SOLVABILITY_REQUIREMENTS: Two walk-offs; queen reachable.  
REPLAYABILITY: If fuse already owned, convert to ENC-SPELL-10.  
SCALING_BEHAVIOUR: None.  
STATUS: PROPOSED

---

### ENC-SPELL-10

ENCOUNTER_ID: ENC-SPELL-10  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `WF-SPL-ECHO_SCRIBE` (same-tier enemy, medium threat, extra `usableByEnemy` spells — prefer `starter-frost` + `spell-slow` or `spell-mark`). On death the player may take the **last spell id that scribe actually cast this fight** as a single remaining cast this map. If they never cast a spell (only Attack Nearest / movement), there is no grant.  
AI_REQUIREMENTS: Scribe prefers a spell over Attack Nearest so the tell can fire. Skip-lock forbidden.  
SPELL_DISCOVERY_OPPORTUNITIES: The one-cast is **not** `upgradeSpell` and does **not** persist `spellLevel*` arrays. A separate observation pipeline may still grant the id after a later win if the sibling ecosystem says so. Distinct from ENC-SPELL-07 (`WF-SPL-LOANER_MAGE` pre-chosen one-cast).  
MAP_REQUIREMENTS: Prefer replacing one existing spawn; else +1 if under the enemy cap. Must stay reachable.  
SPECIAL_RULES: Copied id is the last spell they cast, metadata only. Attack Nearest is not a spell.  
OBJECTIVE: Defeat the scribe. Optional: bait a utility cast then take it.  
FAILURE_CONDITION: Player death.  
REWARD: Standard kill XP + optional one-cast. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Bait-then-copy vs burst-before-they-show.  
SOLVABILITY_REQUIREMENTS: Scribe reachable; not on portal.  
REPLAYABILITY: Frost vs Slow vs Mark kit.  
SCALING_BEHAVIOUR: Same-tier. Do not add a second scribe.  
STATUS: PROPOSED

---

### ENC-MAST-05

ENCOUNTER_ID: ENC-MAST-05  
TYPE: mastery  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Wave 1: 2× pawn on flint dust (`WF-HAZ-FLINT_DUST`). Wave 2: `FSN-WICK-STEP` **or** `FSN-RIME-RANK` **or** `FSN-SMOKE-GLASS` **or** `FSN-PLUS-BATTERY/LANE` by `branch` (Wick vs Rime vs Smoke vs Plus). Wave 3: elite leftover (E-WICK binder **or** E-RANK lancer **or** E-SHOT sniper **or** Plus-leader) + leftover. Hard-cap 4 living.  
AI_REQUIREMENTS: Wave 2 uses the named pack’s AI. Wave 3 elite as ENC-ELITE-08/09. Full gates except 9/10.  
SPELL_DISCOVERY_OPPORTUNITIES: Branch kit observe.  
MAP_REQUIREMENTS: Arena that satisfies the branch pack’s map contract (two walk-offs **or** 4-tile file **or** lane+aisle **or** 5-tile plus). Inherit the matching hazard (flint / censer / reed / plus-arm).  
SPECIAL_RULES: Portal locked until wave 3 is clear. Random 30% lottery off. `branchFlag` required; if unset, default Wick.  
OBJECTIVE: Clear all three waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery-band. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Prove the remembered verb under wave cadence.  
SOLVABILITY_REQUIREMENTS: Branch map contract + `waveSpawnCells` reachable. Cap 4.  
REPLAYABILITY: Four branch skins.  
SCALING_BEHAVIOUR: Wave 3 elite tag only. No extra HP.  
STATUS: PROPOSED

---

### ENC-RUSH-15

ENCOUNTER_ID: ENC-RUSH-15  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table C `C0`: `ram_castellan` + `hexed_marker`. Combined question: get shoved, or leave the Hex. **Fallback if Wave-5 ids are not in `BOSS_IDS`:** live `bone_cavalier` + `pale_archivist` (file landing + glyph mark) with the same hard rule — Hex/glyph **never** occupies a telegraphed ram ray.  
AI_REQUIREMENTS: Existing pair AI. Slam is spell-hit, not a Hex detonate. Brace and Hex tiles are both objects/marks.  
SPELL_DISCOVERY_OPPORTUNITIES: Shoulder Bash / Hex movement as the kits allow.  
MAP_REQUIREMENTS: Rush preferred cells. A gallery off the ram file.  
SPECIAL_RULES: `rushTable: C`, `rushVariant: table_c_ram_hex`, `roomIndex` namespace `C0`. Do **not** overwrite `BOSS_RUSH_ROOMS` or Table B. Unlock: one complete Table B clear. Shared 4-extra cap. Flat Rush Doka/XP — do not also multiply by `rewardDokaMultiplier` or player level. Persist through `buildBossRushPersistInput` → `applyRewards` only. Do not pair `ram_castellan` with Fosse / Hook / Rime / Dowager.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table C room grant (document numbers; continue the live jackpot curve without a player-level exponent).  
TACTICAL_PURPOSE: File-ram + leave-the-Hex, one answer at a time.  
SOLVABILITY_REQUIREMENTS: Preferred cells + gallery; Hex never on the ram ray.  
REPLAYABILITY: Live fallback pair vs Wave-5 pair once ids ship **in a later change**.  
SCALING_BEHAVIOUR: Phase tables, not HP sponges.  
STATUS: PROPOSED

---

### ENC-RUSH-16

ENCOUNTER_ID: ENC-RUSH-16  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table C `C1`: `fosse_warden` + `cinder_lance`. Combined question: shoot the glowing window **across** a pit. **Fallback:** live `starborn_queen` + `crimson_countess` is **illegal** here (void + lava clones Table A room 3/1). Prefer live `lord_of_static` + `alabaster_fortress` only if pits can be **objects** that never occupy a telegraphed lance tile; otherwise **hold this room** until Wave-5 ids ship.  
AI_REQUIREMENTS: Pits never occupy a telegraphed lance tile. Causeway is the only walk across. Wrong-element still −50%. Not Ivory (two walk-blocks).  
SPELL_DISCOVERY_OPPORTUNITIES: File Lance / Open Pit as kits allow.  
MAP_REQUIREMENTS: Causeway + one pit object cap that counts toward `MAX_HAZARD_TILES`.  
SPECIAL_RULES: `rushTable: C`, `rushVariant: table_c_fosse_lance`, `C1`. Unlock after Table B. Do not ship a fake pit as lava.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Table C grant via `applyRewards`.  
TACTICAL_PURPOSE: Geometry gun across a hole, not a sponge.  
SOLVABILITY_REQUIREMENTS: Causeway spawn→both bosses→exit; pits are not cut-vertices.  
REPLAYABILITY: Hold vs Wave-5.  
SCALING_BEHAVIOUR: Phase tables.  
STATUS: PROPOSED

---

### ENC-RUSH-17

ENCOUNTER_ID: ENC-RUSH-17  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table C `C2`: `stride_censor` + `silent_conductor`. Combined question: stay still **on a sounding file**. **Fallback:** live `silent_conductor` is Wave-2 and not in `BOSS_IDS`; use live `pale_archbishop` + `midnight_bishop` only as a **silence-file remix** if Conductor is missing — files rotate onto the player’s **current** file, not a forced walk. Ledger + musicians share cap 4 (musicians only). Not Pendulum.  
AI_REQUIREMENTS: Stride Brand walk-MP tithe (if live) stacks with “stay still” only as a **choice** (move and pay MP, or plant and pay the haze-like tax) — never both as mandatory. Prefer one tax engine per seed.  
SPELL_DISCOVERY_OPPORTUNITIES: Stride Brand / silence-lane as kits allow.  
MAP_REQUIREMENTS: Chessboard with rotating sounding files.  
SPECIAL_RULES: `rushTable: C`, `rushVariant: table_c_stride_silence`, `C2`.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Table C grant via `applyRewards`.  
TACTICAL_PURPOSE: Plant on a sounding file, or walk and pay — one question.  
SOLVABILITY_REQUIREMENTS: A sounding file is always reachable; silence never seals the only exit.  
REPLAYABILITY: Live remix vs Wave-5.  
SCALING_BEHAVIOUR: Phase tables.  
STATUS: PROPOSED

---

### ENC-RUSH-18

ENCOUNTER_ID: ENC-RUSH-18  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table C `C3`: `morrow_herald` + `goad_pretender`. Combined question: she lands where the Crown told you to look. **Fallback:** live `void_grandmaster` + `twin_monarchs` is **illegal** (two teleports / two dual-bodies). Hold this room until Wave-5 / Wave-4 goad ids ship, **or** remix live `bone_cavalier` (painted landing) + a junior `ROLE-GOAD` charger **without** a second teleport. Taunt does **not** force standing on the painted landing (tools still ignore taunt). Hour-bell and Crown are both objects. Not Grandmaster.  
AI_REQUIREMENTS: **Do not ship Goad** before `tauntCasterId`. Morrow Step delayed blink is a painted pip, not a hidden teleport.  
SPELL_DISCOVERY_OPPORTUNITIES: Morrow Step / Goad as kits allow.  
MAP_REQUIREMENTS: Arena with a painted landing cell and a Crown object. Landing never lava / void / portal.  
SPECIAL_RULES: `rushTable: C`, `rushVariant: table_c_morrow_goad`, `C3`.  
OBJECTIVE: Defeat both.  
FAILURE_CONDITION: Player death.  
REWARD: Table C grant via `applyRewards`.  
TACTICAL_PURPOSE: Delayed blink vs goad — look where she will be, without being forced onto the pip.  
SOLVABILITY_REQUIREMENTS: Landing is floor; a walk-off remains; Crown is not a cut-vertex.  
REPLAYABILITY: Hold vs Wave-5.  
SCALING_BEHAVIOUR: Phase tables. Shared extra cap.  
STATUS: PROPOSED

---

### ENC-SURV-10

ENCOUNTER_ID: ENC-SURV-10  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: WICK-STEP binder only (no pusher — pendulum is the pusher). Wave B overlaps at turn 3: RIME-RANK lancer (no mason). Wave C at turn 6: one elite golem. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Binder fuses a choke. Lancer holds the file. Golem camps the last clean tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-HAZ-PENDULUM_CENSER` + `WF-MOD-HEAVY_INCANT` (spells with `apCost >= 3` also spend 1 MP if the caster has ≥ 1 current MP; 0 MP still casts). Skip Isolation and Short Fuse here (ENC-SURV-07 / ENC-SURV-08 already spent them). Never both Heavy Incant and `arcane_overflow`. Never `titans_vigor`. Optional flint on the nave **sides**, not the nave cells.  
SPECIAL_RULES: Overlap + reversing nave + heavy-AP MP tax is the escalation vs ENC-SURV-09. Flee remnants when the clock ends. Attack Nearest and summons are not spells (Heavy Incant ignores them).  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-09. Overlay `no_healing` (not `no_damage_taken`).  
TACTICAL_PURPOSE: Peak pressure that spends leftover pendulum + Heavy Incant so late-game maps are not “haze again” or “orbit again.”  
SOLVABILITY_REQUIREMENTS: Path around the nave; 4-unit occupancy leaves a walkable ring; Heavy Incant never seals tiles; censer never covers spawn or exit.  
REPLAYABILITY: Wave C golem vs plus-leader for Plus-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain I — “Wick / Rime / Smoke / Plus Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-05 then ENC-SPELL-09 (or ENC-SPELL-10 if fuse already owned) |
| 2 | Reinforce | ENC-WAVE-06 |
| 3 | Combine | ENC-HAZ-09 then ENC-WICK-01 **or** ENC-RIME-01 **or** ENC-HAZ-10 |
| 3 insert | Choice | ENC-BRANCH-05 → Wick/Rime/Smoke/Plus destinations |
| 4 | Pressure | ENC-SURV-09 **or** ENC-COUP-01 **or** ENC-PLUS-01 **or** ENC-PROT-05 **or** ENC-LEASH-01 **or** skip via ENC-REST-05 |
| 4 | Mastery | ENC-MAST-05 (branch skin) |
| 5 | Boss | ENC-BOSS-05 |

Rare: 8% on depth 4 to **insert** ENC-RARE-05 before mastery.  
Treasure: rest may offer ENC-TREAS-05 instead of PROT-05.  
Tithe side-story: replace combine with ENC-TITHE-01 and mini-boss ENC-MINI-06; capstone may become `bone_cavalier` if Wick was not the door.

### Chain J — “Arch Primer” (maxDepth 4)

ENC-MOVE-08 → ENC-MOVE-09 → ENC-FONT-01 → ENC-REST-05 → ENC-BOSS-05 (`void_grandmaster` only if Smoke was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-08 as teach on accounts that already know flint/wick.

### Rush injection (day-5)

After one full Table B clear (`B0`–`B3`), ENC-REST-05 shrine can enable: `C0` → ENC-RUSH-15, `C1` → ENC-RUSH-16, `C2` → ENC-RUSH-17, `C3` → ENC-RUSH-18. Day-1 flags for rooms 0 / 3 / 9, day-2 flags for rooms 1 / 2 / 4 / 5 / 8, day-3 flags for rooms 6 / 7, and day-4 flags for Table B remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-05, ENC-SPELL-09, ENC-SPELL-10, ENC-RIME-01 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-09, ENC-HAZ-10, ENC-WICK-01, ENC-MOVE-08, ENC-MOVE-09 | `under_50_damage` |
| ENC-AMBUSH-05, ENC-REINF-05 | `no_healing` |
| ENC-WAVE-06 | `under_15_turns` (first clear); `under_10_turns` after |
| ENC-PROT-05, ENC-FONT-01 | `under_50_damage` / `direct_hit` (font) |
| ENC-ELITE-08, ENC-ELITE-09, ENC-PLUS-01, ENC-TAX-01, ENC-MAST-05, ENC-MINI-06 | `under_8_ap_per_turn` |
| ENC-SURV-09, ENC-SURV-10 | `no_healing` (not `no_damage_taken`) |
| ENC-LEASH-01 | `under_10_turns` |
| ENC-COUP-01, ENC-PRIO-07 | `no_healing` only after one window has been seen |
| ENC-TREAS-05 / ENC-REST-05 / ENC-TITHE-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 1–2 roles, one verb | no lookahead | zone 0, no family | flint dust or painted fuse | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | flint **or** pendulum | kill + optional gnomon |
| MID | named drop-4 `FSN-*` or waves | backline guard | zone 1 + Fuse/File | one `WF-*` | clock / tags / font / arch |
| HIGH | elite or coup / plus / rescue | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / leash / tithe |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table C |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit flint, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure (day-3). Patience Cache / Seeping Tithe / Iron Lent are day-5 opt-in multipliers on `applyRewards` only.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-4 fields plus:

```
encounterId
encounterType        // + wick | rime | coup | plus | leash | font | tithe | gnomon
formationId?         // FSN-WICK-STEP | FSN-RIME-RANK | FSN-SMOKE-GLASS |
                     // FSN-STACK-CASH | FSN-COUP-ROT | FSN-WICK-COURT |
                     // FSN-TEMPO-CHOIR | FSN-FOG-FUSE | FSN-RESCUE-LINE |
                     // FSN-ICE-FILE | FSN-SMOKE-HUNT | FSN-PLUS-BATTERY |
                     // FSN-ABSOLVE-RACE | FSN-TWIN-PLATE | FSN-FINISH-LINE |
                     // FSN-BASTION-GATE | FSN-GRAVITY-TAX | FSN-PLATE-LINK |
                     // FSN-BELL-COURT | FSN-RIFT-KNOT
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
ownedFile?           // axis for ROLE-LANCER / ROLE-RIME
plusOrigin?          // plus-arm origin
fusedCell?           // occupancy clock
rimeFile?            // painted enter-tax file
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // wick | rime | smoke | plus
holdPortalLocked?
objectiveKind        // + occupy_veil_font | cross_arch_before_seal |
                     // optional_nearest_swap | enter_leash |
                     // flag_seeping_tithe | survive_fuse_tick |
                     // never_share_rime_file
failureKind
deviceTable[]        // ENC-TREAS-05
rushVariant?         // table_c_ram_hex | table_c_fosse_lance |
                     // table_c_stride_silence | table_c_morrow_goad
rushTable?           // A (rooms 0–9) | B (B0–B3) | C (C0–C3)
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Ram Castellan / Final Pawn” logic — use `formationId` / `fusedCell` / `branchFlag` / `decoyId`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31, 2026-09-01, 2026-09-02, or 2026-09-21 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not (those four are announce-only in `mapModifiers.ts` as of `0f5363f`).
- Dual-boss dungeon capstones (Rush only).
- Adding Wave-2/3/4/5 ids to `BOSS_IDS` in the same change as a Rush string remap.
- Wiring `applyPushback` / `applyAttract` callers, trap≠`placeBarrier`, fuse-tile apply, rime-tile apply, Cross Cut `hitTiles`, `tauntCasterId`, pylon summon AI, or ally `targetId` apply — rooms above name **fallbacks** until those exist.
- Shipping `FSN-FOG-FUSE` without a public wick tell under smoke.
- Shipping `FSN-TEMPO-CHOIR` before ally Tempo apply.
- Packing `coup_duelist` with `bell_sexton` as a teaching pair.
- `WF-PRT-LATCH_GATE` / `WF-PRT-WAGER_GATE` inside dungeon / boss rush / Death Realm.
- Faking fuse as Inferno, rime as Slow, smoke as Barrier, bash as “more Strike,” or pits as lava.

---

## 10. Pick order (day-5, after day-1 / day-2 / day-3 / day-4 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Day-4 pick order still wins if Tide / File / Clock verbs are missing: ENC-TEACH-04 + ENC-HAZ-07 → ENC-WAVE-05 → ENC-BELL-01 or ENC-WIRE-01 or ENC-SLAM-01 → ENC-BRANCH-04.

Once those exist, implementers should pick:

1. ENC-TEACH-05 + ENC-SPELL-09 (flint / fuse verbs). `FSN-WICK-STEP` band 0 can ship in the same slice as ENC-WAVE-06.  
2. ENC-WAVE-06 (`formationId` WICK-STEP → RIME-RANK)  
3. ENC-WICK-01 or ENC-RIME-01 or ENC-COUP-01 (new pressure objects — painted fuse / enter-tax file / 25% execute)  
4. ENC-BRANCH-05 (`branch: wick|rime|smoke|plus` snapshot-before-cleanup)  
5. ENC-BOSS-05 branch read (live 19 fallbacks)  
6. Rush Table C (ENC-RUSH-15…18) one room at a time, only after the account has one full Table B clear. Hold C1/C3 if Wave-5 ids and `tauntCasterId` are missing.

Uniqueness: this file is the **fifth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
