# Content Diversity & Repetition Audit — 2026-09-01

**Auditor:** Content Diversity and Repetition Auditor (cron `0 */48 * * *`)  
**HEAD:** `dd275aa` — `Merge pull request #182 from Mr-Melic/cursor/caffeine-automation-gates-46e6`  
**Prior run:** 2026-08-31 (memories + sibling design docs). **Gameplay / production code:** not modified.

Indefinite progression is supposed to come from:

`family × relative level × variant × AI × spell pool × formation × map × modifier`

Live spawn still rolls a random chess piece, a 30% family **stat sticker**, a 4-quadrant scatter, and a piece-type kit that never leaves band 0. Proposed catalogs from 2026-08-31 (`ENEMY_FORMATIONS`, `ENCOUNTER_EVOLUTION`, `ENEMY_ELITE_EVOLUTION`, `worldFeatures.ts`) remain **unwired**.

Do not add HP/damage reskins. Do not add Crimson Spawn / Shadow Lurker / Storm Caller until family actually selects kit, AI, and a combat hook.

Sibling IDs to consume, not duplicate: `SDA-2026-08-31-*`, `EBA-2026-08-31-*`, Expansion `PREREQ-A`–`C`, PX `combinedMechanic` REWORK.

---

## 1. Next-run checks (2026-08-31) — all still fail

| Check | Result | Evidence |
| :--- | :--- | :--- |
| Does family select kit / AI / passive? | **No.** 30% overlay writes `family` + HP/dmg/RES/SP. Kit is `pieceType`. AI is `inferArchetype`. | `WorldExploration.tsx` 6447–6537, 12483–12487; `enemyAI.ts` 156–178, 420–449 |
| Is family HP still wiped? | **Yes, and worse.** Battle start also overwrites `res` / `sp` via `computeEnemyStats(level, pieceType)`. Family `mp` / `ap` in the overlay table are never applied. | `WorldExploration.tsx` 12424–12466, 12533–12561; `combatMath.ts` 114–119 |
| Are all `starterSpells` forced `isBaseSpell`? | **Yes.** | `WorldExploration.tsx` 2393–2406 |
| Does anything read `BOSS_RUSH_ROOMS.combinedMechanic` besides the table? | **No.** | `useBossRush.ts` 13–135; repo grep is declarations only |
| Did Shield / Iron Skin or Poison / Venom diverge? | **No.** Same numbers. | `spellData.ts` 30–47 vs 293–312; 48–67 vs 394–415 |

---

## 2. Live catalogs

### 2.1 Enemy families (typed, 7 + `default`)

