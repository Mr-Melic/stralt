# Content Diversity & Repetition Audit — 2026-09-21

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (report-findings orchestration)  
**Prior auditor HEAD:** `58302bc` (2026-09-02). Ledger [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md) (`CDA-2026-09-02-001` … `015`) **landed on `main`**. None of those ids shipped as combat. This run does **not** mint twins.

ACTION_IDs this run: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-21.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-21.md) — reaffirm `001`–`015` as **OPEN**, mint `CDA-2026-09-21-016` … `018` only for new gaps.

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD |
| :--- | :--- |
| Enemy family sheets Wave 1+2+3 | `ENEMY_ELITE_EVOLUTION_2026-08-31.md` / `09-01` / `09-02` — PROPOSED |
| Named formations drop 1–3 | `docs/design/ENEMY_FORMATIONS_2026-08-31.md` … `09-02` — PROPOSED, unwired |
| ENC-* rooms | `docs/encounters/ENCOUNTER_EVOLUTION_2026-08-31.md` … `09-02` — PROPOSED |
| Spell verbs (push, attract, root, trap, delayed execute, …) | `SPELL_PROPOSALS_2026-08-31.md` … `09-02` — PROPOSED |
| World features (`WF-*`, 52 rows, including `elite_patrol`) | `engine/worldFeatures.ts` — unit-tested, **not imported by WX** |
| Owner encounter pack | `WORLD_ENCOUNTER_ADMIN_DESIGN_2026-09-02.md` — WDEAD ids still NEW |
| Spell discovery waves | `SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md` … `09-02` — PROPOSED; live hydrate still forces every `starterSpells` id `isBaseSpell` |

