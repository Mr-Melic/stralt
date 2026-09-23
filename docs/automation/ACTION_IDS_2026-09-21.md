# ACTION_IDs — 2026-09-21 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `0f5363f` (`Merge pull request #332`)  
**Prior director:** [`ACTION_IDS_2026-09-02.md`](./ACTION_IDS_2026-09-02.md) + [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md)  
**This agent:** `bc-0f5c19f1-d985-4d12-a388-d14eb6fe8935`  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files (`ACTION_IDS_SDE_*`, `ACTION_IDS_MIMA_*`, `ACTION_IDS_SDA_*`, orchestrator `ACTION_IDS_2026-09-03-0000.md`, TBC in its own file). Do not concatenate into this ledger. Do not append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, or `ACTION_IDS_2026-09-02.md`.

---

## Status of prior director IDs (reuse; do not mint twins)

| ACTION_ID | STATUS | Notes |
| :--- | :--- | :--- |
| MTD-2026-08-31-001 / MTD-2026-09-01-001 | OPEN | Flock halt failed 08-31, 09-01, 09-02 (humans merged ~70 PRs). 18-day merge silence then **26+** agents at 09-21 00:00. See MTD-2026-09-21-001. |
| MTD-2026-09-02-001 | SUPERSEDED | 09-02 wave already merged. Hold applies to the **09-21** wave. |
| MTD-2026-09-02-002 | IMPLEMENTED (source) | #259 / #311 / #324. GameKey on `20260901`. Deploy half → MTD-2026-09-21-002. |
| MTD-2026-09-02-003 | OPEN | Still freeze new stables until deploy confirmed. |
| MTD-2026-09-02-004 / AQA-2026-08-30-003 | PARTIAL | 09-02 director file stayed clean. Do not append to 08-31 / 09-01 / 09-02. |
| MTD-2026-09-01-002 / 003 / 005 | IMPLEMENTED | Death replay; live Doka helpers; ignore-client `writeLevel`. |
| MTD-2026-08-31-002 | IMPLEMENTED | Clamps on `main`. #322 also capped AP/MP. |
| AQA-2026-08-30-008 | PARTIAL | Clamps + ignore-client level + AP/MP cap; **no ADR**. |
| AQA-2026-08-30-006 | BROKEN | mapGen 1544 → **1937**. #331 open. |
| AQA-2026-08-30-007 | BROKEN | 29 WX commits since `58302bc`. |
| AQA-2026-08-30-005 | PARTIAL | Test mill still in tonight’s flock. |
| AQA-2026-08-30-012 | OPEN | Still 0 collectors. Dashboard specialist running. |
| TBC-2026-08-31-001 | OPEN | WAITING_FOR_TELEMETRY. Confirmed this run. |
| MIMA-2026-08-31-001 | OPEN | Swap still teleports (`WX` 9389–9401). No `applyHazardLanding`. |
| MIMA-2026-08-31-002 | PARTIAL | Dest occupancy/unseal landed; **no** hazard landing. |
| MIMA-2026-09-01-001 | IMPLEMENTED | #313 `battleWalkMpCost` on execute. |
| MIMA-2026-09-01-002 | PARTIAL | Barriers in `isBattleWalkTileBlocked`. Occupants still missing. |
| MIMA-2026-09-02-001 | IMPLEMENTED | #318 `enemyWalkMp.ts`. |
| MIMA-2026-09-02-003 | OPEN | GameKey redeem does not honour unpaid death 20/40. |
| PXA-2026-09-02-002 | IMPLEMENTED | #332 accepted-challenge HUD. |
| SDA-2026-08-31-002 / SDA-2026-09-01-003 / SDA-2026-09-02-003 | OPEN | Catalog still hydrates into every book. |
| SDA-2026-08-31-004 | OPEN | No observe→win persist. |
| EXPANSION-PREREQ-A | OPEN | `WX` 11920 still passes LevelZone object. Number already at 4678–4680. |
| MTD-2026-08-31-003 | OPEN | HP/death extraction. Not tonight. |
| MTD-2026-08-31-004 | OPEN | Expansion freeze. Implementer flock running again. |
| MTD-2026-08-31-005 | OPEN | `useSaveKillCount` unused. |
| MTD-2026-08-31-006 | OPEN | Admin DVA not canister. |
| MTD-2026-08-31-007 | OPEN | Point at SDA-002/004; no fifth schema. |
| MTD-2026-08-31-008 | OPEN | 30% random AI tier (`combatMath.ts` 48–50). |
| LHIPS-2026-09-01-001 | NEW / HOLD | HUD saturates at 48. Do not retune curve. |
| LHIPS-2026-09-01-002 | NEW / HOLD | 100k/500k clamp vs jackpot. Architecture, not a BAL retune. |
| RAO-2026-09-03-0000-003 | NEEDS_HUMAN_DECISION | Paper Windstorm two live rates. Do not “fix” announce alone. |
| RAO-2026-09-03-0000-002 | DEFERRED | Feats vs Achievements recap copy. Display-only when WX is quiet. |

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Failed 2026-08-31, 09-01, 09-02 (humans then merged the leftover queue). `main` then sat **18 days** with only #327/#331 open — the only halt that worked was human inactivity. Recurred 2026-09-21 00:00: **26+** automations already RUNNING including combat parity `f37b7505`, persist `607e0304`, adversarial QA `08e7de28`, security `c97e5c0c`, critical defects `1aa41c6c` (confirmed enabled), admin ×2, AI, formations, spell mechanics, world content, telemetry dashboard `4b026695`. Cursor has no dashboard write API.  
SYSTEMS_AFFECTED: all implementer automations; merge queue; live Caffeine upgrade  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless unique, display-only, and not already on `main`. Stagger crons. Pause map/combat/persist/Motoko-stables implementers 6 hours after a `main` merge that touches WX, `progressPersist`, `mapGen`, or `main.mo` — and also after an 18-day freeze, so the first restart is report-only.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run sees ≤3 new gameplay PRs from this wave, and those PRs do not retouch persist / targeting / mapGen / WX / `main.mo` stables.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-21-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-09-21 00:00 specialist wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 26 RUNNING agents listed this hour (see MASTER_ROADMAP). Queue at start of run: only stale drafts #327 and #331. Unique P0 is Caffeine deploy confirmation, not another gameplay PR. 09-02 wave already proved humans will merge overlapping persist/targeting/mapGen PRs if they exist.  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; `main.mo`; AdminDashboard; migrations  
RECOMMENDED_ACTION: Default HOLD any PR from this wave. Orchestrator may implement one unique display-only item (Feats vs Achievements copy is the leftover). Designers update their own dated files; do not rewrite SDA/SDE/EBA schemas; do not restack GameKey, Frozen MP, spawnPolicy, or death-penalty.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No mapGen / persist-lock / targeting / enemyAI / AdminDashboard / Motoko-stables gameplay PR merges from this wave except human-approved restack of #327.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-21-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Confirm Caffeine deploy of the 20260901 GameKey tail and refresh .old  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Source chain on `0f5363f` is the intended shape (`20260831` frozen without GameKey; `20260901` adds GameKey with `OldActor = {}`; `check-limit = 5`; snapshots under `src/backend/migrations/snapshots/deployed/`). Repo `.old/src/backend/dist/backend.most` is still required to match `caffeine-aug31-import-tail-20260831-no-gamekey.most` (Caffeine’s last **successfully deployed** build = 2026-08-31 / PR #181 `f8aa05e`). No later `snapshots/deployed/` file exists. 18 days of zero commits after #324. ENGINEERING: import of HEAD vs that `.old` should now pass (GameKey produced after the deployed tail). Ops: we cannot see Caffeine’s private copy. If import never ran, live canister `cwofb…` / `zh6cg…` still cannot take GameKey. If import ran and succeeded, `.old` was not refreshed — the next import will keep comparing against Aug-31.  
SYSTEMS_AFFECTED: Caffeine deploy; `.old`; `snapshots/deployed/`; GameKey shop  
RECOMMENDED_ACTION: Human: GitHub → Caffeine import of current `main`. On success, replace `.old` with that build’s `src/backend/dist/backend.most` and add the same file under `snapshots/deployed/`. Do not hand-write `.old`. Do not add new stables until this lands.  
AUTONOMY: HUMAN_REVIEW + deploy  
DEPENDENCIES: MTD-2026-09-02-002 (source done)  
REGRESSION_RISK: HIGH if a parallel agent amends 20260831 / 20260901; LOW if deploy is the only Motoko change.  
VALIDATION_REQUIRED: Caffeine `install_code` no longer traps; GameKey request/approve/redeem works on a populated canister; repo `.old` md5 matches the newly deployed `.most`; `python3 scripts/check-eop-stables.py` still passes.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze new persistent let/var on main.mo until the 20260901 tail is deployed and .old refreshed  
CATEGORY: data-persistence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Source chain is correct; live previous-version signature is still Aug-31. Discovery / telemetry / admin lifecycle maps would be new stables. Tonight’s flock includes persist, security, admin, and data-evolution agents.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `src/backend/migrations/`; discovery persist; telemetry increment maps; admin lifecycle  
RECOMMENDED_ACTION: No new stables (including `ownedSpellIds`, telemetry maps, admin `lifecycle`) until MTD-2026-09-21-002. Then: new later lex file after `20260901`; never edit a shipped NewActor; bump `check-limit`; populated `check-stable`.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-21-002  
REGRESSION_RISK: HIGH if discovery or telemetry writers add maps this hour.  
VALIDATION_REQUIRED: Next Motoko PR that adds a `let`/`var` also adds a new migration file whose OldActor lacks that field.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Clamp/no-mint is on `main`. `writeLevel` always `character.level`. #322 caps AP/MP. Glob `docs/**/*ADR*` = 0. Finding 3 is still restated as “must not write Doka” by security runs. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Shop 60s auto-complete is gone (GameKey). Security `c97e5c0c` is running this hour.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `docs/ARCHITECTURE.md`  
RECOMMENDED_ACTION: Write the ADR: (a) official-client trust + store-relative clamps (current de-facto, including ignore-client level and AP/MP cap), or (b) canister proofs. Rewrite finding 3. Do not open a fourth clamp PR. Do not revert GameKey.  
AUTONOMY: HUMAN_DECISION + reviewed docs PR  
DEPENDENCIES: MTD-2026-08-31-002 (done); MTD-2026-09-01-005 (done)  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll.  
VALIDATION_REQUIRED: ADR merged; security findings marked decided.  
STATUS: PARTIAL  

