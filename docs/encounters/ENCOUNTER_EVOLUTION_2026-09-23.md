# Encounter Evolution Catalog — 2026-09-23

Status: **PROPOSED** (design only). Do not implement production code from this file unless a later human or orchestrator explicitly picks an `ENCOUNTER_ID`.

Author: Dungeon and Encounter Evolution Designer (cron automation).  
ACTION_ID: `EED-2026-09-23-001`.  
Parent catalogs:

- [`ENCOUNTER_EVOLUTION_2026-08-31.md`](./ENCOUNTER_EVOLUTION_2026-08-31.md) (`EED-2026-08-31-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-01.md`](./ENCOUNTER_EVOLUTION_2026-09-01.md) (`EED-2026-09-01-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-02.md`](./ENCOUNTER_EVOLUTION_2026-09-02.md) (`EED-2026-09-02-001`)
- [`ENCOUNTER_EVOLUTION_2026-09-21.md`](./ENCOUNTER_EVOLUTION_2026-09-21.md) (`EED-2026-09-21-001`, open PR #347 — not yet on `main`)
- [`ENCOUNTER_EVOLUTION_2026-09-22.md`](./ENCOUNTER_EVOLUTION_2026-09-22.md) (`EED-2026-09-22-001`, open PR #396 — not yet on `main`)

**Do not reuse those IDs.** This file only adds new rooms. Do not rewrite prior catalogs.

Grounding: `origin/main` @ `0f5363f` plus sibling design — `docs/design/ENEMY_FORMATIONS_2026-09-22.md` (drop-5 `FSN-*`, open PR #401), `docs/ENEMY_AI_EVOLUTION.md`, `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-21.md` (Wave-4 families packed here) and `docs/automation/ENEMY_ELITE_EVOLUTION_2026-09-22.md` (Wave-5 families **deferred** — no `FSN-*` minted for Gale / Twin Sentry / Pincer / Oblique / Verse here), `docs/WORLD_DYNAMICS.md` wave 5 (`WF-*`, open PR #399), `docs/design/BOSS_AND_SPELL_DISCOVERY.md` Rush Table D (`D0`–`D3`, open PR #406). Live constants: 22 map modifiers in `EXISTING_MAP_MODIFIER_IDS` (`src/frontend/src/engine/worldFeatures.ts` 1890–1913), lava/ice/spikes, `MAX_HAZARD_TILES = 50` (`gameConstants.ts` 9), `MAX_ENEMIES = 20` (10), `ENEMY_SUMMON_CAP = 2` (300), `ENEMY_SUMMON_COOLDOWN_TURNS = 2` (301), `AI_KAMIKAZE_MIN_TARGETS = 2` (271), 19 `BOSS_IDS` (`bossTypes.ts` 390–410), 10 `BOSS_RUSH_ROOMS`, `ChallengeCondition` overlay (`challengeCompletion.ts` 11–20), atomic `applyRewards`. Family lottery still lives in `engine/spawnPolicy.ts` (`FAMILY_VARIANT_CHANCE` 35, `SPAWN_MIN_CHEBYSHEV = 4`).

---

## 1. Why a sixth day

Day-1 taught the **Ash / Ice skeleton**. Day-2 taught the **Void primer**. Day-3 taught the **Hex primer**. Day-4 taught the **Tide / File / Clock primer**. Day-5 taught the **Wick / Rime / Smoke / Plus primer** and spent drop-4 packs `FSN-WICK-STEP`, `FSN-RIME-RANK`, `FSN-SMOKE-GLASS`, `FSN-STACK-CASH`, `FSN-COUP-ROT`, `FSN-WICK-COURT`, `FSN-RESCUE-LINE`, `FSN-PLUS-BATTERY`, `FSN-BASTION-GATE`, plus wave-4 world features (flint, pendulum, gnomon, reed, hourglass, veil font, swap anchor, leash, patience cache, echo scribe, tithe). Rush variants exist for Table A rooms **0–9**, Table B `B0`–`B3` (`ENC-RUSH-11`…`14`), and Table C `C0`–`C3` (`ENC-RUSH-15`…`18`).

After those rooms exist, high-level play is still “the same shape.” Day-6 changes **the question** again by spending the **Ley / Fan / Trade / Recoil / Pit / Font / Gate** verbs that already have drop-5 formation sheets and leftover **wave-5** world-feature knobs. The new question is not “leave the file,” “survive the pip,” or “walk off the fuse.” It is **current resources and painted geometry that is not a rank and not a clock**: spend MP to prime, steal current MP, hug a 90° wedge, isolate a pet so a trade fizzles, kick then sting, plant a font that pulses, pit a melee approach while LoS stays open, walk a pad that is not an occupancy portal.

Gaps this file fills (still unused as scripted rooms):

| Gap | Why it matters at high level |
| :--- | :--- |
| Drop-5 formations | `FSN-LEY-SIP`, `FSN-KICK-STING`, `FSN-FONT-IRON`, `FSN-PIT-RANK`, `FSN-TRADE-HOLE`, `FSN-SLIDE-BASH`, `FSN-LOCK-FAN`, `FSN-LEY-COURT`, `FSN-PUSH-SCHOOL`, `FSN-TRADE-TRAP`, `FSN-FONT-GATE`, `FSN-FAN-FILE`, `FSN-RECOIL-HUNT`, `FSN-GATE-COURT`, `FSN-EVADE-GOAD`, `FSN-LENS-BATTERY` are PDFs, not rooms |
| Leftover drop-4 sheets | `FSN-ICE-FILE`, `FSN-SMOKE-HUNT`, `FSN-ABSOLVE-RACE`, `FSN-TWIN-PLATE`, `FSN-FINISH-LINE`, `FSN-TEMPO-CHOIR`, `FSN-FOG-FUSE` were named on day-5 as gated / peak converts only |
| Leftover drop-2 sheet | `FSN-RIFT-KNOT` still has no dedicated beat (ENC-RARE peak skins only) |
| World-feature wave 5 | `WF-HAZ-GLASS_SHARD`, `WF-HAZ-RATCHET_COG`, `WF-TRP-SECOND_FOOT`, `WF-TER-SANDBAG`, `WF-OBS-SHIFT_SLAB`, `WF-ZON-KEEN_EDGE`, `WF-TEL-RECALL_PIN`, `WF-PRT-PACT_GATE`, `WF-INV-MIRROR_HOST`, `WF-ELT-DRIFT_SENTINEL`, `WF-TRS-BLOOD_LOCK`, `WF-SPL-OATH_CANTOR`, `WF-RSK-OPEN_VEIN`, `WF-MOD-THIN_AIR`, `WF-EVT-FIRST_BLOOD`, `WF-ENV-CROWD_PRESS` |
| Unused live modifiers | leftover `null_field` as an **opt-in rest shrine** only (anti-summon chrome — not a dungeon sponge). `thorned_ground` was day-4; `iron_curse` / `chaos_initiative` were day-5 rest. Do not re-spend them as HP sponges |
| Rush Table D | After one full Table C clear: `D0` `lock_marshal`+`wick_prelate`, `D1` `bait_vicar`+`silent_conductor`, `D2` `font_abbess`+`cord_familiar`, `D3` `surplus_auditor`+`unbound_pendulum`. New `roomIndex` namespace. Do **not** overwrite `BOSS_RUSH_ROOMS` 0–9, Table B `B0`–`B3`, or Table C `C0`–`C3`, and do not collide `ENC-RUSH-01`…`18`. Same-day sibling PR #474 stamps Rush **Table E** — do **not** mint `ENC-RUSH-23+` here |
| Wave-6 solo capstones | `lock_marshal`, `bait_vicar`, `font_abbess`, `surplus_auditor` stay **out of `BOSS_IDS`** until kits ship; dungeon capstones below fall back to live 19 |

Scaling never uses enemy level as the only lever. Preferred order stays: composition → variants → AI gates → kits → hazards / modifiers / world features → objectives → optional `ChallengeCondition`.

**Do not** use `titans_vigor` (`+1000` HP, 1–5× damage) as a dungeon scaler. That is a sponge. It stays out of this catalog.

`doka_fever` remains the **opt-in** sponge from ENC-TREAS-03. Day-4 treasure used Split Cache / Harvest Moon. Day-5 treasure used Patience Cache / Seeping Tithe. Day-6 treasure uses `WF-TRS-BLOOD_LOCK` and `WF-EVT-FIRST_BLOOD` instead.

Relative difficulty bands: `TEACH` / `LOW` / `MID` / `HIGH` / `PEAK`.

---

## 2. Live constraints (unchanged)

- Maps stay solvable: walk-reachable spawn, hostiles, and at least one exit; never spawn on an unlocked portal. Re-run `finalizePlayableLayout` / solvability after scripted hazards or `WF-*` overlays.
- Portals stay locked while hostiles remain. Wave / reinforcement / drift / host rooms keep a living hostile **or** an explicit `holdPortalLocked` flag.
- Rewards go through `applyRewards` only. Death is 20% XP / 40% Doka via `saveBattleStats`. Dungeon depth multipliers already exist (`getDungeonMultiplier`, cap depth 5). Official client clamps `dokaDelta > 100_000` / `xpDelta > 500_000`.
- Spell targeting and encounter rules use **explicit metadata** (`encounterType`, `objectiveKind`, `failureKind`, kit ids, `formationId`, `ownedFile`, `wedgeOrigin`, `pitCell`, `gatePads`, `slideDir`, `lockedAxis`, `recallPin`). Never infer from display names.
- Do not touch RAF loop, map-generation algorithms, turn logic, or damage math when a later implementer picks an ID.
- Rest maps already expose `normal` / `dungeon` / `boss`. Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.
- Optional challenges stay optional unless `FAILURE_CONDITION` says otherwise. Existing `ChallengeCondition` values only (`no_healing`, `under_15_turns`, `under_50_damage`, `no_healing_under_30_damage`, `under_10_turns`, `under_8_ap_per_turn`, `no_damage_taken`, `under_5_turns`, `direct_hit`).
- CharacterStats stay the 12-field persisted set. No new wp/wr/scp.
- `instantKill` and `betrayal` AI gates stay off for every sheet. Coup stays a 25% HP% Strike gate on day-5 sheets; this drop does **not** pack Coup as a teacher.
- Enemy summons stay at cap 2. Hazard tiles stay ≤ 50. Living hostiles stay well under `MAX_ENEMIES`. Stationary posts: one pylon **or** turret **or** mercy font **or** bait, not two, in the same pack.
- Observation/unlock of spells follows the sibling pipeline: use → observe → win → grant. Possession is not observation. `upgradeSpell` remains the only level writer. Oath-cantor binds (`WF-SPL-OATH_CANTOR`) and loaner / echo-scribe one-casts do **not** persist `spellLevel*` arrays.
- `inferArchetype` still treats any `healAmount > 0` as healer. Ley / sip / fan / broker / recoil / porter / sidestep / stinger / pit / share / stride / hex / slide / lock must **not** carry drain / nova / rallying-cry. `spell-rallying-cry` stays `usableByEnemy: false`. Ally mend is `starter-shield` / `spell-iron-skin` until a ranged heal id exists. `starter-heal` is self-only. Mercy Font **planting is not a heal**; the **pulse** is.
- `usableByEnemy` stays false for `spell-barrier`, `spell-mirror`, `spell-timestep`.
- World-feature % max-HP taxes use `recordChallengeDamageTaken` (explore) or `recordInBattleChallengeDamage` (in battle). Do not invent a second HP writer.
- Kamikaze never detonates on a single full-HP player (`AI_KAMIKAZE_MIN_TARGETS = 2`) unless the martyr is ≤ 30% HP.
- Dual Slow / Frost / tide melee / rime enter / **Soul Sip** MP tax: cap applied MP debuff at **−2**. Soul Sip is **current** MP steal (separate axis, no linger). Ley Toll spends **caster** current MP. One Slow source per pack. Do not also Root + Rank Lock + Slow on the same AP bar.
- `WF-PRT-LATCH_GATE`, `WF-PRT-WAGER_GATE`, and `WF-PRT-PACT_GATE` are **forbidden** in dungeon, boss rush, and Death Realm. Rest / overworld only, and never the only portal.
- `applyPushback` / `applyAttract` exist in `occupancy.ts` but have **no spell caller**. Recoil / slide / trade / pit rooms below ship a **fallback** until `effectCategory` callers exist — they do not fake bash as “more Strike,” pits as lava, or Ley as Enrage.
- Ley Toll **does not ship** until `executeCastAttempt` / enemy decide debit MP. Until then ENC-LEY-01 / `FSN-LEY-SIP` **reroll** to `FSN-TIDE-LOCK` (do not fake prime with Enrage).
- Fan Bolt / Lock-Fan **do not ship** as a Chebyshev blob. Until `targeting.ts` reads `areaShape: "cone"`, ENC-FAN-01 uses a **painted 90° wedge** of floor cells (metadata `wedgeCells[]`) and skips Fan if fewer than two player-side bodies sit in it.
- Twin Gate pads must **not** reuse occupancy `portals`. Death-realm portal guards do **not** fire on pad enter.
- Do not pack `font_cantor` with `pale_cantor` as a PAIR (two heal sources). `FSN-WARD-MEND` / `FSN-QUIET-CHOIR` stay caster-heal; `FSN-FONT-IRON` is totem + tank.
- Do not pack `pawn_broker` with `rift_hook` as a PAIR (two swaps). `FSN-EMBER-RIFT` stays caster↔player.
- Do not pack `far_stinger` with `glass_sniper` as a PAIR without `share_optic`. `FSN-LENS-BATTERY` is the COURT that makes the grant readable.
- Do not pack `hex_teller` with `tax_scribe` as a PAIR (two AP engines).
- Crowd Press (`WF-ENV-CROWD_PRESS`) **skips** if the map would start with fewer than 3 living units so a press trio cannot exist. Isolation Chill (day-4) is the inverse and stays off this drop’s teaching ids.
- `FSN-TEMPO-CHOIR` still does **not** ship until ally `targetId` Tempo apply exists. `FSN-FOG-FUSE` still does **not** ship without a public wick tell under smoke. Wave-5 families (`gale_deacon`, `twin_sentry`, `pincer_acolyte`, …) wait for a later formation drop — this catalog does not mint colliding `FSN-*` ids for them.

---

## 3. Dungeon pacing (Ley / Fan / Pit / Font primer + inserts)

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

| Beat | Depth hint | Job | Day-6 IDs |
| :--- | :--- | :--- | :--- |
| Teach | 1 | One new verb (dump-tax glass, cheap-spell AP tax, current-MP spend) | ENC-TEACH-06, ENC-SPELL-11, ENC-HAZ-11 |
| Reinforce | 1–2 | Same verb, tighter or a second role | ENC-WAVE-07, ENC-AMBUSH-06 |
| Combine | 2–3 | Two taught verbs | ENC-HAZ-12, ENC-LEY-01, ENC-PIT-01, ENC-REINF-06, ENC-MOVE-10, ENC-FOOT-01 |
| Pressure | 3 | Cone, trade, recoil, font, pads, or press | ENC-SURV-11, ENC-FAN-01, ENC-TRADE-01, ENC-PROT-06, ENC-RECOIL-01, ENC-GATE-01, ENC-PRIO-08 |
| Choice / rest | mid | Heal vs blood-lock vs four-way branch vs vein | ENC-REST-06, ENC-BRANCH-06, ENC-TREAS-06, ENC-VEIN-01 |
| Mastery | 4 | Prove the verbs | ENC-ELITE-10, ENC-ELITE-11, ENC-RARE-06, ENC-MAST-06, ENC-LOCK-01, ENC-SLIDE-01, ENC-MERCY-01 |
| Boss | maxDepth | Capstone using the taught verb + one `BossId` | ENC-MINI-07, ENC-BOSS-06, ENC-RUSH-19…22 |

Day-1 Ash / Ice, day-2 Void, day-3 Hex, day-4 Tide / File / Clock, and day-5 Wick / Rime / Smoke / Plus chains remain valid. Day-6 **Ley / Fan / Pit / Font primer** is the default for accounts that already cleared those five once. Rare elite and treasure rooms **insert**; they do not replace a beat.

---

## 4. Encounter catalog

Every entry is `STATUS: PROPOSED`.

---

### ENC-TEACH-06

ENCOUNTER_ID: ENC-TEACH-06  
TYPE: teach mechanic / hazard  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× bishop (`starter-frost` only) + 1× pawn (`physical_attack` only). No elites, no families.  
AI_REQUIREMENTS: Bishop kites at Chebyshev ≥ 3. Pawn is a greedy charger. No LoS puzzle, no group-tactics, no lethal lookahead. `instantKill` / `betrayal` off. No bash / attract callers.  
SPELL_DISCOVERY_OPPORTUNITIES: None. This is a dump-tax lesson.  
MAP_REQUIREMENTS: Open court, one wide lane. Four to six `WF-HAZ-GLASS_SHARD` tiles on the **flank** (voluntary walk-on and ending a turn are **free**; occupying a shard because of **forced** movement costs 5% max HP). A clean-floor aisle of ≥ 1 tile exists. No lava/ice/spikes. No `paper_windstorm` (the tax is forced occupancy, not range). Player spawn on clean floor. One locked exit.  
SPECIAL_RULES: `scriptedHazardsOnly`. First **voluntary** stand on glass logs a teach line (“walk is free”). Do not also apply a pusher (that is ENC-RECOIL-01 / ENC-SLIDE-01). Do not mix flint (that is ENC-TEACH-05) or needle grass (that is ENC-HAZ-07).  
OBJECTIVE: Defeat both. Optional: never occupy glass via any forced cell.  
FAILURE_CONDITION: Player HP ≤ 0 (Death Realm). Challenge overlay does not fail the room.  
REWARD: Low-band victory XP (`level * 20` sum) + depth Doka via `applyRewards`. Easy overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “walking the glass is cover; a shove onto it is the tax.” Prepares ENC-SLIDE-01 / ENC-TRADE-01 (forced occupancy). Distinct from ENC-TEACH-03 (wind halves **range**), ENC-TEACH-04 (lancer only on **file**), and ENC-TEACH-05 (casting from **flint**).  
SOLVABILITY_REQUIREMENTS: Bishop reachable by walking; glass never walls a corridor; glass not on spawn±3 or the portal. Clean aisle reaches both units.  
REPLAYABILITY: Shard ribbon horizontal vs chevron. Pawn can sit on knight chassis at mid (still melee only, still no bash).  
SCALING_BEHAVIOUR: Do not raise levels. Mid: bishop gains `starter-poison`. High: replace the pawn with a `ROLE-WARDEN` rook that body-blocks the clean aisle (still no extra HP, still no push). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-HAZ-11

ENCOUNTER_ID: ENC-HAZ-11  
TYPE: hazard / teach → reinforce  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 2× pawn chargers + 1× `tide_shade` bishop (`starter-frost`).  
AI_REQUIREMENTS: Pawns start healthy so they may stand on a cog cell once; wounded pawns (`ENEMY_HAZARD_AVOID_HP_PCT`) refuse the **next** cog cell. Bishop kites from off-pair floor. One Slow **or** Frost, never both stacked past −2 with live tide melee.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional: winning without a cog tax can later hint `spell-haste` at rest (reminder, not a grant).  
MAP_REQUIREMENTS: One `WF-HAZ-RATCHET_COG` pair (two adjacent floor cells; the cog occupies one and swaps at each round start; landing costs 5% max HP). A path around the pair exists. Exit behind the bishop. Distinct from ENC-HAZ-08’s orbit cinder (4-tile square) and ENC-HAZ-09’s pendulum nave (5-tile reverse).  
SPECIAL_RULES: Scripted cog only. Do not mix orbit or pendulum on this id. Counts as 1 toward `MAX_HAZARD_TILES`. Tax via `recordInBattleChallengeDamage` while `inBattleRef`.  
OBJECTIVE: Clear all. Intended line: end on the cell it just left.  
FAILURE_CONDITION: Player death (frost + cog tax).  
REWARD: Standard. Overlay `under_50_damage` rewards never sharing the next pip.  
TACTICAL_PURPOSE: Teach “the pair flips; occupying the cell it just left is free, occupying the next cell is a tax.” Distinct from creeping ash (one-way) and pendulum (reverses a nave).  
SOLVABILITY_REQUIREMENTS: Path around the pair reaches both pawns and the bishop. Cog never covers spawn or the portal. Pair is floor, not a wall.  
REPLAYABILITY: Pair N-S vs E-W. Start cell A vs cell B.  
SCALING_BEHAVIOUR: Mid: add `swift_winds` (+2 MP) so the player *can* dash across both cells in one turn — the lesson is choosing not to. High: bishop gains `spell-slow`. Never thicken the pair into a wall. Never add a second cog.  
STATUS: PROPOSED

---

### ENC-HAZ-12

ENCOUNTER_ID: ENC-HAZ-12  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-LEY-SIP` — 1× `ROLE-LEY` bishop (`starter-frost`; Ley Toll **only if** MP debit exists) + 1× `ROLE-SIP` bishop (`starter-frost` + Soul Sip). No healer, no Slow, no Inferno, no `tide_shade` (would hide the steal). If Ley Toll cannot debit MP, **reroll this id** to ENC-HAZ-08 (`FSN-IRON-TIDE`) rather than fake prime with Enrage.  
AI_REQUIREMENTS: Siphon Sips if player current MP ≥ 2, else Frosts. Tollkeeper primes only if leftover MP still allows a 1-step **or** they do not need to walk this turn, then Frosts the primed charge. Hostiles start ≥ Chebyshev 4. Soph 1–2. No group-tactics.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Ley Toll or Soul Sip can drop that id if missing. Possession is not observation.  
MAP_REQUIREMENTS: `openField` / `arena`. Reject `corridorMaze`. Optional leftover 4 glass shards from ENC-TEACH-06 (`inheritHazardsFrom: ENC-TEACH-06`) **off** the only approach (dump tax is not this sheet’s pusher). No ice sheet on both approaches (ice + steal + prime is three MP stories). Time Warp **banned**.  
SPECIAL_RULES: Scripted hazards only. Random 30% family lottery **off**. If `DecideEnemyContext` has no `currentMp`, do not spawn this id.  
OBJECTIVE: Clear all. Intended line: dump walk MP before Sip init, then burst the glass Siphon.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Ley/Sip discovery. Overlay `under_8_ap_per_turn` is fair (the tax is MP, not AP).  
TACTICAL_PURPOSE: Combine current-MP spend and current-MP steal so “save 2 MP to close” is the wrong answer. Distinct from ENC-TAX-01 (zone AP) and ENC-RIME-01 (enter-file MP).  
SOLVABILITY_REQUIREMENTS: Both bishops have a retreat tile; 2-unit occupancy leaves walk-offs; glass leftover never walls a corridor.  
REPLAYABILITY: Siphon north vs east. High: convert to `FSN-LEY-COURT` (add Stinger) only after ENC-RECOIL-01.  
SCALING_BEHAVIOUR: High: elite Tollkeeper only (`FSN-LEY-SIP/E-TOLL`), Siphon stays junior. Peak: `FSN-LEY-COURT`. Never two MP elites. Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SPELL-11

ENCOUNTER_ID: ENC-SPELL-11  
TYPE: spell-discovery / teach mechanic  
RELATIVE_DIFFICULTY: TEACH  
ENEMY_COMPOSITION: 1× `ROLE-LEY` bishop (`starter-frost` + `spell-ley-toll` if MP debit exists; otherwise Frost-only and this id **converts** to ENC-SPELL-01). No Siphon (that is ENC-HAZ-12).  
AI_REQUIREMENTS: Caster kites ≥ 3. Primes only when `currentMp ≥ 2` **and** a damaging follow-up is ready. Skip prime as the last action if they still need to walk. No lookahead.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Ley Toll (use → observe → win → grant). If the player already owns Ley Toll, convert to ENC-LEY-01. Does not auto-upgrade and does not auto-bar-insert (max 8).  
MAP_REQUIREMENTS: Open court. No ice. No Time Warp. One locked exit.  
SPECIAL_RULES: Band 1 required. If MP debit is missing, do not fake Ley with Enrage — convert. Discovery does not persist `spellLevel*` except via `upgradeSpell` later at rest.  
OBJECTIVE: Defeat the bishop after seeing one prime. Optional: spend to 0 MP before the primed Frost.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Ley discovery. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Teach “2 current MP buys a 1.25× Frost; dumping MP or interrupting the follow-up is the answer.” Distinct from ENC-SPELL-05 (Enrage/Haste **ally buff**) and ENC-SPELL-09 (fuse occupancy).  
SOLVABILITY_REQUIREMENTS: Bishop reachable; a tile outside Frost range after a 1-step.  
REPLAYABILITY: Bishop north vs west.  
SCALING_BEHAVIOUR: Does not scale; it retires when Ley is owned (becomes ENC-LEY-01). Never add a Siphon on this teach id.  
STATUS: PROPOSED

---

### ENC-SPELL-12

ENCOUNTER_ID: ENC-SPELL-12  
TYPE: spell-discovery  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: 1× `ROLE-FAN` queen **without** heal (`starter-frost`; `spell-fan-bolt` at CELL+ **only** if a painted wedge exists) + 1× pawn charger. If `areaShape` is unread, Fan is a **painted `wedgeCells[]`** of floor (90°, radius 3) — not a Chebyshev blob. If the wedge cannot fit, convert to ENC-SPELL-11.  
AI_REQUIREMENTS: Fan only if **two** player-side bodies sit in the wedge; otherwise Frost. Hug (Chebyshev 0 from caster) is immune. Pawn greedy. No Inferno.  
SPELL_DISCOVERY_OPPORTUNITIES: Observe Fan Bolt (or the painted-wedge stand-in id). If already owned, convert to ENC-FAN-01.  
MAP_REQUIREMENTS: `openField` / `arena` with a 3-tile wedge from the queen’s start facing. Reject maps with no 3-tile wedge. Player spawn **off** the wedge. A hug tile adjacent to the queen exists.  
SPECIAL_RULES: Do not also spawn a second cone (`gale_deacon` / a second Fan). Do not pack with `FSN-LOCK-FAN` on this teach id.  
OBJECTIVE: Defeat both. Optional: hug the caster before the first Fan.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Fan discovery. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the wedge is 90°; hug and diagonals of the facing are safe.” Prepares ENC-FAN-01 / `FSN-LOCK-FAN`. Distinct from ENC-PLUS-01 (plus-arm **cross**, day-5).  
SOLVABILITY_REQUIREMENTS: Hug tile and at least one off-wedge walk-off; wedge never covers spawn or the portal.  
REPLAYABILITY: Facing east vs south.  
SCALING_BEHAVIOUR: Mid: add a player-side summon slot reminder (Fan wants two bodies — a Wisp makes the wedge legal). High: convert to ENC-FAN-01. Never Chebyshev Inferno.  
STATUS: PROPOSED

---

### ENC-WAVE-07

ENCOUNTER_ID: ENC-WAVE-07  
TYPE: waves  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Wave A: `FSN-LEY-SIP` (or `FSN-TIDE-LOCK` fallback). Wave B (when A is empty, portal still locked): `FSN-KICK-STING` — 1× `ROLE-RECOIL` knight + 1× `ROLE-STINGER` bishop (`minRange: 2`). Living + pending ≤ 4.  
AI_REQUIREMENTS: Wave A as ENC-HAZ-12. Wave B: Squire Back-Steps (self-push 2) if adjacent **and** dest is free, non-hazard, non-pit, non-portal; skip in a corner. Stinger Stings if Chebyshev ≥ 3, Frosts at 2, refuses at 1. Recoil dest must leave the player ≥ 1 escape tile. Until `applyPushback` has a spell caller, Back Step is a **scripted 2-step vacate** onto a painted dest (same occupancy rules) — not “more Strike.”  
SPELL_DISCOVERY_OPPORTUNITIES: Ley / Sip from wave A; Far Sting / Back Step from wave B.  
MAP_REQUIREMENTS: `openField` / `arena` with a **wide** sting lane and a corner the squire can be pinned into. Optional leftover glass from ENC-TEACH-06 **off** the recoil dest (do not make the only Back Step dump onto glass — that is ENC-SLIDE-01). `waveSpawnCells` far from spawn.  
SPECIAL_RULES: Portal locked until both waves empty (`holdPortalLocked`). Wave B does not spawn until A is dead. Family lottery off. Stinger is never the only body in a 1-pack.  
OBJECTIVE: Clear both waves. Intended line: dump MP on A, then close the Stinger (min-range 2) and pin the Squire in a corner.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discoveries. Overlay `under_15_turns` first clear; `under_10_turns` after.  
TACTICAL_PURPOSE: Reinforce “MP is a spend/steal” then introduce “close the tape / pin the kick.” Distinct from ENC-WAVE-05 (file) and ENC-WAVE-06 (wick → rime).  
SOLVABILITY_REQUIREMENTS: Wave B cells walk-reachable after A dies; recoil dests are floor; sting lane is ≥ 3 tiles wide; occupancy ≤ `MAX_ENEMIES`.  
REPLAYABILITY: Sting lane N-S vs E-W. High: wave B elite Stinger, Squire stays junior.  
SCALING_BEHAVIOUR: Peak: wave C `FSN-FONT-IRON` only if ENC-MERCY-01 was taught this account — still cap 2 summons, still one font. Never three waves of guns.  
STATUS: PROPOSED

---

### ENC-AMBUSH-06

ENCOUNTER_ID: ENC-AMBUSH-06  
TYPE: ambush  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Empty on entry. One visible `WF-TRP-SECOND_FOOT` plate in the mid-band. First occupancy arms (no tax). The **second** occupancy this map pays 8% max HP once, then the plate becomes floor **and** spawns 1× pawn + 1× `shadow_lurker` knight (`physical_attack` + `spell-shadow-veil` only; no Mark, no Sacrifice). If 2 spawn cells cannot fit under `MAX_ENEMIES`, skip the ambush and the plate still detonates (no soft-lock).  
AI_REQUIREMENTS: Pawn greedy. Lurker refuses frontals after Veil. No group-tactics. Reveal is `onSecondOccupancy` (explicit), not a name heuristic.  
SPELL_DISCOVERY_OPPORTUNITIES: None required. Optional Veil observe.  
MAP_REQUIREMENTS: Open floor, plate not on spawn±3 or portal. Two floor cells ≥ Chebyshev 4 from the player at detonation. No fog as concealment (plate is always visible). Distinct from ENC-AMBUSH-02 (glyph) and ENC-AMBUSH-05 (gnomon delay).  
SPECIAL_RULES: First print can be the player, a summon, or a shove. Intended line: spend the first print yourself, then do not step back. Portal locked while hostiles live.  
OBJECTIVE: Survive the second occupancy (or never take it) and clear any spawn.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “the first foot is free; the second pays and calls a hunt.” Distinct from hunt-lantern (MP spend calls) and delay-gnomon (clock).  
SOLVABILITY_REQUIREMENTS: Plate walkable before and after; ambush cells reachable; skip spawn if cap would break.  
REPLAYABILITY: Plate center vs side aisle. High: lurker gains Strike only (still no Mark).  
SCALING_BEHAVIOUR: Peak: convert detonation to ENC-FOOT-01 with a Recoil squire (forced second occupancy) only after ENC-RECOIL-01.  
STATUS: PROPOSED

---

### ENC-FOOT-01

ENCOUNTER_ID: ENC-FOOT-01  
TYPE: combine / trap  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-KICK-STING` on the board at start (not hidden). One `WF-TRP-SECOND_FOOT` on the **Stinger’s close tile** (the cell at range 1 the player wants).  
AI_REQUIREMENTS: Same as ENC-WAVE-07 wave B. Squire may Back-Step the player onto the armed plate (forced second occupancy). Until push callers exist, a **painted recoil dest** that is the plate is legal only if a walk-off remains.  
SPELL_DISCOVERY_OPPORTUNITIES: Far Sting / Back Step if missing.  
MAP_REQUIREMENTS: Wide sting lane. Plate is the hug cell in front of the Stinger. Glass leftover **off** that cell (do not double dump-tax).  
SPECIAL_RULES: Combine ENC-AMBUSH-06’s print with ENC-RECOIL-01’s kick. Portal locked until clear.  
OBJECTIVE: Clear both. Intended line: spend the first print with a summon or a side-step, then close.  
FAILURE_CONDITION: Player death (Sting + second-foot tax).  
REWARD: Standard. Overlay `no_healing`.  
TACTICAL_PURPOSE: Combine “first foot free” with “the kick writes the second occupancy.” Distinct from ENC-FUSE-01 (kamikaze pull) and ENC-SLAM-01 (attract then push).  
SOLVABILITY_REQUIREMENTS: A path to the Stinger that never needs the plate; plate not a cut-vertex.  
REPLAYABILITY: Plate on the north hug vs east hug.  
SCALING_BEHAVIOUR: High: convert to `FSN-RECOIL-HUNT` (add Sidestep Warder) only after ENC-ELITE-11. Still one plate.  
STATUS: PROPOSED

---

### ENC-REINF-06

ENCOUNTER_ID: ENC-REINF-06  
TYPE: reinforcements  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Start: `FSN-FONT-IRON` — 1× `ROLE-FONT` king (`spell-mercy-font` family-flip for this id only; **no** `healAmount` on CORE) + 1× `iron_golem` tank (Strike; Iron Skin at band 1). Reinforcement: when the font is planted (`onFontPlanted`, explicit), spawn at most 1× pawn charger from a far cell if living + pending ≤ 3. The font body is a summon (`mp: 0`, **must not path**, pulse 8 ally heal range 2, lifespan 4). Cap one font; no wolf/archer/pylon/turret overlay on that king.  
AI_REQUIREMENTS: Font `isSummoner` for the font id only. Golem holds a wide lane. Pawn greedy. `inferArchetype` must **not** see `healAmount` on the king. Pulse **does** trip `no_healing` / challenge heal-used. 0 XP on font death.  
SPELL_DISCOVERY_OPPORTUNITIES: Observing Mercy Font can drop that id if missing. Pulse is the observe, not the plant.  
MAP_REQUIREMENTS: `openField` / `arena`. Reject 1-tile closets (font weight 0 there). Optional `WF-TER-SANDBAG` on a side aisle (LoS-open walk-block) so the player can shoot the font through cover.  
SPECIAL_RULES: Distinct from ENC-REINF-03 (kennel on-expose) and ENC-REINF-05 (stack-cash). Do not pair with `pale_cantor`. Portal locked until king, golem, pawn, **and** font are gone. Font counts toward `ENEMY_SUMMON_CAP`.  
OBJECTIVE: Clear all. Intended line: kill the font (or the king before plant), then the golem is `FSN-IRON-BATTERY` minus the gun.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + font discovery. Overlay `direct_hit` (plant is not a heal; pulse is).  
TACTICAL_PURPOSE: Kennel-as-totem: a stationary heal engine you can shoot through a sandbag. Distinct from ENC-FONT-01 (occupy **veil** to break linear, day-5) and ENC-PROT-02 (shrine HP).  
SOLVABILITY_REQUIREMENTS: Path to the king that does not require standing in pulse range; sandbag is not a cut-vertex; skip sandbag if solvability fails with it intact.  
REPLAYABILITY: Font plant north vs east. High: convert to `FSN-FONT-GATE` (add warden) after ENC-GATE-01.  
SCALING_BEHAVIOUR: Peak: still one font. Never add a second pulse engine.  
STATUS: PROPOSED

---

### ENC-SURV-11

ENCOUNTER_ID: ENC-SURV-11  
TYPE: survival  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 2× pawn chargers + 1× `tide_shade` bishop (`starter-frost`). No elites.  
AI_REQUIREMENTS: Pawns greedy. Bishop kites. They **want** to end overlapping the player’s radius-2 (Crowd Press). Wounded units may break clump.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Arena. `WF-ENV-CROWD_PRESS` **on** (end of each combatant turn: if two or more **other** living units are within 2 Chebyshev, they pay 3% max HP). Skip this id if the map would start with fewer than 3 living units. Optional leftover cog from ENC-HAZ-11 off the only aisle. Distinct from ENC-SURV-08 (isolation chill — inverse).  
SPECIAL_RULES: Clock: survive **6** player turns **or** clear all, whichever first. `holdPortalLocked` until the clock ends even if the board is empty early (flee remnants). Tax via `recordInBattleChallengeDamage`. Summons count as living units.  
OBJECTIVE: Be alive when the clock ends, or clear. Intended line: kite so at most one other body is in your ring.  
FAILURE_CONDITION: Player death (frost + press). Clock expiry with the player alive is **success**.  
REWARD: Survival table via `applyRewards`. Overlay `no_healing` (not `no_damage_taken` — press will chip).  
TACTICAL_PURPOSE: Pressure beat — a **clump tax**, not a shrinking void (ENC-SURV-03), not creeping ash (ENC-SURV-05), not isolation (ENC-SURV-08).  
SOLVABILITY_REQUIREMENTS: Walkable ring; press is not a wall; spawn not in a 3-body clump at t=0.  
REPLAYABILITY: Bishop north vs east.  
SCALING_BEHAVIOUR: Peak: ENC-SURV-12 (press + thin air). Never add `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-SURV-12

ENCOUNTER_ID: ENC-SURV-12  
TYPE: survival  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Wave A = ENC-SURV-11 pack. Wave B at player turn 3: 1× `ROLE-STINGER` bishop (Frost only if Far Sting is missing). Living + pending ≤ 4.  
AI_REQUIREMENTS: As ENC-SURV-11 plus Stinger min-range kite.  
SPELL_DISCOVERY_OPPORTUNITIES: Far Sting if missing.  
MAP_REQUIREMENTS: Same as ENC-SURV-11 plus `WF-MOD-THIN_AIR` **on** (spells with `apCost === 1` cost 2 AP; 0-cost and 2+ unchanged; Attack Nearest and summons are not spells). Do not also apply `WF-MOD-HEAVY_INCANT` (double tax).  
SPECIAL_RULES: Clock 8 turns. Thin Air reads `SpellConfig.apCost` only — never the spell name.  
OBJECTIVE: Survive the clock or clear. Intended line: Attack Nearest / 2-AP kits, kite the press.  
FAILURE_CONDITION: Player death.  
REWARD: Higher survival table than ENC-SURV-11.  
TACTICAL_PURPOSE: Peak pressure that spends leftover `thin_air` so late-game maps are not “crowd press again” or “heavy incant again.”  
SOLVABILITY_REQUIREMENTS: Melee and 2+ AP kits remain usable; press skip-rule still applies.  
REPLAYABILITY: Thin Air vs leftover `arcane_surge` (AP −1, min 1) for accounts that already paid 1→2 this week — never both.  
SCALING_BEHAVIOUR: Overlap timing (wave B at 3 vs 4) is the scaler.  
STATUS: PROPOSED

---

### ENC-LEY-01

ENCOUNTER_ID: ENC-LEY-01  
TYPE: elite / priority-target (MP exam)  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LEY-COURT` — Tollkeeper + Siphon + Stinger. If MP debit is missing, **reroll** to ENC-ELITE-06 (`FSN-FILE-GUARD`). If the account has not answered ENC-HAZ-12, use `FSN-LEY-SIP` PAIR instead.  
AI_REQUIREMENTS: As ENC-HAZ-12 plus Stinger min-range. Soph 3–4. Backline guard: Siphon idle steps to cover the Tollkeeper (`AI_BACKLINE_GUARD_DISTANCE`). Lethal lookahead off until PEAK.  
SPELL_DISCOVERY_OPPORTUNITIES: Ley / Sip / Far Sting if missing.  
MAP_REQUIREMENTS: Wide arena, sting lane, no Time Warp, no ice on both approaches. Optional glass leftover off recoil (no Recoil on this sheet).  
SPECIAL_RULES: Unlock after ENC-SPELL-11 **or** ENC-HAZ-12. Family lottery off. One Slow source: **none** (Frost only).  
OBJECTIVE: Clear all. Intended line: dump MP, collapse Siphon, then close the Stinger.  
FAILURE_CONDITION: Player death.  
REWARD: High-band XP/Doka via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of current-MP as two axes (spend + steal) plus a distance gun. Distinct from ENC-ELITE-04 (Enrage pair) and ENC-TAX-01 (tile gravity).  
SOLVABILITY_REQUIREMENTS: Three walk-offs; sting lane ≥ 3 wide; start spacing ≥ 4.  
REPLAYABILITY: Stinger file N-S vs E-W.  
SCALING_BEHAVIOUR: Peak: elite Tollkeeper only. Never add Hex Teller (two AP/MP engines).  
STATUS: PROPOSED

---

### ENC-FAN-01

ENCOUNTER_ID: ENC-FAN-01  
TYPE: elite / hazard geometry  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LOCK-FAN` CELL — 1× `ROLE-LOCK` rook (`spell-rank-lock` + Frost; 0 damage on the lock) + 1× `ROLE-FAN` queen without heal (Frost + Fan Bolt / painted wedge). No Root on the base sheet (Root + Lock + Slow is banned). If cone reader is missing, use `wedgeCells[]`. If Rank Lock apply is missing, Fan-only with a **painted file** the rook body-blocks (fallback, still not a sponge).  
AI_REQUIREMENTS: Lock skips if already locked or the player is on a 1-tile dead-end. Fan skips without two bodies in the wedge. Forced movement (Swap / Back Step / Twin Gate) still works through a lock. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Rank Lock / Fan Bolt if missing.  
MAP_REQUIREMENTS: `chessboard` / `fortress` with one 4-tile file **and** a 3-tile wedge. Reject 1-tile tunnels. Player spawn off-file and off-wedge.  
SPECIAL_RULES: Never lock the player onto a dead-end. Never pit **and** lock on this CELL (that is ENC-PIT-01). Time Warp banned.  
OBJECTIVE: Clear both. Intended line: walk off-axis, hug the Fan.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discoveries. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Teach “the lock rewrites **walk**; the wedge rewrites **where you stand**.” Distinct from ENC-TEACH-04 (lancer skip off-file) and ENC-PLUS-01 (plus-arm).  
SOLVABILITY_REQUIREMENTS: Off-axis gallery exists; hug tile exists; lock duration 2 turns; player keeps ≥ 1 escape tile.  
REPLAYABILITY: Locked file N-S vs E-W; wedge facing east vs south.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-FAN-FILE` CADRE (add Root) only after ENC-PIT-01. Still one Slow/Root source.  
STATUS: PROPOSED

---

### ENC-TRADE-01

ENCOUNTER_ID: ENC-TRADE-01  
TYPE: displacement / priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-TRADE-HOLE` — 1× `ROLE-BROKER` king/queen without heal (`spell-pawn-trade`, Frost; **0 damage** on the trade; **no** `isSwap`) + 1× `ROLE-PIT` rook (`spell-open-pit`, Strike; **0 HP** on the paint). Optional 1× pawn if BRIGADE. If Trade apply is missing, Broker Frosts only and this id **converts** to ENC-PIT-01.  
AI_REQUIREMENTS: Broker skips if only one player-side body **or** if the swap is safer for the player. Never trade onto lava / the last exit / a pit. Pit-mason pits a melee approach; occupant at paint is **not** displaced; LoS stays open. Never pit both walk-offs. Never pit the only tile that reaches the Broker. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Pawn Trade / Open Pit if missing.  
MAP_REQUIREMENTS: `openField` with ≥ 2 walk-offs that are not hazard, void, portal, barrier, live fuse, or pit. Optional glass leftover as a **illegal** trade dest (AI must skip it).  
SPECIAL_RULES: Isolate (desummon) is a complete answer. Do not pack with `rift_hook`. Hazard on a legal landing must tick. Portal locked until clear.  
OBJECTIVE: Clear all. Intended line: desummon or stand so the only swap dumps the Broker’s pit onto themselves (they skip).  
FAILURE_CONDITION: Player death.  
REWARD: Standard + discoveries. Overlay `no_healing`.  
TACTICAL_PURPOSE: “Two **player-side** bodies swap; the caster stays. Isolate.” Distinct from ENC-DISP-01 (Swap telegraph, day-2) and ENC-GATE-01 (walkable pads).  
SOLVABILITY_REQUIREMENTS: ≥ 2 walk-offs; pit never seals spawn→exit; Broker reachable after isolate.  
REPLAYABILITY: Pit on north approach vs east. High: convert to `FSN-TRADE-TRAP` (add fuse) only after ENC-WICK-01 was answered this account.  
SCALING_BEHAVIOUR: Peak: still one Broker. Never two swap engines.  
STATUS: PROPOSED

---

### ENC-RECOIL-01

ENCOUNTER_ID: ENC-RECOIL-01  
TYPE: elite / movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-KICK-STING` PAIR.  
AI_REQUIREMENTS: As ENC-WAVE-07 wave B. Corner = 0 Back Step. Sets `movedThisTurn` (prepares ENC-GATE-01’s Stride Brand).  
SPELL_DISCOVERY_OPPORTUNITIES: Back Step / Far Sting.  
MAP_REQUIREMENTS: Wide sting lane **and** one painted corner. Optional `WF-HAZ-GLASS_SHARD` on a **side** dest the Squire will **skip** (illegal dump) so the legal dest is readable.  
SPECIAL_RULES: Until push callers exist, scripted 2-step vacate onto a painted dest. Not “more Strike.”  
OBJECTIVE: Clear both. Intended line: close the Stinger, pin the Squire in the corner.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_15_turns`.  
TACTICAL_PURPOSE: Self-knockback as **the** verb. Distinct from ENC-SLAM-01 (they-push) and ENC-SLIDE-01 (tile conveyor).  
SOLVABILITY_REQUIREMENTS: Corner exists; legal dest is floor; sting min-range 2 has a hug tile.  
REPLAYABILITY: Corner SW vs SE.  
SCALING_BEHAVIOUR: High: `FSN-RECOIL-HUNT` (add Sidestep) after one clear. Peak: `FSN-PUSH-SCHOOL` only after ENC-PIT-01 (self-push + they-push + pit — three displacement stories; skip if occupancy callers missing).  
STATUS: PROPOSED

---

### ENC-PIT-01

ENCOUNTER_ID: ENC-PIT-01  
TYPE: hazard / movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: `FSN-PIT-RANK` — 1× `ROLE-PIT` rook + 1× `ROLE-LANCER` rook (Strike only on a shared file/rank, same contract as ENC-TEACH-04). No Lock on this PAIR (that is ENC-FAN-01).  
AI_REQUIREMENTS: Lancer skips off-file. Pit-mason paints one melee approach; LoS **open**; occupant stays. Never pit both walk-offs. Teleport / Mist Step over works. Soph 1–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Open Pit if missing. File-thrust reminder at rest, not a grant.  
MAP_REQUIREMENTS: `chessboard` / `fortress` with a 4-tile file **plus** a gallery. One pit cell on the file’s melee approach. Optional `WF-TER-SANDBAG` on the gallery (LoS-open cover) — skip if it would be a cut-vertex.  
SPECIAL_RULES: Pit is battle-time paint, not a generated wall. `finalizePlayableLayout` still owns the map. Distinct from ENC-HAZ-02 (lava stones) and ENC-MOVE-04 (fallen gate wait).  
OBJECTIVE: Clear both. Intended line: leave the file (ENC-TEACH-04 verb) so the pit is a hole you can shoot through.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Walk-block with LoS open + file skip. Prepares Table D `D0` (fuses off the locked file) without Wave-6 bosses.  
SOLVABILITY_REQUIREMENTS: Gallery reaches the lancer; pit not on spawn/portal; sandbag skip-rule.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: High: add `FSN-TRADE-HOLE` conversion only after ENC-TRADE-01. Never pit the only tile that reaches the backliner.  
STATUS: PROPOSED

---

### ENC-PROT-06

ENCOUNTER_ID: ENC-PROT-06  
TYPE: protection  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: 1× `ROLE-STINGER` bishop (Far Sting / Frost) + 1× pawn charger. One `WF-ZON-KEEN_EDGE` grindstone in the mid-band. Optional `WF-TER-SANDBAG` on the sting file (LoS open).  
AI_REQUIREMENTS: Stinger min-range kite. Pawn tries to occupy Keen Edge if the player holds it (contest). No healer.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Wide lane. Keen Edge walkable, not on spawn/portals. Sandbag skip if solvability fails.  
SPECIAL_RULES: The grindstone is a tile, not an allied token (distinct from ENC-PROT-01 walking ward, ENC-PROT-02 shrine HP, ENC-PROT-03 ward circle, ENC-PROT-05 veil font). While a unit occupies it, Attack Nearest deals +15% of the **already-computed** hit (after RES/SR) — it does not replace `combatMath`. Spells unchanged. The player does **not** fail if they never stand on it — holding it is the intended line. Optional fail-if-unheld-4-turns is **off** unless a later human asks (that would clone ENC-HOLD-01). Portal unlocks when hostiles are dead.  
OBJECTIVE: Defeat both. Intended line: hold Keen Edge and Attack Nearest the Stinger through the sandbag.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Contest a **basic-attack** plant, not a heal shrine and not a linear veil. Distinct from ENC-EDGE as a rest chrome.  
SOLVABILITY_REQUIREMENTS: Exit reachable without the grindstone; Stinger reachable by walking the gallery; bonus never a wall.  
REPLAYABILITY: Edge north vs east. High: pawn becomes `ROLE-WARDEN`.  
SCALING_BEHAVIOUR: Peak: add Thin Air so 1-AP spells cost 2 — Attack Nearest is the intended tool. Never both Thin Air and Heavy Incant.  
STATUS: PROPOSED

---

### ENC-PRIO-08

ENCOUNTER_ID: ENC-PRIO-08  
TYPE: priority-target  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LEY-SIP` plus a **decoy chrome** pawn in a side stall (`decoyId` / `realId` explicit — the pawn is **not** a second Siphon). The real Siphon is the glass bishop. Distinct from ENC-PRIO-04 (decoy **king**).  
AI_REQUIREMENTS: As ENC-HAZ-12. Decoy pawn greedy, no MP kit. If the player kills the decoy first, the Siphon Enrages **once** (`onAllyDeath: enrage`, explicit — teach Table D leftover checks without Surplus Auditor).  
SPELL_DISCOVERY_OPPORTUNITIES: Ley / Sip.  
MAP_REQUIREMENTS: Arena + one side stall highlighted. No Time Warp.  
SPECIAL_RULES: Unlock after ENC-HAZ-12. Stall is chrome, not a new boss.  
OBJECTIVE: Kill the real Siphon first. Clearing the decoy first is legal but harder.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Priority on the **steal**, not the prime and not a disguised king. Prepares ENC-RUSH-20’s “spell the real body.”  
SOLVABILITY_REQUIREMENTS: Both bishops and the pawn reachable; stall not a sealed pocket.  
REPLAYABILITY: Stall west vs east.  
SCALING_BEHAVIOUR: Peak: convert to `FSN-LEY-COURT` (real Stinger, still one decoy pawn). Never a dual-boss.  
STATUS: PROPOSED

---

### ENC-MOVE-10

ENCOUNTER_ID: ENC-MOVE-10  
TYPE: movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× pawn on the **long** path + 1× bishop (`starter-frost`) behind the slab.  
AI_REQUIREMENTS: Pawn camps the long path. Bishop kites from the currently open slab’s far side.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: `WF-OBS-SHIFT_SLAB` — two painted adjacent short-path cells; exactly one is wall, the other floor; they swap at round start; a pip shows which is open. Place only when spawn→portal remains with cell A walled **AND** with cell B walled. Never the only exit. An always-open long path exists. Distinct from ENC-MOVE-04 (fallen gate 2-round), ENC-MOVE-05 (tide door odd/even), ENC-MOVE-08 (hourglass 3-round).  
SPECIAL_RULES: No damage. Wall occupancy on the shut cell. Clock is the pip, not a turn skip.  
OBJECTIVE: Reach and defeat both. Intended line: cross on the open slab or spend MP on the long path.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Teach “wait one round vs the long path.” Distinct from ENC-TOLL-01 (pay Doka) and ENC-PIN-01 (plant/recall).  
SOLVABILITY_REQUIREMENTS: Solvable with A walled and with B walled; never both open or both shut; long path walkable.  
REPLAYABILITY: Slab on north short vs east short.  
SCALING_BEHAVIOUR: High: ENC-MOVE-11 (recall pin) as the next beat. Never add a second slab pair.  
STATUS: PROPOSED

---

### ENC-MOVE-11

ENCOUNTER_ID: ENC-MOVE-11  
TYPE: movement  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: 1× `ROLE-STINGER` (or Frost bishop) on the far side of a chokepoint + 1× pawn on the pin-stone.  
AI_REQUIREMENTS: Pawn occupies the stone if the player plants (contest the recall). Stinger kites.  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: One `WF-TEL-RECALL_PIN` (adjacent 1 AP plants a mark on your current cell; later, entering the stone for 1 MP exits at your pin; if occupied, travelers swap; entering with no pin spends nothing). Floor, not on spawn/portals. Map solvable without using it. Distinct from ENC-DISP-01 (Swap spell) and ENC-GATE-01 (two pads).  
SPECIAL_RULES: Plant is 1 AP, recall is 1 MP only if a pin exists. Occupancy swap. Not a teleport **spell** — do not key off `effectCategory`. Death-realm guards do not fire. Optional leftover glass on a **bad** pin cell so planting next to shards is a readable mistake.  
OBJECTIVE: Clear both. Optional: plant on a safe cell, fight, recall out.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: “1 AP to mark a cell worth returning to.” Distinct from Twin Gate (two walkable pads, no AP plant).  
SOLVABILITY_REQUIREMENTS: Recall stays on the walkable graph; stone optional.  
REPLAYABILITY: Stone west vs south.  
SCALING_BEHAVIOUR: High: pawn becomes Recoil squire (can kick you off your pin). Peak: convert to ENC-GATE-01.  
STATUS: PROPOSED

---

### ENC-GATE-01

ENCOUNTER_ID: ENC-GATE-01  
TYPE: movement / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-GATE-COURT` lite — 1× `ROLE-PORTER` bishop (`spell-twin-gate` + Frost; **0 damage** on the plant) + 1× `ROLE-SLIDE` queen/bishop (`spell-slide-tile` + Frost; **0 HP** on the paint) + optional 1× `ROLE-STRIDE` knight at CADRE. If pad apply is missing, Porter Frosts only and this id **converts** to ENC-MOVE-11.  
AI_REQUIREMENTS: Porter plants pad B behind self if kiting; skip if dest is adjacent to the player (they will use it); never reuse occupancy `portals`. Slide skips no-op dirs; standing at paint does **not** slide; dest must leave a walk-off; one slide per cell; no bounce-loop; sets `movedThisTurn`. Stride Brand only if `movedThisTurn` is **public**; skip if they camped. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Twin Gate / Slide Tile / Stride Brand if missing.  
MAP_REQUIREMENTS: `openField` with room for two pads ≥ 3 apart, not on spawn/portal. Optional leftover shift-slab as a **third** wait-verb — skip if the player has not answered ENC-MOVE-10 (too many clocks).  
SPECIAL_RULES: Pads are a new `gatePads` table. Barrier replaces a pad. Enter teleports once per event. Do not pack Porter with `mist_walker`.  
OBJECTIVE: Clear all. Intended line: barrier or occupy pad B; camp so Stride Brand fizzles; stand beside the slide, do not enter.  
FAILURE_CONDITION: Player death.  
REWARD: High-band. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Pads ≠ portals; slide ≠ pit; brand ≠ haste. The Gate Court exam. Distinct from ENC-FONT-01 (veil occupy) and ENC-LEASH-01 (wander ring).  
SOLVABILITY_REQUIREMENTS: Map solvable with both pads ignored; slide dests are floor; no pad on the only exit.  
REPLAYABILITY: Pad pair N-S vs E-W.  
SCALING_BEHAVIOUR: Peak: full CADRE with Stride. Never two self-teleports.  
STATUS: PROPOSED

---

### ENC-SLIDE-01

ENCOUNTER_ID: ENC-SLIDE-01  
TYPE: hazard / combine  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-SLIDE-BASH` — 1× `ROLE-SLIDE` + 1× `ROLE-PUSHER` (`bash_bruiser` kit: Strike; push 1 if `applyPushback` caller exists, else **reroll** to ENC-TEACH-06 + a warden).  
AI_REQUIREMENTS: Slide as ENC-GATE-01. Pusher only if dest is free, non-hazard unless the dest is **scripted glass** (the combine: they-push onto `WF-HAZ-GLASS_SHARD`). Skip if dest would be the last exit. Soph 2–3.  
SPELL_DISCOVERY_OPPORTUNITIES: Slide Tile if missing.  
MAP_REQUIREMENTS: Conveyor of 3 painted slide cells + a glass dump at the far end. A walk-around exists. Distinct from ENC-HAZ-05 (salt hop) and ENC-WICK-01 (occupancy fuse).  
SPECIAL_RULES: Enter → push 1 along stored dir. Standing at paint is free (teach line). Glass tax only on **forced** occupancy. If bash caller is missing, the Slide alone plus glass is still a legal CELL — do not fake bash as Strike.  
OBJECTIVE: Clear all. Intended line: walk around, or enter so the dump hits the pusher.  
FAILURE_CONDITION: Player death.  
REWARD: Standard. Overlay `under_50_damage`.  
TACTICAL_PURPOSE: Combine ENC-TEACH-06’s dump-tax with a conveyor. Distinct from ENC-RECOIL-01 (self-push).  
SOLVABILITY_REQUIREMENTS: Walk-around reaches both; glass not a wall; dests leave a walk-off.  
REPLAYABILITY: Dir east vs south.  
SCALING_BEHAVIOUR: Peak: `FSN-PUSH-SCHOOL` after ENC-PIT-01. Skip the CADRE if occupancy callers missing.  
STATUS: PROPOSED

---

### ENC-LOCK-01

ENCOUNTER_ID: ENC-LOCK-01  
TYPE: mastery / movement  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FAN-FILE` CADRE lite — Lock + Fan + optional Root (`snare_weaver`) only if ENC-PIT-01 was answered. If Root would stack with Lock on the same AP bar as Slow, **drop Root**.  
AI_REQUIREMENTS: As ENC-FAN-01 plus Root skip-if-already-locked. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Rank Lock / Fan / Root if missing.  
MAP_REQUIREMENTS: Chessboard with gallery. Optional leftover pit from ENC-PIT-01 (`inheritHazardsFrom`) **off** the locked file (Table D `D0` chrome: hazards never on the locked file).  
SPECIAL_RULES: Unlock after ENC-FAN-01. Fuses (if inherited from a Wick-mixed account) **never** paint the locked file.  
OBJECTIVE: Clear all. Intended line: walk the gallery; hug the Fan; shoot through a pit.  
FAILURE_CONDITION: Player death.  
REWARD: High-band. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Mastery of axis curfew + cone. Prepares ENC-RUSH-19 without Wave-6 ids.  
SOLVABILITY_REQUIREMENTS: Gallery exists; lock cannot seal spawn; inherited pits off the file.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Peak: still one Lock. Never Lock + Fosse/Hex/Palisade (Rush law).  
STATUS: PROPOSED

---

### ENC-MERCY-01

ENCOUNTER_ID: ENC-MERCY-01  
TYPE: elite / protection (inverted)  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-FONT-GATE` — Font king + Warden + Golem. One font, no second pulse engine.  
AI_REQUIREMENTS: As ENC-REINF-06 plus Warden body-blocks for the font. Soph 3–4.  
SPELL_DISCOVERY_OPPORTUNITIES: Mercy Font if missing.  
MAP_REQUIREMENTS: Arena + optional sandbag LoS cover. Reject closets.  
SPECIAL_RULES: Unlock after ENC-REINF-06. `no_healing` overlay trips on **pulse**, not plant. Do not pair with Archbishop / Lament (Rush D2 law, two heal engines).  
OBJECTIVE: Clear all. Intended line: shoot the font through the sandbag, then the tank is a softer `FSN-IRON-BATTERY`.  
FAILURE_CONDITION: Player death.  
REWARD: High-band. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Totem exam. Distinct from ENC-FONT-01 (player occupies a veil) and ENC-PROT-06 (player occupies Keen Edge). Here the **enemy** font is the thing you delete.  
SOLVABILITY_REQUIREMENTS: LoS to font without standing in pulse range 2; one font cap.  
REPLAYABILITY: Plant cell N vs E.  
SCALING_BEHAVIOUR: Peak: still one font. Never add `pale_cantor`.  
STATUS: PROPOSED

---

### ENC-ELITE-10

ENCOUNTER_ID: ENC-ELITE-10  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LEY-COURT` with elite tag on the Tollkeeper only (`variant: elite`).  
AI_REQUIREMENTS: As ENC-LEY-01. Soph 4–6. Lethal lookahead on the primed Frost only.  
SPELL_DISCOVERY_OPPORTUNITIES: Ley / Sip / Sting.  
MAP_REQUIREMENTS: As ENC-LEY-01. Optional `WF-MOD-THIN_AIR` **off** unless ENC-SURV-12 already taught it this run (do not surprise 1→2 AP on the MP exam).  
SPECIAL_RULES: Until ally-buff apply is honest this is still legal (no Enrage). Until MP debit exists, **do not ship** — fall back to ENC-ELITE-06.  
OBJECTIVE: Clear all.  
FAILURE_CONDITION: Player death.  
REWARD: Elite table via `applyRewards` (1.35× on `level * 20` XP). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Named drop-5 BRIGADE as a room. Distinct from ENC-ELITE-08 (fuse + bash) and ENC-ELITE-06 (file guard).  
SOLVABILITY_REQUIREMENTS: Same as ENC-LEY-01.  
REPLAYABILITY: Facing.  
SCALING_BEHAVIOUR: Promote only by converting to ENC-RARE-06 (`FSN-LENS-BATTERY`), never by adding HP.  
STATUS: PROPOSED

---

### ENC-ELITE-11

ENCOUNTER_ID: ENC-ELITE-11  
TYPE: elite encounter  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-RECOIL-HUNT` — Recoil + Stinger + Sidestep Warder (`spell-sidestep-ward`: next damaging instance vs this unit **misses**; timeout 2; AoE first instance misses, second hits; Slow/Barrier/Swap do not consume; lava/spikes do not consume). Do **not** also grant Surplus Ward (two evades).  
AI_REQUIREMENTS: Sidestep if player adjacent and can Strike; skip if already charged. 0-damage control does not consume. Soph 4–6.  
SPELL_DISCOVERY_OPPORTUNITIES: Sidestep Ward / Back Step / Far Sting.  
MAP_REQUIREMENTS: Wide lane + a corner. Optional leftover second-foot plate from ENC-FOOT-01 off the hug cell.  
SPECIAL_RULES: Unlock after ENC-RECOIL-01. Do not pack with `surplus_warder`.  
OBJECTIVE: Clear all. Intended line: 0-damage control to consume? No — Slow does **not** consume; spend a second damaging instance (AoE or a follow-up Strike).  
FAILURE_CONDITION: Player death.  
REWARD: Elite table. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Evade as **one miss**, not absorb, not Surplus leftover-AP. Distinct from ENC-ELITE-09 (plus-arm gun).  
SOLVABILITY_REQUIREMENTS: Second damaging instance is possible the same turn or next (AP remaining or Attack Nearest).  
REPLAYABILITY: Warder on north vs south flank.  
SCALING_BEHAVIOUR: Peak: `FSN-EVADE-GOAD` only after a Goad room exists (day-5 ENC-RUSH-18 / ENC-LEASH-01 taught taunt). Skip if `tauntCasterId` missing.  
STATUS: PROPOSED

---

### ENC-RARE-06

ENCOUNTER_ID: ENC-RARE-06  
TYPE: rare elite room  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Full `FSN-LENS-BATTERY` (Share Optic + two guns, leader) **or**, if the account has not answered ENC-ELITE-11 / ENC-FAN-01, leftover drop-4 `FSN-ICE-FILE` (rime + lancer + root) **or** `FSN-SMOKE-HUNT`. Rare elite tag on the Share body only (`variant: rare_elite`). Isolated 1v1 **rerolls** Share — this room must spawn ≥ 2 guns. Do not pack `far_stinger` + `glass_sniper` without Share.  
AI_REQUIREMENTS: Share the ally with the longest `modifiableRange` id; skip duplicate. Leader boost 10% per fallen non-leader (CADRE+). Soph 6–8. `instantKill` / `betrayal` off.  
SPELL_DISCOVERY_OPPORTUNITIES: Lens Share if missing.  
MAP_REQUIREMENTS: `openField` / `chessboard`. Purple portal chrome only after clear. No Inferno on this sheet. No Glass Realm.  
SPECIAL_RULES: Death is a normal death (full penalty). Do not pair with ENC-TREAS-06 by default. Insert 8% on depth 4; does not replace mastery. `FSN-TEMPO-CHOIR` / `FSN-FOG-FUSE` still gated. `FSN-RIFT-KNOT` may replace Lens if the account has never seen displacement CADRE and ally-Swap apply exists — otherwise skip Knot.  
OBJECTIVE: Clear all. Intended line: isolate 1v1 (Share rerolls off), or kill Share first so the two guns are a softer `FSN-GLASS-WARD`.  
FAILURE_CONDITION: Player death.  
REWARD: Rare table (1.60×). Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: COURT as a rare insert. Distinct from ENC-RARE-05 (wick court / smoke glass) and ENC-RARE-04 (bell court).  
SOLVABILITY_REQUIREMENTS: ≥ 2 guns; Share isolated-1v1 reroll; start spacing ≥ 4; occupancy well under cap.  
REPLAYABILITY: Lens vs Ice-File vs Smoke-Hunt skin by remembered branch.  
SCALING_BEHAVIOUR: Do not add a fourth body. `/HEX` variant only after Hex Teller is a known rest reminder — COURT, not a teaching pair.  
STATUS: PROPOSED

---

### ENC-TREAS-06

ENCOUNTER_ID: ENC-TREAS-06  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Empty on entry. Two **devices**, not three chests (distinct from ENC-TREAS-02) and not ENC-TREAS-05’s wait-chest:

1. `WF-TRS-BLOOD_LOCK` — 1 AP adjacent plus 5% max HP opens a **sure** hard `applyRewards` grant; no guardian; no coin-flip.
2. `WF-EVT-FIRST_BLOOD` overlay — this map only: if the first HP debit is suffered by an **enemy**, the next `applyRewards` uses the hard multiplier; if the player or a player-side summon takes the first debit, that credit is unchanged.

Optional third: `WF-INV-MIRROR_HOST` tether (exploration: skip; dungeon: required for map-clear). Out of battle, player HP spends also wound the host by the same % max. Touch starts a normal battle at remaining HP. Victory pays hard if the host was above 50% at contact.  
AI_REQUIREMENTS: None on the chest. Host, if present, is one same-tier elite (usableByEnemy extras only).  
SPELL_DISCOVERY_OPPORTUNITIES: None.  
MAP_REQUIREMENTS: Rest-adjacent vault, open floor, one locked exit until the player either opens the lock, fights the host, or walks to a **skip** portal that was always reachable.  
SPECIAL_RULES: Credits via persist-lock `applyRewards` only. No `updateCharacter` Doka. First debit is the first challenge/combat HP loss this map. Death still `saveBattleStats`. Do not pair with Seeping Tithe (day-5) or Doka Fever (day-3) on the same map.  
OBJECTIVE: Choose: pay AP+HP for a sure purse, land the first debit on an enemy, fight a wounded host, or skip.  
FAILURE_CONDITION: Player death if they take the host fight. Skip is success with no extra grant.  
REWARD: Hard multiplier on the next `applyRewards` enqueue only as specified. Overlay: none (the risk *is* the challenge).  
TACTICAL_PURPOSE: Choice/rest beat with **sure HP price** vs **first-strike wager** vs **bleed-the-tether**. Distinct from ENC-TREAS-03 (three prices) and ENC-TREAS-05 (wait vs tithe).  
SOLVABILITY_REQUIREMENTS: Skip portal reachable without touching lock or host; host counts as 1 toward `MAX_ENEMIES` if present.  
REPLAYABILITY: Lock only vs lock+first-blood vs lock+host.  
SCALING_BEHAVIOUR: Peak: host elite tag. Never `titans_vigor`.  
STATUS: PROPOSED

---

### ENC-VEIN-01

ENCOUNTER_ID: ENC-VEIN-01  
TYPE: treasure / risk  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: Empty until the player flags. One `WF-RSK-OPEN_VEIN` inlay. End a turn on it to pay 10% max HP once and flag this map: if you start at least one encounter, the next `applyRewards` uses the hard multiplier. If you leave without fighting, the tax is a sunk cost. Inverse of Pilgrim Banners. After flag, spawn `FSN-KICK-STING` (or 2× pawns if Recoil is not ready) from far cells.  
AI_REQUIREMENTS: As ENC-RECOIL-01 once spawned.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Optional floor tile. Map solvable if never used. Exit always reachable.  
SPECIAL_RULES: HP via challenge recorders. Multiplier on the next `applyRewards` enqueue only if a fight started. In a dungeon chain the clear still counts as starting encounters — say so on the tooltip. Distinct from ENC-TITHE-01 (repeating tax) and ENC-OATH-01 (stillness wager).  
OBJECTIVE: Skip, or pay and win the spawned fight.  
FAILURE_CONDITION: Player death in the spawned fight. Skip is success with no extra grant.  
REWARD: Hard multiplier if flagged **and** a fight started. Overlay: none.  
TACTICAL_PURPOSE: “Pay HP only if you intend to fight.”  
SOLVABILITY_REQUIREMENTS: Inlay optional; spawned pack walk-reachable; occupancy cap.  
REPLAYABILITY: Inlay center vs side. High: spawn `FSN-LEY-SIP` instead of Kick-Sting for Ley-branch accounts.  
SCALING_BEHAVIOUR: The spawned formation is the scaler, not the HP%.  
STATUS: PROPOSED

---

### ENC-REST-06

ENCOUNTER_ID: ENC-REST-06  
TYPE: rest choice  
RELATIVE_DIFFICULTY: LOW  
ENEMY_COMPOSITION: Empty. Optional `WF-SPL-OATH_CANTOR` as a **bound rest chrome** (one same-tier enemy, medium): adjacent 1 AP binds their extra `usableByEnemy` spell as a this-map-only cast **while they live**; killing them ends the bind. Inverse of Loaner Mage (day-4). They stay hostile if the player starts that fight — default rest does **not** force combat.  
AI_REQUIREMENTS: None on rest. If the player attacks the cantor, treat as a 1v1 caster (Frost + one extra).  
SPELL_DISCOVERY_OPPORTUNITIES: Shrine pedestals up to one owned spell and preview `upgradeSpell` cost (`spellLevelingBaseCost * 2^level`). Debit must stay `spellUpgradeUiSpend` if they buy. No free upgrades. Bind does **not** call `upgradeSpell` and does not persist `spellLevel*` arrays. If ENC-SPELL-11 / ENC-FAN-01 observed Ley/Fan, the shrine **names** the missing id (still not a grant). Optional `WF-PRT-PACT_GATE` is **overworld / rest only** (never dungeon / rush / Death Realm, never the only portal): bonus grant only if a living allied summon is within 2 Chebyshev.  
MAP_REQUIREMENTS: Existing rest layout: open floor, exits `normal` / `dungeon` / `boss`. Optional fourth **risk** exit to ENC-TREAS-06. Optional `WF-ZON-KEEN_EDGE` as rest chrome (Attack Nearest plant, no combat required). Optional `null_field` announce as an **opt-in shrine** (anti-summon reminder, not a sponge). Snapshot dungeon-chain refs **before** `cleanupMap`. White sanctuary portal colocates with spawn.  
SPECIAL_RULES: `shouldArmDungeonChainOnRestExit` if they take `dungeon`. Latch / Wager / Pact gates never the only exit.  
OBJECTIVE: Heal / shop / upgrade / bind-or-ignore / pick an exit.  
FAILURE_CONDITION: None unless they pick a fight with the cantor and die.  
REWARD: Rest heal via existing shrine / `saveBattleStats` HP path. Pact bonus via `applyRewards` only when the summon clause holds. Overlay: none.  
TACTICAL_PURPOSE: Choice/rest beat. Distinct from ENC-REST-05 (patience / iron lent) and ENC-REST-04 (loaner / harvest).  
SOLVABILITY_REQUIREMENTS: Three exits reachable; Pact never the only portal.  
REPLAYABILITY: Cantor present vs absent. Duelist/Pact door shuffles.  
SCALING_BEHAVIOUR: Does not scale. After one full Table C clear, shrine can enable Table D rush flags (ENC-RUSH-19…22).  
STATUS: PROPOSED

---

### ENC-BRANCH-06

ENCOUNTER_ID: ENC-BRANCH-06  
TYPE: branching paths  
RELATIVE_DIFFICULTY: MID  
ENEMY_COMPOSITION: Empty foyer. Optional 1× pawn guard (physical only) if the account has skipped a teach this chain.  
AI_REQUIREMENTS: Pawn greedy if present.  
SPELL_DISCOVERY_OPPORTUNITIES: None on the foyer.  
MAP_REQUIREMENTS: Foyer with four portals: Ley (MP spend/steal → ENC-SPELL-11 or ENC-LEY-01), Fan (wedge / lock → ENC-SPELL-12 or ENC-FAN-01), Pit (file hole → ENC-PIT-01 or ENC-TRADE-01), Font (totem → ENC-REINF-06 or ENC-MERCY-01). A sealed fifth door to ENC-RARE-06 opens only if the account has cleared all four branches at least once (long-term, not this run).  
SPECIAL_RULES: Taking a door marks `branch: ley | fan | pit | font` on the dungeon snapshot (**before** `cleanupMap`). Other doors are gone for this chain. Mastery/boss later read the flag (ENC-MAST-06 / ENC-BOSS-06). Day-1 stays two-door; day-2 Ash/Ice/Void; day-3 Blood/Glass/Paper/Null; day-4 Tide/File/Clock; day-5 Wick/Rime/Smoke/Plus. This is the account-upgrade foyer after those five are known.  
OBJECTIVE: Pick one door.  
FAILURE_CONDITION: Player death if the pawn is up. Skip-pawn foyer cannot fail.  
REWARD: None on pick. Downstream rooms pay. Overlay: none.  
TACTICAL_PURPOSE: Persist a **resource/geometry** identity for the rest of the chain.  
SOLVABILITY_REQUIREMENTS: All four doors walk-reachable; one pawn cannot body-block more than one door.  
REPLAYABILITY: Door order shuffles. Recoil door (ENC-RECOIL-01) can replace Fan for accounts that already finished Fan this week.  
SCALING_BEHAVIOUR: Does not scale.  
STATUS: PROPOSED

---

### ENC-MAST-06

ENCOUNTER_ID: ENC-MAST-06  
TYPE: mastery  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Branch skin:

- Ley → `FSN-LEY-COURT`
- Fan → `FSN-LOCK-FAN` or `FSN-FAN-FILE` if ENC-LOCK-01 was answered
- Pit → `FSN-PIT-RANK` + leftover glass dump (`inheritHazardsFrom: ENC-TEACH-06`)
- Font → `FSN-FONT-GATE`

If `branch` is missing, default Ley if MP debit exists, else Fan with painted wedge.  
AI_REQUIREMENTS: Matching sheet. Soph 4–6. Full gates except 9/10.  
SPELL_DISCOVERY_OPPORTUNITIES: Any missing taught id.  
MAP_REQUIREMENTS: Branch-skinned: Ley open arena; Fan chessboard+wedge; Pit fortress+gallery; Font arena+sandbag. Crowd Press **off** unless ENC-SURV-11 was this chain (then it is fair).  
SPECIAL_RULES: Reads `branch` from the snapshot taken before rest `cleanupMap`. Rare insert ENC-RARE-06 may have run immediately before.  
OBJECTIVE: Clear the pack using the taught verb.  
FAILURE_CONDITION: Player death.  
REWARD: Mastery table. Overlay `under_8_ap_per_turn` (Ley/Fan) or `direct_hit` (Font) or `under_50_damage` (Pit).  
TACTICAL_PURPOSE: Prove the foyer identity. Distinct from ENC-MAST-05 (wick/rime/smoke/plus skins).  
SOLVABILITY_REQUIREMENTS: Per-sheet requirements; occupancy under cap; finalize after overlays.  
REPLAYABILITY: Four skins.  
SCALING_BEHAVIOUR: Peak conversions only along the same branch (Ley→Ley Court, not Ley→Lens Battery unless Rare rolled).  
STATUS: PROPOSED

---

### ENC-MINI-07

ENCOUNTER_ID: ENC-MINI-07  
TYPE: mini-boss  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: One lieutenant on a **king** chassis (`variant: elite`) with a **branch kit**, plus 1× trash pawn. Not a `BossId`. Not dual-boss.

- Ley → Frost + Ley Toll (if debit exists; else Frost + Slow, cap −2)
- Fan → Frost + painted wedge Fan
- Pit → Strike + one Open Pit
- Font → Mercy Font plant + Strike (king is the font owner, not a second cantor)

AI_REQUIREMENTS: Existing archetype inference plus the branch `aiHint`. At 30% HP: Ley gains one extra prime if the chain taught ENC-LEY-01; Fan gains one extra wedge facing; Pit paints a second hole only if two walk-offs remain; Font plants once more only if cap allows. Trash does not receive primes / pulses / locks.  
SPELL_DISCOVERY_OPPORTUNITIES: Branch id if still missing.  
MAP_REQUIREMENTS: Arena matching ENC-MAST-06 skin, slightly tighter. Optional Keen Edge for Attack Nearest accounts.  
SPECIAL_RULES: Honest to pacing. No `useBossAI`. No reflect / larva / decoy king unless this is a Rush injection.  
OBJECTIVE: Defeat lieutenant + trash.  
FAILURE_CONDITION: Player death.  
REWARD: Mini-boss table via `applyRewards`. Overlay `under_10_turns`.  
TACTICAL_PURPOSE: Capstone-minus-one using the taught verb without a dual-boss. Distinct from ENC-MINI-06 (wick lieutenant).  
SOLVABILITY_REQUIREMENTS: Lieutenant reachable; 30% extra does not seal tiles; font cap 1.  
REPLAYABILITY: Four kits.  
SCALING_BEHAVIOUR: Do not promote to a live `BossId` here — that is ENC-BOSS-06.  
STATUS: PROPOSED

---

### ENC-BOSS-06

ENCOUNTER_ID: ENC-BOSS-06  
TYPE: mini-boss / dungeon capstone  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: One real `BossId` by `branch` flag, **live 19 only** (Wave-6 ids stay out of `BOSS_IDS` until kits ship):

- Ley → `pale_archivist` (scroll / curse zones — closest live “tax” kit). Not `starved_vampire_pawn` (that is Blood).
- Fan → `starborn_queen` (AoE / void tiles). Not a second cone family.
- Pit → `alabaster_fortress` (walls as walk-blocks with punchable LoS stories). Not `ivory_palisade` (not in live 19).
- Font → `weeping_pawn` (resurge story without a second heal engine). **Not** `pale_archbishop` (two heal engines — illegal, same as Table D `D2` vs Lament).

If the chain taught decoy (ENC-PRIO-08) **and** Ley was not taken, Ice/Void-mixed accounts may use `eternal_pawn_king` **alone** (not the Rush pair). No dual-boss unless this is a Rush injection.  
AI_REQUIREMENTS: Existing `useBossAI` / `useBossSystem` for that id. Adds **one** pack of 2 trash in phase 1 only if the chain taught waves (ENC-WAVE-07) or font (ENC-REINF-06) — trash does not receive boss heals / reflect / larva bursts / Ley primes.  
SPELL_DISCOVERY_OPPORTUNITIES: Boss kit observe-to-grant per sibling discovery bible. Possession is not observation.  
MAP_REQUIREMENTS: Boss arena for that id. Branch overlays: Ley no Time Warp; Fan painted wedge chrome only (no extra cone damage); Pit leftover gallery; Font sandbag LoS. Re-run solvability after overlays.  
SPECIAL_RULES: Dual-boss is Rush-only. Do not add Wave-6 ids to `BOSS_IDS` in the same PR as a Rush remap.  
OBJECTIVE: Defeat the boss (and phase-1 trash).  
FAILURE_CONDITION: Player death.  
REWARD: Dungeon-complete bonus via one-shot id (`utils/dokaPersist.ts`) then `applyRewards`. Overlay `under_8_ap_per_turn` after one clear.  
TACTICAL_PURPOSE: Live-19 capstone that **reads** the Ley/Fan/Pit/Font identity. Distinct from ENC-BOSS-05 (wick/rime/smoke/plus).  
SOLVABILITY_REQUIREMENTS: Existing boss-arena solvability; trash ≤ 2; occupancy under cap.  
REPLAYABILITY: Four live bosses. Rush injection replaces this id.  
SCALING_BEHAVIOUR: Phase-1 trash on/off is the scaler. Never `titans_vigor`. Never a third boss.  
STATUS: PROPOSED

---

### ENC-RUSH-19

ENCOUNTER_ID: ENC-RUSH-19  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table D `D0`: `lock_marshal` + `wick_prelate`. Combined mechanic: “Douse fuses from the **only legal walk file**.” Fuses **never** paint the locked file (Snuffer sits on it). Fuses tick on perpendicular files you Strike/Frost from the file. Compass and Snuffer are both objects. Not Fosse / Hex / Palisade.  
AI_REQUIREMENTS: Existing combined mechanic once Wave-6 kits ship. Until then, **hold this id** and remix live room 5 (`chessboard_lich` + `pale_archivist`) with ENC-LOCK-01 chrome (painted locked file, no new damage formula). Trash cap 1 pawn on a **perpendicular** file only if the account learned ENC-LOCK-01. Trash does not receive boss heals.  
SPELL_DISCOVERY_OPPORTUNITIES: Rank Lock / Fuse Tile if missing (observe only).  
MAP_REQUIREMENTS: Rush arena + painted locked file. Solvable with the file walled-as-walk-lock (forced movement still works).  
SPECIAL_RULES: New `roomIndex` namespace `D0`. Do **not** overwrite `BOSS_RUSH_ROOMS` 0–9, `B0`–`B3`, or `C0`–`C3`. Unlock after one complete Table C clear. `completeBossRushRoom` still ignores client `dokaReward`/`xpReward`. Character must exist before mutation.  
OBJECTIVE: Clear the pair. Intended line: walk the locked file, douse perpendicular fuses.  
FAILURE_CONDITION: Player death.  
REWARD: Document Table D purse via `applyRewards` only. Do not also multiply by `rewardDokaMultiplier`. Overlay `under_8_ap_per_turn` after one clear.  
TACTICAL_PURPOSE: Axis curfew × occupancy fuse. Day-6 Lock + day-5 Wick without a third boss.  
SOLVABILITY_REQUIREMENTS: Fuses off the locked file; ≥ 1 walk-off; shared extra cap 4.  
REPLAYABILITY: File N-S vs E-W.  
SCALING_BEHAVIOUR: Do not add a third boss. Hold if Rank Lock + fuse-tile apply are both missing.  
STATUS: PROPOSED

---

### ENC-RUSH-20

ENCOUNTER_ID: ENC-RUSH-20  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table D `D1`: `bait_vicar` + `silent_conductor`. Combined mechanic: “Spell the real body from a sounding file; do not feed the pylon.” Silence **never** covers the Vicar’s file (you can still spell him). Pylon sits on a **silenced** file (tempting Strike). Censer + musicians share cap 4 (musicians only). Not Goad.  
AI_REQUIREMENTS: Hold if bait-pylon summon AI is missing. Fallback remix: live room 7 chrome is **not** this pair (that is ENC-RUSH-10). Fallback: `midnight_bishop` **alone** plus a 1-HP **scripted intercept token** (`baitTokenId`, not a second boss) on a silenced file.  
SPELL_DISCOVERY_OPPORTUNITIES: Bait Pylon observe. Nested `spell-bait-eat` never owned.  
MAP_REQUIREMENTS: Two files: sounding (Vicar) and silenced (pylon).  
SPECIAL_RULES: `D1`. Do not pair with Goad. Stationary post cap: this pylon **or** a font, not both.  
OBJECTIVE: Spell the Vicar; do not waste the nuke on the bait.  
FAILURE_CONDITION: Player death.  
REWARD: Table D purse via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Intercept exam taught by ENC-PRIO-08’s “real body” without Twin Monarchs.  
SOLVABILITY_REQUIREMENTS: Vicar file is never fully silenced; token 0 XP; occupancy cap.  
REPLAYABILITY: Vicar north file vs east.  
SCALING_BEHAVIOUR: Do not add Goad. Hold if intercept apply is missing.  
STATUS: PROPOSED

---

### ENC-RUSH-21

ENCOUNTER_ID: ENC-RUSH-21  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table D `D2`: `font_abbess` + `cord_familiar`. Combined mechanic: “Kill the font; feed **your** pet to the cord.” Enemy font is **not** a valid Cord gate key. Player must summon/own a pet. Font + cord extras share cap 4. Not Lament / Archbishop.  
AI_REQUIREMENTS: Hold if Mercy Font + Cord gate are missing. Fallback: live `weeping_pawn` + `broodmother_rook` is **illegal** (larvae + pulse). Fallback remix: `weeping_pawn` **alone** plus ENC-MERCY-01’s font token (`fontId`, not a second boss). Cord remains Table D-only — do not invent a second heal engine.  
SPELL_DISCOVERY_OPPORTUNITIES: Mercy Font. Rally/Mend on the Abbess stay **flat**.  
MAP_REQUIREMENTS: Arena + sandbag LoS to the font.  
SPECIAL_RULES: `D2`. Player-owned pet is the cord key. Cap one font.  
OBJECTIVE: Delete the font, then use your summon as the cord feed.  
FAILURE_CONDITION: Player death.  
REWARD: Table D purse via `applyRewards`. Overlay `direct_hit`.  
TACTICAL_PURPOSE: Font exam × player-summon gate. Day-6 Mercy + Wave-3 Cord without Archbishop.  
SOLVABILITY_REQUIREMENTS: Font shootable without pulse hug; player can summon (kit has a summon id) or the room **rerolls** to ENC-RUSH-19; 0 XP on font death.  
REPLAYABILITY: Plant cell.  
SCALING_BEHAVIOUR: Do not add Lament. Hold if the player’s bar has no summon and no loaner.  
STATUS: PROPOSED

---

### ENC-RUSH-22

ENCOUNTER_ID: ENC-RUSH-22  
TYPE: escalating Boss Rush variant  
RELATIVE_DIFFICULTY: PEAK  
ENEMY_COMPOSITION: Table D `D3`: `surplus_auditor` + `unbound_pendulum`. Combined mechanic: “Dump leftover AP **and** race the metronome.” Leftover check **skips** pendulum-sweep telegraph turns (one answer). Metronomes delay enrage; Audit-bell delays surplus. Not Eternal / Stride. Shared extra: bomber only (`AI_KAMIKAZE_MIN_TARGETS` respected).  
AI_REQUIREMENTS: Hold if Surplus Ward leftover-AP evade is missing. Fallback remix: live `unbound_pendulum` is **not** in `BOSS_IDS` — use `lord_of_static` + `bone_cavalier` (room 2) with ENC-SURV-12 Thin Air chrome (1-AP spells cost 2; leftover AP is a **readable** dump, not a miss formula). Do not also grant Sidestep Ward.  
SPELL_DISCOVERY_OPPORTUNITIES: Surplus Ward observe. Do not read `CharacterStats.evasion`.  
MAP_REQUIREMENTS: Rush arena + pendulum nave chrome from ENC-HAZ-09 if that verb is known; otherwise Thin Air only.  
SPECIAL_RULES: `D3`. Leftover check skips sweep-telegraph turns. Not Eternal (two AP taxes). Not Stride (0-walk **and** dump-AP).  
OBJECTIVE: Dump leftover AP on telegraph turns; race the metronome on the others.  
FAILURE_CONDITION: Player death.  
REWARD: Table D purse via `applyRewards`. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Leftover-AP evade × clock. Distinct from ENC-BELL-01 (painted pip execute) and ENC-COUP-01 (25% Strike).  
SOLVABILITY_REQUIREMENTS: Telegraph turns exist; bomber never solo-dets on a full-HP player; one leftover check skipped per sweep.  
REPLAYABILITY: Thin Air vs pendulum chrome.  
SCALING_BEHAVIOUR: Do not add a third boss. Hold if both Surplus and Pendulum kits are missing.  
STATUS: PROPOSED

---

### ENC-LENS-01

ENCOUNTER_ID: ENC-LENS-01  
TYPE: spell-discovery / elite  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `FSN-LENS-BATTERY` teaching COURT **without** rare tag — Share + Stinger + one Frost bishop (not a second `glass_sniper` unless Share is live). Isolated 1v1 rerolls this id to ENC-RECOIL-01.  
AI_REQUIREMENTS: Share as ENC-RARE-06. Soph 6–8.  
SPELL_DISCOVERY_OPPORTUNITIES: Lens Share. If already owned, convert to ENC-RARE-06.  
MAP_REQUIREMENTS: Open field, two guns ≥ 4 apart.  
SPECIAL_RULES: Unlock after ENC-FAN-01 **or** ENC-RECOIL-01 so the player has seen one long gun. Strike stays unmodified.  
OBJECTIVE: Kill Share first.  
FAILURE_CONDITION: Player death.  
REWARD: Standard + Share discovery. Overlay `under_8_ap_per_turn`.  
TACTICAL_PURPOSE: Ally-range grant as a room. Distinct from ENC-ELITE-05 (min-range sniper + peel).  
SOLVABILITY_REQUIREMENTS: Not 1v1; Share skip-duplicate.  
REPLAYABILITY: Share on north gun vs south.  
SCALING_BEHAVIOUR: Retires to ENC-RARE-06 when owned. Never two Shares.  
STATUS: PROPOSED

---

### ENC-HOST-01

ENCOUNTER_ID: ENC-HOST-01  
TYPE: rare elite / ambush insert  
RELATIVE_DIFFICULTY: HIGH  
ENEMY_COMPOSITION: `WF-INV-MIRROR_HOST` — one extra same-tier elite on a painted tether. Exploration: leave. Dungeon / boss rush: they count as a hostile for map-clear. Optional `WF-ELT-DRIFT_SENTINEL` **instead** on odd/even loop maps (do not spawn both).  
AI_REQUIREMENTS: Same-tier elite extras `usableByEnemy` only. Drift Sentinel wanders only on odd rounds along a 4–6 tile loop; even rounds it stands.  
SPELL_DISCOVERY_OPPORTUNITIES: None required.  
MAP_REQUIREMENTS: Tether/loop is floor. Exit reachable without touching in exploration. Counts as 1 toward `MAX_ENEMIES`.  
SPECIAL_RULES: World attrition does not call `applyRewards`. Contact is a normal battle. Out of battle, player HP spends also wound the host by the same % max. Victory pays hard if the host was above 50% at contact, medium if already wounded. Distinct from ENC-AMBUSH-03 (hunt lantern) and ENC-CART-01 (moving intercept).  
OBJECTIVE: Fight healthy, tax yourself first, intercept on even rounds, or skip (exploration).  
FAILURE_CONDITION: Player death in the fight. Skip in exploration is success.  
REWARD: Hard/medium via `applyRewards` as specified. Overlay `under_50_damage` if they wounded the tether first.  
TACTICAL_PURPOSE: Optional same-tier elite whose HP is a **mirror of your spends**, or a loop you intercept on even rounds.  
SOLVABILITY_REQUIREMENTS: Exit without crossing in exploration; dungeon requires the kill for the progression portal.  
REPLAYABILITY: Host vs Drift.  
SCALING_BEHAVIOUR: Elite tag only. Never `titans_vigor`.  
STATUS: PROPOSED

---

## 5. Sample chains (composition, not code)

### Chain K — “Ley / Fan / Pit / Font Primer” (maxDepth 5)

| Depth | Beat | ID |
| ---: | :--- | :--- |
| 1 | Teach | ENC-TEACH-06 then ENC-SPELL-11 (or ENC-SPELL-12 if Ley already owned / MP debit missing) |
| 2 | Reinforce | ENC-WAVE-07 |
| 3 | Combine | ENC-HAZ-11 then ENC-LEY-01 **or** ENC-PIT-01 **or** ENC-HAZ-12 |
| 3 insert | Choice | ENC-BRANCH-06 → Ley/Fan/Pit/Font destinations |
| 4 | Pressure | ENC-SURV-11 **or** ENC-FAN-01 **or** ENC-TRADE-01 **or** ENC-PROT-06 **or** ENC-GATE-01 **or** skip via ENC-REST-06 |
| 4 | Mastery | ENC-MAST-06 (branch skin) |
| 5 | Boss | ENC-BOSS-06 |

Rare: 8% on depth 4 to **insert** ENC-RARE-06 before mastery.  
Treasure: rest may offer ENC-TREAS-06 instead of PROT-06.  
Decoy side-story: replace combine with ENC-PRIO-08 and mini-boss ENC-MINI-07; capstone may become `eternal_pawn_king` if Ley was not the door.

### Chain L — “Slab / Pin Primer” (maxDepth 4)

ENC-MOVE-10 → ENC-MOVE-11 → ENC-GATE-01 → ENC-REST-06 → ENC-BOSS-06 (`alabaster_fortress` only if Pit was the remembered branch; default still reads `branch` from a prior foyer). Prefer inserting ENC-MOVE-10 as teach on accounts that already know glass/Ley.

### Rush injection (day-6)

After one full Table C clear (`C0`–`C3`), ENC-REST-06 shrine can enable: `D0` → ENC-RUSH-19, `D1` → ENC-RUSH-20, `D2` → ENC-RUSH-21, `D3` → ENC-RUSH-22. Day-1 flags for rooms 0 / 3 / 9, day-2 flags for rooms 1 / 2 / 4 / 5 / 8, day-3 flags for rooms 6 / 7, day-4 flags for Table B, and day-5 flags for Table C remain.

---

## 6. Optional challenge overlay

Existing `ChallengeCondition` values only. Do not invent predicates until a human asks.

| Encounter | Suggested overlay |
| :--- | :--- |
| ENC-TEACH-06, ENC-SPELL-11, ENC-SPELL-12, ENC-RECOIL-01 | `under_15_turns` / `under_50_damage` |
| ENC-HAZ-11, ENC-HAZ-12, ENC-PIT-01, ENC-MOVE-10, ENC-MOVE-11, ENC-SLIDE-01 | `under_50_damage` |
| ENC-AMBUSH-06, ENC-FOOT-01, ENC-TRADE-01 | `no_healing` |
| ENC-WAVE-07 | `under_15_turns` (first clear); `under_10_turns` after |
| ENC-PROT-06, ENC-MERCY-01, ENC-REINF-06 | `direct_hit` |
| ENC-ELITE-10, ENC-ELITE-11, ENC-LEY-01, ENC-FAN-01, ENC-LOCK-01, ENC-GATE-01, ENC-LENS-01, ENC-MAST-06, ENC-MINI-07 | `under_8_ap_per_turn` |
| ENC-SURV-11, ENC-SURV-12 | `no_healing` (not `no_damage_taken`) |
| ENC-PRIO-08 | `under_10_turns` |
| ENC-TREAS-06 / ENC-REST-06 / ENC-VEIN-01 | no overlay (the risk *is* the challenge) |

All overlay Doka/XP still go through `liveBattleChallengePersistEntries` → `applyRewards`.

---

## 7. Scaling tables (no level-only ramps)

| Band | Composition | AI | Kits / families | Hazards / modifiers | Objectives |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TEACH | 1–2 roles, one verb | no lookahead | zone 0, no family | glass shard or cog pair | kill |
| LOW | +1 family role | LoS reposition | zone 0–1 | glass **or** second foot | kill + optional print |
| MID | named drop-5 `FSN-*` or waves | backline guard | zone 1 + Ley/Sip/Pit | one `WF-*` | clock / tags / slab / pin |
| HIGH | elite or fan / trade / font | lethal lookahead | zone 1–2 + elite tag | two taxes | protect / gate / vein |
| PEAK | overlap or boss | full gates except 9/10 | CADRE / rare | branch-skinned | mastery / Table D |

If a live player is over-levelled for a band, **promote the band’s verb** (add a role, enable a kit spell, inherit glass, open a second aisle) rather than multiplying enemy HP. Do not attach `titans_vigor`. `doka_fever` stays opt-in treasure (day-3). Blood Lock / First Blood / Open Vein are day-6 opt-in multipliers on `applyRewards` only.

---

## 8. Explicit metadata sketch (for a later implementer)

Not production code. Compose day-1…day-5 fields plus:

```
encounterId
encounterType        // + ley | fan | trade | recoil | pit | mercy_font |
                     // gate_pads | slide | lock | vein | host | keen_edge
formationId?         // FSN-LEY-SIP | FSN-KICK-STING | FSN-FONT-IRON |
                     // FSN-PIT-RANK | FSN-TRADE-HOLE | FSN-SLIDE-BASH |
                     // FSN-LOCK-FAN | FSN-LEY-COURT | FSN-PUSH-SCHOOL |
                     // FSN-TRADE-TRAP | FSN-FONT-GATE | FSN-FAN-FILE |
                     // FSN-RECOIL-HUNT | FSN-GATE-COURT | FSN-EVADE-GOAD |
                     // FSN-LENS-BATTERY | FSN-ICE-FILE | FSN-SMOKE-HUNT |
                     // FSN-ABSOLVE-RACE | FSN-TWIN-PLATE | FSN-FINISH-LINE |
                     // FSN-RIFT-KNOT
familyLock[]         // disable 30% lottery
worldFeatureIds[]    // WF-* placed after finalize
ownedFile?
wedgeOrigin? / wedgeCells[]
pitCell?
gatePads[]           // not occupancy portals
slideDir?
lockedAxis?
recallPin?
fusedCell?
rimeFile?
plusOrigin?
inheritHazardsFrom?
inheritModifierFrom?
branchFlag?          // ley | fan | pit | font
decoyId? / realId?
fontId?
baitTokenId?
holdPortalLocked?
objectiveKind        // + dump_mp_before_sip | hug_wedge | isolate_pet |
                     // pin_squire | shoot_font | cross_open_slab |
                     // plant_recall | occupy_keen_edge | flag_open_vein |
                     // walk_off_axis | stand_beside_slide
failureKind
deviceTable[]        // ENC-TREAS-06
rushVariant?         // table_d_lock_wick | table_d_bait_silence |
                     // table_d_font_cord | table_d_surplus_pendulum
rushTable?           // A (rooms 0–9) | B (B0–B3) | C (C0–C3) | D (D0–D3)
rewardPolicy         // applyRewards only
```

---

## 9. Out of scope

- Implementing any of the above in `WorldExploration.tsx`, `mapGen.ts`, or AI.
- New damage formulas, new CharacterStats fields, new persist writers.
- Name-based targeting or “if they are called Lock Marshal / Final Pawn” logic — use `formationId` / `lockedAxis` / `branchFlag` / `decoyId` / `fontId`.
- Shipping admin tools to configure these rooms for normal players.
- Rewriting or renumbering 2026-08-31, 2026-09-01, 2026-09-02, 2026-09-21, or 2026-09-22 IDs.
- Enabling `usableByEnemy` on barrier / mirror / timestep / rallying-cry without the AI honesty work in `docs/ENEMY_AI_EVOLUTION.md`.
- Using `titans_vigor` as a room scaler.
- Pretending `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` have WX combat hooks they do not (those four are announce-only in `mapModifiers.ts` as of `0f5363f`).
- Dual-boss dungeon capstones (Rush only).
- Adding Wave-2/3/4/5/6 ids to `BOSS_IDS` in the same change as a Rush string remap.
- Rush Table E (open PR #474) — do not collide `ENC-RUSH-23+` or rewrite `D0`–`D3`.
- Wiring `applyPushback` / `applyAttract` callers, trap≠`placeBarrier`, fuse-tile apply, rime-tile apply, `areaShape` cone reader, MP debit on `executeCastAttempt`, Twin Gate `gatePads`, Open Pit walk-block, Mercy Font summon AI, Rank Lock apply, Pawn Trade two-hostile swap, Sidestep `evadeNextHits`, Lens Share, or ally `targetId` apply — rooms above name **fallbacks** until those exist.
- Shipping `FSN-LEY-SIP` / ENC-LEY-01 by faking Ley Toll with Enrage.
- Shipping Fan Bolt as a Chebyshev blob.
- Shipping `FSN-FOG-FUSE` without a public wick tell under smoke.
- Shipping `FSN-TEMPO-CHOIR` before ally Tempo apply.
- Packing `font_cantor` with `pale_cantor`, `pawn_broker` with `rift_hook`, `far_stinger` with `glass_sniper` without Share, or `hex_teller` with `tax_scribe` as teaching pairs.
- Minting `FSN-*` ids for Wave-5 families (`gale_deacon`, `twin_sentry`, `pincer_acolyte`, `oblique_cantor`, `verse_scribe`, …) — those wait on a later formation drop.
- `WF-PRT-LATCH_GATE` / `WF-PRT-WAGER_GATE` / `WF-PRT-PACT_GATE` inside dungeon / boss rush / Death Realm.
- Faking pits as lava, pads as occupancy portals, Ley as Enrage, Fan as Inferno, Trade as `isSwap`, Recoil as “more Strike,” Font plant as a heal, or Surplus as `CharacterStats.evasion`.

---

## 10. Pick order (day-6, after day-1…day-5 verbs exist)

Day-1 pick order still wins if nothing from 2026-08-31 is live: ENC-TEACH-01 + ENC-HAZ-01 → ENC-WAVE-01 → ENC-REST-01 / ENC-BRANCH-01.

Day-2 pick order still wins if Void verbs are missing: ENC-TEACH-02 + ENC-SPELL-03 → ENC-WAVE-03 → ENC-HOLD-01 or ENC-SURV-03 → ENC-BRANCH-02.

Day-3 pick order still wins if Hex verbs are missing: ENC-TEACH-03 + ENC-SPELL-05 → ENC-WAVE-04 → ENC-FUSE-01 or ENC-NULL-01 → ENC-BRANCH-03.

Day-4 pick order still wins if Tide / File / Clock verbs are missing: ENC-TEACH-04 + ENC-HAZ-07 → ENC-WAVE-05 → ENC-BELL-01 or ENC-WIRE-01 or ENC-SLAM-01 → ENC-BRANCH-04.

Day-5 pick order still wins if Wick / Rime / Smoke / Plus verbs are missing: ENC-TEACH-05 + ENC-SPELL-09 → ENC-WAVE-06 → ENC-WICK-01 or ENC-RIME-01 or ENC-COUP-01 → ENC-BRANCH-05.

Once those exist, implementers should pick:

1. ENC-TEACH-06 + ENC-SPELL-11 (glass dump-tax / Ley verbs). `FSN-LEY-SIP` ships only when MP debit exists; otherwise ENC-SPELL-12 (painted wedge) in the same slice as ENC-WAVE-07’s Kick-Sting half.  
2. ENC-WAVE-07 (`formationId` LEY-SIP → KICK-STING, with Tide-Lock fallback)  
3. ENC-LEY-01 or ENC-PIT-01 or ENC-FAN-01 or ENC-TRADE-01 (new pressure objects — current MP, file hole, 90° hug, isolate pet)  
4. ENC-BRANCH-06 (`branch: ley|fan|pit|font` snapshot-before-cleanup)  
5. ENC-BOSS-06 branch read (live 19 fallbacks)  
6. Rush Table D (ENC-RUSH-19…22) one room at a time, only after the account has one full Table C clear. Hold D0 if Rank Lock + fuse-tile are missing; hold D1 if bait intercept is missing; hold D2 if font + player summon are missing; hold D3 if Surplus leftover-AP evade and Pendulum kits are missing.

Uniqueness: this file is the **sixth** dated catalog. Later designers add `ENCOUNTER_EVOLUTION_YYYY-MM-DD.md` or append IDs. Do not silently rewrite these sheets.
