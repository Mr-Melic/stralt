# Stralt expansion catalog — 2026-10-22

**Author:** Expansion Director (cron `0 */24 * * *`, automation `3f31b18f-a492-11f1-a7d1-d6b4613131ce`)  
**This run:** fourteenth catalog. Re-rank against `origin/main` `0f5363f` (`Merge pull request #332` — accepted-challenge HUD). Author-date on that tip is **2026-09-03**. Calendar: 2026-10-22.  
**Prior living catalog on `main`:** [`EXPANSION_PROPOSALS_2026-09-02.md`](./EXPANSION_PROPOSALS_2026-09-02.md) (`HEAD` then `58302bc`).  
**Unmerged sibling catalogs:** PR **#366** (09-21; 019/020), **#397** (09-22; 021/022), **#453** (09-23; 023/024), **#510** (09-24; 025/026), **#573** (09-25; 027/028), **#623** (09-26; 029/030), **#665** (09-27; 031/032), **#751** (09-28; 033/034), **#793** (09-29; 035/036), **#823** (10-21; 037/038) — same `HEAD`, still drafts. This file **adopts** 019–038 rather than reminting them.  
**Earlier catalogs on `main`:** [`EXPANSION_PROPOSALS_2026-09-01.md`](./EXPANSION_PROPOSALS_2026-09-01.md) (#192), [`EXPANSION_PROPOSALS_2026-08-31.md`](./EXPANSION_PROPOSALS_2026-08-31.md) (#118).  
**Gameplay / production code:** not modified.

All seventeen 08-31 / 09-01 / 09-02 cards remain **PROPOSED**. 019–038 remain **PROPOSED**. None shipped. None superseded. New IDs in this file are additive first-ship slices of already-ranked cards.

`README.md` still indexes the 09-01 catalog. Older open PRs own that file. This run does not touch `README.md` / `AGENTS.md` / `ARCHITECTURE.md` / `WorldExploration.tsx` / `mapGen.ts` / `challengeCompletion.ts` / `targeting.ts` / the 09-02 catalog / the 09-21…10-21 catalogs (#366 / #397 / #453 / #510 / #573 / #623 / #665 / #751 / #793 / #823).

Score used for ranking (unchanged):

```
SCORE = PLAYER_VALUE + TACTICAL_DEPTH + REPLAYABILITY + NOVELTY
      + INFINITE_PROGRESSION_COMPATIBILITY
      − IMPLEMENTATION_COMPLEXITY − REGRESSION_RISK − BALANCE_RISK
```

Each axis is 1–10. A proposal is only strong if it creates a **new player decision** and multiplies existing axes (family × relative level × variant × AI tier × spell pool × elite × composition × map × modifier) instead of adding another HP-scaled clone.

There is **no character level cap**. XP continues `100 * 2^(N-1)`. Encounter generation must keep a below / near / equal / above distribution via the existing tier spawn. Higher progression must add AI, kits, variants, elites, synergies, environment, and objectives — not only larger HP and damage.

---

## Delta since 2026-10-21

`main` did **not** move. #366 / #397 / #453 / #510 / #573 / #623 / #665 / #751 / #793 / #823 ranked the same `0f5363f`. Calendar gap since last Expansion Director file: **1 day**. No merge, no expansion implementation, no new `main` commit.

| Fact | Evidence |
| :--- | :--- |
| `main` still `0f5363f` | `git rev-list --count 0f5363f..origin/main` = **0**. Author-date 2026-09-03 02:28 +0200. Cards did not ship off-branch. Re-verified live hooks on this `HEAD`. |
| Queue grew; bottleneck is still merge | Open drafts vs `main`: **538** (TBC #833 counted 491 at 10-21 00:14Z). Newest at this writing **#869**. Oldest blockers unchanged: **#327** Striker AoE (`WX` / `targeting.ts` / `challengeCompletion.ts` / `enemyAI.ts`), **#331** portal destack (`mapGen`). Twin **#370** restacks the same Striker gate. |
| #823 still a draft | Adopt 037 / 038. Do not fight that PR on `EXPANSION_PROPOSALS_2026-10-21.md`. |
| Expansion bottleneck is merge, not missing IDs | 001–038 already specify ship-next. This run does **not** invent Wave-14 families and does **not** implement from #814. It mints the two remaining first-ship 005 slices that **#823 named and left unminted**. |
| Blood Moon / Mirror Field are **live** | Unchanged: `spellEngine.ts` **895** Blood Moon ×1.25 player non-heal damage; **901–907** Mirror Field 20% ST reflect. Registry hooks in `mapModifiers.ts` 260–277 remain empty. Gravity Well / Fog of War still unused (`WX` 2324–2326). |
| Slime ≡ Frozen | Both still `onMpCost: (c) => c * 2` (`mapModifiers.ts` 155–173). Dual-roll currently stacks to **4 MP/tile**. Two chips, one rule, until **033**. |
| Family paper stats lie twice | Overlay still multiplies HP/damage (`spawnPolicy.ts` 261–272). Battle start then **also** overwrites RES/SP/CHC via `computeEnemyStats` (`WX` 11898–11902) and HP via `calcEnemyMaxHp` (`WX` 11970–11974). PREREQ-H is identity-only, not “keep the overlay numbers.” |
| `inferArchetype` never returns `summoner` | Inference (`enemyAI.ts` 447–477) never emits it. Live summoner path is the `isSummoner` flag (`WX` 11932–11942). 023 must keep that flag. Healer if `healAmount > 0` **or** `spellType === "heal"` (`enemyAI.ts` 449–452). |
| 019 without PREREQ-F is a trap | Band-1 queens gain `starter-heal` and become healers. **Ship 019 with F in the same PR.** |
| Register is lore | Per-row copy still mismatches the three live hooks. 014 must not convert the register into a bestiary. |
| No live elite token | `isElite` has **zero** matches under `src/frontend/src`. 025 (`shielded`) is still the first token; 032 is the second (`hexer`). This run does **not** mint a third elite while those two are unshipped. |
| `combinedMechanic` still copy | `useBossRush.ts` 19–135. Zero engine readers. Room 0’s advertised heal/resurge is **034**. |
| Nine challenges still numeric | `challengeCompletion.ts` 11–20. 020 / 030 / 031 wait on **#327**. This run does **not** mint `modifier_survivor` or `interrupt_channels`. |
| LoS reposition is **global**, not gated | `repositionForLOS` (`enemyAI.ts` 749–768) runs whenever `AI_LOS_REPOSITION_ENABLED` is true (`gameConstants.ts` 245 — globally on). Call sites: `decideCaster` 974, `decideGeneric` 1555, **and** player/enemy `decideSummonArcher` 2272. `ENEMY_AI_TIER_GATES.escapeRoute` is **6** (`gameConstants.ts` 206) and has **zero** readers. `escapeRouteTriggered` is an unused `Enemy` field (`gameTypes.ts` 340) — do not start persisting it. **039** gates only the two enemy-archetype sites. |
| Lethal lookahead is **global**, not gated | `applyLethalLookahead` (`enemyAI.ts` 727–736) runs whenever `AI_LETHAL_LOOKAHEAD_ENABLED` is true (`gameConstants.ts` 224 — globally on). Enemy-archetype sites: caster 955, charger 1200, flanker 1339, berserker 1430, generic 1537 / 1585. Summon-kit sites: `decideSummonHunter` 1942 / 1962. `ENEMY_AI_TIER_GATES.instantKill` is **9** (`gameConstants.ts` 203) and has **zero** readers. **040** gates only the enemy-archetype sites. Do **not** add a new execute formula. |
| Erratic / betrayal already have magic numbers in WX | Leader-death erratic at `WX` **15508** (`aiTier >= 5`); 5% betrayal at `WX` **15595** (`aiTier >= 10`). Those match `ENEMY_AI_TIER_GATES.erratic` / `betrayal` but do **not** read the constant. Do **not** mint a WX restack while **#327** owns the file. |
| Overkill spill still global | `applyOverkillSpread` (`enemyAI.ts` 695–718) is on whenever `AI_OVERKILL_SPILL_ENABLED` is true. Natural later 005 slice (`bottleneckControl`: 8) — **unminted** this run. |
| Telemetry still none | TBC on `main` is 09-02 `WAITING_FOR_TELEMETRY`. Open **#833** (10-21) still waiting. 0 collectors / 0 rows. Do not claim live demand. Do not retune XP, Doka, or spawn weights. |
| Engineering-health on `main` | Last landed reports: `MASTER_ROADMAP.md` / LONG_HORIZON / CDA / PXA / QUALITY_AUDIT dated **2026-08-30…09-02**. 09-21…10-21 MTD / CDA / PX / LHIPS / WDD / TBC are still drafts. Same-hour 10-21 **#814** MTD plus 10-22 flock are another Hold. Accept code claims that match this checkout; do not implement from those roadmaps. Later Wave-12/13 sheets remain **Hold**. |
| Integrity flock is sidecar-heavy | Weekly changelog **#712** (W39) and 10-21 persist/combat drafts (#842–#869 class) keep extracting helpers that WX does not call. Expansion must not add another unwired sidecar. 039 / 040 wrap **existing** helpers that already have call sites. |
| Kit band still NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WX` **11920**. `levelZone` is `{ name, minLevel, maxLevel }` (`WX` **4683–4687**). `Math.floor(levelZone)` (`enemyAI.ts` **199**) → every `z >= 1` fails. Numeric `setCurrentZoneTier` exists at 4680 and is **not** passed in. |
| Family still a sticker | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286). Chassis stays a random chess piece. Four mute families. Three live hooks only: ember melee burn / tide melee −1 MP (`WX` 16789–16818); void_mirror 25% pre-crit reflect (`castHelpers.ts` 336–345). |
| Summoner is still a per-body coin flip | `WX` **11932–11942**: `0.12 + playerLevel * 0.02`, 50/50 wolf or archer. Can mark every enemy a summoner. |
| Push / pull still unused | `applyPushback` / `applyAttract` at `occupancy.ts` **482 / 537**. Callers: tests only. WX occupancy import does not name them. |
| `worldFeatures` still tests-only | 1913 lines, 52 `WF-*` rows. Ember Vein authored (`WF-HAZ-EMBER_VEIN`, `hpTaxPctOfMax: 0.04`; catalog also lists `extraHazardCount` 3–6 — **027 forbids the spray**). Glyph Plate authored (`WF-TRP-GLYPH_PLATE`, `hpTaxPctOfMax: 0.08`; catalog also lists `extraHazardCount` 1–2 — **038 forbids the spray**). No WX import. |
| Unused AI gates still unused | `ENEMY_AI_TIER_GATES` (`data/gameConstants.ts` 200–209) has **zero** readers in `enemyAI.ts` except a comment at 1422. 028 is the first gate; 036 is the second; 037 is the third (`groupTactics`); **039** is the fourth (`escapeRoute`); **040** is the fifth (`instantKill`). |
| Surfaces | `WorldExploration.tsx` 19,213; `mapGen.ts` 1,937; `enemyAI.ts` 2,580; `AdminDashboard.tsx` 8,280; `main.mo` 3,903; `worldFeatures.ts` 1,913. EOP chain `check-limit = 5`; GameKey on frozen `20260901`. |

Practical XP horizon: unchanged. Mid-teens exhaust intended income; level 25 is ~1.678e9 XP. Not a level cap. Do **not** retune the curve as expansion. Content must work at **1–20** and stay valid if someone is still climbing. High `ENEMY_AI_TIER_GATES` values (escapeRoute 6 → enemy level 151–250; instantKill 9 → 601–900) appear in the 1–20 band only via the existing 30% `computeAITier` variance (`combatMath.ts` 48–50). That noise is the low-level tell. Do not lower the authored gates to “fix” 1–20 rarity.

---

## Sibling designs (owned surfaces — do not duplicate)

| Sheet | Owns | Director card it details |
| :--- | :--- | :--- |
| [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) | Wave 1 family sheets, variant floors, pack recipes | 001, 002, 004, 014, 021, 023, 025, 032 |
| Wave 2–13 elite / family / SDE / WDD sheets (open drafts through **#869**) | More family / discovery / `WF-*` ids | **Hold** until 001/014/018/019/021/027 exist |
| [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) | Observe → win → unlock; Wave 1 pool | 003 |
| [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md) | `ownedSpellIds` / `observedSpellIds` persist types | 003 persist (PREREQ-J) |
| SPELL_PROPOSALS 08-31…09-02 + later drafts | Tactical gap-fill ids | **Hold** until 003 ships |
| [`ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md) + later increments | Unbounded AI modules | 005, 028, 036, 037, **039**, **040** |
| [`BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md) + later Rush tables | Boss sheets / Rush Tables | 011, 017, 034 |
| ENCOUNTER_EVOLUTION 08-31…09-02 + later drafts | Teach → pressure dungeon beats | 007, 010, 026 |
| [`WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `engine/worldFeatures.ts` + later WDD drafts | Rarity / relative-difficulty overlay | 009, 016, 022, 024, 027, 029, 033, 038 |
| ENEMY_FORMATIONS 08-31…09-02 + later drafts | Synergy packs | 004, 023 |
| [`MECHANIC_INTERACTION_MATRIX_2026-09-02.md`](./MECHANIC_INTERACTION_MATRIX_2026-09-02.md) + later MIMA drafts | Live join gaps | 013, 018, 024, 029, 038 × 018 |
| [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) (on `main`: 09-02) + later MTD drafts | P0 integrity before expansion PRs | Process, not content |
| [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) + later PX drafts | Register / modifier / discovery honesty | 014 QA; Register is lore; 033 honesty |
| [`LONG_HORIZON_2026-09-02.md`](./LONG_HORIZON_2026-09-02.md) + later LHIPS drafts | XP wall; kit NaN; summoner saturate | PREREQ-A/B/C; do not retune curve |
| [`CONTENT_DIVERSITY_AUDIT_2026-09-02.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-02.md) + later CDA drafts | Live spawn is sticker + NaN kits; Blood Moon live; no elites; Slime≡Frozen | Confirms 001/014/019/021/022/023/025/032/033 |
| [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) + open **#833** | STATUS WAITING_FOR_TELEMETRY | No demand claims |
| Unmerged **#366** … **#823** | 09-21…10-21 rankings + 019–038 | Adopted here |

Implementers pick **one** director ID. Follow the sibling sheet for that ID. Do not open a second family / discovery / boss catalog. Do not land Wave 2+ data before the Wave 1 card it multiplies. Full verbatim cards for 001–028 live on **#573**; 029 / 030 on **#623**; 031 / 032 on **#665**; 033 / 034 on **#751**; 035 / 036 on **#793**; 037 / 038 on **#823**. This file restates scores and ship rules, and authors **039 / 040** in full.

---

## Current-state inventory (re-verified on `0f5363f`)

### Progression (no character level cap)

- XP curve is unbounded: `100 * 2^(N-1)` (`utils/xpCurve.ts`). HUD saturates `xpForNextLevel` at `Number.MAX_SAFE_INTEGER` from level 48; persist stays bigint / Motoko `Nat`.
- Enemy levels use `pickEnemyLevelFromTiers` (`engine/combatMath.ts` 54–107): default weights 60% same tier / 20% ±1 / 10% ±2 / leftover ±3..6. This **already** produces below / near / equal / above the player. Keep it.
- Hidden utility clamp: `maxTier = Math.floor(999 / ts)` at `combatMath.ts` 58. Past player level ~1000 the distribution stops climbing. `threeOrMorePercent` is **not read** (leftover `_threeMore` fills the bucket). Admin still edits the field.
- `computeAITier` (`combatMath.ts` 36–51) plateaus at 10 after enemy level 900, with a 30% full-random roll. Plateau is acceptable **if** tier 10 keeps unlocking mechanics, not more HP.

### Enemies

- Seven families typed (`types/gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`.
- Spawn writes a random chess piece, then `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289+, `WX` 5864) rolls 30% and multiplies paper HP / damage / RES / SP. Catalog `ap` / `mp` still unused. **Family does not force `pieceType`.**
- Battle start then **re-rolls** `sp` / `sr` / `init` / `res` / `chc` from `computeEnemyStats` (`WX` 11898–11902) and sets combat HP from `calcEnemyMaxHp(level)` (`WX` 11970–11974). **Family HP, RES, and SP never reach the fight.** No `isElite` / champion token.
- Three live combat hooks only: `ember_knight` melee burn and `tide_shade` melee −1 MP (`WX` 16789–16818); `void_mirror` 25% pre-crit reflect (`castHelpers.ts` 336–345). The other four families are art + dead paper.
- Piece-type kits exist (`engine/enemyAI.ts` 163–185) and grow at zone 1 / 2. Battle start still passes the LevelZone **object**. **Every overworld enemy is stuck on the one-spell zone-0 kit.**
- `inferArchetype` (`enemyAI.ts` 447–477) returns `"healer"` if any assigned spell has `healAmount > 0` or `spellType === "heal"`. The union includes `summoner`; inference **never returns it**. Live summoner path is `enemy.isSummoner` → `decideSummonerAction`.
- `ENEMY_AI_TIER_GATES` (`data/gameConstants.ts` 200–209) names `erratic`, `groupTactics`, `instantKill`, `betrayal`, `chokepointCamp`, `escapeRoute`, `bottleneckControl`, `defensiveRetreat`. **Zero references in `enemyAI.ts`** except a comment at 1422. Caster / flanker / generic already retreat below 30% HP **ungated**. Healer interpose is **ungated**. LoS reposition and lethal lookahead are **ungated**. Master AI toggles (overkill spill, backline protect) are **global on**. WX already magic-number-gates erratic at 5 and betrayal at 10.
- Summoner chance is `0.12 + playerLevel * 0.02` (`WX` 11932–11942; constants `gameConstants.ts` 298–299). Saturates by mid-40s **and** can fire per body. `ENEMY_SUMMON_CAP = 2` contains the board, not the pack.

### Spells / discovery

- Frontend catalog: 32 ids in `data/spellData.ts`. Every `starterSpells` entry is `isBaseSpell: true` (`WX` 2395–2407). No observe / kill / achievement / elite unlock path.
- Five summon spells already carry `isSummon: true`. 031 keys off that metadata, not the name string.
- Backend `defaultSpells()` is a different six-spell set. Dual catalogs.
- Targeting is metadata-driven (`isTileCastableLive`). New spells must stay on that contract.
- `applyPushback` / `applyAttract` have tests and **no** production callers. `void_collapse` still advertises pull.
- `spell-slow` (`spellData.ts` 354) is reserved for 033. `spell-weaken` (`spellData.ts` 334) is reserved for 032. `spell-mark` (`spellData.ts` 161) stays available for later elites — do not spend it in this run.

### Combat / world / dungeons / bosses

- 22 map modifiers. **Live in engine, empty in registry:** `blood_moon`, `mirror_field`. **Still unused:** `gravity_well`, `fog_of_war`. **Duplicate live hook:** `slime_flood` ≡ `frozen_terrain` (both MP×2). `titans_vigor` still +1000 HP and 1–5× damage.
- `engine/worldFeatures.ts`: 52 `WF-*` rows, tests only, **no production caller**.
- Seven map archetypes. `mapGen.ts` stays frozen. Open **#331** owns destack.
- Dungeon chain is linear 3–5 maps. Depth extras are more bodies + tier boost (`spawnPolicy.ts` 27–28). No special rooms, no forks.
- 19 bosses, two phases. Boss Rush `combinedMechanic` is copy only. Room 0 (`pale_archbishop` + `weeping_pawn`, `useBossRush.ts` 25–35) already names the teach puzzle.
- Challenges: nine numeric predicates (`challengeCompletion.ts` 11–20). Open **#327** owns this file.
- Achievements: 15 one-shots (`admin.mo` 309–325). `unstoppable` / `level_10` is a capped milestone. Rewards are Doka, never a spell. New condition keys must join `KNOWN_ACHIEVEMENT_CONDITIONS` (`adminSafety.ts` 306–322) or GameConfig seed rejects them.

### Engineering-health constraints

- No player telemetry. Do not claim live demand. Do not retune from `longHorizonSim`. Last TBC inspection (#833) is still `WAITING_FOR_TELEMETRY`.
- New behavior belongs in `src/frontend/src/engine/*` or `src/frontend/src/utils/*` with tests; WX gets one-line wiring. **Do not grow WX while #327 is open.**
- Do not touch RAF, **map generation**, turn logic, or damage math (`AGENTS.md`). **Do not edit `mapGen.ts` while #331 is open.**
- Credits still go through `applyRewards`; spends / death through `saveBattleStats` on `createProgressPersist`. No second reward funnel. Feats grant Doka via `claimAchievementReward` on that lock — **never XP**.
- Discovery that writes ownership must enqueue on the persist lock **and** use PREREQ-J (a **new later** migration file after frozen `20260901`).
- Caffeine import gate + oldest-first stack-compat are CI.
- Client-trusted canister writes remain an architecture decision (AQA-2026-08-30-008), not an expansion.
- Do not add another unwired sidecar. 039 / 040 wrap helpers that already run.

---

## Prerequisites (not expansions — fix or respect before shipping content)

| ID | Finding | Why it blocks infinite / combinatorial content | Status |
| :--- | :--- | :--- | :--- |
| PREREQ-A | `buildEnemyKit(..., currentMap.levelZone)` passes `{ name, minLevel, maxLevel }`; kits never leave zone 0 (`WX` 11920, `enemyAI.ts` 199, zone object `WX` 4683–4687) | Spell-pool depth is implemented and dead. Pass a **number**. Prefer 019’s relative band `R = enemy.level − player.level`. | **OPEN** |
| PREREQ-B | `pickEnemyLevelFromTiers` clamps at 999 (`combatMath.ts` 58). `threeOrMorePercent` unread | High-level players stop seeing above-level enemies. Remove the 999 ceiling; keep the existing weight math; actually use the fifth percent. | OPEN |
| PREREQ-C | Summoner chance uses raw `characterStats.level` (`WX` 11932–11942) | Saturates by the mid 40s **and** can fire on every body. Couple with 023. Keep `ENEMY_SUMMON_CAP`. | OPEN — **couple with 023** |
| PREREQ-D | Do not grow `WorldExploration.tsx` (19,213 lines). Open **#327** owns the file. | Family / elite / discovery tables must live in engine modules. | OPEN |
| PREREQ-E | Persist drafts #183 / #180 | Discovery was racing death-replay and live-Doka PRs. | **CLOSED** (merged 2026-09-01) |
| PREREQ-F | `inferArchetype` treats any `healAmount > 0` as healer (`enemyAI.ts` 449–452) | Drain / lifesteal family rows become healers. **019 must not ship without this.** | OPEN — **couple with 019** |
| PREREQ-H | Battle start overwrites family HP via `calcEnemyMaxHp` **and** overwrites RES/SP/CHC via `computeEnemyStats`. `applyEnemyFamilyStats` still multiplies paper HP first. | The 30% family roll is a lie even as stat flavor. Stamp **identity** in `spawnPolicy`. Natural union with 021. | OPEN — **couple with 021** |
| PREREQ-I | Motoko GameKey EOP **#259** was the oldest open PR | 003 persist could not land in the same queue. | **CLOSED** (#259 gone; GameKey is `20260901_000000` on `main`) |
| PREREQ-J | Any new persistent `let`/`var` on `main.mo` (including `ownedSpellIds` / `observedSpellIds`) | Must be a **new later** chain file after frozen `20260901` (`OldActor = {}`). Wait for Caffeine deploy confirmation of the GameKey tail. | **OPEN** |

PREREQ-G (dual frontend / Motoko spell catalogs) stays a hygiene note, not a ship-blocker.

---

## Ranked opportunities

| Rank | EXPANSION_ID | Title | Category | SCORE | Priority | vs 10-21 |
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
| 10 | EXP-2026-09-27-031 | First unused challenge: `no_summons` | PROGRESSION | 26 | P0 | adopted |
| 11 | EXP-2026-09-21-019 | Relative kit-band adapter (unlock authored piece kits) | ENEMIES | 25 | P0 | adopted; **must ship with F** |
| 12 | EXP-2026-09-22-021 | Family-preferred chassis overlay | ENEMIES | 25 | P0 | adopted; **ship with PREREQ-H** |
| 13 | EXP-2026-09-23-023 | One summoner slot per pack | ENEMIES / AI | 25 | P1 | adopted |
| 14 | EXP-2026-09-27-032 | Second elite token: `hexer` | ENEMIES | 25 | P1 | adopted |
| 15 | EXP-2026-10-22-039 | Gate LoS reposition on `escapeRoute` | AI | 25 | P2 | **new** — fourth 005 slice |
| 16 | EXP-2026-09-02-018 | Wire push / pull on existing ids | COMBAT | 24 | P1 | same |
| 17 | EXP-2026-08-31-010 | Optional tactical objectives | COMBAT | 24 | P1 | same |
| 18 | EXP-2026-09-25-027 | First world feature: Ember Vein tile | WORLD | 24 | P2 | adopted |
| 19 | EXP-2026-10-21-037 | Gate healer interpose on `groupTactics` | AI | 24 | P2 | adopted |
| 20 | EXP-2026-10-21-038 | First Glyph Plate trap (one cell) | WORLD | 24 | P2 | adopted |
| 21 | EXP-2026-09-28-033 | Differentiate Slime Flood from Frozen Terrain | WORLD | 24 | P2 | adopted |
| 22 | EXP-2026-10-22-040 | Gate lethal lookahead on `instantKill` | AI | 24 | P2 | **new** — fifth 005 slice |
| 23 | EXP-2026-09-24-026 | First side objective: `contest_shrine` | COMBAT | 23 | P1 | adopted |
| 24 | EXP-2026-08-31-008 | Uncapped achievement / mastery ladder | PROGRESSION | 23 | P2 | same; first slice is 035 |
| 25 | EXP-2026-08-31-013 | Explicit spell-interaction layer | COMBAT | 23 | P2 | 018 first |
| 26 | EXP-2026-09-01-016 | Wire `worldFeatures` overlay (no mapGen rewrite) | WORLD | 23 | P2 | same; 027 first, then 038 |
| 27 | EXP-2026-09-29-035 | Repeating Ember Knight slayer (not `level_N`) | PROGRESSION | 22 | P2 | adopted |
| 28 | EXP-2026-09-23-024 | Wire Gravity Well via existing attract | WORLD | 22 | P2 | adopted |
| 29 | EXP-2026-09-25-028 | First AI gate: `chokepointCamp` | AI | 22 | P2 | adopted |
| 30 | EXP-2026-09-26-029 | First unused modifier: Fog of War vision cap | WORLD | 22 | P2 | adopted |
| 31 | EXP-2026-09-28-034 | Honor Rush room 0 `combinedMechanic` | BOSSES | 22 | P2 | adopted |
| 32 | EXP-2026-08-31-009 | Finish unused modifiers + combo-only world rules | WORLD | 21 | P2 | same; 024 then 029 then 033 |
| 33 | EXP-2026-08-31-005 | AI sophistication ladder (unused gates) | AI | 21 | P2 | same; 028, 036, 037, then **039**, then **040** |
| 34 | EXP-2026-08-31-007 | Dungeon room types without rewriting mapGen | DUNGEONS | 21 | P2 | wait for #331 |
| 35 | EXP-2026-09-02-017 | Honor Boss Rush `combinedMechanic` | BOSSES | 20 | P2 | first-room slice is 034 |
| 36 | EXP-2026-09-29-036 | Gate existing 30% retreat on `defensiveRetreat` | AI | 20 | P2 | adopted |
| 37 | EXP-2026-08-31-011 | Boss mechanic-pool scaling (not more HP) | BOSSES | 17 | P3 | same |
| 38 | EXP-2026-09-22-022 | Convert Blood Moon off ×1.25 damage | WORLD | 16 | P3 | adopted |
| 39 | EXP-2026-09-01-015 | Convert Titan's Vigor off +1000 HP | WORLD | 15 | P3 | same |

**Ship-next (not the same as SCORE):** **021 + PREREQ-H** → **014** → **PREREQ-A + 019 + PREREQ-F (one PR)** → **001** → **025** (after 021) → **032** (after 025; not the same PR as 025) → **023** (after #327) → **020** (after #327) → **030** (after #327; same `challengeCompletion.ts` as 020 — union) → **031** (after #327; same file as 020/030 — union) → **018** → **024** (after walk freeze / 018) → **027** (Ember Vein; no `mapGen` punch; one cell, ignore catalog `extraHazardCount`) → **038** (after 027; reuse 027’s one-cell placer; one Glyph Plate, ignore catalog `extraHazardCount`) → **026** (after #327; no `mapGen` punch) → **028** (tiny `aiTierGates.ts` helper) → **036** (after 028; same helper — union) → **037** (after 036; same helper — union; enemy healer only) → **039** (after 037; same helper — union; caster/generic only) → **040** (after 039; same helper — union; enemy archetypes only; no new execute) → **029** (after targeting freeze / #327) → **033** (after Frozen/Slime walk-parity freeze; registry + Slow commit) → **034** (new `bossRushPairHooks.ts`; wait if death dispatch restacks WX / #327) → **035** (after 014 so Ember is a readable hunt; whitelist + `victoryAchievements.ts`; wait if the fire path restacks WX / #327) → **003** (PREREQ-J) → 002/004 remainder.

SCORE ranks opportunity size. Ship-next ranks what creates a player decision **this week** without Motoko schema, without growing `enemyAI.ts` for content tables, and without racing open WX / mapGen / challenge / targeting / walk-occupancy PRs.

021 before 019 because band-0 kits already differ by piece type: coupling family → preferred chassis works **today**, lives in `spawnPolicy.ts`, and does not wait on #327. Bundle PREREQ-H in that same PR.

039 is the cheapest remaining unused-knob slice after 037: LoS sidestep is already coded and globally on. 040 is the cheapest remaining unused-knob slice after 039: one-turn lethal preference is already coded and globally on. This run does **not** mint a 006 predicate — 020 / 030 / 031 already queue on `#327`. This run does **not** mint a third elite — 025 / 032 are still unshipped. This run does **not** restack WX erratic/betrayal magic numbers.

Held this run (do not remint): 006 `modifier_survivor` / `interrupt_channels` / `only_observed_spell` (last needs 003). 005 `bottleneckControl` → overkill spill. 005 erratic / betrayal constant-wiring in WX (already `>= 5` / `>= 10` at 15508 / 15595; wait for #327). Third elite token. `void_mirror` slayer rungs. Creeping Ash. Rush rooms 1–9.

---

## New proposal cards (this run)

### EXP-2026-10-22-039

**TITLE:** Gate LoS reposition on `escapeRoute`  
**CATEGORY:** AI  
**PLAYER_OPPORTUNITY:** Read `aiTier` from **whether** a caster that is in range but LoS-blocked spends MP to peek, or just holds / walks closer without a shot. Low-tier casters waste the turn behind a pillar. High-tier casters sidestep onto the file.  
**MECHANIC:** Fourth 005 slice, after 028 / 036 / 037. `repositionForLOS` (`enemyAI.ts` 749–768) already walks up to `AI_LOS_REPOSITION_STEP_BUDGET` (2) steps when a spell is in range but LoS-blocked, whenever `AI_LOS_REPOSITION_ENABLED` is true (`data/gameConstants.ts` 245 — globally on). `ENEMY_AI_TIER_GATES.escapeRoute` is **6** (`gameConstants.ts` 206) and has zero readers. Wrap **only** the enemy-archetype call sites — `decideCaster` 974 and `decideGeneric` 1555 — with `shouldUseEscapeRoute(enemy.aiTier ?? 1)` in the `aiTierGates.ts` helper 028 introduces (union if 028 / 036 / 037 are not merged). Do **not** wrap `decideSummonArcher` (`enemyAI.ts` 2272) — that is the player **and** enemy archer kit, the same class of “do not gate summon kits” as 037 vs Sentinel / Wisp. Do not write `escapeRouteTriggered`. Do not change `AI_LOS_REPOSITION_STEP_BUDGET`. Do not encode `if (level >= X)`.  
**WHY_IT_IMPROVES_STRALT:** The brief prefers AI sophistication and positioning over HP. The sidestep **verb** already exists; it is not a progression curve. Today a zone-0 bishop and a tier-10 queen both peek around cover, so the player cannot read tier from geometry. Gating it is the cheapest remaining unused-knob slice after 037.  
**SYSTEMS_AFFECTED:** `engine/aiTierGates.ts` (028 / 036 / 037’s file) + tests with a deterministic `rng` fixture; two call sites in `enemyAI.ts` (`decideCaster`, `decideGeneric`). Prefer wrapping inside `repositionForLOS` with `if (ctx.enemy.isSummon) keep current` so a later caller cannot forget the summon skip. **Do not grow ENEMY_KITS or add family tables.** Do not edit turn-advance in WX. Do not restack `#327` beyond the existing enemyAI import.  
**INFINITE_PROGRESSION_BEHAVIOUR:** `computeAITier` already maps unbounded level → 1..10. Gate 6 is enemy level 151–250 in the table, plus the 30% uniform 1–10 roll (`combatMath.ts` 48–50). After 900, keep tier 10 and add **pack** recipes (004) instead of a tier 11 HP stat. A lucky low roll on a high-level caster is a readable “this one will not peek.” Do not “fix” that noise in this PR. Do not lower `escapeRoute` to make peeking common at 1–20. Later 005 slice (`bottleneckControl` → overkill spill) stays unminted.  
**IMPLEMENTATION_APPROACH:** One helper: `shouldUseEscapeRoute(aiTier: number): boolean => aiTier >= ENEMY_AI_TIER_GATES.escapeRoute`. Keep `AI_LOS_REPOSITION_ENABLED` as the master kill-switch **and** the tier gate. Same `(enemy, ctx, rng)` ⇒ same `EnemyAction` in fixtures except the `intent: "reposition-los"` branch. 028 may land first with only `chokepointCamp`; 036 adds `shouldDefensiveRetreat`; 037 adds `shouldUseGroupTactics`; this PR unions the fourth function into that file.  
**BALANCE_CONSIDERATIONS:** Band-0 / `aiTier` 1–5 casters become **less** able to shoot from cover (they no longer spend 1–2 steps to peek). That is intended readability, not a damage nerf. They still cast when LoS is already clear, and they still `findNearestLegalCastTile` when out of range. Do not also disable lethal lookahead or overkill spill here. Do not make healers peek (healer fallback already goes through `decideCaster` — if that path hits 974, the gate applies; do not special-case it).  
**QA_REQUIREMENTS:** `aiTier` 1–5 caster in range, LoS blocked, does **not** emit `intent: "reposition-los"` (falls through to the existing advance / hold). `aiTier` 6+ still peeks when a reachable LoS tile exists within 2 steps. Clear-LoS cast path is unchanged at every tier. Player Archer / enemy-summoned Archer still repositions with the master toggle alone. Frozen/Slime walk cost unchanged (`enemyWalkMp.ts`). `escapeRouteTriggered` stays unused. Focus-fire / lethal lookahead still global until 040.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 7 | 5 | 3 | 6 | 4 | 10 |

**What new decision does this create?** “The bishop sidestepped onto the file — this caster will peek. Do I hold cover against the low-tier one that is just walking, or break LoS / body-block the high-tier peek?”

---

### EXP-2026-10-22-040

**TITLE:** Gate lethal lookahead on `instantKill`  
**CATEGORY:** AI  
**PLAYER_OPPORTUNITY:** Read `aiTier` from **whether** a pack finishes a wounded body this turn or greedy-fires the nearest threat. Low-tier enemies pad the tank. High-tier enemies snipe the 1-HP summon / player.  
**MECHANIC:** Fifth 005 slice, after 039. `applyLethalLookahead` (`enemyAI.ts` 727–736) already prefers a scored target whose current HP is `<= estimateDamage(spell)` whenever `AI_LETHAL_LOOKAHEAD_ENABLED` is true (`data/gameConstants.ts` 224 — globally on). `ENEMY_AI_TIER_GATES.instantKill` is **9** (`gameConstants.ts` 203) and has zero readers. Wrap **only** the enemy-archetype call sites — `decideCaster` 955, `decideCharger` 1200, `decideFlanker` 1339, `decideBerserker` 1430, `decideGeneric` 1537 / 1585 — with `shouldUseInstantKill(enemy.aiTier ?? 1)` in the same `aiTierGates.ts` helper. Do **not** wrap `decideSummonHunter` (`enemyAI.ts` 1942 / 1962) — wolf kit, same summon skip as 037 / 039. Do **not** add a new execute formula, a new damage type, or a true one-shot. Do not change `estimateDamage`. Do not encode `if (level >= X)`.  
**WHY_IT_IMPROVES_STRALT:** The brief prefers AI sophistication and target selection over HP. The finish-the-wounded **verb** already exists; `instantKill: 9` is not a license to mint a new kill spell. Today every archetype clinical-finishes, so the player cannot read tier from focus. Gating it is the cheapest remaining unused-knob slice after 039.  
**SYSTEMS_AFFECTED:** `engine/aiTierGates.ts` + tests; enemy-archetype sites in `enemyAI.ts` listed above. Prefer wrapping inside `applyLethalLookahead` with `if (ctx.enemy.isSummon) keep current` so a later caller cannot forget the summon skip. **Do not grow ENEMY_KITS.** Do not edit `combatMath.ts` damage. Do not restack `#327` beyond the existing enemyAI import. Do not touch WX 15508 / 15595 (erratic / betrayal).  
**INFINITE_PROGRESSION_BEHAVIOUR:** Gate 9 is enemy level 601–900 in the table, plus the 30% uniform 1–10 roll. In the practical 1–20 band that is a **rare** tell (~6% of enemies if variance is 30% × 2/10), not a default. That is intended: clinical finishers become the high-band / lucky-roll spice, then the default after 600. Do not lower `instantKill` to 3 so 1–20 fights stay lethal. After 900, keep tier 10 and add pack recipes (004) instead of a tier 11 execute. Later 005 slice (`bottleneckControl` → `applyOverkillSpread` at 695) stays unminted.  
**IMPLEMENTATION_APPROACH:** One helper: `shouldUseInstantKill(aiTier: number): boolean => aiTier >= ENEMY_AI_TIER_GATES.instantKill`. Keep `AI_LETHAL_LOOKAHEAD_ENABLED` as the master kill-switch **and** the tier gate. When the gate fails, return `scored[0]` (greedy). Same fixtures except the chosen `targetId` when a non-top scored target is the only lethal one. 039 may land first; this PR unions the fifth function into `aiTierGates.ts`.  
**BALANCE_CONSIDERATIONS:** Band-0 / `aiTier` 1–8 enemies become **less** clinical (they pad the front body). That is intended readability, not a damage buff. High-tier / lucky-roll enemies become the ones that punish a 1-HP Wisp left in LoS. Do not also disable overkill spill here (that is 005 remainder). Do not exempt berserkers — 036 left berserkers press-only; lookahead is a target-choice, not a retreat. Do not change HP, ATK, or `estimateDamage`.  
**QA_REQUIREMENTS:** `aiTier` 1–8 caster with two in-range targets (front 20 HP, back 1 HP, spell dmg 8) still fires the top-scored front body. `aiTier` 9+ with the same board fires the 1-HP body. Hunter / wolf kit still finishes with the master toggle alone. Healer interpose / retreat / LoS peek unchanged except via their own gates. Frozen/Slime walk cost unchanged. No new spell id. No change to `calcEnemyMaxHp` / player HP. Betrayal 5% and erratic hop still use the WX magic numbers until a later #327-safe constant-wire.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 7 | 5 | 3 | 6 | 5 | 10 |

**What new decision does this create?** “The queen looked past the tank — this pack finishes. Do I hide the wounded Wisp / step the 1-HP player off the file, or ignore the low-tier bishop that is still padding the front?”

---

## Adopted cards (019–038 and 001–018) — do not remint

Verbatim implementation cards for 001–028: [`EXPANSION_PROPOSALS_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-622d/docs/automation/EXPANSION_PROPOSALS_2026-09-25.md) on PR **#573**. 029 / 030: [`EXPANSION_PROPOSALS_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-6356/docs/automation/EXPANSION_PROPOSALS_2026-09-26.md) on PR **#623**. 031 / 032: [`EXPANSION_PROPOSALS_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-c43e/docs/automation/EXPANSION_PROPOSALS_2026-09-27.md) on PR **#665**. 033 / 034: [`EXPANSION_PROPOSALS_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-728b/docs/automation/EXPANSION_PROPOSALS_2026-09-28.md) on PR **#751**. 035 / 036: [`EXPANSION_PROPOSALS_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-05ea/docs/automation/EXPANSION_PROPOSALS_2026-09-29.md) on PR **#793**. 037 / 038: [`EXPANSION_PROPOSALS_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-47ba/docs/automation/EXPANSION_PROPOSALS_2026-10-21.md) on PR **#823**. Scores and ship rules below are unchanged unless this table says so.

| ID | Title | SCORE | Ship note |
| :--- | :--- | ---: | :--- |
| 001 | Family role kits | 30 | After 021, 014, A+019+F |
| 006 | Mechanic challenge catalog | 29 | First predicate 020; second 030; third 031; remainder still unminted |
| 020 | `kill_leader_last` | 29 | After #327; do not remint |
| 014 | Mute-family combat hooks | 28 | Register stays lore |
| 002 | Elite / champion tokens | 28 | First token 025; second 032; no third token this run |
| 004 | Pack role composition | 28 | First slot 023 |
| 025 | Elite `shielded` | 27 | After 021; not +HP; not the same PR as 032 |
| 003 | Observed-spell discovery | 27 | PREREQ-J later migration |
| 030 | `no_hazard_steps` | 26 | After #327; 027 Ember Vein and 038 Glyph Plate already name it |
| 031 | `no_summons` | 26 | After #327; keys off `isSummon` / `effectType` |
| 019 | Relative kit-band adapter | 25 | **One PR with A+F** |
| 021 | Family-preferred chassis | 25 | **One PR with H**; `spawnPolicy.ts` only |
| 023 | One summoner slot per pack | 25 | Keep `isSummoner` flag |
| 032 | Elite `hexer` | 25 | After 025; Weaken-on-first-spell via `spell-weaken` |
| 018 | Wire push / pull | 24 | First slice of 013; 038’s shove-onto-plate combo |
| 010 | Optional tactical objectives | 24 | First slice 026 |
| 027 | Ember Vein tile (4% max-HP tax, **one** cell) | 24 | First slice of 016; ignore catalog `extraHazardCount` |
| 037 | Gate healer interpose on `groupTactics` | 24 | After 036; `decideHealer` 1137–1163 only |
| 038 | Glyph Plate (8% one-shot, **one** cell) | 24 | After 027; ignore catalog `extraHazardCount` |
| 033 | Slime ≠ Frozen | 24 | Drop slime `onMpCost`; Slow via `spell-slow` |
| 026 | `contest_shrine` | 23 | No mapGen punch |
| 008 | Uncapped mastery ladder | 23 | First slice is 035; no `level_N` endgame feats |
| 013 | Explicit spell-interaction layer | 23 | After 018 |
| 016 | Wire `worldFeatures` | 23 | 027 first, then 038; freeze new `WF-*` until those live |
| 035 | Ember slayer 5/15/40 | 22 | After 014; whitelist + victory helper; Doka on claim |
| 024 | Gravity Well via attract | 22 | After walk freeze / 018 |
| 028 | AI gate `chokepointCamp` | 22 | Extract `aiTierGates.ts`; do not grow `enemyAI` tables |
| 029 | Fog of War Chebyshev-4 vision/cast cap | 22 | After targeting freeze / #327 |
| 034 | Rush room 0 pair hooks | 22 | `pale_archbishop` / `weeping_pawn`; rooms 1–9 stay copy |
| 009 | Finish unused modifiers | 21 | 024 then 029 then 033; Gravity/Fog still unused |
| 005 | AI sophistication ladder | 21 | 028, 036, 037, then **039**, then **040**; do not encode `if (level >= X)` |
| 007 | Dungeon room types | 21 | Wait for #331; no mapGen rewrite |
| 017 | Honor Rush `combinedMechanic` | 20 | First slice is 034 (room 0 only) |
| 036 | Gate 30% retreat on `defensiveRetreat` | 20 | After 028; caster/flanker/generic only; berserker press-only |
| 011 | Boss mechanic-pool scaling | 17 | After 017 / 034 |
| 022 | Convert Blood Moon off ×1.25 | 16 | Honesty, not a fifth damage reskin |
| 015 | Convert Titan's Vigor off +1000 HP | 15 | Anti-pattern still live |

---

## Do not re-propose

- Stat-only new enemy ids (including Register-lore Crimson Spawn / Shadow Lurker / Storm Caller).
- Wave 2+ families / SPELL_PROPOSALS ids / Wave-12/13 WDD rows before 021/014/019+F/018/003/027.
- A fifth reflect.
- `level_N` endgame achievements (035 is count rungs, not `level_50`).
- mapGen rewrites or a second recap/persist funnel.
- Motoko Character schema by editing frozen `20260831` / `20260901` NewActors.
- Reminting **001–038**.
- Reminting Fog as a new modifier id (the id is `fog_of_war`).
- Reminting `kill_leader_last` (020), `no_hazard_steps` (030), or `no_summons` (031).
- Reminting Ember Vein, Glyph Plate, `shielded`, `hexer`, `contest_shrine`, `chokepointCamp`, Gravity Well, the summoner pack slot, Slime≠Frozen, Rush room 0, healer-interpose gating, or LoS/lookahead as new verbs (they already exist).
- A fourth 006 predicate while 020/030/031 are still queued on #327.
- A third elite token while 025/032 are unshipped.
- XP-curve retune as expansion.
- ExtraHazardCount spray for Ember Vein, Fog, or Glyph Plate.
- A melee hexer that invents a new stun. 032 is Weaken-on-first-**spell**.
- Name-based “Summon” / “Slow” / “Ember Knight” string matching for 031 / 033 / 035.
- Keeping slime `onMpCost` while adding Slow (that would still be a duplicate tax).
- Rush rooms 1–9 in the same PR as 034.
- Lowering `ENEMY_RETREAT_HP_PCT` in 036, or making berserkers retreat.
- Gating player-side Sentinel / Wisp interpose in 037.
- Gating `decideSummonArcher` in 039 or `decideSummonHunter` in 040.
- Lowering `escapeRoute` / `instantKill` so 1–20 fights keep global peek / finish.
- Treating `instantKill: 9` as a license to add a new execute formula. 040 only gates existing lookahead.
- Writing `escapeRouteTriggered` as a persist / recap flag.
- Restacking WX 15508 / 15595 (erratic / betrayal) while #327 is open.
- Granting XP from 035 (Doka on claim only).
- A new persistent kill-count field on `Character` for 035.
- Creeping Ash (moving lane) before 027 + 038 + 018 exist.

---

## Recommended combinatorial target

Once 001+002+003+004+009/016+018 are live (with 021/014/019/025/032/033/034/035/036/037/038/039/040 as the first slices):

```
family × relative band × piece variant × aiTier × kit band × elite token
  × pack role × map archetype × map modifier × world feature × displacement verb
  × Rush pair hook × repeating family-slayer rung
  × healer-interpose / retreat / LoS-peek / lethal-finish readability
```

That is still the expansion plan. Not a hundred near-identical enemies. Not larger HP.

---

## Next Expansion Director run

Re-rank against `main`. Mark cards SHIPPED/SUPERSEDED only when production code on `main` matches. Do not silently rewrite history. Production code stays untouched unless a later human/orchestrator picks an ID. Skip README if an older open PR still owns it. Do not restack WX / `challengeCompletion` / `targeting` while #327/#370 are open, or `mapGen` while #331 is open. Do not remint **019–040**. Blood Moon/Mirror Field are live in `spellEngine.ts`, not stubs. Slime≡Frozen until 033 ships. 021 ships with PREREQ-H; 019 ships with PREREQ-F. Family overlay RES/SP also die at battle start. `inferArchetype` never returns `summoner`. Ember Vein tax is `hpTaxPctOfMax: 0.04`, not 10%, and 027 is **one cell**. Glyph Plate tax is `hpTaxPctOfMax: 0.08`, and 038 is **one cell** (ignore catalog `extraHazardCount` 1–2). Fog radius is Chebyshev 4, not a damage multiplier. 031 keys off `isSummon` / `effectType`. 032 reuses `spell-weaken` metadata. 033 reuses `spell-slow` metadata and **drops** slime `onMpCost`. 034 is room 0 only (`pale_archbishop` / `weeping_pawn`). 035 is Ember count rungs 5/15/40, whitelist + victory helper, Doka on claim. 036 gates the three existing 30% retreat sites on `aiTier >= 3`. 037 gates **only** enemy `decideHealer` interpose on `aiTier >= 4`. 038 reuses 027’s overlay placer. 039 gates **only** enemy caster/generic LoS reposition on `aiTier >= 6` (not Archer). 040 gates **only** enemy-archetype lethal lookahead on `aiTier >= 9` (not Hunter; no new execute).

Remaining first-ship slices still unminted (do not mint until 039/040 are adopted, and do not remint if a later run already took them): 006 `modifier_survivor` (live Blood Moon / Mirror Field); 006 `interrupt_channels`; 005 `bottleneckControl` → overkill spill (`applyOverkillSpread`, `enemyAI.ts` 695; do not treat it as extra damage). WX erratic/betrayal constant-wire (`ENEMY_AI_TIER_GATES.erratic` / `betrayal` replacing magic 5 / 10 at `WX` 15508 / 15595) waits on **#327**.