`EnemyFamily` (`types/gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`, `default`.

Spawn (`WorldExploration.tsx` 6393–6537):

1. Every slot starts `family: "default"`.
2. 30% roll picks a family and applies `familyStatMults` (HP, damage, RES, SP only).
3. Overlay `mp` / `ap` fields exist on the table and are **never written**.
4. RES/SP are stored as 0.05–0.75 fractions. Combat treats RES as 0–100 percent. Then battle start **throws the overlay away**.

Battle start (`WorldExploration.tsx` 12424–12561):

- `computeEnemyStats(e.level, e.pieceType, e.id)` → `getEnemyBaseStats` — **no family argument**.
- Overwrites `sp`, `sr`, `init`, `res`, `chc`.
- `calcEnemyMaxHp(e.level)` overwrites HP / maxHP.

What remains of a family in combat:

| Family | Live hook | Register / overlay claim (not live) |
| :--- | :--- | :--- |
| `ember_knight` | Melee applies 3/turn burn × 3 (`WorldExploration.tsx` 17224–17238) | Burning trail tiles |
| `tide_shade` | Melee applies −1 MP × 2 (`WorldExploration.tsx` 17240–17255) | Adjacent slow + per-turn regen |
| `void_mirror` | 25% of pre-crit damage reflected (`castHelpers.ts` 327–336) | Magic immunity until a physical hit |
| `wraith_bishop` | Art + discarded stats | Phase walls, MP drain, shadow teleport |
| `iron_golem` | Art + discarded stats | Poison/burn immune, stagger on AP dumps |
| `plague_rat` | Art + discarded stats | Poison stacks, pack overwhelm |
| `bone_scribe` | Art + discarded stats | Ranged Weaken, low-HP glass |

**Verdict:** four of seven families are reskins. Three have a single melee rider. None select kit, AI, formation, or spell pool.

### 2.2 Variants / elite / champion

- No elite or champion type on the combatant.
- Leader = highest `level` in the pack (`WorldExploration.tsx` 12574–12579).
- Summoner = `0.12 + 0.02 * playerLevel` (`gameConstants.ts` 298–299; `WorldExploration.tsx` 12496–12506). Saturates at **player level 44** (every non-summon is a summoner). Kit is wolf **or** archer only.
- `worldFeatures.ts` defines `elite_patrol` and a feature catalog. **WorldExploration does not import it.** Tests only.

### 2.3 AI profiles

`decideEnemyAction` archetypes (`enemyAI.ts` 80–86): `caster | healer | charger | flanker | berserker | summoner | generic`.

`inferArchetype` (`enemyAI.ts` 420–449):

1. Any spell with `spellType === "heal"` **or** `healAmount > 0` → **healer**. This includes `starter-drain`, `spell-lifesteal-nova`, `spell-drain-courage`.
2. Else majority ranged → caster.
3. Else knight → flanker.
4. Else `family` contains `"berserk"` or `aiStrategy === "berserk"` → berserker. **No live family string contains `berserk`.**
5. Else melee-only → charger.

`summoner` is on the type union and is **never returned** by `inferArchetype`. WorldExploration branches on `enemy.isSummoner` separately (`WorldExploration.tsx` 16823).

`ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–208) names `groupTactics`, `chokepointCamp`, `defensiveRetreat`, `escapeRoute`, `bottleneckControl`, `instantKill`, `betrayal`. Those are sophistication gates, not family-bound roles. `computeAITier` (`combatMath.ts` 36–51) is level bands plus a 30% 1–10 noise roll.

Kits (`enemyAI.ts` 156–178) are **piece-type only**:

| Piece | Band 0 (live, always) | Intended band 1+ |
| :--- | :--- | :--- |
| pawn | Strike | + Venom Strike |
| knight | Strike only | Strike only |
| bishop | Frost Bolt | + Poison Arrow |
| rook | Strike | + Iron Skin |
| queen | Frost **or** Inferno | + Blood Mend |
| king | Frost **or** Inferno | + Rallying Cry (`usableByEnemy: false`) |

`buildEnemyKit(enemy.pieceType, currentMap.levelZone)` (`WorldExploration.tsx` 12484) passes a `{ name, minLevel, maxLevel }` object. `Math.floor(levelZone)` is `NaN` (`enemyAI.ts` 192). Every `z >= 1` check fails. **Every overworld kit is band 0.**

### 2.4 Spell pools

Frontend catalog: 31 ids in `data/spellData.ts` / `SPELL_ID_CATALOG` (`bossKits.ts` 29–62).

Backend `defaultSpells()` (`src/backend/lib/admin.mo` 168–191) is a **second** set: `shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`. Not in `SPELL_ID_CATALOG`. Motoko boss seeds still name deleted ids (`fireball`, `cursed_gust`, …).

`WorldExploration.tsx` 2393–2406 marks **every** `starterSpells` entry `isBaseSpell: true`. There is no observe / victory / achievement unlock. `ownedSpells` is base ∪ backend extras.

Near-duplicates (numbers only):

| Pair | Shared verb | Cosmetic difference |
| :--- | :--- | :--- |
| Shield / Iron Skin | +30% RES, 3 turns | AP 2 vs 3; name |
| Poison Arrow / Venom Strike | 4 DoT × 3, no upfront | Range 4 vs 2; `poison` vs `venom` |
| Expose / Shadow Veil | Damage + RES+SP shred, 2 turns | 15 / −20% vs 18 / −15% |
| Blood Mend / Rallying Cry | Self-heal +15% CHC, 2 turns | 12 vs 20 heal; Cry is `usableByEnemy: false` |
| Life Drain / Drain Courage | Drain + secondary shred | SP vs AP |

Guardian summon kit lists **both** Shield and Iron Skin (`spellData.ts` 593).

Player-only (`usableByEnemy: false`): Barrier, Mirror, Timestep, Rallying Cry, Sentinel, Bomber, Wisp. King band-1 and several boss kits still list Rallying Cry / Mirror / Timestep / Wisp.

### 2.5 Formations

Live: 4 quadrants + Chebyshev ≥ 4 (`WorldExploration.tsx` 6323–6442). No named roles. `docs/design/ENEMY_FORMATIONS_2026-08-31.md` is PROPOSED.

### 2.6 Bosses

19 IDs (`bossTypes.ts` 390–410). `bossDefaults.ts` header still says “12 bosses”; the table has all 19.

`BossAbility` enums are **unique per design** and `useBossSystem.ts` has a dispatcher for each. That is real tactical variety **if** the player faces the ability, not the kit remix.

Kits do not share an identical set (validator enforces uniqueness + phase-2 adds a spell). They **remix the same six verbs**:

| Spell | Boss kits using it |
| :--- | :--- |
| Shadow Veil | 7 — Archbishop, Starborn Queen, Midnight Bishop, Lich, Mirror Sovereign, Archivist, Enthroned Void |
| Cursed Wound | 6 — Archbishop, Fetid Rook, Eternal Pawn King, Midnight Bishop, Lich, Archivist |
| Frost Nova | 6 — Grandmaster, Starborn Queen, Midnight Bishop, Lord of Static, Alabaster, Enthroned Void |
| Swap | 5 — Grandmaster, Midnight Bishop, Lich, Mirror Sovereign, Enthroned Void |
| Iron Skin | 5 — Weeping Pawn, Eternal Pawn King, Broodmother, Alabaster, Twin Monarchs |
| Lifesteal Nova | 4 — Countess, Fetid Rook, Broodmother, Starved Vampire |
| Chain Lightning | 4 — Grandmaster, Starborn Queen, Lord of Static, Mirror Sovereign |
| Mark | 4 — Starborn Queen, Lich, Mirror Sovereign, Archivist |

Phase 2 = add a catalog spell (and/or a `BossAbility`). That is escalation by **more verbs from the same pile**, not a new question.

Boss Rush (`useBossRush.ts` 24–135): 10 fixed pairs. `combinedMechanic` strings (heal-the-pawn, decoy king, jackpot feed loop, …) have **no combat reader**. Room 9 uses `weeping_pawn_2`, not in `BOSS_IDS`. `dokaReward` / `xpReward` are ignored by `completeBossRushRoom` (AGENTS.md).

Enemy Register (`EnemyRegister.tsx` 22–150) advertises pair rules and family tactics the engine does not run, plus three families not in `EnemyFamily`.

### 2.7 Encounters / dungeon rooms

`generateEnemies`: 1–8 pieces (plus dungeon extras 2/3/4/4/5) , random piece, 30% family, quadrant fill. Dungeon adds `dungeonTierBoost` to the already-picked level (`WorldExploration.tsx` 6291–6366).

No `encounterType`. No room beat (teach / reinforce / combine / objective). `docs/encounters/ENCOUNTER_EVOLUTION_2026-08-31.md` is PROPOSED.

Maps: seven archetypes in `mapGen.ts` (openField, corridorMaze, fortress, ruinsIslands, arena, asymmetric, chessboard). Geometry varies; the **pack** does not.

### 2.8 Challenges

Nine rows (`challengeCompletion.ts` 38–103). Conditions:

| Condition | Count | Player question |
| :--- | ---: | :--- |
| under_N_turns (15 / 10 / 5) | 3 | Race the clock — same verb, tighter number |
| under_N_damage / no_damage | 3 | Don't get hit — same verb, tighter number |
| no_healing (+ combo) | 2 | Don't press Blood Mend |
| under_8_ap_per_turn | 1 | Don't dump AP |
| direct_hit (Chebyshev ≤ 2) | 1 | Only close-range casts |

Predicates are wired and tested. Diversity is **numeric clones**, not new verbs.

### 2.9 Achievements

Fifteen seeds (`admin.mo` 309–325): first win, 1 HP, spell level 5, 1k/10k Doka, 25 maps, betrayal witness, leader kill, jackpot, 10 loot, double betrayal, **level 10**, 8 spells equipped, 5 crits, pacifist run.

No family, modifier, formation, discovery, or boss-ability condition. `unstoppable` / `level_10` is a **capped milestone** on an uncapped game.

### 2.10 Environmental mechanics / modifiers

22 ids in `mapModifiers.ts`.

**Identical:** `slime_flood` and `frozen_terrain` both `onMpCost: base * 2` (155–172).

**Announce-only placeholders:** `blood_moon`, `mirror_field`, `gravity_well`, `fog_of_war` (260–296).

**Numeric amplifiers (not new verbs):** Titan's Vigor (+1000 HP, 1–5× damage), Glass Realm (×2 damage), Doka Fever (+25% enemy HP, ×2 Doka).

**Real verbs:** Thorned Ground (path tax), Void Rift (tick + displacement in WX), Arcane Surge (AP−1), Time Warp (15s timer, WX branch), Plague Zone (1 HP/turn), Paper Windstorm (range ×0.5, targeting branch), Mending Mist, Swift Winds, Iron Curse, Vampiric Ground, Null Field, Chaos Initiative, Arcane Overflow.

Hazards on the map: lava / ice / spikes. Those are the live TERRAIN verbs. `worldFeatures.ts` (moving hazards, elite patrol, spell-bearing enemy, treasure) is catalog + unit tests only.

---

## 3. Mechanic category coverage

| Category | Live (player must answer) | Over / under |
| :--- | :--- | :--- |
| DAMAGE | Strike, Inferno, Sacrifice, Chain Lightning, boss ATK | **Over** — default verb |
| STATUS | Poison/Venom twins, Expose/Veil twins, Cursed Wound, Weaken, ember burn | **Over** — shred + DoT |
| RESOURCE_MANIPULATION | Frost −1 MP, Slow −2 MP, tide melee −1 MP, Drain Courage −1 AP, Haste +2 MP | **Over** on MP-slow |
| SUPPORT | Blood Mend / Rallying Cry twins, Enrage | Mid — self-heal+CHC clone |
| DEFENSE | Shield / Iron Skin twins, Mirror (player), void 25% reflect | Mid — RES buff clone + reflect |
| DRAIN | Life Drain, Drain Courage, Lifesteal Nova, vampire_bite | **Over** |
| SUMMONING | Wolf / Archer (enemy); five summons (player). Cap 2, CD 2. Saturates as a flag. | Mid — “add a unit”, not a role |
| POSITIONING | Swap, Mark, Barrier (player-only), 4-quadrant scatter | **Under** as pack geometry |
| CONTROL | Frost / Slow / Frost Nova (all MP) | **Under** — no hard lock, no action-deny except MP |
| REACTION | Mirror, void reflect, boss REFLECT / SPELL_MIRROR | **Under** — reflect only |
| MOBILITY | Haste, knight jump (boss), Swap | Under as enemy pack verb |
| TERRAIN | Lava / ice / spikes; Thorned / Rift; 4 placeholder modifiers | Mid — hazards exist; pack does not compose them |
| TEAM_SYNERGY | Leader = highest level; Rallying Cry is self + `usableByEnemy: false` | **Under** — unwired |
| OBJECTIVE_PLAY | None. Dungeon = more bodies + higher level. | **Under** |
| SPELL_DISCOVERY | Full catalog innate | **Under** — absent |

---

## 4. Redundancy lists

**Redundant enemies (live):** any `default` / `wraith_bishop` / `iron_golem` / `plague_rat` / `bone_scribe` on the same piece — they fight the same. Ember / tide / void differ by one melee rider. Knight is Strike-only forever. Queen and King share frost→inferno.

**Redundant spells:** Shield ≡ Iron Skin; Poison Arrow ≡ Venom Strike; Expose ≈ Shadow Veil; Blood Mend ≈ Rallying Cry; Life Drain ≈ Drain Courage ≈ vampire_bite; Mirror ≈ reflect_barrier; backend `thunder_clap` ≈ Chain Lightning.

**Repeated encounter structure:** random pieces, 30% sticker, quadrant spacing, optional summoner flag, optional random modifier. Dungeon repeats that with extra count. Every map is “clear the lottery pack, portal unlocks.”

**Repeated boss structure:** unique `BossAbility` (good) + kit drawn from Cursed Wound / Shadow Veil / Frost Nova / Swap / Iron Skin / Lifesteal Nova (bad) + phase 2 adds one more of those + Rush pair flavor that does not run.

**Proposed-only (do not treat as shipped):** named formations, elite overlays, encounter IDs `ENC-*`, `WORLD_FEATURES`, Enemy Register extras, `combinedMechanic` rules.

---

## 5. Combinatorial depth — what is bound

| Axis | Bound in live spawn? |
| :--- | :--- |
| Chess piece | Yes — uniform random |
| Relative level | Yes — `pickEnemyLevelFromTiers` (keep) |
| Family | Token + art + 3 melee riders; stats wiped |
| Variant / elite | No |
| AI | Inferred from kit/piece, not assigned |
| Spell pool | Piece kit band 0 only (`levelZone` object → NaN) |
| Formation | Quadrant lottery |
| Map archetype | Yes — geometry only |
| Modifier | 0–2 random; 4 stubs; 2 identical |

Progression today is **bigger numbers on the same lottery**. That is the failure mode this brief forbids.

---

## 6. Recommendations (gaps only)

Recommend **binding axes** and **one new verb per underrepresented category**. Do not add families, DoTs, drains, or turn-count challenges.

Each item below has a **NEW PLAYER DECISION** and a matching `CDA-2026-09-01-*` record in [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-01.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-01.md).

1. **Persist family through combat and bind kit + AI + one hook.** Decision: “This is a golem — I must kite / stagger,” not “purple bishop with the same Strike.”
2. **Pass a numeric kit band from relative enemy level.** Decision: “This equal-tier rook has Iron Skin — burn it or ignore the armor window.”
3. **Diverge or retire the four clone pairs.** Decision: pick Shield **or** Iron Skin for a reason (ally-cast vs self, physical-only vs all hits, …).
4. **Ship one named formation** (protector + artillery) from existing pieces. Decision: “Kill the bishop first or the rook body-blocks forever.”
5. **Elite as a role overlay** (bodyguard / patrol), not +HP. Decision: “Peel the elite off the backliner, or never touch the loop.”
6. **One challenge that is not a turn/HP clone** (no stepping on hazard / interrupt a cast / leave the summoner alive). Decision: change the plan mid-fight for the overlay.
7. **Wire or delete `combinedMechanic`.** Decision: “Kill Archbishop first or the Pawn resurges” must be true or unsaid.
8. **Cap summoner chance on tier; set the role explicitly.** Decision: “There is one summoner — focus it,” not “everyone grows a wolf after level 40.”
9. **Achievement conditions for family / modifier / discovery**, not level 10. Decision: “I will hunt a void_mirror under Null Field.”
10. **Honest Enemy Register** (or wire the advertised hook). Decision: trust the book or stop opening it.
11. **Boss kit uniqueness** — drop Veil/Wound/Nova from kits that already have a unique `BossAbility`. Decision: “This boss is board-shrink, not another Shadow Veil.”
12. **One OBJECTIVE_PLAY dungeon beat** (hold the portal / escort a token). Decision: “Do I race the clock or clear first?”
13. **`inferArchetype` uses explicit `aiProfile`; drain ≠ healer.** Decision: “The drain queen is artillery, not a mend target.”
14. **Wire or retire placeholder modifiers; split slime vs ice.** Decision: “Fog means I must close; ice means I pay MP to reposition.”
15. **One TEAM_SYNERGY pair** (golem rook + wraith bishop) using existing art. Decision: “Break the pair or eat both verbs.”

Do **not** implement Register-only families. Do **not** add another 4-dpt DoT. Do **not** add `under_20_turns`.
