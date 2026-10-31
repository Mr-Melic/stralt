# ACTION_IDs — Content Diversity & Repetition Auditor 2026-10-31

Durable ledger for implementers and the Report Action Orchestrator.  
Source of every record: Content Diversity & Repetition Auditor.  
Audit: [`CONTENT_DIVERSITY_AUDIT_2026-10-31.md`](./CONTENT_DIVERSITY_AUDIT_2026-10-31.md).  
HEAD: `0f5363f` (unchanged since 2026-09-21; last `main` merge 2026-09-03 `#332`). Gameplay / production code was **not** modified this run.

Prior ledger on `main`: [`ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md`](./ACTION_IDS_CONTENT_DIVERSITY_2026-09-02.md) (`CDA-2026-09-02-001` … `015`). Line numbers below match live HEAD and were re-verified 2026-10-31.

Unpublished ledgers: GitHub **PR #359** (09-21, `016`–`018`), **PR #403** (09-22, `019`), **PR #465** (09-23, `020`), **PR #521** (09-24, `021`), **PR #557** (09-25, `022`), **PR #614** (09-26, `023`), **PR #662** (09-27, `024`), **PR #720** (09-28, `025`), **PR #773** (09-29, `026`), **PR #824** (10-21, `027`), **PR #881** (10-22, `028`), **PR #942** (10-23, `029`), **PR #982** (10-24, `030`), **PR #1069** (10-25, `031`), **PR #1120** (10-26, `032`), **PR #1167** (10-27, `033`), **PR #1222** (10-28, `034`), **PR #1295** (10-29, `035`). All still **OPEN**. Do **not** mint twins. Those ids are copied here so they exist on `main` if those PRs never merge. Status stays **NEW** / **OPEN** / **PARTIAL** until an implementer picks them.

This run mints **`CDA-2026-10-31-036`** only.

Do not mint twins of SDE / WDEAD / formation / family-sheet / WDD ids. Do not implement combat from this file unless a later human or orchestrator picks an ID.

---

## Status of CDA-2026-09-02-001 … 015, unpublished 016–035, and 036

| ACTION_ID | STATUS | Note |
| :--- | :--- | :--- |
| CDA-2026-09-02-001 | OPEN | Overlay in `spawnPolicy.ts`; wipe unchanged |
| CDA-2026-09-02-002 | OPEN | Still NaN. **Must ship with 006** |
| CDA-2026-09-02-003 | OPEN | No elite type; three `WF-ELT-*` unwired |
| CDA-2026-09-02-004 | OPEN | Quadrant scatter + battle-start re-scatter |
| CDA-2026-09-02-005 | OPEN | Four clone pairs unchanged |
| CDA-2026-09-02-006 | OPEN | `inferArchetype` still `healAmount > 0`; no `return "summoner"` |
| CDA-2026-09-02-007 | OPEN | `0.12 + 0.02 * playerLevel`; saturates at 44 |
| CDA-2026-09-02-008 | OPEN | `combinedMechanic` unread (11 hits); `weeping_pawn_2` ghost |
| CDA-2026-09-02-009 | OPEN | Nine challenges; HUD honesty only |
| CDA-2026-09-02-010 | OPEN | `level_10` still fires at WX 3632 |
| CDA-2026-09-02-011 | OPEN | Slime ≡ Frozen. Blood Moon / Mirror Field **live**. Gravity / Fog empty. Honesty PRs through **#1252** Glass Realm melee ×2 and 10-29/10-30 advertised Phase-2 HP commits do **not** diverge slime/frozen |
| CDA-2026-09-02-012 | OPEN | Frontend 32 vs backend six + ghost boss seeds; pack kits empty vs Motoko. **#911** still open |
| CDA-2026-09-02-013 | PARTIAL | Chrome = FLAVOR LORE. Per-row copy still lies — CDA-016 |
| CDA-2026-09-02-014 | OPEN | Dungeon extras still `[0,2,3,4,4,5]`; 52 `WF-*` unused on `main`; open dumps still peak at **#1285 340** (no Wave-22 WF TypeScript this cycle) |
| CDA-2026-09-02-015 | OPEN | `applyPushback` / `applyAttract` tests-only. REACTION is the reflect cluster (CDA-017) |
| CDA-2026-09-21-016 | NEW | Unpublished in #359. Register row honesty |
| CDA-2026-09-21-017 | NEW | Unpublished in #359. Freeze fifth reflect; first non-reflect REACTION |
| CDA-2026-09-21-018 | NEW | Unpublished in #359. Freeze unread `WF-*` growth |
| CDA-2026-09-22-019 | NEW | Unpublished in #403. Freeze ENC/Rush *code* |
| CDA-2026-09-23-020 | NEW | Unpublished in #465 |
| CDA-2026-09-24-021 | NEW | Unpublished in #521 |
| CDA-2026-09-25-022 | NEW | Unpublished in #557 |
| CDA-2026-09-26-023 | NEW | Unpublished in #614 |
| CDA-2026-09-27-024 | NEW | Unpublished in #662 |
| CDA-2026-09-28-025 | NEW | Unpublished in #720 |
| CDA-2026-09-29-026 | NEW | Unpublished in #773 |
| CDA-2026-10-21-027 | NEW | Unpublished in #824 |
| CDA-2026-10-22-028 | NEW | Unpublished in #881 |
| CDA-2026-10-23-029 | NEW | Unpublished in #942 |
| CDA-2026-10-24-030 | NEW | Unpublished in #982 |
| CDA-2026-10-25-031 | NEW | Unpublished in #1069 |
| CDA-2026-10-26-032 | NEW | Unpublished in #1120 |
| CDA-2026-10-27-033 | NEW | Unpublished in #1167 |
| CDA-2026-10-28-034 | NEW | Unpublished in #1222. Did **not** stop Wave-21 Table S / Wave-20 WF 52→324 |
| CDA-2026-10-29-035 | NEW | Unpublished in #1295. **Did** stop Wave-22 WF TypeScript. Did **not** stop Rush Table T / Wave-21 elite / SDE / ENC |
| CDA-2026-10-31-036 | NEW | This run. Freeze Wave-21/22 docs overflow; do not author Wave-23 or Wave-22 WF TypeScript |

---

## Unpublished 09-21 ids (copied so they exist if PR #359 never merges)

---

ACTION_ID: CDA-2026-09-21-016  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Rewrite live-family Register rows to the three combat hooks; keep extras as proposed  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Chrome is honest (`enemyRegisterCopy.ts` 11–15: “Flavor only — not the live spawn roster”; banner `EnemyRegister.tsx` 356–370). The seven live-family rows (`EnemyRegister.tsx` 28–70) still teach wall-phase, poison-on-hit, burning tiles, adjacent slow + regen, Weaken-from-range, magic immunity until physical. Live verbs are only ember melee burn, tide melee MP−1 (WX 16789–16821), void 25% reflect (`castHelpers.ts` 335–345). Crimson / Lurker / Storm (71–88) are not `EnemyFamily`. Re-verified 2026-10-21 on HEAD `0f5363f` (unchanged since 09-21).  
SYSTEMS_AFFECTED: `EnemyRegister.tsx` MONSTERS copy; optionally `enemyRegisterCopy.ts`  
RECOMMENDED_ACTION: For each of the seven live ids, describe the actual combat hook or “pixel overlay only until CDA-001.” Label Crimson / Lurker / Storm as proposed/unwired in the row, not only in the header chip. Do not invent mechanics in the Register. NEW PLAYER DECISION: “I read Ember = melee burn, so I save a cleanse for the strike, not for tiles it walked” — the current row creates the opposite (wrong) decision.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-013 chrome; CDA-2026-09-02-001 if/when live verbs expand — then update the same rows, do not add a tenth monster  
REGRESSION_RISK: LOW (display copy). MEDIUM if copy claims a persist stat that battle start still wipes.  
VALIDATION_REQUIRED: No Register sentence for a live family names a verb grep cannot find in WX / `castHelpers.ts`; extras remain off `EnemyFamily`  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-21-017  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze additional reflect clones; ship the first non-reflect REACTION  
CATEGORY: REACTION  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Four live reflects: `spell-mirror` (next ST, `spellEngine.ts` 917–926); `void_mirror` 25% of pre-crit (`castHelpers.ts` 335–345); `mirror_field` 20% ST (`spellEngine.ts` 901–907); boss `reflectShieldActive` 30% (`castHelpers.ts` 363–375). Backend `reflect_barrier` is a fifth ghost (`admin.mo` 182). 09-02 census listed REACTION as Under; it is a numeric clone cluster. SPELL_PROPOSALS already reserved delayed execute / redirect / absorb — unused. Re-verified 2026-10-21.  
SYSTEMS_AFFECTED: `spellData.ts`; `mapModifiers.ts` Mirror Field; boss reflect shield; SDE Wave-1 redirect/absorb ids  
RECOMMENDED_ACTION: Do not add a fifth reflect (no new family, modifier, or boss shield that returns % damage). First new REACTION must be a different verb: delayed interrupt, counter-attack on move, or absorb-then-release from an existing SPELL_PROPOSALS id. Do not put it on `starterSpells`. NEW PLAYER DECISION: “I held the cast / stepped off the file because a counter would fire,” which no current reflect asks — reflects only ask “will I eat the bounce?”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SPELL_PROPOSALS Wave 1 redirect/absorb/delayed-execute ids; CDA-2026-09-02-012; CDA-2026-09-02-015 stays POSITIONING (push/attract)  
REGRESSION_RISK: HIGH if a counter ignores occupancy or double-records challenge HP (same class as Void reflect honesty tests in `castHelpers.reflect.test.ts`)  
VALIDATION_REQUIRED: New id’s `effectType` / flags are not a percent-reflect; existing four reflects’ magnitudes unchanged; Untouchable still fails after the new reaction damages the player  
STATUS: NEW  

