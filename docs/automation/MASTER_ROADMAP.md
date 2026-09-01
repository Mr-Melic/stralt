# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-09-01 00:02 UTC (daily cron)  
**This agent:** `bc-f016489b-053d-4218-a39b-912580b84af4`  
**HEAD inspected:** `dd275aa` — `Merge pull request #182` (Caffeine import gates)  
**Prior director HEAD:** `22503b5` (#110) at 2026-08-31 00:01 UTC  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-09-01.md`](./ACTION_IDS_2026-09-01.md). Prior director ledger: [`ACTION_IDS_2026-08-31.md`](./ACTION_IDS_2026-08-31.md) (now a specialist dump yard — do not append more producer catalogs there). Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director roadmap (2026-08-31 00:01) | Read; most P0 merge-queue items landed; flock-halt did not |
| Orchestrators 06:04 / 12:00 / 18:00 | Read. Display leftovers they implemented are on `main`. Persist/combat leftovers they held were later merged anyway. |
| Specialist reports (31 Aug) | Expansion, PX, long-horizon, telemetry balance/architecture/dashboard, spell admin, spell discovery, enemy/boss admin, world-encounter admin, visual assets, mechanic matrix, game feel, UX, admin UX/drift, dead-code, data-evolution, performance, enemy AI/elites/formations, world dynamics |
| Open ACTION_IDs | Hundreds across 10+ ledgers. Almost all still `NEW`. Reuse; do not mint twins. |
| Recent commits | `git log` `22503b5` → `dd275aa` plus GitHub closed/open PRs |
| Open drafts | **#183** (clean, unique death replay), **#180** (dirty persist/WX), **#174** (stale bindgen), **#173** (stale tests) |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. Balance analyst remains `WAITING_FOR_TELEMETRY`. |
| Same-hour flock (this minute) | **34** automations launched 00:00–00:02 UTC 2026-09-01, including implementers (map integrity, combat parity, adversarial QA, security, admin safety, test mill, orchestrator, Approved Game Design Implementer-adjacent designers). |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `dd275aa`, tests, PR history, automation volume |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 08-31 director run (do not rediscover)

The 08-31 run asked: halt the flock; merge #114 then #107 clamp; write the reward-trust ADR; freeze WX / mapGen / targeting.

**Integrity that landed (accept `main`; do not re-open):**

| Theme | Landed as |
| :--- | :--- |
| Plague-death vs victory + barrier LoS | #114, then restacked as #105/#151/#157/#161/#172 |
| Leftover XP HUD + recap curve | #108 / #138; `xpHudProgress` / `xpForNextLevel` |
| `applyRewards` per-call ceilings | #171 — `dokaDelta > 100_000`, `xpDelta > 500_000` (`main.mo` 1798–1799) plus client `clampApplyRewardsDeltas` |
| `saveBattleStats` no-mint | Store-relative: Doka/XP cannot rise; HP/AP/MP capped; atk/res/init cannot inflate (`main.mo` 1690–1788) |
| Official persist races (shop / portal XP / jackpot / feat / heal / Boss Rush) | #107 #111 #142 #144 #154 #160 #162 #167 #169 #170 #175 |
| Recap click-through / feat recap / vitals jewels | #166 #159 #178 |
| Admin auth / retirement / Caffeine Motoko + lint gates | #152 #165 #176 #177 #181 #182 |
| Map destack / dual-path / white portal | #110 then **#155 #158 #164 #168 #179** (freeze broken) |

**08-31 leftovers that are DONE:** MTD-2026-08-31-002 (#114/#107 queue), MTD-2026-08-31-009 (#108).

**08-31 leftovers that are NOT done:**

| ID | Why still open |
| :--- | :--- |
| MTD-2026-08-31-001 / AQA-001 / AQA-002 | Flock repeated. `1aa41c6c` still enabled. `996df6df` still not visible. 34 agents this hour. |
| AQA-008 | Clamps exist. **No written ADR.** Security is running again tonight. |
| AQA-006 / AQA-007 | mapGen 988 → **1348** lines; WX 19,619 → **20,063**; 149 WX commits since 08-24. |
| MTD-2026-08-31-003 | HP/death still dual-written. Swap and controlled-summon walk still skip landing (`MIMA-001/002`). |
| MTD-2026-08-31-004 | Design catalogs shipped (correct). Gameplay from those catalogs must stay frozen. |
| AQA-012 / TBC-* | Still no counters. Telemetry *dashboard* is running again tonight. |
| MTD-2026-08-31-005…008 | `saveKillCount` unused; admin DVA not a canister workflow; discovery not persisted; 30% random AI tier unchanged. |

---

## Seven-dimension evaluation

### 1. Correctness — improved, still leaky

ENGINEERING: Official-client wallet/XP/death is much harder to mint than 72 hours ago. The persist *helper* is still the right funnel. The *caller* is not: `WorldExploration.tsx` is **20,063** lines and absorbed another day of hunter branches.

Recurring defect class: **death persist vs in-flight credit.** #175 closed double-victory / cleanup reset. #183 (clean, +24/−0, 2 files, based on current `dd275aa`) is the unique leftover: `resolvePendingDeathReplay` (`deathPenalty.ts` 426–449) still **clears** when exactly one axis rose (portal +10 or Doka-only loot/feat) and the other is still `pre`. Reload then never retries the 20/40 cut. This is P0.

Recurring defect class: **live Doka ref vs React setState.** #167/#169 patched several paths. `writeLiveDoka` / `creditLiveDoka` / `beginRename` are **not on `main`**. Draft #180 implements them but is **dirty**, based on `036600f`, and restacks WX. Treat as P1 rebase-or-close, not a second persist rewrite.

Recurring defect class: **preview vs live vs landing.** Targeting was patched #95 #102 #104 #105 #113 #114 #151 #157 #161 #172. Swap (`WX` 10009–10021) and controlled-summon walk (`WX` 10583–10594) still teleport without `isCellFree` or `applyBattleWalkHazards` (MIMA-001/002; reconfirmed 18:00 and this run). Local targeting patches are no longer the bottleneck — **landing authority** is.

Recurring defect class: **mapGen punch after punch.** AQA-006 said freeze after #110. Then #155 #158 #164 #179. Solvability Guardian (`9dcfd122`) is running **again this hour**. Further punches fight dungeon-chain portals and CA.

`saveBattleStats` comment says the client level argument is ignored (`main.mo` 1688–1692) but `writeLevel` still assigns `_level` when it is **≤** stored level (1769). A stale post-`applyRewards` snapshot can drop level. That is the unfinished half of AQA-008, not a new mint API.

### 2. Player experience — honesty up, identity still incomplete

ENGINEERING: HUD leftover XP, vitals jewel caps, recap feats, and recap-under-lava input gate landed. Those were unique display/input bugs; do not re-implement.

DESIGN (PXA + Expansion + Spell Admin, no player data): the player is still handed the live catalog on minute one (`ownedSpells` = starters ∪ filtered backend configs, `WX` 2354–2410). Enemy-observed discovery is **not implemented**. Achievement/challenge/boss rewards remain Doka/XP, not spells. Boss Rush rooms advertise pair kits that the engine does not always force. Four map modifiers are announce-only stubs.

MEASURED: none. Do not claim spells are over/underused.

### 3. Technical health — hotspot + ledger collapse

| Surface | Lines now | 08-31 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 20,063 | 19,619 | Still the over-patched orchestrator |
| `AdminDashboard.tsx` | 7,737 | 7,322 | Grew without a publish pipeline |
| `enemyAI.ts` | 2,582 | 2,582 | Frozen size; do not grow tonight |
| `main.mo` | 3,501 | 3,013 | Clamps + admin safety landed; no ADR |
| `mapGen.ts` | 1,348 | 988 | Freeze broken; freeze again |
| `progressPersist.ts` | 323 | 252 | Leave it |
| `targeting.ts` | 1,120 | — | Leave it after #172 |

`docs/automation/ACTION_IDS_2026-08-31.md` is **~4,200 lines** of SDA + VAL + UX + AUX + LHIPS + MAA + GFCF + … The header still says “Spell, Discovery & Achievement Admin Designer.” AQA-003 (one ledger producers write) is **PARTIAL and now harmful**: everyone appends; nobody reconciles.

Caffeine import gates (#182) are the one process win that should stay: unused-vars and hook-deps are errors; empty-canister M0263 is not skippable.

Stale paths remain documented, not live bugs: `dfx.json` → missing `backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush (10 rooms), 9 challenges, feats, 31-id frontend catalog.

Dead or contradictory vs core rules (DESIGN + ENGINEERING, Expansion PREREQ-A/B/C):

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object**; `Math.floor(levelZone)` is `NaN`; overworld kits stay zone-0.
- Summoner chance `0.12 + playerLevel * 0.02` saturates by the mid-40s.
- `pickEnemyLevelFromTiers` `maxTier = floor(999 / tierSize)` stops climbing.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 48–50).
- Dual spell catalogs (frontend starters vs canister `shadow_strike`…`void_collapse`). `physical_attack` remains on the purge list (SDA-007).
- Admin adding a catalog spell still grants it to every player on hydrate (SDA-002).

Design specialists produced overlapping catalogs on the same day: SDA, SDE, SPELL_DISCOVERY_ECOSYSTEM, BOSS_AND_SPELL_DISCOVERY, EBA (24 IDs), ENEMY_AI_EVOLUTION, ENEMY_FORMATIONS, ENEMY_ELITE, WORLD_DYNAMICS, ENCOUNTER_EVOLUTION, WORLD_ENCOUNTER_ADMIN, VISUAL_ASSET_LIBRARY, SPELL_PROPOSALS (16 cards). That is **expansion overlap**, not a license to implement.

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `dd275aa` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). Frontend `Number` dies at 1019 (`LHIPS-001`). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 25 on kill XP (DESIGN, not a bug to “fix” tonight). |
| Player-relative enemies | Yes until the 999-tier ceiling (PREREQ-B). |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits (and those kits never leave zone 0). |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. |
| Optional owner-uploaded visuals + pixel fallback | Still true; do not make URLs required (SDEG visual pass). |
| Admin Draft → Validate → Activate | **Not a canister workflow.** Local React drafts + hard delete remain. |

Expansion that adds spells, AI behaviors, or admin chrome **before** landing-authority extraction, #183, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client much safer, ADR still missing

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them — that write is on `main`. Finding 3 is still stale if phrased as “must not write Doka.”

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. Shop 60s auto-complete is still architecture. `markAchievementUnlocked` is still unproven.

#183 is the official-client death-penalty hole that survived the 19:07 burst. #180 is the official-client live-ref hole; do not merge it dirty.

Wallet seeding / idle-hydrate rules remain load-bearing. Do not invent a second persist path for telemetry or discovery grants.

### 7. Automation coherence — P0, same failure as yesterday, larger blast radius

AQA-001…012 were written 08-30 19:00. The 08-31 00:00 wave ignored them. Humans then merged almost every draft in three bursts (09:33, 14:44, 19:07). Orchestrators correctly said “hold dirty persist/targeting/mapGen” and were overridden.

This 00:00 UTC window launched **34 automations in ~2 minutes** again — including Dungeon Solvability Guardian, Combat Rules Consistency, Adversarial QA, Security & Abuse, Admin Safety, Regression Test Builder, Report Action Orchestrator, plus the full expansion/AI/feel/admin/telemetry suite.

That is exactly “P2/P3 expansion displacing unresolved P0/P1.” #183 is the P0 that should merge; everything else from this hour should be ACTION_IDs or hold.

| AQA / MTD ID | Director status 2026-09-01 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` enabled; produced unique #183 (correct). Volume problem remains the rest of the flock. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL / HARMFUL** — dump-yard file; split producer ledgers. Need one **index**, not one append-only blob. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **OPEN** — #173 stale; test builder running again tonight. |
| AQA-006 no mapGen implementation | **BROKEN** — four more mapGen merges. Guardian running now. |
| AQA-007 freeze drive-by WX | **BROKEN** — file grew; #180 wants another WX persist restack. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR; `writeLevel` still client-down. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — 06:04/12:00/18:00 implemented unique display only (acceptable). Orchestrator is running again this hour. |
| AQA-010 persist/economy dedup | **PARTIAL** — theme landed; #180/#183 are leftovers, not a third clamp. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — dashboard specialist running with nothing to display. |
| MTD-001 flock halt | **OPEN** — failed 08-31; failing again 09-01. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **Death persist vs credit race** — #183 is the last allowed death-replay patch in this cluster. After it, death/credit belongs in `deathPenalty.ts` + persist helpers only.
2. **Landing / occupancy authority** — Swap + controlled-summon walk need one `applyHazardLanding` helper (MIMA-001/002). Stop adding Attack Nearest / LoS twins.
3. **HP / death authority** (MTD-2026-08-31-003) — still valid; do not start it in the same hour as #183 or #180.
4. **Canister trust** — write the ADR (AQA-008). Then ignore-client-level (`writeLevel = character.level`). Until then, no new credit APIs and no discovery grant writer.
5. **Automation flock** — one critical hunter, report-only specialists on cron restart, no same-hour implementer pile-on after a merge burst. **This is the binding constraint.**

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **#183** | Review/merge. Unique P0 death-replay after portal/Doka-only credit. Clean vs `dd275aa`. 2 files. |
| 2 | **#180** | **Hold.** Rebase on post-#183 `main`. Keep `writeLiveDoka` / `creditLiveDoka` / `beginRename` / shop-rollback helpers + tests. Drop any WX hunk already on `main`. Do not merge dirty. |
| 3 | **#174** | Rebase bindgen only after Motoko on `main` is quiet. `adminRollback*` / `getAdminAuditLog` are still missing from `src/frontend/src/backend.ts`. Stale base `bcb0721`. |
| — | #173 | **Close or hold.** Test mill on stale `bcb0721`. AQA-005. |
| — | Any PR from the 09-01 00:00 wave | Default **hold**. Report ACTION_IDs only unless unique, display-only, and not already drafted. Especially hold mapGen, targeting, persist, `enemyAI`, AdminDashboard, and telemetry UI. |

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 09-01 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-09-01-001).
2. Merge #183 (MTD-2026-09-01-002).
3. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.” Then ignore client level in `saveBattleStats` (MTD-2026-09-01-005).
4. Stop appending catalogs to `ACTION_IDS_2026-08-31.md` (MTD-2026-09-01-004 / AQA-003).

**P1 — infrastructure / gameplay integrity**

5. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Solvability Guardian = fixtures + ACTION_IDs only.
6. Rebase #180 helpers only (MTD-2026-09-01-003). No third persist lock.
7. Extract `applyHazardLanding` for Swap + controlled-summon walk (MIMA-001/002). One helper PR; one-line WX wiring.
8. Controlled HP/death extraction (MTD-2026-08-31-003) **after** #183 and MIMA landing — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

9. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
10. Fix kit-zone call site (Expansion PREREQ-A) — pass a **number**, not `levelZone` object. This unblocks dynamic pools without a new AI rewrite.
11. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). Requires persist lock + metadata; never `spell.name`.
12. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 7.7k dashboard first.
13. Seed frontend starter ids; stop purging `physical_attack` (SDA-007).
14. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
15. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).
16. Rebase #174 bindgen.

