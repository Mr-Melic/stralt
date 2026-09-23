# Content Diversity & Repetition Audit — 2026-09-23

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (report-findings orchestration)  
**Prior auditor HEADs:** also `0f5363f` (2026-09-21 and 2026-09-22). Those ledgers are **PR #359** and **PR #403** and are **still open** — they never landed on `main`. Every prior check was **re-verified on this HEAD**; line numbers match the 09-22 ledger. This run does **not** mint twins of `CDA-2026-09-02-001` … `015`, `CDA-2026-09-21-016` … `018`, or `CDA-2026-09-22-019`.

ACTION_IDs this run: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-23.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-23.md) — reaffirm `001`–`015` (013 PARTIAL) and unpublished `016`–`019`; mint `CDA-2026-09-23-020` only for the Wave-6 TypeScript-catalog gap.

On `main` the durable 09-02 ledger still exists ([`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md)).

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD |
| :--- | :--- |
| Enemy family sheets Wave 1–3 | `ENEMY_ELITE_EVOLUTION_2026-08-31.md` / `09-01` / `09-02` — PROPOSED. Wave 4–6 sheets live only on open PRs (#349, #405, #452). |
| Named formations drop 1–3 | `docs/design/ENEMY_FORMATIONS_*` — PROPOSED, unwired. Drops 4–5 on #348 / #401. |
| ENC-* rooms | `docs/encounters/ENCOUNTER_EVOLUTION_*` — PROPOSED. Tide/File/Clock (#347), Wick/Rime/Smoke (#396). |
| Spell verbs (push, attract, root, trap, delayed execute, …) | `SPELL_PROPOSALS_*` — PROPOSED. Waves 4–5 on #342 / #411. |
| World features (`WF-*`, **52** rows, including three `WF-ELT-*`) | `engine/worldFeatures.ts` — unit-tested, **not imported by WX**. Wave 4–6 TypeScript growth is queued (#344, #399, **#454**). |
| Owner encounter pack | `WORLD_ENCOUNTER_ADMIN_DESIGN_*` — WDEAD ids still NEW (#394, #451). |
| Spell discovery waves | `SPELL_DISCOVERY_ECOSYSTEM_*` — PROPOSED; live hydrate still forces every `starterSpells` id `isBaseSpell`. |
| Boss Rush extras | Live table is **10** rooms. Wave 5 Table C (#367) and Wave 6 Table D (#406) are docs only. |

**Open design flock (oldest-first queue, still not on `main`):** CDA itself (#359, #403); Wave-4 spells (#342); Wave-4 world dynamics TypeScript (#344); Tide/File/Clock ENC (#347); formations drop 4 (#348); Wave-4 elites (#349); enemy AI increment (#351); Wave-5 Rush Table C (#367); Wave-4 spell discovery (#371); WDEAD (#394 / #451); Wick/Rime/Smoke ENC (#396); Wave-5 world dynamics TypeScript (#399); formations drop 5 (#401); Wave-5 elites (#405); Wave-6 Rush Table D (#406); Wave-5 spells (#411). Same-hour 09-23 siblings: Wave-6 elites (#452, docs), Expansion Director (#453, docs), **Wave-6 world dynamics (#454) mutates `worldFeatures.ts`**. Those catalogs stay **PROPOSED**. CDA-013 / CDA-018 / CDA-019 / **CDA-020** are the freeze.

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a 16th RES-shred spell, a fifth reflect, a 53rd `WF-*` row, Wave-6 `EnemyFamily` members, or another unread `combinedMechanic` string.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

---

## 0. Prior-run checks (2026-09-22 → this HEAD)

HEAD did not move. Independent grep/read of the live catalogs:

| # | Question | 2026-09-23 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay in `spawnPolicy.ts`; chassis stays random. | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286); `tryPlaceEnemy` (`WorldExploration.tsx` 5764–5765) |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` (`WorldExploration.tsx` 3607–3612, 11970–11974, 11997). RES/SP: `computeEnemyStats` (`11872`, `11898–11902`) |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | `WorldExploration.tsx` 2395–2400 |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** | `useBossRush.ts` 19–135 only |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312; 49–67 vs 394–415 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | `buildEnemyKit(..., currentMap.levelZone)` 11920; `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at 44. | `gameConstants.ts` 298–299; WX 11932–11942 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127; `bossTypes.ts` 390–410 |
| 9 | Is REACTION still only percent-reflect clones? | **Yes.** Four live + backend ghost. | Mirror (`spellEngine.ts` 917–926); Void 25% (`castHelpers.ts` 335–345); Mirror Field 20% (`spellEngine.ts` 901–907); boss shield 30% (`castHelpers.ts` 363–375); `reflect_barrier` (`admin.mo` 182) |
| 10 | Did `worldFeatures.ts` grow past 52 unused rows? | **No on `main`.** Still 52. Open #344 / #399 / **#454** would grow it. | grep `id: "WF-"` → 52; WX does not import the module |
| 11 | Did CDA-002 land without CDA-006? | **No** (002 unshipped). Coupling still live in kits. | Queen band 1 = `[nuke, starter-heal]` (`enemyAI.ts` 176–178); `inferArchetype` healer on `healAmount > 0` (447–452) |
| 12 | Did PR #359 merge (016–018 on `main`)? | **No.** #403 (019) also still open. | `gh pr view 359/403` → OPEN |
| 13 | Did `BOSS_RUSH_ROOMS.length` grow past 10? | **No.** | `useBossRush.ts` 24–135 (ten `roomIndex` rows 0–9) |

### What changed since 09-02 (still true; not new this 48h)

| Change | Diversity effect |
| :--- | :--- |
| Family overlay extracted to `spawnPolicy.ts` | Same 30% sticker. `ap`/`mp` unused (`spawnPolicy.ts` 14–15, 64–66). |
| Enemy Register chrome = **FLAVOR LORE** (`9e28cf9`) | CDA-013 **PARTIAL**. Header/banner honest (`enemyRegisterCopy.ts` 6–15; WX honesty banner at `EnemyRegister.tsx` 356–370). Per-row copy for the seven live families still describes unwired verbs. |
| Frozen Terrain charges enemy / summon-AI walks (`enemyWalkMp.ts`) | Honesty vs player 2× MP. **Same verb as Slime Flood.** |
| Blood Moon / Mirror Field live in `spellEngine.ts` | Registry hooks empty (`mapModifiers.ts` 260–277). Live: Blood Moon **×1.25 player damage** (895); Mirror Field **20% ST reflect**. Gravity / Fog still unused (`_isGravityWell` / `_isFogOfWar`, WX 2324–2326). |
| Challenge HUD keep after first action (`3e95eab`) | Honesty of the nine numeric predicates. No tenth *kind*. |
| `worldFeatures.ts` Wave 2+3 | **52** `WF-*` rows. Imported only by `worldFeatures.test.ts`. |

**This 48h interval:** no combat catalog change on `main` (`0f5363f` since 09-21). The diversity failure is now a **three-day queue** failure: 09-21 CDA (#359), 09-22 CDA (#403), and Wave-4/5/6 design PRs are still open while same-cycle automations keep authoring more catalogs — including TypeScript `WF-*` growth in #454.

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` + `WorldExploration.tsx` 5862–5866): after a fully random chess piece is placed, each body has an independent **30%** chance (`FAMILY_VARIANT_CHANCE`) to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog `mp` / `ap` — **never assigned**.

Battle start then:

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (`WorldExploration.tsx` 11872, 11898–11902) — piece-type integer rolls (`progression.ts` 180–186: `res` is `roll(2, 4 + base*0.9, …)`, **not** a 0–1 fraction).
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (`WorldExploration.tsx` 3607–3612, 11970–11974, 11997): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

Family RES values `0.05–0.75` are the **wrong unit** even if the wipe were removed. Binding family stats must use the integer `getEnemyBaseStats` scale, not the overlay fractions.

**Live combat hooks (three):**

| Family | Live verb | Where |
| :--- | :--- | :--- |
| `ember_knight` | melee applies burn 3/turn × 3 | `WorldExploration.tsx` 16789–16803 |
| `tide_shade` | melee applies MP −1 × 2 | `WorldExploration.tsx` 16805–16821 |
| `void_mirror` | 25% of pre-crit spell damage reflected | `castHelpers.ts` 335–345 |

`wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` have **pixel patterns only** in combat. Register copy (`EnemyRegister.tsx` 28–70) claims wall-phase, poison-on-hit, burning tiles, adjacent slow + regen, Weaken-from-range, magic immunity — none of that is wired.

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike. Kit and `inferArchetype` follow the random chassis (`tryPlaceEnemy` 5764–5765).

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion`, no rarity second roll. Leader = highest `level` in the pack (`WorldExploration.tsx` 12010–12015). `computeAITier` (`combatMath.ts` 36–51) is a level bucket, then **30%** uniform 1–10 noise — not a variant floor.

`worldFeatures.ts` `WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (`elite_patrol`) are designed + tested and **not imported by WX**. Wave-6 elite sheets (#452) are another PROPOSED catalog on top of unbound live seven.

### 1.3 AI profiles

`EnemyArchetype` union (`enemyAI.ts` 86–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–477) never returns `summoner`. Order: any `healAmount > 0` → healer (so `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` are healers); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except an empty string at WX 16160. No family has `aiStrategy: "berserk"`.

Summoner **behavior** exists. WX 16375–16376 calls `decideSummonerAction` when `enemy.isSummoner`. That flag is a **random overlay**, not a family. Pets are 50/50 wolf or archer (`WorldExploration.tsx` 11932–11942). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

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

`buildEnemyKit` floors `levelZone`. Call site passes `currentMap.levelZone` **object**. `Math.floor(object)` is `NaN` → `Math.max(0, NaN)` is `NaN` → every `z >= 1` is false → **band 0 forever**. `longHorizonSim.ts` 50–57 documents the same NaN.

Knight never grows. Queen/king “late Inferno” never arrives. Shipping CDA-002 without CDA-006 makes band-1 queens Blood-Mend **healers**.

Frontend catalog: 32 ids in `SPELL_ID_CATALOG` (`bossKits.ts` 29–62). All `starterSpells` forced innate (`WorldExploration.tsx` 2395–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) with targeting flags the frontend rows lack. Backend boss seeds (`admin.mo` 358+) still name `fireball` / `cursed_gust` / `entangle` / `mist_form` that are in neither frontend kit table.

Engine verbs with **no live spell caller:** `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537 — tests only). Targeting supports `linear` / `diagonal` / `minRange`; no enemy kit sets them.

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (`WorldExploration.tsx` 5738–5755). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (11869–11891). Named formation catalogs and `worldFeatures.ts` encounter slots are unwired.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). `BossAbility` enums are **unique per later boss** — that axis is actually diverse. Kits are not: they remix the same frontend ids.

| Spell id | `spellId:` rows in `BOSS_KITS` |
| ---: | :--- |
| `spell-shadow-veil` | 7 |
| `spell-cursed-wound` | 6 |
| `spell-frost-nova` | 6 |
| `spell-swap` | 5 |
| `spell-iron-skin` | 5 |
| `spell-lifesteal-nova` | 4 |
| `starter-blast` | 4 |

Phase 2 is “add a catalog spell” (`bossKits.ts` 90–92: phase 2 always contains at least one id phase 1 lacks). Signature twists stay in `BossAbility` / `useBossAI`, not in the kit.

Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–135). `combinedMechanic` is flavor text (grep: definition + ten string literals, no consumer). Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`. Admin copy already admits the mismatch (`AdminDashboard.tsx` 7143–7144).

Register boss tips (e.g. Archbishop invulnerable while pawns live) are lore, not the live `BossAbility` set.

### 1.7 Encounters / dungeon rooms

`dungeonSpawnExtras` (`spawnPolicy.ts` 27–28, 140–148): pack size `1+rand*8` plus dungeon extras `[0,2,3,4,4,5][min(depth,5)]` and tier boost `[0,1,2,2,3,3]`. Same quadrant scatter. No encounter id, no wave, no objective, no formation id.

Live dungeon “rooms” are **more bodies + higher tier**, not ENC-* structures. Rest / boss / dungeon portals are separate chance rolls, not a taught chain.

Proposed ENC-* / WDEAD encounter catalogs remain PROPOSED.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109):

| Kind | Ids | Distinct player decision? |
| :--- | :--- | :--- |
| Turn-count clone | `under_15_turns`, `under_10_turns`, `under_5_turns` | Same verb, tighter number |
| Damage-taken clone | `under_50_damage`, `no_healing_under_30_damage`, `no_damage_taken` | Same verb, tighter number (+ heal ban) |
| Unique | `no_healing`, `under_8_ap_per_turn`, `direct_hit` | Yes — resource / range discipline |

No OBJECTIVE_PLAY, SPELL_DISCOVERY, or TEAM_SYNERGY predicate.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). Grind / event keys: `first_battle_win`, `survive_1hp`, `spell_level_5`, `doka_1000`, `explore_25_maps`, `betrayal_witness`, `leader_slayer`, `jackpot_heal`, `loot_10_doka`, `double_betrayal`, `level_10`, `spell_master_8`, `critical_5_in_battle`, `pacifist_run`, `doka_10000`.

