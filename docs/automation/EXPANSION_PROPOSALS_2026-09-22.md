# Stralt expansion catalog — 2026-09-22

**Author:** Expansion Director (cron `0 */24 * * *`, automation `3f31b18f-a492-11f1-a7d1-d6b4613131ce`)  
**This run:** fifth catalog. Re-rank against `origin/main` `0f5363f` (`Merge pull request #332` — accepted-challenge HUD). Author-date on that tip is **2026-09-03**. Calendar: 2026-09-22.  
**Prior living catalog on `main`:** [`EXPANSION_PROPOSALS_2026-09-02.md`](./EXPANSION_PROPOSALS_2026-09-02.md) (`HEAD` then `58302bc`).  
**Unmerged sibling catalog:** PR **#366** (`EXPANSION_PROPOSALS_2026-09-21.md`) — same `HEAD`, still draft. This file is the living catalog if merged; it **adopts** 019 / 020 rather than reminting them.  
**Earlier catalogs:** [`EXPANSION_PROPOSALS_2026-09-01.md`](./EXPANSION_PROPOSALS_2026-09-01.md) (#192), [`EXPANSION_PROPOSALS_2026-08-31.md`](./EXPANSION_PROPOSALS_2026-08-31.md) (#118).  
**Gameplay / production code:** not modified.

All seventeen 08-31 / 09-01 / 09-02 cards remain **PROPOSED**. None shipped. 019 / 020 (from #366) remain **PROPOSED**. None superseded. New IDs in this file are additive first-ship slices.

`README.md` still indexes the 09-01 catalog. Older open **#333** (TBC) and **#346** (product-docs sync) own that file. This run does not touch `README.md` / `AGENTS.md` / `ARCHITECTURE.md` / `WorldExploration.tsx` / `mapGen.ts` / `challengeCompletion.ts` / the 09-02 catalog (would conflict with #366).

Score used for ranking (unchanged):

```
SCORE = PLAYER_VALUE + TACTICAL_DEPTH + REPLAYABILITY + NOVELTY
      + INFINITE_PROGRESSION_COMPATIBILITY
      − IMPLEMENTATION_COMPLEXITY − REGRESSION_RISK − BALANCE_RISK
```

Each axis is 1–10. A proposal is only strong if it creates a **new player decision** and multiplies existing axes (family × relative level × variant × AI tier × spell pool × elite × composition × map × modifier) instead of adding another HP-scaled clone.

There is **no character level cap**. XP continues `100 * 2^(N-1)`. Encounter generation must keep a below / near / equal / above distribution via the existing tier spawn. Higher progression must add AI, kits, variants, elites, synergies, environment, and objectives — not only larger HP and damage.

---

## Delta since 2026-09-21

`main` did **not** move. #366 ranked the same `0f5363f`. This run is a re-rank against an exploded open-PR queue, plus two inventory corrections that #366 missed.

| Fact | Evidence |
| :--- | :--- |
| No expansion implementation | Still 158 commits / 70 merges `58302bc` → `0f5363f`, all 2026-09-02…03. Zero commits 2026-09-03 00:28 UTC → this cron. Cards did not ship off-branch. |
| Open queue exploded | Oldest-first: **#327** Striker AoE (`WX` / targeting / `challengeCompletion`), **#331** portal destack (`mapGen`). Then **#333–#391** from the 09-21 flock (docs, admin, persist, combat, Wave 4/5 sheets). ~65 drafts. Do not restack those files. |
| #366 still draft | 09-21 catalog is not on `main`. Adopt 019 / 020. Do not fight #366 on `EXPANSION_PROPOSALS_2026-09-02.md`. |
| Blood Moon / Mirror Field are **live** | #366 still called them announce-only stubs. CDA 2026-09-21 (#359) is correct: `spellEngine.ts` **895** Blood Moon ×1.25 player non-heal damage; **901–907** Mirror Field 20% ST reflect (`WX` 9538–9558). Registry hooks in `mapModifiers.ts` 260–277 remain empty — the engine flags are the authority. Gravity Well / Fog of War still unused (`_isGravityWell` / `_isFogOfWar`, `WX` 2324–2326). |
| 019 without PREREQ-F is a trap | CDA: band-1 queens gain `starter-heal` (`healAmount: 12`) and `inferArchetype` (`enemyAI.ts` 447–452) classifies them as healers. **Ship 019 with F in the same PR.** |
| Register is lore | `enemyRegisterCopy.ts` **FLAVOR LORE** (`9e28cf9`). Per-row copy still mismatches live hooks. 014 must not convert the register into a bestiary. |
| Telemetry still none | TBC #333: `WAITING_FOR_TELEMETRY`. 0 collectors / 0 rows. Do not claim live demand. Do not retune XP, Doka, or spawn weights. |
| Engineering-health on `main` | Last landed: `MASTER_ROADMAP.md` / LONG_HORIZON / CDA / PXA dated **2026-09-02**. 09-21 MTD (#338) / CDA (#359) / PX (#343) / LHIPS (#357) are still drafts. Their code claims that match this `HEAD` are accepted. |
| Kit band still NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WX` **11920**. `levelZone` is `{ name, minLevel, maxLevel }` (`WX` **4683–4687**). `Math.floor(levelZone)` (`enemyAI.ts` **199**) → every `z >= 1` fails. `setCurrentZoneTier` (**4680**) is HUD, not the kit call. |
| Family still a sticker | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286) at `WX` 5864. Chassis stays a random chess piece (`WX` 5764–5812). Four mute families. Family HP dies at `calcEnemyMaxHp` (`WX` 11970–11974). |
| Push / pull still unused | `applyPushback` / `applyAttract` at `occupancy.ts` **482 / 537**. Callers: tests only. |
| `worldFeatures` still tests-only | 1913 lines. No WX import. CDA-018: freeze new `WF-*` rows until one is wired. |
| `combinedMechanic` still copy | `useBossRush.ts` 19–131. Zero engine readers. Room 9 `weeping_pawn_2` is not in `BOSS_IDS`. |
| Surfaces | `WorldExploration.tsx` 19,213; `mapGen.ts` 1,937; `enemyAI.ts` 2,580; `AdminDashboard.tsx` 8,280; `main.mo` 3,903. EOP chain `check-limit = 5`; GameKey on frozen `20260901`. |

Practical XP horizon: unchanged. Mid-teens exhaust intended income; level 25 is ~1.678e9 XP. Not a level cap. Do **not** retune the curve as expansion. Content must work at **1–20** and stay valid if someone is still climbing.

---

## Sibling designs (owned surfaces — do not duplicate)

| Sheet | Owns | Director card it details |
| :--- | :--- | :--- |
| [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) | Wave 1 family sheets, variant floors, pack recipes | 001, 002, 004, 014, 021 |
| [`ENEMY_ELITE_EVOLUTION_2026-09-01.md`](./ENEMY_ELITE_EVOLUTION_2026-09-01.md) / [`09-02`](./ENEMY_ELITE_EVOLUTION_2026-09-02.md) | Wave 2/3 families | **Hold** until 001/014/018/019/021 exist |
| Open **#349** Wave 4 elite sheets | More family ids | **Hold** |
| [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) | Observe → win → unlock; Wave 1 pool | 003 |
| SDE 09-01 / 09-02 + open **#371** Wave 4 | Later discovery ids | **Hold** until 003 is live |
| [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md) | `ownedSpellIds` / `observedSpellIds` persist types | 003 persist (PREREQ-J) |
| SPELL_PROPOSALS 08-31…09-02 + open **#342** Wave 4 | Tactical gap-fill ids | **Hold** until 003 ships |
| [`ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md) + 09-01 / 09-02 + open **#351** | Unbounded AI modules | 005 |
| [`BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md) + open **#367** Wave 5 / Rush Table C | Boss sheets | 011, 017 |
| ENCOUNTER_EVOLUTION 08-31…09-02 + open **#347** | Teach → pressure dungeon beats | 007, 010 |
| [`WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `engine/worldFeatures.ts` + open **#344** | Rarity / relative-difficulty overlay | 009, 016, 022 |
| ENEMY_FORMATIONS 08-31…09-02 + open **#348** drop 4 | Synergy packs | 004 |
| [`MECHANIC_INTERACTION_MATRIX_2026-09-02.md`](./MECHANIC_INTERACTION_MATRIX_2026-09-02.md) + open **#336** | Live join gaps | 013, 018 |
| [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) (on `main`: 09-02) + open **#338** | P0 integrity before expansion PRs | Process, not content |
| [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) + open **#343** | Register / modifier / discovery honesty | 014 QA; Register is lore |
| [`LONG_HORIZON_2026-09-02.md`](./LONG_HORIZON_2026-09-02.md) + open **#357** | XP wall; kit NaN; summoner saturate | PREREQ-A/B/C; do not retune curve |
| [`CONTENT_DIVERSITY_AUDIT_2026-09-02.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-02.md) + open **#359** | Live spawn is sticker + NaN kits; Blood Moon live | Confirms 001/014/019/021/022 |
| [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) + open **#333** | STATUS WAITING_FOR_TELEMETRY | No demand claims |
| Unmerged **#366** | 09-21 ranking + 019 / 020 | Adopted here |

Implementers pick **one** director ID. Follow the sibling sheet for that ID. Do not open a second family / discovery / boss catalog. Do not land Wave 2+ data before the Wave 1 card it multiplies.

---

## Current-state inventory (re-verified on `0f5363f`)

### Progression (no character level cap)

- XP curve is unbounded: `100 * 2^(N-1)` (`utils/xpCurve.ts`, `docs/ARCHITECTURE.md` rewards). HUD saturates `xpForNextLevel` at `Number.MAX_SAFE_INTEGER` from level 48; persist stays bigint / Motoko `Nat`.
- Enemy levels use `pickEnemyLevelFromTiers` (`engine/combatMath.ts` 54–107): default weights 60% same tier / 20% ±1 / 10% ±2 / leftover ±3..6. This **already** produces below / near / equal / above the player. Keep it.
- Hidden utility clamp: `maxTier = Math.floor(999 / ts)` at `combatMath.ts` 58. Past player level ~1000 the distribution stops climbing. `threeOrMorePercent` is **not read** (leftover fills the bucket). Both contradict “no character level cap” as architecture, even if LONG_HORIZON says those levels are not the live game.
- `computeAITier` (`combatMath.ts` 36–51) plateaus at 10 after enemy level 900, with a 30% full-random roll. Plateau is acceptable **if** tier 10 keeps unlocking mechanics, not more HP.

### Enemies

- Seven families typed (`types/gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`.
- Spawn writes a random chess piece, then `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289+, `WX` 5864) rolls 30% and multiplies paper HP / damage / RES / SP. Catalog `ap` / `mp` still unused. **Family does not force `pieceType`.** A “Wraith Bishop” may be a pawn with Strike.
- Battle start then sets combat HP from `calcEnemyMaxHp(level)` (`WX` 11970–11974). **Family HP multipliers never reach the fight.** Family RES 0.05–0.75 is still the wrong unit vs `getEnemyBaseStats`.
- Three live combat hooks only: `ember_knight` melee burn and `tide_shade` melee −1 MP (`WX` 16789–16818); `void_mirror` 25% pre-crit reflect (`castHelpers.ts` 336–345). The other four families are art + dead paper. Live Ember/Tide/Void also **mismatch** Register copy (melee burn ≠ burning tiles; MP−1 ≠ regen; 25% reflect ≠ magic immunity until physical).
- Piece-type kits exist (`engine/enemyAI.ts` 163–185) and grow at zone 1 / 2. Battle start still passes the LevelZone **object**. **Every overworld enemy is stuck on the one-spell zone-0 kit.** Band 0 is already differentiated by chassis: pawn/knight/rook = Strike; bishop/queen/king = Frost. That is the lever 021 turns.
- `inferArchetype` (`enemyAI.ts` 447–452) returns `"healer"` if any assigned spell has `healAmount > 0`. Drain kits become healers. Band-1 queens would become Blood-Mend healers if 019 ships alone.
- Leader death → erratic and 5% betrayal still exist. `ENEMY_AI_TIER_GATES` (`gameConstants.ts` 200–208) names `groupTactics`, `instantKill`, `chokepointCamp`, `escapeRoute`, `bottleneckControl`, `defensiveRetreat`. **Zero references in `enemyAI.ts`** except a comment at 1422. Master AI toggles are **global on**, not `aiTier`-gated.
- Summoner chance is `0.12 + playerLevel * 0.02` (`WX` 11932–11939; constants `gameConstants.ts` 298–299). Saturates by mid-40s. `ENEMY_SUMMON_CAP = 2` contains the board. Pets are 50/50 wolf or archer — not family-bound.

### Spells / discovery

- Frontend catalog: 32 ids in `data/bossKits.ts` `SPELL_ID_CATALOG` (29–62) / `data/spellData.ts`.
- `WorldExploration.tsx` 2395–2407 still marks **every** `starterSpells` entry `isBaseSpell: true`. No observe / kill / achievement / elite unlock path.
- `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. The `ownedSpellIds` argument is a **retirement** gate. It is **not** discovery.
- Backend `defaultSpells()` (`src/backend/lib/admin.mo` 168–191) is still a **different** six-spell set (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`). Dual catalogs.
- Targeting is metadata-driven. New spells must stay on that contract (`AGENTS.md`).
- `applyPushback` / `applyAttract` have tests and **no** `resolvePlayerCast` / enemy-cast caller. `void_collapse` still advertises pull.

### Combat / world / dungeons / bosses

- 22 map modifiers in `engine/mapModifiers.ts`. **Live in engine, empty in registry:** `blood_moon` (×1.25 player damage — numeric DAMAGE reskin), `mirror_field` (20% ST reflect — a **fourth** live reflect next to Mirror spell, Void Mirror, boss Reflect Shield). **Still unused:** `gravity_well`, `fog_of_war`. `slime_flood` and `frozen_terrain` (155–173) are the same MP-doubler. `titans_vigor` still adds **+1000 HP** and 1–5× damage rolls (300–316).
- `engine/worldFeatures.ts` is a rarity / relative-difficulty catalog with tests (52 `WF-*` rows per CDA). **No production caller.**
- Seven map archetypes. Further `mapGen.ts` work stays frozen (`AGENTS.md`). File is 1,937 lines. Open **#331** owns destack.
- Dungeon chain is still linear 3–5 maps. No special rooms, no forks. Depth extras are more bodies + tier boost (`spawnPolicy.ts` 27–28).
- 19 bosses, two phases. Boss Rush is a fixed 10-room pair table (`useBossRush.ts`). `combinedMechanic` is **copy only**. Level-diff scaling is ±8% per level (`engine/progression.ts`).
- Challenges: nine numeric predicates (`utils/challengeCompletion.ts` 11–20). Three turn-count clones, three damage-taken clones, three unique (`no_healing`, `under_8_ap_per_turn`, `direct_hit`). Open **#327** currently owns this file.
- Achievements: 15 one-shots (`admin.mo` 309–325). `unstoppable` / `level_10` is a capped milestone. Nothing repeats as the player keeps leveling. Rewards are Doka, never a spell.

### Engineering-health constraints

- No player telemetry. Do not claim live demand. Do not retune from `longHorizonSim`.
- New behavior belongs in `src/frontend/src/engine/*` or `src/frontend/src/utils/*` with tests; WX gets one-line wiring. **Do not grow WX while #327 is open.**
- Do not touch RAF, **map generation**, turn logic, or damage math (`AGENTS.md`). **Do not edit `mapGen.ts` while #331 is open.**
- Credits still go through `applyRewards`; spends / death through `saveBattleStats` on `createProgressPersist`. No second reward funnel. GameKey shop must not grow a parallel Doka mint.
- Discovery that writes ownership must enqueue on the persist lock **and** use PREREQ-J (a **new later** migration file after frozen `20260901`, never edit a shipped `NewActor`).
- Caffeine import gate + oldest-first stack-compat are CI. Expansion PRs must pass `bash scripts/caffeine-import-gate.sh all` and `bash scripts/open-pr-stack-compat.sh --self`.
- Client-trusted canister writes remain an architecture decision (AQA-2026-08-30-008), not an expansion.
- MTD 09-21 (#338): confirm Caffeine deploy of the `20260901` tail and refresh `.old` before new Motoko stables. Source chain is correct; live deploy is unconfirmed.

---

## Prerequisites (not expansions — fix or respect before shipping content)

| ID | Finding | Why it blocks infinite / combinatorial content | Status |
| :--- | :--- | :--- | :--- |
| PREREQ-A | `buildEnemyKit(..., currentMap.levelZone)` passes `{ name, minLevel, maxLevel }`; kits never leave zone 0 (`WX` 11920, `enemyAI.ts` 199, zone object `WX` 4683–4687) | Spell-pool depth is implemented and dead. Pass a **number**. Prefer 019’s relative band `R = enemy.level − player.level`, not the map-name object or `currentZoneTier` HUD. | **OPEN** |
| PREREQ-B | `pickEnemyLevelFromTiers` clamps at 999 (`combatMath.ts` 58). `threeOrMorePercent` unread | High-level players stop seeing above-level enemies. Remove the 999 ceiling; keep the existing weight math; actually use the fifth percent. | OPEN |
| PREREQ-C | Summoner chance uses raw `characterStats.level` (`WX` 11932–11939) | Saturates by the mid 40s. Use player **tier** and keep `ENEMY_SUMMON_CAP`. Practically less urgent than A (XP dies first). | OPEN |
| PREREQ-D | Do not grow `WorldExploration.tsx` (19,213 lines). Open **#327** owns the file. | Family / elite / discovery tables must live in engine modules. | OPEN |
| PREREQ-E | Persist drafts #183 / #180 | Discovery was racing death-replay and live-Doka PRs. | **CLOSED** (merged 2026-09-01) |
| PREREQ-F | `inferArchetype` treats any `healAmount > 0` as healer (`enemyAI.ts` 447–452) | Drain / lifesteal family rows become healers. **019 must not ship without this.** Gate on `spellType === "heal"` only (or an explicit `aiHint`). | OPEN — **couple with 019** |
| PREREQ-H | Battle start overwrites family HP via `calcEnemyMaxHp` (`WX` 11970–11974). `applyEnemyFamilyStats` (`spawnPolicy.ts` 261–272) still multiplies paper HP first. | The 30% family roll is a lie even as stat flavor. Stamp **identity** in `spawnPolicy`; do not multiply paper HP, or carry family identity into combat HP. | OPEN |
| PREREQ-I | Motoko GameKey EOP **#259** was the oldest open PR | 003 persist could not land in the same queue. | **CLOSED** (#259 gone; GameKey is `20260901_000000` on `main`) |
| PREREQ-J | Any new persistent `let`/`var` on `main.mo` (including `ownedSpellIds` / `observedSpellIds`) | Must be a **new later** chain file after frozen `20260901` (`OldActor = {}`), bump `check-limit`, `check-eop-stables.py`, never edit a shipped `NewActor`. Wait for Caffeine deploy confirmation of the GameKey tail before adding stables. Frontend observe-counters may prototype behind a helper; ownership authority stays canister. | **OPEN** |

PREREQ-G (dual frontend / Motoko spell catalogs) stays a hygiene note, not a ship-blocker for 001/014/006/018/019/021. Align ids when a spell PR actually touches `defaultSpells()`.

---

## Ranked opportunities

| Rank | EXPANSION_ID | Title | Category | SCORE | Priority | vs 09-21 |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | EXP-2026-08-31-001 | Family role kits (stop using families as HP skins) | ENEMIES | 30 | P0 | same #1 |
| 2 | EXP-2026-08-31-006 | Mechanic challenge catalog | PROGRESSION | 29 | P0 | same |
| 3 | EXP-2026-09-21-020 | First mechanic challenge: `kill_leader_last` | PROGRESSION | 29 | P0 | adopted from #366; formula 29 (09-21 table said 28) |
| 4 | EXP-2026-09-01-014 | Mute-family combat hooks (four families have none) | ENEMIES | 28 | P0 | same |
| 5 | EXP-2026-08-31-002 | Elite / champion modifier tokens | ENEMIES | 28 | P1 | same |
| 6 | EXP-2026-08-31-004 | Pack role composition | ENEMIES / AI | 28 | P1 | same |
| 7 | EXP-2026-08-31-003 | Observed-spell discovery | SPELL DISCOVERY | 27 | P0 | same; PREREQ-J |
| 8 | EXP-2026-09-21-019 | Relative kit-band adapter (unlock authored piece kits) | ENEMIES | 25 | P0 | adopted; **must ship with F**; complexity 2→3, balance 5→6 |
| 9 | EXP-2026-09-22-021 | Family-preferred chassis overlay | ENEMIES | 25 | P0 | **new** — first ship slice of 001’s readability axis |
| 10 | EXP-2026-09-02-018 | Wire push / pull on existing ids | COMBAT | 24 | P1 | same |
| 11 | EXP-2026-08-31-010 | Optional tactical objectives | COMBAT | 24 | P1 | same |
| 12 | EXP-2026-08-31-008 | Uncapped achievement / mastery ladder | PROGRESSION | 23 | P2 | same |
| 13 | EXP-2026-08-31-013 | Explicit spell-interaction layer | COMBAT | 23 | P2 | 018 first |
| 14 | EXP-2026-09-01-016 | Wire `worldFeatures` overlay (no mapGen rewrite) | WORLD | 23 | P2 | same; freeze new `WF-*` |
| 15 | EXP-2026-08-31-009 | Finish unused modifiers + combo-only world rules | WORLD | 21 | P2 | **corrected** — Blood Moon / Mirror Field are live |
| 16 | EXP-2026-08-31-005 | AI sophistication ladder (unused gates) | AI | 21 | P2 | same |
| 17 | EXP-2026-08-31-007 | Dungeon room types without rewriting mapGen | DUNGEONS | 21 | P2 | wait for #331 |
| 18 | EXP-2026-09-02-017 | Honor Boss Rush `combinedMechanic` | BOSSES | 20 | P2 | same |
| 19 | EXP-2026-08-31-011 | Boss mechanic-pool scaling (not more HP) | BOSSES | 17 | P3 | same |
| 20 | EXP-2026-09-22-022 | Convert Blood Moon off ×1.25 damage | WORLD | 16 | P3 | **new** — first ship slice of 009 |
| 21 | EXP-2026-09-01-015 | Convert Titan's Vigor off +1000 HP | WORLD | 15 | P3 | same |

**Ship-next (not the same as SCORE):** **021** → **014** → **PREREQ-A + 019 + PREREQ-F (one PR)** → **001** → **020** (after #327) → **018** → **003** (PREREQ-J) → 002/004.

SCORE ranks opportunity size. Ship-next ranks what creates a player decision **this week** without Motoko schema, without growing `enemyAI.ts`, and without racing open WX / mapGen / challenge PRs.

021 before 019 because band-0 kits already differ by piece type: coupling family → preferred chassis works **today**, lives in `spawnPolicy.ts`, and does not wait on #327. 019 before full 001 because the piece-kit table already exists and currently cannot fire — but 019 **without F** turns late queens into healers, so A+F+019 is one change. 014 still creates family identity independent of kits.

---

## Proposal cards

### EXP-2026-08-31-001

**TITLE:** Family role kits (stop using families as HP skins)  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Choose a kill order and positioning answer for *this* family on *this* board, not “the slightly thicker pawn.”  
**MECHANIC:** Data table `family → { archetype, spellPoolIds by relative band, preferredAI, threatTag }`. The existing 30% family roll (`spawnPolicy.ts` `maybeApplyEnemyFamilyVariant` / `WX` 5864) keeps firing, but assigns **kits and AI**, not only `hpMult` / `dmgMult`. Piece type remains a variant axis (bishop wraith ≠ pawn wraith) after 021 stamps a *preferred* chassis, not a hard lock.  
**WHY_IT_IMPROVES_STRALT:** Families are already in the type system, art path, and extracted spawn overlay. After PREREQ-H they create almost no combat decision except three melee hooks. Wiring kits is still the cheapest combinatorial multiplier in the repo.  
**SYSTEMS_AFFECTED:** New table next to `ENEMY_KITS` (do not grow `enemyAI.ts` with inline if-chains); `spawnPolicy.ts` stamps family **identity**; WX one-line after #327. Follow [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md). Do **not** add Wave 2+ family ids here.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Band index from **enemy** level vs player (`R`), no max. New rows unlock at high bands (extra control spell, then a synergy tag). HP stays the existing level roll.  
**IMPLEMENTATION_APPROACH:** After 021, 014, PREREQ-A / 019, and PREREQ-F. Pure table. Example: `void_mirror` → mirror/reflect + swap; `plague_rat` → stacked DoT + sacrifice; `iron_golem` → iron-skin + body-block; `bone_scribe` → mark + weaken; `tide_shade` → attract/push + frost. Resolve ids only through `SpellConfig.id`. Unit-test kit contents per (family, piece, band).  
**BALANCE_CONSIDERATIONS:** Flatten or drop family stat mults (they already die at battle start). Do not give every family Inferno at band 0.  
**QA_REQUIREMENTS:** Band 0 / 1 / 2 / 20 kits are distinct; `usableByEnemy` honored; no name-based targeting; pack of mixed families still ends via existing death pipeline.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 9 | 9 | 6 | 4 | 4 | 5 | 10 |

**What new decision does this create?** “The golem is the cover; the scribe is the Mark. Who dies first on this terrain?”

---

### EXP-2026-08-31-006

**TITLE:** Mechanic challenge catalog  
**CATEGORY:** PROGRESSION  
**PLAYER_OPPORTUNITY:** Accept a fight objective that changes **how** you spend AP/MP this battle, not only “go faster / take less.”  
**MECHANIC:** Extend `ChallengeCondition` in `utils/challengeCompletion.ts` (11–20) with metadata-driven conditions: `kill_leader_last`, `no_summons`, `no_hazard_steps`, `modifier_survivor`, `only_observed_spell`, `interrupt_channels`. Rewards stay on the existing recap → `applyRewards` funnel and live-ref persist.  
**WHY_IT_IMPROVES_STRALT:** The nine current challenges are all numeric. They do not interact with family / elite / modifier / discovery. Isolated module; no Motoko schema. Accepted-HUD honesty landed (`3e95eab`). Open **#327** currently edits this file; wait or union.  
**SYSTEMS_AFFECTED:** `challengeCompletion.ts` + tests; `ChallengePanel.tsx` copy. No XP-curve change. First predicate is 020.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Predicates are relative to the live encounter. A high-band elite pack makes `kill_leader_last` harder without a level cap.  
**IMPLEMENTATION_APPROACH:** One condition per PR, with a helper test, same style as `#51`. Do not put predicate logic in `WorldExploration.tsx`.  
**BALANCE_CONSIDERATIONS:** Keep legendary rewards in the current 400–1000 XP band so they do not outrun `2^(N-1)`. No per-kill resolver calls.  
**QA_REQUIREMENTS:** Touch vs mouse hazard parity still feeds `no_hazard_steps`; Untouchable still uses `recordChallengeDamageTaken`; Attack Nearest still records AP; Sacrifice HP still counts; BuffShop potions still fail no-heal; Pacifist preview still must not flip the flag; accepted HUD still stays after the first action.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 6 | 4 | 3 | 3 | 9 |

**What new decision does this create?** “The challenge is kill-leader-last — do I burn the rats first and eat the leader boost, or race the crown?”

---

### EXP-2026-09-01-014

**TITLE:** Mute-family combat hooks  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Read four families the way Ember / Tide / Void already force a read — before kits exist.  
**MECHANIC:** Extract the three live hooks into `engine/familyHooks.ts` (`onMeleeHit`, `onSpellTaken`). Add the four mute families using **existing** effect types only: `plague_rat` → venom stack on melee; `bone_scribe` → Weaken on first damaging spell; `iron_golem` → ignore poison/burn, stagger (skip next move) after an AP-dump hit; `wraith_bishop` → first walk through a wall-adjacent tile costs +1 MP (occupancy already has MP hooks). No new damage formula. Optional combat inspect chip that prints the **live** hook id (Register stays lore).  
**WHY_IT_IMPROVES_STRALT:** This is the first shippable family-identity slice of 001. Three families already teach “family means a rule.” Four families teach nothing. Does **not** wait on PREREQ-A. The Enemies register is **explicitly lore** (`enemyRegisterCopy.ts`); do **not** rewrite it as a live bestiary in this PR.  
**SYSTEMS_AFFECTED:** New `engine/familyHooks.ts` + tests; one-line calls from the existing melee block (`WX` 16789) and `castHelpers.ts` 336 (void_mirror moves here). `spawnPolicy.ts` already owns the 30% roll. Do not add a seventh family. Do not implement Crimson Spawn / Shadow Lurker / Storm Caller.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Hooks are identity, not level. Later 001 rows add spells on top; hooks stay valid at any band.  
**IMPLEMENTATION_APPROACH:** Copy the ember/tide `applyActiveEffect` pattern. Ids, not names. Do not put new `if (family === …)` chains in WX — dispatch from the table. Wait for #327 or extract without growing WX beyond one import. Pairs with 021 so the hook lands on a readable chassis.  
**BALANCE_CONSIDERATIONS:** Rat DoT must not outrun Ember’s 3/3. Golem immunity is to **status**, not to damage. No HP mult (PREREQ-H).  
**QA_REQUIREMENTS:** Default-family packs unchanged; mixed-family pack applies only the acting combatant’s hook; challenge damage still records ember/void reflect; death pipeline unchanged; Register chrome still says flavor lore.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 6 | 3 | 4 | 4 | 9 |

**What new decision does this create?** “The golem shrugs poison — Inferno it. The rat is a stack race. The scribe’s first hex is the one I interrupt.”

---

### EXP-2026-09-21-020

**TITLE:** First mechanic challenge: `kill_leader_last`  
**CATEGORY:** PROGRESSION  
**PLAYER_OPPORTUNITY:** Spend this fight protecting or racing a named crown instead of racing a timer.  
**MECHANIC:** Add `kill_leader_last` to `ChallengeCondition`. Fail if the annotated leader (`isLeader` / `leaderEnemyIdRef`, `WX` 12026–12029) dies while any other battle-start hostile still has store HP `> 0`. Win if that leader is the last hostile into `deathPipeline`. Rewards stay on the existing recap → `applyRewards` path.  
**WHY_IT_IMPROVES_STRALT:** This is the first shippable slice of 006. Leader crown already exists as a gold nameplate (`WX` 8131). The player can already *see* a leader; nothing asks them to use that information. Isolated module; no Motoko; no family table. Adopted from #366.  
**SYSTEMS_AFFECTED:** `challengeCompletion.ts` + tests; `ChallengePanel.tsx` copy for one new catalog row (or rotate into an existing legendary slot — do not add a second recap funnel). **Wait for #327** (owns `challengeCompletion.ts`) or union one helper.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Harder when 002/004 exist (coordinator elite, battery pack). Valid at any player level because “leader” is relative to the pack, not a level cap.  
**IMPLEMENTATION_APPROACH:** Accumulate `leaderDiedWhileHostilesRemain` on the death-pipeline hook via a pure helper. Do not parse display names. Flee / lava-last-kill / summon-lifespan last-kill must use store HP.  
**BALANCE_CONSIDERATIONS:** Keep the reward in the current hard/legendary Doka/XP band. Do not pay if the pack had no leader (single-enemy maps: treat as auto-pass or do not offer the challenge).  
**QA_REQUIREMENTS:** Enemy-summon deaths do not count as “other hostiles” unless they are `side: "enemy"` and `isActiveHostile`; player-side summons never count; `countsTowardKillRewards` unchanged; accepted HUD still visible.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 7 | 6 | 3 | 3 | 3 | 9 |

**What new decision does this create?** “The crown is the golem — do I peel the battery first and eat the leader boost, or snipe the crown and fail the contract?”

---

### EXP-2026-08-31-002

**TITLE:** Elite / champion modifier tokens  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Treat one combatant as a named puzzle (shielded, hexer, coordinator, phase-step) instead of “same kit, more HP.”  
**MECHANIC:** A map-modifier-shaped registry (`engine/eliteModifiers.ts`): tokens with hooks (`onBattleStart`, `onDeath`, `onCast`, `onAllyDeath`). Spawn rolls 0–1 elite per pack; chance scales with **tier**, not raw HP. Tokens are ids (`shielded`, `hexer`, `coordinator`, `echo_cast`, `phase_step`), never name heuristics.  
**WHY_IT_IMPROVES_STRALT:** There is still no elite layer (leader boost + betrayal are the only specials). Tokens multiply family × kit × AI tier without new creature art. Sheet: [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md).  
**SYSTEMS_AFFECTED:** New engine registry; spawn extract (`spawnPolicy.ts`); initiative / nameplate badge (stone + crimson, `DESIGN.md`); optional observe source for 003.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Higher tiers add a **second** token or a coordinated pair, not +N% HP. Token table is append-only.  
**IMPLEMENTATION_APPROACH:** Copy the hook-union pattern from `engine/mapModifiers.ts` (32–40). Do not apply tokens by multiplying `level * 8 + 20` again.  
**BALANCE_CONSIDERATIONS:** One elite per pack until 004. Coordinator must not grant infinite AP.  
**QA_REQUIREMENTS:** Elite death still goes through `deathPipeline.ts`; leftover-roster XP unchanged; token hooks do not write Doka.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 9 | 10 | 8 | 6 | 6 | 6 | 10 |

**What new decision does this create?** “The hexer dies first or my AP budget collapses — even if the golem is closer.”

---

### EXP-2026-08-31-004

**TITLE:** Pack role composition  
**CATEGORY:** ENEMIES / AI  
**PLAYER_OPPORTUNITY:** Read a pack as roles (anchor, battery, kiter, summoner) and choose a breach point.  
**MECHANIC:** Replace independent per-enemy rolls with a pack recipe: 1 anchor + 1 battery + N fillers + at most one summoner. Recipes keyed by player **tier**. Uses existing archetypes in `decideEnemyAction` (`caster|healer|charger|flanker|berserker|summoner|generic`).  
**WHY_IT_IMPROVES_STRALT:** Quadrant spawn still places bodies, not roles. Summoner chance already exists and is over-firing (PREREQ-C). Formations sheet: [`ENEMY_FORMATIONS_2026-09-01.md`](../design/ENEMY_FORMATIONS_2026-09-01.md).  
**SYSTEMS_AFFECTED:** `spawnPolicy.ts` + extracted helper; `enemyAI.ts` archetype inference from family+piece+role (after PREREQ-F); leader assignment (`isLeader`) stays.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Higher tiers add a **synergy tag** (battery heals only the elite) rather than more bodies (`MAX_ENEMIES` is 20).  
**IMPLEMENTATION_APPROACH:** Pure `buildPack(playerLevel, tierCfg, rng)` returning `{ pieceType, family, role, aiTier }[]`. WX places the returned roster on legal tiles.  
**BALANCE_CONSIDERATIONS:** After PREREQ-C, summoner is a role slot, not a per-enemy coin flip. Do not spawn two healers + two summoners in band 0.  
**QA_REQUIREMENTS:** `shouldAllowBattleTrigger` / last-hostile victory still hold; Chebyshev spacing (`SPAWN_MIN_CHEBYSHEV = 4`) unchanged.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 9 | 7 | 5 | 5 | 5 | 10 |

**What new decision does this create?** “Break the battery before the anchor enrages, or kite the kiter off the thorn path?”

---

### EXP-2026-08-31-003

**TITLE:** Observed-spell discovery  
**CATEGORY:** SPELL DISCOVERY  
**PLAYER_OPPORTUNITY:** Stay in a fight, hunt an elite, or finish a boss **in order to learn** a spell you do not already own — then decide whether it earns a bar slot (max 8).  
**MECHANIC:** Shrink the innate set to Strike + a tiny starter trio. Everything else in `starterSpells` becomes **acquirable**. Unlock when the player observes N casts of that `spellId` **and** wins (SDE contract: use → observe → win → unlock). Persist ownership on existing `Character.spellLevelKeys` / `spellLevelValues` **or** the sibling `ownedSpellIds` map — not a third wallet. `upgradeSpell` remains the sole level writer.  
**WHY_IT_IMPROVES_STRALT:** Today every listed spell is already owned (`WX` 2395–2407; `shouldIncludeBackendSpellInLibrary` still unions the catalog). Collection, mastery, and loadout tension are empty. After LONG_HORIZON, discovery **is** the long-term loop — XP-to-next is not. Persist drafts that blocked this on 09-01 are **closed**. #259 is **closed**. The remaining gate is PREREQ-J (later EOP file), not a second persist lock.  
**SYSTEMS_AFFECTED:** `ownedSpells` derivation via extracted helper; battle-log / death-pipeline hook for “observed id”; spellbook UI; optional achievement conditions. Contract: [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) + [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md).  
**INFINITE_PROGRESSION_BEHAVIOUR:** Eligibility uses relative `R`, family, elite, encounter type — never “reach level CAP.” New kit rows are new drop sources forever.  
**IMPLEMENTATION_APPROACH:** Extract `resolveOwnedSpells`. Do **not** strip Strike. Keep Barrier / Mirror / Timestep as rare observes. Recap shows “Studied: Slow” on the existing root `PostBattleRecap`. **PREREQ-J:** new `src/backend/migrations/20260902+_*.mo` with `OldActor = {}` if a Character map is required; bump `check-limit`; never edit `20260831` / `20260901` `NewActor`. Wait for Caffeine deploy confirmation of HEAD. A frontend-only observe log is not authority.  
**BALANCE_CONSIDERATIONS:** Starter kit must still clear band-0 packs after 019. Do not auto-equip newly learned spells. Doka cost of upgrades unchanged.  
**QA_REQUIREMENTS:** Reload after observe still owns the spell (backend keys, not only `localStorage`); persist lock used if a write accompanies victory; mock-actor path covered; `getPlayerAchievements` still uses Principal if a feat is added.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 10 | 7 | 9 | 8 | 7 | 6 | 4 | 10 |

**What new decision does this create?** “Do I finish the scribe for Mark, or disengage and keep my HP for the next portal?”

---

### EXP-2026-09-21-019

**TITLE:** Relative kit-band adapter (unlock authored piece kits)  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Read a late pawn’s Venom or a high-band king’s Rallying Cry and answer that kit — which is currently impossible because every enemy is zone 0.  
**MECHANIC:** Replace `buildEnemyKit(piece, currentMap.levelZone)` with `buildEnemyKit(piece, kitBandFromRelative(enemy.level, player.level))`. `kitBandFromRelative` is a pure helper: `R = enemy.level − player.level`; band 0 if `R < 0`, band 1 if `0 ≤ R < tierSize`, band 2+ if `R` keeps climbing (append-only; no max). Does **not** invent a new kit table. It turns on `ENEMY_KITS` rows that already exist (`enemyAI.ts` 163–185).  
**WHY_IT_IMPROVES_STRALT:** This is the cheapest spell-pool-depth signal in the repo and the brief’s preferred alternative to HP. The table has survived four director cycles while the call site passes an object. Sibling LONG_HORIZON / CDA / PXA all name this NaN. 019 is the **policy** (relative R, unbounded). PREREQ-A is the **type bug** (stop passing an object). PREREQ-F is the **healer trap**. Ship A+F+019 together. Adopted from #366.  
**SYSTEMS_AFFECTED:** New `engine/kitBand.ts` (or a function in `combatMath.ts`) + tests; `inferArchetype` heal gate in the **same** PR; one argument change at `WX` 11920 after #327, **or** a wrapper so WX still calls `buildEnemyKit(piece, band)` with a number extracted outside WX. Do not grow `enemyAI.ts` with content tables.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Band index from relative `R`, no level cap. When 001 adds family rows, they reuse the same helper. After band 2 the existing table plateaus until 001 appends rows — that is honest; do not fake depth with more HP.  
**IMPLEMENTATION_APPROACH:** Unit-test: object input must not be reachable; pawn band 0 = Strike only; pawn band 1 = Strike + Venom; queen band 2 includes Inferno; `R = −20` stays band 0 so below-level enemies telegraph; queen with `starter-heal` is **not** inferred healer after F. Do not use `setCurrentZoneTier` (map HUD, not enemy-relative).  
**BALANCE_CONSIDERATIONS:** Above-level queens/kings gain Inferno at band 2. That is the point of the authored table. Do not also raise HP. Below-level enemies must stay readable (band 0). Without F, band-1 queens Blood-Mend the pack — that is a regression, not expansion.  
**QA_REQUIREMENTS:** `usableByEnemy` honored; `starter-drain` / `spell-lifesteal-nova` / `spell-drain-courage` stay non-healer; death pipeline unchanged; no Doka write.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 4 | 3 | 4 | 6 | 10 |

**What new decision does this create?** “That king has Rallying Cry — interrupt the crown before the pack heals, or ignore the pawn’s Venom and lose the race?”

---

### EXP-2026-09-22-021

**TITLE:** Family-preferred chassis overlay  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** See a family and already know the *piece verb* — frost bishop vs Strike pawn — instead of a random chassis wearing a palette.  
**MECHANIC:** When `maybeApplyEnemyFamilyVariant` assigns a family (`spawnPolicy.ts` 279–286), also stamp a **preferred** `pieceType` from a small table (bishop for `wraith_bishop`, rook for `iron_golem`, pawn/knight mix for `plague_rat`, knight for `ember_knight`, bishop for `tide_shade`, bishop/queen for `bone_scribe`, queen for `void_mirror`). Keep a 20–30% off-type roll so piece remains a variant axis. Default-family packs stay fully random. No HP change. No new family id.  
**WHY_IT_IMPROVES_STRALT:** Band-0 kits already differ by chassis (Strike vs Frost). Family identity is currently a sticker on a random piece, so even 014 hooks land on unreadable bodies. This is the cheapest first-ship of 001’s readability axis. Lives entirely in `spawnPolicy.ts`. Does **not** wait on PREREQ-A, #327, or Motoko.  
**SYSTEMS_AFFECTED:** `spawnPolicy.ts` + tests. WX already calls `applyFamilyVariantsToRoster`. Optional: combat inspect shows `family + pieceType`. Do not grow WX. Do not rewrite Register lore rows.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Preferred chassis is identity, not level. Later 001 kit rows and 019 bands stack on top. Off-type roll keeps the combinatorial product `family × piece` instead of collapsing it.  
**IMPLEMENTATION_APPROACH:** `FAMILY_PREFERRED_PIECE: Record<Family, ChessPieceType[]>` plus `rng` pick. Call from `applyEnemyFamilyStats` or immediately after. Unit-test: 1000 rolls of `wraith_bishop` majority bishop; default family never forced; Chebyshev spacing unchanged.  
**BALANCE_CONSIDERATIONS:** More frost bishops at band 0 is intended. Do not also apply family HP mults (PREREQ-H). Do not force 100% chassis lock — that deletes the piece axis.  
**QA_REQUIREMENTS:** `FAMILY_VARIANT_CHANCE` still 0.3; dungeon extras still count-only; `computeAITier` still after placement; no Doka write; mixed-family packs legal.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 7 | 8 | 4 | 3 | 4 | 4 | 9 |

**What new decision does this create?** “The purple one is a bishop — Frost LoS, not a Strike pawn I can ignore in melee.”

---

### EXP-2026-09-02-018

**TITLE:** Wire push / pull on existing spell ids  
**CATEGORY:** COMBAT  
**PLAYER_OPPORTUNITY:** Spend AP to move a body onto thorns, off a shrine, into a Barrier trap, or out of a choke — using verbs the occupancy layer already resolves.  
**MECHANIC:** Call `applyPushback` / `applyAttract` (`occupancy.ts` 482 / 537) from `resolvePlayerCast` and the enemy-cast path when `SpellConfig.effectType` / `effectParams` already say push or attract. First ids: `void_collapse` (advertised pull, currently AoE-only) and any live id with `effectType` attract/push already in data. After landing, run the **same** hazard/occupancy commit as a walk (MIMA landing remainder). Do not invent `spell-shoulder-bash` / `spell-hook-line` here — those stay in SPELL_PROPOSALS until 003.  
**WHY_IT_IMPROVES_STRALT:** Positioning is the combinatorial axis the brief asks for. The resolvers and tests exist; zero production callers. This is the first shippable slice of 013. It multiplies family (tide_shade later), modifiers (thorns / rift), Barrier, and Mark without a new spell id and without Motoko.  
**SYSTEMS_AFFECTED:** `spellEngine.ts` / enemy-cast dispatch; occupancy (already); Swap still separate (MIMA-001 — do not fix Swap in this PR). **No damage-formula rewrite.**  
**INFINITE_PROGRESSION_BEHAVIOUR:** Push distance stays in metadata. High-band kits later add the same verb to more ids; the player decision (where the body lands) does not need a level cap.  
**IMPLEMENTATION_APPROACH:** One metadata flag, one call site, occupancy tests already cover blocked first-step. Apply lava/spikes/thorns on the landed cell through the existing walk helper, not a new damage path.  
**BALANCE_CONSIDERATIONS:** `void_collapse` is 12 AP / `minLevel` 30 (unenforced). Do not also buff its damage. Pull must stop before occupied / wall / portal (resolver already does). Do not pull the player into instant-kill without a telegraph.  
**QA_REQUIREMENTS:** Push into lava ticks store HP via `updateCombatant`; Barrier blocks the step; Death Realm / challenge damage still record; no Doka write; `usableByEnemy` kits that gain pull still honor summon cap.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 8 | 6 | 4 | 6 | 6 | 9 |

**What new decision does this create?** “Do I pull the rat onto the thorn path, or push the golem off the choke so the scribe is exposed?”

---

### EXP-2026-08-31-010

**TITLE:** Optional tactical objectives  
**CATEGORY:** COMBAT  
**PLAYER_OPPORTUNITY:** Take a side goal on the current map (interrupt a channel, hold a shrine, extract a marked tile) for extra Doka/XP **or** a spell observe.  
**MECHANIC:** Encounter flag on the map (not a new tile generator): `objective: { type, cell?, failOn?, reward }`. Resolution at victory, same recap funnel with `PREAPPLIED_REWARD_MULTIPLIER`. Failure is optional — the fight can still be won. Prefer IDs already listed in [`ENCOUNTER_EVOLUTION_2026-08-31.md`](../encounters/ENCOUNTER_EVOLUTION_2026-08-31.md).  
**WHY_IT_IMPROVES_STRALT:** Overworld fights are “clear hostiles.” Objectives make positioning and tempo matter independent of DPS.  
**SYSTEMS_AFFECTED:** New `engine/tacticalObjectives.ts`; recap fields; challenge overlap must be explicit (do not double-count 006/020).  
**INFINITE_PROGRESSION_BEHAVIOUR:** Objective **type** rotates with tier; reward uses existing victory formulas, not a level-capped table.  
**IMPLEMENTATION_APPROACH:** Place the objective on an already-walkable floor cell after finalize (do **not** punch new corridors; `mapGen.ts` stays closed, especially while #331 is open).  
**BALANCE_CONSIDERATIONS:** Optional. Never block the progression portal on a failed side objective.  
**QA_REQUIREMENTS:** Death Realm timer still blocks portals/encounters; dungeon-chain snapshot still happens before `cleanupMap`.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 8 | 8 | 7 | 6 | 5 | 9 |

**What new decision does this create?** “Do I spend two MP to contest the shrine, or commit the Inferno on the elite?”

---

### EXP-2026-08-31-008

**TITLE:** Uncapped achievement / mastery ladder  
**CATEGORY:** PROGRESSION  
**PLAYER_OPPORTUNITY:** Chase repeating collection / mastery goals after level 10 instead of a finished feat list.  
**MECHANIC:** Add conditions that **scale or repeat**: family slayer N, modifier survivor N, spells observed N, dungeon best-depth, elite tokens survived. Keep `level_10` as a tutorial feat (`admin.mo` 321); do **not** add `level_50` as an endgame. Rewards via `claimAchievementReward` on the persist lock.  
**WHY_IT_IMPROVES_STRALT:** `unstoppable` implies a destination. LONG_HORIZON makes repeating feats the scoreboard that still matters when XP-to-next is astronomical.  
**SYSTEMS_AFFECTED:** `defaultAchievements()` + frontend condition keys. `getPlayerAchievements` must keep using the caller Principal. New achievement **configs** are not a Character schema change — still use PREREQ-J if the PR also adds stables.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Thresholds are counts, not “reach final level.”  
**IMPLEMENTATION_APPROACH:** Client still calls `markAchievementUnlocked` (known trust issue AQA-008). Do not invent canister proofs in this expansion.  
**BALANCE_CONSIDERATIONS:** Doka on claim only; no XP from feats (avoids fighting the XP curve). Prefer spell-observe rewards once 003 exists rather than a third Doka-hoard twin.  
**QA_REQUIREMENTS:** Claim enqueue + `commit`; empty list when Principal omitted.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 3 | 8 | 4 | 4 | 3 | 3 | 10 |

**What new decision does this create?** Weak alone; strong as the **scoreboard** for 001/003/009 (“one more void_mirror observe”).

---

### EXP-2026-08-31-013

**TITLE:** Explicit spell-interaction layer  
**CATEGORY:** COMBAT  
**PLAYER_OPPORTUNITY:** Sequence spells for a documented combo (Mark → Inferno, Slow → Thorned path, Swap → Barrier trap) instead of isolated buttons.  
**MECHANIC:** `effectParams` / a small `SpellInteraction` table keyed by **ids**, never names. Interactions already hinted: `isMark` (×2 next hit), Swap, Barrier, DoT stacks (`engine/dotStacks.ts`). Publish 6–8 official combos and let enemy kits teach them (feeds 003).  
**WHY_IT_IMPROVES_STRALT:** Catalog is wide but shallow. MIMA also shows `applyPushback` / `applyAttract` unused — 018 is the first interaction verb. Hold SPELL_PROPOSALS Waves 1–4 until 003 exists. Do not add a fifth reflect (CDA-017).  
**SYSTEMS_AFFECTED:** `engine/spellEngine.ts` / `castHelpers.ts` only via metadata; tooltips in spellbook. **No damage-formula rewrite.**  
**INFINITE_PROGRESSION_BEHAVIOUR:** New spells add rows to the table; old combos stay valid at any level.  
**IMPLEMENTATION_APPROACH:** 018 first (push/pull). Then document Mark, Slow, Barrier, Swap — all already flagged on `SpellConfig`. Swap × hazard (MIMA-001) must land with any Swap combo.  
**BALANCE_CONSIDERATIONS:** Do not add silent ×N damage. Mark’s ×2 is enough; document it.  
**QA_REQUIREMENTS:** Preview vs live-cast stay on explicit metadata.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 10 | 8 | 7 | 6 | 6 | 7 | 9 |

**What new decision does this create?** “Do I spend 2 AP on Mark now so next turn’s Inferno is the kill, or do I need the heal?”

---

### EXP-2026-09-01-016

**TITLE:** Wire `worldFeatures` overlay  
**CATEGORY:** WORLD  
**PLAYER_OPPORTUNITY:** On a map, choose a path that accepts or refuses a rare tile / patrol / event — after the 22 modifiers have been seen many times.  
**MECHANIC:** `engine/worldFeatures.ts` already defines rarity weights, relative difficulty, and feature ids (file **1913** lines; CDA: 52 `WF-*` rows). After `finalizePlayableLayout`, roll ≤3 features (`MAX_ROLLED_FEATURES`), place on legal floor cells (spawn ±3 and portals excluded), re-run solvability. Death Realm stays quiet. Credits stay on `applyRewards`.  
**WHY_IT_IMPROVES_STRALT:** The catalog and tests exist and do nothing. Wiring **one** existing slot is cheaper than inventing a thirteenth modifier or a 53rd `WF-*` row (CDA-018 freeze). Relative difficulty is vs **same-tier** content — compatible with no level cap.  
**SYSTEMS_AFFECTED:** `worldFeatures.ts` (already); new placement helper; WX one-line after finalize. **`mapGen.ts` stays closed** (1,937 lines; #331 destack). Do not append Wave 4 world-dynamics rows from #344 until one live feature exists.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Rarity weights + relative bands, never “unlocks at level N”. Append-only feature table.  
**IMPLEMENTATION_APPROACH:** One slot type first (`tile`), then `encounter`, then `event`. HP taxes are **fractions of current max HP** (already in the module).  
**BALANCE_CONSIDERATIONS:** Do not stack Titan's Vigor + Blood Moon ×1.25 + extreme feature + elite on band 0. Reward multipliers on the existing victory grant only.  
**QA_REQUIREMENTS:** `evaluateSolvability` still passes; Death Realm / rest maps do not roll features; dungeon-chain snapshot unchanged; lava/spikes still `recordInBattleChallengeDamage`.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 7 | 8 | 9 | 7 | 6 | 7 | 5 | 10 |

**What new decision does this create?** “The seam tax is 10% max HP — do I cross for the spell-bearing patrol, or take the long ice walk?”

---

### EXP-2026-08-31-009

**TITLE:** Finish unused modifiers + combo-only world rules  
**CATEGORY:** WORLD  
**PLAYER_OPPORTUNITY:** Read the modifier chip and change pathing / targeting / healing plan before the first turn.  
**MECHANIC:** Implement the two **still-unused** flags: `gravity_well` (attract 1 toward map center on move — reuse 018) and `fog_of_war` (UI vision radius). Differentiate `slime_flood` vs `frozen_terrain` (155–173 currently both `onMpCost * 2`). Do **not** re-implement `mirror_field` (already 20% ST reflect in `spellEngine.ts` 901–907) or `blood_moon` as another damage multiplier (already ×1.25 at 895 — convert via 022). Sync `mapModifiers.ts` announce text with live engine so the chip stops lying.  
**WHY_IT_IMPROVES_STRALT:** Fake or duplicate modifiers train the player to ignore the chip. Prior catalogs listed Blood Moon / Mirror Field as stubs; they are live numeric/reflect verbs. Remaining honesty work is gravity, fog, slime≠ice, and converting Blood Moon off DAMAGE.  
**SYSTEMS_AFFECTED:** `mapModifiers.ts` registry + announce strings; `MapModifiersPanel.tsx`; challenge `modifier_survivor`. Gravity Well should call the same attract helper as 018.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Second-modifier roll already exists. High tier can allow two **interacting** modifiers (Glass + Iron Curse).  
**IMPLEMENTATION_APPROACH:** One unused id per change. 022 handles Blood Moon. 015 handles Titan's Vigor. Do not add a fifth reflect.  
**BALANCE_CONSIDERATIONS:** Fog must not soft-lock targeting metadata. Gravity must respect walls / reachability.  
**QA_REQUIREMENTS:** Thorned / Void Rift still debit challenges on mouse **and** touch. Mirror Field 20% still records challenge reflect damage.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 7 | 8 | 8 | 5 | 5 | 5 | 6 | 9 |

**What new decision does this create?** “Fog is up — do I even cast this line, or walk in and Strike?”

---

### EXP-2026-08-31-005

**TITLE:** AI sophistication ladder (unused gates)  
**CATEGORY:** AI  
**PLAYER_OPPORTUNITY:** High-tier packs camp chokes, guard the backline, and focus-fire; low-tier packs still telegraph. The player reads `aiTier` from behavior, not from an HP bar.  
**MECHANIC:** Implement unused `ENEMY_AI_TIER_GATES` **inside** `decideEnemyAction` (`engine/enemyAI.ts`), not as more WX branches. Lethal lookahead / LoS reposition / backline protect are **global on** (`gameConstants.ts` 224–258) — gate them by `enemy.aiTier` so low-level fights stay readable. Follow [`ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md); do not rewrite the 2,580-line module in one PR. Do not grow it for Wave 4 AI sheets (#351).  
**WHY_IT_IMPROVES_STRALT:** The brief prefers AI sophistication over HP. The knobs exist; they are not a progression curve.  
**SYSTEMS_AFFECTED:** `enemyAI.ts`, `gameConstants.ts` only.  
**INFINITE_PROGRESSION_BEHAVIOUR:** `computeAITier` already maps unbounded level → 1..10. After 900, keep tier 10 and add **pack** coordination (004) instead of a tier 11 damage stat. Do not “fix” the 30% random roll in the first AI PR (master-roadmap hold).  
**IMPLEMENTATION_APPROACH:** One gate per PR, with a deterministic `rng` fixture. Do not edit turn-advance in WX.  
**BALANCE_CONSIDERATIONS:** `instantKill` must use existing lethal lookahead, not a new damage formula. Betrayal 5% at tier 10 is enough.  
**QA_REQUIREMENTS:** Same `(enemy, ctx, rng)` ⇒ same `EnemyAction`. Summon lifespan still decrements on the summon’s own turn.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 8 | 6 | 6 | 8 | 6 | 10 |

**What new decision does this create?** “They will camp the choke — do I Barrier the corridor or Swap the kiter out of it?”

---

### EXP-2026-08-31-007

**TITLE:** Dungeon room types without rewriting mapGen  
**CATEGORY:** DUNGEONS  
**PLAYER_OPPORTUNITY:** At a fork, pick elite / shrine / branch / extract instead of “another 16×16 clear.”  
**MECHANIC:** After `snapshotDungeonChain` / `decideDungeonChainPortal`, tag the **next** map with `roomKind: "gauntlet" | "elite" | "shrine" | "fork" | "extract"`. Placement uses existing floor cells and portal filter (`engine/portalRules.ts`). Follow the teach → pressure beats in [`ENCOUNTER_EVOLUTION_2026-08-31.md`](../encounters/ENCOUNTER_EVOLUTION_2026-08-31.md). Later Tide/File/Clock rooms (#347) wait until 009 stubs/honesty are real.  
**WHY_IT_IMPROVES_STRALT:** Chain depth 3–5 is only a multiplier (`1.0 + depth * 0.25`) plus extra bodies. Room kinds create run-to-run stories.  
**SYSTEMS_AFFECTED:** `portalRules.ts`, dungeon refs, spawn extract. **`mapGen.ts` stays closed** (now 1,937 lines; #331 destack).  
**INFINITE_PROGRESSION_BEHAVIOUR:** Depth has no cap in the **table** even if a given run rolls 3–5. Later, `maxDepth` can grow with player tier.  
**IMPLEMENTATION_APPROACH:** Encounter overlay only. White sanctuary portal rules unchanged.  
**BALANCE_CONSIDERATIONS:** Elite rooms use 002 tokens, not Titan's Vigor +1000 HP. Completion bonus stays `maxDepth * 50` Doka on the lock.  
**QA_REQUIREMENTS:** Snapshot-before-cleanup still required; death/flee must not carry `roomKind`; boss rush still wins `getRunMode`.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 7 | 9 | 7 | 7 | 7 | 5 | 9 |

**What new decision does this create?** “Take the elite fork for a spell observe, or the shrine fork to keep the chain alive?”

---

### EXP-2026-09-02-017

**TITLE:** Honor Boss Rush `combinedMechanic`  
**CATEGORY:** BOSSES  
**PLAYER_OPPORTUNITY:** In a Rush room, choose a kill order that the pair actually punishes — not two independent solo kits standing next to each other.  
**MECHANIC:** `BOSS_RUSH_ROOMS` (`useBossRush.ts` 24–135) already names a `combinedMechanic` per room (heal-pawn, lava-poison while Rook lives, chain-charge, decoy king, …). Nothing in WX / `useBossAI` reads that field. Implement **one room at a time** as data-driven pair hooks (`onAllyCast`, `onAllyDeath`, `onTilePlaced`) keyed by `roomIndex` + boss ids — never by display name. Room 0 (Archbishop heals Pawn / Pawn resurges) is the teach room. Do not spawn `weeping_pawn_2` until it exists in `BOSS_IDS`.  
**WHY_IT_IMPROVES_STRALT:** Rush is the only structured multi-boss content. The table already describes the interesting game. Shipping HP±8% while the chip lies is the same anti-pattern as mute families. This is the first shippable slice of 011.  
**SYSTEMS_AFFECTED:** New `engine/bossRushPairHooks.ts` + tests; one-line dispatch from existing boss-turn / death pipeline. Do not retune jackpot Doka/XP. Do not grow `useBossSystem` if the hook table can live beside `bossKits.ts`. Hold Wave 5 / Table C (#367) until Room 0 is live.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Pair hooks are identity. Later 011 adds **tier-indexed extra slots** on the same bosses for overworld / high-band Rush repeats — not thicker HP.  
**IMPLEMENTATION_APPROACH:** Room 0 only in the first PR. Keep `completeBossRushRoom` progress-before-`applyRewards`. Lava abort still `resetBossRush`.  
**BALANCE_CONSIDERATIONS:** Resurge-to-50% must not loop if Archbishop is already dead. Do not compose pair hooks × Titan's Vigor × Blood Moon × level-diff.  
**QA_REQUIREMENTS:** Room-clear still writes progress **before** `applyRewards`; character must exist; `roomIndex == currentRoom` or `currentRoom - 1` still accepted; death/flee does not keep pair state.  
**PRIORITY:** P2  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 7 | 5 | 5 | 6 | 6 | 9 |

**What new decision does this create?** “If I ignore the Archbishop, the Pawn will stand back up — do I spend this Inferno on the healer?”

---

### EXP-2026-08-31-011

**TITLE:** Boss mechanic-pool scaling (not more HP)  
**CATEGORY:** BOSSES  
**PLAYER_OPPORTUNITY:** A high-level Archbishop fight adds a new arena rule or add pattern, not a thicker HP bar.  
**MECHANIC:** Each boss keeps phase 1/2 kits (`data/bossKits.ts`). A **tier-indexed mechanic slot** pulls from that boss’s `BossAbility` list. `getBossEffectiveStats` ±8% remains for fairness; it must not be the only high-level signal. Sheet: [`BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md). 017 lands Rush pair hooks first so overworld scaling has a hook registry to reuse.  
**WHY_IT_IMPROVES_STRALT:** Rush rooms already *describe* combined mechanics that are more interesting than the 8% curve. Reuse those as data.  
**SYSTEMS_AFFECTED:** `useBossAI.ts`, `useBossSystem.ts`, `bossDefaults.ts`. High regression — last in the queue after 017.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Mechanic slots 0..N from an append-only pool. No “final boss level.”  
**IMPLEMENTATION_APPROACH:** One boss, one extra slot, tests on the pure decision fn. Align Motoko `defaultBossConfigs` spell ids with `SPELL_ID_CATALOG` while touching that boss (PREREQ-J if stables change).  
**BALANCE_CONSIDERATIONS:** Do not compose `statMultiplier` × level-diff × Titan’s Vigor × Blood Moon. Jackpot room rewards stay the table values.  
**QA_REQUIREMENTS:** Room-clear still writes progress **before** `applyRewards`; lava abort still `resetBossRush`.  
**PRIORITY:** P3  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 7 | 6 | 8 | 8 | 7 | 10 |

**What new decision does this create?** “Phase 2 now drops shock tiles — do I hold the edge or bait the charge onto the brood?”

---

### EXP-2026-09-22-022

**TITLE:** Convert Blood Moon off ×1.25 damage  
**CATEGORY:** WORLD  
**PLAYER_OPPORTUNITY:** A Blood Moon map asks a mechanic question, not “my spells hit 25% harder.”  
**MECHANIC:** Replace `spellEngine.ts` 895 `bloodMoonMultiplier = 1.25` with one identity hook already proposed on the 09-02 009 card: player-only drain on kill **or** enemy-only enrage after first blood **or** an extra 002 elite roll. Keep the announce chip. Sync `mapModifiers.ts` 260–268 (currently empty hooks + vague “crimson tide” copy).  
**WHY_IT_IMPROVES_STRALT:** Blood Moon is live and is the same anti-pattern as Titan's Vigor: a DAMAGE reskin wearing a world-event name. CDA 2026-09-21 names it. Converting it is cheaper than inventing Fog, and it stops high-level design from treating modifiers as stat sticks.  
**SYSTEMS_AFFECTED:** `spellEngine.ts` one multiplier; `mapModifiers.ts` announce + hook; tests. No WX growth if the flag already flows through `ctx.isBloodMoon`.  
**INFINITE_PROGRESSION_BEHAVIOUR:** The new hook is level-agnostic. Do not scale the 1.25 with player level as a “fix.”  
**IMPLEMENTATION_APPROACH:** One PR, one hook. Do not retune Mirror Field, Titan's Vigor, or Glass Realm in the same change.  
**BALANCE_CONSIDERATIONS:** If converting to extra elite roll, wait until 002 exists or no-op the elite and use enrage instead. Do not stack with 015 on band 0.  
**QA_REQUIREMENTS:** Existing Blood Moon maps still announce; challenge damage / death pipeline still fire; Fury potion 1.25 stays independent; no Doka write.  
**PRIORITY:** P3  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6 | 6 | 6 | 4 | 3 | 5 | 6 | 8 |

**What new decision does this create?** “Enemies enrage after first blood — do I spread chips or commit the opening Inferno?”

---

### EXP-2026-09-01-015

**TITLE:** Convert Titan's Vigor off +1000 HP  
**CATEGORY:** WORLD  
**PLAYER_OPPORTUNITY:** A “Titan” map asks a mechanic question, not a thicker HP bar.  
**MECHANIC:** Replace `onBattleStart` +1000 HP / 1–5× damage (`mapModifiers.ts` 300–316) with one identity hook: e.g. first lethal hit becomes a wound (survive at 1 HP once per combatant) **or** an extra 002 elite roll. Keep the announce chip.  
**WHY_IT_IMPROVES_STRALT:** This modifier is the live proof of the anti-pattern the brief forbids. Leaving it trains high-level design toward HP.  
**SYSTEMS_AFFECTED:** `mapModifiers.ts` one definition + tests. No WX growth.  
**INFINITE_PROGRESSION_BEHAVIOUR:** The new hook is level-agnostic. Do not scale the +1000 with player level as a “fix.”  
**IMPLEMENTATION_APPROACH:** One PR, one hook. Do not retune other modifiers in the same change.  
**BALANCE_CONSIDERATIONS:** Wound-once must still lose to a second lethal (lava + strike). Do not combine with 016 extreme or 022 on band 0.  
**QA_REQUIREMENTS:** Existing Titan maps still announce; challenge damage / death pipeline still fire on the second lethal; no Doka write.  
**PRIORITY:** P3  
**STATUS:** PROPOSED  

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 6 | 6 | 4 | 3 | 5 | 6 | 8 |

**What new decision does this create?** “They get one cheat-death — do I save the Inferno for the second hit, or chip first?”

---

## Do not build

- New enemy **ids** that only change HP/ATK. Use family × variant × elite × kit. Do not add Register-lore `Crimson Spawn` / `Shadow Lurker` / `Storm Caller` as stat skins.
- Wave 2 / 3 / 4 families, spell ids, encounter rooms, or `WF-*` rows **before** 021, 014, 019+F, 018, and 003. Open PRs #342 / #344 / #347 / #348 / #349 / #351 / #367 / #371 are **Hold**.
- A fifth reflect (Mirror spell + Void Mirror + Mirror Field + boss Reflect Shield already exist).
- A maximum player level, New Game+, or “endgame bracket.”
- High-level design that is only larger `level * 8 + 20` HP / `level * 2 + 3` damage (`WX` 5831–5833), Titan’s Vigor +1000, or Blood Moon ×1.25.
- Rewrites of `mapGen.ts`, RAF, turn-advance, or `calcScaledDamage`.
- A second recap, a second persist lock, or rewards via `updateCharacter`. GameKey shop is not a second Doka mint.
- Name-based spell logic.
- Shipping admin / debug as player UI.
- `level_50`-style achievements that imply a finish line.
- The SPELL_PROPOSALS ids **before** 003 — they would be born already-owned.
- Retuning `100 * 2^(N-1)` as “expansion.” That is a progression-economy decision, not a content card.
- Motoko Character schema by editing frozen `20260831` / `20260901` `NewActor`s. New stables = later file after deploy confirmation.
- Restacking `WorldExploration.tsx` / `challengeCompletion.ts` while **#327** is open, or `mapGen.ts` while **#331** is open.
- 019 without PREREQ-F (queens become Blood-Mend healers).
- Rewriting Enemy Register from lore into a live bestiary.
- Fighting #366 on `EXPANSION_PROPOSALS_2026-09-02.md` or rewriting README while #333 / #346 own it.

---

## Recommended implementation order

1. **021 Family-preferred chassis** — `spawnPolicy.ts` only; readable identity this week; no #327 race.
2. **014 Mute-family hooks** — decisions this week; extract ember/tide/void; do not rewrite Register.
3. **PREREQ-A + PREREQ-F + 019** as **one** PR after #327 (or a one-line WX argument). Unlocks authored kits without the healer trap.
4. **001 Family role kits** — turns the 30% family roll into kits.
5. **020 `kill_leader_last`** — after #327 releases `challengeCompletion.ts`.
6. **018 Push/pull on existing ids** — occupancy already tested; creates positioning combos without Motoko.
7. **003 Observed-spell discovery** — after PREREQ-J (later EOP file + deploy confirmation). Needs 001 so there is something worth observing.
8. **002 Elite tokens** + **004 Pack composition** — once kits exist, elites and roles multiply them.
9. **008** as the scoreboard for 001/003. **016** next for world variety (one live `WF-*`, freeze the rest). **009** gravity/fog + slime≠ice. **017** then **011**. **022 / 015 / 005 / 007** last.

Combinatorial target once 021+014+019+001+002+003+004+009/016+018 are live:

```
family × preferred chassis × relative band × piece variant × aiTier × kit band
  × elite token × pack role × map archetype × map modifier × world feature × displacement verb
```

That is still the expansion plan. Not a hundred near-identical enemies. Not another Wave-N sheet.
