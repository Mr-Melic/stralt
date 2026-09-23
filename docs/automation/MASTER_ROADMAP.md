# Stralt Master Roadmap

**Director:** Stralt Master Technical Director (`0b92479e-a49e-11f1-a7d1-d6b4613131ce`)  
**Run:** 2026-09-23 00:01 UTC (daily cron)  
**This agent:** `bc-03381915-c2b7-4ca7-88d6-0e7b125cdec9`  
**HEAD inspected:** `0f5363f` — `Merge pull request #332` (accepted-challenge HUD)  
**Prior director:** 2026-09-22 00:00 (`bc-6bace305-7113-4264-bdea-2cd083c125fc`, unmerged [#402](https://github.com/Mr-Melic/stralt/pull/402)). On `main` this file was still the 2026-09-02 text. Unmerged [#338](https://github.com/Mr-Melic/stralt/pull/338) is the 09-21 snapshot.  
**Gameplay / production code:** not modified.

This file is the living prioritized roadmap. ACTION_ID records for this run live in [`ACTION_IDS_2026-09-23.md`](./ACTION_IDS_2026-09-23.md). Do **not** append to `ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md`, or `ACTION_IDS_2026-09-22.md`. Process audit: [`QUALITY_AUDIT_2026-08-30.md`](./QUALITY_AUDIT_2026-08-30.md). Close **#338** and **#402** when this PR lands (MTD-2026-09-23-002).

## Evidence available this run

| Source | Status |
| :--- | :--- |
| `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/ARCHITECTURE.md` | Read |
| Prior director (2026-09-22) | Memories + #402 body. P0 leftovers **not** landed. Halt-as-config **failed**; halt-as-merge-stop **held**. Validation “≤3 new gameplay PRs from the 09-22 wave” **failed**. |
| Specialist reports on `main` | Still dated 2026-09-02 (plus orchestrator [`ACTION_IDS_2026-09-03-0000.md`](./ACTION_IDS_2026-09-03-0000.md)). 09-21/09-22 reports exist only on unmerged drafts. |
| Open ACTION_IDs | Hundreds still `NEW` across dated producer files. Reuse; do not mint twins. |
| Recent commits | `main` last moved 2026-09-03 00:28 UTC. **Zero** commits for **20 days**. HEAD still `0f5363f`. |
| Open drafts | **~116**, all draft: leftover **#327** (Striker) + **#331** (mapGen HOLD) + **#333–#391** (09-21 flock) + **#392–#446** (09-22 flock, which became gameplay) + this run. |
| Player telemetry | **Still none.** `longHorizonSim.telemetry.available === false`. TBC stays `WAITING_FOR_TELEMETRY`. Zero `recordTelemetry` in `src/backend`. |
| Same-hour flock (this minute) | **14** RUNNING at 00:01 UTC 2026-09-23, including combat parity `f37b7505` (**enabled**), persist/data-evolution `469b7020`, security `c97e5c0c`, expansion `3f31b18f` (**enabled**), AI `67b03c2f` (**enabled**), formations, world mechanics, perf `4191af8a` (**enabled**), UX, admin regression, enemy/boss admin, telemetry architecture, maintainability. Map guardian `9dcfd122` still **enabled**. `1aa41c6c` / `fe5b679a` / `996df6df` still not GetAutomation-visible. |

**Evidence classes used below**

| Class | Meaning |
| :--- | :--- |
| MEASURED PLAYER BEHAVIOUR | Live play counters. **None exist.** |
| DESIGN INTERPRETATION | Product rules in this prompt + `AGENTS.md` / `DESIGN.md` / specialist design docs |
| ENGINEERING EVIDENCE | Code on `0f5363f`, tests, ~116-draft queue, Caffeine `.old` still the 2026-08-31 no-GameKey signature |

Telemetry is not allowed to set priority. Correlation is not causation. No CLEAR_POSITIVE_SIGNAL is claimed.

---

## What changed since the 09-22 director run (24 hours)

The 09-22 run asked: halt the flock; do not merge-burst 59 leftover drafts; confirm Caffeine deploy; write the ADR; restack #327; close #338.

**What actually happened**

| Ask | Outcome |
| :--- | :--- |
| Halt 09-22 implementers | **Config failed.** Wave opened **#392–#446** (~55 new drafts) across 00:00 plus 06/08/12/15/16/18/21 crons. |
| ≤3 new gameplay PRs from 09-22 | **Failed.** Combat-parity, persist, mapGen, admin, shop, feel/UX, a11y, extracts, tests. |
| Humans merge the flock | **Did not.** `main` still `0f5363f`. Merge-stop held a **second** full day. |
| Merge director #338 / #402 | **Did not.** `main` still serves the 09-02 roadmap. |
| Caffeine deploy + `.old` refresh | **Unconfirmed.** `snapshots/deployed/` still four files; newest GameKey shape is `pr259-tail-20260901.most`. |
| ADR (AQA-008) | **Still missing** (`docs/**/*ADR*` = 0). Security is RUNNING again tonight. |
| Restack #327 | **Still open**, now **21 days** stale. Twin **#370** still open. |
| Hold #331 / four mapGen punches | **Held on `main`**, but 09-22 cloned **#428 / #430 / #436 / #444**. Eight open mapGen punches. |

**Integrity already on `main` (accept; do not re-open):** EOP later-file GameKey (#259/#311/#324), Frozen execute/AI MP (#313/#318), barrier A*, spawnPolicy (#287), Attack Nearest caster (#326), Life Drain no-heal (#315), one-shot/unseeded keep (#312/#330), Boss Rush victory feats (#319), accepted-challenge HUD (#332), Enemy Register lore (#328), AP/MP persist cap (#322), Caffeine import + stack-compat gates.

**09-22 leftovers that are NOT done:** flock halt, deploy confirmation, ADR, #327, landing helper, kit-zone number, ownership persist, occupants on `findPath`, GameKey × unpaid death **wiring**, mapGen freeze.

**Unique leftovers (keep; do not clone):**

| PR | Why unique | Director stance |
| :--- | :--- | :--- |
| **#327** | Striker aim-tile hole (400/800). Oldest. | Restack/merge (MTD-2026-09-21-003). |
| **#370** | Same hole **plus** AI kit-cast / summon. | HOLD until after #327; union unique delta only (MTD-2026-09-22-004). |
| **#391** | `gameKeyUnpaidDeath.ts` helper for MIMA-2026-09-02-003. Not wired. | After halt; then one import in redeem. |
| **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. **No new stables.** | After halt. Unique persist P1. |
| **#380** | Wisp `ctx.heal` fails no-heal (sibling of #315 Life Drain). | After halt. Isolated challenge honesty. |
| **#385** | Unpaid death-pending scoped to II principal. | After halt. Isolated persist honesty. |
| **#333** | TBC WAITING_FOR_TELEMETRY docs. | OK after P0 docs/index. |
| **#354** | Feats vs Achievements recap copy. | P3 display-only when WX is quiet. |
| **#338 / #402** | Prior director roadmaps. | **Close** — this file subsumes both. |

**Overlap / HOLD (09-21 leftovers plus 09-22 clones):**

- mapGen: **#331 #373 #378 #383 #428 #430 #436 #444**
- persist cluster: **#356 #375 #377 #387 #388 #408 #426 #431 #435 #439 #445**
- combat-parity WX: **#340 #379 #389 #417 #432 #440 #441 #443 #446** (plus tonight’s `f37b7505`)
- AdminDashboard: **#334 #341 #413 #415 #437**
- feel/UX/a11y/perf/extract: **#335 #350 #363 #364 #368 #369 #372 #376 #412 #421 #423 #425 #427 #429 #438**
- catalog docs: keep one discovery persist shape (SDA-002/004); do not author a fifth schema

---

## Seven-dimension evaluation

### 1. Correctness — official client safer; landing + kits + Striker still lie

ENGINEERING: Death replay, live Doka refs, ignore-client level, Frozen MP, barrier A*, GameKey replacing 60s auto-complete, later-file EOP. Do not open a sixth persist rewrite.

Recurring defect class: **teleport landing.** Swap (`WX` 9389–9402) still copies coordinates. Destack / unseal / controlled-summon walk still treat lava as ordinary floor. `applyHazardLanding` does not exist (glob = 0). Local Attack-Nearest / LoS patches are no longer the bottleneck.

Recurring defect class: **kit zone NaN.** `buildEnemyKit` takes a number (`enemyAI.ts` 194–199). Battle start still passes `currentMap.levelZone` (`WX` 11920). `currentZoneTier` is already a number (`WX` 4678–4680). **Fifth** director cycle.

Recurring defect class: **mapGen portal punch vs battle graph.** #110 → leftover islands → destack → relocate hostiles → punch adjacent floor → eight open drafts. Controlled intervention = one battle-graph policy helper + fixtures. Do **not** auto-refactor. Hold all eight punches.

Recurring defect class: **Striker victim tiles.** Aim-tile-only is the leftover unique P1 (#327). 09-21 then opened a twin-plus-AI (#370). Union once; stop cloning.

Recurring defect class: **EOP stables.** Source chain is correct. Remaining hole is **deploy confirmation**.

Recurring defect class: **unseeded wallet HUD.** 09-22 persist hunters opened one-shot / victory / GameKey hydrate twins (#431/#435/#439). That is “repeated patches on one subsystem.” Hold the cluster; do not sequential-merge.

### 2. Player experience — honesty up on `main`; identity still incomplete

ENGINEERING: Challenge HUD (#332), Enemy Register lore (#328), Buy Doka how-to (#316), leftover XP HUD, Pacifist preview. Do not re-implement.

DESIGN (no player data): live catalog on minute one; enemy-observed discovery **absent**; achievement/challenge/boss rewards are Doka/XP; four map modifiers announce-only; family HP multipliers die at `calcEnemyMaxHp`; Paper Windstorm still two live rates (RAO-2026-09-03-0000-003, HUMAN).

GameKey is a real PX/ops change in source. Live canister deploy is **unconfirmed**.

MEASURED: none. Do not claim spells are over/underused.

### 3. Technical health — hotspot + 116-draft queue + unconfirmed deploy

| Surface | Lines now | 09-22 director | Verdict |
| :--- | ---: | ---: | :--- |
| `WorldExploration.tsx` | 19,213 | 19,213 | Unchanged on `main`; 09-21/09-22 drafts want more branches |
| `AdminDashboard.tsx` | 8,280 | 8,280 | No publish pipeline. Admin drafts HOLD |
| `enemyAI.ts` | 2,580 | 2,580 | Frozen size; do not grow tonight |
| `main.mo` | 3,903 | 3,903 | Chain correct in source. #362 is behavior-only |
| `mapGen.ts` | 1,937 | 1,937 | Eight open punches; freeze badly broken |
| `progressPersist.ts` | 421 | 421 | Leave it |
| `targeting.ts` | 1,199 | 1,199 | Leave it |
| `deathPenalty.ts` | 597 | 597 | Leave it |
| `spawnPolicy.ts` | 297 | extracted | Leave it |
| `worldFeatures.ts` | 1,913 | tests-only | Do not wire tonight |

Caffeine import gates plus stack-compat plus populated EOP snapshots stay. `ARCHITECTURE.md` still says `check-limit = 4` (live `mops.toml` is 5) — docs drift, not a live bug.

Stale paths remain documented, not live bugs: `dfx.json` → missing `src/backend_extended`; root `declarations/` 15-field snapshot; unused `src/backend/mixins/*`.

### 4. Content depth — over-specified, under-wired, catalog mill on a third consecutive midnight

Present on `main`: player-relative tier spawn, AI tiers 1–10, named boss kits, dungeon chain, Boss Rush, 9 challenges, feats, frontend catalog + GameKey shop.

Dead or contradictory vs core rules:

- `buildEnemyKit(..., currentMap.levelZone)` still passes an **object** → zone-0 kits forever.
- Summoner chance `0.12 + playerLevel * 0.02` saturates by the mid-40s.
- `pickEnemyLevelFromTiers` `maxTier = floor(999 / tierSize)` stops climbing.
- `computeAITier` still has a **30% fully random 1–10** roll (`combatMath.ts` 48–50).
- Dual spell catalogs. Admin adding a catalog spell still grants it to every player on hydrate (`adminSafety.ts` 712–718).
- `worldFeatures.ts` (1,913 lines) still tests-only; no WX import.
- `ENEMY_AI_TIER_GATES` names still unused in `enemyAI.ts`.
- `combinedMechanic` (Boss Rush pairs) still unused at execute.

09-21 and 09-22 specialists produced overlapping catalog waves (SDA, SDE, EBA, AI, formations, elite, world, encounter, visual, boss, expansion, telemetry). That is **expansion overlap**. Default **hold** implementation. 09-23 designers are already RUNNING (expansion, AI, formations, world, enemy/boss admin).

### 5. Long-term scalability — rules vs implementation

| Core rule | Implementation on `0f5363f` |
| :--- | :--- |
| No character level cap | Yes (`applyRewards` Nat loop). HUD saturates at 48 (`LHIPS-2026-09-01-001`). Persist AP/MP hard-cap 20 is a silent growth freeze (SDEG-2026-09-21-003, HUMAN — do not raise in this flock). |
| Increasing XP | Yes `100 * 2^(N-1)`. Practical wall ~level 15–22 on kill XP (DESIGN, not a tonight bug). |
| Player-relative enemies | Yes until the 999-tier ceiling (PREREQ-B). |
| Progressively sophisticated enemies | Partial; 30% random tier + zone-0 kits undermine it. |
| Dynamic enemy spell pools | Boss phases yes; overworld = static piece kits stuck at zone 0. |
| Enemy-observed spell discovery | **Absent** |
| Achievement / challenge / boss spell unlocks | Rewards are Doka/XP |
| Backend-authoritative persistence | Wallet/XP/death yes (clamped; level pinned). Combat client-side. Achievement unlock still client-asserted. BuffShop potions still `${principal}_inventory`. GameKey redeem authoritative **in source**; live deploy unconfirmed. |
| Optional owner-uploaded visuals + pixel fallback | Still true. Do not make URLs required. |
| Admin Draft → Validate → Activate | **Not a canister workflow.** Local React drafts + retire-via-`usableByPlayer` remain. |

Expansion that adds spells, AI behaviors, or admin chrome **before** Caffeine deploy confirmation, landing-authority extraction, and a reward-trust ADR will not scale.

### 6. Data / persistence safety — official client safer; deploy is the remaining P0

`saveBattleStats` may still **lower** Doka/XP (required for heals/spends/death). It must not raise them. Finding 3 is stale if phrased as “must not write Doka.” Client level cannot demote. AP/MP capped (#322).

`applyRewards` is still client-trusted **within** 100k/500k. Custom clients can still drip-mint. `calculateAndAwardDoka` remains an unused public mint. `markAchievementUnlocked` is still unproven. `useSaveKillCount` still has no TSX caller.

Wallet seeding / idle-hydrate / unpaid death replay / one-shot keep remain load-bearing. Do not invent a second persist path for telemetry or discovery grants. `redeemGameKeyThroughPersist` (`shopPurchase.ts` 294–331) already uses the lock — leave that shape; add unpaid-death honour as the #391 helper, not a new lock.

New stables still require a **new later** file after `20260901`. Never amend `20260831` / `20260901` `NewActor`. #362 does not add stables — still HOLD until triage. Tonight’s persist/data-evolution agent is RUNNING again.

### 7. Automation coherence — P0; merge-stop held 20 days, config failed a sixth midnight

AQA-001…012 were written 08-30 19:00. The 08-31 / 09-01 / 09-02 waves ignored them and humans merged. Then `main` froze — the only halt that worked.

09-21 cron opened **59** PRs. 09-22 cron opened **~55 more**. Humans did **not** merge them. That is a **partial** win: the queue is now the risk. 09-02 showed what happens when that queue is merged in 30 hours.

09-23 00:00 relaunched combat parity, persist, security, expansion, AI, and the map guardian against a **116-draft** queue. Cursor Cloud has **no write API** for dashboard prompts. Halt is a human config action. In-repo gates are the enforceable half.

| AQA / MTD ID | Director status 2026-09-23 |
| :--- | :--- |
| AQA-001 hunter throttle | **OPEN** — `996df6df` still not GetAutomation-visible. |
| AQA-002 one critical hunter | **OPEN** — `1aa41c6c` still not GetAutomation-visible this run (prior runs: enabled). Volume problem remains the rest of the flock. |
| AQA-003 in-repo ACTION_ID ledger | **PARTIAL** — 09-02 file clean; 09-21/09-22 ledgers never reached `main`. This run writes 09-23 only and unions the prior files. |
| AQA-004 don’t merge the 08-30 stack | **SUPERSEDED** — accept `main`. |
| AQA-005 test clone mill | **PARTIAL** — #358/#381/#390/#409/#433/#442. |
| AQA-006 no mapGen implementation | **BROKEN** — eight open punches. Guardian `9dcfd122` enabled. |
| AQA-007 freeze drive-by WX | **BROKEN** — combat parity RUNNING again; nine open WX drafts. |
| AQA-008 security → ADR | **PARTIAL** — clamps on `main`; no ADR. #368 is not the ADR. Security RUNNING tonight. |
| AQA-009 orchestrator must not implement gameplay | **PARTIAL** — leftover isolated helpers (#376/#386/#391/#438). Acceptable if they stay helper-shaped. |
| AQA-010 persist/economy dedup | **PARTIAL** — cluster landed on `main`; 09-21/09-22 opened another persist pile. |
| AQA-011 prompts vs live architecture | **OPEN** |
| AQA-012 outcome telemetry | **OPEN** — dashboard/architecture drafts with nothing to display. Telemetry architecture RUNNING tonight. |
| MTD-001 flock halt | **OPEN** — merge-stop held 20 days; config failed 08-31, 09-01, 09-02, 09-21, 09-22, **09-23**. |
| MTD-2026-09-21-002 | **OPEN** — confirm Caffeine deploy + refresh `.old`. |
| MTD-2026-09-22-001 | **SUPERSEDED** — 09-22 wave already happened; validation failed. |
| MTD-2026-09-22-002 | **OPEN** — close #338; this PR also closes #402. |
| MTD-2026-09-22-003 | **OPEN** — leftover queue grew 59 → **~116**. |
| MTD-2026-09-23-001 | **NEW** — hold the 09-23 00:00 wave. |
| MTD-2026-09-23-002 | **NEW** — close #338 and #402; this file is the index. |
| MTD-2026-09-23-003 | **NEW** — do not merge-burst 116 drafts. |
| MTD-2026-09-23-004 | **NEW** — hold the 09-22 mapGen/persist/combat clone mill. |

---

## Recurring hotspots — local patches no longer sufficient

Do **not** automatically perform a large refactor.

1. **EOP / frozen NewActor** — source chain is correct. Remaining work is **ops**: confirm Caffeine import of HEAD, then refresh `.old` + add `snapshots/deployed/` from that build.
2. **Landing / occupancy / hazard authority** — Swap + summon-walk hazards + destack/unseal need **`applyHazardLanding`**, not more WX branches. After flock halt.
3. **Kit-zone number** (PREREQ-A) — pass `currentZoneTier` into `buildEnemyKit`. One call site. Wait until the flock is held.
4. **mapGen portal-punch vs battle graph** — nine punches on `main` plus **eight** open drafts. One policy helper + seed fixtures. Hold further punches.
5. **Striker victim-tile authority** — #327 then #370. One helper, two PRs. Union once.
6. **Unseeded / in-flight wallet HUD** — #330 closed the keep; 09-22 opened four more twins. Stop patching `progressPersist` callers in parallel.
7. **Canister trust** — write the ADR (AQA-008). Until it exists, no new credit APIs and no discovery grant writer.
8. **Automation flock + leftover queue** — one critical hunter; report-only on cron restart; **do not merge 70+ leftover gameplay drafts to clear the button.** This is still the binding constraint.

HP/death extraction (MTD-003) is still valid. Do not start it in the same hour as the flock.

---

## Human merge queue (do not autonmerge)

| Order | PR | Action |
| :--- | :--- | :--- |
| 1 | **This docs PR** | Living roadmap + `ACTION_IDS_2026-09-23.md`. Close **#338** and **#402** (same living files, stale snapshots). |
| 2 | **#327** | Unique P1 Striker splash/bounce. Oldest gameplay PR. Restack onto `origin/main`. |
| 3 | **#333** | TBC WAITING docs. Unique, aligned with AQA-012. |
| 4 | **#391** | GameKey unpaid-death **helper** (new file). After halt. Then wire redeem when `shopPurchase.ts` is free. |
| 5 | **#362** | Unbounded GameKey serial + `saveActiveSpells` keep-store. No new stables. After halt. |
| 6 | **#380** | Wisp heal fails no-heal. Isolated. After halt. |
| — | **#370** | HOLD until #327. Union unique AI/summon delta only. |
| — | **#331 #373 #378 #383 #428 #430 #436 #444** | **Hold.** mapGen portal-graph. AQA-006 / MTD-2026-09-23-004. |
| — | **#356 #375 #377 #387 #388 #408 #426 #431 #435 #439 #445** | **Hold.** Persist cluster. Do not sequential-merge. |
| — | Combat-parity / AdminDashboard / feel / UX / a11y / perf / extract | Default **hold** this cycle. Pick later only if still unique after #327. |
| — | Docs catalogs from 09-21/09-22 | OK **after** P0/P1 if they do not rewrite SDA/SDE/EBA schemas or retune BAL-*. |
| — | Any later PR from the 09-23 00:00 wave | Default **hold** if gameplay. Especially mapGen, targeting, persist, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX. |
| — | Motoko PRs that add persistent `let`/`var` | **Hold** until Caffeine deploy of the 20260901 tail is confirmed and `.old` refreshed. |

Do not restack death-replay, `writeLiveDoka`, `writeLevel`, leftover-XP HUD, Frozen MP helpers, spawnPolicy, GameKey product methods, or the EOP chain.

---

## Prioritized roadmap (what to work next)

**P0 — do these before any expansion PR merges**

1. Halt the 09-23 same-hour implementer flock (MTD-2026-08-31-001, MTD-2026-09-23-001).
2. Triage the 116-draft leftover queue — do not merge-burst (MTD-2026-09-23-003 / 004). Close #338 and #402 (MTD-2026-09-23-002).
3. Confirm Caffeine GitHub→import of current HEAD and refresh `.old` + `snapshots/deployed/` (MTD-2026-09-21-002). Freeze new Motoko stables until that lands.
4. Write the reward-trust ADR (AQA-008). Finding 3 = unbounded/absolute misuse, not “Doka write is a bug.”

**P1 — infrastructure / gameplay integrity**

5. Restack and merge leftover **#327** (Striker AoE). Then union **#370**’s unique AI/summon delta (MTD-2026-09-21-003 / MTD-2026-09-22-004).
6. Re-freeze `mapGen.ts`, `targeting.ts`, `enemyAI.ts`, and WX drive-bys (AQA-006, AQA-007). Hold all eight mapGen punches.
7. Extract `applyHazardLanding` for Swap + controlled-summon walk + destack (MIMA-001 + MIMA-002 remainder).
8. Honour unpaid death 20/40 on GameKey redeem — merge #391 helper, then one redeem import (MIMA-2026-09-02-003).
9. Battle `findPath` occupants (MIMA-2026-09-01-002 remainder). Barriers already share `isBattleWalkTileBlocked`.
10. Controlled HP/death extraction (MTD-2026-08-31-003) **after** landing helpers — not tonight.

**P2 — high-value expansion (after P0/P1, not this hour)**

11. Outcome counters, then maybe a dashboard (AQA-012 before TADD UI).
12. Fix kit-zone call site (Expansion PREREQ-A) — pass `currentZoneTier` **number**.
13. Enemy-observed spell discovery + ownership maps (SDA-002/003/004). New later migration after deploy confirmation.
14. Admin Draft → Validate → Activate on the canister (SDA-005 / MTD-006). Do not grow the 8.3k dashboard first.
15. Seed frontend starter ids; stop treating `usableByPlayer` as ownership (SDA-007).
16. Revisit `computeAITier` 30% random vs progressive sophistication (MTD-008). Report/design, not an `enemyAI.ts` rewrite.
17. Wire `saveKillCount` or drop it from the leaderboard (MTD-005).
18. BuffShop `buffInventories` vs `${principal}_inventory` (SDEG-005) — after persist quiet.
19. Unify Paper Windstorm to one rate (RAO-2026-09-03-0000-003) — HUMAN; changes fight outcomes.
20. Persist AP/MP cap 20 vs unbounded formula (SDEG-2026-09-21-003) — HUMAN; do not raise in this flock.

**P3 — polish**

21. Recap / HUD leftovers already shipped — do not restack. #354 Feats copy is display-only when WX is quiet.
22. Visual / game-feel / mobile — DESIGN.md already specifies the look. Do not edit combat math or WX for feel this hour.
23. Dead-code / maintainability — report only while hunters are hot.

---

## Contradictions and duplicates (do not re-litigate)

| Conflict | Resolution |
| :--- | :--- |
| Security “don’t write Doka from `saveBattleStats`” vs ARCHITECTURE | Write stays; **clamp / no-mint**. ADR still required. |
| Solvability vs `AGENTS.md` mapGen | #110 plus later punches already merged; **freeze**; hold all eight open punches. |
| AQA-004 vs human merge of 08-30…09-03 stacks | Accept `main`; clean leftovers; do not re-open merged themes. |
| Frozen preview vs execute | Execute now uses `battleWalkMpCost`. Do not re-file 09-01-001. |
| #327 vs #370 Striker | One helper. Oldest #327 first; #370 unique AI/summon only. |
| Progressive AI vs 30% random tier | Design decision later; no first-hour AI PR. |
| SDA vs SDE vs SPELL_DISCOVERY vs EBA vs BOSS docs | One discovery persist shape (SDA-002/004). Others are content cards. |
| Expansion specialists vs “P0/P1 first” | 09-21 leftover catalogs + 09-22/09-23 waves are the violation. Hold implementation. |
| Telemetry dashboard vs no counters | AQA-012 first. TBC stays WAITING_FOR_TELEMETRY. |
| Empty/Aug-31 `.old` vs live Caffeine | `.old` is the **real** Aug-31 signature (no GameKey). Import of HEAD should pass. Deploy still unconfirmed. |
| GameKey on `main` vs canister | Source is ahead of confirmed deploy. Do not revert GameKey product. |
| `usableByPlayer=false` as retire vs enemy-only gate | SDA-2026-09-01-001; do not extend the flag. |
| Family HP paper vs `calcEnemyMaxHp` | PREREQ-H; honesty bug; not an AI rewrite. |
| 20-day freeze vs “halt failed” | Halt failed as **config**. It succeeded as **human merge stop**. Cron restart without dashboard change undoes the config half; merging the leftover queue undoes the merge-stop half. |
| #338 / #402 vs this PR | This file subsumes both. Close #338 and #402. |
| 09-22 persist HUD twins (#431/#435/#439) vs #330 keep | #330 is on `main`. Hold the twins; do not open a fourth keep path. |

---

## TOP 5 CURRENT PRIORITIES

1. **Halt the 09-23 00:00 implementer flock** and **do not merge-burst the ~116 leftover drafts**. First-run and expansion specialists: ACTION_IDs only. Especially hold mapGen, persist, targeting, `enemyAI`, AdminDashboard, `main.mo` stables, telemetry UI, WX.
2. **Confirm Caffeine deploy of the 20260901 GameKey tail** and refresh `.old` from that build (MTD-2026-09-21-002). Source is ready; ops is not proven.
3. **Reward-trust ADR (AQA-008)** — clamps, ignore-client level, and AP/MP cap landed; the written decision did not.
4. **Restack + merge leftover #327** (Striker AoE/bounce). Unique P1. Then union #370’s AI/summon delta only. Then **re-freeze WX / mapGen**.
5. **Close #338 and #402** when this living roadmap lands, so the next wave plans against 09-23 facts instead of the 09-02 index still on `main`.

## BLOCKED WORK

- Spell discovery / observed enemy kits / new unlock loops — no ownership persist, combat landing still racing, ADR unwritten, Caffeine deploy of GameKey unconfirmed.
- Enemy AI capability expansion — `enemyAI.ts` already 2,580 lines; kits never leave zone 0; HP/death still dual-written.
- Telemetry admin dashboard — no counters to display (AQA-012). Balance analyst correctly idle if it stays WAITING_FOR_TELEMETRY.
- Any Motoko PR that adds stables until deploy is confirmed and `.old` refreshed.
- Further `mapGen.ts` punches (eight open drafts and tonight’s Guardian) without an explicit human playtest of the #321→#329 sequence.
- Custom-client mint proofs / new credit APIs until the ADR exists.
- `calculateAndAwardDoka` productization (unused official path; still a sink).
- Formula-level `BAL-*` / `LHIPS-*` retunes (no telemetry; jackpot 100k clamp is architecture).
- Admin Draft→Validate→Activate chrome on the 8.3k dashboard before canister lifecycle exists.
- Sequential merge of the 70+ leftover gameplay drafts “to clear the queue.”

## SAFE EXPANSION WORK

- Land this docs PR; close #338 and #402.
- Restack/merge #327 (scoped Striker helper + tests). Do not duplicate it in #370 until unioned.
- Adopt per-producer ledgers + this director index (AQA-003) — process, not gameplay.
- Design-only (no PR): keep SDA/SDE/EBA catalogs; do not author a fifth discovery schema.
- Query-only / persist-lock-enqueued counters (AQA-012) — **design + tiny isolated PR after flock halt**, not a dashboard.
- Kit-zone number fix (PREREQ-A) **after** the flock is held — one call site + `enemyAI` test, no WX growth.
- Display-only unique copy if orchestrator finds one hole not already on `main` or drafted (#354 Feats copy).
- Merge #391 helper (new file) after halt — does not touch WX / mapGen / persist lock.

## AREAS TO STOP TOUCHING TEMPORARILY

- `src/frontend/src/components/WorldExploration.tsx` except one-line helper wiring
- `src/frontend/src/engine/mapGen.ts` (including all eight open punches)
- RAF loop, turn-order math, damage formulas (`AGENTS.md`)
- `src/frontend/src/utils/progressPersist.ts` (leave the lock)
- `src/frontend/src/utils/deathPenalty.ts` (cluster closed)
- `src/frontend/src/engine/targeting.ts`
- `src/frontend/src/engine/enemyAI.ts`
- `src/frontend/src/engine/spawnPolicy.ts` (just extracted)
- `src/frontend/src/engine/battleWalkMp.ts` / `enemyWalkMp.ts` (just landed)
- `src/frontend/src/components/AdminDashboard.tsx`
- `src/backend/main.mo` persistent fields until deploy confirmation
- Frozen chain files `20260831_000000.mo` / `20260901_000000.mo`
- `docs/automation/ACTION_IDS_2026-08-31.md`, `ACTION_IDS_2026-09-01.md`, `ACTION_IDS_2026-09-02.md`, `ACTION_IDS_2026-09-21.md`, `ACTION_IDS_2026-09-22.md` (do not append)
- GameKey product methods except unpaid-death honour on the existing redeem helper

## ARCHITECTURAL HOTSPOTS

1. Unconfirmed Caffeine deploy vs correct-in-source EOP chain (`20260901` GameKey; `.old` still Aug-31)
2. Dual HP / death / landing authority (React snapshot vs `combatantsRef` vs Swap/summon/destack teleport)
3. Client-trusted `applyRewards` without a written ADR (clamps exist; decision does not)
4. 19k-line world orchestrator absorbing every hunter (still the magnet; leftover drafts wait to grow it)
5. Automation pile-on (~116 leftover drafts + 09-23 restart) — merge-stop held 20 days, config failed a sixth midnight
6. mapGen portal-punch / battle-graph (nine punches on `main`; eight open drafts)
7. Dual spell catalogs + implicit ownership (blocks discovery)
8. Kit-zone object call site (dynamic pools implemented and dead; number already in `currentZoneTier`)
9. Striker victim-tile authority split across #327 and #370
10. Unseeded-wallet HUD twins (#431/#435/#439) on top of the #330 keep

## TELEMETRY SIGNALS WORTH INVESTIGATING

**None can be investigated in production — the series do not exist.**

When AQA-012 lands, investigate in this order (engineering + design, not telemetry-alone priority):

1. persist-ok vs persist-fail and death-penalty-applied vs victory-paid vs **single-axis-credit-then-death** (integrity; #183/#256/#330 class — measure whether the hole is closed, do not assume)
2. GameKey request vs approve vs redeem vs redeem-fail (ops; new funnel; do not treat 0 rows as “players don’t buy”)
3. recap opened vs dismissed vs lava-death-during-recap (PX; input gate may have closed — measure)
4. spell-cast counts **by acquisition path** (starter vs unlocked vs observed) — a “weak” spell may be undiscovered, not weak. Today every catalog id is treated as owned, so this series would be **meaningless** until SDA-002.
5. Attack Nearest vs aimed-cast ratio (gate confusion vs power)
6. challenge accept vs complete vs advertised-reward-missing vs **Striker splash/bounce beyond 2** (#327 — if complete rate is high on Nova/Chain, DESIGN INTERPRETATION is the aim-tile hole, not player skill)
7. Swap / summon-walk / destack onto hazards vs walk onto the same tile (MIMA-001 remainder — if “Untouchable complete rate” is high, DESIGN INTERPRETATION is skip-landing, not player skill)
8. Frozen/Slime maps: tiles walked vs preview budget (09-01-001 is closed in source — measure whether leftover-1-MP walks remain)
9. unseeded-lock HUD vs committed Doka after one-shot / GameKey / feat (09-22 persist twins — if wallet “resets,” ENGINEERING is hydrate, not player spend)

Until those exist: automations must not claim CLEAR_POSITIVE_SIGNAL or “players don’t use X.” Distinguish MEASURED PLAYER BEHAVIOUR (none) from DESIGN INTERPRETATION and ENGINEERING EVIDENCE.
