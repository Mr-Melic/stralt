# Stralt Boss & Boss-Spell Discovery Design

**Author:** Boss and Boss-Spell Designer (automation)  
**Date:** 2026-09-01 (iterates 2026-08-31 / #137)  
**Status:** PROPOSED (design only — no production code in this change)  
**Scope:** All 19 shipped bosses, Wave-2 quartet, and Wave-3 quartet. Every special ability classified. Indefinite progression, no level cap.

This document is the design contract for later implementation. It does **not** change combat math, the RAF loop, map generation, turn order, or any runtime module. Implementers must follow the constraints in §2 and the per-boss `STATUS: PROPOSED` sheets.

---

## 0. Changelog — 2026-09-01 cron

`BOSS_IDS` (19), `BossAbility` (46), and `spellData.ts` (32 frontend ids) are **unchanged** since #137. This run does **not** duplicate shipped or Wave-2 sheets. It reconciles the bible with sibling contracts that landed the same day and fills four remaining **primary-mechanic** holes.

Live audit against `dd275aa` (`main`):

| Fact | Still true |
| :--- | :--- |
| `getBossEffectiveStats` multiplies catalog HP by `1.08^diff` only | Slice A not implemented. Even-match HP is still 60–600. |
| Final Pawn `phase2.statMultiplier: 999`, `summonCount: 11` | `bossDefaults.ts` 475–481 |
| Rush room 9 `boss2Id: "weeping_pawn_2"` | Still not a `BossId`. Wave 3 names the remap. |
| `pickBossKitSpell` first-off-cooldown | `useBossAI.ts` unchanged |
| Backend `defaultBossConfigs()` stale 12-boss seed | Unchanged |
| Long-horizon report (#143) | Combat HP stays static; Guide table is not the fight |

**This pass adds:**

1. Sibling alignment with #156 (use → observe → win) and #120 (tactical ids). Count-gates stay on #137 adaptations only.
2. Id-collision table so implementers do not ship two burn-tiles or two snare glyphs.
3. #120 `BOSS` grants wired onto the four sheets that already own those fantasies (`alabaster_fortress`, `pale_archivist`, `starved_vampire_pawn`, `void_grandmaster`).
4. Wave 3: `second_lament`, `hook_regent`, `ivory_palisade`, `cord_familiar`. Not in `BOSS_IDS`. `weeping_pawn_2` remaps to `second_lament`.
5. No new `BossAbility` enum members and **no new #137 spell ids**. Wave 3 learnables reuse #120 ids.

Shipped + Wave-2 sheets remain `STATUS: PROPOSED` with the four grant-line edits in §7.

---

## 1. Intent

Stralt has no level cap. A boss that is interesting at level 8 must still be a tactical fight at level 80. Difficulty comes from **reading the board, spending AP/MP well, and answering a core mechanic** — not from a larger HP number.

Existing shipped data works against that:

| Fact | Where it lives | Why it breaks no-cap |
| :--- | :--- | :--- |
| Catalog HP is absolute (60–600) | `src/frontend/src/types/bossDefaults.ts` | Player HP can grow (`100 * 1.05^(L-1)` when a level-up config exists; `updateCharacter` allows `L * 200 + 100`). A 400 HP rook is a sponge at L1 and a punchbag at L40. |
| Level-diff only multiplies those fixed bases | `getBossEffectiveStats` in `src/frontend/src/engine/progression.ts` (`BOSS_LEVEL_DIFF_STEP = 1.08`) | Even-match (`diff = 0`) returns the catalog unchanged. The Guide table never scales HP to the player. |
| Phase-2 `statMultiplier` stacks on that | `BossPhaseConfig.statMultiplier` | Weeping Pawn / Midnight Bishop use `2.0`. Final Pawn uses **`999`**. That is an invuln hack, not a fight. |
| Backend seed is a different roster | `src/backend/lib/admin.mo` `defaultBossConfigs()` | Stale spell ids (`fireball`, `cursed_gust`) and 12-boss list. Frontend kits in `src/frontend/src/data/bossKits.ts` are the live catalog. Do not “sync” by deploying `backend_extended/`. |

The redesign keeps every current `BossId`, piece type, and kit-spell id. It rewrites **how those fights are meant to feel**, how they scale, and which spectacular tricks the player may ever learn.

---

## 2. Hard constraints (do not violate when implementing)

Copied from live architecture so a later implementer cannot “helpfully” invent stats or reward paths.

1. **No production code in this PR.** Specs only.
2. **Do not touch** the RAF loop, map generation, turn logic, or damage math.
3. **CharacterStats stays 12 fields:** `hp, ap, mp, sp, sr, atk, res, chc, init, resilience, evasion, killCount`. No `wp` / `wr` / `scp`.
4. **Spell targeting and effects use explicit metadata** (`effectType`, `targetType`, `areaShape`, flags such as `isMark` / `isBarrier`). Never name-based heuristics.
5. **Rewards** go through `applyRewards` (`utils/rewardResolver.ts`) and the root recap. Never `updateCharacter` for XP/Doka. Death penalty stays on `saveBattleStats` (Nat-only `applyRewards` cannot subtract).
6. **XP curve** is `100 * 2^(N-1)`. Do not use `100 * 2^N`.
7. **Boss kits** are 3–5 ids from `SPELL_ID_CATALOG` in `bossKits.ts`. Phase 2 must add at least one spell Phase 1 lacks. Do not invent kit spells that are not in `spellData.ts` unless a later spell-catalog PR adds them with explicit metadata.
8. **Canonical actor** is `src/backend/main.mo`. Do not deploy `backend_extended/` (15-field stats).
9. **Admin / debug** stays gated. Boss Guide and admin config editors are not player-facing unlocks.
10. **Current type allows only two phases** (`BossPhaseConfig.phaseNumber: 1 | 2`). Sheets below may describe a third *dramatic beat*. Until the type is extended, that beat is an **enrage overlay or a Phase-2 branch**, not a third `phaseNumber`.
11. **Hazard tiles** are already capped at 50 (`BossState.hazardTiles`). New hazards must respect that cap.
12. **Challenge HP / AP** still go through `recordChallengeDamageTaken` / `recordInBattleChallengeDamage` / `recordChallengeApSpend`.

---

## 3. Scaling bible (indefinite progression)

### 3.1 Relative, not absolute

At encounter start the boss is **level-matched** to the player, then offset by a small intended gap:

```
bossLevel     = playerLevel + relativeOffset     // relativeOffset ∈ {0, +1, +2}
hpBudget      = playerMaxHp * hpRatio            // hpRatio from the table below
atkBudget     = max(playerAtk, 1) * atkRatio
diffMult      = 1.08 ^ (bossLevel - playerLevel) // keep the existing Guide step
phaseMult     = phase.statMultiplier             // compose; never 999
effectiveHp   = round(hpBudget * diffMult * phaseMult)
effectiveAtk  = round(atkBudget * diffMult * min(phaseMult, 1.6))
```

`getBossEffectiveStats` today only applies `diffMult` to the **catalog** HP. The intended change (later PR, not this one) is to **replace catalog HP with `hpBudget` before** applying `diffMult`. Catalog HP in `bossDefaults.ts` becomes a **reference at playerLevel 1 with default 100 HP**, not a live value.

AP and MP stay near current catalog values and remain capped at 20 (`updateCharacter`). Resource pressure is the infinite-progression lever: the player never gets 40 AP, so a fight that taxes AP stays hard at any level.

Do **not** scale:

- Telegraph length (always 1 turn unless a sheet says 2)
- Summon **count** (scale summon **stats**, not the number of bodies)
- Enrage turn index (see §3.3)
- Discoverable-spell observation counts

### 3.2 HP / atk ratios by relative difficulty

Relative difficulty is a 1–10 even-match rating (player vs boss at `diff = 0`). It is **not** a level requirement.

| RELATIVE_DIFFICULTY | hpRatio | atkRatio | Intended even-match length |
| ---: | ---: | ---: | :--- |
| 3 | 1.30 | 0.85 | 6–9 player turns |
| 4 | 1.45 | 0.95 | 8–12 |
| 5 | 1.60 | 1.00 | 10–14 |
| 6 | 1.80 | 1.05 | 12–16 |
| 7 | 2.00 | 1.10 | 12–18 |
| 8 | 2.20 | 1.15 | 14–20 |
| 9 | 2.40 | 1.20 | 16–22 |
| 10 | 2.60 | 1.15 | 16–24 (length from mechanics, not HP) |

Phase-2 `statMultiplier` must stay in **1.15–1.60**. Anything above 1.60 is a sponge. Final Pawn’s `999` is retired in this spec (see that sheet).

Outgoing boss damage that is a **percent of player max HP** (hazards, drains, enrage ticks) uses a **percent**, not a flat 8/15/22. Flat kit-spell numbers in `spellData.ts` already scale with SP; do not also multiply them by player HP or fights explode.

Hazard tick guideline (later wiring, not damage-math rewrite here):

```
hazardTick = max(1, round(playerMaxHp * 0.04))   // lava / shock / void step
spikeTick  = max(1, round(playerMaxHp * 0.03))
```

Until that wiring exists, treat catalog flat ticks as the **level-1 reference**.

### 3.3 Enrage overlay (all bosses)

Enrage is a **turn clock**, not an HP threshold. High-level players with more MP cannot kite forever.

```
enrageTurn = min(28, 14 + relativeDifficulty)
```

At `enrageTurn` and every turn after:

- Boss outgoing damage +8% per stack
- Cap +80% (10 stacks)
- **No HP added**
- One extra telegraph resolves on the same turn as its wind-up (the “you had a turn to step off” rule collapses)

Enrage never grants `DAMAGE_IMMUNE` or `INVINCIBLE_PHASE`.

### 3.4 Rewards that do not explode

Victory XP today is `sum(defeated.level * 20)` then `rewardXpMultiplier`. If minions inherit `playerLevel`, a brood fight mints more XP than the boss.

**Rule:** only the **boss combatant** (and Twin Monarchs’ second body) counts at full `level * 20 * rewardXpMultiplier`. Minions, larvae, ghosts, scrolls, and phantoms count **0** toward `selectDefeatedEnemiesForRewards` unless a sheet explicitly says otherwise (none do).

Doka stays on the existing multipliers (5–10×) through `applyRewards`. Do not add a `playerLevel` Doka exponent. The XP curve is already exponential.

Mastery and discovery rewards are **spells or feats**, not a second Doka funnel. New feat claims still go through `claimAchievementReward` on the persist lock.

### 3.5 What we refuse to scale

- Board size (16×16)
- Kit AP costs
- “See this ability N times” observation counters
- Number of anchors / metronomes / reliquaries (object **HP** may use `0.15 * playerMaxHp`)

---

## 4. Mechanic vocabulary

Every sheet uses these systems. They are **design systems**, not new `BossAbility` enum members until an implementation PR adds them with explicit metadata.

| System | Player-facing rule | Scaling note |
| :--- | :--- | :--- |
| **Phases** | Dramatic beats at HP fractions. Live code: 2 phases. A third beat is an enrage overlay or Phase-2 branch until `phaseNumber` is widened. | Thresholds are fractions of **effective** max HP. |
| **HP thresholds** | `0.70 / 0.40 / 0.15` are the default trio. Individual sheets override. | Never a raw HP number. |
| **Reinforcements** | Extra bodies on a cadence, cap **4** living boss-side units (Final Pawn ghosts: cap **6**, not 11). | Body count fixed; stats use summon scaling. |
| **Destructible objectives** | 1-tile objects, block walk, HP = `0.15 * playerMaxHp`, die to any damaging hit. Destroying them answers a mechanic (drop shield, rotate vuln, delay enrage). | Count fixed; HP relative. |
| **Rotating vulnerabilities** | 3-turn cycle. Window A: +40% from `isPhysical` hits. Window B: +40% from non-physical. Window C: +40% from a named line (rank / file / diagonal). Telegraph the next window on the boss tile. | Percent, not a new damage type. |
| **Arena hazards** | Lava, spikes, shock, void, glyph. Cap 50. Walk damage must use the existing challenge debit helpers. | Tick as % HP (guideline above). |
| **Telegraphed attacks** | 1-turn wind-up: highlighted tiles, then resolve. Stepping off is the answer. | Wind-up does not scale. |
| **Enrage** | §3.3 overlay. | Turn index from relative difficulty. |
| **Target marking** | Prefer existing `spell-mark` / `isMark`. Movement-fail marks are a **new** explicit flag (`isForcedMoveMark`) if ever implemented — do not infer from the name “Hex”. | Mark damage uses the next spell’s metadata. |
| **Movement checks** | “Leave this tile / cross this file / do not stand still.” Failed check = a hazard tick or a free boss attack. | Check is binary. |
| **Summon management** | Shells, explosions, healers. Player summons use existing lifespan rules. Boss summons count against the 4-body cap. | |
| **Resource pressure** | AP drain, MP slow, forced reposition. AP/MP caps (20) make this work at any level. | Drain amounts stay small integers (−1 AP, −2 MP). |
| **Optional mastery** | Extra objective after a normal win. Unlocks a feat and/or a discoverable spell. Never required to leave the map. | |

---

## 5. Discovery classification

Every **special** boss ability (the `BossAbility` enum, not the kit spells already in `spellData.ts`) is one of:

| Class | Meaning |
| :--- | :--- |
| `BOSS_ONLY` | Identity, arena mutation, or too strong in a player kit. The player never receives this ability. |
| `PLAYER_LEARNABLE` | A **bounded adaptation** can be added to `spellData.ts` later, with explicit metadata. Observation + victory required. |
| `ACHIEVEMENT_UNLOCK` | Adaptation is gated on an existing or new feat (`AchievementConfig.condition`). |
| `CHALLENGE_UNLOCK` | Adaptation is gated on a live challenge id from `DEFAULT_CHALLENGES` completed **on that boss**. |

Kit spells (`spell-inferno`, `starter-drain`, …) are **already player-usable**. They are listed under `SPELLS` on each sheet. They are **not** re-classified here. The boss’s **stronger version** of the same fantasy (full-board lava, 11 ghosts) stays `BOSS_ONLY`.

### 5.1 Master classification — all `BossAbility` values

| Ability | Class | Why | Player adaptation (if any) |
| :--- | :--- | :--- | :--- |
| `REFLECT_SHIELD` | `BOSS_ONLY` | `spell-mirror` already covers the player fantasy. A second reflect would stack. | — |
| `SPAWN_MINIONS` | `BOSS_ONLY` | Reinforcement director, not a spell. Player already has five summon ids. | — |
| `LAVA_TRAIL` | `PLAYER_LEARNABLE` | Local, readable, fits existing lava hazard. | `spell-ember-step` |
| `TELEPORT_ADJACENT` | `BOSS_ONLY` | `spell-swap` is the player version. Free self-blink-to-melee would delete positioning. | — |
| `ILLUSION_SPLIT` | `BOSS_ONLY` | Multi-body identity. Player clones would break targeting and victory. | — |
| `KNIGHT_JUMP_IGNORE_WALLS` | `ACHIEVEMENT_UNLOCK` | Spectacular but a **once-per-battle** vault is safe. | `spell-vault` |
| `SPIKE_ON_LAND` | `PLAYER_LEARNABLE` | One-tile trap, existing spike hazard. | `spell-caltrop` |
| `CURSE_ON_HIT` | `BOSS_ONLY` | Passive on-hit. `spell-cursed-wound` already is the player cast. | — |
| `PROMOTE_QUEEN` | `BOSS_ONLY` | Piece-type rewrite mid-fight. | — |
| `ATTACK_ALL_LINES` | `BOSS_ONLY` | Full rank/file/diagonal is an arena nuke. | — |
| `VOID_TILES` | `BOSS_ONLY` | Permanent holes change pathing and map-gen solvability. | — |
| `COMPOUNDING_ROT` | `CHALLENGE_UNLOCK` | Stacking DoT is easy to abuse; lock behind a feat-of-skill. | `spell-rot-brand` |
| `SPLIT_ROOKS` | `BOSS_ONLY` | Second full boss body. | — |
| `ADVANCE_PER_TURN` | `BOSS_ONLY` | Forced AI locomotion, not a player verb. | — |
| `AP_DRAIN` | `BOSS_ONLY` | `spell-drain-courage` already drains 1 AP. A stronger aura would brick the AP cap. | — |
| `TWIN_FLANK` | `BOSS_ONLY` | Dual-body director. | — |
| `MERGE_BISHOPS` | `BOSS_ONLY` | Dual-body director. | — |
| `MAGIC_REFLECT` | `BOSS_ONLY` | Covered by `spell-mirror`. | — |
| `LARVAE_SPAWN` | `BOSS_ONLY` | Director. Player has `summon-bomber` / `summon-archer`. | — |
| `SHELL_ARMOR` | `ACHIEVEMENT_UNLOCK` | Interesting if it requires a **living allied summon**. | `spell-brood-ward` |
| `LARVAE_EXPLODE` | `BOSS_ONLY` | Minion death-nova as a director. `summon-bomber` is the player analog. | — |
| `SHOCK_TILES` | `PLAYER_LEARNABLE` | One charged tile, existing shock state. | `spell-shock-glyph` |
| `CHAIN_LIGHTNING` | `BOSS_ONLY` | Tile-to-tile board chain. `starter-blast` is the player analog. | — |
| `INVINCIBLE_PHASE` | `BOSS_ONLY` | Fight-structure, not a spell. | — |
| `GHOST_SUMMON` | `BOSS_ONLY` | Roster-wide summon. | — |
| `RESONANCE_SHOCKWAVE` | `ACHIEVEMENT_UNLOCK` | Delayed self-nova after taking hits — readable. | `spell-aftershock` |
| `BOARD_SHRINK` | `BOSS_ONLY` | Arena mutation. | — |
| `MAP_ROTATE` | `BOSS_ONLY` | Arena mutation. | — |
| `MIRROR_INVERT` | `BOSS_ONLY` | Arena mutation. | — |
| `BOARD_CLAIM` | `BOSS_ONLY` | Arena mutation. | — |
| `SPELL_MIRROR` | `BOSS_ONLY` | Player already has `spell-mirror`. Boss buffer is stronger. | — |
| `COMBO_REPLAY` | `CHALLENGE_UNLOCK` | Echoing the last cast at half power is a skill toy. | `spell-echo-cast` |
| `LIFE_DRAIN` | `BOSS_ONLY` | `starter-drain` exists. Boss version feeds a growth loop. | — |
| `VAMPIRIC_AOE` | `BOSS_ONLY` | `spell-lifesteal-nova` exists. | — |
| `EXSANGUINATED_DEBUFF` | `PLAYER_LEARNABLE` | Single-target anti-heal / bleed with explicit `debuffStat`. | `spell-exsanguinate` |
| `INK_VEIL` | `BOSS_ONLY` | Vision / accuracy identity. `spell-shadow-veil` is the player analog. | — |
| `SCROLL_SUMMON` | `BOSS_ONLY` | Director. | — |
| `GLYPH_TRAP` | `PLAYER_LEARNABLE` | Close to `spell-mark`; adaptation is a **ground trap**, not a damage amp. | `spell-glyph-snare` |
| `PAGES_OF_DOOM` | `BOSS_ONLY` | Multi-wave director. | — |
| `DAWN_BUFF` | `BOSS_ONLY` | Twin-link. `spell-rallying-cry` is the player analog. | — |
| `DUSK_DOT` | `BOSS_ONLY` | Twin-link. `spell-inferno` is the player analog. | — |
| `MONARCH_ABSORB` | `BOSS_ONLY` | Dual-body director. | — |
| `ANCHOR_TILES` | `BOSS_ONLY` | Objective director. | — |
| `PHANTOM_SPAWN` | `BOSS_ONLY` | Director. | — |
| `AP_DRAIN_PASSIVE` | `BOSS_ONLY` | Aura. Would brick the 20 AP cap on the player bar. | — |
| `DAMAGE_IMMUNE` | `BOSS_ONLY` | Fight-structure. | — |

**Count:** 46 shipped specials. Player-facing **#137 adaptations: 8** (`PLAYER_LEARNABLE` 5 + `ACHIEVEMENT_UNLOCK` 3 + `CHALLENGE_UNLOCK` 2). #120 adds three first-victory `BOSS` grants (Pain Link, Glyph Tax, Blood Familiar) and one witness-only signature (Void Anchor). Wave 3 adds four **design-named** specials, not yet in the enum:

| Proposed special | Class | Player adaptation |
| :--- | :--- | :--- |
| `GRIEF_SIPHON` | `BOSS_ONLY` | — |
| `HOOK_REEL` (full-file / enrage) | `BOSS_ONLY` | Bounded #120 `spell-hook-line` |
| `PALISADE_COVER` (LOS through own stakes) | `BOSS_ONLY` | Bounded #120 `spell-stone-turret` |
| `TETHER_GATE` | `BOSS_ONLY` | — |

Most spectacular mechanics stay boss-only on purpose.

### 5.2 Discoverable spell catalog (adaptations only)

These ids **do not exist** in `spellData.ts` yet. If a later PR adds them, each row must become a real `SpellConfig` with the metadata below — no name checks.

#### `spell-ember-step` — from `LAVA_TRAIL`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Watch Crimson Countess leave lava **3** times in one fight (or across fights; persist a counter). |
| Victory | Defeat Crimson Countess after the observation is complete. |
| Adaptation | 2-tile trail from the caster’s last walk, 2 turns, `effectType: "dot"`, `dotType: "burn"`, `targetType: "ground"`, `areaShape: "line"`, `areaRadius: 2`, AP 3. **Cannot** paint more than 2 tiles. No Phase-2 river. |
| Why not full trail | Full-path lava plus existing Thorned Ground / lava walk would farm challenge damage and brick kiting. |

#### `spell-caltrop` — from `SPIKE_ON_LAND`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Be adjacent to Bone Cavalier on the turn a spike lands, **twice**. |
| Victory | Defeat Bone Cavalier. |
| Adaptation | Place **one** spike tile, 2 turns, `effectType: "defense"`, `targetType: "ground"`, `isBarrier: false`, new flag `isSpikeGlyph: true`, AP 3, range 2. |
| Why not landing spikes | Player knight-jumps do not exist yet; a landing aura would punish summons randomly. |

#### `spell-shock-glyph` — from `SHOCK_TILES`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Stand on or adjacent to a shock tile **3** times without dying. |
| Victory | Defeat Lord of Static. |
| Adaptation | One shock tile, 3 turns, no chain. `targetType: "ground"`, AP 3, range 3. Does **not** set `chainLightningActive`. |
| Why not chain | `CHAIN_LIGHTNING` is `BOSS_ONLY`; `starter-blast` already bounces units. |

#### `spell-exsanguinate` — from `EXSANGUINATED_DEBUFF`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Receive the Exsanguinated debuff **once** (survive it). |
| Victory | Defeat the Starved Vampire Pawn. |
| Adaptation | Single-target, `effectType: "dot"`, `dotType: "bleed"`, 3 turns, `debuffStat: "healRecv"`, `debuffModifier: 0.75` (weaker than Cursed Wound’s 0.5), AP 3, range 2. No self-heal. |
| Why not vampiric AoE | `spell-lifesteal-nova` already exists. |

#### `spell-glyph-snare` — from `GLYPH_TRAP`

| Field | Value |
| :--- | :--- |
| Class | `PLAYER_LEARNABLE` |
| Observation | Trigger or disarm (step off before detonation) a Pale Archivist glyph **twice**. |
| Victory | Defeat the Pale Archivist. |
| Adaptation | Ground tile, 2 turns; next enemy that **enters** it is Slowed (`debuffStat: "mp"`, −1, 1 turn) and takes a small hit. `targetType: "ground"`. Does **not** double the next spell (`isMark` stays on `spell-mark`). |
| Why not Mark | Mark already doubles damage. A second amp would be the same spell twice. |

#### `spell-vault` — from `KNIGHT_JUMP_IGNORE_WALLS`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | New feat `cavalier_witness` **or** existing `leader_slayer` **plus** one Bone Cavalier kill. Prefer a new condition `boss_vault_seen` so it is explicit. |
| Observation | See a wall-ignoring knight jump **3** times. |
| Victory | Defeat Bone Cavalier. |
| Adaptation | Once per battle (`isTimestep`-style flag `isOncePerBattle: true`), knight-shaped blink, AP 4, `effectType: "teleport"`, `targetType: "ground"`, does **not** leave spikes. |
| Why once | Unlimited wall-ignore deletes map-gen cover. |

#### `spell-brood-ward` — from `SHELL_ARMOR`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | `spell_master` (8 spells equipped) **and** one Broodmother Rook kill. |
| Observation | Break Shell Armor by clearing larvae at least **once**. |
| Victory | Defeat Broodmother Rook. |
| Adaptation | Self buff, `buffStat: "res"`, `buffModifier: 1.25`, duration 3, **ends immediately if the caster has no living allied summon**. AP 3. Weaker than `spell-iron-skin` (1.3) because it can be maintained. |

#### `spell-aftershock` — from `RESONANCE_SHOCKWAVE`

| Field | Value |
| :--- | :--- |
| Class | `ACHIEVEMENT_UNLOCK` |
| Gate | New feat `fortress_tuner` — take three resonance pulses in one Alabaster fight and win. |
| Observation | Three pulses survived. |
| Victory | Defeat the Alabaster Fortress. |
| Adaptation | After the caster is hit **3** times, emit a radius-1 nova (`areaShape: "circle"`, `areaRadius: 1`, 15 reference damage). Once per battle. No board shrink. |

#### `spell-rot-brand` — from `COMPOUNDING_ROT`

| Field | Value |
| :--- | :--- |
| Class | `CHALLENGE_UNLOCK` |
| Gate | Complete `legendary_1` (`no_damage_taken`) **or** `hard_1` (`no_healing_under_30_damage`) on Fetid Rook. |
| Observation | Reach 3 rot stacks on the player at least once in any Fetid fight (can be a prior death). |
| Victory | Defeat Fetid Rook with the challenge complete. |
| Adaptation | Single-target stack DoT, **max 3 stacks**, 3 dmg/turn reference, `dotType: "venom"`, AP 3. No twin-rook split. |

#### `spell-echo-cast` — from `COMBO_REPLAY`

| Field | Value |
| :--- | :--- |
| Class | `CHALLENGE_UNLOCK` |
| Gate | Complete `legendary_3` (`direct_hit`) on Mirror Sovereign. |
| Observation | Be hit by a replayed combo **once**. |
| Victory | Defeat Mirror Sovereign with `direct_hit` still valid. |
| Adaptation | Next spell the caster owns is recast at **50%** damage / heal, once per battle, AP 4. Cannot echo summons, `spell-timestep`, or `spell-sacrifice`. Explicit denylist in metadata (`echoDenyIds`). |

### 5.3 Proposed feat conditions (not seeded)

These are names for a later achievement PR. They are **not** in `defaultAchievements()` today.

| Proposed id | Condition key | Intent |
| :--- | :--- | :--- |
| `cavalier_witness` | `boss_vault_seen` | Saw wall-jump 3× and won Cavalier. |
| `fortress_tuner` | `resonance_three_pulses` | Three pulses + Alabaster win. |
| `rot_ascetic` | (reuse challenge persist) | Challenge unlock, not a feat. |
| `echo_duelist` | (reuse `legendary_3` on that boss) | Challenge unlock. |
| `anchor_breaker` | `void_anchors_eight` | Optional mastery for Enthroned Void. |
| `ghost_warden` | `final_pawn_no_ghost_wipe` | Optional mastery for Final Pawn. |

Do not mint Doka from these until `claimAchievementReward` is wired. Suggested feat Doka: 150–300, in line with `leader_slayer` / `critical_striker`.

### 5.4 Sibling contracts (2026-09-01)

Same-day design PRs own adjacent surfaces. This bible does not rewrite them.

| Sibling | Owns | How this bible attaches |
| :--- | :--- | :--- |
| #156 `SPELL_DISCOVERY_ECOSYSTEM` | Default pipeline: hostile **uses** an eligible id → OBSERVED → player **wins that battle** → unlock. Encounter start is not observation. Being hit is not required. | Kit-spell observation (when starters stop being innate) uses that default. **Boss-adaptation count-gates in §5.2 stay** (`see lava 3×`). #156 §3.3 allows count-gates on boss adaptations only. |
| #120 `SPELL_PROPOSALS` | 16 tactical ids (`spell-shoulder-bash` … `spell-void-anchor`) with acquisition models. | Do **not** invent a second id for the same fantasy. Wave 3 observation sources point at #120 ids. |
| #116 Spell Admin | Persist `ownedSpellIds` / `observedSpellIds`, soft-retire | Observation counters in §5.2 belong next to `achievementProgress`, not `localStorage`. |
| #143 Long Horizon | Live formulas explode XP and leave boss HP static | Confirms §3.1 is still the unbuilt no-cap fix. Do not “fix” XP curve from this doc. |

**Default vs boss-adaptation observation**

| Route | What “observed” means | Victory |
| :--- | :--- | :--- |
| #156 `ENEMY_DISCOVERY` | Hostile spent AP on that **spell id** (`kind: "cast"`). One use. | Same encounter (unless `allowLaterVictory`) |
| #137 `PLAYER_LEARNABLE` adaptations in §5.2 | Named count-gate on a **boss special** (trail, spike land, shock tile, …), not necessarily a kit-spell cast | Defeat that boss after the count |
| #120 `BOSS` (`observation` default **false**) | First victory vs listed `bossIds` | That boss defeat. No count-gate. |
| #137 `ACHIEVEMENT_UNLOCK` / `CHALLENGE_UNLOCK` | Feat condition or live `DEFAULT_CHALLENGES` id on that fight | Feat claim / challenge persist |

A boss may grant **both** a #137 adaptation and a #120 `BOSS` id. They are separate grants. First victory can award the #120 id while the #137 count-gate is still incomplete.

**Id collision — do not ship aliases**

| #137 (this bible) | #120 | Verdict |
| :--- | :--- | :--- |
| `spell-ember-step` | `spell-cinder-tile` | **Keep both.** Cinder Tile = one painted burn cell. Ember Step = 2-tile walk trail. Different verbs. |
| `spell-caltrop` | `spell-tripwire` | **Keep both.** Caltrop = visible one-tile spike. Tripwire = hidden enter-trap + root. |
| `spell-glyph-snare` | `spell-glyph-tax` / `spell-root-snare` | **Keep all three.** Snare = enter-slow one tile. Tax = 3×3 AP zone + Mark. Root = unit MP lock. |
| `spell-shock-glyph` | — | No #120 twin. Keep. |
| `spell-exsanguinate` | — | No #120 twin. Keep. |
| `spell-vault` | `spell-mist-step` | **Keep both.** Vault = once/battle knight-shaped blink through walls. Mist Step = 3-tile self-teleport, CD 2, no walls. |
| `spell-brood-ward` / `spell-aftershock` / `spell-rot-brand` / `spell-echo-cast` | — | No #120 twin. Keep. |
| — | `spell-pain-link` | First victory vs `alabaster_fortress` (#120 `BOSS`). Aftershock remains the #137 feat. |
| — | `spell-glyph-tax` | First victory vs `pale_archivist`. Glyph-snare remains the #137 count-gate. |
| — | `spell-blood-familiar` | First victory vs `starved_vampire_pawn`. Exsanguinate remains the #137 count-gate. |
| — | `spell-void-anchor` | `NOT_PLAYER_LEARNABLE`. Witness on `void_grandmaster` only. |
| — | `spell-hook-line` / `spell-stone-turret` | Wave 3 adds `bossIds` as extra `MULTI_SOURCE` doors. First grant wins. |

#156 Wave-1 ids (`spell-quiet-hex` …) stay on the ecosystem doc. Do not reuse them here.

---

## 6. Shared AI, arena, and QA rules

### 6.1 AI (all bosses)

Current `useBossAI.ts` **prefers the first off-cooldown kit spell every turn** (`pickBossKitSpell`). That flattens kits into a script. Intended priority, for a later AI pass:

1. Finish a telegraph if one is pending.
2. Answer the core mechanic (drop a shield, spawn if under cap, rotate a window).
3. Cast a kit spell only if it serves that mechanic (slow before a charge, mark before a line).
4. Move / attack.

Until that pass, the sheets describe **intended** AI, not the live first-spell loop.

### 6.2 Arena rules (defaults)

- 16×16 walkable field unless a sheet shrinks it (Alabaster Phase 2).
- Hazard cap 50.
- Boss-side living extras cap 4 (ghosts: 6).
- Portals remain blocked until victory / death — existing Death Realm 1.5s guards still apply after a wipe.
- Destructible objects are **not** enemies: they do not take turns and do not count as `enemiesDefeated`.

### 6.3 QA (defaults — every sheet inherits)

Verify without changing damage math:

1. Phase thresholds fire on **effective** HP fractions, once.
2. Enrage starts on `enrageTurn`, adds no HP, caps at +80%.
3. Minions / larvae / ghosts do not grant `level * 20` XP.
4. Rewards enqueue on `createProgressPersist` and `commit` after `applyRewards`.
5. Challenge HP from hazards / reflects uses the existing record helpers.
6. Discovery counters persist on the backend (or an explicit later store) — **not** only `localStorage`.
7. A player who never observes a learnable ability does not unlock it on a blind kill.
8. Boss Guide still shows the four offsets `[-2, 0, +2, +5]` after relative HP lands.
9. `validateBossKits()` still passes (3–5 catalog spells, Phase 2 adds one).
10. No `wp` / `wr` / `scp` on any payload.

---

## 7. Encounter sheets — shipped bosses

Kit spell ids below are the **live** `BOSS_KITS` entries. Special abilities keep their enum names. New intended systems (telegraphs, rotating vulns, objects) are named in prose until an implementation PR adds metadata.

RELATIVE_DIFFICULTY is the even-match rating from §3.2.

---

### BOSS_ID: `pale_archbishop`

**NAME:** The Pale Archbishop  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** Rotting liturgy. A bishop who turns the nave into a courtroom: curse, martyr, then a mirrored pulpit.  
**CORE_MECHANIC:** Curse on contact + a **Reliquary** that powers Reflect Shield. Destroy the reliquary to drop the mirror; leave it and Phase 2 is a reflect check.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Diagonal pressure, `CURSE_ON_HIT`, kit: Cursed Wound / Shadow Veil. One **Reliquary** (destructible) sits on the opposite color complex. |
| 2 | ≤ 50% | Reflect Shield **only if the Reliquary still stands**. Spawn 2 kneeling wisps (cap 4). Sacrifice + Summon Wisp enter the pool. |
| Enrage | turn 18 | Pulpit Slam telegraph: 1-turn diagonal line through the player. Reliquary (if alive) heals 5% boss HP — still no enrage HP gift beyond that object. |

**SPELLS:** `spell-cursed-wound`, `spell-shadow-veil`, `spell-sacrifice` (P2), `summon-wisp` (P2).  
**DISCOVERABLE_SPELLS:** none. `CURSE_ON_HIT` and `REFLECT_SHIELD` are `BOSS_ONLY` (`spell-cursed-wound` / `spell-mirror` already exist).

**AI:** Close on the player’s color complex. If the Reliquary is down, never recast Reflect. Prefer Sacrifice only when boss HP > 30%.  
**ARENA_RULES:** Chapel palette (`oklch(35% 0.05 270)`). Reliquary on a bishop-reachable tile, not adjacent to spawn.  
**SUMMONS:** Phase 2, 2 wisps, healer AI, count against the 4-cap.  
**PLAYER_COUNTERPLAY:** Break the Reliquary first; curse-cleanse via distance; do not dump a nova into an up shield.  
**MASTERY_OBJECTIVE:** Kill him with the Reliquary still up and without casting a heal (`easy_1` or `hard_1`). Cosmetic feat only — no spell.  
**REWARDS:** Live multipliers 5 Doka / 3 XP. Feat Doka only if mastery is later seeded.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.25** (was 1.4).  
**BALANCE_RISKS:** Reflect + Sacrifice + player `spell-mirror` can loop; shield duration must stay 2 turns. Reliquary HP too high → sponge.  
**QA:** Reliquary death drops shield the same turn. Wisps grant 0 XP. Curse apply still increments challenge damage if the hit lands.  
**STATUS:** PROPOSED

---

### BOSS_ID: `crimson_countess`

**NAME:** Crimson Countess  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** A rook crowned in blood roses. She paints the file she walks.  
**CORE_MECHANIC:** Movement-taxing lava. Phase 2 turns her path into a river. The learnable spell is a **short** ember step, not the river.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Inferno + Life Drain. No lava yet. Telegraph **Rose Charge**: 1-turn rook-file dash. |
| 2 | ≤ 40% | `LAVA_TRAIL` on every move. Enrage + Lifesteal Nova in the kit. |
| Enrage | turn 18 | Charge resolves same turn as telegraph. |

**SPELLS:** `spell-inferno`, `starter-drain`, `spell-enrage` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-ember-step` (`LAVA_TRAIL` → `PLAYER_LEARNABLE`). See §5.2.

**AI:** Prefer files aligned with the player. After a charge, step one tile to leave lava if Phase 2.  
**ARENA_RULES:** Existing lava type, cap 50. Rose Charge tiles highlight before she moves.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Leave the file; do not stand in her wake; anti-heal (`spell-cursed-wound`) to blunt drain.  
**MASTERY_OBJECTIVE:** Win without stepping on lava (movement check).  
**REWARDS:** 5 / 3. Ember Step is the real prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.30** (was 1.5). Lava tick = 4% player max HP (guideline).  
**BALANCE_RISKS:** Lava + Thorned Ground double-taxes Untouchable. Ember Step must not paint 8 tiles.  
**QA:** Lava walk uses `recordInBattleChallengeDamage` while `inBattleRef`. Observation counts **her** trail, not player Ember Step.  
**STATUS:** PROPOSED

---

### BOSS_ID: `void_grandmaster`

**NAME:** The Void Grandmaster  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A king who treats the board as a variation set. Illusions are the puzzle; Swap is the insult.  
**CORE_MECHANIC:** Identify the real body. Hitting a fake wastes the turn and **marks you** (existing `spell-mark` on your tile) so his next blast double-taps.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 60% | `TELEPORT_ADJACENT`, kit blast / swap / mirror. |
| 2 | ≤ 60% | `ILLUSION_SPLIT` — 3 bodies, one real. Teleport remains. Timestep + Frost Nova enter. |
| Enrage | turn 21 | Illusions also teleport; fakes no longer die in one hit (they take 1, then fade). |

**SPELLS:** `starter-blast`, `spell-swap`, `spell-mirror`, `spell-timestep` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none player-owned. #120 `spell-void-anchor` is `NOT_PLAYER_LEARNABLE` / `BOSS_ONLY` — witness-only on this fight so the player learns to combo Hook + Root later, never the group-pull signature. Split and adjacent-teleport stay `BOSS_ONLY`.

**AI:** Swap when the player is set up on a file for a nova. Split as soon as Phase 2 starts, not every turn.  
**ARENA_RULES:** Dimensional palette. Illusions occupy tiles (block walk).  
**SUMMONS:** Illusions are **not** minions and do not count toward the 4-cap; they are `IllusionData`. No XP.  
**PLAYER_COUNTERPLAY:** AoE (`spell-frost-nova`, Inferno DoT on the real one after a reveal). Watch who casts Swap — only the real copy swaps.  
**MASTERY_OBJECTIVE:** Never hit a fake (movement / targeting check).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.25** (was 1.3). Illusion HP = 15% of boss effective HP (real copy uses full).  
**BALANCE_RISKS:** Timestep on a boss resets his AP — once per fight, already in kit. Player Timestep plus his Swap can yo-yo; acceptable.  
**QA:** Killing a fake does not trigger victory. Real copy’s HP is the phase trigger.  
**STATUS:** PROPOSED

---

### BOSS_ID: `bone_cavalier`

**NAME:** Bone Cavalier  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** Fused knight. Cover is a suggestion.  
**CORE_MECHANIC:** Telegraph a knight-landing, then spike the landing ring. Movement check: do not stand on the three landing candidates.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | `KNIGHT_JUMP_IGNORE_WALLS`. Haste in kit. Three tiles glow (possible landings). |
| 2 | ≤ 50% | `SPIKE_ON_LAND` on the landing ring. Enrage + Expose in kit. |
| Enrage | turn 19 | Two jumps in one turn (second is untelegraphed — this is the punishment). |

**SPELLS:** `physical_attack`, `spell-haste`, `spell-enrage` (P2), `spell-expose` (P2).  
**DISCOVERABLE_SPELLS:** `spell-vault` (`ACHIEVEMENT_UNLOCK`), `spell-caltrop` (`PLAYER_LEARNABLE`).

**AI:** Jump to the candidate that flanks (side/rear), not the closest.  
**ARENA_RULES:** Walls stay; he ignores them, the player does not.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Stand off all three glows; punish the landing tile; Expose is a tell to kite.  
**MASTERY_OBJECTIVE:** Never be adjacent on a landing turn.  
**REWARDS:** 5 / 3 plus the two discoverables.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.35** (was 1.6).  
**BALANCE_RISKS:** Player Vault once/battle is enough. Spikes + existing spike walk must both debit challenges.  
**QA:** Landing glow is visible before the jump. Vault cannot be observed from *his* jump to skip the 3-see gate.  
**STATUS:** PROPOSED

---

### BOSS_ID: `weeping_pawn`

**NAME:** The Weeping Pawn  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** Grief as promotion. The pawn is slow until it is a queen.  
**CORE_MECHANIC:** A **Wail Mark** (target mark) on the player every 3 turns — fail a movement check (must leave the marked tile) or take a sob hit. Promotion is the phase change, not a surprise one-shot.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 30% | Slow / Weaken / curse. Wail Mark cadence. High RES, low INIT. |
| 2 | ≤ 30% | `PROMOTE_QUEEN` + `ATTACK_ALL_LINES`. Iron Skin + Rallying Cry in kit. **One-turn telegraph** before the first all-lines volley. |
| Enrage | turn 19 | All-lines loses the telegraph (enrage rule). |

**SPELLS:** `physical_attack`, `spell-slow`, `spell-weaken`, `spell-iron-skin` (P2), `spell-rallying-cry` (P2).  
**DISCOVERABLE_SPELLS:** none. Promote and all-lines are `BOSS_ONLY`.

**AI:** Advance like a pawn until promotion; then sit on a central intersection.  
**ARENA_RULES:** Marked tile is visible (use Mark VFX, not a hidden hex).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Burst before 30%, or step off the mark and stand off-axis after promotion (not on rank, file, *or* diagonal).  
**MASTERY_OBJECTIVE:** Kill in Phase 1 (never allow promotion).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.40** (was **2.0**). Catalog 500 HP is a sponge — retire it for the ratio.  
**BALANCE_RISKS:** All-lines + Starborn Queen teaches the same stance; Weeping’s version is slower and telegraphed. Rallying Cry heal is 20 flat — at high level this is flavor, not a stall. Do not convert that heal to % HP.  
**QA:** Promotion happens once. Mastery fails if Phase 2 flags.  
**STATUS:** PROPOSED

---

### BOSS_ID: `starborn_queen`

**NAME:** Starborn Queen  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen whose body is a sky. Lines are constellations; voids are dead stars.  
**CORE_MECHANIC:** `ATTACK_ALL_LINES` from the start, plus **rotating line vulnerability** — she takes +40% from attacks that travel on this turn’s window (rank → file → diagonal). Void tiles in Phase 2 delete stands.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | All-lines every 2 turns (1-turn telegraph). Kit blast + Mark. Vuln window cycles. |
| 2 | ≤ 50% | `VOID_TILES` (2–3 per pulse, cap 50). Frost Nova + Shadow Veil. |
| Enrage | turn 21 | All-lines every turn, still telegraphed until stack 1 of enrage. |

**SPELLS:** `starter-blast`, `spell-mark`, `spell-frost-nova` (P2), `spell-shadow-veil` (P2).  
**DISCOVERABLE_SPELLS:** none. Lines and void are `BOSS_ONLY`.

**AI:** Stand on intersections. Mark the tile she expects you to dodge *to*.  
**ARENA_RULES:** Void is unwalkable. Do not void the player spawn or the only path to her.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Attack along the glowing vuln window; never end a turn on a constellation line.  
**MASTERY_OBJECTIVE:** Deal the killing blow on a Window C (diagonal) turn.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Void + board shrink (Alabaster) in Boss Rush room 3 pairing with Enthroned Void is already a combined mechanic — do not add more holes in rush.  
**QA:** Vuln window is visible on her tile. Void does not soft-lock movement.  
**STATUS:** PROPOSED

---

### BOSS_ID: `fetid_rook`

**NAME:** The Fetid Rook  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A rook of compost. Hits stack rot; at the threshold it becomes two problems.  
**CORE_MECHANIC:** `COMPOUNDING_ROT` plus a **split** that is a summon-management check, not a HP double-dip.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Venom / Poison. Each connecting hit adds one rot stack (no hidden cap in the boss version). |
| 2 | ≤ 40% | `SPLIT_ROOKS` — **one** extra rook at **50% of remaining HP**, not a second full bar. Twin nova in kit. |
| Enrage | turn 19 | Both bodies gain +8%/turn independently (still +80% cap **per body**). |

**SPELLS:** `spell-venom-strike`, `starter-poison`, `spell-cursed-wound` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-rot-brand` (`CHALLENGE_UNLOCK`).

**AI:** After split, twins take opposite files.  
**ARENA_RULES:** Split rook counts as the second boss body for Twin-style targeting; only the **original id** dropping to 0 is victory if the twin is already dead. If the original dies first, the twin becomes the boss (existing split feel).  
**SUMMONS:** The twin is a split, not a minion. No extra XP.  
**PLAYER_COUNTERPLAY:** End the fight before 5 stacks; focus one body after split.  
**MASTERY_OBJECTIVE:** Win with ≤ 2 rot stacks **and** a qualifying challenge (`hard_1` or `legendary_1`) for the brand.  
**REWARDS:** 5 / 3. Rot Brand is the prize.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 mult **1.00** (keep — split is the escalation).  
**BALANCE_RISKS:** Uncapped boss rot vs player % HP ticks. Boss rot should stay **flat per stack** (existing DoT), not % HP. Player brand caps at 3.  
**QA:** Split once. Twin death ≠ extra `applyRewards`. Observation of 3 stacks can come from a failed attempt.  
**STATUS:** PROPOSED

---

### BOSS_ID: `eternal_pawn_king`

**NAME:** Eternal Pawn King  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A pawn that has walked for centuries. The file in front of him is inevitable.  
**CORE_MECHANIC:** `ADVANCE_PER_TURN` + resource pressure (`AP_DRAIN` in Phase 2). **Promotion rank** is a destructible **Milestone Stone** three tiles ahead of him: destroying it **resets his advance by 2 tiles** (once per stone, 3 stones).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Advance + Slow / Drain Courage. Stones on his file. |
| 2 | ≤ 50% | `AP_DRAIN` (−1 AP on the player at the start of his turn). Iron Skin + Cursed Wound. |
| Enrage | turn 20 | Advance becomes 2 tiles. |

**SPELLS:** `spell-slow`, `spell-drain-courage`, `spell-iron-skin` (P2), `spell-cursed-wound` (P2).  
**DISCOVERABLE_SPELLS:** none. Advance and AP drain aura are `BOSS_ONLY`.

**AI:** Always forward on his file unless blocked; then sidestep one and resume.  
**ARENA_RULES:** If he reaches the player’s back rank, he does **not** promote (Weeping owns that fantasy). He instead gains a 1-turn all-adjacent smash (telegraphed).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break stones, kite off-file, plan 1-AP turns in Phase 2 (`hard_3` is a natural pairing).  
**MASTERY_OBJECTIVE:** Win without letting him advance more than 6 tiles net.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.25** (was 1.3). Drain stays −1 AP, never % of bar.  
**BALANCE_RISKS:** −1 AP + Slow −2 MP can stall new players; keep drain to Phase 2.  
**QA:** Stones are not enemies. Advance does not path through voids created by other rush partners.  
**STATUS:** PROPOSED

---

### BOSS_ID: `midnight_bishop`

**NAME:** Midnight Bishop  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** Two bishops, one soul. Diagonals are jaws.  
**CORE_MECHANIC:** `TWIN_FLANK` until `MERGE_BISHOPS`. Shared HP. Standing on a color complex that **both** can see is a movement fail.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 25% | Twin flank, Cursed Wound / Mirror / Shadow Veil. |
| 2 | ≤ 25% | Merge + `MAGIC_REFLECT`. Swap + Frost Nova. Stat spike is **positioning**, not 2× stats. |
| Enrage | turn 21 | Merged form casts Swap then Nova the same turn. |

**SPELLS:** `spell-cursed-wound`, `spell-mirror`, `spell-shadow-veil`, `spell-swap` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none.

**AI:** Twins occupy opposite colors. They never stand on the same complex.  
**ARENA_RULES:** Shared HP bar. Killing “one” is impossible; damage on either body hits the pool.  
**SUMMONS:** none (the twin is a body).  
**PLAYER_COUNTERPLAY:** Stand on a file that only one diagonal can see; burst before merge; physical Strike into Magic Reflect.  
**MASTERY_OBJECTIVE:** Force merge with both bodies at ≥ 20% of the shared bar (no “execute one then merge a stub”).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.00 (shared), atkRatio 1.10, offset +1, Phase-2 mult **1.35** (was **2.0**).  
**BALANCE_RISKS:** Shared HP + 2.0 old multiplier was a sponge. Reflect + player Sacrifice can self-kill — keep reflect as **next spell only**, not a % aura.  
**QA:** One victory. One XP grant.  
**STATUS:** PROPOSED

---

### BOSS_ID: `broodmother_rook`

**NAME:** Broodmother Rook  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A hollow rook. The children are the armor.  
**CORE_MECHANIC:** Summon management. `SHELL_ARMOR` while any larva lives. Phase 2 larvae explode.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | 1 larva / pulse, shell on. Archer summon in kit. |
| 2 | ≤ 50% | 2 larvae / pulse, `LARVAE_EXPLODE`, Iron Skin + Nova. |
| Enrage | turn 20 | Larvae spawn on her move tiles (still cap 4 extras: larvae + archer share the cap). |

**SPELLS:** `summon-archer`, `spell-venom-strike`, `spell-iron-skin` (P2), `spell-lifesteal-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-brood-ward` (`ACHIEVEMENT_UNLOCK`).

**AI:** Never spend a turn spawning if already at cap. Prefer venom on the player when shell is down.  
**ARENA_RULES:** Larvae 1 HP, existing `LarvaData`. Explode = poison DoT on adjacent, existing.  
**SUMMONS:** Larvae + kit archer. Cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Clear larvae at range, then burst the shell-less rook. Do not stand adjacent on death.  
**MASTERY_OBJECTIVE:** Kill her while 0 larvae live (shell down) and keep a player summon alive the whole fight (teaches Brood Ward).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.25** (was 1.4). Catalog 480 + 25 RES is a sponge — RES stays high, HP uses the ratio.  
**BALANCE_RISKS:** Shell + Iron Skin + high RES. Shell should be a **flat damage reduction flag**, not another 30% RES stack, or she becomes unkillable at high player ATK too (wait — high player ATK breaks shells). Prefer: shell = **ignore the first hit each turn** while larvae live. That stays fair at any level.  
**QA:** Shell drops the instant last larva dies. Explode credits challenge HP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `lord_of_static`

**NAME:** Lord of Static  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A king who is a walking circuit.  
**CORE_MECHANIC:** Shock tiles as a growing graph. Phase 2 the graph sparks. Rotating vuln: **odd turns physical, even turns spell** (2-step, not 3 — he is a metronome).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | `SHOCK_TILES` on move. Blast + Haste. |
| 2 | ≤ 40% | `CHAIN_LIGHTNING` across shock clusters. Frost Nova + Expose. |
| Enrage | turn 20 | New shock tiles start already chained. |

**SPELLS:** `starter-blast`, `spell-haste`, `spell-frost-nova` (P2), `spell-expose` (P2).  
**DISCOVERABLE_SPELLS:** `spell-shock-glyph` (`PLAYER_LEARNABLE`). Chain stays `BOSS_ONLY`.

**AI:** Move to extend a connected shock component toward the player, not random.  
**ARENA_RULES:** Existing `ShockTile`. Generation counter already wipes stale VFX — keep it.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Hit him on the vuln step; stand off clusters; Barrier to break a chain line.  
**MASTERY_OBJECTIVE:** Win with ≤ 3 shock tiles existing at victory.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Chain + player standing on a cluster + lava from rush partner (room 2 with Cavalier). Combined mechanic already says Cavalier channels Static — do not also make spikes chain.  
**QA:** Shock-glyph observation counts **his** tiles. `shockTileGeneration` increments on wipe.  
**STATUS:** PROPOSED

---

### BOSS_ID: `final_pawn`

**NAME:** The Final Pawn  
**RELATIVE_DIFFICULTY:** 10  
**THEME:** An ordinary pawn that is the whole graveyard.  
**CORE_MECHANIC:** A meek Phase 1, then a **structured** invuln window while ghosts appear. Not `statMultiplier: 999`. Not 11 simultaneous bosses.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 10% | Physical only. He looks like a trash pawn. Resource pressure: he does almost nothing — the trap is overcommitting AP. |
| 2 | ≤ 10% | `INVINCIBLE_PHASE` for **3 turns** (not infinite). `GHOST_SUMMON` **4** ghosts (was 11), cap 6. Kit: Timestep, Sacrifice, Dire Wolf. |
| Enrage | turn 24 | If ghosts remain, he extends invuln by **1** turn (once). |

**SPELLS:** `physical_attack`, `spell-timestep` (P2), `spell-sacrifice` (P2), `summon-dire-wolf` (P2).  
**DISCOVERABLE_SPELLS:** none.

**AI:** Phase 1: walk and Strike. Phase 2: Timestep immediately, then Sacrifice only if HP > 1 after invuln drops.  
**ARENA_RULES:** Ghosts are faded kits (one ability each), 0 XP, 40% of a normal minion HP budget.  
**SUMMONS:** 4 ghosts + optional wolf, cap 6.  
**PLAYER_COUNTERPLAY:** Save AP/MP for the invuln window; kill ghosts or ignore and burst him when the shield drops; do not spend Timestep in Phase 1.  
**MASTERY_OBJECTIVE:** Win without killing any ghost (`ghost_warden`).  
**REWARDS:** Keep 10 Doka / 5 XP multipliers — this is the roster closer. Ghosts grant 0 XP or the closer would print a full raid table.  
**SCALING_BEHAVIOUR:** hpRatio 2.60, atkRatio 1.15, offset +2, Phase-2 mult **1.20** (**not 999**). Invuln is a flag + turn counter (`invincibleTurnsLeft`), already on `BossState`.  
**BALANCE_RISKS:** 11 ghosts + 999 was untestable and XP-toxic. Sacrifice at 1 HP is a suicide — AI must not.  
**QA:** Invuln expires. Victory when the pawn dies, even if ghosts live. Mastery fails if any ghost HP hits 0.  
**STATUS:** PROPOSED

---

### BOSS_ID: `alabaster_fortress`

**NAME:** The Alabaster Fortress  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A pawn that is a building. You do not chip a wall; you tune it until it cracks.  
**CORE_MECHANIC:** `RESONANCE_SHOCKWAVE` — stored incoming damage becomes a pulse. Phase 2 `BOARD_SHRINK`. Destructible **Buttresses** (2) delay shrink by 2 turns each.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 30% | High RES/SP, low ATK. Resonance every 3 incoming hits (existing counter). Kit: Strike, Iron Skin, Shield. |
| 2 | ≤ 30% | Board shrink + Barrier + Frost Nova. Pulses keep firing. |
| Enrage | turn 21 | Shrink ticks every turn. |

**SPELLS:** `physical_attack`, `spell-iron-skin`, `starter-shield`, `spell-barrier` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** `spell-aftershock` (`ACHIEVEMENT_UNLOCK`, §5.2). #120 `spell-pain-link` (`BOSS` route — first victory, no count-gate). Two grants, different verbs.

**AI:** Does not chase. Pulses from center.  
**ARENA_RULES:** Shrink leaves a walkable core; never seals the player in a 1-tile pocket (Boss Rush already punched wall/void seals — keep that promise).  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Hit in 2s, step off pulse rings; break buttresses if you need time; DoTs still feed resonance — commit to bursts.  
**MASTERY_OBJECTIVE:** Survive 3 pulses and win (`fortress_tuner`).  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 mult **1.20**. Catalog RES 60 / SP 40 stay as **ratios of player RES/SP**, not raw 60 at L80.  
**BALANCE_RISKS:** Resonance stored as raw damage explodes at high ATK. Store **hit count**, pulse = `8% playerMaxHp` (or existing flat at L1). Do not store 400 damage and echo it.  
**QA:** Buttresses 0 XP. Shrink + existing map solvability.  
**STATUS:** PROPOSED

---

### BOSS_ID: `chessboard_lich`

**NAME:** The Chessboard Lich  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A king on a floating throne who edits the problem while you solve it.  
**CORE_MECHANIC:** Arena mutation. `MAP_ROTATE` then `MIRROR_INVERT` + `BOARD_CLAIM`. **Claim pylons** (2 destructibles) are the only way to freeze a claim zone.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Rotate every 4 turns (telegraphed: rim tiles flash). Kit: Swap, Mark, Veil, Cursed Wound. |
| 2 | ≤ 50% | Invert safe/hazard colors. Claim a 3×3. Wisp in kit. |
| Enrage | turn 22 | Rotate + invert can coincide. |

**SPELLS:** `spell-cursed-wound`, `spell-swap`, `spell-mark`, `spell-shadow-veil`, `summon-wisp` (P2).  
**DISCOVERABLE_SPELLS:** none. All three specials are `BOSS_ONLY`.

**AI:** Mark the tile you will be rotated onto.  
**ARENA_RULES:** Rotation must preserve a walkable path (same family of bug as #97 / #110 — do not reseal).  
**SUMMONS:** 1 wisp, cap 4.  
**PLAYER_COUNTERPLAY:** Stand near center before rotate; break pylons to pin a claim; physical pressure (low RES).  
**MASTERY_OBJECTIVE:** Win without being swapped.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.25**. Catalog 200 HP is a glass cannon — the ratio makes him a **puzzle timer**, not a 200-HP joke at L1 or a joke at L40.  
**BALANCE_RISKS:** Rotate + Void tiles (rush with Queen) can trap. Combined-mechanic sheet already exists — implementation must test that room.  
**QA:** Claim zone is not an enemy. Invert does not invert void into walls that seal portals.  
**STATUS:** PROPOSED

---

### BOSS_ID: `mirror_sovereign`

**NAME:** The Mirror Sovereign  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A queen of black glass. Your last three casts are hers.  
**CORE_MECHANIC:** `SPELL_MIRROR` then `COMBO_REPLAY`. Target mark on **you**: the next spell you cast is the one she queues.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Mirror next spell. Kit: blast, mirror, mark. |
| 2 | ≤ 50% | Replay last 3-cast buffer (`lastThreeTurnsMirror`). Veil + Swap. |
| Enrage | turn 22 | Replay becomes 100% (was 100% on her side already — player echo is 50%). She also mirrors **physical** Strike. |

**SPELLS:** `starter-blast`, `spell-mirror`, `spell-mark`, `spell-shadow-veil` (P2), `spell-swap` (P2).  
**DISCOVERABLE_SPELLS:** `spell-echo-cast` (`CHALLENGE_UNLOCK` via `legendary_3`).

**AI:** Mark, then wait for you to spend. Replay when the buffer has 3 damaging casts.  
**ARENA_RULES:** Dark glass palette. No extra hazards unless she Marks a glyph.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Cast utility (Slow, Barrier, Shield) into the mirror; vary damage spells; `direct_hit` challenge is the hard unlock.  
**MASTERY_OBJECTIVE:** `legendary_3` on this fight (Chebyshev ≤ 2) — the echo unlock.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.30** (was 1.5).  
**BALANCE_RISKS:** Replaying Sacrifice or Timestep is banned for her too (same denylist as echo). Player Inferno replayed is fair (cooldown exists).  
**QA:** Buffer does not persist across fights. Echo deny list is metadata, not `if (name.includes("Sacrifice"))`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `starved_vampire_pawn`

**NAME:** The Starved Vampire Pawn  
**RELATIVE_DIFFICULTY:** 3  
**THEME:** A pawn who is hunger. The fight is a leak, not a wall.  
**CORE_MECHANIC:** `LIFE_DRAIN` growth **capped at 200% of start HP**. Phase 2 AoE drain + Exsanguinated. Optional **Blood Font** (destructible) that, if destroyed, **halves** his heal-from-drain for 3 turns.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Until he has drained `0.5 * playerMaxHp` **or** he is reduced to 1% — whichever first | Drain / Drain Courage. Tiny start HP (ratio 1.30, but start-of-fight HP is the budget; he grows). |
| 2 | After the drain quota or 1% | `VAMPIRIC_AOE`, `EXSANGUINATED_DEBUFF`. Haste + Nova. |
| Enrage | turn 17 | Drain heals no longer diminished by the Font. |

**SPELLS:** `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` (P2), `spell-haste` (P2).  
**DISCOVERABLE_SPELLS:** `spell-exsanguinate` (`PLAYER_LEARNABLE`, §5.2). #120 `spell-blood-familiar` (`BOSS` route — first victory, intended P2 chump-block).

**AI:** Stay at range 2 (drain range). Only step in for Nova.  
**ARENA_RULES:** Font opposite the player spawn.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break the Font; anti-heal; burst before the 200% cap. Do not stand adjacent in Phase 2.  
**MASTERY_OBJECTIVE:** Kill him before he ever reaches 150% start HP.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.30 as **starting** HP, atkRatio 0.85, offset +0, Phase-2 mult 1.0. Catalog 60 is the L1 reference. Cap growth at 2.0× start.  
**BALANCE_RISKS:** Uncapped drain vs high player HP becomes a second Final Pawn. The 200% cap is mandatory. Phase trigger `hpThreshold: 0.01` today never really “phases” if he heals — use the **drain quota** as the real trigger.  
**QA:** Growth cap. Font 0 XP. Exsanguinate observation = receiving the debuff once.  
**STATUS:** PROPOSED

---

### BOSS_ID: `pale_archivist`

**NAME:** The Pale Archivist  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A rook that is a library. Scrolls fight. Ink hides the floor.  
**CORE_MECHANIC:** Summon management + ground traps. `INK_VEIL` / `SCROLL_SUMMON` / `GLYPH_TRAP`, then `PAGES_OF_DOOM` (telegraphed multi-page). Rotating vuln by **spell school you have used most** — he resists that school (existing `spellSchoolUsageCounts`).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 3 scrolls, glyphs, ink. Kit: Mark, Barrier, Archer, Cursed Wound. |
| 2 | ≤ 40% | Pages of Doom (3 telegraphed waves). Veil in kit. Scroll cap 2 new. |
| Enrage | turn 22 | Pages lose gaps between waves. |

**SPELLS:** `spell-cursed-wound`, `spell-mark`, `spell-barrier`, `summon-archer`, `spell-shadow-veil` (P2).  
**DISCOVERABLE_SPELLS:** `spell-glyph-snare` (`PLAYER_LEARNABLE`, §5.2). #120 `spell-glyph-tax` (`BOSS` route — first victory, intended P2 3×3 AP zone). Not the same spell.

**AI:** Glyph the tile you just left. Scrolls kite. Pages aim at last player tile + adjacent.  
**ARENA_RULES:** Ivory stacks. Glyphs visible as faint ink after 1 turn (fairness).  
**SUMMONS:** Scrolls as archers, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Vary schools; trigger glyphs with a summon; Barrier to break a page line.  
**MASTERY_OBJECTIVE:** Win with 0 scroll kills (ignore them) — summon-management restraint.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 mult **1.20**.  
**BALANCE_RISKS:** School resist + Shadow Veil can stack. Resist is **−20%** to the most-used school, not immunity.  
**QA:** Glyph-snare observation counts his glyphs. Pages are telegraphs, not instant.  
**STATUS:** PROPOSED

---

### BOSS_ID: `twin_monarchs`

**NAME:** The Twin Monarchs  
**RELATIVE_DIFFICULTY:** 9  
**THEME:** Dawn and Dusk on one cord.  
**CORE_MECHANIC:** Two bodies, two jobs (`DAWN_BUFF`, `DUSK_DOT`). `MONARCH_ABSORB` if one dies first. **Kill them within 2 turns of each other** or the survivor is the real boss.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Both alive | Dawn heals/CHC, Dusk burns. One wisp. |
| 2 | First death | Absorb: survivor +40% damage (existing 1.4), both kits. |
| Enrage | turn 23 | Absorb happens **even if both live** (they fuse without a corpse) — punish long fights. |

**SPELLS:** `spell-rallying-cry`, `spell-inferno`, `spell-enrage` (P2), `spell-iron-skin` (P2).  
**DISCOVERABLE_SPELLS:** none.

**AI:** Dawn stays back, Dusk walks. They never stack on one tile.  
**ARENA_RULES:** Two combatants, two HP bars, **one encounter**. Victory when **both** are dead.  
**SUMMONS:** 1 wisp, cap 4.  
**PLAYER_COUNTERPLAY:** Split damage; save a burst to clip the second within 2 turns; interrupt Dawn’s cry.  
**MASTERY_OBJECTIVE:** Simultaneous kill (both die on the same player turn). Extra Doka feat if seeded.  
**REWARDS:** 7 / 5. Both bodies count as boss XP (the one exception in §3.4).  
**SCALING_BEHAVIOUR:** Each body hpRatio **1.40** (together ~2.8, but you can focus), atkRatio 1.20, offset +2, Phase-2 mult **1.35** (was 1.4).  
**BALANCE_RISKS:** Absorb + Enrage + Iron Skin. If the player executes one at 1% and cannot clip the other, the fight should be hard, not hopeless — absorbed HP is **remaining HP of the survivor**, not a full refill.  
**QA:** Recap once. Persist once. `monarchKilledFirst` drives VFX only.  
**STATUS:** PROPOSED

---

### BOSS_ID: `enthroned_void`

**NAME:** The Enthroned Void  
**RELATIVE_DIFFICULTY:** 9  
**THEME:** An empty throne. The mist is the king.  
**CORE_MECHANIC:** `DAMAGE_IMMUNE` until **8 anchors** die. Then a short, vicious Phase 2 with `AP_DRAIN_PASSIVE`. Phantoms are the tax.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | Immune until `anchorsDestroyed >= 8` | Anchors + 2 phantoms. Kit: Swap, Slow, Wolf. |
| 2 | After the 8th anchor | Immunity drops. Veil + Frost Nova. −1 AP each of **his** turns (`apDrainLastTurn` guard — once per turn). |
| Enrage | turn 23 | If anchors remain, 2 anchors shatter themselves and he pulses (do not soft-lock a player who cannot find the 8th). |

**SPELLS:** `spell-swap`, `spell-slow`, `summon-dire-wolf`, `spell-shadow-veil` (P2), `spell-frost-nova` (P2).  
**DISCOVERABLE_SPELLS:** none. Anchors / immune / aura are `BOSS_ONLY`.

**AI:** Swap the player onto a phantom. Do not recast immunity.  
**ARENA_RULES:** 8 anchors on the rim, walkable access, HP = `0.15 * playerMaxHp` each. Phantoms cap the 4-extra budget with the wolf.  
**SUMMONS:** Phantoms + wolf, cap 4.  
**PLAYER_COUNTERPLAY:** Clear anchors, ignore or kite phantoms, dump the bar when immunity drops; plan 1-AP turns.  
**MASTERY_OBJECTIVE:** Destroy all 8 anchors and win without killing a phantom (`anchor_breaker`).  
**REWARDS:** 8 / 6.  
**SCALING_BEHAVIOUR:** hpRatio 2.40 (Phase 2 bar — Phase 1 HP is irrelevant while immune), atkRatio 1.20, offset +2, Phase-2 mult **1.40** (was 1.6).  
**BALANCE_RISKS:** Immune + rush pairing with Starborn Queen voids. Enrage self-shatter prevents “lost the last anchor in a hole.” Drain once per his turn, not once per action.  
**QA:** 8th anchor triggers Phase 2 the same turn. Anchors 0 XP.  
**STATUS:** PROPOSED

---

## 8. Encounter sheets — Wave 2 (not in `BOSS_IDS`)

These four fill the skipped “boss 15” slot and the systems the shipped 19 only half-cover: a **primary** rotating-vuln charger, a **primary** movement-mark, a **primary** enrage clock with objects, and a **primary** silence-lane summon conductor.

They are **not** in Boss Rush until a later pairing pass. Do not add ids to `BOSS_IDS` in this PR.

---

### BOSS_ID: `cinder_lance`

**NAME:** The Cinder Lance  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** The missing #15. A knight of coals and hoarfrost. Each charge is a sentence; the element he is wearing is the only one that wounds him.  
**CORE_MECHANIC:** Telegraph a **straight 5-tile lance**. Rotating vulnerability: Fire window (burn / Inferno / ember) vs Frost window (Frost Bolt / Nova). Wrong element is −50% (not 0 — never a brick).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Lance every 3 turns. Window swaps every 3 turns. Kit proposal (when added): `spell-inferno`, `starter-frost`, `spell-haste`. |
| 2 | ≤ 45% | Lance leaves a 2-tile cinder **or** rime line matching the window. `spell-expose`, `spell-enrage`. |
| Enrage | turn 20 | Two lances, crossing. |

**SPELLS (proposed kit):** `spell-inferno`, `starter-frost`, `spell-haste`, `spell-expose` (P2), `spell-enrage` (P2). Must stay unique vs Cavalier / Static / Countess sets.  
**DISCOVERABLE_SPELLS:** none new. Ember Step / Shock Glyph already cover trail/tile. His lance is `BOSS_ONLY` (full-file charge).

**AI:** Aim the lance at the player’s **current** tile at telegraph time (dodge is stepping off).  
**ARENA_RULES:** Ember/rime use lava/frost-slow tiles, cap 50.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Carry both a fire and a frost source; step off the glow; hit the glowing window.  
**MASTERY_OBJECTIVE:** Landing blow on the **wrong** window (style) — no spell, just a feat.  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25.  
**BALANCE_RISKS:** Players with no frost spell cannot exploit Window B — wrong-element is −50%, not immune, so they can still win.  
**QA:** Telegraph tile set is computed at wind-up and does not follow the player. Kit uniqueness vs `validateBossKits` uniqueness rule (exact set must be unique).  
**STATUS:** PROPOSED

---

### BOSS_ID: `hexed_marker`

**NAME:** The Hexed Marker  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop who writes your next square for you.  
**CORE_MECHANIC:** Target marking + movement checks. Every 2 turns he Marks a tile (`spell-mark`). A **second** mark (`Hex`) says: **leave this tile before his next turn** or the Hex detonates (hazard tick + Slow).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Mark + Hex cadence. Kit: `spell-mark`, `spell-slow`, `spell-barrier`. |
| 2 | ≤ 40% | Two Hex tiles. `spell-expose`, `summon-archer` (the archer stands on a Hex to dare you). |
| Enrage | turn 19 | Hex detonates on **his** turn even if you moved — must also not **end** adjacent to a Hex. |

**SPELLS (proposed kit):** `spell-mark`, `spell-slow`, `spell-barrier`, `spell-expose` (P2), `summon-archer` (P2).  
**DISCOVERABLE_SPELLS:** none. Mark exists. Glyph-snare is Archivist’s. Hex detonation is `BOSS_ONLY` (forced-move director).

**AI:** Hex the tile you are standing on, not a random tile.  
**ARENA_RULES:** Hex VFX distinct from Mark (color).  
**SUMMONS:** 1 archer in P2.  
**PLAYER_COUNTERPLAY:** Always have 1 MP reserved; Barrier between you and the archer; do not greed Mark-amp on a Hex tile.  
**MASTERY_OBJECTIVE:** Detonate 0 Hexes.  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.20.  
**BALANCE_RISKS:** 0 MP + Hex is a forced hit — he must never Hex on a turn he also Slows if you are already at 0 MP (skip Hex).  
**QA:** Hex fail uses `recordChallengeDamageTaken`. Mark amp still uses `isMark`.  
**STATUS:** PROPOSED

---

### BOSS_ID: `unbound_pendulum`

**NAME:** The Unbound Pendulum  
**RELATIVE_DIFFICULTY:** 8  
**THEME:** A king who is a clock. The fight has a published death time.  
**CORE_MECHANIC:** Enrage is the **core**, not the overlay. Three **Metronomes** (destructible). Each broken Metronome **adds +2 to `enrageTurn`** (delay). Ignoring them is a choice.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 50% | Tick aura: every 4 turns a **pendulum line** sweeps (telegraphed file). Kit: `spell-timestep` is **not** in his kit (too on-the-nose). Use `spell-slow`, `spell-haste`, `physical_attack`. |
| 2 | ≤ 50% | Sweep every 3 turns. `spell-frost-nova`, `spell-iron-skin`. |
| Enrage | turn **16** base (his identity is early) | Sweeps every turn. Overlay +8% still applies. |

**SPELLS (proposed kit):** `physical_attack`, `spell-slow`, `spell-haste`, `spell-frost-nova` (P2), `spell-iron-skin` (P2).  
**DISCOVERABLE_SPELLS:** none. Clock director is `BOSS_ONLY`. Aftershock stays on Alabaster.

**AI:** Stand on the pendulum pivot (center file).  
**ARENA_RULES:** 3 metronomes on the rim. Breaking all 3 delays enrage to turn 22 — still not infinite.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Spend early turns on metronomes **or** race the clock; never end on the glowing file.  
**MASTERY_OBJECTIVE:** Win with **zero** metronomes broken (pure race).  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.20, atkRatio 1.15, offset +1, Phase-2 1.20. Early enrage is the difficulty.  
**BALANCE_RISKS:** Player Timestep + Haste can mock a turn-16 clock — that is allowed (mastery of resources). Do not add a “Timestep forbidden” rule.  
**QA:** Each metronome +2 enrage, max +6. Objects 0 XP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `silent_conductor`

**NAME:** The Silent Conductor  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A queen of mute corridors. Her orchestra is the adds; the lanes are rest markings.  
**CORE_MECHANIC:** Summon management + **silence lanes** (rotating files: on a silenced file, **spells fizzle**, Strike still works). She conducts; the adds play.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 2 musicians (wisp + archer). One silenced file, rotates each of **her** turns. Kit: `spell-rallying-cry`, `summon-wisp`, `spell-weaken`. |
| 2 | ≤ 40% | 3 musicians (add bomber). Two silenced files. `summon-bomber`, `spell-drain-courage`. |
| Enrage | turn 21 | Whole board silenced for **her** turn only (player can still Strike / move). |

**SPELLS (proposed kit):** `spell-rallying-cry`, `summon-wisp`, `spell-weaken`, `summon-bomber` (P2), `spell-drain-courage` (P2).  
**DISCOVERABLE_SPELLS:** none. Silence lanes are `BOSS_ONLY` (would brick the spell bar in the overworld if learned). Brood Ward already covers “armor from pets.”

**AI:** Recast musicians only under cap. Stand off the player’s file so you must enter a lane.  
**ARENA_RULES:** Silence is a **file highlight**, not fog. Fizzle still spends AP (`castResultSpendsAp` includes `"fizzled"`) — that is the resource pressure.  
**SUMMONS:** Wisp / archer / bomber, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Fight from a sounding file; Strike through silence; kill the wisp first; do not dump 8 AP into a fizzle (`hard_3`).  
**MASTERY_OBJECTIVE:** Win without a fizzle.  
**REWARDS:** 6 / 4.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.25.  
**BALANCE_RISKS:** Full-board enrage silence + no Strike equipped. Strike is always on the bar (`physical_attack` is a base spell) — keep that true.  
**QA:** Fizzle spends AP and records `recordChallengeApSpend`. Lanes rotate on her turn, not the player’s.  
**STATUS:** PROPOSED

---

## 8.1 Encounter sheets — Wave 3 (not in `BOSS_IDS`)

Primary-mechanic holes after Wave 2: **heal-from-allied-pain** (honest Rush room 9), **forced pull**, **cover / LOS**, **player-summon as a damage key**.

Do **not** add these ids to `BOSS_IDS` in this change. Proposed specials below are **design names**, not `BossAbility` enum members until an implementation PR adds them with explicit metadata.

Wave-3 learnables reuse **#120 ids only**. No new #137 spell ids.

They stay out of the 10-room Rush table except `second_lament`, which is the **remap target** for the live invalid id `weeping_pawn_2`.

---

### BOSS_ID: `second_lament`

**NAME:** The Second Lament  
**RELATIVE_DIFFICULTY:** 4  
**THEME:** The sob left on the tile after Weeping Pawn promotes. A pawn that drinks allied pain and the player’s mistakes.  
**CORE_MECHANIC:** Destructible **Grief Well**. Incoming HP loss on the **player** (combat / reflect / lava) charges the well. On his turn he siphons the well into a heal (`LIFE_DRAIN` family, **capped at 150% start HP**). In Rush room 9, Starved’s drain quota **also** fills this well — that is the live “feeds on HP that Weeping regenerates” line made honest. Destroy the well to stop the loop.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | One Grief Well opposite spawn. Kit heals are flat (Blood Mend / no % HP). Siphon once per his turn if well charge ≥ `0.08 * playerMaxHp`. |
| 2 | ≤ 45% | Well, if still up, **cracks**: 2 echo tiles (hazard, mark the tile). `spell-enrage` + `spell-sacrifice`. If the well is already down, he only gains the kit — no free well rebuild. |
| Enrage | turn 18 | Siphon ignores the well (heals `0.04 * playerMaxHp` from the air). Still capped at 150% start HP. |

**SPELLS (proposed kit):** `starter-heal`, `spell-barrier`, `spell-weaken`, `spell-enrage` (P2), `spell-sacrifice` (P2). Unique vs Weeping (`physical` / slow / weaken / iron-skin / rally) and Starved (drain kit).  
**DISCOVERABLE_SPELLS:** none. Siphon / well are `BOSS_ONLY`. `spell-cleanse-rite` and `spell-blood-familiar` stay on their #120 sources. Do not teach a third leech.

**AI:** Stand adjacent to the well. Siphon before kit casts. Sacrifice only if HP > 25% after siphon.  
**ARENA_RULES:** Well is a 1-tile object, HP = `0.15 * playerMaxHp`, not an enemy. Echo tiles count toward the 50-hazard cap.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Break the well first; anti-heal is weak here (heals are object-fed, not `healRecv` on him — **explicit: siphon is not reduced by Cursed Wound**). In rush, burst Starved’s Font **and** this well or the jackpot loops.  
**MASTERY_OBJECTIVE:** Destroy the well before he siphons **twice**, then win.  
**REWARDS:** 5 / 3. Rush room 9 keeps its flat 5000 / 2000 through `applyRewards` only — do not also multiply.  
**SCALING_BEHAVIOUR:** hpRatio 1.45, atkRatio 0.95, offset +0, Phase-2 mult **1.20**. Growth cap 1.50× start (tighter than Starved’s 2.00× so the pair cannot double-stack into a sponge).  
**BALANCE_RISKS:** Room 9 + Starved 200% + this 150% is still two growth loops. Wells/Fonts must both be destructible. Rally-style heals stay **flat**. Enrage siphon must not become a third uncapped drain.  
**QA:** `weeping_pawn_2` string remaps to this id. Well 0 XP. Charge from `recordChallengeDamageTaken` / `recordInBattleChallengeDamage` only (same events that already debit challenges). Killing him with the well up is a normal win.  
**STATUS:** PROPOSED

**Legacy alias:** live `BOSS_RUSH_ROOMS[9].boss2Id` is `"weeping_pawn_2"`. Implementation slice: replace that string with `"second_lament"` (or accept `weeping_pawn_2` as a deprecated alias of this id). Do **not** spawn a second `weeping_pawn`.

---

### BOSS_ID: `hook_regent`

**NAME:** The Hook Regent  
**RELATIVE_DIFFICULTY:** 6  
**THEME:** A knight who refuses to close. The board comes to him.  
**CORE_MECHANIC:** Telegraphed **linear hook** (3 tiles, LoS). Resolve pulls the player 2 tiles toward him (`applyAttract` — engine already exists, unused). He pre-paints a **landing ring** of spikes. Movement check: do not end the wind-up turn on the glowing ray. One destructible **Winch**; breaking it **skips the next hook**.

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 45% | Hook every 3 turns, 1-turn telegraph. Kit: Frost / Strike / Haste. |
| 2 | ≤ 45% | After a successful pull he is **off-balance** for 1 turn (rotating vuln: +40% `isPhysical`). Mark + Lifesteal Nova enter. Hook ray extends to 4 tiles. |
| Enrage | turn 20 | Hook resolves same turn as telegraph (overlay rule). Winch, if alive, breaks itself (no soft-lock). |

**SPELLS (proposed kit):** `starter-frost`, `physical_attack`, `spell-haste`, `spell-mark` (P2), `spell-lifesteal-nova` (P2). Unique vs Cavalier (physical / haste / enrage / expose) and Hexed (mark / slow / barrier).  
**DISCOVERABLE_SPELLS:** #120 `spell-hook-line` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: add `bossIds: ["hook_regent"]`). Observation = he **casts** the hook (`kind: "cast"`, #156 default — one use, same-encounter win). The **full-file / 4-tile enrage reel** is `BOSS_ONLY`.

**AI:** Telegraph the ray through the player’s current tile at wind-up; do not track. Prefer hook when Chebyshev > 2 and LoS is clear.  
**ARENA_RULES:** Ray is linear + LoS. Barrier on the ray blocks the pull (existing occupancy). Spikes on the landing ring use the spike hazard type. Winch HP = `0.15 * playerMaxHp`.  
**SUMMONS:** none.  
**PLAYER_COUNTERPLAY:** Step off the glow; Barrier the ray; break the Winch if you must stand still; punish the off-balance turn with Strike.  
**MASTERY_OBJECTIVE:** Never get pulled (0 successful attracts).  
**REWARDS:** 6 / 4 when shipped. Hook Line is the prize (first grant wins if a bishop already taught it).  
**SCALING_BEHAVIOUR:** hpRatio 1.80, atkRatio 1.05, offset +0, Phase-2 1.25. Pull distance **fixed at 2**. Landing-ring spike tick = 3% player max HP guideline.  
**BALANCE_RISKS:** Pull + lava (Countess rush pairing later) is a delete. Do not pair him with Countess or Static until a dedicated pass. Player Hook Line stays 2-tile attract, minRange 2.  
**QA:** Telegraph tiles computed at wind-up. Attract uses `applyAttract`, not a name check. Observation counts his cast, not player Hook Line. Winch 0 XP.  
**STATUS:** PROPOSED

---

### BOSS_ID: `ivory_palisade`

**NAME:** The Ivory Palisade  
**RELATIVE_DIFFICULTY:** 7  
**THEME:** A rook that is a wall. You do not siege HP; you open a lane.  
**CORE_MECHANIC:** Three destructible **Palisade stakes**. He has line of sight **through his own stakes**; the player does not. He rebuilds **one** missing stake every 3 turns (never above 3). Phase 2 **closes two files** (lane shrink — not Alabaster’s full-board shrink).

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | 3 stakes on the approach. Barrier / Expose / Weaken. He peeks through stakes and Strikes / Frosts along the open file. |
| 2 | ≤ 40% | Lane shrink (2 files become unwalkable walls, punched so a path remains). `summon-sentinel` (proposed `usableByEnemy: true` **for this kit only**) + Frost. Sentinel sits behind a stake. |
| Enrage | turn 21 | Rebuilds 1 stake per turn. Lane shrink does **not** tick further (Alabaster owns repeating shrink). |

**SPELLS (proposed kit):** `spell-barrier`, `spell-expose`, `spell-weaken`, `summon-sentinel` (P2), `starter-frost` (P2). Unique vs Fortress (physical / iron-skin / shield / barrier / frost-nova).  
**DISCOVERABLE_SPELLS:** #120 `spell-stone-turret` (`PLAYER_LEARNABLE` / extra `MULTI_SOURCE` door: `bossIds: ["ivory_palisade"]`). Observation = the sentinel **or** a turret-shaped stake rebuild is used (`kind: "cast"` on `summon-sentinel` / future turret id). His **LOS-through-own-stakes** is `BOSS_ONLY`. `spell-ward-plate` stays rook-zone #120 discovery, not a second palisade grant.

**AI:** Never walk through a stake (he peeks). Rebuild only when a stake is down and the 3-turn cadence is up. Sentinel summoned behind cover, not on the player.  
**ARENA_RULES:** Stakes block walk and player LoS. `finalizePlayableLayout` still required after lane shrink — never seal spawn or the only approach. Stake HP = `0.15 * playerMaxHp`. Cap 3 stakes + 1 sentinel (4-body extras: sentinel only; stakes are objects).  
**SUMMONS:** 1 sentinel in P2, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Break a stake to open LoS; fight from the punched path in P2; kill the sentinel before it body-blocks the last lane; DoTs around cover.  
**MASTERY_OBJECTIVE:** Win with **all 3 stakes destroyed at once** (no rebuild between the last break and the killing blow).  
**REWARDS:** 6 / 4 when shipped.  
**SCALING_BEHAVIOUR:** hpRatio 2.00, atkRatio 1.10, offset +1, Phase-2 1.20. Cover is the difficulty, not HP.  
**BALANCE_RISKS:** Fortress + Palisade in one rush room would be two shrinks. Do not pair them. Sentinel is player-only in live `spellData.ts` — flipping `usableByEnemy` is a **flag**, not a new asset (formations doc already allows this).  
**QA:** Lane shrink leaves a walkable path. Stakes 0 XP. Player LoS checks treat stakes as walls; boss LoS does not. Observation of Stone Turret does not fire from player Barrier.  
**STATUS:** PROPOSED

---

### BOSS_ID: `cord_familiar`

**NAME:** The Cord Familiar  
**RELATIVE_DIFFICULTY:** 5  
**THEME:** A bishop whose soul is a leash. The flock is the only blade that can reach him.  
**CORE_MECHANIC:** **Tether gate.** He takes **25% damage** from the player unless a **player-side** summon is alive (any id). He prefers to kill that summon. Phase 2 he hatches a **false familiar** (enemy wisp) that heals him; the 4-cap and the gate stay. This is “pets as a key,” not Brood’s “larvae as armor.”

**PHASES:**

| Phase | HP | Beat |
| :--- | :--- | :--- |
| 1 | 100% → 40% | Gate on. Mirror / Heal / Wisp. He walks to the player summon, not the player. |
| 2 | ≤ 40% | False familiar (wisp) + Dire Wolf + Sacrifice. Gate still requires a **player** summon — his wisp does not unlock you. |
| Enrage | turn 19 | Gate becomes **50%** damage taken if no player summon (was 25%). Still not immune. |

**SPELLS (proposed kit):** `summon-wisp`, `starter-heal`, `spell-mirror`, `summon-dire-wolf` (P2), `spell-sacrifice` (P2). Unique vs Conductor (rally / wisp / weaken / bomber / drain-courage) and Brood (archer / venom / iron-skin / nova).  
**DISCOVERABLE_SPELLS:** none. Gate / false familiar are `BOSS_ONLY`. `spell-brood-ward` stays Brood. `spell-blood-familiar` stays Starved. `spell-pain-link` stays Fortress. Do not mint a fourth pet card.

**AI:** Priority: kill player summons → recast his wisp if under cap → Mirror when the player is about to dump. Sacrifice only if a player summon is already dead and he is above 30% HP.  
**ARENA_RULES:** If the player brings no summon, the fight is still winnable (25% incoming is slow, not a brick) — that **is** the teach. Enrage at 50% still ends.  
**SUMMONS:** His wisp + wolf, cap 4. 0 XP.  
**PLAYER_COUNTERPLAY:** Keep one cheap summon up (Wisp / Bomber); do not let the wolf eat it for free; Mirror-bait with a utility cast; burst when the gate is open.  
**MASTERY_OBJECTIVE:** Keep a player summon alive the entire fight **and** never kill his false familiar (restraint).  
**REWARDS:** 5 / 3.  
**SCALING_BEHAVIOUR:** hpRatio 1.60, atkRatio 1.00, offset +0, Phase-2 1.15. The gate is the clock, not a sponge — 25% incoming on ratio 1.60 is an 8–12 turn fight if you refuse to summon.  
**BALANCE_RISKS:** Players with no summon equipped (post-#156 innate four) must still be able to win. Gate is a reduction, never `DAMAGE_IMMUNE`. His heal is flat Blood Mend, not % HP.  
**QA:** Gate reads `side: "player"` on summons, not name. Killing his wisp does not open the gate. Mastery fails if the player summon’s HP hits 0 at any time.  
**STATUS:** PROPOSED

---

## 9. Roster map

| Id | Diff | Core | Learnable? | Rush room (live) |
| :--- | ---: | :--- | :--- | :--- |
| `pale_archbishop` | 4 | Reliquary + curse | — | 0 |
| `crimson_countess` | 4 | Lava river | Ember Step | 1 |
| `void_grandmaster` | 7 | Illusions | — | 4 |
| `bone_cavalier` | 5 | Knight landings | Vault, Caltrop | 2 |
| `weeping_pawn` | 5 | Wail mark → promote | — | 0 |
| `starborn_queen` | 7 | Lines + void + vuln window | — | 3 |
| `fetid_rook` | 5 | Rot + split | Rot Brand | 1 |
| `eternal_pawn_king` | 6 | Advance + stones | — | 6 |
| `midnight_bishop` | 7 | Twin flank → merge | — | 7 |
| `broodmother_rook` | 6 | Larvae / shell | Brood Ward | 8 |
| `lord_of_static` | 6 | Shock graph | Shock Glyph | 2 |
| `final_pawn` | 10 | 3-turn invuln + 4 ghosts | — | 6 |
| `alabaster_fortress` | 7 | Resonance + shrink | Aftershock | 8 |
| `chessboard_lich` | 8 | Rotate / invert / claim | — | 5 |
| `mirror_sovereign` | 8 | Mirror + replay | Echo Cast | 4 |
| `starved_vampire_pawn` | 3 | Capped drain | Exsanguinate | 9 |
| `pale_archivist` | 8 | Glyphs / pages | Glyph Snare | 5 |
| `twin_monarchs` | 9 | Dual kill window | — | 7 |
| `enthroned_void` | 9 | 8 anchors | — | 3 |
| `cinder_lance` | 6 | Elemental lance | — | — (Wave 2) |
| `hexed_marker` | 5 | Hex movement | — | — (Wave 2) |
| `unbound_pendulum` | 8 | Metronome clock | — | — (Wave 2) |
| `silent_conductor` | 7 | Silence lanes | — | — (Wave 2) |
| `second_lament` | 4 | Grief Well siphon | — | **9** (remap `weeping_pawn_2`) |
| `hook_regent` | 6 | Linear hook + winch | Hook Line (#120) | — (Wave 3) |
| `ivory_palisade` | 7 | Stakes / LOS cover | Stone Turret (#120) | — (Wave 3) |
| `cord_familiar` | 5 | Player-summon gate | — | — (Wave 3) |

Live rush room 9 still stores `weeping_pawn_2`. Implementation remaps that string to `second_lament`. Do **not** spawn a second `weeping_pawn`.

---

## 10. Boss Rush pairing notes (design only)

Existing `BOSS_RUSH_ROOMS` combined mechanics stay. This spec changes how **each** boss scales and how many extras they spawn. Pairings that become illegal under the new caps:

| Room | Risk under this spec | Intended rule |
| :--- | :--- | :--- |
| 0 Archbishop + Weeping | Reliquary + Wail Mark is fine. | Shared 4-extra cap (wisps only). |
| 1 Countess + Fetid | Lava + rot + split twin. | Twin counts as a body; lava cap 50. Combined “lava is poison” stays flavor. |
| 2 Cavalier + Static | Spikes + shock + chain. | Spikes do **not** chain. Combined “Cavalier is a conductor” = shock on **landing tile only**. |
| 3 Queen + Void | Void tiles + 8 anchors. | Never void an anchor tile. Enrage self-shatter still works. |
| 4 Grandmaster + Sovereign | Illusions + replay. | Replay ignores illusion casts. Fakes do not fill her buffer. |
| 5 Lich + Archivist | Rotate + glyphs. | Glyphs rotate with the board (stay on the same world tile). |
| 6 Eternal + Final | Two pawn kings. Combined “decoy” story. | Final Pawn ghosts **exclude** a second Eternal. Cap 6 extras for the room. |
| 7 Midnight + Twins | Four+ bodies. | Shared-HP twins + two monarchs = 4 bodies, 0 extra summons (skip wisp). |
| 8 Fortress + Brood | Shrink + larvae. | Larvae spawned on walls still count toward cap 4. Shrink cannot seal larvae inside isolated pockets. |
| 9 Starved + Weeping | Dual growth. | **Remap partner to `second_lament`.** Starved 200% cap + Lament 150% cap. Both Font and Grief Well must be destructible. Rally/Mend heals stay **flat**. Combined “feeds on HP the other regenerates” = Starved drain quota charges the well. |

Rush Doka/XP in `BOSS_RUSH_ROOMS` are already large flat numbers (500–5000). Do **not** also multiply by `rewardDokaMultiplier` or by player level. Persist through `buildBossRushPersistInput` → `applyRewards` only.

Wave-2 bosses stay out of the 10-room table until a dedicated pairing pass. Wave 3: only `second_lament` enters, as the room-9 remap. Do not pair `hook_regent` with Countess or Static, or `ivory_palisade` with Fortress, without a later pass.

---

## 11. Implementation contract (later PRs)

When someone implements this, split work. Do not land it as one combat rewrite.

| Slice | Touches | Must not touch |
| :--- | :--- | :--- |
| A. Relative HP/ATK budgets | `getBossEffectiveStats` / spawn site that copies `baseStats` | Damage formula, RAF, map-gen |
| B. Retire Final Pawn `999` | `bossDefaults.ts` phase2.statMultiplier → 1.20; ghost count 4 | Turn order |
| C. Enrage overlay | `BossState` + AI priority | Damage math internals (use a multiplier already applied at the existing outgoing-damage site) |
| D. Destructible objects | New explicit type, not `Enemy` | Reward roster (0 XP) |
| E. Telegraphs | Highlight tiles 1 turn, then existing ability | New damage types |
| F. Discoverable spells | New `SpellConfig` rows + persist counters | Name heuristics; `localStorage`-only unlocks |
| G. Backend seed sync | `defaultBossConfigs()` vs frontend kits | `backend_extended/`; 15-field stats |
| H. Phase-3 type | Only if a sheet truly needs `phaseNumber: 3` | Do not widen the type “just in case” |
| I. Rush room 9 remap | `useBossRush.ts` `weeping_pawn_2` → `second_lament` | Do not add Wave 3 ids to `BOSS_IDS` in the same PR as the string fix unless kits ship |
| J. #120 BOSS grants | Persist first-victory ids for Pain Link / Glyph Tax / Blood Familiar | Do not also fire #137 count-gates from that same flag |

**Spell metadata checklist** for every new discoverable:

- `id`, `effectType`, `spellType`, `targetType`, `areaShape`
- `usableByPlayer: true` only after the unlock gate
- Explicit flags (`isOncePerBattle`, `isSpikeGlyph`, `echoDenyIds`) — never parse `name`
- No `wp` / `wr` / `scp`
- Add the id to `SPELL_ID_CATALOG` **and** `spellData.ts` in the same PR
- `validateBossKits()` must still pass (discoverables are **player** spells, not forced into every kit)

**Persist:** observation counters and unlocks belong next to `achievementProgress` (principal-keyed), not `pbv_boss_configs` in `localStorage`.

**Character-update payloads** still need every `CharacterStats` field including `killCount`.

---

## 12. Global QA matrix

| # | Check | Pass condition |
| :--- | :--- | :--- |
| 1 | No-cap smoke | At playerLevel 1, 10, 25, 50: even-match fight ends in the turn band from §3.2, not 3 turns and not 40. |
| 2 | Diff table | Guide offsets `[-2, 0, +2, +5]` still render; HP column tracks `hpBudget`, not catalog 350. |
| 3 | Enrage | No HP added. +80% cap. Clock from relative difficulty. Pendulum can delay, not delete. |
| 4 | Extra XP | Larvae, ghosts, scrolls, phantoms, wisps, split twins, objects = 0 victory XP. Twins of Midnight share one grant. Twin Monarchs = two boss grants. |
| 5 | Final Pawn | Invuln = 3 turns. 4 ghosts. Multiplier ≠ 999. Victory with ghosts alive. |
| 6 | Starved | HP never exceeds 200% start. Phase 2 can fire from drain quota. |
| 7 | Void | 8th anchor drops immunity same turn. Enrage can self-shatter leftovers. |
| 8 | Discovery | Blind kill does not unlock. Observation + victory (+ feat/challenge where required). |
| 9 | Challenges | Hazard / reflect / lava / spike still hit `recordChallenge*` helpers. Fizzle spends AP. |
| 10 | Kits | Every shipped id still 3–5 catalog spells; Phase 2 adds one; sets unique. |
| 11 | Rush room 9 | `weeping_pawn_2` remaps to `second_lament`. Two growth caps. Both objects destructible. |
| 12 | Actor | No 15-field stats. Canonical `main.mo`. Rewards via `applyRewards`. |
| 13 | Admin | Config editors stay gated. Unlock is not an admin checkbox for normal players. |
| 14 | Typecheck | `pnpm typecheck` / `pnpm fix` / `pnpm build` clean when code lands. |

---

## 13. Out of scope

- Production TypeScript / Motoko for any of the above.
- New CharacterStats fields.
- Changing `xpForNextLevel`.
- Rewriting Boss Rush room order (except the room-9 **id remap** in slice I).
- Making every spectacular mechanic player-usable.
- New #137 spell ids (Wave 3 reuses #120).
- Deploying or “fixing” `backend_extended/`.

---

## 14. Source map (read-back)

| Topic | File | Notes |
| :--- | :--- | :--- |
| Ability enum + 2-phase type | `src/frontend/src/types/bossTypes.ts` | `phaseNumber: 1 \| 2`; 46 abilities; 19 `BOSS_IDS` |
| Catalog HP / multipliers | `src/frontend/src/types/bossDefaults.ts` | Final Pawn `statMultiplier: 999`; Starved `hp: 60` |
| Live kits | `src/frontend/src/data/bossKits.ts` | 3–5 of `SPELL_ID_CATALOG`; Phase 2 superset rule |
| AI first-spell loop | `src/frontend/src/hooks/useBossAI.ts` | `pickBossKitSpell` currently wins every turn |
| Ability runtime | `src/frontend/src/hooks/useBossSystem.ts` | Pure reducers |
| Level-diff 1.08 | `src/frontend/src/engine/progression.ts` | Does not budget vs player HP today |
| Player spells | `src/frontend/src/data/spellData.ts` | Explicit metadata; `usableByPlayer` flags |
| Challenges | `src/frontend/src/utils/challengeCompletion.ts` | `easy_1`…`legendary_3` |
| Feats | `src/backend/lib/admin.mo` `defaultAchievements()` | 15 seeded; no boss-discovery feats yet |
| Backend boss seed | `src/backend/lib/admin.mo` `defaultBossConfigs()` | Stale 12-boss / old spell ids |
| Rush pairings | `src/frontend/src/hooks/useBossRush.ts` | 10 rooms; room 9 `weeping_pawn_2` |
| Guide copy | `src/frontend/src/components/BossGuideModal.tsx` | Ability blurbs for players |
| Discovery pipeline | `docs/automation/SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` | Use → observe → win default |
| Tactical ids | `docs/automation/SPELL_PROPOSALS_2026-08-31.md` | 16 #120 spells; Wave 3 observation sources |
| Long horizon | `docs/automation/LONG_HORIZON_2026-08-31.md` | Live boss HP still static |

---

**Document status:** PROPOSED. 19 shipped + 4 Wave-2 + 4 Wave-3 sheets. Safe to review, iterate, and implement in sliced PRs. Not a license to land combat code in the same change as this spec.