Twins: Doka hoard 1k/10k; betrayal / double betrayal. `level_10` (`unstoppable`) is a **horizon cap** on a game with no character level cap. WX still fires it at 10 (3632). Rewards are Doka only — never a spell.

### 1.10 Environmental mechanics / modifiers

Live hazards: lava / ice / spikes (mapGen + battle walk). 22 `MAP_MODIFIERS` (`mapModifiers.ts` 152–490).

| Problem | Ids |
| :--- | :--- |
| Identical hook | `slime_flood` ≡ `frozen_terrain` (both `onMpCost: ×2`) |
| Registry-empty but **live** in `spellEngine` | `blood_moon` ×1.25 DAMAGE; `mirror_field` 20% ST reflect |
| Announce-only placeholders | `gravity_well`, `fog_of_war` (`_isGravityWell` / `_isFogOfWar` unused) |
| Numeric HP/damage reskins | `titans_vigor` (+1000 HP, 1–5× dmg), `glass_realm` (×2), `doka_fever` (+25% enemy HP) |
| Useful distinct verbs | `null_field`, `chaos_initiative`, `thorned_ground`, `arcane_overflow`, `iron_curse` (heal tax), `vampiric_ground` |

`worldFeatures.ts` (52 `WF-*` rows, including shrine / teleport / elite patrol / spell-bearing enemy) is unused by spawn.