**Same-hour open PRs (createdAt after this cron, docs-only unless noted):** Wave 4 spell proposals (#342), world dynamics catalog (#344), Tide/File/Clock encounters (#347), formations drop 4 (#348), Wave 4 elite families (#349), enemy AI increment (#351). Those catalogs stay **PROPOSED**. This audit does **not** endorse appending `WF-*` / `EnemyFamily` / ENC rows from them until CDA-001 / CDA-014 bind. CDA-013 and CDA-018 are the freeze.

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a 16th RES-shred spell, a fifth reflect, or another `WF-*` row.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

---

## 0. Prior-run checks (2026-09-02 → this HEAD)

| # | Question | 2026-09-21 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay extracted to `spawnPolicy.ts`; chassis stays random. | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286); `tryPlaceEnemy` still picks a random piece (`WorldExploration.tsx` 5764–5765) |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` (`WorldExploration.tsx` 3607–3612, 11970–11974, 11997). RES/SP: `computeEnemyStats` then overwrite (`11872`, `11898–11902`) |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | `WorldExploration.tsx` 2395–2400 |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** | `useBossRush.ts` 19–131 only. Grep: definition + ten string literals |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312; 49–67 vs 394–415 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | `buildEnemyKit(..., currentMap.levelZone)` 11920; `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at level 44. | `gameConstants.ts` 298–299; WX 11932–11942 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127; `bossTypes.ts` 390–410 |

### What **did** change since 09-02 (mostly not combinatorial depth)

| Change | Diversity effect |
| :--- | :--- |
| Family overlay extracted to `spawnPolicy.ts` | Same 30% sticker + HP/dmg/RES/SP write. `ap`/`mp` still unused (comment 14–15, 64–66). |
| Enemy Register chrome labeled **FLAVOR LORE** (`enemyRegisterCopy.ts` 1–15; `9e28cf9`) | CDA-013 **PARTIAL**. Per-row copy for the seven live families still describes unwired verbs. |
| Frozen Terrain now charges enemy / summon-AI walks (`enemyWalkMp.ts`) | Honesty vs player 2× MP. **Same verb as Slime Flood** (`mapModifiers.ts` 154–172). |
| Blood Moon / Mirror Field live in `spellEngine.ts` | 09-02 called them announce-only because `MAP_MODIFIERS` hooks are empty. Live: Blood Moon **×1.25 player damage** (895); Mirror Field **20% ST reflect** (901–907, WX 9538–9558). Gravity Well / Fog of War still unused (`_isGravityWell` / `_isFogOfWar` at WX 2324–2326). |
| Challenge HUD keep after first action (`3e95eab`) | Honesty of the nine numeric predicates. No tenth *kind*. |
| `worldFeatures.ts` Wave 2+3 | **52** `WF-*` rows (was ~20). Still imported only by `worldFeatures.test.ts`. |

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` + `WorldExploration.tsx` 5862–5866): after a fully random chess piece is placed, each body has an independent **30%** chance (`FAMILY_VARIANT_CHANCE`) to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog also lists `mp` / `ap` — **never assigned**.

Battle start then:

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (`WorldExploration.tsx` 11872, 11898–11902) — piece-type integer rolls (`progression.ts` 180–186: `res` is `roll(2, 4 + base*0.9, …)`, **not** a 0–1 fraction).
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (`3607–3612`, `11970–11974`, `11997`): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

Family RES values `0.05–0.75` are the **wrong unit** even if the wipe were removed. Binding family stats must use the integer `getEnemyBaseStats` scale, not the overlay fractions.

**Live combat hooks (three):**

| Family | Live verb | Where |
| :--- | :--- | :--- |
| `ember_knight` | melee applies burn 3/turn × 3 | `WorldExploration.tsx` 16789–16804 |
| `tide_shade` | melee applies MP −1 × 2 | `WorldExploration.tsx` 16805–16821 |
| `void_mirror` | 25% of pre-crit spell damage reflected | `castHelpers.ts` 335–345 |

`wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` have **pixel patterns only** in combat. Register copy (`EnemyRegister.tsx` 28–70) still claims wall-phase, poison-on-hit, Weaken-from-range, magic immunity — none of that is wired. The three live families also **mismatch** Register: Ember is melee-burn, not burning tiles; Tide is melee MP−1, not adjacent slow + regen; Void is 25% reflect, not “immune to magic until physical.”

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike. Kit and `inferArchetype` follow the random chassis.

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion`, no rarity second roll. Leader = highest `level` in the pack (`WorldExploration.tsx` 12011–12015). `computeAITier` (`combatMath.ts` 36–50) is a level bucket, then **30%** uniform 1–10 noise — not a variant floor.

`worldFeatures.ts` `WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (`elite_patrol`) are designed + tested and **not imported by WX**.

### 1.3 AI profiles

`EnemyArchetype` union (`enemyAI.ts` 86–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–477) never returns `summoner`. Order: any `healAmount > 0` → healer (so `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` are healers); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except an empty string on boss minions (`WorldExploration.tsx` 16160). No family has `aiStrategy: "berserk"`.

Summoner **behavior** exists. WX 16375 calls `decideSummonerAction` when `enemy.isSummoner`. That flag is a **random overlay**, not a family. Pets are 50/50 wolf or archer (`11935–11941`). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

**Coupling:** if CDA-002 (numeric kit band) ships without CDA-006, band-1 queens gain `starter-heal` (Blood Mend, `healAmount: 12`) and become inferred healers. Band-1 kings gain `spell-rallying-cry` (`usableByEnemy: false`) so they stay frost casters. Do not “fix the NaN” in isolation.

### 1.4 Spell pools

`ENEMY_KITS` (`enemyAI.ts` 163–185) is **piece-type only**, three bands:

| Piece | Band 0 (live, always) | Band 1 | Band 2 |
| :--- | :--- | :--- | :--- |
| pawn | Strike | + Venom | — |
| knight | Strike | Strike | Strike |
| bishop | Frost | Frost + Poison | — |
| rook | Strike | Strike + Iron Skin | — |
| queen | Frost | Frost/Inferno + Blood Mend | Inferno + Blood Mend |
| king | Frost | Frost/Inferno + Rallying Cry | Inferno + Rallying Cry |

`buildEnemyKit` floors `levelZone`. Call site passes `currentMap.levelZone` **object** (`{ name, minLevel, maxLevel }`). `Math.floor(object)` is `NaN` → `Math.max(0, NaN)` is `NaN` → every `z >= 1` is false → **band 0 forever**. `longHorizonSim.ts` 50–57 documents the same NaN.

Knight never grows. Queen/king “late Inferno” never arrives.

Frontend catalog: 32 ids in `spellData.ts` / `SPELL_ID_CATALOG` (`bossKits.ts` 29–62). All `starterSpells` forced innate (`WorldExploration.tsx` 2395–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) with targeting flags the frontend rows lack. Backend boss seeds (`admin.mo` 349+) still name `fireball` / `cursed_gust` / `entangle` that are in neither frontend kit table.

Engine verbs with **no live spell caller:** `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537 — tests only). Targeting supports `linear` / `diagonal` / `minRange`; no enemy kit sets them.

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (`WorldExploration.tsx` 5744–5763, `SPAWN_MIN_CHEBYSHEV`). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (`11869–11886`). Named formation catalogs and `worldFeatures.ts` encounter slots are unwired. No `formationId` in spawn.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). `BossAbility` enums are **unique per later boss** — that axis is actually diverse. Kits are not: they remix the same frontend ids.

