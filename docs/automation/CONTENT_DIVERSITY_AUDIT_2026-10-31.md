# Content Diversity & Repetition Audit — 2026-10-31

**Source automation:** Content Diversity & Repetition Auditor (`5acab6fe-a49e-11f1-a7d1-d6b4613131ce`)  
**Constraint:** analysis and docs only. No production code, RAF, map generation, turn logic, or damage math.  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (2026-09-03). Unchanged vs every CDA run since 2026-09-21.  
**Prior auditor HEAD:** `0f5363f` (2026-10-29, PR #1295). Two calendar days later, live catalogs are identical.

ACTION_IDs: [`ACTION_IDS_CONTENT_DIVERSITY_2026-10-31.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-10-31.md).  
Reaffirms `CDA-2026-09-02-001` … `015` (OPEN / PARTIAL) and unpublished `016` … `035`. Mints **`CDA-2026-10-31-036`**.

Sibling design that already exists — **do not re-propose as new families / rooms / spells**:

| Catalog | Status on this HEAD / open PRs |
| :--- | :--- |
| Enemy family sheets Wave 1–21 | `ENEMY_ELITE_EVOLUTION_*` through **#1305** (32 Wave-21 sheets: `octave_mender` … `fresh_plater`) — PROPOSED |
| Named formations drop 1–21 | `docs/design/ENEMY_FORMATIONS_*` through **#1294** — PROPOSED, unwired |
| ENC-* rooms through Sestet/Tern/Mire/Stock | **#1303** and earlier ENC PRs — PROPOSED |
| Spell verbs (push, attract, root, trap, delayed execute, Wave 4–21 proposals) | `SPELL_PROPOSALS_*` / **#1309** / SDE **#1313** — PROPOSED |
| World features (`WF-*`) | `engine/worldFeatures.ts` — **52** ids on `main`, unit-tested, **not imported by WX**. Open TypeScript dumps: #344 / #399 / #454 / #503 (52→116) / #578 (52→132) / #613 (52→148) / #680 (52→164) / #719 (52→180) / #786 (52→196) / #848 (52→212) / #902 (52→228) / #949 (52→244) / #993 (52→260) / #1064 (52→276) / #1114 (52→292) / #1172 (52→308) / #1235 (52→324) / **#1285 (52→340)**. **No Wave-22 WF TypeScript.** |
| Leftover-crumb occupancy named after unread `WF-*` tiles | **#1071** Orbiting Cinder … **#1283** Windrow, plus **#1318** Skipping Cinder, **#1319** Plumb Ember, **#1327** Rim Cinder, **#1351** Shy Cinder — production occupancy modules, **not** a WX `worldFeatures` import |
| Owner encounter pack | WDEAD ids still NEW |
| Boss Rush Tables C–T | docs only; live `BOSS_RUSH_ROOMS.length` still **10**. Table T is **#1302** (Wave-22 sheet CDA-035 forbade) |

**Do not recommend** HP/damage reskins, Register-only families (Crimson Spawn / Shadow Lurker / Storm Caller), a fifth reflect, extra `WF-*` TypeScript, Wave-21/22 `EnemyFamily` members, extra `BOSS_RUSH_ROOMS`, a 33rd innate spell, leftover occupancy as a shrine bind, Glass Realm ×2 / Titan roll / Doka Fever +25% as new verbs, Quota-* `WF-*` rows, Wave-22 WF TypeScript, or Wave-23 catalogs.

Indefinite progression is supposed to be:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn is still:

`random chess piece × pickEnemyLevelFromTiers × 30% family sticker × inferred AI × kit band NaN=0 × quadrant scatter × extra dungeon bodies × 22-modifier two-roll`

When the Motoko six-id catalog is live, pack kit lookup against that pool often resolves **empty** (WX 2688–2700, 11920–11923) — bishops never cast advertised Frost. That is CDA-012, not a new family. #911 (still open) documents the hole; it does not grow catalogs.

---

## 0. Prior-run checks (2026-10-29 → this HEAD)

| # | Question | 2026-10-31 | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Does family still fail to select kit / AI / passive? | **Yes.** Overlay is stats + pixel art. Chassis stays random. | `spawnPolicy.ts` 279–286; WX `tryPlaceEnemy` still random piece then 30% sticker (5761–5866) |
| 2 | Is family HP **and** RES/SP still wiped at battle start? | **Yes.** | HP: `calcEnemyMaxHp` WX 3607–3612, 11970–11997. RES/SP: `computeEnemyStats` 11873, 11898–11902 |
| 3 | Are `starterSpells` still all forced `isBaseSpell`? | **Yes.** | WX 2398–2400. `SPELL_ID_CATALOG` still 32 (`bossKits.ts` 29–62) |
| 4 | Does any code **read** `combinedMechanic` besides the room table? | **No.** 11 hits, all in `useBossRush.ts`. | Grep: type + 10 string literals |
| 5 | Did Shield/Iron Skin or Poison/Venom diverge? | **No.** | `spellData.ts` 30–47 vs 293–312; 49–67 vs 394–415 |
| 6 | Is kit band still NaN (`levelZone` object)? | **Yes.** | WX 11920 `buildEnemyKit(..., currentMap.levelZone)`; `levelZone` is `{ name, minLevel, maxLevel }` (WX 592); `enemyAI.ts` 199 `Math.floor(levelZone)` |
| 7 | Is summoner chance still linear in raw player level? | **Yes.** Saturates at level 44. | `gameConstants.ts` 298–299; WX 11932–11939 |
| 8 | Is `weeping_pawn_2` still not in `BOSS_IDS`? | **Yes.** | `useBossRush.ts` 127 vs `bossTypes.ts` 390–410 (19 ids) |
| 9 | Is REACTION still only percent-reflect clones? | **Yes.** Four live reflects. | Mirror (`spellEngine.ts` 917–926); void 25% (`castHelpers.ts` 335–345); Mirror Field 20% (`spellEngine.ts` 901–907); boss shield 30% (`castHelpers.ts` 363–375) |
| 10 | Did `worldFeatures.ts` grow past 52 unused rows on `main`? | **No on `main`.** Open PRs still dump 116 … **340**. | Live file 52 `id: "WF-"` (1913 lines); **#1285 branch 340** (10517 lines). No Wave-22 dump. |
| 11 | Did CDA-002 land without CDA-006 (queens as healers)? | **Neither landed.** Leftover healer PRs make the coupling worse if 002 ships first. | Kit band still NaN; `inferArchetype` still `healAmount > 0` (`enemyAI.ts` 447–452); no `return "summoner"` |
| 12 | Did PR #359 / #403 / #465 / #521 / #557 / #614 / #662 / #720 / #773 / #824 / #881 / #942 / #982 / #1069 / #1120 / #1167 / #1222 / #1295 merge? | **No.** All still open. | `gh` CDA search; `origin/main` still `0f5363f` |
| 13 | Did `BOSS_RUSH_ROOMS.length` grow past 10? | **No.** | `useBossRush.ts` 24–134 |
| 14 | Did Wave-6–23 names enter `EnemyFamily`? | **No.** | `gameTypes.ts` 12–20 still seven + `default` |
| 15 | Did #503 / #578 / #613 / #680 / #719 / #786 / #848 / #902 / #949 / #993 / #1064 / #1114 / #1172 / #1235 / #1285 merge? | **No.** | All open; each independently mutates `worldFeatures.ts` from the 52-id baseline |
| 16 | Did Wave-21–22 elite / SDE / formation / Rush land TypeScript catalogs? | **Docs only**, except leftover occupancy. | PR file lists: #1305/#1294/#1302/#1313/#1309/#1303 are docs; #1285 remains the last WF TypeScript dump; #1318/#1319/#1327/#1351 add occupancy modules |
| 17 | Did CDA-035 stop Wave-22 catalogs and Wave-22 WF TypeScript? | **Partial.** WF TypeScript **did not** grow past 340. Same-hour after #1295: **#1302 Rush Table T (3m30s after)**, **#1305 elite (32 sheets)**, **#1313 SDE**, leftover Skipping Cinder **#1318**. | Created-at vs #1295 00:18:16Z; `git grep` on `tmp-1285` still 340 `WF-*` |
| 18 | Did combat leftover / execute-parity PRs (#870–#1353) grow live catalogs? | **No.** They share advertised kit flags / persist / map crumbs / healer Frost leftovers / advertised-modifier honesty / advertised Phase-2 HP. They do not bind family × AI × kit. | #911 (still open); #1339 Swap/Iron Skin; #1348 Rush grants persist; Phase-2 HP #1329–#1353 do not touch `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` |
| 19 | Did any CDA-001 / 002+006 / 004 / 008 / 014 bind land? | **No.** | Same HEAD `0f5363f`; family overlay still wiped; kit still NaN; formations still scatter; `combinedMechanic` unread; dungeon still extra bodies |
| 20 | Did leftover occupancy become a WX world-feature channel? | **No.** Modules exist only on open PRs; WX still does not import `worldFeatures.ts`. | Occupancy `*Unseal.ts` absent on HEAD; WX import grep empty |
| 21 | Did Glass Realm / Iron Curse / Vampiric Ground / Titan / Doka Fever / Phase-2 HP honesty fill CDA-011? | **No.** Slime ≡ Frozen; gravity/fog still empty registry hooks. Honesty makes numeric DAMAGE reskins truthful. | `mapModifiers.ts` 154–172, 260–296; open PRs #1148/#1155/#1160/#1200/#1203/#1207/#1208/#1252 plus Phase-2 HP commits |

What **did** change since 10-29: nothing on `main`. The unread proposed pile grew **the same hour** CDA-035 published, including the Wave-22 Rush table it forbade. WF TypeScript **did not** increment (CDA-035’s only hold). Leftover-crumb occupancy grew by Skipping Cinder / Plumb Ember / Rim Cinder / Shy Cinder. Combat leftover PRs later on 10-29/10-30 make advertised Phase-2 HP and kit Swap/Iron Skin fire; they are honesty, not combinatorial depth. No Wave-23 elite / SDE / formation / Rush / ENC / WF TypeScript existed at inspection. No 10-31 catalog dumps existed at inspection.

---

## 1. Live catalogs (do not treat Enemy Register as source of truth)

### 1.1 Enemy families

`EnemyFamily` (`gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`spawnPolicy.ts` 35, 69–129, 261–286; WX 5862–5866): after a fully random chess piece is placed, each body has an independent **30%** chance to receive a uniformly chosen family. Overlay writes `hp`, `maxHp`, `damage`, `res`, `sp`. Catalog also lists `mp` / `ap` — **never assigned** (`spawnPolicy.ts` 14–15, 64–66).

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

1. Re-rolls `sp`, `sr`, `init`, `res`, `chc` from `computeEnemyStats(e.level, e.pieceType, e.id)` (WX 11873, 11898–11902) — piece-type integer rolls (`progression.ts` 180–186), **not** a 0–1 fraction.
2. Overwrites combatant HP with `calcEnemyMaxHp(e.level)` (WX 3607–3612, 11970–11997): `floor(50 * (1 + (level-1)*growth))`. Family `hpMult` 0.4–2.5 is discarded.

Family RES values `0.05–0.75` are the **wrong unit** even if the wipe were removed. Binding family stats must use the integer `getEnemyBaseStats` scale, not the overlay fractions.

`wraith_bishop`, `iron_golem`, `plague_rat`, `bone_scribe` have **pixel patterns only** in combat. Register copy (`EnemyRegister.tsx` 28–70) claims wall-phase, poison-on-hit, Weaken-from-range, magic immunity — none of that is wired. Chrome is honest (`enemyRegisterCopy.ts` 9–15: `FLAVOR LORE`); per-row copy still lies.

Family does **not** force `pieceType`. A “Wraith Bishop” may be a pawn with Strike. Kit and `inferArchetype` follow the random chassis.

### 1.2 Variants / elite / champion

No `isElite`, no `isChampion`, no rarity second roll (repo-wide grep empty). Leader = highest `level` in the pack (WX 12010–12015). `computeAITier` is a level bucket, then **30%** uniform 1–10 noise — not a variant floor.

`worldFeatures.ts` `WF-ELT-BANNER_PATROL` / `WF-ELT-TOLL_KEEPER` / `WF-ELT-CART_GUARD` are designed + tested and **not imported by WX**.

Wave-21 elite sheets (`octave_mender` … `fresh_plater`, #1305) remain PROPOSED. Shipping them as `EnemyFamily` members would be another sticker flock.

### 1.3 AI profiles

`EnemyArchetype` union (`enemyAI.ts` 87–93): caster, healer, charger, flanker, berserker, summoner, generic.

`inferArchetype` (`enemyAI.ts` 447–477) never returns `summoner`. Order: any `healAmount > 0` → healer (so `starter-drain`, `spell-drain-courage`, `spell-lifesteal-nova` are healers); majority ranged + LoS → caster; knight → flanker; `aiStrategy === "berserk"` or family name contains `"berserk"` → berserker; melee-only → charger; else generic.

No spawn writes `aiStrategy` except an empty string. No family has `aiStrategy: "berserk"`.

Summoner **behavior** exists. WX 16375 calls `decideSummonerAction` when `enemy.isSummoner`. That flag is a **random overlay**, not a family. Pets are 50/50 wolf or archer (WX 11935–11942). Chance `0.12 + 0.02 * playerLevel` — 100% of non-summon bodies at player level ≥ 44.

**CDA-002 without CDA-006** would make band-1 queens Blood-Mend healers.

### 1.4 Spell pools

`ENEMY_KITS` (`enemyAI.ts` 163–185) is **piece-type only**, three bands. Knight is Strike-only. Queen/king Inferno at z≥2 never arrives because the call site passes `currentMap.levelZone` **object** (WX 11920). `Math.floor(object)` is `NaN` → **band 0 forever**.

Frontend catalog: 32 ids in `SPELL_ID_CATALOG`. All `starterSpells` forced innate (WX 2398–2400). Backend `defaultSpells()` (`admin.mo` 168–191) is a **second** six-id catalog (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`).

Clone pairs unchanged: Shield ≡ Iron Skin, Poison ≡ Venom, Expose ≈ Shadow Veil, Blood Mend ≈ Rallying Cry.

Engine verbs with **no live spell caller:** `applyPushback` / `applyAttract` (`occupancy.ts` 482, 537 — tests only).

### 1.5 Formations

Live: four quadrants around (8,8) then fill, Chebyshev ≥ 4 (WX 5846–5856; `SPAWN_MIN_CHEBYSHEV` 4). Battle start re-scatters ≥ 2 from allies, ≥ 3 from player (11869–11891). Named formation catalogs and `worldFeatures.ts` encounter slots are unwired. No `formationId` in the repo.

### 1.6 Bosses

19 `BOSS_IDS` (`bossTypes.ts` 390–410). `BossAbility` enums are unique per later boss — that axis is actually diverse. Kits remix Shadow Veil, Cursed Wound, Frost Nova, Swap. Phase 2 = add a catalog spell.

Boss Rush: 10 hardcoded pairs (`useBossRush.ts` 24–135). `combinedMechanic` is flavor text. Room 9 `boss2Id: "weeping_pawn_2"` is **not** in `BOSS_IDS`.

Proposed Table T (`#1302`) is four more dual-boss flavor rooms (`shove_hosteler`+`silent_conductor`, …) on top of unread Tables C–S. Live room count is still 10.

### 1.7 Encounters / dungeon rooms

`generateEnemies` (WX 5711+): pack size `1+rand*8` plus dungeon extras `[0,2,3,4,4,5][min(depth,5)]` and tier boost `[0,1,2,2,3,3]` (`spawnPolicy.ts` 27–28, 140–148). Same quadrant scatter. No encounter id, no wave, no objective, no formation id.

Live dungeon “rooms” are **more bodies + higher tier**, not ENC-* structures.

### 1.8 Challenges

Nine `DEFAULT_CHALLENGES` (`challengeCompletion.ts` 44–109): three turn-count clones (15/10/5), three damage clones (50 / 30+no-heal / 0). Unique: `no_healing`, `under_8_ap_per_turn`, `direct_hit`. Honesty patches landed; types did not.

### 1.9 Achievements

Fifteen `defaultAchievements()` (`admin.mo` 309–326). Grind / event keys including capped `level_10` (WX 3632). Twins: Doka hoard 1k/10k; betrayal / double betrayal. Rewards are Doka only — never a spell.

### 1.10 Environmental mechanics / modifiers

Live hazards: lava / ice / spikes. 22 `MAP_MODIFIERS` (`mapModifiers.ts` 152–490).

| Problem | Ids |
| :--- | :--- |
| Identical hook | `slime_flood` ≡ `frozen_terrain` (both `onMpCost: ×2`) |
| Announce-only placeholders | `gravity_well`, `fog_of_war` |
| Live despite empty registry hooks | `blood_moon` ×1.25 (`spellEngine.ts` 895), `mirror_field` 20% ST reflect (901–907) |
| Numeric HP/damage reskins | `titans_vigor` (+1000 HP, 1–5× dmg), `glass_realm` (×2), `doka_fever` (+25% enemy HP) |
| Useful distinct verbs | `null_field`, `chaos_initiative`, `thorned_ground`, `arcane_overflow` / `arcane_surge`, `iron_curse` (heal tax), `vampiric_ground` |

`worldFeatures.ts` (52 `WF-*` rows on `main`) is unused by spawn.

---

## 2. Mechanic category census (live)

Counts are **distinct player-facing verbs**, not name variants.

| Category | Live density | Notes |
| :--- | :--- | :--- |
| DAMAGE | **Over** | Strike, Inferno, Sacrifice, chain, Expose/Veil, Cursed Wound, Frost Bolt/Nova, most boss kits, glass/titan/fever modifiers, Blood Moon ×1.25 |
| STATUS | **Over** | RES/SP shred pair; poison≡venom; ember burn; Weaken; anti-heal |
| RESOURCE_MANIPULATION | **Over** | MP −1/−2 cluster (Frost Bolt, Slow, Frost Nova, tide melee); Drain Courage AP −1; Timestep (player) |
| SUPPORT | Clone-heavy | Shield≡Iron Skin; Blood Mend≈Rallying Cry; Enrage; wisp player-only |
| DEFENSE | Clone-heavy | Shield/Iron Skin; Mirror (player); Barrier (player); void 25% reflect |
| SUMMONING | Shallow | Five player pets; enemy overlay wolf/archer only; bosses spawn via abilities |
| CONTROL | Partial | MP taxes, no true root; no delayed execute |
| TERRAIN | Partial | lava/ice/spikes + some modifiers; two placeholders; slime≡frozen |
| POSITIONING | **Under** | Swap only; formations are scatter; push/attract unwired |
| REACTION | **Under** (clone-heavy) | Four-way reflect cluster. No counter, no delayed interrupt |
| MOBILITY | **Under** | Swap; Haste +MP; random knight chassis. No dash |
| TEAM_SYNERGY | **Under** | Leader-by-level; no pack roles; `combinedMechanic` unused |
| OBJECTIVE_PLAY | **Absent** | Challenges are numeric; ENC-* unwired |
| SPELL_DISCOVERY | **Absent** | Entire frontend catalog pre-owned as base |

**Overrepresented (proposed pile, not live):** unread `WF-*` TypeScript names (open dumps 52→116 … **340**), leftover occupancy named after unread WF tiles, unread Wave-4–22 elite/SDE/formation/Rush Table C–T docs.

**Underrepresented:** SPELL_DISCOVERY, OBJECTIVE_PLAY, TEAM_SYNERGY, named POSITIONING, non-reflect REACTION, family-bound AI.

---

## 3. Redundancy (differs mainly by HP / damage / name / number)

### Redundant enemies

- Four families with no combat hook: wraith / golem / rat / scribe = palette + wiped multipliers.
- Register extras Crimson Spawn / Shadow Lurker / Storm Caller = lore rows, not `EnemyFamily`.
- Pack members of different piece types often share band-0 Strike (pawn, knight, rook).
- Dungeon depth extra bodies = more of the same random pieces.
- Wave-21 `octave_*` leftover-sum families and Wave-22 Rush Table T ids are **name + leftover-number** variants of earlier leftover-window sheets — they do not bind a live axis.

### Redundant spells

| Pair | Same verb | Cosmetic delta |
| :--- | :--- | :--- |
| Shield / Iron Skin | +30% RES / 3 turns, ally, range 3 | AP 2 vs 3 |
| Poison Arrow / Venom Strike | 4 dmg/turn × 3, no upfront | range 4 AP 2 vs range 2 AP 3; `dotType` string |
| Expose / Shadow Veil | damage + RES+SP shred / 2 turns | 15 @ ×0.8 vs 18 @ ×0.85 |
| Blood Mend / Rallying Cry | self heal + +15% CHC / 2 | 12 HP AP 3 vs 20 HP AP 4; Cry `usableByEnemy: false` |

### Repeated encounter structures

Every fight: random pieces, quadrant spread, optional 30% sticker, optional summoner overlay, optional modifier two-roll, win = kill all. Dungeon = that plus extra count. Boss Rush = two catalog bosses, flavor synergy, kill all.

### Repeated boss mechanics

Unique `BossAbility` tags are the real diversity. Kits repeatedly: shred, frost-slow, swap, iron-skin, drain-nova. Phase 2 = add a row from the same 32-id list. Dual-boss rooms do not implement the printed “kill A first or B resurges” rules. Table T repeats that lie at a new letter.

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
| modifier | Two-roll among 22, including two no-ops, one duplicate, three numeric reskins |

Relative level without the other axes is HP/damage inflation — the failure mode this audit is meant to stop.

---

## 5. What to build (only if it creates a new player decision)

Do **not** add families, ENC rooms, Wave-22 WF TypeScript, or Wave-23 spells until the seven live families survive battle start and select kit/AI. Those catalogs already exist as PROPOSED.

| Gap | New player decision | Prefer existing id |
| :--- | :--- | :--- |
| Family persist + chassis + one unique verb | “This is a golem — walk around / shred RES / don’t poison-expect” | CDA-001; family sheets already written |
| Numeric kit band **with** drain ≠ healer | “This late queen has Inferno — break LoS / save Mirror; the drain bishop will not Blood-Mend” | CDA-002 **with** 006 |
| Elite as AI/kit floor | “The banner one never kites — I must burst or leave” | CDA-003; `WF-ELT-*` |
| Named formation | “Tank in front, frost behind — peel the bishop first” | CDA-004; `ENEMY_FORMATIONS_*` |
| Clone collapse | Each remaining id has one answer (melee vs ranged DoT, etc.) | CDA-005 |
| Summoner by zone + family pet | “Kill the cantor or the board fills” | CDA-007 |
| `combinedMechanic` as code | “I must kill Archbishop first or the Pawn comes back” | CDA-008 |
| Challenge kinds, not tighter numbers | “Hold the tile / observe the frost / kill the summoner first” | CDA-009 |
| Achievement = learn, not hoard | “I unlocked by seeing Void reflect, not by hitting level 10” | CDA-010 |
| Distinct / real modifiers | “Fog: I cannot snipe; Frozen: ice tiles, not another slime” | CDA-011 |
| One spell catalog | Discovery can exist; kits stop pointing at ghost ids | CDA-012 |
| Freeze new stickers | Prevents another Register row from being mistaken for content | CDA-013 |
| Encounter objects (hold / escort / wave) | “The shrine dies if I chase the rat” | CDA-014; ENC-* / `worldFeatures` |
| Unused POSITIONING verbs | “If I stand here they slam me into lava” | CDA-015; `applyPushback` / SPELL_PROPOSALS |
| Stop Wave-21/22 overflow | none until 001 / 002+006 / 004 / 008 / 014 | **CDA-036** |

---

## 6. What this run will not recommend

- New HP%, damage%, or palette families.
- Shipping Crimson Spawn / Shadow Lurker / Storm Caller as Register lore.
- A third Doka-hoard achievement or a 12-turn challenge.
- A fifth reflect.
- Extra `WF-*` TypeScript (including a Wave-22 dump that 035 actually stopped).
- Wave-21/22 `EnemyFamily` members (`octave_mender`, `shove_hosteler`, Quota-* rows).
- Extra live `BOSS_RUSH_ROOMS` / Rush Table T as code.
- A 33rd innate spell.
- Leftover occupancy (Skipping Cinder / Shy Cinder) as a shrine bind.
- Glass Realm ×2 / Titan roll / Doka Fever +25% / advertised Phase-2 HP as a new verb.
- Wave-23 catalogs.
- Retuning `pickEnemyLevelFromTiers` percents, RAF, mapGen solvability, or combatMath formulas.
- Treating `longHorizonSim.ts` as player telemetry (still `available === false`).
