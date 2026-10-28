# Stralt expansion catalog — 2026-10-28

**Author:** Expansion Director (cron `0 */24 * * *`, automation `3f31b18f-a492-11f1-a7d1-d6b4613131ce`)  
**This run:** twentieth catalog. Re-rank against `origin/main` `0f5363f` (`Merge pull request #332` — accepted-challenge HUD). Author-date on that tip is **2026-09-03**. Calendar: 2026-10-28.  
**Prior living catalog on `main`:** [`EXPANSION_PROPOSALS_2026-09-02.md`](./EXPANSION_PROPOSALS_2026-09-02.md) (`HEAD` then `58302bc`).  
**Unmerged sibling catalogs:** PR **#366** (09-21; 019/020), **#397** (09-22; 021/022), **#453** (09-23; 023/024), **#510** (09-24; 025/026), **#573** (09-25; 027/028), **#623** (09-26; 029/030), **#665** (09-27; 031/032), **#751** (09-28; 033/034), **#793** (09-29; 035/036), **#823** (10-21; 037/038), **#875** (10-22; 039/040), **#944** (10-23; 041), **#991** (10-24; no new ID), **#1052** (10-25; no new ID), **#1112** (10-26; no new ID), **#1188** (10-27; no new ID) — same `HEAD`, still open. This file **adopts** 019–041 rather than reminting them.  
**Earlier catalogs on `main`:** [`EXPANSION_PROPOSALS_2026-09-01.md`](./EXPANSION_PROPOSALS_2026-09-01.md) (#192), [`EXPANSION_PROPOSALS_2026-08-31.md`](./EXPANSION_PROPOSALS_2026-08-31.md) (#118).  
**Gameplay / production code:** not modified.

All seventeen 08-31 / 09-01 / 09-02 cards remain **PROPOSED**. 019–041 remain **PROPOSED**. None shipped. None superseded. **This run mints no new `EXPANSION_ID`.**

`README.md` still indexes the 09-01 catalog. Older open PRs own that file. This run does not touch `README.md` / `AGENTS.md` / `ARCHITECTURE.md` / `WorldExploration.tsx` / `mapGen.ts` / `challengeCompletion.ts` / `targeting.ts` / the 09-02 catalog / the 09-21…10-27 catalogs (#366 / #397 / #453 / #510 / #573 / #623 / #665 / #751 / #793 / #823 / #875 / #944 / #991 / #1052 / #1112 / #1188).

Score used for ranking (unchanged):

```
SCORE = PLAYER_VALUE + TACTICAL_DEPTH + REPLAYABILITY + NOVELTY
      + INFINITE_PROGRESSION_COMPATIBILITY
      − IMPLEMENTATION_COMPLEXITY − REGRESSION_RISK − BALANCE_RISK
```

Each axis is 1–10. A proposal is only strong if it creates a **new player decision** and multiplies existing axes (family × relative level × variant × AI tier × spell pool × elite × composition × map × modifier) instead of adding another HP-scaled clone.

There is **no character level cap**. XP continues `100 * 2^(N-1)`. Encounter generation must keep a below / near / equal / above distribution via the existing tier spawn. Higher progression must add AI, kits, variants, elites, synergies, environment, and objectives — not only larger HP and damage.

---

## Delta since 2026-10-27

`main` did **not** move. #366 / #397 / #453 / #510 / #573 / #623 / #665 / #751 / #793 / #823 / #875 / #944 / #991 / #1052 / #1112 / #1188 ranked the same `0f5363f`. Calendar gap since last Expansion Director file: **1 day**. Frozen tip age: **55 days**. No merge, no expansion implementation, no new `main` commit.

| Fact | Evidence |
| :--- | :--- |
| `main` still `0f5363f` | `git rev-list --count 0f5363f..origin/main` = **0**. Author-date 2026-09-03 02:28 +0200. Cards did not ship off-branch. Re-verified live hooks on this `HEAD`. |
| Queue grew; bottleneck is still merge | Open drafts vs `main`: **886** at catalog start (`is:pr is:open`). #1188 counted **831**; quality audit **#1106** counted **774** at 19:01Z 10-25. Same-day 10-27 flock added **55** PRs (`created:>=2026-10-27`). Newest at catalog start: **#1217**. Same-hour 10-28 flock may continue while this file is gated. Oldest blockers unchanged: **#327** Striker AoE (`WX` / `targeting.ts` / `challengeCompletion.ts` / `enemyAI.ts`; mergeable **dirty**), **#331** portal destack (`mapGen`; mergeable **dirty**). Twin **#370** restacks the same Striker gate (mergeable **clean**). |
| #1188 is now a non-draft | 10-27 catalog is **MERGEABLE** and no longer a draft, still unmerged. Adopt that re-rank. Do not fight that PR on `EXPANSION_PROPOSALS_2026-10-27.md`. |
| Overnight integrity flock is not a ship | After #1188: leftover-crumb snaps **#1174** Latch Gate / **#1201** Pendulum Censer / **#1209** Hourglass Arch / **#1213** Shift Slab; leftover spell-level remount-keep **#1215**; advertised-execute honesty **#1182** Void Rift / **#1199** Mending Mist / **#1200** Iron Curse / **#1202** Swift Winds / **#1203** Titan's Vigor +1000 HP / **#1207** Doka Fever / **#1208** Titan's Vigor 1–5× / **#1210** Arcane Overflow / **#1216** Pale Archivist Glyph Trap / **#1217** Broodmother larva-explode; summon-control Inferno/CD honesty **#1205** / **#1206** / **#1211** / **#1214**; Eternal Pawn kit-first tests **#1204** / **#1212**; battle-floor highlight paint extract **#1196**. Those drafts do **not** wire `worldFeatures` into WX and do **not** ship 027 / 038 / 015 / 021 / 014. Leftover-crumb snaps are map integrity. Persist-keep PRs are wallet / upgradeSpell hygiene. Honesty PRs lock advertised multipliers (including the Titan's Vigor anti-pattern 015 wants to **convert off**). Hold. |
| Design flock is still Hold | Same-hour 10-27 sheets after #1188: Wave 19 elites **#1189**, skip Health telemetry matrix **#1191**, enemy AI increment **#1192**, admin drift **#1193**, encounter catalog **#1195**, long-horizon **#1197**, Wave 19 discovery **#1198**. Earlier same-hour 10-27 (already noted on #1188): enemy/boss admin **#1163**, CDA **#1167**, VAL **#1169**, Wave 20 bosses / Rush Table R **#1170**, data-evolution tests **#1171**, Wave 19 WDD **#1172**, MIMA **#1173**, plus MTD **#1186** / spell admin **#1187** / Wave 19 spells **#1177** / formations **#1176** / PX **#1175**. Do **not** implement from those. Do **not** mint Wave-19/20 family / `WF-*` / spell / Rush-R ids. |
| Engineering-health on the queue | Weekly changelog **#712** is still 2026-W39. Quality audit **#713** (09-20…09-27) is still open; later weekly **#1106** (10-18…10-25) is also a draft. TBC on `main` is 09-02 `WAITING_FOR_TELEMETRY`. Latest open TBC is **#1165** (10-27); **#1108** / **#1053** / **#994** / **#871** still waiting. 0 collectors / 0 rows. **#1191** skipped a sixteenth Health telemetry matrix — that is a dashboard skip, not collectors. |
| Expansion bottleneck is merge, not missing IDs | 001–041 already specify ship-next. This run does **not** invent Wave-20 families and does **not** implement from the overnight flock. It does **not** mint 042. |
| Why no new ID | Every named `ENEMY_AI_TIER_GATES` key that creates a new player decision already has a first-ship slice (028 / 036 / 037 / 039 / 040 / 041). Remaining first-ship leftovers are all gated: 006 `modifier_survivor` / `interrupt_channels` queue on **#327**; WX erratic/betrayal constant-wire (`15508` / `15595`) is hygiene with **no new player decision** and **#327** owns WX; pack `focusTargetId` scoring and charger/flanker overkill **call-site adds** wait until **041 is live on `main`**. Third elite, third `WF-*`, Creeping Ash, Rush rooms 1–9 stay held while 025/032 and 027/038 are unshipped. Leftover-crumb snaps, persist-keep chains, advertised-execute honesty (including Titan's Vigor / Glyph Trap / Broodmother), and paint extracts do not wrap an unused helper into a new player decision. |
| Blood Moon / Mirror Field are **live** | Unchanged: `spellEngine.ts` **895** Blood Moon ×1.25 player non-heal damage; **901–907** Mirror Field 20% ST reflect. Registry hooks in `mapModifiers.ts` 260–277 remain empty. Gravity Well / Fog of War still unused (`WX` 2324–2329 `_isGravityWell` / `_isFogOfWar`). |
| Slime ≡ Frozen | Both still `onMpCost: (c) => c * 2` (`mapModifiers.ts` 155–173). Dual-roll currently stacks to **4 MP/tile**. Two chips, one rule, until **033**. |
| Family paper stats lie twice | Overlay still multiplies HP/damage (`spawnPolicy.ts` 261–272). Battle start then **also** overwrites RES/SP/CHC via `computeEnemyStats` (`WX` 11898–11902) and HP via `calcEnemyMaxHp` (`WX` 11970–11974). PREREQ-H is identity-only, not “keep the overlay numbers.” |
| `inferArchetype` never returns `summoner` | Inference (`enemyAI.ts` 447–477) never emits it. Live summoner path is the `isSummoner` flag (`WX` 11932–11942). 023 must keep that flag. Healer if `healAmount > 0` **or** `spellType === "heal"` (`enemyAI.ts` 449–452). |
| 019 without PREREQ-F is a trap | Band-1 queens gain `starter-heal` (`enemyAI.ts` 176–178) and become healers. **Ship 019 with F in the same PR.** |
| Register is lore | Per-row copy still mismatches the three live hooks. 014 must not convert the register into a bestiary. |
| No live elite token | `isElite` has **zero** matches under `src/frontend/src`. 025 (`shielded`) is still the first token; 032 is the second (`hexer`). This run does **not** mint a third elite while those two are unshipped. |
| `combinedMechanic` still copy | `useBossRush.ts` 19–135. Zero engine readers. Room 0’s advertised heal/resurge is **034**. |
| Nine challenges still numeric | `challengeCompletion.ts` 11–20. 020 / 030 / 031 wait on **#327**. This run does **not** mint `modifier_survivor` or `interrupt_channels`. |
| Overkill retarget is **global**, not gated | `applyOverkillSpread` (`enemyAI.ts` 695–718) runs whenever `AI_OVERKILL_SPILL_ENABLED` is true (`gameConstants.ts` 231 — globally on). It **switches target**; it does **not** splash leftover damage. Call sites: `decideCaster` 956, `decideGeneric` 1538. Charger / flanker / berserker / generic-melee do **not** call it. `ENEMY_AI_TIER_GATES.bottleneckControl` is **8** (`gameConstants.ts` 207) and has **zero** readers until **041** ships. |
| LoS reposition / lethal lookahead still global | Until 039 / 040 ship. `escapeRoute` 6 and `instantKill` 9 still have zero readers. |
| Erratic / betrayal already have magic numbers in WX | Leader-death erratic at `WX` **15508** (`aiTier >= 5`); 5% betrayal at `WX` **15595** (`aiTier >= 10`). Those match `ENEMY_AI_TIER_GATES.erratic` / `betrayal` but do **not** read the constant. Do **not** mint a WX restack while **#327** owns the file. |
| Pack focus id is written, not read | `setFocusTargetId` / `markFocusSet` fire at the two overkill sites (`enemyAI.ts` 957–958, 1539–1540). Scoring never reads `focusTargetId`. That is unused pack coordination — wait until 041 is live so focus-marking is tier-gated first. |
| Kit band still NaN | `buildEnemyKit(enemy.pieceType, currentMap.levelZone)` at `WX` **11920**. `levelZone` is `{ name, minLevel, maxLevel }` (`WX` **4683–4687**). `Math.floor(levelZone)` (`enemyAI.ts` **199**) → every `z >= 1` fails. Numeric `setCurrentZoneTier` exists at 4680 and is **not** passed in. |
| Family still a sticker | `maybeApplyEnemyFamilyVariant` (`spawnPolicy.ts` 279–286). Chassis stays a random chess piece. Four mute families. Three live hooks only: ember melee burn / tide melee −1 MP (`WX` 16789–16818); void_mirror 25% pre-crit reflect (`castHelpers.ts` 336–345). |
| Summoner is still a per-body coin flip | `WX` **11932–11942**: `0.12 + playerLevel * 0.02`, 50/50 wolf or archer. Can mark every enemy a summoner. |
| Push / pull still unused | `applyPushback` / `applyAttract` at `occupancy.ts` **482 / 537**. Callers: tests only. WX occupancy import does not name them. |
| `worldFeatures` still tests-only | 1913 lines, 52 `WF-*` rows. Ember Vein authored (`WF-HAZ-EMBER_VEIN`, `hpTaxPctOfMax: 0.04`; catalog also lists `extraHazardCount` 3–6 — **027 forbids the spray**). Glyph Plate authored (`WF-TRP-GLYPH_PLATE`, `hpTaxPctOfMax: 0.08`; catalog also lists `extraHazardCount` 1–2 — **038 forbids the spray**). No WX import. **#1030** / **#1071** / **#1086** / **#1093** / **#1103** / **#1146** / **#1154** / **#1161** / **#1174** / **#1201** / **#1209** / **#1213** leftover-crumb snaps are map integrity, not 027. **#1216** Pale Archivist Glyph Trap is advertised-boss honesty, not 038. |
| Unused AI gates | `ENEMY_AI_TIER_GATES` (`data/gameConstants.ts` 200–209) has **zero** readers in `enemyAI.ts` except a comment at 1422. 028 is the first gate; 036 is the second; 037 is the third (`groupTactics`); 039 is the fourth (`escapeRoute`); 040 is the fifth (`instantKill`); 041 is the sixth (`bottleneckControl`). Erratic / betrayal remain WX magic numbers. **No unused named gate remains to wrap.** |
| Surfaces | `WorldExploration.tsx` 19,213; `mapGen.ts` 1,937; `enemyAI.ts` 2,580; `AdminDashboard.tsx` 8,280; `main.mo` 3,903; `worldFeatures.ts` 1,913. EOP chain `check-limit = 5`; GameKey on frozen `20260901`. |

Practical XP horizon: unchanged. Mid-teens exhaust intended income; level 25 is ~1.678e9 XP. Not a level cap. Do **not** retune the curve as expansion. Content must work at **1–20** and stay valid if someone is still climbing. High `ENEMY_AI_TIER_GATES` values (bottleneckControl 8 → enemy level 401–600) appear in the 1–20 band only via the existing 30% `computeAITier` variance (`combatMath.ts` 48–50). That noise is the low-level tell. Do not lower the authored gate to “fix” 1–20 rarity.

---

## Why this run mints no `EXP-2026-10-28-042`

A new ID is only justified when it wraps an **existing** unused helper / named knob and creates a **new player decision** without racing #327 / #331 / #370, without reminting 019–041, and without adding a third elite / third `WF-*` / fourth 006 predicate. `main` did not move. No card shipped.

Checked leftovers (including 10-27 overnight flock):

| Candidate | Why not minted |
| :--- | :--- |
| 006 `modifier_survivor` (Blood Moon / Mirror Field already live) | Extends `ChallengeCondition` in `challengeCompletion.ts`. **#327** owns that file. 020 / 030 / 031 already queue there. A fourth 006 predicate while those three are unshipped inflates the pile. |
| 006 `interrupt_channels` | Same file, same #327 race. No live channel-interrupt verb to wrap yet. |
| WX erratic / betrayal constant-wire | Behavior already fires at `aiTier >= 5` / `>= 10` (`WX` 15508 / 15595). Reading `ENEMY_AI_TIER_GATES.erratic` / `betrayal` instead of the literals does **not** create a new decision. **#327** owns WX. |
| Pack scoring reads `focusTargetId` | The two overkill sites already write the id. Teaching scoring to pile on **before 041 is live** makes every low-tier caster/generic focus-fire after an ungated retarget. Wait until 041 gates the write. |
| Add `applyOverkillSpread` to charger / flanker / berserker / generic-melee | Those sites never called the helper. Adding them before 041 is live extends **global** retarget. Wait until 041; still do not splash. |
| Treat leftover-crumb snaps (#1174 / #1201 / #1209 / #1213, plus the older #1030…#1161 chain) as 027 / Creeping Ash | Those PRs snap leftover crumbs. They do not import `worldFeatures.ts` into WX. 027 / 038 remain the first tiles. |
| Treat #1196 battle-floor highlight paint extract as 016 / 027 | Paint module. No tax cell, no player decision, RAF-adjacent. Not Ember Vein. Same class as #1076 / #1109. |
| Treat leftover spell-level remount-keep (#1215) as mastery / 003 | Persist lock hygiene for `upgradeSpell`. No observe path. |
| Treat advertised-execute honesty (#1182 / #1199 / #1200 / #1202 / #1207 / #1210 / #1205–#1214) as a new modifier | Those PRs commit already-advertised multipliers / CDs / ticks. No new combinatorial axis. |
| Treat Titan's Vigor honesty (#1203 / #1208) as 015 | Those PRs **commit** advertised +1000 HP and 1–5× rolls. 015 is the conversion **off** that anti-pattern. Honesty of the live hook is not the conversion. |
| Treat Pale Archivist Glyph Trap honesty (#1216) as 038 | Boss advertised 15 damage on a named trap. 038 is one-cell `WF-TRP-GLYPH_PLATE` (8% max-HP, world overlay). Different surface. |
| Treat Broodmother larva-explode honesty (#1217) as a family / elite | Boss advertised contact venom. Not 014 / 025. |
| Eternal Pawn kit-first tests (#1204 / #1212) | Lock existing kit-vs-stamp order. Not 021 / 019. |
| Wave 19/20 family / spell / `WF-*` / Rush Table R sheets | Hold until 021/014/019+F/018/003/027 exist. Do not re-sheet. |
| Third elite / third `WF-*` / Rush rooms 1–9 / second Ember-style slayer | First tokens (025/032), first tiles (027/038), room 0 (034), and 035 are unshipped. |
| Invent a new `ENEMY_AI_TIER_GATES` key (kamikaze, threat) | Named-gate ladder is exhausted. Kamikaze / `ENEMY_THREAT_VALUES` already have live readers. Do not encode `if (level >= X)`. |

The strongest current opportunities are therefore the **already-authored** cards below. Implementers pick one ID. This catalog’s job today is to re-verify that ranking against frozen `main`, not to mint a twin.

---

## Sibling designs (owned surfaces — do not duplicate)

| Sheet | Owns | Director card it details |
| :--- | :--- | :--- |
| [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md) | Wave 1 family sheets, variant floors, pack recipes | 001, 002, 004, 014, 021, 023, 025, 032 |
| Wave 2–20 elite / family / SDE / WDD sheets (open drafts through **#1217**) | More family / discovery / `WF-*` / Rush-R ids | **Hold** until 001/014/018/019/021/027 exist |
| [`SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md`](./SPELL_DISCOVERY_ECOSYSTEM_2026-08-31.md) | Observe → win → unlock; Wave 1 pool | 003 |
| [`SPELL_ADMIN_DESIGN_2026-09-02.md`](./SPELL_ADMIN_DESIGN_2026-09-02.md) | `ownedSpellIds` / `observedSpellIds` persist types | 003 persist (PREREQ-J) |
| SPELL_PROPOSALS 08-31…09-02 + later drafts | Tactical gap-fill ids | **Hold** until 003 ships |
| [`ENEMY_AI_EVOLUTION.md`](../ENEMY_AI_EVOLUTION.md) + later increments | Unbounded AI modules | 005, 028, 036, 037, 039, 040, 041 |
| [`BOSS_AND_SPELL_DISCOVERY.md`](../design/BOSS_AND_SPELL_DISCOVERY.md) + later Rush tables | Boss sheets / Rush Tables | 011, 017, 034 |
| ENCOUNTER_EVOLUTION 08-31…09-02 + later drafts | Teach → pressure dungeon beats | 007, 010, 026 |
| [`WORLD_DYNAMICS.md`](../WORLD_DYNAMICS.md) + `engine/worldFeatures.ts` + later WDD drafts | Rarity / relative-difficulty overlay | 009, 016, 022, 024, 027, 029, 033, 038 |
| ENEMY_FORMATIONS 08-31…09-02 + later drafts | Synergy packs | 004, 023 |
| [`MECHANIC_INTERACTION_MATRIX_2026-09-02.md`](./MECHANIC_INTERACTION_MATRIX_2026-09-02.md) + later MIMA drafts | Live join gaps | 013, 018, 024, 029, 038 × 018 |
| [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md) (on `main`: 09-02) + later MTD drafts | P0 integrity before expansion PRs | Process, not content |
| [`PX_COHERENCE_AUDIT_2026-09-02.md`](./PX_COHERENCE_AUDIT_2026-09-02.md) + later PX drafts | Register / modifier / discovery honesty | 014 QA; Register is lore; 033 honesty |
| [`LONG_HORIZON_2026-09-02.md`](./LONG_HORIZON_2026-09-02.md) + later LHIPS drafts | XP wall; kit NaN; summoner saturate | PREREQ-A/B/C; do not retune curve |
| [`CONTENT_DIVERSITY_AUDIT_2026-09-02.md`](./CONTENT_DIVERSITY_AUDIT_2026-09-02.md) + later CDA drafts | Live spawn is sticker + NaN kits; Blood Moon live; no elites; Slime≡Frozen | Confirms 001/014/019/021/022/023/025/032/033 |
| [`TELEMETRY_BALANCE_2026-09-02.md`](./TELEMETRY_BALANCE_2026-09-02.md) + open **#1165** / **#1108** / **#1053** / **#994** / **#871** | STATUS WAITING_FOR_TELEMETRY | No demand claims |
| Unmerged **#366** … **#1188** | 09-21…10-27 rankings + 019–041 | Adopted here |
| Quality audit **#713** / **#1106** | Process; 0 merges since 09-03; 774–886 drafts | Do not implement from auditor ACTION_IDs |

Implementers pick **one** director ID. Follow the sibling sheet for that ID. Do not open a second family / discovery / boss catalog. Do not land Wave 2+ data before the Wave 1 card it multiplies. Full verbatim cards for 001–028 live on **#573**; 029 / 030 on **#623**; 031 / 032 on **#665**; 033 / 034 on **#751**; 035 / 036 on **#793**; 037 / 038 on **#823**; 039 / 040 on **#875**; 041 on **#944**. This file restates scores and ship rules. It does **not** author a new card.

---

## Current-state inventory (re-verified on `0f5363f`)

### Progression (no character level cap)

- XP curve is unbounded: `100 * 2^(N-1)` (`utils/xpCurve.ts`). HUD saturates `xpForNextLevel` at `Number.MAX_SAFE_INTEGER` from level 48; persist stays bigint / Motoko `Nat`.
- Enemy levels use `pickEnemyLevelFromTiers` (`engine/combatMath.ts` 54–107): default weights 60% same tier / 20% ±1 / 10% ±2 / leftover ±3..6. This **already** produces below / near / equal / above the player. Keep it.
- Hidden utility clamp: `maxTier = Math.floor(999 / ts)` at `combatMath.ts` 58. Past player level ~1000 the distribution stops climbing. `threeOrMorePercent` is **not read** in the picker (leftover `_threeMore` fills the bucket). Admin still edits the field.
- `computeAITier` (`combatMath.ts` 36–51) plateaus at 10 after enemy level 900, with a 30% full-random roll. Plateau is acceptable **if** tier 10 keeps unlocking mechanics, not more HP.

### Enemies

- Seven families typed (`types/gameTypes.ts` 12–20): `wraith_bishop`, `iron_golem`, `plague_rat`, `ember_knight`, `tide_shade`, `bone_scribe`, `void_mirror`.
- Spawn writes a random chess piece, then `applyFamilyVariantsToRoster` (`spawnPolicy.ts` 289+, `WX` 5864) rolls 30% and multiplies paper HP / damage / RES / SP. Catalog `ap` / `mp` still unused. **Family does not force `pieceType`.**
- Battle start then **re-rolls** `sp` / `sr` / `init` / `res` / `chc` from `computeEnemyStats` (`WX` 11898–11902) and sets combat HP from `calcEnemyMaxHp(level)` (`WX` 11970–11974). **Family HP, RES, and SP never reach the fight.** No `isElite` / champion token.
- Three live combat hooks only: `ember_knight` melee burn and `tide_shade` melee −1 MP (`WX` 16789–16818); `void_mirror` 25% pre-crit reflect (`castHelpers.ts` 336–345). The other four families are art + dead paper.
- Piece-type kits exist (`engine/enemyAI.ts` 163–185) and grow at zone 1 / 2. Battle start still passes the LevelZone **object**. **Every overworld enemy is stuck on the one-spell zone-0 kit.**
- `inferArchetype` (`enemyAI.ts` 447–477) returns `"healer"` if any assigned spell has `healAmount > 0` or `spellType === "heal"`. The union includes `summoner`; inference **never returns it**. Live summoner path is `enemy.isSummoner` → `decideSummonerAction`.
- `ENEMY_AI_TIER_GATES` (`data/gameConstants.ts` 200–209) names `erratic`, `groupTactics`, `instantKill`, `betrayal`, `chokepointCamp`, `escapeRoute`, `bottleneckControl`, `defensiveRetreat`. **Zero references in `enemyAI.ts`** except a comment at 1422. Caster / flanker / generic already retreat below 30% HP **ungated** (929 / 1313 / 1509). Healer interpose is **ungated** (1137–1163). LoS reposition, lethal lookahead, and overkill retarget are **ungated**. Master AI toggles (backline protect, overkill spill) are **global on**. WX already magic-number-gates erratic at 5 and betrayal at 10.
- Summoner chance is `0.12 + playerLevel * 0.02` (`WX` 11932–11942; constants `gameConstants.ts` 298–299). Saturates by mid-40s **and** can fire per body. `ENEMY_SUMMON_CAP = 2` contains the board, not the pack.

### Spells / discovery

- Frontend catalog: 32 ids in `data/spellData.ts` (`physical_attack` plus 31 named spells). Every `starterSpells` entry is `isBaseSpell: true` (`WX` 2395–2407). No observe / kill / achievement / elite unlock path.
- Five summon spells already carry `isSummon: true` (`summon-dire-wolf` / `sentinel` / `archer` / `bomber` / `wisp`). 031 keys off that metadata, not the name string.
- Backend `defaultSpells()` is a different six-spell set (`shadow_strike`, `soul_rend`, `vampire_bite`, `reflect_barrier`, `thunder_clap`, `void_collapse`). Dual catalogs.
- Targeting is metadata-driven (`isTileCastableLive`). New spells must stay on that contract.
- `applyPushback` / `applyAttract` have tests and **no** production callers. `void_collapse` still advertises pull.
- `spell-slow` (`spellData.ts` 354) is reserved for 033. `spell-weaken` (`spellData.ts` 334) is reserved for 032. `spell-mark` (`spellData.ts` 161) stays available for later elites — do not spend it in this run.

### Combat / world / dungeons / bosses

- 22 map modifiers. **Live in engine, empty in registry:** `blood_moon`, `mirror_field`. **Still unused:** `gravity_well`, `fog_of_war`. **Duplicate live hook:** `slime_flood` ≡ `frozen_terrain` (both MP×2). `titans_vigor` still +1000 HP and 1–5× damage. Open **#1203** / **#1208** commit those advertised hooks; they do **not** convert them (015 still open).
- `engine/worldFeatures.ts`: 52 `WF-*` rows, tests only, **no production caller**.
- Seven map archetypes. `mapGen.ts` stays frozen. Open **#331** owns destack.
- Dungeon chain is linear 3–5 maps. Depth extras are more bodies + tier boost (`spawnPolicy.ts` 27–28). No special rooms, no forks.
- 19 bosses, two phases. Boss Rush `combinedMechanic` is copy only. Room 0 (`pale_archbishop` + `weeping_pawn`, `useBossRush.ts` 25–35) already names the teach puzzle. Open **#1216** (Pale Archivist Glyph Trap honesty) is not 038.
- Challenges: nine numeric predicates (`challengeCompletion.ts` 11–20). Open **#327** owns this file.
- Achievements: 15 one-shots (`admin.mo` 309–325). `unstoppable` / `level_10` is a capped milestone. Rewards are Doka, never a spell. New condition keys must join `KNOWN_ACHIEVEMENT_CONDITIONS` (`adminSafety.ts` 306–322) or GameConfig seed rejects them.

### Engineering-health constraints

- No player telemetry. Do not claim live demand. Do not retune from `longHorizonSim`. Last TBC inspection (#1165 / #1108 / #1053 / #994 / #871) is still `WAITING_FOR_TELEMETRY`. Weekly health on the queue is still **#712** (2026-W39). Quality audits **#713** and **#1106** are still drafts; **#1106**’s one-sentence finding is that the flock doubled an unmerged backlog while `main` sat 52+ days. The 10-27 flock grew that backlog to **886** without moving `main`.
- New behavior belongs in `src/frontend/src/engine/*` or `src/frontend/src/utils/*` with tests; WX gets one-line wiring. **Do not grow WX while #327 is open.**
- Do not touch RAF, **map generation**, turn logic, or damage math (`AGENTS.md`). **Do not edit `mapGen.ts` while #331 is open.**
- Credits still go through `applyRewards`; spends / death through `saveBattleStats` on `createProgressPersist`. No second reward funnel. Feats grant Doka via `claimAchievementReward` on that lock — **never XP**.
- Discovery that writes ownership must enqueue on the persist lock **and** use PREREQ-J (a **new later** migration file after frozen `20260901`).
- Caffeine import gate + oldest-first stack-compat are CI.
- Client-trusted canister writes remain an architecture decision (AQA-2026-08-30-008), not an expansion.
- Do not add another unwired sidecar.

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

| Rank | EXPANSION_ID | Title | Category | SCORE | Priority | vs 10-27 |
| ---: | :--- | :--- | :--- | ---: | :--- | :--- |
| 1 | EXP-2026-08-31-001 | Family role kits (stop using families as HP skins) | ENEMIES | 30 | P0 | same #1 |
| 2 | EXP-2026-08-31-006 | Mechanic challenge catalog | PROGRESSION | 29 | P0 | same |
| 3 | EXP-2026-09-21-020 | First mechanic challenge: `kill_leader_last` | PROGRESSION | 29 | P0 | same |
| 4 | EXP-2026-09-01-014 | Mute-family combat hooks (four families have none) | ENEMIES | 28 | P0 | same |
| 5 | EXP-2026-08-31-002 | Elite / champion modifier tokens | ENEMIES | 28 | P1 | same |
| 6 | EXP-2026-08-31-004 | Pack role composition | ENEMIES / AI | 28 | P1 | same |
| 7 | EXP-2026-09-24-025 | First elite token: `shielded` | ENEMIES | 27 | P1 | same |
| 8 | EXP-2026-08-31-003 | Observed-spell discovery | SPELL DISCOVERY | 27 | P0 | same; PREREQ-J |
| 9 | EXP-2026-09-26-030 | First unused challenge: `no_hazard_steps` | PROGRESSION | 26 | P0 | same |
| 10 | EXP-2026-09-27-031 | First unused challenge: `no_summons` | PROGRESSION | 26 | P0 | same |
| 11 | EXP-2026-09-21-019 | Relative kit-band adapter (unlock authored piece kits) | ENEMIES | 25 | P0 | same; **must ship with F** |
| 12 | EXP-2026-09-22-021 | Family-preferred chassis overlay | ENEMIES | 25 | P0 | same; **ship with PREREQ-H** |
| 13 | EXP-2026-09-23-023 | One summoner slot per pack | ENEMIES / AI | 25 | P1 | same |
| 14 | EXP-2026-09-27-032 | Second elite token: `hexer` | ENEMIES | 25 | P1 | same |
| 15 | EXP-2026-10-22-039 | Gate LoS reposition on `escapeRoute` | AI | 25 | P2 | same |
| 16 | EXP-2026-10-23-041 | Gate overkill retarget on `bottleneckControl` | AI | 25 | P2 | same |
| 17 | EXP-2026-09-02-018 | Wire push / pull on existing ids | COMBAT | 24 | P1 | same |
| 18 | EXP-2026-08-31-010 | Optional tactical objectives | COMBAT | 24 | P1 | same |
| 19 | EXP-2026-09-25-027 | First world feature: Ember Vein tile | WORLD | 24 | P2 | same |
| 20 | EXP-2026-10-21-037 | Gate healer interpose on `groupTactics` | AI | 24 | P2 | same |
| 21 | EXP-2026-10-21-038 | First Glyph Plate trap (one cell) | WORLD | 24 | P2 | same |
| 22 | EXP-2026-09-28-033 | Differentiate Slime Flood from Frozen Terrain | WORLD | 24 | P2 | same |
| 23 | EXP-2026-10-22-040 | Gate lethal lookahead on `instantKill` | AI | 24 | P2 | same |
| 24 | EXP-2026-09-24-026 | First side objective: `contest_shrine` | COMBAT | 23 | P1 | same |
| 25 | EXP-2026-08-31-008 | Uncapped achievement / mastery ladder | PROGRESSION | 23 | P2 | same; first slice is 035 |
| 26 | EXP-2026-08-31-013 | Explicit spell-interaction layer | COMBAT | 23 | P2 | 018 first |
| 27 | EXP-2026-09-01-016 | Wire `worldFeatures` overlay (no mapGen rewrite) | WORLD | 23 | P2 | same; 027 first, then 038 |
| 28 | EXP-2026-09-29-035 | Repeating Ember Knight slayer (not `level_N`) | PROGRESSION | 22 | P2 | same |
| 29 | EXP-2026-09-23-024 | Wire Gravity Well via existing attract | WORLD | 22 | P2 | same |
| 30 | EXP-2026-09-25-028 | First AI gate: `chokepointCamp` | AI | 22 | P2 | same |
| 31 | EXP-2026-09-26-029 | First unused modifier: Fog of War vision cap | WORLD | 22 | P2 | same |
| 32 | EXP-2026-09-28-034 | Honor Rush room 0 `combinedMechanic` | BOSSES | 22 | P2 | same |
| 33 | EXP-2026-08-31-009 | Finish unused modifiers + combo-only world rules | WORLD | 21 | P2 | same; 024 then 029 then 033 |
| 34 | EXP-2026-08-31-005 | AI sophistication ladder (unused gates) | AI | 21 | P2 | same; 028…041; named gates exhausted |
| 35 | EXP-2026-08-31-007 | Dungeon room types without rewriting mapGen | DUNGEONS | 21 | P2 | wait for #331 |
| 36 | EXP-2026-09-02-017 | Honor Boss Rush `combinedMechanic` | BOSSES | 20 | P2 | first-room slice is 034 |
| 37 | EXP-2026-09-29-036 | Gate existing 30% retreat on `defensiveRetreat` | AI | 20 | P2 | same |
| 38 | EXP-2026-08-31-011 | Boss mechanic-pool scaling (not more HP) | BOSSES | 17 | P3 | same |
| 39 | EXP-2026-09-22-022 | Convert Blood Moon off ×1.25 damage | WORLD | 16 | P3 | same |
| 40 | EXP-2026-09-01-015 | Convert Titan's Vigor off +1000 HP | WORLD | 15 | P3 | same; **#1203/#1208 are not this card** |

**Ship-next (not the same as SCORE):** **021 + PREREQ-H** → **014** → **PREREQ-A + 019 + PREREQ-F (one PR)** → **001** → **025** (after 021) → **032** (after 025; not the same PR as 025) → **023** (after #327) → **020** (after #327) → **030** (after #327; same `challengeCompletion.ts` as 020 — union) → **031** (after #327; same file as 020/030 — union) → **018** → **024** (after walk freeze / 018) → **027** (Ember Vein; no `mapGen` punch; one cell, ignore catalog `extraHazardCount`) → **038** (after 027; reuse 027’s one-cell placer; one Glyph Plate, ignore catalog `extraHazardCount`) → **026** (after #327; no `mapGen` punch) → **028** (tiny `aiTierGates.ts` helper) → **036** (after 028; same helper — union) → **037** (after 036; same helper — union; enemy healer only) → **039** (after 037; same helper — union; caster/generic only) → **040** (after 039; same helper — union; enemy archetypes only; no new execute) → **041** (after 040; same helper — union; caster/generic only; **retarget, not splash**) → **029** (after targeting freeze / #327) → **033** (after Frozen/Slime walk-parity freeze; registry + Slow commit) → **034** (new `bossRushPairHooks.ts`; wait if death dispatch restacks WX / #327) → **035** (after 014 so Ember is a readable hunt; whitelist + `victoryAchievements.ts`; wait if the fire path restacks WX / #327) → **003** (PREREQ-J) → 002/004 remainder.

SCORE ranks opportunity size. Ship-next ranks what creates a player decision **this week** without Motoko schema, without growing `enemyAI.ts` for content tables, and without racing open WX / mapGen / challenge / targeting / walk-occupancy PRs.

021 before 019 because band-0 kits already differ by piece type: coupling family → preferred chassis works **today**, lives in `spawnPolicy.ts`, and does not wait on #327. Bundle PREREQ-H in that same PR.

Held this run (do not remint): 006 `modifier_survivor` / `interrupt_channels` / `only_observed_spell` (last needs 003). 005 erratic / betrayal constant-wiring in WX (already `>= 5` / `>= 10` at 15508 / 15595; wait for #327). Extending overkill retarget to charger / flanker / berserker / generic-melee (those sites do not call `applyOverkillSpread` today). Pack `focusTargetId` read-in-scoring (wait until 041 is live). Third elite token. `void_mirror` slayer rungs. Creeping Ash. Crumble Pillar. Rush rooms 1–9.

---

## Strongest current opportunities (decision first)

These are the cards an implementer should pick. Verbatim implementation text lives on the sibling PRs in the adopted table. Scores unchanged.

### 1. EXP-2026-09-22-021 + PREREQ-H — **ship-next**

**EXPANSION_ID:** EXP-2026-09-22-021  
**TITLE:** Family-preferred chassis overlay  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Read the board as “that bishop is a wraith; that rook is a golem” before kits exist.  
**MECHANIC:** Stamp a preferred `pieceType` from family in `spawnPolicy.ts` only. Overlay HP **and** RES/SP still die at battle start — couple PREREQ-H so the 30% roll is identity, not dead paper stats.  
**WHY_IT_IMPROVES_STRALT:** Family is a sticker today. Chassis is the cheapest combinatorial axis that already has art, kits, and AI archetypes.  
**SYSTEMS_AFFECTED:** `engine/spawnPolicy.ts` (+ tests). Do not grow WX. Do not restack #327.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Chassis identity is level-agnostic. Later 001 rows add band spells on top.  
**IMPLEMENTATION_APPROACH:** Table `family → preferredPieceType`. Keep the 30% roll. Stop treating overlay HP/RES/SP as combat stats (PREREQ-H in the same PR).  
**BALANCE_CONSIDERATIONS:** Do not re-apply family HP after `calcEnemyMaxHp`. Do not force every pack to one family.  
**QA_REQUIREMENTS:** Default-family packs unchanged; mixed-family packs keep Chebyshev spacing; battle-start HP still comes from `calcEnemyMaxHp`.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

**What new decision does this create?** “The golem is the cover piece — do I walk around the rook chassis, or eat the body-block?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 5 | 3 | 4 | 3 | 10 |

### 2. EXP-2026-09-01-014

**EXPANSION_ID:** EXP-2026-09-01-014  
**TITLE:** Mute-family combat hooks  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Read plague / bone / iron / wraith the way Ember / Tide / Void already force a read.  
**MECHANIC:** Extract the three live hooks into `engine/familyHooks.ts`. Four mute families use existing effect types only. Register copy stays lore, not a bestiary.  
**WHY_IT_IMPROVES_STRALT:** Four of seven families currently teach nothing. Hooks are identity, not HP.  
**SYSTEMS_AFFECTED:** New `engine/familyHooks.ts` + tests; one-line calls from `WX` 16789 and `castHelpers.ts` 336.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Hooks stay valid at any band. Later 001 rows add spells on top.  
**IMPLEMENTATION_APPROACH:** Table dispatch. Ids, not names. No new damage formula.  
**BALANCE_CONSIDERATIONS:** Rat DoT must not outrun Ember’s 3/3. Golem immunity is to **status**, not damage. No HP mult.  
**QA_REQUIREMENTS:** Mixed-family pack applies only the acting combatant’s hook; challenge damage still records ember/void reflect.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

**What new decision does this create?** “The golem shrugs poison — Inferno it. The rat is a stack race. The scribe’s first hex is the one I interrupt.”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 6 | 3 | 4 | 4 | 9 |

### 3. EXP-2026-09-21-019 + PREREQ-A + PREREQ-F — **one PR**

**EXPANSION_ID:** EXP-2026-09-21-019  
**TITLE:** Relative kit-band adapter  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Face the authored zone-1 / zone-2 piece kits that already exist and are dead (NaN band).  
**MECHANIC:** Pass a number (`R = enemy.level − player.level` or `floor((enemy.level-1)/tierSize)`), never the LevelZone object. **Must** ship with PREREQ-F or band-1 queens become healers.  
**WHY_IT_IMPROVES_STRALT:** Spell-pool depth is implemented and dead. This is the unlock, not a new table.  
**SYSTEMS_AFFECTED:** `WX` 11920 call site (one argument); `inferArchetype` 449–452.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Band index has no max. New rows unlock at high `R`.  
**IMPLEMENTATION_APPROACH:** One PR with A+F. Do not grow `ENEMY_KITS` in the same change.  
**BALANCE_CONSIDERATIONS:** Band-0 must still clear with Strike. Do not give every piece Inferno at `R = 0`.  
**QA_REQUIREMENTS:** `buildEnemyKit("queen", 0)` stays frost-only; `buildEnemyKit("queen", 1)` does **not** infer healer after F.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

**What new decision does this create?** “This queen is a band-1 healer-kit — do I dive her now, or is that the drain-trap PREREQ-F exists to prevent?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 4 | 3 | 5 | 5 | 10 |

### 4. EXP-2026-08-31-001

**EXPANSION_ID:** EXP-2026-08-31-001  
**TITLE:** Family role kits (stop using families as HP skins)  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Choose a kill order for *this* family on *this* board.  
**MECHANIC:** `family → { archetype, spellPoolIds by relative band, preferredAI, threatTag }`. SCORE **#1** (30). After 021, 014, and A+019+F.  
**WHY_IT_IMPROVES_STRALT:** Families are already in the type system and art path. Wiring kits is still the cheapest combinatorial multiplier in the repo.  
**SYSTEMS_AFFECTED:** New table next to `ENEMY_KITS`; spawn extract. Follow [`ENEMY_ELITE_EVOLUTION_2026-08-31.md`](./ENEMY_ELITE_EVOLUTION_2026-08-31.md). No Wave 2 family ids.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Band from enemy vs player (`R`), no max. HP stays the existing level roll.  
**IMPLEMENTATION_APPROACH:** After 021 / 014 / A+019+F. Resolve ids only through `SpellConfig.id`.  
**BALANCE_CONSIDERATIONS:** Flatten leftover family stat mults. Do not give every family Inferno at band 0.  
**QA_REQUIREMENTS:** Band 0 / 1 / 2 / 20 kits are distinct; `usableByEnemy` honored; mixed-family packs still end via the existing death pipeline.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

**What new decision does this create?** “The golem is the cover; the scribe is the Mark. Who dies first on this terrain?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 9 | 9 | 6 | 4 | 4 | 5 | 10 |

### 5. EXP-2026-09-24-025 then EXP-2026-09-27-032

**EXPANSION_ID:** EXP-2026-09-24-025 / EXP-2026-09-27-032  
**TITLE:** First elite `shielded` / second elite `hexer`  
**CATEGORY:** ENEMIES  
**PLAYER_OPPORTUNITY:** Treat one body as a named puzzle instead of “same kit, more HP.”  
**MECHANIC:** 025 is a shield token (not +HP) after 021. 032 is Weaken-on-first-spell via `spell-weaken`, not the same PR as 025. Do not mint a third token until both live.  
**WHY_IT_IMPROVES_STRALT:** There is still no elite layer. Tokens multiply family × kit × AI tier without new creature art.  
**SYSTEMS_AFFECTED:** New `engine/eliteModifiers.ts`. Spawn extract. Nameplate badge (stone + crimson).  
**INFINITE_PROGRESSION_BEHAVIOUR:** Higher tiers add a **second** token later, not +N% HP. Table is append-only.  
**IMPLEMENTATION_APPROACH:** Copy the hook-union pattern from `mapModifiers.ts`. One elite per pack until 004.  
**BALANCE_CONSIDERATIONS:** Shielded is absorb-once, not a thicker HP bar. Hexer is first-spell Weaken, not a new stun.  
**QA_REQUIREMENTS:** Elite death still goes through `deathPipeline.ts`; token hooks do not write Doka.  
**PRIORITY:** P1  
**STATUS:** PROPOSED  

**What new decision does this create?** “The shielded rat ignores the first nuke — do I strip it or race the hexer scribe?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 9 | 9 | 10 | 8 | 6 | 6 | 6 | 10 |

### 6. EXP-2026-08-31-006 first predicates (020 / 030 / 031) — after #327

**EXPANSION_ID:** EXP-2026-08-31-006  
**TITLE:** Mechanic challenge catalog  
**CATEGORY:** PROGRESSION  
**PLAYER_OPPORTUNITY:** Accept a fight objective that changes **how** you spend AP/MP.  
**MECHANIC:** 020 `kill_leader_last`, then 030 `no_hazard_steps`, then 031 `no_summons` (`isSummon` / `effectType`). Same `challengeCompletion.ts` — union after #327. Do not mint `modifier_survivor` / `interrupt_channels` while those three wait.  
**WHY_IT_IMPROVES_STRALT:** The nine current challenges are all numeric. They do not interact with family / elite / modifier / discovery.  
**SYSTEMS_AFFECTED:** `challengeCompletion.ts` + tests; `ChallengePanel.tsx` copy. No XP-curve change. Wait for #327.  
**INFINITE_PROGRESSION_BEHAVIOUR:** Predicates are relative to the live encounter. A high-band elite pack makes `kill_leader_last` harder without a level cap.  
**IMPLEMENTATION_APPROACH:** One condition per PR after #327, unioning the same file. Do not put predicate logic in WX.  
**BALANCE_CONSIDERATIONS:** Keep legendary rewards in the current 400–1000 XP band. No per-kill resolver calls.  
**QA_REQUIREMENTS:** Untouchable still uses `recordChallengeDamageTaken`; Attack Nearest still records AP; Pacifist preview still must not flip the flag.  
**PRIORITY:** P0  
**STATUS:** PROPOSED  

**What new decision does this create?** “The challenge is kill-leader-last — do I burn the rats first and eat the leader boost, or race the crown?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 8 | 8 | 6 | 4 | 3 | 3 | 9 |

### 7. Displacement + first world tiles (018 → 024 → 027 → 038)

**EXPANSION_ID:** EXP-2026-09-02-018 (then 024 / 027 / 038)  
**TITLE:** Wire push/pull, then Gravity Well, then Ember Vein, then Glyph Plate  
**CATEGORY:** COMBAT / WORLD  
**PLAYER_OPPORTUNITY:** Spend AP to move *them*, then read one tax cell and one trap cell.  
**MECHANIC:** 018 wires existing `applyPushback` / `applyAttract`. 024 is Gravity Well via attract after walk freeze. 027 / 038 are **one cell** each; ignore catalog `extraHazardCount` spray.  
**WHY_IT_IMPROVES_STRALT:** Positioning is the combinatorial axis the brief asks for. The resolvers and the first two `WF-*` rows already exist.  
**SYSTEMS_AFFECTED:** `spellEngine.ts` / enemy-cast dispatch; occupancy (already); `worldFeatures.ts` placement helper. **`mapGen.ts` stays closed.**  
**INFINITE_PROGRESSION_BEHAVIOUR:** Push distance stays in metadata. HP taxes are fractions of current max HP. Append-only feature table.  
**IMPLEMENTATION_APPROACH:** One metadata flag, one call site. 027 / 038 reuse one overlay placer. Do not treat leftover-crumb snaps, #1196 paint extract, or #1216 Pale Archivist honesty as 027 / 038.  
**BALANCE_CONSIDERATIONS:** `void_collapse` is 12 AP — do not also buff its damage. Ember tax is 4% max HP, Glyph is 8% one-shot.  
**QA_REQUIREMENTS:** Push into lava ticks store HP via `updateCombatant`; Death Realm / rest maps do not roll features; `evaluateSolvability` still passes.  
**PRIORITY:** P1 / P2  
**STATUS:** PROPOSED  

**What new decision does this create?** “Do I shove the golem onto the Glyph Plate, or walk the Ember Vein myself to cut the pack?”

| PLAYER_VALUE | TACTICAL_DEPTH | REPLAYABILITY | NOVELTY | IMPLEMENTATION_COMPLEXITY | REGRESSION_RISK | BALANCE_RISK | INFINITE_PROGRESSION_COMPATIBILITY |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8 | 9 | 8 | 6 | 4 | 6 | 6 | 9 |

---

## Adopted cards (019–041 and 001–018) — do not remint

Verbatim implementation cards for 001–028: [`EXPANSION_PROPOSALS_2026-09-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-622d/docs/automation/EXPANSION_PROPOSALS_2026-09-25.md) on PR **#573**. 029 / 030: [`EXPANSION_PROPOSALS_2026-09-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-6356/docs/automation/EXPANSION_PROPOSALS_2026-09-26.md) on PR **#623**. 031 / 032: [`EXPANSION_PROPOSALS_2026-09-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-c43e/docs/automation/EXPANSION_PROPOSALS_2026-09-27.md) on PR **#665**. 033 / 034: [`EXPANSION_PROPOSALS_2026-09-28.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-728b/docs/automation/EXPANSION_PROPOSALS_2026-09-28.md) on PR **#751**. 035 / 036: [`EXPANSION_PROPOSALS_2026-09-29.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-05ea/docs/automation/EXPANSION_PROPOSALS_2026-09-29.md) on PR **#793**. 037 / 038: [`EXPANSION_PROPOSALS_2026-10-21.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-47ba/docs/automation/EXPANSION_PROPOSALS_2026-10-21.md) on PR **#823**. 039 / 040: [`EXPANSION_PROPOSALS_2026-10-22.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-da0b/docs/automation/EXPANSION_PROPOSALS_2026-10-22.md) on PR **#875**. 041: [`EXPANSION_PROPOSALS_2026-10-23.md`](https://github.com/Mr-Melic/stralt/blob/cursor/bc-64fb126a-d370-4f87-9b07-74f270b9fe91-2d19/docs/automation/EXPANSION_PROPOSALS_2026-10-23.md) on PR **#944**. 10-24 re-rank (no new ID): [`EXPANSION_PROPOSALS_2026-10-24.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-cc38/docs/automation/EXPANSION_PROPOSALS_2026-10-24.md) on PR **#991**. 10-25 re-rank (no new ID): [`EXPANSION_PROPOSALS_2026-10-25.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-8746/docs/automation/EXPANSION_PROPOSALS_2026-10-25.md) on PR **#1052**. 10-26 re-rank (no new ID): [`EXPANSION_PROPOSALS_2026-10-26.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-00d6/docs/automation/EXPANSION_PROPOSALS_2026-10-26.md) on PR **#1112**. 10-27 re-rank (no new ID): [`EXPANSION_PROPOSALS_2026-10-27.md`](https://github.com/Mr-Melic/stralt/blob/cursor/stralt-expansion-opportunities-0d61/docs/automation/EXPANSION_PROPOSALS_2026-10-27.md) on PR **#1188**. Scores and ship rules below are unchanged unless this table says so.

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
| 039 | Gate LoS reposition on `escapeRoute` | 25 | After 037; caster/generic only |
| 041 | Gate overkill retarget on `bottleneckControl` | 25 | After 040; caster/generic only; **retarget, not splash** |
| 018 | Wire push / pull | 24 | First slice of 013; 038’s shove-onto-plate combo |
| 010 | Optional tactical objectives | 24 | First slice 026 |
| 027 | Ember Vein tile (4% max-HP tax, **one** cell) | 24 | First slice of 016; ignore catalog `extraHazardCount`; leftover-crumb snaps are not this card |
| 037 | Gate healer interpose on `groupTactics` | 24 | After 036; `decideHealer` 1137–1163 only |
| 038 | Glyph Plate (8% one-shot, **one** cell) | 24 | After 027; ignore catalog `extraHazardCount`; **#1216** is not this card |
| 033 | Slime ≠ Frozen | 24 | Drop slime `onMpCost`; Slow via `spell-slow` |
| 040 | Gate lethal lookahead on `instantKill` | 24 | After 039; enemy archetypes only; no new execute |
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
| 005 | AI sophistication ladder | 21 | 028, 036, 037, 039, 040, 041; named gates exhausted; do not encode `if (level >= X)` |
| 007 | Dungeon room types | 21 | Wait for #331; no mapGen rewrite |
| 017 | Honor Rush `combinedMechanic` | 20 | First slice is 034 (room 0 only) |
| 036 | Gate 30% retreat on `defensiveRetreat` | 20 | After 028; caster/flanker/generic only; berserker press-only |
| 011 | Boss mechanic-pool scaling | 17 | After 017 / 034 |
| 022 | Convert Blood Moon off ×1.25 | 16 | Honesty, not a fifth damage reskin |
| 015 | Convert Titan's Vigor off +1000 HP | 15 | Anti-pattern still live; **#1203/#1208 commit it, they do not convert it** |

---

## Do not re-propose

- Stat-only new enemy ids (including Register-lore Crimson Spawn / Shadow Lurker / Storm Caller).
- Wave 2+ families / SPELL_PROPOSALS ids / Wave-12/18/19/20 WDD rows before 021/014/019+F/018/003/027.
- A fifth reflect.
- `level_N` endgame achievements (035 is count rungs, not `level_50`).
- mapGen rewrites or a second recap/persist funnel.
- Motoko Character schema by editing frozen `20260831` / `20260901` NewActors.
- Reminting **001–041**.
- Reminting Fog as a new modifier id (the id is `fog_of_war`).
- Reminting `kill_leader_last` (020), `no_hazard_steps` (030), or `no_summons` (031).
- Reminting Ember Vein, Glyph Plate, `shielded`, `hexer`, `contest_shrine`, `chokepointCamp`, Gravity Well, the summoner pack slot, Slime≠Frozen, Rush room 0, healer-interpose gating, LoS peek, lethal lookahead, or overkill retarget as new verbs (they already exist).
- A fourth 006 predicate while 020/030/031 are still queued on #327.
- A third elite token while 025/032 are unshipped.
- A third `WF-*` (Crumble Pillar / Creeping Ash) while 027/038 are unshipped.
- Treating map-integrity leftover-crumb snaps (#1023 / #1030 / #1038 / #1071 / #1086 / #1093 / #1103 / #1146 / #1154 / #1161 / #1174 / #1201 / #1209 / #1213) as world-feature wiring.
- Treating #1076 / #1109 / **#1196** hazard-overlay / portal-cube / battle-floor paint extracts as 016 / 027.
- Treating leftover-Doka remount-keep (#1145 / #1147 / #1149 / #1151 / #1153 / #1156 / #1157) or leftover spell-level remount-keep (**#1215**) as expansion.
- Treating advertised-execute honesty (#1148 / #1150 / #1155 / #1158 / #1160 / **#1182** / **#1199** / **#1200** / **#1202** / **#1207** / **#1210** / **#1205–#1214**) or Enthroned Void / Eternal Pawn kit-first tests (#1152 / #1159 / **#1204** / **#1212**) as a new expansion card.
- Treating Titan's Vigor honesty (**#1203** / **#1208**) as 015. Those PRs commit +1000 HP / 1–5×; 015 converts them off.
- Treating Pale Archivist Glyph Trap honesty (**#1216**) as 038, or Broodmother honesty (**#1217**) as 014 / 025.
- Treating pack-enemy CHC / LoS / retreat fallback sharing as a new expansion card.
- XP-curve retune as expansion.
- ExtraHazardCount spray for Ember Vein, Fog, or Glyph Plate.
- A melee hexer that invents a new stun. 032 is Weaken-on-first-**spell**.
- Name-based “Summon” / “Slow” / “Ember Knight” string matching for 031 / 033 / 035.
- Keeping slime `onMpCost` while adding Slow (that would still be a duplicate tax).
- Rush rooms 1–9 in the same PR as 034.
- Lowering `ENEMY_RETREAT_HP_PCT` in 036, or making berserkers retreat.
- Gating player-side Sentinel / Wisp interpose in 037.
- Gating `decideSummonArcher` in 039 or `decideSummonHunter` in 040.
- Lowering `escapeRoute` / `instantKill` / `bottleneckControl` so 1–20 fights keep global peek / finish / retarget.
- Treating `instantKill: 9` as a license to add a new execute formula. 040 only gates existing lookahead.
- Treating `bottleneckControl: 8` as a license to add splash / leftover-HP damage. 041 only gates existing **retarget**.
- Adding `applyOverkillSpread` to charger / flanker / berserker / generic melee before 041 is live, or in a “042” that remints 041.
- Writing `escapeRouteTriggered` or `campTurnCount` as a persist / recap flag.
- Restacking WX 15508 / 15595 (erratic / betrayal) while #327 is open.
- Teaching scoring to read `focusTargetId` before 041 is live on `main`.
- Granting XP from 035 (Doka on claim only).
- A new persistent kill-count field on `Character` for 035.
- Creeping Ash (moving lane) before 027 + 038 + 018 exist.
- Inventing a new `ENEMY_AI_TIER_GATES` key because the named ladder is exhausted.
- Minting 042 as a twin of any row above.

---

## Recommended combinatorial target

Once 001+002+003+004+009/016+018 are live (with 021/014/019/025/032/033/034/035/036/037/038/039/040/041 as the first slices):

```
family × relative band × piece variant × aiTier × kit band × elite token
  × pack role × map archetype × map modifier × world feature × displacement verb
  × Rush pair hook × repeating family-slayer rung
  × healer-interpose / retreat / LoS-peek / lethal-finish / overkill-retarget readability
```

That is still the expansion plan. Not a hundred near-identical enemies. Not larger HP.

---

## Next Expansion Director run

Re-rank against `main`. Mark cards SHIPPED/SUPERSEDED only when production code on `main` matches. Do not silently rewrite history. Production code stays untouched unless a later human/orchestrator picks an ID. Skip README if an older open PR still owns it. Do not restack WX / `challengeCompletion` / `targeting` while #327/#370 are open, or `mapGen` while #331 is open. Do not remint **019–041**. Blood Moon/Mirror Field are live in `spellEngine.ts`, not stubs. Slime≡Frozen until 033 ships. 021 ships with PREREQ-H; 019 ships with PREREQ-F. Family overlay RES/SP also die at battle start. `inferArchetype` never returns `summoner`. Ember Vein tax is `hpTaxPctOfMax: 0.04`, not 10%, and 027 is **one cell**. Glyph Plate tax is `hpTaxPctOfMax: 0.08`, and 038 is **one cell** (ignore catalog `extraHazardCount` 1–2). Fog radius is Chebyshev 4, not a damage multiplier. 031 keys off `isSummon` / `effectType`. 032 reuses `spell-weaken` metadata. 033 reuses `spell-slow` metadata and **drops** slime `onMpCost`. 034 is room 0 only (`pale_archbishop` / `weeping_pawn`). 035 is Ember count rungs 5/15/40, whitelist + victory helper, Doka on claim. 036 gates the three existing 30% retreat sites on `aiTier >= 3`. 037 gates **only** enemy `decideHealer` interpose on `aiTier >= 4`. 038 reuses 027’s overlay placer. 039 gates **only** enemy caster/generic LoS reposition on `aiTier >= 6` (not Archer). 040 gates **only** enemy-archetype lethal lookahead on `aiTier >= 9` (not Hunter; no new execute). 041 gates **only** enemy caster/generic overkill **retarget** on `aiTier >= 8` (not splash; not charger/flanker). Do not treat leftover-crumb map snaps, persist-keep chains, advertised-execute honesty (including Titan's Vigor / Pale Archivist Glyph Trap / Broodmother), or hazard-paint extracts as 027/038/015.

Mint a new ID only when `main` moves, a card ships, or a leftover first-ship slice both creates a new player decision **and** is unblocked (041 live for pack-focus / charger-flanker call sites; #327 closed for 006 remainder / WX constant-wire). Do not mint 042 as hygiene. Remaining unminted slices: 006 `modifier_survivor`, 006 `interrupt_channels`, WX erratic/betrayal constant-wire after #327, pack `focusTargetId` scoring after 041 is live, charger/flanker overkill call-site adds after 041 is live (still no splash).
