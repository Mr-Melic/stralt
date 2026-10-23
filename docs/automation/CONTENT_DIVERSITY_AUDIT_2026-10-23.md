# Content Diversity & Repetition Audit — 2026-10-23

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (2026-09-03). Unchanged vs every CDA run since 2026-09-21.  
**Prior auditor HEAD:** `0f5363f` (2026-10-22, PR #881). One calendar day later, live catalogs are identical.

ACTION_IDs: [`ACTION_IDS_CONTENT_DIVERSITY_2026-10-23.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-10-23.md).  
Reaffirms `CDA-2026-09-02-001` … `015` (OPEN / PARTIAL) and unpublished `016` … `028`. Mints **`CDA-2026-10-23-029`**.

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD / open PRs |
| :--- | :--- |
| Enemy family sheets Wave 1–14 | `ENEMY_ELITE_EVOLUTION_*` through **#899** — PROPOSED |
| Named formations drop 1–14 | `docs/design/ENEMY_FORMATIONS_*` through **#897** — PROPOSED, unwired |
| ENC-* rooms through Heave/Dual/Mid | **#885** and earlier ENC PRs — PROPOSED |
| Spell verbs (push, attract, root, trap, delayed execute, Wave 4–14 proposals) | `SPELL_PROPOSALS_*` / **#890** — PROPOSED |
| World features (`WF-*`) | `engine/worldFeatures.ts` — **52** ids on `main`, unit-tested, **not imported by WX**. Open TypeScript dumps: #344 / #399 / #454 / #503 (52→116) / #578 (52→132) / #613 (52→148) / #680 (52→164) / #719 (52→180) / #786 (52→196) / #848 (52→212) / **#902 (52→228)** |
| Owner encounter pack | WDEAD ids still NEW (`#908` is another design pass) |
| Boss Rush Tables C–M | docs only; live `BOSS_RUSH_ROOMS.length` still **10**. Table M is **#903** |

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a fifth reflect, extra `WF-*` TypeScript, Wave-14/15 `EnemyFamily` members, extra `BOSS_RUSH_ROOMS`, a 33rd innate spell, or Wave-16 catalogs.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is still:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

When the Motoko six-id catalog is live, pack kit lookup against that pool often resolves **empty** (WX 2688–2700, 11920–11923) — bishops never cast advertised Frost. That is CDA-012, not a new family.

---

## 0. Prior-run checks (2026-10-22 → this HEAD)

| # | Question | 2026-10-23 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay is stats + pixel art. Chassis stays random. | `spawnPolicy.ts` 279–286; WX `tryPlaceEnemy` 5761–5860 still random piece |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` WX 3607–3612, 11970–11997. RES/SP: `computeEnemyStats` 11873, 11898–11902 |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | WX 2396–2400. `SPELL_ID_CATALOG` still 32 (`bossKits.ts` 29–62) |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** 11 hits, all in `useBossRush.ts`. | Grep count 11 |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312; 49–67 vs 394–415 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | WX 11920 `buildEnemyKit(..., currentMap.levelZone)`; `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at level 44. | `gameConstants.ts` 298–299; WX 11932–11939 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127 vs `bossTypes.ts` 390–410 (19 ids) |
| 9 | Is REACTION still only percent-reflect clones? | **Yes.** Four live reflects. | Mirror (`spellEngine.ts` 917–926); void 25% (`castHelpers.ts` 335–345); Mirror Field 20% (`spellEngine.ts` 901–907); boss shield 30% (`castHelpers.ts` 363–375) |
| 10 | Did `worldFeatures.ts` grow past 52 unused rows on `main`? | **No on `main`.** Open PRs still dump 116 / 132 / 148 / 164 / 180 / 196 / 212 / **228**. | Live file 52 `id: "WF-"`; #902 branch 228 |
| 11 | Did CDA-002 land without CDA-006 (queens as healers)? | **Neither landed.** | Kit band still NaN; `inferArchetype` still `healAmount > 0` (`enemyAI.ts` 447–452) |
| 12 | Did PR #359 / #403 / #465 / #521 / #557 / #614 / #662 / #720 / #773 / #824 / #881 merge? | **No.** All still open (several draft). | GitHub search `content diversity audit` — 11 open + closed #263 |
| 13 | Did `BOSS_RUSH_ROOMS.length` grow past 10? | **No.** | `useBossRush.ts` 24–134 |
| 14 | Did Wave-6–16 names enter `EnemyFamily`? | **No.** | `gameTypes.ts` 12–20 still seven + `default` |
| 15 | Did #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 merge? | **No.** | All open; each independently mutates `worldFeatures.ts` from the 52-id baseline |
| 16 | Did Wave-13–15 elite / SDE / formation / Rush land TypeScript catalogs? | **Docs only**, except the WF dumps. | PR file lists: #885/#890/#897/#899/#903/#906 are docs; #902 is TypeScript |
| 17 | Did CDA-028 stop Wave-15 catalogs and Wave-14 WF TypeScript? | **No.** Same-hour after #881: #885 (34s), #890, #897, #899, **#902 WF 52→228**, **#903 Rush Table M**, #906. | Created-at vs #881 00:13:31Z |
| 18 | Did combat execute-parity PRs (#870–#927) grow live catalogs? | **No.** They share advertised kit flags / persist / map crumbs. They do not bind family × AI × kit. | #911 adds `packEnemyKitAssign.ts` (empty-kit honesty vs Motoko six-id catalog); does not add `EnemyFamily` / `WF-*` / Rush rooms |

What **did** change since 10-22: nothing on `main`. The unread proposed pile grew **the same hour** CDA-028 published, including the Wave-15 Rush table it forbade and a 52→228 `WF-*` TypeScript dump. Combat execute-parity PRs later on 10-22 make advertised pack/boss/summon kit flags fire when catalogs miss; they are not combinatorial depth.

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` 35, 69–129, 279–286): after a fully random chess piece is placed, each body has an independent **30%** chance to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog also lists `mp` / `ap` — **never assigned** (`spawnPolicy.ts` 14–15, 64–66).

| Family | hpMult | dmgMult | res (overlay) | Live combat verb |
| :--- | ---: | ---: | ---: | :--- |
| `iron_golem` | 2.5 | 0.7 | 0.75 | pixel only |
| `plague_rat` | 0.4 | 0.6 | 0.05 | pixel only |
| `wraith_bishop` | 0.6 | 1.4 | 0.1 | pixel only |
| `bone_scribe` | 0.7 | 0.5 | 0.1 | pixel only |
| `tide_shade` | 0.8 | 0.9 | 0.15 | melee MP −1 × 2 (WX 16805–16821) |
| `ember_knight` | 1.1 | 1.0 | 0.3 | melee burn 3/turn × 3 (WX 16789–16804) |
| `void_mirror` | 1.0 | 0.8 | 0.2 | 25% pre-crit reflect (`castHelpers.ts` 335–345) |

Battle start then:

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (WX 11873, 11898–11902) — piece-type integer rolls (`progression.ts`), **not** a 0–1 fraction.
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (WX 3607–3612, 11970–11997): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

Family RES values `0.05–0.75` are the **wrong unit** even if the wipe were removed. Binding family stats must use the integer `getEnemyBaseStats` scale.

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike. Kit and `inferArchetype` follow the random chassis.

Register chrome is honest (`enemyRegisterCopy.ts` 8–15: `FLAVOR LORE`). Per-row copy (`EnemyRegister.tsx` 28–88) still teaches wall-phase, poison-on-hit, burning tiles, adjacent slow + regen, Weaken-from-range, magic immunity, plus Crimson / Lurker / Storm — none of that is wired. CDA-013 PARTIAL; CDA-016 still NEW.

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion` (repo-wide grep empty). Leader = highest `level` in the pack (WX 12010–12015). `computeAITier` (`combatMath.ts` 36–51) is a level bucket, then **30%** uniform 1–10 noise — not a variant floor.

`WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` (`worldFeatures.ts` 452, 1011, 1489) are designed + tested and **not imported by WX**. Wave 4–14 elite sheets (#349 … #899) are unread docs.

Elite as an HP% would repeat the family-sticker failure. CDA-003 still wants AI/kit floors (1 / 3 / 6 / 8), not `hpMult`.

### 1.3 AI profiles

`EnemyArchetype` union (`enemyAI.ts` 86–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–477) never returns `summoner` (no `return "summoner"`). Order: any `healAmount > 0` → healer (so `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` are healers); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except an empty string. No family has `aiStrategy: "berserk"`. Knight is Strike-only (`enemyAI.ts` 168) but still inferred flanker.

Summoner **behavior** exists. WX 16375 calls `decideSummonerAction` when `enemy.isSummoner`. That flag is a **random overlay**, not a family. Pets are 50/50 wolf or archer (WX 11935–11941). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

**CDA-002 without CDA-006** is still the coupling: a numeric band-1 queen kit is `[nuke, starter-heal]` and every late queen becomes a medic.

Wave 4–14 AI increments (#351 … #874) are unread docs. They do not bind `aiStrategy`. Hostile-summon kit execute (#842) and pack-kit assign (#911) make existing pet/pack spells fire when catalogs miss; they do not family-gate summoners.

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

`buildEnemyKit` floors `levelZone`. Call site passes `currentMap.levelZone` **object** (`{ name, minLevel, maxLevel }`). `Math.floor(object)` is `NaN` → every `z >= 1` is false → **band 0 forever**. `longHorizonSim.ts` 50–57 documents the same NaN.

Knight never grows. Queen/king “late Inferno” never arrives.

Frontend catalog: 32 ids in `SPELL_ID_CATALOG` (`bossKits.ts` 29–62). All `starterSpells` forced innate (WX 2396–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`) with targeting flags the frontend rows lack. Backend boss seeds (`admin.mo` 349+) still name `fireball` / `cursed_gust` / `entangle` / `mist_form`.

When `filteredBackendSpells.length > 0`, `spellPool` is **backend-only** (WX 2688–2694). Battle start then `normalizedSpellPool.find(s => s.id === kitId)` (11920–11923). Motoko ids contain none of the kit ids, so pack bishops/queens/kings receive `spells: []` and walk / adjacent Crush only. #911 documents that hole; it must not grow `starterSpells`.

**Clone pairs (still identical verbs):**

| Pair | Shared contract | Difference |
| :--- | :--- | :--- |
| Shield ≡ Iron Skin | +30% RES / 3 turns / range 3 | AP 2 vs 3 |
| Poison ≡ Venom | 4×3 DoT | range 4 vs 2; AP 2 vs 3 |
| Expose ≈ Shadow Veil | damage + `debuffStat: "res_sp"` | naming |
| Blood Mend ≈ Rallying Cry | self heal + +15% CHC / 2 | heal 12 vs 20; AP 3 vs 4 |

Engine verbs with **no live spell caller:** `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537 — tests only).

Wave 4–14 SPELL_PROPOSALS / SDE PRs must not append into `starterSpells` (CDA-012). That would make discovery worse.

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (`SPAWN_MIN_CHEBYSHEV`; WX 5744–5860). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (WX 11869–11891). Named formation catalogs through drop 14 (**#897**) and `worldFeatures.ts` encounter slots are unwired. No spawn `formationId`.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). `BossAbility` enums are unique per later boss — that axis is actually diverse. Kits are not: they remix Shadow Veil, Cursed Wound, Frost Nova, Swap, Iron Skin, Lifesteal Nova, Blast.

Phase 2 is “add a catalog spell” (`bossKits.ts` 90–92). Signature twists stay in `BossAbility` / `useBossAI`, not in the kit.

Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–134). `combinedMechanic` is flavor text (11 hits). Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`. Admin copy already admits the mismatch (`AdminDashboard.tsx` 7144).

Unread Rush Tables C–M (#367 … **#903**) must not append live rooms (CDA-008 / 019 / 027 / 028 / **029**). Table M is the Wave-15 sheet CDA-028 forbade.

### 1.7 Encounters / dungeon rooms

`generateEnemies`: pack size `1+rand*8` plus dungeon extras `[0,2,3,4,4,5][min(depth,5)]` and tier boost `[0,1,2,2,3,3]` (`spawnPolicy.ts` 27–28). Same quadrant scatter. No encounter id, no wave, no objective, no formation id.

Live dungeon “rooms” are **more bodies + higher tier**, not ENC-* structures.

Proposed ENC-* through Both/Stride/Near (**#826**) and Heave/Dual/Mid (**#885**) remain PROPOSED.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 11–20, 44–109):

| Kind | Ids | Distinct player decision? |
| :--- | :--- | :--- |
| Turn-count | `under_15_turns` / `under_10_turns` / `under_5_turns` | Same verb, tighter number |
| Damage cap | `under_50_damage` / `no_healing_under_30_damage` / `no_damage_taken` | Same verb, tighter number |
| Unique | `no_healing`, `under_8_ap_per_turn`, `direct_hit` | Yes |

Honesty patches make the nine predicates truthful. They do not add a tenth *kind*. Do not add `under_12_turns`.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). All rewards Doka. Twins: `doka_1000` + `doka_10000`; `betrayal_witness` + `double_betrayal`. `unstoppable` / `level_10` fires at WX 3632 on a game with no level cap. No observe / formation-peel / discovery key. Do not add a 100k Doka twin.

### 1.10 Environmental mechanics / modifiers

22 `MAP_MODIFIERS` (`mapModifiers.ts` 152+).

- `slime_flood` ≡ `frozen_terrain` (`onMpCost: ×2`, 154–172).
- Registry hooks for `blood_moon` / `mirror_field` / `gravity_well` / `fog_of_war` are empty (260–296) **but** Blood Moon ×1.25 and Mirror Field 20% ST reflect are **live** in `spellEngine.ts` 895–907.
- Numeric reskins: `titans_vigor`, `glass_realm`, `doka_fever`.
- Distinct live terrain: thorned extra-path damage, void-rift tick + displacement, plague tick, arcane AP−1, time-warp 15s, paper-windstorm range/miss.

`worldFeatures.ts` 52 `WF-*` rows on `main` are unit-tested and unused. WX does not import the module (only `worldFeatures.test.ts` imports it).

---

## 2. Mechanic category census

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike / Frost / Inferno / Blast / Blood Moon ×1.25 / Fury ×1.25 / Glass / Titan roll / most boss kits |
| STATUS | **Over** | Poison≡Venom, Expose≈Veil shred, ember burn, plague tick, Weaken |
| REACTION | **Over as clones** | Four percent-reflects + backend `reflect_barrier` ghost. Not four verbs |
| SUPPORT | **Clone / mis-inferred** | Blood Mend ≈ Rallying Cry; any `healAmount` → healer AI |
| SUMMONING | **Shallow** | Random wolf/archer overlay; saturates at player 44; not family-gated. #842 executes existing kits |
| DEFENSE | **Clone** | Shield ≡ Iron Skin; boss Shell Armor is the only unique absorb |
| TERRAIN | **Mixed** | Slime≡Frozen; Blood Moon/Mirror Field live despite empty registry; gravity/fog empty; lava/spikes exist |
| RESOURCE_MANIPULATION | **Thin** | Tide melee MP−1; Arcane Surge AP−1; AP-per-turn challenge |
| MOBILITY | **Thin** | Haste +2 MP; knight inferred flanker with Strike-only kit |
| POSITIONING | **Under** | Swap only. `applyPushback` / `applyAttract` unused |
| CONTROL | **Thin** | Frost / Slow; no root, no delayed execute |
| OBJECTIVE_PLAY | **Absent** | Kill-all only. ENC-* / shrine / toll / wave unread |
| SPELL_DISCOVERY | **Absent** | 32 ids forced innate; backend six-id parallel universe; pack kits can be empty Crush-only |
| TEAM_SYNERGY | **Absent** | No formation, no family AI, unread `combinedMechanic` |

**Overrepresented:** DAMAGE (including Blood Moon ×1.25), STATUS shred, MP-slow clones, heal+CHC clones, drain-as-healer, the reflect cluster, summon-as-add-a-unit, numeric challenge clones, unread `WF-*` TypeScript names (open dumps 52→116/132/148/164/180/196/212/**228**), unread Wave-4–15 elite / SDE / formation / Rush / ENC docs.

**Underrepresented:** SPELL_DISCOVERY, OBJECTIVE_PLAY, TEAM_SYNERGY, named POSITIONING, non-reflect REACTION, family-bound AI.

---

## 3. Redundancy (differs mainly by HP / damage / naming)

### Redundant enemies

- Seven live families are a 30% tint. Four have **no combat verb**. All lose overlay HP/RES/SP at battle start.
- Register extras (Crimson / Lurker / Storm) are not `EnemyFamily`.
- Wave 4–14 elite sheets propose dozens of names that would be the same Strike pawn if appended to the union today.
- Knight kit never leaves Strike; “flanker” is a piece-name label.

### Redundant spells

- Four clone pairs (Shield/Iron Skin, Poison/Venom, Expose/Veil, Mend/Cry).
- Boss kits remix Veil / Wound / Nova / Swap / Iron Skin / Blast / Lifesteal.
- Backend `defaultSpells` + ghost boss seeds are a parallel catalog, not a discovery layer. On a populated backend they also **blank pack kits**.
- Wave 4–14 proposed ids are unread. Shipping them onto `starterSpells` is anti-discovery.

### Repeated encounter structures

- Every dungeon room: more bodies + higher tier + same quadrant scatter + kill-all.
- ENC catalogs through #885 are names on the same structure.
- `WF-*` growth 52 → 116 → 132 → 148 → 164 → 180 → 196 → 212 → **228** across sibling PRs, none imported.

### Repeated boss mechanics

- Phase 2 = add a catalog spell.
- Rush `combinedMechanic` unread; room 9 ghost id.
- Tables C–M are more dual-boss flavor pairs. Live length stays 10.

---

## 4. Proposed-content flock (active vs proposed)

The combinatorial product is **not bound**. Proposed content has been growing a parallel unread library since 2026-09-21 while `main` stayed on `0f5363f`.

Same-day overflow after each CDA freeze (the pattern CDA-022…028 already named):

| Freeze | Same-day / raced overflow |
| :--- | :--- |
| CDA-026 #773 00:11:23Z | #771 ENC (raced 41s); **#786 WF 52→196**; #787/#794/#796/#802/#808/#804 |
| CDA-027 #824 00:13:58Z | **#825 drop 13 (3s)**; #826 ENC; **#836 Rush Table L**; #837 SDE; #840 elite; **#848 WF 52→212**; #849 spells |
| CDA-028 #881 00:13:31Z | **#885 ENC (34s)**; #890 spells; #897 drop 14; #899 elite; **#902 WF 52→228**; **#903 Rush Table M**; #906 SDE |

CDA-028 did not stop Wave-15. The 22-day stall (2026-09-30 … 2026-10-20) was not a bind. Combat execute-parity later on 10-22 (#870–#927) is honesty for advertised flags, not family × AI × kit × formation.

**CDA-029** names the Wave-14/15 hour and forbids Wave-16 catalogs until 001 / 002+006 / 004 / 008 / 014.

---

## 5. Recommendations (only where a tactical gap exists)

Do **not** add new families, elites, spells, rooms, or modifiers from this audit. The gaps are already ticketed:

| Gap | Existing ID | New player decision once shipped |
| :--- | :--- | :--- |
| Family is a sticker | CDA-001 | “This body is a golem / rat / mirror — I change target order, damage type, and positioning.” |
| Relative level never changes tools | CDA-002 **with** 006 | “This map’s bishops have Poison; late queens have Inferno — I bring LoS break / Mirror / focus I did not need on band 0.” And drain is not a medic. |
| Elite is missing (or would be HP%) | CDA-003 | “The banner elite will not retreat and has one extra verb — intercept, pay the toll, or leave.” |
| Packs are quadrant scatter | CDA-004 | “The frost bishop is behind the golem — I peel, Swap in, or eat the slow.” |
| Clone spells | CDA-005 | Shield vs Iron Skin answers RES% vs absorb expiry; Poison vs Venom answers range vs melee-tax. |
| Summoner saturates at 44 | CDA-007 | “This bone_scribe pack will add a wolf unless I kill the summoner this cadence.” |
| Rush flavor / ghost id | CDA-008 | “I must kill Archbishop first or the Pawn returns at 50%.” |
| Challenge number-twins | CDA-009 | “I cannot chase the rat because the shrine dies.” |
| Grind feats / `level_10` | CDA-010 | “I go looking for a Void Mirror to learn reflect.” |
| Slime≡Frozen; empty fog/gravity | CDA-011 | “Fog: I cannot snipe; Frozen: standing still is safer than sliding into lava.” |
| Dual catalogs / all-innate / empty pack kits | CDA-012 | “I do not own Void Collapse yet — this bishop’s frost is information.” |
| Dungeon extra-bodies | CDA-014 | “The shrine dies if I tunnel the rat” / “I pay HP, take the long path, or fight the keeper.” |
| Unused push/attract | CDA-015 | “If I stand on this file they slam me into lava.” |
| Register row lies | CDA-016 | “Ember = melee burn, so I save a cleanse for the strike, not for tiles it walked.” |
| Reflect cluster | CDA-017 | “I held the cast / stepped off the file because a counter would fire.” |
| Unread WF / ENC / Rush / wave catalogs | CDA-018 … 028 + **029** | None until one object is live — these ids prevent a fake decision (“new name, same Strike pawn”). |

No new HP/damage family, no 33rd innate, no fifth reflect, no Wave-16 sheet.

---

## 6. This run

`docs/automation/ACTION_IDS_CONTENT_DIVERSITY_2026-10-23.md` — reaffirm 001–015 OPEN/PARTIAL; keep 016–028 NEW; mint **CDA-2026-10-23-029** (freeze Wave-14/15 elite / SDE / formation drop 14 / Rush Table M / ENC / Wave-14 WF TypeScript (`#902` 52→228) and do not author Wave-16 until 001 / 002+006 / 004 / 008 / 014).

Do not implement combat from this file.
