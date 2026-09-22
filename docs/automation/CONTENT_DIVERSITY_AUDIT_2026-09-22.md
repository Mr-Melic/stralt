# Content Diversity & Repetition Audit — 2026-09-22

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (report-findings orchestration)  
**Prior auditor HEAD:** also `0f5363f` (2026-09-21). That run’s ledger is **PR #359** (`docs: content diversity audit 2026-09-21`) and is **still open** — it never landed on `main`. Every 09-21 check was **re-verified on this HEAD**; line numbers match. This run does **not** mint twins of `CDA-2026-09-02-001` … `015` or `CDA-2026-09-21-016` … `018`.

ACTION_IDs this run: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-22.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-22.md) — reaffirm `001`–`015` (013 PARTIAL) and unpublished `016`–`018`; mint `CDA-2026-09-22-019` only for the 48h design-flock gap.

On `main` the durable 09-02 ledger still exists ([`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md)). Several 09-02 citations moved when family overlay extracted to `spawnPolicy.ts`; current lines are in the 09-22 ACTION file.

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD |
| :--- | :--- |
| Enemy family sheets Wave 1+2+3 | `ENEMY_ELITE_EVOLUTION_2026-08-31.md` / `09-01` / `09-02` — PROPOSED |
| Named formations drop 1–3 | `docs/design/ENEMY_FORMATIONS_*` — PROPOSED, unwired |
| ENC-* rooms | `docs/encounters/ENCOUNTER_EVOLUTION_*` — PROPOSED |
| Spell verbs (push, attract, root, trap, delayed execute, …) | `SPELL_PROPOSALS_*` — PROPOSED |
| World features (`WF-*`, **52** rows, including three `WF-ELT-*`) | `engine/worldFeatures.ts` — unit-tested, **not imported by WX** |
| Owner encounter pack | `WORLD_ENCOUNTER_ADMIN_DESIGN_*` — WDEAD ids still NEW |
| Spell discovery waves | `SPELL_DISCOVERY_ECOSYSTEM_*` — PROPOSED; live hydrate still forces every `starterSpells` id `isBaseSpell` |

**Open design flock (oldest-first queue, still not on `main`):** 09-21 CDA itself (#359); Wave 4 spell proposals (#342); world dynamics catalog (#344); Tide/File/Clock encounters (#347); formations drop 4 (#348); Wave 4 elite families (#349); enemy AI increment (#351); Wave 5 boss sheets (#367); Wave-4 spell discovery (#371). Same-hour 09-22 siblings: world/dungeon/encounter admin (#394), Wick/Rime/Smoke ENC (#396), Wave-5 world dynamics (#399). Those catalogs stay **PROPOSED**. CDA-013 / CDA-018 / **CDA-019** are the freeze.

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a 16th RES-shred spell, a fifth reflect, a 53rd `WF-*` row, or another unread `combinedMechanic` string.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

---

## 0. Prior-run checks (2026-09-21 → this HEAD)

HEAD did not move. Independent grep/read of the live catalogs:

| # | Question | 2026-09-22 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay in `spawnPolicy.ts`; chassis stays random. | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286); `tryPlaceEnemy` (`WorldExploration.tsx` 5764–5765) |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` (`WorldExploration.tsx` 3607–3612, 11970–11974, 11997). RES/SP: `computeEnemyStats` (`11872`, `11898–11902`) |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | `WorldExploration.tsx` 2395–2400 |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** | `useBossRush.ts` 19–131 only |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312; 49–67 vs 394–415 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | `buildEnemyKit(..., currentMap.levelZone)` 11920; `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at 44. | `gameConstants.ts` 298–299; WX 11932–11942 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127; `bossTypes.ts` 390–410 |
| 9 | Is REACTION still only percent-reflect clones? | **Yes.** Four live + backend ghost. | Mirror (`spellEngine.ts` 917–926); Void 25% (`castHelpers.ts` 335–345); Mirror Field 20% (`spellEngine.ts` 901–907, WX 9538–9558); boss shield 30% (`castHelpers.ts` 363–375); `reflect_barrier` (`admin.mo` 182) |
| 10 | Did `worldFeatures.ts` grow past 52 unused rows? | **No on `main`.** Still 52. Open #344 would grow it. | grep `id: "WF-"` → 52; WX does not import the module |
| 11 | Did CDA-002 land without CDA-006? | **No** (002 unshipped). Coupling still live in kits. | Queen band 1 = `[nuke, starter-heal]` (`enemyAI.ts` 176–178); `inferArchetype` healer on `healAmount > 0` (447–452) |

### What changed since 09-02 (still true; not new this 48h)

| Change | Diversity effect |
| :--- | :--- |
| Family overlay extracted to `spawnPolicy.ts` | Same 30% sticker. `ap`/`mp` unused (`spawnPolicy.ts` 14–15, 64–66). |
| Enemy Register chrome = **FLAVOR LORE** (`9e28cf9`) | CDA-013 **PARTIAL**. Header/banner honest (`enemyRegisterCopy.ts` 6–15; WX honesty banner at `EnemyRegister.tsx` 356–370). Per-row copy for the seven live families still describes unwired verbs. |
| Frozen Terrain charges enemy / summon-AI walks (`enemyWalkMp.ts`) | Honesty vs player 2× MP. **Same verb as Slime Flood.** |
| Blood Moon / Mirror Field live in `spellEngine.ts` | Registry hooks empty (`mapModifiers.ts` 260–277). Live: Blood Moon **×1.25 player damage** (895); Mirror Field **20% ST reflect**. Gravity / Fog still unused (`_isGravityWell` / `_isFogOfWar`, WX 2324–2326). |
| Challenge HUD keep after first action (`3e95eab`) | Honesty of the nine numeric predicates. No tenth *kind*. |
| `worldFeatures.ts` Wave 2+3 | **52** `WF-*` rows. Imported only by `worldFeatures.test.ts`. |

**This 48h interval:** no combat catalog change on `main`. The diversity failure is now also a **queue** failure: 09-21 CDA (#359) and Wave-4/5 design PRs are still open while same-cycle automations keep authoring more catalogs.

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` + `WorldExploration.tsx` 5862–5866): after a fully random chess piece is placed, each body has an independent **30%** chance (`FAMILY_VARIANT_CHANCE`) to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog `mp` / `ap` — **never assigned**.

Battle start then:

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (`WorldExploration.tsx` 11872, 11898–11902) — integer piece-type rolls (`progression.ts` 180–186: `res` is `roll(2, 4 + base*0.9, …)`, **not** a 0–1 fraction).
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (`3607–3612`, `11970–11974`, `11997`): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

Family RES `0.05–0.75` is the **wrong unit** even if the wipe were removed. Binding must use the integer `getEnemyBaseStats` scale.

**Live combat hooks (three):**

| Family | Live verb | Where |
| :--- | :--- | :--- |
| `ember_knight` | melee applies burn 3/turn × 3 | `WorldExploration.tsx` 16789–16804 |
| `tide_shade` | melee applies MP −1 × 2 | `WorldExploration.tsx` 16805–16821 |
| `void_mirror` | 25% of pre-crit spell damage reflected | `castHelpers.ts` 335–345 |

`wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` are **pixel patterns only**. Register rows (`EnemyRegister.tsx` 28–70) still claim wall-phase, poison-on-hit, Weaken-from-range, magic immunity. The three live families also **mismatch** Register: Ember is melee-burn, not burning tiles; Tide is melee MP−1, not adjacent slow + regen; Void is 25% reflect, not “immune to magic until physical.”

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike.

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion`, no rarity second roll. Leader = highest `level` (`WorldExploration.tsx` 12011–12015). `computeAITier` (`combatMath.ts` 36–50) is a level bucket, then **30%** uniform 1–10 noise.

`WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (`worldFeatures.ts` 452, 1011, 1489) are designed + tested and **not imported by WX**.

### 1.3 AI profiles

`EnemyArchetype` (`enemyAI.ts` 86–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–477) **never returns `summoner`**. Order: any `healAmount > 0` → healer (`starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova`); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except `""` on boss minions (`WorldExploration.tsx` 16160). No family sets `"berserk"`.

Summoner **behavior** exists: WX 16375 calls `decideSummonerAction` when `enemy.isSummoner`. The flag is a **random overlay**. Pets 50/50 wolf or archer (`11935–11941`). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

**Coupling:** CDA-002 without CDA-006 makes band-1 queens `[nuke, starter-heal]` (Blood Mend, `healAmount: 12`, `spellType: "heal"`) into inferred healers. Band-1 kings gain `spell-rallying-cry` (`usableByEnemy: false`).

### 1.4 Spell pools

`ENEMY_KITS` (`enemyAI.ts` 163–185) is **piece-type only**:

| Piece | Band 0 (live, always) | Band 1 | Band 2 |
| :--- | :--- | :--- | :--- |
| pawn | Strike | + Venom | — |
| knight | Strike | Strike | Strike |
| bishop | Frost | Frost + Poison | — |
| rook | Strike | Strike + Iron Skin | — |
| queen | Frost | Frost/Inferno + Blood Mend | Inferno + Blood Mend |
| king | Frost | Frost/Inferno + Rallying Cry | Inferno + Rallying Cry |

Call site passes `currentMap.levelZone` **object** (`WorldExploration.tsx` 592, 11920). `Math.floor(object)` is `NaN` → **band 0 forever**. `longHorizonSim.ts` 50–57 names the same NaN (`available === false` at 533).

Frontend: 32 ids (`SPELL_ID_CATALOG`, `bossKits.ts` 29–62), all forced innate (`WorldExploration.tsx` 2395–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`). `defaultBossConfigs()` still names `fireball` / `cursed_gust` / `entangle` / `mist_form` (`admin.mo` 349+).

`applyPushback` / `applyAttract` (`occupancy.ts` 482, 537) have tests and **no spell caller**.

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (`WorldExploration.tsx` 5744–5763). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (`11869–11886`). No `formationId`.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). Unique `BossAbility` enums are the real diversity. Kits remix frontend ids:

| Spell id | Unique boss kits (`spellId:`) |
| ---: | :--- |
| `spell-shadow-veil` | 7 |
| `spell-cursed-wound` | 6 |
| `spell-frost-nova` | 6 |
| `spell-swap` | 5 |
| `spell-iron-skin` | 5 |
| `spell-lifesteal-nova` | 4 |
| `starter-blast` | 4 |

Phase 2 = add a catalog spell (`bossKits.ts` 90–92). Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–135). `combinedMechanic` is unread flavor. Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`. Admin already admits it (`AdminDashboard.tsx` 7144). Register boss tips (Archbishop invulnerable while pawns live) are lore.

Guardian summon kit lists **both** Shield and Iron Skin (`spellData.ts` 593). Alabaster Fortress kit also lists both (`bossKits.ts` 463–482).

### 1.7 Encounters / dungeon rooms

`generateEnemies` (`WorldExploration.tsx` 5711+): pack `1+rand*8` plus dungeon extras `[0,2,3,4,4,5]` and tier boost `[0,1,2,2,3,3]` (`spawnPolicy.ts` 27–28, 140–148). Same quadrant scatter. No encounter id, no wave, no objective. Depth = **more bodies + higher tier**. ENC-* / WDEAD remain PROPOSED.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109):

| Kind | Ids | Distinct player decision? |
| :--- | :--- | :--- |
| Turn-count clone | `under_15_turns`, `under_10_turns`, `under_5_turns` | Same verb, tighter number |
| Damage-taken clone | `under_50_damage`, `no_healing_under_30_damage`, `no_damage_taken` | Same verb, tighter number (+ heal ban) |
| Unique | `no_healing`, `under_8_ap_per_turn`, `direct_hit` | Yes — resource / range discipline |

No OBJECTIVE_PLAY, SPELL_DISCOVERY, or TEAM_SYNERGY predicate.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). Twins: `doka_1000` / `doka_10000`; `betrayal_witness` / `double_betrayal`. `level_10` (`unstoppable`) is a horizon cap on a game with no character level cap; WX fires it at 10 (`3632`). Rewards are Doka only.