---

## 2. Mechanic category census (live)

Counts are **distinct player-facing verbs**, not name variants.

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike, Inferno, Sacrifice, chain, Expose/Veil, Cursed Wound, Frost Bolt/Nova, most boss kits, glass/titan/fever, Blood Moon ×1.25 |
| STATUS | **Over** | RES/SP shred pair; poison≡venom; ember burn; Weaken; anti-heal |
| RESOURCE_MANIPULATION | **Over** | MP −1/−2 cluster (Frost Bolt, Slow, Frost Nova, tide melee); Drain Courage AP −1; Timestep (player) |
| SUPPORT | Clone-heavy | Shield≡Iron Skin; Blood Mend≈Rallying Cry; Enrage; wisp player-only |
| DEFENSE | Clone-heavy | Shield/Iron Skin; Mirror (player); Barrier (player) |
| REACTION | **Clone cluster (over as reflect, under as verb)** | Four live percent-reflects + backend `reflect_barrier`. No counter, no delayed interrupt |
| SUMMONING | Shallow | Five player pets; enemy overlay wolf/archer only; bosses spawn via abilities |
| CONTROL | Partial | MP taxes, no true root; no delayed execute |
| TERRAIN | Partial | lava/ice/spikes + some modifiers; gravity/fog placeholders; slime≡frozen |
| POSITIONING | **Under** | Swap only; formations are scatter; push/attract unwired |
| MOBILITY | **Under** | Swap; Haste +MP; random knight chassis. No dash |
| TEAM_SYNERGY | **Under** | Leader-by-level; no pack roles; `combinedMechanic` unused |
| OBJECTIVE_PLAY | **Absent** | Challenges are numeric; ENC-* / `WF-*` unwired |
| SPELL_DISCOVERY | **Absent** | Entire frontend catalog pre-owned as base |