---

ACTION_ID: CDA-2026-09-21-018  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze new world-feature rows until one existing WF-* is imported by spawn  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `worldFeatures.ts` holds **52** `WF-*` ids (Wave 1–3) on `main`. Grep: imported only by `worldFeatures.test.ts`. WX does not import the module. Open TypeScript dumps: #344 (Wave-4), #399 (Wave-5), #454 (Wave-6, +1436 lines), **#503 (Wave-7, 52→116 ids, +1914 lines)** — CDA-021 — and **#578 (Wave-8, 52→132 ids, +2390 lines)** — CDA-023. CDA-014 already asks to wire **one** object. Re-verified 2026-09-28: still 52 on `main` `0f5363f`.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; WDD / ENC design docs; dungeon `generateEnemies`  
RECOMMENDED_ACTION: Implementers must not append `WF-*` rows until CDA-014 (or equivalent) imports one existing id (`WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL` preferred). Wave-4/5/6/7/8 world-dynamics catalogs stay docs without new TypeScript rows (#344, #399, #454, #503, #578). NEW PLAYER DECISION: none until one object is live — this id prevents a fake decision (“new shrine name, same kill-all pack”).  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-014 is the gate; do not invent a 53rd id to “teach” hold/escort; CDA-2026-09-22-019 for ENC/Rush code freeze; CDA-2026-09-23-020 / CDA-2026-09-24-021 for later-wave TypeScript hours  
REGRESSION_RISK: LOW (process). HIGH if ignored (catalog grows while spawn stays extra pawns).  
VALIDATION_REQUIRED: `worldFeatures.ts` id count does not increase until WX (or spawnPolicy) imports one id; a depth-2 dungeon can spawn that object  
STATUS: NEW  

---

## Unpublished 09-22 id (copied so it exists if PR #403 never merges)

---

ACTION_ID: CDA-2026-09-22-019  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze same-cycle ENC / Wave-5 Rush code until one encounter object and room-0 resurge exist  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Live spawn is still extra-bodies (`spawnPolicy.ts` 27–28) and unread `combinedMechanic` (`useBossRush.ts` 19–131; room 9 `weeping_pawn_2`). 09-21 CDA PR #359 is still open. `BOSS_RUSH_ROOMS.length` still 10. Same-hour siblings include Rush Table E docs (#474) and Ley/Fan/Pit/Font ENC (#479). CDA-013/018 freeze families and `WF-*` rows; this id covers **BOSS_RUSH_ROOMS rows, generateEnemies encounter branches, and ENC TypeScript**. Wave-6 TypeScript is CDA-020; Wave-7 TypeScript is CDA-021. Re-verified 2026-10-21.  
SYSTEMS_AFFECTED: `useBossRush.ts` `BOSS_RUSH_ROOMS`; dungeon `generateEnemies`; ENC-* / WDEAD TypeScript if any; Wave-5–8 boss sheets  
RECOMMENDED_ACTION: Those PRs may land as **docs**. They must not add `BOSS_RUSH_ROOMS` entries, `combinedMechanic` strings, extra `BOSS_IDS`, or `generateEnemies` encounter branches until CDA-008 (room-0 resurge + `weeping_pawn_2` mapped) and CDA-014 (one existing ENC/WF object imported) exist. Do not write ENC-TEACH-04. NEW PLAYER DECISION: none until 008/014 — this prevents an 11th flavor dual-boss lie and a second kill-all pack with a new encounter name.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-008; CDA-2026-09-02-014; CDA-2026-09-21-018 (WF rows); CDA-2026-09-02-013 (families); CDA-2026-09-23-020; CDA-2026-09-24-021  
REGRESSION_RISK: LOW (process). HIGH if ignored (Rush table grows while room 9 still ghosts; dungeon still only extra pawns).  
VALIDATION_REQUIRED: `BOSS_RUSH_ROOMS.length` stays 10 and `worldFeatures.ts` stays 52 `WF-*` until 008/014 ship; room 9 `boss2Id` is a `BOSS_IDS` member after 008  
STATUS: NEW  

---

## Unpublished 09-23 id (copied so it exists if PR #465 never merges)

---

ACTION_ID: CDA-2026-09-23-020  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze Wave-6 TypeScript catalogs until one family binds, one WF-* is imported, and room-0 resurge exists  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Live spawn on HEAD `0f5363f` is unchanged vs 09-21/09-22: 30% family sticker (`spawnPolicy.ts` 279–286) wiped at battle start; 52 unused `WF-*` rows (WX does not import `worldFeatures.ts`); `BOSS_RUSH_ROOMS.length === 10` with unread `combinedMechanic` and room-9 `weeping_pawn_2` (`useBossRush.ts` 24–135). Wave-6 flock: elite sheets (#452, docs), Expansion Director (#453, docs), **Wave-6 world dynamics (#454) mutates `worldFeatures.ts` (+1436 / −3)** — TypeScript catalog growth, not docs. CDA-018 already forbids a 53rd `WF-*`; CDA-019 already forbids ENC/Rush *code*. Re-verified 2026-09-28: #454 still open; Wave-7 dump is CDA-021.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / dungeon `generateEnemies`; Wave-6 elite docs  
RECOMMENDED_ACTION: #452 / #453 / #406 / #367 may land as **docs**. #454 must not land additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-6 names to `EnemyFamily` until CDA-001. Do not append Rush Table C/D as live rooms until CDA-008. Do not write ENC-TEACH-05. NEW PLAYER DECISION: none until 001/008/014 — this prevents a 53rd unread shrine name, an eighth family sticker, and an 11th dual-boss flavor lie.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-008; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019  
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` grows while spawn stays extra pawns; Wave-6 families become Register-class stickers).  
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`  
STATUS: NEW  

---

## Unpublished 09-24 id (copied so it exists if PR #521 never merges)

---

ACTION_ID: CDA-2026-09-24-021  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze Wave-7 TypeScript catalog dumps until one family binds, one WF-* is imported, and room-0 resurge exists  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` unchanged vs 09-23. CDA-018 / CDA-020 already freeze `WF-*` TypeScript growth. Same-hour 2026-09-24 **#503** is titled “docs: add wave-7 world dynamics catalog” but mutates `src/frontend/src/engine/worldFeatures.ts` (+1914 / −3) and its test file (+187). Live file has **52** `WF-*` ids; #503’s file has **116** (+64 unread rows). Stack of unread TypeScript already open: #344 Wave-4, #399 Wave-5, #454 Wave-6 (+1436). Same-hour docs siblings: #474 Rush Table E, #506 AI evolution, #479 Ley/Fan/Pit/Font ENC, **#518 Rush Table F**, **#519 Gale/Twin/Pincer ENC**. None of CDA-001 / 008 / 014 shipped. `EnemyFamily` still seven + `default`. `BOSS_RUSH_ROOMS.length` still 10. WX still does not import `worldFeatures.ts`. Re-verified 2026-09-28: #503 still open; #503 files still +1914 on `worldFeatures.ts`.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / dungeon `generateEnemies`; Wave-7 elite / AI / ENC docs  
RECOMMENDED_ACTION: #474 / #506 / #479 / #452 / #518 / #519 may land as **docs**. #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-7 names to `EnemyFamily` until CDA-001. Do not append Rush Table E/F as live rooms until CDA-008. Do not write ENC-TEACH-06. NEW PLAYER DECISION: none until 001/008/014 — this prevents a 116-row unread shrine catalog, an eighth family sticker, and an 11th dual-boss flavor lie.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-008; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020  
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` more than doubles while spawn stays extra pawns; Wave-7 families become Register-class stickers).  
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #503 does not land TypeScript rows first  
STATUS: NEW  

---

## Unpublished 09-25 id (copied so it exists if PR #557 never merges)

---

ACTION_ID: CDA-2026-09-25-022  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze Wave-7 elite / SDE / formation TypeScript until families bind, kits+AI bind, and one named formation is live  
CATEGORY: TEAM_SYNERGY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` unchanged vs 09-24. CDA-021 (PR #521, 00:21Z) froze Wave-7 **WF-\*** TypeScript (#503). After that freeze, the same day’s remaining flock authored Wave-7 elite sheets (**#535**, 00:28Z, docs +732 `ENEMY_ELITE_EVOLUTION_2026-09-24.md`), Wave-7 SDE (**#533**, 00:26Z, docs), and formations drop 7 (**#537**, 00:35Z, docs +1320 `ENEMY_FORMATIONS_2026-09-24.md`). All three are docs today. Live spawn still has no `isElite`, kit band NaN (WX 11920), and quadrant scatter (WX 11869–11891). CDA-013 already freezes `EnemyFamily` members; CDA-012 already forbids appending `starterSpells`; CDA-004 is the formation bind. This id names the Wave-7 elite/SDE/formation hour so implementers do not treat #535/#533/#537 as a green light for TypeScript, the way 021 named #503 for `WF-*`. Wave-8 Rush Table F already exists as **#518** (docs, CDA-019).  
SYSTEMS_AFFECTED: `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; spawn / `generateEnemies` formation ids; Wave-7 elite / SDE / formation docs  
RECOMMENDED_ACTION: #535 / #533 / #537 / #525 may land as **docs**. They must not add `EnemyFamily` members, `starterSpells` rows, spawn `formationId`, or `ENEMY_KITS` band-0 DAMAGE ids until CDA-001 (family persist + chassis + verb), CDA-002 **with** 006 (numeric kit band without turning queens into healers), and CDA-004 (one named formation that battle start does not dissolve). Do not author Wave-8 elite / SDE / formation catalogs. Do not write ENC-TEACH-07. NEW PLAYER DECISION: none until 001 / 002+006 / 004 — this prevents an eighth family sticker, a 33rd innate spell, and a named formation that battle-start still scatters into “same Strike pawn, different tint.”  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-24-021 (WF TypeScript remains 021)  
REGRESSION_RISK: LOW (process). HIGH if ignored (Wave-7 names enter `EnemyFamily` / `starterSpells` while chassis stays random, kits stay band 0, and battle start still re-scatters).  
VALIDATION_REQUIRED: `EnemyFamily` stays the live seven + `default`; `starterSpells` does not grow; spawn still has no `formationId` until 004 ships; #535/#533/#537 do not land TypeScript rows first  
STATUS: NEW

---

## Unpublished 09-26 id (copied so it exists if PR #614 never merges)

---

ACTION_ID: CDA-2026-09-26-023  
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor  
TITLE: Freeze Wave-8/9 TypeScript catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists  
CATEGORY: OBJECTIVE_PLAY  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–09-25. CDA-022 (PR #557, 00:09Z) froze Wave-7 elite / SDE / formation TypeScript and said “Do not author Wave-8 elite / SDE / formation catalogs.” After that freeze, the same day’s remaining flock authored Wave-8 elite sheets (**#558**, 00:10Z, docs +743), Wave-8 SDE (**#590**, 00:28Z, docs), formations drop 8 (**#575**, 00:22Z, docs +1247), Wave-8 spell proposals (**#563**, docs +911), Wave-9 boss / Rush **Table G** (**#572**, docs +1159), Face/Mute/Span/Brand ENC (**#574**, docs +1080), and Wave-8 world dynamics (**#578**, 00:24Z) which mutates `worldFeatures.ts` (**+2390 / −3**; **52 → 132** `WF-*` ids) plus its test file (+230). Live spawn still has no `isElite`, kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic`, room-9 `weeping_pawn_2`, and 52 unused `WF-*` on `main`. CDA-018/020/021 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-8/9 hour so implementers do not treat #578 as “just docs” (it is TypeScript) or #558/#590/#575/#572/#574/#563 as a green light for live catalogs. #503 (Wave-7, 52→116) is still open. Re-verified 2026-10-21.  
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-8/9 elite / SDE / formation / ENC / Rush docs  
RECOMMENDED_ACTION: #558 / #590 / #575 / #563 / #572 / #574 may land as **docs**. #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-8 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table G (or E/F) as live rooms until CDA-008. Do not write ENC-TEACH-08. Do not author Wave-9 elite / SDE / formation catalogs. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 132-row unread shrine catalog, a ninth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and an 11th dual-boss flavor lie.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022  
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 132 unread rows while spawn stays extra pawns; Wave-8 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).  
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #578 does not land TypeScript rows first  
STATUS: NEW

---

## Unpublished 09-27 id (copied so it exists if PR #662 never merges)

---

ACTION_ID: CDA-2026-09-27-024
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-9/10 elite / SDE / formation / Rush Table H / ENC / Wave-9 WF TypeScript until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–09-26. CDA-023 (PR #614, 00:11Z) froze Wave-8/9 TypeScript and said “Do not author Wave-9 elite / SDE / formation catalogs.” After that freeze, the same day’s remaining flock authored Wave-9 elite sheets (**#625**, 00:20Z, docs +1110), Wave-9 SDE (**#646**, 00:37Z, docs), Wave-9 spell proposals (**#636**, docs +898), Wave-10 boss / Rush **Table H** (**#638**, docs +1449), Hug/Boot/Write/Dull ENC (**#635**, docs +1092), and AI evolution (**#633**, docs). Two PRs raced CDA-023: formations drop 9 (**#612**, 00:10Z, docs +1264) and Wave-9 world dynamics (**#613**, 00:11Z) which mutates `worldFeatures.ts` (**+2869 / −3**; **52 → 148** `WF-*` ids) plus its test file (+276). Live spawn still has no `isElite`, kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic`, room-9 `weeping_pawn_2`, and 52 unused `WF-*` on `main`. CDA-018/020/021/023 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-9/10 hour so implementers do not treat #613 as “just docs” (it is TypeScript) or #625/#646/#612/#636/#638/#635 as a green light for live catalogs. #578 (Wave-8, 52→132) and #503 (Wave-7, 52→116) are still open. Re-verified 2026-10-21.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-9/10 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #625 / #646 / #612 / #636 / #638 / #635 / #633 may land as **docs**. #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-9 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table H (or E/F/G) as live rooms until CDA-008. Do not write ENC-TEACH-09. Do not author Wave-10 elite / SDE / formation catalogs. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 148-row unread shrine catalog, a tenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and an 11th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 148 unread rows while spawn stays extra pawns; Wave-9 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #613 does not land TypeScript rows first
STATUS: NEW

---

## Unpublished 09-28 / 09-29 ids (copied so they exist if PR #720 / #773 never merge)

---

ACTION_ID: CDA-2026-09-28-025
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-10/11 elite / SDE / formation drop 10 / Rush Table I / ENC / Wave-10 WF TypeScript until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–09-27. No PRs merged to `main` since 2026-09-21 (`gh` search `merged:>=2026-09-21` = 0). CDA-024 (PR #662, 00:09:58Z) froze Wave-9/10 TypeScript and said “Do not author Wave-10 elite / SDE / formation catalogs.” After that freeze, the same day’s remaining flock authored Wave 11 boss / Rush **Table I** (**#663**, 00:10:45Z, 47s later, docs +1673 `BOSS_AND_SPELL_DISCOVERY.md`), formations drop 10 (**#669**, 00:14Z, docs +1283), Purse/Hinge/Gait ENC (**#672**, 00:16Z, docs +1194), Wave-10 SDE (**#679**, 00:20Z, docs), Wave 10 elite sheets (**#686**, 00:22Z, docs +1233), AI evolution (**#689**, docs), Wave 10 tactical spells (**#695**, 00:31Z, docs +923), and Wave-10 world dynamics (**#680**, 00:20Z) which mutates `worldFeatures.ts` (**+3336 / −3**; **52 → 164** `WF-*` ids) plus its test file (+327). Live spawn still has no `isElite`, kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic`, room-9 `weeping_pawn_2`, and 52 unused `WF-*` on `main`. CDA-018/020/021/023/024 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-10/11 hour so implementers do not treat #680 as “just docs” (it is TypeScript) or #663/#686/#679/#669/#672/#695 as a green light for live catalogs. #613 (Wave-9, 52→148), #578 (Wave-8, 52→132), and #503 (Wave-7, 52→116) are still open. Sibling **#707** (CRC) is retirement lifecycle — do not twin as a delete license. Re-verified 2026-10-21.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-10/11 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #663 / #686 / #679 / #669 / #672 / #695 / #689 / #662 / #625 / #646 / #612 / #636 / #638 / #635 may land as **docs**. #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-10/11 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table I (or E–H) as live rooms until CDA-008. Do not write ENC-TEACH-10. Do not author Wave-11 elite / SDE / formation catalogs. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 164-row unread shrine catalog, an eleventh family sticker, a 33rd innate spell, a named formation battle-start still scatters, and an 11th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 164 unread rows while spawn stays extra pawns; Wave-10 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #680 does not land TypeScript rows first
STATUS: NEW

---

ACTION_ID: CDA-2026-09-29-026
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-11/12 elite / SDE / formation drop 11 / Rush Table J / ENC / Wave-11 WF TypeScript until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–09-28. No PRs merged to `main` since 2026-09-21 (`gh pr list --state merged` since that date = 0). CDA-025 (PR #720, 00:10:01Z) froze Wave-10/11 TypeScript and said “Do not author Wave-11 elite / SDE / formation catalogs.” After that freeze, the same day’s remaining flock authored Wave 11 tactical spells (**#726**, 00:10:59Z, docs +932), formations drop 11 (**#727**, 00:11:00Z, docs +1350), Pace/Nail/Flush ENC (**#737**, 00:14:47Z, docs +1195), Wave-11 SDE (**#747**, 00:22:14Z, docs), Wave 11 elite sheets (**#752**, 00:32:34Z, docs +1243), Wave 12 boss / Rush **Table J** (**#753**, 00:34:32Z, docs +1895 `BOSS_AND_SPELL_DISCOVERY.md`), and AI evolution (**#723**, 00:10:30Z, docs). One PR raced CDA-025 by 4s: Wave-11 world dynamics (**#719**, 00:09:57Z) which mutates `worldFeatures.ts` (**+6126 / −13**; **52 → 180** `WF-*` ids on branch `cursor/world-mechanics-design-8fae`) plus its test file. Live spawn still has no `isElite`, kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic` (`useBossRush.ts` 19–131), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. CDA-018/020/021/023/024/025 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-11/12 hour so implementers do not treat #719 as “just docs” (it is TypeScript) or #752/#747/#727/#726/#737/#753 as a green light for live catalogs. #680 (Wave-10, 52→164), #613 (Wave-9, 52→148), #578 (Wave-8, 52→132), and #503 (Wave-7, 52→116) are still open. Re-verified 2026-10-21.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-11/12 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #752 / #747 / #727 / #726 / #737 / #753 / #723 / #720 / #686 / #679 / #669 / #672 / #695 / #663 may land as **docs**. #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-11/12 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table J (or E–I) as live rooms until CDA-008. Do not write ENC-TEACH-11. Do not author Wave-12 elite / SDE / formation catalogs. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 180-row unread shrine catalog, a twelfth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 12th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 180 unread rows while spawn stays extra pawns; Wave-11 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #719 does not land TypeScript rows first
STATUS: NEW


---

## Unpublished 10-21 id (copied so it exists if PR #824 never merges)

Do not twin 001–027. CDA-027 overflow is CDA-028.

---

ACTION_ID: CDA-2026-10-21-027
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-12/13 elite / SDE / formation drop 12 / Rush Table K / ENC / Wave-12 WF TypeScript; do not author Wave-14 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–09-29 and this run (2026-10-21). Last `main` merge is still 2026-09-03 `#332`. No PRs 2026-09-30 … 2026-10-20. Flock resumed 2026-10-21 (`#814`+); first content-adjacent resume is **#821** AI increment (docs). CDA-026 (PR #773, 00:11:23Z) froze Wave-11/12 TypeScript and said “Do not author Wave-12 elite / SDE / formation catalogs.” After that freeze, the 2026-09-29 remaining flock authored Wave-12 world dynamics (**#786**, 00:17:49Z) which mutates `worldFeatures.ts` (**+4288 / −3**; **52 → 196** `WF-*` ids) plus its test file (+433), Wave 12 tactical spells (**#787**, 00:18:44Z, docs), formations drop 12 (**#794**, 00:22:10Z, docs), Wave 12 elite sheets (**#796**, 00:24:47Z, docs +1258), Wave-12 SDE (**#802**, 00:27:45Z, docs), Wave 13 boss / Rush **Table K** (**#808**, 00:38:56Z, docs +2113 `BOSS_AND_SPELL_DISCOVERY.md`), and AI evolution (**#804**, docs). ENC Bash/Dry/Hood (**#771**, 00:10:42Z) raced CDA-026 by 41s. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. CDA-018/020/021/023/024/025/026 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-12/13 hour **and** the 22-day stall so the resumed flock does not treat #786 as “just docs” (it is TypeScript) or #796/#802/#794/#787/#771/#808/#821 as a green light for live catalogs, and does not start Wave-14. #719 (Wave-11, 52→180), #680 (Wave-10, 52→164), #613 (Wave-9, 52→148), #578 (Wave-8, 52→132), and #503 (Wave-7, 52→116) are still open. Re-verified 2026-10-21.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-12/13 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #796 / #802 / #794 / #787 / #771 / #808 / #804 / #821 / #773 / #752 / #747 / #727 / #726 / #737 / #753 may land as **docs**. #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-12/13 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table K (or E–J) as live rooms until CDA-008. Do not write ENC-TEACH-12. Do not author Wave-14 elite / SDE / formation / Rush / ENC / WF TypeScript. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 196-row unread shrine catalog, a thirteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 13th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 196 unread rows while spawn stays extra pawns; Wave-12/13 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #786 does not land TypeScript rows first
STATUS: NEW


---

## Unpublished 10-22 id (copied so it exists if PR #881 never merges)

Do not twin 001–028. CDA-028 overflow is CDA-029.

---

ACTION_ID: CDA-2026-10-22-028
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-13/14 elite / SDE / formation drop 13 / Rush Table L / ENC / Wave-13 WF TypeScript; do not author Wave-15 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-21 and this run (2026-10-22). Last `main` merge is still 2026-09-03 `#332`. CDA-027 (PR #824, 2026-10-21T00:13:58Z) froze Wave-12/13 TypeScript and said “Do not author Wave-14 catalogs.” After that freeze, the **same hour** authored formations drop 13 (**#825**, 00:14:01Z, **3s later**, docs), Both/Stride/Near ENC (**#826**, 00:14:19Z, docs), Wave 14 boss / Rush **Table L** (**#836**, 00:17:21Z, docs +2346 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-14 sheet 027 forbade), Wave-13 SDE (**#837**, docs), Wave 13 elite sheets (**#840**, docs), Wave 13 tactical spells (**#849**, docs), and Wave-13 world dynamics (**#848**, 00:29:40Z) which mutates `worldFeatures.ts` (**52 → 212** `WF-*` ids; 6676 lines vs 1913 on `main`) plus its test file. Combat execute-parity / persist / map-crumb PRs **#842–#869** do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). CDA-018/020/021/023/024/025/026/027 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-13/14 hour so implementers do not treat #848 as “just docs” (it is TypeScript) or #825/#826/#836/#837/#840/#849 as a green light for live catalogs, and do not start Wave-15. Open WF dumps: #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#848 (212)**. Re-verified 2026-10-22.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-13/14 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #825 / #826 / #836 / #837 / #840 / #849 / #821 / #824 / #796 / #802 / #794 / #787 / #771 / #808 may land as **docs**. #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-13/14 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table L (or E–K) as live rooms until CDA-008. Do not write ENC-TEACH-13. Do not author Wave-15 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat execute-parity PRs (#842–#869) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 212-row unread shrine catalog, a fourteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 14th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 212 unread rows while spawn stays extra pawns; Wave-13/14 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #848 / #786 do not land TypeScript rows first
STATUS: NEW

---

## Unpublished 10-23 id (copied so it exists if PR #942 never merges)

Do not twin 001–029. CDA-029 overflow is CDA-030.

---

ACTION_ID: CDA-2026-10-23-029
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-14/15 elite / SDE / formation drop 14 / Rush Table M / ENC / Wave-14 WF TypeScript; do not author Wave-16 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-22 and this run (2026-10-23). Last `main` merge is still 2026-09-03 `#332` (`gh` search `merged:>=2026-09-04` = 0). CDA-028 (PR #881, 2026-10-22T00:13:31Z) froze Wave-13/14 TypeScript and said “Do not author Wave-15 catalogs.” After that freeze, the **same hour** authored Heave/Dual/Mid ENC (**#885**, 00:14:05Z, **34s later**, docs +1206), Wave 14 tactical spells (**#890**, docs +1181), formations drop 14 (**#897**, 00:17:48Z, docs +1355), Wave 14 elite sheets (**#899**, docs +1178), Wave-14 SDE (**#906**, docs), Wave 15 boss / Rush **Table M** (**#903**, 00:22:52Z, docs +2565 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-15 sheet 028 forbade), and Wave-14 world dynamics (**#902**, 00:20:22Z) which mutates `worldFeatures.ts` (**+5257 / −3**; **52 → 228** `WF-*` ids; counted on `refs/pull/902/head`) plus its test file (+542). Combat execute-parity / persist / map-crumb PRs **#870–#927** (including pack-kit assign **#911**) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 5744–5860 spawn; 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike ids (WX 2688–2700, 11920–11923) — CDA-012, not a new family. CDA-018/020/021/023/024/025/026/027/028 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-14/15 hour so implementers do not treat #902 as “just docs” (it is TypeScript) or #885/#890/#897/#899/#903/#906 as a green light for live catalogs, and do not start Wave-16. Open WF dumps: #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#902 (228)**. Re-verified 2026-10-23.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-14/15 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #885 / #890 / #897 / #899 / #903 / #906 / #874 / #881 / #825 / #826 / #836 / #837 / #840 / #849 may land as **docs**. #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-14/15 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table M (or E–L) as live rooms until CDA-008. Do not write ENC-TEACH-14. Do not author Wave-16 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat execute-parity PRs (#870–#927, including #911 pack-kit assign) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 228-row unread shrine catalog, a fifteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 15th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 228 unread rows while spawn stays extra pawns; Wave-14/15 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #902 / #848 / #786 do not land TypeScript rows first
STATUS: NEW

---

## Unpublished 10-24 id (copied so it exists if PR #982 never merges)

Do not twin 001–030. CDA-030 overflow is CDA-031.


---

ACTION_ID: CDA-2026-10-24-030
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-15/16 elite / SDE / formation drop 15 / Rush Table N / ENC / Wave-15 WF TypeScript; do not author Wave-17 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-23 and this run (2026-10-24). Last `main` merge is still 2026-09-03 `#332` (`gh` search `merged:>=2026-09-04` = 0). CDA-029 (PR #942, 2026-10-23T00:12:47Z) froze Wave-14/15 TypeScript and said “Do not author Wave-16 catalogs.” After that freeze, the **same hour** authored Wave 15 elite sheets (**#941**, 00:12:47Z, **same second**, docs +1138 `ENEMY_ELITE_EVOLUTION_2026-10-23.md`), Wave-15 world dynamics (**#949**, 00:14:42Z) which mutates `worldFeatures.ts` (**52 → 244** `WF-*` ids; counted on `refs/pull/949/head`; +9239 across 15 files) plus its test file, Wave 16 boss / Rush **Table N** (**#951**, 00:15:43Z, docs +2778 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-16 sheet 029 forbade), Wave 15 tactical spells (**#953**, 00:17:27Z, docs +974), formations drop 15 (**#956**, 00:19:02Z, docs +1375), Dry/Lean/Odd ENC (**#957**, 00:19:08Z, docs +1231), Wave-15 SDE (**#962**, 00:23:08Z, docs), Expansion Director catalog (**#944**, docs), and AI evolution (**#958**, docs). Combat execute-parity / persist / map-crumb PRs **#870–#979** (including pack-kit assign **#911**, still open) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. No 2026-10-24 content dumps existed at inspection (newest open PR #979, 2026-10-23T21:20:23Z). Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike ids (WX 2688–2700, 11920–11923) — CDA-012, not a new family. CDA-018/020/021/023/024/025/026/027/028/029 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-15/16 hour so implementers do not treat #949 as “just docs” (it is TypeScript) or #941/#951/#953/#956/#957/#962 as a green light for live catalogs, and do not start Wave-17. Open WF dumps: #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#949 (244)**. Re-verified 2026-10-24.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-15/16 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #941 / #951 / #953 / #956 / #957 / #962 / #944 / #958 / #942 / #885 / #890 / #897 / #899 / #903 / #906 may land as **docs**. #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-15/16 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table N (or E–M) as live rooms until CDA-008. Do not write ENC-TEACH-15. Do not author Wave-17 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat execute-parity PRs (#870–#979, including #911 pack-kit assign) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 244-row unread shrine catalog, a sixteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 16th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 244 unread rows while spawn stays extra pawns; Wave-15/16 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #949 / #902 / #848 / #786 do not land TypeScript rows first
STATUS: NEW

---

## Unpublished 10-25 id (copied so it exists if PR #1069 never merges)

Do not twin 001–031. CDA-031 overflow is CDA-032.

---

ACTION_ID: CDA-2026-10-25-031
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-16/17 elite / SDE / formation drop 16 / Rush Table O / ENC / Wave-16 WF TypeScript; do not author Wave-18 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-24 and this run (2026-10-25). Last `main` merge is still 2026-09-03 `#332` (`gh` search `merged:>=2026-09-04` = 0). CDA-030 (PR #982, 2026-10-24T00:11:16Z) froze Wave-15/16 TypeScript and said “Do not author Wave-17 catalogs.” After that freeze, the **same hour** authored Wave-16 world dynamics (**#993**, 00:14:55Z, **3m39s later**) which mutates `worldFeatures.ts` (**+6214 / −3**; **52 → 260** `WF-*` ids; counted on `refs/pull/993/head`; restacked onto #949’s 244 + 16; 8124 lines vs 1913 on `main`) plus its test file (+655), Wave 16 elite sheets (**#997**, 00:16:52Z, docs +1227 `ENEMY_ELITE_EVOLUTION_2026-10-24.md`), AI evolution (**#999**, 00:16:55Z, docs +644), Wave 17 boss / Rush **Table O** (**#1004**, 00:18:35Z, docs +2991 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-17 sheet 030 forbade), formations drop 16 (**#1005**, 00:19:03Z, docs +1370), Gaunt/Even/Brick/Orth ENC (**#1006**, 00:19:24Z, docs +1202), Wave 16 tactical spells (**#1011**, 00:21:27Z, docs +982), and Wave-16 SDE (**#1017**, 00:31:28Z, docs +1447). Combat leftover / persist / map-crumb PRs **#870–#1042** (including pack-kit assign **#911**, still open; 10-24 healer Frost/Inferno leftovers **#985 / #989 / #1026 / #1033 / #1034 / #1039**) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. Those healer leftovers **worsen CDA-002 without CDA-006**: they make advertised Blood Mend fire on wounded queens once kit band is numeric. Same-hour 2026-10-25 sibling automations (#1043–#1055, #1057–#1058: persist leftovers, enemy/boss admin re-audit, telemetry, WDEAD, Expansion Director) did **not** grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts`. **Raced this freeze:** Poise/Knight/Pit/Spent ENC (**#1056**) is a Wave-18 encounter sheet. Do not treat it as a green light for live ENC code or further Wave-18 TypeScript. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike ids (WX 2688–2700, 11920–11923) — CDA-012, not a new family. CDA-018/020/021/023/024/025/026/027/028/029/030 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-16/17 hour so implementers do not treat #993 as “just docs” (it is TypeScript) or #997/#1004/#1005/#1006/#1011/#1017 as a green light for live catalogs, and do not start Wave-18. Open WF dumps: #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#993 (260)**. Re-verified 2026-10-25.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; Wave-16/17 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #997 / #1004 / #1005 / #1006 / #1011 / #1017 / #999 / #982 / #941 / #951 / #953 / #956 / #957 / #962 may land as **docs**. #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). Do not add Wave-16/17 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table O (or E–N) as live rooms until CDA-008. Do not write ENC-TEACH-16. #1056 may land as **docs**. Do not author Wave-18 elite / SDE / formation / Rush / WF TypeScript, and do not append #1056 as live ENC rooms. Combat leftover PRs (#870–#1042, including #911 pack-kit assign and #985/#989/#1026/#1033/#1034/#1039 healer Frost/Inferno) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 260-row unread shrine catalog, a seventeenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, and a 17th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 260 unread rows while spawn stays extra pawns; Wave-16/17 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first
STATUS: NEW


---

## Unpublished 10-26 id (copied so it exists if PR #1120 never merges)

Do not twin 001–032. CDA-032 overflow is CDA-033.

---

ACTION_ID: CDA-2026-10-26-032
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-17/18 elite / SDE / formation drop 17 / Rush Table P / ENC / Wave-17 WF TypeScript; do not author Wave-19 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-25 and this run (2026-10-26). Last `main` merge is still 2026-09-03 `#332` (`git log origin/main -1`). CDA-031 (PR #1069, 2026-10-25T00:16:17Z) froze Wave-16/17 TypeScript and said “Do not author Wave-18 catalogs.” The **same hour** still authored Wave-17 world dynamics (**#1064**, 00:15:20Z, **57s before** the freeze landed) which mutates `worldFeatures.ts` (**+6693 / −3**; **52 → 276** `WF-*` ids; counted on `bb629a9` / `refs/pull/1064/head`; 8604 lines vs 1913 on `main`; last ids `WF-EVT-FILE_HOUR` / `WF-ENV-STRIDE_DRAFT`) plus its test file (+713), Wave 17 tactical spells (**#1063**, 00:15:04Z, docs +1004), Poise/Knight/Pit/Spent ENC (**#1056**, 00:13:45Z, docs +1226 — already named as racing 031), then **after** #1069: Orbiting Cinder leftover occupancy (**#1071**, 00:17:05Z, **48s later**, production `occupancyOrbitingCinderUnseal.ts` +418 / test +860), Wave 17 elite sheets (**#1073**, 00:17:24Z, docs +1261 `ENEMY_ELITE_EVOLUTION_2026-10-25.md`), formations drop 17 (**#1075**, 00:17:31Z, docs +1365), Wave 18 boss / Rush **Table P** (**#1080**, 00:23:40Z, docs +3206 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-18 sheet 031 forbade), Wave-17 SDE (**#1082**, 00:28:24Z, docs +1486), and AI evolution (**#1072**, 00:17:13Z, docs +684). Later 10-25 leftover-crumb occupancy named after unread `WF-*` tiles: Gutter Steam (**#1086** `occupancyGutterSteamUnseal.ts`), Frost Pane (**#1093** `occupancyFrostPaneUnseal.ts`), Triune Pads (**#1103** `occupancyTriunePadsUnseal.ts`). Those modules do not grow `worldFeatures.ts` row counts and must not substitute for CDA-014 (WX import of one existing id). Combat leftover / persist / map-crumb PRs **#870–#1107** (including pack-kit assign **#911**, still open; 10-24 healer Frost/Inferno leftovers **#985/#989/#1026/#1033/#1034/#1039**; 10-25 healer/caster Frost leftovers **#1054/#1081/#1085/#1090**; reflect soaks **#1079/#1084**) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. Those healer leftovers **worsen CDA-002 without CDA-006**. No 2026-10-26 content dumps existed at inspection (newest open catalog flock is 10-25). Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike (WX 2688–2700, 11920–11923) — CDA-012, not a new family. CDA-018/020/021/023/024/025/026/027/028/029/030/031 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030/031 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-17/18 hour so implementers do not treat #1064 as “just docs” (it is TypeScript) or #1073/#1075/#1080/#1082/#1063/#1056 as a green light for live catalogs, and do not start Wave-19. Open WF dumps: #993 (260), #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#1064 (276)**. Re-verified 2026-10-26.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; leftover-crumb occupancy named after unread WF tiles; Wave-17/18 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #1073 / #1075 / #1080 / #1082 / #1063 / #1056 / #1072 / #1069 / #997 / #1004 / #1005 / #1006 / #1011 / #1017 may land as **docs**. #1064 / #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). #1071 / #1086 / #1093 / #1103 leftover occupancy may land as destack tests; they must not become the WX `worldFeatures` import or append `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. Do not add Wave-17/18 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table P (or E–O) as live rooms until CDA-008. Do not write ENC-TEACH-17. Do not author Wave-19 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat leftover PRs (#870–#1107, including #911 pack-kit assign and healer Frost leftovers) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 276-row unread shrine catalog, an eighteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, a leftover-crumb Orbiting Cinder standing in for a wired shrine, and an 18th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030; CDA-2026-10-25-031
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 276 unread rows while spawn stays extra pawns; Wave-17/18 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts; leftover occupancy for Orbiting Cinder / Gutter Steam / Frost Pane / Triune Pads becomes a second, un-gated world-feature channel).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #1064 / #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first; WX still does not import leftover-crumb occupancy as a family/formation/shrine bind
STATUS: NEW


---

## Unpublished 10-27 id (copied so it exists if PR #1167 never merges)

Do not twin 001–033. CDA-033 overflow is CDA-034.

---

ACTION_ID: CDA-2026-10-27-033
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-18/19 elite / SDE / formation drop 18 / Rush Table Q / ENC / Wave-18 WF TypeScript; do not author Wave-20 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-26 and this run (2026-10-27). Last `main` merge is still 2026-09-03 `#332` (`git log origin/main -1`; `gh` merged list newest is still #332). CDA-032 (PR #1120, 2026-10-26T00:14:13Z) froze Wave-17/18 TypeScript and said “Do not author Wave-19 catalogs.” The **same hour** still authored Wave-18 world dynamics (**#1114**, 00:13:17Z, **56s before** the freeze landed) which mutates `worldFeatures.ts` (**+11572 / −13**; **52 → 292** `WF-*` ids; counted on `cursor/world-mechanics-design-b8e4` / `refs/pull/1114/head`; 9081 lines vs 1913 on `main`; last ids `WF-EVT-READY_HOUR` / `WF-ENV-PAIR_DRAFT`) plus its test file, then **after** #1120: Tally/Rank/Spike/Odd ENC (**#1121**, 00:14:35Z, **22s later**, docs +1294), Wave 18 tactical spells (**#1132**, 00:16:39Z, docs +926), formations drop 18 (**#1134**, 00:18:05Z, docs +1372), Wave 18 elite sheets (**#1138**, 00:19:51Z, docs +1270 `ENEMY_ELITE_EVOLUTION_2026-10-26.md`), Wave 19 boss / Rush **Table Q** (**#1139**, 00:20:06Z, docs +3411 `BOSS_AND_SPELL_DISCOVERY.md` — the Wave-19 sheet 032 forbade), Wave-18 SDE (**#1143**, 00:32:51Z, docs +1507), and AI evolution (**#1135**, 00:18:15Z, docs +689). Later 10-26 leftover-crumb occupancy named after unread tiles: Slipstream (**#1146** `occupancySlipstreamUnseal.ts` +1478), Cinder Barrel (**#1154** `occupancyCinderBarrelUnseal.ts` +1504), MAP_ROTATE / MIRROR_INVERT (**#1161** `occupancyMapRotateUnseal.ts` +1066). Those modules do not grow `worldFeatures.ts` row counts and must not substitute for CDA-014 (WX import of one existing id). Combat leftover / persist / map-crumb PRs **#870–#1162** (including pack-kit assign **#911**, still open; advertised-modifier honesty **#1142** Plague Zone soak / **#1148** Vampiric Ground 15% / **#1155** Iron Curse ×0.5 / **#1160** Glass Realm ×2) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. #1160 makes a numeric DAMAGE reskin truthful; it does **not** fill CDA-011 (slime ≡ frozen; gravity_well / fog_of_war still empty hooks). Healer leftovers still **worsen CDA-002 without CDA-006**. Same-hour 2026-10-27 sibling automations (#1163 enemy/boss admin re-audit, #1164 Enthroned Void leftover, #1165 telemetry, #1166 summon Inferno CD) did **not** grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts`. No Wave-20 elite / SDE / formation / Rush / ENC / WF TypeScript existed at inspection. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts`. `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike (WX 2688–2700, 11920–11923) — CDA-012, not a new family. CDA-018/020/021/023/024/025/026/027/028/029/030/031/032 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030/031/032 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-18/19 hour so implementers do not treat #1114 as “just docs” (it is TypeScript) or #1138/#1134/#1139/#1143/#1132/#1121 as a green light for live catalogs, and do not start Wave-20. Open WF dumps: #1064 (276), #993 (260), #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#1114 (292)**. Re-verified 2026-10-27.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; leftover-crumb occupancy named after unread WF tiles; Wave-18/19 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #1138 / #1134 / #1139 / #1143 / #1132 / #1121 / #1135 / #1120 / #1073 / #1075 / #1080 / #1082 / #1063 / #1056 may land as **docs**. #1114 / #1064 / #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). #1071 / #1086 / #1093 / #1103 / #1146 / #1154 / #1161 leftover occupancy may land as destack tests; they must not become the WX `worldFeatures` import or append `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. Do not add Wave-18/19 names to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table Q (or E–P) as live rooms until CDA-008. Do not write ENC-TEACH-18. Do not author Wave-20 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat leftover PRs (#870–#1162, including #911 pack-kit assign, healer Frost leftovers, and #1148/#1155/#1160 advertised-modifier honesty) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 292-row unread shrine catalog, a nineteenth family sticker, a 33rd innate spell, a named formation battle-start still scatters, a leftover-crumb Slipstream / Cinder Barrel standing in for a wired shrine, and a 19th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030; CDA-2026-10-25-031; CDA-2026-10-26-032
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 292 unread rows while spawn stays extra pawns; Wave-18/19 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts; leftover occupancy for Slipstream / Cinder Barrel / MAP_ROTATE becomes a second, un-gated world-feature channel).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #1114 / #1064 / #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first; WX still does not import leftover-crumb occupancy as a family/formation/shrine bind
STATUS: NEW


---

## Unpublished 10-28 id (copied so it exists if PR #1222 never merges)

Do not twin 001–034. CDA-034 overflow is CDA-035.

---

ACTION_ID: CDA-2026-10-28-034
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-19/20 elite / SDE / formation drop 19 / Rush Table R / ENC / Wave-19 WF TypeScript; do not author Wave-21 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-27 and this run (2026-10-28). Last `main` merge is still 2026-09-03 `#332` (`git log origin/main -1`; `gh` merged list newest is still #332). Open PR count ~886. CDA-033 (PR #1167, 2026-10-27T00:12:47Z) froze Wave-18/19 TypeScript and said “Do not author Wave-20 catalogs.” The **same hour** still authored Wave 20 boss / Rush **Table R** (**#1170**, 00:14:38Z, **1m51s later**, docs +4610/−1015 `BOSS_AND_SPELL_DISCOVERY.md` — quartet `trim_abbot` / `ready_commissary` / `lean_procurator` / `near_scholastic`; the Wave-20 sheet 033 forbade) and Wave-19 world dynamics (**#1172**, 00:15:23Z, **2m36s later**) which mutates `worldFeatures.ts` (**+7650 / −3** on that file; PR total **+12352 / −13** across 19 files; restacked onto #1114; **52 → 308** `WF-*` ids counted on `refs/pull/1172/head`; 9563 lines vs 1913 on `main`; last ids `WF-EVT-MATCH_HOUR` / `WF-ENV-MATCH_DRAFT`; Wave-19 ids Match Seam / Match Cinder / Match Plate / Match Pane / Match Sill / Match Font / Match Step / Match Gate / Match File / Match Picket / Match Cache / Match Tutor / Match Oath / Match Cast / Match Hour / Match Draft) plus `worldFeatures.test.ts` (+832/−5). Then **after** #1167: Latch Gate leftover occupancy (**#1174**, 00:16:30Z), Wave 18 formations drop 19 (**#1176**, 00:17:28Z, docs +1397 `ENEMY_FORMATIONS_2026-10-27.md`), Wave 19 tactical spells (**#1177**, 00:17:59Z), Wave 19 elite sheets (**#1189**, 00:23:17Z, docs +1199 `ENEMY_ELITE_EVOLUTION_2026-10-27.md` — **32** proposed family sheets `sestet_mender` … `strike_plater`), Score/File/Lava/Ready ENC (**#1195**, 00:28:43Z), Wave-19 SDE (**#1198**, 00:55:56Z, docs +1284), and AI evolution (**#1192**, 00:24:15Z). Later 10-27 leftover-crumb occupancy named after unread tiles: Pendulum Censer (**#1201**), Hourglass Arch (**#1209**), Shift Slab (**#1213**). Those modules do not grow `worldFeatures.ts` row counts and must not substitute for CDA-014 (WX import of one existing id). Combat leftover / persist / map-crumb / advertised-modifier honesty PRs **#870–#1217** (including pack-kit assign **#911**, still open; 10-26 honesty **#1148** Vampiric Ground / **#1155** Iron Curse heal×0.5 / **#1160** Glass Realm ×2; 10-27 honesty **#1182** Void Rift tick / **#1199** Mending Mist 5% / **#1200** Iron Curse RES×1.3 / **#1202** Swift Winds +2 MP / **#1203** Titan’s Vigor +1000 HP / **#1207** Doka Fever +25% enemy HP / **#1208** Titan’s Vigor 1–5× / **#1210** Arcane Overflow FAIL-roll / **#1216** Glyph Trap 15 / **#1217** Broodmother larva venom) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. They do **not** fill CDA-011 (slime ≡ frozen; gravity_well / fog_of_war still empty hooks). Glass Realm ×2 / Titan roll / Doka Fever +25% remain numeric DAMAGE reskins. Healer leftovers still **worsen CDA-002 without CDA-006**. Same-hour 2026-10-28 sibling automations (**#1218** enemy/boss admin re-audit, **#1219** dead-code audit, **#1220** Final Pawn leftover honesty) did **not** grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts`. No Wave-21 elite / SDE / formation / Rush / ENC / WF TypeScript existed at inspection. Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920; `levelZone` object at WX 592; `enemyAI.ts` 199 `Math.floor`), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts` (only `worldFeatures.test.ts` does). `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike (WX 2688–2700, 11920–11923) — CDA-012, not a new family. `inferArchetype` still has no `return "summoner"` (`enemyAI.ts` 447–477). Summoner chance still `0.12 + 0.02 * playerLevel` (WX 11932–11939; saturates at 44). CDA-018/020/021/023/024/025/026/027/028/029/030/031/032/033 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030/031/032/033 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-19/20 hour so implementers do not treat #1172 as “just docs” (it is TypeScript) or #1189/#1176/#1170/#1198/#1177/#1195 as a green light for live catalogs, and do not start Wave-21. Open WF dumps: #1114 (292), #1064 (276), #993 (260), #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#1172 (308)**. Re-verified 2026-10-28.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; leftover-crumb occupancy named after unread WF tiles; Wave-19/20 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #1189 / #1176 / #1170 / #1198 / #1177 / #1195 / #1192 / #1167 / #1138 / #1134 / #1139 / #1143 / #1132 / #1121 may land as **docs**. #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). #1071 / #1086 / #1093 / #1103 / #1146 / #1154 / #1161 / #1174 / #1201 / #1209 / #1213 leftover occupancy may land as destack tests; they must not become the WX `worldFeatures` import or append `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. Do not add Wave-19/20 names (`sestet_mender`, `trim_abbot`, Match-* `WF-*`) to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table R (or E–Q) as live rooms until CDA-008. Do not write ENC-TEACH-19. Do not author Wave-21 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat leftover PRs (#870–#1217, including #911 pack-kit assign, healer Frost leftovers, and advertised-modifier honesty) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 308-row unread shrine catalog, a twentieth family sticker, a 33rd innate spell, a named formation battle-start still scatters, a leftover-crumb Latch Gate / Pendulum Censer standing in for a wired shrine, and a 20th dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030; CDA-2026-10-25-031; CDA-2026-10-26-032; CDA-2026-10-27-033
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 308 unread rows while spawn stays extra pawns; Wave-19/20 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts; leftover occupancy for Latch Gate / Pendulum Censer / Hourglass Arch / Shift Slab becomes a second, un-gated world-feature channel).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first; WX still does not import leftover-crumb occupancy as a family/formation/shrine bind
STATUS: NEW


---

## Unpublished 10-29 id (copied so it exists if PR #1295 never merges)

Do not twin 001–035. CDA-035 overflow is CDA-036.

---

ACTION_ID: CDA-2026-10-29-035
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-20/21 elite / SDE / formation drop 20 / Rush Table S / ENC / Wave-20 WF TypeScript and raced Wave-21 WF TypeScript; do not author Wave-22 catalogs until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-28 and this run (2026-10-29). Last `main` merge is still 2026-09-03 `#332` (`git log origin/main -1`; `gh` `merged:>=2026-09-04` = 0). Open PR count **945+** (still climbing this hour). CDA-034 (PR #1222, 2026-10-28T00:11:17Z) froze Wave-19/20 TypeScript and said “Do not author Wave-21 catalogs.” The **same hour** still authored Wave-20 world dynamics (**#1235**, 00:14:25Z, **3m8s later**) which mutates `worldFeatures.ts` (**+8128 / −3** on that file; PR total **+13130**; restacked onto #1172; **52 → 324** `WF-*` ids counted on `refs/pull/1235/head` blob `f5b53cc4`; **10038** lines vs 1913 on `main`; last ids `WF-EVT-POISE_HOUR` / `WF-ENV-POISE_DRAFT`; Wave-20 block is Poise Seam / Poise Cinder / Poise Plate / Poise Pane / Poise Sill / Poise Font / Poise Step / Poise Gate / Poise File / Poise Picket / Poise Cache / Poise Tutor / Poise Oath / Poise Cast / Poise Hour / Poise Draft) plus `worldFeatures.test.ts` (+893/−5). Then **after** #1222: Raise Slab leftover occupancy (**#1229**, 00:12:46Z, **1m29s later**, `occupancyRaiseSlabUnseal.ts`), Wave 19 formations drop 20 (**#1237**, 00:15:17Z, docs +1390 `ENEMY_FORMATIONS_2026-10-28.md`), Wave 21 boss / Rush **Table S** (**#1244**, 00:17:22Z, **6m5s later**, docs +4825 `BOSS_AND_SPELL_DISCOVERY.md` — rooms S0–S3 `sip_visitor`+`gaze_beadle` / `halve_registrar`+`veil_verger` / `odd_penitentiary`+`cinder_lance` / `sill_suffragan`+`goad_pretender`; the Wave-21 sheet 034 forbade), Wave 20 elite sheets (**#1248**, 00:19:18Z, docs +1203 `ENEMY_ELITE_EVOLUTION_2026-10-28.md` — **32** proposed family sheets `septet_mender` … `idle_plater`), Stave/Ring/Rime/Match ENC (**#1249**, 00:20:18Z, docs +1231), Wave 20 tactical spells (**#1251**, 00:21:11Z, docs +933), Wave-20 SDE (**#1255**, 00:33:43Z, docs +1288). Later 10-28 leftover-crumb occupancy named after unread tiles: Ratchet Cog (**#1258** `occupancyRatchetCogUnseal.ts` +1485), Turnstile Ember (**#1265** `occupancyTurnstileEmberUnseal.ts` +1582), Twin Sparks (**#1275** `occupancyTwinSparksUnseal.ts` +1682). **Raced this freeze (cron 00:03:15Z):** Wave-21 world dynamics (**#1285**, 00:13:28Z) which mutates `worldFeatures.ts` (**+8607 / −3**; PR total **+13912**; restacked onto #1235; **52 → 340** `WF-*` ids counted on `refs/pull/1285/head` blob `aba6f33f`; **10517** lines vs 1913 on `main`; last ids `WF-EVT-QUOTA_HOUR` / `WF-ENV-QUOTA_DRAFT`; Wave-21 block is Quota Seam / Quota Cinder / Quota Plate / Quota Pane / Quota Sill / Quota Font / Quota Step / Quota Gate / Quota File / Quota Picket / Quota Cache / Quota Tutor / Quota Oath / Quota Cast / Quota Hour / Quota Draft) plus `worldFeatures.test.ts` (+955/−5), and leftover Windrow occupancy (**#1283**, 00:12:39Z, `occupancyWindrowUnseal`). Those leftover modules do not grow `worldFeatures.ts` row counts and must not substitute for CDA-014 (WX import of one existing id). Combat leftover / persist / map-crumb / advertised-modifier honesty PRs **#870–#1291** (including pack-kit assign **#911**, still open; 10-26/10-27 honesty **#1148/#1155/#1160/#1199/#1200/#1203/#1207/#1208**; 10-28 honesty **#1252** Glass Realm ×2 on pack fallback melee; 10-29 leftover **#1278** Pale Archbishop skeleton-minion atk 8) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. They do **not** fill CDA-011 (slime ≡ frozen; gravity_well / fog_of_war still empty hooks). Glass Realm ×2 / Titan roll / Doka Fever +25% remain numeric DAMAGE reskins. Healer leftovers still **worsen CDA-002 without CDA-006**. Same-hour 2026-10-29 sibling automations (**#1277** telemetry, **#1279** emergent meta, **#1281** Master roadmap, **#1282** telemetry architecture, **#1284** enemy/boss admin re-audit, **#1287** Expansion Director, **#1289** WDEAD, **#1291** SDA) did **not** grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. No Wave-22 elite / SDE / formation / Rush / ENC / WF TypeScript existed at inspection (`gh` Wave 22 search is a false-positive merged persist fix **#22**). Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920; `levelZone` object at WX 592; `enemyAI.ts` 199 `Math.floor`), quadrant scatter (WX 11869–11891 battle start), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts` (only `worldFeatures.test.ts` does). `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2396–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike (WX 2688–2700, 11920–11923) — CDA-012, not a new family. `inferArchetype` still has no `return "summoner"` (`enemyAI.ts` 447–477). Summoner chance still `0.12 + 0.02 * playerLevel` (WX 11932–11939; saturates at 44). CDA-018/020/021/023/024/025/026/027/028/029/030/031/032/033/034 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030/031/032/033/034 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-20/21 hour so implementers do not treat #1235 / **#1285** as “just docs” (they are TypeScript) or #1248/#1237/#1244/#1255/#1251/#1249 as a green light for live catalogs, and do not start Wave-22. Open WF dumps: #1235 (324), #1172 (308), #1114 (292), #1064 (276), #993 (260), #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#1285 (340)**. Re-verified 2026-10-29.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; leftover-crumb occupancy named after unread WF tiles; Wave-20/21 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #1248 / #1237 / #1244 / #1255 / #1251 / #1249 / #1222 / #1189 / #1176 / #1170 / #1198 / #1177 / #1195 may land as **docs**. #1285 / #1235 / #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). #1071 / #1086 / #1093 / #1103 / #1146 / #1154 / #1161 / #1174 / #1201 / #1209 / #1213 / #1229 / #1258 / #1265 / #1275 / #1283 leftover occupancy may land as destack tests; they must not become the WX `worldFeatures` import or append `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. Do not add Wave-20/21 names (`septet_mender`, `sip_visitor`, Poise-* / Quota-* `WF-*`) to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table S (or E–R) as live rooms until CDA-008. Do not write ENC-TEACH-20. Do not author Wave-22 elite / SDE / formation / Rush / ENC / WF TypeScript. Combat leftover PRs (#870–#1291, including #911 pack-kit assign, healer Frost leftovers, and advertised-modifier honesty including #1252) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 340-row unread shrine catalog, a twenty-first family sticker, a 33rd innate spell, a named formation battle-start still scatters, a leftover-crumb Raise Slab / Twin Sparks / Windrow standing in for a wired shrine, and a 21st dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030; CDA-2026-10-25-031; CDA-2026-10-26-032; CDA-2026-10-27-033; CDA-2026-10-28-034
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps to 340 unread rows while spawn stays extra pawns; Wave-20/21 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts; leftover occupancy for Raise Slab / Twin Sparks / Windrow becomes a second, un-gated world-feature channel).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #1285 / #1235 / #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first; WX still does not import leftover-crumb occupancy as a family/formation/shrine bind
STATUS: NEW


---

## New this run (do not twin 001–035)

---

ACTION_ID: CDA-2026-10-31-036
SOURCE_AUTOMATION: Content Diversity & Repetition Auditor
TITLE: Freeze Wave-21/22 elite / SDE / formation drop 21 / Rush Table T / ENC; do not author Wave-23 catalogs or Wave-22 WF TypeScript until families bind, one WF-* is imported, kits+AI bind, one formation is live, and room-0 resurge exists
CATEGORY: OBJECTIVE_PLAY
PRIORITY: P0
CONFIDENCE: HIGH
EVIDENCE: HEAD `0f5363f` unchanged vs 09-21–10-29 and this run (2026-10-31). Last `main` merge is still 2026-09-03 `#332` (`git log origin/main -1`; `gh` `merged:>=2026-09-04` = 0). Open PR count **1022**. CDA-035 (PR #1295, 2026-10-29T00:18:16Z) froze Wave-20/21 TypeScript and said “Do not author Wave-22 catalogs.” **Partial hold:** no Wave-22 `worldFeatures.ts` dump exists (`#1285` still **52 → 340** `WF-*` on `tmp-1285` / 10517 lines; `main` still 52 / 1913 lines). The **same hour after #1295** still authored Wave 22 boss / Rush **Table T** (**#1302**, 00:21:46Z, **3m30s later**, docs +5053 `BOSS_AND_SPELL_DISCOVERY.md` — Wave-22 quartet `shove_hosteler` / `must_armarius` / `mid_crucifer` / `parched_oblate`; rooms T0–T3 pair with `silent_conductor` / `levy_rector` / `ram_castellan` / `bait_vicar`; the Wave-22 sheet 035 forbade), Sestet/Tern/Mire/Stock ENC (**#1303**, 00:22:08Z, docs +1306), Wave 21 elite sheets (**#1305**, 00:23:21Z, docs +1213 `ENEMY_ELITE_EVOLUTION_2026-10-29.md` — **32** proposed family sheets `octave_mender` … `fresh_plater`), Wave 21 tactical spells (**#1309**, 00:25:13Z, docs +949), Wave-21 SDE (**#1313**, 00:34:46Z, docs +1273). Formation drop 21 (**#1294**, 00:16:23Z, docs +1374 `ENEMY_FORMATIONS_2026-10-29.md`) landed **1m53s before** the freeze. Later leftover-crumb occupancy named after unread tiles: Skipping Cinder (**#1318** `occupancySkipCinderUnseal.ts` +1616), Plumb Ember (**#1319** `occupancyPlumbEmberUnseal.ts` +1704), Rim Cinder (**#1327** `occupancyRimCinderUnseal.ts` +1835), Shy Cinder (**#1351** `occupancyShyCinderUnseal.ts` +1271). Those modules do not grow `worldFeatures.ts` row counts and must not substitute for CDA-014 (WX import of one existing id). Combat leftover / persist / map-crumb / advertised-modifier / advertised Phase-2 HP honesty PRs **#870–#1353** (including pack-kit assign **#911**, still open; 10-26/10-27/10-28 honesty **#1148/#1155/#1160/#1199/#1200/#1203/#1207/#1208/#1252**; 10-29/10-30 Phase-2 HP commits **#1329/#1332/#1336/#1338/#1342/#1343/#1345/#1349/#1352/#1353**; kit Swap/Iron Skin **#1339**; Rush table grants persist **#1348**) do not grow `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` / `worldFeatures.ts` and are out of this freeze unless a later PR appends those catalogs. They do **not** fill CDA-011 (slime ≡ frozen; gravity_well / fog_of_war still empty hooks). Glass Realm ×2 / Titan roll / Doka Fever +25% remain numeric DAMAGE reskins. Healer leftovers still **worsen CDA-002 without CDA-006**. No 2026-10-31 catalog dumps existed at inspection (newest open catalog flock is 10-29; leftover occupancy through 10-30). No Wave-23 elite / SDE / formation / Rush / ENC / WF TypeScript existed. No Wave-22 elite / SDE / formation / WF TypeScript existed (Table T is the Wave-22 overflow). Live spawn still has no `isElite` (repo-wide grep empty), kit band NaN (WX 11920; `levelZone` object at WX 592; `enemyAI.ts` 199 `Math.floor`), quadrant scatter (WX 11869–11891 battle start; overworld 5846–5866), unread `combinedMechanic` (`useBossRush.ts` 19–131, 11 hits, all in that file), room-9 `weeping_pawn_2` (127 vs `bossTypes.ts` 390–410), and 52 unused `WF-*` on `main`. WX still does not import `worldFeatures.ts` (only `worldFeatures.test.ts` does). `EnemyFamily` still seven + `default` (`gameTypes.ts` 12–20). `BOSS_RUSH_ROOMS.length` still 10. `SPELL_ID_CATALOG` still 32, all forced `isBaseSpell` (WX 2398–2400). When `filteredBackendSpells.length > 0`, pack kits resolve against Motoko’s six-id catalog and miss Frost/Strike (WX 2688–2700, 11920–11923) — CDA-012, not a new family. `inferArchetype` still has no `return "summoner"` (`enemyAI.ts` 447–477). Summoner chance still `0.12 + 0.02 * playerLevel` (WX 11932–11939; saturates at 44). CDA-018/020/021/023/024/025/026/027/028/029/030/031/032/033/034/035 already freeze `WF-*` growth; CDA-019 already freezes ENC/Rush *code*; CDA-013/022/023/024/025/026/027/028/029/030/031/032/033/034/035 already freeze `EnemyFamily` / `starterSpells` / `formationId`. This id names the Wave-21/22 hour so implementers do not treat #1302/#1305/#1313/#1309/#1303/#1294 as a green light for live catalogs, do not start Wave-23, and do not resume the WF TypeScript increment that 035 actually stopped. Open WF dumps: #1235 (324), #1172 (308), #1114 (292), #1064 (276), #993 (260), #949 (244), #902 (228), #848 (212), #786 (196), #719 (180), #680 (164), #613 (148), #578 (132), #503 (116), **#1285 (340)**. Re-verified 2026-10-31.
SYSTEMS_AFFECTED: `engine/worldFeatures.ts`; `gameTypes.ts` `EnemyFamily`; `spellData.ts` `starterSpells`; `useBossRush.ts` `BOSS_RUSH_ROOMS`; spawn / `generateEnemies` formation ids; leftover-crumb occupancy named after unread WF tiles; Wave-21/22 elite / SDE / formation / ENC / Rush docs
RECOMMENDED_ACTION: #1305 / #1294 / #1302 / #1313 / #1309 / #1303 / #1295 / #1248 / #1237 / #1244 / #1255 / #1251 / #1249 may land as **docs**. #1285 / #1235 / #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 / #719 / #680 / #613 / #578 / #503 / #454 / #399 / #344 must not merge additional `WF-*` ids until CDA-014 imports one existing id (prefer `WF-ELT-TOLL_KEEPER` or `WF-ZON-SHRINE_POOL`). #1071 / #1086 / #1093 / #1103 / #1146 / #1154 / #1161 / #1174 / #1201 / #1209 / #1213 / #1229 / #1258 / #1265 / #1275 / #1283 / #1318 / #1319 / #1327 / #1351 leftover occupancy may land as destack tests; they must not become the WX `worldFeatures` import or append `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS`. Do not add Wave-21/22 names (`octave_mender`, `shove_hosteler`, Quota-* `WF-*`) to `EnemyFamily` until CDA-001. Do not append `starterSpells` or `ENEMY_KITS` band-0 DAMAGE ids until CDA-002 **with** 006. Do not add spawn `formationId` until CDA-004. Do not append Rush Table T (or E–S) as live rooms until CDA-008. Do not write ENC-TEACH-21. Do not author Wave-23 elite / SDE / formation / Rush / ENC / WF TypeScript. Do not resume Wave-22 WF TypeScript (CDA-035’s only hold). Combat leftover PRs (#870–#1353, including #911 pack-kit assign, healer Frost leftovers, advertised-modifier honesty, and advertised Phase-2 HP commits) must not grow those catalogs either. NEW PLAYER DECISION: none until 001 / 002+006 / 004 / 008 / 014 — this prevents a 340-row unread shrine catalog from becoming 356, a twenty-second family sticker, a 33rd innate spell, a named formation battle-start still scatters, a leftover-crumb Skipping Cinder / Shy Cinder standing in for a wired shrine, and a 22nd dual-boss flavor lie.
AUTONOMY: HUMAN_APPROVE
DEPENDENCIES: CDA-2026-09-02-001; CDA-2026-09-02-002; CDA-2026-09-02-004; CDA-2026-09-02-006; CDA-2026-09-02-008; CDA-2026-09-02-012; CDA-2026-09-02-013; CDA-2026-09-02-014; CDA-2026-09-21-018; CDA-2026-09-22-019; CDA-2026-09-23-020; CDA-2026-09-24-021; CDA-2026-09-25-022; CDA-2026-09-26-023; CDA-2026-09-27-024; CDA-2026-09-28-025; CDA-2026-09-29-026; CDA-2026-10-21-027; CDA-2026-10-22-028; CDA-2026-10-23-029; CDA-2026-10-24-030; CDA-2026-10-25-031; CDA-2026-10-26-032; CDA-2026-10-27-033; CDA-2026-10-28-034; CDA-2026-10-29-035
REGRESSION_RISK: LOW (process). HIGH if ignored (`worldFeatures.ts` jumps past 340 unread rows while spawn stays extra pawns; Wave-21/22 names enter `EnemyFamily` / `starterSpells` / `BOSS_RUSH_ROOMS` while chassis stays random, kits stay band 0, and room 9 still ghosts; leftover occupancy for Skipping Cinder / Plumb Ember / Rim Cinder / Shy Cinder becomes a second, un-gated world-feature channel).
VALIDATION_REQUIRED: `worldFeatures.ts` stays 52 `WF-*` ids and `EnemyFamily` stays the live seven + `default` until 001/014 ship; `starterSpells` does not grow; spawn still has no `formationId` until 004; `BOSS_RUSH_ROOMS.length` stays 10 until 008 maps `weeping_pawn_2`; #1285 / #1235 / #1172 / #1114 / #1064 / #993 / #949 / #902 / #848 / #786 do not land TypeScript rows first; no Wave-22 `WF-*` TypeScript dump appears; WX still does not import leftover-crumb occupancy as a family/formation/shrine bind
STATUS: NEW