### 1.10 Environmental mechanics / modifiers

Live hazards: lava / ice / spikes. 22 `MAP_MODIFIERS` (`mapModifiers.ts` 152–490).

| Problem | Ids |
| :--- | :--- |
| Identical hook | `slime_flood` ≡ `frozen_terrain` (`onMpCost: ×2`) |
| Flag exists, no behavior | `gravity_well`, `fog_of_war` |
| Registry empty, **engine live** | `blood_moon` (player damage ×1.25), `mirror_field` (20% ST reflect) |
| Numeric HP/damage reskins | `titans_vigor` (+1000 HP, 1–5×), `glass_realm` (×2), `doka_fever` (+25% enemy HP), **`blood_moon`** |
| Useful distinct verbs | `null_field`, `chaos_initiative`, `thorned_ground`, `arcane_overflow`, `iron_curse`, `vampiric_ground` |

`worldFeatures.ts` (52 `WF-*`) unused by spawn.

---

## 2. Mechanic category census (live)

Counts are **distinct player-facing verbs**, not name variants.

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike, Inferno, Sacrifice, chain, Expose/Veil, Cursed Wound, Frost Bolt/Nova, most boss kits, glass/titan/fever/**blood_moon** |
| STATUS | **Over** | RES/SP shred pair; poison≡venom; ember burn; Weaken; anti-heal |
| RESOURCE_MANIPULATION | **Over** | MP −1/−2 cluster (Frost Bolt, Slow, Frost Nova, tide melee); Drain Courage AP −1; Timestep; slime≡frozen 2× MP |
| SUPPORT | Clone-heavy | Shield≡Iron Skin; Blood Mend≈Rallying Cry; Enrage; wisp player-only |
| DEFENSE | Clone-heavy | Shield/Iron Skin; Barrier (player) |
| REACTION | **Clone-heavy** | Four live percent-reflects + backend `reflect_barrier`. No counter / delayed interrupt / absorb-then-release |
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
- Register extras Crimson Spawn / Shadow Lurker / Storm Caller = lore rows, not `EnemyFamily`.
- Pack members of different piece types often share band-0 Strike (pawn, knight, rook).
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

### Redundant reaction

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

Do **not** add families, ENC rooms, WF-* rows, Wave-2 spells, or Wave-5 Rush rows until the seven live families survive battle start and select kit/AI. Those catalogs already exist as PROPOSED.

| Gap | New player decision | Prefer existing id |
| :--- | :--- | :--- |
| Family persist + chassis + one unique verb | “This is a golem — walk around / shred RES / don’t poison-expect” | CDA-001 |
| Numeric kit band | “This late queen has Inferno — break LoS / save Mirror” | CDA-002; **must ship with** CDA-006 |
| Elite as AI/kit floor | “The banner one never kites — I must burst or leave” | CDA-003; `WF-ELT-*` |
| Named formation | “Tank in front, frost behind — peel the bishop first” | CDA-004 |
| Clone collapse | Each remaining id has one answer | CDA-005 |
| Family-bound AI; drain ≠ healer | “The drain bishop will not walk up to Blood-Mend me” | CDA-006 |
| Summoner by zone + family pet | “Kill the cantor or the board fills” | CDA-007 |
| `combinedMechanic` as code | “I must kill Archbishop first or the Pawn comes back” | CDA-008 |
| Challenge kinds, not tighter numbers | “Hold the tile / kill the summoner first” | CDA-009 |
| Achievement = learn, not hoard | “I go looking for a Void Mirror” | CDA-010 |
| Distinct / real modifiers | “Fog: I cannot snipe; Frozen: ice tiles, not another slime” | CDA-011 (Blood Moon is live ×1.25 DAMAGE — replace or delist; Mirror Field is live reflect — do not re-implement) |
| One spell catalog | Discovery can exist | CDA-012 |
| Freeze new stickers | Prevents fake “new name, same Strike pawn” | CDA-013 PARTIAL |
| Encounter objects (hold / escort / wave) | “The shrine dies if I chase the rat” | CDA-014 |
| Unused POSITIONING verbs | “If I stand here they slam me into lava” | CDA-015 |
| Register rows match live verbs | “I read Ember = melee burn, not burning tiles” | **CDA-016** (unpublished in #359) |
| First non-reflect REACTION | “I held the cast because a counter would fire” | **CDA-017** |
| Freeze new `WF-*` until one is wired | Stops 52-row catalog flock | **CDA-018** |
| Freeze same-cycle ENC / Wave-5 Rush *code* | Stops a second unread dual-boss table | **CDA-019 (new this run)** |

---

## 6. What this run will not recommend

- New HP%, damage%, or palette families.
- Shipping Crimson Spawn / Shadow Lurker / Storm Caller as live `EnemyFamily`.
- A third Doka-hoard achievement, a 12-turn challenge, or a fifth reflect.
- Another `WF-*` row, ENC-TEACH-04, Wave-4 family TypeScript, or Wave-5 `BOSS_RUSH_ROOMS` row.
- Retuning `pickEnemyLevelFromTiers` percents, RAF, mapGen solvability, or combatMath formulas.
- Treating `longHorizonSim.ts` as player telemetry (`available === false`).
- Treating Blood Moon ×1.25 or Titan/Glass/Fever as “content.”
- Twins of `CDA-2026-09-02-001` … `015` or `CDA-2026-09-21-016` … `018`.