---

ACTION_ID: MTD-2026-09-21-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Restack and merge leftover #327 — Striker fails when AoE or bounce lands beyond 2 tiles  
CATEGORY: economy-challenge  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Oldest open PR (`createdAt` 2026-09-02 16:23). Unique: legendary_3 Striker (400 Doka / 800 XP) consulted only the aim tile; Frost Nova / Lifesteal Nova splash and Chain Lightning bounces can land Chebyshev > 2 after an adjacent click; `applyRewards` then persisted the advertised reward. Official-client, repeatable, survives reload. Draft, 18 days stale vs `main` (unioned #315–#326, which have merged). Distinct from Attack Nearest caster-tile (#326, already on `main`).  
SYSTEMS_AFFECTED: `challengeCompletion.ts`; targeting / player-cast; Striker feat  
RECOMMENDED_ACTION: Restack onto current `origin/main` (oldest-first vs #331 if still open). Keep one `export function` per name. Merge after import-gate. Do not retune 400/800. Do not grow WX except the existing helper call.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: None (oldest open PR). Hold tonight’s economy hunter from cloning it.  
REGRESSION_RISK: MEDIUM if restack concatenates duplicate helpers; LOW if unique delta is the victim-tile Chebyshev check.  
VALIDATION_REQUIRED: AoE splash beyond 2 fails; bounce beyond 2 fails; nearby splash+bounce still pays; `pnpm typecheck && pnpm check`; stack-compat `--self`.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-21-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold #331 and further mapGen portal-punch patches; extract a battle-graph punch policy  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused AQA-006, narrowed. `mapGen.ts` 988 → 1,348 → 1,544 → **1,937**. Sequence on `main`: #110 solvability, leftover islands, destack, #321 relocate hostiles onto the player graph then `punchAdjacentFloor`, #329 dump-alcove / wander island. Draft #331 skips a punch whose neighbor is non-portal floor outside the battle component. Nine punches in four weeks. `AGENTS.md` still forbids map-generation edits. Guardian is in tonight’s flock. Local patches are no longer sufficient.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`; battle-start destack; portals  
RECOMMENDED_ACTION: HOLD #331. Guardian = failing seed fixtures + ACTION_IDs only. When a human authorizes: one helper (`shouldPunchPortalNeighbor` / stay-on battle component) + the #321/#329/#331 seeds as tests. Do not rewrite cellular automata. Do not auto-refactor this hour.  
AUTONOMY: HUMAN_CONFIG + IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-006  
REGRESSION_RISK: HIGH if another punch lands without playtest of cramped portal + five far rats.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs. Human playtest of #321/#329 before any punch helper.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible (confirmed this run). WX is 19,213 lines / 227 commits since 2026-08-24 / 29 since `58302bc`.  
SYSTEMS_AFFECTED: `996df6df-9d7a-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches WX or persist; pause the first tick after an 18-day freeze.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: ≤14 hunter runs/week.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep a single critical-bug automation  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `1aa41c6c-a483-11f1-a7d1-d6b4613131ce` (“Find Critical Gameplay Bugs”) remains **enabled** (GetAutomation this run). It is already RUNNING tonight (`bc-73c32896`). Volume problem is the rest of the flock plus this hunter.  
SYSTEMS_AFFECTED: `1aa41c6c`; `996df6df`  
RECOMMENDED_ACTION: MERGE hunters. Keep one at AQA-001 cadence.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the follow-up punches)  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. After #110, later punches including #206/#246/#302/#321/#329. `mapGen.ts` **1,937** lines. Draft #331. Guardian running this hour. See MTD-2026-09-21-004.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only unless a human authorizes a playtested helper. Close or hold any 09-21 mapGen PR.  
AUTONOMY: HUMAN_CONFIG  
REGRESSION_RISK: HIGH if another punch lands without playtest.  
VALIDATION_REQUIRED: Next solvability run opens 0 mapGen PRs.  
STATUS: BROKEN  

---

ACTION_ID: AQA-2026-08-30-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze drive-by WorldExploration edits  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. File is 19,213 lines. **29** commits since `58302bc`; 227 since 2026-08-24. Validation “next week under 20” failed (29 in ~30 hours, then 18 days silent). Tonight’s feel / AI / expansion / invariant / combat agents will add more branches if allowed.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: New behavior in `engine/*` or `utils/*` with tests; WX one-line wiring. Reject PRs whose primary hunk is another WX branch. Exception: restack of #327 if it stays a helper call.  
AUTONOMY: HUMAN_CONFIG + review  
REGRESSION_RISK: MEDIUM — some remaining defects are still WX closures.  
VALIDATION_REQUIRED: Next director-week WX commit count under 10, excluding one-line helper wiring.  
STATUS: BROKEN  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Swap landing skips lava, spikes, ice, and Void Rift walk damage  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `0f5363f`. `swapPositions` (`WorldExploration.tsx` 9389–9401) still copies coordinates and does not call `applyBattleWalkHazards`. Glob `applyHazardLanding` = 0 files. Occupancy helper exists for summons; Swap does not use it.  
SYSTEMS_AFFECTED: Swap; hazards; challenges  
RECOMMENDED_ACTION: Extract `applyHazardLanding` + tests; one WX call site. Do not change damage numbers. Do not grow WX without the helper. After flock halt.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-007; MTD-2026-09-21-001  
REGRESSION_RISK: MEDIUM — must not double-charge a walk that already ran the stepper.  
VALIDATION_REQUIRED: Swap onto lava increments challenge damage; walk path still charges once.  
STATUS: OPEN  

---

ACTION_ID: MIMA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Player-controlled summon walk ignores tile hazards (occupancy landed)  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused; narrowed. Dest occupancy/unseal closed. `isCellFree` (`occupancy.ts` 1–16) still has no hazard axis. No `applyHazardLanding`. MP debit now uses `battleWalkMpCost` (do not re-file 09-01-001 against summons).  
SYSTEMS_AFFECTED: summons; occupancy; hazards  
RECOMMENDED_ACTION: Same `applyHazardLanding` as MIMA-001 after dest is accepted. Do not rewrite occupancy.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MIMA-2026-08-31-001  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Path onto occupied tile is a no-op (already); path onto lava commits store HP.  
STATUS: PARTIAL  

---

ACTION_ID: MIMA-2026-09-01-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Player battle-walk path still steps through living combatants  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: MEDIUM  
EVIDENCE: Reused; narrowed. Barriers **landed**: `findPath` (`WX` 4526–4536) calls `isBattleWalkTileBlocked` with `barrierTilesRef`. Occupants still absent (`walkRejectCopy.ts` 21–34: wall / void / barrier / in-battle portal only). Dest occupancy reject exists; intermediate tiles can clip units.  
SYSTEMS_AFFECTED: occupancy; pathing  
RECOMMENDED_ACTION: Add occupant keys to `isBattleWalkTileBlocked` (or a battle `findPath` wrapper that uses `isCellFree`). Helper then one WX path. Do not change RAF timing. Do not re-file the barrier half.  
AUTONOMY: IMPLEMENT_HELPER_THEN_ONE_WX_PATH  
DEPENDENCIES: AQA-2026-08-30-007  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Dest beyond a one-tile occupied ally uses the around-path; barrier fixture still green.  
STATUS: PARTIAL  

---

ACTION_ID: MIMA-2026-09-02-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: GameKey redeem commits canister Doka without honouring an unpaid death 20/40 cut  
CATEGORY: rewards + death + persistence  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused from MIMA 09-02. Reconfirmed: `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–331) enqueue → `redeemGameKey` → `committedDokaAfterGameKeyRedeem`. No `applyUnpaidDeathPenaltyToWrite`. Tests cover redeem gain/no-op/unseeded keep, not pending death. Absolute spends still honour pending death.  
SYSTEMS_AFFECTED: GameKey shop; death penalty; persist lock; HUD wallet  
RECOMMENDED_ACTION: If `readPendingDeathPenaltyAnywhere` is set, commit `applyUnpaidDeathPenaltyToWrite(pending, xp, credited).doka` (or settle then credit). Do not recut a `cutConfirmed` wallet. Do not change redeem canister math. After flock halt.  
AUTONOMY: IMPLEMENT_HELPER_THEN_SHOP_CREDIT  
DEPENDENCIES: Do not clone EOP. Reuse `applyUnpaidDeathPenaltyToWrite`.  
REGRESSION_RISK: MEDIUM — must not tax a GameKey after the death cut already landed.  
VALIDATION_REQUIRED: Unit test: pending 80 Doka loss + redeem 1000 ⇒ lock Doka honours the cut; `cutConfirmed` redeem does not subtract again.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a number into buildEnemyKit, not the LevelZone object  
CATEGORY: enemy-content  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `0f5363f`. `buildEnemyKit` (`enemyAI.ts` 194–199) takes `levelZone: number` and `Math.floor`s it. Call site `WX` 11920 still passes `currentMap.levelZone` (`levelZone: any` at 592; object with `name`/`minLevel`/`maxLevel` at 4683–4687). `setCurrentZoneTier(playerTier + 1)` already stores the number (`WX` 4678–4680) and is unused at kit assignment. Kits grow at zone ≥1 / ≥2 (`enemyAI.ts` 163–185). `Math.floor(object)` is `NaN` → zone-0 forever. Survived three director cycles.  
SYSTEMS_AFFECTED: enemy kits; overworld spell pools; infinite progression  
RECOMMENDED_ACTION: After flock halt: pass `currentZoneTier` (or `playerTier`) into `buildEnemyKit`. One call site + `enemyAI` test. Do not grow WX. Do not rewrite kits.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-09-21-001; AQA-2026-08-30-007  
REGRESSION_RISK: LOW if only the argument changes; HIGH if bundled with an AI rewrite.  
VALIDATION_REQUIRED: Zone-1 pawn kit includes venom-strike; zone-0 does not.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop treating the live catalog as ownedSpells  
CATEGORY: ownership-persist  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused (also SDA-2026-09-02-003). `shouldIncludeBackendSpellInLibrary` (`adminSafety.ts` 712–718) returns true whenever `usableByPlayer !== false`. `ownedSpells` is still starters ∪ filtered backend (`WX` 2412+). No `ownedSpellIds` / observe path. Blocks enemy-observed discovery and achievement/boss spell unlocks.  
SYSTEMS_AFFECTED: spellbook; admin catalog; future discovery  
RECOMMENDED_ACTION: After ADR + deploy confirmation: new later migration for ownership maps; seed innates only; catalog `getSpellConfigs` does not imply ownership. Never `spell.name`. Do not stuff 20260901.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: MTD-2026-09-21-002; AQA-2026-08-30-008; SDA-2026-08-31-004  
REGRESSION_RISK: HIGH — under-seed drops the bar; over-seed reintroduces catalog-as-ownership.  
VALIDATION_REQUIRED: New character owns only innate ids. Admin adding a catalog spell does not change another account’s book.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Controlled extraction of HP and death authority out of WorldExploration  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Cluster #78–#256 plus Swap/summon/destack landing. Dual authority remains. Do not start this in the 00:00 wave.  
SYSTEMS_AFFECTED: `combatantStore.ts`; `deathPipeline.ts`; `battleSetup.ts`; WX  
RECOMMENDED_ACTION: After Caffeine deploy confirmation and MIMA landing helper. One scoped PR. No RAF / mapGen / damage-formula changes.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-09-21-002; MIMA-2026-08-31-001  
REGRESSION_RISK: HIGH if bundled with targeting or persist.  
VALIDATION_REQUIRED: Engine tests for plague / DoT / lava / reflect / swap-landing / last-hostile.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze content / AI / feel / admin implementation until P0/P1 settle  
CATEGORY: expansion-gating  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Design catalogs from 08-31/09-01/09-02 are on `main` (correct). Gameplay from those catalogs is still blocked: no ownership persist, zone-0 kits, no ADR, Caffeine deploy unconfirmed, flock active. AI / formations / spell mechanics / world content / discovery admin are RUNNING this hour.  
SYSTEMS_AFFECTED: expansion / AI / feel / admin implementers  
RECOMMENDED_ACTION: Docs and ACTION_IDs only until deploy confirmation + ADR + landing helper exist. Exception: PREREQ-A one-liner after halt.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-21-001; MTD-2026-09-21-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No SDA/SDE/EBA/AI gameplay PR from the 09-21 wave.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Outcome telemetry before any dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still no collectors on `0f5363f` (`src/backend` grep `recordTelemetry` = 0). TBC WAITING_FOR_TELEMETRY. Dashboard specialist `4b026695` and architecture `047ac8a1` are in tonight’s wave. `longHorizonSim.telemetry.available === false`. Telemetry increment maps would be new stables — blocked on MTD-2026-09-02-003.  
SYSTEMS_AFFECTED: future counters; Admin telemetry UI  
RECOMMENDED_ACTION: Design + tiny persist-lock-enqueued counters **after** deploy confirmation. No dashboard UI. No balance labels. Fail-open. Never join GameKey email/code.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: MTD-2026-09-02-003  
REGRESSION_RISK: HIGH if a second persist path is invented or stables are stuffed into 20260901.  
VALIDATION_REQUIRED: Zero CLEAR_POSITIVE_SIGNAL claims until rows exist.  
STATUS: OPEN  

---

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep balance analyst gated until telemetry rows exist  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Fresh search this run: 0 `recordTelemetry` hits in `src/backend`. Do not infer balance from source or longHorizonSim. TBC automation `2786666f` is RUNNING tonight — it must stay WAITING_FOR_TELEMETRY.  
SYSTEMS_AFFECTED: Telemetry-Driven Balance automation `2786666f`  
RECOMMENDED_ACTION: STATUS WAITING_FOR_TELEMETRY. No BAL-* implementation. Write TBC ACTION_IDs to `ACTION_IDS_TBC_YYYY-MM-DD.md`, not the director file.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if formulas change without data.  
VALIDATION_REQUIRED: Next TBC report is WAITING_FOR_TELEMETRY with 0 BAL implementation PRs.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Wire saveKillCount or drop it from the leaderboard contract  
CATEGORY: persistence-honesty  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `useSaveKillCount` (`useLeaderboardQueries.ts`) still has no TSX caller. `getLeaderboard` still exposes `killCount`.  
SYSTEMS_AFFECTED: leaderboard; `saveKillCount`  
RECOMMENDED_ACTION: Either call it from the official victory funnel (cap 64 already) or stop showing killCount as live. Do not invent a second counter.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-007  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Leaderboard number matches an official write, or the column is gone.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Admin Draft → Validate → Activate is not a canister workflow  
CATEGORY: admin-lifecycle  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Local React drafts + `usableByPlayer=false` retire remain. Dashboard 8,280 lines. Do not grow chrome first. New `lifecycle` field is a new stable — blocked on MTD-2026-09-02-003.  
SYSTEMS_AFFECTED: AdminDashboard; `admin.mo`; future SpellDefinition  
RECOMMENDED_ACTION: After deploy confirmation, one persist shape (SDA-2026-09-02-001). Do not add a fifth dashboard tab this hour.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: MTD-2026-09-21-002; SDA-2026-09-02-001  
REGRESSION_RISK: HIGH if `usableByPlayer=false` rows are migrated as retired when they were enemy-only.  
VALIDATION_REQUIRED: Inventory existing `usableByPlayer=false` ids before flip.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: computeAITier 30% fully random 1–10 contradicts progressive sophistication  
CATEGORY: enemy-ai  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed `combatMath.ts` 34–50 `AI_TIER_VARIANCE_CHANCE = 0.3`. Design vs ENGINEERING. Do not rewrite `enemyAI.ts` tonight.  
SYSTEMS_AFFECTED: `combatMath.ts`; encounter identity  
RECOMMENDED_ACTION: Report/design decision: keep noise, shrink it, or gate it to ±1 tier. No first-hour AI PR.  
AUTONOMY: HUMAN_DECISION  
DEPENDENCIES: MTD-2026-08-31-004  
REGRESSION_RISK: MEDIUM if the roll is removed without a playtest.  
VALIDATION_REQUIRED: Written decision in DESIGN or an ADR.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-02-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop concatenating specialist catalogs into dated director ACTION_ID files  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `ACTION_IDS_2026-09-01.md` remains concatenated. 09-02 director file stayed clean. This run writes `ACTION_IDS_2026-09-21.md` only.  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: Each producer writes `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`. Director maintains MASTER_ROADMAP + `ACTION_IDS_YYYY-MM-DD.md` (director IDs only). TBC must not write into the director file. Do not append to 08-31, 09-01, or 09-02.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next wave adds 0 lines to ACTION_IDS_2026-08-31.md, ACTION_IDS_2026-09-01.md, and ACTION_IDS_2026-09-02.md.  
STATUS: OPEN  
