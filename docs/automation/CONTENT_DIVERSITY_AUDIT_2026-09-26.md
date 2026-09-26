# Content Diversity & Repetition Audit — 2026-09-26

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (unchanged since 2026-09-21).  
**Prior auditor HEAD:** `0f5363f` (2026-09-25). Every 09-25 check is **still true**; line numbers did not move.

ACTION_IDs: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-26.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-26.md).

On `main`: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md) (`CDA-2026-09-02-001` … `015`).

Unpublished ledgers (still **OPEN**): GitHub **PR #359** (09-21, `016`–`018`), **PR #403** (09-22, copies `016`–`018` + `019`), **PR #465** (09-23, copies `016`–`019` + `020`), **PR #521** (09-24, copies `016`–`020` + `021`), **PR #557** (09-25, copies `016`–`021` + `022`). This file **reaffirms** those ids and **mints** `CDA-2026-09-26-023`. Do not mint twins.

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD / flock |
| :--- | :--- |
| Enemy family sheets Wave 1–8 | `ENEMY_ELITE_EVOLUTION_*` — PROPOSED. Wave 7 = **#535**. Wave 8 = **#558** (docs, after CDA-022) |
| Named formations | `docs/design/ENEMY_FORMATIONS_*` — PROPOSED, unwired. Drop 7 = **#537**. Drop 8 = **#575** (docs, after CDA-022) |
| ENC-* rooms | `docs/encounters/ENCOUNTER_EVOLUTION_*` — PROPOSED. Gale/Twin/Pincer = **#519**. Face/Mute/Span/Brand = **#574** |
| Spell verbs (push, attract, root, trap, delayed execute, …) | `SPELL_PROPOSALS_*` — PROPOSED. Wave 7 = **#525** / SDE **#533**. Wave 8 = **#563** / SDE **#590** |
| World features (`WF-*`) | `engine/worldFeatures.ts` — **52** ids, unit-tested, **not imported by WX**. Wave 4–8 TypeScript dumps: **#344 / #399 / #454 / #503 / #578** |
| Boss Rush tables C–G | Design PRs **#367 / #406 / #474 / #518 / #572**. Live `BOSS_RUSH_ROOMS.length` still **10** |
| Owner encounter pack | `WORLD_ENCOUNTER_ADMIN_DESIGN_*` — WDEAD ids still NEW |

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a fifth reflect, a 53rd (or 117th, or 133rd) `WF-*`, Wave-8 `EnemyFamily` members, extra `BOSS_RUSH_ROOMS`, or a 33rd innate `starterSpells` row.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is still:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

---

## 0. Prior-run checks (2026-09-25 → this HEAD)

`origin/main` did not move. 09-25 next-run questions, re-run 2026-09-26:

| # | Question | 2026-09-26 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay is stats + pixel art. Chassis stays random. | `spawnPolicy.ts` 279–286; WX `tryPlaceEnemy` then `applyFamilyVariantsToRoster` 5862–5866 |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` 3607–3612, 11970–11997. RES/SP: `computeEnemyStats` 11873, 11898–11902 |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | WX 2395–2400 |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** | `useBossRush.ts` 19–131. Grep: 11 hits, all in that file |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | `buildEnemyKit(..., currentMap.levelZone)` WX 11920; `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at level 44. | `gameConstants.ts` 298–299; WX 11932–11939 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127 vs `bossTypes.ts` 390–410 |
| 9 | Is REACTION still only percent-reflect clones? | **Yes.** Four live reflects. | Mirror / Void 25% / Mirror Field 20% / boss shield 30% |
| 10 | Did `worldFeatures.ts` grow past 52 unused rows **on main**? | **No on main.** Open flock would. | Main 52. **#503** still 116 ids. **#578** Wave-8 **132** ids (+2390) |
| 11 | Did CDA-002 land without CDA-006? | **Neither landed.** | Kit band still NaN; `inferArchetype` still `healAmount > 0` (`enemyAI.ts` 447–452). No `return "summoner"` |
| 12 | Did PR #359, #403, #465, #521, or #557 merge (016–022 on `main`)? | **No.** All still open. | `gh` search: 359 / 403 / 465 / 521 / 557 `state: OPEN` |
| 13 | Did `BOSS_RUSH_ROOMS.length` grow past 10? | **No.** | `useBossRush.ts` roomIndex 0–9 |
| 14 | Did Wave-6/7/8 names enter `EnemyFamily`? | **No.** | `gameTypes.ts` 12–20: original seven + `default`. No `isElite` / `isChampion` |
| 15 | Did PR #503 merge (52 → 116 `WF-*`)? | **No.** Still open. | `gh` files: `worldFeatures.ts` +1914 / −3 |
| 16 | Did #535 / #533 / #537 land TypeScript (`EnemyFamily` / `starterSpells` / spawn `formationId`)? | **No.** Still docs. | #535 / #533 / #537 still open, docs-only file lists |