| Spell id | Unique boss kits using it |
| ---: | :--- |
| `spell-shadow-veil` | 7 |
| `spell-cursed-wound` | 6 |
| `spell-frost-nova` | 6 |
| `spell-swap` | 5 |
| `spell-iron-skin` | 5 |
| `spell-lifesteal-nova` | 4 |
| `starter-blast` | 4 |

Phase 2 is “add a catalog spell” (`bossKits.ts` 90–92: phase 2 always contains at least one id phase 1 lacks). Signature twists stay in `BossAbility` / `useBossAI`, not in the kit.

Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–135). `combinedMechanic` is flavor text. Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`. Admin copy already admits the mismatch (`AdminDashboard.tsx` 7144).

Register boss tips (e.g. Archbishop invulnerable while pawns live) are lore, not the live `BossAbility` set.

### 1.7 Encounters / dungeon rooms

`generateEnemies` (`WorldExploration.tsx` 5711+): pack size `1+rand*8` plus dungeon extras `[0,2,3,4,4,5][min(depth,5)]` and tier boost `[0,1,2,2,3,3]` (`spawnPolicy.ts` 27–28, 140–148). Same quadrant scatter. No encounter id, no wave, no objective, no formation id.

Live dungeon “rooms” are **more bodies + higher tier**, not ENC-* structures. Rest / boss / dungeon portals are separate chance rolls, not a taught chain.

Proposed ENC-* / WDEAD encounter catalog remain PROPOSED.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109):

| Kind | Ids | Distinct player decision? |
| :--- | :--- | :--- |
| Turn-count clone | `under_15_turns`, `under_10_turns`, `under_5_turns` | Same verb, tighter number |
| Damage-taken clone | `under_50_damage`, `no_healing_under_30_damage`, `no_damage_taken` | Same verb, tighter number (+ heal ban) |
| Unique | `no_healing`, `under_8_ap_per_turn`, `direct_hit` | Yes — resource / range discipline |

No OBJECTIVE_PLAY, SPELL_DISCOVERY, or TEAM_SYNERGY predicate. Challenge HUD honesty (`3e95eab`) did not add a kind.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). Grind / event keys: `first_battle_win`, `survive_1hp`, `spell_level_5`, `doka_1000`, `explore_25_maps`, `betrayal_witness`, `leader_slayer`, `jackpot_heal`, `loot_10_doka`, `double_betrayal`, `level_10`, `spell_master_8`, `critical_5_in_battle`, `pacifist_run`, `doka_10000`.

Twins: Doka hoard 1k/10k; betrayal / double betrayal. `level_10` (`unstoppable`) is a **horizon cap** on a game with no character level cap. WX still fires it at 10 (`3632`). Rewards are Doka only — never a spell.

### 1.10 Environmental mechanics / modifiers

Live hazards: lava / ice / spikes (mapGen + battle walk). 22 `MAP_MODIFIERS` (`mapModifiers.ts` 152–490).

| Problem | Ids |
| :--- | :--- |
| Identical hook | `slime_flood` ≡ `frozen_terrain` (both `onMpCost: ×2`) |
| Flag exists, no behavior | `gravity_well`, `fog_of_war` (`_isGravityWell` / `_isFogOfWar`) |
| Registry empty, **engine live** | `blood_moon` (player damage ×1.25), `mirror_field` (20% ST reflect) |
| Numeric HP/damage reskins | `titans_vigor` (+1000 HP, 1–5× dmg), `glass_realm` (×2), `doka_fever` (+25% enemy HP), **`blood_moon` (×1.25 player dmg)** |
| Useful distinct verbs | `null_field`, `chaos_initiative`, `thorned_ground`, `arcane_overflow`, `iron_curse` (heal tax), `vampiric_ground`, **`mirror_field` (ST reflect)** |

`worldFeatures.ts` (52 `WF-*` rows, including shrine / teleport / elite patrol / spell-bearing enemy) is unused by spawn.

---

## 2. Mechanic category census (live)

Counts are **distinct player-facing verbs**, not name variants.

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike, Inferno, Sacrifice, chain, Expose/Veil, Cursed Wound, Frost Bolt/Nova, most boss kits, glass/titan/fever/**blood_moon** modifiers |
| STATUS | **Over** | RES/SP shred pair; poison≡venom; ember burn; Weaken; anti-heal |
| RESOURCE_MANIPULATION | **Over** | MP −1/−2 cluster (Frost Bolt, Slow, Frost Nova, tide melee); Drain Courage AP −1; Timestep (player); slime≡frozen 2× MP |
| SUPPORT | Clone-heavy | Shield≡Iron Skin; Blood Mend≈Rallying Cry; Enrage; wisp player-only |
| DEFENSE | Clone-heavy | Shield/Iron Skin; Barrier (player) |
| REACTION | **Clone-heavy (was Under on 09-02)** | Mirror spell (next ST); Void Mirror 25% pre-crit; Mirror Field 20% ST; boss Reflect Shield 30%; backend `reflect_barrier` ghost. Four live reflects, no counter / delayed interrupt / absorb-then-release |
| SUMMONING | Shallow | Five player pets; enemy overlay wolf/archer only; bosses spawn via abilities |
| CONTROL | Partial | MP taxes, no true root; no delayed execute |
| TERRAIN | Partial | lava/ice/spikes + some modifiers; gravity/fog unused; slime≡frozen |
| POSITIONING | **Under** | Swap only; formations are scatter; push/attract unwired |
| MOBILITY | **Under** | Swap; Haste +MP; random knight chassis. No dash |
| TEAM_SYNERGY | **Under** | Leader-by-level; no pack roles; `combinedMechanic` unused |
| OBJECTIVE_PLAY | **Absent** | Challenges are numeric; ENC-* unwired |
| SPELL_DISCOVERY | **Absent** | Entire frontend catalog pre-owned as base |

---

## 3. Redundancy (differs mainly by HP / damage / name / number)

### Redundant enemies

- Four families with no combat hook: wraith / golem / rat / scribe = palette + wiped multipliers.
- Register extras Crimson Spawn / Shadow Lurker / Storm Caller = lore rows, not `EnemyFamily` (chrome now admits this; rows still read as bestiary).
- Pack members of different piece types often share band-0 Strike (pawn, knight, rook) — chassis name without kit.
- Dungeon depth extra bodies = more of the same random pieces.

### Redundant spells

| Pair | Same verb | Cosmetic delta |
| :--- | :--- | :--- |
| Shield / Iron Skin | +30% RES / 3 turns, ally, range 3 | AP 2 vs 3 |
| Poison Arrow / Venom Strike | 4 dmg/turn × 3, no upfront | range 4 AP 2 vs range 2 AP 3; `dotType` string |
| Expose / Shadow Veil | damage + RES+SP shred / 2 turns | 15 @ ×0.8 vs 18 @ ×0.85 |
| Blood Mend / Rallying Cry | self heal + +15% CHC / 2 | 12 HP AP 3 vs 20 HP AP 4; Cry `usableByEnemy: false` |
| Life Drain / Drain Courage / Lifesteal Nova | drain + heal | SP shred vs AP −1 vs AoE — related, not identical |
| Frost Bolt / Slow / Frost Nova | MP tax | −1/1 vs −2/2 vs AoE −1 |

Backend `reflect_barrier` ≈ frontend Mirror. Backend `vampire_bite` ≈ drain cluster.

### Redundant reaction (new census)

| Source | Verb |
| :--- | :--- |
| `spell-mirror` | Next single-target damage reflects |
| `void_mirror` family | 25% of pre-crit spell damage |
| `mirror_field` modifier | 20% chance player ST spell reflects |
| Boss `reflectShieldActive` | 30% of damage back |
| `reflect_barrier` (backend seed) | Ghost id |

A fifth reflect is not a new player decision.

### Repeated encounter structures

Every fight: random pieces, quadrant spread, optional 30% sticker, optional summoner overlay, optional modifier two-roll, win = kill all. Dungeon = that plus extra count. Boss Rush = two catalog bosses, flavor synergy, kill all.

### Repeated boss mechanics

Unique `BossAbility` tags are the real diversity. Kits repeatedly: shred, frost-slow, swap, iron-skin, drain-nova. Phase 2 = add a row from the same 32-id list. Dual-boss rooms do not implement the printed “kill A first or B resurges” rules.

---

## 4. Combinatorial product — which axes actually bind

| Axis | Bound in live spawn? |
| :--- | :--- |
| family | Sticker (30%). Three passives. Stats wiped. Chassis not forced. |
| relative level | **Yes** — `pickEnemyLevelFromTiers` |
| variant | **No** |
| AI | Inferred from kit / piece. Summoner is a separate random flag. `aiTier` 30% chaos. |
| spell pool | Piece-type, **band 0 only** |
| formation | Quadrant scatter |
| map | mapGen archetypes exist; dungeon does not pick a room id |
| modifier | Two-roll among 22, including two no-ops, one MP-cost duplicate, and several numeric DAMAGE reskins |

Relative level without the other axes is HP/damage inflation — the failure mode this audit is meant to stop.

---

## 5. What to build (only if it creates a new player decision)

Do **not** add families, ENC rooms, WF-* rows, or Wave-2 spells until the seven live families survive battle start and select kit/AI. Those catalogs already exist as PROPOSED.

| Gap | New player decision | Prefer existing id |
| :--- | :--- | :--- |
| Family persist + chassis + one unique verb | “This is a golem — walk around / shred RES / don’t poison-expect” | CDA-001; family sheets already written |
| Numeric kit band | “This late queen has Inferno — break LoS / save Mirror” | CDA-002; **must ship with** CDA-006 or queens become Blood-Mend healers |
| Elite as AI/kit floor | “The banner one never kites — I must burst or leave” | CDA-003; `WF-ELT-*` |
| Named formation | “Tank in front, frost behind — peel the bishop first” | CDA-004; `ENEMY_FORMATIONS_*` |
| Clone collapse | Each remaining id has one answer (melee vs ranged DoT, etc.) | CDA-005 |
| Family-bound AI; drain ≠ healer | “The drain bishop will not walk up to Blood-Mend me” | CDA-006 |
| Summoner by zone + family pet | “Kill the cantor or the board fills; this family brings a bomber not a wolf” | CDA-007 |
| `combinedMechanic` as code | “I must kill Archbishop first or the Pawn comes back” | CDA-008 |
| Challenge kinds, not tighter numbers | “Hold the tile / observe the frost / kill the summoner first” | CDA-009 |
| Achievement = learn, not hoard | “I unlocked by seeing Void reflect, not by hitting level 10” | CDA-010 |
| Distinct / real modifiers | “Fog: I cannot snipe; Frozen: ice tiles, not another slime” | CDA-011 (updated: Blood Moon is live ×1.25 DAMAGE — replace or delist; Mirror Field is live reflect — do not re-implement; gravity/fog still empty) |
| One spell catalog | Discovery can exist; kits stop pointing at ghost ids | CDA-012 |
| Freeze new stickers | Prevents another Register row from being mistaken for content | CDA-013 (chrome PARTIAL; union freeze still OPEN) |
| Encounter objects (hold / escort / wave) | “The shrine dies if I chase the rat” | CDA-014; ENC-* / `worldFeatures` |
| Unused POSITIONING verbs | “If I stand here they slam me into lava” | CDA-015; `applyPushback` / SPELL_PROPOSALS |
| Register rows match live verbs | “I read Ember = melee burn, not burning tiles” | **CDA-016 (new)** |
| First non-reflect REACTION | “I held the cast because a counter would fire” | **CDA-017 (new)** — do not add a fifth reflect |
| Freeze new `WF-*` until one is wired | Stops 52-row catalog flock | **CDA-018 (new)** |

---

## 6. What this run will not recommend

- New HP%, damage%, or palette families.
- Shipping Crimson Spawn / Shadow Lurker / Storm Caller as live `EnemyFamily`.
- A third Doka-hoard achievement, a 12-turn challenge, or a fifth reflect.
- Another `WF-*` row, ENC-TEACH-04, or Wave-4 family sheet.
- Retuning `pickEnemyLevelFromTiers` percents, RAF, mapGen solvability, or combatMath formulas.
- Treating `longHorizonSim.ts` as player telemetry (still `available === false`).
- Treating Blood Moon ×1.25 or Titan/Glass/Fever as “content.”
