# ACTION_IDs — 2026-09-01 Master Technical Director

Durable director ledger. Reuse existing IDs. Do not append specialist catalogs here.

**HEAD:** `dd275aa` (#182)  
**Prior director:** [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) + [`MASTER_ROADMAP.md`](./MASTER_ROADMAP.md)  
**Gameplay / production code:** not modified this run.

Specialist IDs stay in their producer files (`ACTION_IDS_SDE_*`, `ACTION_IDS_MIMA_*`, `ACTION_IDS_ENEMY_BOSS_ADMIN_*`, orchestrator `ACTION_IDS_2026-08-31-0604/1200/1800.md`, etc.).

---

ACTION_ID: MTD-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Halt same-hour P2/P3 implementer flock after a merge burst  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Failed on 2026-08-31 (25+ agents; humans then merged three bursts). Recurred 2026-09-01 00:00–00:02 UTC: **34** automations including map integrity `9dcfd122`, combat parity `f37b7505`, adversarial QA `08e7de28`, security `c97e5c0c`, admin safety `7e907066`, test mill `81c2e934`, orchestrator `68f2958f`, plus expansion/AI/feel/admin/telemetry designers. P0 leftover #183 and ADR AQA-008 are still open.  
SYSTEMS_AFFECTED: all implementer automations; merge queue  
RECOMMENDED_ACTION: First-run and expansion specialists emit ACTION_IDs only. Do not open gameplay PRs this cycle unless unique, display-only, and not already drafted. Stagger crons. Pause map/combat/persist implementers 6 hours after a `main` merge that touches WX, `progressPersist`, `mapGen`, or `main.mo` rewards.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001; AQA-2026-08-30-009  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next director run sees ≤3 new gameplay PRs from this wave, and those PRs do not retouch persist / targeting / mapGen / WX.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-01-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Hold the 2026-09-01 00:00 specialist wave  
CATEGORY: automation-coherence  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: 34 RUNNING agents listed this hour (see MASTER_ROADMAP). Yesterday the same pattern produced overlapping persist/targeting/mapGen PRs that later merged dirty and required #167/#169/#171/#175/#179/#181 cleanup.  
SYSTEMS_AFFECTED: merge queue; `WorldExploration.tsx`; `mapGen.ts`; `main.mo`; AdminDashboard  
RECOMMENDED_ACTION: Default HOLD any PR from this wave. Orchestrator may implement one unique display-only item. Designers update their own dated files; do not rewrite SDA/SDE/EBA schemas.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-08-31-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No mapGen / persist-lock / targeting / enemyAI / AdminDashboard gameplay PR merges from this wave.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Throttle the critical / high-severity bug hunter  
CATEGORY: automation-ops  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `996df6df` still not GetAutomation-visible. WX is 20,063 lines / 149 commits since 2026-08-24.  
SYSTEMS_AFFECTED: `996df6df-9d7a-11f1-a7d1-d6b4613131ce`; `WorldExploration.tsx`  
RECOMMENDED_ACTION: REDUCE_FREQUENCY to at most once per 12–24 hours; pause 6 hours after a `main` merge that touches WX or persist.  
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
EVIDENCE: Reused. `1aa41c6c` remains enabled and correctly opened unique #183 after the 19:07 burst. Volume problem is the rest of the flock, not this hunter’s last PR.  
SYSTEMS_AFFECTED: `1aa41c6c-a483-11f1-a7d1-d6b4613131ce`; `996df6df-9d7a-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: MERGE hunters. Keep one at AQA-001 cadence. Fold #183 into the human merge queue as the surviving critical PR.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Only one critical-bug automation ID fires per day.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-09-01-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Human merge #183 — death replay after portal or Doka-only credit  
CATEGORY: persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `resolvePendingDeathReplay` (`deathPenalty.ts` 426–449) writes only when both axes are still `pre`, or XP is `pre` and Doka already spent. Portal +10 or a Doka-only credit moves one axis above `pre`; reload **clears** the marker and the 20/40 cut never retries. #183 is +24/−0 on `deathPenalty.ts` + tests, clean vs `dd275aa`, unique among open PRs. #175 already on `main` (double-victory / cleanup).  
SYSTEMS_AFFECTED: `src/frontend/src/utils/deathPenalty.ts`  
RECOMMENDED_ACTION: Review/merge #183. Do not open a second death-replay PR. After merge, freeze death-penalty helpers except proven unique holes.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: None  
REGRESSION_RISK: MEDIUM if both axes above `pre` are recut (later earn). #183 keeps that as clear.  
VALIDATION_REQUIRED: Portal +10 then lava-reload still applies 20/40 to the credited snapshot; dual-axis victory credit still clears.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Human merge queue — #114 then #107 clamp-only rebase  
CATEGORY: merge-hygiene  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Both themes are on `main` (#114 09:33; clamps via #107/#144/#171). `applyRewards` rejects `dokaDelta > 100_000` and `xpDelta > 500_000` (`main.mo` 1798–1799). `saveBattleStats` cannot raise Doka/XP (`main.mo` 1767–1768).  
SYSTEMS_AFFECTED: `main.mo`; persist callers  
RECOMMENDED_ACTION: CLOSED. Do not re-implement clamps. Leftover trust work is AQA-008 + MTD-2026-09-01-005.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: AQA-2026-08-30-008  
REGRESSION_RISK: n/a  
VALIDATION_REQUIRED: n/a  
STATUS: IMPLEMENTED  

---

ACTION_ID: AQA-2026-08-30-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Convert the security 9-finding set into an architecture decision  
CATEGORY: security-architecture  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Clamp/no-mint is now on `main`. No written ADR. Finding 3 is still restated as “must not write Doka” by security runs. `writeLevel` still uses client `_level` when ≤ stored (`main.mo` 1769) despite the comment that level is ignored. `calculateAndAwardDoka` unused. `markAchievementUnlocked` still client-asserted. Shop 60s auto-complete still architecture. Security `c97e5c0c` is running this hour.  
SYSTEMS_AFFECTED: `src/backend/main.mo`; `docs/ARCHITECTURE.md`  
RECOMMENDED_ACTION: Write the ADR: (a) official-client trust + store-relative clamps (current de-facto), or (b) canister proofs. Rewrite finding 3. Then land MTD-2026-09-01-005. Do not open a third clamp PR.  
AUTONOMY: HUMAN_DECISION + reviewed docs PR  
DEPENDENCIES: MTD-2026-08-31-002 (done)  
REGRESSION_RISK: HIGH if APIs tighten without a frontend roll.  
VALIDATION_REQUIRED: ADR merged; security findings marked decided; `writeLevel` ignores client.  
STATUS: PARTIAL  

---

ACTION_ID: MTD-2026-09-01-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: saveBattleStats must ignore client level (stored level always wins)  
CATEGORY: persist  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: `main.mo` 1688–1692 says applyRewards is the sole level writer and the client level argument is ignored. Line 1769: `writeLevel = if (_level > character.level) { character.level } else { _level }` — a stale lower client level after an in-flight `applyRewards` can drop the character. RAO-2026-08-31-1800-008 flagged remount leftover of the same class.  
SYSTEMS_AFFECTED: `src/backend/main.mo` `saveBattleStats`  
RECOMMENDED_ACTION: `writeLevel = character.level`. Keep `_level` in the signature for Candid compat. Tests: client level 5 / store 6 stays 6; client 7 / store 6 stays 6. Do not bundle with discovery or admin.  
AUTONOMY: HUMAN_APPROVE — Motoko reward path  
DEPENDENCIES: AQA-2026-08-30-008  
REGRESSION_RISK: LOW if only level is pinned; HIGH if bundled with Doka/XP rules.  
VALIDATION_REQUIRED: `mops check` / `caffeine check`; official heal/death still persist HP/Doka/XP cuts.  
STATUS: NEW  

---

ACTION_ID: MTD-2026-09-01-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop appending specialist catalogs to ACTION_IDS_2026-08-31.md  
CATEGORY: process  
PRIORITY: P0  
CONFIDENCE: HIGH  
EVIDENCE: File is ~4,200 lines. Header is SDA designer. Contains SDA, MTD, AQA, TADD, VAL, TBC, WDEAD, EED, PXA, GTAD, UX-*, AEE, AFDA, SDEG, RAO, AUX, WDD, LHIPS, MAA, GFCF. AQA-003 asked for one ledger; the result is unreadable. Producers already have dated files (SDE, MIMA, EBA, PERF, 0604/1200/1800).  
SYSTEMS_AFFECTED: `docs/automation/ACTION_IDS_*.md`  
RECOMMENDED_ACTION: UPDATE_PROMPT: each producer writes `ACTION_IDS_<PREFIX>_YYYY-MM-DD.md`. Director maintains this index + MASTER_ROADMAP. Do not append to the 08-31 dump.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-003  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Next wave adds 0 lines to ACTION_IDS_2026-08-31.md.  
STATUS: NEW  

---

ACTION_ID: AQA-2026-08-30-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Adopt an in-repo ACTION_ID ledger all producers write to  
CATEGORY: process  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Ledger exists and is now a dump yard (see MTD-2026-09-01-004). Dedup still fails (portal XP / targeting / persist twins).  
SYSTEMS_AFFECTED: all producer prompts  
RECOMMENDED_ACTION: Index + per-producer files. Refuse a second PR for an ID that is OPEN or matches an open PR theme.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-004  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: Director can list OPEN P0/P1 without grepping 4k lines.  
STATUS: PARTIAL  

---

ACTION_ID: AQA-2026-08-30-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Freeze mapGen after #110 (and the 08-31 follow-up punches)  
CATEGORY: sensitive-code  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. After #110, #155 #158 #164 #179 still edited `mapGen.ts` (988 → 1,348 lines). Guardian `9dcfd122` is RUNNING this hour. `AGENTS.md` still forbids map-generation edits.  
SYSTEMS_AFFECTED: `src/frontend/src/engine/mapGen.ts`  
RECOMMENDED_ACTION: Report-only (ACTION_IDs + failing seed fixtures) unless a human authorizes a playtested change. Close any 09-01 mapGen PR.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: None  
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
EVIDENCE: Reused. File is 20,063 lines; 149 commits since 2026-08-24. #180 wants another WX persist restack. Tonight’s feel / AI / expansion / invariant / combat agents will add more branches if allowed.  
SYSTEMS_AFFECTED: `WorldExploration.tsx`  
RECOMMENDED_ACTION: New behavior in `engine/*` or `utils/*` with tests; WX one-line wiring. Reject PRs whose primary hunk is another WX branch. Exception: #183 does not touch WX.  
AUTONOMY: HUMAN_CONFIG + review  
DEPENDENCIES: MTD-2026-09-01-002  
REGRESSION_RISK: MEDIUM — some remaining defects are still WX closures.  
VALIDATION_REQUIRED: Next week WX commit count under 20.  
STATUS: BROKEN  

---

ACTION_ID: MTD-2026-09-01-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Rebase #180 live-Doka helpers; do not merge dirty  
CATEGORY: persist  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: `writeLiveDoka` / `creditLiveDoka` / `beginRename` / `shouldRollbackFailedShopSpend` are not on `main`. #180 implements them but is dirty vs `dd275aa`, based on `036600f`, and restacks WX credit/death/heal paths already patched by #167/#169/#175.  
SYSTEMS_AFFECTED: `itemShop.ts`; `renameCharacter.ts`; `WorldExploration.tsx`; `BuffShop.tsx`  
RECOMMENDED_ACTION: Hold. Rebase on post-#183 `main`. Keep helpers + tests; drop WX hunks already landed. Do not open a third persist PR.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: MTD-2026-09-01-002  
REGRESSION_RISK: HIGH if merged dirty.  
VALIDATION_REQUIRED: Victory-then-heal cannot ghost Doka; rename double-click debits once; failed shop persist does not refund a later buy.  
STATUS: NEW  

---

ACTION_ID: MIMA-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Swap landing skips lava, spikes, ice, and Void Rift walk damage  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `dd275aa`. `swapPositions` (`WorldExploration.tsx` 10009–10021) still copies coordinates and does not call `applyBattleWalkHazards`. RAO-1800-002 still NEEDS_HUMAN_DECISION. Not drafted as a unique PR.  
SYSTEMS_AFFECTED: Swap; hazards; challenges  
RECOMMENDED_ACTION: Extract `applyHazardLanding` + tests; one WX call site. Do not change damage numbers. Do not grow WX without the helper.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: AQA-2026-08-30-007  
REGRESSION_RISK: MEDIUM — must not double-charge a walk that already ran the stepper.  
VALIDATION_REQUIRED: Swap onto lava increments challenge damage; walk path still charges once.  
STATUS: OPEN  

---

ACTION_ID: MIMA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Player-controlled summon walk ignores occupancy and tile hazards  
CATEGORY: combat-correctness  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Reconfirmed on `dd275aa`. Controlled summon walk (`WorldExploration.tsx` 10583–10594) is `findPath` + `updateCombatant` with no `isCellFree` and no hazard landing.  
SYSTEMS_AFFECTED: summons; occupancy; hazards  
RECOMMENDED_ACTION: Same helper as MIMA-001. Reject occupied destinations; then land hazards.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MIMA-2026-08-31-001  
REGRESSION_RISK: MEDIUM  
VALIDATION_REQUIRED: Path onto occupied tile is a no-op; path onto lava commits store HP.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Controlled extraction of HP and death authority out of WorldExploration  
CATEGORY: architecture  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Cluster #78–#114 plus Swap/summon landing (MIMA-001/002). Dual authority remains. Do not start this in the 00:00 wave.  
SYSTEMS_AFFECTED: `combatantStore.ts`; `deathPipeline.ts`; `battleSetup.ts`; WX  
RECOMMENDED_ACTION: After #183 and MIMA landing helper. One scoped PR. No RAF / mapGen / damage-formula changes.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-09-01-002; MIMA-2026-08-31-001  
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
EVIDENCE: Reused. Design catalogs from 08-31 are on `main` (correct). Gameplay from those catalogs is still blocked: no ownership persist, zone-0 kits, no ADR, flock active.  
SYSTEMS_AFFECTED: expansion / AI / feel / admin implementers  
RECOMMENDED_ACTION: Docs and ACTION_IDs only until #183 + ADR + landing helper exist.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-001  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No SDA/SDE/EBA/AI gameplay PR from the 09-01 wave.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Stop the test-clone mill  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. #100/#101/#106 merged or closed in the 10:14 burst. #173 is a stale restack on `bcb0721`. Test builder `81c2e934` is RUNNING this hour.  
SYSTEMS_AFFECTED: `src/frontend/src/**/*.test.ts`  
RECOMMENDED_ACTION: Close or hold #173. New tests only lock a unique merged contract.  
AUTONOMY: HUMAN_REVIEW  
DEPENDENCIES: None  
REGRESSION_RISK: LOW if closed; MEDIUM if merged dirty.  
VALIDATION_REQUIRED: 0 clone suites referencing removed exports.  
STATUS: OPEN  

---

ACTION_ID: AQA-2026-08-30-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Orchestrator must not implement gameplay  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. 06:04/12:00/18:00 implemented unique display (feat recap, recap click-through, vitals jewels) — acceptable. Orchestrator `68f2958f` is RUNNING this hour and must not restack persist/combat.  
SYSTEMS_AFFECTED: `68f2958f-a489-11f1-a7d1-d6b4613131ce`  
RECOMMENDED_ACTION: ACTION_IDs + at most one unique display-only item.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-001  
REGRESSION_RISK: MEDIUM if it implements persist.  
VALIDATION_REQUIRED: Orchestrator PR (if any) is display-only and unique.  
STATUS: PARTIAL  

---

ACTION_ID: AQA-2026-08-30-010  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Dedup persist / economy implementers  
CATEGORY: automation-ops  
PRIORITY: P1  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Official-client races largely on `main`. Leftovers are #183 (unique) and #180 (dirty). Economy hunter `1e548d83` produced #175 (merged).  
SYSTEMS_AFFECTED: persist / economy automations  
RECOMMENDED_ACTION: ACTION_IDs only if a race is already drafted. Do not open a third clamp.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: MTD-2026-09-01-002; MTD-2026-09-01-003  
REGRESSION_RISK: HIGH if another persist rewrite lands.  
VALIDATION_REQUIRED: At most one open persist PR.  
STATUS: PARTIAL  

---

ACTION_ID: AQA-2026-08-30-012  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Outcome telemetry before any dashboard  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still no collectors. TBC-2026-08-31-001 WAITING_FOR_TELEMETRY. Dashboard specialist `4b026695` and architecture `047ac8a1` are RUNNING this hour. `longHorizonSim.telemetry.available === false`.  
SYSTEMS_AFFECTED: future counters; Admin telemetry UI  
RECOMMENDED_ACTION: Design + tiny persist-lock-enqueued counters first. No dashboard UI. No balance labels.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: None for design; persist freeze for any writer  
REGRESSION_RISK: HIGH if a second persist path is invented.  
VALIDATION_REQUIRED: Zero CLEAR_POSITIVE_SIGNAL claims until rows exist.  
STATUS: OPEN  

---

ACTION_ID: TBC-2026-08-31-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Keep balance analyst gated until telemetry rows exist  
CATEGORY: telemetry  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. No collectors on `dd275aa`. Do not infer balance from source.  
SYSTEMS_AFFECTED: Telemetry-Driven Balance automation `2786666f`  
RECOMMENDED_ACTION: STATUS WAITING_FOR_TELEMETRY. No BAL-* implementation.  
AUTONOMY: HUMAN_CONFIG  
DEPENDENCIES: AQA-2026-08-30-012  
REGRESSION_RISK: HIGH if formulas change without data.  
VALIDATION_REQUIRED: No OVERPERFORMING labels.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-002  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Split catalog from ownership; persist owned and observed spell ids  
CATEGORY: ownership-persist  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `ownedSpells` is still starters ∪ filtered backend (`WX` ~2410). Admin add still grants everyone. Blocks meaningful telemetry-by-acquisition-path.  
SYSTEMS_AFFECTED: `main.mo`; spellbook; WX ownedSpells  
RECOMMENDED_ACTION: After P0/P1 persist freeze. Do not implement from the 09-01 wave. Canonical persist shape; SDE/EBA/SPELL_DISCOVERY cards attach later.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001; MTD-2026-08-31-004  
REGRESSION_RISK: HIGH  
VALIDATION_REQUIRED: New character owns only base ids; admin catalog add does not hydrate into others’ books.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-004  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Implement enemy-discovery default (cast → observe → win → unlock)  
CATEGORY: discovery-pipeline  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Still no `recordSpellObservation`. Core Stralt rule. Must enqueue on persist lock; must not use `spell.name`.  
SYSTEMS_AFFECTED: enemy cast hook; persist lock; recap  
RECOMMENDED_ACTION: Blocked on SDA-002/003 and persist quiet.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-002; SDA-2026-08-31-003  
REGRESSION_RISK: HIGH if granted off the lock.  
VALIDATION_REQUIRED: Cast-then-flee observes without unlock; cast-then-win unlocks once.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-006  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Admin Draft → Validate → Activate on the canister  
CATEGORY: admin-pipeline  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Dashboard 7,737 lines. Hard delete still exists historically; #165 hardened some retirement. Not a canister publish workflow. EBA/SDA/WORLD_ENCOUNTER designs overlap — pick SDA-005 lifecycle, do not grow chrome first.  
SYSTEMS_AFFECTED: `main.mo` admin; AdminDashboard  
RECOMMENDED_ACTION: Canister states first; UI second. Hold 09-01 admin implementers.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-005; AQA-008  
REGRESSION_RISK: HIGH if hard-delete remains.  
VALIDATION_REQUIRED: Retire does not strip owned levels.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-005  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Wire saveKillCount or drop it from the leaderboard  
CATEGORY: persistence  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Hook in `useLeaderboardQueries.ts`; no UI caller. Canister rejects `kills > 64`.  
SYSTEMS_AFFECTED: leaderboard; `saveKillCount`  
RECOMMENDED_ACTION: One caller on attributed player-side kills **or** remove from HUD. Not tonight.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: persist freeze  
REGRESSION_RISK: MEDIUM if it races `applyRewards`.  
VALIDATION_REQUIRED: Allied summons never increment.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-008  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Revisit computeAITier 30% full-random roll  
CATEGORY: design  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. `combatMath.ts` 48–50 unchanged. Contradicts progressively sophisticated enemies. Do not rewrite `enemyAI.ts`.  
SYSTEMS_AFFECTED: `computeAITier`  
RECOMMENDED_ACTION: Design decision: variance within adjacent tiers, not uniform 1–10.  
AUTONOMY: HUMAN_DECISION  
DEPENDENCIES: MTD-2026-08-31-004  
REGRESSION_RISK: HIGH if bundled with an AI rewrite.  
VALIDATION_REQUIRED: Report only until human picks.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Enemy-observed spell discovery design (canonical persist shape)  
CATEGORY: design  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. SDA-002/004 is the persist shape. Do not author a fifth schema this hour (SDE / SPELL_DISCOVERY / EBA already exist).  
SYSTEMS_AFFECTED: design docs only  
RECOMMENDED_ACTION: Point implementers at SDA-002/004. Mark overlapping docs as content cards.  
AUTONOMY: DOCS_ONLY  
DEPENDENCIES: SDA-2026-08-31-002  
REGRESSION_RISK: LOW  
VALIDATION_REQUIRED: No new discovery schema file from the 09-01 wave.  
STATUS: OPEN  

---

ACTION_ID: EXPANSION-PREREQ-A  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Pass a numeric zone into buildEnemyKit  
CATEGORY: content-infrastructure  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused from `EXPANSION_PROPOSALS_2026-08-31.md` PREREQ-A. `buildEnemyKit` does `Math.floor(levelZone)` on an object → `NaN` → zone-0 kits forever. Unblocks dynamic pools without an AI rewrite.  
SYSTEMS_AFFECTED: battle-start kit assign; `enemyAI.ts`  
RECOMMENDED_ACTION: After flock hold. One call site + unit test. WX one-line. Do not invent new kits in the same PR.  
AUTONOMY: IMPLEMENT_AFTER_HUMAN  
DEPENDENCIES: MTD-2026-08-31-004; AQA-2026-08-30-007  
REGRESSION_RISK: MEDIUM — zone-1 kits suddenly appear.  
VALIDATION_REQUIRED: Zone 0 pawn kit unchanged; zone ≥1 adds the advanced id.  
STATUS: OPEN  

---

ACTION_ID: SDA-2026-08-31-007  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Seed frontend starter ids into the canister catalog  
CATEGORY: catalog-sync  
PRIORITY: P2  
CONFIDENCE: HIGH  
EVIDENCE: Reused. Dual catalogs remain. `upgradeSpell("physical_attack")` still fails if purged. Blocked on SDA-001 type alignment and a canister upgrade.  
SYSTEMS_AFFECTED: `AdminLib.defaultSpells`; purge list; `upgradeSpell`  
RECOMMENDED_ACTION: After ADR/type work. Not the 09-01 wave.  
AUTONOMY: HUMAN_APPROVE  
DEPENDENCIES: SDA-2026-08-31-001  
REGRESSION_RISK: HIGH if purge still drops `physical_attack`.  
VALIDATION_REQUIRED: `upgradeSpell` on Strike and a summon returns `#ok`.  
STATUS: OPEN  

---

ACTION_ID: MTD-2026-08-31-009  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Leftover XP HUD on selection / top bar / recap  
CATEGORY: display  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: #108 / #138 / #178-class HUD work is on `main`. Recap uses `xpForNextLevel`.  
SYSTEMS_AFFECTED: HUD / recap  
RECOMMENDED_ACTION: CLOSED. Do not re-implement.  
AUTONOMY: n/a  
DEPENDENCIES: none  
REGRESSION_RISK: n/a  
VALIDATION_REQUIRED: n/a  
STATUS: IMPLEMENTED  

---

ACTION_ID: RAO-2026-08-31-1800-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Side-panel vitals jewels use live HP/AP/MP caps  
CATEGORY: display  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: #178 merged 19:08 UTC.  
RECOMMENDED_ACTION: CLOSED.  
STATUS: IMPLEMENTED  

---

ACTION_ID: MIMA-2026-08-31-003  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Ignore canvas walk / hazard clicks while the app-root recap is open  
CATEGORY: display / input  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: #166 merged (`shouldIgnoreWorldInputDuringRecap`).  
RECOMMENDED_ACTION: CLOSED. Measure later via AQA-012; do not re-patch.  
STATUS: IMPLEMENTED  

---

ACTION_ID: RAO-2026-08-31-1200-001  
SOURCE_AUTOMATION: Stralt Master Technical Director  
TITLE: Recap click-through gate  
CATEGORY: display / input  
PRIORITY: P3  
CONFIDENCE: HIGH  
EVIDENCE: Same as MIMA-003 / #166.  
STATUS: IMPLEMENTED  