What **did** change since 09-25 is the **open flock after CDA-022**, not live combat. Same-day 2026-09-25 automations that opened **after** PR #557 (00:09Z) authored Wave-8 elite sheets (**#558**, docs), Wave-8 SDE (**#590**, docs), formations drop 8 (**#575**, docs), Wave-8 spells (**#563**, docs), Wave-9 boss / Rush Table G (**#572**, docs), Face/Mute/Span/Brand ENC (**#574**, docs), and Wave-8 world dynamics (**#578**) which is **TypeScript** (`worldFeatures.ts` +2390; 52 → **132** `WF-*`). CDA-022 already froze Wave-7 elite / SDE / formation TypeScript and said not to author Wave-8 catalogs. Treating that flock as a green light to add `EnemyFamily` members, `starterSpells` rows, spawn `formationId`, extra `BOSS_RUSH_ROOMS`, or more unread `WF-*` is the only new actionable gap (`CDA-2026-09-26-023`).

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` `FAMILY_VARIANT_CHANCE` 35, `maybeApplyEnemyFamilyVariant` 279–286; WX 5862–5866): after a fully random chess piece is placed, each body has an independent **30%** chance to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog `mp` / `ap` are **never assigned** (`spawnPolicy.ts` 14–15, 64–66).

Battle start then:

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (WX 11873, 11898–11902) — piece-type integer rolls (`progression.ts`: `res` is `roll(2, 4 + base*0.9, …)`, **not** a 0–1 fraction). `iron_golem.res = 0.75` (`spawnPolicy.ts` 84) is the wrong unit.
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (WX 3607–3612, 11970–11997): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

**Live combat hooks (three):**

| Family | Live verb | Where |
| :--- | :--- | :--- |
| `ember_knight` | melee applies burn 3/turn × 3 | WX 16789–16803 |
| `tide_shade` | melee applies MP −1 × 2 | WX 16805–16821 |
| `void_mirror` | 25% of pre-crit spell damage reflected | `castHelpers.ts` 335–345 |

`wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` have **pixel patterns only** in combat. Register copy (`EnemyRegister.tsx` 28–70) still claims wall-phase, poison-on-hit, burning tiles, Weaken-from-range, magic immunity — none of that is wired. Chrome is honest (`enemyRegisterCopy.ts` 8–15: **FLAVOR LORE**); per-row copy still lies (CDA-016).

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike. Kit and `inferArchetype` follow the random chassis.

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion`, no rarity second roll. Leader = highest `level` in the pack (WX 12010–12015). `computeAITier` (`combatMath.ts` 36–51) is a level bucket, then **30%** uniform 1–10 noise — not a variant floor.