**P3 — polish**

17. Recap / HUD leftovers already shipped — do not restack.
18. Visual / game-feel / mobile — DESIGN.md already specifies the look; do not edit combat math or WX.
19. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus four follow-ups already merged; **freeze**. |
| AQA-004 vs human merge of the 08-30/08-31 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| #180 vs #167/#169/#175 | Those won official-client races; #180 keeps live-ref helpers only after rebase. |
| #183 vs #175 death replay | #175 is on `main`; #183 is the single-axis leftover. Merge #183. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards, not parallel schemas. |
| Expansion specialists vs “P0/P1 first” | Tonight’s wave is the violation. Hold their PRs. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| `writeLevel` comment vs code | Ignore client level (stored wins). |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 09-01 00:00 implementer flock** (34 automations). First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, telemetry UI.
2. **#183 death-replay after portal / Doka-only credit** — unique official-client P0 on current `main`.
3. **Reward-trust ADR (AQA-008) + ignore-client `writeLevel`** — clamps landed; the decision and the level-drop hole did not.
4. **Re-freeze WX / mapGen / targeting / enemyAI** so #180 can be a helper rebase and MIMA landing can be one extraction, not another burst.
5. **Ledger hygiene (AQA-003)** — stop treating `ACTION_IDS_2026-08-31.md` as a shared append log.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten.
- Enemy AI capability expansion — `enemyAI.ts` already 2,582 lines; kits never leave zone 0; HP/death still dual-written.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly idle.
- Merging #180, #174, or #173 as currently based.
- Further `mapGen.ts` punches without an explicit human playtest of #110+#179.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` retunes (no telemetry; orchestrators already NEEDS_HUMAN_DECISION).

## SAFE EXPANSION WORK

- Merge #183 (scoped helper + tests).
- Close or hold #173; rebase #174 only when Motoko is quiet.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts`
- RAF loop, turn-order math, damage formulas (`AGENTS.md`)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` reward methods except a reviewed `writeLevel = character.level` after the ADR
- `docs/automation/ACTION_IDS_2026-08-31.md` (do not append)

## ARCHITECTURAL HOTSPOTS

1. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon teleport)
2. Death persist vs single-axis credit (#183) and live Doka ref (#180)
3. Client-trusted `applyRewards` / `saveBattleStats` without a written ADR (`writeLevel` still client-down)
4. 20k-line world orchestrator absorbing every hunter
5. Automation pile-on (34 same-hour agents + map/combat/security implementers)
6. ACTION_ID dump-yard replacing a usable index
7. Dual spell catalogs + implicit ownership (blocks discovery)

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.**

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183 class)
2. recap opened vs dismissed vs lava-death-during-recap (PX; #166 may have closed the input hole — measure, do not assume)
3. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be meaningless until SDA-002.
4. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
5. challenge accept vs complete vs advertised-reward-missing
6. Swap / summon-walk onto hazards vs walk onto the same tile (MIMA-001/002 — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.”
