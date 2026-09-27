# Stralt expansion catalog — 2026-09-27

**Author:** Expansion Director (cron `0 */24 * * *`, automation `3f31b18f-a492-11f1-a7d1-d6b4613131ce`)  
**This run:** tenth catalog. Re-rank against `origin/main` `0f5363f` (`Merge pull request #332` — accepted-challenge HUD). Author-date on that tip is **2026-09-03**. Calendar: 2026-09-27.  
**Prior living catalog on `main`:** [`EXPANSION_PROPOSALS_2026-09-02.md`](./EXPANSION_PROPOSALS_2026-09-02.md) (`HEAD` then `58302bc`).  
**Unmerged sibling catalogs:** PR **#366** (09-21; 019/020), **#397** (09-22; 021/022), **#453** (09-23; 023/024), **#510** (09-24; 025/026), **#573** (09-25; 027/028), **#623** (09-26; 029/030) — same `HEAD`, still drafts. This file **adopts** 019–030 rather than reminting them.  
**Earlier catalogs:** [`EXPANSION_PROPOSALS_2026-09-01.md`](./EXPANSION_PROPOSALS_2026-09-01.md) (#192), [`EXPANSION_PROPOSALS_2026-08-31.md`](./EXPANSION_PROPOSALS_2026-08-31.md) (#118).  
**Gameplay / production code:** not modified.

All seventeen 08-31 / 09-01 / 09-02 cards remain **PROPOSED**. 019–030 remain **PROPOSED**. None shipped. None superseded. New IDs in this file are additive first-ship slices of already-ranked cards.

`README.md` still indexes the 09-01 catalog. Older open PRs own that file. This run does not touch `README.md` / `AGENTS.md` / `ARCHITECTURE.md` / `WorldExploration.tsx` / `mapGen.ts` / `challengeCompletion.ts` / `targeting.ts` / the 09-02 catalog (#366) / the 09-22 catalog (#397) / the 09-23 catalog (#453) / the 09-24 catalog (#510) / the 09-25 catalog (#573) / the 09-26 catalog (#623).

Score used for ranking (unchanged):

```
SCORE = PLAYER_VALUE + TACTICAL_DEPTH + REPLAYABILITY + NOVELTY
      + INFINITE_PROGRESSION_COMPATIBILITY
      − IMPLEMENTATION_COMPLEXITY − REGRESSION_RISK − BALANCE_RISK
```

Each axis is 1–10. A proposal is only strong if it creates a **new player decision** and multiplies existing axes (family × relative level × variant × AI tier × spell pool × elite × composition × map × modifier) instead of adding another HP-scaled clone.

There is **no character level cap**. XP continues `100 * 2^(N-1)`. Encounter generation must keep a below / near / equal / above distribution via the existing tier spawn. Higher progression must add AI, kits, variants, elites, synergies, environment, and objectives — not only larger HP and damage.

---

## Delta since 2026-09-26

`main` did **not** move. #366 / #397 / #453 / #510 / #573 / #623 ranked the same `0f5363f`. This run is a re-rank against a still-growing open-PR queue (gh window 200; highest observed open number **#659**), plus two first-ship slices that 09-26 already reserved: the third 006 predicate (`no_summons`, after 020 / 030) and the second 002 elite token (`hexer`, after 025).

| Fact | Evidence |
| :--- | :--- |
| No expansion implementation | Still the 2026-09-02…03 integrity/persist/parity burst. Zero commits 2026-09-03 00:28 UTC → this cron. Cards did not ship off-branch. Re-verified live hooks on this `HEAD`. |
| Open queue grew again | Oldest still-open blockers: **#327** Striker AoE (`WX` / `targeting.ts` / `challengeCompletion.ts` / `enemyAI.ts`), **#331** portal destack (`mapGen`). Twin **#370** restacks the same Striker gate. Then 09-21…09-27 flocks (200+ drafts in the `gh` window). Do not restack those files. |
| #366 / #397 / #453 / #510 / #573 / #623 still drafts | 09-21…09-26 catalogs are not on `main`. Adopt 019–030. Do not fight those PRs on their dated catalog files. |
| Blood Moon / Mirror Field are **live** | Unchanged: `spellEngine.ts` **895** Blood Moon ×1.25 player non-heal damage; **901–907** Mirror Field 20% ST reflect. Registry hooks in `mapModifiers.ts` 260–277 remain empty. Gravity Well / Fog of War still unused (`_isGravityWell` / `_isFogOfWar`, `WX` 2324–2326). |
| Family paper stats lie twice | Overlay still multiplies HP/damage (`spawnPolicy.ts` 261–272). Battle start then **also** overwrites RES/SP/CHC via `computeEnemyStats` (`WX` 11872, 11898–11902) and HP via `calcEnemyMaxHp` (`WX` 11970–11974). PREREQ-H is identity-only, not “keep the overlay numbers.” |
| `inferArchetype` never returns `summoner` | Inference (`enemyAI.ts` 447–477) never emits it. Live summoner path is the `isSummoner` flag (`WX` 16375). 023 must keep that flag. |
| 019 without PREREQ-F is a trap | Band-1 queens gain `starter-heal` and `inferArchetype` (`enemyAI.ts` 447–452) classifies them as healers. **Ship 019 with F in the same PR.** |
| Register is lore | `enemyRegisterCopy.ts` **FLAVOR LORE** (`9e28cf9`). Per-row copy still mismatches live hooks. 014 must not convert the register into a bestiary. |
| Player summon kit is live, unused as a challenge axis | Five starter summon ids (`summon-dire-wolf` / `sentinel` / `archer` / `bomber` / `wisp`) carry `isSummon: true` (`spellData.ts` 547–673). Challenges still have nine numeric predicates (`challengeCompletion.ts` 11–20). |
| No live elite token | No `isElite` flag. 025 (`shielded`) is still the first token; 032 is the second (`hexer`) using existing `spell-weaken` metadata (`spellData.ts` 334–351). |
| Telemetry still none | TBC on `main` is 09-02 `WAITING_FOR_TELEMETRY`. Open **#609** (09-26) still waiting. 0 collectors / 0 rows. Do not claim live demand. Do not retune XP, Doka, or spawn weights. |
| Engineering-health on `main` | Last landed reports: `MASTER_ROADMAP.md` / LONG_HORIZON / CDA / PXA / QUALITY_AUDIT dated **2026-08-30…09-02**. 09-21…09-26 MTD (**#618**), CDA (**#614**), PX (**#632**), LHIPS (**#637**) are still drafts. Code claims that match this `HEAD` are accepted. Last landed ACTION_IDS: `ACTION_IDS_2026-09-03-0000.md` (RAO; challenge HUD landed). |
| Kit band still NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WX` **11920**. `levelZone` is `{ name, minLevel, maxLevel }` (`WX` **4683–4687**). `Math.floor(levelZone)` (`enemyAI.ts` **199**) → every `z >= 1` fails. |
| Family still a sticker | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286). Chassis stays a random chess piece. Four mute families. Family HP dies at `calcEnemyMaxHp`. No elite token layer. |
| Summoner is still a per-body coin flip | `WX` **11932–11942**: `0.12 + playerLevel * 0.02`, 50/50 wolf or archer. Can mark every enemy a summoner. |
| Push / pull still unused | `applyPushback` / `applyAttract` at `occupancy.ts` **482 / 537**. Callers: tests only. |
| `worldFeatures` still tests-only | 1913 lines, Wave-1 Ember Vein already authored (`WF-HAZ-EMBER_VEIN`, `hpTaxPctOfMax: 0.04`; catalog also lists `extraHazardCount` 3–6 — **027 forbids the spray**). No WX import. Freeze new rows until **one** live tile exists (027). |
| `combinedMechanic` still copy | `useBossRush.ts` 19–135. Zero engine readers. Room 0’s advertised heal/resurge is **not** minted this run (hexer scores higher as a forever-multiplier). |
| Nine challenges still numeric | `challengeCompletion.ts` 11–20. No `kill_leader_last`. No `no_hazard_steps`. No `no_summons`. Open **#327** owns the file. |
| Unused AI gates still unused | `ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–208) has **zero** readers in `enemyAI.ts` except a comment at 1422. 028 is the first gate. |
| Surfaces | `WorldExploration.tsx` 19,213; `mapGen.ts` 1,937; `enemyAI.ts` 2,580; `AdminDashboard.tsx` 8,280; `main.mo` 3,903; `worldFeatures.ts` 1,913. EOP chain `check-limit = 5`; GameKey on frozen `20260901`. |

Practical XP horizon: unchanged. Mid-teens exhaust intended income; level 25 is ~1.678e9 XP. Not a level cap. Do **not** retune the curve as expansion. Content must work at **1–20** and stay valid if someone is still climbing.

---

## Sibling designs (owned surfaces — do not duplicate)

| Sheet | Owns | Director card it details |
| :--- | :--- | :--- |
| [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) | Wave 1 family sheets, variant floors, pack recipes | 001, 002, 004, 014, 021, 023, 025, **032** |
| Wave 2–8 elite / family sheets (09-01 / 09-02 + later open drafts) | More family ids | **Hold** until 001/014/018/019/021 exist |
| [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) | Observe → win → unlock; Wave 1 pool | 003 |
| Later SDE drafts | Later discovery ids | **Hold** until 003 is live |
| [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md) | `ownedSpellIds` / `observedSpellIds` persist types | 003 persist (PREREQ-J) |
| SPELL_PROPOSALS 08-31…09-02 + later drafts | Tactical gap-fill ids | **Hold** until 003 ships |
| [`ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md) + later increments | Unbounded AI modules | 005, 028 |
| [`BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md) + later Rush tables | Boss sheets / Rush Tables | 011, 017 |
| ENCOUNTER_EVOLUTION 08-31…09-02 + later drafts | Teach → pressure dungeon beats | 007, 010, 026 |
| [`WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `engine/worldFeatures.ts` + later WDD drafts | Rarity / relative-difficulty overlay | 009, 016, 022, 024, 027, 029 |
| ENEMY_FORMATIONS 08-31…09-02 + later drafts | Synergy packs | 004, 023 |
| [`MECHANIC_INTERACTION_MATRIX_2026-09-02.md`](./MECHANIC_INTERACTION_MATRIX_2026-09-02.md) + later MIMA drafts | Live join gaps | 013, 018, 024, 029 |
| [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) (on `main`: 09-02) + later MTD drafts | P0 integrity before expansion PRs | Process, not content |
| [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) + later PX drafts | Register / modifier / discovery honesty | 014 QA; Register is lore |
| [`LONG_HORIZON_2026-09-02.md`](./LONG_HORIZON_2026-09-02.md) + later LHIPS drafts | XP wall; kit NaN; summoner saturate | PREREQ-A/B/C; do not retune curve |
| [`CONTENT_DIVERSITY_AUDIT_2026-09-02.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-02.md) + later CDA drafts (**#614**) | Live spawn is sticker + NaN kits; Blood Moon live; no elites | Confirms 001/014/019/021/022/023/025/032 |
| [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) + open **#333** / **#395** / **#462** / **#502** / **#556** / **#609** | STATUS WAITING_FOR_TELEMETRY | No demand claims |
| Unmerged **#366** | 09-21 ranking + 019 / 020 | Adopted here |
| Unmerged **#397** | 09-22 ranking + 021 / 022 | Adopted here |
| Unmerged **#453** | 09-23 ranking + 023 / 024 | Adopted here |
| Unmerged **#510** | 09-24 ranking + 025 / 026 | Adopted here |
| Unmerged **#573** | 09-25 ranking + 027 / 028 | Adopted here |
| Unmerged **#623** | 09-26 ranking + 029 / 030 | Adopted here |

Implementers pick **one** director ID. Follow the sibling sheet for that ID. Do not open a second family / discovery / boss catalog. Do not land Wave 2+ data before the Wave 1 card it multiplies. Full verbatim cards for 001–028 live on **#573**; 029 / 030 live on **#623**. This file restates scores and ship rules, and authors **031 / 032** in full.

---

## Current-state inventory (re-verified on `0f5363f`)

### Progression (no character level cap)

- XP curve is unbounded: `100 * 2^(N-1)` (`utils/xpCurve.ts`). HUD saturates `xpForNextLevel` at `Number.MAX_SAFE_INTEGER` from level 48; persist stays bigint / Motoko `Nat`.
- Enemy levels use `pickEnemyLevelFromTiers` (`engine/combatMath.ts` 54–107): default weights 60% same tier / 20% ±1 / 10% ±2 / leftover ±3..6. This **already** produces below / near / equal / above the player. Keep it.
- Hidden utility clamp: `maxTier = Math.floor(999 / ts)` at `combatMath.ts` 58. Past player level ~1000 the distribution stops climbing. `threeOrMorePercent` is **not read** (leftover fills the bucket).
- `computeAITier` (`combatMath.ts` 36–51) plateaus at 10 after enemy level 900, with a 30% full-random roll. Plateau is acceptable **if** tier 10 keeps unlocking mechanics, not more HP.

### Enemies

- Seven families typed (`types/gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`.
- Spawn writes a random chess piece, then `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289+, `WX` 5864) rolls 30% and multiplies paper HP / damage / RES / SP. Catalog `ap` / `mp` still unused. **Family does not force `pieceType`.**
- Battle start then **re-rolls** `sp` / `sr` / `init` / `res` / `chc` from `computeEnemyStats` (`WX` 11872, 11898–11902) and sets combat HP from `calcEnemyMaxHp(level)` (`WX` 11970–11974). **Family HP, RES, and SP never reach the fight.** No `isElite` / champion token.
- Three live combat hooks only: `ember_knight` melee burn and `tide_shade` melee −1 MP (`WX` 16789–16818); `void_mirror` 25% pre-crit reflect (`castHelpers.ts` 336–345). The other four families are art + dead paper.
- Piece-type kits exist (`engine/enemyAI.ts` 163–185) and grow at zone 1 / 2. Battle start still passes the LevelZone **object**. **Every overworld enemy is stuck on the one-spell zone-0 kit.**
- `inferArchetype` (`enemyAI.ts` 447–477) returns `"healer"` if any assigned spell has `healAmount > 0`. The union includes `summoner`; inference **never returns it**. Live summoner path is `enemy.isSummoner` → `decideSummonerAction`.
- `ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–208) names `groupTactics`, `instantKill`, `chokepointCamp`, `escapeRoute`, `bottleneckControl`, `defensiveRetreat`. **Zero references in `enemyAI.ts`** except a comment at 1422.
- Summoner chance is `0.12 + playerLevel * 0.02` (`WX` 11932–11942). Saturates by mid-40s **and** can fire per body. `ENEMY_SUMMON_CAP = 2` contains the board, not the pack.

### Spells / discovery

- Frontend catalog: 32 ids in `data/spellData.ts`. Every `starterSpells` entry is `isBaseSpell: true` (`WX` 2395–2407). No observe / kill / achievement / elite unlock path.
- Five summon spells already carry `isSummon: true` + `summonAI` / `summonLifespan` / `summonUnitDef`. 031 keys off that metadata, not the name string.
- Backend `defaultSpells()` is a different six-spell set. Dual catalogs.
- Targeting is metadata-driven (`isTileCastableLive`). New spells must stay on that contract.
- `applyPushback` / `applyAttract` have tests and **no** production callers. `void_collapse` still advertises pull.
- `spell-weaken` already exists (`debuffStat: "dmg"`, `debuffModifier: 0.7`, `debuffDuration: 2`). 032 reuses that effect shape.

### Combat / world / dungeons / bosses

- 22 map modifiers. **Live in engine, empty in registry:** `blood_moon`, `mirror_field`. **Still unused:** `gravity_well`, `fog_of_war`. `slime_flood` ≡ `frozen_terrain` (both MP×2). `titans_vigor` still +1000 HP and 1–5× damage.
- `engine/worldFeatures.ts`: 52 `WF-*` rows, tests only, **no production caller**.
- Seven map archetypes. `mapGen.ts` stays frozen. Open **#331** owns destack.
- Dungeon chain is linear 3–5 maps. Depth extras are more bodies + tier boost (`spawnPolicy.ts` 27–28). No special rooms, no forks.
- 19 bosses, two phases. Boss Rush `combinedMechanic` is copy only.
- Challenges: nine numeric predicates (`challengeCompletion.ts` 11–20). Open **#327** owns this file.
- Achievements: 15 one-shots. `level_10` is a capped milestone. Rewards are Doka, never a spell.

### Engineering-health constraints

- No player telemetry. Do not claim live demand. Do not retune from `longHorizonSim`.
- New behavior belongs in `src/frontend/src/engine/*` or `src/frontend/src/utils/*` with tests; WX gets one-line wiring. **Do not grow WX while #327 is open.**
- Do not touch RAF, **map generation**, turn logic, or damage math (`AGENTS.md`). **Do not edit `mapGen.ts` while #331 is open.**
- Credits still go through `applyRewards`; spends / death through `saveBattleStats` on `createProgressPersist`. No second reward funnel.
- Discovery that writes ownership must enqueue on the persist lock **and** use PREREQ-J (a **new later** migration file after frozen `20260901`).
- Caffeine import gate + oldest-first stack-compat are CI.
- Client-trusted canister writes remain an architecture decision (AQA-2026-08-30-008), not an expansion.

---

## Prerequisites (not expansions — fix or respect before shipping content)

| ID | Finding | Why it blocks infinite / combinatorial content | Status |
| :--- | :--- | :--- | :--- |
| PREREQ-A | `buildEnemyKit(..., currentMap.levelZone)` passes `{ name, minLevel, maxLevel }`; kits never leave zone 0 (`WX` 11920, `enemyAI.ts` 199, zone object `WX` 4683–4687) | Spell-pool depth is implemented and dead. Pass a **number**. Prefer 019’s relative band `R = enemy.level − player.level`. | **OPEN** |
| PREREQ-B | `pickEnemyLevelFromTiers` clamps at 999 (`combatMath.ts` 58). `threeOrMorePercent` unread | High-level players stop seeing above-level enemies. Remove the 999 ceiling; keep the existing weight math; actually use the fifth percent. | OPEN |
| PREREQ-C | Summoner chance uses raw `characterStats.level` (`WX` 11932–11942) | Saturates by the mid 40s **and** can fire on every body. Couple with 023. Keep `ENEMY_SUMMON_CAP`. | OPEN — **couple with 023** |
| PREREQ-D | Do not grow `WorldExploration.tsx` (19,213 lines). Open **#327** owns the file. | Family / elite / discovery tables must live in engine modules. | OPEN |
| PREREQ-E | Persist drafts #183 / #180 | Discovery was racing death-replay and live-Doka PRs. | **CLOSED** (merged 2026-09-01) |
| PREREQ-F | `inferArchetype` treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452) | Drain / lifesteal family rows become healers. **019 must not ship without this.** | OPEN — **couple with 019** |
| PREREQ-H | Battle start overwrites family HP via `calcEnemyMaxHp` **and** overwrites RES/SP/CHC via `computeEnemyStats`. `applyEnemyFamilyStats` still multiplies paper HP first. | The 30% family roll is a lie even as stat flavor. Stamp **identity** in `spawnPolicy`. Natural union with 021. | OPEN — **couple with 021** |
| PREREQ-I | Motoko GameKey EOP **#259** was the oldest open PR | 003 persist could not land in the same queue. | **CLOSED** (#259 gone; GameKey is `20260901_000000` on `main`) |
| PREREQ-J | Any new persistent `let`/`var` on `main.mo` (including `ownedSpellIds` / `observedSpellIds`) | Must be a **new later** chain file after frozen `20260901` (`OldActor = {}`). Wait for Caffeine deploy confirmation of the GameKey tail. | **OPEN** |

PREREQ-G (dual frontend / Motoko spell catalogs) stays a hygiene note, not a ship-blocker.

---

## Ranked opportunities

| Rank | EXPANSION_ID | Title | Category | SCORE | Priority | vs 09-26 |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | EXP-2026-08-31-001 | Family role kits (stop using families as HP skins) | ENEMIES | 30 | P0 | same #1 |
| 2 | EXP-2026-08-31-006 | Mechanic challenge catalog | PROGRESSION | 29 | P0 | same |
| 3 | EXP-2026-09-21-020 | First mechanic challenge: `kill_leader_last` | PROGRESSION | 29 | P0 | adopted |
| 4 | EXP-2026-09-01-014 | Mute-family combat hooks (four families have none) | ENEMIES | 28 | P0 | same |
| 5 | EXP-2026-08-31-002 | Elite / champion modifier tokens | ENEMIES | 28 | P1 | same |
| 6 | EXP-2026-08-31-004 | Pack role composition | ENEMIES / AI | 28 | P1 | same |
| 7 | EXP-2026-09-24-025 | First elite token: `shielded` | ENEMIES | 27 | P1 | adopted |
| 8 | EXP-2026-08-31-003 | Observed-spell discovery | SPELL DISCOVERY | 27 | P0 | same; PREREQ-J |
| 9 | EXP-2026-09-26-030 | First unused challenge: `no_hazard_steps` | PROGRESSION | 26 | P0 | adopted |
| 10 | EXP-2026-09-27-031 | First unused challenge: `no_summons` | PROGRESSION | 26 | P0 | **new** — third 006 predicate |
| 11 | EXP-2026-09-21-019 | Relative kit-band adapter (unlock authored piece kits) | ENEMIES | 25 | P0 | adopted; **must ship with F** |
| 12 | EXP-2026-09-22-021 | Family-preferred chassis overlay | ENEMIES | 25 | P0 | adopted; **ship with PREREQ-H** |
| 13 | EXP-2026-09-23-023 | One summoner slot per pack | ENEMIES / AI | 25 | P1 | adopted |
| 14 | EXP-2026-09-27-032 | Second elite token: `hexer` | ENEMIES | 25 | P1 | **new** — second 002 token |
| 15 | EXP-2026-09-02-018 | Wire push / pull on existing ids | COMBAT | 24 | P1 | same |
| 16 | EXP-2026-08-31-010 | Optional tactical objectives | COMBAT | 24 | P1 | same |
| 17 | EXP-2026-09-25-027 | First world feature: Ember Vein tile | WORLD | 24 | P2 | adopted |
| 18 | EXP-2026-09-24-026 | First side objective: `contest_shrine` | COMBAT | 23 | P1 | adopted |
| 19 | EXP-2026-08-31-008 | Uncapped achievement / mastery ladder | PROGRESSION | 23 | P2 | same |
| 20 | EXP-2026-08-31-013 | Explicit spell-interaction layer | COMBAT | 23 | P2 | 018 first |
| 21 | EXP-2026-09-01-016 | Wire `worldFeatures` overlay (no mapGen rewrite) | WORLD | 23 | P2 | same; 027 first; freeze new `WF-*` |
| 22 | EXP-2026-09-23-024 | Wire Gravity Well via existing attract | WORLD | 22 | P2 | adopted |
| 23 | EXP-2026-09-25-028 | First AI gate: `chokepointCamp` | AI | 22 | P2 | adopted |
| 24 | EXP-2026-09-26-029 | First unused modifier: Fog of War vision cap | WORLD | 22 | P2 | adopted |
| 25 | EXP-2026-08-31-009 | Finish unused modifiers + combo-only world rules | WORLD | 21 | P2 | same; 024 then 029; then slime≠frozen |
| 26 | EXP-2026-08-31-005 | AI sophistication ladder (unused gates) | AI | 21 | P2 | same; 028 first |
| 27 | EXP-2026-08-31-007 | Dungeon room types without rewriting mapGen | DUNGEONS | 21 | P2 | wait for #331 |
| 28 | EXP-2026-09-02-017 | Honor Boss Rush `combinedMechanic` | BOSSES | 20 | P2 | same; first-room slice still unminted |
| 29 | EXP-2026-08-31-011 | Boss mechanic-pool scaling (not more HP) | BOSSES | 17 | P3 | same |
| 30 | EXP-2026-09-22-022 | Convert Blood Moon off ×1.25 damage | WORLD | 16 | P3 | adopted |
| 31 | EXP-2026-09-01-015 | Convert Titan's Vigor off +1000 HP | WORLD | 15 | P3 | same |

**Ship-next (not the same as SCORE):** **021 + PREREQ-H** → **014** → **PREREQ-A + 019 + PREREQ-F (one PR)** → **001** → **025** (after 021) → **032** (after 025; not the same PR as 025) → **023** (after #327) → **020** (after #327) → **030** (after #327; same `challengeCompletion.ts` as 020 — union, do not open a second predicate PR while 020 is in flight) → **031** (after #327; same file as 020/030 — union, do not open a third predicate PR while either is in flight) → **018** → **024** (after walk freeze / 018) → **027** (Ember Vein; no `mapGen` punch; one cell, ignore catalog `extraHazardCount`) → **026** (after #327; no `mapGen` punch) → **028** (tiny `aiTierGates` helper) → **029** (after targeting freeze / #327; do not rewrite `isTileCastableLive`) → **003** (PREREQ-J) → 002/004 remainder.

SCORE ranks opportunity size. Ship-next ranks what creates a player decision **this week** without Motoko schema, without growing `enemyAI.ts` for content tables, and without racing open WX / mapGen / challenge / targeting / walk-occupancy PRs.

021 before 019 because band-0 kits already differ by piece type: coupling family → preferred chassis works **today**, lives in `spawnPolicy.ts`, and does not wait on #327. Bundle PREREQ-H in that same PR. 031 is the cheapest third challenge decision (leave the summon bar dark, or fail) and multiplies the live five-spell summon kit plus later 023 enemy summoners (enemy bodies do **not** fail the contract). 032 is the cheapest second elite decision (interrupt the hexer before Weaken lands) and multiplies family × kit × relative level without +HP.

Held this run (do not remint): 017 room-0 heal/resurge (SCORE ~21, one-room puzzle); 009 `slime_flood` ≠ `frozen_terrain`; 006 `modifier_survivor` / `interrupt_channels` / `only_observed_spell` (last needs 003).

---

## New proposal cards (this run)

### EXP-2026-09-27-031

**TITLE:** First unused challenge: `no_summons`  
**CATEGORY:** PROGRESSION  
**PLAYER_OPPORTUNITY:** Leave the summon bar dark and spend AP on positioning / control / damage — or refuse the contract — instead of another “go faster / take less” timer.  
**MECHANIC:** Add `no_summons` to `ChallengeCondition`. Fail if the **player** successfully starts a summon: `SpellConfig.isSummon === true` **or** `effectType === "summon"` (the five live starter ids already set both). Canvas `"summon"` kit casts and Attack-Nearest-of-a-summon-spell count. Enemy summons, 023 pack-summoner bodies, and player-summon **walks after a failed start** do **not** fail (the **cast** is the fail). Sacrifice self-HP is not a summon. Rewards stay on the existing recap → `applyRewards` path.  
**WHY_IT_IMPROVES_STRALT:** This is the third shippable slice of 006. 020 asks for a kill-order. 030 asks for a **path**. 031 asks for a **kit**. The player already owns five summon spells; the nine live challenges never constrain them. Isolated module; no Motoko; no family table; no targeting rewrite.  
**SYSTEMS_AFFECTED:** `challengeCompletion.ts` + tests; `ChallengePanel.tsx` copy for one new catalog row (or rotate into an existing hard slot — do not add a second recap funnel). **Wait for #327** (owns `challengeCompletion.ts`) or union one helper. Do not land 031 in the same PR as 020 or 030 unless a human explicitly picks two predicates.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Harder when 023 puts an enemy summoner on the board (you cannot answer body-with-body) and when 001/019 kits force control instead of a wolf. Valid at any player level because the constraint is relative to the live bar, not a level cap.  
**IMPLEMENTATION_APPROACH:** Accumulate `playerSummonCast` on the shared cast/fizzle helper (mouse **and** touch). Key off `isSummon` / `effectType`, never `name.includes("Summon")`. Unit-test: wolf cast fails; Attack Nearest of a damage spell still passes; enemy wolf on the board still passes; explore-map (out of battle) does not count; fizzle / cooldown reject does not count as a start.  
**BALANCE_CONSIDERATIONS:** Keep the reward in the current hard band (150–200 Doka / 400–500 XP). Do not offer the challenge on a bar with zero summon spells (auto-skip). Do not pay if the player died. Enemy `ENEMY_SUMMON_CAP` is unchanged.  
**QA_REQUIREMENTS:** Touch vs mouse summon parity still holds; Untouchable still uses `recordChallengeDamageTaken`; Attack Nearest still records AP **and** fails 031 only when the chosen spell is a summon; Sacrifice HP still does not fail this predicate; accepted HUD still stays after the first action; `countsTowardKillRewards` still excludes player-side summons; no Doka write on fail.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 7 | 8 | 7 | 5 | 3 | 4 | 3 | 9 |

**What new decision does this create?** “The pack has a summoner — do I keep the contract and kill with spells, or drop a wolf and fail the feat?”

---

### EXP-2026-09-27-032

**TITLE:** Second elite token: `hexer`  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Interrupt or focus the named hexer before its first damaging spell lands Weaken — instead of “same kit, more HP.”  
**MECHANIC:** Second token in `engine/eliteModifiers.ts` (025 introduces the registry). Id `hexer`. Spawn still 0–1 elite per pack; if 025 already rolled `shielded` on this pack, **do not** also roll `hexer` until 004. On the elite’s **first damaging spell** that hits the player (`SpellConfig` damage path, not melee, not DoT ticks), apply the existing Weaken shape: `debuffStat: "dmg"`, `debuffModifier: 0.7`, `debuffDuration: 2` (`spellData.ts` 334–351). Use `statusEffects` replace-or-refresh — no infinite stacks. Chance scales with **AI tier**, not HP. Badge: stone + crimson (`DESIGN.md`).  
**WHY_IT_IMPROVES_STRALT:** This is the second shippable slice of 002. `shielded` is a soak puzzle; `hexer` is a **tempo** puzzle. Together they multiply family × piece × relative level without new art. Reuses a live spell effect; no fifth reflect; no +HP. Sheet: [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md).  
**SYSTEMS_AFFECTED:** `engine/eliteModifiers.ts` + tests (created by 025, or this PR if 025 has not landed — **do not duplicate the registry**). One-line dispatch from the existing enemy-cast path; do not grow WX `if (family === …)` chains. Initiative nameplate badge. Register stays lore.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Higher tiers later add a **second** token or a coordinated pair (004), not +N% HP. Token table is append-only. Hexer at band 20 is still Weaken-on-first-spell, not Inferno-on-spawn.  
**IMPLEMENTATION_APPROACH:** After 021 (identity) and 025 (registry + `shielded`). Copy the hook-union pattern from `engine/mapModifiers.ts` (32–40). Resolve the Weaken payload from `spell-weaken` metadata by **id**, not by name. Do not apply tokens by multiplying `level * 8 + 20` again. Do not implement `coordinator` / `echo_cast` / `phase_step` in this PR.  
**BALANCE_CONSIDERATIONS:** One elite per pack until 004. Weaken is −30% dmg for 2 turns, not a stun and not SR shred. Melee-only hexers (knight / pawn zone-0) should still roll a different token or skip — do not invent a melee hex. Instant-kill / betrayal stay forbidden.  
**QA_REQUIREMENTS:** Elite death still goes through `deathPipeline.ts`; leftover-roster XP unchanged; token hooks do not write Doka; challenge damage still records the hexer’s spell; Pacifist preview does not apply Weaken; mouse and touch share the once-flag; mixed-family pack applies only the tagged elite’s hook.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 7 | 8 | 8 | 6 | 4 | 4 | 5 | 9 |

**What new decision does this create?** “The hexer queen is at range 3 — do I spend MP to close and interrupt, eat the −30% for two turns, or kill the golem first and accept the hex?”

---

## Adopted cards (019–030 and 001–018) — do not remint

Verbatim implementation cards for 001–028: [`EXPANSION_PROPOSALS_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-622d/docs/automation/EXPANSION_PROPOSALS_2026-09-25.md) on PR **#573**. 029 / 030: [`EXPANSION_PROPOSALS_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-6356/docs/automation/EXPANSION_PROPOSALS_2026-09-26.md) on PR **#623**. Scores and ship rules below are unchanged unless this table says so.

| ID | Title | SCORE | Ship note |
| :--- | :--- | ---: | :--- |
| 001 | Family role kits | 30 | After 021, 014, A+019+F |
| 006 | Mechanic challenge catalog | 29 | First predicate 020; second 030; third **031** |
| 020 | `kill_leader_last` | 29 | After #327; do not remint as 031 |
| 014 | Mute-family combat hooks | 28 | Register stays lore |
| 002 | Elite / champion tokens | 28 | First token 025; second **032** |
| 004 | Pack role composition | 28 | First slot 023 |
| 025 | Elite `shielded` | 27 | After 021; not +HP; not the same PR as 032 |
| 003 | Observed-spell discovery | 27 | PREREQ-J later migration |
| 030 | `no_hazard_steps` | 26 | After #327; 027 Ember Vein already names it |
| 019 | Relative kit-band adapter | 25 | **One PR with A+F** |
| 021 | Family-preferred chassis | 25 | **One PR with H**; `spawnPolicy.ts` only |
| 023 | One summoner slot per pack | 25 | Keep `isSummoner` flag |
| 018 | Wire push / pull | 24 | First slice of 013 |
| 010 | Optional tactical objectives | 24 | First slice 026 |
| 027 | Ember Vein tile (4% max-HP tax, **one** cell) | 24 | First slice of 016; ignore catalog `extraHazardCount` |
| 026 | `contest_shrine` | 23 | No mapGen punch |
| 008 | Uncapped mastery ladder | 23 | No `level_N` endgame feats |
| 013 | Explicit spell-interaction layer | 23 | After 018 |
| 016 | Wire `worldFeatures` | 23 | Freeze new `WF-*` until 027 lives |
| 024 | Gravity Well via attract | 22 | After walk freeze / 018 |
| 028 | AI gate `chokepointCamp` | 22 | Extract `aiTierGates.ts`; do not grow `enemyAI` tables |
| 029 | Fog of War Chebyshev-4 vision/cast cap | 22 | After targeting freeze / #327 |
| 009 | Finish unused modifiers | 21 | 024 then 029; then slime≠frozen |
| 005 | AI sophistication ladder | 21 | 028 first; do not encode `if (level >= X)` |
| 007 | Dungeon room types | 21 | Wait for #331; no mapGen rewrite |
| 017 | Honor Rush `combinedMechanic` | 20 | First slice of 011; room-0 still unminted |
| 011 | Boss mechanic-pool scaling | 17 | After 017 |
| 022 | Convert Blood Moon off ×1.25 | 16 | Honesty, not a fifth damage reskin |
| 015 | Convert Titan's Vigor off +1000 HP | 15 | Anti-pattern still live |

---

## Do not re-propose

- Stat-only new enemy ids (including Register-lore Crimson Spawn / Shadow Lurker / Storm Caller).
- Wave 2+ families / SPELL_PROPOSALS ids before 021/014/019+F/018/003.
- A fifth reflect.
- `level_N` endgame achievements.
- mapGen rewrites or a second recap/persist funnel.
- Motoko Character schema by editing frozen `20260831` / `20260901` NewActors.
- Reminting **001–030**.
- Reminting Fog as a new modifier id (the id is `fog_of_war`).
- Reminting `kill_leader_last` (020) or `no_hazard_steps` (030).
- Reminting Ember Vein, `shielded`, `contest_shrine`, `chokepointCamp`, Gravity Well, or the summoner pack slot.
- XP-curve retune as expansion.
- ExtraHazardCount spray for Ember Vein or Fog.
- A melee hexer that invents a new stun. 032 is Weaken-on-first-**spell**.
- Name-based “Summon” string matching for 031.

---

## Next Expansion Director run

Re-rank against `main`. Mark cards SHIPPED/SUPERSEDED only when production code on `main` matches. Do not silently rewrite history. Production code stays untouched unless a later human/orchestrator picks an ID. Skip README if an older open PR still owns it. Do not restack WX / `challengeCompletion` / `targeting` while #327/#370 are open, or `mapGen` while #331 is open. Do not remint **019–032**. Blood Moon/Mirror Field are live in `spellEngine.ts`, not stubs. 021 ships with PREREQ-H; 019 ships with PREREQ-F. Family overlay RES/SP also die at battle start. `inferArchetype` never returns `summoner`. Ember Vein tax is `hpTaxPctOfMax: 0.04`, not 10%, and 027 is **one cell**. Fog radius is Chebyshev 4, not a damage multiplier. 031 keys off `isSummon` / `effectType`. 032 reuses `spell-weaken` metadata.

Remaining first-ship slices still unminted (do not mint until 031/032 are adopted, and do not remint if a later run already took them): 017 room-0 heal/resurge; 009 slime≠frozen; 006 `modifier_survivor` (live Blood Moon / Mirror Field); 005 `defensiveRetreat` after 028; 008 repeating mastery that is **not** `level_N`.