`worldFeatures.ts` `WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (452, 1011, 1489) are designed + tested and **not imported by WX**.

### 1.3 AI profiles

`EnemyArchetype` union (`enemyAI.ts` 86–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–476) **never returns `summoner`** (grep: no `return "summoner"`). Order: any `healAmount > 0` → healer (so `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` are healers); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except an empty string at WX 16160. No family has `aiStrategy: "berserk"`.

Summoner **behavior** exists. WX 16375 calls `decideSummonerAction` when `enemy.isSummoner`. That flag is a **random overlay**, not a family. Pets are 50/50 wolf or archer (WX 11935–11941). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

**CDA-002 without CDA-006** still makes band-1 queens `[nuke, starter-heal]` → archetype healer. Do not ship 002 alone.

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

`buildEnemyKit` floors `levelZone`. Call site passes `currentMap.levelZone` **object** (`{ name, minLevel, maxLevel }`, typed `any` at WX 592). `Math.floor(object)` is `NaN` → every `z >= 1` is false → **band 0 forever**.

Knight never grows. Queen/king “late Inferno” never arrives.

Frontend catalog: 32 ids in `spellData.ts` / `SPELL_ID_CATALOG`. All `starterSpells` forced innate (WX 2395–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) with targeting flags the frontend rows lack. Backend `void_collapse` advertises `attract_multi` — occupancy helpers `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537) still have **no live spell caller** (tests only). Backend boss seeds (`admin.mo` 358+) still name `fireball` / `cursed_gust` / `entangle` / `mist_form` that are in neither frontend kit table.

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (WX, `SPAWN_MIN_CHEBYSHEV` 4). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (11869–11891). Named formation catalogs (including drop 8 **#575**) and `worldFeatures.ts` encounter slots are unwired.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). `BossAbility` enums are **unique per later boss** — that axis is actually diverse. Kits are not: they remix the same frontend ids (`spell-shadow-veil`, `spell-cursed-wound`, `spell-frost-nova`, `spell-swap`).

Phase 2 is “add a catalog spell” (`bossKits.ts` 90–92). Signature twists stay in `BossAbility` / `useBossAI`, not in the kit.

Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–135). `combinedMechanic` is flavor text. Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`. Admin copy already admits the mismatch (`AdminDashboard.tsx` 7144). Register boss tips (e.g. Archbishop invulnerable while pawns live) are lore, not the live `BossAbility` set.

### 1.7 Encounters / dungeon rooms

`generateEnemies` (WX 5711+): pack size `1+rand*8` plus dungeon extras `[0,2,3,4,4,5][min(depth,5)]` and tier boost `[0,1,2,2,3,3]` (`spawnPolicy.ts` 27–28; WX 5720–5722). Same quadrant scatter. No encounter id, no wave, no objective, no formation id.

Live dungeon “rooms” are **more bodies + higher tier**, not ENC-* structures.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109):

| Kind | Ids | Distinct player decision? |
| :--- | :--- | :--- |
| Turn-count clone | `under_15_turns`, `under_10_turns`, `under_5_turns` | Same verb, tighter number |
| Damage-taken clone | `under_50_damage`, `no_healing_under_30_damage`, `no_damage_taken` | Same verb, tighter number (+ heal ban) |
| Unique | `no_healing`, `under_8_ap_per_turn`, `direct_hit` | Yes — resource / range discipline |

No OBJECTIVE_PLAY, SPELL_DISCOVERY, or TEAM_SYNERGY predicate.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). Grind / event keys including `doka_1000` + `doka_10000`, `betrayal_witness` + `double_betrayal`, `level_10` (`unstoppable`) on a game with no level cap. WX still fires `level_10` at 10 (3632). Rewards are Doka only — never a spell.

### 1.10 Environmental mechanics / modifiers

Live hazards: lava / ice / spikes (mapGen + battle walk). 22 `MAP_MODIFIERS` (`mapModifiers.ts` 152+).

| Problem | Ids |
| :--- | :--- |
| Identical hook | `slime_flood` ≡ `frozen_terrain` (both `onMpCost: ×2`) |
| Registry empty, **live** in `spellEngine` | `blood_moon` ×1.25 (`spellEngine.ts` 895); `mirror_field` 20% ST reflect (901–907) |
| Announce-only placeholders | `gravity_well`, `fog_of_war` |
| Numeric HP/damage reskins | `titans_vigor`, `glass_realm`, `doka_fever` |
| Useful distinct verbs | `null_field`, `chaos_initiative`, `thorned_ground`, `arcane_overflow`, `iron_curse`, `vampiric_ground` |

`worldFeatures.ts`: **52** `WF-*` rows on `main`. Imported only by `worldFeatures.test.ts`. WX does not import the module.

---

## 2. Mechanic category census (live)

Counts are **distinct player-facing verbs**, not name variants.

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike, Inferno, Sacrifice, chain, Expose/Veil, Cursed Wound, Frost Bolt/Nova, most boss kits, glass/titan/fever, Blood Moon ×1.25 |
| STATUS | **Over** | RES/SP shred pair; poison≡venom; ember burn; Weaken; anti-heal |
| RESOURCE_MANIPULATION | **Over** | MP −1/−2 cluster; Drain Courage AP −1; Timestep (player) |
| SUPPORT | Clone-heavy | Shield≡Iron Skin; Blood Mend≈Rallying Cry; Enrage; wisp player-only |
| DEFENSE | Clone-heavy | Shield/Iron Skin; Mirror (player); Barrier (player); void 25% reflect |
| SUMMONING | Shallow | Five player pets; enemy overlay wolf/archer only; bosses spawn via abilities |
| CONTROL | Partial | MP taxes, no true root; no delayed execute |
| TERRAIN | Partial | lava/ice/spikes + some modifiers; gravity/fog empty; slime≡frozen |
| POSITIONING | **Under** | Swap only; formations are scatter; push/attract unwired |
| REACTION | **Over as clones, under as verbs** | Four percent-reflects. No counter, no delayed interrupt |
| MOBILITY | **Under** | Swap; Haste +MP; random knight chassis. No dash |
| TEAM_SYNERGY | **Under** | Leader-by-level; no pack roles; `combinedMechanic` unused |
| OBJECTIVE_PLAY | **Absent** | Challenges are numeric; ENC-* / WF-* unwired |
| SPELL_DISCOVERY | **Absent** | Entire frontend catalog pre-owned as base |

---

## 3. Redundancy (differs mainly by HP / damage / name / number)

### Redundant enemies

- Four families with no combat hook: wraith / golem / rat / scribe = palette + wiped multipliers.
- Register extras Crimson Spawn / Shadow Lurker / Storm Caller = lore rows, not `EnemyFamily`.
- Pack members of different piece types often share band-0 Strike (pawn, knight, rook) — chassis name without kit.
- Dungeon depth extra bodies = more of the same random pieces.
- Wave 4–8 `WF-*` TypeScript rows (open PRs) = more unread names for the same unused spawn.
- Wave-8 elite sheets (**#558**) = more unread family names for the same unbound sticker.

### Redundant spells

| Pair | Same verb | Cosmetic delta |
| :--- | :--- | :--- |
| Shield / Iron Skin | +30% RES / 3 turns, ally, range 3 | AP 2 vs 3 |
| Poison Arrow / Venom Strike | 4 dmg/turn × 3, no upfront | range 4 AP 2 vs range 2 AP 3; `dotType` string |
| Expose / Shadow Veil | damage + RES+SP shred / 2 turns | 15 @ ×0.8 vs 18 @ ×0.85 |
| Blood Mend / Rallying Cry | self heal + +15% CHC / 2 | 12 HP AP 3 vs 20 HP AP 4; Cry `usableByEnemy: false` |
| Life Drain / Drain Courage / Lifesteal Nova | drain + heal | SP shred vs AP −1 vs AoE — related, not identical |
| Frost Bolt / Slow / Frost Nova | MP tax | −1/1 vs −2/2 vs AoE −1 |
| Mirror / Void 25% / Mirror Field 20% / boss shield 30% / backend `reflect_barrier` | percent reflect | magnitude + who owns the hook |

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
| modifier | Two-roll among 22, including two no-ops, one duplicate, and numeric HP/dmg reskins |

Relative level without the other axes is HP/damage inflation — the failure mode this audit is meant to stop.

---

## 5. Open flock (proposed, not live) — 2026-09-26

These PRs must not be mistaken for shipped content. **Docs are fine. TypeScript catalog growth is not**, until CDA-001 / 002+006 / 004 / 008 / 014 bind.

| PR | Created | What it actually changes | CDA gate |
| ---: | :--- | :--- | :--- |
| **#578** | 2026-09-25 00:24 (**after** CDA-022) | `worldFeatures.ts` +2390 (52 → **132** `WF-*`) under a “docs” title | **023**; violates 018 / 020 / 021 |
| **#503** | 2026-09-24 00:08 | `worldFeatures.ts` +1914 (52 → **116** `WF-*`) | **021** |
| #454 | 2026-09-23 | Wave-6 `worldFeatures.ts` +1436 | 020 |
| #399 | 2026-09-22 | Wave-5 `worldFeatures.ts` | 018 |
| #344 | 2026-09-21 | Wave-4 `worldFeatures.ts` | 018 |
| **#558** | 2026-09-25 00:10 (**after** CDA-022) | Wave 8 elite sheets (docs only, +743) | **023** — docs OK; not `EnemyFamily` |
| **#590** | 2026-09-25 00:28 (**after** CDA-022) | Wave-8 SDE (docs only) | **023** — docs OK; not `starterSpells` |
| **#575** | 2026-09-25 00:22 (**after** CDA-022) | Formations drop 8 (docs only, +1247) | **023** — docs OK; not spawn `formationId` |
| **#563** | 2026-09-25 00:13 | Wave 8 tactical spell proposals (docs) | 012 / 015 / 017 / **023** — do not append to `starterSpells` |
| **#572** | 2026-09-25 00:22 | Wave 9 boss sheets + Rush **Table G** (docs) | 019 / **023** |
| **#574** | 2026-09-25 00:22 | Face/Mute/Span/Brand ENC catalog (docs) | 019 / 014 / **023** |
| #535 | 2026-09-24 | Wave 7 elite sheets (docs) | 022 |
| #533 | 2026-09-24 | Wave-7 SDE (docs) | 022 |
| #537 | 2026-09-24 | Formations drop 7 (docs) | 022 |
| #518 | 2026-09-24 | Wave 8 boss sheets + Rush **Table F** (docs) | 019 |
| #519 | 2026-09-24 | Gale/Twin/Pincer ENC catalog (docs) | 019 / 014 |
| #506 | 2026-09-24 | Enemy AI evolution increment (docs) | Do not add `EnemyFamily` / live AI ids |
| #474 | 2026-09-23 | Wave 7 boss sheets + Rush **Table E** (docs) | 019 |
| #479 | 2026-09-23 | Ley/Fan/Pit/Font ENC catalog (docs) | 019 / 014 |
| #452 | 2026-09-23 | Wave 6 elite sheets (docs) | 013 / 003 |
| #525 | 2026-09-24 | Wave 7 tactical spell proposals (docs) | 012 / 015 / 017 |

---

## 6. What to build (only if it creates a new player decision)

Do **not** add families, ENC rooms, Wave-2–8 spells, `WF-*` rows, or named formation ids in spawn until the seven live families survive battle start and select kit/AI. Those catalogs already exist as PROPOSED.

| Gap | New player decision | Prefer existing id |
| :--- | :--- | :--- |
| Family persist + chassis + one unique verb | “This is a golem — walk around / shred RES / don’t poison-expect” | CDA-001 |
| Numeric kit band **with** drain≠healer | “This late queen has Inferno — break LoS / save Mirror” **and** is not a Blood-Mend medic | CDA-002 **and** 006 same drop |
| Elite as AI/kit floor | “The banner one never kites — I must burst or leave” | CDA-003; `WF-ELT-*` |
| Named formation | “Tank in front, frost behind — peel the bishop first” | CDA-004 |
| Clone collapse | Each remaining id has one answer | CDA-005 |
| Summoner by zone + family pet | “Kill the cantor or the board fills” | CDA-007 |
| `combinedMechanic` as code | “I must kill Archbishop first or the Pawn comes back” | CDA-008 |
| Challenge kinds, not tighter numbers | “Hold the tile / observe the frost / kill the summoner first” | CDA-009 |
| Achievement = learn, not hoard | “I unlocked by seeing Void reflect, not by hitting level 10” | CDA-010 |
| Distinct / real modifiers | “Fog: I cannot snipe; Frozen: ice tiles, not another slime” | CDA-011 |
| One spell catalog | Discovery can exist; kits stop pointing at ghost ids | CDA-012 |
| Freeze new stickers | Prevents another Register row from being mistaken for content | CDA-013 |
| Encounter objects (hold / escort / wave) | “The shrine dies if I chase the rat” | CDA-014; one existing `WF-*` |
| Unused POSITIONING verbs | “If I stand here they slam me into lava” | CDA-015; `applyPushback` |
| Register row honesty | “Ember = melee burn, not burning tiles it walked” | CDA-016 |
| First non-reflect REACTION | “I held the cast because a counter would fire” | CDA-017 |
| Freeze `WF-*` TypeScript | none until one object is live | CDA-018 / 020 / 021 / **023** |
| Freeze ENC / Rush *code* | none until room-0 resurge exists | CDA-019 |
| Freeze Wave-7 elite / SDE / formation TypeScript | none until 001 / 002+006 / 004 bind | CDA-022 |
| Freeze Wave-8/9 elite / SDE / formation / Rush / ENC / WF TypeScript | none until 001 / 002+006 / 004 / 008 / 014 bind | **CDA-023** |

---

## 7. What this run will not recommend

- New HP%, damage%, or palette families.
- Shipping Crimson Spawn / Shadow Lurker / Storm Caller as live `EnemyFamily`.
- A third Doka-hoard achievement, a 12-turn challenge, or a fifth reflect.
- Retuning `pickEnemyLevelFromTiers` percents, RAF, mapGen solvability, or combatMath formulas.
- Treating `longHorizonSim.ts` as player telemetry (still an observation harness).
- Authoring Wave-9 elite / SDE / formation catalogs. Unused Wave-1–8 sheets already oversupply names. Wave-9 Rush Table G already exists as **#572** (docs).
- Landing **#578** (or #503 / #454 / #399 / #344) as “just docs” while they append unread `WF-*` rows.
- Landing **#558 / #590 / #575 / #563 / #572 / #574** as `EnemyFamily` members, `starterSpells` rows, spawn `formationId`, extra `BOSS_RUSH_ROOMS`, or `generateEnemies` encounter branches.
