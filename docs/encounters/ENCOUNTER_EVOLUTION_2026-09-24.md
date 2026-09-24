# Encounter Evolution Catalog — 2026-09-24

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-24-001`.  
Parent catalogs:

- [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-21.md`](./ENCOUNTER_EVOLUTION_2026-09-21.md) (`EED-2026-09-21-001`, open PR #347 — not yet on `main`)
- [`ENCOUNTER_EVOLUTION_2026-09-22.md`](./ENCOUNTER_EVOLUTION_2026-09-22.md) (`EED-2026-09-22-001`, open PR #396 — not yet on `main`)
- [`ENCOUNTER_EVOLUTION_2026-09-23.md`](./ENCOUNTER_EVOLUTION_2026-09-23.md) (`EED-2026-09-23-001`, open PR #479 — not yet on `main`)

**Do not reuse those IDs.** This file only adds new rooms. Do not rewrite prior catalogs.

Grounding: `origin/main` @ `0f5363f` plus sibling design — `docs/design/ENEMY_FORMATIONS_2026-09-23.md` (drop-6 `FSN-*`, open PR #459), `docs/ENEMY_AI_EVOLUTION.md`, `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md` (Wave-5 families packed here) and `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-23.md` (Wave-6 families **deferred** — no `FSN-*` minted for Oncoming / Pin / Glance / Gait Mute / File Vault / Span / Cadence / Cover / Lintel / Act Tax / Act Bell here), `docs/WORLD_DYNAMICS.md` wave 6 (`WF-*`, open PR #454), `docs/design/BOSS_AND_SPELL_DISCOVERY.md` Rush Table E (`E0`–`E3`, open PR #474). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50` (`gameConstants.ts` 9), `MAX_ENEMIES = 20` (10), `ENEMY_SUMMON_CAP = 2` (300), `ENEMY_SUMMON_COOLDOWN_TURNS = 2` (301), `AI_KAMIKAZE_MIN_TARGETS = 2` (271), 19 `BOSS_IDS` (`bossTypes.ts` 390–410), 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay (`challengeCompletion.ts` 11–20), atomic `applyRewards`. Family lottery still lives in `engine/spawnPolicy.ts` (`FAMILY_VARIANT_CHANCE` 35, `SPAWN_MIN_CHEBYSHEV = 4`).

---

## 1. Why a seventh day

Day-1 taught the **Ash / Ice skeleton**. Day-2 taught the **Void primer**. Day-3 taught the **Hex primer**. Day-4 taught the **Tide / File / Clock primer**. Day-5 taught the **Wick / Rime / Smoke / Plus primer**. Day-6 taught the **Ley / Fan / Pit / Font primer** and spent drop-5 packs `FSN-LEY-SIP`, `FSN-KICK-STING`, `FSN-FONT-IRON`, `FSN-PIT-RANK`, `FSN-TRADE-HOLE`, `FSN-SLIDE-BASH`, `FSN-LOCK-FAN`, `FSN-LEY-COURT`, `FSN-FONT-GATE`, `FSN-FAN-FILE`, `FSN-RECOIL-HUNT`, `FSN-GATE-COURT`, `FSN-LENS-BATTERY`, plus wave-5 world features (glass dump-tax, ratchet cog, second foot, sandbag, shift slab, keen edge, recall pin, pact gate, mirror host, drift sentinel, blood lock, oath cantor, open vein, thin air, first blood, crowd press). Rush variants exist for Table A rooms **0–9**, Table B `B0`–`B3` (`ENC-RUSH-11`…`14`), Table C `C0`–`C3` (`ENC-RUSH-15`…`18`), and Table D `D0`–`D3` (`ENC-RUSH-19`…`22`).

After those rooms exist, high-level play is still “the same shape.” Day-7 changes **the question** again by spending the **Gale / Twin / Pincer / Oblique / Ledger / Shove** verbs that already have drop-6 formation sheets and leftover **wave-6** world-feature knobs. The new question is not “spend current MP,” “hug a painted 90°,” or “the pit is walk-block / LoS-open.” It is **occupancy that is not a rank and not a clock**: a cone that *pushes* onto a hole, two allies swapping so the pet takes the file, two bodies completing a sandwich, a diagonal poke after the cardinal is pitted, leftover **AP** stolen while Ley still spends MP, a chaplain shoving a pet *away* while another pulls it *in*.

Gaps this file fills (still unused as scripted rooms):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-6 formations | `FSN-GALE-HOLE`, `FSN-TWIN-BROOD`, `FSN-PINCH-GOAD`, `FSN-BIAS-PIT`, `FSN-DRAW-CASH`, `FSN-LEDGER-LEY`, `FSN-CHECK-LEASH`, `FSN-GALE-PIT`, `FSN-TWIN-KENNEL`, `FSN-PINCER-GATE`, `FSN-SHOVE-SCHOOL`, `FSN-OBLIQUE-FILE`, `FSN-MORROW-SNARE`, `FSN-SATED-PLATE`, `FSN-BAIT-GATE`, `FSN-VERSE-PULPIT` are PDFs, not rooms |
| Leftover drop-5 / drop-4 sheets | `FSN-PUSH-SCHOOL`, `FSN-TRADE-TRAP`, `FSN-EVADE-GOAD` were named on day-6 as gated / peak converts only. `FSN-RIFT-KNOT` still has no dedicated beat. `FSN-TEMPO-CHOIR` / `FSN-FOG-FUSE` stay gated |
| World-feature wave 6 | `WF-HAZ-SOOT_LIP`, `WF-HAZ-TWIN_SPARK`, `WF-TRP-LEAVE_BELL`, `WF-TER-PYRE_STACK`, `WF-OBS-MERCY_PORT`, `WF-ZON-IRON_PULSE`, `WF-TEL-CARDINAL_KICK`, `WF-PRT-TWILIGHT_GATE`, `WF-INV-SPLIT_BANNER`, `WF-ELT-STILL_WATCH`, `WF-TRS-TRIP_CACHE`, `WF-SPL-HUSH_BEARER`, `WF-RSK-LAST_STAND`, `WF-MOD-TIGHT_GRIP`, `WF-EVT-SWIFT_MARCH`, `WF-ENV-EXPOSED_LINE` |
| Unused live modifiers | leftover `swift_winds` as an **opt-in rest shrine** only (kick/soot hop chrome — not a dungeon sponge). `null_field` was day-6 rest. Do not re-spend `titans_vigor` / `doka_fever` as HP sponges |
| Rush Table E | After one full Table D clear: `E0` `mill_seneschal`+`silent_conductor`, `E1` `counter_chaplain`+`ivory_palisade`, `E2` `wedge_prior`+`cinder_lance`, `E3` `levy_rector`+`fosse_warden`. New `roomIndex` namespace. Do **not** overwrite `BOSS_RUSH_ROOMS` 0–9, Table B `B0`–`B3`, Table C `C0`–`C3`, or Table D `D0`–`D3`, and do not collide `ENC-RUSH-01`…`22` |
| Wave-7 solo capstones | `mill_seneschal`, `counter_chaplain`, `wedge_prior`, `levy_rector` stay **out of `BOSS_IDS`** until kits ship; dungeon capstones below fall back to live 19 |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

`doka_fever` remains the **opt-in** sponge from ENC-TREAS-03. Day-6 treasure used Blood Lock / First Blood. Day-7 treasure uses `WF-TRS-TRIP_CACHE` and `WF-RSK-LAST_STAND` instead.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / split / watch rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `wedgeOrigin`, `pitCell`, `pushDir`, `twinPairId`, `pincerA` / `pincerB`, `biasDiag`, `sootCells`, `leaveBellCell`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise. Existing `ChallengeCondition` values only (`no_healing`, `under_15_turns`, `under_50_damage`, `no_healing_under_30_damage`, `under_10_turns`, `under_8_ap_per_turn`, `no_damage_taken`, `under_5_turns`, `direct_hit`).
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet. Coup stays a 25% HP% Strike gate on day-5 sheets; this drop does **not** pack Coup as a teacher.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Stationary posts: one pylon **or** turret **or** mercy font **or** bait **or** span-pylon, not two, in the same pack. Cap one span body.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer. Hush-bearer denies (`WF-SPL-HUSH_BEARER`) and loaner / echo-scribe / oath-cantor one-casts do **not** persist `spellLevel*` arrays.
- `inferArchetype` still treats any `healAmount > 0` as healer. Gale / sentry / pincer / oblique / pair / ledger / shove / origin / bait / morrow / surplus / sated / verse / misstep / bitter must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Twin Guard **is 0 damage**. Cross Flank’s sandwich bonus is occupancy, not a name.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- Dual Slow / Frost / tide melee / rime enter / Soul Sip MP tax: cap applied MP debuff at **−2**. Ledger Sip is **current leftover AP** steal (separate axis, no linger). Ley Toll spends **caster** current MP. One Slow source per pack. Do not also Root + Rank Lock + Slow on the same AP bar.
- `WF-PRT-LATCH_GATE`, `WF-PRT-WAGER_GATE`, `WF-PRT-PACT_GATE`, and `WF-PRT-TWILIGHT_GATE` are **forbidden** in dungeon, boss rush, and Death Realm. Rest / overworld only, and never the only portal.
- `applyPushback` / `applyAttract` exist in `occupancy.ts` but have **no spell caller**. Gale / Draw / Check rooms below ship a **fallback** until `effectCategory` callers exist — they do not fake Gale as Inferno, Draw as Slow, or Twin Guard as `spell-swap`.
- Gale Fan **does not ship** as a Chebyshev blob. Until `targeting.ts` reads `areaShape: "cone"` **and** `applyPushback` has a spell caller, ENC-GALE-01 / `FSN-GALE-HOLE` **reroll** to ENC-PIT-01 (`FSN-PIT-RANK`) rather than fake Gale with Fan Bolt.
- Twin Guard **does not ship** until two-ally swap apply exists. Until then ENC-TWIN-01 / `FSN-TWIN-BROOD` **reroll** to ENC-REINF-03 (`FSN-KENNEL-LITANY`) — do not fake with caster↔player Swap.
- Cross Flank’s +10 **does not ship** until two-ally Chebyshev-1 occupancy is counted. Band 0 PINCH is Strike-only (honest 8). Do not spawn the sandwich bonus as a name check.
- `Enemy.currentView` is **unread in combat**. Face Court / Oncoming / Glance / Facing Pin wait for a battle-walk facing writer. This catalog does **not** mint `FSN-*` for Wave-6 families.
- Do not pack `gale_deacon` with `fan_prelate` as a PAIR (two cones). `FSN-LOCK-FAN` stays axis-lock + hug-immune fan; `FSN-GALE-HOLE` is cone **push** + pit.
- Do not pack `twin_sentry` with `pawn_broker` / `rift_hook` as a PAIR (two swaps). `FSN-TRADE-HOLE` stays two **hostiles**; Twin Guard swaps two **allies**.
- Do not pack `pincer_acolyte` with `shadow_lurker` as a PAIR (two “stand in my facing / adjacency” assassins).
- Do not pack `ledger_siphon` with `soul_siphon` as a PAIR (two steals). `FSN-LEY-SIP` stays MP; `FSN-LEDGER-LEY` is leftover **AP** plus Ley.
- Do not pack `shove_chaplain` with `hook_chaplain` as a PAIR except `FSN-CHECK-LEASH` (the teaching contrast). Do not also add File Vault / Mist Step on that sheet.
- Exposed Line (`WF-ENV-EXPOSED_LINE`) **skips** if the generated map has no LoS-blocking wall so shelter cannot exist. Crowd Press (day-6) is occupancy clump; Isolation Chill (day-4) is Chebyshev warmth; this is **linear LoS to two bodies**.
- `FSN-TEMPO-CHOIR` still does **not** ship until ally `targetId` Tempo apply exists. `FSN-FOG-FUSE` still does **not** ship without a public wick tell under smoke. Wave-6 families (`oncoming_knight`, `pin_cantor`, `glance_ward`, `span_warder`, …) wait for a later formation drop — this catalog does not mint colliding `FSN-*` ids for them.

---

## 3. Dungeon pacing (Gale primer + inserts)

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

| Beat | Depth hint | Job | Day-7 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (start-of-turn soot, leave-bell, cone-push) | ENC-TEACH-07, ENC-SPELL-13, ENC-HAZ-13 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-08, ENC-AMBUSH-07 |
| Combine | 2–3 | Two taught verbs | ENC-GALE-01, ENC-TWIN-01, ENC-PINCH-01, ENC-BIAS-01, ENC-LEDGER-01 |
| Pressure | 3 | Clock, sandwich, pyre window, or exposed line | ENC-SURV-13, ENC-PROT-07, ENC-DRAW-01, ENC-CHECK-01, ENC-WATCH-01 |
| Choice / rest | mid | Heal vs risk vs four-way branch | ENC-REST-07, ENC-BRANCH-07, ENC-TREAS-07, ENC-LAST-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-12, ENC-ELITE-13, ENC-RARE-07, ENC-MAST-07, ENC-BAIT-01, ENC-VERSE-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-08, ENC-BOSS-07, ENC-RUSH-23…26 |

Day-1…day-6 chains remain valid. Day-7 **Gale primer** is the default for accounts that already cleared Ash, Ice, Void, Hex, Tide/File/Clock, Wick/Rime/Smoke/Plus, **and** Ley/Fan/Pit/Font once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-07

ENCOUNTER_ID: ENC-TEACH-07  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead. Wounded AI avoids **starting** a turn on soot (`ENEMY_HAZARD_AVOID_HP_PCT`).  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a start-of-turn occupancy lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. Four to six `WF-HAZ-SOOT_LIP` tiles on the **mid-band** (walk-through and ending a turn are **free**; **starting** a turn on soot costs 4% max HP). A clean-floor aisle of ≥ 1 tile exists. No lava/ice/spikes. No needle grass (that is ENC-HAZ-07). Player spawn on clean floor. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First **start-of-turn** on soot logs a teach line (“leave before your next start”). Do not also apply a pusher (that is ENC-GALE-01). Do not mix glass shards (that is ENC-TEACH-06, dump-tax on **forced** occupancy).  
OBJECTIVE: Defeat both. Optional: never start a turn on soot.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “camping the lip is the tax; cutting through is free.” Inverse of ENC-HAZ-07 (needle: **end** of turn). Prepares ENC-GALE-01 (a shove that *leaves you on soot at their turn*).  
SOLVABILITY_REQUIREMENTS: Clean aisle reaches both hostiles and the exit. Soot never walls a corridor. Soot not on spawn±3 or the portal. Counts toward `MAX_HAZARD_TILES`.  
REPLAYABILITY: Ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: replace the pawn with a `ROLE-WARDEN` rook that body-blocks the clean aisle (still no extra HP). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-13

ENCOUNTER_ID: ENC-HAZ-13  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× `tide_shade` bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may occupy an empty spark cell. Wounded pawns avoid both **landing** cells (`ENEMY_HAZARD_AVOID_HP_PCT`). Bishop kites from off-line floor.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: One `WF-HAZ-TWIN_SPARK` 4-tile line (two orbs occupy opposite cells and **swap** at each round start; landing costs 5% max HP). A path around the line exists. Exit behind the bishop. Distinct from ENC-HAZ-08’s orbit cinder (4-tile **square**, 1-tile step) and ENC-HAZ-11’s ratchet cog (two adjacent cells).  
SPECIAL_RULES: Scripted sparks only. Counts as 2 toward the hazard cap. Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Clear all. Intended line: stand on the two **empty** cells of the line.  
FAILURE_CONDITION: Player death (frost + spark land).  
REWARD: Standard. Overlay `under_50_damage` rewards standing in the hollow.  
TACTICAL_PURPOSE: Teach “the pair **swaps**, they do not orbit.” Distinct from a 1-tile hunt lantern and from a 4-tile clockwise cinder.  
SOLVABILITY_REQUIREMENTS: Path around the line; line never includes spawn or exit; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Line N-S vs E-W.  
SCALING_BEHAVIOUR: Mid: add leftover 2 soot tiles from ENC-TEACH-07 **off** the line (`inheritHazardsFrom: ENC-TEACH-07`). High: bishop gains `spell-slow`. Never a second spark pair.  
STATUS: PROPOSED

---

### ENC-HAZ-14

ENCOUNTER_ID: ENC-HAZ-14  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× pawn bait camping a `WF-TRP-LEAVE_BELL` + 1× bishop (`starter-frost`) holding the far third.  
AI_REQUIREMENTS: Bait pawn plays cowardly (retreats at 50% HP) — **leaving the bell** is the trap. Bishop does not walk onto the bell.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Winning without arming the bell can later hint `spell-root-snare` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: Arena. Visible bronze bell (step-on free; first **leave** pays 7% max HP once, then floor). Inverse of ENC-AMBUSH-02’s glyph plate (tax on **enter**). Bell never on spawn/portal. A path around exists.  
SPECIAL_RULES: Scripted bell only. Soft: shoving the bait off the bell still spends the leave (honest). Intent log: explicit `leaveBell: armed`.  
OBJECTIVE: Clear all. Optional: never arm the bell.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the bell was never armed (via `applyRewards`). Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the tax is **leaving**, not stepping on.” Prepares ENC-AMBUSH-07 (bait that *wants* you to chase it off the plate).  
SOLVABILITY_REQUIREMENTS: Bell reachable; path around; bait cannot spawn on the portal.  
REPLAYABILITY: Bell west vs east. High: inherit 2 soot tiles off the bell.  
SCALING_BEHAVIOUR: High: bishop also has slow. Peak: convert the bait to `FSN-PINCH-GOAD` lite (Herald on the bell) only after ENC-PINCH-01. Still one bell.  
STATUS: PROPOSED

---

### ENC-SPELL-13

ENCOUNTER_ID: ENC-SPELL-13  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× “deacon dummy” queen **without heal** that only telegraphs a **painted 90° wedge** (`wedgeCells[]`) and then Frosts — Gale Fan **only if** cone+push apply is live. 1× pawn on the wedge’s **push cell**. If cone+push is not live, the dummy Frosts and the **glyph** is the teacher (`discoverSpellId: spell-gale-fan`).  
AI_REQUIREMENTS: Dummy never Infernos. Pawn is generic and stands on the painted push cell so the first Gale (or the glyph) has a readable landing. Hug tiles (adjacent to dummy, off-wedge) are marked.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: `spell-gale-fan`. If already owned, glyph is `spell-open-pit` (the hole the shove wants). If both owned, convert to ENC-GALE-01.  
MAP_REQUIREMENTS: Open court, 3-tile wedge plus one side aisle. Painted hug cells. No lava dest. Reject `corridorMaze`.  
SPECIAL_RULES: Until `areaShape` is read **and** `applyPushback` has a caller, **do not** fake Gale with Fan Bolt — the glyph is the teacher and the dummy Frosts. Discovery does not auto-upgrade and does not auto-bar-insert (max 8).  
OBJECTIVE: Defeat hostiles; hugging the dummy (or stepping the glyph) is the intended lesson.  
FAILURE_CONDITION: Player death.  
REWARD: The spell id into the owned set + tiny Doka.  
TACTICAL_PURPOSE: Teach “the wedge **pushes**; hug and the back-diagonal are safe.” Distinct from ENC-SPELL-12 (Fan Bolt hug, **no** push) and ENC-PLUS-01 (plus-arm cross).  
SOLVABILITY_REQUIREMENTS: Hug cells reachable; push cell free floor with a walk-off that is **not** a pit (no pit on TEACH). Two walk-offs in the pocket.  
REPLAYABILITY: Wedge N vs E.  
SCALING_BEHAVIOUR: Does not scale; it retires when Gale Fan is owned (becomes ENC-GALE-01).  
STATUS: PROPOSED

---

### ENC-SPELL-14

ENCOUNTER_ID: ENC-SPELL-14  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× “sentry dummy” king **without heal** that only Frosts + 1× pawn partner. After the first Frost, a **twin glyph** appears on a side tile (`discoverSpellId: spell-twin-guard`). If Twin Guard apply is not live, the glyph is still the teacher — the dummy does **not** fake a Swap.  
AI_REQUIREMENTS: Dummy never Swaps the player. Pawn is generic. Dummy skips Twin Guard if fewer than 2 allied bodies exist.  
SPELL_DISCOVERY_OPPORTUNITIES: Primary: `spell-twin-guard`. If already owned, glyph is `summon-dire-wolf` (the second body). If both owned, convert to ENC-TWIN-01.  
MAP_REQUIREMENTS: Choke plus a backline pocket. Glyph not on the only walk column.  
SPECIAL_RULES: Until two-ally swap apply exists, dummy Frosts only. Do not call `swapPositions` as a fake Twin Guard (that is caster↔player). Discovery does not persist `spellLevel*`.  
OBJECTIVE: Clear. Optional: pick up the glyph and hold two allied bodies.  
FAILURE_CONDITION: Player death.  
REWARD: Discovery + standard.  
TACTICAL_PURPOSE: Teach “two **allies** swap; the caster stays.” Distinct from ENC-SPELL-03 (pads / player Swap) and ENC-TRADE-01 (two **hostiles**).  
SOLVABILITY_REQUIREMENTS: Pocket connected; glyph free floor, not a portal.  
REPLAYABILITY: Pocket N vs E.  
SCALING_BEHAVIOUR: After Twin Guard is owned, convert to ENC-TWIN-01 (exam).  
STATUS: PROPOSED

---

### ENC-WAVE-08

ENCOUNTER_ID: ENC-WAVE-08  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave A: `FSN-GALE-HOLE` (or `FSN-PIT-RANK` fallback). Wave B (when A is empty, portal still locked): `FSN-PINCH-GOAD` — 1× `ROLE-PINCER` + 1× `ROLE-GOAD`. Living + pending ≤ 4. Band 0 PINCH is Strike-only (no sandwich bonus until occupancy is counted).  
AI_REQUIREMENTS: Wave A: Deacon faces the wedge; Mason pits **one** melee approach, never both walk-offs. Wave B: Herald Goads if the id exists else Strikes; Acolyte completes Chebyshev-1. `groupTactics` off on TEACH/MID.  
SPELL_DISCOVERY_OPPORTUNITIES: Wave A may complete Gale Fan / Open Pit observation. Wave B may complete Goad if used.  
MAP_REQUIREMENTS: `openField` / `arena` with a **3-tile wedge plus one side aisle** **and** space to walk off a sandwich. Reject `corridorMaze`. Optional leftover soot from ENC-TEACH-07 **off** the Gale dest (`inheritHazardsFrom: ENC-TEACH-07`) — do not make the only push land on soot (that is ENC-GALE-01 peak). `waveSpawnCells` far from spawn.  
SPECIAL_RULES: Portal locked until wave B is clear. Next wave at the start of the enemy phase after the previous wave is dead. Occupied `waveSpawnCells` spill to nearest free reachable floor. If a wave cannot place any unit, skip and log — never soft-lock. Random 30% family lottery is **off**. If Gale cannot ship, wave A is `FSN-PIT-RANK` and the room still teaches “don’t stand where the next verb wants you.”  
OBJECTIVE: Survive and clear both waves.  
FAILURE_CONDITION: Player death.  
REWARD: Victory XP counts all defeated levels + depth Doka. Overlay `under_10_turns` is tight on purpose.  
TACTICAL_PURPOSE: Named drop-6 pairs as wave verbs — cone-push then sandwich — without a level ramp.  
SOLVABILITY_REQUIREMENTS: `waveSpawnCells` ⊆ reachable floor. Side aisle reaches the Deacon. Cap 4 living so later summons are not starved. Two walk-offs after every legal push dest.  
REPLAYABILITY: Wave B can swap to `FSN-TWIN-BROOD` if the player already answered PINCH this account.  
SCALING_BEHAVIOUR: High: wave B Acolyte is elite (`variant: elite`) still without Rear Cut. Peak: add wave C leftover 1 pawn, still cap 4. No extra HP.  
STATUS: PROPOSED

---

### ENC-AMBUSH-07

ENCOUNTER_ID: ENC-AMBUSH-07  
TYPE: ambush  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Visible bait: 1× pawn camping `WF-TRP-LEAVE_BELL`. Hidden until trigger: `FSN-PINCH-GOAD` lite — 1× Acolyte (`physical_attack`; Cross Flank at band 1 if occupancy is live) + 1× Herald (`spell-goad` if the id exists, else Strike).  
AI_REQUIREMENTS: Bait plays cowardly and **wants** to leave the bell (the leave tax is the tell). Ambushers occupy retreat tiles and prefer a player who chased. Herald Goads after the ambush fires.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Goad can later offer that id at rest if missing.  
MAP_REQUIREMENTS: Arena with a painted facing chevron off the bell. `ambushCells` behind a wall hook **or** `fog_of_war`. Trigger: bait **leaves** the bell **or** bait drops below 50% HP **or** the player crosses the midline.  
SPECIAL_RULES: Ambush units do not exist in the combatant store until trigger (portal locked because bait is alive). Soft: overkill on the bait still fires the ambush. Intent log: explicit `ambush: leave_bell`. Distinct from ENC-AMBUSH-02 (enter-plate) and ENC-AMBUSH-03 (lantern / MP hunt) and ENC-AMBUSH-06 (second-foot).  
OBJECTIVE: Defeat bait + ambushers.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bonus Doka if the player never armed the bell (stood still / killed at range). Credit through `applyRewards`.  
TACTICAL_PURPOSE: Punish chase; teach that **leaving** a visible plate can call a sandwich.  
SOLVABILITY_REQUIREMENTS: `ambushCells` reachable after spawn; path around the bell; bait cannot spawn on the portal. Space to walk off a sandwich.  
REPLAYABILITY: Hook left/right. Buffer omitted at low band (Acolyte only).  
SCALING_BEHAVIOUR: High: full `FSN-PINCH-GOAD`. Peak: inherit 2 soot tiles on the **chase lane**, not the only path.  
STATUS: PROPOSED

---

### ENC-REINF-07

ENCOUNTER_ID: ENC-REINF-07  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TWIN-BROOD` — 1× `ROLE-SENTRY` king (`spell-twin-guard` if apply is live; else Frost only) + 1× `brood_chanter` (`isSummoner`, `summon-dire-wolf` **or** `summon-archer`, not both). On each successful summon, no extra trash. If the Sentry is marked/exposed **after** a pet exists, a 1-pawn reinforcement spawns on `reinfCells` (cap 1 extra, hard-cap 4 living including summons). Summon cap 2. If Twin Guard apply is missing, **reroll this id** to ENC-REINF-03.  
AI_REQUIREMENTS: Chanter on cooldown 2; skip summon if cap or no free floor (`decideSummonerAction` already skips — do not invent frost fall-through). Sentry swaps only if the trade puts the pet onto a choke **or** the Chanter behind the pet; skip if the player wanted the pet in melee. Pawns screen. Enemies snipe player wisps (`ENEMY_THREAT_VALUES.wisp`). If the Chanter dies, living enemy summons despawn at end of turn (explicit).  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-twin-guard` / `summon-dire-wolf` if missing.  
MAP_REQUIREMENTS: Choke plus a backline pocket. No void on summon spawn cells. `reinfCells` adjacent to the Sentry, reachable floor. Reject a 1-tile closet.  
SPECIAL_RULES: Reinforcement trigger is `onSentryExposedAfterPet` (explicit), not on-death (that is ENC-REINF-02) and not on-summoner-exposed (ENC-REINF-03). If living + pending would exceed 4, skip further spawns. Portal locked until the board is empty. Random 30% lottery off.  
OBJECTIVE: Clear all. Implicit priority: Chanter if no pet; pet if it occupies the choke; Sentry if a second swap is coming.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + priority bonus if no pawn reinforcement ever spawned.  
TACTICAL_PURPOSE: Twin as a room — the pet is the second body that makes the swap legal. Distinct from ENC-REINF-03 (kennel, no swap) and ENC-TRADE-01 (hostile-hostile swap).  
SOLVABILITY_REQUIREMENTS: Backline reachable; summons spawn on free reachable floor only; `reinfCells` never on the portal.  
REPLAYABILITY: Wolf vs archer kit. `/GOLEM` (iron golem partner, no summon engine) if summon AI is not ready but Twin Guard is.  
SCALING_BEHAVIOUR: High: convert to `FSN-TWIN-KENNEL` (add Warden) after ENC-TWIN-01. Cap stays 2. Still one swap elite.  
STATUS: PROPOSED

---

### ENC-SURV-13

ENCOUNTER_ID: ENC-SURV-13  
TYPE: survival / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Start: 2× pawn + 1× `tide_shade` bishop. Every 3 enemy-team turns, spawn 1 from {pawn, knight lurker, `ROLE-PINCER`} until the clock ends. Max 4 living.  
AI_REQUIREMENTS: Casters hold LoS. Lurkers / pincers prefer the **next** soot cell so the player is punished for camping. Group tactics if soph ≥ 4.  
SPELL_DISCOVERY_OPPORTUNITIES: Survive 8 turns without `spell-timestep` → rest shrine may offer timestep (reminder, not a free grant).  
MAP_REQUIREMENTS: Arena. Safe core of 5 **clean** tiles. A 4-tile `WF-HAZ-SOOT_LIP` ribbon on one painted edge (start-of-turn tax). Optional `WF-ENV-EXPOSED_LINE` **off** unless a LoS-blocking wall exists (world-dynamics contract). Parallel floor path remains.  
SPECIAL_RULES: Clock `surviveTurns: 10` player-turns. When it hits 0, remnants flee to the edge and despawn (not player kills). Portal unlocks only after the board is empty. Soot never covers the core, spawn, or exit. Skip Exposed Line on maps with no wall.  
OBJECTIVE: Be alive after 10 player turns, then clear or let remnants flee.  
FAILURE_CONDITION: Player death before clock + cleanup.  
REWARD: Survival table (depth × 50 Doka + 100 XP) plus kill XP only for units actually defeated. Prefer overlay `no_healing` over `no_damage_taken`.  
TACTICAL_PURPOSE: Pressure beat — a **start-of-turn** tax ribbon, not shrinking void (ENC-SURV-03), not creeping ash (ENC-SURV-05), not crowd-press clump (ENC-SURV-12).  
SOLVABILITY_REQUIREMENTS: Core always reachable; flee-edge tiles exist; hazard count ≤ 50; never convert the exit cell to soot.  
REPLAYABILITY: Ribbon N vs E. Opener caster tide-shade vs bone_scribe.  
SCALING_BEHAVIOUR: Mid uses only pawns in the pool. High unlocks the lurker. Peak unlocks the pincer. Never shorten the clock below 8.  
STATUS: PROPOSED

---

### ENC-SURV-14

ENCOUNTER_ID: ENC-SURV-14  
TYPE: survival / optional challenge / hazard  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Clock 8. Wave A: `FSN-GALE-HOLE` Deacon only (no Mason — the clock is the pit). Wave B overlaps at turn 3: `FSN-PINCH-GOAD` Herald (no Acolyte). Wave C at turn 6: one elite golem. Overlap allowed; hard-cap 4 living.  
AI_REQUIREMENTS: Full gates except instantKill / betrayal. Deacon holds ≥ 3. Golem camps the last clean, non-spark tile.  
SPELL_DISCOVERY_OPPORTUNITIES: Hold to last turn without Timestep → shrine reminder only.  
MAP_REQUIREMENTS: Arena + `WF-HAZ-TWIN_SPARK` line + optional `WF-MOD-TIGHT_GRIP` (0-MP spells cost 1 MP this map). Skip Tight Grip on TEACH accounts that have not seen ENC-SPELL-11 (Thin Air was AP; this is MP on formerly-free casts). Never both Tight Grip and Thin Air. Never `titans_vigor`.  
SPECIAL_RULES: Overlap + spark-swap + optional free-spell tax is the escalation vs ENC-SURV-13. Flee remnants when the clock ends. If Gale cannot ship, wave A is a Frost bishop.  
OBJECTIVE: Survive the clock, then clean or let flee.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-13. Overlay `no_healing`.  
TACTICAL_PURPOSE: Peak pressure that spends leftover wave-6 modifiers (`tight_grip`) and twin sparks so late-game maps are not “soot again” or “glass again.”  
SOLVABILITY_REQUIREMENTS: Shelter / empty spark cells exist; 4-unit occupancy leaves a walkable ring; sparks never seal spawn or exit.  
REPLAYABILITY: Tight Grip on/off. Wave C golem vs void-mirror elite for Void-mixed accounts.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-GALE-01

ENCOUNTER_ID: ENC-GALE-01  
TYPE: hazard / displacement / elite-adjacent  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GALE-HOLE` — `ROLE-GALE` queen (`spell-gale-fan` + Frost; **no** healAmount) + `ROLE-PIT` rook (`spell-open-pit`; **0 HP paint**, walk-block, LoS open). If cone+push apply is not live, **reroll this id** to ENC-PIT-01.  
AI_REQUIREMENTS: Mason pits **one** melee approach in the wedge’s push ring, never both walk-offs, never the only tile that reaches the Deacon. Deacon Gales only if two player-side bodies sit in the 90° **and** at least one push cell is free or a hazard; hug = immune; VETERAN skip if every push cell is blocked. Soph 1–2. Never turn-1 Gale onto a full-HP player whose only landing is the pit if they started outside the wedge.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing a legal Gale **or** an Open Pit can drop `spell-gale-fan` or `spell-open-pit`.  
MAP_REQUIREMENTS: `arena` or `openField` with a **3-tile wedge plus one side aisle**. Reject `corridorMaze`. No lava dest. Optional leftover soot from ENC-TEACH-07 on a **flank** push cell, never on both landings.  
SPECIAL_RULES: At most one live pit. Push dest must leave a walk-off **that is not the pit**. Time Warp **banned**. Random 30% lottery off.  
OBJECTIVE: Clear all. Intended line: hug the Deacon or occupy the pit (you stay; they cannot push you in).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + displacement / pit discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Cone that **moves** a body onto a hole. Distinct from ENC-FAN-01 (hug-immune fan, no push) and ENC-PIT-01 (pit + lancer, no cone). Prepares `FSN-GALE-PIT`.  
SOLVABILITY_REQUIREMENTS: Walk-off after every legal push dest. Pit not on spawn/portal. Hostiles start ≥ Chebyshev 4. 2-unit occupancy leaves an exit.  
REPLAYABILITY: `/FROST` rerolls the id rather than faking Gale. `/E-GALE` elite Deacon, still one live pit.  
SCALING_BEHAVIOUR: Unlock real Gale only after apply exists. Peak: convert to `FSN-GALE-PIT` (add Fuse) if the chain already taught wick (ENC-WICK-01). Still one Inferno **off**. Still two walk-offs.  
STATUS: PROPOSED

---

### ENC-TWIN-01

ENCOUNTER_ID: ENC-TWIN-01  
TYPE: priority-target / anti-summon  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-TWIN-BROOD` — `ROLE-SENTRY` + `brood_chanter`. If Twin Guard apply is missing, **reroll** to ENC-REINF-03.  
AI_REQUIREMENTS: Same contracts as ENC-REINF-07 without the extra pawn horn. Sentry high init. Chanter fall-through to Frost if no free floor. Soph 1–2.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-twin-guard` / wolf.  
MAP_REQUIREMENTS: Choke plus backline pocket. Weight 0 until a summon placement cell exists that is unoccupied.  
SPECIAL_RULES: Cap one summon engine. No Pawn Broker, no Rift Hook, no Bait / Pylon / Font on this PAIR. `inferArchetype` must not see heal on the Sentry.  
OBJECTIVE: Clear. Intended: kill the pet (0 extra XP) or burst the glass Sentry before the second swap.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + twin discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Anti-swap exam. Distinct from ENC-TRADE-01 (they swap **your** two hostiles) — here **their** two allies swap so the wolf takes the file you lined up.  
SOLVABILITY_REQUIREMENTS: Pocket connected; pet spawn free reachable floor; Sentry not trapped.  
REPLAYABILITY: `/GOLEM` vs `/E-SWAP`.  
SCALING_BEHAVIOUR: High: convert to `FSN-TWIN-KENNEL` (add Warden occupy). Peak: still one Sentry elite. Cap 2.  
STATUS: PROPOSED

---

### ENC-PINCH-01

ENCOUNTER_ID: ENC-PINCH-01  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-PINCH-GOAD` — `ROLE-PINCER` knight + `ROLE-GOAD` pawn/knight. Band 0: Strike only (honest 8). Band 1: Cross Flank + Goad. Elite tag on the Acolyte only.  
AI_REQUIREMENTS: Herald walks adjacent and Goads if the player has a damaging id ready. Acolyte paths to complete Chebyshev-1, then Crosses; if the player already walked to Chebyshev 2 from the Herald, Acolyte Strikes rather than waiting forever. Never turn-1 surround (`SPAWN_MIN_CHEBYSHEV = 4`). Soph 1–2. Skip sandwich bonus until occupancy is counted.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-goad` / sibling `spell-cross-flank` if that catalog lands.  
MAP_REQUIREMENTS: `openField` or `arena`. Needs space to walk off a sandwich. Reject a 1-tile tunnel.  
SPECIAL_RULES: Unlock after ENC-LEASH-01 / ENC-RUSH-18 **or** any Goad sheet so the player has seen “must swing at this body.” No Shadow Lurker. No Surplus Ward on PAIR. Random 30% lottery off. Only one elite.  
OBJECTIVE: Defeat both. Intended line: walk to Chebyshev 2 from one body, or cheap-Strike the Herald (satisfies taunt) then leave.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier on the Acolyte only + standard Herald XP. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Occupancy sandwich + taunt. Distinct from ENC-ELITE-11 (recoil + sting + evade) and ENC-PACK-PINCER (wolf + lurker + tank).  
SOLVABILITY_REQUIREMENTS: Walk-off tiles exist. Hostiles start ≥ 4 from the player and from each other. Never CHAMPION in a solo leftover after one death — demote Cross to Strike.  
REPLAYABILITY: Herald pawn vs knight.  
SCALING_BEHAVIOUR: Promote `FSN-PINCER-GATE` (add Warden occupy) before any HP bump. Peak: Acolyte may hold Cross after occupancy is live — still no Rear Cut.  
STATUS: PROPOSED

---

### ENC-BIAS-01

ENCOUNTER_ID: ENC-BIAS-01  
TYPE: hazard / priority-target  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-BIAS-PIT` — `ROLE-OBLIQUE` bishop (`spell-bias-ray`, `diagonal: true`, Frost on rank/file) + `ROLE-PIT` rook (one cardinal approach).  
AI_REQUIREMENTS: Ray only if `|dx| === |dy|` and Chebyshev ≥ 2; refuse rank/file (Frost). Mason pits a **cardinal** approach so the diagonal is the remaining gun lane. Never pit both exits. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-bias-ray` / `spell-open-pit`. Until diagonal metadata is read, **reroll this id** to ENC-PIT-01 rather than firing Bias as a Chebyshev blob.  
MAP_REQUIREMENTS: `openField` with **one painted diagonal** of ≥ 3 tiles plus a cardinal aisle the pit can close. Reject a map with no legal diagonal.  
SPECIAL_RULES: Random 30% lottery off. No second pit. No Gale on this PAIR (that is ENC-GALE-01). Time Warp banned.  
OBJECTIVE: Clear. Intended: walk the remaining cardinal (around the pit) or hug off-diagonal.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + bias discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: “I’ll just walk the file” is the wrong answer after ENC-PIT-01 — the Ray owns the diagonal. Distinct from ENC-TEACH-04 (lancer **file**) and ENC-FAN-01 (90° hug).  
SOLVABILITY_REQUIREMENTS: A cardinal detour exists with the pit treated as a walk-block. Diagonal not the only path to the Cantor.  
REPLAYABILITY: Diagonal NE vs NW.  
SCALING_BEHAVIOUR: High: convert to `FSN-OBLIQUE-FILE` (add Rank Lock) only after ENC-LOCK-01. Do not also add a second pit.  
STATUS: PROPOSED

---

### ENC-LEDGER-01

ENCOUNTER_ID: ENC-LEDGER-01  
TYPE: priority-target / resource  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LEDGER-LEY` — `ROLE-LEDGER` bishop (`spell-ap-sip`, **0 HP**, leftover **AP** steal) + `ROLE-LEY` bishop (`starter-frost`; Ley Toll **only if** MP debit exists). No healer, no Slow, no Inferno. If Ley Toll cannot debit MP, the Ley body Frosts only — do **not** fake prime with Enrage. If AP-sip apply is missing, **reroll** to ENC-LEY-01.  
AI_REQUIREMENTS: Ledger skips if target leftover AP is 0. Ley spends caster current MP to prime, then Frosts. One Slow source (none). Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-ap-sip` / `spell-ley-toll`.  
MAP_REQUIREMENTS: `openField` / `arena`. Reject `corridorMaze`. Optional leftover soot **off** the only approach. No ice sheet on both approaches (ice + steal + prime is three resource stories). Time Warp **banned**.  
SPECIAL_RULES: Random 30% lottery off. Do not pack a second steal (`soul_siphon`). Dual MP tax still caps at −2; AP-sip is a **different axis**.  
OBJECTIVE: Clear. Intended: dump leftover AP before Ledger init, dump walk before Toll.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + resource discovery. Overlay `under_8_ap_per_turn` (the leftover **is** the lesson).  
TACTICAL_PURPOSE: Two bodies, two resources. Distinct from ENC-LEY-01 (MP only) and ENC-SPELL-11 (Thin Air AP 1→2 on cheap spells).  
SOLVABILITY_REQUIREMENTS: Both bishops reachable; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Ledger north vs east. `/STING` (add Far Stinger) only after ENC-RECOIL-01, still no Hex Toll, still one Slow (none).  
SCALING_BEHAVIOUR: High: elite Ledger only. Peak: still two bodies unless converting to a named BRIGADE that already exists. Never two steal elites.  
STATUS: PROPOSED

---

### ENC-DRAW-01

ENCOUNTER_ID: ENC-DRAW-01  
TYPE: displacement / hazard  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-DRAW-CASH` — `ROLE-PAIR` bishop (`spell-draw-together`, **0 HP attract**) + `ROLE-IGNITE` queen **without heal** (`spell-ignite-stacks` if DoT consume exists; else Frost + `starter-poison` only).  
AI_REQUIREMENTS: Pair skips if only one player-side body; skips if already adjacent and that is safer. Ignite cashes stacks; never Inferno. If attract apply is missing, Pair Frosts and the room still teaches **clump** via a 2-tile `WF-TRP-PRESSURE_MOSAIC` (two bodies on mosaic = tax) — do not fake Draw with Slow. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-draw-together` / `spell-ignite-stacks`.  
MAP_REQUIREMENTS: `arena` with two pillars. Attract dest: free floor, not lava / pit / portal, player keeps ≥ 1 escape tile. Optional mosaic as fallback teacher.  
SPECIAL_RULES: Do not pack Draw with Hook Line / Sinkhole as PAIR (three attracts). No Glass Realm on stacked-DoT.  
OBJECTIVE: Clear. Intended: isolate so Draw fizzles, then the alchemist is a poison bishop.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + clump discovery. Overlay `no_healing` (DoT is the tax).  
TACTICAL_PURPOSE: They clump your bodies; the cash is why standing together is expensive. Distinct from ENC-TRADE-01 (swap two hostiles) and ENC-FUSE-01 (pull onto martyr).  
SOLVABILITY_REQUIREMENTS: Attract dest legal; isolation tiles exist; 2-unit occupancy leaves walk-offs.  
REPLAYABILITY: Axis H vs V.  
SCALING_BEHAVIOUR: Unlock real Draw only after apply exists. Peak: add a third rat applicator only if ENC-HAZ-06 was answered — still one Ignite, still no Inferno.  
STATUS: PROPOSED

---

### ENC-CHECK-01

ENCOUNTER_ID: ENC-CHECK-01  
TYPE: protection objective / displacement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-CHECK-LEASH` — `ROLE-SHOVE` rook (`spell-body-check`, **0 damage** ally **away**) + `ROLE-CHAPLAIN` rook (`spell-leash-hook`, ally **to caster**). One player-side summon on the field is the **payload** (if the player brought no pet, spawn a 1-HP allied token `protectTargetId` that is not a summon cap occupant — stationary, like ENC-PROT-02’s shrine, HP low).  
AI_REQUIREMENTS: Shove dest-check (pit / lava / void / occupied → skip); skip if no ally in range 2. Chaplain pulls ally adjacent; Root blocks the pull. They do **not** heal. Soph 2–3. Until shove/pull callers exist, both Frost and the **token** is the teacher (`objectiveCell`).  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-body-check` / `spell-leash-hook`.  
MAP_REQUIREMENTS: Two-depth backline + a painted token cell. No pit on both landings.  
SPECIAL_RULES: Teaching contrast: **away** vs **to caster**. Do not also add File Vault / Mist Step / Twin Guard on this sheet. Portal unlocks when hostiles are dead **and** the token (if any) is alive. Token is not a summon.  
OBJECTIVE: Token alive (or player-summon alive) and hostiles dead.  
FAILURE_CONDITION: Token HP ≤ 0 **or** player death. If the player brought their own summon, token is omitted and failure is player death only (the pet dying is the intended punish, not a room fail).  
REWARD: Protection-adjacent grant + kill XP. Overlay `direct_hit` if a token exists.  
TACTICAL_PURPOSE: The pet is the payload, not a new sprite. Distinct from ENC-PROT-01 (walking ward) and ENC-RESCUE-LINE (pull the **gun** off melee).  
SOLVABILITY_REQUIREMENTS: Token not on spawn/portal. Shove dest walk-off. 2-unit occupancy leaves an exit.  
REPLAYABILITY: Token N vs E. High: convert to `FSN-SHOVE-SCHOOL` (add Stride) only after ENC-MOVE-11.  
SCALING_BEHAVIOUR: Add a third screen pawn before any HP bump. Still one shove elite.  
STATUS: PROPOSED

---

### ENC-PROT-07

ENCOUNTER_ID: ENC-PROT-07  
TYPE: protection objective  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× charger pawn + 1× bishop focusing the **iron pulse**.  
AI_REQUIREMENTS: All enemies prefer occupying `WF-ZON-IRON_PULSE` (`objectiveCell` / `protectTargetId` override) so they gain −15% incoming (post-formula). Lethal lookahead against a player standing on the pulse. They do not retreat from the tile. Distinct from ENC-PROT-03 (Ward Circle is **RES**).  
SPELL_DISCOVERY_OPPORTUNITIES: If the player held the pulse for ≥ 4 player-turns and used `starter-shield` or `summon-sentinel`, rest may offer `summon-sentinel` if missing.  
MAP_REQUIREMENTS: Central iron inlay (`WF-ZON-IRON_PULSE`, one walkable cell). Player spawns adjacent. Enemies from the far end + one side alley. No hazard on the pulse.  
SPECIAL_RULES: The pulse is a tile, not an allied token. Portal unlocks when hostiles are dead. The player does **not** fail if they never stand on it — holding it is the intended line. Optional fail-if-enemy-held-4-turns is **off** (that clones ENC-HOLD-01). Null Field does not strip the pulse (not a buff spell).  
OBJECTIVE: Clear hostiles. Intended: occupy the pulse so melee hits you through the −15%, or pull the fight off it and deny the bishop the tile.  
FAILURE_CONDITION: Player death only.  
REWARD: Protection-adjacent grant (band table) + kill XP. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Contest a **post-formula mitigation tile**, not RES (ENC-PROT-03) and not an escort HP pool (ENC-PROT-01/02).  
SOLVABILITY_REQUIREMENTS: Alley does not spawn on the pulse. Pulse not on spawn±3 or portal. If any hazard exists, it is not adjacent to the pulse.  
REPLAYABILITY: Alley left/right. Bishop frost vs weaken.  
SCALING_BEHAVIOUR: Add a second alley flanker before raising ATK. Peak: `mending_mist` on so whoever holds the pulse also regen-races (still not a fail if you refuse the tile).  
STATUS: PROPOSED

---

### ENC-PRIO-09

ENCOUNTER_ID: ENC-PRIO-09  
TYPE: priority-target / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SATED-PLATE` lite — `ROLE-SATED` knight (`physical_attack`; `spell-sated-fang` only while HP% ≥ 70; refuse under 70) + `ROLE-PLATE` rook (`spell-ward-plate` if absorb exists; else `spell-iron-skin`) + optional junior cantor (`starter-shield` ally, **no** Inferno, **no** `starter-heal` if that would steal healer inference from a buffer you still need).  
AI_REQUIREMENTS: Sated charges while ≥ 70%; below 70% it Shields / Strikes only (the lesson is “chip it off the fang window”). Plate replace-don’t-stack. Cantor self-heals at 50% only if it is a true healer body — prefer Shield-bot to keep `inferArchetype` honest. Soph 4–6. `groupTactics` on.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-sated-fang` / `spell-ward-plate`.  
MAP_REQUIREMENTS: Chapel nave + two stalls. Side aisle required. No lava. Optional `mending_mist` **off** (would hide the 70% window).  
SPECIAL_RULES: Unlock after ENC-ELITE-04 **or** ENC-PINCH-01 so the player has seen a windowed melee. At most one Sated. Leader boost from CADRE — the player can cut the Sated first.  
OBJECTIVE: Clear all. Intended order: chip Sated below 70%, then ignore Fang, delete Plate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + “break the fang” Doka if Sated dropped below 70% before dealing a Fang hit.  
TACTICAL_PURPOSE: High-HP% physical is a **window**, not a sponge. Prepares Table E’s Levy (don’t eat the tax on the committed poke) without a dual-boss.  
SOLVABILITY_REQUIREMENTS: Stalls connected; Plate cannot seal the nave; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Plate live `iron_golem` vs `plate_warden`.  
SCALING_BEHAVIOUR: Peak: full `FSN-SATED-PLATE` CADRE. Still one Sated. Do not also grant Surplus Ward (two evades / windows).  
STATUS: PROPOSED

---

### ENC-MOVE-12

ENCOUNTER_ID: ENC-MOVE-12  
TYPE: movement objective / timing  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× kiting bishop (`starter-frost`) on the **short** path behind a `WF-OBS-MERCY_PORT` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds the short path and does not walk through the port while it is a wall. Pawn is a charger on the long path.  
SPELL_DISCOVERY_OPPORTUNITIES: Reaching the far banner **during** the one-round open window can offer `spell-haste`. Missing the window and walking the long path can offer `starter-shield` (patience). One per character, not both.  
MAP_REQUIREMENTS: Dual route. Short corridor has `WF-OBS-MERCY_PORT` (wall → floor for **one** round after first round-start → wall for the rest; painted shut→open→shut). Long route already exists (placement contract: never the only exit; evaluate solvability as if the port were already a wall). Far `objectiveCell` banner. Exit locked until the player occupies the banner **and** hostiles are dead.  
SPECIAL_RULES: Port is a wall except during the single open round. Distinct from ENC-MOVE-04 (Fallen Gate waits **two** rounds then stays floor) and ENC-MOVE-05 (Tide Door odd/even forever). Enemies may wait. `holdPortalLocked` until cleanup.  
OBJECTIVE: Touch the banner and clear hostiles.  
FAILURE_CONDITION: Player death only.  
REWARD: Standard + path bonus Doka if the player never stood adjacent to the port while it was a wall (committed to a line).  
TACTICAL_PURPOSE: Teach “one window, then gone.” Distinct from wait-2 and from odd/even sluice.  
SOLVABILITY_REQUIREMENTS: Long path reachable from spawn to banner **without** the port. Port is not a cut-vertex. Banner not on a portal.  
REPLAYABILITY: Port north vs east. High: bishop also has slow.  
SCALING_BEHAVIOUR: Peak: one `WF-TEL-CARDINAL_KICK` on the long path (1 MP two-tile skip if both cells empty) as ENC-MOVE-13.  
STATUS: PROPOSED

---

### ENC-MOVE-13

ENCOUNTER_ID: ENC-MOVE-13  
TYPE: movement objective / hazard  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 2× kiting `tide_shade` bishops (`starter-frost` + `spell-slow` at band 1). 0 melee on entry.  
AI_REQUIREMENTS: Bishops hold the far third. They do not use the boot.  
SPELL_DISCOVERY_OPPORTUNITIES: Using `WF-TEL-CARDINAL_KICK` at least once and winning can offer `spell-haste` if missing (the boot is the teacher). Distinct from ENC-MOVE-05’s Slipstream (one-way pad swap).  
MAP_REQUIREMENTS: Always-open long path. One `WF-TEL-CARDINAL_KICK` boot: 1 MP kicks **two** tiles in current facing if both cells are empty floor; otherwise spend nothing. Far banner `objectiveCell`. Optional leftover soot on a **wrong facing** dump, never on both kick cells.  
SPECIAL_RULES: Player must occupy the banner at least once (`touchedObjective`). Kick dests must be free, non-hazard, non-portal, with two walk-offs. No swap (distinct from Mirror Step). Not a teleport spell — do not key off `effectCategory`.  
OBJECTIVE: Tag the banner and clear the bishops.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine facing + two-tile skip so MP is a third option (wait / walk long / kick). Distinct from Crosswind (forced extra slide after a paid step).  
SOLVABILITY_REQUIREMENTS: Long path works with the boot unused. Boot on floor, not spawn/portals. Bishops reachable by frost from the banner.  
REPLAYABILITY: Boot facing N vs E.  
SCALING_BEHAVIOUR: Add a third bishop or poison, not a second boot. Peak: B sits adjacent to a Twin Spark landing (choice of pain on swap).  
STATUS: PROPOSED

---

### ENC-PYRE-01

ENCOUNTER_ID: ENC-PYRE-01  
TYPE: hazard / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× bishop behind a `WF-TER-PYRE_STACK` + 1× pawn on the long path.  
AI_REQUIREMENTS: Bishop holds LoS behind the pyre (wall until lit). Pawn chargers the long path. They may light the pyre if adjacent and the cell is worth 1 AP.  
SPELL_DISCOVERY_OPPORTUNITIES: Lighting the pyre, stepping off before the blast, and winning can offer `spell-inferno` if missing (the pyre is the teacher — delayed occupancy, not a kit Inferno).  
MAP_REQUIREMENTS: Pyre is a cut-cover, **not** a cut-vertex (skip if solvability would fail with it intact). Long path exists. Blast ring = the cell + adjacent at next round start (5% max HP once).  
SPECIAL_RULES: Adjacent 1 AP lights: cell becomes floor immediately; blast at next round start. Distinct from ENC-HAZ-04’s crumble pillar (2 AP, no blast) and ENC-WICK-01 (painted fuse occupancy).  
OBJECTIVE: Clear all. Lighting is optional.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + blast-discipline bonus if the player lit and was not in the ring at tock.  
TACTICAL_PURPOSE: Spend 1 AP to open LoS and accept a readable blast, or walk long.  
SOLVABILITY_REQUIREMENTS: Long path works with the pyre treated as a wall. Pyre not on spawn/portal.  
REPLAYABILITY: Pyre N vs E.  
SCALING_BEHAVIOUR: High: bishop also has frost-nova **only if** a tile outside radius 2 exists. Never a second pyre.  
STATUS: PROPOSED

---

### ENC-WATCH-01

ENCOUNTER_ID: ENC-WATCH-01  
TYPE: elite / optional challenge  
RELATIVE_DIFFICULTY: HIGH (opt-in in exploration; required in a run)  
ENEMY_COMPOSITION: 1× `WF-ELT-STILL_WATCH` elite rook (`spell-iron-skin` + Strike) with a painted 3-tile facing cone. In exploration a path around the cone exists. In dungeon / boss rush they count as a hostile for map-clear.  
AI_REQUIREMENTS: Stationary until the player enters the cone or touches them. Then charger / chokepointCamp. The cone is **not** a wall.  
SPELL_DISCOVERY_OPPORTUNITIES: Victory can drop `spell-iron-skin` if missing. Sibling `spell-gale-fan` reminder if the account already learned ENC-SPELL-13 (cone literacy).  
MAP_REQUIREMENTS: Post + cone are floor. Exit reachable without entering the cone. Post never a portal, never spawn±3. Place only when a walk-around exists.  
SPECIAL_RULES: Exploration: circle the cone, or step in for the hard purse. Dungeon-chain: must fight. Portal locked while the Watch lives in a run. Distinct from ENC-TOLL-01 (pay 10% or long path) and ENC-CART-01 (moving intercept).  
OBJECTIVE: In a run: defeat the Watch. In exploration: pass by fight or walk-around.  
FAILURE_CONDITION: Player death after committing to the fight. Walk-around is success-with-less.  
REWARD: Hard-band Doka on a fight win. Walk-around: 0 extra.  
TACTICAL_PURPOSE: “The cone is the trigger, not a wall.” Same literacy as Gale hug, different object.  
SOLVABILITY_REQUIREMENTS: Walk-around works with the Watch treated as a hostile you can refuse in exploration. Watch not on the only portal.  
REPLAYABILITY: Cone N vs E. High: Watch is `FSN-GALE-HOLE` Deacon (sniper sits behind) — still one elite tag, still one cone.  
SCALING_BEHAVIOUR: Peak: still one elite. Do not add a second Watch (that is ENC-SPLIT-01).  
STATUS: PROPOSED

---

### ENC-SPLIT-01

ENCOUNTER_ID: ENC-SPLIT-01  
TYPE: elite / optional challenge / duel  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-SPLIT_BANNER` as a **scripted dungeon room** — 2× same-band elites on opposite painted posts: one `FSN-GALE-HOLE` Deacon elite + one `FSN-PINCH-GOAD` Acolyte elite. They do **not** world-attrition inside a run. Touching one starts combat with **only that elite** in exploration; in a dungeon-chain both count as hostiles for map-clear (must fight both, but **sequentially** if the implementer can isolate — otherwise both on the board, cap 2, 0 trash). Distinct from ENC-DUEL-01 (both on one ring, rage-on-death) and from Phalanx Line (all at once).  
AI_REQUIREMENTS: Deacon kite/push; Acolyte complete sandwich. They do **not** heal each other. If one dies, the survivor does **not** Enrage (that is ENC-DUEL-01 / ENC-RUSH-10).  
SPELL_DISCOVERY_OPPORTUNITIES: Winner-of-two can drop Gale Fan or Goad, whichever the last living elite used.  
MAP_REQUIREMENTS: Two distant posts, exit reachable without touching either in exploration. Posts not on spawn/portal. Counts as 2 toward `MAX_ENEMIES`.  
SPECIAL_RULES: In a run, both required. Cap 2 living elites + 0 trash. Portal locked until both are dead. Do not pack a third elite.  
OBJECTIVE: Defeat both elites.  
FAILURE_CONDITION: Player death.  
REWARD: Hard-band depth Doka + elite XP on both. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Two different taught elites, **sequential** posts — pick the order. Pressure beat that is not a clock and not a rage-on-death.  
SOLVABILITY_REQUIREMENTS: Both posts floor; elites start ≥ Chebyshev 4 from the player and from each other; walk-offs exist.  
REPLAYABILITY: Gale/Pincer vs Twin/Bias pair for accounts that already finished Gale this week.  
SCALING_BEHAVIOUR: Do not add a third elite. Peak: survivor gains one Iron Skin cycle, not HP.  
STATUS: PROPOSED

---

### ENC-ELITE-12

ENCOUNTER_ID: ENC-ELITE-12  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-GALE-PIT/E-GALE` — elite Deacon + junior Mason + junior Fuse Binder. Elite is not a boss: no phase table, no `BossAbility`. One live fuse, one live pit, never both walk-offs. Inferno **off**.  
AI_REQUIREMENTS: BRIGADE contracts. `groupTactics` on. Deacon waits one turn if Pit / Fuse will hold the landing (ELITE). Binder fuses a choke, never the tile under a full-HP player on turn 1 if they can still walk around. Soph 3–4. Until Gale ships, **do not** ship this id — fall back to ENC-ELITE-08 (wick) or ENC-GALE-01.  
SPELL_DISCOVERY_OPPORTUNITIES: Binder death after it used fuse-tile can drop that id (once per character).  
MAP_REQUIREMENTS: `arena` or `asymmetric` with pillars / a wall 2 tiles from typical stand, plus **two** walk-offs. Reject `corridorMaze`. No lava dest. No Void Rift as a legal landing.  
SPECIAL_RULES: Random 30% lottery off. Only one elite. Do not inflate elite HP beyond band queen + one Gale cycle. `/MISSTEP` variant: replace Fuse with Misstep Herald — **do not** also add Rank Lock (two walk rewrites).  
OBJECTIVE: Defeat the elite. Supports optional but intended.  
FAILURE_CONDITION: Player death.  
REWARD: 2× victory XP for the elite only + depth Doka. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of “hug, or step off the wick onto a floor that is not the pit.” Consumes a real drop-6 BRIGADE.  
SOLVABILITY_REQUIREMENTS: Two walk-offs. Hostiles start ≥ Chebyshev 4. Fuse / pit never both exits.  
REPLAYABILITY: `/MISSTEP` vs `/E-GALE`.  
SCALING_BEHAVIOUR: Add Fuse uptime before any HP bump. Peak: still one Deacon elite.  
STATUS: PROPOSED

---

### ENC-ELITE-13

ENCOUNTER_ID: ENC-ELITE-13  
TYPE: elite / formation  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Named pack `FSN-TWIN-KENNEL` with elite tag on the Sentry only — elite Sentry + junior Chanter + junior Warden.  
AI_REQUIREMENTS: Warden occupies (`AI_BACKLINE_GUARD_DISTANCE` 1). Sentry swaps pet into the choke. Chanter skip-lock must fall through. Soph 3–4. Until Twin Guard ships, **do not** ship this id — fall back to ENC-ELITE-03 / ENC-TWIN-01.  
SPELL_DISCOVERY_OPPORTUNITIES: Sentry death after it used Twin Guard can complete observation.  
MAP_REQUIREMENTS: Fortress or openField with choke + backline pocket. Reject a 1-tile closet. No lava on the only approach.  
SPECIAL_RULES: Random 30% lottery off. Only one elite. If pack size would be 1, reroll (Sentry must not spawn solo). Cap 2 summons.  
OBJECTIVE: Defeat all. Intended line: kill the pet occupying the choke, then the glass Sentry.  
FAILURE_CONDITION: Player death.  
REWARD: Elite multiplier on the Sentry only + standard support XP. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Twin + occupy. Distinct from ENC-ELITE-05 (`FSN-GLASS-WARD` min-range gun) and ENC-REINF-07 (PAIR, no Warden).  
SOLVABILITY_REQUIREMENTS: Pocket connected; pet spawn free; two walk-offs.  
REPLAYABILITY: Wolf vs archer. `/GOLEM` Warden presentation.  
SCALING_BEHAVIOUR: Promote only by converting to ENC-RARE-07 (`FSN-VERSE-PULPIT`), never by adding HP.  
STATUS: PROPOSED

---

### ENC-BAIT-01

ENCOUNTER_ID: ENC-BAIT-01  
TYPE: priority-target / anti-summon  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-BAIT-GATE` — `ROLE-BAIT` king (`spell-bait-pylon`, family-flip `usableByEnemy` for this id only; **no** `healAmount` on CORE) + `ROLE-TANK` rook + `ROLE-ANTI-SUMMON` bishop (`spell-weaken` + `spell-expose`). Pet `mp: 0`, **must not path**; kit `spell-bait-eat` only. No wolf/archer/pylon/turret/font overlay on that king. Cap one bait. Hold this id if `summonAI: "bait"` is not an allowed string — fallback ENC-NULL-01.  
AI_REQUIREMENTS: Prelate plants if cap allows. Censor focuses the highest-threat player-side summon if one exists, else the player. Golem walks up. Soph 2–4.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-bait-pylon` / `spell-weaken`. Weight this room ×2 if the player has a summon **equipped** (build, not level).  
MAP_REQUIREMENTS: `openField` or fortress courtyard. Censor needs LoS to the backline **and** a retreat tile. No sealed alcove. Optional modifier `null_field` **off** on CELL.  
SPECIAL_RULES: Random 30% lottery off. No drain on the censor. No Inferno. 0 XP on bait-pylon death. Distinct from ENC-RUSH-20 (Table D bait + conductor) — this is a dungeon CADRE, not a dual-boss.  
OBJECTIVE: Clear. Intended: do not feed the pylon a spell aimed at the owner; delete the Prelate.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + anti-summon discovery. Overlay `direct_hit` is a joke on a pylon — prefer `under_15_turns`.  
TACTICAL_PURPOSE: Intercept post as a room. Distinct from ENC-NULL-01 (censor hunts the pet) — here the **post** eats the spell aimed at the owner.  
SOLVABILITY_REQUIREMENTS: Courtyard walk-offs; pylon cell free reachable floor, not a portal; golem not on the portal.  
REPLAYABILITY: `/SCRIBE` live `bone_scribe` vs proposed `null_censor`.  
SCALING_BEHAVIOUR: High: golem is elite still without Inferno. Peak: still one bait engine.  
STATUS: PROPOSED

---

### ENC-VERSE-01

ENCOUNTER_ID: ENC-VERSE-01  
TYPE: spell-discovery / elite  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: `FSN-VERSE-PULPIT` teaching COURT **without** rare tag — `ROLE-VERSE` bishop (`spell-stolen-verse`, Frost) + junior Tempo Precentor **only if** ally Tempo apply exists (else a Frost bishop) + one gun (Frost, not a second `glass_sniper` unless Share is live). Verse skips if no last-resolved hostile id / denylist / no legal tile; skips echoing Strike if Frost is legal. Isolated 1v1 **rerolls** this id to ENC-SPELL-13.  
AI_REQUIREMENTS: COURT contracts. Leader on the Verse body. `escapeRoute` on. Soph 6–8. `instantKill` / `betrayal` off.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-stolen-verse` (observe+win). Do not restamp Mute Thread / Queue Cut (boss-owned).  
MAP_REQUIREMENTS: Chapel + gallery, or chessboard with two files. Insertion as mastery, not teach.  
SPECIAL_RULES: Do not pack Verse with a second echo engine. Tempo body omitted if apply is missing (`FSN-TEMPO-CHOIR` still gated).  
OBJECTIVE: Clear. Intended: change the last-resolved id (force Frost) so the echo is cheap, then delete the Scribe.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + verse discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Echo last id as a room. Distinct from ENC-LENS-01 (share range) and ENC-HOST-01 (mirror host).  
SOLVABILITY_REQUIREMENTS: Two files; Scribe cannot spawn in a pocket; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Gun frost vs weaken.  
SCALING_BEHAVIOUR: Promote rare tag only by converting to ENC-RARE-07.  
STATUS: PROPOSED

---

### ENC-RARE-07

ENCOUNTER_ID: ENC-RARE-07  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-VERSE-PULPIT` (echo + tempo + gun, leader) **or**, if the account has not answered ENC-ELITE-12 / ENC-GALE-01, leftover drop-5 `FSN-EVADE-GOAD` **or** drop-2 `FSN-RIFT-KNOT` (finally a dedicated beat if Swap/blink apply exists). Rare elite tag on the Verse / Knot displacer only (`variant: rare_elite`). Isolated 1v1 **rerolls** Verse.  
AI_REQUIREMENTS: CADRE/COURT contracts. `escapeRoute` on the rare elite. `instantKill` / `betrayal` off. Lethal lookahead on.  
SPELL_DISCOVERY_OPPORTUNITIES: Guaranteed one rare drop from {`spell-gale-fan`, `spell-twin-guard`, `spell-stolen-verse`, `spell-goad`} not yet owned.  
MAP_REQUIREMENTS: Fortress courtyard + gallery, or chessboard with two files. Insertion chance: 8% on mastery beats, never on teach. At most once per dungeon-chain.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-07 by default. Purple portal chrome only after clear. `FSN-TEMPO-CHOIR` / `FSN-FOG-FUSE` still gated. `FSN-RIFT-KNOT` may replace Verse if the account has never seen displacement CADRE and ally-Swap apply exists — otherwise skip Knot.  
OBJECTIVE: Defeat the rare elite (supports recommended).  
FAILURE_CONDITION: Player death.  
REWARD: Rare Doka band (≈ 2.5× depth victory) + the spell drop.  
TACTICAL_PURPOSE: Optional peak that consumes Verse / Knot the primer already taught.  
SOLVABILITY_REQUIREMENTS: Two files; elite cannot spawn in a pocket; Swap/push dest legal if used.  
REPLAYABILITY: VERSE-PULPIT vs RIFT-KNOT vs EVADE-GOAD by which PAIR the account answered.  
SCALING_BEHAVIOUR: Do not add a second rare elite. Scale gun Haste uptime and Verse skip-discipline, not HP.  
STATUS: PROPOSED

---

### ENC-TREAS-07

ENCOUNTER_ID: ENC-TREAS-07  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH (opt-in)  
ENEMY_COMPOSITION: Empty on entry. Three **devices**, not three chests (distinct from ENC-TREAS-02 / ENC-TREAS-06):

| Device | Commit | Previewed reward |
| :--- | :--- | :--- |
| `WF-TRS-TRIP_CACHE` | 1 AP: medium Doka if 0 MP spent this turn; else 5% max-HP tax and no grant. No fight. | Medium `applyRewards` **or** tax |
| `WF-EVT-SWIFT_MARCH` | Flag: next credit uses hard multiplier **only if** the next fight never reaches round 2 | Hard victory purse if you then alpha-strike |
| Split-banner seal | Spawns ENC-SPLIT-01’s two elites (Gale Deacon + Pincer Acolyte) | Depth Doka ×2 (still clamped) + Gale/Goad observation |

AI_REQUIREMENTS: Split-banner pack uses GALE-HOLE / PINCH-GOAD contracts.  
SPELL_DISCOVERY_OPPORTUNITIES: Split-banner preview is always shown before combat.  
MAP_REQUIREMENTS: Three device tiles + a white coward exit near spawn (unlocked immediately). Progress portal locked until coward-leave **or** the committed fight is won **or** cache-only leave after the cache resolves.  
SPECIAL_RULES: Touching Split-banner seal locks the coward exit and the other devices. Cache can be used without locking the coward exit. Swift March can be used without combat. Losing Split-banner is a normal death. Jackpot numbers stay inside `applyRewards`. `doka_fever` is **not** on this table (ENC-TREAS-03). Last Stand is ENC-LAST-01, not this room.  
OBJECTIVE: Resolve zero or more devices **or** take the coward exit. Split-banner commit must be won.  
FAILURE_CONDITION: Player death after Split-banner commit. Coward / cache-miss is success-with-less.  
REWARD: Per table. Coward: 0 extra.  
TACTICAL_PURPOSE: Choice/rest beat with **three different prices** (still-foot coin, round-1 alpha, two sequential elites). Distinct from ENC-TREAS-06 (Blood Lock / First Blood).  
SOLVABILITY_REQUIREMENTS: All devices and the coward exit reachable on entry. After Split-banner commit, spawn the pack on reachable cells not on the progress portal.  
REPLAYABILITY: Device positions rotate. Split pack Gale/Pincer vs Twin/Bias.  
SCALING_BEHAVIOUR: Raise information (show kits) rather than HP. Never stack with `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-LAST-01

ENCOUNTER_ID: ENC-LAST-01  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: PEAK (opt-in)  
ENEMY_COMPOSITION: Empty until the player flags. One `WF-RSK-LAST_STAND` inlay. End a turn on it to flag this map: if the next `applyRewards` happens while current HP is ≤ 30% of max, that credit uses the **extreme** multiplier; if HP is above 30% at credit time, the flag is spent with no bonus. Inverse of Harvest Moon (ENC-TREAS day-4). After flag, spawn `FSN-PINCH-GOAD` (or 2× pawns if occupancy Cross is not ready) from far cells.  
AI_REQUIREMENTS: PINCH contracts. They do not heal you (the wager is staying wounded).  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Inlay optional floor. Coward exit near spawn. Progress portal locked until coward-leave **or** the fight is won.  
SPECIAL_RULES: Death still uses `saveBattleStats` (20/40) — the extreme multiplier never applies to a death credit. Healing above 30% **wastes** the flag (intended). Distinct from ENC-VEIN-01 (tax then fight for hard, any HP).  
OBJECTIVE: Win wounded **or** take the coward exit (flag wasted if you never fight).  
FAILURE_CONDITION: Player death after commit. Coward is success-with-less.  
REWARD: Extreme `applyRewards` if ≤30% at enqueue; else standard kill XP only. Overlay none (the wager *is* the challenge).  
TACTICAL_PURPOSE: Opt-in “cash out wounded.” High-level players choose a **state**, not a bigger number.  
SOLVABILITY_REQUIREMENTS: Inlay and coward exit reachable. Pack spawns on reachable cells not on the portal.  
REPLAYABILITY: Inlay center vs side. High: spawn `FSN-GALE-HOLE` instead of PINCH for Gale-branch accounts.  
SCALING_BEHAVIOUR: Do not raise HP of the pack. The wager is the scaler.  
STATUS: PROPOSED

---

### ENC-REST-07

ENCOUNTER_ID: ENC-REST-07  
TYPE: rest choice  
RELATIVE_DIFFICULTY: none (safe) — optional last-stand / tight-grip shrine is HIGH  
ENEMY_COMPOSITION: None on the rest floor. `isRestMap: true`.  
AI_REQUIREMENTS: None.  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and previews `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. If ENC-WAVE-08 / ENC-GALE-01 / ENC-TWIN-01 observed Gale/Twin/Goad, the shrine **names** the missing id (still not a grant). Optional `WF-SPL-HUSH_BEARER` is **not** spawned on rest (would start combat). Optional `WF-PRT-TWILIGHT_GATE` is legal here (rest / overworld only; never the only portal; even-round hard purse).  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-07. Optional `WF-RSK-LAST_STAND` tile (flag next room only). Optional `WF-ZON-IRON_PULSE` (flavor on rest is “one extra shrine tap mitigation,” still not a combat). Optional `swift_winds` shrine (kick/soot hop chrome) — not a dungeon sponge.  
SPECIAL_RULES: No encounters until a rest-exit is taken. `armDeathGuards` still applies if the player arrived from Death Realm. Last Stand does not start combat. `uiLayout` unchanged. After one full Table D clear, shrine can enable day-7 `rushVariant` flags (`mill_file`, `counter_stakes`, `wedge_lance`, `levy_pit`).  
OBJECTIVE: Choose an exit. Optional: shrine, last-stand flag, twilight gate, or risk door.  
FAILURE_CONDITION: None on this map.  
REWARD: None on the rest map. Last Stand is a modifier flag, not a Doka mint. Twilight Gate bonus via `applyRewards` on even-round entry only.  
TACTICAL_PURPOSE: Choice/rest beat that lets high-level players **opt into** Gale-primer risk instead of a bigger number.  
SOLVABILITY_REQUIREMENTS: All rest-exits reachable. New risk exit and last-stand pass punch-roster / portal reachability. Last-stand not on spawn or a portal. Twilight Gate never the only portal.  
REPLAYABILITY: Shrine spell rotates among under-leveled bar spells. Iron pulse on/off.  
SCALING_BEHAVIOUR: Rest does not scale. After depth 3, hide `normal` behind an abandon confirm.  
STATUS: PROPOSED

---

### ENC-HUSH-01

ENCOUNTER_ID: ENC-HUSH-01  
TYPE: spell-discovery / optional challenge  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `WF-SPL-HUSH_BEARER` (same-tier, medium threat, 1 extra `usableByEnemy` spell — prefer `starter-frost` or `spell-enrage`) + 1× pawn screen. On Bearer death the player may **hush** that spell id: no enemy on this map may cast it for the rest of the map. Inverse of ENC-SPELL rune-bearer attune.  
AI_REQUIREMENTS: Bearer uses the extra id at least once if legal (so hush is a decision, not a guess). Pawn greedy.  
SPELL_DISCOVERY_OPPORTUNITIES: Hush is a **map mute**, not a grant and not `upgradeSpell`. Observation of the extra id can still follow the sibling pipeline if the player wins.  
MAP_REQUIREMENTS: Open court. Prefer replacing one existing spawn. Must stay reachable.  
SPECIAL_RULES: Attack Nearest is not a spell and is never hushed. Hush does not persist `spellLevel*`. Distinct from ENC-SPELL loaner (one-cast without kill) and grimoire stalker (one remaining cast).  
OBJECTIVE: Clear. Optional: kill Bearer first to mute the extra.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns` rewards deleting the Bearer.  
TACTICAL_PURPOSE: Teach deny-vs-steal. High-level players already own the catalog; muting an enemy extra is the new question.  
SOLVABILITY_REQUIREMENTS: Bearer reachable; not on the portal.  
REPLAYABILITY: Extra frost vs enrage vs iron-skin.  
SCALING_BEHAVIOUR: Does not scale by HP. Change the extra id.  
STATUS: PROPOSED

---

### ENC-BRANCH-07

ENCOUNTER_ID: ENC-BRANCH-07  
TYPE: branching paths  
RELATIVE_DIFFICULTY: LOW (the choice is the content)  
ENEMY_COMPOSITION: None on the foyer.  
AI_REQUIREMENTS: None in-foyer.  
SPELL_DISCOVERY_OPPORTUNITIES: Door inscriptions preview the taught verb and one spell id the next room may drop.  
MAP_REQUIREMENTS: Foyer with four portals: Gale (cone-push / soot / GALE-HOLE → ENC-TEACH-07 or ENC-GALE-01), Twin (ally-swap / kennel / TWIN-BROOD → ENC-SPELL-14 or ENC-TWIN-01), Pincer (sandwich / goad / PINCH-GOAD → ENC-PINCH-01 or ENC-AMBUSH-07), Oblique (diagonal / pit / BIAS-PIT → ENC-BIAS-01 or ENC-HAZ-13). A sealed fifth door to ENC-RARE-07 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: gale | twin | pincer | oblique` on the dungeon snapshot (**before** `cleanupMap`). Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-07 / ENC-BOSS-07). Day-1 stays two-door; day-2 Ash/Ice/Void; day-3 Blood/Glass/Paper/Null; day-4 Tide/File/Clock; day-5 Wick/Rime/Smoke/Plus; day-6 Ley/Fan/Pit/Font. This is the account-upgrade foyer after those six are known.  
OBJECTIVE: Pick a door.  
FAILURE_CONDITION: None in-foyer.  
REWARD: None. The chosen room pays.  
TACTICAL_PURPOSE: Four-way memory so capstones are not always Countess / Archbishop / Grandmaster / Weeping.  
SOLVABILITY_REQUIREMENTS: All four doors reachable; none on spawn.  
REPLAYABILITY: Door order shuffles. Split-banner door (ENC-SPLIT-01) can replace Gale for accounts that already finished Gale this week.  
SCALING_BEHAVIOUR: Branches do not get harder; **destinations** scale with band.  
STATUS: PROPOSED

---

### ENC-MAST-07

ENCOUNTER_ID: ENC-MAST-07  
TYPE: mastery / waves / hazard / priority  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave 1: 2× pawn on soot (`WF-HAZ-SOOT_LIP`). Wave 2: `FSN-GALE-HOLE` **or** `FSN-PINCH-GOAD` **or** `FSN-TWIN-BROOD` **or** `FSN-BIAS-PIT` by `branch`. Wave 3: elite leftover (E-GALE Deacon **or** E-PINCH Acolyte **or** E-SWAP Sentry **or** Oblique elite) + leftover.  
AI_REQUIREMENTS: Full sophistication allowed (lethal lookahead, overkill spill, LoS reposition, backline guard). Wave 3 elite camps the safest clean, non-spark tile.  
SPELL_DISCOVERY_OPPORTUNITIES: None — this is the exam.  
MAP_REQUIREMENTS: Combines soot ribbon (TEACH-07), twin-spark line (HAZ-13), and a central iron pulse (PROT-07) that is **optional** — occupying it at end of player turn grants the live −15% incoming for the next enemy phase (standing-zone, not a new stat). Scripted hazards only. Branch skins: Gale may inherit a painted wedge; Twin keeps choke+pocket; Pincer keeps walk-off space; Oblique keeps one painted diagonal.  
SPECIAL_RULES: Portal locked until wave 3 clear. Fallbacks if a verb cannot ship: Gale → PIT-RANK; Twin → KENNEL-LITANY; Pincer → Strike pair; Oblique → PIT-RANK.  
OBJECTIVE: Clear all waves.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery Doka band + standard XP. Overlay `under_8_ap_per_turn` or `direct_hit`. Avoid `under_5_turns`.  
TACTICAL_PURPOSE: Prove the player can refuse soot camping, hug or walk off a sandwich, and optionally spend occupancy on the pulse.  
SOLVABILITY_REQUIREMENTS: All wave-cell sets reachable; one clean path; pulse not on a portal.  
REPLAYABILITY: Branch-skinned wave 2.  
SCALING_BEHAVIOUR: Change wave 3 elite’s **role** (Deacon vs Acolyte vs Sentry vs Oblique), not its level.  
STATUS: PROPOSED

---

### ENC-MINI-08

ENCOUNTER_ID: ENC-MINI-08  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Gale Lieutenant — queen chassis **without heal**, kit from `ROLE-GALE` **plus** one Strike (so it is not a pure glass bot): `spell-gale-fan` (or Frost if Gale cannot ship) + `physical_attack`. 1× Mason choir (one pit). Not in `BOSS_IDS`. No phase-2 table.  
AI_REQUIREMENTS: Lieutenant Gales first if a legal push exists, else Frosts, then Strikes only if the choir is dead. Choir is a setter (one pit). If the lieutenant would die, it tries one Gale **only if** a push cell is not the pit-only landing for a full-HP player.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-gale-fan` drop (once) if used.  
MAP_REQUIREMENTS: Small nave + one stall + painted wedge. No lava dest. No `titans_vigor`.  
SPECIAL_RULES: At 30% HP the lieutenant gains **one** extra Gale cycle only if the chain taught GALE-HOLE (ENC-WAVE-08 / ENC-GALE-01). Otherwise it only Frosts + one pit. Honest to pacing.  
OBJECTIVE: Defeat the lieutenant (choir flees on death).  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss 2× XP on the lieutenant + depth Doka. Not a Boss Rush room.  
TACTICAL_PURPOSE: Gale-branch capstone-adjacent without `wedge_prior`’s triple-cone state machine (Wave 7 stays Table E).  
SOLVABILITY_REQUIREMENTS: Stall connected to the nave. Two walk-offs. Pit not both exits.  
REPLAYABILITY: Choir sentry (Twin) if Twin was taken; acolyte if Pincer; oblique if Bias.  
SCALING_BEHAVIOUR: Add a second choir body before any HP bump. Peak: lieutenant kit adds `spell-iron-skin` (still no Inferno).  
STATUS: PROPOSED

---

### ENC-BOSS-07

ENCOUNTER_ID: ENC-BOSS-07  
TYPE: dungeon capstone boss  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag: Gale → `starborn_queen` (geometry director; cone literacy without adding `wedge_prior` to `BOSS_IDS`); Twin → `twin_monarchs` (pair / half-death; teach rage only if ENC-DUEL-01 was **not** the last lesson — here the kit does **not** add a third monarch); Pincer → `bone_cavalier` (charge sandwich); Oblique → `chessboard_lich` (zone vs diagonal). If the chain taught mill/window (ENC-MOVE-12) **and** Gale was not taken, Ice/Hex-mixed accounts may use `lord_of_static` **alone** (not the Rush pair). No dual-boss unless this is a Rush injection. Wave-7 ids (`mill_seneschal`, …) stay **out of this room**.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-08) or gale-pit (ENC-ELITE-12) — trash does not receive boss heals / reflect / larva bursts.  
SPELL_DISCOVERY_OPPORTUNITIES: None new; boss kits already use catalog spells. Observation still follows the sibling pipeline if catalog ≠ ownership ever lands.  
MAP_REQUIREMENTS: Existing boss map color / portal color from `DEFAULT_BOSS_CONFIGS`. Hazard tiles from the boss ability stay capped at 50. Must remain solvable. Branch skins: Gale may add a painted hug aisle (chrome); Twin may inherit choke+pocket; Pincer may inherit walk-off space; Oblique may inherit one painted diagonal. Never mill cells on a sounding file (Table E law) — dungeon capstones do not place mill cells.  
SPECIAL_RULES: Depth must be maxDepth. `decideDungeonChainPortal` complete + white portal after win. Do not write rewards via `updateCharacter`. Enrage overlay, if a later boss PR lands, is a turn clock — not HP. Do not pack Queen + Wedge (two multi-file directors) — Wedge is Table E only.  
OBJECTIVE: Defeat the boss.  
FAILURE_CONDITION: Player death (Death Realm, chain reset via `resetRunState`).  
REWARD: Boss Doka/XP multipliers already on the config, then dungeon completion bonus `maxDepth * 50`. Recap at app root.  
TACTICAL_PURPOSE: Mastery exam: the taught verb is the boss’s main ability (geometry / pair / charge / zone).  
SOLVABILITY_REQUIREMENTS: Same as current boss rooms (preferred cells reachable).  
REPLAYABILITY: Four capstones from one four-way foyer.  
SCALING_BEHAVIOUR: Use existing phase 2 (`statMultiplier` in 1.15–1.60 per boss design bible — do not add a third phase). Trash pack size is the only dungeon-specific scaler.  
STATUS: PROPOSED

---

### ENC-RUSH-23

ENCOUNTER_ID: ENC-RUSH-23  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table E `E0`: `mill_seneschal` + `silent_conductor`. Combined mechanic: “Stay on a sounding file; do not step onto the mill.” Mill cells **never** occupy a sounding file. Hopper sits on a silenced file (tempting a walk). Musicians only (cap 4). Not Lock / Rime.  
AI_REQUIREMENTS: Existing combined mechanic once kits ship. Hold this id if mill conveyor + silence file are missing. Fallback: live `lord_of_static` **alone** plus ENC-MOVE-12’s mercy-port chrome (one-round window, not a second boss) — do not invent a mill cell that is also a sounding file.  
SPELL_DISCOVERY_OPPORTUNITIES: None (Rush is a mastery product).  
MAP_REQUIREMENTS: Current Rush preferred-cell solvability. Mill ⊆ reachable floor, never a preferred boss cell, never a sounding file.  
SPECIAL_RULES: `rushVariant: mill_file`. Persist still goes through `persistBossRushRoomClear` / `completeBossRushRoom` (client `dokaReward`/`xpReward` ignored). First Table E clear: no hopper chrome (must commit to the live pair). Later clears: hopper highlight. Unlock only after one complete Table D clear. Do **not** overwrite `BOSS_RUSH_ROOMS` or `D0`–`D3`.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death → abort rush (`resetRunState`).  
REWARD: Document Table E purse via `applyRewards` only. Do not also multiply by `rewardDokaMultiplier`. Overlay `under_8_ap_per_turn` after one clear.  
TACTICAL_PURPOSE: Escalate by adding the taught timing-window verb (ENC-MOVE-12) to a mill/silence pair — not more HP.  
SOLVABILITY_REQUIREMENTS: Preferred cells + mill reachable. Hazard total ≤ 50. Mill never on a sounding file.  
REPLAYABILITY: Hopper W vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Later “endless rush” at ENC-REST-07 may add ENC-TEACH-07 soot off the mill (cap 4 tiles), never a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-24

ENCOUNTER_ID: ENC-RUSH-24  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table E `E1`: `counter_chaplain` + `ivory_palisade`. Combined mechanic: “He trades your pet onto the far bank of the stakes.” Swap **never** lands inside a sealed pocket (`finalizePlayableLayout`). Decoy is **not** a stake and is **not** a Cord gate. Sentinel + Chaplain extras share cap 4. Not Grandmaster / Bait / Fortress.  
AI_REQUIREMENTS: Hold if Pawn Trade apply is missing (must **not** call `swapPositions` as a fake — that is caster↔player). Fallback remix: live `alabaster_fortress` **alone** plus ENC-CHECK-01’s token (`protectTargetId`, not a second boss) on the near bank.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Far-bank landing ⊆ reachable floor, two walk-offs, never a sealed pocket.  
SPECIAL_RULES: `rushVariant: counter_stakes`. Token/decoy is not a boss and does not count toward `completeBossRushRoom` (prefer despawn).  
OBJECTIVE: Defeat both bosses; token optional.  
FAILURE_CONDITION: Player death.  
REWARD: Table E purse via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Add the taught away-vs-to-caster pet payload from ENC-CHECK-01 without a third boss.  
SOLVABILITY_REQUIREMENTS: Preferred cells + far-bank landing reachable. Swap never into a sealed pocket.  
REPLAYABILITY: Token pawn vs warden (iron-skin) for accounts that already beat E1 once.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by stake count on the existing ability cap, not HP.  
STATUS: PROPOSED

---

### ENC-RUSH-25

ENCOUNTER_ID: ENC-RUSH-25  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table E `E2`: `wedge_prior` + `cinder_lance`. Combined mechanic: “Step out of the cone **and** charge the glowing window.” Cone tiles **never** occupy a telegraphed lance file. Lectern and Brazier are both objects. Wrong-element still −50%. Not Queen / Ram.  
AI_REQUIREMENTS: Hold if `areaShape: "cone"` is unread. Fallback: live `starborn_queen` **alone** plus ENC-SPELL-13’s painted `wedgeCells[]` (chrome, not a second boss). Do not pack Wedge + Queen as two multi-file directors.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Wedge overlay must not sit on portals or on lance glow.  
SPECIAL_RULES: `rushVariant: wedge_lance`. Lectern / Brazier are not bosses.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table E purse via `applyRewards`. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Add the taught hug-vs-push literacy from ENC-GALE-01 / ENC-SPELL-13 to a known geometry pair.  
SOLVABILITY_REQUIREMENTS: Preferred cells + hug cells reachable. Cone never on lance glow.  
REPLAYABILITY: Wedge N vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Extra cone is already illegal with Queen — do not double it.  
STATUS: PROPOSED

---

### ENC-RUSH-26

ENCOUNTER_ID: ENC-RUSH-26  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table E `E3`: `levy_rector` + `fosse_warden`. Combined mechanic: “One committed poke across a pit; do not eat the tax on that poke.” Tax is **not** a pit-step (walk fail does not consume it). Pits **never** occupy his brand telegraph. Tithe-box sits on the near bank. Causeway is the only walk across. Not Archivist / Surplus / Eternal / Conductor.  
AI_REQUIREMENTS: Hold if Hex Toll + Open Pit are missing. Fallback: live `chessboard_lich` **alone** plus ENC-PIT-01’s one pit (`pitCell`, not a second boss). Do not pack Levy + Archivist (two AP taxes).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Preferred cells. Causeway ⊆ reachable floor. Pit walk-block / LoS-open.  
SPECIAL_RULES: `rushVariant: levy_pit`. Tithe-box is not a boss. Shared extra: none that also tax AP.  
OBJECTIVE: Defeat both bosses.  
FAILURE_CONDITION: Player death.  
REWARD: Table E purse via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Combine taught pit (ENC-PIT-01 / ENC-BIAS-01) with a next-cast AP tax so the poke is a **decision**, not a sponge.  
SOLVABILITY_REQUIREMENTS: Preferred cells + causeway reachable. Tax is not a pit-step. Pits never occupy the brand telegraph.  
REPLAYABILITY: Causeway N vs E.  
SCALING_BEHAVIOUR: Do not add a third boss. Tighten by one extra tithe-box chrome after a first clear, never HP.  
STATUS: PROPOSED

---

### ENC-MORROW-01

ENCOUNTER_ID: ENC-MORROW-01  
TYPE: ambush / displacement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-MORROW-SNARE` lite — `ROLE-MORROW` bishop (`spell-morrow-step`, 0 damage paint; arrival fizzles if occupied) + `ROLE-ORIGIN` rook (`spell-cast-snare` on the player’s current tile if they hold any `apCost ≥ 3`) + optional junior `trip_mason` (visible wire, not the only path). Hold if delayed-blink apply is missing — fallback ENC-AMBUSH-02.  
AI_REQUIREMENTS: Morrow skips if dest is adjacent to the player. Origin skips if the player must walk off the paint. Cap 2 live traps. Teleport / Mist Step does not trip wires. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: `spell-morrow-step` / `spell-cast-snare`.  
MAP_REQUIREMENTS: Arena + two pillars. Arrival cell free, non-void, non-portal, two walk-offs. Wire never the only tile that reaches the backliner.  
SPECIAL_RULES: Random 30% lottery off. Do not also Rank Lock (two walk rewrites). Distinct from ENC-DISP-01 (pads now) — this blink is **next turn**.  
OBJECTIVE: Clear. Intended: occupy the painted arrival, or dump AP so Origin will not paint.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + delayed-blink discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Delayed occupancy as a room. Prepares Table E mill (don’t step onto the thing that arrives).  
SOLVABILITY_REQUIREMENTS: Arrival legal; wire not a cut-vertex; 3-unit occupancy leaves walk-offs.  
REPLAYABILITY: Arrival N vs E.  
SCALING_BEHAVIOUR: Peak: full CADRE. Still one Morrow elite.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain G — “Gale Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-07 then ENC-SPELL-13 (or ENC-SPELL-14 if Gale Fan already owned / cone+push missing) |
| 2 | Reinforce | ENC-WAVE-08 |
| 3 | Combine | ENC-HAZ-13 then ENC-GALE-01 **or** ENC-TWIN-01 **or** ENC-PINCH-01 |
| 3 insert | Choice | ENC-BRANCH-07 → Gale/Twin/Pincer/Oblique destinations |
| 4 | Pressure | ENC-SURV-13 **or** ENC-PROT-07 **or** ENC-SPLIT-01 **or** skip via ENC-REST-07 |
| 4 | Mastery | ENC-MAST-07 (branch skin) |
| 5 | Boss | ENC-BOSS-07 |

Rare: 8% on depth 4 to **insert** ENC-RARE-07 before mastery.  
Treasure: rest may offer ENC-TREAS-07 instead of PROT-07.  
Pet side-story: replace combine with ENC-CHECK-01 and mini-boss ENC-MINI-08; capstone may become `twin_monarchs` if Twin was not the door.

### Chain H — “Window Primer” (maxDepth 4)

ENC-HAZ-14 → ENC-MOVE-12 → ENC-PYRE-01 → ENC-REST-07 → ENC-BOSS-07 (`lord_of_static` only if a later human allows a non-branch boss; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-12 as teach on accounts that already know soot/gale.

### Rush injection (day-7)

After one full Table D clear (`D0`–`D3`), ENC-REST-07 shrine can enable: `E0` → ENC-RUSH-23, `E1` → ENC-RUSH-24, `E2` → ENC-RUSH-25, `E3` → ENC-RUSH-26. Day-1 flags for rooms 0 / 3 / 9, day-2 flags for rooms 1 / 2 / 4 / 5 / 8, day-3 flags for rooms 6 / 7, day-4 flags for Table B, day-5 flags for Table C, and day-6 flags for Table D remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-07, ENC-SPELL-13, ENC-SPELL-14, ENC-HAZ-14 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-13, ENC-MOVE-12, ENC-MOVE-13, ENC-PYRE-01 | `under_50_damage` |
| ENC-WAVE-08 | `under_10_turns` |
| ENC-PROT-07, ENC-MAST-07, ENC-CHECK-01 | `direct_hit` |
| ENC-GALE-01, ENC-PINCH-01, ENC-ELITE-12, ENC-SPLIT-01, ENC-DRAW-01, ENC-LEDGER-01 | `under_8_ap_per_turn` |
| ENC-SURV-13, ENC-SURV-14 | `no_healing` (not `no_damage_taken`) |
| ENC-TREAS-07 / ENC-LAST-01 / ENC-REST-07 last-stand / ENC-WATCH-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 2 roles, one verb | no lookahead | zone 0, no family | soot or leave-bell | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | twin spark **or** pyre | kill + optional glyph |
| MID | named drop-6 `FSN-*` or waves | backline guard | zone 1 + Gale/Twin/Pincer | one `WF-*` | clock / tags / port / kick |
| HIGH | elite or split | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / gale-pit / sandwich |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table E |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit soot, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure (not this drop’s table).

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-6 fields plus:

```
encounterId
encounterType        // + gale | twin | pincer | bias | ledger_ap | check_leash
                     //   | pyre | still_watch | split_banner | bait_gate | verse
                     //   | last_stand | hush | mill_file
formationId?         // FSN-GALE-HOLE | FSN-TWIN-BROOD | FSN-PINCH-GOAD |
                     // FSN-BIAS-PIT | FSN-DRAW-CASH | FSN-LEDGER-LEY |
                     // FSN-CHECK-LEASH | FSN-GALE-PIT | FSN-TWIN-KENNEL |
                     // FSN-PINCER-GATE | FSN-SHOVE-SCHOOL | FSN-OBLIQUE-FILE |
                     // FSN-MORROW-SNARE | FSN-SATED-PLATE | FSN-BAIT-GATE |
                     // FSN-VERSE-PULPIT | FSN-RIFT-KNOT | FSN-EVADE-GOAD
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // gale | twin | pincer | oblique
wedgeCells[]?        // ENC-SPELL-13 / ENC-GALE-01 until areaShape is read
pitCell?
pushDir?
twinPairId?
pincerA? / pincerB?
biasDiag?
sootCells[]?
leaveBellCell?
holdPortalLocked?
objectiveKind        // + occupy_iron_pulse | wait_mercy_port | cardinal_kick
                     //   | light_pyre | hush_id | last_stand_wager | split_post
failureKind
deviceTable[]        // ENC-TREAS-07
rushVariant?         // mill_file | counter_stakes | wedge_lance | levy_pit
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lieutenant / Deacon / Watch” logic — use `formationId` / `protectTargetId` / `wedgeCells[]`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31 … 2026-09-23 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` have WX combat hooks they do not.
- Dual-boss dungeon capstones (Rush / Table E only).
- Wiring `applyPushback` / `applyAttract` / `areaShape` / Twin Guard / Cross Flank occupancy / `currentView` battle-walk writer — those wait on SPELL_PROPOSALS apply. This catalog consumes drop-6 **formations** that can stand on live kits with explicit rerolls.
- Shipping `FSN-GALE-HOLE` / ENC-GALE-01 by faking Gale with Fan Bolt or Inferno.
- Shipping `FSN-TWIN-BROOD` by calling `swapPositions` (caster↔player).
- Shipping `FSN-FOG-FUSE` without a public wick tell under smoke.
- Shipping `FSN-TEMPO-CHOIR` before ally Tempo apply.
- Packing Wedge + Queen, Levy + Archivist, Mill + Lock/Rime, Counter + Grandmaster/Bait, Gale + Fan Prelate as PAIR.
- Minting `FSN-*` ids for Wave-6 families (`oncoming_knight`, `pin_cantor`, `glance_ward`, `gait_muter`, `vault_chaplain`, `span_warder`, `span_prelate`, `cadence_thief`, `brand_plate`, `cover_squire`, `lintel_mason`, `act_teller`, `act_sexton`) — those wait on a later formation drop.
- Adding Wave-7 ids to `BOSS_IDS` in the same PR as a Rush remap.
- `WF-PRT-TWILIGHT_GATE` in dungeon / boss rush / Death Realm.

---

## 10. Pick order (day-7, after day-1…day-6 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Day-4 pick order still wins if Tide / File / Clock verbs are missing: ENC-TEACH-04 + ENC-HAZ-07 → ENC-WAVE-05 → ENC-BELL-01 or ENC-WIRE-01 or ENC-SLAM-01 → ENC-BRANCH-04.

Day-5 pick order still wins if Wick / Rime / Smoke / Plus verbs are missing: ENC-TEACH-05 + ENC-SPELL-09 → ENC-WAVE-06 → ENC-WICK-01 or ENC-RIME-01 or ENC-COUP-01 → ENC-BRANCH-05.

Day-6 pick order still wins if Ley / Fan / Pit / Font verbs are missing: ENC-TEACH-06 + ENC-SPELL-11 → ENC-WAVE-07 → ENC-LEY-01 or ENC-PIT-01 or ENC-FAN-01 or ENC-TRADE-01 → ENC-BRANCH-06.

Once those exist, implementers should pick:

1. ENC-TEACH-07 + ENC-SPELL-13 (soot start-tax / Gale verbs). `FSN-GALE-HOLE` ships only when cone+push exist; otherwise ENC-SPELL-14 (Twin glyph) in the same slice as ENC-WAVE-08’s PINCH half.  
2. ENC-WAVE-08 (`formationId` GALE-HOLE → PINCH-GOAD)  
3. ENC-GALE-01 or ENC-TWIN-01 or ENC-PINCH-01 (new pressure objects)  
4. ENC-BRANCH-07 (`branch: gale|twin|pincer|oblique` snapshot-before-cleanup)  
5. ENC-BOSS-07 branch read (live 19 `BOSS_IDS` only)  
6. Rush Table E (ENC-RUSH-23…26) one room at a time, only after the account has one full Table D clear. Hold E0 if mill conveyor + silence file are missing; hold E1 if Pawn Trade apply is missing (do not call `swapPositions`); hold E2 if cone `areaShape` is unread; hold E3 if Hex Toll + Open Pit are missing.

Uniqueness: this file is the **seventh** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