---

## 3. Redundancy (differs mainly by HP / damage / name / number)

### Redundant enemies

- Four families with no combat hook: wraith / golem / rat / scribe = palette + wiped multipliers.
- Register extras Crimson Spawn / Shadow Lurker / Storm Caller = lore rows, not `EnemyFamily`.
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

### Redundant reaction

Four live reflects that only differ by percent / trigger: Mirror (next ST), Void 25% (family), Mirror Field 20% (modifier, ST only), boss shield 30%. Adding Wave-6 “mirror” elites or a fifth modifier would not create a new player decision.

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
| modifier | Two-roll among 22, including two no-ops, one MP-cost duplicate, several numeric DAMAGE reskins, and a reflect clone |

Relative level without the other axes is HP/damage inflation — the failure mode this audit is meant to stop.

---

## 5. What to build (only if it creates a new player decision)

Do **not** add families, ENC rooms, WF-* rows, Wave-2+ spells, or Wave-5/6 Rush rows until the seven live families survive battle start and select kit/AI. Those catalogs already exist as PROPOSED.

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
| Register rows match live verbs | “I read Ember = melee burn, not burning tiles” | **CDA-016** (unpublished in #359 / #403) |
| First non-reflect REACTION | “I held the cast because a counter would fire” | **CDA-017** |
| Freeze new `WF-*` until one is wired | Stops 52-row catalog flock | **CDA-018** |
| Freeze same-cycle ENC / Wave-5 Rush *code* | Stops a second unread dual-boss table | **CDA-019** (unpublished in #403) |
| Freeze Wave-6 TypeScript catalogs | Stops #454 growing unread `WF-*` and Wave-6 family stickers | **CDA-020 (new this run)** |

---

## 6. What this run will not recommend

- New HP%, damage%, or palette families.
- Shipping Crimson Spawn / Shadow Lurker / Storm Caller as live `EnemyFamily`.
- A third Doka-hoard achievement, a 12-turn challenge, or a fifth reflect.
- Another `WF-*` row, ENC-TEACH-05, Wave-6 family TypeScript, or Wave-5/6 `BOSS_RUSH_ROOMS` row.
- Retuning `pickEnemyLevelFromTiers` percents, RAF, mapGen solvability, or combatMath formulas.
- Treating `longHorizonSim.ts` as player telemetry (`available === false` at line 533).
- Treating Blood Moon ×1.25 or Titan/Glass/Fever as “content.”
- Twins of `CDA-2026-09-02-001` … `015`, `CDA-2026-09-21-016` … `018`, or `CDA-2026-09-22-019`.

---

## 7. Next-run checks

1. Does family still fail to select kit / AI / passive?
2. Is family HP **and** RES/SP still wiped at battle start?
3. Are `starterSpells` still all forced `isBaseSpell`?
4. Does any code read `combinedMechanic` besides the room table?
5. Did Shield/Iron Skin or Poison/Venom diverge?
6. Is kit band still NaN (`levelZone` object)?
7. Is summoner chance still linear in raw player level?
8. Is `weeping_pawn_2` still not in `BOSS_IDS`?
9. Is REACTION still only percent-reflect clones?
10. Did `worldFeatures.ts` grow past 52 unused rows (especially via #344 / #399 / #454)?
11. Did CDA-002 land without CDA-006 (queens as healers)?
12. Did PR #359 or #403 merge (016–019 on `main`)?
13. Did `BOSS_RUSH_ROOMS.length` grow past 10?
14. Did Wave-6 names enter `EnemyFamily` (`gameTypes.ts` 12–20)?
